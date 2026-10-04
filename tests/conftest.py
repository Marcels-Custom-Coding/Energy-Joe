"""Shared fixtures for the Energy Joe tests."""

from __future__ import annotations

from collections.abc import Generator
from unittest.mock import patch

import pytest

from homeassistant.components.frontend import DATA_EXTRA_MODULE_URL, UrlManager
from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component

pytest_plugins = ["pytest_homeassistant_custom_component"]


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(
    enable_custom_integrations: None,
) -> Generator[None]:
    """Allow loading custom integrations in every test."""
    yield


@pytest.fixture(autouse=True)
def command_pauses() -> Generator[list[float]]:
    """Pauses devices need between commands cost no time in tests (recorded)."""
    pauses: list[float] = []

    async def settle(seconds: float) -> None:
        pauses.append(seconds)

    with patch("custom_components.energy_joe.control.writes.settle", settle):
        yield pauses


@pytest.fixture
async def ready_hass(hass: HomeAssistant) -> HomeAssistant:
    """Home Assistant with the parts Energy Joe depends on.

    The real frontend needs its build package, so it is only marked as loaded;
    panel registration itself works without it.
    """
    assert await async_setup_component(hass, "http", {})
    assert await async_setup_component(hass, "websocket_api", {})
    hass.config.components.update({"frontend", "panel_custom"})
    hass.data[DATA_EXTRA_MODULE_URL] = UrlManager(lambda *_: None, [])
    return hass
