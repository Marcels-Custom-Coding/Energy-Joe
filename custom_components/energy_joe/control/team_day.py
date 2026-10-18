"""Several batteries by day with sense: charging along, helping, a base load.

One after the other (control/team.py) is the safe way for batteries that each
regulate themselves to 0 W at the grid meter. By day it can waste sun: a
Marstek Venus takes at most 2.5 kW; at noon the sun may give more than the
battery whose turn it is can take, and the rest goes to the grid while the
other battery waits with room. On a big load the active battery may be at
its limit while the house draws from the grid and the other one waits full.

So, in "Automatisch" (the default):

- Charging along: from the hour on in which the forecast surplus (sun minus
  what the house needs, hour by hour) is more than the active group can
  take while a later group still has room, the later groups may charge,
  too, and as soon as the meter shows it (the house gives to the grid while
  the active group is free to charge and not full, for a minute). Only
  charging: discharging stays blocked for all of them (the active one too),
  so no battery can charge from another. On a cloud they are blocked again
  at once; once the surplus is clearly below what the active group takes
  alone for a while, the next one waits again.
- Helping: when the house needs more for a while than the active group can
  give (grid import although it discharges near its limit), the next group
  may discharge too; charging stays blocked for both. Once the need is
  clearly below the active group's power for a while, it waits again.
- Learning: every evening Joe looks back on the day: what went to the grid
  while a group still had room, how full each one got, when it got tight.
  Over the days he learns how much earlier the next one should charge along
  (a lead in minutes, never forgotten in winter: a day without anything to
  learn leaves it as it is). He uses it once the owner said yes.

"Nur nacheinander" does none of this, strictly: not even the weak-day rule of
control/team.py (side by side when the sun would not fill them one after the
other); only "Automatisch" and "Grundlast teilen" keep it. "Grundlast teilen": the next group gives a base load (the lower part
of the house's need, its 10 % quantile, never the mean) at a power Joe sets,
the active group covers the rest. Only groups whose discharge power Joe can
set (a limit in W).

Powers are kW unless named _w, energies kWh. No Home Assistant imports.
"""

from __future__ import annotations

from datetime import datetime, timedelta
import math
from typing import Any

from ..plan.surplus import FULL_KWH, Slot
from .team import Group

STYLES = ("auto", "strict", "base")

# Charging along: export (W) that counts, for this long; the forecast surplus
# beyond the active group's power that counts (kW).
ALONG_W = 200.0
ALONG_DWELL = timedelta(seconds=60)
OVER_KW = 0.1
# Alone again once the surplus is below this share of the active group's
# power for this long (hysteresis).
ALONG_BACK = 0.8
ALONG_OFF = timedelta(minutes=10)
# Helping: grid import (W) while the active group discharges at this share of
# its power, for this long; it waits again once the need is below HELP_BACK of
# the active group's power for HELP_OFF.
HELP_W = 200.0
HELP_NEAR = 0.85
HELP_DWELL = timedelta(seconds=60)
HELP_BACK = 0.8
HELP_OFF = timedelta(minutes=2)
# A base load: the quantile of the house's need over the last BASE_SPAN, in
# steps, at least BASE_MIN_W; samples every few seconds, BASE_SAMPLES at least.
BASE_QUANTILE = 0.1
BASE_SPAN = timedelta(minutes=30)
BASE_STEP_W = 50.0
BASE_MIN_W = 100.0
BASE_SAMPLES = 12
# A power seen for two checks in a row counts as one the battery can do.
PEAK_MIN_W = 300.0
# The look back: export with room that counts for a day (kWh); a lead is
# learned in minutes up to LEAD_MAX, the first days count more, later each
# day at least ALPHA_MIN.
ROOM_KWH = 0.3
LEAD_MAX = 180.0
ALPHA_MIN = 0.1
# Joe asks once a day sent this much to the grid with room left and he
# learned at least this lead.
ASK_KWH = 1.0
ASK_LEAD_MIN = 10.0
# A group below this at the end of the day was not full.
NOT_FULL = 95.0
# What is kept of the days (for the panel; learning does not need them).
KEEP_REVIEWS = 14


def style_of(rules: dict[str, Any]) -> str:
    """The owner's choice under "Selbst einstellen" (None: automatic)."""
    style = rules.get("team_style")
    return style if style in STYLES else "auto"


def capability(known_w: float | None, peak_w: float | None, default_kw: float) -> float:
    """What a battery can take or give (kW): as set, else the most Joe saw it
    do for a while, else what its size says."""
    if known_w:
        return known_w / 1000
    if peak_w and peak_w >= PEAK_MIN_W:
        return peak_w / 1000
    return default_kw


def peak(seen: float | None, now_w: float, before_w: float | None) -> float | None:
    """The highest power kept for two checks in a row (no single spike)."""
    if before_w is None or (now_w > 0) != (before_w > 0):
        return seen
    held = min(abs(now_w), abs(before_w))
    if held < PEAK_MIN_W:
        return seen
    return max(seen or 0.0, round(held))


# --- charging along --------------------------------------------------------------


def overflow(
    found: list[Slot], order: list[Group], active: str, end: datetime | None
) -> tuple[datetime, datetime] | None:
    """The hours in which the forecast surplus is more than the active group
    can take while a later group still has room: the start of the first and
    the end of the last (charging along fills the later ones meanwhile).

    One after the other only the first group with room takes the sun (at
    most at its power); from the first such hour on every group with room
    takes its share, each at most at its power.
    """
    if end is None:
        return None
    first = [g for g in order if g.id == active]
    rooms = [
        [g.room, g.max_kw] for g in [*first, *(g for g in order if g.id != active)]
    ]
    start: datetime | None = None
    until: datetime | None = None
    for slot in found:
        if slot.start >= end or slot.hours <= 0:
            continue
        takers = [r for r in rooms if r[0] > FULL_KWH]
        if not takers:
            break
        rate = slot.surplus / slot.hours
        if rate - takers[0][1] > OVER_KW and len(takers) > 1:
            start = start or slot.start
            until = slot.start + timedelta(hours=1)
        left = rate
        for room in takers if start is not None else takers[:1]:
            if left <= 0:
                break
            power = min(room[1], left)
            taken = min(room[0], power * slot.hours)
            room[0] -= taken
            left -= power
    if start is None or until is None:
        return None
    return start, until


def along_step(
    store: dict[str, Any],
    can: bool,
    export_w: float,
    surplus_kw: float,
    active_kw: float,
    now: datetime,
) -> bool:
    """Whether the next group charges along because of what the meter shows.

    `can`: the active group is free to charge and not full, a later one has
    room, the house gives (the flow), and nothing holds the surplus back on
    purpose (the daytime cap for evcc, the grid-friendly morning). It starts
    once the house gave at least ALONG_W to the grid for ALONG_DWELL and ends
    once the surplus stayed below ALONG_BACK of the active group's power for
    ALONG_OFF (or `can` ends).
    """
    if not can:
        store.clear()
        return False
    stamp = now.isoformat(timespec="seconds")
    if not store.get("on"):
        if export_w < ALONG_W:
            store.pop("since", None)
            return False
        since = store.setdefault("since", stamp)
        if now - datetime.fromisoformat(since) < ALONG_DWELL:
            return False
        store.update(on=True, at=stamp)
        store.pop("low_since", None)
        return True
    if surplus_kw < active_kw * ALONG_BACK:
        low = store.setdefault("low_since", stamp)
        if now - datetime.fromisoformat(low) >= ALONG_OFF:
            store.clear()
            return False
    else:
        store.pop("low_since", None)
    return True


def lead_start(
    window: tuple[datetime, datetime] | None, lead_min: float
) -> datetime | None:
    """When charging along begins by the forecast, the learned lead before it."""
    if window is None:
        return None
    return window[0] - timedelta(minutes=max(0.0, lead_min))


# --- helping to discharge ------------------------------------------------------


def help_step(
    store: dict[str, Any],
    can: bool,
    import_w: float,
    discharge_w: float,
    need_kw: float,
    active_kw: float,
    now: datetime,
) -> bool:
    """Whether the next group helps discharging: the house draws from the grid
    (at least HELP_W) although the active group discharges near its power
    (HELP_NEAR), for HELP_DWELL. It waits again once the need stayed below
    HELP_BACK of the active group's power for HELP_OFF (or `can` ends)."""
    if not can:
        store.clear()
        return False
    stamp = now.isoformat(timespec="seconds")
    if not store.get("on"):
        near = discharge_w >= active_kw * 1000 * HELP_NEAR
        if import_w < HELP_W or not near:
            store.pop("since", None)
            return False
        since = store.setdefault("since", stamp)
        if now - datetime.fromisoformat(since) < HELP_DWELL:
            return False
        store.update(on=True, at=stamp)
        store.pop("low_since", None)
        return True
    if need_kw < active_kw * HELP_BACK:
        low = store.setdefault("low_since", stamp)
        if now - datetime.fromisoformat(low) >= HELP_OFF:
            store.clear()
            return False
    else:
        store.pop("low_since", None)
    return True


# --- a base load -----------------------------------------------------------------


def base_w(samples: list[float], cap_w: float) -> float:
    """The base load (W) the next group gives: the house's need in its lower
    part (the BASE_QUANTILE, never the mean: a kettle must not raise it), in
    steps of BASE_STEP_W, never above the group's power; 0 below BASE_MIN_W
    or with too few samples."""
    if len(samples) < BASE_SAMPLES:
        return 0.0
    ordered = sorted(max(0.0, s) for s in samples)
    index = max(0, math.ceil(BASE_QUANTILE * len(ordered)) - 1)
    value = math.floor(min(ordered[index], cap_w) / BASE_STEP_W) * BASE_STEP_W
    return value if value >= BASE_MIN_W else 0.0


def trim(samples: list[tuple[datetime, float]], now: datetime) -> None:
    """Only the last BASE_SPAN of samples."""
    while samples and now - samples[0][0] > BASE_SPAN:
        samples.pop(0)


# --- the look back and learning ----------------------------------------------------


def fresh_day(day: str) -> dict[str, Any]:
    return {
        "day": day,
        "export_kwh": 0.0,
        "room_kwh": 0.0,
        "tight_at": None,
        "room_until": None,
        "along_at": None,
        "planned_at": None,
        "at": None,
        "was_kw": 0.0,
        "was_room": False,
    }


def note(
    today: dict[str, Any],
    now: datetime,
    export_kw: float,
    room: bool,
    along: bool,
    planned: datetime | None,
) -> None:
    """One check of the day: what went to the grid since the last one, and how
    much of it while a group waited with room (and nothing held the surplus
    back on purpose), as it was at the last check."""
    stamp = now.isoformat(timespec="seconds")
    last = today.get("at")
    hours = 0.0
    if last:
        minutes = (now - datetime.fromisoformat(last)).total_seconds() / 60
        hours = min(5.0, max(0.0, minutes)) / 60
    was_kw = float(today.get("was_kw") or 0.0)
    today["export_kwh"] = round(today["export_kwh"] + was_kw * hours, 3)
    if today.get("was_room") and hours:
        today["room_kwh"] = round(today["room_kwh"] + was_kw * hours, 3)
        today["room_until"] = stamp
    tight = room and export_kw * 1000 >= ALONG_W
    if tight and not today["tight_at"]:
        today["tight_at"] = stamp
    today.update(at=stamp, was_kw=round(export_kw, 3), was_room=tight)
    if along and not today["along_at"]:
        today["along_at"] = stamp
    if planned is not None and not today["planned_at"]:
        today["planned_at"] = planned.isoformat(timespec="minutes")


def review(today: dict[str, Any], groups: list[dict[str, Any]]) -> dict[str, Any]:
    """The day in short: what went to the grid (with room), each group's level
    at the end, the group that stayed lowest, and the lead the day asks for.

    `groups`: per group its batteries and their levels now.
    """
    ends = []
    for group in groups:
        socs = [s for s in group["socs"].values() if s is not None]
        soc = round(sum(socs) / len(socs), 1) if socs else None
        ends.append({"batteries": group["batteries"], "soc": soc})
    short = min(
        (g for g in ends if g["soc"] is not None and g["soc"] < NOT_FULL),
        key=lambda g: g["soc"],
        default=None,
    )
    summary = {
        "day": today["day"],
        "export_kwh": round(today["export_kwh"], 1),
        "room_kwh": round(today["room_kwh"], 1),
        "tight_at": today.get("tight_at"),
        "along_at": today.get("along_at"),
        "planned_at": today.get("planned_at"),
        "groups": ends,
        "short": short,
    }
    summary["need_min"] = day_lead(today, short is not None)
    return summary


def day_lead(today: dict[str, Any], short: bool) -> float | None:
    """How many minutes earlier the next group should have charged along that
    day; None: the day tells nothing (no sun to spare, nothing waited).

    Sun went to the grid while a group waited with room: from the moment it
    got tight until charging along began (or the export with room ended).
    Charging along ran and nothing went to the grid with room: none needed.
    """
    room = today.get("room_kwh") or 0.0
    tight = today.get("tight_at")
    along = today.get("along_at")
    if room >= ROOM_KWH and tight:
        until = today.get("room_until") or tight
        if along and along > tight:
            until = min(until, along)
        minutes = (
            datetime.fromisoformat(until) - datetime.fromisoformat(tight)
        ).total_seconds() / 60
        if not short:
            # Full all the same: only what was given away counts, less.
            minutes /= 2
        return round(min(LEAD_MAX, max(10.0, minutes)), 1)
    if along or today.get("planned_at"):
        return 0.0
    return None


def learn(lead: dict[str, Any] | None, summary: dict[str, Any]) -> dict[str, Any]:
    """The learned lead after one more day: the first days count more, later
    each day ALPHA_MIN; a day that tells nothing leaves it as it is (Joe never
    starts again in winter)."""
    lead = dict(lead or {"minutes": 0.0, "days": 0})
    need = summary.get("need_min")
    if need is None:
        return lead
    days = int(lead.get("days") or 0)
    alpha = max(ALPHA_MIN, 1 / (days + 1))
    minutes = float(lead.get("minutes") or 0.0)
    lead.update(
        minutes=round(minutes + alpha * (need - minutes), 1),
        days=days + 1,
        updated=summary["day"],
    )
    return lead


def suggestion(
    summary: dict[str, Any] | None, lead: dict[str, Any] | None
) -> dict[str, Any] | None:
    """What Joe asks about ("Soll ich … künftig früher mitladen lassen?"), or None."""
    if not summary or not lead:
        return None
    short = summary.get("short")
    if (
        short is None
        or (summary.get("room_kwh") or 0.0) < ASK_KWH
        or float(lead.get("minutes") or 0.0) < ASK_LEAD_MIN
    ):
        return None
    return {
        "day": summary["day"],
        "kwh": summary["room_kwh"],
        "batteries": short["batteries"],
        "soc": short["soc"],
        "lead_min": round(float(lead["minutes"])),
    }
