"""Write the sample data for the panel test page (panel/dev/) from the made-up
households in tests/snapshots.py: what Joe finds, the configuration after
taking it over, its checks, and the states and registries the panel reads.

Run from the repository root: .venv/bin/python scripts/make_dev_samples.py
"""

# ruff: noqa: E402 (the repository root goes on the path before the imports)

from __future__ import annotations

import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from custom_components.energy_joe import model
from custom_components.energy_joe.discovery import discover
from custom_components.energy_joe.discovery.checks import run_config_checks
from custom_components.energy_joe.discovery.snapshot import Snapshot
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


def write(name: str, snap: Snapshot) -> None:
    result = discover(snap)
    adopted = model.adopt_proposal(model.default_config(), result["proposal"])
    sample = {
        "discovery": result,
        "default_config": model.default_config(),
        "adopted_config": adopted,
        "checks": run_config_checks(snap, adopted),
        "hass": hass_data(snap),
    }
    path = OUT / f"sample-{name}.json"
    path.write_text(
        json.dumps(sample, ensure_ascii=False, indent=1) + "\n", encoding="utf-8"
    )
    print(f"{path.relative_to(ROOT)}: {len(snap.entities)} entities")


if __name__ == "__main__":
    write("fronius", fronius_household())
    # A home whose grid sensor counts the other way round, to show Joe's hints.
    write("generic", generic_household(grid_watts=3900, pv_watts=6500, home_watts=2500))
