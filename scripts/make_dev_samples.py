"""Write the sample data for the panel test page (panel/dev/) from the made-up
households in tests/snapshots.py: what Joe finds, the configuration after
taking it over, its checks, the states and registries the panel reads, and
two weeks of made-up history drawn with simple daily curves.

Run from the repository root: .venv/bin/python scripts/make_dev_samples.py
"""

# ruff: noqa: E402 (the repository root goes on the path before the imports)

from __future__ import annotations

from datetime import date, timedelta
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
from custom_components.energy_joe.observe.records import (
    day_view,
    hour_starts,
    summarize,
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
        days[day.isoformat()] = {
            "hours": hours,
            "workday": not weekend,
            "fc": {"ahead_kwh": round(total * rng.uniform(0.8, 1.3), 1)},
        }
    return days


def history_sample(config: dict) -> dict:
    """What the history commands answer for the made-up days."""
    tariff = config["tariff"]
    window = tariff["window"] if tariff["kind"] == "fixed_window" else None
    days = history(config)
    views = {}
    for day, data in days.items():
        moment = dt_util.start_of_local_day(date.fromisoformat(day))
        sun = {
            "sunrise": moment + timedelta(hours=7, minutes=21),
            "sunset": moment + timedelta(hours=18, minutes=52),
        }
        views[day] = day_view(day, data, window, sun)
    return {
        "days": [summarize(day, data, window) for day, data in reversed(days.items())],
        "views": views,
        "first_day": min(days),
        "last_day": max(days),
        "day_count": len(days),
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
