"""Several batteries on one grid meter: one after the other ("Nacheinander").

A Fronius inverter regulates its battery to 0 W at the grid meter, and so does
Omnibattery with a Marstek Venus. Two such controllers on one meter do not
know of each other: any split of the house's need between them looks right to
both, so energy drifts from one battery into the other (one charges while the
other discharges), with losses both ways.

Joe lets exactly one of them work at a time ("the active one"): it is free to
charge and to discharge, the others are blocked both ways, ahead of time
rather than after the fact. Which one is active follows two orders, one for
charging and one for discharging:

- surplus (the house gives to the batteries or to the grid): the first battery
  in the charge order that is not full;
- deficit (the house needs more than the sun gives): the first in the
  discharge order that is not empty.

The active one keeps working until it cannot serve the flow any more (full
while there is surplus, empty while there is need): then the next takes over
at once. A battery earlier in the order takes over only when the flow has
lasted a while (no back and forth with every cloud).

"Empty" is the level at which a battery really stops discharging (a BYD at
about 10.5 % while its reserve says 5 %). Joe learns it: while a battery is
free to discharge and the house needs power, he notes the level at which its
discharging drops to nothing. Until he knows it, the battery works until it
stops by itself. With a known cutoff the next one takes over 1.5 % above it,
and the first is usable again once it has charged 5 % above it.

When the sun will not fill the batteries one after the other before it goes
(cautious forecast), they charge side by side: the others become free to
charge (never forced; their own control takes what is left), discharging
stays blocked for them, and on a cloud they are blocked again at once.

Groups ("Wer regelt ihn?"): batteries regulated by one system take turns
as one. Omnibattery regulates all its batteries (a Venus, a Victron) with one
PD controller and shares the power among them itself; a Fronius inverter
regulates its own battery. Joe coordinates only between such groups: exactly
one group works, the others are blocked. A group is full when all of its
batteries are full and empty when all of them are empty; the orders count
per group (the place of its first battery). With all batteries in one group
there is nothing to coordinate by day.

The decisions here have no Home Assistant imports; the executor reads the
meters, applies the blocks and gives them back (control/executor.py).
"""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass
from datetime import datetime, timedelta
from statistics import median
from typing import Any

from ..plan.surplus import FULL_KWH, Slot

# Above the cutoff: the next battery takes over here (%) ...
HANDOVER = 1.5
# ... and the first is usable again once it has charged this far above it.
BACK = 5.0
# Full at (or above) this level; usable again for charging below FULL_BACK.
FULL = 99.0
FULL_BACK = 97.0
# Surplus or deficit beyond this counts (kW), once it has lasted FLOW_DWELL.
FLOW_KW = 0.15
FLOW_DWELL = timedelta(minutes=2)
# A battery earlier in the order takes over after the flow lasted this long.
PREFER_DWELL = timedelta(minutes=10)
# Without a known cutoff: what Joe counts on when nothing else says (%).
DEFAULT_CUTOFF = 10.0
# Watching for the real cutoff: discharging stopped (below IDLE_W) while the
# house needed at least DEMAND_W, for SPAN, after discharging within RECENT,
# at a level of at most MAX_SOC; the last KEEP observations count.
IDLE_W = 60.0
DISCHARGING_W = 200.0
DEMAND_W = 150.0
SPAN = timedelta(minutes=5)
RECENT = timedelta(minutes=30)
MAX_SOC = 30.0
KEEP = 5
# A battery that charges no more while the house gives to the grid is full,
# too (its own charge target, a BMS limit).
EXPORT_W = 300.0


@dataclass(slots=True)
class Member:
    """A battery as the coordination sees it."""

    id: str
    soc: float
    # The learned (or set) cutoff; None: not known yet.
    cutoff: float | None
    # What Joe counts on without a cutoff: the battery's own floor.
    floor: float
    capacity: float
    max_kw: float
    # Charged as far as it goes (its own target, if lower than full).
    full_at: float = FULL
    # Marks with hysteresis, kept by the executor between checks.
    empty: bool = False
    full: bool = False

    @property
    def room(self) -> float:
        return max(0.0, self.capacity * (self.full_at - self.soc) / 100)

    @property
    def stop(self) -> float:
        """The level where the next one takes over."""
        if self.cutoff is not None:
            return self.cutoff + HANDOVER
        return self.floor + 0.5


@dataclass(slots=True)
class Group:
    """Batteries regulated by one system, as the coordination sees them."""

    id: str
    members: list[Member]

    @property
    def ids(self) -> list[str]:
        return [m.id for m in self.members]

    @property
    def empty(self) -> bool:
        """Empty once every battery of it is empty."""
        return all(m.empty for m in self.members)

    @property
    def full(self) -> bool:
        """Full once every battery of it is full."""
        return all(m.full for m in self.members)

    @property
    def room(self) -> float:
        return sum(m.room for m in self.members)

    @property
    def max_kw(self) -> float:
        return sum(m.max_kw for m in self.members)


def ordered[T: (Member, Group)](members: Iterable[T], order: list[str]) -> list[T]:
    """The members in the chosen order; those not named follow as they come.

    A group takes the place of its first battery in the order.
    """
    found = list(members)
    rank = {key: index for index, key in enumerate(order)}

    def place(item: T) -> int:
        keys = item.ids if isinstance(item, Group) else [item.id]
        known = [rank[k] for k in keys if k in rank]
        return min(known) if known else len(rank) + found.index(item)

    return sorted(found, key=place)


def grouped(members: Iterable[Member], groups: dict[str, str]) -> list[Group]:
    """The members by their group (battery -> group key), in order of their
    first battery; a battery without a group is a group of its own."""
    result: dict[str, Group] = {}
    for member in members:
        key = groups.get(member.id) or member.id
        result.setdefault(key, Group(key, [])).members.append(member)
    return list(result.values())


def transfer_inside(
    charging: Iterable[str], discharging: Iterable[str], groups: dict[str, str]
) -> bool:
    """Whether batteries charge each other only inside one group (its own
    system's fault, no matter of Joe's): no charging one and discharging one
    of different groups."""
    sides = [
        (groups.get(a) or a, groups.get(b) or b) for a in charging for b in discharging
    ]
    return bool(sides) and all(a == b for a, b in sides)


def mark(
    member: Member, empty_at: float | None, full_at: float | None
) -> tuple[bool, bool]:
    """Empty and full with hysteresis; `empty_at` and `full_at` are the levels
    it was marked at (or None). Returns (empty, full)."""
    empty = member.empty
    if member.soc <= member.stop:
        empty = True
    elif empty:
        base = member.cutoff if member.cutoff is not None else (empty_at or 0.0)
        if member.soc >= max(base, member.floor) + BACK:
            empty = False
    full = member.full
    if member.soc >= member.full_at - 0.5:
        full = True
    elif full:
        top = min(member.full_at, full_at if full_at is not None else FULL)
        if member.soc <= min(FULL_BACK, top - 2):
            full = False
    return empty, full


def choose(
    charge_order: list[Member] | list[Group],
    discharge_order: list[Member] | list[Group],
    active: str | None,
    flow: str | None,
    steady: bool,
) -> tuple[str, str]:
    """The battery that may work now, and why: "start", "keep", "full",
    "empty" (the active one could not serve the flow) or "order" (one earlier
    in the order, after the flow lasted a while)."""
    current = next((m for m in charge_order if m.id == active), None)
    if flow == "surplus":
        wanted = next((m for m in charge_order if not m.full), None)
        serves = current is not None and not current.full
    elif flow == "deficit":
        wanted = next((m for m in discharge_order if not m.empty), None)
        serves = current is not None and not current.empty
    else:
        wanted, serves = None, current is not None
    if current is None:
        start = (
            wanted
            or next((m for m in discharge_order if not m.empty), None)
            or next((m for m in charge_order if not m.full), None)
            or discharge_order[0]
        )
        return start.id, "start"
    if wanted is None or wanted.id == current.id:
        return current.id, "keep"
    if not serves:
        return wanted.id, "full" if flow == "surplus" else "empty"
    if steady:
        return wanted.id, "order"
    return current.id, "keep"


def sequential_fills(
    found: list[Slot], members: list[Member] | list[Group], end: datetime | None
) -> bool:
    """Whether the cautious surplus until the end fills the batteries one
    after the other, each at most at its own power."""
    rooms = [[m.room, m.max_kw] for m in members if m.room > FULL_KWH]
    if not rooms:
        return True
    if end is None:
        return False
    for slot in found:
        if slot.start >= end or slot.hours <= 0:
            continue
        rate = slot.surplus / slot.hours
        left = slot.hours
        for room in rooms:
            if left <= 0 or rate <= 0:
                break
            if room[0] <= FULL_KWH:
                continue
            power = min(room[1], rate)
            used = min(left, room[0] / power)
            room[0] -= power * used
            left -= used
    return all(room[0] <= FULL_KWH for room in rooms)


def watch_cutoff(
    watch: dict[str, Any],
    soc: float,
    power_w: float,
    demand_w: float,
    free: bool,
    now: datetime,
) -> float | None:
    """One look at a battery: the level it stopped discharging at, once seen.

    `power_w` is positive while charging, `demand_w` what the house needs on
    top of the sun (from the grid or from the other batteries). `free`: Joe
    does not block its discharging now (else it stands still on purpose).
    """
    if not free:
        watch.pop("since", None)
        return None
    if power_w <= -DISCHARGING_W:
        watch["discharged"] = now.isoformat(timespec="seconds")
        watch.pop("since", None)
        return None
    discharged = watch.get("discharged")
    recent = (
        discharged is not None and now - datetime.fromisoformat(discharged) <= RECENT
    )
    if abs(power_w) <= IDLE_W and demand_w >= DEMAND_W and soc <= MAX_SOC and recent:
        since = watch.get("since")
        if since is None:
            watch.update(since=now.isoformat(timespec="seconds"), soc=round(soc, 1))
            return None
        if now - datetime.fromisoformat(since) >= SPAN:
            found = float(watch.get("soc", soc))
            watch.clear()
            return found
        return None
    watch.pop("since", None)
    return None


def learned(observations: list[float]) -> float | None:
    """The cutoff from the last observations (their median)."""
    found = observations[-KEEP:]
    return round(median(found), 1) if found else None


def watch_full(
    watch: dict[str, Any], power_w: float, export_w: float, now: datetime
) -> bool:
    """Whether a battery free to charge takes nothing while the house gives
    to the grid, for a while: it is as full as it goes."""
    if power_w <= IDLE_W and export_w >= EXPORT_W:
        since = watch.get("full_since")
        if since is None:
            watch["full_since"] = now.isoformat(timespec="seconds")
            return False
        return now - datetime.fromisoformat(since) >= SPAN
    watch.pop("full_since", None)
    return False
