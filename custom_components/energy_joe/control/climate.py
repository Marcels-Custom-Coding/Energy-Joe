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

Air conditioners may instead run weekly profiles (six per mode, a curve over
the day), and thermostats with profiles of their own (Homematic IP) get ticks
on them: what each profile is for – a normal day, a holiday, nobody home, the
home office (see week.py). Joe then writes only when his target changes,
leaves a change by hand alone until the next switching point, and never
switches on a device someone else switched off.
"""

from __future__ import annotations

import asyncio
from collections.abc import Callable
from datetime import date, datetime, time, timedelta
import logging
import math
from typing import Any

from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant, State, callback
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_interval,
)
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from ..const import DOMAIN
from ..learn.context import async_day_label_sources
from ..observe.readings import temperature_c
from ..plan.trips import async_drive_home
from . import week
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

# Nobody home counts as away only after this long (unless set otherwise).
AWAY_AFTER_MIN = 15
# Someone heading home stays so until home, turning away, or this long.
ARRIVING_HOLD = timedelta(minutes=90)
# The usual homecoming only counts after an absence shorter than this.
USUAL_MAX_AWAY = timedelta(hours=20)
# Today's calendar labels: asked again after this long, waited for this long (s).
LABELS_EVERY = timedelta(minutes=15)
LABELS_TIMEOUT = 30
# A target counts as set once the device shows it. If not, Joe tries again
# after these minutes, then gives up after a last wait.
RETRY_MIN = (3, 10, 30)
CONFIRM = timedelta(minutes=3)
# A thermostat's own profiles change at most this often (not to and from away).
PRESET_GAP = timedelta(minutes=15)
DEFAULT_STEP = 0.5

STATES = ("away", "free_day", "night")
# States of the presence entity that mean "someone is home".
HOME_STATES = ("home", "on", "true", "occupied", "detected")
# States of a night entity that mean "people are in bed".
NIGHT_STATES = ("on", "true", "sleeping", "asleep", "in_bed")
# States of an entity that make today a day off.
FREE_STATES = ("on", "true", "home")
UNAVAILABLE = ("unavailable", "unknown")


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
            # Since when nobody is home (ISO), and rooms whose people are on
            # their way: entity -> {"at", "who"}.
            "nobody_since": None,
            "arriving": {},
            # Today's calendar labels: {"day", "at", "persons": {id: {label, source}}}.
            "labels": {},
            # Weekly profiles and a thermostat's own ones (see week.py):
            # the last heating or cooling mode seen, what Joe wrote
            # ({target, at, confirmed, attempts, next_try, ...}), changes by
            # hand, profiles chosen by hand, rooms back to the plan on request,
            # and when a thermostat's profile was changed last.
            "last_mode": {},
            "written": {},
            "overrides": {},
            "holds": {},
            "resumed": [],
            "preset_at": {},
            # entity -> the morning (ISO) its night already ended for.
            "night_over": {},
        }
        # tracked entity -> {"minutes", "source", "at"}; and recent distances.
        self._etas: dict[str, dict[str, Any]] = {}
        self._seen_km: dict[str, list[tuple[datetime, float]]] = {}
        self.status: dict[str, Any] = {}
        self._unsubs: list[CALLBACK_TYPE] = []
        self._lock = asyncio.Lock()
        self._labels_task: asyncio.Task[None] | None = None
        self._labels_stale = True
        # A store from before the delay for going away (see _note_presence).
        self._since_unknown = False
        # How each room was steered last round (not kept over a restart).
        self._kinds: dict[str, str] = {}
        # Thermostats seen out of automatic by hand (also off; not kept).
        self._by_hand: set[str] = set()

    async def async_load(self) -> None:
        stored = await self._store.async_load() or {}
        self._since_unknown = bool(stored) and "nobody_since" not in stored
        self.data.update({k: stored.get(k, v) for k, v in self.data.items()})

    async def async_remove(self) -> None:
        await self._store.async_remove()

    async def async_reset_rates(self) -> None:
        """Forget the learned warm-up rates; every room starts at the default again."""
        self.data["rates"] = {}
        if self.status:
            self.status = {**self.status, "rates": self.data["rates"]}
        await self._store.async_save(self.data)
        self._changed()

    @callback
    def async_start(self) -> None:
        self.async_stop()
        # Started again after every change of the settings: ask the calendars anew.
        self._labels_stale = True
        self._unsubs.append(async_track_time_interval(self._hass, self._tick, CHECK))
        watched = [
            p["person_entity"]
            for p in self._config()["persons"]
            if p.get("person_entity")
        ]
        if night := self._night_entity():
            watched.append(night)
        context = self._config()["context"]
        if presence := context.get("presence_entity"):
            watched.append(presence)
        watched.extend(context.get("free_day_entities") or [])
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
        tracker = config["context"].get("guest_tracker")
        guest = self._hass.states.get(tracker) if tracker else None
        if guest is not None and guest.state == "home":
            persons.append(guest.name)
        return persons or [state.name]

    def _free_day(self) -> bool:
        """Weekend or holiday: a workday sensor off, or a holiday calendar on;
        or one of the entities that make a day free is on."""
        context = self._config()["context"]
        for entity in context.get("free_day_entities") or []:
            state = self._hass.states.get(entity)
            if state is not None and state.state in FREE_STATES:
                return True
        entity = context.get("holiday_entity")
        state = self._hass.states.get(entity) if entity else None
        if entity and entity.startswith("calendar."):
            return dt_util.now().weekday() >= 5 or bool(state and state.state == "on")
        if state is None:
            return dt_util.now().weekday() >= 5
        return state.state == "off"

    def _note_presence(self, home: list[str], now: datetime) -> None:
        """Since when nobody is home; somebody home ends every way home.

        The first time after an update from a store that did not note it,
        nobody home counts as away at once: rooms Joe holds lowered stay so.
        """
        if home:
            self.data["nobody_since"] = None
            self.data["arriving"].clear()
        elif not self.data.get("nobody_since"):
            since = now
            if self._since_unknown:
                since -= timedelta(minutes=self._away_after() + 1)
            self.data["nobody_since"] = since.isoformat(timespec="seconds")
        self._since_unknown = False

    def _away_after(self) -> int:
        """Minutes nobody home before it counts as away."""
        settings = self._config().get("climate") or {}
        return settings.get("away_after_min", AWAY_AFTER_MIN)

    def _away_ready(self, now: datetime) -> bool:
        """Nobody home for long enough to count as away."""
        minutes = self._away_after()
        if not minutes:
            return True
        since = self.data.get("nobody_since")
        return bool(since) and now - datetime.fromisoformat(since) >= timedelta(
            minutes=minutes
        )

    def _labels_of(self, now: datetime) -> dict[str, dict[str, Any]]:
        """Today's calendar labels per person (none known: empty)."""
        cache = self.data.get("labels") or {}
        if cache.get("day") != dt_util.as_local(now).date().isoformat():
            return {}
        return cache.get("persons") or {}

    def _today(self, config: dict[str, Any], now: datetime) -> dict[str, Any]:
        """What kind of day today is: free, holiday, weekend, home office."""
        local = dt_util.as_local(now)
        free = self._free_day()
        weekend = local.weekday() >= 5
        available, reason = week.home_office_available(config)
        names = [] if free else week.home_office_persons(config, self._labels_of(now))
        cache = self.data.get("labels") or {}
        return {
            "free": free,
            "holiday": free and not weekend,
            "weekend": weekend,
            "workday": not free,
            "home_office": names,
            "home_office_available": available,
            "home_office_reason": reason,
            "labels_at": cache.get("at")
            if cache.get("day") == local.date().isoformat()
            else None,
            "labels_state": self._labels_state(config, now),
            "home_office_today": available and bool(names),
        }

    def _labels_state(self, config: dict[str, Any], now: datetime) -> str:
        """How today's calendars stand: "unread" (not asked yet today), "ok"
        (someone's calendars answered) or "error" (none did)."""
        cache = self.data.get("labels") or {}
        if cache.get("day") != dt_util.as_local(now).date().isoformat() or not (
            cache.get("tried") or cache.get("at")
        ):
            return "unread"
        found = cache.get("persons") or {}
        # The persons the home office is read for (else any with calendars).
        readers = [p["id"] for p in week.home_office_readers(config)] or [
            p["id"] for p in config["persons"] if p.get("calendars")
        ]
        if any(
            (found.get(person) or {}).get("source") not in (None, "error")
            for person in readers
        ):
            return "ok"
        return "error"

    @callback
    def _ask_calendars(
        self, config: dict[str, Any], now: datetime, workday: bool
    ) -> None:
        """Ask the calendars about today in the background, now and then."""
        if not any(p.get("calendars") for p in config["persons"]):
            return
        if self._labels_task is not None and not self._labels_task.done():
            return
        today = dt_util.as_local(now).date()
        cache = self.data.get("labels") or {}
        tried = cache.get("tried") or cache.get("at")
        if (
            not self._labels_stale
            and cache.get("day") == today.isoformat()
            and tried
            and now - datetime.fromisoformat(tried) < LABELS_EVERY
        ):
            return
        self._labels_stale = False
        self._labels_task = self._hass.async_create_task(
            self._async_labels(today, workday), eager_start=False
        )

    async def _async_labels(self, day: date, workday: bool) -> None:
        config = self._config()
        try:
            async with asyncio.timeout(LABELS_TIMEOUT):
                found = await async_day_label_sources(self._hass, config, day, workday)
        except Exception:  # noqa: BLE001 - counts as calendars that did not answer
            _LOGGER.debug("Calendars did not answer", exc_info=True)
            found = {
                p["id"]: {"label": None, "source": "error"} for p in config["persons"]
            }
        old = self.data.get("labels") or {}
        kept = (old.get("persons") or {}) if old.get("day") == day.isoformat() else {}
        persons = {}
        for person, entry in found.items():
            last = kept.get(person)
            # A calendar that does not answer: its last answer of today stands.
            if entry["source"] == "error" and last and last.get("source") != "error":
                entry = last
            persons[person] = entry
        stamp = dt_util.now().isoformat(timespec="seconds")
        readers = {p["id"] for p in config["persons"] if p.get("calendars")}
        answered = any(
            entry.get("source") != "error"
            for person, entry in found.items()
            if person in readers
        )
        self.data["labels"] = {
            "day": day.isoformat(),
            # When a calendar last answered today (a failed try keeps it).
            "at": stamp
            if answered
            else old.get("at")
            if old.get("day") == day.isoformat()
            else None,
            "tried": stamp,
            "persons": persons,
        }
        if persons != kept:
            self._hass.async_create_task(self.async_check(), eager_start=False)

    def _rate(self, entity_id: str) -> float:
        return float(self.data["rates"].get(entity_id) or DEFAULT_RATE_K_H)

    def _lead(
        self, entity_id: str, room: dict[str, Any], temperature: float | None = None
    ) -> timedelta:
        """How long the room needs to get back to where it was (or to a target)."""
        saved = self.data["saved"].get(entity_id) or {}
        state = self._hass.states.get(entity_id)
        target = saved.get("temperature") if temperature is None else temperature
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

    def _usual_counts(self, now: datetime) -> bool:
        """The usual homecoming counts: not after a long absence."""
        since = self.data.get("nobody_since")
        return not (since and now - datetime.fromisoformat(since) >= USUAL_MAX_AWAY)

    def _on_trip(self, person: dict[str, Any], now: datetime) -> bool:
        """A person's own calendar says vacation or a journey today."""
        entry = self._labels_of(now).get(person["id"])
        return bool(entry) and week.on_trip({person["id"]: entry})

    def _arriving(self, lead: timedelta, now: datetime | None = None) -> str | None:
        """Why a room should be back already: someone heading home who will be
        there within `lead` ("arriving"), or someone's usual homecoming is that
        close ("arriving_usual")."""
        return self._arriving_who(lead, now)[0]

    def _arriving_who(
        self, lead: timedelta, now: datetime | None = None
    ) -> tuple[str | None, str | None]:
        """As _arriving, with the person (or tracked entity) it is about."""
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
                return "arriving", entity
        if not self._usual_counts(now):
            return None, None
        for person in self._config()["persons"]:
            entity = person.get("person_entity")
            state = self._hass.states.get(entity) if entity else None
            if state is None or state.state == "home" or self._on_trip(person, now):
                continue
            info = tracked.get(entity) or {}
            drive = self._drive(entity, info, now) if info else None
            if expected_soon(self._usual(entity, now), minute, lead_min, drive):
                return "arriving_usual", entity
        return None, None

    def _arriving_room(
        self, entity_id: str, lead: timedelta, now: datetime
    ) -> str | None:
        """_arriving for a room, held once someone is on the way: until somebody
        is home, the person turns away, or ARRIVING_HOLD has passed."""
        held = self.data["arriving"].get(entity_id)
        if held:
            info = arrivals(self._hass).get(held.get("who") or "") or {}
            if (
                info.get("direction") == "away_from"
                or now - datetime.fromisoformat(held["at"]) >= ARRIVING_HOLD
            ):
                del self.data["arriving"][entity_id]
            else:
                return "arriving"
        why, who = self._arriving_who(lead, now)
        if why == "arriving":
            self.data["arriving"][entity_id] = {
                "at": now.isoformat(timespec="seconds"),
                "who": who,
            }
        return why

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
        # Just left (not long enough to count as away): as if still home.
        just_left = False
        if not self._home():
            if not self._away_ready(now):
                just_left = True
                if self.data["states"].get(entity_id) == "night":
                    # The night is over, but everybody just left: it stays as
                    # it is for now (no on and off again if they stay away).
                    return "night", "just_left"
            else:
                lead = self._lead(entity_id, room)
                if why := self._arriving_room(entity_id, lead, now):
                    return None, why
                return "away", "away"
        presets = (state.attributes.get("preset_modes") if state else None) or []
        if self._free_day() and room.get("free_day_preset") in presets:
            return "free_day", "just_left" if just_left else "free_day"
        return None, "just_left" if just_left else "home"

    def _night_entity(self) -> str | None:
        settings = self._config().get("climate") or {}
        if settings.get("night_by") == "entity":
            return settings.get("night_entity")
        return None

    def _night(
        self,
        room: dict[str, Any],
        now: datetime,
        entity_id: str,
        temperature: float | None = None,
        device_target: bool = True,
    ) -> bool:
        """Within the night off, but not yet the time to come back for the
        morning (`temperature`: the target to be back at; `device_target`:
        else the device's own while nothing is noted). Once the room came
        back, that night is over for it – no going off again while it warms
        up (the time back depends on how far the room still has to go)."""
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
            begin = local
            end = datetime.combine(today, morning, local.tzinfo)
            if end <= local:
                end += timedelta(days=1)
        else:
            begin = datetime.combine(today, start, local.tzinfo)
            end = datetime.combine(today, morning, local.tzinfo)
            if end <= begin:
                if local >= begin:
                    end += timedelta(days=1)
                else:
                    begin -= timedelta(days=1)
        if not begin <= local < end:
            return False
        key = end.isoformat()
        if self.data["night_over"].get(entity_id) == key:
            return False
        if (
            device_target
            and temperature is None
            and entity_id not in self.data["saved"]
        ):
            # Nothing noted yet (the night has not begun): the device's own
            # target, as it will be noted once Joe switches off.
            state = self._hass.states.get(entity_id)
            value = state.attributes.get("temperature") if state else None
            if (
                state is not None
                and state.state != "off"
                and isinstance(value, int | float)
            ):
                temperature = float(value)
        if local >= end - self._lead(entity_id, room, temperature):
            self.data["night_over"][entity_id] = key
            return False
        return True

    def _kind(
        self, entity_id: str, room: dict[str, Any], state: State | None
    ) -> tuple[str, str | None]:
        """How Joe steers a room: by weekly profiles ("week", with the mode in
        force), by a thermostat's own profiles ("device"), or as before."""
        if state is None:
            return "legacy", None
        settings = room.get("week") or {}
        modes = settings.get("modes") or {}
        if (
            settings.get("enabled")
            and modes
            and "cool" in (state.attributes.get("hvac_modes") or [])
        ):
            mode = self._week_mode(entity_id, modes, state)
            if mode in modes:
                return "week", mode
        presets = state.attributes.get("preset_modes") or []
        # Only with a profile for a normal day; without one the old fields
        # (absence, days off) go on as before.
        if "normal" in week.preset_tags(room.get("device_profiles") or {}, presets):
            return "device", None
        return "legacy", None

    def _week_mode(
        self, entity_id: str, modes: dict[str, Any], state: State
    ) -> str | None:
        """The mode the device runs in; while off the one it ran in last."""
        if state.state in week.MODES:
            return state.state
        if state.state != week.OFF:
            return None
        last = self.data["last_mode"].get(entity_id)
        if last is None:
            # Not seen running yet: the mode the old way noted before its own
            # "off", else the profiles there are (it waits to be switched on).
            last = (self.data["saved"].get(entity_id) or {}).get("hvac_mode")
            if last in (None, week.OFF):
                return next((mode for mode in week.MODES if mode in modes), None)
        # Off after running in a mode without profiles: not on profiles (the
        # old way keeps it), so the two ways never switch it back and forth.
        return last if last in modes else None

    def _held(self, entity_id: str, mode: str) -> int | None:
        hold = self.data["holds"].get(entity_id)
        return hold["profile"] if hold and hold.get("mode") == mode else None

    def _drop_holds(self, now: datetime) -> None:
        for entity_id, hold in list(self.data["holds"].items()):
            if hold.get("until") and now >= datetime.fromisoformat(hold["until"]):
                del self.data["holds"][entity_id]

    def _hold_status(self, entity_id: str) -> dict[str, Any] | None:
        """A profile chosen by hand, whatever the situation now (until None:
        until lifted)."""
        hold = self.data["holds"].get(entity_id)
        if not hold:
            return None
        return {
            "profile": hold["profile"],
            "mode": hold.get("mode"),
            "until": hold.get("until"),
        }

    # --- applying ------------------------------------------------------------------

    async def async_check(self) -> None:
        async with self._lock:
            await self._async_check()

    async def _async_check(self) -> None:
        config = self._config()
        settings = config.get("climate") or {}
        now = dt_util.now()
        live = bool(self._mode() == "live" and settings.get("enabled"))
        configured = settings.get("rooms") or {}
        rooms = {
            entity_id: room
            for entity_id, room in configured.items()
            if room.get("enabled")
        }
        status: dict[str, Any] = {}
        if rooms and settings.get("enabled"):
            await self._async_etas(now)
        home = self._home()
        self._note_presence(home, now)
        self._drop_holds(now)
        day = self._today(config, now)
        # Today's card tells the home office even without a room.
        self._ask_calendars(config, now, day["workday"])
        # Rooms no longer chosen (or Joe no longer steering): back as they were.
        for entity_id in list(self.data["states"]):
            if entity_id not in rooms or not live:
                await self._async_restore(entity_id, True)
        for entity_id in list(self.data["written"]):
            if entity_id not in rooms or not live:
                await self._async_hand_back(
                    entity_id, configured.get(entity_id), day, now
                )
        for entity_id in list(self.data["overrides"]):
            if entity_id not in rooms or not live:
                # A change by hand noted while Joe steered is over with it.
                del self.data["overrides"][entity_id]
        for entity_id, room in rooms.items():
            result = await self._async_room(entity_id, room, day, now, live)
            result["hold"] = self._hold_status(entity_id)
            status[entity_id] = result
        self.status = {
            "home": home,
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
            "free_day": day["free"],
            "day": {
                key: day[key]
                for key in (
                    "free",
                    "holiday",
                    "weekend",
                    "home_office",
                    "home_office_available",
                    "home_office_reason",
                    "labels_at",
                    "labels_state",
                )
            },
            "nobody_since": self.data["nobody_since"],
            "rooms": status,
            "live": live,
            "rates": self.data["rates"],
            "log": self.data["log"][-20:],
        }
        await self._store.async_save(self.data)
        self._changed()

    async def _async_room(
        self,
        entity_id: str,
        room: dict[str, Any],
        day: dict[str, Any],
        now: datetime,
        live: bool,
    ) -> dict[str, Any]:
        """Steer one room and tell how it stands."""
        state = self._hass.states.get(entity_id)
        before = self.data["last_mode"].get(entity_id)
        if state is not None and state.state not in (week.OFF, *UNAVAILABLE):
            # Any mode it runs in (also dry, fan only ...): off after a mode
            # without profiles stays the old way's.
            self.data["last_mode"][entity_id] = state.state
        written = self.data["written"].get(entity_id)
        if written and state is not None and state.state in UNAVAILABLE:
            # Joe waits for the device; what he wrote stays.
            return _room_status(why="unavailable", kind=written["kind"], live=live)
        kind, mode = self._kind(entity_id, room, state)
        pending = None
        waiting_for = None
        if kind != "legacy" and entity_id in self.data["states"]:
            # The old way holds its night, absence or day off: the profiles
            # take over once that is over (no switching in between).
            waiting_for = (kind, mode)
            kind, mode, pending = "legacy", None, "start"
        elif (
            written
            and written["kind"] != kind
            and state is not None
            and (ending := self._ending(entity_id, room, state, written, now))
        ):
            # Profiles off while Joe holds his own night or absence: that goes
            # on as planned, then he lets go.
            kind, mode = ending
            pending = "end"
        handed = None
        if written and written["kind"] != kind:
            handed = await self._async_hand_back(entity_id, room, day, now)
        if (
            handed is None
            and kind == "legacy"
            and self._kinds.get(entity_id) in ("week", "device")
            and pending is None
        ):
            # Off the profiles by a change at the device (a mode without
            # profiles): counts as by hand too.
            handed = False
        self._kinds[entity_id] = kind
        if kind == "legacy" and (state is None or state.state not in UNAVAILABLE):
            # Not steered by profiles: a change by hand noted for them is over.
            self.data["overrides"].pop(entity_id, None)
        if kind != "legacy" and state is not None:
            if kind == "week" and mode is not None:
                # Switched by hand from a mode without profiles to this one:
                # as set by hand until the next point.
                by_hand = (
                    before is not None
                    and before != state.state
                    and before not in (room.get("week") or {}).get("modes", {})
                    and state.state == mode
                )
                result = await self._async_week(
                    entity_id, room, state, mode, day, now, live, by_hand
                )
            else:
                # Back to automatic from a mode set by hand.
                back = before not in (None, "auto") and state.state == "auto"
                result = await self._async_device(
                    entity_id, room, state, day, now, live, back
                )
        else:
            want, why = self.desired(entity_id, room, now)
            if live:
                have = self.data["states"].get(entity_id)
                if handed is False and have is None and want in ("night", "away"):
                    # Let go after a change by hand: the night or absence on
                    # now counts as held (nothing to set, nothing to put back).
                    self.data["states"][entity_id] = have = want
                if want != have:
                    if want is None and self._off_for_profiles(
                        entity_id, room, state, waiting_for, day, now
                    ):
                        # The old way's "off" ends and the profiles say off
                        # now: it stays off (as theirs), not on and off again.
                        self.data["saved"].pop(entity_id, None)
                        self.data["states"].pop(entity_id, None)
                        self.data["written"][entity_id] = {
                            "kind": "week",
                            "target": {"hvac": week.OFF},
                            "lage": "home",
                            "basis": None,
                            "at": now.isoformat(timespec="seconds"),
                            "confirmed": True,
                            "attempts": 1,
                            "next_try": None,
                            "error": None,
                            "from_off": False,
                        }
                    elif want is None:
                        await self._async_restore(entity_id, True)
                    elif pending == "start" and have is not None:
                        # Profiles wait for this to end: nothing new begun.
                        pass
                    else:
                        await self._async_apply(entity_id, room, want)
            result = _room_status(want=want, why=why, live=live)
        result["pending"] = pending
        if live:
            # Back to the plan on request counts for one round.
            if entity_id in self.data["resumed"]:
                self.data["resumed"].remove(entity_id)
            self._learn(entity_id)
        return result

    def _off_for_profiles(
        self,
        entity_id: str,
        room: dict[str, Any],
        state: State | None,
        waiting_for: tuple[str, str | None] | None,
        day: dict[str, Any],
        now: datetime,
    ) -> bool:
        """Weekly profiles about to take over an air conditioner the old way
        holds off, and their plan says off right now."""
        held = self.data["states"].get(entity_id)
        saved = self.data["saved"].get(entity_id) or {}
        if (
            waiting_for is None
            # Off already before the old way's night or absence: by hand.
            or saved.get("hvac_mode") in (None, week.OFF)
            or waiting_for[0] != "week"
            or state is None
            or state.state != week.OFF
            # Only the old way's own "off" (night, or away set to off); an
            # "off" by hand stays one.
            or not (held == "night" or (held == "away" and room.get("away") == "off"))
        ):
            return False
        mode = waiting_for[1]
        modes = (room.get("week") or {}).get("modes") or {}
        if mode not in modes:
            return False
        target = self._home_target(entity_id, room, state, mode, day, now, _step(state))
        return bool(target) and target.get("hvac") == week.OFF

    def _ending(
        self,
        entity_id: str,
        room: dict[str, Any],
        state: State,
        written: dict[str, Any],
        now: datetime,
    ) -> tuple[str, str | None] | None:
        """How a room goes on (kind, mode) while Joe's own night or absence by
        profiles is still on and the device shows it (None: let go now)."""
        if (
            written.get("lage") not in ("night", "away")
            or written.get("left")
            or not _matches(state, written["target"], _step(state))
        ):
            return None
        if self.desired(entity_id, room, now)[0] not in ("night", "away"):
            return None
        if written["kind"] == "device":
            return "device", None
        modes = (room.get("week") or {}).get("modes") or {}
        mode = written["target"].get("hvac")
        if mode == week.OFF:
            mode = self.data["last_mode"].get(entity_id)
        return ("week", mode) if mode in modes else None

    def _confirm(
        self, entity_id: str, state: State, step: float
    ) -> dict[str, Any] | None:
        """What Joe wrote, confirmed once the device shows it."""
        written = self.data["written"].get(entity_id)
        if (
            written
            and not written["confirmed"]
            and _matches(state, written["target"], step)
        ):
            written.update(confirmed=True, next_try=None, error=None)
        return written

    def _own_off(
        self, entity_id: str, state: State, written: dict[str, Any] | None
    ) -> bool:
        """Off because Joe switched it off (or he was asked to go on with the
        plan) – not once it was seen otherwise since (then it is by hand)."""
        return state.state == week.OFF and (
            entity_id in self.data["resumed"]
            or (
                written is not None
                and written["target"].get("hvac") == week.OFF
                and written["confirmed"]
                and not written.get("left")
            )
        )

    def _note_left(self, written: dict[str, Any] | None, state: State) -> None:
        """Joe's own "off" seen otherwise (on, manual): an "off" after that is
        not his."""
        if (
            written is not None
            and written["target"].get("hvac") == week.OFF
            and written["confirmed"]
            and state.state not in (week.OFF, *UNAVAILABLE)
        ):
            written["left"] = True

    def _presence_why(
        self, entity_id: str, room: dict[str, Any], now: datetime, temperature: Any
    ) -> tuple[str | None, bool]:
        """While nobody is home: why the room is not away yet (None: it is)."""
        if self._home():
            return None, False
        if not self._away_ready(now):
            return "just_left", False
        lead = self._lead(
            entity_id,
            room,
            temperature if isinstance(temperature, int | float) else None,
        )
        why = self._arriving_room(entity_id, lead, now)
        return why, why is None

    async def _async_week(
        self,
        entity_id: str,
        room: dict[str, Any],
        state: State,
        mode: str,
        day: dict[str, Any],
        now: datetime,
        live: bool,
        by_hand: bool = False,
    ) -> dict[str, Any]:
        """An air conditioner on weekly profiles."""
        profiles = room["week"]["modes"][mode]
        step = _step(state)
        written = self._confirm(entity_id, state, step)
        self._note_left(written, state)
        override = self.data["overrides"].get(entity_id)
        switched_on = False
        if override and override["reason"] == "off" and state.state != week.OFF:
            override = None
            switched_on = True
            # What Joe wrote before it was switched off is no measure now.
            self.data["written"].pop(entity_id, None)
            written = None
        if state.state == week.OFF and (
            (override and override["reason"] == "manual")
            or (
                not self._own_off(entity_id, state, written)
                and not (_waiting(written) and written.get("from_off"))
            )
        ):
            # Switched off by someone else (also after a change by hand):
            # Joe never switches it on again.
            override = {"reason": "off", "basis": None}
        elif written and written["confirmed"]:
            matches = _matches(state, written["target"], step)
            if override is None and not matches:
                override = {"reason": "manual", "basis": written.get("basis")}
                if state.state != written["target"].get("hvac"):
                    # The mode changed by hand: as set until the next point
                    # of the new mode's plan (its basis is set below).
                    override["basis"] = "new_mode"
            elif override and override["reason"] == "manual" and matches:
                override = None

        local = dt_util.as_local(now)
        choice = {
            "weekday": local.weekday(),
            "minute": local.hour * 60 + local.minute,
            "hold": self._held(entity_id, mode),
            "holiday": day["holiday"],
            "home_office": day["home_office_today"],
        }
        home_plan = week.choose(profiles, mode, **choice)
        home_value = home_plan["target"].get("temperature")
        night = bool(room.get("night_off")) and self._night(
            room,
            now,
            entity_id,
            home_value if isinstance(home_value, int | float) else None,
            # Not the device's: a change by hand must not end the night.
            device_target=False,
        )
        why: str | None = None
        away = False
        held_night = False
        if not night:
            why, away = self._presence_why(entity_id, room, now, home_value)
            if why == "just_left" and (written or {}).get("lage") == "night":
                # The night is over, but everybody just left: its target stays
                # for now (no on and off again if they stay away).
                night = held_night = True
        plan = week.choose(
            profiles,
            mode,
            night=night,
            away=away,
            away_off=room.get("away") == "off",
            setback_k=room.get("setback_k", 3.0),
            **choice,
        )
        why = plan["why"] if (night and not held_night) or away else why or plan["why"]
        target = _fit(plan["target"], state, step)
        basis = plan["basis"]
        if switched_on and not _matches(state, target, step):
            # Switched on again by hand: as set by hand until the next point.
            override = {"reason": "manual", "basis": basis}
        if by_hand and override is None and written is None:
            override = {"reason": "manual", "basis": basis}
        if override and override["reason"] == "manual":
            old_basis = override.get("basis")
            if old_basis == "new_mode" or (
                isinstance(old_basis, list)
                and len(old_basis) > 1
                and old_basis[1] != mode
            ):
                # The mode changed by hand (again): until the next point of
                # the new mode's plan.
                override["basis"] = basis

        if live:
            if (
                override
                and override["reason"] == "manual"
                and override["basis"] != basis
            ):
                # The next switching point (or another situation): the plan
                # again – written even if it is what Joe wrote before.
                override = None
                self.data["written"].pop(entity_id, None)
            if override is None:
                self.data["overrides"].pop(entity_id, None)
                if self._due(entity_id, target, now):
                    await self._async_send(
                        entity_id, "week", target, plan["lage"], basis, now, step, mode
                    )
                elif written is not None and written["confirmed"]:
                    written.update(basis=basis, lage=plan["lage"])
            else:
                self.data["overrides"][entity_id] = override
        written = self.data["written"].get(entity_id) if live else None

        upcoming = plan["next"]
        profile = None
        if plan["index"] is not None:
            item = profiles[plan["index"]]
            profile = {
                "index": plan["index"],
                "name": item["name"],
                "tags": item["tags"],
                "held": plan["held"],
            }
        if override:
            why = "off_by_hand" if override["reason"] == "off" else "override"
        return _room_status(
            want=plan["lage"] if plan["lage"] in ("night", "away") else None,
            why=why,
            kind="week",
            mode=mode,
            profile=profile,
            target=target,
            upcoming={"at": week.clock(upcoming["minute"]), "value": upcoming["value"]}
            if upcoming
            else None,
            override={
                "reason": override["reason"],
                "until": week.clock(upcoming["minute"])
                if override["reason"] == "manual" and upcoming
                else None,
            }
            if override
            else None,
            error=(written or {}).get("error"),
            live=live,
        )

    async def _async_device(
        self,
        entity_id: str,
        room: dict[str, Any],
        state: State,
        day: dict[str, Any],
        now: datetime,
        live: bool,
        back: bool = False,
    ) -> dict[str, Any]:
        """A thermostat with profiles of its own (Homematic IP): Joe picks the
        profile by its ticks, only while it runs automatically (`back`: just
        set back to automatic from a mode by hand, also from off)."""
        presets = state.attributes.get("preset_modes") or []
        profiles = room.get("device_profiles") or {}
        written = self._confirm(entity_id, state, DEFAULT_STEP)
        self._note_left(written, state)
        if state.state == "auto":
            back = back or entity_id in self._by_hand
            self._by_hand.discard(entity_id)
        back = back and not _waiting(written)
        if back and live:
            # What Joe wrote before the mode by hand is no measure now: the
            # profile it shows counts as chosen by hand (see below).
            self.data["written"].pop(entity_id, None)
            self.data["overrides"].pop(entity_id, None)
            written = None
        own_off = self._own_off(entity_id, state, written)
        # Set to manual (or off) by someone else: Joe leaves it alone. Not
        # while his own switching on is still to show (he tries it again).
        manual = (
            state.state != "auto"
            and not own_off
            and not (_waiting(written) and written.get("from_off"))
        )
        if manual:
            self._by_hand.add(entity_id)
        override = self.data["overrides"].get(entity_id)
        if written and written["confirmed"] and state.state == "auto":
            matches = _matches(state, written["target"], DEFAULT_STEP)
            if override is None and not matches:
                # Another profile chosen by hand (or on again after Joe's off).
                reason = (
                    "preset" if written["target"].get("hvac") == "auto" else "manual"
                )
                override = {"reason": reason, "basis": written.get("basis")}
            elif override and matches:
                override = None
        why, away = self._presence_why(entity_id, room, now, None)
        lage, target = week.device_choice(
            profiles,
            presets,
            away=away,
            away_off=room.get("away") == "off",
            holiday=day["holiday"],
            home_office=day["home_office_today"],
        )
        if (
            target is None
            and not away
            and (own_off or (_waiting(written) and state.state == week.OFF))
        ):
            # Back from Joe's own "off" without a profile for now: automatic.
            target = {"hvac": "auto"}
        if target is None and written is not None and not written["confirmed"]:
            # Nothing to write now: a write not shown is not tried any more
            # (else it would wait forever, and a change by hand go unseen).
            self.data["written"].pop(entity_id, None)
            written = None
            manual = state.state != "auto" and not own_off
        if away:
            why = "away"
        elif why is None:
            why = (
                lage
                if lage in ("holiday", "home_office")
                else "weekend"
                if day["weekend"]
                else "home"
            )
        basis = [lage, (target or {}).get("preset")]
        if (
            back
            and live
            and target is not None
            and not _matches(state, target, DEFAULT_STEP)
        ):
            # Back to automatic by hand on another profile: as chosen by hand
            # until the situation changes.
            override = {"reason": "preset", "basis": basis}

        if live:
            if override and override["basis"] != basis:
                # Another situation: the ticks decide again (written again).
                override = None
                self.data["written"].pop(entity_id, None)
                written = None
            if override is None:
                self.data["overrides"].pop(entity_id, None)
                if (
                    target is not None
                    and not manual
                    and self._due(entity_id, target, now)
                    and not self._too_soon(entity_id, written, target, lage, now)
                ):
                    await self._async_send(
                        entity_id, "device", target, lage, basis, now, DEFAULT_STEP
                    )
                    sent = self.data["written"][entity_id]
                    sent["normal"] = week.preset_tags(profiles, presets).get("normal")
                elif written is not None and written["confirmed"]:
                    # Same target, or held back by the gap: a profile chosen
                    # by hand now counts against the situation of now.
                    written.update(basis=basis, lage=lage)
            else:
                self.data["overrides"][entity_id] = override
        written = self.data["written"].get(entity_id) if live else None

        preset = (target or {}).get("preset")
        order = week.week_presets(presets)
        entry = profiles.get(preset or "") or {}
        return _room_status(
            want="away" if lage == "away" else None,
            why="manual_mode" if manual else "override" if override else why,
            kind="device",
            profile={
                "index": order.index(preset) if preset in order else None,
                "name": entry.get("name") or "",
                "tags": entry.get("tags") or [],
                "held": False,
            }
            if preset
            else None,
            target=target,
            override={"reason": override["reason"], "until": None}
            if override
            else None,
            error=(written or {}).get("error"),
            live=live,
        )

    def _too_soon(
        self,
        entity_id: str,
        written: dict[str, Any] | None,
        target: dict[str, Any],
        lage: str,
        now: datetime,
    ) -> bool:
        """A thermostat's profile changed less than PRESET_GAP ago (going away
        and coming back may always switch)."""
        if (
            not written
            or written["target"] == target
            or not target.get("preset")
            or not written["target"].get("preset")
            or (written.get("lage") == "away") != (lage == "away")
        ):
            return False
        at = self.data["preset_at"].get(entity_id)
        return at is not None and now - datetime.fromisoformat(at) < PRESET_GAP

    def _due(self, entity_id: str, target: dict[str, Any], now: datetime) -> bool:
        """Whether to write: a new target, or it is time to try again."""
        written = self.data["written"].get(entity_id)
        if written is None or written["target"] != target:
            return True
        if written["confirmed"] or not written.get("next_try"):
            return False
        if now < datetime.fromisoformat(written["next_try"]):
            return False
        if written["attempts"] > len(RETRY_MIN):
            # Tried often enough: the device does not take it.
            written.update(next_try=None, error="not_confirmed")
            _LOGGER.warning("%s does not take %s", entity_id, target)
            self._log(entity_id, "failed")
            return False
        return True

    async def _async_send(
        self,
        entity_id: str,
        kind: str,
        target: dict[str, Any],
        lage: str,
        basis: list[Any],
        now: datetime,
        step: float,
        mode: str = "heat",
    ) -> None:
        """Write a target and note it (with the next try if not confirmed)."""
        old = self.data["written"].get(entity_id)
        again = old is not None and old["target"] == target
        before = self._hass.states.get(entity_id)
        entry: dict[str, Any] = {
            "kind": kind,
            "target": target,
            "lage": lage,
            "basis": basis,
            "at": now.isoformat(timespec="seconds"),
            "confirmed": False,
            "attempts": old["attempts"] + 1 if again and old else 1,
            "next_try": None,
            "error": None,
            # Switching on from off (a thermostat: back to automatic): until it
            # shows, "off" is not by hand.
            "from_off": (old or {}).get("from_off")
            if again
            else before is None
            or before.state == week.OFF
            or (kind == "device" and before.state != "auto"),
        }
        self.data["written"][entity_id] = entry
        if entity_id in self.data["resumed"]:
            self.data["resumed"].remove(entity_id)
        try:
            if kind == "week":
                await self._async_write_week(entity_id, target, step)
            else:
                await self._async_write_device(entity_id, target)
        except ServiceValidationError as err:
            # The device refuses this target: trying again will not help.
            _LOGGER.warning("Setting %s failed: %s", entity_id, err)
            entry["error"] = str(err) or "invalid"
            self._log(entity_id, "failed")
            return
        except Exception as err:  # noqa: BLE001 - tried again later
            _LOGGER.warning("Setting %s failed: %s", entity_id, err)
        state = self._hass.states.get(entity_id)
        if target.get("preset") and (
            before is None or before.attributes.get("preset_mode") != target["preset"]
        ):
            self.data["preset_at"][entity_id] = entry["at"]
        if state is not None and _matches(state, target, step):
            entry["confirmed"] = True
        else:
            wait = (
                timedelta(minutes=RETRY_MIN[entry["attempts"] - 1])
                if entry["attempts"] <= len(RETRY_MIN)
                else CONFIRM
            )
            entry["next_try"] = (now + wait).isoformat(timespec="seconds")
        if not again:
            self._log(entity_id, lage)
            self._note_comfort(entity_id, old, before, target, mode, now)

    async def _async_write_week(
        self, entity_id: str, target: dict[str, Any], step: float
    ) -> None:
        """The mode first, then the temperature (two calls)."""
        state = self._hass.states.get(entity_id)
        if state is None:
            return
        if target["hvac"] == week.OFF:
            if state.state != week.OFF:
                await self._call(entity_id, "set_hvac_mode", hvac_mode=week.OFF)
            return
        if state.state != target["hvac"]:
            await self._call(entity_id, "set_hvac_mode", hvac_mode=target["hvac"])
            state = self._hass.states.get(entity_id)
        temperature = target.get("temperature")
        current = state.attributes.get("temperature") if state else None
        if temperature is not None and (
            not isinstance(current, int | float)
            or abs(float(current) - temperature) > step / 2 + 1e-6
        ):
            await self._call(entity_id, "set_temperature", temperature=temperature)

    async def _async_write_device(self, entity_id: str, target: dict[str, Any]) -> None:
        """A thermostat's own profile: only the preset, never a temperature."""
        state = self._hass.states.get(entity_id)
        if state is None:
            return
        if target["hvac"] == week.OFF:
            if state.state != week.OFF:
                await self._call(entity_id, "set_hvac_mode", hvac_mode=week.OFF)
            return
        if state.state != "auto":
            await self._call(entity_id, "set_hvac_mode", hvac_mode="auto")
            state = self._hass.states.get(entity_id)
        preset = target.get("preset")
        if (
            preset
            and state is not None
            and state.attributes.get("preset_mode") != preset
        ):
            await self._call(entity_id, "set_preset_mode", preset_mode=preset)

    def _note_comfort(
        self,
        entity_id: str,
        old: dict[str, Any] | None,
        before: State | None,
        target: dict[str, Any],
        mode: str,
        now: datetime,
    ) -> None:
        """A warmer target (cooling: cooler, or on after off): watch how fast
        the room gets there, to learn its rate."""
        state = self._hass.states.get(entity_id)
        if target.get("hvac") == week.OFF or state is None:
            self.data["warming"].pop(entity_id, None)
            return
        new = target.get("temperature", state.attributes.get("temperature"))
        previous = (old or {}).get("target") or {}
        if previous:
            was_off = previous.get("hvac") == week.OFF
        else:
            was_off = before is None or before.state == week.OFF
        was = previous.get("temperature")
        if was is None and before is not None and before.state != week.OFF:
            was = before.attributes.get("temperature")
        if not isinstance(new, int | float):
            return
        sign = -1 if mode == "cool" else 1
        rise = (
            sign * (float(new) - float(was)) if isinstance(was, int | float) else None
        )
        if was_off or (rise is not None and rise >= 0.5):
            current = state.attributes.get("current_temperature")
            if isinstance(current, int | float):
                self.data["warming"][entity_id] = {
                    "at": now.isoformat(timespec="seconds"),
                    "from": float(current),
                    "target": float(new),
                }
        elif rise is not None and rise < 0:
            self.data["warming"].pop(entity_id, None)

    async def _async_hand_back(
        self,
        entity_id: str,
        room: dict[str, Any] | None,
        day: dict[str, Any],
        now: datetime,
    ) -> bool | None:
        """Joe stops steering a room by profiles. Is it in his own "off" or
        his absence setting (and still as he left it), it gets the home
        profile of now (a thermostat: its normal profile) once; else it stays.
        Tells whether the device still showed what Joe had set (False: it was
        changed by hand; None: nothing was Joe's)."""
        written = self.data["written"].pop(entity_id, None)
        override = self.data["overrides"].pop(entity_id, None)
        if entity_id in self.data["resumed"]:
            self.data["resumed"].remove(entity_id)
        if written is None:
            return None
        state = self._hass.states.get(entity_id)
        step = _step(state)
        mine = (
            written["target"].get("hvac") == week.OFF or written.get("lage") == "away"
        )
        # Seen otherwise since (on, by hand): its "off" now is not Joe's.
        shown = (
            state is not None
            and state.state not in UNAVAILABLE
            and override is None
            and not written.get("left")
            and _matches(state, written["target"], step)
        )
        if room and mine and shown:
            try:
                if written["kind"] == "week":
                    mode = written["target"]["hvac"]
                    if mode == week.OFF:
                        mode = self.data["last_mode"].get(entity_id) or mode
                    target = self._home_target(
                        entity_id, room, state, mode, day, now, step
                    )
                    if target:
                        await self._async_write_week(entity_id, target, step)
                        self._note_comfort(entity_id, written, state, target, mode, now)
                else:
                    await self._async_device_back(entity_id, room, state, written)
            except Exception as err:  # noqa: BLE001 - the device stays as it is
                _LOGGER.warning("Handing back %s failed: %s", entity_id, err)
        self._log(entity_id, "back")
        return shown

    def _home_target(
        self,
        entity_id: str,
        room: dict[str, Any],
        state: State,
        mode: str,
        day: dict[str, Any],
        now: datetime,
        step: float,
    ) -> dict[str, Any] | None:
        """The home profile's target of now (None: no profiles for the mode)."""
        modes = (room.get("week") or {}).get("modes") or {}
        if mode not in modes:
            return None
        local = dt_util.as_local(now)
        plan = week.choose(
            modes[mode],
            mode,
            weekday=local.weekday(),
            minute=local.hour * 60 + local.minute,
            hold=self._held(entity_id, mode),
            holiday=day["holiday"],
            home_office=day["home_office_today"],
        )
        return _fit(plan["target"], state, step)

    async def _async_device_back(
        self,
        entity_id: str,
        room: dict[str, Any],
        state: State,
        written: dict[str, Any],
    ) -> None:
        """A thermostat back from Joe's absence: automatic and its normal profile."""
        current: State | None = state
        if written["target"].get("hvac") == week.OFF:
            await self._call(entity_id, "set_hvac_mode", hvac_mode="auto")
            current = self._hass.states.get(entity_id)
        normal = self._normal_preset(room, state, written)
        if (
            normal
            and current is not None
            and current.attributes.get("preset_mode") != normal
        ):
            await self._call(entity_id, "set_preset_mode", preset_mode=normal)

    def _normal_preset(
        self, room: dict[str, Any], state: State, written: dict[str, Any]
    ) -> str | None:
        """A thermostat's profile for a normal day: by its tick, else the one
        it had when Joe last wrote (the tick may just have been removed)."""
        tags = week.preset_tags(
            room.get("device_profiles") or {},
            state.attributes.get("preset_modes") or [],
        )
        return tags.get("normal") or written.get("normal")

    # --- profiles by hand ------------------------------------------------------------

    def _mode_for(self, entity_id: str) -> str | None:
        """The mode a profile chosen by hand is for."""
        settings = self._config().get("climate") or {}
        room = (settings.get("rooms") or {}).get(entity_id) or {}
        modes = (room.get("week") or {}).get("modes") or {}
        state = self._hass.states.get(entity_id)
        for mode in (
            state.state if state else None,
            self.data["last_mode"].get(entity_id),
            *week.MODES,
        ):
            if mode in modes:
                return mode
        return None

    async def async_hold(
        self, entity_id: str, profile: int | None, until: str = "midnight"
    ) -> None:
        """Run a profile by hand until midnight ("midnight") or until lifted
        ("forever"); None lifts it (raises ValueError without profiles)."""
        if profile is None:
            self.data["holds"].pop(entity_id, None)
        else:
            mode = self._mode_for(entity_id)
            if mode is None:
                raise ValueError("no_profiles")
            end = None
            if until == "midnight":
                end = dt_util.start_of_local_day(
                    dt_util.now().date() + timedelta(days=1)
                ).isoformat()
            self.data["holds"][entity_id] = {
                "mode": mode,
                "profile": profile,
                "until": end,
            }
        await self._store.async_save(self.data)
        self._hass.async_create_task(self.async_check(), eager_start=False)

    async def async_resume(self, entity_id: str) -> None:
        """Back to the plan after a change by hand – also after switching off."""
        self.data["overrides"].pop(entity_id, None)
        self.data["written"].pop(entity_id, None)
        if entity_id not in self.data["resumed"]:
            self.data["resumed"].append(entity_id)
        await self._store.async_save(self.data)
        self._hass.async_create_task(self.async_check(), eager_start=False)

    # --- the old way: away, days off, night ------------------------------------------

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
        preset = state.attributes.get("preset_mode")
        try:
            if want == "night" or (want == "away" and room["away"] == "off"):
                if state.state != "off":
                    await self._call(entity_id, "set_hvac_mode", hvac_mode="off")
            elif want == "free_day":
                if preset != room["free_day_preset"]:
                    await self._call(
                        entity_id,
                        "set_preset_mode",
                        preset_mode=room["free_day_preset"],
                    )
            elif room["away"] == "preset" and room.get("away_preset"):
                if preset != room["away_preset"]:
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
                    value = float(target) - step
                    if state.attributes.get("temperature") != value:
                        await self._call(
                            entity_id, "set_temperature", temperature=value
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


def _step(state: State | None) -> float:
    """The device's temperature step (0.5 when it does not tell)."""
    value = state.attributes.get("target_temp_step") if state else None
    if isinstance(value, int | float) and not isinstance(value, bool) and value > 0:
        return float(value)
    return DEFAULT_STEP


def _fit(target: dict[str, Any], state: State, step: float) -> dict[str, Any]:
    """A target as the device can take it: on its step, within its limits."""
    if target.get("temperature") is None:
        return dict(target)
    value = math.floor(target["temperature"] / step + 0.5) * step
    low = state.attributes.get("min_temp")
    high = state.attributes.get("max_temp")
    if isinstance(low, int | float):
        value = max(value, float(low))
    if isinstance(high, int | float):
        value = min(value, float(high))
    return {**target, "temperature": round(value, 2)}


def _waiting(written: dict[str, Any] | None) -> bool:
    """What Joe wrote is not shown yet and he still tries again (also after
    a pause, e.g. a restart): until then the device being otherwise is no
    change by hand."""
    return (
        written is not None
        and not written["confirmed"]
        and bool(written.get("next_try"))
        and not written.get("error")
    )


def _matches(state: State | None, target: dict[str, Any], step: float) -> bool:
    """Whether the device shows a target (temperatures within half a step)."""
    if state is None or state.state != target.get("hvac"):
        return False
    if target.get("temperature") is not None:
        current = state.attributes.get("temperature")
        return (
            isinstance(current, int | float)
            and abs(float(current) - target["temperature"]) <= step / 2 + 1e-6
        )
    if target.get("preset"):
        return state.attributes.get("preset_mode") == target["preset"]
    return True


def _room_status(
    *,
    why: str,
    live: bool,
    want: str | None = None,
    kind: str = "legacy",
    mode: str | None = None,
    profile: dict[str, Any] | None = None,
    target: dict[str, Any] | None = None,
    upcoming: dict[str, Any] | None = None,
    override: dict[str, Any] | None = None,
    error: str | None = None,
) -> dict[str, Any]:
    """How a room stands, for the panel ("would": only simulated)."""
    return {
        "want": want,
        "why": why,
        "kind": kind,
        "mode": mode,
        "profile": profile,
        "target": target,
        "next": upcoming,
        "override": override,
        "error": error,
        # A profile chosen by hand (set by the caller): {profile, mode, until}.
        "hold": None,
        # Profiles start (or end) once the night or absence now on is over.
        "pending": None,
        "would": not live,
    }
