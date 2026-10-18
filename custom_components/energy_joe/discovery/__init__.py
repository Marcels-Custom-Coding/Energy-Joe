"""Joe looks around: find what Energy Joe can use in Home Assistant (read-only)."""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant, State

from .. import model
from ..plan import cars as cars_module
from .checks import run_checks, run_config_checks
from .energy import parse_energy_prefs
from .find import (
    car_sources,
    find_batteries,
    find_battery_notes,
    find_cars,
    find_consumers,
    find_forecast,
    find_holiday,
    find_measurements,
    find_people,
    find_tariff,
    find_wallboxes,
    find_weather,
    profile_controls,
    profile_prepare,
)
from .proposal import build_proposal, point_of_wallbox
from .snapshot import Snapshot, async_collect

__all__ = [
    "async_car_sources",
    "async_car_updates",
    "async_check",
    "async_collect",
    "async_discover",
    "async_profile_updates",
    "discover",
]


async def async_discover(hass: HomeAssistant) -> dict[str, Any]:
    """Collect a snapshot of Home Assistant and run discovery on it."""
    return discover(await async_collect(hass))


async def async_check(
    hass: HomeAssistant, config: dict[str, Any]
) -> list[dict[str, Any]]:
    """Check what Joe is configured to use against the current states."""
    return run_config_checks(await async_collect(hass), config)


async def async_profile_updates(
    hass: HomeAssistant, config: dict[str, Any]
) -> dict[str, Any] | None:
    """What newer profiles know about batteries set up before (a config patch).

    So far the prepare steps (e.g. a battery's manual mode) and the levers
    only the day uses (Omnibattery's power limits on its system device for
    the daytime cap, Huawei's or Victron's power limits); what the user set
    stays as it is, the night's levers stay as they were tested.
    """
    snap = await async_collect(hass)
    patch: dict[str, Any] = {}
    for battery in config["batteries"]:
        path = f"batteries[{battery['id']}]"
        if model.source_of(config, f"{path}.prepare") != "user":
            found = profile_prepare(snap, battery)
            if found and found != (battery.get("prepare") or []):
                patch.setdefault(battery["id"], {})["prepare"] = found
        if model.source_of(config, f"{path}.controls") != "user":
            controls = battery.get("controls") or {}
            levers = {
                role: entity_id
                for role, entity_id in profile_controls(snap, battery).items()
                if controls.get(role) != entity_id
            }
            if levers:
                # Controls are replaced as a whole.
                patch.setdefault(battery["id"], {})["controls"] = {
                    **controls,
                    **levers,
                }
    return {"batteries": patch} if patch else None


async def async_car_updates(
    hass: HomeAssistant, config: dict[str, Any]
) -> dict[str, Any] | None:
    """Link the cars Joe sees to his cars and charge points (a config patch)."""
    return car_updates(await async_collect(hass), config)


async def async_car_sources(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Every car Joe sees now (evcc's vehicles, the car makers'), left out or not."""
    return car_sources(await async_collect(hass))


def car_updates(snap: Snapshot, config: dict[str, Any]) -> dict[str, Any] | None:
    """The cars from car integrations and evcc's vehicles, and what each
    charge point reads from its loadpoint; what the user set stays."""
    patch: dict[str, Any] = {}
    actions: dict[str, Any] = {}
    point_entities: set[str] = set()
    for wallbox in find_wallboxes(snap):
        if not wallbox["is_car"]:
            continue
        found = point_of_wallbox(wallbox)
        point_entities |= {e for e in found.values() if e}
        for action in config["actions"]:
            point = action.get("point")
            if point is None or action["entity_id"] != wallbox["mode_entity"]:
                continue
            path = f"actions[{action['id']}].point"
            change = {
                field: value
                for field, value in found.items()
                if value != point.get(field)
                and model.source_of(config, f"{path}.{field}") != "user"
            }
            if change:
                actions[action["id"]] = {"point": change}
    if actions:
        patch["actions"] = actions
    ignored = set((config.get("answers") or {}).get(model.IGNORED) or [])
    lookup = {e.entity_id: e for e in snap.entities.values()}
    cars = cars_module.sync_cars(
        config,
        lambda entity_id: _state_of(lookup.get(entity_id)),
        car_sources(snap),
        ignored,
        point_entities,
    )
    if cars:
        patch["cars"] = cars
    return patch or None


def _state_of(entity: Any) -> Any:
    """A snapshot entity as far as the car matching reads it (state, unit)."""
    if entity is None or entity.state is None:
        return None
    return State(entity.entity_id, entity.state, entity.attributes)


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
        "car_sources": car_sources(snap),
        "weather": find_weather(snap),
        "holiday": find_holiday(snap),
        "persons": persons,
        "calendars": calendars,
        "consumers": find_consumers(snap, energy),
    }
    # Battery integrations without a battery Joe found (its level switched off).
    result["battery_notes"] = find_battery_notes(snap, result["batteries"])
    result["checks"] = run_checks(snap, result)
    result["proposal"] = build_proposal(result)
    # Night actions Joe once proposed for charge points that turned out not to
    # be for a car (an evcc heater): taken back unless the user changed them.
    result["not_car_actions"] = [
        f"ev_{w['device_id']}" for w in result["wallboxes"] if not w["is_car"]
    ]
    return result
