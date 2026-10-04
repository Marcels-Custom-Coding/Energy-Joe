"""What the plan is made of: batteries, prices, expected consumption and sun."""

from __future__ import annotations

from datetime import date, datetime, time, timedelta
import logging
import math
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.sun import get_astral_event_date
from homeassistant.util import dt as dt_util

from .. import model
from ..control.adapters import make_adapter
from ..learn.context import async_day_labels, async_weather_day
from ..learn.models import class_factor, combined_forecast, expected
from ..observe.readings import energy_kwh, number, sum_kwh
from ..observe.records import base_home, hour_starts, local_hour
from ..observe.store import HistoryStore
from .actions import plan_actions, reserved_kw
from .ev import car_need
from .planner import Battery, Hour, PlanInput, Prices, best_window
from .prices import async_price_slots, quarters
from .trips import PlaceStore, async_trips

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
# A consumption model explains enough to scale tomorrow by from this fit on,
# and never scales by more than these limits.
MIN_R2 = 0.4
SCALE_LIMITS = (0.5, 2.0)
# A learned battery size counts if it fits the nominal one this well.
CAPACITY_LIMITS = (0.5, 1.15)
# Dynamic tariffs: where Joe looks for the cheapest window unless the user
# set a span, and how long running night actions need at least (hours).
DEFAULT_SEARCH = {"start": "20:00", "end": "07:00"}
ACTION_HOURS = 3
# A battery counts as full from this level (for the maintenance charge).
FULL = 99.0


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
    history: HistoryStore, today: date, flexible: list[str] | None = None
) -> tuple[dict[bool, list[float]], dict[str, Any]]:
    """Expected consumption per hour of the day, for working days and days off.

    Without the flexible devices (the car, surplus and cheap-hour devices):
    what the home battery has to cover.
    """
    days = await history.async_days(
        (today - timedelta(days=PROFILE_DAYS)).isoformat(),
        (today - timedelta(days=1)).isoformat(),
    )
    return consumption_profiles(days, flexible or [])


def consumption_profiles(
    days: dict[str, dict[str, Any]], flexible: list[str] | None = None
) -> tuple[dict[bool, list[float]], dict[str, Any]]:
    """Average consumption per hour of the day from stored days (see async_consumption)."""
    rows: dict[bool, list[list[float | None]]] = {True: [], False: []}
    for day, data in days.items():
        hours = [
            h for h in data.get("hours") or [] if "home" in h and h.get("cov", 0) >= 0.8
        ]
        if len(hours) < 20:
            continue
        values: list[float | None] = [None] * 24
        for hour in hours:
            values[datetime.fromisoformat(hour["start"]).hour] = base_home(
                hour, flexible or []
            )
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
    shift: int = 0,
) -> tuple[dict[datetime, float], dict[str, Any]]:
    """Expected solar energy per hour (kWh) and where it comes from.

    A learned shift moves the hourly forecast later (+1) or earlier (-1).
    """
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
                key = dt_util.as_local(start - timedelta(hours=shift)).isoformat()
                values[start] = hourly.get(key, 0.0) / 1000
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


async def async_consumer_profiles(
    history: HistoryStore, today: date
) -> dict[str, list[float]]:
    """Average energy per hour of the day of each tracked consumer (kWh)."""
    days = await history.async_days(
        (today - timedelta(days=PROFILE_DAYS)).isoformat(),
        (today - timedelta(days=1)).isoformat(),
    )
    sums: dict[str, list[float]] = {}
    counts: dict[str, int] = {}
    for data in days.values():
        seen: set[str] = set()
        for record in data.get("hours") or []:
            hour = datetime.fromisoformat(record["start"]).hour
            for consumer, kwh in (record.get("use") or {}).items():
                sums.setdefault(consumer, [0.0] * 24)[hour] += kwh
                seen.add(consumer)
        for consumer in seen:
            counts[consumer] = counts.get(consumer, 0) + 1
    return {
        consumer: [value / counts[consumer] for value in values]
        for consumer, values in sums.items()
        if counts.get(consumer)
    }


async def async_build_input(
    hass: HomeAssistant,
    config: dict[str, Any],
    history: HistoryStore,
    now: datetime,
    manual: dict[str, str] | None = None,
    places: PlaceStore | None = None,
) -> tuple[PlanInput | None, list[str]]:
    """Gather everything for tonight's plan; None with reasons if there is nothing to plan."""
    tariff = config["tariff"]
    dynamic = tariff["kind"] == "dynamic"
    if not dynamic and (tariff["kind"] != "fixed_window" or not tariff["window"]):
        return None, ["no_window"]

    notes: list[str] = []
    batteries = []
    learned = config["learned"]
    battery_models = learned.get("battery_models") or {}
    efficiencies: list[tuple[float, float]] = []
    for battery in config["batteries"]:
        capacity = battery["capacity_kwh"] or energy_kwh(
            hass.states.get(battery["capacity_entity"] or "")
        )
        if found := battery_models.get(battery["id"]):
            capacity = _real_capacity(config, battery["id"], capacity, found)
            efficiencies.append((found["efficiency"], capacity or 0.0))
        soc = number(hass.states.get(battery["soc_entity"]))
        if not capacity:
            notes.append("capacity_unknown")
            continue
        if soc is None:
            notes.append("soc_unknown")
            continue
        default_power = min(5.0, capacity * 0.5)
        adapter = make_adapter(battery)
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
                # Watched batteries are planned as if Joe could steer them.
                grid=adapter.can_charge if adapter else True,
            )
        )
        if battery["adapter"] == "none":
            notes.append("not_controllable")
    if not batteries:
        return None, [*notes, "no_battery"]

    # A fixed tariff's cheap window, or the span a dynamic one is searched in.
    window_start, window_end = next_window(
        now, tariff["window"] or (DEFAULT_SEARCH if dynamic else {})
    )
    starts = hour_starts(local_hour(now), window_start + timedelta(days=1))
    today = dt_util.as_local(now).date()
    flexible = model.flexible_consumers(config)
    profiles, consumption = await async_consumption(history, today, flexible)
    consumption["flexible"] = flexible
    holiday = config["context"]["holiday_entity"]
    workdays = {
        day: await async_workday(hass, holiday, day)
        for day in {dt_util.as_local(s).date() for s in starts}
    }
    solar_factor = learned["solar_factor"] or 1.0
    solar, sun_meta = await async_solar(
        hass, config, history, starts, now, learned["solar_shift"] or 0
    )
    if "none" in sun_meta["sources"].values():
        notes.append("no_forecast")
    if consumption["source"] == "default":
        notes.append("default_profile")

    # Tomorrow as Joe's models see it: weather, calendars, presence, sun.
    tomorrow = dt_util.as_local(window_end).date()
    outlook = await async_tomorrow(
        hass,
        config,
        history,
        tomorrow,
        workdays.get(tomorrow, tomorrow.weekday() < 5),
        sum(profiles[workdays.get(tomorrow, tomorrow.weekday() < 5)]),
        sun_meta["totals"].get(tomorrow.isoformat()),
    )

    hourly: dict[datetime, tuple[float | None, ...]] = {}
    if dynamic:
        slots, _ = await async_price_slots(
            hass, tariff, today, dt_util.as_local(starts[-1]).date()
        )
        if not slots:
            return None, [*notes, "no_prices"]
        for start in starts:
            hourly[start] = tuple(quarters(slots, start, start + timedelta(hours=1)))
        if any(all(q is None for q in found) for found in hourly.values()):
            notes.append("prices_partly")

    hours = []
    for start in starts:
        fraction = 1.0
        if start < now:
            fraction = max(
                0.0, (start + timedelta(hours=1) - now).total_seconds() / 3600
            )
        local = dt_util.as_local(start)
        is_tomorrow = local.date() == tomorrow
        sun = outlook["solar_factor"] if is_tomorrow else None
        known = [q for q in hourly.get(start, ()) if q is not None]
        hours.append(
            Hour(
                start=start,
                solar=solar.get(start, 0.0)
                * (sun if sun is not None else solar_factor)
                * fraction,
                home=profiles[workdays[local.date()]][local.hour]
                * (outlook["scale"] if is_tomorrow else 1.0)
                * fraction,
                # A dynamic tariff's window is chosen below.
                window=not dynamic and window_start <= start < window_end,
                fraction=fraction,
                price=sum(known) / len(known) if known else None,
                quarters=hourly.get(start, ()),
            )
        )

    rules = config["rules"]
    prices = _prices(tariff, hours if dynamic else [])
    search = (window_start, window_end) if dynamic else None

    # Night actions: tomorrow's sun decides, running ones take grid power and
    # move their consumer's daytime energy into the night.
    tomorrow_kwh = round(
        sum(
            h.solar
            for h in hours
            if h.start >= window_end and dt_util.as_local(h.start).date() == tomorrow
        ),
        2,
    )
    sun_tomorrow = tomorrow_kwh if "no_forecast" not in notes else None
    needs = await async_car_needs(
        hass, config, places or PlaceStore(hass), tomorrow, outlook
    )
    if dynamic:
        # The cheapest window first; running actions need it long enough.
        preview = plan_actions(
            config["actions"],
            hass.states.get,
            window_start,
            window_end,
            sun_tomorrow,
            manual or {},
            learned.get("action_models") or {},
            needs,
        )

        def _hours(action: dict[str, Any]) -> int:
            # From the action's start to the end of the span, so a lead is covered.
            begin = datetime.fromisoformat(action["start"])
            return math.ceil((window_end - begin).total_seconds() / 3600)

        needed = max(
            [
                _hours(a)
                # Hot water, and a car charged by need: as long as they take
                # (a car's charging time is known only with its power).
                if a["kind"] == "target"
                or (a.get("target") is not None and a.get("power_kw"))
                else ACTION_HOURS
                for a in preview
                if a["run"]
            ],
            default=1,
        )
        chosen = best_window(
            _input(
                now,
                window_start,
                window_end,
                hours,
                batteries,
                prices,
                rules,
                search=search,
            ),
            needed,
        )
        if chosen is None:
            return None, [*notes, "prices_pending"]
        hours, prices = chosen.hours, chosen.prices
        window_start, window_end = chosen.window_start, chosen.window_end
    actions = plan_actions(
        config["actions"],
        hass.states.get,
        window_start,
        window_end,
        sun_tomorrow,
        manual or {},
        learned.get("action_models") or {},
        needs,
    )
    reserved = [
        reserved_kw(actions, h.start, h.start + timedelta(hours=1)) for h in hours
    ]
    linked = {
        a["consumer_id"]: a
        for a in config["actions"]
        if a.get("consumer_id")
        and any(p["id"] == a["id"] and p["run"] for p in actions)
    }
    if linked:
        profiles_use = await async_consumer_profiles(history, today)
        groups = learned.get("group_models") or {}
        for consumer in linked:
            if consumer in flexible:
                # Not in the profile the battery covers anyway.
                continue
            profile = profiles_use.get(consumer)
            if not profile:
                continue
            # A consumer that follows the weather moves as much as it will use tomorrow.
            share = _group_scale(groups.get(consumer), outlook)
            profile = [value * share for value in profile]
            for hour in hours:
                if hour.start >= window_end and hour.start < window_end + timedelta(
                    hours=20
                ):
                    local = dt_util.as_local(hour.start)
                    hour.home = max(
                        0.05, hour.home - profile[local.hour] * hour.fraction
                    )
        notes.append("shifted")

    balance = await async_balance_due(history, config, today)
    if balance:
        notes.append("balance_due")
    return (
        _input(
            now,
            window_start,
            window_end,
            hours,
            batteries,
            prices,
            rules,
            search=search,
            efficiency=_efficiency(efficiencies),
            notes=notes,
            actions=actions,
            reserved=reserved,
            force_target=100.0 if balance else None,
            meta={
                "consumption": consumption,
                "solar": sun_meta,
                "solar_factor": solar_factor,
                "solar_days": learned["solar_days"],
                "solar_shift": learned["solar_shift"] or 0,
                "workday": workdays.get(dt_util.as_local(window_start).date()),
                "tomorrow_kwh": tomorrow_kwh,
                "tomorrow": outlook["meta"],
                "efficiency": _efficiency(efficiencies),
                "balance": balance,
            },
        ),
        notes,
    )


async def async_car_needs(
    hass: HomeAssistant,
    config: dict[str, Any],
    places: PlaceStore,
    day: date,
    outlook: dict[str, Any],
) -> dict[str, dict[str, Any]]:
    """For each car charged by need: tomorrow's trips and what is missing."""
    result = {}
    models = config["learned"].get("car_models") or {}
    for action in config["actions"]:
        need = action.get("need") or {}
        if (
            action["kind"] != "switch"
            or not action.get("enabled", True)
            or not need.get("enabled")
        ):
            continue
        trips = await async_trips(hass, config, need, places, day)
        found = car_need(
            need,
            hass.states.get,
            trips,
            models.get(action["id"]),
            outlook["temp"],
            outlook["rain"],
            outlook["meta"]["workday"],
        )
        result[action["id"]] = {**found, "trips": trips}
    return result


def _input(
    now: datetime,
    window_start: datetime,
    window_end: datetime,
    hours: list[Hour],
    batteries: list[Battery],
    prices: Prices,
    rules: dict[str, Any],
    **extra: Any,
) -> PlanInput:
    """The plan input with the user's rules."""
    force = extra.pop("force_target", None)
    return PlanInput(
        now=now,
        window_start=window_start,
        window_end=window_end,
        hours=hours,
        batteries=batteries,
        prices=prices,
        reserve=rules["reserve_soc"],
        # A maintenance night may go above the usual highest level.
        max_target=max(rules["max_target_soc"], force or 0.0),
        evening_min=rules["evening_min_soc"],
        grid_limit_kw=rules["grid_limit_w"] / 1000 if rules["grid_limit_w"] else None,
        max_night_kwh=rules["max_night_kwh"],
        discharge_mode=rules["discharge_in_window"],
        buffer=rules["buffer_factor"],
        max_price=rules["max_price"],
        min_saving=rules["min_saving"],
        force_target=force,
        **extra,
    )


def _prices(tariff: dict[str, Any], hours: list[Hour]) -> Prices:
    """Night, day and feed-in price: from the tariff, or a dynamic tariff's hours."""
    feed_in = tariff["feed_in_price"]
    if hours:
        known = [h.price for h in hours if h.price is not None]
        average = sum(known) / len(known) if known else ASSUMED.day
        return Prices(
            night=min(known, default=ASSUMED.night),
            day=average,
            feed_in=feed_in if feed_in is not None else ASSUMED.feed_in,
            assumed=feed_in is None,
        )
    night, day = tariff["night_price"], tariff["day_price"]
    return Prices(
        night=night if night is not None else ASSUMED.night,
        day=day if day is not None else ASSUMED.day,
        feed_in=feed_in if feed_in is not None else ASSUMED.feed_in,
        assumed=None in (night, day, feed_in),
    )


async def async_balance_due(
    history: HistoryStore, config: dict[str, Any], today: date
) -> bool:
    """Whether a battery has not been full for longer than the maintenance rule allows.

    Only once Joe has seen that many days, so a fresh setup does not start with it.
    """
    every = config["rules"]["balance_days"]
    if not every or not config["batteries"]:
        return False
    first = today - timedelta(days=every)
    known = history.overview()["first_day"]
    if known is None or known > first.isoformat():
        return False
    days = await history.async_days(first.isoformat(), today.isoformat())
    for battery in config["batteries"]:
        full = any(
            ((hour.get("bat") or {}).get(battery["id"]) or {}).get("soc", 0.0) >= FULL
            for data in days.values()
            for hour in data.get("hours") or []
        )
        if not full:
            return True
    return False


async def async_tomorrow(
    hass: HomeAssistant,
    config: dict[str, Any],
    history: HistoryStore,
    day: date,
    workday: bool,
    profile_kwh: float,
    raw_solar: float | None,
) -> dict[str, Any]:
    """How tomorrow differs from an average day: consumption scale and sun factor."""
    learned = config["learned"]
    sky = await async_weather_day(hass, config["context"]["weather_entity"], day)
    temp = sky["temp"]
    labels = (
        await async_day_labels(hass, config, day, workday) if config["persons"] else {}
    )
    presence = _presence(learned.get("presence") or {}, labels)
    meta: dict[str, Any] = {
        "date": day.isoformat(),
        "workday": workday,
        "temp": None if temp is None else round(temp, 1),
        "rain": sky["rain"],
        "labels": labels,
        "presence": presence,
        "profile_kwh": round(profile_kwh, 2),
    }
    scale = 1.0
    consumption = learned.get("consumption_model")
    if consumption and consumption["r2"] >= MIN_R2 and temp is not None:
        day_kwh = expected(consumption, workday, temp, presence)
        if profile_kwh > 0:
            scale = max(SCALE_LIMITS[0], min(SCALE_LIMITS[1], day_kwh / profile_kwh))
        meta["expected_kwh"] = round(day_kwh, 2)
    meta["scale"] = round(scale, 2)

    # The sun: all forecasts combined, else the factor of tomorrow's weather.
    stored = ((await history.async_day(day.isoformat())) or {}).get("fc") or {}
    main = stored.get("ahead_kwh") or raw_solar
    forecast = config["forecast"]
    factor: float | None = None
    source = "learned"
    combined = None
    if forecast["combine"] and forecast["alternatives"] and main:
        others = {
            a["id"]: (stored.get("alt") or {}).get(a["id"])
            for a in forecast["alternatives"]
        }
        combined = combined_forecast(
            learned.get("sources") or {}, {"main": main, **others}
        )
        if combined is not None and main >= 1.0:
            factor, source = combined / main, "combined"
    weather = class_factor(learned.get("solar_classes"), main)
    if weather is not None:
        meta["weather"] = weather[0]
        if factor is None:
            factor, source = weather[1], "weather"
    meta.update(
        solar_forecast=None if main is None else round(main, 2),
        solar_combined=combined,
        solar_factor=None if factor is None else round(factor, 2),
        solar_source=source if factor is not None else "learned",
    )
    return {
        "scale": scale,
        "solar_factor": factor,
        "meta": meta,
        "temp": temp,
        "rain": sky["rain"],
    }


def _presence(learned: dict[str, Any], labels: dict[str, str]) -> float | None:
    """Hours someone is at home tomorrow, from what each person's label usually means."""
    hours = [
        found["hours"]
        for person, label in labels.items()
        if (found := (learned.get(person) or {}).get(label)) and found["days"] >= 2
    ]
    return max(hours) if hours else None


def _group_scale(group: dict[str, Any] | None, outlook: dict[str, Any]) -> float:
    """How much more or less than usual a consumer will use tomorrow."""
    temp = outlook["temp"]
    if not group or temp is None or not group.get("average"):
        return 1.0
    workday = outlook["meta"]["workday"]
    return max(0.3, min(3.0, expected(group, workday, temp, None) / group["average"]))


def _real_capacity(
    config: dict[str, Any],
    battery_id: str,
    nominal: float | None,
    found: dict[str, Any],
) -> float | None:
    """The size Joe measured, unless the user set one or it does not fit the nominal."""
    if model.source_of(config, f"batteries[{battery_id}].capacity_kwh") == "user":
        return nominal
    real = found["capacity_kwh"]
    if nominal and not CAPACITY_LIMITS[0] <= real / nominal <= CAPACITY_LIMITS[1]:
        return nominal
    return real


def _efficiency(found: list[tuple[float, float]]) -> float:
    """Round-trip efficiency of all batteries (by size); 90 % until Joe has measured."""
    weight = sum(size for _, size in found)
    if not weight:
        return 0.9
    return round(sum(value * size for value, size in found) / weight, 3)
