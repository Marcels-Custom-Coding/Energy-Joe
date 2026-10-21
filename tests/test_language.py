"""Joe's own words outside the panel (the phone, the logbook) follow the
language the panel shows, as last seen; before that Home Assistant's."""

from __future__ import annotations

from typing import Any

from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.energy_joe.const import DOMAIN
from homeassistant.core import HomeAssistant


async def test_joes_words_follow_the_panels_language(
    ready_hass: HomeAssistant, hass_ws_client: Any
) -> None:
    hass = ready_hass
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    runtime = hass.data[DOMAIN]
    # Home Assistant speaks English: so does Joe, until the panel says otherwise.
    hass.config.language = "en"
    assert runtime.executor.language() == "en"
    assert runtime.notifier._text("problem.title") == "Energy Joe needs you"
    ws = await hass_ws_client(hass)

    async def result() -> dict[str, Any]:
        """The next answer (the subscription's events come in between)."""
        while True:
            message = await ws.receive_json()
            if "success" in message:
                return message

    await ws.send_json_auto_id({"type": f"{DOMAIN}/subscribe", "language": "de-DE"})
    assert (await result())["success"]
    assert runtime._state["language"] == "de"
    assert runtime.executor.language() == "de"
    assert runtime.notifier._text("problem.title") == "Energy Joe braucht dich"
    # The panel in English again: English words.
    await ws.send_json_auto_id({"type": f"{DOMAIN}/subscribe", "language": "en"})
    assert (await result())["success"]
    assert runtime.executor.language() == "en"
    assert await hass.config_entries.async_unload(entry.entry_id)
