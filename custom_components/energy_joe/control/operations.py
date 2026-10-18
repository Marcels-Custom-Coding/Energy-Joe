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

Each operation says whether it is possible now and why not (the adapters'
own codes), where its steps come from ("profile", "generic", "own",
"service", "none"), the writes in their order with the entities' values
now, and what "back" writes afterwards ("saved": the original noted before).
The executor's probe (JoeExecutor.async_probe) writes the same steps once,
reads them back and puts everything back.

The roles of a battery come with what its profile finds in Home Assistant
today ("found"), so the panel can show where the saved levers differ.
"""

from __future__ import annotations

from dataclasses import dataclass, field
import math
from typing import Any

from homeassistant.core import HomeAssistant

from ..observe.readings import number
from .adapters import DEFAULT_CHARGE_W, Adapter, Desired, RoleAdapter, make_adapter
from .guard import BLOCK_S
from .profiles import BLOCK_OPERATIONS, GENERIC, OPERATIONS, PROFILES, ROLES
from .writes import Write, fit

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
# Why an operation is not possible, when nothing at all defines it (the
# source is "none" then); every other code is a matter of the moment
# (unavailable, soc_unknown, controls_missing, need_ref, unit, flash,
# cannot_hold, cannot_block).
NOTHING_DEFINES = (
    "not_controllable",
    "no_charge",
    "no_lever",
    "no_charge_lever",
    "no_discharge_lever",
    "no_limit",
    "system_shared",
    "exclusive",
)


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

    def as_dict(self) -> dict[str, Any]:
        return {
            "target": self.target,
            "power_w": round(self.power_w),
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
    note: str | None = None


def params_for(
    hass: HomeAssistant,
    battery: dict[str, Any],
    target: float | None = None,
    power_w: float | None = None,
    whole_system: bool = True,
) -> Params:
    """The values of the moment: the plan's target and power where given,
    else a step above the level now and the battery's highest power."""
    soc = number(hass.states.get(battery["soc_entity"]))
    level = 0.0 if soc is None else soc
    power = float(power_w or battery.get("max_charge_w") or DEFAULT_CHARGE_W)
    return Params(
        soc=soc,
        target=int(min(100, math.ceil(level) + TARGET_STEP))
        if target is None
        else int(target),
        power_w=power,
        floor=max(0, math.floor(level)),
        cap_w=float(battery.get("max_charge_w") or power) * CAP_PERCENT / 100,
        whole_system=whole_system,
    )


def operations(
    hass: HomeAssistant, adapter: Adapter | None, params: Params
) -> list[Operation]:
    """Every operation in the panel's order (charge, hold, block,
    block_charge, block_discharge, cap, release), then the watchdog's blocks
    where they differ from the day's."""
    if not isinstance(adapter, RoleAdapter):
        return [Operation(op, False, "not_controllable", "none") for op in OPERATIONS]
    found = [
        operation(hass, adapter, op, params) for op in OPERATIONS if op != "release"
    ]
    written = [w.entity_id for item in found for w in item.writes if not w.is_call]
    found.append(operation(hass, adapter, "release", params, written=written))
    by_op = {item.op: item for item in found}
    for direction in ("charge", "discharge"):
        guard = operation(hass, adapter, f"guard_{direction}", params)
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
    """One operation as it would run now. `saved`: the originals noted (the
    probe's "back" writes them); `written`: for "release", the entities the
    other operations write."""
    source = source_of(adapter, op)
    result = Operation(op, True, None, source)
    saved = saved or {}
    soc = params.soc
    writes: list[Write] = []
    if op in ("charge", "hold"):
        missing = adapter.missing(hass)
        if op == "charge" and not adapter.can_charge:
            return _impossible(result, "no_charge")
        if missing:
            return _impossible(
                result, "no_lever" if "hold" in missing else "controls_missing"
            )
        if soc is None:
            return _impossible(result, "soc_unknown")
        desired = (
            Desired(charge_to=params.target, power_w=params.power_w)
            if op == "charge"
            else Desired(floor=params.floor)
        )
        problem = adapter.steer_problem(hass, desired, soc, {})
        if problem:
            return _impossible(result, problem)
        writes = adapter.writes(hass, desired, soc, {})
        if (
            op == "charge"
            and adapter.power_lever(hass) == "cap"
            and adapter.night_cap_problem(hass) is None
        ):
            # The ceiling of the power goes first (see executor._async_night_cap).
            writes = adapter.night_cap(hass, round(params.power_w), {}) + writes
    elif op in ("block", "block_charge", "block_discharge"):
        charge, discharge = op != "block_discharge", op != "block_charge"
        own = adapter._own_block(hass, charge, discharge)
        if own is None:
            problem = adapter.team_problem(hass, params.whole_system)
            if problem:
                return _impossible(result, problem)
            if soc is None and adapter.team_lever(params.whole_system) == "level":
                return _impossible(result, "soc_unknown")
        writes, _ = adapter.team_block(
            hass, charge, discharge, False, params.whole_system, {}
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
        writes = adapter.limit(hass, params.cap_w / 1000, {}, False)
    elif op == "release":
        writes = (
            adapter._render("release", adapter._values(Desired(), 0.0))
            if adapter.own_steps("release")
            else []
        )
    else:
        raise ValueError(f"unknown operation: {op}")
    result.writes = [fit(hass, w) for w in writes]
    result.restore = restore_writes(adapter, op, result.writes, saved, written)
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
    own = adapter.own_steps(op) is not None and source_of(adapter, op) == "own"
    if op in GUARD_OPERATIONS or (own and op != "release"):
        # Held newest first (executor._async_guard_restore, own_free).
        back = [Write(e, originals[e]) for e in reversed(list(originals))]
    elif op in ("block", "block_charge", "block_discharge"):
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
    service steps (Huawei)."""
    profile = adapter.profile
    if op in GUARD_OPERATIONS:
        # The watchdog blocks with the own one-way steps where there are some.
        own = adapter.own_steps(f"block_{op.removeprefix('guard_')}") is not None
    elif op in BLOCK_OPERATIONS:
        charge, discharge = op != "block_discharge", op != "block_charge"
        own = adapter._own_block_op(charge, discharge) is not None
    else:
        own = adapter.own_steps(op) is not None
    if profile.steps:
        if op in profile.steps and own:
            return "service"
        return "own" if own else "profile"
    if own:
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
) -> dict[str, Any]:
    """The preview the panel shows (see the module doc): the profile, the
    operations with their steps and what goes back, the roles with what the
    profile finds today (`found`) and whether the saved levers differ."""
    adapter = make_adapter(battery)
    profile = PROFILES.get(battery.get("adapter") or "")
    params = params_for(hass, battery, target, power_w, whole_system)
    found = found or {}
    items = operations(hass, adapter, params)
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
        "steps": [step_view(hass, adapter, w) for w in item.writes],
        "restore": [restore_view(hass, adapter, w) for w in item.restore],
        "note": item.note,
    }


def step_view(hass: HomeAssistant, adapter: Adapter | None, write: Write) -> dict:
    """A write as the panel shows it, with the entity's value now."""
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
        "unit": state.attributes.get("unit_of_measurement") if state else None,
        "current": state.state if state else None,
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
    of value it takes, which operations write it, and whether it differs."""
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
        for write in item.writes:
            if write.is_call:
                continue
            for role in _roles_of(adapter, write.entity_id):
                ops = used.setdefault(role, [])
                if item.op not in ops:
                    ops.append(item.op)
    result = []
    for role in ROLES:
        if role not in known and role not in controls and role not in BASE_ROLES:
            continue
        entity_id = controls.get(role)
        here = found.get(role)
        state = hass.states.get(entity_id or here or "")
        result.append(
            {
                "role": role,
                "entity_id": entity_id,
                "found": here,
                "kind": ROLE_KINDS.get(role, "setpoint"),
                "unit": state.attributes.get("unit_of_measurement") if state else None,
                "used_by": used.get(role, []),
                "deviates": here is not None and entity_id != here,
                "relevant": bool(used.get(role)) or entity_id is not None,
            }
        )
    return result


def _impossible(result: Operation, why: str) -> Operation:
    result.possible = False
    result.why = why
    if why in NOTHING_DEFINES:
        result.source = "none"
    return result


def _note(adapter: RoleAdapter, writes: list[Write]) -> str | None:
    """What is special about the order: values that end up in flash, or a
    limit written before the switch that makes it count (Fronius)."""
    entities = [w.entity_id for w in writes if not w.is_call]
    if set(entities) & adapter._flash_entities():
        return "flash"
    for index, entity_id in enumerate(entities):
        for role in _roles_of(adapter, entity_id):
            switch = adapter.controls.get(f"{role}_enabled")
            if (
                role.endswith("_limit")
                and switch is not None
                and switch in entities[index + 1 :]
            ):
                return "value_before_switch"
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
