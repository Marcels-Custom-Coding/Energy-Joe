"""Joe's explainable models: consumption by temperature and presence, consumer
groups, the real size and efficiency of the batteries, solar factors by weather,
the hot water heat pump, presence by calendar label, and days worth a question.

Everything is plain least squares, medians and averages over stored days (see
observe/store.py), so each number can be shown and explained in the panel.
"""

from __future__ import annotations

from bisect import bisect_right
from collections.abc import Iterable
from dataclasses import dataclass
from datetime import date, datetime, timedelta
import math
from statistics import median
from typing import Any

from ..observe.records import base_home

# Degree-day limits: below this the house heats, above that it cools (°C).
HEAT_BELOW = 15.0
COOL_ABOVE = 22.0
# Days a model needs, and how much of a day must be recorded.
MIN_DAYS = 14
MIN_HOURS = 20
# A day this far from what the model expects is worth a question.
SURPRISE_SHARE = 0.35
SURPRISE_KWH = 3.0
# Days a forecast source needs before Joe weighs it.
SOURCE_DAYS = 7
# Days of a car's history before Joe trusts what he learned about it.
CAR_DAYS = 8
# One poll writes level and odometer a moment apart, in either order.
SAME_POLL = timedelta(minutes=2)
# How fast older days lose weight in the consumption models, and the least
# weight they keep: a year-old winter still teaches how much heating costs.
HALF_LIFE_DAYS = 120
OLD_WEIGHT = 0.2
# Grid-charging nights before Joe trusts the inverter's losses.
CONVERTER_NIGHTS = 5
# More than this between two odometer readings is a glitch, not a drive (km).
MAX_STEP_KM = 1500.0


@dataclass(slots=True)
class DayRow:
    """What a day was like: consumption and what drives it."""

    date: str
    home: float
    workday: bool
    temp: float | None
    presence: float | None
    use: dict[str, float]
    excluded: bool


def daily_rows(
    days: dict[str, dict[str, Any]], flexible: Iterable[str] = ()
) -> list[DayRow]:
    """Complete days with their totals, mean temperature and presence hours.

    The total leaves out the flexible devices (see model.flexible_consumers).
    """
    flexible = list(flexible)
    rows = []
    for day, data in sorted(days.items()):
        hours = [h for h in data.get("hours") or [] if h.get("cov", 0) >= 0.8]
        if len(hours) < MIN_HOURS or not all("home" in h for h in hours):
            continue
        temps = [h["temp"] for h in hours if "temp" in h]
        present = [
            max((h.get("present") or {}).values(), default=0.0)
            for h in hours
            if h.get("present")
        ]
        use: dict[str, float] = {}
        for hour in hours:
            for consumer, kwh in (hour.get("use") or {}).items():
                use[consumer] = use.get(consumer, 0.0) + kwh
        workday = data.get("workday")
        if workday is None:
            workday = date.fromisoformat(day).weekday() < 5
        answer = data.get("answer")
        rows.append(
            DayRow(
                date=day,
                home=sum(base_home(h, flexible) or 0.0 for h in hours),
                workday=bool(workday),
                temp=sum(temps) / len(temps) if len(temps) >= 12 else None,
                presence=sum(present) if len(present) >= 12 else None,
                use=use,
                excluded=answer in ("special", "guests", "away"),
            )
        )
    return rows


def _features(row_workday: bool, temp: float, presence: float | None) -> list[float]:
    features = [
        1.0,
        1.0 if row_workday else 0.0,
        max(0.0, HEAT_BELOW - temp),
        max(0.0, temp - COOL_ABOVE),
    ]
    if presence is not None:
        features.append(presence)
    return features


def _solve(
    rows: list[list[float]],
    targets: list[float],
    weights: list[float] | None = None,
) -> list[float] | None:
    """Weighted least squares via the normal equations (a few features, a little ridge)."""
    size = len(rows[0])
    matrix = [[0.0] * size for _ in range(size)]
    vector = [0.0] * size
    for features, target, weight in zip(
        rows, targets, weights or [1.0] * len(rows), strict=True
    ):
        for i in range(size):
            vector[i] += weight * features[i] * target
            for j in range(size):
                matrix[i][j] += weight * features[i] * features[j]
    for i in range(1, size):
        matrix[i][i] += 1e-3
    # Gaussian elimination with partial pivoting.
    for col in range(size):
        pivot = max(range(col, size), key=lambda r: abs(matrix[r][col]))
        if abs(matrix[pivot][col]) < 1e-9:
            return None
        matrix[col], matrix[pivot] = matrix[pivot], matrix[col]
        vector[col], vector[pivot] = vector[pivot], vector[col]
        for row in range(col + 1, size):
            factor = matrix[row][col] / matrix[col][col]
            for k in range(col, size):
                matrix[row][k] -= factor * matrix[col][k]
            vector[row] -= factor * vector[col]
    result = [0.0] * size
    for row in range(size - 1, -1, -1):
        result[row] = (
            vector[row] - sum(matrix[row][k] * result[k] for k in range(row + 1, size))
        ) / matrix[row][row]
    return result


def _weights(rows: list[DayRow]) -> list[float]:
    """Recent days count most; older seasons still count (last winter's heating)."""
    newest = max(date.fromisoformat(r.date) for r in rows)
    return [
        max(
            OLD_WEIGHT,
            0.5 ** ((newest - date.fromisoformat(r.date)).days / HALF_LIFE_DAYS),
        )
        for r in rows
    ]


def _fit(rows: list[DayRow], value: Any, use_presence: bool) -> dict[str, Any] | None:
    usable = [
        r
        for r in rows
        if not r.excluded
        and r.temp is not None
        and (not use_presence or r.presence is not None)
    ]
    if len(usable) < MIN_DAYS:
        return None
    features = [
        _features(r.workday, r.temp, r.presence if use_presence else None)
        for r in usable
    ]  # type: ignore[arg-type]
    targets = [value(r) for r in usable]
    coefficients = _solve(features, targets, _weights(usable))
    if coefficients is None:
        return None
    predicted = [
        sum(c * f for c, f in zip(coefficients, row, strict=True)) for row in features
    ]
    mean = sum(targets) / len(targets)
    total = sum((t - mean) ** 2 for t in targets) or 1e-9
    residual = sum((t - p) ** 2 for t, p in zip(targets, predicted, strict=True))
    model = {
        "base": round(coefficients[0], 3),
        "workday": round(coefficients[1], 3),
        "heat": round(max(0.0, coefficients[2]), 3),
        "cool": round(max(0.0, coefficients[3]), 3),
        "presence": round(coefficients[4], 3) if use_presence else None,
        "presence_mean": round(sum(r.presence or 0.0 for r in usable) / len(usable), 1)
        if use_presence
        else None,
        "r2": round(max(0.0, 1 - residual / total), 2),
        "days": len(usable),
    }
    return model


def consumption_model(rows: list[DayRow]) -> dict[str, Any] | None:
    """Daily consumption = base + working day + heating and cooling degrees (+ presence)."""
    with_presence = _fit(rows, lambda r: r.home, use_presence=True)
    without = _fit(rows, lambda r: r.home, use_presence=False)
    if with_presence and without and with_presence["r2"] > without["r2"] + 0.03:
        return with_presence
    return without


def expected(
    model: dict[str, Any], workday: bool, temp: float, presence: float | None
) -> float:
    """What a model expects for a day (kWh)."""
    value = (
        model["base"]
        + (model["workday"] if workday else 0.0)
        + model["heat"] * max(0.0, HEAT_BELOW - temp)
        + model["cool"] * max(0.0, temp - COOL_ABOVE)
    )
    if model.get("presence") is not None:
        hours = presence if presence is not None else model.get("presence_mean")
        value += model["presence"] * (hours or 0.0)
    return max(0.0, value)


def group_models(
    rows: list[DayRow], consumers: Iterable[dict[str, Any]]
) -> dict[str, Any]:
    """A model per consumer with a meter: how its energy follows the weather."""
    result = {}
    for consumer in consumers:
        key = consumer["id"]
        if consumer.get("kind") in ("submeter",):
            continue
        rows_with = [r for r in rows if key in r.use]
        if len(rows_with) < MIN_DAYS:
            continue
        model = _fit(
            rows_with, lambda r, key=key: r.use.get(key, 0.0), use_presence=False
        )
        if model:
            model["average"] = round(
                sum(r.use[key] for r in rows_with) / len(rows_with), 2
            )
            result[key] = model
    return result


def battery_model(
    days: dict[str, dict[str, Any]], battery_id: str
) -> dict[str, Any] | None:
    """Real usable size and round-trip efficiency from charged, discharged and level change.

    Per day: discharged = efficiency * charged - size * efficiency_out * level change.
    Solved as least squares over the days with enough movement.
    """
    features: list[list[float]] = []
    targets: list[float] = []
    for _, data in sorted(days.items()):
        hours = [
            h for h in data.get("hours") or [] if battery_id in (h.get("bat") or {})
        ]
        if len(hours) < MIN_HOURS:
            continue
        entries = [h["bat"][battery_id] for h in hours]
        marks = [i for i, e in enumerate(entries) if "soc" in e]
        if len(marks) < 2:
            continue
        # The level is read at the end of an hour: count what flowed after the first reading.
        first, last = marks[0], marks[-1]
        between = entries[first + 1 : last + 1]
        charged = sum(e.get("in", 0.0) for e in between)
        discharged = sum(e.get("out", 0.0) for e in between)
        if charged + discharged < 1.0:
            continue
        change = (entries[last]["soc"] - entries[first]["soc"]) / 100
        features.append([charged, -change])
        targets.append(discharged)
    if len(features) < MIN_DAYS:
        return None
    coefficients = _solve(features, targets)
    if coefficients is None:
        return None
    efficiency, stored = coefficients
    if not 0.6 <= efficiency <= 1.0 or stored <= 0:
        return None
    capacity = stored / (efficiency**0.5)
    return {
        "capacity_kwh": round(capacity, 2),
        "efficiency": round(efficiency, 3),
        "days": len(features),
    }


def converter_model(
    days: dict[str, dict[str, Any]], battery_id: str
) -> dict[str, Any] | None:
    """How much of what comes from the grid reaches the battery's own meter.

    A battery meter on the direct-current side (e.g. behind a hybrid inverter)
    does not see the inverter's losses. On nights with grid charging and no
    sun: grid energy minus what the home used meanwhile (the median of the
    night's quiet hours) is what went into charging; the battery meter shows
    what arrived.
    """
    ratios = []
    for _, data in sorted(days.items()):
        hours = [
            h
            for h in data.get("hours") or []
            if h.get("cov", 0) >= 0.8 and (h.get("solar") or 0.0) < 0.02
        ]

        def flows(hour: dict[str, Any]) -> list[tuple[str, float, float]]:
            return [
                (key, entry.get("in", 0.0), entry.get("out", 0.0))
                for key, entry in (hour.get("bat") or {}).items()
            ]

        quiet = sorted(
            h["home"]
            for h in hours
            if "home" in h
            and h.get("bat")
            and all(i < 0.05 and o < 0.05 for _, i, o in flows(h))
        )
        if len(quiet) < 2:
            continue
        base = quiet[len(quiet) // 2]
        arrived = drawn = 0.0
        for hour in hours:
            mine = (hour.get("bat") or {}).get(battery_id) or {}
            others = [(i, o) for key, i, o in flows(hour) if key != battery_id]
            if mine.get("in", 0.0) < 0.3 or any(
                i > 0.05 or o > 0.05 for i, o in others
            ):
                continue
            ac = (hour.get("grid_in") or 0.0) - (hour.get("grid_out") or 0.0) - base
            if ac <= 0.1:
                continue
            arrived += mine["in"]
            drawn += ac
        if drawn >= 1.0:
            ratios.append(arrived / drawn)
    if len(ratios) < CONVERTER_NIGHTS:
        return None
    ratios.sort()
    factor = ratios[len(ratios) // 2]
    if not 0.75 <= factor <= 1.05:
        return None
    return {"factor": round(min(1.0, factor), 3), "nights": len(ratios)}


def solar_classes(ratios: list[dict[str, Any]]) -> dict[str, Any]:
    """How well the forecast fits on clear, mixed and overcast days (median ratios).

    A day's weather is its forecast against the best forecast of the 30 days
    before it, so the classes follow the seasons. "top" is that best forecast
    for the days to come.
    """
    usable = sorted(
        (r for r in ratios if r.get("ratio") is not None and r.get("forecast")),
        key=lambda r: r.get("date") or "",
    )
    if not usable:
        return {}
    groups: dict[str, list[float]] = {"clear": [], "mixed": [], "overcast": []}
    for ratio in usable:
        groups[
            weather_class(ratio["forecast"], _top(usable, ratio.get("date")))
        ].append(ratio["ratio"])
    classes = {
        name: {
            "factor": round(max(0.3, min(2.0, median(values))), 2),
            "days": len(values),
        }
        for name, values in groups.items()
        if len(values) >= 3
    }
    return {
        "classes": classes,
        "top": round(_top(usable, None), 2),
        "days": len(usable),
    }


def _top(ratios: list[dict[str, Any]], day: str | None) -> float:
    """The best forecast in the 30 days up to a day (the latest 30 days for None)."""
    last = date.fromisoformat(day) if day else None
    if last is None:
        dated = [r for r in ratios if r.get("date")]
        last = date.fromisoformat(dated[-1]["date"]) if dated else None
    first = (last - timedelta(days=30)).isoformat() if last else ""
    values = [
        r["forecast"]
        for r in ratios
        if not r.get("date") or last is None or first <= r["date"] <= last.isoformat()
    ]
    return max(values) if values else 0.0


def class_factor(
    solar: dict[str, Any] | None, forecast: float | None
) -> tuple[str, float] | None:
    """The weather class of a forecast and the factor Joe learned for it."""
    if not solar or forecast is None or not solar.get("top"):
        return None
    name = weather_class(forecast, solar["top"])
    found = (solar.get("classes") or {}).get(name)
    return (name, found["factor"]) if found else None


def weather_class(forecast: float, top: float) -> str:
    """A day's weather from its forecast against the best recent forecast."""
    share = forecast / top if top else 0.0
    return "clear" if share >= 0.7 else "mixed" if share >= 0.35 else "overcast"


def source_quality(
    days: dict[str, dict[str, Any]], source_ids: Iterable[str]
) -> dict[str, dict[str, Any]]:
    """How well each forecast source fits: its median ratio and typical error.

    "main" is the forecast Joe plans with, the others are alternatives whose
    daily sum for tomorrow is stored as fc.alt (see observe/observer.py).
    """
    ratios: dict[str, list[float]] = {}
    for data in days.values():
        hours = [h for h in data.get("hours") or [] if "solar" in h]
        if len(hours) < MIN_HOURS or not all(h.get("cov", 0) >= 0.8 for h in hours):
            continue
        actual = sum(h["solar"] for h in hours)
        forecast = data.get("fc") or {}
        values = {"main": forecast.get("ahead_kwh"), **(forecast.get("alt") or {})}
        for source in ("main", *source_ids):
            value = values.get(source)
            if isinstance(value, int | float) and value >= 1.0 and actual > 0:
                ratios.setdefault(source, []).append(actual / value)
    result = {}
    for source, values in ratios.items():
        if len(values) < SOURCE_DAYS:
            continue
        factor = median(values)
        error = median(abs(math.log(v / factor)) for v in values)
        result[source] = {
            "factor": round(max(0.3, min(2.0, factor)), 2),
            "error": round(error, 3),
            "days": len(values),
        }
    return result


def combined_forecast(
    quality: dict[str, dict[str, Any]], forecasts: dict[str, float | None]
) -> float | None:
    """Tomorrow's sun from all sources: each corrected, weighted by how well it fits.

    None unless at least two sources have a forecast and a learned quality.
    """
    weighted, weights = 0.0, 0.0
    used = 0
    for source, value in forecasts.items():
        found = quality.get(source)
        if value is None or not found:
            continue
        weight = 1 / max(found["error"], 0.05) ** 2
        weighted += weight * value * found["factor"]
        weights += weight
        used += 1
    return round(weighted / weights, 2) if used >= 2 and weights else None


def hot_water_model(
    series: list[tuple[datetime, float]], workdays: dict[str, bool] | None = None
) -> dict[str, Any] | None:
    """Heating rate, standing loss and daily use in kelvin from a temperature curve.

    Rising hours are heating (median rise per hour), slow falls at night are the
    standing loss, and the falls during the day beyond that are what people use.
    """
    if len(series) < 24:
        return None
    hourly: dict[datetime, float] = {}
    for moment, value in series:
        hourly[moment.replace(minute=0, second=0, microsecond=0)] = value
    stamps = sorted(hourly)
    rises, losses = [], []
    falls_by_day: dict[str, float] = {}
    for previous, current in zip(stamps, stamps[1:], strict=False):
        if current - previous != timedelta(hours=1):
            continue
        change = hourly[current] - hourly[previous]
        if change >= 0.5:
            rises.append(change)
        elif change < 0:
            if 0 <= current.hour < 5 and change > -1.0:
                losses.append(-change)
            elif 6 <= current.hour < 23:
                day = current.date().isoformat()
                falls_by_day[day] = falls_by_day.get(day, 0.0) - change
    if len(rises) < 3 or len(falls_by_day) < 3:
        return None
    loss = median(losses) if losses else 0.3
    demand = [max(0.0, fall - loss * 17) for fall in falls_by_day.values()]
    return {
        "rate_k_per_h": round(median(rises), 2),
        "loss_k_per_h": round(loss, 2),
        "demand_k": round(median(demand), 1),
        "days": len(falls_by_day),
    }


def presence_by_label(
    days: dict[str, dict[str, Any]], person_ids: Iterable[str]
) -> dict[str, dict[str, Any]]:
    """Average hours at home per person and calendar label (e.g. "office": 9 h)."""
    sums: dict[str, dict[str, list[float]]] = {}
    for data in days.values():
        labels = data.get("labels") or {}
        hours = data.get("hours") or []
        for person in person_ids:
            label = labels.get(person)
            present = [
                h["present"][person]
                for h in hours
                if person in (h.get("present") or {})
            ]
            if label and len(present) >= MIN_HOURS:
                sums.setdefault(person, {}).setdefault(label, []).append(sum(present))
    return {
        person: {
            label: {"hours": round(sum(values) / len(values), 1), "days": len(values)}
            for label, values in labels.items()
        }
        for person, labels in sums.items()
    }


def surprises(
    rows: list[DayRow], model: dict[str, Any] | None, answered: set[str]
) -> list[dict[str, Any]]:
    """Recent days far off what Joe expected – worth asking about."""
    if not model:
        return []
    result = []
    for row in rows[-14:]:
        if row.date in answered or row.temp is None:
            continue
        guess = expected(model, row.workday, row.temp, row.presence)
        difference = row.home - guess
        if abs(difference) >= SURPRISE_KWH and abs(difference) >= SURPRISE_SHARE * max(
            guess, 1.0
        ):
            result.append(
                {
                    "date": row.date,
                    "actual": round(row.home, 1),
                    "expected": round(guess, 1),
                    "kind": "more" if difference > 0 else "less",
                }
            )
    return result[-3:]


def _hourly(series: list[tuple[datetime, float]]) -> list[tuple[datetime, float]]:
    """Readings sorted by time, without repeats of the same value."""
    result: list[tuple[datetime, float]] = []
    for moment, value in sorted(series, key=lambda item: item[0]):
        if not result or value != result[-1][1]:
            result.append((moment, value))
    return result


def _continuous(series: list[tuple[datetime, float]]) -> list[tuple[datetime, float]]:
    """Odometer readings by time; a 0, a drop (reset, unit change) or a jump adds nothing."""
    result: list[tuple[datetime, float]] = []
    offset = 0.0
    previous: float | None = None
    for when, value in sorted(series, key=lambda item: item[0]):
        if value <= 0:
            continue
        if previous is not None and not 0 <= value - previous <= MAX_STEP_KM:
            # Go on from the last good reading.
            offset += previous - value
        previous = value
        result.append((when, value + offset))
    return result


def _at(
    series: list[tuple[datetime, float]], times: list[datetime], moment: datetime
) -> float | None:
    """The last reading at or before a moment (series sorted, times its moments)."""
    index = bisect_right(times, moment)
    return series[index - 1][1] if index else None


def car_days(
    odometer: list[tuple[datetime, float]],
    soc: list[tuple[datetime, float]],
    capacity: float | None,
) -> list[dict[str, Any]]:
    """Per day: kilometres driven and, with a known battery, the energy it took.

    Energy counts where the level fell while the odometer rose between two
    readings (driving), so charging in between does not disturb it; "kwh_km"
    is the distance of just those drives. Days without a reading count 0 km.
    """
    odometer = _continuous(odometer)
    times = [when for when, _ in odometer]
    soc = _hourly(soc)
    days: dict[str, dict[str, Any]] = {}
    before: float | None = None
    for when, value in odometer:
        day = when.date()
        if days:
            # Days in between without a reading: the car stood still.
            gap = date.fromisoformat(max(days)) + timedelta(days=1)
            while gap < day:
                days[gap.isoformat()] = {
                    "first": before,
                    "last": before,
                    "kwh": 0.0,
                    "kwh_km": 0.0,
                }
                gap += timedelta(days=1)
        key = day.isoformat()
        if key not in days:
            # A day starts where the last one ended (the car stood overnight).
            days[key] = {
                "first": before if before is not None else value,
                "kwh": 0.0,
                "kwh_km": 0.0,
            }
        days[key]["last"] = max(days[key].get("last", value), value)
        before = days[key]["last"]
    if capacity:
        for (start, level), (end, after) in zip(soc, soc[1:], strict=False):
            # One poll writes level and odometer a moment apart, in either order.
            driven_from = _at(odometer, times, start + SAME_POLL)
            driven_to = _at(odometer, times, end + SAME_POLL)
            if (
                after < level
                and driven_from is not None
                and driven_to is not None
                and driven_to - driven_from > 0.5
            ):
                entry = days.get(end.date().isoformat())
                if entry is not None:
                    entry["kwh"] += (level - after) / 100 * capacity
                    entry["kwh_km"] += driven_to - driven_from
    return [
        {
            "date": day,
            "km": round(data["last"] - data["first"], 1),
            "kwh": round(data["kwh"], 2) if capacity else None,
            "kwh_km": round(data["kwh_km"], 1) if capacity else None,
        }
        for day, data in sorted(days.items())
    ]


def car_model(
    days: list[dict[str, Any]],
    temps: dict[str, float] | None = None,
    workdays: dict[str, bool] | None = None,
) -> dict[str, Any] | None:
    """What a car really uses (kWh/100 km, more when it is cold) and drives a day.

    The usual distance is the 80th percentile of the days, so most days fit.
    """
    temps = temps or {}
    workdays = workdays or {}
    model: dict[str, Any] = {}
    driving = [d for d in days if (d.get("kwh_km") or 0) >= 10 and d.get("kwh")]
    if len(driving) >= CAR_DAYS:
        known = [d for d in driving if d["date"] in temps]
        rows = [[1.0, max(0.0, HEAT_BELOW - temps[d["date"]])] for d in known]
        targets = [100 * d["kwh"] / d["kwh_km"] for d in known]
        # The cold slope only counts when the days cover cold weather.
        cold_days = sum(1 for row in rows if row[1] >= 5.0)
        fitted = (
            _solve(rows, targets)
            if len(rows) >= CAR_DAYS and cold_days >= CAR_DAYS // 2
            else None
        )
        if fitted and fitted[0] > 0 and fitted[1] > 0:
            model["consumption"] = round(fitted[0], 1)
            model["cold"] = round(fitted[1], 2)
        else:
            # Without: the median, and the temperature it was learned at.
            model["consumption"] = round(
                median(100 * d["kwh"] / d["kwh_km"] for d in driving), 1
            )
            model["cold"] = None
            model["temp"] = (
                round(sum(temps[d["date"]] for d in known) / len(known), 1)
                if known
                else None
            )
        model["consumption_days"] = len(driving)
    for name, wanted in (("workday_km", True), ("day_off_km", False)):
        values = sorted(
            d["km"]
            for d in days
            if workdays.get(d["date"], date.fromisoformat(d["date"]).weekday() < 5)
            == wanted
        )
        if len(values) >= CAR_DAYS:
            model[name] = round(values[min(len(values) - 1, int(0.8 * len(values)))])
    if not model:
        return None
    model["days"] = len(days)
    return model


def home_check(days: dict[str, dict[str, Any]]) -> dict[str, Any] | None:
    """The home's use from the balance against the consumption sensor.

    Only complete hours that have both count. A sensor that misses a solar
    system (often a balcony one) shows less than the balance on sunny days.
    """
    calc = sensor = 0.0
    counted = set()
    for day, data in days.items():
        for hour in data.get("hours") or []:
            if (
                hour.get("home_calc")
                and "home_sensor" in hour
                and hour.get("cov", 0) >= 0.8
            ):
                calc += hour["home"]
                sensor += hour["home_sensor"]
                counted.add(day)
    if len(counted) < 3 or calc <= 0:
        return None
    return {
        "days": len(counted),
        "calc_kwh": round(calc, 1),
        "sensor_kwh": round(sensor, 1),
    }
