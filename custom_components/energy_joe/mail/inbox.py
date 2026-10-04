"""Joe's inbox: invitations to a car's address become trips in its calendar.

Every few minutes Joe looks for new mail. An invitation counts when its
organizer (or sender) is on the list of who may invite; the invited address
says which car it is for (e.g. "auto+kona@…"). New and changed appointments
go into the car's calendar and Joe accepts them if wanted; cancellations
remove them. The password or token lives in its own store, never in the
configuration or the diagnostics.
"""

from __future__ import annotations

import asyncio
from collections.abc import Callable
from datetime import datetime, timedelta
import logging
from typing import Any

from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from ..const import DOMAIN
from ..plan.car_calendar import CarCalendarStore, as_text
from . import oauth
from .ical import Invitation, parse, reply
from .mailbox import Fetched, MailError, check, fetch, send_reply

_LOGGER = logging.getLogger(__name__)

STORE_KEY = f"{DOMAIN}.mailbox"
STORE_VERSION = 1
# What the panel shows of the last invitations (newest first).
RECENT = 20


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


def which_car(
    cars: dict[str, str], car_ids: list[str], addresses: list[str]
) -> str | None:
    """The car an invitation is for: by its invited address, else the only car."""
    wanted = {a.lower() for a in addresses}
    for car, address in cars.items():
        if car in car_ids and address and address.lower() in wanted:
            return car
    return car_ids[0] if len(car_ids) == 1 else None


class JoeInbox:
    """Looks for invitations and keeps the car calendars up to date."""

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
        self._data: dict[str, Any] = {}
        self._unsub: CALLBACK_TYPE | None = None
        self._interval: int | None = None
        self._running = False
        self._oauth_task: asyncio.Task[None] | None = None
        self.status: dict[str, Any] = {"state": "off"}

    async def async_load(self) -> None:
        self._data = await self._store.async_load() or {}
        self.status = {
            **self.status,
            "recent": self._data.get("recent", []),
            "checked": self._data.get("checked"),
        }

    async def _async_save(self) -> None:
        await self._store.async_save(self._data)

    async def async_remove(self) -> None:
        self._data = {}
        await self._store.async_remove()

    # --- secret --------------------------------------------------------------

    @property
    def has_secret(self) -> bool:
        if self._config()["mailbox"]["provider"] == "microsoft":
            return bool((self._data.get("oauth") or {}).get("refresh_token"))
        return bool(self._data.get("password") or self._data.get("token"))

    async def _async_secret(self) -> dict[str, Any]:
        """The password, or for Microsoft a fresh access token."""
        settings = self._config()["mailbox"]
        if settings["provider"] != "microsoft":
            return {
                "password": self._data.get("password"),
                "token": self._data.get("token"),
            }
        tokens = self._data.get("oauth") or {}
        if not oauth.fresh(tokens):
            try:
                tokens = await oauth.refresh(
                    async_get_clientsession(self._hass),
                    settings["tenant"],
                    settings["client_id"] or "",
                    tokens,
                )
            except oauth.OAuthError as err:
                raise MailError("login", err.code) from err
            self._data["oauth"] = tokens
            await self._async_save()
        return {"password": None, "token": tokens.get("access_token")}

    # --- signing in with Microsoft ------------------------------------------

    async def async_oauth_start(self) -> dict[str, Any]:
        """Ask Microsoft for a sign-in code; Joe waits in the background."""
        settings = self._config()["mailbox"]
        if not settings["client_id"]:
            raise MailError("no_client_id")
        self._cancel_oauth()
        try:
            found = await oauth.start(
                async_get_clientsession(self._hass),
                settings["tenant"],
                settings["client_id"],
            )
        except oauth.OAuthError as err:
            self._set_status(oauth={"state": "error", "error": err.code})
            raise MailError("oauth", err.code) from err
        expires = dt_util.now() + timedelta(seconds=int(found.get("expires_in") or 900))
        info = {
            "state": "waiting",
            "user_code": found.get("user_code"),
            "uri": found.get("verification_uri") or "https://microsoft.com/devicelogin",
            "expires": expires.isoformat(timespec="seconds"),
        }
        self._set_status(oauth=info)
        self._oauth_task = self._hass.async_create_background_task(
            self._async_wait_for_sign_in(
                settings,
                str(found["device_code"]),
                int(found.get("interval") or 5),
                expires,
            ),
            "energy_joe microsoft sign-in",
        )
        return info

    async def _async_wait_for_sign_in(
        self,
        settings: dict[str, Any],
        device_code: str,
        interval: int,
        until: datetime,
    ) -> None:
        session = async_get_clientsession(self._hass)
        while dt_util.now() < until:
            await asyncio.sleep(interval)
            try:
                tokens = await oauth.poll(
                    session,
                    settings["tenant"],
                    settings["client_id"] or "",
                    device_code,
                )
            except oauth.OAuthError as err:
                if err.code == "authorization_pending":
                    continue
                if err.code == "slow_down":
                    interval += 5
                    continue
                self._set_status(oauth={"state": "error", "error": err.code})
                return
            self._data["oauth"] = tokens
            self._data.pop("validity", None)
            self._data.pop("last_uid", None)
            await self._async_save()
            self._set_status(oauth={"state": "ok"})
            await self.async_check()
            return
        self._set_status(oauth={"state": "error", "error": "expired_token"})

    def _cancel_oauth(self) -> None:
        task = self._oauth_task
        if task is not None and not task.done():
            task.cancel()
        self._oauth_task = None

    async def async_sign_out(self) -> None:
        """Forget the Microsoft sign-in."""
        self._cancel_oauth()
        self._data.pop("oauth", None)
        await self._async_save()
        self._set_status(oauth=None)

    async def async_set_secret(
        self, password: str | None = None, token: str | None = None
    ) -> None:
        """A new password (app password) or OAuth token; None removes it."""
        self._data["password"] = password or None
        self._data["token"] = token or None
        # Another mailbox maybe: read it from the start.
        self._data.pop("validity", None)
        self._data.pop("last_uid", None)
        await self._async_save()
        self._set_status()
        await self.async_check()

    # --- schedule ------------------------------------------------------------

    @callback
    def async_apply(self) -> None:
        """Start, stop or reschedule after a change of the settings."""
        settings = self._config()["mailbox"]
        interval = settings["interval_min"] if settings["enabled"] else None
        if interval == self._interval and (self._unsub is not None) == bool(interval):
            self._set_status()
            return
        self.async_stop()
        self._interval = interval
        if interval:
            self._unsub = async_track_time_interval(
                self._hass, self._on_tick, timedelta(minutes=interval)
            )
            self._hass.async_create_task(self.async_check(), eager_start=False)
        self._set_status()

    @callback
    def async_stop(self) -> None:
        self._cancel_oauth()
        if self._unsub:
            self._unsub()
            self._unsub = None
        self._interval = None

    @callback
    def _on_tick(self, now: datetime) -> None:
        self._hass.async_create_task(self.async_check(), eager_start=False)

    def _set_status(self, **changes: Any) -> None:
        settings = self._config()["mailbox"]
        state = (
            "off"
            if not settings["enabled"]
            else "no_secret"
            if not self.has_secret
            else changes.pop("state", self.status.get("state") or "waiting")
        )
        if state in ("off", "no_secret"):
            changes.pop("state", None)
        self.status = {
            **self.status,
            **changes,
            "state": state,
            "has_secret": self.has_secret,
            "recent": self._data.get("recent", []),
        }
        self._changed()

    # --- looking -------------------------------------------------------------

    async def async_test(self) -> str | None:
        """Log in once to IMAP and SMTP; None if both work, else an error code."""
        settings = self._config()["mailbox"]
        if not self.has_secret:
            return "no_secret"
        try:
            secret = await self._async_secret()
            await self._hass.async_add_executor_job(check, settings, secret)
        except MailError as err:
            return err.code
        return None

    async def async_check(self) -> None:
        """Look for new invitations now."""
        settings = self._config()["mailbox"]
        if self._running or not settings["enabled"] or not self.has_secret:
            self._set_status()
            return
        self._running = True
        try:
            secret = await self._async_secret()
            found, validity, highest = await self._hass.async_add_executor_job(
                fetch,
                settings,
                secret,
                self._data.get("last_uid"),
                self._data.get("validity"),
            )
        except MailError as err:
            _LOGGER.debug("Mailbox not reachable: %s", err)
            self._running = False
            self._set_status(state="error", error=err.code)
            return
        except Exception:
            _LOGGER.exception("Looking for invitations failed")
            self._running = False
            self._set_status(state="error", error="unknown")
            return
        try:
            for message in found:
                for text in message.calendars:
                    for invitation in parse(text):
                        await self._async_handle(settings, message, invitation)
        finally:
            self._running = False
        self._data["validity"] = validity
        self._data["last_uid"] = highest
        self._data["checked"] = dt_util.now().isoformat(timespec="seconds")
        await self._async_save()
        self._set_status(state="ok", error=None, checked=self._data["checked"])

    async def _async_handle(
        self, settings: dict[str, Any], message: Fetched, invitation: Invitation
    ) -> None:
        cars = [
            a["id"]
            for a in self._config()["actions"]
            if a["kind"] == "switch" and (a.get("need") or {}).get("enabled")
        ]
        entry: dict[str, Any] = {
            "at": dt_util.now().isoformat(timespec="seconds"),
            "summary": invitation.summary,
            "start": as_text(invitation.start) if invitation.start else None,
            "from": message.sender,
            "organizer": invitation.organizer,
            "method": invitation.method,
        }
        if not trusted(settings["allowed"], message.sender, invitation.organizer):
            self._remember({**entry, "result": "not_allowed"})
            return
        car = which_car(
            settings["cars"], cars, [*invitation.attendees, *message.recipients]
        )
        known = self._calendars.find(invitation.uid)
        if invitation.method == "CANCEL" or invitation.status == "CANCELLED":
            if known:
                self._calendars.delete(known[0], invitation.uid)
                self._remember({**entry, "car": known[0], "result": "cancelled"})
            return
        if car is None:
            self._remember({**entry, "result": "no_car"})
            return
        if invitation.start is None or invitation.end is None:
            self._remember({**entry, "car": car, "result": "no_time"})
            return
        if known and int(known[1].get("sequence") or 0) > invitation.sequence:
            return  # an older version of something Joe already has
        if known and known[0] != car:
            self._calendars.delete(known[0], invitation.uid)
        newer = not known or invitation.sequence > int(known[1].get("sequence") or 0)
        accepted = bool(known and known[1].get("accepted")) and not newer
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
            attendee = self._attendee(settings, car, invitation, message)
            try:
                secret = await self._async_secret()
                await self._hass.async_add_executor_job(
                    send_reply,
                    settings,
                    secret,
                    invitation.organizer,
                    f"Zugesagt: {invitation.summary}".strip(),
                    reply(invitation, attendee),
                )
                self._calendars.update(car, event["uid"], {"accepted": True})
                result += "_accepted"
            except MailError as err:
                _LOGGER.debug("Accepting failed: %s", err)
                result += "_not_accepted"
        self._remember({**entry, "car": car, "result": result})

    @staticmethod
    def _attendee(
        settings: dict[str, Any], car: str, invitation: Invitation, message: Fetched
    ) -> str:
        """The address that was invited (so the organizer sees who accepted)."""
        mine = (settings["cars"].get(car) or "").lower()
        if mine and mine in invitation.attendees:
            return mine
        address = (settings.get("address") or "").lower()
        local, _, domain = address.partition("@")
        for candidate in invitation.attendees:
            if candidate == address or (
                candidate.endswith("@" + domain) and candidate.startswith(local + "+")
            ):
                return candidate
        return mine or address

    def _remember(self, entry: dict[str, Any]) -> None:
        recent = [entry, *self._data.get("recent", [])][:RECENT]
        self._data["recent"] = recent
