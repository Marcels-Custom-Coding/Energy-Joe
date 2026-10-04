"""Sensors: what Joe does, tonight's target and what steering would have saved."""

from __future__ import annotations

from typing import Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import PERCENTAGE
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .entity import JoeEntity
from .runtime import DATA_RUNTIME

STATUSES = [
    "simulation",
    "off",
    "no_plan",
    "waiting",
    "unanswered",
    "declined",
    "skipped",
    "nothing",
    "steering",
    # The grid-friendly morning: charging held back for the midday sun.
    "day",
    "done",
]


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    runtime = hass.data[DATA_RUNTIME]
    async_add_entities(
        [
            JoeStatusSensor(runtime, entry, "status"),
            JoeTargetSensor(runtime, entry, "target"),
            JoeSavingSensor(runtime, entry, "saving"),
            JoeLastNightSensor(runtime, entry, "last_night"),
        ]
    )


class JoeStatusSensor(JoeEntity, SensorEntity):
    """Why Joe steers or not right now."""

    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = STATUSES

    @property
    def native_value(self) -> str:
        return self.runtime.executor.status["reason"]

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        status = self.runtime.executor.status
        return {
            "night": status.get("night"),
            "batteries": {
                key: {k: v for k, v in entry.items() if v is not None}
                for key, entry in status.get("batteries", {}).items()
            },
            "pending_release": status.get("pending", False),
        }


class JoeTargetSensor(JoeEntity, SensorEntity):
    """Tonight's target charge level."""

    _attr_native_unit_of_measurement = PERCENTAGE

    @property
    def native_value(self) -> float | None:
        plan = self.runtime.planner.plan or {}
        return (
            plan.get("target")
            if plan.get("kind") in ("charge", "hold", "none")
            else None
        )

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        plan = self.runtime.planner.plan or {}
        return {
            "kind": plan.get("kind"),
            "fixed": plan.get("fixed", False),
            "window_start": (plan.get("window") or {}).get("start"),
            "window_end": (plan.get("window") or {}).get("end"),
            "charge_from": plan.get("charge_from"),
            "grid_charge_kwh": plan.get("grid_charge_kwh"),
            "batteries": {
                b["id"]: b.get("target") for b in plan.get("batteries") or []
            },
        }


class _MoneySensor(JoeEntity, SensorEntity):
    _attr_device_class = SensorDeviceClass.MONETARY

    @property
    def native_unit_of_measurement(self) -> str:
        return self.hass.config.currency


class JoeSavingSensor(_MoneySensor):
    """What steering would have saved since learning (re)started."""

    _attr_state_class = SensorStateClass.TOTAL

    @property
    def native_value(self) -> float | None:
        results = self.runtime.learner.results or {}
        return results.get("saving") if results else None

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        results = self.runtime.learner.results or {}
        return {k: results.get(k) for k in ("days", "better", "worse", "since")}


class JoeLastNightSensor(_MoneySensor):
    """What the last night would have saved (provisional until its day is over)."""

    @property
    def native_value(self) -> float | None:
        last = (self.runtime.learner.results or {}).get("last") or {}
        return last.get("saving")

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        last = (self.runtime.learner.results or {}).get("last") or {}
        return {"date": last.get("date"), "final": last.get("final")}
