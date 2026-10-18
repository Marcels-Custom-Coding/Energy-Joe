"""Tonight's grid charging shared out: which battery takes how much, when, how fast.

The plan (planner.py) says how much energy all batteries together take from
the grid in the cheap window. Here it is shared out, in quarter hours:

- By order: the battery (the group) that discharges first in the morning gets
  first, up to its highest level; the rest goes to the next one. So "one
  after the other" by day has few changes. Batteries one system regulates
  share their part by their room (they rise together).
- By price: the cheapest quarter hours first. Within one price as slowly as
  possible: spread evenly over all of them, ending before the last half hour
  of the window where that is enough. Below a fifth of its highest power a
  battery charges inefficiently: then shorter with that much. A battery whose
  power Joe cannot set charges at full power, as late as possible.
- By the grid connection: all batteries together with the house no more than
  the limit in any quarter hour.

Last, each battery gets a little more power (15 %) wherever that costs
nothing (no cheaper quarter of its own follows), so it reaches its target in
time even when it takes a bit less than planned; it stops at its target.

Pure functions, no Home Assistant imports. Energies kWh (from the grid),
powers kW.
"""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass, field
from datetime import datetime

EPS = 1e-6
# A little more power where it costs nothing (share of the planned power).
MARGIN = 0.15
# Less than this share of its highest power: shorter with more power.
MIN_SHARE = 0.2
# Within one price the plan prefers to end this long before the window.
TAIL_MIN = 30
# Within this share of its highest power a battery counts as at full power.
FULL_SHARE = 0.95


@dataclass(slots=True)
class Slot:
    """A quarter hour of the window (the first one may have begun)."""

    start: datetime
    end: datetime
    hours: float
    price: float
    # What all batteries together may take (kW; inf without a grid limit).
    cap: float
    # The index of its hour in the plan's hours.
    hour: int
    # In the last half hour of the window.
    tail: bool = False
    used: float = 0.0

    @property
    def spare(self) -> float:
        return max(0.0, self.cap - self.used)


@dataclass(slots=True)
class Taker:
    """A battery as the sharing sees it."""

    id: str
    group: str
    max_kw: float
    # What it may still take from the grid (kWh).
    room: float
    # Whether Joe can set its power (else it charges at full power).
    paced: bool = True
    # Per slot index: the power Joe sets (kW) and the energy planned (kWh).
    rates: dict[int, float] = field(default_factory=dict)
    energy: dict[int, float] = field(default_factory=dict)
    short: bool = False
    limited: bool = False

    @property
    def min_kw(self) -> float:
        return self.max_kw * MIN_SHARE

    @property
    def taken(self) -> float:
        return sum(self.energy.values())


def groups_in_order(
    items: Iterable[tuple[str, str]], order: list[str]
) -> list[list[str]]:
    """Ids (with their group) by group, the groups in the order: a group at
    the place of its first battery, batteries not named follow as they come."""
    found = list(items)
    rank = {key: index for index, key in enumerate(order)}
    groups: dict[str, list[str]] = {}
    for key, group in found:
        groups.setdefault(group, []).append(key)
    position = {key: index for index, (key, _) in enumerate(found)}

    def place(members: list[str]) -> tuple[int, int]:
        known = [rank[k] for k in members if k in rank]
        first = position[members[0]]
        return (min(known), first) if known else (len(rank) + first, first)

    return sorted(groups.values(), key=place)


def ordered(takers: Iterable[Taker], order: list[str]) -> list[Taker]:
    """The takers by group, the groups in the order (see groups_in_order)."""
    found = {t.id: t for t in takers}
    groups = groups_in_order(((t.id, t.group) for t in found.values()), order)
    return [found[key] for members in groups for key in members]


def share(slots: list[Slot], takers: list[Taker], total: float) -> float:
    """Share `total` (kWh from the grid) out; `takers` in their order.

    Returns what found no place (the window, the powers or the grid limit
    were too small).
    """
    left = total
    levels = sorted({round(slot.price, 6) for slot in slots})
    for price in levels:
        if left <= EPS:
            break
        level = [i for i, slot in enumerate(slots) if round(slot.price, 6) == price]
        amounts = _amounts(slots, level, takers, left)
        for taker in takers:
            amount = amounts.get(taker.id, 0.0)
            if amount <= EPS:
                continue
            placed = _place(slots, level, taker, amount)
            if placed < amount - EPS:
                taker.limited = True
            taker.room -= placed
            left -= placed
        # What the grid limit kept out of some quarters may fit into others.
        for taker in takers:
            if left <= EPS:
                break
            extra = _fill(slots, level, taker, min(left, taker.room))
            taker.room -= extra
            left -= extra
    for taker in takers:
        _boost(slots, taker)
    return max(0.0, left)


def _amounts(
    slots: list[Slot], level: list[int], takers: list[Taker], left: float
) -> dict[str, float]:
    """What each taker gets at one price: the groups by order, inside a group
    by room; each at most what it can take at its power in these quarters."""
    hours = sum(slots[i].hours for i in level)
    total_kw = sum(t.max_kw for t in takers if t.room > EPS)
    joint = sum(min(slots[i].spare, total_kw) * slots[i].hours for i in level)
    budget = min(left, joint)
    result: dict[str, float] = {}
    groups: dict[str, list[Taker]] = {}
    for taker in takers:
        groups.setdefault(taker.group, []).append(taker)
    for members in groups.values():
        if budget <= EPS:
            break
        caps = {t.id: min(t.room, t.max_kw * hours) for t in members if t.room > EPS}
        take = min(budget, sum(caps.values()))
        if take <= EPS:
            continue
        # By room, each at most its cap: what one cannot take goes to the others.
        open_ = dict(caps)
        rest = take
        while rest > EPS and open_:
            rooms = sum(t.room for t in members if t.id in open_)
            done = []
            for taker in members:
                if taker.id not in open_:
                    continue
                part = rest * taker.room / rooms if rooms > EPS else rest / len(open_)
                give = min(part, open_[taker.id] - result.get(taker.id, 0.0))
                result[taker.id] = result.get(taker.id, 0.0) + give
                if result[taker.id] >= open_[taker.id] - EPS:
                    done.append(taker.id)
            rest = take - sum(result.get(t.id, 0.0) for t in members)
            if not done:
                break
            for key in done:
                open_.pop(key)
        budget -= sum(result.get(t.id, 0.0) for t in members)
    return result


def _latest(slots: list[Slot], indices: list[int], hours: float) -> list[int]:
    """The latest of these quarters that together last at least `hours`."""
    chosen: list[int] = []
    total = 0.0
    for index in sorted(indices, key=lambda i: slots[i].start, reverse=True):
        if total >= hours - EPS:
            break
        chosen.append(index)
        total += slots[index].hours
    return sorted(chosen)


def _place(slots: list[Slot], level: list[int], taker: Taker, amount: float) -> float:
    """Put `amount` into the quarters of one price; returns what fit."""
    avail = [i for i in level if slots[i].spare > EPS and i not in taker.rates]
    if not avail:
        return 0.0
    early = [i for i in avail if not slots[i].tail]
    early_h = sum(slots[i].hours for i in early)
    base = early if early and amount <= taker.max_kw * early_h + EPS else avail
    base_h = sum(slots[i].hours for i in base)
    if not taker.paced:
        # Full power, as late as possible (the battery stops at its target).
        chosen = _latest(slots, base, amount / taker.max_kw)
        rate = taker.max_kw
    else:
        rate = amount / base_h
        chosen = base
        if rate < taker.min_kw - EPS:
            # Too little to be efficient: shorter, with a fifth of its power.
            chosen = _latest(slots, base, amount / taker.min_kw)
            rate = max(taker.min_kw, amount / sum(slots[i].hours for i in chosen))
            taker.short = True
        rate = min(rate, taker.max_kw)
    placed = 0.0
    for index in sorted(chosen, key=lambda i: slots[i].start):
        slot = slots[index]
        power = min(rate, slot.spare)
        if power <= EPS:
            continue
        energy = min(power * slot.hours, amount - placed)
        if energy <= EPS:
            break
        if not taker.paced and power < taker.max_kw - EPS:
            # It cannot charge with less: no room for it here.
            continue
        taker.rates[index] = power
        taker.energy[index] = energy
        slot.used += power
        placed += energy
    return placed


def _fill(slots: list[Slot], level: list[int], taker: Taker, amount: float) -> float:
    """More power in quarters of one price that still have room (latest first)."""
    if amount <= EPS or not taker.paced:
        return 0.0
    placed = 0.0
    for index in sorted(level, key=lambda i: slots[i].start, reverse=True):
        if placed >= amount - EPS:
            break
        slot = slots[index]
        current = taker.rates.get(index, 0.0)
        power = min(taker.max_kw - current, slot.spare, (amount - placed) / slot.hours)
        if current <= EPS and power < taker.min_kw - EPS:
            # A new quarter: not below the battery's least efficient power.
            if min(slot.spare, taker.max_kw) < taker.min_kw - EPS:
                continue
            power = taker.min_kw
        if power <= EPS:
            continue
        energy = min(power * slot.hours, amount - placed)
        taker.rates[index] = current + power
        taker.energy[index] = taker.energy.get(index, 0.0) + energy
        slot.used += power
        placed += energy
    return placed


def _boost(slots: list[Slot], taker: Taker) -> None:
    """A little more power where no cheaper quarter of its own follows."""
    if not taker.paced:
        return
    used = sorted(taker.rates, key=lambda i: slots[i].start)
    for position, index in enumerate(used):
        price = slots[index].price
        if any(slots[j].price < price - EPS for j in used[position + 1 :]):
            continue
        rate = taker.rates[index]
        extra = min(rate * MARGIN, taker.max_kw - rate, slots[index].spare)
        if extra > EPS:
            taker.rates[index] = rate + extra
            slots[index].used += extra


def how(slots: list[Slot], taker: Taker) -> str:
    """Why it charges as it does, for the panel: fixed_power (Joe cannot set
    it), grid_limit, full, cheapest (in the cheapest quarters of several
    prices), short (a fifth of its power, not slower) or spread (evenly)."""
    if not taker.rates:
        return "none"
    if not taker.paced:
        return "fixed_power"
    if taker.limited:
        return "grid_limit"
    if max(taker.rates.values()) >= taker.max_kw * FULL_SHARE:
        return "full"
    prices = {round(slots[i].price, 6) for i in taker.rates}
    if len(prices) > 1 or len({round(s.price, 6) for s in slots}) > 1:
        return "cheapest"
    return "short" if taker.short else "spread"


def spans(slots: list[Slot], taker: Taker) -> list[dict[str, float | datetime]]:
    """The taker's quarters joined where they follow on with the same power."""
    result: list[dict[str, float | datetime]] = []
    for index in sorted(taker.rates, key=lambda i: slots[i].start):
        slot = slots[index]
        power = round(taker.rates[index], 2)
        if result and result[-1]["end"] == slot.start and result[-1]["power"] == power:
            result[-1]["end"] = slot.end
        else:
            result.append({"start": slot.start, "end": slot.end, "power": power})
    return result


def cost(slots: list[Slot], takers: Iterable[Taker]) -> float:
    """What the planned energy costs at the quarters' prices."""
    return sum(
        energy * slots[index].price
        for taker in takers
        for index, energy in taker.energy.items()
    )


def hourly(slots: list[Slot], takers: Iterable[Taker], count: int) -> list[float]:
    """The planned energy per hour of the plan (kWh)."""
    result = [0.0] * count
    for taker in takers:
        for index, energy in taker.energy.items():
            result[slots[index].hour] += energy
    return result
