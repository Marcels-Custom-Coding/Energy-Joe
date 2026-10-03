"""Turn discovery results into a configuration proposal for Joe's model."""

from __future__ import annotations

from typing import Any


def build_proposal(result: dict[str, Any]) -> dict[str, Any]:
    """Map the best findings onto the configuration schema (see model.py)."""
    measurements = result["measurements"]
    tariff = result["tariff"]
    forecast = result["forecast"]
    batteries = sorted(
        result["batteries"],
        key=lambda b: (not b["controllable"], -(b["capacity_kwh"] or 0)),
    )
    return {
        "measurements": {
            "grid_power": _measurement(measurements.get("grid_power")),
            "home_power": _measurement(measurements.get("home_power")),
            "solar_power": (measurements.get("solar_power") or {}).get(
                "measurements", []
            ),
        },
        "batteries": [
            {
                "id": b["id"],
                "name": b["name"],
                "adapter": b["adapter"],
                "soc_entity": b["soc_entity"],
                "power": b["power"],
                "capacity_kwh": b["capacity_kwh"],
                "capacity_entity": b["capacity_entity"],
                "max_charge_w": b["max_charge_w"],
                "max_discharge_w": b["max_discharge_w"],
                "device_id": b["device_id"],
                "controls": b["controls"],
                "priority": min(index + 1, 9),
            }
            for index, b in enumerate(batteries)
        ],
        "tariff": {
            "kind": tariff["kind"],
            "price_entity": tariff["price_entity"],
            "window": tariff["window"],
            "night_price": tariff["night_price"],
            "day_price": tariff["day_price"],
            "feed_in_price": tariff["feed_in_price"],
            "feed_in_entity": tariff["feed_in_entity"],
        },
        "forecast": (
            {
                "provider": forecast["provider"],
                "config_entries": forecast["config_entries"],
                "today": forecast["today"],
                "tomorrow": forecast["tomorrow"],
                "remaining_today": forecast["remaining_today"],
            }
            if forecast
            else {}
        ),
        "context": {
            "weather_entity": (result["weather"] or {})
            .get("entity", {})
            .get("entity_id"),
            "holiday_entity": (result["holiday"] or {})
            .get("entity", {})
            .get("entity_id"),
        },
        "persons": [
            {
                "id": p["entity_id"],
                "name": p["name"],
                "person_entity": p["entity_id"],
                "calendars": p["calendars"],
            }
            for p in result["persons"]
        ],
        "consumers": [
            {
                "id": c["id"],
                "name": c["name"],
                "kind": c["kind"],
                "energy_entity": c["energy_entity"],
                "power_entity": c["power_entity"],
                "included_in": c["included_in"],
                "source": "energy_dashboard",
            }
            for c in result["consumers"]
        ],
    }


def _measurement(found: dict[str, Any] | None) -> dict[str, Any] | None:
    return found["measurement"] if found else None
