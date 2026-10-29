"""Planning again: every five minutes and soon after a change. In the fixed
night the window stays, the night actions are worked out anew and a
battery's target only ever goes up."""

from __future__ import annotations

import asyncio
from datetime import datetime, timedelta
from typing import Any

import pytest
from pytest_homeassistant_custom_component.common import async_fire_time_changed

from custom_components.energy_joe import model
from custom_components.energy_joe.observe.store import HistoryStore
from custom_components.energy_joe.plan.car_calendar import CarCalendarStore
from custom_components.energy_joe.plan.planner import make_plan
from custom_components.energy_joe.plan.scheduler import (
    RAISE_MIN,
    SETTLE_S,
    JoePlanner,
    watched_entities,
)
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from tests.test_control import (
    configured,
    fronius_battery,
    install_devices,
    make_executor,
    night_plan,
)
from tests.test_ev import config_of, need
from tests.test_plan import berlin, day_hours, plan_input


@pytest.fixture(autouse=True)
def berlin_time(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


def at(text: str) -> datetime:
    return datetime.fromisoformat(text)


async def counting_planner(
    hass: HomeAssistant, config: dict[str, Any] | None = None
) -> tuple[JoePlanner, HistoryStore, list[dict[str, Any] | None]]:
    """A running planner whose plans are only counted (the fixed plan each
    run got, None before the window)."""
    store = HistoryStore(hass)
    await store.async_load()
    planner = JoePlanner(hass, store, lambda: None)
    runs: list[dict[str, Any] | None] = []

    async def compute(now: datetime, fixed: dict[str, Any] | None = None) -> Any:
        runs.append(fixed)
        return {"kind": "none", "created": now.isoformat(), "run": len(runs)}

    planner._async_compute = compute  # type: ignore[method-assign]
    await planner.async_start(config or model.default_config())
    return planner, store, runs


async def test_before_the_window_joe_plans_anew_every_five_minutes(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-04T18:02:00+02:00")
    planner, store, runs = await counting_planner(hass)
    assert len(runs) == 1
    for minute in ("05", "10", "15"):
        freezer.move_to(f"2026-10-04T18:{minute}:00+02:00")
        async_fire_time_changed(hass, dt_util.utcnow())
        await hass.async_block_till_done()
    # Every run the whole plan, not a fixed one worked out again.
    assert runs == [None, None, None, None]
    assert planner.plan["run"] == 4
    # In between nothing.
    freezer.move_to("2026-10-04T18:17:00+02:00")
    async_fire_time_changed(hass, dt_util.utcnow())
    await hass.async_block_till_done()
    assert len(runs) == 4
    await planner.async_stop()
    await store.async_unload()


async def test_changes_close_together_make_one_run(
    hass: HomeAssistant, freezer
) -> None:
    """A new forecast, a calendar and a car within half a minute: one run."""
    freezer.move_to("2026-10-04T18:01:00+02:00")
    config = model.apply_update(
        model.default_config(),
        {"forecast": {"tomorrow": ["sensor.fc_tomorrow"]}},
        "user",
    )
    hass.states.async_set("sensor.fc_tomorrow", "12.0")
    planner, store, runs = await counting_planner(hass, config)
    planner.calendars = CarCalendarStore(hass)
    await planner.calendars.async_load()
    planner._watch_inputs()
    assert watched_entities(config) == ["sensor.fc_tomorrow"]
    assert len(runs) == 1

    hass.states.async_set("sensor.fc_tomorrow", "9.5")
    planner.calendars.add(
        "kona",
        {
            "start": "2026-10-05T09:00:00+02:00",
            "end": "2026-10-05T10:00:00+02:00",
            "location": "Messe Hannover",
        },
    )
    planner.request()
    # Only new attributes of a forecast: no reason.
    hass.states.async_set("sensor.fc_tomorrow", "9.5", {"updated": "now"})
    await hass.async_block_till_done()
    assert len(runs) == 1
    freezer.tick(timedelta(seconds=SETTLE_S + 1))
    async_fire_time_changed(hass, dt_util.utcnow())
    await hass.async_block_till_done()
    assert len(runs) == 2
    # Nothing new since: no further run.
    freezer.tick(timedelta(seconds=SETTLE_S + 1))
    async_fire_time_changed(hass, dt_util.utcnow())
    await hass.async_block_till_done()
    assert len(runs) == 2
    await planner.async_stop()
    await store.async_unload()


async def test_never_two_runs_at_once(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-10-04T18:01:00+02:00")
    store = HistoryStore(hass)
    await store.async_load()
    planner = JoePlanner(hass, store, lambda: None)
    planner._config = model.default_config()
    release = asyncio.Event()
    running = 0
    most = 0

    async def compute(now: datetime, fixed: dict[str, Any] | None = None) -> Any:
        nonlocal running, most
        running += 1
        most = max(most, running)
        await release.wait()
        running -= 1
        return {"kind": "none", "created": now.isoformat()}

    planner._async_compute = compute  # type: ignore[method-assign]
    first = hass.async_create_task(planner.async_refresh())
    second = hass.async_create_task(planner.async_refresh())
    await asyncio.sleep(0)
    await asyncio.sleep(0)
    release.set()
    await asyncio.gather(first, second)
    assert most == 1
    await store.async_unload()


def fixed_plan(
    start: datetime,
    target: int = 55,
    sun: float = 18.0,
    kind: str = "charge",
) -> dict[str, Any]:
    """Tonight's plan as fixed: the BYD charges 0–3 h to its target."""
    end = start + timedelta(hours=5)
    return {
        "fixed": True,
        "kind": kind,
        "created": (start - timedelta(minutes=15)).isoformat(),
        "window": {"start": start.isoformat(), "end": end.isoformat()},
        "target": target,
        "target_kwh": target / 10,
        "capacity_kwh": 10.0,
        "grid_charge_kwh": 3.3,
        "home_kwh": 12.0,
        "meta": {"tomorrow_kwh": sun},
        "rules": {"efficiency": 0.9, "discharge_mode": "until_target"},
        "prices": {"night": 0.25, "day": 0.35},
        "risk": {"typical_target": target},
        "hours": [],
        "actions": [],
        "cars": {},
        "batteries": [
            {
                "id": "byd",
                "name": "BYD",
                "capacity": 10.0,
                "soc": 25.0,
                "soc_start": 25.0,
                "target": target,
                "charge_kwh": 3.0,
                "grid_kwh": 3.33,
                "power_kw": 1.0,
                "slots": [
                    {
                        "start": start.isoformat(timespec="minutes"),
                        "end": (start + timedelta(hours=3)).isoformat(
                            timespec="minutes"
                        ),
                        "power_kw": 1.0,
                    }
                ],
                "how": "even",
                "controllable": True,
            }
        ],
    }


def again_plan(
    fixed: dict[str, Any], now: datetime, target: int, sun: float
) -> dict[str, Any]:
    """The night worked out again at `now`: its own target and charging."""
    end = datetime.fromisoformat(fixed["window"]["end"])
    return {
        **fixed,
        "fixed": False,
        "kind": "charge",
        "target": target,
        "meta": {"tomorrow_kwh": sun},
        "risk": {"typical_target": target},
        "batteries": [
            {
                **fixed["batteries"][0],
                "target": target,
                "charge_kwh": 1.5,
                "grid_kwh": 1.67,
                "power_kw": 1.5,
                "slots": [
                    {
                        "start": now.isoformat(timespec="minutes"),
                        "end": (end - timedelta(minutes=30)).isoformat(
                            timespec="minutes"
                        ),
                        "power_kw": 1.5,
                    }
                ],
            }
        ],
    }


async def test_a_fixed_target_goes_up_with_a_worse_forecast_never_down(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-05T02:10:00+02:00")
    start = at("2026-10-05T00:00:00+02:00")
    store = HistoryStore(hass)
    await store.async_load()
    planner = JoePlanner(hass, store, lambda: None)
    planner._config = model.default_config()
    told: list[tuple[list[str], list[dict[str, Any]]]] = []

    async def replanned(actions: list[str], raised: list[dict[str, Any]]) -> None:
        told.append((actions, raised))

    planner.replanned = replanned
    fixed = fixed_plan(start)
    planner._fixed = fixed
    answer: dict[str, Any] = {}

    async def compute(now: datetime, fixed: dict[str, Any] | None = None) -> Any:
        assert fixed is not None  # in the fixed window: worked out again
        return answer["plan"]

    planner._async_compute = compute  # type: ignore[method-assign]

    # Tomorrow got worse: 70 % instead of 55 %.
    answer["plan"] = again_plan(fixed, dt_util.now(), 70, 9.0)
    plan = await planner.async_refresh()
    assert plan["fixed"] is True
    assert plan["window"] == fixed["window"]
    battery = plan["batteries"][0]
    assert battery["target"] == 70
    assert battery["raised"]["from"] == 55
    assert battery["raised"]["why"] == "sun"
    # Charging from now on, with what the night takes as a whole.
    assert battery["slots"][0]["start"] == "2026-10-05T02:10+02:00"
    assert battery["charge_kwh"] == 4.5
    assert plan["charge_from"] == "2026-10-05T02:10+02:00"
    assert plan["target"] == 70 and plan["target_fixed"] == 55
    assert plan["raised"][-1]["first"] == 55 and plan["raised"][-1]["to"] == 70
    assert told == [([], plan["raised"])]
    # The day keeps the plan as carried out, with the target it was fixed with.
    day = await store.async_day("2026-10-05")
    assert day["plan"]["target"] == 70 and day["plan"]["target_fixed"] == 55

    # Better again: the raised target stays.
    answer["plan"] = again_plan(plan, dt_util.now(), 60, 16.0)
    freezer.move_to("2026-10-05T02:15:00+02:00")
    plan = await planner.async_refresh()
    assert plan["batteries"][0]["target"] == 70
    assert plan["target"] == 70
    # A little higher is no reason either.
    answer["plan"] = again_plan(plan, dt_util.now(), 70 + RAISE_MIN - 1, 8.0)
    plan = await planner.async_refresh()
    assert plan["batteries"][0]["target"] == 70
    assert len(told) == 1
    # Clearly higher again: from 70, the night still counted from 55.
    answer["plan"] = again_plan(plan, dt_util.now(), 80, 4.0)
    plan = await planner.async_refresh()
    assert plan["batteries"][0]["target"] == 80
    assert plan["batteries"][0]["raised"]["from"] == 55
    assert told[-1][1][0]["from"] == 70 and told[-1][1][0]["first"] == 55
    assert plan["target_fixed"] == 55
    await store.async_unload()


async def test_a_lower_target_never_lowers_and_a_missing_forecast_is_no_reason(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-05T01:00:00+02:00")
    start = at("2026-10-05T00:00:00+02:00")
    store = HistoryStore(hass)
    await store.async_load()
    planner = JoePlanner(hass, store, lambda: None)
    planner._config = model.default_config()
    fixed = fixed_plan(start, target=60)
    planner._fixed = fixed
    answer: dict[str, Any] = {}

    async def compute(now: datetime, fixed: dict[str, Any] | None = None) -> Any:
        return answer["plan"]

    planner._async_compute = compute  # type: ignore[method-assign]
    answer["plan"] = again_plan(fixed, dt_util.now(), 40, 30.0)
    plan = await planner.async_refresh()
    assert plan["batteries"][0]["target"] == 60
    assert plan["batteries"][0]["slots"] == fixed["batteries"][0]["slots"]
    assert "raised" not in plan and "target_fixed" not in plan
    # The forecast gone for a moment: the night looks dark, but that is no reason.
    answer["plan"] = {
        **again_plan(fixed, dt_util.now(), 100, 0.0),
        "notes": ["no_forecast"],
    }
    plan = await planner.async_refresh()
    assert plan["batteries"][0]["target"] == 60
    # Nor are the window's last minutes.
    freezer.move_to("2026-10-05T04:50:00+02:00")
    answer["plan"] = again_plan(fixed, dt_util.now(), 90, 5.0)
    plan = await planner.async_refresh()
    assert plan["batteries"][0]["target"] == 60
    await store.async_unload()


def test_worked_out_again_in_the_window_the_target_holds() -> None:
    """The planner from inside the window: with the level the night brought
    the target stays; with a worse tomorrow it comes out higher."""
    plan = make_plan(plan_input(solar=8, soc=30))
    assert plan["kind"] == "charge"
    levels = {h["start"][11:16]: h["soc"] for h in plan["hours"]}
    for moment, before, hour in (
        ("2026-10-04T01:45", "00:00", "01:00"),
        ("2026-10-04T03:45", "02:00", "03:00"),
    ):
        # A quarter of the hour is left (day_hours: the first hour a quarter).
        soc = levels[before] + 0.75 * (levels[hour] - levels[before])
        again = make_plan(
            plan_input(
                solar=8, soc=soc, now=berlin(moment), hours=day_hours(8, now=moment)
            )
        )
        assert abs(again["target"] - plan["target"]) < RAISE_MIN
        # Charging only from now on.
        assert all(s["start"] >= moment for b in again["batteries"] for s in b["slots"])
        worse = make_plan(
            plan_input(
                solar=4, soc=soc, now=berlin(moment), hours=day_hours(4, now=moment)
            )
        )
        assert worse["target"] >= plan["target"] + RAISE_MIN


async def test_a_new_appointment_in_the_fixed_night_charges_the_car(
    hass: HomeAssistant, freezer
) -> None:
    """Fixed at midnight without a trip; at one o'clock an appointment far
    away comes up: the charge point is worked out again in the fixed window."""
    freezer.move_to("2026-10-04T23:45:00+02:00")
    hass.states.async_set("sensor.car_soc", "60", {"unit_of_measurement": "%"})
    hass.states.async_set("sensor.soc", "40", {"unit_of_measurement": "%"})
    config = model.apply_update(
        config_of(need()),
        {
            "tariff": {
                "kind": "fixed_window",
                "window": {"start": "00:00", "end": "05:00"},
                "night_price": 0.25,
                "day_price": 0.35,
                "feed_in_price": 0.08,
            },
            "batteries": {
                "b1": {
                    "name": "Speicher",
                    "adapter": "none",
                    "soc_entity": "sensor.soc",
                    "capacity_kwh": 10.0,
                }
            },
        },
        "user",
    )
    store = HistoryStore(hass)
    await store.async_load()
    planner = JoePlanner(hass, store, lambda: None)
    planner._config = config
    planner.calendars = CarCalendarStore(hass)
    await planner.calendars.async_load()
    planner.detected = lambda: {"ev": {"state": "car", "car": "kona", "how": "only"}}
    told: list[tuple[list[str], list[dict[str, Any]]]] = []

    async def replanned(actions: list[str], raised: list[dict[str, Any]]) -> None:
        told.append((actions, raised))

    planner.replanned = replanned
    await planner._async_fix()
    fixed = planner.plan
    assert fixed["fixed"] is True, fixed.get("reasons")
    assert fixed["window"]["start"] == "2026-10-05T00:00:00+02:00"
    entry = next(a for a in fixed["actions"] if a["id"] == "ev")
    assert entry["run"] is False

    # Nothing new: the night stays as it is.
    freezer.move_to("2026-10-05T00:30:00+02:00")
    plan = await planner.async_refresh()
    assert next(a for a in plan["actions"] if a["id"] == "ev")["run"] is False
    assert told == []

    await planner.places.async_set("Messe Hannover", 150.0)
    planner.calendars.add(
        "kona",
        {
            "start": "2026-10-05T09:00:00+02:00",
            "end": "2026-10-05T17:00:00+02:00",
            "location": "Messe Hannover",
        },
    )
    freezer.move_to("2026-10-05T01:00:00+02:00")
    plan = await planner.async_refresh()
    assert plan["window"] == fixed["window"]
    entry = next(a for a in plan["actions"] if a["id"] == "ev")
    assert entry["run"] is True
    assert entry["reasons"] == ["need"]
    assert entry["need"]["trips"][0]["km"] == 150.0
    assert datetime.fromisoformat(entry["end"]) <= at("2026-10-05T05:00:00+02:00")
    assert plan["cars"]["kona"]["trips"][0]["location"] == "Messe Hannover"
    # The executor charges it even if it had been done before.
    assert told == [(["ev"], [])]
    day = await store.async_day("2026-10-05")
    assert next(a for a in day["plan"]["actions"] if a["id"] == "ev")["run"] is True

    # Charging already: it goes on (not off now and on again at a later start).
    freezer.move_to(entry["start"])
    freezer.tick(timedelta(minutes=10))
    hass.states.async_set("sensor.car_soc", "75", {"unit_of_measurement": "%"})
    plan = await planner.async_refresh()
    again = next(a for a in plan["actions"] if a["id"] == "ev")
    assert again["run"] is True
    assert again["start"] == entry["start"]
    assert len(told) == 1
    if planner._commit:
        planner._commit()
    await store.async_unload()


async def test_a_raised_target_charges_on_after_the_old_one_was_reached(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-04T03:10:00+02:00")
    install_devices(hass, byd_soc=59.8)
    config = configured(fronius_battery())
    plan = night_plan(dt_util.now())
    plan["batteries"] = [plan["batteries"][0]]
    executor, holder = await make_executor(hass, config, plan)
    await executor.async_check()
    assert "byd" in executor.data["reached"]
    assert hass.states.get("number.reserve").state != "75.0"

    # Joe worked the night out again: 75 % now.
    holder["plan"] = {
        **plan,
        "target": 75,
        "batteries": [{**plan["batteries"][0], "target": 75}],
    }
    await executor.async_check()
    # Without being told the battery stays where it reached its old target.
    assert executor.status["batteries"]["byd"]["action"] != "charge"
    await executor.async_replanned(
        [],
        [
            {
                "battery": "byd",
                "from": 60,
                "to": 75,
                "why": "sun",
                "sun_from": 18.0,
                "sun_to": 9.0,
            }
        ],
    )
    assert "byd" not in executor.data["reached"]
    await executor.async_check()
    assert executor.status["batteries"]["byd"]["action"] == "charge"
    assert hass.states.get("number.reserve").state == "75.0"
    entry = next(e for e in executor.data["log"] if e["kind"] == "raised")
    assert entry["battery"] == "byd"
    assert (entry["before"], entry["target"], entry["why"]) == (60, 75, "sun")

    hass.states.async_set("sensor.byd_soc", "75", {"unit_of_measurement": "%"})
    await executor.async_check()
    assert "byd" in executor.data["reached"]
