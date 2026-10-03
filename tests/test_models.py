"""Joe's explainable models on made-up days."""

from __future__ import annotations

from datetime import date, datetime, timedelta
import math
import random
from typing import Any

import pytest

from custom_components.energy_joe.learn.models import (
    battery_model,
    class_factor,
    combined_forecast,
    consumption_model,
    daily_rows,
    expected,
    group_models,
    hot_water_model,
    presence_by_label,
    solar_classes,
    source_quality,
    surprises,
)


def made_up_days(count: int = 30, seed: int = 3) -> dict[str, dict[str, Any]]:
    """Consumption = 6 kWh + 2 on working days + 0.5 per degree below 15 °C."""
    rng = random.Random(seed)
    days = {}
    for offset in range(count):
        day = date(2026, 9, 1) + timedelta(days=offset)
        workday = day.weekday() < 5
        temp = 5 + 12 * rng.random()
        total = 6 + (2 if workday else 0) + 0.5 * max(0, 15 - temp)
        heat_pump = 0.4 * max(0, 15 - temp)
        hours = []
        for h in range(24):
            hours.append(
                {
                    "start": f"{day.isoformat()}T{h:02d}:00:00+02:00",
                    "cov": 1.0,
                    "home": total / 24,
                    "temp": temp,
                    "use": {"hp": heat_pump / 24},
                    "present": {
                        "anna": 1.0 if h < 8 or h >= 17 or not workday else 0.0
                    },
                }
            )
        days[day.isoformat()] = {
            "hours": hours,
            "workday": workday,
            "labels": {"anna": "office" if workday else "home"},
        }
    return days


def test_consumption_follows_the_temperature() -> None:
    rows = daily_rows(made_up_days())
    model = consumption_model(rows)
    assert model is not None
    assert model["base"] == pytest.approx(6, abs=0.3)
    assert model["workday"] == pytest.approx(2, abs=0.3)
    assert model["heat"] == pytest.approx(0.5, abs=0.05)
    assert model["r2"] > 0.95
    assert expected(model, True, 5.0, None) == pytest.approx(13, abs=0.6)


def test_consumers_get_their_own_model() -> None:
    rows = daily_rows(made_up_days())
    groups = group_models(rows, [{"id": "hp", "kind": "heat_pump"}])
    assert groups["hp"]["heat"] == pytest.approx(0.4, abs=0.05)


def test_too_few_days_give_no_model() -> None:
    assert consumption_model(daily_rows(made_up_days(10))) is None


def test_battery_size_and_efficiency() -> None:
    """10 kWh, 90 % round trip: each day charged, discharged and a level change."""
    rng = random.Random(5)
    days = {}
    soc = 50.0
    for offset in range(20):
        day = date(2026, 9, 1) + timedelta(days=offset)
        charged = 4 + 3 * rng.random()
        change = rng.uniform(-20, 20)
        discharged = 0.9 * charged - 10 * math.sqrt(0.9) * change / 100
        hours = [
            {
                "start": f"{day}T{h:02d}:00:00+02:00",
                "cov": 1.0,
                "home": 0.5,
                "bat": {
                    "b": {
                        "in": charged / 24,
                        "out": discharged / 24,
                        # Read at the end of the hour.
                        "soc": soc + change * (h + 1) / 24,
                    }
                },
            }
            for h in range(24)
        ]
        soc = soc + change
        days[day.isoformat()] = {"hours": hours}
    model = battery_model(days, "b")
    assert model is not None
    assert model["efficiency"] == pytest.approx(0.9, abs=0.01)
    assert model["capacity_kwh"] == pytest.approx(10, abs=0.1)


def test_solar_factor_per_weather() -> None:
    ratios = [
        {"date": f"2026-09-{index + 1:02d}", "forecast": f, "ratio": r}
        for index, (f, r) in enumerate(
            (
                (30, 0.95),
                (28, 0.9),
                (31, 0.92),
                (15, 0.8),
                (14, 0.75),
                (16, 0.85),
                (5, 0.5),
                (4, 0.6),
                (6, 0.55),
            )
        )
    ]
    solar = solar_classes(ratios)
    classes = solar["classes"]
    assert classes["clear"]["factor"] == 0.92
    assert classes["mixed"]["factor"] == 0.8
    assert classes["overcast"]["factor"] == 0.55
    assert solar["top"] == 31
    assert class_factor(solar, 25) == ("clear", 0.92)
    assert class_factor(solar, 3) == ("overcast", 0.55)
    assert class_factor({}, 25) is None


def test_weather_classes_follow_the_season() -> None:
    """In autumn a 12 kWh day is clear, even if August brought 40 kWh."""
    ratios = [
        {"date": "2026-08-01", "forecast": 40, "ratio": 1.0},
        *(
            {"date": f"2026-10-{day:02d}", "forecast": 12, "ratio": 0.9}
            for day in range(1, 5)
        ),
    ]
    solar = solar_classes(ratios)
    assert solar["classes"]["clear"]["days"] == 5
    assert solar["top"] == 12


def test_forecast_sources_are_combined_by_how_well_they_fit() -> None:
    """The main forecast is 20 % too high and steady, the other one right but erratic."""
    rng = random.Random(7)
    days = {}
    for offset in range(20):
        day = date(2026, 9, 1) + timedelta(days=offset)
        actual = 10 + 10 * rng.random()
        days[day.isoformat()] = {
            "hours": [
                {
                    "start": f"{day}T{h:02d}:00:00+02:00",
                    "cov": 1.0,
                    "solar": actual / 24,
                }
                for h in range(24)
            ],
            "fc": {
                "ahead_kwh": actual * 1.25,
                "alt": {"solcast": actual * rng.uniform(0.6, 1.4)},
            },
        }
    quality = source_quality(days, ["solcast"])
    assert quality["main"]["factor"] == pytest.approx(0.8, abs=0.01)
    assert quality["main"]["error"] < 0.01
    assert quality["solcast"]["error"] > 0.1
    # The steady source counts most: 25 kWh main forecast means about 20 kWh,
    # the erratic 30 kWh pulls only a little.
    combined = combined_forecast(quality, {"main": 25.0, "solcast": 30.0})
    assert 20 < combined < 21.5
    assert combined_forecast(quality, {"main": 25.0, "solcast": None}) is None


def test_hot_water_rates_from_its_curve() -> None:
    """Heated at night (8 K/h), 0.3 K/h standing loss, 12 K used every day."""
    series = []
    temp = 50.0
    start = datetime(2026, 9, 1)
    for hour in range(24 * 7):
        moment = start + timedelta(hours=hour)
        if moment.hour in (2, 3):
            temp += 8
        elif moment.hour < 5:
            temp -= 0.3
        elif 6 <= moment.hour < 23:
            temp -= 12 / 17 + 0.3
        series.append((moment, temp))
    model = hot_water_model(series)
    assert model is not None
    assert model["rate_k_per_h"] == pytest.approx(8, abs=0.1)
    assert model["loss_k_per_h"] == pytest.approx(0.3, abs=0.05)
    assert model["demand_k"] == pytest.approx(12, abs=1.0)


def test_presence_per_calendar_label() -> None:
    presence = presence_by_label(made_up_days(), ["anna"])
    assert presence["anna"]["office"]["hours"] == 15
    assert presence["anna"]["home"]["hours"] == 24


def test_odd_days_are_worth_a_question() -> None:
    days = made_up_days()
    last = sorted(days)[-1]
    for hour in days[last]["hours"]:
        hour["home"] *= 2.5
    rows = daily_rows(days)
    model = consumption_model(rows)
    questions = surprises(rows, model, set())
    assert questions[-1]["date"] == last
    assert questions[-1]["kind"] == "more"
    assert surprises(rows, model, {last}) == []
