"""What Joe does to a battery, as operations the owner can look at.

The panel's dialog "Regler für <Speicher>" used to show one entity per role
and a word for each. What Joe really writes are sequences over several
entities (Fronius blocked: charge limit 0, its switch on, discharge limit 0,
its switch on; back: the switches off first, then the values). This module
shows these sequences per operation ("Vorgang"), from exactly the adapter
code the executor runs (control/adapters.py), without writing anything:

- charge: from the grid to {target} % with {power} W (prepare steps first)
- hold: the level held at {floor} % (the level now, rounded down)
- block, block_charge, block_discharge: by day ("Nacheinander")
- cap: the daytime cap, the charge limit at {percent} % of the battery's
  highest charging power
- release: everything back (switch before value, newest first)
- guard_charge, guard_discharge: only where the watchdog's block for a few
  seconds writes something else than block_charge / block_discharge

Each operation says whether it is possible now and why not (codes the
panel explains: no_lever, no_charge, no_steps, unavailable, soc_unknown,
not_controllable, shared_switch; the adapters' finer codes pass through),
where its steps come from ("profile", "generic", "own", "service", "none"),
the writes in their order with the entities' values now and, where a value
stands for one of the moment's parameters, that parameter ("param", so the
panel can turn the steps into own ones with placeholders), and what "back"
writes afterwards ("saved": the original noted before). The executor's probe
(JoeExecutor.async_probe) writes the same steps once, reads them back and
puts everything back.

The roles of a battery come with what its profile finds in Home Assistant
today ("found"), so the panel can show where the saved levers differ.
"""

from __future__ import annotations

from dataclasses import dataclass, field
import math
from typing import Any

from homeassistant.core import HomeAssistant

from ..observe.readings import number
from .adapters import (
    DEFAULT_CHARGE_W,
    Adapter,
    Desired,
    RoleAdapter,
    StepsAdapter,
    make_adapter,
)
from .guard import BLOCK_S
from .profiles import (
    BLOCK_OPERATIONS,
    GENERIC,
    OPERATIONS,
    PROFILES,
    ROLES,
    Call,
)
from .writes import Write, fit, matches

GUARD_OPERATIONS = ("guard_charge", "guard_discharge")
# The example of the daytime cap: this share of the highest charging power.
CAP_PERCENT = 50
# The night's target where no plan says: this much above the level now.
TARGET_STEP = 20
# The levers every battery is looked at for, profile or not.
BASE_ROLES = (
    "min_soc",
    "grid_charge",
    "charge_target",
    "mode",
    "charge_power",
    "discharge_power",
    "charge_limit",
    "charge_limit_enabled",
    "discharge_limit",
    "discharge_limit_enabled",
)
# What kind of value a role takes: a level (%), a setpoint or limit (a
# power), a switch, or an option of a select.
ROLE_KINDS: dict[str, str] = {
    "min_soc": "level",
    "charge_target": "level",
    "mode": "option",
    "grid_charge": "toggle",
    "charge_limit_enabled": "toggle",
    "discharge_limit_enabled": "toggle",
    "system_charge_limit_enabled": "toggle",
    "system_manual_mode": "toggle",
    "allow_charge": "toggle",
    "allow_discharge": "toggle",
    "block_charge": "toggle",
    "block_discharge": "toggle",
}
# The adapters' codes in the words the panel knows.
WHY_ALIASES = {
    "system_shared": "shared_switch",
    "controls_missing": "unavailable",
    "no_charge_lever": "no_lever",
    "no_discharge_lever": "no_lever",
    "no_limit": "no_lever",
}
# Why an operation is not possible, when nothing at all defines it (the
# source is "none" then); every other code is a matter of the moment
# (unavailable, soc_unknown, need_ref, unit, flash, cannot_hold,
# cannot_block).
NOTHING_DEFINES = (
    "not_controllable",
    "no_charge",
    "no_lever",
    "no_steps",
    "shared_switch",
    "exclusive",
)
# The placeholders of steps and the parameter each stands for.
PLACEHOLDERS = {
    "{target}": "target",
    "{power}": "power",
    "{power_neg}": "power_neg",
    "{floor}": "floor",
    "{percent}": "percent",
    "{minutes}": "minutes",
    "{seconds}": "seconds",
    "{device}": "device",
}
# Which parameter a profile's lever may stand for, per operation and role
# (it does when the value written equals what the placeholder would give).
ROLE_PARAMS: dict[str, dict[str, tuple[str, ...]]] = {
    "charge": {
        "min_soc": ("target",),
        "charge_target": ("target",),
        "charge_power": ("power", "power_neg"),
        "charge_limit": ("power",),
        "command_timeout": ("seconds", "minutes"),
    },
    "hold": {"min_soc": ("floor",), "charge_target": ("floor",)},
    "block": {"min_soc": ("floor",), "charge_target": ("floor",)},
    "cap": {
        "charge_limit": ("percent", "power"),
        "system_charge_limit": ("percent", "power"),
    },
}


@dataclass(slots=True)
class Params:
    """The values of the moment the operations are shown with."""

    soc: float | None
    target: int
    power_w: float
    floor: int
    cap_w: float
    percent: float = CAP_PERCENT
    seconds: float = BLOCK_S
    whole_system: bool = True
    # Where the power comes from: the plan, the battery's highest power, or
    # the device itself (it charges with that whatever Joe writes).
    power_by: str = "plan"

    def as_dict(self) -> dict[str, Any]:
        return {
            "target": self.target,
            "power_w": round(self.power_w),
            "power_by": self.power_by,
            "floor": self.floor,
            "percent": self.percent,
            "seconds": self.seconds,
        }


@dataclass(slots=True)
class Operation:
    """One operation as it would run now."""

    op: str
    possible: bool
    why: str | None
    source: str
    # The writes in their order (fitted to the entities' ranges and steps).
    writes: list[Write] = field(default_factory=list)
    # What "back" writes afterwards, in its order; the value is the noted
    # original (or "saved" where it is not noted yet).
    restore: list[Write] = field(default_factory=list)
    # Per entity written: the parameter its value stands for.
    params_of: dict[str, str] = field(default_factory=dict)
    note: str | None = None
    # The operation this one is for the owner ("hold" is "block" where the
    # battery waits at night as by day): the panel shows one row.
    same_as: str | None = None


def params_for(
    hass: HomeAssistant,
    battery: dict[str, Any],
    target: float | None = None,
    power_w: float | None = None,
    whole_system: bool = True,
) -> Params:
    """The values of the moment: the plan's target and power where given,
    else a step above the level now and the battery's highest power; where
    the device sets the power itself (Fronius raising its reserve: ~500 W)
    that power, `power_by` "device"."""
    soc = number(hass.states.get(battery["soc_entity"]))
    level = 0.0 if soc is None else soc
    power = float(power_w or battery.get("max_charge_w") or DEFAULT_CHARGE_W)
    power_by = "plan" if power_w else "max"
    adapter = make_adapter(battery)
    fixed = adapter.fixed_charge_w() if isinstance(adapter, RoleAdapter) else None
    if fixed:
        power, power_by = min(power, fixed), "device"
    return Params(
        soc=soc,
        target=int(min(100, math.ceil(level) + TARGET_STEP))
        if target is None
        else int(target),
        power_w=power,
        power_by=power_by,
        floor=max(0, math.floor(level)),
        cap_w=float(battery.get("max_charge_w") or power) * CAP_PERCENT / 100,
        whole_system=whole_system,
    )


def operations(
    hass: HomeAssistant,
    adapter: Adapter | None,
    params: Params,
    saved: dict[str, Any] | None = None,
) -> list[Operation]:
    """Every operation in the panel's order (charge, hold, block,
    block_charge, block_discharge, cap, release), then the watchdog's blocks
    where they differ from the day's. `saved`: the originals Joe noted (a
    value he wrote himself is not the owner's)."""
    if not isinstance(adapter, RoleAdapter):
        return [Operation(op, False, "not_controllable", "none") for op in OPERATIONS]
    found = [
        operation(hass, adapter, op, params, saved)
        for op in OPERATIONS
        if op != "release"
    ]
    written = [
        w.entity_id
        for item in found
        for w in _changing(hass, item.writes, saved or {})
        if not w.is_call
    ]
    found.append(operation(hass, adapter, "release", params, saved, written))
    by_op = {item.op: item for item in found}
    for direction in ("charge", "discharge"):
        guard = operation(hass, adapter, f"guard_{direction}", params, saved)
        block = by_op[f"block_{direction}"]
        if guard.possible and (
            not block.possible or _signature(guard.writes) != _signature(block.writes)
        ):
            found.append(guard)
    return found


def operation(
    hass: HomeAssistant,
    adapter: RoleAdapter,
    op: str,
    params: Params,
    saved: dict[str, Any] | None = None,
    written: list[str] | None = None,
) -> Operation:
    """One operation as it would run now. `saved`: the originals Joe noted
    (what the operation writes and puts back is worked out as in the night:
    a value Joe wrote himself is not the owner's); `written`: for "release",
    the entities the other operations write."""
    source = source_of(adapter, op)
    result = Operation(op, True, None, source)
    saved = saved or {}
    soc = params.soc
    writes: list[Write] = []
    if op in ("charge", "hold"):
        if isinstance(adapter, StepsAdapter) and not adapter.steps.get(op):
            return _impossible(result, "no_steps")
        missing = adapter.missing(hass)
        if op == "charge" and not adapter.can_charge:
            return _impossible(result, "no_charge")
        if missing:
            return _impossible(
                result, "no_lever" if "hold" in missing else "controls_missing"
            )
        if soc is None:
            return _impossible(result, "soc_unknown")
        # At night a battery at its level waits as by day (adapters._block),
        # unless the owner's own steps say how it holds.
        desired = (
            Desired(charge_to=params.target, power_w=params.power_w)
            if op == "charge"
            else Desired(
                floor=params.floor,
                block=not adapter.own_hold_first(),
                whole_system=params.whole_system,
            )
        )
        problem = adapter.steer_problem(hass, desired, soc, saved)
        if problem:
            return _impossible(result, problem)
        writes = adapter.writes(hass, desired, soc, saved)
        if (
            op == "charge"
            and adapter.power_lever(hass) == "cap"
            and adapter.night_cap_problem(hass) is None
        ):
            # The ceiling of the power goes first (see executor._async_night_cap).
            writes = adapter.night_cap(hass, round(params.power_w), saved) + writes
        if (
            op == "hold"
            and source != "own"
            and adapter.waits_as_by_day(hass, params.whole_system)
        ):
            result.same_as = "block"
    elif op in BLOCK_OPERATIONS:
        charge, discharge = op != "block_discharge", op != "block_charge"
        own = adapter._own_block(hass, charge, discharge)
        if own is None:
            problem = adapter.team_problem(hass, params.whole_system)
            if problem:
                return _impossible(result, problem)
            if soc is None and adapter.team_lever(params.whole_system) == "level":
                return _impossible(result, "soc_unknown")
        writes, _ = adapter.team_block(
            hass, charge, discharge, False, params.whole_system, saved
        )
        if not writes:
            return _impossible(result, "no_lever")
    elif op in GUARD_OPERATIONS:
        direction = op.removeprefix("guard_")
        if not adapter.guard_can_block(direction, params.whole_system):
            return _impossible(result, "no_lever")
        writes = adapter.guard_block(direction, params.whole_system, hass)
        if not writes:
            return _impossible(result, "no_lever")
        for write in writes:
            if not write.is_call and not _available(hass, write.entity_id):
                return _impossible(result, "unavailable")
    elif op == "cap":
        problem = adapter.limit_problem(hass)
        if problem:
            return _impossible(result, problem)
        writes = adapter.limit(hass, params.cap_w / 1000, saved, False)
    elif op == "release":
        writes = (
            adapter._render("release", adapter._values(Desired(), 0.0))
            if adapter.own_steps("release")
            else []
        )
    else:
        raise ValueError(f"unknown operation: {op}")
    result.writes = [fit(hass, w) for w in writes]
    # A value that stands so already is not written, so nothing of it goes
    # back – unless Joe noted its original (he set it himself before).
    result.restore = restore_writes(
        adapter, op, _changing(hass, result.writes, saved), saved, written
    )
    result.params_of = _param_map(adapter, op, result.writes, params)
    result.note = _note(adapter, result.writes)
    return result


def restore_writes(
    adapter: RoleAdapter,
    op: str,
    writes: list[Write],
    saved: dict[str, Any],
    written: list[str] | None = None,
    calls: bool = False,
) -> list[Write]:
    """What "back" writes after an operation, in its order: the adapters'
    own ways (the release newest first, a block's switches before its
    values, the cap's switch first), with the originals in `saved` ("saved"
    where none is noted yet). Service calls (the release's own steps) only
    with `calls` (the probe makes them; the preview shows them as the
    release's steps)."""
    if op == "release":
        entities = [e for e in (written or []) if e in adapter.entities()]
    else:
        entities = [w.entity_id for w in writes if not w.is_call]
    originals = {e: saved.get(e, "saved") for e in dict.fromkeys(entities)}
    if not originals:
        return []
    own = source_of(adapter, op) == "own"
    if op in GUARD_OPERATIONS or (own and op != "release"):
        # Held newest first (executor._async_guard_restore, own_free).
        back = [Write(e, originals[e]) for e in reversed(list(originals))]
    elif op in BLOCK_OPERATIONS:
        roles = [r for e in originals for r in _roles_of(adapter, e)]
        back = adapter.team_free(originals, list(dict.fromkeys(roles)))
    elif op == "cap":
        back = adapter.unlimit(originals)
    else:
        back = adapter.release(originals)
    return back if calls else [w for w in back if not w.is_call]


def source_of(adapter: RoleAdapter, op: str) -> str:
    """Where an operation's steps come from: the profile's levers, levers
    the user assigned ("generic"), the user's own steps, or a profile's
    service steps (Huawei) as discovery stored them – own once the user
    changed them."""
    profile = adapter.profile
    keys = _own_keys(adapter, op)
    if profile.steps:
        if not keys:
            return "profile"
        return "service" if all(_profile_steps(adapter, key) for key in keys) else "own"
    if keys:
        return "own"
    return "generic" if profile is GENERIC else "profile"


def preview(
    hass: HomeAssistant,
    battery: dict[str, Any],
    found: dict[str, str] | None = None,
    *,
    target: float | None = None,
    power_w: float | None = None,
    whole_system: bool = True,
    saved: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """The preview the panel shows (see the module doc): the profile, the
    operations with their steps and what goes back, the roles with what the
    profile finds today (`found`) and whether the saved levers differ.
    `saved`: the originals Joe noted (executor.data["saved"])."""
    adapter = make_adapter(battery)
    profile = PROFILES.get(battery.get("adapter") or "")
    params = params_for(hass, battery, target, power_w, whole_system)
    found = found or {}
    items = operations(hass, adapter, params, saved)
    roles = roles_view(hass, adapter, battery, found, items)
    return {
        "profile": {"key": profile.key, "name": profile.name} if profile else None,
        "deviates": any(role["deviates"] for role in roles),
        "params": params.as_dict(),
        "operations": [operation_view(hass, adapter, item, params) for item in items],
        "roles": roles,
    }


def operation_view(
    hass: HomeAssistant, adapter: Adapter | None, item: Operation, params: Params
) -> dict[str, Any]:
    """One operation as the panel shows it."""
    return {
        "op": item.op,
        "possible": item.possible,
        "why": item.why,
        "source": item.source,
        "params": params.as_dict(),
        "steps": [
            step_view(hass, adapter, w, item.params_of.get(w.entity_id))
            for w in item.writes
        ],
        "restore": [restore_view(hass, adapter, w) for w in item.restore],
        "note": item.note,
        "same_as": item.same_as,
    }


def step_view(
    hass: HomeAssistant,
    adapter: Adapter | None,
    write: Write,
    param: str | None = None,
) -> dict[str, Any]:
    """A write as the panel shows it, with the entity's value now and the
    parameter the value stands for (see _param_map)."""
    if write.is_call:
        return {
            "kind": "call",
            "service": write.entity_id.removeprefix("service:"),
            "data": write.value,
        }
    state = hass.states.get(write.entity_id)
    return {
        "kind": "set",
        "role": _role_of(adapter, write.entity_id),
        "entity_id": write.entity_id,
        "name": state.name if state else write.entity_id,
        "value": write.value,
        "param": param,
        "unit": state.attributes.get("unit_of_measurement") if state else None,
        "current": state.state if state else None,
        # The value stands so already: nothing changes ("bleibt bei").
        "keep": bool(state) and matches(hass, write),
    }


def restore_view(hass: HomeAssistant, adapter: Adapter | None, write: Write) -> dict:
    state = hass.states.get(write.entity_id)
    return {
        "role": _role_of(adapter, write.entity_id),
        "entity_id": write.entity_id,
        "name": state.name if state else write.entity_id,
        "value": write.value,
        "current": state.state if state else None,
    }


def roles_view(
    hass: HomeAssistant,
    adapter: Adapter | None,
    battery: dict[str, Any],
    found: dict[str, str],
    items: list[Operation],
) -> list[dict[str, Any]]:
    """Every role the profile knows, every one assigned and the generic
    levers: the entity assigned, the one the profile finds today, what kind
    of value it takes, which operations write it, and whether it differs
    (assigned to another entity than found, found but not assigned, or a
    role the profile does not know on an entity it finds under another)."""
    profile = PROFILES.get(battery.get("adapter") or "")
    known: set[str] = set()
    if profile:
        for roles in (
            profile.roles,
            profile.entry_roles,
            profile.guard_roles,
            profile.day_roles,
        ):
            known |= set(roles)
    controls: dict[str, str] = battery.get("controls") or {}
    used: dict[str, list[str]] = {}
    for item in items:
        if item.same_as:
            # One row for the owner: the operation it stands for counts.
            continue
        for write in item.writes:
            if write.is_call:
                continue
            for role in _roles_of(adapter, write.entity_id):
                ops = used.setdefault(role, [])
                if item.op not in ops:
                    ops.append(item.op)
    taken = set(found.values())
    result = []
    for role in ROLES:
        if role not in known and role not in controls and role not in BASE_ROLES:
            continue
        entity_id = controls.get(role)
        here = found.get(role)
        state = hass.states.get(entity_id or here or "")
        deviates = (
            entity_id != here
            if here is not None
            else entity_id is not None and entity_id in taken
        )
        result.append(
            {
                "role": role,
                "entity_id": entity_id,
                "found": here,
                "kind": ROLE_KINDS.get(role, "setpoint"),
                "unit": state.attributes.get("unit_of_measurement") if state else None,
                "used_by": used.get(role, []),
                "deviates": deviates,
                "relevant": bool(used.get(role)) or entity_id is not None,
            }
        )
    return result


def _impossible(result: Operation, why: str) -> Operation:
    result.possible = False
    result.why = WHY_ALIASES.get(why, why)
    if result.why in NOTHING_DEFINES:
        result.source = "none"
    return result


def _own_keys(adapter: RoleAdapter, op: str) -> list[str]:
    """The keys of battery.steps an operation runs on (empty: the profile's levers)."""
    if op in GUARD_OPERATIONS:
        key = f"block_{op.removeprefix('guard_')}"
        return [key] if adapter.own_steps(key) else []
    if op in BLOCK_OPERATIONS:
        charge, discharge = op != "block_discharge", op != "block_charge"
        key = adapter._own_block_op(charge, discharge)
        if key is None:
            return []
        return ["block_charge", "block_discharge"] if key == "both" else [key]
    return [op] if adapter.own_steps(op) else []


def _profile_steps(adapter: RoleAdapter, key: str) -> bool:
    """Whether the stored steps are the profile's (as discovery resolved
    them), not the user's: the same calls with the same data, the same
    values in the same order."""
    items = adapter.profile.steps.get(key)
    stored = adapter.steps.get(key)
    if items is None or stored is None or len(items) != len(stored):
        return False
    for item, step in zip(items, stored, strict=True):
        if isinstance(item, Call):
            if step.get("service") != item.service or (step.get("data") or {}) != dict(
                item.data
            ):
                return False
        elif step.get("service"):
            # A button pressed with its service (see discovery._step_of).
            if item.value is not None or not str(step["service"]).endswith(".press"):
                return False
        elif step.get("value") != item.value:
            return False
    return True


def _param_map(
    adapter: RoleAdapter, op: str, writes: list[Write], params: Params
) -> dict[str, str]:
    """Per entity written: the parameter its value stands for. Own steps say
    it with their placeholder; a profile's lever stands for one when its
    value is what the placeholder would give (a power in W, never a
    converted one)."""
    result: dict[str, str] = {}
    for key in _own_keys(adapter, op):
        for step in adapter.steps.get(key) or []:
            value = step.get("value")
            if (
                step.get("entity_id")
                and isinstance(value, str)
                and value in PLACEHOLDERS
            ):
                result[step["entity_id"]] = PLACEHOLDERS[value]
    table = ROLE_PARAMS.get("block" if op in BLOCK_OPERATIONS else op)
    if not table:
        return result
    rendered = _rendered(adapter, op, params)
    for write in writes:
        if write.is_call or write.entity_id in result:
            continue
        for role in _roles_of(adapter, write.entity_id):
            for param in table.get(role, ()):
                if _same(write.value, rendered.get(param)):
                    result[write.entity_id] = param
                    break
            if write.entity_id in result:
                break
    return result


def _rendered(adapter: RoleAdapter, op: str, params: Params) -> dict[str, Any]:
    """What each placeholder would give for an operation now."""
    soc = params.soc or 0.0
    if op == "charge":
        values = adapter._values(
            Desired(charge_to=params.target, power_w=params.power_w), soc
        )
    elif op == "hold":
        values = adapter._values(Desired(floor=params.floor), soc)
    elif op == "cap":
        values = adapter._values(Desired(power_w=params.cap_w), soc, params.percent)
        values["{power}"] = round(params.cap_w)
        values["{power_neg}"] = -round(params.cap_w)
    else:
        values = adapter._values(Desired(), soc)
    return {PLACEHOLDERS[key]: value for key, value in values.items()}


def _same(value: Any, other: Any) -> bool:
    if other is None or isinstance(value, bool) or isinstance(other, bool):
        return False
    if isinstance(value, int | float) and isinstance(other, int | float):
        return math.isclose(float(value), float(other), abs_tol=1e-6)
    return value == other


def _note(adapter: RoleAdapter, writes: list[Write]) -> str | None:
    """What is special about the order: a prepare step first (manual mode),
    values that end up in flash to be spared, a limit written before the
    switch that makes it count (Fronius), or a switch before its value."""
    entities = [w.entity_id for w in writes if not w.is_call]
    if set(entities) & set(adapter.prepare_entities()):
        return "prepare"
    if adapter.profile.flash_gap_s and set(entities) & adapter._flash_entities():
        return "flash"
    for index, entity_id in enumerate(entities):
        later = entities[index + 1 :]
        for role in _roles_of(adapter, entity_id):
            if role.endswith("_limit"):
                switch = adapter.controls.get(f"{role}_enabled")
                if switch is not None and switch in later:
                    return "value_before_switch"
            elif role.endswith("_limit_enabled"):
                value = adapter.controls.get(role.removesuffix("_enabled"))
                if value is not None and value in later:
                    return "switch_before_value"
    return None


def _roles_of(adapter: Adapter | None, entity_id: str) -> list[str]:
    """The roles an entity plays (an entity may be assigned twice)."""
    if adapter is None:
        return []
    return [r for r in ROLES if adapter.controls.get(r) == entity_id]


def _role_of(adapter: Adapter | None, entity_id: str) -> str | None:
    roles = _roles_of(adapter, entity_id)
    return roles[0] if roles else None


def _available(hass: HomeAssistant, entity_id: str) -> bool:
    state = hass.states.get(entity_id)
    return state is not None and state.state not in ("unavailable", "unknown")


def _signature(writes: list[Write]) -> list[tuple[str, Any]]:
    return [(w.entity_id, w.value) for w in writes]


def _changing(
    hass: HomeAssistant, writes: list[Write], saved: dict[str, Any]
) -> list[Write]:
    """The writes that change something: calls, values that do not stand so
    yet, and values Joe noted an original for (he set them himself)."""
    return [
        w for w in writes if w.is_call or w.entity_id in saved or not matches(hass, w)
    ]
