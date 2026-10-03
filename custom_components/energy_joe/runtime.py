"""Joe's persisted state and configuration, and the live channel to the panel."""

from __future__ import annotations

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
        self._state: dict[str, Any] = deepcopy(DEFAULT_STATE)
        self._config: dict[str, Any] = model.default_config()
        self._listeners: set[StateListener] = set()

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

    async def async_unload(self) -> None:
        """Write pending changes immediately."""
        await self._state_store.async_save(self._state)
        await self._config_store.async_save(self._config)

    async def async_remove(self) -> None:
        """Delete all stored data (integration removed)."""
        await self._state_store.async_remove()
        await self._config_store.async_remove()
        await self._backup_store.async_remove()

    @property
    def state(self) -> dict[str, Any]:
        """Return a copy of everything the panel shows live."""
        return deepcopy({**self._state, "config": self._config})

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

    @callback
    def async_update_config(
        self, patch: dict[str, Any], source: str, detail: str | None = None
    ) -> None:
        """Merge a partial configuration update (raises vol.Invalid)."""
        self._config = model.apply_update(self._config, patch, source, detail)
        self._changed(config=True)

    @callback
    def async_subscribe(self, listener: StateListener) -> CALLBACK_TYPE:
        """Call listener with every new state; returns the unsubscribe function."""
        self._listeners.add(listener)
        return lambda: self._listeners.discard(listener)

    @callback
    def _changed(self, *, state: bool = False, config: bool = False) -> None:
        if state:
            self._state_store.async_delay_save(lambda: self._state, SAVE_DELAY)
        if config:
            self._config_store.async_delay_save(lambda: self._config, SAVE_DELAY)
        snapshot = self.state
        for listener in list(self._listeners):
            listener(snapshot)


def _with_defaults(stored: dict[str, Any], defaults: dict[str, Any]) -> dict[str, Any]:
    """Return stored data with all keys from defaults present (one level deep)."""
    data = deepcopy(defaults)
    for key, value in stored.items():
        if isinstance(value, dict) and isinstance(data.get(key), dict):
            data[key].update(value)
        else:
            data[key] = value
    return data
