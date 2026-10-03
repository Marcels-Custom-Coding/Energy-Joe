"""Tests for Joe's configuration model."""

from __future__ import annotations

from datetime import UTC, datetime

import pytest
import voluptuous as vol

from custom_components.energy_joe import model


def test_defaults_are_valid() -> None:
    config = model.default_config()
    assert config["version"] == model.CONFIG_VERSION
    assert config["rules"]["reserve_soc"] == 10
    assert config["tariff"]["kind"] == "unknown"
    assert config["batteries"] == []


def test_update_merges_and_records_origin() -> None:
    now = datetime(2026, 10, 3, 12, 0, tzinfo=UTC)
    config = model.apply_update(
        model.default_config(),
        {
            "tariff": {
                "kind": "fixed_window",
                "window": {"start": "00:00", "end": "05:00"},
            }
        },
        "read",
        detail="sensor.price",
        now=now,
    )
    assert config["tariff"]["window"] == {"start": "00:00", "end": "05:00"}
    assert config["tariff"]["night_price"] is None
    assert config["provenance"]["tariff.window"] == {
        "source": "read",
        "detail": "sensor.price",
        "updated": "2026-10-03T12:00:00+00:00",
    }

    config = model.apply_update(config, {"rules": {"reserve_soc": 15}}, "user", now=now)
    assert config["rules"]["reserve_soc"] == 15
    assert config["rules"]["max_target_soc"] == 100
    assert config["provenance"]["rules.reserve_soc"]["source"] == "user"
    assert config["tariff"]["kind"] == "fixed_window"


def test_lists_are_replaced() -> None:
    config = model.apply_update(
        model.default_config(),
        {"rules": {"priority": ["battery", "ev"]}},
        "user",
    )
    assert config["rules"]["priority"] == ["battery", "ev"]


@pytest.mark.parametrize(
    "patch",
    [
        {"rules": {"reserve_soc": 120}},
        {"tariff": {"window": {"start": "25:00", "end": "05:00"}}},
        {"tariff": {"kind": "cheap"}},
        {"measurements": {"grid_power": {"entity_id": "not an entity"}}},
    ],
)
def test_invalid_updates_are_rejected(patch: dict) -> None:
    with pytest.raises(vol.Invalid):
        model.apply_update(model.default_config(), patch, "user")


def test_battery_ids_must_be_unique() -> None:
    battery = {"id": "b1", "name": "A", "adapter": "none", "soc_entity": "sensor.soc"}
    with pytest.raises(vol.Invalid):
        model.apply_update(
            model.default_config(), {"batteries": [battery, battery]}, "user"
        )


def test_unknown_source_is_rejected() -> None:
    with pytest.raises(vol.Invalid):
        model.apply_update(
            model.default_config(), {"rules": {"reserve_soc": 20}}, "guess"
        )


def test_migrate_keeps_values() -> None:
    stored = model.apply_update(
        model.default_config(), {"rules": {"reserve_soc": 20}}, "user"
    )
    assert model.migrate(stored)["rules"]["reserve_soc"] == 20


BATTERY = {
    "id": "b1",
    "name": "Garage",
    "adapter": "omnibattery",
    "soc_entity": "sensor.garage_soc",
    "capacity_kwh": 5.12,
}


def test_items_are_addressed_by_id() -> None:
    config = model.apply_update(
        model.default_config(), {"batteries": {"b1": BATTERY}}, "read"
    )
    config = model.apply_update(
        config, {"batteries": {"b1": {"capacity_kwh": 4.8}}}, "user"
    )
    (battery,) = config["batteries"]
    assert battery["capacity_kwh"] == 4.8
    assert battery["name"] == "Garage"
    provenance = config["provenance"]
    assert provenance["batteries[b1].capacity_kwh"]["source"] == "user"
    assert provenance["batteries[b1].name"]["source"] == "read"

    config = model.apply_update(config, {"batteries": {"b1": None}}, "user")
    assert config["batteries"] == []
    assert "batteries[b1].name" not in config["provenance"]
    assert config["provenance"]["batteries[b1]"]["source"] == "user"


def test_measurements_are_replaced_as_a_whole() -> None:
    config = model.apply_update(
        model.default_config(),
        {"measurements": {"grid_power": {"entity_id": "sensor.a", "invert": True}}},
        "read",
    )
    config = model.apply_update(
        config, {"measurements": {"grid_power": {"entity_id": "sensor.b"}}}, "user"
    )
    assert config["measurements"]["grid_power"] == {
        "entity_id": "sensor.b",
        "invert": False,
        "minus_entity_id": None,
    }
    assert config["provenance"]["measurements.grid_power"]["source"] == "user"


PROPOSAL = {
    "measurements": {
        "grid_power": {
            "entity_id": "sensor.grid",
            "invert": False,
            "minus_entity_id": None,
        },
        "home_power": None,
        "solar_power": [
            {"entity_id": "sensor.pv", "invert": False, "minus_entity_id": None}
        ],
    },
    "batteries": [BATTERY],
    "tariff": {
        "kind": "fixed_window",
        "price_entity": "sensor.price",
        "window": {"start": "00:00", "end": "05:00"},
        "night_price": 0.18,
        "day_price": 0.29,
        "feed_in_price": 0.062,
        "feed_in_entity": None,
    },
    "forecast": {},
    "context": {"weather_entity": "weather.home", "holiday_entity": None},
    "persons": [],
    "consumers": [],
}


def test_adoption_takes_over_findings() -> None:
    config = model.adopt_proposal(model.default_config(), PROPOSAL)
    assert config["measurements"]["grid_power"]["entity_id"] == "sensor.grid"
    assert config["measurements"]["home_power"] is None
    assert config["batteries"][0]["capacity_kwh"] == 5.12
    assert config["tariff"]["window"] == {"start": "00:00", "end": "05:00"}
    assert config["context"]["weather_entity"] == "weather.home"
    assert config["provenance"]["tariff.kind"]["source"] == "read"


def test_adoption_keeps_what_the_user_set() -> None:
    config = model.adopt_proposal(model.default_config(), PROPOSAL)
    config = model.apply_update(
        config,
        {
            "measurements": {"grid_power": {"entity_id": "sensor.mine"}},
            "batteries": {"b1": {"capacity_kwh": 4.5}},
            "tariff": {"kind": "flat", "day_price": 0.3},
            "answers": {"ignored": ["weather"]},
            "context": {"weather_entity": None},
        },
        "user",
    )
    again = model.adopt_proposal(config, PROPOSAL)
    assert again["measurements"]["grid_power"]["entity_id"] == "sensor.mine"
    assert again["batteries"][0]["capacity_kwh"] == 4.5
    assert again["batteries"][0]["name"] == "Garage"
    assert again["tariff"]["kind"] == "flat"
    assert again["tariff"]["window"] == {"start": "00:00", "end": "05:00"}
    assert again["tariff"]["feed_in_price"] == 0.062
    assert again["context"]["weather_entity"] is None


def test_adoption_skips_ignored_and_removed_items() -> None:
    config = model.apply_update(
        model.default_config(), {"answers": {"ignored": ["battery:b1"]}}, "user"
    )
    assert model.adopt_proposal(config, PROPOSAL)["batteries"] == []

    config = model.adopt_proposal(model.default_config(), PROPOSAL)
    config = model.apply_update(config, {"batteries": {"b1": None}}, "user")
    assert model.adopt_proposal(config, PROPOSAL)["batteries"] == []


def test_adoption_never_replaces_learned_values() -> None:
    config = model.adopt_proposal(model.default_config(), PROPOSAL)
    config = model.apply_update(
        config, {"batteries": {"b1": {"capacity_kwh": 4.6}}}, "learned"
    )
    assert model.adopt_proposal(config, PROPOSAL)["batteries"][0]["capacity_kwh"] == 4.6


def test_protection_covers_parents_and_children() -> None:
    config = model.apply_update(
        model.default_config(), {"batteries": {"b1": BATTERY}}, "read"
    )
    config = model.apply_update(config, {"batteries": {"b1": {"priority": 2}}}, "user")
    assert model.is_protected(config, "batteries[b1]")
    assert model.is_protected(config, "batteries[b1].priority")
    assert not model.is_protected(config, "batteries[b1].name")
