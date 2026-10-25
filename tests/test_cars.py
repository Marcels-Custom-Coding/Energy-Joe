"""Cars and charge points: which car is plugged in, its values, asking and reminding."""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any
from unittest.mock import patch as mock_patch

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.energy_joe import model
from custom_components.energy_joe.const import DOMAIN
from custom_components.energy_joe.control.cars import CarWatcher
from custom_components.energy_joe.discovery import car_updates
from custom_components.energy_joe.discovery.snapshot import DeviceInfo
from custom_components.energy_joe.observe.store import HistoryStore
from custom_components.energy_joe.plan import cars
from custom_components.energy_joe.plan.actions import plan_actions
from custom_components.energy_joe.plan.inputs import async_build_input, point_needs
from homeassistant.core import EVENT_CALL_SERVICE, Event, HomeAssistant, callback
from homeassistant.util import dt as dt_util
from tests.snapshots import entity, snapshot


@pytest.fixture(autouse=True)
def berlin(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


def point(action_id: str, name: str, **fields: Any) -> dict[str, Any]:
    """A charge point on an evcc loadpoint."""
    return {
        "id": action_id,
        "name": name,
        "kind": "switch",
        "entity_id": f"select.evcc_{action_id}_mode",
        "on_value": "now",
        "power_kw": 11.0,
        "forecast_below_kwh": 15.0,
        "point": {
            "vehicle_entity": f"select.evcc_{action_id}_vehicle_name",
            "connected_entity": f"binary_sensor.evcc_{action_id}_connected",
            "soc_entity": f"sensor.evcc_{action_id}_vehicle_soc",
            **fields,
        },
    }


def car(car_id: str, name: str, **extra: Any) -> dict[str, Any]:
    """A car from evcc ("db:<n>") and its maker's integration."""
    return {
        "id": car_id,
        "name": name,
        "sources": [
            {
                "id": f"evcc:{car_id}",
                "kind": "evcc",
                "platform": "evcc_intg",
                "name": name,
                "vehicle": extra.pop("vehicle", None),
            },
            {
                "id": f"car:{car_id}",
                "kind": "car",
                "platform": "kia_uvo",
                "name": name.upper(),
                "entities": {
                    "soc": f"sensor.{car_id}_soc",
                    "range": f"sensor.{car_id}_range",
                    "plugged": f"binary_sensor.{car_id}_plugged",
                    "location": f"device_tracker.{car_id}",
                },
            },
        ],
        "need": {"enabled": True, "capacity_kwh": 64.0, "daily_km": 100.0},
        **extra,
    }


def two_cars(**point_fields: Any) -> dict[str, Any]:
    return model.validate(
        {
            "version": model.CONFIG_VERSION,
            "actions": [point("ebox", "Parkplatz eBox", **point_fields)],
            "cars": [car("kona", "Kona", vehicle="db:27"), car("zoe", "Zoe")],
        }
    )


def plug(hass: HomeAssistant, action_id: str, vehicle: str = "null") -> None:
    hass.states.async_set(f"binary_sensor.evcc_{action_id}_connected", "on")
    hass.states.async_set(
        f"select.evcc_{action_id}_vehicle_name",
        vehicle,
        {"options": ["null", "db:27", "db:28"]},
    )


# --- migration ----------------------------------------------------------------


def version_6(*actions: dict[str, Any]) -> dict[str, Any]:
    return {**model.default_config(), "version": 6, "actions": list(actions)}


EV_6 = {
    "id": "ev_lp1",
    "name": "Parkplatz eBox",
    "kind": "switch",
    "entity_id": "select.evcc_ebox_mode",
    "on_value": "now",
    "forecast_below_kwh": 15.0,
    "power_kw": 11.0,
    "conditions": [
        {"entity_id": "binary_sensor.evcc_ebox_connected", "op": "eq", "value": True}
    ],
    "need": {
        "enabled": True,
        "soc_entity": "sensor.kona_soc",
        "range_entity": "sensor.kona_range",
        "capacity_kwh": 64.0,
        "reserve_km": 40.0,
        "source": "mailbox",
        "mailbox": {"provider": "webde", "address": "kona@example.org"},
    },
}


def test_version_6_cars_move_off_the_wallbox() -> None:
    """The need goes to a car with the action's id; the action is a charge point."""
    stored = version_6(
        EV_6,
        # A wallbox Joe proposed, never charged by need: a charge point, no car.
        {**EV_6, "id": "ev_lp2", "name": "Garage", "need": {"enabled": False}},
        # Any other switch stays an ordinary night action.
        {
            "id": "custom_pool",
            "name": "Pool",
            "kind": "switch",
            "entity_id": "switch.pool",
            "need": {"enabled": False},
        },
    )
    stored["provenance"] = {
        "actions[ev_lp1].need.reserve_km": {"source": "user"},
        "actions[ev_lp1]": {"source": "read"},
    }
    migrated = model.migrate(stored)
    assert migrated["version"] == model.CONFIG_VERSION
    (kona,) = migrated["cars"]
    assert kona["id"] == "ev_lp1" and kona["name"] == "Parkplatz eBox"
    assert kona["need"]["soc_entity"] == "sensor.kona_soc"
    assert kona["need"]["reserve_km"] == 40.0
    assert kona["need"]["mailbox"]["address"] == "kona@example.org"
    first, second, pool = migrated["actions"]
    assert first["point"]["connected_entity"] == "binary_sensor.evcc_ebox_connected"
    assert first["point"]["cars"] is None and first["point"]["unknown"] == "ask"
    assert second["point"] is not None
    assert pool["point"] is None
    assert all("need" not in a for a in migrated["actions"])
    # What the user set stays the user's.
    assert migrated["provenance"]["cars[ev_lp1].need.reserve_km"] == {"source": "user"}
    assert "actions[ev_lp1].need.reserve_km" not in migrated["provenance"]


def test_one_car_and_one_wallbox_behave_as_before(hass: HomeAssistant) -> None:
    """Plugged in, little sun, 30 % left: charging by need as in version 6."""
    migrated = model.migrate(version_6(EV_6))
    hass.states.async_set("binary_sensor.evcc_ebox_connected", "on")
    hass.states.async_set("sensor.kona_soc", "30", {"unit_of_measurement": "%"})
    detected = cars.detect_all(migrated, hass.states.get)
    assert detected["ev_lp1"]["state"] == "car"
    assert detected["ev_lp1"]["car"] == "ev_lp1"
    need = cars.need_for(hass.states.get, migrated["cars"][0])
    assert need["soc_entity"] == "sensor.kona_soc"
    start = dt_util.start_of_local_day(date(2026, 10, 5))
    end = start + timedelta(hours=5)
    found = {
        "known": True,
        "missing_kwh": 20.0,
        "wall_kwh": 22.2,
        "target": 61,
        "sensor": "sensor.kona_soc",
        "departure": None,
    }
    needs = point_needs(migrated, {"ev_lp1": found}, detected)
    (entry,) = plan_actions(
        migrated["actions"], hass.states.get, start, end, 5.0, {}, {}, needs, detected
    )
    assert entry["run"] is True and entry["reasons"] == ["need"]
    assert entry["target"] == 61 and entry["car"] == "ev_lp1"
    # Unplugged: nothing, as the condition said before.
    hass.states.async_set("binary_sensor.evcc_ebox_connected", "off")
    detected = cars.detect_all(migrated, hass.states.get)
    (entry,) = plan_actions(
        migrated["actions"], hass.states.get, start, end, 5.0, {}, {}, {}, detected
    )
    assert entry["run"] is False and entry["reasons"] == ["not_plugged"]


def test_several_cars_and_wallboxes_migrate() -> None:
    second = {
        **EV_6,
        "id": "ev_lp2",
        "name": "Garage",
        "need": {"enabled": True, "soc_entity": "sensor.zoe_soc"},
    }
    migrated = model.migrate(version_6(EV_6, second))
    assert [c["id"] for c in migrated["cars"]] == ["ev_lp1", "ev_lp2"]
    assert [a["point"]["cars"] for a in migrated["actions"]] == [None, None]


# --- which car is plugged in ------------------------------------------------------


def test_evcc_says_which_car(hass: HomeAssistant) -> None:
    config = two_cars()
    plug(hass, "ebox", "db:27")
    found = cars.detect_all(config, hass.states.get)["ebox"]
    assert (found["state"], found["car"], found["how"]) == ("car", "kona", "evcc")


def test_the_cars_plug_sensor_comes_second(hass: HomeAssistant) -> None:
    config = two_cars()
    plug(hass, "ebox")
    hass.states.async_set("binary_sensor.zoe_plugged", "on")
    hass.states.async_set("binary_sensor.kona_plugged", "off")
    found = cars.detect_all(config, hass.states.get)["ebox"]
    assert (found["car"], found["how"]) == ("zoe", "plugged")
    # evcc's answer wins over the plug sensors.
    plug(hass, "ebox", "db:27")
    assert cars.detect_all(config, hass.states.get)["ebox"]["car"] == "kona"


def test_the_only_car_at_home(hass: HomeAssistant) -> None:
    config = two_cars()
    plug(hass, "ebox")
    hass.states.async_set("device_tracker.kona", "not_home")
    hass.states.async_set("device_tracker.zoe", "home")
    found = cars.detect_all(config, hass.states.get)["ebox"]
    assert (found["car"], found["how"]) == ("zoe", "home")


def test_an_unknown_car_is_left_alone_and_asked_about(hass: HomeAssistant) -> None:
    config = two_cars()
    plug(hass, "ebox")
    # Just plugged in: evcc may still tell, Joe waits before he asks.
    found = cars.detect_all(config, hass.states.get)["ebox"]
    assert found["state"] == "unknown" and found["ask"] is False
    assert found["waiting"] is True
    later = dt_util.now() + cars.ASK_WAIT
    found = cars.detect_all(config, hass.states.get, now=later)["ebox"]
    assert found["state"] == "unknown" and found["ask"] is True
    start = dt_util.start_of_local_day(date(2026, 10, 5))
    (entry,) = plan_actions(
        config["actions"],
        hass.states.get,
        start,
        start + timedelta(hours=5),
        2.0,
        {},
        {},
        {},
        {"ebox": found},
    )
    assert entry["run"] is False and entry["reasons"] == ["unknown_car"]


def test_assume_a_car_when_unsure(hass: HomeAssistant) -> None:
    config = two_cars(unknown="assume", assume_car="zoe")
    plug(hass, "ebox")
    found = cars.detect_all(config, hass.states.get)["ebox"]
    assert (found["car"], found["how"]) == ("zoe", "assume")


def test_answers_hold_for_one_plug_in(hass: HomeAssistant) -> None:
    config = two_cars()
    plug(hass, "ebox")
    action = config["actions"][0]
    since = cars.session(hass.states.get, action["point"])
    now = dt_util.now()
    guest = {"ebox": {"car": "guest", "since": since, "at": now.isoformat()}}
    found = cars.detect_all(config, hass.states.get, guest, now)["ebox"]
    assert (found["state"], found["how"]) == ("guest", "answer")
    start = dt_util.start_of_local_day(date(2026, 10, 5))
    (entry,) = plan_actions(
        config["actions"],
        hass.states.get,
        start,
        start + timedelta(hours=5),
        2.0,
        {},
        {},
        {},
        {"ebox": found},
    )
    # A guest: evcc does what it is set to, Joe switches nothing.
    assert entry["run"] is False and entry["reasons"] == ["guest"]
    zoe = {"ebox": {"car": "zoe", "since": since, "at": now.isoformat()}}
    assert cars.detect_all(config, hass.states.get, zoe, now)["ebox"]["car"] == "zoe"
    # Unplugged and plugged in again: the answer is over.
    hass.states.async_set("binary_sensor.evcc_ebox_connected", "off")
    assert (
        cars.detect_all(config, hass.states.get, zoe, now)["ebox"]["state"] == "empty"
    )
    plug(hass, "ebox")
    assert cars.detect_all(config, hass.states.get, zoe, now)["ebox"]["state"] == (
        "unknown"
    )


def test_the_need_of_each_car_goes_to_its_charge_point(hass: HomeAssistant) -> None:
    config = model.validate(
        {
            "version": model.CONFIG_VERSION,
            "actions": [point("ebox", "eBox"), point("garage", "Garage")],
            "cars": [
                car("kona", "Kona", vehicle="db:27"),
                car("zoe", "Zoe", vehicle="db:28"),
            ],
        }
    )
    plug(hass, "ebox", "db:28")
    plug(hass, "garage", "db:27")
    detected = cars.detect_all(config, hass.states.get)
    needs = point_needs(
        config, {"kona": {"car": "kona"}, "zoe": {"car": "zoe"}}, detected
    )
    assert needs["ebox"]["car"] == "zoe" and needs["garage"]["car"] == "kona"
    # Only allowed cars count at a charge point.
    config["actions"][0]["point"]["cars"] = ["kona"]
    assert cars.detect_all(config, hass.states.get)["ebox"]["state"] == "unknown"


# --- values from several sources ----------------------------------------------


def test_the_level_comes_from_evcc_while_plugged_in(hass: HomeAssistant) -> None:
    config = two_cars()
    kona = config["cars"][0]
    hass.states.async_set("sensor.kona_soc", "52", {"unit_of_measurement": "%"})
    hass.states.async_set("sensor.kona_range", "231", {"unit_of_measurement": "km"})
    hass.states.async_set("sensor.evcc_ebox_vehicle_soc", "0")
    found = cars.value_of(hass.states.get, kona, "soc", config["actions"][0]["point"])
    # evcc shows 0 while it knows no level: the car's own last value.
    assert found is not None and found["kind"] == "car"
    hass.states.async_set("sensor.evcc_ebox_vehicle_soc", "57")
    found = cars.value_of(hass.states.get, kona, "soc", config["actions"][0]["point"])
    assert found is not None
    assert (found["entity"], found["kind"]) == ("sensor.evcc_ebox_vehicle_soc", "evcc")
    # Not plugged in: the car's integration.
    found = cars.value_of(hass.states.get, kona, "soc")
    assert found is not None and found["entity"] == "sensor.kona_soc"
    # The range is the car maker's first.
    found = cars.value_of(hass.states.get, kona, "range", config["actions"][0]["point"])
    assert found is not None and found["entity"] == "sensor.kona_range"
    need = cars.need_for(hass.states.get, kona, config["actions"][0]["point"])
    assert need["soc_entity"] == "sensor.evcc_ebox_vehicle_soc"


def _kona_snapshot(evcc_odometer: float | None = None) -> Any:
    ev = {"platform": "evcc_intg", "entry": "evcc"}
    entities = [
        entity(
            "sensor.kona_ev_battery_level",
            "KONA EV Battery Level",
            52,
            unit="%",
            unique_id="kia_uvo_x_ev_battery_percentage",
            device_id="hyundai",
            platform="kia_uvo",
        ),
        entity(
            "sensor.kona_ev_range",
            "KONA EV Range",
            231,
            unit="km",
            unique_id="kia_uvo_x_ev_driving_range",
            device_id="hyundai",
            platform="kia_uvo",
        ),
        entity(
            "sensor.kona_odometer",
            "KONA Odometer",
            59317.8,
            unit="km",
            unique_id="kia_uvo_x__odometer",
            device_id="hyundai",
            platform="kia_uvo",
        ),
        entity(
            "device_tracker.kona_location",
            "KONA Location",
            "home",
            unique_id="kia_uvo_x_location",
            device_id="hyundai",
            platform="kia_uvo",
        ),
        entity(
            "sensor.evcc_cstotal_kona_charging_sessions_vehicle_chargedenergy",
            "Kona Ladevorgänge: Energie [Fzg.]",
            1283.9,
            unique_id="evcc_intg.evcc_cstotal_kona_charging_sessions_vehicle_chargedenergy",
            device_id="evcc_kona",
            **ev,
        ),
        entity(
            "select.evcc_parkplatz_ebox_mode",
            "Parkplatz eBox Modus",
            "pv",
            unique_id="evcc_intg.evcc_parkplatz_ebox_mode",
            device_id="ebox",
            attributes={"options": ["off", "pv", "minpv", "now"]},
            **ev,
        ),
        entity(
            "select.evcc_parkplatz_ebox_vehicle_name",
            "Parkplatz eBox Fahrzeug",
            "null",
            unique_id="evcc_intg.evcc_parkplatz_ebox_vehicle_name",
            device_id="ebox",
            attributes={"options": ["null", "db:27"]},
            **ev,
        ),
        entity(
            "binary_sensor.evcc_parkplatz_ebox_connected",
            "Parkplatz eBox Verbunden",
            "off",
            unique_id="evcc_intg.evcc_parkplatz_ebox_connected",
            device_id="ebox",
            **ev,
        ),
        entity(
            "sensor.evcc_parkplatz_ebox_vehicle_soc",
            "Parkplatz eBox Fahrzeug Ladestand",
            0,
            unit="%",
            unique_id="evcc_intg.evcc_parkplatz_ebox_vehicle_soc",
            device_id="ebox",
            **ev,
        ),
    ]
    if evcc_odometer is not None:
        entities.append(
            entity(
                "sensor.evcc_kona_configvehicle_odometer",
                "Kona Kilometerstand",
                evcc_odometer,
                unit="km",
                unique_id="evcc_intg.evcc_kona_configvehicle_odometer",
                device_id="evcc_kona",
                **ev,
            )
        )
    return snapshot(
        entities,
        devices=[
            DeviceInfo(device_id="hyundai", name="KONA"),
            DeviceInfo(device_id="evcc_kona", name="Kona [evcc]"),
            DeviceInfo(device_id="ebox", name="Parkplatz eBox"),
        ],
    )


def test_evcc_and_the_car_maker_become_one_car() -> None:
    """'Kona' from evcc and 'KONA' from Hyundai: the same name, one car."""
    snap = _kona_snapshot()
    patch = car_updates(snap, model.default_config())
    assert patch is not None
    config = model.apply_update(model.default_config(), patch, "read")
    (kona,) = config["cars"]
    assert kona["name"] == "Kona"
    assert [s["kind"] for s in kona["sources"]] == ["evcc", "car"]
    assert kona["sources"][1]["entities"]["location"] == "device_tracker.kona_location"


def test_a_migrated_car_is_linked_and_named(hass: HomeAssistant) -> None:
    """Version 6 named the car after the wallbox and chose its entities by hand."""
    old = {
        **EV_6,
        "entity_id": "select.evcc_parkplatz_ebox_mode",
        "need": {
            "enabled": True,
            "soc_entity": "sensor.kona_ev_battery_level",
            "range_entity": "sensor.kona_ev_range",
        },
    }
    config = model.migrate(version_6(old))
    patch = car_updates(_kona_snapshot(), config)
    assert patch is not None
    config = model.apply_update(config, patch, "read")
    (kona,) = config["cars"]
    # Same id (its mailbox, calendar and learned values stay), its own name now.
    assert kona["id"] == "ev_lp1" and kona["name"] == "Kona"
    assert {s["kind"] for s in kona["sources"]} == {"evcc", "car"}
    # The entities are read from the Hyundai source now, not by hand.
    assert kona["need"]["soc_entity"] is None
    assert kona["need"]["enabled"] is True
    # The charge point knows evcc's vehicle and level at the loadpoint.
    point_cfg = config["actions"][0]["point"]
    assert point_cfg["vehicle_entity"] == "select.evcc_parkplatz_ebox_vehicle_name"
    assert point_cfg["soc_entity"] == "sensor.evcc_parkplatz_ebox_vehicle_soc"
    assert car_updates(_kona_snapshot(), config) is None


def test_unsure_cars_are_asked_about(hass: HomeAssistant) -> None:
    """Different names and far apart: two cars; Joe asks only when it may fit."""
    config = model.validate(
        {
            "version": model.CONFIG_VERSION,
            "cars": [
                {
                    "id": "a",
                    "name": "Familienauto",
                    "sources": [
                        {"id": "evcc:x", "kind": "evcc", "name": "Familienauto"}
                    ],
                },
                {
                    "id": "b",
                    "name": "KONA",
                    "sources": [
                        {
                            "id": "car:y",
                            "kind": "car",
                            "platform": "kia_uvo",
                            "name": "KONA",
                            "entities": {"soc": "sensor.kona_soc"},
                        }
                    ],
                },
            ],
        }
    )
    (question,) = cars.merge_questions(config, hass.states.get)
    assert (question["a"], question["b"]) == ("a", "b")
    config["answers"]["car_separate"] = ["a|b"]
    assert cars.merge_questions(config, hass.states.get) == []


def test_levels_far_apart_are_not_merged(hass: HomeAssistant) -> None:
    hass.states.async_set("sensor.one", "20", {"unit_of_measurement": "%"})
    hass.states.async_set("sensor.two", "80", {"unit_of_measurement": "%"})
    found = cars.evidence(
        hass.states.get,
        ["Kona"],
        {"soc": "sensor.one"},
        ["KONA"],
        {"soc": "sensor.two"},
    )
    assert found["name"] and found["against"] and not found["sure"]


# --- searching again: attaching what Joe sees to a car -----------------------


HYUNDAI = {
    "id": "car:hyundai",
    "kind": "car",
    "platform": "kia_uvo",
    "device_id": "hyundai",
    "name": "KONA",
    "vehicle": None,
    "entities": {
        "soc": "sensor.kona_ev_battery_level",
        "range": "sensor.kona_ev_range",
        "odometer": "sensor.kona_odometer",
        "location": "device_tracker.kona_location",
    },
}


def _deleted_kona() -> dict[str, Any]:
    """Kona from evcc only: the Hyundai was deleted once and is left out since."""
    config = model.validate(
        {
            "version": model.CONFIG_VERSION,
            "cars": [
                {
                    "id": "kona",
                    "name": "Kona",
                    "sources": [
                        {"id": "evcc:evcc_kona", "kind": "evcc", "name": "Kona"}
                    ],
                    "need": {
                        "enabled": True,
                        "range_entity": "sensor.kona_ev_range",
                    },
                },
                {"id": "zweit", "name": "Zweitwagen", "sources": [HYUNDAI]},
            ],
        }
    )
    config["answers"]["ignored"] = ["car:hyundai", "battery:x"]
    return config


def test_a_left_out_car_is_attached_again() -> None:
    """Attached to Kona: left out no more, gone from the other car, values filled."""
    config = _deleted_kona()
    patch, car_id = cars.attach_sources(config, "kona", [HYUNDAI])
    assert car_id == "kona"
    config = model.apply_update(config, patch, "user")
    kona = cars.car_by_id(config, "kona")
    assert [s["id"] for s in kona["sources"]] == ["evcc:evcc_kona", "car:hyundai"]
    hyundai = kona["sources"][1]
    assert hyundai["entities"] == HYUNDAI["entities"]
    assert hyundai["device_id"] == "hyundai"
    # The range is read from the Hyundai now, not by hand.
    assert kona["need"]["range_entity"] is None and kona["need"]["enabled"]
    assert cars.car_by_id(config, "zweit")["sources"] == []
    assert config["answers"]["ignored"] == ["battery:x"]
    # The next look around keeps it there.
    assert cars.sync_cars(config, lambda _: None, [HYUNDAI]) == {}


def test_attaching_twice_changes_nothing_more() -> None:
    config = _deleted_kona()
    config = model.apply_update(
        config, cars.attach_sources(config, "kona", [HYUNDAI])[0], "user"
    )
    patch, _ = cars.attach_sources(config, "kona", [HYUNDAI])
    assert "answers" not in patch
    assert model.apply_update(config, patch, "user")["cars"] == config["cars"]


def test_a_left_out_car_becomes_a_car_of_its_own() -> None:
    """ "Wieder nutzen": no car given, a new one named after the integration."""
    config = _deleted_kona()
    config["cars"] = config["cars"][:1]
    patch, car_id = cars.attach_sources(config, None, [HYUNDAI])
    assert car_id == "car_kona"
    config = model.apply_update(config, patch, "user")
    new = cars.car_by_id(config, "car_kona")
    assert new["name"] == "KONA" and [s["id"] for s in new["sources"]] == [
        "car:hyundai"
    ]
    assert "car:hyundai" not in config["answers"]["ignored"]


def test_attaching_needs_a_known_car_and_a_source() -> None:
    config = _deleted_kona()
    with pytest.raises(ValueError):
        cars.attach_sources(config, "nope", [HYUNDAI])
    with pytest.raises(ValueError):
        cars.attach_sources(config, "kona", [])


async def test_attach_over_the_websocket(
    ready_hass: HomeAssistant, hass_ws_client: WebSocketGenerator
) -> None:
    """energy_joe/car/attach finds the source as discovery does and saves it."""
    hass = ready_hass
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    runtime = hass.data[DOMAIN]
    config = _deleted_kona()
    runtime.async_update_config(
        {"cars": {c["id"]: c for c in config["cars"]}, "answers": config["answers"]},
        "user",
        "test",
    )
    client = await hass_ws_client(hass)

    async def seen(_: HomeAssistant) -> list[dict[str, Any]]:
        return [HYUNDAI]

    with mock_patch("custom_components.energy_joe.runtime.async_car_sources", seen):
        await client.send_json_auto_id(
            {"type": f"{DOMAIN}/car/attach", "car": "kona", "sources": ["car:hyundai"]}
        )
        msg = await client.receive_json()
        assert msg["success"] and msg["result"] == {"car": "kona"}
        kona = cars.car_by_id(runtime.config, "kona")
        assert [s["kind"] for s in kona["sources"]] == ["evcc", "car"]
        assert runtime.config["answers"]["ignored"] == ["battery:x"]
        await client.send_json_auto_id(
            {"type": f"{DOMAIN}/car/attach", "car": "kona", "sources": ["car:x"]}
        )
        msg = await client.receive_json()
        assert not msg["success"]
    # Splitting still works.
    await client.send_json_auto_id(
        {"type": f"{DOMAIN}/car/split", "car": "kona", "source": "car:hyundai"}
    )
    msg = await client.receive_json()
    assert msg["success"]
    assert [s["id"] for s in cars.car_by_id(runtime.config, "kona")["sources"]] == [
        "evcc:evcc_kona"
    ]


# --- the watcher: asking, answers, the evening reminder ----------------------------


class Notes:
    def __init__(self) -> None:
        self.asked: list[tuple[str, str, list[tuple[str, str]]]] = []
        self.reminded: list[tuple[str, str, int]] = []

    async def async_which_car(
        self, point_id: str, name: str, choices: list[tuple[str, str]]
    ) -> None:
        self.asked.append((point_id, name, choices))

    def clear_which_car(self, point_id: str) -> None:
        pass

    async def async_not_plugged(self, car_id: str, name: str, km: int) -> None:
        self.reminded.append((car_id, name, km))

    def clear_not_plugged(self, car_id: str) -> None:
        pass


async def test_joe_asks_once_and_hears_the_answer(hass: HomeAssistant, freezer) -> None:
    config = two_cars()
    notes = Notes()
    replans: list[bool] = []

    async def replan() -> None:
        replans.append(True)

    watcher = CarWatcher(
        hass, lambda: config, lambda: "live", lambda: None, lambda: None
    )
    watcher.notifier = notes
    watcher.replan = replan
    plug(hass, "ebox")
    await watcher.async_check()
    # Not in the first minutes: evcc usually tells which car it is by then.
    assert notes.asked == []
    freezer.tick(cars.ASK_WAIT)
    await watcher.async_check()
    await watcher.async_check()
    assert notes.asked == [
        ("ebox", "Parkplatz eBox", [("kona", "Kona"), ("zoe", "Zoe")])
    ]
    assert watcher.status["points"]["ebox"]["state"] == "unknown"
    await watcher.async_answer("ebox", "guest")
    assert watcher.status["points"]["ebox"]["state"] == "guest"
    assert replans
    with pytest.raises(ValueError):
        await watcher.async_answer("ebox", "nobody")


async def test_evcc_naming_the_car_in_time_means_no_question(
    hass: HomeAssistant, freezer
) -> None:
    """Plugged in, evcc names the car two minutes later: Joe never asks."""
    config = two_cars()
    notes = Notes()
    watcher = CarWatcher(
        hass, lambda: config, lambda: "live", lambda: None, lambda: None
    )
    watcher.notifier = notes
    plug(hass, "ebox")
    await watcher.async_check()
    freezer.tick(timedelta(minutes=2))
    plug(hass, "ebox", "db:27")
    await watcher.async_check()
    freezer.tick(cars.ASK_WAIT)
    await watcher.async_check()
    assert notes.asked == []
    assert watcher.status["points"]["ebox"]["car"] == "kona"


async def test_evccs_id_is_learned(hass: HomeAssistant) -> None:
    """The Zoe is known by its plug sensor while evcc shows db:28: that is the Zoe."""
    config = two_cars()
    learned: list[dict[str, Any]] = []
    watcher = CarWatcher(
        hass, lambda: config, lambda: "live", lambda: None, lambda: None
    )
    watcher.learn = learned.append
    plug(hass, "ebox", "db:28")
    hass.states.async_set("binary_sensor.zoe_plugged", "on")
    await watcher.async_check()
    (patch,) = learned
    sources = patch["cars"]["zoe"]["sources"]
    assert sources[0]["vehicle"] == "db:28"


async def test_the_evening_reminder(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-10-04T20:05:00+02:00")
    config = two_cars()
    notes = Notes()
    plan = {
        "cars": {
            "kona": {"missing_kwh": 12.0, "needed_km": 170.0, "reserve_km": 50.0},
            "zoe": {"missing_kwh": 0.0, "needed_km": 80.0, "reserve_km": 50.0},
        }
    }
    watcher = CarWatcher(
        hass, lambda: config, lambda: "live", lambda: plan, lambda: None
    )
    watcher.notifier = notes
    hass.states.async_set("binary_sensor.evcc_ebox_connected", "off")
    await watcher.async_check()
    await watcher.async_check()
    assert notes.reminded == [("kona", "Kona", 120)]
    assert watcher.status["reminders"] == [{"car": "kona", "name": "Kona", "km": 120}]
    # Plugged in now: the reminder is done.
    plug(hass, "ebox", "db:27")
    assert watcher.status["reminders"] == []


async def test_no_reminder_before_its_time(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-10-04T18:00:00+02:00")
    config = two_cars()
    notes = Notes()
    plan = {"cars": {"kona": {"missing_kwh": 12.0, "needed_km": 170.0}}}
    watcher = CarWatcher(
        hass, lambda: config, lambda: "live", lambda: plan, lambda: None
    )
    watcher.notifier = notes
    await watcher.async_check()
    assert notes.reminded == []


async def test_joe_never_asks_a_car_to_update(hass: HomeAssistant, freezer) -> None:
    """Reading and planning call no service (no force update that wakes the car)."""
    freezer.move_to("2026-10-04T20:05:00+02:00")
    calls: list[Event] = []

    @callback
    def seen(event: Event) -> None:
        calls.append(event)

    hass.bus.async_listen(EVENT_CALL_SERVICE, seen)
    config = model.apply_update(
        two_cars(),
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
        },
        "user",
    )
    hass.states.async_set("sensor.soc", "40", {"unit_of_measurement": "%"})
    plug(hass, "ebox", "db:27")
    watcher = CarWatcher(
        hass, lambda: config, lambda: "live", lambda: None, lambda: None
    )
    await watcher.async_check()
    store = HistoryStore(hass)
    await store.async_load()
    inp, _notes = await async_build_input(
        hass, config, store, dt_util.now(), detected=watcher.detect()
    )
    assert inp is not None, _notes
    assert inp.cars["kona"]["point"] == "ebox"
    await store.async_unload()
    await hass.async_block_till_done()
    assert calls == []
