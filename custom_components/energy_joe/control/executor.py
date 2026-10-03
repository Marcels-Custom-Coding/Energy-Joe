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
from ..observe.readings import measurement_kw, number
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
    "skip": None,
    "answer": None,
    "tests": {},
    "log": [],
    "failures": 0,
}

type Changed = Callable[[], None]


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
        if reason != "steering":
            if self._dirty:
                await self._async_release(reason, now)
            if self.data["night"] and self.data["night"] != night:
                self._end_night()
            self._set_status(reason, night, {})
            self._watch([])
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
        self._set_status("steering", night, batteries)
        self._watch([b["soc_entity"] for b, _, a in items if a is not None])
        await self._async_save()

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
        if plan.get("kind") == "none":
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
        charge_from = plan.get("charge_from")
        charging_time = (
            plan.get("kind") == "charge"
            and charge_from is not None
            and now >= datetime.fromisoformat(charge_from)
        )
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
        saved: dict[str, Any] = self.data["saved"]
        written: dict[str, Any] = self.data["written"]
        external: list[str] = self.data["external"]
        key = adapter.battery["id"]
        self._notice_external(adapter, now)
        problem = None
        writes = adapter.writes(self._hass, self._floored(adapter, want), soc, saved)
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
                self._log(
                    "call", battery=key, entity=write.entity_id, action=_action(want)
                )
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
            if first:
                self._log(
                    "set",
                    battery=adapter.battery["id"],
                    entity=write.entity_id,
                    value=write.value,
                    action=_action(want),
                )
        if new_calls:
            self.data["calls"][key] = {
                "sig": calls,
                "at": now.isoformat(timespec="seconds"),
                "ok": calls_ok,
            }
        if (
            want.charge_to is not None
            and self.status["batteries"].get(adapter.battery["id"], {}).get("action")
            != "charge"
        ):
            self._fire(
                "charge_started", battery=adapter.battery["id"], target=want.charge_to
            )
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
            self._set_status("skipped", self.status.get("night"), {})
            await self._async_save()

    async def _async_release(self, reason: str, now: datetime | None = None) -> None:
        """Put back every value Joe noted; keep what fails for the next try."""
        now = now or dt_util.now()
        saved: dict[str, Any] = self.data["saved"]
        written: dict[str, Any] = self.data["written"]
        if not self._dirty:
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
        # Entities of batteries that are gone or steered differently now.
        for entity_id in reversed(list(saved)):
            if entity_id not in covered:
                writes.append(Write(entity_id, saved[entity_id]))
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
            self.data["active"] = []
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

    def _start_night(self, night: str) -> None:
        self.data.update(
            night=night, floors={}, reached=[], external=[], first={}, steered=False
        )
        self._log("start", night=night)
        if self.notifier:
            self.notifier.clear_ask()

    def _end_night(self) -> None:
        self.data.update(
            night=None, floors={}, reached=[], external=[], first={}, steered=False
        )

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
        self, reason: str, night: str | None, batteries: dict[str, Any]
    ) -> None:
        status = {
            "steering": reason == "steering",
            "reason": reason,
            "night": night,
            "batteries": batteries,
            "pending": self._dirty,
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
        }

    async def async_forget(self) -> None:
        await self._store.async_remove()


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
