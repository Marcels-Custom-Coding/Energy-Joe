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
from .ev import car_need
from .inputs import DEFAULT_SEARCH, async_build_input, next_window
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
        # Distances to the places of appointments (for cars charged by need).
        self.places = PlaceStore(hass)
        # Joe's own car calendars (set by the runtime).
        self.calendars: CarCalendarStore | None = None
        # The cars' own accounts (set by the runtime).
        self.accounts: Any = None
        self.plan: dict[str, Any] | None = None

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
            self._fixed = None
        plan = await self._async_plan(now)
        # The plan may have been fixed while this one was worked out: it stays.
        self.plan = self._fixed if self._fixed is not None else plan
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
        actions = {a["id"]: a for a in config["actions"]}
        meta = fixed.get("meta") or {}
        workday = (meta.get("tomorrow") or {}).get("workday", True)
        sun = (
            meta.get("tomorrow_kwh")
            if "no_forecast" not in (fixed.get("notes") or [])
            else None
        )
        start = datetime.fromisoformat(fixed["window"]["start"])
        end = datetime.fromisoformat(fixed["window"]["end"])
        changed: list[str] = []
        for index, entry in enumerate(fixed.get("actions") or []):
            need = entry.get("need")
            action = actions.get(entry["id"])
            if not need or not action or not action.get("need"):
                continue
            trips = need.get("trips") or []
            hits = [t for t in trips if normalize(t["location"]) == key]
            if not hits or place is None:
                continue
            factor = 2 if action["need"]["round_trip"] else 1
            for trip in hits:
                trip.update(km=round(place["km"] * factor, 1), source=place["source"])
            found = car_need(
                action["need"],
                self._hass.states.get,
                trips,
                models.get(entry["id"]),
                need.get("temp"),
                bool(need.get("rain")),
                workday,
            )
            again = plan_actions(
                [action],
                self._hass.states.get,
                start,
                end,
                sun,
                self._manual(),
                config["learned"].get("action_models") or {},
                {entry["id"]: {**found, "trips": trips}},
            )[0]
            again["cost"] = _cost(fixed, again)
            fixed["actions"][index] = again
            changed.append(entry["id"])
        if changed:
            await self._history.async_update_day(start.date().isoformat(), plan=fixed)
            self.plan = fixed
            self._changed()
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
            if (
                plan
                and plan.get("fixed")
                and datetime.fromisoformat(plan["window"]["end"]) > now
            ):
                self._fixed = plan
                self._fixed_span = (plan.get("search") or plan["window"])["start"]
                return

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
