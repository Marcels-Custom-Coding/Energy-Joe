"""Energy Joe – learning load shifting for Home Assistant."""

from __future__ import annotations

import hashlib
import logging
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.start import async_at_started
from homeassistant.helpers.typing import ConfigType
from homeassistant.loader import async_get_integration

from . import api, services
from .const import (
    DOMAIN,
    FRONTEND_DIR,
    ICONS_BUNDLE,
    PANEL_BUNDLE,
    PANEL_ICON,
    PANEL_TITLE,
    PANEL_URL_PATH,
    PANEL_WEBCOMPONENT,
    STATIC_URL,
)
from .runtime import DATA_RUNTIME, JoeRuntime

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)
PLATFORMS = [Platform.BUTTON, Platform.SELECT, Platform.SENSOR, Platform.SWITCH]

# Static routes cannot be removed again, so they are registered once per run.
_DATA_STATIC_REGISTERED = f"{DOMAIN}_static_registered"
_DATA_ICONS_URL = f"{DOMAIN}_icons_url"


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the websocket API and the services once per Home Assistant run."""
    api.async_register(hass)
    services.async_register(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Load Joe's state, serve the panel and add it to the sidebar."""
    runtime = JoeRuntime(hass)
    await runtime.async_load()
    hass.data[DATA_RUNTIME] = runtime

    frontend_path = Path(__file__).parent / FRONTEND_DIR
    if not hass.data.get(_DATA_STATIC_REGISTERED):
        await hass.http.async_register_static_paths(
            [StaticPathConfig(STATIC_URL, str(frontend_path), cache_headers=False)]
        )
        hass.data[_DATA_STATIC_REGISTERED] = True

    integration = await async_get_integration(hass, DOMAIN)
    bundle_hash, icons_hash = await hass.async_add_executor_job(
        _file_hashes, frontend_path / PANEL_BUNDLE, frontend_path / ICONS_BUNDLE
    )

    # The icon set must be available before the panel is opened, because the
    # sidebar entry uses it. Extra modules reach already open browsers, too.
    icons_url = f"{STATIC_URL}/{ICONS_BUNDLE}?v={integration.version}-{icons_hash}"
    frontend.add_extra_js_url(hass, icons_url)
    hass.data[_DATA_ICONS_URL] = icons_url

    if PANEL_URL_PATH in hass.data.get(frontend.DATA_PANELS, {}):
        frontend.async_remove_panel(hass, PANEL_URL_PATH)

    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=PANEL_URL_PATH,
        webcomponent_name=PANEL_WEBCOMPONENT,
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        module_url=f"{STATIC_URL}/{PANEL_BUNDLE}?v={integration.version}-{bundle_hash}",
        embed_iframe=False,
        require_admin=True,
        config={"version": str(integration.version)},
    )

    @callback
    def _start(_: HomeAssistant) -> None:
        # Joe starts watching once all integrations are up.
        runtime.async_start()

    entry.async_on_unload(async_at_started(hass, _start))
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Remove the panel from the sidebar."""
    if not await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        return False
    frontend.async_remove_panel(hass, PANEL_URL_PATH)
    if icons_url := hass.data.pop(_DATA_ICONS_URL, None):
        frontend.remove_extra_js_url(hass, icons_url)
    if runtime := hass.data.pop(DATA_RUNTIME, None):
        await runtime.async_unload()
    return True


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Delete Joe's stored state when the integration is removed."""
    await JoeRuntime(hass).async_remove()


def _file_hashes(*paths: Path) -> tuple[str, ...]:
    """Return short content hashes used to bust the browser cache."""
    hashes = []
    for path in paths:
        try:
            hashes.append(hashlib.sha256(path.read_bytes()).hexdigest()[:10])
        except FileNotFoundError:
            _LOGGER.error("Frontend file is missing: %s", path)
            hashes.append("missing")
    return tuple(hashes)
