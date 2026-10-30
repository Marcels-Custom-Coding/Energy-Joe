"""Panel subscriptions survive a reload of the integration."""

from __future__ import annotations

from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.energy_joe.const import DOMAIN
from custom_components.energy_joe.runtime import DATA_RUNTIME
from homeassistant.core import HomeAssistant


async def test_subscription_moves_to_the_new_runtime_on_reload(
    ready_hass: HomeAssistant, hass_ws_client: WebSocketGenerator
) -> None:
    """After a reload the open subscription gets the new runtime's state."""
    hass = ready_hass
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)

    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": f"{DOMAIN}/subscribe"})
    sub_id = (await client.receive_json())["id"]
    assert (await client.receive_json())["type"] == "event"
    old = hass.data[DATA_RUNTIME]

    assert await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    new = hass.data[DATA_RUNTIME]
    assert new is not old
    assert not old._listeners
    listening = len(new._listeners)

    # The new runtime's state reaches the client on the same subscription.
    msg = await client.receive_json()
    assert msg["id"] == sub_id
    assert msg["type"] == "event"

    # Closing the subscription lets go of the new runtime too.
    await client.send_json_auto_id(
        {"type": "unsubscribe_events", "subscription": sub_id}
    )
    while (msg := await client.receive_json())["type"] != "result":
        pass
    assert msg["success"]
    assert len(new._listeners) == listening - 1


async def test_unload_lets_go_of_the_runtime(
    ready_hass: HomeAssistant, hass_ws_client: WebSocketGenerator
) -> None:
    """While Joe is unloaded, no subscription keeps the old runtime alive."""
    hass = ready_hass
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)

    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": f"{DOMAIN}/subscribe"})
    await client.receive_json()
    await client.receive_json()
    old = hass.data[DATA_RUNTIME]

    assert await hass.config_entries.async_unload(entry.entry_id)
    assert not old._listeners
