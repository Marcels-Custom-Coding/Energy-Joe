"""Skip tonight: Joe does not steer the coming (or running) night."""

from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .entity import JoeEntity
from .runtime import DATA_RUNTIME


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    async_add_entities([JoeSkipSwitch(hass.data[DATA_RUNTIME], entry, "skip_tonight")])


class JoeSkipSwitch(JoeEntity, SwitchEntity):
    """On: no steering this night; switches itself off for the next one."""

    @property
    def is_on(self) -> bool:
        executor = self.runtime.executor
        plan = self.runtime.planner.plan
        night = ((plan or {}).get("window") or {}).get("start")
        return bool(night) and executor.data["skip"] == night

    async def async_turn_on(self, **kwargs: Any) -> None:
        await self.runtime.executor.async_skip(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self.runtime.executor.async_skip(False)
