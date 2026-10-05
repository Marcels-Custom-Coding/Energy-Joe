"""When people usually come home (the "Klima" page).

Joe notes every homecoming (a person turning "home") with the time of day and
whether it was a working day. From the last weeks he knows, per person and
kind of day, the usual time (the median) and how much it varies. Rooms can
then be warm at the usual time, before anyone sets off – and a person merely
passing by on another day does not count as heading home.
"""

from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import Any

# Homecomings kept per person, and how far back the usual time looks.
KEEP = 120
LOOK_BACK = timedelta(days=60)
# At least this many homecomings of a kind of day, varying at most this much.
MIN_SEEN = 4
MAX_SPREAD_MIN = 45
# How long after the usual time Joe still waits for someone.
LATE_MIN = 60


def record(
    log: dict[str, list[dict[str, Any]]], person: str, at: datetime, free: bool
) -> None:
    """Note a homecoming."""
    entries = log.setdefault(person, [])
    entries.append({"at": at.isoformat(timespec="minutes"), "free": free})
    del entries[:-KEEP]


def usual(
    entries: list[dict[str, Any]], free: bool, today: date
) -> dict[str, int] | None:
    """The usual time of day (minutes) a person comes home on such a day."""
    since = today - LOOK_BACK
    minutes = sorted(
        moment.hour * 60 + moment.minute
        for entry in entries
        if entry.get("free") == free
        and (moment := datetime.fromisoformat(entry["at"])).date() >= since
        and moment.date() < today
    )
    if len(minutes) < MIN_SEEN:
        return None
    middle = minutes[len(minutes) // 2]
    spread = sorted(abs(m - middle) for m in minutes)[len(minutes) // 2]
    if spread > MAX_SPREAD_MIN:
        return None
    return {"minute": middle, "spread": spread, "seen": len(minutes)}


def expected_soon(
    found: dict[str, int] | None,
    now_minute: int,
    lead_min: float,
    drive_min: float | None,
) -> bool:
    """Whether the usual homecoming is close enough to warm up for it now.

    From the lead time before the usual time until a while after it, unless
    the person is clearly too far away to make it (drive time known).
    """
    if found is None:
        return False
    until = found["minute"] - now_minute
    if not -LATE_MIN <= until <= lead_min:
        return False
    # Clearly too far away to make it: not today.
    return drive_min is None or drive_min <= max(until, 0) + MAX_SPREAD_MIN
