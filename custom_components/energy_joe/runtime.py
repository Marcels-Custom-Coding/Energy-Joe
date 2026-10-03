"""Joe's persisted state and configuration, and the live channel to the panel."""

from __future__ import annotations

import asyncio
from collections.abc import Callable
from copy import deepcopy
import logging
from typing import Any

import voluptuous as vol

from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers.storage import Store
from homeassistant.util.hass_dict import HassKey

from . import model
from .const import DOMAIN
from .observe.observer import BACKFILL_DAYS, JoeObserver
from .observe.store import HistoryStore
from .plan.scheduler import JoePlanner

_LOGGER = logging.getLogger(__name__)

STATE_VERSION = 1
STATE_KEY = f"{DOMAIN}.state"
CONFIG_KEY = f"{DOMAIN}.config"
SAVE_DELAY = 2

MODES = ("simulation", "live", "off")
# "live" becomes available once Joe can control devices.
AVAILABLE_MODES = ("simulation", "off")
ONBOARDING_STEPS = ("welcome", "scan", "questions", "done")

DEFAULT_STATE: dict[str, Any] = {
    "mode": "simulation",
    "onboarding": {"step": "welcome", "completed": False},
}

DATA_RUNTIME: HassKey[JoeRuntime] = HassKey(DOMAIN)

type StateListener = Callable[[dict[str, Any]], None]


class _ConfigStore(Store[dict[str, Any]]):
    """Store that migrates older configuration versions on load."""

    async def _async_migrate_func(
        self, old_major_version: int, old_minor_version: int, old_data: dict[str, Any]
    ) -> dict[str, Any]:
        return model.migrate(old_data)


class JoeRuntime:
    """Holds Joe's state and configuration and notifies subscribers about changes."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize with defaults; call async_load before use."""
        self._state_store: Store[dict[str, Any]] = Store(hass, STATE_VERSION, STATE_KEY)
        self._config_store = _ConfigStore(hass, model.CONFIG_VERSION, CONFIG_KEY)
        self._backup_store: Store[dict[str, Any]] = Store(
            hass, model.CONFIG_VERSION, f"{CONFIG_KEY}.unreadable"
        )
        self._hass = hass
        self._state: dict[str, Any] = deepcopy(DEFAULT_STATE)
        self._config: dict[str, Any] = model.default_config()
        self._listeners: set[StateListener] = set()
        self.history = HistoryStore(hass)
        self.observer = JoeObserver(hass, self.history, self._changed)
        self.planner = JoePlanner(hass, self.history, self._changed)
        self._started = False
        self._planned: dict[str, Any] | None = None
        self._observed: dict[str, Any] | None = None
        self._observe_lock = asyncio.Lock()

    async def async_load(self) -> None:
        """Load stored state and configuration."""
        if stored := await self._state_store.async_load():
            self._state = _with_defaults(stored, DEFAULT_STATE)
        if stored := await self._config_store.async_load():
            try:
                self._config = model.validate(stored)
            except vol.Invalid as err:
                # Keep a copy instead of silently overwriting the user's data.
                _LOGGER.error(
                    "Stored configuration is invalid, starting fresh: %s", err
                )
                await self._backup_store.async_save(stored)
        await self.history.async_load()

    async def async_unload(self) -> None:
        """Stop watching and write pending changes immediately."""
        self._started = False
        async with self._observe_lock:
            await self.planner.async_stop()
            await self.observer.async_stop()
        await self.history.async_unload()
        await self._state_store.async_save(self._state)
        await self._config_store.async_save(self._config)

    async def async_remove(self) -> None:
        """Delete all stored data (integration removed)."""
        await self._state_store.async_remove()
        await self._config_store.async_remove()
        await self._backup_store.async_remove()
        await self.history.async_remove()

    @callback
    def async_start(self) -> None:
        """Home Assistant is running: Joe may start watching."""
        self._started = True
        self._update_observer()

    async def async_refresh_plan(self) -> dict[str, Any] | None:
        """Plan again now (the panel's "plan again")."""
        if not self.planner.active:
            return None
        return await self.planner.async_refresh()

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
        self._config = model.apply_update(self._config, patch, source, detail)
        self._changed(config=True)
        self._update_observer()

    @callback
    def async_adopt(self, proposal: dict[str, Any]) -> None:
        """Take over what discovery found; user and learned values stay."""
        adopted = model.adopt_proposal(self._config, proposal)
        if adopted is not self._config:
            self._config = adopted
            self._changed(config=True)
            self._update_observer()

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
                await self.planner.async_stop()
                await self.observer.async_stop()
                return
            if restart or not self.observer.active:
                await self.observer.async_start(self.config)
                await self.planner.async_start(self.config)
            else:
                # Only rules or the tariff changed: plan again.
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
        "context": config["context"],
        "persons": [(p["id"], p["person_entity"]) for p in config["persons"]],
        "consumers": [
            (c["id"], c["energy_entity"], c["kind"]) for c in config["consumers"]
        ],
        "forecast": config["forecast"],
    }


def _planned_parts(config: dict[str, Any]) -> dict[str, Any]:
    """The parts of the configuration only the plan depends on."""
    return {
        "tariff": config["tariff"],
        "rules": config["rules"],
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
