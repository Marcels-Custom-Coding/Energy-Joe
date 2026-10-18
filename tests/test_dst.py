"""The nights the clocks change: Joe counts in UTC, the wall clock is for showing.

25.10.2026 the hour 02:00–03:00 comes twice (the night 22–06 has nine
hours), 29.03.2026 and 28.03.2027 it is missing (seven hours).
"""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from typing import Any

import pytest

from custom_components.energy_joe.control.executor import _battery_charging
from custom_components.energy_joe.observe.records import hour_starts
from custom_components.energy_joe.plan.actions import (
    plan_actions,
    reserved_kw,
    reserved_quarters,
)
from custom_components.energy_joe.plan.planner import (
    Battery,
    Hour,
    PlanInput,
    Prices,
    make_plan,
    night_slots,
)
from custom_components.energy_joe.plan.prices import parse_list, quarters
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

NIGHTS = {
    # Evening's day: (hours of the window 22–06, quarters).
    "2026-10-24": (9, 36),
    "2026-03-28": (7, 28),
    "2027-03-27": (7, 28),
    "2026-10-03": (8, 32),
}
PRICES = Prices(night=0.18, day=0.32, feed_in=0.07)


@pytest.fixture(autouse=True)
def berlin_time(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


def local(text: str) -> datetime:
    return datetime.fromisoformat(text).replace(tzinfo=dt_util.get_default_time_zone())


def night_input(evening: str, **changes: Any) -> PlanInput:
    """21:00 on the evening, the window 22–06; hours like inputs.py builds them
    (local starts stepped in UTC) up to the next evening, no sun; the home
    uses 0.4 kWh an hour at night and 2 kWh by day."""
    now = local(f"{evening}T21:00")
    start = local(f"{evening}T22:00")
    morning = (start + timedelta(days=1)).date().isoformat()
    end = local(f"{morning}T06:00")
    hours = [
        Hour(moment, 0.0, 0.4 if start <= moment < end else 2.0, start <= moment < end)
        for moment in hour_starts(now, local(f"{morning}T21:00"))
    ]
    values: dict[str, Any] = {
        "now": now,
        "window_start": start,
        "window_end": end,
        "hours": hours,
        "batteries": [Battery("b", "Battery", 50.0, 10.0, 10.0, 10.0)],
        "prices": PRICES,
        "buffer": 0.0,
    }
    values.update(changes)
    return PlanInput(**values)


@pytest.mark.parametrize("evening", list(NIGHTS))
def test_the_window_has_its_real_quarters(evening: str) -> None:
    """Unique UTC starts, no gap, no overlap, the real length of the night."""
    hours, count = NIGHTS[evening]
    inp = night_input(evening)
    slots = night_slots(inp)
    assert len(slots) == count
    starts = [dt_util.as_utc(s.start) for s in slots]
    assert len(set(starts)) == count
    assert all(a.end == b.start for a, b in zip(slots, slots[1:], strict=False))
    assert slots[0].start == inp.window_start
    assert slots[-1].end == inp.window_end
    assert sum(s.hours for s in slots) == pytest.approx(hours)
    assert (inp.window_end - inp.window_start) == timedelta(hours=hours)
    # Every slot lies in its own hour.
    for slot in slots:
        hour = inp.hours[slot.hour].start
        assert hour <= slot.start < hour + timedelta(hours=1)


def test_the_hour_twice_gets_both_hours() -> None:
    """Autumn: 02:00+02:00 and 02:00+01:00 are two hours with their own slots."""
    inp = night_input("2026-10-24")
    shown = [dt_util.as_local(h.start).isoformat() for h in inp.hours]
    assert "2026-10-25T02:00:00+02:00" in shown
    assert "2026-10-25T02:00:00+01:00" in shown
    assert len(set(shown)) == len(shown)
    plan = make_plan(inp)
    starts = [h["start"] for h in plan["hours"]]
    assert len(set(starts)) == len(starts)
    assert sum(1 for h in plan["hours"] if h["window"]) == 9


def test_spring_has_no_missing_hour() -> None:
    """Spring: after 01:00+01:00 comes 03:00+02:00, no 02:00 at all."""
    inp = night_input("2026-03-28")
    shown = [dt_util.as_local(h.start).isoformat() for h in inp.hours if h.window]
    assert shown[3:5] == ["2026-03-29T01:00:00+01:00", "2026-03-29T03:00:00+02:00"]
    assert not any("T02:" in text for text in shown)


@pytest.mark.parametrize("evening", list(NIGHTS))
def test_grid_limit_holds_in_every_real_quarter(evening: str) -> None:
    """A big empty battery and a 3 kW limit: in no real quarter more than the
    limit after the home; the night with nine hours takes more."""
    hours, count = NIGHTS[evening]
    plan = make_plan(night_input(evening, grid_limit_kw=3.0))
    assert plan["kind"] == "charge"
    (battery,) = plan["batteries"]
    power: dict[datetime, float] = {}
    for span in battery["slots"]:
        moment = dt_util.as_utc(datetime.fromisoformat(span["start"]))
        end = dt_util.as_utc(datetime.fromisoformat(span["end"]))
        while moment < end:
            assert moment not in power
            power[moment] = span["power_kw"]
            moment += timedelta(minutes=15)
    assert power
    assert max(power.values()) <= 3.0 - 0.4 + 1e-6
    # Every quarter of the window can be used, also the second 02:00 hour.
    assert len(power) == count
    assert battery["grid_kwh"] == pytest.approx(sum(power.values()) / 4, abs=0.05)
    assert battery["grid_kwh"] <= (3.0 - 0.4) * hours + 1e-6
    # What it costs: the energy at the night price.
    assert plan["cost"]["night_charge"] == pytest.approx(
        battery["grid_kwh"] * PRICES.night, abs=0.02
    )


def test_a_normal_night_stays_as_it_was() -> None:
    """No clock change: the same local times as before, eight hours."""
    plan = make_plan(night_input("2026-10-03", grid_limit_kw=3.0))
    assert plan["window"] == {
        "start": "2026-10-03T22:00:00+02:00",
        "end": "2026-10-04T06:00:00+02:00",
    }
    (battery,) = plan["batteries"]
    assert battery["slots"][0]["start"] == "2026-10-03T22:00+02:00"
    assert battery["slots"][-1]["end"] == "2026-10-04T06:00+02:00"
    assert plan["hours"][0]["start"] == "2026-10-03T21:00:00+02:00"


def test_quarter_prices_of_the_hour_twice() -> None:
    """Quarter prices for 00:00–02:00 UTC (the wall clock shows 02:00–03:00
    twice): each hour gets its own four prices, the slots carry them."""
    first = datetime(2026, 10, 25, 0, 0, tzinfo=UTC)
    items = [
        {
            "start": dt_util.as_local(first + timedelta(minutes=15 * q)).isoformat(),
            "end": dt_util.as_local(
                first + timedelta(minutes=15 * (q + 1))
            ).isoformat(),
            "price": 0.10 + q / 100,
        }
        for q in range(8)
    ]
    slots = parse_list(items, "EUR/kWh")
    assert len(slots) == 8
    assert [s.end - s.start for s in slots] == [timedelta(minutes=15)] * 8
    one = quarters(slots, first, first + timedelta(hours=1))
    two = quarters(slots, first + timedelta(hours=1), first + timedelta(hours=2))
    assert one == pytest.approx([0.10, 0.11, 0.12, 0.13])
    assert two == pytest.approx([0.14, 0.15, 0.16, 0.17])

    inp = night_input("2026-10-24")
    for hour in inp.hours:
        if hour.start == first:
            hour.quarters = tuple(one)
        elif hour.start == first + timedelta(hours=1):
            hour.quarters = tuple(two)
    found = {
        dt_util.as_utc(s.start): s.price
        for s in night_slots(inp)
        if first <= s.start < first + timedelta(hours=2)
    }
    assert [found[first + timedelta(minutes=15 * q)] for q in range(8)] == (
        pytest.approx([0.10 + q / 100 for q in range(8)])
    )


def test_actions_run_the_real_night(hass: HomeAssistant) -> None:
    """A switch action over the whole autumn night: nine hours of energy;
    the night keeps its local name (the switch "tonight" still matches)."""
    start = datetime(2026, 10, 24, 20, 0, tzinfo=UTC)
    end = datetime(2026, 10, 25, 5, 0, tzinfo=UTC)
    action = {
        "id": "heater",
        "name": "Heater",
        "kind": "switch",
        "power_kw": 2.0,
        "auto": False,
    }
    (entry,) = plan_actions(
        [action],
        hass.states.get,
        start,
        end,
        None,
        {"heater": "2026-10-24T22:00:00+02:00"},
    )
    assert entry["run"] is True and entry["manual"] is True
    assert entry["start"] == "2026-10-24T22:00+02:00"
    assert entry["end"] == "2026-10-25T06:00+01:00"
    assert entry["energy_kwh"] == pytest.approx(18.0)


def test_the_executor_finds_the_span_in_the_hour_twice() -> None:
    """At 02:30 the first and 02:30 the second time: each its own span."""
    plan = {"kind": "charge"}
    planned = {
        "slots": [
            {
                "start": "2026-10-25T02:00+02:00",
                "end": "2026-10-25T03:00+02:00",
                "power_kw": 1.0,
            },
            {
                "start": "2026-10-25T02:00+01:00",
                "end": "2026-10-25T03:00+01:00",
                "power_kw": 2.0,
            },
            {
                "start": "2026-10-25T04:00+01:00",
                "end": "2026-10-25T05:00+01:00",
                "power_kw": 3.0,
            },
        ]
    }
    first = datetime(2026, 10, 25, 0, 30, tzinfo=UTC)
    second = datetime(2026, 10, 25, 1, 30, tzinfo=UTC)
    assert _battery_charging(plan, planned, dt_util.as_local(first)) == (True, 1.0)
    assert _battery_charging(plan, planned, dt_util.as_local(second)) == (True, 2.0)
    pause = dt_util.as_local(datetime(2026, 10, 25, 2, 30, tzinfo=UTC))
    assert _battery_charging(plan, planned, pause) == (False, None)
    after = dt_util.as_local(datetime(2026, 10, 25, 4, 0, tzinfo=UTC))
    assert _battery_charging(plan, planned, after) == (True, None)


def test_a_short_action_takes_the_limit_only_in_its_quarter() -> None:
    """11 kW from 04:30 to 04:45: that quarter is full, the others are free
    (not 2.75 kW taken from the whole hour)."""
    action = {
        "run": True,
        "power_kw": 11.0,
        "start": "2026-10-04T04:30+02:00",
        "end": "2026-10-04T04:45+02:00",
    }
    hour = local("2026-10-04T04:00")
    assert reserved_kw([action], hour, hour + timedelta(hours=1)) == pytest.approx(2.75)
    assert reserved_quarters([action], hour) == pytest.approx((0.0, 0.0, 11.0, 0.0))

    inp = night_input("2026-10-03", grid_limit_kw=12.0, actions=[action])
    inp.reserved = [
        reserved_kw([action], h.start, h.start + timedelta(hours=1)) for h in inp.hours
    ]
    inp.reserved_quarters = [reserved_quarters([action], h.start) for h in inp.hours]
    slots = {dt_util.as_local(s.start).strftime("%H:%M"): s for s in night_slots(inp)}
    assert slots["04:30"].cap == pytest.approx(12.0 - 0.4 - 11.0)
    assert slots["04:15"].cap == pytest.approx(12.0 - 0.4)
    assert slots["04:45"].cap == pytest.approx(12.0 - 0.4)
    plan = make_plan(inp)
    (battery,) = plan["batteries"]
    for span in battery["slots"]:
        begin = datetime.fromisoformat(span["start"])
        end = datetime.fromisoformat(span["end"])
        if begin < local("2026-10-04T04:45") and end > local("2026-10-04T04:30"):
            assert span["power_kw"] + 11.0 + 0.4 <= 12.0 + 1e-6
