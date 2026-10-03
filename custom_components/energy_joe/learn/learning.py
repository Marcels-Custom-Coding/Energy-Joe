"""What Joe learns from his days: how well the forecast fits, its timing, the buffer.

Every function looks at stored days (see observe/store.py) and returns the
learned value together with the number of days it rests on. Too few days give
None: then Joe keeps what he had.
"""

from __future__ import annotations

from datetime import datetime, timedelta
from statistics import median
from typing import Any

from homeassistant.util import dt as dt_util

# Days a value needs before Joe uses it.
SOLAR_DAYS = 5
SHIFT_DAYS = 5
BUFFER_DAYS = 7
# The share of mornings the buffer should cover completely.
BUFFER_QUANTILE = 0.8
BUFFER_LIMITS = (0.05, 1.0)
# A forecast this small says little about how well it fits.
SMALL_FORECAST = 1.0


def _complete_solar(hours: list[dict[str, Any]]) -> bool:
    return len(hours) >= 20 and all(h.get("cov", 0) >= 0.8 for h in hours)


def solar_ratios(days: dict[str, dict[str, Any]]) -> list[dict[str, Any]]:
    """Forecast from the evening before against the real production, per day."""
    result = []
    for day, data in days.items():
        forecast = (data.get("fc") or {}).get("ahead_kwh")
        hours = [h for h in data.get("hours") or [] if "solar" in h]
        if forecast is None or not _complete_solar(hours):
            continue
        actual = sum(h["solar"] for h in hours)
        result.append(
            {
                "date": day,
                "forecast": round(forecast, 2),
                "actual": round(actual, 2),
                "ratio": round(actual / forecast, 3)
                if forecast >= SMALL_FORECAST
                else None,
            }
        )
    return result


def solar_factor(days: dict[str, dict[str, Any]]) -> tuple[float | None, int]:
    """How much of the forecast really comes: the median ratio of the last days."""
    ratios = [r["ratio"] for r in solar_ratios(days) if r["ratio"] is not None]
    if len(ratios) < SOLAR_DAYS:
        return None, len(ratios)
    return round(max(0.3, min(2.0, median(ratios))), 2), len(ratios)


def solar_shift(days: dict[str, dict[str, Any]]) -> tuple[int | None, int]:
    """Whether the hourly forecast fits best as it is, an hour earlier or later.

    A shift of +1 means the forecast's hours must move one hour later.
    """
    votes = {-1: 0, 0: 0, 1: 0}
    used = 0
    for data in days.values():
        forecast = (data.get("fc") or {}).get("ahead_hours") or (
            data.get("fc") or {}
        ).get("hours")
        hours = [h for h in data.get("hours") or [] if "solar" in h]
        if not forecast or not _complete_solar(hours):
            continue
        predicted = {
            dt_util.as_local(datetime.fromisoformat(stamp)): wh / 1000
            for stamp, wh in forecast.items()
        }
        if sum(1 for v in predicted.values() if v > 0) < 6:
            continue
        errors = {}
        for shift in votes:
            errors[shift] = sum(
                (
                    predicted.get(
                        datetime.fromisoformat(h["start"]) - timedelta(hours=shift), 0.0
                    )
                    - h["solar"]
                )
                ** 2
                for h in hours
            )
        best = min(errors, key=errors.__getitem__)
        # Only a clear improvement counts as a vote for moving the forecast.
        if best != 0 and errors[best] > 0.9 * errors[0]:
            best = 0
        votes[best] += 1
        used += 1
    if used < SHIFT_DAYS:
        return None, used
    return max(votes, key=votes.__getitem__), used


def solar_profile(days: dict[str, dict[str, Any]]) -> dict[str, Any] | None:
    """Average sun per hour of the day: as it came and as forecast the evening before."""
    actual = [0.0] * 24
    forecast = [0.0] * 24
    used = 0
    for data in days.values():
        predicted = (data.get("fc") or {}).get("ahead_hours")
        hours = [h for h in data.get("hours") or [] if "solar" in h]
        if not predicted or not _complete_solar(hours):
            continue
        for hour in hours:
            actual[datetime.fromisoformat(hour["start"]).hour] += hour["solar"]
        for stamp, wh in predicted.items():
            forecast[dt_util.as_local(datetime.fromisoformat(stamp)).hour] += wh / 1000
        used += 1
    if not used:
        return None
    return {
        "actual": [round(value / used, 3) for value in actual],
        "forecast": [round(value / used, 3) for value in forecast],
        "days": used,
    }


def _quantile(values: list[float], share: float) -> float:
    ordered = sorted(values)
    position = share * (len(ordered) - 1)
    low = int(position)
    high = min(low + 1, len(ordered) - 1)
    return ordered[low] + (ordered[high] - ordered[low]) * (position - low)


def buffer(evaluations: list[dict[str, Any]]) -> tuple[float | None, int]:
    """Buffer that would have covered most mornings: how much more the batteries needed."""
    errors = []
    for evaluation in evaluations:
        done = evaluation.get("complete") and evaluation.get("final", True)
        need = (evaluation.get("bridge") or {}) if done else {}
        planned, actual = need.get("planned"), need.get("actual")
        if planned is None or actual is None or planned < 0.3:
            continue
        errors.append(actual / planned - 1)
    if len(errors) < BUFFER_DAYS:
        return None, len(errors)
    low, high = BUFFER_LIMITS
    return round(max(low, min(high, _quantile(errors, BUFFER_QUANTILE))), 2), len(
        errors
    )


def results(days: dict[str, dict[str, Any]], since: str | None) -> dict[str, Any]:
    """What steering would have brought, summed up since learning (re)started."""
    evaluated = [
        (day, data["evaluation"])
        for day, data in sorted(days.items())
        if (data.get("evaluation") or {}).get("complete")
        and (since is None or day >= since[:10])
    ]
    savings = [e["saving"] for _, e in evaluated]
    last = evaluated[-1] if evaluated else None
    return {
        "since": since,
        "first": evaluated[0][0] if evaluated else None,
        "days": len(evaluated),
        "saving": round(sum(savings), 2),
        "better": sum(1 for s in savings if s > 0.01),
        "worse": sum(1 for s in savings if s < -0.01),
        "last": None
        if last is None
        else {
            "date": last[0],
            "window": last[1].get("window"),
            "final": last[1].get("final", True),
            "until": last[1].get("until"),
            "saving": last[1]["saving"],
            "day_kwh": last[1]["with_plan"]["day_kwh"],
            "day_kwh_without": last[1]["without"]["day_kwh"],
            "night_kwh": last[1]["with_plan"]["night_kwh"],
            "night_kwh_without": last[1]["without"]["night_kwh"],
        },
        "daily": [{"date": day, "saving": e["saving"]} for day, e in evaluated[-30:]],
    }
