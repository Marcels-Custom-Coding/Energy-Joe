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
                "mode_options": b.get("mode_options") or {},
                "prepare": b.get("prepare") or [],
                "steps": b.get("steps") or {},
                "priority": min(index + 1, 9),
            }
            for index, b in enumerate(batteries)
        ],
        "actions": _night_actions(
            result.get("wallboxes") or [], result.get("cars") or []
        ),
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
                "alternatives": [
                    {
                        "id": other["provider"],
                        "name": other["provider_name"],
                        "provider": other["provider"],
                        "tomorrow": other["tomorrow"],
                    }
                    for other in forecast.get("others") or []
                ],
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


def _night_actions(
    wallboxes: list[dict[str, Any]], cars: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    """Each charge point charges at night when tomorrow brings little sun.

    It charges whichever car is plugged in (see plan/cars.py): evcc tells
    which vehicle is at the loadpoint and its level there. The cars
    themselves are linked when Joe looks around (sync_cars).
    """
    del cars  # the cars are their own items now
    car_wallboxes = [
        w
        for w in wallboxes
        if w.get("is_car") and "now" in (w.get("mode_options") or [])
    ]
    actions = []
    for wallbox in car_wallboxes:
        entities = wallbox.get("entities") or {}
        conditions = (
            [{"entity_id": entities["connected"], "op": "eq", "value": True}]
            if entities.get("connected")
            else []
        )
        actions.append(
            {
                "id": f"ev_{wallbox['device_id']}",
                "name": wallbox["name"],
                "kind": "switch",
                "entity_id": wallbox["mode_entity"],
                "on_value": "now",
                "reset": "previous",
                "lead_min": 3,
                "auto": True,
                "forecast_below_kwh": 15.0,
                "conditions": conditions,
                "power_kw": 11.0,
                "power_entity": entities.get("power"),
                "priority": 1,
                "point": point_of_wallbox(wallbox),
            }
        )
    return actions


def point_of_wallbox(wallbox: dict[str, Any]) -> dict[str, Any]:
    """What a charge point reads from evcc's loadpoint."""
    entities = wallbox.get("entities") or {}
    return {
        "vehicle_entity": entities.get("vehicle"),
        "connected_entity": entities.get("connected"),
        "soc_entity": entities.get("vehicle_soc"),
        "range_entity": entities.get("vehicle_range"),
        "odometer_entity": entities.get("vehicle_odometer"),
    }
