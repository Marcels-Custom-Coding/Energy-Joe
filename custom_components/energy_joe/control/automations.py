"""Automations that write to the batteries Joe steers.

They can overwrite what Joe sets (a mode, a power, a limit), so the panel
lists them and can switch them off at once. Joe remembers which ones it
switched off, when and why, writes that into the automation's logbook and
can switch exactly those on again. Only actions count: an automation that
merely reads a battery (a trigger or a condition) is left out.
"""

from __future__ import annotations

from typing import Any

from homeassistant.components.automation import DATA_COMPONENT
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.util import dt as dt_util

# Why Joe switched an automation off (the panel and the logbook say it in words).
REASON = "battery"
# Keys of an automation step that hold conditions, not actions.
_CONDITIONS = ("condition", "conditions", "if", "while", "until")


def targets(step: Any) -> set[str]:
    """The entities an automation's actions set (service calls, device actions)."""
    found: set[str] = set()
    if isinstance(step, list):
        for item in step:
            found |= targets(item)
        return found
    if not isinstance(step, dict):
        return found
    if "action" in step or "service" in step or "device_id" in step:
        for holder in (step, step.get("target"), step.get("data")):
            if isinstance(holder, dict):
                found |= _entity_ids(holder.get("entity_id"))
    for key, value in step.items():
        if key not in _CONDITIONS and isinstance(value, list | dict):
            found |= targets(value)
    return found


def _entity_ids(value: Any) -> set[str]:
    values = value if isinstance(value, list) else [value]
    return {
        v
        for v in values
        if isinstance(v, str) and "." in v and "{" not in v and " " not in v
    }


def battery_entities(hass: HomeAssistant, config: dict[str, Any]) -> dict[str, str]:
    """Entity id -> battery name: Joe's levers and everything of the battery's
    device and integration entry (e.g. Omnibattery's system device)."""
    entities = er.async_get(hass)
    devices = dr.async_get(hass)
    result: dict[str, str] = {}
    for battery in config["batteries"]:
        name = battery.get("name") or battery["id"]
        mine = {
            *(battery.get("controls") or {}).values(),
            *(step["entity_id"] for step in battery.get("prepare") or []),
        }
        entry_ids: set[str] = set()
        device_id = battery.get("device_id")
        if device_id and devices.async_get(device_id):
            for item in er.async_entries_for_device(entities, device_id):
                mine.add(item.entity_id)
                if item.config_entry_id:
                    entry_ids.add(item.config_entry_id)
        soc = entities.async_get(battery.get("soc_entity") or "")
        if soc and soc.config_entry_id:
            entry_ids.add(soc.config_entry_id)
        for entry_id in entry_ids:
            mine |= {
                item.entity_id
                for item in er.async_entries_for_config_entry(entities, entry_id)
            }
        for entity_id in mine:
            result.setdefault(entity_id, name)
    return result


def find(
    hass: HomeAssistant, config: dict[str, Any], switched_off: dict[str, Any]
) -> list[dict[str, Any]]:
    """The automations that write to a battery, with what they write."""
    component = hass.data.get(DATA_COMPONENT)
    if component is None:
        return []
    batteries = battery_entities(hass, config)
    found = []
    for entity in component.entities:
        raw = getattr(entity, "raw_config", None) or {}
        written = targets(raw.get("actions") or raw.get("action") or [])
        hits = sorted(written & batteries.keys())
        if not hits:
            continue
        state = hass.states.get(entity.entity_id)
        found.append(
            {
                "entity_id": entity.entity_id,
                "name": state.name if state else entity.entity_id,
                "on": bool(state and state.state == "on"),
                "writes": [
                    {
                        "entity_id": entity_id,
                        "name": (
                            s.name if (s := hass.states.get(entity_id)) else entity_id
                        ),
                        "battery": batteries[entity_id],
                    }
                    for entity_id in hits
                ],
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
