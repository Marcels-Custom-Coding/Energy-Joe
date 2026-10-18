"""Tests for Joe's state and the live channel to the panel."""

from __future__ import annotations

from typing import Any

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.typing import WebSocketGenerator
import voluptuous as vol

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


def test_unknown_keys_are_kept() -> None:
    """What a newer version stored survives an older one (a step back)."""
    stored = model.default_config()
    stored["future"] = {"x": 1}
    stored["rules"]["future_rule"] = True
    stored["batteries"] = [
        {
            "id": "b1",
            "name": "A",
            "adapter": "none",
            "soc_entity": "sensor.soc",
            "future_field": 3,
        }
    ]
    config = model.validate(stored)
    assert config["future"] == {"x": 1}
    assert config["rules"]["future_rule"] is True
    assert config["batteries"][0]["future_field"] == 3
    config = model.apply_update(config, {"rules": {"reserve_soc": 20}}, "user")
    assert config["rules"]["future_rule"] is True
    # Keys that are checked themselves (roles, modes) stay strict.
    try:
        model.apply_update(
            config,
            {"batteries": {"b1": {"controls": {"nonsense": "number.x"}}}},
            "user",
        )
    except vol.Invalid:
        pass
    else:
        raise AssertionError("an unknown role must be refused")


def _stored(key: str, data: dict[str, Any], version: int = model.CONFIG_VERSION):
    return {"version": version, "minor_version": 1, "key": key, "data": data}


async def test_a_failing_migration_keeps_the_settings_apart(
    ready_hass: HomeAssistant,
    hass_storage: dict[str, Any],
    hass_ws_client: WebSocketGenerator,
) -> None:
    """A migration that fails does not stop the setup: Joe starts with the
    defaults, keeps the old settings apart and offers to take them back."""
    old = {"version": 6, "rules": {"reserve_soc": 150}}
    hass_storage[f"{DOMAIN}.config"] = _stored(f"{DOMAIN}.config", old, 6)
    await _setup(ready_hass)
    runtime = ready_hass.data[DOMAIN]
    assert runtime.config["rules"]["reserve_soc"] == 10
    assert hass_storage[f"{DOMAIN}.config.unreadable"]["data"] == old
    assert runtime.state["config_backup"] == {"error": None}
    client = await hass_ws_client(ready_hass)
    await client.send_json_auto_id(
        {"type": f"{DOMAIN}/config/backup", "action": "restore"}
    )
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "invalid_settings"
    assert runtime.state["config_backup"]["error"]
    # Not wanted: forgotten.
    await client.send_json_auto_id(
        {"type": f"{DOMAIN}/config/backup", "action": "discard"}
    )
    assert (await client.receive_json())["success"]
    assert runtime.state["config_backup"] is None
    assert f"{DOMAIN}.config.unreadable" not in hass_storage


async def test_settings_kept_apart_come_back(
    ready_hass: HomeAssistant,
    hass_storage: dict[str, Any],
    hass_ws_client: WebSocketGenerator,
) -> None:
    """An older version could not read them and started with the defaults:
    this one can, and takes them back on request."""
    kept = model.apply_update(
        model.default_config(), {"rules": {"reserve_soc": 20}}, "user"
    )
    kept["rules"]["from_the_future"] = 1
    hass_storage[f"{DOMAIN}.config"] = _stored(
        f"{DOMAIN}.config", model.default_config()
    )
    hass_storage[f"{DOMAIN}.config.unreadable"] = _stored(
        f"{DOMAIN}.config.unreadable", kept
    )
    await _setup(ready_hass)
    runtime = ready_hass.data[DOMAIN]
    assert runtime.state["config_backup"] == {"error": None}
    client = await hass_ws_client(ready_hass)
    await client.send_json_auto_id(
        {"type": f"{DOMAIN}/config/backup", "action": "restore"}
    )
    assert (await client.receive_json())["success"]
    assert runtime.config["rules"]["reserve_soc"] == 20
    assert runtime.config["rules"]["from_the_future"] == 1
    assert runtime.state["config_backup"] is None
    assert f"{DOMAIN}.config.unreadable" not in hass_storage
    assert hass_storage[f"{DOMAIN}.config"]["data"]["rules"]["reserve_soc"] == 20


async def test_the_offer_goes_once_the_owner_sets_something(
    ready_hass: HomeAssistant, hass_storage: dict[str, Any]
) -> None:
    hass_storage[f"{DOMAIN}.config.unreadable"] = _stored(
        f"{DOMAIN}.config.unreadable", model.default_config()
    )
    await _setup(ready_hass)
    runtime = ready_hass.data[DOMAIN]
    assert runtime.state["config_backup"] == {"error": None}
    runtime.async_update_config({"rules": {"reserve_soc": 20}}, "user")
    assert runtime.state["config_backup"] is None


async def test_services_need_an_admin(
    ready_hass: HomeAssistant, hass_admin_user: Any, hass_read_only_user: Any
) -> None:
    from homeassistant.core import Context
    from homeassistant.exceptions import Unauthorized

    await _setup(ready_hass)
    with pytest.raises(Unauthorized):
        await ready_hass.services.async_call(
            DOMAIN,
            "set_mode",
            {"mode": "live"},
            blocking=True,
            context=Context(user_id=hass_read_only_user.id),
        )
    assert ready_hass.data[DOMAIN].state["mode"] == "simulation"
    await ready_hass.services.async_call(
        DOMAIN,
        "set_mode",
        {"mode": "off"},
        blocking=True,
        context=Context(user_id=hass_admin_user.id),
    )
    # Automations (no user) may.
    await ready_hass.services.async_call(
        DOMAIN, "set_mode", {"mode": "advisory"}, blocking=True
    )
    assert ready_hass.data[DOMAIN].state["mode"] == "advisory"


async def test_removing_joe_puts_the_values_back_first(
    hass: HomeAssistant, hass_storage: dict[str, Any]
) -> None:
    """The originals are gone with the data: they go back before, and what
    does not is told to the owner."""
    from custom_components.energy_joe.runtime import JoeRuntime
    from homeassistant.components.persistent_notification import (
        _async_get_or_create_notifications,
    )

    attributes = {"min": 0, "max": 100, "step": 1}
    hass.states.async_set("number.reserve", "30", attributes)
    hass.states.async_set("number.stuck", "0", attributes)

    def keep(call: Any) -> None:
        entity_id = call.data["entity_id"]
        entity_id = entity_id[0] if isinstance(entity_id, list) else entity_id
        if entity_id == "number.stuck":
            raise RuntimeError("Modbus gone")
        hass.states.async_set(entity_id, str(float(call.data["value"])), attributes)

    hass.services.async_register("number", "set_value", keep)
    joe = JoeRuntime(hass)
    await joe.async_load()
    joe.executor.data["saved"] = {"number.reserve": 5.0, "number.stuck": 100.0}
    await joe.executor.async_save()
    await JoeRuntime(hass).async_remove()
    assert hass.states.get("number.reserve").state == "5.0"
    assert "energy_joe.control" not in hass_storage
    message = _async_get_or_create_notifications(hass)["energy_joe_not_restored"][
        "message"
    ]
    assert "number.stuck" in message and "100" in message
    assert "number.reserve" not in message
