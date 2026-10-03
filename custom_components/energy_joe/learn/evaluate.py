"""What a plan would have brought: Joe replays a fixed plan with the real day.

Both runs, with the plan and without it, use the same real sun and the same
real consumption, so the difference is what steering would have changed, not
how good the forecast was. The forecast's accuracy is reported next to it.
"""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

from homeassistant.util import dt as dt_util

from ..plan.planner import Battery, Hour, PlanInput, Prices, simulate

# Hours of the day that may be missing before an evaluation does not count.
MISSING_ALLOWED = 2


def takeover(
    starts: list[datetime], solar: list[float], home: list[float], after: datetime
) -> int | None:
    """Index of the first hour after a moment in which the sun covers the home."""
    for index, start in enumerate(starts):
        if start >= after and solar[index] >= home[index] > 0:
            return index
    return None


def bridge(
    starts: list[datetime],
    solar: list[float],
    home: list[float],
    window_end: datetime,
    until: int | None,
) -> float:
    """Energy the batteries must give from the window's end until an hour (or the end)."""
    total = 0.0
    for index, start in enumerate(starts):
        if start < window_end:
            continue
        if until is not None and index >= until:
            break
        total += max(0.0, home[index] - solar[index])
    return total


def start_soc(plan: dict[str, Any], records: dict[str, dict[str, Any]]) -> float | None:
    """The real charge level of all planned batteries when the window began."""
    window_start = datetime.fromisoformat(plan["window"]["start"])
    before = dt_util.as_local(window_start - timedelta(hours=1)).isoformat()
    record = records.get(before)
    if record is None:
        return None
    stored = capacity = 0.0
    for battery in plan.get("batteries") or []:
        soc = (record.get("bat") or {}).get(battery["id"], {}).get("soc")
        if soc is None or not battery.get("capacity"):
            return None
        stored += battery["capacity"] * soc / 100
        capacity += battery["capacity"]
    return 100 * stored / capacity if capacity else None


def evaluate(
    plan: dict[str, Any],
    records: dict[str, dict[str, Any]],
    now: datetime,
    until: datetime | None = None,
) -> dict[str, Any]:
    """Replay a fixed plan with the real hours (records keyed by their start).

    Before the plan's day is over, "until" is the end of the last recorded hour:
    the hours after it are played as Joe expected them, which gives a first,
    provisional result in the morning.
    """
    window_start = datetime.fromisoformat(plan["window"]["start"])
    window_end = datetime.fromisoformat(plan["window"]["end"])
    planned = [
        h
        for h in plan.get("hours") or []
        if datetime.fromisoformat(h["start"]) >= window_start
    ]
    result: dict[str, Any] = {
        "created": dt_util.as_local(now).isoformat(timespec="seconds"),
        "target": plan.get("target"),
        "window": plan["window"],
        "complete": False,
        "final": until is None,
        "until": None if until is None else dt_util.as_local(until).isoformat(),
    }
    hours: list[Hour] = []
    real: list[dict[str, Any] | None] = []
    missing = 0
    for hour in planned:
        record = records.get(hour["start"])
        ahead = until is not None and datetime.fromisoformat(hour["start"]) >= until
        if ahead or record is None or "home" not in record:
            missing += 0 if ahead else 1
            real.append(None)
            # A missing hour is played with what Joe expected for it.
            hours.append(
                Hour(
                    datetime.fromisoformat(hour["start"]),
                    hour["solar"],
                    hour["home"],
                    hour["window"],
                    price=hour.get("price"),
                )
            )
            continue
        real.append(record)
        hours.append(
            Hour(
                datetime.fromisoformat(hour["start"]),
                max(0.0, record.get("solar", 0.0)),
                max(0.0, record["home"]),
                hour["window"],
                price=hour.get("price"),
            )
        )
    result["missing"] = missing
    if not planned or missing > MISSING_ALLOWED or not plan.get("capacity_kwh"):
        return result

    soc = start_soc(plan, records)
    result["start_soc"] = round(
        soc if soc is not None else plan.get("soc_start", 0.0), 1
    )
    rules = plan["rules"]
    prices = plan["prices"]
    inp = PlanInput(
        now=hours[0].start,
        window_start=window_start,
        window_end=window_end,
        hours=hours,
        batteries=[
            Battery(
                "all",
                "all",
                plan["capacity_kwh"],
                result["start_soc"],
                plan.get("charge_kw") or 2.5,
                plan.get("discharge_kw") or plan.get("charge_kw") or 2.5,
            )
        ],
        prices=Prices(
            prices["night"],
            prices["day"],
            prices["feed_in"],
            prices.get("assumed", False),
        ),
        reserve=rules["reserve"],
        max_target=rules["max_target"],
        grid_limit_kw=rules.get("grid_limit_kw"),
        max_night_kwh=rules.get("max_night_kwh"),
        discharge_mode=rules["discharge_mode"],
        buffer=0.0,
        efficiency=rules.get("efficiency", 0.9),
        max_price=rules.get("max_price"),
    )
    with_plan = simulate(inp, plan["capacity_kwh"] * plan["target"] / 100)
    without = simulate(inp, None)

    cost = day = night = sold = 0.0
    for hour, record in zip(hours, real, strict=True):
        if record is None:
            continue
        price = hour.price
        if price is None:
            price = prices["night"] if hour.window else prices["day"]
        bought = record.get("grid_in", 0.0)
        cost += bought * price - record.get("grid_out", 0.0) * prices["feed_in"]
        sold += record.get("grid_out", 0.0)
        if hour.window:
            night += bought
        else:
            day += bought

    starts = [h.start for h in hours]
    after = [i for i, s in enumerate(starts) if s >= window_end]
    planned_solar = [h["solar"] for h in planned]
    planned_home = [h["home"] for h in planned]
    real_solar = [h.solar for h in hours]
    real_home = [h.home for h in hours]
    sun_planned = takeover(starts, planned_solar, planned_home, window_end)
    sun_actual = takeover(starts, real_solar, real_home, window_end)
    result.update(
        complete=True,
        saving=round(without.cost - with_plan.cost, 2) + 0.0,
        with_plan={
            "day_kwh": round(with_plan.bought_day, 2),
            "night_kwh": round(with_plan.bought_night, 2),
            "sold_kwh": round(with_plan.sold, 2),
        },
        without={
            "day_kwh": round(without.bought_day, 2),
            "night_kwh": round(without.bought_night, 2),
            "sold_kwh": round(without.sold, 2),
        },
        actual={
            "day_kwh": round(day, 2),
            "night_kwh": round(night, 2),
            "sold_kwh": round(sold, 2),
            "cost": round(cost, 2),
        },
        solar={
            "actual": round(sum(hours[i].solar for i in after), 2),
            "forecast": plan.get("solar_kwh"),
        },
        home={
            "actual": round(sum(hours[i].home for i in after), 2),
            "forecast": plan.get("home_kwh"),
        },
        # Both over the hours Joe wanted to bridge, so a late sun cannot blow it up.
        bridge={
            "planned": round(
                bridge(starts, planned_solar, planned_home, window_end, sun_planned), 2
            ),
            "actual": round(
                bridge(starts, real_solar, real_home, window_end, sun_planned), 2
            ),
        },
        takeover={
            "planned": None
            if sun_planned is None
            else dt_util.as_local(starts[sun_planned]).isoformat(),
            "actual": None
            if sun_actual is None
            else dt_util.as_local(starts[sun_actual]).isoformat(),
        },
        hours=[
            {
                "start": dt_util.as_local(start).isoformat(),
                "with": round(with_plan.soc[i], 1),
                "without": round(without.soc[i], 1),
            }
            for i, start in enumerate(starts)
        ],
    )
    return result
