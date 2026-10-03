"""Prices of a dynamic tariff: per quarter hour or hour, from many integrations.

Most integrations list their prices in an attribute of the price sensor (Nord
Pool from HACS, EPEX Spot, ENTSO-E, Octopus, aWATTar and others with a list of
start times and prices). Tibber, the Nord Pool integration of Home Assistant,
EnergyZero and easyEnergy answer through an action instead. Everything ends up
as a list of slots with a price per kWh (plus the surcharge the user set).
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, timedelta
import logging
from statistics import median
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util

_LOGGER = logging.getLogger(__name__)

# Keys of a price list's items: when a slot starts and ends, and its price.
START_KEYS = (
    "start",
    "start_time",
    "starts_at",
    "startsAt",
    "from",
    "valid_from",
    "time",
    "timestamp",
    "datetime",
)
END_KEYS = ("end", "end_time", "ends_at", "endsAt", "to", "valid_to", "till", "until")
# Price keys with the factor that turns them into a price per kWh (None: by unit).
PRICE_KEYS: tuple[tuple[str, float | None], ...] = (
    ("price_per_kwh", 1.0),
    ("value_inc_vat", None),
    ("total", None),
    ("price", None),
    ("value", None),
    ("rate", None),
    ("price_ct_per_kwh", 0.01),
    ("price_eur_per_mwh", 0.001),
    ("marketprice", 0.001),
    ("per_kwh", 0.01),
)
# Attributes that hold such lists (checked first; other lists are tried as well).
LIST_ATTRIBUTES = (
    "raw_today",
    "raw_tomorrow",
    "data",
    "prices_today",
    "prices_tomorrow",
    "prices",
    "rates",
    "forecast",
    "today",
    "tomorrow",
)


@dataclass(slots=True, frozen=True)
class Slot:
    """A time span with one price per kWh."""

    start: datetime
    end: datetime
    price: float


async def async_price_slots(
    hass: HomeAssistant, tariff: dict[str, Any], first: date, last: date
) -> tuple[list[Slot], str | None]:
    """The prices from the first to the last day, and where they came from."""
    entity_id = tariff.get("price_entity")
    if not entity_id:
        return [], None
    state = hass.states.get(entity_id)
    unit = state.attributes.get("unit_of_measurement") if state else None
    slots = from_attributes(dict(state.attributes) if state else {}, unit)
    source = "attributes" if slots else None
    if not slots:
        entry = er.async_get(hass).async_get(entity_id)
        if entry is not None:
            slots = await _async_from_action(hass, entry, first, last)
            source = entry.platform if slots else None
    surcharge = tariff.get("surcharge") or 0.0
    start = dt_util.start_of_local_day(first)
    end = dt_util.start_of_local_day(last + timedelta(days=1))
    return [
        Slot(slot.start, slot.end, round(slot.price + surcharge, 6))
        for slot in slots
        if slot.end > start and slot.start < end
    ], source


def from_attributes(attributes: dict[str, Any], unit: str | None) -> list[Slot]:
    """Slots from the price lists in a sensor's attributes."""
    names = [name for name in LIST_ATTRIBUTES if name in attributes]
    names += [
        name
        for name, value in attributes.items()
        if name not in names and isinstance(value, list)
    ]
    found: dict[datetime, Slot] = {}
    for name in names:
        for slot in parse_list(attributes.get(name), unit):
            found[slot.start] = slot
    return sorted(found.values(), key=lambda s: s.start)


def parse_list(items: Any, unit: str | None) -> list[Slot]:
    """Slots from one list of {start, (end), price} items; others give nothing."""
    if not isinstance(items, list):
        return []
    rows: list[tuple[datetime, datetime | None, float]] = []
    for item in items:
        if not isinstance(item, dict):
            continue
        start = _moment(next((item[k] for k in START_KEYS if k in item), None))
        price = _price(item, unit)
        if start is None or price is None:
            continue
        end = _moment(next((item[k] for k in END_KEYS if k in item), None))
        rows.append((start, end, price))
    if len(rows) < 2:
        return []
    rows.sort(key=lambda row: row[0])
    steps = [
        (b[0] - a[0]).total_seconds() for a, b in zip(rows, rows[1:], strict=False)
    ]
    step = timedelta(seconds=median(steps)) if steps else timedelta(hours=1)
    if step <= timedelta(0):
        step = timedelta(hours=1)
    slots = []
    for index, (start, end, price) in enumerate(rows):
        if end is None or end <= start:
            following = rows[index + 1][0] if index + 1 < len(rows) else None
            end = following if following and following - start <= step else start + step
        slots.append(Slot(start, end, price))
    return slots


def quarters(slots: list[Slot], start: datetime, end: datetime) -> list[float | None]:
    """The price of each quarter hour from start to end (None where unknown)."""
    result: list[float | None] = []
    moment = start
    index = 0
    while moment < end:
        while index < len(slots) and slots[index].end <= moment:
            index += 1
        slot = slots[index] if index < len(slots) else None
        result.append(slot.price if slot and slot.start <= moment else None)
        moment += timedelta(minutes=15)
    return result


def _price(item: dict[str, Any], unit: str | None) -> float | None:
    for key, factor in PRICE_KEYS:
        if key not in item:
            continue
        try:
            value = float(item[key])
        except TypeError, ValueError:
            return None
        return value * factor if factor is not None else to_per_kwh(value, unit)
    return None


def to_per_kwh(value: float, unit: str | None) -> float:
    """A price in the unit of its sensor as a price per kWh (cents and MWh too)."""
    text = (unit or "").lower()
    if "mwh" in text:
        return value / 1000
    if text.startswith(("ct", "c/", "cent", "¢", "øre", "ore", "öre", "p/")):
        return value / 100
    return value


def _moment(value: Any) -> datetime | None:
    if isinstance(value, datetime):
        moment = value
    elif isinstance(value, str):
        moment = dt_util.parse_datetime(value.replace(" ", "T", 1))
    else:
        return None
    if moment is None:
        return None
    if moment.tzinfo is None:
        moment = moment.replace(tzinfo=dt_util.get_default_time_zone())
    return dt_util.as_local(moment)


async def _async_from_action(
    hass: HomeAssistant, entry: er.RegistryEntry, first: date, last: date
) -> list[Slot]:
    """Prices from integrations that hand them out through an action."""
    platform = entry.platform
    start = dt_util.start_of_local_day(first)
    end = dt_util.start_of_local_day(last + timedelta(days=1))
    try:
        if platform == "tibber" and hass.services.has_service("tibber", "get_prices"):
            response = await _async_call(
                hass,
                "tibber",
                "get_prices",
                {"start": start.isoformat(), "end": end.isoformat()},
            )
            homes = (response or {}).get("prices") or {}
            # Several homes: the first one (Joe plans one home).
            items = next(iter(homes.values()), []) if isinstance(homes, dict) else []
            return parse_list(items, "EUR/kWh")
        if platform == "nordpool" and hass.services.has_service(
            "nordpool", "get_prices_for_date"
        ):
            slots: list[Slot] = []
            day = first
            while day <= last:
                response = await _async_call(
                    hass,
                    "nordpool",
                    "get_prices_for_date",
                    {"config_entry": entry.config_entry_id, "date": day.isoformat()},
                )
                areas = response or {}
                items = (
                    next(iter(areas.values()), []) if isinstance(areas, dict) else []
                )
                slots += parse_list(items, "EUR/MWh")
                day += timedelta(days=1)
            return slots
        actions = {
            "energyzero": "get_energy_prices",
            "easyenergy": "get_energy_usage_prices",
        }
        if platform in actions and hass.services.has_service(
            platform, actions[platform]
        ):
            response = await _async_call(
                hass,
                platform,
                actions[platform],
                {
                    "config_entry": entry.config_entry_id,
                    "incl_vat": True,
                    "start": start.isoformat(),
                    "end": end.isoformat(),
                },
            )
            return parse_list((response or {}).get("prices"), "EUR/kWh")
    except Exception:  # noqa: BLE001 - a price service that fails gives no prices
        _LOGGER.debug("Prices from %s not available", platform, exc_info=True)
    return []


async def _async_call(
    hass: HomeAssistant, domain: str, service: str, data: dict[str, Any]
) -> Any:
    return await hass.services.async_call(
        domain, service, data, blocking=True, return_response=True
    )
