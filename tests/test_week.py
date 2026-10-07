"""Weekly profiles of air conditioners and a thermostat's own profiles."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

import pytest
import voluptuous as vol

from custom_components.energy_joe import model
from custom_components.energy_joe.control import climate as climate_module, week
from custom_components.energy_joe.control.climate import ClimateController
from homeassistant.core import HomeAssistant, ServiceCall, SupportsResponse
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.util import dt as dt_util

AC = "climate.buero"
HMIP = "climate.wohnzimmer"
# 2026-10-07 is a Wednesday.
WEDNESDAY = "2026-10-07"


def profile(*points: list[Any], tags: tuple[str, ...] = (), name: str = "") -> dict:
    """A profile with one curve for all days."""
    return {"name": name, "tags": list(tags), "split": "all", "curves": [list(points)]}


def six(*first: dict) -> list[dict]:
    """Six profiles: the ones given, the rest at 21 °C all day."""
    return [*first, *(profile([0, 21.0]) for _ in range(6 - len(first)))]


# --- the plain logic ------------------------------------------------------------


def test_the_value_of_a_curve_by_time() -> None:
    points = [[0, week.OFF], [390, 21.0], [1380, week.OFF]]
    assert week.active(points, 0) == [0, week.OFF]
    assert week.active(points, 389) == [0, week.OFF]
    assert week.active(points, 390) == [390, 21.0]
    assert week.active(points, 1379) == [390, 21.0]
    assert week.active(points, 1435) == [1380, week.OFF]
    assert week.following(points, 400) == [1380, week.OFF]
    assert week.following(points, 1380) is None
    plan = week.choose(
        six(profile(*points, tags=("normal",))), "heat", weekday=2, minute=600
    )
    assert plan["target"] == {"hvac": "heat", "temperature": 21.0}
    assert plan["next"] == {"minute": 1380, "value": week.OFF}
    assert plan["basis"] == ["normal", "heat", 0, 2, 390]
    assert week.clock(1380) == "23:00"


def test_the_curve_of_a_day_by_split() -> None:
    days = [[[0, 20.0 + day]] for day in range(7)]
    each = {"name": "", "tags": [], "split": "each", "curves": days}
    assert week.day_curve(each, 0) == [[0, 20.0]]
    assert week.day_curve(each, 6) == [[0, 26.0]]
    split = {"name": "", "tags": [], "split": "week_weekend", "curves": days[:2]}
    assert week.day_curve(split, 4) == [[0, 20.0]]
    assert week.day_curve(split, 5) == [[0, 21.0]]
    assert week.day_curve(split, 6) == [[0, 21.0]]
    alike = profile([0, 22.0])
    assert week.day_curve(alike, 3) == week.day_curve(alike, 6) == [[0, 22.0]]


def test_a_holiday_without_a_profile_runs_sundays_curve() -> None:
    normal = {
        "name": "Normal",
        "tags": ["normal"],
        "split": "week_weekend",
        "curves": [[[0, 21.0]], [[0, 23.0]]],
    }
    profiles = six(profile([0, 19.0]), normal)
    plan = week.choose(profiles, "heat", weekday=2, minute=600, holiday=True)
    assert plan["why"] == "holiday" and plan["index"] == 1
    assert plan["target"]["temperature"] == 23.0
    # With a profile of its own: that one.
    profiles[4] = profile([0, 24.0], tags=("holiday",))
    plan = week.choose(profiles, "heat", weekday=2, minute=600, holiday=True)
    assert plan["index"] == 4 and plan["target"]["temperature"] == 24.0


def test_the_weekend_runs_the_normal_profile() -> None:
    normal = {
        "name": "",
        "tags": ["normal"],
        "split": "week_weekend",
        "curves": [[[0, 21.0]], [[0, 22.5]]],
    }
    profiles = six(profile([0, 18.0], tags=("holiday",)), normal)
    plan = week.choose(profiles, "heat", weekday=5, minute=600)
    assert plan["why"] == "weekend" and plan["index"] == 1
    assert plan["target"]["temperature"] == 22.5
    # Without any tick: the first profile.
    plan = week.choose(six(), "heat", weekday=1, minute=600)
    assert plan["index"] == 0 and plan["why"] == "home"


def test_away_profile_or_lowered_home_profile() -> None:
    profiles = six(profile([0, 21.0], tags=("normal",)))
    lowered = week.choose(
        profiles, "heat", weekday=2, minute=600, away=True, setback_k=3
    )
    assert lowered["target"] == {"hvac": "heat", "temperature": 18.0}
    assert lowered["index"] is None and lowered["why"] == "away"
    raised = week.choose(
        profiles, "cool", weekday=2, minute=600, away=True, setback_k=3
    )
    assert raised["target"]["temperature"] == 24.0
    off = week.choose(profiles, "cool", weekday=2, minute=600, away=True, away_off=True)
    assert off["target"] == {"hvac": week.OFF}
    profiles[3] = profile([0, 27.0], tags=("away",))
    found = week.choose(profiles, "cool", weekday=2, minute=600, away=True)
    assert found["index"] == 3 and found["target"]["temperature"] == 27.0
    # A home value "off" stays off while away.
    home_off = six(profile([0, week.OFF], tags=("normal",)))
    plan = week.choose(home_off, "heat", weekday=2, minute=600, away=True)
    assert plan["target"] == {"hvac": week.OFF}


def test_night_and_away_come_before_a_profile_by_hand() -> None:
    profiles = six(profile([0, 21.0], tags=("normal",)), profile([0, 25.0]))
    held = week.choose(profiles, "heat", weekday=2, minute=600, hold=1)
    assert held["why"] == "held" and held["held"] and held["index"] == 1
    night = week.choose(
        profiles, "heat", weekday=2, minute=600, hold=1, night=True, away=True
    )
    assert night["why"] == "night" and night["target"] == {"hvac": week.OFF}
    away = week.choose(profiles, "heat", weekday=2, minute=600, hold=1, away=True)
    assert away["why"] == "away"


def test_home_office_needs_its_tick() -> None:
    profiles = six(profile([0, 21.0], tags=("normal",)))
    plan = week.choose(profiles, "heat", weekday=2, minute=600, home_office=True)
    assert plan["why"] == "home" and plan["index"] == 0
    profiles[3] = profile([0, 22.0], tags=("home_office",))
    plan = week.choose(profiles, "heat", weekday=2, minute=600, home_office=True)
    assert plan["why"] == "home_office" and plan["index"] == 3


OK_PROFILE = profile([0, 21.0])


@pytest.mark.parametrize(
    ("profiles", "message"),
    [
        (
            six(profile([0, 21.0], tags=("away",)), profile([0, 18.0], tags=("away",))),
            "tag away",
        ),
        ([OK_PROFILE] * 5, "exactly 6"),
        (six(profile([60, 21.0])), "starts at 00:00"),
        (
            six(profile(*([[0, 21.0]] + [[m * 60, 21.0] for m in range(1, 13)]))),
            "1 to 12",
        ),
        (six(profile([0, 21.0], [62, 20.0])), "minute 62"),
        (six(profile([0, 21.0], [60, 20.0], [60, 22.0])), "in order"),
        (six(profile([0, 21.0], [60, 50.0])), "outside"),
        (
            six(
                {
                    "name": "",
                    "tags": [],
                    "split": "week_weekend",
                    "curves": [[[0, 21.0]]],
                }
            ),
            "needs 2",
        ),
        (
            six({"name": "", "tags": [], "split": "each", "curves": [[[0, 21.0]]] * 2}),
            "needs 7",
        ),
        (six(profile([0, 21.0], tags=("normal", "normal"))), "twice"),
        (six(profile([0, 21.0], tags=("party",))), "unknown tag"),
        (six(profile([0, "an"])), "neither"),
    ],
)
def test_invalid_profiles_are_refused(profiles: list[dict], message: str) -> None:
    with pytest.raises(vol.Invalid, match=message):
        week.profile_set(profiles)


def test_valid_profiles_are_tidied() -> None:
    result = week.profile_set(six({"curves": [[[0.0, 21.04], [60, "off"]]]}))
    assert result[0] == {
        "name": "",
        "tags": [],
        "split": "all",
        "curves": [[[0, 21.0], [60, week.OFF]]],
    }


def test_each_tick_on_one_preset_at_most() -> None:
    with pytest.raises(vol.Invalid, match="more than one preset"):
        week.device_profiles(
            {"week_program_1": {"tags": ["away"]}, "week_program_2": {"tags": ["away"]}}
        )
    assert week.device_profiles(
        {"week_program_1": {"tags": ["normal", "holiday"]}}
    ) == {"week_program_1": {"name": "", "tags": ["normal", "holiday"]}}


def test_the_first_suggestion() -> None:
    room = {
        "night_off": True,
        "night_from": "23:00",
        "night_until": "06:30",
        "setback_k": 3.0,
        "away": "setback",
    }
    profiles = week.suggest("cool", 24.0, room, True)
    assert [p["name"] for p in profiles] == [
        "Normal",
        "Feiertag",
        "Abwesend",
        "Home Office",
        "Profil 5",
        "Profil 6",
    ]
    assert profiles[0]["curves"] == [[[0, week.OFF], [390, 24.0], [1380, week.OFF]]]
    assert profiles[1]["curves"] == profiles[0]["curves"]
    assert profiles[2]["curves"] == [[[0, 27.0]]]
    assert [p["tags"] for p in profiles] == [
        ["normal"],
        ["holiday"],
        ["away"],
        ["home_office"],
        [],
        [],
    ]
    assert week.profile_set(profiles) == profiles
    # Heating, no home office from the calendars, off while away, no night.
    plain = week.suggest("heat", None, {"away": "off"}, False, german=False)
    assert plain[0]["curves"] == [[[0, 21.0]]]
    assert plain[2]["curves"] == [[[0, week.OFF]]]
    assert plain[3]["tags"] == [] and plain[3]["name"] == "Home office"
    # A night within the day: on at midnight.
    early = week.suggest(
        "heat",
        20.0,
        {"night_off": True, "night_from": "01:00", "night_until": "05:00"},
        False,
    )
    assert early[0]["curves"] == [[[0, 20.0], [60, week.OFF], [300, 20.0]]]


def test_the_first_suggestion_within_the_devices_limits() -> None:
    """Up to 30 °C in whole degrees: neither 33 °C for nobody home nor 20.4 °C."""
    limits = {"min_temp": 16, "max_temp": 30, "target_temp_step": 1}
    cool = week.suggest("cool", 30.0, {"setback_k": 3.0}, False, limits=limits)
    assert cool[0]["curves"] == [[[0, 30.0]]]
    assert cool[2]["curves"] == [[[0, 30.0]]]
    heat = week.suggest("heat", 20.4, {"setback_k": 3.0}, False, limits=limits)
    assert heat[0]["curves"] == [[[0, 20.0]]]
    assert heat[2]["curves"] == [[[0, 17.0]]]
    low = week.suggest("heat", None, {"setback_k": 8.0}, False, limits=limits)
    assert low[2]["curves"] == [[[0, 16.0]]]
    assert week.profile_set(cool) == cool


def test_home_office_from_the_calendars() -> None:
    config = model.default_config()
    assert week.home_office_available(config) == (False, "no_calendar")
    config["persons"] = [
        {"id": "anna", "name": "Anna", "calendars": ["calendar.anna"], "calendar": None}
    ]
    # Everyone works at home anyway (Joe's default).
    assert week.home_office_available(config) == (False, "default")
    config["calendar"]["default_workday"] = "office"
    assert week.home_office_available(config) == (True, None)
    labels = {"anna": {"label": "home_office", "source": "calendar"}}
    assert week.home_office_persons(config, labels) == ["Anna"]
    assert (
        week.home_office_persons(
            config, {"anna": {"label": "home_office", "source": "default"}}
        )
        == []
    )


# --- the controller ----------------------------------------------------------------


def devices(hass: HomeAssistant, take: bool = True) -> list[tuple[str, str, Any]]:
    """Climate actions that change the state (unless `take` is False), recorded."""
    calls: list[tuple[str, str, Any]] = []

    def handle(service: str):
        def call(c: ServiceCall) -> None:
            entity_id = c.data["entity_id"]
            value = {k: v for k, v in c.data.items() if k != "entity_id"}
            calls.append((service, entity_id, next(iter(value.values()))))
            if not take:
                return
            state = hass.states.get(entity_id)
            attrs = dict(state.attributes)
            hvac = state.state
            if service == "set_temperature":
                attrs["temperature"] = c.data["temperature"]
            elif service == "set_preset_mode":
                attrs["preset_mode"] = c.data["preset_mode"]
            elif service == "set_hvac_mode":
                hvac = c.data["hvac_mode"]
            hass.states.async_set(entity_id, hvac, attrs)

        return call

    for service in ("set_temperature", "set_preset_mode", "set_hvac_mode"):
        hass.services.async_register("climate", service, handle(service))
    return calls


def air_conditioner(hass: HomeAssistant, hvac: str = "heat", **attrs: Any) -> None:
    hass.states.async_set(
        AC,
        hvac,
        {
            "hvac_modes": ["off", "heat", "cool", "dry"],
            "temperature": 20.0,
            "current_temperature": 20.0,
            "min_temp": 16,
            "max_temp": 31,
            "target_temp_step": 0.5,
            **attrs,
        },
    )


def config(
    rooms: dict[str, dict],
    climate: dict | None = None,
    context: dict | None = None,
    person: dict | None = None,
    **more: Any,
) -> dict[str, Any]:
    return model.apply_update(
        model.default_config(),
        {
            "persons": {
                "anna": {
                    "id": "anna",
                    "name": "Anna",
                    "person_entity": "person.anna",
                    **(person or {}),
                }
            },
            "context": {"holiday_entity": "binary_sensor.workday", **(context or {})},
            "climate": {
                "enabled": True,
                "away_after_min": 0,
                **(climate or {}),
                "rooms": {
                    entity_id: {"enabled": True, **room}
                    for entity_id, room in rooms.items()
                },
            },
            **more,
        },
        "user",
    )


def weekly(
    heat: list[dict] | None = None, cool: list[dict] | None = None, **room: Any
) -> dict:
    modes = {k: v for k, v in (("heat", heat), ("cool", cool)) if v is not None}
    return {"week": {"enabled": True, "modes": modes}, **room}


async def at(hass: HomeAssistant, freezer: Any, moment: str) -> None:
    """Berlin local time on the Wednesday (HH:MM) or a full ISO time."""
    await hass.config.async_set_time_zone("Europe/Berlin")
    freezer.move_to(moment if "T" in moment else f"{WEDNESDAY}T{moment}:00+02:00")


@pytest.fixture
async def home(hass: HomeAssistant) -> HomeAssistant:
    hass.states.async_set("person.anna", "home")
    hass.states.async_set("binary_sensor.workday", "on")
    return hass


async def test_off_point_then_on_again_in_two_calls(
    home: HomeAssistant, freezer
) -> None:
    """Joe's own off at noon; at the next point he switches on: mode, then temperature."""
    hass = home
    calls = devices(hass)
    air_conditioner(hass)
    cfg = config(
        {
            AC: weekly(
                six(profile([0, 20.0], [720, week.OFF], [780, 21.0], tags=("normal",)))
            )
        }
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "11:00")
    await joe.async_check()
    assert calls == []
    room = joe.status["rooms"][AC]
    assert room["kind"] == "week" and room["mode"] == "heat"
    assert room["target"] == {"hvac": "heat", "temperature": 20.0}
    assert room["next"] == {"at": "12:00", "value": week.OFF}
    assert room["profile"]["index"] == 0 and not room["would"]
    await at(hass, freezer, "12:00")
    await joe.async_check()
    assert calls == [("set_hvac_mode", AC, "off")]
    await at(hass, freezer, "12:30")
    await joe.async_check()
    assert len(calls) == 1
    await at(hass, freezer, "13:00")
    await joe.async_check()
    assert calls[1:] == [("set_hvac_mode", AC, "heat"), ("set_temperature", AC, 21.0)]
    assert joe.data["written"][AC]["confirmed"]


async def test_no_write_without_a_change(home: HomeAssistant, freezer) -> None:
    hass = home
    calls = devices(hass)
    air_conditioner(hass)
    cfg = config({AC: weekly(six(profile([0, 22.0], tags=("normal",))))})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    for moment in ("11:00", "11:01", "11:30", "14:00", "18:45"):
        await at(hass, freezer, moment)
        await joe.async_check()
    assert calls == [("set_temperature", AC, 22.0)]


async def test_a_change_by_hand_holds_until_the_next_point(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    calls = devices(hass)
    air_conditioner(hass)
    cfg = config({AC: weekly(six(profile([0, 21.0], [720, 22.0], tags=("normal",))))})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "11:00")
    await joe.async_check()
    assert calls == [("set_temperature", AC, 21.0)]
    air_conditioner(hass, temperature=23.5)
    await at(hass, freezer, "11:10")
    await joe.async_check()
    room = joe.status["rooms"][AC]
    assert room["why"] == "override"
    assert room["override"] == {"reason": "manual", "until": "12:00"}
    await at(hass, freezer, "11:50")
    await joe.async_check()
    assert len(calls) == 1
    await at(hass, freezer, "12:00")
    await joe.async_check()
    assert calls[1:] == [("set_temperature", AC, 22.0)]
    assert joe.status["rooms"][AC]["override"] is None


async def test_switched_off_by_hand_stays_off(home: HomeAssistant, freezer) -> None:
    """Joe never switches on what someone else switched off; switched on again,
    it counts as set by hand until the next point."""
    hass = home
    calls = devices(hass)
    air_conditioner(hass)
    cfg = config(
        {
            AC: weekly(
                six(profile([0, 21.0], [720, 22.0], [900, 23.0], tags=("normal",)))
            )
        }
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "11:00")
    await joe.async_check()
    air_conditioner(hass, "off", temperature=21.0)
    await joe.async_check()
    room = joe.status["rooms"][AC]
    assert room["why"] == "off_by_hand"
    assert room["override"] == {"reason": "off", "until": None}
    await at(hass, freezer, "12:00")
    await joe.async_check()
    assert calls == [("set_temperature", AC, 21.0)]
    # On again by hand at 21 °C: left so until the next point, then the plan.
    await at(hass, freezer, "12:30")
    air_conditioner(hass, "heat", temperature=21.0)
    await joe.async_check()
    assert joe.status["rooms"][AC]["override"] == {"reason": "manual", "until": "15:00"}
    assert len(calls) == 1
    await at(hass, freezer, "15:00")
    await joe.async_check()
    assert calls[1:] == [("set_temperature", AC, 23.0)]


async def test_on_again_at_night_stays_on(home: HomeAssistant, freezer) -> None:
    """Switched off and on again by hand at night: Joe does not switch it off."""
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "cool", temperature=25.0)
    cfg = config(
        {AC: weekly(cool=six(profile([0, 25.0], [1320, week.OFF], tags=("normal",))))}
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "21:00")
    await joe.async_check()
    air_conditioner(hass, "off", temperature=25.0)
    await joe.async_check()
    await at(hass, freezer, "22:30")
    air_conditioner(hass, "cool", temperature=24.0)
    await joe.async_check()
    assert calls == []
    assert joe.status["rooms"][AC]["why"] == "override"


async def test_off_from_the_start_is_left_alone(home: HomeAssistant, freezer) -> None:
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "off")
    cfg = config({AC: weekly(cool=six(profile([0, 25.0], tags=("normal",))))})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "11:00")
    await joe.async_check()
    assert calls == []
    assert joe.status["rooms"][AC]["why"] == "off_by_hand"
    # "Back to the plan" switches it on after all.
    await joe.async_resume(AC)
    await hass.async_block_till_done()
    assert calls == [("set_hvac_mode", AC, "cool"), ("set_temperature", AC, 25.0)]


async def test_the_simulation_writes_nothing(home: HomeAssistant, freezer) -> None:
    hass = home
    calls = devices(hass)
    air_conditioner(hass)
    cfg = config({AC: weekly(six(profile([0, 22.0], tags=("normal",))))})
    joe = ClimateController(hass, lambda: cfg, lambda: "simulation", lambda: None)
    await at(hass, freezer, "11:00")
    await joe.async_check()
    assert calls == [] and joe.data["written"] == {}
    room = joe.status["rooms"][AC]
    assert room["would"] and room["target"] == {"hvac": "heat", "temperature": 22.0}
    # Joe's switch for the climate off: the same.
    cfg = config({AC: weekly(six(profile([0, 22.0])))}, climate={"enabled": False})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await joe.async_check()
    assert calls == [] and joe.status["rooms"][AC]["would"]


async def test_away_only_after_the_delay(home: HomeAssistant, freezer) -> None:
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "cool", temperature=25.0)
    away = profile([0, 28.0], tags=("away",))
    cfg = config(
        {AC: weekly(cool=six(profile([0, 25.0], tags=("normal",)), away))},
        climate={"away_after_min": 15},
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "11:00")
    await joe.async_check()
    hass.states.async_set("person.anna", "not_home")
    await joe.async_check()
    assert joe.status["rooms"][AC]["why"] == "just_left"
    assert joe.status["nobody_since"] is not None
    await at(hass, freezer, "11:14")
    await joe.async_check()
    assert calls == []
    await at(hass, freezer, "11:15")
    await joe.async_check()
    assert calls == [("set_temperature", AC, 28.0)]
    room = joe.status["rooms"][AC]
    assert room["why"] == "away" and room["profile"]["index"] == 1
    hass.states.async_set("person.anna", "home")
    await joe.async_check()
    assert calls[1:] == [("set_temperature", AC, 25.0)]
    assert joe.status["nobody_since"] is None


async def test_away_without_a_profile_raises_the_cooling(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "cool", temperature=25.0)
    cfg = config(
        {AC: weekly(cool=six(profile([0, 25.0], tags=("normal",))), setback_k=2.5)}
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "11:00")
    hass.states.async_set("person.anna", "not_home")
    await joe.async_check()
    assert calls == [("set_temperature", AC, 27.5)]
    assert joe.status["rooms"][AC]["profile"] is None


async def test_a_legacy_room_waits_too(home: HomeAssistant, freezer) -> None:
    """Rooms without profiles: away after the delay as well."""
    hass = home
    devices(hass)
    air_conditioner(hass)
    cfg = config({AC: {}}, climate={"away_after_min": 15})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "11:00")
    hass.states.async_set("person.anna", "not_home")
    await joe.async_check()
    assert joe.status["rooms"][AC]["why"] == "just_left"
    assert joe.status["rooms"][AC]["kind"] == "legacy"
    assert hass.states.get(AC).attributes["temperature"] == 20.0
    await at(hass, freezer, "11:20")
    await joe.async_check()
    assert hass.states.get(AC).attributes["temperature"] == 17.0


async def test_the_night_comes_before_the_profile(home: HomeAssistant, freezer) -> None:
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "cool", temperature=25.0)
    cfg = config(
        {AC: weekly(cool=six(profile([0, 25.0], tags=("normal",))), night_off=True)}
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "23:30")
    await joe.async_check()
    assert calls == [("set_hvac_mode", AC, "off")]
    assert joe.status["rooms"][AC]["why"] == "night"
    # Back in time for the morning (3 K at 1.5 K/h and a margin before 06:30).
    await at(hass, freezer, "2026-10-08T04:30:00+02:00")
    await joe.async_check()
    assert calls[1:] == [("set_hvac_mode", AC, "cool")]


async def test_handing_back_when_the_plan_says_off(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    calls = devices(hass)
    air_conditioner(hass)
    cfg = config(
        {AC: weekly(six(profile([0, 21.0], [720, week.OFF], tags=("normal",))))}
    )
    mode = {"now": "live"}
    joe = ClimateController(hass, lambda: cfg, lambda: mode["now"], lambda: None)
    await at(hass, freezer, "12:30")
    await joe.async_check()
    assert calls == [("set_hvac_mode", AC, "off")]
    # Simulation again: the home profile of now says off as well – it stays off.
    mode["now"] = "simulation"
    await joe.async_check()
    assert calls == [("set_hvac_mode", AC, "off")]
    assert joe.data["written"] == {}
    assert joe.data["log"][-1]["what"] == "back"


async def test_handing_back_switches_on_after_the_night(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "cool", temperature=24.0)
    cfg = config(
        {AC: weekly(cool=six(profile([0, 24.0], tags=("normal",))), night_off=True)}
    )
    rooms = cfg["climate"]["rooms"]
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "23:30")
    await joe.async_check()
    assert calls == [("set_hvac_mode", AC, "off")]
    # The room is no longer Joe's: the home profile of now, once.
    rooms[AC]["enabled"] = False
    await joe.async_check()
    assert calls[1:] == [("set_hvac_mode", AC, "cool")]
    await joe.async_check()
    assert len(calls) == 2


async def test_handing_back_ends_the_absence_setting(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    calls = devices(hass)
    air_conditioner(hass, temperature=21.0)
    cfg = config({AC: weekly(six(profile([0, 21.0], tags=("normal",))))})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    hass.states.async_set("person.anna", "not_home")
    await joe.async_check()
    assert calls == [("set_temperature", AC, 18.0)]
    cfg["climate"]["enabled"] = False
    await joe.async_check()
    assert calls[1:] == [("set_temperature", AC, 21.0)]
    assert joe.data["written"] == {} and joe.status["rooms"][AC]["would"]


async def test_handing_back_leaves_a_normal_target(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    calls = devices(hass)
    air_conditioner(hass)
    cfg = config({AC: weekly(six(profile([0, 22.0], tags=("normal",))))})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    await joe.async_check()
    cfg["climate"]["rooms"][AC]["week"]["enabled"] = False
    await joe.async_check()
    assert calls == [("set_temperature", AC, 22.0)]
    assert joe.status["rooms"][AC]["kind"] == "legacy"


async def test_limits_and_steps_of_the_device(home: HomeAssistant, freezer) -> None:
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "cool", temperature=25.0)
    cfg = config(
        {
            AC: weekly(
                cool=six(profile([0, 33.0], [600, 21.3], [660, 12.0], tags=("normal",)))
            )
        }
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "09:00")
    await joe.async_check()
    await at(hass, freezer, "10:00")
    await joe.async_check()
    await at(hass, freezer, "11:00")
    await joe.async_check()
    assert calls == [
        ("set_temperature", AC, 31.0),
        ("set_temperature", AC, 21.5),
        ("set_temperature", AC, 16.0),
    ]
    # Whole degrees only.
    air_conditioner(hass, "cool", temperature=25.0, target_temp_step=1)
    joe.data["written"].clear()
    await at(hass, freezer, "10:00")
    await joe.async_check()
    assert calls[-1] == ("set_temperature", AC, 21.0)


async def test_a_device_that_does_not_take_it(home: HomeAssistant, freezer) -> None:
    """Tried again after 3, 10 and 30 minutes, then one error."""
    hass = home
    calls = devices(hass, take=False)
    air_conditioner(hass)
    cfg = config({AC: weekly(six(profile([0, 22.0], tags=("normal",))))})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    start = datetime.fromisoformat(f"{WEDNESDAY}T10:00:00+02:00")
    await hass.config.async_set_time_zone("Europe/Berlin")
    for minutes in (0, 1, 3, 4, 13, 20, 43, 45, 46, 60, 90):
        freezer.move_to(start + timedelta(minutes=minutes))
        await joe.async_check()
    assert len(calls) == 4
    assert joe.status["rooms"][AC]["error"] == "not_confirmed"
    assert [e["what"] for e in joe.data["log"]].count("failed") == 1


async def test_on_again_not_shown_yet_is_tried_again(
    home: HomeAssistant, freezer
) -> None:
    """After Joe's own off the device does not show his "on" yet: no change by
    hand – tried again after 3, 10 and 30 minutes, and fine once it shows."""
    hass = home
    devices(hass)
    air_conditioner(hass)
    cfg = config(
        {
            AC: weekly(
                six(profile([0, 20.0], [720, week.OFF], [780, 21.0], tags=("normal",)))
            )
        }
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "12:00")
    await joe.async_check()
    assert hass.states.get(AC).state == week.OFF
    calls = devices(hass, take=False)
    for moment in ("13:00", "13:01", "13:02", "13:03", "13:04", "13:13", "13:43"):
        await at(hass, freezer, moment)
        await joe.async_check()
        assert joe.status["rooms"][AC]["why"] == "home"
    assert joe.data["overrides"] == {}
    assert [c for c in calls if c[0] == "set_hvac_mode"] == [
        ("set_hvac_mode", AC, "heat")
    ] * 4
    # Shown late after all: confirmed, nothing more to do.
    air_conditioner(hass, temperature=21.0)
    await at(hass, freezer, "13:44")
    await joe.async_check()
    assert joe.data["written"][AC]["confirmed"]
    assert joe.status["rooms"][AC]["override"] is None
    assert len(calls) == 8


async def test_a_thermostat_not_back_on_yet_is_no_manual_mode(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    devices(hass)
    thermostat(hass)
    cfg = config(
        {
            HMIP: {
                "away": "off",
                "device_profiles": {"week_program_1": {"tags": ["normal"]}},
            }
        }
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    hass.states.async_set("person.anna", "not_home")
    await joe.async_check()
    assert hass.states.get(HMIP).state == week.OFF
    calls = devices(hass, take=False)
    hass.states.async_set("person.anna", "home")
    await joe.async_check()
    assert calls == [("set_hvac_mode", HMIP, "auto")]
    await at(hass, freezer, "10:01")
    await joe.async_check()
    assert joe.status["rooms"][HMIP]["why"] == "home"
    await at(hass, freezer, "10:03")
    await joe.async_check()
    assert calls[1:] == [("set_hvac_mode", HMIP, "auto")]
    thermostat(hass)
    await at(hass, freezer, "10:04")
    await joe.async_check()
    assert joe.data["written"][HMIP]["confirmed"]
    assert joe.status["rooms"][HMIP]["why"] == "home"


async def test_a_refused_value_is_an_error_at_once(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    calls = []

    def refuse(call: ServiceCall) -> None:
        calls.append(call.service)
        raise ServiceValidationError("Temperature not allowed")

    hass.services.async_register("climate", "set_temperature", refuse)
    air_conditioner(hass)
    cfg = config({AC: weekly(six(profile([0, 22.0], tags=("normal",))))})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    await joe.async_check()
    assert joe.status["rooms"][AC]["error"] == "Temperature not allowed"
    for moment in ("10:04", "10:30", "11:30"):
        await at(hass, freezer, moment)
        await joe.async_check()
    assert calls == ["set_temperature"]


async def test_free_day_entities_make_a_holiday(home: HomeAssistant, freezer) -> None:
    hass = home
    calls = devices(hass)
    air_conditioner(hass)
    cfg = config(
        {
            AC: weekly(
                six(
                    profile([0, 21.0], tags=("normal",)),
                    profile([0, 23.0], tags=("holiday",)),
                )
            )
        },
        context={"free_day_entities": ["input_boolean.brueckentag"]},
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    hass.states.async_set("input_boolean.brueckentag", "off")
    await joe.async_check()
    assert joe.status["day"]["free"] is False
    assert calls == [("set_temperature", AC, 21.0)]
    hass.states.async_set("input_boolean.brueckentag", "on")
    await joe.async_check()
    day = joe.status["day"]
    assert day["free"] and day["holiday"] and not day["weekend"]
    assert joe.status["rooms"][AC]["why"] == "holiday"
    assert calls[1:] == [("set_temperature", AC, 23.0)]


def calendar(hass: HomeAssistant, summary: str | None, fail: bool = False) -> list[str]:
    asked: list[str] = []

    async def events(call: ServiceCall) -> dict[str, Any]:
        asked.append(call.data["start_date_time"])
        if fail:
            raise HomeAssistantError("offline")
        found = [{"summary": summary, "start": WEDNESDAY}] if summary else []
        return {"calendar.anna": {"events": found}}

    hass.services.async_register(
        "calendar", "get_events", events, supports_response=SupportsResponse.ONLY
    )
    return asked


async def test_home_office_from_the_calendar(home: HomeAssistant, freezer) -> None:
    hass = home
    calls = devices(hass)
    asked = calendar(hass, "Homeoffice")
    air_conditioner(hass)
    home_office = profile([0, 22.0], tags=("home_office",))
    cfg = config(
        {AC: weekly(six(profile([0, 21.0], tags=("normal",)), home_office))},
        person={"calendars": ["calendar.anna"]},
        calendar={"default_workday": "office"},
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    await joe.async_check()
    await hass.async_block_till_done()
    assert len(asked) == 1
    day = joe.status["day"]
    assert day["home_office"] == ["Anna"] and day["home_office_available"]
    assert day["labels_at"] is not None
    assert joe.status["rooms"][AC]["why"] == "home_office"
    assert calls[-1] == ("set_temperature", AC, 22.0)
    # Not asked again before 15 minutes have passed.
    await at(hass, freezer, "10:10")
    await joe.async_check()
    await hass.async_block_till_done()
    assert len(asked) == 1
    # The calendar does not answer: today's last answer stands.
    hass.services.async_remove("calendar", "get_events")
    calendar(hass, None, fail=True)
    await at(hass, freezer, "10:16")
    await joe.async_check()
    await hass.async_block_till_done()
    assert joe.status["day"]["home_office"] == ["Anna"]


async def test_no_home_office_when_it_is_the_usual_day(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    devices(hass)
    calendar(hass, "Homeoffice")
    air_conditioner(hass)
    cfg = config(
        {
            AC: weekly(
                six(
                    profile([0, 21.0], tags=("normal",)),
                    profile([0, 22.0], tags=("home_office",)),
                )
            )
        },
        person={"calendars": ["calendar.anna"]},
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    await joe.async_check()
    await hass.async_block_till_done()
    day = joe.status["day"]
    assert day["home_office"] == [] and not day["home_office_available"]
    assert day["home_office_reason"] == "default"
    assert joe.status["rooms"][AC]["why"] == "home"


async def test_no_home_office_when_the_calendar_fails(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    devices(hass)
    calendar(hass, "Homeoffice", fail=True)
    air_conditioner(hass)
    cfg = config(
        {
            AC: weekly(
                six(
                    profile([0, 21.0], tags=("normal",)),
                    profile([0, 22.0], tags=("home_office",)),
                )
            )
        },
        person={"calendars": ["calendar.anna"]},
        calendar={"default_workday": "office"},
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    await joe.async_check()
    await hass.async_block_till_done()
    assert joe.status["day"]["home_office"] == []
    assert joe.status["day"]["labels_state"] == "error"
    assert joe.data["labels"]["persons"]["anna"]["source"] == "error"
    assert joe.status["rooms"][AC]["why"] == "home"


async def test_the_calendars_are_read_without_a_room(
    home: HomeAssistant, freezer
) -> None:
    """Today's card tells the home office before any room is Joe's."""
    hass = home
    asked = calendar(hass, "Homeoffice")
    cfg = config(
        {},
        person={"calendars": ["calendar.anna"]},
        calendar={"default_workday": "office"},
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    await joe.async_check()
    assert joe.status["day"]["labels_state"] == "unread"
    await hass.async_block_till_done()
    assert len(asked) == 1
    day = joe.status["day"]
    assert day["labels_state"] == "ok" and day["home_office"] == ["Anna"]
    # At most every 15 minutes.
    await at(hass, freezer, "10:10")
    await joe.async_check()
    await hass.async_block_till_done()
    assert len(asked) == 1
    await at(hass, freezer, "10:15")
    await joe.async_check()
    await hass.async_block_till_done()
    assert len(asked) == 2


async def test_a_profile_by_hand_until_midnight(home: HomeAssistant, freezer) -> None:
    hass = home
    calls = devices(hass)
    air_conditioner(hass)
    cfg = config(
        {
            AC: weekly(
                six(
                    profile([0, 21.0], tags=("normal",)),
                    profile([0, 23.0], name="Party"),
                )
            )
        }
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "20:00")
    await joe.async_hold(AC, 1, "midnight")
    await hass.async_block_till_done()
    assert joe.data["holds"][AC]["until"].startswith("2026-10-08T00:00:00")
    room = joe.status["rooms"][AC]
    assert room["why"] == "held"
    assert room["profile"] == {"index": 1, "name": "Party", "tags": [], "held": True}
    assert calls == [("set_temperature", AC, 23.0)]
    await at(hass, freezer, "2026-10-08T00:01:00+02:00")
    await joe.async_check()
    assert joe.data["holds"] == {}
    assert calls[1:] == [("set_temperature", AC, 21.0)]
    # Until lifted, and lifted.
    await joe.async_hold(AC, 1, "forever")
    await hass.async_block_till_done()
    assert joe.data["holds"][AC]["until"] is None
    await joe.async_hold(AC, None)
    await hass.async_block_till_done()
    assert joe.data["holds"] == {}


async def test_a_profile_by_hand_shows_in_the_night(
    home: HomeAssistant, freezer
) -> None:
    """The status tells a profile by hand whatever comes first now."""
    hass = home
    devices(hass)
    air_conditioner(hass)
    cfg = config(
        {
            AC: weekly(
                six(
                    profile([0, 21.0], tags=("normal",)),
                    profile([0, 23.0], name="Party"),
                ),
                night_off=True,
            )
        }
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "22:30")
    await joe.async_check()
    assert joe.status["rooms"][AC]["hold"] is None
    await joe.async_hold(AC, 1, "forever")
    await hass.async_block_till_done()
    held = {"profile": 1, "mode": "heat", "until": None}
    assert joe.status["rooms"][AC]["hold"] == held
    await at(hass, freezer, "23:30")
    await joe.async_check()
    room = joe.status["rooms"][AC]
    assert room["why"] == "night" and room["profile"] is None
    assert room["hold"] == held
    await joe.async_hold(AC, 1, "midnight")
    await hass.async_block_till_done()
    until = joe.status["rooms"][AC]["hold"]["until"]
    assert until.startswith("2026-10-08T00:00:00")
    await joe.async_hold(AC, None)
    await hass.async_block_till_done()
    assert joe.status["rooms"][AC]["hold"] is None


async def test_profiles_start_once_the_old_ways_absence_is_over(
    home: HomeAssistant, freezer
) -> None:
    """Held off the old way while nobody is home, then weekly profiles: they
    start once someone is back (no switching in between)."""
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "cool", temperature=25.0)
    cfg = config({AC: {"away": "off"}})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    await joe.async_check()
    hass.states.async_set("person.anna", "not_home")
    await joe.async_check()
    assert calls == [("set_hvac_mode", AC, "off")]
    cfg = config(
        {AC: weekly(cool=six(profile([0, 25.0], tags=("normal",))), away="off")}
    )
    await joe.async_check()
    assert calls[1:] == []
    room = joe.status["rooms"][AC]
    assert room["kind"] == "legacy" and room["pending"] == "start"
    hass.states.async_set("person.anna", "home")
    await joe.async_check()
    await joe.async_check()
    assert calls[1:] == [("set_hvac_mode", AC, "cool")]
    room = joe.status["rooms"][AC]
    assert room["kind"] == "week" and room["pending"] is None
    assert joe.data["states"] == {} and joe.data["overrides"] == {}


async def test_profiles_switched_off_at_night_end_in_the_morning(
    home: HomeAssistant, freezer
) -> None:
    """No profiles any more at night: Joe's night goes on (no on and off
    again) and ends in the morning with the home profile."""
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "cool", temperature=24.0)
    cfg = config(
        {AC: weekly(cool=six(profile([0, 24.0], tags=("normal",))), night_off=True)}
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "23:30")
    await joe.async_check()
    assert calls == [("set_hvac_mode", AC, "off")]
    cfg["climate"]["rooms"][AC]["week"]["enabled"] = False
    await joe.async_check()
    assert len(calls) == 1
    assert joe.status["rooms"][AC]["pending"] == "end"
    await at(hass, freezer, "2026-10-08T06:30:00+02:00")
    await joe.async_check()
    assert calls[1:] == [("set_hvac_mode", AC, "cool")]
    assert joe.status["rooms"][AC]["kind"] == "legacy"
    assert joe.data["written"] == {}


async def test_a_change_by_hand_ends_when_joe_lets_go(
    home: HomeAssistant, freezer
) -> None:
    """Off by hand from the start (nothing written): forgotten once the
    profiles are off or the room is not Joe's; on again, the plan at once."""
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "off")
    cfg = config({AC: weekly(six(profile([0, 21.0], [1320, 20.0], tags=("normal",))))})
    rooms = cfg["climate"]["rooms"]
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    await joe.async_check()
    assert joe.data["overrides"][AC]["reason"] == "off"
    rooms[AC]["week"]["enabled"] = False
    await joe.async_check()
    assert joe.data["overrides"] == {}
    rooms[AC]["week"]["enabled"] = True
    await joe.async_check()
    assert joe.data["overrides"][AC]["reason"] == "off"
    rooms[AC]["enabled"] = False
    await joe.async_check()
    assert joe.data["overrides"] == {}
    # Days later on by hand at 24 °C, and the room is Joe's again.
    air_conditioner(hass, temperature=24.0)
    rooms[AC]["enabled"] = True
    await joe.async_check()
    assert calls == [("set_temperature", AC, 21.0)]
    assert joe.status["rooms"][AC]["override"] is None


async def test_an_old_store_counts_nobody_home_as_away_at_once(
    home: HomeAssistant, freezer, hass_storage: dict[str, Any]
) -> None:
    """The first start after the update while nobody is home: a room Joe
    lowered stays lowered (no 15 minutes back to normal)."""
    hass = home
    calls = devices(hass)
    air_conditioner(hass, temperature=17.0)
    hass_storage[climate_module.STORE_KEY] = {
        "version": climate_module.STORE_VERSION,
        "minor_version": 1,
        "key": climate_module.STORE_KEY,
        "data": {
            "saved": {
                AC: {"hvac_mode": "heat", "temperature": 20.0, "preset_mode": None}
            },
            "states": {AC: "away"},
            "warming": {},
            "rates": {},
            "log": [],
            "homecomings": {},
        },
    }
    hass.states.async_set("person.anna", "not_home")
    cfg = config({AC: {}}, climate={"away_after_min": 15})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await joe.async_load()
    await at(hass, freezer, "10:00")
    await joe.async_check()
    assert calls == []
    assert joe.status["rooms"][AC]["why"] == "away"
    assert joe.data["nobody_since"].startswith(f"{WEDNESDAY}T09:44")
    # Leaving later on waits as usual.
    hass.states.async_set("person.anna", "home")
    await joe.async_check()
    hass.states.async_set("person.anna", "not_home")
    await at(hass, freezer, "10:05")
    await joe.async_check()
    assert joe.status["rooms"][AC]["why"] == "just_left"


async def test_profiles_start_after_the_old_way_put_back(
    home: HomeAssistant, freezer
) -> None:
    """Lowered the old way, then weekly profiles: the old way puts back when
    someone is home, then the profiles go on."""
    hass = home
    calls = devices(hass)
    air_conditioner(hass, temperature=21.0)
    cfg = config({AC: {}})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    hass.states.async_set("person.anna", "not_home")
    await joe.async_check()
    assert calls == [("set_temperature", AC, 18.0)]
    cfg = config({AC: weekly(six(profile([0, 19.0], tags=("normal",))))})
    await joe.async_check()
    assert calls[1:] == []
    hass.states.async_set("person.anna", "home")
    await joe.async_check()
    await joe.async_check()
    assert calls[1:] == [("set_temperature", AC, 21.0), ("set_temperature", AC, 19.0)]
    assert joe.data["states"] == {} and joe.data["saved"] == {}


# --- Homematic IP ------------------------------------------------------------------

HMIP_PRESETS = ["boost", "none", "week_program_1", "week_program_2", "week_program_3"]


def thermostat(
    hass: HomeAssistant, hvac: str = "auto", preset: str = "week_program_1"
) -> None:
    hass.states.async_set(
        HMIP,
        hvac,
        {
            "hvac_modes": ["auto", "heat", "off"],
            "preset_modes": HMIP_PRESETS,
            "preset_mode": preset,
            "temperature": 20.0,
            "current_temperature": 20.0,
        },
    )


TICKS = {
    "week_program_1": {"tags": ["normal"]},
    "week_program_2": {"name": "Weg", "tags": ["away"]},
    "week_program_3": {"tags": ["holiday"]},
}


async def test_ticks_switch_the_thermostats_profiles(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    calls = devices(hass)
    thermostat(hass)
    cfg = config({HMIP: {"device_profiles": TICKS}})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    await joe.async_check()
    room = joe.status["rooms"][HMIP]
    assert room["kind"] == "device" and room["mode"] is None
    assert room["target"] == {"hvac": "auto", "preset": "week_program_1"}
    assert calls == []
    hass.states.async_set("person.anna", "not_home")
    await joe.async_check()
    assert calls == [("set_preset_mode", HMIP, "week_program_2")]
    assert joe.status["rooms"][HMIP]["profile"]["name"] == "Weg"
    hass.states.async_set("person.anna", "home")
    await joe.async_check()
    assert calls[1:] == [("set_preset_mode", HMIP, "week_program_1")]
    assert all(service != "set_temperature" for service, _, _ in calls)


async def test_a_thermostat_set_by_hand_is_left_alone(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    calls = devices(hass)
    cfg = config({HMIP: {"device_profiles": TICKS}})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    hass.states.async_set("person.anna", "not_home")
    for hvac in ("heat", "off"):
        thermostat(hass, hvac)
        await joe.async_check()
        assert joe.status["rooms"][HMIP]["why"] == "manual_mode"
    assert calls == []


async def test_a_profile_by_hand_after_manual_mode_is_kept(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    calls = devices(hass)
    thermostat(hass)
    cfg = config({HMIP: {"device_profiles": TICKS}})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    await joe.async_check()
    thermostat(hass, "heat")
    await at(hass, freezer, "10:01")
    await joe.async_check()
    hass.states.async_set("person.anna", "not_home")
    await at(hass, freezer, "10:02")
    await joe.async_check()
    thermostat(hass, "heat", "week_program_2")
    await at(hass, freezer, "10:10")
    await joe.async_check()
    # Back to automatic by hand (on the profile for away), then another
    # profile by hand: Joe does not compare with what he wrote before.
    thermostat(hass, "auto", "week_program_2")
    await at(hass, freezer, "10:20")
    await joe.async_check()
    thermostat(hass, "auto", "week_program_1")
    await at(hass, freezer, "10:25")
    await joe.async_check()
    assert calls == []
    assert joe.status["rooms"][HMIP]["why"] == "override"


async def test_a_profile_by_hand_after_off_by_hand_is_kept(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    calls = devices(hass)
    thermostat(hass)
    cfg = config(
        {
            HMIP: {
                "away": "off",
                "device_profiles": {"week_program_1": {"tags": ["normal"]}},
            }
        }
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    await joe.async_check()
    thermostat(hass, "off", "week_program_3")
    await at(hass, freezer, "10:01")
    await joe.async_check()
    hass.states.async_set("person.anna", "not_home")
    await at(hass, freezer, "10:02")
    await joe.async_check()
    # On to automatic by hand while away, then another profile by hand.
    thermostat(hass, "auto", "week_program_1")
    await at(hass, freezer, "10:10")
    await joe.async_check()
    thermostat(hass, "auto", "week_program_3")
    await at(hass, freezer, "10:20")
    await joe.async_check()
    assert calls == []
    assert joe.status["rooms"][HMIP]["why"] == "override"


async def test_back_to_automatic_by_hand_on_another_profile_holds(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    calls = devices(hass)
    thermostat(hass, "heat")
    cfg = config({HMIP: {"device_profiles": TICKS}})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    await joe.async_check()
    thermostat(hass, "auto", "week_program_3")
    await at(hass, freezer, "10:05")
    await joe.async_check()
    assert calls == []
    assert joe.status["rooms"][HMIP]["why"] == "override"
    # The situation changes: the ticks decide again.
    hass.states.async_set("person.anna", "not_home")
    await at(hass, freezer, "10:30")
    await joe.async_check()
    assert calls == [("set_preset_mode", HMIP, "week_program_2")]


async def test_profiles_change_at_most_every_15_minutes(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    calls = devices(hass)
    thermostat(hass)
    cfg = config(
        {HMIP: {"device_profiles": TICKS}},
        context={"free_day_entities": ["input_boolean.frei"]},
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    hass.states.async_set("input_boolean.frei", "on")
    await joe.async_check()
    assert calls == [("set_preset_mode", HMIP, "week_program_3")]
    await at(hass, freezer, "10:05")
    hass.states.async_set("input_boolean.frei", "off")
    await joe.async_check()
    assert len(calls) == 1
    await at(hass, freezer, "10:15")
    await joe.async_check()
    assert calls[1:] == [("set_preset_mode", HMIP, "week_program_1")]
    # Going away switches at once.
    await at(hass, freezer, "10:16")
    hass.states.async_set("person.anna", "not_home")
    await joe.async_check()
    assert calls[2:] == [("set_preset_mode", HMIP, "week_program_2")]


async def test_a_thermostat_off_while_away(home: HomeAssistant, freezer) -> None:
    """No profile for absence and "off" chosen: off, and back to automatic."""
    hass = home
    calls = devices(hass)
    thermostat(hass)
    cfg = config(
        {
            HMIP: {
                "away": "off",
                "device_profiles": {"week_program_1": {"tags": ["normal"]}},
            }
        }
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    hass.states.async_set("person.anna", "not_home")
    await joe.async_check()
    assert calls == [("set_hvac_mode", HMIP, "off")]
    hass.states.async_set("person.anna", "home")
    await joe.async_check()
    assert calls[1:] == [("set_hvac_mode", HMIP, "auto")]
    assert hass.states.get(HMIP).attributes["preset_mode"] == "week_program_1"


async def test_a_thermostat_off_by_hand_is_not_handed_back_on(
    home: HomeAssistant, freezer
) -> None:
    """Joe's "off" while away, then on and off again by hand: letting go does
    not switch it back to automatic."""
    hass = home
    calls = devices(hass)
    thermostat(hass)
    cfg = config(
        {
            HMIP: {
                "away": "off",
                "device_profiles": {"week_program_1": {"tags": ["normal"]}},
            }
        }
    )
    mode = {"now": "live"}
    joe = ClimateController(hass, lambda: cfg, lambda: mode["now"], lambda: None)
    await at(hass, freezer, "10:00")
    hass.states.async_set("person.anna", "not_home")
    await joe.async_check()
    assert calls == [("set_hvac_mode", HMIP, "off")]
    for hvac, moment in (("heat", "10:10"), ("off", "10:20")):
        thermostat(hass, hvac)
        await at(hass, freezer, moment)
        await joe.async_check()
    mode["now"] = "simulation"
    await at(hass, freezer, "10:30")
    await joe.async_check()
    assert calls[1:] == []
    assert hass.states.get(HMIP).state == "off"


async def test_profiles_do_not_take_an_off_by_hand_for_their_own(
    home: HomeAssistant, freezer
) -> None:
    """Off by hand before the old way's absence: once the profiles take over
    it stays off by hand, also when they say on for the absence."""
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "cool", temperature=27.0)
    rooms = {AC: {"away": "off"}}
    joe = ClimateController(hass, lambda: config(rooms), lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    await joe.async_check()
    air_conditioner(hass, "off", temperature=27.0)
    await at(hass, freezer, "10:05")
    await joe.async_check()
    hass.states.async_set("person.anna", "not_home")
    await at(hass, freezer, "10:10")
    await joe.async_check()
    rooms[AC] = weekly(
        cool=six(
            profile([0, week.OFF], tags=("normal",)),
            profile([0, 25.0], tags=("away",)),
        ),
        away="off",
    )
    await at(hass, freezer, "10:20")
    await joe.async_check()
    assert joe.status["rooms"][AC]["pending"] == "start"
    hass.states.async_set("person.anna", "home")
    for moment in ("10:30", "10:31"):
        await at(hass, freezer, moment)
        await joe.async_check()
    assert joe.status["rooms"][AC]["why"] == "off_by_hand"
    hass.states.async_set("person.anna", "not_home")
    for moment in ("10:40", "10:41"):
        await at(hass, freezer, moment)
        await joe.async_check()
    assert calls == []


async def test_a_thermostat_is_handed_back_from_away(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    calls = devices(hass)
    thermostat(hass)
    cfg = config({HMIP: {"device_profiles": TICKS}})
    mode = {"now": "live"}
    joe = ClimateController(hass, lambda: cfg, lambda: mode["now"], lambda: None)
    await at(hass, freezer, "10:00")
    hass.states.async_set("person.anna", "not_home")
    await joe.async_check()
    mode["now"] = "simulation"
    await joe.async_check()
    assert calls == [
        ("set_preset_mode", HMIP, "week_program_2"),
        ("set_preset_mode", HMIP, "week_program_1"),
    ]


async def test_another_profile_by_hand_holds_until_the_situation_changes(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    calls = devices(hass)
    thermostat(hass, preset="week_program_2")
    cfg = config({HMIP: {"device_profiles": TICKS}})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    await joe.async_check()
    assert calls == [("set_preset_mode", HMIP, "week_program_1")]
    thermostat(hass, preset="boost")
    await at(hass, freezer, "10:30")
    await joe.async_check()
    assert joe.status["rooms"][HMIP]["override"] == {"reason": "preset", "until": None}
    assert len(calls) == 1
    hass.states.async_set("person.anna", "not_home")
    await joe.async_check()
    assert calls[1:] == [("set_preset_mode", HMIP, "week_program_2")]


def version_5(room: dict[str, Any]) -> dict[str, Any]:
    """A thermostat's room as version 5 stored it, brought up to date."""
    data = config({HMIP: room})
    data["version"] = 5
    for item in data["climate"]["rooms"].values():
        del item["week"], item["device_profiles"]
    return model.migrate(data)


async def test_version_5_away_profile_goes_on_as_before(
    home: HomeAssistant, freezer
) -> None:
    """Ticked "away" by the update but no "normal": the old way, which puts
    the profile from before back."""
    hass = home
    calls = devices(hass)
    thermostat(hass)
    cfg = version_5({"away": "preset", "away_preset": "week_program_2"})
    assert cfg["climate"]["rooms"][HMIP]["device_profiles"] == {
        "week_program_2": {"name": "", "tags": ["away"]}
    }
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    hass.states.async_set("person.anna", "not_home")
    await joe.async_check()
    assert joe.status["rooms"][HMIP]["kind"] == "legacy"
    assert calls == [("set_preset_mode", HMIP, "week_program_2")]
    hass.states.async_set("person.anna", "home")
    await joe.async_check()
    assert calls[1:] == [("set_preset_mode", HMIP, "week_program_1")]


async def test_version_5_day_off_profile_goes_on_at_the_weekend(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    calls = devices(hass)
    thermostat(hass)
    cfg = version_5({"free_day_preset": "week_program_3"})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    # A Saturday.
    await at(hass, freezer, "2026-10-10T10:00:00+02:00")
    hass.states.async_set("binary_sensor.workday", "off")
    await joe.async_check()
    assert calls == [("set_preset_mode", HMIP, "week_program_3")]
    assert joe.status["rooms"][HMIP]["why"] == "free_day"
    # A workday again: the profile from before.
    hass.states.async_set("binary_sensor.workday", "on")
    await joe.async_check()
    assert calls[1:] == [("set_preset_mode", HMIP, "week_program_1")]


async def test_version_5_setback_goes_on_with_a_day_off_profile(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    calls = devices(hass)
    thermostat(hass)
    cfg = version_5({"away": "setback", "free_day_preset": "week_program_3"})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    hass.states.async_set("person.anna", "not_home")
    await joe.async_check()
    assert calls == [("set_temperature", HMIP, 17.0)]
    assert joe.status["rooms"][HMIP]["why"] == "away"


# --- on the way home -----------------------------------------------------------------


async def test_arriving_stays_until_home(
    home: HomeAssistant, freezer, monkeypatch: pytest.MonkeyPatch
) -> None:
    hass = home
    devices(hass)
    air_conditioner(hass, "cool", temperature=25.0, current_temperature=28.0)
    cfg = config({AC: weekly(cool=six(profile([0, 25.0], tags=("normal",))))})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "16:00")
    hass.states.async_set("person.anna", "not_home")
    where = {"person.anna": {"km": 10.0, "direction": "towards"}}
    monkeypatch.setattr(climate_module, "arrivals", lambda hass: where)
    await joe.async_check()
    assert joe.status["rooms"][AC]["why"] == "arriving"
    # Stopped at the shop (no direction): still on the way.
    where["person.anna"] = {"km": 9.0, "direction": "stationary"}
    await at(hass, freezer, "16:20")
    await joe.async_check()
    assert joe.status["rooms"][AC]["why"] == "arriving"
    # Turned away: away again.
    where["person.anna"] = {"km": 12.0, "direction": "away_from"}
    await joe.async_check()
    assert joe.status["rooms"][AC]["why"] == "away"
    # On the way again, but 90 minutes later still not home: away.
    where["person.anna"] = {"km": 10.0, "direction": "towards"}
    await joe.async_check()
    where["person.anna"] = {"km": 9.0, "direction": "stationary"}
    await at(hass, freezer, "17:51")
    await joe.async_check()
    assert joe.status["rooms"][AC]["why"] == "away"


async def test_no_usual_homecoming_on_vacation(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    hass.states.async_set("person.anna", "not_home")
    cfg = config({})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    zone = dt_util.get_default_time_zone()
    today = datetime(2026, 10, 7, tzinfo=zone)
    for back in range(1, 8):
        day = today - timedelta(days=back)
        if day.weekday() < 5:
            joe.data["homecomings"].setdefault("person.anna", []).append(
                {"at": day.replace(hour=17, minute=30).isoformat(), "free": False}
            )
    monkeypatch.setattr(climate_module, "arrivals", lambda hass: {})
    monkeypatch.setattr(
        climate_module.ClimateController, "_free_day", lambda self: False
    )
    lead = timedelta(minutes=130)
    moment = today.replace(hour=15, minute=30)
    assert joe._arriving(lead, moment) == "arriving_usual"
    joe.data["labels"] = {
        "day": today.date().isoformat(),
        "at": moment.isoformat(),
        "persons": {"anna": {"label": "vacation", "source": "calendar"}},
    }
    assert joe._arriving(lead, moment) is None
    # Away for more than 20 hours: not the usual day either.
    joe.data["labels"] = {}
    joe.data["nobody_since"] = (moment - timedelta(hours=21)).isoformat()
    assert joe._arriving(lead, moment) is None


async def test_a_try_long_overdue_waits_no_more(home: HomeAssistant, freezer) -> None:
    """A profile the thermostat never showed, then nobody home (no write runs):
    set to manual hours later counts as by hand, and coming home writes nothing."""
    hass = home
    thermostat(hass, preset="week_program_2")
    calls = devices(hass, take=False)
    cfg = config({HMIP: {"device_profiles": {"week_program_1": {"tags": ["normal"]}}}})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "07:00")
    await joe.async_check()
    assert calls == [("set_preset_mode", HMIP, "week_program_1")]
    hass.states.async_set("person.anna", "not_home")
    for moment in ("07:01", "07:03", "07:13"):
        await at(hass, freezer, moment)
        await joe.async_check()
    thermostat(hass, hvac="heat", preset="none")
    await at(hass, freezer, "14:00")
    await joe.async_check()
    assert joe.status["rooms"][HMIP]["why"] == "manual_mode"
    hass.states.async_set("person.anna", "home")
    await at(hass, freezer, "18:00")
    await joe.async_check()
    assert len(calls) == 1


async def test_profiles_switched_off_while_away_end_on_coming_home(
    home: HomeAssistant, freezer
) -> None:
    """Profiles off while nobody is home: the absence profile goes on, and on
    coming home the home profile once – then the old way."""
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "cool", temperature=24.0)
    cfg = config(
        {
            AC: weekly(
                cool=six(
                    profile([0, 24.0], tags=("normal",)),
                    profile([0, 28.0], tags=("away",)),
                ),
                away="off",
            )
        }
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    hass.states.async_set("person.anna", "not_home")
    await joe.async_check()
    assert calls == [("set_temperature", AC, 28.0)]
    cfg["climate"]["rooms"][AC]["week"]["enabled"] = False
    await joe.async_check()
    assert calls[1:] == []
    hass.states.async_set("person.anna", "home")
    await joe.async_check()
    assert calls[1:] == [("set_temperature", AC, 24.0)]
    assert joe.status["rooms"][AC]["kind"] == "legacy"


async def test_just_left_on_a_day_off_keeps_the_day_off_profile(
    home: HomeAssistant, freezer
) -> None:
    """The old way: briefly gone on a day off keeps the day-off profile."""
    hass = home
    hass.states.async_set("binary_sensor.workday", "off")
    thermostat(hass)
    calls = devices(hass)
    cfg = config(
        {HMIP: {"free_day_preset": "week_program_3"}}, climate={"away_after_min": 15}
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    await joe.async_check()
    assert calls == [("set_preset_mode", HMIP, "week_program_3")]
    hass.states.async_set("person.anna", "not_home")
    await at(hass, freezer, "10:05")
    await joe.async_check()
    assert joe.status["rooms"][HMIP]["why"] == "just_left"
    assert calls == [("set_preset_mode", HMIP, "week_program_3")]


async def test_calendars_not_there_yet_are_no_answer(
    home: HomeAssistant, freezer
) -> None:
    """Calendars chosen but none can be asked: an error, not "nobody works
    at home"; once read, an answer stands when they are gone again."""
    hass = home
    cfg = config(
        {},
        person={"calendars": ["calendar.anna"]},
        calendar={"default_workday": "office"},
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    await joe.async_check()
    await hass.async_block_till_done()
    await joe.async_check()
    day = joe.status["day"]
    assert day["labels_state"] == "error" and day["labels_at"] is None
    calendar(hass, "Homeoffice")
    await at(hass, freezer, "10:16")
    await joe.async_check()
    await hass.async_block_till_done()
    await joe.async_check()
    day = joe.status["day"]
    assert day["labels_state"] == "ok" and day["home_office"] == ["Anna"]
    read_at = day["labels_at"]
    hass.services.async_remove("calendar", "get_events")
    await at(hass, freezer, "10:32")
    await joe.async_check()
    await hass.async_block_till_done()
    await joe.async_check()
    day = joe.status["day"]
    assert day["labels_state"] == "ok" and day["home_office"] == ["Anna"]
    assert day["labels_at"] == read_at


async def test_off_after_a_mode_without_profiles_stays_on_the_old_way(
    home: HomeAssistant, freezer
) -> None:
    """Heating, with weekly profiles only for cooling: off for nobody home
    stays off (no switching between the two ways every minute)."""
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "heat")
    cfg = config(
        {AC: weekly(cool=six(profile([0, 25.0], tags=("normal",))), away="off")}
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    await joe.async_check()
    hass.states.async_set("person.anna", "not_home")
    for moment in ("10:01", "10:02", "10:03"):
        await at(hass, freezer, moment)
        await joe.async_check()
    assert calls == [("set_hvac_mode", AC, "off")]
    assert joe.status["rooms"][AC]["kind"] == "legacy"


# --- the last review round --------------------------------------------------------


async def test_off_by_hand_after_dry_is_never_switched_on(
    home: HomeAssistant, freezer
) -> None:
    """Dehumidifying (no profiles), lowered the old way while nobody is home,
    then switched off by hand: it stays off (no profiles take it over)."""
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "cool", temperature=24.0)
    cfg = config({AC: weekly(cool=six(profile([0, 25.0], tags=("normal",))))})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "09:00")
    await joe.async_check()
    air_conditioner(hass, "dry", temperature=24.0)
    await joe.async_check()
    assert joe.status["rooms"][AC]["kind"] == "legacy"
    hass.states.async_set("person.anna", "not_home")
    await at(hass, freezer, "10:00")
    await joe.async_check()
    before = len(calls)
    air_conditioner(hass, "off", temperature=27.0)
    for moment in ("10:05", "10:06", "12:00"):
        await at(hass, freezer, moment)
        await joe.async_check()
    assert calls[before:] == []
    assert joe.status["rooms"][AC]["kind"] == "legacy"


async def test_an_off_by_hand_stays_off_while_the_profiles_wait(
    home: HomeAssistant, freezer
) -> None:
    """Lowered the old way, switched off by hand, then weekly profiles: nothing
    switches it on while nobody is home."""
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "heat", temperature=21.0)
    cfg = config({AC: {}})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    hass.states.async_set("person.anna", "not_home")
    await joe.async_check()
    assert calls == [("set_temperature", AC, 18.0)]
    air_conditioner(hass, "off", temperature=18.0)
    cfg = config({AC: weekly(six(profile([0, 21.0], tags=("normal",))))})
    for moment in ("11:00", "12:00", "15:00"):
        await at(hass, freezer, moment)
        await joe.async_check()
    assert calls[1:] == []
    assert joe.status["rooms"][AC]["pending"] == "start"


async def test_a_try_due_after_a_pause_runs_first(home: HomeAssistant, freezer) -> None:
    """Joe's own "on" not shown yet, and the next check comes late (a
    restart): he tries again instead of taking it as switched off by hand."""
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "heat", temperature=21.0)
    cfg = config(
        {AC: weekly(six(profile([0, week.OFF], [390, 21.0], tags=("normal",))))}
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "06:00")
    await joe.async_check()
    assert calls == [("set_hvac_mode", AC, "off")]
    hass.services.async_remove("climate", "set_hvac_mode")
    hass.services.async_remove("climate", "set_temperature")
    hass.services.async_remove("climate", "set_preset_mode")
    calls = devices(hass, take=False)
    await at(hass, freezer, "06:30")
    await joe.async_check()
    assert calls[0] == ("set_hvac_mode", AC, "heat")
    await at(hass, freezer, "06:37")
    await joe.async_check()
    assert calls[-2:][0] == ("set_hvac_mode", AC, "heat")
    assert joe.status["rooms"][AC]["why"] != "off_by_hand"


async def test_the_old_ways_preset_goes_back_before_the_profiles(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    calls = devices(hass)
    air_conditioner(
        hass, "cool", temperature=24.0, preset_modes=["none", "eco"], preset_mode="none"
    )
    cfg = config({AC: {"away": "preset", "away_preset": "eco"}})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    hass.states.async_set("person.anna", "not_home")
    await joe.async_check()
    assert calls == [("set_preset_mode", AC, "eco")]
    cfg = config({AC: weekly(cool=six(profile([0, 24.0], tags=("normal",))))})
    await joe.async_check()
    assert calls[1:] == []
    hass.states.async_set("person.anna", "home")
    await joe.async_check()
    await joe.async_check()
    assert calls[1:] == [("set_preset_mode", AC, "none")]
    assert joe.status["rooms"][AC]["kind"] == "week"


async def test_ending_on_a_home_profile_that_says_off(
    home: HomeAssistant, freezer
) -> None:
    """Profiles off while nobody is home, and the home profile says off now:
    coming home switches it off (not the absence value left running)."""
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "cool", temperature=24.0)
    cfg = config(
        {
            AC: weekly(
                cool=six(
                    profile([0, 24.0], [1320, week.OFF], tags=("normal",)),
                    profile([0, 28.0], tags=("away",)),
                )
            )
        }
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "22:30")
    hass.states.async_set("person.anna", "not_home")
    await joe.async_check()
    assert calls == [("set_temperature", AC, 28.0)]
    cfg["climate"]["rooms"][AC]["week"]["enabled"] = False
    await joe.async_check()
    hass.states.async_set("person.anna", "home")
    await at(hass, freezer, "23:00")
    await joe.async_check()
    assert calls[1:] == [("set_hvac_mode", AC, "off")]


async def test_one_persons_trip_keeps_the_others_usual_homecoming(
    home: HomeAssistant,
) -> None:
    hass = home
    cfg = config({})
    cfg = model.apply_update(
        cfg, {"persons": {"ben": {"id": "ben", "name": "Ben"}}}, "user"
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    now = dt_util.now()
    joe.data["labels"] = {
        "day": dt_util.as_local(now).date().isoformat(),
        "at": now.isoformat(),
        "persons": {"anna": {"label": "travel", "source": "calendar"}},
    }
    anna, ben = cfg["persons"]
    assert joe._on_trip(anna, now) and not joe._on_trip(ben, now)


async def test_a_person_without_calendars_is_no_answer(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    cfg = config(
        {},
        person={"calendars": ["calendar.anna"]},
        calendar={"default_workday": "office"},
    )
    cfg = model.apply_update(
        cfg, {"persons": {"ben": {"id": "ben", "name": "Ben"}}}, "user"
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    await joe.async_check()
    await hass.async_block_till_done()
    await joe.async_check()
    assert joe.status["day"]["labels_at"] is None
    assert joe.status["day"]["labels_state"] == "error"


async def test_a_change_by_hand_ends_at_the_next_point_even_with_the_same_value(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "heat", temperature=21.0)
    cfg = config({AC: weekly(six(profile([0, 21.0], tags=("normal",))))})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    await joe.async_check()
    air_conditioner(hass, "heat", temperature=24.0)
    await at(hass, freezer, "11:00")
    await joe.async_check()
    assert joe.status["rooms"][AC]["why"] == "override"
    await at(hass, freezer, "2026-10-08T00:00:00+02:00")
    await joe.async_check()
    assert calls[-1] == ("set_temperature", AC, 21.0)
    assert joe.status["rooms"][AC]["override"] is None


async def test_a_mode_changed_by_hand_holds_until_the_next_point(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "heat", temperature=21.0)
    cfg = config(
        {
            AC: weekly(
                heat=six(profile([0, 21.0], tags=("normal",))),
                cool=six(profile([0, 25.0], [1200, 26.0], tags=("normal",))),
            )
        }
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    await joe.async_check()
    air_conditioner(hass, "cool", temperature=23.0)
    for moment in ("10:01", "10:02"):
        await at(hass, freezer, moment)
        await joe.async_check()
    assert calls == []
    assert joe.status["rooms"][AC]["why"] == "override"
    await at(hass, freezer, "20:00")
    await joe.async_check()
    assert calls == [("set_temperature", AC, 26.0)]


async def test_a_thermostat_handed_back_while_away_returns_to_normal(
    home: HomeAssistant, freezer
) -> None:
    """The "normal" tick removed while nobody is home: the absence profile
    goes on, and coming home puts the normal profile back."""
    hass = home
    thermostat(hass)
    calls = devices(hass)
    cfg = config(
        {
            HMIP: {
                "device_profiles": {
                    "week_program_1": {"tags": ["normal"]},
                    "week_program_3": {"tags": ["away"]},
                }
            }
        }
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    await joe.async_check()
    hass.states.async_set("person.anna", "not_home")
    await at(hass, freezer, "10:01")
    await joe.async_check()
    assert calls[-1] == ("set_preset_mode", HMIP, "week_program_3")
    cfg["climate"]["rooms"][HMIP]["device_profiles"] = {
        "week_program_3": {"name": "", "tags": ["away"]}
    }
    await at(hass, freezer, "10:02")
    await joe.async_check()
    assert joe.status["rooms"][HMIP]["pending"] == "end"
    hass.states.async_set("person.anna", "home")
    await at(hass, freezer, "12:00")
    await joe.async_check()
    assert hass.states.get(HMIP).attributes["preset_mode"] == "week_program_1"


async def test_off_by_hand_after_another_mode_by_hand_stays_off(
    home: HomeAssistant, freezer
) -> None:
    """Joe's own off (cooling plan), on by hand in heating, then off by hand:
    it stays off (not Joe's off any more)."""
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "cool", temperature=25.0)
    cfg = config(
        {
            AC: weekly(
                heat=six(profile([0, 21.0], tags=("normal",))),
                cool=six(profile([0, 25.0], [1320, week.OFF], tags=("normal",))),
            )
        }
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "22:00")
    await joe.async_check()
    assert calls == [("set_hvac_mode", AC, "off")]
    air_conditioner(hass, "heat", temperature=23.0)
    await at(hass, freezer, "22:30")
    await joe.async_check()
    air_conditioner(hass, "off", temperature=23.0)
    await at(hass, freezer, "22:40")
    await joe.async_check()
    assert calls[1:] == []
    assert joe.status["rooms"][AC]["why"] == "off_by_hand"


async def test_on_by_hand_at_night_lasts_past_midnight(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "cool", temperature=25.0)
    cfg = config(
        {AC: weekly(cool=six(profile([0, 25.0], tags=("normal",))), night_off=True)}
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "23:00")
    await joe.async_check()
    assert calls == [("set_hvac_mode", AC, "off")]
    air_conditioner(hass, "cool", temperature=24.0)
    await at(hass, freezer, "23:30")
    await joe.async_check()
    await at(hass, freezer, "2026-10-08T00:00:00+02:00")
    await joe.async_check()
    assert calls[1:] == []


async def test_a_higher_target_by_hand_does_not_end_the_night(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "off", temperature=20.0)
    cfg = config(
        {
            AC: weekly(
                heat=six(
                    profile(
                        [0, week.OFF], [390, 21.0], [1380, week.OFF], tags=("normal",)
                    )
                ),
                night_off=True,
            )
        }
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "00:55")
    await joe.async_check()
    air_conditioner(hass, "heat", temperature=20.0)
    await at(hass, freezer, "01:00")
    await joe.async_check()
    # Much warmer by hand in a cold room: the time to warm up for the
    # morning must not move the end of the night (and the plan's "off").
    air_conditioner(hass, "heat", temperature=31.0, current_temperature=12.0)
    await at(hass, freezer, "01:05")
    await joe.async_check()
    assert calls == []
    assert joe.status["rooms"][AC]["why"] == "override"


async def test_a_second_mode_change_by_hand_holds_too(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "heat", temperature=21.0)
    cfg = config(
        {
            AC: weekly(
                heat=six(profile([0, 21.0], [1200, 20.0], tags=("normal",))),
                cool=six(profile([0, 25.0], [1200, 26.0], tags=("normal",))),
            )
        }
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    await joe.async_check()
    air_conditioner(hass, "heat", temperature=23.0)
    await at(hass, freezer, "10:05")
    await joe.async_check()
    air_conditioner(hass, "cool", temperature=23.0)
    for moment in ("10:30", "10:31"):
        await at(hass, freezer, moment)
        await joe.async_check()
    assert calls == []


async def test_back_from_dry_by_hand_holds(home: HomeAssistant, freezer) -> None:
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "cool", temperature=25.0)
    cfg = config(
        {AC: weekly(cool=six(profile([0, 25.0], [1200, 26.0], tags=("normal",))))}
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    await joe.async_check()
    air_conditioner(hass, "dry", temperature=25.0)
    await at(hass, freezer, "10:01")
    await joe.async_check()
    air_conditioner(hass, "cool", temperature=22.0)
    await at(hass, freezer, "10:02")
    await joe.async_check()
    assert calls == []
    assert joe.status["rooms"][AC]["why"] == "override"


async def test_the_old_ways_night_does_not_flap_in_the_morning(
    home: HomeAssistant, freezer
) -> None:
    """A room much cooler than its target after the night: back once, not on
    and off every minute."""
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "heat", temperature=21.0, current_temperature=17.0)
    cfg = config({AC: {"night_off": True, "setback_k": 3.0}})
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "23:30")
    await joe.async_check()
    assert calls == [("set_hvac_mode", AC, "off")]
    start = datetime.fromisoformat("2026-10-08T03:00:00+02:00")
    for step in range(120):
        moment = (start + timedelta(minutes=step)).isoformat()
        await at(hass, freezer, moment)
        await joe.async_check()
    assert len(calls) == 2


async def test_the_old_ways_night_stays_while_everybody_just_left(
    home: HomeAssistant, freezer
) -> None:
    """The night ends minutes after everybody left: off it stays, not on and
    off again once they count as away."""
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "heat", temperature=21.0, current_temperature=19.5)
    cfg = config(
        {AC: {"night_off": True, "away": "off"}}, climate={"away_after_min": 15}
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "23:30")
    await joe.async_check()
    assert calls == [("set_hvac_mode", AC, "off")]
    start = datetime.fromisoformat("2026-10-08T05:00:00+02:00")
    for step in range(40):
        if step == 10:
            hass.states.async_set("person.anna", "not_home")
        await at(hass, freezer, (start + timedelta(minutes=step)).isoformat())
        await joe.async_check()
    assert calls[1:] == []
    assert joe.status["rooms"][AC]["why"] == "away"
    hass.states.async_set("person.anna", "home")
    await at(hass, freezer, "2026-10-08T06:00:00+02:00")
    await joe.async_check()
    assert calls[1:] == [("set_hvac_mode", AC, "heat")]


async def test_the_profiles_night_stays_while_everybody_just_left(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    calls = devices(hass)
    air_conditioner(hass, "heat", temperature=23.0, current_temperature=19.5)
    cfg = config(
        {AC: weekly(heat=six(profile([0, 21.0], tags=("normal",))), night_off=True)},
        climate={"away_after_min": 15},
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "23:30")
    await joe.async_check()
    assert calls == [("set_hvac_mode", AC, "off")]
    start = datetime.fromisoformat("2026-10-08T05:00:00+02:00")
    for step in range(40):
        if step == 10:
            hass.states.async_set("person.anna", "not_home")
        await at(hass, freezer, (start + timedelta(minutes=step)).isoformat())
        await joe.async_check()
        if step == 22:
            assert joe.status["rooms"][AC]["why"] == "just_left"
    # Straight to the absence's target, not first back to the day's.
    assert calls[1:] == [
        ("set_hvac_mode", AC, "heat"),
        ("set_temperature", AC, 18.0),
    ]


async def test_a_profile_by_hand_during_the_gap_holds(
    home: HomeAssistant, freezer
) -> None:
    hass = home
    hass.states.async_set("binary_sensor.workday", "off")
    thermostat(hass)
    calls = devices(hass)
    cfg = config(
        {
            HMIP: {
                "device_profiles": {
                    "week_program_1": {"tags": ["normal"]},
                    "week_program_3": {"tags": ["holiday"]},
                }
            }
        }
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await at(hass, freezer, "10:00")
    await joe.async_check()
    assert calls == [("set_preset_mode", HMIP, "week_program_3")]
    hass.states.async_set("binary_sensor.workday", "on")
    await at(hass, freezer, "10:05")
    await joe.async_check()
    thermostat(hass, preset="week_program_2")
    for moment in ("10:07", "10:08", "10:20"):
        await at(hass, freezer, moment)
        await joe.async_check()
    assert calls[1:] == []
