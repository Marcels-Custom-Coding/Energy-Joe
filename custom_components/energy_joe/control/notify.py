"""How Joe speaks up: a notification in Home Assistant, a push to a phone, a repair hint.

Problems always land in Home Assistant's notifications (and as a repair
issue when Joe cannot give values back); a phone hears what the user chose
in the panel. In the "suggest" mode the push carries two buttons, Yes and No.
"""

from __future__ import annotations

from collections.abc import Awaitable, Callable
import logging
from typing import Any

from homeassistant.components import persistent_notification
from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant, callback
from homeassistant.helpers import issue_registry as ir

from ..const import DOMAIN

_LOGGER = logging.getLogger(__name__)

ACCEPT = "ENERGY_JOE_YES"
DECLINE = "ENERGY_JOE_NO"
ACTION_EVENT = "mobile_app_notification_action"

TEXTS: dict[str, dict[str, str]] = {
    "de": {
        "ask.title": "Energy Joe fragt",
        "ask.charge": "Heute Nacht würde ich die Speicher auf {target} % laden ({kwh} kWh). Soll ich?",
        "ask.hold": "Heute Nacht würde ich die Speicher bei {target} % halten. Soll ich?",
        "ask.hint": "Antworten kannst du auch im Panel unter Plan.",
        "yes": "Ja, mach",
        "no": "Heute nicht",
        "problem.title": "Energy Joe braucht dich",
        "problem.release_failed": "Ich konnte nicht alle Werte zurückstellen: {entities}. Ich versuche es weiter – schau bitte im Panel unter Geräte nach.",
        "problem.control_failed": "Beim Steuern von {battery} hat etwas nicht geklappt ({code}). Ich lasse den Speicher für heute Nacht in Ruhe.",
        "problem.no_progress": "{battery} soll laden, der Ladestand steigt aber seit einer halben Stunde nicht. Schau bitte nach, ob der Speicher Netzladen erlaubt – im Panel unter Geräte hilft ein Testlauf.",
        "morning.title": "Energy Joe: die Nacht",
        "morning.text": "Ich habe heute Nacht gesteuert: {batteries}. Alles ist wieder zurückgestellt.",
    },
    "en": {
        "ask.title": "Energy Joe asks",
        "ask.charge": "Tonight I would charge the batteries to {target} % ({kwh} kWh). Shall I?",
        "ask.hold": "Tonight I would hold the batteries at {target} %. Shall I?",
        "ask.hint": "You can also answer in the panel under Plan.",
        "yes": "Yes, go",
        "no": "Not tonight",
        "problem.title": "Energy Joe needs you",
        "problem.release_failed": "I could not put all values back: {entities}. I keep trying – please have a look in the panel under Devices.",
        "problem.control_failed": "Something went wrong steering {battery} ({code}). I leave this battery alone tonight.",
        "problem.no_progress": "{battery} should charge, but its level has not risen for half an hour. Please check whether the battery allows charging from the grid – a test run under Devices in the panel helps.",
        "morning.title": "Energy Joe: the night",
        "morning.text": "I steered tonight: {batteries}. Everything is back as it was.",
    },
}


class JoeNotifier:
    """Sends Joe's questions and problems; hears the answers from phones."""

    def __init__(
        self,
        hass: HomeAssistant,
        config: Callable[[], dict[str, Any]],
        answer: Callable[[bool], Awaitable[None]],
    ) -> None:
        self._hass = hass
        self._config = config
        self._answer = answer
        self._unsub: CALLBACK_TYPE | None = None

    def start(self) -> None:
        if self._unsub is None:
            self._unsub = self._hass.bus.async_listen(ACTION_EVENT, self._on_action)

    def stop(self) -> None:
        if self._unsub:
            self._unsub()
            self._unsub = None

    def _text(self, key: str, **values: Any) -> str:
        language = (
            "de" if (self._hass.config.language or "en").startswith("de") else "en"
        )
        return TEXTS[language][key].format(**values)

    async def async_ask(self, plan: dict[str, Any]) -> None:
        """Ask whether Joe may steer tonight (the "suggest" mode)."""
        notify = self._config()["notify"]
        kind = "ask.charge" if plan.get("kind") == "charge" else "ask.hold"
        message = self._text(
            kind,
            target=plan.get("target"),
            kwh=f"{plan.get('grid_charge_kwh') or 0:.1f}".replace(".", ","),
        )
        persistent_notification.async_create(
            self._hass,
            f"{message}\n\n{self._text('ask.hint')}",
            self._text("ask.title"),
            f"{DOMAIN}_ask",
        )
        if notify["service"] and notify["ask"]:
            await self._push(
                self._text("ask.title"),
                message,
                {
                    "tag": f"{DOMAIN}_ask",
                    "actions": [
                        {"action": ACCEPT, "title": self._text("yes")},
                        {"action": DECLINE, "title": self._text("no")},
                    ],
                },
            )

    @callback
    def clear_ask(self) -> None:
        persistent_notification.async_dismiss(self._hass, f"{DOMAIN}_ask")

    async def async_problem(self, kind: str, **values: Any) -> None:
        """Tell about a problem: notification, repair issue and, if wanted, the phone."""
        if "entities" in values:
            values["entities"] = ", ".join(values["entities"])
        message = self._text(f"problem.{kind}", **values)
        persistent_notification.async_create(
            self._hass, message, self._text("problem.title"), f"{DOMAIN}_{kind}"
        )
        ir.async_create_issue(
            self._hass,
            DOMAIN,
            kind,
            is_fixable=False,
            severity=ir.IssueSeverity.WARNING,
            translation_key=kind,
            translation_placeholders={k: str(v) for k, v in values.items()},
        )
        notify = self._config()["notify"]
        if notify["service"] and notify["problems"]:
            await self._push(
                self._text("problem.title"), message, {"tag": f"{DOMAIN}_{kind}"}
            )

    async def async_clear(self, kind: str) -> None:
        persistent_notification.async_dismiss(self._hass, f"{DOMAIN}_{kind}")
        ir.async_delete_issue(self._hass, DOMAIN, kind)

    async def async_morning(self, batteries: str) -> None:
        notify = self._config()["notify"]
        if notify["service"] and notify["morning"]:
            await self._push(
                self._text("morning.title"),
                self._text("morning.text", batteries=batteries),
                {"tag": f"{DOMAIN}_morning"},
            )

    async def _push(self, title: str, message: str, data: dict[str, Any]) -> None:
        service = (self._config()["notify"]["service"] or "").split(".", 1)[-1]
        if not service or not self._hass.services.has_service("notify", service):
            return
        try:
            await self._hass.services.async_call(
                "notify",
                service,
                {"title": title, "message": message, "data": data},
                blocking=True,
            )
        except Exception:  # noqa: BLE001 - a failed push must not stop Joe
            _LOGGER.warning(
                "Notification through notify.%s failed", service, exc_info=True
            )

    async def _on_action(self, event: Event) -> None:
        action = event.data.get("action")
        if action in (ACCEPT, DECLINE):
            await self._answer(action == ACCEPT)
