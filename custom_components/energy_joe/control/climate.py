"""Heating and air conditioning by presence (the "Klima" page).

Per thermostat the user chooses what happens while nobody is home: lower
(or for cooling raise) the temperature, switch off, or pick one of the
device's own presets (Homematic IP shows its heating profiles as presets,
e.g. "Abwesend"). On days off a preset of its own can run while people are
home. When someone heads home (Home Assistant's Proximity integration: the
distance and the direction of travel), Joe puts the room back early enough
for the learned heating (or cooling) time. Air conditioners can be off at
night and come back in time before the morning.

Joe notes what each device had before and puts exactly that back. In the
simulation he only says what he would do; he switches in the mode "live".
"""

from __future__ import annotations

from collections.abc import Callable
from datetime import datetime, time, timedelta
import logging
from typing import Any

from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_interval,
)
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from ..const import DOMAIN
from ..observe.readings import temperature_c
from ..plan.trips import async_drive_home
from .homecoming import expected_soon, record, usual

_LOGGER = logging.getLogger(__name__)

STORE_KEY = f"{DOMAIN}.climate"
STORE_VERSION = 1
CHECK = timedelta(minutes=1)
# Until Joe has learned a room: degrees per hour while heating or cooling.
DEFAULT_RATE_K_H = 1.5
# Speed on the way home when nothing else is known (km/h).
DEFAULT_SPEED_KMH = 40.0
# Some time to spare on top of the heating time.
MARGIN = timedelta(minutes=10)
# A room counts as there when this close to its target (K).
REACHED_K = 0.3
LOG_SIZE = 50
# Drive times home are asked again after this long, and trusted this long.
ETA_EVERY = timedelta(minutes=5)
ETA_VALID = timedelta(minutes=12)
# Joe asks for a drive time only between these distances (km).
ETA_KM = (0.3, 300.0)
# Heading home counts when the distance keeps shrinking: this much within
# APPROACH_SPAN, or when already this close (km).
APPROACH_KM = 2.0
APPROACH_SPAN = timedelta(minutes=10)
NEAR_KM = 2.0
# Outside the usual time of day by more than this, a live approach needs to be
# a steady one (not someone passing by).
USUAL_WINDOW = timedelta(hours=2)

STATES = ("away", "free_day", "night")
# States of the presence entity that mean "someone is home".
HOME_STATES = ("home", "on", "true", "occupied", "detected")
# States of a night entity that mean "people are in bed".
NIGHT_STATES = ("on", "true", "sleeping", "asleep", "in_bed")


def room_kind(state: Any) -> str:
    """ "cool" for an air conditioner cooling now, else "heat"."""
    mode = state.state if state else ""
    return "cool" if mode in ("cool", "dry") else "heat"


def arrivals(hass: HomeAssistant) -> dict[str, dict[str, Any]]:
    """Per tracked person: distance to home (km) and direction of travel, from
    Home Assistant's Proximity integration (each entry maps a person to its
    sensors)."""
    registry = er.async_get(hass)
    found: dict[str, dict[str, Any]] = {}
    for entry in hass.config_entries.async_entries("proximity"):
        mapping = getattr(getattr(entry, "runtime_data", None), "entity_mapping", None)
        for tracked, sensors in (mapping or {}).items():
            for entity_id in sensors:
                item = registry.async_get(entity_id)
                state = hass.states.get(entity_id)
                if item is None or state is None:
                    continue
                info = found.setdefault(tracked, {})
                if item.translation_key == "dir_of_travel":
                    info["direction"] = state.state
                elif item.translation_key == "dist_to_zone":
                    try:
                        value = float(state.state)
                    except ValueError:
                        continue
                    unit = state.attributes.get("unit_of_measurement") or "m"
                    info["km"] = (
                        value / 1000
                        if unit == "m"
                        else value * 1.609
                        if unit == "mi"
                        else value
                    )
    return found


class ClimateController:
    """Keeps every chosen thermostat as presence and time want it."""

    def __init__(
        self,
        hass: HomeAssistant,
        config: Callable[[], dict[str, Any]],
        mode: Callable[[], str],
        changed: Callable[[], None],
    ) -> None:
        self._hass = hass
        self._config = config
        self._mode = mode
        self._changed = changed
        self._store: Store[dict[str, Any]] = Store(hass, STORE_VERSION, STORE_KEY)
        # saved: entity -> what it had before Joe; states: entity -> Joe's state;
        # warming: entity -> start of putting it back; rates: entity -> K/h.
        self.data: dict[str, Any] = {
            "saved": {},
            "states": {},
            "warming": {},
            "rates": {},
            "log": [],
            # person entity -> homecomings (see homecoming.py)
            "homecomings": {},
        }
        # tracked entity -> {"minutes", "source", "at"}; and recent distances.
        self._etas: dict[str, dict[str, Any]] = {}
        self._seen_km: dict[str, list[tuple[datetime, float]]] = {}
        self.status: dict[str, Any] = {}
        self._unsubs: list[CALLBACK_TYPE] = []

    async def async_load(self) -> None:
        stored = await self._store.async_load() or {}
        self.data.update({k: stored.get(k, v) for k, v in self.data.items()})

    async def async_remove(self) -> None:
        await self._store.async_remove()

    @callback
    def async_start(self) -> None:
        self.async_stop()
        self._unsubs.append(async_track_time_interval(self._hass, self._tick, CHECK))
        watched = [
            p["person_entity"]
            for p in self._config()["persons"]
            if p.get("person_entity")
        ]
        if night := self._night_entity():
            watched.append(night)
        if presence := self._config()["context"].get("presence_entity"):
            watched.append(presence)
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
        old = event.data.get("old_state")
        new = event.data.get("new_state")
        persons = {p.get("person_entity") for p in self._config()["persons"]}
        if (
            event.data.get("entity_id") in persons
            and new is not None
            and new.state == "home"
            and old is not None
            and old.state not in ("home", "unknown", "unavailable")
        ):
            record(
                self.data["homecomings"],
                event.data["entity_id"],
                dt_util.as_local(new.last_changed),
                self._free_day(),
            )
        self._hass.async_create_task(self.async_check(), eager_start=False)

    # --- what each room should do ------------------------------------------------

    def _home(self) -> list[str]:
        """Who is home (empty: nobody).

        With a presence entity (a helper of the persons and a guest switch)
        only it decides; the names are those of the persons at home, else its
        own (a guest). Without one, the persons themselves.
        """
        config = self._config()
        persons = [
            p["name"]
            for p in config["persons"]
            if p.get("person_entity")
            and (s := self._hass.states.get(p["person_entity"]))
            and s.state == "home"
        ]
        entity_id = config["context"].get("presence_entity")
        if not entity_id:
            return persons
        state = self._hass.states.get(entity_id)
        if state is None or state.state not in HOME_STATES:
            return []
        return persons or [state.name]

    def _free_day(self) -> bool:
        """Weekend or holiday: a workday sensor off, or a holiday calendar on."""
        entity = self._config()["context"].get("holiday_entity")
        state = self._hass.states.get(entity) if entity else None
        if entity and entity.startswith("calendar."):
            return dt_util.now().weekday() >= 5 or bool(state and state.state == "on")
        if state is None:
            return dt_util.now().weekday() >= 5
        return state.state == "off"

    def _rate(self, entity_id: str) -> float:
        return float(self.data["rates"].get(entity_id) or DEFAULT_RATE_K_H)

    def _lead(self, entity_id: str, room: dict[str, Any]) -> timedelta:
        """How long the room needs to get back to where it was."""
        saved = self.data["saved"].get(entity_id) or {}
        state = self._hass.states.get(entity_id)
        target = saved.get("temperature")
        current = state.attributes.get("current_temperature") if state else None
        if not isinstance(target, int | float) or not isinstance(current, int | float):
            gap = room["setback_k"]
        else:
            gap = abs(float(target) - float(current))
        return timedelta(hours=gap / self._rate(entity_id)) + MARGIN

    def _drive(self, tracked: str, info: dict[str, Any], now: datetime) -> float | None:
        """Minutes until a person is home: the routing service, else the distance."""
        found = self._etas.get(tracked)
        if found and now - found["at"] <= ETA_VALID:
            return float(found["minutes"])
        if "km" in info:
            return info["km"] / DEFAULT_SPEED_KMH * 60
        return None

    def _approaching(self, tracked: str, info: dict[str, Any], now: datetime) -> bool:
        """Getting steadily closer – not just passing by."""
        if info.get("km", 99.0) <= NEAR_KM:
            return True
        seen = [
            km for at, km in self._seen_km.get(tracked, []) if now - at <= APPROACH_SPAN
        ]
        return len(seen) >= 2 and seen[0] - seen[-1] >= APPROACH_KM

    def _usual(self, person_entity: str, now: datetime) -> dict[str, int] | None:
        return usual(
            self.data["homecomings"].get(person_entity) or [],
            self._free_day(),
            dt_util.as_local(now).date(),
        )

    def _arriving(self, lead: timedelta, now: datetime | None = None) -> str | None:
        """Why a room should be back already: someone heading home who will be
        there within `lead` ("arriving"), or someone's usual homecoming is that
        close ("arriving_usual")."""
        now = now or dt_util.now()
        local = dt_util.as_local(now)
        minute = local.hour * 60 + local.minute
        lead_min = lead.total_seconds() / 60
        tracked = arrivals(self._hass)
        for entity, info in tracked.items():
            if info.get("direction") != "towards":
                continue
            drive = self._drive(entity, info, now)
            if drive is None or drive > lead_min:
                continue
            found = self._usual(entity, now)
            near_usual = found is not None and abs(found["minute"] - minute) <= (
                USUAL_WINDOW.total_seconds() / 60
            )
            # Off the usual time, only a steady approach counts.
            if found is None or near_usual or self._approaching(entity, info, now):
                return "arriving"
        for person in self._config()["persons"]:
            entity = person.get("person_entity")
            state = self._hass.states.get(entity) if entity else None
            if state is None or state.state == "home":
                continue
            info = tracked.get(entity) or {}
            drive = self._drive(entity, info, now) if info else None
            if expected_soon(self._usual(entity, now), minute, lead_min, drive):
                return "arriving_usual"
        return None

    async def _async_etas(self, now: datetime) -> None:
        """Ask the routing service how long those heading home still need."""
        settings = self._config().get("climate") or {}
        routing = self._config().get("routing") or {}
        for entity, info in arrivals(self._hass).items():
            if "km" in info:
                seen = self._seen_km.setdefault(entity, [])
                seen.append((now, info["km"]))
                del seen[: max(0, len(seen) - 20)]
            heading = (
                info.get("direction") == "towards"
                and ETA_KM[0] <= info.get("km", 0.0) <= ETA_KM[1]
            )
            if (
                not heading
                or not settings.get("route_eta", True)
                or not routing.get("service")
            ):
                self._etas.pop(entity, None)
                continue
            found = self._etas.get(entity)
            if found and now - found["at"] < ETA_EVERY:
                continue
            state = self._hass.states.get(entity)
            lat = state.attributes.get("latitude") if state else None
            lon = state.attributes.get("longitude") if state else None
            if not isinstance(lat, int | float) or not isinstance(lon, int | float):
                continue
            if answer := await async_drive_home(self._hass, routing, lat, lon):
                self._etas[entity] = {**answer, "at": now}

    def desired(
        self, entity_id: str, room: dict[str, Any], now: datetime
    ) -> tuple[str | None, str]:
        """Joe's state for a room (None: as the user set it) and why."""
        state = self._hass.states.get(entity_id)
        if room.get("night_off") and self._night(room, now, entity_id):
            return "night", "night"
        if not self._home():
            if why := self._arriving(self._lead(entity_id, room), now):
                return None, why
            return "away", "away"
        presets = (state.attributes.get("preset_modes") if state else None) or []
        if self._free_day() and room.get("free_day_preset") in presets:
            return "free_day", "free_day"
        return None, "home"

    def _night_entity(self) -> str | None:
        settings = self._config().get("climate") or {}
        if settings.get("night_by") == "entity":
            return settings.get("night_entity")
        return None

    def _night(self, room: dict[str, Any], now: datetime, entity_id: str) -> bool:
        """Within the night off, but not yet the time to come back for the morning."""
        start = _at(room.get("night_from") or "23:00")
        morning = _at(room.get("night_until") or "06:30")
        local = dt_util.as_local(now)
        today = local.date()
        if entity := self._night_entity():
            # Night while the entity says so (people are in bed); back in
            # time for the morning all the same.
            state = self._hass.states.get(entity)
            if state is None or state.state not in NIGHT_STATES:
                return False
            end = datetime.combine(today, morning, local.tzinfo)
            if end <= local:
                end += timedelta(days=1)
            return local < end - self._lead(entity_id, room)
        begin = datetime.combine(today, start, local.tzinfo)
        end = datetime.combine(today, morning, local.tzinfo)
        if end <= begin:
            if local >= begin:
                end += timedelta(days=1)
            else:
                begin -= timedelta(days=1)
        back = end - self._lead(entity_id, room)
        return begin <= local < back

    # --- applying ------------------------------------------------------------------

    async def async_check(self) -> None:
        config = self._config()
        settings = config.get("climate") or {}
        now = dt_util.now()
        live = self._mode() == "live" and settings.get("enabled")
        rooms = {
            entity_id: room
            for entity_id, room in (settings.get("rooms") or {}).items()
            if room.get("enabled")
        }
        status: dict[str, Any] = {}
        if rooms and settings.get("enabled"):
            await self._async_etas(now)
        # Rooms no longer chosen (or Joe no longer steering): back as they were.
        for entity_id in list(self.data["states"]):
            if entity_id not in rooms or not live:
                await self._async_restore(entity_id, True)
        for entity_id, room in rooms.items():
            want, why = self.desired(entity_id, room, now)
            status[entity_id] = {"want": want, "why": why}
            if not live:
                continue
            have = self.data["states"].get(entity_id)
            if want != have:
                if want is None:
                    await self._async_restore(entity_id, True)
                else:
                    await self._async_apply(entity_id, room, want)
            self._learn(entity_id)
        self.status = {
            "home": self._home(),
            "arrivals": {
                entity: {
                    **info,
                    **(
                        {"minutes": round(drive)}
                        if info.get("direction") == "towards"
                        and (drive := self._drive(entity, info, now)) is not None
                        else {}
                    ),
                    **(
                        {"source": self._etas[entity]["source"]}
                        if entity in self._etas
                        else {}
                    ),
                }
                for entity, info in arrivals(self._hass).items()
            },
            "usual": {
                p["person_entity"]: found["minute"]
                for p in config["persons"]
                if p.get("person_entity")
                and (found := self._usual(p["person_entity"], now))
            },
            "free_day": self._free_day(),
            "rooms": status,
            "live": bool(live),
            "rates": self.data["rates"],
            "log": self.data["log"][-20:],
        }
        await self._store.async_save(self.data)
        self._changed()

    async def _async_apply(
        self, entity_id: str, room: dict[str, Any], want: str
    ) -> None:
        state = self._hass.states.get(entity_id)
        if state is None or state.state == "unavailable":
            return
        if entity_id not in self.data["saved"]:
            self.data["saved"][entity_id] = {
                "hvac_mode": state.state,
                "temperature": state.attributes.get("temperature"),
                "preset_mode": state.attributes.get("preset_mode"),
            }
        saved = self.data["saved"][entity_id]
        try:
            if want == "night" or (want == "away" and room["away"] == "off"):
                await self._call(entity_id, "set_hvac_mode", hvac_mode="off")
            elif want == "free_day":
                await self._call(
                    entity_id, "set_preset_mode", preset_mode=room["free_day_preset"]
                )
            elif room["away"] == "preset" and room.get("away_preset"):
                await self._call(
                    entity_id, "set_preset_mode", preset_mode=room["away_preset"]
                )
            else:
                target = saved.get("temperature")
                if isinstance(target, int | float):
                    step = (
                        room["setback_k"]
                        if room_kind(state) == "heat"
                        else -room["setback_k"]
                    )
                    await self._call(
                        entity_id, "set_temperature", temperature=float(target) - step
                    )
        except Exception as err:  # noqa: BLE001 - one room must not stop the others
            _LOGGER.warning("Setting %s failed: %s", entity_id, err)
            self._log(entity_id, "failed")
            return
        self.data["states"][entity_id] = want
        self.data["warming"].pop(entity_id, None)
        self._log(entity_id, want)

    async def _async_restore(self, entity_id: str, write: bool) -> None:
        saved = self.data["saved"].get(entity_id)
        if saved and write:
            state = self._hass.states.get(entity_id)
            try:
                if saved.get("hvac_mode") and (
                    state is None or state.state != saved["hvac_mode"]
                ):
                    await self._call(
                        entity_id, "set_hvac_mode", hvac_mode=saved["hvac_mode"]
                    )
                presets = (
                    state.attributes.get("preset_modes") if state else None
                ) or []
                if (
                    saved.get("preset_mode") in presets
                    and state is not None
                    and state.attributes.get("preset_mode") != saved["preset_mode"]
                ):
                    await self._call(
                        entity_id, "set_preset_mode", preset_mode=saved["preset_mode"]
                    )
                state = self._hass.states.get(entity_id)
                if isinstance(saved.get("temperature"), int | float) and (
                    state is None
                    or state.attributes.get("temperature") != saved["temperature"]
                ):
                    await self._call(
                        entity_id, "set_temperature", temperature=saved["temperature"]
                    )
            except Exception as err:  # noqa: BLE001 - tried again next minute
                _LOGGER.warning("Putting back %s failed: %s", entity_id, err)
                return
            current = state.attributes.get("current_temperature") if state else None
            if isinstance(current, int | float) and isinstance(
                saved.get("temperature"), int | float
            ):
                self.data["warming"][entity_id] = {
                    "at": dt_util.now().isoformat(timespec="seconds"),
                    "from": float(current),
                    "target": float(saved["temperature"]),
                }
            self._log(entity_id, "back")
        self.data["saved"].pop(entity_id, None)
        self.data["states"].pop(entity_id, None)

    def _learn(self, entity_id: str) -> None:
        """Once a room put back is at its temperature: how fast it got there."""
        warming = self.data["warming"].get(entity_id)
        state = self._hass.states.get(entity_id)
        if not warming or state is None:
            return
        current = state.attributes.get("current_temperature")
        if not isinstance(current, int | float):
            return
        started = datetime.fromisoformat(warming["at"])
        hours = (dt_util.now() - started).total_seconds() / 3600
        if hours > 12:
            del self.data["warming"][entity_id]
            return
        if abs(warming["target"] - float(current)) > REACHED_K or hours < 0.1:
            return
        gap = abs(warming["target"] - warming["from"])
        del self.data["warming"][entity_id]
        if gap < 0.5:
            return
        rate = gap / hours
        old = self.data["rates"].get(entity_id)
        self.data["rates"][entity_id] = round(
            rate if old is None else old * 0.7 + rate * 0.3, 2
        )

    async def _call(self, entity_id: str, service: str, **data: Any) -> None:
        await self._hass.services.async_call(
            "climate", service, {"entity_id": entity_id, **data}, blocking=True
        )

    def _log(self, entity_id: str, what: str) -> None:
        self.data["log"].append(
            {
                "at": dt_util.now().isoformat(timespec="seconds"),
                "entity": entity_id,
                "what": what,
            }
        )
        del self.data["log"][:-LOG_SIZE]


def _at(text: str) -> time:
    hour, _, minute = text.partition(":")
    return time(int(hour), int(minute or 0))


def outside_c(hass: HomeAssistant, config: dict[str, Any]) -> float | None:
    entity = config["context"].get("weather_entity")
    return temperature_c(hass.states.get(entity)) if entity else None
