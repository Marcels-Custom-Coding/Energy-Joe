"""How much a car needs tonight: tomorrow's driving plus a reserve.

Tomorrow's kilometres are the calendar trips (there and back) or, if more,
what the car usually drives on such a day. The energy per kilometre is what
Joe learned from the car, else its own long-term average, else a typical
value, each corrected for tomorrow's temperature and rain. Missing energy is
charged from the wall with some loss.

Typical values (researched October 2026):
- 18 kWh/100 km at the battery for a current EV in mixed driving at about
  20 °C: the ADAC Ecotest average of 145 current models is 19.8 kWh/100 km
  from the wall including charging losses.
- More when it is cold or hot (ANL dynamometer tests, Recurrent's 30,000-car
  data, Geotab's 4,200-car data, ADAC test runs): the table below.
- Rain or a wet road: about 10 % more (Automobile Propre test runs,
  rolling resistance studies).
- AC charging loses about 10 % between wall and battery (ADAC 2026: 6.4 %
  at 11 kW, 10 % with solar surplus around 4 kW).
"""

from __future__ import annotations

from datetime import datetime, timedelta
import math
from typing import Any

from homeassistant.core import State
from homeassistant.util import dt as dt_util

from ..observe.readings import (
    consumption_kwh,
    distance_km,
    energy_kwh,
    number,
)

DEFAULT_CONSUMPTION = 18.0
# Consumption multiplier against about 20 °C, for mixed driving.
TEMPERATURE_FACTORS = (
    (-20.0, 1.80),
    (-15.0, 1.65),
    (-10.0, 1.50),
    (-5.0, 1.38),
    (0.0, 1.28),
    (5.0, 1.20),
    (10.0, 1.12),
    (15.0, 1.05),
    (20.0, 1.00),
    (25.0, 1.00),
    (30.0, 1.08),
    (35.0, 1.15),
)
RAIN_FACTOR = 1.10
CHARGING_LOSS = 0.10
# A car's own long-term average covers all seasons, about 12 °C here.
SEASON_TEMP = 12.0
# Trips that start after noon leave the morning sun time to charge.
NOON = 12


def temperature_factor(temp: float | None) -> float:
    """How much more a car uses at this temperature than at about 20 °C."""
    if temp is None:
        return 1.0
    points = TEMPERATURE_FACTORS
    if temp <= points[0][0]:
        return points[0][1]
    if temp >= points[-1][0]:
        return points[-1][1]
    for (low, low_factor), (high, high_factor) in zip(points, points[1:], strict=False):
        if low <= temp <= high:
            share = (temp - low) / (high - low)
            return low_factor + share * (high_factor - low_factor)
    return 1.0  # pragma: no cover - the table covers every temperature


def consumption(
    need: dict[str, Any],
    learned: dict[str, Any] | None,
    sensor: float | None,
    temp: float | None,
    rain: bool,
) -> tuple[float, str]:
    """Tomorrow's kWh/100 km at the battery and where the value comes from."""
    learned = learned or {}
    if need.get("consumption"):
        value, source = need["consumption"] * temperature_factor(temp), "user"
    elif learned.get("consumption") and learned.get("cold") is not None:
        # The car's own cold behaviour: base above 15 °C plus per degree below.
        heat = max(0.0, 15.0 - temp) if temp is not None else 0.0
        value, source = learned["consumption"] + learned["cold"] * heat, "learned"
    elif learned.get("consumption"):
        # Learned without a usable cold slope: scale from the temperature it was learned at.
        base = learned.get("temp")
        value = (
            learned["consumption"]
            * temperature_factor(temp)
            / temperature_factor(base if base is not None else SEASON_TEMP)
        )
        source = "learned"
    elif sensor:
        value = sensor * temperature_factor(temp) / temperature_factor(SEASON_TEMP)
        source = "car"
    else:
        value, source = DEFAULT_CONSUMPTION * temperature_factor(temp), "default"
    if rain:
        value *= RAIN_FACTOR
    return round(value, 1), source


def car_need(
    need: dict[str, Any],
    get: Any,
    trips: list[dict[str, Any]],
    learned: dict[str, Any] | None,
    temp: float | None,
    rain: bool,
    workday: bool,
) -> dict[str, Any]:
    """What tomorrow's driving takes and what is missing (kWh from the wall)."""
    learned = learned or {}
    soc = number(_state(get, need.get("soc_entity")))
    range_km = distance_km(_state(get, need.get("range_entity")))
    capacity = need.get("capacity_kwh") or energy_kwh(
        _state(get, need.get("capacity_entity"))
    )
    sensor = consumption_kwh(_state(get, need.get("consumption_entity")))
    per_100km, source = consumption(need, learned, sensor, temp, rain)
    trips_km = round(sum(t.get("km") or 0.0 for t in trips), 1)
    usual = need.get("daily_km")
    if usual is None:
        usual = learned.get("workday_km" if workday else "day_off_km")
    day_km = max(trips_km, usual or 0.0)
    needed_km = round(day_km + need.get("reserve_km", 50.0), 1)
    result: dict[str, Any] = {
        "trips_km": trips_km,
        "usual_km": usual,
        "needed_km": needed_km,
        "reserve_km": need.get("reserve_km", 50.0),
        "consumption": per_100km,
        "consumption_source": source,
        "temp": temp,
        "rain": rain,
        "soc": soc,
        "range_km": range_km,
        "capacity_kwh": capacity,
        "departure": _departure(trips),
        "unknown_trips": sum(1 for t in trips if t.get("km") is None),
    }
    if soc is not None and capacity:
        need_kwh = needed_km * per_100km / 100
        have_kwh = soc / 100 * capacity
        # No more than fits into the battery; a longer trip needs a stop on the way.
        missing = max(0.0, min(need_kwh, capacity) - have_kwh)
        result.update(
            known=True,
            have_km=round(have_kwh / per_100km * 100, 1),
            target=min(100, math.ceil(need_kwh / capacity * 100)),
            target_unit="%",
            sensor=need.get("soc_entity"),
            fits=need_kwh <= capacity,
        )
    elif range_km is not None:
        # Only the car's own range: the energy for the kilometres missing.
        missing = max(0.0, needed_km - range_km) * per_100km / 100
        result.update(
            known=True,
            have_km=round(range_km, 1),
            target=math.ceil(needed_km),
            target_unit="km",
            sensor=need.get("range_entity"),
        )
    else:
        return {**result, "known": False, "missing_kwh": None, "wall_kwh": None}
    result.update(
        missing_kwh=round(missing, 2),
        wall_kwh=round(missing / (1 - CHARGING_LOSS), 2),
    )
    return result


def sun_before_departure(need: dict[str, Any], sunny: bool) -> bool:
    """A sunny day and the first trip after noon: the sun can charge first."""
    departure = need.get("departure")
    return bool(
        sunny
        and departure
        and dt_util.as_local(datetime.fromisoformat(departure)).hour >= NOON
    )


def _departure(trips: list[dict[str, Any]]) -> str | None:
    """When the car has to leave for the first trip (its start minus the drive)."""
    times = []
    for trip in trips:
        start = trip.get("start")
        if not start or "T" not in start:
            continue
        moment = datetime.fromisoformat(start)
        minutes = trip.get("minutes")
        if minutes:
            moment -= timedelta(minutes=minutes)
        times.append(moment)
    return min(times).isoformat(timespec="minutes") if times else None


def _state(get: Any, entity_id: str | None) -> State | None:
    return get(entity_id) if entity_id else None
