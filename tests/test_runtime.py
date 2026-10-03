"""Tests for Joe's state and the live channel to the panel."""

from __future__ import annotations

from typing import Any

from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.energy_joe import model
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
    assert first["mode"] == "simulation"
    assert first["onboarding"] == {"step": "welcome", "completed": False}
    assert first["config"]["version"] == model.CONFIG_VERSION

    await client.send_json_auto_id({"type": f"{DOMAIN}/set_mode", "mode": "off"})
    events, result = await _until_result(client)
    assert events[0]["mode"] == "off"
    assert result["success"]

    await client.send_json_auto_id(
        {"type": f"{DOMAIN}/onboarding", "step": "scan", "completed": False}
    )
    events, result = await _until_result(client)
    assert events[-1]["onboarding"] == {"step": "scan", "completed": False}
    assert result["success"]


async def _until_result(client: Any) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    """State events up to the answer of the last command."""
    events = []
    while True:
        msg = await client.receive_json()
        if msg["type"] == "event":
            events.append(msg["event"])
        else:
            return events, msg


async def test_all_modes_are_available(
    ready_hass: HomeAssistant, hass_ws_client: WebSocketGenerator
) -> None:
    """Simulation, suggest, live and off can be chosen."""
    await _setup(ready_hass)
    client = await hass_ws_client(ready_hass)

    for mode in ("advisory", "live", "simulation"):
        await client.send_json_auto_id({"type": f"{DOMAIN}/set_mode", "mode": mode})
        msg = await client.receive_json()
        assert msg["success"]
        assert ready_hass.data[DOMAIN].state["mode"] == mode


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


async def test_config_update_via_api(
    ready_hass: HomeAssistant, hass_ws_client: WebSocketGenerator
) -> None:
    """Valid updates are stored with their origin; invalid ones are refused."""
    await _setup(ready_hass)
    client = await hass_ws_client(ready_hass)

    await client.send_json_auto_id(
        {
            "type": f"{DOMAIN}/config/update",
            "patch": {
                "tariff": {
                    "kind": "fixed_window",
                    "window": {"start": "00:00", "end": "05:00"},
                }
            },
            "source": "read",
            "detail": "sensor.price",
        }
    )
    assert (await client.receive_json())["success"]
    config = ready_hass.data[DOMAIN].config
    assert config["tariff"]["window"] == {"start": "00:00", "end": "05:00"}
    assert config["provenance"]["tariff.kind"]["source"] == "read"

    await client.send_json_auto_id(
        {"type": f"{DOMAIN}/config/update", "patch": {"rules": {"reserve_soc": 150}}}
    )
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "invalid_config"
    assert ready_hass.data[DOMAIN].config["rules"]["reserve_soc"] == 10


async def test_config_survives_reload(ready_hass: HomeAssistant) -> None:
    """Configuration is stored and loaded again."""
    hass = ready_hass
    entry = await _setup(hass)
    hass.data[DOMAIN].async_update_config({"rules": {"reserve_soc": 20}}, "user")

    assert await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()

    assert hass.data[DOMAIN].config["rules"]["reserve_soc"] == 20
