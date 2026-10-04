"""Joe steers: adapters, the executor with its reset guarantee, and the test run."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any
from unittest.mock import patch

import pytest

from custom_components.energy_joe import model
from custom_components.energy_joe.control import executor as executor_module
from custom_components.energy_joe.control.adapters import (
    Desired,
    StepsAdapter,
    make_adapter,
)
from custom_components.energy_joe.control.executor import JoeExecutor
from custom_components.energy_joe.control.writes import Write
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.exceptions import HomeAssistantError
from homeassistant.util import dt as dt_util

FRONIUS = {
    "min_soc": "number.reserve",
    "grid_charge": "switch.grid_charging",
    "discharge_limit": "number.discharge_limit",
    "discharge_limit_enabled": "switch.discharge_limit",
}
VENUS = {
    "mode": "select.force_mode",
    "charge_power": "number.charge_power",
    "min_soc": "number.discharge_cutoff",
    "charge_target": "number.charge_cutoff",
}


def fronius_battery() -> dict[str, Any]:
    return {
        "id": "byd",
        "name": "BYD",
        "adapter": "fronius",
        "soc_entity": "sensor.byd_soc",
        "power": {
            "entity_id": "sensor.byd_power",
            "invert": False,
            "minus_entity_id": None,
        },
        "capacity_kwh": 10.0,
        "max_charge_w": 5000,
        "controls": FRONIUS,
    }


def venus_battery() -> dict[str, Any]:
    return {
        "id": "venus",
        "name": "Venus",
        "adapter": "omnibattery",
        "soc_entity": "sensor.venus_soc",
        "power": {
            "entity_id": "sensor.venus_power",
            "invert": False,
            "minus_entity_id": None,
        },
        "capacity_kwh": 5.12,
        "max_charge_w": 2500,
        "controls": VENUS,
    }


def install_devices(
    hass: HomeAssistant, byd_soc: float = 30, venus_soc: float = 40
) -> None:
    """Entities with ranges as the real integrations report them, and their services."""
    hass.states.async_set("sensor.byd_soc", str(byd_soc), {"unit_of_measurement": "%"})
    hass.states.async_set(
        "sensor.venus_soc", str(venus_soc), {"unit_of_measurement": "%"}
    )
    hass.states.async_set("sensor.byd_power", "0", {"unit_of_measurement": "W"})
    hass.states.async_set("sensor.venus_power", "0", {"unit_of_measurement": "W"})
    percent = {"min": 0, "max": 100, "step": 1, "unit_of_measurement": "%"}
    hass.states.async_set("number.reserve", "5", percent)
    hass.states.async_set("number.discharge_limit", "100", percent)
    hass.states.async_set("switch.grid_charging", "on")
    hass.states.async_set("switch.discharge_limit", "off")
    hass.states.async_set(
        "select.force_mode", "None", {"options": ["None", "Charge", "Discharge"]}
    )
    hass.states.async_set(
        "number.charge_power", "0", {"min": 0, "max": 2500, "step": 50}
    )
    hass.states.async_set(
        "number.discharge_cutoff", "12", {"min": 12, "max": 50, "step": 1}
    )
    hass.states.async_set(
        "number.charge_cutoff", "100", {"min": 50, "max": 100, "step": 1}
    )

    def keep(call: ServiceCall, value: str) -> None:
        entity_id = call.data["entity_id"]
        if isinstance(entity_id, list):
            entity_id = entity_id[0]
        state = hass.states.get(entity_id)
        hass.states.async_set(entity_id, value, state.attributes if state else {})

    hass.services.async_register(
        "number", "set_value", lambda call: keep(call, str(float(call.data["value"])))
    )
    hass.services.async_register(
        "select", "select_option", lambda call: keep(call, call.data["option"])
    )
    hass.services.async_register("switch", "turn_on", lambda call: keep(call, "on"))
    hass.services.async_register("switch", "turn_off", lambda call: keep(call, "off"))


def night_plan(now: datetime, kind: str = "charge", target: int = 60) -> dict[str, Any]:
    start = dt_util.start_of_local_day(now)
    return {
        "kind": kind,
        "fixed": True,
        "target": target,
        "window": {
            "start": start.isoformat(),
            "end": (start + timedelta(hours=5)).isoformat(),
        },
        "charge_from": (start + timedelta(hours=3)).isoformat(timespec="minutes"),
        "rules": {"discharge_mode": "until_target"},
        "batteries": [
            {"id": "byd", "target": target, "power_kw": 3.0},
            {"id": "venus", "target": target, "power_kw": 1.5},
        ],
    }


def configured(*batteries: dict[str, Any]) -> dict[str, Any]:
    return model.validate(
        {"version": model.CONFIG_VERSION, "batteries": [dict(b) for b in batteries]}
    )


@pytest.fixture(autouse=True)
def berlin(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


def test_fronius_holds_with_the_reserve_and_blocks_in_order(
    hass: HomeAssistant,
) -> None:
    install_devices(hass)
    adapter = make_adapter(fronius_battery())
    assert adapter.writes(hass, Desired(floor=30), 30, {}) == [
        Write("number.reserve", 30)
    ]
    assert adapter.writes(hass, Desired(charge_to=60), 30, {}) == [
        Write("switch.grid_charging", True),
        Write("number.reserve", 60),
    ]
    # The limit only works with its switch on: 0 % first, then the switch.
    assert adapter.writes(hass, Desired(floor=30, block=True), 30, {})[:2] == [
        Write("number.discharge_limit", 0),
        Write("switch.discharge_limit", True),
    ]
    saved = {"number.discharge_limit": 100.0, "switch.discharge_limit": False}
    assert adapter.writes(hass, Desired(floor=30), 30, saved)[:2] == [
        Write("switch.discharge_limit", False),
        Write("number.discharge_limit", 100.0),
    ]
    # Release undoes newest first: the switch goes off before the limit returns.
    saved = {
        "number.reserve": 5.0,
        "number.discharge_limit": 100.0,
        "switch.discharge_limit": False,
    }
    assert [w.entity_id for w in adapter.release(saved)] == [
        "switch.discharge_limit",
        "number.discharge_limit",
        "number.reserve",
    ]


def test_venus_stands_still_above_its_cutoff_range(hass: HomeAssistant) -> None:
    install_devices(hass)
    adapter = make_adapter(venus_battery())
    assert adapter.writes(hass, Desired(floor=30), 40, {}) == [
        Write("number.discharge_cutoff", 30)
    ]
    # 60 % is beyond the cutoff range (12–50): above it the battery may still
    # discharge, at the floor it is forced to charge with 0 W.
    assert adapter.writes(hass, Desired(floor=60), 70, {}) == [
        Write("number.discharge_cutoff", 50)
    ]
    assert adapter.writes(hass, Desired(floor=60), 60, {}) == [
        Write("number.charge_power", 0),
        Write("select.force_mode", "Charge"),
    ]
    assert adapter.writes(hass, Desired(charge_to=80, power_w=1500), 40, {}) == [
        Write("number.charge_cutoff", 80),
        Write("number.charge_power", 1500),
        Write("select.force_mode", "Charge"),
    ]


def test_generic_steps_take_the_values_of_the_moment(hass: HomeAssistant) -> None:
    battery = {
        "id": "x",
        "name": "X",
        "adapter": "steps",
        "soc_entity": "sensor.x_soc",
        "steps": {
            "charge": [
                {"entity_id": "input_number.x_target", "value": "{target}"},
                {"entity_id": "input_boolean.x_charge", "value": "on"},
            ],
            "hold": [{"entity_id": "input_number.x_floor", "value": "{floor}"}],
        },
    }
    adapter = StepsAdapter(battery)
    assert adapter.writes(hass, Desired(charge_to=70), 40, {}) == [
        Write("input_number.x_target", 70),
        Write("input_boolean.x_charge", "on"),
    ]
    assert adapter.writes(hass, Desired(floor=35), 40, {}) == [
        Write("input_number.x_floor", 35)
    ]
    saved = {"input_number.x_target": 0.0, "input_boolean.x_charge": False}
    assert adapter.release(saved) == [
        Write("input_boolean.x_charge", False),
        Write("input_number.x_target", 0.0),
    ]
    assert make_adapter({"adapter": "none"}) is None


def test_assigned_levers_steer_any_battery(hass: HomeAssistant) -> None:
    """A battery without a profile: a work mode with forced charging and a floor."""
    hass.states.async_set(
        "select.inv_work_mode",
        "Self Use",
        {"options": ["Self Use", "Feed-in First", "Back-up", "Force Charge"]},
    )
    hass.states.async_set(
        "number.inv_min_soc", "10", {"min": 10, "max": 100, "step": 1}
    )
    hass.states.async_set(
        "number.inv_force_charge_power",
        "0",
        {"min": 0, "max": 6, "step": 0.1, "unit_of_measurement": "kW"},
    )
    battery = {
        "id": "inv",
        "name": "Inverter",
        "adapter": "generic",
        "soc_entity": "sensor.inv_soc",
        "max_charge_w": 6000,
        "controls": {
            "mode": "select.inv_work_mode",
            "min_soc": "number.inv_min_soc",
            "charge_power": "number.inv_force_charge_power",
        },
        "mode_options": {"normal": "Self Use", "force_charge": "Force Charge"},
    }
    adapter = make_adapter(battery)
    assert adapter.missing(hass) == []
    assert adapter.writes(hass, Desired(charge_to=80, power_w=3000), 40, {}) == [
        Write("number.inv_force_charge_power", 3.0),
        Write("select.inv_work_mode", "Force Charge"),
    ]
    saved = {"number.inv_force_charge_power": 0.0, "select.inv_work_mode": "Self Use"}
    assert adapter.writes(hass, Desired(floor=40), 45, saved) == [
        Write("select.inv_work_mode", "Self Use"),
        Write("number.inv_force_charge_power", 0.0),
        Write("number.inv_min_soc", 40),
    ]
    # Without a way to charge, Joe can still hold it (no grid charging though).
    hold = make_adapter({**battery, "controls": {"min_soc": "number.inv_min_soc"}})
    assert hold.missing(hass) == []
    assert not hold.can_charge
    assert hold.writes(hass, Desired(charge_to=80), 40, {}) == [
        Write("number.inv_min_soc", 40)
    ]


async def make_executor(
    hass: HomeAssistant,
    config: dict[str, Any],
    plan: dict[str, Any] | None,
    mode: str = "live",
    tested: bool = True,
) -> tuple[JoeExecutor, dict[str, Any]]:
    holder = {"config": config, "plan": plan, "mode": mode}
    executor = JoeExecutor(
        hass,
        lambda: holder["config"],
        lambda: holder["plan"],
        lambda: holder["mode"],
        lambda: None,
    )
    await executor.async_load()
    if tested:
        for battery in config["batteries"]:
            adapter = make_adapter(battery)
            if adapter:
                executor.data["tests"][battery["id"]] = {
                    "ok": True,
                    "signature": adapter.signature,
                    "at": dt_util.now().isoformat(),
                }
    return executor, holder


async def test_a_night_from_hold_to_charge_to_release(
    hass: HomeAssistant, freezer
) -> None:
    """Hold at the current level, charge late, block the other battery, give back."""
    freezer.move_to("2026-10-04T01:00:00+02:00")
    install_devices(hass, byd_soc=30.4, venus_soc=70)
    config = configured(fronius_battery(), venus_battery())
    plan = night_plan(dt_util.now())
    executor, holder = await make_executor(hass, config, plan)

    await executor.async_check()
    # Below the target: the BYD holds where it is; the Venus may discharge to 60 %.
    assert hass.states.get("number.reserve").state == "30.0"
    assert hass.states.get("number.discharge_cutoff").state == "50.0"
    assert executor.status["batteries"]["byd"]["action"] == "hold"
    assert executor.data["saved"]["number.reserve"] == 5.0

    freezer.move_to("2026-10-04T03:10:00+02:00")
    await executor.async_check()
    # Charging time: the BYD charges to 60 %, the Venus must not feed it.
    assert hass.states.get("number.reserve").state == "60.0"
    assert hass.states.get("switch.grid_charging").state == "on"
    assert hass.states.get("select.force_mode").state == "Charge"
    assert float(hass.states.get("number.charge_power").state) == 0
    assert executor.status["batteries"]["venus"]["action"] == "block"

    hass.states.async_set("sensor.byd_soc", "60", {"unit_of_measurement": "%"})
    await executor.async_check()
    assert "byd" in executor.data["reached"]
    assert hass.states.get("select.force_mode").state == "None"

    freezer.move_to("2026-10-04T04:58:00+02:00")
    await executor.async_check()
    assert hass.states.get("number.reserve").state == "5.0"
    assert hass.states.get("select.force_mode").state == "None"
    assert hass.states.get("number.discharge_cutoff").state == "12.0"
    assert executor.data["saved"] == {}
    assert executor.status["reason"] == "done"
    kinds = [entry["kind"] for entry in executor.data["log"]]
    assert kinds[0] == "start" and "reached" in kinds and kinds[-1] == "released"


async def test_untested_batteries_are_only_watched(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-04T01:00:00+02:00")
    install_devices(hass)
    config = configured(fronius_battery())
    executor, _ = await make_executor(
        hass, config, night_plan(dt_util.now()), tested=False
    )
    await executor.async_check()
    assert hass.states.get("number.reserve").state == "5"
    assert executor.status["batteries"]["byd"] == {
        "action": "watch",
        "floor": None,
        "target": 60,
        "soc": 30.0,
        "problem": "not_tested",
    }


async def test_someone_elses_change_stays(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-10-04T01:00:00+02:00")
    install_devices(hass)
    config = configured(fronius_battery())
    executor, _ = await make_executor(hass, config, night_plan(dt_util.now()))
    await executor.async_check()
    assert hass.states.get("number.reserve").state == "30.0"
    await executor.async_check()
    hass.states.async_set(
        "number.reserve", "20", hass.states.get("number.reserve").attributes
    )
    await executor.async_check()
    assert hass.states.get("number.reserve").state == "20"
    assert "number.reserve" in executor.data["external"]
    freezer.move_to("2026-10-04T04:58:00+02:00")
    await executor.async_check()
    # Joe does not put back what someone else set.
    assert hass.states.get("number.reserve").state == "20"
    assert executor.data["saved"] == {}


async def test_values_come_back_after_a_crash(hass: HomeAssistant, freezer) -> None:
    """Started outside the window with values still set: Joe gives them back."""
    freezer.move_to("2026-10-04T09:00:00+02:00")
    install_devices(hass)
    hass.states.async_set(
        "number.reserve", "60", hass.states.get("number.reserve").attributes
    )
    config = configured(fronius_battery())
    executor, _ = await make_executor(hass, config, None, mode="simulation")
    executor.data["saved"] = {"number.reserve": 5.0}
    executor.data["written"] = {
        "number.reserve": {
            "value": 60.0,
            "at": "2026-10-04T01:00:00+02:00",
            "confirmed": True,
        }
    }
    await executor.async_start()
    assert hass.states.get("number.reserve").state == "5.0"
    assert executor.data["saved"] == {}
    await executor.async_stop()


async def test_suggest_mode_needs_a_yes(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-10-04T01:00:00+02:00")
    install_devices(hass)
    config = configured(fronius_battery())
    plan = night_plan(dt_util.now())
    executor, _ = await make_executor(hass, config, plan, mode="advisory")
    await executor.async_check()
    assert executor.status["reason"] == "unanswered"
    assert hass.states.get("number.reserve").state == "5"
    await executor.async_answer(plan["window"]["start"], True)
    assert executor.status["reason"] == "steering"
    assert hass.states.get("number.reserve").state == "30.0"


async def test_emergency_release_ends_the_night(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-10-04T01:00:00+02:00")
    install_devices(hass)
    config = configured(fronius_battery())
    executor, _ = await make_executor(hass, config, night_plan(dt_util.now()))
    await executor.async_check()
    assert hass.states.get("number.reserve").state == "30.0"
    await executor.async_release_now()
    assert hass.states.get("number.reserve").state == "5.0"
    await executor.async_check()
    assert executor.status["reason"] == "skipped"
    assert hass.states.get("number.reserve").state == "5.0"


async def test_test_run_holds_charges_and_releases(hass: HomeAssistant) -> None:
    install_devices(hass, venus_soc=40)
    config = configured(venus_battery())
    executor, _ = await make_executor(
        hass, config, None, mode="simulation", tested=False
    )
    with (
        patch.object(executor_module, "TEST_HOLD", 0),
        patch.object(executor_module, "TEST_CHARGE", 0),
        patch.object(executor_module, "TEST_RELEASE", 0),
    ):
        result = await executor.async_test("venus")
    assert result["ok"] is True
    assert [step["step"] for step in result["steps"]] == ["hold", "charge", "release"]
    assert hass.states.get("select.force_mode").state == "None"
    assert float(hass.states.get("number.charge_power").state) == 0
    assert executor.data["saved"] == {}
    assert executor.tested(config["batteries"][0])
    # Steered differently now: the test has to be done again.
    changed = dict(
        config["batteries"][0], controls={**VENUS, "discharge_power": "number.x"}
    )
    assert not executor.tested(changed)


async def test_omnibattery_takes_commands_only_in_manual_mode(
    hass: HomeAssistant, command_pauses: list[float]
) -> None:
    """Omnibattery runs its own control loop: manual mode first, off again last."""
    install_devices(hass, venus_soc=40)
    hass.states.async_set("switch.venus_manual_mode", "off")
    calls: list[tuple[str, Any]] = []

    def keep(call: ServiceCall, value: str) -> None:
        entity_id = call.data["entity_id"]
        if isinstance(entity_id, list):
            entity_id = entity_id[0]
        calls.append((entity_id, value))
        if (
            entity_id in ("select.force_mode", "number.charge_power")
            and hass.states.get("switch.venus_manual_mode").state != "on"
        ):
            raise HomeAssistantError("Venus is under automatic control")
        state = hass.states.get(entity_id)
        hass.states.async_set(entity_id, value, state.attributes if state else {})

    hass.services.async_register(
        "number", "set_value", lambda call: keep(call, str(float(call.data["value"])))
    )
    hass.services.async_register(
        "select", "select_option", lambda call: keep(call, call.data["option"])
    )
    hass.services.async_register("switch", "turn_on", lambda call: keep(call, "on"))
    hass.services.async_register("switch", "turn_off", lambda call: keep(call, "off"))
    battery = {
        **venus_battery(),
        "prepare": [{"entity_id": "switch.venus_manual_mode", "value": True}],
    }
    config = configured(battery)
    executor, _ = await make_executor(
        hass, config, None, mode="simulation", tested=False
    )
    with (
        patch.object(executor_module, "TEST_HOLD", 0),
        patch.object(executor_module, "TEST_CHARGE", 0),
        patch.object(executor_module, "TEST_RELEASE", 0),
    ):
        result = await executor.async_test("venus")
    assert result["ok"] is True, result
    # Manual mode before the first command, back off after the last one.
    assert calls[0] == ("switch.venus_manual_mode", "on")
    assert calls[-1] == ("switch.venus_manual_mode", "off")
    assert calls[-3:-1] == [
        ("select.force_mode", "None"),
        ("number.charge_power", "0.0"),
    ]
    assert hass.states.get("switch.venus_manual_mode").state == "off"
    # Time for the device: twice as long after switching to manual mode.
    assert command_pauses[0] == 2.0
    assert set(command_pauses) == {1.0, 2.0}


def omnibattery_loop(hass: HomeAssistant) -> list[tuple[str, str]]:
    """Services like Omnibattery: commands only in manual mode; back in automatic
    mode its own control loop sets force mode and power at once."""
    calls: list[tuple[str, str]] = []
    hass.states.async_set("switch.venus_manual_mode", "off")

    def keep(call: ServiceCall, value: str) -> None:
        entity_id = call.data["entity_id"]
        if isinstance(entity_id, list):
            entity_id = entity_id[0]
        manual = hass.states.get("switch.venus_manual_mode").state == "on"
        if entity_id in ("select.force_mode", "number.charge_power") and not manual:
            raise HomeAssistantError("Venus is under automatic control")
        calls.append((entity_id, value))
        state = hass.states.get(entity_id)
        hass.states.async_set(entity_id, value, state.attributes if state else {})
        if entity_id == "switch.venus_manual_mode" and value == "off":
            attrs = hass.states.get("select.force_mode").attributes
            hass.states.async_set("select.force_mode", "Discharge", attrs)
            attrs = hass.states.get("number.charge_power").attributes
            hass.states.async_set("number.charge_power", "800", attrs)

    hass.services.async_register(
        "number", "set_value", lambda call: keep(call, str(float(call.data["value"])))
    )
    hass.services.async_register(
        "select", "select_option", lambda call: keep(call, call.data["option"])
    )
    hass.services.async_register("switch", "turn_on", lambda call: keep(call, "on"))
    hass.services.async_register("switch", "turn_off", lambda call: keep(call, "off"))
    return calls


def manual_venus() -> dict[str, Any]:
    return {
        **venus_battery(),
        "prepare": [{"entity_id": "switch.venus_manual_mode", "value": True}],
    }


async def test_omnibattery_takes_mode_and_power_back(
    hass: HomeAssistant, freezer
) -> None:
    """After manual mode Omnibattery's loop owns mode and power: no restore, no error."""
    freezer.move_to("2026-10-04T01:00:00+02:00")
    install_devices(hass, byd_soc=30.4, venus_soc=70)
    calls = omnibattery_loop(hass)
    config = configured(fronius_battery(), manual_venus())
    executor, _ = await make_executor(hass, config, night_plan(dt_util.now()))
    await executor.async_check()
    freezer.move_to("2026-10-04T03:10:00+02:00")
    await executor.async_check()
    # The BYD charges, the Venus stands still in manual mode.
    assert hass.states.get("switch.venus_manual_mode").state == "on"
    assert hass.states.get("select.force_mode").state == "Charge"
    hass.states.async_set("sensor.byd_soc", "60", {"unit_of_measurement": "%"})
    await executor.async_check()
    # Back to holding: manual mode off, the loop sets its own values.
    assert hass.states.get("switch.venus_manual_mode").state == "off"
    assert hass.states.get("select.force_mode").state == "Discharge"
    before = len(calls)
    for minute in (20, 40, 59):
        freezer.move_to(f"2026-10-04T03:{minute:02d}:00+02:00")
        await executor.async_check()
    # Nothing written against the loop, nothing taken for someone else's change.
    assert [
        c
        for c in calls[before:]
        if c[0] in ("select.force_mode", "number.charge_power")
    ] == []
    assert executor.data["external"] == []
    freezer.move_to("2026-10-04T04:58:00+02:00")
    await executor.async_check()
    assert executor.data["saved"] == {}
    assert executor.data["failures"] == 0
    assert executor.status["reason"] == "done"


async def test_manual_mode_already_on_is_left_but_force_mode_is_not(
    hass: HomeAssistant, freezer
) -> None:
    """Manual mode on before the night: Joe still puts force mode back."""
    freezer.move_to("2026-10-04T01:00:00+02:00")
    install_devices(hass, byd_soc=30.4, venus_soc=70)
    omnibattery_loop(hass)
    hass.states.async_set("switch.venus_manual_mode", "on")
    config = configured(fronius_battery(), manual_venus())
    executor, _ = await make_executor(hass, config, night_plan(dt_util.now()))
    await executor.async_check()
    freezer.move_to("2026-10-04T03:10:00+02:00")
    await executor.async_check()
    assert hass.states.get("select.force_mode").state == "Charge"
    freezer.move_to("2026-10-04T04:58:00+02:00")
    await executor.async_check()
    assert hass.states.get("select.force_mode").state == "None"
    assert hass.states.get("switch.venus_manual_mode").state == "on"
    assert executor.data["saved"] == {}


async def test_manual_mode_switched_off_by_someone_else(
    hass: HomeAssistant, freezer
) -> None:
    """Someone switches manual mode off mid-night: Joe stops writing to it."""
    freezer.move_to("2026-10-04T01:00:00+02:00")
    install_devices(hass, byd_soc=30.4, venus_soc=70)
    calls = omnibattery_loop(hass)
    config = configured(fronius_battery(), manual_venus())
    executor, _ = await make_executor(hass, config, night_plan(dt_util.now()))
    freezer.move_to("2026-10-04T03:10:00+02:00")
    await executor.async_check()
    assert hass.states.get("switch.venus_manual_mode").state == "on"
    # The next look confirms what Joe set.
    freezer.move_to("2026-10-04T03:10:30+02:00")
    await executor.async_check()
    freezer.move_to("2026-10-04T03:11:00+02:00")
    await hass.services.async_call(
        "switch", "turn_off", {"entity_id": "switch.venus_manual_mode"}, blocking=True
    )
    before = len(calls)
    for minute in (12, 20, 40):
        freezer.move_to(f"2026-10-04T03:{minute:02d}:00+02:00")
        await executor.async_check()
    assert [c for c in calls[before:] if c[0] != "number.reserve"] == []


async def test_the_test_run_leaves_omnibattery_to_its_loop(hass: HomeAssistant) -> None:
    install_devices(hass, venus_soc=40)
    omnibattery_loop(hass)
    config = configured(manual_venus())
    executor, _ = await make_executor(
        hass, config, None, mode="simulation", tested=False
    )
    with (
        patch.object(executor_module, "TEST_HOLD", 0),
        patch.object(executor_module, "TEST_CHARGE", 0),
        patch.object(executor_module, "TEST_RELEASE", 0),
    ):
        result = await executor.async_test("venus")
    assert result["ok"] is True, result
    assert executor.data["saved"] == {}


async def test_a_battery_set_up_before_learns_its_manual_mode(
    hass: HomeAssistant,
) -> None:
    """A newer profile adds the manual mode to a battery found by an older one."""
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    from custom_components.energy_joe.discovery import async_profile_updates
    from homeassistant.helpers import device_registry as dr, entity_registry as er

    entry = MockConfigEntry(domain="omnibattery")
    entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=entry.entry_id, identifiers={("omnibattery", "venus")}
    )
    registry = er.async_get(hass)
    for domain, key in (
        ("sensor", "battery_soc"),
        ("switch", "battery_manual_mode"),
        ("select", "force_mode"),
    ):
        item = registry.async_get_or_create(
            domain,
            "omnibattery",
            f"10.0.0.1_502_{key}",
            config_entry=entry,
            device_id=device.id,
        )
        hass.states.async_set(item.entity_id, "off")
    # The whole system's manual mode is on another device: not this battery's.
    system = registry.async_get_or_create(
        "switch", "omnibattery", "marstek_venus_system_manual_mode", config_entry=entry
    )
    hass.states.async_set(system.entity_id, "off")
    battery = {**venus_battery(), "device_id": device.id}
    config = configured(battery)
    patch_ = await async_profile_updates(hass, config)
    manual = registry.async_get_entity_id(
        "switch", "omnibattery", "10.0.0.1_502_battery_manual_mode"
    )
    assert patch_ == {
        "batteries": {"venus": {"prepare": [{"entity_id": manual, "value": True}]}}
    }
    # What the user set stays.
    mine = model.apply_update(config, {"batteries": {"venus": {"prepare": []}}}, "user")
    assert await async_profile_updates(hass, mine) is None


async def test_entities_and_services(ready_hass: HomeAssistant) -> None:
    """Mode, skip, release and status are entities and services for automations."""
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    from custom_components.energy_joe.const import DOMAIN

    hass = ready_hass
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    runtime = hass.data[DOMAIN]

    assert hass.states.get("select.energy_joe_operating_mode").state == "simulation"
    assert hass.states.get("sensor.energy_joe_status").state == "simulation"
    await hass.services.async_call(
        "select",
        "select_option",
        {"entity_id": "select.energy_joe_operating_mode", "option": "live"},
        blocking=True,
    )
    await hass.async_block_till_done()
    assert runtime.state["mode"] == "live"
    assert hass.states.get("select.energy_joe_operating_mode").state == "live"

    await hass.services.async_call(
        DOMAIN, "set_mode", {"mode": "advisory"}, blocking=True
    )
    assert runtime.state["mode"] == "advisory"
    await hass.services.async_call(DOMAIN, "release", {}, blocking=True)
    await hass.services.async_call(
        "button", "press", {"entity_id": "button.energy_joe_release_now"}, blocking=True
    )
    kinds = [entry["kind"] for entry in runtime.executor.data["log"]]
    assert kinds.count("emergency") == 2
    assert await hass.config_entries.async_unload(entry.entry_id)


def sunny_morning_plan(now: datetime, until: str = "12:00") -> dict[str, Any]:
    """Last night's plan with a grid-friendly morning and a sunny day ahead."""
    plan = night_plan(now, kind="none", target=10)
    start = dt_util.start_of_local_day(now)
    plan["day"] = {
        "defer_until": f"{start.date().isoformat()}T{until}+02:00",
        "held_kwh": 6.0,
        "grid_first": False,
        "cost": 0.0,
    }
    plan["batteries"] = [{"id": "byd", "target": 10, "power_kw": 0, "capacity": 10.0}]
    plan["hours"] = [
        {
            "start": (start + timedelta(hours=h)).isoformat(),
            "solar": max(0.0, 5.0 - abs(h - 13) * 0.8),
            "home": 0.5,
            "window": h < 5,
        }
        for h in range(24)
    ]
    return plan


def limited_fronius() -> dict[str, Any]:
    battery = fronius_battery()
    battery["controls"] = {
        **FRONIUS,
        "charge_limit": "number.charge_limit",
        "charge_limit_enabled": "switch.charge_limit",
    }
    return battery


async def test_a_grid_friendly_morning(hass: HomeAssistant, freezer) -> None:
    """After the night the battery leaves the morning sun to the grid, then charges."""
    freezer.move_to("2026-10-04T07:00:00+02:00")
    install_devices(hass, byd_soc=40)
    percent = {"min": 0, "max": 100, "step": 1, "unit_of_measurement": "%"}
    hass.states.async_set("number.charge_limit", "100", percent)
    hass.states.async_set("switch.charge_limit", "off")
    config = configured(limited_fronius())
    plan = sunny_morning_plan(dt_util.now())
    executor, holder = await make_executor(hass, config, plan)

    await executor.async_check()
    assert hass.states.get("number.charge_limit").state == "0.0"
    assert hass.states.get("switch.charge_limit").state == "on"
    assert executor.status["reason"] == "day"
    assert executor.status["batteries"]["byd"]["action"] == "defer"
    # Midday: back as it was.
    freezer.move_to("2026-10-04T12:00:00+02:00")
    await executor.async_check()
    assert hass.states.get("number.charge_limit").state == "100.0"
    assert hass.states.get("switch.charge_limit").state == "off"
    assert executor.data["saved"] == {}
    assert executor.status["reason"] == "done"
    kinds = [entry["kind"] for entry in executor.data["log"]]
    assert "day" in kinds


async def test_the_morning_lets_go_when_the_sun_lags(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-04T10:00:00+02:00")
    install_devices(hass, byd_soc=5)
    percent = {"min": 0, "max": 100, "step": 1, "unit_of_measurement": "%"}
    hass.states.async_set("number.charge_limit", "100", percent)
    hass.states.async_set("switch.charge_limit", "off")
    config = configured(limited_fronius())
    plan = sunny_morning_plan(dt_util.now())
    # Far less sun left than the plan hoped.
    for hour in plan["hours"]:
        hour["solar"] = min(hour["solar"], 0.9)
    executor, _ = await make_executor(hass, config, plan)
    await executor.async_check()
    assert hass.states.get("number.charge_limit").state == "100"
    assert executor.data["day_released"] == plan["window"]["start"]
    # Not in the simulation, and not when switched off.
    holder_plan = sunny_morning_plan(dt_util.now())
    sim, _ = await make_executor(hass, config, holder_plan, mode="simulation")
    sim.data["day_released"] = None
    await sim.async_check()
    assert hass.states.get("number.charge_limit").state == "100"
    off = model.apply_update(config, {"rules": {"grid_friendly": False}}, "user")
    live, _ = await make_executor(hass, off, holder_plan)
    live.data["day_released"] = None
    await live.async_check()
    assert hass.states.get("number.charge_limit").state == "100"
