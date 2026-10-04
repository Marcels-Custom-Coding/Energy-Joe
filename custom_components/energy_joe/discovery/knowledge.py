"""What Joe knows about specific integrations.

Integrations identify their entities with stable keys (translation key or the
end of the unique id). These tables map such keys to roles Joe understands.
Integrations not listed here are still found by the generic rules in find.py.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class KeyRole:
    """A role an integration's entity plays, in Joe's sign convention.

    Joe's convention: grid power positive when importing, battery power
    positive when charging, home and solar power positive.
    """

    role: str
    invert: bool = False


# Roles of measurement and storage entities per integration.
INTEGRATION_ROLES: dict[str, dict[str, KeyRole]] = {
    "fronius": {
        "power_grid": KeyRole("grid_power"),
        "power_load_consumed": KeyRole("home_power"),
        "power_load": KeyRole("home_power", invert=True),  # reported as negative
        "power_photovoltaics": KeyRole("solar_power"),
        "power_battery": KeyRole(
            "battery_power", invert=True
        ),  # positive = discharging
        "state_of_charge": KeyRole("battery_soc"),
        "capacity_maximum": KeyRole("battery_capacity"),
    },
    "omnibattery": {
        "battery_soc": KeyRole("battery_soc"),
        "ac_power": KeyRole("battery_power", invert=True),  # positive = discharging
        "battery_total_energy": KeyRole("battery_capacity"),
    },
}

# Solar forecast integrations and the keys of their daily sums.
FORECAST_KEYS: dict[str, dict[str, str]] = {
    "forecast_solar": {
        "today": "energy_production_today",
        "tomorrow": "energy_production_tomorrow",
        "remaining_today": "energy_production_today_remaining",
    },
    "open_meteo_solar_forecast": {
        "today": "energy_production_today",
        "tomorrow": "energy_production_tomorrow",
        "remaining_today": "energy_production_today_remaining",
    },
    "solcast_solar": {
        "today": "forecast_today",
        "tomorrow": "forecast_tomorrow",
        "remaining_today": "forecast_remaining_today",
    },
}
FORECAST_NAMES: dict[str, str] = {
    "forecast_solar": "Forecast.Solar",
    "open_meteo_solar_forecast": "Open-Meteo Solar Forecast",
    "solcast_solar": "Solcast",
}

# Integrations whose prices Joe can read, with a readable name.
TARIFF_NAMES: dict[str, str] = {
    "octopus_germany": "Octopus Energy",
    "octopus_energy": "Octopus Energy",
    "tibber": "Tibber",
    "nordpool": "Nord Pool",
    "epex_spot": "EPEX Spot",
    "awattar": "aWATTar",
    "entsoe": "ENTSO-E",
    "energyzero": "EnergyZero",
    "easyenergy": "easyEnergy",
}

# Wallbox integrations: keys of the entities Joe uses per charge point.
WALLBOX_KEYS: dict[str, dict[str, str]] = {
    "evcc_intg": {
        "mode": "mode",
        "connected": "connected",
        "charging": "charging",
        "power": "charge_power",
        "vehicle_soc": "vehicle_soc",
        "vehicle_range": "vehicle_range",
        "vehicle_odometer": "vehicle_odometer",
    },
}

# Car integrations (core and HACS) and the keys of their entities per role:
# (entity domain, translation key or end of the unique id), best first.
# Checked against each integration's source in October 2026. Units differ
# (km or mi, kWh or kJ, kWh/100 km, Wh/km or km/kWh): Joe reads them from
# the entity. Bridges over MQTT or ESPHome are left out, their ids are too
# generic; such cars are chosen by hand in the panel.
CAR_KEYS: dict[str, dict[str, list[tuple[str, str]]]] = {
    "audiconnect": {  # Audi
        "soc": [("sensor", "sensor_state_of_charge")],
        "range": [("sensor", "sensor_range")],
        "plugged": [("binary_sensor", "binary_sensor_plug_state")],
        "charging": [("sensor", "sensor_charging_state")],
        "odometer": [("sensor", "sensor_mileage")],
        "outside_temp": [("sensor", "sensor_outdoor_temperature")],
    },
    "bavariandata": {  # BMW / MINI
        "soc": [("sensor", "vehicle_drivetrain_batterymanagement_header")],
        "range": [
            ("sensor", "vehicle_drivetrain_electricengine_kombiremainingelectricrange"),
            ("sensor", "real_range"),
        ],
        "capacity": [("sensor", "vehicle_drivetrain_batterymanagement_maxenergy")],
        "plugged": [
            (
                "binary_sensor",
                "vehicle_powertrain_tractionbattery_charging_port_anyposition_isplugged",
            )
        ],
        "charging": [("sensor", "vehicle_drivetrain_electricengine_charging_status")],
        "odometer": [("sensor", "vehicle_vehicle_travelleddistance")],
        "consumption": [("sensor", "vehicle_drivetrain_avgelectricrangeconsumption")],
    },
    "byd_vehicle": {  # BYD
        "soc": [("sensor", "elec_percent")],
        "range": [("sensor", "endurance_mileage")],
        "plugged": [("binary_sensor", "is_charger_connected")],
        "charging": [("binary_sensor", "is_charging")],
        "odometer": [("sensor", "total_mileage")],
        "consumption": [("sensor", "last_50km_avg_ev_consumption")],
        "outside_temp": [("sensor", "temp_out_car")],
    },
    "cardata": {  # BMW / MINI
        "soc": [
            ("sensor", "vehicle.drivetrain.batteryManagement.header"),
            ("sensor", "vehicle.powertrain.electric.battery.stateOfCharge.displayed"),
        ],
        "range": [
            ("sensor", "vehicle.drivetrain.electricEngine.kombiRemainingElectricRange"),
            ("sensor", "vehicle.drivetrain.electricEngine.remainingElectricRange"),
        ],
        "capacity": [
            ("sensor", "vehicle.drivetrain.batteryManagement.maxEnergy"),
            ("sensor", "vehicle.drivetrain.batteryManagement.batterySizeMax"),
            ("number", "vehicle.manual_battery_capacity"),
        ],
        "plugged": [
            (
                "binary_sensor",
                "vehicle.powertrain.tractionBattery.charging.port.anyPosition.isPlugged",
            ),
            ("sensor", "vehicle.body.chargingPort.status"),
        ],
        "charging": [
            ("sensor", "vehicle.drivetrain.electricEngine.charging.status"),
            ("sensor", "vehicle.drivetrain.electricEngine.charging.hvStatus"),
        ],
        "odometer": [("sensor", "vehicle.vehicle.travelledDistance")],
        "consumption": [("sensor", "vehicle.drivetrain.avgElectricRangeConsumption")],
    },
    "connectedcars_io": {  # Volkswagen
        "soc": [("sensor", "EVchargePercentage")],
        "range": [("sensor", "Range")],
        "capacity": [("sensor", "EVBatteryCapacity")],
        "charging": [("binary_sensor", "Charging")],
        "odometer": [("sensor", "odometer")],
        "consumption": [("sensor", "EVEfficiency")],
        "outside_temp": [("sensor", "outdoorTemperature")],
    },
    "cupra_eu_data_act": {  # Volkswagen, Cupra, Seat
        "soc": [("sensor", "battery_state_report_soc")],
        "range": [("sensor", "range_value")],
        "capacity": [
            ("sensor", "energy_contents_maximal_energy_content_physical_value")
        ],
        "plugged": [("binary_sensor", "plug_state")],
        "charging": [("binary_sensor", "charging")],
        "odometer": [("sensor", "mileage_value")],
        "consumption": [("sensor", "long_term_data_average_electr_engine_consumption")],
        "outside_temp": [("sensor", "outdoor_temperature")],
    },
    "fordconnect_query": {  # Ford, Lincoln
        "soc": [("sensor", "soc")],
        "range": [("sensor", "elveh")],
        "plugged": [("sensor", "elvehplug")],
        "charging": [("sensor", "elvehcharging")],
        "odometer": [("sensor", "odometer")],
        "outside_temp": [("sensor", "outsidetemp")],
    },
    "fordpass": {  # Ford, Lincoln
        "soc": [("sensor", "soc")],
        "range": [("sensor", "elveh")],
        "plugged": [("sensor", "elvehplug")],
        "charging": [("sensor", "elvehcharging")],
        "odometer": [("sensor", "odometer")],
        "outside_temp": [("sensor", "outsidetemp")],
    },
    "get_euda_data": {  # Volkswagen, Cupra, Seat
        "soc": [("sensor", "state_of_charge")],
        "range": [("sensor", "electric_range")],
        "capacity": [("sensor", "max_energy_content_physical")],
        "plugged": [("binary_sensor", "charging_cable_connected")],
        "charging": [("binary_sensor", "charging_state")],
        "odometer": [("sensor", "distance")],
        "consumption": [("sensor", "long_term_average_electric_consumption")],
        "outside_temp": [("sensor", "outside_temperature")],
    },
    "ha_kia_hyundai": {  # Hyundai / Kia / Genesis
        "soc": [("sensor", "ev_battery_level")],
        "range": [("sensor", "ev_remaining_range_value")],
        "plugged": [("binary_sensor", "ev_plugged_in")],
        "charging": [("binary_sensor", "ev_battery_charging")],
        "odometer": [("sensor", "odometer_value")],
    },
    "hello_smart": {  # Smart
        "soc": [("sensor", "battery_level")],
        "range": [("sensor", "range_remaining")],
        "plugged": [("binary_sensor", "charger_connected")],
        "charging": [("sensor", "charging_status")],
        "odometer": [("sensor", "odometer")],
        "consumption": [
            ("sensor", "average_power_consumption"),
            ("sensor", "last_trip_avg_consumption"),
        ],
        "outside_temp": [("sensor", "exterior_temp")],
    },
    "kia_uvo": {  # Hyundai / Kia / Genesis
        "soc": [("sensor", "ev_battery_percentage")],
        "range": [("sensor", "ev_driving_range")],
        "capacity": [("sensor", "ev_battery_capacity")],
        "plugged": [("binary_sensor", "ev_battery_is_plugged_in")],
        "charging": [("binary_sensor", "ev_battery_is_charging")],
        "odometer": [("sensor", "odometer")],
        "consumption": [("sensor", "power_consumption_30d")],
        "outside_temp": [("sensor", "outside_temperature")],
    },
    "leafspy": {  # Nissan Leaf / e-NV200
        "soc": [("sensor", "battery_state_of_charge")],
        "plugged": [("sensor", "plug_state")],
        "odometer": [("sensor", "odometer")],
        "outside_temp": [("sensor", "ambient_temperature")],
    },
    "mbapi2020": {  # Mercedes-Benz
        "soc": [("sensor", "soc")],
        "range": [("sensor", "rangeelectrickm")],
        "plugged": [("sensor", "chargeinletcoupler")],
        "charging": [("binary_sensor", "chargingactive")],
        "odometer": [("sensor", "odometer")],
        "consumption": [("sensor", "electricconsumptionreset")],
    },
    "mg_saic": {  # MG
        "soc": [("sensor", "extendedData1_soc")],
        "range": [("sensor", "fuelRangeElec")],
        "capacity": [("sensor", "totalBatteryCapacity_charge")],
        "plugged": [("binary_sensor", "chargingGunState_binary_sensor")],
        "charging": [("sensor", "bmsChrgSts_charge")],
        "odometer": [("sensor", "mileage")],
        "consumption": [("sensor", "efficiency_since_charge")],
        "outside_temp": [("sensor", "exteriorTemperature")],
    },
    "myskoda": {  # Skoda
        "soc": [("sensor", "battery_percentage")],
        "range": [("sensor", "range")],
        "plugged": [("binary_sensor", "charger_connected")],
        "charging": [("sensor", "charging_state"), ("switch", "charging")],
        "odometer": [("sensor", "mileage")],
        "consumption": [("sensor", "overall_average_electric_consumption")],
        "outside_temp": [("sensor", "outside_temperature")],
    },
    "nissan_connect": {  # Nissan
        "soc": [("sensor", "battery_level")],
        "range": [("sensor", "range_ac_off"), ("sensor", "range_ac_on")],
        "plugged": [("binary_sensor", "plugged")],
        "charging": [("binary_sensor", "charging")],
        "odometer": [("sensor", "odometer")],
        "outside_temp": [("sensor", "external_temperature")],
    },
    "polestar": {  # Polestar
        "soc": [("sensor", "battery_level")],
        "range": [("sensor", "range")],
        "plugged": [("binary_sensor", "is_plugged_in")],
        "charging": [("binary_sensor", "is_charging")],
        "odometer": [("sensor", "odometer")],
        "consumption": [("sensor", "avg_consumption")],
        "outside_temp": [("sensor", "outside_temperature")],
    },
    "polestar_api": {  # Polestar
        "soc": [("sensor", "polestar_battery_charge_level")],
        "range": [("sensor", "polestar_estimated_range")],
        "plugged": [("sensor", "polestar_charger_connection_status")],
        "charging": [("sensor", "polestar_charging_status")],
        "odometer": [("sensor", "polestar_current_odometer")],
        "consumption": [("sensor", "polestar_average_energy_consumption")],
    },
    "porscheconnect": {  # Porsche
        "soc": [("sensor", "state_of_charge")],
        "range": [("sensor", "remaining_range_electric")],
        "plugged": [("sensor", "charging_status")],
        "charging": [("sensor", "charging_status")],
        "odometer": [("sensor", "mileage")],
    },
    "pycupra": {  # Cupra, Seat
        "soc": [("sensor", "battery_level")],
        "range": [("sensor", "electric_range")],
        "plugged": [("binary_sensor", "charging_cable_connected")],
        "charging": [("binary_sensor", "charging_state")],
        "odometer": [("sensor", "distance")],
        "consumption": [("sensor", "trip_last_cycle_average_electric_consumption")],
        "outside_temp": [("sensor", "outside_temperature")],
    },
    "renault": {  # Renault, Dacia
        "soc": [("sensor", "battery_level")],
        "range": [("sensor", "battery_autonomy")],
        "plugged": [("binary_sensor", "plugged_in")],
        "charging": [("binary_sensor", "charging")],
        "odometer": [("sensor", "mileage")],
        "outside_temp": [("sensor", "outside_temperature")],
    },
    "skoda": {  # Skoda
        "soc": [("sensor", "battery_percentage")],
        "range": [("sensor", "electric_range")],
        "plugged": [("sensor", "charging_state")],
        "charging": [("sensor", "charging_state")],
        "odometer": [("sensor", "mileage")],
    },
    "smartcar": {  # Multi-brand via Smartcar
        "soc": [("sensor", "battery_level")],
        "range": [("sensor", "range")],
        "capacity": [("sensor", "battery_capacity")],
        "plugged": [("binary_sensor", "plug_status")],
        "charging": [("sensor", "charging_state")],
        "odometer": [("sensor", "odometer")],
    },
    "smarthashtag": {  # Smart
        "soc": [("sensor", "remaining_battery_percent")],
        "range": [("sensor", "remaining_range")],
        "plugged": [
            ("sensor", "is_charger_connected"),
            ("sensor", "charger_connection_status"),
        ],
        "charging": [("sensor", "charging_status")],
        "odometer": [("sensor", "odometer")],
        "outside_temp": [("sensor", "exterior_temperature")],
    },
    "stellantis_vehicles": {  # Peugeot, Citroen, DS, Opel, Vauxhall
        "soc": [("sensor", "battery")],
        "range": [("sensor", "autonomy")],
        "capacity": [("sensor", "battery_capacity")],
        "plugged": [("binary_sensor", "battery_plugged")],
        "charging": [("binary_sensor", "battery_charging")],
        "odometer": [("sensor", "mileage")],
        "outside_temp": [("sensor", "temperature")],
    },
    "tesla_custom": {  # Tesla
        "soc": [("sensor", "battery")],
        "range": [("sensor", "range")],
        "plugged": [("binary_sensor", "charger")],
        "charging": [("binary_sensor", "charging")],
        "odometer": [("sensor", "odometer")],
        "outside_temp": [("sensor", "temperature_outside")],
    },
    "tesla_fleet": {  # Tesla
        "soc": [("sensor", "charge_state_battery_level")],
        "range": [("sensor", "charge_state_battery_range")],
        "plugged": [("binary_sensor", "charge_state_conn_charge_cable")],
        "charging": [("sensor", "charge_state_charging_state")],
        "odometer": [("sensor", "vehicle_state_odometer")],
        "outside_temp": [("sensor", "climate_state_outside_temp")],
    },
    "tesla_telemetry": {  # Tesla
        "soc": [("sensor", "battery_level_telemetry")],
        "range": [("sensor", "battery_range_telemetry")],
        "plugged": [("binary_sensor", "charge_cable_telemetry")],
        "charging": [("binary_sensor", "charging_active_telemetry")],
        "outside_temp": [("sensor", "outside_temperature_telemetry")],
    },
    "teslafi": {  # Tesla
        "soc": [("sensor", "battery_level")],
        "range": [("sensor", "battery_range")],
        "plugged": [("binary_sensor", "is_plugged_in")],
        "charging": [("binary_sensor", "is_charging")],
        "odometer": [("sensor", "odometer")],
        "outside_temp": [("sensor", "outside_temp")],
    },
    "teslemetry": {  # Tesla
        "soc": [("sensor", "charge_state_battery_level")],
        "range": [
            ("sensor", "charge_state_est_battery_range"),
            ("sensor", "charge_state_battery_range"),
        ],
        "plugged": [("binary_sensor", "charge_state_conn_charge_cable")],
        "charging": [("sensor", "charge_state_charging_state")],
        "odometer": [("sensor", "vehicle_state_odometer")],
        "outside_temp": [("sensor", "climate_state_outside_temp")],
    },
    "tessie": {  # Tesla
        "soc": [("sensor", "charge_state_usable_battery_level")],
        "range": [("sensor", "charge_state_battery_range")],
        "plugged": [("binary_sensor", "charge_state_conn_charge_cable")],
        "charging": [
            ("sensor", "charge_state_charging_state"),
            ("binary_sensor", "charge_state_charging_state"),
        ],
        "odometer": [("sensor", "vehicle_state_odometer")],
        "outside_temp": [("sensor", "climate_state_outside_temp")],
    },
    "toyota": {  # Toyota, Lexus
        "soc": [("sensor", "battery_level")],
        "range": [("sensor", "battery_range")],
        "plugged": [("sensor", "charging_status")],
        "charging": [("sensor", "charging_status")],
        "odometer": [("sensor", "odometer")],
    },
    "toyota_na": {  # Toyota, Lexus
        "soc": [("sensor", "EV Battery Level")],
        "range": [("sensor", "EV Range")],
        "plugged": [("sensor", "Plug Status")],
        "charging": [("binary_sensor", "Charging Status")],
        "odometer": [("sensor", "Odometer")],
    },
    "uconnect": {  # Fiat, Jeep, Alfa Romeo, Chrysler, Dodge, Ram, Maserati
        "soc": [("sensor", "state_of_charge")],
        "range": [("sensor", "distance_to_empty")],
        "plugged": [("binary_sensor", "plugged_in")],
        "charging": [("binary_sensor", "charging")],
        "odometer": [("sensor", "odometer")],
    },
    "vag_connect": {  # Volkswagen, Cupra, Seat
        "soc": [("sensor", "battery_soc")],
        "range": [("sensor", "electric_range_km")],
        "capacity": [("sensor", "battery_cap_kwh")],
        "plugged": [("binary_sensor", "plug_connected")],
        "charging": [("binary_sensor", "is_charging")],
        "odometer": [("sensor", "odometer_km")],
        "consumption": [("sensor", "lifetime_avg_electric_consumption_kwh_100km")],
        "outside_temp": [("sensor", "outside_temp")],
    },
    "volkswagen_connect": {  # Volkswagen
        "soc": [("sensor", "soc")],
        "range": [("sensor", "electric_range")],
        "capacity": [
            ("sensor", "energy_contents.maximal_energy_content.physical_value")
        ],
        "plugged": [("sensor", "plug_connection")],
        "charging": [("sensor", "charging_state")],
        "odometer": [("sensor", "odometer")],
        "outside_temp": [("sensor", "outdoor_temperature")],
    },
    "volkswagen_goconnect": {  # Volkswagen
        "soc": [("sensor", "chargePercentage")],
        "range": [("sensor", "rangeTotalKm")],
        "capacity": [("sensor", "highVoltageBatteryUsableCapacityKwh")],
        "charging": [("binary_sensor", "isCharging")],
        "odometer": [("sensor", "odometer")],
        "consumption": [("sensor", "averageBatteryConsumptionInKwhPer100Km")],
        "outside_temp": [("sensor", "outdoorTemperatures")],
    },
    "volkswagencarnet": {  # Volkswagen
        "soc": [("sensor", "battery_level")],
        "range": [("sensor", "electric_range")],
        "plugged": [("binary_sensor", "charging_cable_connected")],
        "charging": [("switch", "charging")],
        "odometer": [("sensor", "distance")],
        "consumption": [
            ("sensor", "longterm_trip_average_electric_engine_consumption")
        ],
        "outside_temp": [("sensor", "outside_temperature")],
    },
    "volvo": {  # Volvo
        "soc": [("sensor", "battery_charge_level")],
        "range": [("sensor", "distance_to_empty_battery")],
        "capacity": [("sensor", "battery_capacity")],
        "plugged": [("sensor", "charger_connection_status")],
        "charging": [("sensor", "charging_status")],
        "odometer": [("sensor", "odometer")],
        "consumption": [("sensor", "average_energy_consumption")],
    },
    "vw_eu_data_act": {  # Volkswagen, Cupra, Seat
        "soc": [("sensor", "battery_state_report.soc")],
        "range": [("sensor", "range.value")],
        "charging": [("sensor", "charging_state_report.current_charge_state")],
        "odometer": [("sensor", "mileage.value")],
        "outside_temp": [("sensor", "outside_temperature")],
    },
    "zeekr_ev": {  # Zeekr
        "soc": [("sensor", "battery_level")],
        "range": [("sensor", "range")],
        "plugged": [("binary_sensor", "plugged_in")],
        "charging": [("binary_sensor", "charging_status")],
        "odometer": [("sensor", "odometer")],
        "consumption": [("sensor", "trip_2_avg_consumption")],
    },
}


# Platforms that never describe a real home battery or meter.
NOT_HARDWARE = {
    "template",
    "min_max",
    "group",
    "integration",
    "utility_meter",
    "derivative",
    "statistics",
    "filter",
    "threshold",
    "mobile_app",
    "zha",
    "zwave_js",
    "zigbee2mqtt",
    "bthome",
    "xiaomi_ble",
    "govee_ble",
    "switchbot",
    "homekit_controller",
    "hue",
    "ring",
    "unifiprotect",
    "reolink",
}

# Platforms that only forecast; their power values are not measurements.
FORECAST_PLATFORMS = set(FORECAST_KEYS)

# Words in a device's name, model or maker hinting at a home battery.
# Whole words; a trailing "*" also matches longer words.
STORAGE_WORDS = (
    "battery box",
    "batteriespeicher*",
    "stromspeicher*",
    "speicher*",
    "batterie",
    "battery",
    "storage",
    "powerwall",
    "luna*",
    "venus",
    "zendure",
    "solarflow*",
    "solix",
    "pylontech",
    "sonnen*",
    "byd",
)

# Integrations of cars, robots and gadgets: their batteries are no home batteries.
NOT_HOME_BATTERY = {
    "kia_uvo",
    "mbapi2020",
    "tesla_fleet",
    "teslemetry",
    "bmw_connected_drive",
    "renault",
    "volkswagen_we_connect_id",
    "skoda_connect",
    "smartcar",
    "roborock",
    "ecovacs",
    "husqvarna_automower",
    "oilfox",
    "homematicip_cloud",
    "homematicip_local",
    "shelly",
    "tado",
    "netatmo",
    "nuki",
    "switchbot",
}
