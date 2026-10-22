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
        "problem.automations": "Deine Automationen {names} schreiben auf deine Speicher und spucken mir in die Suppe: Sie können überschreiben, was ich setze. Ich fasse sie nicht an – besser schaltest du sie aus. Die Liste steht im Panel unter Geräte › Speicher.",
        "problem.release_failed": "Ich konnte nicht alle Werte zurückstellen: {entities}. Ich versuche es weiter – schau bitte im Panel unter Geräte nach.",
        "problem.not_restored.stop": "Diese Werte konnte ich nicht zurückstellen, als ich angehalten wurde: {values}. Sobald ich wieder laufe, versuche ich es erneut – bleibe ich aus, stelle sie bitte selbst zurück.",
        "problem.not_restored.remove": "Diese Werte konnte ich nicht zurückstellen, bevor ich entfernt wurde: {values}. Bitte stelle sie selbst zurück.",
        "problem.control_failed": "Beim Steuern von {battery} hat etwas nicht geklappt ({code}). Ich lasse den Speicher für heute Nacht in Ruhe.",
        "problem.no_progress": "{battery} soll laden, der Ladestand steigt aber seit einer halben Stunde nicht. Schau bitte nach, ob der Speicher Netzladen erlaubt – im Panel unter Geräte hilft ein Testlauf.",
        "problem.charge_slow": "{battery} lädt nachts nur mit {measured} kW statt {planned} kW. Vermutlich lässt dein Wechselrichter übers Hochsetzen der Reserve nur wenig Netzladen zu. Was du tun kannst: Schau in den Einstellungen des Wechselrichters nach, ob das Laden aus dem Netz erlaubt ist und mit wie viel Leistung. Bis es schneller geht, plane ich ihn mit {measured} kW.",
        "problem.charge_slow_fronius": "{battery} lädt nachts nur mit {measured} kW statt {planned} kW. Vermutlich lässt dein Wechselrichter übers Hochsetzen der Reserve nur wenig Netzladen zu. Was du tun kannst: Prüf im Fronius-Wechselrichter unter Energiemanagement › Batteriemanagement, ob „Batterieladung aus dem Netz“ zugelassen ist – und ob dort nur eine kleine Leistung eingetragen ist. Bis es schneller geht, plane ich ihn mit {measured} kW.",
        "problem.battery_transfer": "{charging} lädt, während {discharging} entlädt – auch nachdem ich die Regelung neu gestartet und den Speicher kurz gesperrt habe. Schau bitte im Panel unter Geräte › Speicher › Mehrere Speicher nach.",
        "problem.battery_transfer_inside": "{charging} lädt, während {discharging} entlädt – beide regelt dasselbe System. Da greife ich nicht ein: Schau bitte in dessen Einstellungen nach (im Panel unter Geräte › Speicher › Mehrere Speicher steht, wann es war).",
        "problem.stuck_reserve": "{battery} kann nicht entladen: Die Reserve „{entity}“ steht auf {value} %, der Stand bei {soc} %. Das habe ich nicht gesetzt, also stelle ich es nicht zurück. Setz die Reserve wieder auf deinen Wert – oder trag {value} % als Entladegrenze des Speichers bei mir ein, wenn das so gewollt ist, dann bin ich still.",
        "problem.stuck_discharge": "{battery} kann nicht entladen: Am Gerät ist das Entladen gesperrt („{entity}“ steht auf {value}), und das war nicht ich. Schau nach, wer das gesetzt hat – eine Automation, ein Skript, der Wechselrichter selbst – und gib es frei, wenn es nicht so gewollt ist.",
        "problem.stuck_charge": "{battery} kann nicht laden: Am Gerät ist das Laden gesperrt („{entity}“ steht auf {value}), und das war nicht ich. Schau nach, wer das gesetzt hat – eine Automation, ein Skript, der Wechselrichter selbst – und gib es frei, wenn es nicht so gewollt ist.",
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
        "problem.automations": "Your automations {names} write to your batteries and spit in my soup: they can overwrite what I set. I do not touch them – better switch them off. The list is in the panel under Devices › Batteries.",
        "problem.release_failed": "I could not put all values back: {entities}. I keep trying – please have a look in the panel under Devices.",
        "problem.not_restored.stop": "I could not put these values back when I stopped: {values}. Once I run again I try again – if I stay off, please put them back yourself.",
        "problem.not_restored.remove": "I could not put these values back before I was removed: {values}. Please put them back yourself.",
        "problem.control_failed": "Something went wrong steering {battery} ({code}). I leave this battery alone tonight.",
        "problem.no_progress": "{battery} should charge, but its level has not risen for half an hour. Please check whether the battery allows charging from the grid – a test run under Devices in the panel helps.",
        "problem.charge_slow": "{battery} charges at only {measured} kW at night instead of {planned} kW. Your inverter probably allows little charging from the grid when I raise its reserve. What you can do: check in the inverter's settings whether charging from the grid is allowed, and with how much power. Until it gets faster, I plan it at {measured} kW.",
        "problem.charge_slow_fronius": "{battery} charges at only {measured} kW at night instead of {planned} kW. Your inverter probably allows little charging from the grid when I raise its reserve. What you can do: in the Fronius inverter under Energy management › Battery management, check whether “Battery charging from the grid” is permitted – and whether only a small power is set there. Until it gets faster, I plan it at {measured} kW.",
        "problem.battery_transfer": "{charging} charges while {discharging} discharges, even after I restarted the battery's own control and blocked it for a few seconds. Please have a look in the panel under Devices › Batteries › Several batteries.",
        "problem.battery_transfer_inside": "{charging} charges while {discharging} discharges – both are regulated by the same system. I do not step in there: please check that system's settings (the panel shows when it happened under Devices › Batteries › Several batteries).",
        "problem.stuck_reserve": "{battery} cannot discharge: its reserve “{entity}” is at {value} %, its level at {soc} %. I did not set that, so I do not put it back. Set the reserve back to your value – or enter {value} % as the battery's discharge floor in my settings if that is what you want, then I keep quiet.",
        "problem.stuck_discharge": "{battery} cannot discharge: discharging is blocked at the device (“{entity}” is {value}), and that was not me. Check who set it – an automation, a script, the inverter itself – and free it if it is not meant so.",
        "problem.stuck_charge": "{battery} cannot charge: charging is blocked at the device (“{entity}” is {value}), and that was not me. Check who set it – an automation, a script, the inverter itself – and free it if it is not meant so.",
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
        # The owner's language as the panel last showed it (the runtime keeps
        # it); None: Home Assistant's.
        self.language: Callable[[], str | None] | None = None

    def start(self) -> None:
        if self._unsub is None:
            self._unsub = self._hass.bus.async_listen(ACTION_EVENT, self._on_action)

    def stop(self) -> None:
        if self._unsub:
            self._unsub()
            self._unsub = None

    def _text(self, key: str, **values: Any) -> str:
        chosen = self.language() if self.language else None
        language = (
            "de"
            if (chosen or self._hass.config.language or "en").startswith("de")
            else "en"
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

    async def async_problem(
        self, kind: str, tag: str | None = None, **values: Any
    ) -> None:
        """Tell about a problem: notification, repair issue and, if wanted,
        the phone. `tag` tells problems of one kind apart (one per battery);
        a battery held back by its own settings ("stuck_*") goes to the phone
        only with its own switch."""
        if "entities" in values:
            values["entities"] = ", ".join(values["entities"])
        tag = tag or kind
        message = self._text(f"problem.{kind}", **values)
        persistent_notification.async_create(
            self._hass, message, self._text("problem.title"), f"{DOMAIN}_{tag}"
        )
        ir.async_create_issue(
            self._hass,
            DOMAIN,
            tag,
            is_fixable=False,
            severity=ir.IssueSeverity.WARNING,
            translation_key=kind,
            translation_placeholders={k: str(v) for k, v in values.items()},
        )
        notify = self._config()["notify"]
        wanted = (
            notify.get("stuck", True)
            if kind.startswith("stuck_")
            else notify["problems"]
        )
        if notify["service"] and wanted:
            await self._push(
                self._text("problem.title"), message, {"tag": f"{DOMAIN}_{tag}"}
            )

    async def async_not_restored(self, values: dict[str, Any], removed: bool) -> None:
        """Joe stopped (or was removed) with values he could not put back: the
        owner gets them in a notification, with the value each should have."""

        def line(entity_id: str, value: Any) -> str:
            state = self._hass.states.get(entity_id)
            name = state.name if state else entity_id
            return f"„{name}“ ({entity_id}) → {value}"

        text = self._text(
            "problem.not_restored.remove" if removed else "problem.not_restored.stop",
            values="; ".join(line(k, v) for k, v in values.items()),
        )
        persistent_notification.async_create(
            self._hass, text, self._text("problem.title"), f"{DOMAIN}_not_restored"
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
