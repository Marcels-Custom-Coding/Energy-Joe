"""Websocket API used by the Energy Joe panel."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.const import __version__ as HA_VERSION
from homeassistant.core import HomeAssistant, callback
from homeassistant.loader import async_get_integration

from .const import DOMAIN


@callback
def async_register(hass: HomeAssistant) -> None:
    """Register all websocket commands."""
    websocket_api.async_register_command(hass, ws_info)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/info"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_info(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return version information and what Joe can already see."""
    integration = await async_get_integration(hass, DOMAIN)
    connection.send_result(
        msg["id"],
        {
            "version": str(integration.version),
            "ha_version": HA_VERSION,
            "energy": await _async_energy_summary(hass),
        },
    )


async def _async_energy_summary(hass: HomeAssistant) -> dict[str, Any]:
    """Summarize the Energy dashboard configuration, if there is one."""
    if "energy" not in hass.config.components:
        return {"available": False}

    # Imported lazily: the energy integration is optional for Energy Joe.
    from homeassistant.components.energy.data import async_get_manager

    manager = await async_get_manager(hass)
    prefs = manager.data
    if not prefs:
        return {"available": True, "configured": False}

    sources = prefs.get("energy_sources", [])
    return {
        "available": True,
        "configured": True,
        "sources": {
            kind: sum(1 for source in sources if source.get("type") == kind)
            for kind in ("grid", "solar", "battery", "gas", "water")
        },
        "devices": len(prefs.get("device_consumption", [])),
    }
