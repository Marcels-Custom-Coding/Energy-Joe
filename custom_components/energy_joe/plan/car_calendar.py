"""Joe's own calendar for a car whose mailbox has no calendar.

Invitations to the car's address land here (see mail/), and appointments can
be added by hand in Home Assistant's calendar. Each car's calendar can be
subscribed to on a phone as an iCalendar link with a secret token. Times are stored as ISO
text: "2026-10-05T09:00:00+02:00" for a time, "2026-10-05" for a whole day
(the end of a whole day is exclusive, as in iCalendar).
"""

from __future__ import annotations

from datetime import date, datetime, timedelta
import secrets
from typing import Any
import uuid

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from ..const import DOMAIN

STORE_KEY = f"{DOMAIN}.calendar"
STORE_VERSION = 1
# Past appointments are kept this long (the history shows what was driven).
KEEP = timedelta(days=60)


def mailbox_cars(config: dict[str, Any]) -> list[dict[str, Any]]:
    """Cars charged by need whose mailbox has no calendar: each gets Joe's."""
    return [
        a
        for a in config["actions"]
        if a["kind"] == "switch"
        and (a.get("need") or {}).get("enabled")
        and a["need"].get("source") == "mailbox"
    ]


def calendar_cars(
    config: dict[str, Any], store: CarCalendarStore, now: datetime | None = None
) -> list[dict[str, Any]]:
    """Cars that have Joe's calendar: a mailbox without calendar, or (up to 0.3
    every car had one) trips entered by hand there that are still to come."""
    now = now or dt_util.now()
    return [
        a
        for a in config["actions"]
        if a["kind"] == "switch"
        and (a.get("need") or {}).get("enabled")
        and (
            a["need"].get("source") == "mailbox"
            or any(e.get("source") == "manual" for e in store.events(a["id"], now))
        )
    ]


def parse_when(value: str) -> datetime | date:
    """A stored time: a whole day as a date, else a time with its zone."""
    if "T" not in value:
        return date.fromisoformat(value)
    moment = dt_util.parse_datetime(value)
    if moment is None:
        raise ValueError(f"not a time: {value}")
    if moment.tzinfo is None:
        moment = moment.replace(tzinfo=dt_util.get_default_time_zone())
    return moment


def as_text(value: datetime | date) -> str:
    if isinstance(value, datetime):
        if value.tzinfo is None:
            value = value.replace(tzinfo=dt_util.get_default_time_zone())
        return dt_util.as_local(value).isoformat(timespec="seconds")
    return value.isoformat()


def _bounds(event: dict[str, Any]) -> tuple[datetime, datetime]:
    """Start and end as local times (a whole day from midnight to midnight)."""
    result = []
    for key in ("start", "end"):
        value = parse_when(event[key])
        if not isinstance(value, datetime):
            value = dt_util.start_of_local_day(value)
        result.append(value)
    return result[0], result[1]


class CarCalendarStore:
    """The appointments of every car, and the secret of the subscription links."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._store: Store[dict[str, Any]] = Store(hass, STORE_VERSION, STORE_KEY)
        self.cars: dict[str, list[dict[str, Any]]] = {}
        self.token: str | None = None
        self._loaded = False
        self._listeners: list[Any] = []

    async def async_load(self) -> None:
        if self._loaded:
            return
        data = await self._store.async_load() or {}
        self.cars = data.get("cars", {})
        self.token = data.get("token")
        self._loaded = True
        if not self.token:
            self.token = secrets.token_urlsafe(24)
            self._save()

    def _data(self) -> dict[str, Any]:
        return {"cars": self.cars, "token": self.token}

    def _save(self) -> None:
        self._store.async_delay_save(self._data, 5)
        for listener in list(self._listeners):
            listener()

    def listen(self, listener: Any) -> Any:
        """Called after every change (the calendar entities update)."""
        self._listeners.append(listener)
        return lambda: self._listeners.remove(listener)

    async def async_flush(self) -> None:
        if self._loaded:
            await self._store.async_save(self._data())

    async def async_remove(self) -> None:
        self.cars, self.token, self._loaded = {}, None, False
        await self._store.async_remove()

    def new_token(self) -> str:
        """A new subscription secret: old links stop working."""
        self.token = secrets.token_urlsafe(24)
        self._save()
        return self.token

    # --- appointments ------------------------------------------------------

    def events(
        self, car: str, start: datetime | None = None, end: datetime | None = None
    ) -> list[dict[str, Any]]:
        """A car's appointments that overlap a span (all of them without one)."""
        found = []
        for event in self.cars.get(car, []):
            if event.get("status") == "cancelled":
                continue
            first, last = _bounds(event)
            if start is not None and last <= start:
                continue
            if end is not None and first >= end:
                continue
            found.append(event)
        return sorted(found, key=lambda e: _bounds(e)[0])

    def add(self, car: str, event: dict[str, Any]) -> dict[str, Any]:
        """A new appointment (a uid is made up if it has none)."""
        entry = {
            "uid": event.get("uid") or f"{uuid.uuid4()}@energy-joe",
            "summary": event.get("summary") or "",
            "start": event["start"],
            "end": event["end"],
            "location": event.get("location") or "",
            "description": event.get("description") or "",
            "source": event.get("source") or "manual",
            "sequence": int(event.get("sequence") or 0),
            "organizer": event.get("organizer"),
            "status": event.get("status") or "confirmed",
            # An invitation by mail that Joe accepted.
            "accepted": bool(event.get("accepted")),
        }
        events = [e for e in self.cars.get(car, []) if e["uid"] != entry["uid"]]
        events.append(entry)
        self.cars[car] = self._pruned(events)
        self._save()
        return entry

    def update(
        self, car: str, uid: str, changes: dict[str, Any]
    ) -> dict[str, Any] | None:
        for event in self.cars.get(car, []):
            if event["uid"] == uid:
                event.update(
                    {k: v for k, v in changes.items() if k != "uid" and v is not None}
                )
                self._save()
                return event
        return None

    def delete(self, car: str, uid: str) -> bool:
        events = self.cars.get(car, [])
        kept = [e for e in events if e["uid"] != uid]
        if len(kept) == len(events):
            return False
        self.cars[car] = kept
        self._save()
        return True

    def get(self, car: str, uid: str) -> dict[str, Any] | None:
        """One of a car's appointments (an update may come by mail)."""
        return next((e for e in self.cars.get(car, []) if e["uid"] == uid), None)

    def forget_car(self, car: str) -> None:
        if self.cars.pop(car, None) is not None:
            self._save()

    @staticmethod
    def _pruned(events: list[dict[str, Any]]) -> list[dict[str, Any]]:
        limit = dt_util.now() - KEEP
        return [e for e in events if _bounds(e)[1] >= limit]


# --- the subscription link (iCalendar, RFC 5545) ----------------------------


def _escape(text: str) -> str:
    return (
        text.replace("\\", "\\\\")
        .replace(";", "\\;")
        .replace(",", "\\,")
        .replace("\r\n", "\\n")
        .replace("\n", "\\n")
    )


def _fold(line: str) -> str:
    """Lines longer than 75 octets continue on the next line after a space."""
    raw = line.encode()
    if len(raw) <= 75:
        return line
    parts, current = [], b""
    for char in line:
        encoded = char.encode()
        if len(current) + len(encoded) > (75 if not parts else 74):
            parts.append(current.decode())
            current = b""
        current += encoded
    parts.append(current.decode())
    return "\r\n ".join(parts)


def _ics_time(value: str, key: str) -> str:
    when = parse_when(value)
    if isinstance(when, datetime):
        return f"{key}:{dt_util.as_utc(when).strftime('%Y%m%dT%H%M%SZ')}"
    return f"{key};VALUE=DATE:{when.strftime('%Y%m%d')}"


def to_ics(name: str, events: list[dict[str, Any]]) -> str:
    """A car's appointments as an iCalendar file to subscribe to."""
    stamp = dt_util.utcnow().strftime("%Y%m%dT%H%M%SZ")
    lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Energy Joe//Car calendar//DE",
        "CALSCALE:GREGORIAN",
        f"X-WR-CALNAME:{_escape(name)}",
    ]
    for event in events:
        lines += [
            "BEGIN:VEVENT",
            f"UID:{_escape(event['uid'])}",
            f"DTSTAMP:{stamp}",
            _ics_time(event["start"], "DTSTART"),
            _ics_time(event["end"], "DTEND"),
            f"SUMMARY:{_escape(event.get('summary') or '')}",
        ]
        if event.get("location"):
            lines.append(f"LOCATION:{_escape(event['location'])}")
        if event.get("description"):
            lines.append(f"DESCRIPTION:{_escape(event['description'])}")
        lines.append(f"SEQUENCE:{int(event.get('sequence') or 0)}")
        lines.append("END:VEVENT")
    lines.append("END:VCALENDAR")
    return "\r\n".join(_fold(line) for line in lines) + "\r\n"
