"""Joe's night plan: how far to charge, or to hold, the batteries in the cheap window.

The plan is one number per night, the target charge level at the end of the
cheap window. Below it Joe charges from the grid (as late as possible), above
it he lets the batteries discharge only down to it, so they still reach the
morning. Joe simulates the hours from now until the next cheap window for every
target from the reserve to the highest allowed level and takes the cheapest;
then he adds his safety buffer.

All energies are kWh, powers kW, charge levels percent, prices per kWh.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, time, timedelta
import math
from typing import Any

from homeassistant.util import dt as dt_util

# Below this, a difference in energy is not worth an action.
EPSILON = 0.05
EVENING = time(18, 0)


@dataclass(slots=True)
class Hour:
    """One hour of the horizon (the first one may have started already)."""

    start: datetime
    solar: float
    home: float
    window: bool
    fraction: float = 1.0


@dataclass(slots=True)
class Battery:
    """A battery as the planner sees it."""

    id: str
    name: str
    capacity: float
    soc: float
    charge_kw: float
    discharge_kw: float
    controllable: bool = True


@dataclass(slots=True)
class Prices:
    night: float
    day: float
    feed_in: float
    assumed: bool = False


@dataclass(slots=True)
class PlanInput:
    """Everything the plan depends on."""

    now: datetime
    window_start: datetime
    window_end: datetime
    hours: list[Hour]
    batteries: list[Battery]
    prices: Prices
    reserve: float = 10.0
    max_target: float = 100.0
    evening_min: float | None = None
    grid_limit_kw: float | None = None
    max_night_kwh: float | None = None
    discharge_mode: str = "until_target"
    buffer: float = 0.35
    efficiency: float = 0.9
    notes: list[str] = field(default_factory=list)
    meta: dict[str, Any] = field(default_factory=dict)

    @property
    def capacity(self) -> float:
        return sum(b.capacity for b in self.batteries)


@dataclass(slots=True)
class Run:
    """The hours played through with one target (None: without a plan)."""

    soc: list[float]
    charge: list[float]
    grid_in: list[float]
    grid_out: list[float]
    cost: float
    energy_at_window_start: float
    grid_charge: float
    bought_day: float = 0.0
    bought_night: float = 0.0
    sold: float = 0.0
    end_stored: float = 0.0


def simulate(inp: PlanInput, target: float | None) -> Run:
    """Play the hours through with a target (kWh stored at the window's end)."""
    capacity = inp.capacity
    stored = sum(b.capacity * b.soc / 100 for b in inp.batteries)
    lowest = capacity * inp.reserve / 100
    eta = math.sqrt(inp.efficiency)
    charge_kw = sum(b.charge_kw for b in inp.batteries)
    discharge_kw = sum(b.discharge_kw for b in inp.batteries)

    # How much can still be charged from the grid in each window hour.
    limits = []
    for hour in inp.hours:
        power = charge_kw
        if inp.grid_limit_kw is not None:
            power = min(
                power,
                max(0.0, inp.grid_limit_kw - hour.home / max(hour.fraction, 0.01)),
            )
        limits.append(power * hour.fraction if hour.window else 0.0)
    later = [sum(limits[i + 1 :]) for i in range(len(limits))]
    budget = inp.max_night_kwh if inp.max_night_kwh is not None else math.inf

    soc, charges, imports, exports = [], [], [], []
    cost = 0.0
    grid_charge = 0.0
    bought_day = bought_night = sold_total = 0.0
    at_window = None
    for index, hour in enumerate(inp.hours):
        if hour.window and at_window is None:
            at_window = stored
        surplus = hour.solar - hour.home
        charged = bought = sold = 0.0
        price = inp.prices.night if hour.window else inp.prices.day
        if surplus >= 0:
            # Sun first: into the batteries, the rest to the grid.
            take = min(
                surplus, charge_kw * hour.fraction, max(0.0, capacity - stored) / eta
            )
            stored += take * eta
            sold = surplus - take
        else:
            need = -surplus
            floor = lowest
            if hour.window and target is not None:
                floor = (
                    max(lowest, target)
                    if inp.discharge_mode == "until_target"
                    else lowest
                )
                if inp.discharge_mode == "block" or stored <= target:
                    floor = max(stored, lowest)
            give = min(
                need, discharge_kw * hour.fraction, max(0.0, stored - floor) * eta
            )
            stored -= give / eta
            bought = need - give
        if hour.window and target is not None and stored < target:
            # Charge as late as possible: only what the later hours cannot.
            missing = (target - stored) / eta
            amount = min(limits[index], max(0.0, missing - later[index]), budget)
            if amount > 0:
                stored += amount * eta
                charged = amount
                bought += amount
                budget -= amount
                grid_charge += amount
        cost += bought * price - sold * inp.prices.feed_in
        if hour.window:
            bought_night += bought
        else:
            bought_day += bought
        sold_total += sold
        soc.append(100 * stored / capacity if capacity else 0.0)
        charges.append(charged)
        imports.append(bought)
        exports.append(sold)
    # Energy left at the end still saves buying at night.
    cost -= stored * eta * inp.prices.night
    return Run(
        soc,
        charges,
        imports,
        exports,
        cost,
        at_window or stored,
        grid_charge,
        bought_day,
        bought_night,
        sold_total,
        stored,
    )


def _crossing(inp: PlanInput) -> datetime | None:
    """When the sun starts to cover the home on its own (to the minute, roughly)."""
    hours = inp.hours
    for index, hour in enumerate(hours):
        if hour.start < inp.window_end or hour.window:
            continue
        if hour.solar >= hour.home > 0:
            previous = hours[index - 1] if index else None
            if previous is None or previous.solar >= previous.home:
                return hour.start
            # Straight line between the middles of the two hours.
            before = previous.solar - previous.home
            after = hour.solar - hour.home
            share = -before / (after - before) if after != before else 0.5
            return previous.start + timedelta(minutes=30 + 60 * share)
    return None


def _when_level(
    soc: list[float], hours: list[Hour], start: datetime, level: float, rising: bool
) -> datetime | None:
    """The moment the charge level reaches a value (to the minute, roughly)."""
    previous_value = None
    for index, hour in enumerate(hours):
        value = soc[index]
        if hour.start >= start:
            reached = value >= level if rising else value <= level
            if reached:
                if previous_value is None or previous_value == value:
                    return hour.start + timedelta(minutes=60)
                share = (level - previous_value) / (value - previous_value)
                return hour.start + timedelta(minutes=60 * max(0.0, min(1.0, share)))
        previous_value = value
    return None


def make_plan(inp: PlanInput) -> dict[str, Any]:
    """The cheapest target with buffer, and everything Joe says about it."""
    capacity = inp.capacity
    base = simulate(inp, None)
    lowest = math.ceil(inp.reserve)
    highest = max(lowest, math.floor(min(inp.max_target, 100)))
    best: tuple[float, int] | None = None
    best_without_charge: tuple[float, int] | None = None
    small = max(0.1, capacity * 0.01)
    charged: dict[int, float] = {}
    for percent in range(lowest, highest + 1):
        run = simulate(inp, capacity * percent / 100)
        key = (round(run.cost, 4), percent)
        charged[percent] = run.grid_charge
        if best is None or key < best:
            best = key
        if run.grid_charge <= EPSILON and (
            best_without_charge is None or key < best_without_charge
        ):
            best_without_charge = key
    optimum = best[1] if best else lowest
    # A few watt-hours from the grid are not worth an action.
    if charged.get(optimum, 0.0) < small and best_without_charge is not None:
        optimum = best_without_charge[1]
    reasons: list[str] = []

    # The buffer: more energy above the reserve while Joe is still learning.
    target = optimum
    if optimum > inp.reserve:
        target = min(highest, round(optimum + inp.buffer * (optimum - inp.reserve)))
    run = simulate(inp, capacity * target / 100)

    if inp.evening_min is not None:
        evening = next(
            (
                i
                for i, h in enumerate(inp.hours)
                if h.start >= inp.window_end
                and dt_util.as_local(h.start).time() >= EVENING
            ),
            None,
        )
        if evening is not None and run.soc[evening] < inp.evening_min:
            for percent in range(target + 1, highest + 1):
                candidate = simulate(inp, capacity * percent / 100)
                target, run = percent, candidate
                if candidate.soc[evening] >= inp.evening_min:
                    break
            reasons.append("evening")

    at_start = 100 * run.energy_at_window_start / capacity if capacity else 0.0
    charging = run.grid_charge > EPSILON
    window_hours = [i for i, h in enumerate(inp.hours) if h.window]
    held = (
        any(run.soc[i] > base.soc[i] + 0.5 for i in window_hours)
        and inp.discharge_mode != "free"
    )
    kind = "charge" if charging else "hold" if held and target > inp.reserve else "none"

    sun = _crossing(inp)
    empty = _when_level(
        base.soc, inp.hours, inp.window_start, inp.reserve + 0.5, rising=False
    )
    if empty is not None and sun is not None and empty >= sun:
        empty = None
    if kind == "charge":
        reasons.append("bridge" if sun is not None else "no_sun")
    elif kind == "hold":
        reasons.append("hold")
    else:
        reasons.append("enough")
    if inp.prices.night / inp.efficiency >= inp.prices.day:
        reasons.append("not_worth")
    if charging and target >= highest and highest < 100:
        reasons.append("limit_target")
    if inp.max_night_kwh is not None and run.grid_charge >= inp.max_night_kwh - EPSILON:
        reasons.append("limit_energy")

    first_charge = next((i for i, c in enumerate(run.charge) if c > EPSILON), None)
    charge_from = None
    charge_kw = sum(b.charge_kw for b in inp.batteries)
    if first_charge is not None:
        # Charging ends with the hour, so it starts as long before as it takes.
        hour = inp.hours[first_charge]
        busy = min(hour.fraction, run.charge[first_charge] / max(charge_kw, 0.01))
        charge_from = max(hour.start + timedelta(hours=1 - busy), inp.now)

    drop = max(0.0, _soc_now(inp) - at_start)
    batteries = []
    for battery in inp.batteries:
        start_soc = (
            max(inp.reserve, battery.soc - drop)
            if battery.soc > inp.reserve
            else battery.soc
        )
        energy = max(0.0, target - start_soc) / 100 * battery.capacity
        share = battery.charge_kw / charge_kw if charge_kw else 0.0
        batteries.append(
            {
                "id": battery.id,
                "name": battery.name,
                "capacity": round(battery.capacity, 3),
                "soc": round(battery.soc, 1),
                "soc_start": round(start_soc, 1),
                "target": target,
                "charge_kwh": round(energy, 2) if charging else 0.0,
                "power_kw": round(charge_kw * share, 2) if charging else 0.0,
                "controllable": battery.controllable,
            }
        )

    plan_cost = sum(c * inp.prices.night for c in run.charge)
    return {
        "created": dt_util.as_local(inp.now).isoformat(timespec="seconds"),
        "window": {
            "start": dt_util.as_local(inp.window_start).isoformat(),
            "end": dt_util.as_local(inp.window_end).isoformat(),
        },
        "kind": kind,
        "target": target,
        "optimum": optimum,
        "target_kwh": round(capacity * target / 100, 2),
        "capacity_kwh": round(capacity, 2),
        "soc_now": round(_soc_now(inp), 1),
        "soc_start": round(at_start, 1),
        "grid_charge_kwh": round(run.grid_charge, 2),
        "charge_from": dt_util.as_local(charge_from).isoformat(timespec="minutes")
        if charge_from
        else None,
        "charge_kw": round(charge_kw, 2),
        "discharge_kw": round(sum(b.discharge_kw for b in inp.batteries), 2),
        "batteries": batteries,
        "sun_takes_over": _iso(sun),
        "full_at": _iso(
            _when_level(run.soc, inp.hours, inp.window_end, 99.5, rising=True)
        ),
        "empty_without": _iso(empty),
        "solar_kwh": round(
            sum(h.solar for h in inp.hours if h.start >= inp.window_end), 2
        ),
        "home_kwh": round(
            sum(h.home for h in inp.hours if h.start >= inp.window_end), 2
        ),
        "cost": {
            "night_charge": round(plan_cost, 2),
            "plan": round(run.cost, 2),
            "without": round(base.cost, 2),
            "saving": round(base.cost - run.cost, 2),
        },
        "prices": {
            "night": inp.prices.night,
            "day": inp.prices.day,
            "feed_in": inp.prices.feed_in,
            "assumed": inp.prices.assumed,
        },
        "rules": {
            "reserve": inp.reserve,
            "max_target": inp.max_target,
            "buffer": inp.buffer,
            "discharge_mode": inp.discharge_mode,
            "evening_min": inp.evening_min,
            "grid_limit_kw": inp.grid_limit_kw,
            "max_night_kwh": inp.max_night_kwh,
            "efficiency": inp.efficiency,
        },
        "reasons": reasons,
        "notes": list(inp.notes),
        "meta": inp.meta,
        "hours": [
            {
                "start": dt_util.as_local(hour.start).isoformat(),
                "solar": round(hour.solar, 3),
                "home": round(hour.home, 3),
                "window": hour.window,
                "soc": round(run.soc[i], 1),
                "soc_without": round(base.soc[i], 1),
                "charge": round(run.charge[i], 3),
                "grid_in": round(run.grid_in[i], 3),
                "grid_out": round(run.grid_out[i], 3),
            }
            for i, hour in enumerate(inp.hours)
        ],
    }


def _soc_now(inp: PlanInput) -> float:
    capacity = inp.capacity
    return (
        100 * sum(b.capacity * b.soc / 100 for b in inp.batteries) / capacity
        if capacity
        else 0.0
    )


def _iso(moment: datetime | None) -> str | None:
    return dt_util.as_local(moment).isoformat(timespec="minutes") if moment else None
