"""Numbers: the rates and the reserve of an inverter Joe steers over Modbus."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .runtime import DATA_RUNTIME


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    runtime = hass.data[DATA_RUNTIME]
    entry.async_on_unload(
        runtime.modbus.async_register_platform("number", async_add_entities)
    )
