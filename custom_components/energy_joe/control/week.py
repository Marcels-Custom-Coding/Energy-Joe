"""Weekly profiles of air conditioners and a thermostat's own profiles (the "Klima" page).

An air conditioner gets six profiles per mode (heating, cooling), each a
temperature curve over the day: the same for every day, one for weekdays and
one for the weekend, or one for each day. Ticks say what a profile is for: a
normal day, a holiday, nobody home, a day in the home office. Homematic IP
thermostats bring profiles of their own (the presets week_program_N); the
same ticks pick among them.

This module holds the plain logic: checking profiles, the value of a curve at
a time, which profile applies, and a first suggestion for a device.
"""

from __future__ import annotations

from copy import deepcopy
from itertools import pairwise
import math
import re
from typing import Any

import voluptuous as vol

TAGS = ("normal", "holiday", "away", "home_office")
# How a profile divides the week, and how many day curves that needs: all days
# alike, Monday–Friday and Saturday–Sunday, or every day (Monday first).
SPLITS = {"all": 1, "week_weekend": 2, "each": 7}
MODES = ("heat", "cool")
PROFILE_COUNT = 6
MAX_POINTS = 12
STEP_MIN = 5
LAST_MINUTE = 24 * 60 - STEP_MIN
LOWEST_C = 5.0
HIGHEST_C = 35.0
NAME_MAX = 30
OFF = "off"
SUNDAY = 6
# A thermostat's own weekly profiles (Homematic IP).
WEEK_PROGRAM = re.compile(r"^week_program_(\d+)$")
# Suggested targets when the device does not tell one (°C).
DEFAULT_C = {"heat": 21.0, "cool": 25.0}
# Calendar labels that mean nobody comes home today as usual.
TRIP_LABELS = ("vacation", "travel")


# --- checking ---------------------------------------------------------------


def _number(value: Any) -> bool:
    return isinstance(value, int | float) and not isinstance(value, bool)


def point(value: Any) -> list[Any]:
    """A switching point [minute of the day, °C or "off"]."""
    if not isinstance(value, list | tuple) or len(value) != 2:
        raise vol.Invalid("a point is [minute, value]")
    minute, target = value
    if isinstance(minute, float) and minute.is_integer():
        minute = int(minute)
    if (
        not isinstance(minute, int)
        or isinstance(minute, bool)
        or not 0 <= minute <= LAST_MINUTE
        or minute % STEP_MIN
    ):
        raise vol.Invalid(
            f"minute {minute} is no time of day in steps of {STEP_MIN} minutes"
        )
    if target == OFF:
        return [minute, OFF]
    if not _number(target):
        raise vol.Invalid(f"value {target!r} is neither a temperature nor off")
    target = round(float(target), 1)
    if not LOWEST_C <= target <= HIGHEST_C:
        raise vol.Invalid(f"{target} °C is outside {LOWEST_C:g}–{HIGHEST_C:g} °C")
    return [minute, target]


def curve(value: Any) -> list[list[Any]]:
    """A day: 1 to 12 points in order, the first at 00:00."""
    if not isinstance(value, list) or not 1 <= len(value) <= MAX_POINTS:
        raise vol.Invalid(f"a day has 1 to {MAX_POINTS} points")
    points = []
    for index, item in enumerate(value):
        try:
            points.append(point(item))
        except vol.Invalid as err:
            raise vol.Invalid(err.msg, path=[index]) from None
    if points[0][0] != 0:
        raise vol.Invalid("a day starts at 00:00")
    if any(first[0] >= second[0] for first, second in pairwise(points)):
        raise vol.Invalid("points must be in order, each time once")
    return points


def _tags(value: Any) -> list[str]:
    if not isinstance(value, list):
        raise vol.Invalid("tags are a list")
    for tag in value:
        if tag not in TAGS:
            raise vol.Invalid(f"unknown tag: {tag}")
    if len(set(value)) != len(value):
        raise vol.Invalid("a tag is listed twice")
    return list(value)


def _once(items: list[tuple[Any, list[str]]], what: str) -> None:
    """Every tag on one profile at most."""
    seen: set[str] = set()
    for key, tags in items:
        for tag in tags:
            if tag in seen:
                raise vol.Invalid(f"tag {tag} is set on more than one {what}", [key])
            seen.add(tag)


_NAME = vol.All(str, vol.Length(max=NAME_MAX))
_PROFILE = vol.Schema(
    {
        vol.Optional("name", default=""): _NAME,
        vol.Optional("tags", default=list): _tags,
        vol.Optional("split", default="all"): vol.In(tuple(SPLITS)),
        vol.Required("curves"): list,
    }
)
_DEVICE_PROFILE = vol.Schema(
    {
        vol.Optional("name", default=""): _NAME,
        vol.Optional("tags", default=list): _tags,
    }
)


def profile(value: Any) -> dict[str, Any]:
    """One profile: name, ticks, how it divides the week and its day curves."""
    data = _PROFILE(value)
    days = SPLITS[data["split"]]
    if len(data["curves"]) != days:
        raise vol.Invalid(
            f"split {data['split']} needs {days} day curves, not {len(data['curves'])}",
            ["curves"],
        )
    curves = []
    for index, item in enumerate(data["curves"]):
        try:
            curves.append(curve(item))
        except vol.Invalid as err:
            raise vol.Invalid(err.msg, ["curves", index, *err.path]) from None
    return {**data, "curves": curves}


def profile_set(value: Any) -> list[dict[str, Any]]:
    """The six profiles of one mode; every tick on one of them at most."""
    if not isinstance(value, list) or len(value) != PROFILE_COUNT:
        raise vol.Invalid(f"a mode has exactly {PROFILE_COUNT} profiles")
    profiles = []
    for index, item in enumerate(value):
        try:
            profiles.append(profile(item))
        except vol.Invalid as err:
            raise vol.Invalid(err.msg, [index, *err.path]) from None
    _once([(i, p["tags"]) for i, p in enumerate(profiles)], "profile")
    return profiles


def device_profiles(value: Any) -> dict[str, dict[str, Any]]:
    """Ticks on a thermostat's own profiles, by preset; each tick once at most."""
    if not isinstance(value, dict):
        raise vol.Invalid("expected a dictionary of presets")
    result = {}
    for preset, item in value.items():
        if not isinstance(preset, str) or not preset:
            raise vol.Invalid("a preset needs a name")
        try:
            result[preset] = _DEVICE_PROFILE(item)
        except vol.Invalid as err:
            raise vol.Invalid(err.msg, [preset, *err.path]) from None
    _once([(p, entry["tags"]) for p, entry in result.items()], "preset")
    return result


# --- curves -------------------------------------------------------------------


def day_curve(item: dict[str, Any], weekday: int) -> list[list[Any]]:
    """The curve of a profile for a weekday (0 Monday … 6 Sunday)."""
    curves = item["curves"]
    if item["split"] == "each":
        return curves[weekday]
    if item["split"] == "week_weekend":
        return curves[1 if weekday >= 5 else 0]
    return curves[0]


def active(points: list[list[Any]], minute: int) -> list[Any]:
    """The point in force at a minute of the day: the last one not after it."""
    found = points[0]
    for item in points:
        if item[0] > minute:
            break
        found = item
    return found


def following(points: list[list[Any]], minute: int) -> list[Any] | None:
    """The next point later today."""
    return next((item for item in points if item[0] > minute), None)


def tagged(profiles: list[dict[str, Any]], tag: str) -> int | None:
    return next((i for i, item in enumerate(profiles) if tag in item["tags"]), None)


def clock(minute: int) -> str:
    return f"{minute // 60:02d}:{minute % 60:02d}"


def _target(mode: str, value: Any) -> dict[str, Any]:
    return {"hvac": OFF} if value == OFF else {"hvac": mode, "temperature": value}


def _shifted(value: Any, mode: str, kelvin: float) -> Any:
    """A value lowered (cooling: raised) for nobody home."""
    if value == OFF:
        return OFF
    return round(value + kelvin if mode == "cool" else value - kelvin, 1)


def home_profile(
    profiles: list[dict[str, Any]],
    *,
    hold: int | None = None,
    holiday: bool = False,
    home_office: bool = False,
    weekend: bool = False,
) -> tuple[int, str, bool]:
    """The profile while people are home: its index, why, and whether Sunday's
    curve stands in (a holiday without a profile of its own)."""
    if hold is not None and 0 <= hold < len(profiles):
        return hold, "held", False
    normal = tagged(profiles, "normal")
    normal = 0 if normal is None else normal
    if holiday:
        found = tagged(profiles, "holiday")
        return (normal, "holiday", True) if found is None else (found, "holiday", False)
    if home_office and (found := tagged(profiles, "home_office")) is not None:
        return found, "home_office", False
    return normal, "weekend" if weekend else "home", False


def choose(
    profiles: list[dict[str, Any]],
    mode: str,
    *,
    weekday: int,
    minute: int,
    night: bool = False,
    away: bool = False,
    away_off: bool = False,
    setback_k: float = 3.0,
    hold: int | None = None,
    holiday: bool = False,
    home_office: bool = False,
) -> dict[str, Any]:
    """What a room on weekly profiles should do now, in this order: the night,
    nobody home, a profile chosen by hand, a holiday, the home office, else
    the normal profile.

    Returns the situation ("lage"), why, the profile shown (None: none), the
    target ({"hvac", "temperature"?}), the next point today and the basis: what
    the target rests on (a change of it ends a change by hand).
    """
    index, why, sunday = home_profile(
        profiles,
        hold=hold,
        holiday=holiday,
        home_office=home_office,
        weekend=weekday >= 5,
    )
    lage = {"held": "held", "holiday": "holiday", "home_office": "home_office"}.get(
        why, "normal"
    )
    points = day_curve(profiles[index], SUNDAY if sunday else weekday)
    shown: int | None = index
    shift = None
    if night:
        return {
            "lage": "night",
            "why": "night",
            "index": None,
            "held": False,
            "target": {"hvac": OFF},
            "next": None,
            # No weekday: a change by hand at night lasts until the night ends.
            "basis": ["night", mode, None, None, None],
        }
    if away:
        lage = why = "away"
        found = tagged(profiles, "away")
        if found is not None:
            index = shown = found
            points = day_curve(profiles[found], weekday)
        elif away_off:
            return {
                "lage": "away",
                "why": "away",
                "index": None,
                "held": False,
                "target": {"hvac": OFF},
                "next": None,
                "basis": ["away", mode, None, None, None],
            }
        else:
            # Without a profile for it: the home profile, lowered (cooling: raised).
            shown = None
            shift = setback_k
    now = active(points, minute)
    later = following(points, minute)
    value, upcoming = now[1], later[1] if later else None
    if shift is not None:
        value = _shifted(value, mode, shift)
        upcoming = _shifted(upcoming, mode, shift) if later else None
    return {
        "lage": lage,
        "why": why,
        "index": shown,
        "held": lage == "held",
        "target": _target(mode, value),
        "next": {"minute": later[0], "value": upcoming} if later else None,
        "basis": [lage, mode, index, weekday, now[0]],
    }


# --- a thermostat's own profiles ----------------------------------------------


def week_presets(preset_modes: list[str]) -> list[str]:
    """A device's weekly profiles (week_program_N), in their order."""
    found = [
        (int(hit.group(1)), name)
        for name in preset_modes or []
        if (hit := WEEK_PROGRAM.match(str(name)))
    ]
    return [name for _, name in sorted(found)]


def preset_tags(
    profiles: dict[str, dict[str, Any]], presets: list[str]
) -> dict[str, str]:
    """Tick -> preset, for the presets the device has."""
    found: dict[str, str] = {}
    for name, entry in profiles.items():
        if name in presets:
            for tag in entry.get("tags") or []:
                found.setdefault(tag, name)
    return found


def device_choice(
    profiles: dict[str, dict[str, Any]],
    presets: list[str],
    *,
    away: bool = False,
    away_off: bool = False,
    holiday: bool = False,
    home_office: bool = False,
) -> tuple[str, dict[str, Any] | None]:
    """The situation and the target of a thermostat with its own profiles:
    {"hvac": "auto", "preset"} or {"hvac": "off"}; None leaves it as it is."""
    tags = preset_tags(profiles, presets)
    if away:
        if "away" in tags:
            return "away", {"hvac": "auto", "preset": tags["away"]}
        return "away", {"hvac": OFF} if away_off else None
    if holiday:
        lage = "holiday"
    elif home_office and "home_office" in tags:
        lage = "home_office"
    else:
        lage = "normal"
    preset = tags.get(lage) or tags.get("normal")
    return lage, {"hvac": "auto", "preset": preset} if preset else None


# --- calendars ------------------------------------------------------------------


def _rules(config: dict[str, Any], person: dict[str, Any]) -> dict[str, Any]:
    return person.get("calendar") or config["calendar"]


def home_office_readers(config: dict[str, Any]) -> list[dict[str, Any]]:
    """The persons whose calendars can tell a home office day (they have
    calendars, and the home office is not their usual working day)."""
    return [
        p
        for p in config.get("persons") or []
        if p.get("calendars") and _rules(config, p)["default_workday"] != "home_office"
    ]


def home_office_available(config: dict[str, Any]) -> tuple[bool, str | None]:
    """Whether a home office day can be told from the calendars, else why not:
    "no_calendar", or "default" (the home office is everyone's usual day)."""
    readers = [p for p in config.get("persons") or [] if p.get("calendars")]
    if not readers:
        return False, "no_calendar"
    if any(_rules(config, p)["default_workday"] != "home_office" for p in readers):
        return True, None
    return False, "default"


def home_office_persons(
    config: dict[str, Any], labels: dict[str, dict[str, Any]]
) -> list[str]:
    """Who works at home today by a calendar entry (not by their usual day)."""
    return [
        p["name"]
        for p in config.get("persons") or []
        if p.get("calendars")
        and _rules(config, p)["default_workday"] != "home_office"
        and (entry := labels.get(p["id"]))
        and entry.get("source") == "calendar"
        and entry.get("label") == "home_office"
    ]


def on_trip(labels: dict[str, dict[str, Any]]) -> bool:
    """Someone's calendar says vacation or a journey today."""
    return any(
        entry.get("source") == "calendar" and entry.get("label") in TRIP_LABELS
        for entry in labels.values()
    )


# --- a first suggestion -----------------------------------------------------------


def _minute(text: str) -> int:
    hour, _, minute = text.partition(":")
    value = int(hour) * 60 + int(minute or 0)
    return min(LAST_MINUTE, round(value / STEP_MIN) * STEP_MIN)


def fit_value(
    value: float,
    step: float | None = None,
    low: float | None = None,
    high: float | None = None,
) -> float:
    """A temperature as a device takes it: on its step, within its limits
    (and within Joe's own)."""
    if _number(step) and step and step > 0:
        value = math.floor(value / step + 0.5) * step
    if _number(low):
        value = max(value, float(low))
    if _number(high):
        value = min(value, float(high))
    return round(min(HIGHEST_C, max(LOWEST_C, value)), 1)


def suggest(
    mode: str,
    temperature: float | None,
    room: dict[str, Any],
    home_office: bool,
    german: bool = True,
    limits: dict[str, Any] | None = None,
) -> list[dict[str, Any]]:
    """Six profiles to start from: normal (with the room's night off), holiday,
    away, home office and two spare ones, all days alike; within the device's
    `limits` (min_temp, max_temp, target_temp_step)."""
    limits = limits or {}

    def fit(value: float) -> float:
        return fit_value(
            value,
            limits.get("target_temp_step"),
            limits.get("min_temp"),
            limits.get("max_temp"),
        )

    value = DEFAULT_C[mode]
    if isinstance(temperature, int | float) and not isinstance(temperature, bool):
        value = round(float(temperature), 1)
    value = fit(value)
    normal: list[list[Any]] = [[0, value]]
    if room.get("night_off"):
        start = _minute(room.get("night_from") or "23:00")
        end = _minute(room.get("night_until") or "06:30")
        if start != end:
            # Midnight lies in the night when it runs over it (or starts there).
            points = {0: OFF if start > end or start == 0 else value}
            points[end] = value
            points[start] = OFF
            normal = [[m, points[m]] for m in sorted(points)]
    setback = float(room.get("setback_k") or 3.0)
    away: Any = (
        OFF if room.get("away") == "off" else fit(_shifted(value, mode, setback))
    )
    names = (
        ("Normal", "Feiertag", "Abwesend", "Home Office", "Profil 5", "Profil 6")
        if german
        else ("Normal", "Holiday", "Away", "Home office", "Profile 5", "Profile 6")
    )
    tags: list[list[str]] = [
        ["normal"],
        ["holiday"],
        ["away"],
        ["home_office"] if home_office else [],
        [],
        [],
    ]
    curves = [normal, normal, [[0, away]], normal, normal, normal]
    return [
        {"name": name, "tags": tag, "split": "all", "curves": [deepcopy(points)]}
        for name, tag, points in zip(names, tags, curves, strict=True)
    ]
