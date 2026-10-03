"""Switches: skip tonight, and "tonight" for each night action."""

from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .entity import JoeEntity
from .runtime import DATA_RUNTIME, JoeRuntime


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    runtime = hass.data[DATA_RUNTIME]
    async_add_entities([JoeSkipSwitch(runtime, entry, "skip_tonight")])
    known: set[str] = set()

    @callback
    def add_actions(_: Any = None) -> None:
        """Night actions added in the panel get their switch right away."""
        new = [a for a in runtime.config["actions"] if a["id"] not in known]
        known.update(a["id"] for a in new)
        if new:
            async_add_entities([JoeActionSwitch(runtime, entry, a["id"]) for a in new])

    add_actions()
    entry.async_on_unload(runtime.async_subscribe(add_actions))


def _night(runtime: JoeRuntime) -> str | None:
    return ((runtime.planner.plan or {}).get("window") or {}).get("start")


class JoeSkipSwitch(JoeEntity, SwitchEntity):
    """On: no steering this night; switches itself off for the next one."""

    @property
    def is_on(self) -> bool:
        night = _night(self.runtime)
        return bool(night) and self.runtime.executor.data["skip"] == night

    async def async_turn_on(self, **kwargs: Any) -> None:
        await self.runtime.executor.async_skip(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self.runtime.executor.async_skip(False)


class JoeActionSwitch(JoeEntity, SwitchEntity):
    """On: this night action runs in the coming night, whatever the forecast says."""

    def __init__(self, runtime: JoeRuntime, entry: ConfigEntry, action_id: str) -> None:
        super().__init__(runtime, entry, "action_tonight")
        self.action_id = action_id
        self._attr_unique_id = f"{entry.entry_id}_action_{action_id}"
        self._attr_translation_placeholders = {"action": self._action_name()}

    def _action(self) -> dict[str, Any] | None:
        return next(
            (a for a in self.runtime.config["actions"] if a["id"] == self.action_id),
            None,
        )

    def _action_name(self) -> str:
        action = self._action()
        return action["name"] if action else self.action_id

    @property
    def available(self) -> bool:
        return self._action() is not None

    @property
    def is_on(self) -> bool:
        night = _night(self.runtime)
        return (
            bool(night)
            and self.runtime.executor.data["tonight"].get(self.action_id) == night
        )

    async def async_turn_on(self, **kwargs: Any) -> None:
        await self.runtime.async_action_tonight(self.action_id, True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self.runtime.async_action_tonight(self.action_id, False)

    @callback
    def _on_state(self, state: dict[str, Any]) -> None:
        if self._action() is None and self.registry_entry:
            # The action was deleted in the panel: its switch goes, too.
            er.async_get(self.hass).async_remove(self.entity_id)
            return
        super()._on_state(state)
