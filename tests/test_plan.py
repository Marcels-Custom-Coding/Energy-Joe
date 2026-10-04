"""Joe's night plan: charge, hold or let be."""

from __future__ import annotations

from datetime import datetime, timedelta
import math
from typing import Any

import pytest

from custom_components.energy_joe import model
from custom_components.energy_joe.plan.planner import (
    Battery,
    Hour,
    PlanInput,
    Prices,
    make_plan,
    simulate,
)
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

OCTOPUS = Prices(night=0.1856, day=0.2857, feed_in=0.062)


def berlin(text: str) -> datetime:
    return datetime.fromisoformat(text).replace(tzinfo=dt_util.get_default_time_zone())


def day_hours(solar_kwh: float, *, now: str = "2026-10-03T23:45") -> list[Hour]:
    """From now to the next midnight but one: sun as a bell between 7 and 19 h."""
    start = berlin(now).replace(minute=0)
    hours = []
    moment = start
    end = berlin("2026-10-05T00:00")
    weights = {h: max(0.0, math.sin(math.pi * (h + 0.5 - 7) / 12)) for h in range(24)}
    total = sum(weights.values())
    while moment < end:
        h = moment.hour
        on_day = moment.date().isoformat() == "2026-10-04"
        solar = solar_kwh * weights[h] / total if on_day else 0.0
        home = 0.4 if h < 6 else 1.2 if 18 <= h <= 21 else 0.6
        fraction = 0.25 if moment == start else 1.0
        hours.append(
            Hour(
                start=moment,
                solar=solar * fraction,
                home=home * fraction,
                window=on_day and h < 5,
                fraction=fraction,
            )
        )
        moment += timedelta(hours=1)
    return hours


def plan_input(solar: float, soc: float, **changes) -> PlanInput:
    values = {
        "now": berlin("2026-10-03T23:45"),
        "window_start": berlin("2026-10-04T00:00"),
        "window_end": berlin("2026-10-04T05:00"),
        "hours": day_hours(solar),
        "batteries": [Battery("b1", "Battery", 10.0, soc, 3.0, 3.0)],
        "prices": OCTOPUS,
        "buffer": 0.0,
    }
    values.update(changes)
    return PlanInput(**values)


@pytest.fixture(autouse=True)
def berlin_time(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


def test_sunny_day_needs_nothing() -> None:
    plan = make_plan(plan_input(solar=30, soc=60))
    assert plan["kind"] == "none"
    assert plan["target"] == 10
    assert plan["grid_charge_kwh"] == 0
    assert plan["reasons"][0] == "enough"
    assert "2026-10-04T06:00" < plan["sun_takes_over"] < "2026-10-04T09:00"


def test_grey_day_charges_late_in_the_window() -> None:
    plan = make_plan(plan_input(solar=3, soc=20))
    assert plan["kind"] == "charge"
    assert plan["target"] > 20
    assert plan["grid_charge_kwh"] > 0
    assert "2026-10-04T00:00" < plan["charge_from"] < "2026-10-04T05:00"
    assert plan["cost"]["saving"] > 0
    # Charging happens at the end of the window, not at its start.
    charges = [h["charge"] for h in plan["hours"] if h["window"]]
    assert charges[0] == 0 and charges[-1] > 0


def test_holds_when_charging_does_not_pay() -> None:
    """Expensive nights: no charging, but the battery keeps its energy for the day."""
    plan = make_plan(
        plan_input(solar=4, soc=60, prices=Prices(night=0.27, day=0.29, feed_in=0.06))
    )
    assert plan["kind"] == "hold"
    assert plan["grid_charge_kwh"] == 0
    assert "not_worth" in plan["reasons"]
    window = [h for h in plan["hours"] if h["window"]]
    assert window[-1]["soc"] > window[-1]["soc_without"]


def test_block_keeps_the_battery_still() -> None:
    plan = make_plan(plan_input(solar=4, soc=60, discharge_mode="block"))
    socs = [h["soc"] for h in plan["hours"] if h["window"]]
    # Never down during the cheap window, only up when Joe charges.
    assert all(later >= earlier for earlier, later in zip(socs, socs[1:], strict=False))
    assert socs[0] == plan["soc_start"]


def test_highest_target_and_buffer() -> None:
    capped = make_plan(plan_input(solar=0, soc=15, max_target=40))
    assert capped["target"] == 40
    assert "limit_target" in capped["reasons"]
    plain = make_plan(plan_input(solar=8, soc=15))
    buffered = make_plan(plan_input(solar=8, soc=15, buffer=0.5))
    assert buffered["target"] == min(
        100, round(plain["optimum"] + 0.5 * (plain["optimum"] - 10))
    )


def test_grid_limit_starts_charging_earlier() -> None:
    free = make_plan(plan_input(solar=0, soc=15))
    tight = make_plan(plan_input(solar=0, soc=15, grid_limit_kw=1.4))
    assert tight["charge_from"] < free["charge_from"]


def test_evening_minimum_raises_the_target() -> None:
    expensive = Prices(night=0.28, day=0.29, feed_in=0.06)
    base = make_plan(plan_input(solar=6, soc=30, prices=expensive))
    evening = make_plan(plan_input(solar=6, soc=30, prices=expensive, evening_min=60))
    assert evening["target"] > base["target"]
    assert "evening" in evening["reasons"]


def test_without_plan_battery_runs_empty_before_the_sun() -> None:
    plan = make_plan(plan_input(solar=6, soc=40))
    assert plan["empty_without"] is not None
    assert plan["empty_without"] < plan["sun_takes_over"]


def test_simulation_keeps_energy_within_limits() -> None:
    inp = plan_input(solar=40, soc=50)
    run = simulate(inp, None)
    assert min(run.soc) >= 10 - 1e-6
    assert max(run.soc) <= 100 + 1e-6
    assert sum(run.grid_out) > 0


def test_next_window_over_midnight() -> None:
    from custom_components.energy_joe.plan.inputs import next_window

    window = {"start": "22:00", "end": "06:00"}
    start, end = next_window(berlin("2026-10-03T14:00"), window)
    assert (start.isoformat(), end.isoformat()) == (
        "2026-10-03T22:00:00+02:00",
        "2026-10-04T06:00:00+02:00",
    )
    # Inside the window it is the running one.
    start, _ = next_window(berlin("2026-10-04T03:00"), window)
    assert start.isoformat() == "2026-10-03T22:00:00+02:00"


async def test_consumption_from_similar_days(hass: HomeAssistant) -> None:
    from custom_components.energy_joe.observe.store import HistoryStore
    from custom_components.energy_joe.plan.inputs import (
        DEFAULT_PROFILE,
        async_consumption,
    )

    store = HistoryStore(hass)
    await store.async_load()
    profiles, meta = await async_consumption(store, berlin("2026-10-04T00:00").date())
    assert meta["source"] == "default" and profiles[True] == DEFAULT_PROFILE

    records = []
    for offset in range(1, 8):
        day = berlin("2026-10-04T00:00") - timedelta(days=offset)
        for hour in range(24):
            records.append(
                {
                    "start": (day + timedelta(hours=hour)).isoformat(),
                    "src": "stats",
                    "cov": 1.0,
                    "home": 2.0 if day.weekday() >= 5 else 1.0,
                }
            )
    await store.async_put_hours(records)
    profiles, meta = await async_consumption(store, berlin("2026-10-04T00:00").date())
    assert meta == {"source": "history", "days": 7}
    assert profiles[True][12] == pytest.approx(1.0)
    # Only two weekend days: too few on their own, so all days count.
    assert profiles[False][12] == pytest.approx((5 * 1.0 + 2 * 2.0) / 7)


async def test_solar_from_stored_hours_or_spread(hass: HomeAssistant) -> None:
    from custom_components.energy_joe import model
    from custom_components.energy_joe.observe.records import hour_starts
    from custom_components.energy_joe.observe.store import HistoryStore
    from custom_components.energy_joe.plan.inputs import async_solar

    await hass.config.async_set_time_zone("Europe/Berlin")
    hass.config.latitude, hass.config.longitude = 52.5, 13.4
    store = HistoryStore(hass)
    await store.async_load()
    config = model.default_config()
    day = berlin("2026-10-04T00:00")
    starts = hour_starts(day, day + timedelta(days=1))
    await store.async_update_day(
        "2026-10-04", fc={"hours": {(day + timedelta(hours=12)).isoformat(): 1500}}
    )
    values, meta = await async_solar(
        hass, config, store, starts, berlin("2026-10-03T23:45")
    )
    assert values[starts[12]] == 1.5 and meta["sources"]["2026-10-04"] == "hours"

    await store.async_update_day("2026-10-04", fc={"hours": None, "ahead_kwh": 12.0})
    values, meta = await async_solar(
        hass, config, store, starts, berlin("2026-10-03T23:45")
    )
    assert meta["sources"]["2026-10-04"] == "sum"
    assert sum(values.values()) == pytest.approx(12.0)
    assert values[starts[2]] == 0.0 and values[starts[13]] > values[starts[9]]


async def test_plan_is_fixed_before_the_window(
    ready_hass: HomeAssistant, freezer
) -> None:
    """At plan time Joe fixes tonight's plan and keeps it for the evaluation."""
    from pytest_homeassistant_custom_component.common import (
        MockConfigEntry,
        async_fire_time_changed,
    )

    from custom_components.energy_joe.const import DOMAIN

    hass = ready_hass
    await hass.config.async_set_time_zone("Europe/Berlin")
    freezer.move_to("2026-10-03T23:00:00+02:00")
    hass.states.async_set("sensor.soc", "20", {"unit_of_measurement": "%"})
    hass.states.async_set("sensor.grid", "300", {"unit_of_measurement": "W"})
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    runtime = hass.data[DOMAIN]
    runtime.async_update_config(
        {
            "measurements": {"grid_power": {"entity_id": "sensor.grid"}},
            "batteries": {
                "b1": {
                    "name": "Battery",
                    "adapter": "none",
                    "soc_entity": "sensor.soc",
                    "capacity_kwh": 10.0,
                }
            },
            "tariff": {
                "kind": "fixed_window",
                "window": {"start": "00:00", "end": "05:00"},
                "night_price": 0.1856,
                "day_price": 0.2857,
                "feed_in_price": 0.062,
            },
        },
        "user",
    )
    runtime.async_set_onboarding(step="done", completed=True)
    await hass.async_block_till_done()
    plan = runtime.state["plan"]
    assert plan["kind"] in ("charge", "hold", "none")
    assert plan["window"]["start"] == "2026-10-04T00:00:00+02:00"
    assert not plan.get("fixed")

    freezer.move_to("2026-10-03T23:45:01+02:00")
    async_fire_time_changed(hass, dt_util.utcnow())
    await hass.async_block_till_done()
    fixed = runtime.state["plan"]
    assert fixed["fixed"] is True
    day = await runtime.history.async_day("2026-10-04")
    assert day["plan"]["target"] == fixed["target"]
    assert await hass.config_entries.async_unload(entry.entry_id)


async def test_a_slow_run_does_not_undo_the_fixed_plan(hass: HomeAssistant) -> None:
    """A plan run that ends after tonight's plan was fixed leaves it fixed."""
    import asyncio

    from custom_components.energy_joe.observe.store import HistoryStore
    from custom_components.energy_joe.plan.scheduler import JoePlanner

    store = HistoryStore(hass)
    await store.async_load()
    planner = JoePlanner(hass, store, lambda: None)
    planner._config = model.default_config()
    release = asyncio.Event()
    window = {"start": "2026-10-04T00:00:00+02:00", "end": "2099-10-04T05:00:00+02:00"}

    async def compute(now: Any) -> dict[str, Any]:
        if not release.is_set():
            release.set()
            await asyncio.sleep(0)
            # The slow run: it finishes only after the plan was fixed.
            await asyncio.sleep(0.05)
            return {"kind": "none", "window": window, "slow": True}
        return {"kind": "charge", "window": window}

    planner._async_compute = compute  # type: ignore[method-assign]
    slow = hass.async_create_task(planner.async_refresh())
    await release.wait()
    await planner._async_fix()
    await slow
    assert planner.plan["fixed"] is True
    assert planner.plan["kind"] == "charge"
    if planner._commit:
        planner._commit()
    await store.async_unload()


def test_car_charging_is_not_planned_for_the_battery() -> None:
    """11 kWh into the car every evening must not look like the home's own use."""
    from custom_components.energy_joe.plan.inputs import consumption_profiles

    days = {}
    for offset in range(10):
        day = f"2026-09-{10 + offset:02d}"
        hours = []
        for hour in range(24):
            car = 11.0 if hour == 19 else 0.0
            hours.append(
                {
                    "start": f"{day}T{hour:02d}:00:00+02:00",
                    "home": 0.5 + car,
                    "use": {"wallbox": car},
                    "cov": 1.0,
                }
            )
        days[day] = {"hours": hours, "workday": True}
    with_car, _ = consumption_profiles(days)
    without, meta = consumption_profiles(days, ["wallbox"])
    assert with_car[True][19] == pytest.approx(11.5)
    assert without[True][19] == pytest.approx(0.5)
    assert meta["days"] == 10


def test_grid_friendly_batteries_take_the_midday_sun() -> None:
    """A sunny day: the battery waits for the midday sun and is still full by evening."""
    plan = make_plan(plan_input(solar=40, soc=30, grid_friendly=True, defer_kw=3.0))
    day = plan["day"]
    assert day is not None
    assert "2026-10-04T09:00" <= day["defer_until"] <= "2026-10-04T13:00"
    assert day["held_kwh"] >= 0.5
    hours = {h["start"][:16]: h for h in plan["hours"]}
    # In the morning the sun goes to the grid, the battery level stays.
    morning = [
        h for k, h in hours.items() if "2026-10-04T08:00" <= k < day["defer_until"]
    ]
    assert all(h["grid_out"] > 0 for h in morning if h["solar"] > h["home"])
    # By the evening it is full anyway.
    assert hours["2026-10-04T17:00"]["soc"] >= 99


def test_grid_friendly_waits_only_when_the_sun_is_enough() -> None:
    # A grey day: holding back would cost, so the battery takes the sun right away.
    assert (
        make_plan(plan_input(solar=8, soc=30, grid_friendly=True, defer_kw=3.0))["day"]
        is None
    )
    # Without a battery that can hold back charging, or switched off: nothing.
    assert make_plan(plan_input(solar=40, soc=30, grid_friendly=True))["day"] is None
    assert make_plan(plan_input(solar=40, soc=30, defer_kw=3.0))["day"] is None


def test_grid_first_may_wait_longer() -> None:
    saving = make_plan(plan_input(solar=16, soc=30, grid_friendly=True, defer_kw=3.0))
    grid = make_plan(
        plan_input(solar=16, soc=30, grid_friendly=True, grid_first=True, defer_kw=3.0)
    )
    assert grid["day"] is not None
    if saving["day"] is not None:
        assert grid["day"]["defer_until"] >= saving["day"]["defer_until"]
