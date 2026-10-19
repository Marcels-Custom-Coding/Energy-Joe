"""Tests for Joe's discovery."""

from __future__ import annotations

import pytest

from custom_components.energy_joe import model
from custom_components.energy_joe.discovery import (
    car_updates,
    discover,
    profile_updates,
)
from custom_components.energy_joe.discovery.checks import run_config_checks
from custom_components.energy_joe.discovery.snapshot import Snapshot

from .snapshots import (
    acme_sensor,
    acme_storage_household,
    entity,
    fronius_household,
    generic_household,
    snapshot,
)


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
    assert fronius["controls"]["min_soc"] == "number.inverter_minimum_reserve"
    assert fronius["controls"]["grid_charge"] == "switch.inverter_grid_charging"
    assert fronius["suggested"] is None
    assert {"code": "energy_dashboard", "part": "battery"} in fronius["reasons"]

    venus = batteries["omnibattery"]
    assert venus["capacity_kwh"] == 5.12
    assert venus["controllable"]
    assert venus["controls"] == {
        "mode": "select.venus_force_mode",
        "charge_power": "number.venus_charge_power",
        "min_soc": "number.venus_discharge_cutoff",
    }
    assert venus["mode_options"] == {
        "normal": "None",
        "force_charge": "Charge",
        "force_discharge": "Discharge",
    }
    assert venus["max_charge_w"] == 2500
    assert venus["power"]["entity_id"] == "sensor.venus_ac_power"


def test_fronius_household_ignores_helpers_and_phones() -> None:
    """Template helpers and phone batteries are no home batteries."""
    result = discover(fronius_household())
    socs = {b["soc_entity"] for b in result["batteries"]}
    assert "sensor.battery_total_soc" not in socs
    assert "sensor.phone_battery" not in socs
    assert "sensor.window_battery" not in socs  # a gadget's own battery
    assert "sensor.ev_battery" not in socs  # a car, even with "battery" and power


def test_network_is_no_grid() -> None:
    """Whole words count: "Netzwerk" is no "Netz"."""
    m = discover(fronius_household())["measurements"]
    candidates = {m["grid_power"]["entity"]["entity_id"]} | {
        a["entity_id"] for a in m["grid_power"]["alternatives"]
    }
    assert "sensor.network_power" not in candidates


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
    # The floor heating's "vehicle level" is its temperature: a heater, no car.
    assert walls[1]["kind"] == "heating"
    assert walls[1]["entities"]["temperature"] == "sensor.evcc_floor_vehicle_soc"
    assert "vehicle_soc" not in walls[1]["entities"]
    actions = result["proposal"]["actions"]
    assert [a["id"] for a in actions] == ["ev_carport"]
    assert result["not_car_actions"] == ["ev_floor"]


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


def test_fronius_household_finds_the_car() -> None:
    """The Kia shows up as a car (never as a home battery) and fills charging by need."""
    result = discover(fronius_household())
    (car,) = result["cars"]
    assert car["name"] == "Electric car" and car["integration"] == "kia_uvo"
    assert car["capacity_kwh"] == 78.0 and car["range_km"] == 214.0
    assert not any(b["soc_entity"] == "sensor.ev_battery" for b in result["batteries"])
    # The wallbox is a charge point; the car is its own item with its source.
    point = result["proposal"]["actions"][0]["point"]
    assert point["connected_entity"] == "binary_sensor.evcc_carport_connected"
    config = model.adopt_proposal(model.default_config(), result["proposal"])
    patch = car_updates(fronius_household(), config)
    assert patch is not None
    ((car_id, change),) = patch["cars"].items()
    assert change["name"] == "Electric car"
    (source,) = change["sources"]
    assert source["kind"] == "car" and source["platform"] == "kia_uvo"
    assert source["entities"]["soc"] == "sensor.ev_battery"
    assert source["entities"]["range"] == "sensor.ev_range"
    assert source["entities"]["odometer"] == "sensor.ev_odometer"
    config = model.apply_update(config, patch, "read")
    assert config["cars"][0]["need"]["enabled"] is False
    # Looking again changes nothing.
    assert car_updates(fronius_household(), config) is None


def test_a_second_forecast_becomes_an_alternative() -> None:
    """Forecast.Solar is in the energy dashboard, Solcast is there as well."""
    snap = fronius_household()
    for key, value in (("today", 27.0), ("tomorrow", 21.5)):
        found = entity(
            f"sensor.solcast_{key}",
            f"Forecast {key}",
            value,
            unit="kWh",
            device_class="energy",
            platform="solcast_solar",
            unique_id=f"solcast_api_forecast_{key}",
            entry="sol",
        )
        snap.entities[found.entity_id] = found
    result = discover(snap)
    forecast = result["forecast"]
    assert forecast["provider"] == "forecast_solar"
    assert forecast["others"] == [
        {
            "provider": "solcast_solar",
            "provider_name": "Solcast",
            "tomorrow": ["sensor.solcast_tomorrow"],
            "tomorrow_kwh": 21.5,
        }
    ]
    config = model.validate({"version": model.CONFIG_VERSION, **result["proposal"]})
    assert config["forecast"]["alternatives"] == [
        {
            "id": "solcast_solar",
            "name": "Solcast",
            "provider": "solcast_solar",
            "tomorrow": ["sensor.solcast_tomorrow"],
        }
    ]
    assert config["forecast"]["combine"] is True


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


def test_levers_are_suggested_for_unknown_batteries() -> None:
    """A battery without a profile: Joe suggests levers by names, units and options."""
    result = discover(generic_household())
    battery = next(
        b for b in result["batteries"] if b["soc_entity"] == "sensor.solarflow_level"
    )
    assert battery["adapter"] == "none"
    assert battery["suggested"] == {
        "controls": {
            "min_soc": "number.solarflow_min_level",
            "mode": "select.solarflow_mode",
            "charge_power": "number.solarflow_charge_power",
        },
        "mode_options": {
            "force_charge": "Laden",
            "force_discharge": "Entladen",
            "normal": "Automatik",
        },
        "complete": True,
    }


def test_cars_and_home_batteries_of_the_same_integration() -> None:
    """tesla_custom runs car and Powerwall: the car is a car, the Powerwall a home battery."""
    from custom_components.energy_joe.discovery.snapshot import DeviceInfo

    tc = {"platform": "tesla_custom", "entry": "tesla"}
    entities = [
        entity(
            "sensor.model_y_battery",
            "Model Y Battery",
            55,
            unit="%",
            device_class="battery",
            unique_id="vin1_battery",
            device_id="car",
            **tc,
        ),
        entity(
            "sensor.model_y_range",
            "Model Y Range",
            180,
            unit="mi",
            device_class="distance",
            unique_id="vin1_range",
            device_id="car",
            **tc,
        ),
        entity(
            "sensor.my_home_battery",
            "My Home Battery",
            80,
            unit="%",
            device_class="battery",
            unique_id="site1_battery",
            device_id="site",
            **tc,
        ),
        entity(
            "sensor.my_home_battery_power",
            "My Home Battery Power",
            -1200,
            unit="W",
            device_class="power",
            unique_id="site1_battery_power",
            device_id="site",
            **tc,
        ),
        # A Skoda plug-in hybrid: petrol range, electric range, total range.
        entity(
            "sensor.superb_combustion_range",
            "Superb Combustion Range",
            650,
            unit="km",
            unique_id="vin2_combustion_range",
            device_id="phev",
            platform="myskoda",
        ),
        entity(
            "sensor.superb_electric_range",
            "Superb Electric Range",
            60,
            unit="km",
            unique_id="vin2_electric_range",
            device_id="phev",
            platform="myskoda",
        ),
        entity(
            "sensor.superb_range",
            "Superb Range",
            710,
            unit="km",
            unique_id="vin2_range",
            device_id="phev",
            platform="myskoda",
        ),
        entity(
            "sensor.superb_battery",
            "Superb Battery",
            70,
            unit="%",
            unique_id="vin2_battery_percentage",
            device_id="phev",
            platform="myskoda",
        ),
    ]
    devices = [
        DeviceInfo("car", "Model Y", "Tesla", "Model Y"),
        DeviceInfo("site", "My Home", "Tesla", "Battery"),
        DeviceInfo("phev", "Superb", "Skoda", "Superb iV"),
    ]
    result = discover(snapshot(entities, devices))
    cars = {c["name"]: c for c in result["cars"]}
    assert set(cars) == {"Model Y", "Superb"}
    assert cars["Model Y"]["range_km"] == pytest.approx(289.7, abs=0.1)
    assert cars["Superb"]["entities"]["range"] == "sensor.superb_electric_range"
    assert [b["soc_entity"] for b in result["batteries"]] == ["sensor.my_home_battery"]


def test_one_car_and_two_charge_points() -> None:
    """With two evcc charge points each uses its own car's level, not the one car found."""
    ev = {"platform": "evcc_intg", "entry": "evcc"}
    entities = [
        entity(
            "sensor.kona_battery",
            "Kona Battery",
            64,
            unit="%",
            translation_key="ev_battery_percentage",
            device_id="kona",
            platform="kia_uvo",
        ),
        entity(
            "sensor.kona_range",
            "Kona Range",
            300,
            unit="km",
            translation_key="ev_driving_range",
            device_id="kona",
            platform="kia_uvo",
        ),
    ]
    for name in ("garage", "carport"):
        entities += [
            entity(
                f"select.evcc_{name}_mode",
                f"{name} mode",
                "pv",
                unique_id=f"evcc_intg.evcc_{name}_mode",
                device_id=name,
                attributes={"options": ["off", "pv", "minpv", "now"]},
                **ev,
            ),
            entity(
                f"binary_sensor.evcc_{name}_connected",
                f"{name} connected",
                "on",
                unique_id=f"evcc_intg.evcc_{name}_connected",
                device_id=name,
                **ev,
            ),
            entity(
                f"sensor.evcc_{name}_vehicle_soc",
                f"{name} vehicle soc",
                40,
                unit="%",
                unique_id=f"evcc_intg.evcc_{name}_vehicle_soc",
                device_id=name,
                **ev,
            ),
        ]
    snap = snapshot(entities)
    result = discover(snap)
    socs = sorted(a["point"]["soc_entity"] for a in result["proposal"]["actions"])
    assert socs == ["sensor.evcc_carport_vehicle_soc", "sensor.evcc_garage_vehicle_soc"]
    # One car that may charge at both.
    config = model.adopt_proposal(model.default_config(), result["proposal"])
    patch = car_updates(snap, config)
    assert patch is not None and len(patch["cars"]) == 1
    config = model.apply_update(config, patch, "read")
    assert all(a["point"]["cars"] is None for a in config["actions"])


# --- A battery's size from its device -----------------------------------------


def _adopted(snap: Snapshot) -> dict:
    """Joe's configuration after taking over what he found in a snapshot."""
    return model.adopt_proposal(model.default_config(), discover(snap)["proposal"])


def _without_size(config: dict, battery_id: str = "storage") -> dict:
    """A battery set up before Joe read sizes: no capacity, no sensor for it."""
    return model.apply_update(
        config,
        {"batteries": {battery_id: {"capacity_kwh": None, "capacity_entity": None}}},
        "read",
    )


def _asks_for_size(snap: Snapshot, config: dict) -> bool:
    return any(c["code"] == "capacity_unknown" for c in run_config_checks(snap, config))


def test_a_battery_set_up_without_a_size_gets_it_from_its_device() -> None:
    """A Fronius battery adopted before Joe knew its capacity key: the profile
    update reads the size the way a new find does, the question goes away."""
    snap = fronius_household()
    config = _without_size(_adopted(snap))
    assert _asks_for_size(snap, config)
    patch = profile_updates(snap, config)
    assert patch == {
        "batteries": {
            "storage": {
                "capacity_kwh": 10.24,
                "capacity_entity": "sensor.storage_capacity",
            }
        }
    }
    config = model.apply_update(config, patch, "read", "profile")
    assert not _asks_for_size(snap, config)
    # Looking again changes nothing.
    assert profile_updates(snap, config) is None


def test_a_size_the_user_typed_is_never_overwritten() -> None:
    snap = fronius_household()
    config = _without_size(_adopted(snap))
    mine = model.apply_update(
        config, {"batteries": {"storage": {"capacity_kwh": 9.5}}}, "user"
    )
    assert profile_updates(snap, mine) is None
    # Nor is a sensor the user chose: Joe reads it when he plans.
    chosen = model.apply_update(
        config,
        {"batteries": {"storage": {"capacity_entity": "sensor.storage_capacity"}}},
        "user",
    )
    assert profile_updates(snap, chosen) is None


def test_i_dont_know_does_not_keep_the_device_from_telling() -> None:
    """ "Weiß ich nicht – lern es" stores an empty size as the user's answer:
    the device knows better, and with the size known the question is settled."""
    snap = fronius_household()
    config = model.apply_update(
        _without_size(_adopted(snap)),
        {
            "batteries": {"storage": {"capacity_kwh": None}},
            "answers": {"capacity:storage": "unknown"},
        },
        "user",
    )
    assert model.source_of(config, "batteries[storage].capacity_kwh") == "user"
    patch = profile_updates(snap, config)
    assert patch["batteries"]["storage"]["capacity_kwh"] == 10.24
    config = model.apply_update(config, patch, "read", "profile")
    assert config["batteries"][0]["capacity_kwh"] == 10.24
    assert not _asks_for_size(snap, config)


def test_a_size_read_before_follows_its_sensor() -> None:
    """A maximum capacity sinks with age: more than 1 % off, Joe takes the new value."""
    snap = fronius_household()
    config = _adopted(snap)
    assert config["batteries"][0]["capacity_entity"] == "sensor.storage_capacity"
    sensor = snap.entities["sensor.storage_capacity"]
    sensor.state = "10200"  # 0.4 % less: noise
    assert profile_updates(snap, config) is None
    sensor.state = "9800"
    assert profile_updates(snap, config) == {
        "batteries": {"storage": {"capacity_kwh": 9.8}}
    }
    # Not while the sensor is away or tells nonsense.
    for state in ("unavailable", "0", "12"):
        sensor.state = state
        assert profile_updates(snap, config) is None
    # A size the user typed is not followed either.
    sensor.state = "9800"
    mine = model.apply_update(
        config, {"batteries": {"storage": {"capacity_kwh": 10.24}}}, "user"
    )
    assert profile_updates(snap, mine) is None


def _size_found(*sensors) -> tuple[float | None, str | None]:
    (battery,) = discover(acme_storage_household(*sensors))["batteries"]
    return battery["capacity_kwh"], battery["capacity_entity"]


def test_the_size_of_an_unknown_battery_by_its_sensors() -> None:
    """An integration Joe has no knowledge of: a sensor named a capacity in
    kWh is the size, one with device class energy_storage as well; counters
    and what is in the battery right now never."""
    capacity = acme_sensor("sensor.acme_capacity", "Speicher Capacity", 10.5)
    rated = acme_sensor(
        "sensor.acme_rated",
        "Speicher Rated energy",
        11000,
        unit="Wh",
        device_class="energy_storage",
    )
    charged = acme_sensor(
        "sensor.acme_charged_today",
        "Speicher Energy charged today",
        7.3,
        device_class="energy",
        attributes={"state_class": "total_increasing"},
    )
    counter = acme_sensor(
        "sensor.acme_energy_total",
        "Speicher Energy total",
        1234.5,
        attributes={"state_class": "total"},
    )
    available = acme_sensor(
        "sensor.acme_available",
        "Speicher Available energy",
        5.1,
        device_class="energy_storage",
    )
    remaining = acme_sensor(
        "sensor.acme_remaining",
        "Speicher Remaining capacity",
        4900,
        unit="Wh",
        device_class="energy_storage",
    )
    assert _size_found(charged, counter, available, remaining) == (None, None)
    assert _size_found(capacity, charged, counter, available, remaining) == (
        10.5,
        "sensor.acme_capacity",
    )
    assert _size_found(rated, charged, available) == (11.0, "sensor.acme_rated")
    # A plain capacity before the nameplate, today's maximum before both.
    assert _size_found(rated, capacity) == (10.5, "sensor.acme_capacity")
    maximum = acme_sensor("sensor.acme_z_maximum", "Speicher Maximum capacity", 10.0)
    assert _size_found(capacity, maximum, rated) == (10.0, "sensor.acme_z_maximum")
    # Of equals the first by entity id.
    other = acme_sensor("sensor.acme_b_capacity", "Speicher Capacity B", 10.6)
    assert _size_found(capacity, other) == (10.6, "sensor.acme_b_capacity")
    # Not in Ah or %, not a module's, not implausible.
    amp_hours = acme_sensor("sensor.acme_ah", "Speicher Capacity", 200, unit="Ah")
    percent = acme_sensor("sensor.acme_pct", "Speicher Capacity", 48, unit="%")
    module = acme_sensor("sensor.acme_module", "Speicher Capacity per module", 2.5)
    tiny = acme_sensor("sensor.acme_tiny", "Speicher Capacity", 0.1)
    assert _size_found(amp_hours, percent, module, tiny) == (None, None)


def test_fronius_like_keys_of_an_unknown_integration() -> None:
    """The maximum (sinks with age) before the designed size, told by the keys
    at the end of the unique ids alone (the names say nothing); sonnen's "Full
    charge capacity" is a size, the rest of the charge family is not."""
    designed = acme_sensor(
        "sensor.acme_capacity_designed", "Speicher A", 10240, unit="Wh"
    )
    maximum = acme_sensor("sensor.acme_capacity_maximum", "Speicher B", 9900, unit="Wh")
    assert _size_found(designed, maximum) == (9.9, "sensor.acme_capacity_maximum")
    assert _size_found(designed) == (10.24, "sensor.acme_capacity_designed")
    full = acme_sensor(
        "sensor.acme_full_charge_capacity", "Speicher C", 9500, unit="Wh"
    )
    charge = acme_sensor("sensor.acme_charge_energy", "Speicher D", 9.6)
    assert _size_found(charge, full) == (9.5, "sensor.acme_full_charge_capacity")


def test_no_question_about_a_size_the_device_tells() -> None:
    """The check "capacity_unknown" stays away as soon as a device tells the size,
    also for a battery set up before without a profile."""
    capacity = acme_sensor("sensor.acme_capacity", "Speicher Capacity", 10.5)
    result = discover(acme_storage_household(capacity))
    assert not any(c["code"] == "capacity_unknown" for c in result["checks"])
    (battery,) = result["batteries"]
    assert {"code": "capacity_read"} in battery["reasons"]
    without = discover(acme_storage_household())
    assert any(c["code"] == "capacity_unknown" for c in without["checks"])

    snap = acme_storage_household(capacity)
    config = _without_size(_adopted(snap), "acme_bat")
    assert _asks_for_size(snap, config)
    patch = profile_updates(snap, config)
    assert patch == {
        "batteries": {
            "acme_bat": {
                "capacity_kwh": 10.5,
                "capacity_entity": "sensor.acme_capacity",
            }
        }
    }
    config = model.apply_update(config, patch, "read", "profile")
    assert not _asks_for_size(snap, config)
