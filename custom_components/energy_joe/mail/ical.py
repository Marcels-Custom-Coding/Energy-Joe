"""Calendar invitations by mail (iMIP, RFC 6047): read them and answer them.

Only what Joe needs: the method (REQUEST, CANCEL), and per event its uid,
sequence, start and end, title, place, organizer and attendees. Times come
in UTC ("...Z"), with a zone ("TZID=Europe/Berlin", Outlook also writes
Windows names like "W. Europe Standard Time"), floating (local) or as whole
days. A repeating appointment counts with its first date.
"""

from __future__ import annotations

import contextlib
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
import re
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from homeassistant.util import dt as dt_util

# Outlook and Exchange name zones the Windows way.
WINDOWS_ZONES = {
    "W. Europe Standard Time": "Europe/Berlin",
    "Central Europe Standard Time": "Europe/Budapest",
    "Central European Standard Time": "Europe/Warsaw",
    "Romance Standard Time": "Europe/Paris",
    "GMT Standard Time": "Europe/London",
    "Greenwich Standard Time": "Atlantic/Reykjavik",
    "E. Europe Standard Time": "Europe/Chisinau",
    "FLE Standard Time": "Europe/Kiev",
    "GTB Standard Time": "Europe/Bucharest",
    "Russian Standard Time": "Europe/Moscow",
    "Eastern Standard Time": "America/New_York",
    "Central Standard Time": "America/Chicago",
    "Mountain Standard Time": "America/Denver",
    "Pacific Standard Time": "America/Los_Angeles",
    "UTC": "UTC",
    "Coordinated Universal Time": "UTC",
}
_DURATION = re.compile(
    r"^(?P<sign>[+-])?P(?:(?P<weeks>\d+)W)?(?:(?P<days>\d+)D)?"
    r"(?:T(?:(?P<hours>\d+)H)?(?:(?P<minutes>\d+)M)?(?:(?P<seconds>\d+)S)?)?$"
)


@dataclass(slots=True)
class Invitation:
    """One event of an invitation."""

    method: str
    uid: str
    sequence: int = 0
    start: datetime | date | None = None
    end: datetime | date | None = None
    summary: str = ""
    location: str = ""
    description: str = ""
    organizer: str | None = None
    attendees: list[str] = field(default_factory=list)
    status: str = "CONFIRMED"
    recurring: bool = False


def _unfold(text: str) -> list[str]:
    lines: list[str] = []
    for raw in text.replace("\r\n", "\n").replace("\r", "\n").split("\n"):
        if raw[:1] in (" ", "\t") and lines:
            lines[-1] += raw[1:]
        elif raw:
            lines.append(raw)
    return lines


def _split(line: str) -> tuple[str, dict[str, str], str]:
    """'DTSTART;TZID=Europe/Berlin:20261005T090000' -> name, params, value."""
    # A colon inside a quoted parameter does not end the name part.
    quoted = False
    for index, char in enumerate(line):
        if char == '"':
            quoted = not quoted
        elif char == ":" and not quoted:
            head, value = line[:index], line[index + 1 :]
            break
    else:
        return line.upper(), {}, ""
    parts = head.split(";")
    params = {}
    for part in parts[1:]:
        key, _, val = part.partition("=")
        params[key.upper()] = val.strip('"')
    return parts[0].upper(), params, value


def _text(value: str) -> str:
    return (
        value.replace("\\n", "\n")
        .replace("\\N", "\n")
        .replace("\\,", ",")
        .replace("\\;", ";")
        .replace("\\\\", "\\")
    )


def _zone(name: str | None) -> ZoneInfo | None:
    if not name:
        return None
    name = WINDOWS_ZONES.get(name, name)
    try:
        return ZoneInfo(name)
    except ZoneInfoNotFoundError, ValueError:
        return None


def _when(value: str, params: dict[str, str]) -> datetime | date | None:
    value = value.strip()
    try:
        if params.get("VALUE") == "DATE" or len(value) == 8:
            return datetime.strptime(value, "%Y%m%d").date()
        if value.endswith("Z"):
            return datetime.strptime(value, "%Y%m%dT%H%M%SZ").replace(
                tzinfo=dt_util.UTC
            )
        moment = datetime.strptime(value[:15], "%Y%m%dT%H%M%S")
    except ValueError:
        return None
    zone = _zone(params.get("TZID")) or dt_util.get_default_time_zone()
    return moment.replace(tzinfo=zone)


def _duration(value: str) -> timedelta | None:
    match = _DURATION.match(value.strip())
    if not match:
        return None
    parts = {k: int(v) for k, v in match.groupdict().items() if v and k != "sign"}
    delta = timedelta(
        weeks=parts.get("weeks", 0),
        days=parts.get("days", 0),
        hours=parts.get("hours", 0),
        minutes=parts.get("minutes", 0),
        seconds=parts.get("seconds", 0),
    )
    return -delta if match.group("sign") == "-" else delta


def _address(value: str) -> str:
    value = value.strip()
    if value.lower().startswith("mailto:"):
        value = value[7:]
    return value.strip().lower()


def parse(text: str) -> list[Invitation]:
    """The events of an iCalendar text (an invitation's attachment)."""
    method = "PUBLISH"
    found: list[Invitation] = []
    current: Invitation | None = None
    duration: timedelta | None = None
    depth = 0
    for line in _unfold(text):
        name, params, value = _split(line)
        if name == "BEGIN":
            if value.upper() == "VEVENT" and depth == 0:
                current = Invitation(method=method, uid="")
                duration = None
            elif current is not None:
                depth += 1  # an alarm or similar inside the event
            continue
        if name == "END":
            if current is not None and depth:
                depth -= 1
            elif current is not None and value.upper() == "VEVENT":
                if current.end is None and current.start is not None:
                    if duration is not None:
                        current.end = current.start + duration
                    elif isinstance(current.start, datetime):
                        current.end = current.start
                    else:
                        current.end = current.start + timedelta(days=1)
                if current.uid:
                    found.append(current)
                current = None
            continue
        if name == "METHOD" and current is None:
            method = value.strip().upper()
            continue
        if current is None or depth:
            continue
        if name == "UID":
            current.uid = value.strip()
        elif name == "SEQUENCE":
            with contextlib.suppress(ValueError):
                current.sequence = int(value)
        elif name == "DTSTART":
            current.start = _when(value, params)
        elif name == "DTEND":
            current.end = _when(value, params)
        elif name == "DURATION":
            duration = _duration(value)
        elif name == "SUMMARY":
            current.summary = _text(value)
        elif name == "LOCATION":
            current.location = _text(value)
        elif name == "DESCRIPTION":
            current.description = _text(value)
        elif name == "ORGANIZER":
            current.organizer = _address(value)
        elif name == "ATTENDEE":
            current.attendees.append(_address(value))
        elif name == "STATUS":
            current.status = value.strip().upper()
        elif name in ("RRULE", "RDATE"):
            current.recurring = True
    for invitation in found:
        invitation.method = method
    return found


def _escape(text: str) -> str:
    return (
        text.replace("\\", "\\\\")
        .replace(";", "\\;")
        .replace(",", "\\,")
        .replace("\n", "\\n")
    )


def _stamp(value: datetime | date | None, key: str) -> str | None:
    if value is None:
        return None
    if isinstance(value, datetime):
        return f"{key}:{dt_util.as_utc(value).strftime('%Y%m%dT%H%M%SZ')}"
    return f"{key};VALUE=DATE:{value.strftime('%Y%m%d')}"


def reply(invitation: Invitation, attendee: str, accepted: bool = True) -> str:
    """The answer to an invitation: this attendee accepts (or declines)."""
    lines = [
        "BEGIN:VCALENDAR",
        "PRODID:-//Energy Joe//Mailbox//DE",
        "VERSION:2.0",
        "METHOD:REPLY",
        "BEGIN:VEVENT",
        f"UID:{invitation.uid}",
        f"DTSTAMP:{dt_util.utcnow().strftime('%Y%m%dT%H%M%SZ')}",
        f"SEQUENCE:{invitation.sequence}",
    ]
    for line in (_stamp(invitation.start, "DTSTART"), _stamp(invitation.end, "DTEND")):
        if line:
            lines.append(line)
    if invitation.organizer:
        lines.append(f"ORGANIZER:mailto:{invitation.organizer}")
    state = "ACCEPTED" if accepted else "DECLINED"
    lines.append(f"ATTENDEE;PARTSTAT={state}:mailto:{attendee}")
    if invitation.summary:
        lines.append(f"SUMMARY:{_escape(invitation.summary)}")
    lines += ["END:VEVENT", "END:VCALENDAR"]
    return "\r\n".join(lines) + "\r\n"
