"""Joe's persisted state and the live channel to the panel."""

from __future__ import annotations

from collections.abc import Callable
from copy import deepcopy
from typing import Any

from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers.storage import Store
from homeassistant.util.hass_dict import HassKey

from .const import DOMAIN

STORAGE_VERSION = 1
STORAGE_KEY = DOMAIN
SAVE_DELAY = 2

MODES = ("simulation", "live", "off")
# "live" becomes available once Joe can control devices.
AVAILABLE_MODES = ("simulation", "off")
ONBOARDING_STEPS = ("welcome", "scan", "questions", "done")

DEFAULT_DATA: dict[str, Any] = {
    "mode": "simulation",
    "onboarding": {"step": "welcome", "completed": False},
}

DATA_RUNTIME: HassKey[JoeRuntime] = HassKey(DOMAIN)

type StateListener = Callable[[dict[str, Any]], None]


class JoeRuntime:
    """Holds Joe's persisted state and notifies subscribers about changes."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize with defaults; call async_load before use."""
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._data: dict[str, Any] = deepcopy(DEFAULT_DATA)
        self._listeners: set[StateListener] = set()

    async def async_load(self) -> None:
        """Load the stored state, keeping defaults for missing keys."""
        if stored := await self._store.async_load():
            self._data = _with_defaults(stored, DEFAULT_DATA)

    async def async_unload(self) -> None:
        """Write pending changes immediately."""
        await self._store.async_save(self._data)

    async def async_remove(self) -> None:
        """Delete the stored state (integration removed)."""
        await self._store.async_remove()

    @property
    def state(self) -> dict[str, Any]:
        """Return a copy of the current state."""
        return deepcopy(self._data)

    @callback
    def async_set_mode(self, mode: str) -> None:
        """Switch between simulation, live and off."""
        if mode not in AVAILABLE_MODES:
            raise ValueError(f"Mode not available: {mode}")
        if self._data["mode"] != mode:
            self._data["mode"] = mode
            self._changed()

    @callback
    def async_set_onboarding(
        self, *, step: str | None = None, completed: bool | None = None
    ) -> None:
        """Remember how far the setup in the panel has come."""
        onboarding = self._data["onboarding"]
        if step is not None:
            if step not in ONBOARDING_STEPS:
                raise ValueError(f"Unknown onboarding step: {step}")
            onboarding["step"] = step
        if completed is not None:
            onboarding["completed"] = completed
        self._changed()

    @callback
    def async_subscribe(self, listener: StateListener) -> CALLBACK_TYPE:
        """Call listener with every new state; returns the unsubscribe function."""
        self._listeners.add(listener)
        return lambda: self._listeners.discard(listener)

    @callback
    def _changed(self) -> None:
        self._store.async_delay_save(lambda: self._data, SAVE_DELAY)
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
