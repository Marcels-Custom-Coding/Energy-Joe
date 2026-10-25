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
   BLOCK seconds, with the levers of "Nacheinander" for its whole group
   (Venus: the allow switches of every battery its Omnibattery regulates;
   Fronius: the charge or discharge limit at 0 with its switch on), then
   back as it was.
   The same battery running the same way again within REPEAT_WINDOW (and
   no "Nacheinander" to keep the two apart): the block is held ("hold")
   instead of a few seconds, until the other one needs it (the house draws
   from the grid, or gives to it, for NEED_SPAN while the other does nothing
   about it), the sun is down, Joe steers the night, "Nacheinander" comes
   back or HOLD_MAX has passed.
3. Still opposite after another WAIT: Joe speaks up ("Joe braucht dich" and,
   if wanted, a push), once per time it happens and at most once per
   COOLDOWN.

A stage the battery has no lever for is skipped.

Groups (control/team.py): batteries regulated by one system (Omnibattery
for a Venus and a Victron) share the power themselves. When batteries charge
each other only inside one group, its own system is at fault: Joe does not
step in, he notes it and speaks up (result "inside"). Nothing of this runs while
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
# The same battery the same way this often within REPEAT_WINDOW: held.
REPEATS = 2
REPEAT_WINDOW = timedelta(minutes=10)
# A held block ends once the house has needed the battery this long, at the
# latest after HOLD_MAX.
NEED_SPAN = timedelta(seconds=60)
NEED_W = 150.0
HOLD_MAX = timedelta(hours=12)
# Stage 3: a push at most this often.
COOLDOWN = timedelta(hours=1)
# How often Joe looks at the meters.
EVERY = timedelta(seconds=5)

# What happened last ("last" in the store): the stage reached and the result.
RESULTS = ("running", "fixed", "alarm", "automation", "joe", "inside", "hold")


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
        # The last block with levers that write to flash (stage 2 waits
        # Profile.flash_gap_s between two).
        "flash_at": None,
        # When each battery ran which way ("key:direction" -> ISO times).
        "episodes": {},
        # A block held after repeats: battery, direction, since, need_since.
        "hold": None,
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
    active: Iterable[str] | str | None = None,
) -> str:
    """The battery Joe steps in at: the usual cause.

    First one whose control Joe can restart (stage 1), then one whose
    direction he can block (stage 2); among those the one running the other
    way than the team's active battery (that one does what it should); then
    the order of the batteries. `levers`: battery -> (restart, block);
    `active`: the battery (or the batteries of the group) whose turn it is.
    """
    involved = [k for k in order if k in charging or k in discharging]
    mine = {active} if isinstance(active, str) else set(active or ())
    if mine & set(charging):
        against = set(discharging) - mine
    elif mine & set(discharging):
        against = set(charging) - mine
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


def repeated(store: dict[str, Any], key: str, direction: str, now: datetime) -> bool:
    """Note one time a battery ran one way; whether it did so REPEATS times
    within REPEAT_WINDOW (this one included)."""
    episodes: dict[str, list[str]] = store.setdefault("episodes", {})
    first = now - REPEAT_WINDOW
    for name in list(episodes):
        episodes[name] = [
            t for t in episodes[name] if datetime.fromisoformat(t) >= first
        ]
        if not episodes[name]:
            episodes.pop(name)
    times = episodes.setdefault(f"{key}:{direction}", [])
    times.append(now.isoformat(timespec="seconds"))
    return len(times) >= REPEATS


def hold_over(
    hold: dict[str, Any],
    now: datetime,
    *,
    grid_w: float | None,
    others_w: list[float],
    sun_down: bool,
    steering: bool,
    team_on: bool,
) -> str | None:
    """Why a held block ends now ("team", "night", "sun", "max", "needed"),
    or None. `grid_w`: from the grid (negative: to it); `others_w`: the other
    batteries' power (positive while charging)."""
    if team_on:
        return "team"
    if steering:
        return "night"
    if sun_down:
        return "sun"
    if now - datetime.fromisoformat(hold["since"]) >= HOLD_MAX:
        return "max"
    if hold["direction"] == "discharge":
        # The house draws from the grid and the others give nothing.
        needed = (
            grid_w is not None
            and grid_w >= NEED_W
            and all(w > -LIMIT_W for w in others_w)
        )
    else:
        # The house gives to the grid and the others take nothing.
        needed = (
            grid_w is not None
            and grid_w <= -NEED_W
            and all(w < LIMIT_W for w in others_w)
        )
    if not needed:
        hold["need_since"] = None
        return None
    if hold.get("need_since") is None:
        hold["need_since"] = now.isoformat(timespec="seconds")
        return None
    if now - datetime.fromisoformat(hold["need_since"]) >= NEED_SPAN:
        return "needed"
    return None
