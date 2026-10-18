"""The watchdog ("Speicher-Wächter"): two batteries running against each other,
found at 20 W for 20 s, and Joe's three stages – restart the culprit's own
control, block its direction for a few seconds, speak up – with every way
he keeps his hands off and puts back what he switched."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any
from unittest.mock import AsyncMock, patch

import pytest

from custom_components.energy_joe.control import guard
from custom_components.energy_joe.control.adapters import make_adapter
from custom_components.energy_joe.control.writes import Write
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .test_control import make_executor
from .test_surplus import day_plan
from .test_team import flows, install_team, team_byd, team_config, team_venus

MANUAL = "switch.omni_manual_mode"
ALLOW_CHARGE = "switch.venus_allow_charge"
ALLOW_DISCHARGE = "switch.venus_allow_discharge"
GUARD = {
    "system_manual_mode": MANUAL,
    "allow_charge": ALLOW_CHARGE,
    "allow_discharge": ALLOW_DISCHARGE,
}


@pytest.fixture(autouse=True)
def berlin(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


def venus(**extra: Any) -> dict[str, Any]:
    battery = team_venus(**extra)
    battery["controls"] = {**battery["controls"], **GUARD}
    return battery


def install(hass: HomeAssistant) -> list[tuple[str, str]]:
    calls = install_team(hass)
    for entity_id in (ALLOW_CHARGE, ALLOW_DISCHARGE):
        hass.states.async_set(entity_id, "on")
    hass.states.async_set(MANUAL, "off")
    return calls


async def guarded(
    hass: HomeAssistant, *batteries: dict[str, Any], mode: str = "live", **rules: Any
):
    config = team_config(*(batteries or (team_byd(), venus())), **rules)
    executor, holder = await make_executor(
        hass, config, day_plan(dt_util.now()), mode=mode
    )
    executor.notifier = AsyncMock()
    return executor, holder


def kinds(executor: Any) -> list[str]:
    return [e["kind"] for e in executor.data["log"] if e["kind"].startswith("guard_")]


# --- the decisions -------------------------------------------------------------------


def test_twenty_watts_each_is_the_limit() -> None:
    assert guard.opposite({"byd": 21, "venus": -21}) == (["byd"], ["venus"])
    assert guard.opposite({"byd": -800, "venus": 25}) == (["venus"], ["byd"])
    # 20 W is not above 20 W; 19 W never counts, however long.
    assert guard.opposite({"byd": 20, "venus": -500}) == ([], [])
    assert guard.opposite({"byd": 600, "venus": -19}) == ([], [])
    assert guard.opposite({"byd": 600, "venus": 500}) == ([], [])


def test_the_stages_follow_twenty_seconds_apart() -> None:
    start = datetime(2026, 10, 18, 14, 0, tzinfo=dt_util.get_time_zone("Europe/Berlin"))
    store = guard.fresh()
    assert guard.step(store, True, start) is None
    assert guard.step(store, True, start + timedelta(seconds=19)) is None
    assert guard.step(store, True, start + timedelta(seconds=20)) == "stage1"
    guard.done(store, 1, start + timedelta(seconds=22))
    assert guard.step(store, True, start + timedelta(seconds=41)) is None
    assert guard.step(store, True, start + timedelta(seconds=42)) == "stage2"
    guard.done(store, 2, start + timedelta(seconds=47))
    assert guard.step(store, True, start + timedelta(seconds=66)) is None
    assert guard.step(store, True, start + timedelta(seconds=67)) == "stage3"
    guard.done(store, 3, start + timedelta(seconds=67))
    # After the last stage Joe waits until it stops.
    assert guard.step(store, True, start + timedelta(minutes=30)) is None
    assert guard.step(store, False, start + timedelta(minutes=31)) == "fixed"
    # A short one that stops before 20 s: nothing to say.
    assert guard.step(store, True, start + timedelta(minutes=40)) is None
    assert guard.step(store, False, start + timedelta(minutes=40, seconds=10)) == (
        "ended"
    )


def test_the_cause_is_the_one_joe_can_restart() -> None:
    levers = {"byd": (False, True), "venus": (True, True)}
    assert guard.cause(["byd", "venus"], ["byd"], ["venus"], levers) == "venus"
    assert guard.cause(["byd", "venus"], ["venus"], ["byd"], levers) == "venus"
    # Two alike: the one running against the team's active battery ...
    alike = {"a": (True, True), "b": (True, True), "c": (True, True)}
    assert guard.cause(["a", "b", "c"], ["a"], ["b", "c"], alike, active="c") == "a"
    assert guard.cause(["a", "b", "c"], ["a", "b"], ["c"], alike, active="a") == "c"
    # ... else the order of the batteries.
    assert guard.cause(["a", "b", "c"], ["b"], ["c", "a"], alike) == "a"
    # Without levers: the first one involved (Joe can only speak up).
    assert guard.cause(["x", "y"], ["y"], ["x"], {}) == "x"


def test_the_levers_of_a_venus_and_a_fronius(hass: HomeAssistant) -> None:
    install(hass)
    omni, fronius = make_adapter(venus()), make_adapter(team_byd())
    assert omni.guard_can_restart() and not fronius.guard_can_restart()
    assert omni.guard_block("charge") == [Write(ALLOW_CHARGE, False)]
    assert omni.guard_block("discharge") == [Write(ALLOW_DISCHARGE, False)]
    # Fronius: the limit at 0 first, then its switch on.
    assert fronius.guard_block("discharge") == [
        Write("number.discharge_limit", 0),
        Write("switch.discharge_limit", True),
    ]
    # No lever of the night: the signature and the test run stay as they were.
    assert omni.signature == make_adapter(team_venus()).signature
    assert omni.missing(hass) == make_adapter(team_venus()).missing(hass)


# --- the executor ----------------------------------------------------------------------


async def test_nineteen_watts_never_trigger(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-10-18T14:00:00+02:00")
    calls = install(hass)
    executor, _ = await guarded(hass)
    flows(hass, byd=-600, venus=19)
    for _ in range(20):
        await executor.async_guard()
        freezer.tick(timedelta(seconds=5))
    assert calls == []
    assert kinds(executor) == []


async def test_three_stages_then_fixed(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-10-18T14:00:00+02:00")
    calls = install(hass)
    executor, _ = await guarded(hass)
    # The Venus charges with 25 W while the BYD discharges.
    flows(hass, byd=-400, venus=25)
    await executor.async_guard()
    freezer.tick(timedelta(seconds=15))
    await executor.async_guard()
    assert calls == []
    freezer.tick(timedelta(seconds=5))
    await executor.async_guard()
    # Stage 1: the PD controller restarted (manual mode on, off).
    assert calls == [(MANUAL, "on"), (MANUAL, "off")]
    assert kinds(executor) == ["guard_restart"]
    restart = executor.data["log"][-1]
    assert restart["battery"] == "venus" and restart["clean"] is False
    assert executor.data["guard"]["held"] == {}
    assert executor.view["guard"]["running"] is True
    freezer.tick(timedelta(seconds=15))
    await executor.async_guard()
    assert len(calls) == 2
    freezer.tick(timedelta(seconds=5))
    await executor.async_guard()
    # Stage 2: it charges, so charging is blocked for a moment.
    assert calls[2:] == [(ALLOW_CHARGE, "off"), (ALLOW_CHARGE, "on")]
    assert executor.data["log"][-1]["direction"] == "charge"
    assert hass.states.get(ALLOW_CHARGE).state == "on"
    executor.notifier.async_problem.assert_not_awaited()
    freezer.tick(timedelta(seconds=20))
    await executor.async_guard()
    # Stage 3: Joe speaks up, once.
    executor.notifier.async_problem.assert_awaited_once()
    assert executor.notifier.async_problem.await_args.args[0] == "battery_transfer"
    assert executor.notifier.async_problem.await_args.kwargs == {
        "charging": "Venus",
        "discharging": "BYD",
    }
    assert executor.view["guard"]["last"]["result"] == "alarm"
    for _ in range(10):
        freezer.tick(timedelta(seconds=20))
        await executor.async_guard()
    executor.notifier.async_problem.assert_awaited_once()
    assert len(calls) == 4
    assert kinds(executor) == ["guard_restart", "guard_block", "guard_alarm"]
    # It stops: fixed, the warning goes.
    flows(hass, byd=-400, venus=0)
    await executor.async_guard()
    assert kinds(executor)[-1] == "guard_fixed"
    assert executor.data["log"][-1]["stage"] == 3
    executor.notifier.async_clear.assert_awaited_with("battery_transfer")
    assert executor.view["guard"]["last"]["result"] == "fixed"
    assert executor.data["saved"] == {}


async def test_fixed_after_the_restart_and_a_cooldown_for_the_push(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-18T14:00:00+02:00")
    install(hass)
    executor, _ = await guarded(hass)

    async def occurrence(stages: int) -> None:
        flows(hass, byd=500, venus=-300)
        await executor.async_guard()
        for _ in range(stages):
            freezer.tick(timedelta(seconds=20))
            await executor.async_guard()
        flows(hass, byd=500, venus=0)
        await executor.async_guard()

    await occurrence(1)
    assert kinds(executor) == ["guard_restart", "guard_fixed"]
    fixed = executor.data["log"][-1]
    assert fixed["stage"] == 1 and fixed["seconds"] == 20
    # Discharging: the second stage blocks discharging.
    await occurrence(3)
    blocks = [e for e in executor.data["log"] if e["kind"] == "guard_block"]
    assert blocks[-1]["direction"] == "discharge"
    assert executor.notifier.async_problem.await_count == 1
    # Within the hour: no second push, but the log says it.
    freezer.tick(timedelta(minutes=10))
    await occurrence(3)
    assert executor.notifier.async_problem.await_count == 1
    assert kinds(executor).count("guard_alarm") == 2
    freezer.tick(timedelta(hours=1))
    await occurrence(3)
    assert executor.notifier.async_problem.await_count == 2


async def test_a_manual_mode_held_by_someone_else_ends_cleanly(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-18T14:00:00+02:00")
    calls = install(hass)
    # Something else charges the Venus by hand.
    hass.states.async_set(MANUAL, "on")
    hass.states.async_set(
        "select.force_mode", "Charge", {"options": ["None", "Charge", "Discharge"]}
    )
    executor, _ = await guarded(hass)
    flows(hass, byd=-900, venus=800)
    await executor.async_guard()
    freezer.tick(timedelta(seconds=20))
    with patch("custom_components.energy_joe.control.writes.settle") as settle:
        await executor.async_guard()
    assert calls == [
        ("select.force_mode", "None"),
        ("number.charge_power", "0.0"),
        (MANUAL, "off"),
    ]
    # A second between the commands.
    assert all(c.args[0] >= 1 for c in settle.await_args_list)
    assert executor.data["log"][-1]["clean"] is True
    # Nothing of Joe's to put back.
    assert executor.data["guard"]["held"] == {}
    assert executor.data["saved"] == {}


async def test_what_joe_switched_goes_back_after_a_restart(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-18T14:00:00+02:00")
    calls = install(hass)
    # HA went down in the middle of stage 2.
    hass.states.async_set(ALLOW_CHARGE, "off")
    executor, _ = await guarded(hass)
    executor.data["guard"]["held"] = {ALLOW_CHARGE: True}
    await executor.async_start()
    await executor.async_stop()
    assert hass.states.get(ALLOW_CHARGE).state == "on"
    assert (ALLOW_CHARGE, "on") in calls
    assert executor.data["guard"]["held"] == {}
    restored = [e for e in executor.data["log"] if e["kind"] == "guard_restored"]
    assert restored[0]["reason"] == "start"
    assert restored[0]["entities"] == [ALLOW_CHARGE]


async def test_a_failed_write_is_put_back_on_the_next_look(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-18T14:00:00+02:00")
    install(hass)
    executor, _ = await guarded(hass)
    hass.states.async_set(ALLOW_CHARGE, "off")
    executor.data["guard"]["held"] = {ALLOW_CHARGE: True}
    # Switched to the simulation: back at once, nothing written any more.
    executor_mode = "simulation"
    executor._mode = lambda: executor_mode
    await executor.async_guard()
    assert hass.states.get(ALLOW_CHARGE).state == "on"
    assert executor.data["guard"]["held"] == {}


async def test_the_night_is_joes_own(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-10-18T02:00:00+02:00")
    calls = install(hass)
    executor, _ = await guarded(hass)
    executor.status["reason"] = "steering"
    flows(hass, byd=-900, venus=800)
    for _ in range(12):
        await executor.async_guard()
        freezer.tick(timedelta(seconds=10))
    assert calls == []
    assert kinds(executor) == ["guard_joe"]
    assert executor.view["guard"]["last"]["result"] == "joe"
    executor.notifier.async_problem.assert_not_awaited()


async def test_joes_own_command_by_day_is_not_fought(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-18T14:00:00+02:00")
    calls = install(hass)
    executor, _ = await guarded(hass)
    # Joe charges the Venus by hand ("Just charge to …"): its mode is his.
    executor.data["saved"]["select.force_mode"] = "None"
    flows(hass, byd=-900, venus=800)
    await executor.async_guard()
    freezer.tick(timedelta(seconds=20))
    await executor.async_guard()
    assert calls == []
    assert kinds(executor) == ["guard_joe"]


async def test_an_automation_doing_it_keeps_joe_out(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-18T14:00:00+02:00")
    calls = install(hass)
    executor, _ = await guarded(hass)
    owner = [
        {
            "entity_id": "automation.waechter",
            "name": "Wächter: Batterie-zu-Batterie-Transfer (mit Eingriff)",
            "on": True,
            "writes": [
                {"entity_id": MANUAL, "battery_id": "venus", "joe": False},
                {"entity_id": ALLOW_CHARGE, "battery_id": "venus", "joe": False},
            ],
        },
        # One that writes the BYD's limits is no watchdog of the Venus.
        {
            "entity_id": "automation.r2",
            "name": "Akku-Interlock R2",
            "on": True,
            "writes": [
                {"entity_id": "number.charge_limit", "battery_id": "byd", "joe": False}
            ],
        },
    ]
    with patch(
        "custom_components.energy_joe.control.automations.find", return_value=owner
    ):
        flows(hass, byd=-900, venus=800)
        for _ in range(3):
            await executor.async_guard()
            freezer.tick(timedelta(seconds=20))
        # A second time: logged once only.
        flows(hass, byd=-900, venus=0)
        await executor.async_guard()
        flows(hass, byd=-900, venus=800)
        for _ in range(3):
            freezer.tick(timedelta(seconds=70))
            await executor.async_guard()
    assert calls == []
    assert kinds(executor) == ["guard_automation"]
    assert executor.data["log"][-1]["names"] == [owner[0]["name"]]
    assert executor.view["guard"]["automations"] == [owner[0]["name"]]
    assert executor.view["guard"]["last"]["result"] == "automation"
    # Switched off: Joe takes over.
    owner[0]["on"] = False
    with patch(
        "custom_components.energy_joe.control.automations.find", return_value=owner
    ):
        freezer.tick(timedelta(seconds=70))
        await executor.async_guard()
    assert calls == [(MANUAL, "on"), (MANUAL, "off")]


async def test_only_live_writes(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-10-18T14:00:00+02:00")
    calls = install(hass)
    executor, _ = await guarded(hass, mode="simulation")
    flows(hass, byd=-900, venus=800)
    await executor.async_guard()
    for _ in range(3):
        freezer.tick(timedelta(seconds=20))
        await executor.async_guard()
    assert calls == []
    assert kinds(executor) == ["guard_restart", "guard_block", "guard_alarm"]
    assert all(e["dry"] for e in executor.data["log"] if e["kind"] != "guard_fixed")
    executor.notifier.async_problem.assert_not_awaited()
    assert executor.view["guard"]["dry"] is True


async def test_switched_off_or_alone_nothing_happens(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-18T14:00:00+02:00")
    calls = install(hass)
    executor, _ = await guarded(hass, transfer_guard=False)
    flows(hass, byd=-900, venus=800)
    for _ in range(5):
        await executor.async_guard()
        freezer.tick(timedelta(seconds=20))
    assert calls == [] and kinds(executor) == []
    assert executor.view["guard"]["state"] == "off"
    # Without "Mehrere Speicher" chosen the watchdog runs all the same.
    executor, _ = await guarded(hass, battery_team=None)
    await executor.async_guard()
    freezer.tick(timedelta(seconds=20))
    await executor.async_guard()
    assert kinds(executor) == ["guard_restart"]


async def test_a_fronius_is_blocked_with_its_limit(
    hass: HomeAssistant, freezer
) -> None:
    """A battery without a control to restart: stage 2 at once, its limit back
    as it was afterwards."""
    freezer.move_to("2026-10-18T14:00:00+02:00")
    calls = install(hass)
    executor, _ = await guarded(hass, team_byd(), team_venus())
    flows(hass, byd=-900, venus=800)
    await executor.async_guard()
    freezer.tick(timedelta(seconds=20))
    await executor.async_guard()
    assert calls == [
        ("number.discharge_limit", "0.0"),
        ("switch.discharge_limit", "on"),
        ("switch.discharge_limit", "off"),
        ("number.discharge_limit", "100.0"),
    ]
    assert kinds(executor) == ["guard_block"]
    assert executor.data["log"][-1]["battery"] == "byd"
    assert executor.data["guard"]["held"] == {}
    assert executor.data["saved"] == {}


async def test_batteries_set_up_before_learn_the_watchdogs_levers(
    hass: HomeAssistant,
) -> None:
    """The system's manual mode and a Venus' allow switches, found by their keys."""
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    from custom_components.energy_joe.discovery import async_profile_updates
    from homeassistant.helpers import device_registry as dr, entity_registry as er

    from .test_control import configured, venus_battery

    entry = MockConfigEntry(domain="omnibattery")
    entry.add_to_hass(hass)
    devices = dr.async_get(hass)
    device = devices.async_get_or_create(
        config_entry_id=entry.entry_id, identifiers={("omnibattery", "venus")}
    )
    system = devices.async_get_or_create(
        config_entry_id=entry.entry_id, identifiers={("omnibattery", "system")}
    )
    registry = er.async_get(hass)
    found: dict[str, str] = {}
    for domain, key, where in (
        ("sensor", "10.0.0.1_502_battery_soc", device),
        ("switch", "10.0.0.1_502_battery_manual_mode", device),
        ("switch", "10.0.0.1_502_battery_allow_charge", device),
        ("switch", "10.0.0.1_502_battery_allow_discharge", device),
        ("switch", "marstek_venus_system_manual_mode", system),
    ):
        item = registry.async_get_or_create(
            domain, "omnibattery", key, config_entry=entry, device_id=where.id
        )
        hass.states.async_set(item.entity_id, "on")
        found[key] = item.entity_id
    battery = {
        **venus_battery(),
        "device_id": device.id,
        "soc_entity": found["10.0.0.1_502_battery_soc"],
    }
    patch_ = await async_profile_updates(hass, configured(battery))
    controls = patch_["batteries"]["venus"]["controls"]
    assert controls["system_manual_mode"] == found["marstek_venus_system_manual_mode"]
    assert controls["allow_charge"] == found["10.0.0.1_502_battery_allow_charge"]
    assert controls["allow_discharge"] == found["10.0.0.1_502_battery_allow_discharge"]
    # The night still uses the battery's own manual mode.
    assert patch_["batteries"]["venus"]["prepare"] == [
        {"entity_id": found["10.0.0.1_502_battery_manual_mode"], "value": True}
    ]
