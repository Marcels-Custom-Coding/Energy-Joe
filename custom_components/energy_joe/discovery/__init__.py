"""Joe looks around: find what Energy Joe can use in Home Assistant (read-only)."""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant

from .checks import run_checks, run_config_checks
from .energy import parse_energy_prefs
from .find import (
    find_batteries,
    find_cars,
    find_consumers,
    find_forecast,
    find_holiday,
    find_measurements,
    find_people,
    find_tariff,
    find_wallboxes,
    find_weather,
)
from .proposal import build_proposal
from .snapshot import Snapshot, async_collect

__all__ = ["async_check", "async_collect", "async_discover", "discover"]


async def async_discover(hass: HomeAssistant) -> dict[str, Any]:
    """Collect a snapshot of Home Assistant and run discovery on it."""
    return discover(await async_collect(hass))


async def async_check(
    hass: HomeAssistant, config: dict[str, Any]
) -> list[dict[str, Any]]:
    """Check what Joe is configured to use against the current states."""
    return run_config_checks(await async_collect(hass), config)


def discover(snap: Snapshot) -> dict[str, Any]:
    """Run all finders on a snapshot."""
    energy = parse_energy_prefs(snap.energy_prefs)
    persons, calendars = find_people(snap)
    result: dict[str, Any] = {
        "energy_dashboard": {"configured": energy.configured, **energy.counts},
        "measurements": find_measurements(snap, energy),
        "batteries": find_batteries(snap, energy),
        "tariff": find_tariff(snap, energy),
        "forecast": find_forecast(snap, energy),
        "wallboxes": find_wallboxes(snap),
        "cars": find_cars(snap),
        "weather": find_weather(snap),
        "holiday": find_holiday(snap),
        "persons": persons,
        "calendars": calendars,
        "consumers": find_consumers(snap, energy),
    }
    result["checks"] = run_checks(snap, result)
    result["proposal"] = build_proposal(result)
    # Night actions Joe once proposed for charge points that turned out not to
    # be for a car (an evcc heater): taken back unless the user changed them.
    result["not_car_actions"] = [
        f"ev_{w['device_id']}" for w in result["wallboxes"] if not w["is_car"]
    ]
    return result
