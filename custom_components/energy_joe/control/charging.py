"""While a car charges: what it has now, and how big its battery is.

A car's own app often reports only now and then (a cloud that is asked every
few hours). While it charges Joe counts the energy at the wallbox himself
and works out the level and range from the car's last report: that is how
he stops at the target even when the car says nothing all night.

Each whole charge also tells its battery size: the energy at the wallbox
(less the charging loss) for the levels it rose from the report before it
began to the first one after it ended (the car's reports lag, so partial
steps in between would mislead). Joe keeps these and takes the median, so
the plan can work in kWh and the odometer, the level and the outside
temperature tell what the car really uses (see learn/models.py car_model).

While it charges (the car is awake then) Joe may ask the car for a fresh
report: when its last one is old as the charge begins, and once after the
charge ended. Never while it stands, never more often than MIN_GAP.
"""

from __future__ import annotations

from datetime import datetime, timedelta
import re
from statistics import median
from typing import Any

from homeassistant.core import HomeAssistant, State
from homeassistant.helpers import entity_registry as er

from ..observe.readings import UNAVAILABLE, distance_km, number, to_kw
from ..plan.ev import CHARGING_LOSS

# Above this the wallbox charges; below it the charge ended (kW).
CHARGING_KW = 1.0
ENDED_KW = 0.2
# Levels the car must rise over a whole charge for its battery size (%): the
# car's reports lag a few minutes, which counts less the more it rises.
MIN_RISE = 8.0
# Energy the wallbox must have counted for it (kWh).
MIN_SAMPLE_KWH = 4.0
# A charge counts as one when its energy is at least this (kWh; the ask
# after it ended, see ask_now).
MIN_KWH = 2.0
# The report that ends a charge must come this long after it ended (the cloud's
# value lags) and at most LOOK later (else the car has done something else).
SETTLE = timedelta(minutes=10)
LOOK = timedelta(hours=3)
# Battery sizes that can be real (kWh).
CAPACITY_RANGE = (10.0, 200.0)
# The car moved between the reports: it may have driven and charged elsewhere (km).
MOVED_KM = 1.0
# Battery sizes kept, and how many the median takes.
KEEP = 20
USE = 10
# Two wallbox readings further apart than this: the gap counts nothing.
MAX_GAP = timedelta(minutes=30)
# Asking the car: at most this often, its report older than STALE as the
# charge begins, and this long after the charge ended.
MIN_GAP = timedelta(minutes=30)
STALE = timedelta(minutes=90)
AFTER_END = timedelta(minutes=2)
PER_DAY = 6
# A button of the car's integration that asks it for a fresh report.
_REFRESH = re.compile(r"(force_?refresh|force_?update|refresh|aktualisier|wake)")
_NOT_REFRESH = re.compile(
    r"(valet|climate|klima|horn|light|lock|door|window|charge_port)"
)


def reading(get: Any, entities: dict[str, str | None]) -> dict[str, Any] | None:
    """The car's last report: level, range, odometer and when it came."""
    soc_state: State | None = get(entities["soc"]) if entities.get("soc") else None
    if soc_state is None or soc_state.state in UNAVAILABLE:
        return None
    soc = number(soc_state)
    if soc is None:
        return None
    # When the level changed: an app that repeats its cached values now and
    # then writes the same level again, which is no new report.
    reported = soc_state.last_changed
    return {
        "soc": soc,
        "range": distance_km(get(entities["range"])) if entities.get("range") else None,
        "odometer": distance_km(get(entities["odometer"]))
        if entities.get("odometer")
        else None,
        "at": reported.isoformat(),
    }


def power_kw(state: State | None) -> float | None:
    """What the wallbox draws now (kW)."""
    value = number(state)
    if value is None:
        return None
    unit = state.attributes.get("unit_of_measurement") if state else None
    return to_kw(value, unit)


def begin(record: dict[str, Any], base: dict[str, Any], now: datetime) -> None:
    """A new count from the car's report on."""
    for key in ("asked_start", "asked_end", "ended"):
        record.pop(key, None)
    record.update(base=base, kwh=0.0, last=None, since=now.isoformat())


def add_power(record: dict[str, Any], kw: float | None, now: datetime) -> None:
    """Count the wallbox's energy since the last reading (trapezoid)."""
    last = record.get("last")
    if kw is None:
        return
    if last is not None:
        before = datetime.fromisoformat(last["at"])
        gap = now - before
        if timedelta(0) < gap <= MAX_GAP:
            step = (last["kw"] + kw) / 2 * gap.total_seconds() / 3600
            record["kwh"] = round(record["kwh"] + step, 4)
            session = record.get("session")
            if session is not None:
                session["kwh"] = round(session["kwh"] + step, 4)
    record["last"] = {"at": now.isoformat(), "kw": kw}
    session = record.get("session")
    if session is not None and kw >= CHARGING_KW:
        session["last_on"] = now.isoformat()


def capacity_sample(record: dict[str, Any], fresh: dict[str, Any]) -> float | None:
    """The battery size a charge between two reports tells (None: it tells none)."""
    base = record["base"]
    rise = fresh["soc"] - base["soc"]
    if rise < MIN_RISE or record["kwh"] < MIN_SAMPLE_KWH:
        return None
    if (
        base.get("odometer") is not None
        and fresh.get("odometer") is not None
        and abs(fresh["odometer"] - base["odometer"]) > MOVED_KM
    ):
        return None
    value = record["kwh"] * (1 - CHARGING_LOSS) / rise * 100
    low, high = CAPACITY_RANGE
    return round(value, 1) if low <= value <= high else None


def learned_capacity(samples: list[dict[str, Any]]) -> float | None:
    """The battery size from the last charges (median)."""
    values = [s["value"] for s in samples[-USE:]]
    return round(median(values), 1) if values else None


def estimate(
    record: dict[str, Any] | None,
    capacity: float | None,
    consumption: float | None,
) -> dict[str, float | None] | None:
    """Level and range now: the car's last report plus what the wallbox counted.

    The range grows like the car shows it (its km per % at the last report),
    else by the consumption Joe plans with.
    """
    if not record:
        return None
    base = record["base"]
    stored = record["kwh"] * (1 - CHARGING_LOSS)
    soc = base["soc"] + stored / capacity * 100 if capacity else None
    km: float | None = None
    if base.get("range") is not None:
        if soc is not None and base["soc"] > 0:
            km = base["range"] + (soc - base["soc"]) * base["range"] / base["soc"]
        elif consumption:
            km = base["range"] + stored / consumption * 100
    return {
        "soc": round(min(100.0, soc), 1) if soc is not None else None,
        "range": round(km, 1) if km is not None else None,
        "kwh": round(record["kwh"], 2),
    }


def samples_from_history(
    soc: list[tuple[datetime, float]],
    power: list[tuple[datetime, float]],
    odometer: list[tuple[datetime, float]] | None = None,
) -> list[dict[str, Any]]:
    """Battery sizes from the recorder: each whole charge at the wallbox (power
    in kW) against the car's level before it began and the first report that
    came SETTLE after it ended."""
    odometer = odometer or []
    found = []
    for start, end, kwh in _charges(power):
        before = _before(soc, start)
        after = next(
            (
                (when, value)
                for when, value in soc
                if end + SETTLE <= when <= end + LOOK
            ),
            None,
        )
        if before is None or after is None:
            continue
        record = {
            "base": {"soc": before[1], "odometer": _at(odometer, start)},
            "kwh": kwh,
        }
        value = capacity_sample(
            record, {"soc": after[1], "odometer": _at(odometer, after[0])}
        )
        if value is not None:
            found.append(
                {
                    "at": after[0].isoformat(),
                    "value": value,
                    "kwh": round(kwh, 2),
                    "rise": round(after[1] - before[1], 1),
                }
            )
    return found


def _before(
    series: list[tuple[datetime, float]], moment: datetime
) -> tuple[datetime, float] | None:
    found = None
    for when, value in series:
        if when > moment:
            break
        found = (when, value)
    return found


def _charges(
    power: list[tuple[datetime, float]],
) -> list[tuple[datetime, datetime, float]]:
    """The charges of a power series: start, end and kWh (a pause shorter than
    MAX_GAP is the same charge)."""
    spans: list[list[datetime]] = []
    for (when, kw), (after, _next) in zip(power, power[1:], strict=False):
        if kw < CHARGING_KW:
            continue
        if spans and when - spans[-1][1] <= MAX_GAP:
            spans[-1][1] = after
        else:
            spans.append([when, after])
    return [(start, end, _energy(power, start, end)) for start, end in spans]


def _at(series: list[tuple[datetime, float]], moment: datetime) -> float | None:
    value = None
    for when, reading_ in series:
        if when > moment:
            break
        value = reading_
    return value


def _energy(
    power: list[tuple[datetime, float]], start: datetime, end: datetime
) -> float:
    """kWh between two moments from a power series (each value holds until the next)."""
    total = 0.0
    for (when, kw), (after, _next) in zip(
        power, [*power[1:], (end, 0.0)], strict=False
    ):
        begin_ = max(when, start)
        stop = min(after, end)
        if stop <= begin_ or stop - begin_ > MAX_GAP * 24:
            continue
        total += kw * (stop - begin_).total_seconds() / 3600
    return total


def refresh_button(hass: HomeAssistant, entity_ids: list[str]) -> str | None:
    """A button of the car's integration that asks it for a fresh report."""
    registry = er.async_get(hass)
    devices = {
        entry.device_id
        for entity_id in entity_ids
        if entity_id and (entry := registry.async_get(entity_id)) and entry.device_id
    }
    found = []
    for device_id in devices:
        for entry in er.async_entries_for_device(registry, device_id):
            if entry.domain != "button" or entry.disabled_by:
                continue
            text = " ".join(
                filter(
                    None,
                    (
                        entry.entity_id,
                        entry.translation_key,
                        entry.original_name,
                        entry.name,
                    ),
                )
            ).lower()
            if _REFRESH.search(text) and not _NOT_REFRESH.search(text):
                found.append(entry.entity_id)
    return sorted(found)[0] if found else None


def ask_now(
    record: dict[str, Any],
    kw: float | None,
    now: datetime,
    asked: list[str],
) -> str | None:
    """Whether to ask the car now: "start" (its report is old as the charge
    begins), "end" (once after the charge ended), or None."""
    recent = [a for a in asked if now - datetime.fromisoformat(a) < timedelta(days=1)]
    if len(recent) >= PER_DAY:
        return None
    if recent and now - datetime.fromisoformat(max(recent)) < MIN_GAP:
        return None
    reported = datetime.fromisoformat(record["base"]["at"])
    if kw is not None and kw >= CHARGING_KW:
        record.pop("ended", None)
        if now - reported >= STALE and not record.get("asked_start"):
            record["asked_start"] = now.isoformat()
            return "start"
        return None
    if kw is not None and kw <= ENDED_KW and record["kwh"] >= MIN_KWH:
        ended = record.setdefault("ended", now.isoformat())
        if (
            not record.get("asked_end")
            and now - datetime.fromisoformat(ended) >= AFTER_END
        ):
            record["asked_end"] = now.isoformat()
            return "end"
    return None
