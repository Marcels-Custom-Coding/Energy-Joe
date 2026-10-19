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
- discharge_limit (+ discharge_limit_enabled): a cap on the discharge power,
  charge_limit (+ charge_limit_enabled) one on the charge power
- by day only: switches that allow (allow_charge, allow_discharge) or block
  (block_charge, block_discharge) a direction, a mode's options for one
  direction (no_charge, no_discharge) and the system's limits

A profile names the entities of one integration (by their stable keys) and
the order in which Joe tries the levers. Batteries of integrations without a
profile get the same levers assigned in the panel (suggested by names, units
and options) and are checked with a test run before Joe steers them.

The file has no Home Assistant imports so the model can use it, too.
"""

from __future__ import annotations

from dataclasses import dataclass, field, replace
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
    "system_charge_limit",
    "system_charge_limit_enabled",
    "system_discharge_limit",
    "system_manual_mode",
    "allow_charge",
    "allow_discharge",
    "block_charge",
    "block_discharge",
)
# Levers only for the day (the daytime cap, several batteries one after the
# other), on the integration's system device (all its batteries at once): no
# part of the night's steering, its test run or its signature, and a lever
# that is gone keeps no battery from being steered. The system's limits share
# one switch (system_charge_limit_enabled).
SYSTEM_ROLES = (
    "system_charge_limit",
    "system_charge_limit_enabled",
    "system_discharge_limit",
)
# Levers only for the watchdog (control/guard.py: two batteries running
# against each other): the system's manual mode, whose short pulse restarts
# Omnibattery's own control (its PD controller), and a battery's switches that
# allow charging and discharging at all (or, the other way round, block them:
# on = blocked, Kostal over Modbus). Like the system's levers no part of the
# night's steering, its test run or its signature.
GUARD_ROLES = (
    "system_manual_mode",
    "allow_charge",
    "allow_discharge",
    "block_charge",
    "block_discharge",
)
# Every lever outside the night's steering.
DAY_ROLES = (*SYSTEM_ROLES, *GUARD_ROLES)
# Everything Joe does to a battery (the panel's "Vorgänge", see
# control/operations.py): charging from the grid, holding the level, blocking
# both directions or one by day ("Nacheinander", the watchdog), the daytime
# cap, and putting everything back. The owner may give own steps for each
# (battery.steps); those of the day are, like the day's levers, no part of
# the night's test run or its signature.
OPERATIONS = (
    "charge",
    "hold",
    "block",
    "block_charge",
    "block_discharge",
    "cap",
    "release",
)
DAY_OPERATIONS = ("block", "block_charge", "block_discharge", "cap")
BLOCK_OPERATIONS = ("block", "block_charge", "block_discharge")
# Meanings of mode options: the night's, and two for the day only (a mode
# that keeps the battery from charging, one that keeps it from discharging,
# e.g. HomeWizard's "zero_discharge_only" and "zero_charge_only").
NIGHT_OPTIONS = ("normal", "force_charge", "hold", "force_discharge")
DAY_OPTIONS = ("no_charge", "no_discharge")
MODE_OPTIONS = (*NIGHT_OPTIONS, *DAY_OPTIONS)
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
    "system_charge_limit": ("number", "input_number"),
    "system_charge_limit_enabled": ("switch", "input_boolean"),
    "system_discharge_limit": ("number", "input_number"),
    "system_manual_mode": ("switch", "input_boolean"),
    "allow_charge": ("switch", "input_boolean"),
    "allow_discharge": ("switch", "input_boolean"),
    "block_charge": ("switch", "input_boolean"),
    "block_discharge": ("switch", "input_boolean"),
}

# Ways to charge from the grid:
#   mode     - mode = force_charge with charge_power (charge_target stops it)
#   target   - grid_charge on with charge_target as the level
#   min_soc  - grid_charge on and min_soc raised to the level (the inverter
#              charges up to its reserve by itself, e.g. Fronius, Tesla)
#   switch   - grid_charge on alone: the battery charges as fast as it does
#              and Joe stops it at the level (SENEC's "Load Battery"); only
#              for profiles that name it, never for levers the user assigned
CHARGE_METHODS = ("mode", "target", "min_soc")
ALL_CHARGE_METHODS = (*CHARGE_METHODS, "switch")
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
    # Roles looked for in the whole integration entry (a system device that
    # steers all its batteries at once, see SYSTEM_ROLES).
    entry_roles: dict[str, tuple[str, ...]] = field(default_factory=dict)
    # Roles of the watchdog (GUARD_ROLES) on the battery's own device, looked
    # for in batteries set up before, too (the system's are in entry_roles).
    guard_roles: dict[str, tuple[str, ...]] = field(default_factory=dict)
    # Keys of switches in the integration entry that work against a daytime
    # cap while they are on (the panel warns about them).
    day_conflicts: tuple[str, ...] = ()
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
    # Roles the device's own control takes back once the prepare steps are
    # undone (Omnibattery): Joe puts them back only while it still holds the
    # prepare step, never afterwards, and does not read them back then.
    loop_owned: tuple[str, ...] = ()
    # Where automations that write to the battery are looked for: its "device"
    # (and devices linked to it), or the whole integration "entry" (Omnibattery
    # keeps settings of its control loop on a system device).
    automation_scope: str = "device"
    # Levers of the battery itself that only the day uses (the daytime cap,
    # "Nacheinander", the watchdog), e.g. Huawei's or Victron's power limits:
    # also looked for in batteries set up before, no part of the night's
    # steering, its test run or its signature.
    day_roles: dict[str, tuple[str, ...]] = field(default_factory=dict)
    # Its switches that block charging and discharging exclude each other
    # (one on turns the other off, Kostal over Modbus): one direction at a time.
    exclusive: bool = False
    # Its floor (min_soc) and charge target at its level hold it both ways by
    # day, for "Nacheinander" (Kostal over Modbus, whose block switches
    # exclude each other). Never above its level: a floor above it would
    # charge it from the grid.
    level_block: bool = False
    # Roles (and keys of prepare steps) whose writes end up in the device's
    # flash or EEPROM, or in the integration's stored settings (Omnibattery
    # saves its entry and a backup). No daytime cap with them (it follows the
    # sun). Where flash is to be spared (flash_gap_s > 0) a value that does
    # not show is written again less often, and the watchdog blocks with
    # them only without a gentler lever, at most every flash_gap_s.
    flash: tuple[str, ...] = ()
    flash_gap_s: float = 0.0
    # Seconds Joe waits at most for entities that only become available once
    # a prepare step was read back (SolarEdge's commands after "Remote
    # Control"); Home Assistant skips calls to unavailable entities silently.
    ready_s: float = 30.0
    # Its charging setpoint runs negative (Zendure's manual power: < 0 charges);
    # only for an entity whose range goes below 0.
    charge_negative: bool = False
    # The smallest power other than 0 its limits take (W; VARTA: 0 or 500+).
    limit_min_w: float = 0.0
    # Mode options Joe gives back as another one (a state the select shows but
    # does not take, or the fallback of a forced mode: Fox ESS ends in
    # "Back-up" when Home Assistant restarts during a forced charge).
    restore_as: dict[str, str] = field(default_factory=dict)
    # Whether it regulates itself to 0 W at the grid meter (Joe's proposal for
    # "Regelt sich selbst"): "yes", "auto" (unless its prepare step is on, e.g.
    # Omnibattery's manual mode) or "no" (not known).
    regulating: str = "no"
    # What the owner must switch on first (codes the panel explains).
    needs: tuple[str, ...] = ()
    # Why Joe cannot steer it when the profile's levers are not there (a code
    # the panel explains, with what to do).
    note: str = ""
    # Why Joe can keep it from discharging but not charge it from the grid.
    charge_note: str = ""


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
    regulating="yes",
)

# Victron over MQTT: the core integration (victron_gx) and the custom one it
# came from (victron_mqtt, tomer-w) share their keys (translation key = the
# metric's short id, library victron-mqtt, October 2026). All of these are
# settings of the GX (CGwacs, written to its flash): Victron warns about
# frequent writes. Never "external_control" (ESS mode 3 needs a write every
# 60 s, or the Multi goes into passthru).
_VICTRON_GX = Profile(
    key="victron_gx",
    name="Victron",
    roles={
        "min_soc": ("system_ess_min_soc_limit", "multi_ess_min_soc_limit"),
        "mode": ("system_ess_batterylife_state",),
        "charge_power": ("system_ess_max_charge_power",),
    },
    # By day: the ESS charge power (W, -1 = no limit) and the inverter's
    # discharge power (W, 0 = no discharging, "UserDischargeLimited"). The
    # same entity as charge_power: the night uses it as a power, the day as
    # a limit. Proven on no real system.
    day_roles={
        "charge_limit": ("system_ess_max_charge_power",),
        "discharge_limit": ("system_ess_max_inverter_power_limit",),
    },
    options=_o(
        normal=("optimized_battery_life", "optimized_no_battery_life"),
        force_charge="keep_batteries_charged",
    ),
    restore_as={"external_control": "optimized_battery_life"},
    charge=("mode",),
    hold=("min_soc",),
    block=("min_soc",),
    flash=("min_soc", "mode", "charge_power", "charge_limit", "discharge_limit"),
    flash_gap_s=900,
    regulating="yes",
    note="victron_gx",
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
            regulating="yes",
        ),
        Profile(
            key="omnibattery",
            name="Omnibattery",
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
            # The daytime cap: the system's power limits, in automatic mode
            # (manual mode would stop Omnibattery's own grid-zero control).
            # Unique ids "marstek_venus_system_system_power_limits",
            # "…_system_max_charge_power" and "…_system_max_discharge_power" on
            # the system device (October 2026). Several batteries one after the
            # other block discharging with the same switch.
            entry_roles={
                "system_charge_limit": ("system_max_charge_power",),
                "system_charge_limit_enabled": ("system_power_limits",),
                "system_discharge_limit": ("system_max_discharge_power",),
                # The watchdog restarts Omnibattery's PD controller with a short
                # pulse of the system's manual mode (unique id
                # "marstek_venus_system_manual_mode"; the battery's own one ends
                # in "battery_manual_mode" and is no match).
                "system_manual_mode": ("system_manual_mode",),
            },
            # The watchdog blocks one direction of a Venus for a few seconds
            # (unique ids "…_battery_allow_charge", "…_battery_allow_discharge").
            guard_roles={
                "allow_charge": ("battery_allow_charge",),
                "allow_discharge": ("battery_allow_discharge",),
            },
            # Its own charge delay and predictive charging hold charging back, too.
            day_conflicts=("charge_delay", "predictive_charging"),
            limits={
                "max_charge_w": ("max_charge_power",),
                "max_discharge_w": ("max_discharge_power",),
            },
            scope="device",
            proven=True,
            pace=1.0,
            loop_owned=("mode", "charge_power", "discharge_power"),
            automation_scope="entry",
            # Each switch of these saves Omnibattery's entry and a backup of
            # it (async_update_entry, async_save_config_backup): no lever to
            # flip all the time. They are its only levers, so the watchdog
            # keeps using them (no gap: its stages pace it).
            flash=(
                "allow_charge",
                "allow_discharge",
                "system_manual_mode",
                "battery_manual_mode",
            ),
            regulating="auto",
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
                # Only the experimental integration (HACS, same domain) has
                # these: the power in % of the inverter's rated power and the
                # level of its eco charge; the select sends both along.
                "charge_power": ("eco_mode_power",),
                "charge_target": ("eco_mode_soc",),
            },
            # The core integration leaves eco_charge and eco_discharge out of
            # the options (get_operation_modes(False)): Joe can hold, not charge.
            options=_o(
                normal="general",
                force_charge="eco_charge",
                force_discharge="eco_discharge",
            ),
            charge=("mode",),
            hold=("min_soc",),
            block=("min_soc",),
            inverted=("min_soc",),
            regulating="yes",
            charge_note="goodwe_core",
        ),
        Profile(
            key="kostal_plenticore",
            name="Kostal",
            # REST API (pykoplenti): only the floor; "Battery min SoC" is
            # switched off in Home Assistant until the owner switches it on.
            roles={"min_soc": ("Battery:MinSoc",)},
            charge=(),
            hold=("min_soc",),
            block=("min_soc",),
            regulating="yes",
            note="kostal_core",
            charge_note="kostal_core",
        ),
        Profile(
            # "Kostal Plenticore Battery Control" (mbuhansen, v3.0.0, Modbus
            # TCP 1502, unit 71): unique id "<entry>_<key>". The inverter
            # takes these only with its battery management set to "External
            # via protocol (Modbus TCP)" (installer menu, register 1080 = 2),
            # else it ignores them without an error. The integration writes
            # its setpoints itself again and again (timeout/2, at least 5 s).
            key="kostal_modbus_control",
            name="Kostal",
            roles={
                # 5..100 %, step 1; 5 = off (written once), else kept up.
                "min_soc": ("min_soc_limit",),
                # 5..100 %; charging stops there and the battery stays.
                "charge_target": ("max_soc_limit",),
                # "Charge Start": -charge_rate W to register 1034/1026.
                "grid_charge": ("charge_start",),
                "charge_power": ("charge_rate",),
            },
            # "Block Charge" / "Block Discharge": on = blocked. They exclude
            # each other and "Charge Start" (one on turns the others off):
            # one direction (the watchdog, the night). Both directions by day
            # ("Nacheinander"): minimum and maximum level at its level (the
            # integration keeps writing a limit other than 5 / 100 itself).
            day_roles={
                "block_charge": ("block_charge",),
                "block_discharge": ("block_discharge",),
            },
            exclusive=True,
            level_block=True,
            charge=("target",),
            hold=("min_soc",),
            block=("min_soc",),
            limits={
                "max_charge_w": ("battery_max_charge_limit",),
                "max_discharge_w": ("battery_max_discharge_limit",),
            },
            pace=1.0,
            regulating="yes",
            needs=("kostal_modbus_external",),
            note="kostal_modbus",
        ),
        _TESLA,
        replace(_TESLA, key="tessie"),
        replace(_TESLA, key="tesla_fleet"),
        Profile(
            # Cloud, min/MIN (TLX) with the V1 API only. Whether "Battery
            # First" needs a time segment to charge from the grid is not in
            # the code (device behaviour): not proven.
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
            regulating="yes",
        ),
        Profile(
            # 0xAHA/Growatt_ModbusTCP: TL-XH ("tl_xh_priority_mode") and SPH
            # (time periods, no priority select). VPP models (WIT/MOD/MID)
            # need its service and are not steered here.
            key="growatt_modbus",
            name="Growatt",
            roles={
                "mode": ("tl_xh_priority_mode",),
                "min_soc": (
                    "load_first_battery_minimum_soc",
                    "grid_first_discharge_stopped_soc",
                    "discharge_stopped_soc",
                ),
                "charge_target": (
                    "charge_stopped_soc",
                    "batt_first_charge_stopped_soc",
                ),
                "grid_charge": ("ac_charge_enable", "allow_grid_charge"),
                "charge_power": ("charge_power_rate", "batt_first_charge_power_rate"),
                "discharge_power": ("discharge_power_rate",),
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
            regulating="yes",
        ),
        Profile(
            # nathanmarlor/foxess_modbus: unique id "foxess_modbus_[<p>_]<key>".
            # Force Charge/Discharge exist only with its remote control, kept
            # alive by the integration itself (timeout 2 polls); after a
            # restart of Home Assistant, or once the target is reached, the
            # inverter is left in "Back-up".
            key="foxess_modbus",
            name="Fox ESS",
            roles={
                "mode": ("work_mode", "force_charge_mode"),
                # kW: the highest power drawn from the grid, not the battery's.
                "charge_power": ("force_charge_power",),
                "discharge_power": ("force_discharge_power",),
                "min_soc": ("min_soc_on_grid",),
                # max_soc is the global maximum: noted and given back.
                "charge_target": ("max_soc", "force_charge_max_soc"),
            },
            # By day: its charge and discharge currents (A, 0..50) at 0. In
            # ampere: never a daytime cap, only a block.
            day_roles={
                "charge_limit": ("max_charge_current",),
                "discharge_limit": ("max_discharge_current",),
            },
            options=_o(
                normal=("Self Use", "Disable"),
                force_charge="Force Charge",
                force_discharge="Force Discharge",
                hold="Back-up",
            ),
            # The release always ends in "Self Use" (the forced modes and the
            # "Back-up" they fall back to are no owner's choice).
            restore_as={
                "Force Charge": "Self Use",
                "Force Discharge": "Self Use",
                "Back-up": "Self Use",
            },
            charge=("mode",),
            hold=("min_soc", "mode_hold"),
            block=("mode_hold", "min_soc"),
            regulating="yes",
        ),
        Profile(
            # WillCodeForCats/solaredge-modbus-multi (v4.0.8). Its storage
            # control entities exist only with the option "Power Control
            # Options" > "adv_storage_control"; the command entities are
            # available only once "Remote Control" was read back. control
            # mode, AC charge policy and backup reserve count in write_count
            # (flash); command, timeout and limits do not.
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
            pace=1.0,
            flash=("storage_control_mode", "ac_charge_policy", "min_soc"),
            flash_gap_s=900,
            regulating="yes",
            note="solaredge",
        ),
        Profile(
            # wills106/homeassistant-solax-modbus: one domain for SolaX,
            # Solis and Growatt (unique id "<hub>_<key>"); the first key found
            # counts. SolaX writes its normal controls to EEPROM.
            key="solax_modbus",
            name="SolaX",
            roles={
                "mode": (
                    "manual_mode_select",
                    # Solis: kept up by the integration while not "Off".
                    "battery_control_override_switch",
                    # Growatt GEN3
                    "priority",
                ),
                "min_soc": (
                    "selfuse_discharge_min_soc",
                    "load_first_battery_minimum_soc",
                    "battery_minimum_soc",
                    "ems_discharging_stop_soc",
                ),
                "charge_target": (
                    "battery_first_maximum_soc",
                    "ems_charging_stop_soc",
                ),
                "grid_charge": ("battery_first_charge_from_grid", "charger_switch"),
                "charge_power": (
                    "battery_first_charge_rate",
                    "battery_control_override_charge_power",
                    "ems_charging_rate",
                ),
                "discharge_power": ("battery_control_override_discharge_power",),
            },
            options=_o(
                normal=("Load First", "Off"),
                force_charge=("Force Charge", "Force charge", "Battery First"),
                hold="Stop Charge and Discharge",
                force_discharge=("Force Discharge", "Force discharge", "Grid First"),
            ),
            values={"grid_charge": ("Enabled", "Disabled")},
            # SolaX only (Solis and Growatt have no such select).
            prepare=(Set("charger_use_mode", "Manual Mode"),),
            charge=("mode", "target"),
            hold=("min_soc", "mode_hold"),
            block=("mode_hold", "min_soc"),
            flash=("charger_use_mode", "min_soc", "charge_target"),
            flash_gap_s=900,
            regulating="yes",
        ),
        Profile(
            # TypQxQ/Sigenergy-Local-Modbus: its option "read_only" is on by
            # default (writes are only logged, no error) and its control
            # entities are switched off. The plant's charge and discharge
            # limits (kW) work in any EMS mode, without remote EMS; minimum
            # request period 1 s.
            key="sigen",
            name="Sigenergy",
            roles={
                "mode": ("plant_remote_ems_control_mode",),
                "charge_power": ("plant_ess_max_charging_limit",),
                "discharge_limit": ("plant_ess_max_discharging_limit",),
                "min_soc": ("plant_discharge_cut_off_soc",),
                "charge_target": ("plant_charge_cut_off_soc",),
            },
            day_roles={"charge_limit": ("plant_ess_max_charging_limit",)},
            options=_o(
                normal="Maximum Self Consumption",
                force_charge="Command Charging (Grid First)",
                hold="Standby",
                force_discharge="Command Discharging (ESS First)",
            ),
            prepare=(Set("plant_remote_ems_enable", True),),
            charge=("mode",),
            hold=("min_soc", "limit", "mode_hold"),
            block=("limit", "mode_hold"),
            limits={
                "max_charge_w": ("plant_ess_rated_charging_power",),
                "max_discharge_w": ("plant_ess_rated_discharging_power",),
            },
            pace=1.0,
            regulating="yes",
            needs=("sigen_write",),
            note="sigen",
        ),
        Profile(
            # KRoperUK/sungrow-hass. "Stop" is stop + self consumption, no hold.
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
            regulating="yes",
        ),
        Profile(
            # weltmeyer/ha_sonnenbatterie: select and numbers exist only with
            # write access switched on in the sonnen web interface
            # (IN_LocalAPIWriteActive). "optimizing" shows, but cannot be chosen.
            key="sonnenbatterie",
            name="sonnen",
            roles={
                "mode": ("select_operating_mode",),
                "charge_power": ("number_charge",),
                "discharge_power": ("number_discharge",),
                "min_soc": ("battery_reserve",),
            },
            options=_o(normal=("automatic", "timeofuse"), force_charge="manual"),
            restore_as={"optimizing": "automatic"},
            charge=("mode",),
            hold=("min_soc", "standby"),
            block=("standby",),
            regulating="yes",
            note="sonnen_write",
        ),
        Profile(
            # Leonhard-Schwarz/ha_sonnenbatterie_v2 (0.4.0): unique id
            # "<entry>_<key>"; the select's key is "operating_mode_select"
            # (translation key "operating_mode"). Setpoints are not read
            # back; one direction ends the other, 0 ends it.
            key="sonnenbatterie_v2",
            name="sonnen",
            roles={
                "mode": ("operating_mode_select",),
                "charge_power": ("force_charge",),
                "discharge_power": ("force_discharge",),
                "min_soc": ("battery_reserve",),
            },
            options=_o(
                normal=("self_consumption", "automatic_optimization"),
                force_charge="manual",
            ),
            charge=("mode",),
            hold=("min_soc", "standby"),
            block=("standby",),
            regulating="yes",
            note="sonnen_write",
        ),
        Profile(
            # Zendure/Zendure-HA: the "Zendure Manager" device steers with
            # smartMode=1 (kept in RAM). manual_power: < 0 charges, > 0
            # discharges; "manual" acts on the next change of the P1 meter.
            # Writing the devices' own input/output limits and AC mode (the
            # way of batteries set up before) ends up in their flash.
            key="zendure_ha",
            name="Zendure",
            roles={
                "mode": ("operation",),
                "charge_power": ("manual_power",),
                "min_soc": ("min_soc",),
                "charge_target": ("soc_set",),
            },
            options=_o(
                normal="smart",
                force_charge="manual",
                no_charge="smart_discharging",
                no_discharge="store_solar",
            ),
            charge_negative=True,
            # Batteries set up before keep their levers (AC mode, input and
            # output limit, "operation" off before).
            prepare_for=(*MODE_METHODS, "limit"),
            charge=("mode",),
            hold=("min_soc", "standby", "limit"),
            block=("standby", "limit"),
            regulating="yes",
        ),
        _VICTRON_GX,
        # The custom integration can be set to READ_ONLY: then it has no levers.
        replace(_VICTRON_GX, key="victron_mqtt", note="victron_mqtt"),
        Profile(
            # sfstar/hass-victron (Modbus): levers only with write support
            # ("advanced" options). ESS charge power has no register here:
            # Joe charges at full power ("keep batteries charged").
            key="victron",
            name="Victron",
            roles={
                "min_soc": ("settings_ess_batterylife_minimumsoc",),
                "mode": ("settings_ess_batterylife_state",),
            },
            # By day: the inverter's discharge power (W) and DVCC's charge
            # current (A, -1 = off; for the whole system, solar chargers too).
            day_roles={
                "discharge_limit": ("settings_ess_maxdischargepower",),
                "charge_limit": ("settings_ess_maxchargecurrent",),
            },
            options=_o(
                normal=("RESTARTING", "BL_DISABLED"),
                force_charge="KEEP_BATTERIES_CHARGED",
            ),
            # Only 1, 9 and 10 may be written: BatteryLife's own states come
            # back as "with BatteryLife", the others as "without".
            restore_as={
                **dict.fromkeys(
                    (
                        "SELF_CONSUMPTION",
                        "SELF_CONSUMPTION_DUPLICATE_1",
                        "SELF_CONSUMPTION_DUPLICATE_2",
                        "DISCHARGE_DISABLED",
                        "FORCE_CHARGE",
                        "SUSTAIN",
                        "LOW_SOC_RECHARGE",
                    ),
                    "RESTARTING",
                ),
                **dict.fromkeys(
                    (
                        "BL_DISABLED_DUPLICATE_1",
                        "BL_DISABLED_LOW_SOC",
                        "BL_DISABLED_LOC_SOC_RECHARGE",
                    ),
                    "BL_DISABLED",
                ),
            },
            charge=("mode",),
            hold=("min_soc",),
            block=("min_soc",),
            flash=("min_soc", "mode", "charge_limit", "discharge_limit"),
            flash_gap_s=900,
            regulating="yes",
            note="victron_modbus",
        ),
        Profile(
            # The P1 meter's "battery_group_mode", for the whole group. The
            # one-way modes need API 2.2.0: by day only, where offered.
            key="homewizard",
            name="HomeWizard",
            roles={"mode": ("battery_group_mode",)},
            options=_o(
                normal=("zero", "predictive"),
                force_charge="to_full",
                hold="standby",
                no_charge="zero_discharge_only",
                no_discharge="zero_charge_only",
            ),
            charge=("mode",),
            hold=("mode_hold",),
            block=("mode_hold",),
            regulating="yes",
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
            # wlcrs/huawei_solar (v2.1.5): levers and services only with
            # "Advanced: elevate permissions" (installer password). The
            # battery charges from the grid only with "Charge from grid" on.
            key="huawei_solar",
            name="Huawei",
            steps={
                "charge": (
                    Set("storage_charge_from_grid_function", True),
                    Call(
                        "huawei_solar.forcible_charge_soc",
                        {
                            "device_id": "{device}",
                            "target_soc": "{target}",
                            "power": "{power}",
                        },
                    ),
                ),
                # A forcible charge runs until its level: stopped first.
                "hold": (
                    Call(
                        "huawei_solar.stop_forcible_charge", {"device_id": "{device}"}
                    ),
                    Set("storage_maximum_discharging_power", 0),
                ),
                "release": (
                    Call(
                        "huawei_solar.stop_forcible_charge", {"device_id": "{device}"}
                    ),
                ),
            },
            # By day: the inverter's charge and discharge power (W, on the
            # inverter's device, not the battery's).
            day_roles={
                "charge_limit": ("storage_maximum_charging_power",),
                "discharge_limit": ("storage_maximum_discharging_power",),
            },
            limits={
                "max_charge_w": ("storage_maximum_charge_power",),
                "max_discharge_w": ("storage_maximum_discharge_power",),
            },
            regulating="yes",
            note="huawei_permissions",
        ),
        Profile(
            # torbennehmer/hacs-e3dc (v4.0.0): set_power_mode is kept up by
            # the integration every 10 s ("0": its loop stops, the E3/DC goes
            # back by itself). Its power limits (set_power_limits) would also
            # remove the owner's own: not used.
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
            limits={
                "max_charge_w": ("system-battery-charge-max",),
                "max_discharge_w": ("system-battery-discharge-max",),
            },
            # Its weather-based charging holds charging back by day.
            day_conflicts=("pset-weatherregulationenabled",),
            regulating="yes",
        ),
        Profile(
            # Core indevolt: its charge service switches to real-time control
            # and runs to the level; the button "stop" is its standby.
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
                "hold": (Set("stop"),),
                "release": (Set("energy_mode", "self_consumed_prioritized"),),
            },
            regulating="yes",
        ),
        Profile(
            # andreasreinhardt81/varta_modbus_hacs (v1.1.7): unique id
            # "<serial>_<key>". The integration writes active limits again
            # every 60 s itself (the battery's watchdog: 120 s). Takes 0 or
            # at least 500 W; the discharge limit runs from -4000 to 0.
            key="varta_modbus",
            name="VARTA",
            roles={
                "charge_limit": ("maximum_charging_power",),
                "discharge_limit": ("maximum_discharging_power",),
            },
            charge=(),
            hold=("limit",),
            block=("limit",),
            limit_min_w=500,
            regulating="yes",
        ),
        Profile(
            # marq24/ha-senec-v3: "Load Battery" (local entry, SENEC V2/V3)
            # charges without a level or power, Joe stops it; the reserve
            # (web entry, 0..50 %, only with "Backup Power pro", switched off
            # by default). Two entries of one integration: looked for in all
            # of it. Not proven.
            key="senec",
            name="SENEC",
            roles={
                "grid_charge": ("safe_charge",),
                "min_soc": ("spare_capacity",),
            },
            charge=("switch",),
            hold=("min_soc",),
            block=("min_soc",),
            scope="integration",
            pace=2.0,
            regulating="yes",
            note="senec",
        ),
        Profile(
            # ViperRNMC/marstek_venus_modbus: unique id "<entry>_<key>"; most
            # levers are switched off by default. Writes to 42xxx count only
            # with RS485 control on; its own grid-zero mode is paused then.
            # The cutoffs exist on v1/v2 only. Not proven.
            key="marstek_modbus",
            name="Marstek",
            roles={
                "mode": ("force_mode",),
                "charge_power": ("set_charge_power",),
                "discharge_power": ("set_discharge_power",),
                "min_soc": ("discharging_cutoff_capacity",),
                "charge_target": ("charging_cutoff_capacity",),
            },
            options=_o(
                normal="standby",
                force_charge="charge",
                force_discharge="discharge",
                hold="standby",
            ),
            prepare=(Set("rs485_control_mode", True),),
            charge=("mode",),
            hold=("mode_hold", "min_soc"),
            block=("mode_hold",),
            limits={
                "max_charge_w": ("max_charge_power",),
                "max_discharge_w": ("max_discharge_power",),
            },
            scope="device",
            pace=1.0,
            regulating="auto",
            note="marstek_modbus",
        ),
        Profile(
            # taurgis/has-marstek-local-api (Open API over UDP): passive mode
            # only through its service (power < 0 charges), for a duration.
            # Its depth of discharge can be written but not read: not used.
            # The release goes back to "auto" (an "ai" mode before is not
            # known to Joe). Not proven.
            key="marstek",
            name="Marstek",
            steps={
                "charge": (
                    Call(
                        "marstek.set_passive_mode",
                        {
                            "device_id": "{device}",
                            "power": "{power_neg}",
                            "duration": "{seconds}",
                        },
                    ),
                ),
                "hold": (
                    Call(
                        "marstek.set_passive_mode",
                        {"device_id": "{device}", "power": 0, "duration": "{seconds}"},
                    ),
                ),
                "release": (Set("operating_mode", "auto"),),
            },
            pace=2.0,
            regulating="yes",
        ),
        Profile(
            # thomluther/ha-anker-solix (cloud, 3.9.0): no level or power for
            # charging from the grid, only its backup charge (full power,
            # until 100 % or the window ends; Joe stops it at the level). Its
            # output 0 in manual mode keeps it from discharging. Replies take
            # minutes; 10 requests per minute and endpoint. Not proven.
            key="anker_solix",
            name="Anker SOLIX",
            roles={
                "min_soc": ("sb_min_soc",),
                "mode": ("preset_usage_mode",),
                "grid_charge": ("preset_backup_option",),
                "discharge_limit": ("preset_system_output_power",),
            },
            options=_o(normal=("smartmeter", "smart")),
            prepare=(Set("preset_usage_mode", "manual"),),
            prepare_for=("limit",),
            charge=("switch",),
            hold=("limit",),
            block=("limit",),
            pace=5.0,
            regulating="yes",
        ),
        Profile(
            # davidrapan/ha-solarman (Deye over its logger stick): translation
            # key = the name as a slug. The six time-of-use programs hold
            # their level (charging from the grid with "Grid"); all six, so
            # it does not matter which one runs. Time of use must be on.
            # The grid charging current (A) stays as the owner set it. Not
            # proven (device behaviour).
            key="solarman",
            name="Deye",
            steps={
                "charge": (
                    Set("battery_grid_charging", True),
                    *(Set(f"program_{n}_soc", "{target}") for n in range(1, 7)),
                    *(Set(f"program_{n}_charging", "Grid") for n in range(1, 7)),
                ),
                "hold": (
                    *(Set(f"program_{n}_charging", "Disabled") for n in range(1, 7)),
                    *(Set(f"program_{n}_soc", "{floor}") for n in range(1, 7)),
                ),
                "release": (),
            },
            # By day: its charge and discharge currents (A) at 0.
            day_roles={
                "charge_limit": ("battery_max_charging_current",),
                "discharge_limit": ("battery_max_discharging_current",),
            },
            pace=1.5,
            needs=("deye_tou",),
            note="solarman",
        ),
    )
}


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

# Integrations whose batteries Joe sees but cannot steer, with the reason (a
# code the panel explains, with what the owner can do). Checked against
# their source in October 2026.
NOT_STEERABLE: dict[str, str] = {
    # Core sma, SMA Devices Plus, ennexOS: sensors only (and no battery
    # parameters); steering SMA needs Modbus registers of the inverter.
    "sma": "sma",
    "pysmaplus": "sma",
    "sma_ennexos": "sma",
    # weltenwort/rct_power: sensors only; writing needs a community script.
    "rct_power": "rct",
    # tolwi/ecoflow_cloud: no forced charging, no power setpoint.
    "ecoflow_cloud": "ecoflow",
    # The local Powerwall integration: only "off grid" (the cloud ones steer).
    "powerwall": "powerwall_local",
    # Vip0r/varta_storage and its forks, tobiasvoll/varta_pulse_neo: sensors only.
    "varta_storage": "varta_read",
    "varta_pulse_neo": "varta_read",
    # redpomodoro/byd_battery_box: read only; BYD is steered through its inverter.
    "byd_battery_box": "byd",
    # WouterTuinstra/growatt_local: only grid charging on/off.
    "growatt_local": "growatt_local",
    # suaveolent/hoymiles_wifi: HYS/HAS hybrids through a service, no MS-A2.
    "hoymiles_wifi": "hoymiles",
    # CrunkA3/kostal_plenticore_modbus: unique ids end in the IP address and
    # its values lapse after the inverter's timeout.
    "kostal_plenticore_modbus": "kostal_modbus_other",
}
# Batteries over MQTT (domain "mqtt", unique ids of their bridges): known by
# words in their device's maker or model only.
MQTT_NOTES: dict[str, str] = {
    "hoymiles": "mqtt_hoymiles",
    "noah": "mqtt_noah",
    "sunsynk": "mqtt_sunsynk",
    "deye": "mqtt_sunsynk",
}
# Integrations that are batteries (or battery systems) only: when Joe sees
# them but finds no level, he says so (its level may be switched off). Not
# those of inverters that may run without a battery (SMA, Growatt, Hoymiles).
BATTERY_PLATFORMS = (
    "kostal_modbus_control",
    "varta_modbus",
    "sonnenbatterie",
    "sonnenbatterie_v2",
    "senec",
    "e3dc_rscp",
    "zendure_ha",
    "marstek_modbus",
    "marstek",
    "anker_solix",
    "indevolt",
    "ecoflow_cloud",
    "powerwall",
    "varta_storage",
    "varta_pulse_neo",
    "byd_battery_box",
)


def day_only(profile: Profile | None) -> set[str]:
    """The roles of a battery that only the day uses (no part of the night)."""
    return {*DAY_ROLES, *(profile.day_roles if profile else ())}
