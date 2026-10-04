"""Joe at the controls: he steers the batteries through the cheap window and lets go.

Every minute (and whenever a battery's charge level changes) Joe compares what
each battery should do with what its entities show, and writes only the
difference. Before he changes an entity the first time in a night, he notes
its value; at the end of the window he puts all of them back. The same release
runs when Joe is switched to simulation or off, after a restart outside the
window and from the panel's emergency button, and keeps trying until every
value is back ("reset guarantee").

What someone else changes while Joe steers stays as it is: Joe notes it as an
external change and leaves that entity alone for the rest of the night.
"""

from __future__ import annotations

import asyncio
from collections.abc import Callable
from datetime import datetime, timedelta
import logging
import math
from typing import Any

from homeassistant.const import EVENT_HOMEASSISTANT_STOP
from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant, callback
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_change,
    async_track_time_interval,
)
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from ..const import DOMAIN
from ..observe.readings import distance_km, measurement_kw, number
from ..plan.actions import condition_met
from .actions import ActionAdapter
from .adapters import Adapter, Desired, RoleAdapter, make_adapter
from .writes import Write, WriteError, async_apply, fit, matches, read

_LOGGER = logging.getLogger(__name__)

STORE_KEY = f"{DOMAIN}.control"
STORE_VERSION = 1
CHECK_EVERY = timedelta(minutes=1)
# A value Joe wrote may take this long to show; after that it counts as not taken.
SETTLE = timedelta(seconds=90)
# How often Joe writes the same value again when the device does not take it.
RETRY = timedelta(minutes=5)
# Release attempts before Joe raises the alarm (he keeps trying anyway).
RELEASE_ALARM = 3
LOG_SIZE = 100
# A test run: how long each step lasts (seconds).
TEST_HOLD = 20
TEST_CHARGE = 25
TEST_RELEASE = 8
# A test is valid this long, as long as the way of steering stays the same.
TEST_VALID = timedelta(days=180)
# Safety: charging pauses this long when the house draws more than the grid
# limit, and a battery that has not gained a percent in this time is reported.
GRID_PAUSE = timedelta(minutes=5)
GRID_MARGIN = 1.02
NO_PROGRESS = timedelta(minutes=30)
# Charging to a level by hand ends after this at the latest.
BOOST_LIMIT = timedelta(hours=24)
# A grid-friendly morning lets go when the rest of the sun, taken with this
# caution, no longer fills the batteries.
DAY_CAUTION = 0.8

DEFAULT_DATA: dict[str, Any] = {
    "saved": {},
    # Batteries Joe acted on this night (also by service calls, which leave no values).
    "active": [],
    # Per battery: the service calls of its current state (made once per state).
    "calls": {},
    "written": {},
    "external": [],
    "floors": {},
    "reached": [],
    "first": {},
    "steered": False,
    "night": None,
    # Night actions: switched on "tonight" by hand (action id -> night), finished.
    "tonight": {},
    # "Tonight up to …" for a car: action id -> night, target, chosen, unit, sensor.
    "tonight_target": {},
    "done": [],
    "skip": None,
    "answer": None,
    "tests": {},
    "log": [],
    "failures": 0,
    # Charging paused for the grid limit until then (ISO time).
    "paused": None,
    # Per charging battery: since when and from which level it should rise.
    "progress": {},
    # "Just charge to …" by hand: action id -> target, unit, sensor, since, until.
    "boost": {},
    # The night whose grid-friendly morning runs, or was let go early.
    "day": None,
    "day_released": None,
}

type Changed = Callable[[], None]


def _charging_time(plan: dict[str, Any], now: datetime) -> bool:
    """Whether the plan charges now: in one of its quarter-hour slots, or after
    the last one until the target is reached (older plans: from charge_from on)."""
    if plan.get("kind") != "charge":
        return False
    slots = plan.get("charge_slots")
    if slots:
        if any(
            datetime.fromisoformat(slot["start"])
            <= now
            < datetime.fromisoformat(slot["end"])
            for slot in slots
        ):
            return True
        return now >= datetime.fromisoformat(slots[-1]["end"])
    charge_from = plan.get("charge_from")
    return charge_from is not None and now >= datetime.fromisoformat(charge_from)


class JoeExecutor:
    """Applies tonight's plan to the batteries in the modes "suggest" and "live"."""

    def __init__(
        self,
        hass: HomeAssistant,
        config: Callable[[], dict[str, Any]],
        plan: Callable[[], dict[str, Any] | None],
        mode: Callable[[], str],
        changed: Changed,
    ) -> None:
        """Set up; call async_load and async_start to begin."""
        self._hass = hass
        self._config = config
        self._plan = plan
        self._mode = mode
        self._changed = changed
        self._store: Store[dict[str, Any]] = Store(hass, STORE_VERSION, STORE_KEY)
        self.data: dict[str, Any] = _fresh()
        self._lock = asyncio.Lock()
        self._unsubs: list[CALLBACK_TYPE] = []
        self._soc_unsub: CALLBACK_TYPE | None = None
        self._ask_unsub: CALLBACK_TYPE | None = None
        self._ask_time: str | None = None
        self._watched: tuple[str, ...] = ()
        self._last_release_try: datetime | None = None
        self.notifier: Any = None
        self.testing: dict[str, Any] | None = None
        self.status: dict[str, Any] = {
            "steering": False,
            "reason": "simulation",
            "night": None,
            "batteries": {},
            "actions": {},
            "pending": False,
        }

    # --- lifecycle -----------------------------------------------------------

    async def async_load(self) -> None:
        if stored := await self._store.async_load():
            self.data = {**_fresh(), **stored}

    @property
    def active(self) -> bool:
        return bool(self._unsubs)

    async def async_start(self) -> None:
        """Start checking (also releases what a crash left behind)."""
        await self.async_stop(release=False)
        self._unsubs.append(
            async_track_time_interval(self._hass, self._on_tick, CHECK_EVERY)
        )
        self._unsubs.append(
            self._hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STOP, self._on_stop)
        )
        self.schedule_ask()
        await self.async_check()

    async def async_stop(self, release: bool = True) -> None:
        for unsub in self._unsubs:
            unsub()
        self._unsubs = []
        if self._ask_unsub:
            self._ask_unsub()
            self._ask_unsub = None
            self._ask_time = None
        if self._soc_unsub:
            self._soc_unsub()
            self._soc_unsub = None
            self._watched = ()
        if release and self._dirty:
            async with self._lock:
                await self._async_release("stopped")

    @callback
    def _on_tick(self, now: datetime) -> None:
        self._hass.async_create_task(self.async_check(), eager_start=False)

    @callback
    def schedule_ask(self) -> None:
        """Ask at the configured time (the "suggest" mode); follows changes of the time."""
        ask_time = self._config()["rules"]["ask_time"]
        if ask_time == self._ask_time and self._ask_unsub:
            return
        if self._ask_unsub:
            self._ask_unsub()
        hour, minute = (int(part) for part in ask_time.split(":"))
        self._ask_time = ask_time
        self._ask_unsub = async_track_time_change(
            self._hass, self._on_ask, hour=hour, minute=minute, second=0
        )

    @callback
    def _on_ask(self, now: datetime) -> None:
        self._hass.async_create_task(self.async_ask(), eager_start=False)

    async def async_ask(self) -> bool:
        """Ask whether Joe may steer tonight; False if there is nothing to ask."""
        plan = self._plan()
        if (
            self._mode() != "advisory"
            or not plan
            or plan.get("kind") not in ("charge", "hold")
            or not plan.get("window")
            or self.notifier is None
        ):
            return False
        night = plan["window"]["start"]
        if (self.data["answer"] or {}).get("night") == night:
            return False
        self._log("ask", night=night, target=plan.get("target"))
        await self.notifier.async_ask(plan)
        await self._async_save()
        return True

    async def _on_stop(self, event: Event) -> None:
        """Home Assistant stops: give everything back, so nothing stays set if it stays down."""
        if self._dirty:
            try:
                async with asyncio.timeout(15), self._lock:
                    await self._async_release("ha_stop")
            except TimeoutError:
                _LOGGER.warning(
                    "Release at shutdown did not finish; it runs after the start"
                )

    # --- the check -------------------------------------------------------------

    async def async_check(self) -> None:
        """Bring the batteries in line with the plan, or release them."""
        if self._lock.locked() and self.testing:
            return
        async with self._lock:
            if self.testing:
                return
            try:
                await self._async_check(dt_util.now())
            except Exception:
                _LOGGER.exception("Steering check failed")

    async def _async_check(self, now: datetime) -> None:
        config, plan, mode = self._config(), self._plan(), self._mode()
        reason, night = self._why(now, config, plan, mode)
        boosts, keep, ended = await self._async_boosts(config, mode, now)
        if reason != "steering":
            day, held = await self._async_day(config, plan, mode, now)
            keep |= held
            if self._dirty_except(keep):
                # The grid-friendly morning is over: its own reason, no second
                # morning message.
                was_day = self.data.get("day") is not None and not day
                await self._async_release("day_done" if was_day else reason, now, keep)
            if not day:
                self.data["day"] = None
            if self.data["night"] and self.data["night"] != night:
                self._end_night()
            self._set_status("day" if day else reason, night, day, boosts, keep)
            self._watch([])
            if boosts or ended or day:
                await self._async_save()
            return
        assert plan is not None and night is not None
        if self.data["night"] != night:
            self._start_night(night)
        items = self._steerable(config, plan)
        socs = {
            battery["id"]: number(self._hass.states.get(battery["soc_entity"]))
            for battery, _, _ in items
        }
        desired = self._desired(plan, items, socs, now)
        desired = self._guard_grid(config, desired, socs, now)
        await self._async_watch_progress(items, desired, socs, now)
        batteries: dict[str, Any] = {}
        for battery, planned, adapter in items:
            soc = socs[battery["id"]]
            want = desired.get(battery["id"])
            if soc is not None and adapter is not None:
                self.data["first"].setdefault(battery["id"], round(soc, 1))
            entry = {
                "action": _action(want),
                "floor": want.floor if want else None,
                "target": planned["target"],
                "soc": soc,
                "problem": None,
            }
            if adapter is None:
                entry["action"] = "watch"
                entry["problem"] = self._watch_reason(battery)
            elif soc is None:
                entry["problem"] = "soc_unknown"
            elif want is not None:
                problem = await self._async_steer(adapter, want, soc, now)
                entry["problem"] = problem
            batteries[battery["id"]] = entry
        actions = await self._async_actions(config, plan, night, now, set(boosts))
        self._set_status("steering", night, batteries, {**actions, **boosts})
        self._watch([b["soc_entity"] for b, _, a in items if a is not None])
        await self._async_save()

    async def _async_actions(
        self,
        config: dict[str, Any],
        plan: dict[str, Any],
        night: str,
        now: datetime,
        boosted: set[str] | None = None,
    ) -> dict[str, Any]:
        """Switch night actions on in their time and back when done."""
        by_id = {a["id"]: a for a in config["actions"]}
        result: dict[str, Any] = {}
        for entry in plan.get("actions") or []:
            action = by_id.get(entry["id"])
            if action is None or not action.get("enabled", True):
                continue
            if action["id"] in (boosted or set()):
                # Charging to a level by hand: that wins over the plan.
                continue
            adapter = ActionAdapter(action)
            manual = self.data["tonight"].get(action["id"]) == night
            run = entry["run"] or manual
            start = datetime.fromisoformat(entry["start"])
            end = datetime.fromisoformat(entry["end"])
            target = entry.get("target")
            if manual and not entry.get("manual") and entry.get("kind") == "switch":
                # "Tonight" by hand after the plan was fixed: like in plan_actions,
                # the whole window and no target (not the charge shortened by need).
                start = datetime.fromisoformat(plan["window"]["start"])
                target = None
            chosen = self.data["tonight_target"].get(action["id"])
            if manual and chosen and chosen.get("night") == night:
                # "Tonight up to …" by hand: the whole window, up to that level.
                start = datetime.fromisoformat(plan["window"]["start"])
                target = chosen["target"]
                entry = {
                    **entry,
                    "sensor": chosen["sensor"],
                    "need": {"target_unit": chosen["unit"], "sensor": chosen["sensor"]},
                }
            reason: str | None = None
            on = False
            if action["id"] in self.data["done"]:
                reason = "reached"
            elif not run:
                reason = "not_tonight"
            elif now < start:
                reason = "later"
            elif now >= end:
                reason = "over"
            elif (
                not manual
                and adapter.entity_id not in self.data["saved"]
                and not all(
                    condition_met(
                        self._hass.states.get(c["entity_id"]), c["op"], c["value"]
                    )
                    for c in action.get("conditions") or []
                )
            ):
                reason = "conditions"
            elif target is not None and self._target_reached(
                action, {**entry, "target": target}
            ):
                reason = "reached"
                self.data["done"].append(action["id"])
                self._log(
                    "action_done",
                    battery=adapter.battery["id"],
                    target=target,
                )
            else:
                on = True
            writes = adapter.on() if on else adapter.release(self.data["saved"])
            problem = None
            if writes:
                problem = await self._async_write(
                    adapter, writes, now, "action_on" if on else "action_off"
                )
                if not on and all(
                    matches(self._hass, fit(self._hass, w)) for w in writes
                ):
                    # Back as it should be: nothing left to restore for this action.
                    self.data["saved"].pop(adapter.entity_id, None)
                    self.data["written"].pop(adapter.entity_id, None)
            result[action["id"]] = {
                "on": on,
                "reason": reason,
                "start": start.isoformat(timespec="minutes"),
                "end": entry["end"],
                "target": target,
                "problem": problem,
            }
        return result

    def _target_reached(self, action: dict[str, Any], entry: dict[str, Any]) -> bool:
        """Hot water at its temperature, or a car at the level (or range) it needs."""
        sensor = entry.get("sensor") or action.get("sensor_entity") or ""
        state = self._hass.states.get(sensor)
        need = entry.get("need") or {}
        # A range target is in km; the car may report miles.
        if need.get("target_unit") == "km" and sensor == need.get("sensor"):
            value = distance_km(state)
        else:
            value = number(state)
        target = entry.get("target")
        return value is not None and target is not None and value >= target

    def _why(
        self,
        now: datetime,
        config: dict[str, Any],
        plan: dict[str, Any] | None,
        mode: str,
    ) -> tuple[str, str | None]:
        """Whether Joe steers now, and the night it is about."""
        if mode in ("simulation", "off"):
            return mode, None
        if not plan or not plan.get("window") or plan.get("kind") == "unavailable":
            return "no_plan", None
        night = plan["window"]["start"]
        start = datetime.fromisoformat(plan["window"]["start"])
        end = datetime.fromisoformat(plan["window"]["end"])
        lead = timedelta(minutes=config["rules"]["reset_lead_min"])
        if not plan.get("fixed"):
            return ("waiting" if now < start else "no_plan"), night
        if not start <= now < end - lead:
            return ("waiting" if now < start else "done"), night
        if plan.get("kind") == "none" and not any(
            a.get("run") or self.data["tonight"].get(a["id"]) == night
            for a in plan.get("actions") or []
        ):
            return "nothing", night
        if self.data["skip"] == night:
            return "skipped", night
        if mode == "advisory":
            answer = self.data["answer"] or {}
            if answer.get("night") != night or answer.get("yes") is not True:
                return (
                    "declined" if answer.get("night") == night else "unanswered"
                ), night
        return "steering", night

    def _steerable(
        self, config: dict[str, Any], plan: dict[str, Any]
    ) -> list[tuple[dict[str, Any], dict[str, Any], Adapter | None]]:
        """The batteries of the plan with their adapter (None: Joe only watches)."""
        planned = {b["id"]: b for b in plan.get("batteries") or []}
        result = []
        for battery in config["batteries"]:
            if battery["id"] not in planned:
                continue
            adapter = make_adapter(battery)
            if adapter is not None and not self.tested(battery):
                adapter = None
            if adapter is not None and adapter.missing(self._hass):
                adapter = None
            result.append((battery, planned[battery["id"]], adapter))
        return result

    def _watch_reason(self, battery: dict[str, Any]) -> str:
        adapter = make_adapter(battery)
        if adapter is None:
            return "not_controllable"
        if adapter.missing(self._hass):
            return "controls_missing"
        return "not_tested"

    def tested(self, battery: dict[str, Any]) -> bool:
        """A test run passed for the way this battery is steered now."""
        adapter = make_adapter(battery)
        test = self.data["tests"].get(battery["id"])
        if adapter is None or not test or not test.get("ok"):
            return False
        if test.get("signature") != adapter.signature:
            return False
        at = datetime.fromisoformat(test["at"])
        return dt_util.now() - at < TEST_VALID

    def _desired(
        self,
        plan: dict[str, Any],
        items: list[tuple[dict[str, Any], dict[str, Any], Adapter | None]],
        socs: dict[str, float | None],
        now: datetime,
    ) -> dict[str, Desired]:
        """What each battery should do: charge, hold at a floor, or nothing."""
        if plan.get("kind") == "none":
            return {}
        mode = (plan.get("rules") or {}).get("discharge_mode", "until_target")
        window = plan.get("window") or {}
        span = (
            (
                datetime.fromisoformat(window["end"])
                - datetime.fromisoformat(window["start"])
            ).total_seconds()
            if window
            else None
        )
        charging_time = _charging_time(plan, now)
        floors: dict[str, int] = self.data["floors"]
        reached: list[str] = self.data["reached"]
        result: dict[str, Desired] = {}
        for battery, planned, adapter in items:
            soc = socs.get(battery["id"])
            if adapter is None or soc is None:
                continue
            key = battery["id"]
            target = int(planned["target"])
            if charging_time and key not in reached and soc >= target - 0.5:
                reached.append(key)
                self._log("reached", battery=key, target=target, soc=round(soc, 1))
                self._fire("target_reached", battery=key, target=target)
            if charging_time and key not in reached and adapter.can_charge:
                power = (planned.get("power_kw") or 0) * 1000 or None
                result[key] = Desired(charge_to=target, power_w=power, span_s=span)
                # Between charging slots Joe holds what the battery has by then.
                floors.pop(key, None)
                continue
            if key in reached:
                floors[key] = target
            if mode == "free" and key not in reached:
                result[key] = Desired(span_s=span)
                continue
            if key not in floors:
                floors[key] = target if soc > target else max(0, math.floor(soc))
            result[key] = Desired(floor=floors[key], span_s=span)
        # No battery may charge another one through the house.
        if any(d.charge_to is not None for d in result.values()):
            for key, want in list(result.items()):
                if want.charge_to is None:
                    result[key] = Desired(floor=want.floor, block=True, span_s=span)
        return result

    async def _async_steer(
        self, adapter: Adapter, want: Desired, soc: float, now: datetime
    ) -> str | None:
        """Write what differs; note originals first. Returns a problem, if any."""
        writes = adapter.writes(
            self._hass, self._floored(adapter, want), soc, self.data["saved"]
        )
        problem = await self._async_write(adapter, writes, now, _action(want))
        if (
            want.charge_to is not None
            and self.status["batteries"].get(adapter.battery["id"], {}).get("action")
            != "charge"
        ):
            self._fire(
                "charge_started", battery=adapter.battery["id"], target=want.charge_to
            )
        return problem

    async def _async_write(
        self, adapter: Adapter, writes: list[Write], now: datetime, label: str | None
    ) -> str | None:
        """Apply writes that differ (calls once per state); note originals first."""
        saved: dict[str, Any] = self.data["saved"]
        written: dict[str, Any] = self.data["written"]
        external: list[str] = self.data["external"]
        key = adapter.battery["id"]
        self._notice_external(adapter, now)
        problem = None
        # Service calls are made once per state, not every minute.
        calls = [[w.entity_id, w.value] for w in writes if w.is_call]
        last = self.data["calls"].get(key) or {}
        new_calls = bool(calls) and (
            last.get("sig") != calls
            or (
                not last.get("ok")
                and now - datetime.fromisoformat(last.get("at", now.isoformat()))
                >= RETRY
            )
        )
        calls_ok = True
        for write in writes:
            if write.is_call:
                if not new_calls:
                    continue
                try:
                    await async_apply(self._hass, write)
                except WriteError as err:
                    problem = err.code
                    self._log(
                        "failed", battery=key, entity=err.entity_id, code=err.code
                    )
                    calls_ok = False
                    continue
                self._mark_active(key)
                self._log("call", battery=key, entity=write.entity_id, action=label)
                continue
            if write.entity_id in external:
                continue
            write = fit(self._hass, write)
            entry = written.get(write.entity_id)
            if matches(self._hass, write):
                if entry and entry["value"] == write.value:
                    entry["confirmed"] = True
                continue
            if (
                entry
                and entry["value"] == write.value
                and now - datetime.fromisoformat(entry["at"]) < RETRY
            ):
                if (
                    not entry.get("confirmed")
                    and now - datetime.fromisoformat(entry["at"]) > SETTLE
                ):
                    problem = "not_taken"
                continue
            if write.entity_id not in saved:
                original = read(self._hass, write.entity_id)
                if original is None:
                    problem = "unavailable"
                    continue
                saved[write.entity_id] = original
            try:
                await async_apply(self._hass, write)
            except WriteError as err:
                problem = err.code
                self._log(
                    "failed",
                    battery=adapter.battery["id"],
                    entity=err.entity_id,
                    code=err.code,
                )
                continue
            first = entry is None
            self.data["steered"] = True
            self._mark_active(key)
            written[write.entity_id] = {
                "value": write.value,
                "at": now.isoformat(timespec="seconds"),
                "confirmed": False,
                "battery": adapter.battery["id"],
            }
            if first or label in ("action_on", "action_off"):
                self._log(
                    label if label in ("action_on", "action_off") else "set",
                    battery=key,
                    entity=write.entity_id,
                    value=write.value,
                    action=label,
                )
                if label in ("action_on", "action_off"):
                    self._fire(
                        "action_activated" if label == "action_on" else "action_reset",
                        action=key.removeprefix("action:"),
                        entity_id=write.entity_id,
                    )
        if new_calls:
            self.data["calls"][key] = {
                "sig": calls,
                "at": now.isoformat(timespec="seconds"),
                "ok": calls_ok,
            }
        return problem

    def _floored(self, adapter: Adapter, want: Desired) -> Desired:
        """Never hold a battery below the floor it had before (its own minimum)."""
        if want.floor is None:
            return want
        entity_id = adapter.controls.get("min_soc", "")
        original = self.data["saved"].get(entity_id)
        if original is None:
            original = read(self._hass, entity_id) if entity_id else None
        if isinstance(adapter, RoleAdapter) and isinstance(original, int | float):
            original = adapter._level("min_soc", original)
        if isinstance(original, int | float) and want.floor < original:
            return Desired(
                floor=math.ceil(original),
                block=want.block,
                charge_to=want.charge_to,
                power_w=want.power_w,
                span_s=want.span_s,
            )
        return want

    def _mark_active(self, key: str) -> None:
        if key not in self.data["active"]:
            self.data["active"].append(key)

    @property
    def _dirty(self) -> bool:
        """Something is still set or running that the release has to undo."""
        return bool(self.data["saved"] or self.data["active"])

    def _dirty_except(self, keep: set[str]) -> bool:
        """Like _dirty, apart from the entities of cars charging by hand."""
        config = self._config()
        return any(e not in keep for e in self.data["saved"]) or any(
            not _kept(k, keep, config) for k in self.data["active"]
        )

    # --- grid-friendly mornings -----------------------------------------------

    async def _async_day(
        self,
        config: dict[str, Any],
        plan: dict[str, Any] | None,
        mode: str,
        now: datetime,
    ) -> tuple[dict[str, Any], set[str]]:
        """After the night: hold back charging until the midday sun (see planner._grid_friendly).

        Only batteries with a charge limit and a passed test run, only in the
        modes "suggest" (with a yes for the night) and "live". When the sun
        stays behind the forecast, Joe lets go early.
        """
        info = (plan or {}).get("day")
        if (
            not info
            or not plan
            or not plan.get("fixed")
            or not config["rules"].get("grid_friendly", True)
            or mode not in ("advisory", "live")
        ):
            return {}, set()
        night = plan["window"]["start"]
        until = datetime.fromisoformat(info["defer_until"])
        lead = timedelta(minutes=config["rules"]["reset_lead_min"])
        if not datetime.fromisoformat(plan["window"]["end"]) - lead <= now < until:
            return {}, set()
        if self.data["skip"] == night or self.data.get("day_released") == night:
            return {}, set()
        answer = self.data["answer"] or {}
        if mode == "advisory" and (
            answer.get("night") != night or not answer.get("yes")
        ):
            return {}, set()
        items = []
        for battery in config["batteries"]:
            adapter = make_adapter(battery)
            if (
                isinstance(adapter, RoleAdapter)
                and adapter.can_defer()
                and self.tested(battery)
                and not adapter.missing(self._hass)
            ):
                soc = number(self._hass.states.get(battery["soc_entity"]))
                items.append((battery, adapter, soc))
        if not items:
            return {}, set()
        # Is the rest of the sun (with caution) still enough to fill them?
        sizes = {b["id"]: b.get("capacity") for b in plan.get("batteries") or []}
        headroom = sum(
            (sizes.get(battery["id"]) or battery.get("capacity_kwh") or 0.0)
            * (100 - (soc or 0.0))
            / 100
            for battery, _, soc in items
        )
        remaining = sum(
            max(0.0, hour["solar"] - hour["home"]) * DAY_CAUTION
            for hour in plan.get("hours") or []
            if datetime.fromisoformat(hour["start"]) >= now.replace(minute=0, second=0)
        )
        if remaining < headroom:
            self.data["day_released"] = night
            self._log(
                "day_released",
                remaining=round(remaining, 1),
                headroom=round(headroom, 1),
            )
            return {}, set()
        result: dict[str, Any] = {}
        keep: set[str] = set()
        for battery, adapter, soc in items:
            writes = adapter.defer()
            problem = await self._async_write(adapter, writes, now, None)
            keep |= {w.entity_id for w in writes}
            result[battery["id"]] = {
                "action": "defer",
                "until": info["defer_until"],
                "floor": None,
                "target": None,
                "soc": soc,
                "problem": problem,
            }
        if self.data.get("day") != night:
            self.data["day"] = night
            self._log("day", until=info["defer_until"])
        return result, keep

    # --- charging to a level by hand ----------------------------------------

    async def async_boost(
        self, action_id: str, target: float | None, unit: str = "%"
    ) -> None:
        """Charge the car now until a level (%) or a range (km, plus the reserve).

        It does not wait for the cheap window, and it also switches in the
        simulation: the user asked for it. Stops at the target, after a day,
        or with async_boost_stop.
        """
        action = next(
            (a for a in self._config()["actions"] if a["id"] == action_id), None
        )
        if action is None or action["kind"] != "switch":
            raise ValueError("unknown_action")
        if target is None:
            async with self._lock:
                self.data["boost"].pop(action_id, None)
            await self.async_check()
            return
        need = action.get("need") or {}
        sensor = need.get("soc_entity") if unit == "%" else need.get("range_entity")
        if not sensor:
            raise ValueError("no_sensor")
        reserve = need.get("reserve_km", 50.0) if unit == "km" else 0.0
        now = dt_util.now()
        async with self._lock:
            self.data["boost"][action_id] = {
                "target": round(float(target) + reserve, 1),
                "chosen": float(target),
                "unit": unit,
                "sensor": sensor,
                "since": now.isoformat(timespec="seconds"),
                "until": (now + BOOST_LIMIT).isoformat(timespec="seconds"),
            }
            self._log("boost", battery=f"action:{action_id}", target=target, unit=unit)
            await self._async_save()
        await self.async_check()

    async def _async_boosts(
        self, config: dict[str, Any], mode: str, now: datetime
    ) -> tuple[dict[str, Any], set[str], bool]:
        """Keep cars that charge to a level by hand switched on; end finished ones."""
        result: dict[str, Any] = {}
        keep: set[str] = set()
        ended = False
        boosts: dict[str, Any] = self.data["boost"]
        by_id = {a["id"]: a for a in config["actions"]}
        for action_id, boost in list(boosts.items()):
            action = by_id.get(action_id)
            state = self._hass.states.get(boost["sensor"])
            value = distance_km(state) if boost["unit"] == "km" else number(state)
            end = None
            if action is None or mode == "off":
                end = "stopped"
            elif value is not None and value >= boost["target"]:
                end = "reached"
            elif now >= datetime.fromisoformat(boost["until"]):
                end = "expired"
            if end:
                ended = True
                del boosts[action_id]
                self._log("boost_end", battery=f"action:{action_id}", reason=end)
                if end == "reached":
                    self._fire("action_reset", action=action_id, reason="boost_reached")
                continue
            assert action is not None
            adapter = ActionAdapter(action)
            problem = await self._async_write(adapter, adapter.on(), now, "action_on")
            keep.add(adapter.entity_id)
            result[action_id] = {
                "on": problem is None,
                "reason": "boost",
                "start": boost["since"],
                "end": boost["until"],
                "target": boost["target"],
                "chosen": boost["chosen"],
                "unit": boost["unit"],
                "value": value,
                "problem": problem,
            }
        return result, keep, ended

    def _notice_external(self, adapter: Adapter, now: datetime) -> None:
        """Values Joe set that someone else changed: leave them alone tonight."""
        written: dict[str, Any] = self.data["written"]
        for entity_id in adapter.entities():
            entry = written.get(entity_id)
            if not entry or entity_id in self.data["external"]:
                continue
            if matches(self._hass, Write(entity_id, entry["value"])):
                entry["confirmed"] = True
                continue
            if entry.get("confirmed"):
                self.data["external"].append(entity_id)
                value = read(self._hass, entity_id)
                self._log(
                    "external",
                    battery=adapter.battery["id"],
                    entity=entity_id,
                    value=value,
                )
                self._fire("external_change", entity_id=entity_id, value=value)
                # What someone else set is theirs: Joe does not restore it.
                self.data["saved"].pop(entity_id, None)

    # --- release ---------------------------------------------------------------

    async def async_release_now(self) -> None:
        """The emergency button: everything back now, and no steering tonight."""
        async with self._lock:
            plan = self._plan()
            if plan and plan.get("window"):
                self.data["skip"] = plan["window"]["start"]
            self._log("emergency")
            await self._async_release("emergency")
            self._set_status("skipped", self.status.get("night"), {}, {})
            await self._async_save()

    async def _async_release(
        self, reason: str, now: datetime | None = None, keep: set[str] | None = None
    ) -> None:
        """Put back every value Joe noted; keep what fails for the next try.

        Entities in `keep` (a car charging to a level by hand) stay as they are.
        """
        now = now or dt_util.now()
        keep = keep or set()
        saved: dict[str, Any] = self.data["saved"]
        written: dict[str, Any] = self.data["written"]
        if not self._dirty_except(keep):
            return
        if (
            self.data["failures"]
            and self._last_release_try
            and now - self._last_release_try < RETRY
        ):
            return
        self._last_release_try = now
        writes: list[Write] = []
        covered: set[str] = set()
        active: list[str] = self.data["active"]
        for battery in self._config()["batteries"]:
            adapter = make_adapter(battery)
            if adapter is None:
                continue
            for write in adapter.release(saved):
                if write.is_call:
                    # Release calls (e.g. "stop forcible charge") for batteries Joe used.
                    if battery["id"] in active:
                        writes.append(write)
                elif write.entity_id in saved and write.entity_id not in covered:
                    writes.append(write)
                    covered.add(write.entity_id)
        for action in self._config()["actions"]:
            for write in ActionAdapter(action).release(saved):
                if write.entity_id not in covered:
                    writes.append(write)
                    covered.add(write.entity_id)
        # Entities of batteries that are gone or steered differently now.
        for entity_id in reversed(list(saved)):
            if entity_id not in covered:
                writes.append(Write(entity_id, saved[entity_id]))
        writes = [w for w in writes if w.entity_id not in keep]
        errors: list[str] = []
        for write in writes:
            if write.is_call:
                try:
                    await async_apply(self._hass, write)
                except WriteError as err:
                    errors.append(err.entity_id)
                continue
            entry = written.get(write.entity_id)
            if (
                entry
                and entry.get("confirmed")
                and not matches(self._hass, Write(write.entity_id, entry["value"]))
                and not matches(self._hass, write)
            ):
                # Someone changed it after Joe: theirs now.
                saved.pop(write.entity_id, None)
                written.pop(write.entity_id, None)
                continue
            if not matches(self._hass, fit(self._hass, write)):
                try:
                    await async_apply(self._hass, write)
                except WriteError as err:
                    errors.append(err.entity_id)
                    continue
            if matches(self._hass, fit(self._hass, write)):
                saved.pop(write.entity_id, None)
                written.pop(write.entity_id, None)
            else:
                errors.append(write.entity_id)
        if not errors:
            self.data["active"] = [
                k for k in self.data["active"] if _kept(k, keep, self._config())
            ]
            self.data["calls"] = {}
        if errors:
            self.data["failures"] += 1
            self._log("release_failed", reason=reason, entities=errors)
            if self.data["failures"] >= RELEASE_ALARM and self.notifier:
                await self.notifier.async_problem("release_failed", entities=errors)
        else:
            if self.data["failures"] >= RELEASE_ALARM and self.notifier:
                await self.notifier.async_clear("release_failed")
            self.data["failures"] = 0
            self._log("released", reason=reason)
            self._fire("released", reason=reason)
            if reason == "done" and self.data["steered"] and self.notifier:
                await self.notifier.async_morning(self._summary())
        await self._async_save()

    def _summary(self) -> str:
        """ "BYD 23 → 62 %, Venus 40 → 62 %" for the morning message."""
        parts = []
        for battery in self._config()["batteries"]:
            first = self.data["first"].get(battery["id"])
            soc = number(self._hass.states.get(battery["soc_entity"]))
            if first is not None and soc is not None:
                parts.append(f"{battery['name']} {first:.0f} → {soc:.0f} %")
        return ", ".join(parts)

    # --- nights ------------------------------------------------------------------

    def _guard_grid(
        self,
        config: dict[str, Any],
        desired: dict[str, Desired],
        socs: dict[str, float | None],
        now: datetime,
    ) -> dict[str, Desired]:
        """Protect the main fuse: while the house draws more than the grid limit,
        the batteries hold instead of charging, for a few minutes at a time."""
        rules = config["rules"]
        charging = [k for k, d in desired.items() if d.charge_to is not None]
        if not rules["guard_grid"] or not rules["grid_limit_w"] or not charging:
            return desired
        grid = measurement_kw(
            self._hass.states.get, config["measurements"]["grid_power"]
        )
        paused = self.data["paused"]
        if grid is not None and grid * 1000 > rules["grid_limit_w"] * GRID_MARGIN:
            if not paused or datetime.fromisoformat(paused) <= now:
                self._log("grid_guard", power=round(grid, 2))
            self.data["paused"] = (now + GRID_PAUSE).isoformat()
        elif paused and datetime.fromisoformat(paused) <= now:
            self.data["paused"] = None
        if not self.data["paused"]:
            return desired
        result = dict(desired)
        for key in charging:
            soc = socs.get(key)
            result[key] = Desired(
                floor=max(0, math.floor(soc)) if soc is not None else None,
                span_s=desired[key].span_s,
            )
        return result

    async def _async_watch_progress(
        self,
        items: list[tuple[dict[str, Any], dict[str, Any], Adapter | None]],
        desired: dict[str, Desired],
        socs: dict[str, float | None],
        now: datetime,
    ) -> None:
        """A battery that should charge but does not rise gets reported, once a night."""
        progress: dict[str, Any] = self.data["progress"]
        names = {battery["id"]: battery["name"] for battery, _, _ in items}
        for key in list(progress):
            want = desired.get(key)
            if want is None or want.charge_to is None:
                progress.pop(key)
        for key, want in desired.items():
            soc = socs.get(key)
            if want.charge_to is None or soc is None or soc >= want.charge_to - 1:
                continue
            mark = progress.get(key)
            if mark is None or soc >= mark["soc"] + 1:
                if mark and mark.get("told") and self.notifier:
                    # It charges again: the hint can go.
                    await self.notifier.async_clear("no_progress")
                progress[key] = {"since": now.isoformat(), "soc": soc, "told": False}
                continue
            if (
                mark.get("told")
                or now - datetime.fromisoformat(mark["since"]) < NO_PROGRESS
            ):
                continue
            mark["told"] = True
            self._log("no_progress", battery=key, soc=round(soc, 1))
            self._fire("no_progress", battery=key)
            if self.notifier:
                await self.notifier.async_problem(
                    "no_progress", battery=names.get(key, key)
                )

    def _start_night(self, night: str) -> None:
        self.data.update(
            night=night,
            floors={},
            reached=[],
            external=[],
            first={},
            steered=False,
            done=[],
            paused=None,
            progress={},
        )
        self._log("start", night=night)
        if self.notifier:
            self.notifier.clear_ask()

    def _end_night(self) -> None:
        night = self.data["night"]
        self.data.update(
            night=None,
            floors={},
            reached=[],
            external=[],
            first={},
            steered=False,
            done=[],
        )
        # A switch "tonight" is for one night only.
        self.data["tonight"] = {
            key: value for key, value in self.data["tonight"].items() if value != night
        }
        self.data["tonight_target"] = {
            key: value
            for key, value in self.data["tonight_target"].items()
            if value.get("night") != night
        }

    async def async_action_tonight(
        self,
        action_id: str,
        on: bool,
        target: float | None = None,
        unit: str = "%",
    ) -> None:
        """Run a night action in the coming night regardless of the forecast (or not).

        A car may get a level (%) or a range (km, plus the reserve) to charge
        up to in the cheap window.
        """
        plan = self._plan()
        night = plan["window"]["start"] if plan and plan.get("window") else None
        chosen = None
        if on and night and target is not None:
            action = next(
                (a for a in self._config()["actions"] if a["id"] == action_id), None
            )
            if action is None or action["kind"] != "switch":
                raise ValueError("unknown_action")
            need = action.get("need") or {}
            sensor = need.get("soc_entity") if unit == "%" else need.get("range_entity")
            if not sensor:
                raise ValueError("no_sensor")
            reserve = need.get("reserve_km", 50.0) if unit == "km" else 0.0
            chosen = {
                "night": night,
                "target": round(float(target) + reserve, 1),
                "chosen": float(target),
                "unit": unit,
                "sensor": sensor,
            }
        if on and night:
            self.data["tonight"][action_id] = night
            # By hand: also when Joe's own charge reached its target before.
            self.data["done"] = [d for d in self.data["done"] if d != action_id]
        else:
            self.data["tonight"].pop(action_id, None)
        if chosen:
            self.data["tonight_target"][action_id] = chosen
        else:
            self.data["tonight_target"].pop(action_id, None)
        self._log(
            "tonight",
            battery=f"action:{action_id}",
            on=on,
            **({"target": target, "unit": unit} if chosen else {}),
        )
        await self._async_save()
        self._changed()

    async def async_replanned(self, action_ids: list[str]) -> None:
        """Actions worked out again in the fixed plan: their target counts anew."""
        if not any(d in action_ids for d in self.data["done"]):
            return
        self.data["done"] = [d for d in self.data["done"] if d not in action_ids]
        await self._async_save()
        self._changed()

    async def async_skip(self, skip: bool) -> None:
        """Skip tonight (or not); releases right away if Joe is steering."""
        plan = self._plan()
        night = plan["window"]["start"] if plan and plan.get("window") else None
        self.data["skip"] = night if skip else None
        self._log("skip" if skip else "unskip", night=night)
        await self._async_save()
        await self.async_check()

    async def async_answer(self, night: str, yes: bool) -> None:
        """The answer in the "suggest" mode: may Joe steer this night?"""
        self.data["answer"] = {
            "night": night,
            "yes": yes,
            "at": dt_util.now().isoformat(timespec="seconds"),
        }
        self._log("answer", night=night, yes=yes)
        if self.notifier:
            self.notifier.clear_ask()
        await self._async_save()
        self._changed()
        await self.async_check()

    async def async_answer_tonight(self, yes: bool) -> None:
        """An answer from a phone: it is about the coming (or running) night."""
        plan = self._plan()
        if plan and plan.get("window"):
            await self.async_answer(plan["window"]["start"], yes)

    # --- the test run ----------------------------------------------------------------

    async def async_test(self, battery_id: str) -> dict[str, Any]:
        """Hold, charge and release one battery briefly and read everything back."""
        config = self._config()
        battery = next((b for b in config["batteries"] if b["id"] == battery_id), None)
        if battery is None:
            raise ValueError("unknown_battery")
        adapter = make_adapter(battery)
        if adapter is None:
            raise ValueError("not_controllable")
        if self.status.get("steering"):
            raise ValueError("steering")
        async with self._lock:
            self.testing = {
                "battery": battery_id,
                "step": "check",
                "steps": [],
                "started": dt_util.now().isoformat(timespec="seconds"),
            }
            self._changed()
            try:
                result = await self._async_run_test(battery, adapter)
            finally:
                self.testing = None
            self.data["tests"][battery_id] = result
            self._log("test", battery=battery_id, ok=result["ok"])
            await self._async_save()
        self._changed()
        return result

    async def _async_run_test(
        self, battery: dict[str, Any], adapter: Adapter
    ) -> dict[str, Any]:
        hass = self._hass
        now = dt_util.now()
        result: dict[str, Any] = {
            "at": now.isoformat(timespec="seconds"),
            "signature": adapter.signature,
            "ok": False,
            "steps": [],
        }
        if missing := adapter.missing(hass):
            result["problem"] = "controls_missing"
            result["missing"] = missing
            return result
        soc = number(hass.states.get(battery["soc_entity"]))
        if soc is None:
            result["problem"] = "soc_unknown"
            return result
        result["soc"] = round(soc, 1)
        saved: dict[str, Any] = self.data["saved"]
        target = min(100, math.ceil(soc) + 5)
        steps = [
            ("hold", Desired(floor=max(0, math.floor(soc)), block=True), TEST_HOLD)
        ]
        if adapter.can_charge:
            steps.append(
                (
                    "charge",
                    Desired(charge_to=target, power_w=_test_power(battery)),
                    TEST_CHARGE,
                )
            )
        ok = True
        for name, want, seconds in steps:
            assert self.testing is not None
            self.testing["step"] = name
            self._changed()
            writes = [fit(hass, w) for w in adapter.writes(hass, want, soc, saved)]
            errors = []
            for write in writes:
                if not write.is_call and write.entity_id not in saved:
                    saved[write.entity_id] = read(hass, write.entity_id)
                try:
                    await async_apply(hass, write)
                except WriteError as err:
                    errors.append({"entity_id": err.entity_id, "code": err.code})
            await self._async_save()
            await asyncio.sleep(seconds)
            wrong = [
                w.entity_id for w in writes if not w.is_call and not matches(hass, w)
            ]
            power = measurement_kw(hass.states.get, battery.get("power"))
            step = {
                "step": name,
                "ok": not errors and not wrong,
                "errors": errors,
                "wrong": wrong,
                "power": None if power is None else round(power, 2),
                "writes": [w.as_dict() for w in writes],
            }
            ok = ok and step["ok"]
            result["steps"].append(step)
            self.testing["steps"] = result["steps"]
            self._changed()
        # Release: everything back.
        self.testing["step"] = "release"
        self._changed()
        restore = adapter.release(saved)
        errors = []
        for write in restore:
            try:
                await async_apply(hass, write)
            except WriteError as err:
                errors.append({"entity_id": err.entity_id, "code": err.code})
        await asyncio.sleep(TEST_RELEASE)
        wrong = [
            w.entity_id
            for w in restore
            if not w.is_call and not matches(hass, fit(hass, w))
        ]
        for write in restore:
            if write.entity_id not in wrong:
                saved.pop(write.entity_id, None)
        power = measurement_kw(hass.states.get, battery.get("power"))
        result["steps"].append(
            {
                "step": "release",
                "ok": not errors and not wrong,
                "errors": errors,
                "wrong": wrong,
                "power": None if power is None else round(power, 2),
                "writes": [w.as_dict() for w in restore],
            }
        )
        result["ok"] = ok and not errors and not wrong
        return result

    # --- helpers ---------------------------------------------------------------------

    def _watch(self, entity_ids: list[str]) -> None:
        """React to charge level changes right away while steering."""
        wanted = tuple(sorted(entity_ids))
        if wanted == self._watched:
            return
        if self._soc_unsub:
            self._soc_unsub()
            self._soc_unsub = None
        self._watched = wanted
        if wanted:
            self._soc_unsub = async_track_state_change_event(
                self._hass, list(wanted), self._on_soc
            )

    @callback
    def _on_soc(self, event: Event) -> None:
        if not self._lock.locked():
            self._hass.async_create_task(self.async_check(), eager_start=False)

    def _set_status(
        self,
        reason: str,
        night: str | None,
        batteries: dict[str, Any],
        actions: dict[str, Any],
        keep: set[str] | None = None,
    ) -> None:
        status = {
            "steering": reason == "steering",
            "reason": reason,
            "night": night,
            "batteries": batteries,
            "actions": actions,
            # Left to put back, apart from what is set on purpose right now.
            "pending": reason != "steering"
            and (self._dirty_except(keep) if keep else self._dirty),
        }
        if status != self.status:
            self.status = status
            self._changed()

    def _log(self, kind: str, **detail: Any) -> None:
        entry = {
            "at": dt_util.now().isoformat(timespec="seconds"),
            "kind": kind,
            **detail,
        }
        log: list[dict[str, Any]] = self.data["log"]
        log.append(entry)
        del log[:-LOG_SIZE]

    def _fire(self, kind: str, **data: Any) -> None:
        self._hass.bus.async_fire(f"{DOMAIN}_{kind}", data)

    async def _async_save(self) -> None:
        await self._store.async_save(self.data)

    def readiness(self) -> dict[str, str]:
        """Per battery: ready to steer, or why not ("not_tested", ...)."""
        result = {}
        for battery in self._config()["batteries"]:
            adapter = make_adapter(battery)
            if adapter is None:
                result[battery["id"]] = "not_controllable"
            elif adapter.missing(self._hass):
                result[battery["id"]] = "controls_missing"
            elif not self.tested(battery):
                test = self.data["tests"].get(battery["id"])
                result[battery["id"]] = (
                    "outdated" if test and test.get("ok") else "not_tested"
                )
            else:
                result[battery["id"]] = "ready"
        return result

    @property
    def view(self) -> dict[str, Any]:
        """What the panel shows."""
        return {
            **self.status,
            "ready": self.readiness(),
            "testing": self.testing,
            "tests": self.data["tests"],
            "log": self.data["log"][-30:],
            "skip": self.data["skip"],
            "answer": self.data["answer"],
            "tonight": self.data["tonight"],
            "tonight_target": self.data["tonight_target"],
            "boost": self.data["boost"],
        }

    async def async_forget(self) -> None:
        await self._store.async_remove()


def _kept(key: str, keep: set[str], config: dict[str, Any]) -> bool:
    """Whether an "active" key belongs to an action whose entity is kept."""
    if not key.startswith("action:"):
        return False
    action_id = key.removeprefix("action:")
    return any(
        a["id"] == action_id and a["entity_id"] in keep for a in config["actions"]
    )


def _fresh() -> dict[str, Any]:
    return {
        key: (value.copy() if isinstance(value, dict | list) else value)
        for key, value in DEFAULT_DATA.items()
    }


def _action(want: Desired | None) -> str | None:
    if want is None:
        return None
    if want.charge_to is not None:
        return "charge"
    if want.block:
        return "block"
    if want.floor is not None:
        return "hold"
    return "free"


def _test_power(battery: dict[str, Any]) -> float:
    """A small charging power for the test run (W)."""
    maximum = battery.get("max_charge_w") or 2000
    return max(100.0, min(1000.0, maximum / 4))
