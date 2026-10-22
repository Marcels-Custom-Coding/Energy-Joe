"""Where the parts of the day meet: "Nacheinander" with the daytime cap, the
base load with the makers' limits, the order of blocks within one battery."""

from __future__ import annotations

from datetime import timedelta
from typing import Any

import pytest

from custom_components.energy_joe.control.adapters import RoleAdapter, make_adapter
from custom_components.energy_joe.control.writes import Write
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .test_control import make_executor
from .test_guard import guarded, install, kinds
from .test_surplus import day_plan, install_evcc
from .test_team import (
    byd_levers,
    flows,
    install_team,
    never_opposite,
    team_byd,
    team_config,
    team_venus,
    venus_levers,
)


@pytest.fixture(autouse=True)
def berlin(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


async def test_the_cap_leaves_a_waiting_venus_blocked(
    hass: HomeAssistant, freezer
) -> None:
    """The BYD's turn with the daytime cap, the Venus waits blocked both
    ways. Her cap would share the system's switch with the discharge limit:
    the cap goes to the BYD, the Venus' switch stays untouched (every
    minute, nothing written anew)."""
    freezer.move_to("2026-06-20T09:00:00+02:00")
    calls = install_team(hass, byd_soc=40, venus_soc=40)
    install_evcc(hass)
    flows(hass, grid=-2000, byd=500)
    config = team_config(team_byd(limit_ref_w=5000), team_venus(), day_surplus=True)
    executor, _ = await make_executor(hass, config, day_plan(dt_util.now()))
    await executor.async_check()
    view = executor.view["team"]
    assert view["active"] == "byd" and not view["parallel"]
    assert view["batteries"]["venus"]["discharge"] == "blocked"
    assert view["batteries"]["venus"]["charge"] == "blocked"
    never_opposite(view)
    assert executor.view["surplus"]["batteries"]["venus"]["state"] == "team_wait"
    assert executor.view["surplus"]["batteries"]["byd"]["state"] == "capped"
    # The discharge limit is 0 before the shared switch goes on, and the
    # switch never goes off again.
    switch = calls.index(("switch.omni_power_limits", "on"))
    assert calls.index(("number.omni_max_discharge", "0.0")) < switch
    assert ("switch.omni_power_limits", "off") not in calls
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    for _ in range(2):
        calls.clear()
        freezer.tick(timedelta(minutes=1))
        await executor.async_check()
        assert calls == []


def varta_battery() -> dict[str, Any]:
    return {
        "id": "varta",
        "name": "VARTA",
        "adapter": "varta_modbus",
        "soc_entity": "sensor.varta_soc",
        "controls": {
            "charge_limit": "number.v_charge",
            "discharge_limit": "number.v_discharge",
        },
    }


async def test_a_base_load_runs_below_zero_and_not_below_the_smallest_power(
    hass: HomeAssistant,
) -> None:
    """VARTA's discharge limit runs from -4000 to 0 and takes 0 or at least
    500 W: 400 W of base load would be clipped to 0 (blocked completely)."""
    install_team(hass)
    watts = {"unit_of_measurement": "W", "step": 1}
    hass.states.async_set("number.v_charge", "4000", {**watts, "min": 0, "max": 4000})
    hass.states.async_set(
        "number.v_discharge", "-4000", {**watts, "min": -4000, "max": 0}
    )
    hass.states.async_set("sensor.varta_soc", "60", {"unit_of_measurement": "%"})
    config = team_config(team_byd(), varta_battery())
    executor, _ = await make_executor(hass, config, None)
    adapter = make_adapter(varta_battery())
    assert isinstance(adapter, RoleAdapter)
    blocks, _ = adapter.team_block(hass, True, True, False)
    assert executor._team_base_writes(adapter, True, blocks, 800) == [
        Write("number.v_charge", 0),
        Write("number.v_discharge", -800),
    ]
    assert executor._team_base_writes(adapter, True, blocks, 400)[-1] == Write(
        "number.v_discharge", -500
    )
    # A limit from 0 up (the Fronius-like ones) stays positive.
    assert executor._team_base_writes(
        make_adapter(team_byd()), True, [Write("number.discharge_limit", 0)], 400
    ) == [Write("number.discharge_limit", 0)]


async def test_no_base_load_where_a_mode_blocks(hass: HomeAssistant) -> None:
    """A battery blocked with its mode never writes its discharge limit: no
    base load with it (it would be held completely while Joe counts on it)."""
    install_team(hass)
    hass.states.async_set(
        "select.g_mode",
        "auto",
        {"options": ["auto", "charge", "standby", "only_out", "only_in"]},
    )
    hass.states.async_set(
        "number.g_discharge",
        "3000",
        {"min": 0, "max": 3000, "unit_of_measurement": "W"},
    )
    hass.states.async_set("sensor.g_soc", "60", {"unit_of_measurement": "%"})
    generic = {
        "id": "g",
        "name": "G",
        "adapter": "generic",
        "soc_entity": "sensor.g_soc",
        "controls": {"mode": "select.g_mode", "discharge_limit": "number.g_discharge"},
        "mode_options": {
            "normal": "auto",
            "force_charge": "charge",
            "hold": "standby",
            "no_charge": "only_out",
            "no_discharge": "only_in",
        },
    }
    adapter = make_adapter(generic)
    assert isinstance(adapter, RoleAdapter) and adapter.team_lever() == "mode"
    config = team_config(team_byd(), generic)
    executor, _ = await make_executor(hass, config, None)
    lever = executor._team_base_lever(config, ["g"], {"g": generic}, {"g": "g"})
    assert lever is None


async def test_within_one_battery_the_block_comes_before_the_free(
    hass: HomeAssistant, freezer
) -> None:
    """The BYD's charging was blocked, now its discharging is: its discharge
    limit goes to 0 before its charge limit is given back (never a moment in
    which it is free both ways)."""
    freezer.move_to("2026-10-10T19:00:00+02:00")
    calls = install_team(hass, byd_soc=40, venus_soc=60)
    flows(hass, grid=0, byd=-800)
    executor, _ = await make_executor(hass, team_config(), day_plan(dt_util.now()))
    await executor.async_check()
    assert executor.view["team"]["state"] == "on"
    now = dt_util.now()
    await executor._async_team_apply(
        team_config(), {"byd": (True, False), "venus": (True, True)}, set(), now
    )
    assert byd_levers(hass) == ("0.0", "on", "100.0", "off")
    calls.clear()
    await executor._async_team_apply(
        team_config(), {"byd": (False, True), "venus": (True, True)}, set(), now
    )
    assert byd_levers(hass) == ("100.0", "off", "0.0", "on")
    blocked = calls.index(("switch.discharge_limit", "on"))
    freed = calls.index(("switch.charge_limit", "off"))
    assert blocked < freed, calls


async def test_the_watchdog_steps_in_while_a_block_holds_a_victrons_charge_power(
    hass: HomeAssistant, freezer
) -> None:
    """Victron's ESS charge power is its charge power at night and its
    charge limit by day: noted for a block of "Nacheinander", it is no
    command of Joe's the watchdog must keep out of."""
    freezer.move_to("2026-10-18T14:00:00+02:00")
    calls = install(hass)
    hass.states.async_set(
        "number.vic_charge", "0", {"min": -1, "max": 10000, "unit_of_measurement": "W"}
    )
    victron = team_byd(
        adapter="victron_gx",
        controls={
            "min_soc": "number.reserve",
            "charge_power": "number.vic_charge",
            "charge_limit": "number.vic_charge",
            "discharge_limit": "number.discharge_limit",
        },
    )
    executor, _ = await guarded(hass, victron, team_venus())
    # "Nacheinander" blocks its charging: the limit's original is noted.
    executor.data["saved"]["number.vic_charge"] = -1.0
    flows(hass, byd=-900, venus=800)
    await executor.async_guard()
    freezer.tick(timedelta(seconds=20))
    await executor.async_guard()
    assert kinds(executor) == ["guard_block"]
    assert calls == [
        ("number.discharge_limit", "0.0"),
        ("number.discharge_limit", "100.0"),
    ]
