"""Diagnostics download for Energy Joe."""

from __future__ import annotations

from typing import Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .runtime import DATA_RUNTIME

# Names of people and their calendars are personal; entity ids of meters are not.
TO_REDACT = {"name", "person_entity", "calendars", "detail"}
REDACTED = "**REDACTED**"


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry
) -> dict[str, Any]:
    """Return Joe's state and configuration with personal data removed."""
    runtime = hass.data.get(DATA_RUNTIME)
    if runtime is None:
        return {"loaded": False}
    state = runtime.state
    config = state.pop("config")
    # Person ids are entity ids like "person.<name>"; they show up in ids,
    # provenance paths, the list of ignored items, a car's need and day labels.
    ids = {
        person["id"]: f"person {index + 1}"
        for index, person in enumerate(config["persons"])
    }
    config["persons"] = [
        {**person, "id": ids[person["id"]]} for person in config["persons"]
    ]
    for action in config.get("actions") or []:
        need = action.get("need") or {}
        if need.get("persons"):
            need["persons"] = [ids.get(p, REDACTED) for p in need["persons"]]
    plan = state.get("plan") or {}
    # Tomorrow's appointments (place and time) come from the family's calendars.
    for action in plan.get("actions") or []:
        for trip in (action.get("need") or {}).get("trips") or []:
            trip["location"] = REDACTED
            trip["start"] = REDACTED
    tomorrow = (plan.get("meta") or {}).get("tomorrow") or {}
    if isinstance(tomorrow.get("labels"), dict):
        tomorrow["labels"] = {
            ids.get(key, REDACTED): value for key, value in tomorrow["labels"].items()
        }
    config["provenance"] = {
        path: entry
        for path, entry in config["provenance"].items()
        if not path.startswith("persons[")
    }
    answers = config["answers"]
    answers["ignored"] = [
        REDACTED if item.startswith("person:") else item
        for item in answers.get("ignored", [])
    ]
    observe = state.get("observe", {})
    return {
        "loaded": True,
        "state": state,
        "config": async_redact_data(config, TO_REDACT),
        "history": {**runtime.history.overview(), "months": runtime.history.months},
        "observe": observe,
        # What Joe changed and still has to put back (entity ids and values).
        "control": {
            "saved": runtime.executor.data["saved"],
            "active": runtime.executor.data["active"],
            "failures": runtime.executor.data["failures"],
        },
    }
