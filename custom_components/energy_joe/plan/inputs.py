"""What the plan is made of: batteries, prices, expected consumption and sun."""

from __future__ import annotations

from datetime import date, datetime, time, timedelta
import logging
import math
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.sun import get_astral_event_date
from homeassistant.util import dt as dt_util

from ..observe.readings import energy_kwh, number, sum_kwh
from ..observe.records import hour_starts, local_hour
from ..observe.store import HistoryStore
from .planner import Battery, Hour, PlanInput, Prices

_LOGGER = logging.getLogger(__name__)

# Days of history Joe looks at for the consumption, and how many of a kind he wants.
PROFILE_DAYS = 28
MIN_DAYS = 3
# A typical household (about 8 kWh a day) until Joe has seen enough of this one.
DEFAULT_PROFILE = [
    0.25, 0.22, 0.20, 0.20, 0.20, 0.22, 0.30, 0.45, 0.45, 0.35, 0.30, 0.32,
    0.38, 0.33, 0.30, 0.30, 0.35, 0.50, 0.60, 0.60, 0.55, 0.45, 0.38, 0.30,
]  # fmt: skip
# Prices Joe assumes when the tariff does not say (per kWh).
ASSUMED = Prices(night=0.20, day=0.30, feed_in=0.08, assumed=True)


def next_window(now: datetime, window: dict[str, str]) -> tuple[datetime, datetime]:
    """The cheap window that is running now or comes next (local times)."""
    zone = dt_util.get_default_time_zone()
    begin = time.fromisoformat(window["start"])
    end = time.fromisoformat(window["end"])
    today = dt_util.as_local(now).date()
    for offset in (-1, 0, 1):
        day = today + timedelta(days=offset)
        start = datetime.combine(day, begin, tzinfo=zone)
        stop = datetime.combine(
            day + timedelta(days=1 if end <= begin else 0), end, tzinfo=zone
        )
        if now < stop:
            return start, stop
    raise ValueError("no window")  # pragma: no cover - the loop always finds one


async def async_workday(hass: HomeAssistant, entity: str | None, day: date) -> bool:
    """Whether a day is a working day: from the workday integration, else Mon–Fri."""
    if entity and hass.services.has_service("workday", "check_date"):
        try:
            response = await hass.services.async_call(
                "workday",
                "check_date",
                {"entity_id": entity, "check_date": day},
                blocking=True,
                return_response=True,
            )
        except Exception:  # noqa: BLE001 - a missing answer falls back to the weekday
            _LOGGER.debug("Workday check for %s failed", day, exc_info=True)
        else:
            answer = (response or {}).get(entity)
            if isinstance(answer, dict) and isinstance(answer.get("workday"), bool):
                return answer["workday"]
    return day.weekday() < 5


async def async_consumption(
    history: HistoryStore, today: date
) -> tuple[dict[bool, list[float]], dict[str, Any]]:
    """Expected consumption per hour of the day, for working days and days off."""
    days = await history.async_days(
        (today - timedelta(days=PROFILE_DAYS)).isoformat(),
        (today - timedelta(days=1)).isoformat(),
    )
    rows: dict[bool, list[list[float | None]]] = {True: [], False: []}
    for day, data in days.items():
        hours = [
            h for h in data.get("hours") or [] if "home" in h and h.get("cov", 0) >= 0.8
        ]
        if len(hours) < 20:
            continue
        values: list[float | None] = [None] * 24
        for hour in hours:
            values[datetime.fromisoformat(hour["start"]).hour] = hour["home"]
        workday = data.get("workday")
        if workday is None:
            workday = date.fromisoformat(day).weekday() < 5
        rows[workday].append(values)

    def average(group: list[list[float | None]]) -> list[float]:
        result = []
        for hour in range(24):
            known = [row[hour] for row in group if row[hour] is not None]
            result.append(sum(known) / len(known) if known else DEFAULT_PROFILE[hour])
        return result

    everything = rows[True] + rows[False]
    if not everything:
        return {True: DEFAULT_PROFILE, False: DEFAULT_PROFILE}, {
            "source": "default",
            "days": 0,
        }
    profiles = {
        kind: average(rows[kind] if len(rows[kind]) >= MIN_DAYS else everything)
        for kind in (True, False)
    }
    return profiles, {"source": "history", "days": len(everything)}


def _bell(
    hass: HomeAssistant, day: date, total: float, starts: list[datetime]
) -> dict[datetime, float]:
    """Spread a day's forecast over its hours like the sun: zero at dawn and dusk."""
    sunrise = get_astral_event_date(hass, "sunrise", day)
    sunset = get_astral_event_date(hass, "sunset", day)
    if sunrise is None or sunset is None or sunset <= sunrise:
        return {}
    weights = {}
    for start in starts:
        middle = start + timedelta(minutes=30)
        share = (middle - sunrise) / (sunset - sunrise)
        weights[start] = math.sin(math.pi * share) if 0 < share < 1 else 0.0
    weight = sum(weights.values())
    return {start: total * w / weight for start, w in weights.items()} if weight else {}


async def async_solar(
    hass: HomeAssistant,
    config: dict[str, Any],
    history: HistoryStore,
    starts: list[datetime],
    now: datetime,
) -> tuple[dict[datetime, float], dict[str, Any]]:
    """Expected solar energy per hour (kWh) and where it comes from."""
    get = hass.states.get
    forecast = config["forecast"]
    today = dt_util.as_local(now).date()
    by_day: dict[date, list[datetime]] = {}
    for start in starts:
        by_day.setdefault(dt_util.as_local(start).date(), []).append(start)
    values: dict[datetime, float] = {}
    sources: dict[str, str] = {}
    totals: dict[str, float] = {}
    for day, day_starts in by_day.items():
        data = await history.async_day(day.isoformat()) or {}
        stored = data.get("fc") or {}
        hourly = stored.get("hours") or stored.get("ahead_hours")
        if hourly:
            for start in day_starts:
                values[start] = (
                    hourly.get(dt_util.as_local(start).isoformat(), 0.0) / 1000
                )
            sources[day.isoformat()] = "hours"
        else:
            if day == today:
                total = stored.get("latest_kwh") or sum_kwh(get, forecast["today"])
            else:
                total = stored.get("ahead_kwh") or sum_kwh(get, forecast["tomorrow"])
            if total is not None:
                all_starts = hour_starts(
                    dt_util.start_of_local_day(day),
                    dt_util.start_of_local_day(day + timedelta(days=1)),
                )
                spread = _bell(hass, day, total, all_starts)
                for start in day_starts:
                    values[start] = spread.get(start, 0.0)
                sources[day.isoformat()] = "sum"
            else:
                sources[day.isoformat()] = "none"
        totals[day.isoformat()] = round(
            sum(
                values.get(s, 0.0)
                for s in day_starts
                if dt_util.as_local(s).date() == day
            ),
            2,
        )
    return values, {"sources": sources, "totals": totals}


async def async_build_input(
    hass: HomeAssistant,
    config: dict[str, Any],
    history: HistoryStore,
    now: datetime,
    solar_factor: float = 1.0,
) -> tuple[PlanInput | None, list[str]]:
    """Gather everything for tonight's plan; None with reasons if there is nothing to plan."""
    tariff = config["tariff"]
    if tariff["kind"] != "fixed_window" or not tariff["window"]:
        return None, ["dynamic" if tariff["kind"] == "dynamic" else "no_window"]

    notes: list[str] = []
    batteries = []
    for battery in config["batteries"]:
        capacity = battery["capacity_kwh"] or energy_kwh(
            hass.states.get(battery["capacity_entity"] or "")
        )
        soc = number(hass.states.get(battery["soc_entity"]))
        if not capacity:
            notes.append("capacity_unknown")
            continue
        if soc is None:
            notes.append("soc_unknown")
            continue
        default_power = min(5.0, capacity * 0.5)
        batteries.append(
            Battery(
                id=battery["id"],
                name=battery["name"],
                capacity=capacity,
                soc=max(0.0, min(100.0, soc)),
                charge_kw=(battery["max_charge_w"] or default_power * 1000) / 1000,
                discharge_kw=(battery["max_discharge_w"] or default_power * 1000)
                / 1000,
                controllable=battery["adapter"] != "none",
            )
        )
        if battery["adapter"] == "none":
            notes.append("not_controllable")
    if not batteries:
        return None, [*notes, "no_battery"]

    window_start, window_end = next_window(now, tariff["window"])
    starts = hour_starts(local_hour(now), window_start + timedelta(days=1))
    today = dt_util.as_local(now).date()
    profiles, consumption = await async_consumption(history, today)
    holiday = config["context"]["holiday_entity"]
    workdays = {
        day: await async_workday(hass, holiday, day)
        for day in {dt_util.as_local(s).date() for s in starts}
    }
    solar, sun_meta = await async_solar(hass, config, history, starts, now)
    if "none" in sun_meta["sources"].values():
        notes.append("no_forecast")
    if consumption["source"] == "default":
        notes.append("default_profile")

    hours = []
    for start in starts:
        fraction = 1.0
        if start < now:
            fraction = max(
                0.0, (start + timedelta(hours=1) - now).total_seconds() / 3600
            )
        local = dt_util.as_local(start)
        hours.append(
            Hour(
                start=start,
                solar=solar.get(start, 0.0) * solar_factor * fraction,
                home=profiles[workdays[local.date()]][local.hour] * fraction,
                window=window_start <= start < window_end,
                fraction=fraction,
            )
        )

    night, day, feed_in = (
        tariff["night_price"],
        tariff["day_price"],
        tariff["feed_in_price"],
    )
    prices = Prices(
        night=night if night is not None else ASSUMED.night,
        day=day if day is not None else ASSUMED.day,
        feed_in=feed_in if feed_in is not None else ASSUMED.feed_in,
        assumed=None in (night, day, feed_in),
    )
    rules = config["rules"]
    return (
        PlanInput(
            now=now,
            window_start=window_start,
            window_end=window_end,
            hours=hours,
            batteries=batteries,
            prices=prices,
            reserve=rules["reserve_soc"],
            max_target=rules["max_target_soc"],
            evening_min=rules["evening_min_soc"],
            grid_limit_kw=rules["grid_limit_w"] / 1000
            if rules["grid_limit_w"]
            else None,
            max_night_kwh=rules["max_night_kwh"],
            discharge_mode=rules["discharge_in_window"],
            buffer=rules["buffer_factor"],
            notes=notes,
            meta={
                "consumption": consumption,
                "solar": sun_meta,
                "solar_factor": solar_factor,
                "workday": workdays.get(dt_util.as_local(window_start).date()),
            },
        ),
        notes,
    )
