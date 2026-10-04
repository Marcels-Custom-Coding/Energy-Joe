"""What Joe knows about steering batteries: a few common levers ("roles") and,
per integration, which entity plays which role.

Almost every home battery can be steered with some of these levers:

- min_soc: the level the battery does not discharge below (reserve, backup
  reserve, end-of-discharge level)
- charge_target: the level grid charging goes up to (charge cutoff, max level)
- grid_charge: a switch that allows charging from the grid
- mode: a select with a normal option and a forced-charge option (sometimes
  also hold/standby and forced discharge), with charge_power / discharge_power
  as the power for the forced modes
- discharge_limit (+ discharge_limit_enabled): a cap on the discharge power

A profile names the entities of one integration (by their stable keys) and
the order in which Joe tries the levers. Batteries of integrations without a
profile get the same levers assigned in the panel (suggested by names, units
and options) and are checked with a test run before Joe steers them.

The file has no Home Assistant imports so the model can use it, too.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

ROLES = (
    "min_soc",
    "charge_target",
    "grid_charge",
    "mode",
    "charge_power",
    "discharge_power",
    "discharge_limit",
    "discharge_limit_enabled",
    "charge_limit",
    "charge_limit_enabled",
    "command_timeout",
)
# Meanings of mode options.
MODE_OPTIONS = ("normal", "force_charge", "hold", "force_discharge")
# Entity domains per role.
ROLE_DOMAINS: dict[str, tuple[str, ...]] = {
    "min_soc": ("number", "input_number"),
    "charge_target": ("number", "input_number"),
    "grid_charge": ("switch", "input_boolean", "select", "input_select"),
    "mode": ("select", "input_select"),
    "charge_power": ("number", "input_number"),
    "discharge_power": ("number", "input_number"),
    "discharge_limit": ("number", "input_number"),
    "discharge_limit_enabled": ("switch", "input_boolean"),
    "charge_limit": ("number", "input_number"),
    "charge_limit_enabled": ("switch", "input_boolean"),
    "command_timeout": ("number", "input_number"),
}

# Ways to charge from the grid:
#   mode     - mode = force_charge with charge_power (charge_target stops it)
#   target   - grid_charge on with charge_target as the level
#   min_soc  - grid_charge on and min_soc raised to the level (the inverter
#              charges up to its reserve by itself, e.g. Fronius, Tesla)
CHARGE_METHODS = ("mode", "target", "min_soc")
# Ways to keep a battery from discharging:
#   min_soc   - the floor as min_soc (within the entity's range)
#   mode_hold - mode = hold
#   standby   - mode = force_charge with 0 W
#   limit     - discharge_limit 0 (with its switch on)
HOLD_METHODS = ("min_soc", "mode_hold", "standby", "limit")
# Methods that use the mode or the power setpoints (they may need "prepare").
MODE_METHODS = ("mode", "mode_hold", "standby")


@dataclass(frozen=True, slots=True)
class Call:
    """A service call in a profile's steps; values may hold placeholders."""

    service: str
    data: dict[str, Any] = field(default_factory=dict)


@dataclass(frozen=True, slots=True)
class Set:
    """An entity value in a profile's steps (the entity found by its key)."""

    key: str
    value: Any = None


@dataclass(frozen=True, slots=True)
class Profile:
    """How one integration's battery is steered."""

    key: str
    name: str
    # role -> stable keys of the entity (end of unique id or translation key)
    roles: dict[str, tuple[str, ...]] = field(default_factory=dict)
    # meaning -> option texts of the mode select (the first one present counts)
    options: dict[str, tuple[str, ...]] = field(default_factory=dict)
    charge: tuple[str, ...] = CHARGE_METHODS
    hold: tuple[str, ...] = HOLD_METHODS
    block: tuple[str, ...] = ("limit", "mode_hold", "standby", "min_soc")
    # Entities set before steering with these methods, back afterwards
    # (e.g. "Remote Control" before commands are accepted).
    prepare: tuple[Set, ...] = ()
    prepare_for: tuple[str, ...] = MODE_METHODS
    # On/off values of roles that are selects instead of switches.
    values: dict[str, tuple[str, str]] = field(default_factory=dict)
    # Roles whose level runs the other way round (depth of discharge = 100 - floor).
    inverted: tuple[str, ...] = ()
    # Batteries steered by services instead of levers: steps per situation.
    steps: dict[str, tuple[Call | Set, ...]] = field(default_factory=dict)
    # Keys of entities that tell the battery's power limits (W).
    limits: dict[str, tuple[str, ...]] = field(default_factory=dict)
    # Where to look for the entities: "device" of the SoC sensor or the whole "entry".
    scope: str = "entry"
    # Checked on a real battery (all others rely on the integration's source).
    proven: bool = False
    # Seconds to wait after each command, for devices that need time between
    # them (Modbus); twice that after a prepare step.
    pace: float = 0.0


def _o(**options: str | tuple[str, ...]) -> dict[str, tuple[str, ...]]:
    return {k: (v,) if isinstance(v, str) else v for k, v in options.items()}


_TESLA = Profile(
    key="teslemetry",
    name="Tesla Powerwall",
    roles={
        "min_soc": ("backup_reserve_percent",),
        "grid_charge": ("components_disallow_charge_from_grid_with_solar_installed",),
    },
    charge=("min_soc",),
    hold=("min_soc",),
    block=("min_soc",),
)

PROFILES: dict[str, Profile] = {
    profile.key: profile
    for profile in (
        Profile(
            key="fronius",
            name="Fronius",
            roles={
                "min_soc": ("battery_minimum_reserve",),
                "grid_charge": ("battery_grid_charging",),
                "charge_limit": ("battery_charge_power_limit",),
                "charge_limit_enabled": ("battery_charge_power_limit_enabled",),
                "discharge_limit": ("battery_discharge_power_limit",),
                "discharge_limit_enabled": ("battery_discharge_power_limit_enabled",),
            },
            charge=("min_soc",),
            hold=("min_soc",),
            block=("limit", "min_soc"),
            proven=True,
        ),
        Profile(
            key="omnibattery",
            name="Marstek",
            roles={
                "mode": ("force_mode",),
                "charge_power": ("set_charge_power",),
                "discharge_power": ("set_discharge_power",),
                "min_soc": ("discharging_cutoff_capacity",),
                "charge_target": ("charging_cutoff_capacity",),
            },
            options=_o(
                normal="None", force_charge="Charge", force_discharge="Discharge"
            ),
            charge=("mode",),
            hold=("min_soc", "standby"),
            block=("standby",),
            # Omnibattery runs its own control loop and refuses force mode and
            # power setpoints until the battery is switched to manual mode.
            prepare=(Set("battery_manual_mode", True),),
            limits={
                "max_charge_w": ("max_charge_power",),
                "max_discharge_w": ("max_discharge_power",),
            },
            scope="device",
            proven=True,
            pace=1.0,
        ),
        Profile(
            key="enphase_envoy",
            name="Enphase",
            roles={
                "min_soc": ("reserve_soc",),
                "grid_charge": ("charge_from_grid",),
            },
            charge=("min_soc",),
            hold=("min_soc",),
            block=("min_soc",),
        ),
        Profile(
            key="goodwe",
            name="GoodWe",
            roles={
                "min_soc": ("battery_discharge_depth",),
                "mode": ("operation_mode",),
            },
            options=_o(
                normal="general",
                force_charge="eco_charge",
                force_discharge="eco_discharge",
            ),
            charge=("mode",),
            hold=("min_soc",),
            block=("min_soc",),
            inverted=("min_soc",),
        ),
        Profile(
            key="kostal_plenticore",
            name="Kostal",
            roles={"min_soc": ("Battery:MinSoc",)},
            charge=(),
            hold=("min_soc",),
            block=("min_soc",),
        ),
        _TESLA,
        Profile(
            key="tessie",
            name="Tesla Powerwall",
            roles=_TESLA.roles,
            charge=_TESLA.charge,
            hold=_TESLA.hold,
            block=_TESLA.block,
        ),
        Profile(
            key="growatt_server",
            name="Growatt",
            roles={
                "min_soc": ("battery_discharge_soc_limit_on_grid",),
                "charge_target": ("battery_charge_soc_limit",),
                "grid_charge": ("ac_charge",),
                "charge_power": ("battery_charge_power_limit",),
                "discharge_power": ("battery_discharge_power_limit",),
            },
            charge=("target",),
            hold=("min_soc",),
            block=("min_soc",),
        ),
        Profile(
            key="growatt_modbus",
            name="Growatt",
            roles={
                "mode": ("tl_xh_priority_mode",),
                "min_soc": (
                    "load_first_battery_minimum_soc",
                    "grid_first_discharge_stopped_soc",
                ),
                "charge_target": (
                    "charge_stopped_soc",
                    "batt_first_charge_stopped_soc",
                ),
                "grid_charge": ("ac_charge_enable", "allow_grid_charge"),
                "charge_power": ("charge_power_rate", "batt_first_charge_power_rate"),
            },
            options=_o(
                normal="Load First",
                force_charge="Battery First",
                force_discharge="Grid First",
            ),
            values={"grid_charge": ("Enabled", "Disabled")},
            charge=("mode", "target"),
            hold=("min_soc",),
            block=("min_soc",),
        ),
        Profile(
            key="foxess_modbus",
            name="Fox ESS",
            roles={
                "mode": ("work_mode", "force_charge_mode"),
                "charge_power": ("force_charge_power",),
                "discharge_power": ("force_discharge_power",),
                "min_soc": ("min_soc_on_grid",),
                "charge_target": ("max_soc", "force_charge_max_soc"),
            },
            options=_o(
                normal=("Self Use", "Disable"),
                force_charge="Force Charge",
                force_discharge="Force Discharge",
                hold="Back-up",
            ),
            charge=("mode",),
            hold=("min_soc", "mode_hold"),
            block=("mode_hold", "min_soc"),
        ),
        Profile(
            key="solaredge_modbus_multi",
            name="SolarEdge",
            roles={
                "mode": ("storage_command_mode",),
                "min_soc": ("storage_backup_reserve",),
                "charge_power": ("storage_charge_limit",),
                "discharge_limit": ("storage_discharge_limit",),
                "command_timeout": ("storage_command_timeout",),
            },
            options=_o(
                normal="Maximize Self Consumption",
                force_charge="Charge from Solar Power and Grid",
                hold="Charge from Solar Power",
                force_discharge="Discharge to Maximize Export",
            ),
            prepare=(
                Set("storage_control_mode", "Remote Control"),
                Set("ac_charge_policy", "Always Allowed"),
            ),
            prepare_for=(*MODE_METHODS, "limit"),
            charge=("mode",),
            hold=("mode_hold", "min_soc"),
            block=("mode_hold",),
        ),
        Profile(
            key="solax_modbus",
            name="SolaX",
            roles={
                "mode": ("manual_mode_select", "priority"),
                "min_soc": (
                    "selfuse_discharge_min_soc",
                    "load_first_battery_minimum_soc",
                ),
                "charge_target": ("battery_first_maximum_soc",),
                "grid_charge": ("battery_first_charge_from_grid",),
                "charge_power": ("battery_first_charge_rate",),
            },
            options=_o(
                normal="Load First",
                force_charge=("Force Charge", "Battery First"),
                hold="Stop Charge and Discharge",
                force_discharge=("Force Discharge", "Grid First"),
            ),
            values={"grid_charge": ("Enabled", "Disabled")},
            prepare=(Set("charger_use_mode", "Manual Mode"),),
            charge=("mode",),
            hold=("min_soc", "mode_hold"),
            block=("mode_hold", "min_soc"),
        ),
        Profile(
            key="sigen",
            name="Sigenergy",
            roles={
                "mode": ("plant_remote_ems_control_mode",),
                "charge_power": ("plant_ess_max_charging_limit",),
                "min_soc": ("plant_discharge_cut_off_soc",),
                "charge_target": ("plant_charge_cut_off_soc",),
            },
            options=_o(
                normal="Maximum Self Consumption",
                force_charge="Command Charging (Grid First)",
                hold="Standby",
                force_discharge="Command Discharging (ESS First)",
            ),
            prepare=(Set("plant_remote_ems_enable", True),),
            charge=("mode",),
            hold=("min_soc", "mode_hold"),
            block=("mode_hold",),
        ),
        Profile(
            key="sungrow",
            name="Sungrow",
            roles={
                "mode": ("battery_mode",),
                "charge_power": ("charge_discharge_power",),
                "min_soc": ("soc_lower_limit",),
                "charge_target": ("soc_upper_limit",),
                "command_timeout": ("forced_dispatch_duration",),
            },
            options=_o(
                normal="Self-consumption",
                force_charge="Force charge",
                force_discharge="Force discharge",
            ),
            charge=("mode",),
            hold=("min_soc", "standby"),
            block=("standby", "min_soc"),
        ),
        Profile(
            key="sonnenbatterie",
            name="sonnen",
            roles={
                "mode": ("select_operating_mode",),
                "charge_power": ("number_charge",),
                "discharge_power": ("number_discharge",),
                "min_soc": ("battery_reserve",),
            },
            options=_o(normal="automatic", force_charge="manual"),
            charge=("mode",),
            hold=("min_soc", "standby"),
            block=("standby",),
        ),
        Profile(
            key="zendure_ha",
            name="Zendure",
            roles={
                "mode": ("ac_mode",),
                "min_soc": ("min_soc",),
                "charge_target": ("soc_set",),
                "charge_power": ("input_limit",),
                "discharge_limit": ("output_limit",),
            },
            options=_o(normal="output", force_charge="input"),
            prepare=(Set("operation", "off"),),
            prepare_for=(*MODE_METHODS, "limit"),
            charge=("mode",),
            hold=("min_soc", "limit"),
            block=("limit",),
        ),
        Profile(
            key="victron_gx",
            name="Victron",
            roles={
                "min_soc": ("system_ess_min_soc_limit", "multi_ess_min_soc_limit"),
                "mode": ("system_ess_batterylife_state",),
                "charge_power": ("system_ess_max_charge_power",),
            },
            options=_o(
                normal=("optimized_battery_life", "optimized_no_battery_life"),
                force_charge="keep_batteries_charged",
            ),
            charge=("mode",),
            hold=("min_soc",),
            block=("min_soc",),
        ),
        Profile(
            key="victron",
            name="Victron",
            roles={"min_soc": ("settings_ess_batterylife_minimumsoc",)},
            charge=(),
            hold=("min_soc",),
            block=("min_soc",),
        ),
        Profile(
            key="homewizard",
            name="HomeWizard",
            roles={"mode": ("battery_group_mode",)},
            options=_o(normal="zero", force_charge="to_full", hold="standby"),
            charge=("mode",),
            hold=("mode_hold",),
            block=("mode_hold",),
        ),
        Profile(
            key="zinvolt",
            name="Zinvolt",
            roles={
                "min_soc": ("lower_threshold",),
                "charge_target": ("upper_threshold",),
                "mode": ("battery_mode",),
            },
            options=_o(
                normal="self_use",
                force_charge="fast_charge",
                force_discharge="fast_discharge",
            ),
            charge=("mode",),
            hold=("min_soc",),
            block=("min_soc",),
        ),
        Profile(
            key="tuya",
            name="Tuya",
            roles={"min_soc": ("battery_backup_reserve",)},
            charge=(),
            hold=("min_soc",),
            block=("min_soc",),
        ),
        Profile(
            key="huawei_solar",
            name="Huawei",
            steps={
                "charge": (
                    Call(
                        "huawei_solar.forcible_charge_soc",
                        {
                            "device_id": "{device}",
                            "target_soc": "{target}",
                            "power": "{power}",
                        },
                    ),
                ),
                "hold": (Set("storage_maximum_discharging_power", 0),),
                "release": (
                    Call(
                        "huawei_solar.stop_forcible_charge", {"device_id": "{device}"}
                    ),
                ),
            },
        ),
        Profile(
            key="e3dc_rscp",
            name="E3/DC",
            steps={
                "charge": (
                    Call(
                        "e3dc_rscp.set_power_mode",
                        {
                            "device_id": "{device}",
                            "power_mode": "4",
                            "power_value": "{power}",
                        },
                    ),
                ),
                "hold": (
                    Call(
                        "e3dc_rscp.set_power_mode",
                        {"device_id": "{device}", "power_mode": "1", "power_value": 0},
                    ),
                ),
                "release": (
                    Call(
                        "e3dc_rscp.set_power_mode",
                        {"device_id": "{device}", "power_mode": "0", "power_value": 0},
                    ),
                ),
            },
        ),
        Profile(
            key="indevolt",
            name="Indevolt",
            steps={
                "charge": (
                    Call(
                        "indevolt.charge",
                        {
                            "device_id": ["{device}"],
                            "target_soc": "{target}",
                            "power": "{power}",
                        },
                    ),
                ),
                "hold": (Set("discharge_limit", "{floor}"),),
                "release": (Set("energy_mode", "self_consumed_prioritized"),),
            },
        ),
    )
}
PROFILES["tesla_fleet"] = Profile(
    key="tesla_fleet",
    name=_TESLA.name,
    roles=_TESLA.roles,
    charge=_TESLA.charge,
    hold=_TESLA.hold,
    block=_TESLA.block,
)

# Batteries the user assigned the levers for.
GENERIC = Profile(key="generic", name="", scope="device")

# Words in entity names that hint at a role, for integrations without a profile.
# Whole words; a trailing "*" also matches longer words.
ROLE_WORDS: dict[str, tuple[str, ...]] = {
    "min_soc": (
        "reserve",
        "reserv*",
        "mindestreserve",
        "min soc",
        "minimum soc",
        "soc min",
        "backup",
        "notstrom*",
        "end of discharge",
        "discharge cutoff",
        "discharging cutoff",
        "entlade-soc*",
        "entladegrenze",
        "depth of discharge",
        "dod",
        "min capacity",
        "minimum capacity",
        "minimaler ladestand",
        "mindestladestand",
        "min ladestand",
    ),
    "charge_target": (
        "charge cutoff",
        "charging cutoff",
        "lade-soc*",
        "max soc",
        "maximum soc",
        "soc max",
        "charge limit soc",
        "grid charge cutoff",
        "charge stop",
        "ladegrenze",
    ),
    "grid_charge": (
        "grid charging",
        "grid charge",
        "charge from grid",
        "ac charging",
        "ac charge",
        "netzladung",
        "laden aus dem netz",
        "ladung aus dem netz",
        "aus dem netz",
    ),
    "mode": (
        "force mode",
        "forced mode",
        "work mode",
        "working mode",
        "operation mode",
        "operating mode",
        "ems mode",
        "storage mode",
        "battery mode",
        "betriebsmodus",
        "arbeitsmodus",
        "modus",
    ),
    "charge_power": (
        "charge power",
        "charging power",
        "ladeleistung",
        "charge current",
        "charging current",
        "ladestrom",
        "force charge power",
    ),
    "discharge_power": (
        "discharge power",
        "discharging power",
        "entladeleistung",
        "discharge current",
        "entladestrom",
    ),
    "discharge_limit": ("discharge limit", "grenzwert für die entladeleistung"),
    "discharge_limit_enabled": (
        "discharge limit enabled",
        "begrenzung der entladeleistung",
    ),
}
# Words in a mode select's options, per meaning.
OPTION_WORDS: dict[str, tuple[str, ...]] = {
    "force_charge": (
        "force charge",
        "forced charge",
        "forcible charge",
        "charge",
        "charging",
        "laden",
        "zwangsladen",
        "grid charge",
        "eco charge",
        "eco_charge",
    ),
    "force_discharge": (
        "force discharge",
        "forced discharge",
        "discharge",
        "discharging",
        "entladen",
        "eco discharge",
        "eco_discharge",
    ),
    "hold": ("hold", "standby", "stand by", "idle", "pause", "halten", "stop"),
    "normal": (
        "none",
        "normal",
        "auto",
        "automatic",
        "self use",
        "self-use",
        "self consumption",
        "self_consumption",
        "self-consumption",
        "maximise self consumption",
        "eigenverbrauch",
        "general",
        "off",
        "anti_feed",
        "anti feed",
        "default",
        "automatik",
    ),
}
# Words that rule an entity out (limits Joe should not touch, unrelated devices).
NOT_ROLE_WORDS = (
    "max charge power",
    "max discharge power",
    "max. ladeleistung",
    "max. entladeleistung",
    "maximum charge power",
    "maximum discharge power",
    "phase",
    "hysteres*",
    "offgrid",
    "off-grid",
)


def profile_for(adapter: str | None) -> Profile | None:
    """The profile of an adapter name ("generic" for assigned levers, None: watch only)."""
    if adapter == "generic":
        return GENERIC
    return PROFILES.get(adapter or "")


ADAPTERS = ("none", "generic", "steps", *PROFILES)
