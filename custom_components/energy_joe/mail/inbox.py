"""The cars' mailboxes: invitations become trips in Joe's calendar for the car.

A car whose mailbox has no calendar (web.de, GMX, Gmail, ...) gets Joe's
calendar instead. Every few minutes Joe looks for new mail in each such
mailbox. An invitation counts when its sender is on the car's list of who
may invite; new and changed appointments go into Joe's calendar for the car
and Joe accepts them if wanted; cancellations remove them. The password
lives in its own store, never in the configuration or the diagnostics.
"""

from __future__ import annotations

from collections.abc import Callable
from datetime import datetime, timedelta
import logging
from typing import Any

from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from ..const import DOMAIN
from ..plan.car_calendar import CarCalendarStore, as_text, mailbox_cars
from .ical import Invitation, parse, reply
from .mailbox import Fetched, MailError, check, fetch, send_reply

_LOGGER = logging.getLogger(__name__)

STORE_KEY = f"{DOMAIN}.mailbox"
STORE_VERSION = 1
# What the panel shows of the last invitations (newest first).
RECENT = 20
INTERVAL = timedelta(minutes=5)


def allowed(rules: list[str], *addresses: str | None) -> bool:
    """Whether one of the addresses may invite: an exact address or "@domain"."""
    for address in addresses:
        if not address:
            continue
        address = address.lower()
        domain = address.rpartition("@")[2]
        for rule in rules:
            rule = rule.strip().lower()
            if not rule:
                continue
            bare = rule.lstrip("@")
            if rule == address or ("@" not in bare and bare == domain):
                return True
    return False


def trusted(rules: list[str], sender: str, organizer: str | None) -> bool:
    """Whether a mail may bring an invitation.

    The sender must be allowed. The organizer written in the invitation is
    easy to fake, so it only counts when the mail comes from its domain (a
    colleague's assistant sending for them).
    """
    if allowed(rules, sender):
        return True
    if not organizer or not allowed(rules, organizer):
        return False
    return sender.rpartition("@")[2].lower() == organizer.rpartition("@")[2].lower()


def invited_as(address: str, attendees: list[str]) -> str:
    """The address the car was invited with: its own or a plus address of it."""
    address = address.lower()
    local, _, domain = address.partition("@")
    for candidate in attendees:
        if candidate == address or (
            candidate.endswith("@" + domain) and candidate.startswith(local + "+")
        ):
            return candidate
    return address


class CarInboxes:
    """Looks for invitations in each car's mailbox and fills Joe's calendars."""

    def __init__(
        self,
        hass: HomeAssistant,
        config: Callable[[], dict[str, Any]],
        calendars: CarCalendarStore,
        changed: Callable[[], None],
    ) -> None:
        self._hass = hass
        self._config = config
        self._calendars = calendars
        self._changed = changed
        self._store: Store[dict[str, Any]] = Store(hass, STORE_VERSION, STORE_KEY)
        # Per car: password, the mailbox's UIDVALIDITY and last uid, the last
        # invitations and when Joe last looked.
        self._data: dict[str, dict[str, Any]] = {}
        self._unsub: CALLBACK_TYPE | None = None
        self._active: set[str] = set()
        self._rules: dict[str, set[str]] = {}
        self._running: set[str] = set()
        self.status: dict[str, dict[str, Any]] = {}

    async def async_load(self) -> None:
        data = await self._store.async_load() or {}
        if "cars" not in data:
            data = self._from_one_mailbox(data)
        # Cars that are gone (or never saved) take their password with them.
        known = {a["id"] for a in self._config()["actions"]}
        self._data = {car: v for car, v in data["cars"].items() if car in known}
        for car in self._data:
            self._set(car, notify=False)

    def _from_one_mailbox(self, data: dict[str, Any]) -> dict[str, Any]:
        """Up to 0.3 one mailbox served all cars: its password goes to the first."""
        cars = [a["id"] for a in mailbox_cars(self._config())]
        if not cars or not data.get("password"):
            return {"cars": {}}
        return {"cars": {cars[0]: {"password": data["password"]}}}

    async def _async_save(self) -> None:
        await self._store.async_save({"cars": self._data})

    async def async_remove(self) -> None:
        self._data = {}
        await self._store.async_remove()

    def _need(self, car: str) -> dict[str, Any] | None:
        action = next((a for a in mailbox_cars(self._config()) if a["id"] == car), None)
        return action["need"] if action else None

    def has_secret(self, car: str) -> bool:
        return bool((self._data.get(car) or {}).get("password"))

    async def async_set_password(self, car: str, password: str | None) -> None:
        """A new password; None removes it."""
        entry = self._data.setdefault(car, {})
        entry["password"] = password or None
        # Another mailbox maybe: read it from the start.
        entry.pop("validity", None)
        entry.pop("last_uid", None)
        await self._async_save()
        self._set(car)
        await self.async_check(car)

    # --- schedule ------------------------------------------------------------

    @callback
    def async_apply(self) -> None:
        """Look every few minutes while a car reads its mailbox."""
        cars = {a["id"] for a in mailbox_cars(self._config())}
        new = cars - self._active
        self._active = cars
        if cars and self._unsub is None:
            self._unsub = async_track_time_interval(self._hass, self._on_tick, INTERVAL)
        elif not cars and self._unsub is not None:
            self._unsub()
            self._unsub = None
        for car in set(self.status) - cars:
            self.status.pop(car, None)
        for car in cars:
            rules = set((self._need(car) or {}).get("allowed") or [])
            if car in self._rules and rules - self._rules[car]:
                # Someone may invite now: read the mailbox again from the start
                # (what Joe has already is not answered twice).
                (self._data.get(car) or {}).pop("last_uid", None)
                new.add(car)
            self._rules[car] = rules
            self._set(car, notify=False)
        self._changed()
        for car in new:
            self._hass.async_create_task(self.async_check(car), eager_start=False)

    @callback
    def async_stop(self) -> None:
        if self._unsub:
            self._unsub()
            self._unsub = None
        self._active = set()

    @callback
    def _on_tick(self, now: datetime) -> None:
        self._hass.async_create_task(self.async_check(), eager_start=False)

    def _set(self, car: str, notify: bool = True, **changes: Any) -> None:
        previous = self.status.get(car, {})
        state = (
            "off"
            if self._need(car) is None
            else "no_secret"
            if not self.has_secret(car)
            else changes.pop("state", previous.get("state") or "waiting")
        )
        if state in ("off", "no_secret"):
            changes.pop("state", None)
        entry = self._data.get(car) or {}
        self.status[car] = {
            **previous,
            **changes,
            "state": state,
            "has_secret": self.has_secret(car),
            "recent": entry.get("recent", []),
            "checked": entry.get("checked"),
        }
        if notify:
            self._changed()

    # --- looking -------------------------------------------------------------

    async def async_test(self, car: str) -> str | None:
        """Log in once to IMAP and SMTP; None if both work, else an error code."""
        need = self._need(car)
        if need is None:
            return "no_mailbox"
        if not self.has_secret(car):
            return "no_secret"
        try:
            await self._hass.async_add_executor_job(
                check, need["mailbox"], self._data[car]["password"]
            )
        except MailError as err:
            return err.code
        return None

    async def async_check(self, car: str | None = None) -> None:
        """Look for new invitations now (in one car's mailbox or in all)."""
        cars = [car] if car else [a["id"] for a in mailbox_cars(self._config())]
        for one in cars:
            await self._async_check(one)

    async def _async_check(self, car: str) -> None:
        need = self._need(car)
        if car in self._running or need is None or not self.has_secret(car):
            self._set(car)
            return
        entry = self._data[car]
        self._running.add(car)
        try:
            found, validity, highest = await self._hass.async_add_executor_job(
                fetch,
                need["mailbox"],
                entry["password"],
                entry.get("last_uid"),
                entry.get("validity"),
            )
        except MailError as err:
            _LOGGER.debug("Mailbox of %s not reachable: %s", car, err)
            self._running.discard(car)
            self._set(car, state="error", error=err.code)
            return
        except Exception:
            _LOGGER.exception("Looking for invitations failed")
            self._running.discard(car)
            self._set(car, state="error", error="unknown")
            return
        try:
            for message in found:
                for text in message.calendars:
                    for invitation in parse(text):
                        await self._async_handle(car, need, message, invitation)
        finally:
            self._running.discard(car)
        entry["validity"] = validity
        entry["last_uid"] = highest
        entry["checked"] = dt_util.now().isoformat(timespec="seconds")
        await self._async_save()
        self._set(car, state="ok", error=None)

    async def _async_handle(
        self,
        car: str,
        need: dict[str, Any],
        message: Fetched,
        invitation: Invitation,
    ) -> None:
        settings = need["mailbox"]
        entry: dict[str, Any] = {
            "at": dt_util.now().isoformat(timespec="seconds"),
            "summary": invitation.summary,
            "start": as_text(invitation.start) if invitation.start else None,
            "from": message.sender,
            "organizer": invitation.organizer,
            "method": invitation.method,
        }
        if not trusted(need["allowed"], message.sender, invitation.organizer):
            self._remember(car, {**entry, "result": "not_allowed"})
            return
        known = self._calendars.get(car, invitation.uid)
        if invitation.method == "CANCEL" or invitation.status == "CANCELLED":
            if known:
                self._calendars.delete(car, invitation.uid)
                self._remember(car, {**entry, "result": "cancelled"})
            return
        if invitation.start is None or invitation.end is None:
            self._remember(car, {**entry, "result": "no_time"})
            return
        if known and int(known.get("sequence") or 0) > invitation.sequence:
            return  # an older version of something Joe already has
        newer = not known or invitation.sequence > int(known.get("sequence") or 0)
        accepted = bool(known and known.get("accepted")) and not newer
        event = self._calendars.add(
            car,
            {
                "uid": invitation.uid,
                "summary": invitation.summary,
                "start": as_text(invitation.start),
                "end": as_text(invitation.end),
                "location": invitation.location,
                "description": invitation.description,
                "source": "mail",
                "sequence": invitation.sequence,
                "organizer": invitation.organizer,
                "accepted": accepted,
            },
        )
        result = "updated" if known else "added"
        if (
            settings["accept"]
            and invitation.method == "REQUEST"
            and invitation.organizer
            and not accepted
        ):
            attendee = invited_as(settings["address"], invitation.attendees)
            try:
                await self._hass.async_add_executor_job(
                    send_reply,
                    settings,
                    self._data[car]["password"],
                    invitation.organizer,
                    f"Zugesagt: {invitation.summary}".strip(),
                    reply(invitation, attendee),
                )
                self._calendars.update(car, event["uid"], {"accepted": True})
                result += "_accepted"
            except MailError as err:
                _LOGGER.debug("Accepting failed: %s", err)
                result += "_not_accepted"
        self._remember(car, {**entry, "result": result})

    def _remember(self, car: str, entry: dict[str, Any]) -> None:
        data = self._data.setdefault(car, {})
        data["recent"] = [entry, *data.get("recent", [])][:RECENT]
