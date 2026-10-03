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

# Where a battery's power, capacity and controls live relative to its SoC entity.
# "device": on the same device; "entry": anywhere in the same config entry
# (Fronius puts storage, power flow and inverter controls on different devices).
BATTERY_SCOPE: dict[str, str] = {
    "fronius": "entry",
    "omnibattery": "device",
}

# Control entities Joe uses to steer a battery, per adapter.
ADAPTER_CONTROLS: dict[str, dict[str, str]] = {
    "fronius": {
        "minimum_reserve": "battery_minimum_reserve",
        "grid_charging": "battery_grid_charging",
        "charge_limit": "battery_charge_power_limit",
        "charge_limit_enabled": "battery_charge_power_limit_enabled",
        "discharge_limit": "battery_discharge_power_limit",
        "discharge_limit_enabled": "battery_discharge_power_limit_enabled",
    },
    "omnibattery": {
        "force_mode": "force_mode",
        "charge_power": "set_charge_power",
        "discharge_power": "set_discharge_power",
        "charge_cutoff": "charging_cutoff_capacity",
        "discharge_cutoff": "discharging_cutoff_capacity",
        "work_mode": "user_work_mode",
        "max_charge_power": "max_charge_power",
        "max_discharge_power": "max_discharge_power",
    },
}

# Controls an adapter cannot do without.
REQUIRED_CONTROLS: dict[str, tuple[str, ...]] = {
    "fronius": ("minimum_reserve", "grid_charging"),
    "omnibattery": ("force_mode", "charge_power", "discharge_cutoff"),
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
}

# Wallbox integrations: keys of the entities Joe uses per charge point.
WALLBOX_KEYS: dict[str, dict[str, str]] = {
    "evcc_intg": {
        "mode": "mode",
        "connected": "connected",
        "charging": "charging",
        "power": "charge_power",
        "vehicle_soc": "vehicle_soc",
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

# Words hinting that a device is a home battery.
STORAGE_WORDS = (
    "battery-box",
    "batterie",
    "battery",
    "speicher",
    "akku",
    "storage",
    "powerwall",
    "luna",
    "venus",
    "zendure",
    "solarflow",
    "solix",
    "pylontech",
    "sonnen",
)
