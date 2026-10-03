"""A plain snapshot of what Home Assistant knows, so discovery stays testable."""

from __future__ import annotations

from dataclasses import dataclass, field
import math
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import (
    area_registry as ar,
    device_registry as dr,
    entity_registry as er,
)
from homeassistant.util import dt as dt_util

UNAVAILABLE = (None, "unavailable", "unknown", "")


@dataclass(slots=True)
class EntityInfo:
    """One entity with its state and registry data."""

    entity_id: str
    name: str
    state: str | None = None
    attributes: dict[str, Any] = field(default_factory=dict)
    platform: str | None = None
    config_entry_id: str | None = None
    device_id: str | None = None
    area: str | None = None
    unique_id: str | None = None
    translation_key: str | None = None
    seconds_since_report: float | None = None

    @property
    def domain(self) -> str:
        return self.entity_id.split(".", 1)[0]

    @property
    def device_class(self) -> str | None:
        return self.attributes.get("device_class")

    @property
    def unit(self) -> str | None:
        return self.attributes.get("unit_of_measurement")

    @property
    def available(self) -> bool:
        return self.state not in UNAVAILABLE

    @property
    def number(self) -> float | None:
        """State as a number, or None if it is not numeric."""
        try:
            value = float(self.state)  # type: ignore[arg-type]
        except TypeError, ValueError:
            return None
        return None if math.isnan(value) or math.isinf(value) else value

    def has_key(self, key: str) -> bool:
        """Whether the entity is an integration's entity with this key.

        Integrations mark their entities with a translation key or put a key at
        the end of the unique id ("…-power_grid", "…_battery_soc", "….mode").
        """
        if self.translation_key == key:
            return True
        uid = self.unique_id or ""
        return any(uid.endswith(f"{sep}{key}") for sep in ("-", "_", "."))


@dataclass(slots=True)
class DeviceInfo:
    """A device that owns at least one entity."""

    device_id: str
    name: str
    manufacturer: str | None = None
    model: str | None = None
    area: str | None = None


@dataclass(slots=True)
class Snapshot:
    """Everything discovery looks at."""

    entities: dict[str, EntityInfo]
    devices: dict[str, DeviceInfo] = field(default_factory=dict)
    energy_prefs: dict[str, Any] | None = None
    sun_elevation: float | None = None

    def get(self, entity_id: str | None) -> EntityInfo | None:
        return self.entities.get(entity_id) if entity_id else None

    def of_platform(self, platform: str) -> list[EntityInfo]:
        return [e for e in self.entities.values() if e.platform == platform]

    def of_domain(self, domain: str) -> list[EntityInfo]:
        return [e for e in self.entities.values() if e.domain == domain]

    def of_device(self, device_id: str | None) -> list[EntityInfo]:
        if not device_id:
            return []
        return [e for e in self.entities.values() if e.device_id == device_id]

    def of_config_entry(self, entry_id: str | None) -> list[EntityInfo]:
        if not entry_id:
            return []
        return [e for e in self.entities.values() if e.config_entry_id == entry_id]

    def device_name(self, device_id: str | None) -> str | None:
        device = self.devices.get(device_id) if device_id else None
        return device.name if device else None


async def async_collect(hass: HomeAssistant) -> Snapshot:
    """Read states, registries and the Energy dashboard into a snapshot."""
    ent_reg = er.async_get(hass)
    dev_reg = dr.async_get(hass)
    area_reg = ar.async_get(hass)
    now = dt_util.utcnow()

    def area_name(area_id: str | None) -> str | None:
        area = area_reg.async_get_area(area_id) if area_id else None
        return area.name if area else None

    entities: dict[str, EntityInfo] = {}
    devices: dict[str, DeviceInfo] = {}
    for state in hass.states.async_all():
        entry = ent_reg.async_get(state.entity_id)
        device = (
            dev_reg.async_get(entry.device_id) if entry and entry.device_id else None
        )
        if device and device.id not in devices:
            devices[device.id] = DeviceInfo(
                device_id=device.id,
                name=device.name_by_user or device.name or "",
                manufacturer=device.manufacturer,
                model=device.model,
                area=area_name(device.area_id),
            )
        reported = getattr(state, "last_reported", None) or state.last_updated
        entities[state.entity_id] = EntityInfo(
            entity_id=state.entity_id,
            name=state.name,
            state=state.state,
            attributes=dict(state.attributes),
            platform=entry.platform if entry else None,
            config_entry_id=entry.config_entry_id if entry else None,
            device_id=entry.device_id if entry else None,
            area=area_name(
                (entry.area_id if entry else None)
                or (device.area_id if device else None)
            ),
            unique_id=entry.unique_id if entry else None,
            translation_key=entry.translation_key if entry else None,
            seconds_since_report=(now - reported).total_seconds(),
        )

    sun = hass.states.get("sun.sun")
    return Snapshot(
        entities=entities,
        devices=devices,
        energy_prefs=await _async_energy_prefs(hass),
        sun_elevation=sun.attributes.get("elevation") if sun else None,
    )


async def _async_energy_prefs(hass: HomeAssistant) -> dict[str, Any] | None:
    if "energy" not in hass.config.components:
        return None
    # Imported lazily: the energy integration is optional for Energy Joe.
    from homeassistant.components.energy.data import async_get_manager

    manager = await async_get_manager(hass)
    return dict(manager.data) if manager.data else None
