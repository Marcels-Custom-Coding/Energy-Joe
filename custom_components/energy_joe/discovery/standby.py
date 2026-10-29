"""Devices that might draw power at night or while nobody is home.

A candidate is a switch with a power reading on the same device – typically a
smart plug. What Joe already knows and steers otherwise stays out: the home
batteries, wallboxes and cars, heat pumps and hot water, the climate devices,
inverters and the house meter, and the switches of his night actions. Names
that sound like something that has to run all the time (a fridge, the router,
a pump …) get a warning, but stay in the list: the owner decides.
"""

from __future__ import annotations

import re
from typing import Any

from . import knowledge as kb
from .find import KIND_WORDS, POWER_UNITS, _has_word
from .snapshot import EntityInfo, Snapshot

# Kinds of consumers Joe steers or plans with (not only measures): their
# devices are no standby candidates.
KNOWN_KINDS = ("climate", "heat_pump", "hot_water", "electric_heating", "ev")
# Parts of the configuration whose entities belong to what Joe knows.
KNOWN_PARTS = ("measurements", "batteries", "cars", "climate", "actions")
# Domains whose devices are steered elsewhere (thermostats, boilers).
KNOWN_DOMAINS = ("climate", "water_heater")
# Names that sound like a device that has to keep running. Short words only
# count as whole words ("nas", not "Nase").
WARN_WORDS = (
    "kühl*",
    "kuehl*",
    "gefrier*",
    "fridge",
    "freezer",
    "router",
    "fritz*",
    "modem",
    "nas",
    "server",
    "netzwerk*",
    "network",
    "repeater",
    "mesh",
    "pumpe*",
    "*pumpe",
    "pump",
    "aquarium",
    "terrarium",
    "kamera*",
    "camera",
    "alarm*",
    "sirene",
    "rauchmelder",
    "zentrale",
    "gateway",
    "bridge",
    "hub",
    "telefon",
    "phone",
    "medizin*",
    "cpap",
    "heizung*",
    "brunnen",
)
_ENTITY_ID = re.compile(r"^[a-z0-9_]+\.[a-z0-9_]+$")


def warning(*names: str | None) -> str | None:
    """The word that makes a device sound like it must keep running."""
    for name in names:
        if not name:
            continue
        hay = " " + re.sub(r"[^a-z0-9äöüß]+", " ", name.lower()) + " "
        for word in WARN_WORDS:
            if word.startswith("*"):
                stem = word.lstrip("*")
                if re.search(rf"\w{re.escape(stem)} ", hay):
                    return stem
            elif found := _has_word(name, (word,)):
                return found
    return None


def known_entities(config: dict[str, Any]) -> set[str]:
    """Every entity of what Joe already knows (see KNOWN_PARTS)."""
    found: set[str] = set()

    def walk(value: Any) -> None:
        if isinstance(value, dict):
            for key, item in value.items():
                if isinstance(key, str) and _ENTITY_ID.match(key):
                    found.add(key)
                walk(item)
        elif isinstance(value, list):
            for item in value:
                walk(item)
        elif isinstance(value, str) and _ENTITY_ID.match(value):
            found.add(value)

    for part in KNOWN_PARTS:
        walk(config.get(part))
    walk(
        [
            consumer
            for consumer in config.get("consumers") or []
            if consumer.get("kind") in KNOWN_KINDS
        ]
    )
    return found


def known_devices(config: dict[str, Any]) -> set[str]:
    """Devices named in the configuration (the meters of climate devices)."""
    found: set[str] = set()
    for room in ((config.get("climate") or {}).get("rooms") or {}).values():
        meter = room.get("meter")
        if isinstance(meter, dict) and meter.get("device_id"):
            found.add(meter["device_id"])
    return found


def _is_power(entity: EntityInfo) -> bool:
    return (
        entity.domain == "sensor"
        and entity.device_class == "power"
        and entity.unit in POWER_UNITS
    )


def watts(entity: EntityInfo | None) -> float | None:
    """A power reading in W (None: unknown)."""
    if entity is None or entity.number is None:
        return None
    factor = {"W": 1.0, "kW": 1000.0, "MW": 1_000_000.0}.get(entity.unit or "", 1.0)
    return round(entity.number * factor, 1)


def _known_platforms() -> set[str]:
    return {
        *kb.INTEGRATION_ROLES,
        *kb.WALLBOX_KEYS,
        *kb.CAR_KEYS,
        *kb.FORECAST_PLATFORMS,
        "evcc_intg",
    }


def _steered_kind(*names: str | None) -> bool:
    """A name that says heat pump, hot water, wallbox or air conditioner."""
    for kind, words in KIND_WORDS:
        if kind in KNOWN_KINDS and any(n and _has_word(n, words) for n in names):
            return True
    return any(n and _has_word(n, kb.STORAGE_WORDS) for n in names)


def _similar(a: str, b: str) -> int:
    """How long the start two entity ids share (after the domain)."""
    left, right = a.split(".", 1)[1], b.split(".", 1)[1]
    size = 0
    for x, y in zip(left, right, strict=False):
        if x != y:
            break
        size += 1
    return size


def find_standby(
    snap: Snapshot,
    config: dict[str, Any],
    categorized: set[str] | frozenset[str] = frozenset(),
) -> list[dict[str, Any]]:
    """Every switch with a power reading on its device that Joe does not know
    yet, with its room and a warning word (`categorized`: config and
    diagnostic entities, which are settings of a device, not its power)."""
    known = known_entities(config)
    known_device_ids = known_devices(config)
    platforms = _known_platforms()
    for entity_id in known:
        if (entity := snap.get(entity_id)) is not None and entity.device_id:
            known_device_ids.add(entity.device_id)
    by_device: dict[str, list[EntityInfo]] = {}
    for entity in snap.entities.values():
        if entity.device_id:
            by_device.setdefault(entity.device_id, []).append(entity)
    found: list[dict[str, Any]] = []
    for device_id, entities in by_device.items():
        if device_id in known_device_ids:
            continue
        if any(e.domain in KNOWN_DOMAINS for e in entities):
            continue
        if any(e.platform in platforms for e in entities):
            continue
        device = snap.devices.get(device_id)
        device_name = device.name if device else None
        switches = [
            e
            for e in entities
            if e.domain == "switch" and e.entity_id not in categorized
        ]
        powers = [
            e for e in entities if _is_power(e) and e.entity_id not in categorized
        ]
        if not switches or not powers:
            continue
        if len(switches) > 1 and len(powers) < len(switches):
            # One reading for several outlets: what one of them saves is unknown.
            continue
        if _steered_kind(device_name, *(s.name for s in switches)):
            continue
        left = list(powers)
        for switch in sorted(switches, key=lambda e: e.entity_id):
            power = max(left, key=lambda p: _similar(switch.entity_id, p.entity_id))
            if len(switches) > 1:
                left.remove(power)
            name = switch.name or device_name or switch.entity_id
            found.append(
                {
                    "entity_id": switch.entity_id,
                    "power_entity": power.entity_id,
                    "name": name,
                    "device_id": device_id,
                    "device_name": device_name,
                    "area": switch.area or (device.area if device else None),
                    "state": switch.state,
                    "watts": watts(power),
                    "warning": warning(name, device_name),
                }
            )
    found.sort(key=lambda d: ((d["area"] or "~").lower(), d["name"].lower()))
    return found
