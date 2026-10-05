"""The helper that says "someone is home" (created on request from the panel).

A template binary sensor of Home Assistant itself: on while one of the chosen
persons is home or the guest switch is on. It is an ordinary helper of the
user's, so it keeps working without Energy Joe.
"""

from __future__ import annotations

import asyncio

from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.helpers import entity_registry as er

# How long to wait for the new helper's entity (seconds).
WAIT = 10.0


class PresenceError(Exception):
    """The helper could not be created."""


def presence_template(persons: list[str], guest: str | None) -> str:
    """On while a person is home or the guest switch is on."""
    parts = [f"is_state('{entity}', 'home')" for entity in persons]
    if guest:
        parts.append(f"is_state('{guest}', 'on')")
    return "{{ " + (" or ".join(parts) or "false") + " }}"


async def async_create_presence(
    hass: HomeAssistant, name: str, persons: list[str], guest: str | None
) -> str:
    """Create the helper through Home Assistant's own helper flow; its entity id."""
    flows = hass.config_entries.flow
    result = await flows.async_init("template", context={"source": "user"})
    if result["type"] == FlowResultType.MENU:
        result = await flows.async_configure(
            result["flow_id"], {"next_step_id": "binary_sensor"}
        )
    if result["type"] != FlowResultType.FORM:
        raise PresenceError(f"unexpected step {result['type']}")
    result = await flows.async_configure(
        result["flow_id"],
        {
            "name": name,
            "state": presence_template(persons, guest),
            "device_class": "presence",
        },
    )
    if result["type"] != FlowResultType.CREATE_ENTRY:
        raise PresenceError(str(result.get("errors") or result["type"]))
    entry_id = result["result"].entry_id
    registry = er.async_get(hass)
    for _ in range(int(WAIT * 10)):
        if found := er.async_entries_for_config_entry(registry, entry_id):
            return found[0].entity_id
        await asyncio.sleep(0.1)
    raise PresenceError("no entity")
