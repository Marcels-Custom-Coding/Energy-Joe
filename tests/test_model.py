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
    assert config["provenance"]["tariff.window.start"] == {
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
