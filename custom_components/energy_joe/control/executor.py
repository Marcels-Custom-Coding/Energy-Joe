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
from copy import deepcopy
from datetime import datetime, timedelta
import logging
import math
from typing import Any

from homeassistant.const import EVENT_HOMEASSISTANT_STOP
from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_change,
    async_track_time_interval,
)
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from ..const import DOMAIN
from ..observe.readings import distance_km, measurement_kw, number, solar_kw
from ..plan import cars, surplus as day_surplus
from ..plan.actions import condition_met
from . import (
    automations as battery_automations,
    evcc,
    guard as guard_rules,
    team as team_rules,
    writes as joe_writes,
)
from .actions import ActionAdapter
from .adapters import Adapter, Desired, RoleAdapter, make_adapter
from .profiles import profile_for
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
# Daytime surplus: a cap goes down at most this often and only by this much
# (it goes up at once); it never starts this late or runs into the night.
SURPLUS_LOWER_EVERY = timedelta(minutes=15)
SURPLUS_LOWER_KW = 0.2
SURPLUS_LATEST = 22
# A cap that rises is logged again only once it rose by this much (kW).
SURPLUS_LOG_KW = 0.3
# Learning what 100 % of a charge limit in % stand for (limit_ref_w): a test
# limit for a few minutes while the battery charges fast and unrestricted in
# plenty of sun, at most once a day. The battery's power must drop clearly
# below what it took before; the sun must stay.
LEARN_SPAN = timedelta(minutes=3)
LEARN_GIVE_UP = timedelta(minutes=10)
LEARN_PERCENT = 50
LEARN_MIN_PERCENT = 10
LEARN_MIN_W = 1000
LEARN_MAX_SOC = 85
LEARN_DROP = 0.85
LEARN_SUN_KEEP = 0.8
LEARN_REF_RANGE = (500, 30000)

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
    # Automations Joe switched off because they write to a battery: id -> at, reason.
    "automations_off": {},
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
    # Daytime surplus (see _async_surplus): the caps in force (battery -> kW),
    # when they last changed, and the day it was let go for good.
    "surplus": {
        "caps": {},
        "changed": None,
        "released": None,
        "logged": None,
        # A test limit to learn a battery's reference (see _async_learn_ref),
        # and per battery the day of the last try and its test percent.
        "learn": None,
        "learn_tried": {},
    },
    # Several batteries one after the other (see _async_team and control/team.py).
    "team": {
        # The battery that may work now, and since when.
        "active": None,
        "since": None,
        # The flow (surplus or deficit) Joe goes by, and the one just seen.
        "flow": None,
        "flow_since": None,
        "raw": None,
        "raw_since": None,
        # Batteries marked empty and full (id -> the level it was marked at).
        "empty": {},
        "full": {},
        # The day they charge side by side (the sun would not fill them one
        # after the other).
        "parallel": None,
        # The blocks in force: battery -> {"charge": bool, "discharge": bool}.
        "blocks": {},
        # Watching for the real cutoff (and fullness) per battery, and the
        # levels it stopped discharging at.
        "watch": {},
        "cutoffs": {},
        # The day "Sofort freigeben" paused it.
        "paused": None,
    },
    # The watchdog: two batteries running against each other (see
    # _async_guard and control/guard.py).
    "guard": guard_rules.fresh(),
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
        # Which car is plugged in where (control/cars.py; set by the runtime).
        self.cars: Any = None
        # Called with a battery id and the reference Joe learned (W).
        self.on_learned: Callable[[str, float], None] | None = None
        self.testing: dict[str, Any] | None = None
        # Called with a battery id and the cutoff Joe learned (%).
        self.on_cutoff: Callable[[str, float], None] | None = None
        # What the daytime surplus does (or would do) now, for the panel.
        self.surplus: dict[str, Any] = {"state": "off"}
        # What several batteries do together now, for the panel.
        self.team: dict[str, Any] = {"state": "off", "batteries": {}}
        self._team_shown: dict[str, Any] = {}
        # What the watchdog does now, for the panel.
        self.guard: dict[str, Any] = {"state": "off"}
        # The automations writing the watchdog's levers: battery, when, names.
        self._guard_seen: tuple[str, datetime, list[str]] | None = None
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
            # Older data: the daytime surplus' keys filled in.
            self.data["surplus"] = {
                **deepcopy(DEFAULT_DATA["surplus"]),
                **(stored.get("surplus") or {}),
            }
            self.data["team"] = {
                **deepcopy(DEFAULT_DATA["team"]),
                **(stored.get("team") or {}),
            }
            # Older data: the watchdog's notes of the team are gone.
            for key in ("transfer", "told"):
                self.data["team"].pop(key, None)
            self.data["guard"] = {
                **guard_rules.fresh(),
                **(stored.get("guard") or {}),
            }

    @property
    def active(self) -> bool:
        return bool(self._unsubs)

    async def async_start(self) -> None:
        """Start checking (also releases what a crash left behind)."""
        await self.async_stop(release=False)
        # What the watchdog switched before a restart goes back first.
        async with self._lock:
            await self._async_guard_restore("start")
        self._unsubs.append(
            async_track_time_interval(self._hass, self._on_tick, CHECK_EVERY)
        )
        self._unsubs.append(
            async_track_time_interval(
                self._hass, self._on_guard_tick, guard_rules.EVERY
            )
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
        if release and (self._dirty or self.data["guard"]["held"]):
            async with self._lock:
                await self._async_guard_restore("stopped")
                if self._dirty:
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
        if self.data["guard"]["held"]:
            try:
                async with asyncio.timeout(15), self._lock:
                    await self._async_guard_restore("ha_stop")
            except TimeoutError:
                _LOGGER.warning("The watchdog's switches go back after the start")
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
            before = self._written_state()
            day, held = await self._async_day(config, plan, mode, now)
            keep |= held
            was_capped = bool(self.data["surplus"]["caps"])
            try:
                want, hint = await self._async_team(config, plan, mode, now)
            except Exception:
                # Never keep a block Joe cannot work out: give them back.
                _LOGGER.exception("Coordinating the batteries failed")
                want, hint = {}, None
                await self._async_team_off(config, now, "error")
            try:
                capped = await self._async_surplus(
                    config, plan, mode, now, bool(day), hint
                )
            except Exception:
                # Never keep a cap Joe cannot work out: give it back.
                _LOGGER.exception("Daytime surplus failed")
                capped = set()
                self._surplus_forget("error")
            keep |= capped
            try:
                keep |= await self._async_team_apply(config, want, keep, now)
            except Exception:
                _LOGGER.exception("Blocking the batteries failed")
                await self._async_team_off(config, now, "error")
            if self._dirty_except(keep):
                # The grid-friendly morning is over: its own reason, no second
                # morning message.
                was_day = self.data.get("day") is not None and not day
                await self._async_release(
                    "day_done"
                    if was_day
                    else "surplus_done"
                    if was_capped and not capped
                    else reason,
                    now,
                    keep,
                )
            if not day:
                self.data["day"] = None
            # No plan for a moment (a restart, the planner restarting) does not
            # end the night: only a plan for another night does.
            if self.data["night"] and night is not None and self.data["night"] != night:
                self._end_night()
            self._set_status("day" if day else reason, night, day, boosts, keep)
            self._watch([])
            # Originals and caps survive a crash: saved whenever they change.
            if boosts or ended or day or self._written_state() != before:
                await self._async_save()
            return
        assert plan is not None and night is not None
        # The night begins: no daytime cap may stay (its originals go back),
        # and the night's plan steers the batteries, not their order by day.
        await self._async_surplus_off(config, now, "night")
        try:
            await self._async_team(config, plan, mode, now, night=True)
        except Exception:
            _LOGGER.exception("Watching the batteries failed")
        await self._async_team_off(config, now, "night")
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
        self._settle_loop_owned(adapter)
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

    def _written_state(self) -> tuple[Any, ...]:
        """What must be on disk before Joe relies on it (originals, caps)."""
        return (
            dict(self.data["saved"]),
            list(self.data["active"]),
            dict(self.data["surplus"]["caps"]),
            self.data["surplus"].get("released"),
            self.data.get("day"),
            self.data.get("day_released"),
            deepcopy(self.data["team"]["blocks"]),
            self.data["team"]["active"],
            dict(self.data["team"]["empty"]),
            dict(self.data["team"]["full"]),
            self.data["team"]["parallel"],
        )

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
        stays behind the forecast, Joe lets go early. After the window the
        planner shows the next night's preview with last night's plan as
        "morning" until its defer_until.
        """
        if plan and not plan.get("fixed"):
            plan = plan.get("morning")
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
            keep |= {w.entity_id for w in writes} | {battery["id"]}
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

    # --- daytime surplus ---------------------------------------------------------

    async def _async_surplus(
        self,
        config: dict[str, Any],
        plan: dict[str, Any] | None,
        mode: str,
        now: datetime,
        morning: bool,
        team: dict[str, Any] | None = None,
    ) -> set[str]:
        """On sunny days: cap charging so the surplus shows at the grid meter.

        An evcc loadpoint in PV mode (a car, the floor heating) runs on it,
        and the batteries are full all the same before the sun goes (see
        plan/surplus.py). Only live, only batteries with a charge limit that
        takes a power, a passed test run and "takes part" on; the
        grid-friendly morning goes first. In the simulation and "suggest" Joe
        shows what he would do. Returns the entities to leave as they are.

        The originals go into "saved" like every other write, so the release
        (end of the day, mode change, "Sofort freigeben", stop, a restart
        after a crash) puts them back.

        Several batteries one after the other (`team`, see _async_team): one
        whose charging is blocked waits; its room counts for the active group,
        which takes the whole cap. Batteries charging side by side are left
        free (their own control takes what the capped one leaves).
        """
        rules = config["rules"]
        local = dt_util.as_local(now)
        today = local.date().isoformat()
        store: dict[str, Any] = self.data["surplus"]
        info: dict[str, Any] = {
            "state": "off",
            "dry": mode != "live",
            "caution": rules["day_caution"],
            "batteries": {},
            "loadpoints": [],
            "evcc": {},
            "conflicts": [],
        }
        state = self._surplus_gate(config, plan, mode, local, morning)
        stores: list[day_surplus.Store] = []
        items: dict[str, tuple[dict[str, Any], RoleAdapter | None]] = {}
        result: dict[str, Any] = {}
        points: list[dict[str, Any]] = []
        if state != "off":
            # evcc's side, also outside the day: its settings may work against it.
            snap = evcc.snapshot(self._hass)
            points = evcc.loadpoints(snap)
            found = evcc.settings(snap)
            info.update(
                loadpoints=points,
                evcc=found,
                conflicts=[
                    *evcc.conflicts(found, points),
                    *self._device_conflicts(config),
                ],
            )
        learn_keep: set[str] = set()
        if state is None:
            assert plan is not None
            sizes = {b["id"]: b.get("capacity") for b in plan.get("batteries") or []}
            foreign = self._cap_automations(config)
            waiting = set(team["blocked"]) if team else set()
            side = set(team["parallel"]) if team else set()
            waiting_room = 0.0
            for battery in config["batteries"]:
                soc = number(self._hass.states.get(battery["soc_entity"]))
                size = sizes.get(battery["id"]) or battery.get("capacity_kwh")
                if soc is None or not size:
                    info["batteries"][battery["id"]] = {
                        "name": battery["name"],
                        "state": "unknown",
                        "soc": None if soc is None else round(soc, 1),
                        "cap_kw": None,
                        "problem": None,
                    }
                    continue
                if battery["id"] in waiting:
                    # Its turn comes after the active one: its room counts there.
                    waiting_room += max(0.0, size * (100 - soc) / 100)
                    info["batteries"][battery["id"]] = {
                        "name": battery["name"],
                        "state": "team_wait",
                        "soc": round(soc, 1),
                        "cap_kw": None,
                        "problem": None,
                    }
                    continue
                adapter = make_adapter(battery)
                role = adapter if isinstance(adapter, RoleAdapter) else None
                why = "takes_part"
                problem = role.limit_problem(self._hass) if role else "no_limit"
                if problem in ("no_limit", "unit", "unavailable"):
                    why = problem or "no_limit"
                elif battery["id"] in foreign:
                    # An automation writes the same limit: it would fight Joe.
                    why = "automation"
                elif problem:
                    why = problem
                elif role is None or role.missing(self._hass):
                    why = "unavailable"
                elif not self.tested(battery):
                    why = "not_tested"
                elif not battery.get("day_surplus", True):
                    why = "left_out"
                default_kw = min(5.0, size * 0.5)
                stores.append(
                    day_surplus.Store(
                        id=battery["id"],
                        capacity=size,
                        soc=max(0.0, min(100.0, soc)),
                        max_kw=(battery.get("max_charge_w") or default_kw * 1000)
                        / 1000,
                        capped=why == "takes_part" and battery["id"] not in side,
                    )
                )
                items[battery["id"]] = (battery, role)
                info["batteries"][battery["id"]] = {
                    "name": battery["name"],
                    "state": why,
                    "soc": round(soc, 1),
                    "cap_kw": None,
                    "problem": None,
                }
                if why == "automation":
                    info["batteries"][battery["id"]]["automations"] = foreign[
                        battery["id"]
                    ]
            if waiting_room and team:
                # The waiting room counts for one battery of the active group
                # (one that takes part, if any).
                active = [
                    store_
                    for key in team["active_batteries"]
                    for store_ in stores
                    if store_.id == key
                ]
                carrier = next((x for x in active if x.capped), None) or next(
                    iter(active), None
                )
                stores = [
                    _with_room(store_, waiting_room) if store_ is carrier else store_
                    for store_ in stores
                ]
            if mode == "live":
                learn_keep = await self._async_learn_ref(config, info["batteries"], now)
            caution = day_surplus.CAUTION.get(rules["day_caution"], 0.8)
            hours = plan.get("hours") or []
            created = (
                datetime.fromisoformat(plan["created"]) if plan.get("created") else None
            )
            ratio = None
            forecast = day_surplus.forecast_kw(hours, created, now)
            solar = [
                solar_kw(self._hass.states.get, m)
                for m in config["measurements"]["solar_power"]
            ]
            if forecast and forecast > 0.2 and solar and None not in solar:
                ratio = sum(s or 0.0 for s in solar) / forecast
            found_slots = day_surplus.slots(hours, created, now, caution, ratio)
            result = day_surplus.day_cap(found_slots, stores, now)
            state = result["state"]
            if state == "cap" and not any(p["wants"] for p in points):
                state = "no_loadpoint"
            if (
                state == "cap"
                and not store["caps"]
                and found_slots
                and found_slots[0].surplus <= 0
            ):
                # The sun does not cover the house yet: no cap before it does.
                state = "soon"
            info.update(
                pv_end=result["pv_end"].isoformat(timespec="minutes")
                if result["pv_end"]
                else None,
                cap_kw=result["cap_kw"],
                need_kwh=result["need_kwh"],
                surplus_kwh=result["surplus_kwh"],
                expected_kwh=result["expected_kwh"],
                hours=result["hours"],
                sun_ratio=round(ratio, 2) if ratio is not None else None,
            )
        info["state"] = state
        caps: dict[str, float] = dict(result.get("caps") or {})
        keep: set[str] = set()
        if state == "cap" and mode == "live":
            caps = self._surplus_steady(caps, now)
            started = not store["caps"]
            total = round(sum(caps.values()), 1)
            logged = store.get("logged") or 0.0
            for lever, members in self._cap_levers(caps, items).items():
                role = members[0][1]
                # A system limit is for all its batteries: the sum of their caps,
                # and the full power of those Joe does not cap.
                kw = sum(caps.get(key, 0.0) for key, _ in members)
                kw += sum(
                    store_.max_kw
                    for store_ in stores
                    if store_.id not in caps
                    and store_.id in self._lever_members(lever, items)
                    and store_.room > day_surplus.FULL_KWH
                )
                writes = role.limit(self._hass, kw, self.data["saved"])
                problem = await self._async_write(role, writes, now, None)
                keep |= {w.entity_id for w in writes}
                for key, _ in members:
                    keep.add(key)
                    info["batteries"][key].update(
                        state="capped", cap_kw=caps[key], problem=problem
                    )
            if started or set(caps) != set(store["caps"]):
                self._log(
                    "surplus_cap",
                    power=total,
                    caps=caps,
                    until=info.get("pv_end"),
                    loadpoint=next(
                        (p["name"] for p in info["loadpoints"] if p["wants"]), None
                    ),
                )
                store["logged"] = total
            elif total >= logged + SURPLUS_LOG_KW:
                # Raised as the sun lags: written at once, logged in larger steps.
                self._log("surplus_raise", power=total, caps=caps)
                store["logged"] = total
            store["caps"] = caps
        else:
            if state == "cap":
                for key, kw in caps.items():
                    info["batteries"][key].update(state="would", cap_kw=kw)
            if store["caps"]:
                self._surplus_forget(state)
                if state in ("full", "not_reachable", "after_pv"):
                    # Let go for good today (no back and forth with the clouds).
                    store["released"] = today
        if self.surplus != info:
            self.surplus = info
            self._changed()
        return keep | learn_keep

    def _cap_levers(
        self,
        caps: dict[str, float],
        items: dict[str, tuple[dict[str, Any], RoleAdapter | None]],
    ) -> dict[str, list[tuple[str, RoleAdapter]]]:
        """The capped batteries by the limit they are capped with (one write each)."""
        result: dict[str, list[tuple[str, RoleAdapter]]] = {}
        for key in caps:
            role = items[key][1]
            assert role is not None
            result.setdefault(role.limit_key() or key, []).append((key, role))
        return result

    @staticmethod
    def _lever_members(
        lever: str, items: dict[str, tuple[dict[str, Any], RoleAdapter | None]]
    ) -> set[str]:
        """Every battery behind a limit (a system limit has several)."""
        return {
            key
            for key, (_, role) in items.items()
            if role is not None and role.limit_key() == lever
        }

    def _cap_automations(self, config: dict[str, Any]) -> dict[str, list[str]]:
        """Automations (switched on) that write a battery's cap limit: battery -> names.

        Found the same way as the "Störenfriede" (control/automations.py); once
        they are switched off there, the battery takes part.
        """
        levers: dict[str, set[str]] = {}
        for battery in config["batteries"]:
            adapter = make_adapter(battery)
            if isinstance(adapter, RoleAdapter) and adapter.limit_roles():
                levers[battery["id"]] = set(adapter.limit_entities())
        if not levers:
            return {}
        try:
            found = battery_automations.find(
                self._hass, config, self.data["automations_off"]
            )
        except Exception:
            _LOGGER.exception("Looking for automations failed")
            return {}
        result: dict[str, list[str]] = {}
        for automation in found:
            if not automation["on"]:
                continue
            written = {w["entity_id"] for w in automation["writes"]}
            for battery_id, entities in levers.items():
                names = result.setdefault(battery_id, [])
                if written & entities and automation["name"] not in names:
                    names.append(automation["name"])
        return {k: v for k, v in result.items() if v}

    def _device_conflicts(self, config: dict[str, Any]) -> list[dict[str, Any]]:
        """The batteries' own settings that hold charging back (Omnibattery's
        charge delay and predictive charging), while they are on."""
        registry = er.async_get(self._hass)
        result: list[dict[str, Any]] = []
        seen: set[str] = set()
        for battery in config["batteries"]:
            profile = profile_for(battery.get("adapter"))
            adapter = make_adapter(battery)
            if (
                not profile
                or not profile.day_conflicts
                or not isinstance(adapter, RoleAdapter)
                or not adapter.limit_roles()
            ):
                continue
            soc = registry.async_get(battery["soc_entity"])
            if not soc or not soc.config_entry_id:
                continue
            for item in er.async_entries_for_config_entry(
                registry, soc.config_entry_id
            ):
                if item.domain != "switch" or item.entity_id in seen:
                    continue
                uid = item.unique_id or ""
                for key in profile.day_conflicts:
                    if item.translation_key == key or any(
                        uid.endswith(f"{sep}{key}") for sep in ("-", "_", ".")
                    ):
                        seen.add(item.entity_id)
                        state = self._hass.states.get(item.entity_id)
                        if state and state.state == "on":
                            result.append(
                                {
                                    "code": key,
                                    "entity_id": item.entity_id,
                                    "battery": battery["name"],
                                }
                            )
                        break
        return result

    def _drop_foreign(self, entity_ids: list[str]) -> None:
        """Values someone else set after Joe (an automation): Joe does not put
        his originals back over them; he forgets them and says so."""
        saved: dict[str, Any] = self.data["saved"]
        written: dict[str, Any] = self.data["written"]
        for entity_id in entity_ids:
            entry = written.get(entity_id)
            if not entry or entity_id not in saved:
                continue
            state = self._hass.states.get(entity_id)
            if state is None or state.state in ("unavailable", "unknown"):
                continue
            if matches(self._hass, Write(entity_id, entry["value"])) or matches(
                self._hass, fit(self._hass, Write(entity_id, saved[entity_id]))
            ):
                continue
            saved.pop(entity_id, None)
            written.pop(entity_id, None)
            self._log(
                "external",
                battery=entry.get("battery"),
                entity=entity_id,
                value=read(self._hass, entity_id),
            )

    async def _async_unlimit(self, adapter: RoleAdapter, now: datetime) -> None:
        """A cap's limit back as it was (what an automation set meanwhile stays);
        what is back is no longer Joe's to restore."""
        entities = adapter.limit_entities()
        self._drop_foreign(entities)
        saved: dict[str, Any] = self.data["saved"]
        await self._async_write(adapter, adapter.unlimit(saved), now, None)
        for entity_id in entities:
            if entity_id in saved and matches(
                self._hass, fit(self._hass, Write(entity_id, saved[entity_id]))
            ):
                saved.pop(entity_id, None)
                self.data["written"].pop(entity_id, None)
        if not any(e in saved for e in adapter.entities()):
            key = adapter.battery["id"]
            self.data["active"] = [k for k in self.data["active"] if k != key]

    # --- learning what 100 % stand for ---------------------------------------

    async def _async_learn_ref(
        self, config: dict[str, Any], states: dict[str, Any], now: datetime
    ) -> set[str]:
        """Learn what 100 % of a charge limit in % stand for (Fronius).

        While the battery charges fast and unrestricted in plenty of sun, Joe
        sets a test limit (50 %) for a few minutes and measures the battery's
        power: if it settles clearly below what it took before, 100 % stand
        for twice that. The originals go back right after; a try that tells
        nothing is made again another day (with half the test limit when it
        did not bite). Returns the entities to leave as they are meanwhile.
        """
        store = self.data["surplus"]
        learn = store.get("learn")
        today = dt_util.as_local(now).date().isoformat()
        tried: dict[str, Any] = store.setdefault("learn_tried", {})
        batteries = {b["id"]: b for b in config["batteries"]}
        if learn:
            battery = batteries.get(learn["battery"])
            adapter = make_adapter(battery) if battery else None
            if (
                battery is None
                or not isinstance(adapter, RoleAdapter)
                or states.get(battery["id"], {}).get("state") != "need_ref"
            ):
                return await self._async_learn_end(adapter, learn, None, "stopped")
            since = datetime.fromisoformat(learn["since"])
            if now - since > LEARN_GIVE_UP:
                return await self._async_learn_end(adapter, learn, None, "late")
            if now - since < LEARN_SPAN:
                states[battery["id"]]["state"] = "learning"
                return set(adapter.limit_entities()) | {battery["id"]}
            power = _charge_w(self._hass, battery)
            solar = _solar_kw(self._hass, config)
            reason = None
            if power is None or solar is None:
                reason = "unknown"
            elif learn.get("solar_kw") and solar < learn["solar_kw"] * LEARN_SUN_KEEP:
                reason = "sun"
            elif power > learn["before_w"] * LEARN_DROP:
                reason = "no_effect"
            ref = None
            if reason is None and power is not None:
                ref = round(power * 100 / learn["percent"], -1)
                low, high = LEARN_REF_RANGE
                if not low <= ref <= high or ref < learn["before_w"] * 0.9:
                    reason = "implausible"
                    ref = None
            return await self._async_learn_end(adapter, learn, ref, reason)
        for battery_id, entry in states.items():
            if entry.get("state") != "need_ref":
                continue
            battery = batteries[battery_id]
            last = tried.get(battery_id) or {}
            if last.get("day") == today or not battery.get("day_surplus", True):
                continue
            adapter = make_adapter(battery)
            if not isinstance(adapter, RoleAdapter) or not self.tested(battery):
                continue
            if adapter.missing(self._hass) or not adapter.limit_roles():
                continue
            power = _charge_w(self._hass, battery)
            solar = _solar_kw(self._hass, config)
            soc = entry.get("soc")
            if (
                power is None
                or solar is None
                or soc is None
                or soc > LEARN_MAX_SOC
                or power < max(LEARN_MIN_W, 0.5 * (battery.get("max_charge_w") or 0))
                # More sun than the battery takes: it takes all it can.
                or solar * 1000 < power + 500
                # Unrestricted: no limit of the owner's in force.
                or adapter._own_limit(self._hass, {}) not in (None, 100.0)
            ):
                continue
            percent = int(last.get("next") or LEARN_PERCENT)
            switch, role = adapter.limit_roles()  # type: ignore[misc]
            writes = []
            if switch in adapter.controls:
                writes.append(Write(adapter.controls[switch], True))
            writes.append(Write(adapter.controls[role], percent))
            tried[battery_id] = {"day": today, "next": percent}
            store["learn"] = {
                "battery": battery_id,
                "since": now.isoformat(timespec="seconds"),
                "before_w": round(power),
                "solar_kw": round(solar, 2),
                "percent": percent,
            }
            await self._async_write(adapter, adapter._paced(writes), now, None)
            self._log(
                "limit_ref_test", battery=battery_id, value=percent, power=power / 1000
            )
            entry["state"] = "learning"
            return set(adapter.limit_entities()) | {battery_id}
        return set()

    async def _async_learn_end(
        self,
        adapter: RoleAdapter | None,
        learn: dict[str, Any],
        ref: float | None,
        reason: str | None,
    ) -> set[str]:
        """The test limit back as it was; the reference noted, or why not."""
        store = self.data["surplus"]
        store["learn"] = None
        battery_id = learn["battery"]
        if adapter is not None:
            await self._async_unlimit(adapter, dt_util.now())
        if ref is not None:
            self._log("limit_ref", battery=battery_id, power=ref / 1000)
            if self.on_learned:
                self.on_learned(battery_id, ref)
            return set()
        if reason == "no_effect":
            # The test limit was above what the battery took: smaller next time.
            tried = store.setdefault("learn_tried", {}).setdefault(battery_id, {})
            tried["next"] = max(LEARN_MIN_PERCENT, learn["percent"] // 2)
        self._log("limit_ref_failed", battery=battery_id, reason=reason)
        return set()

    def _surplus_gate(
        self,
        config: dict[str, Any],
        plan: dict[str, Any] | None,
        mode: str,
        local: datetime,
        morning: bool,
    ) -> str | None:
        """Why there is no daytime surplus now, or None if Joe looks at it."""
        if not config["rules"].get("day_surplus") or mode == "off":
            return "off"
        if not plan or plan.get("kind") == "unavailable" or not plan.get("hours"):
            return "no_plan"
        window = plan.get("window") or {}
        if window and (
            datetime.fromisoformat(window["start"])
            <= local
            < datetime.fromisoformat(window["end"])
        ):
            return "night"
        if local.hour >= SURPLUS_LATEST:
            return "night"
        if self.data["surplus"]["released"] == local.date().isoformat():
            return "released"
        if morning:
            return "morning"
        return None

    def _surplus_steady(
        self, caps: dict[str, float], now: datetime
    ) -> dict[str, float]:
        """Up at once, down only a little while after the last change (no
        writing every minute when a cloud passes)."""
        store = self.data["surplus"]
        old: dict[str, float] = store["caps"]
        changed = store.get("changed")
        recent = changed and now - datetime.fromisoformat(changed) < SURPLUS_LOWER_EVERY
        result = {}
        for key, kw in caps.items():
            before = old.get(key)
            if (
                before is not None
                and kw < before
                and (recent or before - kw < SURPLUS_LOWER_KW)
            ):
                kw = before
            result[key] = kw
        if result != old:
            store["changed"] = now.isoformat(timespec="seconds")
        return result

    def _surplus_forget(self, reason: str) -> None:
        """No cap any more (the release puts the originals back)."""
        store = self.data["surplus"]
        if store["caps"]:
            self._log("surplus_end", reason=reason)
        store.update(caps={}, changed=None, logged=None)
        if self.surplus.get("state") == "cap":
            self.surplus = {**self.surplus, "state": reason}

    async def _async_surplus_off(
        self, config: dict[str, Any], now: datetime, reason: str
    ) -> None:
        """Put the charge limits of a daytime cap (or a test limit) back right away."""
        learn = self.data["surplus"].get("learn")
        if learn:
            battery = next(
                (b for b in config["batteries"] if b["id"] == learn["battery"]), None
            )
            adapter = make_adapter(battery) if battery else None
            await self._async_learn_end(
                adapter if isinstance(adapter, RoleAdapter) else None,
                learn,
                None,
                reason,
            )
        caps = self.data["surplus"]["caps"]
        if not caps:
            return
        for battery in config["batteries"]:
            adapter = make_adapter(battery)
            if battery["id"] in caps and isinstance(adapter, RoleAdapter):
                await self._async_unlimit(adapter, now)
        self._surplus_forget(reason)
        self.surplus = {**self.surplus, "state": reason}

    # --- several batteries one after the other ---------------------------------

    async def _async_team(
        self,
        config: dict[str, Any],
        plan: dict[str, Any] | None,
        mode: str,
        now: datetime,
        night: bool = False,
    ) -> tuple[dict[str, tuple[bool, bool]], dict[str, Any] | None]:
        """Which battery may work now, and the blocks for the others.

        Batteries that regulate themselves to 0 W at the grid meter (Fronius,
        Omnibattery in automatic mode) shift energy between each other when
        two systems work. With "Nacheinander" (rules.battery_team) exactly
        one group (the batteries one system regulates) is free, the others
        are blocked ahead of time (see control/team.py).
        Only by day and only live; the simulation and "suggest" show what Joe
        would do. During the night's plan it only watches: the night's
        steering comes first (it blocks the others itself while one charges
        from the grid), and the blocks are given back as the night begins.
        Automations that write to these batteries (the owner's own interlock)
        keep Joe's hands off until they are switched off.

        Returns per battery (charge blocked, discharge blocked) and, for the
        daytime cap, the active group with the batteries waiting or charging
        side by side (None while Joe does not coordinate).
        """
        rules = config["rules"]
        store: dict[str, Any] = self.data["team"]
        today = dt_util.as_local(now).date().isoformat()
        groups = self._team_groups(config)
        # Forget what belongs to batteries (and groups) that are gone; a
        # group's fullness is watched under "group:<its key>".
        ids = {b["id"] for b in config["batteries"]} | {
            f"group:{g[0]}" for g in groups.values()
        }
        for key in ("empty", "full", "watch", "cutoffs"):
            store[key] = {k: v for k, v in (store[key] or {}).items() if k in ids}
        info: dict[str, Any] = {
            "state": "on",
            "mode": rules.get("battery_team"),
            "dry": mode != "live",
            "active": None,
            "flow": None,
            "parallel": False,
            "batteries": {},
            "automations": [],
            "proposal": False,
            "groups": {},
            "group_question": False,
        }
        candidates: list[tuple[dict[str, Any], RoleAdapter | None]] = []
        powers: dict[str, float] = {}
        for battery in config["batteries"]:
            adapter = make_adapter(battery)
            role = adapter if isinstance(adapter, RoleAdapter) else None
            proposed = self._proposed_regulating(battery)
            own = battery.get("self_regulating")
            regulating = proposed if own is None else bool(own)
            soc = number(self._hass.states.get(battery["soc_entity"]))
            power = _charge_w(self._hass, battery)
            if power is not None:
                powers[battery["id"]] = power
            info["batteries"][battery["id"]] = {
                "name": battery["name"],
                "self_regulating": regulating,
                "proposed": proposed,
                "soc": None if soc is None else round(soc, 1),
                "power_w": None if power is None else round(power),
                "cutoff": battery.get("cutoff_soc"),
                "floor": self._team_floor(battery, role),
                "charge": None,
                "discharge": None,
                "why": None,
                "problem": None,
                "group": groups[battery["id"]][0],
                "group_proposed": groups[battery["id"]][1],
                "group_sure": groups[battery["id"]][2],
            }
            if regulating:
                candidates.append((battery, role))
        for battery, _ in candidates:
            key = groups[battery["id"]][0]
            group = info["groups"].setdefault(key, {"batteries": []})
            group["batteries"].append(battery["id"])
        # Unsure who regulates whom: Joe asks ("Welche Speicher werden vom
        # selben System geregelt?") until the owner says it.
        info["group_question"] = len(candidates) >= 2 and any(
            battery.get("control_group") is None and not groups[battery["id"]][2]
            for battery, _ in candidates
        )
        info["proposal"] = (
            len(info["groups"]) >= 2 and rules.get("battery_team") is None
        )
        deficit = self._team_deficit(config, powers)
        if mode != "off" and not night:
            self._team_learn(candidates, powers, deficit, now)
        state = self._team_gate(config, candidates, mode, today, night, info, groups)
        info["state"] = state
        want: dict[str, tuple[bool, bool]] = {}
        hint: dict[str, Any] | None = None
        if state == "on":
            want, hint = self._team_choose(
                config, plan, candidates, deficit, powers, now, today, info, groups
            )
        else:
            store.update(active=None, since=None)
        self.team = info
        if state != "on":
            self._team_publish()
        return want, hint

    def _team_publish(self) -> None:
        """Tell the panel when what the batteries do together changed."""
        if self.team != self._team_shown:
            self._team_shown = deepcopy(self.team)
            self._changed()

    def _team_gate(
        self,
        config: dict[str, Any],
        candidates: list[tuple[dict[str, Any], RoleAdapter | None]],
        mode: str,
        today: str,
        night: bool,
        info: dict[str, Any],
        groups: dict[str, tuple[str, str, bool]],
    ) -> str:
        """Why Joe does not coordinate now, or "on"."""
        choice = config["rules"].get("battery_team")
        if choice != "sequence":
            return "unset" if choice is None else "together"
        if mode == "off":
            return "off"
        if len(candidates) < 2:
            return "single"
        if len(info["groups"]) < 2:
            # One system regulates them all: nothing runs against it by day.
            return "one_group"
        if night:
            return "night"
        if self.data["team"]["paused"] == today:
            return "paused"
        seen: dict[str, str] = {}
        state = "on"
        keys = {k: v[0] for k, v in groups.items()}
        for battery, role in candidates:
            entry = info["batteries"][battery["id"]]
            whole = role is not None and self._whole_system(config, keys, battery, role)
            problem = (
                role.team_problem(self._hass, whole)
                if role is not None
                else "no_charge_lever"
            )
            if problem:
                entry["problem"] = problem
                state = "levers"
                continue
            assert role is not None
            for entity_id in role.team_entities(whole):
                if (
                    seen.setdefault(entity_id, keys[battery["id"]])
                    != keys[battery["id"]]
                ):
                    # Two groups behind one limit cannot take turns.
                    entry["problem"] = "shared"
                    state = "levers"
            if state == "on" and not self.tested(battery):
                entry["problem"] = "not_tested"
                state = "not_tested"
            if state == "on" and entry["soc"] is None:
                entry["problem"] = "soc_unknown"
                state = "unknown"
        if state != "on":
            return state
        names = self._team_automations(config, {b["id"] for b, _ in candidates})
        if names:
            info["automations"] = names
            return "automation"
        if (
            measurement_kw(self._hass.states.get, config["measurements"]["grid_power"])
            is None
        ):
            return "no_grid"
        return "on"

    def _team_choose(
        self,
        config: dict[str, Any],
        plan: dict[str, Any] | None,
        candidates: list[tuple[dict[str, Any], RoleAdapter | None]],
        deficit: float | None,
        powers: dict[str, float],
        now: datetime,
        today: str,
        info: dict[str, Any],
        groups: dict[str, tuple[str, str, bool]],
    ) -> tuple[dict[str, tuple[bool, bool]], dict[str, Any]]:
        """The active group, the blocks for the others and the hint for the cap."""
        rules = config["rules"]
        store: dict[str, Any] = self.data["team"]
        sizes = {
            b["id"]: b.get("capacity") for b in (plan or {}).get("batteries") or []
        }
        members: list[team_rules.Member] = []
        for battery, role in candidates:
            entry = info["batteries"][battery["id"]]
            size = sizes.get(battery["id"]) or battery.get("capacity_kwh") or 5.0
            member = team_rules.Member(
                id=battery["id"],
                soc=entry["soc"],
                cutoff=battery.get("cutoff_soc"),
                floor=entry["floor"],
                capacity=size,
                max_kw=(battery.get("max_charge_w") or min(5.0, size * 0.5) * 1000)
                / 1000,
                full_at=self._team_full_at(role),
                empty=battery["id"] in store["empty"],
                full=battery["id"] in store["full"],
            )
            empty, full = team_rules.mark(
                member, store["empty"].get(member.id), store["full"].get(member.id)
            )
            if empty and not member.empty:
                store["empty"][member.id] = entry["soc"]
            elif not empty:
                store["empty"].pop(member.id, None)
            if full and not member.full:
                store["full"][member.id] = entry["soc"]
            elif not full:
                store["full"].pop(member.id, None)
            member.empty, member.full = empty, full
            members.append(member)
        teams = team_rules.grouped(members, {k: v[0] for k, v in groups.items()})
        flow, steady, raw = self._team_flow(deficit, now)
        info["flow"] = flow
        active = store["active"]
        # A group free to charge that takes nothing while the house gives to
        # the grid is as full as it goes (its own target, a BMS limit); not
        # while the grid-friendly morning holds its charging back.
        current = next((g for g in teams if g.id == active), None)
        if (
            current is not None
            and not current.full
            and deficit is not None
            and all(k in powers for k in current.ids)
            and not self.data.get("day")
        ):
            watch = store["watch"].setdefault(f"group:{current.id}", {})
            power = sum(powers[k] for k in current.ids)
            if team_rules.watch_full(watch, power, -deficit * 1000, now):
                for member in current.members:
                    if not member.full:
                        member.full = True
                        store["full"][member.id] = member.soc
        charge_order = team_rules.ordered(teams, rules.get("team_charge_order") or [])
        discharge_order = team_rules.ordered(
            teams, rules.get("team_discharge_order") or []
        )
        chosen, why = team_rules.choose(
            charge_order, discharge_order, active, flow, steady
        )
        group = next(g for g in teams if g.id == chosen)
        if chosen != active:
            if active is not None:
                previous = next((g for g in teams if g.id == active), None)
                self._log(
                    "team_handover",
                    battery=group.ids[0],
                    batteries=group.ids,
                    previous=previous.ids[0] if previous else active,
                    reason=why,
                    soc=(
                        round(
                            sum(m.soc for m in previous.members)
                            / len(previous.members),
                            1,
                        )
                        if previous
                        else None
                    ),
                )
            store.update(active=chosen, since=now.isoformat(timespec="seconds"))
        # The panel names the group by its batteries (the first one leads).
        info["active"] = group.ids[0]
        info["active_group"] = chosen
        info["active_batteries"] = group.ids
        info["since"] = store["since"]
        for team_group in teams:
            info["groups"][team_group.id].update(
                empty=team_group.empty, full=team_group.full
            )
        parallel = self._team_parallel(config, plan, charge_order, now, today)
        info["parallel"] = parallel
        side: set[str] = set()
        if parallel and flow == "surplus" and raw == "surplus":
            side = {k for g in teams if g.id != chosen and not g.full for k in g.ids}
        want: dict[str, tuple[bool, bool]] = {}
        for team_group in teams:
            for member in team_group.members:
                entry = info["batteries"][member.id]
                if team_group.id == chosen:
                    # Side by side, nobody may discharge into the others: on a
                    # cloud they are blocked again and the active group is free.
                    want[member.id] = (False, bool(side))
                    entry.update(
                        charge="free",
                        discharge="blocked" if side else "free",
                        why="active",
                    )
                elif member.id in side:
                    want[member.id] = (False, True)
                    entry.update(charge="free", discharge="blocked", why="parallel")
                else:
                    want[member.id] = (True, True)
                    entry.update(charge="blocked", discharge="blocked")
                    if flow == "surplus":
                        entry["why"] = "full" if team_group.full else "waits_full"
                    else:
                        entry["why"] = "empty" if team_group.empty else "waits_empty"
                entry["empty"] = member.empty
                entry["full"] = member.full
        hint = {
            "active": chosen,
            "active_batteries": group.ids,
            "blocked": [k for k, (charge, _) in want.items() if charge],
            "parallel": sorted(side),
        }
        return want, hint

    def _team_flow(
        self, deficit: float | None, now: datetime
    ) -> tuple[str | None, bool, str | None]:
        """The flow Joe goes by (once seen for a while), whether it has lasted
        long enough for the order to count, and the flow seen right now."""
        store: dict[str, Any] = self.data["team"]
        raw = None
        if deficit is not None:
            if deficit > team_rules.FLOW_KW:
                raw = "deficit"
            elif deficit < -team_rules.FLOW_KW:
                raw = "surplus"
        stamp = now.isoformat(timespec="seconds")
        if raw is not None:
            if store["raw"] != raw or not store["raw_since"]:
                store.update(raw=raw, raw_since=stamp)
            dwell = team_rules.FLOW_DWELL if store["flow"] else timedelta(0)
            if (
                raw != store["flow"]
                and now - datetime.fromisoformat(store["raw_since"]) >= dwell
            ):
                store.update(flow=raw, flow_since=stamp)
        since = store.get("flow_since")
        steady = bool(
            since and now - datetime.fromisoformat(since) >= team_rules.PREFER_DWELL
        )
        return store["flow"], steady, raw

    def _team_deficit(
        self, config: dict[str, Any], powers: dict[str, float]
    ) -> float | None:
        """What the house needs on top of the sun (kW; negative: it gives).

        From the grid meter and the batteries: what comes from the grid plus
        what the batteries give.
        """
        grid = measurement_kw(
            self._hass.states.get, config["measurements"]["grid_power"]
        )
        if grid is None:
            return None
        return grid - sum(powers.values()) / 1000

    def _team_learn(
        self,
        candidates: list[tuple[dict[str, Any], RoleAdapter | None]],
        powers: dict[str, float],
        deficit: float | None,
        now: datetime,
    ) -> None:
        """Watch for the level each battery really stops discharging at."""
        store: dict[str, Any] = self.data["team"]
        if deficit is None:
            return
        for battery, _ in candidates:
            key = battery["id"]
            power = powers.get(key)
            soc = number(self._hass.states.get(battery["soc_entity"]))
            if power is None or soc is None:
                continue
            blocked = (store["blocks"].get(key) or {}).get("discharge", False)
            watch = store["watch"].setdefault(key, {})
            found = team_rules.watch_cutoff(
                watch, soc, power, deficit * 1000, not blocked, now
            )
            if found is None:
                continue
            seen: list[float] = store["cutoffs"].setdefault(key, [])
            seen.append(found)
            del seen[: -team_rules.KEEP]
            store["empty"][key] = found
            value = team_rules.learned(seen)
            self._log("team_cutoff", battery=key, soc=found, value=value)
            known = battery.get("cutoff_soc")
            if (
                value is not None
                and self.on_cutoff
                and (known is None or abs(known - value) >= 0.2)
            ):
                self.on_cutoff(key, value)

    def _team_parallel(
        self,
        config: dict[str, Any],
        plan: dict[str, Any] | None,
        members: list[team_rules.Member],
        now: datetime,
        today: str,
    ) -> bool:
        """Whether the batteries charge side by side today: the cautious sun
        would not fill them one after the other before it goes. Once decided,
        for the rest of the day (no back and forth with the clouds)."""
        store: dict[str, Any] = self.data["team"]
        if store["parallel"] == today:
            return True
        hours = (plan or {}).get("hours")
        if not plan or not hours or all(m.full for m in members):
            return False
        caution = day_surplus.CAUTION.get(config["rules"]["day_caution"], 0.8)
        created = (
            datetime.fromisoformat(plan["created"]) if plan.get("created") else None
        )
        found = day_surplus.slots(hours, created, now, caution)
        end = day_surplus.pv_end(found, now)
        if end is None or now >= end:
            return False
        if not any(s.surplus > 0 for s in found if s.start < end):
            return False
        if team_rules.sequential_fills(found, members, end):
            return False
        store["parallel"] = today
        self._log("team_parallel", until=end.isoformat(timespec="minutes"))
        return True

    async def _async_team_apply(
        self,
        config: dict[str, Any],
        want: dict[str, tuple[bool, bool]],
        taken: set[str],
        now: datetime,
    ) -> set[str]:
        """Write the blocks (live only); give back what is free again.

        A charge limit someone else holds right now (the daytime cap, the
        grid-friendly morning, a test limit) stays theirs while it blocks
        charging, too; one that lets a waiting battery charge does not count:
        Joe blocks it all the same (it would charge from the group that
        discharges). Returns the entities (and batteries) to leave as they are.
        """
        store: dict[str, Any] = self.data["team"]
        if not want or self.team.get("state") != "on" or self.team.get("dry"):
            reason = "dry" if self.team.get("dry") else self.team.get("state")
            await self._async_team_off(config, now, reason or "off")
            self._team_publish()
            return set()
        keep: set[str] = set()
        batteries = {b["id"]: b for b in config["batteries"]}
        groups = {k: v[0] for k, v in self._team_groups(config).items()}
        for key, (charge, discharge) in want.items():
            adapter = make_adapter(batteries[key])
            assert isinstance(adapter, RoleAdapter)
            whole = self._whole_system(config, groups, batteries[key], adapter)
            charge_taken = any(e in taken for e in adapter.team_charge_entities(whole))
            if charge and charge_taken and not adapter.charge_blocked(self._hass):
                # Someone else's limit lets it charge while it waits: blocked.
                charge_taken = False
                self._log("team_taken", battery=key)
            writes, give_back = adapter.team_block(
                self._hass, charge, discharge, charge_taken, whole
            )
            if give_back:
                await self._async_team_free(adapter, give_back, now)
            problem = None
            if writes:
                problem = await self._async_write(adapter, writes, now, None)
                keep |= {w.entity_id for w in writes} | {key}
            entry = self.team["batteries"][key]
            entry["problem"] = problem
            blocks = {"charge": charge and not charge_taken, "discharge": discharge}
            if charge and charge_taken:
                # Blocked all the same, by the limit someone else holds at 0.
                entry["charge"] = "blocked"
            if store["blocks"].get(key, {"charge": False, "discharge": False}) != (
                blocks
            ):
                self._log("team_block", battery=key, **blocks)
            if blocks["charge"] or blocks["discharge"]:
                store["blocks"][key] = blocks
            else:
                store["blocks"].pop(key, None)
        # Batteries no longer in the team (no longer regulating themselves).
        for key in [k for k in store["blocks"] if k not in want]:
            await self._async_team_release(config, key, now)
        self._team_publish()
        return keep

    async def _async_team_off(
        self, config: dict[str, Any], now: datetime, reason: str
    ) -> None:
        """Every block back as it was (a charge limit held by a daytime cap or
        the morning stays theirs; the release puts it back after them)."""
        store: dict[str, Any] = self.data["team"]
        if not store["blocks"]:
            return
        for key in list(store["blocks"]):
            await self._async_team_release(config, key, now)
        self._log("team_end", reason=reason)

    async def _async_team_release(
        self, config: dict[str, Any], key: str, now: datetime
    ) -> None:
        """One battery's blocks back (a battery that is gone: the release does it)."""
        store: dict[str, Any] = self.data["team"]
        battery = next((b for b in config["batteries"] if b["id"] == key), None)
        adapter = make_adapter(battery) if battery else None
        if isinstance(adapter, RoleAdapter):
            roles = adapter.team_release_roles()
            if key in self.data["surplus"]["caps"] or self.data.get("day"):
                # The cap or the morning holds the charge limit (with the
                # system's shared switch all of it): theirs to give back.
                held = set(adapter.limit_roles() or ())
                if adapter.limit_shared():
                    held |= set(adapter.discharge_roles() or ())
                roles = [r for r in roles if r not in held]
            await self._async_team_free(adapter, roles, now)
            self._log("team_block", battery=key, charge=False, discharge=False)
        store["blocks"].pop(key, None)

    async def _async_team_free(
        self, adapter: RoleAdapter, roles: list[str], now: datetime
    ) -> None:
        """These levers back as they were (what an automation set meanwhile
        stays); what is back is no longer Joe's to restore."""
        entities = [adapter.controls[r] for r in roles if r in adapter.controls]
        saved: dict[str, Any] = self.data["saved"]
        if not any(e in saved for e in entities):
            return
        self._drop_foreign(entities)
        writes = adapter.team_free(saved, roles)
        if writes:
            await self._async_write(adapter, writes, now, None)
        for entity_id in entities:
            if entity_id in saved and matches(
                self._hass, fit(self._hass, Write(entity_id, saved[entity_id]))
            ):
                saved.pop(entity_id, None)
                self.data["written"].pop(entity_id, None)
        if not any(e in saved for e in adapter.entities()):
            key = adapter.battery["id"]
            self.data["active"] = [k for k in self.data["active"] if k != key]

    # --- the watchdog: batteries running against each other -------------------

    @callback
    def _on_guard_tick(self, now: datetime) -> None:
        self._hass.async_create_task(self.async_guard(), eager_start=False)

    async def async_guard(self) -> None:
        """One look of the watchdog (every few seconds, see control/guard.py)."""
        if self.testing:
            return
        try:
            await self._async_guard(dt_util.now())
        except Exception:
            _LOGGER.exception("The watchdog failed")
            # Never leave a switch of the watchdog as it is.
            async with self._lock:
                await self._async_guard_restore("error")

    async def _async_guard(self, now: datetime) -> None:
        """Two batteries running against each other: step in by stages.

        Runs whenever at least two batteries have a power meter, with or
        without "Nacheinander". Writes only live; the simulation and
        "suggest" log what Joe would do. During the night's plan Joe steers
        the batteries himself (and blocks the others while one charges from
        the grid): then he only notes it. An automation that writes the same
        levers (the owner's own watchdog) keeps his hands off. Inside one
        group (batteries one system regulates) he only notes it and speaks up.
        """
        config, mode = self._config(), self._mode()
        store: dict[str, Any] = self.data["guard"]
        powers: dict[str, float] = {}
        for battery in config["batteries"]:
            power = _charge_w(self._hass, battery)
            if power is not None:
                powers[battery["id"]] = power
        state = "on"
        if not config["rules"].get("transfer_guard", True):
            state = "off"
        elif mode == "off":
            state = "mode_off"
        elif len(powers) < 2:
            state = "single"
        dry = mode != "live"
        if store["held"]:
            # Left over (a failed write, a mode change): back first.
            async with self._lock:
                await self._async_guard_restore("retry" if state == "on" else state)
        if state != "on":
            if store["since"] is not None:
                store.update(since=None, stage=0, stage_at=None, noted=None)
            self._guard_publish(config, state, dry, False, now)
            return
        charging, discharging = guard_rules.opposite(powers)
        running = bool(charging)
        since, stage = store["since"], store["stage"]
        due = guard_rules.step(store, running, now)
        if due == "fixed":
            await self._async_guard_fixed(store, since, stage, now)
        elif due is not None and due != "ended":
            async with self._lock:
                await self._async_guard_stage(
                    config, store, int(due[-1]), charging, discharging, dry, now
                )
        self._guard_publish(config, state, dry, running, now)

    async def _async_guard_stage(
        self,
        config: dict[str, Any],
        store: dict[str, Any],
        stage: int,
        charging: list[str],
        discharging: list[str],
        dry: bool,
        now: datetime,
    ) -> None:
        """Step in: restart the battery's own control, block its direction for
        a few seconds or speak up; a stage it has no lever for is skipped."""
        batteries = {b["id"]: b for b in config["batteries"]}
        if store["battery"] not in (*charging, *discharging):
            store["battery"] = guard_rules.cause(
                list(batteries),
                charging,
                discharging,
                self._guard_levers(config),
                self.team.get("active_batteries") or self.data["team"]["active"],
            )
        key = store["battery"]
        adapter = make_adapter(batteries[key])
        role = adapter if isinstance(adapter, RoleAdapter) else None
        direction = "charge" if key in charging else "discharge"
        detail = {"battery": key, "charging": charging, "discharging": discharging}
        if self.status.get("reason") == "steering" or self._guard_joe_holds(role):
            # Joe's own command (the night, charging by hand): not fought.
            if store["noted"] != "joe":
                store["noted"] = "joe"
                self._log("guard_joe", **detail)
                self._guard_last(store, now, 0, "joe", detail, dry, direction)
                await self._async_save()
            return
        names = self._guard_automations(config, key, now)
        if names:
            if store.get("handed") != names:
                store["handed"] = names
                self._log("guard_automation", names=names, **detail)
            if store["noted"] != "automation":
                store["noted"] = "automation"
                self._guard_last(store, now, 0, "automation", detail, dry, direction)
                await self._async_save()
            return
        groups = {k: v[0] for k, v in self._team_groups(config).items()}
        if team_rules.transfer_inside(charging, discharging, groups):
            # Its own system shares the power wrongly: not Joe's to fight.
            await self._async_guard_inside(
                store, stage, charging, discharging, detail, dry, direction, now
            )
            return
        store["handed"] = None
        store["noted"] = None
        group = self._guard_group(config, groups, key)
        if stage == 1 and not (role and role.guard_can_restart()):
            stage = 2
        if stage == 2 and not any(
            adapter.guard_block_roles(direction, whole) for adapter, whole in group
        ):
            stage = 3
        problem: str | None = None
        if stage == 1:
            assert role is not None
            clean, problem = await self._async_guard_restart(role, dry)
            self._log("guard_restart", clean=clean, dry=dry, problem=problem, **detail)
        elif stage == 2:
            problem = await self._async_guard_block(group, direction, dry)
            self._log(
                "guard_block", direction=direction, dry=dry, problem=problem, **detail
            )
        else:
            self._log("guard_alarm", dry=dry, **detail)
            if not dry and self.notifier and guard_rules.may_tell(store, now):
                store["told"] = now.isoformat(timespec="seconds")
                names_of = {k: b["name"] for k, b in batteries.items()}
                await self.notifier.async_problem(
                    "battery_transfer",
                    charging=", ".join(names_of.get(k, k) for k in charging),
                    discharging=", ".join(names_of.get(k, k) for k in discharging),
                )
        after = dt_util.now()
        guard_rules.done(store, stage, after)
        self._guard_last(
            store,
            after,
            stage,
            "alarm" if stage == 3 else "running",
            detail,
            dry,
            direction,
        )
        await self._async_save()

    async def _async_guard_fixed(
        self, store: dict[str, Any], since: str | None, stage: int, now: datetime
    ) -> None:
        """It stopped after Joe stepped in: "Behoben nach …"."""
        seconds = guard_rules.seconds_since(since, now)
        last = store["last"] or {}
        self._log(
            "guard_fixed",
            battery=store["battery"],
            stage=stage,
            seconds=seconds,
            dry=bool(last.get("dry")),
        )
        inside = last.get("result") == "inside"
        if last.get("since") == since:
            last.update(
                result="inside" if inside else "fixed",
                at=now.isoformat(timespec="seconds"),
                seconds=seconds,
            )
            if inside:
                last["over"] = True
        if stage >= 3 and self.notifier:
            await self.notifier.async_clear(
                "battery_transfer_inside" if inside else "battery_transfer"
            )
        store["battery"] = None
        await self._async_save()

    def _guard_last(
        self,
        store: dict[str, Any],
        now: datetime,
        stage: int,
        result: str,
        detail: dict[str, Any],
        dry: bool,
        direction: str,
    ) -> None:
        """The last time it happened, for the panel."""
        store["last"] = {
            **detail,
            "since": store["since"],
            "at": now.isoformat(timespec="seconds"),
            "stage": stage,
            "result": result,
            "dry": dry,
            "direction": direction,
            "seconds": guard_rules.seconds_since(store["since"], now),
        }

    async def _async_guard_restart(
        self, role: RoleAdapter, dry: bool
    ) -> tuple[bool, str | None]:
        """Stage 1: the battery's own control starts again. Returns whether a
        manual mode held by something else was ended cleanly, and a problem.

        Manual mode off: on for a moment and off again (a restart of
        Omnibattery's PD controller). Manual mode on (a forced charge or
        discharge of something else): force mode "None", the setpoints 0,
        manual mode off, a second between them; that is no value of Joe's
        to put back.
        """
        clean = any(read(self._hass, e) is True for e in role.guard_manual())
        if dry:
            return clean, None
        if clean:
            for write in role.guard_exit(self._hass):
                try:
                    await async_apply(self._hass, write)
                except WriteError as err:
                    return True, err.code
                await joe_writes.settle(max(write.pause, guard_rules.PACE_S))
            return True, None
        manual = role.controls["system_manual_mode"]
        problem = await self._async_guard_hold([Write(manual, True)])
        if problem is None:
            await joe_writes.settle(guard_rules.PULSE_S)
        failed = await self._async_guard_restore("done")
        return False, problem or ("restore" if failed else None)

    async def _async_guard_inside(
        self,
        store: dict[str, Any],
        stage: int,
        charging: list[str],
        discharging: list[str],
        detail: dict[str, Any],
        dry: bool,
        direction: str,
        now: datetime,
    ) -> None:
        """Batteries of one group charge each other: noted once per time and
        told (at most once per COOLDOWN), no stage of Joe's."""
        guard_rules.done(store, 3, now)
        if store["noted"] == "inside":
            return
        store["noted"] = "inside"
        self._log("guard_inside", dry=dry, **detail)
        self._guard_last(store, now, 0, "inside", detail, dry, direction)
        if not dry and self.notifier and guard_rules.may_tell(store, now):
            store["told"] = now.isoformat(timespec="seconds")
            names = {b["id"]: b["name"] for b in self._config()["batteries"]}
            await self.notifier.async_problem(
                "battery_transfer_inside",
                charging=", ".join(names.get(k, k) for k in charging),
                discharging=", ".join(names.get(k, k) for k in discharging),
            )
        await self._async_save()

    def _guard_group(
        self, config: dict[str, Any], groups: dict[str, str], key: str
    ) -> list[tuple[RoleAdapter, bool]]:
        """The batteries of a battery's group with their adapter, and whether
        the system's limits may block them (the same levers as "Nacheinander")."""
        result = []
        for battery in config["batteries"]:
            if groups.get(battery["id"]) != groups.get(key):
                continue
            adapter = make_adapter(battery)
            if isinstance(adapter, RoleAdapter):
                whole = self._whole_system(config, groups, battery, adapter)
                result.append((adapter, whole))
        return result

    async def _async_guard_block(
        self, group: list[tuple[RoleAdapter, bool]], direction: str, dry: bool
    ) -> str | None:
        """Stage 2: the current direction of the culprit's group blocked for a
        few seconds, then back as it was."""
        if dry:
            return None
        writes: list[Write] = []
        for adapter, whole in group:
            for write in adapter.guard_block(direction, whole, self._hass):
                if all(w.entity_id != write.entity_id for w in writes):
                    writes.append(write)
        problem = await self._async_guard_hold(writes)
        if problem is None:
            await joe_writes.settle(guard_rules.BLOCK_S)
        failed = await self._async_guard_restore("done")
        return problem or ("restore" if failed else None)

    async def _async_guard_hold(self, writes: list[Write]) -> str | None:
        """Write, noting each value before on disk first (it goes back after
        the stage, after a restart, a stop or an error)."""
        held: dict[str, Any] = self.data["guard"]["held"]
        for write in writes:
            if write.entity_id not in held:
                original = read(self._hass, write.entity_id)
                if original is None:
                    return "unavailable"
                held[write.entity_id] = original
        await self._async_save()
        for index, write in enumerate(writes):
            if index:
                await joe_writes.settle(guard_rules.PACE_S)
            try:
                await async_apply(self._hass, write)
            except WriteError as err:
                self._log("failed", battery=None, entity=err.entity_id, code=err.code)
                return err.code
        return None

    async def _async_guard_restore(self, reason: str) -> list[str]:
        """What the watchdog switched back as it was, newest first; returns
        what failed (kept for the next try)."""
        held: dict[str, Any] = self.data["guard"]["held"]
        if not held:
            return []
        back: list[str] = []
        failed: list[str] = []
        for index, entity_id in enumerate(reversed(list(held))):
            write = Write(entity_id, held[entity_id])
            if index:
                await joe_writes.settle(guard_rules.PACE_S)
            if not matches(self._hass, fit(self._hass, write)):
                try:
                    await async_apply(self._hass, write)
                except WriteError:
                    failed.append(entity_id)
                    continue
            held.pop(entity_id, None)
            back.append(entity_id)
        # Logged when something came back outside a stage, or failed (a retry
        # that fails again every few seconds is no news).
        if (back and reason != "done") or (failed and reason != "retry"):
            self._log("guard_restored", reason=reason, entities=back, failed=failed)
        await self._async_save()
        return failed

    def _guard_joe_holds(self, role: RoleAdapter | None) -> bool:
        """Whether Joe himself commands the battery now (its mode, power or
        manual mode noted to put back: the night, charging by hand, a test)."""
        if role is None:
            return False
        saved: dict[str, Any] = self.data["saved"]
        levers = [
            *(
                role.controls.get(r)
                for r in ("mode", "charge_power", "discharge_power")
            ),
            *role.guard_manual(),
        ]
        return any(e in saved for e in levers if e)

    def _guard_levers(self, config: dict[str, Any]) -> dict[str, tuple[bool, bool]]:
        """Per battery: whether Joe can restart its control and block it."""
        result = {}
        groups = {k: v[0] for k, v in self._team_groups(config).items()}
        for battery in config["batteries"]:
            adapter = make_adapter(battery)
            if isinstance(adapter, RoleAdapter):
                whole = self._whole_system(config, groups, battery, adapter)
                result[battery["id"]] = (
                    adapter.guard_can_restart(),
                    bool(
                        adapter.guard_block_roles("charge", whole)
                        or adapter.guard_block_roles("discharge", whole)
                    ),
                )
        return result

    def _guard_entities(self, battery: dict[str, Any]) -> set[str]:
        """The levers the watchdog writes for a battery."""
        adapter = make_adapter(battery)
        if not isinstance(adapter, RoleAdapter):
            return set()
        found = set(adapter.guard_manual()) if adapter.guard_can_restart() else set()
        for direction in ("charge", "discharge"):
            found |= {
                adapter.controls[r] for r in adapter.guard_block_roles(direction, True)
            }
        return found

    def _guard_automations(
        self, config: dict[str, Any], key: str | None, now: datetime
    ) -> list[str]:
        """Automations (switched on) that write the watchdog's levers of this
        battery (None: of the one Joe would pick first): the owner's own
        watchdog does it so far. Looked up at most once a minute."""
        if key is None:
            levers = self._guard_levers(config)
            ids = [k for k in levers if any(levers[k])]
            if not ids:
                return []
            key = guard_rules.cause(ids, ids, [], levers)
        cached = self._guard_seen
        if cached and cached[0] == key and now - cached[1] < CHECK_EVERY:
            return list(cached[2])
        battery = next((b for b in config["batteries"] if b["id"] == key), None)
        names: list[str] = []
        if battery is not None:
            entities = self._guard_entities(battery)
            try:
                found = battery_automations.find(
                    self._hass, config, self.data["automations_off"]
                )
            except Exception:
                _LOGGER.exception("Looking for automations failed")
                found = []
            names = [
                a["name"]
                for a in found
                if a["on"]
                and any(
                    w["entity_id"] in entities
                    or (w["entity_id"] is None and w["battery_id"] == key)
                    for w in a["writes"]
                )
            ]
        self._guard_seen = (key, now, names)
        return list(names)

    def _guard_publish(
        self,
        config: dict[str, Any],
        state: str,
        dry: bool,
        running: bool,
        now: datetime,
    ) -> None:
        """Tell the panel when what the watchdog does changed."""
        store: dict[str, Any] = self.data["guard"]
        info = {
            "state": state,
            "dry": dry,
            "running": running,
            "stage": store["stage"] if running else 0,
            "automations": self._guard_automations(config, None, now)
            if state == "on"
            else [],
            "last": deepcopy(store["last"]),
        }
        if info != self.guard:
            self.guard = info
            self._changed()

    def _team_automations(self, config: dict[str, Any], ids: set[str]) -> list[str]:
        """Automations (switched on) that write to these batteries: the owner's
        own interlock does Joe's job so far. Found as the "Störenfriede"
        (control/automations.py); one that only reads or tells is none."""
        try:
            found = battery_automations.find(
                self._hass, config, self.data["automations_off"]
            )
        except Exception:
            _LOGGER.exception("Looking for automations failed")
            return []
        return [
            a["name"]
            for a in found
            if a["on"] and any(w["battery_id"] in ids for w in a["writes"])
        ]

    def _proposed_regulating(self, battery: dict[str, Any]) -> bool:
        """Whether a battery regulates itself to 0 W at the grid meter, as its
        profile says: Fronius and Kostal always, Omnibattery in automatic mode."""
        adapter = battery.get("adapter")
        if adapter in ("fronius", "kostal_plenticore"):
            return True
        if adapter != "omnibattery":
            return False
        for step in battery.get("prepare") or []:
            entity_id = step["entity_id"]
            # Joe's own manual mode at night does not count: its original does.
            value = (
                self.data["saved"][entity_id]
                if entity_id in self.data["saved"]
                else read(self._hass, entity_id)
            )
            if value is True or value == step.get("value"):
                return False
        return True

    def _proposed_group(self, battery: dict[str, Any]) -> tuple[str, bool]:
        """The system Joe thinks regulates a battery, and whether he is sure.

        The batteries of one integration entry (all batteries of one
        Omnibattery, a Fronius or Kostal inverter with its battery) are
        regulated by its system; Omnibattery's batteries also by the system
        limits they share. Batteries Joe steers through levers the owner
        assigned (or only watches) are a system of their own until the owner
        says otherwise.
        """
        adapter = battery.get("adapter") or "none"
        profiled = profile_for(adapter) is not None and adapter not in (
            "generic",
            "steps",
        )
        if profiled:
            item = er.async_get(self._hass).async_get(battery["soc_entity"])
            if item is not None and item.config_entry_id:
                return f"entry:{item.config_entry_id}", True
            shared = (battery.get("controls") or {}).get("system_charge_limit")
            if shared:
                return f"system:{shared}", True
        return f"own:{battery['id']}", profiled

    def _team_groups(self, config: dict[str, Any]) -> dict[str, tuple[str, str, bool]]:
        """Per battery: its group (as set, else as proposed), the proposal and
        whether Joe is sure of it."""
        result = {}
        for battery in config["batteries"]:
            proposed, sure = self._proposed_group(battery)
            result[battery["id"]] = (
                battery.get("control_group") or proposed,
                proposed,
                sure,
            )
        return result

    def _whole_system(
        self,
        config: dict[str, Any],
        groups: dict[str, str],
        battery: dict[str, Any],
        adapter: RoleAdapter,
    ) -> bool:
        """Whether every battery behind this battery's system limits is in its
        group (only then may Joe block the group with them)."""
        key = adapter.system_key()
        if key is None:
            return True
        mine = groups.get(battery["id"])
        return all(
            groups.get(other["id"]) == mine
            for other in config["batteries"]
            if (other.get("controls") or {}).get("system_charge_limit") == key
        )

    def _team_floor(self, battery: dict[str, Any], role: RoleAdapter | None) -> float:
        """The level Joe counts on without a learned cutoff: the battery's own
        floor (as set in Joe, else on the device), else a typical one."""
        if battery.get("floor_soc") is not None:
            return float(battery["floor_soc"])
        value = self._original(role, "min_soc")
        if role is not None and value is not None:
            return float(role._level("min_soc", value))
        return team_rules.DEFAULT_CUTOFF

    def _team_full_at(self, role: RoleAdapter | None) -> float:
        """Full at its own charge target, if lower."""
        value = self._original(role, "charge_target")
        if value is not None and 50 <= value < team_rules.FULL:
            return float(value)
        return team_rules.FULL

    def _original(self, role: RoleAdapter | None, name: str) -> float | None:
        """A lever's value as it was before Joe changed it."""
        entity_id = role.controls.get(name) if role is not None else None
        if not entity_id:
            return None
        saved = self.data["saved"]
        value = saved[entity_id] if entity_id in saved else read(self._hass, entity_id)
        if isinstance(value, bool) or not isinstance(value, int | float):
            return None
        return float(value)

    # --- charging to a level by hand ----------------------------------------

    def _car_need(self, action_id: str) -> dict[str, Any]:
        """The need of the car plugged into a charge point (raises "no_car")."""
        if self.cars is not None:
            need = self.cars.need_at(action_id)
        else:
            config = self._config()
            found = cars.detect_all(config, self._hass.states.get).get(action_id) or {}
            car = cars.car_by_id(config, found.get("car"))
            action = cars.action_by_id(config, action_id)
            need = (
                cars.need_for(self._hass.states.get, car, action.get("point"))
                if car is not None and action is not None
                else None
            )
        if need is None:
            raise ValueError("no_car")
        return need

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
        need = self._car_need(action_id)
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

    def _settle_loop_owned(self, adapter: Adapter) -> set[str]:
        """Once the prepare step is undone (e.g. manual mode off again), the
        device's own control owns mode and power: nothing of them to restore
        or watch any more. Returns those entities."""
        owned = adapter.loop_owned()
        # Without a prepare step (an older Omnibattery) Joe owns them throughout.
        if not owned or not adapter.prepare_entities():
            return set()
        saved: dict[str, Any] = self.data["saved"]
        external: list[str] = self.data["external"]
        if any(e in external for e in adapter.prepare_entities()):
            # Someone else switched manual mode back: theirs for the night.
            for entity_id in owned:
                if entity_id not in external:
                    external.append(entity_id)
                saved.pop(entity_id, None)
            return owned
        # Still in manual mode (Joe's or someone else's): Joe owns what he set.
        if adapter.prepared(self._hass):
            return set()
        for entity_id in owned:
            saved.pop(entity_id, None)
            self.data["written"].pop(entity_id, None)
        self.data["external"] = [e for e in external if e not in owned]
        return owned

    # --- release ---------------------------------------------------------------

    async def async_release_now(self) -> None:
        """The emergency button: everything back now, and no steering tonight."""
        async with self._lock:
            plan = self._plan()
            if plan and plan.get("window"):
                self.data["skip"] = plan["window"]["start"]
            self._log("emergency")
            # No daytime cap again today either, and no blocks.
            self._surplus_forget("emergency")
            today = dt_util.now().date().isoformat()
            self.data["surplus"]["released"] = today
            self.data["team"]["paused"] = today
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
        adapters = [
            a for a in (make_adapter(b) for b in self._config()["batteries"]) if a
        ]
        for adapter in adapters:
            self._settle_loop_owned(adapter)
        # The limits of the daytime cap: what an automation set after Joe stays,
        # whether Joe saw his own value taken or not.
        self._drop_foreign(
            [
                e
                for a in adapters
                if isinstance(a, RoleAdapter)
                for e in a.limit_entities()
                if e not in keep
            ]
        )
        for adapter in adapters:
            battery = adapter.battery
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
        # Manual mode undone: what the device's own control owns is no error.
        for adapter in adapters:
            owned = self._settle_loop_owned(adapter)
            errors = [e for e in errors if e not in owned]
        if not errors:
            self.data["active"] = [
                k for k in self.data["active"] if _kept(k, keep, self._config())
            ]
            self.data["calls"] = {}
            # A daytime cap given back is no cap any more (a stop, a reload).
            caps = self.data["surplus"]["caps"]
            if any(k not in keep for k in caps):
                self._surplus_forget(reason)
            # Blocks given back are no blocks any more.
            blocks = self.data["team"]["blocks"]
            for key in [k for k in blocks if k not in keep]:
                del blocks[key]
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
            need = self._car_need(action_id)
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
        elif (
            not on
            or (self.data["tonight_target"].get(action_id) or {}).get("night") != night
        ):
            # Switched on again without a level (the switch, a service): the
            # level chosen for this night stays.
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
        # Manual mode back off: mode and power belong to the device's control again.
        owned = self._settle_loop_owned(adapter)
        wrong = [
            w.entity_id
            for w in restore
            if not w.is_call
            and w.entity_id not in owned
            and not matches(hass, fit(hass, w))
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

    async def async_save(self) -> None:
        """Store what changed from outside (e.g. the automations Joe switched off)."""
        await self._async_save()
        self._changed()

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
            "surplus": self.surplus,
            "team": self.team,
            "guard": self.guard,
        }

    async def async_forget(self) -> None:
        await self._store.async_remove()


def _kept(key: str, keep: set[str], config: dict[str, Any]) -> bool:
    """Whether an "active" key belongs to an action whose entity is kept."""
    if key in keep:
        # A battery whose limit stays set on purpose (morning, daytime surplus).
        return True
    if not key.startswith("action:"):
        return False
    action_id = key.removeprefix("action:")
    return any(
        a["id"] == action_id and a["entity_id"] in keep for a in config["actions"]
    )


def _fresh() -> dict[str, Any]:
    return deepcopy(DEFAULT_DATA)


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


def _charge_w(hass: HomeAssistant, battery: dict[str, Any]) -> float | None:
    """The battery's charging power now (W, positive while charging)."""
    value = measurement_kw(hass.states.get, battery.get("power"))
    return None if value is None else value * 1000


def _solar_kw(hass: HomeAssistant, config: dict[str, Any]) -> float | None:
    """What the panels give now (kW), if every solar measurement is known."""
    values = [
        solar_kw(hass.states.get, m) for m in config["measurements"]["solar_power"]
    ]
    if not values or None in values:
        return None
    return sum(v or 0.0 for v in values)


def _with_room(store: day_surplus.Store, room: float) -> day_surplus.Store:
    """A battery for the daytime cap with the room of those waiting behind it."""
    capacity = store.capacity + room
    soc = 100 - (store.room + room) / capacity * 100
    return day_surplus.Store(store.id, capacity, soc, store.max_kw, store.capped)
