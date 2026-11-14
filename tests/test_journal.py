"""The journal: a week of what Joe steered, each line with its reason."""

from __future__ import annotations

from datetime import timedelta

import pytest

from custom_components.energy_joe.control.adapters import make_adapter
from custom_components.energy_joe.control.executor import JOURNAL_MAX, LOG_SIZE
from custom_components.energy_joe.control.writes import Write
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


async def make(hass: HomeAssistant, freezer):
    freezer.move_to("2026-11-02T20:00:00+01:00")
    install_team(hass, byd_soc=50, venus_soc=50)
    config = team_config(team_byd(cutoff_soc=10.5), team_venus())
    executor, _ = await make_executor(hass, config, day_plan(dt_util.now()))
    return executor, make_adapter(config["batteries"][0])


async def test_the_journal_keeps_a_week_the_log_only_the_latest(
    hass: HomeAssistant, freezer
) -> None:
    executor, _ = await make(hass, freezer)
    executor.data["log"].clear()
    executor.data["journal"].clear()
    freezer.move_to("2026-10-20T08:00:00+02:00")
    executor._log("old")
    freezer.move_to("2026-11-02T20:00:00+01:00")
    for number in range(LOG_SIZE + 20):
        executor._log("line", n=number)
    assert len(executor.data["log"]) == LOG_SIZE
    # More than the log, but not the line from two weeks ago.
    assert len(executor.data["journal"]) == LOG_SIZE + 20
    assert all(e["kind"] != "old" for e in executor.data["journal"])
    assert len(executor.data["journal"]) <= JOURNAL_MAX


async def test_a_week_old_line_leaves_the_journal(hass: HomeAssistant, freezer) -> None:
    executor, _ = await make(hass, freezer)
    executor.data["journal"].clear()
    executor._log("first")
    freezer.tick(timedelta(days=7, minutes=1))
    executor._log("second")
    assert [e["kind"] for e in executor.data["journal"]] == ["second"]


async def test_every_changed_value_is_told_with_its_reason(
    hass: HomeAssistant, freezer
) -> None:
    executor, adapter = await make(hass, freezer)
    executor.data["journal"].clear()
    now = dt_util.now()
    hass.states.async_set(
        "number.discharge_limit", "100", {"min": -100, "max": 100, "step": 0.1}
    )
    await executor._async_write(
        adapter, [Write("number.discharge_limit", -24.6)], now, "charge"
    )
    sets = [e for e in executor.data["journal"] if e["kind"] == "set"]
    assert len(sets) == 1 and sets[0]["value"] == -24.6
    assert sets[0]["action"] == "charge"
    assert sets[0]["why"] in ("Nachtplan: Laden", "Night plan: charging")
    # The same value again a little later: not told twice.
    await executor._async_write(
        adapter,
        [Write("number.discharge_limit", -24.6)],
        now + timedelta(minutes=6),
        "charge",
    )
    assert len([e for e in executor.data["journal"] if e["kind"] == "set"]) == 1
    # A new value: told again (before, only the first one of a night was).
    hass.states.async_set(
        "number.discharge_limit", "-24.6", {"min": -100, "max": 100, "step": 0.1}
    )
    await executor._async_write(
        adapter,
        [Write("number.discharge_limit", -30)],
        now + timedelta(minutes=12),
        "charge",
    )
    sets = [e for e in executor.data["journal"] if e["kind"] == "set"]
    assert [e["value"] for e in sets] == [-24.6, -30]


async def test_a_line_that_repeats_counts_up_instead_of_filling_the_log(
    hass: HomeAssistant, freezer
) -> None:
    executor, _ = await make(hass, freezer)
    executor.data["log"].clear()
    executor.data["journal"].clear()
    for minute in range(30):
        executor._log(
            "team_stuck", battery="byd", batteries=["byd"], soc=98.5 - minute / 100
        )
        freezer.tick(timedelta(minutes=1))
    assert len(executor.data["log"]) == 1 and len(executor.data["journal"]) == 1
    line = executor.data["journal"][0]
    assert line["count"] == 30 and line["until"] > line["at"]
    assert line["soc"] == pytest.approx(98.21)
    # Another battery, or another kind, is another line.
    executor._log("team_stuck", battery="venus", batteries=["venus"], soc=40)
    executor._log("team_full", battery="byd", batteries=["byd"], soc=100)
    assert len(executor.data["journal"]) == 3


async def test_the_same_line_after_a_long_while_is_a_new_one(
    hass: HomeAssistant, freezer
) -> None:
    executor, _ = await make(hass, freezer)
    executor.data["log"].clear()
    executor.data["journal"].clear()
    executor._log("team_stuck", battery="byd", batteries=["byd"], soc=98)
    freezer.tick(timedelta(hours=2))
    executor._log("team_stuck", battery="byd", batteries=["byd"], soc=98)
    assert len(executor.data["journal"]) == 2
    assert "count" not in executor.data["journal"][0]


async def test_what_changed_is_never_collapsed(hass: HomeAssistant, freezer) -> None:
    executor, _ = await make(hass, freezer)
    executor.data["journal"].clear()
    for value in (-24.6, -24.6, -30):
        executor._log("set", battery="byd", entity="number.x", value=value)
    assert [e["value"] for e in executor.data["journal"]] == [-24.6, -24.6, -30]
