"""Joe at the controls: he steers the batteries through the cheap window and lets go.

Every minute (and whenever a battery's charge level changes) Joe compares what
each battery should do with what its entities show, and writes only the
difference. Before he changes an entity the first time in a night, he notes
its value; at the end of the window he puts all of them back. The same release
runs when Joe is switched to simulation or off, after a restart outside the
window and from the panel's emergency button, and keeps trying until every
value is back ("reset guarantee").

What someone else changes while Joe steers stays as it is: Joe notes it as an
external change and leaves that entity alone for the rest of the night.
"""

from __future__ import annotations

import asyncio
from collections.abc import Callable
from copy import deepcopy
from dataclasses import replace
from datetime import datetime, timedelta
import logging
import math
from typing import Any

from homeassistant.const import EVENT_HOMEASSISTANT_STOP, SUN_EVENT_SUNSET
from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_change,
    async_track_time_interval,
)
from homeassistant.helpers.storage import Store
from homeassistant.helpers.sun import get_astral_event_date
from homeassistant.util import dt as dt_util

from ..const import DOMAIN
from ..observe.readings import distance_km, measurement_kw, number, solar_kw
from ..plan import cars, surplus as day_surplus
from ..plan.actions import condition_met
from . import (
    automations as battery_automations,
    evcc,
    guard as guard_rules,
    operations,
    team as team_rules,
    team_day,
    writes as joe_writes,
)
from .actions import ActionAdapter
from .adapters import Adapter, Desired, RoleAdapter, make_adapter
from .groups import proposed_group
from .profiles import BLOCK_OPERATIONS, OPERATIONS, profile_for
from .writes import Write, WriteError, async_apply, async_line, fit, matches, read

_LOGGER = logging.getLogger(__name__)

STORE_KEY = f"{DOMAIN}.control"
STORE_VERSION = 1
CHECK_EVERY = timedelta(minutes=1)
# A value Joe wrote may take this long to show; after that it counts as not taken.
SETTLE = timedelta(seconds=90)
# How often Joe writes the same value again when the device does not take it;
# a value that ends up in flash (Profile.flash) less often.
RETRY = timedelta(minutes=5)
FLASH_RETRY = timedelta(minutes=30)
# Several batteries: a block that did not arrive keeps Joe out this long, the
# second time that day until the next one.
TEAM_BROKEN = timedelta(hours=1)
# Blocks found undone this often within TEAM_BROKEN: Joe cannot rely on them.
TEAM_RESETS = 3
# A value missing only for a moment (a Modbus dropout, a restart of the
# integration): Joe keeps the blocks in force this long, writing nothing new,
# before he gives them back (at least one check, CHECK_EVERY, is bridged). A
# lever that is gone for real goes back at once.
TEAM_GRACE = timedelta(seconds=90)
TEAM_GRACE_REASONS = ("unknown", "levers", "no_grid")
# Release attempts before Joe raises the alarm (he keeps trying anyway).
RELEASE_ALARM = 3
# Joe stops (unloaded, Home Assistant stops, removed): no later check tries
# again, so everything is put back this often, this many seconds apart.
STOP_TRIES = 3
STOP_PAUSE_S = 4
LOG_SIZE = 100
# What Joe writes into Home Assistant's logbook next to every lever he sets
# (German, English): the reason, in the owner's words.
NOTES = {
    "charge": ("Nachtplan: Laden", "Night plan: charging"),
    "hold": ("Nachtplan: Stand halten", "Night plan: holding the level"),
    "block": (
        "Warten: weder laden noch entladen",
        "Waiting: neither charge nor discharge",
    ),
    "free": ("Freigegeben", "Released"),
    "team": ("Nacheinander: {name} ist dran", "One after the other: {name}'s turn"),
    "team_back": ("Nacheinander: Sperre zurück", "One after the other: block put back"),
    "team_pause": (
        "Nacheinander: {name} lädt gerade nicht (bei {soc} %), ich warte. Bleibt Sonne übrig, lädt der nächste solange mit.",
        "One after the other: {name} is not charging right now (at {soc} %), I wait. If sun is left over, the next one charges along meanwhile.",
    ),
    "team_along": (
        "Nebenher: {name} lädt mit {watts} W fest",
        "Alongside: {name} charges with a fixed {watts} W",
    ),
    "cap": ("Tagsüber gedrosselt (Überschuss)", "Capped by day (surplus)"),
    "day": ("Netzfreundlicher Morgen", "Grid-friendly morning"),
    "guard": ("Speicher-Wächter: Stufe {stage}", "Battery watchdog: stage {stage}"),
    "guard_back": (
        "Speicher-Wächter: zurück wie vorher",
        "Battery watchdog: back as it was",
    ),
    "release": ("Zurückgestellt", "Put back"),
    "test": ("Testlauf: {step}", "Test run: {step}"),
    "probe": ("Probe: {step}", "Probe: {step}"),
    "boost": ("Laden von Hand", "Charging by hand"),
    "defer": (
        "Nachtplan: wartet, bis ein anderer fertig ist",
        "Night plan: waiting for another",
    ),
    "cap_back": ("Drossel zurück", "Cap put back"),
    "learn": ("Testgrenze: Bezugsgröße lernen", "Test limit: learning the reference"),
    "action_on": ("Nachtplan: an", "Night plan: on"),
    "action_off": ("Nachtplan: aus", "Night plan: off"),
    # A night Joe leaves alone, and why (see _tell_night_left).
    "night_none_small_saving": (
        "Nachtplan: heute Nacht nichts – die Ersparnis läge unter deiner Mindestersparnis",
        "Night plan: nothing tonight – the saving would stay below your minimum",
    ),
    "night_none_enough": (
        "Nachtplan: heute Nacht nichts – die Speicher reichen, bis die Sonne übernimmt",
        "Night plan: nothing tonight – the batteries last until the sun takes over",
    ),
    "night_none_not_worth": (
        "Nachtplan: heute Nacht nichts – Laden aus dem Netz lohnt sich nicht",
        "Night plan: nothing tonight – charging from the grid does not pay",
    ),
    "night_none_max_price": (
        "Nachtplan: heute Nacht nichts – der Strom liegt über deinem Höchstpreis",
        "Night plan: nothing tonight – the price is above your limit",
    ),
    "night_none_skipped": (
        "Nachtplan: heute Nacht ausgesetzt, wie du es wolltest",
        "Night plan: skipped tonight, as you wanted",
    ),
    "night_none_declined": (
        "Nachtplan: heute Nacht nichts – du hast abgelehnt",
        "Night plan: nothing tonight – you declined",
    ),
    "night_none_unanswered": (
        "Nachtplan: heute Nacht nichts – keine Antwort auf meine Frage",
        "Night plan: nothing tonight – no answer to my question",
    ),
    "factory_reset": (
        "Werksreset: alles zurückgestellt und gelöscht",
        "Factory reset: everything put back and deleted",
    ),
}
# The reasons a night is left alone: Joe's own (the plan's first of these)
# and the owner's (see _why).
LEFT_ALONE = ("nothing", "skipped", "declined", "unanswered")
NIGHT_WHYS = ("small_saving", "enough", "not_worth", "max_price")
# Modes in which Joe writes to the batteries (in the simulation he only watches).
STEERING = ("advisory", "live")
# A test run: how long each step lasts (seconds).
TEST_HOLD = 20
TEST_CHARGE = 25
TEST_RELEASE = 8
# A probe of one operation (see async_probe): a block or the cap stands this
# long before Joe reads it back; holding and charging as in the test run.
PROBE_BLOCK = 15
# A test is valid this long, as long as the way of steering stays the same.
TEST_VALID = timedelta(days=180)
# Safety: charging pauses this long when the house draws more than the grid
# limit, and a battery that has not gained a percent in this time is reported.
GRID_PAUSE = timedelta(minutes=5)
GRID_MARGIN = 1.02
NO_PROGRESS = timedelta(minutes=30)
# Charging to a level by hand ends after this at the latest.
BOOST_LIMIT = timedelta(hours=24)
# The night's power as a charge limit (Fronius): after this, Joe compares
# what the battery takes with the limit. Clearly above it (more than this
# share plus a few watts) for OVER_FOR: the limit does not hold while
# charging from the grid. Held for WORKS_FOR: it works.
NIGHT_CAP_SETTLE = timedelta(minutes=6)
NIGHT_CAP_OVER = 1.3
NIGHT_CAP_SLACK_W = 200
NIGHT_CAP_OVER_FOR = timedelta(minutes=5)
NIGHT_CAP_WORKS_FOR = timedelta(minutes=15)
# A battery charging from the grid with a planned power (not under a ceiling
# of Joe's, not while the grid limit pauses it, not within SLOW_NEAR percent
# of its target): once it had SLOW_START to get going, taking less than
# SLOW_SHARE of that power for SLOW_FOR means it charges much slower than
# planned – some inverters let a raised reserve pull only a little from the
# grid. Joe tells the owner (once a night) and plans it with what he measured
# (the most of its last SLOW_NIGHTS findings) until it takes SLOW_AGAIN times
# that again for SLOW_START.
SLOW_START = timedelta(minutes=3)
SLOW_SHARE = 0.4
SLOW_FOR = timedelta(minutes=15)
# A battery held back by a setting that is not Joe's (its reserve at the
# level, a block someone else set) while the house draws from or gives to
# the grid: told after this long (see _async_watch_stuck).
STUCK_FOR = timedelta(minutes=15)
SLOW_NEAR = 5
SLOW_NIGHTS = 3
SLOW_AGAIN = 1.5
# What a battery took while Joe charged it, summed up check by check; a gap
# longer than this between two checks (Joe was down) counts as this long.
ENERGY_GAP = timedelta(minutes=5)
# The highest import from the grid: noted again once it rose by this share.
GRID_PEAK_STEP = 1.02
# A grid-friendly morning lets go when the rest of the sun, taken with this
# caution, no longer fills the batteries.
DAY_CAUTION = 0.8
# Daytime surplus: a cap goes down at most this often and only by this much
# (it goes up at once); it never starts this late or runs into the night.
SURPLUS_LOWER_EVERY = timedelta(minutes=15)
SURPLUS_LOWER_KW = 0.2
SURPLUS_LATEST = 22
# A cap that rises is logged again only once it rose by this much (kW).
SURPLUS_LOG_KW = 0.3
# Learning what 100 % of a charge limit in % stand for (limit_ref_w): a test
# limit for a few minutes while the battery charges fast and unrestricted in
# plenty of sun, at most once a day. The battery's power must drop clearly
# below what it took before; the sun must stay.
LEARN_SPAN = timedelta(minutes=3)
LEARN_GIVE_UP = timedelta(minutes=10)
LEARN_PERCENT = 50
LEARN_MIN_PERCENT = 10
LEARN_MIN_W = 1000
LEARN_MAX_SOC = 85
LEARN_DROP = 0.85
LEARN_SUN_KEEP = 0.8
LEARN_REF_RANGE = (500, 30000)

DEFAULT_DATA: dict[str, Any] = {
    "saved": {},
    # Batteries Joe acted on this night (also by service calls, which leave no values).
    "active": [],
    # Per battery: the service calls of its current state (made once per state).
    "calls": {},
    "written": {},
    "external": [],
    "floors": {},
    "reached": [],
    "first": {},
    "steered": False,
    "night": None,
    # Night actions: switched on "tonight" by hand (action id -> night), finished.
    "tonight": {},
    # "Tonight up to …" for a car: action id -> night, target, chosen, unit, sensor.
    "tonight_target": {},
    # The owner's automations that write to a battery and are switched on, as
    # last told (entity ids): Joe says it once per change, never switches them.
    "automations_told": [],
    "done": [],
    "skip": None,
    "answer": None,
    "tests": {},
    # Per battery and operation: the last probe (see async_probe).
    "probes": {},
    "log": [],
    "failures": 0,
    # Charging paused for the grid limit until then (ISO time).
    "paused": None,
    # Per charging battery: since when and from which level it should rise.
    "progress": {},
    # The night's power as a charge limit (Fronius): battery -> the power
    # (W), since when, since when it took clearly more, what Joe saw.
    "night_caps": {},
    # The highest import from the grid measured so far: W, when, since when
    # Joe watches (a learned grid limit for the plan, a hint in the panel).
    "grid_peak": None,
    # Batteries that charge much slower than planned (see _async_watch_slow):
    # battery -> the planned and the measured power (W), when, and the last
    # findings by night (the plan goes by the most of them).
    "night_slow": {},
    # Watching for that tonight: battery -> since when it charges, since when
    # it takes too little (the sum and count of what it took then), since
    # when it takes clearly more than Joe learned.
    "slow_watch": {},
    # What each battery took tonight while Joe charged it (kWh), and the last
    # check it was counted at.
    "night_energy": {},
    # The last night looked back on: what was planned against what each
    # battery took (see _review_night).
    "night_review": None,
    # The last night Joe left alone and why (see _tell_night_left), and the
    # night it was told for.
    "last_night": None,
    "night_told": None,
    # Batteries held back by a setting that is not Joe's (a reserve at the
    # level, a block someone else set) while it matters: battery -> reason,
    # since, the entity and its value, the level (see _async_watch_stuck);
    # and the watch before it counts.
    "stuck": {},
    "stuck_watch": {},
    # "Just charge to …" by hand: action id -> target, unit, sensor, since, until.
    "boost": {},
    # The night whose grid-friendly morning runs, or was let go early.
    "day": None,
    "day_released": None,
    # The buffer of that morning: the night and per battery whether it
    # charges from the sun up to the buffer now (True) or holds back (False).
    "day_buffer": None,
    # Daytime surplus (see _async_surplus): the caps in force (battery -> kW),
    # when they last changed, and the day it was let go for good.
    "surplus": {
        "caps": {},
        "changed": None,
        "released": None,
        "logged": None,
        # A test limit to learn a battery's reference (see _async_learn_ref),
        # and per battery the day of the last try and its test percent.
        "learn": None,
        "learn_tried": {},
    },
    # Several batteries one after the other (see _async_team and control/team.py).
    "team": {
        # The battery that may work now, and since when.
        "active": None,
        "since": None,
        # The flow (surplus or deficit) Joe goes by, and the one just seen.
        "flow": None,
        "flow_since": None,
        "raw": None,
        "raw_since": None,
        # Batteries marked empty and full (id -> the level it was marked at).
        "empty": {},
        "full": {},
        # The day they charge side by side (the sun would not fill them one
        # after the other).
        "parallel": None,
        # The blocks in force: battery -> {"charge": bool, "discharge": bool}.
        "blocks": {},
        # Watching for the real cutoff (and fullness) per battery, and the
        # levels it stopped discharging at.
        "watch": {},
        "cutoffs": {},
        # The day "Sofort freigeben" paused it.
        "paused": None,
        # Groups whose block did not arrive (read back after SETTLE): group ->
        # problem, battery, day, until, count. Joe does not coordinate then.
        "broken": {},
        # A value missing for a moment: since when and why (see _team_grace).
        "gap": None,
        # Per battery: when a block that had arrived was found undone.
        "resets": {},
        # Batteries marked empty because they gave nothing while it was their
        # turn and the house drew from the grid, well above where they stop
        # by themselves (held back): when, and the level then (their turn
        # comes again after STUCK_RETRY).
        "stuck": {},
        # What the meter showed about the active group, and since when (see
        # team.quick): looked at every few seconds.
        "quick": {},
        # By day with sense (see control/team_day.py): charging along and
        # helping to discharge (their hysteresis), why the later groups
        # charge along now, the base load written, the most each battery
        # was seen to take and give (W), the day so far, the days looked
        # back on, the lead learned from them and the day last looked back on.
        "along": {},
        "along_why": None,
        "help": {},
        "base": None,
        "peaks": {},
        "today": None,
        "reviews": [],
        "lead": None,
        "reviewed": None,
    },
    # The watchdog: two batteries running against each other (see
    # _async_guard and control/guard.py).
    "guard": guard_rules.fresh(),
}

type Changed = Callable[[], None]


def _charging_time(plan: dict[str, Any], now: datetime) -> bool:
    """Whether the plan charges now: in one of its quarter-hour slots, or after
    the last one until the target is reached (older plans: from charge_from on)."""
    if plan.get("kind") != "charge":
        return False
    slots = plan.get("charge_slots")
    if slots:
        if any(
            datetime.fromisoformat(slot["start"])
            <= now
            < datetime.fromisoformat(slot["end"])
            for slot in slots
        ):
            return True
        return now >= datetime.fromisoformat(slots[-1]["end"])
    charge_from = plan.get("charge_from")
    return charge_from is not None and now >= datetime.fromisoformat(charge_from)


def _battery_charging(
    plan: dict[str, Any], planned: dict[str, Any], now: datetime
) -> tuple[bool, float | None]:
    """Whether this battery charges now, and with what power (kW; None: as
    fast as it can).

    In one of its own spans with that span's power; after its last one at
    full power until it reaches its target ("as fast as needed"). Older plans
    without spans: the plan's slots with the battery's power.
    """
    if plan.get("kind") != "charge":
        return False, None
    spans = planned.get("slots")
    if spans is None:
        return _charging_time(plan, now), planned.get("power_kw") or None
    for span in spans:
        if (
            datetime.fromisoformat(span["start"])
            <= now
            < datetime.fromisoformat(span["end"])
        ):
            return True, span.get("power_kw") or None
    if spans and now >= datetime.fromisoformat(spans[-1]["end"]):
        return True, None
    return False, None


class JoeExecutor:
    """Applies tonight's plan to the batteries in the modes "suggest" and "live"."""

    def __init__(
        self,
        hass: HomeAssistant,
        config: Callable[[], dict[str, Any]],
        plan: Callable[[], dict[str, Any] | None],
        mode: Callable[[], str],
        changed: Changed,
    ) -> None:
        """Set up; call async_load and async_start to begin."""
        self._hass = hass
        self._config = config
        self._plan = plan
        self._mode = mode
        self._changed = changed
        # The owner's language as the panel last showed it (the runtime
        # keeps it); None: Home Assistant's.
        self._language: Callable[[], str | None] | None = None
        self._store: Store[dict[str, Any]] = Store(hass, STORE_VERSION, STORE_KEY)
        self.data: dict[str, Any] = _fresh()
        self._lock = asyncio.Lock()
        self._unsubs: list[CALLBACK_TYPE] = []
        self._soc_unsub: CALLBACK_TYPE | None = None
        self._ask_unsub: CALLBACK_TYPE | None = None
        self._ask_time: str | None = None
        self._watched: tuple[str, ...] = ()
        self._last_release_try: datetime | None = None
        self.notifier: Any = None
        # Which car is plugged in where (control/cars.py; set by the runtime).
        self.cars: Any = None
        # Called with a battery id and the reference Joe learned (W).
        self.on_learned: Callable[[str, float], None] | None = None
        self.testing: dict[str, Any] | None = None
        # A probe of one operation going on (battery, op, started).
        self.probe_running: dict[str, Any] | None = None
        # Called with a battery id and the cutoff Joe learned (%).
        self.on_cutoff: Callable[[str, float], None] | None = None
        # Called with a battery id and whether its charge limit holds while it
        # charges from the grid ("works", "ignored").
        self.on_night_cap: Callable[[str, str], None] | None = None
        # What the daytime surplus does (or would do) now, for the panel.
        self.surplus: dict[str, Any] = {"state": "off"}
        # What several batteries do together now, for the panel.
        self.team: dict[str, Any] = {"state": "off", "batteries": {}}
        self._team_shown: dict[str, Any] = {}
        # The house's need every few seconds (W, for a base load), the
        # batteries' powers of the last check (for the most they do) and the
        # base load per battery to write now.
        self._team_samples: list[tuple[datetime, float]] = []
        # The surplus every few seconds (kW), for charging along with a fixed power.
        self._team_surplus: list[tuple[datetime, float]] = []
        # What the meter's timers last said about the active group (see
        # _team_quick): a change checks at once.
        self._team_quick_seen: tuple[str, ...] | None = None
        self._team_prev: dict[str, float] = {}
        self._team_base_w: dict[str, float] = {}
        # The fixed power (W) each battery charging along gets (see _team_along).
        self._team_along_w: dict[str, float] = {}
        # The last hint for the daytime cap while Joe coordinated (kept while
        # a value is missing for a moment), and whether a lever is gone for real.
        self._team_hint: dict[str, Any] | None = None
        self._team_lasting = False
        # What the last check saw for the day's look back (see _team_note).
        self._team_pending: dict[str, Any] | None = None
        # The buffer of the grid-friendly morning let a held battery charge
        # again in this check (the release's reason).
        self._day_buffer_freed = False
        # What the watchdog does now, for the panel.
        self.guard: dict[str, Any] = {"state": "off"}
        # The owner's automations that write to a battery and are switched on
        # (entity id and name), for the panel (see _async_watch_automations).
        self.automations: list[dict[str, Any]] = []
        self.status: dict[str, Any] = {
            "steering": False,
            "reason": "simulation",
            "night": None,
            "batteries": {},
            "actions": {},
            "pending": False,
        }

    # --- lifecycle -----------------------------------------------------------

    async def async_load(self) -> None:
        if stored := await self._store.async_load():
            self.data = {**_fresh(), **stored}
            # Older data: the daytime surplus' keys filled in.
            self.data["surplus"] = {
                **deepcopy(DEFAULT_DATA["surplus"]),
                **(stored.get("surplus") or {}),
            }
            self.data["team"] = {
                **deepcopy(DEFAULT_DATA["team"]),
                **(stored.get("team") or {}),
            }
            # Older data: the watchdog's notes of the team are gone, and so
            # is everything about switching the owner's automations.
            for key in ("transfer", "told", "free_since", "given_back", "hold"):
                self.data["team"].pop(key, None)
            for key in ("automations_off", "automations_lent"):
                self.data.pop(key, None)
            self.data["guard"] = {
                **guard_rules.fresh(),
                **(stored.get("guard") or {}),
            }

    @property
    def active(self) -> bool:
        return bool(self._unsubs)

    async def async_start(self) -> None:
        """Start checking (also releases what a crash left behind)."""
        await self.async_stop(release=False)
        # What the watchdog switched before a restart goes back first.
        async with self._lock:
            await self._async_guard_restore("start")
        self._unsubs.append(
            async_track_time_interval(self._hass, self._on_tick, CHECK_EVERY)
        )
        self._unsubs.append(
            async_track_time_interval(
                self._hass, self._on_guard_tick, guard_rules.EVERY
            )
        )
        self._unsubs.append(
            self._hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STOP, self._on_stop)
        )
        self.schedule_ask()
        await self.async_check()
        # Joe runs again: what he could not put back when he stopped is his
        # again (the release keeps trying and speaks up itself).
        if self.notifier:
            await self.notifier.async_clear("not_restored")

    async def async_stop(self, release: bool = True) -> None:
        for unsub in self._unsubs:
            unsub()
        self._unsubs = []
        if self._ask_unsub:
            self._ask_unsub()
            self._ask_unsub = None
            self._ask_time = None
        if self._soc_unsub:
            self._soc_unsub()
            self._soc_unsub = None
            self._watched = ()
        if release:
            await self.async_give_back("stopped")

    async def async_give_back(
        self, reason: str, removed: bool = False
    ) -> dict[str, Any]:
        """Joe stops (unloaded, removed): every value he noted goes back, with a
        few tries (no later check would try again). What stays is logged and
        told to the owner; returns it (entity -> the value to put back)."""
        if not (self._dirty or self.data["guard"]["held"]):
            return {}
        async with self._lock:
            left = await self._async_give_all_back(reason)
        if left:
            _LOGGER.warning(
                "Could not put these values back (%s): %s",
                reason,
                ", ".join(f"{k} = {v}" for k, v in left.items()),
            )
            if self.notifier:
                await self.notifier.async_not_restored(left, removed)
        return left

    async def _async_give_all_back(self, reason: str) -> dict[str, Any]:
        """The watchdog's switches and every noted value back, STOP_TRIES times
        at most (the caller holds the lock); returns what stayed."""
        for attempt in range(STOP_TRIES):
            if attempt:
                await joe_writes.settle(STOP_PAUSE_S)
            failed = await self._async_guard_restore(reason)
            if self._dirty:
                await self._async_release(reason, force=True, alarm=False)
            if not failed and not self._dirty:
                return {}
        return {**self.data["saved"], **self.data["guard"]["held"]}

    @callback
    def _on_tick(self, now: datetime) -> None:
        self._hass.async_create_task(self.async_check(), eager_start=False)

    @callback
    def schedule_ask(self) -> None:
        """Ask at the configured time (the "suggest" mode); follows changes of the time."""
        ask_time = self._config()["rules"]["ask_time"]
        if ask_time == self._ask_time and self._ask_unsub:
            return
        if self._ask_unsub:
            self._ask_unsub()
        hour, minute = (int(part) for part in ask_time.split(":"))
        self._ask_time = ask_time
        self._ask_unsub = async_track_time_change(
            self._hass, self._on_ask, hour=hour, minute=minute, second=0
        )

    @callback
    def _on_ask(self, now: datetime) -> None:
        self._hass.async_create_task(self.async_ask(), eager_start=False)

    async def async_ask(self) -> bool:
        """Ask whether Joe may steer tonight; False if there is nothing to ask."""
        plan = self._plan()
        if (
            self._mode() != "advisory"
            or not plan
            or plan.get("kind") not in ("charge", "hold")
            or not plan.get("window")
            or self.notifier is None
        ):
            return False
        night = plan["window"]["start"]
        if (self.data["answer"] or {}).get("night") == night:
            return False
        self._log("ask", night=night, target=plan.get("target"))
        await self.notifier.async_ask(plan)
        await self._async_save()
        return True

    async def _on_stop(self, event: Event) -> None:
        """Home Assistant stops: give everything back, so nothing stays set if it stays down."""
        if not (self._dirty or self.data["guard"]["held"]):
            return
        try:
            async with asyncio.timeout(30), self._lock:
                left = await self._async_give_all_back("ha_stop")
        except TimeoutError:
            _LOGGER.warning(
                "Release at shutdown did not finish; it runs after the start"
            )
            return
        if left:
            _LOGGER.warning(
                "Could not put these values back at shutdown (again after the "
                "start): %s",
                ", ".join(f"{k} = {v}" for k, v in left.items()),
            )

    # --- the check -------------------------------------------------------------

    async def async_check(self) -> None:
        """Bring the batteries in line with the plan, or release them."""
        if self._lock.locked() and (self.testing or self.probe_running):
            return
        async with self._lock:
            if self.testing or self.probe_running:
                return
            try:
                await self._async_check(dt_util.now())
            except Exception:
                _LOGGER.exception("Steering check failed")

    async def _async_check(self, now: datetime) -> None:
        config, plan, mode = self._config(), self._plan(), self._mode()
        try:
            await self._async_watch_automations(config)
        except Exception:
            _LOGGER.exception("Looking for automations failed")
        reason, night = self._why(now, config, plan, mode)
        peaked = self._track_grid_peak(config, now)
        boosts, keep, ended = await self._async_boosts(config, mode, now)
        if reason != "steering":
            # The night's power limits go back with the release.
            self.data["night_caps"] = {}
            before = self._written_state()
            day, held = await self._async_day(config, plan, mode, now)
            keep |= held
            was_capped = bool(self.data["surplus"]["caps"])
            try:
                want, hint = await self._async_team(config, plan, mode, now)
            except Exception:
                # Never keep a block Joe cannot work out: give them back.
                _LOGGER.exception("Coordinating the batteries failed")
                want, hint = {}, None
                await self._async_team_off(config, now, "error")
                self.team = {**self.team, "state": "error"}
            try:
                capped = await self._async_surplus(
                    config, plan, mode, now, bool(day), hint
                )
            except Exception:
                # Never keep a cap Joe cannot work out: give it back.
                _LOGGER.exception("Daytime surplus failed")
                capped = set()
                self._surplus_forget("error")
            keep |= capped
            self._team_note(now)
            await self._async_watch_stuck(config, now)
            try:
                keep |= await self._async_team_apply(config, want, keep, now)
            except Exception:
                _LOGGER.exception("Blocking the batteries failed")
                await self._async_team_off(config, now, "error")
                self.team = {**self.team, "state": "error"}
            if self._dirty_except(keep):
                # The grid-friendly morning is over: its own reason, no second
                # morning message.
                was_day = self.data.get("day") is not None and not day
                await self._async_release(
                    "day_done"
                    if was_day
                    else "day_buffer"
                    if day and self._day_buffer_freed
                    else "surplus_done"
                    if was_capped and not capped
                    else reason,
                    now,
                    keep,
                )
            if not day:
                self.data["day"] = None
                self.data["day_buffer"] = None
            # The window is over: what each battery took against the plan.
            reviewed = (
                reason == "done"
                and plan is not None
                and night is not None
                and self.data["night"] == night
                and self._review_night(plan, now)
            )
            # No plan for a moment (a restart, the planner restarting) does not
            # end the night: only a plan for another night does.
            if self.data["night"] and night is not None and self.data["night"] != night:
                self._end_night()
            self._set_status("day" if day else reason, night, day, boosts, keep)
            told = (
                reason in LEFT_ALONE
                and plan is not None
                and night is not None
                and self._tell_night_left(plan, reason, night, now)
            )
            self._watch([])
            # Originals and caps survive a crash: saved whenever they change.
            if (
                boosts
                or ended
                or told
                or day
                or peaked
                or reviewed
                or self._written_state() != before
            ):
                await self._async_save()
            return
        assert plan is not None and night is not None
        # The night begins: no daytime cap may stay (its originals go back),
        # and the night's plan steers the batteries, not their order by day.
        await self._async_surplus_off(config, now, "night")
        try:
            await self._async_team(config, plan, mode, now, night=True)
        except Exception:
            _LOGGER.exception("Watching the batteries failed")
        await self._async_team_off(config, now, "night")
        if self.data["night"] != night:
            self._start_night(night)
        items = self._steerable(config, plan)
        socs = {
            battery["id"]: number(self._hass.states.get(battery["soc_entity"]))
            for battery, _, _ in items
        }
        desired = self._desired(plan, items, socs, now)
        desired = self._guard_grid(config, desired, socs, now)
        desired, stuck = self._guard_block(items, desired, socs)
        await self._async_watch_progress(items, desired, socs, now)
        batteries: dict[str, Any] = {}
        for battery, planned, adapter in items:
            soc = socs[battery["id"]]
            want = desired.get(battery["id"])
            if soc is not None and adapter is not None:
                self.data["first"].setdefault(battery["id"], round(soc, 1))
            entry = {
                "action": _action(want),
                "floor": want.floor if want else None,
                "target": planned["target"],
                "soc": soc,
                "problem": None,
                "power_w": want.power_w if want else None,
            }
            # The ceiling of the power before charging starts; back before the
            # battery waits again (its block takes the charge limit next).
            capped = want is not None and want.charge_to is not None
            cap = None
            if adapter is not None and soc is not None:
                cap = await self._async_night_cap(battery, adapter, want, now)
                if want is not None and capped:
                    held = (self.data["night_caps"].get(battery["id"]) or {}).get("w")
                    want = replace(want, capped=bool(held))
            if adapter is None:
                entry["action"] = "watch"
                entry["problem"] = self._watch_reason(battery)
            elif soc is None:
                entry["problem"] = "soc_unknown"
            elif want is not None:
                problem = await self._async_steer(adapter, want, soc, now)
                entry["problem"] = problem
                if battery["id"] in stuck and problem in (None, "cannot_hold"):
                    # Why no other battery charges from the grid now.
                    entry["problem"] = "cannot_block"
            if cap:
                entry["cap"] = cap
            batteries[battery["id"]] = entry
        await self._async_watch_slow(items, desired, socs, batteries, now)
        await self._async_watch_stuck(config, now)
        actions = await self._async_actions(config, plan, night, now, set(boosts))
        self._set_status("steering", night, batteries, {**actions, **boosts})
        self._watch([b["soc_entity"] for b, _, a in items if a is not None])
        await self._async_save()

    async def _async_actions(
        self,
        config: dict[str, Any],
        plan: dict[str, Any],
        night: str,
        now: datetime,
        boosted: set[str] | None = None,
    ) -> dict[str, Any]:
        """Switch night actions on in their time and back when done."""
        by_id = {a["id"]: a for a in config["actions"]}
        result: dict[str, Any] = {}
        for entry in plan.get("actions") or []:
            action = by_id.get(entry["id"])
            if action is None or not action.get("enabled", True):
                continue
            if action["id"] in (boosted or set()):
                # Charging to a level by hand: that wins over the plan.
                continue
            adapter = ActionAdapter(action)
            manual = self.data["tonight"].get(action["id"]) == night
            run = entry["run"] or manual
            start = datetime.fromisoformat(entry["start"])
            end = datetime.fromisoformat(entry["end"])
            target = entry.get("target")
            if manual and not entry.get("manual") and entry.get("kind") == "switch":
                # "Tonight" by hand after the plan was fixed: like in plan_actions,
                # the whole window and no target (not the charge shortened by need).
                start = datetime.fromisoformat(plan["window"]["start"])
                target = None
            chosen = self.data["tonight_target"].get(action["id"])
            if manual and chosen and chosen.get("night") == night:
                # "Tonight up to …" by hand: the whole window, up to that level.
                start = datetime.fromisoformat(plan["window"]["start"])
                target = chosen["target"]
                entry = {
                    **entry,
                    "sensor": chosen["sensor"],
                    "need": {"target_unit": chosen["unit"], "sensor": chosen["sensor"]},
                }
            reason: str | None = None
            on = False
            if action["id"] in self.data["done"]:
                reason = "reached"
            elif not run:
                reason = "not_tonight"
            elif now < start:
                reason = "later"
            elif now >= end:
                reason = "over"
            elif (
                not manual
                and adapter.entity_id not in self.data["saved"]
                and not all(
                    condition_met(
                        self._hass.states.get(c["entity_id"]), c["op"], c["value"]
                    )
                    for c in action.get("conditions") or []
                )
            ):
                reason = "conditions"
            elif target is not None and self._target_reached(
                action, {**entry, "target": target}
            ):
                reason = "reached"
                self.data["done"].append(action["id"])
                self._log(
                    "action_done",
                    battery=adapter.battery["id"],
                    target=target,
                )
            else:
                on = True
            writes = adapter.on() if on else adapter.release(self.data["saved"])
            problem = None
            if writes:
                problem = await self._async_write(
                    adapter, writes, now, "action_on" if on else "action_off"
                )
                if not on and all(
                    matches(self._hass, fit(self._hass, w)) for w in writes
                ):
                    # Back as it should be: nothing left to restore for this action.
                    self.data["saved"].pop(adapter.entity_id, None)
                    self.data["written"].pop(adapter.entity_id, None)
            result[action["id"]] = {
                "on": on,
                "reason": reason,
                "start": start.isoformat(timespec="minutes"),
                "end": entry["end"],
                "target": target,
                "problem": problem,
            }
        return result

    def _target_reached(self, action: dict[str, Any], entry: dict[str, Any]) -> bool:
        """Hot water at its temperature, or a car at the level (or range) it needs."""
        sensor = entry.get("sensor") or action.get("sensor_entity") or ""
        state = self._hass.states.get(sensor)
        need = entry.get("need") or {}
        # A range target is in km; the car may report miles.
        if need.get("target_unit") == "km" and sensor == need.get("sensor"):
            value = distance_km(state)
        else:
            value = number(state)
        target = entry.get("target")
        return value is not None and target is not None and value >= target

    def _why(
        self,
        now: datetime,
        config: dict[str, Any],
        plan: dict[str, Any] | None,
        mode: str,
    ) -> tuple[str, str | None]:
        """Whether Joe steers now, and the night it is about."""
        if mode in ("simulation", "off"):
            return mode, None
        if not plan or not plan.get("window") or plan.get("kind") == "unavailable":
            return "no_plan", None
        night = plan["window"]["start"]
        start = datetime.fromisoformat(plan["window"]["start"])
        end = datetime.fromisoformat(plan["window"]["end"])
        lead = timedelta(minutes=config["rules"]["reset_lead_min"])
        if not plan.get("fixed"):
            return ("waiting" if now < start else "no_plan"), night
        if not start <= now < end - lead:
            return ("waiting" if now < start else "done"), night
        if plan.get("kind") == "none" and not any(
            a.get("run") or self.data["tonight"].get(a["id"]) == night
            for a in plan.get("actions") or []
        ):
            return "nothing", night
        if self.data["skip"] == night:
            return "skipped", night
        if mode == "advisory":
            answer = self.data["answer"] or {}
            if answer.get("night") != night or answer.get("yes") is not True:
                return (
                    "declined" if answer.get("night") == night else "unanswered"
                ), night
        return "steering", night

    def _steerable(
        self, config: dict[str, Any], plan: dict[str, Any]
    ) -> list[tuple[dict[str, Any], dict[str, Any], Adapter | None]]:
        """The batteries of the plan with their adapter (None: Joe only watches)."""
        planned = {b["id"]: b for b in plan.get("batteries") or []}
        result = []
        for battery in config["batteries"]:
            if battery["id"] not in planned:
                continue
            adapter = make_adapter(battery)
            if adapter is not None and not self.tested(battery):
                adapter = None
            if adapter is not None and adapter.missing(self._hass):
                adapter = None
            result.append((battery, planned[battery["id"]], adapter))
        return result

    def _watch_reason(self, battery: dict[str, Any]) -> str:
        adapter = make_adapter(battery)
        if adapter is None:
            return "not_controllable"
        if adapter.missing(self._hass):
            return "controls_missing"
        return "not_tested"

    def tested(self, battery: dict[str, Any]) -> bool:
        """A test run passed for the way this battery is steered now."""
        adapter = make_adapter(battery)
        test = self.data["tests"].get(battery["id"])
        if adapter is None or not test or not test.get("ok"):
            return False
        if test.get("signature") != adapter.signature:
            return False
        at = datetime.fromisoformat(test["at"])
        return dt_util.now() - at < TEST_VALID

    def _desired(
        self,
        plan: dict[str, Any],
        items: list[tuple[dict[str, Any], dict[str, Any], Adapter | None]],
        socs: dict[str, float | None],
        now: datetime,
    ) -> dict[str, Desired]:
        """What each battery should do: charge, hold at a floor, or nothing."""
        if plan.get("kind") == "none":
            return {}
        mode = (plan.get("rules") or {}).get("discharge_mode", "until_target")
        window = plan.get("window") or {}
        span = (
            (
                datetime.fromisoformat(window["end"])
                - datetime.fromisoformat(window["start"])
            ).total_seconds()
            if window
            else None
        )
        floors: dict[str, int] = self.data["floors"]
        reached: list[str] = self.data["reached"]
        result: dict[str, Desired] = {}
        for battery, planned, adapter in items:
            soc = socs.get(battery["id"])
            if adapter is None or soc is None:
                continue
            key = battery["id"]
            target = int(planned["target"])
            # Each battery in its own spans, with the power planned for it.
            charging_time, power_kw = _battery_charging(plan, planned, now)
            if charging_time and key not in reached and soc >= target - 0.5:
                reached.append(key)
                self._log("reached", battery=key, target=target, soc=round(soc, 1))
                self._fire("target_reached", battery=key, target=target)
            if charging_time and key not in reached and adapter.can_charge:
                power = (power_kw or 0) * 1000 or None
                result[key] = Desired(charge_to=target, power_w=power, span_s=span)
                # Between charging slots Joe holds what the battery has by then.
                floors.pop(key, None)
                continue
            if key in reached:
                floors[key] = target
            if mode == "free" and key not in reached:
                result[key] = Desired(span_s=span)
                continue
            if key not in floors:
                floors[key] = target if soc > target else max(0, math.floor(soc))
            # At its floor the battery waits as by day (charging and
            # discharging blocked, "Warten"); above it, it may discharge down
            # to the floor first ("Bis zum Ziel"), held by its own floor. The
            # owner's own steps for holding go first where they gave them.
            still = floors[key] >= math.floor(soc) and not (
                isinstance(adapter, RoleAdapter) and adapter.own_hold_first()
            )
            result[key] = Desired(floor=floors[key], block=still, span_s=span)
        # No battery may charge another one through the house.
        if any(d.charge_to is not None for d in result.values()):
            for key, want in list(result.items()):
                if want.charge_to is None:
                    result[key] = replace(want, block=True)
        # The system's limits block a battery only while every battery
        # behind them is idle, too (never the one charging next to it, never
        # one Joe only watches).
        adapters = {b["id"]: a for b, _, a in items}
        systems: dict[str, list[str]] = {}
        for battery in self._config()["batteries"]:
            system = (battery.get("controls") or {}).get("system_charge_limit")
            if system:
                systems.setdefault(system, []).append(battery["id"])
        for key, want in list(result.items()):
            adapter = adapters.get(key)
            system = adapter.system_key() if isinstance(adapter, RoleAdapter) else None
            if want.block and system:
                whole = all(
                    other in result and result[other].charge_to is None
                    for other in systems.get(system, [])
                )
                result[key] = replace(want, whole_system=whole)
        return result

    def _guard_block(
        self,
        items: list[tuple[dict[str, Any], dict[str, Any], Adapter | None]],
        desired: dict[str, Desired],
        socs: dict[str, float | None],
    ) -> tuple[dict[str, Desired], set[str]]:
        """A battery that cannot be blocked (its level below the lowest floor
        it takes, its levers away) is held at its floor instead, as far as
        that goes. While another charges from the grid that is not enough:
        it would discharge into the others, as without a lever, so no
        battery charges then (those that should hold instead). Returns the
        batteries that keep the others from charging."""
        adapters = {battery["id"]: adapter for battery, _, adapter in items}
        stuck: set[str] = set()
        for key, want in desired.items():
            adapter, soc = adapters.get(key), socs.get(key)
            if (
                want.block
                and adapter is not None
                and soc is not None
                and adapter.steer_problem(
                    self._hass, self._floored(adapter, want), soc, self.data["saved"]
                )
                == "cannot_block"
            ):
                stuck.add(key)
        if not stuck:
            return desired, stuck
        charging = any(d.charge_to is not None for d in desired.values())
        result: dict[str, Desired] = {}
        for key, want in desired.items():
            soc = socs.get(key)
            if want.charge_to is not None and charging:
                result[key] = Desired(
                    floor=max(0, math.floor(soc)) if soc is not None else None,
                    span_s=want.span_s,
                )
            elif key in stuck or (want.block and charging):
                result[key] = replace(want, block=False)
            else:
                result[key] = want
        return result, stuck if charging else set()

    async def _async_steer(
        self, adapter: Adapter, want: Desired, soc: float, now: datetime
    ) -> str | None:
        """Write what differs; note originals first. Returns a problem, if any
        (also when no lever does what is wanted: "cannot_hold", "cannot_block")."""
        floored = self._floored(adapter, want)
        writes = adapter.writes(self._hass, floored, soc, self.data["saved"])
        unheld = adapter.steer_problem(self._hass, floored, soc, self.data["saved"])
        problem = await self._async_write(adapter, writes, now, _action(want))
        problem = problem or unheld
        if (
            want.charge_to is not None
            and self.status["batteries"].get(adapter.battery["id"], {}).get("action")
            != "charge"
        ):
            self._fire(
                "charge_started", battery=adapter.battery["id"], target=want.charge_to
            )
        return problem

    async def _async_write(
        self,
        adapter: Adapter,
        writes: list[Write],
        now: datetime,
        label: str | None,
        note: str | None = None,
    ) -> str | None:
        """Apply writes that differ (calls once per state); note originals
        first. `note` (else the label's words) goes into the logbook next to
        every entity written."""
        note = self._note(label) if note is None else note
        saved: dict[str, Any] = self.data["saved"]
        written: dict[str, Any] = self.data["written"]
        external: list[str] = self.data["external"]
        key = adapter.battery["id"]
        self._notice_external(adapter, now)
        problem = None
        # Service calls are made once per state, not every minute.
        calls = [[w.entity_id, w.value] for w in writes if w.is_call]
        last = self.data["calls"].get(key) or {}
        new_calls = bool(calls) and (
            last.get("sig") != calls
            or (
                not last.get("ok")
                and now - datetime.fromisoformat(last.get("at", now.isoformat()))
                >= RETRY
            )
        )
        calls_ok = True
        for write in writes:
            if write.is_call:
                if not new_calls:
                    continue
                try:
                    await async_apply(self._hass, write, note, self.language())
                except WriteError as err:
                    problem = err.code
                    self._log(
                        "failed", battery=key, entity=err.entity_id, code=err.code
                    )
                    calls_ok = False
                    continue
                self._mark_active(key)
                self._log("call", battery=key, entity=write.entity_id, action=label)
                continue
            if write.entity_id in external:
                continue
            write = fit(self._hass, write)
            entry = written.get(write.entity_id)
            if matches(self._hass, write):
                if entry and entry["value"] == write.value:
                    entry["confirmed"] = True
                continue
            if (
                entry
                and entry["value"] == write.value
                and now - datetime.fromisoformat(entry["at"])
                < (FLASH_RETRY if write.flash else RETRY)
            ):
                if (
                    not entry.get("confirmed")
                    and now - datetime.fromisoformat(entry["at"]) > SETTLE
                ):
                    problem = "not_taken"
                continue
            if write.entity_id not in saved:
                original = read(self._hass, write.entity_id)
                if original is None:
                    problem = "unavailable"
                    continue
                saved[write.entity_id] = original
            try:
                await async_apply(self._hass, write, note, self.language())
            except WriteError as err:
                problem = err.code
                self._log(
                    "failed",
                    battery=adapter.battery["id"],
                    entity=err.entity_id,
                    code=err.code,
                )
                continue
            first = entry is None
            self.data["steered"] = True
            self._mark_active(key)
            written[write.entity_id] = {
                "value": write.value,
                "at": now.isoformat(timespec="seconds"),
                "confirmed": False,
                "battery": adapter.battery["id"],
            }
            if first or label in ("action_on", "action_off"):
                self._log(
                    label if label in ("action_on", "action_off") else "set",
                    battery=key,
                    entity=write.entity_id,
                    value=write.value,
                    action=label,
                )
                if label in ("action_on", "action_off"):
                    self._fire(
                        "action_activated" if label == "action_on" else "action_reset",
                        action=key.removeprefix("action:"),
                        entity_id=write.entity_id,
                    )
        if new_calls:
            self.data["calls"][key] = {
                "sig": calls,
                "at": now.isoformat(timespec="seconds"),
                "ok": calls_ok,
            }
        self._settle_loop_owned(adapter)
        return problem

    def _floored(self, adapter: Adapter, want: Desired) -> Desired:
        """Never hold a battery below the floor it had before (its own minimum)."""
        if want.floor is None:
            return want
        entity_id = adapter.controls.get("min_soc", "")
        original = self.data["saved"].get(entity_id)
        if original is None:
            original = read(self._hass, entity_id) if entity_id else None
        if isinstance(adapter, RoleAdapter) and isinstance(original, int | float):
            original = adapter._level("min_soc", original)
        if isinstance(original, int | float) and want.floor < original:
            return replace(
                want,
                floor=math.ceil(original),
            )
        return want

    def _written_state(self) -> tuple[Any, ...]:
        """What must be on disk before Joe relies on it (originals, caps)."""
        return (
            dict(self.data["saved"]),
            list(self.data["active"]),
            dict(self.data["surplus"]["caps"]),
            self.data["surplus"].get("released"),
            self.data.get("day"),
            self.data.get("day_released"),
            deepcopy(self.data.get("day_buffer")),
            deepcopy(self.data["team"]["blocks"]),
            self.data["team"]["active"],
            dict(self.data["team"]["empty"]),
            dict(self.data["team"]["full"]),
            self.data["team"]["parallel"],
            # The day so far every ten minutes, what Joe learned and looked back on.
            ((self.data["team"].get("today") or {}).get("at") or "")[:15],
            self.data["team"].get("reviewed"),
            deepcopy(self.data["team"].get("peaks")),
        )

    def _mark_active(self, key: str) -> None:
        if key not in self.data["active"]:
            self.data["active"].append(key)

    @property
    def _dirty(self) -> bool:
        """Something is still set or running that the release has to undo."""
        return bool(self.data["saved"] or self.data["active"])

    def _dirty_except(self, keep: set[str]) -> bool:
        """Like _dirty, apart from the entities of cars charging by hand."""
        config = self._config()
        return any(e not in keep for e in self.data["saved"]) or any(
            not _kept(k, keep, config) for k in self.data["active"]
        )

    # --- grid-friendly mornings -----------------------------------------------

    async def _async_day(
        self,
        config: dict[str, Any],
        plan: dict[str, Any] | None,
        mode: str,
        now: datetime,
    ) -> tuple[dict[str, Any], set[str]]:
        """After the night: hold back charging until the midday sun (see planner._grid_friendly).

        Only batteries with a charge limit and a passed test run, only in the
        modes "suggest" (with a yes for the night) and "live". When the sun
        stays behind the forecast, Joe lets go early. After the window the
        planner shows the next night's preview with last night's plan as
        "morning" until its defer_until.

        The buffer (planner.morning_buffer): its batteries charge from the sun
        first, their charge limit as it was (their own control takes only
        surplus by day, never the grid); at the buffer's level Joe holds back,
        below it by `back` they charge again (see _day_buffer). The other
        batteries hold back all morning.
        """
        self._day_buffer_freed = False
        if plan and not plan.get("fixed"):
            plan = plan.get("morning")
        info = (plan or {}).get("day")
        if (
            not info
            or not plan
            or not plan.get("fixed")
            or not config["rules"].get("grid_friendly", True)
            or mode not in ("advisory", "live")
        ):
            return {}, set()
        night = plan["window"]["start"]
        until = datetime.fromisoformat(info["defer_until"])
        lead = timedelta(minutes=config["rules"]["reset_lead_min"])
        if not datetime.fromisoformat(plan["window"]["end"]) - lead <= now < until:
            return {}, set()
        if self.data["skip"] == night or self.data.get("day_released") == night:
            return {}, set()
        answer = self.data["answer"] or {}
        if mode == "advisory" and (
            answer.get("night") != night or not answer.get("yes")
        ):
            return {}, set()
        items = []
        for battery in config["batteries"]:
            adapter = make_adapter(battery)
            if (
                isinstance(adapter, RoleAdapter)
                and adapter.can_defer()
                and self.tested(battery)
                and not adapter.missing(self._hass)
            ):
                soc = number(self._hass.states.get(battery["soc_entity"]))
                items.append((battery, adapter, soc))
        if not items:
            return {}, set()
        # Is the rest of the sun (with caution) still enough to fill them?
        sizes = {b["id"]: b.get("capacity") for b in plan.get("batteries") or []}
        headroom = sum(
            (sizes.get(battery["id"]) or battery.get("capacity_kwh") or 0.0)
            * (100 - (soc or 0.0))
            / 100
            for battery, _, soc in items
        )
        remaining = sum(
            max(0.0, hour["solar"] - hour["home"]) * DAY_CAUTION
            for hour in plan.get("hours") or []
            if datetime.fromisoformat(hour["start"]) >= now.replace(minute=0, second=0)
        )
        if remaining < headroom:
            self.data["day_released"] = night
            self._log(
                "day_released",
                remaining=round(remaining, 1),
                headroom=round(headroom, 1),
            )
            return {}, set()
        result: dict[str, Any] = {}
        keep: set[str] = set()
        buffer = info.get("buffer") or None
        filling = self._day_buffer(night, buffer, items)
        for battery, adapter, soc in items:
            if filling.get(battery["id"]):
                # Up to the buffer from the sun: its limit as it was (the
                # release puts back what Joe held).
                result[battery["id"]] = {
                    "action": "buffer",
                    "until": info["defer_until"],
                    "level": buffer["soc"] if buffer else None,
                    "floor": None,
                    "target": None,
                    "soc": soc,
                    "problem": None,
                }
                continue
            writes = adapter.defer()
            problem = await self._async_write(adapter, writes, now, "defer")
            keep |= {w.entity_id for w in writes} | {battery["id"]}
            result[battery["id"]] = {
                "action": "defer",
                "until": info["defer_until"],
                "level": buffer["soc"] if buffer and battery["id"] in filling else None,
                "floor": None,
                "target": None,
                "soc": soc,
                "problem": problem,
            }
        if self.data.get("day") != night:
            self.data["day"] = night
            self._log(
                "day",
                until=info["defer_until"],
                level=buffer["soc"] if buffer else None,
            )
        return result, keep

    def _day_buffer(
        self,
        night: str,
        buffer: dict[str, Any] | None,
        items: list[tuple[dict[str, Any], RoleAdapter, float | None]],
    ) -> dict[str, bool]:
        """Per battery of the buffer: whether it charges up to it now (True)
        or holds back (False). Below the level it charges; once there it
        holds back, and charges again only below the level minus `back`
        (no switching with every cloud). A battery whose level is unknown
        holds back."""
        store = self.data.get("day_buffer") or {}
        if store.get("night") != night:
            store = {"night": night, "fill": {}}
        before: dict[str, bool] = store["fill"]
        result: dict[str, bool] = {}
        self._day_buffer_freed = False
        if buffer:
            level = float(buffer["soc"])
            back = float(buffer.get("back") or 2.0)
            members = set(buffer.get("batteries") or [])
            for battery, _, soc in items:
                key = battery["id"]
                if key not in members or soc is None:
                    continue
                was = before.get(key)
                # Charging (or not known yet): up to the level; held back:
                # again only below it by `back`.
                now_filling = soc < (level if was is not False else level - back)
                result[key] = now_filling
                if now_filling != was and (was is not None or now_filling):
                    self._log(
                        "day_buffer",
                        battery=key,
                        soc=round(soc, 1),
                        level=round(level),
                        fill=now_filling,
                    )
                if now_filling and was is False:
                    # Held back until now: the release gives its limit back.
                    self._day_buffer_freed = True
        self.data["day_buffer"] = {"night": night, "fill": result}
        return result

    def _team_charge_order(self, rules: dict[str, Any]) -> list[str]:
        """The charge order of the day's turns; on a grid-friendly morning the
        buffer's group comes first (it covers the morning, so it charges up to
        the buffer; the others hold back anyway)."""
        order = list(rules.get("team_charge_order") or [])
        store = self.data.get("day_buffer") or {}
        first = list(store.get("fill") or {}) if self.data.get("day") else []
        return [*first, *(k for k in order if k not in first)]

    def _day_holds(self, key: str) -> bool:
        """Whether the grid-friendly morning holds this battery's charge limit
        (not while it charges up to the buffer)."""
        if not self.data.get("day"):
            return False
        store = self.data.get("day_buffer") or {}
        return not (store.get("fill") or {}).get(key)

    # --- daytime surplus ---------------------------------------------------------

    async def _async_surplus(
        self,
        config: dict[str, Any],
        plan: dict[str, Any] | None,
        mode: str,
        now: datetime,
        morning: bool,
        team: dict[str, Any] | None = None,
    ) -> set[str]:
        """On sunny days: cap charging so the surplus shows at the grid meter.

        An evcc loadpoint in PV mode (a car, the floor heating) runs on it,
        and the batteries are full all the same before the sun goes (see
        plan/surplus.py). Only live, only batteries with a charge limit that
        takes a power, a passed test run and "takes part" on; the
        grid-friendly morning goes first. In the simulation and "suggest" Joe
        shows what he would do. Returns the entities to leave as they are.

        The originals go into "saved" like every other write, so the release
        (end of the day, mode change, "Sofort freigeben", stop, a restart
        after a crash) puts them back.

        Several batteries one after the other (`team`, see _async_team): one
        whose charging is blocked waits; its room counts for the active group,
        which takes the whole cap. Batteries charging side by side are left
        free (their own control takes what the capped one leaves).
        """
        rules = config["rules"]
        local = dt_util.as_local(now)
        today = local.date().isoformat()
        store: dict[str, Any] = self.data["surplus"]
        info: dict[str, Any] = {
            "state": "off",
            "dry": mode != "live",
            "caution": rules["day_caution"],
            "batteries": {},
            "loadpoints": [],
            "evcc": {},
            "conflicts": [],
        }
        state = self._surplus_gate(config, plan, mode, local, morning)
        stores: list[day_surplus.Store] = []
        items: dict[str, tuple[dict[str, Any], RoleAdapter | None]] = {}
        result: dict[str, Any] = {}
        points: list[dict[str, Any]] = []
        if state != "off":
            # evcc's side, also outside the day: its settings may work against it.
            snap = evcc.snapshot(self._hass)
            points = evcc.loadpoints(snap)
            found = evcc.settings(snap)
            info.update(
                loadpoints=points,
                evcc=found,
                conflicts=[
                    *evcc.conflicts(found, points),
                    *self._device_conflicts(config),
                ],
            )
        learn_keep: set[str] = set()
        if state is None:
            assert plan is not None
            sizes = {b["id"]: b.get("capacity") for b in plan.get("batteries") or []}
            waiting = set(team["blocked"]) if team else set()
            side = set(team["parallel"]) if team else set()
            waiting_room = 0.0
            for battery in config["batteries"]:
                soc = number(self._hass.states.get(battery["soc_entity"]))
                size = sizes.get(battery["id"]) or battery.get("capacity_kwh")
                if soc is None or not size:
                    info["batteries"][battery["id"]] = {
                        "name": battery["name"],
                        "state": "unknown",
                        "soc": None if soc is None else round(soc, 1),
                        "cap_kw": None,
                        "problem": None,
                    }
                    continue
                if battery["id"] in waiting:
                    # Its turn comes after the active one: its room counts there.
                    waiting_room += max(0.0, size * (100 - soc) / 100)
                    info["batteries"][battery["id"]] = {
                        "name": battery["name"],
                        "state": "team_wait",
                        "soc": round(soc, 1),
                        "cap_kw": None,
                        "problem": None,
                    }
                    continue
                adapter = make_adapter(battery)
                role = adapter if isinstance(adapter, RoleAdapter) else None
                why = "takes_part"
                problem = role.limit_problem(self._hass) if role else "no_limit"
                if problem in ("no_limit", "unit", "unavailable"):
                    why = problem or "no_limit"
                elif problem:
                    why = problem
                elif role is None or role.missing(self._hass):
                    why = "unavailable"
                elif not self.tested(battery):
                    why = "not_tested"
                elif not battery.get("day_surplus", True):
                    why = "left_out"
                default_kw = min(5.0, size * 0.5)
                stores.append(
                    day_surplus.Store(
                        id=battery["id"],
                        capacity=size,
                        soc=max(0.0, min(100.0, soc)),
                        max_kw=(battery.get("max_charge_w") or default_kw * 1000)
                        / 1000,
                        capped=why == "takes_part" and battery["id"] not in side,
                    )
                )
                items[battery["id"]] = (battery, role)
                info["batteries"][battery["id"]] = {
                    "name": battery["name"],
                    "state": why,
                    "soc": round(soc, 1),
                    "cap_kw": None,
                    "problem": None,
                }
            if waiting_room and team:
                # The waiting room counts for one battery of the active group
                # (one that takes part, if any).
                active = [
                    store_
                    for key in team["active_batteries"]
                    for store_ in stores
                    if store_.id == key
                ]
                carrier = next((x for x in active if x.capped), None) or next(
                    iter(active), None
                )
                stores = [
                    _with_room(store_, waiting_room) if store_ is carrier else store_
                    for store_ in stores
                ]
            if mode == "live":
                learn_keep = await self._async_learn_ref(config, info["batteries"], now)
            caution = day_surplus.CAUTION.get(rules["day_caution"], 0.8)
            hours = plan.get("hours") or []
            created = (
                datetime.fromisoformat(plan["created"]) if plan.get("created") else None
            )
            ratio = None
            forecast = day_surplus.forecast_kw(hours, created, now)
            solar = [
                solar_kw(self._hass.states.get, m)
                for m in config["measurements"]["solar_power"]
            ]
            if forecast and forecast > 0.2 and solar and None not in solar:
                ratio = sum(s or 0.0 for s in solar) / forecast
            found_slots = day_surplus.slots(hours, created, now, caution, ratio)
            result = day_surplus.day_cap(found_slots, stores, now)
            state = result["state"]
            if state == "cap" and not any(p["wants"] for p in points):
                state = "no_loadpoint"
            if (
                state == "cap"
                and not store["caps"]
                and found_slots
                and found_slots[0].surplus <= 0
            ):
                # The sun does not cover the house yet: no cap before it does.
                state = "soon"
            info.update(
                pv_end=result["pv_end"].isoformat(timespec="minutes")
                if result["pv_end"]
                else None,
                cap_kw=result["cap_kw"],
                need_kwh=result["need_kwh"],
                surplus_kwh=result["surplus_kwh"],
                expected_kwh=result["expected_kwh"],
                hours=result["hours"],
                sun_ratio=round(ratio, 2) if ratio is not None else None,
            )
        info["state"] = state
        caps: dict[str, float] = dict(result.get("caps") or {})
        keep: set[str] = set()
        if state == "cap" and mode == "live":
            caps = self._surplus_steady(caps, now)
            started = not store["caps"]
            total = round(sum(caps.values()), 1)
            logged = store.get("logged") or 0.0
            for lever, members in self._cap_levers(caps, items).items():
                role = members[0][1]
                # A system limit is for all its batteries: the sum of their caps,
                # and the full power of those Joe does not cap.
                kw = sum(caps.get(key, 0.0) for key, _ in members)
                kw += sum(
                    store_.max_kw
                    for store_ in stores
                    if store_.id not in caps
                    and store_.id in self._lever_members(lever, items)
                    and store_.room > day_surplus.FULL_KWH
                )
                # "Nacheinander" blocks its discharging (side by side): the
                # system's shared switch must not open it for the cap.
                stopped = set(team["no_discharge"]) if team else set()
                writes = role.limit(
                    self._hass,
                    kw,
                    self.data["saved"],
                    any(key in stopped for key, _ in members),
                )
                problem = await self._async_write(role, writes, now, "cap")
                keep |= {w.entity_id for w in writes}
                for key, _ in members:
                    keep.add(key)
                    info["batteries"][key].update(
                        state="capped", cap_kw=caps[key], problem=problem
                    )
            if started or set(caps) != set(store["caps"]):
                self._log(
                    "surplus_cap",
                    power=total,
                    caps=caps,
                    until=info.get("pv_end"),
                    loadpoint=next(
                        (p["name"] for p in info["loadpoints"] if p["wants"]), None
                    ),
                )
                store["logged"] = total
            elif total >= logged + SURPLUS_LOG_KW:
                # Raised as the sun lags: written at once, logged in larger steps.
                self._log("surplus_raise", power=total, caps=caps)
                store["logged"] = total
            store["caps"] = caps
        else:
            if state == "cap":
                for key, kw in caps.items():
                    info["batteries"][key].update(state="would", cap_kw=kw)
            if store["caps"]:
                self._surplus_forget(state)
                if state in ("full", "not_reachable", "after_pv"):
                    # Let go for good today (no back and forth with the clouds).
                    store["released"] = today
        if self.surplus != info:
            self.surplus = info
            self._changed()
        return keep | learn_keep

    def _cap_levers(
        self,
        caps: dict[str, float],
        items: dict[str, tuple[dict[str, Any], RoleAdapter | None]],
    ) -> dict[str, list[tuple[str, RoleAdapter]]]:
        """The capped batteries by the limit they are capped with (one write each)."""
        result: dict[str, list[tuple[str, RoleAdapter]]] = {}
        for key in caps:
            role = items[key][1]
            assert role is not None
            result.setdefault(role.limit_key() or key, []).append((key, role))
        return result

    @staticmethod
    def _lever_members(
        lever: str, items: dict[str, tuple[dict[str, Any], RoleAdapter | None]]
    ) -> set[str]:
        """Every battery behind a limit (a system limit has several)."""
        return {
            key
            for key, (_, role) in items.items()
            if role is not None and role.limit_key() == lever
        }

    def _device_conflicts(self, config: dict[str, Any]) -> list[dict[str, Any]]:
        """The batteries' own settings that hold charging back (Omnibattery's
        charge delay and predictive charging), while they are on."""
        registry = er.async_get(self._hass)
        result: list[dict[str, Any]] = []
        seen: set[str] = set()
        for battery in config["batteries"]:
            profile = profile_for(battery.get("adapter"))
            adapter = make_adapter(battery)
            if (
                not profile
                or not profile.day_conflicts
                or not isinstance(adapter, RoleAdapter)
                or not adapter.limit_roles()
            ):
                continue
            soc = registry.async_get(battery["soc_entity"])
            if not soc or not soc.config_entry_id:
                continue
            for item in er.async_entries_for_config_entry(
                registry, soc.config_entry_id
            ):
                if item.domain != "switch" or item.entity_id in seen:
                    continue
                uid = item.unique_id or ""
                for key in profile.day_conflicts:
                    if item.translation_key == key or any(
                        uid.endswith(f"{sep}{key}") for sep in ("-", "_", ".")
                    ):
                        seen.add(item.entity_id)
                        state = self._hass.states.get(item.entity_id)
                        if state and state.state == "on":
                            result.append(
                                {
                                    "code": key,
                                    "entity_id": item.entity_id,
                                    "battery": battery["name"],
                                }
                            )
                        break
        return result

    def _drop_foreign(self, entity_ids: list[str]) -> None:
        """Values someone else set after Joe (an automation): Joe does not put
        his originals back over them; he forgets them and says so."""
        saved: dict[str, Any] = self.data["saved"]
        written: dict[str, Any] = self.data["written"]
        for entity_id in entity_ids:
            entry = written.get(entity_id)
            if not entry or entity_id not in saved:
                continue
            state = self._hass.states.get(entity_id)
            if state is None or state.state in ("unavailable", "unknown"):
                continue
            if matches(self._hass, Write(entity_id, entry["value"])) or matches(
                self._hass, fit(self._hass, Write(entity_id, saved[entity_id]))
            ):
                continue
            saved.pop(entity_id, None)
            written.pop(entity_id, None)
            self._log(
                "external",
                battery=entry.get("battery"),
                entity=entity_id,
                value=read(self._hass, entity_id),
            )

    async def _async_unlimit(self, adapter: RoleAdapter, now: datetime) -> None:
        """A cap's limit back as it was (what an automation set meanwhile stays);
        what is back is no longer Joe's to restore."""
        entities = adapter.limit_entities()
        self._drop_foreign(entities)
        saved: dict[str, Any] = self.data["saved"]
        await self._async_write(adapter, adapter.unlimit(saved), now, "cap_back")
        for entity_id in entities:
            if entity_id in saved and matches(
                self._hass, fit(self._hass, Write(entity_id, saved[entity_id]))
            ):
                saved.pop(entity_id, None)
                self.data["written"].pop(entity_id, None)
        if not any(e in saved for e in adapter.entities()):
            key = adapter.battery["id"]
            self.data["active"] = [k for k in self.data["active"] if k != key]

    # --- learning what 100 % stand for ---------------------------------------

    async def _async_learn_ref(
        self, config: dict[str, Any], states: dict[str, Any], now: datetime
    ) -> set[str]:
        """Learn what 100 % of a charge limit in % stand for (Fronius).

        While the battery charges fast and unrestricted in plenty of sun, Joe
        sets a test limit (50 %) for a few minutes and measures the battery's
        power: if it settles clearly below what it took before, 100 % stand
        for twice that. The originals go back right after; a try that tells
        nothing is made again another day (with half the test limit when it
        did not bite). Returns the entities to leave as they are meanwhile.
        """
        store = self.data["surplus"]
        learn = store.get("learn")
        today = dt_util.as_local(now).date().isoformat()
        tried: dict[str, Any] = store.setdefault("learn_tried", {})
        batteries = {b["id"]: b for b in config["batteries"]}
        if learn:
            battery = batteries.get(learn["battery"])
            adapter = make_adapter(battery) if battery else None
            if (
                battery is None
                or not isinstance(adapter, RoleAdapter)
                or states.get(battery["id"], {}).get("state") != "need_ref"
            ):
                return await self._async_learn_end(adapter, learn, None, "stopped")
            since = datetime.fromisoformat(learn["since"])
            if now - since > LEARN_GIVE_UP:
                return await self._async_learn_end(adapter, learn, None, "late")
            if now - since < LEARN_SPAN:
                states[battery["id"]]["state"] = "learning"
                return set(adapter.limit_entities()) | {battery["id"]}
            power = _charge_w(self._hass, battery)
            solar = _solar_kw(self._hass, config)
            reason = None
            if power is None or solar is None:
                reason = "unknown"
            elif learn.get("solar_kw") and solar < learn["solar_kw"] * LEARN_SUN_KEEP:
                reason = "sun"
            elif power > learn["before_w"] * LEARN_DROP:
                reason = "no_effect"
            ref = None
            if reason is None and power is not None:
                ref = round(power * 100 / learn["percent"], -1)
                low, high = LEARN_REF_RANGE
                if not low <= ref <= high or ref < learn["before_w"] * 0.9:
                    reason = "implausible"
                    ref = None
            return await self._async_learn_end(adapter, learn, ref, reason)
        for battery_id, entry in states.items():
            if entry.get("state") != "need_ref":
                continue
            battery = batteries[battery_id]
            last = tried.get(battery_id) or {}
            if last.get("day") == today or not battery.get("day_surplus", True):
                continue
            adapter = make_adapter(battery)
            if not isinstance(adapter, RoleAdapter) or not self.tested(battery):
                continue
            if adapter.missing(self._hass) or not adapter.limit_roles():
                continue
            power = _charge_w(self._hass, battery)
            solar = _solar_kw(self._hass, config)
            soc = entry.get("soc")
            if (
                power is None
                or solar is None
                or soc is None
                or soc > LEARN_MAX_SOC
                or power < max(LEARN_MIN_W, 0.5 * (battery.get("max_charge_w") or 0))
                # More sun than the battery takes: it takes all it can.
                or solar * 1000 < power + 500
                # Unrestricted: no limit of the owner's in force.
                or adapter._own_limit(self._hass, {}) not in (None, 100.0)
            ):
                continue
            percent = int(last.get("next") or LEARN_PERCENT)
            switch, role = adapter.limit_roles()  # type: ignore[misc]
            writes = []
            if switch in adapter.controls:
                writes.append(Write(adapter.controls[switch], True))
            writes.append(Write(adapter.controls[role], percent))
            tried[battery_id] = {"day": today, "next": percent}
            store["learn"] = {
                "battery": battery_id,
                "since": now.isoformat(timespec="seconds"),
                "before_w": round(power),
                "solar_kw": round(solar, 2),
                "percent": percent,
            }
            await self._async_write(adapter, adapter._paced(writes), now, "learn")
            self._log(
                "limit_ref_test", battery=battery_id, value=percent, power=power / 1000
            )
            entry["state"] = "learning"
            return set(adapter.limit_entities()) | {battery_id}
        return set()

    async def _async_learn_end(
        self,
        adapter: RoleAdapter | None,
        learn: dict[str, Any],
        ref: float | None,
        reason: str | None,
    ) -> set[str]:
        """The test limit back as it was; the reference noted, or why not."""
        store = self.data["surplus"]
        store["learn"] = None
        battery_id = learn["battery"]
        if adapter is not None:
            await self._async_unlimit(adapter, dt_util.now())
        if ref is not None:
            self._log("limit_ref", battery=battery_id, power=ref / 1000)
            if self.on_learned:
                self.on_learned(battery_id, ref)
            return set()
        if reason == "no_effect":
            # The test limit was above what the battery took: smaller next time.
            tried = store.setdefault("learn_tried", {}).setdefault(battery_id, {})
            tried["next"] = max(LEARN_MIN_PERCENT, learn["percent"] // 2)
        self._log("limit_ref_failed", battery=battery_id, reason=reason)
        return set()

    def _surplus_gate(
        self,
        config: dict[str, Any],
        plan: dict[str, Any] | None,
        mode: str,
        local: datetime,
        morning: bool,
    ) -> str | None:
        """Why there is no daytime surplus now, or None if Joe looks at it."""
        if not config["rules"].get("day_surplus") or mode == "off":
            return "off"
        if not plan or plan.get("kind") == "unavailable" or not plan.get("hours"):
            return "no_plan"
        window = plan.get("window") or {}
        if window and (
            datetime.fromisoformat(window["start"])
            <= local
            < datetime.fromisoformat(window["end"])
        ):
            return "night"
        if local.hour >= SURPLUS_LATEST:
            return "night"
        if self.data["surplus"]["released"] == local.date().isoformat():
            return "released"
        if morning:
            return "morning"
        return None

    def _surplus_steady(
        self, caps: dict[str, float], now: datetime
    ) -> dict[str, float]:
        """Up at once, down only a little while after the last change (no
        writing every minute when a cloud passes)."""
        store = self.data["surplus"]
        old: dict[str, float] = store["caps"]
        changed = store.get("changed")
        recent = changed and now - datetime.fromisoformat(changed) < SURPLUS_LOWER_EVERY
        result = {}
        for key, kw in caps.items():
            before = old.get(key)
            if (
                before is not None
                and kw < before
                and (recent or before - kw < SURPLUS_LOWER_KW)
            ):
                kw = before
            result[key] = kw
        if result != old:
            store["changed"] = now.isoformat(timespec="seconds")
        return result

    def _surplus_forget(self, reason: str) -> None:
        """No cap any more (the release puts the originals back)."""
        store = self.data["surplus"]
        if store["caps"]:
            self._log("surplus_end", reason=reason)
        store.update(caps={}, changed=None, logged=None)
        if self.surplus.get("state") == "cap":
            self.surplus = {**self.surplus, "state": reason}

    async def _async_surplus_off(
        self, config: dict[str, Any], now: datetime, reason: str
    ) -> None:
        """Put the charge limits of a daytime cap (or a test limit) back right away."""
        learn = self.data["surplus"].get("learn")
        if learn:
            battery = next(
                (b for b in config["batteries"] if b["id"] == learn["battery"]), None
            )
            adapter = make_adapter(battery) if battery else None
            await self._async_learn_end(
                adapter if isinstance(adapter, RoleAdapter) else None,
                learn,
                None,
                reason,
            )
        caps = self.data["surplus"]["caps"]
        if not caps:
            return
        for battery in config["batteries"]:
            adapter = make_adapter(battery)
            if battery["id"] in caps and isinstance(adapter, RoleAdapter):
                await self._async_unlimit(adapter, now)
        self._surplus_forget(reason)
        self.surplus = {**self.surplus, "state": reason}

    # --- several batteries one after the other ---------------------------------

    async def _async_team(
        self,
        config: dict[str, Any],
        plan: dict[str, Any] | None,
        mode: str,
        now: datetime,
        night: bool = False,
    ) -> tuple[dict[str, tuple[bool, bool]], dict[str, Any] | None]:
        """Which battery may work now, and the blocks for the others.

        Batteries that regulate themselves to 0 W at the grid meter (Fronius,
        Omnibattery in automatic mode) shift energy between each other when
        two systems work. With "Nacheinander" (rules.battery_team) exactly
        one group (the batteries one system regulates) is free, the others
        are blocked ahead of time (see control/team.py).
        "Nacheinander" is the default (rules.battery_team None); only
        "Gleichzeitig" chosen by the owner leaves them alone.
        Only by day and only live; the simulation and "suggest" show what Joe
        would do. During the night's plan it only watches: the night's
        steering comes first (it blocks the others itself while one charges
        from the grid), and the blocks are given back as the night begins.
        The owner's automations that write to these batteries are theirs: Joe
        neither switches them nor waits for them, he only says that they get
        in his way (see _async_watch_automations).

        Returns per battery (charge blocked, discharge blocked) and, for the
        daytime cap, the active group with the batteries waiting or charging
        side by side (None while Joe does not coordinate).
        """
        rules = config["rules"]
        store: dict[str, Any] = self.data["team"]
        today = dt_util.as_local(now).date().isoformat()
        groups = self._team_groups(config)
        # Forget what belongs to batteries (and groups) that are gone; a
        # group's fullness is watched under "group:<its key>".
        ids = {b["id"] for b in config["batteries"]} | {
            f"group:{g[0]}" for g in groups.values()
        }
        for key in ("empty", "full", "watch", "cutoffs", "stuck", "touched"):
            store[key] = {k: v for k, v in (store.get(key) or {}).items() if k in ids}
        # A block that did not arrive counts for the day it happened.
        store["broken"] = {
            k: v
            for k, v in (store.get("broken") or {}).items()
            if v.get("day") == today and k in {g[0] for g in groups.values()}
        }
        info: dict[str, Any] = {
            "state": "on",
            "mode": rules.get("battery_team"),
            # Not chosen: "Nacheinander" all the same (Joe takes it on).
            "default": rules.get("battery_team") is None,
            "dry": mode != "live",
            "active": None,
            "flow": None,
            "parallel": False,
            "batteries": {},
            "automations": [],
            "groups": {},
            "group_question": False,
            # By day with sense (see control/team_day.py): the owner's choice,
            # why the later groups charge along now ("forecast", "export"),
            # from when the forecast lets them, whether one helps discharging,
            # the base load, what Joe learned, the last day he looked back on
            # and what he asks.
            "style": team_day.style_of(rules),
            "along": None,
            "along_w": {},
            "along_plan": None,
            "help": False,
            "base": None,
            "base_problem": None,
            "learned": deepcopy(store.get("lead")),
            "early": rules.get("team_early"),
            "review": deepcopy((store.get("reviews") or [None])[-1]),
            "suggest": None,
        }
        candidates: list[tuple[dict[str, Any], RoleAdapter | None]] = []
        powers: dict[str, float] = {}
        for battery in config["batteries"]:
            adapter = make_adapter(battery)
            role = adapter if isinstance(adapter, RoleAdapter) else None
            proposed = self._proposed_regulating(battery)
            own = battery.get("self_regulating")
            regulating = proposed if own is None else bool(own)
            soc = number(self._hass.states.get(battery["soc_entity"]))
            power = _charge_w(self._hass, battery)
            if power is not None:
                powers[battery["id"]] = power
            info["batteries"][battery["id"]] = {
                "name": battery["name"],
                "self_regulating": regulating,
                "proposed": proposed,
                "soc": None if soc is None else round(soc, 1),
                "power_w": None if power is None else round(power),
                "cutoff": battery.get("cutoff_soc"),
                "floor": self._team_floor(battery, role),
                "charge": None,
                "discharge": None,
                "why": None,
                "problem": None,
                "group": groups[battery["id"]][0],
                "group_proposed": groups[battery["id"]][1],
                "group_sure": groups[battery["id"]][2],
            }
            if regulating:
                candidates.append((battery, role))
        for battery, _ in candidates:
            key = groups[battery["id"]][0]
            group = info["groups"].setdefault(key, {"batteries": []})
            group["batteries"].append(battery["id"])
        # Unsure who regulates whom: Joe asks ("Welche Speicher werden vom
        # selben System geregelt?") until the owner says it.
        info["group_question"] = len(candidates) >= 2 and any(
            battery.get("control_group") is None and not groups[battery["id"]][2]
            for battery, _ in candidates
        )
        deficit = self._team_deficit(config, powers)
        if mode != "off" and not night:
            self._team_learn(candidates, powers, deficit, now)
        if mode != "off":
            self._team_peaks(powers)
        state = self._team_gate(config, candidates, mode, today, night, info, groups)
        state = self._team_grace(state, info, now)
        info["state"] = state
        want: dict[str, tuple[bool, bool]] = {}
        hint: dict[str, Any] | None = None
        if state == "on":
            want, hint = self._team_choose(
                config, plan, candidates, deficit, powers, now, today, info, groups
            )
            self._team_hint = hint
        elif state == "bridging":
            # Everything stays as it is for a moment, the cap's hint, too.
            hint = self._team_hint
        else:
            self._team_hint = None
            store.update(active=None, since=None)
            store["along"], store["help"], store["quick"] = {}, {}, {}
            self._team_base_w = {}
            self._team_along_w = {}
            if store.get("along_on"):
                store["along_on"] = False
                self._log("team_along_end", reason=state)
        self._team_review(config, info, groups, now)
        self.team = info
        if state != "on":
            self._team_publish()
        return want, hint

    def _team_grace(self, state: str, info: dict[str, Any], now: datetime) -> str:
        """A value missing only for a moment (a charge level, a lever, the grid
        meter): "bridging" while Joe keeps his blocks in force (TEAM_GRACE,
        nothing new written, nothing given back), else the state. A lever gone
        for real, or the grace over: the state, so everything goes back."""
        store: dict[str, Any] = self.data["team"]
        gap = store.get("gap")
        if (
            state not in TEAM_GRACE_REASONS
            or self._team_lasting
            or info["dry"]
            or not store["blocks"]
        ):
            if gap and state == "on" and now - _at(gap["since"]) < TEAM_GRACE:
                self._log("team_gap_end", reason=gap["reason"])
            store["gap"] = None
            return state
        if gap is None:
            gap = store["gap"] = {
                "since": now.isoformat(timespec="seconds"),
                "reason": state,
            }
            self._log("team_gap", reason=state)
        since = _at(gap["since"])
        if now - since >= TEAM_GRACE:
            return state
        info["gap"] = {
            "reason": state,
            "until": (since + TEAM_GRACE).isoformat(timespec="seconds"),
        }
        return "bridging"

    def _team_held(self, config: dict[str, Any]) -> set[str]:
        """What Joe's held blocks keep (entities and batteries)."""
        keep: set[str] = set()
        groups = {k: v[0] for k, v in self._team_groups(config).items()}
        for battery in config["batteries"]:
            if battery["id"] not in self.data["team"]["blocks"]:
                continue
            adapter = make_adapter(battery)
            if isinstance(adapter, RoleAdapter):
                whole = self._whole_system(config, groups, battery, adapter)
                keep |= set(adapter.team_entities(whole)) | {battery["id"]}
        return keep

    def _team_ids(self, config: dict[str, Any]) -> set[str]:
        """The batteries that regulate themselves, when two systems or more
        regulate them (Joe coordinates them by day), else none."""
        groups = self._team_groups(config)
        ids = {
            b["id"]
            for b in config["batteries"]
            if (
                self._proposed_regulating(b)
                if b.get("self_regulating") is None
                else bool(b["self_regulating"])
            )
        }
        return ids if len({groups[k][0] for k in ids}) >= 2 else set()

    def _team_publish(self) -> None:
        """Tell the panel when what the batteries do together changed."""
        if self.team != self._team_shown:
            self._team_shown = deepcopy(self.team)
            self._changed()

    def _team_gate(
        self,
        config: dict[str, Any],
        candidates: list[tuple[dict[str, Any], RoleAdapter | None]],
        mode: str,
        today: str,
        night: bool,
        info: dict[str, Any],
        groups: dict[str, tuple[str, str, bool]],
    ) -> str:
        """Why Joe does not coordinate now, or "on"."""
        return self._team_ready(config, candidates, mode, today, night, info, groups)

    def _team_ready(
        self,
        config: dict[str, Any],
        candidates: list[tuple[dict[str, Any], RoleAdapter | None]],
        mode: str,
        today: str,
        night: bool,
        info: dict[str, Any],
        groups: dict[str, tuple[str, str, bool]],
    ) -> str:
        """Why Joe could not coordinate now even without the owner's
        automations, or "on"."""
        self._team_lasting = False
        # Not chosen yet: "Nacheinander" (only "Gleichzeitig" leaves them alone).
        choice = config["rules"].get("battery_team") or "sequence"
        if choice != "sequence":
            return "together"
        if mode == "off":
            return "off"
        if len(candidates) < 2:
            return "single"
        if len(info["groups"]) < 2:
            # One system regulates them all: nothing runs against it by day.
            return "one_group"
        if night:
            return "night"
        if self.data["team"]["paused"] == today:
            return "paused"
        seen: dict[str, str] = {}
        state = "on"
        keys = {k: v[0] for k, v in groups.items()}
        for battery, role in candidates:
            entry = info["batteries"][battery["id"]]
            whole = role is not None and self._whole_system(config, keys, battery, role)
            problem = (
                role.team_problem(self._hass, whole)
                if role is not None
                else "no_charge_lever"
            )
            if problem:
                entry["problem"] = problem
                state = "levers"
                # Only a lever that is there but cannot be reached right now
                # may be a moment's dropout (see _team_grace).
                if (
                    role is None
                    or problem != "unavailable"
                    or any(
                        self._hass.states.get(e) is None
                        for e in role.team_entities(whole)
                    )
                ):
                    self._team_lasting = True
                continue
            assert role is not None
            for entity_id in role.team_entities(whole):
                if (
                    seen.setdefault(entity_id, keys[battery["id"]])
                    != keys[battery["id"]]
                ):
                    # Two groups behind one limit cannot take turns.
                    entry["problem"] = "shared"
                    state = "levers"
                    self._team_lasting = True
            if state == "on" and not self.tested(battery):
                entry["problem"] = "not_tested"
                state = "not_tested"
            if state == "on" and entry["soc"] is None:
                entry["problem"] = "soc_unknown"
                state = "unknown"
        if state != "on":
            return state
        now = dt_util.now()
        for battery, _ in candidates:
            broken = self.data["team"]["broken"].get(keys[battery["id"]])
            if broken and (
                broken.get("count", 1) >= 2
                or now < datetime.fromisoformat(broken["until"])
            ):
                # Joe wrote a block and read it back: it did not arrive.
                info["batteries"][battery["id"]]["problem"] = broken["problem"]
                state = "not_taken"
        if state != "on":
            return state
        if (
            measurement_kw(self._hass.states.get, config["measurements"]["grid_power"])
            is None
        ):
            return "no_grid"
        return "on"

    def _team_choose(
        self,
        config: dict[str, Any],
        plan: dict[str, Any] | None,
        candidates: list[tuple[dict[str, Any], RoleAdapter | None]],
        deficit: float | None,
        powers: dict[str, float],
        now: datetime,
        today: str,
        info: dict[str, Any],
        groups: dict[str, tuple[str, str, bool]],
    ) -> tuple[dict[str, tuple[bool, bool]], dict[str, Any]]:
        """The active group, the blocks for the others and the hint for the cap."""
        rules = config["rules"]
        store: dict[str, Any] = self.data["team"]
        sizes = {
            b["id"]: b.get("capacity") for b in (plan or {}).get("batteries") or []
        }
        members: list[team_rules.Member] = []
        # What each battery can give (kW): as set, else the most Joe saw.
        give: dict[str, float] = {}
        peaks: dict[str, dict[str, float]] = store.get("peaks") or {}
        # A battery that gave nothing in its turn gets another after a while,
        # or as soon as it discharged after all.
        stuck: dict[str, Any] = store.setdefault("stuck", {})
        for battery, _ in candidates:
            held = stuck.get(battery["id"])
            level = info["batteries"][battery["id"]]["soc"]
            if held and (
                now - _at(held["at"]) >= team_rules.STUCK_RETRY
                or (level is not None and level <= held["soc"] - 1)
            ):
                stuck.pop(battery["id"])
                store["empty"].pop(battery["id"], None)
                store["quick"] = {}
        for battery, role in candidates:
            entry = info["batteries"][battery["id"]]
            size = sizes.get(battery["id"]) or battery.get("capacity_kwh") or 5.0
            seen = peaks.get(battery["id"]) or {}
            give[battery["id"]] = team_day.capability(
                battery.get("max_discharge_w"),
                seen.get("discharge"),
                min(5.0, size * 0.5),
            )
            member = team_rules.Member(
                id=battery["id"],
                soc=entry["soc"],
                cutoff=battery.get("cutoff_soc"),
                floor=entry["floor"],
                capacity=size,
                max_kw=team_day.capability(
                    battery.get("max_charge_w"),
                    seen.get("charge"),
                    min(5.0, size * 0.5),
                ),
                full_at=self._team_full_at(role),
                empty=battery["id"] in store["empty"],
                full=battery["id"] in store["full"],
            )
            empty, full = team_rules.mark(
                member, store["empty"].get(member.id), store["full"].get(member.id)
            )
            if empty and not member.empty:
                store["empty"][member.id] = entry["soc"]
            elif not empty:
                store["empty"].pop(member.id, None)
            if full and not member.full:
                store["full"][member.id] = entry["soc"]
            elif not full:
                store["full"].pop(member.id, None)
            member.empty, member.full = empty, full
            members.append(member)
        teams = team_rules.grouped(members, {k: v[0] for k, v in groups.items()})
        flow, raw = self._team_flow(deficit, now)
        info["flow"] = flow
        active = store["active"]
        # What the meter showed about the active group for a while (looked
        # at every few seconds, see _team_quick): it takes nothing while the
        # house gives to the grid – as full as it goes (its own target, a BMS
        # limit; not while the grid-friendly morning holds its charging back)
        # – or it gives nothing while the house draws from the grid: as empty
        # as it goes, or held back by a setting of its own (see
        # _async_watch_stuck). The next one takes over.
        current = next((g for g in teams if g.id == active), None)
        seen = self._team_seen(current, powers, deficit, now)
        info["seen"] = seen
        if (
            current is not None
            and seen["full"]
            and not current.full
            and not self.data.get("day")
            and not all(m.near_full for m in current.members)
        ):
            # Takes nothing far below its top: a pause, not full. It keeps
            # its turn and its charging; surplus meanwhile goes to the next
            # one alongside (see _team_along).
            if store.get("pause") != current.id:
                store["pause"] = current.id
                level = self._team_level(current)
                self._log(
                    "team_pause",
                    battery=current.ids[0],
                    batteries=current.ids,
                    soc=level,
                )
                names = {b["id"]: b["name"] for b, _ in candidates}
                if note := self._note(
                    "team_pause",
                    name=names.get(current.ids[0], current.ids[0]),
                    soc=(
                        f"{level:.0f}"
                        if self.language() != "de"
                        else f"{level:.0f}".replace(".", ",")
                    ),
                ):
                    async_line(self._hass, note)
        elif current is not None and not seen["full"]:
            store.pop("pause", None)
        if (
            current is not None
            and seen["full"]
            and not current.full
            and not self.data.get("day")
            and all(m.near_full for m in current.members)
        ):
            for member in current.members:
                if not member.full:
                    member.full = True
                    store["full"][member.id] = member.soc
            self._log(
                "team_full",
                battery=current.ids[0],
                batteries=current.ids,
                soc=self._team_level(current),
            )
        if current is not None and seen["empty"] and not current.empty:
            held_back = False
            for member in current.members:
                if not member.empty:
                    member.empty = True
                    store["empty"][member.id] = member.soc
                    if member.soc >= member.empty_at + team_rules.HELD_ABOVE:
                        # Well above where it stops by itself: held back, it
                        # gets its turn again after a while.
                        held_back = True
                        stuck[member.id] = {
                            "at": now.isoformat(timespec="seconds"),
                            "soc": member.soc,
                        }
            self._log(
                "team_stuck" if held_back else "team_empty",
                battery=current.ids[0],
                batteries=current.ids,
                soc=self._team_level(current),
            )
        charge_order = team_rules.ordered(teams, self._team_charge_order(rules))
        discharge_order = team_rules.ordered(
            teams, rules.get("team_discharge_order") or []
        )
        chosen, why = team_rules.choose(charge_order, discharge_order, active, flow)
        group = next(g for g in teams if g.id == chosen)
        if chosen != active:
            if active is not None:
                previous = next((g for g in teams if g.id == active), None)
                if (
                    why == "empty"
                    and previous
                    and any(k in stuck for k in previous.ids)
                ):
                    # Not empty: it gave nothing (held back).
                    why = "stuck"
                self._log(
                    "team_handover",
                    battery=group.ids[0],
                    batteries=group.ids,
                    previous=previous.ids[0] if previous else active,
                    reason=why,
                    soc=(
                        round(
                            sum(m.soc for m in previous.members)
                            / len(previous.members),
                            1,
                        )
                        if previous
                        else None
                    ),
                )
            store.update(active=chosen, since=now.isoformat(timespec="seconds"))
            # Helping, charging along and what the meter showed count for the
            # group whose turn it was.
            store["along"], store["help"], store["quick"] = {}, {}, {}
            if store.get("along_on"):
                store["along_on"] = False
                self._log("team_along_end", reason="handover")
        # The panel names the group by its batteries (the first one leads).
        info["active"] = group.ids[0]
        info["active_group"] = chosen
        info["active_batteries"] = group.ids
        info["since"] = store["since"]
        for team_group in teams:
            info["groups"][team_group.id].update(
                empty=team_group.empty, full=team_group.full
            )
        style = team_day.style_of(rules)
        info["parallel"] = False
        info["along_plan"] = None
        grid = measurement_kw(
            self._hass.states.get, config["measurements"]["grid_power"]
        )
        # The later groups with room (charging along, the day's note) and
        # those not empty (helping, a base load), each in its own order.
        waiting = [g for g in charge_order if g.id != chosen and not g.full]
        givers = [g for g in discharge_order if g.id != chosen and not g.empty]
        # The next group charging along with a fixed power (its share of the
        # surplus by room), the active one regulating the rest: never two
        # systems regulating freely at one meter (see control/team_day.py).
        roles = {battery["id"]: role for battery, role in candidates}
        side, self._team_along_w = self._team_along(
            config, group, waiting, flow, deficit, grid, seen, roles, now, info
        )
        helping = self._team_help(
            group, givers, flow, deficit, grid, powers, give, style, seen, now, info
        )
        helpers: set[str] = set()
        why_helper = "helps"
        self._team_base_w = {}
        if helping and raw == "deficit":
            helpers = {k for g in givers for k in g.ids}
        elif style == "base" and flow == "deficit" and raw == "deficit":
            base = self._team_base(config, givers, give, groups, info)
            if base is not None:
                base_group, watts = base
                helpers = set(base_group.ids)
                why_helper = "base"
                self._team_base_w = dict.fromkeys(base_group.ids, watts)
        self._team_base_log(info)
        want: dict[str, tuple[bool, bool]] = {}
        for team_group in teams:
            for member in team_group.members:
                entry = info["batteries"][member.id]
                if team_group.id == chosen:
                    # While others help, the active one may not charge from
                    # them; while another charges along, not discharge into
                    # it; it is free otherwise.
                    want[member.id] = (bool(helpers), bool(side))
                    entry.update(
                        charge="blocked" if helpers else "free",
                        discharge="blocked" if side else "free",
                        why="active",
                    )
                elif member.id in side:
                    want[member.id] = (False, True)
                    entry.update(charge="free", discharge="blocked", why="along")
                elif member.id in helpers:
                    want[member.id] = (True, why_helper == "base")
                    entry.update(charge="blocked", discharge="free", why=why_helper)
                else:
                    want[member.id] = (True, True)
                    entry.update(charge="blocked", discharge="blocked")
                    if flow == "surplus":
                        entry["why"] = "full" if team_group.full else "waits_full"
                    else:
                        entry["why"] = "empty" if team_group.empty else "waits_empty"
                entry["empty"] = member.empty
                entry["full"] = member.full
        # The day so far is noted once the daytime cap had its say (see _team_note).
        self._team_pending = None
        if not info["dry"]:
            plan_from = (info.get("along_plan") or {}).get("from")
            self._team_pending = {
                "room": flow == "surplus" and bool(waiting),
                "along": bool(side),
                "planned": datetime.fromisoformat(plan_from) if plan_from else None,
                "export_kw": max(0.0, -(grid or 0.0)),
                "socs": {m.id: m.soc for m in members},
            }
        hint = {
            "active": chosen,
            "active_batteries": group.ids,
            # Those that wait (the active group's charging blocked while
            # another helps is not waiting: there is no sun to share then).
            "blocked": [
                k for k, (charge, _) in want.items() if charge and k not in group.ids
            ],
            "parallel": sorted(side),
            # Those whose discharging is blocked (the cap leaves it so).
            "no_discharge": [k for k, (_, discharge) in want.items() if discharge],
        }
        return want, hint

    def _team_note(self, now: datetime) -> None:
        """One minute of the day for the evening's look back: what went to the
        grid, and how much while a group waited with room – not while the
        daytime cap or the grid-friendly morning leave the sun to others on
        purpose (control/team_day.py)."""
        pending, self._team_pending = self._team_pending, None
        if pending is None:
            return
        store: dict[str, Any] = self.data["team"]
        today = dt_util.as_local(now).date().isoformat()
        held = bool(self.data["surplus"]["caps"]) or bool(self.data.get("day"))
        day = store.get("today")
        if not day or day.get("day") != today:
            day = store["today"] = team_day.fresh_day(today)
        team_day.note(
            day,
            now,
            pending["export_kw"],
            pending["room"] and not held,
            pending["along"],
            pending["planned"],
        )
        # The highest level of the day counts in the evening (not what the
        # house took since the sun went).
        top: dict[str, float] = day.setdefault("top", {})
        for key, soc in pending["socs"].items():
            if soc is not None:
                top[key] = max(top.get(key, soc), soc)

    def _team_along(
        self,
        config: dict[str, Any],
        active: team_rules.Group,
        waiting: list[team_rules.Group],
        flow: str | None,
        deficit: float | None,
        grid: float | None,
        seen: dict[str, bool],
        roles: dict[str, RoleAdapter | None],
        now: datetime,
        info: dict[str, Any],
    ) -> tuple[set[str], dict[str, float]]:
        """The next group charging along with a fixed power (see
        control/team_day.py): its batteries and the power (W) each one gets,
        its share of the surplus by room; nothing while it is off.

        Only a group whose charging power Joe can set (a forced-charge mode
        with a power, Fronius over Modbus with its reference), in surplus,
        while the active group is not full and nothing holds the surplus
        back on purpose (the daytime cap, the grid-friendly morning). The
        surplus is the lowest seen over the last two minutes (what all
        batteries take plus what goes to the grid). Once the house drew from
        the grid for a while (team.quick "import"), the power is cut by what
        was drawn and the cut holds for a while; below the least worth
        setting it ends.
        """
        store: dict[str, Any] = self.data["team"]
        along: dict[str, Any] = store["along"]
        held = bool(self.data["surplus"]["caps"]) or bool(self.data.get("day"))
        style = team_day.style_of(config["rules"])
        second = next(
            (
                g
                for g in waiting
                if g.room >= team_rules.WORTH_KWH
                and all(
                    roles.get(k) is not None and roles[k].along_lever() for k in g.ids
                )
            ),
            None,
        )
        can = (
            style != "strict"
            and flow == "surplus"
            and second is not None
            and not active.full
            and not held
            and deficit is not None
        )
        samples = [v for _, v in self._team_surplus]
        covered = bool(samples) and now - self._team_surplus[0][0] >= timedelta(
            seconds=60
        )
        surplus = min(samples) if covered else max(0.0, -(deficit or 0.0))
        was = bool(store.get("along_on"))
        on = team_day.along_step(along, can, surplus, now)
        watts: dict[str, float] = {}
        ended = None
        if on:
            assert second is not None
            kw = team_day.along_power(surplus, active.room, second.room, second.max_kw)
            current = along.get("kw")
            cap_at = along.get("cap_at")
            if cap_at and now - _at(cap_at) < team_day.ALONG_HOLD:
                # A cut holds for a while, whatever the sun does meanwhile.
                kw = min(kw, float(along.get("cap") or 0.0))
            cut_to_zero = False
            if seen["import"] and current:
                cut = team_day.along_cut(current, max(0.0, (grid or 0.0) * 1000))
                if cut < kw:
                    kw = cut
                    cut_to_zero = kw <= 0
                    along.update(cap=kw, cap_at=now.isoformat(timespec="seconds"))
                    # The next cut needs the house drawing for a while again:
                    # the meter gets its time to settle after this one.
                    store["quick"].pop("import", None)
                    if kw > 0:
                        self._log(
                            "team_along_cut",
                            battery=active.ids[0],
                            batteries=second.ids,
                            power=round(kw * 1000),
                        )
            if cut_to_zero:
                team_day.along_end(along, now)
                on = False
                ended = "import"
            else:
                # Little sun for a moment: the least worth setting, until the
                # surplus stayed low for a while (then the phase ends).
                kw = max(kw, team_day.ALONG_MIN_KW)
                if (
                    current is None
                    or abs(kw - current) >= team_day.ALONG_CHANGE_KW - 1e-9
                ):
                    along["kw"] = kw
                kw = float(along["kw"])
                rooms = {m.id: m.room for m in second.members}
                total = sum(rooms.values()) or 1.0
                watts = {k: round(kw * 1000 * r / total) for k, r in rooms.items()}
        if on and not was:
            assert second is not None
            self._log(
                "team_along",
                reason="fixed",
                battery=active.ids[0],
                batteries=second.ids,
                power=round(float(along["kw"]) * 1000),
            )
        elif was and not on:
            if ended is None:
                ended = (
                    "flow"
                    if flow != "surplus"
                    else "held"
                    if held
                    else "full"
                    if second is None
                    else "less"
                )
            self._log("team_along_end", reason=ended)
        store["along_on"] = on
        info["along"] = "fixed" if on else None
        info["along_w"] = watts
        return (set(watts) if on else set()), watts

    def _team_help(
        self,
        active: team_rules.Group,
        givers: list[team_rules.Group],
        flow: str | None,
        deficit: float | None,
        grid: float | None,
        powers: dict[str, float],
        give: dict[str, float],
        style: str,
        seen: dict[str, bool],
        now: datetime,
        info: dict[str, Any],
    ) -> bool:
        """Whether the next groups help discharging: the house drew from the
        grid for a while although the active group gives (see
        control/team_day.py and team.quick); not in "Nur nacheinander"."""
        store: dict[str, Any] = self.data["team"]
        can = (
            style != "strict"
            and flow == "deficit"
            and bool(givers)
            and not active.empty
            and deficit is not None
            and grid is not None
            and all(k in powers for k in active.ids)
        )
        before = bool(store["help"].get("on"))
        on = team_day.help_step(
            store["help"],
            can,
            seen["import"],
            seen["calm"],
            max(0.0, deficit or 0.0),
            sum(give.get(k, 0.0) for k in active.ids),
            now,
        )
        if on != before:
            self._log(
                "team_help" if on else "team_help_end",
                battery=active.ids[0],
                batteries=[k for g in givers for k in g.ids],
                power=round(max(0.0, deficit or 0.0), 1),
            )
        info["help"] = on
        return on

    def _team_base(
        self,
        config: dict[str, Any],
        givers: list[team_rules.Group],
        give: dict[str, float],
        groups: dict[str, tuple[str, str, bool]],
        info: dict[str, Any],
    ) -> tuple[team_rules.Group, float] | None:
        """ "Grundlast teilen": the first group (in the discharge order) whose
        discharge power Joe can set gives the house's base load, the rest
        comes from the active one. None while there is none or no base."""
        batteries = {b["id"]: b for b in config["batteries"]}
        keys = {k: v[0] for k, v in groups.items()}
        for candidate in givers:
            if self._team_base_lever(config, candidate.ids, batteries, keys) is None:
                continue
            cap_w = sum(give.get(k, 0.0) for k in candidate.ids) * 1000
            now = dt_util.now()
            team_day.trim(self._team_samples, now)
            watts = team_day.base_w([w for _, w in self._team_samples], cap_w)
            if watts <= 0:
                return None
            info["base"] = {"w": watts, "batteries": candidate.ids}
            return candidate, watts
        info["base_problem"] = "no_power_lever" if givers else None
        return None

    def _team_base_lever(
        self,
        config: dict[str, Any],
        ids: list[str],
        batteries: dict[str, dict[str, Any]],
        keys: dict[str, str],
    ) -> tuple[str, str] | None:
        """The one discharge limit (in W or kW) of a group Joe can set a power
        with: its entity and unit; None if it has none (only switches, a
        limit in %) or several."""
        found: set[tuple[str, str]] = set()
        for key in ids:
            adapter = make_adapter(batteries[key])
            if not isinstance(adapter, RoleAdapter):
                return None
            whole = self._whole_system(config, keys, batteries[key], adapter)
            roles = adapter.discharge_roles()
            # Only where the block itself is the discharge limit (not a
            # switch, not a mode: the limit would not be written then).
            if adapter.team_lever(whole) not in ("limit", "system") or roles is None:
                return None
            entity_id = adapter.controls.get(roles[1])
            state = self._hass.states.get(entity_id or "")
            unit = state.attributes.get("unit_of_measurement") if state else None
            if not entity_id or unit not in ("W", "kW"):
                return None
            found.add((entity_id, unit))
        return next(iter(found)) if len(found) == 1 else None

    def _team_base_log(self, info: dict[str, Any]) -> None:
        """A base load begins or ends (not every step of it)."""
        store: dict[str, Any] = self.data["team"]
        base = info.get("base") if self._team_base_w else None
        before = store.get("base")
        if bool(base) != bool(before):
            if base:
                self._log("team_base", batteries=base["batteries"], power=base["w"])
            else:
                self._log("team_base_end", batteries=(before or {}).get("batteries"))
        store["base"] = deepcopy(base)
        if not self._team_base_w:
            info["base"] = None

    def _team_peaks(self, powers: dict[str, float]) -> None:
        """The most each battery takes and gives for a while (W)."""
        store: dict[str, Any] = self.data["team"]
        peaks: dict[str, dict[str, float]] = store.setdefault("peaks", {})
        for key, power in powers.items():
            before = self._team_prev.get(key)
            side = "charge" if power > 0 else "discharge"
            seen = peaks.get(key, {}).get(side)
            found = team_day.peak(seen, power, before)
            if found is not None and found != seen:
                peaks.setdefault(key, {})[side] = found
        self._team_prev = dict(powers)

    def _team_sample(
        self, config: dict[str, Any], powers: dict[str, float], now: datetime
    ) -> None:
        """The house's need right now (W), every few seconds, for a base load."""
        if team_day.style_of(config["rules"]) != "base":
            self._team_samples = []
            return
        deficit = self._team_deficit(config, powers)
        if deficit is None:
            return
        self._team_samples.append((now, deficit * 1000))
        team_day.trim(self._team_samples, now)

    def _team_surplus_sample(
        self, config: dict[str, Any], powers: dict[str, float], now: datetime
    ) -> None:
        """The surplus right now (kW: what the batteries take plus what goes
        to the grid), every few seconds, for charging along with a fixed
        power (its lowest value over team_day.ALONG_SPAN counts)."""
        deficit = self._team_deficit(config, powers)
        if deficit is None:
            return
        self._team_surplus.append((now, -deficit))
        while (
            self._team_surplus and now - self._team_surplus[0][0] > team_day.ALONG_SPAN
        ):
            self._team_surplus.pop(0)

    def _team_review(
        self,
        config: dict[str, Any],
        info: dict[str, Any],
        groups: dict[str, tuple[str, str, bool]],
        now: datetime,
    ) -> None:
        """Once a day after sunset: the day in short, the lead learned from it,
        and what Joe asks (see control/team_day.py)."""
        store: dict[str, Any] = self.data["team"]
        local = dt_util.as_local(now)
        today = local.date().isoformat()
        day = store.get("today")
        if day and day.get("day") != today:
            # A day not looked back on (Home Assistant was off): it tells too little.
            store["today"] = day = None
        if day and store.get("reviewed") != today and self._team_evening(local):
            members: dict[str, list[str]] = {}
            for key, entry in info["batteries"].items():
                if entry.get("self_regulating"):
                    members.setdefault(groups[key][0], []).append(key)
            summary = team_day.review(
                day,
                [
                    {
                        "batteries": ids,
                        "socs": {
                            k: (day.get("top") or {}).get(
                                k, info["batteries"][k]["soc"]
                            )
                            for k in ids
                        },
                    }
                    for ids in members.values()
                ],
            )
            store["reviewed"] = today
            lead = team_day.learn(store.get("lead"), summary)
            summary["lead_min"] = lead.get("minutes")
            store["lead"] = lead
            reviews: list[dict[str, Any]] = store.setdefault("reviews", [])
            reviews.append(summary)
            del reviews[: -team_day.KEEP_REVIEWS]
            self._log(
                "team_review",
                energy=summary["room_kwh"],
                batteries=(summary["short"] or {}).get("batteries"),
                soc=(summary["short"] or {}).get("soc"),
                value=lead.get("minutes"),
            )
            info["learned"] = deepcopy(lead)
            info["review"] = deepcopy(summary)
        # Nothing to ask: charging along goes by the meter now, with a fixed
        # power (see _team_along); there is no lead to learn.
        info["suggest"] = None

    def _team_evening(self, local: datetime) -> bool:
        """After sunset (half an hour), at 22:00 at the latest."""
        if local.hour >= 22:
            return True
        if local.hour < 16:
            return False
        try:
            sunset = get_astral_event_date(self._hass, SUN_EVENT_SUNSET, local.date())
        except Exception:  # noqa: BLE001 - no place known: 22:00 it is
            sunset = None
        return sunset is not None and local >= sunset + timedelta(minutes=30)

    def _team_flow(
        self, deficit: float | None, now: datetime
    ) -> tuple[str | None, str | None]:
        """The flow Joe goes by (once seen for a while) and the flow seen right now."""
        store: dict[str, Any] = self.data["team"]
        raw = None
        if deficit is not None:
            if deficit > team_rules.FLOW_KW:
                raw = "deficit"
            elif deficit < -team_rules.FLOW_KW:
                raw = "surplus"
        stamp = now.isoformat(timespec="seconds")
        if raw is not None:
            if store["raw"] != raw or not store["raw_since"]:
                store.update(raw=raw, raw_since=stamp)
            dwell = team_rules.FLOW_DWELL if store["flow"] else timedelta(0)
            if (
                raw != store["flow"]
                and now - datetime.fromisoformat(store["raw_since"]) >= dwell
            ):
                store.update(flow=raw, flow_since=stamp)
        return store["flow"], raw

    def _team_seen(
        self,
        current: team_rules.Group | None,
        powers: dict[str, float],
        deficit: float | None,
        now: datetime,
    ) -> dict[str, bool]:
        """What the meter showed about the active group for a while (see
        team.quick): the timers live in the team's store, advanced here and
        every few seconds by _team_quick."""
        store: dict[str, Any] = self.data["team"]
        grid = measurement_kw(
            self._hass.states.get, self._config()["measurements"]["grid_power"]
        )
        if (
            current is None
            or deficit is None
            or grid is None
            or any(k not in powers for k in current.ids)
        ):
            return team_rules.quick(store["quick"], None, None, None, now)
        power = sum(powers[k] for k in current.ids)
        found = team_rules.quick(
            store["quick"], power, deficit * 1000, grid * 1000, now
        )
        touched = store.get("touched") or {}
        blocks = store.get("blocks") or {}
        # Joe just changed its levers: the meter says nothing about the
        # battery yet (the grid timers keep running).
        fresh = any(
            k in touched and now - _at(touched[k]) < team_rules.TOUCH_GRACE
            for k in current.ids
        )
        # A direction Joe holds back himself says nothing about full or empty.
        for key, direction in (("full", "charge"), ("empty", "discharge")):
            if fresh or any((blocks.get(k) or {}).get(direction) for k in current.ids):
                store["quick"].pop(key, None)
                found[key] = False
        return found

    @staticmethod
    def _team_level(group: team_rules.Group) -> float:
        """The group's level (its batteries' mean, %)."""
        return round(sum(m.soc for m in group.members) / len(group.members), 1)

    def _team_quick(
        self, config: dict[str, Any], powers: dict[str, float], now: datetime
    ) -> None:
        """Every few seconds (the watchdog's tick): advance the meter's timers
        for the active group and, once they say something new (empty, full,
        a helper due or done), check at once instead of at the next minute."""
        if self.team.get("state") != "on" or self.team.get("dry"):
            self._team_quick_seen = None
            return
        store: dict[str, Any] = self.data["team"]
        ids = self.team.get("active_batteries") or []
        if not ids or any(k not in powers for k in ids):
            return
        deficit = self._team_deficit(config, powers)
        grid = measurement_kw(
            self._hass.states.get, config["measurements"]["grid_power"]
        )
        if deficit is None or grid is None:
            return
        seen = team_rules.quick(
            store["quick"],
            sum(powers[k] for k in ids),
            deficit * 1000,
            grid * 1000,
            now,
        )
        flags = tuple(sorted(k for k, v in seen.items() if v))
        if flags != self._team_quick_seen:
            self._team_quick_seen = flags
            if flags and not self._lock.locked():
                self._hass.async_create_task(self.async_check(), eager_start=False)

    def _team_deficit(
        self, config: dict[str, Any], powers: dict[str, float]
    ) -> float | None:
        """What the house needs on top of the sun (kW; negative: it gives).

        From the grid meter and the batteries: what comes from the grid plus
        what the batteries give.
        """
        grid = measurement_kw(
            self._hass.states.get, config["measurements"]["grid_power"]
        )
        if grid is None:
            return None
        return grid - sum(powers.values()) / 1000

    def _team_learn(
        self,
        candidates: list[tuple[dict[str, Any], RoleAdapter | None]],
        powers: dict[str, float],
        deficit: float | None,
        now: datetime,
    ) -> None:
        """Watch for the level each battery really stops discharging at."""
        store: dict[str, Any] = self.data["team"]
        if deficit is None:
            return
        for battery, _ in candidates:
            key = battery["id"]
            power = powers.get(key)
            soc = number(self._hass.states.get(battery["soc_entity"]))
            if power is None or soc is None:
                continue
            blocked = (store["blocks"].get(key) or {}).get("discharge", False)
            watch = store["watch"].setdefault(key, {})
            found = team_rules.watch_cutoff(
                watch, soc, power, deficit * 1000, not blocked, now
            )
            if found is None:
                continue
            seen: list[float] = store["cutoffs"].setdefault(key, [])
            seen.append(found)
            del seen[: -team_rules.KEEP]
            store["empty"][key] = found
            value = team_rules.learned(seen)
            self._log("team_cutoff", battery=key, soc=found, value=value)
            known = battery.get("cutoff_soc")
            if (
                value is not None
                and self.on_cutoff
                and (known is None or abs(known - value) >= 0.2)
            ):
                self.on_cutoff(key, value)

    async def _async_team_apply(
        self,
        config: dict[str, Any],
        want: dict[str, tuple[bool, bool]],
        taken: set[str],
        now: datetime,
    ) -> set[str]:
        """Write the blocks (live only); give back what is free again.

        A charge limit someone else holds right now (the daytime cap, the
        grid-friendly morning, a test limit) stays theirs while it blocks
        charging, too; one that lets a waiting battery charge does not count:
        Joe blocks it all the same (it would charge from the group that
        discharges). Returns the entities (and batteries) to leave as they are.
        """
        store: dict[str, Any] = self.data["team"]
        if self.team.get("state") == "bridging":
            # A value missing for a moment: the blocks stay, nothing new.
            self._team_publish()
            return self._team_held(config)
        if not want or self.team.get("state") != "on" or self.team.get("dry"):
            reason = "dry" if self.team.get("dry") else self.team.get("state")
            await self._async_team_off(config, now, reason or "off")
            self._team_publish()
            return set()
        keep: set[str] = set()
        batteries = {b["id"]: b for b in config["batteries"]}
        groups = {k: v[0] for k, v in self._team_groups(config).items()}
        broken: list[tuple[str, str, str]] = []
        # Whose turn it is, for the logbook.
        leader = (batteries.get(self.team.get("active") or "") or {}).get("name", "")

        def adds(item: tuple[str, tuple[bool, bool]]) -> int:
            """Blocks first, then what is freed: never a moment in which one
            may charge while another may discharge."""
            before = store["blocks"].get(item[0]) or {}
            charge, discharge = item[1]
            more = (charge and not before.get("charge")) or (
                discharge and not before.get("discharge")
            )
            return 0 if more else 1

        for key, (charge, discharge) in sorted(want.items(), key=adds):
            adapter = make_adapter(batteries[key])
            assert isinstance(adapter, RoleAdapter)
            whole = self._whole_system(config, groups, batteries[key], adapter)
            charge_taken = any(e in taken for e in adapter.team_charge_entities(whole))
            if charge and charge_taken and not adapter.charge_blocked(self._hass):
                # Someone else's limit lets it charge while it waits: blocked.
                charge_taken = False
                self._log("team_taken", battery=key)
            writes, give_back = adapter.team_block(
                self._hass, charge, discharge, charge_taken, whole, self.data["saved"]
            )
            base = self._team_base_w.get(key)
            if base is not None and discharge:
                # A base load: the discharge limit at that power instead of 0.
                writes = self._team_base_writes(adapter, whole, writes, base)
            along = self._team_along_w.get(key)
            note = self._note("team", name=leader)
            if along is not None and discharge and not charge:
                # Charging along: the fixed power with the block of discharging.
                writes = adapter.team_along(self._hass, writes, along)
                note = self._note(
                    "team_along", name=batteries[key]["name"], watts=round(along)
                )
            elif (store["blocks"].get(key) or {}).get("along_w") is not None:
                # Charging along is over: its mode off before the block.
                writes = [*adapter.team_along_exit(self._hass), *writes]
            problem = None
            # A block that had arrived and is undone (Fronius sets its
            # registers back when its Modbus control restarts): written again
            # at once; too often, and Joe cannot rely on it.
            if self._team_undone(adapter, whole, now):
                resets = store["resets"].setdefault(key, [])
                resets.append(now.isoformat(timespec="seconds"))
                resets[:] = [
                    r for r in resets if now - datetime.fromisoformat(r) < TEAM_BROKEN
                ]
                if len(resets) >= TEAM_RESETS:
                    problem = "reset"
            if writes and problem is None:
                problem = await self._async_write(adapter, writes, now, "team", note)
            if give_back or adapter.own_entities(*BLOCK_OPERATIONS):
                # Within one battery, too: its new block first, then what is
                # free (what own steps of another block wrote, too).
                await self._async_team_free(
                    adapter, give_back, now, {w.entity_id for w in writes}
                )
            if writes:
                keep |= {w.entity_id for w in writes} | {key}
            if problem is None and not self._team_effective(
                adapter,
                whole,
                charge and not charge_taken,
                discharge and base is None and along is None,
                now,
            ):
                # Each value may show what Joe wrote, the block counts only
                # with both: the limit at 0 and its switch on.
                problem = "not_effective"
            entry = self.team["batteries"][key]
            entry["problem"] = problem
            if problem:
                broken.append((key, groups[key], problem))
            blocks: dict[str, Any] = {
                "charge": charge and not charge_taken,
                "discharge": discharge and base is None,
            }
            if base is not None and discharge:
                blocks["base_w"] = base
            if along is not None and discharge:
                blocks["along_w"] = along
            if charge and charge_taken:
                # Blocked all the same, by the limit someone else holds at 0.
                entry["charge"] = "blocked"
            shown = {k: v for k, v in blocks.items() if k in ("charge", "discharge")}
            if {
                k: v
                for k, v in store["blocks"]
                .get(key, {"charge": False, "discharge": False})
                .items()
                if k in ("charge", "discharge")
            } != shown:
                self._log("team_block", battery=key, **shown)
                store.setdefault("touched", {})[key] = now.isoformat(timespec="seconds")
            if any(blocks.values()):
                store["blocks"][key] = blocks
            else:
                store["blocks"].pop(key, None)
        # Batteries no longer in the team (no longer regulating themselves).
        for key in [k for k in store["blocks"] if k not in want]:
            await self._async_team_release(config, key, now)
        if broken:
            await self._async_team_broken(config, broken, set(want), now)
            self._team_publish()
            return set()
        self._team_publish()
        return keep

    def _team_base_writes(
        self, adapter: RoleAdapter, whole: bool, writes: list[Write], watts: float
    ) -> list[Write]:
        """The block's writes with the discharge limit at the base load (in
        the limit's unit) instead of 0: never below the limit's smallest
        power (VARTA would not take it), below 0 where the limit runs so
        (VARTA's discharge limit runs from -4000 to 0)."""
        config = self._config()
        keys = {k: v[0] for k, v in self._team_groups(config).items()}
        lever = self._team_base_lever(
            config,
            [adapter.battery["id"]],
            {adapter.battery["id"]: adapter.battery},
            keys,
        )
        roles = adapter.discharge_roles()
        if lever is None or roles is None:
            return writes
        entity_id, unit = lever
        watts = max(watts, adapter.profile.limit_min_w)
        state = self._hass.states.get(entity_id)
        low, high = (state.attributes.get(k) if state else None for k in ("min", "max"))
        if (
            isinstance(low, int | float)
            and isinstance(high, int | float)
            and high <= 0 < -low
        ):
            watts = -watts
        value = round(watts / 1000, 3) if unit == "kW" else round(watts)
        return [
            Write(w.entity_id, value) if w.entity_id == entity_id else w for w in writes
        ]

    def _team_undone(self, adapter: RoleAdapter, whole: bool, now: datetime) -> bool:
        """Blocks of this battery that had arrived and show something else now:
        made to be written again at once (not someone else's change – while
        Joe coordinates, no automation writes to these batteries)."""
        written: dict[str, Any] = self.data["written"]
        external: list[str] = self.data["external"]
        undone = []
        for entity_id in adapter.team_entities(whole):
            entry = written.get(entity_id)
            if not entry or not (entry.get("confirmed") or entity_id in external):
                continue
            if matches(self._hass, Write(entity_id, entry["value"])):
                continue
            undone.append(entity_id)
            entry["confirmed"] = False
            entry["at"] = (now - RETRY).isoformat(timespec="seconds")
            if entity_id in external:
                external.remove(entity_id)
        if undone:
            self._log("team_reset", battery=adapter.battery["id"], entities=undone)
        return bool(undone)

    def _team_effective(
        self,
        adapter: RoleAdapter,
        whole: bool,
        charge: bool,
        discharge: bool,
        now: datetime,
    ) -> bool:
        """Whether the blocks are in force, read back once Joe's last write of
        them had time to show (SETTLE)."""
        written: dict[str, Any] = self.data["written"]
        times = [
            datetime.fromisoformat(written[e]["at"])
            for e in adapter.team_entities(whole)
            if e in written
        ]
        if not times or now - max(times) < SETTLE:
            return True
        if charge and not adapter.charge_blocked(self._hass):
            return False
        return not (discharge and not adapter.discharge_blocked(self._hass))

    async def _async_team_broken(
        self,
        config: dict[str, Any],
        broken: list[tuple[str, str, str]],
        ids: set[str],
        now: datetime,
    ) -> None:
        """A block did not arrive (read back after SETTLE) or could not be
        written: Joe cannot coordinate this group. Every block back; an hour
        later (the second time that day: the next day) he tries again."""
        store: dict[str, Any] = self.data["team"]
        today = dt_util.as_local(now).date().isoformat()
        for key, group, problem in broken:
            before = store["broken"].get(group)
            count = (before or {}).get("count", 0) + 1 if before else 1
            store["broken"][group] = {
                "problem": problem,
                "battery": key,
                "day": today,
                "until": (now + TEAM_BROKEN).isoformat(timespec="seconds"),
                "count": count,
            }
            self._log("team_broken", battery=key, problem=problem, count=count)
        self.team["state"] = "not_taken"
        await self._async_team_off(config, now, "not_taken")

    async def _async_team_off(
        self, config: dict[str, Any], now: datetime, reason: str
    ) -> None:
        """Every block back as it was (a charge limit held by a daytime cap or
        the morning stays theirs; the release puts it back after them)."""
        store: dict[str, Any] = self.data["team"]
        if not store["blocks"]:
            return
        for key in list(store["blocks"]):
            await self._async_team_release(config, key, now)
        self._log("team_end", reason=reason)

    async def _async_team_release(
        self, config: dict[str, Any], key: str, now: datetime
    ) -> None:
        """One battery's blocks back (a battery that is gone: the release does it)."""
        store: dict[str, Any] = self.data["team"]
        battery = next((b for b in config["batteries"] if b["id"] == key), None)
        adapter = make_adapter(battery) if battery else None
        if isinstance(adapter, RoleAdapter):
            if (store["blocks"].get(key) or {}).get("along_w") is not None and (
                leave := adapter.team_along_exit(self._hass)
            ):
                # Charging along with a fixed power: its mode off first.
                await self._async_write(adapter, leave, now, "team_back")
            roles = adapter.team_release_roles()
            if key in self.data["surplus"]["caps"] or self._day_holds(key):
                # The cap or the morning holds the charge limit (with the
                # system's shared switch all of it): theirs to give back.
                held = set(adapter.limit_roles() or ())
                if adapter.limit_shared():
                    held |= set(adapter.discharge_roles() or ())
                roles = [r for r in roles if r not in held]
            await self._async_team_free(adapter, roles, now)
            self._log("team_block", battery=key, charge=False, discharge=False)
        store["blocks"].pop(key, None)

    async def _async_team_free(
        self,
        adapter: RoleAdapter,
        roles: list[str],
        now: datetime,
        keep: set[str] | None = None,
    ) -> None:
        """These levers back as they were (what an automation set meanwhile
        stays), and what the owner's own block steps wrote (but for `keep`,
        what the current block writes); what is back is no longer Joe's to
        restore."""
        keep = keep or set()
        entities = [adapter.controls[r] for r in roles if r in adapter.controls]
        entities += [
            e for e in adapter.own_entities(*BLOCK_OPERATIONS) if e not in keep
        ]
        saved: dict[str, Any] = self.data["saved"]
        if not any(e in saved for e in entities):
            return
        self._drop_foreign(entities)
        writes = adapter.team_free(saved, roles) + adapter.own_free(saved, keep)
        if writes:
            await self._async_write(adapter, writes, now, "team_back")
        for entity_id in entities:
            if entity_id in saved and matches(
                self._hass, fit(self._hass, Write(entity_id, saved[entity_id]))
            ):
                saved.pop(entity_id, None)
                self.data["written"].pop(entity_id, None)
        if not any(e in saved for e in adapter.entities()):
            key = adapter.battery["id"]
            self.data["active"] = [k for k in self.data["active"] if k != key]

    # --- the watchdog: batteries running against each other -------------------

    @callback
    def _on_guard_tick(self, now: datetime) -> None:
        self._hass.async_create_task(self.async_guard(), eager_start=False)

    async def async_guard(self) -> None:
        """One look of the watchdog (every few seconds, see control/guard.py)."""
        if self.testing or self.probe_running:
            return
        try:
            await self._async_guard(dt_util.now())
        except Exception:
            _LOGGER.exception("The watchdog failed")
            # Never leave a switch of the watchdog as it is.
            async with self._lock:
                await self._async_guard_restore("error")

    async def _async_guard(self, now: datetime) -> None:
        """Two batteries running against each other: step in by stages.

        Runs whenever at least two batteries have a power meter, with or
        without "Nacheinander". Writes only live; the simulation and
        "suggest" log what Joe would do. During the night's plan Joe steers
        the batteries himself (and blocks the others while one charges from
        the grid): then he only notes it. An automation that writes the same
        levers (the owner's own watchdog) keeps his hands off. Inside one
        group (batteries one system regulates) he only notes it and speaks up.
        """
        config, mode = self._config(), self._mode()
        store: dict[str, Any] = self.data["guard"]
        powers: dict[str, float] = {}
        for battery in config["batteries"]:
            power = _charge_w(self._hass, battery)
            if power is not None:
                powers[battery["id"]] = power
        self._team_sample(config, powers, now)
        self._team_surplus_sample(config, powers, now)
        self._team_quick(config, powers, now)
        state = "on"
        if not config["rules"].get("transfer_guard", True):
            state = "off"
        elif mode == "off":
            state = "mode_off"
        elif len(powers) < 2:
            state = "single"
        dry = mode != "live"
        if store["held"]:
            # Left over (a failed write, a mode change): back first.
            async with self._lock:
                await self._async_guard_restore("retry" if state == "on" else state)
        if state != "on":
            if store["since"] is not None:
                store.update(since=None, stage=0, stage_at=None, noted=None)
            self._guard_publish(config, state, dry, False, now)
            return
        charging, discharging = guard_rules.opposite(powers)
        running = bool(charging)
        since, stage = store["since"], store["stage"]
        due = guard_rules.step(store, running, now)
        if due == "fixed":
            await self._async_guard_fixed(store, since, stage, now)
        elif due is not None and due != "ended":
            async with self._lock:
                await self._async_guard_stage(
                    config, store, int(due[-1]), charging, discharging, dry, now
                )
        self._guard_publish(config, state, dry, running, now)

    async def _async_guard_stage(
        self,
        config: dict[str, Any],
        store: dict[str, Any],
        stage: int,
        charging: list[str],
        discharging: list[str],
        dry: bool,
        now: datetime,
    ) -> None:
        """Step in: restart the battery's own control, block its direction for
        a few seconds or speak up; a stage it has no lever for is skipped."""
        batteries = {b["id"]: b for b in config["batteries"]}
        if store["battery"] not in (*charging, *discharging):
            store["battery"] = guard_rules.cause(
                list(batteries),
                charging,
                discharging,
                self._guard_levers(config),
                self.team.get("active_batteries") or self.data["team"]["active"],
            )
        key = store["battery"]
        adapter = make_adapter(batteries[key])
        role = adapter if isinstance(adapter, RoleAdapter) else None
        direction = "charge" if key in charging else "discharge"
        detail = {"battery": key, "charging": charging, "discharging": discharging}
        if self.status.get("reason") == "steering" or self._guard_joe_holds(role):
            # Joe's own command (the night, charging by hand): not fought.
            if store["noted"] != "joe":
                store["noted"] = "joe"
                self._log("guard_joe", **detail)
                self._guard_last(store, now, 0, "joe", detail, dry, direction)
                await self._async_save()
            return
        groups = {k: v[0] for k, v in self._team_groups(config).items()}
        if team_rules.transfer_inside(charging, discharging, groups):
            # Its own system shares the power wrongly: not Joe's to fight.
            await self._async_guard_inside(
                store, stage, charging, discharging, detail, dry, direction, now
            )
            return
        store["handed"] = None
        store["noted"] = None
        group = self._guard_group(config, groups, key)
        if stage == 1 and not (role and role.guard_can_restart()):
            stage = 2
        if stage == 2 and not any(
            adapter.guard_can_block(direction, whole) for adapter, whole in group
        ):
            stage = 3
        # Levers that write to flash (Victron's settings): at most every gap.
        gap = max(
            (adapter.guard_flash_gap(direction, whole) for adapter, whole in group),
            default=0.0,
        )
        flash_at = store.get("flash_at")
        if (
            stage == 2
            and gap
            and flash_at
            and (now - datetime.fromisoformat(flash_at)).total_seconds() < gap
        ):
            self._log("guard_flash", **detail)
            stage = 3
        problem: str | None = None
        if stage == 1:
            assert role is not None
            clean, problem = await self._async_guard_restart(role, dry)
            self._log("guard_restart", clean=clean, dry=dry, problem=problem, **detail)
        elif stage == 2:
            problem = await self._async_guard_block(group, direction, dry)
            if gap and not dry:
                store["flash_at"] = now.isoformat(timespec="seconds")
            self._log(
                "guard_block", direction=direction, dry=dry, problem=problem, **detail
            )
        else:
            self._log("guard_alarm", dry=dry, **detail)
            if not dry and self.notifier and guard_rules.may_tell(store, now):
                store["told"] = now.isoformat(timespec="seconds")
                names_of = {k: b["name"] for k, b in batteries.items()}
                await self.notifier.async_problem(
                    "battery_transfer",
                    charging=", ".join(names_of.get(k, k) for k in charging),
                    discharging=", ".join(names_of.get(k, k) for k in discharging),
                )
        after = dt_util.now()
        guard_rules.done(store, stage, after)
        self._guard_last(
            store,
            after,
            stage,
            "alarm" if stage == 3 else "running",
            detail,
            dry,
            direction,
        )
        await self._async_save()

    async def _async_guard_fixed(
        self, store: dict[str, Any], since: str | None, stage: int, now: datetime
    ) -> None:
        """It stopped after Joe stepped in: "Behoben nach …"."""
        seconds = guard_rules.seconds_since(since, now)
        last = store["last"] or {}
        self._log(
            "guard_fixed",
            battery=store["battery"],
            stage=stage,
            seconds=seconds,
            dry=bool(last.get("dry")),
        )
        inside = last.get("result") == "inside"
        if last.get("since") == since:
            last.update(
                result="inside" if inside else "fixed",
                at=now.isoformat(timespec="seconds"),
                seconds=seconds,
            )
            if inside:
                last["over"] = True
        if stage >= 3 and self.notifier:
            await self.notifier.async_clear(
                "battery_transfer_inside" if inside else "battery_transfer"
            )
        store["battery"] = None
        await self._async_save()

    def _guard_last(
        self,
        store: dict[str, Any],
        now: datetime,
        stage: int,
        result: str,
        detail: dict[str, Any],
        dry: bool,
        direction: str,
    ) -> None:
        """The last time it happened, for the panel."""
        store["last"] = {
            **detail,
            "since": store["since"],
            "at": now.isoformat(timespec="seconds"),
            "stage": stage,
            "result": result,
            "dry": dry,
            "direction": direction,
            "seconds": guard_rules.seconds_since(store["since"], now),
        }

    async def _async_guard_restart(
        self, role: RoleAdapter, dry: bool
    ) -> tuple[bool, str | None]:
        """Stage 1: the battery's own control starts again. Returns whether a
        manual mode held by something else was ended cleanly, and a problem.

        Manual mode off: on for a moment and off again (a restart of
        Omnibattery's PD controller). Manual mode on (a forced charge or
        discharge of something else): force mode "None", the setpoints 0,
        manual mode off, a second between them; that is no value of Joe's
        to put back.
        """
        clean = any(read(self._hass, e) is True for e in role.guard_manual())
        if dry:
            return clean, None
        if clean:
            for write in role.guard_exit(self._hass):
                try:
                    await async_apply(
                        self._hass, write, self._note("guard", stage=1), self.language()
                    )
                except WriteError as err:
                    return True, err.code
                await joe_writes.settle(max(write.pause, guard_rules.PACE_S))
            return True, None
        manual = role.controls["system_manual_mode"]
        problem = await self._async_guard_hold([Write(manual, True)], 1)
        if problem is None:
            await joe_writes.settle(guard_rules.PULSE_S)
        failed = await self._async_guard_restore("done")
        return False, problem or ("restore" if failed else None)

    async def _async_guard_inside(
        self,
        store: dict[str, Any],
        stage: int,
        charging: list[str],
        discharging: list[str],
        detail: dict[str, Any],
        dry: bool,
        direction: str,
        now: datetime,
    ) -> None:
        """Batteries of one group charge each other: noted once per time and
        told (at most once per COOLDOWN), no stage of Joe's."""
        guard_rules.done(store, 3, now)
        if store["noted"] == "inside":
            return
        store["noted"] = "inside"
        self._log("guard_inside", dry=dry, **detail)
        self._guard_last(store, now, 0, "inside", detail, dry, direction)
        if not dry and self.notifier and guard_rules.may_tell(store, now):
            store["told"] = now.isoformat(timespec="seconds")
            names = {b["id"]: b["name"] for b in self._config()["batteries"]}
            await self.notifier.async_problem(
                "battery_transfer_inside",
                charging=", ".join(names.get(k, k) for k in charging),
                discharging=", ".join(names.get(k, k) for k in discharging),
            )
        await self._async_save()

    def _guard_group(
        self, config: dict[str, Any], groups: dict[str, str], key: str
    ) -> list[tuple[RoleAdapter, bool]]:
        """The batteries of a battery's group with their adapter, and whether
        the system's limits may block them (the same levers as "Nacheinander")."""
        result = []
        for battery in config["batteries"]:
            if groups.get(battery["id"]) != groups.get(key):
                continue
            adapter = make_adapter(battery)
            if isinstance(adapter, RoleAdapter):
                whole = self._whole_system(config, groups, battery, adapter)
                result.append((adapter, whole))
        return result

    async def _async_guard_block(
        self, group: list[tuple[RoleAdapter, bool]], direction: str, dry: bool
    ) -> str | None:
        """Stage 2: the current direction of the culprit's group blocked for a
        few seconds, then back as it was."""
        if dry:
            return None
        writes: list[Write] = []
        called: list[RoleAdapter] = []
        for adapter, whole in group:
            for write in adapter.guard_block(direction, whole, self._hass):
                if write.is_call and adapter not in called:
                    called.append(adapter)
                if all(w.entity_id != write.entity_id for w in writes):
                    writes.append(write)
        problem = await self._async_guard_hold(writes, 2)
        if problem is None:
            await joe_writes.settle(guard_rules.BLOCK_S)
        failed = await self._async_guard_restore("done")
        # Own steps that called services: only their own release steps undo them.
        for adapter in called:
            for write in adapter.op_steps("release", self._hass) or []:
                try:
                    await async_apply(
                        self._hass, write, self._note("guard_back"), self.language()
                    )
                except WriteError as err:
                    self._log(
                        "failed", battery=None, entity=err.entity_id, code=err.code
                    )
                    failed.append(err.entity_id)
        return problem or ("restore" if failed else None)

    async def _async_guard_hold(self, writes: list[Write], stage: int) -> str | None:
        """Write, noting each value before on disk first (it goes back after
        the stage, after a restart, a stop or an error)."""
        held: dict[str, Any] = self.data["guard"]["held"]
        for write in writes:
            if not write.is_call and write.entity_id not in held:
                original = read(self._hass, write.entity_id)
                if original is None:
                    return "unavailable"
                held[write.entity_id] = original
        await self._async_save()
        for index, write in enumerate(writes):
            if index:
                await joe_writes.settle(guard_rules.PACE_S)
            try:
                await async_apply(
                    self._hass, write, self._note("guard", stage=stage), self.language()
                )
            except WriteError as err:
                self._log("failed", battery=None, entity=err.entity_id, code=err.code)
                return err.code
        return None

    async def _async_guard_restore(self, reason: str) -> list[str]:
        """What the watchdog switched back as it was, newest first; returns
        what failed (kept for the next try)."""
        held: dict[str, Any] = self.data["guard"]["held"]
        if not held:
            return []
        back: list[str] = []
        failed: list[str] = []
        for index, entity_id in enumerate(reversed(list(held))):
            write = Write(entity_id, held[entity_id])
            if index:
                await joe_writes.settle(guard_rules.PACE_S)
            if not matches(self._hass, fit(self._hass, write)):
                try:
                    await async_apply(
                        self._hass, write, self._note("guard_back"), self.language()
                    )
                except WriteError:
                    failed.append(entity_id)
                    continue
            held.pop(entity_id, None)
            back.append(entity_id)
        # Logged when something came back outside a stage, or failed (a retry
        # that fails again every few seconds is no news).
        if (back and reason != "done") or (failed and reason != "retry"):
            self._log("guard_restored", reason=reason, entities=back, failed=failed)
        await self._async_save()
        return failed

    def _guard_joe_holds(self, role: RoleAdapter | None) -> bool:
        """Whether Joe himself commands the battery now (its mode, power or
        manual mode noted to put back: the night, charging by hand, a test)."""
        if role is None:
            return False
        saved: dict[str, Any] = self.data["saved"]
        # A lever the day uses, too (Victron's and Sigenergy's charge power is
        # their charge limit): noted for a block or a cap, no command of Joe's.
        day = {role.controls[r] for r in role.day_roles() if r in role.controls}
        levers = [
            *(
                role.controls.get(r)
                for r in ("mode", "charge_power", "discharge_power")
            ),
            *role.guard_manual(),
        ]
        return any(e in saved for e in levers if e and e not in day)

    def _guard_levers(self, config: dict[str, Any]) -> dict[str, tuple[bool, bool]]:
        """Per battery: whether Joe can restart its control and block it."""
        result = {}
        groups = {k: v[0] for k, v in self._team_groups(config).items()}
        for battery in config["batteries"]:
            adapter = make_adapter(battery)
            if isinstance(adapter, RoleAdapter):
                whole = self._whole_system(config, groups, battery, adapter)
                result[battery["id"]] = (
                    adapter.guard_can_restart(),
                    adapter.guard_can_block("charge", whole)
                    or adapter.guard_can_block("discharge", whole),
                )
        return result

    def _guard_entities(self, battery: dict[str, Any]) -> set[str]:
        """The levers the watchdog writes for a battery."""
        adapter = make_adapter(battery)
        if not isinstance(adapter, RoleAdapter):
            return set()
        found = set(adapter.guard_manual()) if adapter.guard_can_restart() else set()
        for direction in ("charge", "discharge"):
            if adapter.own_steps(f"block_{direction}"):
                found |= set(adapter.own_entities(f"block_{direction}"))
                continue
            found |= {
                adapter.controls[r] for r in adapter.guard_block_roles(direction, True)
            }
        return found

    def _guard_publish(
        self,
        config: dict[str, Any],
        state: str,
        dry: bool,
        running: bool,
        now: datetime,
    ) -> None:
        """Tell the panel when what the watchdog does changed."""
        store: dict[str, Any] = self.data["guard"]
        info = {
            "state": state,
            "dry": dry,
            "running": running,
            "stage": store["stage"] if running else 0,
            "last": deepcopy(store["last"]),
        }
        if info != self.guard:
            self.guard = info
            self._changed()

    def _proposed_regulating(self, battery: dict[str, Any]) -> bool:
        """Whether a battery regulates itself to 0 W at the grid meter, as its
        profile says (Profile.regulating): Fronius and Kostal always,
        Omnibattery in automatic mode."""
        profile = profile_for(battery.get("adapter"))
        regulating = profile.regulating if profile else "no"
        if regulating == "yes":
            return True
        if regulating != "auto":
            return False
        for step in battery.get("prepare") or []:
            entity_id = step["entity_id"]
            # Joe's own manual mode at night does not count: its original does.
            value = (
                self.data["saved"][entity_id]
                if entity_id in self.data["saved"]
                else read(self._hass, entity_id)
            )
            if value is True or value == step.get("value"):
                return False
        return True

    def _proposed_group(self, battery: dict[str, Any]) -> tuple[str, bool]:
        """The system Joe thinks regulates a battery (see groups.py)."""
        return proposed_group(self._hass, battery)

    def _team_groups(self, config: dict[str, Any]) -> dict[str, tuple[str, str, bool]]:
        """Per battery: its group (as set, else as proposed), the proposal and
        whether Joe is sure of it."""
        result = {}
        for battery in config["batteries"]:
            proposed, sure = self._proposed_group(battery)
            result[battery["id"]] = (
                battery.get("control_group") or proposed,
                proposed,
                sure,
            )
        return result

    def whole_system(self, battery: dict[str, Any], adapter: RoleAdapter) -> bool:
        """Whether the system's limits may block this battery (see _whole_system)."""
        config = self._config()
        groups = {k: v[0] for k, v in self._team_groups(config).items()}
        return self._whole_system(config, groups, battery, adapter)

    def _whole_system(
        self,
        config: dict[str, Any],
        groups: dict[str, str],
        battery: dict[str, Any],
        adapter: RoleAdapter,
    ) -> bool:
        """Whether every battery behind this battery's system limits is in its
        group (only then may Joe block the group with them)."""
        key = adapter.system_key()
        if key is None:
            return True
        mine = groups.get(battery["id"])
        return all(
            groups.get(other["id"]) == mine
            for other in config["batteries"]
            if (other.get("controls") or {}).get("system_charge_limit") == key
        )

    def _team_floor(self, battery: dict[str, Any], role: RoleAdapter | None) -> float:
        """The level Joe counts on without a learned cutoff: the battery's own
        floor (as set in Joe, else on the device), else a typical one."""
        if battery.get("floor_soc") is not None:
            return float(battery["floor_soc"])
        value = self._original(role, "min_soc")
        if role is not None and value is not None:
            return float(role._level("min_soc", value))
        return team_rules.DEFAULT_CUTOFF

    def _team_full_at(self, role: RoleAdapter | None) -> float:
        """Full at its own charge target, if lower."""
        value = self._original(role, "charge_target")
        if value is not None and 50 <= value < team_rules.FULL:
            return float(value)
        return team_rules.FULL

    def _original(self, role: RoleAdapter | None, name: str) -> float | None:
        """A lever's value as it was before Joe changed it."""
        entity_id = role.controls.get(name) if role is not None else None
        if not entity_id:
            return None
        saved = self.data["saved"]
        value = saved[entity_id] if entity_id in saved else read(self._hass, entity_id)
        if isinstance(value, bool) or not isinstance(value, int | float):
            return None
        return float(value)

    # --- charging to a level by hand ----------------------------------------

    def _car_need(self, action_id: str) -> dict[str, Any]:
        """The need of the car plugged into a charge point (raises "no_car")."""
        if self.cars is not None:
            need = self.cars.need_at(action_id)
        else:
            config = self._config()
            found = cars.detect_all(config, self._hass.states.get).get(action_id) or {}
            car = cars.car_by_id(config, found.get("car"))
            action = cars.action_by_id(config, action_id)
            need = (
                cars.need_for(self._hass.states.get, car, action.get("point"))
                if car is not None and action is not None
                else None
            )
        if need is None:
            raise ValueError("no_car")
        return need

    async def async_boost(
        self, action_id: str, target: float | None, unit: str = "%"
    ) -> None:
        """Charge the car now until a level (%) or a range (km, plus the reserve).

        It does not wait for the cheap window, and it also switches in the
        simulation: the user asked for it. Stops at the target, after a day,
        or with async_boost_stop.
        """
        action = next(
            (a for a in self._config()["actions"] if a["id"] == action_id), None
        )
        if action is None or action["kind"] != "switch":
            raise ValueError("unknown_action")
        if target is None:
            async with self._lock:
                self.data["boost"].pop(action_id, None)
            await self.async_check()
            return
        need = self._car_need(action_id)
        sensor = need.get("soc_entity") if unit == "%" else need.get("range_entity")
        if not sensor:
            raise ValueError("no_sensor")
        reserve = need.get("reserve_km", 50.0) if unit == "km" else 0.0
        now = dt_util.now()
        async with self._lock:
            self.data["boost"][action_id] = {
                "target": round(float(target) + reserve, 1),
                "chosen": float(target),
                "unit": unit,
                "sensor": sensor,
                "since": now.isoformat(timespec="seconds"),
                "until": (now + BOOST_LIMIT).isoformat(timespec="seconds"),
            }
            self._log("boost", battery=f"action:{action_id}", target=target, unit=unit)
            await self._async_save()
        await self.async_check()

    async def _async_boosts(
        self, config: dict[str, Any], mode: str, now: datetime
    ) -> tuple[dict[str, Any], set[str], bool]:
        """Keep cars that charge to a level by hand switched on; end finished ones."""
        result: dict[str, Any] = {}
        keep: set[str] = set()
        ended = False
        boosts: dict[str, Any] = self.data["boost"]
        by_id = {a["id"]: a for a in config["actions"]}
        for action_id, boost in list(boosts.items()):
            action = by_id.get(action_id)
            state = self._hass.states.get(boost["sensor"])
            value = distance_km(state) if boost["unit"] == "km" else number(state)
            end = None
            if action is None or mode == "off":
                end = "stopped"
            elif value is not None and value >= boost["target"]:
                end = "reached"
            elif now >= datetime.fromisoformat(boost["until"]):
                end = "expired"
            if end:
                ended = True
                del boosts[action_id]
                self._log("boost_end", battery=f"action:{action_id}", reason=end)
                if end == "reached":
                    self._fire("action_reset", action=action_id, reason="boost_reached")
                continue
            assert action is not None
            adapter = ActionAdapter(action)
            problem = await self._async_write(adapter, adapter.on(), now, "action_on")
            keep.add(adapter.entity_id)
            result[action_id] = {
                "on": problem is None,
                "reason": "boost",
                "start": boost["since"],
                "end": boost["until"],
                "target": boost["target"],
                "chosen": boost["chosen"],
                "unit": boost["unit"],
                "value": value,
                "problem": problem,
            }
        return result, keep, ended

    def _notice_external(self, adapter: Adapter, now: datetime) -> None:
        """Values Joe set that someone else changed: leave them alone tonight."""
        written: dict[str, Any] = self.data["written"]
        for entity_id in adapter.entities():
            entry = written.get(entity_id)
            if not entry or entity_id in self.data["external"]:
                continue
            if matches(self._hass, Write(entity_id, entry["value"])):
                entry["confirmed"] = True
                continue
            if entry.get("confirmed"):
                self.data["external"].append(entity_id)
                value = read(self._hass, entity_id)
                self._log(
                    "external",
                    battery=adapter.battery["id"],
                    entity=entity_id,
                    value=value,
                )
                self._fire("external_change", entity_id=entity_id, value=value)
                # What someone else set is theirs: Joe does not restore it.
                self.data["saved"].pop(entity_id, None)

    def _settle_loop_owned(self, adapter: Adapter) -> set[str]:
        """Once the prepare step is undone (e.g. manual mode off again), the
        device's own control owns mode and power: nothing of them to restore
        or watch any more. Returns those entities."""
        owned = adapter.loop_owned()
        # Without a prepare step (an older Omnibattery) Joe owns them throughout.
        if not owned or not adapter.prepare_entities():
            return set()
        saved: dict[str, Any] = self.data["saved"]
        external: list[str] = self.data["external"]
        if any(e in external for e in adapter.prepare_entities()):
            # Someone else switched manual mode back: theirs for the night.
            for entity_id in owned:
                if entity_id not in external:
                    external.append(entity_id)
                saved.pop(entity_id, None)
            return owned
        # Still in manual mode (Joe's or someone else's): Joe owns what he set.
        if adapter.prepared(self._hass):
            return set()
        for entity_id in owned:
            saved.pop(entity_id, None)
            self.data["written"].pop(entity_id, None)
        self.data["external"] = [e for e in external if e not in owned]
        return owned

    # --- release ---------------------------------------------------------------

    async def async_release_now(self) -> None:
        """The emergency button: everything back now, and no steering tonight."""
        async with self._lock:
            plan = self._plan()
            if plan and plan.get("window"):
                self.data["skip"] = plan["window"]["start"]
            self._log("emergency")
            # No daytime cap again today either, and no blocks.
            self._surplus_forget("emergency")
            today = dt_util.now().date().isoformat()
            self.data["surplus"]["released"] = today
            self.data["team"]["paused"] = today
            await self._async_release("emergency")
            self._set_status("skipped", self.status.get("night"), {}, {})
            await self._async_save()

    async def _async_release(
        self,
        reason: str,
        now: datetime | None = None,
        keep: set[str] | None = None,
        *,
        force: bool = False,
        alarm: bool = True,
    ) -> None:
        """Put back every value Joe noted; keep what fails for the next try.

        Entities in `keep` (a car charging to a level by hand) stay as they are.
        `force` tries again at once (a stop: no later check would); without
        `alarm` failures are not told (the caller does).
        """
        now = now or dt_util.now()
        keep = keep or set()
        saved: dict[str, Any] = self.data["saved"]
        written: dict[str, Any] = self.data["written"]
        if not self._dirty_except(keep):
            return
        if (
            not force
            and self.data["failures"]
            and self._last_release_try
            and now - self._last_release_try < RETRY
        ):
            return
        self._last_release_try = now
        writes: list[Write] = []
        covered: set[str] = set()
        active: list[str] = self.data["active"]
        adapters = [
            a for a in (make_adapter(b) for b in self._config()["batteries"]) if a
        ]
        for adapter in adapters:
            self._settle_loop_owned(adapter)
        # The limits of the daytime cap: what an automation set after Joe stays,
        # whether Joe saw his own value taken or not.
        self._drop_foreign(
            [
                e
                for a in adapters
                if isinstance(a, RoleAdapter)
                for e in a.limit_entities()
                if e not in keep
            ]
        )
        for adapter in adapters:
            battery = adapter.battery
            for write in adapter.release(saved):
                if write.is_call:
                    # Release calls (e.g. "stop forcible charge") for batteries Joe used.
                    if battery["id"] in active:
                        writes.append(write)
                elif write.entity_id in saved and write.entity_id not in covered:
                    writes.append(write)
                    covered.add(write.entity_id)
        for action in self._config()["actions"]:
            for write in ActionAdapter(action).release(saved):
                if write.entity_id not in covered:
                    writes.append(write)
                    covered.add(write.entity_id)
        # Entities of batteries that are gone or steered differently now.
        for entity_id in reversed(list(saved)):
            if entity_id not in covered:
                writes.append(Write(entity_id, saved[entity_id]))
        writes = [w for w in writes if w.entity_id not in keep]
        errors: list[str] = []
        note = self._note("release")
        for write in writes:
            if write.is_call:
                try:
                    await async_apply(self._hass, write, note, self.language())
                except WriteError as err:
                    errors.append(err.entity_id)
                continue
            entry = written.get(write.entity_id)
            if (
                entry
                and entry.get("confirmed")
                and not matches(self._hass, Write(write.entity_id, entry["value"]))
                and not matches(self._hass, write)
            ):
                # Someone changed it after Joe: theirs now.
                saved.pop(write.entity_id, None)
                written.pop(write.entity_id, None)
                continue
            if not matches(self._hass, fit(self._hass, write)):
                try:
                    await async_apply(self._hass, write, note, self.language())
                except WriteError as err:
                    errors.append(err.entity_id)
                    continue
            if matches(self._hass, fit(self._hass, write)):
                saved.pop(write.entity_id, None)
                written.pop(write.entity_id, None)
            else:
                errors.append(write.entity_id)
        # Manual mode undone: what the device's own control owns is no error.
        for adapter in adapters:
            owned = self._settle_loop_owned(adapter)
            errors = [e for e in errors if e not in owned]
        if not errors:
            self.data["active"] = [
                k for k in self.data["active"] if _kept(k, keep, self._config())
            ]
            self.data["calls"] = {}
            # A daytime cap given back is no cap any more (a stop, a reload).
            caps = self.data["surplus"]["caps"]
            if any(k not in keep for k in caps):
                self._surplus_forget(reason)
            # Blocks given back are no blocks any more.
            blocks = self.data["team"]["blocks"]
            for key in [k for k in blocks if k not in keep]:
                del blocks[key]
        if errors:
            self.data["failures"] += 1
            self._log("release_failed", reason=reason, entities=errors)
            if alarm and self.data["failures"] >= RELEASE_ALARM and self.notifier:
                await self.notifier.async_problem("release_failed", entities=errors)
        else:
            if self.data["failures"] >= RELEASE_ALARM and self.notifier:
                await self.notifier.async_clear("release_failed")
            self.data["failures"] = 0
            self._log("released", reason=reason)
            self._fire("released", reason=reason)
            if reason == "done" and self.data["steered"] and self.notifier:
                await self.notifier.async_morning(self._summary())
        await self._async_save()

    def _summary(self) -> str:
        """ "BYD 23 → 62 %, Venus 40 → 62 %" for the morning message."""
        parts = []
        for battery in self._config()["batteries"]:
            first = self.data["first"].get(battery["id"])
            soc = number(self._hass.states.get(battery["soc_entity"]))
            if first is not None and soc is not None:
                parts.append(f"{battery['name']} {first:.0f} → {soc:.0f} %")
        return ", ".join(parts)

    # --- nights ------------------------------------------------------------------

    # --- the night's power as a charge limit (Fronius) ---------------------------

    async def _async_night_cap(
        self,
        battery: dict[str, Any],
        adapter: Adapter,
        want: Desired | None,
        now: datetime,
    ) -> dict[str, Any] | None:
        """A battery that charges from the grid without a power of its own
        (Fronius raises its reserve and charges as fast as it can): its
        charge limit as a ceiling at the planned power, while it charges with
        a planned power. Joe watches whether the battery keeps to it; if it
        takes clearly more, the limit does not hold while charging from the
        grid: he notes that for this battery (from then on he plans it at
        full power) and puts the limit back. The ceiling belongs to the
        night: the day's levers (team, cap) are given back before it.
        Returns what the panel shows, or None.
        """
        if not isinstance(adapter, RoleAdapter):
            return None
        key = battery["id"]
        caps: dict[str, Any] = self.data["night_caps"]
        entry = caps.get(key)
        wanted = (
            want is not None
            and want.charge_to is not None
            and bool(want.power_w)
            and adapter.power_lever(self._hass) == "cap"
            and not (entry and entry.get("state") == "ignored")
        )
        if not wanted:
            if entry and entry.get("w"):
                # Not charging (or at full power now): the limit back as it was.
                await self._async_unlimit(adapter, now)
                entry["w"] = None
                entry["since"] = None
            return _cap_view(entry)
        assert want is not None and want.power_w is not None
        watts = round(want.power_w)
        writes = adapter.night_cap(self._hass, watts, self.data["saved"])
        problem = await self._async_write(adapter, writes, now, "charge")
        if entry is None or entry.get("w") != watts:
            entry = {
                **(entry or {}),
                "w": watts,
                "since": now.isoformat(timespec="seconds"),
                "over": None,
            }
            caps[key] = entry
            self._log("night_cap", battery=key, power=round(watts / 1000, 2))
        elif problem is None:
            self._night_cap_learn(battery, adapter, entry, now)
            if entry.get("state") == "ignored":
                await self._async_unlimit(adapter, now)
                entry["w"] = None
        return _cap_view(entry)

    def _night_cap_learn(
        self,
        battery: dict[str, Any],
        adapter: RoleAdapter,
        entry: dict[str, Any],
        now: datetime,
    ) -> None:
        """Whether the battery keeps to its ceiling (see _async_night_cap)."""
        since = datetime.fromisoformat(entry["since"])
        if now - since < NIGHT_CAP_SETTLE:
            return
        power = _charge_w(self._hass, battery)
        if power is None:
            return
        limit = entry["w"]
        entry["seen_w"] = round(power)
        key = battery["id"]
        if power > limit * NIGHT_CAP_OVER + NIGHT_CAP_SLACK_W:
            over = entry.get("over")
            if over is None:
                entry["over"] = now.isoformat(timespec="seconds")
                return
            if now - datetime.fromisoformat(over) < NIGHT_CAP_OVER_FOR:
                return
            entry["state"] = "ignored"
            self._log(
                "night_cap_ignored",
                battery=key,
                cap=round(limit / 1000, 2),
                power=round(power / 1000, 2),
            )
            if self.on_night_cap:
                self.on_night_cap(key, "ignored")
            return
        entry["over"] = None
        if (
            entry.get("state") is None
            and battery.get("night_cap") != "works"
            and power >= limit * 0.5
            and now - since >= NIGHT_CAP_WORKS_FOR
        ):
            entry["state"] = "works"
            self._log("night_cap_works", battery=key, cap=round(limit / 1000, 2))
            if self.on_night_cap:
                self.on_night_cap(key, "works")

    def _track_grid_peak(self, config: dict[str, Any], now: datetime) -> bool:
        """Note the highest import from the grid (for a learned grid limit).
        Returns whether it changed."""
        grid = measurement_kw(
            self._hass.states.get, config["measurements"]["grid_power"]
        )
        if grid is None or grid <= 0:
            return False
        peak = self.data.get("grid_peak")
        watts = round(grid * 1000)
        if peak is None:
            stamp = now.isoformat(timespec="seconds")
            self.data["grid_peak"] = {"w": watts, "at": stamp, "since": stamp}
            return True
        if watts <= peak["w"] * GRID_PEAK_STEP:
            return False
        peak.update(w=watts, at=now.isoformat(timespec="seconds"))
        return True

    def _guard_grid(
        self,
        config: dict[str, Any],
        desired: dict[str, Desired],
        socs: dict[str, float | None],
        now: datetime,
    ) -> dict[str, Desired]:
        """Protect the main fuse: while the house draws more than the grid limit,
        the batteries hold instead of charging, for a few minutes at a time."""
        rules = config["rules"]
        charging = [k for k, d in desired.items() if d.charge_to is not None]
        if not rules["guard_grid"] or not rules["grid_limit_w"] or not charging:
            return desired
        grid = measurement_kw(
            self._hass.states.get, config["measurements"]["grid_power"]
        )
        paused = self.data["paused"]
        if grid is not None and grid * 1000 > rules["grid_limit_w"] * GRID_MARGIN:
            if not paused or datetime.fromisoformat(paused) <= now:
                self._log("grid_guard", power=round(grid, 2))
            self.data["paused"] = (now + GRID_PAUSE).isoformat()
        elif paused and datetime.fromisoformat(paused) <= now:
            self.data["paused"] = None
        if not self.data["paused"]:
            return desired
        result = dict(desired)
        for key in charging:
            soc = socs.get(key)
            result[key] = Desired(
                floor=max(0, math.floor(soc)) if soc is not None else None,
                span_s=desired[key].span_s,
            )
        return result

    async def _async_watch_progress(
        self,
        items: list[tuple[dict[str, Any], dict[str, Any], Adapter | None]],
        desired: dict[str, Desired],
        socs: dict[str, float | None],
        now: datetime,
    ) -> None:
        """A battery that should charge but does not rise gets reported, once a night."""
        progress: dict[str, Any] = self.data["progress"]
        names = {battery["id"]: battery["name"] for battery, _, _ in items}
        for key in list(progress):
            want = desired.get(key)
            if want is None or want.charge_to is None:
                progress.pop(key)
        for key, want in desired.items():
            soc = socs.get(key)
            if want.charge_to is None or soc is None or soc >= want.charge_to - 1:
                continue
            mark = progress.get(key)
            if mark is None or soc >= mark["soc"] + 1:
                if mark and mark.get("told") and self.notifier:
                    # It charges again: the hint can go.
                    await self.notifier.async_clear("no_progress")
                progress[key] = {"since": now.isoformat(), "soc": soc, "told": False}
                continue
            if (
                mark.get("told")
                or now - datetime.fromisoformat(mark["since"]) < NO_PROGRESS
            ):
                continue
            mark["told"] = True
            self._log("no_progress", battery=key, soc=round(soc, 1))
            self._fire("no_progress", battery=key)
            if self.notifier:
                await self.notifier.async_problem(
                    "no_progress", battery=names.get(key, key)
                )

    # --- charging much slower than planned ---------------------------------------

    async def _async_watch_slow(
        self,
        items: list[tuple[dict[str, Any], dict[str, Any], Adapter | None]],
        desired: dict[str, Desired],
        socs: dict[str, float | None],
        batteries: dict[str, Any],
        now: datetime,
    ) -> None:
        """A battery that takes far less than the power planned for it while
        it charges from the grid gets noted (the plan goes by it) and the
        owner told, once a night; one that takes clearly more again is
        forgotten. What each battery takes is summed up for the night's look
        back. `batteries` are the panel's entries of this check.
        """
        watch: dict[str, Any] = self.data["slow_watch"]
        known: dict[str, Any] = self.data["night_slow"]
        for battery, _, adapter in items:
            key = battery["id"]
            entry = batteries.get(key)
            if entry is not None and key in known:
                entry["slow"] = _slow_view(known[key])
            want = desired.get(key)
            charging = (
                adapter is not None and want is not None and want.charge_to is not None
            )
            power = _charge_w(self._hass, battery) if charging else None
            if not charging or power is None:
                # Not charging (or no power to see): the next stretch starts afresh.
                watch.pop(key, None)
                self._count_energy(key, None, now)
                continue
            assert want is not None and want.charge_to is not None
            power = max(0.0, power)
            self._count_energy(key, power, now)
            soc = socs.get(key)
            cap = (entry or {}).get("cap") or {}
            if (
                not want.power_w
                or soc is None
                or soc >= want.charge_to - SLOW_NEAR
                or cap.get("w")
                or (entry or {}).get("problem")
            ):
                # No planned power (as fast as it can), near its target, Joe's
                # own ceiling in force or a value that did not take: nothing
                # to measure.
                watch.pop(key, None)
                continue
            mark = watch.get(key)
            if mark is None:
                mark = watch[key] = {
                    "since": now.isoformat(timespec="seconds"),
                    "low_since": None,
                    "sum": 0.0,
                    "n": 0,
                    "fast_since": None,
                }
            if now - _at(mark["since"]) < SLOW_START:
                continue
            if power >= want.power_w * SLOW_SHARE:
                mark.update(low_since=None, sum=0.0, n=0)
                self._slow_over(battery, mark, power, now, entry)
                continue
            mark["fast_since"] = None
            if mark["low_since"] is None:
                mark["low_since"] = now.isoformat(timespec="seconds")
            mark["sum"] += power
            mark["n"] += 1
            if now - _at(mark["low_since"]) < SLOW_FOR:
                continue
            if entry is not None and entry.get("problem") is None:
                entry["problem"] = "charge_slow"
            if self._slow_tonight(key):
                continue
            await self._async_slow_found(
                battery, want.power_w, mark["sum"] / mark["n"], now, entry
            )

    # --- a battery held back by a setting that is not Joe's ----------------------------

    async def _async_watch_automations(self, config: dict[str, Any]) -> None:
        """The owner's automations that write to a battery and are switched
        on: they are the owner's, Joe never switches them. He says that they
        get in his way – the panel shows them always, the log and the phone
        get it once per change, only while Joe steers (not in the simulation,
        where he writes nothing)."""
        try:
            found = battery_automations.find(self._hass, config)
        except Exception:
            _LOGGER.exception("Looking for automations failed")
            return
        on = battery_automations.switched_on(found)
        if on != self.automations:
            self.automations = on
            self._changed()
        ids = sorted(a["entity_id"] for a in on) if self._mode() in STEERING else []
        if ids == sorted(self.data.get("automations_told") or []):
            return
        self.data["automations_told"] = ids
        if ids:
            names = [a["name"] for a in on]
            self._log("automations", names=names)
            if self.notifier:
                await self.notifier.async_problem(
                    "automations",
                    tag="automations",
                    names=", ".join(f"„{n}“" for n in names),
                )
        else:
            self._log("automations_off")
            if self.notifier:
                await self.notifier.async_clear("automations")
        await self._async_save()

    def _note(self, key: str | None, **values: Any) -> str | None:
        """Why Joe writes something, for the logbook (see NOTES); None when
        there are no words for it. In the owner's language: the panel's, as
        last seen, else Home Assistant's."""
        if key is None or key not in NOTES:
            return None
        return NOTES[key][0 if self.language() == "de" else 1].format(**values)

    def words(self, key: str, **values: Any) -> str | None:
        """Joe's words for the logbook (see NOTES), in the owner's language."""
        return self._note(key, **values)

    def language(self) -> str:
        """The owner's language for Joe's own words ("de" or "en")."""
        chosen = self._language() if self._language else None
        return (
            "de"
            if (chosen or self._hass.config.language or "en").startswith("de")
            else "en"
        )

    async def _async_watch_stuck(self, config: dict[str, Any], now: datetime) -> None:
        """A battery that cannot work because of a setting Joe did not write
        (its reserve at or above its level, a block someone else set): once
        that held the house to the grid for STUCK_FOR, the owner is told (a
        notification, a push if wanted) and the panel shows it, until it is
        over. Joe puts nothing back that he did not write (the owner's word
        counts), he only says so.
        """
        watch: dict[str, Any] = self.data["stuck_watch"]
        known: dict[str, Any] = self.data["stuck"]
        written = set(self.data["written"])
        grid = measurement_kw(
            self._hass.states.get, config["measurements"]["grid_power"]
        )
        ids = {b["id"] for b in config["batteries"]}
        for key in [k for k in (*watch, *known) if k not in ids]:
            watch.pop(key, None)
            known.pop(key, None)
        for battery in config["batteries"]:
            key = battery["id"]
            adapter = make_adapter(battery)
            soc = number(self._hass.states.get(battery["soc_entity"]))
            found = (
                adapter.held_back(self._hass, soc, written)
                if isinstance(adapter, RoleAdapter) and soc is not None
                else None
            )
            if found is not None and found["reason"] == "reserve":
                # A reserve at the owner's own floor is no setting gone wrong.
                floor = battery.get("floor_soc") or battery.get("cutoff_soc")
                if floor is not None and found["level"] <= floor + 2:
                    found = None
            # Only while it matters: the house draws from the grid though the
            # battery has something to give, or gives to the grid though it
            # has room.
            matters = (
                found is not None
                and grid is not None
                and soc is not None
                and (
                    (
                        found["direction"] == "discharge"
                        and grid * 1000 >= team_rules.IMPORT_W
                        and soc > self._stuck_floor(battery) + 2
                    )
                    or (
                        found["direction"] == "charge"
                        and -grid * 1000 >= team_rules.EXPORT_W
                        and soc < team_rules.FULL_BACK
                    )
                )
            )
            if not matters:
                watch.pop(key, None)
                if key in known:
                    self._log("stuck_over", battery=key, reason=known[key]["reason"])
                    await self.notifier.async_clear(f"stuck_{key}")
                    known.pop(key)
                    self._changed()
                continue
            assert found is not None and soc is not None
            mark = watch.get(key)
            if mark is None or mark["reason"] != found["reason"]:
                watch[key] = {
                    "since": now.isoformat(timespec="seconds"),
                    "reason": found["reason"],
                }
                continue
            if now - _at(mark["since"]) < STUCK_FOR:
                continue
            if key in known and known[key]["reason"] == found["reason"]:
                continue
            state = self._hass.states.get(found["entity_id"])
            name = state.name if state else found["entity_id"]
            known[key] = {
                "reason": found["reason"],
                "since": mark["since"],
                "entity_id": found["entity_id"],
                "name": name,
                "value": found["value"],
                "soc": round(soc, 1),
            }
            self._log(
                "stuck",
                battery=key,
                reason=found["reason"],
                entity=found["entity_id"],
                value=found["value"],
                soc=round(soc, 1),
            )
            await self.notifier.async_problem(
                f"stuck_{found['reason']}",
                tag=f"stuck_{key}",
                battery=battery["name"],
                entity=name,
                value=found["value"],
                soc=round(soc, 1),
            )
            self._changed()

    def _stuck_floor(self, battery: dict[str, Any]) -> float:
        """The level below which a battery has nothing to give: the cutoff
        Joe learned, the floor the owner set, else a typical one."""
        return float(
            battery.get("cutoff_soc")
            or battery.get("floor_soc")
            or team_rules.DEFAULT_CUTOFF
        )

    def _slow_tonight(self, key: str) -> bool:
        """Whether the battery was found slow tonight already (told once a night)."""
        found = self.data["night_slow"].get(key) or {}
        return any(n["night"] == self.data["night"] for n in found.get("nights") or [])

    async def _async_slow_found(
        self,
        battery: dict[str, Any],
        planned_w: float,
        measured_w: float,
        now: datetime,
        entry: dict[str, Any] | None,
    ) -> None:
        """Noted for the plan (the last SLOW_NIGHTS findings), in the log, as
        the battery's problem in the panel, and told to the owner."""
        key = battery["id"]
        found = self.data["night_slow"].get(key) or {}
        night = self.data["night"]
        nights = [n for n in found.get("nights") or [] if n["night"] != night]
        nights.append(
            {
                "night": night,
                "planned_w": round(planned_w),
                "measured_w": round(measured_w),
            }
        )
        found = {
            "planned_w": round(planned_w),
            "measured_w": round(measured_w),
            "at": now.isoformat(timespec="seconds"),
            "nights": nights[-SLOW_NIGHTS:],
        }
        self.data["night_slow"][key] = found
        if entry is not None:
            entry["slow"] = _slow_view(found)
        self._log(
            "charge_slow",
            battery=key,
            power=round(measured_w / 1000, 2),
            planned=round(planned_w / 1000, 2),
        )
        self._fire(
            "charge_slow",
            battery=key,
            planned_w=round(planned_w),
            measured_w=round(measured_w),
        )
        if self.notifier:
            kind = (
                "charge_slow_fronius"
                if battery.get("adapter") == "fronius"
                else "charge_slow"
            )
            await self.notifier.async_problem(
                kind,
                battery=battery["name"],
                measured=self._kw_text(measured_w),
                planned=self._kw_text(planned_w),
            )

    def _slow_over(
        self,
        battery: dict[str, Any],
        mark: dict[str, Any],
        power: float,
        now: datetime,
        entry: dict[str, Any] | None,
    ) -> None:
        """A battery Joe knows as slow takes clearly more than he learned, for
        SLOW_START: forgotten, the plan goes by its full power again."""
        key = battery["id"]
        learned = self.slow_powers().get(key)
        if learned is None or power < learned * SLOW_AGAIN:
            mark["fast_since"] = None
            return
        if mark["fast_since"] is None:
            mark["fast_since"] = now.isoformat(timespec="seconds")
            return
        if now - _at(mark["fast_since"]) < SLOW_START:
            return
        del self.data["night_slow"][key]
        mark["fast_since"] = None
        if entry is not None:
            entry.pop("slow", None)
        self._log("charge_slow_end", battery=key, power=round(power / 1000, 2))
        self._fire("charge_slow_end", battery=key, power_w=round(power))

    def slow_powers(self) -> dict[str, float]:
        """Per battery known to charge much slower than planned: the power to
        plan it with (W; the most of its last findings)."""
        result: dict[str, float] = {}
        for key, found in self.data["night_slow"].items():
            powers = [n["measured_w"] for n in found.get("nights") or []]
            result[key] = max(powers) if powers else found["measured_w"]
        return result

    def _kw_text(self, watts: float) -> str:
        """A power for a message ("0,5", "3"; kW), in the language Joe speaks."""
        text = f"{watts / 1000:.1f}".removesuffix(".0")
        if (self._hass.config.language or "en").startswith("de"):
            text = text.replace(".", ",")
        return text

    def _count_energy(self, key: str, power_w: float | None, now: datetime) -> None:
        """Sum up what a battery takes while Joe charges it (kWh); None ends
        the stretch (the next one starts with a fresh check)."""
        energy: dict[str, Any] = self.data["night_energy"]
        if power_w is None:
            if key in energy:
                energy[key]["at"] = None
            return
        mark = energy.setdefault(key, {"kwh": 0.0, "at": None})
        if mark["at"]:
            gap = min(now - _at(mark["at"]), ENERGY_GAP)
            mark["kwh"] += power_w / 1000 * gap.total_seconds() / 3600
        mark["at"] = now.isoformat(timespec="seconds")

    def _review_night(self, plan: dict[str, Any], now: datetime) -> bool:
        """The window is over: what each battery took against what was planned
        for it (for the panel, and a line per battery in the log). Returns
        whether the night was looked back on now.
        """
        night = self.data["night"]
        review = self.data.get("night_review")
        if plan.get("kind") != "charge" or (review and review.get("night") == night):
            return False
        energy: dict[str, Any] = self.data["night_energy"]
        first: dict[str, Any] = self.data["first"]
        config = self._config()
        batteries: dict[str, Any] = {}
        for planned in plan.get("batteries") or []:
            key = planned["id"]
            battery = next((b for b in config["batteries"] if b["id"] == key), None)
            if battery is None or key not in first:
                continue
            counted = energy.get(key)
            charged = round(counted["kwh"], 2) if counted else None
            planned_kwh = planned.get("charge_kwh")
            powers = [s.get("power_kw") or 0 for s in planned.get("slots") or []]
            planned_kw = max(powers, default=planned.get("power_kw") or 0)
            batteries[key] = {
                "planned_kwh": planned_kwh,
                "charged_kwh": charged,
                "planned_w": round(planned_kw * 1000) or None,
                "soc_start": first.get(key),
                "soc_end": number(self._hass.states.get(battery["soc_entity"])),
                "slow": self._slow_tonight(key),
            }
            if charged is not None and planned_kwh is not None:
                self._log(
                    "night_charged", battery=key, charged=charged, planned=planned_kwh
                )
        if not batteries:
            return False
        self.data["night_review"] = {
            "night": night,
            "at": now.isoformat(timespec="seconds"),
            "batteries": batteries,
        }
        return True

    def _tell_night_left(
        self, plan: dict[str, Any], reason: str, night: str, now: datetime
    ) -> bool:
        """A night Joe leaves alone, told once as it begins: why, into his
        log, the logbook and the panel (where the plan's own words are gone
        by morning). Returns whether it was told now."""
        if self.data.get("night_told") == night:
            return False
        self.data["night_told"] = night
        why = reason
        if reason == "nothing":
            why = next(
                (r for r in plan.get("reasons") or [] if r in NIGHT_WHYS), "enough"
            )
        self.data["last_night"] = {
            "night": night,
            "reason": reason,
            "why": why,
            "sun": plan.get("sun_takes_over"),
            "target": plan.get("target"),
            "kwh": plan.get("grid_charge_kwh"),
            "at": now.isoformat(timespec="seconds"),
        }
        self._log(
            "night_none",
            why=why,
            reason=reason,
            sun=plan.get("sun_takes_over"),
            target=plan.get("target"),
            kwh=plan.get("grid_charge_kwh"),
        )
        if note := self._note(f"night_none_{why}"):
            async_line(self._hass, note)
        return True

    def _start_night(self, night: str) -> None:
        self.data.update(
            night=night,
            floors={},
            reached=[],
            external=[],
            first={},
            steered=False,
            done=[],
            paused=None,
            progress={},
            night_caps={},
            slow_watch={},
            night_energy={},
        )
        self._log("start", night=night)
        if self.notifier:
            self.notifier.clear_ask()

    def _end_night(self) -> None:
        night = self.data["night"]
        self.data.update(
            night=None,
            floors={},
            reached=[],
            external=[],
            first={},
            steered=False,
            done=[],
            night_caps={},
            slow_watch={},
            night_energy={},
        )
        # A switch "tonight" is for one night only.
        self.data["tonight"] = {
            key: value for key, value in self.data["tonight"].items() if value != night
        }
        self.data["tonight_target"] = {
            key: value
            for key, value in self.data["tonight_target"].items()
            if value.get("night") != night
        }

    async def async_action_tonight(
        self,
        action_id: str,
        on: bool,
        target: float | None = None,
        unit: str = "%",
    ) -> None:
        """Run a night action in the coming night regardless of the forecast (or not).

        A car may get a level (%) or a range (km, plus the reserve) to charge
        up to in the cheap window.
        """
        plan = self._plan()
        night = plan["window"]["start"] if plan and plan.get("window") else None
        chosen = None
        if on and night and target is not None:
            action = next(
                (a for a in self._config()["actions"] if a["id"] == action_id), None
            )
            if action is None or action["kind"] != "switch":
                raise ValueError("unknown_action")
            need = self._car_need(action_id)
            sensor = need.get("soc_entity") if unit == "%" else need.get("range_entity")
            if not sensor:
                raise ValueError("no_sensor")
            reserve = need.get("reserve_km", 50.0) if unit == "km" else 0.0
            chosen = {
                "night": night,
                "target": round(float(target) + reserve, 1),
                "chosen": float(target),
                "unit": unit,
                "sensor": sensor,
            }
        if on and night:
            self.data["tonight"][action_id] = night
            # By hand: also when Joe's own charge reached its target before.
            self.data["done"] = [d for d in self.data["done"] if d != action_id]
        else:
            self.data["tonight"].pop(action_id, None)
        if chosen:
            self.data["tonight_target"][action_id] = chosen
        elif (
            not on
            or (self.data["tonight_target"].get(action_id) or {}).get("night") != night
        ):
            # Switched on again without a level (the switch, a service): the
            # level chosen for this night stays.
            self.data["tonight_target"].pop(action_id, None)
        self._log(
            "tonight",
            battery=f"action:{action_id}",
            on=on,
            **({"target": target, "unit": unit} if chosen else {}),
        )
        await self._async_save()
        self._changed()

    async def async_replanned(self, action_ids: list[str]) -> None:
        """Actions worked out again in the fixed plan: their target counts anew."""
        if not any(d in action_ids for d in self.data["done"]):
            return
        self.data["done"] = [d for d in self.data["done"] if d not in action_ids]
        await self._async_save()
        self._changed()

    async def async_skip(self, skip: bool) -> None:
        """Skip tonight (or not); releases right away if Joe is steering."""
        plan = self._plan()
        night = plan["window"]["start"] if plan and plan.get("window") else None
        self.data["skip"] = night if skip else None
        self._log("skip" if skip else "unskip", night=night)
        await self._async_save()
        await self.async_check()

    async def async_answer(self, night: str, yes: bool) -> None:
        """The answer in the "suggest" mode: may Joe steer this night?"""
        self.data["answer"] = {
            "night": night,
            "yes": yes,
            "at": dt_util.now().isoformat(timespec="seconds"),
        }
        self._log("answer", night=night, yes=yes)
        if self.notifier:
            self.notifier.clear_ask()
        await self._async_save()
        self._changed()
        await self.async_check()

    async def async_answer_tonight(self, yes: bool) -> None:
        """An answer from a phone: it is about the coming (or running) night."""
        plan = self._plan()
        if plan and plan.get("window"):
            await self.async_answer(plan["window"]["start"], yes)

    # --- the test run ----------------------------------------------------------------

    async def async_test(self, battery_id: str) -> dict[str, Any]:
        """Hold, charge and release one battery briefly and read everything back."""
        config = self._config()
        battery = next((b for b in config["batteries"] if b["id"] == battery_id), None)
        if battery is None:
            raise ValueError("unknown_battery")
        adapter = make_adapter(battery)
        if adapter is None:
            raise ValueError("not_controllable")
        if self.status.get("steering"):
            raise ValueError("steering")
        async with self._lock:
            self.testing = {
                "battery": battery_id,
                "step": "check",
                "steps": [],
                "started": dt_util.now().isoformat(timespec="seconds"),
            }
            self._changed()
            try:
                result = await self._async_run_test(battery, adapter)
            finally:
                self.testing = None
            self.data["tests"][battery_id] = result
            self._log("test", battery=battery_id, ok=result["ok"])
            await self._async_save()
        self._changed()
        return result

    async def _async_run_test(
        self, battery: dict[str, Any], adapter: Adapter
    ) -> dict[str, Any]:
        hass = self._hass
        now = dt_util.now()
        result: dict[str, Any] = {
            "at": now.isoformat(timespec="seconds"),
            "signature": adapter.signature,
            "ok": False,
            "steps": [],
        }
        if missing := adapter.missing(hass):
            result["problem"] = "controls_missing"
            result["missing"] = missing
            return result
        soc = number(hass.states.get(battery["soc_entity"]))
        if soc is None:
            result["problem"] = "soc_unknown"
            return result
        result["soc"] = round(soc, 1)
        saved: dict[str, Any] = self.data["saved"]
        target = min(100, math.ceil(soc) + 5)
        steps = [
            ("hold", Desired(floor=max(0, math.floor(soc)), block=True), TEST_HOLD)
        ]
        if adapter.can_charge:
            steps.append(
                (
                    "charge",
                    Desired(charge_to=target, power_w=_test_power(battery)),
                    TEST_CHARGE,
                )
            )
        ok = True
        for name, want, seconds in steps:
            assert self.testing is not None
            self.testing["step"] = name
            self._changed()
            writes = [fit(hass, w) for w in adapter.writes(hass, want, soc, saved)]
            step = await self._async_try_writes(battery, name, writes, seconds)
            ok = ok and step["ok"]
            result["steps"].append(step)
            self.testing["steps"] = result["steps"]
            self._changed()
        # Release: everything back.
        self.testing["step"] = "release"
        self._changed()
        step = await self._async_try_back(battery, adapter, adapter.release(saved))
        result["steps"].append(step)
        result["ok"] = ok and step["ok"]
        return result

    async def _async_try_writes(
        self,
        battery: dict[str, Any],
        name: str,
        writes: list[Write],
        seconds: float,
    ) -> dict[str, Any]:
        """One step of a test run or a probe: the originals noted, the writes
        made, a wait, every value read back (and the battery's power)."""
        hass = self._hass
        saved: dict[str, Any] = self.data["saved"]
        errors = []
        note = self._note("probe" if self.probe_running else "test", step=name)
        for write in writes:
            if not write.is_call and write.entity_id not in saved:
                saved[write.entity_id] = read(hass, write.entity_id)
            try:
                await async_apply(hass, write, note, self.language())
            except WriteError as err:
                errors.append({"entity_id": err.entity_id, "code": err.code})
        await self._async_save()
        await asyncio.sleep(seconds)
        wrong = [w.entity_id for w in writes if not w.is_call and not matches(hass, w)]
        power = measurement_kw(hass.states.get, battery.get("power"))
        return {
            "step": name,
            "ok": not errors and not wrong,
            "errors": errors,
            "wrong": wrong,
            "power": None if power is None else round(power, 2),
            "writes": [w.as_dict() for w in writes],
        }

    async def _async_try_back(
        self, battery: dict[str, Any], adapter: Adapter, restore: list[Write]
    ) -> dict[str, Any]:
        """The last step of a test run or a probe: everything back, a wait,
        read back; what is back is no longer Joe's to restore."""
        hass = self._hass
        saved: dict[str, Any] = self.data["saved"]
        errors = []
        note = self._note("release")
        for write in restore:
            try:
                await async_apply(hass, write, note, self.language())
            except WriteError as err:
                errors.append({"entity_id": err.entity_id, "code": err.code})
        await asyncio.sleep(TEST_RELEASE)
        # Manual mode back off: mode and power belong to the device's control again.
        owned = self._settle_loop_owned(adapter)
        wrong = [
            w.entity_id
            for w in restore
            if not w.is_call
            and w.entity_id not in owned
            and not matches(hass, fit(hass, w))
        ]
        for write in restore:
            if write.entity_id not in wrong:
                saved.pop(write.entity_id, None)
        power = measurement_kw(hass.states.get, battery.get("power"))
        return {
            "step": "release",
            "ok": not errors and not wrong,
            "errors": errors,
            "wrong": wrong,
            "power": None if power is None else round(power, 2),
            "writes": [w.as_dict() for w in restore],
        }

    async def async_probe(self, battery_id: str, op: str) -> dict[str, Any]:
        """One operation written once (its steps as the preview shows them),
        read back after a while, put back and read back again: the probe of
        the panel's "Vorgänge". Refused while Joe steers this battery or a
        test run or probe is going on (`problem`); the result is kept per
        battery and operation (data["probes"]) and logged."""
        config = self._config()
        battery = next((b for b in config["batteries"] if b["id"] == battery_id), None)
        if battery is None:
            raise ValueError("unknown_battery")
        if op not in (*OPERATIONS, *operations.GUARD_OPERATIONS):
            raise ValueError("unknown_operation")
        now = dt_util.now()
        result: dict[str, Any] = {
            "ok": False,
            "op": op,
            "at": now.isoformat(timespec="seconds"),
            "steps": [],
            "restored": True,
            "restore_errors": [],
            "problem": None,
            "power_kw": None,
        }
        if self.testing or self.probe_running:
            result["problem"] = "busy"
            return result
        if self.status.get("steering"):
            result["problem"] = "steering"
            return result
        adapter = make_adapter(battery)
        async with self._lock:
            self.probe_running = {
                "battery": battery_id,
                "op": op,
                "started": result["at"],
            }
            self._changed()
            try:
                if not isinstance(adapter, RoleAdapter):
                    result["problem"] = "not_possible"
                else:
                    result = await self._async_run_probe(
                        config, battery, adapter, op, result
                    )
            finally:
                self.probe_running = None
            self.data["probes"].setdefault(battery_id, {})[op] = result
            self._log("probe", battery=battery_id, op=op, ok=result["ok"])
            await self._async_save()
        self._changed()
        return result

    async def _async_run_probe(
        self,
        config: dict[str, Any],
        battery: dict[str, Any],
        adapter: RoleAdapter,
        op: str,
        result: dict[str, Any],
    ) -> dict[str, Any]:
        hass = self._hass
        if op in ("charge", "hold") and (missing := adapter.missing(hass)):
            result["problem"] = "controls_missing"
            result["missing"] = missing
            return result
        groups = {k: v[0] for k, v in self._team_groups(config).items()}
        params = operations.params_for(
            hass,
            battery,
            whole_system=self._whole_system(config, groups, battery, adapter),
        )
        found = operations.operation(hass, adapter, op, params, self.data["saved"])
        if not found.possible:
            result["problem"] = (
                "soc_unknown" if found.why == "soc_unknown" else "not_possible"
            )
            result["why"] = found.why
            return result
        if op == "release" and not found.writes:
            result["problem"] = "not_possible"
            result["why"] = "no_steps"
            return result
        seconds = {"hold": TEST_HOLD, "charge": TEST_CHARGE}.get(op, PROBE_BLOCK)
        step = await self._async_try_writes(battery, op, found.writes, seconds)
        errors = {e["entity_id"]: e["code"] for e in step["errors"]}
        result["steps"] = [
            _probe_step(hass, w, errors, step["wrong"]) for w in found.writes
        ]
        result["power_kw"] = step["power"]
        restore = operations.restore_writes(
            adapter, op, found.writes, self.data["saved"], calls=True
        )
        back = await self._async_try_back(battery, adapter, restore)
        result["restored"] = back["ok"]
        result["restore_errors"] = [
            *(e["entity_id"] for e in back["errors"]),
            *(
                e
                for e in back["wrong"]
                if e not in {x["entity_id"] for x in back["errors"]}
            ),
        ]
        result["ok"] = step["ok"] and back["ok"]
        return result

    # --- helpers ---------------------------------------------------------------------

    def _watch(self, entity_ids: list[str]) -> None:
        """React to charge level changes right away while steering."""
        wanted = tuple(sorted(entity_ids))
        if wanted == self._watched:
            return
        if self._soc_unsub:
            self._soc_unsub()
            self._soc_unsub = None
        self._watched = wanted
        if wanted:
            self._soc_unsub = async_track_state_change_event(
                self._hass, list(wanted), self._on_soc
            )

    @callback
    def _on_soc(self, event: Event) -> None:
        if not self._lock.locked():
            self._hass.async_create_task(self.async_check(), eager_start=False)

    def _set_status(
        self,
        reason: str,
        night: str | None,
        batteries: dict[str, Any],
        actions: dict[str, Any],
        keep: set[str] | None = None,
    ) -> None:
        status = {
            "steering": reason == "steering",
            "reason": reason,
            "night": night,
            "batteries": batteries,
            "actions": actions,
            # Left to put back, apart from what is set on purpose right now.
            "pending": reason != "steering"
            and (self._dirty_except(keep) if keep else self._dirty),
        }
        if status != self.status:
            self.status = status
            self._changed()

    def _log(self, kind: str, **detail: Any) -> None:
        entry = {
            "at": dt_util.now().isoformat(timespec="seconds"),
            "kind": kind,
            **detail,
        }
        log: list[dict[str, Any]] = self.data["log"]
        log.append(entry)
        del log[:-LOG_SIZE]

    def _fire(self, kind: str, **data: Any) -> None:
        self._hass.bus.async_fire(f"{DOMAIN}_{kind}", data)

    async def _async_save(self) -> None:
        await self._store.async_save(self.data)

    async def async_save(self) -> None:
        """Store what changed from outside (e.g. the automations Joe switched off)."""
        await self._async_save()
        self._changed()

    def readiness(self) -> dict[str, str]:
        """Per battery: ready to steer, or why not ("not_tested", ...)."""
        result = {}
        for battery in self._config()["batteries"]:
            adapter = make_adapter(battery)
            if adapter is None:
                result[battery["id"]] = "not_controllable"
            elif adapter.missing(self._hass):
                result[battery["id"]] = "controls_missing"
            elif not self.tested(battery):
                test = self.data["tests"].get(battery["id"])
                result[battery["id"]] = (
                    "outdated" if test and test.get("ok") else "not_tested"
                )
            else:
                result[battery["id"]] = "ready"
        return result

    @property
    def view(self) -> dict[str, Any]:
        """What the panel shows."""
        return {
            **self.status,
            "ready": self.readiness(),
            "testing": self.testing,
            "tests": self.data["tests"],
            "probe_running": self.probe_running,
            "log": self.data["log"][-30:],
            "skip": self.data["skip"],
            "answer": self.data["answer"],
            "tonight": self.data["tonight"],
            "tonight_target": self.data["tonight_target"],
            "boost": self.data["boost"],
            "surplus": self.surplus,
            "team": self.team,
            "guard": self.guard,
            "grid_peak": self.data.get("grid_peak"),
            # Batteries charging much slower than planned, and the last
            # night's look back (see _async_watch_slow, _review_night).
            "night_slow": self.data["night_slow"],
            "night_review": self.data.get("night_review"),
            # The last night Joe left alone and why (see _tell_night_left).
            "last_night": self.data.get("last_night"),
            # Batteries held back by a setting that is not Joe's (see
            # _async_watch_stuck).
            "stuck": self.data.get("stuck") or {},
            # The owner's automations that write to a battery and are on
            # (see _async_watch_automations).
            "automations": [a["name"] for a in self.automations],
        }

    async def async_forget(self) -> None:
        await self._store.async_remove()


def _kept(key: str, keep: set[str], config: dict[str, Any]) -> bool:
    """Whether an "active" key belongs to an action whose entity is kept."""
    if key in keep:
        # A battery whose limit stays set on purpose (morning, daytime surplus).
        return True
    if not key.startswith("action:"):
        return False
    action_id = key.removeprefix("action:")
    return any(
        a["id"] == action_id and a["entity_id"] in keep for a in config["actions"]
    )


def _at(stamp: str) -> datetime:
    return datetime.fromisoformat(stamp)


def _fresh() -> dict[str, Any]:
    return deepcopy(DEFAULT_DATA)


def _action(want: Desired | None) -> str | None:
    if want is None:
        return None
    if want.charge_to is not None:
        return "charge"
    if want.block:
        return "block"
    if want.floor is not None:
        return "hold"
    return "free"


def _cap_view(entry: dict[str, Any] | None) -> dict[str, Any] | None:
    """The night's ceiling for the panel: the power, what the battery took,
    and whether it holds."""
    if not entry:
        return None
    return {
        "w": entry.get("w"),
        "seen_w": entry.get("seen_w"),
        "state": entry.get("state"),
    }


def _shown(hass: HomeAssistant, entity_id: str) -> str | None:
    """An entity's state as the panel shows it (None: no such entity)."""
    state = hass.states.get(entity_id)
    return state.state if state else None


def _probe_step(
    hass: HomeAssistant, write: Write, errors: dict[str, str], wrong: list[str]
) -> dict[str, Any]:
    """One write of a probe: what was written, what came back, whether the
    device took it, and the error (a code the panel explains: the write's,
    or "not_taken" when the value did not show)."""
    if write.is_call:
        error = errors.get(write.entity_id)
        return {
            "service": write.entity_id.removeprefix("service:"),
            "wrote": None,
            "read": None,
            "taken": error is None,
            "error": error,
        }
    error = errors.get(write.entity_id) or (
        "not_taken" if write.entity_id in wrong else None
    )
    return {
        "entity_id": write.entity_id,
        "wrote": write.value,
        "read": _shown(hass, write.entity_id),
        "taken": error is None,
        "error": error,
    }


def _slow_view(found: dict[str, Any]) -> dict[str, Any]:
    """What the panel shows of a battery that charges much slower than
    planned: the planned and the measured power (W), and when."""
    return {key: found.get(key) for key in ("planned_w", "measured_w", "at")}


def _test_power(battery: dict[str, Any]) -> float:
    """A small charging power for the test run (W)."""
    maximum = battery.get("max_charge_w") or 2000
    return max(100.0, min(1000.0, maximum / 4))


def _charge_w(hass: HomeAssistant, battery: dict[str, Any]) -> float | None:
    """The battery's charging power now (W, positive while charging)."""
    value = measurement_kw(hass.states.get, battery.get("power"))
    return None if value is None else value * 1000


def _solar_kw(hass: HomeAssistant, config: dict[str, Any]) -> float | None:
    """What the panels give now (kW), if every solar measurement is known."""
    values = [
        solar_kw(hass.states.get, m) for m in config["measurements"]["solar_power"]
    ]
    if not values or None in values:
        return None
    return sum(v or 0.0 for v in values)


def _with_room(store: day_surplus.Store, room: float) -> day_surplus.Store:
    """A battery for the daytime cap with the room of those waiting behind it."""
    capacity = store.capacity + room
    soc = 100 - (store.room + room) / capacity * 100
    return day_surplus.Store(store.id, capacity, soc, store.max_kw, store.capped)
