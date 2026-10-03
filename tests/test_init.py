"""Tests for setting up and removing Energy Joe."""

from __future__ import annotations

from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.energy_joe.const import (
    DOMAIN,
    PANEL_BUNDLE,
    PANEL_URL_PATH,
    PANEL_WEBCOMPONENT,
    STATIC_URL,
)
from homeassistant.components.frontend import DATA_PANELS
from homeassistant.core import HomeAssistant


async def test_panel_appears_and_disappears(ready_hass: HomeAssistant) -> None:
    """Setting up adds the sidebar panel, unloading removes it, reloading works."""
    hass = ready_hass
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)

    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    panel = hass.data[DATA_PANELS][PANEL_URL_PATH]
    custom = panel.config["_panel_custom"]
    assert custom["name"] == PANEL_WEBCOMPONENT
    assert custom["module_url"].startswith(f"{STATIC_URL}/{PANEL_BUNDLE}?v=")
    assert "missing" not in custom["module_url"]
    assert panel.require_admin

    assert await hass.config_entries.async_unload(entry.entry_id)
    assert PANEL_URL_PATH not in hass.data[DATA_PANELS]

    # The static route survives the unload; setting up again must not fail.
    assert await hass.config_entries.async_setup(entry.entry_id)
    assert PANEL_URL_PATH in hass.data[DATA_PANELS]
