"""Joe looks back: replaying plans and learning from the days."""

from __future__ import annotations

from datetime import date, datetime, timedelta
import math
from typing import Any

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.energy_joe import model
from custom_components.energy_joe.const import DOMAIN
from custom_components.energy_joe.learn.evaluate import evaluate
from custom_components.energy_joe.learn.learner import JoeLearner
from custom_components.energy_joe.learn.learning import (
    buffer,
    results,
    solar_factor,
    solar_profile,
    solar_shift,
)
from custom_components.energy_joe.observe.store import HistoryStore
from custom_components.energy_joe.plan.planner import (
    Battery,
    Hour,
    PlanInput,
    Prices,
    make_plan,
)
from homeassistant.const import UnitOfPower
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

POWER_W = {"unit_of_measurement": UnitOfPower.WATT, "device_class": "power"}
OCTOPUS = Prices(night=0.1856, day=0.2857, feed_in=0.062)


@pytest.fixture(autouse=True)
def berlin_time(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


def local(day: date, hour: int = 0) -> datetime:
    return dt_util.start_of_local_day(day) + timedelta(hours=hour)


def sun(hour: int, total: float) -> float:
    weights = [max(0.0, math.sin(math.pi * (h + 0.5 - 7) / 12)) for h in range(24)]
    return total * weights[hour] / sum(weights)


def home(hour: int) -> float:
    return 0.4 if hour < 6 else 1.2 if 18 <= hour <= 21 else 0.6


def fixed_plan(day: date, solar_total: float, soc: float = 20) -> dict[str, Any]:
    """The plan Joe would have fixed at 23:45 the evening before."""
    start = local(day)
    hours = [Hour(start - timedelta(hours=1), 0.0, 0.1, False, 0.25)]
    hours += [
        Hour(start + timedelta(hours=h), sun(h, solar_total), home(h), h < 5)
        for h in range(24)
    ]
    plan = make_plan(
        PlanInput(
            now=start - timedelta(minutes=15),
            window_start=start,
            window_end=start + timedelta(hours=5),
            hours=hours,
            batteries=[Battery("b1", "Battery", 10.0, soc, 3.0, 3.0)],
            prices=OCTOPUS,
            buffer=0.0,
        )
    )
    plan["fixed"] = True
    return plan


def real_hours(
    day: date, solar_total: float, home_factor: float = 1.0, soc: float = 20
) -> list[dict[str, Any]]:
    """What really happened (without Joe steering)."""
    records = [
        {
            "start": local(day, -1).isoformat(),
            "src": "live",
            "cov": 1.0,
            "home": 0.4,
            "solar": 0.0,
            "bat": {"b1": {"soc": soc}},
        }
    ]
    for h in range(24):
        solar = sun(h, solar_total)
        need = home(h) * home_factor
        records.append(
            {
                "start": local(day, h).isoformat(),
                "src": "live",
                "cov": 1.0,
                "home": round(need, 4),
                "solar": round(solar, 4),
                "grid_in": round(max(0.0, need - solar), 4),
                "grid_out": round(max(0.0, solar - need), 4),
            }
        )
    return records


def test_replay_of_a_grey_day() -> None:
    day = date(2026, 10, 4)
    plan = fixed_plan(day, solar_total=4)
    records = {r["start"]: r for r in real_hours(day, solar_total=3, home_factor=1.1)}
    result = evaluate(plan, records, local(day + timedelta(days=1)))
    assert result["complete"] is True
    assert result["window"] == plan["window"]
    assert result["start_soc"] == 20
    assert result["saving"] > 0
    assert result["with_plan"]["day_kwh"] < result["without"]["day_kwh"]
    assert result["with_plan"]["night_kwh"] > result["without"]["night_kwh"]
    assert result["solar"]["actual"] < result["solar"]["forecast"]
    assert result["bridge"]["actual"] > result["bridge"]["planned"]
    assert len(result["hours"]) == 24
    assert result["takeover"] == {"planned": None, "actual": None}


def test_replay_notes_when_the_sun_took_over() -> None:
    day = date(2026, 10, 4)
    plan = fixed_plan(day, solar_total=8)
    records = {r["start"]: r for r in real_hours(day, solar_total=6)}
    result = evaluate(plan, records, local(day + timedelta(days=1)))
    assert result["takeover"] == {
        "planned": local(day, 9).isoformat(),
        "actual": local(day, 10).isoformat(),
    }
    assert result["bridge"]["actual"] > result["bridge"]["planned"]


def test_replay_in_the_morning_is_provisional() -> None:
    day = date(2026, 10, 4)
    plan = fixed_plan(day, solar_total=4)
    records = {r["start"]: r for r in real_hours(day, solar_total=3)[:10]}
    result = evaluate(plan, records, local(day, 9), until=local(day, 9))
    assert result["complete"] is True
    assert result["final"] is False
    assert result["until"] == local(day, 9).isoformat()
    assert result["missing"] == 0
    final = evaluate(plan, records, local(day + timedelta(days=1)))
    assert final["final"] is True and final["complete"] is False


def test_replay_needs_the_day() -> None:
    day = date(2026, 10, 4)
    plan = fixed_plan(day, solar_total=4)
    records = {r["start"]: r for r in real_hours(day, solar_total=3)[:20]}
    result = evaluate(plan, records, local(day + timedelta(days=1)))
    assert result["complete"] is False


def solar_day(
    day: date, forecast: float, actual: float, shift: int = 0
) -> dict[str, Any]:
    hours = [
        {
            "start": local(day, h).isoformat(),
            "src": "live",
            "cov": 1.0,
            "home": 0.5,
            "solar": round(sun(h, actual), 4),
        }
        for h in range(24)
    ]
    # The forecast's hours run "shift" hours early.
    predicted = {
        local(day, h - shift).isoformat(): sun(h, forecast) * 1000 for h in range(24)
    }
    return {"hours": hours, "fc": {"ahead_kwh": forecast, "ahead_hours": predicted}}


def test_solar_factor_is_the_median_ratio() -> None:
    days = {
        (date(2026, 9, 20) + timedelta(days=i)).isoformat(): solar_day(
            date(2026, 9, 20) + timedelta(days=i), 10, actual
        )
        for i, actual in enumerate((8, 9, 8.5, 8.2, 8.8, 0.2))
    }
    factor, used = solar_factor(days)
    assert used == 6
    assert factor == pytest.approx(0.835, abs=0.006)
    few = dict(list(days.items())[:4])
    assert solar_factor(few) == (None, 4)


def test_solar_shift_finds_a_late_forecast() -> None:
    days = {
        (date(2026, 9, 20) + timedelta(days=i)).isoformat(): solar_day(
            date(2026, 9, 20) + timedelta(days=i), 12, 12, shift=1
        )
        for i in range(6)
    }
    assert solar_shift(days) == (1, 6)
    right = {
        (date(2026, 9, 20) + timedelta(days=i)).isoformat(): solar_day(
            date(2026, 9, 20) + timedelta(days=i), 12, 12
        )
        for i in range(6)
    }
    assert solar_shift(right) == (0, 6)
    profile = solar_profile(days)
    assert profile["days"] == 6
    late = max(range(24), key=profile["actual"].__getitem__)
    early = max(range(24), key=profile["forecast"].__getitem__)
    assert late - early == 1


def test_buffer_covers_most_mornings() -> None:
    evaluations = [
        {"complete": True, "bridge": {"planned": 2.0, "actual": 2.0 * (1 + error)}}
        for error in (0.0, 0.1, 0.05, 0.2, 0.15, -0.1, 0.3, 0.1)
    ]
    value, used = buffer(evaluations)
    assert used == 8
    assert value == pytest.approx(0.18, abs=0.02)
    assert buffer(evaluations[:6]) == (None, 6)


def test_results_count_since_the_reset() -> None:
    days = {
        "2026-10-01": {
            "evaluation": {
                "complete": True,
                "saving": 0.4,
                "with_plan": {"day_kwh": 1, "night_kwh": 3},
                "without": {"day_kwh": 4, "night_kwh": 0},
            }
        },
        "2026-10-02": {
            "evaluation": {
                "complete": True,
                "saving": -0.1,
                "with_plan": {"day_kwh": 1, "night_kwh": 3},
                "without": {"day_kwh": 4, "night_kwh": 0},
            }
        },
        "2026-10-03": {
            "evaluation": {
                "complete": True,
                "saving": 0.3,
                "with_plan": {"day_kwh": 1, "night_kwh": 3},
                "without": {"day_kwh": 4, "night_kwh": 0},
            }
        },
    }
    summary = results(days, None)
    assert (
        summary["days"],
        summary["saving"],
        summary["better"],
        summary["worse"],
    ) == (3, 0.6, 2, 1)
    assert summary["last"]["date"] == "2026-10-03"
    assert results(days, "2026-10-02T08:00:00+02:00")["days"] == 2


async def test_learner_evaluates_learns_and_resets(
    hass: HomeAssistant, freezer
) -> None:
    """Finished plans are replayed, the buffer is learned, a reset forgets it."""
    await hass.config.async_set_time_zone("Europe/Berlin")
    freezer.move_to("2026-10-12T08:00:00+02:00")
    store = HistoryStore(hass)
    await store.async_load()
    holder = {"config": model.default_config()}

    def update(patch: dict[str, Any], source: str) -> None:
        holder["config"] = model.apply_update(holder["config"], patch, source)

    for offset in range(8):
        day = date(2026, 10, 3) + timedelta(days=offset)
        await store.async_put_hours(real_hours(day, solar_total=5, home_factor=1.1))
        await store.async_update_day(
            day.isoformat(), plan=fixed_plan(day, solar_total=5)
        )
    await store.async_put_hours(real_hours(date(2026, 10, 11), solar_total=5))
    # This morning: the night is over, the day is not.
    morning = real_hours(date(2026, 10, 12), solar_total=5)
    await store.async_put_hours(morning[:9])
    await store.async_update_day(
        "2026-10-12", plan=fixed_plan(date(2026, 10, 12), solar_total=5)
    )

    learner = JoeLearner(hass, store, lambda: holder["config"], update, lambda: None)
    await learner.async_start()
    day = await store.async_day("2026-10-05")
    assert day["evaluation"]["complete"] is True
    assert day["evaluation"]["final"] is True
    today = await store.async_day("2026-10-12")
    assert today["evaluation"]["final"] is False
    assert today["evaluation"]["until"] == "2026-10-12T08:00:00+02:00"
    assert learner.results["days"] == 9
    assert learner.results["last"]["final"] is False
    config = holder["config"]
    assert config["learned"]["buffer_days"] == 8
    assert model.source_of(config, "rules.buffer_factor") == "learned"
    assert 0.05 <= config["rules"]["buffer_factor"] < 0.35

    learned = config["learned"]["buffer"]
    assert learned == config["rules"]["buffer_factor"]
    update({"rules": {"buffer_factor": 0.5}}, "user")
    await learner.async_run()
    assert holder["config"]["rules"]["buffer_factor"] == 0.5
    assert holder["config"]["learned"]["buffer"] == learned

    # Back to Joe's own value: the starting value gives way to the learned one.
    default = model.apply_update(
        holder["config"], {"rules": {"buffer_factor": 0.35}}, "default"
    )
    preferred = model.prefer_learned(default)
    assert preferred["rules"]["buffer_factor"] == learned
    assert model.source_of(preferred, "rules.buffer_factor") == "learned"

    # At midnight the day is complete and the result final.
    await store.async_put_hours(morning[9:])
    freezer.move_to("2026-10-13T00:10:00+02:00")
    await learner.async_run()
    today = await store.async_day("2026-10-12")
    assert today["evaluation"]["final"] is True
    assert learner.results["last"]["final"] is True
    assert holder["config"]["learned"]["buffer_days"] == 9

    await learner.async_reset()
    config = holder["config"]
    assert config["learned"]["since"].startswith("2026-10-13")
    assert config["learned"]["buffer_days"] == 0
    assert config["learned"]["buffer"] is None
    assert config["rules"]["buffer_factor"] == 0.5
    assert learner.results["days"] == 0
    await learner.async_stop()
    await store.async_unload()


async def test_learning_api(
    ready_hass: HomeAssistant, hass_ws_client: WebSocketGenerator
) -> None:
    """The panel reads what Joe learned and can make him forget it."""
    hass = ready_hass
    await hass.config.async_set_time_zone("Europe/Berlin")
    hass.states.async_set("sensor.grid", "800", POWER_W)
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    runtime = hass.data[DOMAIN]
    runtime.async_update_config(
        {"measurements": {"grid_power": {"entity_id": "sensor.grid"}}}, "user"
    )
    runtime.async_set_onboarding(step="done", completed=True)
    await hass.async_block_till_done()
    assert runtime.learner.active

    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": f"{DOMAIN}/learning"})
    result = (await client.receive_json())["result"]
    assert result["buffer"] == {"value": 0.35, "source": "default", "default": 0.35}
    assert result["learned"]["solar_factor"] is None
    assert result["results"]["days"] == 0
    assert result["accuracy"] == [] and result["solar"] == []
    assert len(result["consumption"]["workday"]) == 24
    assert result["needs"] == {"solar": 5, "shift": 5, "buffer": 7}
    assert result["solar_profile"] is None

    await client.send_json_auto_id({"type": f"{DOMAIN}/learning/reset"})
    assert (await client.receive_json())["success"]
    assert runtime.config["learned"]["since"] is not None
    assert runtime.state["results"]["since"] == runtime.config["learned"]["since"]

    runtime.async_set_mode("off")
    await hass.async_block_till_done()
    await client.send_json_auto_id({"type": f"{DOMAIN}/learning/reset"})
    msg = await client.receive_json()
    assert msg["error"]["code"] == "not_learning"
    assert await hass.config_entries.async_unload(entry.entry_id)


def test_night_over_midnight_shows_on_the_morning_day() -> None:
    """With a window from 22:00, the night's plan lives on the evening's day."""
    from custom_components.energy_joe.observe.records import day_view

    evening = date(2026, 10, 4)
    start = local(evening, 22)
    plan = {
        "kind": "charge",
        "fixed": True,
        "window": {
            "start": start.isoformat(),
            "end": (start + timedelta(hours=8)).isoformat(),
        },
        "hours": [
            {"start": (start + timedelta(hours=h)).isoformat(), "soc": 20 + h}
            for h in range(24)
        ],
    }
    evaluation = {
        "complete": True,
        "final": True,
        "saving": 0.3,
        "hours": [
            {
                "start": (start + timedelta(hours=h)).isoformat(),
                "with": 50,
                "without": 30,
            }
            for h in range(24)
        ],
    }
    window = {"start": "22:00", "end": "06:00"}
    view = day_view(
        "2026-10-05", {}, window, {}, {"plan": plan, "evaluation": evaluation}
    )
    assert view["plan"]["window"] == plan["window"]
    assert view["evaluation"]["saving"] == 0.3
    assert view["evaluation_slots"]["with"][0] == 50
    assert view["plan_soc_slots"][0] == 22
    own = day_view("2026-10-04", {"plan": plan, "evaluation": evaluation}, window, {})
    assert own["evaluation"] is None
    assert own["plan_soc_slots"][22] == 20
