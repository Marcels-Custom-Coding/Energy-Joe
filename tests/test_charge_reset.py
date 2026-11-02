"""A charge command that something else sets back is written again, and a
reserve raised during the night is put back when it holds the battery."""

from __future__ import annotations

from datetime import timedelta
from typing import Any

import pytest

from custom_components.energy_joe.control.adapters import make_adapter
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .test_stuck import notifier, reserve
from .test_team import (
    day_plan,
    flows,
    install_team,
    make_executor,
    team_byd,
    team_config,
    team_venus,
)


@pytest.fixture(autouse=True)
def berlin(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


async def make(hass: HomeAssistant, freezer: Any):
    freezer.move_to("2026-11-02T00:10:00+01:00")
    install_team(hass, byd_soc=8, venus_soc=50)
    config = team_config(team_byd(cutoff_soc=10.5), team_venus())
    executor, _ = await make_executor(hass, config, day_plan(dt_util.now()))
    executor.notifier = notifier()
    return executor, make_adapter(config["batteries"][0])


def written(now, seconds: int, **extra: Any) -> dict[str, Any]:
    return {
        "value": -24.6,
        "at": (now - timedelta(seconds=seconds)).isoformat(timespec="seconds"),
        "confirmed": True,
        "battery": "byd",
        **extra,
    }


async def test_a_charge_set_back_soon_after_is_written_again(
    hass: HomeAssistant, freezer
) -> None:
    executor, adapter = await make(hass, freezer)
    now = dt_util.now()
    hass.states.async_set("number.discharge_limit", "0.0")
    executor.status["batteries"]["byd"] = {"action": "charge"}
    entry = written(now, 299)
    executor.data["written"]["number.discharge_limit"] = entry
    assert executor._charge_reset(adapter, "number.discharge_limit", entry, now)
    # Made to be written at once, and counted.
    assert entry["confirmed"] is False
    assert now - dt_util.parse_datetime(entry["at"]) >= timedelta(minutes=5)
    assert len(entry["resets"]) == 1
    logged = executor.data["log"][-1]
    assert logged["kind"] == "charge_reset"
    assert logged["seconds"] == 299 and logged["want"] == -24.6
    assert logged["value"] == 0.0


async def test_it_gives_up_after_three_resets_and_leaves_it_alone(
    hass: HomeAssistant, freezer
) -> None:
    executor, adapter = await make(hass, freezer)
    now = dt_util.now()
    hass.states.async_set("number.discharge_limit", "0.0")
    executor.status["batteries"]["byd"] = {"action": "charge"}
    entry = written(now, 120)
    for _ in range(3):
        assert executor._charge_reset(adapter, "number.discharge_limit", entry, now)
        entry["confirmed"] = True
        entry["at"] = (now - timedelta(seconds=60)).isoformat(timespec="seconds")
    assert not executor._charge_reset(adapter, "number.discharge_limit", entry, now)
    assert executor.data["log"][-1]["kind"] == "charge_reset_gave_up"
    assert executor.data["log"][-1]["times"] == 3


async def test_a_change_long_after_or_without_a_charge_is_the_owners(
    hass: HomeAssistant, freezer
) -> None:
    executor, adapter = await make(hass, freezer)
    now = dt_util.now()
    hass.states.async_set("number.discharge_limit", "0.0")
    # Not charging: the owner's.
    entry = written(now, 120)
    assert not executor._charge_reset(adapter, "number.discharge_limit", entry, now)
    # Charging, but the write is half an hour old: the owner's.
    executor.status["batteries"]["byd"] = {"action": "charge"}
    entry = written(now, 30 * 60)
    assert not executor._charge_reset(adapter, "number.discharge_limit", entry, now)
    assert not any(e["kind"] == "charge_reset" for e in executor.data["log"])


async def test_a_reset_is_written_again_in_the_same_check(
    hass: HomeAssistant, freezer
) -> None:
    """The step Joe went through at 00:05: the inverter shows 0 again after the
    charge command; from then on it must be written again, not left alone."""
    executor, adapter = await make(hass, freezer)
    now = dt_util.now()
    hass.states.async_set(
        "number.discharge_limit", "0.0", {"min": -100, "max": 100, "step": 0.1}
    )
    executor.status["batteries"]["byd"] = {"action": "charge"}
    executor.data["written"]["number.discharge_limit"] = written(now, 299)
    executor._notice_external(adapter, now)
    assert "number.discharge_limit" not in executor.data["external"]
    assert not any(e["kind"] == "external" for e in executor.data["log"])


async def test_the_reserve_raised_in_the_night_is_put_back(
    hass: HomeAssistant, freezer
) -> None:
    executor, _ = await make(hass, freezer)
    freezer.move_to("2026-11-02T07:00:00+01:00")
    install_team(hass, byd_soc=98, venus_soc=98)
    reserve(hass, 99)
    flows(hass, grid=1000, byd=0, venus=0)
    executor.data["night_reserve"]["byd"] = {
        "night": "2026-11-02T00:00:00+01:00",
        "entity": "number.reserve",
        "value": 5.0,
        "at": "2026-11-02T00:00:02+01:00",
    }
    await executor.async_check()
    assert float(hass.states.get("number.reserve").state) == 5.0
    kinds = [e["kind"] for e in executor.data["log"]]
    assert "reserve_back" in kinds
    assert executor.data["night_reserve"] == {}
    back = [e for e in executor.data["log"] if e["kind"] == "reserve_back"][-1]
    assert back["was"] == 99.0 and back["value"] == 5.0


async def test_the_reserve_stays_while_charging_or_when_old(
    hass: HomeAssistant, freezer
) -> None:
    executor, _ = await make(hass, freezer)
    freezer.move_to("2026-11-02T07:00:00+01:00")
    install_team(hass, byd_soc=98, venus_soc=98)
    reserve(hass, 99)
    flows(hass, grid=1000, byd=0, venus=0)
    memory = {
        "night": "2026-11-02T00:00:00+01:00",
        "entity": "number.reserve",
        "value": 5.0,
        "at": "2026-11-02T00:00:02+01:00",
    }
    # Still charging: it is Joe's own raised reserve at work.
    executor.data["night_reserve"]["byd"] = dict(memory)
    executor.status["batteries"]["byd"] = {"action": "charge"}
    assert not await executor._async_reserve_back(
        {"id": "byd"},
        {"reason": "reserve", "entity_id": "number.reserve", "direction": "discharge"},
        dt_util.now(),
    )
    # A day later: a reserve the owner set since is the owner's.
    executor.status["batteries"]["byd"] = {"action": "idle"}
    freezer.move_to("2026-11-03T09:00:00+01:00")
    assert not await executor._async_reserve_back(
        {"id": "byd"},
        {"reason": "reserve", "entity_id": "number.reserve", "direction": "discharge"},
        dt_util.now(),
    )
    assert executor.data["night_reserve"] == {}
    assert float(hass.states.get("number.reserve").state) == 99.0
