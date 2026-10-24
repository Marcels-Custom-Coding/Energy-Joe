"""How far sun and consumption strayed: the spreads behind the night's scenarios."""

from __future__ import annotations

from datetime import date, timedelta
import random
from typing import Any

import pytest

from custom_components.energy_joe import model
from custom_components.energy_joe.learn.learner import JoeLearner
from custom_components.energy_joe.learn.learning import solar_ratios
from custom_components.energy_joe.learn.models import (
    class_factor,
    home_spread,
    season_weight,
    solar_classes,
    solar_spread,
)
from custom_components.energy_joe.observe.store import HistoryStore
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util


@pytest.fixture(autouse=True)
def berlin(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


def ratio_rows(
    values: list[float], forecast: float = 30, rain: bool = False, first: int = 1
) -> list[dict[str, Any]]:
    return [
        {
            "date": (date(2026, 9, 1) + timedelta(days=first - 1 + index)).isoformat(),
            "forecast": forecast,
            "ratio": value,
            "rain": rain,
        }
        for index, value in enumerate(values)
    ]


def shrunk(value: float, default: float, days: int) -> float:
    return round((days * value + 10 * default) / (days + 10), 3)


def test_solar_spread_per_class_with_rain_apart() -> None:
    clear = [0.6 + 0.1 * index for index in range(10)]
    rainy = [0.3, 0.4, 0.5, 0.6, 0.7]
    ratios = [
        *ratio_rows(clear),
        *ratio_rows(rainy, rain=True, first=11),
        # Four overcast days are too few for a class of their own.
        *ratio_rows([0.5, 0.5, 0.6, 0.6], forecast=5, first=16),
    ]
    spread = solar_spread(ratios)
    assert set(spread) == {"clear", "rain", "all"}
    # Clear: p20 = 0.78, p80 = 1.32, median 1.05.
    assert spread["clear"] == {
        "low": shrunk(0.78 / 1.05, 0.6, 10),
        "high": shrunk(1.32 / 1.05, 1.2, 10),
        "days": 10,
    }
    # Rain days stay out of the clear class but count in all.
    assert spread["rain"]["days"] == 5
    assert spread["rain"]["low"] == shrunk(0.38 / 0.5, 0.6, 5)
    assert spread["all"]["days"] == 19


def test_solar_spread_leans_on_the_default_and_needs_five_days() -> None:
    assert solar_spread(ratio_rows([0.5, 1.0, 1.5, 0.9])) == {}
    assert solar_spread([]) == {}
    # Five identical days: the spread is mostly the default.
    spread = solar_spread(ratio_rows([0.9] * 5))
    assert spread["clear"] == {
        "low": shrunk(1.0, 0.6, 5),
        "high": shrunk(1.0, 1.2, 5),
        "days": 5,
    }
    # A wild sky is kept within the limits.
    wild = solar_spread(ratio_rows([0.01] * 40 + [1.0] * 20 + [9.0] * 40))
    assert wild["clear"]["low"] == 0.2
    assert wild["clear"]["high"] == 2.0


def test_the_rain_class_and_its_factor() -> None:
    ratios = [
        *ratio_rows([0.9, 0.95, 0.92]),
        *ratio_rows([0.4, 0.5, 0.45], rain=True, first=4),
    ]
    solar = solar_classes(ratios)
    assert solar["classes"]["rain"] == {"factor": 0.45, "days": 3}
    assert solar["classes"]["clear"] == {"factor": 0.92, "days": 3}
    assert class_factor(solar, 25, rain=True) == ("rain", 0.45)
    assert class_factor(solar, 25) == ("clear", 0.92)
    # Without a learned rain class a rainy day keeps its height class.
    no_rain = solar_classes(ratio_rows([0.9, 0.95, 0.92]))
    assert class_factor(no_rain, 25, rain=True) == ("clear", 0.92)


def home_days(
    first: date,
    count: int,
    temp: float | None = None,
    car_every: int = 3,
    skip: range = range(0),
) -> dict[str, dict[str, Any]]:
    """10 kWh on working days, 14 on others; the car takes 12 kWh now and then."""
    days = {}
    for offset in range(count):
        if offset in skip:
            continue
        day = first + timedelta(days=offset)
        workday = day.weekday() < 5
        base = (10 if workday else 14) / 24
        car = 12 / 24 if offset % car_every == 0 else 0.0
        hours = []
        for h in range(24):
            hour: dict[str, Any] = {
                "start": f"{day.isoformat()}T{h:02d}:00:00+02:00",
                "cov": 1.0,
                "home": base + car,
                "use": {"car": car},
            }
            if temp is not None:
                hour["temp"] = temp
            hours.append(hour)
        days[day.isoformat()] = {"hours": hours, "workday": workday}
    return days


def test_home_spread_from_the_weeks_before() -> None:
    # 60 days from a Monday: the first five days of each kind have too little
    # before them.
    days = home_days(date(2026, 8, 3), 60)
    spread = home_spread(days, ["car"])
    assert set(spread) == {"all"}
    assert spread["all"] == {
        "low": shrunk(1.0, 0.9, 50),
        "high": shrunk(1.0, 1.15, 50),
        "days": 50,
    }
    # With the car counted the days stray.
    wide = home_spread(days)
    assert wide["all"]["high"] > spread["all"]["high"]
    # Only the 28 days before count: after a month without records it starts over.
    gap = home_spread(home_days(date(2026, 8, 3), 90, skip=range(30, 60)), ["car"])
    assert gap["all"]["days"] == 90 - 30 - 20
    assert home_spread(home_days(date(2026, 8, 3), 10), ["car"]) == {}


def test_home_spread_cold_and_mild() -> None:
    days = {
        **home_days(date(2026, 8, 3), 30, temp=16.0),
        **home_days(date(2026, 9, 2), 30, temp=4.0),
    }
    # Cold days use a third more than the weeks before them.
    for day, data in days.items():
        if day >= "2026-09-02":
            for hour in data["hours"]:
                car = hour["use"]["car"]
                hour["home"] = (hour["home"] - car) * 4 / 3 + car
    spread = home_spread(days, ["car"])
    assert set(spread) == {"cold", "mild", "all"}
    assert spread["mild"]["days"] == 20
    assert spread["cold"]["days"] == 30
    assert spread["mild"]["high"] == shrunk(1.0, 1.15, 20)
    assert spread["cold"]["high"] > spread["mild"]["high"]
    assert spread["all"]["days"] == 50


async def test_the_learner_learns_spreads_and_drops_the_learned_buffer(
    hass: HomeAssistant, freezer
) -> None:
    await hass.config.async_set_time_zone("Europe/Berlin")
    freezer.move_to("2026-10-10T08:00:00+02:00")
    store = HistoryStore(hass)
    await store.async_load()
    rng = random.Random(5)
    days = home_days(date(2026, 8, 1), 70, temp=12.0)
    for day, data in days.items():
        forecast = 20.0
        actual = forecast * (0.6 + 0.6 * rng.random())
        for h, hour in enumerate(data["hours"]):
            hour["solar"] = actual / 10 if 7 <= h < 17 else 0.0
        await store.async_put_hours(data["hours"])
        await store.async_update_day(
            day,
            workday=data["workday"],
            fc={"ahead_kwh": forecast, "rain": day.endswith("5")},
        )
    # A buffer Joe learned before goes back to its start.
    config = model.apply_update(
        model.default_config(), {"rules": {"buffer_factor": 1.0}}, "learned"
    )
    holder = {"config": config}

    def update(patch: dict[str, Any], source: str) -> None:
        holder["config"] = model.apply_update(holder["config"], patch, source)

    learner = JoeLearner(hass, store, lambda: holder["config"], update, lambda: None)
    await learner.async_start()
    config = holder["config"]
    learned = config["learned"]
    assert set(learned["solar_spread"]) == {"clear", "rain", "all"}
    assert learned["solar_spread"]["all"]["days"] == 70
    assert learned["solar_spread"]["rain"]["days"] == 7
    assert 0.2 <= learned["solar_spread"]["clear"]["low"] < 1.0
    assert set(learned["home_spread"]) == {"mild", "all"}
    assert learned["home_spread"]["all"]["days"] == 60
    default = model.default_config()["rules"]["buffer_factor"]
    assert config["rules"]["buffer_factor"] == default
    assert model.source_of(config, "rules.buffer_factor") == "default"

    # Forgetting the forecast keeps the consumption.
    await learner.async_reset("forecast")
    learned = holder["config"]["learned"]
    assert learned["solar_spread"] == {}
    assert learned["home_spread"]["all"]["days"] == 60
    await learner.async_reset("consumption")
    assert holder["config"]["learned"]["home_spread"] == {}
    await learner.async_stop()
    await store.async_unload()


def test_the_season_counts_double_in_any_year() -> None:
    today = date(2026, 10, 24)
    assert season_weight(date(2026, 10, 20), today) == 2
    assert season_weight(date(2025, 10, 24), today) == 2
    assert season_weight(date(2024, 11, 23), today) == 2
    assert season_weight(date(2026, 9, 24), today) == 2
    assert season_weight(date(2026, 9, 23), today) == 1
    assert season_weight(date(2025, 7, 1), today) == 1
    # Around new year the season reaches over into the other year.
    assert season_weight(date(2025, 12, 10), date(2027, 1, 5)) == 2
    assert season_weight(date(2026, 1, 20), date(2026, 12, 28)) == 2
    assert season_weight(date(2026, 12, 1), date(2027, 1, 5)) == 1
    # 29 February counts as the 28th in other years.
    assert season_weight(date(2024, 2, 29), date(2026, 3, 30)) == 2


def season_rows() -> list[dict[str, Any]]:
    """Last October the sun gave 0.7 of the forecast, last July 1.2."""
    return [
        *(
            {"date": f"2025-10-{day:02d}", "forecast": 30, "ratio": 0.7}
            for day in range(10, 14)
        ),
        *(
            {"date": f"2025-07-{day:02d}", "forecast": 30, "ratio": 1.2}
            for day in range(1, 6)
        ),
    ]


def test_weather_classes_and_spread_weigh_the_season() -> None:
    today = date(2026, 10, 24)
    plain = solar_classes(season_rows())
    weighted = solar_classes(season_rows(), today)
    assert plain["classes"]["clear"] == {"factor": 1.2, "days": 9}
    assert weighted["classes"]["clear"] == {"factor": 0.7, "days": 9}
    # Without today nothing changes for old callers.
    assert solar_spread(season_rows()) == solar_spread(season_rows(), None)
    spread = solar_spread(season_rows(), today)
    assert spread["clear"]["days"] == 9
    assert spread["clear"] != solar_spread(season_rows())["clear"]


def test_home_spread_weighs_the_season() -> None:
    days = home_days(date(2026, 8, 3), 60)
    # The last ten days use a third more: in season for 10 October only.
    for day, data in days.items():
        if day >= "2026-09-22":
            for hour in data["hours"]:
                car = hour["use"]["car"]
                hour["home"] = (hour["home"] - car) * 4 / 3 + car
    plain = home_spread(days, ["car"])
    weighted = home_spread(days, ["car"], date(2026, 10, 10))
    assert weighted["all"]["days"] == plain["all"]["days"] == 50
    assert weighted["all"]["high"] > plain["all"]["high"]


def statistics_days(first: date, count: int, ratio: float) -> dict[str, dict[str, Any]]:
    """Past days whose forecast came from long-term statistics: a daily sum,
    no rain and no forecast hours."""
    days = {}
    for offset in range(count):
        day = first + timedelta(days=offset)
        hours = [
            {
                "start": f"{day.isoformat()}T{h:02d}:00:00+02:00",
                "src": "stats",
                "cov": 1.0,
                "solar": 20.0 * ratio / 10 if 7 <= h < 17 else 0.0,
            }
            for h in range(24)
        ]
        days[day.isoformat()] = {
            "hours": hours,
            "fc": {"ahead_kwh": 20.0, "from": "statistics"},
        }
    return days


def test_days_from_statistics_teach_the_weather_classes() -> None:
    days = statistics_days(date(2025, 10, 1), 5, 0.8)
    # A day with a gap in its hours says nothing.
    days["2025-10-03"]["hours"][12]["cov"] = 0.5
    ratios = solar_ratios(days)
    assert [r["date"] for r in ratios] == [
        "2025-10-01",
        "2025-10-02",
        "2025-10-04",
        "2025-10-05",
    ]
    assert all(r["ratio"] == 0.8 and r["rain"] is False for r in ratios)
    solar = solar_classes(ratios, date(2026, 10, 24))
    assert solar["classes"]["clear"] == {"factor": 0.8, "days": 4}


async def test_the_learner_learns_the_weather_from_last_year(
    hass: HomeAssistant, freezer
) -> None:
    await hass.config.async_set_time_zone("Europe/Berlin")
    freezer.move_to("2026-10-24T08:00:00+02:00")
    store = HistoryStore(hass)
    await store.async_load()
    # Last October from statistics, long before the 60 days of the other models.
    for day, data in statistics_days(date(2025, 10, 10), 6, 0.7).items():
        await store.async_put_hours(data["hours"])
        await store.async_update_day(day, fc=data["fc"])
    holder = {"config": model.default_config()}

    def update(patch: dict[str, Any], source: str) -> None:
        holder["config"] = model.apply_update(holder["config"], patch, source)

    learner = JoeLearner(hass, store, lambda: holder["config"], update, lambda: None)
    await learner.async_start()
    learned = holder["config"]["learned"]
    assert learned["solar_classes"]["classes"]["clear"] == {"factor": 0.7, "days": 6}
    assert learned["solar_spread"]["all"]["days"] == 6
    await learner.async_stop()
    await store.async_unload()
