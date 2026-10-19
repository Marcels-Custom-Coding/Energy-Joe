"""Joe looks around: find what Energy Joe can use in Home Assistant (read-only)."""

from __future__ import annotations

import hashlib
import json
from typing import Any

from homeassistant.core import HomeAssistant, State

from .. import model
from ..control.profiles import PROFILES, ROLES
from ..plan import cars as cars_module
from .checks import run_checks, run_config_checks
from .energy import parse_energy_prefs
from .find import (
    capacity_of,
    capacity_reading,
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
    profile_find,
    profile_prepare,
)
from .proposal import build_proposal, point_of_wallbox
from .snapshot import Snapshot, async_collect

__all__ = [
    "adopted_controls",
    "async_car_sources",
    "async_car_updates",
    "async_check",
    "async_collect",
    "async_discover",
    "async_profile_updates",
    "capacity_update",
    "discover",
    "profile_find",
    "profile_updates",
    "role_deviation",
    "role_hash",
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
    hass: HomeAssistant,
    config: dict[str, Any],
    dismissed: dict[str, str] | None = None,
) -> dict[str, Any] | None:
    """What newer profiles know about batteries set up before: a config
    patch ("batteries") and the batteries whose levers, as the user set
    them, differ from what the profile finds ("battery_roles").

    Patched are the prepare steps (e.g. a battery's manual mode), the
    levers only the day uses (Omnibattery's power limits on its system
    device for the daytime cap, Huawei's or Victron's power limits) and the
    size as the device tells it (see capacity_update); the night's levers
    stay as they were tested. What the user set is never patched: Joe
    reports where it differs from the profile's find (missing and wrong
    roles, see role_deviation) and the panel asks whether to take the find
    over, unless the user dismissed this very find (`dismissed`: battery id
    -> the find's hash).
    """
    return profile_updates(await async_collect(hass), config, dismissed)


def profile_updates(
    snap: Snapshot, config: dict[str, Any], dismissed: dict[str, str] | None = None
) -> dict[str, Any] | None:
    """See async_profile_updates."""
    patch: dict[str, Any] = {}
    roles: list[dict[str, Any]] = []
    for battery in config["batteries"]:
        path = f"batteries[{battery['id']}]"
        if size := capacity_update(snap, config, battery):
            patch.setdefault(battery["id"], {}).update(size)
        if model.source_of(config, f"{path}.prepare") != "user":
            found = profile_prepare(snap, battery)
            if found and found != (battery.get("prepare") or []):
                patch.setdefault(battery["id"], {})["prepare"] = found
        own_levers = battery.get("adapter") == "fronius_modbus"
        if not own_levers and model.source_of(config, f"{path}.controls") == "user":
            deviation = role_deviation(snap, battery)
            if deviation and (dismissed or {}).get(battery["id"]) != deviation["hash"]:
                roles.append(deviation)
            continue
        controls = battery.get("controls") or {}
        found = (
            # Joe's own entities for an inverter over Modbus: every lever is
            # his, whoever set the battery up.
            profile_find(snap, battery)["controls"]
            if own_levers
            else profile_controls(snap, battery)
        )
        levers = {
            role: entity_id
            for role, entity_id in found.items()
            if controls.get(role) != entity_id
        }
        if levers:
            # Controls are replaced as a whole.
            patch.setdefault(battery["id"], {})["controls"] = {**controls, **levers}
    result: dict[str, Any] = {}
    if patch:
        result["batteries"] = patch
    if roles:
        result["battery_roles"] = roles
    return result or None


def capacity_update(
    snap: Snapshot, config: dict[str, Any], battery: dict[str, Any]
) -> dict[str, Any]:
    """A battery's size as its device tells it (a patch of capacity_kwh and
    capacity_entity): for a battery set up without one, by the key Joe knows
    or a size sensor on its device (see find.capacity_of) – also after "I
    don't know, learn it": the device knows better –, and for one whose size
    sensor says something else today (a maximum capacity sinks with age;
    more than 1 % counts). A size the user typed stays, so does a sensor
    the user chose."""
    path = f"batteries[{battery['id']}]"
    known = battery.get("capacity_kwh")
    entity_id = battery.get("capacity_entity")
    if known is not None and model.source_of(config, f"{path}.capacity_kwh") == "user":
        return {}
    if entity_id and model.source_of(config, f"{path}.capacity_entity") == "user":
        return {}
    change: dict[str, Any] = {}
    if entity_id:
        found = capacity_reading(snap.get(entity_id))
    else:
        soc = snap.get(battery.get("soc_entity"))
        if soc is None:
            return {}
        found, entity_id = capacity_of(snap, soc)
        if entity_id:
            change["capacity_entity"] = entity_id
    if found is None:
        return {}
    if known is None or abs(found - known) > 0.01 * known:
        change["capacity_kwh"] = found
    return change


def role_hash(found: dict[str, str]) -> str:
    """A short hash of a profile's find (dismissing holds until it changes)."""
    digest = hashlib.sha256(json.dumps(found, sort_keys=True).encode())
    return digest.hexdigest()[:12]


def role_deviation(snap: Snapshot, battery: dict[str, Any]) -> dict[str, Any] | None:
    """Where a battery's levers differ from what its profile finds today:
    roles the profile finds but the battery lacks ("missing") and roles
    assigned to another entity than the one found ("wrong"); None where
    nothing differs or the battery has no profile."""
    found = profile_find(snap, battery)["controls"]
    if not found:
        return None
    controls = battery.get("controls") or {}
    missing = [role for role in ROLES if role in found and role not in controls]
    wrong = [
        {"role": role, "is": controls[role], "found": found[role]}
        for role in ROLES
        if role in found and role in controls and controls[role] != found[role]
    ]
    if not missing and not wrong:
        return None
    return {
        "battery_id": battery["id"],
        "name": battery.get("name") or battery["id"],
        "profile": battery.get("adapter"),
        "missing": missing,
        "wrong": wrong,
        "hash": role_hash(found),
    }


def adopted_controls(battery: dict[str, Any], found: dict[str, str]) -> dict[str, str]:
    """The levers after taking the profile's find over: the find, plus the
    user's roles the profile does not know, unless their entity is one the
    profile found under another role (a limit assigned as a power)."""
    profile = PROFILES.get(battery.get("adapter") or "")
    known = (
        set(profile.roles)
        | set(profile.entry_roles)
        | set(profile.guard_roles)
        | set(profile.day_roles)
        if profile
        else set()
    )
    taken = set(found.values())
    kept = {
        role: entity_id
        for role, entity_id in (battery.get("controls") or {}).items()
        if role not in known and entity_id not in taken
    }
    return {**kept, **found}


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
