"""Joe's calendar for a car whose mailbox has none: by hand, as trips, as a link."""

from __future__ import annotations

from datetime import timedelta
from typing import Any

from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.typing import (
    ClientSessionGenerator,
    WebSocketGenerator,
)

from custom_components.energy_joe.const import DOMAIN
from custom_components.energy_joe.plan.car_calendar import CarCalendarStore, to_ics
from custom_components.energy_joe.plan.trips import PlaceStore, async_trips
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

CAR = {
    "id": "kona",
    "name": "KONA",
    "kind": "switch",
    "entity_id": "select.carport_mode",
    "on_value": "now",
    "need": {
        "enabled": True,
        "soc_entity": "sensor.kona_soc",
        "capacity_kwh": 64,
        "source": "mailbox",
        "mailbox": {"provider": "webde", "address": "kona@example.org"},
    },
}


async def _setup(hass: HomeAssistant) -> Any:
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    runtime = hass.data[DOMAIN]
    runtime.async_update_config({"actions": [CAR]}, "user")
    await hass.async_block_till_done()
    return runtime


def _calendar_id(hass: HomeAssistant) -> str:
    (entity_id,) = [s.entity_id for s in hass.states.async_all("calendar")]
    return entity_id


async def test_a_car_gets_its_own_calendar(
    ready_hass: HomeAssistant, hass_ws_client: WebSocketGenerator
) -> None:
    hass = ready_hass
    runtime = await _setup(hass)
    ws = await hass_ws_client(hass)
    calendar = _calendar_id(hass)
    tomorrow = dt_util.now().date() + timedelta(days=1)
    start = dt_util.start_of_local_day(tomorrow)
    await hass.services.async_call(
        "calendar",
        "create_event",
        {
            "entity_id": calendar,
            "summary": "Messe",
            "start_date_time": (start + timedelta(hours=9)).isoformat(),
            "end_date_time": (start + timedelta(hours=17)).isoformat(),
            "location": "Messe Hannover",
        },
        blocking=True,
    )
    await hass.async_block_till_done()
    (event,) = runtime.calendars.events("kona")
    assert event["location"] == "Messe Hannover"
    assert event["start"] == (start + timedelta(hours=9)).isoformat()
    assert hass.states.get(calendar).attributes["message"] == "Messe"
    response = await hass.services.async_call(
        "calendar",
        "get_events",
        {
            "entity_id": calendar,
            "start_date_time": start.isoformat(),
            "end_date_time": (start + timedelta(days=1)).isoformat(),
        },
        blocking=True,
        return_response=True,
    )
    assert response[calendar]["events"][0]["location"] == "Messe Hannover"
    # The trip planner reads the car's own appointments of the day.
    own = runtime.calendars.events("kona", start, start + timedelta(days=1))

    async def route(routing: Any, text: str) -> dict[str, Any]:
        return {"km": 120.0, "minutes": 80, "source": "osm"}

    places = PlaceStore(hass)
    places.async_distance = route  # type: ignore[method-assign]
    need = runtime.config["actions"][0]["need"]
    trips = await async_trips(hass, runtime.config, need, places, tomorrow, own)
    assert [t["location"] for t in trips] == ["Messe Hannover"]
    assert trips[0]["km"] == 240.0
    # Deleted in Home Assistant's calendar: gone.
    await ws.send_json_auto_id(
        {"type": "calendar/event/delete", "entity_id": calendar, "uid": event["uid"]}
    )
    assert (await ws.receive_json())["success"]
    assert runtime.calendars.events("kona") == []


async def test_the_subscription_link(
    ready_hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    hass_client_no_auth: ClientSessionGenerator,
) -> None:
    hass = ready_hass
    runtime = await _setup(hass)
    ws = await hass_ws_client(hass)
    tomorrow = dt_util.start_of_local_day(dt_util.now().date() + timedelta(days=1))
    begin = tomorrow + timedelta(hours=8, minutes=30)
    runtime.calendars.add(
        "kona",
        {
            "summary": "Zahnarzt; Kontrolle",
            "start": begin.isoformat(),
            "end": (begin + timedelta(minutes=30)).isoformat(),
            "location": "Hauptstraße 1, Potsdam",
        },
    )
    await ws.send_json_auto_id({"type": f"{DOMAIN}/calendar/links"})
    msg = await ws.receive_json()
    path = msg["result"]["links"]["kona"]
    client = await hass_client_no_auth()
    response = await client.get(path)
    assert response.status == 200
    body = await response.text()
    assert "SUMMARY:Zahnarzt\\; Kontrolle" in body
    assert "LOCATION:Hauptstraße 1\\, Potsdam" in body
    assert f"DTSTART:{dt_util.as_utc(begin).strftime('%Y%m%dT%H%M%SZ')}" in body
    # A wrong secret, or a new one: the old link stops working.
    assert (await client.get(path.replace("/kona.ics", "x/kona.ics"))).status == 404
    await ws.send_json_auto_id({"type": f"{DOMAIN}/calendar/links", "renew": True})
    renewed = (await ws.receive_json())["result"]["links"]["kona"]
    assert renewed != path
    assert (await client.get(path)).status == 404
    assert (await client.get(renewed)).status == 200


async def test_only_a_mailbox_without_calendar_gets_joes_calendar(
    ready_hass: HomeAssistant,
) -> None:
    hass = ready_hass
    runtime = await _setup(hass)
    calendar = _calendar_id(hass)
    tomorrow = (dt_util.now() + timedelta(days=1)).date()
    day = {
        "start": tomorrow.isoformat(),
        "end": (tomorrow + timedelta(days=1)).isoformat(),
    }
    runtime.calendars.add("kona", {**day, "summary": "Messe", "source": "mail"})
    # A finished calendar of the car: Joe's calendar goes away …
    finished = {"actions": [{**CAR, "need": {**CAR["need"], "source": "ha"}}]}
    runtime.async_update_config(finished, "user")
    await hass.async_block_till_done()
    assert hass.states.async_all("calendar") == []
    # … and comes back with its appointments when the car reads its mailbox again.
    runtime.async_update_config({"actions": [CAR]}, "user")
    await hass.async_block_till_done()
    assert _calendar_id(hass) == calendar
    assert [e["summary"] for e in runtime.calendars.events("kona")] == ["Messe"]
    # A trip entered by hand (every car had Joe's calendar up to 0.3) keeps it
    # until it is over, and it counts.
    trip = runtime.calendars.add("kona", {**day, "summary": "Oma", "location": "Kiel"})
    runtime.async_update_config(finished, "user")
    await hass.async_block_till_done()
    assert _calendar_id(hass) == calendar
    runtime.calendars.delete("kona", trip["uid"])
    await hass.async_block_till_done()
    assert hass.states.async_all("calendar") == []


def test_ics_folds_long_lines_and_whole_days() -> None:
    text = to_ics(
        "KONA",
        [
            {
                "uid": "a@b",
                "summary": "Urlaub " + "ä" * 60,
                "start": "2026-10-10",
                "end": "2026-10-12",
            }
        ],
    )
    assert "DTSTART;VALUE=DATE:20261010" in text
    assert "DTEND;VALUE=DATE:20261012" in text
    for line in text.split("\r\n"):
        assert len(line.encode()) <= 75


async def test_store_keeps_cars_apart(hass: HomeAssistant) -> None:
    store = CarCalendarStore(hass)
    await store.async_load()
    first = store.add(
        "kona", {"start": "2026-10-05", "end": "2026-10-06", "summary": "A"}
    )
    store.add("eup", {"start": "2026-10-05", "end": "2026-10-06", "summary": "B"})
    assert [e["summary"] for e in store.events("kona")] == ["A"]
    assert store.get("kona", first["uid"]) is not None
    assert (
        store.update("kona", first["uid"], {"location": "Berlin"})["location"]
        == "Berlin"
    )
    assert store.delete("kona", first["uid"]) is True
    assert store.delete("kona", first["uid"]) is False
    await store.async_remove()
