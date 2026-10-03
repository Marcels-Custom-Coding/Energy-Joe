"""Reading sensors in Joe's units and adding them up over time.

Power is read in kW in Joe's sign convention (grid positive when importing,
battery positive when charging), energy in kWh, temperature in °C.
"""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
import math
from typing import Any

from homeassistant.core import State

UNAVAILABLE = (None, "unavailable", "unknown", "")

type GetState = Callable[[str], State | None]


def number(state: State | None) -> float | None:
    """The state as a number, or None if it is not one."""
    if state is None or state.state in UNAVAILABLE:
        return None
    try:
        value = float(state.state)
    except ValueError:
        return None
    return None if math.isnan(value) or math.isinf(value) else value


def unit(state: State | None) -> str | None:
    return state.attributes.get("unit_of_measurement") if state else None


def to_kw(value: float, unit_text: str | None) -> float:
    if unit_text == "W":
        return value / 1000
    if unit_text == "MW":
        return value * 1000
    return value


def to_kwh(value: float, unit_text: str | None) -> float:
    if unit_text == "Wh":
        return value / 1000
    if unit_text == "MWh":
        return value * 1000
    return value


def measurement_entities(measurement: dict[str, Any] | None) -> list[str]:
    """The entities a measurement reads from."""
    if not measurement:
        return []
    return [
        entity
        for entity in (measurement["entity_id"], measurement.get("minus_entity_id"))
        if entity
    ]


def measurement_kw(get: GetState, measurement: dict[str, Any] | None) -> float | None:
    """Current value of a power measurement in kW, in Joe's sign convention."""
    if not measurement:
        return None
    state = get(measurement["entity_id"])
    value = number(state)
    if value is None:
        return None
    kw = to_kw(value, unit(state))
    if measurement.get("invert"):
        kw = -kw
    if minus := measurement.get("minus_entity_id"):
        other = get(minus)
        other_value = number(other)
        if other_value is None:
            return None
        kw -= to_kw(other_value, unit(other))
    return kw


def energy_kwh(state: State | None) -> float | None:
    """An energy counter or size in kWh."""
    value = number(state)
    return None if value is None else to_kwh(value, unit(state))


def sum_kwh(get: GetState, entity_ids: list[str]) -> float | None:
    """Sum of several energy sensors in kWh (e.g. the forecast of each plane)."""
    values = [v for e in entity_ids if (v := energy_kwh(get(e))) is not None]
    return round(sum(values), 3) if values else None


def temperature_c(state: State | None) -> float | None:
    """Outdoor temperature of a weather entity in °C."""
    if state is None or state.state in UNAVAILABLE:
        return None
    value = state.attributes.get("temperature")
    if not isinstance(value, int | float):
        return None
    if state.attributes.get("temperature_unit") == "°F":
        return (value - 32) * 5 / 9
    return float(value)


@dataclass(slots=True)
class Integrator:
    """Adds up a value over time, the left-hand way: a value holds until the next.

    For power in kW the sums are kWh, split into the positive and the negative
    side (import and export, charging and discharging). For a value of 1 or 0
    (someone at home) the positive sum is hours. "covered" counts the seconds
    with a known value.
    """

    value: float | None = None
    since: float | None = None
    positive: float = 0.0
    negative: float = 0.0
    covered: float = 0.0

    def update(self, now: float, value: float | None) -> None:
        self.advance(now)
        self.value = value

    def advance(self, now: float) -> None:
        if self.since is not None and self.value is not None and now > self.since:
            seconds = now - self.since
            amount = self.value * seconds / 3600
            if amount >= 0:
                self.positive += amount
            else:
                self.negative -= amount
            self.covered += seconds
        self.since = now

    def take(self, now: float) -> tuple[float, float, float]:
        """Return (positive, negative, covered seconds) up to now and start over."""
        self.advance(now)
        result = (self.positive, self.negative, self.covered)
        self.positive = self.negative = self.covered = 0.0
        return result
