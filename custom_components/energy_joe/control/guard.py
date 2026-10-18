"""The watchdog ("Speicher-Wächter"): two batteries running against each other.

Two batteries that regulate themselves to 0 W at one grid meter can drift
into shifting energy between each other: one charges while the other
discharges, with losses both ways. Joe watches for it whenever at least two
batteries have a power meter, with or without "Nacheinander", and steps in
in stages, the way the owner's own automation did:

1. Opposite directions with more than LIMIT_W each, for SPAN: restart the
   self-regulating control of the battery that is the usual cause. For
   Omnibattery (Marstek Venus) that is its PD controller: the system's manual
   mode on, PULSE seconds, off again. If something holds manual mode for a
   forced charge or discharge right now, Joe ends that cleanly instead
   (force mode "None", setpoints 0, manual mode off) and gives the battery
   back to its own control.
2. Still opposite after WAIT: block that battery's current direction for
   BLOCK seconds (Venus: its allow switch off and on again; Fronius: the
   charge or discharge limit at 0 with its switch on, then back as it was).
3. Still opposite after another WAIT: Joe speaks up ("Joe braucht dich" and,
   if wanted, a push), once per time it happens and at most once per
   COOLDOWN.

A stage the battery has no lever for is skipped. Nothing of this runs while
Joe steers the night himself, while an automation writes the same levers
(the owner's own watchdog), with the rule switched off (rules.transfer_guard)
or outside the live mode (there Joe only says what he would do).

The decisions here have no Home Assistant imports; the executor reads the
meters, writes and gives back (control/executor.py).
"""

from __future__ import annotations

from collections.abc import Iterable
from datetime import datetime, timedelta
from typing import Any

# Each battery above this, in opposite directions (W): 20 W is the limit, a
# small transfer that lasts counts, too.
LIMIT_W = 20.0
# Opposite for this long before stage 1.
SPAN = timedelta(seconds=20)
# After a stage: still opposite after this long, the next one follows.
WAIT = timedelta(seconds=20)
# Stage 1: manual mode on for this long (s); stage 2: a direction blocked (s).
PULSE_S = 2.0
BLOCK_S = 5.0
# Between commands to a device that needs time (s), when its profile says none.
PACE_S = 1.0
# Stage 3: a push at most this often.
COOLDOWN = timedelta(hours=1)
# How often Joe looks at the meters.
EVERY = timedelta(seconds=5)

# What happened last ("last" in the store): the stage reached and the result.
RESULTS = ("running", "fixed", "alarm", "automation", "joe")


def fresh() -> dict[str, Any]:
    """The watchdog's part of the executor's store."""
    return {
        # Opposite since (ISO time), None while not.
        "since": None,
        # The stage of this time (0: none yet) and when it finished.
        "stage": 0,
        "stage_at": None,
        # The battery Joe steps in at this time.
        "battery": None,
        # What Joe switched and must put back: entity -> value before.
        "held": {},
        # The last push (ISO time).
        "told": None,
        # Logged once per time: an automation does it, Joe steers himself.
        "noted": None,
        # The automations that do it (logged once until they change).
        "handed": None,
        # The last time it happened, for the panel.
        "last": None,
    }


def opposite(powers: dict[str, float]) -> tuple[list[str], list[str]]:
    """Batteries that charge and ones that discharge, both above LIMIT_W
    (W, positive while charging); empty unless both directions are there."""
    charging = [k for k, p in powers.items() if p > LIMIT_W]
    discharging = [k for k, p in powers.items() if p < -LIMIT_W]
    return (charging, discharging) if charging and discharging else ([], [])


def cause(
    order: Iterable[str],
    charging: list[str],
    discharging: list[str],
    levers: dict[str, tuple[bool, bool]],
    active: str | None = None,
) -> str:
    """The battery Joe steps in at: the usual cause.

    First one whose control Joe can restart (stage 1), then one whose
    direction he can block (stage 2); among those the one running the other
    way than the team's active battery (that one does what it should); then
    the order of the batteries. `levers`: battery -> (restart, block).
    """
    involved = [k for k in order if k in charging or k in discharging]
    if active in charging:
        against = set(discharging)
    elif active in discharging:
        against = set(charging)
    else:
        against = set()

    def rank(key: str) -> tuple[int, int, int, int]:
        restart, block = levers.get(key, (False, False))
        return (
            0 if restart else 1,
            0 if block else 1,
            0 if key in against else 1,
            involved.index(key),
        )

    return min(involved, key=rank)


def step(store: dict[str, Any], running: bool, now: datetime) -> str | None:
    """One look: what is due now.

    "stage1", "stage2", "stage3": step in (the caller records it with
    `done`); "fixed": it stopped after Joe stepped in; "ended": it stopped
    before; None: nothing to do.
    """
    stamp = now.isoformat(timespec="seconds")
    if not running:
        if store["since"] is None:
            return None
        stage = store["stage"]
        store.update(since=None, stage=0, stage_at=None, noted=None)
        return "fixed" if stage else "ended"
    if store["since"] is None:
        store.update(since=stamp, stage=0, stage_at=None, battery=None, noted=None)
        return None
    stage = store["stage"]
    if stage == 0:
        if now - datetime.fromisoformat(store["since"]) >= SPAN:
            return "stage1"
        return None
    if stage < 3 and now - datetime.fromisoformat(store["stage_at"]) >= WAIT:
        return f"stage{stage + 1}"
    return None


def done(store: dict[str, Any], stage: int, now: datetime) -> None:
    """A stage is over: the next one counts from now."""
    store.update(stage=stage, stage_at=now.isoformat(timespec="seconds"))


def may_tell(store: dict[str, Any], now: datetime) -> bool:
    """Whether a push is due (once per time, at most once per COOLDOWN)."""
    told = store.get("told")
    return told is None or now - datetime.fromisoformat(told) >= COOLDOWN


def seconds_since(since: str | None, now: datetime) -> int:
    """How long it ran (s), for "Behoben nach …"."""
    if not since:
        return 0
    return max(0, round((now - datetime.fromisoformat(since)).total_seconds()))
