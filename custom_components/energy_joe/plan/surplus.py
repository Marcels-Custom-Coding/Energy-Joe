"""Daytime surplus: how slowly the batteries may charge and still be full.

On a sunny day the batteries would take the morning sun at full power and be
full by noon; evcc's PV mode would see a surplus only afterwards. With a cap
on the charging power the surplus shows at the grid meter all day, and a
loadpoint in PV mode (a car, the floor heating) can run on it for hours.

The batteries must be full while the sun still surely suffices: before the
cautious forecast (solar times the caution) drops below the house load in the
evening ("PV end"). Joe looks for the smallest total cap with which the
cautious surplus of the hours left until then still fills them, plus a margin.
The executor works it out again every minute against the real charge level
and the real sun: if the sun lags, the cap rises; if the batteries can no
longer be filled, there is no cap at all.

Energies are kWh, powers kW, charge levels percent. No Home Assistant imports.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta
import math
from typing import Any

# The share of the forecast Joe counts on (the learned factor is in it already).
CAUTION = {"tight": 0.9, "normal": 0.8, "careful": 0.65}
# The energy the batteries still take, with this on top (losses, a cloud).
MARGIN = 1.1
MARGIN_KWH = 0.3
# Caps are written in steps of this, never below the smallest one (kW).
STEP_KW = 0.1
MIN_CAP_KW = 0.3
# A cap this close to the battery's own maximum is no cap.
NO_CAP_SHARE = 0.9
# Batteries with less room than this count as full (kWh).
FULL_KWH = 0.1


@dataclass(slots=True)
class Store:
    """A battery as the surplus sees it."""

    id: str
    capacity: float
    soc: float
    max_kw: float
    # Joe may cap it (else it takes the sun at full power).
    capped: bool = True

    @property
    def room(self) -> float:
        return max(0.0, self.capacity * (100 - self.soc) / 100)


@dataclass(slots=True)
class Slot:
    """The rest of one hour: its length and the cautious solar and home energy."""

    start: datetime
    hours: float
    solar: float
    home: float

    @property
    def surplus(self) -> float:
        return max(0.0, self.solar - self.home)

    @property
    def deficit(self) -> float:
        return max(0.0, self.home - self.solar)


def slots(
    plan_hours: list[dict[str, Any]],
    created: datetime | None,
    now: datetime,
    caution: float,
    sun_ratio: float | None = None,
) -> list[Slot]:
    """The hours of the plan from now on, the current one cut to what is left.

    The plan's first hour holds only the part after the plan was made; it is
    scaled to the part after now. The sun ratio (what the panels give now
    against the forecast) counts for the current hour when it is below the
    caution.
    """
    result: list[Slot] = []
    for hour in plan_hours:
        start = datetime.fromisoformat(hour["start"])
        end = start + timedelta(hours=1)
        if end <= now:
            continue
        left = 1.0
        if start < now:
            base = end - max(start, created) if created and created > start else None
            seconds = base.total_seconds() if base else 3600.0
            left = max(0.0, (end - now).total_seconds() / max(seconds, 60.0))
        solar = hour["solar"] * left * caution
        if start <= now and sun_ratio is not None and caution > 0:
            # Below even the cautious forecast right now: the real sun counts.
            solar *= max(0.0, min(1.0, sun_ratio / caution))
        result.append(
            Slot(
                start=start,
                hours=min(1.0, (end - max(start, now)).total_seconds() / 3600),
                solar=solar,
                home=hour["home"] * left,
            )
        )
    return result


def forecast_kw(
    plan_hours: list[dict[str, Any]], created: datetime | None, now: datetime
) -> float | None:
    """The forecast solar power of the current hour (kW, without caution)."""
    for hour in plan_hours:
        start = datetime.fromisoformat(hour["start"])
        end = start + timedelta(hours=1)
        if start <= now < end:
            share = 1.0
            if created and created > start:
                share = max(1 / 60, (end - created).total_seconds() / 3600)
            return hour["solar"] / share
    return None


def pv_end(found: list[Slot], now: datetime) -> datetime | None:
    """The end of today's last hour in which the cautious sun covers the house."""
    day = now.date()
    last = None
    for slot in found:
        if slot.start.date() != day and slot.start > now:
            break
        if slot.solar >= slot.home and slot.solar > 0:
            last = slot
    return last.start + timedelta(hours=1) if last else None


def taken(found: list[Slot], cap_kw: float) -> float:
    """What batteries capped to this power take of the surplus (kWh)."""
    return sum(min(s.surplus, cap_kw * s.hours) for s in found)


def smallest_cap(found: list[Slot], need: float, highest: float) -> float | None:
    """The smallest power (kW) with which the surplus brings `need` kWh, or None."""
    if need <= 0:
        return 0.0
    if taken(found, highest) < need - 1e-9:
        return None
    low, high = 0.0, highest
    for _ in range(40):
        middle = (low + high) / 2
        if taken(found, middle) >= need:
            high = middle
        else:
            low = middle
    return high


def day_cap(found: list[Slot], stores: list[Store], now: datetime) -> dict[str, Any]:
    """The caps for the rest of the day, or why there is none.

    Batteries Joe does not cap take the surplus first (at their full power);
    the capped ones share the cap by the room they have left, so they fill up
    at about the same time. Hours before the end in which the cautious sun
    does not cover the house (the early morning, a cloudy hour at noon) drain
    the batteries: that energy has to come in on top.

    A battery whose share would be close to its own maximum is not capped:
    it is worked out again as one that takes the sun at full power.
    """
    result = _day_cap(found, stores, now)
    while result["state"] == "cap" and result.get("uncapped"):
        stores = [
            Store(b.id, b.capacity, b.soc, b.max_kw, False)
            if b.id in result["uncapped"]
            else b
            for b in stores
        ]
        result = _day_cap(found, stores, now)
    result.pop("uncapped", None)
    return result


def _day_cap(found: list[Slot], stores: list[Store], now: datetime) -> dict[str, Any]:
    end = pv_end(found, now)
    result: dict[str, Any] = {
        "state": "no_sun",
        "pv_end": end,
        "caps": {},
        "cap_kw": None,
        "need_kwh": 0.0,
        "surplus_kwh": 0.0,
        "expected_kwh": 0.0,
        "hours": [],
    }
    if end is None or now >= end:
        # No sun left today: over for the day (in the afternoon), or none at all.
        late = end is not None or now.hour >= 12
        result["state"] = "after_pv" if late else "no_sun"
        return result
    until = [s for s in found if s.start < end]
    # The batteries Joe leaves alone take what they can first.
    free = [b for b in stores if not b.capped]
    left_room = sum(b.room for b in free)
    free_kw = sum(b.max_kw for b in free)
    rest: list[Slot] = []
    for slot in until:
        take = min(slot.surplus, free_kw * slot.hours, left_room)
        left_room -= take
        rest.append(Slot(slot.start, slot.hours, slot.solar - take, slot.home))
    capped = [b for b in stores if b.capped]
    room = sum(b.room for b in capped)
    # What the house takes from the batteries before the end (cautious sun).
    drain = sum(s.deficit for s in rest)
    need = (room + drain) * MARGIN + MARGIN_KWH if room > FULL_KWH else 0.0
    surplus = sum(s.surplus for s in rest)
    result.update(need_kwh=round(need, 2), surplus_kwh=round(surplus, 2))
    if not capped:
        result["state"] = "no_battery"
        return result
    if room <= FULL_KWH:
        result["state"] = "full"
        return result
    highest = sum(b.max_kw for b in capped)
    cap = smallest_cap(rest, need, highest)
    if cap is None:
        result["state"] = "not_reachable"
        return result
    cap = max(MIN_CAP_KW, _step(cap))
    if cap >= highest * NO_CAP_SHARE:
        result["state"] = "no_need"
        return result
    caps: dict[str, float] = {}
    uncapped: list[str] = []
    for battery in capped:
        if battery.room <= FULL_KWH:
            continue
        share = cap * battery.room / room
        value = max(MIN_CAP_KW, _step(share))
        if value < battery.max_kw * NO_CAP_SHARE:
            caps[battery.id] = round(value, 1)
        else:
            uncapped.append(battery.id)
    if not caps:
        result["state"] = "no_need"
        return result
    if uncapped:
        # Worked out again with these taking the sun at full power.
        result.update(state="cap", uncapped=uncapped)
        return result
    result.update(
        state="cap",
        caps=caps,
        cap_kw=round(cap, 1),
        expected_kwh=round(max(0.0, surplus - taken(rest, cap)), 1),
        hours=[
            {
                "start": s.start.isoformat(timespec="minutes"),
                "surplus": round(s.surplus, 2),
                "battery": round(min(s.surplus, cap * s.hours), 2),
            }
            for s in rest
        ],
    )
    return result


def _step(kw: float) -> float:
    """Up to the next step (a hair above a step stays on it)."""
    return math.ceil(round(kw / STEP_KW, 6)) * STEP_KW
