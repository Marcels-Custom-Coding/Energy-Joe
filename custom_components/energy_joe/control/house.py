"""Charging the car fast: the house from the battery, the car from the grid.

While a car charges fast (evcc's mode "now"), evcc locks the home battery
against discharging ("Entladesperre"), so that the battery does not go into
the car. Then the house draws everything from the grid, too. With the rule
(rules.car_house_only) Joe takes over by day: he switches evcc's lock off
(and back as it was afterwards) and lets the battery whose turn it is
(control/team.py; the only one, where one regulates alone) give a fixed
power – what the house needs without the wallbox, on top of the sun. The
others stay blocked, the car takes the rest from the grid. Not in evcc's
other modes, not in Joe's cheap window at night (the night's plan counts:
everything from the grid then).

The house's need without the wallbox, from the grid meter, the batteries and
the loadpoints: what comes from the grid plus what the batteries give, less
what the loadpoints charge (evcc's charge power):

    need = grid - sum(batteries, charging positive) - sum(loadpoints)

That is the house's own consumption less the sun, whatever the battery gives
meanwhile (its power is in both terms); no home meter is needed, and one that
counts the wallbox or not makes no difference. Below 0 (more sun than the
house needs) the battery gives nothing.

Watched every EVERY while it runs: the power is the lowest need over SPAN
(a grid meter read before the wallbox's after the car ramped up must not
hand the car a spike: rather the house draws a little from the grid for a
moment), in steps of STEP_W, written anew once it moved by CHANGE_W, so
that a Modbus inverter is not flooded.

No Home Assistant imports.
"""

from __future__ import annotations

from datetime import datetime, timedelta
import math
from typing import Any

# evcc's modes in which the rule applies ("Schnell").
FAST_MODES = ("now",)
# How often Joe looks while it runs, the span of the lowest need, its steps
# and the change that is written anew (W).
EVERY = timedelta(seconds=5)
SPAN = timedelta(seconds=30)
STEP_W = 50.0
CHANGE_W = 100.0


def fresh() -> dict[str, Any]:
    """What the executor keeps of it: whether it runs and since when, evcc's
    lock Joe switched off, the power last written (W) and the battery that
    gives it outside "Nacheinander" (with its lever)."""
    return {"on": False, "since": None, "lock": None, "w": None, "single": None}


def need_w(
    grid_kw: float | None,
    battery_w: list[float | None],
    loadpoint_kw: list[float | None],
) -> float | None:
    """The house's need without the wallbox on top of the sun (W, at least
    0); None while a value is missing."""
    if grid_kw is None or None in battery_w or None in loadpoint_kw:
        return None
    batteries = sum(w or 0.0 for w in battery_w)
    wallbox = sum(kw or 0.0 for kw in loadpoint_kw)
    return max(0.0, (grid_kw - wallbox) * 1000 - batteries)


def sample(samples: list[tuple[datetime, float]], now: datetime, value: float) -> None:
    """One look at the need; only the last SPAN is kept."""
    samples.append((now, value))
    while samples and now - samples[0][0] > SPAN:
        samples.pop(0)


def target_w(samples: list[tuple[datetime, float]]) -> float:
    """The power the battery gives: the lowest need seen over SPAN, in steps
    of STEP_W (down: never more than the house takes); 0 without a look."""
    if not samples:
        return 0.0
    lowest = min(value for _, value in samples)
    return max(0.0, math.floor(lowest / STEP_W + 1e-9) * STEP_W)


def moved(target: float, written: float | None) -> bool:
    """Whether the power is to be written anew: none yet, a change of at
    least CHANGE_W, or to or from nothing."""
    if written is None:
        return True
    if (target <= 0) != (written <= 0):
        return True
    return abs(target - written) >= CHANGE_W - 1e-9


def shares(watts: float, ids: list[str], shared: bool) -> dict[str, float]:
    """The power per battery of the group that gives it: each the whole
    power behind one shared limit (the system's), else an even share."""
    if not ids:
        return {}
    each = watts if shared else math.floor(watts / len(ids) / STEP_W) * STEP_W
    return dict.fromkeys(ids, float(each))
