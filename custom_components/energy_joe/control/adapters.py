"""How Joe steers a battery: the executor decides what it should do, an adapter
turns that into writes to the battery's own entities (or service calls).

A battery is steered through common levers ("roles", see profiles.py): a
floor, grid charging, a forced-charge mode, a discharge limit. Joe picks the
first lever the battery offers, in the order its profile prefers:

- charge(target, power): forced-charge mode, or grid charging with a target
  level, or (for inverters like Fronius) the reserve raised to the target
- hold(floor): the floor as minimum level, else a hold mode, else forced
  charging with 0 W ("standby"), else the discharge limit
- block: no discharge at all (while another battery charges from the grid)

Some batteries need a switch first ("prepare", e.g. Remote Control), some
take commands only for a while ("command_timeout"), some are steered with
services ("steps", e.g. Huawei's forcible charge).

Originals: before Joe changes an entity the first time in a night he notes its
value ("saved"). Leaving a state puts these values back; the release at the end
of the night restores all of them, newest first.
"""

from __future__ import annotations

from dataclasses import dataclass, replace
import hashlib
import json
import math
from typing import Any

from homeassistant.core import HomeAssistant

from .profiles import GENERIC, MODE_METHODS, PROFILES, Profile, profile_for
from .writes import Write, available

# Charging power when neither the plan nor the battery says (W).
DEFAULT_CHARGE_W = 1000
# How long a command lasts when the battery wants a duration (seconds).
DEFAULT_SPAN = 6 * 3600


@dataclass(frozen=True, slots=True)
class Desired:
    """What a battery should do right now."""

    floor: int | None = None
    block: bool = False
    charge_to: int | None = None
    power_w: float | None = None
    # Length of the window, for batteries that take commands only for a while.
    span_s: float | None = None


class Adapter:
    """Base: a battery steered through some of its entities."""

    kind = "none"

    def __init__(self, battery: dict[str, Any]) -> None:
        self.battery = battery
        self.controls: dict[str, str] = dict(battery.get("controls") or {})

    @property
    def name(self) -> str:
        return self.battery["name"]

    @property
    def can_charge(self) -> bool:
        """Whether Joe can charge this battery from the grid at all."""
        return True

    def entities(self) -> list[str]:
        """Every entity this adapter may change."""
        return list(self.controls.values())

    def missing(self, hass: HomeAssistant) -> list[str]:
        raise NotImplementedError

    @property
    def signature(self) -> str:
        """Changes when the way of steering changes (a new test run is needed)."""
        data = {
            "kind": self.kind,
            "controls": self.controls,
            "options": self.battery.get("mode_options") or {},
            "prepare": self.battery.get("prepare") or [],
            "steps": self.battery.get("steps") or {},
        }
        digest = hashlib.sha256(json.dumps(data, sort_keys=True).encode())
        return digest.hexdigest()[:12]

    def writes(
        self,
        hass: HomeAssistant,
        desired: Desired,
        soc: float,
        saved: dict[str, Any],
    ) -> list[Write]:
        raise NotImplementedError

    def release(self, saved: dict[str, Any]) -> list[Write]:
        """Everything this adapter changed back, newest first (undoes order rules too)."""
        mine = set(self.entities())
        return [
            Write(entity_id, saved[entity_id])
            for entity_id in reversed(list(saved))
            if entity_id in mine and saved[entity_id] is not None
        ]


def _range(
    hass: HomeAssistant, entity_id: str | None, low: float = 0, high: float = 100
) -> tuple[float, float]:
    state = hass.states.get(entity_id or "")
    attrs = state.attributes if state else {}
    minimum, maximum = attrs.get("min"), attrs.get("max")
    return (
        float(minimum) if isinstance(minimum, int | float) else low,
        float(maximum) if isinstance(maximum, int | float) else high,
    )


def _last_wins(writes: list[Write]) -> list[Write]:
    """One write per entity: the last one, at its own position."""
    result: list[Write] = []
    for write in writes:
        result = [w for w in result if w.entity_id != write.entity_id]
        result.append(write)
    return result


class RoleAdapter(Adapter):
    """A battery steered through common levers (a profile or levers the user assigned)."""

    def __init__(self, battery: dict[str, Any], profile: Profile) -> None:
        super().__init__(battery)
        self.profile = profile
        self.kind = battery.get("adapter") or profile.key
        self.options: dict[str, str] = {
            **{
                meaning: names[0] for meaning, names in profile.options.items() if names
            },
            **(battery.get("mode_options") or {}),
        }
        self.prepare: list[dict[str, Any]] = list(battery.get("prepare") or [])

    def entities(self) -> list[str]:
        return [*self.controls.values(), *(step["entity_id"] for step in self.prepare)]

    # --- what the battery offers --------------------------------------------------

    def _has(self, *roles: str) -> bool:
        return all(role in self.controls for role in roles)

    def charge_methods(self) -> list[str]:
        result = []
        for method in self.profile.charge:
            if (
                method == "mode"
                and self._has("mode")
                and self.options.get("force_charge")
                or method == "target"
                and self._has("grid_charge", "charge_target")
                or method == "min_soc"
                and self._has("grid_charge", "min_soc")
            ):
                result.append(method)
        return result

    def _can_hold(self, method: str) -> bool:
        if method == "min_soc":
            return self._has("min_soc")
        if method == "mode_hold":
            return self._has("mode") and bool(self.options.get("hold"))
        if method == "standby":
            return self._has("mode", "charge_power") and bool(
                self.options.get("force_charge")
            )
        if method == "limit":
            return self._has("discharge_limit")
        return False

    def hold_methods(self) -> list[str]:
        return [method for method in self.profile.hold if self._can_hold(method)]

    @property
    def can_charge(self) -> bool:
        return bool(self.charge_methods())

    def can_defer(self) -> bool:
        """Whether charging (from the sun too) can be held back while discharging stays free."""
        return self._has("charge_limit")

    def defer(self) -> list[Write]:
        """Hold back charging for a grid-friendly morning: charge limit 0."""
        writes = []
        if "charge_limit_enabled" in self.controls:
            writes.append(Write(self.controls["charge_limit_enabled"], True))
        writes.append(Write(self.controls["charge_limit"], 0))
        return self._paced(writes)

    def release(self, saved: dict[str, Any]) -> list[Write]:
        return self._paced(super().release(saved))

    def _paced(self, writes: list[Write]) -> list[Write]:
        """Pauses between commands for devices that need them (Modbus)."""
        pace = self.profile.pace
        if not pace:
            return writes
        prepared = {step["entity_id"] for step in self.prepare}
        return [
            replace(w, pause=pace * 2 if w.entity_id in prepared else pace)
            for w in writes
        ]

    def missing(self, hass: HomeAssistant) -> list[str]:
        """What keeps Joe from steering: no way to hold, or entities gone.

        Charging is a bonus: a battery Joe can only hold still saves the cheap
        night for the expensive morning.
        """
        result = []
        if not self.hold_methods():
            result.append("hold")
        for role, entity_id in self.controls.items():
            if not available(hass.states.get(entity_id)):
                result.append(role)
        return result

    # --- writes ---------------------------------------------------------------------------

    def writes(
        self,
        hass: HomeAssistant,
        desired: Desired,
        soc: float,
        saved: dict[str, Any],
    ) -> list[Write]:
        return self._paced(self._writes(hass, desired, soc, saved))

    def _writes(
        self,
        hass: HomeAssistant,
        desired: Desired,
        soc: float,
        saved: dict[str, Any],
    ) -> list[Write]:
        if desired.charge_to is not None and self.can_charge:
            return _last_wins(self._lift_block(saved) + self._charge(hass, desired))
        # Out of charging: the forced mode first, then its power, target and switches.
        result = self._restore(
            saved,
            "mode",
            "charge_power",
            "charge_target",
            "command_timeout",
            "grid_charge",
        )
        result += self._unprepare(saved)
        if desired.block:
            result += self._block(hass, soc, desired)
        else:
            result += self._lift_block(saved)
            floor = desired.floor
            if floor is None and desired.charge_to is not None:
                floor = max(0, math.floor(soc))
            if floor is not None:
                result += self._hold(hass, floor, soc, desired)
            else:
                result += self._restore(saved, "min_soc")
        return _last_wins(result)

    def _charge(self, hass: HomeAssistant, desired: Desired) -> list[Write]:
        c = self.controls
        target = desired.charge_to
        assert target is not None
        for method in self.charge_methods():
            result = self._prepare(method)
            if method == "mode":
                low, high = self._level_range(hass, "charge_target", 0, 100)
                if "charge_target" in c and low <= target <= high:
                    result.append(
                        Write(c["charge_target"], self._level("charge_target", target))
                    )
                if "charge_power" in c:
                    result.append(
                        Write(c["charge_power"], self._power(hass, desired.power_w))
                    )
                result += self._timeout(hass, desired)
                return [*result, Write(c["mode"], self.options["force_charge"])]
            if method == "target":
                result.append(
                    Write(c["charge_target"], self._level("charge_target", target))
                )
                if "charge_power" in c:
                    result.append(
                        Write(c["charge_power"], self._power(hass, desired.power_w))
                    )
                return [*result, Write(c["grid_charge"], self._on("grid_charge"))]
            if method == "min_soc":
                return [
                    *result,
                    Write(c["grid_charge"], self._on("grid_charge")),
                    Write(c["min_soc"], self._level("min_soc", target)),
                ]
        return []

    def _hold(
        self, hass: HomeAssistant, floor: int, soc: float, desired: Desired
    ) -> list[Write]:
        c = self.controls
        for method in self.hold_methods():
            if method == "min_soc":
                low, high = self._level_range(hass, "min_soc", 0, 100)
                if floor <= high:
                    return [
                        Write(c["min_soc"], self._level("min_soc", max(floor, low)))
                    ]
                if soc > floor + 0.5:
                    # Above its range: discharge allowed for now, Joe watches the level.
                    return [Write(c["min_soc"], self._level("min_soc", high))]
                continue
            return self._prepare(method) + self._still(hass, method, desired)
        return []

    def _block(self, hass: HomeAssistant, soc: float, desired: Desired) -> list[Write]:
        c = self.controls
        for method in self.profile.block:
            if method == "min_soc":
                if "min_soc" not in c:
                    continue
                low, high = self._level_range(hass, "min_soc", 0, 100)
                level = math.floor(soc)
                if low <= level <= high:
                    return [Write(c["min_soc"], self._level("min_soc", level))]
                continue
            if self._can_hold(method):
                return self._prepare(method) + self._still(hass, method, desired)
        return []

    def _still(self, hass: HomeAssistant, method: str, desired: Desired) -> list[Write]:
        """Writes that keep a battery from discharging with a mode or a limit."""
        c = self.controls
        if method == "mode_hold":
            return [
                *self._timeout(hass, desired),
                Write(c["mode"], self.options["hold"]),
            ]
        if method == "standby":
            return [
                Write(c["charge_power"], 0),
                *self._timeout(hass, desired),
                Write(c["mode"], self.options["force_charge"]),
            ]
        if method == "limit":
            return self._limit()
        return []

    def _limit(self) -> list[Write]:
        """The discharge limit to 0 first, then its switch on (it is ignored while off)."""
        c = self.controls
        result = [Write(c["discharge_limit"], 0)]
        if "discharge_limit_enabled" in c:
            result.append(Write(c["discharge_limit_enabled"], True))
        return result

    def _lift_block(self, saved: dict[str, Any]) -> list[Write]:
        """The limit's switch off first, then the limit back."""
        return self._restore(saved, "discharge_limit_enabled", "discharge_limit")

    def _prepare(self, method: str) -> list[Write]:
        if method not in self.profile.prepare_for and not (
            self.profile is GENERIC and method in MODE_METHODS
        ):
            return []
        return [Write(step["entity_id"], step.get("value")) for step in self.prepare]

    def _unprepare(self, saved: dict[str, Any]) -> list[Write]:
        return [
            Write(step["entity_id"], saved[step["entity_id"]])
            for step in reversed(self.prepare)
            if saved.get(step["entity_id"]) is not None
        ]

    def _timeout(self, hass: HomeAssistant, desired: Desired) -> list[Write]:
        """A command duration that outlasts the night (it is put back in the morning)."""
        entity_id = self.controls.get("command_timeout")
        if not entity_id:
            return []
        span = (desired.span_s or DEFAULT_SPAN) + 3600
        state = hass.states.get(entity_id)
        unit = (state.attributes.get("unit_of_measurement") if state else None) or "s"
        value = (
            span / 60
            if unit in ("min", "minutes")
            else span / 3600
            if unit == "h"
            else span
        )
        _, high = _range(hass, entity_id, 0, value)
        return [Write(entity_id, min(math.ceil(value), high))]

    def _restore(self, saved: dict[str, Any], *roles: str) -> list[Write]:
        result = []
        for role in roles:
            entity_id = self.controls.get(role)
            if entity_id and entity_id in saved and saved[entity_id] is not None:
                result.append(Write(entity_id, saved[entity_id]))
        return result

    def _on(self, role: str) -> Any:
        values = self.profile.values.get(role)
        return values[0] if values else True

    def _level(self, role: str, level: float) -> float:
        """A level as the entity takes it (depth of discharge runs the other way)."""
        return 100 - level if role in self.profile.inverted else level

    def _level_range(
        self, hass: HomeAssistant, role: str, low: float, high: float
    ) -> tuple[float, float]:
        minimum, maximum = _range(hass, self.controls.get(role), low, high)
        if role in self.profile.inverted:
            return 100 - maximum, 100 - minimum
        return minimum, maximum

    def _power(self, hass: HomeAssistant, power: float | None) -> float:
        """The charging power in the unit of the power entity (W, kW, % or A)."""
        watts = power or self.battery.get("max_charge_w") or DEFAULT_CHARGE_W
        entity_id = self.controls["charge_power"]
        state = hass.states.get(entity_id)
        unit = (state.attributes.get("unit_of_measurement") if state else None) or "W"
        maximum_w = self.battery.get("max_charge_w") or watts
        if unit == "kW":
            return watts / 1000
        if unit == "%":
            return min(100.0, 100 * watts / maximum_w)
        if unit == "A":
            _, high = _range(hass, entity_id, 0, 50)
            return high * min(1.0, watts / maximum_w)
        return watts


class StepsAdapter(Adapter):
    """Batteries steered with steps: entity values or service calls.

    The user assigns steps in the panel for odd devices; profiles of
    integrations steered by services bring their own (resolved by discovery).
    Values may be "{floor}", "{target}", "{power}", "{minutes}" or "{device}".
    """

    def __init__(self, battery: dict[str, Any]) -> None:
        super().__init__(battery)
        self.kind = battery.get("adapter") or "steps"
        self.steps: dict[str, list[dict[str, Any]]] = dict(battery.get("steps") or {})

    def entities(self) -> list[str]:
        return list(
            dict.fromkeys(
                step["entity_id"]
                for steps in self.steps.values()
                for step in steps
                if step.get("entity_id")
            )
        )

    @property
    def can_charge(self) -> bool:
        return bool(self.steps.get("charge"))

    def missing(self, hass: HomeAssistant) -> list[str]:
        result = [] if self.steps.get("hold") else ["hold"]
        for steps in self.steps.values():
            for step in steps:
                if step.get("entity_id") and hass.states.get(step["entity_id"]) is None:
                    result.append(step["entity_id"])
                elif step.get("service"):
                    domain, _, name = step["service"].partition(".")
                    if not hass.services.has_service(domain, name):
                        result.append(step["service"])
        return result

    def writes(
        self,
        hass: HomeAssistant,
        desired: Desired,
        soc: float,
        saved: dict[str, Any],
    ) -> list[Write]:
        values = self._values(desired, soc)
        if desired.charge_to is not None and self.can_charge:
            return self._render("charge", values)
        if desired.block or desired.floor is not None or desired.charge_to is not None:
            if desired.block or desired.floor is None:
                values["{floor}"] = math.floor(soc)
            return self._render("hold", values)
        return self.release(saved)

    def release(self, saved: dict[str, Any]) -> list[Write]:
        """The release steps, then every entity Joe changed back."""
        return _last_wins(
            self._render("release", self._values(Desired(), 0)) + super().release(saved)
        )

    def _values(self, desired: Desired, soc: float) -> dict[str, Any]:
        power = desired.power_w or self.battery.get("max_charge_w") or DEFAULT_CHARGE_W
        return {
            "{floor}": desired.floor if desired.floor is not None else math.floor(soc),
            "{target}": desired.charge_to,
            "{power}": round(power),
            "{minutes}": math.ceil(((desired.span_s or DEFAULT_SPAN) + 3600) / 60),
            "{device}": self.battery.get("device_id"),
        }

    def _render(self, name: str, values: dict[str, Any]) -> list[Write]:
        result = []
        for step in self.steps.get(name) or []:
            if step.get("service"):
                result.append(
                    Write(
                        f"service:{step['service']}",
                        _fill(step.get("data") or {}, values),
                    )
                )
            else:
                result.append(
                    Write(step["entity_id"], _fill(step.get("value"), values))
                )
        return result


def _fill(value: Any, values: dict[str, Any]) -> Any:
    """Placeholders replaced, in nested data, too."""
    if isinstance(value, str) and value in values:
        return values[value]
    if isinstance(value, list):
        return [_fill(item, values) for item in value]
    if isinstance(value, dict):
        return {key: _fill(item, values) for key, item in value.items()}
    return value


def make_adapter(battery: dict[str, Any]) -> Adapter | None:
    """The adapter for a battery, or None if Joe only watches it."""
    adapter = battery.get("adapter") or "none"
    if adapter == "steps":
        return StepsAdapter(battery)
    profile = profile_for(adapter)
    if profile is None:
        return None
    if profile.steps:
        return StepsAdapter(battery)
    return RoleAdapter(battery, profile)


def profile_name(adapter: str) -> str | None:
    """A readable name for a profile key."""
    profile = PROFILES.get(adapter)
    return profile.name if profile else None
