"""Config flow for Energy Joe.

Adding the integration asks nothing: the whole setup happens in the panel.
"""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult

from .const import DOMAIN, NAME


class EnergyJoeConfigFlow(ConfigFlow, domain=DOMAIN):
    """Single confirmation step; only one instance is allowed (see manifest)."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Confirm adding Energy Joe."""
        if user_input is not None:
            return self.async_create_entry(title=NAME, data={})
        return self.async_show_form(step_id="user")
