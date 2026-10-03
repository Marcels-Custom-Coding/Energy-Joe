"""Profiles of battery integrations: inverted levels, prepare, durations, service steps."""

from __future__ import annotations

from datetime import timedelta
from typing import Any

import pytest

from custom_components.energy_joe import model
from custom_components.energy_joe.control.adapters import Desired, make_adapter
from custom_components.energy_joe.control.executor import JoeExecutor
from custom_components.energy_joe.control.writes import Write
from custom_components.energy_joe.discovery import discover
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.util import dt as dt_util
from tests.snapshots import entity, snapshot


@pytest.fixture(autouse=True)
def berlin(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


def keep_values(hass: HomeAssistant) -> None:
    """number/select/switch services that store the value in the state."""

    def keep(call: ServiceCall, value: str) -> None:
        entity_id = call.data["entity_id"]
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


def test_goodwe_depth_of_discharge_runs_the_other_way(hass: HomeAssistant) -> None:
    hass.states.async_set("number.gw_dod", "90", {"min": 0, "max": 99, "step": 1})
    hass.states.async_set(
        "select.gw_mode",
        "general",
        {
            "options": [
                "general",
                "off_grid",
                "backup",
                "eco",
                "eco_charge",
                "eco_discharge",
            ]
        },
    )
    battery = {
        "id": "gw",
        "name": "GoodWe",
        "adapter": "goodwe",
        "controls": {"min_soc": "number.gw_dod", "mode": "select.gw_mode"},
        "mode_options": {"normal": "general", "force_charge": "eco_charge"},
    }
    adapter = make_adapter(battery)
    # A floor of 30 % is a depth of discharge of 70 %.
    assert adapter.writes(hass, Desired(floor=30), 40, {}) == [
        Write("number.gw_dod", 70)
    ]
    assert adapter.writes(hass, Desired(charge_to=80), 40, {}) == [
        Write("select.gw_mode", "eco_charge")
    ]


def test_solaredge_needs_remote_control_and_a_long_command(hass: HomeAssistant) -> None:
    hass.states.async_set(
        "select.se_control",
        "Maximize Self Consumption",
        {"options": ["Disabled", "Maximize Self Consumption", "Remote Control"]},
    )
    hass.states.async_set(
        "select.se_policy", "Disabled", {"options": ["Disabled", "Always Allowed"]}
    )
    hass.states.async_set(
        "select.se_command",
        "Maximize Self Consumption",
        {
            "options": [
                "Solar Power Only (Off)",
                "Charge from Solar Power",
                "Charge from Solar Power and Grid",
                "Maximize Self Consumption",
            ]
        },
    )
    hass.states.async_set(
        "number.se_timeout",
        "3600",
        {"min": 0, "max": 86400, "unit_of_measurement": "s"},
    )
    hass.states.async_set(
        "number.se_charge",
        "5000",
        {"min": 0, "max": 1000000, "unit_of_measurement": "W"},
    )
    battery = {
        "id": "se",
        "name": "SolarEdge",
        "adapter": "solaredge_modbus_multi",
        "controls": {
            "mode": "select.se_command",
            "charge_power": "number.se_charge",
            "command_timeout": "number.se_timeout",
        },
        "mode_options": {
            "normal": "Maximize Self Consumption",
            "force_charge": "Charge from Solar Power and Grid",
            "hold": "Charge from Solar Power",
        },
        "prepare": [
            {"entity_id": "select.se_control", "value": "Remote Control"},
            {"entity_id": "select.se_policy", "value": "Always Allowed"},
        ],
    }
    adapter = make_adapter(battery)
    five_hours = 5 * 3600
    assert adapter.writes(hass, Desired(floor=40, span_s=five_hours), 40, {}) == [
        Write("select.se_control", "Remote Control"),
        Write("select.se_policy", "Always Allowed"),
        Write("number.se_timeout", five_hours + 3600),
        Write("select.se_command", "Charge from Solar Power"),
    ]
    assert adapter.writes(
        hass, Desired(charge_to=80, power_w=3000, span_s=five_hours), 40, {}
    ) == [
        Write("select.se_control", "Remote Control"),
        Write("select.se_policy", "Always Allowed"),
        Write("number.se_charge", 3000),
        Write("number.se_timeout", five_hours + 3600),
        Write("select.se_command", "Charge from Solar Power and Grid"),
    ]
    saved = {
        "select.se_control": "Maximize Self Consumption",
        "select.se_policy": "Disabled",
        "select.se_command": "Maximize Self Consumption",
        "number.se_timeout": 3600.0,
    }
    # The command first, then the switches it needed.
    assert [w.entity_id for w in adapter.release(saved)] == [
        "number.se_timeout",
        "select.se_command",
        "select.se_policy",
        "select.se_control",
    ]


def test_select_switches_take_their_option(hass: HomeAssistant) -> None:
    hass.states.async_set(
        "select.gw_ac", "Disabled", {"options": ["Disabled", "Enabled"]}
    )
    hass.states.async_set("number.gw_stop", "100", {"min": 10, "max": 100})
    battery = {
        "id": "gr",
        "name": "Growatt",
        "adapter": "growatt_modbus",
        "controls": {"grid_charge": "select.gw_ac", "charge_target": "number.gw_stop"},
    }
    adapter = make_adapter(battery)
    assert adapter.writes(hass, Desired(charge_to=70), 40, {}) == [
        Write("number.gw_stop", 70),
        Write("select.gw_ac", "Enabled"),
    ]


async def test_huawei_is_charged_by_a_service_once(
    hass: HomeAssistant, freezer
) -> None:
    """Service calls are made once per state; the release stops the forcible charge."""
    freezer.move_to("2026-10-04T03:30:00+02:00")
    keep_values(hass)
    calls: list[tuple[str, dict[str, Any]]] = []
    for service in ("forcible_charge_soc", "stop_forcible_charge"):
        hass.services.async_register(
            "huawei_solar",
            service,
            lambda call, service=service: calls.append((service, dict(call.data))),
        )
    hass.states.async_set("sensor.luna_soc", "30", {"unit_of_measurement": "%"})
    hass.states.async_set("number.luna_discharge", "5000", {"min": 0, "max": 5000})
    battery = {
        "id": "luna",
        "name": "LUNA2000",
        "adapter": "huawei_solar",
        "soc_entity": "sensor.luna_soc",
        "device_id": "battery-device",
        "capacity_kwh": 10,
        "steps": {
            "charge": [
                {
                    "service": "huawei_solar.forcible_charge_soc",
                    "data": {
                        "device_id": "{device}",
                        "target_soc": "{target}",
                        "power": "{power}",
                    },
                }
            ],
            "hold": [{"entity_id": "number.luna_discharge", "value": 0}],
            "release": [
                {
                    "service": "huawei_solar.stop_forcible_charge",
                    "data": {"device_id": "{device}"},
                }
            ],
        },
    }
    config = model.validate({"version": model.CONFIG_VERSION, "batteries": [battery]})
    start = dt_util.start_of_local_day(dt_util.now())
    plan = {
        "kind": "charge",
        "fixed": True,
        "target": 60,
        "window": {
            "start": start.isoformat(),
            "end": (start + timedelta(hours=5)).isoformat(),
        },
        "charge_from": (start + timedelta(hours=3)).isoformat(timespec="minutes"),
        "rules": {"discharge_mode": "until_target"},
        "batteries": [{"id": "luna", "target": 60, "power_kw": 2.5}],
    }
    holder = {"plan": plan}
    executor = JoeExecutor(
        hass, lambda: config, lambda: holder["plan"], lambda: "live", lambda: None
    )
    await executor.async_load()
    adapter = make_adapter(config["batteries"][0])
    executor.data["tests"]["luna"] = {
        "ok": True,
        "signature": adapter.signature,
        "at": dt_util.now().isoformat(),
    }
    await executor.async_check()
    await executor.async_check()
    assert calls == [
        (
            "forcible_charge_soc",
            {"device_id": "battery-device", "target_soc": 60, "power": 2500},
        )
    ]
    assert executor.data["active"] == ["luna"]
    freezer.move_to("2026-10-04T04:58:00+02:00")
    await executor.async_check()
    assert calls[-1] == ("stop_forcible_charge", {"device_id": "battery-device"})
    assert executor.data["active"] == []


def test_profile_keys_are_matched_exactly() -> None:
    """Fox ESS: "max_soc" is not "force_charge_max_soc"; GoodWe keeps its key in the middle."""
    fox = {"platform": "foxess_modbus", "entry": "fox", "device_id": "fox"}
    gw = {"platform": "goodwe", "entry": "gw", "device_id": "gw"}
    snap = snapshot(
        [
            entity(
                "sensor.fox_soc",
                "Battery SoC",
                55,
                unit="%",
                device_class="battery",
                unique_id="fox_battery_soc",
                **fox,
            ),
            entity(
                "select.fox_work_mode",
                "Work Mode",
                "Self Use",
                unique_id="fox_work_mode",
                attributes={
                    "options": [
                        "Self Use",
                        "Feed-in First",
                        "Back-up",
                        "Force Charge",
                        "Force Discharge",
                    ]
                },
                **fox,
            ),
            entity(
                "number.fox_force_charge_max_soc",
                "Force Charge Max SoC",
                100,
                unit="%",
                unique_id="fox_force_charge_max_soc",
                **fox,
            ),
            entity(
                "number.fox_max_soc",
                "Max SoC",
                100,
                unit="%",
                unique_id="fox_max_soc",
                **fox,
            ),
            entity(
                "number.fox_min_soc_on_grid",
                "Min SoC (On Grid)",
                10,
                unit="%",
                unique_id="fox_min_soc_on_grid",
                **fox,
            ),
            entity(
                "number.fox_force_charge_power",
                "Force Charge Power",
                0,
                unit="kW",
                unique_id="fox_force_charge_power",
                **fox,
            ),
            entity(
                "sensor.gw_soc",
                "Battery State of Charge",
                40,
                unit="%",
                device_class="battery",
                unique_id="gw_battery_soc",
                **gw,
            ),
            entity(
                "number.gw_dod",
                "Depth of discharge (on-grid)",
                90,
                unit="%",
                unique_id="goodwe-battery_discharge_depth-SN1",
                **gw,
            ),
            entity(
                "select.gw_mode",
                "Inverter operation mode",
                "general",
                unique_id="goodwe-operation_mode-SN1",
                attributes={
                    "options": [
                        "general",
                        "backup",
                        "eco",
                        "eco_charge",
                        "eco_discharge",
                    ]
                },
                **gw,
            ),
        ]
    )
    # Neither integration reports roles Joe reads, so add the SoC roles for the test.
    from custom_components.energy_joe.discovery import knowledge as kb

    kb.INTEGRATION_ROLES.setdefault("foxess_modbus", {})["battery_soc"] = kb.KeyRole(
        "battery_soc"
    )
    kb.INTEGRATION_ROLES.setdefault("goodwe", {})["battery_soc"] = kb.KeyRole(
        "battery_soc"
    )
    try:
        batteries = {b["integration"]: b for b in discover(snap)["batteries"]}
    finally:
        del kb.INTEGRATION_ROLES["foxess_modbus"]
        del kb.INTEGRATION_ROLES["goodwe"]
    fox_battery = batteries["foxess_modbus"]
    assert fox_battery["adapter"] == "foxess_modbus"
    assert fox_battery["controls"]["charge_target"] == "number.fox_max_soc"
    assert fox_battery["mode_options"] == {
        "normal": "Self Use",
        "force_charge": "Force Charge",
        "force_discharge": "Force Discharge",
        "hold": "Back-up",
    }
    goodwe = batteries["goodwe"]
    assert goodwe["adapter"] == "goodwe"
    assert goodwe["controls"] == {"min_soc": "number.gw_dod", "mode": "select.gw_mode"}
