"""Several batteries by day with sense (control/team_day.py): charging along
from the forecast and from the meter, blocked again on a cloud, learning over
the days and asking, helping on a big load with hysteresis, the base load and
never a battery charging from another."""

from __future__ import annotations

from datetime import timedelta
from typing import Any

import pytest

from custom_components.energy_joe import model
from custom_components.energy_joe.control import team, team_day
from custom_components.energy_joe.plan import surplus
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .test_control import make_executor
from .test_surplus import at, day_plan, hours, install_evcc
from .test_team import (
    byd_levers,
    flows,
    install_team,
    levels,
    never_opposite,
    team_byd,
    team_venus,
    venus_levers,
)


@pytest.fixture(autouse=True)
def berlin(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


def group(key: str, soc: float, capacity: float, max_kw: float) -> team.Group:
    member = team.Member(
        id=key, soc=soc, cutoff=None, floor=5.0, capacity=capacity, max_kw=max_kw
    )
    return team.Group(key, [member])


def config(*batteries: dict[str, Any], **rules: Any) -> dict[str, Any]:
    return model.validate(
        {
            "version": model.CONFIG_VERSION,
            "batteries": list(batteries) or [team_byd(), team_venus()],
            "measurements": {"grid_power": {"entity_id": "sensor.grid"}},
            "rules": {"battery_team": "sequence", "grid_friendly": False, **rules},
        }
    )


def kinds(executor: Any) -> list[str]:
    return [e["kind"] for e in executor.data["log"]]


# --- the decisions -----------------------------------------------------------------


def test_the_forecast_says_when_the_sun_is_more_than_the_venus_takes() -> None:
    day = "2026-06-20"
    now = at(day, 9)
    found = surplus.slots(hours(day, 5.0), None, now, 1.0)
    end = surplus.pv_end(found, now)
    venus = group("venus", 10, 5.12, 2.5)
    byd = group("byd", 20, 10.0, 5.0)
    # The Venus goes first: from 11:00 the surplus (2.9 kW) is more than its
    # 2.5 kW while the BYD still has room.
    window = team_day.overflow(found, [venus, byd], "venus", end)
    assert window is not None
    assert window[0] == at(day, 11)
    # The learned lead starts it earlier.
    assert team_day.lead_start(window, 45) == at(day, 10, 15)
    # The BYD goes first: it takes all the sun alone, nobody charges along.
    assert team_day.overflow(found, [byd, venus], "byd", end) is None
    # Nothing left to fill: no reason either.
    full = group("byd", 100, 10.0, 5.0)
    assert team_day.overflow(found, [venus, full], "venus", end) is None
    # A weak day: never more than the Venus takes.
    weak = surplus.slots(hours(day, 2.8), None, now, 1.0)
    assert (
        team_day.overflow(weak, [venus, byd], "venus", surplus.pv_end(weak, now))
        is None
    )


def test_charging_along_by_the_meter_has_a_hysteresis() -> None:
    now = at("2026-06-20", 12)
    store: dict[str, Any] = {}
    # Export for less than a minute: not yet.
    assert not team_day.along_step(store, True, 800, 3.3, 2.5, now)
    assert not team_day.along_step(
        store, True, 800, 3.3, 2.5, now + timedelta(seconds=30)
    )
    assert team_day.along_step(store, True, 800, 3.3, 2.5, now + timedelta(seconds=60))
    # Both charge, nothing goes to the grid any more: it stays while the sun
    # is more than the Venus alone takes.
    later = now + timedelta(minutes=5)
    assert team_day.along_step(store, True, 0, 3.0, 2.5, later)
    # Less sun for a while (below 80 % of 2.5 kW): alone again after 10 min.
    assert team_day.along_step(store, True, 0, 1.5, 2.5, later + timedelta(minutes=1))
    assert team_day.along_step(store, True, 0, 1.5, 2.5, later + timedelta(minutes=9))
    assert not team_day.along_step(
        store, True, 0, 1.5, 2.5, later + timedelta(minutes=11)
    )
    # It may not (the daytime cap, a cloud): over at once.
    assert not team_day.along_step(store, True, 800, 3.3, 2.5, later)
    assert team_day.along_step(
        store, True, 800, 3.3, 2.5, later + timedelta(minutes=12)
    )
    assert not team_day.along_step(
        store, False, 800, 3.3, 2.5, later + timedelta(minutes=13)
    )
    assert store == {}


def test_helping_starts_near_the_limit_and_ends_with_hysteresis() -> None:
    now = at("2026-10-10", 19)
    store: dict[str, Any] = {}
    # Import while the BYD gives only half of its 3 kW: its own control
    # still has room, no help.
    assert not team_day.help_step(store, True, 600, 1500, 2.1, 3.0, now)
    assert not team_day.help_step(
        store, True, 600, 1500, 2.1, 3.0, now + timedelta(minutes=2)
    )
    # Near its limit: after a minute the next one helps.
    assert not team_day.help_step(store, True, 600, 2900, 3.5, 3.0, now)
    assert team_day.help_step(
        store, True, 600, 2900, 3.5, 3.0, now + timedelta(seconds=60)
    )
    # The need drops to 2.6 kW (above 80 % of 3 kW): it keeps helping.
    later = now + timedelta(minutes=3)
    assert team_day.help_step(store, True, 0, 2000, 2.6, 3.0, later)
    # Below 2.4 kW for two minutes: alone again.
    assert team_day.help_step(store, True, 0, 1500, 1.8, 3.0, later)
    assert team_day.help_step(
        store, True, 0, 1500, 1.8, 3.0, later + timedelta(minutes=1)
    )
    assert not team_day.help_step(
        store, True, 0, 1500, 1.8, 3.0, later + timedelta(minutes=2)
    )


def test_the_base_load_is_the_lower_part_never_the_mean() -> None:
    # Mostly 300–400 W, a kettle at 2 kW now and then.
    samples = [320.0, 380.0, 350.0, 2000.0, 410.0, 2100.0, 330.0, 360.0] * 3
    assert team_day.base_w(samples, 2500) == 300
    assert sum(samples) / len(samples) > 700
    # Never above what the group can give, in steps of 50 W.
    assert team_day.base_w([900.0] * 20, 640) == 600
    # Too little to be worth it, or too few samples: none.
    assert team_day.base_w([80.0] * 20, 2500) == 0
    assert team_day.base_w([500.0] * 5, 2500) == 0
    # The sun covers the house part of the time: the lower part is nothing.
    assert team_day.base_w([0.0] * 5 + [600.0] * 15, 2500) == 0


def test_the_most_a_battery_does_is_learned_without_spikes() -> None:
    assert team_day.peak(None, -2400, None) is None
    assert team_day.peak(None, -2400, -2600) == 2400
    # A spike for one check does not count.
    assert team_day.peak(2400, -4000, -1000) == 2400
    assert team_day.peak(2400, 1200, -2600) == 2400
    assert team_day.capability(None, 2400, 5.0) == 2.4
    assert team_day.capability(3000, 2400, 5.0) == 3.0
    assert team_day.capability(None, None, 2.56) == 2.56


def day_with(room: float, tight: str | None, along: str | None, **extra: Any):
    day = team_day.fresh_day("2026-06-20")
    day.update(
        room_kwh=room,
        export_kwh=room + 1,
        tight_at=tight,
        room_until=extra.pop("until", tight),
        along_at=along,
        **extra,
    )
    return day


def test_learning_over_the_days_is_robust_and_never_forgets_in_winter() -> None:
    venus = {"batteries": ["venus"], "socs": {"venus": 70.0}}
    byd = {"batteries": ["byd"], "socs": {"byd": 100.0}}
    # 3 kWh went to the grid while the Venus waited at 70 %: tight at 10:30,
    # charging along only from 11:30.
    day = day_with(
        3.0,
        "2026-06-20T10:30:00+02:00",
        "2026-06-20T11:30:00+02:00",
        until="2026-06-20T12:00:00+02:00",
    )
    summary = team_day.review(day, [byd, venus])
    assert summary["short"] == {"batteries": ["venus"], "soc": 70.0}
    assert summary["need_min"] == 60
    lead = team_day.learn(None, summary)
    assert lead["minutes"] == 60 and lead["days"] == 1
    assert team_day.suggestion(summary, lead) == {
        "day": "2026-06-20",
        "kwh": 3.0,
        "batteries": ["venus"],
        "soc": 70.0,
        "lead_min": 60,
    }
    # One odd day does not throw it: a good day (charging along, nothing to
    # the grid) pulls it down a little.
    good = team_day.review(day_with(0.0, None, "2026-06-21T11:00:00+02:00"), [byd, byd])
    assert good["need_min"] == 0
    after = team_day.learn(lead, good)
    assert 0 < after["minutes"] < 60
    # Winter: nothing to spare, nothing to learn – the lead stays.
    winter = team_day.review(team_day.fresh_day("2026-12-20"), [byd, venus])
    assert winter["need_min"] is None
    assert team_day.learn(after, winter) == after
    # Many days later every day counts only a little.
    many = {"minutes": 40.0, "days": 200}
    assert team_day.learn(many, summary)["minutes"] == 42.0
    # Too little to ask about.
    small = team_day.review(
        day_with(0.5, "2026-06-20T10:30:00+02:00", None), [byd, venus]
    )
    assert team_day.suggestion(small, lead) is None
    assert team_day.suggestion(summary, {"minutes": 5.0, "days": 3}) is None


# --- the executor ------------------------------------------------------------------


async def test_the_venus_first_and_the_byd_charges_along_from_the_forecast(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-06-20T10:30:00+02:00")
    install_team(hass, byd_soc=20, venus_soc=10)
    flows(hass, grid=0, venus=2100)
    cfg = config(team_charge_order=["venus", "byd"])
    executor, _ = await make_executor(hass, cfg, day_plan(dt_util.now()))
    await executor.async_check()
    view = executor.view["team"]
    assert view["active"] == "venus"
    assert view["parallel"] is False
    assert view["along"] is None
    assert view["along_plan"]["from"].startswith("2026-06-20T11:00")
    assert view["batteries"]["byd"]["why"] == "waits_full"
    assert byd_levers(hass) == ("0.0", "on", "0.0", "on")
    # 11:00: the sun is more than the Venus takes – the BYD charges along,
    # nobody may discharge.
    freezer.move_to("2026-06-20T11:05:00+02:00")
    flows(hass, grid=0, venus=2500, byd=400)
    await executor.async_check()
    view = executor.view["team"]
    assert view["along"] == "forecast"
    assert view["batteries"]["byd"]["why"] == "along"
    never_opposite(view)
    assert byd_levers(hass) == ("100.0", "off", "0.0", "on")
    assert venus_levers(hass) == ("2500.0", "0.0", "on")
    assert "team_along" in kinds(executor)
    # A cloud: the BYD is blocked again at once, the Venus is free.
    flows(hass, grid=600, venus=0, byd=0)
    await executor.async_check()
    view = executor.view["team"]
    never_opposite(view)
    assert byd_levers(hass) == ("0.0", "on", "0.0", "on")
    assert venus_levers(hass) == ("2500.0", "2500.0", "off")
    # The sun is back: charging along again without waiting.
    flows(hass, grid=0, venus=2500, byd=500)
    freezer.tick(timedelta(minutes=1))
    await executor.async_check()
    assert executor.view["team"]["batteries"]["byd"]["why"] == "along"
    never_opposite(executor.view["team"])


async def test_the_meter_lets_the_next_one_charge_along_and_strict_does_not(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-06-20T09:00:00+02:00")
    install_team(hass, byd_soc=20, venus_soc=10)
    # More sun than the forecast says: the Venus takes 2.5 kW, 900 W go to
    # the grid while the BYD waits with room.
    flows(hass, grid=-900, venus=2500)
    cfg = config(team_charge_order=["venus", "byd"])
    executor, holder = await make_executor(hass, cfg, day_plan(dt_util.now()))
    await executor.async_check()
    assert executor.view["team"]["along"] is None
    freezer.tick(timedelta(minutes=1))
    await executor.async_check()
    view = executor.view["team"]
    assert view["along"] == "export"
    assert view["batteries"]["byd"]["why"] == "along"
    never_opposite(view)
    # The day so far counts the minute that went to the grid with room.
    today = executor.data["team"]["today"]
    assert today["room_kwh"] == pytest.approx(0.9 / 60, abs=0.001)
    assert today["along_at"] is not None
    # The highest level of the day counts in the evening.
    assert today["top"] == {"byd": 20.0, "venus": 10.0}
    # "Nur nacheinander": the BYD waits, whatever goes to the grid.
    holder["config"] = config(team_charge_order=["venus", "byd"], team_style="strict")
    for _ in range(3):
        freezer.tick(timedelta(minutes=1))
        await executor.async_check()
    view = executor.view["team"]
    assert view["style"] == "strict"
    assert view["along"] is None and view["along_plan"] is None
    assert view["batteries"]["byd"]["why"] == "waits_full"
    assert byd_levers(hass) == ("0.0", "on", "0.0", "on")


async def test_the_evening_look_back_learns_and_asks(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-06-20T12:00:00+02:00")
    install_team(hass, byd_soc=100, venus_soc=70)
    flows(hass, grid=-3000, byd=0)
    cfg = config(team_charge_order=["byd", "venus"])
    executor, holder = await make_executor(hass, cfg, day_plan(dt_util.now()))
    await executor.async_check()
    # The day as it went: 3 kWh to the grid while the Venus waited.
    executor.data["team"]["today"] = day_with(
        3.0,
        "2026-06-20T10:30:00+02:00",
        "2026-06-20T11:30:00+02:00",
        until="2026-06-20T12:00:00+02:00",
    )
    freezer.move_to("2026-06-20T22:10:00+02:00")
    flows(hass, grid=300, byd=-300)
    await executor.async_check()
    view = executor.view["team"]
    assert executor.data["team"]["reviewed"] == "2026-06-20"
    assert view["review"]["short"] == {"batteries": ["venus"], "soc": 70.0}
    assert view["learned"]["minutes"] == 60
    assert view["suggest"]["kwh"] == 3.0
    assert "team_review" in kinds(executor)
    # Once a day only.
    await executor.async_check()
    assert len(executor.data["team"]["reviews"]) == 1
    # The next morning it still asks; "Nein": it does not ask again.
    freezer.move_to("2026-06-21T08:00:00+02:00")
    holder["plan"] = day_plan(dt_util.now())
    await executor.async_check()
    assert executor.view["team"]["suggest"] is not None
    holder["config"] = config(team_charge_order=["byd", "venus"], team_early=False)
    await executor.async_check()
    assert executor.view["team"]["suggest"] is None
    # "Ja": the learned lead moves charging along earlier.
    holder["config"] = config(team_charge_order=["venus", "byd"], team_early=True)
    levels(hass, byd=20, venus=10)
    flows(hass, grid=0, byd=800, venus=800)
    for _ in range(7):
        freezer.tick(timedelta(minutes=3))
        await executor.async_check()
    assert executor.view["team"]["active"] == "venus"
    plan = executor.view["team"]["along_plan"]
    assert plan["lead_min"] == 60
    assert plan["from"].startswith("2026-06-21T10:00")
    freezer.move_to("2026-06-21T10:05:00+02:00")
    await executor.async_check()
    assert executor.view["team"]["along"] == "forecast"


async def test_a_big_load_lets_the_venus_help_and_then_wait_again(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-10T19:00:00+02:00")
    install_team(hass, byd_soc=60, venus_soc=60)
    flows(hass, grid=0, byd=-800)
    cfg = config(team_byd(max_discharge_w=3000), team_venus())
    executor, _ = await make_executor(hass, cfg, day_plan(dt_util.now()))
    await executor.async_check()
    assert executor.view["team"]["active"] == "byd"
    # The oven: the BYD gives 2.9 of its 3 kW, the house draws 1.2 kW from
    # the grid. Not at once …
    flows(hass, grid=1200, byd=-2900)
    freezer.tick(timedelta(seconds=30))
    await executor.async_check()
    assert executor.view["team"]["help"] is False
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    # … but once it lasted a minute: the Venus may discharge, nobody charges.
    freezer.tick(timedelta(seconds=60))
    await executor.async_check()
    view = executor.view["team"]
    assert view["help"] is True
    assert view["batteries"]["venus"]["why"] == "helps"
    never_opposite(view)
    assert venus_levers(hass) == ("0.0", "2500.0", "on")
    assert byd_levers(hass) == ("0.0", "on", "100.0", "off")
    assert "team_help" in kinds(executor)
    # Both share it, nothing from the grid: still a big load, it keeps helping.
    flows(hass, grid=0, byd=-2500, venus=-1600)
    freezer.tick(timedelta(minutes=3))
    await executor.async_check()
    assert executor.view["team"]["help"] is True
    # The oven is off (1.5 kW): two minutes later the Venus waits again.
    flows(hass, grid=0, byd=-1000, venus=-500)
    freezer.tick(timedelta(minutes=1))
    await executor.async_check()
    assert executor.view["team"]["help"] is True
    freezer.tick(timedelta(minutes=2))
    await executor.async_check()
    view = executor.view["team"]
    assert view["help"] is False
    never_opposite(view)
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    assert byd_levers(hass) == ("100.0", "off", "100.0", "off")
    assert "team_help_end" in kinds(executor)


async def test_the_base_load_from_the_venus(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-10-10T19:00:00+02:00")
    install_team(hass, byd_soc=60, venus_soc=60)
    cfg = config(team_style="base")
    executor, holder = await make_executor(hass, cfg, day_plan(dt_util.now()))
    # Every few seconds: the house needs about 400 W, the kettle now and then.
    for need in [420, 400, 2400, 450, 410, 430, 2300, 440, 400, 460, 420, 410] * 2:
        flows(hass, grid=0, byd=-need)
        freezer.tick(timedelta(seconds=5))
        await executor.async_guard()
    flows(hass, grid=0, byd=-500)
    await executor.async_check()
    view = executor.view["team"]
    assert view["active"] == "byd"
    assert view["base"] == {"w": 400.0, "batteries": ["venus"]}
    assert view["batteries"]["venus"]["why"] == "base"
    never_opposite(view)
    # The Venus discharges at most the base load, charges never; the BYD
    # covers the rest and may not charge either.
    assert venus_levers(hass) == ("0.0", "400.0", "on")
    assert byd_levers(hass)[:2] == ("0.0", "on")
    assert byd_levers(hass)[2:] == ("100.0", "off")
    assert executor.data["team"]["blocks"]["venus"]["base_w"] == 400.0
    assert "team_base" in kinds(executor)
    # The sun: no base load, the Venus is blocked again at once.
    flows(hass, grid=-500, byd=300)
    await executor.async_check()
    assert executor.view["team"]["base"] is None
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    never_opposite(executor.view["team"])
    # A group whose power Joe cannot set (the Fronius' limit is in %): no base.
    holder["config"] = config(team_style="base", team_discharge_order=["venus", "byd"])
    flows(hass, grid=0, venus=-500)
    for _ in range(5):
        freezer.tick(timedelta(minutes=3))
        await executor.async_check()
    view = executor.view["team"]
    assert view["active"] == "venus"
    assert view["base"] is None
    assert view["base_problem"] == "no_power_lever"


async def test_the_daytime_cap_goes_first_and_nobody_charges_along(
    hass: HomeAssistant, freezer
) -> None:
    """The cap leaves the sun to evcc on purpose: no charging along, and the
    export it causes is not counted as sun lost while a battery had room."""
    freezer.move_to("2026-06-20T09:00:00+02:00")
    install_team(hass, byd_soc=40, venus_soc=40)
    install_evcc(hass)
    flows(hass, grid=-2000, byd=500)
    cfg = config(team_byd(limit_ref_w=5000), team_venus(), day_surplus=True)
    executor, _ = await make_executor(hass, cfg, day_plan(dt_util.now()))
    for _ in range(3):
        await executor.async_check()
        freezer.tick(timedelta(minutes=1))
    assert executor.view["surplus"]["state"] == "cap"
    view = executor.view["team"]
    assert view["along"] is None
    assert view["batteries"]["venus"]["why"] == "waits_full"
    assert executor.view["surplus"]["batteries"]["venus"]["state"] == "team_wait"
    assert executor.data["team"]["today"]["room_kwh"] == 0
    assert executor.data["team"]["today"]["export_kwh"] > 0
    never_opposite(view)
