"""Several batteries in groups ("Wer regelt ihn?"): the batteries one system
regulates (Omnibattery with a Venus and a Victron) take turns as one, blocked
with their own allow switches (the system's limits only when the whole
system waits); at night they are frozen with "allow discharging" off; a
daytime cap never lets a waiting battery charge; the watchdog leaves a
transfer inside one group to its system."""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.energy_joe import model
from custom_components.energy_joe.control import team
from custom_components.energy_joe.control.adapters import Desired, make_adapter
from custom_components.energy_joe.control.writes import Write
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util

from .test_control import VENUS, make_executor
from .test_surplus import day_plan
from .test_team import (
    SYSTEM,
    byd_levers,
    flows,
    install_team,
    levels,
    state_of,
    team_byd,
    team_config,
    team_venus,
)

ALLOW = {
    "allow_charge": "switch.venus_allow_charge",
    "allow_discharge": "switch.venus_allow_discharge",
}
VICTRON_ALLOW = {
    "allow_charge": "switch.victron_allow_charge",
    "allow_discharge": "switch.victron_allow_discharge",
}
MANUAL = ("switch.venus_manual_mode", "select.force_mode", "number.charge_power")


@pytest.fixture(autouse=True)
def berlin(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


def venus(**extra: Any) -> dict[str, Any]:
    battery = team_venus(**extra)
    battery["controls"] = {**battery["controls"], **ALLOW}
    return battery


def victron(**extra: Any) -> dict[str, Any]:
    """A Victron in the same Omnibattery: the same system limits, its own switches."""
    return {
        "id": "victron",
        "name": "Victron",
        "adapter": "omnibattery",
        "soc_entity": "sensor.victron_soc",
        "power": {"entity_id": "sensor.victron_power"},
        "capacity_kwh": 5.0,
        "max_charge_w": 2500,
        "controls": {
            "mode": "select.victron_mode",
            "charge_power": "number.victron_charge_power",
            "min_soc": "number.victron_cutoff",
            **SYSTEM,
            **VICTRON_ALLOW,
        },
        "prepare": [{"entity_id": "switch.victron_manual_mode", "value": True}],
        **extra,
    }


def install(hass: HomeAssistant, victron_soc: float = 50, **socs: float):
    calls = install_team(hass, **socs)
    for entity_id in (*ALLOW.values(), *VICTRON_ALLOW.values()):
        hass.states.async_set(entity_id, "on")
    hass.states.async_set(
        "sensor.victron_soc", str(victron_soc), {"unit_of_measurement": "%"}
    )
    hass.states.async_set("sensor.victron_power", "0", {"unit_of_measurement": "W"})
    hass.states.async_set("switch.victron_manual_mode", "off")
    hass.states.async_set(
        "select.victron_mode", "None", {"options": ["None", "Charge", "Discharge"]}
    )
    hass.states.async_set("number.victron_charge_power", "0", {"min": 0, "max": 2500})
    hass.states.async_set("number.victron_cutoff", "12", {"min": 12, "max": 50})
    return calls


def allow(hass: HomeAssistant) -> tuple[str, ...]:
    return state_of(hass, *ALLOW.values(), *VICTRON_ALLOW.values())


def system(hass: HomeAssistant) -> tuple[str, ...]:
    return state_of(hass, *SYSTEM.values())


def never_opposite(view: dict[str, Any]) -> None:
    """No battery may be free to charge while one of another group is free
    to discharge."""
    batteries = view["batteries"]
    charge = {b["group"] for b in batteries.values() if b["charge"] == "free"}
    discharge = {b["group"] for b in batteries.values() if b["discharge"] == "free"}
    assert not any(a != b for a in charge for b in discharge), batteries


def three(**rules: Any) -> dict[str, Any]:
    return team_config(team_byd(), venus(), victron(), **rules)


# --- the groups ----------------------------------------------------------------------


def test_a_group_is_full_and_empty_when_all_of_it_is() -> None:
    def member(key: str, empty: bool = False, full: bool = False) -> team.Member:
        return team.Member(key, 50, None, 5, 5, 2.5, empty=empty, full=full)

    groups = team.grouped(
        [member("byd"), member("venus", empty=True), member("victron")],
        {"byd": "fronius", "venus": "omni", "victron": "omni"},
    )
    assert [g.ids for g in groups] == [["byd"], ["venus", "victron"]]
    omni = groups[1]
    assert not omni.empty and not omni.full
    omni.members[1].empty = True
    assert omni.empty
    assert omni.max_kw == 5.0
    # The order counts per group: the place of its first battery.
    assert [g.id for g in team.ordered(groups, ["victron", "byd"])] == [
        "omni",
        "fronius",
    ]
    # A transfer between batteries of one group is its own system's.
    keys = {"byd": "fronius", "venus": "omni", "victron": "omni"}
    assert team.transfer_inside(["venus"], ["victron"], keys)
    assert not team.transfer_inside(["byd"], ["victron"], keys)
    assert not team.transfer_inside(["venus", "byd"], ["victron"], keys)


async def test_joe_groups_by_the_integration_and_asks_when_unsure(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-10T19:00:00+02:00")
    registry = er.async_get(hass)
    omni, fronius = (
        MockConfigEntry(domain="omnibattery"),
        MockConfigEntry(domain="fronius"),
    )
    for entry in (omni, fronius):
        entry.add_to_hass(hass)
    for name, entry in (
        ("venus_soc", omni),
        ("victron_soc", omni),
        ("byd_soc", fronius),
    ):
        item = registry.async_get_or_create(
            "sensor", entry.domain, name, config_entry=entry, suggested_object_id=name
        )
        assert item.entity_id == f"sensor.{name}"
    install(hass)
    flows(hass, grid=300)
    # A battery set up before (version 7, no group yet) is assigned at once.
    old = {
        "version": 7,
        "batteries": [team_byd(), venus(), victron()],
        "measurements": {"grid_power": {"entity_id": "sensor.grid"}},
        "rules": {"battery_team": None, "grid_friendly": False},
    }
    config = model.migrate(old)
    assert all(b["control_group"] is None for b in config["batteries"])
    executor, holder = await make_executor(hass, config, day_plan(dt_util.now()))
    await executor.async_check()
    view = executor.view["team"]
    assert view["batteries"]["venus"]["group"] == f"entry:{omni.entry_id}"
    assert view["batteries"]["victron"]["group"] == f"entry:{omni.entry_id}"
    assert view["batteries"]["byd"]["group"] == f"entry:{fronius.entry_id}"
    assert len(view["groups"]) == 2
    # Not chosen: "Nacheinander" all the same.
    assert view["default"] is True
    assert view["state"] != "together"
    assert view["group_question"] is False
    # All in one group: nothing to coordinate by day.
    holder["config"] = model.validate(
        {
            **config,
            "batteries": [{**b, "control_group": "one"} for b in config["batteries"]],
            "rules": {**config["rules"], "battery_team": "sequence"},
        }
    )
    await executor.async_check()
    view = executor.view["team"]
    assert view["state"] == "one_group"
    assert view["default"] is False
    assert executor.data["saved"] == {}
    # A battery steered through levers the owner assigned: Joe is not sure.
    generic = {**venus(), "id": "other", "name": "Other", "adapter": "generic"}
    generic["soc_entity"] = "sensor.other_soc"
    hass.states.async_set("sensor.other_soc", "50", {"unit_of_measurement": "%"})
    holder["config"] = team_config(team_byd(), generic, battery_team=None)
    await executor.async_check()
    view = executor.view["team"]
    assert view["batteries"]["other"]["group"] == "own:other"
    assert view["batteries"]["other"]["group_sure"] is False
    # (Only when it counts as regulating itself.)
    holder["config"] = team_config(
        team_byd(), {**generic, "self_regulating": True}, battery_team=None
    )
    await executor.async_check()
    assert executor.view["team"]["group_question"] is True
    # Once the owner says it, Joe asks no more.
    holder["config"] = team_config(
        team_byd(),
        {**generic, "self_regulating": True, "control_group": "own:other"},
        battery_team=None,
    )
    await executor.async_check()
    assert executor.view["team"]["group_question"] is False


# --- the levers ------------------------------------------------------------------------


def test_omnibattery_is_blocked_with_its_allow_switches(hass: HomeAssistant) -> None:
    install(hass)
    adapter = make_adapter(venus())
    assert adapter.team_lever() == "allow"
    writes, back = adapter.team_block(hass, True, True, False)
    assert writes == [
        Write("switch.venus_allow_charge", False, pause=1.0),
        Write("switch.venus_allow_discharge", False, pause=1.0),
    ]
    assert back == []
    # Side by side: charging free (given back), discharging blocked.
    writes, back = adapter.team_block(hass, False, True, False)
    assert [w.entity_id for w in writes] == ["switch.venus_allow_discharge"]
    assert back == ["allow_charge"]
    # Never the system's limits nor manual mode for it.
    assert not {w.entity_id for w in adapter.team_block(hass, True, True, False)[0]} & {
        *SYSTEM.values(),
        *MANUAL,
    }
    # Without allow switches: the system's limits, only for the whole system.
    plain = make_adapter(team_venus())
    assert plain.team_lever(True) == "system"
    assert plain.team_lever(False) is None
    assert plain.team_problem(hass, False) == "system_shared"
    assert plain.team_problem(hass, True) is None
    # Fronius as before: its own limits.
    assert make_adapter(team_byd()).team_lever() == "limit"
    # Without any lever.
    assert make_adapter({**team_venus(), "controls": VENUS}).team_lever() is None


async def test_one_group_waits_with_its_allow_switches(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-10T19:00:00+02:00")
    calls = install(hass, byd_soc=40, venus_soc=60, victron_soc=60)
    flows(hass, grid=0, byd=-800)
    executor, _ = await make_executor(hass, three(), day_plan(dt_util.now()))
    await executor.async_check()
    view = executor.view["team"]
    assert view["state"] == "on"
    assert view["active_batteries"] == ["byd"]
    never_opposite(view)
    # Both batteries of Omnibattery wait, blocked with their own switches.
    assert allow(hass) == ("off", "off", "off", "off")
    assert system(hass) == ("2500.0", "off", "2500.0")
    assert not any(e in MANUAL or e == "switch.victron_manual_mode" for e, _ in calls)
    # The BYD empty: the group takes over at once, its PD controller goes on.
    levels(hass, byd=5)
    calls.clear()
    await executor.async_check()
    view = executor.view["team"]
    assert view["active_batteries"] == ["venus", "victron"]
    never_opposite(view)
    assert allow(hass) == ("on", "on", "on", "on")
    assert byd_levers(hass) == ("0.0", "on", "0.0", "on")
    # Blocked first, then freed.
    assert calls.index(("switch.discharge_limit", "on")) < calls.index(
        ("switch.venus_allow_discharge", "on")
    )
    # The Venus empty, the Victron not: the group keeps working.
    levels(hass, venus=10)
    hass.states.async_set("sensor.venus_power", "0", {"unit_of_measurement": "W"})
    hass.states.async_set("sensor.victron_power", "-600", {"unit_of_measurement": "W"})
    await executor.async_check()
    view = executor.view["team"]
    assert view["active_batteries"] == ["venus", "victron"]
    assert view["batteries"]["venus"]["empty"] is True
    assert view["groups"][view["active_group"]]["empty"] is False
    # Both empty: the group is empty (the BYD is too: it stays as it is).
    hass.states.async_set("sensor.victron_soc", "10", {"unit_of_measurement": "%"})
    await executor.async_check()
    assert executor.view["team"]["groups"][view["active_group"]]["empty"] is True
    # Back as they were when Joe stops.
    await executor.async_stop()
    assert allow(hass) == ("on", "on", "on", "on")
    assert executor.data["saved"] == {}


async def test_the_system_limits_only_when_the_whole_system_waits(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-10T19:00:00+02:00")
    install(hass, byd_soc=40, venus_soc=60, victron_soc=60)
    flows(hass, grid=0, byd=-800)
    plain_victron = victron()
    plain_victron["controls"] = {
        k: v for k, v in plain_victron["controls"].items() if not k.startswith("allow")
    }
    plain_venus = team_venus()
    # Both of the system in one group (as proposed): its limits block them.
    config = team_config(team_byd(), plain_venus, plain_victron)
    executor, holder = await make_executor(hass, config, day_plan(dt_util.now()))
    await executor.async_check()
    assert executor.view["team"]["state"] == "on"
    assert system(hass) == ("0.0", "on", "0.0")
    # The Victron said to be regulated by something else: the system's limits
    # would block it, too, so Joe blocks nobody.
    holder["config"] = team_config(
        team_byd(), plain_venus, {**plain_victron, "control_group": "elsewhere"}
    )
    await executor.async_check()
    view = executor.view["team"]
    assert view["state"] == "levers"
    assert view["batteries"]["venus"]["problem"] == "system_shared"
    assert system(hass) == ("2500.0", "off", "2500.0")
    assert executor.data["saved"] == {}


# --- the night ---------------------------------------------------------------------------


async def test_the_night_freezes_omnibattery_with_allow_discharging(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-10T01:00:00+02:00")
    calls = install(hass, byd_soc=20, venus_soc=60)
    start = dt_util.start_of_local_day(dt_util.now())
    plan = {
        "kind": "charge",
        "fixed": True,
        "target": 60,
        "window": {
            "start": start.isoformat(),
            "end": (start + timedelta(hours=6)).isoformat(),
        },
        "charge_from": start.isoformat(),
        "rules": {"discharge_mode": "until_target"},
        "batteries": [
            {"id": "byd", "target": 60, "power_kw": 3},
            {"id": "venus", "target": 40, "power_kw": 0},
        ],
        "hours": [],
    }
    config = team_config(team_byd(), venus())
    executor, holder = await make_executor(hass, config, plan)
    await executor.async_check()
    assert executor.status["reason"] == "steering"
    # The BYD charges from the grid; the Venus waits in automatic mode (as by
    # day: neither charging nor discharging).
    assert hass.states.get("switch.venus_allow_discharge").state == "off"
    assert hass.states.get("switch.venus_allow_charge").state == "off"
    assert not any(e in MANUAL for e, _ in calls)
    assert hass.states.get("number.reserve").state == "60.0"
    # Without the switches: standby as before (manual mode, charging at 0 W).
    adapter = make_adapter(venus())
    writes = adapter.writes(hass, Desired(floor=40, block=True), 60, {})
    assert [w.entity_id for w in writes] == [
        "switch.venus_allow_charge",
        "switch.venus_allow_discharge",
    ]
    hass.states.async_set("switch.venus_allow_discharge", "unavailable")
    writes = adapter.writes(hass, Desired(floor=40, block=True), 60, {})
    assert "switch.venus_manual_mode" in [w.entity_id for w in writes]
    hass.states.async_set("switch.venus_allow_discharge", "off")
    # The night is over: the switch back.
    holder["mode"] = "simulation"
    await executor.async_check()
    assert hass.states.get("switch.venus_allow_discharge").state == "on"
    assert executor.data["saved"] == {}


# --- the daytime cap ---------------------------------------------------------------------


async def test_a_limit_held_by_someone_else_never_lets_a_waiting_one_charge(
    hass: HomeAssistant, freezer
) -> None:
    """The gap: a charge limit "taken" by the daytime cap (or a test limit)
    above 0 would let the waiting BYD charge from the group that discharges."""
    freezer.move_to("2026-10-10T19:00:00+02:00")
    install(hass, byd_soc=40, venus_soc=60, victron_soc=60)
    flows(hass, grid=0, venus=-800)
    config = three(team_discharge_order=["venus", "byd"])
    executor, _ = await make_executor(hass, config, day_plan(dt_util.now()))
    await executor.async_check()
    view = executor.view["team"]
    assert view["active_batteries"] == ["venus", "victron"]
    assert byd_levers(hass) == ("0.0", "on", "0.0", "on")
    now = dt_util.now()
    want, _ = await executor._async_team(config, day_plan(now), "live", now)
    limit = {"number.charge_limit", "switch.charge_limit"}
    # Someone else holds the charge limit at 0 (the grid-friendly morning):
    # it stays theirs, the BYD is blocked all the same.
    await executor._async_team_apply(config, want, limit, now)
    assert executor.data["team"]["blocks"]["byd"] == {
        "charge": False,
        "discharge": True,
    }
    assert byd_levers(hass)[:2] == ("0.0", "on")
    # A cap above 0 on the waiting BYD: Joe blocks it nonetheless.
    adapter = make_adapter(config["batteries"][0])
    await executor._async_write(adapter, [Write("number.charge_limit", 40)], now, None)
    assert byd_levers(hass)[:2] == ("40.0", "on")
    await executor._async_team_apply(config, want, limit, now)
    assert byd_levers(hass)[:2] == ("0.0", "on")
    assert any(e["kind"] == "team_taken" for e in executor.data["log"])
    assert executor.data["team"]["blocks"]["byd"]["charge"] is True


# --- the watchdog --------------------------------------------------------------------------


async def test_the_watchdog_leaves_a_transfer_inside_a_group_to_its_system(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-18T14:00:00+02:00")
    calls = install(hass)
    hass.states.async_set("switch.omni_manual_mode", "off")
    guard_venus = venus()
    guard_venus["controls"]["system_manual_mode"] = "switch.omni_manual_mode"
    config = team_config(team_byd(), guard_venus, victron(), battery_team="together")
    executor, _ = await make_executor(hass, config, day_plan(dt_util.now()))
    executor.notifier = AsyncMock()
    # The Venus charges from the Victron: Omnibattery's own business.
    hass.states.async_set("sensor.venus_power", "300", {"unit_of_measurement": "W"})
    hass.states.async_set("sensor.victron_power", "-300", {"unit_of_measurement": "W"})
    for _ in range(20):
        await executor.async_guard()
        freezer.tick(timedelta(seconds=5))
    assert calls == []
    kinds = [e["kind"] for e in executor.data["log"] if e["kind"].startswith("guard")]
    assert kinds == ["guard_inside"]
    executor.notifier.async_problem.assert_awaited_once()
    assert executor.notifier.async_problem.await_args.args[0] == (
        "battery_transfer_inside"
    )
    assert executor.view["guard"]["last"]["result"] == "inside"
    # It stops: the note goes, the last time stays "inside".
    hass.states.async_set("sensor.victron_power", "0", {"unit_of_measurement": "W"})
    await executor.async_guard()
    executor.notifier.async_clear.assert_awaited_with("battery_transfer_inside")
    assert executor.view["guard"]["last"]["result"] == "inside"
    assert executor.view["guard"]["last"]["over"] is True
    # Across groups: stage 2 blocks the culprit's whole group.
    hass.states.async_set("sensor.venus_power", "0", {"unit_of_measurement": "W"})
    hass.states.async_set("sensor.victron_power", "0", {"unit_of_measurement": "W"})
    flows(hass, byd=-400, venus=300)
    for _ in range(10):
        await executor.async_guard()
        freezer.tick(timedelta(seconds=5))
    blocked = [e for e, v in calls if v == "off" and "allow" in e]
    assert set(blocked) == {"switch.venus_allow_charge", "switch.victron_allow_charge"}
    assert allow(hass) == ("on", "on", "on", "on")
    assert executor.data["guard"]["held"] == {}
