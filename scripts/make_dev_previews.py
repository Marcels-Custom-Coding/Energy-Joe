"""Write what the panel test page (panel/dev/) shows in the dialog "Regler
für <Speicher>" – from the backend itself, so the page always shows the
real format of energy_joe/battery/preview, …/probe and …/roles
(control/operations.py, executor.async_probe, discovery.role_deviation).

Three batteries, each in panel/dev/previews/<case>.json:

- fronius: a BYD on a Fronius with an old, wrong assignment – the limits
  sit under charge/discharge power, the limit roles are missing (the
  preview deviates from the profile, "Joe braucht dich" asks)
- venus: a Venus over Omnibattery – manual mode first, the system's limits
  by day, the watchdog's allow switches
- huawei: a Huawei steered by the profile's service steps

A file holds the battery as saved, the states and registries of its
entities, what the profile finds, the levers after "Übernehmen", the
deviation for "Joe braucht dich", and per variant of the dialog's draft
(saved, the profile's find taken over, own steps for one operation) the
preview and a probe of every operation: as it goes, with the last write
not taken, and refused while Joe steers or tests. Nothing is written to a
device: the states are made up, the services only keep what they get.

Run from the repository root: .venv/bin/python scripts/make_dev_previews.py
"""

# ruff: noqa: E402 (the repository root goes on the path before the imports)

from __future__ import annotations

import asyncio
from copy import deepcopy
import json
from pathlib import Path
import sys
from typing import Any
from unittest.mock import patch
import warnings

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
warnings.filterwarnings("ignore", message="install_as_voluptuous")

from pytest_homeassistant_custom_component.common import async_test_home_assistant

from custom_components.energy_joe import model
from custom_components.energy_joe.control import executor as executor_module, operations
from custom_components.energy_joe.control.adapters import RoleAdapter, make_adapter
from custom_components.energy_joe.control.fronius_modbus import inverter_slug
from custom_components.energy_joe.discovery import (
    adopted_controls,
    discover,
    profile_find,
    role_deviation,
)
from custom_components.energy_joe.discovery.snapshot import DeviceInfo, Snapshot
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.exceptions import HomeAssistantError
from homeassistant.util import dt as dt_util
from scripts.make_dev_samples import hass_data
from tests.snapshots import entity, fronius_household
from tests.test_control import configured, make_executor
from tests.test_operations import marcels_fronius, with_discharge_limits
from tests.test_vendor_profiles import huawei_snapshot

OUT = ROOT / "panel" / "dev" / "previews"

# The fields of the dialog's draft (api.py _DRAFT): what the panel sends with
# every preview.
DRAFT_FIELDS = ("adapter", "controls", "mode_options", "steps", "prepare")
# Ranges the real integrations report for their numbers (the snapshots only
# carry units): the writes are fitted to them.
RANGES: dict[str, dict[str, float]] = {
    "number.inverter_minimum_reserve": {"min": 0, "max": 100, "step": 1},
    "number.inverter_charge_limit": {"min": 0, "max": 100, "step": 1},
    "number.inverter_discharge_limit": {"min": 0, "max": 100, "step": 1},
    "number.venus_charge_power": {"min": 0, "max": 2500, "step": 50},
    "number.venus_discharge_cutoff": {"min": 12, "max": 50, "step": 1},
    "number.omnibattery_system_max_charge_power": {"min": 0, "max": 2500, "step": 50},
    "number.omnibattery_system_max_discharge_power": {
        "min": 0,
        "max": 2500,
        "step": 50,
    },
    "number.luna_charging": {"min": 0, "max": 5000, "step": 100},
    "number.luna_discharging": {"min": 0, "max": 5000, "step": 100},
}


def adopt(snap: Snapshot) -> dict[str, Any]:
    """The configuration after taking Joe's proposal over (as the setup does)."""
    return model.adopt_proposal(model.default_config(), discover(snap)["proposal"])


def finding(snap: Snapshot, battery_id: str) -> dict[str, Any]:
    """What discovery says about one battery (the panel's BatteryFinding)."""
    return next(b for b in discover(snap)["batteries"] if b["id"] == battery_id)


def battery_of(config: dict[str, Any], battery_id: str) -> dict[str, Any]:
    return next(b for b in config["batteries"] if b["id"] == battery_id)


def with_ranges(snap: Snapshot) -> Snapshot:
    for entity_id, attrs in RANGES.items():
        if entity_id in snap.entities:
            snap.entities[entity_id].attributes.update(attrs)
    return snap


# --- the three batteries --------------------------------------------------------------


def fronius_case() -> tuple[Snapshot, dict[str, Any], dict[str, Any]]:
    """Marcel's BYD: the limits assigned as powers, the limit roles missing
    (an assignment from an older version)."""
    snap = with_ranges(with_discharge_limits(fronius_household()))
    battery = {
        **battery_of(adopt(snap), "storage"),
        "controls": marcels_fronius()["controls"],
    }
    return snap, battery, finding(snap, "storage")


def venus_snapshot() -> Snapshot:
    """The household's Venus with everything its profile knows today: its
    manual mode (prepare), the switches that allow charging and
    discharging (the watchdog), and the system's limits and manual mode on
    Omnibattery's system device (the day)."""
    snap = fronius_household()
    om = {"platform": "omnibattery", "entry": "omni", "device_id": "venus"}
    system = {"platform": "omnibattery", "entry": "omni", "device_id": "omni_system"}
    for item in (
        entity(
            "switch.venus_battery_manual_mode",
            "Venus Manual mode",
            "off",
            unique_id="192.0.2.10_502_battery_manual_mode",
            **om,
        ),
        entity(
            "switch.marstek_venus_e_3_0_battery_allow_charge",
            "Venus Allow charge",
            "on",
            unique_id="192.0.2.10_502_battery_allow_charge",
            **om,
        ),
        entity(
            "switch.marstek_venus_e_3_0_battery_allow_discharge",
            "Venus Allow discharge",
            "on",
            unique_id="192.0.2.10_502_battery_allow_discharge",
            **om,
        ),
        entity(
            "switch.omnibattery_system_power_limits",
            "Omnibattery System Power limits",
            "off",
            unique_id="omni_system_system_power_limits",
            **system,
        ),
        entity(
            "number.omnibattery_system_max_charge_power",
            "Omnibattery System Max charge power",
            2500,
            unit="W",
            unique_id="omni_system_system_max_charge_power",
            **system,
        ),
        entity(
            "number.omnibattery_system_max_discharge_power",
            "Omnibattery System Max discharge power",
            2500,
            unit="W",
            unique_id="omni_system_system_max_discharge_power",
            **system,
        ),
        entity(
            "switch.omnibattery_system_manual_mode",
            "Omnibattery System Manual mode",
            "off",
            unique_id="omni_system_system_manual_mode",
            **system,
        ),
    ):
        snap.entities[item.entity_id] = item
    snap.devices["omni_system"] = DeviceInfo(
        "omni_system", "Omnibattery System", "Marstek", "System"
    )
    return with_ranges(snap)


def venus_case() -> tuple[Snapshot, dict[str, Any], dict[str, Any]]:
    snap = venus_snapshot()
    return snap, battery_of(adopt(snap), "venus"), finding(snap, "venus")


def huawei_case() -> tuple[Snapshot, dict[str, Any], dict[str, Any]]:
    snap = with_ranges(huawei_snapshot())
    config = adopt(snap)
    luna = next(b for b in config["batteries"] if b["adapter"] == "huawei_solar")
    found = next(b for b in discover(snap)["batteries"] if b["id"] == luna["id"])
    names = {"id": "huawei", "name": "Huawei LUNA2000"}
    return snap, {**luna, **names}, {**found, **names}


def modbus_snapshot() -> Snapshot:
    """The household's BYD with Joe's own entities for its GEN24 over Modbus
    TCP (modbus.py): the rates, the reserve, the control bits as switches,
    grid charging, and the sensors – as the panel sees them in Home
    Assistant (unique ids as modbus.py builds them)."""
    snap = with_ranges(fronius_household())
    joe = {"platform": "energy_joe", "entry": "joe", "device_id": "gen24_modbus"}
    slug = inverter_slug("192.0.2.11", 502, 1)

    def own(entity_id: str, name: str, state: Any, key: str, **kw: Any):
        return entity(
            entity_id, name, state, unique_id=f"joe_modbus_{slug}_{key}", **joe, **kw
        )

    percent = {"min": 0, "max": 100, "step": 0.1}
    for item in (
        own(
            "number.gen24_modbus_charge_rate",
            "Laderate",
            100,
            "storage_charge_rate",
            unit="%",
            attributes=percent,
        ),
        own(
            "number.gen24_modbus_discharge_rate",
            "Entladerate",
            100,
            "storage_discharge_rate",
            unit="%",
            attributes={**percent, "min": -100},
        ),
        own(
            "number.gen24_modbus_minimum_reserve",
            "Mindestreserve",
            5,
            "storage_reserve",
            unit="%",
            attributes={"min": 0, "max": 100, "step": 1},
        ),
        own(
            "switch.gen24_modbus_charge_rate_active",
            "Laderate aktiv",
            "off",
            "storage_charge_limiting",
        ),
        own(
            "switch.gen24_modbus_discharge_rate_active",
            "Entladerate aktiv",
            "off",
            "storage_discharge_limiting",
        ),
        own(
            "switch.gen24_modbus_grid_charging",
            "Laden aus dem Netz",
            "off",
            "storage_grid_charging",
        ),
        own(
            "sensor.gen24_modbus_reference_power",
            "Bezugsleistung",
            10240,
            "storage_max_power",
            unit="W",
            device_class="power",
        ),
        own(
            "sensor.gen24_modbus_level",
            "Ladestand",
            55.0,
            "storage_level",
            unit="%",
            device_class="battery",
        ),
        own(
            "sensor.gen24_modbus_storage_state",
            "Speicherzustand",
            "holding",
            "storage_status",
        ),
    ):
        snap.entities[item.entity_id] = item
    snap.devices["gen24_modbus"] = DeviceInfo(
        "gen24_modbus",
        "Fronius GEN24 Modbus 192.0.2.11",
        "Fronius",
        "GEN24 (Modbus TCP)",
    )
    return snap


def modbus_case() -> tuple[Snapshot, dict[str, Any], dict[str, Any]]:
    """Marcel's BYD steered over Modbus TCP: the levers are Joe's own
    entities, the reference power read from the inverter."""
    snap = modbus_snapshot()
    battery = {
        **battery_of(adopt(snap), "storage"),
        "adapter": "fronius_modbus",
        "modbus": {"host": "192.0.2.11", "port": 502, "unit": 1},
        "limit_ref_w": 10240.0,
        "max_charge_w": 10240.0,
    }
    battery["controls"] = profile_find(snap, battery)["controls"]
    return snap, battery, finding(snap, "storage")


CASES = {
    "fronius": fronius_case,
    "venus": venus_case,
    "huawei": huawei_case,
    "modbus": modbus_case,
}


# --- Home Assistant with made-up devices ------------------------------------------------


class Devices:
    """The entities of a snapshot in Home Assistant, with services that keep
    what they get – apart from a value a device "does not take" (`refuse`:
    entity -> the value it ignores) and a service that fails (`fail`)."""

    def __init__(self, hass: HomeAssistant, snap: Snapshot) -> None:
        self.hass = hass
        self.refuse: dict[str, str] = {}
        self.fail: set[str] = set()
        for item in snap.entities.values():
            hass.states.async_set(item.entity_id, item.state, item.attributes)
        hass.services.async_register(
            "number",
            "set_value",
            lambda call: self._keep(call, str(float(call.data["value"]))),
        )
        hass.services.async_register(
            "select",
            "select_option",
            lambda call: self._keep(call, call.data["option"]),
        )
        hass.services.async_register(
            "switch", "turn_on", lambda call: self._keep(call, "on")
        )
        hass.services.async_register(
            "switch", "turn_off", lambda call: self._keep(call, "off")
        )
        for service in ("forcible_charge_soc", "stop_forcible_charge"):
            hass.services.async_register(
                "huawei_solar", service, self._service(f"huawei_solar.{service}")
            )

    def _keep(self, call: ServiceCall, value: str) -> None:
        entity_id = call.data["entity_id"]
        if isinstance(entity_id, list):
            entity_id = entity_id[0]
        if self.refuse.get(entity_id) == value:
            return
        state = self.hass.states.get(entity_id)
        self.hass.states.async_set(entity_id, value, state.attributes if state else {})

    def _service(self, name: str):
        def handle(call: ServiceCall) -> None:
            if name in self.fail:
                raise HomeAssistantError("refused")

        return handle


def draft_of(battery: dict[str, Any]) -> dict[str, Any]:
    """The dialog's draft for a battery as saved (what the panel sends)."""
    return {field: deepcopy(battery[field]) for field in DRAFT_FIELDS}


def own_steps(preview_op: dict[str, Any]) -> list[dict[str, Any]]:
    """The steps of a previewed operation as "Selbst festlegen" takes them
    over (battery-control.ts ownValue): the placeholder where the value
    stands for one, switches as on/off."""
    steps = []
    for step in preview_op["steps"]:
        if step["kind"] == "call":
            steps.append({"service": step["service"], "data": step["data"]})
            continue
        value = step["value"]
        if step.get("param"):
            value = f"{{{step['param']}}}"
        elif isinstance(value, bool):
            value = "on" if value else "off"
        steps.append({"entity_id": step["entity_id"], "value": value})
    return steps


def preview_of(
    hass: HomeAssistant,
    executor: Any,
    battery: dict[str, Any],
    found: dict[str, str],
) -> dict[str, Any]:
    """The preview as api.py ws_battery_preview answers it."""
    adapter = make_adapter(battery)
    whole = (
        executor.whole_system(battery, adapter)
        if isinstance(adapter, RoleAdapter)
        else True
    )
    return operations.preview(hass, battery, found, whole_system=whole)


async def probes_of(
    hass: HomeAssistant,
    executor: Any,
    devices: Devices,
    battery: dict[str, Any],
    preview: dict[str, Any],
) -> tuple[dict[str, Any], dict[str, Any]]:
    """Every operation probed once as it goes and once with its last write
    not taken (or its only service failing)."""
    ok: dict[str, Any] = {}
    failed: dict[str, Any] = {}
    adapter = make_adapter(battery)
    for item in preview["operations"]:
        op = item["op"]
        ok[op] = await executor.async_probe(battery["id"], op)
        assert executor.data["saved"] == {}, (op, executor.data["saved"])
        if not item["possible"]:
            continue
        sets = [s for s in item["steps"] if s["kind"] == "set"]
        if sets:
            last = sets[-1]
            write = next(
                w
                for w in operations.operation(
                    hass, adapter, op, operations.params_for(hass, battery)
                ).writes
                if w.entity_id == last["entity_id"]
            )
            value = write.value
            shown = (
                ("on" if value else "off")
                if isinstance(value, bool)
                else str(float(value))
                if isinstance(value, int | float)
                else str(value)
            )
            devices.refuse = {last["entity_id"]: shown}
        else:
            devices.fail = {s["service"] for s in item["steps"] if s["kind"] == "call"}
        try:
            failed[op] = await executor.async_probe(battery["id"], op)
        finally:
            devices.refuse, devices.fail = {}, set()
        assert executor.data["saved"] == {}, (op, executor.data["saved"])
    return ok, failed


async def write_case(hass: HomeAssistant, name: str) -> None:
    snap, battery, found_by_discovery = CASES[name]()
    battery = model.BATTERY(battery)
    devices = Devices(hass, snap)
    executor, holder = await make_executor(
        hass, configured(battery), None, mode="simulation"
    )
    found = profile_find(snap, battery)
    variants: list[dict[str, Any]] = []

    async def variant(key: str, saved: dict[str, Any], draft: dict[str, Any]) -> None:
        holder["config"] = configured(saved)
        preview = preview_of(
            hass, executor, model.BATTERY({**saved, **draft}), found["controls"]
        )
        probes, probe_fail = await probes_of(hass, executor, devices, saved, preview)
        variants.append(
            {
                "name": key,
                "draft": draft,
                "battery": saved,
                "preview": preview,
                "probes": probes,
                "probe_fail": probe_fail,
            }
        )

    await variant("saved", battery, draft_of(battery))
    deviation = role_deviation(snap, battery)
    adopted = {
        "controls": adopted_controls(battery, found["controls"]),
        "mode_options": found["mode_options"] or battery["mode_options"],
    }
    base = battery
    if deviation:
        # "Auf <Profil> zurücksetzen" in the dialog, "Übernehmen" in the inbox.
        base = model.BATTERY({**battery, **adopted})
        await variant("profile", base, draft_of(base))
    # "Selbst festlegen" for the block: the preview's steps as own steps.
    block = next(o for o in variants[-1]["preview"]["operations"] if o["op"] == "block")
    if block["possible"]:
        own = model.BATTERY(
            {**base, "steps": {**base["steps"], "block": own_steps(block)}}
        )
        await variant("own", own, draft_of(own))
    holder["config"] = configured(battery)
    refused: dict[str, Any] = {}
    executor.status = {**executor.status, "steering": True}
    refused["steering"] = await executor.async_probe(battery["id"], "block")
    executor.status = {**executor.status, "steering": False}
    executor.testing = {
        "battery": battery["id"],
        "step": "hold",
        "steps": [],
        "started": dt_util.now().isoformat(timespec="seconds"),
    }
    refused["busy"] = await executor.async_probe(battery["id"], "block")
    executor.testing = None
    result = {
        "battery": battery,
        "finding": found_by_discovery,
        "hass": hass_data(snap),
        "found": found,
        "adopted": adopted,
        "battery_roles": [deviation] if deviation else [],
        "variants": variants,
        "refused": refused,
    }
    OUT.mkdir(exist_ok=True)
    path = OUT / f"{name}.json"
    path.write_text(
        json.dumps(result, ensure_ascii=False, indent=1) + "\n", encoding="utf-8"
    )
    print(
        f"{path.relative_to(ROOT)}: {len(variants)} variants, "
        f"{sum(len(v['probes']) for v in variants)} probes"
    )


async def main() -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))

    async def settle(seconds: float) -> None:
        pass

    with (
        patch.object(executor_module, "TEST_HOLD", 0),
        patch.object(executor_module, "TEST_CHARGE", 0),
        patch.object(executor_module, "TEST_RELEASE", 0),
        patch.object(executor_module, "PROBE_BLOCK", 0),
        patch("custom_components.energy_joe.control.writes.settle", settle),
        # Nothing of the probes is stored on disk.
        patch.object(executor_module.Store, "async_load", return_value=None),
        patch.object(executor_module.Store, "async_save", return_value=None),
    ):
        for name in CASES:
            async with async_test_home_assistant() as hass:
                await write_case(hass, name)
                await hass.async_stop(force=True)


if __name__ == "__main__":
    asyncio.run(main())
