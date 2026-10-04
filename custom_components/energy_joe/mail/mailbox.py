"""A car's mailbox: fetch invitations by IMAP, answer them by SMTP.

Plain functions that block (run them in the executor). Login with the
mailbox's password (some providers want an app password).
"""

from __future__ import annotations

import contextlib
from dataclasses import dataclass
from datetime import date, timedelta
from email import message_from_bytes, policy
from email.message import EmailMessage, Message
from email.utils import getaddresses, make_msgid
import imaplib
import smtplib
import ssl
from typing import Any

TIMEOUT = 30
# The first look reaches back this far; later only new messages.
FIRST_DAYS = 30

# Servers of the common providers (the user can always type their own).
PROVIDERS: dict[str, dict[str, Any]] = {
    "webde": {
        "imap_host": "imap.web.de",
        "imap_port": 993,
        "smtp_host": "smtp.web.de",
        "smtp_port": 587,
        "smtp_security": "starttls",
    },
    "gmx": {
        "imap_host": "imap.gmx.net",
        "imap_port": 993,
        "smtp_host": "mail.gmx.net",
        "smtp_port": 587,
        "smtp_security": "starttls",
    },
    "google": {
        "imap_host": "imap.gmail.com",
        "imap_port": 993,
        "smtp_host": "smtp.gmail.com",
        "smtp_port": 587,
        "smtp_security": "starttls",
    },
    "tonline": {
        "imap_host": "secureimap.t-online.de",
        "imap_port": 993,
        "smtp_host": "securesmtp.t-online.de",
        "smtp_port": 465,
        "smtp_security": "ssl",
    },
}


class MailError(Exception):
    """The mailbox could not be reached or refused the login ("login", "connect")."""

    def __init__(self, code: str, detail: str = "") -> None:
        super().__init__(f"{code}: {detail}")
        self.code = code
        self.detail = detail


@dataclass(slots=True)
class Fetched:
    """A message with an invitation: its uid in the mailbox and its parts."""

    uid: int
    sender: str
    recipients: list[str]
    calendars: list[str]


def servers(settings: dict[str, Any]) -> dict[str, Any]:
    """The servers to use: the provider's, overridden by what the user typed."""
    base = dict(PROVIDERS.get(settings.get("provider") or "", {}))
    for key in ("imap_host", "imap_port", "smtp_host", "smtp_port", "smtp_security"):
        if settings.get(key):
            base[key] = settings[key]
    return base


def _login_imap(settings: dict[str, Any], password: str) -> imaplib.IMAP4_SSL:
    where = servers(settings)
    if not where.get("imap_host"):
        raise MailError("no_server")
    try:
        client = imaplib.IMAP4_SSL(
            where["imap_host"],
            int(where.get("imap_port") or 993),
            ssl_context=ssl.create_default_context(),
            timeout=TIMEOUT,
        )
    except OSError as err:
        raise MailError("connect", str(err)) from err
    user = settings.get("username") or settings.get("address") or ""
    try:
        client.login(user, password)
    except imaplib.IMAP4.error as err:
        _close(client)
        raise MailError("login", str(err)) from err
    return client


def _close(client: imaplib.IMAP4) -> None:
    with contextlib.suppress(imaplib.IMAP4.error, OSError):
        client.logout()


def _calendars(message: Message) -> list[str]:
    """The iCalendar parts of a message (inline text/calendar or .ics files)."""
    found = []
    for part in message.walk():
        kind = part.get_content_type()
        name = (part.get_filename() or "").lower()
        if kind in ("text/calendar", "application/ics") or name.endswith(".ics"):
            payload = part.get_payload(decode=True)
            if payload:
                charset = part.get_content_charset() or "utf-8"
                found.append(payload.decode(charset, errors="replace"))
    return found


def fetch(
    settings: dict[str, Any],
    password: str,
    after_uid: int | None,
    validity: str | None,
) -> tuple[list[Fetched], str, int]:
    """Invitations that arrived since the last look.

    Returns them with the mailbox's UIDVALIDITY and the highest uid seen; a
    changed UIDVALIDITY means the mailbox was rebuilt and is read again.
    """
    client = _login_imap(settings, password)
    try:
        status, data = client.select("INBOX", readonly=True)
        if status != "OK":
            raise MailError("inbox", str(data))
        status, raw = client.response("UIDVALIDITY")
        current = (raw[0].decode() if raw and raw[0] else "") or ""
        if validity != current:
            after_uid = None
        if after_uid is None:
            since = _since()
            status, data = client.uid("SEARCH", None, f"SINCE {since}")
        else:
            status, data = client.uid("SEARCH", None, f"UID {after_uid + 1}:*")
        uids = [int(u) for u in (data[0] or b"").split()] if status == "OK" else []
        uids = [u for u in uids if after_uid is None or u > after_uid]
        highest = max([*uids, after_uid or 0])
        found = []
        for uid in uids:
            status, parts = client.uid("FETCH", str(uid), "(BODY.PEEK[])")
            if status != "OK" or not parts or not isinstance(parts[0], tuple):
                continue
            message = message_from_bytes(parts[0][1], policy=policy.default)
            calendars = _calendars(message)
            if not calendars:
                continue
            sender = getaddresses([str(message.get("From", ""))])
            recipients = getaddresses(
                [str(message.get(h, "")) for h in ("To", "Cc", "Delivered-To")]
            )
            found.append(
                Fetched(
                    uid=uid,
                    sender=(sender[0][1] if sender else "").lower(),
                    recipients=[a.lower() for _, a in recipients if a],
                    calendars=calendars,
                )
            )
        return found, current, highest
    except imaplib.IMAP4.error as err:
        raise MailError("inbox", str(err)) from err
    except OSError as err:
        raise MailError("connect", str(err)) from err
    finally:
        _close(client)


def _since() -> str:
    return (date.today() - timedelta(days=FIRST_DAYS)).strftime("%d-%b-%Y")


def check(settings: dict[str, Any], password: str) -> None:
    """Log in to IMAP and SMTP once (the panel's "test")."""
    _close(_login_imap(settings, password))
    _close_smtp(_login_smtp(settings, password))


def _login_smtp(settings: dict[str, Any], password: str) -> smtplib.SMTP:
    where = servers(settings)
    if not where.get("smtp_host"):
        raise MailError("no_server")
    port = int(where.get("smtp_port") or 587)
    context = ssl.create_default_context()
    try:
        if where.get("smtp_security") == "ssl" or port == 465:
            client: smtplib.SMTP = smtplib.SMTP_SSL(
                where["smtp_host"], port, context=context, timeout=TIMEOUT
            )
        else:
            client = smtplib.SMTP(where["smtp_host"], port, timeout=TIMEOUT)
            client.starttls(context=context)
    except OSError as err:
        raise MailError("connect", str(err)) from err
    user = settings.get("username") or settings.get("address") or ""
    try:
        client.login(user, password)
    except smtplib.SMTPException as err:
        _close_smtp(client)
        raise MailError("login", str(err)) from err
    return client


def _close_smtp(client: smtplib.SMTP) -> None:
    with contextlib.suppress(smtplib.SMTPException, OSError):
        client.quit()


def send_reply(
    settings: dict[str, Any],
    password: str,
    to: str,
    subject: str,
    calendar: str,
) -> None:
    """Send an invitation's answer (iMIP REPLY) to its organizer."""
    message = EmailMessage()
    message["From"] = settings.get("address") or ""
    message["To"] = to
    message["Subject"] = subject
    message["Message-ID"] = make_msgid(domain="energy-joe")
    message.set_content(subject)
    message.add_alternative(
        calendar, subtype="calendar", params={"method": "REPLY", "charset": "utf-8"}
    )
    client = _login_smtp(settings, password)
    try:
        client.send_message(message)
    except smtplib.SMTPException as err:
        raise MailError("send", str(err)) from err
    finally:
        _close_smtp(client)
