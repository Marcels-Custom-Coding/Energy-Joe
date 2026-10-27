"""What evcc (the evcc_intg integration) shows: its loadpoints and battery settings.

Joe only reads here. A loadpoint in a PV mode ("pv", "minpv") that could use
a surplus (a car is connected, or it drives a heater) is the reason to leave
daytime surplus at the grid meter (see plan/surplus.py).

evcc's own battery settings may work against that: with "battery-assisted
charging" (buffer SoC, buffer start SoC) or a loadpoint's battery boost evcc
lets the loadpoint drain the home battery, the very battery Joe wants full.
The priority SoC only tells up to which level the battery goes first; it is
shown, it does no harm.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er

from ..discovery.find import find_wallboxes
from ..discovery.snapshot import DeviceInfo, EntityInfo, Snapshot

PLATFORM = "evcc_intg"
PV_MODES = ("pv", "minpv")
# Site settings (select entities with "0" … "100"), by translation key and the
# end of the unique id (evcc_intg, checked against its source in October 2026).
SETTINGS = {
    "priority_soc": ("prioritysoc", "priority_soc"),
    "buffer_soc": ("buffersoc", "buffer_soc"),
    "buffer_start_soc": ("bufferstartsoc", "buffer_start_soc"),
}
BOOST_KEYS = ("batteryboost", "battery_boost")
# evcc's battery mode: "normal", or "hold"/"charge" while evcc steers the home
# battery itself (its discharge lock while a car charges fast). The state is
# translated ("entladen sperren"), so anything but normal counts.
MODE_KEYS = ("batterymode", "battery_mode_value", "battery_mode")
FREE_MODES = ("normal", "unknown", "unbekannt", "unavailable", "")


def snapshot(hass: HomeAssistant) -> Snapshot:
    """The entities of evcc_intg only (cheap enough for every minute)."""
    ent_reg = er.async_get(hass)
    dev_reg = dr.async_get(hass)
    entities: dict[str, EntityInfo] = {}
    names: dict[str, str] = {}
    for entry in ent_reg.entities.values():
        if entry.platform != PLATFORM or entry.disabled_by:
            continue
        state = hass.states.get(entry.entity_id)
        if entry.device_id and entry.device_id not in names:
            device = dev_reg.async_get(entry.device_id)
            if device:
                names[entry.device_id] = device.name_by_user or device.name or ""
        entities[entry.entity_id] = EntityInfo(
            entity_id=entry.entity_id,
            name=state.name if state else entry.entity_id,
            state=state.state if state else None,
            attributes=dict(state.attributes) if state else {},
            platform=PLATFORM,
            device_id=entry.device_id,
            unique_id=entry.unique_id,
            translation_key=entry.translation_key,
        )
    return Snapshot(
        entities=entities,
        devices={k: DeviceInfo(device_id=k, name=v) for k, v in names.items()},
    )


def loadpoints(snap: Snapshot) -> list[dict[str, Any]]:
    """evcc's loadpoints with their mode, and whether they could use a surplus now."""
    result = []
    for found in find_wallboxes(snap):
        if found["integration"] != PLATFORM or found["kind"] == "other":
            continue
        entities = found["entities"]
        connected = snap.get(entities.get("connected"))
        boost = next(
            (
                e
                for e in snap.of_device(found["device_id"])
                if e.domain == "switch" and any(e.has_key(k) for k in BOOST_KEYS)
            ),
            None,
        )
        heating = found["kind"] == "heating"
        plugged = connected is not None and connected.state == "on"
        result.append(
            {
                "id": found["device_id"],
                "name": found["name"],
                "kind": found["kind"],
                "mode": found["mode"],
                "connected": plugged,
                "boost": boost is not None and boost.state == "on",
                # PV mode and something that can take power.
                "wants": found["mode"] in PV_MODES and (heating or plugged),
            }
        )
    return result


def settings(snap: Snapshot) -> dict[str, Any]:
    """evcc's battery settings (percent; 0 is "off" for the buffer ones)."""
    result: dict[str, Any] = {}
    for name, keys in SETTINGS.items():
        entity = next(
            (
                e
                for e in snap.entities.values()
                if e.domain in ("select", "number") and any(e.has_key(k) for k in keys)
            ),
            None,
        )
        result[name] = entity.number if entity else None
        if entity:
            result[f"{name}_entity"] = entity.entity_id
    return result


def battery_held(snap: Snapshot) -> bool:
    """evcc steers the home battery itself right now (its mode is not "normal")."""
    entity = next(
        (
            e
            for e in snap.entities.values()
            if e.domain == "sensor" and any(e.has_key(k) for k in MODE_KEYS)
        ),
        None,
    )
    return (
        entity is not None
        and entity.state is not None
        and entity.state.strip().lower() not in FREE_MODES
    )


def conflicts(
    found: dict[str, Any], points: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    """evcc settings that let a loadpoint drain the battery Joe wants full."""
    result = []
    buffer = found.get("buffer_soc")
    if buffer is not None and 0 < buffer < 100:
        result.append({"code": "buffer_soc", "value": buffer})
    start = found.get("buffer_start_soc")
    if start is not None and 0 < start < 100:
        result.append({"code": "buffer_start_soc", "value": start})
    for point in points:
        if point["boost"]:
            result.append({"code": "battery_boost", "loadpoint": point["name"]})
    return result
