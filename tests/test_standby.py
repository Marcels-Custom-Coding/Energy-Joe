"""Power hogs off at night and while nobody is home."""

from __future__ import annotations

from datetime import datetime
from typing import Any

import pytest

from custom_components.energy_joe import model
from custom_components.energy_joe.control import standby as standby_module
from custom_components.energy_joe.control.standby import (
    StandbyController,
    away_hours,
    away_intervals,
    away_watts,
    night_watts,
    prices,
    yearly,
)
from custom_components.energy_joe.discovery.snapshot import (
    DeviceInfo,
    EntityInfo,
    Snapshot,
)
from custom_components.energy_joe.discovery.standby import find_standby, warning
from homeassistant.core import HomeAssistant, ServiceCall, callback
from homeassistant.util import dt as dt_util

TV = "switch.fernseher_steckdose"
TV_POWER = "sensor.fernseher_steckdose_leistung"
PRESENCE = "binary_sensor.jemand_zu_hause"


def zone_time(*args: int) -> datetime:
    return datetime(*args, tzinfo=dt_util.get_default_time_zone())


# --- finding -----------------------------------------------------------------


def power(entity_id: str, device: str, value: str = "12", **extra: Any) -> EntityInfo:
    return EntityInfo(
        entity_id,
        entity_id,
        value,
        {"device_class": "power", "unit_of_measurement": "W"},
        device_id=device,
        **extra,
    )


def switch(entity_id: str, name: str, device: str, **extra: Any) -> EntityInfo:
    return EntityInfo(entity_id, name, "on", {}, device_id=device, **extra)


def snapshot() -> Snapshot:
    entities = [
        # A plug in the living room.
        switch(TV, "Fernseher-Steckdose", "tv", area="Wohnzimmer"),
        power(TV_POWER, "tv"),
        # A fridge plug: found, with a warning.
        switch("switch.kuehlschrank", "Kühlschrank", "fridge"),
        power("sensor.kuehlschrank_power", "fridge", "60"),
        # The home battery Joe steers (its power reading is in the config).
        switch("switch.speicher_aktiv", "Aktiv", "battery"),
        power("sensor.speicher_leistung", "battery"),
        # A wallbox integration.
        switch("switch.wb_lock", "Sperre", "wallbox", platform="evcc_intg"),
        power("sensor.wb_power", "wallbox", platform="evcc_intg"),
        # An air conditioner with a plug on the same device.
        EntityInfo("climate.buero", "Büro", "cool", {}, device_id="ac"),
        switch("switch.buero_klima", "Büro Klima", "ac"),
        power("sensor.buero_klima_power", "ac"),
        # The switch of a night action Joe runs.
        switch("switch.trockner", "Trockner", "dryer"),
        power("sensor.trockner_power", "dryer"),
        # Only a reading, nothing to switch.
        power("sensor.nur_messen", "meter"),
        # A plug with a settings switch (child lock) next to its outlet.
        switch("switch.drucker", "Drucker", "printer"),
        switch("switch.drucker_kindersicherung", "Kindersicherung", "printer"),
        power("sensor.drucker_power", "printer"),
    ]
    return Snapshot(
        entities={e.entity_id: e for e in entities},
        devices={
            "tv": DeviceInfo("tv", "Fernseher", area="Wohnzimmer"),
            "fridge": DeviceInfo("fridge", "Kühlschrank Küche", area="Küche"),
            "printer": DeviceInfo("printer", "Drucker", area="Büro"),
        },
    )


def joe_config(**standby: Any) -> dict[str, Any]:
    return model.apply_update(
        model.default_config(),
        {
            "batteries": [
                {
                    "id": "bat",
                    "name": "Speicher",
                    "adapter": "generic",
                    "soc_entity": "sensor.speicher_soc",
                    "power_entity": "sensor.speicher_leistung",
                }
            ],
            "actions": [
                {
                    "id": "dryer",
                    "name": "Trockner",
                    "entity_id": "switch.trockner",
                    "kind": "switch",
                }
            ],
            "context": {"presence_entity": PRESENCE},
            "climate": {"away_after_min": 0},
            "standby": {"devices": standby},
        },
        "user",
    )


def test_finds_plugs_and_leaves_out_what_joe_knows() -> None:
    found = find_standby(
        snapshot(), joe_config(), categorized={"switch.drucker_kindersicherung"}
    )
    by_id = {d["entity_id"]: d for d in found}
    assert set(by_id) == {TV, "switch.kuehlschrank", "switch.drucker"}
    assert by_id[TV]["power_entity"] == TV_POWER
    assert by_id[TV]["area"] == "Wohnzimmer"
    assert by_id[TV]["watts"] == 12.0
    assert by_id[TV]["warning"] is None
    # Sounds like it has to keep running: a warning, still in the list.
    assert by_id["switch.kuehlschrank"]["warning"] == "kühl"
    assert by_id["switch.kuehlschrank"]["area"] == "Küche"


def test_warning_words() -> None:
    assert warning("FRITZ!Box") == "fritz"
    assert warning("Aquarium Wohnzimmer") == "aquarium"
    assert warning("Teichpumpe") == "pumpe"
    assert warning("NAS") == "nas"
    assert warning("Nase") is None
    assert warning("Fernseher") is None


# --- measuring ---------------------------------------------------------------


def test_night_and_away_draw_and_money_a_year() -> None:
    series: dict[datetime, float] = {}
    # Three nights: 10 W, 12 W and 50 W between 1 and 5 o'clock (median 12),
    # 100 W during the evening (not the deep night).
    for day, watts in ((5, 10.0), (6, 12.0), (7, 50.0)):
        for hour in range(1, 5):
            series[zone_time(2026, 10, day, hour)] = watts
        series[zone_time(2026, 10, day, 20)] = 100.0
    assert night_watts(series) == (12.0, 3)
    # Nobody home on the 6th from 9:30 to 12:10: 10, 11 o'clock count.
    spans = away_intervals(
        [
            (zone_time(2026, 10, 6, 0), "on"),
            (zone_time(2026, 10, 6, 9, 30), "off"),
            (zone_time(2026, 10, 6, 12, 10), "on"),
        ],
        zone_time(2026, 10, 7),
    )
    hours = away_hours(spans)
    assert hours == [zone_time(2026, 10, 6, 10), zone_time(2026, 10, 6, 11)]
    for hour in hours:
        series[hour] = 8.0
    assert away_watts(series, hours) == (8.0, 2)
    # 12 W over a night of 23:00–06:30 (7.5 h) are 32.85 kWh a year; away
    # 2 h in 2 days (1 h a day) at 8 W are 2.92 kWh.
    device = {"night_from": "23:00", "night_until": "06:30"}
    price = {"night": 0.2, "day": 0.3, "assumed": False}
    money = yearly(device, 12.0, 8.0, hours, 2.0, price)
    assert money["kwh"] == {"night": 32.9, "away": 2.9, "both": 35.8}
    assert money["eur"]["night"] == pytest.approx(6.57)
    assert money["eur"]["away"] == pytest.approx(0.88)
    assert money["eur"]["both"] == pytest.approx(6.57 + 0.88, abs=0.01)


async def test_prices_from_the_tariff(hass: HomeAssistant) -> None:
    assert prices(hass, {"kind": "unknown"}) == {
        "night": 0.30,
        "day": 0.30,
        "assumed": True,
    }
    fixed = {"kind": "fixed_window", "night_price": 0.22, "day_price": 0.35}
    assert prices(hass, fixed)["night"] == 0.22
    assert prices(hass, {"kind": "flat", "day_price": 0.31})["night"] == 0.31
    hass.states.async_set("sensor.preis", "25", {"unit_of_measurement": "ct/kWh"})
    dynamic = {"kind": "dynamic", "price_entity": "sensor.preis", "surcharge": 0.1}
    assert prices(hass, dynamic)["day"] == pytest.approx(0.35)


async def test_the_list_measures_from_the_recorder(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    """Only devices worth a line, the most money first; the measurement
    before Joe switched stays."""
    cfg = joe_config()
    snap = snapshot()

    async def collect(hass: HomeAssistant) -> Snapshot:
        return snap

    nights = {
        TV_POWER: 12.0,
        "sensor.kuehlschrank_power": 40.0,
        "sensor.drucker_power": 1.0,
    }

    async def history(hass, entities, start, end):
        return {
            entity: {
                zone_time(2026, 10, day, hour): watts
                for day in (5, 6)
                for hour in range(1, 5)
            }
            for entity, watts in nights.items()
            if entity in entities
        }

    async def presence(hass, entity_id, start, end):
        return []

    monkeypatch.setattr(standby_module, "async_collect", collect)
    monkeypatch.setattr(standby_module, "async_power_history", history)
    monkeypatch.setattr(standby_module, "async_presence_history", presence)
    joe = StandbyController(hass, lambda: cfg, lambda: "live", lambda: None)
    found = await joe.async_devices()
    ids = [d["entity_id"] for d in found["devices"]]
    # The printer draws 1 W: below the threshold.
    assert ids == ["switch.kuehlschrank", TV]
    tv = found["devices"][1]
    assert tv["night_w"] == 12.0
    assert tv["nights"] == 2
    assert tv["when"] == "never"
    assert tv["eur"]["night"] == pytest.approx(12 * 7.5 * 365 / 1000 * 0.30, abs=0.01)
    # Once Joe switches it at night, the night reads about nothing.
    cfg = joe_config(**{TV: {"when": "night", "power_entity": TV_POWER}})
    nights[TV_POWER] = 0.0
    found = await joe.async_devices(refresh=True)
    tv = next(d for d in found["devices"] if d["entity_id"] == TV)
    assert tv["night_w"] == 12.0
    assert tv["when"] == "night"


# --- switching ---------------------------------------------------------------


def install(hass: HomeAssistant) -> list[tuple[str, str]]:
    calls: list[tuple[str, str]] = []
    hass.states.async_set(TV, "on", {"friendly_name": "Fernseher-Steckdose"})
    hass.states.async_set(TV_POWER, "12", {"unit_of_measurement": "W"})
    hass.states.async_set(PRESENCE, "on")

    def handle(service: str):
        @callback
        def call(c: ServiceCall) -> None:
            ids = c.data["entity_id"]
            for entity_id in [ids] if isinstance(ids, str) else ids:
                calls.append((service, entity_id))
                state = hass.states.get(entity_id)
                hass.states.async_set(
                    entity_id,
                    "on" if service == "turn_on" else "off",
                    state.attributes,
                )

        return call

    for service in ("turn_on", "turn_off"):
        hass.services.async_register("switch", service, handle(service))
    return calls


def controller(
    hass: HomeAssistant, when: str, mode: str = "live", **device: Any
) -> tuple[StandbyController, dict[str, Any]]:
    cfg = joe_config(**{TV: {"when": when, "power_entity": TV_POWER, **device}})
    joe = StandbyController(hass, lambda: cfg, lambda: mode, lambda: None)
    return joe, cfg


async def test_nothing_is_switched_without_consent(
    hass: HomeAssistant, freezer
) -> None:
    calls = install(hass)
    freezer.move_to(zone_time(2026, 10, 20, 1))
    hass.states.async_set(PRESENCE, "off")
    joe, _ = controller(hass, "never")
    await joe.async_load()
    await joe.async_check()
    await joe.async_check()
    assert calls == []
    assert joe.status["devices"] == {}
    # Nothing chosen at all: the same.
    cfg = model.default_config()
    joe = StandbyController(hass, lambda: cfg, lambda: "live", lambda: None)
    await joe.async_check()
    assert calls == []


async def test_off_at_night_and_on_again_in_the_morning(
    hass: HomeAssistant, freezer
) -> None:
    calls = install(hass)
    joe, _ = controller(hass, "night")
    freezer.move_to(zone_time(2026, 10, 19, 22))
    await joe.async_check()
    assert calls == []
    freezer.move_to(zone_time(2026, 10, 19, 23, 5))
    await joe.async_check()
    assert calls == [("turn_off", TV)]
    assert joe.data["off"][TV]["causes"] == ["night"]
    assert joe.data["log"][-1] == {
        "at": joe.data["log"][-1]["at"],
        "entity": TV,
        "what": "off",
        "why": "night",
        "watts": 12,
    }
    # Nobody home does not count for "night".
    hass.states.async_set(PRESENCE, "off")
    freezer.move_to(zone_time(2026, 10, 20, 6, 31))
    await joe.async_check()
    assert calls == [("turn_off", TV), ("turn_on", TV)]
    assert joe.data["off"] == {}
    assert joe.data["log"][-1]["what"] == "on"
    assert joe.data["log"][-1]["why"] == "morning"


async def test_off_while_away_and_on_again_when_somebody_comes_home(
    hass: HomeAssistant, freezer
) -> None:
    calls = install(hass)
    joe, cfg = controller(hass, "away")
    cfg["climate"]["away_after_min"] = 15
    freezer.move_to(zone_time(2026, 10, 20, 9))
    await joe.async_check()
    hass.states.async_set(PRESENCE, "off")
    await joe.async_check()
    # Not long enough to count as away.
    assert calls == []
    freezer.move_to(zone_time(2026, 10, 20, 9, 16))
    await joe.async_check()
    assert calls == [("turn_off", TV)]
    # The helper unknown for a moment: nothing changes.
    hass.states.async_set(PRESENCE, "unavailable")
    await joe.async_check()
    assert calls == [("turn_off", TV)]
    hass.states.async_set(PRESENCE, "on")
    await joe.async_check()
    assert calls == [("turn_off", TV), ("turn_on", TV)]
    assert joe.data["log"][-1]["why"] == "home"


async def test_switched_by_the_owner_joe_leaves_it(
    hass: HomeAssistant, freezer
) -> None:
    calls = install(hass)
    joe, _ = controller(hass, "both")
    joe.async_start()
    freezer.move_to(zone_time(2026, 10, 20, 0, 30))
    await joe.async_check()
    assert calls == [("turn_off", TV)]
    # The owner switches it on again during the night: his for this night.
    hass.states.async_set(TV, "on", {"friendly_name": "Fernseher-Steckdose"})
    await hass.async_block_till_done()
    await joe.async_check()
    assert joe.data["off"] == {}
    assert joe.status["devices"][TV]["declined"]
    assert calls == [("turn_off", TV)]
    assert joe.data["log"][-1]["what"] == "owner"
    # In the morning nothing to put back.
    freezer.move_to(zone_time(2026, 10, 20, 7))
    await joe.async_check()
    assert calls == [("turn_off", TV)]
    # The next night is Joe's again.
    freezer.move_to(zone_time(2026, 10, 20, 23, 30))
    await joe.async_check()
    assert calls == [("turn_off", TV), ("turn_off", TV)]
    # Switched on and off again by the owner: not Joe's to switch on.
    hass.states.async_set(TV, "on", {"friendly_name": "Fernseher-Steckdose"})
    await hass.async_block_till_done()
    hass.states.async_set(TV, "off", {"friendly_name": "Fernseher-Steckdose"})
    await hass.async_block_till_done()
    freezer.move_to(zone_time(2026, 10, 21, 7))
    await joe.async_check()
    assert calls == [("turn_off", TV), ("turn_off", TV)]
    assert hass.states.get(TV).state == "off"
    joe.async_stop()
    await hass.async_block_till_done()


async def test_off_already_is_not_joes(hass: HomeAssistant, freezer) -> None:
    calls = install(hass)
    hass.states.async_set(TV, "off")
    joe, _ = controller(hass, "night")
    freezer.move_to(zone_time(2026, 10, 20, 1))
    await joe.async_check()
    freezer.move_to(zone_time(2026, 10, 20, 7))
    await joe.async_check()
    assert calls == []


async def test_only_live_switches(hass: HomeAssistant, freezer) -> None:
    calls = install(hass)
    mode = ["simulation"]
    cfg = joe_config(**{TV: {"when": "night", "power_entity": TV_POWER}})
    joe = StandbyController(hass, lambda: cfg, lambda: mode[0], lambda: None)
    freezer.move_to(zone_time(2026, 10, 20, 1))
    await joe.async_check()
    assert calls == []
    assert joe.status["devices"][TV]["would"] == "off"
    assert not joe.status["live"]
    mode[0] = "live"
    await joe.async_check()
    assert calls == [("turn_off", TV)]
    # Back to the simulation (or Joe off): everything goes on again.
    mode[0] = "off"
    await joe.async_check()
    assert calls == [("turn_off", TV), ("turn_on", TV)]
    assert joe.data["off"] == {}


async def test_chosen_no_longer_goes_back_on(hass: HomeAssistant, freezer) -> None:
    calls = install(hass)
    joe, cfg = controller(hass, "night")
    freezer.move_to(zone_time(2026, 10, 20, 1))
    await joe.async_check()
    cfg["standby"]["devices"][TV]["when"] = "never"
    await joe.async_check()
    assert calls == [("turn_off", TV), ("turn_on", TV)]
    assert joe.data["log"][-1]["why"] == "stopped"


async def test_night_from_the_bedtime_entity(hass: HomeAssistant, freezer) -> None:
    calls = install(hass)
    joe, cfg = controller(hass, "night")
    cfg["climate"].update(night_by="entity", night_entity="input_boolean.gute_nacht")
    freezer.move_to(zone_time(2026, 10, 19, 21))
    hass.states.async_set("input_boolean.gute_nacht", "off")
    await joe.async_check()
    assert calls == []
    hass.states.async_set("input_boolean.gute_nacht", "on")
    await joe.async_check()
    assert calls == [("turn_off", TV)]
    # Nobody switched the night off: on again at the morning time all the same.
    freezer.move_to(zone_time(2026, 10, 20, 6, 31))
    await joe.async_check()
    assert calls == [("turn_off", TV), ("turn_on", TV)]


async def test_removing_joe_switches_on_again(hass: HomeAssistant, freezer) -> None:
    calls = install(hass)
    joe, _ = controller(hass, "night")
    freezer.move_to(zone_time(2026, 10, 20, 1))
    await joe.async_check()
    other = StandbyController(hass, lambda: {}, lambda: "live", lambda: None)
    await other.async_remove()
    assert calls == [("turn_off", TV), ("turn_on", TV)]
