"""Joe watches: sums over time, hour records, day summaries and the history."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

from freezegun.api import FrozenDateTimeFactory
import pytest
from pytest_homeassistant_custom_component.common import async_fire_time_changed
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.energy_joe import model
from custom_components.energy_joe.observe.backfill import (
    Inputs,
    Series,
    build_records,
    series_from_states,
    spread_statistics,
)
from custom_components.energy_joe.observe.observer import JoeObserver
from custom_components.energy_joe.observe.readings import Integrator, measurement_kw
from custom_components.energy_joe.observe.records import (
    Flow,
    HourParts,
    compose,
    hour_starts,
    merge,
    summarize,
)
from custom_components.energy_joe.observe.store import HistoryStore
from homeassistant.core import HomeAssistant, State
from homeassistant.util import dt as dt_util

POWER_W = {"unit_of_measurement": "W", "device_class": "power"}
POWER_KW = {"unit_of_measurement": "kW", "device_class": "power"}


def test_integrator_splits_and_covers() -> None:
    sums = Integrator()
    sums.update(0, 2.0)  # 2 kW import
    sums.update(1800, -1.0)  # after 30 min: 1 kW export
    sums.update(2700, None)  # after 45 min: unavailable
    positive, negative, covered = sums.take(3600)
    assert positive == pytest.approx(1.0)
    assert negative == pytest.approx(0.25)
    assert covered == pytest.approx(2700)
    assert sums.take(7200) == (0.0, 0.0, 0.0)


def test_measurement_reads_units_signs_and_pairs() -> None:
    states = {
        "sensor.a": State("sensor.a", "1500", POWER_W),
        "sensor.b": State("sensor.b", "0.5", POWER_KW),
        "sensor.off": State("sensor.off", "unavailable", POWER_W),
    }
    get = states.get
    assert measurement_kw(get, {"entity_id": "sensor.a"}) == pytest.approx(1.5)
    assert measurement_kw(
        get, {"entity_id": "sensor.a", "invert": True}
    ) == pytest.approx(-1.5)
    assert measurement_kw(
        get, {"entity_id": "sensor.a", "minus_entity_id": "sensor.b"}
    ) == pytest.approx(1.0)
    assert measurement_kw(get, {"entity_id": "sensor.off"}) is None


def test_compose_computes_home_without_sensor() -> None:
    start = dt_util.parse_datetime("2026-10-03T12:00:00+02:00")
    record = compose(
        start,
        HourParts(
            grid=Flow(0.2, 1.0, 1.0),
            solar=[Flow(3.0, 0.0, 1.0)],
            batteries={"b1": Flow(0.5, 0.0, 0.9)},
            soc={"b1": 61.04},
        ),
        "live",
    )
    assert record["home"] == pytest.approx(0.2 - 1.0 + 3.0 - 0.5)
    assert record["home_calc"] is True
    assert record["bat"] == {"b1": {"in": 0.5, "out": 0.0, "soc": 61.0}}
    assert record["cov"] == 0.9


def test_counters_beat_power_sums() -> None:
    start = dt_util.parse_datetime("2026-10-03T12:00:00+02:00")
    record = compose(
        start,
        HourParts(grid=Flow(0.4, 0.0, 1.0), grid_in=0.6, grid_out=0.2),
        "stats",
    )
    assert (record["grid_in"], record["grid_out"]) == (0.6, 0.2)


def test_merge_keeps_complete_live_hours_and_context() -> None:
    live = {"start": "x", "src": "live", "cov": 1.0, "home": 1.0, "temp": 12.0}
    read = {"start": "x", "src": "stats", "cov": 1.0, "home": 1.2}
    assert merge(live, read) is live
    assert merge(live, read, force=True) == {**read, "temp": 12.0}
    partial = {**live, "cov": 0.5}
    assert merge(partial, read) == {**read, "temp": 12.0}


def test_days_with_clock_change(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))
    day = dt_util.start_of_local_day(datetime(2026, 10, 25))
    hours = hour_starts(day, day + timedelta(days=1, hours=1))
    assert len([h for h in hours if h.date().isoformat() == "2026-10-25"]) == 25


def test_half_hour_zones_share_statistic_rows(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Asia/Kolkata"))
    hour = dt_util.as_local(dt_util.parse_datetime("2026-10-03T04:30:00+00:00"))
    first = dt_util.parse_datetime("2026-10-03T04:00:00+00:00").timestamp()
    rows: list[dict[str, Any]] = [
        {"start": first, "mean": 1.0, "change": 2.0},
        {"start": first + 3600, "mean": 3.0, "change": 4.0},
    ]
    means = spread_statistics(rows, "mean", [hour], average=True)
    changes = spread_statistics(rows, "change", [hour], average=False)
    assert means.values[hour] == (pytest.approx(2.0), 1.0)
    assert changes.values[hour] == (pytest.approx(3.0), 1.0)


def test_state_history_becomes_hourly_means(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.UTC)
    start = dt_util.parse_datetime("2026-10-03T10:00:00+00:00")
    states = [
        State("sensor.grid", "2000", POWER_W, last_changed=start, last_updated=start),
        State(
            "sensor.grid",
            "unavailable",
            POWER_W,
            last_changed=start + timedelta(minutes=30),
            last_updated=start + timedelta(minutes=30),
        ),
    ]
    series = series_from_states(states, [start, start + timedelta(hours=1)], "W")
    assert series.values[start] == (pytest.approx(2.0), pytest.approx(0.5))
    assert start + timedelta(hours=1) not in series.values


def test_summary_of_a_day(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))
    hours = []
    for hour in range(24):
        solar = 1.5 if 10 <= hour < 16 else 0.0
        hours.append(
            {
                "start": f"2026-10-03T{hour:02d}:00:00+02:00",
                "src": "live",
                "cov": 1.0,
                "home": 0.5,
                "solar": solar,
                "grid_in": 0.5 if solar == 0 else 0.0,
                "grid_out": solar - 0.5 if solar else 0.0,
                "temp": 10.0 + hour / 2,
                "present": {"person.robin": 1.0 if hour < 8 else 0.0},
            }
        )
    summary = summarize(
        "2026-10-03",
        {"hours": hours, "fc": {"ahead_kwh": 10.0}, "workday": True},
        {"start": "00:00", "end": "05:00"},
    )
    assert summary["home"] == 12.0
    assert summary["solar"] == 9.0
    assert summary["grid_in_cheap"] == 2.5
    assert summary["solar_vs_fc"] == 0.9
    assert summary["present"] == {"person.robin": 8.0}
    assert summary["temp"]["max"] == 21.5
    assert summary["sun_covers"] == "2026-10-03T10:00:00+02:00"
    assert summary["cov"] == 1.0


def config_with(**patch: Any) -> dict[str, Any]:
    base = {
        "measurements": {
            "grid_power": {"entity_id": "sensor.grid"},
            "home_power": {"entity_id": "sensor.home"},
            "solar_power": [{"entity_id": "sensor.pv"}],
        },
        "batteries": {
            "b1": {
                "name": "Battery",
                "adapter": "none",
                "soc_entity": "sensor.soc",
                "power": {"entity_id": "sensor.bat"},
            }
        },
        "persons": {"person.robin": {"name": "Robin", "person_entity": "person.robin"}},
        "context": {"weather_entity": "weather.home"},
    }
    base.update(patch)
    return model.apply_update(model.default_config(), base, "user")


async def test_observer_records_live_hours(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory
) -> None:
    """One hour of live readings becomes one record with the right energies."""
    await hass.config.async_set_time_zone("Europe/Berlin")
    freezer.move_to("2026-10-03T12:00:00+02:00")
    hass.states.async_set("sensor.grid", "1000", POWER_W)
    hass.states.async_set("sensor.home", "3000", POWER_W)
    hass.states.async_set("sensor.pv", "2.5", POWER_KW)
    hass.states.async_set("sensor.bat", "500", POWER_W)
    hass.states.async_set("sensor.soc", "40", {"unit_of_measurement": "%"})
    hass.states.async_set("person.robin", "home")
    hass.states.async_set("weather.home", "sunny", {"temperature": 14})

    store = HistoryStore(hass)
    await store.async_load()
    observer = JoeObserver(hass, store, lambda: None)
    await observer.async_start(config_with())
    await hass.async_block_till_done()

    freezer.move_to("2026-10-03T12:30:00+02:00")
    hass.states.async_set("sensor.grid", "-500", POWER_W)
    hass.states.async_set("person.robin", "not_home")
    hass.states.async_set("weather.home", "sunny", {"temperature": 16})
    hass.states.async_set("sensor.soc", "45", {"unit_of_measurement": "%"})
    await hass.async_block_till_done()

    freezer.move_to("2026-10-03T13:00:00+02:00")
    async_fire_time_changed(hass, dt_util.utcnow())
    await hass.async_block_till_done()

    day = await store.async_day("2026-10-03")
    assert day is not None
    (record,) = day["hours"]
    assert record["start"] == "2026-10-03T12:00:00+02:00"
    assert record["src"] == "live"
    assert record["grid_in"] == pytest.approx(0.5)
    assert record["grid_out"] == pytest.approx(0.25)
    assert record["home"] == pytest.approx(3.0)
    assert record["solar"] == pytest.approx(2.5)
    assert record["bat_in"] == pytest.approx(0.5)
    assert record["bat"]["b1"]["soc"] == 45.0
    assert record["temp"] == 15.0
    assert record["present"] == {"person.robin": 0.5}
    assert record["cov"] == pytest.approx(1.0, abs=0.01)
    assert observer.status["last_hour"] == record["start"]
    await observer.async_stop()
    await store.async_unload()


def test_records_from_counters_and_means(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.UTC)
    hour = dt_util.parse_datetime("2026-10-03T10:00:00+00:00")
    inputs = Inputs(
        measurements={"grid": {"entity_id": "sensor.grid"}, "home": None},
        counters={"grid_in": ["sensor.import"], "grid_out": ["sensor.export"]},
    )
    records = build_records(
        inputs,
        [hour],
        {"sensor.grid": Series({hour: (0.3, 1.0)})},
        {
            "sensor.import": Series({hour: (0.9, 1.0)}),
            "sensor.export": Series({hour: (0.6, 1.0)}),
        },
        set(),
    )
    assert records[0]["grid_in"] == 0.9
    assert records[0]["grid_out"] == 0.6


async def test_watching_follows_setup_and_mode(
    ready_hass: HomeAssistant, hass_ws_client: WebSocketGenerator
) -> None:
    """Joe watches once the setup is done, pauses when off and serves his history."""
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    from custom_components.energy_joe.const import DOMAIN

    hass = ready_hass
    hass.states.async_set("sensor.grid", "800", POWER_W)
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    runtime = hass.data[DOMAIN]
    runtime.async_update_config(
        {"measurements": {"grid_power": {"entity_id": "sensor.grid"}}}, "user"
    )
    await hass.async_block_till_done()
    assert not runtime.observer.active

    runtime.async_set_onboarding(step="done", completed=True)
    await hass.async_block_till_done()
    assert runtime.observer.active
    assert runtime.state["observe"]["active"]

    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": f"{DOMAIN}/history/days", "days": 7})
    result = (await client.receive_json())["result"]
    assert result["days"] == []
    await client.send_json_auto_id(
        {"type": f"{DOMAIN}/history/day", "date": "2026-10-03"}
    )
    day = (await client.receive_json())["result"]
    assert day["hours"] == [] and day["summary"]["hours"] == 0
    await client.send_json_auto_id({"type": f"{DOMAIN}/history/rebuild"})
    assert (await client.receive_json())["success"]

    runtime.async_set_mode("off")
    await hass.async_block_till_done()
    assert not runtime.observer.active
    await client.send_json_auto_id({"type": f"{DOMAIN}/history/rebuild"})
    msg = await client.receive_json()
    assert msg["error"]["code"] == "not_observing"
    assert await hass.config_entries.async_unload(entry.entry_id)


def test_day_view_places_hours_on_slots(hass: HomeAssistant) -> None:
    """Clock change, a cheap window over midnight and the forecast land on slots."""
    from custom_components.energy_joe.observe.records import day_view

    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))
    data = {
        "hours": [
            {
                "start": "2026-10-25T02:00:00+01:00",
                "src": "live",
                "cov": 1.0,
                "home": 0.4,
            },
        ],
        "fc": {
            "ahead_kwh": 5.0,
            "hours": {"2026-10-25T12:00:00+01:00": 1500},
        },
    }
    sunrise = dt_util.parse_datetime("2026-10-25T07:30:00+01:00")
    view = day_view(
        "2026-10-25", data, {"start": "22:00", "end": "06:00"}, {"sunrise": sunrise}
    )
    assert len(view["slots"]) == 25
    assert view["slots"][2:4] == ["02:00", "02:00"]
    assert view["hours"][0]["slot"] == 3
    assert view["window_slots"] == [[0, 7], [23, 25]]
    assert view["fc_slots"][13] == 1.5
    assert view["sun"]["sunrise_slot"] == 8.5


async def test_counters_survive_resets_and_naps(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory
) -> None:
    """A counter that restarts counts from zero; a sleeping hour is left out."""
    await hass.config.async_set_time_zone("Europe/Berlin")
    freezer.move_to("2026-10-03T12:00:00+02:00")
    energy = {"unit_of_measurement": "kWh", "device_class": "energy"}
    hass.states.async_set("sensor.grid", "1000", POWER_W)
    hass.states.async_set("sensor.washer_energy", "100.0", energy)
    store = HistoryStore(hass)
    await store.async_load()
    observer = JoeObserver(hass, store, lambda: None)
    config = config_with(
        measurements={"grid_power": {"entity_id": "sensor.grid"}},
        batteries=[],
        persons=[],
        context={"weather_entity": None},
        consumers={
            "sensor.washer_energy": {
                "name": "Washer",
                "kind": "household",
                "energy_entity": "sensor.washer_energy",
            }
        },
    )
    await observer.async_start(config)
    freezer.move_to("2026-10-03T12:40:00+02:00")
    hass.states.async_set("sensor.washer_energy", "0.3", energy)
    freezer.move_to("2026-10-03T13:00:00+02:00")
    async_fire_time_changed(hass, dt_util.utcnow())
    await hass.async_block_till_done()
    (record,) = (await store.async_day("2026-10-03"))["hours"]
    assert record["use"] == {"sensor.washer_energy": 0.3}

    # Three hours without a tick (the machine slept): no live record for them.
    freezer.move_to("2026-10-03T16:00:00+02:00")
    async_fire_time_changed(hass, dt_util.utcnow())
    await hass.async_block_till_done()
    assert len((await store.async_day("2026-10-03"))["hours"]) == 1
    await observer.async_stop()
    await store.async_unload()
