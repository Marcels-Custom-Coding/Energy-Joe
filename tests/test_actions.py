"""Night actions: when they run, the grid budget, switching and putting back."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

import pytest

from custom_components.energy_joe import model
from custom_components.energy_joe.control.executor import JoeExecutor
from custom_components.energy_joe.discovery import discover
from custom_components.energy_joe.discovery.proposal import build_proposal
from custom_components.energy_joe.plan.actions import plan_actions, reserved_kw
from custom_components.energy_joe.plan.planner import (
    Battery,
    Hour,
    PlanInput,
    Prices,
    simulate,
)
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.util import dt as dt_util
from tests.snapshots import fronius_household

EV = {
    "id": "ev",
    "name": "Carport",
    "kind": "switch",
    "entity_id": "select.carport_mode",
    "on_value": "now",
    "reset": "previous",
    "lead_min": 3,
    "auto": True,
    "forecast_below_kwh": 15.0,
    "conditions": [
        {"entity_id": "binary_sensor.carport_connected", "op": "eq", "value": True}
    ],
    "power_kw": 11.0,
}
HOT_WATER = {
    "id": "hw",
    "name": "Warmwasser",
    "kind": "target",
    "entity_id": "input_boolean.hot_water_boost",
    "on_value": "on",
    "reset": "fixed",
    "reset_value": "off",
    "auto": True,
    "forecast_below_kwh": 20.0,
    "sensor_entity": "sensor.hot_water_temperature",
    "comfort": 45.0,
    "maximum": 62.0,
    "buffer": 3.0,
    "power_kw": 0.5,
}


@pytest.fixture(autouse=True)
def berlin(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


def window(hass: HomeAssistant) -> tuple[datetime, datetime]:
    start = dt_util.start_of_local_day(
        datetime(2026, 10, 4, tzinfo=dt_util.get_default_time_zone())
    )
    return start, start + timedelta(hours=5)


def action(**changes: Any) -> dict[str, Any]:
    return model.validate(
        {"version": model.CONFIG_VERSION, "actions": [{**EV, **changes}]}
    )["actions"][0]


def test_the_car_charges_when_little_sun_comes(hass: HomeAssistant) -> None:
    start, end = window(hass)
    hass.states.async_set("binary_sensor.carport_connected", "on")
    plan = plan_actions([action()], hass.states.get, start, end, 8.0, {})
    assert plan[0]["run"] is True
    assert plan[0]["reasons"] == ["little_sun"]
    assert plan[0]["end"] == (end - timedelta(minutes=3)).isoformat(timespec="minutes")
    assert plan[0]["energy_kwh"] == round(11 * (5 - 0.05), 2)
    # Enough sun tomorrow, or the car not plugged in: not tonight.
    assert plan_actions([action()], hass.states.get, start, end, 30.0, {})[0][
        "reasons"
    ] == ["enough_sun"]
    hass.states.async_set("binary_sensor.carport_connected", "off")
    assert plan_actions([action()], hass.states.get, start, end, 8.0, {})[0][
        "reasons"
    ] == ["conditions"]
    # The switch "tonight" wins over everything.
    manual = plan_actions(
        [action()], hass.states.get, start, end, 30.0, {"ev": start.isoformat()}
    )
    assert manual[0]["run"] is True and manual[0]["reasons"] == ["tonight"]


def test_hot_water_starts_as_late_as_it_can(hass: HomeAssistant) -> None:
    start, end = window(hass)
    hot_water = model.validate(
        {"version": model.CONFIG_VERSION, "actions": [HOT_WATER]}
    )["actions"][0]
    hass.states.async_set("sensor.hot_water_temperature", "42")
    plan = plan_actions([hot_water], hass.states.get, start, end, 10.0, {})[0]
    # 45 + 10 (until learned) + 3 = 58 °C; 16 K at 8 K/h take 2 h, plus 15 min.
    assert plan["target"] == 58.0
    assert plan["start"] == (end - timedelta(hours=2, minutes=15)).isoformat(
        timespec="minutes"
    )
    hass.states.async_set("sensor.hot_water_temperature", "59")
    warm = plan_actions([hot_water], hass.states.get, start, end, 10.0, {})[0]
    assert warm["run"] is False and "warm_enough" in warm["reasons"]


def test_running_actions_leave_the_batteries_less_grid(hass: HomeAssistant) -> None:
    start, end = window(hass)
    hass.states.async_set("binary_sensor.carport_connected", "on")
    actions = plan_actions([action()], hass.states.get, start, end, 8.0, {})
    hours = [Hour(start + timedelta(hours=h), 0.0, 0.5, h < 5) for h in range(8)]
    reserved = [
        reserved_kw(actions, h.start, h.start + timedelta(hours=1)) for h in hours
    ]
    assert reserved[0] == 11.0 and reserved[5] == 0.0
    battery = Battery("b", "B", 10.0, 20.0, 5.0, 5.0)
    base = PlanInput(
        now=start - timedelta(minutes=15),
        window_start=start,
        window_end=end,
        hours=hours,
        batteries=[battery],
        prices=Prices(0.18, 0.29, 0.06),
        grid_limit_kw=12.0,
    )
    alone = simulate(base, 10.0)
    with_car = simulate(
        PlanInput(**{**base.__dict__, "reserved": reserved})
        if False
        else _with(base, reserved),
        10.0,
    )
    # 12 kW limit - 0.5 kW home - 11 kW car leaves 0.5 kW per hour for the battery,
    # a little more in the last hour, which the car leaves 3 minutes early.
    assert with_car.grid_charge < alone.grid_charge
    assert with_car.grid_charge == pytest.approx(
        0.5 * 4 + (12 - 0.5 - 11 * 57 / 60), abs=0.01
    )


def _with(inp: PlanInput, reserved: list[float]) -> PlanInput:
    from dataclasses import replace

    return replace(inp, reserved=reserved)


def keep_values(hass: HomeAssistant) -> None:
    def keep(call: ServiceCall, value: str) -> None:
        entity_id = call.data["entity_id"]
        state = hass.states.get(entity_id)
        hass.states.async_set(entity_id, value, state.attributes if state else {})

    hass.services.async_register(
        "select", "select_option", lambda call: keep(call, call.data["option"])
    )
    hass.services.async_register(
        "input_boolean", "turn_on", lambda call: keep(call, "on")
    )
    hass.services.async_register(
        "input_boolean", "turn_off", lambda call: keep(call, "off")
    )


def night_plan(start: datetime, actions: list[dict[str, Any]]) -> dict[str, Any]:
    return {
        "kind": "none",
        "fixed": True,
        "target": 20,
        "window": {
            "start": start.isoformat(),
            "end": (start + timedelta(hours=5)).isoformat(),
        },
        "rules": {"discharge_mode": "until_target"},
        "batteries": [],
        "actions": actions,
    }


async def test_the_car_switches_now_and_back(hass: HomeAssistant, freezer) -> None:
    """evcc to "now" in the window, back to what it was 3 minutes before its end."""
    freezer.move_to("2026-10-04T00:10:00+02:00")
    keep_values(hass)
    hass.states.async_set(
        "select.carport_mode", "smart", {"options": ["off", "smart", "now"]}
    )
    hass.states.async_set("binary_sensor.carport_connected", "on")
    config = model.validate({"version": model.CONFIG_VERSION, "actions": [EV]})
    start, end = window(hass)
    planned = plan_actions(config["actions"], hass.states.get, start, end, 8.0, {})
    executor = JoeExecutor(
        hass,
        lambda: config,
        lambda: night_plan(start, planned),
        lambda: "live",
        lambda: None,
    )
    await executor.async_load()
    await executor.async_check()
    assert hass.states.get("select.carport_mode").state == "now"
    assert executor.status["actions"]["ev"]["on"] is True
    freezer.move_to("2026-10-04T04:57:30+02:00")
    await executor.async_check()
    assert hass.states.get("select.carport_mode").state == "smart"
    assert executor.data["saved"] == {}
    kinds = [entry["kind"] for entry in executor.data["log"]]
    assert "action_on" in kinds and kinds[-1] in ("action_off", "released")


async def test_hot_water_stops_at_its_target(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-10-04T03:00:00+02:00")
    keep_values(hass)
    hass.states.async_set("input_boolean.hot_water_boost", "off")
    hass.states.async_set("sensor.hot_water_temperature", "42")
    config = model.validate({"version": model.CONFIG_VERSION, "actions": [HOT_WATER]})
    start, end = window(hass)
    planned = plan_actions(config["actions"], hass.states.get, start, end, 10.0, {})
    executor = JoeExecutor(
        hass,
        lambda: config,
        lambda: night_plan(start, planned),
        lambda: "live",
        lambda: None,
    )
    await executor.async_load()
    await executor.async_check()
    assert hass.states.get("input_boolean.hot_water_boost").state == "on"
    hass.states.async_set("sensor.hot_water_temperature", "58.2")
    await executor.async_check()
    assert hass.states.get("input_boolean.hot_water_boost").state == "off"
    assert executor.status["actions"]["hw"]["reason"] == "reached"
    # Once reached, it stays off for the rest of the night.
    hass.states.async_set("sensor.hot_water_temperature", "55")
    await executor.async_check()
    assert hass.states.get("input_boolean.hot_water_boost").state == "off"


async def test_switching_the_car_off_by_hand_is_respected(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-04T00:10:00+02:00")
    keep_values(hass)
    hass.states.async_set(
        "select.carport_mode", "smart", {"options": ["off", "smart", "now"]}
    )
    hass.states.async_set("binary_sensor.carport_connected", "on")
    config = model.validate({"version": model.CONFIG_VERSION, "actions": [EV]})
    start, end = window(hass)
    planned = plan_actions(config["actions"], hass.states.get, start, end, 8.0, {})
    executor = JoeExecutor(
        hass,
        lambda: config,
        lambda: night_plan(start, planned),
        lambda: "live",
        lambda: None,
    )
    await executor.async_load()
    await executor.async_check()
    await executor.async_check()
    hass.states.async_set(
        "select.carport_mode", "off", {"options": ["off", "smart", "now"]}
    )
    await executor.async_check()
    assert hass.states.get("select.carport_mode").state == "off"
    assert "select.carport_mode" in executor.data["external"]
    freezer.move_to("2026-10-04T04:58:00+02:00")
    await executor.async_check()
    assert hass.states.get("select.carport_mode").state == "off"


def test_discovery_proposes_the_car() -> None:
    result = discover(fronius_household())
    proposal = build_proposal(result)
    actions = proposal["actions"]
    assert actions[0]["entity_id"] == "select.evcc_carport_mode"
    assert actions[0]["on_value"] == "now"
    assert actions[0]["conditions"] == [
        {"entity_id": "binary_sensor.evcc_carport_connected", "op": "eq", "value": True}
    ]
    config = model.adopt_proposal(model.default_config(), proposal)
    assert config["actions"][0]["lead_min"] == 3


async def test_just_charge_to_a_level(hass: HomeAssistant, freezer) -> None:
    """ "Just charge to 80 %": now, also in the simulation, and back once there."""
    freezer.move_to("2026-10-04T15:00:00+02:00")
    keep_values(hass)
    hass.states.async_set(
        "select.carport_mode", "smart", {"options": ["off", "smart", "now"]}
    )
    hass.states.async_set("sensor.car_soc", "41", {"unit_of_measurement": "%"})
    car = {**EV, "need": {"soc_entity": "sensor.car_soc"}}
    config = model.validate({"version": model.CONFIG_VERSION, "actions": [car]})
    executor = JoeExecutor(
        hass, lambda: config, lambda: None, lambda: "simulation", lambda: None
    )
    await executor.async_load()
    await executor.async_boost("ev", 80, "%")
    assert hass.states.get("select.carport_mode").state == "now"
    status = executor.status["actions"]["ev"]
    assert status["reason"] == "boost" and status["on"] is True
    assert executor.view["boost"]["ev"]["target"] == 80
    # Still charging a while later.
    hass.states.async_set("sensor.car_soc", "60", {"unit_of_measurement": "%"})
    await executor.async_check()
    assert hass.states.get("select.carport_mode").state == "now"
    hass.states.async_set("sensor.car_soc", "80", {"unit_of_measurement": "%"})
    await executor.async_check()
    assert hass.states.get("select.carport_mode").state == "smart"
    assert executor.data["boost"] == {} and executor.data["saved"] == {}
    kinds = [entry["kind"] for entry in executor.data["log"]]
    assert "boost" in kinds and "boost_end" in kinds


async def test_just_charge_to_a_range_with_reserve(
    hass: HomeAssistant, freezer
) -> None:
    """A range target adds the reserve; stopping by hand puts the mode back."""
    freezer.move_to("2026-10-04T15:00:00+02:00")
    keep_values(hass)
    hass.states.async_set(
        "select.carport_mode", "smart", {"options": ["off", "smart", "now"]}
    )
    hass.states.async_set("sensor.car_range", "120", {"unit_of_measurement": "km"})
    car = {**EV, "need": {"range_entity": "sensor.car_range", "reserve_km": 40}}
    config = model.validate({"version": model.CONFIG_VERSION, "actions": [car]})
    executor = JoeExecutor(
        hass, lambda: config, lambda: None, lambda: "live", lambda: None
    )
    await executor.async_load()
    with pytest.raises(ValueError):
        await executor.async_boost("ev", 80, "%")
    await executor.async_boost("ev", 200, "km")
    assert executor.data["boost"]["ev"]["target"] == 240
    assert hass.states.get("select.carport_mode").state == "now"
    await executor.async_boost("ev", None)
    assert hass.states.get("select.carport_mode").state == "smart"
    assert executor.data["saved"] == {}
    # A boost ends after a day at the latest.
    await executor.async_boost("ev", 200, "km")
    freezer.move_to("2026-10-05T15:01:00+02:00")
    await executor.async_check()
    assert executor.data["boost"] == {}
    assert hass.states.get("select.carport_mode").state == "smart"


async def test_charging_by_hand_wins_over_the_night_plan(
    hass: HomeAssistant, freezer
) -> None:
    """The plan's own charge ends with the window: the car charges on to its level."""
    freezer.move_to("2026-10-04T00:10:00+02:00")
    keep_values(hass)
    hass.states.async_set(
        "select.carport_mode", "smart", {"options": ["off", "smart", "now"]}
    )
    hass.states.async_set("binary_sensor.carport_connected", "on")
    hass.states.async_set("sensor.car_soc", "41", {"unit_of_measurement": "%"})
    car = {**EV, "need": {"soc_entity": "sensor.car_soc"}}
    config = model.validate({"version": model.CONFIG_VERSION, "actions": [car]})
    start, end = window(hass)
    planned = plan_actions(config["actions"], hass.states.get, start, end, 8.0, {})
    assert planned[0]["run"] is True
    executor = JoeExecutor(
        hass,
        lambda: config,
        lambda: night_plan(start, planned),
        lambda: "live",
        lambda: None,
    )
    await executor.async_load()
    await executor.async_boost("ev", 90, "%")
    await executor.async_check()
    assert hass.states.get("select.carport_mode").state == "now"
    assert executor.status["steering"] is True
    assert executor.status["actions"]["ev"]["reason"] == "boost"
    # After the window it still charges until the level is there.
    freezer.move_to("2026-10-04T06:00:00+02:00")
    await executor.async_check()
    assert hass.states.get("select.carport_mode").state == "now"
    hass.states.async_set("sensor.car_soc", "90", {"unit_of_measurement": "%"})
    await executor.async_check()
    assert hass.states.get("select.carport_mode").state == "smart"
