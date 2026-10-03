"""Understand a price entity: fixed cheap window, dynamic prices or flat rate."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

from .snapshot import EntityInfo

# Attribute names holding lists of time-stamped prices (Nord Pool, EPEX Spot, …).
PRICE_LIST_ATTRIBUTES = (
    "raw_today",
    "raw_tomorrow",
    "data",
    "prices",
    "prices_today",
    "today",
    "forecast",
    "rates",
    "unit_rate_forecast",
)
_START_KEYS = ("start", "start_time", "starts_at", "from", "valid_from")
_PRICE_KEYS = ("value", "price", "total", "price_per_kwh", "value_inc_vat", "rate")


@dataclass(slots=True)
class TariffInsight:
    """What a price entity reveals about the tariff."""

    kind: str = "unknown"  # fixed_window | dynamic | flat | unknown
    window: dict[str, str] | None = None
    night_price: float | None = None
    day_price: float | None = None
    reasons: list[dict[str, Any]] = field(default_factory=list)


def analyze_price_entity(entity: EntityInfo) -> TariffInsight:
    """Read tariff structure and prices from a price entity's attributes."""
    attrs = entity.attributes
    if insight := _from_timeslots(attrs.get("timeslots")):
        return insight
    for name in PRICE_LIST_ATTRIBUTES:
        if insight := _from_price_list(attrs.get(name), entity.unit):
            insight.reasons.append({"code": "price_list", "attribute": name})
            return insight
    price = _to_eur(entity.number, entity.unit)
    return TariffInsight(
        kind="unknown", day_price=price, reasons=[{"code": "price_only"}]
    )


def _from_timeslots(timeslots: Any) -> TariffInsight | None:
    """Time-of-use tariffs that list named slots with activation times (Octopus)."""
    if not isinstance(timeslots, list):
        return None
    slots: list[tuple[float, list[dict[str, Any]]]] = []
    for slot in timeslots:
        if not isinstance(slot, dict):
            continue
        rate = _number(slot.get("rate"))
        rules = [r for r in slot.get("activation_rules") or [] if isinstance(r, dict)]
        if rate is None or not rules:
            continue
        slots.append((_rate_to_eur(rate), rules))
    if len(slots) < 2:
        return None
    slots.sort(key=lambda item: item[0])
    cheap_rate, cheap_rules = slots[0]
    rule = cheap_rules[0]
    start, end = _hhmm(rule.get("from_time")), _hhmm(rule.get("to_time"))
    if not start or not end:
        return None
    return TariffInsight(
        kind="fixed_window",
        window={"start": start, "end": end},
        night_price=round(cheap_rate, 6),
        day_price=round(slots[-1][0], 6),
        reasons=[{"code": "timeslots"}],
    )


def _from_price_list(value: Any, unit: str | None) -> TariffInsight | None:
    """Dynamic tariffs that publish a list of prices for coming hours."""
    if not isinstance(value, list) or len(value) < 12:
        return None
    prices: list[float] = []
    for item in value:
        if not isinstance(item, dict):
            continue
        if not any(key in item for key in _START_KEYS):
            continue
        price = next(
            (_number(item.get(key)) for key in _PRICE_KEYS if key in item), None
        )
        if price is not None:
            prices.append(price)
    if len(prices) < 12:
        return None
    eur = [_to_eur(p, unit) or p for p in prices]
    if max(eur) - min(eur) < 0.005:
        return TariffInsight(kind="flat", day_price=round(eur[0], 6))
    return TariffInsight(
        kind="dynamic", night_price=round(min(eur), 6), day_price=round(max(eur), 6)
    )


def _number(value: Any) -> float | None:
    try:
        return float(value)
    except TypeError, ValueError:
        return None


def _rate_to_eur(rate: float) -> float:
    # Slot rates are often given in cents (18.564) while states use €/kWh.
    return rate / 100 if rate > 3 else rate


def _to_eur(value: float | None, unit: str | None) -> float | None:
    if value is None:
        return None
    unit = (unit or "").lower()
    if "mwh" in unit:
        return value / 1000
    if unit.startswith(("ct", "c/", "cent", "øre", "ore", "öre", "p/")):
        return value / 100
    return value


def _hhmm(value: Any) -> str | None:
    if not isinstance(value, str):
        return None
    for fmt in ("%H:%M:%S", "%H:%M"):
        try:
            return datetime.strptime(value, fmt).strftime("%H:%M")
        except ValueError:
            continue
    return None
