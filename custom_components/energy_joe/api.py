"""Websocket API used by the Energy Joe panel."""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.const import __version__ as HA_VERSION
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.sun import get_astral_event_date
from homeassistant.loader import async_get_integration
from homeassistant.util import dt as dt_util

from . import model
from .const import DOMAIN
from .discovery import async_check, async_collect, async_discover, discover
from .discovery.checks import run_config_checks
from .observe.records import day_view, summarize
from .runtime import (
    AVAILABLE_MODES,
    DATA_RUNTIME,
    MODES,
    ONBOARDING_STEPS,
    JoeRuntime,
)


@callback
def async_register(hass: HomeAssistant) -> None:
    """Register all websocket commands."""
    websocket_api.async_register_command(hass, ws_info)
    websocket_api.async_register_command(hass, ws_subscribe)
    websocket_api.async_register_command(hass, ws_set_mode)
    websocket_api.async_register_command(hass, ws_onboarding)
    websocket_api.async_register_command(hass, ws_config_update)
    websocket_api.async_register_command(hass, ws_discover)
    websocket_api.async_register_command(hass, ws_adopt)
    websocket_api.async_register_command(hass, ws_check)
    websocket_api.async_register_command(hass, ws_history_days)
    websocket_api.async_register_command(hass, ws_history_day)
    websocket_api.async_register_command(hass, ws_history_rebuild)


def _runtime(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> JoeRuntime | None:
    """Return the runtime or answer with an error if Joe is not set up."""
    if (runtime := hass.data.get(DATA_RUNTIME)) is None:
        connection.send_error(msg["id"], "not_loaded", "Energy Joe is not set up.")
    return runtime


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
            "defaults": {"rules": model.default_config()["rules"]},
        },
    )


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/subscribe"})
@websocket_api.require_admin
@callback
def ws_subscribe(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Send Joe's state now and after every change."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return

    @callback
    def forward(state: dict[str, Any]) -> None:
        connection.send_message(websocket_api.event_message(msg["id"], state))

    connection.subscriptions[msg["id"]] = runtime.async_subscribe(forward)
    connection.send_result(msg["id"])
    forward(runtime.state)


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/set_mode", vol.Required("mode"): vol.In(MODES)}
)
@websocket_api.require_admin
@callback
def ws_set_mode(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Switch between simulation, live and off."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    if msg["mode"] not in AVAILABLE_MODES:
        connection.send_error(
            msg["id"], "not_available", "Joe cannot control devices yet."
        )
        return
    runtime.async_set_mode(msg["mode"])
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/onboarding",
        vol.Optional("step"): vol.In(ONBOARDING_STEPS),
        vol.Optional("completed"): bool,
    }
)
@websocket_api.require_admin
@callback
def ws_onboarding(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Store the progress of the setup in the panel."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    runtime.async_set_onboarding(step=msg.get("step"), completed=msg.get("completed"))
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/config/update",
        vol.Required("patch"): dict,
        vol.Optional("source", default="user"): vol.In(("user", "read", "default")),
        vol.Optional("detail"): str,
    }
)
@websocket_api.require_admin
@callback
def ws_config_update(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Merge a partial configuration update.

    "read" marks values taken from Home Assistant, "default" puts a value back
    to Joe's starting value.
    """
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    try:
        runtime.async_update_config(msg["patch"], msg["source"], msg.get("detail"))
    except vol.Invalid as err:
        connection.send_error(msg["id"], "invalid_config", str(err))
        return
    connection.send_result(msg["id"])


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/discover"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_discover(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Look around Home Assistant and report what Joe can use (read-only)."""
    connection.send_result(msg["id"], await async_discover(hass))


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/adopt"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_adopt(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Look around, take over what Joe found and check the result.

    Values the user set, values Joe learned and things the user told him to
    leave out stay as they are.
    """
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    snap = await async_collect(hass)
    result = discover(snap)
    runtime.async_adopt(result["proposal"])
    connection.send_result(
        msg["id"],
        {"discovery": result, "checks": run_config_checks(snap, runtime.config)},
    )


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/check"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_check(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Check what Joe is configured to use against the current states."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    connection.send_result(
        msg["id"], {"checks": await async_check(hass, runtime.config)}
    )


def _window(runtime: JoeRuntime) -> dict[str, str] | None:
    tariff = runtime.config["tariff"]
    return tariff["window"] if tariff["kind"] == "fixed_window" else None


def _day(value: Any) -> str:
    return date.fromisoformat(value).isoformat()


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/history/days",
        vol.Optional("days", default=14): vol.All(int, vol.Range(min=1, max=400)),
        vol.Optional("until"): _day,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_history_days(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Summaries of the most recent days Joe knows, newest first."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    last = date.fromisoformat(msg.get("until") or dt_util.now().date().isoformat())
    first = last - timedelta(days=msg["days"] - 1)
    days = await runtime.history.async_days(first.isoformat(), last.isoformat())
    window = _window(runtime)
    connection.send_result(
        msg["id"],
        {
            "days": [
                summarize(day, data, window) for day, data in reversed(days.items())
            ],
            **runtime.history.overview(),
        },
    )


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/history/day", vol.Required("date"): _day}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_history_day(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """One day with all its hours, the forecast and the times of the sun."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    data = await runtime.history.async_day(msg["date"]) or {}
    day = date.fromisoformat(msg["date"])
    sun = {
        event: moment
        for event in ("sunrise", "sunset")
        if (moment := get_astral_event_date(hass, event, day)) is not None
    }
    connection.send_result(
        msg["id"], day_view(msg["date"], data, _window(runtime), sun)
    )


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/history/rebuild"})
@websocket_api.require_admin
@callback
def ws_history_rebuild(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Read the history again from Home Assistant (keeps what only Joe saw)."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    if not runtime.async_rebuild_history():
        connection.send_error(msg["id"], "not_observing", "Joe is not watching.")
        return
    connection.send_result(msg["id"])


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
