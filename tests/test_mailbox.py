"""A car's mailbox: read Google, Apple and Outlook invitations, accept them."""

from __future__ import annotations

from typing import Any
from unittest.mock import patch

import pytest

from custom_components.energy_joe import model
from custom_components.energy_joe.mail import inbox as inbox_module
from custom_components.energy_joe.mail.ical import parse, reply
from custom_components.energy_joe.mail.inbox import (
    CarInboxes,
    allowed,
    invited_as,
    trusted,
)
from custom_components.energy_joe.mail.mailbox import Fetched, _calendars
from custom_components.energy_joe.plan.car_calendar import CarCalendarStore
from homeassistant.core import HomeAssistant

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


def test_who_may_invite_and_as_which_address() -> None:
    rules = ["robin@example.org", "@firma.example"]
    assert allowed(rules, "robin@example.org")
    assert allowed(rules, None, "kim@firma.example")
    assert not allowed(rules, "fremd@spam.example")
    assert not allowed(rules, "kim@nichtfirma.example")
    # A stranger writing an allowed organizer into the invitation: no.
    assert not trusted(rules, "fremd@spam.example", "robin@example.org")
    # A colleague of the allowed organizer, from the same domain: yes.
    assert trusted(["robin@example.org"], "assistenz@example.org", "robin@example.org")
    # The answer names the address that was invited, a plus address too.
    invited = ["robin@example.org", "auto+kona@example.org"]
    assert invited_as("auto@example.org", invited) == "auto+kona@example.org"
    assert invited_as("Kona@Example.org", ["kona@example.org"]) == "kona@example.org"


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


def _car(car: str, address: str, **extra: Any) -> dict[str, Any]:
    return {
        "id": car,
        "name": car.upper(),
        "kind": "switch",
        "entity_id": f"select.{car}_mode",
        "on_value": "now",
        "need": {
            "enabled": True,
            "source": "mailbox",
            "mailbox": {"provider": "webde", "address": address},
            "allowed": ["robin@example.org", "@firma.example"],
            **extra,
        },
    }


@pytest.fixture
def config() -> dict[str, Any]:
    return model.apply_update(
        model.default_config(),
        {
            "actions": {
                "kona": _car("kona", "kona@example.org"),
                "eup": _car("eup", "eup@example.org"),
            }
        },
        "user",
    )


async def test_invitations_become_trips_and_are_accepted(
    hass: HomeAssistant, config: dict[str, Any], monkeypatch: pytest.MonkeyPatch
) -> None:
    """Each car reads its own mailbox; trips land in Joe's calendar for it."""
    mailboxes: dict[str, list[Fetched]] = {
        "kona@example.org": [
            Fetched(1, "robin@example.org", ["kona@example.org"], [GOOGLE]),
            Fetched(
                2,
                "fremd@spam.example",
                ["kona@example.org"],
                [GOOGLE.replace("abc123", "spam")],
            ),
        ],
        "eup@example.org": [
            Fetched(7, "kim@firma.example", ["eup@example.org"], [OUTLOOK]),
        ],
    }
    sent: list[tuple[str, str, str]] = []

    def fake_fetch(settings: Any, password: str, after: Any, validity: Any) -> Any:
        assert settings["provider"] == "webde"
        assert password == f"pw-{settings['address']}"
        messages = mailboxes[settings["address"]]
        new = [m for m in messages if after is None or m.uid > after]
        return new, "77", max(m.uid for m in messages)

    def fake_send(
        settings: Any, password: str, to: str, subject: str, calendar: str
    ) -> None:
        sent.append((settings["address"], to, calendar))

    monkeypatch.setattr(inbox_module, "fetch", fake_fetch)
    monkeypatch.setattr(inbox_module, "send_reply", fake_send)
    calendars = CarCalendarStore(hass)
    await calendars.async_load()
    inbox = CarInboxes(hass, lambda: config, calendars, lambda: None)
    await inbox.async_load()
    await inbox.async_set_password("kona", "pw-kona@example.org")
    await inbox.async_set_password("eup", "pw-eup@example.org")
    await hass.async_block_till_done()

    (kona,) = calendars.events("kona")
    assert kona["location"] == "Hauptstraße 1, 14467 Potsdam"
    assert kona["source"] == "mail" and kona["accepted"] is True
    (eup,) = calendars.events("eup")
    assert eup["location"] == "Messe Hannover"
    # Each car answered its own organizer, in its own name; the stranger got nothing.
    assert sorted((box, to) for box, to, _ in sent) == [
        ("eup@example.org", "kim@firma.example"),
        ("kona@example.org", "robin@example.org"),
    ]
    assert inbox.status["kona"]["state"] == "ok"
    results = {e["from"]: e["result"] for e in inbox.status["kona"]["recent"]}
    assert results == {
        "fremd@spam.example": "not_allowed",
        "robin@example.org": "added_accepted",
    }

    # The next look finds only the cancellation: the trip goes, no new answer.
    mailboxes["kona@example.org"].append(
        Fetched(4, "robin@example.org", ["kona@example.org"], [APPLE_CANCEL])
    )
    await inbox.async_check("kona")
    assert calendars.events("kona") == []
    assert len(calendars.events("eup")) == 1
    assert len(sent) == 2
    assert inbox._data["kona"]["last_uid"] == 4
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
    inbox = CarInboxes(hass, lambda: config, calendars, lambda: None)
    await inbox.async_load()
    inbox.async_apply()
    await inbox.async_check()
    assert inbox.status["kona"]["state"] == "no_secret"
    assert await inbox.async_test("kona") == "no_secret"
    # A car that reads a finished calendar has no mailbox.
    assert await inbox.async_test("nobody") == "no_mailbox"
    inbox.async_stop()
    await calendars.async_remove()


async def test_a_newly_allowed_sender_is_read_again(
    hass: HomeAssistant, config: dict[str, Any], monkeypatch: pytest.MonkeyPatch
) -> None:
    """Allowing a refused sender reads the mailbox again from the start."""
    spam = Fetched(3, "kim@example.net", ["kona@example.org"], [GOOGLE])
    calls: list[Any] = []

    def fake_fetch(settings: Any, password: str, after: Any, validity: Any) -> Any:
        calls.append(after)
        if settings["address"] != "kona@example.org":
            return [], "1", 0
        return ([spam] if after is None else []), "1", 3

    monkeypatch.setattr(inbox_module, "fetch", fake_fetch)
    monkeypatch.setattr(inbox_module, "send_reply", lambda *args: None)
    calendars = CarCalendarStore(hass)
    await calendars.async_load()
    current = {"config": config}
    inbox = CarInboxes(hass, lambda: current["config"], calendars, lambda: None)
    await inbox.async_load()
    await inbox.async_set_password("kona", "pw")
    inbox.async_apply()
    await hass.async_block_till_done()
    assert inbox.status["kona"]["recent"][0]["result"] == "not_allowed"
    assert calendars.events("kona") == []

    allowed = [*config["actions"][0]["need"]["allowed"], "kim@example.net"]
    current["config"] = model.apply_update(
        config, {"actions": {"kona": {"need": {"allowed": allowed}}}}, "user"
    )
    inbox.async_apply()
    await hass.async_block_till_done()
    assert calls[-1] is None
    assert [e["summary"] for e in calendars.events("kona")] == ["Zahnarzt, Kontrolle"]
    inbox.async_stop()
    await calendars.async_remove()
    await inbox.async_remove()


async def test_the_password_of_the_one_mailbox_goes_to_the_first_car(
    hass: HomeAssistant, config: dict[str, Any], hass_storage: dict[str, Any]
) -> None:
    """Up to 0.3 one mailbox served all cars."""
    hass_storage[inbox_module.STORE_KEY] = {
        "version": 1,
        "key": inbox_module.STORE_KEY,
        "data": {"password": "old", "validity": "5", "last_uid": 9},
    }
    calendars = CarCalendarStore(hass)
    inbox = CarInboxes(hass, lambda: config, calendars, lambda: None)
    await inbox.async_load()
    assert inbox.has_secret("kona")
    assert not inbox.has_secret("eup")


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


async def test_the_mailbox_test_takes_the_settings_in_the_editor(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    """Testing works before the car is saved as a mailbox car; its status stays."""
    seen: list[dict[str, Any]] = []
    monkeypatch.setattr(
        inbox_module, "check", lambda settings, password: seen.append(settings)
    )
    config = model.default_config()
    config = model.apply_update(
        config, {"actions": {"kona": {**_car("kona", "x@y.z"), "need": {}}}}, "user"
    )
    calendars = CarCalendarStore(hass)
    inbox = CarInboxes(hass, lambda: config, calendars, lambda: None)
    await inbox.async_load()
    await inbox.async_set_password("kona", "pw")
    draft = model.CAR_MAILBOX({"provider": "gmx", "address": "kona@gmx.net"})
    assert await inbox.async_test("kona", draft) is None
    assert seen[-1]["provider"] == "gmx"
    inbox.async_apply()
    assert inbox.status["kona"]["has_secret"] is True
    inbox.async_stop()


def test_a_password_with_umlauts_is_a_clear_error() -> None:
    from custom_components.energy_joe.mail import mailbox

    class Client:
        def login(self, user: str, password: str) -> None:
            password.encode("ascii")

        def logout(self) -> None:
            pass

    with (
        patch.object(mailbox.imaplib, "IMAP4_SSL", lambda *a, **k: Client()),
        pytest.raises(mailbox.MailError) as err,
    ):
        mailbox._login_imap({"imap_host": "imap.example.org"}, "Grüße")
    assert err.value.code == "ascii"
