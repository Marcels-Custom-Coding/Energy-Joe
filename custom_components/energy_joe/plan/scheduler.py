"""When Joe plans: every five minutes and soon after a change, the plan
itself fixed shortly before the window and worked out again inside it."""

from __future__ import annotations

import asyncio
from collections.abc import Awaitable, Callable
from copy import deepcopy
from dataclasses import replace
from datetime import datetime, timedelta
import logging
import math
from typing import Any

from homeassistant.core import (
    CALLBACK_TYPE,
    Event,
    EventStateChangedData,
    HomeAssistant,
    callback,
)
from homeassistant.helpers.event import (
    async_call_later,
    async_track_point_in_time,
    async_track_state_change_event,
    async_track_time_change,
)
from homeassistant.util import dt as dt_util

from ..observe.store import HistoryStore
from .actions import plan_actions
from .car_calendar import CarCalendarStore
from .cars import action_by_id, car_by_id, detect_all, need_for, point_of
from .ev import car_need
from .inputs import DEFAULT_SEARCH, async_build_input, next_window, point_needs
from .planner import PlanInput, joined_slots, make_plan, share_targets
from .trips import PlaceStore, normalize

_LOGGER = logging.getLogger(__name__)

# Joe plans again every this many minutes, and this many seconds after a
# change (changes within them make one run).
EVERY_MINUTES = 5
SETTLE_S = 30
# A fixed plan's battery target goes up only when it comes out at least this
# much higher (percentage points), and not in the window's last minutes.
RAISE_MIN = 3
RAISE_UNTIL = timedelta(minutes=15)


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
        # What tonight's fixed plan was last worked out again from (for
        # sharing the charging out anew when a target goes up).
        self._night_input: PlanInput | None = None
        # Distances to the places of appointments (for cars charged by need).
        self.places = PlaceStore(hass)
        # Joe's own car calendars (set by the runtime).
        self.calendars: CarCalendarStore | None = None
        # The cars' own accounts (set by the runtime).
        self.accounts: Any = None
        # What the executor changed on the devices, with the values from before.
        self.held: Callable[[], dict[str, Any]] = dict
        # The highest import from the grid the executor measured (or None).
        self.grid_peak: Callable[[], dict[str, Any] | None] = lambda: None
        # Batteries the executor measured charging much slower than planned:
        # battery -> the power (W) to plan them with.
        self.slow: Callable[[], dict[str, float]] = dict
        # Which car is plugged in at each charge point (set by the runtime).
        self.detected: Callable[[], dict[str, dict[str, Any]]] = self._detect
        # Tonight's fixed plan was worked out again: the executor runs these
        # actions anew and charges the raised batteries on (set by the runtime).
        self.replanned: (
            Callable[[list[str], list[dict[str, Any]]], Awaitable[None]] | None
        ) = None
        self.plan: dict[str, Any] | None = None
        # Watching what the plan depends on (forecast, calendars).
        self._inputs: list[CALLBACK_TYPE] = []
        # A change was seen: planning again is due then.
        self._pending: CALLBACK_TYPE | None = None
        # One run at a time (the clock, a change, the panel, fixing the plan).
        self._lock = asyncio.Lock()

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
            async_track_time_change(
                self._hass, self._on_tick, minute=f"/{EVERY_MINUTES}", second=0
            )
        )
        self._watch_inputs()
        await self._async_restore()
        await self.async_refresh()
        self._schedule_commit()

    async def async_stop(self) -> None:
        for unsub in [*self._unsubs, *self._inputs]:
            unsub()
        self._unsubs, self._inputs = [], []
        if self._pending:
            self._pending()
            self._pending = None
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
        if self.active:
            # Other calendars may count now.
            self._watch_inputs()
        await self.async_refresh()
        self._schedule_commit()

    def _watch_inputs(self) -> None:
        """Plan again soon when the solar forecast changes or a calendar with
        the cars' trips does (Joe's own car calendars tell him themselves)."""
        for unsub in self._inputs:
            unsub()
        self._inputs = []
        if entities := watched_entities(self._config):
            self._inputs.append(
                async_track_state_change_event(self._hass, entities, self._on_input)
            )
        if self.calendars is not None:
            self._inputs.append(self.calendars.listen(self.request))

    @callback
    def _on_input(self, event: Event[EventStateChangedData]) -> None:
        old, new = event.data["old_state"], event.data["new_state"]
        if new is None:
            return
        # A calendar shows its next appointment in its attributes; a forecast
        # counts only with a new value (some write their attributes often).
        if new.domain != "calendar" and old is not None and old.state == new.state:
            return
        self.request()

    @callback
    def request(self) -> None:
        """Something the plan depends on changed: plan again in a moment.
        Changes within SETTLE_S make one run (the first one starts the wait)."""
        if not self.active or self._pending is not None:
            return
        self._pending = async_call_later(self._hass, SETTLE_S, self._on_request)

    @callback
    def _on_request(self, now: datetime) -> None:
        self._pending = None
        self._hass.async_create_task(self.async_refresh(), eager_start=False)

    async def async_refresh(self) -> dict[str, Any] | None:
        """Plan again now. A fixed plan keeps its window until it is over:
        inside it, the night is worked out again (see _async_replan_night)."""
        async with self._lock:
            return await self._async_refresh()

    async def _async_refresh(self) -> dict[str, Any] | None:
        now = dt_util.now()
        if self._fixed is not None:
            if datetime.fromisoformat(self._fixed["window"]["end"]) > now:
                try:
                    await self._async_replan_night(now)
                except Exception:
                    _LOGGER.exception("Planning tonight again failed")
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

    async def _async_plan(
        self, now: datetime, fixed: dict[str, Any] | None = None
    ) -> dict[str, Any]:
        try:
            if fixed is not None:
                return await self._async_compute(now, fixed)
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
        async with self._lock:
            return await self._async_correct_needs(location)

    async def _async_correct_needs(self, location: str) -> list[str]:
        if self._fixed is None:
            await self._async_refresh()
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
            for trip in hits:
                # The user's distance is one way from home: the leg from home
                # and the way back home; legs from another place stay.
                if trip.get("from") is None:
                    trip.update(km=round(place["km"], 1), source=place["source"])
                if "back_km" in trip:
                    trip.update(
                        back_km=round(place["km"], 1), back_source=place["source"]
                    )
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
        of the evening stay, only who is plugged in where is new; the whole
        night follows in a moment (the car's level and trips as they are)."""
        async with self._lock:
            if self._fixed is None:
                if self.active:
                    await self._async_refresh()
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
                if self.replanned is not None:
                    # Another car at the charge point: its charge counts anew.
                    await self.replanned(changed, [])
        self.request()
        return changed

    async def async_replan_action(self, action_id: str) -> list[str]:
        """A night action switched by hand ("Heute Nacht") while the plan is
        fixed: it is worked out again inside the fixed window, the rest stays.
        Before the plan is fixed, planning again does it."""
        async with self._lock:
            if self._fixed is None:
                if self.active:
                    await self._async_refresh()
                return []
            fixed = self._fixed
            changed = self._replan_points(fixed, self.detected(), only=action_id)
            if changed:
                await self._history.async_update_day(
                    datetime.fromisoformat(fixed["window"]["start"]).date().isoformat(),
                    plan=fixed,
                )
            self.plan = fixed
            self._changed()
            return changed

    async def _async_replan_night(self, now: datetime) -> None:
        """Tonight's fixed plan worked out again from now on, with the levels
        and the forecast as they are now. The window stays. The night actions
        are worked out anew in it (a car with its level and trips as they are
        now: a new appointment counts at once); a running one is never
        switched off only to start again later. A battery's target only goes
        up: clearly higher now, it is raised with its charging from now on;
        lower, the fixed one stays."""
        fixed = self._fixed
        assert fixed is not None
        self._night_input = None
        plan = await self._async_plan(now, fixed)
        if plan.get("kind") == "unavailable" or not _same_window(plan, fixed):
            return
        again = deepcopy(fixed)
        again["checked"] = now.isoformat(timespec="seconds")
        changed, rearm = _night_actions(again, plan, now)
        again["cars"] = plan.get("cars") or {}
        raised: list[dict[str, Any]] = []
        if datetime.fromisoformat(fixed["window"]["end"]) - now > RAISE_UNTIL:
            raised = _raise_targets(again, plan, now, self._night_input)
        self._fixed = again
        if changed or raised:
            # The day keeps tonight's plan as it is carried out (with the
            # target it was fixed with, for the look back).
            await self._history.async_update_day(
                datetime.fromisoformat(again["window"]["start"]).date().isoformat(),
                plan=again,
            )
        if (rearm or raised) and self.replanned is not None:
            await self.replanned(rearm, raised)

    def _replan_points(
        self,
        fixed: dict[str, Any],
        detected: dict[str, dict[str, Any]],
        cars: list[str] | None = None,
        only: str | None = None,
    ) -> list[str]:
        """Work out the charge points of a fixed plan again (all, or where these
        cars are), or just this one action (a charge point or not)."""
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
        before = {a["id"]: a for a in fixed.get("actions") or []}
        needs = point_needs(config, fixed.get("cars") or {}, detected)
        for car_id, need in (fixed.get("cars") or {}).items():
            need["point"] = point_of(detected, car_id)
        changed: list[str] = []
        for index, entry in enumerate(fixed.get("actions") or []):
            action = actions.get(entry["id"])
            if only is not None and entry["id"] != only:
                continue
            if action is None or (only is None and action.get("point") is None):
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
                before,
            )[0]
            again["cost"] = _cost(fixed, again)
            if _same_run(again, entry):
                continue
            fixed["actions"][index] = again
            changed.append(entry["id"])
        return changed

    async def _async_compute(
        self, now: datetime, fixed: dict[str, Any] | None = None
    ) -> dict[str, Any]:
        """A plan from now on (`fixed`: in that plan's window, see
        _async_replan_night)."""
        window = None
        before = None
        if fixed is not None:
            window = (
                datetime.fromisoformat(fixed["window"]["start"]),
                datetime.fromisoformat(fixed["window"]["end"]),
            )
            before = {a["id"]: a for a in fixed.get("actions") or []}
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
            self.grid_peak(),
            self.slow(),
            window,
            before,
        )
        if inp is None:
            return {
                "kind": "unavailable",
                "reasons": notes,
                "created": now.isoformat(timespec="seconds"),
            }
        if fixed is not None:
            # A maintenance night is one as fixed (a new day after midnight
            # does not make one).
            force = (fixed.get("rules") or {}).get("force_target")
            inp = replace(
                inp,
                force_target=force,
                max_target=max(self._config["rules"]["max_target_soc"], force or 0.0),
            )
            self._night_input = inp
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
        if self._lock.locked():
            # Still at it (a slow forecast or calendar): the next tick.
            return
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
        async with self._lock:
            await self._async_fix_now()

    async def _async_fix_now(self) -> None:
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


def _same_course(again: dict[str, Any], entry: dict[str, Any]) -> bool:
    """Whether an action worked out again runs as before (when, to what, for
    which car; its reasons and what is still missing may move on)."""
    keys = ("run", "start", "end", "target", "car", "plugged")
    return all(again.get(k) == entry.get(k) for k in keys)


def _same_run(again: dict[str, Any], entry: dict[str, Any]) -> bool:
    """Whether an action worked out again does the same as before."""
    keys = ("run", "start", "end", "target", "car", "plugged", "reasons")
    return all(again.get(k) == entry.get(k) for k in keys) and (
        (again.get("need") or {}).get("missing_kwh")
        == (entry.get("need") or {}).get("missing_kwh")
    )


def watched_entities(config: dict[str, Any]) -> list[str]:
    """What the plan depends on and tells when it changes: the solar
    forecast's sensors and the calendars the cars' trips come from."""
    forecast = config.get("forecast") or {}
    found = {
        *(forecast.get("today") or []),
        *(forecast.get("tomorrow") or []),
        *(
            entity
            for source in forecast.get("alternatives") or []
            for entity in source.get("tomorrow") or []
        ),
    }
    cars = [car for car in config.get("cars") or [] if (car.get("need") or {})]
    if any(car["need"].get("enabled") for car in cars):
        found.update(c for p in config.get("persons") or [] for c in p["calendars"])
        found.update(
            c
            for car in cars
            if car["need"].get("enabled")
            for c in car["need"].get("calendars") or []
        )
    return sorted(found)


def _same_window(plan: dict[str, Any], fixed: dict[str, Any]) -> bool:
    """Whether a plan worked out again kept the fixed plan's window."""
    window, other = plan.get("window") or {}, fixed["window"]
    return bool(window) and all(
        datetime.fromisoformat(window[key]) == datetime.fromisoformat(other[key])
        for key in ("start", "end")
    )


def _running(entry: dict[str, Any], now: datetime) -> bool:
    return bool(entry.get("run")) and (
        datetime.fromisoformat(entry["start"])
        <= now
        < datetime.fromisoformat(entry["end"])
    )


def _higher(again: float | None, before: float | None) -> bool:
    return again is not None and (before is None or again > before + 0.05)


def _night_actions(
    fixed: dict[str, Any], plan: dict[str, Any], now: datetime
) -> tuple[list[str], list[str]]:
    """The night actions of a plan worked out again, into the fixed plan.

    Returns the ids whose run changed, and those the executor runs anew:
    switched on now, or with a higher target than before (a new trip).
    """
    before = {a["id"]: a for a in fixed.get("actions") or []}
    actions, changed, rearm = [], [], []
    for again in plan.get("actions") or []:
        entry = before.get(again["id"])
        if (
            entry is not None
            and again.get("run")
            and _running(entry, now)
            and datetime.fromisoformat(again["start"]) > now
        ):
            # Running already: it goes on rather than off now and on again
            # later (it got on faster than Joe expected).
            again = {**again, "start": entry["start"]}
            hours = (
                datetime.fromisoformat(again["end"])
                - datetime.fromisoformat(again["start"])
            ).total_seconds() / 3600
            again["energy_kwh"] = round((again.get("power_kw") or 0.0) * hours, 2)
            again["cost"] = _cost(fixed, again)
        actions.append(again)
        if entry is None or not _same_course(again, entry):
            changed.append(again["id"])
        if again.get("run") and (
            entry is None
            or not entry.get("run")
            or _higher(again.get("target"), entry.get("target"))
        ):
            rearm.append(again["id"])
    fixed["actions"] = actions
    return changed, rearm


def _raise_targets(
    fixed: dict[str, Any],
    plan: dict[str, Any],
    now: datetime,
    inp: PlanInput | None = None,
) -> list[dict[str, Any]]:
    """A battery whose target came out clearly higher now (RAISE_MIN) gets it,
    with its charging from now on; a lower one keeps the fixed target. The
    target the night was fixed with stays as target_fixed (and per battery
    under "raised"). With the input the night was worked out from (`inp`),
    the charging of all batteries is shared out again from now on, so
    together they keep the grid limit. Returns what was raised."""
    if plan.get("kind") not in ("charge", "hold"):
        return []
    if "no_forecast" in (plan.get("notes") or []) and "no_forecast" not in (
        fixed.get("notes") or []
    ):
        # The forecast missing for a moment makes the night look dark.
        return []
    fresh = {b["id"]: b for b in plan.get("batteries") or []}
    up = {
        entry["id"]
        for entry in fixed.get("batteries") or []
        if entry["id"] in fresh
        and fresh[entry["id"]].get("controllable", True)
        and fresh[entry["id"]]["target"] >= entry["target"] + RAISE_MIN
    }
    if not up:
        return []
    why = _why_raised(fixed, plan)
    at = now.isoformat(timespec="seconds")
    eta = math.sqrt((fixed.get("rules") or {}).get("efficiency") or 0.9)
    # Nothing was to be done tonight: the others as worked out now, too.
    whole = fixed.get("kind") == "none"
    raised: list[dict[str, Any]] = []
    batteries = []
    added_kwh = 0.0
    for entry in fixed.get("batteries") or []:
        again = fresh.get(entry["id"])
        if again is None or entry["id"] not in up:
            batteries.append({**again} if whole and again is not None else entry)
            continue
        first = (entry.get("raised") or {}).get("from", entry["target"])
        added = (
            (entry.get("capacity") or 0.0) * (again["target"] - entry["target"]) / 100
        )
        added_kwh += added
        batteries.append(
            {
                **entry,
                **{
                    key: again[key]
                    for key in ("target", "power_kw", "slots", "how", "rank")
                    if key in again
                },
                # What it takes over the whole night: as fixed plus the raise.
                "charge_kwh": round(
                    max(
                        again.get("charge_kwh") or 0.0,
                        (entry.get("charge_kwh") or 0.0) + added,
                    ),
                    2,
                ),
                "grid_kwh": round(
                    max(
                        again.get("grid_kwh") or 0.0,
                        (entry.get("grid_kwh") or 0.0) + added / eta,
                    ),
                    2,
                ),
                "raised": {"from": first, "at": at, "why": why},
            }
        )
        raised.append(
            {
                "battery": entry["id"],
                "name": entry["name"],
                "from": entry["target"],
                "to": again["target"],
                "first": first,
                "at": at,
                "why": why,
                "sun_from": (fixed.get("meta") or {}).get("tomorrow_kwh"),
                "sun_to": (plan.get("meta") or {}).get("tomorrow_kwh"),
            }
        )
    if inp is not None and not whole:
        # The others keep their target, but their charging times as fixed
        # would add up with the raised ones' over the grid limit: all shared
        # out again together, each from its level now (what it has charged
        # counts). One that charges nothing tonight stays so.
        targets = {
            b["id"]: b["target"] for b in batteries if b["id"] in up or b.get("slots")
        }
        shares, left = share_targets(inp, targets)
        batteries = [{**b, **shares.get(b["id"], {})} for b in batteries]
        fixed["unplaced_kwh"] = round(left, 2)
    capacity = fixed.get("capacity_kwh") or sum(
        b.get("capacity") or 0.0 for b in batteries
    )
    target = fixed["target"]
    fixed.setdefault("target_fixed", target)
    if capacity:
        target = max(target, min(100, round(target + 100 * added_kwh / capacity)))
    if whole:
        target = max(target, plan["target"])
        fixed["kind"] = plan["kind"]
        fixed["reasons"] = plan.get("reasons") or []
    elif fixed.get("kind") == "hold" and plan["kind"] == "charge":
        fixed["kind"] = "charge"
    fixed.update(
        target=target,
        target_kwh=round((fixed.get("capacity_kwh") or 0.0) * target / 100, 2),
        batteries=batteries,
        grid_charge_kwh=round(sum(b.get("grid_kwh") or 0.0 for b in batteries), 2),
        # Tomorrow's days as weighed now (the panel's "Warum X %").
        risk=plan.get("risk") or fixed.get("risk"),
        raised=[*(fixed.get("raised") or []), *raised],
    )
    slots = joined_slots([s for b in batteries for s in b.get("slots") or []])
    if slots:
        fixed["charge_slots"] = slots
        fixed["charge_from"] = datetime.fromisoformat(slots[0]["start"]).isoformat(
            timespec="minutes"
        )
    return raised


def _why_raised(fixed: dict[str, Any], plan: dict[str, Any]) -> str:
    """Why a target came out higher: less sun tomorrow than the plan was
    fixed with, more use, or the levels and values of now in general."""
    sun = (fixed.get("meta") or {}).get("tomorrow_kwh")
    sun_now = (plan.get("meta") or {}).get("tomorrow_kwh")
    if sun is not None and sun_now is not None and sun_now < sun - max(0.5, sun * 0.05):
        return "sun"
    home, home_now = fixed.get("home_kwh"), plan.get("home_kwh")
    if (
        home is not None
        and home_now is not None
        and home_now > home + max(0.5, home * 0.05)
    ):
        return "use"
    return "again"
