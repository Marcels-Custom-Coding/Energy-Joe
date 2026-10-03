"""Night actions at the controls: one entity switched to a value and back."""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant

from .adapters import Adapter, Desired
from .writes import Write


class ActionAdapter(Adapter):
    """A night action: its entity on with a value, then back (fixed value or as it was)."""

    kind = "action"

    def __init__(self, action: dict[str, Any]) -> None:
        super().__init__(
            {
                "id": f"action:{action['id']}",
                "name": action["name"],
                "controls": {"entity": action["entity_id"]},
            }
        )
        self.action = action

    @property
    def entity_id(self) -> str:
        return self.action["entity_id"]

    def missing(self, hass: HomeAssistant) -> list[str]:
        return [] if hass.states.get(self.entity_id) else ["entity"]

    def writes(
        self,
        hass: HomeAssistant,
        desired: Desired,
        soc: float,
        saved: dict[str, Any],
    ) -> list[Write]:
        return self.on() if desired.charge_to is not None else self.release(saved)

    def on(self) -> list[Write]:
        return [Write(self.entity_id, self.action.get("on_value", "on"))]

    def release(self, saved: dict[str, Any]) -> list[Write]:
        """Back to the fixed value, or to what it was before Joe switched it."""
        if self.entity_id not in saved:
            return []
        if (
            self.action.get("reset") == "fixed"
            and self.action.get("reset_value") is not None
        ):
            return [Write(self.entity_id, self.action["reset_value"])]
        if saved[self.entity_id] is None:
            return []
        return [Write(self.entity_id, saved[self.entity_id])]
