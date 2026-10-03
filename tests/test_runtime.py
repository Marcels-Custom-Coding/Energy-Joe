"""Tests for Joe's state and the live channel to the panel."""

from __future__ import annotations

from typing import Any

from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.energy_joe.const import DOMAIN
from homeassistant.core import HomeAssistant


async def _setup(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    return entry


async def test_subscribe_sends_state_and_changes(
    ready_hass: HomeAssistant, hass_ws_client: WebSocketGenerator
) -> None:
    """The panel gets the state right away and after each change."""
    await _setup(ready_hass)
    client = await hass_ws_client(ready_hass)

    await client.send_json_auto_id({"type": f"{DOMAIN}/subscribe"})
    assert (await client.receive_json())["success"]
    first: dict[str, Any] = (await client.receive_json())["event"]
    assert first == {
        "mode": "simulation",
        "onboarding": {"step": "welcome", "completed": False},
    }

    await client.send_json_auto_id({"type": f"{DOMAIN}/set_mode", "mode": "off"})
    event = await client.receive_json()
    result = await client.receive_json()
    assert event["event"]["mode"] == "off"
    assert result["success"]

    await client.send_json_auto_id(
        {"type": f"{DOMAIN}/onboarding", "step": "scan", "completed": False}
    )
    event = await client.receive_json()
    assert event["event"]["onboarding"] == {"step": "scan", "completed": False}
    assert (await client.receive_json())["success"]


async def test_live_is_not_available_yet(
    ready_hass: HomeAssistant, hass_ws_client: WebSocketGenerator
) -> None:
    """Joe refuses to go live until he can control devices."""
    await _setup(ready_hass)
    client = await hass_ws_client(ready_hass)

    await client.send_json_auto_id({"type": f"{DOMAIN}/set_mode", "mode": "live"})
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "not_available"


async def test_state_survives_reload(ready_hass: HomeAssistant) -> None:
    """Mode and setup progress are kept across a reload."""
    hass = ready_hass
    entry = await _setup(hass)
    runtime = hass.data[DOMAIN]
    runtime.async_set_mode("off")
    runtime.async_set_onboarding(step="questions")

    assert await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()

    state = hass.data[DOMAIN].state
    assert state["mode"] == "off"
    assert state["onboarding"]["step"] == "questions"
