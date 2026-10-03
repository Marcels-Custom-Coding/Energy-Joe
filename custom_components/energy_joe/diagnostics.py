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
    # provenance paths and the list of ignored items.
    config["persons"] = [
        {**person, "id": f"person {index + 1}"}
        for index, person in enumerate(config["persons"])
    ]
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
    }
