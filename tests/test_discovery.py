"""Tests for Joe's discovery."""

from __future__ import annotations

from custom_components.energy_joe import model
from custom_components.energy_joe.discovery import discover
from custom_components.energy_joe.discovery.snapshot import Snapshot

from .snapshots import fronius_household, generic_household


def test_fronius_household_batteries() -> None:
    """Both batteries are found with capacity, power and controls."""
    result = discover(fronius_household())
    batteries = {b["integration"]: b for b in result["batteries"]}
    assert set(batteries) == {"fronius", "omnibattery"}

    fronius = batteries["fronius"]
    assert fronius["name"] == "BYD Battery-Box Premium HV"
    assert fronius["soc_entity"] == "sensor.storage_soc"
    assert fronius["capacity_kwh"] == 10.24
    assert fronius["power"] == {
        "entity_id": "sensor.solarnet_power_battery",
        "invert": True,
        "minus_entity_id": None,
    }
    assert fronius["controllable"]
    assert fronius["adapter"] == "fronius"
    assert fronius["controls"]["minimum_reserve"] == "number.inverter_minimum_reserve"
    assert fronius["controls"]["grid_charging"] == "switch.inverter_grid_charging"
    assert {"code": "energy_dashboard", "part": "battery"} in fronius["reasons"]

    venus = batteries["omnibattery"]
    assert venus["capacity_kwh"] == 5.12
    assert venus["controllable"]
    assert venus["max_charge_w"] == 2500
    assert venus["power"]["entity_id"] == "sensor.venus_ac_power"


def test_fronius_household_ignores_helpers_and_phones() -> None:
    """Template helpers and phone batteries are no home batteries."""
    result = discover(fronius_household())
    socs = {b["soc_entity"] for b in result["batteries"]}
    assert "sensor.battery_total_soc" not in socs
    assert "sensor.phone_battery" not in socs


def test_fronius_household_measurements() -> None:
    """Grid from the Energy dashboard, home and solar as expected."""
    m = discover(fronius_household())["measurements"]
    assert m["grid_power"]["measurement"]["entity_id"] == "sensor.house_meter_power"
    assert m["grid_power"]["confidence"] == 0.95
    assert "sensor.solarnet_power_grid" in {
        a["entity_id"] for a in m["grid_power"]["alternatives"]
    }
    assert m["home_power"]["measurement"] == {
        "entity_id": "sensor.solarnet_power_load_consumed",
        "invert": False,
        "minus_entity_id": None,
    }
    assert [s["entity_id"] for s in m["solar_power"]["measurements"]] == [
        "sensor.solarnet_power_photovoltaics"
    ]
    assert m["solar_power"]["total"] == 3.0


def test_fronius_household_tariff_forecast_wallbox() -> None:
    result = discover(fronius_household())
    tariff = result["tariff"]
    assert tariff["kind"] == "fixed_window"
    assert tariff["window"] == {"start": "00:00", "end": "05:00"}
    assert tariff["night_price"] == 0.18564
    assert tariff["day_price"] == 0.285719
    assert tariff["feed_in_price"] == 0.062
    assert tariff["provider"] == "Octopus Energy"

    forecast = result["forecast"]
    assert forecast["provider"] == "forecast_solar"
    assert forecast["planes"] == 2
    assert forecast["today_kwh"] == 29.0
    assert forecast["confidence"] == 0.95

    walls = result["wallboxes"]
    assert [w["name"] for w in walls] == ["Carport", "Floor heating"]
    assert walls[0]["is_car"] and not walls[1]["is_car"]
    assert walls[0]["mode_options"] == ["off", "pv", "minpv", "now"]


def test_fronius_household_people_and_consumers() -> None:
    result = discover(fronius_household())
    persons = {p["name"]: p for p in result["persons"]}
    assert persons["Alex"]["calendars"] == ["calendar.alex_work"]
    assert persons["Sam"]["calendars"] == []
    kinds = {c["name"]: c["kind"] for c in result["consumers"]}
    assert kinds == {
        "Haus": "submeter",
        "Klimaanlage Büro": "climate",
        "Heizungskeller": "submeter",
        "Warmwasser Wärmepumpe": "hot_water",
        "Fussbodenheizung Küche": "electric_heating",
        "Kühlschrank": "household",
        "Wallbox": "ev",
    }
    assert result["weather"]["entity"]["entity_id"] == "weather.home"
    assert result["holiday"]["entity"]["entity_id"] == "binary_sensor.workday"


def test_fronius_household_proposal_is_valid_config() -> None:
    """The proposal fits Joe's configuration model as it is."""
    proposal = discover(fronius_household())["proposal"]
    config = model.validate({"version": model.CONFIG_VERSION, **proposal})
    assert [b["name"] for b in config["batteries"]] == [
        "BYD Battery-Box Premium HV",
        "Marstek Venus E",
    ]
    assert config["tariff"]["kind"] == "fixed_window"
    assert config["forecast"]["config_entries"] == ["A", "B"]


def test_generic_household() -> None:
    """Unknown integrations are found by device class, unit and name."""
    result = discover(generic_household())
    m = result["measurements"]
    assert m["grid_power"]["entity"]["entity_id"] == "sensor.acme_grid_power"
    assert m["home_power"]["entity"]["entity_id"] == "sensor.acme_home_power"
    assert m["solar_power"]["entities"][0]["entity_id"] == "sensor.acme_pv_power"
    assert m["solar_power"]["total"] == 2.1  # watts converted to kW
    assert {"code": "name", "word": "netz"} in m["grid_power"]["reasons"]

    (battery,) = result["batteries"]
    assert battery["name"] == "SolarFlow 800"
    assert not battery["controllable"]
    assert battery["power"]["entity_id"] == "sensor.solarflow_power"

    assert result["tariff"]["kind"] == "dynamic"
    assert result["tariff"]["night_price"] < result["tariff"]["day_price"]
    assert result["forecast"]["provider"] == "solcast_solar"
    assert result["forecast"]["tomorrow_kwh"] == 20.1

    codes = {c["code"] for c in result["checks"]}
    assert {"capacity_unknown", "not_controllable"} <= codes
    model.validate({"version": model.CONFIG_VERSION, **result["proposal"]})


def test_grid_sign_check() -> None:
    """Import reported while the sun clearly covers the house: sign is suspicious."""
    # 5 kW solar, 1 kW house, no battery charging: about 4 kW must go to the grid.
    plausible = discover(
        generic_household(pv_watts=5000, home_watts=1000, grid_watts=-3900)
    )
    assert not any(c["code"] == "grid_sign" for c in plausible["checks"])

    flipped = discover(
        generic_household(pv_watts=5000, home_watts=1000, grid_watts=3900)
    )
    (check,) = [c for c in flipped["checks"] if c["code"] == "grid_sign"]
    assert check["level"] == "warn"
    assert check["entity_id"] == "sensor.acme_grid_power"

    # Small values are not judged.
    calm = discover(generic_household(pv_watts=2100, home_watts=2400, grid_watts=300))
    assert not any(c["code"] == "grid_sign" for c in calm["checks"])


def test_empty_home_assistant() -> None:
    """Nothing to find is not an error."""
    result = discover(Snapshot(entities={}))
    assert result["batteries"] == []
    assert result["measurements"] == {
        "grid_power": None,
        "home_power": None,
        "solar_power": None,
    }
    assert result["tariff"]["kind"] == "unknown"
    assert {c["code"] for c in result["checks"]} >= {"missing", "tariff_unknown"}
    model.validate({"version": model.CONFIG_VERSION, **result["proposal"]})
