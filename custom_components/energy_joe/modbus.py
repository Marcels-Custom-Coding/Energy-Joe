"""Joe's own entities for an inverter he steers over Modbus TCP (a Fronius
GEN24): the storage control's rates, bits, reserve and grid charging as
numbers and switches, its reference power, level and state as sensors.

They are the levers of the profile "fronius_modbus" (control/profiles.py):
the adapter writes them like any other entity, the probe reads them back,
and the owner sees in Home Assistant what the inverter holds. One inverter
per host, port and unit; every battery that names it in `modbus` shares it.
"""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from datetime import timedelta
import logging
from typing import Any

from homeassistant.components.number import NumberEntity, NumberMode
from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorStateClass,
)
from homeassistant.components.switch import SwitchEntity
from homeassistant.const import PERCENTAGE, UnitOfPower
from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity import Entity
from homeassistant.helpers.update_coordinator import (
    CoordinatorEntity,
    DataUpdateCoordinator,
    UpdateFailed,
)

from .const import DOMAIN
from .control.fronius_modbus import (
    STATES,
    Gen24Storage,
    NotFound,
    Reading,
    inverter_slug,
)
from .control.modbus_tcp import ModbusError, ModbusTcp

_LOGGER = logging.getLogger(__name__)

# How often Joe reads the inverter while nothing is written.
SCAN = timedelta(seconds=30)
PLATFORMS = ("number", "switch", "sensor")
ADAPTER = "fronius_modbus"


@dataclass(frozen=True, slots=True)
class Settings:
    """How to reach an inverter."""

    host: str
    port: int = 502
    unit: int = 1

    @classmethod
    def of(cls, settings: dict[str, Any]) -> Settings:
        return cls(
            str(settings["host"]).strip(),
            int(settings.get("port") or 502),
            int(settings.get("unit") if settings.get("unit") is not None else 1),
        )

    @property
    def key(self) -> str:
        return f"{self.host}:{self.port}/{self.unit}"

    @property
    def slug(self) -> str:
        return inverter_slug(self.host, self.port, self.unit)


ReadingListener = Callable[[Settings, Reading, bool], None]


class Inverter:
    """One inverter: its client, its readings, its entities."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry_id: str,
        settings: Settings,
        on_reading: ReadingListener,
    ) -> None:
        self.hass = hass
        self.entry_id = entry_id
        self.settings = settings
        self.client = ModbusTcp(settings.host, settings.port, settings.unit)
        self.storage = Gen24Storage(self.client)
        self._on_reading = on_reading
        self._read_once = False
        self.coordinator: DataUpdateCoordinator[Reading] = DataUpdateCoordinator(
            hass,
            _LOGGER,
            name=f"{DOMAIN} modbus {settings.key}",
            config_entry=hass.config_entries.async_get_entry(entry_id),
            update_method=self._async_update,
            update_interval=SCAN,
        )

    @property
    def slug(self) -> str:
        return self.settings.slug

    @property
    def device_info(self) -> DeviceInfo:
        return DeviceInfo(
            identifiers={(DOMAIN, f"modbus_{self.slug}")},
            name=f"Fronius GEN24 Modbus {self.settings.host}",
            manufacturer="Fronius",
            model="GEN24 (Modbus TCP)",
        )

    async def _async_update(self) -> Reading:
        try:
            reading = await self.storage.async_read()
        except NotFound as err:
            raise UpdateFailed("not_found") from err
        except ModbusError as err:
            raise UpdateFailed(err.code) from err
        first, self._read_once = not self._read_once, True
        self._on_reading(self.settings, reading, first)
        return reading

    async def async_write(self, field: str, value: float | int | bool) -> None:
        """One field, then read back at once (the entities show it)."""
        await self.storage.async_write(field, value)
        await self.coordinator.async_refresh()

    async def async_set_control(
        self, charge: bool | None = None, discharge: bool | None = None
    ) -> None:
        await self.storage.async_set_control(charge, discharge)
        await self.coordinator.async_refresh()

    async def async_close(self) -> None:
        await self.client.async_close()

    def entities(self, platform: str) -> list[Entity]:
        if platform == "number":
            return [
                RateNumber(self, "storage_charge_rate", "charge_rate", 0),
                RateNumber(self, "storage_discharge_rate", "discharge_rate", -100),
                ReserveNumber(self),
            ]
        if platform == "switch":
            return [
                LimitingSwitch(self, "storage_charge_limiting", "charge"),
                LimitingSwitch(self, "storage_discharge_limiting", "discharge"),
                GridChargingSwitch(self),
            ]
        if platform == "sensor":
            return [MaxPowerSensor(self), LevelSensor(self), StatusSensor(self)]
        return []


class ModbusInverters:
    """The inverters Joe steers over Modbus, as the configuration names them."""

    def __init__(
        self, hass: HomeAssistant, entry_id: str, on_reading: ReadingListener
    ) -> None:
        self._hass = hass
        self._entry_id = entry_id
        self._on_reading = on_reading
        self.inverters: dict[str, Inverter] = {}
        self._adders: dict[str, Callable[[list[Entity]], None]] = {}
        self._added: set[tuple[str, str]] = set()

    @callback
    def async_register_platform(
        self, platform: str, add: Callable[[list[Entity]], None]
    ) -> CALLBACK_TYPE:
        """A platform is ready to take entities: the inverters known so far
        get theirs now, later ones as they come."""
        self._adders[platform] = add
        for inverter in self.inverters.values():
            self._add(inverter, platform)

        @callback
        def unregister() -> None:
            if self._adders.get(platform) is add:
                del self._adders[platform]

        return unregister

    def _add(self, inverter: Inverter, platform: str) -> None:
        add = self._adders.get(platform)
        mark = (inverter.settings.key, platform)
        if add is None or mark in self._added:
            return
        self._added.add(mark)
        add(inverter.entities(platform))

    @callback
    def async_apply(self, batteries: list[dict[str, Any]]) -> None:
        """Inverters as the batteries name them: new ones start, dropped ones
        go (their entities and device, too)."""
        wanted: dict[str, Settings] = {}
        for battery in batteries:
            if battery.get("adapter") == ADAPTER and battery.get("modbus"):
                settings = Settings.of(battery["modbus"])
                wanted[settings.key] = settings
        for key in list(self.inverters):
            if key not in wanted:
                self._hass.async_create_task(self._async_drop(key))
        for key, settings in wanted.items():
            if key in self.inverters:
                continue
            inverter = Inverter(self._hass, self._entry_id, settings, self._on_reading)
            self.inverters[key] = inverter
            for platform in PLATFORMS:
                self._add(inverter, platform)
            self._hass.async_create_task(inverter.coordinator.async_refresh())

    def inverter_for(self, battery: dict[str, Any]) -> Inverter | None:
        if not battery.get("modbus"):
            return None
        return self.inverters.get(Settings.of(battery["modbus"]).key)

    async def _async_drop(self, key: str) -> None:
        inverter = self.inverters.pop(key, None)
        if inverter is None:
            return
        self._added = {m for m in self._added if m[0] != key}
        await inverter.async_close()
        registry = er.async_get(self._hass)
        prefix = f"{self._entry_id}_modbus_{inverter.slug}_"
        for entry in list(registry.entities.values()):
            if entry.platform == DOMAIN and (entry.unique_id or "").startswith(prefix):
                registry.async_remove(entry.entity_id)
        devices = dr.async_get(self._hass)
        device = devices.async_get_device({(DOMAIN, f"modbus_{inverter.slug}")})
        if device is not None:
            devices.async_remove_device(device.id)

    async def async_check(self, host: str, port: int = 502, unit: int = 1) -> dict:
        """What an inverter answers (the panel's "Verbindung prüfen"): the
        model found and its values, or why not (`problem`)."""
        settings = Settings.of({"host": host, "port": port, "unit": unit})
        known = self.inverters.get(settings.key)
        client = known.client if known else ModbusTcp(host, port, unit)
        storage = known.storage if known else Gen24Storage(client)
        try:
            layout = storage.layout or await storage.async_detect()
            reading = await storage.async_read()
        except NotFound:
            return {"ok": False, "problem": "not_found"}
        except ModbusError as err:
            return {"ok": False, "problem": err.code, "detail": err.detail}
        finally:
            if known is None:
                await client.async_close()
        return {"ok": True, **layout.as_dict(), **reading.as_dict()}

    async def async_unload(self) -> None:
        for inverter in self.inverters.values():
            await inverter.async_close()
        self.inverters.clear()
        self._added.clear()


# --- the entities -----------------------------------------------------------------


class ModbusEntity(CoordinatorEntity[DataUpdateCoordinator[Reading]]):
    """Base: named by translation, on the inverter's device."""

    _attr_has_entity_name = True

    def __init__(self, inverter: Inverter, key: str) -> None:
        super().__init__(inverter.coordinator)
        self.inverter = inverter
        self._attr_translation_key = key
        self._attr_unique_id = f"{inverter.entry_id}_modbus_{inverter.slug}_{key}"
        self._attr_device_info = inverter.device_info

    @property
    def reading(self) -> Reading | None:
        return self.coordinator.data


class RateNumber(ModbusEntity, NumberEntity):
    """A rate in percent of the reference power; the discharge rate below 0
    charges from the grid."""

    _attr_native_unit_of_measurement = PERCENTAGE
    _attr_native_step = 0.1
    _attr_native_max_value = 100
    _attr_mode = NumberMode.BOX

    def __init__(self, inverter: Inverter, key: str, field: str, low: float) -> None:
        super().__init__(inverter, key)
        self._field = field
        self._attr_native_min_value = low

    @property
    def native_value(self) -> float | None:
        reading = self.reading
        if reading is None:
            return None
        return (
            reading.charge_rate_pct
            if self._field == "charge_rate"
            else reading.discharge_rate_pct
        )

    async def async_set_native_value(self, value: float) -> None:
        await self.inverter.async_write(self._field, value)


class ReserveNumber(ModbusEntity, NumberEntity):
    """The minimum reserve in percent (MinRsvPct)."""

    _attr_native_unit_of_measurement = PERCENTAGE
    _attr_native_step = 1
    _attr_native_min_value = 0
    _attr_native_max_value = 100
    _attr_mode = NumberMode.BOX

    def __init__(self, inverter: Inverter) -> None:
        super().__init__(inverter, "storage_reserve")

    @property
    def native_value(self) -> float | None:
        return self.reading.reserve_pct if self.reading else None

    async def async_set_native_value(self, value: float) -> None:
        await self.inverter.async_write("reserve", value)


class LimitingSwitch(ModbusEntity, SwitchEntity):
    """One bit of StorCtl_Mod: on, the rate of that direction counts."""

    def __init__(self, inverter: Inverter, key: str, direction: str) -> None:
        super().__init__(inverter, key)
        self._direction = direction

    @property
    def is_on(self) -> bool | None:
        reading = self.reading
        if reading is None:
            return None
        return (
            reading.charge_limited
            if self._direction == "charge"
            else reading.discharge_limited
        )

    async def async_turn_on(self, **kwargs: Any) -> None:
        await self._async_set(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self._async_set(False)

    async def _async_set(self, on: bool) -> None:
        if self._direction == "charge":
            await self.inverter.async_set_control(charge=on)
        else:
            await self.inverter.async_set_control(discharge=on)


class GridChargingSwitch(ModbusEntity, SwitchEntity):
    """ChaGriSet: charging from the grid allowed (together with the
    inverter's own setting)."""

    def __init__(self, inverter: Inverter) -> None:
        super().__init__(inverter, "storage_grid_charging")

    @property
    def is_on(self) -> bool | None:
        return self.reading.grid_charging if self.reading else None

    async def async_turn_on(self, **kwargs: Any) -> None:
        await self.inverter.async_write("grid_charging", True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self.inverter.async_write("grid_charging", False)


class MaxPowerSensor(ModbusEntity, SensorEntity):
    """WChaMax: what 100 % of the rates stand for."""

    _attr_device_class = SensorDeviceClass.POWER
    _attr_native_unit_of_measurement = UnitOfPower.WATT
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(self, inverter: Inverter) -> None:
        super().__init__(inverter, "storage_max_power")

    @property
    def native_value(self) -> float | None:
        return self.reading.max_power_w if self.reading else None


class LevelSensor(ModbusEntity, SensorEntity):
    """The level as the inverter reports it over Modbus (ChaState)."""

    _attr_device_class = SensorDeviceClass.BATTERY
    _attr_native_unit_of_measurement = PERCENTAGE
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(self, inverter: Inverter) -> None:
        super().__init__(inverter, "storage_level")

    @property
    def native_value(self) -> float | None:
        return self.reading.level_pct if self.reading else None


class StatusSensor(ModbusEntity, SensorEntity):
    """ChaSt: off, empty, discharging, charging, full, holding, testing."""

    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = [*STATES.values(), "unknown"]

    def __init__(self, inverter: Inverter) -> None:
        super().__init__(inverter, "storage_status")

    @property
    def native_value(self) -> str | None:
        return self.reading.status if self.reading else None
