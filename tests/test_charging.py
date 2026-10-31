"""While a car charges: Joe counts the energy, stops at the target without a
fresh report from the car, learns its battery size and asks it for a report."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.energy_joe import model
from custom_components.energy_joe.control import charging
from custom_components.energy_joe.control.cars import CarWatcher
from custom_components.energy_joe.control.executor import JoeExecutor
from custom_components.energy_joe.plan.actions import plan_actions
from custom_components.energy_joe.plan.ev import car_need
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.util import dt as dt_util
from tests.test_actions import EV, keep_values, night_plan, window

TZ = "Europe/Berlin"


@pytest.fixture(autouse=True)
def berlin(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone(TZ))


def at(text: str) -> datetime:
    return datetime.fromisoformat(text)


def config_with(need: dict[str, Any], **car: Any) -> dict[str, Any]:
    return model.validate(
        {
            "version": model.CONFIG_VERSION,
            "actions": [
                {
                    **EV,
                    "auto": False,
                    "power_entity": "sensor.carport_power",
                    "point": {},
                }
            ],
            "cars": [{"id": "kona", "name": "Kona", "need": need, **car}],
        }
    )


# --- counting and working out --------------------------------------------------


def test_the_count_works_out_level_and_range() -> None:
    """Last night: 70 km at 17 %, 47 minutes at 10.6 kW."""
    record: dict[str, Any] = {}
    charging.begin(
        record,
        {"soc": 17.0, "range": 70.0, "odometer": 59600.0, "at": "x"},
        at("2026-10-31T04:10:00+01:00"),
    )
    moment = at("2026-10-31T04:10:00+01:00")
    for _ in range(48):
        charging.add_power(record, 10.6, moment)
        moment += timedelta(minutes=1)
    assert record["kwh"] == pytest.approx(8.3, abs=0.01)
    found = charging.estimate(record, 58.0, None)
    assert found is not None
    # 8.3 kWh less the loss into 58 kWh: 12.9 levels, km as the car shows them.
    assert found["soc"] == pytest.approx(29.9, abs=0.1)
    assert found["range"] == pytest.approx(70 + 12.9 * 70 / 17, abs=0.5)
    # Without a battery size the range grows by the planned consumption.
    assert charging.estimate(record, None, 17.9)["range"] == pytest.approx(
        70 + 8.3 * 0.9 / 17.9 * 100, abs=0.5
    )
    # A gap longer than half an hour counts nothing (HA was away).
    charging.add_power(record, 10.6, moment + timedelta(hours=2))
    assert record["kwh"] == pytest.approx(8.3, abs=0.01)


def test_a_charge_between_two_reports_tells_the_battery_size() -> None:
    record = {"base": {"soc": 17.0, "odometer": 59600.0}, "kwh": 8.46}
    assert charging.capacity_sample(
        record, {"soc": 30.0, "odometer": 59600.0}
    ) == pytest.approx(58.6, abs=0.1)
    # Too little rise, too little energy, or driven in between: nothing.
    assert charging.capacity_sample(record, {"soc": 20.0, "odometer": 59600.0}) is None
    assert (
        charging.capacity_sample(
            {**record, "kwh": 1.0}, {"soc": 30.0, "odometer": 59600.0}
        )
        is None
    )
    assert charging.capacity_sample(record, {"soc": 30.0, "odometer": 59640.0}) is None
    assert charging.learned_capacity([{"value": v} for v in (58.0, 61.0, 59.5)]) == 59.5


def test_battery_sizes_from_the_recorder() -> None:
    soc = [
        (at("2026-10-30T21:00:00+01:00"), 17.0),
        (at("2026-10-31T08:45:00+01:00"), 30.0),
    ]
    power = [
        (at("2026-10-30T20:00:00+01:00"), 0.0),
        (at("2026-10-31T04:10:00+01:00"), 10.6),
        (at("2026-10-31T04:57:00+01:00"), 0.0),
    ]
    found = charging.samples_from_history(soc, power, [])
    assert len(found) == 1
    assert found[0]["kwh"] == pytest.approx(8.3, abs=0.01)
    assert found[0]["value"] == pytest.approx(8.3 * 0.9 / 13 * 100, abs=0.2)


def test_a_learned_battery_size_lets_the_plan_work_in_levels(
    hass: HomeAssistant,
) -> None:
    hass.states.async_set("sensor.car_soc", "17", {"unit_of_measurement": "%"})
    hass.states.async_set("sensor.car_range", "70", {"unit_of_measurement": "km"})
    need = {"soc_entity": "sensor.car_soc", "range_entity": "sensor.car_range"}
    by_range = car_need(need, hass.states.get, [], {}, 12.0, False, True)
    assert by_range["target_unit"] == "km"
    by_level = car_need(
        need, hass.states.get, [], {"capacity": 58.6}, 12.0, False, True
    )
    assert by_level["target_unit"] == "%"
    assert by_level["capacity_source"] == "learned"
    assert by_level["sensor"] == "sensor.car_soc"


# --- the watcher ---------------------------------------------------------------


def car_entities(hass: HomeAssistant) -> None:
    """The car's soc and its integration's "force refresh" button on one device."""
    entry = MockConfigEntry(domain="kia_uvo")
    entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=entry.entry_id, identifiers={("kia_uvo", "kona")}
    )
    registry = er.async_get(hass)
    for domain, unique, object_id in (
        ("sensor", "soc", "car_soc"),
        ("button", "refresh", "kona_force_refresh"),
        ("button", "valet", "kona_start_valet_mode"),
    ):
        registry.async_get_or_create(
            domain,
            "kia_uvo",
            unique,
            suggested_object_id=object_id,
            device_id=device.id,
            config_entry=entry,
        )


async def test_joe_learns_the_battery_and_asks_the_car_while_it_charges(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-30T21:00:00+01:00")
    car_entities(hass)
    pressed: list[str] = []
    hass.services.async_register(
        "button", "press", lambda call: pressed.append(call.data["entity_id"])
    )
    hass.states.async_set("sensor.car_soc", "17", {"unit_of_measurement": "%"})
    hass.states.async_set("sensor.car_range", "70", {"unit_of_measurement": "km"})
    hass.states.async_set("sensor.carport_power", "0", {"unit_of_measurement": "W"})
    config = config_with(
        {
            "enabled": True,
            "soc_entity": "sensor.car_soc",
            "range_entity": "sensor.car_range",
        }
    )
    patches: list[dict[str, Any]] = []
    lines: list[tuple[str, dict[str, Any]]] = []
    watcher = CarWatcher(
        hass, lambda: config, lambda: "live", lambda: None, lambda: None
    )
    watcher.learn_capacity = patches.append
    watcher.log = lambda kind, **detail: lines.append((kind, detail))
    await watcher.async_check()
    assert watcher.data["charges"]["kona"]["base"]["soc"] == 17
    # Standing: no question to the car.
    freezer.move_to("2026-10-31T04:10:00+01:00")
    await watcher.async_check()
    assert pressed == []
    # It charges and its report is seven hours old: Joe asks once.
    hass.states.async_set("sensor.carport_power", "10600", {"unit_of_measurement": "W"})
    for _ in range(47):
        await watcher.async_check()
        freezer.tick(timedelta(minutes=1))
    await hass.async_block_till_done()
    assert pressed == ["button.kona_force_refresh"]
    # No battery size and no plan yet: the count runs, level and range unknown.
    assert watcher.estimate("ev") == {
        "soc": None,
        "range": None,
        "kwh": pytest.approx(46 * 10.6 / 60, abs=0.01),
        "reported": watcher.data["charges"]["kona"]["base"]["at"],
    }
    # The charge ended: two minutes later Joe asks again.
    hass.states.async_set("sensor.carport_power", "0", {"unit_of_measurement": "W"})
    for _ in range(4):
        await watcher.async_check()
        freezer.tick(timedelta(minutes=1))
    await hass.async_block_till_done()
    assert pressed == ["button.kona_force_refresh"] * 2
    # The car's report: what the charge tells about its battery.
    hass.states.async_set("sensor.car_soc", "30", {"unit_of_measurement": "%"})
    hass.states.async_set("sensor.car_range", "128", {"unit_of_measurement": "km"})
    await watcher.async_check()
    sample = watcher.data["capacity"]["kona"][0]
    assert sample["value"] == pytest.approx(sample["kwh"] * 0.9 / 13 * 100, abs=0.1)
    assert 56 <= sample["value"] <= 58
    assert patches[-1]["learned"]["car_models"]["kona"]["capacity"] == sample["value"]
    assert [kind for kind, _ in lines] == ["car_refresh", "car_refresh", "car_capacity"]
    assert watcher.capacity(config["cars"][0]) == (sample["value"], "learned")
    # Unplugged: the count is over.
    hass.states.async_set("binary_sensor.carport_connected", "off")
    config["actions"][0]["point"]["connected_entity"] = (
        "binary_sensor.carport_connected"
    )
    await watcher.async_check()
    assert watcher.data["charges"] == {}


async def test_no_question_to_the_car_when_turned_off_or_in_the_simulation(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-31T04:10:00+01:00")
    car_entities(hass)
    pressed: list[str] = []
    hass.services.async_register(
        "button", "press", lambda call: pressed.append(call.data["entity_id"])
    )
    hass.states.async_set("sensor.car_soc", "17", {"unit_of_measurement": "%"})
    hass.states.async_set("sensor.carport_power", "10600", {"unit_of_measurement": "W"})
    for mode, refresh in (("simulation", True), ("live", False)):
        config = config_with(
            {"enabled": True, "soc_entity": "sensor.car_soc"}, refresh=refresh
        )
        watcher = CarWatcher(
            hass,
            lambda config=config: config,
            lambda mode=mode: mode,
            lambda: None,
            lambda: None,
        )
        await watcher.async_check()
        freezer.tick(timedelta(hours=2))
        await watcher.async_check()
    await hass.async_block_till_done()
    assert pressed == []


# --- stopping at the target ------------------------------------------------------


async def test_the_night_charge_stops_at_the_range_without_a_report(
    hass: HomeAssistant, freezer
) -> None:
    """ "Tonight up to 50 km" (plus 50 km reserve) from 70 km: the car says
    nothing all night, Joe stops by what the wallbox counted."""
    freezer.move_to("2026-10-03T21:00:00+02:00")
    keep_values(hass)
    hass.states.async_set(
        "select.carport_mode", "smart", {"options": ["off", "smart", "now"]}
    )
    hass.states.async_set("binary_sensor.carport_connected", "on")
    hass.states.async_set("sensor.car_soc", "17", {"unit_of_measurement": "%"})
    hass.states.async_set("sensor.car_range", "70", {"unit_of_measurement": "km"})
    hass.states.async_set("sensor.carport_power", "0", {"unit_of_measurement": "W"})
    config = config_with(
        {
            "enabled": True,
            "soc_entity": "sensor.car_soc",
            "range_entity": "sensor.car_range",
            "capacity_kwh": 60.0,
            "reserve_km": 50,
        }
    )
    start, end = window(hass)
    tonight: dict[str, str] = {}

    def plan() -> dict[str, Any]:
        planned = plan_actions(
            config["actions"], hass.states.get, start, end, 30.0, tonight
        )
        return night_plan(start, planned)

    executor = JoeExecutor(hass, lambda: config, plan, lambda: "live", lambda: None)
    await executor.async_load()
    watcher = CarWatcher(hass, lambda: config, lambda: "live", plan, lambda: None)
    executor.cars = watcher
    await watcher.async_check()
    await executor.async_action_tonight("ev", True, 50, "km")
    tonight.update(executor.data["tonight"])
    freezer.move_to("2026-10-04T00:00:30+02:00")
    await executor.async_check()
    assert hass.states.get("select.carport_mode").state == "now"
    hass.states.async_set("sensor.carport_power", "10600", {"unit_of_measurement": "W"})
    minutes = 0
    while hass.states.get("select.carport_mode").state == "now" and minutes < 90:
        freezer.tick(timedelta(minutes=1))
        minutes += 1
        await watcher.async_check()
        await executor.async_check()
    # 30 km at about 1.1 km a minute (as the car shows km per level).
    assert 25 <= minutes <= 32
    assert executor.status["actions"]["ev"]["reason"] == "reached"
    assert hass.states.get("sensor.car_range").state == "70"
