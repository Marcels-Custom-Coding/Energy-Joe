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
) -> list[dict[str, Any]]:
    """Which actions run tonight, from when to when, and how much they draw."""
    learned = learned or {}
    night = window_start.isoformat()
    result = []
    for action in actions:
        if not action.get("enabled", True):
            continue
        reasons: list[str] = []
        is_manual = manual.get(action["id"]) == night
        run = is_manual
        if is_manual:
            reasons.append("tonight")
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
            if sunny:
                reasons.append("enough_sun")
            elif failed:
                reasons.append("conditions")
            else:
                run = True
                reasons.append("little_sun" if threshold is not None else "every_night")
        else:
            reasons.append("manual_only")
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
        hours = max(0.0, (end - start).total_seconds() / 3600)
        power = action.get("power_kw") or 0.0
        entry.update(
            run=run,
            reasons=reasons,
            start=start.isoformat(timespec="minutes"),
            end=end.isoformat(timespec="minutes"),
            energy_kwh=round(power * hours, 2) if run else 0.0,
        )
        result.append(entry)
    return result


def reserved_kw(actions: list[dict[str, Any]], start: datetime, end: datetime) -> float:
    """Average power that running actions draw during an hour (for the grid limit)."""
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


def _number(state: State | None) -> float | None:
    try:
        value = float(state.state) if state else math.nan
    except ValueError:
        return None
    return None if math.isnan(value) else value
