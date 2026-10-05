"""Tests for the websocket API."""

from __future__ import annotations

import json
from pathlib import Path

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
    manifest = (
        Path(__file__).parent.parent / "custom_components/energy_joe/manifest.json"
    )
    assert msg["result"]["version"] == json.loads(manifest.read_text())["version"]
    assert msg["result"]["energy"] == {"available": False}
    assert msg["result"]["defaults"]["rules"]["reserve_soc"] == 10


async def test_create_the_presence_helper(
    ready_hass: HomeAssistant, hass_ws_client: WebSocketGenerator
) -> None:
    """A template helper of Home Assistant: on while a person is home or a guest is there."""
    hass = ready_hass
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    hass.states.async_set("person.anna", "not_home")
    hass.states.async_set("device_tracker.gast", "not_home")

    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {
            "type": f"{DOMAIN}/presence/create",
            "name": "Jemand zu Hause",
            "persons": ["person.anna"],
            "guest": "device_tracker.gast",
        }
    )
    msg = await client.receive_json()
    assert msg["success"], msg
    entity_id = msg["result"]["entity_id"]
    assert entity_id.startswith("binary_sensor.")
    await hass.async_block_till_done()
    assert hass.states.get(entity_id).state == "off"
    hass.states.async_set("device_tracker.gast", "home")
    await hass.async_block_till_done()
    assert hass.states.get(entity_id).state == "on"
    runtime = hass.data["energy_joe"]
    assert runtime.config["context"]["presence_entity"] == entity_id


async def test_export_and_import_the_settings(
    ready_hass: HomeAssistant, hass_ws_client: WebSocketGenerator
) -> None:
    """An export taken back in restores the settings; a broken one changes nothing."""
    hass = ready_hass
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    runtime = hass.data["energy_joe"]
    runtime.async_update_config({"rules": {"reserve_soc": 25}}, "user")

    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": f"{DOMAIN}/config/export"})
    exported = (await client.receive_json())["result"]
    assert exported["kind"] == "energy_joe_settings"
    assert exported["config"]["rules"]["reserve_soc"] == 25

    runtime.async_update_config({"rules": {"reserve_soc": 40}}, "user")
    await client.send_json_auto_id(
        {"type": f"{DOMAIN}/config/import", "config": exported["config"]}
    )
    assert (await client.receive_json())["success"]
    assert runtime.config["rules"]["reserve_soc"] == 25

    broken = {**exported["config"], "rules": {"reserve_soc": "viel"}}
    await client.send_json_auto_id(
        {"type": f"{DOMAIN}/config/import", "config": broken}
    )
    msg = await client.receive_json()
    assert not msg["success"] and msg["error"]["code"] == "invalid_settings"
    assert runtime.config["rules"]["reserve_soc"] == 25
