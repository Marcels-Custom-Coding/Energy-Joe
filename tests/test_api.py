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


async def test_weekly_profiles_over_the_websocket(
    ready_hass: HomeAssistant, hass_ws_client: WebSocketGenerator
) -> None:
    """Suggest, store (each mode on its own), hold and resume; the devices' limits."""
    hass = ready_hass
    hass.config.language = "de"
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    runtime = hass.data["energy_joe"]
    ac = "climate.buero"
    hass.states.async_set(
        ac,
        "cool",
        {
            "hvac_modes": ["off", "cool", "heat"],
            "temperature": 24.0,
            "min_temp": 16,
            "max_temp": 31,
            "target_temp_step": 0.5,
        },
    )
    hass.states.async_set(
        "climate.wohnzimmer",
        "auto",
        {
            "hvac_modes": ["auto", "heat", "off"],
            "preset_modes": ["boost", "none", "week_program_2", "week_program_1"],
        },
    )
    client = await hass_ws_client(hass)

    async def send(**message) -> dict:
        await client.send_json_auto_id(message)
        return await client.receive_json()

    cool = await send(type=f"{DOMAIN}/climate/week/default", entity_id=ac, mode="cool")
    profiles = cool["result"]["profiles"]
    assert [p["name"] for p in profiles][:3] == ["Normal", "Feiertag", "Abwesend"]
    assert profiles[0]["curves"] == [[[0, 24.0]]]
    assert profiles[2]["curves"] == [[[0, 27.0]]]
    # Nobody's calendar tells a home office day: no tick for it.
    assert profiles[3]["tags"] == []
    heat = await send(type=f"{DOMAIN}/climate/week/default", entity_id=ac, mode="heat")
    assert heat["result"]["profiles"][0]["curves"] == [[[0, 21.0]]]

    msg = await send(
        type=f"{DOMAIN}/climate/week/set", entity_id=ac, mode="cool", profiles=profiles
    )
    assert msg["success"] and msg["result"] == {"ok": True}
    msg = await send(
        type=f"{DOMAIN}/climate/week/set",
        entity_id=ac,
        mode="heat",
        profiles=heat["result"]["profiles"],
    )
    assert msg["success"]
    modes = runtime.config["climate"]["rooms"][ac]["week"]["modes"]
    assert set(modes) == {"cool", "heat"}
    assert modes["cool"][0]["curves"] == [[[0, 24.0]]]
    assert (
        runtime.config["provenance"][f"climate.rooms.{ac}.week.modes"]["source"]
        == "user"
    )

    broken = [{**p, "tags": ["normal"]} for p in profiles]
    msg = await send(
        type=f"{DOMAIN}/climate/week/set", entity_id=ac, mode="cool", profiles=broken
    )
    assert not msg["success"] and msg["error"]["code"] == "invalid_week"
    assert "normal" in msg["error"]["message"]
    assert runtime.config["climate"]["rooms"][ac]["week"]["modes"]["cool"][0][
        "tags"
    ] == ["normal"]

    devices = (await send(type=f"{DOMAIN}/climate/devices"))["result"]["devices"]
    found = {d["entity_id"]: d for d in devices}
    assert found[ac]["min_temp"] == 16 and found[ac]["max_temp"] == 31
    assert found[ac]["target_temp_step"] == 0.5 and found[ac]["week_presets"] == []
    assert found["climate.wohnzimmer"]["week_presets"] == [
        "week_program_1",
        "week_program_2",
    ]
    assert found["climate.wohnzimmer"]["min_temp"] is None

    msg = await send(
        type=f"{DOMAIN}/climate/week/hold", entity_id=ac, profile=4, until="forever"
    )
    assert msg["success"]
    assert runtime.climate.data["holds"][ac] == {
        "mode": "cool",
        "profile": 4,
        "until": None,
    }
    msg = await send(type=f"{DOMAIN}/climate/week/hold", entity_id=ac, profile=None)
    assert msg["success"] and runtime.climate.data["holds"] == {}
    msg = await send(
        type=f"{DOMAIN}/climate/week/hold",
        entity_id="climate.wohnzimmer",
        profile=0,
    )
    assert not msg["success"] and msg["error"]["code"] == "no_profiles"

    runtime.climate.data["overrides"][ac] = {"reason": "off", "basis": None}
    msg = await send(type=f"{DOMAIN}/climate/week/resume", entity_id=ac)
    assert msg["success"]
    assert ac not in runtime.climate.data["overrides"]
    await hass.async_block_till_done()


async def test_week_suggestion_within_the_devices_limits(
    ready_hass: HomeAssistant, hass_ws_client: WebSocketGenerator
) -> None:
    """Cooling at 30 °C with 30 °C at most: not 33 °C for nobody home."""
    hass = ready_hass
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    ac = "climate.schlafzimmer"
    hass.states.async_set(
        ac,
        "cool",
        {
            "hvac_modes": ["off", "cool", "heat"],
            "temperature": 30.0,
            "min_temp": 16,
            "max_temp": 30,
            "target_temp_step": 1,
        },
    )
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": f"{DOMAIN}/climate/week/default", "entity_id": ac, "mode": "cool"}
    )
    msg = await client.receive_json()
    profiles = msg["result"]["profiles"]
    assert profiles[0]["curves"] == [[[0, 30.0]]]
    assert profiles[2]["curves"] == [[[0, 30.0]]]
