"""A car's own account: Microsoft's calendar and CalDAV (iCloud, Infomaniak)."""

from __future__ import annotations

from datetime import timedelta
from typing import Any

import pytest

from custom_components.energy_joe import model
from custom_components.energy_joe.accounts import CarAccounts, accept_ics
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

GRAPH = "https://graph.microsoft.com/v1.0"


def _config(kind: str, **account: Any) -> dict[str, Any]:
    return model.apply_update(
        model.default_config(),
        {
            "actions": {
                "kona": {
                    "id": "kona",
                    "name": "KONA",
                    "kind": "switch",
                    "entity_id": "select.kona_mode",
                    "on_value": "now",
                    "need": {
                        "enabled": True,
                        "source": "account",
                        "account": {
                            "kind": kind,
                            "address": "kona@example.org",
                            **account,
                        },
                        "allowed": ["robin@example.org"],
                    },
                }
            },
        },
        "user",
    )


async def test_the_microsoft_calendar_of_a_car(
    hass: HomeAssistant, aioclient_mock: Any, monkeypatch: pytest.MonkeyPatch
) -> None:
    from custom_components.energy_joe.mail import oauth

    monkeypatch.setattr(oauth, "JOE_CLIENT_ID", "joe-app")
    config = _config("outlook")
    login = "https://login.microsoftonline.com/consumers/oauth2/v2.0"
    aioclient_mock.post(
        f"{login}/devicecode",
        json={
            "user_code": "KONA-1",
            "device_code": "dev",
            "interval": 0,
            "expires_in": 900,
        },
    )
    aioclient_mock.post(
        f"{login}/token",
        json={"access_token": "graph-1", "refresh_token": "r-1", "expires_in": 3600},
    )
    aioclient_mock.get(
        f"{GRAPH}/me/calendarView",
        json={
            "value": [
                {
                    "id": "AAMk1",
                    "iCalUId": "uid-1",
                    "subject": "Kundentermin",
                    "start": {
                        "dateTime": "2026-10-05T07:00:00.0000000",
                        "timeZone": "UTC",
                    },
                    "end": {
                        "dateTime": "2026-10-05T08:00:00.0000000",
                        "timeZone": "UTC",
                    },
                    "location": {"displayName": "Messe Hannover"},
                    "isAllDay": False,
                    "isCancelled": False,
                    "isOrganizer": False,
                    "responseStatus": {"response": "notResponded"},
                    "organizer": {"emailAddress": {"address": "Robin@example.org"}},
                },
                {
                    "id": "AAMk2",
                    "subject": "Werbung",
                    "start": {
                        "dateTime": "2026-10-05T09:00:00.0000000",
                        "timeZone": "UTC",
                    },
                    "end": {
                        "dateTime": "2026-10-05T10:00:00.0000000",
                        "timeZone": "UTC",
                    },
                    "isOrganizer": False,
                    "responseStatus": {"response": "notResponded"},
                    "organizer": {"emailAddress": {"address": "spam@example.net"}},
                },
                {
                    "id": "AAMk3",
                    "subject": "Abgesagt",
                    "isCancelled": True,
                    "start": {
                        "dateTime": "2026-10-05T11:00:00.0000000",
                        "timeZone": "UTC",
                    },
                    "end": {
                        "dateTime": "2026-10-05T12:00:00.0000000",
                        "timeZone": "UTC",
                    },
                },
            ]
        },
    )
    aioclient_mock.post(f"{GRAPH}/me/events/AAMk1/accept", status=202)
    accounts = CarAccounts(hass, lambda: config, lambda: None)
    await accounts.async_load()
    info = await accounts.async_sign_in("kona")
    assert info["user_code"] == "KONA-1"
    await hass.async_block_till_done(wait_background_tasks=True)
    assert accounts.status["kona"]["oauth"] == {"state": "ok"}

    start = dt_util.parse_datetime("2026-10-05T00:00:00+02:00")
    events = await accounts.async_events("kona", start, start + timedelta(days=1))
    # The unanswered invitation from a stranger is no trip.
    assert [e["location"] for e in events] == ["Messe Hannover"]
    assert events[0]["start"].startswith("2026-10-05T")
    # Only the allowed organizer got an acceptance.
    accepted = [c for c in aioclient_mock.mock_calls if "accept" in str(c[1])]
    assert len(accepted) == 1
    assert accounts.status["kona"]["state"] == "ok"
    await accounts.async_remove()


async def test_the_google_calendar_of_a_car(
    hass: HomeAssistant, aioclient_mock: Any, monkeypatch: pytest.MonkeyPatch
) -> None:
    from custom_components.energy_joe.mail import oauth

    await hass.config.async_set_time_zone("Europe/Berlin")
    monkeypatch.setattr(oauth, "JOE_GOOGLE_CLIENT_ID", "joe-google")
    monkeypatch.setattr(oauth, "JOE_GOOGLE_CLIENT_SECRET", "not-secret")
    config = _config("google", address="kona@gmail.com")
    aioclient_mock.post(
        oauth.GOOGLE_DEVICE,
        json={
            "user_code": "GQVQ-JKEC",
            "device_code": "dev",
            "verification_url": "https://www.google.com/device",
            "interval": 0,
            "expires_in": 1800,
        },
    )
    aioclient_mock.post(
        oauth.GOOGLE_TOKEN,
        json={"access_token": "g-1", "refresh_token": "gr-1", "expires_in": 3600},
    )
    me = {"email": "kona@gmail.com", "self": True, "responseStatus": "needsAction"}
    aioclient_mock.get(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        json={
            "items": [
                {
                    "id": "ev1",
                    "iCalUID": "uid-1@google.com",
                    "status": "confirmed",
                    "summary": "Kundentermin",
                    "location": "Messe Hannover",
                    "start": {"dateTime": "2026-10-05T09:00:00+02:00"},
                    "end": {"dateTime": "2026-10-05T10:00:00+02:00"},
                    "organizer": {"email": "Robin@example.org"},
                    "attendees": [
                        {"email": "robin@example.org", "organizer": True},
                        me,
                    ],
                },
                {
                    "id": "ev2",
                    "status": "confirmed",
                    "summary": "Werbung",
                    "location": "Irgendwo",
                    "start": {"dateTime": "2026-10-05T11:00:00+02:00"},
                    "end": {"dateTime": "2026-10-05T12:00:00+02:00"},
                    "organizer": {"email": "spam@example.net"},
                    "attendees": [me],
                },
                {
                    "id": "ev3",
                    "status": "cancelled",
                    "start": {"date": "2026-10-05"},
                    "end": {"date": "2026-10-06"},
                },
            ]
        },
    )
    aioclient_mock.patch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events/ev1",
        json={"id": "ev1"},
    )
    accounts = CarAccounts(hass, lambda: config, lambda: None)
    await accounts.async_load()
    info = await accounts.async_sign_in("kona")
    assert info["user_code"] == "GQVQ-JKEC"
    assert info["uri"] == "https://www.google.com/device"
    await hass.async_block_till_done(wait_background_tasks=True)
    assert accounts.status["kona"]["oauth"] == {"state": "ok"}
    # Google wants the app's secret when the code is exchanged.
    token_call = [
        c for c in aioclient_mock.mock_calls if str(c[1]) == oauth.GOOGLE_TOKEN
    ]
    assert token_call[-1][2]["client_secret"] == "not-secret"

    start = dt_util.parse_datetime("2026-10-05T00:00:00+02:00")
    events = await accounts.async_events("kona", start, start + timedelta(days=1))
    # The stranger's unanswered invitation and the cancelled one are no trips.
    assert [e["location"] for e in events] == ["Messe Hannover"]
    assert events[0]["start"] == "2026-10-05T09:00:00+02:00"
    (accepted,) = [c for c in aioclient_mock.mock_calls if c[0] == "PATCH"]
    attendees = accepted[2]["attendees"]
    assert {
        "email": "kona@gmail.com",
        "self": True,
        "responseStatus": "accepted",
    } in attendees
    assert {"email": "robin@example.org", "organizer": True} in attendees
    await accounts.async_remove()


def test_without_joes_google_app_ones_own_is_needed(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    from custom_components.energy_joe.accounts import AccountError
    from custom_components.energy_joe.mail import oauth

    monkeypatch.setattr(oauth, "JOE_GOOGLE_CLIENT_ID", None)
    config = _config("google", client_id="own-app")
    accounts = CarAccounts(hass, lambda: config, lambda: None)
    account = config["actions"][0]["need"]["account"]
    with pytest.raises(AccountError):
        accounts._sign_in("kona", account)
    accounts._data["kona"] = {"client_secret": "own-secret"}
    sign_in = accounts._sign_in("kona", account)
    assert (sign_in.client_id, sign_in.client_secret) == ("own-app", "own-secret")


PRINCIPAL = """<?xml version="1.0"?><d:multistatus xmlns:d="DAV:"><d:response><d:href>/</d:href>
<d:propstat><d:prop><d:current-user-principal><d:href>/123/principal/</d:href>
</d:current-user-principal></d:prop></d:propstat></d:response></d:multistatus>"""
HOME = """<?xml version="1.0"?><d:multistatus xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">
<d:response><d:href>/123/principal/</d:href><d:propstat><d:prop><c:calendar-home-set>
<d:href>https://p01-caldav.example.com/123/calendars/</d:href></c:calendar-home-set>
</d:prop></d:propstat></d:response></d:multistatus>"""
LIST = """<?xml version="1.0"?><d:multistatus xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">
<d:response><d:href>/123/calendars/</d:href><d:propstat><d:prop><d:resourcetype><d:collection/>
</d:resourcetype></d:prop></d:propstat></d:response>
<d:response><d:href>/123/calendars/home/</d:href><d:propstat><d:prop><d:resourcetype><d:collection/>
<c:calendar/></d:resourcetype><c:supported-calendar-component-set><c:comp name="VEVENT"/>
</c:supported-calendar-component-set></d:prop></d:propstat></d:response>
<d:response><d:href>/123/calendars/tasks/</d:href><d:propstat><d:prop><d:resourcetype><d:collection/>
<c:calendar/></d:resourcetype><c:supported-calendar-component-set><c:comp name="VTODO"/>
</c:supported-calendar-component-set></d:prop></d:propstat></d:response></d:multistatus>"""
EVENT = (
    "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:ical-1\r\n"
    "DTSTART;TZID=Europe/Berlin:20261005T093000\r\nDTEND;TZID=Europe/Berlin:20261005T103000\r\n"
    "SUMMARY:Zahnarzt\r\nLOCATION:Hauptstraße 1\\, Potsdam\r\n"
    "ORGANIZER:mailto:robin@example.org\r\n"
    "ATTENDEE;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:kona@example.org\r\n"
    "END:VEVENT\r\nEND:VCALENDAR\r\n"
)
REPORT = f"""<?xml version="1.0"?><d:multistatus xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">
<d:response><d:href>/123/calendars/home/ical-1.ics</d:href><d:propstat><d:prop>
<d:getetag>"e1"</d:getetag><c:calendar-data>{EVENT}</c:calendar-data></d:prop></d:propstat>
</d:response></d:multistatus>"""


async def test_a_caldav_calendar_of_a_car(
    hass: HomeAssistant, aioclient_mock: Any
) -> None:
    await hass.config.async_set_time_zone("Europe/Berlin")
    config = _config("caldav", url="https://caldav.example.com/")
    aioclient_mock.request("PROPFIND", "https://caldav.example.com/", text=PRINCIPAL)
    aioclient_mock.request(
        "PROPFIND", "https://caldav.example.com/123/principal/", text=HOME
    )
    aioclient_mock.request(
        "PROPFIND", "https://p01-caldav.example.com/123/calendars/", text=LIST
    )
    aioclient_mock.request(
        "REPORT", "https://p01-caldav.example.com/123/calendars/home/", text=REPORT
    )
    aioclient_mock.put(
        "https://p01-caldav.example.com/123/calendars/home/ical-1.ics", status=204
    )
    accounts = CarAccounts(hass, lambda: config, lambda: None)
    await accounts.async_load()
    assert await accounts.async_test("kona") == "no_secret"
    await accounts.async_set_password("kona", "app-password")
    start = dt_util.parse_datetime("2026-10-05T00:00:00+02:00")
    events = await accounts.async_events("kona", start, start + timedelta(days=1))
    (event,) = events
    assert event["location"] == "Hauptstraße 1, Potsdam"
    assert event["start"] == "2026-10-05T09:30:00+02:00"
    # Accepted by setting its own attendee (the server answers the organizer).
    (put,) = [c for c in aioclient_mock.mock_calls if c[0] == "PUT"]
    assert "PARTSTAT=ACCEPTED:mailto:kona@example.org" in put[2].decode()
    # The task list is not a trip calendar.
    assert accounts._data["kona"]["calendars"] == [
        "https://p01-caldav.example.com/123/calendars/home/"
    ]
    await accounts.async_remove()


def test_accepting_changes_only_the_own_attendee() -> None:
    text = (
        "BEGIN:VEVENT\r\nATTENDEE;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:kona@example.org\r\n"
        "ATTENDEE;PARTSTAT=ACCEPTED:mailto:robin@example.org\r\nEND:VEVENT\r\n"
    )
    result = accept_ics(text, "kona@example.org")
    assert "ATTENDEE;PARTSTAT=ACCEPTED:mailto:kona@example.org" in result
    assert "RSVP" not in result
    assert "ATTENDEE;PARTSTAT=ACCEPTED:mailto:robin@example.org" in result


async def test_sign_in_with_the_settings_in_the_editor(
    hass: HomeAssistant, aioclient_mock: Any, monkeypatch: pytest.MonkeyPatch
) -> None:
    """Saved as Outlook without an app; the editor shows iCloud and an own app."""
    from custom_components.energy_joe.accounts import AccountError
    from custom_components.energy_joe.mail import oauth

    monkeypatch.setattr(oauth, "JOE_CLIENT_ID", None)
    config = _config("outlook")
    accounts = CarAccounts(hass, lambda: config, lambda: None)
    await accounts.async_load()
    # No app of Joe's and none of one's own: the panel is told why.
    with pytest.raises(AccountError):
        await accounts.async_sign_in("kona")
    assert accounts.status["kona"]["oauth"] == {
        "state": "error",
        "error": "no_client_id",
    }
    # With the own app typed in the editor (not saved yet) it starts.
    login = "https://login.microsoftonline.com/consumers/oauth2/v2.0"
    aioclient_mock.post(
        f"{login}/devicecode",
        json={"user_code": "X-1", "device_code": "d", "interval": 0, "expires_in": 1},
    )
    aioclient_mock.post(f"{login}/token", json={"error": "authorization_pending"})
    draft = model.CAR_ACCOUNT({"kind": "outlook", "client_id": "own-app"})
    info = await accounts.async_sign_in("kona", draft)
    assert info["user_code"] == "X-1"
    assert aioclient_mock.mock_calls[0][2]["client_id"] == "own-app"
    accounts.async_stop()
    # A password stored while the editor shows iCloud counts as stored, even
    # though the saved kind still needs a sign-in.
    await accounts.async_set_password("kona", "app-password")
    status = accounts.status["kona"]
    assert status["has_password"] is True
    assert status["has_secret"] is False
    await accounts.async_remove()
