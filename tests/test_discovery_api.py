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


async def test_adopt_takes_over_and_keeps_user_values(
    ready_hass: HomeAssistant, hass_ws_client: WebSocketGenerator
) -> None:
    """Adopting stores what Joe found; a second scan leaves user values alone."""
    hass = ready_hass
    await _setup(hass)
    for entity_id, state in (
        ("sensor.grid_power", "1200"),
        ("sensor.house_consumption", "1500"),
        ("sensor.pv_power", "300"),
    ):
        hass.states.async_set(
            entity_id,
            state,
            {
                "unit_of_measurement": "W",
                "device_class": "power",
                "friendly_name": entity_id,
            },
        )

    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": f"{DOMAIN}/adopt"})
    msg = await client.receive_json()
    assert msg["success"]
    assert "discovery" in msg["result"]
    runtime = hass.data[DOMAIN]
    assert (
        runtime.config["measurements"]["grid_power"]["entity_id"] == "sensor.grid_power"
    )

    await client.send_json_auto_id(
        {
            "type": f"{DOMAIN}/config/update",
            "patch": {"measurements": {"grid_power": {"entity_id": "sensor.pv_power"}}},
        }
    )
    assert (await client.receive_json())["success"]
    await client.send_json_auto_id({"type": f"{DOMAIN}/adopt"})
    assert (await client.receive_json())["success"]
    assert (
        runtime.config["measurements"]["grid_power"]["entity_id"] == "sensor.pv_power"
    )


async def test_check_reports_and_forgets_settled_findings(
    ready_hass: HomeAssistant, hass_ws_client: WebSocketGenerator
) -> None:
    """A grid sensor counting the other way round is reported until confirmed."""
    hass = ready_hass
    await _setup(hass)
    attrs = {"unit_of_measurement": "kW", "device_class": "power"}
    hass.states.async_set("sensor.grid", "2.0", attrs)
    hass.states.async_set("sensor.home", "0.5", attrs)
    hass.states.async_set("sensor.pv", "2.5", attrs)
    runtime = hass.data[DOMAIN]
    runtime.async_update_config(
        {
            "measurements": {
                "grid_power": {"entity_id": "sensor.grid"},
                "home_power": {"entity_id": "sensor.home"},
                "solar_power": [{"entity_id": "sensor.pv"}],
            }
        },
        "user",
    )

    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": f"{DOMAIN}/check"})
    checks = (await client.receive_json())["result"]["checks"]
    assert [c["code"] for c in checks if c["level"] == "warn"] == ["grid_sign"]

    runtime.async_update_config(
        {"answers": {"confirmed": ["grid_sign:sensor.grid"]}}, "user"
    )
    await client.send_json_auto_id({"type": f"{DOMAIN}/check"})
    checks = (await client.receive_json())["result"]["checks"]
    assert "grid_sign" not in [c["code"] for c in checks]


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

    hass.data[DOMAIN].async_update_config(
        {
            "persons": {"person.robin": {"calendars": []}},
            "answers": {"ignored": ["person:person.robin"]},
            # A car charged by need for Robin's trips.
            "actions": [
                {
                    "id": "ev",
                    "name": "Carport",
                    "kind": "switch",
                    "entity_id": "select.carport_mode",
                    "need": {"enabled": True, "persons": ["person.robin"]},
                }
            ],
        },
        "user",
    )
    # Tomorrow's trip to a place from Robin's calendar.
    hass.data[DOMAIN].planner.plan = {
        "kind": "none",
        "actions": [
            {
                "id": "ev",
                "need": {
                    "departure": "2026-10-05T08:35+02:00",
                    "trips": [
                        {
                            "start": "2026-10-05T09:00:00+02:00",
                            "location": "Praxis Robinstraße 3",
                            "minutes": 25,
                        }
                    ],
                },
            }
        ],
        "meta": {"tomorrow": {"labels": {"person.robin": "office"}}},
    }
    # What Joe learned about Robin's hours at home.
    hass.data[DOMAIN]._config["learned"]["presence"] = {
        "person.robin": {"office": {"hours": 9.0, "days": 12}}
    }

    diagnostics = await async_get_config_entry_diagnostics(hass, entry)
    person = diagnostics["config"]["persons"][0]
    assert person["name"] == "**REDACTED**"
    assert person["calendars"] == "**REDACTED**"
    assert "robin" not in str(diagnostics).lower()
    assert "08:35" not in str(diagnostics)
    assert diagnostics["state"]["mode"] == "simulation"
