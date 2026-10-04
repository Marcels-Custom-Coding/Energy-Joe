"""Charging a car by need: tomorrow's trips, a reserve and the weather."""

from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import Any

import pytest

from custom_components.energy_joe import model
from custom_components.energy_joe.discovery import discover
from custom_components.energy_joe.learn.models import car_days, car_model
from custom_components.energy_joe.plan.actions import plan_actions
from custom_components.energy_joe.plan.ev import (
    car_need,
    consumption,
    temperature_factor,
)
from custom_components.energy_joe.plan.trips import PlaceStore, async_trips, is_place
from homeassistant.core import HomeAssistant, ServiceCall, SupportsResponse
from homeassistant.util import dt as dt_util
from tests.snapshots import entity, snapshot


@pytest.fixture(autouse=True)
def berlin(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


def need(**changes: Any) -> dict[str, Any]:
    action = model.validate(
        {
            "version": model.CONFIG_VERSION,
            "actions": [
                {
                    "id": "ev",
                    "name": "Carport",
                    "kind": "switch",
                    "entity_id": "select.carport_mode",
                    "on_value": "now",
                    "power_kw": 11.0,
                    "need": {
                        "enabled": True,
                        "soc_entity": "sensor.car_soc",
                        "range_entity": "sensor.car_range",
                        "capacity_kwh": 60.0,
                        **changes,
                    },
                }
            ],
        }
    )["actions"][0]
    return action


def test_colder_and_wetter_needs_more() -> None:
    assert temperature_factor(20) == 1.0
    assert temperature_factor(0) == pytest.approx(1.28)
    assert temperature_factor(2.5) == pytest.approx(1.24)
    assert temperature_factor(-40) == 1.8
    base = need()["need"]
    assert consumption(base, None, None, 0.0, False) == (23.0, "default")
    assert consumption(base, None, None, 20.0, True) == (19.8, "default")
    # What Joe learned from the car wins, with its own cold behaviour.
    learned = {"consumption": 16.0, "cold": 0.4}
    assert consumption(base, learned, None, 5.0, False) == (20.0, "learned")
    # The car's own long-term average covers all seasons.
    assert consumption(base, None, 17.0, 20.0, False)[1] == "car"
    assert consumption({**base, "consumption": 15.0}, learned, None, 20.0, False) == (
        15.0,
        "user",
    )


def test_what_tomorrow_needs(hass: HomeAssistant) -> None:
    """60 km to an appointment and back, 50 km reserve, 0 °C: 110 km at 23 kWh/100 km."""
    hass.states.async_set("sensor.car_soc", "30", {"unit_of_measurement": "%"})
    hass.states.async_set("sensor.car_range", "120", {"unit_of_measurement": "mi"})
    trips = [
        {
            "start": "2026-10-05T09:00:00+02:00",
            "location": "Kunde",
            "km": 60.0,
            "minutes": 35,
        }
    ]
    found = car_need(need()["need"], hass.states.get, trips, None, 0.0, False, True)
    assert found["known"] is True
    assert found["needed_km"] == 110.0
    assert found["missing_kwh"] == pytest.approx(110 * 23.0 / 100 - 18.0, abs=0.01)
    assert found["wall_kwh"] == pytest.approx(found["missing_kwh"] / 0.9, abs=0.01)
    assert found["target"] == 43 and found["target_unit"] == "%"
    assert found["departure"] == "2026-10-05T08:25+02:00"
    # Only the range (here in miles): the kilometres missing.
    by_range = car_need(
        need(capacity_kwh=None, soc_entity=None)["need"],
        hass.states.get,
        trips,
        None,
        0.0,
        False,
        True,
    )
    assert by_range["have_km"] == pytest.approx(193.1, abs=0.1)
    assert by_range["missing_kwh"] == 0.0 and by_range["target_unit"] == "km"
    # Nothing known about the car: Joe cannot tell.
    unknown = car_need(
        need(capacity_kwh=None, soc_entity=None, range_entity=None)["need"],
        hass.states.get,
        [],
        None,
        10.0,
        False,
        True,
    )
    assert unknown["known"] is False
    # The usual distance counts when there are no trips (learned per day type).
    usual = car_need(
        need()["need"],
        hass.states.get,
        [],
        {"workday_km": 40, "day_off_km": 10},
        20.0,
        False,
        True,
    )
    assert usual["needed_km"] == 90.0


def test_the_car_charges_only_what_it_needs(hass: HomeAssistant) -> None:
    start = dt_util.start_of_local_day(date(2026, 10, 5))
    end = start + timedelta(hours=5)
    action = need()
    base = {
        "known": True,
        "missing_kwh": 7.3,
        "wall_kwh": 8.1,
        "target": 43,
        "sensor": "sensor.car_soc",
        "departure": "2026-10-05T08:25+02:00",
    }
    plan = plan_actions(
        [action], hass.states.get, start, end, 8.0, {}, {}, {"ev": base}
    )[0]
    assert plan["run"] is True and plan["reasons"] == ["need"]
    # 8.1 kWh at 11 kW take 44 minutes, plus a quarter of an hour before the end.
    assert plan["start"] == (end - timedelta(hours=8.1 / 11, minutes=15)).isoformat(
        timespec="minutes"
    )
    assert plan["target"] == 43 and plan["sensor"] == "sensor.car_soc"
    enough = plan_actions(
        [action],
        hass.states.get,
        start,
        end,
        8.0,
        {},
        {},
        {"ev": {**base, "missing_kwh": 0.0}},
    )[0]
    assert enough["run"] is False and enough["reasons"] == ["enough_range"]
    # A sunny day and the first trip after noon: the sun charges before.
    later = {**base, "departure": "2026-10-05T14:00+02:00"}
    action_sun = {**action, "forecast_below_kwh": 15.0}
    sunny = plan_actions(
        [action_sun], hass.states.get, start, end, 30.0, {}, {}, {"ev": later}
    )[0]
    assert sunny["reasons"] == ["sun_before_trip"]
    # "Tonight" by hand: the whole window, no target.
    manual = plan_actions(
        [action],
        hass.states.get,
        start,
        end,
        8.0,
        {"ev": start.isoformat()},
        {},
        {"ev": base},
    )[0]
    assert manual["run"] is True and "target" not in manual
    # Car unknown: as before, by the sun, with a note.
    unknown = plan_actions(
        [action], hass.states.get, start, end, 8.0, {}, {}, {"ev": {"known": False}}
    )[0]
    assert unknown["run"] is True and "need_unknown" in unknown["reasons"]


def test_learning_what_the_car_uses() -> None:
    """17 kWh/100 km above 15 °C plus 0.4 per degree below; 40 km on working days."""
    odometer, soc = [], []
    km, level = 10000.0, 80.0
    temps, start = {}, datetime(2026, 9, 1, 7, tzinfo=dt_util.get_default_time_zone())
    for offset in range(30):
        moment = start + timedelta(days=offset)
        temp = 2 + offset % 15
        temps[moment.date().isoformat()] = temp
        driven = 40 if moment.weekday() < 5 else 10
        used = driven * (17 + 0.4 * max(0, 15 - temp)) / 100
        odometer.append((moment, km))
        soc.append((moment, level))
        km += driven
        level -= used / 60 * 100
        odometer.append((moment + timedelta(hours=1), km))
        soc.append((moment + timedelta(hours=1), level))
        # Charged at night (the level rises while the car stands).
        level = 80.0
        soc.append((moment + timedelta(hours=12), level))
    days = car_days(odometer, soc, 60.0)
    assert days[0]["km"] == 40.0 and days[0]["kwh"] == pytest.approx(
        40 * (17 + 0.4 * 13) / 100, abs=0.01
    )
    learned = car_model(days, temps)
    assert learned["consumption"] == pytest.approx(17.0, abs=0.3)
    assert learned["cold"] == pytest.approx(0.4, abs=0.05)
    assert learned["workday_km"] == 40 and learned["day_off_km"] == 10


async def test_trips_from_the_calendar(hass: HomeAssistant) -> None:
    """A customer by Waze, a zone without any service, an online meeting left out."""
    hass.config.latitude, hass.config.longitude = 52.52, 13.40
    hass.states.async_set(
        "zone.office",
        "0",
        {"latitude": 52.60, "longitude": 13.40, "friendly_name": "Office"},
    )
    events = [
        {
            "summary": "Kunde",
            "start": "2026-10-05T10:00:00+02:00",
            "location": "Hauptstr. 1, Potsdam",
        },
        {
            "summary": "Weekly",
            "start": "2026-10-05T11:00:00+02:00",
            "location": "Microsoft Teams-Besprechung",
        },
        {
            "summary": "Büro",
            "start": "2026-10-05T08:00:00+02:00",
            "location": "zone.office",
        },
    ]

    def get_events(call: ServiceCall) -> dict[str, Any]:
        return {"calendar.anna": {"events": events}}

    asked: list[dict[str, Any]] = []

    def waze(call: ServiceCall) -> dict[str, Any]:
        asked.append(dict(call.data))
        return {
            "routes": [
                {
                    "duration": 41.5,
                    "distance": 36.24,
                    "name": "A115",
                    "street_names": [],
                }
            ]
        }

    hass.services.async_register(
        "calendar", "get_events", get_events, supports_response=SupportsResponse.ONLY
    )
    hass.services.async_register(
        "waze_travel_time",
        "get_travel_times",
        waze,
        supports_response=SupportsResponse.ONLY,
    )
    config = model.validate(
        {
            "version": model.CONFIG_VERSION,
            "persons": [{"id": "anna", "name": "Anna", "calendars": ["calendar.anna"]}],
            "routing": {"service": "waze"},
        }
    )
    places = PlaceStore(hass)
    trips = await async_trips(hass, config, need()["need"], places, date(2026, 10, 5))
    assert [t["location"] for t in trips] == ["zone.office", "Hauptstr. 1, Potsdam"]
    office, customer = trips
    # 8.9 km straight line times 1.3, there and back.
    assert office["source"] == "zone" and office["km"] == pytest.approx(23.2, abs=0.2)
    assert customer == {
        "start": "2026-10-05T10:00:00+02:00",
        "location": "Hauptstr. 1, Potsdam",
        "km": 72.4,
        "minutes": 42,
        "source": "waze",
    }
    assert asked[0]["origin"] == "zone.home" and asked[0]["region"] == "eu"
    # Kept: no second question; a correction by the user wins.
    await async_trips(hass, config, need()["need"], places, date(2026, 10, 5))
    assert len(asked) == 1
    await places.async_set("Hauptstr. 1, Potsdam", 30.0)
    trips = await async_trips(hass, config, need()["need"], places, date(2026, 10, 5))
    assert trips[1]["km"] == 60.0 and trips[1]["source"] == "user"
    # Without a service a free-text place stays unknown.
    unrouted = model.validate({**config, "routing": {"service": None}})
    fresh = PlaceStore(hass)
    fresh.places = {}
    fresh._loaded = True
    trips = await async_trips(hass, unrouted, need()["need"], fresh, date(2026, 10, 5))
    assert trips[1]["km"] is None
    assert not is_place("https://zoom.us/j/1") and is_place("Marktplatz 3, Ulm")


async def test_open_street_map_route(hass: HomeAssistant, aioclient_mock) -> None:
    hass.config.latitude, hass.config.longitude = 52.52, 13.40
    config = model.validate(
        {"version": model.CONFIG_VERSION, "routing": {"service": "osm"}}
    )
    routing = config["routing"]
    aioclient_mock.get(
        routing["geocoder_url"],
        json={"features": [{"geometry": {"coordinates": [13.06, 52.40]}}]},
    )
    aioclient_mock.get(
        f"{routing['router_url']}13.4,52.52;13.06,52.4",
        json={"routes": [{"distance": 35800.0, "duration": 2460.0}]},
    )
    from unittest.mock import patch

    from custom_components.energy_joe.plan.trips import async_route

    with patch("custom_components.energy_joe.plan.trips.asyncio.sleep"):
        found = await async_route(hass, routing, "Potsdam Hbf")
    assert found == {"km": 35.8, "minutes": 41, "source": "osm"}


def test_cars_are_found_and_proposed() -> None:
    """A Kia (kia_uvo, translation keys, capacity in kJ) next to an evcc wallbox."""
    car = "kia1"
    entities = [
        entity(
            "sensor.ev6_battery",
            "EV6 Batterie",
            64,
            unit="%",
            platform="kia_uvo",
            device_id=car,
            translation_key="ev_battery_percentage",
        ),
        entity(
            "sensor.ev6_range",
            "EV6 Reichweite",
            310,
            unit="km",
            platform="kia_uvo",
            device_id=car,
            translation_key="ev_driving_range",
        ),
        entity(
            "sensor.ev6_capacity",
            "EV6 Kapazität",
            280800,
            unit="kJ",
            platform="kia_uvo",
            device_id=car,
            translation_key="ev_battery_capacity",
        ),
        entity(
            "sensor.ev6_odometer",
            "EV6 Kilometerstand",
            23456,
            unit="km",
            platform="kia_uvo",
            device_id=car,
            translation_key="odometer",
        ),
        entity(
            "binary_sensor.ev6_plugged",
            "EV6 eingesteckt",
            "on",
            platform="kia_uvo",
            device_id=car,
            translation_key="ev_battery_is_plugged_in",
        ),
        entity(
            "select.evcc_carport_mode",
            "Carport Modus",
            "pv",
            platform="evcc_intg",
            device_id="lp1",
            unique_id="evcc_intg.evcc_carport_mode",
            attributes={"options": ["off", "pv", "minpv", "now"]},
        ),
        entity(
            "binary_sensor.evcc_carport_connected",
            "Carport verbunden",
            "on",
            platform="evcc_intg",
            device_id="lp1",
            unique_id="evcc_intg.evcc_carport_connected",
        ),
        entity(
            "sensor.evcc_carport_vehicle_soc",
            "Carport Fahrzeug Ladestand",
            64,
            unit="%",
            platform="evcc_intg",
            device_id="lp1",
            unique_id="evcc_intg.evcc_carport_vehicle_soc",
        ),
    ]
    result = discover(snapshot(entities))
    (found,) = result["cars"]
    assert found["integration"] == "kia_uvo"
    assert found["capacity_kwh"] == 78.0 and found["range_km"] == 310.0
    assert found["entities"]["odometer"] == "sensor.ev6_odometer"
    (action,) = result["proposal"]["actions"]
    assert action["need"]["enabled"] is False
    assert action["need"]["soc_entity"] == "sensor.ev6_battery"
    assert action["need"]["capacity_entity"] == "sensor.ev6_capacity"
    model.validate({"version": model.CONFIG_VERSION, **result["proposal"]})


async def test_the_car_stops_at_the_level_it_needs(
    hass: HomeAssistant, freezer
) -> None:
    from custom_components.energy_joe.control.executor import JoeExecutor

    freezer.move_to("2026-10-05T04:00:00+02:00")

    def keep(call: ServiceCall) -> None:
        state = hass.states.get(call.data["entity_id"])
        hass.states.async_set(
            call.data["entity_id"], call.data["option"], state.attributes
        )

    hass.services.async_register("select", "select_option", keep)
    hass.states.async_set(
        "select.carport_mode", "pv", {"options": ["off", "pv", "now"]}
    )
    hass.states.async_set("sensor.car_soc", "38", {"unit_of_measurement": "%"})
    action = need()
    config = model.validate({"version": model.CONFIG_VERSION, "actions": [action]})
    start = dt_util.start_of_local_day(date(2026, 10, 5))
    planned = {
        "id": "ev",
        "name": "Carport",
        "kind": "switch",
        "run": True,
        "manual": False,
        "reasons": ["need"],
        "start": (start + timedelta(hours=3)).isoformat(timespec="minutes"),
        "end": (start + timedelta(hours=5, minutes=-3)).isoformat(timespec="minutes"),
        "target": 43,
        "sensor": "sensor.car_soc",
        "power_kw": 11.0,
        "energy_kwh": 21.4,
    }
    plan = {
        "kind": "none",
        "fixed": True,
        "target": 20,
        "window": {
            "start": start.isoformat(),
            "end": (start + timedelta(hours=5)).isoformat(),
        },
        "rules": {"discharge_mode": "until_target"},
        "batteries": [],
        "actions": [planned],
    }
    executor = JoeExecutor(
        hass, lambda: config, lambda: plan, lambda: "live", lambda: None
    )
    await executor.async_load()
    await executor.async_check()
    assert hass.states.get("select.carport_mode").state == "now"
    hass.states.async_set("sensor.car_soc", "43", {"unit_of_measurement": "%"})
    await executor.async_check()
    assert hass.states.get("select.carport_mode").state == "pv"
    assert executor.status["actions"]["ev"]["reason"] == "reached"


def test_more_than_a_full_battery_and_warm_learned_values(hass: HomeAssistant) -> None:
    hass.states.async_set("sensor.car_soc", "20", {"unit_of_measurement": "%"})
    found = car_need(
        need(capacity_kwh=50.0)["need"], hass.states.get, [], {}, 20.0, False, True
    )
    long_trip = car_need(
        need(capacity_kwh=50.0, daily_km=400.0)["need"],
        hass.states.get,
        [],
        {},
        20.0,
        False,
        True,
    )
    assert found["fits"] is True
    # 450 km need 81 kWh, but only 40 fit: no more than that is missing.
    assert long_trip["missing_kwh"] == 40.0 and long_trip["fits"] is False
    # Learned in warm weather (no cold slope): the table scales it to the cold.
    warm = {"consumption": 16.0, "cold": None, "temp": 20.0}
    assert consumption(need()["need"], warm, None, 0.0, False) == (20.5, "learned")


def test_glitches_and_order_of_car_readings() -> None:
    """A 0 km reading and an odometer written just after the level change nothing."""
    zone = dt_util.get_default_time_zone()
    odometer, soc = [], []
    km = 50000.0
    temps = {}
    for offset in range(12):
        moment = datetime(2026, 7, 1, 7, tzinfo=zone) + timedelta(days=offset)
        temps[moment.date().isoformat()] = 22.0
        soc += [
            (moment, 80.0),
            (moment + timedelta(hours=1), 80.0 - 30 * 16 / 100 / 60 * 100),
        ]
        odometer += [
            (moment + timedelta(microseconds=50), km),
            (moment + timedelta(hours=1, microseconds=50), km + 30),
        ]
        soc.append((moment + timedelta(hours=10), 80.0))
        km += 30
    odometer.append((datetime(2026, 7, 5, 12, tzinfo=zone), 0.0))
    days = car_days(odometer, soc, 60.0)
    assert all(abs(d["km"]) <= 30 for d in days)
    learned = car_model(days, temps)
    assert learned["consumption"] == pytest.approx(16.0, abs=0.1)
    # Only warm days: no cold slope, but the temperature it was learned at.
    assert learned["cold"] is None and learned["temp"] == 22.0


async def test_calendars_trips_and_retries(hass: HomeAssistant) -> None:
    """Yesterday's stay is not a trip, a broken calendar loses only its own, one moment counts once."""
    events = {
        "calendar.anna": [
            {"summary": "Reha", "start": "2026-10-03", "location": "Klinik Bad Belzig"},
            {
                "summary": "Essen",
                "start": "2026-10-05T19:00:00+02:00",
                "location": "Restaurant Am See",
            },
        ],
        "calendar.bob": [
            {
                "summary": "Essen",
                "start": "2026-10-05T17:00:00+00:00",
                "location": "Restaurant am See",
            },
        ],
    }
    calls = {"waze": 0}

    def get_events(call: ServiceCall) -> dict[str, Any]:
        (entity_id,) = (
            call.data["entity_id"]
            if isinstance(call.data["entity_id"], list)
            else [call.data["entity_id"]]
        )
        if entity_id == "calendar.broken":
            raise RuntimeError("timeout")
        return {entity_id: {"events": events.get(entity_id, [])}}

    def waze(call: ServiceCall) -> dict[str, Any]:
        calls["waze"] += 1
        return {"routes": []}

    hass.services.async_register(
        "calendar", "get_events", get_events, supports_response=SupportsResponse.ONLY
    )
    hass.services.async_register(
        "waze_travel_time",
        "get_travel_times",
        waze,
        supports_response=SupportsResponse.ONLY,
    )
    config = model.validate(
        {
            "version": model.CONFIG_VERSION,
            "persons": [
                {
                    "id": "anna",
                    "name": "Anna",
                    "calendars": ["calendar.anna", "calendar.broken"],
                },
                {"id": "bob", "name": "Bob", "calendars": ["calendar.bob"]},
            ],
            "routing": {"service": "waze"},
        }
    )
    places = PlaceStore(hass)
    trips = await async_trips(hass, config, need()["need"], places, date(2026, 10, 5))
    assert [t["location"] for t in trips] == ["Restaurant Am See"]
    assert trips[0]["start"] == "2026-10-05T19:00:00+02:00" and trips[0]["km"] is None
    # Waze found nothing: not asked again on the next run.
    await async_trips(hass, config, need()["need"], places, date(2026, 10, 5))
    assert calls["waze"] == 1
    # Nobody's calendar chosen: no trips; everyone: both persons.
    assert (
        await async_trips(
            hass, config, need(persons=[])["need"], places, date(2026, 10, 5)
        )
        == []
    )


async def test_a_range_target_in_miles_and_tonight_by_hand(
    hass: HomeAssistant, freezer
) -> None:
    from custom_components.energy_joe.control.executor import JoeExecutor

    freezer.move_to("2026-10-05T04:00:00+02:00")

    def keep(call: ServiceCall) -> None:
        state = hass.states.get(call.data["entity_id"])
        hass.states.async_set(
            call.data["entity_id"], call.data["option"], state.attributes
        )

    hass.services.async_register("select", "select_option", keep)
    hass.states.async_set(
        "select.carport_mode", "pv", {"options": ["off", "pv", "now"]}
    )
    hass.states.async_set("sensor.car_range", "120", {"unit_of_measurement": "mi"})
    config = model.validate({"version": model.CONFIG_VERSION, "actions": [need()]})
    start = dt_util.start_of_local_day(date(2026, 10, 5))
    entry = {
        "id": "ev",
        "name": "Carport",
        "kind": "switch",
        "run": True,
        "manual": False,
        "reasons": ["need"],
        "start": (start + timedelta(hours=3)).isoformat(timespec="minutes"),
        "end": (start + timedelta(hours=5, minutes=-3)).isoformat(timespec="minutes"),
        "target": 230,
        "sensor": "sensor.car_range",
        "need": {"target_unit": "km", "sensor": "sensor.car_range"},
        "power_kw": 11.0,
        "energy_kwh": 10.0,
    }
    plan = {
        "kind": "none",
        "fixed": True,
        "target": 20,
        "window": {
            "start": start.isoformat(),
            "end": (start + timedelta(hours=5)).isoformat(),
        },
        "rules": {"discharge_mode": "until_target"},
        "batteries": [],
        "actions": [entry],
    }
    executor = JoeExecutor(
        hass, lambda: config, lambda: plan, lambda: "live", lambda: None
    )
    await executor.async_load()
    # 120 mi are 193 km: below 230 km, so it charges.
    await executor.async_check()
    assert hass.states.get("select.carport_mode").state == "now"
    # 150 mi are 241 km: reached.
    hass.states.async_set("sensor.car_range", "150", {"unit_of_measurement": "mi"})
    await executor.async_check()
    assert executor.status["actions"]["ev"]["reason"] == "reached"
    # "Tonight" by hand afterwards: the whole window, no target.
    freezer.move_to("2026-10-05T01:00:00+02:00")
    await executor.async_action_tonight("ev", True)
    await executor.async_check()
    assert hass.states.get("select.carport_mode").state == "now"
    assert executor.status["actions"]["ev"]["target"] is None


async def test_a_correction_reaches_the_fixed_plan(hass: HomeAssistant) -> None:
    from custom_components.energy_joe.observe.store import HistoryStore
    from custom_components.energy_joe.plan.scheduler import JoePlanner

    hass.states.async_set("sensor.car_soc", "30", {"unit_of_measurement": "%"})
    store = HistoryStore(hass)
    await store.async_load()
    planner = JoePlanner(hass, store, lambda: None)
    config = model.validate({"version": model.CONFIG_VERSION, "actions": [need()]})
    planner._config = config
    trips = [
        {
            "start": "2026-10-05T09:00:00+02:00",
            "location": "Hauptstr. 1",
            "km": 600.0,
            "minutes": 300,
            "source": "waze",
        }
    ]
    found = car_need(need()["need"], hass.states.get, trips, None, 10.0, False, True)
    planner._fixed = {
        "fixed": True,
        "window": {
            "start": "2026-10-05T00:00:00+02:00",
            "end": "2026-10-05T05:00:00+02:00",
        },
        "meta": {"tomorrow": {"workday": True}},
        "actions": [
            {
                "id": "ev",
                "run": True,
                "manual": False,
                "target": found["target"],
                "need": {**found, "trips": trips},
            }
        ],
    }
    assert found["target"] == 100
    await planner.places.async_set("Hauptstr. 1", 30.0)
    await planner.async_correct_needs("Hauptstr. 1")
    entry = planner.plan["actions"][0]
    assert entry["need"]["trips"][0]["km"] == 60.0
    assert entry["need"]["trips"][0]["source"] == "user"
    assert entry["target"] < 100
    await store.async_unload()


async def test_a_longer_trip_after_fixing_charges_tonight(hass: HomeAssistant) -> None:
    from custom_components.energy_joe.observe.store import HistoryStore
    from custom_components.energy_joe.plan.scheduler import JoePlanner

    hass.states.async_set("sensor.car_soc", "60", {"unit_of_measurement": "%"})
    store = HistoryStore(hass)
    await store.async_load()
    planner = JoePlanner(hass, store, lambda: None)
    config = model.validate({"version": model.CONFIG_VERSION, "actions": [need()]})
    planner._config = config
    # The place was not found when the plan was fixed: 60 % looked enough.
    trips = [
        {
            "start": "2026-10-05T09:00:00+02:00",
            "location": "Messe Hannover",
            "km": None,
            "minutes": None,
            "source": None,
        }
    ]
    found = car_need(need()["need"], hass.states.get, trips, None, 10.0, False, True)
    start = datetime(2026, 10, 5, 0, 0, tzinfo=dt_util.get_default_time_zone())
    end = start + timedelta(hours=5)
    fixed = plan_actions(
        [config["actions"][0]],
        hass.states.get,
        start,
        end,
        None,
        {},
        None,
        {"ev": {**found, "trips": trips}},
    )
    assert fixed[0]["run"] is False
    assert fixed[0]["reasons"] == ["enough_range"]
    planner._fixed = {
        "fixed": True,
        "window": {"start": start.isoformat(), "end": end.isoformat()},
        "meta": {"tomorrow": {"workday": True}},
        "prices": {"night": 0.25, "day": 0.35},
        "actions": fixed,
    }
    await planner.places.async_set("Messe Hannover", 150.0)
    assert await planner.async_correct_needs("Messe Hannover") == ["ev"]
    entry = planner.plan["actions"][0]
    assert entry["run"] is True
    assert entry["reasons"] == ["need"]
    assert entry["need"]["trips"][0]["km"] == 300.0
    assert entry["target"] == 100
    # Charging the missing energy takes longer than a few minutes: an earlier start.
    assert datetime.fromisoformat(entry["start"]) < end - timedelta(hours=1)
    assert entry["energy_kwh"] > 0
    assert entry["cost"] > 0
    # Another place changes nothing.
    assert await planner.async_correct_needs("Somewhere else") == []
    await store.async_unload()


async def test_days_from_another_sensor_no_longer_count(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    from custom_components.energy_joe.learn import learner as learner_module
    from custom_components.energy_joe.learn.learner import JoeLearner
    from custom_components.energy_joe.observe.store import HistoryStore

    async def no_series(*args: Any, **kwargs: Any) -> list[Any]:
        return []

    monkeypatch.setattr(learner_module, "async_sensor_series", no_series)
    store = HistoryStore(hass)
    await store.async_load()
    config = model.validate(
        {
            "version": model.CONFIG_VERSION,
            "actions": [need(odometer_entity="sensor.car_odometer")],
        }
    )
    learner = JoeLearner(hass, store, lambda: config, lambda *a: None, lambda: None)
    old = ["sensor.car_range", "sensor.car_soc", 60.0]
    new = ["sensor.car_odometer", "sensor.car_soc", 60.0]
    days: dict[str, dict[str, Any]] = {}
    for offset in range(20):
        day = (date(2026, 10, 3) - timedelta(days=offset)).isoformat()
        # The range sensor first picked as odometer: charging looked like driving.
        km, source = (250.0, old) if offset >= 10 else (30.0, new)
        days[day] = {
            "workday": True,
            "car": {
                "ev": {
                    "date": day,
                    "km": km,
                    "kwh": 0.0,
                    "kwh_km": 0.0,
                    "source": source,
                }
            },
        }
    learned = {
        "since": "2026-08-01",
        "reset": {},
        "car_models": {"ev": {"workday_km": 250, "day_off_km": 250, "source": old}},
    }
    result = await learner._async_cars(config, learned, date(2026, 10, 4), days)
    assert result["ev"]["workday_km"] == 30
    # Learned from the old sensor: gone, not kept.
    assert "day_off_km" not in result["ev"]
    assert result["ev"]["source"] == new
    await store.async_unload()
