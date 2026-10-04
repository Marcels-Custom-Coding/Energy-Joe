"""Joe watches the home: live sums per hour, plus the past from the recorder."""

from __future__ import annotations

import asyncio
from collections.abc import Callable
import contextlib
from datetime import datetime, timedelta
import logging
from typing import Any

from homeassistant.core import (
    CALLBACK_TYPE,
    Event,
    EventStateChangedData,
    HomeAssistant,
    callback,
)
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_change,
)
from homeassistant.util import dt as dt_util

from .backfill import async_backfill, energy_counters, missing_hours
from .readings import (
    Integrator,
    energy_kwh,
    measurement_entities,
    measurement_kw,
    number,
    sum_kwh,
    temperature_c,
)
from .records import Flow, HourParts, compose, day_key, local_hour
from .store import HOURS_FORMAT, HistoryStore

_LOGGER = logging.getLogger(__name__)

# How far back Joe reads the history when he starts for the first time.
BACKFILL_DAYS = 56
# Once, Joe reads as far back as Home Assistant's long-term statistics go
# (they are kept for good), so he knows last winter from the start.
READ_BACK_DAYS = 730
# Hours of the last days are checked again every hour (the recorder fills its
# statistics a few minutes after each hour, and restarts leave gaps).
REPAIR_DAYS = 2
HOUR = 3600.0
COUNTER_GROUPS = ("grid_in", "grid_out", "solar", "bat_in", "bat_out")
# These forecast integrations stamp an hour's energy with the end of the hour.
PERIOD_END = {"forecast_solar", "open_meteo_solar_forecast"}


class JoeObserver:
    """Adds up what the configured sensors report and stores one record per hour."""

    def __init__(
        self,
        hass: HomeAssistant,
        store: HistoryStore,
        changed: Callable[[], None],
        filled: Callable[[], None] | None = None,
    ) -> None:
        """Set up; call async_start with a configuration to begin.

        `filled` is called after the history brought in hours (learn again).
        """
        self._hass = hass
        self._store = store
        self._changed = changed
        self._filled = filled
        self._config: dict[str, Any] = {}
        self._prefs: dict[str, Any] | None = None
        self._unsubs: list[CALLBACK_TYPE] = []
        self._bucket: datetime | None = None
        self._readings: dict[str, Callable[[], float | None]] = {}
        self._sums: dict[str, Integrator] = {}
        self._watch: dict[str, list[str]] = {}
        self._counters: dict[str, float | None] = {}
        self._counter_groups: dict[str, list[str]] = {}
        self._platforms: dict[str, Any] | None = None
        self._backfill: asyncio.Task[None] | None = None
        self._backfill_again: int | None = None
        self.status: dict[str, Any] = {"active": False, "backfill": {"state": "idle"}}

    @property
    def active(self) -> bool:
        return bool(self._unsubs)

    async def async_start(self, config: dict[str, Any]) -> None:
        """Begin watching with this configuration (restarts if already running)."""
        await self.async_stop()
        self._config = config
        self._prefs = await self._async_energy_prefs()
        self._setup(config)
        now = dt_util.utcnow()
        self._bucket = local_hour(now)
        stamp = now.timestamp()
        for key, read in self._readings.items():
            self._sums[key].update(stamp, read())
        for entity in self._counters:
            self._counters[entity] = energy_kwh(self._hass.states.get(entity))
        if self._watch:
            self._unsubs.append(
                async_track_state_change_event(
                    self._hass, list(self._watch), self._on_state
                )
            )
        self._unsubs.append(
            async_track_time_change(self._hass, self._on_hour, minute=0, second=0)
        )
        self.status.update(
            active=True, since=dt_util.as_local(now).isoformat(timespec="seconds")
        )
        self.status.update(self._store.overview())
        self._changed()
        await self._async_forecast(now)
        if self._store.format < HOURS_FORMAT:
            # Hours worked out the old way: read the weeks again, once.
            self.start_backfill(BACKFILL_DAYS, rebuild=True)
            return
        latest = self._store.latest_start()
        days = BACKFILL_DAYS
        if latest is not None:
            gap = (self._bucket - latest).total_seconds() / 86400
            days = max(REPAIR_DAYS, min(BACKFILL_DAYS, int(gap) + 1))
        if self._store.read_back < READ_BACK_DAYS:
            days = READ_BACK_DAYS
        self.start_backfill(days)

    async def async_stop(self) -> None:
        """Stop watching; the hour in progress is left to the history."""
        for unsub in self._unsubs:
            unsub()
        self._unsubs = []
        if self._backfill and not self._backfill.done():
            self._backfill.cancel()
            with contextlib.suppress(asyncio.CancelledError):
                await self._backfill
        self._backfill = None
        self._readings, self._sums, self._watch = {}, {}, {}
        self._counters, self._counter_groups = {}, {}
        if self.status.get("active"):
            self.status.update(active=False)
            self._changed()

    def _setup(self, config: dict[str, Any]) -> None:
        """Decide what to add up and which entities to watch."""
        get = self._hass.states.get
        m = config["measurements"]

        def power(key: str, measurement: dict[str, Any] | None) -> None:
            if not measurement:
                return
            self._add(
                key,
                lambda: measurement_kw(get, measurement),
                measurement_entities(measurement),
            )

        power("grid", m["grid_power"])
        power("home", m["home_power"])
        for index, measurement in enumerate(m["solar_power"]):
            power(f"solar:{index}", measurement)
        for battery in config["batteries"]:
            power(f"bat:{battery['id']}", battery["power"])
        if weather := config["context"]["weather_entity"]:
            self._add("temp", lambda: temperature_c(get(weather)), [weather])
        for person in config["persons"]:
            if entity := person["person_entity"]:
                self._add(
                    f"present:{person['id']}",
                    lambda entity=entity: _at_home(get(entity)),
                    [entity],
                )
        self._counter_groups = {
            group: entities
            for group, entities in energy_counters(self._prefs).items()
            if entities
        }
        counters = {e for group in self._counter_groups.values() for e in group}
        counters |= {
            c["energy_entity"]
            for c in config["consumers"]
            if c["energy_entity"] and c["kind"] != "submeter"
        }
        self._counters = dict.fromkeys(counters)

    def _add(
        self, key: str, read: Callable[[], float | None], entities: list[str]
    ) -> None:
        self._readings[key] = read
        self._sums[key] = Integrator()
        for entity in entities:
            self._watch.setdefault(entity, []).append(key)

    @callback
    def _on_state(self, event: Event[EventStateChangedData]) -> None:
        stamp = event.time_fired_timestamp
        for key in self._watch.get(event.data["entity_id"], ()):
            self._sums[key].update(stamp, self._readings[key]())

    @callback
    def _on_hour(self, now: datetime) -> None:
        start = self._bucket
        hour = local_hour(now)
        if start is None or hour <= start:
            return
        stamp = dt_util.as_utc(now).timestamp()
        parts = self._collect(stamp)
        self._bucket = hour
        if stamp - dt_util.as_utc(start).timestamp() > HOUR + 300:
            # Home Assistant was asleep: this was more than one hour, the
            # history fills it in instead.
            parts = None
        self._hass.async_create_task(
            self._async_finish_hour(start, parts, now), eager_start=False
        )

    def _collect(self, stamp: float) -> HourParts:
        """Take the sums of the hour that just ended."""
        get = self._hass.states.get

        def flow(key: str) -> Flow | None:
            if key not in self._sums:
                return None
            positive, negative, covered = self._sums[key].take(stamp)
            return Flow(positive, negative, min(1.0, covered / HOUR))

        def mean(key: str) -> float | None:
            if key not in self._sums:
                return None
            positive, negative, covered = self._sums[key].take(stamp)
            return (positive - negative) * HOUR / covered if covered >= 300 else None

        deltas = {entity: self._delta(entity) for entity in self._counters}
        config = self._config
        present = {}
        for person in config["persons"]:
            key = f"present:{person['id']}"
            if key in self._sums:
                positive, _, covered = self._sums[key].take(stamp)
                if covered >= 300:
                    present[person["id"]] = round(positive * HOUR / covered, 3)
        temp = mean("temp")
        forecast = config["forecast"]
        return HourParts(
            grid=flow("grid"),
            home=flow("home"),
            solar=[
                flow(f"solar:{i}")
                for i in range(len(config["measurements"]["solar_power"]))
            ],
            batteries={
                b["id"]: flow(f"bat:{b['id']}")
                for b in config["batteries"]
                if b["power"]
            },
            soc={b["id"]: number(get(b["soc_entity"])) for b in config["batteries"]},
            consumers={
                c["id"]: deltas.get(c["energy_entity"])
                for c in config["consumers"]
                if c["energy_entity"] in deltas
            },
            grid_in=self._group("grid_in", deltas),
            grid_out=self._group("grid_out", deltas),
            solar_total=self._group("solar", deltas),
            bat_in=self._group("bat_in", deltas),
            bat_out=self._group("bat_out", deltas),
            context={
                "temp": None if temp is None else round(temp, 1),
                "present": present,
                "fc_today": sum_kwh(get, forecast["today"]),
                "fc_tomorrow": sum_kwh(get, forecast["tomorrow"]),
                "fc_remaining": sum_kwh(get, forecast["remaining_today"]),
            },
        )

    def _delta(self, entity: str) -> float | None:
        """Energy a counter added since the last hour (None if unknown)."""
        value = energy_kwh(self._hass.states.get(entity))
        previous = self._counters.get(entity)
        self._counters[entity] = value
        if value is None or previous is None:
            return None
        # A counter that went down was reset and counts from zero again.
        return value - previous if value >= previous else value

    def _group(self, group: str, deltas: dict[str, float | None]) -> float | None:
        entities = self._counter_groups.get(group)
        if not entities:
            return None
        values = [deltas.get(e) for e in entities]
        if any(v is None for v in values):
            return None
        return sum(v for v in values if v is not None)

    async def _async_finish_hour(
        self, start: datetime, parts: HourParts | None, now: datetime
    ) -> None:
        if parts is not None:
            record = compose(start, parts, "live")
            await self._store.async_put_hours([record])
            self.status["last_hour"] = record["start"]
        holiday = self._config["context"]["holiday_entity"]
        if holiday and 6 <= start.hour < 22:
            state = self._hass.states.get(holiday)
            if state is not None and state.state in ("on", "off"):
                # A workday sensor is on on working days; a holiday calendar is
                # on during a holiday.
                workday = (
                    state.state == "off" and start.weekday() < 5
                    if holiday.startswith("calendar.")
                    else state.state == "on"
                )
                await self._store.async_update_day(day_key(start), workday=workday)
        await self._async_forecast(now)
        self.status.update(self._store.overview())
        self._changed()
        self.start_backfill(REPAIR_DAYS)

    async def _async_forecast(self, now: datetime) -> None:
        """Remember the solar forecast for today and tomorrow."""
        get = self._hass.states.get
        forecast = self._config["forecast"]
        today = dt_util.as_local(now).date()
        tomorrow = (today + timedelta(days=1)).isoformat()
        if (value := sum_kwh(get, forecast["today"])) is not None:
            await self._store.async_update_day(
                today.isoformat(), fc={"latest_kwh": value}
            )
        if (value := sum_kwh(get, forecast["tomorrow"])) is not None:
            await self._store.async_update_day(tomorrow, fc={"ahead_kwh": value})
        # Other forecasts for the same panels, so Joe learns how well each fits.
        others = {
            source["id"]: value
            for source in forecast["alternatives"]
            if (value := sum_kwh(get, source["tomorrow"])) is not None
        }
        if others:
            await self._store.async_update_day(tomorrow, fc={"alt": others})
        hours = await self._async_forecast_hours(forecast["config_entries"])
        by_day: dict[str, dict[str, float]] = {}
        for start, wh in hours.items():
            by_day.setdefault(day_key(start), {})[start.isoformat()] = wh
        if part := by_day.get(today.isoformat()):
            await self._store.async_update_day(today.isoformat(), fc={"hours": part})
        if part := by_day.get(tomorrow):
            await self._store.async_update_day(
                tomorrow, fc={"hours": part, "ahead_hours": part}
            )

    async def _async_forecast_hours(self, entries: list[str]) -> dict[datetime, float]:
        """Hourly forecast in Wh from the forecast integrations' energy platforms."""
        if not entries:
            return {}
        if self._platforms is None:
            self._platforms = {}
            from homeassistant.helpers.integration_platform import (  # noqa: PLC0415
                async_process_integration_platforms,
            )

            platforms = self._platforms

            @callback
            def _found(hass: HomeAssistant, domain: str, platform: Any) -> None:
                if hasattr(platform, "async_get_solar_forecast"):
                    platforms[domain] = platform.async_get_solar_forecast

            await async_process_integration_platforms(
                self._hass, "energy", _found, wait_for_platforms=True
            )
        total: dict[datetime, float] = {}
        for entry_id in entries:
            entry = self._hass.config_entries.async_get_entry(entry_id)
            if entry is None or entry.domain not in self._platforms:
                continue
            try:
                result = await self._platforms[entry.domain](self._hass, entry_id)
            except Exception:  # noqa: BLE001 - a forecast integration must not stop Joe
                _LOGGER.debug("Forecast of %s not available", entry_id, exc_info=True)
                continue
            shift = timedelta(hours=1) if entry.domain in PERIOD_END else timedelta(0)
            for stamp, wh in ((result or {}).get("wh_hours") or {}).items():
                if (moment := dt_util.parse_datetime(stamp)) is not None:
                    # Joe keys every hour by its start.
                    key = dt_util.as_local(moment - shift)
                    total[key] = total.get(key, 0.0) + float(wh)
        return total

    async def _async_energy_prefs(self) -> dict[str, Any] | None:
        if "energy" not in self._hass.config.components:
            return None
        from homeassistant.components.energy.data import (  # noqa: PLC0415
            async_get_manager,
        )

        return (await async_get_manager(self._hass)).data

    @callback
    def start_backfill(self, days: int, rebuild: bool = False) -> None:
        """Read the last days from the recorder in the background."""
        if self._backfill and not self._backfill.done():
            self._backfill_again = max(days, self._backfill_again or 0)
            return
        self._backfill = self._hass.async_create_background_task(
            self._async_backfill(days, rebuild), "energy_joe history", eager_start=False
        )

    async def _async_backfill(self, days: int, rebuild: bool) -> None:
        end = self._bucket
        if end is None:
            return
        start = end - timedelta(days=days)
        if not rebuild:
            known = await self._store.async_days(day_key(start), day_key(end))
            missing = missing_hours(
                (h for d in known.values() for h in d.get("hours", [])), start, end
            )
            if not missing:
                self._store.set_read_back(days)
                return
            start = missing[0]
        self.status["backfill"] = {"state": "running", "from": start.isoformat()}
        self._changed()
        try:
            records = await async_backfill(
                self._hass, self._config, self._prefs, start, end
            )
        except asyncio.CancelledError:
            raise
        except Exception:
            _LOGGER.exception("Reading the history failed")
            self.status["backfill"] = {"state": "failed"}
        else:
            await self._store.async_put_hours(records, force=rebuild)
            self._store.set_read_back(days)
            if rebuild:
                self._store.set_format(HOURS_FORMAT)
            state = (
                "done"
                if records or "recorder" in self._hass.config.components
                else "unavailable"
            )
            self.status["backfill"] = {
                "state": state,
                "hours": len(records),
                "from": start.isoformat(),
            }
        self.status.update(self._store.overview())
        self._changed()
        if self.status["backfill"].get("hours") and self._filled:
            self._filled()
        if (again := self._backfill_again) is not None:
            self._backfill_again = None
            self._hass.loop.call_soon(self.start_backfill, again)


def _at_home(state: Any) -> float | None:
    """1 while a person is at home, 0 while away, None if unknown."""
    if state is None or state.state in ("unavailable", "unknown"):
        return None
    return 1.0 if state.state == "home" else 0.0
