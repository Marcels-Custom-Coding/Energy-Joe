"""Made-up households for discovery tests (no real installation data)."""

from __future__ import annotations

from typing import Any

from custom_components.energy_joe.discovery.snapshot import (
    DeviceInfo,
    EntityInfo,
    Snapshot,
)


def entity(
    entity_id: str,
    name: str,
    state: Any,
    *,
    unit: str | None = None,
    device_class: str | None = None,
    platform: str | None = None,
    unique_id: str | None = None,
    device_id: str | None = None,
    entry: str | None = None,
    attributes: dict[str, Any] | None = None,
    seconds: float = 30,
) -> EntityInfo:
    attrs: dict[str, Any] = {"friendly_name": name}
    if unit:
        attrs["unit_of_measurement"] = unit
    if device_class:
        attrs["device_class"] = device_class
    attrs.update(attributes or {})
    return EntityInfo(
        entity_id=entity_id,
        name=name,
        state=str(state),
        attributes=attrs,
        platform=platform,
        config_entry_id=entry,
        device_id=device_id,
        unique_id=unique_id,
        seconds_since_report=seconds,
    )


def snapshot(
    entities: list[EntityInfo],
    devices: list[DeviceInfo] | None = None,
    energy: dict[str, Any] | None = None,
) -> Snapshot:
    return Snapshot(
        entities={e.entity_id: e for e in entities},
        devices={d.device_id: d for d in devices or []},
        energy_prefs=energy,
    )


def fronius_household() -> Snapshot:
    """Fronius hybrid inverter with storage, a Marstek battery, Octopus, Forecast.Solar, evcc."""
    fr = {"platform": "fronius", "entry": "fronius"}
    om = {"platform": "omnibattery", "entry": "omni", "device_id": "venus"}
    fs = {"platform": "forecast_solar"}
    ev = {"platform": "evcc_intg", "entry": "evcc"}
    timeslots = [
        {
            "name": "GO",
            "rate": "18.564",
            "activation_rules": [{"from_time": "00:00:00", "to_time": "05:00:00"}],
        },
        {
            "name": "STANDARD",
            "rate": "28.5719",
            "activation_rules": [{"from_time": "05:00:00", "to_time": "00:00:00"}],
        },
    ]
    entities = [
        entity(
            "sensor.solarnet_power_grid",
            "SolarNet Grid",
            -60,
            unit="W",
            device_class="power",
            unique_id="solar_net_1-power_flow-power_grid",
            device_id="flow",
            **fr,
        ),
        entity(
            "sensor.solarnet_power_load_consumed",
            "SolarNet Consumption",
            1500,
            unit="W",
            device_class="power",
            unique_id="solar_net_1-power_flow-power_load_consumed",
            device_id="flow",
            **fr,
        ),
        entity(
            "sensor.solarnet_power_load",
            "SolarNet Load",
            -1500,
            unit="W",
            device_class="power",
            unique_id="solar_net_1-power_flow-power_load",
            device_id="flow",
            **fr,
        ),
        entity(
            "sensor.solarnet_power_photovoltaics",
            "SolarNet PV",
            3000,
            unit="W",
            device_class="power",
            unique_id="solar_net_1-power_flow-power_photovoltaics",
            device_id="flow",
            **fr,
        ),
        entity(
            "sensor.solarnet_power_battery",
            "SolarNet Battery",
            -1450,
            unit="W",
            device_class="power",
            unique_id="solar_net_1-power_flow-power_battery",
            device_id="flow",
            **fr,
        ),
        entity(
            "sensor.storage_soc",
            "Storage State of charge",
            55,
            unit="%",
            device_class="battery",
            unique_id="SERIAL1 -state_of_charge",
            device_id="storage",
            **fr,
        ),
        entity(
            "sensor.storage_capacity",
            "Storage Maximum capacity",
            10240,
            unit="Wh",
            unique_id="SERIAL1 -capacity_maximum",
            device_id="storage",
            **fr,
        ),
        entity(
            "number.inverter_minimum_reserve",
            "Minimum reserve",
            5,
            unit="%",
            unique_id="1-modbus-battery_minimum_reserve",
            device_id="inverter",
            **fr,
        ),
        entity(
            "switch.inverter_grid_charging",
            "Grid charging",
            "on",
            unique_id="1-modbus-battery_grid_charging",
            device_id="inverter",
            **fr,
        ),
        entity(
            "number.inverter_charge_limit",
            "Charge limit",
            100,
            unit="%",
            unique_id="1-modbus-battery_charge_power_limit",
            device_id="inverter",
            **fr,
        ),
        entity(
            "switch.inverter_charge_limit_enabled",
            "Charge limit active",
            "off",
            unique_id="1-modbus-battery_charge_power_limit_enabled",
            device_id="inverter",
            **fr,
        ),
        entity(
            "sensor.venus_soc",
            "Venus Battery SoC",
            40,
            unit="%",
            device_class="battery",
            unique_id="192.0.2.10_502_battery_soc",
            **om,
        ),
        entity(
            "sensor.venus_ac_power",
            "Venus AC power",
            0,
            unit="W",
            device_class="power",
            unique_id="192.0.2.10_502_ac_power",
            **om,
        ),
        entity(
            "sensor.venus_total_energy",
            "Venus Total energy",
            5.12,
            unit="kWh",
            device_class="energy",
            unique_id="192.0.2.10_502_battery_total_energy",
            **om,
        ),
        entity(
            "select.venus_force_mode",
            "Venus Force mode",
            "None",
            unique_id="192.0.2.10_502_force_mode",
            attributes={"options": ["None", "Charge", "Discharge"]},
            **om,
        ),
        entity(
            "number.venus_charge_power",
            "Venus Charge power",
            0,
            unit="W",
            unique_id="192.0.2.10_502_set_charge_power",
            **om,
        ),
        entity(
            "number.venus_discharge_cutoff",
            "Venus Discharge cutoff",
            12,
            unit="%",
            unique_id="192.0.2.10_502_discharging_cutoff_capacity",
            **om,
        ),
        entity(
            "number.venus_max_charge",
            "Venus Max charge power",
            2500,
            unit="W",
            unique_id="192.0.2.10_502_max_charge_power",
            **om,
        ),
        entity(
            "sensor.house_meter_power",
            "Meter power",
            -60,
            unit="W",
            device_class="power",
            platform="tasmota",
            device_id="meter",
        ),
        entity(
            "sensor.house_power",
            "House power",
            1400,
            unit="W",
            device_class="power",
            platform="shelly",
            device_id="em",
        ),
        entity(
            "sensor.fs_east_today",
            "East today",
            12.5,
            unit="kWh",
            device_class="energy",
            unique_id="A_energy_production_today",
            entry="A",
            **fs,
        ),
        entity(
            "sensor.fs_east_tomorrow",
            "East tomorrow",
            11.0,
            unit="kWh",
            device_class="energy",
            unique_id="A_energy_production_tomorrow",
            entry="A",
            **fs,
        ),
        entity(
            "sensor.fs_east_remaining",
            "East remaining",
            9.3,
            unit="kWh",
            device_class="energy",
            unique_id="A_energy_production_today_remaining",
            entry="A",
            **fs,
        ),
        entity(
            "sensor.fs_east_power_now",
            "East estimated power now",
            1150,
            unit="W",
            device_class="power",
            unique_id="A_power_production_now",
            entry="A",
            **fs,
        ),
        entity(
            "sensor.fs_west_today",
            "West today",
            16.5,
            unit="kWh",
            device_class="energy",
            unique_id="B_energy_production_today",
            entry="B",
            **fs,
        ),
        entity(
            "sensor.fs_west_tomorrow",
            "West tomorrow",
            16.3,
            unit="kWh",
            device_class="energy",
            unique_id="B_energy_production_tomorrow",
            entry="B",
            **fs,
        ),
        entity(
            "sensor.octopus_price",
            "Electricity price",
            0.285719,
            unit="€/kWh",
            device_class="monetary",
            platform="octopus_germany",
            attributes={"timeslots": timeslots, "rates": [], "unit_rate_forecast": []},
        ),
        entity(
            "select.evcc_carport_mode",
            "Carport mode",
            "pv",
            unique_id="evcc_intg.evcc_carport_mode",
            device_id="carport",
            attributes={"options": ["off", "pv", "minpv", "now"]},
            **ev,
        ),
        entity(
            "binary_sensor.evcc_carport_connected",
            "Carport connected",
            "on",
            unique_id="evcc_intg.evcc_carport_connected",
            device_id="carport",
            **ev,
        ),
        entity(
            "sensor.evcc_carport_charge_power",
            "Carport charge power",
            0,
            unit="W",
            device_class="power",
            unique_id="evcc_intg.evcc_carport_charge_power",
            device_id="carport",
            **ev,
        ),
        entity(
            "select.evcc_floor_mode",
            "Floor heating mode",
            "pv",
            unique_id="evcc_intg.evcc_floor_mode",
            device_id="floor",
            **ev,
        ),
        entity(
            "weather.home",
            "Home",
            "sunny",
            platform="met",
            attributes={"supported_features": 3},
        ),
        entity("person.alex", "Alex", "home"),
        entity("person.sam", "Sam", "not_home"),
        entity("calendar.alex_work", "Alex Arbeit", "off", platform="local_calendar"),
        entity("calendar.family", "Familie", "off", platform="local_calendar"),
        entity("binary_sensor.workday", "Workday", "on", platform="workday"),
        entity(
            "sensor.battery_total_soc",
            "Total SoC",
            48,
            unit="%",
            device_class="battery",
            platform="template",
        ),
        entity(
            "sensor.window_battery",
            "Fenster Bad Batterie",
            90,
            unit="%",
            device_class="battery",
            platform="acme_sensors",
            device_id="window",
        ),
        entity(
            "sensor.ev_battery",
            "EV Battery Level",
            71,
            unit="%",
            device_class="battery",
            platform="kia_uvo",
            device_id="car",
        ),
        entity(
            "sensor.ev_charging_power",
            "EV Charging Power",
            0,
            unit="W",
            device_class="power",
            platform="kia_uvo",
            device_id="car",
        ),
        entity(
            "sensor.network_power",
            "Netzwerk Leistung",
            45,
            unit="W",
            device_class="power",
            platform="tasmota",
            device_id="plug",
        ),
        entity(
            "sensor.phone_battery",
            "Phone battery",
            80,
            unit="%",
            device_class="battery",
            platform="mobile_app",
            device_id="phone",
        ),
    ]
    devices = [
        DeviceInfo(
            "storage", "BYD Battery-Box Premium HV", "BYD", "Battery-Box Premium HV"
        ),
        DeviceInfo("inverter", "Symo GEN24 10.0", "Fronius", "Symo GEN24 10.0 Plus"),
        DeviceInfo("flow", "SolarNet", "Fronius", "SolarNet"),
        DeviceInfo("venus", "Marstek Venus E", "Marstek", "Venus E"),
        DeviceInfo("carport", "Carport", "evcc", "loadpoint"),
        DeviceInfo("floor", "Floor heating", "evcc", "loadpoint"),
        DeviceInfo("phone", "Alex Phone", "Apple", "iPhone"),
        DeviceInfo("window", "Fenster Bad", "Acme", "Window sensor"),
        DeviceInfo("car", "Electric car", "Hyundai", "Battery electric vehicle"),
        DeviceInfo("plug", "Netzwerk", "Tasmota", "Plug"),
    ]
    energy = {
        "energy_sources": [
            {
                "type": "grid",
                "stat_energy_from": "sensor.meter_import",
                "stat_energy_to": "sensor.meter_export",
                "entity_energy_price": "sensor.octopus_price",
                "number_energy_price": None,
                "entity_energy_price_export": None,
                "number_energy_price_export": 0.062,
                "stat_rate": "sensor.house_meter_power",
            },
            {
                "type": "battery",
                "stat_energy_from": "sensor.battery_out",
                "stat_energy_to": "sensor.battery_in",
                "stat_rate": "sensor.solarnet_power_battery",
            },
            {
                "type": "solar",
                "stat_energy_from": "sensor.pv_energy",
                "stat_rate": "sensor.solarnet_power_photovoltaics",
                "config_entry_solar_forecast": ["A", "B"],
            },
        ],
        "device_consumption": [
            {
                "stat_consumption": "sensor.house_energy",
                "stat_rate": "sensor.house_power",
                "name": "Haus",
            },
            {
                "stat_consumption": "sensor.ac_office_energy",
                "name": "Klimaanlage Büro",
                "included_in_stat": "sensor.house_energy",
            },
            {
                "stat_consumption": "sensor.basement_energy",
                "name": "Heizungskeller",
                "included_in_stat": "sensor.house_energy",
            },
            {
                "stat_consumption": "sensor.hot_water_energy",
                "name": "Warmwasser Wärmepumpe",
                "included_in_stat": "sensor.basement_energy",
            },
            {
                "stat_consumption": "sensor.floor_heating_energy",
                "name": "Fussbodenheizung Küche",
                "included_in_stat": "sensor.house_energy",
            },
            {
                "stat_consumption": "sensor.fridge_energy",
                "name": "Kühlschrank",
                "included_in_stat": "sensor.house_energy",
            },
            {"stat_consumption": "sensor.wallbox_energy", "name": "Wallbox"},
        ],
    }
    return snapshot(entities, devices, energy)


def generic_household(
    *, grid_watts: float = 300, pv_watts: float = 2100, home_watts: float = 2400
) -> Snapshot:
    """Unknown inverter, a battery Joe can only read, dynamic prices, Solcast, no Energy dashboard."""
    raw_today = [
        {
            "start": f"2026-10-03T{h:02d}:00:00+02:00",
            "end": f"2026-10-03T{h:02d}:59:59+02:00",
            "value": 0.20 + (0.15 if 7 <= h <= 20 else 0) + h / 1000,
        }
        for h in range(24)
    ]
    # Tomorrow: cheapest in the early morning, as with most exchange prices.
    raw_tomorrow = [
        {
            "start": f"2026-10-04T{h:02d}:00:00+02:00",
            "end": f"2026-10-04T{h:02d}:59:59+02:00",
            "value": 0.18 + (0.15 if 7 <= h <= 20 else 0) + abs(h - 3) / 500,
        }
        for h in range(24)
    ]
    entities = [
        entity(
            "sensor.acme_pv_power",
            "PV Leistung",
            pv_watts,
            unit="W",
            device_class="power",
            platform="acme_solar",
        ),
        entity(
            "sensor.acme_grid_power",
            "Netz Leistung",
            grid_watts,
            unit="W",
            device_class="power",
            platform="acme_solar",
        ),
        entity(
            "sensor.acme_home_power",
            "Hausverbrauch",
            home_watts,
            unit="W",
            device_class="power",
            platform="acme_solar",
        ),
        entity(
            "sensor.acme_pv_forecast",
            "PV Prognose Leistung",
            1800,
            unit="W",
            device_class="power",
            platform="acme_solar",
        ),
        entity(
            "sensor.solarflow_level",
            "SolarFlow Ladestand",
            63,
            unit="%",
            device_class="battery",
            platform="zendure_ha",
            device_id="flow800",
        ),
        entity(
            "sensor.solarflow_power",
            "SolarFlow Leistung",
            0,
            unit="W",
            device_class="power",
            platform="zendure_ha",
            device_id="flow800",
        ),
        entity(
            "number.solarflow_min_level",
            "SolarFlow Minimaler Ladestand",
            10,
            unit="%",
            platform="zendure_ha",
            device_id="flow800",
            attributes={"min": 5, "max": 50, "step": 1},
        ),
        entity(
            "number.solarflow_charge_power",
            "SolarFlow Ladeleistung",
            0,
            unit="W",
            platform="zendure_ha",
            device_id="flow800",
            attributes={"min": 0, "max": 1200, "step": 10},
        ),
        entity(
            "select.solarflow_mode",
            "SolarFlow Betriebsmodus",
            "Automatik",
            platform="zendure_ha",
            device_id="flow800",
            attributes={"options": ["Automatik", "Laden", "Entladen"]},
        ),
        entity(
            "sensor.nordpool_price",
            "Strompreis",
            0.312,
            unit="EUR/kWh",
            device_class="monetary",
            platform="nordpool",
            attributes={"raw_today": raw_today, "raw_tomorrow": raw_tomorrow},
        ),
        entity(
            "sensor.solcast_today",
            "Forecast Today",
            18.2,
            unit="kWh",
            device_class="energy",
            platform="solcast_solar",
            unique_id="solcast_api_forecast_today",
            entry="sol",
        ),
        entity(
            "sensor.solcast_tomorrow",
            "Forecast Tomorrow",
            20.1,
            unit="kWh",
            device_class="energy",
            platform="solcast_solar",
            unique_id="solcast_api_forecast_tomorrow",
            entry="sol",
        ),
    ]
    devices = [DeviceInfo("flow800", "SolarFlow 800", "Zendure", "SolarFlow 800")]
    return snapshot(entities, devices)
