"""Automations that write to the batteries: found, switched off and on again."""

from __future__ import annotations

from typing import Any

from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.energy_joe import model
from custom_components.energy_joe.control import automations
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.setup import async_setup_component


def _automation(alias: str, actions: list[Any], entity: str = "sensor.x") -> dict:
    return {
        "id": alias,
        "alias": alias,
        "triggers": [{"trigger": "state", "entity_id": entity}],
        "actions": actions,
    }


async def test_battery_automations_are_found_and_switched(
    hass: HomeAssistant,
) -> None:
    entry = MockConfigEntry(domain="omnibattery")
    entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=entry.entry_id, identifiers={("omnibattery", "venus")}
    )
    registry = er.async_get(hass)
    soc = registry.async_get_or_create(
        "sensor", "omnibattery", "v_soc", config_entry=entry, device_id=device.id
    )
    power = registry.async_get_or_create(
        "number", "omnibattery", "v_power", config_entry=entry, device_id=device.id
    )
    # Omnibattery's system device: the same integration entry, another device.
    system = registry.async_get_or_create(
        "number", "omnibattery", "system_min_discharge", config_entry=entry
    )
    for entity_id in (soc.entity_id, power.entity_id, system.entity_id):
        hass.states.async_set(entity_id, "0")
    hass.states.async_set("light.porch", "off")
    logged: list[dict[str, Any]] = []

    async def log(call: ServiceCall) -> None:
        logged.append(dict(call.data))

    hass.services.async_register("logbook", "log", log)
    assert await async_setup_component(
        hass,
        "automation",
        {
            "automation": [
                _automation(
                    "Boost",
                    [
                        {
                            "choose": [
                                {
                                    # Conditions only read the battery.
                                    "conditions": [
                                        {
                                            "condition": "state",
                                            "entity_id": soc.entity_id,
                                            "state": "1",
                                        }
                                    ],
                                    "sequence": [
                                        {
                                            "action": "number.set_value",
                                            "target": {"entity_id": power.entity_id},
                                            "data": {"value": 2500},
                                        }
                                    ],
                                }
                            ]
                        }
                    ],
                ),
                _automation(
                    "Hierarchy",
                    [
                        {
                            "action": "number.set_value",
                            "data": {"entity_id": system.entity_id, "value": 150},
                        }
                    ],
                ),
                # Reads the battery only: not listed.
                _automation(
                    "Watch",
                    [
                        {
                            "action": "light.turn_on",
                            "target": {"entity_id": "light.porch"},
                        }
                    ],
                    soc.entity_id,
                ),
            ]
        },
    )
    await hass.async_block_till_done()
    config = model.apply_update(
        model.default_config(),
        {
            "batteries": {
                "venus": {
                    "id": "venus",
                    "name": "Venus",
                    "adapter": "omnibattery",
                    "soc_entity": soc.entity_id,
                    "device_id": device.id,
                    "controls": {"charge_power": power.entity_id},
                }
            }
        },
        "user",
    )
    switched_off: dict[str, Any] = {}
    found = automations.find(hass, config, switched_off)
    assert [a["name"] for a in found] == ["Boost", "Hierarchy"]
    assert found[0]["writes"][0]["entity_id"] == power.entity_id
    assert found[0]["writes"][0]["battery"] == "Venus"
    assert all(a["on"] for a in found)

    ids = [a["entity_id"] for a in found]
    failed = await automations.async_switch(
        hass, ids, False, switched_off, "wurde ausgeschaltet"
    )
    assert failed == []
    assert all(hass.states.get(i).state == "off" for i in ids)
    assert set(switched_off) == set(ids)
    assert switched_off[ids[0]]["reason"] == "battery"
    # The reason is in each automation's logbook, too.
    assert [entry["entity_id"] for entry in logged] == ids
    found = automations.find(hass, config, switched_off)
    assert all(not a["on"] and a["switched_off"] for a in found)

    await automations.async_switch(hass, ids, True, switched_off, "wieder an")
    assert all(hass.states.get(i).state == "on" for i in ids)
    assert switched_off == {}


def test_only_action_targets_count() -> None:
    step = {
        "if": [{"condition": "state", "entity_id": "switch.read", "state": "on"}],
        "then": [
            {"action": "switch.turn_on", "entity_id": "switch.written"},
            {"action": "number.set_value", "entity_id": "number.a, number.b"},
            {"action": "switch.turn_on", "entity_id": "switch.off", "enabled": False},
            {"action": "homeassistant.update_entity", "entity_id": "sensor.soc"},
        ],
        "else": [
            {"device_id": "abc", "domain": "select", "entity_id": "select.device"},
            {"action": "light.turn_on", "target": {"device_id": "dev1"}},
            {"action": "number.set_value", "target": {"entity_id": "{{ x }}"}},
            {"condition": "device", "device_id": "dev2", "type": "is_on"},
        ],
    }
    found = automations.targets(None, [step])
    assert found.entities == {
        "switch.written",
        "number.a",
        "number.b",
        "select.device",
    }
    assert found.devices == {"abc", "dev1"}


async def test_only_the_battery_itself_counts_and_scripts_are_followed(
    hass: HomeAssistant,
) -> None:
    """A hub integration (one entry for the whole house) is not the battery."""
    entry = MockConfigEntry(domain="tuya")
    entry.add_to_hass(hass)
    devices = dr.async_get(hass)
    battery = devices.async_get_or_create(
        config_entry_id=entry.entry_id, identifiers={("tuya", "battery")}
    )
    lamp = devices.async_get_or_create(
        config_entry_id=entry.entry_id, identifiers={("tuya", "lamp")}
    )
    registry = er.async_get(hass)
    soc = registry.async_get_or_create(
        "sensor", "tuya", "b_soc", config_entry=entry, device_id=battery.id
    )
    mode = registry.async_get_or_create(
        "select", "tuya", "b_mode", config_entry=entry, device_id=battery.id
    )
    light = registry.async_get_or_create(
        "light", "tuya", "garden", config_entry=entry, device_id=lamp.id
    )
    for item in (soc, mode, light):
        hass.states.async_set(item.entity_id, "0")
    assert await async_setup_component(
        hass,
        "script",
        {
            "script": {
                "boost": {
                    "sequence": [
                        {
                            "action": "select.select_option",
                            "target": {"entity_id": mode.entity_id},
                            "data": {"option": "charge"},
                        }
                    ]
                }
            }
        },
    )
    assert await async_setup_component(
        hass,
        "automation",
        {
            "automation": [
                _automation(
                    "Garden",
                    [
                        {
                            "action": "light.turn_on",
                            "target": {"entity_id": light.entity_id},
                        }
                    ],
                ),
                _automation("Via script", [{"action": "script.boost"}]),
                _automation(
                    "Device",
                    [
                        {
                            "action": "select.select_option",
                            "target": {"device_id": battery.id},
                            "data": {"option": "x"},
                        }
                    ],
                ),
            ]
        },
    )
    await hass.async_block_till_done()
    config = model.apply_update(
        model.default_config(),
        {
            "batteries": {
                "b": {
                    "id": "b",
                    "name": "Tuya",
                    "adapter": "tuya",
                    "soc_entity": soc.entity_id,
                    "device_id": battery.id,
                    "controls": {"mode": mode.entity_id},
                }
            }
        },
        "user",
    )
    found = automations.find(hass, config, {})
    assert [a["name"] for a in found] == ["Device", "Via script"]
    via_script = found[1]["writes"][0]
    assert via_script["entity_id"] == mode.entity_id and via_script["joe"] is True


async def test_joe_keeps_and_restores_what_it_switched_off(
    ready_hass: HomeAssistant,
) -> None:
    """Forgotten only when switched on by hand; switched on again when Joe is removed."""
    from custom_components.energy_joe.const import DOMAIN

    hass = ready_hass
    hass.services.async_register("logbook", "log", lambda call: None)
    assert await async_setup_component(
        hass,
        "automation",
        {
            "automation": [
                _automation(
                    "Old",
                    [{"action": "light.turn_on", "target": {"entity_id": "light.x"}}],
                )
            ]
        },
    )
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    runtime = hass.data[DOMAIN]
    # Switched off by Joe for a battery that is gone now.
    await runtime.async_switch_automations(False, ["automation.old"])
    listed = runtime.automations()
    assert [(a["entity_id"], a["on"], bool(a["switched_off"])) for a in listed] == [
        ("automation.old", False, True)
    ]
    assert hass.states.get("automation.old").state == "off"
    # Removing Joe switches it on again.
    assert await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()
    assert hass.states.get("automation.old").state == "on"


async def test_phones_are_shown_by_their_current_name(
    ready_hass: HomeAssistant, hass_ws_client: Any
) -> None:
    from custom_components.energy_joe.const import DOMAIN

    hass = ready_hass
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    phone = MockConfigEntry(
        domain="mobile_app", data={"device_name": "iPhone 15 Pro Max"}
    )
    phone.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=phone.entry_id,
        identifiers={("mobile_app", "x")},
        name="iPhone 15 Pro Max",
    )
    dr.async_get(hass).async_update_device(device.id, name_by_user="Marcels iPhone 17")
    hass.services.async_register(
        "notify", "mobile_app_iphone_15_pro_max", lambda call: None
    )
    ws = await hass_ws_client(hass)
    await ws.send_json_auto_id({"type": f"{DOMAIN}/notify/targets"})
    result = (await ws.receive_json())["result"]
    assert {
        "service": "mobile_app_iphone_15_pro_max",
        "name": "Marcels iPhone 17",
    } in result
