"""Joe's entities: one device, updated whenever Joe's state changes."""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import callback
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.entity import Entity

from .const import DOMAIN, NAME
from .runtime import JoeRuntime


class JoeEntity(Entity):
    """Base for Joe's entities: named by translation, pushed on every change."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, runtime: JoeRuntime, entry: ConfigEntry, key: str) -> None:
        self.runtime = runtime
        self._attr_translation_key = key
        self._attr_unique_id = f"{entry.entry_id}_{key}"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name=NAME,
            manufacturer=NAME,
            entry_type=DeviceEntryType.SERVICE,
        )

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(self.runtime.async_subscribe(self._on_state))

    @callback
    def _on_state(self, state: dict[str, Any]) -> None:
        self.async_write_ha_state()
