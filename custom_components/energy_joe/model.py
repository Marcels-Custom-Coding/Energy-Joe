"""Joe's configuration: what he knows about the home, with the origin of each value.

The configuration is stored as plain data and validated with voluptuous. Every
change records where a value came from ("read" from Home Assistant, "learned"
by Joe, a "default", or set by the "user"), so the panel can explain it.

Provenance is kept per path: "tariff.kind", "measurements.grid_power" or, for
lists of items with an id, "batteries[<id>].capacity_kwh". What the user set or
Joe learned is never overwritten by what Joe reads from Home Assistant.
"""

from __future__ import annotations

from copy import deepcopy
from datetime import UTC, datetime
import re
from typing import Any

import voluptuous as vol

from homeassistant.helpers import config_validation as cv

from .control.profiles import ADAPTERS, MODE_OPTIONS, ROLES

CONFIG_VERSION = 2

SOURCES = ("read", "learned", "default", "user")
TARIFF_KINDS = ("fixed_window", "dynamic", "flat", "unknown")
CONSUMER_KINDS = (
    "climate",
    "heat_pump",
    "hot_water",
    "electric_heating",
    "ev",
    "comfort",
    "household",
    "submeter",
    "other",
)
DISCHARGE_MODES = ("until_target", "block", "free")
PRIORITY_ITEMS = ("ev", "hot_water", "battery")

# Lists whose items have an "id"; a patch may address single items by id.
KEYED_LISTS = ("batteries", "persons", "consumers")
# Values that are replaced as a whole instead of merged key by key.
REPLACED = frozenset(
    {
        "grid_power",
        "home_power",
        "power",
        "controls",
        "mode_options",
        "window",
        "steps",
        "prepare",
    }
)
# Origins that Joe's own reading never overwrites.
PROTECTED_SOURCES = ("user", "learned")
# Answer keys that list things the user told Joe to leave out or accepted as they are.
IGNORED = "ignored"
CONFIRMED = "confirmed"

_TIME = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")


def _time(value: Any) -> str:
    """Validate a time of day as HH:MM."""
    if not isinstance(value, str) or not _TIME.match(value):
        raise vol.Invalid("expected time as HH:MM")
    return value


_ENTITY = vol.Any(None, cv.entity_id)
_PRICE = vol.Any(None, vol.All(vol.Coerce(float), vol.Range(min=0, max=10)))
_POSITIVE = vol.Any(
    None, vol.All(vol.Coerce(float), vol.Range(min=0, min_included=False))
)
_PERCENT = vol.All(vol.Coerce(float), vol.Range(min=0, max=100))

# A power reading in Joe's convention. "minus_entity_id" covers setups with two
# positive sensors (e.g. import and export): value = entity - minus_entity.
MEASUREMENT = vol.Schema(
    {
        vol.Required("entity_id"): cv.entity_id,
        vol.Optional("invert", default=False): bool,
        vol.Optional("minus_entity_id", default=None): _ENTITY,
    }
)

# One step of a battery Joe steers through entities the user assigned: an entity
# and its value; "{floor}", "{target}" and "{power}" stand for the values of the moment.
# A step is an entity with a value, or a service call with data.
_STEP_ENTITY = vol.Schema(
    {
        vol.Required("entity_id"): cv.entity_id,
        vol.Optional("value", default=None): vol.Any(None, str, int, float, bool),
    }
)
_STEP_SERVICE = vol.Schema(
    {
        vol.Required("service"): vol.Match(r"^[a-z0-9_]+\.[a-z0-9_]+$"),
        vol.Optional("data", default=dict): dict,
    }
)
STEP = vol.Any(_STEP_ENTITY, _STEP_SERVICE)
STEPS = vol.Schema(
    {vol.Optional(name): [STEP] for name in ("charge", "hold", "release")}
)

BATTERY = vol.Schema(
    {
        vol.Required("id"): str,
        vol.Required("name"): str,
        vol.Required("adapter"): vol.In(ADAPTERS),
        vol.Required("soc_entity"): cv.entity_id,
        vol.Optional("power", default=None): vol.Any(None, MEASUREMENT),
        vol.Optional("capacity_kwh", default=None): _POSITIVE,
        vol.Optional("capacity_entity", default=None): _ENTITY,
        vol.Optional("max_charge_w", default=None): _POSITIVE,
        vol.Optional("max_discharge_w", default=None): _POSITIVE,
        vol.Optional("device_id", default=None): vol.Any(None, str),
        # Levers by role (see control/profiles.py) and the mode select's options.
        vol.Optional("controls", default=dict): {vol.In(ROLES): cv.entity_id},
        vol.Optional("mode_options", default=dict): {vol.In(MODE_OPTIONS): str},
        # Entities set before steering through the mode (e.g. "Remote Control").
        vol.Optional("prepare", default=list): [_STEP_ENTITY],
        vol.Optional("steps", default=dict): STEPS,
        vol.Optional("priority", default=1): vol.All(int, vol.Range(min=1, max=9)),
    }
)

TARIFF = vol.Schema(
    {
        vol.Optional("kind", default="unknown"): vol.In(TARIFF_KINDS),
        vol.Optional("price_entity", default=None): _ENTITY,
        vol.Optional("window", default=None): vol.Any(
            None, {vol.Required("start"): _time, vol.Required("end"): _time}
        ),
        vol.Optional("night_price", default=None): _PRICE,
        vol.Optional("day_price", default=None): _PRICE,
        vol.Optional("feed_in_price", default=None): _PRICE,
        vol.Optional("feed_in_entity", default=None): _ENTITY,
    }
)

FORECAST = vol.Schema(
    {
        vol.Optional("provider", default=None): vol.Any(None, str),
        vol.Optional("config_entries", default=list): [str],
        vol.Optional("today", default=list): [cv.entity_id],
        vol.Optional("tomorrow", default=list): [cv.entity_id],
        vol.Optional("remaining_today", default=list): [cv.entity_id],
    }
)

PERSON = vol.Schema(
    {
        vol.Required("id"): str,
        vol.Required("name"): str,
        vol.Optional("person_entity", default=None): _ENTITY,
        vol.Optional("calendars", default=list): [cv.entity_id],
    }
)

CONSUMER = vol.Schema(
    {
        vol.Required("id"): str,
        vol.Required("name"): str,
        vol.Required("kind"): vol.In(CONSUMER_KINDS),
        vol.Optional("energy_entity", default=None): _ENTITY,
        vol.Optional("power_entity", default=None): _ENTITY,
        vol.Optional("included_in", default=None): _ENTITY,
        vol.Optional("source", default="manual"): vol.In(
            ("energy_dashboard", "manual")
        ),
    }
)

RULES = vol.Schema(
    {
        vol.Optional("reserve_soc", default=10): _PERCENT,
        vol.Optional("max_target_soc", default=100): _PERCENT,
        vol.Optional("evening_min_soc", default=None): vol.Any(None, _PERCENT),
        vol.Optional("grid_limit_w", default=None): _POSITIVE,
        vol.Optional("max_night_kwh", default=None): _POSITIVE,
        vol.Optional("priority", default=list(PRIORITY_ITEMS)): [
            vol.In(PRIORITY_ITEMS)
        ],
        vol.Optional("discharge_in_window", default="until_target"): vol.In(
            DISCHARGE_MODES
        ),
        vol.Optional("plan_offset_min", default=15): vol.All(
            int, vol.Range(min=0, max=180)
        ),
        vol.Optional("reset_lead_min", default=3): vol.All(
            int, vol.Range(min=0, max=60)
        ),
        vol.Optional("buffer_factor", default=0.35): vol.All(
            vol.Coerce(float), vol.Range(min=0, max=3)
        ),
        # When Joe asks in the "suggest" mode whether he may steer tonight.
        vol.Optional("ask_time", default="21:00"): _time,
    }
)

# Who hears from Joe: a notify service (e.g. a phone) and what he tells.
NOTIFY = vol.Schema(
    {
        vol.Optional("service", default=None): vol.Any(
            None, vol.Match(r"^notify\.[a-z0-9_]+$")
        ),
        vol.Optional("ask", default=True): bool,
        vol.Optional("problems", default=True): bool,
        vol.Optional("morning", default=False): bool,
    }
)

# Answers to Joe's questions. Known keys are checked, others are kept as they are
# (e.g. "heating", "hot_water", "ev", "tariff", "capacity:<battery id>").
ANSWERS = vol.Schema(
    {
        vol.Optional(IGNORED, default=list): [str],
        vol.Optional(CONFIRMED, default=list): [str],
    },
    extra=vol.ALLOW_EXTRA,
)

# What Joe learned from his own observations (see learn/learning.py).
LEARNED = vol.Schema(
    {
        vol.Optional("solar_factor", default=None): vol.Any(
            None, vol.All(vol.Coerce(float), vol.Range(min=0.2, max=3))
        ),
        vol.Optional("solar_days", default=0): vol.All(int, vol.Range(min=0)),
        vol.Optional("solar_shift", default=None): vol.Any(None, vol.In((-1, 0, 1))),
        vol.Optional("shift_days", default=0): vol.All(int, vol.Range(min=0)),
        vol.Optional("buffer", default=None): vol.Any(
            None, vol.All(vol.Coerce(float), vol.Range(min=0, max=3))
        ),
        vol.Optional("buffer_days", default=0): vol.All(int, vol.Range(min=0)),
        vol.Optional("since", default=None): vol.Any(None, str),
        vol.Optional("updated", default=None): vol.Any(None, str),
    },
    extra=vol.ALLOW_EXTRA,
)

PROVENANCE = vol.Schema(
    {
        vol.Required("source"): vol.In(SOURCES),
        vol.Optional("detail"): str,
        vol.Optional("updated"): str,
    }
)

CONFIG = vol.Schema(
    {
        vol.Required("version"): CONFIG_VERSION,
        vol.Optional("measurements", default=dict): vol.Schema(
            {
                vol.Optional("grid_power", default=None): vol.Any(None, MEASUREMENT),
                vol.Optional("home_power", default=None): vol.Any(None, MEASUREMENT),
                vol.Optional("solar_power", default=list): [MEASUREMENT],
            }
        ),
        vol.Optional("batteries", default=list): [BATTERY],
        vol.Optional("tariff", default=dict): TARIFF,
        vol.Optional("forecast", default=dict): FORECAST,
        vol.Optional("context", default=dict): vol.Schema(
            {
                vol.Optional("weather_entity", default=None): _ENTITY,
                vol.Optional("holiday_entity", default=None): _ENTITY,
            }
        ),
        vol.Optional("persons", default=list): [PERSON],
        vol.Optional("consumers", default=list): [CONSUMER],
        vol.Optional("actions", default=list): [dict],
        vol.Optional("rules", default=dict): RULES,
        vol.Optional("notify", default=dict): NOTIFY,
        vol.Optional("answers", default=dict): ANSWERS,
        vol.Optional("learned", default=dict): LEARNED,
        vol.Optional("provenance", default=dict): {str: PROVENANCE},
    }
)


def default_config() -> dict[str, Any]:
    """Return a fresh, valid configuration with all defaults filled in."""
    return validate({"version": CONFIG_VERSION})


def validate(config: dict[str, Any]) -> dict[str, Any]:
    """Validate a configuration and fill in defaults (raises vol.Invalid)."""
    data = CONFIG(deepcopy(config))
    ids = [battery["id"] for battery in data["batteries"]]
    if len(ids) != len(set(ids)):
        raise vol.Invalid("battery ids must be unique", path=["batteries"])
    return data


def apply_update(
    config: dict[str, Any],
    patch: dict[str, Any],
    source: str,
    detail: str | None = None,
    now: datetime | None = None,
) -> dict[str, Any]:
    """Merge a partial update into the configuration and record its origin.

    Nested dicts are merged, lists and plain values are replaced. For the keyed
    lists (batteries, persons, consumers) the patch may be a dict by item id:
    a dict merges into that item (or adds it), None removes it. Every changed
    path gets a provenance entry. Raises vol.Invalid if the result is invalid.
    """
    if source not in SOURCES:
        raise vol.Invalid(f"unknown source: {source}")
    merged = deepcopy(config)
    provenance: dict[str, Any] = merged.setdefault("provenance", {})
    paths: list[str] = []
    for key, value in patch.items():
        if key in ("version", "provenance"):
            continue
        if key in KEYED_LISTS and isinstance(value, dict):
            merged[key] = _merge_items(merged.get(key) or [], value)
            for item_id, change in value.items():
                prefix = f"{key}[{item_id}]"
                provenance.pop(prefix, None)
                if change is None:
                    _forget(provenance, prefix)
                    paths.append(prefix)
                else:
                    fields = {k: v for k, v in change.items() if k != "id"}
                    paths.extend(_leaf_paths(fields, f"{prefix}."))
        elif key in KEYED_LISTS:
            merged[key] = deepcopy(value)
            _forget(provenance, key)
            paths.append(key)
        else:
            merged = _merge(merged, {key: value})
            paths.extend(_leaf_paths({key: value}))
    stamp = (now or datetime.now(UTC)).isoformat(timespec="seconds")
    for path in paths:
        entry: dict[str, Any] = {"source": source, "updated": stamp}
        if detail:
            entry["detail"] = detail
        _forget(provenance, path)
        provenance[path] = entry
    return validate(merged)


def adopt_proposal(
    config: dict[str, Any], proposal: dict[str, Any], now: datetime | None = None
) -> dict[str, Any]:
    """Take over what Joe found, except what the user set, Joe learned or ignored.

    Values discovery could not determine (None) never replace known ones.
    """
    answers = config.get("answers") or {}
    ignored = set(answers.get(IGNORED) or [])

    def free(path: str) -> bool:
        return not is_protected(config, path)

    patch: dict[str, Any] = {}

    found = proposal.get("measurements") or {}
    measurements: dict[str, Any] = {}
    for role in ("grid_power", "home_power"):
        if found.get(role) and role not in ignored and free(f"measurements.{role}"):
            measurements[role] = found[role]
    solar = found.get("solar_power") or []
    if solar and "solar_power" not in ignored and free("measurements.solar_power"):
        measurements["solar_power"] = solar
    if measurements:
        patch["measurements"] = measurements

    tariff = proposal.get("tariff") or {}
    if "tariff" not in ignored:
        change: dict[str, Any] = {}
        price = ("kind", "price_entity", "window", "night_price", "day_price")
        if tariff.get("kind", "unknown") != "unknown" and all(
            free(f"tariff.{field}") for field in price
        ):
            change.update({field: tariff.get(field) for field in price})
        feed_in = ("feed_in_price", "feed_in_entity")
        if any(tariff.get(field) is not None for field in feed_in) and all(
            free(f"tariff.{field}") for field in feed_in
        ):
            change.update({field: tariff.get(field) for field in feed_in})
        if change:
            patch["tariff"] = change

    forecast = proposal.get("forecast") or {}
    if forecast and "forecast" not in ignored and free("forecast"):
        patch["forecast"] = forecast

    found_context = proposal.get("context") or {}
    context: dict[str, Any] = {}
    for key, name in (("weather_entity", "weather"), ("holiday_entity", "holiday")):
        if found_context.get(key) and name not in ignored and free(f"context.{key}"):
            context[key] = found_context[key]
    if context:
        patch["context"] = context

    for key, kind in (
        ("batteries", "battery"),
        ("persons", "person"),
        ("consumers", "consumer"),
    ):
        known = {item["id"] for item in config.get(key) or []}
        items: dict[str, Any] = {}
        for item in proposal.get(key) or []:
            item_id = item["id"]
            prefix = f"{key}[{item_id}]"
            if f"{kind}:{item_id}" in ignored or _protected_above(config, prefix):
                continue
            if item_id not in known:
                items[item_id] = item
                continue
            fields = {
                field: value
                for field, value in item.items()
                if field != "id" and value is not None and free(f"{prefix}.{field}")
            }
            if fields:
                items[item_id] = fields
        if items:
            patch[key] = items

    return apply_update(config, patch, "read", now=now) if patch else config


def source_of(config: dict[str, Any], path: str) -> str:
    """Where a value came from: its own entry or the nearest parent's ("default" if none)."""
    provenance = config.get("provenance") or {}
    for candidate in reversed(_ancestors(path)):
        if entry := provenance.get(candidate):
            return entry.get("source", "default")
    return "default"


def prefer_learned(config: dict[str, Any]) -> dict[str, Any]:
    """A starting value gives way to what Joe learned (so far only the buffer)."""
    learned = config["learned"].get("buffer")
    if (
        learned is None
        or source_of(config, "rules.buffer_factor") != "default"
        or config["rules"]["buffer_factor"] == learned
    ):
        return config
    return apply_update(config, {"rules": {"buffer_factor": learned}}, "learned")


def is_protected(config: dict[str, Any], path: str) -> bool:
    """Whether the user or Joe's learning owns this path, a parent or a child of it."""
    if _protected_above(config, path):
        return True
    provenance = config.get("provenance") or {}
    return any(
        _is_below(other, path) and entry.get("source") in PROTECTED_SOURCES
        for other, entry in provenance.items()
    )


# Version 1 named a battery's controls after its integration; version 2 uses roles.
_V1_CONTROLS = {
    "fronius": {
        "minimum_reserve": "min_soc",
        "grid_charging": "grid_charge",
        "charge_limit": "charge_limit",
        "charge_limit_enabled": "charge_limit_enabled",
        "discharge_limit": "discharge_limit",
        "discharge_limit_enabled": "discharge_limit_enabled",
    },
    "omnibattery": {
        "force_mode": "mode",
        "charge_power": "charge_power",
        "discharge_power": "discharge_power",
        "charge_cutoff": "charge_target",
        "discharge_cutoff": "min_soc",
    },
}


def migrate(data: dict[str, Any]) -> dict[str, Any]:
    """Bring stored configuration up to the current version."""
    data = deepcopy(data)
    if data.get("version", 1) < 2:
        for battery in data.get("batteries") or []:
            names = _V1_CONTROLS.get(battery.get("adapter") or "", {})
            battery["controls"] = {
                names[name]: entity_id
                for name, entity_id in (battery.get("controls") or {}).items()
                if name in names
            }
            if battery.get("adapter") == "generic":
                battery["adapter"] = "none"
    data["version"] = CONFIG_VERSION
    return validate(data)


_TOKEN = re.compile(r"\[[^\]]*\]|[^.\[]+")


def _ancestors(path: str) -> list[str]:
    """ "a.b[c].d" -> ["a", "a.b", "a.b[c]", "a.b[c].d"]."""
    result: list[str] = []
    current = ""
    for token in _TOKEN.findall(path):
        if not current or token.startswith("["):
            current += token
        else:
            current += f".{token}"
        result.append(current)
    return result


def _is_below(other: str, path: str) -> bool:
    return other.startswith((f"{path}.", f"{path}["))


def _protected_above(config: dict[str, Any], path: str) -> bool:
    provenance = config.get("provenance") or {}
    return any(
        (entry := provenance.get(candidate)) is not None
        and entry.get("source") in PROTECTED_SOURCES
        for candidate in _ancestors(path)
    )


def _forget(provenance: dict[str, Any], path: str) -> None:
    """Drop provenance below a path (it is replaced as a whole)."""
    for other in [key for key in provenance if _is_below(key, path)]:
        del provenance[other]


def _merge(base: dict[str, Any], patch: dict[str, Any]) -> dict[str, Any]:
    for key, value in patch.items():
        if (
            isinstance(value, dict)
            and isinstance(base.get(key), dict)
            and value
            and key not in REPLACED
        ):
            base[key] = _merge(base[key], value)
        else:
            base[key] = deepcopy(value)
    return base


def _merge_items(
    items: list[dict[str, Any]], patch: dict[str, dict[str, Any] | None]
) -> list[dict[str, Any]]:
    by_id = {item["id"]: deepcopy(item) for item in items}
    order = [item["id"] for item in items]
    for item_id, change in patch.items():
        if change is None:
            by_id.pop(item_id, None)
        elif item_id in by_id:
            by_id[item_id] = _merge(by_id[item_id], change)
        else:
            by_id[item_id] = {**deepcopy(change), "id": item_id}
            order.append(item_id)
    return [by_id[item_id] for item_id in order if item_id in by_id]


def _leaf_paths(patch: dict[str, Any], prefix: str = "") -> list[str]:
    paths: list[str] = []
    for key, value in patch.items():
        path = f"{prefix}{key}"
        if isinstance(value, dict) and value and key not in REPLACED:
            paths.extend(_leaf_paths(value, f"{path}."))
        else:
            paths.append(path)
    return paths
