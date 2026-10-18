"""Night actions: what else should run in the cheap window tonight, and when.

An action runs when its switch "tonight" is on, or (automatic) when tomorrow
brings less sun than its threshold and all its conditions hold. A "switch"
action runs the whole window (ending a few minutes early if it needs a lead);
a "target" action (hot water) starts as late as possible so the water reaches
its target temperature by the end of the window.

Running actions take part of the grid limit away from the batteries, and the
energy of a linked consumer moves from the day into the night.
"""

from __future__ import annotations

from datetime import datetime, timedelta
import math
from typing import Any

from homeassistant.core import State
from homeassistant.util import dt as dt_util

from .ev import sun_before_departure

# Less than this missing (kWh) is not worth charging the car for.
MIN_KWH = 0.2
# What a charge point does without a car of the household: nothing.
LEAVE_ALONE = {"empty": "not_plugged", "guest": "guest", "unknown": "unknown_car"}
# Until Joe has learned them (see learn/): how far the hot water cools over a
# day, and how fast the heat pump heats it.
DEFAULT_DEMAND_K = 10.0
DEFAULT_RATE_K_PER_H = 8.0
# Hours the water must keep warm after the window (it loses heat while standing).
DAY_HOURS = 17
# Extra time before the end so the target is reached for sure.
MARGIN = timedelta(minutes=15)


def condition_met(state: State | None, op: str, value: Any) -> bool:
    """Whether an entity's state compares with a value as a condition says."""
    if state is None:
        return False
    current: Any = state.state
    if isinstance(value, bool):
        current, value = current == "on", value
    elif isinstance(value, int | float):
        try:
            current = float(current)
        except ValueError:
            return False
    else:
        current, value = str(current), str(value)
    if op == "eq":
        return current == value
    if op == "ne":
        return current != value
    if not isinstance(current, float):
        return False
    return {
        "lt": current < value,
        "le": current <= value,
        "gt": current > value,
        "ge": current >= value,
    }[op]


def plan_actions(
    actions: list[dict[str, Any]],
    get: Any,
    window_start: datetime,
    window_end: datetime,
    tomorrow_kwh: float | None,
    manual: dict[str, str],
    learned: dict[str, Any] | None = None,
    needs: dict[str, dict[str, Any]] | None = None,
    detected: dict[str, dict[str, Any]] | None = None,
) -> list[dict[str, Any]]:
    """Which actions run tonight, from when to when, and how much they draw.

    A charge point charges the car plugged into it (see cars.py): a car with
    "charging by need" (see ev.py) only when tomorrow's driving needs more
    than it has, and only as long as charging the missing energy takes. A
    guest's car, a car Joe cannot tell, or no car: Joe leaves the wallbox alone.
    """
    learned = learned or {}
    needs = needs or {}
    detected = detected or {}
    # The night by its local start (as the plan's window says it); times in
    # UTC, so a night with a clock change has its real length.
    night = dt_util.as_local(window_start).isoformat()
    window_start = dt_util.as_utc(window_start)
    window_end = dt_util.as_utc(window_end)
    result = []
    for action in actions:
        if not action.get("enabled", True):
            continue
        reasons: list[str] = []
        is_manual = manual.get(action["id"]) == night
        need = needs.get(action["id"])
        by_need = action["kind"] == "switch" and bool(need and need.get("known"))
        run = is_manual
        found = detected.get(action["id"]) or {}
        plugged = found.get("state")
        if is_manual:
            reasons.append("tonight")
        elif plugged in LEAVE_ALONE:
            reasons.append(LEAVE_ALONE[plugged])
        elif action.get("auto", True):
            threshold = action.get("forecast_below_kwh")
            sunny = (
                threshold is not None
                and tomorrow_kwh is not None
                and tomorrow_kwh >= threshold
            )
            failed = [
                c["entity_id"]
                for c in action.get("conditions") or []
                if not condition_met(get(c["entity_id"]), c["op"], c["value"])
            ]
            if by_need and need is not None:
                if need["missing_kwh"] < MIN_KWH:
                    reasons.append("enough_range")
                elif sun_before_departure(need, sunny):
                    reasons.append("sun_before_trip")
                elif failed:
                    reasons.append("conditions")
                else:
                    run = True
                    reasons.append("need")
            elif sunny:
                reasons.append("enough_sun")
            elif failed:
                reasons.append("conditions")
            else:
                run = True
                reasons.append("little_sun" if threshold is not None else "every_night")
        else:
            reasons.append("manual_only")
        if need is not None and not need.get("known"):
            # The level is known but not the battery size: say what is missing.
            reasons.append(
                "need_capacity"
                if need.get("soc") is not None and not need.get("capacity_kwh")
                else "need_unknown"
            )
        end = window_end - timedelta(minutes=action.get("lead_min") or 0)
        start = window_start
        entry: dict[str, Any] = {
            "id": action["id"],
            "name": action["name"],
            "kind": action["kind"],
            "priority": action.get("priority", 1),
            "manual": is_manual,
            "power_kw": action.get("power_kw"),
        }
        if plugged and plugged != "free":
            # Which car is plugged in, and how Joe knows (see cars.py).
            entry.update(plugged=plugged, car=found.get("car"), how=found.get("how"))
        if action["kind"] == "target":
            temperature = _number(get(action.get("sensor_entity") or ""))
            mine = learned.get(action["id"]) or {}
            demand = mine.get("demand_k") or DEFAULT_DEMAND_K
            rate = mine.get("rate_k_per_h") or DEFAULT_RATE_K_PER_H
            loss = (mine.get("loss_k_per_h") or 0.0) * DAY_HOURS
            target = min(
                action["maximum"],
                max(
                    action["comfort"],
                    action["comfort"] + demand + loss + action["buffer"],
                ),
            )
            entry.update(
                target=round(target, 1),
                temperature=temperature,
                rate=rate,
                learned=bool(mine),
            )
            if temperature is None:
                reasons.append("no_temperature")
            elif temperature >= target:
                run = False
                reasons.append("warm_enough")
            else:
                needed = timedelta(hours=(target - temperature) / rate)
                start = max(window_start, end - needed - MARGIN)
        if by_need and need is not None:
            entry["need"] = need
            if run and not is_manual:
                # Only as long as the missing energy takes, at the end of the window.
                if action.get("power_kw"):
                    needed = timedelta(hours=need["wall_kwh"] / action["power_kw"])
                    start = max(window_start, end - needed - MARGIN)
                entry.update(target=need["target"], sensor=need["sensor"])
        elif need is not None:
            entry["need"] = need
        hours = max(0.0, (end - start).total_seconds() / 3600)
        power = action.get("power_kw") or 0.0
        entry.update(
            run=run,
            reasons=reasons,
            start=dt_util.as_local(start).isoformat(timespec="minutes"),
            end=dt_util.as_local(end).isoformat(timespec="minutes"),
            energy_kwh=round(power * hours, 2) if run else 0.0,
        )
        result.append(entry)
    return result


def reserved_kw(actions: list[dict[str, Any]], start: datetime, end: datetime) -> float:
    """Average power that running actions draw from start to end (an hour or
    a quarter hour; for the grid limit)."""
    total = 0.0
    for action in actions:
        if not action["run"] or not action.get("power_kw"):
            continue
        begin = datetime.fromisoformat(action["start"])
        stop = datetime.fromisoformat(action["end"])
        overlap = (min(stop, end) - max(begin, start)).total_seconds()
        if overlap > 0:
            total += action["power_kw"] * overlap / (end - start).total_seconds()
    return total


def reserved_quarters(
    actions: list[dict[str, Any]], start: datetime
) -> tuple[float, ...]:
    """What running actions draw in each quarter of the hour from start (kW):
    11 kW for a quarter hour count in that quarter, not as 2.75 kW for the hour."""
    start = dt_util.as_utc(start)
    quarter = timedelta(minutes=15)
    return tuple(
        reserved_kw(actions, start + q * quarter, start + (q + 1) * quarter)
        for q in range(4)
    )


def _number(state: State | None) -> float | None:
    try:
        value = float(state.state) if state else math.nan
    except ValueError:
        return None
    return None if math.isnan(value) else value
