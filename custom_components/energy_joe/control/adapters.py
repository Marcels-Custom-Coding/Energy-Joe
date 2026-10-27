"""How Joe steers a battery: the executor decides what it should do, an adapter
turns that into writes to the battery's own entities (or service calls).

A battery is steered through common levers ("roles", see profiles.py): a
floor, grid charging, a forced-charge mode, a discharge limit. Joe picks the
first lever the battery offers, in the order its profile prefers:

- charge(target, power): forced-charge mode, or grid charging with a target
  level, or (for inverters like Fronius) the reserve raised to the target
- hold(floor): the floor as minimum level (on its step, never above the
  battery's level), else a hold mode, else forced charging with 0 W
  ("standby"), else the discharge limit
- block: no discharge at all (while another battery charges from the grid):
  its own "allow discharging" switch off (Omnibattery: its control stays in
  automatic mode) or "block discharging" on (Kostal over Modbus) where it
  has one, else as its profile prefers
- where no method applies (its level below the lowest floor its entity
  takes) the adapter says so (steer_problem), never silently

By day the same adapter blocks charging and discharging for "Nacheinander"
and the watchdog: switches, a mode with an option per direction, its floor
and charge target at its level (Kostal over Modbus), or charge and
discharge limits at 0 (also without a switch, also below 0, in W, kW or A),
see team_lever and guard_block_roles.

Some batteries need a switch first ("prepare", e.g. Remote Control), some
take commands only for a while ("command_timeout"), some are steered with
services ("steps", e.g. Huawei's forcible charge).

Own steps: the owner may give steps of their own for any operation
(battery.steps: charge, hold, release, block, block_charge, block_discharge,
cap). Where they exist Joe uses them instead of the profile's levers, by day
too ("Nacheinander", the watchdog's block, the daytime cap); what they wrote
goes back from the noted originals, plus the own release steps. Written
values that stand count as the block being in force (see _own_blocked).

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

from .profiles import (
    BLOCK_OPERATIONS,
    DAY_OPERATIONS,
    DAY_OPTIONS,
    DAY_ROLES,
    GENERIC,
    MODE_METHODS,
    OPERATIONS,
    PROFILES,
    SYSTEM_ROLES,
    Profile,
    day_only,
    profile_for,
)
from .writes import Write, available, fit, matches, read

# Charging power when neither the plan nor the battery says (W).
DEFAULT_CHARGE_W = 1000
# How long a command lasts when the battery wants a duration (seconds).
DEFAULT_SPAN = 6 * 3600
# The longest duration a service takes ("{seconds}": Marstek, a day).
MAX_SECONDS = 86400


@dataclass(frozen=True, slots=True)
class Desired:
    """What a battery should do right now."""

    floor: int | None = None
    block: bool = False
    charge_to: int | None = None
    power_w: float | None = None
    # Length of the window, for batteries that take commands only for a while.
    span_s: float | None = None
    # Whether every battery behind the system's limits is idle, so a block
    # may use them (see executor._whole_system).
    whole_system: bool = True
    # The night's ceiling holds the charge limit (executor._async_night_cap):
    # lifting a block leaves it alone.
    capped: bool = False


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

    def power_lever(self, hass: HomeAssistant) -> str | None:
        """How Joe sets the power when charging from the grid: "power" (a
        charging power), "cap" (a charge limit as a ceiling, Fronius) or None
        (it charges as fast as it does)."""
        return None

    def prepare_entities(self) -> list[str]:
        """Entities switched before steering (e.g. a manual mode)."""
        return []

    def loop_owned(self) -> set[str]:
        """Entities the device's own control takes back once prepare is undone."""
        return set()

    def prepared(self, hass: HomeAssistant) -> bool:
        """Whether a prepare step is in force now (or cannot be read)."""
        return False

    def missing(self, hass: HomeAssistant) -> list[str]:
        raise NotImplementedError

    def day_roles(self) -> set[str]:
        """The roles only the day uses (cap, "Nacheinander", watchdog)."""
        return set(DAY_ROLES)

    @property
    def signature(self) -> str:
        """Changes when the way of steering changes (a new test run is needed)."""
        day = self.day_roles()
        data = {
            "kind": self.kind,
            # The levers of the day (cap, watchdog) are no part of the night.
            "controls": {k: v for k, v in self.controls.items() if k not in day},
            "options": {
                k: v
                for k, v in (self.battery.get("mode_options") or {}).items()
                if k not in DAY_OPTIONS
            },
            "prepare": self.battery.get("prepare") or [],
            # Own steps of the day (a block, the cap) are no part of the night.
            "steps": {
                k: v
                for k, v in (self.battery.get("steps") or {}).items()
                if k not in DAY_OPERATIONS
            },
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

    def steer_problem(
        self,
        hass: HomeAssistant,
        desired: Desired,
        soc: float,
        saved: dict[str, Any],
    ) -> str | None:
        """Why the writes do not do what is desired right now, or None:
        "cannot_block" (no way to keep it from discharging while another
        charges), "cannot_hold" (no way to hold it at its floor), e.g. its
        level below the lowest floor its entity takes."""
        return None

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
        # The profile's first options only where discovery noted none: a
        # meaning missing from the options it noted is not offered by the
        # select (GoodWe's core integration has no "eco_charge").
        self.options: dict[str, str] = dict(battery.get("mode_options") or {}) or {
            meaning: names[0] for meaning, names in profile.options.items() if names
        }
        self.prepare: list[dict[str, Any]] = list(battery.get("prepare") or [])
        # The owner's own steps per operation (see own_steps).
        self.steps: dict[str, list[dict[str, Any]]] = dict(battery.get("steps") or {})

    def entities(self) -> list[str]:
        return list(
            dict.fromkeys(
                [
                    *self.controls.values(),
                    *self.prepare_entities(),
                    *self.own_entities(*OPERATIONS),
                ]
            )
        )

    # --- the owner's own steps ----------------------------------------------------

    def own_steps(self, op: str) -> list[dict[str, Any]] | None:
        """The owner's own steps for an operation, None where there are none."""
        steps = self.steps.get(op)
        return list(steps) if steps else None

    def own_entities(self, *ops: str) -> list[str]:
        """The entities the own steps of these operations write, in their order."""
        return list(
            dict.fromkeys(
                step["entity_id"]
                for op in ops
                for step in self.steps.get(op) or []
                if step.get("entity_id")
            )
        )

    def op_steps(
        self,
        op: str,
        hass: HomeAssistant,
        soc: float | None = None,
        desired: Desired | None = None,
        percent: float | None = None,
    ) -> list[Write] | None:
        """The own steps of an operation as writes, with the values of the
        moment filled in; None where the owner gave none."""
        if not self.own_steps(op):
            return None
        level = self._soc(hass) if soc is None else soc
        values = self._values(desired or Desired(), level or 0.0, percent)
        return self._paced(self._render(op, values))

    def own_free(self, saved: dict[str, Any], keep: set[str]) -> list[Write]:
        """What the own steps of a block wrote back as it was (newest first,
        but for what the current block writes), then the own release steps."""
        entities = set(self.own_entities(*BLOCK_OPERATIONS)) - keep
        back = [
            self._back(entity_id, saved[entity_id])
            for entity_id in reversed(list(saved))
            if entity_id in entities and saved[entity_id] is not None
        ]
        if not back:
            return []
        return self._paced(back + self._render("release", self._values(Desired(), 0.0)))

    def _own_block_op(self, charge: bool, discharge: bool) -> str | None:
        """The own steps that block what is wanted: both directions with the
        own "block" (else the two one-way steps together), one direction with
        its own steps, else the own "block" (it blocks more than wanted,
        never less); None where the profile's levers do it."""
        if charge and discharge:
            if self.own_steps("block"):
                return "block"
            if self.own_steps("block_charge") and self.own_steps("block_discharge"):
                return "both"
            return None
        if charge or discharge:
            op = "block_charge" if charge else "block_discharge"
            if self.own_steps(op):
                return op
            return "block" if self.own_steps("block") else None
        return None

    def _own_block(
        self, hass: HomeAssistant, charge: bool, discharge: bool
    ) -> list[Write] | None:
        op = self._own_block_op(charge, discharge)
        if op is None:
            return None
        values = self._values(Desired(), self._soc(hass) or 0.0)
        if op == "both":
            return self._render("block_charge", values) + self._render(
                "block_discharge", values
            )
        return self._render(op, values)

    def _own_blocked(self, hass: HomeAssistant, direction: str) -> bool:
        """Whether own steps that block this direction are in force: every
        value they write stands (steps that only call services cannot be
        read back and count as in force)."""
        for op in (f"block_{direction}", "block"):
            if not self.own_steps(op):
                continue
            values = self._values(Desired(), self._soc(hass) or 0.0)
            writes = [w for w in self._render(op, values) if not w.is_call]
            if all(matches(hass, fit(hass, w)) for w in writes):
                return True
        return False

    def _own_back(self, saved: dict[str, Any], keep: set[str]) -> list[Write]:
        """Own steps of other operations undone before this one: their
        entities back as they were (newest first), but for what this
        operation writes itself."""
        entities = set(self.own_entities(*OPERATIONS)) - keep
        return [
            self._back(entity_id, saved[entity_id])
            for entity_id in reversed(list(saved))
            if entity_id in entities and saved[entity_id] is not None
        ]

    def _values(
        self, desired: Desired, soc: float, percent: float | None = None
    ) -> dict[str, Any]:
        """The values of the moment for the placeholders of steps."""
        power = desired.power_w or self.battery.get("max_charge_w") or DEFAULT_CHARGE_W
        span = (desired.span_s or DEFAULT_SPAN) + 3600
        return {
            "{floor}": desired.floor if desired.floor is not None else math.floor(soc),
            "{target}": desired.charge_to,
            "{power}": round(power),
            "{power_neg}": -round(power),
            "{percent}": 100 if percent is None else percent,
            "{minutes}": math.ceil(span / 60),
            "{seconds}": min(MAX_SECONDS, math.ceil(span)),
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

    def prepare_entities(self) -> list[str]:
        return [step["entity_id"] for step in self.prepare]

    def loop_owned(self) -> set[str]:
        return {self.controls[r] for r in self.profile.loop_owned if r in self.controls}

    def prepared(self, hass: HomeAssistant) -> bool:
        for step in self.prepare:
            write = Write(step["entity_id"], step.get("value"))
            if not available(hass.states.get(write.entity_id)) or matches(
                hass, fit(hass, write)
            ):
                return True
        return False

    # --- what the battery offers --------------------------------------------------

    def _has(self, *roles: str) -> bool:
        return all(role in self.controls for role in roles)

    def day_roles(self) -> set[str]:
        return day_only(self.profile)

    def charge_methods(self) -> list[str]:
        # The owner's own steps go before the profile's levers.
        result = ["own"] if self.own_steps("charge") else []
        for method in self.profile.charge:
            if (
                method == "mode"
                and self._has("mode")
                and self.options.get("force_charge")
                or method == "target"
                and self._has("grid_charge", "charge_target")
                or method == "min_soc"
                and self._has("grid_charge", "min_soc")
                or method == "switch"
                and self._has("grid_charge")
                or method == "modbus"
                and self._has(
                    "discharge_limit", "discharge_limit_enabled", "charge_limit"
                )
            ):
                result.append(method)
        return result

    # --- the day's switches and modes ---------------------------------------------

    def _toggle(self, direction: str) -> tuple[str, bool] | None:
        """The battery's own switch for one direction ("charge", "discharge")
        and the value that blocks it: "allow_…" off (Venus) or "block_…" on
        (Kostal over Modbus)."""
        if self._has(f"allow_{direction}"):
            return f"allow_{direction}", False
        if self._has(f"block_{direction}"):
            return f"block_{direction}", True
        return None

    def _day_option(self, meaning: str) -> str | None:
        """A mode option only the day uses ("no_charge", "no_discharge"), as
        discovery found it offered by the select (never assumed)."""
        return (self.battery.get("mode_options") or {}).get(meaning)

    def _mode_lever(self) -> bool:
        """Whether its mode blocks either direction and both (HomeWizard)."""
        return (
            self._has("mode")
            and bool(self._day_option("no_charge"))
            and bool(self._day_option("no_discharge"))
            and bool(self.options.get("hold"))
        )

    def _mode_blocks(self, direction: str) -> set[str]:
        """The mode options that keep the battery from charging (discharging)."""
        if not self._has("mode"):
            return set()
        own = self._day_option(f"no_{direction}")
        found = {own} if own else set()
        if self._mode_lever():
            found.add(self.options["hold"])
        return found

    def _level_lever(self) -> bool:
        """Whether its floor and charge target at its level block it by day
        (Profile.level_block)."""
        return (
            self.profile.level_block
            and self._has("min_soc", "charge_target")
            and not {"min_soc", "charge_target"} & set(self.profile.inverted)
        )

    def _soc(self, hass: HomeAssistant) -> float | None:
        """The battery's level now (%), None if unknown."""
        state = hass.states.get(self.battery.get("soc_entity") or "")
        if not available(state):
            return None
        assert state is not None
        try:
            return float(state.state)
        except ValueError:
            return None

    def _level_steps(
        self, hass: HomeAssistant, role: str
    ) -> tuple[float, float, float]:
        """The range and step of a level (Kostal: 5..100, step 1)."""
        low, high = _range(hass, self.controls[role], 0, 100)
        state = hass.states.get(self.controls[role])
        step = state.attributes.get("step") if state else None
        if not _number(step) or step <= 0:
            step = 1.0
        return low, high, float(step)

    def _level_floor(self, hass: HomeAssistant, role: str, soc: float) -> float:
        """The battery's level rounded down to the lever's step: never above
        it (fit() rounds to the nearest step, which may be above)."""
        low, high, step = self._level_steps(hass, role)
        level = low + math.floor(round((soc - low) / step, 6)) * step
        return min(level, high)

    def _level_write(
        self, hass: HomeAssistant, role: str, soc: float, saved: dict[str, Any]
    ) -> Write | None:
        """The floor (role "min_soc") or the charge target that holds the
        battery at its level, None if it cannot be set.

        The owner's own value stays where it holds the battery already (a
        floor at or above its level, a target at or below it). A value Joe
        set stays while it is at most one step below the level, so a level
        going back and forth by a tenth writes nothing; a floor above the
        level comes down at once (it would charge from the grid).
        """
        entity_id = self.controls[role]
        original = saved[entity_id] if entity_id in saved else read(hass, entity_id)
        current = read(hass, entity_id)
        if not _number(original) or not _number(current):
            return None
        low, _, step = self._level_steps(hass, role)
        target = self._level_floor(hass, role, soc)
        if role == "min_soc" and original >= target:
            return Write(entity_id, original)
        if role == "charge_target" and original <= soc:
            return Write(entity_id, original)
        if target - step - 1e-6 <= current <= soc + 1e-6:
            return Write(entity_id, current)
        if target < low:
            # Below its range: a floor would be above the level; a target
            # at its lowest lets it charge only up to there.
            return None if role == "min_soc" else Write(entity_id, low)
        return Write(entity_id, target)

    def _level_blocks(self, hass: HomeAssistant, direction: str) -> bool:
        """Whether its floor (charge target) holds it at its level now."""
        soc = self._soc(hass)
        role = "min_soc" if direction == "discharge" else "charge_target"
        value = read(hass, self.controls[role])
        if soc is None or not _number(value):
            return False
        low, _, step = self._level_steps(hass, role)
        if direction == "discharge":
            return value >= self._level_floor(hass, role, soc) - step - 1e-6
        return value <= max(soc, low) + 1e-6

    def _flash_entities(self) -> set[str]:
        """The entities whose writes end up in flash (see Profile.flash)."""
        flash = set(self.profile.flash)
        found = {self.controls[r] for r in flash if r in self.controls}
        if any(step.key in flash for step in self.profile.prepare):
            found |= set(self.prepare_entities())
        return found

    def _can_hold(self, method: str) -> bool:
        if method == "own":
            return bool(self.own_steps("hold"))
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
        return [
            method for method in ("own", *self.profile.hold) if self._can_hold(method)
        ]

    @property
    def can_charge(self) -> bool:
        return bool(self.charge_methods())

    def power_lever(self, hass: HomeAssistant) -> str | None:
        methods = self.charge_methods()
        if not methods:
            return None
        if methods[0] == "own":
            text = json.dumps(self.steps.get("charge"))
            return "power" if "{power}" in text or "{power_neg}" in text else None
        if methods[0] in ("mode", "target"):
            return "power" if self._has("charge_power") else None
        if methods[0] == "modbus":
            # The rate is the power (a share of the reference it reads itself).
            return "power"
        if methods[0] == "switch":
            return None
        return "cap" if self.night_cap_problem(hass) is None else None

    # --- the night's charging power as a ceiling (Fronius) ------------------------

    def night_cap_problem(self, hass: HomeAssistant) -> str | None:
        """Why Joe cannot set the power of grid charging through the battery's
        own charge limit, or None.

        Fronius charges from the grid up to its raised reserve as fast as it
        can; its charge limit (in % of WChaMax, SunSpec InWRte) is a ceiling.
        Only with a known reference ("limit_ref_w") for a limit in %, never
        once Joe saw it does not hold while charging from the grid.
        """
        if not self._has("charge_limit"):
            return "no_limit"
        if self.battery.get("night_cap") == "ignored":
            return "ignored"
        state = hass.states.get(self.controls["charge_limit"])
        if not available(state):
            return "unavailable"
        assert state is not None
        unit = state.attributes.get("unit_of_measurement")
        if unit in ("W", "kW"):
            return None
        if unit == "%":
            return None if self.battery.get("limit_ref_w") else "need_ref"
        return "unit"

    def night_cap(
        self, hass: HomeAssistant, watts: float, saved: dict[str, Any]
    ) -> list[Write]:
        """The charge limit as a ceiling for grid charging: the value first,
        then its switch on (Fronius ignores the limit while its switch is off).
        Never above a limit of the owner's in force before Joe."""
        entity_id = self.controls["charge_limit"]
        state = hass.states.get(entity_id)
        unit = state.attributes.get("unit_of_measurement") if state else None
        watts = max(0.0, watts)
        if unit == "kW":
            value: float = math.ceil(watts / 10) / 100
        elif unit == "%":
            value = self.percent_of(hass, watts)
        else:
            value = math.ceil(watts / 10) * 10
        own = self._own_limit(hass, saved)
        if own is not None:
            value = min(value, own)
        low, high = _range(hass, entity_id, 0, math.inf)
        writes = [Write(entity_id, max(low, min(high, value)))]
        if "charge_limit_enabled" in self.controls:
            writes.append(Write(self.controls["charge_limit_enabled"], True))
        return self._paced(writes)

    def night_cap_roles(self) -> list[str]:
        """The roles of the ceiling (its switch, its value)."""
        return [
            r for r in ("charge_limit_enabled", "charge_limit") if r in self.controls
        ]

    def night_cap_entities(self) -> list[str]:
        """The entities of the ceiling (its switch, its value)."""
        return [self.controls[r] for r in self.night_cap_roles()]

    def can_defer(self) -> bool:
        """Whether charging (from the sun too) can be held back while discharging stays free."""
        return bool(self.own_steps("cap")) or self._has("charge_limit")

    def defer(self) -> list[Write]:
        """Hold back charging for a grid-friendly morning: charge limit 0."""
        own = self._own_cap(0.0, 0.0)
        if own is not None:
            return own
        writes = []
        if "charge_limit_enabled" in self.controls:
            writes.append(Write(self.controls["charge_limit_enabled"], True))
        writes.append(Write(self.controls["charge_limit"], 0))
        return self._paced(writes)

    def _own_cap(self, watts: float, percent: float) -> list[Write] | None:
        """The owner's own steps of the daytime cap at a power ("{power}" in
        W, "{percent}" of the battery's highest charging power, or of the
        reference where one is known); None where there are none."""
        if not self.own_steps("cap"):
            return None
        values = self._values(Desired(power_w=max(watts, 1e-9)), 0.0, percent)
        values["{power}"] = round(watts)
        values["{power_neg}"] = -round(watts)
        return self._paced(self._render("cap", values))

    def _own_percent(self, watts: float) -> float:
        reference = float(
            self.battery.get("limit_ref_w") or self.battery.get("max_charge_w") or 0
        )
        if reference <= 0:
            return 100.0
        return min(100.0, math.ceil(100 * watts / reference))

    def limit_roles(self) -> tuple[str, str] | None:
        """The lever of the daytime cap: (its switch role, its value role), or None.

        The battery's own charge limit, else a limit on the integration's
        system device for all its batteries (Omnibattery's power limits, which
        work in automatic mode; manual mode would stop its own control).
        """
        if self._has("charge_limit"):
            return "charge_limit_enabled", "charge_limit"
        if self._has("system_charge_limit"):
            return "system_charge_limit_enabled", "system_charge_limit"
        return None

    def limit_entities(self) -> list[str]:
        """The entities the daytime cap writes (its switch, its value; with the
        system's shared switch also its discharge limit)."""
        if self.own_steps("cap"):
            return self.own_entities("cap")
        roles = self.limit_roles()
        result = [self.controls[r] for r in roles or () if r in self.controls]
        if self.limit_shared() and "system_discharge_limit" in self.controls:
            result.append(self.controls["system_discharge_limit"])
        return result

    def limit_key(self) -> str | None:
        """The value entity of the cap; batteries with the same one are capped together."""
        if self.own_steps("cap"):
            own = self.own_entities("cap")
            return own[0] if own else f"steps:{self.battery.get('id')}"
        roles = self.limit_roles()
        return self.controls[roles[1]] if roles else None

    def limit_shared(self) -> bool:
        """Whether the cap is for the whole system (all batteries of the integration)."""
        if self.own_steps("cap"):
            return False
        roles = self.limit_roles()
        return bool(roles) and roles[1] == "system_charge_limit"

    def limit_problem(self, hass: HomeAssistant) -> str | None:
        """Why Joe cannot cap charging at a power (daytime surplus), or None.

        A charge limit in W or kW is a power Joe can trust. One in % is a
        share of a reference the device does not tell: Fronius counts its %
        of WChaMax (SunSpec model 124), which Home Assistant does not show and
        which need not be the battery's highest charging power. A wrong
        reference would cap too low, so such a battery takes part only once
        the reference is known ("limit_ref_w", set by the owner or learned).
        A limit in A (or without a unit) never takes part.
        """
        if self.own_steps("cap"):
            # The owner's own steps: trusted as given, as long as they are there.
            for entity_id in self.own_entities("cap"):
                if not available(hass.states.get(entity_id)):
                    return "unavailable"
            return None
        roles = self.limit_roles()
        if roles is None:
            return "no_limit"
        if self.controls[roles[1]] in self._flash_entities():
            # The cap follows the sun: written too often for a flash setting.
            return "flash"
        # The battery's own levers are checked by missing(), the system's here.
        for role in (r for r in roles if r in SYSTEM_ROLES or r == roles[1]):
            if role in self.controls and not available(
                hass.states.get(self.controls[role])
            ):
                return "unavailable"
        state = hass.states.get(self.controls[roles[1]])
        assert state is not None
        unit = state.attributes.get("unit_of_measurement")
        if unit in ("W", "kW"):
            return None
        if unit == "%":
            return None if self.battery.get("limit_ref_w") else "need_ref"
        # No unit at all: not sure it is a power, so no.
        return "unit"

    def can_limit(self, hass: HomeAssistant) -> bool:
        """Whether Joe can cap charging at a power (daytime surplus)."""
        return self.limit_problem(hass) is None

    def limit(
        self,
        hass: HomeAssistant,
        kw: float,
        saved: dict[str, Any] | None = None,
        discharge_blocked: bool = False,
    ) -> list[Write]:
        """Cap charging (from the sun, too) at a power; discharging stays free,
        unless "Nacheinander" blocks it (`discharge_blocked`: the system's
        shared switch makes its discharge limit count, too, which then stays 0).

        Never above a limit that was in force before Joe (the owner's own).
        """
        watts = max(0.0, kw * 1000)
        own = self._own_cap(watts, self._own_percent(watts))
        if own is not None:
            return own
        roles = self.limit_roles()
        assert roles is not None
        switch, role = roles
        entity_id = self.controls[role]
        if 0 < watts < self.profile.limit_min_w:
            # Below its smallest power it would not take the value at all.
            watts = self.profile.limit_min_w
        unit = self._limit_unit(hass)
        if unit == "kW":
            value: float = math.ceil(watts / 10) / 100
        elif unit == "%":
            value = self.percent_of(hass, watts)
        else:
            value = math.ceil(watts / 10) * 10
        own = self._own_limit(hass, saved or {})
        if own is not None:
            value = min(value, own)
        low, high = _range(hass, entity_id, 0, math.inf)
        value = max(low, min(high, value))
        if switch not in self.controls:
            return self._paced([Write(entity_id, value)])
        if role == "system_charge_limit":
            # The value first: the system's limits take it at once when on.
            # The same switch makes its discharge limit count, too: open wide.
            writes = [Write(entity_id, value)]
            if "system_discharge_limit" in self.controls:
                writes.append(
                    Write(self.controls["system_discharge_limit"], 0)
                    if discharge_blocked
                    else self._open_wide(hass, "system_discharge_limit")
                )
            return self._paced([*writes, Write(self.controls[switch], True)])
        return self._paced(
            [Write(self.controls[switch], True), Write(entity_id, value)]
        )

    def percent_of(self, hass: HomeAssistant, watts: float) -> float:
        """A power as % of the reference, up to the limit's next step (never below)."""
        reference = float(self.battery.get("limit_ref_w") or 0)
        if reference <= 0:
            return 100.0
        percent = 100 * watts / reference
        state = hass.states.get(self.limit_key() or "")
        step = state.attributes.get("step") if state else None
        if not isinstance(step, int | float) or step <= 0:
            step = 1
        return min(100.0, math.ceil(round(percent / step, 6)) * step)

    def _own_limit(self, hass: HomeAssistant, saved: dict[str, Any]) -> float | None:
        """The charge limit in force before Joe changed it, if any (entity's unit)."""
        roles = self.limit_roles()
        if roles is None:
            return None
        entity_id = self.controls[roles[1]]
        switch = self.controls.get(roles[0])
        if switch:
            on = saved[switch] if switch in saved else read(hass, switch)
            if on is not True:
                return None
        value = saved[entity_id] if entity_id in saved else read(hass, entity_id)
        # 0 may mean "no limit" on devices without a switch: not a cap to keep.
        if isinstance(value, bool) or not isinstance(value, int | float) or value <= 0:
            return None
        return float(value)

    def unlimit(self, saved: dict[str, Any]) -> list[Write]:
        """The charge limit back as it was: its switch first, then the value.
        Own steps of the cap: what they wrote back (newest first), then the
        own release steps."""
        if self.own_steps("cap"):
            entities = set(self.own_entities("cap"))
            back = [
                self._back(entity_id, saved[entity_id])
                for entity_id in reversed(list(saved))
                if entity_id in entities and saved[entity_id] is not None
            ]
            if not back:
                return []
            return self._paced(
                back + self._render("release", self._values(Desired(), 0.0))
            )
        roles = self.limit_roles()
        if roles is None:
            return []
        extra = ("system_discharge_limit",) if self.limit_shared() else ()
        return self._paced(self._restore(saved, *roles, *extra))

    # --- several batteries one after the other ------------------------------------

    def discharge_roles(self) -> tuple[str, str] | None:
        """The limit that blocks discharging by day: (its switch role, its value role).

        The battery's own discharge limit (Fronius), else the system's discharge
        limit, which shares its switch with the system's charge limit
        (Omnibattery, in automatic mode).
        """
        if self._has("discharge_limit"):
            return "discharge_limit_enabled", "discharge_limit"
        if self._has("system_discharge_limit", "system_charge_limit_enabled"):
            return "system_charge_limit_enabled", "system_discharge_limit"
        return None

    def team_lever(self, whole_system: bool = True) -> str | None:
        """How Joe blocks this battery by day while another group works.

        "allow": its own switches that allow (or block) charging and
        discharging (Omnibattery: its PD controller stays on and goes on at
        once when they are back); "mode": its mode has an option for each
        direction and one for both (HomeWizard); "level": its floor and
        charge target at its level (Kostal over Modbus, whose block switches
        exclude each other);
        "limit": its own charge and discharge limits at 0 (Fronius, Huawei,
        VARTA); "system": the limits of the integration's system device,
        only when every battery behind them is blocked with it
        (`whole_system`). Never manual mode, never a minimum power.
        "own": the owner's own steps block both directions (one direction
        with its own steps, too, whatever the profile's lever).
        """
        if self._own_block_op(True, True):
            return "own"
        if (
            self._toggle("charge")
            and self._toggle("discharge")
            and not self.profile.exclusive
        ):
            return "allow"
        if self._mode_lever():
            return "mode"
        if self._level_lever():
            return "level"
        charge, discharge = self.limit_roles(), self.discharge_roles()
        if not charge or not discharge:
            return None
        if "system_charge_limit" in (charge[1], discharge[1]):
            return "system" if whole_system else None
        return "limit"

    def system_key(self) -> str | None:
        """The system limit shared by all batteries of the integration, if any."""
        return self.controls.get("system_charge_limit")

    def team_shared(self, whole_system: bool = True) -> bool:
        """Whether charging and discharging are blocked with one switch (the system's)."""
        if self.team_lever(whole_system) in ("own", "allow", "mode", "level"):
            return False
        charge, discharge = self.limit_roles(), self.discharge_roles()
        return bool(charge and discharge and charge[0] == discharge[0])

    def _toggle_roles(self) -> list[str]:
        return [t[0] for t in (self._toggle("charge"), self._toggle("discharge")) if t]

    def team_roles(self, whole_system: bool = True) -> list[str]:
        """The roles Joe writes to block charging or discharging by day."""
        lever = self.team_lever(whole_system)
        if lever == "allow":
            return self._toggle_roles()
        if lever == "mode":
            return ["mode"]
        if lever == "level":
            return ["min_soc", "charge_target"]
        if lever in (None, "own"):
            return []
        roles = [*(self.limit_roles() or ()), *(self.discharge_roles() or ())]
        return list(dict.fromkeys(r for r in roles if r in self.controls))

    def team_release_roles(self) -> list[str]:
        """Every role a block by day may have written (the lever may have
        changed since): given back as far as Joe noted it."""
        roles = [
            *self._toggle_roles(),
            *(("mode",) if self._mode_lever() else ()),
            *(("min_soc", "charge_target") if self._level_lever() else ()),
            *(self.limit_roles() or ()),
            *(self.discharge_roles() or ()),
        ]
        return list(dict.fromkeys(r for r in roles if r in self.controls))

    def team_entities(self, whole_system: bool = True) -> list[str]:
        """Every entity Joe writes to block charging or discharging by day
        (the own steps' entities, too)."""
        return list(
            dict.fromkeys(
                [
                    *(self.controls[r] for r in self.team_roles(whole_system)),
                    *self.own_entities(*BLOCK_OPERATIONS),
                ]
            )
        )

    def team_charge_entities(self, whole_system: bool = True) -> list[str]:
        """The entities that block charging (shared with the daytime cap when
        they are limits)."""
        own = self._own_block_op(True, False)
        if own is not None:
            return self.own_entities(own)
        lever = self.team_lever(whole_system)
        if lever == "allow":
            toggle = self._toggle("charge")
            assert toggle is not None
            return [self.controls[toggle[0]]]
        if lever == "mode":
            return [self.controls["mode"]]
        if lever == "level":
            return [self.controls["charge_target"]]
        return self.limit_entities()

    def team_problem(
        self, hass: HomeAssistant, whole_system: bool = True
    ) -> str | None:
        """Why Joe cannot block this battery's charging and discharging by day."""
        if self.team_lever(whole_system) == "own":
            for entity_id in self.own_entities(*BLOCK_OPERATIONS):
                if not available(hass.states.get(entity_id)):
                    return "unavailable"
            return None
        if self.team_lever(whole_system) is None:
            if self._has("system_charge_limit") and not self._toggle("charge"):
                # The system's limits would block batteries of other groups, too.
                return "system_shared"
            if self.profile.exclusive and self._toggle("charge"):
                # One switch on turns the other off: never both at once.
                return "exclusive"
            if self.limit_roles() is None:
                return "no_charge_lever"
            return "no_discharge_lever"
        for entity_id in self.team_entities(whole_system):
            if not available(hass.states.get(entity_id)):
                return "unavailable"
        if self.team_lever(whole_system) == "level":
            soc = self._soc(hass)
            low, _, _ = self._level_steps(hass, "min_soc")
            if soc is not None and self._level_floor(hass, "min_soc", soc) < low:
                # Its level below the lowest floor it takes: a floor would be
                # above it (it would charge from the grid), so none holds it.
                return "cannot_block"
        if self.team_lever(whole_system) == "mode":
            state = hass.states.get(self.controls["mode"])
            offered = (state.attributes.get("options") if state else None) or []
            wanted = (self._day_option("no_charge"), self._day_option("no_discharge"))
            if any(option not in offered for option in wanted):
                return "no_charge_lever"
        return None

    def team_block(
        self,
        hass: HomeAssistant,
        charge: bool,
        discharge: bool,
        charge_taken: bool,
        whole_system: bool = True,
        saved: dict[str, Any] | None = None,
    ) -> tuple[list[Write], list[str]]:
        """Writes that block charging and/or discharging, and the roles to give back.

        Switches: set to block (allow off, block on), given back as they
        were. A mode: the option for what is blocked, given back as it was.
        A limit block is the limit at 0, written before its switch goes on
        (Fronius ignores the limit while its switch is off; R2/R3 of the
        owner's automations learned it so). Giving back is the switch off
        first, then the value (see free). With the system's shared switch
        the direction that stays free is opened wide while the switch is on.
        `charge_taken`: the charge limit is someone else's now (the daytime
        cap, the grid-friendly morning, a test limit): left as it is.
        Floor and charge target (Kostal): at the battery's level, following
        it while it moves (see _level_write), given back as they were.
        The owner's own steps where they cover what is wanted (see
        _own_block_op); what they wrote before goes back through own_free.
        """
        writes: list[Write] = []
        give_back: list[str] = []
        own = self._own_block(hass, charge, discharge)
        if own is not None:
            return self._paced(own), give_back
        lever = self.team_lever(whole_system)
        if lever == "own":
            # Nothing wanted: the profile's levers of blocks before go back.
            return writes, self.team_release_roles()
        if lever == "allow":
            for blocked, direction in ((charge, "charge"), (discharge, "discharge")):
                toggle = self._toggle(direction)
                assert toggle is not None
                if blocked:
                    writes.append(Write(self.controls[toggle[0]], toggle[1]))
                else:
                    give_back.append(toggle[0])
            return self._paced(writes), give_back
        if lever == "mode":
            if charge or discharge:
                option = (
                    self.options["hold"]
                    if charge and discharge
                    else self._day_option("no_charge" if charge else "no_discharge")
                )
                writes.append(Write(self.controls["mode"], option))
            else:
                give_back.append("mode")
            return self._paced(writes), give_back
        if lever == "level":
            soc = self._soc(hass)
            for blocked, role in ((discharge, "min_soc"), (charge, "charge_target")):
                write = (
                    self._level_write(hass, role, soc, saved or {})
                    if blocked and soc is not None
                    else None
                )
                if write is not None:
                    writes.append(write)
                elif not blocked:
                    give_back.append(role)
            return self._paced(writes), give_back
        charge_roles = self.limit_roles()
        discharge_roles = self.discharge_roles()
        assert charge_roles is not None and discharge_roles is not None
        if self.team_shared(whole_system):
            switch = charge_roles[0]
            if charge or discharge:
                if not charge_taken:
                    writes.append(
                        Write(self.controls[charge_roles[1]], 0)
                        if charge
                        else self._open_wide(hass, charge_roles[1])
                    )
                writes.append(
                    Write(self.controls[discharge_roles[1]], 0)
                    if discharge
                    else self._open_wide(hass, discharge_roles[1])
                )
                writes.append(Write(self.controls[switch], True))
            elif not charge_taken:
                give_back = [switch, charge_roles[1], discharge_roles[1]]
            return self._paced(writes), give_back
        for blocked, roles, taken in (
            (charge, charge_roles, charge_taken),
            (discharge, discharge_roles, False),
        ):
            if taken:
                continue
            switch, value = roles
            if blocked:
                writes.append(Write(self.controls[value], 0))
                if switch in self.controls:
                    writes.append(Write(self.controls[switch], True))
            else:
                give_back += [r for r in (switch, value) if r in self.controls]
        return self._paced(writes), give_back

    def _blocked(self, hass: HomeAssistant, direction: str) -> bool:
        """Whether one direction is blocked right now, whoever holds the lever:
        its switch set to block, its mode on an option that blocks it, or its
        limit at 0 and in force (Fronius ignores a limit whose switch is off:
        both must be so); or the owner's own steps that block it stand."""
        if self._own_blocked(hass, direction):
            return True
        toggle = self._toggle(direction)
        if toggle and read(hass, self.controls[toggle[0]]) is toggle[1]:
            return True
        blocks = self._mode_blocks(direction)
        if blocks and read(hass, self.controls["mode"]) in blocks:
            return True
        if self._level_lever() and self._level_blocks(hass, direction):
            return True
        roles = self.limit_roles() if direction == "charge" else self.discharge_roles()
        if roles is None:
            return False
        switch, value = roles
        if switch in self.controls and read(hass, self.controls[switch]) is not True:
            return False
        return _zero(read(hass, self.controls[value]))

    def charge_blocked(self, hass: HomeAssistant) -> bool:
        """Whether charging is blocked right now, whoever holds the lever."""
        return self._blocked(hass, "charge")

    def _direction_entities(self, direction: str) -> list[str]:
        """The entities whose values block one direction (see _blocked)."""
        c = self.controls
        found = list(self.own_entities(f"block_{direction}", "block"))
        toggle = self._toggle(direction)
        if toggle:
            found.append(c[toggle[0]])
        if self._mode_blocks(direction) and "mode" in c:
            found.append(c["mode"])
        if self._level_lever():
            found += [c[r] for r in ("min_soc", "charge_target") if r in c]
        roles = self.limit_roles() if direction == "charge" else self.discharge_roles()
        if roles:
            found += [c[r] for r in roles if r in c]
        return list(dict.fromkeys(found))

    def held_back(
        self, hass: HomeAssistant, soc: float, written: set[str]
    ) -> dict[str, Any] | None:
        """A setting that is not Joe's (none of its entities written by him)
        and keeps the battery from working: its floor at or above its level
        ("reserve"), discharging blocked ("discharge") or charging blocked
        ("charge"). With the entity and the value the owner sees; None where
        nothing holds it back."""
        c = self.controls
        if "min_soc" in c and c["min_soc"] not in written:
            value = read(hass, c["min_soc"])
            if _number(value):
                level = self._level("min_soc", value)
                if level > 0 and level >= soc - 0.5:
                    return {
                        "reason": "reserve",
                        "direction": "discharge",
                        "entity_id": c["min_soc"],
                        "value": value,
                        "level": level,
                    }
        for direction in ("discharge", "charge"):
            entities = self._direction_entities(direction)
            if not entities or set(entities) & written:
                continue
            if not self._blocked(hass, direction):
                continue
            # The lever the owner sees: a switch or mode, else the limit at 0.
            shown = next(
                (e for e in entities if not e.startswith(("number.", "input_number."))),
                entities[0],
            )
            return {
                "reason": direction,
                "direction": direction,
                "entity_id": shown,
                "value": read(hass, shown),
                "level": None,
            }
        return None

    def discharge_blocked(self, hass: HomeAssistant) -> bool:
        """Whether discharging is blocked right now, whoever holds the lever."""
        return self._blocked(hass, "discharge")

    def team_free(self, saved: dict[str, Any], roles: list[str]) -> list[Write]:
        """These levers back as they were: each switch first, then its value."""
        switches = [r for r in roles if r.endswith("_enabled")]
        values = [r for r in roles if not r.endswith("_enabled")]
        return self._paced(self._restore(saved, *switches, *values))

    # --- charging along with a fixed power (control/team_day.py) -------------------

    def along_lever(self) -> bool:
        """Whether Joe can let this battery charge with a fixed power of his
        own by day (the second one while another regulates): a forced-charge
        mode with a charging power (Omnibattery's manual mode), or Fronius
        over Modbus with the reference its rate is a share of. Never a
        ceiling only: below it the battery would regulate freely."""
        methods = self.charge_methods()
        if not methods or not self.can_charge:
            return False
        if methods[0] == "mode":
            return self._has("charge_power") and bool(self.options.get("force_charge"))
        if methods[0] == "modbus":
            return float(self.battery.get("limit_ref_w") or 0) > 0
        return False

    def team_along(
        self, hass: HomeAssistant, writes: list[Write], watts: float
    ) -> list[Write]:
        """The block's writes (discharging blocked, charging free) with the
        battery charging at `watts`. Fronius over Modbus: the rate below 0
        (that share of the reference) in place of the 0 that blocks
        discharging, the charge rate open first (the inverter refuses a rate
        below 0 beyond the charge rate), grid charging not touched: it takes
        the sun. A forced-charge mode: its prepare step (a manual mode), the
        power and the mode after the block."""
        methods = self.charge_methods()
        c = self.controls
        if not methods:
            return writes
        if methods[0] == "modbus":
            limit = c.get("discharge_limit")
            return [
                Write(c["charge_limit"], 100),
                *(
                    Write(w.entity_id, -self._share(watts))
                    if w.entity_id == limit
                    else w
                    for w in writes
                ),
            ]
        if methods[0] == "mode":
            more = [
                *self._prepare("mode"),
                Write(c["charge_power"], self._power(hass, watts)),
                Write(c["mode"], self.options["force_charge"]),
            ]
            return [*writes, *self._paced(more)]
        return writes

    def team_along_exit(self, hass: HomeAssistant) -> list[Write]:
        """Charging along ends: the forced mode off, the power 0, the manual
        mode off (Fronius over Modbus: the block's 0 does it)."""
        if (self.charge_methods() or [""])[0] != "mode":
            return []
        return self._paced(self.guard_exit(hass))

    # --- the house from the battery while a car charges fast (control/house.py) ----

    def house_lever(self, hass: HomeAssistant, whole_system: bool = True) -> str | None:
        """How Joe lets this battery give a fixed power by day: "limit" its
        discharge limit at that power while it regulates below it (the
        house's need is far less than the car takes, so it gives all of it):
        in W or kW, in % only with the reference its rates are a share of
        ("limit_ref_w"; Fronius counts both rates in % of WChaMax, SunSpec
        model 124); "mode" a forced discharge with a power of its own
        (Omnibattery's manual mode). None: neither."""
        if self.team_lever(whole_system) in ("limit", "system"):
            roles = self.discharge_roles()
            unit = self._unit(hass, roles[1]) if roles else None
            if unit in ("W", "kW") or (
                unit == "%" and float(self.battery.get("limit_ref_w") or 0) > 0
            ):
                return "limit"
        if (
            self._has("mode", "discharge_power")
            and self.options.get("force_discharge")
            and (self._unit(hass, "discharge_power") or "W") in ("W", "kW")
        ):
            return "mode"
        return None

    def house_problem(
        self, hass: HomeAssistant, whole_system: bool = True
    ) -> str | None:
        """Why Joe cannot let this battery give a fixed power by day, or None:
        "need_ref" (a limit in % without its reference), "unavailable" (its
        limit cannot be read now), "no_power_lever"."""
        if self.house_lever(hass, whole_system):
            return None
        roles = self.discharge_roles()
        if self.team_lever(whole_system) in ("limit", "system") and roles:
            state = hass.states.get(self.controls[roles[1]])
            if not available(state):
                return "unavailable"
            if self._unit(hass, roles[1]) == "%":
                return "need_ref"
        return "no_power_lever"

    def team_house(
        self,
        hass: HomeAssistant,
        writes: list[Write],
        watts: float,
        whole_system: bool = True,
    ) -> list[Write]:
        """The block's writes (discharging blocked) with the battery giving
        `watts` instead: the discharge limit at that power in place of its 0
        ("limit"), or – what blocks discharging left out and allowed – the
        prepare step (a manual mode), the power and the forced discharge
        ("mode"). Never more than the house's need: in steps down."""
        lever = self.house_lever(hass, whole_system)
        c = self.controls
        if lever == "limit":
            roles = self.discharge_roles()
            assert roles is not None
            entity_id = c[roles[1]]
            value = self._house_value(hass, roles[1], watts)
            return [
                Write(w.entity_id, value) if w.entity_id == entity_id else w
                for w in writes
            ]
        if lever == "mode":
            blocking = set(self._direction_entities("discharge"))
            kept = [w for w in writes if w.entity_id not in blocking]
            toggle = self._toggle("discharge")
            if toggle:
                kept.append(Write(c[toggle[0]], not toggle[1]))
            more = [
                *self._prepare("mode"),
                Write(
                    c["discharge_power"],
                    self._house_value(hass, "discharge_power", watts),
                ),
                Write(c["mode"], self.options["force_discharge"]),
            ]
            return self._paced([*kept, *more])
        return writes

    def team_house_exit(self, hass: HomeAssistant, lever: str | None) -> list[Write]:
        """The fixed power ends: a forced discharge off, its power 0, the
        manual mode off (a limit goes back with the block's own writes)."""
        if lever != "mode":
            return []
        return self._paced(self.guard_exit(hass))

    def _unit(self, hass: HomeAssistant, role: str) -> str | None:
        state = hass.states.get(self.controls.get(role) or "")
        return state.attributes.get("unit_of_measurement") if state else None

    def _house_value(self, hass: HomeAssistant, role: str, watts: float) -> float:
        """A power (W) in the unit of the entity of `role`: % of the reference
        (down to a tenth), kW or W; never below the limit's smallest power
        but 0 (VARTA), below 0 where the limit runs so."""
        watts = max(0.0, watts)
        unit = self._unit(hass, role) or "W"
        if unit == "%":
            reference = float(self.battery.get("limit_ref_w") or 0)
            if reference <= 0:
                return 0.0
            return min(100.0, math.floor(1000 * watts / reference) / 10)
        if 0 < watts < self.profile.limit_min_w:
            watts = self.profile.limit_min_w
        low, high = _range(hass, self.controls.get(role), 0, math.inf)
        if high <= 0 < -low:
            watts = -watts
        return round(watts / 1000, 3) if unit == "kW" else round(watts)

    # --- the watchdog (control/guard.py) -----------------------------------------

    def guard_can_restart(self) -> bool:
        """Whether Joe can restart the battery's own control (stage 1)."""
        return self._has("system_manual_mode")

    def _guard_candidates(
        self, direction: str, whole_system: bool
    ) -> list[tuple[str, ...]]:
        """Every way to block one direction, in Joe's order."""
        found: list[tuple[str, ...]] = []
        toggle = self._toggle(direction)
        if toggle:
            found.append((toggle[0],))
        switch, value = f"{direction}_limit_enabled", f"{direction}_limit"
        if self._has(value):
            found.append((switch, value) if self._has(switch) else (value,))
        if whole_system and self._has(
            f"system_{direction}_limit", "system_charge_limit_enabled"
        ):
            found.append(("system_charge_limit_enabled", f"system_{direction}_limit"))
        if self._day_option(f"no_{direction}") and self._has("mode"):
            found.append(("mode",))
        return found

    def guard_block_roles(
        self, direction: str, whole_system: bool = False
    ) -> tuple[str, ...]:
        """The roles that block one direction ("charge" or "discharge") for a
        few seconds (stage 2), switch before value; empty: none.

        A battery's own switch (Venus: allow off; Kostal: block on), else its
        own limit at 0 with its switch (Fronius), else the system's limits
        when every battery behind them is blocked with it (`whole_system`),
        else a mode that blocks it. Where flash is to be spared
        (flash_gap_s), a lever that writes to it only without a gentler one.
        """
        found = self._guard_candidates(direction, whole_system)
        if self.profile.flash_gap_s:
            flash = set(self.profile.flash)
            found = [r for r in found if not flash & set(r)] or found
        return found[0] if found else ()

    def guard_can_block(self, direction: str, whole_system: bool = False) -> bool:
        """Whether the watchdog can block one direction for a few seconds:
        with the owner's own steps for it, else with the profile's levers."""
        return bool(self.own_steps(f"block_{direction}")) or bool(
            self.guard_block_roles(direction, whole_system)
        )

    def guard_flash_gap(self, direction: str, whole_system: bool = False) -> float:
        """How long (s) the watchdog waits between two blocks with these
        levers: they write to flash (0: no need to wait)."""
        if self.own_steps(f"block_{direction}"):
            return 0.0
        roles = self.guard_block_roles(direction, whole_system)
        flash = set(roles) & set(self.profile.flash)
        return self.profile.flash_gap_s if flash else 0.0

    def guard_block(
        self,
        direction: str,
        whole_system: bool = False,
        hass: HomeAssistant | None = None,
    ) -> list[Write]:
        """Writes that block one direction: the owner's own steps for it,
        else the switch set to block, the mode's option, or the limit at 0
        first and then its switch on (Fronius ignores it while off); with
        the system's shared switch the other direction opened wide."""
        if self.own_steps(f"block_{direction}"):
            soc = self._soc(hass) if hass is not None else None
            return self._render(
                f"block_{direction}", self._values(Desired(), soc or 0.0)
            )
        roles = self.guard_block_roles(direction, whole_system)
        if not roles:
            return []
        toggle = self._toggle(direction)
        if toggle and roles == (toggle[0],):
            return [Write(self.controls[roles[0]], toggle[1])]
        if roles == ("mode",):
            return [Write(self.controls["mode"], self._day_option(f"no_{direction}"))]
        switch = roles[0] if len(roles) == 2 else None
        writes = [Write(self.controls[roles[-1]], 0)]
        if switch == "system_charge_limit_enabled" and hass is not None:
            other = "charge" if direction == "discharge" else "discharge"
            if f"system_{other}_limit" in self.controls:
                writes.append(self._open_wide(hass, f"system_{other}_limit"))
        if switch:
            writes.append(Write(self.controls[switch], True))
        return writes

    def guard_manual(self) -> list[str]:
        """The manual-mode switches of this battery (the system's, its own)."""
        found = (
            [self.controls["system_manual_mode"]]
            if self._has("system_manual_mode")
            else []
        )
        return [*found, *(e for e in self.prepare_entities() if e not in found)]

    def guard_exit(self, hass: HomeAssistant) -> list[Write]:
        """End a forced charge or discharge cleanly and give the battery back
        to its own control: force mode to normal, the setpoints to 0, then
        every manual mode that is on off."""
        writes: list[Write] = []
        if self._has("mode") and self.options.get("normal"):
            writes.append(Write(self.controls["mode"], self.options["normal"]))
        for role in ("charge_power", "discharge_power"):
            if self._has(role):
                writes.append(Write(self.controls[role], 0))
        for entity_id in self.guard_manual():
            if read(hass, entity_id) is True:
                writes.append(Write(entity_id, False))
        return writes

    def _open_wide(self, hass: HomeAssistant, role: str) -> Write:
        """A limit wide open (no limit while the shared switch is on): the end
        of its range farthest from 0 (VARTA's discharge limit runs from -4000
        to 0), else the battery's highest power in the entity's unit."""
        entity_id = self.controls[role]
        state = hass.states.get(entity_id)
        attrs = state.attributes if state else {}
        ends = [
            float(attrs[k])
            for k in ("max", "min")
            if isinstance(attrs.get(k), int | float) and not isinstance(attrs[k], bool)
        ]
        if ends and max(ends, key=abs):
            # Both ends as far from 0 (a rate from -100 to 100 %): the positive
            # one, a negative rate would charge from the grid.
            return Write(entity_id, max(ends, key=lambda end: (abs(end), end)))
        key = "max_discharge_w" if "discharge" in role else "max_charge_w"
        watts = float(self.battery.get(key) or 10000)
        unit = attrs.get("unit_of_measurement")
        return Write(entity_id, watts / 1000 if unit == "kW" else watts)

    def _limit_unit(self, hass: HomeAssistant) -> str:
        state = hass.states.get(self.limit_key() or "")
        unit = state.attributes.get("unit_of_measurement") if state else None
        return unit or "W"

    def release(self, saved: dict[str, Any]) -> list[Write]:
        """Everything back, newest first; the owner's own release steps first."""
        own = (
            self._render("release", self._values(Desired(), 0.0))
            if self.own_steps("release")
            else []
        )
        return _last_wins(
            self._paced(
                own + [self._back(w.entity_id, w.value) for w in super().release(saved)]
            )
        )

    def _back(self, entity_id: str, value: Any) -> Write:
        """A value given back: a mode option the select would not take comes
        back as its normal option (see Profile.restore_as)."""
        if entity_id != self.controls.get("mode") or not isinstance(value, str):
            return Write(entity_id, value)
        return Write(
            entity_id,
            self.profile.restore_as.get(value, value),
            fallback=self.options.get("normal"),
        )

    def _paced(self, writes: list[Write]) -> list[Write]:
        """Pauses between commands for devices that need them (Modbus); after a
        prepare step Joe waits for the entities it makes available; writes to
        flash are marked (written again less often)."""
        pace = self.profile.pace
        prepared = set(self.prepare_entities())
        # Only where flash is to be spared (Omnibattery's switches are noted
        # as such, but its watchdog and "Nacheinander" keep their pace).
        flash = self._flash_entities() if self.profile.flash_gap_s else set()
        result = []
        for index, write in enumerate(writes):
            changes: dict[str, Any] = {}
            if pace:
                changes["pause"] = pace * 2 if write.entity_id in prepared else pace
            if write.entity_id in flash:
                changes["flash"] = True
            if write.entity_id in prepared and self.profile.ready_s:
                later = tuple(
                    w.entity_id
                    for w in writes[index + 1 :]
                    if not w.is_call and w.entity_id not in prepared
                )
                if later:
                    changes["ready_for"] = later
                    changes["ready_s"] = self.profile.ready_s
            result.append(replace(write, **changes) if changes else write)
        return result

    def missing(self, hass: HomeAssistant) -> list[str]:
        """What keeps Joe from steering: no way to hold, or entities gone.

        Charging is a bonus: a battery Joe can only hold still saves the cheap
        night for the expensive morning.
        """
        result = []
        if not self.hold_methods():
            result.append("hold")
        day = self.day_roles()
        for role, entity_id in self.controls.items():
            if role in day:
                # Only the day needs them (limit_problem, the watchdog say so).
                continue
            if not available(hass.states.get(entity_id)):
                result.append(role)
        # The owner's own steps of the night (the day's are the day's).
        for op in OPERATIONS:
            if op in DAY_OPERATIONS:
                continue
            for step in self.steps.get(op) or []:
                if step.get("entity_id") and hass.states.get(step["entity_id"]) is None:
                    result.append(step["entity_id"])
                elif step.get("service"):
                    domain, _, name = step["service"].partition(".")
                    if not hass.services.has_service(domain, name):
                        result.append(step["service"])
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
            result = self._lift_block(saved, desired.capped) + self._charge(
                hass, desired, soc
            )
        else:
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
                result += self._block(hass, soc, desired, saved) or []
            else:
                result += self._lift_block(saved)
                floor = self._hold_floor(desired, soc)
                if floor is not None:
                    result += self._hold(hass, floor, soc, desired, saved) or []
                else:
                    result += self._restore(saved, "min_soc")
        # Own steps of another operation undone before this one.
        back = self._own_back(saved, {w.entity_id for w in result})
        return _last_wins(back + result)

    def steer_problem(
        self,
        hass: HomeAssistant,
        desired: Desired,
        soc: float,
        saved: dict[str, Any],
    ) -> str | None:
        if desired.charge_to is not None and self.can_charge:
            return None
        if desired.block:
            return (
                "cannot_block"
                if self._block(hass, soc, desired, saved) is None
                else None
            )
        floor = self._hold_floor(desired, soc)
        if floor is None or self._hold(hass, floor, soc, desired, saved) is not None:
            return None
        return "cannot_hold"

    @staticmethod
    def _hold_floor(desired: Desired, soc: float) -> int | None:
        """The floor to hold at: the desired one, else (charging wanted, but
        it cannot charge) its level now."""
        if desired.floor is None and desired.charge_to is not None:
            return max(0, math.floor(soc))
        return desired.floor

    def _charge(
        self, hass: HomeAssistant, desired: Desired, soc: float = 0.0
    ) -> list[Write]:
        c = self.controls
        target = desired.charge_to
        assert target is not None
        for method in self.charge_methods():
            if method == "own":
                return self._render("charge", self._values(desired, soc))
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
                if "grid_charge" in c:
                    # Growatt's "Battery First" charges from the grid only so.
                    result.insert(
                        len(self._prepare(method)),
                        Write(c["grid_charge"], self._on("grid_charge")),
                    )
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
            if method == "switch":
                # No level, no power: Joe stops it at the target.
                return [*result, Write(c["grid_charge"], self._on("grid_charge"))]
            if method == "min_soc":
                return [
                    *result,
                    Write(c["grid_charge"], self._on("grid_charge")),
                    Write(c["min_soc"], self._level("min_soc", target)),
                ]
            if method == "modbus":
                # Fronius over Modbus: the discharge rate below 0 charges from
                # the grid with that share of WChaMax once its bit is set
                # (the only way to charge with a power of one's own); charging
                # allowed in full, grid charging on. The reserve stays the
                # owner's: Joe stops at the target himself (the inverter
                # charges on until its battery says full, whatever the
                # reserve says).
                return [
                    *result,
                    *(
                        [Write(c["grid_charge"], self._on("grid_charge"))]
                        if "grid_charge" in c
                        else []
                    ),
                    Write(c["charge_limit"], 100),
                    Write(c["discharge_limit"], -self._share(desired.power_w)),
                    Write(c["discharge_limit_enabled"], True),
                ]
        return []

    def fixed_charge_w(self) -> float | None:
        """The power the device charges with on its own when Joe can only
        raise its reserve (Fronius: ~500 W), None where Joe sets the power."""
        methods = self.charge_methods()
        if methods and methods[0] == "min_soc" and self.profile.reserve_charge_w:
            return self.profile.reserve_charge_w
        return None

    def _share(self, power_w: float | None) -> float:
        """A charging power as a share of the reference (WChaMax, "limit_ref_w")
        in percent, 0.5 to 100; without a reference the full rate."""
        reference = float(self.battery.get("limit_ref_w") or 0)
        if reference <= 0 or not power_w:
            return 100.0
        return min(100.0, max(0.5, round(100 * float(power_w) / reference, 1)))

    def _hold(
        self,
        hass: HomeAssistant,
        floor: int,
        soc: float,
        desired: Desired,
        saved: dict[str, Any],
    ) -> list[Write] | None:
        """Writes that hold the battery at a floor; None: no method of its
        profile can right now."""
        for method in self.hold_methods():
            if method == "own":
                values = self._values(desired, soc)
                values["{floor}"] = floor
                return self._render("hold", values)
            if method == "min_soc":
                _, high = self._level_range(hass, "min_soc", 0, 100)
                if floor > high and soc <= floor + 0.5:
                    continue
                # Above its range: discharge allowed down to its highest
                # floor for now, Joe watches the level.
                write = self._floor_write(hass, min(floor, high), soc, saved)
                if write is None:
                    continue
                return [write]
            return self._prepare(method) + self._still(hass, method, desired)
        return None

    def _block(
        self,
        hass: HomeAssistant,
        soc: float,
        desired: Desired,
        saved: dict[str, Any],
    ) -> list[Write] | None:
        """Writes that keep the battery still at night: charging and
        discharging blocked as by day ("Warten", see team_block), so that no
        battery charges another one through the house in either direction.
        Where the day's lever is not there (or not available right now) the
        battery is at least kept from discharging: the owner's own one-way
        steps, its discharge switch, else as its profile prefers. None: no
        method can right now."""
        c = self.controls
        whole = desired.whole_system
        if self.waits_as_by_day(hass, whole):
            writes, _ = self.team_block(hass, True, True, False, whole, saved)
            if writes:
                return writes
        for op in ("block_discharge", "block"):
            if self.own_steps(op):
                values = self._values(desired, soc)
                values["{floor}"] = math.floor(soc)
                return self._render(op, values)
        toggle = self._toggle("discharge")
        if toggle and available(hass.states.get(c[toggle[0]])):
            # Frozen without manual mode: its own control goes on at once after.
            return [Write(c[toggle[0]], toggle[1])]
        for method in self.profile.block:
            if method == "min_soc":
                if "min_soc" not in c:
                    continue
                _, high = self._level_range(hass, "min_soc", 0, 100)
                if math.floor(soc) > high:
                    # Its highest floor would let it discharge.
                    continue
                write = self._floor_write(hass, soc, soc, saved)
                if write is None:
                    continue
                return [write]
            if self._can_hold(method):
                return self._prepare(method) + self._still(hass, method, desired)
        return None

    def waits_as_by_day(self, hass: HomeAssistant, whole_system: bool = True) -> bool:
        """Whether the battery waits at night as by day: the day's lever that
        blocks both directions is there and available (then the night's
        "hold" is the day's "block", one operation for the owner)."""
        return (
            self.team_lever(whole_system) is not None
            and self.team_problem(hass, whole_system) is None
        )

    def own_hold_first(self) -> bool:
        """Whether the owner's own steps for the night's hold go before the
        day's block: they exist, and no own steps block both directions (the
        owner said how a battery at its level is held)."""
        return bool(self.own_steps("hold")) and self._own_block_op(True, True) is None

    def _floor_step(self, hass: HomeAssistant, level: float) -> float | None:
        """A level as the floor entity takes it, on its step and never above
        the level (fit() rounds to the nearest step, which may be above);
        None below its range (its lowest floor would be above the level)."""
        low, high, step = self._level_steps(hass, "min_soc")
        if "min_soc" in self.profile.inverted:
            # Depth of discharge: the entity runs the other way.
            value = low + math.ceil(round((100 - level - low) / step, 6)) * step
            return None if value > high + 1e-6 else max(value, low)
        value = low + math.floor(round((level - low) / step, 6)) * step
        return None if value < low - 1e-6 else min(value, high)

    def _floor_write(
        self, hass: HomeAssistant, floor: float, soc: float, saved: dict[str, Any]
    ) -> Write | None:
        """The floor (min_soc) that holds the battery at `floor` (at least its
        lowest floor), never above its level: a floor above it would charge
        it from the grid (Victron & Co.). None: its level is below the lowest
        floor the entity takes.

        The owner's own floor stays where it holds the battery already (Joe
        never holds it below that). A floor Joe set stays while it is at most
        one step below, so a level going back and forth writes nothing (some
        write it to flash).
        """
        entity_id = self.controls["min_soc"]
        low, _ = self._level_range(hass, "min_soc", 0, 100)
        level = min(max(floor, low), soc)
        value = self._floor_step(hass, level)
        if value is None:
            return None
        wanted = self._level("min_soc", value)
        original = saved[entity_id] if entity_id in saved else read(hass, entity_id)
        if _number(original) and self._level("min_soc", original) >= wanted - 1e-6:
            return Write(entity_id, original)
        current = read(hass, entity_id)
        _, _, step = self._level_steps(hass, "min_soc")
        if (
            entity_id in saved
            and _number(current)
            and wanted - step - 1e-6 <= self._level("min_soc", current) <= level + 1e-6
        ):
            return Write(entity_id, current)
        return Write(entity_id, value)

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

    def _lift_block(self, saved: dict[str, Any], capped: bool = False) -> list[Write]:
        """Every lever a block may have written back as it was: each limit's
        switch off first, then its value; the allow (or block) switches, the
        mode, the floor and charge target of a level block. With `capped` the
        charge limit stays: the night's ceiling holds it (night_cap)."""
        roles = [
            *self.team_release_roles(),
            "discharge_limit_enabled",
            "discharge_limit",
            "allow_discharge",
            "block_discharge",
        ]
        if capped:
            roles = [r for r in roles if r not in self.night_cap_roles()]
        return self.team_free(saved, list(dict.fromkeys(roles)))

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
                result.append(self._back(entity_id, saved[entity_id]))
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
        low, _ = _range(hass, entity_id, 0, 0)
        if self.profile.charge_negative and low < 0:
            # Its setpoint charges below 0 (Zendure's manual power).
            watts = -watts
        if unit == "kW":
            return watts / 1000
        if unit == "%":
            return min(100.0, 100 * watts / maximum_w)
        if unit == "A":
            _, high = _range(hass, entity_id, 0, 50)
            return high * min(1.0, watts / maximum_w)
        return watts


class StepsAdapter(RoleAdapter):
    """Batteries steered with steps: entity values or service calls.

    The user assigns steps in the panel for odd devices; profiles of
    integrations steered by services bring their own (resolved by discovery).
    Values may be "{floor}", "{target}", "{power}", "{power_neg}" (the power
    below 0, for setpoints that charge below 0), "{minutes}", "{seconds}"
    (the window and an hour, at most a day) or "{device}".

    The night runs on the steps alone; levers of the profile only the day
    uses (day_roles, e.g. Huawei's power limits) work as for other batteries.
    """

    def __init__(self, battery: dict[str, Any], profile: Profile = GENERIC) -> None:
        super().__init__(battery, profile)
        self.kind = battery.get("adapter") or "steps"
        self.prepare = []

    def prepare_entities(self) -> list[str]:
        return []

    def loop_owned(self) -> set[str]:
        return set()

    def prepared(self, hass: HomeAssistant) -> bool:
        return False

    def hold_methods(self) -> list[str]:
        return ["steps"] if self.steps.get("hold") else []

    def charge_methods(self) -> list[str]:
        return ["steps"] if self.steps.get("charge") else []

    @property
    def can_charge(self) -> bool:
        return bool(self.steps.get("charge"))

    def steer_problem(
        self,
        hass: HomeAssistant,
        desired: Desired,
        soc: float,
        saved: dict[str, Any],
    ) -> str | None:
        # Its hold steps always apply (missing() says when there are none).
        return None

    def power_lever(self, hass: HomeAssistant) -> str | None:
        """Steps that take "{power}" set it."""
        text = json.dumps(self.steps.get("charge"))
        return "power" if "{power}" in text or "{power_neg}" in text else None

    def missing(self, hass: HomeAssistant) -> list[str]:
        result = [] if self.steps.get("hold") else ["hold"]
        for name, steps in self.steps.items():
            if name in DAY_OPERATIONS:
                # Only the day needs them (team_problem, limit_problem say so).
                continue
            for step in steps:
                if step.get("entity_id") and hass.states.get(step["entity_id"]) is None:
                    result.append(step["entity_id"])
                elif step.get("service"):
                    domain, _, name = step["service"].partition(".")
                    if not hass.services.has_service(domain, name):
                        result.append(step["service"])
        return result

    def waits_as_by_day(self, hass: HomeAssistant, whole_system: bool = True) -> bool:
        # Its steps say how it holds at night; the day's levers stay the day's.
        return False

    def writes(
        self,
        hass: HomeAssistant,
        desired: Desired,
        soc: float,
        saved: dict[str, Any],
    ) -> list[Write]:
        values = self._values(desired, soc)
        if desired.charge_to is not None and self.can_charge:
            return self._paced(self._render("charge", values))
        if desired.block or desired.floor is not None or desired.charge_to is not None:
            if desired.block or desired.floor is None:
                values["{floor}"] = math.floor(soc)
            return self._paced(self._render("hold", values))
        return self.release(saved)


def _number(value: Any) -> bool:
    return isinstance(value, int | float) and not isinstance(value, bool)


def _zero(level: Any) -> bool:
    """Whether a limit's value is 0 (a block); -1 often means no limit."""
    return (
        isinstance(level, int | float)
        and not isinstance(level, bool)
        and abs(level) < 1e-3
    )


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
        return StepsAdapter(battery, profile)
    return RoleAdapter(battery, profile)


def profile_name(adapter: str) -> str | None:
    """A readable name for a profile key."""
    profile = PROFILES.get(adapter)
    return profile.name if profile else None
