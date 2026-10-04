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
        "then": [{"action": "switch.turn_on", "entity_id": "switch.written"}],
        "else": [
            {"device_id": "abc", "domain": "select", "entity_id": "select.device"},
            {"action": "number.set_value", "target": {"entity_id": "{{ x }}"}},
        ],
    }
    assert automations.targets([step]) == {"switch.written", "select.device"}
