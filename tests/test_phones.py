"""Several phones for the notifications (0.9.55)."""

from __future__ import annotations

from typing import Any
from unittest.mock import AsyncMock

from custom_components.energy_joe.control.notify import ACCEPT, JoeNotifier
from custom_components.energy_joe.model import NOTIFY
from homeassistant.core import Event, HomeAssistant, ServiceCall


def register(hass: HomeAssistant, *names: str) -> list[tuple[str, dict[str, Any]]]:
    calls: list[tuple[str, dict[str, Any]]] = []
    for name in names:

        async def handle(call: ServiceCall, name: str = name) -> None:
            calls.append((name, dict(call.data)))

        hass.services.async_register("notify", name, handle)
    return calls


async def test_every_phone_hears_it(hass: HomeAssistant) -> None:
    calls = register(hass, "anna", "ben")
    config = {
        "notify": NOTIFY({"services": ["notify.anna", "notify.ben", "notify.gone"]})
    }
    joe = JoeNotifier(hass, lambda: config, AsyncMock())
    await joe.async_problem("release_failed", entities=["number.reserve"])
    assert sorted(name for name, _ in calls) == ["anna", "ben"]


async def test_an_old_configuration_with_one_phone_still_works(
    hass: HomeAssistant,
) -> None:
    calls = register(hass, "anna", "ben")
    config = {"notify": NOTIFY({"service": "notify.anna"})}
    assert config["notify"]["services"] == []
    joe = JoeNotifier(hass, lambda: config, AsyncMock())
    await joe.async_problem("release_failed", entities=["number.reserve"])
    assert [name for name, _ in calls] == ["anna"]


async def test_no_phone_no_push(hass: HomeAssistant) -> None:
    calls = register(hass, "anna")
    config = {"notify": NOTIFY({})}
    joe = JoeNotifier(hass, lambda: config, AsyncMock())
    await joe.async_problem("release_failed", entities=["number.reserve"])
    assert calls == []


async def test_an_answer_clears_the_question_on_the_other_phones(
    hass: HomeAssistant,
) -> None:
    calls = register(hass, "anna", "ben")
    config = {"notify": NOTIFY({"services": ["notify.anna", "notify.ben"]})}
    answer = AsyncMock()
    joe = JoeNotifier(hass, lambda: config, answer)
    await joe._on_action(Event("mobile_app_notification_action", {"action": ACCEPT}))
    answer.assert_awaited_once_with(True)
    assert sorted(name for name, _ in calls) == ["anna", "ben"]
    assert all(data["message"] == "clear_notification" for _, data in calls)
