"""Joe's configuration: what he knows about the home, with the origin of each value.

The configuration is stored as plain data and validated with voluptuous. Every
change records where a value came from ("read" from Home Assistant, "learned"
by Joe, a "default", or set by the "user"), so the panel can explain it.
"""

from __future__ import annotations

from copy import deepcopy
from datetime import UTC, datetime
import re
from typing import Any

import voluptuous as vol

from homeassistant.helpers import config_validation as cv

CONFIG_VERSION = 1

SOURCES = ("read", "learned", "default", "user")
ADAPTERS = ("fronius", "omnibattery", "generic", "none")
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
        vol.Optional("controls", default=dict): {str: cv.entity_id},
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
    }
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
        vol.Optional("answers", default=dict): {str: object},
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

    Nested dicts are merged, lists and plain values are replaced. Every changed
    leaf path gets a provenance entry. Raises vol.Invalid if the result is invalid.
    """
    if source not in SOURCES:
        raise vol.Invalid(f"unknown source: {source}")
    patch = {
        key: value
        for key, value in patch.items()
        if key not in ("version", "provenance")
    }
    merged = _merge(deepcopy(config), patch)
    stamp = (now or datetime.now(UTC)).isoformat(timespec="seconds")
    for path in _leaf_paths(patch):
        entry: dict[str, Any] = {"source": source, "updated": stamp}
        if detail:
            entry["detail"] = detail
        merged.setdefault("provenance", {})[path] = entry
    return validate(merged)


def migrate(data: dict[str, Any]) -> dict[str, Any]:
    """Bring stored configuration up to the current version."""
    # Version 1 is the first stored format; later versions add steps here.
    data = deepcopy(data)
    data["version"] = CONFIG_VERSION
    return validate(data)


def _merge(base: dict[str, Any], patch: dict[str, Any]) -> dict[str, Any]:
    for key, value in patch.items():
        if isinstance(value, dict) and isinstance(base.get(key), dict) and value:
            base[key] = _merge(base[key], value)
        else:
            base[key] = deepcopy(value)
    return base


def _leaf_paths(patch: dict[str, Any], prefix: str = "") -> list[str]:
    paths: list[str] = []
    for key, value in patch.items():
        path = f"{prefix}{key}"
        if isinstance(value, dict) and value:
            paths.extend(_leaf_paths(value, f"{path}."))
        else:
            paths.append(path)
    return paths
