"""Write the sample data for the panel test page (panel/dev/) from the made-up
households in tests/snapshots.py: what Joe finds, the configuration after
taking it over, its checks, the states and registries the panel reads, and
two weeks of made-up history drawn with simple daily curves.

Run from the repository root: .venv/bin/python scripts/make_dev_samples.py
"""

# ruff: noqa: E402 (the repository root goes on the path before the imports)

from __future__ import annotations

from datetime import date, datetime, timedelta
import json
import math
from pathlib import Path
import random
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from custom_components.energy_joe import model
from custom_components.energy_joe.discovery import discover
from custom_components.energy_joe.discovery.checks import run_config_checks
from custom_components.energy_joe.discovery.snapshot import Snapshot
from custom_components.energy_joe.learn.evaluate import evaluate
from custom_components.energy_joe.learn.learning import (
    BUFFER_DAYS,
    SHIFT_DAYS,
    SOLAR_DAYS,
    buffer,
    results,
    solar_factor,
    solar_profile,
    solar_ratios,
    solar_shift,
)
from custom_components.energy_joe.observe.records import (
    day_view,
    hour_starts,
    local_hour,
    summarize,
)
from custom_components.energy_joe.plan.inputs import consumption_profiles, next_window
from custom_components.energy_joe.plan.planner import (
    Battery,
    Hour,
    PlanInput,
    Prices,
    make_plan,
)
from homeassistant.util import dt as dt_util
from tests.snapshots import fronius_household, generic_household

OUT = ROOT / "panel" / "dev"


def slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", text.lower()).strip("_")


def hass_data(snap: Snapshot) -> dict:
    """States and registries in the shape of Home Assistant's frontend object."""
    states, entities, areas = {}, {}, {}
    for entity in snap.entities.values():
        states[entity.entity_id] = {
            "entity_id": entity.entity_id,
            "state": entity.state,
            "attributes": entity.attributes,
        }
        area_id = None
        if entity.area:
            area_id = slug(entity.area)
            areas[area_id] = {"area_id": area_id, "name": entity.area}
        entities[entity.entity_id] = {
            "entity_id": entity.entity_id,
            "device_id": entity.device_id,
            "area_id": area_id,
            "platform": entity.platform,
        }
    devices = {
        device.device_id: {
            "id": device.device_id,
            "name": device.name,
            "manufacturer": device.manufacturer,
            "model": device.model,
            "area_id": None,
        }
        for device in snap.devices.values()
    }
    return {"states": states, "entities": entities, "devices": devices, "areas": areas}


# Made-up history: the sample ends on this day at 15:00.
LAST_DAY = date(2026, 10, 3)
HISTORY_DAYS = 14


def history(config: dict) -> dict[str, dict]:
    """Two weeks of hours from simple curves (sun, household, batteries)."""
    rng = random.Random(7)
    batteries = config["batteries"]
    capacity = {b["id"]: b["capacity_kwh"] or 5.0 for b in batteries}
    soc = {b["id"]: 30.0 for b in batteries}
    persons = [p["id"] for p in config["persons"]]
    days: dict[str, dict] = {}
    for offset in range(HISTORY_DAYS - 1, -1, -1):
        day = LAST_DAY - timedelta(days=offset)
        weekend = day.weekday() >= 5
        sun = rng.choice([0.25, 0.45, 0.7, 0.9, 1.0, 1.0])
        start = dt_util.start_of_local_day(day)
        end = start + timedelta(hours=15) if offset == 0 else start + timedelta(days=1)
        hours = []
        for hour in hour_starts(start, end):
            h = hour.hour
            solar = (
                max(0.0, 4.6 * sun * math.exp(-((((h + 0.5) - 13) / 3.0) ** 2)))
                if 7 <= h <= 19
                else 0.0
            )
            home = 0.32 + (0.7 if h in (7, 8) else 0) + (1.2 if 18 <= h <= 21 else 0)
            home += (0.6 if weekend and 10 <= h <= 15 else 0) + rng.uniform(0, 0.15)
            surplus = solar - home
            bat: dict[str, dict] = {}
            bat_in = bat_out = 0.0
            for battery_id in soc:
                share = surplus / len(soc)
                room = (100 - soc[battery_id]) / 100 * capacity[battery_id]
                stock = (soc[battery_id] - 10) / 100 * capacity[battery_id]
                if 0 <= h < 5:
                    charge, discharge = (
                        (0.5, 0.0) if sun < 0.5 else (0.0, min(stock, 0.15))
                    )
                elif share > 0:
                    charge, discharge = min(share, room, 2.5), 0.0
                else:
                    charge, discharge = 0.0, min(-share, stock, 2.5)
                soc[battery_id] = max(
                    0.0,
                    min(
                        100.0,
                        soc[battery_id]
                        + (charge - discharge) / capacity[battery_id] * 100,
                    ),
                )
                bat[battery_id] = {
                    "in": round(charge, 4),
                    "out": round(discharge, 4),
                    "soc": round(soc[battery_id], 1),
                }
                bat_in += charge
                bat_out += discharge
            balance = home - solar + bat_in - bat_out
            record = {
                "start": hour.isoformat(),
                "src": "live" if offset < 3 else "stats",
                "cov": 1.0,
                "home": round(home, 4),
                "solar": round(solar, 4),
                "grid_in": round(max(balance, 0.0), 4),
                "grid_out": round(max(-balance, 0.0), 4),
                "bat_in": round(bat_in, 4),
                "bat_out": round(bat_out, 4),
                "bat": bat,
            }
            if offset < 3:
                record["temp"] = round(
                    9
                    + 6 * math.sin((h - 9) / 24 * 2 * math.pi)
                    + rng.uniform(-0.5, 0.5),
                    1,
                )
                record["present"] = {
                    person: 1.0 if (weekend or h < 8 + i or h >= 17 - i) else 0.0
                    for i, person in enumerate(persons)
                }
            hours.append(record)
        total = sum(r["solar"] for r in hours) if offset else 4.6 * sun * 5.3
        forecast = round(total * rng.uniform(0.8, 1.3), 1)
        # The hourly forecast as a bell from 7 to 19 h, in Wh like the real one.
        weights = [max(0.0, math.sin(math.pi * (h + 0.5 - 7) / 12)) for h in range(24)]
        days[day.isoformat()] = {
            "hours": hours,
            "workday": not weekend,
            "fc": {
                "ahead_kwh": forecast,
                "ahead_hours": {
                    (start + timedelta(hours=h)).isoformat(): round(
                        forecast * 1000 * weight / sum(weights), 1
                    )
                    for h, weight in enumerate(weights)
                    if weight > 0
                },
            },
        }
    return days


def made_up_plan(
    config: dict,
    days: dict[str, dict],
    now: datetime,
    socs: dict[str, float],
    sun_kwh: dict[date, float],
) -> dict:
    """A plan from the real planner with made-up inputs (sun as a bell 7–19 h)."""
    tariff = config["tariff"]
    rules = config["rules"]
    start, end = next_window(now, tariff["window"])
    profile = [0.0] * 24
    counts = [0] * 24
    for data in days.values():
        for record in data["hours"]:
            hour = datetime.fromisoformat(record["start"]).hour
            profile[hour] += record["home"]
            counts[hour] += 1
    profile = [p / c if c else 0.4 for p, c in zip(profile, counts, strict=True)]
    weights = {h: max(0.0, math.sin(math.pi * (h + 0.5 - 7) / 12)) for h in range(24)}
    total = sum(weights.values())
    hours = []
    for hour in hour_starts(local_hour(now), start + timedelta(days=1)):
        fraction = 1.0
        if hour < now:
            fraction = (hour + timedelta(hours=1) - now).total_seconds() / 3600
        day_sun = sun_kwh.get(hour.date(), 0.0)
        hours.append(
            Hour(
                start=hour,
                solar=day_sun * weights[hour.hour] / total * fraction,
                home=profile[hour.hour] * fraction,
                window=start <= hour < end,
                fraction=fraction,
            )
        )
    batteries = [
        Battery(
            b["id"],
            b["name"],
            b["capacity_kwh"] or 5.0,
            socs[b["id"]],
            2.5,
            2.5,
            b["adapter"] != "none",
        )
        for b in config["batteries"]
    ]
    return make_plan(
        PlanInput(
            now=now,
            window_start=start,
            window_end=end,
            hours=hours,
            batteries=batteries,
            prices=Prices(
                tariff["night_price"],
                tariff["day_price"],
                tariff["feed_in_price"] or 0.062,
            ),
            reserve=rules["reserve_soc"],
            max_target=rules["max_target_soc"],
            buffer=rules["buffer_factor"],
            meta={
                "consumption": {"source": "history", "days": len(days)},
                "solar": {"sources": {start.date().isoformat(): "hours"}, "totals": {}},
                "solar_factor": 1.0,
                "workday": start.weekday() < 5,
            },
        )
    )


def look_back(days: dict[str, dict]) -> tuple[dict, dict, dict]:
    """Replay every finished night and learn from the days, as the learner does."""
    latest = max(
        datetime.fromisoformat(record["start"])
        for data in days.values()
        for record in data["hours"]
    )
    for day, data in days.items():
        plan = data.get("plan")
        if not plan:
            continue
        # Final once the day is recorded, provisional from the window's end.
        recorded = latest + timedelta(hours=1)
        end = datetime.fromisoformat(plan["window"]["start"]) + timedelta(days=1)
        until = None if recorded >= end else recorded
        if until is not None and until <= datetime.fromisoformat(plan["window"]["end"]):
            continue
        current = date.fromisoformat(day)
        records = {
            record["start"]: record
            for offset in (-1, 0, 1)
            for record in days.get(
                (current + timedelta(days=offset)).isoformat(), {}
            ).get("hours", [])
        }
        data["evaluation"] = evaluate(
            plan, records, (until or end) + timedelta(minutes=10), until
        )
    factor, solar_days = solar_factor(days)
    shift, shift_days = solar_shift(days)
    evaluations = [
        data["evaluation"]
        for _, data in sorted(days.items())
        if (data.get("evaluation") or {}).get("complete")
        and data["evaluation"]["final"]
    ]
    margin, buffer_days = buffer(evaluations)
    updated = dt_util.start_of_local_day(LAST_DAY) + timedelta(hours=14, minutes=10)
    learned = {
        "solar_factor": factor,
        "solar_days": solar_days,
        "solar_shift": shift,
        "shift_days": shift_days,
        "buffer": margin,
        "buffer_days": buffer_days,
        "since": None,
        "updated": updated.isoformat(timespec="seconds"),
    }
    profiles, consumption = consumption_profiles(
        {day: data for day, data in days.items() if day < LAST_DAY.isoformat()}
    )
    learning = {
        "solar": solar_ratios(days),
        "solar_profile": solar_profile(days),
        "consumption": {
            "workday": profiles[True],
            "day_off": profiles[False],
            **consumption,
        },
        "accuracy": [
            {
                "date": day,
                "saving": data["evaluation"]["saving"],
                "solar": data["evaluation"]["solar"],
                "home": data["evaluation"]["home"],
                "bridge": data["evaluation"]["bridge"],
            }
            for day, data in sorted(days.items())
            if (data.get("evaluation") or {}).get("complete")
            and data["evaluation"]["final"]
        ],
        "needs": {"solar": SOLAR_DAYS, "shift": SHIFT_DAYS, "buffer": BUFFER_DAYS},
    }
    return learned, learning, results(days, None)


def history_sample(config: dict) -> dict:
    """What the history commands answer for the made-up days."""
    tariff = config["tariff"]
    window = tariff["window"] if tariff["kind"] == "fixed_window" else None
    days = history(config)
    # Each night's fixed plan, made at 23:45 the evening before.
    names = sorted(days) if window else []
    for previous, day in zip(names, names[1:], strict=False):
        last = days[previous]["hours"][-1]
        socs = {k: v["soc"] for k, v in last["bat"].items()}
        now = dt_util.start_of_local_day(date.fromisoformat(day)) - timedelta(
            minutes=15
        )
        earlier = {k: v for k, v in days.items() if k < day}
        plan = made_up_plan(
            config,
            earlier,
            now,
            socs,
            {date.fromisoformat(day): days[day]["fc"]["ahead_kwh"]},
        )
        plan["fixed"] = True
        days[day]["plan"] = plan
    learned, learning, summary = look_back(days)
    views = {}
    for day, data in days.items():
        moment = dt_util.start_of_local_day(date.fromisoformat(day))
        sun = {
            "sunrise": moment + timedelta(hours=7, minutes=21),
            "sunset": moment + timedelta(hours=18, minutes=52),
        }
        previous = days.get((date.fromisoformat(day) - timedelta(days=1)).isoformat())
        views[day] = day_view(day, data, window, sun, previous)
    last_day = days[max(days)]
    socs = {k: v["soc"] for k, v in last_day["hours"][-1]["bat"].items()}
    now = dt_util.start_of_local_day(LAST_DAY) + timedelta(hours=14, minutes=5)
    tonight = (
        made_up_plan(
            config,
            days,
            now,
            socs,
            {LAST_DAY: 4.6, LAST_DAY + timedelta(days=1): 5.5},
        )
        if window
        else {
            "kind": "unavailable",
            "reasons": ["dynamic" if tariff["kind"] == "dynamic" else "no_window"],
            "created": now.isoformat(timespec="seconds"),
        }
    )
    return {
        "days": [summarize(day, data, window) for day, data in reversed(days.items())],
        "views": views,
        "first_day": min(days),
        "last_day": max(days),
        "day_count": len(days),
        "plan": tonight,
        "learned": learned,
        "learning": learning,
        "results": summary,
    }


def write(name: str, snap: Snapshot) -> None:
    result = discover(snap)
    adopted = model.adopt_proposal(model.default_config(), result["proposal"])
    sample = {
        "discovery": result,
        "default_config": model.default_config(),
        "adopted_config": adopted,
        "checks": run_config_checks(snap, adopted),
        "hass": hass_data(snap),
        "history": history_sample(adopted),
    }
    path = OUT / f"sample-{name}.json"
    path.write_text(
        json.dumps(sample, ensure_ascii=False, indent=1) + "\n", encoding="utf-8"
    )
    print(f"{path.relative_to(ROOT)}: {len(snap.entities)} entities")


if __name__ == "__main__":
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))
    write("fronius", fronius_household())
    # A home whose grid sensor counts the other way round, to show Joe's hints.
    write("generic", generic_household(grid_watts=3900, pv_watts=6500, home_watts=2500))
