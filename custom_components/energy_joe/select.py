"""The operating mode as a select: simulation, suggest, live or off."""

from __future__ import annotations

from homeassistant.components.select import SelectEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .entity import JoeEntity
from .runtime import DATA_RUNTIME, MODES


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    async_add_entities([JoeModeSelect(hass.data[DATA_RUNTIME], entry, "mode")])


class JoeModeSelect(JoeEntity, SelectEntity):
    """What Joe does: simulate, suggest, steer or rest."""

    _attr_options = list(MODES)

    @property
    def current_option(self) -> str:
        return self.runtime.state["mode"]

    async def async_select_option(self, option: str) -> None:
        self.runtime.async_set_mode(option)
