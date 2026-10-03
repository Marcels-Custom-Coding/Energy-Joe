"""Hour records and day summaries: what happened in the home, hour by hour.

An hour record holds the energy of the hour in kWh (consumption, solar, grid
import and export, battery charging and discharging, per battery and per
device), the charge level at its end and, when Joe watched live, the outdoor
temperature, who was at home and the solar forecast. Records are keyed by the
local start of the hour; a day is a local calendar day (23 to 25 hours).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime, time, timedelta
from typing import Any

from homeassistant.util import dt as dt_util

# A live hour with at least this much of the readings is kept as it is.
COMPLETE = 0.9
# Fields only a live watch can know; history keeps them when it fills an hour.
CONTEXT_FIELDS = ("temp", "present", "fc_today", "fc_tomorrow", "fc_remaining")


@dataclass(slots=True)
class Flow:
    """Energy of one reading in an hour: positive and negative side, coverage 0–1."""

    positive: float
    negative: float
    coverage: float

    @property
    def net(self) -> float:
        return self.positive - self.negative


@dataclass(slots=True)
class HourParts:
    """Everything known about one hour, before it becomes a record."""

    grid: Flow | None = None
    home: Flow | None = None
    solar: list[Flow | None] = field(default_factory=list)
    batteries: dict[str, Flow | None] = field(default_factory=dict)
    soc: dict[str, float | None] = field(default_factory=dict)
    consumers: dict[str, float | None] = field(default_factory=dict)
    # Exact hourly energies from the Energy dashboard's counters, if there are any.
    grid_in: float | None = None
    grid_out: float | None = None
    solar_total: float | None = None
    bat_in: float | None = None
    bat_out: float | None = None
    context: dict[str, Any] = field(default_factory=dict)


def hour_starts(start: datetime, end: datetime) -> list[datetime]:
    """Local starts of all hours from start (inclusive) to end (exclusive).

    Steps in UTC, so days with a clock change get 23 or 25 hours and zones
    with half-hour offsets get their own local hours.
    """
    current = dt_util.as_utc(start)
    stop = dt_util.as_utc(end)
    result = []
    while current < stop:
        result.append(dt_util.as_local(current))
        current += timedelta(hours=1)
    return result


def local_hour(moment: datetime) -> datetime:
    """Start of the local hour a moment falls into."""
    return dt_util.as_local(moment).replace(minute=0, second=0, microsecond=0)


def day_key(start: datetime) -> str:
    return dt_util.as_local(start).date().isoformat()


def _round(value: float | None, digits: int = 4) -> float | None:
    return None if value is None else round(value, digits)


def compose(start: datetime, parts: HourParts, source: str) -> dict[str, Any]:
    """Turn the parts of an hour into a record (fields without a value are left out)."""
    coverages: list[float] = []
    record: dict[str, Any] = {
        "start": dt_util.as_local(start).isoformat(),
        "src": source,
    }

    grid_in, grid_out = parts.grid_in, parts.grid_out
    if parts.grid is not None:
        coverages.append(parts.grid.coverage)
        if grid_in is None or grid_out is None:
            grid_in, grid_out = parts.grid.positive, parts.grid.negative

    solar = parts.solar_total
    if parts.solar:
        coverages.extend(f.coverage if f else 0.0 for f in parts.solar)
        if solar is None:
            known = [f.positive for f in parts.solar if f]
            solar = sum(known) if known else None

    bat_in, bat_out = parts.bat_in, parts.bat_out
    batteries: dict[str, dict[str, float]] = {}
    if parts.batteries:
        sums = [0.0, 0.0]
        for battery_id, flow in parts.batteries.items():
            entry: dict[str, float] = {}
            if flow is not None:
                coverages.append(flow.coverage)
                entry["in"] = round(flow.positive, 4)
                entry["out"] = round(flow.negative, 4)
                sums[0] += flow.positive
                sums[1] += flow.negative
            else:
                coverages.append(0.0)
            if (soc := parts.soc.get(battery_id)) is not None:
                entry["soc"] = round(soc, 1)
            batteries[battery_id] = entry
        if bat_in is None or bat_out is None:
            bat_in, bat_out = sums
    for battery_id, soc in parts.soc.items():
        if battery_id not in batteries and soc is not None:
            batteries[battery_id] = {"soc": round(soc, 1)}

    home = None
    if parts.home is not None:
        coverages.append(parts.home.coverage)
        home = parts.home.net
    elif grid_in is not None and grid_out is not None:
        # No consumption sensor: what came in, minus what went out or into storage.
        home = grid_in - grid_out + (solar or 0.0) - (bat_in or 0.0) + (bat_out or 0.0)
        record["home_calc"] = True

    for name, value in (
        ("home", home),
        ("solar", solar),
        ("grid_in", grid_in),
        ("grid_out", grid_out),
        ("bat_in", bat_in if parts.batteries or parts.bat_in is not None else None),
        ("bat_out", bat_out if parts.batteries or parts.bat_out is not None else None),
    ):
        if value is not None:
            record[name] = round(value, 4)
    if batteries:
        record["bat"] = batteries
    use = {k: round(v, 4) for k, v in parts.consumers.items() if v is not None}
    if use:
        record["use"] = use
    for name, value in parts.context.items():
        if value is not None and value != {}:
            record[name] = value
    record["cov"] = round(min(coverages), 3) if coverages else 0.0
    return record


def merge(
    old: dict[str, Any] | None, new: dict[str, Any], *, force: bool = False
) -> dict[str, Any]:
    """Combine a stored hour with a newly read one.

    A complete live hour stays as it is (unless forced); otherwise the new
    energies win and the live-only context (temperature, presence, forecast)
    is kept.
    """
    if old is None:
        return new
    if (
        not force
        and new["src"] != "live"
        and old["src"] == "live"
        and old.get("cov", 0) >= COMPLETE
    ):
        return old
    merged = dict(new)
    for name in CONTEXT_FIELDS:
        if name not in merged and name in old:
            merged[name] = old[name]
    return merged


def in_window(start: datetime, window: dict[str, str] | None) -> bool:
    """Whether a local hour starts inside the cheap window (may cross midnight)."""
    if not window:
        return False
    begin = time.fromisoformat(window["start"])
    end = time.fromisoformat(window["end"])
    moment = dt_util.as_local(start).time()
    if begin <= end:
        return begin <= moment < end
    return moment >= begin or moment < end


def summarize(
    day: str, data: dict[str, Any], window: dict[str, str] | None
) -> dict[str, Any]:
    """Totals and highlights of one day for the history and for learning."""
    hours = data.get("hours") or []
    expected = _hours_in_day(date.fromisoformat(day))

    def total(name: str) -> float | None:
        values = [h[name] for h in hours if name in h]
        return round(sum(values), 3) if values else None

    summary: dict[str, Any] = {
        "date": day,
        "hours": len(hours),
        "expected": expected,
        "cov": round(sum(h.get("cov", 0) for h in hours) / expected, 3)
        if hours
        else 0.0,
        "home": total("home"),
        "solar": total("solar"),
        "grid_in": total("grid_in"),
        "grid_out": total("grid_out"),
        "bat_in": total("bat_in"),
        "bat_out": total("bat_out"),
        "sources": {},
        "workday": data.get("workday"),
    }
    for hour in hours:
        summary["sources"][hour["src"]] = summary["sources"].get(hour["src"], 0) + 1
    if window:
        cheap = [
            h["grid_in"]
            for h in hours
            if "grid_in" in h and in_window(datetime.fromisoformat(h["start"]), window)
        ]
        summary["grid_in_cheap"] = round(sum(cheap), 3) if cheap else None

    forecast = data.get("fc") or {}
    summary["fc_ahead"] = forecast.get("ahead_kwh")
    summary["fc_latest"] = forecast.get("latest_kwh")
    if summary["solar"] is not None and (ahead := summary["fc_ahead"]):
        summary["solar_vs_fc"] = (
            round(summary["solar"] / ahead, 3) if ahead >= 0.5 else None
        )

    temps = [h["temp"] for h in hours if "temp" in h]
    if temps:
        summary["temp"] = {
            "min": round(min(temps), 1),
            "max": round(max(temps), 1),
            "mean": round(sum(temps) / len(temps), 1),
        }
    present: dict[str, float] = {}
    for hour in hours:
        for person, fraction in (hour.get("present") or {}).items():
            present[person] = present.get(person, 0.0) + fraction
    if present:
        summary["present"] = {k: round(v, 2) for k, v in present.items()}

    socs: dict[str, list[float]] = {}
    for hour in hours:
        for battery_id, entry in (hour.get("bat") or {}).items():
            if "soc" in entry:
                socs.setdefault(battery_id, []).append(entry["soc"])
    if socs:
        summary["soc"] = {
            k: {"min": min(v), "max": max(v), "end": v[-1]} for k, v in socs.items()
        }

    home, grid_in = summary["home"], summary["grid_in"]
    if home and grid_in is not None and home > 0:
        summary["self_sufficiency"] = round(
            max(0.0, min(1.0, (home - grid_in) / home)), 3
        )

    # The first hour in which the sun covers the home on its own.
    for hour in hours:
        if hour.get("solar", 0) > 0 and hour.get("solar", 0) >= hour.get("home", 0) > 0:
            summary["sun_covers"] = hour["start"]
            break
    return summary


def _hours_in_day(day: date) -> int:
    start = dt_util.start_of_local_day(day)
    end = dt_util.start_of_local_day(day + timedelta(days=1))
    return round((end - start).total_seconds() / 3600)


def day_view(
    day: str,
    data: dict[str, Any],
    window: dict[str, str] | None,
    sun: dict[str, datetime],
) -> dict[str, Any]:
    """A day laid out on its local hours, ready to draw.

    Every hour gets a slot (23 to 25 per day); records, the forecast, the
    cheap window and sunrise and sunset are placed on those slots.
    """
    first = dt_util.start_of_local_day(date.fromisoformat(day))
    last = dt_util.start_of_local_day(date.fromisoformat(day) + timedelta(days=1))
    starts = hour_starts(first, last)
    slots = {start.isoformat(): index for index, start in enumerate(starts)}
    hours = [
        {**record, "slot": slots[record["start"]]}
        for record in data.get("hours") or []
        if record["start"] in slots
    ]

    def on_slots(values: dict[str, float] | None) -> list[float | None]:
        result: list[float | None] = [None] * len(starts)
        for stamp, wh in (values or {}).items():
            moment = dt_util.parse_datetime(stamp)
            if moment is not None:
                index = slots.get(dt_util.as_local(moment).isoformat())
                if index is not None:
                    result[index] = round(wh / 1000, 4)
        return result

    ranges: list[list[int]] = []
    for index, start in enumerate(starts):
        if in_window(start, window):
            if ranges and ranges[-1][1] == index:
                ranges[-1][1] = index + 1
            else:
                ranges.append([index, index + 1])
    sun_view: dict[str, Any] = {}
    for event, moment in sun.items():
        sun_view[event] = dt_util.as_local(moment).isoformat()
        sun_view[f"{event}_slot"] = round((moment - first).total_seconds() / 3600, 2)
    forecast = data.get("fc") or {}
    plan = data.get("plan")
    plan_slots: list[float | None] = [None] * len(starts)
    for hour in (plan or {}).get("hours") or []:
        index = slots.get(hour["start"])
        if index is not None:
            plan_slots[index] = hour["soc"]
    return {
        "date": day,
        "plan": None
        if plan is None
        else {k: v for k, v in plan.items() if k not in ("hours", "meta")},
        "plan_soc_slots": plan_slots,
        "slots": [start.strftime("%H:%M") for start in starts],
        "hours": hours,
        "fc": {k: v for k, v in forecast.items() if k in ("ahead_kwh", "latest_kwh")},
        "fc_slots": on_slots(forecast.get("hours")),
        "fc_ahead_slots": on_slots(forecast.get("ahead_hours")),
        "workday": data.get("workday"),
        "summary": summarize(day, data, window),
        "window": window,
        "window_slots": ranges,
        "sun": sun_view,
    }
