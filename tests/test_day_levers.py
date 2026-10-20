"""The daytime cap's levers: Omnibattery's system limits, a Fronius limit in %
with its reference (set or learned), automations that write the same limit,
and values someone else set meanwhile."""

from __future__ import annotations

from datetime import timedelta
from typing import Any

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.energy_joe import model
from custom_components.energy_joe.control.adapters import make_adapter
from custom_components.energy_joe.control.writes import Write
from custom_components.energy_joe.discovery import async_profile_updates, discover
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util

from .snapshots import entity, fronius_household
from .test_control import (
    install_devices,
    limited_fronius,
    make_executor,
    venus_battery,
)
from .test_surplus import day_plan, install_evcc, install_limit, limit

SYSTEM = {
    "system_charge_limit": "number.omni_max_charge",
    "system_charge_limit_enabled": "switch.omni_power_limits",
}


@pytest.fixture(autouse=True)
def berlin(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


# --- Omnibattery: the system's power limits ------------------------------------------


def test_discovery_finds_the_system_limits() -> None:
    """On the system device of the same integration entry, by the unique id's end."""
    snap = fronius_household()
    om = {"platform": "omnibattery", "entry": "omni", "device_id": "system"}
    for item in (
        entity(
            "switch.omni_power_limits",
            "System power limits",
            "off",
            unique_id="marstek_venus_system_system_power_limits",
            **om,
        ),
        entity(
            "number.omni_max_charge",
            "System max charge power",
            0,
            unit="W",
            unique_id="marstek_venus_system_system_max_charge_power",
            **om,
        ),
    ):
        snap.entities[item.entity_id] = item
    venus = next(b for b in discover(snap)["batteries"] if b["id"] == "venus")
    assert venus["controls"]["system_charge_limit"] == "number.omni_max_charge"
    assert (
        venus["controls"]["system_charge_limit_enabled"] == "switch.omni_power_limits"
    )
    # The battery's own maximum stays its maximum (not the system's limit).
    assert venus["max_charge_w"] == 2500


async def test_a_battery_set_up_before_learns_the_system_limits(
    hass: HomeAssistant,
) -> None:
    entry = MockConfigEntry(domain="omnibattery")
    entry.add_to_hass(hass)
    devices = dr.async_get(hass)
    registry = er.async_get(hass)
    battery_device = devices.async_get_or_create(
        config_entry_id=entry.entry_id, identifiers={("omnibattery", "venus")}
    )
    system_device = devices.async_get_or_create(
        config_entry_id=entry.entry_id, identifiers={("omnibattery", "system")}
    )
    soc = registry.async_get_or_create(
        "sensor",
        "omnibattery",
        "10.0.0.1_502_battery_soc",
        config_entry=entry,
        device_id=battery_device.id,
    )
    own_max = registry.async_get_or_create(
        "number",
        "omnibattery",
        "10.0.0.1_502_max_charge_power",
        config_entry=entry,
        device_id=battery_device.id,
    )
    found = {}
    for domain, key in (
        ("switch", "system_power_limits"),
        ("number", "system_max_charge_power"),
    ):
        item = registry.async_get_or_create(
            domain,
            "omnibattery",
            f"marstek_venus_system_{key}",
            config_entry=entry,
            device_id=system_device.id,
        )
        found[key] = item.entity_id
        hass.states.async_set(item.entity_id, "0")
    for item in (soc, own_max):
        hass.states.async_set(item.entity_id, "40")
    battery = {**venus_battery(), "soc_entity": soc.entity_id}
    config = model.validate({"version": model.CONFIG_VERSION, "batteries": [battery]})
    patch_ = await async_profile_updates(hass, config)
    controls = patch_["batteries"]["venus"]["controls"]
    assert controls["system_charge_limit"] == found["system_max_charge_power"]
    assert controls["system_charge_limit_enabled"] == found["system_power_limits"]
    # The battery's own levers stay as they were.
    assert controls["mode"] == "select.force_mode"
    updated = model.apply_update(config, patch_, "read", "profile")
    assert await async_profile_updates(hass, updated) is None


def system_venus(battery_id: str = "venus", soc: str = "sensor.venus_soc") -> dict:
    battery = venus_battery()
    return {
        **battery,
        "id": battery_id,
        "name": battery_id.title(),
        "soc_entity": soc,
        "controls": {**battery["controls"], **SYSTEM},
    }


def install_system(hass: HomeAssistant, venus_soc: float = 40) -> None:
    install_devices(hass, venus_soc=venus_soc)
    hass.states.async_set(
        "sensor.venus2_soc", str(venus_soc), {"unit_of_measurement": "%"}
    )
    hass.states.async_set("switch.omni_power_limits", "off")
    hass.states.async_set(
        "number.omni_max_charge",
        "0",
        {"min": 0, "max": 2500, "step": 50, "unit_of_measurement": "W"},
    )


def system(hass: HomeAssistant) -> tuple[str, str]:
    return (
        hass.states.get("number.omni_max_charge").state,
        hass.states.get("switch.omni_power_limits").state,
    )


def omni_config(*batteries: dict[str, Any]) -> dict[str, Any]:
    return model.validate(
        {
            "version": model.CONFIG_VERSION,
            "batteries": list(batteries),
            "rules": {"day_surplus": True, "grid_friendly": False},
        }
    )


def test_the_system_limit_is_no_part_of_the_night(hass: HomeAssistant) -> None:
    install_system(hass)
    plain, capped = make_adapter(venus_battery()), make_adapter(system_venus())
    # The test run stays valid, and a missing system limit stops no night.
    assert plain.signature == capped.signature
    hass.states.async_set("number.omni_max_charge", "unavailable")
    assert capped.missing(hass) == []
    assert capped.limit_problem(hass) == "unavailable"
    install_system(hass)
    assert capped.limit_problem(hass) is None
    # The value first, then the switch (the limits take it at once when on).
    assert capped.limit(hass, 0.8) == [
        Write("number.omni_max_charge", 800),
        Write("switch.omni_power_limits", True),
    ]
    saved = {"switch.omni_power_limits": False, "number.omni_max_charge": 0.0}
    assert capped.unlimit(saved) == [
        Write("switch.omni_power_limits", False),
        Write("number.omni_max_charge", 0.0),
    ]


async def test_omnibattery_caps_its_whole_system_and_gives_it_back(
    hass: HomeAssistant, freezer
) -> None:
    """Two Venus behind one system limit: one write with the sum of their caps;
    the night begins: the switch and the value back exactly, before manual mode."""
    freezer.move_to("2026-06-20T09:00:00+02:00")
    install_system(hass)
    install_evcc(hass)
    config = omni_config(
        system_venus(), system_venus("venus2", soc="sensor.venus2_soc")
    )
    plan = day_plan(dt_util.now())
    plan["batteries"] = []
    executor, holder = await make_executor(hass, config, plan)
    await executor.async_check()
    view = executor.view["surplus"]
    assert view["state"] == "cap"
    caps = {k: b["cap_kw"] for k, b in view["batteries"].items()}
    assert set(caps) == {"venus", "venus2"}
    assert all(b["state"] == "capped" for b in view["batteries"].values())
    total = sum(caps.values()) * 1000
    value, on = system(hass)
    assert on == "on"
    assert float(value) == pytest.approx(total, abs=25)
    # The battery's manual mode is not touched by day.
    assert "switch.venus_manual_mode" not in executor.data["saved"]
    assert executor.data["saved"] == {
        "number.omni_max_charge": 0.0,
        "switch.omni_power_limits": False,
    }
    # The night begins (a dynamic tariff's afternoon window).
    night = dict(plan)
    start = dt_util.now() + timedelta(minutes=30)
    night.update(
        kind="hold",
        fixed=True,
        window={
            "start": start.isoformat(),
            "end": (start + timedelta(hours=3)).isoformat(),
        },
        rules={"discharge_mode": "until_target"},
    )
    holder["plan"] = night
    freezer.move_to(start + timedelta(minutes=1))
    await executor.async_check()
    assert system(hass) == ("0.0", "off")
    assert executor.data["surplus"]["caps"] == {}
    assert "number.omni_max_charge" not in executor.data["saved"]


async def test_omnibattery_warns_about_its_own_charge_delay(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-06-20T09:00:00+02:00")
    install_system(hass)
    install_evcc(hass)
    entry = MockConfigEntry(domain="omnibattery")
    entry.add_to_hass(hass)
    registry = er.async_get(hass)
    soc = registry.async_get_or_create(
        "sensor", "omnibattery", "10.0.0.1_502_battery_soc", config_entry=entry
    )
    hass.states.async_set(soc.entity_id, "40", {"unit_of_measurement": "%"})
    switches = {}
    for key in ("charge_delay", "predictive_charging"):
        item = registry.async_get_or_create(
            "switch", "omnibattery", f"marstek_venus_system_{key}", config_entry=entry
        )
        switches[key] = item.entity_id
    hass.states.async_set(switches["charge_delay"], "on")
    hass.states.async_set(switches["predictive_charging"], "off")
    battery = {**system_venus(), "soc_entity": soc.entity_id}
    executor, _ = await make_executor(
        hass, omni_config(battery), day_plan(dt_util.now())
    )
    await executor.async_check()
    codes = [c["code"] for c in executor.view["surplus"]["conflicts"]]
    assert codes == ["charge_delay"]
    hass.states.async_set(switches["predictive_charging"], "on")
    await executor.async_check()
    codes = [c["code"] for c in executor.view["surplus"]["conflicts"]]
    assert codes == ["charge_delay", "predictive_charging"]


# --- automations that write the same limit -------------------------------------------


async def test_a_battery_whose_limit_an_automation_writes_takes_part_all_the_same(
    hass: HomeAssistant, freezer
) -> None:
    """The owner's interlock writes the same limit: the owner is told (see
    the executor's automations), the cap is written all the same."""
    freezer.move_to("2026-06-20T09:00:00+02:00")
    install_limit(hass)
    install_evcc(hass)
    assert await async_setup_component(
        hass,
        "automation",
        {
            "automation": [
                {
                    "id": "interlock",
                    "alias": "Interlock R2",
                    "triggers": [
                        {"trigger": "state", "entity_id": "sensor.venus_power"}
                    ],
                    "actions": [
                        {
                            "action": "number.set_value",
                            "target": {"entity_id": "number.charge_limit"},
                            "data": {"value": 0},
                        }
                    ],
                }
            ]
        },
    )
    await hass.async_block_till_done()
    config = model.validate(
        {
            "version": model.CONFIG_VERSION,
            "batteries": [limited_fronius()],
            "rules": {"day_surplus": True, "grid_friendly": False},
        }
    )
    executor, _ = await make_executor(hass, config, day_plan(dt_util.now()))
    await executor.async_check()
    await hass.async_block_till_done()
    mine = executor.view["surplus"]["batteries"]["byd"]
    assert mine["state"] == "capped"
    assert "automations" not in mine
    assert limit(hass) == ("800.0", "on")
    assert executor.view["automations"] == ["Interlock R2"]
    assert hass.states.get("automation.interlock_r2").state == "on"


async def test_a_value_someone_else_set_is_not_put_back(
    hass: HomeAssistant, freezer
) -> None:
    """Joe's cap was not even seen yet when an automation set its own value:
    the release leaves that value, forgets the original and says so."""
    freezer.move_to("2026-06-20T09:00:00+02:00")
    install_limit(hass)
    install_evcc(hass)
    config = model.validate(
        {
            "version": model.CONFIG_VERSION,
            "batteries": [limited_fronius()],
            "rules": {"day_surplus": True, "grid_friendly": False},
        }
    )
    executor, holder = await make_executor(hass, config, day_plan(dt_util.now()))
    await executor.async_check()
    assert limit(hass) == ("800.0", "on")
    assert not executor.data["written"]["number.charge_limit"]["confirmed"]
    attrs = hass.states.get("number.charge_limit").attributes
    hass.states.async_set("number.charge_limit", "2000", attrs)
    holder["mode"] = "simulation"
    await executor.async_check()
    assert limit(hass) == ("2000", "off")
    assert executor.data["saved"] == {}
    external = [e for e in executor.data["log"] if e["kind"] == "external"]
    assert external[0]["entity"] == "number.charge_limit"
    assert external[0]["value"] == 2000.0
    # The same at the end of the day's cap (the batteries are full).
    holder["mode"] = "live"
    freezer.move_to("2026-06-21T09:00:00+02:00")
    holder["plan"] = day_plan(dt_util.now())
    hass.states.async_set("number.charge_limit", "5000", attrs)
    await executor.async_check()
    assert limit(hass) == ("800.0", "on")
    hass.states.async_set("number.charge_limit", "3000", attrs)
    await executor._async_surplus_off(config, dt_util.now(), "night")
    assert limit(hass) == ("3000", "off")
    assert "number.charge_limit" not in executor.data["saved"]


# --- Fronius: a limit in % and what 100 % stand for ---------------------------------


def percent_fronius(ref: float | None = None) -> dict[str, Any]:
    return {**limited_fronius(), "limit_ref_w": ref}


def install_percent(hass: HomeAssistant, soc: float = 40) -> None:
    install_limit(hass, soc=soc)
    hass.states.async_set(
        "number.charge_limit",
        "100",
        {"min": 0, "max": 100, "step": 1, "unit_of_measurement": "%"},
    )


def test_a_percent_limit_with_its_reference(hass: HomeAssistant) -> None:
    install_percent(hass)
    adapter = make_adapter(percent_fronius(6000))
    assert adapter.can_limit(hass)
    # 0.8 kW of 6 kW: 13.33 % up to the next whole percent.
    assert adapter.limit(hass, 0.8) == [
        Write("switch.charge_limit", True),
        Write("number.charge_limit", 14),
    ]


async def test_the_cap_in_percent_once_the_reference_is_known(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-06-20T09:00:00+02:00")
    install_percent(hass)
    install_evcc(hass)
    config = model.validate(
        {
            "version": model.CONFIG_VERSION,
            "batteries": [percent_fronius(5000)],
            "rules": {"day_surplus": True, "grid_friendly": False},
        }
    )
    executor, _ = await make_executor(hass, config, day_plan(dt_util.now()))
    await executor.async_check()
    # 0.8 kW of 5 kW.
    assert limit(hass) == ("16.0", "on")


def learn_config() -> dict[str, Any]:
    config = model.validate(
        {
            "version": model.CONFIG_VERSION,
            "batteries": [percent_fronius()],
            "rules": {"day_surplus": True, "grid_friendly": False},
        }
    )
    config["measurements"]["solar_power"] = [
        {"entity_id": "sensor.pv", "invert": False, "minus_entity_id": None}
    ]
    return config


async def test_joe_learns_what_100_percent_stand_for(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-06-20T11:00:00+02:00")
    install_percent(hass)
    install_evcc(hass)
    watts = {"unit_of_measurement": "W"}
    hass.states.async_set("sensor.pv", "7000", watts)
    hass.states.async_set("sensor.byd_power", "4200", watts)
    executor, holder = await make_executor(
        hass, learn_config(), day_plan(dt_util.now())
    )
    learned: list[tuple[str, float]] = []
    executor.on_learned = lambda battery_id, ref: learned.append((battery_id, ref))
    await executor.async_check()
    # The test limit: 50 %, while the battery takes 4.2 kW unrestricted.
    assert limit(hass) == ("50.0", "on")
    assert executor.view["surplus"]["batteries"]["byd"]["state"] == "learning"
    # It settles at 2.6 kW: 100 % stand for 5.2 kW.
    hass.states.async_set("sensor.byd_power", "2600", watts)
    freezer.move_to("2026-06-20T11:02:00+02:00")
    await executor.async_check()
    assert limit(hass) == ("50.0", "on")
    freezer.move_to("2026-06-20T11:03:30+02:00")
    await executor.async_check()
    assert learned == [("byd", 5200.0)]
    assert limit(hass) == ("100.0", "off")
    assert executor.data["saved"] == {}
    kinds = [e["kind"] for e in executor.data["log"] if e["kind"] != "set"]
    assert kinds[:2] == ["limit_ref_test", "limit_ref"]
    # Kept by the runtime: from now on the battery takes part.
    holder["config"] = model.apply_update(
        holder["config"], {"batteries": {"byd": {"limit_ref_w": 5200}}}, "learned"
    )
    await executor.async_check()
    assert executor.view["surplus"]["batteries"]["byd"]["state"] == "capped"


async def test_a_test_that_tells_nothing_is_tried_another_day(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-06-20T11:00:00+02:00")
    install_percent(hass)
    install_evcc(hass)
    watts = {"unit_of_measurement": "W"}
    hass.states.async_set("sensor.pv", "7000", watts)
    hass.states.async_set("sensor.byd_power", "4200", watts)
    executor, _ = await make_executor(hass, learn_config(), day_plan(dt_util.now()))
    learned: list[Any] = []
    executor.on_learned = lambda *args: learned.append(args)
    await executor.async_check()
    assert limit(hass) == ("50.0", "on")
    # 50 % were above what it takes: no drop.
    freezer.move_to("2026-06-20T11:04:00+02:00")
    await executor.async_check()
    assert learned == []
    assert limit(hass) == ("100.0", "off")
    failed = [e for e in executor.data["log"] if e["kind"] == "limit_ref_failed"]
    assert failed[0]["reason"] == "no_effect"
    # Not again today; tomorrow with half the test limit.
    await executor.async_check()
    assert limit(hass) == ("100.0", "off")
    freezer.move_to("2026-06-21T11:00:00+02:00")
    executor._plan = lambda: day_plan(dt_util.now())
    await executor.async_check()
    assert limit(hass) == ("25.0", "on")
    # Clouds during the test: nothing learned either.
    hass.states.async_set("sensor.byd_power", "1000", watts)
    hass.states.async_set("sensor.pv", "1500", watts)
    freezer.move_to("2026-06-21T11:04:00+02:00")
    await executor.async_check()
    assert learned == []
    failed = [e for e in executor.data["log"] if e["kind"] == "limit_ref_failed"]
    assert failed[-1]["reason"] == "sun"


async def test_no_test_without_plenty_of_sun_or_in_simulation(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-06-20T11:00:00+02:00")
    install_percent(hass)
    install_evcc(hass)
    watts = {"unit_of_measurement": "W"}
    hass.states.async_set("sensor.pv", "4300", watts)
    hass.states.async_set("sensor.byd_power", "4200", watts)
    executor, _ = await make_executor(hass, learn_config(), day_plan(dt_util.now()))
    await executor.async_check()
    # The battery takes all the sun there is: its power says nothing.
    assert limit(hass) == ("100", "off")
    hass.states.async_set("sensor.pv", "7000", watts)
    dry, _ = await make_executor(
        hass, learn_config(), day_plan(dt_util.now()), mode="simulation"
    )
    await dry.async_check()
    assert limit(hass) == ("100", "off")
    assert dry.view["surplus"]["batteries"]["byd"]["state"] == "need_ref"


async def test_the_night_ends_a_test_at_once(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-06-20T11:00:00+02:00")
    install_percent(hass)
    install_evcc(hass)
    watts = {"unit_of_measurement": "W"}
    hass.states.async_set("sensor.pv", "7000", watts)
    hass.states.async_set("sensor.byd_power", "4200", watts)
    plan = day_plan(dt_util.now())
    executor, holder = await make_executor(hass, learn_config(), plan)
    await executor.async_check()
    assert limit(hass) == ("50.0", "on")
    night = dict(plan)
    start = dt_util.now()
    night.update(
        kind="hold",
        fixed=True,
        window={
            "start": start.isoformat(),
            "end": (start + timedelta(hours=3)).isoformat(),
        },
        rules={"discharge_mode": "until_target"},
    )
    holder["plan"] = night
    freezer.move_to(start + timedelta(minutes=1))
    await executor.async_check()
    assert limit(hass) == ("100.0", "off")
    assert executor.data["surplus"]["learn"] is None
