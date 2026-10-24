"""Joe's past nights played again with every caution (planner.CAUTION_LEVELS).

For each recorded night Joe plans the target as he could have that evening,
from what he knew then (only the days before), once per caution, and costs the
chosen target on the day as it really came. The sums show the owner what each
caution would have cost him; the plan and the setting stay as they are.
"""

from __future__ import annotations

import bisect
from collections.abc import Iterator
from dataclasses import dataclass, field
from datetime import date, datetime, time, timedelta
import math
from statistics import median
from typing import Any

from homeassistant.util import dt as dt_util

from ..observe.records import base_home
from ..plan.planner import (
    CAUTION_LEVELS,
    Battery,
    Hour,
    PlanInput,
    Prices,
    Scenario,
    _cheapest,
    _scaled,
    scenario_weights,
    simulate,
)
from .learning import SMALL_FORECAST, SOLAR_DAYS

# Nights a result needs (also for the season block).
MIN_NIGHTS = 10
# A day counts with this much forecast sun and this many good hours.
MIN_FORECAST = 0.5
GOOD_HOURS = 20
GOOD_COVERAGE = 0.8
# Hours of a night that may be missing (played as planned).
MISSING_ALLOWED = 2
# What the plan of a night looks back on.
FACTOR_DAYS = 60
SHAPE_DAYS = 14
SHAPE_MIN = 3
HOME_DAYS = 28
# The targets tried (percent steps) and the season around the last night.
STEP = 5
SEASON_SPAN = 30
# Days answered as away, guests or special say nothing about a usual day.
EXCLUDED = ("guests", "away", "special")
# The spreads as learn.models works them out (p20/p80, few days lean on the
# default), from the days before each night.
SPREAD_DAYS = 5
SPREAD_PSEUDO_DAYS = 10
SOLAR_SPREAD = (0.6, 1.2)
HOME_SPREAD = (0.9, 1.15)


@dataclass(slots=True)
class ReplaySetup:
    """The house as the replay sees it: all batteries as one."""

    batteries: list[tuple[str, float]]
    charge_kw: float
    discharge_kw: float
    efficiency: float
    reserve: float
    prices: Prices
    window_start: time | None
    window_end: time | None
    flexible: list[str] = field(default_factory=list)
    dynamic: bool = False

    @property
    def capacity(self) -> float:
        return sum(size for _, size in self.batteries)


@dataclass(slots=True)
class Night:
    """One past night: the plan's view of it and the day as it came."""

    day: date
    typical: PlanInput
    real: PlanInput
    factor: float
    solar_spread: tuple[float, float]
    home_spread: tuple[float, float]


@dataclass(slots=True)
class _Day:
    day: date
    forecast: float | None
    workday: bool
    excluded: bool
    good: bool
    solar: list[float]
    home: list[float | None]
    solar_total: float
    home_total: float
    records: dict[datetime, dict[str, Any]]


def _parse(name: str, data: dict[str, Any], flexible: list[str]) -> _Day:
    """A day's aggregates, worked out once."""
    current = date.fromisoformat(name)
    solar = [0.0] * 24
    home: list[float | None] = [None] * 24
    records = {}
    good = 0
    for record in data.get("hours") or []:
        start = datetime.fromisoformat(record["start"])
        records[dt_util.as_utc(start)] = record
        if (
            record.get("cov", 0) >= GOOD_COVERAGE
            and "home" in record
            and "solar" in record
        ):
            good += 1
        if "solar" in record:
            solar[start.hour] += max(0.0, record["solar"])
        if (base := base_home(record, flexible)) is not None:
            home[start.hour] = (home[start.hour] or 0.0) + base
    workday = data.get("workday")
    return _Day(
        current,
        (data.get("fc") or {}).get("ahead_kwh"),
        current.weekday() < 5 if workday is None else bool(workday),
        data.get("answer") in EXCLUDED,
        good >= GOOD_HOURS,
        solar,
        home,
        sum(solar),
        sum(v for v in home if v is not None),
        records,
    )


def _quantile(ordered: list[float], q: float) -> float:
    """The q quantile of sorted values, linear between the two nearest."""
    position = q * (len(ordered) - 1)
    below = math.floor(position)
    above = min(below + 1, len(ordered) - 1)
    return ordered[below] + (ordered[above] - ordered[below]) * (position - below)


def _spread(
    ordered: list[float],
    default: tuple[float, float],
    low_range: tuple[float, float],
    high_range: tuple[float, float],
) -> tuple[float, float]:
    """Low and high (p20, p80 of sorted values), shrunk towards a default."""
    count = len(ordered)

    def shrunk(value: float, start: float, limits: tuple[float, float]) -> float:
        mixed = (count * value + SPREAD_PSEUDO_DAYS * start) / (
            count + SPREAD_PSEUDO_DAYS
        )
        return round(max(limits[0], min(limits[1], mixed)), 3)

    return (
        shrunk(_quantile(ordered, 0.2), default[0], low_range),
        shrunk(_quantile(ordered, 0.8), default[1], high_range),
    )


def nights(days: dict[str, dict[str, Any]], setup: ReplaySetup) -> Iterator[Night]:
    """The nights that can be replayed, each planned from the days before it."""
    if setup.dynamic or setup.window_start is None or setup.window_end is None:
        return
    if not setup.capacity:
        return
    ordered = [
        _parse(name, data, setup.flexible) for name, data in sorted(days.items())
    ]
    by_date = {d.day: d for d in ordered}
    zone = dt_util.get_default_time_zone()
    ratios: list[float] = []
    ratios_sorted: list[float] = []
    home_ratios: list[float] = []
    usual: list[_Day] = []
    for current in ordered:
        if (
            current.good
            and current.forecast is not None
            and current.forecast >= MIN_FORECAST
        ):
            night = _night(
                current, by_date, usual, ratios, ratios_sorted, home_ratios, setup, zone
            )
            if night is not None:
                yield night
        # What the next nights know about this day.
        if not current.good:
            continue
        if current.forecast is not None and current.forecast >= SMALL_FORECAST:
            ratio = current.solar_total / current.forecast
            ratios.append(ratio)
            bisect.insort(ratios_sorted, ratio)
        if current.excluded:
            continue
        first = current.day - timedelta(days=HOME_DAYS)
        before = [
            d.home_total
            for d in usual
            if d.day >= first and d.workday == current.workday
        ]
        if len(before) >= SPREAD_DAYS and (typical := sum(before) / len(before)) > 0:
            bisect.insort(home_ratios, current.home_total / typical)
        usual.append(current)


def _night(
    current: _Day,
    by_date: dict[date, _Day],
    usual: list[_Day],
    ratios: list[float],
    ratios_sorted: list[float],
    home_ratios: list[float],
    setup: ReplaySetup,
    zone: Any,
) -> Night | None:
    """A night planned from the days before it (None: not enough known)."""
    assert setup.window_start is not None and setup.window_end is not None
    crossing = setup.window_end <= setup.window_start
    begin_day = current.day - timedelta(days=1) if crossing else current.day
    window_start = dt_util.as_utc(
        datetime.combine(begin_day, setup.window_start, tzinfo=zone)
    )
    window_end = dt_util.as_utc(
        datetime.combine(current.day, setup.window_end, tzinfo=zone)
    )
    following = dt_util.as_utc(
        datetime.combine(begin_day + timedelta(days=1), setup.window_start, tzinfo=zone)
    )
    first = window_start.replace(minute=0, second=0, microsecond=0)

    def record(start: datetime) -> dict[str, Any] | None:
        for offset in (0, -1, 1):
            found = by_date.get(current.day + timedelta(days=offset))
            if found is not None and start in found.records:
                return found.records[start]
        return None

    # The charge level of all batteries in the hour before the window.
    before = (record(first - timedelta(hours=1)) or {}).get("bat") or {}
    stored = 0.0
    for battery_id, size in setup.batteries:
        soc = (before.get(battery_id) or {}).get("soc")
        if soc is None:
            return None
        stored += size * soc
    soc = stored / setup.capacity

    # The sun: the forecast as corrected and spread out like the last days.
    recent = ratios[-FACTOR_DAYS:]
    factor = max(0.3, min(2.0, median(recent))) if len(recent) >= SOLAR_DAYS else 1.0
    sunny = [d for d in usual if d.solar_total > 0][-SHAPE_DAYS:]
    if len(sunny) < SHAPE_MIN:
        return None
    total = sum(d.solar_total for d in sunny)
    shape = [sum(d.solar[h] for d in sunny) / total for h in range(24)]
    solar_spread = SOLAR_SPREAD
    if len(ratios_sorted) >= SPREAD_DAYS and (middle := median(ratios_sorted)) > 0:
        solar_spread = _spread(
            [v / middle for v in ratios_sorted], SOLAR_SPREAD, (0.2, 1.0), (1.0, 2.0)
        )
    home_spread = HOME_SPREAD
    if len(home_ratios) >= SPREAD_DAYS:
        home_spread = _spread(home_ratios, HOME_SPREAD, (0.5, 1.0), (1.0, 2.0))

    # The home: each hour as on the same kind of day in the weeks before.
    since = begin_day - timedelta(days=HOME_DAYS)
    weeks = [d for d in usual if since <= d.day < begin_day]
    profiles: dict[bool, list[float | None]] = {}

    def profile(kind: bool) -> list[float | None]:
        if kind not in profiles:
            same = [d for d in weeks if d.workday == kind] or weeks
            means: list[float | None] = []
            for h in range(24):
                values = [v for d in same if (v := d.home[h]) is not None]
                means.append(sum(values) / len(values) if values else None)
            profiles[kind] = means
        return profiles[kind]

    planned: list[Hour] = []
    real: list[Hour] = []
    missing = 0
    start = first
    while start < following:
        local = dt_util.as_local(start)
        on = local.date()
        found = by_date.get(on)
        kind = found.workday if found is not None else on.weekday() < 5
        home = profile(kind)[local.hour]
        if home is None:
            return None
        solar = (
            current.forecast * factor * shape[local.hour] if on == current.day else 0.0
        )
        window = window_start <= start < window_end
        planned.append(Hour(start, solar, home, window))
        actual = record(start)
        if actual is None or "home" not in actual or "solar" not in actual:
            missing += 1
            real.append(Hour(start, solar, home, window))
        else:
            real.append(
                Hour(
                    start,
                    max(0.0, actual["solar"]),
                    base_home(actual, setup.flexible) or 0.0,
                    window,
                )
            )
        start += timedelta(hours=1)
    if missing > MISSING_ALLOWED:
        return None

    def plan_input(hours: list[Hour]) -> PlanInput:
        return PlanInput(
            now=first,
            window_start=window_start,
            window_end=window_end,
            hours=hours,
            batteries=[
                Battery(
                    "all",
                    "all",
                    setup.capacity,
                    max(0.0, min(100.0, soc)),
                    setup.charge_kw,
                    setup.discharge_kw,
                )
            ],
            prices=setup.prices,
            reserve=setup.reserve,
            buffer=0.0,
            efficiency=setup.efficiency,
        )

    return Night(
        current.day,
        plan_input(planned),
        plan_input(real),
        factor,
        solar_spread,
        home_spread,
    )


def _picks(night: Night, steps: list[int]) -> dict[str, int]:
    """The target each caution (and the typical day alone) would have chosen."""
    typical = night.typical
    capacity = typical.capacity
    cases = {
        "bad": _scaled(
            typical,
            Scenario("bad", 0.0, night.solar_spread[0], night.home_spread[1]),
        ),
        "good": _scaled(
            typical,
            Scenario("good", 0.0, night.solar_spread[1], night.home_spread[0]),
        ),
    }
    costs: dict[str, dict[int, float]] = {"bad": {}, "typical": {}, "good": {}}
    charged: dict[int, float] = {}
    for percent in steps:
        target = capacity * percent / 100
        run = simulate(typical, target)
        charged[percent] = run.grid_charge
        costs["typical"][percent] = run.cost
        for name, case in cases.items():
            costs[name][percent] = simulate(case, target).cost
    small = max(0.1, capacity * 0.01)
    picks = {"typical": _cheapest(costs["typical"], charged, small)}
    for level in CAUTION_LEVELS:
        weights = scenario_weights(level)
        weighted = {
            p: sum(weights[name] * costs[name][p] for name in costs) for p in steps
        }
        picks[level] = _cheapest(weighted, charged, small)
    return picks


def _summary(rows: list[tuple[date, dict[str, float]]]) -> dict[str, Any]:
    costs = {
        name: round(sum(row[name] for _, row in rows), 2) + 0.0
        for name in ("typical", *CAUTION_LEVELS)
    }
    order = list(CAUTION_LEVELS)
    # Equal costs: the default (brave) first, then the bolder one.
    best = min(
        order,
        key=lambda name: (costs[name], name != "brave", order.index(name)),
    )
    return {
        "nights": len(rows),
        "first": rows[0][0].isoformat(),
        "last": rows[-1][0].isoformat(),
        "costs": costs,
        "best": best,
    }


def _season_distance(one: date, other: date) -> int:
    """Days between two dates in the year, whatever the year."""
    apart = abs(one.timetuple().tm_yday - other.timetuple().tm_yday)
    return min(apart, 365 - apart)


def replay_nights(
    days: dict[str, dict[str, Any]], setup: ReplaySetup
) -> dict[str, Any] | None:
    """What each caution would have cost over the past nights (None: too few)."""
    low = math.ceil(setup.reserve)
    steps = sorted({*range(low, 101, STEP), 100}) if low <= 100 else [100]
    rows: list[tuple[date, dict[str, float]]] = []
    for night in nights(days, setup):
        picks = _picks(night, steps)
        capacity = night.real.capacity
        real: dict[int, float] = {}
        for percent in set(picks.values()):
            real[percent] = simulate(night.real, capacity * percent / 100).cost
        rows.append((night.day, {name: real[p] for name, p in picks.items()}))
    if len(rows) < MIN_NIGHTS:
        return None
    result = _summary(rows)
    last = rows[-1][0]
    season = [row for row in rows if _season_distance(row[0], last) <= SEASON_SPAN]
    result["season"] = _summary(season) if len(season) >= MIN_NIGHTS else None
    result["updated"] = dt_util.now().isoformat(timespec="seconds")
    return result
