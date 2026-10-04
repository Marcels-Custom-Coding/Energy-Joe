"""Which device measures a thermostat or air conditioner (the "Klima" page).

A Shelly Pro 3EM in device-measurement mode shows each channel as a device of
its own, "connected via" the meter ("Schlafzimmer Klimaanlage" via "Shelly
Pro 3EM HV Gerätemessungen"). Joe offers every device with a power or energy
sensor and suggests the one whose name (and room) fits. Several air
conditioners may hang on one meter; then the reading counts for all of them.
"""

from __future__ import annotations

import re
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import (
    area_registry as ar,
    device_registry as dr,
    entity_registry as er,
)

# A suggestion needs at least this much in common (names and room).
SUGGEST_SCORE = 0.6
SAME_AREA = 0.25
_WORDS = re.compile(r"[^\w]+")
# Words of a sensor's name that only tell what it measures.
_MEASURES = {
    "power",
    "leistung",
    "wirkleistung",
    "energy",
    "energie",
    "total",
    "gesamt",
    "verbrauch",
    "consumption",
}


def _class(item: er.RegistryEntry) -> str | None:
    return item.device_class or item.original_device_class


def _device_name(device: dr.DeviceEntry | None) -> str | None:
    return (device.name_by_user or device.name) if device else None


def _words(text: str | None) -> list[str]:
    return [w for w in _WORDS.split((text or "").lower()) if w and w != "_"]


def _stem(text: str | None) -> tuple[str, ...]:
    return tuple(w for w in _words(text) if w not in _MEASURES)


def meter_options(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Every device with a power or energy sensor, one entry per power sensor."""
    entities = er.async_get(hass)
    devices = dr.async_get(hass)
    areas = ar.async_get(hass)
    sensors: dict[str, dict[str, list[er.RegistryEntry]]] = {}
    for item in entities.entities.values():
        if item.domain != "sensor" or not item.device_id or item.disabled_by:
            continue
        kind = _class(item)
        if kind in ("power", "energy"):
            sensors.setdefault(item.device_id, {"power": [], "energy": []})[
                kind
            ].append(item)
    found = []
    for device_id, by_kind in sensors.items():
        device = devices.async_get(device_id)
        if device is None:
            continue
        parent = (
            devices.async_get(device.via_device_id) if device.via_device_id else None
        )
        area = areas.async_get_area(device.area_id) if device.area_id else None
        energy = sorted(by_kind["energy"], key=lambda e: e.entity_id)
        power = sorted(by_kind["power"], key=lambda e: e.entity_id)
        several = len(power) > 1
        for item in power or [None]:
            # The energy sensor that belongs to this power sensor: same name
            # without the measuring word, else the device's only one.
            match = None
            if item is not None:
                stem = _stem(_entity_name(hass, item))
                match = next(
                    (e for e in energy if _stem(_entity_name(hass, e)) == stem), None
                )
            if match is None and (len(energy) == 1 or item is None):
                match = energy[0] if energy else None
            found.append(
                {
                    "device_id": device_id,
                    "name": _device_name(device),
                    "sensor": _entity_name(hass, item) if item and several else None,
                    "via": _device_name(parent),
                    "area": area.name if area else None,
                    "power": item.entity_id if item else None,
                    "energy": match.entity_id if match else None,
                }
            )
    return sorted(
        found,
        key=lambda m: ((m["via"] or "~").lower(), (m["name"] or "").lower()),
    )


def _entity_name(hass: HomeAssistant, item: er.RegistryEntry) -> str:
    state = hass.states.get(item.entity_id)
    if state is not None:
        return state.name
    return item.name or item.original_name or item.entity_id


def _similar(one: str | None, other: str | None) -> float:
    a, b = _stem(one), _stem(other)
    if not a or not b:
        return 0.0
    # "Klima" and "Klimaanlage" are the same word here.
    same = sum(
        1
        for word in a
        if any(
            word == w
            or (
                min(len(word), len(w)) >= 4
                and (word.startswith(w) or w.startswith(word))
            )
            for w in b
        )
    )
    return same / max(len(a), len(b))


def suggest(
    climate: dict[str, Any], options: list[dict[str, Any]]
) -> dict[str, Any] | None:
    """The meter that most likely measures a climate device, or None."""
    own = [
        m
        for m in options
        if climate.get("device_id") and m["device_id"] == climate["device_id"]
    ]
    if own:
        return own[0]
    best, score = None, 0.0
    for meter in options:
        names = [meter["name"], meter["sensor"]]
        value = max(
            _similar(mine, theirs)
            for mine in (climate.get("name"), climate.get("device_name"))
            for theirs in names
        )
        if not value:
            continue
        if climate.get("area") and climate["area"] == meter["area"]:
            value += SAME_AREA
        if value > score:
            best, score = meter, value
    return best if score >= SUGGEST_SCORE else None
