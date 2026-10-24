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
from ..control.adapters import RoleAdapter, make_adapter
from ..control.groups import group_of
from ..learn.context import async_day_labels, async_weather_day
from ..learn.models import (
    HOME_SPREAD,
    SOLAR_SPREAD,
    class_factor,
    combined_forecast,
    expected,
    weather_class,
)
from ..observe.readings import energy_kwh, number, sum_kwh
from ..observe.records import base_home, hour_starts, local_hour
from ..observe.store import HistoryStore
from .actions import plan_actions, reserved_kw, reserved_quarters
from .car_calendar import CarCalendarStore, own_events
from .cars import action_by_id, detect_all, need_for, point_of
from .ev import car_need
from .planner import Battery, Hour, PlanInput, Prices, best_window, make_scenarios
from .prices import async_price_slots, quarters
from .trips import PlaceStore, async_trips

_LOGGER = logging.getLogger(__name__)

# Days of history Joe looks at for the consumption, and how many of a kind he wants.
PROFILE_DAYS = 28
MIN_DAYS = 3
# The same weeks of earlier years count too: this many years back, this many
# days around the date, at this weight (two years of them weigh about as much
# as the last month).
PROFILE_YEARS = 2
PROFILE_AROUND = 14
YEAR_WEIGHT = 0.5
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
# Dynamic tariffs: where Joe looks for the cheapest window unless the user
# set a span, and how long running night actions need at least (hours).
DEFAULT_SEARCH = {"start": "20:00", "end": "07:00"}
ACTION_HOURS = 3
# A battery counts as full from this level (for the maintenance charge).
FULL = 99.0
# Below this mean temperature (°C) a day counts as cold for the use (the
# spreads Joe assumes until he learned them: learn.models SOLAR_SPREAD and
# HOME_SPREAD).
COLD_DAY = 10.0


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
    """Whether a day is a working day: from the workday integration or a
    holiday calendar (a day with an entry is a holiday), else Mon–Fri."""
    if entity and entity.startswith("calendar.") and day.weekday() < 5:
        start = dt_util.start_of_local_day(day)
        try:
            response = await hass.services.async_call(
                "calendar",
                "get_events",
                {
                    "entity_id": entity,
                    "start_date_time": start.isoformat(),
                    "end_date_time": (start + timedelta(days=1)).isoformat(),
                },
                blocking=True,
                return_response=True,
            )
        except Exception:  # noqa: BLE001 - a missing answer falls back to the weekday
            _LOGGER.debug("Holiday calendar for %s failed", day, exc_info=True)
        else:
            return not ((response or {}).get(entity) or {}).get("events")
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
    what the home battery has to cover. The last PROFILE_DAYS count fully, the
    same weeks of earlier years (PROFILE_AROUND days around the date) at
    YEAR_WEIGHT.
    """
    days = await history.async_days(
        (today - timedelta(days=PROFILE_DAYS)).isoformat(),
        (today - timedelta(days=1)).isoformat(),
    )
    weights = dict.fromkeys(days, 1.0)
    for years in range(1, PROFILE_YEARS + 1):
        middle = _years_back(today, years)
        earlier = await history.async_days(
            (middle - timedelta(days=PROFILE_AROUND)).isoformat(),
            (middle + timedelta(days=PROFILE_AROUND)).isoformat(),
        )
        for day, data in earlier.items():
            days[day] = data
            weights[day] = YEAR_WEIGHT
    return consumption_profiles(days, flexible or [], weights)


def _years_back(day: date, years: int) -> date:
    """The same date some years before; 29 February becomes the 28th."""
    try:
        return day.replace(year=day.year - years)
    except ValueError:
        return day.replace(year=day.year - years, day=28)


def consumption_profiles(
    days: dict[str, dict[str, Any]],
    flexible: list[str] | None = None,
    weights: dict[str, float] | None = None,
) -> tuple[dict[bool, list[float]], dict[str, Any]]:
    """Average consumption per hour of the day from stored days (see async_consumption).

    Weights per day (default 1.0) make a weighted mean; meta "years" counts
    the days used at less than full weight (earlier years), if any.
    """
    rows: dict[bool, list[tuple[list[float | None], float]]] = {True: [], False: []}
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
        rows[workday].append((values, (weights or {}).get(day, 1.0)))

    def average(group: list[tuple[list[float | None], float]]) -> list[float]:
        result = []
        for hour in range(24):
            known = [(row[hour], w) for row, w in group if row[hour] is not None]
            total = sum(w for _, w in known)
            result.append(
                sum(v * w for v, w in known) / total if total else DEFAULT_PROFILE[hour]
            )
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
    meta: dict[str, Any] = {"source": "history", "days": len(everything)}
    if earlier := sum(1 for _, w in everything if w < 1.0):
        meta["years"] = earlier
    return profiles, meta


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
                all_starts = [
                    dt_util.as_utc(s)
                    for s in hour_starts(
                        dt_util.start_of_local_day(day),
                        dt_util.start_of_local_day(day + timedelta(days=1)),
                    )
                ]
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


def charge_power_kw(
    battery: dict[str, Any], default_kw: float, slow: dict[str, float] | None
) -> tuple[float, float | None]:
    """The power a battery is planned to charge with at night (kW), and that
    power again when it is what Joe measured: a battery that took far less
    than planned is planned with what it took, until it charges faster. A
    device that sets the power itself (Fronius raising its reserve: ~500 W)
    is planned with that from the start."""
    full = (battery["max_charge_w"] or default_kw * 1000) / 1000
    adapter = make_adapter(battery)
    fixed = adapter.fixed_charge_w() if isinstance(adapter, RoleAdapter) else None
    if fixed:
        full = min(full, fixed / 1000)
    measured = (slow or {}).get(battery["id"])
    if not measured or measured / 1000 >= full:
        return full, None
    return round(measured / 1000, 2), round(measured / 1000, 2)


async def async_build_input(
    hass: HomeAssistant,
    config: dict[str, Any],
    history: HistoryStore,
    now: datetime,
    manual: dict[str, str] | None = None,
    places: PlaceStore | None = None,
    calendars: CarCalendarStore | None = None,
    accounts: Any = None,
    held: dict[str, Any] | None = None,
    detected: dict[str, dict[str, Any]] | None = None,
    grid_peak: dict[str, Any] | None = None,
    slow: dict[str, float] | None = None,
) -> tuple[PlanInput | None, list[str]]:
    """Gather everything for tonight's plan; None with reasons if there is nothing to plan.

    `slow`: per battery the power (W) it was measured to charge with at night
    when it took far less than planned (see executor._async_watch_slow).
    """
    tariff = config["tariff"]
    dynamic = tariff["kind"] == "dynamic"
    if not dynamic and (tariff["kind"] != "fixed_window" or not tariff["window"]):
        return None, ["no_window"]

    notes: list[str] = []
    batteries = []
    defer_kw = 0.0
    learned = config["learned"]
    battery_models = learned.get("battery_models") or {}
    efficiencies: list[tuple[float, float]] = []
    for battery in config["batteries"]:
        found = battery_models.get(battery["id"])
        # The nominal size, as the device or the user says. Joe measures the
        # real one from charge and discharge runs (learn.models.battery_runs)
        # but only shows it: the plan is not moved by a measurement. Only a
        # battery nobody could size takes the measured one.
        capacity = (
            battery["capacity_kwh"]
            or energy_kwh(hass.states.get(battery["capacity_entity"] or ""))
            or (found or {}).get("measured_kwh")
        )
        if found:
            efficiency = found.get("efficiency") or 0.9
            converter = found.get("converter") or {}
            if config["rules"]["converter_losses"] and converter.get("factor"):
                # The inverter's losses on the way in and out again.
                efficiency *= converter["factor"] ** 2
            efficiencies.append((efficiency, capacity or 0.0))
        soc = number(hass.states.get(battery["soc_entity"]))
        if not capacity:
            notes.append("capacity_unknown")
            continue
        if soc is None:
            notes.append("soc_unknown")
            continue
        default_power = min(5.0, capacity * 0.5)
        floor, _ = battery_floor(hass, battery, held)
        if floor is None:
            notes.append("floor_unknown")
        adapter = make_adapter(battery)
        charge_kw, slow_kw = charge_power_kw(battery, default_power, slow)
        batteries.append(
            Battery(
                id=battery["id"],
                name=battery["name"],
                capacity=capacity,
                soc=max(0.0, min(100.0, soc)),
                charge_kw=charge_kw,
                discharge_kw=(battery["max_discharge_w"] or default_power * 1000)
                / 1000,
                slow_kw=slow_kw,
                controllable=battery["adapter"] != "none",
                # Watched batteries are planned as if Joe could steer them.
                grid=adapter.can_charge if adapter else True,
                floor=max(config["rules"]["reserve_soc"], floor or 0.0),
                # Joe sets its power at night (else it charges at full power).
                paced=adapter is not None and adapter.power_lever(hass) is not None,
                group=group_of(hass, battery),
            )
        )
        if battery["adapter"] == "none":
            notes.append("not_controllable")
        elif "charge_limit" in (battery.get("controls") or {}):
            # It can hold back charging from the sun (grid-friendly mornings).
            defer_kw += batteries[-1].charge_kw
    if not batteries:
        return None, [*notes, "no_battery"]

    # A fixed tariff's cheap window, or the span a dynamic one is searched in.
    window_start, window_end = next_window(
        now, tariff["window"] or (DEFAULT_SEARCH if dynamic else {})
    )
    # In UTC: the night the clocks go back has one hour twice on the wall
    # clock (see planner.Hour); local times only for the hour of the day.
    starts = [
        dt_util.as_utc(s)
        for s in hour_starts(local_hour(now), window_start + timedelta(days=1))
    ]
    window_start, window_end = dt_util.as_utc(window_start), dt_util.as_utc(window_end)
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
    detected = detected if detected is not None else detect_all(config, hass.states.get)
    cars = await async_car_needs(
        hass,
        config,
        places or PlaceStore(hass),
        tomorrow,
        outlook,
        calendars,
        accounts,
        detected,
    )
    needs = point_needs(config, cars, detected)
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
            detected,
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
                peak=grid_peak,
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
        detected,
    )
    reserved = [
        reserved_kw(actions, h.start, h.start + timedelta(hours=1)) for h in hours
    ]
    # Per quarter hour too: a short action takes the limit only in its quarters.
    quartered = [reserved_quarters(actions, h.start) for h in hours]
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
            peak=grid_peak,
            efficiency=_efficiency(efficiencies),
            notes=notes,
            actions=actions,
            cars=cars,
            reserved=reserved,
            reserved_quarters=quartered,
            force_target=100.0 if balance else None,
            defer_kw=defer_kw,
            morning_need=(learned.get("morning_need") or {}).get("kwh"),
            # Joe's own buffer gave way to tomorrow's scenarios; the owner's stays.
            buffer=rules["buffer_factor"]
            if model.source_of(config, "rules.buffer_factor") == "user"
            else 0.0,
            scenarios=make_scenarios(
                rules.get("night_caution"),
                outlook["spread"]["solar"],
                outlook["spread"]["home"],
            ),
            caution=rules.get("night_caution") or "brave",
            spread=outlook["meta"]["spread"],
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
    calendars: CarCalendarStore | None = None,
    accounts: Any = None,
    detected: dict[str, dict[str, Any]] | None = None,
) -> dict[str, dict[str, Any]]:
    """For each car charged by need: tomorrow's trips, what is missing, and
    the charge point it is plugged into (its values read from there)."""
    result = {}
    models = config["learned"].get("car_models") or {}
    detected = detected or {}
    for car in config.get("cars") or []:
        need = car.get("need") or {}
        if not need.get("enabled"):
            continue
        point_id = point_of(detected, car["id"])
        action = action_by_id(config, point_id)
        effective = need_for(
            hass.states.get, car, (action or {}).get("point") if action else None
        )
        own: list[dict[str, Any]] = []
        start = dt_util.start_of_local_day(day)
        if calendars is not None:
            # A mailbox without a calendar: Joe's calendar for the car. Other
            # cars: only trips entered there by hand (up to 0.3 every car had it).
            own += own_events(
                need, calendars.events(car["id"], start, start + timedelta(days=1))
            )
        if accounts is not None and need.get("source") == "account":
            # A mailbox with a calendar: the invitations are in there.
            own += await accounts.async_events(
                car["id"], start, start + timedelta(days=1)
            )
        trips = await async_trips(hass, config, need, places, day, own)
        found = car_need(
            effective,
            hass.states.get,
            trips,
            models.get(car["id"]),
            outlook["temp"],
            outlook["rain"],
            outlook["meta"]["workday"],
        )
        result[car["id"]] = {
            **found,
            "trips": trips,
            "car": car["id"],
            "name": car["name"],
            "point": point_id,
        }
    return result


def point_needs(
    config: dict[str, Any],
    cars: dict[str, dict[str, Any]],
    detected: dict[str, dict[str, Any]],
) -> dict[str, dict[str, Any]]:
    """The need of the car plugged into each charge point, by the action's id."""
    result = {}
    for action in config["actions"]:
        entry = detected.get(action["id"]) or {}
        car = entry.get("car") if entry.get("state") == "car" else None
        if car and car in cars:
            result[action["id"]] = cars[car]
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
    limit, source = grid_limit(rules, extra.pop("peak", None), now)
    return PlanInput(
        now=now,
        window_start=window_start,
        window_end=window_end,
        hours=hours,
        batteries=batteries,
        prices=prices,
        reserve=_pooled_floor(batteries, rules["reserve_soc"]),
        # A maintenance night may go above the usual highest level.
        max_target=max(rules["max_target_soc"], force or 0.0),
        evening_min=rules["evening_min_soc"],
        grid_limit_kw=limit,
        grid_limit_source=source,
        # The first to discharge by day gets tonight's energy first.
        order=list(rules.get("team_discharge_order") or []),
        sequence=rules.get("battery_team") == "sequence",
        grid_friendly=rules["grid_friendly"],
        grid_first=rules["grid_first"],
        morning_buffer=rules.get("morning_buffer_soc"),
        # By day one group at a time unless the owner chose "Gleichzeitig".
        one_by_one=rules.get("battery_team") != "together",
        max_night_kwh=rules["max_night_kwh"],
        discharge_mode=rules["discharge_in_window"],
        max_price=rules["max_price"],
        min_saving=rules["min_saving"],
        force_target=force,
        **extra,
    )


# The highest import Joe measured counts as the grid limit (without the
# user's) only once he has watched this long.
PEAK_DAYS = 7


def grid_limit(
    rules: dict[str, Any], peak: dict[str, Any] | None, now: datetime
) -> tuple[float | None, str | None]:
    """The grid limit for the plan (kW) and where it comes from.

    The user's, else the highest import Joe measured so far (the house
    managed that, so charging plus the home stay below it), once he has
    watched for a week. Never above what was measured without the user's say.
    """
    if rules.get("grid_limit_w"):
        return rules["grid_limit_w"] / 1000, "user"
    if not peak or not peak.get("w") or not peak.get("since"):
        return None, None
    since = datetime.fromisoformat(peak["since"])
    if now - since < timedelta(days=PEAK_DAYS):
        return None, None
    return round(peak["w"] / 1000, 2), "learned"


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
    rain = bool(sky["rain"])
    weather = class_factor(learned.get("solar_classes"), main, rain=rain)
    if weather is not None:
        meta["weather"] = weather[0]
        if factor is None:
            factor, source = weather[1], "weather"
    top = (learned.get("solar_classes") or {}).get("top")
    sky_class = (
        weather[0] if weather else weather_class(main, top) if main and top else None
    )
    spread = pick_spread(learned, sky_class, rain, temp)
    meta["spread"] = {k: spread[k] for k in ("class", "groups", "days")}
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
        "spread": spread,
    }


def pick_spread(
    learned: dict[str, Any], sky: str | None, rain: bool, temp: float | None
) -> dict[str, Any]:
    """How far tomorrow's sun and use may spread around the typical day.

    The sun's spread of a rainy day, else of tomorrow's weather class, else
    of all days; the use's of a cold or a mild day, else of all days; until
    Joe learned them, his assumptions.
    """
    solar_groups = [*(["rain"] if rain else []), *([sky] if sky else []), "all"]
    home_groups = [
        *([] if temp is None else ["cold" if temp < COLD_DAY else "mild"]),
        "all",
    ]
    solar = _spread(learned.get("solar_spread"), solar_groups, SOLAR_SPREAD)
    home = _spread(learned.get("home_spread"), home_groups, HOME_SPREAD)
    return {
        "solar": solar[1],
        "home": home[1],
        "class": solar[0] if solar[0] not in ("all", None) else None,
        "groups": {"solar": solar[0], "home": home[0]},
        "days": {"solar": solar[2], "home": home[2]},
    }


def _spread(
    spreads: Any, groups: list[str], default: tuple[float, float]
) -> tuple[str | None, tuple[float, float], int]:
    """The first group with a learned spread: its name, (low, high) and days."""
    for group in groups:
        found = spreads.get(group) if isinstance(spreads, dict) else None
        if not isinstance(found, dict):
            continue
        low, high = found.get("low"), found.get("high")
        if (
            isinstance(low, int | float)
            and isinstance(high, int | float)
            and 0 < low <= high
        ):
            return group, (float(low), float(high)), int(found.get("days") or 0)
    return None, default, 0


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


def _efficiency(found: list[tuple[float, float]]) -> float:
    """Round-trip efficiency of all batteries (by size); 90 % until Joe has measured."""
    weight = sum(size for _, size in found)
    if not weight:
        return 0.9
    return round(sum(value * size for value, size in found) / weight, 3)


def _pooled_floor(batteries: list[Battery], reserve: float) -> float:
    """The lowest level of all batteries together: each its own floor, by size."""
    size = sum(b.capacity for b in batteries)
    if not size:
        return reserve
    return round(sum(b.capacity * max(reserve, b.floor) for b in batteries) / size, 2)


def device_floor(
    hass: HomeAssistant, battery: dict[str, Any], held: dict[str, Any] | None = None
) -> float | None:
    """The level a battery's own setting keeps (Fronius minimum reserve, Marstek
    discharge cutoff ...). While Joe has changed it, what it had before."""
    entity_id = (battery.get("controls") or {}).get("min_soc")
    if not entity_id:
        return None
    value = (held or {}).get(entity_id)
    if not isinstance(value, int | float):
        value = number(hass.states.get(entity_id))
    if value is None:
        return None
    adapter = make_adapter(battery)
    if isinstance(adapter, RoleAdapter):
        value = adapter._level("min_soc", value)
    return round(max(0.0, min(100.0, float(value))), 1)


def battery_floor(
    hass: HomeAssistant, battery: dict[str, Any], held: dict[str, Any] | None = None
) -> tuple[float | None, str]:
    """A battery's floor and where it comes from: the user, the device, or unknown."""
    if battery.get("floor_soc") is not None:
        return float(battery["floor_soc"]), "user"
    found = device_floor(hass, battery, held)
    return (found, "device") if found is not None else (None, "unknown")
