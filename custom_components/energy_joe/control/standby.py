"""Power hogs at night and while nobody is home (the "Stromfresser" page).

Joe looks for switches with a power reading (smart plugs, see
discovery/standby.py), measures what each draws at night and while nobody is
home, and tells what switching it off would save a year. Nothing is switched
until the owner chooses it for a device: off at night, off while nobody is
home, or both.

Night is the same as for the air conditioners: each device's own times, or
the entity that is on while people are in bed (Haushalt › Nachtruhe). Nobody
home is Joe's one helper "someone is home" (with the guest mode in it), after
the same delay as for the heating.

Joe only switches off what is on, and switches on again exactly what he
switched off – in the morning, or when somebody comes home. A device the owner
switched on in between is his: Joe leaves it until the next night or absence.
In the simulation Joe only says what he would do; he switches in "live".
"""

from __future__ import annotations

import asyncio
from collections.abc import Callable
from datetime import UTC, date, datetime, time, timedelta
import logging
from statistics import median
from typing import Any

from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant, State, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_interval,
)
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from ..const import DOMAIN
from ..discovery.snapshot import async_collect
from ..discovery.standby import find_standby
from ..plan.prices import to_per_kwh
from .climate import AWAY_AFTER_MIN, HOME_STATES, NIGHT_STATES, UNAVAILABLE
from .writes import Write, WriteError, async_apply

_LOGGER = logging.getLogger(__name__)

STORE_KEY = f"{DOMAIN}.standby"
STORE_VERSION = 1
CHECK = timedelta(minutes=1)
LOG_SIZE = 50
# What the owner may choose per device.
CHOICES = ("never", "night", "away", "both")
NIGHT_FROM = "23:00"
NIGHT_UNTIL = "06:30"
# The hours (local, start of the hour) that count as the deep night when
# measuring: 1 to 5 o'clock, when hardly anything runs on purpose.
NIGHT_HOURS = (1, 2, 3, 4)
# How far back Joe looks (days), and how long a measurement holds.
DAYS = 14
MEASURE_EVERY = timedelta(hours=6)
# Devices drawing less than this (W) are not worth a line.
MIN_W = 3.0
# A price per kWh when the tariff does not say.
ASSUMED_PRICE = 0.30

# Joe's words in the logbook.
WORDS = {
    "de": {
        "off": "{name} aus: {why}",
        "on": "{name} wieder an: {why}",
        "saves": " (spart ca. {watts} W)",
        "night": "nachts",
        "away": "niemand zu Hause",
        "morning": "morgens",
        "home": "jemand ist heimgekommen",
        "stopped": "Joe schaltet es nicht mehr",
    },
    "en": {
        "off": "{name} off: {why}",
        "on": "{name} back on: {why}",
        "saves": " (saves about {watts} W)",
        "night": "at night",
        "away": "nobody home",
        "morning": "in the morning",
        "home": "somebody came home",
        "stopped": "Joe no longer switches it",
    },
}


def clock(text: str | None, fallback: str) -> time:
    hour, _, minute = (text or fallback).partition(":")
    return time(int(hour), int(minute or 0))


def night_span(device: dict[str, Any]) -> float:
    """Hours of a device's night (from its times)."""
    start = clock(device.get("night_from"), NIGHT_FROM)
    end = clock(device.get("night_until"), NIGHT_UNTIL)
    minutes = (end.hour * 60 + end.minute) - (start.hour * 60 + start.minute)
    return (minutes % (24 * 60)) / 60


def in_window(moment: datetime, device: dict[str, Any]) -> bool:
    """Whether a local time lies within a device's night times."""
    start = clock(device.get("night_from"), NIGHT_FROM)
    end = clock(device.get("night_until"), NIGHT_UNTIL)
    now = moment.time()
    if start <= end:
        return start <= now < end
    return now >= start or now < end


# --- measuring ---------------------------------------------------------------


def hourly(rows: list[dict[str, Any]]) -> dict[datetime, float]:
    """Hourly statistic rows (mean, W) by the local start of their hour."""
    series: dict[datetime, float] = {}
    for row in rows:
        mean, start = row.get("mean"), row.get("start")
        if not isinstance(mean, int | float):
            continue
        if isinstance(start, int | float):
            start = datetime.fromtimestamp(start, UTC)
        if not isinstance(start, datetime):
            continue
        series[dt_util.as_local(start)] = float(mean)
    return series


def night_watts(
    series: dict[datetime, float], nights: int = DAYS
) -> tuple[float | None, int]:
    """The typical draw in the deep night: each night's mean of 1 to 5
    o'clock, the median of the last nights (and how many there were)."""
    by_night: dict[date, list[float]] = {}
    for start, value in series.items():
        if start.hour in NIGHT_HOURS:
            by_night.setdefault(start.date(), []).append(value)
    means = [sum(v) / len(v) for _, v in sorted(by_night.items())[-nights:]]
    if not means:
        return None, 0
    return round(median(means), 1), len(means)


def away_intervals(
    states: list[tuple[datetime, str]], end: datetime
) -> list[tuple[datetime, datetime]]:
    """Spans with nobody home, from the helper's history (oldest first; an
    unknown state ends a span)."""
    spans: list[tuple[datetime, datetime]] = []
    begin: datetime | None = None
    for moment, value in states:
        away = value not in HOME_STATES and value not in UNAVAILABLE
        if away and begin is None:
            begin = moment
        elif not away and begin is not None:
            spans.append((begin, moment))
            begin = None
    if begin is not None:
        spans.append((begin, end))
    return spans


def away_hours(spans: list[tuple[datetime, datetime]]) -> list[datetime]:
    """Whole hours (local start) within a span with nobody home."""
    hours: list[datetime] = []
    for begin, end in spans:
        first = dt_util.as_utc(begin)
        hour = first.replace(minute=0, second=0, microsecond=0)
        if hour < first:
            hour += timedelta(hours=1)
        while hour + timedelta(hours=1) <= dt_util.as_utc(end):
            hours.append(dt_util.as_local(hour))
            hour += timedelta(hours=1)
    return hours


def away_watts(
    series: dict[datetime, float], hours: list[datetime]
) -> tuple[float | None, int]:
    """The typical draw while nobody is home: the median of those hours."""
    values = [series[hour] for hour in hours if hour in series]
    if not values:
        return None, 0
    return round(median(values), 1), len(values)


def yearly(
    device: dict[str, Any],
    night_w: float | None,
    away_w: float | None,
    hours: list[datetime],
    days: float,
    prices: dict[str, Any],
) -> dict[str, dict[str, float | None]]:
    """kWh and money a year for each choice: night (the device's night
    times), away (as often as nobody was home lately) and both (the hours
    away outside the night on top)."""
    per_day = len(hours) / days if days > 0 else 0.0
    outside = (
        sum(1 for hour in hours if not in_window(hour, device)) / days
        if days > 0
        else 0.0
    )
    night = night_w * night_span(device) * 365 / 1000 if night_w is not None else None
    away = away_w * per_day * 365 / 1000 if away_w is not None and hours else None
    extra = away_w * outside * 365 / 1000 if away_w is not None and hours else None
    kwh = {
        "night": night,
        "away": away,
        "both": None
        if night is None and extra is None
        else (night or 0.0) + (extra or 0.0),
    }
    eur = {
        "night": night * prices["night"] if night is not None else None,
        "away": away * prices["day"] if away is not None else None,
        "both": None
        if kwh["both"] is None
        else (night or 0.0) * prices["night"] + (extra or 0.0) * prices["day"],
    }
    return {
        "kwh": {k: round(v, 1) if v is not None else None for k, v in kwh.items()},
        "eur": {k: round(v, 2) if v is not None else None for k, v in eur.items()},
    }


def prices(hass: HomeAssistant, tariff: dict[str, Any]) -> dict[str, Any]:
    """The price per kWh at night and by day from Joe's tariff (a dynamic
    tariff: its price now; nothing known: an assumed one)."""
    night, day = tariff.get("night_price"), tariff.get("day_price")
    kind = tariff.get("kind")
    if kind == "dynamic" and (entity := tariff.get("price_entity")):
        state = hass.states.get(entity)
        try:
            value = to_per_kwh(
                float(state.state), state.attributes.get("unit_of_measurement")
            )
        except AttributeError, TypeError, ValueError:
            value = None
        if value is not None:
            value += tariff.get("surcharge") or 0.0
            return {"night": value, "day": value, "assumed": False}
    if kind != "fixed_window":
        night = day if day is not None else night
    day = day if day is not None else night
    night = night if night is not None else day
    if day is None:
        return {"night": ASSUMED_PRICE, "day": ASSUMED_PRICE, "assumed": True}
    return {"night": night, "day": day, "assumed": False}


async def async_power_history(
    hass: HomeAssistant, entities: set[str], start: datetime, end: datetime
) -> dict[str, dict[datetime, float]]:
    """Each power reading's hourly means (W) from the recorder's statistics."""
    if not entities or "recorder" not in hass.config.components:
        return {}
    from homeassistant.components.recorder import get_instance  # noqa: PLC0415
    from homeassistant.components.recorder.statistics import (  # noqa: PLC0415
        statistics_during_period,
    )

    stats = await get_instance(hass).async_add_executor_job(
        statistics_during_period,
        hass,
        start,
        end,
        entities,
        "hour",
        {"power": "W"},
        {"mean"},
    )
    return {entity: hourly(rows) for entity, rows in stats.items()}


async def async_presence_history(
    hass: HomeAssistant, entity_id: str | None, start: datetime, end: datetime
) -> list[tuple[datetime, str]]:
    """The helper's states since start (oldest first)."""
    if not entity_id or "recorder" not in hass.config.components:
        return []
    from homeassistant.components.recorder import get_instance, history  # noqa: PLC0415

    found = await get_instance(hass).async_add_executor_job(
        history.state_changes_during_period,
        hass,
        start,
        end,
        entity_id,
        True,
        False,
        None,
        True,
    )
    return [
        (max(state.last_changed, start), state.state)
        for state in found.get(entity_id) or []
    ]


# --- the controller ----------------------------------------------------------


class StandbyController:
    """Switches the chosen devices off at night or while nobody is home."""

    def __init__(
        self,
        hass: HomeAssistant,
        config: Callable[[], dict[str, Any]],
        mode: Callable[[], str],
        changed: Callable[[], None],
        language: Callable[[], str | None] | None = None,
    ) -> None:
        self._hass = hass
        self._config = config
        self._mode = mode
        self._changed = changed
        self._language = language
        self._store: Store[dict[str, Any]] = Store(hass, STORE_VERSION, STORE_KEY)
        self.data: dict[str, Any] = {
            # entity -> {"at", "causes", "watts", "episode"}: switched off by Joe.
            "off": {},
            # entity -> the episode (night, absence) the owner took it back in.
            "declined": {},
            # Since when nobody is home (ISO).
            "nobody_since": None,
            # Since when the entity of the Nachtruhe is on (ISO): HA sets
            # last_changed anew on a restart, so Joe keeps it himself.
            "night_since": None,
            # entity -> what Joe measured before he switched it (see async_devices).
            "measured": {},
            "log": [],
        }
        self.status: dict[str, Any] = {}
        self._unsubs: list[CALLBACK_TYPE] = []
        self._lock = asyncio.Lock()
        # Switches seen going on by somebody else while Joe held them off.
        self._by_owner: set[str] = set()
        # Nobody home as last known (the helper unavailable: as before).
        self._away = False
        self._found: dict[str, Any] | None = None
        self._found_at: datetime | None = None

    async def async_load(self) -> None:
        stored = await self._store.async_load() or {}
        self.data.update({k: stored.get(k, v) for k, v in self.data.items()})

    async def async_remove(self, give_back: bool = True) -> None:
        """Everything Joe switched off goes on again, then the store goes."""
        if give_back:
            await self.async_load()
            await self.async_give_back()
        await self._store.async_remove()

    async def async_give_back(self) -> None:
        """Switch on again what Joe switched off (Joe is removed or reset)."""
        async with self._lock:
            for entity_id in list(self.data["off"]):
                await self._async_back(entity_id, "stopped")
            await self._store.async_save(self.data)

    def _devices(self) -> dict[str, dict[str, Any]]:
        return (self._config().get("standby") or {}).get("devices") or {}

    @callback
    def async_start(self) -> None:
        self.async_stop()
        self._unsubs.append(async_track_time_interval(self._hass, self._tick, CHECK))
        watched = [
            entity_id
            for entity_id, device in self._devices().items()
            if device.get("when", "never") != "never"
        ]
        watched.extend(e for e in self.data["off"] if e not in watched)
        context = self._config().get("context") or {}
        if presence := context.get("presence_entity"):
            watched.append(presence)
        if night := self._night_entity():
            watched.append(night)
        if watched:
            self._unsubs.append(
                async_track_state_change_event(self._hass, watched, self._on_change)
            )
        self._hass.async_create_task(self.async_check(), eager_start=False)

    @callback
    def async_stop(self) -> None:
        for unsub in self._unsubs:
            unsub()
        self._unsubs = []

    @callback
    def _tick(self, now: datetime) -> None:
        self._hass.async_create_task(self.async_check(), eager_start=False)

    @callback
    def _on_change(self, event: Event) -> None:
        entity_id = event.data.get("entity_id")
        old, new = event.data.get("old_state"), event.data.get("new_state")
        if (
            entity_id in self.data["off"]
            and new is not None
            and new.state == "on"
            and (old is None or old.state != "on")
        ):
            self._by_owner.add(entity_id)
        self._hass.async_create_task(self.async_check(), eager_start=False)

    # --- when -------------------------------------------------------------------

    def _night_entity(self) -> str | None:
        settings = self._config().get("climate") or {}
        if settings.get("night_by") == "entity":
            return settings.get("night_entity")
        return None

    def _night(self, device: dict[str, Any], now: datetime) -> str | None:
        """The night a device is in (a key that names it), or None.

        With the entity of the Nachtruhe: while it is on, but no longer once
        the device's morning time passed since (nobody switched it off).
        """
        local = dt_util.as_local(now)
        morning = clock(device.get("night_until"), NIGHT_UNTIL)
        if entity := self._night_entity():
            state = self._hass.states.get(entity)
            if state is None or state.state not in NIGHT_STATES:
                self.data["night_since"] = None
                return None
            if not self.data["night_since"]:
                self.data["night_since"] = state.last_changed.isoformat(
                    timespec="seconds"
                )
            since = dt_util.as_local(datetime.fromisoformat(self.data["night_since"]))
            end = datetime.combine(since.date(), morning, since.tzinfo)
            if end <= since:
                end += timedelta(days=1)
            return None if local >= end else since.isoformat(timespec="seconds")
        start = clock(device.get("night_from"), NIGHT_FROM)
        today = local.date()
        begin = datetime.combine(today, start, local.tzinfo)
        end = datetime.combine(today, morning, local.tzinfo)
        if end <= begin:
            if local >= begin:
                end += timedelta(days=1)
            else:
                begin -= timedelta(days=1)
        if not begin <= local < end:
            return None
        return end.isoformat(timespec="seconds")

    def _home(self) -> bool | None:
        """Someone home, by Joe's one helper (None: no helper, or it does
        not know right now)."""
        entity = (self._config().get("context") or {}).get("presence_entity")
        state = self._hass.states.get(entity) if entity else None
        if state is None or state.state in UNAVAILABLE:
            return None
        return state.state in HOME_STATES

    def _away_after(self) -> int:
        """Minutes nobody home before it counts as away (as for the heating)."""
        settings = self._config().get("climate") or {}
        return settings.get("away_after_min", AWAY_AFTER_MIN)

    def _note_away(self, now: datetime) -> bool:
        """Whether nobody is home for long enough (the helper unknown: as before)."""
        home = self._home()
        if home is None:
            if not (self._config().get("context") or {}).get("presence_entity"):
                self.data["nobody_since"] = None
                self._away = False
            return self._away
        if home:
            self.data["nobody_since"] = None
            self._away = False
            return False
        if not self.data["nobody_since"]:
            self.data["nobody_since"] = now.isoformat(timespec="seconds")
        since = datetime.fromisoformat(self.data["nobody_since"])
        self._away = now - since >= timedelta(minutes=self._away_after())
        return self._away

    def _want(
        self, device: dict[str, Any], now: datetime, away: bool
    ) -> tuple[list[str], str | None]:
        """Why a device should be off now (none: on) and the episode."""
        when = device.get("when", "never")
        causes: list[str] = []
        keys: list[str] = []
        if when in ("night", "both") and (night := self._night(device, now)):
            causes.append("night")
            keys.append(f"night:{night}")
        if when in ("away", "both") and away:
            causes.append("away")
            keys.append(f"away:{self.data['nobody_since']}")
        return causes, "|".join(keys) or None

    # --- switching --------------------------------------------------------------

    async def async_check(self) -> None:
        async with self._lock:
            await self._async_check()

    async def _async_check(self) -> None:
        now = dt_util.now()
        live = self._mode() == "live"
        devices = {
            entity_id: device
            for entity_id, device in self._devices().items()
            if device.get("when", "never") in CHOICES[1:]
        }
        away = self._note_away(now)
        # Devices no longer chosen, or Joe no longer switching: back on.
        for entity_id in list(self.data["off"]):
            if entity_id not in devices or not live:
                await self._async_back(entity_id, "stopped")
        status: dict[str, Any] = {}
        for entity_id, device in devices.items():
            status[entity_id] = await self._async_device(
                entity_id, device, now, away, live
            )
        for entity_id in list(self.data["declined"]):
            if entity_id not in devices:
                del self.data["declined"][entity_id]
        self.status = {
            "live": live,
            "home": self._home(),
            "away": away,
            "nobody_since": self.data["nobody_since"],
            "devices": status,
            "log": self.data["log"][-20:],
        }
        await self._store.async_save(self.data)
        self._changed()

    async def _async_device(
        self,
        entity_id: str,
        device: dict[str, Any],
        now: datetime,
        away: bool,
        live: bool,
    ) -> dict[str, Any]:
        causes, episode = self._want(device, now, away)
        state = self._hass.states.get(entity_id)
        held = self.data["off"].get(entity_id)
        by_owner = entity_id in self._by_owner
        self._by_owner.discard(entity_id)
        if held is not None and (by_owner or (state and state.state == "on")):
            # Switched on by somebody else: his until the next night or absence.
            del self.data["off"][entity_id]
            held = None
            if episode:
                self.data["declined"][entity_id] = episode
            self._log(entity_id, "owner")
        if self.data["declined"].get(entity_id) not in (None, episode):
            del self.data["declined"][entity_id]
        declined = episode is not None and self.data["declined"].get(entity_id) == (
            episode
        )
        result: dict[str, Any] = {
            "when": device.get("when"),
            "causes": causes,
            "state": state.state if state else None,
            "off_by_joe": held is not None,
            "declined": declined,
            "would": None,
        }
        if causes and held is None and not declined:
            if state is None or state.state != "on":
                # Off already (by the owner) or unknown: not Joe's to switch.
                return result
            if not live:
                result["would"] = "off"
                return result
            await self._async_off(entity_id, device, causes, episode, state)
            result["off_by_joe"] = entity_id in self.data["off"]
        elif not causes and held is not None:
            if not live:
                result["would"] = "on"
                return result
            why = "home" if "away" in held.get("causes", []) and not away else "morning"
            await self._async_back(entity_id, why)
            result["off_by_joe"] = entity_id in self.data["off"]
        elif held is not None and episode and held.get("episode") != episode:
            held["episode"] = episode
            held["causes"] = causes
        return result

    def _watts(self, device: dict[str, Any]) -> float | None:
        entity = device.get("power_entity")
        state = self._hass.states.get(entity) if entity else None
        try:
            value = float(state.state) if state else None
        except ValueError:
            value = None
        if value is None:
            return None
        if (state.attributes.get("unit_of_measurement") or "W") == "kW":
            value *= 1000
        return round(value) if value >= 0.5 else None

    async def _async_off(
        self,
        entity_id: str,
        device: dict[str, Any],
        causes: list[str],
        episode: str | None,
        state: State,
    ) -> None:
        watts = self._watts(device)
        try:
            await async_apply(self._hass, Write(entity_id, False))
        except WriteError as err:
            _LOGGER.warning("Switching %s off failed: %s", entity_id, err.code)
            self._log(entity_id, "failed", causes[0])
            return
        self.data["off"][entity_id] = {
            "at": dt_util.now().isoformat(timespec="seconds"),
            "causes": causes,
            "episode": episode,
            "watts": watts,
        }
        self._log(entity_id, "off", causes[0], watts)
        self._note(entity_id, state.name, "off", causes[0], watts)

    async def _async_back(self, entity_id: str, why: str) -> None:
        """Switch on what Joe switched off – unless it is not off any more."""
        held = self.data["off"].pop(entity_id, None)
        if held is None:
            return
        state = self._hass.states.get(entity_id)
        if state is None or state.state != "off":
            # On already, or gone: nothing to put back.
            return
        try:
            await async_apply(self._hass, Write(entity_id, True))
        except WriteError as err:
            _LOGGER.warning("Switching %s on again failed: %s", entity_id, err.code)
            # Tried again next round.
            self.data["off"][entity_id] = held
            self._log(entity_id, "failed", why)
            return
        self._log(entity_id, "on", why)
        self._note(entity_id, state.name, "on", why)

    def _lang(self) -> str:
        chosen = self._language() if self._language else None
        return (
            "de"
            if (chosen or self._hass.config.language or "en").startswith("de")
            else "en"
        )

    def _note(
        self, entity_id: str, name: str, what: str, why: str, watts: Any = None
    ) -> None:
        """A line in Home Assistant's logbook next to the switch."""
        if not self._hass.services.has_service("logbook", "log"):
            return
        words = WORDS[self._lang()]
        message = words[what].format(name=name, why=words[why])
        if watts:
            message += words["saves"].format(watts=watts)
        self._hass.async_create_task(
            self._hass.services.async_call(
                "logbook",
                "log",
                {
                    "name": "Energy Joe",
                    "message": message,
                    "entity_id": entity_id,
                    "domain": DOMAIN,
                },
                blocking=False,
            ),
            eager_start=False,
        )

    def _log(
        self, entity_id: str, what: str, why: str | None = None, watts: Any = None
    ) -> None:
        self.data["log"].append(
            {
                "at": dt_util.now().isoformat(timespec="seconds"),
                "entity": entity_id,
                "what": what,
                **({"why": why} if why else {}),
                **({"watts": watts} if watts else {}),
            }
        )
        del self.data["log"][:-LOG_SIZE]

    # --- finding and measuring --------------------------------------------------

    async def async_devices(self, refresh: bool = False) -> dict[str, Any]:
        """Every candidate with what it draws and what switching it would
        save a year (measured at most every few hours)."""
        now = dt_util.now()
        if (
            not refresh
            and self._found is not None
            and self._found_at is not None
            and now - self._found_at < MEASURE_EVERY
        ):
            return self._view(self._found)
        config = self._config()
        snap = await async_collect(self._hass)
        registry = er.async_get(self._hass)
        categorized = {
            item.entity_id
            for item in registry.entities.values()
            if item.entity_category is not None
        }
        found = find_standby(snap, config, categorized)
        chosen = self._devices()
        known = {d["entity_id"] for d in found}
        # Devices chosen before stay in the list, even if no longer found.
        for entity_id, device in chosen.items():
            if entity_id in known or device.get("when", "never") == "never":
                continue
            state = self._hass.states.get(entity_id)
            found.append(
                {
                    "entity_id": entity_id,
                    "power_entity": device.get("power_entity"),
                    "name": state.name if state else entity_id,
                    "device_id": None,
                    "device_name": None,
                    "area": None,
                    "state": state.state if state else None,
                    "watts": self._watts(device),
                    "warning": None,
                    "missing": state is None,
                }
            )
        start = now - timedelta(days=DAYS)
        powers = {d["power_entity"] for d in found if d.get("power_entity")}
        history = await async_power_history(self._hass, powers, start, now)
        presence = (config.get("context") or {}).get("presence_entity")
        states = await async_presence_history(self._hass, presence, start, now)
        hours = away_hours(away_intervals(states, now))
        days = (now - states[0][0]).total_seconds() / 86400 if states else 0.0
        for item in found:
            entity_id = item["entity_id"]
            series = history.get(item.get("power_entity") or "", {})
            night_w, nights = night_watts(series)
            away_w, away_n = away_watts(series, hours)
            switched = (chosen.get(entity_id) or {}).get("when", "never") != "never"
            kept = self.data["measured"].get(entity_id)
            if switched and kept:
                # Joe switches it already: what it drew before he did.
                night_w, nights = kept.get("night_w"), kept.get("nights", 0)
                away_w, away_n = kept.get("away_w"), kept.get("away_hours", 0)
            elif night_w is not None or away_w is not None:
                self.data["measured"][entity_id] = {
                    "night_w": night_w,
                    "nights": nights,
                    "away_w": away_w,
                    "away_hours": away_n,
                }
            item.update(
                night_w=night_w,
                nights=nights,
                away_w=away_w,
                away_hours=away_n,
                measured=night_w is not None or away_w is not None,
            )
        await self._store.async_save(self.data)
        self._found = {
            "devices": found,
            "hours": [hour.isoformat() for hour in hours],
            "days": round(days, 2),
            "presence": bool(presence),
        }
        self._found_at = now
        return self._view(self._found)

    def _view(self, found: dict[str, Any]) -> dict[str, Any]:
        """The list for the panel: with each device's own night times, worth
        a line (or chosen), the most money first."""
        config = self._config()
        price = prices(self._hass, config.get("tariff") or {})
        chosen = self._devices()
        hours = [datetime.fromisoformat(hour) for hour in found["hours"]]
        devices = []
        for item in found["devices"]:
            device = chosen.get(item["entity_id"]) or {}
            when = device.get("when", "never")
            draw = max(
                (w for w in (item.get("night_w"), item.get("away_w")) if w is not None),
                default=None,
            )
            if not item.get("measured"):
                draw = item.get("watts")
            if when == "never" and (draw is None or draw < MIN_W):
                continue
            money = yearly(
                device,
                item.get("night_w"),
                item.get("away_w"),
                hours,
                found["days"],
                price,
            )
            devices.append(
                {
                    **item,
                    **money,
                    "when": when,
                    "night_from": device.get("night_from") or NIGHT_FROM,
                    "night_until": device.get("night_until") or NIGHT_UNTIL,
                }
            )
        devices.sort(
            key=lambda d: (
                -(d["eur"]["both"] or 0.0),
                -(d.get("night_w") or d.get("watts") or 0.0),
                d["name"].lower(),
            )
        )
        return {
            "devices": devices,
            "price": price,
            "presence": found["presence"],
            "away_hours_per_day": round(len(hours) / found["days"], 1)
            if found["days"]
            else None,
            "min_w": MIN_W,
            "days": DAYS,
            "measured_at": self._found_at.isoformat(timespec="seconds")
            if self._found_at
            else None,
        }
