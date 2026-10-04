"""Writing values to Home Assistant entities and reading them back.

Joe only ever changes entities through their own services (number.set_value,
switch.turn_on, select.select_option, ...). A write is a target value for one
entity; reading it back tells whether the device took it.
"""

from __future__ import annotations

import asyncio
from dataclasses import dataclass, field, replace
import logging
import math
from typing import Any

from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import HomeAssistant, State

_LOGGER = logging.getLogger(__name__)

# How long one service call may take before Joe gives up on it.
CALL_TIMEOUT = 20

NUMBERS = ("number", "input_number")
TOGGLES = ("switch", "input_boolean")
OPTIONS = ("select", "input_select")
PRESSES = ("button", "input_button")
SCRIPTS = ("script",)
WRITABLE = (*NUMBERS, *TOGGLES, *OPTIONS, *PRESSES, *SCRIPTS)


@dataclass(frozen=True, slots=True)
class Write:
    """A value Joe wants an entity to have (None: just press or run it).

    A service call is a write to "service:<domain>.<service>" with its data as value.
    """

    entity_id: str
    value: Any = None
    # Seconds the device needs after this command before the next one.
    pause: float = field(default=0.0, compare=False)

    @property
    def domain(self) -> str:
        if self.entity_id.startswith("service:"):
            return "service"
        return self.entity_id.split(".", 1)[0]

    @property
    def is_call(self) -> bool:
        return self.domain == "service"

    def as_dict(self) -> dict[str, Any]:
        return {"entity_id": self.entity_id, "value": self.value}


class WriteError(Exception):
    """A service call failed or the entity is missing."""

    def __init__(self, entity_id: str, code: str) -> None:
        super().__init__(f"{entity_id}: {code}")
        self.entity_id = entity_id
        self.code = code


def available(state: State | None) -> bool:
    return state is not None and state.state not in (STATE_UNAVAILABLE, STATE_UNKNOWN)


def read(hass: HomeAssistant, entity_id: str) -> Any:
    """The entity's value as Joe compares it: number, bool or option; None if unknown."""
    state = hass.states.get(entity_id)
    if not available(state):
        return None
    domain = entity_id.split(".", 1)[0]
    if domain in NUMBERS:
        try:
            return float(state.state)
        except ValueError:
            return None
    if domain in TOGGLES:
        return state.state == "on"
    if domain in OPTIONS:
        return state.state
    return state.state


def fit(hass: HomeAssistant, write: Write) -> Write:
    """Keep a number within the entity's range and step, an option within its options."""
    if write.is_call:
        return write
    state = hass.states.get(write.entity_id)
    if write.domain in NUMBERS and write.value is not None:
        value = float(write.value)
        attrs = state.attributes if state else {}
        low, high = attrs.get("min"), attrs.get("max")
        if isinstance(low, int | float):
            value = max(value, float(low))
        if isinstance(high, int | float):
            value = min(value, float(high))
        step = attrs.get("step")
        if isinstance(step, int | float) and step > 0:
            base = float(low) if isinstance(low, int | float) else 0.0
            value = base + round((value - base) / step) * step
            if isinstance(high, int | float) and value > high:
                value -= step
        return replace(write, value=round(value, 4))
    if write.domain in TOGGLES and write.value is not None:
        return replace(write, value=_as_bool(write.value))
    return write


def matches(hass: HomeAssistant, write: Write) -> bool:
    """Whether the entity shows the value of a write (presses always match, calls never)."""
    if write.is_call:
        return False
    if write.value is None or write.domain in (*PRESSES, *SCRIPTS):
        return True
    current = read(hass, write.entity_id)
    if current is None:
        return False
    if write.domain in NUMBERS:
        state = hass.states.get(write.entity_id)
        step = (state.attributes.get("step") if state else None) or 0
        tolerance = max(0.01, float(step) / 2 if isinstance(step, int | float) else 0)
        return math.isclose(float(current), float(write.value), abs_tol=tolerance)
    if write.domain in TOGGLES:
        return bool(current) == _as_bool(write.value)
    return str(current) == str(write.value)


def _as_bool(value: Any) -> bool:
    if isinstance(value, str):
        return value.lower() in ("on", "true", "1", "an", "ein")
    return bool(value)


async def async_apply(hass: HomeAssistant, write: Write) -> None:
    """Call the entity's service so it takes the value (raises WriteError)."""
    if write.is_call:
        await _async_call(hass, write)
        return
    state = hass.states.get(write.entity_id)
    if state is None:
        raise WriteError(write.entity_id, "missing")
    if not available(state) and write.domain not in (*SCRIPTS, *PRESSES):
        raise WriteError(write.entity_id, "unavailable")
    write = fit(hass, write)
    domain = write.domain
    target = {"entity_id": write.entity_id}
    if domain in NUMBERS:
        service, data = "set_value", {**target, "value": write.value}
    elif domain in TOGGLES:
        service, data = ("turn_on" if write.value else "turn_off"), target
    elif domain in OPTIONS:
        options = state.attributes.get("options") or []
        if options and write.value not in options:
            raise WriteError(write.entity_id, "option")
        service, data = "select_option", {**target, "option": write.value}
    elif domain in PRESSES:
        service, data = "press", target
    elif domain in SCRIPTS:
        service, data = "turn_on", target
    else:
        raise WriteError(write.entity_id, "domain")
    try:
        async with asyncio.timeout(CALL_TIMEOUT):
            await hass.services.async_call(domain, service, data, blocking=True)
    except TimeoutError as err:
        raise WriteError(write.entity_id, "timeout") from err
    except Exception as err:  # noqa: BLE001 - every failure of a device call counts the same
        _LOGGER.warning(
            "Writing %s to %s failed: %s", write.value, write.entity_id, err
        )
        raise WriteError(write.entity_id, "failed") from err
    if write.pause:
        await settle(write.pause)


async def settle(seconds: float) -> None:
    """Give a device time between commands (tests replace this)."""
    await asyncio.sleep(seconds)


async def _async_call(hass: HomeAssistant, write: Write) -> None:
    domain, _, service = write.entity_id.removeprefix("service:").partition(".")
    if not hass.services.has_service(domain, service):
        raise WriteError(write.entity_id, "missing")
    try:
        async with asyncio.timeout(CALL_TIMEOUT):
            await hass.services.async_call(
                domain, service, dict(write.value or {}), blocking=True
            )
    except TimeoutError as err:
        raise WriteError(write.entity_id, "timeout") from err
    except Exception as err:  # noqa: BLE001 - every failure of a device call counts the same
        _LOGGER.warning("Calling %s failed: %s", write.entity_id, err)
        raise WriteError(write.entity_id, "failed") from err


async def async_apply_all(hass: HomeAssistant, writes: list[Write]) -> list[WriteError]:
    """Apply writes in order, skipping what already matches; returns the failures."""
    errors: list[WriteError] = []
    for write in writes:
        if matches(hass, fit(hass, write)) and write.domain not in (*PRESSES, *SCRIPTS):
            continue
        try:
            await async_apply(hass, write)
        except WriteError as err:
            errors.append(err)
    return errors
