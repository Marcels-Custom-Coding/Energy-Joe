"""The night planned against an uncertain tomorrow: bad, typical and good day."""

from __future__ import annotations

from dataclasses import replace

import pytest

from custom_components.energy_joe import model
from custom_components.energy_joe.observe.store import HistoryStore
from custom_components.energy_joe.plan.inputs import (
    HOME_SPREAD,
    SOLAR_SPREAD,
    async_build_input,
    pick_spread,
)
from custom_components.energy_joe.plan.planner import (
    Prices,
    Scenario,
    make_plan,
    make_scenarios,
    scenario_weights,
    simulate,
)
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from tests.test_plan import OCTOPUS, plan_input

# A cheap night and a good feed-in: too little costs far more than too much.
CHEAP_NIGHT = Prices(night=0.12, day=0.30, feed_in=0.08)
WIDE = ((0.3, 1.2), (0.9, 1.15))


@pytest.fixture(autouse=True)
def berlin(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


def sunny(caution: str, **changes):
    """A day whose typical sun fills the battery, with a wide spread."""
    return plan_input(
        solar=20,
        soc=15,
        prices=CHEAP_NIGHT,
        scenarios=make_scenarios(caution, *WIDE),
        caution=caution,
        **changes,
    )


def test_weights_follow_the_caution() -> None:
    assert scenario_weights("balanced") == pytest.approx(
        {"bad": 0.4, "typical": 0.4, "good": 0.2}
    )
    assert scenario_weights("bold") == pytest.approx(
        {"bad": 0.15, "typical": 0.5, "good": 0.35}
    )
    assert scenario_weights("cautious") == pytest.approx(
        {"bad": 0.65, "typical": 0.3, "good": 0.05}
    )
    for caution in model.NIGHT_CAUTIONS:
        assert sum(scenario_weights(caution).values()) == pytest.approx(1.0)
    # Unknown: the default, brave.
    assert scenario_weights(None) == scenario_weights("brave")


def test_without_scenarios_the_plan_stays_as_it_was() -> None:
    plain = make_plan(plan_input(solar=3, soc=20))
    assert plain["risk"] is None
    assert plain["rules"]["night_caution"] == "brave"
    assert plain["kind"] == "charge" and plain["target"] > 20
    # Only the typical day, weighted fully: the same plan.
    only = make_plan(plan_input(solar=3, soc=20, scenarios=[Scenario("typical", 1)]))
    for key in ("kind", "target", "optimum", "cost", "hours", "batteries"):
        assert only[key] == plain[key], key
    assert only["risk"]["typical_target"] == plain["target"]
    assert "caution" not in only["reasons"]


def test_an_uncertain_sunny_day_charges_fuller() -> None:
    inp = sunny("balanced")
    plan = make_plan(inp)
    risk = plan["risk"]
    typical = risk["typical_target"]
    assert plan["target"] > typical
    assert "caution" in plan["reasons"]
    capacity = inp.capacity
    # With the typical target the sun fills the battery on the typical day,
    # on the bad day it is empty in the evening.
    evening = next(
        i
        for i, h in enumerate(inp.hours)
        if h.start >= inp.window_end and dt_util.as_local(h.start).hour == 18
    )
    usual = simulate(inp, capacity * typical / 100)
    assert max(usual.soc) > 99
    bad = replace(
        inp,
        hours=[
            replace(h, solar=h.solar * 0.3, home=h.home * 1.15)
            if h.start >= inp.window_end
            else h
            for h in inp.hours
        ],
    )
    assert simulate(bad, capacity * typical / 100).soc[evening] <= 10.5
    # Charging fuller is dearer on the typical day, cheaper on the bad one.
    assert (
        risk["scenarios"]["typical"]["cost"]
        > risk["scenarios"]["typical"]["cost_typical"]
    )
    assert risk["scenarios"]["bad"]["cost"] < risk["scenarios"]["bad"]["cost_typical"]
    # The shown hours are those of the typical day.
    assert plan["solar_kwh"] == risk["scenarios"]["typical"]["solar_kwh"]


def test_bolder_charges_less() -> None:
    for solar, prices in ((20, CHEAP_NIGHT), (10, OCTOPUS)):
        targets = [
            make_plan(
                plan_input(
                    solar=solar,
                    soc=15,
                    prices=prices,
                    scenarios=make_scenarios(caution, *WIDE),
                    caution=caution,
                )
            )["target"]
            for caution in model.NIGHT_CAUTIONS
        ]
        assert targets == sorted(targets), (solar, targets)
        assert targets[0] < targets[-1]


def test_the_risk_shows_what_was_weighed() -> None:
    plan = make_plan(sunny("balanced", spread={"class": "rain", "days": {"solar": 12}}))
    risk = plan["risk"]
    assert set(risk) == {
        "caution",
        "weights",
        "class",
        "typical_target",
        "scenarios",
        "days",
    }
    assert risk["caution"] == "balanced"
    assert risk["weights"] == {"bad": 0.4, "typical": 0.4, "good": 0.2}
    assert risk["class"] == "rain"
    assert risk["days"] == {"solar": 12, "home": 0}
    assert set(risk["scenarios"]) == {"bad", "typical", "good"}
    for values in risk["scenarios"].values():
        assert set(values) == {"solar_kwh", "home_kwh", "cost", "cost_typical"}
    bad, typical, good = (risk["scenarios"][k] for k in ("bad", "typical", "good"))
    assert typical["solar_kwh"] == pytest.approx(20, abs=0.01)
    assert bad["solar_kwh"] == pytest.approx(6, abs=0.01)
    assert good["solar_kwh"] == pytest.approx(24, abs=0.01)
    assert bad["home_kwh"] > typical["home_kwh"] > good["home_kwh"]
    assert plan["rules"]["night_caution"] == "balanced"


def test_the_spread_groups() -> None:
    learned = {
        "solar_spread": {
            "rain": {"low": 0.4, "high": 1.1, "days": 9},
            "mixed": {"low": 0.5, "high": 1.3, "days": 14},
            "all": {"low": 0.55, "high": 1.25, "days": 60},
        },
        "home_spread": {
            "cold": {"low": 0.85, "high": 1.2, "days": 20},
            "all": {"low": 0.9, "high": 1.1, "days": 60},
        },
    }
    rainy = pick_spread(learned, "mixed", True, 5.0)
    assert rainy["solar"] == (0.4, 1.1) and rainy["class"] == "rain"
    assert rainy["home"] == (0.85, 1.2)
    assert rainy["groups"] == {"solar": "rain", "home": "cold"}
    assert rainy["days"] == {"solar": 9, "home": 20}
    # Dry and mild: the weather class, the use of all days.
    dry = pick_spread(learned, "mixed", False, 15.0)
    assert dry["solar"] == (0.5, 1.3) and dry["class"] == "mixed"
    assert dry["home"] == (0.9, 1.1) and dry["groups"]["home"] == "all"
    # An unknown class: all days, shown without a class.
    clear = pick_spread(learned, "clear", False, None)
    assert clear["solar"] == (0.55, 1.25) and clear["class"] is None
    # Nothing learned: Joe's assumptions.
    for nothing in ({}, {"solar_spread": {}, "home_spread": {}}):
        found = pick_spread(nothing, "mixed", True, 5.0)
        assert found["solar"] == SOLAR_SPREAD and found["home"] == HOME_SPREAD
        assert found["class"] is None
        assert found["days"] == {"solar": 0, "home": 0}


def household(buffer_source: str | None = None) -> dict:
    config = model.apply_update(
        model.default_config(),
        {
            "tariff": {
                "kind": "fixed_window",
                "window": {"start": "00:00", "end": "05:00"},
            },
            "batteries": {
                "b1": {
                    "name": "Speicher",
                    "adapter": "none",
                    "soc_entity": "sensor.soc",
                    "capacity_kwh": 10.0,
                }
            },
            "rules": {"night_caution": "careful"},
        },
        "user",
    )
    if buffer_source:
        config = model.apply_update(
            config, {"rules": {"buffer_factor": 0.6}}, buffer_source
        )
    return config


async def test_inputs_build_the_scenarios(hass: HomeAssistant, freezer) -> None:
    await hass.config.async_set_time_zone("Europe/Berlin")
    freezer.move_to("2026-10-04T20:05:00+02:00")
    hass.states.async_set("sensor.soc", "40", {"unit_of_measurement": "%"})
    store = HistoryStore(hass)
    await store.async_load()
    inp, notes = await async_build_input(hass, household(), store, dt_util.now())
    assert inp is not None, notes
    assert inp.caution == "careful"
    names = [(s.name, s.solar, s.home) for s in inp.scenarios]
    assert names == [
        ("bad", SOLAR_SPREAD[0], HOME_SPREAD[1]),
        ("typical", 1.0, 1.0),
        ("good", SOLAR_SPREAD[1], HOME_SPREAD[0]),
    ]
    assert [s.weight for s in inp.scenarios] == pytest.approx([0.525, 0.35, 0.125])
    assert inp.meta["tomorrow"]["spread"]["days"] == {"solar": 0, "home": 0}
    assert inp.spread["class"] is None
    # Joe's own buffer gave way to the scenarios.
    assert inp.buffer == 0.0
    plan = make_plan(inp)
    assert plan["risk"]["caution"] == "careful"

    # A learned buffer is left out, the owner's stays.
    inp, _ = await async_build_input(hass, household("learned"), store, dt_util.now())
    assert inp is not None and inp.buffer == 0.0
    inp, _ = await async_build_input(hass, household("user"), store, dt_util.now())
    assert inp is not None and inp.buffer == 0.6
    await store.async_unload()


def test_the_owners_buffer_still_applies() -> None:
    plain = make_plan(
        plan_input(solar=8, soc=15, scenarios=make_scenarios("bold", *WIDE))
    )
    buffered = make_plan(
        plan_input(solar=8, soc=15, buffer=0.5, scenarios=make_scenarios("bold", *WIDE))
    )
    assert buffered["target"] == min(
        100, round(plain["optimum"] + 0.5 * (plain["optimum"] - 10))
    )
