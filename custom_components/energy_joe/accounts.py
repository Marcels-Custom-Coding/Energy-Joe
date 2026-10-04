"""A car's mailbox with a calendar: Google, Microsoft, iCloud, Infomaniak, CalDAV.

These providers put invitations into the account's calendar by themselves,
so Joe only reads that calendar and accepts invitations from allowed senders
there: Google and Microsoft through their calendar APIs with a sign-in,
iCloud, Infomaniak and other CalDAV servers with an app password. Invitations from
anyone else that nobody answered do not count as trips. Passwords and tokens
live in their own store per car, never in the configuration.
"""

from __future__ import annotations

import asyncio
import base64
from collections.abc import Callable
from datetime import datetime, timedelta
import logging
from typing import Any
from urllib.parse import quote, urljoin
from xml.etree import ElementTree

from aiohttp import ClientError, ClientSession

from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import DOMAIN
from .mail import oauth
from .mail.ical import parse
from .mail.inbox import allowed
from .plan.car_calendar import as_text

_LOGGER = logging.getLogger(__name__)

STORE_KEY = f"{DOMAIN}.accounts"
STORE_VERSION = 1
GRAPH = "https://graph.microsoft.com/v1.0"
GOOGLE = "https://www.googleapis.com/calendar/v3/calendars/primary/events"
CALDAV_SERVERS = {
    "icloud": "https://caldav.icloud.com/",
    "infomaniak": "https://sync.infomaniak.com/",
}
MICROSOFT = ("outlook", "microsoft")
# Kinds that sign in with a code instead of a password.
SIGN_IN = (*MICROSOFT, "google")
TIMEOUT = 30
# A day's appointments are asked again after this long.
CACHE = timedelta(minutes=10)
NS = {"d": "DAV:", "c": "urn:ietf:params:xml:ns:caldav"}


def basic_auth(user: str, password: str) -> str:
    """The Authorization header for user name and (app) password."""
    token = base64.b64encode(f"{user}:{password}".encode()).decode()
    return f"Basic {token}"


class AccountError(Exception):
    """The account could not be read ("login", "connect", "no_calendar", ...)."""

    def __init__(self, code: str, detail: str = "") -> None:
        super().__init__(f"{code}: {detail}")
        self.code = code
        self.detail = detail


# --- Microsoft Graph ---------------------------------------------------------


def _graph_time(value: dict[str, Any] | None, all_day: bool) -> str | None:
    """Graph's {"dateTime": "...0000000", "timeZone": "UTC"} as Joe's text."""
    if not value or not value.get("dateTime"):
        return None
    moment = datetime.fromisoformat(value["dateTime"][:19]).replace(tzinfo=dt_util.UTC)
    if all_day:
        return moment.date().isoformat()
    return as_text(moment)


async def graph_events(
    session: ClientSession, token: str, start: datetime, end: datetime
) -> list[dict[str, Any]]:
    """The appointments of a span from the signed-in account's calendar."""
    params = {
        "startDateTime": dt_util.as_utc(start).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "endDateTime": dt_util.as_utc(end).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "$select": "id,iCalUId,subject,start,end,location,isAllDay,isCancelled,"
        "responseStatus,organizer,isOrganizer",
        "$top": "100",
    }
    headers = {
        "Authorization": f"Bearer {token}",
        "Prefer": 'outlook.timezone="UTC"',
    }
    try:
        async with session.get(
            f"{GRAPH}/me/calendarView", params=params, headers=headers, timeout=TIMEOUT
        ) as response:
            if response.status in (401, 403):
                raise AccountError("login", str(response.status))
            body = await response.json(content_type=None)
    except (ClientError, TimeoutError, ValueError) as err:
        raise AccountError("connect", str(err)) from err
    found = []
    for item in (body or {}).get("value") or []:
        if item.get("isCancelled"):
            continue
        all_day = bool(item.get("isAllDay"))
        begin = _graph_time(item.get("start"), all_day)
        finish = _graph_time(item.get("end"), all_day)
        if not begin or not finish:
            continue
        found.append(
            {
                "uid": item.get("iCalUId") or item.get("id"),
                "id": item.get("id"),
                "summary": item.get("subject") or "",
                "start": begin,
                "end": finish,
                "location": ((item.get("location") or {}).get("displayName") or ""),
                "organizer": (
                    ((item.get("organizer") or {}).get("emailAddress") or {}).get(
                        "address"
                    )
                    or ""
                ).lower(),
                "pending": not item.get("isOrganizer")
                and (item.get("responseStatus") or {}).get("response")
                in ("none", "notResponded"),
            }
        )
    return found


async def graph_accept(session: ClientSession, token: str, event_id: str) -> None:
    try:
        async with session.post(
            f"{GRAPH}/me/events/{quote(event_id, safe='')}/accept",
            json={"sendResponse": True},
            headers={"Authorization": f"Bearer {token}"},
            timeout=TIMEOUT,
        ) as response:
            if response.status >= 400:
                raise AccountError("accept", str(response.status))
    except (ClientError, TimeoutError) as err:
        raise AccountError("connect", str(err)) from err


# --- Google Calendar ---------------------------------------------------------


def _google_time(value: dict[str, Any] | None) -> str | None:
    """Google's {"dateTime": …} or {"date": …} as Joe's text."""
    if not value:
        return None
    if value.get("date"):
        return str(value["date"])
    moment = dt_util.parse_datetime(value.get("dateTime") or "")
    return as_text(moment) if moment else None


async def google_events(
    session: ClientSession, token: str, start: datetime, end: datetime
) -> list[dict[str, Any]]:
    """The appointments of a span from the signed-in account's main calendar."""
    params = {
        "timeMin": dt_util.as_utc(start).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "timeMax": dt_util.as_utc(end).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "singleEvents": "true",
        "maxResults": "100",
    }
    try:
        async with session.get(
            GOOGLE,
            params=params,
            headers={"Authorization": f"Bearer {token}"},
            timeout=TIMEOUT,
        ) as response:
            if response.status in (401, 403):
                raise AccountError("login", str(response.status))
            body = await response.json(content_type=None)
    except (ClientError, TimeoutError, ValueError) as err:
        raise AccountError("connect", str(err)) from err
    found = []
    for item in (body or {}).get("items") or []:
        begin = _google_time(item.get("start"))
        finish = _google_time(item.get("end"))
        if item.get("status") == "cancelled" or not begin or not finish:
            continue
        attendees = item.get("attendees") or []
        me = next((a for a in attendees if a.get("self")), None)
        organizer = item.get("organizer") or {}
        found.append(
            {
                "uid": item.get("iCalUID") or item.get("id"),
                "id": item.get("id"),
                "summary": item.get("summary") or "",
                "start": begin,
                "end": finish,
                "location": item.get("location") or "",
                "organizer": (organizer.get("email") or "").lower(),
                "attendees": attendees,
                "pending": me is not None
                and not organizer.get("self")
                and me.get("responseStatus") == "needsAction",
            }
        )
    return found


async def google_accept(
    session: ClientSession, token: str, event: dict[str, Any]
) -> None:
    """Set the account's own answer to accepted; Google tells the organizer."""
    attendees = [
        {**a, "responseStatus": "accepted"} if a.get("self") else a
        for a in event.get("attendees") or []
    ]
    try:
        async with session.patch(
            f"{GOOGLE}/{quote(str(event['id']), safe='')}",
            params={"sendUpdates": "all"},
            json={"attendees": attendees},
            headers={"Authorization": f"Bearer {token}"},
            timeout=TIMEOUT,
        ) as response:
            if response.status >= 400:
                raise AccountError("accept", str(response.status))
    except (ClientError, TimeoutError) as err:
        raise AccountError("connect", str(err)) from err


# --- CalDAV ------------------------------------------------------------------


async def _dav(
    session: ClientSession,
    method: str,
    url: str,
    auth: str,
    body: str,
    depth: str,
) -> ElementTree.Element:
    try:
        async with session.request(
            method,
            url,
            data=body.encode(),
            headers={
                "Authorization": auth,
                "Depth": depth,
                "Content-Type": "application/xml; charset=utf-8",
            },
            timeout=TIMEOUT,
        ) as response:
            if response.status in (401, 403):
                raise AccountError("login", str(response.status))
            if response.status >= 400:
                raise AccountError("connect", str(response.status))
            text = await response.text()
    except (ClientError, TimeoutError) as err:
        raise AccountError("connect", str(err)) from err
    try:
        return ElementTree.fromstring(text)
    except ElementTree.ParseError as err:
        raise AccountError("connect", "not a CalDAV answer") from err


def _href(root: ElementTree.Element, path: str) -> str | None:
    found = root.find(f".//{path}/d:href", NS)
    return found.text.strip() if found is not None and found.text else None


async def caldav_calendars(session: ClientSession, base: str, auth: str) -> list[str]:
    """The event calendars of the account (principal, home, then its calendars)."""
    principal_query = (
        '<d:propfind xmlns:d="DAV:"><d:prop><d:current-user-principal/>'
        "</d:prop></d:propfind>"
    )
    root = await _dav(session, "PROPFIND", base, auth, principal_query, "0")
    principal = _href(root, "d:current-user-principal")
    if not principal:
        raise AccountError("no_calendar", "no principal")
    home_query = (
        '<d:propfind xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">'
        "<d:prop><c:calendar-home-set/></d:prop></d:propfind>"
    )
    root = await _dav(
        session, "PROPFIND", urljoin(base, principal), auth, home_query, "0"
    )
    home = _href(root, "c:calendar-home-set")
    if not home:
        raise AccountError("no_calendar", "no calendar home")
    home_url = urljoin(urljoin(base, principal), home)
    list_query = (
        '<d:propfind xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">'
        "<d:prop><d:resourcetype/><c:supported-calendar-component-set/></d:prop>"
        "</d:propfind>"
    )
    root = await _dav(session, "PROPFIND", home_url, auth, list_query, "1")
    calendars = []
    for response in root.findall("d:response", NS):
        href = response.findtext("d:href", default="", namespaces=NS).strip()
        if response.find(".//d:resourcetype/c:calendar", NS) is None:
            continue
        components = [c.get("name") for c in response.findall(".//c:comp", NS)]
        if components and "VEVENT" not in components:
            continue
        calendars.append(urljoin(home_url, href))
    if not calendars:
        raise AccountError("no_calendar", "no event calendar")
    return calendars


def _caldav_range(start: datetime, end: datetime) -> str:
    fmt = "%Y%m%dT%H%M%SZ"
    return (
        '<c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">'
        "<d:prop><d:getetag/><c:calendar-data/></d:prop>"
        '<c:filter><c:comp-filter name="VCALENDAR"><c:comp-filter name="VEVENT">'
        f'<c:time-range start="{dt_util.as_utc(start).strftime(fmt)}" '
        f'end="{dt_util.as_utc(end).strftime(fmt)}"/>'
        "</c:comp-filter></c:comp-filter></c:filter></c:calendar-query>"
    )


async def caldav_events(
    session: ClientSession,
    calendars: list[str],
    auth: str,
    address: str,
    start: datetime,
    end: datetime,
) -> list[dict[str, Any]]:
    """The appointments of a span from all event calendars of the account."""
    found = []
    for url in calendars:
        root = await _dav(session, "REPORT", url, auth, _caldav_range(start, end), "1")
        for response in root.findall("d:response", NS):
            text = response.findtext(".//c:calendar-data", default="", namespaces=NS)
            if not text:
                continue
            href = urljoin(url, response.findtext("d:href", default="", namespaces=NS))
            etag = response.findtext(".//d:getetag", default="", namespaces=NS)
            for event in parse(text):
                if event.status == "CANCELLED" or event.start is None:
                    continue
                me = address.lower()
                found.append(
                    {
                        "uid": event.uid,
                        "href": href,
                        "etag": etag,
                        "ics": text,
                        "summary": event.summary,
                        "start": as_text(event.start),
                        "end": as_text(event.end or event.start),
                        "location": event.location,
                        "organizer": event.organizer or "",
                        "pending": bool(me)
                        and me in event.attendees
                        and event.organizer != me
                        and not _accepted(text, me),
                    }
                )
    return found


def _accepted(text: str, address: str) -> bool:
    """Whether the account's own ATTENDEE line already says ACCEPTED."""
    for line in _attendee_lines(text):
        if address in line.lower():
            return "PARTSTAT=ACCEPTED" in line.upper()
    return False


def _attendee_lines(text: str) -> list[str]:
    unfolded = text.replace("\r\n ", "").replace("\n ", "")
    return [
        line for line in unfolded.splitlines() if line.upper().startswith("ATTENDEE")
    ]


def accept_ics(text: str, address: str) -> str:
    """The event with the account's own attendee set to ACCEPTED (servers that
    support CalDAV scheduling then answer the organizer)."""
    unfolded = text.replace("\r\n ", "").replace("\n ", "")
    lines = []
    for line in unfolded.splitlines():
        if line.upper().startswith("ATTENDEE") and address.lower() in line.lower():
            head, _, value = line.partition(":")
            parts = [
                p
                for p in head.split(";")
                if not p.upper().startswith(("PARTSTAT=", "RSVP="))
            ]
            line = ";".join([*parts, "PARTSTAT=ACCEPTED"]) + ":" + value
        lines.append(line)
    return "\r\n".join(lines) + "\r\n"


async def caldav_accept(
    session: ClientSession, auth: str, event: dict[str, Any], address: str
) -> None:
    headers = {"Authorization": auth, "Content-Type": "text/calendar; charset=utf-8"}
    if event.get("etag"):
        headers["If-Match"] = event["etag"]
    try:
        async with session.put(
            event["href"],
            data=accept_ics(event["ics"], address).encode(),
            headers=headers,
            timeout=TIMEOUT,
        ) as response:
            if response.status >= 400:
                raise AccountError("accept", str(response.status))
    except (ClientError, TimeoutError) as err:
        raise AccountError("connect", str(err)) from err


# --- the accounts of all cars ------------------------------------------------


class CarAccounts:
    """Sign-ins, passwords and the appointments of each car's own account."""

    def __init__(
        self,
        hass: HomeAssistant,
        config: Callable[[], dict[str, Any]],
        changed: Callable[[], None],
    ) -> None:
        self._hass = hass
        self._config = config
        self._changed = changed
        self._store: Store[dict[str, Any]] = Store(hass, STORE_VERSION, STORE_KEY)
        self._data: dict[str, dict[str, Any]] = {}
        self._cache: dict[tuple[str, str], tuple[datetime, list[dict[str, Any]]]] = {}
        self._tasks: dict[str, asyncio.Task[None]] = {}
        self.status: dict[str, dict[str, Any]] = {}

    async def async_load(self) -> None:
        self._data = (await self._store.async_load() or {}).get("cars", {})
        for car in self._data:
            self.status[car] = {"has_secret": self._has_secret(car)}

    async def _async_save(self) -> None:
        await self._store.async_save({"cars": self._data})

    async def async_remove(self) -> None:
        self._data = {}
        await self._store.async_remove()

    def async_stop(self) -> None:
        for task in self._tasks.values():
            if not task.done():
                task.cancel()
        self._tasks = {}

    def _need(self, car: str) -> dict[str, Any]:
        action = next((a for a in self._config()["actions"] if a["id"] == car), None)
        return (action or {}).get("need") or {}

    def _account(self, car: str) -> dict[str, Any] | None:
        need = self._need(car)
        return need.get("account") if need.get("source") == "account" else None

    def _has_secret(self, car: str) -> bool:
        """Signed in the way the account's kind needs (a sign-in or a password)."""
        secret = self._data.get(car) or {}
        account = self._account(car) or {}
        if account.get("kind", "outlook") in SIGN_IN:
            return bool((secret.get("oauth") or {}).get("refresh_token"))
        return bool(secret.get("password"))

    def _set(self, car: str, **changes: Any) -> None:
        self.status[car] = {
            **self.status.get(car, {}),
            **changes,
            "has_secret": self._has_secret(car),
        }
        self._changed()

    # --- secrets -------------------------------------------------------------

    async def async_set_password(self, car: str, password: str | None) -> None:
        self._data.setdefault(car, {})["password"] = password or None
        self._data[car].pop("calendars", None)
        self._cache = {k: v for k, v in self._cache.items() if k[0] != car}
        await self._async_save()
        self._set(car, state="waiting", error=None)

    async def async_set_client_secret(self, car: str, secret: str | None) -> None:
        """The secret of one's own Google app (the app id is in the settings)."""
        self._data.setdefault(car, {})["client_secret"] = secret or None
        await self._async_save()
        self._set(car)

    def _sign_in(
        self, car: str, account: dict[str, Any], tokens: dict[str, Any] | None = None
    ) -> oauth.SignIn:
        """The app to sign in (or renew) with: one's own, else Energy Joe's."""
        tokens = tokens or {}
        if account["kind"] == "google":
            own = (account.get("client_id") or "").strip()
            client = tokens.get("client") or own or oauth.JOE_GOOGLE_CLIENT_ID
            secret = (
                (self._data.get(car) or {}).get("client_secret")
                if own and client == own
                else oauth.JOE_GOOGLE_CLIENT_SECRET
            )
            if not client or not secret:
                raise AccountError("no_client_id")
            return oauth.google(client, secret)
        client = tokens.get("client") or oauth.client_for(account.get("client_id"))
        if not client:
            raise AccountError("no_client_id")
        tenant = tokens.get("tenant") or oauth.tenant_for(
            account["kind"], account.get("tenant")
        )
        return oauth.microsoft(tenant, client)

    async def async_sign_in(self, car: str) -> dict[str, Any]:
        """Google or Microsoft: a code to sign in with; Joe waits in the background."""
        account = self._account(car)
        if not account or account["kind"] not in SIGN_IN:
            raise AccountError("no_sign_in")
        sign_in = self._sign_in(car, account)
        session = async_get_clientsession(self._hass)
        try:
            found = await oauth.start(session, sign_in)
        except oauth.OAuthError as err:
            self._set(car, oauth={"state": "error", "error": err.code})
            raise AccountError("oauth", err.code) from err
        until = dt_util.now() + timedelta(seconds=int(found.get("expires_in") or 900))
        info = {
            "state": "waiting",
            "user_code": found.get("user_code"),
            "uri": found.get("verification_uri")
            or (
                "https://www.google.com/device"
                if account["kind"] == "google"
                else "https://microsoft.com/devicelogin"
            ),
            "expires": until.isoformat(timespec="seconds"),
        }
        self._set(car, oauth=info)
        old = self._tasks.pop(car, None)
        if old and not old.done():
            old.cancel()
        self._tasks[car] = self._hass.async_create_background_task(
            self._async_wait(
                car,
                sign_in,
                str(found["device_code"]),
                int(found.get("interval") or 5),
                until,
            ),
            f"energy_joe sign-in {car}",
        )
        return info

    async def _async_wait(
        self,
        car: str,
        sign_in: oauth.SignIn,
        code: str,
        interval: int,
        until: datetime,
    ) -> None:
        session = async_get_clientsession(self._hass)
        while dt_util.now() < until:
            await asyncio.sleep(interval)
            try:
                tokens = await oauth.poll(session, sign_in, code)
            except oauth.OAuthError as err:
                if err.code == "authorization_pending":
                    continue
                if err.code == "slow_down":
                    interval += 5
                    continue
                self._set(car, oauth={"state": "error", "error": err.code})
                return
            self._data.setdefault(car, {})["oauth"] = {
                **tokens,
                "client": sign_in.client_id,
                "tenant": sign_in.tenant,
            }
            await self._async_save()
            self._set(car, oauth={"state": "ok"}, state="waiting", error=None)
            return
        self._set(car, oauth={"state": "error", "error": "expired_token"})

    async def async_sign_out(self, car: str) -> None:
        """Forget the sign-in and the password (one's own app's secret stays)."""
        kept = {
            k: v for k, v in (self._data.get(car) or {}).items() if k == "client_secret"
        }
        self._data[car] = kept
        self._cache = {k: v for k, v in self._cache.items() if k[0] != car}
        await self._async_save()
        self._set(car, oauth=None, state="no_secret")

    async def _async_token(self, car: str, account: dict[str, Any]) -> str:
        tokens = (self._data.get(car) or {}).get("oauth") or {}
        if not tokens.get("refresh_token"):
            raise AccountError("no_secret")
        if not oauth.fresh(tokens):
            try:
                renewed = await oauth.refresh(
                    async_get_clientsession(self._hass),
                    self._sign_in(car, account, tokens),
                    tokens,
                )
            except oauth.OAuthError as err:
                raise AccountError("login", err.code) from err
            tokens = {**tokens, **renewed}
            self._data[car]["oauth"] = tokens
            await self._async_save()
        return str(tokens["access_token"])

    def _auth(self, car: str, account: dict[str, Any]) -> str:
        password = (self._data.get(car) or {}).get("password")
        if not password:
            raise AccountError("no_secret")
        return basic_auth(
            account.get("username") or account.get("address") or "", password
        )

    # --- appointments --------------------------------------------------------

    async def _async_fetch(
        self, car: str, account: dict[str, Any], start: datetime, end: datetime
    ) -> list[dict[str, Any]]:
        session = async_get_clientsession(self._hass)
        if account["kind"] in MICROSOFT:
            token = await self._async_token(car, account)
            return await graph_events(session, token, start, end)
        if account["kind"] == "google":
            token = await self._async_token(car, account)
            return await google_events(session, token, start, end)
        auth = self._auth(car, account)
        calendars = (self._data.get(car) or {}).get("calendars")
        if not calendars:
            base = account.get("url") or CALDAV_SERVERS.get(account["kind"]) or ""
            if not base:
                raise AccountError("no_server")
            calendars = await caldav_calendars(session, base, auth)
            self._data.setdefault(car, {})["calendars"] = calendars
            await self._async_save()
        return await caldav_events(
            session, calendars, auth, account.get("address") or "", start, end
        )

    async def async_events(
        self, car: str, start: datetime, end: datetime
    ) -> list[dict[str, Any]]:
        """A car account's appointments in a span (asked at most every 10 minutes)."""
        account = self._account(car)
        if not account:
            return []
        key = (car, f"{start.isoformat()}/{end.isoformat()}")
        cached = self._cache.get(key)
        if cached and dt_util.utcnow() - cached[0] < CACHE:
            return cached[1]
        try:
            events = await self._async_fetch(car, account, start, end)
        except AccountError as err:
            _LOGGER.debug("Account of %s not readable: %s", car, err)
            self._set(car, state="error", error=err.code)
            return []
        # Unanswered invitations from strangers are no trips of the car.
        rules = self._need(car).get("allowed") or []
        events = [
            e
            for e in events
            if not e.get("pending") or allowed(rules, e.get("organizer"))
        ]
        self._cache[key] = (dt_util.utcnow(), events)
        self._set(
            car,
            state="ok",
            error=None,
            checked=dt_util.now().isoformat(timespec="seconds"),
        )
        if account.get("accept", True):
            await self._async_accept(car, account, events)
        return events

    async def _async_accept(
        self, car: str, account: dict[str, Any], events: list[dict[str, Any]]
    ) -> None:
        """Accept the invitations from allowed senders."""
        session = async_get_clientsession(self._hass)
        for event in events:
            if not event.get("pending"):
                continue
            try:
                if account["kind"] in MICROSOFT:
                    token = await self._async_token(car, account)
                    await graph_accept(session, token, event["id"])
                elif account["kind"] == "google":
                    token = await self._async_token(car, account)
                    await google_accept(session, token, event)
                else:
                    await caldav_accept(
                        session,
                        self._auth(car, account),
                        event,
                        account.get("address") or "",
                    )
                event["pending"] = False
            except AccountError as err:
                _LOGGER.debug("Accepting %s failed: %s", event.get("uid"), err)

    async def async_test(self, car: str) -> str | None:
        """Read the next week once; None if that works, else the reason."""
        account = self._account(car)
        if not account:
            return "no_account"
        now = dt_util.now()
        try:
            await self._async_fetch(car, account, now, now + timedelta(days=7))
        except AccountError as err:
            self._set(car, state="error", error=err.code)
            return err.code
        self._set(
            car, state="ok", error=None, checked=now.isoformat(timespec="seconds")
        )
        return None
