"""The makers' profiles (October 2026) and the mechanics several of them need:
switches that block (on = blocked) and exclude each other, limits in W without
a switch (also below 0), kW and A, entities that appear only after a prepare
step, flash that must be spared, modes for one direction, what Joe tells the
owner when he cannot steer."""

from __future__ import annotations

from datetime import timedelta
from typing import Any

import pytest

from custom_components.energy_joe import model
from custom_components.energy_joe.control import writes as joe_writes
from custom_components.energy_joe.control.adapters import (
    Desired,
    RoleAdapter,
    StepsAdapter,
    make_adapter,
)
from custom_components.energy_joe.control.profiles import PROFILES
from custom_components.energy_joe.control.writes import Write, async_apply, fit
from custom_components.energy_joe.discovery import discover
from custom_components.energy_joe.discovery.find import profile_controls
from custom_components.energy_joe.discovery.snapshot import DeviceInfo, EntityInfo
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.util import dt as dt_util

from .snapshots import entity, snapshot
from .test_guard import guarded, install, kinds
from .test_team import flows, team_byd, team_venus

PERCENT = {"min": 0, "max": 100, "step": 1, "unit_of_measurement": "%"}


@pytest.fixture(autouse=True)
def berlin(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


def keep_values(hass: HomeAssistant) -> list[tuple[str, Any]]:
    """number/select/switch services that store the value; calls recorded."""
    calls: list[tuple[str, Any]] = []

    def keep(call: ServiceCall, value: str) -> None:
        entity_id = call.data["entity_id"]
        calls.append((entity_id, value))
        state = hass.states.get(entity_id)
        hass.states.async_set(entity_id, value, state.attributes if state else {})

    hass.services.async_register(
        "number", "set_value", lambda call: keep(call, str(float(call.data["value"])))
    )
    hass.services.async_register(
        "select", "select_option", lambda call: keep(call, call.data["option"])
    )
    hass.services.async_register("switch", "turn_on", lambda call: keep(call, "on"))
    hass.services.async_register("switch", "turn_off", lambda call: keep(call, "off"))
    return calls


def battery(adapter: str, controls: dict[str, str], **extra: Any) -> dict[str, Any]:
    return {
        "id": adapter,
        "name": adapter,
        "adapter": adapter,
        "soc_entity": f"sensor.{adapter}_soc",
        "controls": controls,
        **extra,
    }


def disabled(entity_id: str, unique_id: str, **kw: Any) -> EntityInfo:
    return EntityInfo(
        entity_id=entity_id, name=kw.pop("name", entity_id), unique_id=unique_id, **kw
    )


# --- switches that block (Kostal over Modbus) -----------------------------------


KOSTAL = {
    "min_soc": "number.k_min_soc",
    "charge_target": "number.k_max_soc",
    "grid_charge": "switch.k_charge_start",
    "charge_power": "number.k_charge_rate",
    "block_charge": "switch.k_block_charge",
    "block_discharge": "switch.k_block_discharge",
}


def install_kostal(hass: HomeAssistant) -> None:
    hass.states.async_set("number.k_min_soc", "5", {"min": 5, "max": 100, "step": 1})
    hass.states.async_set("number.k_max_soc", "100", {"min": 5, "max": 100})
    hass.states.async_set(
        "number.k_charge_rate", "0", {"min": 0, "max": 5600, "unit_of_measurement": "W"}
    )
    for switch in ("charge_start", "block_charge", "block_discharge"):
        hass.states.async_set(f"switch.k_{switch}", "off")


def kostal_snapshot(level_on: bool = True):
    k = {"platform": "kostal_modbus_control", "entry": "k", "device_id": "k"}
    items = [
        entity(
            "number.k_min_soc",
            "Battery Minimum SOC Limit",
            5,
            unit="%",
            unique_id="e1_min_soc_limit",
            **k,
        ),
        entity(
            "number.k_max_soc",
            "Battery Maximum SOC Limit",
            100,
            unit="%",
            unique_id="e1_max_soc_limit",
            **k,
        ),
        entity(
            "switch.k_charge_start",
            "Charge Start",
            "off",
            unique_id="e1_charge_start",
            **k,
        ),
        entity(
            "number.k_charge_rate",
            "Set Charge Rate",
            0,
            unit="W",
            unique_id="e1_charge_rate",
            **k,
        ),
        entity(
            "switch.k_block_charge",
            "Block Charge",
            "off",
            unique_id="e1_block_charge",
            **k,
        ),
        entity(
            "switch.k_block_discharge",
            "Block Discharge",
            "off",
            unique_id="e1_block_discharge",
            **k,
        ),
        entity(
            "sensor.k_max_charge",
            "Battery Max Charge Limit",
            5600,
            unit="W",
            unique_id="e1_battery_max_charge_limit",
            **k,
        ),
    ]
    soc = entity(
        "sensor.k_soc",
        "Battery SoC",
        40,
        unit="%",
        device_class="battery",
        unique_id="e1_battery_soc",
        **k,
    )
    snap = snapshot([*items, soc] if level_on else items)
    if not level_on:
        snap.disabled[soc.entity_id] = disabled(
            soc.entity_id,
            "e1_battery_soc",
            platform="kostal_modbus_control",
            config_entry_id="k",
            device_id="k",
            name="Battery SoC",
        )
    return snap


def test_kostal_modbus_is_found_with_its_block_switches() -> None:
    found = discover(kostal_snapshot())["batteries"]
    kostal = next(b for b in found if b["integration"] == "kostal_modbus_control")
    assert kostal["adapter"] == "kostal_modbus_control"
    assert kostal["controls"] == KOSTAL
    assert kostal["max_charge_w"] == 5600
    # What must be switched on in the inverter first, said in the panel.
    assert {"code": "needs.kostal_modbus_external"} in kostal["notes"]


def test_kostal_modbus_without_its_level_is_named() -> None:
    result = discover(kostal_snapshot(level_on=False))
    assert not [
        b for b in result["batteries"] if b["integration"] == "kostal_modbus_control"
    ]
    assert result["battery_notes"] == [
        {
            "integration": "kostal_modbus_control",
            "name": "Kostal",
            "code": "no_level",
            "entities": [{"entity_id": "sensor.k_soc", "name": "Battery SoC"}],
        }
    ]


def test_block_switches_run_the_other_way_and_one_at_a_time(
    hass: HomeAssistant,
) -> None:
    install_kostal(hass)
    adapter = make_adapter(battery("kostal_modbus_control", KOSTAL))
    assert isinstance(adapter, RoleAdapter)
    # One direction for the watchdog: on = blocked.
    assert adapter.guard_block("charge") == [Write("switch.k_block_charge", True)]
    assert adapter.guard_block("discharge") == [Write("switch.k_block_discharge", True)]
    # Both at once never (one on turns the other off): no "Nacheinander".
    assert adapter.team_lever() is None
    assert adapter.team_problem(hass) == "exclusive"
    # The night keeps it from discharging with its switch.
    assert adapter.writes(hass, Desired(floor=40, block=True), 40, {}) == [
        Write("switch.k_block_discharge", True)
    ]
    hass.states.async_set("switch.k_block_discharge", "on")
    assert adapter.discharge_blocked(hass) and not adapter.charge_blocked(hass)
    # Charging: the level and the power first, then "Charge Start".
    assert adapter.writes(
        hass,
        Desired(charge_to=80, power_w=3000),
        40,
        {"switch.k_block_discharge": False},
    ) == [
        Write("switch.k_block_discharge", False),
        Write("number.k_max_soc", 80),
        Write("number.k_charge_rate", 3000),
        Write("switch.k_charge_start", True),
    ]
    # Not part of the night: the signature stays without them.
    plain = {k: v for k, v in KOSTAL.items() if not k.startswith("block_")}
    assert (
        adapter.signature
        == make_adapter(battery("kostal_modbus_control", plain)).signature
    )


def test_allow_switches_of_a_venus_stay_as_they_were(hass: HomeAssistant) -> None:
    """Omnibattery: its allow switches are noted as stored settings, but its
    watchdog and its turns keep their pace (they are its only levers)."""
    adapter = make_adapter(
        {
            **team_venus(),
            "controls": {
                **team_venus()["controls"],
                "allow_charge": "switch.a_c",
                "allow_discharge": "switch.a_d",
            },
        }
    )
    assert adapter.guard_block_roles("charge", True) == ("allow_charge",)
    assert adapter.guard_flash_gap("charge", True) == 0
    assert adapter.team_lever() == "allow"
    blocks, _ = adapter.team_block(hass, True, True, False)
    assert blocks == [Write("switch.a_c", False), Write("switch.a_d", False)]
    assert not any(w.flash for w in blocks)


# --- limits without a switch, below 0 (VARTA), in kW (Sigenergy), in A (Fox) ----


VARTA = {
    "charge_limit": "number.v_charge",
    "discharge_limit": "number.v_discharge",
}


def install_varta(hass: HomeAssistant) -> None:
    watts = {"unit_of_measurement": "W", "step": 1}
    hass.states.async_set("number.v_charge", "4000", {**watts, "min": 0, "max": 4000})
    hass.states.async_set(
        "number.v_discharge", "-4000", {**watts, "min": -4000, "max": 0}
    )


def test_varta_discharge_limit_runs_below_zero(hass: HomeAssistant) -> None:
    install_varta(hass)
    adapter = make_adapter(battery("varta_modbus", VARTA))
    assert isinstance(adapter, RoleAdapter)
    # Wide open is the end farthest from 0, never 0 (that would block it).
    assert adapter._open_wide(hass, "discharge_limit") == Write(
        "number.v_discharge", -4000
    )
    assert adapter._open_wide(hass, "charge_limit") == Write("number.v_charge", 4000)
    assert not adapter.discharge_blocked(hass) and not adapter.charge_blocked(hass)
    assert adapter.team_lever() == "limit"
    blocks, _ = adapter.team_block(hass, True, True, False)
    assert blocks == [Write("number.v_charge", 0), Write("number.v_discharge", 0)]
    hass.states.async_set("number.v_discharge", "0", {"min": -4000, "max": 0})
    assert adapter.discharge_blocked(hass)
    # The night holds it with the limit at 0; the release gives -4000 back.
    assert adapter.writes(hass, Desired(floor=30), 50, {}) == [
        Write("number.v_discharge", 0)
    ]
    assert adapter.release({"number.v_discharge": -4000.0}) == [
        Write("number.v_discharge", -4000.0)
    ]
    # A cap below its smallest power (500 W) would be ignored: 500 W.
    assert adapter.limit(hass, 0.3) == [Write("number.v_charge", 500)]
    assert adapter.limit(hass, 0) == [Write("number.v_charge", 0)]


def test_minus_one_is_no_block(hass: HomeAssistant) -> None:
    """Victron: -1 means no limit."""
    hass.states.async_set("number.vic_charge", "-1", {"min": -1, "max": 10000})
    hass.states.async_set("number.vic_inverter", "-1", {"min": -1, "max": 10000})
    adapter = make_adapter(
        battery(
            "victron_gx",
            {
                "charge_limit": "number.vic_charge",
                "discharge_limit": "number.vic_inverter",
            },
        )
    )
    assert not adapter.charge_blocked(hass) and not adapter.discharge_blocked(hass)


def sigen_snapshot():
    sg = {"platform": "sigen", "entry": "sg", "device_id": "plant"}
    kw = {"unit": "kW"}
    return snapshot(
        [
            entity(
                "sensor.sg_soc",
                "Plant Battery SoC",
                55,
                unit="%",
                device_class="battery",
                unique_id="sg_plant_ess_soc",
                **sg,
            ),
            entity(
                "select.sg_mode",
                "Remote EMS control mode",
                "Maximum Self Consumption",
                unique_id="sg_plant_plant_remote_ems_control_mode",
                attributes={
                    "options": [
                        "PCS Remote Control",
                        "Standby",
                        "Maximum Self Consumption",
                        "Command Charging (Grid First)",
                        "Command Discharging (ESS First)",
                    ]
                },
                **sg,
            ),
            entity(
                "sensor.sg_power",
                "Plant battery power",
                0,
                unit="W",
                device_class="power",
                unique_id="sg_plant_plant_ess_power",
                **sg,
            ),
            entity(
                "switch.sg_remote",
                "Remote EMS",
                "off",
                unique_id="sg_plant_plant_remote_ems_enable",
                **sg,
            ),
            entity(
                "number.sg_charge",
                "ESS max charging limit",
                10,
                unique_id="sg_plant_plant_ess_max_charging_limit",
                **kw,
                **sg,
            ),
            entity(
                "number.sg_discharge",
                "ESS max discharging limit",
                10,
                unique_id="sg_plant_plant_ess_max_discharging_limit",
                **kw,
                **sg,
            ),
            entity(
                "number.sg_cutoff",
                "Discharge cut-off SOC",
                10,
                unit="%",
                unique_id="sg_plant_plant_discharge_cut_off_soc",
                **sg,
            ),
            entity(
                "sensor.sg_rated",
                "Rated charging power",
                10,
                unique_id="sg_plant_plant_ess_rated_charging_power",
                **kw,
                **sg,
            ),
        ],
        devices=[DeviceInfo("plant", "Sigen Plant Battery", "Sigenergy", "SigenStor")],
    )


def test_sigenergy_limits_in_kw(hass: HomeAssistant) -> None:
    found = next(
        b
        for b in discover(sigen_snapshot())["batteries"]
        if b["integration"] == "sigen"
    )
    assert found["adapter"] == "sigen"
    # The rated power in kW becomes W.
    assert found["max_charge_w"] == 10000
    controls = found["controls"]
    assert controls["charge_limit"] == controls["charge_power"] == "number.sg_charge"
    assert controls["discharge_limit"] == "number.sg_discharge"
    assert {"code": "needs.sigen_write"} in found["notes"]
    kw = {"min": 0, "max": 100, "step": 0.001, "unit_of_measurement": "kW"}
    hass.states.async_set("number.sg_charge", "10", kw)
    hass.states.async_set("number.sg_discharge", "10", kw)
    adapter = make_adapter({**found, "name": "Sigen"})
    assert adapter.limit_problem(hass) is None
    assert adapter.limit(hass, 1.5) == [Write("number.sg_charge", 1.5)]
    assert adapter.team_lever() == "limit"
    # By night it does not discharge with its limit at 0 (no remote EMS).
    assert adapter.writes(hass, Desired(floor=55, block=True), 55, {}) == [
        Write("number.sg_discharge", 0)
    ]
    # The plant's levers by day are no part of the night's test run.
    assert "charge_limit" in adapter.day_roles()


def test_a_limit_in_ampere_blocks_but_never_caps(hass: HomeAssistant) -> None:
    amps = {"min": 0, "max": 50, "step": 0.1, "unit_of_measurement": "A"}
    hass.states.async_set("number.fox_charge_current", "50", amps)
    hass.states.async_set("number.fox_discharge_current", "50", amps)
    adapter = make_adapter(
        battery(
            "foxess_modbus",
            {
                "charge_limit": "number.fox_charge_current",
                "discharge_limit": "number.fox_discharge_current",
            },
        )
    )
    assert adapter.limit_problem(hass) == "unit"
    assert adapter.team_lever() == "limit"
    blocks, _ = adapter.team_block(hass, True, False, False)
    assert blocks == [Write("number.fox_charge_current", 0)]


# --- flash (Victron) --------------------------------------------------------------


def test_victron_spares_its_flash(hass: HomeAssistant) -> None:
    hass.states.async_set(
        "number.vic_charge", "-1", {"min": -1, "max": 10000, "unit_of_measurement": "W"}
    )
    hass.states.async_set("number.vic_inverter", "-1", {"min": -1, "max": 10000})
    adapter = make_adapter(
        battery(
            "victron_gx",
            {
                "min_soc": "number.vic_min_soc",
                "charge_power": "number.vic_charge",
                "charge_limit": "number.vic_charge",
                "discharge_limit": "number.vic_inverter",
            },
        )
    )
    # No daytime cap: it would follow the sun with flash writes.
    assert adapter.limit_problem(hass) == "flash"
    assert adapter.guard_block_roles("discharge") == ("discharge_limit",)
    assert adapter.guard_flash_gap("discharge") == 900
    writes, _ = adapter.team_block(hass, False, True, False)
    assert writes == [Write("number.vic_inverter", 0)] and writes[0].flash
    # The day's levers leave the night's signature as it was.
    night = {"min_soc": "number.vic_min_soc", "charge_power": "number.vic_charge"}
    assert adapter.signature == make_adapter(battery("victron_gx", night)).signature


async def test_the_watchdog_blocks_a_victron_at_most_every_15_minutes(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-18T14:00:00+02:00")
    calls = install(hass)
    victron = team_byd(
        adapter="victron_gx",
        controls={
            "min_soc": "number.reserve",
            "discharge_limit": "number.discharge_limit",
        },
    )
    executor, _ = await guarded(hass, victron, team_venus())
    flows(hass, byd=-900, venus=800)
    await executor.async_guard()
    freezer.tick(timedelta(seconds=20))
    await executor.async_guard()
    # Stage 2 at once (nothing to restart): its discharge limit at 0 and back.
    assert calls == [
        ("number.discharge_limit", "0.0"),
        ("number.discharge_limit", "100.0"),
    ]
    assert kinds(executor) == ["guard_block"]
    flows(hass, byd=0, venus=0)
    await executor.async_guard()
    # Again ten minutes later: no second flash write, Joe speaks up instead.
    freezer.tick(timedelta(minutes=10))
    flows(hass, byd=-900, venus=800)
    await executor.async_guard()
    freezer.tick(timedelta(seconds=20))
    await executor.async_guard()
    assert len(calls) == 2
    assert kinds(executor)[-2:] == ["guard_flash", "guard_alarm"]


def test_victron_mqtt_shares_the_core_profile() -> None:
    core, custom = PROFILES["victron_gx"], PROFILES["victron_mqtt"]
    assert custom.roles == core.roles and custom.day_roles == core.day_roles
    assert custom.note == "victron_mqtt"
    # Never ESS mode 3 ("external_control"), not even to give it back.
    assert "external_control" not in str(core.options)
    assert core.restore_as["external_control"] == "optimized_battery_life"


# --- prepare steps and entities that appear afterwards (SolarEdge) ------------------


async def test_joe_waits_for_entities_a_prepare_step_makes_available(
    hass: HomeAssistant, command_pauses: list[float]
) -> None:
    keep_values(hass)
    hass.states.async_set(
        "select.se_control", "Disabled", {"options": ["Disabled", "Remote Control"]}
    )
    hass.states.async_set("select.se_command", "unavailable")
    adapter = make_adapter(
        battery(
            "solaredge_modbus_multi",
            {"mode": "select.se_command"},
            mode_options={"hold": "Charge from Solar Power"},
            prepare=[{"entity_id": "select.se_control", "value": "Remote Control"}],
        )
    )
    writes = adapter.writes(hass, Desired(floor=40), 40, {})
    assert [w.entity_id for w in writes] == ["select.se_control", "select.se_command"]
    assert writes[0].ready_for == ("select.se_command",)
    # The command shows up two looks later (once "Remote Control" was read back).
    looks = []
    appear = [True]

    async def settle(seconds: float) -> None:
        command_pauses.append(seconds)
        looks.append(seconds)
        if len(looks) == 3 and appear[0]:
            hass.states.async_set(
                "select.se_command",
                "Maximize Self Consumption",
                {"options": ["Maximize Self Consumption", "Charge from Solar Power"]},
            )

    joe_writes.settle = settle  # restored by the fixture's patch
    await async_apply(hass, writes[0])
    assert hass.states.get("select.se_command").state == "Maximize Self Consumption"
    assert looks.count(joe_writes.READY_EVERY) == 2
    # Never there: Joe gives up after the profile's time, the write then fails
    # as "unavailable" instead of a call Home Assistant would skip.
    hass.states.async_set("select.se_command", "unavailable")
    looks.clear()
    appear[0] = False
    assert not await joe_writes.async_ready(hass, ("select.se_command",), 2)
    assert len(looks) == 4
    with pytest.raises(joe_writes.WriteError) as err:
        await async_apply(hass, writes[1])
    assert err.value.code == "unavailable"


# --- modes for one direction (HomeWizard, Zendure) ---------------------------------


def homewizard(options: list[str]) -> dict[str, Any]:
    return battery(
        "homewizard",
        {"mode": "select.hw_mode"},
        mode_options={
            "normal": "zero",
            "force_charge": "to_full",
            "hold": "standby",
            **(
                {"no_charge": "zero_discharge_only", "no_discharge": "zero_charge_only"}
                if "zero_charge_only" in options
                else {}
            ),
        },
    )


def test_homewizard_blocks_one_direction_with_its_mode(hass: HomeAssistant) -> None:
    options = ["zero", "to_full", "standby", "zero_charge_only", "zero_discharge_only"]
    hass.states.async_set("select.hw_mode", "zero", {"options": options})
    adapter = make_adapter(homewizard(options))
    assert adapter.team_lever() == "mode"
    assert adapter.team_problem(hass) is None
    assert adapter.team_block(hass, True, False, False)[0] == [
        Write("select.hw_mode", "zero_discharge_only")
    ]
    assert adapter.team_block(hass, False, True, False)[0] == [
        Write("select.hw_mode", "zero_charge_only")
    ]
    assert adapter.team_block(hass, True, True, False)[0] == [
        Write("select.hw_mode", "standby")
    ]
    assert adapter.team_block(hass, False, False, False) == ([], ["mode"])
    hass.states.async_set("select.hw_mode", "zero_charge_only", {"options": options})
    assert adapter.discharge_blocked(hass) and not adapter.charge_blocked(hass)
    hass.states.async_set("select.hw_mode", "standby", {"options": options})
    assert adapter.discharge_blocked(hass) and adapter.charge_blocked(hass)
    assert adapter.guard_block("charge") == [
        Write("select.hw_mode", "zero_discharge_only")
    ]
    # The day's options are no part of the night's signature.
    assert adapter.signature == make_adapter(homewizard(["zero"])).signature


def test_older_homewizard_firmware_has_no_one_way_modes(hass: HomeAssistant) -> None:
    options = ["zero", "to_full", "standby"]
    hass.states.async_set("select.hw_mode", "zero", {"options": options})
    adapter = make_adapter(homewizard(options))
    assert adapter.team_lever() is None
    assert adapter.guard_block_roles("charge") == ()


def test_zendure_charges_through_its_manager_below_zero(hass: HomeAssistant) -> None:
    hass.states.async_set(
        "select.zm_operation",
        "smart",
        {"options": ["off", "manual", "smart", "smart_discharging", "store_solar"]},
    )
    hass.states.async_set(
        "number.zm_power",
        "0",
        {"min": -12000, "max": 12000, "unit_of_measurement": "W"},
    )
    hass.states.async_set("number.z_soc_set", "100", PERCENT)
    adapter = make_adapter(
        battery(
            "zendure_ha",
            {
                "mode": "select.zm_operation",
                "charge_power": "number.zm_power",
                "charge_target": "number.z_soc_set",
            },
            mode_options={
                "normal": "smart",
                "force_charge": "manual",
                "no_charge": "smart_discharging",
                "no_discharge": "store_solar",
            },
        )
    )
    assert adapter.writes(hass, Desired(charge_to=80, power_w=800), 40, {}) == [
        Write("number.z_soc_set", 80),
        Write("number.zm_power", -800),
        Write("select.zm_operation", "manual"),
    ]
    # Standby: manual with 0 W.
    assert adapter.writes(hass, Desired(floor=40, block=True), 40, {}) == [
        Write("number.zm_power", 0),
        Write("select.zm_operation", "manual"),
    ]
    # One direction for the watchdog through its manager (no flash).
    assert adapter.guard_block("discharge") == [
        Write("select.zm_operation", "store_solar")
    ]


def test_zendure_set_up_before_keeps_its_positive_input_limit(
    hass: HomeAssistant,
) -> None:
    hass.states.async_set("select.z_ac", "output", {"options": ["input", "output"]})
    hass.states.async_set("number.z_input", "0", {"min": 0, "max": 1200})
    adapter = make_adapter(
        battery(
            "zendure_ha",
            {"mode": "select.z_ac", "charge_power": "number.z_input"},
            mode_options={"normal": "output", "force_charge": "input"},
        )
    )
    assert adapter.writes(hass, Desired(charge_to=80, power_w=800), 40, {}) == [
        Write("number.z_input", 800),
        Write("select.z_ac", "input"),
    ]
    assert adapter.team_lever() is None


# --- giving a mode back --------------------------------------------------------------


def test_fox_always_goes_back_to_self_use(hass: HomeAssistant) -> None:
    options = ["Self Use", "Feed-in First", "Back-up", "Force Charge"]
    hass.states.async_set("select.fox_mode", "Force Charge", {"options": options})
    adapter = make_adapter(
        battery(
            "foxess_modbus",
            {"mode": "select.fox_mode"},
            mode_options={"normal": "Self Use", "force_charge": "Force Charge"},
        )
    )
    assert adapter.release({"select.fox_mode": "Back-up"}) == [
        Write("select.fox_mode", "Self Use")
    ]
    assert adapter.release({"select.fox_mode": "Feed-in First"}) == [
        Write("select.fox_mode", "Feed-in First")
    ]


def test_an_option_the_select_does_not_take_comes_back_as_normal(
    hass: HomeAssistant,
) -> None:
    hass.states.async_set(
        "select.sonnen_mode",
        "manual",
        {"options": ["manual", "automatic", "timeofuse"]},
    )
    adapter = make_adapter(
        battery(
            "sonnenbatterie",
            {"mode": "select.sonnen_mode"},
            mode_options={"normal": "automatic", "force_charge": "manual"},
        )
    )
    (back,) = adapter.release({"select.sonnen_mode": "optimizing"})
    assert fit(hass, back).value == "automatic"
    # Something the profile does not know: written back where offered, else normal.
    write = adapter._back("select.sonnen_mode", "eco")
    assert fit(hass, write).value == "automatic"
    assert fit(hass, adapter._back("select.sonnen_mode", "timeofuse")).value == (
        "timeofuse"
    )


# --- charging methods ----------------------------------------------------------------


def test_growatt_battery_first_switches_grid_charging_on_first(
    hass: HomeAssistant,
) -> None:
    hass.states.async_set(
        "select.gr_priority",
        "Load First",
        {"options": ["Load First", "Battery First", "Grid First"]},
    )
    hass.states.async_set(
        "select.gr_ac", "Disabled", {"options": ["Disabled", "Enabled"]}
    )
    hass.states.async_set("number.gr_stop", "100", PERCENT)
    hass.states.async_set("number.gr_rate", "100", PERCENT)
    adapter = make_adapter(
        battery(
            "growatt_modbus",
            {
                "mode": "select.gr_priority",
                "grid_charge": "select.gr_ac",
                "charge_target": "number.gr_stop",
                "charge_power": "number.gr_rate",
            },
            mode_options={"normal": "Load First", "force_charge": "Battery First"},
            max_charge_w=5000,
        )
    )
    assert adapter.writes(hass, Desired(charge_to=70, power_w=2500), 40, {}) == [
        Write("select.gr_ac", "Enabled"),
        Write("number.gr_stop", 70),
        Write("number.gr_rate", 50),
        Write("select.gr_priority", "Battery First"),
    ]


def test_senec_charges_with_its_switch_and_joe_stops_it(hass: HomeAssistant) -> None:
    hass.states.async_set("switch.senec_load", "off")
    hass.states.async_set("number.senec_spare", "10", {"min": 0, "max": 50})
    adapter = make_adapter(
        battery(
            "senec",
            {"grid_charge": "switch.senec_load", "min_soc": "number.senec_spare"},
        )
    )
    assert adapter.charge_methods() == ["switch"]
    assert adapter.power_lever(hass) is None
    assert adapter.writes(hass, Desired(charge_to=60), 30, {}) == [
        Write("switch.senec_load", True)
    ]
    saved = {"switch.senec_load": False, "number.senec_spare": 10.0}
    assert adapter.writes(hass, Desired(floor=35), 60, saved) == [
        Write("switch.senec_load", False),
        Write("number.senec_spare", 35),
    ]


def test_senec_needs_both_of_its_entries() -> None:
    local = {"platform": "senec", "entry": "local", "device_id": "senec"}
    web = {"platform": "senec", "entry": "web", "device_id": "web"}
    snap = snapshot(
        [
            entity(
                "sensor.senec_soc",
                "Battery charge",
                50,
                unit="%",
                device_class="battery",
                unique_id="senec.a_s1_battery_soc",
                **local,
            ),
            entity(
                "sensor.senec_power",
                "Battery power",
                0,
                unit="W",
                device_class="power",
                unique_id="senec.a_s1_battery_power",
                **local,
            ),
            entity(
                "switch.senec_load",
                "Load Battery",
                "off",
                unique_id="senec.a_s1_safe_charge",
                **local,
            ),
            entity(
                "number.senec_spare",
                "Spare capacity",
                10,
                unit="%",
                unique_id="senec.w_s1_spare_capacity",
                **web,
            ),
        ],
        devices=[DeviceInfo("senec", "SENEC.Home V3 Speicher", "SENEC", "V3")],
    )
    senec = next(b for b in discover(snap)["batteries"] if b["integration"] == "senec")
    assert senec["adapter"] == "senec"
    assert senec["controls"] == {
        "grid_charge": "switch.senec_load",
        "min_soc": "number.senec_spare",
    }
    del snap.entities["number.senec_spare"]
    senec = next(b for b in discover(snap)["batteries"] if b["integration"] == "senec")
    assert senec["adapter"] == "none"
    assert {"code": "cannot.senec"} in senec["notes"]


# --- service steps (Huawei, Indevolt, Marstek, Deye) ----------------------------------


def huawei_snapshot(grid_switch: bool = True):
    inv = {"platform": "huawei_solar", "entry": "hw", "device_id": "inverter"}
    bat = {"platform": "huawei_solar", "entry": "hw", "device_id": "luna"}
    items = [
        entity(
            "sensor.luna_soc",
            "Battery state of capacity",
            40,
            unit="%",
            device_class="battery",
            unique_id="SN1_storage_state_of_capacity",
            **bat,
        ),
        entity(
            "sensor.luna_power",
            "Charge/Discharge power",
            0,
            unit="W",
            device_class="power",
            unique_id="SN1_storage_charge_discharge_power",
            **bat,
        ),
        entity(
            "number.luna_charging",
            "Maximum charging power",
            5000,
            unit="W",
            unique_id="INV1_storage_maximum_charging_power",
            **inv,
        ),
        entity(
            "number.luna_discharging",
            "Maximum discharging power",
            5000,
            unit="W",
            unique_id="INV1_storage_maximum_discharging_power",
            **inv,
        ),
        entity(
            "sensor.luna_max_charge",
            "Maximum charge power",
            5000,
            unit="W",
            unique_id="INV1_storage_maximum_charge_power",
            **inv,
        ),
    ]
    if grid_switch:
        items.append(
            entity(
                "switch.luna_grid",
                "Charge from grid",
                "off",
                unique_id="SN1_storage_charge_from_grid_function",
                **bat,
            )
        )
    return snapshot(
        items, devices=[DeviceInfo("luna", "LUNA2000 Batteries", "Huawei", "LUNA2000")]
    )


def test_huawei_charges_from_the_grid_only_with_its_switch() -> None:
    found = discover(huawei_snapshot())["batteries"]
    luna = next(b for b in found if b["integration"] == "huawei_solar")
    assert luna["adapter"] == "huawei_solar" and luna["can_charge"]
    assert luna["steps"]["charge"][0] == {
        "entity_id": "switch.luna_grid",
        "value": True,
    }
    assert luna["controls"] == {
        "charge_limit": "number.luna_charging",
        "discharge_limit": "number.luna_discharging",
    }
    assert luna["max_charge_w"] == 5000
    # Without the switch Joe still holds, but does not charge.
    found = discover(huawei_snapshot(grid_switch=False))["batteries"]
    luna = next(b for b in found if b["integration"] == "huawei_solar")
    assert luna["adapter"] == "huawei_solar"
    assert luna["steps"]["charge"] == [] and not luna["can_charge"]


def test_huawei_is_blocked_by_day_with_its_power_limits(hass: HomeAssistant) -> None:
    found = next(
        b
        for b in discover(huawei_snapshot())["batteries"]
        if b["integration"] == "huawei_solar"
    )
    for entity_id in ("number.luna_charging", "number.luna_discharging"):
        hass.states.async_set(
            entity_id, "5000", {"min": 0, "max": 5000, "unit_of_measurement": "W"}
        )
    adapter = make_adapter({**found, "name": "LUNA"})
    assert isinstance(adapter, StepsAdapter) and isinstance(adapter, RoleAdapter)
    assert adapter.team_lever() == "limit"
    assert adapter.limit_problem(hass) is None
    assert adapter.team_block(hass, True, True, False)[0] == [
        Write("number.luna_charging", 0),
        Write("number.luna_discharging", 0),
    ]
    # The night: a running forcible charge stopped first, then no discharging.
    hold = adapter.writes(hass, Desired(floor=40), 40, {})
    assert [w.entity_id for w in hold] == [
        "service:huawei_solar.stop_forcible_charge",
        "number.luna_discharging",
    ]
    # Its day levers are no part of the night's test run.
    missing = adapter.missing(hass)
    assert "number.luna_charging" not in missing and "charge_limit" not in missing


def test_indevolt_holds_with_its_stop_button() -> None:
    ind = {"platform": "indevolt", "entry": "ind", "device_id": "ind"}
    snap = snapshot(
        [
            entity(
                "sensor.ind_soc",
                "Battery SOC",
                50,
                unit="%",
                device_class="battery",
                unique_id="SN_battery_soc",
                **ind,
            ),
            entity(
                "sensor.ind_power",
                "Battery power",
                0,
                unit="W",
                device_class="power",
                unique_id="SN_battery_power",
                **ind,
            ),
            entity(
                "button.ind_stop",
                "Enable standby mode",
                "unknown",
                unique_id="SN_stop",
                **ind,
            ),
            entity(
                "select.ind_mode",
                "Energy mode",
                "self_consumed_prioritized",
                unique_id="SN_energy_mode",
                **ind,
            ),
        ],
        devices=[DeviceInfo("ind", "Indevolt Speicher", "Indevolt", "SolidFlex")],
    )
    found = next(
        b for b in discover(snap)["batteries"] if b["integration"] == "indevolt"
    )
    assert found["steps"]["hold"] == [
        {"service": "button.press", "data": {"entity_id": "button.ind_stop"}}
    ]


def test_marstek_open_api_charges_below_zero_for_a_while(hass: HomeAssistant) -> None:
    profile = PROFILES["marstek"]
    steps = {
        name: [
            {"service": item.service, "data": dict(item.data)}
            if hasattr(item, "service")
            else {"entity_id": "select.m_mode", "value": item.value}
            for item in items
        ]
        for name, items in profile.steps.items()
    }
    adapter = make_adapter(battery("marstek", {}, device_id="dev", steps=steps))
    (call,) = adapter.writes(
        hass, Desired(charge_to=80, power_w=1500, span_s=5 * 3600), 40, {}
    )
    assert call == Write(
        "service:marstek.set_passive_mode",
        {"device_id": "dev", "power": -1500, "duration": 6 * 3600},
    )
    (call,) = adapter.writes(hass, Desired(floor=40, span_s=30 * 3600), 40, {})
    # At most a day.
    assert call.value["duration"] == 86400 and call.value["power"] == 0


def test_deye_steps_cover_all_six_programs() -> None:
    sm = {"platform": "solarman", "entry": "sm", "device_id": "deye"}
    items = [
        entity(
            "sensor.deye_soc",
            "Battery",
            50,
            unit="%",
            device_class="battery",
            unique_id="e_battery_sensor",
            translation_key="battery",
            **sm,
        ),
        entity(
            "sensor.deye_power",
            "Battery Power",
            0,
            unit="W",
            device_class="power",
            unique_id="e_battery_power_sensor",
            **sm,
        ),
        entity(
            "switch.deye_grid",
            "Battery Grid Charging",
            "off",
            unique_id="e_battery_grid_charging_switch",
            translation_key="battery_grid_charging",
            **sm,
        ),
    ]
    for n in range(1, 7):
        items += [
            entity(
                f"number.deye_p{n}_soc",
                f"Program {n} SOC",
                20,
                unit="%",
                unique_id=f"e_program_{n}_soc_number",
                translation_key=f"program_{n}_soc",
                **sm,
            ),
            entity(
                f"select.deye_p{n}_charging",
                f"Program {n} Charging",
                "Disabled",
                unique_id=f"e_program_{n}_charging_select",
                translation_key=f"program_{n}_charging",
                **sm,
            ),
        ]
    snap = snapshot(
        items, devices=[DeviceInfo("deye", "Deye Hybrid Speicher", "Deye", "SUN")]
    )
    found = next(
        b for b in discover(snap)["batteries"] if b["integration"] == "solarman"
    )
    assert found["adapter"] == "solarman"
    assert len(found["steps"]["charge"]) == 13 and len(found["steps"]["hold"]) == 12
    assert {"code": "needs.deye_tou"} in found["notes"]


# --- what Joe says when he cannot steer ----------------------------------------------


def test_joe_says_why_he_cannot_steer_an_sma() -> None:
    sma = {"platform": "sma", "entry": "sma", "device_id": "sbs"}
    snap = snapshot(
        [
            entity(
                "sensor.sbs_soc",
                "Battery SoC",
                60,
                unit="%",
                device_class="battery",
                unique_id="sma_battery_soc_total",
                **sma,
            ),
            entity(
                "sensor.sbs_power",
                "Battery power",
                0,
                unit="W",
                device_class="power",
                unique_id="sma_battery_power",
                **sma,
            ),
        ],
        devices=[DeviceInfo("sbs", "Sunny Boy Storage", "SMA", "SBS3.7")],
    )
    found = next(b for b in discover(snap)["batteries"] if b["integration"] == "sma")
    assert found["adapter"] == "none"
    assert found["notes"] == [{"code": "cannot.sma"}]


def test_a_noah_over_mqtt_is_named() -> None:
    snap = snapshot(
        [
            entity(
                "sensor.noah_soc",
                "SoC",
                60,
                unit="%",
                device_class="battery",
                platform="mqtt",
                device_id="noah",
                unique_id="SN_soc",
            ),
            entity(
                "sensor.noah_power",
                "Power",
                0,
                unit="W",
                device_class="power",
                platform="mqtt",
                device_id="noah",
                unique_id="SN_power",
            ),
        ],
        devices=[DeviceInfo("noah", "NOAH 2000 Batterie", "Growatt", "NOAH 2000")],
    )
    (found,) = discover(snap)["batteries"]
    assert found["notes"] == [{"code": "cannot.mqtt_noah"}]


def test_switched_off_levers_are_named() -> None:
    snap = kostal_snapshot()
    del snap.entities["switch.k_block_charge"]
    snap.disabled["switch.k_block_charge"] = disabled(
        "switch.k_block_charge",
        "e1_block_charge",
        platform="kostal_modbus_control",
        config_entry_id="k",
        device_id="k",
        name="Block Charge",
    )
    found = next(
        b
        for b in discover(snap)["batteries"]
        if b["integration"] == "kostal_modbus_control"
    )
    assert {
        "code": "enable",
        "entities": [{"entity_id": "switch.k_block_charge", "name": "Block Charge"}],
    } in found["notes"]


def test_goodwe_from_core_holds_but_does_not_charge() -> None:
    gw = {"platform": "goodwe", "entry": "gw", "device_id": "gw"}
    snap = snapshot(
        [
            entity(
                "sensor.gw_soc",
                "Battery State of Charge",
                40,
                unit="%",
                device_class="battery",
                unique_id="goodwe-battery_soc-SN1",
                translation_key="battery_soc",
                **gw,
            ),
            entity(
                "sensor.gw_power",
                "Battery Power",
                0,
                unit="W",
                device_class="power",
                unique_id="goodwe-pbattery1-SN1",
                **gw,
            ),
            entity(
                "number.gw_dod",
                "Depth of discharge (on-grid)",
                90,
                unit="%",
                unique_id="goodwe-battery_discharge_depth-SN1",
                translation_key="battery_discharge_depth",
                **gw,
            ),
            entity(
                "select.gw_mode",
                "Inverter operation mode",
                "general",
                unique_id="goodwe-operation_mode-SN1",
                translation_key="operation_mode",
                attributes={"options": ["general", "off_grid", "backup", "eco"]},
                **gw,
            ),
        ],
        devices=[DeviceInfo("gw", "GoodWe Battery Inverter", "GoodWe", "ET")],
    )
    found = next(b for b in discover(snap)["batteries"] if b["integration"] == "goodwe")
    assert found["adapter"] == "goodwe" and not found["can_charge"]
    assert found["notes"] == [{"code": "no_charge.goodwe_core"}]


# --- batteries set up before -----------------------------------------------------------


def test_batteries_set_up_before_only_learn_the_days_levers() -> None:
    snap = huawei_snapshot()
    before = {
        "id": "luna",
        "adapter": "huawei_solar",
        "soc_entity": "sensor.luna_soc",
        "device_id": "luna",
        "controls": {},
    }
    assert profile_controls(snap, before) == {
        "charge_limit": "number.luna_charging",
        "discharge_limit": "number.luna_discharging",
    }
    sig = sigen_snapshot()
    old = {
        "id": "sg",
        "adapter": "sigen",
        "soc_entity": "sensor.sg_soc",
        "controls": {},
    }
    # The night's discharge limit of a newer profile stays out (tested as it was).
    assert profile_controls(sig, old) == {"charge_limit": "number.sg_charge"}


async def test_each_profile_proposes_whether_it_regulates_itself(
    hass: HomeAssistant,
) -> None:
    from .test_control import make_executor

    config = model.validate(
        {
            "version": model.CONFIG_VERSION,
            "batteries": [
                battery("varta_modbus", VARTA),
                battery("tuya", {"min_soc": "number.t"}),
                {**team_venus()},
            ],
        }
    )
    executor, _ = await make_executor(hass, config, None, tested=False)
    hass.states.async_set("switch.venus_manual_mode", "off")
    by_id = {b["id"]: b for b in config["batteries"]}
    assert executor._proposed_regulating(by_id["varta_modbus"])
    assert not executor._proposed_regulating(by_id["tuya"])
    assert executor._proposed_regulating(by_id["venus"])
    hass.states.async_set("switch.venus_manual_mode", "on")
    assert not executor._proposed_regulating(by_id["venus"])


def test_every_profile_names_known_roles_and_valid_options() -> None:
    from custom_components.energy_joe.control.profiles import (
        MODE_OPTIONS,
        ROLE_DOMAINS,
    )

    for profile in PROFILES.values():
        for roles in (
            profile.roles,
            profile.entry_roles,
            profile.guard_roles,
            profile.day_roles,
        ):
            assert set(roles) <= set(ROLE_DOMAINS), profile.key
        assert set(profile.options) <= set(MODE_OPTIONS), profile.key
        assert profile.regulating in ("yes", "auto", "no"), profile.key
        assert profile.scope in ("device", "entry", "integration"), profile.key


def test_an_inverter_without_a_battery_gets_no_note() -> None:
    """SMA, Growatt or Hoymiles may run without a battery: nothing to say then."""
    sma = {"platform": "sma", "entry": "sma", "device_id": "stp"}
    snap = snapshot(
        [
            entity(
                "sensor.stp_power",
                "Grid power",
                3000,
                unit="W",
                device_class="power",
                unique_id="sma_grid_power",
                **sma,
            )
        ],
        devices=[DeviceInfo("stp", "Sunny Tripower", "SMA", "STP 10.0")],
    )
    result = discover(snap)
    assert result["batteries"] == [] and result["battery_notes"] == []
