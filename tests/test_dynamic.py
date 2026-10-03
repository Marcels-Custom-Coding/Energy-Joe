"""Dynamic tariffs: prices from many integrations, the best window, quarter hours."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

import pytest

from custom_components.energy_joe import model
from custom_components.energy_joe.control.executor import JoeExecutor, _charging_time
from custom_components.energy_joe.observe.store import HistoryStore
from custom_components.energy_joe.plan.inputs import (
    async_balance_due,
    async_build_input,
)
from custom_components.energy_joe.plan.planner import (
    Battery,
    Hour,
    PlanInput,
    Prices,
    charge_slots,
    make_plan,
)
from custom_components.energy_joe.plan.prices import (
    async_price_slots,
    from_attributes,
    parse_list,
    quarters,
)
from homeassistant.core import HomeAssistant, ServiceCall, SupportsResponse
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util


@pytest.fixture(autouse=True)
def berlin(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


def at(text: str) -> datetime:
    return datetime.fromisoformat(text)


# Prices of a typical autumn day (ct/kWh): expensive evening and morning, cheap night.
CURVE = [
    24, 23, 22, 21, 21, 22, 27, 33, 34, 30, 27, 25,
    24, 24, 25, 27, 30, 35, 38, 36, 32, 29, 27, 25,
]  # fmt: skip


def nordpool_attributes(day: str) -> dict[str, Any]:
    """Nord Pool from HACS: raw lists with datetimes, prices in cents."""
    start = at(f"{day}T00:00:00+02:00")
    raw = [
        {
            "start": start + timedelta(hours=h),
            "end": start + timedelta(hours=h + 1),
            "value": CURVE[h],
        }
        for h in range(24)
    ]
    return {"raw_today": raw, "unit_of_measurement": "c/kWh", "today": CURVE}


def test_price_lists_of_many_integrations() -> None:
    nordpool = from_attributes(nordpool_attributes("2026-10-04"), "c/kWh")
    assert len(nordpool) == 24 and nordpool[2].price == pytest.approx(0.22)
    # EPEX Spot: quarter hours with start and end as text, price per kWh.
    epex = parse_list(
        [
            {
                "start_time": f"2026-10-04T02:{m:02d}:00+02:00",
                "end_time": f"2026-10-04T02:{m + 15:02d}:00+02:00"
                if m < 45
                else "2026-10-04T03:00:00+02:00",
                "price_per_kwh": 0.20 + m / 1000,
            }
            for m in (0, 15, 30, 45)
        ],
        None,
    )
    assert [s.end - s.start for s in epex] == [timedelta(minutes=15)] * 4
    # ENTSO-E: "time" with a space, no end: the step decides.
    entsoe = parse_list(
        [
            {"time": "2026-10-04 00:00:00+02:00", "price": 0.11},
            {"time": "2026-10-04 01:00:00+02:00", "price": 0.10},
        ],
        "EUR/kWh",
    )
    assert entsoe[1].end == at("2026-10-04T02:00:00+02:00")
    # EUR per MWh becomes per kWh.
    assert parse_list(
        [
            {"start": "2026-10-04T00:00:00+02:00", "price": 250.0},
            {"start": "2026-10-04T01:00:00+02:00", "price": 120.0},
        ],
        "EUR/MWh",
    )[0].price == pytest.approx(0.25)
    # Hourly prices fill all four quarters, quarter prices their own.
    hour = at("2026-10-04T02:00:00+02:00")
    assert quarters(nordpool, hour, hour + timedelta(hours=1)) == [0.22] * 4
    assert quarters(epex, hour, hour + timedelta(hours=1)) == pytest.approx(
        [0.2, 0.215, 0.23, 0.245]
    )
    assert quarters(epex, hour - timedelta(minutes=15), hour) == [None]


async def test_prices_from_actions(hass: HomeAssistant) -> None:
    """Tibber and Nord Pool (Home Assistant) answer through actions."""
    registry = er.async_get(hass)
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    tibber_entry = MockConfigEntry(domain="tibber")
    tibber_entry.add_to_hass(hass)
    registry.async_get_or_create(
        "sensor",
        "tibber",
        "price_home",
        suggested_object_id="tibber_price",
        config_entry=tibber_entry,
    )

    def tibber_prices(call: ServiceCall) -> dict[str, Any]:
        return {
            "prices": {
                "Zuhause": [
                    {"start_time": "2026-10-04 00:00:00+02:00", "price": 0.31},
                    {"start_time": "2026-10-04 01:00:00+02:00", "price": 0.29},
                ]
            }
        }

    hass.services.async_register(
        "tibber", "get_prices", tibber_prices, supports_response=SupportsResponse.ONLY
    )
    day = at("2026-10-04T00:00:00+02:00").date()
    slots, source = await async_price_slots(
        hass, {"price_entity": "sensor.tibber_price", "surcharge": None}, day, day
    )
    assert source == "tibber" and [s.price for s in slots] == [0.31, 0.29]

    nordpool_entry = MockConfigEntry(domain="nordpool")
    nordpool_entry.add_to_hass(hass)
    registry.async_get_or_create(
        "sensor",
        "nordpool",
        "de_price",
        suggested_object_id="nordpool_price",
        config_entry=nordpool_entry,
    )
    asked: list[dict[str, Any]] = []

    def nordpool_prices(call: ServiceCall) -> dict[str, Any]:
        asked.append(dict(call.data))
        return {
            "DE-LU": [
                {
                    "start": f"{call.data['date']}T00:00:00+02:00",
                    "end": f"{call.data['date']}T00:15:00+02:00",
                    "price": 95.0,
                },
                {
                    "start": f"{call.data['date']}T00:15:00+02:00",
                    "end": f"{call.data['date']}T00:30:00+02:00",
                    "price": 90.0,
                },
            ]
        }

    hass.services.async_register(
        "nordpool",
        "get_prices_for_date",
        nordpool_prices,
        supports_response=SupportsResponse.ONLY,
    )
    slots, source = await async_price_slots(
        hass,
        {"price_entity": "sensor.nordpool_price", "surcharge": 0.18},
        day,
        day + timedelta(days=1),
    )
    assert source == "nordpool"
    assert asked[0]["config_entry"] == nordpool_entry.entry_id
    assert len(asked) == 2 and len(slots) == 4
    # 95 EUR/MWh plus 18 ct of fees and taxes.
    assert slots[0].price == pytest.approx(0.095 + 0.18)


def dynamic_input(soc: float = 20.0, **changes: Any) -> PlanInput:
    """21:00 in the evening, prices per hour from CURVE, a grey day tomorrow."""
    now = at("2026-10-03T21:00:00+02:00")
    hours = []
    for offset in range(24):
        start = now + timedelta(hours=offset)
        h = start.hour
        solar = max(0.0, 2.0 - abs(h - 13) * 0.4) if 8 <= h <= 18 else 0.0
        home = 0.4 if h < 6 else 1.0 if 17 <= h <= 21 else 0.6
        hours.append(
            Hour(
                start,
                solar,
                home,
                False,
                price=CURVE[h] / 100,
                quarters=(CURVE[h] / 100,) * 4,
            )
        )
    search = (now - timedelta(hours=1), at("2026-10-04T07:00:00+02:00"))
    return PlanInput(
        now=now,
        window_start=search[0],
        window_end=search[1],
        hours=hours,
        batteries=[Battery("b", "Speicher", 10.0, soc, 3.0, 3.0)],
        prices=Prices(0.21, 0.28, 0.08),
        buffer=0.0,
        search=search,
        **changes,
    )


def test_the_best_window_lies_in_the_cheap_night() -> None:
    plan = make_plan(dynamic_input())
    assert plan["tariff"] == "dynamic"
    assert plan["kind"] == "charge"
    start = at(plan["window"]["start"])
    end = at(plan["window"]["end"])
    # The cheapest hours are 03:00–05:00 (21 ct); the window holds them.
    assert start <= at("2026-10-04T03:00:00+02:00")
    assert end >= at("2026-10-04T05:00:00+02:00")
    assert end <= at("2026-10-04T07:00:00+02:00")
    # Charging happens in the cheapest quarter hours, not in the evening.
    first = at(plan["charge_slots"][0]["start"])
    assert first >= at("2026-10-04T02:00:00+02:00")
    assert plan["search"]["start"] == "2026-10-03T20:00:00+02:00"
    assert plan["hours"][0]["price"] == 0.29


def test_safety_limits_and_maintenance() -> None:
    # Above the highest price Joe does not charge from the grid.
    capped = make_plan(dynamic_input(max_price=0.20))
    assert capped["kind"] != "charge" and "max_price" in capped["reasons"]
    # A night that saves less than wanted is left alone.
    small = make_plan(dynamic_input(min_saving=5.0))
    assert small["kind"] == "none" and "small_saving" in small["reasons"]
    # Maintenance night: once full, unless the sun fills the battery anyway.
    full = make_plan(dynamic_input(force_target=100.0))
    assert full["target"] == 100 and "balance" in full["reasons"]


def test_quarter_slots_follow_the_cheapest_quarters() -> None:
    """1.5 kWh at 3 kW take two quarters: the two cheapest of the hour."""
    inp = dynamic_input()
    charges = [0.0] * len(inp.hours)
    index = next(i for i, h in enumerate(inp.hours) if h.start.hour == 4)
    inp.hours[index].quarters = (0.25, 0.19, 0.18, 0.26)
    charges[index] = 1.5
    assert charge_slots(inp, charges, 3.0) == [
        {"start": "2026-10-04T04:15+02:00", "end": "2026-10-04T04:45+02:00"}
    ]
    # Without quarter prices: as late as possible in the hour.
    inp.hours[index].quarters = ()
    assert charge_slots(inp, charges, 3.0) == [
        {"start": "2026-10-04T04:30+02:00", "end": "2026-10-04T05:00+02:00"}
    ]


def test_charging_time_follows_the_slots() -> None:
    plan = {
        "kind": "charge",
        "charge_slots": [
            {"start": "2026-10-04T02:00+02:00", "end": "2026-10-04T02:30+02:00"},
            {"start": "2026-10-04T04:00+02:00", "end": "2026-10-04T04:45+02:00"},
        ],
    }
    assert _charging_time(plan, at("2026-10-04T02:10:00+02:00"))
    assert not _charging_time(plan, at("2026-10-04T03:00:00+02:00"))
    assert _charging_time(plan, at("2026-10-04T04:30:00+02:00"))
    # After the last slot Joe keeps charging until the target is reached.
    assert _charging_time(plan, at("2026-10-04T05:00:00+02:00"))
    assert not _charging_time({**plan, "kind": "hold"}, at("2026-10-04T02:10+02:00"))


async def test_plan_input_for_a_dynamic_tariff(hass: HomeAssistant, freezer) -> None:
    await hass.config.async_set_time_zone("Europe/Berlin")
    freezer.move_to("2026-10-03T21:00:00+02:00")
    attributes = nordpool_attributes("2026-10-03")
    attributes["raw_tomorrow"] = nordpool_attributes("2026-10-04")["raw_today"]
    hass.states.async_set("sensor.nordpool", "29", attributes)
    hass.states.async_set("sensor.soc", "20", {"unit_of_measurement": "%"})
    store = HistoryStore(hass)
    await store.async_load()
    config = model.apply_update(
        model.default_config(),
        {
            "batteries": {
                "b1": {
                    "name": "Speicher",
                    "adapter": "none",
                    "soc_entity": "sensor.soc",
                    "capacity_kwh": 10.0,
                }
            },
            "tariff": {
                "kind": "dynamic",
                "price_entity": "sensor.nordpool",
                "feed_in_price": 0.08,
            },
        },
        "user",
    )
    inp, notes = await async_build_input(hass, config, store, dt_util.now())
    assert inp is not None, notes
    assert inp.search == (
        at("2026-10-03T20:00:00+02:00"),
        at("2026-10-04T07:00:00+02:00"),
    )
    window = [h for h in inp.hours if h.window]
    assert window and all(h.price is not None for h in window)
    assert inp.window_start >= at("2026-10-03T21:00:00+02:00")
    plan = make_plan(inp)
    assert plan["tariff"] == "dynamic" and plan["search"]
    # Without prices there is nothing to plan.
    hass.states.async_set("sensor.nordpool", "29", {})
    inp, notes = await async_build_input(hass, config, store, dt_util.now())
    assert inp is None and "no_prices" in notes
    await store.async_unload()


async def test_maintenance_is_due_after_days_without_full(
    hass: HomeAssistant, freezer
) -> None:
    await hass.config.async_set_time_zone("Europe/Berlin")
    freezer.move_to("2026-10-20T12:00:00+02:00")
    store = HistoryStore(hass)
    await store.async_load()
    config = model.apply_update(
        model.default_config(),
        {
            "batteries": {
                "b1": {
                    "name": "Speicher",
                    "adapter": "none",
                    "soc_entity": "sensor.soc",
                }
            },
            "rules": {"balance_days": 14},
        },
        "user",
    )
    today = dt_util.now().date()

    async def put(day: int, soc: float) -> None:
        start = dt_util.start_of_local_day(today - timedelta(days=day))
        await store.async_put_hours(
            [
                {
                    "start": (start + timedelta(hours=12)).isoformat(),
                    "src": "live",
                    "cov": 1.0,
                    "home": 0.5,
                    "bat": {"b1": {"soc": soc}},
                }
            ]
        )

    # Only a few days known: too early to tell.
    await put(3, 80)
    assert not await async_balance_due(store, config, today)
    await put(16, 70)
    assert await async_balance_due(store, config, today)
    await put(5, 100)
    assert not await async_balance_due(store, config, today)
    await store.async_unload()


async def test_the_main_fuse_pauses_charging(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-10-04T02:10:00+02:00")
    hass.states.async_set("sensor.grid", "12500", {"unit_of_measurement": "W"})
    config = model.apply_update(
        model.default_config(),
        {
            "measurements": {"grid_power": {"entity_id": "sensor.grid"}},
            "rules": {"grid_limit_w": 11000},
        },
        "user",
    )
    executor = JoeExecutor(
        hass, lambda: config, lambda: None, lambda: "live", lambda: None
    )
    await executor.async_load()
    from custom_components.energy_joe.control.adapters import Desired

    now = dt_util.now()
    desired = {"b": Desired(charge_to=80, span_s=3600)}
    held = executor._guard_grid(config, desired, {"b": 41.6}, now)
    assert held["b"].charge_to is None and held["b"].floor == 41
    assert executor.data["log"][-1]["kind"] == "grid_guard"
    # Below the limit again, the pause lasts its five minutes, then charging goes on.
    hass.states.async_set("sensor.grid", "6000", {"unit_of_measurement": "W"})
    assert executor._guard_grid(config, desired, {"b": 42}, now)["b"].charge_to is None
    later = now + timedelta(minutes=6)
    assert executor._guard_grid(config, desired, {"b": 43}, later)["b"].charge_to == 80
    # Switched off: no guard.
    off = model.apply_update(config, {"rules": {"guard_grid": False}}, "user")
    hass.states.async_set("sensor.grid", "12500", {"unit_of_measurement": "W"})
    assert executor._guard_grid(off, desired, {"b": 43}, later)["b"].charge_to == 80


async def test_a_battery_that_does_not_rise_is_reported(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-04T02:00:00+02:00")
    config = model.default_config()
    executor = JoeExecutor(
        hass, lambda: config, lambda: None, lambda: "live", lambda: None
    )
    await executor.async_load()
    told: list[tuple[str, dict[str, Any]]] = []

    class Notifier:
        async def async_problem(self, kind: str, **values: Any) -> None:
            told.append((kind, values))

        async def async_clear(self, kind: str) -> None:
            told.append((f"clear:{kind}", {}))

    executor.notifier = Notifier()
    from custom_components.energy_joe.control.adapters import Desired

    items = [({"id": "b", "name": "Speicher"}, {}, None)]
    desired = {"b": Desired(charge_to=80)}
    start = dt_util.now()
    await executor._async_watch_progress(items, desired, {"b": 40.0}, start)
    await executor._async_watch_progress(
        items, desired, {"b": 40.4}, start + timedelta(minutes=20)
    )
    assert told == []
    await executor._async_watch_progress(
        items, desired, {"b": 40.5}, start + timedelta(minutes=31)
    )
    assert told == [("no_progress", {"battery": "Speicher"})]
    # Only once a night; when it rises again the hint goes away.
    await executor._async_watch_progress(
        items, desired, {"b": 40.6}, start + timedelta(minutes=50)
    )
    await executor._async_watch_progress(
        items, desired, {"b": 42.0}, start + timedelta(minutes=55)
    )
    assert [kind for kind, _ in told] == ["no_progress", "clear:no_progress"]


async def test_the_dynamic_plan_is_fixed_before_the_search_span(
    ready_hass: HomeAssistant, freezer
) -> None:
    from pytest_homeassistant_custom_component.common import (
        MockConfigEntry,
        async_fire_time_changed,
    )

    from custom_components.energy_joe.const import DOMAIN

    hass = ready_hass
    await hass.config.async_set_time_zone("Europe/Berlin")
    freezer.move_to("2026-10-03T19:00:00+02:00")
    attributes = nordpool_attributes("2026-10-03")
    attributes["raw_tomorrow"] = nordpool_attributes("2026-10-04")["raw_today"]
    hass.states.async_set("sensor.nordpool", "35", attributes)
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
                    "name": "Speicher",
                    "adapter": "none",
                    "soc_entity": "sensor.soc",
                    "capacity_kwh": 10.0,
                }
            },
            "tariff": {
                "kind": "dynamic",
                "price_entity": "sensor.nordpool",
                "feed_in_price": 0.08,
            },
        },
        "user",
    )
    runtime.async_set_onboarding(step="done", completed=True)
    await hass.async_block_till_done()
    plan = runtime.state["plan"]
    assert plan["tariff"] == "dynamic" and not plan.get("fixed")

    freezer.move_to("2026-10-03T19:45:01+02:00")
    async_fire_time_changed(hass, dt_util.utcnow())
    await hass.async_block_till_done()
    fixed = runtime.state["plan"]
    assert fixed["fixed"] is True
    assert fixed["search"]["start"] == "2026-10-03T20:00:00+02:00"
    night = at(fixed["window"]["start"]).date().isoformat()
    day = await runtime.history.async_day(night)
    assert day["plan"]["window"] == fixed["window"]
    assert await hass.config_entries.async_unload(entry.entry_id)
