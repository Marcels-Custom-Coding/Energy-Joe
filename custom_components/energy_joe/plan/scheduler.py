"""When Joe plans: a preview every hour, the plan itself shortly before the window."""

from __future__ import annotations

from collections.abc import Callable
from datetime import datetime, timedelta
import logging
from typing import Any

from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers.event import (
    async_track_point_in_time,
    async_track_time_change,
)
from homeassistant.util import dt as dt_util

from ..observe.store import HistoryStore
from .actions import plan_actions
from .car_calendar import CarCalendarStore
from .cars import action_by_id, car_by_id, detect_all, need_for, point_of
from .ev import car_need
from .inputs import DEFAULT_SEARCH, async_build_input, next_window, point_needs
from .planner import make_plan
from .trips import PlaceStore, normalize

_LOGGER = logging.getLogger(__name__)


class JoePlanner:
    """Keeps tonight's plan up to date and fixes it shortly before the window."""

    def __init__(
        self,
        hass: HomeAssistant,
        history: HistoryStore,
        changed: Callable[[], None],
        manual: Callable[[], dict[str, str]] | None = None,
    ) -> None:
        """Set up; call async_start with a configuration to begin."""
        self._hass = hass
        self._history = history
        self._changed = changed
        self._manual = manual or dict
        self._config: dict[str, Any] = {}
        self._unsubs: list[CALLBACK_TYPE] = []
        self._commit: CALLBACK_TYPE | None = None
        self._fixed: dict[str, Any] | None = None
        # The start of the window (or search span) the last fixed plan was for.
        self._fixed_span: str | None = None
        # Last night's fixed plan while its grid-friendly morning still runs
        # (the window is over, the morning lasts until day.defer_until).
        self._morning: dict[str, Any] | None = None
        # Distances to the places of appointments (for cars charged by need).
        self.places = PlaceStore(hass)
        # Joe's own car calendars (set by the runtime).
        self.calendars: CarCalendarStore | None = None
        # The cars' own accounts (set by the runtime).
        self.accounts: Any = None
        # What the executor changed on the devices, with the values from before.
        self.held: Callable[[], dict[str, Any]] = dict
        # Which car is plugged in at each charge point (set by the runtime).
        self.detected: Callable[[], dict[str, dict[str, Any]]] = self._detect
        self.plan: dict[str, Any] | None = None

    def _detect(self) -> dict[str, dict[str, Any]]:
        return detect_all(self._config, self._hass.states.get) if self._config else {}

    @property
    def active(self) -> bool:
        return bool(self._unsubs)

    async def async_start(self, config: dict[str, Any]) -> None:
        """Plan with this configuration (restarts if already running)."""
        await self.async_stop()
        self._config = config
        self._unsubs.append(
            async_track_time_change(self._hass, self._on_tick, minute=5, second=0)
        )
        await self._async_restore()
        await self.async_refresh()
        self._schedule_commit()

    async def async_stop(self) -> None:
        for unsub in self._unsubs:
            unsub()
        self._unsubs = []
        if self._commit:
            self._commit()
            self._commit = None
        self._fixed = None
        self._morning = None
        if self.plan is not None:
            self.plan = None
            self._changed()

    async def async_update(self, config: dict[str, Any]) -> None:
        """The rules or the tariff changed: plan again."""
        self._config = config
        await self.async_refresh()
        self._schedule_commit()

    async def async_refresh(self) -> dict[str, Any] | None:
        """Plan again now; a fixed plan stays until its window is over."""
        now = dt_util.now()
        if self._fixed is not None:
            if datetime.fromisoformat(self._fixed["window"]["end"]) > now:
                self.plan = self._fixed
                self._changed()
                return self.plan
            if _morning_runs(self._fixed, now):
                self._morning = self._fixed
            self._fixed = None
        if self._morning is not None and not _morning_runs(self._morning, now):
            self._morning = None
        plan = await self._async_plan(now)
        # The plan may have been fixed while this one was worked out: it stays.
        if self._fixed is not None:
            self.plan = self._fixed
        elif self._morning is not None:
            # The next night's preview, with last night's morning still in force
            # (the executor holds the batteries back until its defer_until).
            self.plan = {**plan, "morning": _morning_part(self._morning)}
        else:
            self.plan = plan
        self._changed()
        return self.plan

    async def _async_plan(self, now: datetime) -> dict[str, Any]:
        try:
            return await self._async_compute(now)
        except Exception:
            _LOGGER.exception("Planning failed")
            return {
                "kind": "unavailable",
                "reasons": ["failed"],
                "created": now.isoformat(timespec="seconds"),
            }

    async def async_correct_needs(self, location: str) -> list[str]:
        """A place's distance was corrected: tonight's car needs follow at once.

        A fixed plan keeps its window and the batteries' targets; a car that
        charges by need is worked out again inside that window (whether it runs,
        from when, and the level it stops at; the executor reads them every minute).
        Returns the ids of the actions worked out again.
        """
        if self._fixed is None:
            await self.async_refresh()
            return []
        key = normalize(location)
        place = self.places.places.get(key)
        fixed = self._fixed
        config = self._config
        models = config["learned"].get("car_models") or {}
        meta = fixed.get("meta") or {}
        workday = (meta.get("tomorrow") or {}).get("workday", True)
        detected = self.detected()
        changed_cars: list[str] = []
        for car_id, need in (fixed.get("cars") or {}).items():
            car = car_by_id(config, car_id)
            if car is None or place is None:
                continue
            trips = need.get("trips") or []
            hits = [t for t in trips if normalize(t["location"]) == key]
            if not hits:
                continue
            factor = 2 if (car.get("need") or {}).get("round_trip", True) else 1
            for trip in hits:
                trip.update(km=round(place["km"] * factor, 1), source=place["source"])
            action = action_by_id(config, point_of(detected, car_id))
            found = car_need(
                need_for(
                    self._hass.states.get,
                    car,
                    (action or {}).get("point") if action else None,
                ),
                self._hass.states.get,
                trips,
                models.get(car_id),
                need.get("temp"),
                bool(need.get("rain")),
                workday,
            )
            fixed["cars"][car_id] = {**need, **found, "trips": trips}
            changed_cars.append(car_id)
        if not changed_cars:
            return []
        changed = self._replan_points(fixed, detected, changed_cars)
        await self._history.async_update_day(
            datetime.fromisoformat(fixed["window"]["start"]).date().isoformat(),
            plan=fixed,
        )
        self.plan = fixed
        self._changed()
        return changed

    async def async_replan_points(self) -> list[str]:
        """Another car was plugged in (or Joe was told which): the charge
        points follow at once. A fixed plan keeps its window; the cars' needs
        of the evening stay, only who is plugged in where is new."""
        if self._fixed is None:
            if self.active:
                await self.async_refresh()
            return []
        fixed = self._fixed
        changed = self._replan_points(fixed, self.detected())
        if changed:
            await self._history.async_update_day(
                datetime.fromisoformat(fixed["window"]["start"]).date().isoformat(),
                plan=fixed,
            )
            self.plan = fixed
            self._changed()
        return changed

    def _replan_points(
        self,
        fixed: dict[str, Any],
        detected: dict[str, dict[str, Any]],
        cars: list[str] | None = None,
    ) -> list[str]:
        """Work out the charge points of a fixed plan again (all, or where these cars are)."""
        config = self._config
        meta = fixed.get("meta") or {}
        sun = (
            meta.get("tomorrow_kwh")
            if "no_forecast" not in (fixed.get("notes") or [])
            else None
        )
        start = datetime.fromisoformat(fixed["window"]["start"])
        end = datetime.fromisoformat(fixed["window"]["end"])
        actions = {a["id"]: a for a in config["actions"]}
        needs = point_needs(config, fixed.get("cars") or {}, detected)
        for car_id, need in (fixed.get("cars") or {}).items():
            need["point"] = point_of(detected, car_id)
        changed: list[str] = []
        for index, entry in enumerate(fixed.get("actions") or []):
            action = actions.get(entry["id"])
            if action is None or action.get("point") is None:
                continue
            found = detected.get(entry["id"]) or {}
            if cars is not None and found.get("car") not in cars:
                continue
            again = plan_actions(
                [action],
                self._hass.states.get,
                start,
                end,
                sun,
                self._manual(),
                config["learned"].get("action_models") or {},
                needs,
                detected,
            )[0]
            again["cost"] = _cost(fixed, again)
            if _same_run(again, entry):
                continue
            fixed["actions"][index] = again
            changed.append(entry["id"])
        return changed

    async def _async_compute(self, now: datetime) -> dict[str, Any]:
        inp, notes = await async_build_input(
            self._hass,
            self._config,
            self._history,
            now,
            self._manual(),
            self.places,
            self.calendars,
            self.accounts,
            self.held(),
            self.detected(),
        )
        if inp is None:
            return {
                "kind": "unavailable",
                "reasons": notes,
                "created": now.isoformat(timespec="seconds"),
            }
        # Trying many windows takes a moment: not in the event loop.
        return await self._hass.async_add_executor_job(make_plan, inp)

    async def _async_restore(self) -> None:
        """After a restart during the night, the fixed plan is still the plan."""
        if _span(self._config) is None:
            return
        now = dt_util.now()
        today = now.date()
        # A dynamic window may start on the evening's day or the morning's.
        for offset in (0, -1, 1):
            name = (today + timedelta(days=offset)).isoformat()
            plan = ((await self._history.async_day(name)) or {}).get("plan")
            if not plan or not plan.get("fixed"):
                continue
            if datetime.fromisoformat(plan["window"]["end"]) > now:
                self._fixed = plan
                self._fixed_span = (plan.get("search") or plan["window"])["start"]
                return
            if self._morning is None and _morning_runs(plan, now):
                self._morning = plan

    @callback
    def _on_tick(self, now: datetime) -> None:
        self._hass.async_create_task(self.async_refresh(), eager_start=False)

    @callback
    def _schedule_commit(self) -> None:
        if self._commit:
            self._commit()
            self._commit = None
        span = _span(self._config)
        if span is None:
            return
        offset = timedelta(minutes=self._config["rules"]["plan_offset_min"])
        now = dt_util.now()
        # Fixed tariffs: before the cheap window; dynamic ones: before the search span.
        start, end = next_window(now, span)
        moment = start - offset
        # A dynamic window lies somewhere in the span: until its end there is time.
        latest = end if self._config["tariff"]["kind"] == "dynamic" else start
        if moment <= now:
            if (
                now < latest
                and self._fixed is None
                and self._fixed_span != start.isoformat()
            ):
                # Started just before the window: fix tonight's plan right away.
                moment = now + timedelta(seconds=1)
            else:
                # This window is fixed already (or running): the next one.
                moment += timedelta(days=1)
        self._commit = async_track_point_in_time(self._hass, self._on_commit, moment)

    @callback
    def _on_commit(self, now: datetime) -> None:
        self._commit = None
        self._hass.async_create_task(self._async_fix(), eager_start=False)

    async def _async_fix(self) -> None:
        """Fix tonight's plan and keep it for the evaluation."""
        self._fixed = None
        plan = await self._async_plan(dt_util.now())
        # Another run may have finished in between: this one is the plan.
        self.plan = plan
        if plan.get("kind") != "unavailable":
            plan["fixed"] = True
            self._fixed = plan
            self._fixed_span = (plan.get("search") or plan["window"])["start"]
            night = datetime.fromisoformat(plan["window"]["start"]).date().isoformat()
            await self._history.async_update_day(night, plan=plan)
        self._changed()
        self._schedule_commit()


def _morning_runs(plan: dict[str, Any], now: datetime) -> bool:
    """Whether a fixed plan's grid-friendly morning has not reached its end yet."""
    day = plan.get("day") or {}
    until = day.get("defer_until")
    return bool(until) and datetime.fromisoformat(until) > now


def _morning_part(plan: dict[str, Any]) -> dict[str, Any]:
    """What the executor needs of last night's plan for its morning."""
    return {
        "fixed": True,
        "window": plan["window"],
        "day": plan["day"],
        "batteries": plan.get("batteries") or [],
        "hours": plan.get("hours") or [],
    }


def _span(config: dict[str, Any]) -> dict[str, str] | None:
    """The cheap window of a fixed tariff, or the search span of a dynamic one."""
    tariff = config["tariff"]
    if tariff["kind"] == "fixed_window":
        return tariff["window"]
    if tariff["kind"] == "dynamic":
        return tariff["window"] or DEFAULT_SEARCH
    return None


def _cost(plan: dict[str, Any], action: dict[str, Any]) -> float:
    """What an action's energy costs at the prices of the plan's hours it runs in."""
    if not action.get("run") or not action.get("energy_kwh"):
        return 0.0
    start = datetime.fromisoformat(action["start"])
    end = datetime.fromisoformat(action["end"])
    prices = plan.get("prices") or {}
    total = 0.0
    for hour in plan.get("hours") or []:
        begin = datetime.fromisoformat(hour["start"])
        overlap = (
            min(end, begin + timedelta(hours=1)) - max(start, begin)
        ).total_seconds()
        if overlap > 0:
            price = hour.get("price")
            if price is None:
                price = prices.get("night" if hour.get("window") else "day") or 0.0
            total += (action.get("power_kw") or 0.0) * overlap / 3600 * price
    return round(total or action["energy_kwh"] * (prices.get("night") or 0.0), 2)


def _same_run(again: dict[str, Any], entry: dict[str, Any]) -> bool:
    """Whether an action worked out again does the same as before."""
    keys = ("run", "start", "end", "target", "car", "plugged", "reasons")
    return all(again.get(k) == entry.get(k) for k in keys) and (
        (again.get("need") or {}).get("missing_kwh")
        == (entry.get("need") or {}).get("missing_kwh")
    )
