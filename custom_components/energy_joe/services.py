"""Services for automations: release, plan again, skip tonight, mode, answer."""

from __future__ import annotations

import voluptuous as vol

from homeassistant.core import HomeAssistant, ServiceCall, callback
from homeassistant.exceptions import ServiceValidationError

from .const import DOMAIN
from .runtime import DATA_RUNTIME, MODES, JoeRuntime


def _runtime(hass: HomeAssistant) -> JoeRuntime:
    if (runtime := hass.data.get(DATA_RUNTIME)) is None:
        raise ServiceValidationError(
            translation_domain=DOMAIN, translation_key="not_loaded"
        )
    return runtime


@callback
def async_register(hass: HomeAssistant) -> None:
    """Register Joe's services once per Home Assistant run."""

    async def release(call: ServiceCall) -> None:
        await _runtime(hass).executor.async_release_now()

    async def replan(call: ServiceCall) -> None:
        await _runtime(hass).async_refresh_plan()

    async def skip_tonight(call: ServiceCall) -> None:
        await _runtime(hass).executor.async_skip(call.data["skip"])

    async def set_mode(call: ServiceCall) -> None:
        _runtime(hass).async_set_mode(call.data["mode"])

    async def trigger_action(call: ServiceCall) -> None:
        await _runtime(hass).async_action_tonight(
            call.data["action_id"], call.data["tonight"]
        )

    async def answer(call: ServiceCall) -> None:
        await _runtime(hass).executor.async_answer_tonight(call.data["accept"])

    hass.services.async_register(DOMAIN, "release", release)
    hass.services.async_register(DOMAIN, "replan", replan)
    hass.services.async_register(
        DOMAIN,
        "skip_tonight",
        skip_tonight,
        vol.Schema({vol.Optional("skip", default=True): bool}),
    )
    hass.services.async_register(
        DOMAIN, "set_mode", set_mode, vol.Schema({vol.Required("mode"): vol.In(MODES)})
    )
    hass.services.async_register(
        DOMAIN, "answer", answer, vol.Schema({vol.Required("accept"): bool})
    )
    hass.services.async_register(
        DOMAIN,
        "trigger_action",
        trigger_action,
        vol.Schema(
            {
                vol.Required("action_id"): str,
                vol.Optional("tonight", default=True): bool,
            }
        ),
    )
