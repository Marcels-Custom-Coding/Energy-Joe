"""Diagnostics download for Energy Joe."""

from __future__ import annotations

from typing import Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .runtime import DATA_RUNTIME

# Names of people and their calendars are personal; entity ids of meters are not.
TO_REDACT = {
    "name",
    "person_entity",
    "calendars",
    "detail",
    # The mailbox: addresses of the user and of who may invite.
    "address",
    "username",
    "allowed",
    "cars",
    "recent",
    # A car's own account (a CalDAV address may hold the user name).
    "url",
}
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
    # provenance paths, the list of ignored items, a car's need, day labels and
    # the learned hours at home.
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
    learned = config.get("learned") or {}
    if isinstance(learned.get("presence"), dict):
        learned["presence"] = {
            ids.get(key, REDACTED): value for key, value in learned["presence"].items()
        }
    plan = state.get("plan") or {}
    # Tomorrow's appointments (place and time) come from the family's calendars;
    # the departure is the first one's start minus the drive.
    for action in plan.get("actions") or []:
        need = action.get("need") or {}
        for trip in need.get("trips") or []:
            trip["location"] = REDACTED
            trip["start"] = REDACTED
        if need.get("departure"):
            need["departure"] = REDACTED
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
    # The mailbox's last invitations: titles, times and senders.
    if isinstance(state.get("mailbox"), dict):
        state["mailbox"] = async_redact_data(state["mailbox"], TO_REDACT)
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
