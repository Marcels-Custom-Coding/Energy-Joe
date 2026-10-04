"""Automations that write to the batteries Joe steers.

They can overwrite what Joe sets (a mode, a power, a limit), so the panel
lists them and can switch them off at once. Joe remembers which ones it
switched off, when and why, writes that into the automation's logbook and
can switch exactly those on again (also when the integration is removed).

Only actions count – an automation that merely reads a battery (a trigger, a
condition, refreshing a sensor) is left out – and only the battery itself:
Joe's levers, the entities of the battery's device and of devices linked to
it, and for some integrations (Omnibattery) the whole integration entry.
Scripts an automation calls are followed.
"""

from __future__ import annotations

import contextlib
from dataclasses import dataclass, field
from typing import Any

from homeassistant.components.automation import DATA_COMPONENT
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.util import dt as dt_util

from .profiles import PROFILES

# Why Joe switched an automation off (the panel and the logbook say it in words).
REASON = "battery"
# Keys of an automation step that hold conditions, not actions.
_CONDITIONS = ("condition", "conditions", "if", "while", "until", "wait_for_trigger")
# Actions that only read, refresh or tell: they do not steer a battery.
_READING = ("homeassistant.update_entity", "logbook.log")
_READING_DOMAINS = ("notify", "persistent_notification", "system_log", "tts")
# Entities that cannot be set (a target on them only reads).
_READ_ONLY = ("sensor", "binary_sensor", "event")
_SCRIPT_SERVICES = ("script.turn_on", "script.toggle")


@dataclass
class Found:
    """What an automation's actions set: entities and whole devices."""

    entities: set[str] = field(default_factory=set)
    devices: set[str] = field(default_factory=set)


@dataclass
class Scope:
    """What belongs to the batteries: entity -> battery, device -> battery."""

    entities: dict[str, dict[str, Any]] = field(default_factory=dict)
    devices: dict[str, dict[str, Any]] = field(default_factory=dict)
    # Joe's own levers (controls, prepare steps, steps).
    levers: set[str] = field(default_factory=set)


def _ids(value: Any, *, entity: bool = True) -> set[str]:
    """Ids from a string (also "a, b"), a list or nothing; templates are skipped."""
    values = value if isinstance(value, list) else [value]
    found: set[str] = set()
    for item in values:
        if not isinstance(item, str):
            continue
        for part in item.split(","):
            part = part.strip()
            if not part or "{" in part or " " in part:
                continue
            if entity and "." not in part:
                continue
            found.add(part)
    return found


def targets(
    hass: HomeAssistant | None, step: Any, seen: set[str] | None = None
) -> Found:
    """What a sequence of automation steps sets (following called scripts)."""
    found = Found()
    _walk(hass, step, found, seen if seen is not None else set())
    return found


def _walk(hass: HomeAssistant | None, step: Any, found: Found, seen: set[str]) -> None:
    if isinstance(step, list):
        for item in step:
            _walk(hass, item, found, seen)
        return
    # A step switched off in the editor, or a condition among the actions.
    if (
        not isinstance(step, dict)
        or step.get("enabled") is False
        or "condition" in step
    ):
        return
    service = step.get("action") or step.get("service")
    if isinstance(service, str) and (
        service in _READING or service.split(".", 1)[0] in _READING_DOMAINS
    ):
        return
    if service or "device_id" in step:
        holders = [
            step,
            step.get("target"),
            step.get("data"),
            step.get("data_template"),
        ]
        entities: set[str] = set()
        for holder in holders:
            if isinstance(holder, dict):
                entities |= _ids(holder.get("entity_id"))
                found.devices |= _ids(holder.get("device_id"), entity=False)
        found.entities |= entities
        if isinstance(service, str):
            scripts = (
                {e for e in entities if e.startswith("script.")}
                if service in _SCRIPT_SERVICES
                else {service}
                if service.startswith("script.")
                and service not in ("script.turn_off", "script.reload")
                else set()
            )
            for script in scripts:
                _walk_script(hass, script, found, seen)
    for key, value in step.items():
        if key not in _CONDITIONS and isinstance(value, list | dict):
            _walk(hass, value, found, seen)


def _walk_script(
    hass: HomeAssistant | None, entity_id: str, found: Found, seen: set[str]
) -> None:
    if hass is None or entity_id in seen:
        return
    seen.add(entity_id)
    component = hass.data.get("script")
    entity = component.get_entity(entity_id) if component else None
    if entity is None:
        return
    script = getattr(entity, "script", None)
    sequence = getattr(script, "sequence", None)
    if sequence is None:
        sequence = (getattr(entity, "raw_config", None) or {}).get("sequence") or []
    _walk(hass, sequence, found, seen)


def battery_scope(hass: HomeAssistant, config: dict[str, Any]) -> Scope:
    """Everything that belongs to the batteries Joe knows."""
    entities = er.async_get(hass)
    devices = dr.async_get(hass)
    scope = Scope()
    for battery in config["batteries"]:
        levers = {
            *(battery.get("controls") or {}).values(),
            *(step["entity_id"] for step in battery.get("prepare") or []),
        }
        for steps in (battery.get("steps") or {}).values():
            for step in steps:
                levers |= _ids(step.get("entity_id"))
                data = step.get("data") or {}
                levers |= _ids(data.get("entity_id"))
                levers |= _ids((data.get("target") or {}).get("entity_id"))
        mine = set(levers)
        device_ids: set[str] = set()
        device = devices.async_get(battery.get("device_id") or "")
        if device:
            device_ids.add(device.id)
            if device.via_device_id:
                device_ids.add(device.via_device_id)
            device_ids |= {
                d.id for d in devices.devices.values() if d.via_device_id == device.id
            }
        profile = PROFILES.get(battery.get("adapter") or "")
        if profile and profile.automation_scope == "entry" and device:
            for entry_id in device.config_entries:
                for item in er.async_entries_for_config_entry(entities, entry_id):
                    mine.add(item.entity_id)
                    if item.device_id:
                        device_ids.add(item.device_id)
        for device_id in device_ids:
            mine |= {
                item.entity_id
                for item in er.async_entries_for_device(entities, device_id)
            }
            scope.devices.setdefault(device_id, battery)
        for entity_id in mine:
            scope.entities.setdefault(entity_id, battery)
        scope.levers |= levers
    return scope


def find(
    hass: HomeAssistant, config: dict[str, Any], switched_off: dict[str, Any]
) -> list[dict[str, Any]]:
    """The automations that write to a battery, with what they write."""
    component = hass.data.get(DATA_COMPONENT)
    if component is None:
        return []
    scope = battery_scope(hass, config)
    devices = dr.async_get(hass)
    found = []
    for entity in component.entities:
        action_script = getattr(entity, "action_script", None)
        if action_script is not None:
            steps: Any = action_script.sequence
        else:
            raw = getattr(entity, "raw_config", None) or {}
            steps = raw.get("actions") or raw.get("action") or []
        written = targets(hass, steps)
        writes = [
            {
                "entity_id": entity_id,
                "name": (s.name if (s := hass.states.get(entity_id)) else entity_id),
                "battery": scope.entities[entity_id].get("name") or "",
                "battery_id": scope.entities[entity_id]["id"],
                "joe": entity_id in scope.levers,
            }
            for entity_id in sorted(written.entities)
            if entity_id in scope.entities
            and entity_id.split(".", 1)[0] not in _READ_ONLY
        ]
        for device_id in sorted(written.devices & scope.devices.keys()):
            device = devices.async_get(device_id)
            writes.append(
                {
                    "entity_id": None,
                    "name": (device.name_by_user or device.name or device_id)
                    if device
                    else device_id,
                    "battery": scope.devices[device_id].get("name") or "",
                    "battery_id": scope.devices[device_id]["id"],
                    "joe": False,
                }
            )
        if not writes:
            continue
        state = hass.states.get(entity.entity_id)
        found.append(
            {
                "entity_id": entity.entity_id,
                "name": state.name if state else entity.entity_id,
                "on": bool(state and state.state == "on"),
                "writes": writes,
                "switched_off": switched_off.get(entity.entity_id),
            }
        )
    return sorted(found, key=lambda a: (not a["on"], a["name"].lower()))


async def async_switch(
    hass: HomeAssistant,
    entity_ids: list[str],
    on: bool,
    switched_off: dict[str, Any],
    message: str,
) -> list[str]:
    """Switch automations off (and remember it) or back on; returns failures.

    `message` goes into each automation's logbook, so the reason is also
    visible in Home Assistant itself.
    """
    failed = []
    for entity_id in entity_ids:
        try:
            await hass.services.async_call(
                "automation",
                "turn_on" if on else "turn_off",
                {"entity_id": entity_id},
                blocking=True,
            )
        except Exception:  # noqa: BLE001 - one that fails must not stop the others
            failed.append(entity_id)
            continue
        if on:
            switched_off.pop(entity_id, None)
        else:
            switched_off[entity_id] = {
                "at": dt_util.now().isoformat(timespec="seconds"),
                "reason": REASON,
            }
        if hass.services.has_service("logbook", "log"):
            state = hass.states.get(entity_id)
            # The note is a bonus: a logbook that fails changes nothing.
            with contextlib.suppress(Exception):
                await hass.services.async_call(
                    "logbook",
                    "log",
                    {
                        "name": state.name if state else entity_id,
                        "message": message,
                        "entity_id": entity_id,
                        "domain": "energy_joe",
                    },
                    blocking=True,
                )
    return failed
