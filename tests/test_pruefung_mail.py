"""Findings of the 0.9.51 review: mail and account errors."""

from __future__ import annotations

from datetime import timedelta
from email.message import EmailMessage
import smtplib
from typing import Any

import pytest

from custom_components.energy_joe import accounts
from custom_components.energy_joe.accounts import AccountError
from custom_components.energy_joe.mail import mailbox
from custom_components.energy_joe.mail.mailbox import MailError
from homeassistant.util import dt as dt_util


def test_unknown_charset_does_not_block() -> None:
    message = EmailMessage()
    message.set_content("x")
    message.add_attachment(
        b"BEGIN:VCALENDAR\r\nEND:VCALENDAR\r\n",
        maintype="text",
        subtype="calendar",
        filename="a.ics",
    )
    for part in message.walk():
        if part.get_content_type() == "text/calendar":
            part.set_param("charset", "x-unbekannt")
    found = mailbox._calendars(message)
    assert found and "VCALENDAR" in found[0]


@pytest.mark.parametrize(
    "error",
    [
        smtplib.SMTPNotSupportedError("no STARTTLS"),
        smtplib.SMTPConnectError(421, "busy"),
        smtplib.SMTPServerDisconnected("gone"),
    ],
)
def test_smtp_errors_become_mail_errors(monkeypatch, error) -> None:
    class Fake:
        def __init__(self, *args: Any, **kwargs: Any) -> None:
            if isinstance(error, smtplib.SMTPConnectError):
                raise error

        def starttls(self, **kwargs: Any) -> None:
            raise error

    monkeypatch.setattr(mailbox.smtplib, "SMTP", Fake)
    settings = {"address": "a@example.org", "smtp_host": "smtp.example.org"}
    monkeypatch.setattr(mailbox, "servers", lambda s: s)
    with pytest.raises(MailError) as caught:
        mailbox._login_smtp(settings, "pw")
    assert caught.value.code == "connect"


def test_reply_subject_without_line_breaks() -> None:
    summary = "Termin\r\nmit Umbruch"
    subject = f"Zugesagt: {' '.join(summary.split())}".strip()
    message = EmailMessage()
    message["Subject"] = subject
    assert "\n" not in str(message["Subject"])


class _Response:
    def __init__(self, status: int) -> None:
        self.status = status

    async def __aenter__(self) -> _Response:
        return self

    async def __aexit__(self, *args: Any) -> None:
        return None

    async def json(self, content_type: Any = None) -> dict[str, Any]:
        return {"error": {"code": "TooManyRequests"}}


class _Session:
    def __init__(self, status: int) -> None:
        self.status = status

    def get(self, *args: Any, **kwargs: Any) -> _Response:
        return _Response(self.status)


@pytest.mark.parametrize("status", [404, 429, 500, 503])
@pytest.mark.parametrize("read", ["graph_events", "google_events"])
async def test_error_answers_are_no_empty_calendar(read: str, status: int) -> None:
    start = dt_util.utcnow()
    with pytest.raises(AccountError) as caught:
        await getattr(accounts, read)(
            _Session(status), "token", start, start + timedelta(days=1)
        )
    assert caught.value.code == "connect"


async def test_error_keeps_old_cache(monkeypatch) -> None:
    owner = accounts.CarAccounts.__new__(accounts.CarAccounts)
    start = dt_util.utcnow()
    end = start + timedelta(days=1)
    key = ("kona", f"{start.isoformat()}/{end.isoformat()}")
    old = [{"uid": "a"}]
    owner._cache = {key: (start - timedelta(hours=1), old)}
    owner._account = lambda car: {"kind": "microsoft"}
    owner._set = lambda car, **changes: None

    async def fail(*args: Any) -> list[dict[str, Any]]:
        raise AccountError("connect", "503")

    owner._async_fetch = fail
    assert await owner.async_events("kona", start, end) == old
