"""A battery held back by a setting that is not Joe's: told (and the next
one takes its turn), never put back by Joe."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from custom_components.energy_joe.control import team as team_rules
from custom_components.energy_joe.control.notify import JoeNotifier
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .test_team import (
    day_plan,
    flows,
    install_team,
    levels,
    make_executor,
    team_byd,
    team_config,
    team_venus,
)


@pytest.fixture(autouse=True)
def berlin(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


def notifier() -> AsyncMock:
    return AsyncMock(clear_ask=MagicMock(), clear_which_car=MagicMock())


def reserve(hass: HomeAssistant, percent: float) -> None:
    state = hass.states.get("number.reserve")
    hass.states.async_set(
        "number.reserve", str(percent), state.attributes if state else {}
    )


def test_a_battery_that_gives_nothing_is_watched() -> None:
    now = datetime(2026, 10, 19, 19, 0, tzinfo=dt_util.get_time_zone("Europe/Berlin"))
    watch: dict[str, Any] = {}
    # Nothing given while the house draws from the grid: counted from now on.
    assert not team_rules.watch_empty(watch, 0, 1000, now)
    assert "empty_since" in watch
    assert not team_rules.watch_empty(watch, 0, 1000, now + timedelta(minutes=14))
    assert team_rules.watch_empty(watch, -20, 800, now + timedelta(minutes=15))
    # Discharging after all, or no need: the watch starts afresh.
    assert not team_rules.watch_empty(watch, -300, 1000, now + timedelta(minutes=16))
    assert "empty_since" not in watch
    assert not team_rules.watch_empty(watch, 0, 100, now + timedelta(minutes=17))
    assert "empty_since" not in watch


async def test_the_next_one_takes_over_when_the_free_one_gives_nothing(
    hass: HomeAssistant, freezer
) -> None:
    """Evening, both full: the BYD is first to discharge but gives nothing
    (its reserve at 100 % – the owner's doing) while the house draws from
    the grid; after 15 minutes the Venus takes over, after an hour the BYD
    gets another turn."""
    freezer.move_to("2026-10-19T19:00:00+02:00")
    install_team(hass, byd_soc=98, venus_soc=98)
    reserve(hass, 100)
    flows(hass, grid=1000, byd=0, venus=0)
    config = team_config(team_byd(cutoff_soc=10.5), team_venus())
    executor, _ = await make_executor(hass, config, day_plan(dt_util.now()))
    executor.notifier = notifier()
    await executor.async_check()
    assert executor.view["team"]["active"] == "byd"
    # Watched from the next check on (the BYD was just chosen): 15 minutes
    # of nothing, then the Venus.
    for _ in range(4):
        freezer.tick(timedelta(minutes=5))
        await executor.async_check()
    view = executor.view["team"]
    assert view["active"] == "venus"
    assert "byd" in executor.data["team"]["stuck"]
    kinds = [e["kind"] for e in executor.data["log"]]
    assert "team_stuck" in kinds
    handover = [e for e in executor.data["log"] if e["kind"] == "team_handover"]
    assert handover[-1]["battery"] == "venus" and handover[-1]["reason"] == "stuck"
    # The Venus discharges now; the BYD's turn comes again after an hour.
    flows(hass, grid=0, byd=0, venus=-900)
    for _ in range(11):
        freezer.tick(timedelta(minutes=5))
        await executor.async_check()
        assert executor.view["team"]["active"] == "venus"
    freezer.tick(timedelta(minutes=6))
    await executor.async_check()
    assert "byd" not in executor.data["team"]["stuck"]
    assert executor.view["team"]["active"] == "byd"


async def test_a_reserve_at_the_level_is_told_once_and_cleared(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-19T19:00:00+02:00")
    install_team(hass, byd_soc=98, venus_soc=98)
    reserve(hass, 100)
    flows(hass, grid=1000, byd=0, venus=0)
    config = team_config(team_byd(cutoff_soc=10.5), team_venus())
    executor, _ = await make_executor(hass, config, day_plan(dt_util.now()))
    executor.notifier = notifier()
    await executor.async_check()
    assert "byd" in executor.data["stuck_watch"]
    assert executor.data["stuck"] == {}
    executor.notifier.async_problem.assert_not_awaited()
    for _ in range(3):
        freezer.tick(timedelta(minutes=5))
        await executor.async_check()
    found = executor.data["stuck"]["byd"]
    assert found["reason"] == "reserve" and found["value"] == 100.0
    assert found["entity_id"] == "number.reserve" and found["soc"] == 98
    assert executor.view["stuck"]["byd"]["reason"] == "reserve"
    executor.notifier.async_problem.assert_awaited_once()
    call = executor.notifier.async_problem.await_args
    assert call.args == ("stuck_reserve",)
    assert call.kwargs["tag"] == "stuck_byd" and call.kwargs["battery"] == "BYD"
    assert call.kwargs["value"] == 100.0 and call.kwargs["soc"] == 98
    logged = [e for e in executor.data["log"] if e["kind"] == "stuck"]
    assert logged[-1]["reason"] == "reserve" and logged[-1]["battery"] == "byd"
    # Told once: no second message while it lasts.
    freezer.tick(timedelta(minutes=5))
    await executor.async_check()
    executor.notifier.async_problem.assert_awaited_once()
    # The owner puts the reserve back: over, and the notification goes.
    reserve(hass, 5)
    before = len(executor.data["log"])
    await executor.async_check()
    assert executor.data["stuck"] == {}
    executor.notifier.async_clear.assert_awaited_with("stuck_byd")
    assert "stuck_over" in [e["kind"] for e in executor.data["log"][before:]]


async def test_what_joe_set_himself_and_an_own_floor_are_no_problem(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-19T19:00:00+02:00")
    install_team(hass, byd_soc=30, venus_soc=98)
    reserve(hass, 30)
    flows(hass, grid=1000, byd=0, venus=0)
    # The owner's own floor of 30 %: at it, the battery is simply empty.
    config = team_config(team_byd(cutoff_soc=10.5, floor_soc=30), team_venus())
    executor, _ = await make_executor(hass, config, day_plan(dt_util.now()))
    executor.notifier = notifier()
    for _ in range(4):
        await executor.async_check()
        freezer.tick(timedelta(minutes=5))
    assert executor.data["stuck"] == {}
    executor.notifier.async_problem.assert_not_awaited()
    # A reserve Joe raised himself (noted as written) is his to put back.
    config = team_config(team_byd(cutoff_soc=10.5), team_venus())
    executor, _ = await make_executor(hass, config, day_plan(dt_util.now()))
    executor.notifier = notifier()
    reserve(hass, 100)
    levels(hass, byd=98)
    executor.data["written"]["number.reserve"] = {
        "value": 100.0,
        "at": dt_util.now().isoformat(timespec="seconds"),
        "confirmed": True,
        "battery": "byd",
    }
    for _ in range(4):
        await executor.async_check()
        freezer.tick(timedelta(minutes=5))
    assert executor.data["stuck"] == {}
    executor.notifier.async_problem.assert_not_awaited()


async def test_a_block_someone_else_set_is_told(hass: HomeAssistant, freezer) -> None:
    """The discharge limit at 0 with its switch on, not by Joe."""
    freezer.move_to("2026-10-19T19:00:00+02:00")
    install_team(hass, byd_soc=60, venus_soc=98)
    percent = {"min": 0, "max": 100, "step": 1, "unit_of_measurement": "%"}
    hass.states.async_set("number.discharge_limit", "0", percent)
    hass.states.async_set("switch.discharge_limit", "on")
    flows(hass, grid=1000, byd=0, venus=0)
    config = team_config(team_byd(cutoff_soc=10.5), team_venus())
    executor, _ = await make_executor(hass, config, day_plan(dt_util.now()))
    executor.notifier = notifier()
    for _ in range(4):
        await executor.async_check()
        freezer.tick(timedelta(minutes=5))
    found = executor.data["stuck"]["byd"]
    assert found["reason"] == "discharge"
    assert found["entity_id"] == "switch.discharge_limit" and found["value"] is True
    call = executor.notifier.async_problem.await_args
    assert call.args == ("stuck_discharge",) and call.kwargs["entity"]


async def test_the_phone_hears_it_only_with_its_own_switch(hass: HomeAssistant) -> None:
    config: dict[str, Any] = {
        "notify": {
            "service": "notify.phone",
            "ask": True,
            "problems": True,
            "morning": False,
            "cars": True,
            "stuck": True,
        }
    }
    joe = JoeNotifier(hass, lambda: config, AsyncMock())
    with patch.object(joe, "_push", new=AsyncMock()) as push:
        await joe.async_problem(
            "stuck_reserve",
            tag="stuck_byd",
            battery="BYD",
            entity="Reserve",
            value=100,
            soc=98,
        )
        push.assert_awaited_once()
        assert push.await_args.args[2] == {"tag": "energy_joe_stuck_byd"}
        config["notify"]["stuck"] = False
        await joe.async_problem(
            "stuck_reserve",
            tag="stuck_byd",
            battery="BYD",
            entity="Reserve",
            value=100,
            soc=98,
        )
        push.assert_awaited_once()
        # Other problems go by their own switch.
        await joe.async_problem("release_failed", entities=["number.reserve"])
        assert push.await_count == 2
    # The notification in Home Assistant is there either way, per battery.
    await joe.async_clear("stuck_byd")
