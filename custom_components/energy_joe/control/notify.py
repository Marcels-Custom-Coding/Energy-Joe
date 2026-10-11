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
# "Which car is plugged in?": ENERGY_JOE_CAR::<charge point>::<car id or guest>.
CAR_ANSWER = "ENERGY_JOE_CAR"
# Phones show only a few buttons; with more cars the panel answers.
MAX_BUTTONS = 3

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
        "problem.battery_transfer": "{charging} lädt, während {discharging} entlädt – seit mehr als zwei Minuten, obwohl ich immer nur einen arbeiten lasse. Schau bitte im Panel unter Geräte › Speicher › Mehrere Speicher nach.",
        "morning.title": "Energy Joe: die Nacht",
        "morning.text": "Ich habe heute Nacht gesteuert: {batteries}. Alles ist wieder zurückgestellt.",
        "car.title": "Energy Joe fragt",
        "car.which": "Welches Auto hängt an der Wallbox „{point}“? Bis ich es weiß, lasse ich die Wallbox in Ruhe.",
        "car.hint": "Antworten kannst du auch im Panel unter Übersicht.",
        "car.guest": "Gast / anderes Auto",
        "car.not_plugged.title": "Energy Joe: Auto einstecken?",
        "car.not_plugged": "{car} braucht morgen {km} km, steckt aber nicht.",
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
        "problem.battery_transfer": "{charging} charges while {discharging} discharges, for more than two minutes, although I let only one of them work at a time. Please have a look in the panel under Devices › Batteries › Several batteries.",
        "morning.title": "Energy Joe: the night",
        "morning.text": "I steered tonight: {batteries}. Everything is back as it was.",
        "car.title": "Energy Joe asks",
        "car.which": "Which car is plugged into the wallbox “{point}”? Until I know, I leave the wallbox alone.",
        "car.hint": "You can also answer in the panel under Overview.",
        "car.guest": "Guest / other car",
        "car.not_plugged.title": "Energy Joe: plug in the car?",
        "car.not_plugged": "{car} needs {km} km tomorrow but is not plugged in.",
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
        # The answer to "which car is plugged in?" (set by the runtime).
        self.on_car: Callable[[str, str], Awaitable[None]] | None = None

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

    async def async_which_car(
        self, point_id: str, point: str, cars: list[tuple[str, str]]
    ) -> None:
        """Ask which car is plugged into a charge point (notification and phone)."""
        message = self._text("car.which", point=point)
        tag = f"{DOMAIN}_car_{point_id}"
        persistent_notification.async_create(
            self._hass,
            f"{message}\n\n{self._text('car.hint')}",
            self._text("car.title"),
            tag,
        )
        notify = self._config()["notify"]
        if not notify["service"] or not notify.get("cars", True):
            return
        choices = [*cars, ("guest", self._text("car.guest"))]
        data: dict[str, Any] = {"tag": tag}
        if len(choices) <= MAX_BUTTONS:
            data["actions"] = [
                {"action": f"{CAR_ANSWER}::{point_id}::{car}", "title": name}
                for car, name in choices
            ]
        await self._push(self._text("car.title"), message, data)

    @callback
    def clear_which_car(self, point_id: str) -> None:
        persistent_notification.async_dismiss(self._hass, f"{DOMAIN}_car_{point_id}")

    async def async_not_plugged(self, car_id: str, car: str, km: int) -> None:
        """In the evening: tomorrow needs charging, but the car is not plugged in."""
        message = self._text("car.not_plugged", car=car, km=km)
        tag = f"{DOMAIN}_unplugged_{car_id}"
        persistent_notification.async_create(
            self._hass, message, self._text("car.not_plugged.title"), tag
        )
        notify = self._config()["notify"]
        if notify["service"] and notify.get("cars", True):
            await self._push(self._text("car.not_plugged.title"), message, {"tag": tag})

    @callback
    def clear_not_plugged(self, car_id: str) -> None:
        persistent_notification.async_dismiss(
            self._hass, f"{DOMAIN}_unplugged_{car_id}"
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
        elif isinstance(action, str) and action.startswith(f"{CAR_ANSWER}::"):
            parts = action.split("::")
            if len(parts) == 3 and self.on_car is not None:
                try:
                    await self.on_car(parts[1], parts[2])
                except ValueError:
                    _LOGGER.warning("Unknown answer from a phone: %s", action)
