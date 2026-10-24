"""Past nights played again with every caution: what each would have cost."""

from __future__ import annotations

from datetime import date, time, timedelta
import math
import random
from typing import Any

import pytest

from custom_components.energy_joe import model
from custom_components.energy_joe.learn import learner as learner_module
from custom_components.energy_joe.learn.learner import JoeLearner
from custom_components.energy_joe.learn.replay import (
    ReplaySetup,
    nights,
    replay_nights,
)
from custom_components.energy_joe.observe.store import HistoryStore
from custom_components.energy_joe.plan.planner import Prices
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

LEVELS = ("bold", "brave", "balanced", "careful", "cautious")


@pytest.fixture(autouse=True)
def berlin(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


def setup(**changes: Any) -> ReplaySetup:
    values: dict[str, Any] = {
        "batteries": [("bat", 10.0)],
        "charge_kw": 3.0,
        "discharge_kw": 3.0,
        "efficiency": 0.9,
        "reserve": 10.0,
        "prices": Prices(night=0.12, day=0.35, feed_in=0.08),
        "window_start": time(22, 0),
        "window_end": time(6, 0),
        "flexible": ["car"],
    }
    values.update(changes)
    return ReplaySetup(**values)


def make_day(
    current: date, actual: float, forecast: float | None, soc: float = 30.0
) -> dict[str, Any]:
    """A day of hours: sun as a bell from 8 to 17, the home 0.5 kWh an hour
    (plus a car at night that does not count)."""
    hours = []
    start = dt_util.start_of_local_day(current)
    end = dt_util.start_of_local_day(current + timedelta(days=1))
    weights = [max(0.0, math.sin(math.pi * (h - 7.5) / 10)) for h in range(24)]
    total = sum(weights)
    moment = dt_util.as_utc(start)
    while moment < dt_util.as_utc(end):
        local = dt_util.as_local(moment)
        car = 2.0 if local.hour in (1, 2) else 0.0
        hours.append(
            {
                "start": local.isoformat(),
                "solar": round(actual * weights[local.hour] / total, 4),
                "home": 0.5 + car,
                "use": {"car": car},
                "cov": 1.0,
                "bat": {"bat": {"soc": soc, "in": 0.0, "out": 0.0}},
                "grid_in": 0.0,
                "grid_out": 0.0,
            }
        )
        moment += timedelta(hours=1)
    data: dict[str, Any] = {"hours": hours}
    if forecast is not None:
        data["fc"] = {"ahead_kwh": forecast}
    return data


def series(
    first: date, count: int, actual, forecast=lambda i: 20.0
) -> dict[str, dict[str, Any]]:
    return {
        (first + timedelta(days=i)).isoformat(): make_day(
            first + timedelta(days=i), actual(i), forecast(i)
        )
        for i in range(count)
    }


def test_when_bad_days_are_common_caution_pays() -> None:
    # The forecast says 20 kWh, but two days in five bring only 3.
    days = series(date(2026, 9, 1), 40, lambda i: 3.0 if i % 5 in (1, 3) else 20.0)
    result = replay_nights(days, setup())
    assert result is not None
    assert result["nights"] >= 30
    costs = result["costs"]
    assert set(costs) == {"typical", *LEVELS}
    assert costs["cautious"] < costs["bold"]
    assert result["best"] in LEVELS
    assert costs[result["best"]] == min(costs[name] for name in LEVELS)
    assert result["first"] < result["last"] == "2026-10-10"


def test_when_the_sun_fills_the_batteries_bold_is_enough() -> None:
    rng = random.Random(4)
    days = series(date(2026, 5, 1), 40, lambda i: 20.0 * rng.uniform(0.95, 1.05))
    result = replay_nights(days, setup())
    assert result is not None
    assert result["costs"]["bold"] <= result["costs"]["cautious"]


def test_too_few_nights_give_nothing() -> None:
    days = series(date(2026, 9, 1), 9, lambda i: 20.0)
    assert replay_nights(days, setup()) is None


def test_a_dynamic_tariff_gives_nothing() -> None:
    days = series(date(2026, 9, 1), 40, lambda i: 20.0)
    assert replay_nights(days, setup(dynamic=True)) is None
    assert replay_nights(days, setup(window_start=None, window_end=None)) is None


def test_days_without_forecast_are_skipped() -> None:
    days = series(
        date(2026, 9, 1),
        40,
        lambda i: 20.0,
        lambda i: None if i % 4 == 0 else 20.0,
    )
    found = [night.day for night in nights(days, setup())]
    assert found
    assert all((night - date(2026, 9, 1)).days % 4 for night in found)
    result = replay_nights(days, setup())
    assert result is not None and result["nights"] == len(found)


def test_a_night_is_planned_only_from_the_days_before() -> None:
    days = series(date(2026, 9, 1), 40, lambda i: 3.0 if i % 3 == 0 else 18.0)
    day = date(2026, 9, 30)

    def night_of(source: dict[str, dict[str, Any]]):
        return next(n for n in nights(source, setup()) if n.day == day)

    before = night_of(days)
    changed = {name: dict(data) for name, data in days.items()}
    # The day itself and the days after it: other forecast, sun and use.
    for name, data in changed.items():
        if name >= day.isoformat():
            data["fc"] = {"ahead_kwh": 1.5 * data["fc"]["ahead_kwh"]}
            data["hours"] = [
                {**h, "solar": h["solar"] * 0.5, "home": h["home"] * 2}
                for h in data["hours"]
            ]
    after = night_of(changed)
    assert after.factor == before.factor
    assert after.solar_spread == before.solar_spread
    assert after.home_spread == before.home_spread
    for old, new in zip(before.typical.hours, after.typical.hours, strict=True):
        assert new.start == old.start
        assert new.home == pytest.approx(old.home)
        assert new.solar == pytest.approx(1.5 * old.solar)
    # The real day is what changed.
    assert sum(h.home for h in after.real.hours) > sum(
        h.home for h in before.real.hours
    )
    # The car's use is left out of the home's.
    assert max(h.home for h in before.typical.hours) == pytest.approx(0.5)


def test_the_window_and_the_start_level() -> None:
    days = series(date(2026, 10, 1), 30, lambda i: 20.0)
    found = list(nights(days, setup()))
    night = next(n for n in found if n.day == date(2026, 10, 25))
    # The night the clocks go back: 25 hours from 22:00 to 22:00, 9 cheap ones.
    assert len(night.typical.hours) == len(night.real.hours) == 25
    first = dt_util.as_local(night.typical.hours[0].start)
    assert (first.date(), first.hour) == (date(2026, 10, 24), 22)
    assert sum(h.window for h in night.typical.hours) == 9
    assert night.typical.batteries[0].soc == pytest.approx(30.0)
    assert len(next(n for n in found if n.day == date(2026, 10, 26)).real.hours) == 24
    # Without a charge level before the window the night is left out.
    del days["2026-10-24"]["hours"][21]["bat"]
    assert date(2026, 10, 25) not in [n.day for n in nights(days, setup())]


def test_the_season_around_the_last_night() -> None:
    days = {
        **series(date(2025, 10, 1), 25, lambda i: 3.0 if i % 3 == 0 else 18.0),
        **series(date(2026, 3, 1), 20, lambda i: 12.0),
        **series(date(2026, 10, 1), 20, lambda i: 3.0 if i % 3 == 0 else 18.0),
    }
    result = replay_nights(days, setup())
    assert result is not None
    season = result["season"]
    assert season is not None
    in_season = [n.day for n in nights(days, setup()) if n.day.month == 10]
    assert season["nights"] == len(in_season) < result["nights"]
    assert season["first"].startswith("2025-10")
    assert season["last"] == result["last"] == "2026-10-20"
    assert set(season["costs"]) == {"typical", *LEVELS}

    # Too few nights in the season: no season block.
    few = {
        **series(date(2026, 3, 1), 30, lambda i: 12.0),
        **series(date(2026, 10, 1), 8, lambda i: 12.0),
    }
    result = replay_nights(few, setup())
    assert result is not None and result["season"] is None


async def test_the_learner_replays_once_a_week(
    hass: HomeAssistant, freezer, monkeypatch
) -> None:
    await hass.config.async_set_time_zone("Europe/Berlin")
    freezer.move_to("2026-10-12T08:00:00+02:00")
    store = HistoryStore(hass)
    await store.async_load()
    for name, data in series(
        date(2026, 9, 10), 32, lambda i: 3.0 if i % 3 == 0 else 18.0
    ).items():
        await store.async_put_hours(data["hours"])
        await store.async_update_day(name, fc=data["fc"])
    holder = {
        "config": model.apply_update(
            model.default_config(),
            {
                "tariff": {
                    "kind": "fixed_window",
                    "window": {"start": "22:00", "end": "06:00"},
                    "night_price": 0.12,
                    "day_price": 0.35,
                    "feed_in_price": 0.08,
                },
                "batteries": {
                    "bat": {
                        "name": "Speicher",
                        "adapter": "none",
                        "soc_entity": "sensor.soc",
                        "capacity_kwh": 10.0,
                        "max_charge_w": 3000,
                    }
                },
            },
            "user",
        )
    }

    def update(patch: dict[str, Any], source: str) -> None:
        holder["config"] = model.apply_update(holder["config"], patch, source)

    calls: list[ReplaySetup] = []

    def counted(days, found):
        calls.append(found)
        return replay_nights(days, found)

    monkeypatch.setattr(learner_module, "replay_nights", counted)
    learner = JoeLearner(hass, store, lambda: holder["config"], update, lambda: None)
    await learner.async_run()
    replay = holder["config"]["learned"]["replay"]
    assert replay is not None and replay["nights"] >= 20
    assert replay["last"] == "2026-10-11"
    used = calls[0]
    assert used.batteries == [("bat", 10.0)]
    assert used.charge_kw == 3.0 and used.discharge_kw == 5.0
    assert used.prices == Prices(0.12, 0.35, 0.08)
    assert (used.window_start, used.window_end) == (time(22, 0), time(6, 0))
    # Within the week nothing again; new days from the history: again.
    await learner.async_run()
    assert len(calls) == 1
    await learner.async_relearn()
    assert len(calls) == 2
    freezer.move_to("2026-10-19T09:00:00+02:00")
    await learner.async_run()
    assert len(calls) == 3
    # A reset of the forecast forgets it; a dynamic tariff has none.
    await learner.async_reset("forecast")
    assert holder["config"]["learned"]["replay"] is None
    update({"learned": {"replay": replay}}, "learned")
    update({"tariff": {"kind": "dynamic"}}, "user")
    await learner.async_relearn()
    assert holder["config"]["learned"]["replay"] is None
    assert len(calls) == 3
