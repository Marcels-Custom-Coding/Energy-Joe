"""The operations ("Vorgänge") of a battery: the preview of every write from
the adapter code, the probe of one operation, levers that differ from the
profile's find (adopt / dismiss), and own steps that replace the profile –
in the preview and in what Joe does by day."""

from __future__ import annotations

from typing import Any
from unittest.mock import patch

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.energy_joe import model
from custom_components.energy_joe.const import DOMAIN
from custom_components.energy_joe.control import (
    executor as executor_module,
    operations,
)
from custom_components.energy_joe.control.adapters import make_adapter
from custom_components.energy_joe.control.writes import Write
from custom_components.energy_joe.discovery import (
    adopted_controls,
    async_profile_updates,
    discover,
    profile_find,
    role_deviation,
)
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.util import dt as dt_util

from .snapshots import entity, fronius_household
from .test_control import (
    FRONIUS,
    configured,
    fronius_battery,
    install_devices,
    make_executor,
)
from .test_guard import install as install_guard, venus as guard_venus
from .test_team import install_team, team_byd, team_config, team_venus
from .test_vendor_profiles import huawei_snapshot

ORDER = ["charge", "hold", "block", "block_charge", "block_discharge", "cap", "release"]


@pytest.fixture(autouse=True)
def berlin(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


def by_op(preview: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {item["op"]: item for item in preview["operations"]}


def sets(item: dict[str, Any]) -> list[tuple[str, Any]]:
    return [(s["entity_id"], s["value"]) for s in item["steps"] if s["kind"] == "set"]


def back(item: dict[str, Any]) -> list[tuple[str, Any]]:
    return [(s["entity_id"], s["value"]) for s in item["restore"]]


# --- the preview ----------------------------------------------------------------------


def test_fronius_shows_every_write_in_its_order(hass: HomeAssistant) -> None:
    """A Fronius: limits at 0 before their switches go on; back the switches
    first, then the values; holding is the reserve at the level; charging is
    grid charging on and the reserve raised – with the charge limit as the
    ceiling once its reference is known."""
    install_team(hass, byd_soc=34.6)
    preview = operations.preview(hass, team_byd())
    assert [o["op"] for o in preview["operations"]] == ORDER
    assert preview["profile"] == {"key": "fronius", "name": "Fronius"}
    assert not preview["deviates"]
    found = by_op(preview)
    block = found["block"]
    assert block["possible"] and block["source"] == "profile" and block["why"] is None
    assert sets(block) == [
        ("number.charge_limit", 0.0),
        ("switch.charge_limit", True),
        ("number.discharge_limit", 0.0),
        ("switch.discharge_limit", True),
    ]
    assert [s["role"] for s in block["steps"]] == [
        "charge_limit",
        "charge_limit_enabled",
        "discharge_limit",
        "discharge_limit_enabled",
    ]
    assert block["steps"][0]["current"] == "100" and block["steps"][0]["unit"] == "%"
    assert block["steps"][1]["current"] == "off" and block["steps"][1]["unit"] is None
    assert block["note"] == "value_before_switch"
    assert back(block) == [
        ("switch.charge_limit", "saved"),
        ("switch.discharge_limit", "saved"),
        ("number.charge_limit", "saved"),
        ("number.discharge_limit", "saved"),
    ]
    assert sets(found["block_charge"]) == [
        ("number.charge_limit", 0.0),
        ("switch.charge_limit", True),
    ]
    assert sets(found["block_discharge"]) == [
        ("number.discharge_limit", 0.0),
        ("switch.discharge_limit", True),
    ]
    # The watchdog blocks the same way: no operations of its own.
    assert "guard_charge" not in found and "guard_discharge" not in found
    hold = found["hold"]
    assert hold["params"]["floor"] == 34
    assert sets(hold) == [("number.reserve", 34.0)]
    assert hold["steps"][0]["param"] == "floor"
    assert [s["param"] for s in block["steps"]] == [None] * 4
    assert back(hold) == [("number.reserve", "saved")]
    charge = found["charge"]
    assert charge["params"]["target"] == 55 and charge["params"]["power_w"] == 5000
    assert sets(charge) == [("switch.grid_charging", True), ("number.reserve", 55.0)]
    assert [s["param"] for s in charge["steps"]] == [None, "target"]
    assert back(charge) == [
        ("number.reserve", "saved"),
        ("switch.grid_charging", "saved"),
    ]
    # The cap needs to know what 100 % stand for.
    cap = found["cap"]
    assert (
        not cap["possible"] and cap["why"] == "need_ref" and cap["source"] == "profile"
    )
    release = found["release"]
    assert release["steps"] == []
    assert [e for e, _ in back(release)] == [
        "switch.discharge_limit",
        "number.discharge_limit",
        "switch.charge_limit",
        "number.charge_limit",
        "number.reserve",
        "switch.grid_charging",
    ]
    # With the reference: the ceiling first, then charging; the cap at half the power.
    known = {**team_byd(), "limit_ref_w": 5000}
    found = by_op(operations.preview(hass, known, power_w=2000))
    assert sets(found["charge"]) == [
        ("number.charge_limit", 40.0),
        ("switch.charge_limit", True),
        ("switch.grid_charging", True),
        ("number.reserve", 55.0),
    ]
    # The ceiling in % is no plain power: no parameter for it.
    assert [s["param"] for s in found["charge"]["steps"]] == [
        None,
        None,
        None,
        "target",
    ]
    cap = found["cap"]
    assert cap["possible"] and cap["params"]["percent"] == 50
    assert sets(cap) == [("switch.charge_limit", True), ("number.charge_limit", 50.0)]
    assert [s["param"] for s in cap["steps"]] == [None, "percent"]
    assert cap["note"] == "switch_before_value"
    assert back(cap) == [
        ("switch.charge_limit", "saved"),
        ("number.charge_limit", "saved"),
    ]


def test_the_roles_say_what_they_take_and_who_uses_them(hass: HomeAssistant) -> None:
    install_team(hass)
    preview = operations.preview(hass, {**team_byd(), "limit_ref_w": 5000})
    roles = {r["role"]: r for r in preview["roles"]}
    limit = roles["charge_limit"]
    assert limit["kind"] == "setpoint" and limit["unit"] == "%"
    assert limit["entity_id"] == "number.charge_limit" and limit["found"] is None
    assert limit["used_by"] == ["charge", "block", "block_charge", "cap"]
    assert limit["relevant"] and not limit["deviates"]
    assert roles["min_soc"]["kind"] == "level" and roles["min_soc"]["used_by"] == [
        "charge",
        "hold",
    ]
    assert roles["charge_limit_enabled"]["kind"] == "toggle"
    # The generic levers are listed even where the profile has none.
    assert roles["mode"]["kind"] == "option" and not roles["mode"]["relevant"]
    assert (
        roles["charge_power"]["entity_id"] is None
        and not roles["charge_power"]["relevant"]
    )
    assert "system_charge_limit" not in roles


def test_a_venus_blocks_with_its_switches_and_prepares_manual_mode(
    hass: HomeAssistant,
) -> None:
    install_guard(hass)
    preview = operations.preview(hass, guard_venus())
    found = by_op(preview)
    assert found["block"]["source"] == "profile"
    assert sets(found["block"]) == [
        ("switch.venus_allow_charge", False),
        ("switch.venus_allow_discharge", False),
    ]
    assert back(found["block"]) == [
        ("switch.venus_allow_charge", "saved"),
        ("switch.venus_allow_discharge", "saved"),
    ]
    assert sets(found["block_discharge"]) == [("switch.venus_allow_discharge", False)]
    assert "guard_discharge" not in found
    # Charging: manual mode first, then level, power and the forced mode.
    charge = found["charge"]
    assert sets(charge) == [
        ("switch.venus_manual_mode", True),
        ("number.charge_cutoff", 70.0),
        ("number.charge_power", 2500.0),
        ("select.force_mode", "Charge"),
    ]
    assert [e for e, _ in back(charge)] == [
        "select.force_mode",
        "number.charge_power",
        "number.charge_cutoff",
        "switch.venus_manual_mode",
    ]
    assert charge["note"] == "prepare"
    assert [s["param"] for s in charge["steps"]] == [None, "target", "power", None]
    # A Venus without its allow switches: the system's limits, one switch for both.
    plain = by_op(operations.preview(hass, team_venus()))
    assert sets(plain["block"]) == [
        ("number.omni_max_charge", 0.0),
        ("number.omni_max_discharge", 0.0),
        ("switch.omni_power_limits", True),
    ]
    assert back(plain["block"]) == [
        ("switch.omni_power_limits", "saved"),
        ("number.omni_max_charge", "saved"),
        ("number.omni_max_discharge", "saved"),
    ]
    assert "guard_charge" not in plain


def test_huawei_steps_come_from_the_profile(hass: HomeAssistant) -> None:
    luna = next(
        b
        for b in discover(huawei_snapshot())["batteries"]
        if b["integration"] == "huawei_solar"
    )
    battery = {**luna, "name": "LUNA", "device_id": "luna"}
    hass.states.async_set("sensor.luna_soc", "40", {"unit_of_measurement": "%"})
    for entity_id in ("number.luna_charging", "number.luna_discharging"):
        hass.states.async_set(
            entity_id, "5000", {"min": 0, "max": 5000, "unit_of_measurement": "W"}
        )
    hass.states.async_set("switch.luna_grid", "off")
    for service in ("forcible_charge_soc", "stop_forcible_charge"):
        hass.services.async_register("huawei_solar", service, lambda call: None)
    found = by_op(operations.preview(hass, battery))
    charge = found["charge"]
    assert charge["possible"] and charge["source"] == "service"
    assert charge["steps"] == [
        {
            "kind": "set",
            "role": None,
            "entity_id": "switch.luna_grid",
            "name": "luna grid",
            "value": True,
            "param": None,
            "unit": None,
            "current": "off",
        },
        {
            "kind": "call",
            "service": "huawei_solar.forcible_charge_soc",
            "data": {"device_id": "luna", "target_soc": 60, "power": 5000},
        },
    ]
    assert back(charge) == [("switch.luna_grid", "saved")]
    hold = found["hold"]
    assert hold["source"] == "service"
    assert [s["kind"] for s in hold["steps"]] == ["call", "set"]
    assert sets(hold) == [("number.luna_discharging", 0.0)]
    assert found["block"]["source"] == "profile"
    assert sets(found["block"]) == [
        ("number.luna_charging", 0.0),
        ("number.luna_discharging", 0.0),
    ]
    release = found["release"]
    assert release["source"] == "service"
    assert release["steps"] == [
        {
            "kind": "call",
            "service": "huawei_solar.stop_forcible_charge",
            "data": {"device_id": "luna"},
        }
    ]
    # Steps the user changed are their own, the untouched ones the profile's.
    changed = {
        **battery,
        "steps": {
            **battery["steps"],
            "hold": [{"entity_id": "number.luna_discharging", "value": 100}],
        },
    }
    found = by_op(operations.preview(hass, changed))
    assert found["hold"]["source"] == "own" and found["charge"]["source"] == "service"
    assert sets(found["hold"]) == [("number.luna_discharging", 100.0)]


def test_a_battery_joe_only_watches_has_no_operations(hass: HomeAssistant) -> None:
    preview = operations.preview(hass, {**fronius_battery(), "adapter": "none"})
    assert preview["profile"] is None
    assert [o["op"] for o in preview["operations"]] == ORDER
    assert all(
        not o["possible"] and o["why"] == "not_controllable" and o["source"] == "none"
        for o in preview["operations"]
    )


def test_what_is_not_possible_says_why(hass: HomeAssistant) -> None:
    install_devices(hass)
    hass.states.async_set("sensor.byd_soc", "unavailable")
    found = by_op(operations.preview(hass, fronius_battery()))
    assert (
        found["hold"]["why"] == "soc_unknown" and found["hold"]["source"] == "profile"
    )
    assert found["charge"]["why"] == "soc_unknown"
    # No charge limit: nothing blocks charging by day, nothing caps.
    assert found["block"]["why"] == "no_lever"
    assert found["block"]["source"] == "none"
    assert found["cap"]["why"] == "no_lever" and found["cap"]["source"] == "none"
    # The watchdog still blocks discharging with the discharge limit.
    guard = found["guard_discharge"]
    assert guard["possible"] and guard["source"] == "profile"
    assert sets(guard) == [
        ("number.discharge_limit", 0.0),
        ("switch.discharge_limit", True),
    ]
    assert back(guard) == [
        ("switch.discharge_limit", "saved"),
        ("number.discharge_limit", "saved"),
    ]
    assert "guard_charge" not in found


# --- own steps ------------------------------------------------------------------------


def own_byd() -> dict[str, Any]:
    """A Fronius whose owner blocks it with a mode of their own."""
    return {
        **team_byd(),
        "steps": {
            "block": [{"entity_id": "select.byd_mode", "value": "hold"}],
            "block_discharge": [{"entity_id": "select.byd_mode", "value": "no_out"}],
            "release": [{"entity_id": "select.byd_mode", "value": "auto"}],
        },
    }


def install_own(hass: HomeAssistant) -> list[tuple[str, str]]:
    calls = install_team(hass)
    hass.states.async_set(
        "select.byd_mode", "auto", {"options": ["auto", "hold", "no_out"]}
    )
    return calls


def test_own_steps_replace_the_profile_in_the_preview(hass: HomeAssistant) -> None:
    install_own(hass)
    found = by_op(operations.preview(hass, own_byd()))
    block = found["block"]
    assert block["source"] == "own" and block["possible"]
    assert sets(block) == [("select.byd_mode", "hold")]
    assert back(block) == [("select.byd_mode", "saved")]
    # One direction with its own steps; charging alone with the "block" steps
    # (more than wanted, never less).
    assert found["block_discharge"]["source"] == "own"
    assert sets(found["block_discharge"]) == [("select.byd_mode", "no_out")]
    assert found["block_charge"]["source"] == "own"
    assert sets(found["block_charge"]) == [("select.byd_mode", "hold")]
    # The watchdog takes the one-way steps and differs for charging.
    assert "guard_discharge" not in found
    assert sets(found["guard_charge"]) == [
        ("number.charge_limit", 0.0),
        ("switch.charge_limit", True),
    ]
    assert found["release"]["source"] == "own"
    assert sets(found["release"]) == [("select.byd_mode", "auto")]
    # The night stays the profile's.
    assert found["hold"]["source"] == "profile"
    assert sets(found["hold"]) == [("number.reserve", 50.0)]
    # Own steps for the day change no signature of the night's test run
    # (the own release steps belong to the night and do).
    day_only = {k: v for k, v in own_byd()["steps"].items() if k != "release"}
    assert (
        make_adapter({**own_byd(), "steps": day_only}).signature
        == make_adapter(team_byd()).signature
    )
    assert make_adapter(own_byd()).signature != make_adapter(team_byd()).signature


async def test_own_steps_block_by_day_and_read_back(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-10T12:00:00+02:00")
    calls = install_own(hass)
    config = team_config(own_byd(), team_venus())
    executor, _ = await make_executor(hass, config, None)
    executor.team = {"state": "on", "dry": False, "batteries": {"byd": {}, "venus": {}}}
    now = dt_util.now()
    adapter = make_adapter(own_byd())
    assert adapter.team_lever() == "own" and adapter.team_problem(hass) is None
    assert not adapter.charge_blocked(hass) and not adapter.discharge_blocked(hass)
    keep = await executor._async_team_apply(config, {"byd": (True, True)}, set(), now)
    assert calls == [("select.byd_mode", "hold")]
    assert keep == {"select.byd_mode", "byd"}
    assert executor.data["saved"] == {"select.byd_mode": "auto"}
    assert executor.data["team"]["blocks"]["byd"] == {"charge": True, "discharge": True}
    # The written value stands: blocked both ways, whoever asks.
    assert adapter.charge_blocked(hass) and adapter.discharge_blocked(hass)
    # Only discharging now: the one-way steps, nothing to give back (same entity).
    calls.clear()
    await executor._async_team_apply(config, {"byd": (False, True)}, set(), now)
    assert calls == [("select.byd_mode", "no_out")]
    assert executor.data["saved"] == {"select.byd_mode": "auto"}
    # Free again: the original back, then the own release steps.
    calls.clear()
    await executor._async_team_apply(config, {"byd": (False, False)}, set(), now)
    assert calls == [("select.byd_mode", "auto")]
    assert executor.data["saved"] == {}
    assert "byd" not in executor.data["team"]["blocks"]


async def test_the_watchdog_uses_the_own_one_way_steps(hass: HomeAssistant) -> None:
    calls = install_own(hass)
    config = team_config(own_byd(), team_venus())
    executor, _ = await make_executor(hass, config, None)
    adapter = make_adapter(own_byd())
    assert adapter.guard_can_block("discharge") and adapter.guard_can_block("charge")
    assert adapter.guard_block("discharge", False, hass) == [
        Write("select.byd_mode", "no_out")
    ]
    problem = await executor._async_guard_block([(adapter, True)], "discharge", False)
    assert problem is None
    assert calls == [("select.byd_mode", "no_out"), ("select.byd_mode", "auto")]
    assert executor.data["guard"]["held"] == {}


def test_own_steps_for_the_cap_and_the_night(hass: HomeAssistant) -> None:
    install_own(hass)
    hass.states.async_set(
        "number.byd_cap", "100", {"min": 0, "max": 100, "unit_of_measurement": "%"}
    )
    battery = {
        **team_byd(),
        "steps": {
            "cap": [{"entity_id": "number.byd_cap", "value": "{percent}"}],
            "hold": [{"entity_id": "select.byd_mode", "value": "hold"}],
        },
    }
    adapter = make_adapter(battery)
    assert adapter.limit_problem(hass) is None and adapter.can_defer()
    assert adapter.limit(hass, 2.0, {}) == [Write("number.byd_cap", 40)]
    assert adapter.defer() == [Write("number.byd_cap", 0)]
    assert adapter.limit_entities() == ["number.byd_cap"]
    assert adapter.unlimit({"number.byd_cap": 100.0}) == [
        Write("number.byd_cap", 100.0)
    ]
    found = by_op(operations.preview(hass, battery))
    assert found["cap"]["source"] == "own"
    assert sets(found["cap"]) == [("number.byd_cap", 50.0)]
    assert found["cap"]["steps"][0]["param"] == "percent"
    assert found["hold"]["source"] == "own"
    assert sets(found["hold"]) == [("select.byd_mode", "hold")]
    # Own steps of the night count for the test run's signature.
    assert adapter.signature != make_adapter(team_byd()).signature


# --- the profile's find ------------------------------------------------------------------


def marcels_fronius() -> dict[str, Any]:
    """The limits assigned as powers, the limit roles missing."""
    return {
        "id": "byd",
        "name": "BYD",
        "adapter": "fronius",
        "soc_entity": "sensor.storage_soc",
        "device_id": "storage",
        "controls": {
            "min_soc": "number.inverter_minimum_reserve",
            "grid_charge": "switch.inverter_grid_charging",
            "charge_power": "number.inverter_charge_limit",
            "discharge_power": "number.inverter_discharge_limit",
        },
    }


def with_discharge_limits(snap):
    fr = {"platform": "fronius", "entry": "fronius", "device_id": "inverter"}
    for item in (
        entity(
            "number.inverter_discharge_limit",
            "Discharge limit",
            100,
            unit="%",
            unique_id="1-modbus-battery_discharge_power_limit",
            **fr,
        ),
        entity(
            "switch.inverter_discharge_limit_enabled",
            "Discharge limit active",
            "off",
            unique_id="1-modbus-battery_discharge_power_limit_enabled",
            **fr,
        ),
    ):
        snap.entities[item.entity_id] = item
    return snap


FOUND = {
    "min_soc": "number.inverter_minimum_reserve",
    "grid_charge": "switch.inverter_grid_charging",
    "charge_limit": "number.inverter_charge_limit",
    "charge_limit_enabled": "switch.inverter_charge_limit_enabled",
    "discharge_limit": "number.inverter_discharge_limit",
    "discharge_limit_enabled": "switch.inverter_discharge_limit_enabled",
}


def test_the_find_names_what_is_missing_and_what_to_take_over(
    hass: HomeAssistant,
) -> None:
    snap = with_discharge_limits(fronius_household())
    battery = marcels_fronius()
    assert profile_find(snap, battery)["controls"] == FOUND
    deviation = role_deviation(snap, battery)
    assert deviation["battery_id"] == "byd" and deviation["profile"] == "fronius"
    assert deviation["missing"] == [
        "discharge_limit",
        "discharge_limit_enabled",
        "charge_limit",
        "charge_limit_enabled",
    ]
    assert deviation["wrong"] == []
    # Taking it over: the powers assigned to the limits give way to the limit roles.
    assert adopted_controls(battery, FOUND) == FOUND
    # A role the profile does not know, on an entity it did not find, stays.
    other = {**battery, "controls": {**battery["controls"], "mode": "select.mine"}}
    assert adopted_controls(other, FOUND) == {**FOUND, "mode": "select.mine"}
    # A wrong one: the reserve assigned to another entity.
    wrong = {**battery, "controls": {**FOUND, "min_soc": "number.other"}}
    assert role_deviation(snap, wrong)["wrong"] == [
        {
            "role": "min_soc",
            "is": "number.other",
            "found": "number.inverter_minimum_reserve",
        }
    ]
    assert role_deviation(snap, {**battery, "controls": FOUND}) is None
    # The preview marks the roles with the find.
    for entity_id in FOUND.values():
        hass.states.async_set(entity_id, "0")
    hass.states.async_set("sensor.storage_soc", "55")
    preview = operations.preview(hass, battery, FOUND)
    assert preview["deviates"]
    roles = {r["role"]: r for r in preview["roles"]}
    assert (
        roles["charge_limit"]["deviates"] and roles["charge_limit"]["entity_id"] is None
    )
    assert roles["charge_limit"]["found"] == "number.inverter_charge_limit"
    # The power assigned to the limit's entity: it moves to the limit's role.
    assert roles["charge_power"]["deviates"] and roles["charge_power"]["relevant"]
    assert roles["charge_power"]["found"] is None
    assert not roles["min_soc"]["deviates"]
    # One the profile does not know on an entity of its own: no deviation.
    own = {**battery, "controls": {**FOUND, "mode": "select.mine"}}
    roles = {r["role"]: r for r in operations.preview(hass, own, FOUND)["roles"]}
    assert not roles["mode"]["deviates"] and roles["mode"]["relevant"]


def install_fronius_registry(hass: HomeAssistant) -> dict[str, str]:
    """A Fronius as Home Assistant's registries know it (unique ids)."""
    entry = MockConfigEntry(domain="fronius")
    entry.add_to_hass(hass)
    devices = dr.async_get(hass)
    storage = devices.async_get_or_create(
        config_entry_id=entry.entry_id, identifiers={("fronius", "storage")}
    )
    inverter = devices.async_get_or_create(
        config_entry_id=entry.entry_id, identifiers={("fronius", "inverter")}
    )
    registry = er.async_get(hass)
    found: dict[str, str] = {}
    percent = {"min": 0, "max": 100, "step": 1, "unit_of_measurement": "%"}
    for domain, key, where, state, attrs in (
        ("sensor", "SERIAL1 -state_of_charge", storage, "55", percent),
        ("number", "1-modbus-battery_minimum_reserve", inverter, "5", percent),
        ("switch", "1-modbus-battery_grid_charging", inverter, "on", {}),
        ("number", "1-modbus-battery_charge_power_limit", inverter, "100", percent),
        ("switch", "1-modbus-battery_charge_power_limit_enabled", inverter, "off", {}),
        ("number", "1-modbus-battery_discharge_power_limit", inverter, "100", percent),
        (
            "switch",
            "1-modbus-battery_discharge_power_limit_enabled",
            inverter,
            "off",
            {},
        ),
    ):
        item = registry.async_get_or_create(
            domain, "fronius", key, config_entry=entry, device_id=where.id
        )
        hass.states.async_set(item.entity_id, state, attrs)
        found[key] = item.entity_id
    found["device"] = storage.id
    return found


def registered_fronius(found: dict[str, str], **controls: str) -> dict[str, Any]:
    return {
        "id": "byd",
        "name": "BYD",
        "adapter": "fronius",
        "soc_entity": found["SERIAL1 -state_of_charge"],
        "device_id": found["device"],
        "controls": {
            "min_soc": found["1-modbus-battery_minimum_reserve"],
            "grid_charge": found["1-modbus-battery_grid_charging"],
            **controls,
        },
    }


async def test_levers_the_user_set_are_reported_not_patched(
    hass: HomeAssistant,
) -> None:
    found = install_fronius_registry(hass)
    battery = registered_fronius(
        found, charge_power=found["1-modbus-battery_charge_power_limit"]
    )
    config = model.apply_update(
        configured(battery),
        {"batteries": {"byd": {"controls": battery["controls"]}}},
        "user",
    )
    result = await async_profile_updates(hass, config)
    assert "batteries" not in result
    (deviation,) = result["battery_roles"]
    assert deviation["missing"] == [
        "discharge_limit",
        "discharge_limit_enabled",
        "charge_limit",
        "charge_limit_enabled",
    ]
    # Dismissed: not asked again until the find changes.
    assert await async_profile_updates(hass, config, {"byd": deviation["hash"]}) is None
    assert (await async_profile_updates(hass, config, {"byd": "other"})) is not None
    # Not the user's: patched as before (the day's levers only).
    plain = configured(battery)
    assert await async_profile_updates(hass, plain) is None


async def test_adopt_and_dismiss_over_the_websocket(
    ready_hass: HomeAssistant, hass_ws_client: WebSocketGenerator
) -> None:
    hass = ready_hass
    found = install_fronius_registry(hass)
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    runtime = hass.data[DOMAIN]
    battery = registered_fronius(
        found,
        charge_power=found["1-modbus-battery_charge_power_limit"],
        discharge_power=found["1-modbus-battery_discharge_power_limit"],
    )
    runtime.async_update_config({"batteries": [battery]}, "user")
    await hass.async_block_till_done()
    (deviation,) = runtime.state["battery_roles"]
    assert deviation["battery_id"] == "byd" and deviation["name"] == "BYD"
    assert len(deviation["missing"]) == 4

    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": f"{DOMAIN}/battery/roles", "battery_id": "byd", "action": "dismiss"}
    )
    msg = await client.receive_json()
    assert msg["success"] and msg["result"]["ok"]
    assert runtime.state["battery_roles"] == []
    assert runtime.config["batteries"][0]["controls"] == battery["controls"]

    await client.send_json_auto_id(
        {"type": f"{DOMAIN}/battery/roles", "battery_id": "byd", "action": "adopt"}
    )
    msg = await client.receive_json()
    assert msg["success"]
    controls = runtime.config["batteries"][0]["controls"]
    assert controls == {
        "min_soc": found["1-modbus-battery_minimum_reserve"],
        "grid_charge": found["1-modbus-battery_grid_charging"],
        "charge_limit": found["1-modbus-battery_charge_power_limit"],
        "charge_limit_enabled": found["1-modbus-battery_charge_power_limit_enabled"],
        "discharge_limit": found["1-modbus-battery_discharge_power_limit"],
        "discharge_limit_enabled": found[
            "1-modbus-battery_discharge_power_limit_enabled"
        ],
    }
    assert msg["result"]["controls"] == controls
    assert model.source_of(runtime.config, "batteries[byd].controls") == "read"
    assert runtime.state["battery_roles"] == []
    await client.send_json_auto_id(
        {"type": f"{DOMAIN}/battery/roles", "battery_id": "nope", "action": "adopt"}
    )
    msg = await client.receive_json()
    assert not msg["success"] and msg["error"]["code"] == "unknown_battery"


# --- the probe --------------------------------------------------------------------------


@pytest.fixture
def quick() -> Any:
    with (
        patch.object(executor_module, "TEST_HOLD", 0),
        patch.object(executor_module, "TEST_CHARGE", 0),
        patch.object(executor_module, "TEST_RELEASE", 0),
        patch.object(executor_module, "PROBE_BLOCK", 0),
    ):
        yield


async def test_a_probe_writes_reads_back_and_restores(
    hass: HomeAssistant, quick
) -> None:
    calls = install_team(hass, byd_soc=34)
    executor, _ = await make_executor(hass, team_config(), None, mode="simulation")
    result = await executor.async_probe("byd", "block")
    assert result["ok"] and result["problem"] is None and result["op"] == "block"
    assert result["restored"] and result["restore_errors"] == []
    assert result["power_kw"] == 0.0
    assert [
        (s["entity_id"], s["wrote"], s["read"], s["taken"], s["error"])
        for s in result["steps"]
    ] == [
        ("number.charge_limit", 0.0, "0.0", True, None),
        ("switch.charge_limit", True, "on", True, None),
        ("number.discharge_limit", 0.0, "0.0", True, None),
        ("switch.discharge_limit", True, "on", True, None),
    ]
    assert calls == [
        ("number.charge_limit", "0.0"),
        ("switch.charge_limit", "on"),
        ("number.discharge_limit", "0.0"),
        ("switch.discharge_limit", "on"),
        ("switch.charge_limit", "off"),
        ("switch.discharge_limit", "off"),
        ("number.charge_limit", "100.0"),
        ("number.discharge_limit", "100.0"),
    ]
    assert executor.data["saved"] == {}
    assert executor.data["probes"]["byd"]["block"] == result
    assert "probes" not in executor.view and executor.view["probe_running"] is None
    assert executor.data["log"][-1]["kind"] == "probe"
    assert executor.data["log"][-1]["op"] == "block" and executor.data["log"][-1]["ok"]
    # Holding and charging as in the test run.
    calls.clear()
    result = await executor.async_probe("byd", "hold")
    assert result["ok"] and calls == [
        ("number.reserve", "34.0"),
        ("number.reserve", "5.0"),
    ]
    result = await executor.async_probe("byd", "charge")
    assert result["ok"] and [s["entity_id"] for s in result["steps"]] == [
        "switch.grid_charging",
        "number.reserve",
    ]
    assert hass.states.get("number.reserve").state == "5.0"
    # What is not possible is said so, nothing is written.
    calls.clear()
    result = await executor.async_probe("byd", "cap")
    assert not result["ok"] and result["problem"] == "not_possible"
    assert result["why"] == "need_ref" and calls == []
    assert executor.data["probes"]["byd"]["cap"]["problem"] == "not_possible"


async def test_a_probe_is_refused_while_joe_steers_or_tests(
    hass: HomeAssistant, quick
) -> None:
    calls = install_team(hass)
    executor, _ = await make_executor(hass, team_config(), None, mode="simulation")
    executor.status = {**executor.status, "steering": True}
    result = await executor.async_probe("byd", "block")
    assert not result["ok"] and result["problem"] == "steering" and calls == []
    assert "byd" not in executor.data["probes"]
    executor.status = {**executor.status, "steering": False}
    executor.testing = {"battery": "venus", "step": "hold"}
    result = await executor.async_probe("byd", "block")
    assert result["problem"] == "busy" and calls == []
    executor.testing = None
    with pytest.raises(ValueError, match="unknown_battery"):
        await executor.async_probe("nope", "block")
    # A failing write is reported, the rest put back.

    def refuse(call: ServiceCall) -> None:
        if call.data["entity_id"] == "switch.charge_limit":
            raise HomeAssistantError("no")
        hass.states.async_set(call.data["entity_id"], "on")

    hass.services.async_register("switch", "turn_on", refuse)
    result = await executor.async_probe("byd", "block")
    assert not result["ok"] and result["problem"] is None
    assert result["steps"][1]["error"] == "failed" and not result["steps"][1]["taken"]
    assert result["steps"][0]["taken"] and result["steps"][3]["taken"]
    assert result["restored"] and executor.data["saved"] == {}
    assert hass.states.get("number.charge_limit").state == "100.0"


async def test_the_test_run_still_passes(hass: HomeAssistant, quick) -> None:
    install_team(hass)
    executor, _ = await make_executor(
        hass, team_config(), None, mode="simulation", tested=False
    )
    result = await executor.async_test("byd")
    assert result["ok"] and [s["step"] for s in result["steps"]] == [
        "hold",
        "charge",
        "release",
    ]
    assert executor.data["saved"] == {}


# --- the websocket -------------------------------------------------------------------


async def test_preview_and_probe_over_the_websocket(
    ready_hass: HomeAssistant, hass_ws_client: WebSocketGenerator, quick
) -> None:
    hass = ready_hass
    install_team(hass, byd_soc=34)
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    runtime = hass.data[DOMAIN]
    runtime.async_update_config({"batteries": [fronius_battery()]}, "user")
    await hass.async_block_till_done()

    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": f"{DOMAIN}/battery/preview", "battery_id": "byd"}
    )
    msg = await client.receive_json()
    assert msg["success"], msg
    found = by_op(msg["result"])
    assert msg["result"]["profile"]["key"] == "fronius"
    assert list(found)[:7] == ORDER
    assert found["block"]["why"] == "no_lever"
    # The dialog's unsaved state: the limits assigned make the block possible.
    draft = {
        "controls": {
            **FRONIUS,
            "charge_limit": "number.charge_limit",
            "charge_limit_enabled": "switch.charge_limit",
        }
    }
    await client.send_json_auto_id(
        {"type": f"{DOMAIN}/battery/preview", "battery_id": "byd", "draft": draft}
    )
    msg = await client.receive_json()
    found = by_op(msg["result"])
    assert found["block"]["possible"] and len(found["block"]["steps"]) == 4
    # A draft that does not pass the model's check is an answer, not an error.
    await client.send_json_auto_id(
        {
            "type": f"{DOMAIN}/battery/preview",
            "battery_id": "byd",
            "draft": {"controls": {"nonsense": "number.x"}},
        }
    )
    msg = await client.receive_json()
    assert msg["success"] and msg["result"]["code"] == "invalid_draft"
    assert "nonsense" in msg["result"]["error"]
    await client.send_json_auto_id(
        {"type": f"{DOMAIN}/battery/preview", "battery_id": "nope"}
    )
    msg = await client.receive_json()
    assert not msg["success"] and msg["error"]["code"] == "unknown_battery"

    await client.send_json_auto_id(
        {"type": f"{DOMAIN}/battery/probe", "battery_id": "byd", "op": "hold"}
    )
    msg = await client.receive_json()
    assert msg["success"], msg
    assert msg["result"]["ok"] and msg["result"]["op"] == "hold"
    assert msg["result"]["steps"][0]["entity_id"] == "number.reserve"
    assert runtime.state["probes"]["byd"]["hold"]["ok"]
    assert runtime.state["control"]["probe_running"] is None
    await client.send_json_auto_id(
        {"type": f"{DOMAIN}/battery/probe", "battery_id": "byd", "op": "nonsense"}
    )
    msg = await client.receive_json()
    assert not msg["success"]


def test_the_values_of_the_moment(hass: HomeAssistant) -> None:
    install_team(hass, byd_soc=92.4)
    params = operations.params_for(hass, team_byd())
    assert params.target == 100 and params.floor == 92 and params.power_w == 5000
    assert params.cap_w == 2500 and params.percent == 50 and params.seconds == 5
    planned = operations.params_for(hass, team_byd(), target=60, power_w=1500)
    assert planned.target == 60 and planned.power_w == 1500
