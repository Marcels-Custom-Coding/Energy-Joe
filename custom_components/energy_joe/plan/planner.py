"""Joe's night plan: how far to charge, or to hold, the batteries in the cheap window.

The plan is one number per night, the target charge level at the end of the
cheap window. Below it Joe charges from the grid (as late as possible), above
it he lets the batteries discharge only down to it, so they still reach the
morning. Joe simulates the hours from now until the next cheap window for every
target from the reserve to the highest allowed level and takes the cheapest.
Each target is costed against three days of tomorrow (bad, typical, good),
weighted by the owner's caution: too little costs the day price, too much only
the losses, so an uncertain tomorrow charges fuller.

All energies are kWh, powers kW, charge levels percent, prices per kWh.
"""

from __future__ import annotations

from dataclasses import dataclass, field, replace
from datetime import datetime, time, timedelta
import math
from typing import Any

from homeassistant.util import dt as dt_util

from . import night as sharing

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
    # A dynamic tariff's price for this hour (None: the night or day price).
    price: float | None = None
    # The price of each of its quarter hours, if the tariff has them.
    quarters: tuple[float | None, ...] = ()

    def __post_init__(self) -> None:
        # Joe counts in UTC: on the night the clocks go back an hour comes
        # twice on the wall clock, in spring one is missing. Local times are
        # only for showing (and the hour of the day of a profile).
        self.start = dt_util.as_utc(self.start)


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
    # Whether Joe can charge it from the grid (some batteries can only be held).
    grid: bool = True
    # The level it is never discharged below (percent of its own size).
    floor: float = 0.0
    # Whether Joe can set its charging power (else it charges at full power).
    paced: bool = True
    # The system that regulates it (batteries of one group rise together).
    group: str | None = None
    # It charges much slower from the grid than it could (the executor
    # measured it): charge_kw is that power, kept here for the panel.
    slow_kw: float | None = None


@dataclass(slots=True)
class Prices:
    night: float
    day: float
    feed_in: float
    assumed: bool = False


@dataclass(slots=True)
class Scenario:
    """One possible tomorrow: the sun and the home's use as multipliers on the
    typical day (only the hours from the window's end on)."""

    name: str
    weight: float
    solar: float = 1.0
    home: float = 1.0


# How much the bad day counts, from the owner's caution (model.NIGHT_CAUTIONS).
CAUTION_LEVELS = {
    "bold": 0.0,
    "brave": 0.25,
    "balanced": 0.5,
    "careful": 0.75,
    "cautious": 1.0,
}


def caution_level(caution: str | None) -> float:
    """The caution as a number from 0 (bold) to 1 (cautious)."""
    return CAUTION_LEVELS.get(caution or "", CAUTION_LEVELS["balanced"])


def scenario_weights(caution: str | None) -> dict[str, float]:
    """The weights of the bad, typical and good day (they add up to 1)."""
    level = caution_level(caution)
    bad = 0.15 + 0.5 * level
    good = 0.35 - 0.3 * level
    return {"bad": bad, "typical": 1 - bad - good, "good": good}


def make_scenarios(
    caution: str | None, solar: tuple[float, float], home: tuple[float, float]
) -> list[Scenario]:
    """Bad (less sun, more use), typical and good day from the spreads (low, high)."""
    weights = scenario_weights(caution)
    return [
        Scenario("bad", weights["bad"], solar[0], home[1]),
        Scenario("typical", weights["typical"]),
        Scenario("good", weights["good"], solar[1], home[0]),
    ]


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
    # Night actions (see actions.py) and the power they take per hour (kW),
    # and per quarter hour (four per hour; an action of a quarter hour takes
    # the grid limit away in that quarter, not spread over the hour).
    actions: list[dict[str, Any]] = field(default_factory=list)
    # Each car charged by need: what tomorrow needs and where it is plugged in.
    cars: dict[str, Any] = field(default_factory=dict)
    reserved: list[float] = field(default_factory=list)
    reserved_quarters: list[tuple[float, ...]] = field(default_factory=list)
    # Dynamic tariff: the span in which Joe looks for the best window.
    search: tuple[datetime, datetime] | None = None
    # Safety limits: no grid charging above this price, no action for less.
    max_price: float | None = None
    min_saving: float = 0.0
    # Maintenance night: charge to at least this level (percent).
    force_target: float | None = None
    # Grid-friendly (see _grid_friendly): batteries that can hold back charging
    # from the sun take it later in the day; with grid_first it may cost a little.
    grid_friendly: bool = False
    grid_first: bool = False
    defer_kw: float = 0.0
    defer_until: datetime | None = None
    # The buffer of the grid-friendly morning (see morning_buffer): the
    # owner's level (None: Joe's suggestion) and what a sunny morning needs
    # beyond the sun as Joe learned it (kWh; None: not learned yet).
    morning_buffer: float | None = None
    morning_need: float | None = None
    # While holding back: below this much stored (kWh, all batteries) the
    # batteries of the buffer charge from the sun all the same, at most at
    # this power (kW).
    defer_buffer: float = 0.0
    defer_buffer_kw: float = 0.0
    # By day one group works at a time (control/team.py): the buffer belongs
    # to the first in the discharge order.
    one_by_one: bool = False
    # The order in which the batteries discharge by day (battery ids): the
    # first gets tonight's energy first (see night.py). With "sequence" they
    # also discharge one after the other in the evening.
    order: list[str] = field(default_factory=list)
    sequence: bool = False
    # Where the grid limit comes from: "user", "learned" (the highest import
    # Joe measured) or None.
    grid_limit_source: str | None = None
    # Tomorrow's possible days (empty: only the expected one) and what they
    # come from: the caution, the weather class and the days behind the spreads.
    scenarios: list[Scenario] = field(default_factory=list)
    caution: str = "balanced"
    spread: dict[str, Any] = field(default_factory=dict)

    def __post_init__(self) -> None:
        # In UTC, like the hours (see Hour).
        self.now = dt_util.as_utc(self.now)
        self.window_start = dt_util.as_utc(self.window_start)
        self.window_end = dt_util.as_utc(self.window_end)
        if self.search is not None:
            self.search = (
                dt_util.as_utc(self.search[0]),
                dt_util.as_utc(self.search[1]),
            )
        if self.defer_until is not None:
            self.defer_until = dt_util.as_utc(self.defer_until)

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


def _price(inp: PlanInput, hour: Hour) -> float:
    """What a kWh from the grid costs in this hour."""
    if hour.price is not None:
        return hour.price
    return inp.prices.night if hour.window else inp.prices.day


def simulate(
    inp: PlanInput, target: float | None, fixed: list[float] | None = None
) -> Run:
    """Play the hours through with a target (kWh stored at the window's end).

    `fixed`: the grid charging per hour as shared out (night.py) instead of
    the cheapest hours at full power.
    """
    capacity = inp.capacity
    stored = sum(b.capacity * b.soc / 100 for b in inp.batteries)
    lowest = capacity * inp.reserve / 100
    eta = math.sqrt(inp.efficiency)
    charge_kw = sum(b.charge_kw for b in inp.batteries)
    grid_kw = sum(b.charge_kw for b in inp.batteries if b.grid)
    discharge_kw = sum(b.discharge_kw for b in inp.batteries)

    # How much can still be charged from the grid in each window hour.
    limits = []
    for index, hour in enumerate(inp.hours):
        power = grid_kw
        if inp.grid_limit_kw is not None:
            # The home and running night actions come first, the batteries
            # take the rest (quarter by quarter).
            power = sum(min(grid_kw, room) for room in grid_room(inp, index)) / 4
        price = _price(inp, hour)
        allowed = inp.max_price is None or price <= inp.max_price + 1e-9
        limits.append(power * hour.fraction if hour.window and allowed else 0.0)
    # Charge in the cheapest window hours (equal prices: as late as possible):
    # an hour only takes what cheaper hours still ahead cannot.
    cheaper = [
        sum(
            limits[k]
            for k in range(i + 1, len(limits))
            if _price(inp, inp.hours[k]) <= _price(inp, inp.hours[i]) + 1e-9
        )
        for i in range(len(limits))
    ]
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
        price = _price(inp, hour)
        if surplus >= 0:
            # Sun first: into the batteries, the rest to the grid (grid-friendly
            # batteries wait until defer_until).
            power = charge_kw * hour.fraction
            if (
                inp.defer_until is not None
                and not hour.window
                and inp.window_end <= hour.start < inp.defer_until
            ):
                power = max(0.0, charge_kw - inp.defer_kw) * hour.fraction
                if stored < inp.defer_buffer:
                    # The buffer first: up to it they charge from the sun.
                    power += min(
                        inp.defer_buffer_kw * hour.fraction,
                        (inp.defer_buffer - stored) / eta,
                    )
            take = min(surplus, power, max(0.0, capacity - stored) / eta)
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
        if hour.window and target is not None and fixed is not None:
            amount = min(fixed[index], max(0.0, capacity - stored) / eta)
            if amount > 0:
                stored += amount * eta
                charged = amount
                bought += amount
                grid_charge += amount
        elif hour.window and target is not None and stored < target:
            missing = (target - stored) / eta
            amount = min(limits[index], max(0.0, missing - cheaper[index]), budget)
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
    """The cheapest target with buffer, and everything Joe says about it.

    With a dynamic tariff Joe first tries every window of whole hours in the
    search span and keeps the one with which the next day costs least.
    """
    if inp.search is None or any(h.window for h in inp.hours):
        plan = _plan(inp)
        if inp.search is not None:
            plan["search"] = {
                "start": dt_util.as_local(inp.search[0]).isoformat(),
                "end": dt_util.as_local(inp.search[1]).isoformat(),
            }
        return plan
    found = best_window(inp)
    if found is None:
        return {
            "kind": "unavailable",
            "reasons": ["prices_pending"],
            "created": dt_util.as_local(inp.now).isoformat(timespec="seconds"),
        }
    plan = _plan(found)
    plan["search"] = {
        "start": dt_util.as_local(inp.search[0]).isoformat(),
        "end": dt_util.as_local(inp.search[1]).isoformat(),
    }
    return plan


def best_window(inp: PlanInput, min_hours: int = 1) -> PlanInput | None:
    """The window of whole hours in the search span with the cheapest outcome."""
    start, end = inp.search or (inp.window_start, inp.window_end)
    inside = [
        i
        for i, hour in enumerate(inp.hours)
        if hour.price is not None
        and hour.start + timedelta(hours=1) > start
        and hour.start < end
        and hour.start + timedelta(hours=1) > inp.now
    ]
    if not inside:
        return None
    capacity = inp.capacity
    low = math.ceil(inp.reserve)
    high = max(low, math.floor(min(inp.max_target, 100)))
    steps = sorted({*range(low, high + 1, 5), high})
    best: tuple[tuple[float, int, int], PlanInput] | None = None
    min_hours = max(1, min(min_hours, len(inside)))
    for a, first in enumerate(inside):
        for last in inside[a:]:
            if last - first != inside.index(last) - a:
                break
            if last - first + 1 < min_hours:
                continue
            candidate = with_window(inp, first, last + 1)
            cost = min(
                simulate(candidate, capacity * percent / 100).cost for percent in steps
            )
            key = (round(cost, 3), last - first, -first)
            if best is None or key < best[0]:
                best = (key, candidate)
    return best[1] if best else None


def with_window(inp: PlanInput, first: int, last: int) -> PlanInput:
    """The plan input with the window over hours first … last - 1."""
    hours = [
        replace(hour, window=first <= index < last)
        for index, hour in enumerate(inp.hours)
    ]
    inside = [h.price for h in hours[first:last] if h.price is not None]
    after = [h.price for h in hours[last:] if h.price is not None and h.solar < h.home]
    night = sum(inside) / len(inside) if inside else inp.prices.night
    day = sum(after) / len(after) if after else inp.prices.day
    return replace(
        inp,
        hours=hours,
        window_start=hours[first].start,
        window_end=hours[last - 1].start + timedelta(hours=1),
        prices=replace(inp.prices, night=round(night, 5), day=round(day, 5)),
    )


def _scaled(inp: PlanInput, scenario: Scenario) -> PlanInput:
    """The plan input as on one of tomorrow's possible days."""
    if scenario.solar == 1 and scenario.home == 1:
        return inp
    return replace(
        inp,
        hours=[
            replace(h, solar=h.solar * scenario.solar, home=h.home * scenario.home)
            if h.start >= inp.window_end
            else h
            for h in inp.hours
        ],
        scenarios=[],
    )


def _cases(inp: PlanInput) -> list[tuple[Scenario, PlanInput]]:
    """Tomorrow's possible days with their (normalised) weights; without
    scenarios the expected day alone."""
    total = sum(max(0.0, s.weight) for s in inp.scenarios)
    if total <= 0:
        return [(Scenario("typical", 1.0), inp)]
    return [
        (replace(s, weight=max(0.0, s.weight) / total), _scaled(inp, s))
        for s in inp.scenarios
    ]


def _expected(
    cases: list[tuple[Scenario, PlanInput]],
    typical: PlanInput,
    target: float | None,
    known: Run,
    fixed: list[float] | None = None,
) -> float:
    """The weighted cost of a target over tomorrow's days (`known`: the
    typical day's run, not played through again)."""
    return sum(
        s.weight
        * (known.cost if case is typical else simulate(case, target, fixed).cost)
        for s, case in cases
    )


def _cheapest(costs: dict[int, float], charged: dict[int, float], small: float) -> int:
    """The cheapest target (equal costs: the lower one)."""
    best = min(costs, key=lambda p: (round(costs[p], 4), p))
    # A few watt-hours from the grid are not worth an action.
    without = [p for p in costs if charged[p] <= EPSILON]
    if charged[best] < small and without:
        best = min(without, key=lambda p: (round(costs[p], 4), p))
    return best


def _plan(inp: PlanInput) -> dict[str, Any]:
    cases = _cases(inp)
    # The typical day is the one that is shown, shared out and refined.
    inp = next((case for s, case in cases if s.name == "typical"), inp)
    capacity = inp.capacity
    base = simulate(inp, None)
    base_cost = _expected(cases, inp, None, base)
    lowest = math.ceil(inp.reserve)
    highest = max(lowest, math.floor(min(inp.max_target, 100)))
    small = max(0.1, capacity * 0.01)
    charged: dict[int, float] = {}
    costs: dict[int, float] = {}
    typical_costs: dict[int, float] = {}
    for percent in range(lowest, highest + 1):
        run = simulate(inp, capacity * percent / 100)
        charged[percent] = run.grid_charge
        typical_costs[percent] = run.cost
        costs[percent] = _expected(cases, inp, capacity * percent / 100, run)
    optimum = _cheapest(costs, charged, small)
    typical_target = _cheapest(typical_costs, charged, small)
    reasons: list[str] = []

    # The buffer: more energy above the reserve while Joe is still learning.
    # Only as long as the night still pays with it; otherwise the optimum
    # alone (a buffer that ate the saving once turned a whole night into
    # nothing, see "small_saving" below).
    target = optimum
    notes: list[str] = []
    if optimum > inp.reserve:
        target = min(highest, round(optimum + inp.buffer * (optimum - inp.reserve)))
        if target > optimum:
            worth = base_cost - costs[optimum]
            buffered = base_cost - costs[target]
            if buffered < inp.min_saving <= worth:
                target = optimum
                notes.append("buffer_dropped")
    if (
        inp.force_target is not None
        and target < inp.force_target
        and max(base.soc, default=0.0) < inp.force_target - 0.5
    ):
        # Maintenance night: once full, so the batteries can balance their cells.
        target = max(target, min(100, math.ceil(inp.force_target)))
        reasons.append("balance")
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

    # The night's costs stay those of the night; waiting for the midday sun
    # shows in the hours and with its own (small) cost.
    # Tonight's charging shared out among the batteries, each as slowly as
    # it may (night.py); the hours played through again with it.
    shared = None
    if run.grid_charge > EPSILON:
        shared = _share(inp, run, highest, target if "balance" in reasons else None)
        run = simulate(inp, capacity * target / 100, shared.hourly)
    night = run
    buffer = morning_buffer(inp)
    day = _grid_friendly(inp, capacity * target / 100, buffer)
    if day is not None:
        run = simulate(
            replace(
                _buffered(inp, buffer),
                defer_until=datetime.fromisoformat(day["defer_until"]),
            ),
            capacity * target / 100,
            shared.hourly if shared else None,
        )
        day["cost"] = round(max(0.0, run.cost - night.cost), 2)

    at_start = 100 * run.energy_at_window_start / capacity if capacity else 0.0
    charging = run.grid_charge > EPSILON
    window_hours = [i for i, h in enumerate(inp.hours) if h.window]
    held = (
        any(run.soc[i] > base.soc[i] + 0.5 for i in window_hours)
        and inp.discharge_mode != "free"
    )
    kind = "charge" if charging else "hold" if held and target > inp.reserve else "none"
    # Not worth the effort: below the saving the user wants (on the whole
    # of tomorrow's days), Joe leaves it be.
    saving = base.cost - run.cost
    if inp.scenarios:
        fixed = shared.hourly if shared else None
        planned = _expected(cases, inp, capacity * target / 100, night, fixed)
        saving = base_cost - (planned + run.cost - night.cost)
    if kind != "none" and "balance" not in reasons and saving < inp.min_saving:
        kind = "none"
        reasons.append("small_saving")
    if kind != "none" and optimum > typical_target:
        reasons.append("caution")

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
    elif "small_saving" not in reasons:
        reasons.append("enough")
    if inp.max_price is not None and any(
        h.window and _price(inp, h) > inp.max_price + 1e-9 for h in inp.hours
    ):
        reasons.append("max_price")
    if inp.prices.night / inp.efficiency >= inp.prices.day:
        reasons.append("not_worth")
    if charging and target >= highest and highest < 100:
        reasons.append("limit_target")
    if inp.max_night_kwh is not None and run.grid_charge >= inp.max_night_kwh - EPSILON:
        reasons.append("limit_energy")

    charge_kw = sum(b.charge_kw for b in inp.batteries if b.grid)
    if kind != "charge":
        shared = None
    starts = shared.starts if shared else _starts(inp, at_start)
    batteries = []
    eta = math.sqrt(inp.efficiency)
    for battery in inp.batteries:
        start_soc = starts[battery.id]
        taker = shared.takers.get(battery.id) if shared else None
        entry: dict[str, Any] = {
            "id": battery.id,
            "name": battery.name,
            "capacity": round(battery.capacity, 3),
            "soc": round(battery.soc, 1),
            "soc_start": round(start_soc, 1),
            "target": target,
            "charge_kwh": 0.0,
            "grid_kwh": 0.0,
            "power_kw": 0.0,
            "max_kw": round(battery.charge_kw, 2),
            "slots": [],
            "how": "none",
            "controllable": battery.controllable,
            "grid": battery.grid,
            "paced": battery.paced,
            "group": battery.group or battery.id,
            "slow_kw": battery.slow_kw,
        }
        if shared is not None:
            # Its own target: what it has at the window's start and its share.
            entry["target"] = max(0, min(100, round(start_soc)))
        if shared is not None and taker is not None and taker.taken > EPSILON:
            stored = taker.taken * eta
            level = start_soc + 100 * stored / battery.capacity
            own = min(max(highest, target), math.ceil(level - 0.05))
            spans = sharing.spans(shared.slots, taker)
            entry.update(
                target=max(own, round(start_soc)),
                charge_kwh=round(stored, 2),
                grid_kwh=round(taker.taken, 2),
                power_kw=round(max(taker.rates.values()), 2),
                slots=[
                    {
                        "start": _iso(span["start"]),  # type: ignore[arg-type]
                        "end": _iso(span["end"]),  # type: ignore[arg-type]
                        "power_kw": span["power"],
                    }
                    for span in spans
                ],
                how=sharing.how(shared.slots, taker),
                # Its place in the order of charging (0: gets first).
                rank=list(shared.takers).index(battery.id),
            )
        batteries.append(entry)
    slots = _joined(
        [slot for entry in batteries for slot in entry["slots"]]
        if shared is not None
        else []
    )
    charge_from = datetime.fromisoformat(slots[0]["start"]) if slots else None

    plan_cost = (
        night_module_cost(shared)
        if shared is not None
        else sum(c * _price(inp, h) for c, h in zip(run.charge, inp.hours, strict=True))
    )
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
        "charge_slots": slots,
        "unplaced_kwh": round(shared.left, 2) if shared else 0.0,
        "order": list(inp.order),
        "tariff": "dynamic" if inp.search is not None else "fixed",
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
            "plan": round(night.cost, 2),
            "without": round(base.cost, 2),
            "saving": round(base.cost - night.cost, 2),
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
            "grid_limit_source": inp.grid_limit_source,
            "max_night_kwh": inp.max_night_kwh,
            "efficiency": inp.efficiency,
            "max_price": inp.max_price,
            "min_saving": inp.min_saving,
            "force_target": inp.force_target,
            "grid_friendly": inp.grid_friendly,
            "grid_first": inp.grid_first,
            "morning_buffer": inp.morning_buffer,
            "night_caution": inp.caution,
        },
        "risk": _risk(inp, cases, target, typical_target),
        "day": day,
        # The buffer Joe keeps on a grid-friendly morning (also on a day
        # without one: the settings show the suggestion).
        "morning_buffer": buffer,
        "reasons": reasons,
        "notes": [*inp.notes, *notes],
        "meta": inp.meta,
        "actions": [
            {**action, "cost": round(_action_cost(inp, action), 2)}
            for action in inp.actions
        ],
        "cars": inp.cars,
        "hours": [
            {
                "start": dt_util.as_local(hour.start).isoformat(),
                "solar": round(hour.solar, 3),
                "home": round(hour.home, 3),
                "window": hour.window,
                **({"price": round(hour.price, 4)} if hour.price is not None else {}),
                "soc": round(run.soc[i], 1),
                "soc_without": round(base.soc[i], 1),
                "charge": round(run.charge[i], 3),
                "grid_in": round(run.grid_in[i], 3),
                "grid_out": round(run.grid_out[i], 3),
            }
            for i, hour in enumerate(inp.hours)
        ],
    }


def _risk(
    inp: PlanInput,
    cases: list[tuple[Scenario, PlanInput]],
    target: int,
    typical_target: int,
) -> dict[str, Any] | None:
    """Tomorrow's days as the plan weighed them (None: only the expected one)."""
    if not inp.scenarios:
        return None
    capacity = inp.capacity
    days = inp.spread.get("days") or {}
    scenarios = {}
    for scenario, case in cases:
        tomorrow = [h for h in case.hours if h.start >= case.window_end]
        scenarios[scenario.name] = {
            "solar_kwh": round(sum(h.solar for h in tomorrow), 2),
            "home_kwh": round(sum(h.home for h in tomorrow), 2),
            "cost": round(simulate(case, capacity * target / 100).cost, 2),
            "cost_typical": round(
                simulate(case, capacity * typical_target / 100).cost, 2
            ),
        }
    return {
        "caution": inp.caution,
        "weights": {s.name: round(s.weight, 2) for s, _ in cases},
        "class": inp.spread.get("class"),
        "typical_target": typical_target,
        "scenarios": scenarios,
        "days": {"solar": days.get("solar", 0), "home": days.get("home", 0)},
    }


# Grid-friendly: the forecast taken with caution, and what it may cost a day.
CAUTION = 0.8
ALLOW_SAVING_FIRST = 0.02
ALLOW_GRID_FIRST = 0.3
# Less held back than this is not worth steering.
MIN_HELD_KWH = 0.5


def _grid_friendly(
    inp: PlanInput, target: float, buffer: dict[str, Any] | None = None
) -> dict[str, Any] | None:
    """Until when batteries can leave the morning sun to the grid and still fill.

    The midday peak is when the grid has too much solar power; a battery that
    takes the sun then instead of in the morning helps. Joe picks the latest
    hour (at most the hour with the most surplus) from which the batteries
    still end the day as full as without waiting, with only 80 % of the
    forecast, at no more cost than the allowance (with grid_first up to 30 ct
    a day, and then it need not be quite as full).

    The buffer (see morning_buffer) charges first: up to it the batteries
    take the morning sun, only above it the sun goes to the grid.
    """
    if not inp.grid_friendly or inp.defer_kw <= 0:
        return None
    day = [
        (i, h)
        for i, h in enumerate(inp.hours)
        if h.start >= inp.window_end and not h.window
    ]
    surplus = [(i, h, h.solar - h.home) for i, h in day]
    sunny = [(i, h, s) for i, h, s in surplus if s > 0]
    if not sunny:
        return None
    peak = max(sunny, key=lambda item: item[2])[0]
    real = _buffered(inp, buffer)
    cautious = replace(
        real, hours=[replace(h, solar=h.solar * CAUTION) for h in inp.hours]
    )
    allowance = ALLOW_GRID_FIRST if inp.grid_first else ALLOW_SAVING_FIRST
    # With the cautious forecast and with the forecast as it is (with a
    # buffer more sun is not always safer: more of the morning goes to the
    # grid): as full as without waiting (the highest level of the day), at
    # no more than the allowance.
    cases = []
    for case in (cautious, real):
        without = simulate(case, target)
        cases.append(
            (case, without.cost + allowance, max(without.soc[i] for i, _ in day))
        )
    best = None
    for index, hour, _ in sunny:
        if index > peak:
            break
        if index == sunny[0][0]:
            continue
        fits = True
        for case, allowed, top in cases:
            trial = simulate(replace(case, defer_until=hour.start), target)
            full = max(trial.soc[i] for i, _ in day) >= top - FULL_SLACK
            fits = fits and trial.cost <= allowed and (full or inp.grid_first)
        if fits:
            best = hour.start
    if best is None:
        return None
    # What goes to the grid instead of into the batteries (the buffer taken out).
    plain = simulate(real, target)
    waiting = simulate(replace(real, defer_until=best), target)
    held = sum(
        max(0.0, waiting.grid_out[i] - plain.grid_out[i])
        for i, h in day
        if h.start < best
    )
    if held < MIN_HELD_KWH:
        return None
    return {
        "defer_until": dt_util.as_local(best).isoformat(timespec="minutes"),
        "held_kwh": round(held, 1),
        "grid_first": inp.grid_first,
        "buffer": buffer,
    }


# The morning buffer: the safety margin on what a morning needs, what Joe
# counts on before he learned it (a share of the morning's use, at least),
# the highest level he suggests, and how far below it charging starts again
# (control/executor.py).
BUFFER_MARGIN = 1.25
BUFFER_START_SHARE = 0.3
BUFFER_START_KWH = 0.5
BUFFER_SUGGEST_MAX = 60
BUFFER_BACK = 2.0
# As full as without waiting, give or take this much (percent).
FULL_SLACK = 0.5


def morning_buffer(inp: PlanInput) -> dict[str, Any] | None:
    """The buffer of the grid-friendly morning: up to this level the batteries
    take the morning sun, so a cloud or the oven comes from them rather than
    from the grid; only then Joe holds back charging.

    Joe suggests what a sunny morning typically needs beyond the sun (learned
    over the years, see learn/learning.py morning_need) with a margin, above
    the floor; before he learned it, a share of the morning's use. The owner
    may set his own level. With one group at a time (control/team.py) the
    buffer belongs to the group that discharges first in the morning.
    """
    if not inp.grid_friendly or inp.defer_kw <= 0:
        return None
    members = _buffer_members(inp)
    capacity = sum(b.capacity for b in members)
    if capacity <= 0:
        return None
    floor = max([inp.reserve, *(b.floor for b in members)])
    need, source = inp.morning_need, "learned"
    if need is None:
        need, source = _start_need(inp), "start"
    suggested = math.ceil(floor + 100 * need * BUFFER_MARGIN / capacity - 1e-9)
    suggested = max(
        math.ceil(floor), min(suggested, BUFFER_SUGGEST_MAX, math.floor(inp.max_target))
    )
    level: float = suggested
    if inp.morning_buffer is not None:
        level, source = max(floor, min(100.0, inp.morning_buffer)), "user"
    return {
        "soc": round(level),
        "suggested": suggested,
        "need_kwh": round(need, 2),
        "source": source,
        "floor": round(floor, 1),
        "batteries": [b.id for b in members],
        "group": members[0].group or members[0].id,
        "back": BUFFER_BACK,
    }


def _buffer_members(inp: PlanInput) -> list[Battery]:
    """The batteries that keep the buffer: all of them, or with one group at a
    time the first group in the discharge order."""
    batteries = [b for b in inp.batteries if b.capacity > 0]
    if not inp.one_by_one or not batteries:
        return batteries
    groups = sharing.groups_in_order(
        ((b.id, b.group or b.id) for b in batteries), inp.order
    )
    first = set(groups[0])
    return [b for b in batteries if b.id in first]


def _start_need(inp: PlanInput) -> float:
    """Before Joe learned it: a share of what the home uses from the hour the
    sun covers it up to the hour with the most surplus."""
    day = [h for h in inp.hours if h.start >= inp.window_end and not h.window]
    if not day:
        return BUFFER_START_KWH
    peak = max(range(len(day)), key=lambda i: day[i].solar - day[i].home)
    first = next((i for i in range(peak + 1) if day[i].solar >= day[i].home > 0), peak)
    use = sum(h.home for h in day[first:peak])
    return max(BUFFER_START_KWH, BUFFER_START_SHARE * use)


def _buffered(inp: PlanInput, buffer: dict[str, Any] | None) -> PlanInput:
    """The plan input with the buffer as the simulation sees it: all batteries
    together, the buffer's batteries at its level, the others at their floor."""
    if not buffer:
        return inp
    ids = set(buffer["batteries"])
    stored = sum(
        b.capacity * (buffer["soc"] if b.id in ids else max(inp.reserve, b.floor)) / 100
        for b in inp.batteries
    )
    power = sum(b.charge_kw for b in inp.batteries if b.id in ids)
    return replace(inp, defer_buffer=stored, defer_buffer_kw=min(inp.defer_kw, power))


def charge_slots(
    inp: PlanInput, charges: list[float], charge_kw: float
) -> list[dict[str, str]]:
    """When to charge, in quarter hours: in each charging hour the cheapest ones.

    Without quarter prices the last quarters of the hour (as late as possible).
    """
    picked: list[datetime] = []
    for hour, amount in zip(inp.hours, charges, strict=True):
        if amount <= EPSILON:
            continue
        # The hour's real charging power (the grid limit may take some of it).
        power = max(charge_kw, 0.01)
        if inp.grid_limit_kw is not None:
            power = min(power, max(0.01, inp.grid_limit_kw - hour.home))
        needed = min(4, max(1, math.ceil(4 * amount / power - 1e-6)))
        starts = [hour.start + timedelta(minutes=15 * q) for q in range(4)]
        open_ = [q for q in range(4) if starts[q] + timedelta(minutes=15) > inp.now]
        prices = list(hour.quarters) + [None] * (4 - len(hour.quarters))
        open_.sort(key=lambda q: (prices[q] if prices[q] is not None else 0.0, -q))
        picked += [starts[q] for q in open_[:needed]]
    picked.sort()
    slots: list[dict[str, str]] = []
    for start in picked:
        end = start + timedelta(minutes=15)
        if slots and slots[-1]["end"] == _iso(start):
            slots[-1]["end"] = _iso(end) or ""
        else:
            slots.append(
                {"start": _iso(max(start, inp.now)) or "", "end": _iso(end) or ""}
            )
    return slots


@dataclass(slots=True)
class Shared:
    """Tonight's charging shared out (see night.py)."""

    slots: list[sharing.Slot]
    takers: dict[str, sharing.Taker]
    starts: dict[str, float]
    hourly: list[float]
    left: float


def _share(
    inp: PlanInput, run: Run, highest: int, equal: float | None = None
) -> Shared:
    """The run's grid charging shared out among the batteries.

    Each battery may take up to the highest level (`equal`: all to this level,
    for a maintenance night), the first in the discharge order first.
    """
    capacity = inp.capacity
    eta = math.sqrt(inp.efficiency)
    at_start = 100 * run.energy_at_window_start / capacity if capacity else 0.0
    starts = _starts(inp, at_start)
    slots = night_slots(inp)
    takers = []
    for battery in inp.batteries:
        if not battery.grid or battery.charge_kw <= 0 or battery.capacity <= 0:
            continue
        top = equal if equal is not None else highest
        room = max(0.0, top - starts[battery.id]) / 100 * battery.capacity / eta
        takers.append(
            sharing.Taker(
                battery.id,
                battery.group or battery.id,
                battery.charge_kw,
                room,
                battery.paced,
            )
        )
    takers = sharing.ordered(takers, inp.order)
    left = sharing.share(slots, takers, run.grid_charge)
    return Shared(
        slots,
        {t.id: t for t in takers},
        starts,
        sharing.hourly(slots, takers, len(inp.hours)),
        left,
    )


def night_slots(inp: PlanInput) -> list[sharing.Slot]:
    """The window's quarter hours from now on, with their price and what all
    batteries together may take in them (the grid limit after the home and
    the night actions of that quarter).

    In UTC, so the night the clocks go back has nine hours (36 quarters) and
    the night they go forward seven.
    """
    tail = inp.window_end - timedelta(minutes=sharing.TAIL_MIN)
    result = []
    for index, hour in enumerate(inp.hours):
        if not hour.window:
            continue
        price = _price(inp, hour)
        if inp.max_price is not None and price > inp.max_price + 1e-9:
            continue
        rooms = grid_room(inp, index)
        for quarter in range(4):
            start = hour.start + timedelta(minutes=15 * quarter)
            end = start + timedelta(minutes=15)
            begin = max(start, inp.now)
            hours = (end - begin).total_seconds() / 3600
            if hours <= 1e-6:
                continue
            own = hour.quarters[quarter] if quarter < len(hour.quarters) else None
            value = own if own is not None else price
            if inp.max_price is not None and value > inp.max_price + 1e-9:
                continue
            result.append(
                sharing.Slot(
                    begin, end, hours, value, rooms[quarter], index, end > tail
                )
            )
    return result


def grid_room(inp: PlanInput, index: int) -> list[float]:
    """What the batteries may take from the grid in each quarter of an hour
    (kW; inf without a grid limit): the limit after the home and the night
    actions running in that quarter (per hour where the quarters are not known)."""
    if inp.grid_limit_kw is None:
        return [math.inf] * 4
    hour = inp.hours[index]
    home = hour.home / max(hour.fraction, 0.01)
    if index < len(inp.reserved_quarters) and len(inp.reserved_quarters[index]) == 4:
        taken = list(inp.reserved_quarters[index])
    else:
        taken = [inp.reserved[index] if index < len(inp.reserved) else 0.0] * 4
    return [max(0.0, inp.grid_limit_kw - home - value) for value in taken]


def _starts(inp: PlanInput, at_start: float) -> dict[str, float]:
    """Each battery's level at the window's start (as far as Joe can tell).

    One after the other by day ("sequence"): the evening's need comes from the
    batteries in the discharge order, each down to its floor; else from all
    of them alike.
    """
    drop = max(0.0, _soc_now(inp) - at_start)
    result: dict[str, float] = {}
    for battery in inp.batteries:
        low = max(inp.reserve, battery.floor)
        result[battery.id] = (
            max(low, battery.soc - drop) if battery.soc > low else battery.soc
        )
    if not inp.sequence or len(inp.batteries) < 2 or drop <= 0:
        return result
    by_id = {b.id: b for b in inp.batteries}
    energy = drop / 100 * inp.capacity
    groups = sharing.groups_in_order(
        ((b.id, b.group or b.id) for b in inp.batteries), inp.order
    )
    for members in groups:
        free = {
            key: max(0.0, by_id[key].soc - max(inp.reserve, by_id[key].floor))
            / 100
            * by_id[key].capacity
            for key in members
        }
        total = sum(free.values())
        take = min(energy, total)
        for key in members:
            battery = by_id[key]
            part = take * free[key] / total if total > 0 else 0.0
            result[key] = battery.soc - 100 * part / battery.capacity
        energy -= take
    return result


def _joined(slots: list[dict[str, Any]]) -> list[dict[str, str]]:
    """Every battery's charging times together, as joined spans."""
    spans = sorted(
        (datetime.fromisoformat(s["start"]), datetime.fromisoformat(s["end"]))
        for s in slots
    )
    result: list[list[datetime]] = []
    for start, end in spans:
        if result and start <= result[-1][1]:
            result[-1][1] = max(result[-1][1], end)
        else:
            result.append([start, end])
    return [{"start": _iso(a) or "", "end": _iso(b) or ""} for a, b in result]


def night_module_cost(shared: Shared) -> float:
    """What tonight's planned grid charging costs at the quarters' prices."""
    return sharing.cost(shared.slots, shared.takers.values())


def _action_cost(inp: PlanInput, action: dict[str, Any]) -> float:
    """What a night action's energy costs at the prices of the hours it runs."""
    if not action.get("run") or not action.get("energy_kwh"):
        return 0.0
    start = datetime.fromisoformat(action["start"])
    end = datetime.fromisoformat(action["end"])
    total = 0.0
    for hour in inp.hours:
        overlap = (
            min(end, hour.start + timedelta(hours=1)) - max(start, hour.start)
        ).total_seconds()
        if overlap > 0:
            total += (
                (action.get("power_kw") or 0.0) * overlap / 3600 * _price(inp, hour)
            )
    return total if total else action["energy_kwh"] * inp.prices.night


def _soc_now(inp: PlanInput) -> float:
    capacity = inp.capacity
    return (
        100 * sum(b.capacity * b.soc / 100 for b in inp.batteries) / capacity
        if capacity
        else 0.0
    )


def _iso(moment: datetime | None) -> str | None:
    return dt_util.as_local(moment).isoformat(timespec="minutes") if moment else None
