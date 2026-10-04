"""Invitations by mail: read Google, Apple and Outlook, sort by car, accept."""

from __future__ import annotations

from typing import Any

import pytest

from custom_components.energy_joe import model
from custom_components.energy_joe.mail import inbox as inbox_module
from custom_components.energy_joe.mail.ical import parse, reply
from custom_components.energy_joe.mail.inbox import (
    JoeInbox,
    allowed,
    trusted,
    which_car,
)
from custom_components.energy_joe.mail.mailbox import Fetched, _calendars
from custom_components.energy_joe.plan.car_calendar import CarCalendarStore
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

GOOGLE = """BEGIN:VCALENDAR
PRODID:-//Google Inc//Google Calendar 70.9054//EN
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
DTSTART:20261005T070000Z
DTEND:20261005T080000Z
DTSTAMP:20261004T100000Z
ORGANIZER;CN=Robin:mailto:robin@example.org
UID:abc123@google.com
ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=
 TRUE;CN=auto+kona@example.org;X-NUM-GUESTS=0:mailto:auto+kona@example.org
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:Zahnarzt\\, Kontrolle
LOCATION:Hauptstraße 1\\, 14467 Potsdam
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Erinnerung
TRIGGER:-P0DT0H30M0S
END:VALARM
END:VEVENT
END:VCALENDAR
"""

OUTLOOK = """BEGIN:VCALENDAR
METHOD:REQUEST
PRODID:Microsoft Exchange Server 2010
VERSION:2.0
BEGIN:VTIMEZONE
TZID:W. Europe Standard Time
BEGIN:STANDARD
DTSTART:16010101T030000
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
ORGANIZER;CN=Kim:mailto:kim@firma.example
ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:auto+eup@example.org
SUMMARY;LANGUAGE=de-DE:Kundentermin
DTSTART;TZID=W. Europe Standard Time:20261006T140000
DTEND;TZID=W. Europe Standard Time:20261006T153000
UID:040000008200E00074C5B7101A82E008000000001
SEQUENCE:1
LOCATION;LANGUAGE=de-DE:Messe Hannover
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR
"""

APPLE_CANCEL = """BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Apple Inc.//iPhone OS 26.0//EN
METHOD:CANCEL
BEGIN:VEVENT
UID:abc123@google.com
SEQUENCE:1
DTSTART;VALUE=DATE:20261005
DURATION:P1D
ORGANIZER:mailto:robin@example.org
STATUS:CANCELLED
SUMMARY:Zahnarzt
END:VEVENT
END:VCALENDAR
"""


def test_google_outlook_and_apple_are_read() -> None:
    (google,) = parse(GOOGLE)
    assert google.method == "REQUEST"
    assert google.summary == "Zahnarzt, Kontrolle"
    assert google.location == "Hauptstraße 1, 14467 Potsdam"
    assert google.organizer == "robin@example.org"
    assert google.attendees == ["auto+kona@example.org"]
    assert google.start.isoformat() == "2026-10-05T07:00:00+00:00"
    (outlook,) = parse(OUTLOOK)
    # The Windows zone name is Berlin time.
    assert outlook.start.utcoffset().total_seconds() == 7200
    assert outlook.end.hour == 15 and outlook.end.minute == 30
    assert outlook.sequence == 1
    (cancel,) = parse(APPLE_CANCEL)
    assert cancel.method == "CANCEL"
    assert cancel.start.isoformat() == "2026-10-05"
    assert cancel.end.isoformat() == "2026-10-06"


def test_the_answer_accepts_for_the_car() -> None:
    (google,) = parse(GOOGLE)
    text = reply(google, "auto+kona@example.org")
    assert "METHOD:REPLY" in text
    assert "ATTENDEE;PARTSTAT=ACCEPTED:mailto:auto+kona@example.org" in text
    assert "UID:abc123@google.com" in text
    assert "ORGANIZER:mailto:robin@example.org" in text


def test_who_may_invite_and_for_which_car() -> None:
    rules = ["robin@example.org", "@firma.example"]
    assert allowed(rules, "robin@example.org")
    assert allowed(rules, None, "kim@firma.example")
    assert not allowed(rules, "fremd@spam.example")
    assert not allowed(rules, "kim@nichtfirma.example")
    # A stranger writing an allowed organizer into the invitation: no.
    assert not trusted(rules, "fremd@spam.example", "robin@example.org")
    # A colleague of the allowed organizer, from the same domain: yes.
    assert trusted(["robin@example.org"], "assistenz@example.org", "robin@example.org")
    cars = {"kona": "auto+kona@example.org", "eup": "auto+eup@example.org"}
    assert which_car(cars, ["kona", "eup"], ["auto+eup@example.org"]) == "eup"
    assert which_car(cars, ["kona", "eup"], ["auto@example.org"]) is None
    # Only one car: every allowed invitation is for it.
    assert which_car({}, ["kona"], ["auto@example.org"]) == "kona"


def test_calendar_parts_of_a_mail() -> None:
    from email.message import EmailMessage

    message = EmailMessage()
    message.set_content("Einladung")
    message.add_alternative(GOOGLE, subtype="calendar", params={"method": "REQUEST"})
    message.add_attachment(
        OUTLOOK.encode(), maintype="application", subtype="ics", filename="invite.ics"
    )
    found = _calendars(message)
    assert len(found) == 2
    assert "abc123@google.com" in found[0]


CARS = [
    {
        "id": car,
        "name": car.upper(),
        "kind": "switch",
        "entity_id": f"select.{car}_mode",
        "on_value": "now",
        "need": {"enabled": True, "source": "mailbox"},
    }
    for car in ("kona", "eup")
]


@pytest.fixture
def config() -> dict[str, Any]:
    return model.apply_update(
        model.default_config(),
        {
            "actions": {c["id"]: c for c in CARS},
            "mailbox": {
                "enabled": True,
                "provider": "google",
                "address": "auto@example.org",
                "allowed": ["robin@example.org", "@firma.example"],
                "cars": {
                    "kona": "auto+kona@example.org",
                    "eup": "auto+eup@example.org",
                },
            },
        },
        "user",
    )


async def test_invitations_become_trips_and_are_accepted(
    hass: HomeAssistant, config: dict[str, Any], monkeypatch: pytest.MonkeyPatch
) -> None:
    messages: list[Fetched] = [
        Fetched(1, "robin@example.org", ["auto+kona@example.org"], [GOOGLE]),
        Fetched(2, "kim@firma.example", ["auto+eup@example.org"], [OUTLOOK]),
        Fetched(
            3,
            "fremd@spam.example",
            ["auto+kona@example.org"],
            [GOOGLE.replace("abc123", "spam")],
        ),
    ]
    sent: list[tuple[str, str]] = []

    def fake_fetch(settings: Any, secret: Any, after: Any, validity: Any) -> Any:
        assert secret["password"] == "app-password"
        new = [m for m in messages if after is None or m.uid > after]
        return new, "77", max([m.uid for m in messages])

    def fake_send(
        settings: Any, secret: Any, to: str, subject: str, calendar: str
    ) -> None:
        sent.append((to, calendar))

    monkeypatch.setattr(inbox_module, "fetch", fake_fetch)
    monkeypatch.setattr(inbox_module, "send_reply", fake_send)
    calendars = CarCalendarStore(hass)
    await calendars.async_load()
    inbox = JoeInbox(hass, lambda: config, calendars, lambda: None)
    await inbox.async_load()
    await inbox.async_set_secret(password="app-password")
    await hass.async_block_till_done()

    (kona,) = calendars.events("kona")
    assert kona["location"] == "Hauptstraße 1, 14467 Potsdam"
    assert kona["source"] == "mail" and kona["accepted"] is True
    (eup,) = calendars.events("eup")
    assert eup["location"] == "Messe Hannover"
    # Both organizers got an answer, the stranger nothing.
    assert sorted(to for to, _ in sent) == ["kim@firma.example", "robin@example.org"]
    assert inbox.status["state"] == "ok"
    results = {entry["from"]: entry["result"] for entry in inbox.status["recent"]}
    assert results["fremd@spam.example"] == "not_allowed"
    assert results["robin@example.org"] == "added_accepted"

    # The next look finds only the cancellation: the trip goes, no new answer.
    messages.append(
        Fetched(4, "robin@example.org", ["auto+kona@example.org"], [APPLE_CANCEL])
    )
    await inbox.async_check()
    assert calendars.events("kona") == []
    assert len(sent) == 2
    assert inbox._data["last_uid"] == 4
    await calendars.async_remove()
    await inbox.async_remove()


async def test_the_mailbox_stays_quiet_without_a_password(
    hass: HomeAssistant, config: dict[str, Any], monkeypatch: pytest.MonkeyPatch
) -> None:
    def fail(*args: Any) -> Any:
        raise AssertionError("no login without a password")

    monkeypatch.setattr(inbox_module, "fetch", fail)
    calendars = CarCalendarStore(hass)
    await calendars.async_load()
    inbox = JoeInbox(hass, lambda: config, calendars, lambda: None)
    await inbox.async_load()
    await inbox.async_check()
    assert inbox.status["state"] == "no_secret"
    assert dt_util.now() is not None
    await calendars.async_remove()


async def test_signing_in_with_microsoft(
    hass: HomeAssistant,
    config: dict[str, Any],
    aioclient_mock: Any,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """A code to enter at Microsoft; Joe waits, keeps the tokens and renews them."""
    from custom_components.energy_joe.mail import oauth

    config = model.apply_update(
        config,
        {
            "mailbox": {
                "provider": "microsoft",
                "client_id": "app-id",
                "tenant": "common",
            }
        },
        "user",
    )
    # A work account: its tenant ("common" means any work or school account).
    base = "https://login.microsoftonline.com/organizations/oauth2/v2.0"
    aioclient_mock.post(
        f"{base}/devicecode",
        json={
            "user_code": "ABCD-EFGH",
            "device_code": "dev",
            "verification_uri": "https://microsoft.com/devicelogin",
            "interval": 0,
            "expires_in": 900,
        },
    )
    aioclient_mock.post(
        f"{base}/token",
        json={
            "access_token": "access-1",
            "refresh_token": "refresh-1",
            "expires_in": 3600,
        },
    )
    seen: list[dict[str, Any]] = []

    def fake_fetch(settings: Any, secret: Any, after: Any, validity: Any) -> Any:
        seen.append(secret)
        return [], "1", 0

    monkeypatch.setattr(inbox_module, "fetch", fake_fetch)
    calendars = CarCalendarStore(hass)
    await calendars.async_load()
    inbox = JoeInbox(hass, lambda: config, calendars, lambda: None)
    await inbox.async_load()
    assert not inbox.has_secret
    info = await inbox.async_oauth_start()
    assert info["user_code"] == "ABCD-EFGH"
    await hass.async_block_till_done(wait_background_tasks=True)
    assert inbox.has_secret
    assert inbox.status["oauth"] == {"state": "ok"}
    # The look after signing in used the access token.
    assert seen[-1]["token"] == "access-1"
    # Run out: Joe renews it before the next look.
    inbox._data["oauth"]["expires"] = "2000-01-01T00:00:00+00:00"
    aioclient_mock.clear_requests()
    aioclient_mock.post(
        f"{base}/token", json={"access_token": "access-2", "expires_in": 3600}
    )
    await inbox.async_check()
    assert seen[-1]["token"] == "access-2"
    # Microsoft kept the refresh token: so does Joe.
    assert inbox._data["oauth"]["refresh_token"] == "refresh-1"
    assert oauth.fresh(inbox._data["oauth"])
    await inbox.async_sign_out()
    assert not inbox.has_secret
    await calendars.async_remove()
    await inbox.async_remove()


def test_personal_and_work_accounts(monkeypatch: pytest.MonkeyPatch) -> None:
    """Personal accounts sign in at "consumers" with Energy Joe's own app."""
    from custom_components.energy_joe.mail import oauth

    monkeypatch.setattr(oauth, "JOE_CLIENT_ID", "joe-app")
    assert oauth.tenant_for("outlook", "contoso.example") == "consumers"
    assert oauth.tenant_for("microsoft", "common") == "organizations"
    assert oauth.tenant_for("microsoft", "contoso.example") == "contoso.example"
    assert oauth.client_for(None) == "joe-app"
    assert oauth.client_for("own-app") == "own-app"
    monkeypatch.setattr(oauth, "JOE_CLIENT_ID", None)
    assert oauth.client_for("") is None
