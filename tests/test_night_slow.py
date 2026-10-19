"""A battery that charges much slower from the grid than planned: Joe measures
it, tells once a night, plans with what it took, and looks back on the night."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock

import pytest

from custom_components.energy_joe.control.executor import JoeExecutor
from custom_components.energy_joe.plan.inputs import charge_power_kw
from custom_components.energy_joe.plan.planner import Battery, make_plan
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .test_control import configured, fronius_battery, install_devices, make_executor
from .test_night_share import capped_fronius, install_limit, spans_plan
from .test_plan import plan_input


@pytest.fixture(autouse=True)
def berlin_time(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


def slow_plan(
    now: datetime, byd_kw: float = 3.0, target: int = 60, charge_kwh: float = 4.5
) -> dict[str, Any]:
    """The BYD (a Fronius without a power of its own) charges from 03:00 to
    04:30 with the planned power."""
    start = dt_util.start_of_local_day(now)

    def iso(hours: float) -> str:
        return (start + timedelta(hours=hours)).isoformat(timespec="minutes")

    return {
        "kind": "charge",
        "fixed": True,
        "target": target,
        "window": {
            "start": start.isoformat(),
            "end": (start + timedelta(hours=5)).isoformat(),
        },
        "charge_slots": [{"start": iso(3), "end": iso(4.5)}],
        "rules": {"discharge_mode": "until_target"},
        "batteries": [
            {
                "id": "byd",
                "target": target,
                "power_kw": byd_kw,
                "charge_kwh": charge_kwh,
                "slots": [{"start": iso(3), "end": iso(4.5), "power_kw": byd_kw}],
            }
        ],
    }


def power(hass: HomeAssistant, watts: float) -> None:
    hass.states.async_set("sensor.byd_power", str(watts), {"unit_of_measurement": "W"})


async def at(freezer, executor: JoeExecutor, stamp: str) -> None:
    freezer.move_to(stamp)
    await executor.async_check()


def kinds(executor: JoeExecutor) -> list[str]:
    return [entry["kind"] for entry in executor.data["log"]]


def notifier() -> AsyncMock:
    """Joe's notifier, its callbacks (clear_ask) plain mocks."""
    return AsyncMock(clear_ask=MagicMock(), clear_which_car=MagicMock())


def told(executor: JoeExecutor, kind: str) -> list[Any]:
    """The problems of one kind Joe told (no_progress comes after half an hour too)."""
    return [
        call
        for call in executor.notifier.async_problem.await_args_list
        if call.args[0] == kind
    ]


async def test_a_battery_charging_far_too_slowly_is_told_once(
    hass: HomeAssistant, freezer
) -> None:
    """Below 40 % of the planned power for 15 minutes (after 3 to get going):
    noted, a problem in the panel, in the log and told – once a night."""
    freezer.move_to("2026-10-04T03:00:00+02:00")
    install_devices(hass, byd_soc=30)
    config = configured(fronius_battery())
    plan = slow_plan(dt_util.now())
    executor, _ = await make_executor(hass, config, plan)
    executor.notifier = notifier()
    await executor.async_check()
    assert executor.status["batteries"]["byd"]["action"] == "charge"
    assert executor.status["batteries"]["byd"]["power_w"] == 3000
    # The battery takes 0.5 kW while 3 kW are planned.
    power(hass, 500)
    # Getting going: the first three minutes do not count.
    await at(freezer, executor, "2026-10-04T03:02:00+02:00")
    await at(freezer, executor, "2026-10-04T03:04:00+02:00")
    await at(freezer, executor, "2026-10-04T03:18:00+02:00")
    assert "charge_slow" not in kinds(executor)
    assert executor.status["batteries"]["byd"]["problem"] is None
    assert "slow" not in executor.status["batteries"]["byd"]
    executor.notifier.async_problem.assert_not_awaited()

    # Fifteen minutes too slow, counted from 03:04 on.
    await at(freezer, executor, "2026-10-04T03:19:00+02:00")
    assert kinds(executor).count("charge_slow") == 1
    assert executor.status["batteries"]["byd"]["problem"] == "charge_slow"
    assert executor.status["batteries"]["byd"]["slow"] == {
        "planned_w": 3000,
        "measured_w": 500,
        "at": "2026-10-04T03:19:00+02:00",
    }
    found = executor.data["night_slow"]["byd"]
    assert found["nights"] == [
        {"night": plan["window"]["start"], "planned_w": 3000, "measured_w": 500}
    ]
    executor.notifier.async_problem.assert_awaited_once()
    (call,) = told(executor, "charge_slow_fronius")
    assert call.kwargs == {"battery": "BYD", "measured": "0.5", "planned": "3"}
    assert executor.slow_powers() == {"byd": 500}

    # Told once a night: later checks add nothing, the problem stays shown.
    await at(freezer, executor, "2026-10-04T03:30:00+02:00")
    await at(freezer, executor, "2026-10-04T03:45:00+02:00")
    assert kinds(executor).count("charge_slow") == 1
    assert len(told(executor, "charge_slow_fronius")) == 1
    assert executor.status["batteries"]["byd"]["problem"] == "charge_slow"
    assert executor.view["night_slow"]["byd"] == executor.data["night_slow"]["byd"]

    # The night's look back knows it was slow.
    await at(freezer, executor, "2026-10-04T04:58:00+02:00")
    assert executor.status["reason"] == "done"
    review = executor.data["night_review"]
    assert review["night"] == plan["window"]["start"]
    assert review["batteries"]["byd"]["slow"] is True
    assert review["batteries"]["byd"]["charged_kwh"] > 0


async def test_other_batteries_get_the_plain_hint(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-10-04T03:00:00+02:00")
    install_devices(hass, byd_soc=30)
    config = configured({**fronius_battery(), "adapter": "generic"})
    executor, _ = await make_executor(hass, config, slow_plan(dt_util.now()))
    executor.notifier = notifier()
    await executor.async_check()
    power(hass, 900)
    for minutes in (4, 10, 19):
        await at(freezer, executor, f"2026-10-04T03:{minutes:02d}:00+02:00")
    (call,) = told(executor, "charge_slow")
    assert call.kwargs["measured"] == "0.9"


async def test_under_joes_own_ceiling_nothing_is_measured(
    hass: HomeAssistant, freezer
) -> None:
    """A Fronius under its charge limit as the night's ceiling: that is Joe's
    own cap, not the inverter holding back."""
    freezer.move_to("2026-10-04T01:00:00+02:00")
    install_limit(hass)
    config = configured(capped_fronius())
    plan = spans_plan(dt_util.now())
    plan["batteries"] = plan["batteries"][:1]
    executor, _ = await make_executor(hass, config, plan)
    executor.notifier = notifier()
    await executor.async_check()
    assert executor.status["batteries"]["byd"]["cap"]["w"] == 1000
    power(hass, 300)
    for minutes in (4, 10, 20, 25):
        await at(freezer, executor, f"2026-10-04T01:{minutes:02d}:00+02:00")
    assert "charge_slow" not in kinds(executor)
    assert executor.data["night_slow"] == {}
    assert executor.status["batteries"]["byd"]["problem"] is None
    executor.notifier.async_problem.assert_not_awaited()


async def test_while_the_grid_limit_pauses_charging_nothing_is_measured(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-04T03:00:00+02:00")
    install_devices(hass, byd_soc=30)
    config = configured(fronius_battery())
    config["rules"]["guard_grid"] = True
    config["rules"]["grid_limit_w"] = 4000
    config["measurements"]["grid_power"] = {
        "entity_id": "sensor.grid",
        "invert": False,
        "minus_entity_id": None,
    }
    hass.states.async_set("sensor.grid", "6000", {"unit_of_measurement": "W"})
    executor, _ = await make_executor(hass, config, slow_plan(dt_util.now()))
    executor.notifier = notifier()
    power(hass, 200)
    for minutes in (0, 4, 10, 20, 25):
        await at(freezer, executor, f"2026-10-04T03:{minutes:02d}:00+02:00")
    assert executor.status["batteries"]["byd"]["action"] == "hold"
    assert "charge_slow" not in kinds(executor)
    assert executor.data["night_slow"] == {}
    executor.notifier.async_problem.assert_not_awaited()


async def test_near_its_target_slow_charging_is_normal(
    hass: HomeAssistant, freezer
) -> None:
    """A battery tapers off near its target: nothing to measure there."""
    freezer.move_to("2026-10-04T03:00:00+02:00")
    install_devices(hass, byd_soc=57)
    config = configured(fronius_battery())
    executor, _ = await make_executor(hass, config, slow_plan(dt_util.now()))
    executor.notifier = notifier()
    power(hass, 300)
    for minutes in (0, 4, 10, 20, 25):
        await at(freezer, executor, f"2026-10-04T03:{minutes:02d}:00+02:00")
    assert executor.status["batteries"]["byd"]["action"] == "charge"
    assert "charge_slow" not in kinds(executor)
    assert executor.data["night_slow"] == {}
    executor.notifier.async_problem.assert_not_awaited()


async def test_without_a_power_sensor_nothing_is_measured(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-04T03:00:00+02:00")
    install_devices(hass, byd_soc=30)
    config = configured({**fronius_battery(), "power": None})
    executor, _ = await make_executor(hass, config, slow_plan(dt_util.now()))
    executor.notifier = notifier()
    for minutes in (0, 4, 10, 20, 25):
        await at(freezer, executor, f"2026-10-04T03:{minutes:02d}:00+02:00")
    assert executor.status["batteries"]["byd"]["action"] == "charge"
    assert executor.data["night_slow"] == {}
    assert executor.data["night_energy"] == {}
    await at(freezer, executor, "2026-10-04T04:58:00+02:00")
    assert executor.data["night_review"]["batteries"]["byd"]["charged_kwh"] is None
    assert "night_charged" not in kinds(executor)


async def test_charging_fast_again_is_forgotten(hass: HomeAssistant, freezer) -> None:
    """Planned with the 0.5 kW Joe measured, the battery takes 2 kW for three
    minutes: the plan goes by its full power again."""
    freezer.move_to("2026-10-04T03:00:00+02:00")
    install_devices(hass, byd_soc=30)
    config = configured(fronius_battery())
    executor, _ = await make_executor(hass, config, slow_plan(dt_util.now(), 0.5))
    executor.data["night_slow"]["byd"] = {
        "planned_w": 3000,
        "measured_w": 500,
        "at": "2026-10-03T03:19:00+02:00",
        "nights": [
            {"night": "2026-10-03T00:00:00+02:00", "planned_w": 3000, "measured_w": 500}
        ],
    }
    await executor.async_check()
    assert executor.status["batteries"]["byd"]["slow"]["measured_w"] == 500
    power(hass, 2000)
    await at(freezer, executor, "2026-10-04T03:04:00+02:00")
    await at(freezer, executor, "2026-10-04T03:06:00+02:00")
    assert "byd" in executor.data["night_slow"]
    await at(freezer, executor, "2026-10-04T03:07:00+02:00")
    assert executor.data["night_slow"] == {}
    assert executor.slow_powers() == {}
    assert "charge_slow_end" in kinds(executor)
    assert "slow" not in executor.status["batteries"]["byd"]


async def test_the_most_of_the_last_findings_counts(hass: HomeAssistant) -> None:
    install_devices(hass)
    executor, _ = await make_executor(hass, configured(fronius_battery()), None)
    executor.data["night_slow"]["byd"] = {
        "planned_w": 3000,
        "measured_w": 400,
        "at": "2026-10-04T03:19:00+02:00",
        "nights": [
            {
                "night": "2026-10-02T00:00:00+02:00",
                "planned_w": 3000,
                "measured_w": 700,
            },
            {
                "night": "2026-10-03T00:00:00+02:00",
                "planned_w": 3000,
                "measured_w": 450,
            },
            {
                "night": "2026-10-04T00:00:00+02:00",
                "planned_w": 3000,
                "measured_w": 400,
            },
        ],
    }
    assert executor.slow_powers() == {"byd": 700}


def test_the_plan_goes_by_what_was_measured() -> None:
    # Levers the owner assigned: the battery's highest power, else Joe's default.
    battery = {**fronius_battery(), "adapter": "generic"}
    assert charge_power_kw(battery, 2.0, None) == (5.0, None)
    assert charge_power_kw(battery, 2.0, {"byd": 500}) == (0.5, 0.5)
    # Measured at least what it could: nothing to hold back.
    assert charge_power_kw(battery, 2.0, {"byd": 6000}) == (5.0, None)
    # Without a power of its own: Joe's default.
    assert charge_power_kw({**battery, "max_charge_w": None}, 2.0, None) == (2.0, None)
    assert charge_power_kw({**battery, "max_charge_w": None}, 2.0, {"byd": 500}) == (
        0.5,
        0.5,
    )
    # A Fronius raising its reserve charges with ~500 W whatever its size:
    # planned so from the start, less only when measured so.
    assert charge_power_kw(fronius_battery(), 2.0, None) == (0.5, None)
    assert charge_power_kw(fronius_battery(), 2.0, {"byd": 300}) == (0.3, 0.3)
    assert charge_power_kw(fronius_battery(), 2.0, {"byd": 800}) == (0.5, None)

    slow = Battery("b1", "Battery", 10.0, 20, 0.5, 3.0, paced=False, slow_kw=0.5)
    plan = make_plan(plan_input(solar=3, soc=20, batteries=[slow]))
    assert plan["kind"] == "charge"
    (entry,) = plan["batteries"]
    assert entry["slow_kw"] == 0.5
    assert entry["max_kw"] == 0.5
    assert entry["slots"] and all(s["power_kw"] <= 0.5 for s in entry["slots"])
    # Not measured: the plan says nothing of it.
    plain = make_plan(plan_input(solar=3, soc=20))
    assert plain["batteries"][0]["slow_kw"] is None


async def test_the_night_is_looked_back_on(hass: HomeAssistant, freezer) -> None:
    """What the battery took, summed up check by check, against the plan –
    once per night, for the panel and the log."""
    freezer.move_to("2026-10-04T03:00:00+02:00")
    install_devices(hass, byd_soc=30)
    config = configured(fronius_battery())
    plan = slow_plan(dt_util.now(), charge_kwh=4.5)
    executor, _ = await make_executor(hass, config, plan)
    executor.notifier = notifier()
    await executor.async_check()
    power(hass, 1500)
    # 1.5 kW in checks five minutes apart: 0.125 kWh each, 17 of them.
    for minutes in range(5, 90, 5):
        stamp = dt_util.start_of_local_day(dt_util.now()) + timedelta(
            hours=3, minutes=minutes
        )
        await at(freezer, executor, stamp.isoformat())
    assert executor.data["night_energy"]["byd"]["kwh"] == pytest.approx(2.125)
    # The target is reached at 04:30: nothing more is counted.
    hass.states.async_set("sensor.byd_soc", "60", {"unit_of_measurement": "%"})
    await at(freezer, executor, "2026-10-04T04:30:00+02:00")
    await at(freezer, executor, "2026-10-04T04:40:00+02:00")
    assert executor.data["night_energy"]["byd"]["at"] is None
    assert executor.data["night_review"] is None

    await at(freezer, executor, "2026-10-04T04:58:00+02:00")
    assert executor.status["reason"] == "done"
    review = executor.data["night_review"]
    assert review["night"] == plan["window"]["start"]
    assert review["at"] == "2026-10-04T04:58:00+02:00"
    assert review["batteries"] == {
        "byd": {
            "planned_kwh": 4.5,
            "charged_kwh": 2.12,
            "planned_w": 3000,
            "soc_start": 30,
            "soc_end": 60,
            "slow": False,
        }
    }
    assert executor.view["night_review"] == review
    charged = [e for e in executor.data["log"] if e["kind"] == "night_charged"]
    assert charged == [
        {
            "at": "2026-10-04T04:58:00+02:00",
            "kind": "night_charged",
            "battery": "byd",
            "charged": 2.12,
            "planned": 4.5,
        }
    ]
    # Once per night.
    await at(freezer, executor, "2026-10-04T04:59:00+02:00")
    assert kinds(executor).count("night_charged") == 1
    assert executor.data["night_review"]["at"] == "2026-10-04T04:58:00+02:00"


async def test_a_gap_between_checks_counts_as_five_minutes(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-04T03:00:00+02:00")
    install_devices(hass, byd_soc=30)
    executor, _ = await make_executor(
        hass, configured(fronius_battery()), slow_plan(dt_util.now())
    )
    power(hass, 3000)
    await executor.async_check()
    # Joe was down for half an hour: five minutes of it count.
    await at(freezer, executor, "2026-10-04T03:30:00+02:00")
    assert executor.data["night_energy"]["byd"]["kwh"] == pytest.approx(0.25)
