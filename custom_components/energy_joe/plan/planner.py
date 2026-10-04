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

from dataclasses import dataclass, field, replace
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
    # A dynamic tariff's price for this hour (None: the night or day price).
    price: float | None = None
    # The price of each of its quarter hours, if the tariff has them.
    quarters: tuple[float | None, ...] = ()


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
    # Night actions (see actions.py) and the power they take per hour (kW).
    actions: list[dict[str, Any]] = field(default_factory=list)
    reserved: list[float] = field(default_factory=list)
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


def simulate(inp: PlanInput, target: float | None) -> Run:
    """Play the hours through with a target (kWh stored at the window's end)."""
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
            # The home and running night actions come first, the batteries take the rest.
            taken = inp.reserved[index] if index < len(inp.reserved) else 0.0
            power = min(
                power,
                max(
                    0.0,
                    inp.grid_limit_kw - hour.home / max(hour.fraction, 0.01) - taken,
                ),
            )
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
            power = charge_kw
            if (
                inp.defer_until is not None
                and not hour.window
                and inp.window_end <= hour.start < inp.defer_until
            ):
                power = max(0.0, charge_kw - inp.defer_kw)
            take = min(
                surplus, power * hour.fraction, max(0.0, capacity - stored) / eta
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


def _plan(inp: PlanInput) -> dict[str, Any]:
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
    night = run
    day = _grid_friendly(inp, capacity * target / 100)
    if day is not None:
        run = simulate(
            replace(inp, defer_until=datetime.fromisoformat(day["defer_until"])),
            capacity * target / 100,
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
    # Not worth the effort: below the saving the user wants, Joe leaves it be.
    if (
        kind != "none"
        and "balance" not in reasons
        and base.cost - run.cost < inp.min_saving
    ):
        kind = "none"
        reasons.append("small_saving")

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
    slots = charge_slots(inp, run.charge, charge_kw) if kind == "charge" else []
    charge_from = datetime.fromisoformat(slots[0]["start"]) if slots else None

    drop = max(0.0, _soc_now(inp) - at_start)
    batteries = []
    for battery in inp.batteries:
        start_soc = (
            max(inp.reserve, battery.soc - drop)
            if battery.soc > inp.reserve
            else battery.soc
        )
        energy = max(0.0, target - start_soc) / 100 * battery.capacity
        share = battery.charge_kw / charge_kw if charge_kw and battery.grid else 0.0
        batteries.append(
            {
                "id": battery.id,
                "name": battery.name,
                "capacity": round(battery.capacity, 3),
                "soc": round(battery.soc, 1),
                "soc_start": round(start_soc, 1),
                "target": target,
                "charge_kwh": round(energy, 2) if charging and battery.grid else 0.0,
                "power_kw": round(charge_kw * share, 2) if charging else 0.0,
                "controllable": battery.controllable,
                "grid": battery.grid,
            }
        )

    plan_cost = sum(
        c * _price(inp, h) for c, h in zip(run.charge, inp.hours, strict=True)
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
            "max_night_kwh": inp.max_night_kwh,
            "efficiency": inp.efficiency,
            "max_price": inp.max_price,
            "min_saving": inp.min_saving,
            "force_target": inp.force_target,
            "grid_friendly": inp.grid_friendly,
            "grid_first": inp.grid_first,
        },
        "day": day,
        "reasons": reasons,
        "notes": list(inp.notes),
        "meta": inp.meta,
        "actions": [
            {**action, "cost": round(_action_cost(inp, action), 2)}
            for action in inp.actions
        ],
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


# Grid-friendly: the forecast taken with caution, and what it may cost a day.
CAUTION = 0.8
ALLOW_SAVING_FIRST = 0.02
ALLOW_GRID_FIRST = 0.3
# Less held back than this is not worth steering.
MIN_HELD_KWH = 0.5


def _grid_friendly(inp: PlanInput, target: float) -> dict[str, Any] | None:
    """Until when batteries can leave the morning sun to the grid and still fill.

    The midday peak is when the grid has too much solar power; a battery that
    takes the sun then instead of in the morning helps. Joe picks the latest
    hour (at most the hour with the most surplus) from which the batteries
    still end the day as full as without waiting, with only 80 % of the
    forecast. With grid_first it may cost up to 30 ct a day.
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
    cautious = replace(
        inp, hours=[replace(h, solar=h.solar * CAUTION) for h in inp.hours]
    )
    allowed = simulate(cautious, target).cost + (
        ALLOW_GRID_FIRST if inp.grid_first else ALLOW_SAVING_FIRST
    )
    best = None
    for index, hour, _ in sunny:
        if index > peak:
            break
        if index == sunny[0][0]:
            continue
        trial = simulate(replace(cautious, defer_until=hour.start), target)
        if trial.cost <= allowed:
            best = hour.start
    if best is None:
        return None
    held = sum(min(s, inp.defer_kw * h.fraction) for _, h, s in sunny if h.start < best)
    if held < MIN_HELD_KWH:
        return None
    return {
        "defer_until": dt_util.as_local(best).isoformat(timespec="minutes"),
        "held_kwh": round(held, 1),
        "grid_first": inp.grid_first,
    }


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
