"""A value Joe wrote that cannot be read at the release (the Modbus connection
restarts every night) is put back at the next try, not given up as someone
else's."""

from __future__ import annotations

from datetime import timedelta
from typing import Any

import pytest

from custom_components.energy_joe.control.adapters import make_adapter
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .test_team import (
    day_plan,
    install_team,
    make_executor,
    team_byd,
    team_config,
    team_venus,
)


@pytest.fixture(autouse=True)
def berlin(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


async def setup(hass: HomeAssistant, freezer: Any):
    freezer.move_to("2026-11-14T04:57:00+01:00")
    install_team(hass, byd_soc=98, venus_soc=50)
    config = team_config(team_byd(cutoff_soc=10.5), team_venus())
    executor, _ = await make_executor(hass, config, day_plan(dt_util.now()))
    now = dt_util.now()
    # Joe's night: the discharge limit enabled and set to 0 (waiting), noted.
    hass.states.async_set("switch.discharge_limit", "on")
    hass.states.async_set("number.discharge_limit", "0.0", {"min": -100, "max": 100})
    for entity, value, original in (
        ("switch.discharge_limit", True, False),
        ("number.discharge_limit", 0.0, 100.0),
    ):
        executor.data["written"][entity] = {
            "value": value,
            "at": (now - timedelta(hours=4)).isoformat(timespec="seconds"),
            "confirmed": True,
            "battery": "byd",
        }
        executor.data["saved"][entity] = original
    return executor, make_adapter(config["batteries"][0])


async def test_the_release_while_unreadable_is_tried_again(
    hass: HomeAssistant, freezer
) -> None:
    executor, _ = await setup(hass, freezer)
    hass.states.async_set("switch.discharge_limit", "unavailable")
    hass.states.async_set("number.discharge_limit", "unavailable")
    await executor._async_release("done", dt_util.now(), force=True)
    # Nothing is given up: Joe still knows what to put back.
    assert executor.data["saved"]["switch.discharge_limit"] is False
    assert executor.data["saved"]["number.discharge_limit"] == 100.0
    assert "number.discharge_limit" in executor.data["written"]
    assert any(e["kind"] == "release_failed" for e in executor.data["log"])
    # The connection is back: the next try puts it back.
    hass.states.async_set("switch.discharge_limit", "on")
    hass.states.async_set("number.discharge_limit", "0.0", {"min": -100, "max": 100})
    await executor._async_release("done", dt_util.now(), force=True)
    assert hass.states.get("switch.discharge_limit").state == "off"
    assert float(hass.states.get("number.discharge_limit").state) == 100.0
    assert "switch.discharge_limit" not in executor.data["saved"]


async def test_a_value_changed_by_someone_else_is_still_left_alone(
    hass: HomeAssistant, freezer
) -> None:
    executor, _ = await setup(hass, freezer)
    # The owner switched it off by hand: theirs now, not put back.
    hass.states.async_set("switch.discharge_limit", "off")
    hass.states.async_set("number.discharge_limit", "50.0", {"min": -100, "max": 100})
    await executor._async_release("done", dt_util.now(), force=True)
    assert float(hass.states.get("number.discharge_limit").state) == 50.0
    assert "number.discharge_limit" not in executor.data["saved"]


async def test_unavailable_is_no_change_by_someone_else(
    hass: HomeAssistant, freezer
) -> None:
    executor, adapter = await setup(hass, freezer)
    hass.states.async_set("number.discharge_limit", "unavailable")
    executor._notice_external(adapter, dt_util.now())
    assert "number.discharge_limit" not in executor.data["external"]
    assert "number.discharge_limit" in executor.data["saved"]
