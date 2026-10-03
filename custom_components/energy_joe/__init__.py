"""Energy Joe – learning load shifting for Home Assistant."""

from __future__ import annotations

import hashlib
import logging
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType
from homeassistant.loader import async_get_integration

from . import api
from .const import (
    DOMAIN,
    FRONTEND_DIR,
    PANEL_BUNDLE,
    PANEL_ICON,
    PANEL_TITLE,
    PANEL_URL_PATH,
    PANEL_WEBCOMPONENT,
    STATIC_URL,
)

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

# Static routes cannot be removed again, so they are registered once per run.
_DATA_STATIC_REGISTERED = f"{DOMAIN}_static_registered"


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the websocket API once per Home Assistant run."""
    api.async_register(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Serve the panel and add it to the sidebar."""
    frontend_path = Path(__file__).parent / FRONTEND_DIR
    if not hass.data.get(_DATA_STATIC_REGISTERED):
        await hass.http.async_register_static_paths(
            [StaticPathConfig(STATIC_URL, str(frontend_path), cache_headers=False)]
        )
        hass.data[_DATA_STATIC_REGISTERED] = True

    integration = await async_get_integration(hass, DOMAIN)
    bundle_hash = await hass.async_add_executor_job(
        _file_hash, frontend_path / PANEL_BUNDLE
    )

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
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Remove the panel from the sidebar."""
    frontend.async_remove_panel(hass, PANEL_URL_PATH)
    return True


def _file_hash(path: Path) -> str:
    """Return a short content hash used to bust the browser cache."""
    try:
        return hashlib.sha256(path.read_bytes()).hexdigest()[:10]
    except FileNotFoundError:
        _LOGGER.error("Panel bundle is missing: %s", path)
        return "missing"
