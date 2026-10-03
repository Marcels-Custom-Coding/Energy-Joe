"""Discovery and diagnostics against a running (test) Home Assistant."""

from __future__ import annotations

from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.energy_joe.const import DOMAIN
from custom_components.energy_joe.diagnostics import async_get_config_entry_diagnostics
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er


async def _setup(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    return entry


async def test_discover_reads_registry_and_states(
    ready_hass: HomeAssistant, hass_ws_client: WebSocketGenerator
) -> None:
    """Joe finds a battery from registry data and states of a real instance."""
    hass = ready_hass
    await _setup(hass)

    source = MockConfigEntry(domain="omnibattery", data={})
    source.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=source.entry_id,
        identifiers={("omnibattery", "b1")},
        name="Garage Battery",
    )
    registry = er.async_get(hass)
    for key, domain, state, attrs in (
        (
            "battery_soc",
            "sensor",
            "41",
            {"unit_of_measurement": "%", "device_class": "battery"},
        ),
        (
            "battery_total_energy",
            "sensor",
            "5.12",
            {"unit_of_measurement": "kWh", "device_class": "energy"},
        ),
        ("force_mode", "select", "None", {"options": ["None", "Charge", "Discharge"]}),
        ("set_charge_power", "number", "0", {}),
        ("discharging_cutoff_capacity", "number", "12", {}),
    ):
        entry = registry.async_get_or_create(
            domain,
            "omnibattery",
            f"192.0.2.20_502_{key}",
            config_entry=source,
            device_id=device.id,
        )
        hass.states.async_set(entry.entity_id, state, attrs)
    hass.states.async_set("person.robin", "home", {"friendly_name": "Robin"})

    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": f"{DOMAIN}/discover"})
    msg = await client.receive_json()
    assert msg["success"]
    result = msg["result"]

    (battery,) = result["batteries"]
    assert battery["name"] == "Garage Battery"
    assert battery["capacity_kwh"] == 5.12
    assert battery["controllable"]
    assert [p["name"] for p in result["persons"]] == ["Robin"]
    assert result["proposal"]["batteries"][0]["adapter"] == "omnibattery"


async def test_diagnostics_hide_personal_data(ready_hass: HomeAssistant) -> None:
    """Names of people and calendars do not appear in diagnostics."""
    hass = ready_hass
    entry = await _setup(hass)
    hass.data[DOMAIN].async_update_config(
        {
            "persons": [
                {
                    "id": "person.robin",
                    "name": "Robin",
                    "person_entity": "person.robin",
                    "calendars": ["calendar.robin"],
                }
            ]
        },
        "user",
    )

    diagnostics = await async_get_config_entry_diagnostics(hass, entry)
    person = diagnostics["config"]["persons"][0]
    assert person["name"] == "**REDACTED**"
    assert person["calendars"] == "**REDACTED**"
    assert diagnostics["state"]["mode"] == "simulation"
