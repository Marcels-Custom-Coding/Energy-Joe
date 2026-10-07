"""Heating and air conditioning by presence."""

from __future__ import annotations

from typing import Any

import pytest

from custom_components.energy_joe import model
from custom_components.energy_joe.control import climate as climate_module
from custom_components.energy_joe.control.climate import ClimateController
from homeassistant.core import HomeAssistant, ServiceCall

ROOM = "climate.wohnzimmer"
PRESETS = ["Standard", "Abwesend", "Feiertag"]


def install(hass: HomeAssistant) -> list[tuple[str, dict[str, Any]]]:
    calls: list[tuple[str, dict[str, Any]]] = []
    hass.states.async_set(
        ROOM,
        "heat",
        {
            "temperature": 21.0,
            "current_temperature": 21.0,
            "preset_mode": "Standard",
            "preset_modes": PRESETS,
            "hvac_modes": ["heat", "off"],
        },
    )
    hass.states.async_set("person.marcel", "home")
    hass.states.async_set("binary_sensor.workday", "on")

    def handle(service: str):
        def call(c: ServiceCall) -> None:
            calls.append((service, dict(c.data)))
            state = hass.states.get(ROOM)
            attrs = dict(state.attributes)
            value = state.state
            if service == "set_temperature":
                attrs["temperature"] = c.data["temperature"]
            elif service == "set_preset_mode":
                attrs["preset_mode"] = c.data["preset_mode"]
            elif service == "set_hvac_mode":
                value = c.data["hvac_mode"]
            hass.states.async_set(ROOM, value, attrs)

        return call

    for service in ("set_temperature", "set_preset_mode", "set_hvac_mode"):
        hass.services.async_register("climate", service, handle(service))
    return calls


def config(**room: Any) -> dict[str, Any]:
    return model.apply_update(
        model.default_config(),
        {
            "persons": {
                "marcel": {
                    "id": "marcel",
                    "name": "Marcel",
                    "person_entity": "person.marcel",
                }
            },
            "context": {"holiday_entity": "binary_sensor.workday"},
            # Away at once (the delay has tests of its own).
            "climate": {
                "enabled": True,
                "away_after_min": 0,
                "rooms": {ROOM: {"enabled": True, **room}},
            },
        },
        "user",
    )


async def test_away_lowers_and_home_puts_back(hass: HomeAssistant) -> None:
    calls = install(hass)
    cfg = config()
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    await joe.async_load()
    await joe.async_check()
    assert calls == []
    hass.states.async_set("person.marcel", "not_home")
    await joe.async_check()
    assert hass.states.get(ROOM).attributes["temperature"] == 18.0
    hass.states.async_set("person.marcel", "home")
    await joe.async_check()
    assert hass.states.get(ROOM).attributes["temperature"] == 21.0
    assert joe.data["saved"] == {}


async def test_simulation_only_says_what_it_would_do(hass: HomeAssistant) -> None:
    calls = install(hass)
    cfg = config()
    joe = ClimateController(hass, lambda: cfg, lambda: "simulation", lambda: None)
    hass.states.async_set("person.marcel", "not_home")
    await joe.async_check()
    assert calls == []
    assert joe.status["rooms"][ROOM]["want"] == "away"


async def test_profiles_and_days_off(hass: HomeAssistant) -> None:
    install(hass)
    cfg = config(away="preset", away_preset="Abwesend", free_day_preset="Feiertag")
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    hass.states.async_set("person.marcel", "not_home")
    await joe.async_check()
    assert hass.states.get(ROOM).attributes["preset_mode"] == "Abwesend"
    hass.states.async_set("person.marcel", "home")
    hass.states.async_set("binary_sensor.workday", "off")
    await joe.async_check()
    assert hass.states.get(ROOM).attributes["preset_mode"] == "Feiertag"
    hass.states.async_set("binary_sensor.workday", "on")
    await joe.async_check()
    assert hass.states.get(ROOM).attributes["preset_mode"] == "Standard"


async def test_heading_home_warms_up_in_time(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    install(hass)
    cfg = config()
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    hass.states.async_set("person.marcel", "not_home")
    await joe.async_check()
    assert hass.states.get(ROOM).attributes["temperature"] == 18.0
    # The room cooled down to 18 °C.
    attrs = {**hass.states.get(ROOM).attributes, "current_temperature": 18.0}
    hass.states.async_set(ROOM, "heat", attrs)
    # 3 K at 1.5 K/h is 2 h (plus a margin): 60 km at 40 km/h is 1.5 h away.
    monkeypatch.setattr(
        climate_module,
        "arrivals",
        lambda hass: {"person.marcel": {"km": 60.0, "direction": "towards"}},
    )
    await joe.async_check()
    assert hass.states.get(ROOM).attributes["temperature"] == 21.0
    assert joe.status["rooms"][ROOM]["why"] == "arriving"


async def test_switching_joe_off_puts_rooms_back(hass: HomeAssistant) -> None:
    install(hass)
    cfg = config()
    mode = {"now": "live"}
    joe = ClimateController(hass, lambda: cfg, lambda: mode["now"], lambda: None)
    hass.states.async_set("person.marcel", "not_home")
    await joe.async_check()
    assert hass.states.get(ROOM).attributes["temperature"] == 18.0
    mode["now"] = "simulation"
    await joe.async_check()
    assert hass.states.get(ROOM).attributes["temperature"] == 21.0


async def test_a_holiday_calendar_tells_the_days_off(hass: HomeAssistant) -> None:
    """A calendar with holidays: a weekday with an entry is a day off."""
    from datetime import date

    from custom_components.energy_joe.plan.inputs import async_workday

    entity = "calendar.feiertage"
    holiday = date(2026, 10, 7)  # a Wednesday

    async def events(call: ServiceCall) -> dict[str, Any]:
        day = call.data["start_date_time"]
        day = day.date() if hasattr(day, "date") else date.fromisoformat(str(day)[:10])
        found = [{"summary": "Feiertag"}] if day == holiday else []
        return {entity: {"events": found}}

    from homeassistant.core import SupportsResponse

    hass.services.async_register(
        "calendar", "get_events", events, supports_response=SupportsResponse.ONLY
    )
    assert await async_workday(hass, entity, holiday) is False
    assert await async_workday(hass, entity, date(2026, 10, 8)) is True
    assert await async_workday(hass, entity, date(2026, 10, 10)) is False


async def test_night_from_an_entity(hass: HomeAssistant) -> None:
    """Night while the entity is on (in bed), back in time for the morning."""
    from datetime import datetime

    from homeassistant.util import dt as dt_util

    install(hass)
    cfg = config(night_off=True, night_until="06:30")
    cfg["climate"].update(night_by="entity", night_entity="input_boolean.gute_nacht")
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    room = cfg["climate"]["rooms"][ROOM]
    zone = dt_util.get_default_time_zone()
    late = datetime(2026, 1, 10, 21, 0, tzinfo=zone)
    hass.states.async_set("input_boolean.gute_nacht", "off")
    assert not joe._night(room, late, ROOM)
    hass.states.async_set("input_boolean.gute_nacht", "on")
    assert joe._night(room, late, ROOM)
    assert joe.desired(ROOM, room, late) == ("night", "night")
    # Shortly before the morning the room comes back, entity or not.
    assert not joe._night(room, datetime(2026, 1, 11, 6, 20, tzinfo=zone), ROOM)
    # Fixed times are not used while an entity tells the night.
    cfg["climate"]["night_entity"] = None
    cfg["climate"]["night_by"] = "time"
    assert joe._night(room, datetime(2026, 1, 12, 1, 0, tzinfo=zone), ROOM)


async def test_the_presence_entity_alone_decides(hass: HomeAssistant) -> None:
    """Nobody tracked is home, but the helper (guest switch inside) is on."""
    install(hass)
    cfg = config()
    cfg["context"]["presence_entity"] = "binary_sensor.jemand_zu_hause"
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    hass.states.async_set("person.marcel", "not_home")
    hass.states.async_set(
        "binary_sensor.jemand_zu_hause", "on", {"friendly_name": "Jemand zu Hause"}
    )
    await joe.async_check()
    assert hass.states.get(ROOM).attributes["temperature"] == 21.0
    assert joe.status["home"] == ["Jemand zu Hause"]
    # The person says home, the helper says nobody: the helper counts.
    hass.states.async_set("person.marcel", "home")
    hass.states.async_set("binary_sensor.jemand_zu_hause", "off")
    await joe.async_check()
    assert hass.states.get(ROOM).attributes["temperature"] < 21.0


async def test_drive_time_from_the_routing_service(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    """The real drive decides, not 40 km/h: a jam keeps the room down."""
    from datetime import timedelta

    from homeassistant.util import dt as dt_util

    install(hass)
    cfg = config()
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    hass.states.async_set(
        "person.marcel", "not_home", {"latitude": 50.1, "longitude": 8.6}
    )
    monkeypatch.setattr(
        climate_module,
        "arrivals",
        lambda hass: {"person.marcel": {"km": 20.0, "direction": "towards"}},
    )
    minutes = {"value": 200}

    async def drive(hass, routing, lat, lon):
        assert (lat, lon) == (50.1, 8.6)
        return {"minutes": minutes["value"], "source": "osm"}

    monkeypatch.setattr(climate_module, "async_drive_home", drive)
    now = dt_util.now()
    await joe._async_etas(now)
    # 20 km would be 30 min at 40 km/h – but the jam says 200 min.
    assert joe._arriving(timedelta(minutes=130), now) is None
    minutes["value"] = 25
    await joe._async_etas(now + timedelta(minutes=6))
    assert (
        joe._arriving(timedelta(minutes=130), now + timedelta(minutes=6)) == "arriving"
    )
    assert joe._etas["person.marcel"]["source"] == "osm"


async def test_the_usual_homecoming(hass: HomeAssistant, monkeypatch) -> None:
    """Weekdays at 17:30: warm by then, before anyone sets off; and someone
    passing by at another time does not count unless steadily approaching."""
    from datetime import datetime, timedelta

    from homeassistant.util import dt as dt_util

    install(hass)
    cfg = config()
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    zone = dt_util.get_default_time_zone()
    today = datetime(2026, 10, 7, tzinfo=zone)  # a Wednesday
    for back in range(1, 8):
        day = today - timedelta(days=back)
        if day.weekday() < 5:
            joe.data["homecomings"].setdefault("person.marcel", []).append(
                {"at": day.replace(hour=17, minute=30).isoformat(), "free": False}
            )
    hass.states.async_set("person.marcel", "not_home")
    monkeypatch.setattr(climate_module, "arrivals", lambda hass: {})
    lead = timedelta(minutes=130)
    assert joe._arriving(lead, today.replace(hour=14, minute=0)) is None
    assert joe._arriving(lead, today.replace(hour=15, minute=30)) == "arriving_usual"
    # Clearly too far away to make it: 5 h drive.
    monkeypatch.setattr(
        climate_module,
        "arrivals",
        lambda hass: {"person.marcel": {"km": 300.0, "direction": "away_from"}},
    )
    joe._etas["person.marcel"] = {
        "minutes": 300,
        "source": "osm",
        "at": today.replace(hour=15, minute=30),
    }
    assert joe._arriving(lead, today.replace(hour=15, minute=30)) is None
    # 10:00, 5 km away and heading this way once: just passing by.
    joe._etas.clear()
    monkeypatch.setattr(
        climate_module,
        "arrivals",
        lambda hass: {"person.marcel": {"km": 5.0, "direction": "towards"}},
    )
    ten = today.replace(hour=10)
    assert joe._arriving(lead, ten) is None
    # Steadily closer (8 km five minutes ago): really coming home.
    joe._seen_km["person.marcel"] = [(ten - timedelta(minutes=5), 8.0), (ten, 5.0)]
    assert joe._arriving(lead, ten) == "arriving"


async def test_homecomings_are_noted(hass: HomeAssistant) -> None:
    install(hass)
    cfg = config()
    joe = ClimateController(hass, lambda: cfg, lambda: "simulation", lambda: None)
    hass.states.async_set("person.marcel", "not_home")
    joe.async_start()
    hass.states.async_set("person.marcel", "home")
    await hass.async_block_till_done()
    joe.async_stop()
    entries = joe.data["homecomings"]["person.marcel"]
    assert len(entries) == 1 and entries[0]["free"] is False


async def test_a_guest_keeps_the_group_home(hass: HomeAssistant) -> None:
    """Nobody tracked is home; the guest tracker (in the group) is: shown as the guest."""
    install(hass)
    cfg = config()
    cfg["context"].update(
        presence_entity="group.anwesenheit_jemand",
        guest_switch="input_boolean.gastmodus",
        guest_tracker="device_tracker.gast",
    )
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    hass.states.async_set("person.marcel", "not_home")
    hass.states.async_set("device_tracker.gast", "home", {"friendly_name": "Gast"})
    hass.states.async_set("group.anwesenheit_jemand", "home")
    await joe.async_check()
    assert joe.status["home"] == ["Gast"]
    assert hass.states.get(ROOM).attributes["temperature"] == 21.0
