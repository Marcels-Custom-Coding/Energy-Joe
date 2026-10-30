"""Filling Joe's history from Home Assistant's recorder.

Long-term statistics (hourly means of power sensors, hourly changes of energy
counters) reach back as far as Home Assistant has kept them. Power sensors
without statistics are read from the state history, which only covers the
recorder's retention (10 days by default). Energy counters of the Energy
dashboard give exact hourly import, export, solar and battery energy.
"""

from __future__ import annotations

from collections.abc import Callable, Iterable
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
from functools import partial
import logging
from typing import Any

from homeassistant.core import HomeAssistant, State
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util

from .readings import (
    SUN_LOW_DEGREES,
    Integrator,
    measurement_entities,
    number,
    to_kw,
    unit,
)
from .records import Flow, HourParts, compose, hour_starts

_LOGGER = logging.getLogger(__name__)

HOUR = 3600.0
# A day's forecast is read from its sensor early in the morning, when it holds
# the whole day and the sun has not started yet (local hours, in this order).
FORECAST_HOURS = (4, 5, 3)
# Less than this is a sensor that had no forecast yet.
MIN_FORECAST_KWH = 0.1
ENERGY_TO_KWH = {"Wh": 0.001, "kWh": 1.0, "MWh": 1000.0}


@dataclass(slots=True)
class Inputs:
    """What Joe reads for the history, taken from his configuration."""

    measurements: dict[str, dict[str, Any] | None] = field(default_factory=dict)
    solar: list[dict[str, Any]] = field(default_factory=list)
    batteries: dict[str, dict[str, Any] | None] = field(default_factory=dict)
    soc: dict[str, str] = field(default_factory=dict)
    consumers: dict[str, str] = field(default_factory=dict)
    counters: dict[str, list[str]] = field(default_factory=dict)

    @classmethod
    def from_config(
        cls, config: dict[str, Any], prefs: dict[str, Any] | None
    ) -> Inputs:
        m = config["measurements"]
        return cls(
            measurements={"grid": m["grid_power"], "home": m["home_power"]},
            solar=list(m["solar_power"]),
            batteries={b["id"]: b["power"] for b in config["batteries"]},
            soc={b["id"]: b["soc_entity"] for b in config["batteries"]},
            consumers={
                c["id"]: c["energy_entity"]
                for c in config["consumers"]
                if c["energy_entity"] and c["kind"] != "submeter"
            },
            counters=energy_counters(prefs),
        )

    def power_entities(self) -> set[str]:
        entities: set[str] = set()
        for measurement in [
            *self.measurements.values(),
            *self.solar,
            *self.batteries.values(),
        ]:
            entities.update(measurement_entities(measurement))
        return entities

    def counter_entities(self) -> set[str]:
        return {e for group in self.counters.values() for e in group} | set(
            self.consumers.values()
        )


def energy_counters(prefs: dict[str, Any] | None) -> dict[str, list[str]]:
    """Energy counters of the Energy dashboard (kWh, always rising)."""
    result: dict[str, list[str]] = {
        "grid_in": [],
        "grid_out": [],
        "solar": [],
        "bat_in": [],
        "bat_out": [],
    }
    for source in (prefs or {}).get("energy_sources") or []:
        kind = source.get("type")
        if kind == "grid":
            if counter := source.get("stat_energy_from"):
                result["grid_in"].append(counter)
            if counter := source.get("stat_energy_to"):
                result["grid_out"].append(counter)
            # Older dashboard format: lists of import and export counters.
            result["grid_in"].extend(
                f["stat_energy_from"]
                for f in source.get("flow_from") or []
                if f.get("stat_energy_from")
            )
            result["grid_out"].extend(
                f["stat_energy_to"]
                for f in source.get("flow_to") or []
                if f.get("stat_energy_to")
            )
        elif kind == "solar" and (counter := source.get("stat_energy_from")):
            result["solar"].append(counter)
        elif kind == "battery":
            # "to" goes into the battery (charging), "from" comes out of it.
            if counter := source.get("stat_energy_to"):
                result["bat_in"].append(counter)
            if counter := source.get("stat_energy_from"):
                result["bat_out"].append(counter)
    return result


@dataclass(slots=True)
class Series:
    """Hourly values of one entity on Joe's local hours: value and coverage 0–1."""

    values: dict[datetime, tuple[float, float]] = field(default_factory=dict)


def spread_statistics(
    rows: list[dict[str, Any]], key: str, hours: list[datetime], *, average: bool
) -> Series:
    """Map hourly statistic rows (UTC hours) onto local hours.

    Zones with a half-hour offset get a share of two rows; a mean is weighted
    by the overlap, a change is split in proportion.
    """
    series = Series()
    by_start = {row["start"]: row[key] for row in rows if row.get(key) is not None}
    for hour in hours:
        begin = dt_util.as_utc(hour).timestamp()
        total = weight = 0.0
        first = begin - (begin % HOUR)
        for row_start in (first, first + HOUR):
            if row_start not in by_start:
                continue
            overlap = (
                max(0.0, min(begin + HOUR, row_start + HOUR) - max(begin, row_start))
                / HOUR
            )
            if overlap <= 0:
                continue
            total += by_start[row_start] * overlap
            weight += overlap
        if weight > 0:
            value = total / weight if average else total
            series.values[hour] = (value, min(1.0, weight))
    return series


def series_from_states(
    states: list[State], hours: list[datetime], unit_text: str | None
) -> Series:
    """Time-weighted hourly means (in kW for power) from a state history."""
    series = Series()
    if not hours:
        return series
    integrator = Integrator()
    boundaries = [dt_util.as_utc(h).timestamp() for h in hours]
    boundaries.append(boundaries[-1] + HOUR)
    events = sorted((state.last_changed.timestamp(), state) for state in states)
    index = 0
    for position, hour in enumerate(hours):
        begin, end = boundaries[position], boundaries[position + 1]
        if integrator.since is None:
            integrator.since = begin
        while index < len(events) and events[index][0] < end:
            moment, state = events[index]
            value = number(state)
            kw = None if value is None else to_kw(value, unit_text)
            integrator.update(max(moment, begin), kw)
            index += 1
        positive, negative, covered = integrator.take(end)
        if covered > 0:
            fraction = covered / HOUR
            series.values[hour] = ((positive - negative) / fraction, min(1.0, fraction))
    return series


def measurement_flow(
    measurement: dict[str, Any] | None, data: dict[str, Series], hour: datetime
) -> Flow | None:
    """Energy of a measurement in one hour from the hourly means of its entities."""
    if not measurement:
        return None
    main = data.get(measurement["entity_id"])
    if main is None or hour not in main.values:
        return None
    value, coverage = main.values[hour]
    if measurement.get("invert"):
        value = -value
    if minus := measurement.get("minus_entity_id"):
        other = data.get(minus)
        if other is None or hour not in other.values:
            return None
        other_value, other_coverage = other.values[hour]
        value -= other_value
        coverage = min(coverage, other_coverage)
    # A mean in kW over one hour is the energy in kWh.
    return Flow(max(value, 0.0), max(-value, 0.0), coverage)


def solar_flow(
    measurement: dict[str, Any],
    data: dict[str, Series],
    hour: datetime,
    sun_low: Callable[[datetime], bool] | None,
) -> Flow | None:
    """Like measurement_flow; an inverter that sleeps without sun counts as 0 W
    while it has no value in an hour the sun was low throughout."""
    flow = measurement_flow(measurement, data, hour)
    if not measurement.get("sleeps") or sun_low is None or not sun_low(hour):
        return flow
    if flow is None:
        return Flow(0.0, 0.0, 1.0)
    # The mean holds for the covered part; the rest of the hour it slept.
    return Flow(flow.positive * flow.coverage, flow.negative * flow.coverage, 1.0)


def build_records(
    inputs: Inputs,
    hours: list[datetime],
    means: dict[str, Series],
    changes: dict[str, Series],
    from_history: set[str],
    sun_low: Callable[[datetime], bool] | None = None,
) -> list[dict[str, Any]]:
    """Hour records from hourly means of power and changes of counters."""
    records = []

    def change(entity: str, hour: datetime) -> float | None:
        series = changes.get(entity)
        if series is None or hour not in series.values:
            return None
        return max(0.0, series.values[hour][0])

    def counter_sum(group: str, hour: datetime) -> float | None:
        entities = inputs.counters.get(group) or []
        values = [change(e, hour) for e in entities]
        if not entities or any(v is None for v in values):
            return None
        return sum(v for v in values if v is not None)

    used = {
        e
        for m in [
            *inputs.measurements.values(),
            *inputs.solar,
            *inputs.batteries.values(),
        ]
        for e in measurement_entities(m)
    }
    source = "history" if used & from_history else "stats"
    for hour in hours:
        parts = HourParts(
            grid=measurement_flow(inputs.measurements.get("grid"), means, hour),
            home=measurement_flow(inputs.measurements.get("home"), means, hour),
            solar=[solar_flow(m, means, hour, sun_low) for m in inputs.solar],
            batteries={
                battery_id: measurement_flow(power, means, hour)
                for battery_id, power in inputs.batteries.items()
                if power
            },
            soc={
                battery_id: means[entity].values[hour][0]
                for battery_id, entity in inputs.soc.items()
                if entity in means and hour in means[entity].values
            },
            consumers={c: change(e, hour) for c, e in inputs.consumers.items()},
            grid_in=counter_sum("grid_in", hour),
            grid_out=counter_sum("grid_out", hour),
            solar_total=counter_sum("solar", hour),
            bat_in=counter_sum("bat_in", hour),
            bat_out=counter_sum("bat_out", hour),
        )
        known = (
            parts.grid
            or parts.home
            or any(parts.solar)
            or any(parts.batteries.values())
            or parts.grid_in is not None
            or parts.solar_total is not None
        )
        if known:
            records.append(compose(hour, parts, source))
    return records


async def async_backfill(
    hass: HomeAssistant,
    config: dict[str, Any],
    prefs: dict[str, Any] | None,
    start: datetime,
    end: datetime,
) -> list[dict[str, Any]]:
    """Hour records for the local hours from start to end, read from the recorder."""
    if "recorder" not in hass.config.components:
        return []
    from homeassistant.components.recorder import get_instance, history  # noqa: PLC0415
    from homeassistant.components.recorder.statistics import (  # noqa: PLC0415
        statistics_during_period,
    )

    hours = hour_starts(start, end)
    if not hours:
        return []
    inputs = Inputs.from_config(config, prefs)
    power = inputs.power_entities()
    soc = set(inputs.soc.values())
    counters = inputs.counter_entities()
    ids = power | soc | counters
    if not ids:
        return []

    recorder = get_instance(hass)
    first = dt_util.as_utc(hours[0]) - timedelta(hours=1)
    last = dt_util.as_utc(hours[-1]) + timedelta(hours=2)
    stats: dict[str, list[dict[str, Any]]] = await recorder.async_add_executor_job(
        statistics_during_period,
        hass,
        first,
        last,
        ids,
        "hour",
        {"power": "kW", "energy": "kWh"},
        {"mean", "change"},
    )

    means: dict[str, Series] = {}
    changes: dict[str, Series] = {}
    for entity in power | soc:
        if rows := stats.get(entity):
            means[entity] = spread_statistics(rows, "mean", hours, average=True)
    for entity in counters:
        if rows := stats.get(entity):
            changes[entity] = spread_statistics(rows, "change", hours, average=False)

    # Power sensors without statistics: integrate their state history.
    from_history: set[str] = set()
    for entity in sorted((power | soc) - means.keys()):
        found: dict[str, list[State]] = await recorder.async_add_executor_job(
            history.state_changes_during_period,
            hass,
            dt_util.as_utc(hours[0]),
            dt_util.as_utc(hours[-1]) + timedelta(hours=1),
            entity,
            True,
            False,
            None,
            True,
        )
        if states := found.get(entity):
            current = hass.states.get(entity)
            unit_text = unit(current) if entity in power else None
            means[entity] = series_from_states(states, hours, unit_text)
            from_history.add(entity)
    _LOGGER.debug(
        "History for %s hours: %s from statistics, %s from states",
        len(hours),
        len(means) - len(from_history),
        len(from_history),
    )
    sleeping = any(m.get("sleeps") for m in inputs.solar)
    return build_records(
        inputs,
        hours,
        means,
        changes,
        from_history,
        _sun_low_hours(hass) if sleeping else None,
    )


def _sun_low_hours(hass: HomeAssistant) -> Callable[[datetime], bool] | None:
    """Whether the sun was low throughout an hour at home (None: unknown)."""
    try:
        from astral import Observer  # noqa: PLC0415
        from astral.sun import elevation  # noqa: PLC0415

        observer = Observer(
            hass.config.latitude, hass.config.longitude, hass.config.elevation
        )
    except Exception:  # noqa: BLE001 - without the sun's position nothing counts as asleep
        _LOGGER.debug("No sun position for the history")
        return None

    def low(hour: datetime) -> bool:
        start = dt_util.as_utc(hour)
        return all(
            elevation(observer, start + timedelta(minutes=m)) < SUN_LOW_DEGREES
            for m in (0, 30, 60)
        )

    return low


def _complete(record: dict[str, Any]) -> bool:
    """Whether a stored hour needs no new reading.

    Coverage only comes from power readings; an hour read back from counters
    alone has none (cov 0), but its energies are as good as they get: reading
    it again would only bring the same numbers (and a new round of learning).
    """
    if record.get("cov", 0) >= 0.9:
        return True
    return (
        record.get("src") != "live"
        and record.get("home") is not None
        and record.get("grid_in") is not None
    )


def missing_hours(
    known: Iterable[dict[str, Any]], start: datetime, end: datetime
) -> list[datetime]:
    """Local hours from start to end without a complete record."""
    complete = {datetime.fromisoformat(r["start"]) for r in known if _complete(r)}
    return [h for h in hour_starts(start, end) if h not in complete]


def forecast_history_candidates(
    hass: HomeAssistant, config: dict[str, Any]
) -> list[str]:
    """Sensors that may hold the whole day's forecast in the statistics.

    The user's pick, else min_max helpers summing exactly Joe's "today" sensors.
    """
    forecast = config["forecast"]
    if chosen := forecast.get("history_entity"):
        return [chosen]
    today = set(forecast["today"])
    if not today:
        return []
    registry = er.async_get(hass)
    found = []
    for entry in hass.config_entries.async_entries("min_max"):
        options = entry.options
        if (
            options.get("type") != "sum"
            or set(options.get("entity_ids") or []) != today
        ):
            continue
        found.extend(
            item.entity_id
            for item in er.async_entries_for_config_entry(registry, entry.entry_id)
            if item.domain == "sensor"
        )
    return found


async def async_forecast_history_entity(
    hass: HomeAssistant, config: dict[str, Any]
) -> tuple[str, float] | None:
    """The forecast sensor with hourly means in kWh, Wh or MWh, and its factor to kWh."""
    if "recorder" not in hass.config.components:
        return None
    candidates = forecast_history_candidates(hass, config)
    if not candidates:
        return None
    from homeassistant.components.recorder import get_instance  # noqa: PLC0415
    from homeassistant.components.recorder.models import (  # noqa: PLC0415
        StatisticMeanType,
    )
    from homeassistant.components.recorder.statistics import (  # noqa: PLC0415
        get_metadata,
    )

    found = await get_instance(hass).async_add_executor_job(
        partial(get_metadata, hass, statistic_ids=set(candidates))
    )
    for entity in candidates:
        if entity not in found:
            continue
        meta = found[entity][1]
        factor = ENERGY_TO_KWH.get(meta.get("unit_of_measurement") or "")
        has_mean = meta.get("mean_type", StatisticMeanType.NONE) != (
            StatisticMeanType.NONE
        ) or meta.get("has_mean")
        if factor is not None and has_mean:
            return entity, factor
    return None


def forecast_by_day(rows: list[dict[str, Any]], factor: float) -> dict[str, float]:
    """A day's forecast in kWh from hourly means: the early-morning hour."""
    means: dict[tuple[str, int], float] = {}
    for row in sorted(rows, key=lambda r: r["start"]):
        if row.get("mean") is None:
            continue
        local = dt_util.as_local(dt_util.utc_from_timestamp(row["start"]))
        # On the doubled hour of the clock change the first one counts.
        means.setdefault((local.date().isoformat(), local.hour), row["mean"])
    result: dict[str, float] = {}
    for day in sorted({day for day, _ in means}):
        for hour in FORECAST_HOURS:
            kwh = means.get((day, hour), 0.0) * factor
            # Missing or still empty: the next hour may have it.
            if kwh >= MIN_FORECAST_KWH:
                result[day] = round(kwh, 3)
                break
    return result


async def async_forecast_history(
    hass: HomeAssistant, entity: str, factor: float, first: date, last: date
) -> dict[str, float]:
    """Each day's forecast (kWh) from first to last, read from the statistics."""
    from homeassistant.components.recorder import get_instance  # noqa: PLC0415
    from homeassistant.components.recorder.statistics import (  # noqa: PLC0415
        statistics_during_period,
    )

    start = dt_util.as_utc(dt_util.start_of_local_day(first))
    end = dt_util.as_utc(dt_util.start_of_local_day(last + timedelta(days=1)))
    stats = await get_instance(hass).async_add_executor_job(
        statistics_during_period, hass, start, end, {entity}, "hour", None, {"mean"}
    )
    return forecast_by_day(stats.get(entity) or [], factor)
