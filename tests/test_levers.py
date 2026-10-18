"""The night's floor never above the level (on the entity's step, not below
its range), no silent "nothing to write" when no lever applies, and the
levers of the right inverter when one integration entry has several."""

from __future__ import annotations

from typing import Any

import pytest

from custom_components.energy_joe.control.adapters import Desired, make_adapter
from custom_components.energy_joe.control.writes import Write
from custom_components.energy_joe.discovery import discover
from custom_components.energy_joe.discovery.snapshot import DeviceInfo, EntityInfo
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .snapshots import entity, fronius_household, snapshot
from .test_control import (
    configured,
    fronius_battery,
    install_devices,
    make_executor,
    night_plan,
)

# Victron's ESS minimum SoC (CGwacs): 10..100 in steps of 5.
FLOOR = "number.v_min_soc"
FLOOR_ATTRS = {"min": 10, "max": 100, "step": 5, "unit_of_measurement": "%"}


@pytest.fixture(autouse=True)
def berlin(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


def victron(**controls: str) -> dict[str, Any]:
    return {
        "id": "victron",
        "name": "Victron",
        "adapter": "victron_gx",
        "soc_entity": "sensor.v_soc",
        "power": {
            "entity_id": "sensor.v_power",
            "invert": False,
            "minus_entity_id": None,
        },
        "capacity_kwh": 10.0,
        "controls": {"min_soc": FLOOR, **controls},
    }


def install_victron(hass: HomeAssistant, soc: float, floor: float = 10) -> None:
    hass.states.async_set("sensor.v_soc", str(soc), {"unit_of_measurement": "%"})
    hass.states.async_set("sensor.v_power", "0", {"unit_of_measurement": "W"})
    hass.states.async_set(FLOOR, str(floor), FLOOR_ATTRS)


def values(writes: list[Write]) -> list[tuple[str, Any]]:
    return [(w.entity_id, w.value) for w in writes]


# --- M2: the night's floor ----------------------------------------------------------


def test_the_nights_floor_is_rounded_down_never_above_the_level(
    hass: HomeAssistant,
) -> None:
    install_victron(hass, 23.4)
    adapter = make_adapter(victron())
    assert adapter is not None
    # 23 would become 25 at the nearest step: above the level, it would
    # charge from the grid. Down to 20 instead, holding and blocking alike.
    assert values(adapter.writes(hass, Desired(floor=23), 23.4, {})) == [(FLOOR, 20)]
    assert values(adapter.writes(hass, Desired(floor=23, block=True), 23.4, {})) == [
        (FLOOR, 20)
    ]
    # Exactly on a step it stays.
    assert values(adapter.writes(hass, Desired(floor=25), 25.0, {})) == [(FLOOR, 25)]
    # A floor below its range with the level above it: its lowest floor.
    assert values(adapter.writes(hass, Desired(floor=5), 50, {})) == [(FLOOR, 10)]
    # A target below the level: the target, on its step.
    assert values(adapter.writes(hass, Desired(floor=33), 60, {})) == [(FLOOR, 30)]
    # Above its range: its highest floor while the level is well above.
    hass.states.async_set(FLOOR, "10", {**FLOOR_ATTRS, "max": 80})
    assert values(adapter.writes(hass, Desired(floor=85), 90, {})) == [(FLOOR, 80)]


def test_a_floor_joe_set_stays_one_step_below_and_the_owners_stays(
    hass: HomeAssistant,
) -> None:
    install_victron(hass, 24.6, floor=25)
    adapter = make_adapter(victron())
    assert adapter is not None
    saved = {FLOOR: 10.0}
    # Joe set 25, the level dips to 24.6: down to 20 at once.
    assert values(adapter.writes(hass, Desired(floor=25), 24.6, saved)) == [(FLOOR, 20)]
    # Back at 25.2: his 20 stays (no writes back and forth, Victron's flash).
    hass.states.async_set(FLOOR, "20", FLOOR_ATTRS)
    assert values(adapter.writes(hass, Desired(floor=25), 25.2, saved)) == [
        (FLOOR, 20.0)
    ]
    # Never more than one step below.
    assert values(adapter.writes(hass, Desired(floor=30), 31, saved)) == [(FLOOR, 30)]
    # The owner's own floor stays where it holds the battery already.
    hass.states.async_set(FLOOR, "30", FLOOR_ATTRS)
    assert values(adapter.writes(hass, Desired(floor=30), 23.4, {})) == [(FLOOR, 30.0)]


def test_a_depth_of_discharge_is_rounded_the_other_way(hass: HomeAssistant) -> None:
    """GoodWe: the floor as depth of discharge (0..90 %, floor 10..100 %)."""
    hass.states.async_set("number.gw_dod", "80", {"min": 0, "max": 90, "step": 5})
    adapter = make_adapter(
        {
            "id": "gw",
            "name": "GoodWe",
            "adapter": "goodwe",
            "soc_entity": "sensor.gw_soc",
            "controls": {"min_soc": "number.gw_dod"},
        }
    )
    assert adapter is not None
    # Level 23.4: a depth of 76.6 would round to 75 (floor 25, above it): 80.
    assert values(adapter.writes(hass, Desired(floor=23), 23.4, {})) == [
        ("number.gw_dod", 80)
    ]
    # Level 7: a depth of 93 is beyond its 90 (floor 10, above it): none.
    assert adapter.writes(hass, Desired(floor=7, block=True), 7, {}) == []
    assert (
        adapter.steer_problem(hass, Desired(floor=7, block=True), 7, {})
        == "cannot_block"
    )


# --- M3: no lever applies ------------------------------------------------------------


def test_below_its_lowest_floor_joe_writes_none_and_says_so(
    hass: HomeAssistant,
) -> None:
    install_victron(hass, 7)
    adapter = make_adapter(victron())
    assert adapter is not None
    for want in (Desired(floor=7), Desired(floor=7, block=True)):
        # Its lowest floor (10) would be above the level: never written.
        assert FLOOR not in [w.entity_id for w in adapter.writes(hass, want, 7, {})]
    assert adapter.steer_problem(hass, Desired(floor=7), 7, {}) == "cannot_hold"
    assert (
        adapter.steer_problem(hass, Desired(floor=7, block=True), 7, {})
        == "cannot_block"
    )
    assert adapter.steer_problem(hass, Desired(floor=23), 23.4, {}) is None
    assert adapter.steer_problem(hass, Desired(floor=23, block=True), 23.4, {}) is None


def test_the_next_method_of_the_profile_holds_instead(hass: HomeAssistant) -> None:
    """Fox ESS: its floor below range, so its mode "Back-up" holds."""
    hass.states.async_set("number.fox_min", "10", {"min": 10, "max": 100, "step": 1})
    hass.states.async_set(
        "select.fox_mode",
        "Self Use",
        {"options": ["Self Use", "Back-up", "Force Charge", "Force Discharge"]},
    )
    adapter = make_adapter(
        {
            "id": "fox",
            "name": "Fox",
            "adapter": "foxess_modbus",
            "soc_entity": "sensor.fox_soc",
            "controls": {"min_soc": "number.fox_min", "mode": "select.fox_mode"},
        }
    )
    assert adapter is not None
    assert values(adapter.writes(hass, Desired(floor=7), 7, {})) == [
        ("select.fox_mode", "Back-up")
    ]
    assert adapter.steer_problem(hass, Desired(floor=7), 7, {}) is None
    # Above its lowest floor the floor holds, as before.
    assert values(adapter.writes(hass, Desired(floor=30), 30.5, {})) == [
        ("number.fox_min", 30)
    ]


def victron_night(now: Any) -> dict[str, Any]:
    plan = night_plan(now)
    plan["batteries"] = [
        {"id": "byd", "target": 60, "power_kw": 3.0},
        {"id": "victron", "target": 20, "power_kw": 0.0},
    ]
    return plan


async def test_no_battery_charges_while_another_cannot_be_blocked(
    hass: HomeAssistant, freezer
) -> None:
    """The Victron below its lowest floor would discharge into the BYD."""
    freezer.move_to("2026-10-04T03:10:00+02:00")
    install_devices(hass, byd_soc=30.4)
    install_victron(hass, 7)
    config = configured(fronius_battery(), victron())
    executor, _ = await make_executor(hass, config, victron_night(dt_util.now()))

    await executor.async_check()
    batteries = executor.status["batteries"]
    assert batteries["victron"]["problem"] == "cannot_block"
    assert batteries["byd"]["action"] == "hold"
    # The BYD holds at its level instead of charging; the Victron's floor stays.
    assert hass.states.get("number.reserve").state == "30.0"
    assert hass.states.get(FLOOR).state == "10"

    # Its level back within its range: blocked, and the BYD charges.
    hass.states.async_set("sensor.v_soc", "12", {"unit_of_measurement": "%"})
    await executor.async_check()
    batteries = executor.status["batteries"]
    assert batteries["byd"]["action"] == "charge"
    assert batteries["victron"]["action"] == "block"
    assert batteries["victron"]["problem"] is None
    assert hass.states.get("number.reserve").state == "60.0"
    assert float(hass.states.get(FLOOR).state) == 10


async def test_a_battery_that_cannot_be_held_says_so(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-04T01:00:00+02:00")
    install_devices(hass, byd_soc=30.4)
    install_victron(hass, 7)
    config = configured(fronius_battery(), victron())
    executor, _ = await make_executor(hass, config, victron_night(dt_util.now()))
    await executor.async_check()
    assert executor.status["batteries"]["victron"]["problem"] == "cannot_hold"
    assert executor.status["batteries"]["byd"]["problem"] is None


def test_a_kostal_below_its_lowest_floor_cannot_take_turns(
    hass: HomeAssistant,
) -> None:
    """By day ("Nacheinander"): no silent block that does not hold."""
    hass.states.async_set("sensor.k_soc", "3", {"unit_of_measurement": "%"})
    hass.states.async_set("number.k_min", "5", {"min": 5, "max": 100, "step": 1})
    hass.states.async_set("number.k_max", "100", {"min": 5, "max": 100, "step": 1})
    adapter = make_adapter(
        {
            "id": "k",
            "name": "Kostal",
            "adapter": "kostal_modbus_control",
            "soc_entity": "sensor.k_soc",
            "controls": {"min_soc": "number.k_min", "charge_target": "number.k_max"},
        }
    )
    assert adapter is not None
    assert adapter.team_lever() == "level"
    assert adapter.team_problem(hass) == "cannot_block"
    hass.states.async_set("sensor.k_soc", "40", {"unit_of_measurement": "%"})
    assert adapter.team_problem(hass) is None


# --- H4: several inverters in one integration entry ------------------------------------


def _energy(*socs: str) -> dict[str, Any]:
    return {
        "energy_sources": [{"type": "battery", "stat_soc": soc} for soc in socs],
        "device_consumption": [],
    }


def solaredge_two(linked: bool = True) -> tuple[list[EntityInfo], list[DeviceInfo]]:
    """Two SolarEdge inverters in one entry, a battery on each (uid_base
    "<model>_<serial>", the battery's "<model>_<serial>_B1")."""
    se = {"platform": "solaredge_modbus_multi", "entry": "se"}
    items: list[EntityInfo] = []
    devices: list[DeviceInfo] = []
    for tag, serial in (("a", "7E1A"), ("b", "7E2B")):
        inv, bat = f"inv_{tag}", f"bat_{tag}"
        base = f"SE10K_{serial}"
        devices += [
            DeviceInfo(inv, f"SolarEdge SE10K {tag}", "SolarEdge", "SE10K"),
            DeviceInfo(
                bat,
                f"Battery {tag}",
                "LG",
                "RESU",
                via_device_id=inv if linked else None,
            ),
        ]
        items += [
            entity(
                f"sensor.se_{tag}_soc",
                f"Battery {tag} state of energy",
                40,
                unit="%",
                device_class="battery",
                unique_id=f"{base}_B1_state_of_energy",
                device_id=bat,
                **se,
            ),
            entity(
                f"select.se_{tag}_control",
                "Storage control mode",
                "Remote Control",
                unique_id=f"{base}_storage_control_mode",
                device_id=inv,
                attributes={"options": ["Maximize Self Consumption", "Remote Control"]},
                **se,
            ),
            entity(
                f"select.se_{tag}_policy",
                "AC charge policy",
                "Always Allowed",
                unique_id=f"{base}_ac_charge_policy",
                device_id=inv,
                **se,
            ),
            entity(
                f"select.se_{tag}_command",
                "Storage command mode",
                "Maximize Self Consumption",
                unique_id=f"{base}_storage_command_mode",
                device_id=inv,
                attributes={
                    "options": [
                        "Charge from Solar Power",
                        "Charge from Solar Power and Grid",
                        "Maximize Self Consumption",
                    ]
                },
                **se,
            ),
            entity(
                f"number.se_{tag}_reserve",
                "Backup reserve",
                10,
                unit="%",
                unique_id=f"{base}_storage_backup_reserve",
                device_id=inv,
                **se,
            ),
            entity(
                f"number.se_{tag}_charge",
                "Storage charge limit",
                5000,
                unit="W",
                unique_id=f"{base}_storage_charge_limit",
                device_id=inv,
                **se,
            ),
            entity(
                f"number.se_{tag}_timeout",
                "Storage command timeout",
                3600,
                unit="s",
                unique_id=f"{base}_storage_command_timeout",
                device_id=inv,
                **se,
            ),
        ]
    return items, devices


@pytest.mark.parametrize("linked", [True, False])
def test_two_solaredge_inverters_each_battery_its_own_levers(linked: bool) -> None:
    """By the inverter the battery is connected through, else by the serial
    at the start of the unique ids."""
    items, devices = solaredge_two(linked)
    snap = snapshot(items, devices, _energy("sensor.se_a_soc", "sensor.se_b_soc"))
    found = {b["soc_entity"]: b for b in discover(snap)["batteries"]}
    for tag in ("a", "b"):
        battery = found[f"sensor.se_{tag}_soc"]
        assert battery["adapter"] == "solaredge_modbus_multi"
        assert battery["controls"] == {
            "mode": f"select.se_{tag}_command",
            "min_soc": f"number.se_{tag}_reserve",
            "charge_power": f"number.se_{tag}_charge",
            "command_timeout": f"number.se_{tag}_timeout",
        }
        assert [p["entity_id"] for p in battery["prepare"]] == [
            f"select.se_{tag}_control",
            f"select.se_{tag}_policy",
        ]
        assert battery["unsure"] == []
        assert not any(n["code"].startswith("check.") for n in battery["notes"])


def test_two_fox_inverters_each_battery_its_own_levers() -> None:
    """Fox ESS: one device per inverter, the second with its unique id prefix
    ("foxess_modbus_" and "foxess_modbus_garage_")."""
    items = []
    devices = []
    for tag, prefix in (("a", ""), ("b", "garage_")):
        fox = {"platform": "foxess_modbus", "entry": "fox", "device_id": f"fox_{tag}"}
        devices.append(DeviceInfo(f"fox_{tag}", f"FoxESS - Modbus {tag}", "FoxESS"))
        uid = f"foxess_modbus_{prefix}"
        items += [
            entity(
                f"sensor.fox_{tag}_soc",
                "Battery SoC",
                55,
                unit="%",
                device_class="battery",
                unique_id=f"{uid}battery_soc",
                **fox,
            ),
            entity(
                f"select.fox_{tag}_work_mode",
                "Work Mode",
                "Self Use",
                unique_id=f"{uid}work_mode",
                attributes={
                    "options": [
                        "Self Use",
                        "Back-up",
                        "Force Charge",
                        "Force Discharge",
                    ]
                },
                **fox,
            ),
            entity(
                f"number.fox_{tag}_min_soc_on_grid",
                "Min SoC (On Grid)",
                10,
                unit="%",
                unique_id=f"{uid}min_soc_on_grid",
                **fox,
            ),
            entity(
                f"number.fox_{tag}_max_soc",
                "Max SoC",
                100,
                unit="%",
                unique_id=f"{uid}max_soc",
                **fox,
            ),
        ]
    snap = snapshot(items, devices, _energy("sensor.fox_a_soc", "sensor.fox_b_soc"))
    found = {b["soc_entity"]: b for b in discover(snap)["batteries"]}
    for tag in ("a", "b"):
        battery = found[f"sensor.fox_{tag}_soc"]
        assert battery["adapter"] == "foxess_modbus"
        assert battery["controls"] == {
            "mode": f"select.fox_{tag}_work_mode",
            "min_soc": f"number.fox_{tag}_min_soc_on_grid",
            "charge_target": f"number.fox_{tag}_max_soc",
        }
        assert battery["unsure"] == []


def huawei_two() -> Any:
    """Huawei: a secondary inverter connected through the primary one, a
    battery under each; the power limits sit on the inverter's device."""
    hw = {"platform": "huawei_solar", "entry": "hw"}
    items: list[EntityInfo] = []
    devices = [
        DeviceInfo("inv1", "SUN2000 primary", "Huawei", "SUN2000"),
        DeviceInfo(
            "inv2", "SUN2000 secondary", "Huawei", "SUN2000", via_device_id="inv1"
        ),
        DeviceInfo("luna1", "Batteries 1", "Huawei", "Batteries", via_device_id="inv1"),
        DeviceInfo("luna2", "Batteries 2", "Huawei", "Batteries", via_device_id="inv2"),
    ]
    for n in ("1", "2"):
        serial = f"HV23{n}"
        items += [
            entity(
                f"sensor.luna{n}_soc",
                "Battery state of capacity",
                40,
                unit="%",
                device_class="battery",
                unique_id=f"{serial}_storage_state_of_capacity",
                device_id=f"luna{n}",
                **hw,
            ),
            entity(
                f"switch.inv{n}_grid",
                "Charge from grid",
                "off",
                unique_id=f"{serial}_storage_charge_from_grid_function",
                device_id=f"inv{n}",
                **hw,
            ),
            entity(
                f"number.inv{n}_charging",
                "Maximum charging power",
                5000,
                unit="W",
                unique_id=f"{serial}_storage_maximum_charging_power",
                device_id=f"inv{n}",
                **hw,
            ),
            entity(
                f"number.inv{n}_discharging",
                "Maximum discharging power",
                5000,
                unit="W",
                unique_id=f"{serial}_storage_maximum_discharging_power",
                device_id=f"inv{n}",
                **hw,
            ),
        ]
    return snapshot(items, devices, _energy("sensor.luna1_soc", "sensor.luna2_soc"))


def test_two_huawei_inverters_each_battery_its_own_levers() -> None:
    found = {b["soc_entity"]: b for b in discover(huawei_two())["batteries"]}
    for n in ("1", "2"):
        battery = found[f"sensor.luna{n}_soc"]
        assert battery["adapter"] == "huawei_solar"
        # The secondary's battery never takes the primary's levers, though
        # its inverter is connected through that one.
        assert battery["controls"] == {
            "charge_limit": f"number.inv{n}_charging",
            "discharge_limit": f"number.inv{n}_discharging",
        }
        assert battery["steps"]["charge"][0] == {
            "entity_id": f"switch.inv{n}_grid",
            "value": True,
        }
        assert battery["steps"]["hold"][1] == {
            "entity_id": f"number.inv{n}_discharging",
            "value": 0,
        }
        assert battery["device_id"] == f"luna{n}"
        assert battery["unsure"] == []


def test_levers_joe_cannot_tell_apart_are_left_for_the_owner() -> None:
    """Sungrow over its cloud: batteries and inverters each under the plant,
    the unique ids "<plant>_<device>_<key>". Nothing ties a battery to its
    inverter: Joe assumes nothing and asks to check."""
    sg = {"platform": "sungrow", "entry": "sg"}
    items: list[EntityInfo] = []
    devices = [DeviceInfo("plant", "Plant", "Sungrow")]
    for tag in ("a", "b"):
        devices += [
            DeviceInfo(f"inv_{tag}", f"SH10RT {tag}", "Sungrow", via_device_id="plant"),
            DeviceInfo(f"bat_{tag}", f"SBR {tag}", "Sungrow", via_device_id="plant"),
        ]
        items += [
            entity(
                f"sensor.sg_{tag}_soc",
                "Battery level",
                40,
                unit="%",
                device_class="battery",
                unique_id=f"P1_bat{tag}_battery_level",
                device_id=f"bat_{tag}",
                **sg,
            ),
            entity(
                f"select.sg_{tag}_mode",
                "Battery mode",
                "Self-consumption",
                unique_id=f"P1_inv{tag}_battery_mode",
                device_id=f"inv_{tag}",
                attributes={"options": ["Self-consumption", "Force charge"]},
                **sg,
            ),
            entity(
                f"number.sg_{tag}_min",
                "SoC lower limit",
                10,
                unit="%",
                unique_id=f"P1_inv{tag}_soc_lower_limit",
                device_id=f"inv_{tag}",
                **sg,
            ),
        ]
    snap = snapshot(items, devices, _energy("sensor.sg_a_soc", "sensor.sg_b_soc"))
    found = {b["soc_entity"]: b for b in discover(snap)["batteries"]}
    for tag in ("a", "b"):
        battery = found[f"sensor.sg_{tag}_soc"]
        assert battery["controls"] == {}
        assert not battery["controllable"]
        assert {e["entity_id"] for e in battery["unsure"]} == {
            "select.sg_a_mode",
            "select.sg_b_mode",
            "number.sg_a_min",
            "number.sg_b_min",
        }
        assert battery["notes"][0] == {
            "code": "check.levers",
            "entities": battery["unsure"],
        }
        assert battery["confidence"] <= 0.6
    # One inverter alone: its levers, as ever.
    single = snapshot(
        [e for e in items if "_b_" not in e.entity_id],
        devices,
        _energy("sensor.sg_a_soc"),
    )
    battery = discover(single)["batteries"][0]
    assert battery["controls"] == {
        "mode": "select.sg_a_mode",
        "min_soc": "number.sg_a_min",
    }
    assert battery["unsure"] == []


def test_fronius_and_omnibattery_keep_their_levers() -> None:
    """Fronius' level, levers and power sit on three devices of one entry,
    Omnibattery's on the battery's device: unchanged."""
    snap = fronius_household()
    # As Home Assistant links them: storage and inverter under the logger.
    snap.devices["storage"] = DeviceInfo(
        "storage", "BYD Battery-Box Premium HV", via_device_id="flow"
    )
    snap.devices["inverter"] = DeviceInfo(
        "inverter", "Symo GEN24", via_device_id="flow"
    )
    for linked in (snap, fronius_household()):
        found = {b["integration"]: b for b in discover(linked)["batteries"]}
        fronius, venus = found["fronius"], found["omnibattery"]
        assert fronius["controls"] == {
            "min_soc": "number.inverter_minimum_reserve",
            "grid_charge": "switch.inverter_grid_charging",
            "charge_limit": "number.inverter_charge_limit",
            "charge_limit_enabled": "switch.inverter_charge_limit_enabled",
        }
        assert venus["controls"] == {
            "mode": "select.venus_force_mode",
            "charge_power": "number.venus_charge_power",
            "min_soc": "number.venus_discharge_cutoff",
        }
        for battery in (fronius, venus):
            assert battery["controllable"] and battery["unsure"] == []
            assert battery["confidence"] >= 0.85
            assert not any(n["code"].startswith("check.") for n in battery["notes"])
