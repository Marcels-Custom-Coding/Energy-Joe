"""Buttons: give everything back now, and plan again."""

from __future__ import annotations

from homeassistant.components.button import ButtonEntity
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
    runtime = hass.data[DATA_RUNTIME]
    async_add_entities(
        [
            JoeReleaseButton(runtime, entry, "release"),
            JoeReplanButton(runtime, entry, "replan"),
        ]
    )


class JoeReleaseButton(JoeEntity, ButtonEntity):
    """Emergency release: every value back, no steering tonight."""

    async def async_press(self) -> None:
        await self.runtime.executor.async_release_now()


class JoeReplanButton(JoeEntity, ButtonEntity):
    """Plan again with the latest values (a fixed plan stays)."""

    async def async_press(self) -> None:
        await self.runtime.async_refresh_plan()
