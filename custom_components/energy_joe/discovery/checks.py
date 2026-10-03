"""Plausibility checks on what discovery found."""

from __future__ import annotations

from typing import Any

from .snapshot import Snapshot

STALE_SECONDS = 6 * 3600


def kw(snap: Snapshot, measurement: dict[str, Any] | None) -> float | None:
    """Current value of a measurement in kW, in Joe's sign convention."""
    if not measurement:
        return None
    entity = snap.get(measurement.get("entity_id"))
    if entity is None or entity.number is None:
        return None
    value = _to_kw(entity.number, entity.unit)
    if measurement.get("invert"):
        value = -value
    if minus := snap.get(measurement.get("minus_entity_id")):
        if minus.number is None:
            return None
        value -= _to_kw(minus.number, minus.unit)
    return value


def _to_kw(value: float, unit: str | None) -> float:
    if unit == "W":
        return value / 1000
    if unit == "MW":
        return value * 1000
    return value


def run_checks(snap: Snapshot, result: dict[str, Any]) -> list[dict[str, Any]]:
    """Return findings worth a word to the user, most important first."""
    checks: list[dict[str, Any]] = []
    measurements = result["measurements"]

    for role in ("grid_power", "home_power"):
        found = measurements.get(role)
        if not found:
            checks.append({"code": "missing", "level": "info", "role": role})
            continue
        checks.extend(_entity_checks(snap, found["measurement"]["entity_id"], role))
    solar = measurements.get("solar_power")
    if not solar:
        checks.append({"code": "missing", "level": "info", "role": "solar_power"})
    else:
        for measurement in solar["measurements"]:
            checks.extend(
                _entity_checks(
                    snap, measurement["entity_id"], "solar_power", night_ok=True
                )
            )

    home = (
        kw(snap, measurements["home_power"]["measurement"])
        if measurements.get("home_power")
        else None
    )
    if home is not None and home < -0.05:
        checks.append(
            {
                "code": "home_negative",
                "level": "warn",
                "entity_id": measurements["home_power"]["entity"]["entity_id"],
            }
        )
    checks.extend(_grid_sign(snap, result))

    for battery in result["batteries"]:
        soc = snap.get(battery["soc_entity"])
        if soc and soc.number is not None and not 0 <= soc.number <= 100:
            checks.append(
                {
                    "code": "soc_range",
                    "level": "warn",
                    "battery": battery["name"],
                    "value": soc.number,
                }
            )
        if not battery["capacity_kwh"]:
            checks.append(
                {
                    "code": "capacity_unknown",
                    "level": "info",
                    "battery": battery["name"],
                }
            )
        if not battery["controllable"]:
            checks.append(
                {
                    "code": "not_controllable",
                    "level": "info",
                    "battery": battery["name"],
                }
            )

    if result["tariff"]["kind"] == "unknown":
        checks.append({"code": "tariff_unknown", "level": "info"})
    order = {"warn": 0, "info": 1}
    checks.sort(key=lambda c: order.get(c["level"], 2))
    return checks


def _entity_checks(
    snap: Snapshot, entity_id: str, role: str, night_ok: bool = False
) -> list[dict[str, Any]]:
    entity = snap.get(entity_id)
    if entity is None or not entity.available:
        return [
            {
                "code": "unavailable",
                "level": "warn",
                "role": role,
                "entity_id": entity_id,
            }
        ]
    checks = []
    if entity.unit not in ("W", "kW", "MW"):
        checks.append(
            {
                "code": "unit",
                "level": "warn",
                "role": role,
                "entity_id": entity_id,
                "unit": entity.unit,
            }
        )
    quiet_at_night = night_ok and (entity.number or 0) == 0
    if (entity.seconds_since_report or 0) > STALE_SECONDS and not quiet_at_night:
        checks.append(
            {
                "code": "stale",
                "level": "warn",
                "role": role,
                "entity_id": entity_id,
                "hours": round((entity.seconds_since_report or 0) / 3600),
            }
        )
    return checks


def _grid_sign(snap: Snapshot, result: dict[str, Any]) -> list[dict[str, Any]]:
    """Compare grid power with what solar, home and batteries imply right now."""
    measurements = result["measurements"]
    grid_found = measurements.get("grid_power")
    if not grid_found or not measurements.get("home_power"):
        return []
    grid = kw(snap, grid_found["measurement"])
    home = kw(snap, measurements["home_power"]["measurement"])
    solar_found = measurements.get("solar_power")
    solar = (
        sum(v for m in solar_found["measurements"] if (v := kw(snap, m)) is not None)
        if solar_found
        else 0.0
    )
    charge = 0.0
    for battery in result["batteries"]:
        value = kw(snap, battery["power"])
        if battery["power"] and value is None:
            return []
        charge += value or 0.0
    if grid is None or home is None:
        return []
    expected = home + charge - solar
    # Clearly opposite sign with enough power on both sides means the sensor counts the other way round.
    if abs(expected) > 0.8 and abs(grid) > 0.5 and (expected > 0) != (grid > 0):
        return [
            {
                "code": "grid_sign",
                "level": "warn",
                "entity_id": grid_found["entity"]["entity_id"],
                "expected": round(expected, 2),
                "actual": round(grid, 2),
            }
        ]
    return []
