"""The daily model pass and how the plan uses what Joe learned."""

from __future__ import annotations

from datetime import date, datetime, time, timedelta
from typing import Any

import pytest

from custom_components.energy_joe import model
from custom_components.energy_joe.learn.learner import JoeLearner
from custom_components.energy_joe.observe.store import HistoryStore
from custom_components.energy_joe.plan.inputs import async_build_input, async_tomorrow
from homeassistant.core import HomeAssistant, ServiceCall, SupportsResponse
from homeassistant.util import dt as dt_util
from tests.test_models import made_up_days, run_days


@pytest.fixture(autouse=True)
def berlin(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


def office_calendar(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Anna's calendar: "Büro" on working days, nothing on weekends."""
    calls: list[dict[str, Any]] = []

    def events(call: ServiceCall) -> dict[str, Any]:
        calls.append(dict(call.data))
        start = dt_util.parse_datetime(call.data["start_date_time"])
        found = []
        if start is not None and start.weekday() < 5:
            found.append(
                {
                    "summary": "Büro",
                    "start": f"{start.date()}T08:00:00+02:00",
                    "end": f"{start.date()}T17:00:00+02:00",
                }
            )
        return {"calendar.anna": {"events": found}}

    hass.services.async_register(
        "calendar", "get_events", events, supports_response=SupportsResponse.ONLY
    )
    return calls


def weather(hass: HomeAssistant, temperature: float, low: float) -> None:
    def forecasts(call: ServiceCall) -> dict[str, Any]:
        tomorrow = dt_util.now().date() + timedelta(days=1)
        return {
            "weather.home": {
                "forecast": [
                    {
                        "datetime": f"{tomorrow}T12:00:00+02:00",
                        "temperature": temperature,
                        "templow": low,
                    }
                ]
            }
        }

    hass.services.async_register(
        "weather", "get_forecasts", forecasts, supports_response=SupportsResponse.ONLY
    )


def household() -> dict[str, Any]:
    return model.validate(
        {
            "version": model.CONFIG_VERSION,
            "persons": [
                {
                    "id": "anna",
                    "name": "Anna",
                    "person_entity": "person.anna",
                    "calendars": ["calendar.anna"],
                }
            ],
            "consumers": [
                {
                    "id": "hp",
                    "name": "Wärmepumpe",
                    "kind": "heat_pump",
                    "energy_entity": "sensor.hp_energy",
                }
            ],
            "context": {"weather_entity": "weather.home"},
        }
    )


async def test_learner_builds_models_and_asks(hass: HomeAssistant, freezer) -> None:
    await hass.config.async_set_time_zone("Europe/Berlin")
    freezer.move_to("2026-10-01T08:00:00+02:00")
    calls = office_calendar(hass)
    store = HistoryStore(hass)
    await store.async_load()
    days = made_up_days()
    last = sorted(days)[-1]
    for hour in days[last]["hours"]:
        hour["home"] *= 2.5
    for day, data in days.items():
        await store.async_put_hours(data["hours"])
        await store.async_update_day(day, workday=data["workday"])
    holder = {"config": household()}

    def update(patch: dict[str, Any], source: str) -> None:
        holder["config"] = model.apply_update(holder["config"], patch, source)

    learner = JoeLearner(hass, store, lambda: holder["config"], update, lambda: None)
    await learner.async_start()
    learned = holder["config"]["learned"]
    assert learned["models_day"] == "2026-10-01"
    # The odd day still pulls the model a little.
    assert learned["consumption_model"]["r2"] < 0.9
    assert learned["group_models"]["hp"]["heat"] == pytest.approx(0.4, abs=0.05)
    # The calendar was asked once per day and the labels are kept with the days.
    assert len(calls) == 30
    assert (await store.async_day("2026-09-01"))["labels"] == {"anna": "office"}
    assert (await store.async_day("2026-09-05"))["labels"] == {"anna": "home"}
    assert learned["presence"]["anna"]["office"]["hours"] == 15
    assert model.source_of(holder["config"], "learned.consumption_model") == "learned"
    # The odd last day is a question; once answered it is gone.
    assert [q["date"] for q in learner.questions] == [last]
    await learner.async_answer(last, "guests")
    assert learner.questions == []
    assert (await store.async_day(last))["answer"] == "guests"
    assert holder["config"]["learned"]["models_day"] is None
    await learner.async_run()
    assert len(calls) == 30
    assert learner.questions == []
    # Without the day of the guests the model fits again.
    learned = holder["config"]["learned"]
    assert learned["consumption_model"]["heat"] == pytest.approx(0.5, abs=0.05)
    assert learned["consumption_model"]["r2"] > 0.95

    # Forgetting one area keeps the others.
    await learner.async_reset("consumption")
    learned = holder["config"]["learned"]
    assert learned["consumption_model"] is None and learned["presence"] == {}
    assert "consumption" in learned["reset"]
    await learner.async_run()
    learned = holder["config"]["learned"]
    assert learned["consumption_model"] is None
    await learner.async_stop()
    await store.async_unload()


def learned_household() -> dict[str, Any]:
    config = household()
    return model.apply_update(
        config,
        {
            "learned": {
                "consumption_model": {
                    "base": 6.0,
                    "workday": 2.0,
                    "heat": 0.5,
                    "cool": 0.0,
                    "presence": None,
                    "presence_mean": None,
                    "r2": 0.9,
                    "days": 30,
                },
                "presence": {"anna": {"office": {"hours": 15, "days": 20}}},
                "solar_classes": {
                    "classes": {
                        "clear": {"factor": 0.9, "days": 8},
                        "overcast": {"factor": 0.6, "days": 5},
                    },
                    "top": 20.0,
                    "days": 20,
                },
            }
        },
        "learned",
    )


async def test_tomorrow_as_the_models_see_it(hass: HomeAssistant, freezer) -> None:
    """A cold working day at the office, with little sun."""
    await hass.config.async_set_time_zone("Europe/Berlin")
    freezer.move_to("2026-10-05T21:00:00+02:00")
    office_calendar(hass)
    weather(hass, 7.0, 1.0)
    store = HistoryStore(hass)
    await store.async_load()
    tomorrow = date(2026, 10, 6)
    await store.async_update_day(tomorrow.isoformat(), fc={"ahead_kwh": 4.0})
    outlook = await async_tomorrow(
        hass, learned_household(), store, tomorrow, True, 9.0, 3.8
    )
    meta = outlook["meta"]
    # 6 + 2 + 0.5 * (15 - 4) = 13.5 kWh against an average day of 9 kWh.
    assert meta["temp"] == 4.0
    assert meta["labels"] == {"anna": "office"}
    assert meta["presence"] == 15
    assert meta["expected_kwh"] == 13.5
    assert outlook["scale"] == 1.5
    # 4 kWh against a recent best of 20: an overcast day.
    assert meta["weather"] == "overcast"
    assert outlook["solar_factor"] == 0.6 and meta["solar_source"] == "weather"

    # A second forecast source that Joe trusts more moves the sun.
    config = model.apply_update(
        learned_household(),
        {
            "forecast": {
                "alternatives": [
                    {"id": "solcast", "name": "Solcast", "tomorrow": ["sensor.s"]}
                ]
            },
            "learned": {
                "sources": {
                    "main": {"factor": 0.8, "error": 0.3, "days": 20},
                    "solcast": {"factor": 1.0, "error": 0.1, "days": 20},
                }
            },
        },
        "user",
    )
    await store.async_update_day(tomorrow.isoformat(), fc={"alt": {"solcast": 6.0}})
    outlook = await async_tomorrow(hass, config, store, tomorrow, True, 9.0, 3.8)
    meta = outlook["meta"]
    assert meta["solar_source"] == "combined"
    assert meta["solar_combined"] == pytest.approx(
        (4 * 0.8 / 0.09 + 6 / 0.01) / 111.11, abs=0.05
    )
    assert outlook["solar_factor"] == pytest.approx(
        meta["solar_combined"] / 4, abs=0.01
    )
    await store.async_unload()


def battery_household() -> dict[str, Any]:
    """One 10 kWh battery Joe only watches, and a cheap window at night."""
    return model.apply_update(
        model.default_config(),
        {
            "batteries": {
                "b1": {
                    "name": "Speicher",
                    "adapter": "none",
                    "soc_entity": "sensor.soc",
                    "capacity_kwh": 10.0,
                }
            },
            "tariff": {
                "kind": "fixed_window",
                "window": {"start": "00:00", "end": "05:00"},
            },
        },
        "read",
    )


async def test_the_plan_keeps_the_nominal_battery_size(
    hass: HomeAssistant, freezer
) -> None:
    """The plan takes the efficiency Joe learned, never a learned or measured size."""
    await hass.config.async_set_time_zone("Europe/Berlin")
    freezer.move_to("2026-10-05T21:00:00+02:00")
    hass.states.async_set("sensor.soc", "40", {"unit_of_measurement": "%"})
    store = HistoryStore(hass)
    await store.async_load()
    config = model.apply_update(
        battery_household(),
        {
            "learned": {
                "battery_models": {
                    "b1": {
                        "capacity_kwh": 6.5,
                        "efficiency": 0.86,
                        "days": 20,
                        "converter": None,
                        "measured_kwh": 9.5,
                        "runs": 12,
                    }
                }
            }
        },
        "learned",
    )
    inp, _ = await async_build_input(hass, config, store, dt_util.now())
    assert inp is not None
    assert inp.batteries[0].capacity == 10.0
    assert inp.efficiency == 0.86
    # The size may come from the device instead of the user.
    hass.states.async_set("sensor.capacity", "9800", {"unit_of_measurement": "Wh"})
    device = model.apply_update(
        config,
        {
            "batteries": {
                "b1": {"capacity_kwh": None, "capacity_entity": "sensor.capacity"}
            }
        },
        "read",
    )
    inp, _ = await async_build_input(hass, device, store, dt_util.now())
    assert inp.batteries[0].capacity == 9.8
    # Runs alone give no efficiency: Joe assumes 90 %.
    runs_only = model.apply_update(
        config,
        {
            "learned": {
                "battery_models": {
                    "b1": {"converter": None, "measured_kwh": 9.5, "runs": 4}
                }
            }
        },
        "learned",
    )
    inp, _ = await async_build_input(hass, runs_only, store, dt_util.now())
    assert inp.batteries[0].capacity == 10.0
    assert inp.efficiency == 0.9
    # Nobody could size the battery: the measured size stands in.
    unsized = model.apply_update(
        runs_only,
        {"batteries": {"b1": {"capacity_kwh": None, "capacity_entity": None}}},
        "read",
    )
    inp, notes = await async_build_input(hass, unsized, store, dt_util.now())
    assert inp.batteries[0].capacity == 9.5
    assert "capacity_unknown" not in notes
    await store.async_unload()


async def test_the_learner_measures_the_battery_from_runs(
    hass: HomeAssistant, freezer
) -> None:
    """A few days of charge and discharge runs: too few for the day fit, enough
    to measure the size, which is kept beside the day fit's values."""
    await hass.config.async_set_time_zone("Europe/Berlin")
    freezer.move_to("2026-09-08T08:00:00+02:00")
    store = HistoryStore(hass)
    await store.async_load()
    for data in run_days(5, battery_id="b1").values():
        await store.async_put_hours(data["hours"])
    holder = {"config": battery_household()}

    def update(patch: dict[str, Any], source: str) -> None:
        holder["config"] = model.apply_update(holder["config"], patch, source)

    learner = JoeLearner(hass, store, lambda: holder["config"], update, lambda: None)
    await learner.async_start()
    found = holder["config"]["learned"]["battery_models"]["b1"]
    assert found["runs"] == 10
    assert found["measured_kwh"] == pytest.approx(10, abs=0.5)
    assert found["converter"] is None
    assert "capacity_kwh" not in found
    await learner.async_stop()
    await store.async_unload()


async def test_calendar_rules_pick_the_kind_of_day(hass: HomeAssistant) -> None:
    """All-day events first, "Homeoffice" is not the office, no event: the default."""
    from custom_components.energy_joe.learn.context import async_day_labels

    found: dict[str, list[dict[str, Any]]] = {}

    def events(call: ServiceCall) -> dict[str, Any]:
        return {"calendar.anna": {"events": found.get("anna", [])}}

    hass.services.async_register(
        "calendar", "get_events", events, supports_response=SupportsResponse.ONLY
    )
    config = household()
    day = date(2026, 10, 6)
    found["anna"] = [
        {"summary": "Teammeeting Büro", "start": "2026-10-06T09:00:00+02:00"},
        {"summary": "Urlaub Ostsee", "start": "2026-10-06"},
    ]
    assert await async_day_labels(hass, config, day, True) == {"anna": "vacation"}
    found["anna"] = [{"summary": "Homeoffice", "start": "2026-10-06T08:00:00+02:00"}]
    assert await async_day_labels(hass, config, day, True) == {"anna": "home_office"}
    found["anna"] = [{"summary": "Zahnarzt", "start": "2026-10-06T08:00:00+02:00"}]
    assert await async_day_labels(hass, config, day, True) == {"anna": "home_office"}
    assert await async_day_labels(hass, config, day, False) == {"anna": "home"}


async def test_a_person_may_have_calendar_rules_of_their_own(
    hass: HomeAssistant,
) -> None:
    """Own rules and defaults replace the shared ones for that person only."""
    from custom_components.energy_joe import model
    from custom_components.energy_joe.learn.context import async_day_labels

    def events(call: ServiceCall) -> dict[str, Any]:
        return {
            entity: {"events": [{"summary": "Schicht", "start": "2026-10-06"}]}
            for entity in call.data["entity_id"]
        }

    hass.services.async_register(
        "calendar", "get_events", events, supports_response=SupportsResponse.ONLY
    )
    config = household()
    config["persons"].append(
        model.PERSON({"id": "ben", "name": "Ben", "calendars": ["calendar.ben"]})
    )
    day = date(2026, 10, 6)
    assert await async_day_labels(hass, config, day, True) == {
        "anna": "home_office",
        "ben": "home_office",
    }
    config["persons"][1] = model.PERSON(
        {
            **config["persons"][1],
            "calendar": {
                "rules": [{"keyword": "schicht", "label": "office"}],
                "default_day_off": "travel",
            },
        }
    )
    assert config["persons"][0]["calendar"] is None
    assert await async_day_labels(hass, config, day, True) == {
        "anna": "home_office",
        "ben": "office",
    }
    config["persons"][1]["calendars"] = []
    assert (await async_day_labels(hass, config, day, False))["ben"] == "travel"


def test_last_winter_still_teaches_the_heating() -> None:
    """Summer days alone say nothing about heating; last winter's days do."""
    from custom_components.energy_joe.learn.models import DayRow, consumption_model

    today = date(2026, 7, 1)
    rows = []
    for back in range(40):
        rows.append(
            DayRow(
                date=(today - timedelta(days=back)).isoformat(),
                home=8.0 + (back % 3) * 0.2,
                workday=back % 7 < 5,
                temp=20.0 + back % 4,
                presence=None,
                use={},
                excluded=False,
            )
        )
    for back in range(200, 260):
        temp = -2.0 + back % 9
        rows.append(
            DayRow(
                date=(today - timedelta(days=back)).isoformat(),
                home=8.0 + 0.6 * max(0.0, 15.0 - temp),
                workday=back % 7 < 5,
                temp=temp,
                presence=None,
                use={},
                excluded=False,
            )
        )
    found = consumption_model(rows)
    assert found is not None
    assert found["heat"] == pytest.approx(0.6, abs=0.1)
    assert found["base"] == pytest.approx(8.2, abs=0.5)


async def put_home_days(
    store: HistoryStore, first: date, count: int, home: float
) -> None:
    zone = dt_util.get_default_time_zone()
    records = []
    for offset in range(count):
        day = first + timedelta(days=offset)
        records.extend(
            {
                "start": datetime.combine(day, time(hour), tzinfo=zone).isoformat(),
                "src": "stats",
                "cov": 1.0,
                "home": home,
            }
            for hour in range(24)
        )
    await store.async_put_hours(records)


async def test_the_profile_adds_the_same_weeks_of_earlier_years(
    hass: HomeAssistant,
) -> None:
    from custom_components.energy_joe.plan.inputs import async_consumption

    store = HistoryStore(hass)
    await store.async_load()
    today = date(2026, 10, 24)
    await put_home_days(store, today - timedelta(days=28), 28, 1.0)
    # Without earlier years the profile stays as it was.
    profiles, meta = await async_consumption(store, today)
    assert meta == {"source": "history", "days": 28}
    assert profiles[True][12] == pytest.approx(1.0)
    # Last year's weeks around the date count half, the rest of last year not.
    await put_home_days(store, date(2025, 10, 10), 29, 2.0)
    await put_home_days(store, date(2025, 12, 1), 10, 9.0)
    profiles, meta = await async_consumption(store, today)
    assert meta == {"source": "history", "days": 57, "years": 29}

    def kinds(first: date, count: int) -> dict[bool, int]:
        found = [(first + timedelta(days=d)).weekday() < 5 for d in range(count)]
        return {kind: found.count(kind) for kind in (True, False)}

    recent = kinds(today - timedelta(days=28), 28)
    last_year = kinds(date(2025, 10, 10), 29)
    for kind in (True, False):
        # Weighted mean per kind of day: last year's 2 kWh at half weight.
        expected = (recent[kind] + 0.5 * 2.0 * last_year[kind]) / (
            recent[kind] + 0.5 * last_year[kind]
        )
        assert profiles[kind][12] == pytest.approx(expected)
    # Two years back as well.
    await put_home_days(store, date(2024, 10, 10), 29, 2.0)
    profiles, meta = await async_consumption(store, today)
    assert meta["years"] == 58
    two_years = kinds(date(2024, 10, 10), 29)
    earlier = last_year[True] + two_years[True]
    assert profiles[True][12] == pytest.approx(
        (recent[True] + earlier) / (recent[True] + 0.5 * earlier)
    )
    await store.async_unload()


def test_profile_weights_per_day() -> None:
    from custom_components.energy_joe.plan.inputs import consumption_profiles

    def day(home: float) -> dict[str, Any]:
        return {
            "workday": True,
            "hours": [
                {"start": f"2026-10-01T{h:02d}:00:00+02:00", "cov": 1.0, "home": home}
                for h in range(24)
            ],
        }

    days = {"2026-10-01": day(1.0), "2026-10-02": day(1.0), "2025-10-01": day(4.0)}
    plain, meta = consumption_profiles(days)
    assert plain[True][8] == pytest.approx(2.0)
    assert meta == {"source": "history", "days": 3}
    weighted, meta = consumption_profiles(days, [], {"2025-10-01": 0.5})
    assert weighted[True][8] == pytest.approx((1 + 1 + 0.5 * 4) / 2.5)
    assert meta == {"source": "history", "days": 3, "years": 1}
