"""Tomorrow's trips: appointments with a place in the calendars, and how far.

The distance comes from the service the user picked in the panel: Waze
(through Home Assistant's own action, free), a Google travel time entry
(with its API key) or OpenStreetMap (Photon finds the place, OSRM the
route). Only the place text and the home position as the route's start
leave Home Assistant, never the title. Places that are zones need no
service: straight line times a detour factor. Results are kept per place;
distances the user corrected always win.
"""

from __future__ import annotations

import asyncio
from datetime import date, datetime, timedelta
import logging
from typing import Any
from urllib.parse import quote

from homeassistant.const import MAJOR_VERSION, MINOR_VERSION
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.location import find_coordinates
from homeassistant.helpers.storage import Store
from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util
from homeassistant.util.location import distance as straight

from ..const import DOMAIN

_LOGGER = logging.getLogger(__name__)

STORE_KEY = f"{DOMAIN}.places"
STORE_VERSION = 1
# Places are asked again after a month (corrections by the user never),
# places a service could not find after a few hours.
REFRESH = timedelta(days=30)
RETRY = timedelta(hours=6)
# Road distance against the straight line (Germany ~1.32, long trips ~1.2).
DETOUR = 1.3
DETOUR_LONG = 1.2
# Not a place to drive to.
ONLINE = (
    "http://",
    "https://",
    "teams",
    "zoom",
    "meet.google",
    "google meet",
    "webex",
    "skype",
    "online",
    "telefon",
    "phone",
)
TIMEOUT = 10
USER_AGENT = "EnergyJoe (+https://github.com/Marcels-Custom-Coding/Energy-Joe)"


def is_place(text: str | None) -> bool:
    """Whether an appointment's location is somewhere to drive to."""
    value = (text or "").strip().lower()
    return len(value) >= 3 and not any(word in value for word in ONLINE)


def normalize(text: str) -> str:
    return " ".join(text.strip().lower().split())


class PlaceStore:
    """Distances to places, kept between runs."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._store: Store[dict[str, Any]] = Store(hass, STORE_VERSION, STORE_KEY)
        self.places: dict[str, dict[str, Any]] = {}
        self._loaded = False
        # Places the service could not find: (service, place) -> when it was asked.
        self._failed: dict[tuple[str, str], datetime] = {}

    async def async_load(self) -> None:
        if not self._loaded:
            self.places = ((await self._store.async_load()) or {}).get("places", {})
            self._loaded = True

    def _save(self) -> None:
        self._store.async_delay_save(lambda: {"places": self.places}, 10)

    async def async_flush(self) -> None:
        """Write pending changes now (unload), so no delayed save fires later."""
        if self._loaded:
            await self._store.async_save({"places": self.places})

    async def async_remove(self) -> None:
        """Forget all places (integration removed)."""
        self.places = {}
        self._failed = {}
        self._loaded = False
        await self._store.async_remove()

    async def async_set(self, text: str, km: float | None) -> None:
        """The user's own distance for a place (None: ask the service again)."""
        await self.async_load()
        key = normalize(text)
        # Corrected or to be worked out again: no back-off for this place.
        self._failed = {k: v for k, v in self._failed.items() if k[1] != key}
        if km is None:
            self.places.pop(key, None)
        else:
            self.places[key] = {
                "text": text.strip(),
                "km": round(km, 1),
                "minutes": (self.places.get(key) or {}).get("minutes"),
                "source": "user",
                "at": dt_util.now().isoformat(timespec="seconds"),
            }
        self._save()

    async def async_distance(
        self, routing: dict[str, Any], text: str
    ) -> dict[str, Any] | None:
        """One way from home to a place: km, minutes and where it came from."""
        await self.async_load()
        key = normalize(text)
        found = self.places.get(key)
        asked = dt_util.parse_datetime(found["at"]) if found else None
        if found and (
            found["source"] == "user"
            or (asked is not None and dt_util.now() - asked < REFRESH)
        ):
            return found
        failed_key = (str(routing.get("service")), key)
        failed = self._failed.get(failed_key)
        if failed and dt_util.now() - failed < RETRY:
            return found
        result = await async_route(self._hass, routing, text)
        if result is None:
            self._failed[failed_key] = dt_util.now()
            return found
        self._failed.pop(failed_key, None)
        self.places[key] = {
            "text": text.strip(),
            **result,
            "at": dt_util.now().isoformat(timespec="seconds"),
        }
        self._save()
        return self.places[key]


async def async_trips(
    hass: HomeAssistant,
    config: dict[str, Any],
    need: dict[str, Any],
    places: PlaceStore,
    day: date,
    own: list[dict[str, Any]] | None = None,
) -> list[dict[str, Any]]:
    """The appointments with a place on a day, with the distance there (and back).

    From the car's own calendar (`own`: Joe's appointments of this car on the
    day), the car's further calendars and the chosen persons' calendars.
    """
    persons = [
        p
        for p in config["persons"]
        if p["calendars"] and (need["persons"] is None or p["id"] in need["persons"])
    ]
    own_calendars = (
        set(need.get("calendars") or []) if need.get("source", "ha") == "ha" else set()
    )
    calendars = sorted({c for p in persons for c in p["calendars"]} | own_calendars)
    if not hass.services.has_service("calendar", "get_events"):
        calendars = []
    if not calendars and not own:
        return []
    start = dt_util.start_of_local_day(day)
    span = {
        "start_date_time": start.isoformat(),
        "end_date_time": (start + timedelta(days=1)).isoformat(),
    }

    async def _events(entity_id: str) -> list[dict[str, Any]]:
        """One calendar at a time: one that does not answer only loses its own."""
        try:
            response = await hass.services.async_call(
                "calendar",
                "get_events",
                {"entity_id": entity_id, **span},
                blocking=True,
                return_response=True,
            )
        except Exception:  # noqa: BLE001 - a calendar that does not answer gives no trips
            _LOGGER.debug("Calendar %s did not answer", entity_id, exc_info=True)
            return []
        return [
            event
            for entry in (response or {}).values()
            for event in (entry or {}).get("events") or []
        ]

    found = [own or [], *await asyncio.gather(*(_events(c) for c in calendars))]
    seen: set[tuple[str, str]] = set()
    trips = []
    factor = 2 if need["round_trip"] else 1
    for events in found:
        for event in events:
            location = (event.get("location") or "").strip()
            when = _local_start(event.get("start"), day)
            # Only appointments that begin on the day (not one from yesterday
            # that runs on, like a stay of several days or a night shift).
            if when is None or not is_place(location):
                continue
            if (normalize(location), when) in seen:
                continue
            seen.add((normalize(location), when))
            place = await places.async_distance(config["routing"], location)
            trips.append(
                {
                    "start": when,
                    "location": location,
                    "km": round(place["km"] * factor, 1) if place else None,
                    "minutes": place.get("minutes") if place else None,
                    "source": place["source"] if place else None,
                }
            )
    trips.sort(key=lambda t: t["start"])
    return trips


def _local_start(value: Any, day: date) -> str | None:
    """An event's start as local time if it begins on the day, else None.

    The same moment in two calendars may come with different offsets.
    """
    text = str(value or "")
    if "T" not in text:
        return text if text == day.isoformat() else None
    moment = dt_util.parse_datetime(text)
    if moment is None:
        return None
    if moment.tzinfo is None:
        moment = moment.replace(tzinfo=dt_util.get_default_time_zone())
    local = dt_util.as_local(moment)
    return local.isoformat() if local.date() == day else None


async def async_route(
    hass: HomeAssistant, routing: dict[str, Any], text: str
) -> dict[str, Any] | None:
    """Ask the chosen service (or the zones) how far a place is."""
    home = (hass.config.latitude, hass.config.longitude)
    coordinates = find_coordinates(hass, text)
    if coordinates and coordinates != text:
        # A zone or an entity with a position: no service needed.
        try:
            lat, lon = (float(v) for v in coordinates.split(","))
        except ValueError:
            return None
        km = (straight(home[0], home[1], lat, lon) or 0.0) / 1000
        return {
            "km": round(km * (DETOUR if km <= 100 else DETOUR_LONG), 1),
            "minutes": None,
            "source": "zone",
        }
    service = routing.get("service")
    try:
        if service == "waze":
            return await _async_waze(hass, text)
        if service == "google" and routing.get("google_entry"):
            return await _async_google(hass, routing["google_entry"], text)
        if service == "osm":
            return await _async_osm(hass, routing, text)
    except Exception:  # noqa: BLE001 - a service that fails leaves the distance unknown
        _LOGGER.debug(
            "Distance to a place not available from %s", service, exc_info=True
        )
    return None


async def _async_waze(hass: HomeAssistant, text: str) -> dict[str, Any] | None:
    if not hass.services.has_service("waze_travel_time", "get_travel_times"):
        # From 2026.8 on the action works without a Waze entry.
        if (MAJOR_VERSION, MINOR_VERSION) < (2026, 8):
            return None
        await async_setup_component(hass, "waze_travel_time", {})
    data: dict[str, Any] = {
        "origin": "zone.home",
        "destination": text,
        "region": _region(hass.config.country),
        "units": "metric",
        "realtime": False,
    }
    if (MAJOR_VERSION, MINOR_VERSION) >= (2026, 5):
        # Without it Waze looks for the place around its region's default city.
        data["base_coordinates"] = {
            "latitude": hass.config.latitude,
            "longitude": hass.config.longitude,
        }
    response = await hass.services.async_call(
        "waze_travel_time",
        "get_travel_times",
        data,
        blocking=True,
        return_response=True,
    )
    routes = (response or {}).get("routes") or []
    if not routes:
        return None
    return {
        "km": round(float(routes[0]["distance"]), 1),
        "minutes": round(float(routes[0]["duration"])),
        "source": "waze",
    }


async def _async_google(
    hass: HomeAssistant, entry_id: str, text: str
) -> dict[str, Any] | None:
    response = await hass.services.async_call(
        "google_travel_time",
        "get_travel_times",
        {
            "config_entry_id": entry_id,
            "origin": "zone.home",
            "destination": text,
            "mode": "driving",
            "units": "metric",
        },
        blocking=True,
        return_response=True,
    )
    routes = (response or {}).get("routes") or []
    if not routes:
        return None
    return {
        "km": round(routes[0]["distance_meters"] / 1000, 1),
        "minutes": round(routes[0]["duration"] / 60),
        "source": "google",
    }


async def _async_osm(
    hass: HomeAssistant, routing: dict[str, Any], text: str
) -> dict[str, Any] | None:
    session = async_get_clientsession(hass)
    headers = {"User-Agent": USER_AGENT}
    lat, lon = hass.config.latitude, hass.config.longitude
    # The search only needs to know the area (about 1 km), not the house.
    url = (
        f"{routing['geocoder_url']}?q={quote(text)}"
        f"&lat={round(lat, 2)}&lon={round(lon, 2)}&limit=1"
    )
    async with asyncio.timeout(TIMEOUT):
        response = await session.get(url, headers=headers)
        response.raise_for_status()
        found = await response.json()
    features = (found or {}).get("features") or []
    if not features:
        return None
    to_lon, to_lat = features[0]["geometry"]["coordinates"][:2]
    # One request per second is the fair use of these free services.
    await asyncio.sleep(1)
    route_url = f"{routing['router_url']}{lon},{lat};{to_lon},{to_lat}?overview=false"
    async with asyncio.timeout(TIMEOUT):
        response = await session.get(route_url, headers=headers)
        response.raise_for_status()
        route = await response.json()
    routes = (route or {}).get("routes") or []
    if not routes:
        return None
    return {
        "km": round(routes[0]["distance"] / 1000, 1),
        "minutes": round(routes[0]["duration"] / 60),
        "source": "osm",
    }


def _region(country: str | None) -> str:
    """Waze's region for Home Assistant's country."""
    country = (country or "").upper()
    if country == "US":
        return "us"
    if country in ("CA", "MX"):
        return "na"
    if country == "IL":
        return "il"
    if country in ("AU", "NZ"):
        return "au"
    return "eu"
