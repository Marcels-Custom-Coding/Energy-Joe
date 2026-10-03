"""Tests for the websocket API."""

from __future__ import annotations

from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.energy_joe.const import DOMAIN
from homeassistant.const import __version__ as HA_VERSION
from homeassistant.core import HomeAssistant


async def test_info_without_energy_dashboard(
    ready_hass: HomeAssistant, hass_ws_client: WebSocketGenerator
) -> None:
    """Info reports versions and that no Energy dashboard is available."""
    hass = ready_hass
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)

    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": f"{DOMAIN}/info"})
    msg = await client.receive_json()

    assert msg["success"]
    assert msg["result"]["ha_version"] == HA_VERSION
    assert msg["result"]["version"] == "0.1.0"
    assert msg["result"]["energy"] == {"available": False}
    assert msg["result"]["defaults"]["rules"]["reserve_soc"] == 10
