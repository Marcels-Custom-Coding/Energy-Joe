"""Which system regulates a battery ("Wer regelt ihn?"), for the day's turns
(control/team.py) and the night's order of charging (plan/night.py)."""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from .profiles import profile_for


def proposed_group(hass: HomeAssistant, battery: dict[str, Any]) -> tuple[str, bool]:
    """The system Joe thinks regulates a battery, and whether he is sure.

    The batteries of one integration entry (all batteries of one
    Omnibattery, a Fronius or Kostal inverter with its battery) are
    regulated by its system; Omnibattery's batteries also by the system
    limits they share. Batteries Joe steers through levers the owner
    assigned (or only watches) are a system of their own until the owner
    says otherwise.
    """
    adapter = battery.get("adapter") or "none"
    profiled = profile_for(adapter) is not None and adapter not in (
        "generic",
        "steps",
    )
    if profiled:
        item = er.async_get(hass).async_get(battery["soc_entity"])
        if item is not None and item.config_entry_id:
            return f"entry:{item.config_entry_id}", True
        shared = (battery.get("controls") or {}).get("system_charge_limit")
        if shared:
            return f"system:{shared}", True
    return f"own:{battery['id']}", profiled


def group_of(hass: HomeAssistant, battery: dict[str, Any]) -> str:
    """A battery's group: as the owner set it, else as Joe proposes."""
    return battery.get("control_group") or proposed_group(hass, battery)[0]
