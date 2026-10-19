"""Charging together at night: who gets how much, when and how fast."""

from __future__ import annotations

from dataclasses import replace
from datetime import datetime, timedelta
import math
from typing import Any

import pytest

from custom_components.energy_joe.control.adapters import make_adapter
from custom_components.energy_joe.control.executor import _battery_charging
from custom_components.energy_joe.plan import night
from custom_components.energy_joe.plan.inputs import PEAK_DAYS, grid_limit
from custom_components.energy_joe.plan.planner import (
    Battery,
    _price,
    make_plan,
    night_slots,
    simulate,
)
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.util import dt as dt_util

from .test_control import (
    configured,
    fronius_battery,
    install_devices,
    make_executor,
    venus_battery,
)
from .test_plan import berlin, plan_input

WINDOW_END = "2026-10-04T05:00+02:00"


@pytest.fixture(autouse=True)
def berlin_time(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


def two(**changes: Any) -> list[Battery]:
    """A BYD (Fronius) and a Venus (Omnibattery), both nearly empty."""
    byd = Battery("byd", "BYD", 10.0, 15, 3.0, 3.0, group="fronius")
    venus = Battery("venus", "Venus", 5.0, 15, 2.5, 2.5, group="omni")
    return [
        replace(byd, **changes.get("byd", {})),
        replace(venus, **changes.get("venus", {})),
    ]


def by_id(plan: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {b["id"]: b for b in plan["batteries"]}


def stored(plan: dict[str, Any], battery: dict[str, Any]) -> float:
    return battery["capacity"] * battery["target"] / 100


def test_the_first_to_discharge_gets_first() -> None:
    """The Venus discharges first by day: it is filled first, the BYD gets the rest."""
    plan = make_plan(
        plan_input(solar=3, soc=15, batteries=two(), order=["venus", "byd"])
    )
    assert plan["kind"] == "charge"
    found = by_id(plan)
    assert found["venus"]["target"] == 100
    assert 15 < found["byd"]["target"] < 100
    # Together they take what the plan needs (rounded up to whole percent).
    total = sum(b["charge_kwh"] for b in found.values())
    assert total == pytest.approx(plan["grid_charge_kwh"] * math.sqrt(0.9), abs=0.05)
    # The other order: the BYD first.
    other = by_id(
        make_plan(plan_input(solar=3, soc=15, batteries=two(), order=["byd", "venus"]))
    )
    assert other["byd"]["target"] > found["byd"]["target"]
    assert other["venus"]["target"] < 100


def test_one_system_rises_together() -> None:
    """Two batteries of one Omnibattery share their part by their room."""
    batteries = two(byd={"group": "omni", "capacity": 5.0})
    plan = make_plan(plan_input(solar=3, soc=15, batteries=batteries))
    found = by_id(plan)
    assert abs(found["byd"]["target"] - found["venus"]["target"]) <= 1


def test_flat_price_charges_as_slowly_as_it_may() -> None:
    plan = make_plan(plan_input(solar=3, soc=20))
    (battery,) = plan["batteries"]
    assert battery["how"] == "spread"
    (span,) = battery["slots"]
    start, end = (
        datetime.fromisoformat(span["start"]),
        datetime.fromisoformat(span["end"]),
    )
    hours = (end - start).total_seconds() / 3600
    # What it needs over the whole window but its last half hour, plus 15 %.
    needed = battery["grid_kwh"] / hours
    assert span["power_kw"] == pytest.approx(needed * 1.15, abs=0.02)
    assert span["end"] == "2026-10-04T04:30+02:00"
    assert span["power_kw"] < battery["max_kw"]


def test_little_energy_comes_with_a_fifth_of_the_power() -> None:
    """Below 20 % of its highest power: shorter, not slower."""
    plan = make_plan(
        plan_input(solar=8, soc=40, batteries=[Battery("b", "B", 10.0, 40, 5.0, 5.0)])
    )
    (battery,) = plan["batteries"]
    if plan["kind"] != "charge":
        pytest.skip("nothing to charge on this day")
    assert min(s["power_kw"] for s in battery["slots"]) >= 0.2 * 5.0 - 0.01
    total = sum(
        (
            datetime.fromisoformat(s["end"]) - datetime.fromisoformat(s["start"])
        ).total_seconds()
        for s in battery["slots"]
    )
    assert total < 4.5 * 3600


def test_share_keeps_the_least_power() -> None:
    start = berlin("2026-10-04T00:00")
    slots = [
        night.Slot(
            start + timedelta(minutes=15 * q),
            start + timedelta(minutes=15 * (q + 1)),
            0.25,
            0.2,
            math.inf,
            q // 4,
        )
        for q in range(16)
    ]
    taker = night.Taker("b", "b", 5.0, room=10.0)
    assert night.share(slots, [taker], 1.0) == pytest.approx(0.0)
    assert taker.taken == pytest.approx(1.0)
    # 1 kWh in 4 h would be 0.25 kW: 1 kW (a fifth) for an hour instead,
    # as late as possible.
    assert min(taker.rates.values()) >= 1.0 - 1e-6
    assert len(taker.rates) == 4
    assert night.how(slots, taker) == "short"


def varied(**changes: Any):
    """The fixed window with a price of its own for each hour."""
    inp = plan_input(solar=2, soc=15, **changes)
    prices = {0: 0.25, 1: 0.20, 2: 0.22, 3: 0.18, 4: 0.30}
    for hour in inp.hours:
        if hour.window:
            hour.price = prices[dt_util.as_local(hour.start).hour]
    return inp


def old_cost(inp) -> float:
    """What the old way costs: every battery at full power in the cheapest hours."""
    plan = make_plan(inp)
    run = simulate(inp, inp.capacity * plan["target"] / 100)
    return sum(c * _price(inp, h) for c, h in zip(run.charge, inp.hours, strict=True))


@pytest.mark.parametrize("batteries", [None, "two"])
def test_costs_never_rise(batteries: str | None) -> None:
    changes = {"batteries": two(), "order": ["venus", "byd"]} if batteries else {}
    inp = varied(**changes)
    plan = make_plan(inp)
    assert plan["kind"] == "charge"
    assert plan["cost"]["night_charge"] <= old_cost(varied(**changes)) + 0.01
    # In the cheapest hours first: 03:00 (18 ct), then 01:00 (20 ct) ...
    hours = {h["start"][11:13]: h["charge"] for h in plan["hours"] if h["window"]}
    assert hours["03"] >= hours["01"] >= hours["02"] >= hours["00"]
    assert hours["04"] == 0
    for battery in plan["batteries"]:
        if battery["slots"]:
            assert battery["how"] in ("cheapest", "full")
    # Flat prices: the same cost as before, too.
    flat = plan_input(solar=3, soc=15, **changes)
    assert (
        make_plan(flat)["cost"]["night_charge"]
        <= old_cost(plan_input(solar=3, soc=15, **changes)) + 0.01
    )


def test_quarter_prices_are_used() -> None:
    """Within an hour the cheaper quarters first (the old slots did so too)."""
    inp = varied(batteries=[Battery("b", "B", 10.0, 50, 3.0, 3.0)], max_target=60)
    for hour in inp.hours:
        if hour.window and dt_util.as_local(hour.start).hour == 3:
            hour.quarters = (0.18, 0.10, 0.10, 0.18)
    slots = night_slots(inp)
    taker = night.Taker("b", "b", 3.0, room=1.0)
    night.share(slots, [taker], 1.0)
    used = sorted(slots[i].start.minute for i in taker.energy)
    assert used == [15, 30]


def test_the_grid_connection_holds() -> None:
    """Both batteries plus the home stay below the limit in every quarter."""
    inp = plan_input(solar=0, soc=15, batteries=two(), grid_limit_kw=3.0)
    plan = make_plan(inp)
    by_start: dict[str, float] = {}
    for battery in plan["batteries"]:
        for span in battery["slots"]:
            moment = datetime.fromisoformat(span["start"])
            while moment < datetime.fromisoformat(span["end"]):
                key = moment.isoformat()
                by_start[key] = by_start.get(key, 0.0) + span["power_kw"]
                moment += timedelta(minutes=15)
    assert by_start
    home = 0.4
    assert max(by_start.values()) + home <= 3.0 + 1e-6


def test_a_battery_without_power_charges_at_full_power() -> None:
    plan = make_plan(
        plan_input(
            solar=3,
            soc=20,
            batteries=[Battery("b", "B", 10.0, 20, 3.0, 3.0, paced=False)],
        )
    )
    (battery,) = plan["batteries"]
    assert battery["how"] == "fixed_power"
    assert {s["power_kw"] for s in battery["slots"]} == {3.0}
    # As late as possible (but before the last half hour where it fits).
    assert battery["slots"][-1]["end"] == "2026-10-04T04:30+02:00"


def test_a_maintenance_night_fills_every_battery() -> None:
    plan = make_plan(
        plan_input(solar=3, soc=15, batteries=two(), order=["venus"], force_target=100)
    )
    assert "balance" in plan["reasons"]
    assert {b["target"] for b in plan["batteries"]} == {100}


def test_one_after_the_other_in_the_evening() -> None:
    """With "Nacheinander" the evening comes out of the first battery only."""
    inp = plan_input(
        solar=3,
        soc=60,
        batteries=two(byd={"soc": 60}, venus={"soc": 60}),
        order=["venus", "byd"],
        sequence=True,
        now=berlin("2026-10-03T18:00"),
    )
    plan = make_plan(inp)
    found = by_id(plan)
    assert found["venus"]["soc_start"] < found["byd"]["soc_start"]


def test_the_learned_grid_limit_waits_a_week() -> None:
    now = berlin("2026-10-10T12:00")
    peak = {"w": 7200, "since": (now - timedelta(days=PEAK_DAYS - 1)).isoformat()}
    assert grid_limit({"grid_limit_w": None}, peak, now) == (None, None)
    peak["since"] = (now - timedelta(days=PEAK_DAYS)).isoformat()
    assert grid_limit({"grid_limit_w": None}, peak, now) == (7.2, "learned")
    # The user's own limit always wins.
    assert grid_limit({"grid_limit_w": 11000}, peak, now) == (11.0, "user")


def test_each_battery_in_its_own_spans() -> None:
    plan = {"kind": "charge"}
    planned = {
        "slots": [
            {
                "start": "2026-10-04T01:00+02:00",
                "end": "2026-10-04T03:00+02:00",
                "power_kw": 0.9,
            },
            {
                "start": "2026-10-04T03:00+02:00",
                "end": "2026-10-04T04:00+02:00",
                "power_kw": 2.0,
            },
        ]
    }
    at = datetime.fromisoformat
    assert _battery_charging(plan, planned, at("2026-10-04T00:30+02:00")) == (
        False,
        None,
    )
    assert _battery_charging(plan, planned, at("2026-10-04T01:30+02:00")) == (True, 0.9)
    assert _battery_charging(plan, planned, at("2026-10-04T03:30+02:00")) == (True, 2.0)
    # After its last span: at full power until it reaches its target.
    assert _battery_charging(plan, planned, at("2026-10-04T04:10+02:00")) == (
        True,
        None,
    )
    assert _battery_charging(plan, {"slots": []}, at("2026-10-04T02:00+02:00")) == (
        False,
        None,
    )


# --- the executor ---------------------------------------------------------------


def capped_fronius() -> dict[str, Any]:
    battery = fronius_battery()
    battery["controls"] = {
        **battery["controls"],
        "charge_limit": "number.charge_limit",
        "charge_limit_enabled": "switch.charge_limit",
    }
    battery["limit_ref_w"] = 5000
    return battery


def install_limit(hass: HomeAssistant) -> list[tuple[str, Any]]:
    """The Fronius charge limit (in %) and a record of every write in order."""
    install_devices(hass)
    percent = {"min": 0, "max": 100, "step": 1, "unit_of_measurement": "%"}
    hass.states.async_set("number.charge_limit", "100", percent)
    hass.states.async_set("switch.charge_limit", "off")
    calls: list[tuple[str, Any]] = []

    def keep(call: ServiceCall, value: str) -> None:
        entity_id = call.data["entity_id"]
        if isinstance(entity_id, list):
            entity_id = entity_id[0]
        calls.append((entity_id, value))
        state = hass.states.get(entity_id)
        hass.states.async_set(entity_id, value, state.attributes if state else {})

    hass.services.async_register(
        "number", "set_value", lambda call: keep(call, str(float(call.data["value"])))
    )
    hass.services.async_register("switch", "turn_on", lambda call: keep(call, "on"))
    hass.services.async_register("switch", "turn_off", lambda call: keep(call, "off"))
    return calls


def spans_plan(
    now: datetime, byd_kw: float = 1.0, venus_kw: float = 0.8
) -> dict[str, Any]:
    start = dt_util.start_of_local_day(now)

    def iso(hours: float) -> str:
        return (start + timedelta(hours=hours)).isoformat(timespec="minutes")

    return {
        "kind": "charge",
        "fixed": True,
        "target": 60,
        "window": {
            "start": start.isoformat(),
            "end": (start + timedelta(hours=5)).isoformat(),
        },
        "charge_slots": [{"start": iso(1), "end": iso(4)}],
        "rules": {"discharge_mode": "until_target"},
        "batteries": [
            {
                "id": "byd",
                "target": 60,
                "power_kw": byd_kw,
                "slots": [{"start": iso(1), "end": iso(4), "power_kw": byd_kw}],
            },
            {
                "id": "venus",
                "target": 80,
                "power_kw": venus_kw,
                "slots": [{"start": iso(2), "end": iso(4), "power_kw": venus_kw}],
            },
        ],
    }


async def test_each_battery_charges_with_its_own_power(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-04T02:30:00+02:00")
    install_limit(hass)
    config = configured(capped_fronius(), venus_battery())
    executor, _ = await make_executor(hass, config, spans_plan(dt_util.now()))
    await executor.async_check()
    status = executor.status["batteries"]
    assert status["byd"]["action"] == "charge" and status["venus"]["action"] == "charge"
    assert status["venus"]["power_w"] == 800
    assert float(hass.states.get("number.charge_power").state) == 800
    assert hass.states.get("number.charge_cutoff").state == "80.0"
    # The Fronius: its reserve raised, its charge limit as the ceiling (1 kW of 5 kW).
    assert hass.states.get("number.reserve").state == "60.0"
    assert hass.states.get("number.charge_limit").state == "20.0"
    assert hass.states.get("switch.charge_limit").state == "on"


async def test_the_fronius_ceiling_goes_on_and_off_in_order(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-04T01:30:00+02:00")
    calls = install_limit(hass)
    config = configured(capped_fronius())
    plan = spans_plan(dt_util.now())
    plan["batteries"] = plan["batteries"][:1]
    executor, holder = await make_executor(hass, config, plan)
    await executor.async_check()
    limit = [c for c in calls if c[0] in ("number.charge_limit", "switch.charge_limit")]
    # The value first, then the switch (Fronius ignores a limit while it is off),
    # and before the reserve goes up.
    assert limit == [("number.charge_limit", "20.0"), ("switch.charge_limit", "on")]
    assert calls.index(limit[-1]) < calls.index(("number.reserve", "60.0"))
    assert executor.data["saved"]["number.charge_limit"] == 100.0
    assert executor.data["saved"]["switch.charge_limit"] is False

    # Reached: the ceiling back (the switch off first, then the value), then
    # the limit serves the wait at the target (at 0, its switch on).
    calls.clear()
    hass.states.async_set("sensor.byd_soc", "60", {"unit_of_measurement": "%"})
    await executor.async_check()
    limit = [c for c in calls if c[0] in ("number.charge_limit", "switch.charge_limit")]
    assert limit == [
        ("switch.charge_limit", "off"),
        ("number.charge_limit", "100.0"),
        ("number.charge_limit", "0.0"),
        ("switch.charge_limit", "on"),
    ]
    assert executor.data["saved"]["number.charge_limit"] == 100.0
    assert executor.data["saved"]["switch.charge_limit"] is False


async def test_a_ceiling_that_does_not_hold_is_noted(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-04T01:00:00+02:00")
    install_limit(hass)
    config = configured(capped_fronius())
    plan = spans_plan(dt_util.now())
    plan["batteries"] = plan["batteries"][:1]
    executor, holder = await make_executor(hass, config, plan)
    found: list[tuple[str, str]] = []
    executor.on_night_cap = lambda key, state: found.append((key, state))
    await executor.async_check()
    assert hass.states.get("switch.charge_limit").state == "on"
    # The battery takes 4 kW while its limit says 1 kW.
    hass.states.async_set("sensor.byd_power", "4000", {"unit_of_measurement": "W"})
    for minutes in (7, 9, 13):
        freezer.move_to(f"2026-10-04T01:{minutes:02d}:00+02:00")
        await executor.async_check()
    assert found == [("byd", "ignored")]
    assert executor.status["batteries"]["byd"]["cap"]["state"] == "ignored"
    # The limit is back as it was; the battery keeps charging to its target.
    assert hass.states.get("switch.charge_limit").state == "off"
    assert hass.states.get("number.charge_limit").state == "100.0"
    assert hass.states.get("number.reserve").state == "60.0"
    kinds = [entry["kind"] for entry in executor.data["log"]]
    assert "night_cap_ignored" in kinds
    # From now on Joe plans it at full power.
    noted = {**capped_fronius(), "night_cap": "ignored"}
    assert make_adapter(noted).power_lever(hass) is None
    assert make_adapter(capped_fronius()).power_lever(hass) == "cap"


async def test_a_ceiling_that_holds_is_noted_too(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-10-04T01:00:00+02:00")
    install_limit(hass)
    config = configured(capped_fronius())
    plan = spans_plan(dt_util.now())
    plan["batteries"] = plan["batteries"][:1]
    executor, _ = await make_executor(hass, config, plan)
    found: list[tuple[str, str]] = []
    executor.on_night_cap = lambda key, state: found.append((key, state))
    await executor.async_check()
    hass.states.async_set("sensor.byd_power", "980", {"unit_of_measurement": "W"})
    for minutes in (8, 20):
        freezer.move_to(f"2026-10-04T01:{minutes:02d}:00+02:00")
        await executor.async_check()
    assert found == [("byd", "works")]
    assert hass.states.get("switch.charge_limit").state == "on"


async def test_without_a_reference_no_ceiling(hass: HomeAssistant, freezer) -> None:
    """A limit in % without knowing what 100 % stand for: full power, as before."""
    install_limit(hass)
    battery = {**capped_fronius(), "limit_ref_w": None}
    adapter = make_adapter(battery)
    assert adapter.night_cap_problem(hass) == "need_ref"
    assert adapter.power_lever(hass) is None
    assert make_adapter(venus_battery()).power_lever(hass) == "power"


async def test_the_highest_import_is_noted(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-10-04T12:00:00+02:00")
    install_devices(hass)
    config = configured(venus_battery())
    config["measurements"]["grid_power"] = {
        "entity_id": "sensor.grid",
        "invert": False,
        "minus_entity_id": None,
    }
    hass.states.async_set("sensor.grid", "2500", {"unit_of_measurement": "W"})
    executor, _ = await make_executor(hass, config, None)
    await executor.async_check()
    assert executor.data["grid_peak"]["w"] == 2500
    since = executor.data["grid_peak"]["since"]
    hass.states.async_set("sensor.grid", "-3000", {"unit_of_measurement": "W"})
    await executor.async_check()
    hass.states.async_set("sensor.grid", "6100", {"unit_of_measurement": "W"})
    freezer.move_to("2026-10-05T19:00:00+02:00")
    await executor.async_check()
    assert executor.data["grid_peak"]["w"] == 6100
    assert executor.data["grid_peak"]["since"] == since
    assert executor.view["grid_peak"]["w"] == 6100
