"""Read Joe-relevant hints from the Energy dashboard configuration."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass(slots=True)
class Power:
    """A power reading in Joe's convention (see knowledge.KeyRole)."""

    entity_id: str
    invert: bool = False
    minus_entity_id: str | None = None

    def as_measurement(self) -> dict[str, Any]:
        return {
            "entity_id": self.entity_id,
            "invert": self.invert,
            "minus_entity_id": self.minus_entity_id,
        }


@dataclass(slots=True)
class EnergyBattery:
    """A battery as configured in the Energy dashboard."""

    name: str | None
    energy_entities: list[str]
    power: Power | None
    soc_entity: str | None
    capacity_kwh: float | None


@dataclass(slots=True)
class EnergyHints:
    """Everything Joe takes from the Energy dashboard."""

    configured: bool = False
    grid_power: Power | None = None
    solar_power: list[str] = field(default_factory=list)
    solar_energy: list[str] = field(default_factory=list)
    forecast_entries: list[str] = field(default_factory=list)
    batteries: list[EnergyBattery] = field(default_factory=list)
    price_entity: str | None = None
    price_number: float | None = None
    feed_in_entity: str | None = None
    feed_in_number: float | None = None
    devices: list[dict[str, Any]] = field(default_factory=list)
    counts: dict[str, int] = field(default_factory=dict)


def parse_energy_prefs(prefs: dict[str, Any] | None) -> EnergyHints:
    """Turn the Energy dashboard preferences into hints."""
    hints = EnergyHints()
    if not prefs:
        return hints
    sources = prefs.get("energy_sources") or []
    hints.configured = bool(sources or prefs.get("device_consumption"))
    hints.counts = {
        kind: sum(1 for s in sources if s.get("type") == kind)
        for kind in ("grid", "solar", "battery", "gas", "water")
    }
    hints.devices = list(prefs.get("device_consumption") or [])
    hints.counts["devices"] = len(hints.devices)

    for source in sources:
        kind = source.get("type")
        if kind == "grid":
            _read_grid(source, hints)
        elif kind == "solar":
            if rate := source.get("stat_rate"):
                hints.solar_power.append(rate)
            if energy := source.get("stat_energy_from"):
                hints.solar_energy.append(energy)
            hints.forecast_entries.extend(
                source.get("config_entry_solar_forecast") or []
            )
        elif kind == "battery":
            hints.batteries.append(
                EnergyBattery(
                    name=source.get("name"),
                    energy_entities=[
                        e
                        for e in (
                            source.get("stat_energy_from"),
                            source.get("stat_energy_to"),
                        )
                        if e
                    ],
                    # Energy dashboard: positive while discharging; Joe: positive while charging.
                    power=_power(source, positive_is_joe=False),
                    soc_entity=source.get("stat_soc"),
                    capacity_kwh=source.get("capacity"),
                )
            )
    return hints


def _read_grid(source: dict[str, Any], hints: EnergyHints) -> None:
    # Energy dashboard: positive while importing, like Joe.
    if hints.grid_power is None:
        hints.grid_power = _power(source, positive_is_joe=True)
    if hints.price_entity is None:
        hints.price_entity = source.get("entity_energy_price")
    if hints.price_number is None:
        hints.price_number = source.get("number_energy_price")
    if hints.feed_in_entity is None:
        hints.feed_in_entity = source.get("entity_energy_price_export")
    if hints.feed_in_number is None:
        hints.feed_in_number = source.get("number_energy_price_export")
    # Older dashboard format kept the import side in a list.
    for flow in source.get("flow_from") or []:
        if hints.price_entity is None:
            hints.price_entity = flow.get("entity_energy_price")
        if hints.price_number is None:
            hints.price_number = flow.get("number_energy_price")


def _power(source: dict[str, Any], *, positive_is_joe: bool) -> Power | None:
    """Read a power sensor in any of the dashboard's three forms.

    "stat_rate" is always in the dashboard's convention (Home Assistant
    generates a corrected sensor for the other forms), so it is preferred.
    """
    flip = not positive_is_joe
    if rate := source.get("stat_rate"):
        return Power(rate, invert=flip)
    config = source.get("power_config") or {}
    if rate := config.get("stat_rate"):
        return Power(rate, invert=flip)
    if rate := config.get("stat_rate_inverted"):
        return Power(rate, invert=not flip)
    out, back = config.get("stat_rate_from"), config.get("stat_rate_to")
    if out and back:
        # from = discharge / consumption, to = charge / return
        return (
            Power(out, minus_entity_id=back)
            if positive_is_joe
            else Power(back, minus_entity_id=out)
        )
    return None
