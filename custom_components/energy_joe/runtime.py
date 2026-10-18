"""Joe's persisted state and configuration, and the live channel to the panel."""

from __future__ import annotations

import asyncio
from collections.abc import Callable
from copy import deepcopy
import inspect
import logging
from typing import Any

import voluptuous as vol

from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util, json as json_util
from homeassistant.util.hass_dict import HassKey

from . import model
from .accounts import CarAccounts
from .const import DOMAIN
from .control import automations as battery_automations
from .control.cars import CarWatcher
from .control.climate import ClimateController
from .control.executor import JoeExecutor
from .control.notify import JoeNotifier
from .discovery import async_car_sources, async_car_updates, async_profile_updates
from .learn.learner import JoeLearner
from .mail import oauth
from .mail.inbox import CarInboxes
from .observe.observer import BACKFILL_DAYS, JoeObserver
from .observe.store import HistoryStore
from .plan import cars as model_cars
from .plan.car_calendar import CarCalendarStore
from .plan.inputs import battery_floor, device_floor
from .plan.scheduler import JoePlanner

_LOGGER = logging.getLogger(__name__)

STATE_VERSION = 1
STATE_KEY = f"{DOMAIN}.state"
CONFIG_KEY = f"{DOMAIN}.config"
SAVE_DELAY = 2
# The kept configuration is read whatever version wrote it (taking it back
# migrates and checks it).
BACKUP_READABLE = 1000
# (Older Home Assistant versions read every version and have no such limit.)
_READABLE: dict[str, Any] = (
    {"max_readable_version": BACKUP_READABLE}
    if "max_readable_version" in inspect.signature(Store.__init__).parameters
    else {}
)

# "advisory": Joe asks every evening whether he may steer the night.
MODES = ("simulation", "advisory", "live", "off")
AVAILABLE_MODES = MODES
ONBOARDING_STEPS = ("welcome", "scan", "questions", "done")

DEFAULT_STATE: dict[str, Any] = {
    "mode": "simulation",
    "onboarding": {"step": "welcome", "completed": False},
}

DATA_RUNTIME: HassKey[JoeRuntime] = HassKey(DOMAIN)

type StateListener = Callable[[dict[str, Any]], None]


class _ConfigStore(Store[dict[str, Any]]):
    """Store that migrates older configuration versions on load."""

    # What the last migration started from (kept apart when it fails).
    raw: dict[str, Any] | None = None

    async def _async_migrate_func(
        self, old_major_version: int, old_minor_version: int, old_data: dict[str, Any]
    ) -> dict[str, Any]:
        self.raw = old_data
        return model.migrate(old_data)

    async def async_load_raw(self) -> dict[str, Any] | None:
        """The stored configuration as it is on disk (not migrated, not checked)."""
        if self.raw is not None:
            return self.raw
        try:
            raw = await self.hass.async_add_executor_job(json_util.load_json, self.path)
        except Exception:  # noqa: BLE001 - a file that cannot be read is no backup
            _LOGGER.exception("Reading the stored configuration failed")
            return None
        data = raw.get("data") if isinstance(raw, dict) else None
        return data if isinstance(data, dict) else None


class _BackupStore(Store[dict[str, Any]]):
    """The configuration kept apart, as it was (also one of a newer version:
    taking it back migrates and checks it)."""

    async def _async_migrate_func(
        self, old_major_version: int, old_minor_version: int, old_data: dict[str, Any]
    ) -> dict[str, Any]:
        return old_data


class JoeRuntime:
    """Holds Joe's state and configuration and notifies subscribers about changes."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize with defaults; call async_load before use."""
        self._state_store: Store[dict[str, Any]] = Store(hass, STATE_VERSION, STATE_KEY)
        self._config_store = _ConfigStore(hass, model.CONFIG_VERSION, CONFIG_KEY)
        self._backup_store = _BackupStore(
            hass, model.CONFIG_VERSION, f"{CONFIG_KEY}.unreadable", **_READABLE
        )
        self._hass = hass
        self._state: dict[str, Any] = deepcopy(DEFAULT_STATE)
        self._config: dict[str, Any] = model.default_config()
        self._listeners: set[StateListener] = set()
        self.history = HistoryStore(hass)
        self.observer = JoeObserver(
            hass, self.history, self._changed, self._history_filled
        )
        self.planner = JoePlanner(
            hass,
            self.history,
            self._changed,
            lambda: self.executor.data["tonight"],
        )
        self.learner = JoeLearner(
            hass,
            self.history,
            lambda: self._config,
            self.async_update_config,
            self._changed,
        )
        self.executor = JoeExecutor(
            hass,
            lambda: self._config,
            lambda: self.planner.plan,
            lambda: self._state["mode"],
            self._changed,
        )
        self.notifier = JoeNotifier(
            hass, lambda: self._config, self.executor.async_answer_tonight
        )
        self.executor.notifier = self.notifier
        self.executor.on_learned = self._learned_limit_ref
        self.executor.on_cutoff = self._learned_cutoff
        self.executor.on_night_cap = self._learned_night_cap
        # Joe's calendar for each car whose mailbox has none.
        self.calendars = CarCalendarStore(hass)
        self.planner.calendars = self.calendars
        # Invitations to those mailboxes (see mail/).
        self.inbox = CarInboxes(
            hass, lambda: self._config, self.calendars, self._changed
        )
        # Each car's mailbox with a calendar (see accounts.py).
        self.accounts = CarAccounts(hass, lambda: self._config, self._changed)
        self.planner.accounts = self.accounts
        self.planner.held = lambda: self.executor.data["saved"]
        self.planner.grid_peak = lambda: self.executor.data.get("grid_peak")
        # Which car is plugged in where (asks, reminds, learns evcc's ids).
        self.cars = CarWatcher(
            hass,
            lambda: self._config,
            lambda: self._state["mode"],
            lambda: self.planner.plan,
            self._changed,
        )
        self.cars.notifier = self.notifier
        self.cars.replan = self.planner.async_replan_points
        self.cars.learn = lambda patch: self.async_update_config(
            patch, "learned", "evcc_vehicle"
        )
        self.notifier.on_car = self.async_answer_car
        self.planner.detected = self.cars.detect
        self.executor.cars = self.cars
        # Heating and air conditioning by presence (the "Klima" page).
        self.climate = ClimateController(
            hass, lambda: self._config, lambda: self._state["mode"], self._changed
        )
        self._started = False
        # A configuration Joe could not read at the start, kept apart: whether
        # one is there, and why taking it back failed (the panel offers it).
        self._backup = False
        self._backup_error: str | None = None
        self._planned: dict[str, Any] | None = None
        self._observed: dict[str, Any] | None = None
        self._observe_lock = asyncio.Lock()

    async def async_load(self) -> None:
        """Load stored state and configuration."""
        if stored := await self._state_store.async_load():
            self._state = _with_defaults(stored, DEFAULT_STATE)
        await self._async_load_config()
        await self.history.async_load()
        await self.executor.async_load()
        await self.calendars.async_load()
        await self.inbox.async_load()
        await self.accounts.async_load()
        await self.climate.async_load()
        await self.cars.async_load()

    async def _async_load_config(self) -> None:
        """The stored configuration, migrated and checked. One Joe cannot read
        (a newer version wrote it, a migration fails) is kept apart, and Joe
        starts with the defaults; the panel offers to take it back."""
        try:
            stored = await self._config_store.async_load()
        except Exception as err:  # noqa: BLE001 - never stop the setup for it
            _LOGGER.error(
                "Stored configuration cannot be read, starting fresh: %s", err
            )
            if raw := await self._config_store.async_load_raw():
                await self._backup_store.async_save(raw)
        else:
            if stored:
                try:
                    self._config = model.validate(stored)
                except vol.Invalid as err:
                    # Keep a copy instead of silently overwriting the user's data.
                    _LOGGER.error(
                        "Stored configuration is invalid, starting fresh: %s", err
                    )
                    await self._backup_store.async_save(stored)
        try:
            self._backup = bool(await self._backup_store.async_load())
        except Exception:  # noqa: BLE001 - a backup that cannot be read is none
            _LOGGER.exception("Reading the kept configuration failed")
            self._backup = False

    def _backup_view(self) -> dict[str, Any] | None:
        """The configuration kept apart, offered while Joe runs with the
        defaults (the owner has set nothing since)."""
        if not self._backup:
            return None
        provenance = self._config.get("provenance") or {}
        if any(e.get("source") == "user" for e in provenance.values()):
            return None
        return {"error": self._backup_error}

    async def async_restore_backup(self) -> None:
        """Take back the configuration kept apart: migrated and checked like
        any stored one (raises vol.Invalid and the like; it stays kept then)."""
        data = await self._backup_store.async_load()
        if not data:
            self._backup = False
            raise ValueError("no_backup")
        try:
            self.async_replace_config(data)
        except (vol.Invalid, KeyError, TypeError, ValueError) as err:
            self._backup_error = str(err)
            self._changed()
            raise
        await self._config_store.async_save(self._config)
        await self._backup_store.async_remove()
        self._backup, self._backup_error = False, None
        self._changed()

    async def async_discard_backup(self) -> None:
        """Forget the configuration kept apart (the owner starts anew)."""
        await self._backup_store.async_remove()
        self._backup, self._backup_error = False, None
        self._changed()

    async def async_unload(self) -> None:
        """Stop watching and write pending changes immediately.

        Joe gives everything back (with a few tries) and switches the owner's
        automations he switched off on again: without him nobody would
        coordinate the batteries. After the start he takes them over again
        once he can steer himself.
        """
        self._started = False
        self.notifier.stop()
        self.inbox.async_stop()
        self.accounts.async_stop()
        self.climate.async_stop()
        self.cars.stop()
        await self.executor.async_stop()
        try:
            await self.executor.async_hand_back_automations()
        except Exception:
            _LOGGER.exception("Switching the battery automations on again failed")
        async with self._observe_lock:
            await self.learner.async_stop()
            await self.planner.async_stop()
            await self.observer.async_stop()
        await self.planner.places.async_flush()
        await self.calendars.async_flush()
        await self.history.async_unload()
        await self._state_store.async_save(self._state)
        await self._config_store.async_save(self._config)

    async def async_remove(self) -> None:
        """Delete all stored data (integration removed).

        Every value Joe noted goes back first (with a few tries; what stays is
        told to the owner, the originals would be gone with the data), then
        the automations Joe switched off are switched on again: without Joe
        nobody would know why they are off.
        """
        await self._async_load_config()
        await self.executor.async_load()
        try:
            await self.executor.async_give_back("removed", removed=True)
        except Exception:
            _LOGGER.exception("Putting the values back failed")
        try:
            await self.executor.async_hand_back_automations(removed=True)
        except Exception:
            _LOGGER.exception("Switching the battery automations on again failed")
        await self._state_store.async_remove()
        await self._config_store.async_remove()
        await self._backup_store.async_remove()
        await self.history.async_remove()
        await self.planner.places.async_remove()
        await self.calendars.async_remove()
        await self.inbox.async_remove()
        await self.accounts.async_remove()
        await self.climate.async_remove()
        await self.cars.async_remove()
        await self.executor.async_forget()

    @callback
    def async_start(self) -> None:
        """Home Assistant is running: Joe may start watching (and steering)."""
        self._started = True
        self.notifier.start()
        self._hass.async_create_task(self.executor.async_start(), eager_start=False)
        self._update_observer()
        self.inbox.async_apply()
        self.climate.async_start()
        self.cars.start()
        self._hass.async_create_task(self._async_profile_updates(), eager_start=False)
        self._hass.async_create_task(self.async_car_updates(), eager_start=False)

    def _learned_limit_ref(self, battery_id: str, watts: float) -> None:
        """What 100 % of a battery's charge limit stand for, as Joe measured it."""
        if not any(b["id"] == battery_id for b in self._config["batteries"]):
            return
        try:
            self.async_update_config(
                {"batteries": {battery_id: {"limit_ref_w": watts}}},
                "learned",
                "limit_ref",
            )
        except Exception:
            _LOGGER.exception("Keeping the learned reference failed")

    def _learned_night_cap(self, battery_id: str, found: str) -> None:
        """Whether a battery's charge limit holds while it charges from the grid."""
        if not any(b["id"] == battery_id for b in self._config["batteries"]):
            return
        try:
            self.async_update_config(
                {"batteries": {battery_id: {"night_cap": found}}},
                "learned",
                "night_cap",
            )
        except Exception:
            _LOGGER.exception("Keeping what Joe saw of the charge limit failed")

    def _learned_cutoff(self, battery_id: str, soc: float) -> None:
        """The level a battery really stops discharging at, as Joe saw it (a
        value the user set stays)."""
        if not any(b["id"] == battery_id for b in self._config["batteries"]):
            return
        path = f"batteries[{battery_id}].cutoff_soc"
        # Only a value the user set for this field counts (not the battery's).
        own = (self._config.get("provenance") or {}).get(path) or {}
        if own.get("source") == "user":
            return
        try:
            self.async_update_config(
                {"batteries": {battery_id: {"cutoff_soc": soc}}}, "learned", "cutoff"
            )
        except Exception:
            _LOGGER.exception("Keeping the learned cutoff failed")

    async def _async_profile_updates(self) -> None:
        """Batteries set up before a profile learned more (e.g. a manual mode)."""
        try:
            patch = await async_profile_updates(self._hass, self._config)
        except Exception:
            _LOGGER.exception("Checking the battery profiles failed")
            return
        if patch:
            _LOGGER.info("Battery profiles updated: %s", list(patch["batteries"]))
            self.async_update_config(patch, "read", "profile")

    async def async_car_updates(self) -> None:
        """Link the cars Joe sees (evcc's vehicles, car integrations) to his cars."""
        try:
            patch = await async_car_updates(self._hass, self._config)
        except Exception:
            _LOGGER.exception("Looking for cars failed")
            return
        if patch:
            _LOGGER.info("Cars updated: %s", list(patch.get("cars") or {}))
            self.async_update_config(patch, "read", "cars")

    async def async_answer_car(self, point_id: str, car: str | None) -> None:
        """Which car is plugged into a charge point (from the panel or a phone)."""
        await self.cars.async_answer(point_id, car)

    @callback
    def async_merge_cars(self, into: str, other: str) -> str:
        """Two cars are one: the other's sources join it. The car that charges
        by need keeps its settings (and its id: mailbox, calendar, learned).
        Returns the id of the car that stays."""
        config = self._config
        first = model_cars.car_by_id(config, into)
        second = model_cars.car_by_id(config, other)
        if first is None or second is None or into == other:
            raise ValueError("unknown_car")
        if not (first.get("need") or {}).get("enabled") and (
            second.get("need") or {}
        ).get("enabled"):
            first, second = second, first
        known = {s["id"] for s in first.get("sources") or []}
        sources = [
            *(first.get("sources") or []),
            *(s for s in second.get("sources") or [] if s["id"] not in known),
        ]
        patch: dict[str, Any] = {
            "cars": {first["id"]: {"sources": sources}, second["id"]: None}
        }
        actions = {}
        for action in config["actions"]:
            point = action.get("point") or {}
            change: dict[str, Any] = {}
            if point.get("cars") and second["id"] in point["cars"]:
                change["cars"] = sorted(
                    {first["id"], *(c for c in point["cars"] if c != second["id"])}
                )
            if point.get("assume_car") == second["id"]:
                change["assume_car"] = first["id"]
            if change:
                actions[action["id"]] = {"point": change}
        if actions:
            patch["actions"] = actions
        self.async_update_config(patch, "user", "merge")
        return first["id"]

    async def async_attach_to_car(
        self, car_id: str | None, source_ids: list[str]
    ) -> str:
        """Attach cars Joe sees (by their source id) to a car, or to a new one
        (`car_id` None): they leave the car they belonged to and are no longer
        left out. Returns the car's id."""
        found = {item["id"]: item for item in await async_car_sources(self._hass)}
        # One Home Assistant does not show right now is moved as it was saved.
        for car in self._config.get("cars") or []:
            for source in car.get("sources") or []:
                found.setdefault(source["id"], source)
        if any(source_id not in found for source_id in source_ids):
            raise ValueError("unknown_source")
        patch, car = model_cars.attach_sources(
            self._config, car_id, [found[source_id] for source_id in source_ids]
        )
        self.async_update_config(patch, "user", "attach")
        return car

    @callback
    def async_split_car(self, car_id: str, source_id: str) -> str:
        """A source is another car: it becomes a car of its own (and Joe does
        not ask again whether the two are the same). Returns the new car's id."""
        config = self._config
        car = model_cars.car_by_id(config, car_id)
        source = next(
            (s for s in (car or {}).get("sources") or [] if s["id"] == source_id),
            None,
        )
        if car is None or source is None:
            raise ValueError("unknown_source")
        new_id = model_cars.new_car_id(config, source.get("name"))
        pairs = self._separate_pairs(car_id, new_id)
        self.async_update_config(
            {
                "cars": {
                    car_id: {
                        "sources": [s for s in car["sources"] if s["id"] != source_id]
                    },
                    new_id: {
                        "name": model_cars.clean_name(source.get("name")) or new_id,
                        "sources": [source],
                    },
                },
                "answers": {"car_separate": pairs},
            },
            "user",
            "split",
        )
        return new_id

    @callback
    def async_separate_cars(self, first: str, second: str) -> None:
        """Two cars are not the same: Joe stops asking."""
        self.async_update_config(
            {"answers": {"car_separate": self._separate_pairs(first, second)}},
            "user",
            "separate",
        )

    def _separate_pairs(self, first: str, second: str) -> list[str]:
        pairs = list((self._config.get("answers") or {}).get("car_separate") or [])
        pair = "|".join(sorted((first, second)))
        return pairs if pair in pairs else [*pairs, pair]

    def automations(self) -> list[dict[str, Any]]:
        """Automations that write to the batteries (and which ones Joe switched off)."""
        switched_off: dict[str, Any] = self.executor.data["automations_off"]
        registry = er.async_get(self._hass)
        # Switched on again by hand, or deleted: Joe forgets it. Not just because
        # it no longer writes to a battery Joe knows – it stays off until then.
        for entity_id in list(switched_off):
            state = self._hass.states.get(entity_id)
            if (state and state.state == "on") or (
                state is None and registry.async_get(entity_id) is None
            ):
                del switched_off[entity_id]
        lent: dict[str, Any] = self.executor.data["automations_lent"]
        for entity_id in list(lent):
            if self._hass.states.get(entity_id) is None and (
                registry.async_get(entity_id) is None
            ):
                del lent[entity_id]
        found = battery_automations.find(self._hass, self._config, switched_off)
        for automation in found:
            # Switched on again by Joe: he takes it over once he can.
            automation["lent"] = lent.get(automation["entity_id"])
        listed = {a["entity_id"] for a in found}
        # Joe's own ones that write to no battery he knows (any more) are
        # listed all the same: off, or lent while he is not back.
        for entity_id in [*switched_off, *(e for e in lent if e not in switched_off)]:
            if entity_id not in listed:
                state = self._hass.states.get(entity_id)
                found.append(
                    {
                        "entity_id": entity_id,
                        "name": state.name if state else entity_id,
                        "on": bool(state and state.state == "on"),
                        "writes": [],
                        "switched_off": switched_off.get(entity_id),
                        "lent": lent.get(entity_id),
                    }
                )
        return found

    async def async_switch_automations(
        self, on: bool, entity_ids: list[str] | None = None
    ) -> list[str]:
        """All (or some) battery automations off, or the ones Joe switched off on again.

        Off only what Joe takes over at once: one that coordinates batteries
        Joe cannot coordinate himself right now (not live, a lever missing …)
        keeps running and is lent to him – he switches it off himself once he
        can (control/executor.py _async_team_hands).
        """
        switched_off: dict[str, Any] = self.executor.data["automations_off"]
        lent: dict[str, Any] = self.executor.data["automations_lent"]
        found = self.automations()
        if entity_ids is None:
            entity_ids = [
                a["entity_id"] for a in found if (a["switched_off"] if on else a["on"])
            ]
        if not on:
            later, reason = self.executor.team_cannot_take(found)
            stamp = dt_util.now().isoformat(timespec="seconds")
            for entity_id in entity_ids:
                if entity_id in later:
                    lent[entity_id] = {"at": stamp, "reason": reason}
                else:
                    lent.pop(entity_id, None)
            entity_ids = [e for e in entity_ids if e not in later]
        german = (self._hass.config.language or "").startswith("de")
        if on:
            message = (
                "wurde von Energy Joe wieder eingeschaltet"
                if german
                else "was switched on again by Energy Joe"
            )
        else:
            message = (
                "wurde von Energy Joe ausgeschaltet, damit sie die Steuerung der "
                "Speicher nicht überschreibt"
                if german
                else "was switched off by Energy Joe so that it does not overwrite "
                "Energy Joe's battery steering"
            )
        failed = await battery_automations.async_switch(
            self._hass, entity_ids, on, switched_off, message
        )
        await self.executor.async_save()
        return failed

    async def async_refresh_plan(self) -> dict[str, Any] | None:
        """Plan again now (the panel's "plan again")."""
        if not self.planner.active:
            return None
        return await self.planner.async_refresh()

    async def async_action_tonight(
        self,
        action_id: str,
        on: bool,
        target: float | None = None,
        unit: str = "%",
    ) -> None:
        """Run a night action tonight regardless of the forecast (or not), and plan again."""
        await self.executor.async_action_tonight(action_id, on, target, unit)
        if self.planner.active:
            await self.planner.async_refresh()

    async def async_reset_learning(self, scope: str = "all") -> bool:
        """Forget what Joe learned, everything or one area (the panel's reset buttons)."""
        if scope == "climate":
            # The warm-up rates live with the heating, not in what the learner keeps.
            await self.climate.async_reset_rates()
            return True
        if not self.learner.active:
            return False
        await self.learner.async_reset(scope)
        if scope == "all":
            await self.climate.async_reset_rates()
        return True

    async def async_answer_day(self, day: str, answer: str) -> bool:
        """The user's answer to "what was special about this day?"."""
        if not self.learner.active:
            return False
        await self.learner.async_answer(day, answer)
        return True

    @callback
    def _history_filled(self) -> None:
        """The history brought in past days: learn from them now, not tomorrow."""
        if self.learner.active:
            self._hass.async_create_task(
                self.learner.async_relearn(), eager_start=False
            )

    @callback
    def async_rebuild_history(self) -> bool:
        """Read the history again (after other sensors were chosen)."""
        if not self.observer.active:
            return False
        self.observer.start_backfill(BACKFILL_DAYS, rebuild=True)
        return True

    @property
    def state(self) -> dict[str, Any]:
        """Return a copy of everything the panel shows live."""
        return deepcopy(
            {
                **self._state,
                "config": self._config,
                "observe": self.observer.status,
                "plan": self.planner.plan,
                "results": self.learner.results,
                "questions": self.learner.questions,
                "control": self.executor.view,
                "mailbox": self.inbox.status,
                "accounts": self.accounts.status,
                "climate": self.climate.status,
                "cars": self.cars.status,
                # Each battery's floor and where it comes from (user, device, unknown).
                "floors": {
                    b["id"]: dict(
                        zip(
                            ("value", "source", "device"),
                            (
                                *battery_floor(
                                    self._hass, b, self.executor.data["saved"]
                                ),
                                device_floor(
                                    self._hass, b, self.executor.data["saved"]
                                ),
                            ),
                            strict=True,
                        )
                    )
                    for b in self._config.get("batteries") or []
                },
                # A configuration Joe could not read at the start (see
                # _async_load_config): offered to take back.
                "config_backup": self._backup_view(),
                # Energy Joe's own apps for signing in (else one's own is needed).
                "apps": {
                    "microsoft": oauth.client_for(None) is not None,
                    "google": bool(
                        oauth.JOE_GOOGLE_CLIENT_ID and oauth.JOE_GOOGLE_CLIENT_SECRET
                    ),
                },
            }
        )

    @property
    def config(self) -> dict[str, Any]:
        """Return a copy of the configuration."""
        return deepcopy(self._config)

    @callback
    def async_set_mode(self, mode: str) -> None:
        """Switch between simulation, live and off."""
        if mode not in AVAILABLE_MODES:
            raise ValueError(f"Mode not available: {mode}")
        if self._state["mode"] != mode:
            self._state["mode"] = mode
            self._changed(state=True)
            self._update_observer()
            self._check_control()

    @callback
    def async_set_onboarding(
        self, *, step: str | None = None, completed: bool | None = None
    ) -> None:
        """Remember how far the setup in the panel has come."""
        onboarding = self._state["onboarding"]
        if step is not None:
            if step not in ONBOARDING_STEPS:
                raise ValueError(f"Unknown onboarding step: {step}")
            onboarding["step"] = step
        if completed is not None:
            onboarding["completed"] = completed
        self._changed(state=True)
        self._update_observer()

    @callback
    def async_update_config(
        self, patch: dict[str, Any], source: str, detail: str | None = None
    ) -> None:
        """Merge a partial configuration update (raises vol.Invalid)."""
        config = model.apply_update(self._config, patch, source, detail)
        self._config = model.prefer_learned(config)
        self.accounts.async_apply()
        self._changed(config=True)
        self._update_observer()
        self._check_control()
        if self._started:
            self.inbox.async_apply()
            self.climate.async_start()
            self.cars.apply()

    @callback
    def async_replace_config(self, data: dict[str, Any]) -> None:
        """Take a whole configuration (an imported backup; raises vol.Invalid)."""
        self._config = model.prefer_learned(model.migrate(data))
        self.accounts.async_apply()
        self._changed(config=True)
        self._update_observer()
        self._check_control()
        if self._started:
            self.inbox.async_apply()
            self.climate.async_start()
            self.cars.apply()

    @callback
    def async_adopt(
        self, proposal: dict[str, Any], withdrawn: list[str] | None = None
    ) -> None:
        """Take over what discovery found; user and learned values stay."""
        adopted = model.adopt_proposal(self._config, proposal, withdrawn=withdrawn)
        if adopted is not self._config:
            self._config = adopted
            self._changed(config=True)
            self._update_observer()
        if self._started:
            self._hass.async_create_task(self.async_car_updates(), eager_start=False)

    @callback
    def async_notify_changed(self) -> None:
        """Send the state again (e.g. after a test run ended early)."""
        self._changed()

    @callback
    def _check_control(self) -> None:
        """Mode or configuration changed: the executor looks again right away."""
        if self._started and self.executor.active:
            self.executor.schedule_ask()
            self._hass.async_create_task(self.executor.async_check(), eager_start=False)

    @callback
    def async_subscribe(self, listener: StateListener) -> CALLBACK_TYPE:
        """Call listener with every new state; returns the unsubscribe function."""
        self._listeners.add(listener)
        return lambda: self._listeners.discard(listener)

    @callback
    def _update_observer(self) -> None:
        """Start, restart or stop watching to match mode, setup and sensors."""
        if not self._started:
            return
        wanted = (
            self._state["onboarding"]["completed"]
            and self._state["mode"] != "off"
            and _has_inputs(self._config)
        )
        observed = _observed_parts(self._config) if wanted else None
        planned = _planned_parts(self._config) if wanted else None
        if observed == self._observed and planned == self._planned:
            return
        restart = observed != self._observed
        self._observed, self._planned = observed, planned
        self._hass.async_create_task(
            self._async_apply_observer(restart), eager_start=False
        )

    async def _async_apply_observer(self, restart: bool) -> None:
        async with self._observe_lock:
            if not self._started:
                return
            if self._observed is None:
                await self.learner.async_stop()
                await self.planner.async_stop()
                await self.observer.async_stop()
                return
            if restart or not self.observer.active:
                await self.observer.async_start(self.config)
                await self.planner.async_start(self.config)
                await self.learner.async_start()
            else:
                # Only rules, the tariff or learned values changed: plan again.
                await self.planner.async_update(self.config)

    @callback
    def _changed(self, *, state: bool = False, config: bool = False) -> None:
        if state:
            self._state_store.async_delay_save(lambda: self._state, SAVE_DELAY)
        if config:
            self._config_store.async_delay_save(lambda: self._config, SAVE_DELAY)
        snapshot = self.state
        for listener in list(self._listeners):
            listener(snapshot)


def _has_inputs(config: dict[str, Any]) -> bool:
    """Whether Joe has anything to watch."""
    m = config["measurements"]
    return bool(
        m["grid_power"] or m["home_power"] or m["solar_power"] or config["batteries"]
    )


def _observed_parts(config: dict[str, Any]) -> dict[str, Any]:
    """The parts of the configuration the observer depends on."""
    return {
        "measurements": config["measurements"],
        "batteries": [
            (b["id"], b["power"], b["soc_entity"]) for b in config["batteries"]
        ],
        # The days off of the climate page are not the observer's.
        "context": {
            k: v for k, v in config["context"].items() if k != "free_day_entities"
        },
        "persons": [(p["id"], p["person_entity"]) for p in config["persons"]],
        "consumers": [
            (c["id"], c["energy_entity"], c["kind"]) for c in config["consumers"]
        ],
        "forecast": config["forecast"],
    }


# What Joe learned that the plan uses.
PLANNED_LEARNED = (
    "solar_factor",
    "solar_shift",
    "consumption_model",
    "group_models",
    "presence",
    "solar_classes",
    "sources",
    "battery_models",
    "action_models",
    "car_models",
)


def _planned_parts(config: dict[str, Any]) -> dict[str, Any]:
    """The parts of the configuration only the plan depends on."""
    return {
        "tariff": config["tariff"],
        "rules": config["rules"],
        "learned": {k: v for k, v in config["learned"].items() if k in PLANNED_LEARNED},
        "actions": config["actions"],
        "cars": config["cars"],
        "calendar": config["calendar"],
        "routing": config["routing"],
        "calendars": [(p["id"], p["calendars"]) for p in config["persons"]],
        "batteries": [
            (
                b["capacity_kwh"],
                b["capacity_entity"],
                b["max_charge_w"],
                b["max_discharge_w"],
                b["adapter"],
                b["name"],
            )
            for b in config["batteries"]
        ],
    }


def _with_defaults(stored: dict[str, Any], defaults: dict[str, Any]) -> dict[str, Any]:
    """Return stored data with all keys from defaults present (one level deep)."""
    data = deepcopy(defaults)
    for key, value in stored.items():
        if isinstance(value, dict) and isinstance(data.get(key), dict):
            data[key].update(value)
        else:
            data[key] = value
    return data
