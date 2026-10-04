"""What Joe asks Home Assistant about a day: the weather, the calendars, a sensor's past."""

from __future__ import annotations

from datetime import date, datetime, timedelta
import logging
from typing import Any

from homeassistant.const import UnitOfPrecipitationDepth, UnitOfTemperature
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from homeassistant.util.unit_conversion import DistanceConverter, TemperatureConverter

_LOGGER = logging.getLogger(__name__)


# Weather conditions that mean a wet road.
WET = ("rainy", "pouring", "snowy", "snowy-rainy", "hail", "lightning-rainy")
# From this much rain (mm a day) the road counts as wet.
WET_MM = 2.0


async def async_weather_day(
    hass: HomeAssistant, entity_id: str | None, day: date
) -> dict[str, Any]:
    """A day's mean outdoor temperature and whether it rains, from a weather entity."""
    result: dict[str, Any] = {"temp": None, "rain": False}
    if not entity_id or not hass.services.has_service("weather", "get_forecasts"):
        return result
    # Forecasts come in the entity's units (°F and inches on imperial systems).
    state = hass.states.get(entity_id)
    attributes = state.attributes if state else {}
    temp_unit = attributes.get("temperature_unit") or hass.config.units.temperature_unit
    rain_unit = (
        attributes.get("precipitation_unit")
        or hass.config.units.accumulated_precipitation_unit
    )

    def celsius(value: Any) -> float | None:
        if not isinstance(value, int | float):
            return None
        return TemperatureConverter.convert(value, temp_unit, UnitOfTemperature.CELSIUS)

    def millimetres(value: Any) -> float | None:
        if not isinstance(value, int | float):
            return None
        return DistanceConverter.convert(
            value, rain_unit, UnitOfPrecipitationDepth.MILLIMETERS
        )

    for kind in ("daily", "hourly"):
        try:
            response = await hass.services.async_call(
                "weather",
                "get_forecasts",
                {"entity_id": entity_id, "type": kind},
                blocking=True,
                return_response=True,
            )
        except Exception:  # noqa: BLE001 - not every weather entity offers every kind
            continue
        forecast = ((response or {}).get(entity_id) or {}).get("forecast") or []
        values, rain_mm, wet = [], 0.0, False
        for item in forecast:
            moment = dt_util.parse_datetime(str(item.get("datetime", "")))
            if moment is None or dt_util.as_local(moment).date() != day:
                continue
            precipitation = millimetres(item.get("precipitation"))
            if precipitation is not None:
                rain_mm += precipitation
            wet = wet or item.get("condition") in WET
            if kind == "daily":
                high = celsius(item.get("temperature"))
                low = celsius(item.get("templow"))
                if high is not None:
                    temp = (high + low) / 2 if low is not None else high - 4
                    return {"temp": temp, "rain": wet or rain_mm >= WET_MM}
            elif (value := celsius(item.get("temperature"))) is not None:
                values.append(value)
        if values:
            return {
                "temp": sum(values) / len(values),
                "rain": wet or rain_mm >= WET_MM,
            }
    return result


async def async_weather_temp(
    hass: HomeAssistant, entity_id: str | None, day: date
) -> float | None:
    """The mean outdoor temperature a weather entity forecasts for a day."""
    return (await async_weather_day(hass, entity_id, day))["temp"]


async def async_day_labels(
    hass: HomeAssistant, config: dict[str, Any], day: date, workday: bool
) -> dict[str, str]:
    """A label per person for a day, from their calendars and the rules."""
    calendar = config["calendar"]
    default = calendar["default_workday"] if workday else calendar["default_day_off"]
    result: dict[str, str] = {}
    if not hass.services.has_service("calendar", "get_events"):
        return {p["id"]: default for p in config["persons"]}
    start = dt_util.start_of_local_day(day)
    end = start + timedelta(days=1)
    for person in config["persons"]:
        label = None
        if person["calendars"]:
            try:
                response = await hass.services.async_call(
                    "calendar",
                    "get_events",
                    {
                        "entity_id": person["calendars"],
                        "start_date_time": start.isoformat(),
                        "end_date_time": end.isoformat(),
                    },
                    blocking=True,
                    return_response=True,
                )
            except Exception:  # noqa: BLE001 - a calendar that does not answer gives the default
                _LOGGER.debug(
                    "Calendar of %s did not answer", person["id"], exc_info=True
                )
                response = {}
            events = [
                event
                for entry in (response or {}).values()
                for event in (entry or {}).get("events") or []
            ]
            # All-day events first: "vacation" beats a meeting.
            events.sort(key=lambda e: "T" in str(e.get("start", "")))
            label = _label(events, calendar["rules"])
        result[person["id"]] = label or default
    return result


def _label(events: list[dict[str, Any]], rules: list[dict[str, str]]) -> str | None:
    for event in events:
        text = " ".join(
            str(event.get(key) or "") for key in ("summary", "location", "description")
        ).lower()
        for rule in rules:
            if rule["keyword"].lower() in text:
                return rule["label"]
    return None


async def async_sensor_series(
    hass: HomeAssistant, entity_id: str, days: int
) -> list[tuple[datetime, float]]:
    """A sensor's values over the last days, from the recorder."""
    if "recorder" not in hass.config.components or not entity_id:
        return []
    from homeassistant.components.recorder import get_instance, history  # noqa: PLC0415

    end = dt_util.utcnow()
    start = end - timedelta(days=days)
    found = await get_instance(hass).async_add_executor_job(
        history.state_changes_during_period,
        hass,
        start,
        end,
        entity_id,
        False,
        False,
        None,
        True,
    )
    series = []
    for state in found.get(entity_id) or []:
        try:
            value = float(state.state)
        except ValueError:
            continue
        series.append((dt_util.as_local(state.last_changed), value))
    return series
