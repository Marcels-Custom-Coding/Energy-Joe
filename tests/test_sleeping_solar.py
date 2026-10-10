"""A PV inverter that is off without sun: no warning at night, 0 W in the records."""

from __future__ import annotations

from typing import Any

from freezegun.api import FrozenDateTimeFactory
import pytest
from pytest_homeassistant_custom_component.common import async_fire_time_changed

from custom_components.energy_joe import model
from custom_components.energy_joe.discovery.checks import run_config_checks
from custom_components.energy_joe.observe.observer import JoeObserver
from custom_components.energy_joe.observe.readings import solar_kw
from custom_components.energy_joe.observe.store import HistoryStore
from homeassistant.core import HomeAssistant, State
from homeassistant.util import dt as dt_util

from .snapshots import entity, snapshot

POWER_W = {"unit_of_measurement": "W", "device_class": "power"}


def config(sleeps: bool) -> dict[str, Any]:
    return model.apply_update(
        model.default_config(),
        {
            "measurements": {
                "grid_power": {"entity_id": "sensor.grid"},
                "home_power": {"entity_id": "sensor.home"},
                "solar_power": [{"entity_id": "sensor.pv", "sleeps": sleeps}],
            }
        },
        "user",
    )


def sun(state: str, elevation: float):
    return entity("sun.sun", "Sun", state, attributes={"elevation": elevation})


def solar_checks(sleeps: bool, *extra: Any, pv: Any = "unavailable", seconds=30):
    snap = snapshot(
        [
            entity("sensor.grid", "Grid", 100, unit="W"),
            entity("sensor.home", "Home", 300, unit="W"),
            entity("sensor.pv", "PV", pv, unit="W", seconds=seconds),
            *extra,
        ]
    )
    return [
        c
        for c in run_config_checks(snap, config(sleeps))
        if c.get("role") == "solar_power"
    ]


def test_the_schema_knows_sleeping_solar() -> None:
    assert config(False)["measurements"]["solar_power"][0]["sleeps"] is False
    assert model.default_config()["measurements"]["solar_power"] == []


def test_checks_settle_a_sleeping_inverter_while_the_sun_is_low() -> None:
    # Not marked: the warning stays, and the panel may offer to mark it.
    (check,) = solar_checks(False, sun("below_horizon", -20))
    assert check["code"] == "unavailable"
    assert check["can_sleep"] is True
    # Marked: nothing at night, nothing at a low morning sun, nothing without sun.sun.
    assert solar_checks(True, sun("below_horizon", -20)) == []
    assert solar_checks(True, sun("above_horizon", 5)) == []
    assert solar_checks(True) == []
    # Stale overnight, too.
    assert solar_checks(True, sun("below_horizon", -5), pv=0, seconds=10 * 3600) == []
    # The sun is clearly up: off is a fault again.
    (check,) = solar_checks(True, sun("above_horizon", 30))
    assert check["code"] == "unavailable"
    assert "can_sleep" not in check


def test_a_sleeping_inverter_reads_0_while_the_sun_is_low() -> None:
    measurement = {"entity_id": "sensor.pv", "invert": False, "sleeps": True}
    states = {"sensor.pv": State("sensor.pv", "unavailable")}
    states["sun.sun"] = State("sun.sun", "below_horizon", {"elevation": -10})
    assert solar_kw(states.get, measurement) == 0.0
    states["sun.sun"] = State("sun.sun", "above_horizon", {"elevation": 40})
    assert solar_kw(states.get, measurement) is None
    assert solar_kw(states.get, {**measurement, "sleeps": False}) is None
    states["sensor.pv"] = State("sensor.pv", "1500", POWER_W)
    assert solar_kw(states.get, measurement) == 1.5


@pytest.mark.parametrize(("sleeps", "coverage"), [(True, 1.0), (False, 0.0)])
async def test_a_night_hour_is_complete_with_a_sleeping_inverter(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory, sleeps: bool, coverage: float
) -> None:
    await hass.config.async_set_time_zone("Europe/Berlin")
    freezer.move_to("2026-10-03T02:00:00+02:00")
    hass.states.async_set("sensor.grid", "400", POWER_W)
    hass.states.async_set("sensor.home", "400", POWER_W)
    hass.states.async_set("sensor.pv", "unavailable", POWER_W)
    hass.states.async_set("sun.sun", "below_horizon", {"elevation": -30})
    store = HistoryStore(hass)
    await store.async_load()
    observer = JoeObserver(hass, store, lambda: None)
    await observer.async_start(config(sleeps))
    await hass.async_block_till_done()
    freezer.move_to("2026-10-03T03:00:00+02:00")
    async_fire_time_changed(hass, dt_util.utcnow())
    await hass.async_block_till_done()
    day = await store.async_day("2026-10-03")
    (record,) = day["hours"]
    assert record["cov"] == pytest.approx(coverage, abs=0.01)
    if sleeps:
        assert record["solar"] == 0
    await observer.async_stop()
    await store.async_unload()


def test_the_history_counts_a_sleeping_night_as_0(hass: HomeAssistant) -> None:
    """Backfilled hours: an inverter without a value while the sun was low is 0 W."""
    from datetime import datetime

    from custom_components.energy_joe.observe.backfill import (
        Inputs,
        Series,
        build_records,
    )

    night = datetime.fromisoformat("2026-10-03T02:00:00+02:00")
    noon = datetime.fromisoformat("2026-10-03T12:00:00+02:00")
    means = {"sensor.grid": Series({night: (0.4, 1.0), noon: (-1.0, 1.0)})}
    solar = {"entity_id": "sensor.pv", "invert": False, "sleeps": True}
    inputs = Inputs(measurements={"grid": {"entity_id": "sensor.grid"}}, solar=[solar])
    records = build_records(
        inputs, [night, noon], means, {}, set(), lambda h: h == night
    )
    asleep, day = records
    assert asleep["cov"] == 1.0
    assert asleep["solar"] == 0
    # At noon a missing value is missing.
    assert day["cov"] == 0.0
