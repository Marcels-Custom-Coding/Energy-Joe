"""Daytime surplus: the cap math, evcc's side and the executor that writes the caps."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.energy_joe import model
from custom_components.energy_joe.control import evcc
from custom_components.energy_joe.control.adapters import make_adapter
from custom_components.energy_joe.control.writes import Write
from custom_components.energy_joe.plan import surplus
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.util import dt as dt_util

from .test_control import (
    install_devices,
    limited_fronius,
    make_executor,
    sunny_morning_plan,
    venus_battery,
)

TZ = "+02:00"


@pytest.fixture(autouse=True)
def berlin(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


def at(day: str, hour: int, minute: int = 0) -> datetime:
    return datetime.fromisoformat(f"{day}T{hour:02d}:{minute:02d}:00{TZ}")


def hours(
    day: str, peak: float, middle: int = 13, width: float = 0.8, home: float = 0.5
) -> list[dict[str, Any]]:
    """A day of forecast: a triangle of sun around noon, a flat house."""
    return [
        {
            "start": at(day, h).isoformat(),
            "solar": max(0.0, peak - abs(h - middle) * width),
            "home": home,
            "window": False,
        }
        for h in range(24)
    ]


def store(soc: float, capacity: float = 10.0, **extra: Any) -> surplus.Store:
    return surplus.Store(id="byd", capacity=capacity, soc=soc, max_kw=5.0, **extra)


# --- the math -----------------------------------------------------------------


def test_summer_caps_low_and_full_before_the_evening() -> None:
    day = "2026-06-20"
    now = at(day, 9)
    found = surplus.slots(hours(day, 5.0), None, now, surplus.CAUTION["normal"])
    result = surplus.day_cap(found, [store(40)], now)
    assert result["state"] == "cap"
    # The cautious sun covers the house until 19:00.
    assert result["pv_end"] == at(day, 19)
    cap = result["cap_kw"]
    assert cap == result["caps"]["byd"] == 0.8
    need = 6 * surplus.MARGIN + surplus.MARGIN_KWH
    until = [s for s in found if s.start < at(day, 19)]
    # Enough to fill the battery (with its margin), but no step less would do.
    assert surplus.taken(until, cap) >= need
    assert surplus.taken(until, cap - surplus.STEP_KW) < need
    assert result["expected_kwh"] > 10


def test_winter_ends_earlier_and_lets_go_when_the_sun_is_short() -> None:
    day = "2026-12-20"
    now = at(day, 9)
    short = hours(day, 2.0, middle=12, width=0.5)
    found = surplus.slots(short, None, now, surplus.CAUTION["normal"])
    # A nearly empty battery: the winter sun does not fill it, no cap.
    assert surplus.day_cap(found, [store(30)], now)["state"] == "not_reachable"
    # Almost full: a small cap, and the sun's end is mid-afternoon.
    result = surplus.day_cap(found, [store(90)], now)
    assert result["state"] == "cap"
    assert result["pv_end"] == at(day, 15)
    assert result["cap_kw"] < 1


def test_caution_decides_on_a_cloudy_day() -> None:
    day = "2026-09-10"
    now = at(day, 10)
    cloudy = hours(day, 2.2, width=0.3)
    tight = surplus.slots(cloudy, None, now, surplus.CAUTION["tight"])
    careful = surplus.slots(cloudy, None, now, surplus.CAUTION["careful"])
    assert surplus.day_cap(tight, [store(50)], now)["state"] == "cap"
    assert surplus.day_cap(careful, [store(50)], now)["state"] == "not_reachable"
    # More caution, an earlier end of the sun.
    assert surplus.pv_end(careful, now) < surplus.pv_end(tight, now)


def test_full_late_and_free_batteries() -> None:
    day = "2026-06-20"
    found = surplus.slots(hours(day, 5.0), None, at(day, 9), 0.8)
    assert surplus.day_cap(found, [store(100)], at(day, 9))["state"] == "full"
    late = surplus.slots(hours(day, 5.0), None, at(day, 19, 30), 0.8)
    assert surplus.day_cap(late, [store(40)], at(day, 19, 30))["state"] == "after_pv"
    # Lots of room on a battery Joe cannot cap: it takes the sun first.
    alone = surplus.day_cap(found, [store(40)], at(day, 9))["cap_kw"]
    other = surplus.Store(id="other", capacity=10, soc=0, max_kw=2.0, capped=False)
    shared = surplus.day_cap(found, [store(40), other], at(day, 9))
    assert shared["cap_kw"] > alone
    assert "other" not in shared["caps"]
    # Two capped batteries share the cap by the room they have left.
    second = surplus.Store(id="venus", capacity=5, soc=40, max_kw=2.5)
    both = surplus.day_cap(found, [store(40), second], at(day, 9))
    assert both["caps"]["byd"] > both["caps"]["venus"]


def test_the_current_hour_is_cut_and_the_real_sun_counts() -> None:
    day = "2026-06-20"
    plan = hours(day, 5.0)
    created = at(day, 12, 30)
    # The plan's noon hour holds half an hour; at 12:45 a quarter is left.
    plan[12]["solar"] = 4.2 / 2
    found = surplus.slots(plan, created, at(day, 12, 45), 1.0)
    assert found[0].solar == pytest.approx(4.2 / 4)
    assert found[0].hours == pytest.approx(0.25)
    assert surplus.forecast_kw(plan, created, at(day, 12, 45)) == pytest.approx(4.2)
    # The panels give a quarter of the forecast: that counts now.
    lagging = surplus.slots(plan, created, at(day, 12, 45), 0.8, sun_ratio=0.25)
    assert lagging[0].solar == pytest.approx(4.2 / 4 * 0.25)
    # Better than the caution: the caution stays.
    sunny = surplus.slots(plan, created, at(day, 12, 45), 0.8, sun_ratio=1.5)
    assert sunny[0].solar == pytest.approx(4.2 / 4 * 0.8)


# --- the charge limit as a power ----------------------------------------------


@pytest.mark.parametrize(
    ("unit", "attrs", "expected"),
    [
        ("W", {"min": 0, "max": 5000}, 800),
        ("kW", {"min": 0, "max": 5}, 0.8),
    ],
)
def test_a_power_cap_in_the_unit_of_the_limit(
    hass: HomeAssistant, unit: str, attrs: dict[str, Any], expected: float
) -> None:
    install_devices(hass)
    hass.states.async_set(
        "number.charge_limit", "5", {**attrs, "unit_of_measurement": unit}
    )
    hass.states.async_set("switch.charge_limit", "off")
    adapter = make_adapter(limited_fronius())
    assert adapter.can_limit(hass)
    assert adapter.limit(hass, 0.8) == [
        Write("switch.charge_limit", True),
        Write("number.charge_limit", expected),
    ]
    saved = {"number.charge_limit": 5000.0, "switch.charge_limit": False}
    assert adapter.unlimit(saved) == [
        Write("switch.charge_limit", False),
        Write("number.charge_limit", 5000.0),
    ]


def test_only_a_limit_in_watts_takes_part(hass: HomeAssistant) -> None:
    """Fronius counts its % of WChaMax, which Home Assistant does not show: a %
    (or A, or no unit) is never turned into a power, even with a known maximum."""
    install_devices(hass)
    battery = limited_fronius()
    assert battery["max_charge_w"] == 5000
    for attrs in ({"unit_of_measurement": "%"}, {"unit_of_measurement": "A"}, {}):
        hass.states.async_set("number.charge_limit", "100", attrs)
        assert make_adapter(battery).limit_problem(hass) == "unit"
    hass.states.async_set("number.charge_limit", "unavailable", {})
    assert make_adapter(battery).limit_problem(hass) == "unavailable"
    hass.states.async_set("number.charge_limit", "5000", {"unit_of_measurement": "W"})
    assert make_adapter(battery).limit_problem(hass) is None
    # Marstek (Omnibattery) has no charge limit Joe may set outside manual mode.
    assert make_adapter(venus_battery()).limit_problem(hass) == "no_limit"


def test_the_owners_own_limit_stays_the_highest(hass: HomeAssistant) -> None:
    install_devices(hass)
    watts = {"min": 0, "max": 5000, "unit_of_measurement": "W"}
    hass.states.async_set("number.charge_limit", "600", watts)
    hass.states.async_set("switch.charge_limit", "on")
    adapter = make_adapter(limited_fronius())
    # Already limited to 600 W by the owner: Joe never writes more.
    assert adapter.limit(hass, 0.8)[-1] == Write("number.charge_limit", 600.0)
    assert adapter.limit(hass, 0.4)[-1] == Write("number.charge_limit", 400)
    # The original counts (Joe's own value is in force now).
    saved = {"number.charge_limit": 600.0, "switch.charge_limit": True}
    hass.states.async_set("number.charge_limit", "400", watts)
    assert adapter.limit(hass, 0.8, saved)[-1] == Write("number.charge_limit", 600.0)
    # Switched off before: no limit of the owner's.
    saved["switch.charge_limit"] = False
    assert adapter.limit(hass, 0.8, saved)[-1] == Write("number.charge_limit", 800)


# --- evcc ---------------------------------------------------------------------------


def install_evcc(
    hass: HomeAssistant,
    mode: str = "pv",
    heating: bool = True,
    connected: bool = False,
    buffer_soc: str = "0",
    boost: bool = False,
) -> None:
    """evcc_intg with one loadpoint (the floor heating or a car) and its site settings."""
    entry = MockConfigEntry(domain="evcc_intg", data={})
    entry.add_to_hass(hass)
    devices = dr.async_get(hass)
    entities = er.async_get(hass)
    site = devices.async_get_or_create(
        config_entry_id=entry.entry_id, identifiers={("evcc_intg", "site")}, name="evcc"
    )
    point = devices.async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={("evcc_intg", "lp1")},
        name="Fußbodenheizung" if heating else "Garage",
    )

    def add(entity_id: str, device: str, state: str, attrs: dict[str, Any]) -> None:
        domain, name = entity_id.split(".")
        entities.async_get_or_create(
            domain,
            "evcc_intg",
            f"evcc_intg.{name}",
            config_entry=entry,
            device_id=device,
            suggested_object_id=name,
        )
        hass.states.async_set(entity_id, state, attrs)

    add(
        "select.home_lp1_mode",
        point.id,
        mode,
        {"options": ["off", "pv", "minpv", "now"]},
    )
    add("binary_sensor.home_lp1_connected", point.id, "on" if connected else "off", {})
    add(
        "sensor.home_lp1_vehicle_soc",
        point.id,
        "21.5" if heating else "40",
        {"unit_of_measurement": "°C" if heating else "%"},
    )
    add("switch.home_lp1_battery_boost", point.id, "on" if boost else "off", {})
    add("select.home_priority_soc", site.id, "50", {})
    add("select.home_buffer_soc", site.id, buffer_soc, {})
    add("select.home_buffer_start_soc", site.id, "0", {})


async def test_evcc_loadpoints_and_settings(hass: HomeAssistant) -> None:
    install_evcc(hass, buffer_soc="80", boost=True)
    snap = evcc.snapshot(hass)
    points = evcc.loadpoints(snap)
    assert [(p["name"], p["kind"], p["mode"], p["wants"]) for p in points] == [
        ("Fußbodenheizung", "heating", "pv", True)
    ]
    found = evcc.settings(snap)
    assert found["priority_soc"] == 50
    assert found["buffer_soc"] == 80
    assert found["buffer_start_soc"] == 0
    codes = [c["code"] for c in evcc.conflicts(found, points)]
    assert codes == ["buffer_soc", "battery_boost"]


async def test_a_car_needs_to_be_connected(hass: HomeAssistant) -> None:
    install_evcc(hass, heating=False, connected=False)
    assert not evcc.loadpoints(evcc.snapshot(hass))[0]["wants"]
    hass.states.async_set("binary_sensor.home_lp1_connected", "on")
    assert evcc.loadpoints(evcc.snapshot(hass))[0]["wants"]
    hass.states.async_set("select.home_lp1_mode", "now", {"options": ["pv", "now"]})
    assert not evcc.loadpoints(evcc.snapshot(hass))[0]["wants"]


# --- the executor ---------------------------------------------------------------------


def day_plan(now: datetime, peak: float = 5.0) -> dict[str, Any]:
    """Tonight's preview during the day: today's hours from midnight."""
    day = dt_util.as_local(now).date().isoformat()
    start = dt_util.start_of_local_day(now) + timedelta(days=1)
    return {
        "kind": "none",
        "target": 10,
        "window": {
            "start": start.isoformat(),
            "end": (start + timedelta(hours=5)).isoformat(),
        },
        "batteries": [{"id": "byd", "target": 10, "power_kw": 0, "capacity": 10.0}],
        "hours": hours(day, peak),
    }


def surplus_config(**rules: Any) -> dict[str, Any]:
    return model.validate(
        {
            "version": model.CONFIG_VERSION,
            "batteries": [limited_fronius()],
            "rules": {"day_surplus": True, "grid_friendly": False, **rules},
        }
    )


def install_limit(hass: HomeAssistant, soc: float = 40) -> None:
    install_devices(hass, byd_soc=soc)
    watts = {"min": 0, "max": 5000, "step": 10, "unit_of_measurement": "W"}
    hass.states.async_set("number.charge_limit", "5000", watts)
    hass.states.async_set("switch.charge_limit", "off")


def limit(hass: HomeAssistant) -> tuple[str, str]:
    return (
        hass.states.get("number.charge_limit").state,
        hass.states.get("switch.charge_limit").state,
    )


async def test_the_cap_is_written_raised_and_given_back_when_full(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-06-20T09:00:00+02:00")
    install_limit(hass)
    install_evcc(hass)
    executor, holder = await make_executor(hass, surplus_config(), None)
    holder["plan"] = day_plan(dt_util.now())
    await executor.async_check()
    # 0.8 kW of the BYD's 5 kW.
    assert limit(hass) == ("800.0", "on")
    view = executor.view["surplus"]
    assert view["state"] == "cap"
    assert view["cap_kw"] == 0.8
    assert view["pv_end"].startswith("2026-06-20T19:00")
    assert view["batteries"]["byd"]["state"] == "capped"
    assert view["loadpoints"][0]["name"] == "Fußbodenheizung"
    assert executor.data["saved"] == {
        "switch.charge_limit": False,
        "number.charge_limit": 5000.0,
    }
    # Noon and the battery has not moved: the cap rises at once.
    freezer.move_to("2026-06-20T12:00:00+02:00")
    await executor.async_check()
    assert limit(hass) == ("1200.0", "on")
    # Full: everything back as it was, and no cap again today.
    hass.states.async_set("sensor.byd_soc", "100", {"unit_of_measurement": "%"})
    await executor.async_check()
    assert limit(hass) == ("5000.0", "off")
    assert executor.data["saved"] == {}
    assert executor.data["surplus"]["released"] == "2026-06-20"
    hass.states.async_set("sensor.byd_soc", "60", {"unit_of_measurement": "%"})
    await executor.async_check()
    assert limit(hass) == ("5000.0", "off")
    assert executor.view["surplus"]["state"] == "released"
    log = [e for e in executor.data["log"] if e["kind"] != "set"]
    kinds = [e["kind"] for e in log]
    assert kinds == ["surplus_cap", "surplus_raise", "surplus_end", "released"]
    assert log[2]["reason"] == "full"


async def test_the_cap_rises_when_the_sun_lags(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-06-20T12:00:00+02:00")
    install_limit(hass)
    install_evcc(hass)
    hass.states.async_set("sensor.pv", "4200", {"unit_of_measurement": "W"})
    config = surplus_config()
    config["measurements"]["solar_power"] = [
        {"entity_id": "sensor.pv", "invert": False, "minus_entity_id": None}
    ]
    executor, _ = await make_executor(hass, config, day_plan(dt_util.now()))
    await executor.async_check()
    assert limit(hass) == ("1200.0", "on")
    # A thick cloud: (almost) nothing from the panels right now.
    hass.states.async_set("sensor.pv", "0", {"unit_of_measurement": "W"})
    await executor.async_check()
    assert limit(hass) == ("1600.0", "on")
    assert executor.view["surplus"]["sun_ratio"] == 0
    # The sun is back: the cap goes down only after a while.
    hass.states.async_set("sensor.pv", "4200", {"unit_of_measurement": "W"})
    await executor.async_check()
    assert limit(hass) == ("1600.0", "on")
    freezer.move_to("2026-06-20T12:16:00+02:00")
    await executor.async_check()
    assert limit(hass) == ("1200.0", "on")


async def test_the_cap_ends_with_the_sun(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-06-20T17:00:00+02:00")
    install_limit(hass, soc=95)
    install_evcc(hass)
    executor, _ = await make_executor(hass, surplus_config(), day_plan(dt_util.now()))
    await executor.async_check()
    assert limit(hass)[1] == "on"
    freezer.move_to("2026-06-20T19:01:00+02:00")
    await executor.async_check()
    assert limit(hass) == ("5000.0", "off")
    assert executor.view["surplus"]["state"] == "after_pv"
    assert executor.data["log"][-2]["reason"] == "after_pv"


async def test_no_cap_without_a_loadpoint_in_pv_mode(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-06-20T09:00:00+02:00")
    install_limit(hass)
    install_evcc(hass, mode="now")
    executor, _ = await make_executor(hass, surplus_config(), day_plan(dt_util.now()))
    await executor.async_check()
    assert limit(hass) == ("5000", "off")
    assert executor.view["surplus"]["state"] == "no_loadpoint"
    # Switched to PV: the cap comes; back to fast charging: it goes again.
    hass.states.async_set("select.home_lp1_mode", "pv", {"options": ["pv", "now"]})
    await executor.async_check()
    assert limit(hass) == ("800.0", "on")
    hass.states.async_set("select.home_lp1_mode", "now", {"options": ["pv", "now"]})
    await executor.async_check()
    assert limit(hass) == ("5000.0", "off")
    assert executor.data["surplus"]["released"] is None


async def test_only_live_and_only_when_switched_on(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-06-20T09:00:00+02:00")
    install_limit(hass)
    install_evcc(hass)
    plan = day_plan(dt_util.now())
    for mode in ("simulation", "advisory"):
        executor, _ = await make_executor(hass, surplus_config(), plan, mode=mode)
        await executor.async_check()
        assert limit(hass) == ("5000", "off")
        view = executor.view["surplus"]
        assert view["dry"] is True
        assert view["batteries"]["byd"] == {
            "name": "BYD",
            "state": "would",
            "soc": 40.0,
            "cap_kw": 0.8,
            "problem": None,
        }
    off = surplus_config(day_surplus=False)
    executor, _ = await make_executor(hass, off, plan)
    await executor.async_check()
    assert executor.view["surplus"]["state"] == "off"
    assert limit(hass) == ("5000", "off")
    # Left out on the battery's page, or without a test run: no cap either.
    left_out = surplus_config()
    left_out["batteries"][0]["day_surplus"] = False
    executor, _ = await make_executor(hass, left_out, plan)
    await executor.async_check()
    assert executor.view["surplus"]["batteries"]["byd"]["state"] == "left_out"
    executor, _ = await make_executor(hass, surplus_config(), plan, tested=False)
    await executor.async_check()
    assert executor.view["surplus"]["batteries"]["byd"]["state"] == "not_tested"
    assert limit(hass) == ("5000", "off")


async def test_a_mode_change_gives_the_limit_back(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-06-20T09:00:00+02:00")
    install_limit(hass)
    install_evcc(hass)
    executor, holder = await make_executor(
        hass, surplus_config(), day_plan(dt_util.now())
    )
    await executor.async_check()
    assert limit(hass) == ("800.0", "on")
    holder["mode"] = "simulation"
    await executor.async_check()
    assert limit(hass) == ("5000.0", "off")
    assert executor.data["saved"] == {}


async def test_the_morning_goes_first_and_the_cap_follows(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-06-20T07:00:00+02:00")
    install_limit(hass)
    install_evcc(hass)
    config = surplus_config(grid_friendly=True)
    plan = sunny_morning_plan(dt_util.now(), until="10:00")
    plan["day"]["defer_until"] = "2026-06-20T10:00+02:00"
    plan["hours"] = hours("2026-06-20", 5.0)
    executor, _ = await make_executor(hass, config, plan)
    await executor.async_check()
    assert limit(hass) == ("0.0", "on")
    assert executor.view["surplus"]["state"] == "morning"
    # The morning is over: the cap takes over without giving back in between.
    freezer.move_to("2026-06-20T10:00:00+02:00")
    await executor.async_check()
    assert limit(hass)[1] == "on"
    assert float(limit(hass)[0]) > 0
    assert executor.view["surplus"]["state"] == "cap"
    assert executor.data["saved"]["number.charge_limit"] == 5000.0
    kinds = [e["kind"] for e in executor.data["log"]]
    assert "released" not in kinds


async def test_release_now_and_the_night_end_the_cap(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-06-20T09:00:00+02:00")
    install_limit(hass)
    install_evcc(hass)
    executor, holder = await make_executor(
        hass, surplus_config(), day_plan(dt_util.now())
    )
    await executor.async_check()
    assert limit(hass) == ("800.0", "on")
    await executor.async_release_now()
    assert limit(hass) == ("5000.0", "off")
    await executor.async_check()
    assert limit(hass) == ("5000.0", "off")
    assert executor.view["surplus"]["state"] == "released"
    # Another day; a night window (a dynamic tariff's afternoon) begins while capped.
    freezer.move_to("2026-06-21T09:00:00+02:00")
    executor.data["skip"] = None
    holder["plan"] = day_plan(dt_util.now())
    await executor.async_check()
    assert limit(hass) == ("800.0", "on")
    night = dict(holder["plan"])
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
    assert limit(hass) == ("5000.0", "off")
    assert executor.data["surplus"]["caps"] == {}


# --- review: math edge cases ------------------------------------------------------


def test_a_cloudy_hour_at_noon_drains_and_counts() -> None:
    """A gap in the sun: the house runs on the batteries then, that comes on top."""
    day = "2026-06-20"
    now = at(day, 9)
    sunny = hours(day, 5.0)
    gap = [dict(h) for h in sunny]
    for h in (13, 14):
        gap[h]["solar"] = 0.0
        gap[h]["home"] = 2.0
    plain = surplus.day_cap(surplus.slots(sunny, None, now, 0.8), [store(40)], now)
    cloudy = surplus.day_cap(surplus.slots(gap, None, now, 0.8), [store(40)], now)
    # The sun still covers the house after the gap: the same end, a higher cap.
    assert cloudy["pv_end"] == plain["pv_end"] == at(day, 19)
    assert cloudy["need_kwh"] > plain["need_kwh"] + 4 * surplus.MARGIN - 0.01
    assert cloudy["cap_kw"] > plain["cap_kw"]


def test_a_battery_near_its_maximum_is_left_free_and_the_rest_worked_out_again() -> (
    None
):
    day = "2026-06-20"
    now = at(day, 9)
    found = surplus.slots(hours(day, 5.0), None, now, 0.8)
    small = surplus.Store(id="venus", capacity=10, soc=0, max_kw=0.5)
    result = surplus.day_cap(found, [store(40), small], now)
    assert result["state"] == "cap"
    # The Venus would need about its full 0.5 kW: it is not capped and counted
    # as taking the sun first; the BYD's cap is worked out with that.
    assert set(result["caps"]) == {"byd"}
    alone = surplus.day_cap(
        found,
        [
            store(40),
            surplus.Store(id="venus", capacity=10, soc=0, max_kw=0.5, capped=False),
        ],
        now,
    )
    assert result["caps"] == alone["caps"]


def test_no_forecast_and_an_unknown_day() -> None:
    day = "2026-03-29"  # the clocks go forward
    now = datetime.fromisoformat(f"{day}T09:00:00+02:00")
    assert surplus.day_cap(surplus.slots([], None, now, 0.8), [store(40)], now)[
        "state"
    ] == ("no_sun")
    dark = [dict(h, solar=0.0) for h in hours(day, 5.0)]
    found = surplus.slots(dark, None, now, 0.8)
    assert surplus.day_cap(found, [store(40)], now)["state"] == "no_sun"


# --- review: safety of the writes ------------------------------------------------------


async def test_a_percent_limit_takes_no_part(hass: HomeAssistant, freezer) -> None:
    """The BYD at the Fronius: its limit is % of a reference Joe cannot see."""
    freezer.move_to("2026-06-20T09:00:00+02:00")
    install_limit(hass)
    percent = {"min": 0, "max": 100, "step": 1, "unit_of_measurement": "%"}
    hass.states.async_set("number.charge_limit", "100", percent)
    install_evcc(hass)
    executor, _ = await make_executor(hass, surplus_config(), day_plan(dt_util.now()))
    await executor.async_check()
    assert hass.states.get("number.charge_limit").state == "100"
    view = executor.view["surplus"]
    assert view["state"] == "no_battery"
    assert view["batteries"]["byd"]["state"] == "unit"
    assert executor.data["saved"] == {}


async def test_a_cap_survives_a_crash_and_goes_back_after_it(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-06-20T09:00:00+02:00")
    install_limit(hass)
    install_evcc(hass)
    executor, _ = await make_executor(hass, surplus_config(), day_plan(dt_util.now()))
    await executor.async_check()
    assert limit(hass) == ("800.0", "on")
    # Home Assistant crashes (no release); after the start it is evening.
    freezer.move_to("2026-06-20T23:00:00+02:00")
    again, _ = await make_executor(hass, surplus_config(), day_plan(dt_util.now()))
    assert again.data["saved"] == {
        "switch.charge_limit": False,
        "number.charge_limit": 5000.0,
    }
    assert again.data["surplus"]["caps"] == {"byd": 0.8}
    await again.async_check()
    assert limit(hass) == ("5000.0", "off")
    assert again.data["saved"] == {}
    assert again.data["surplus"]["caps"] == {}


async def test_a_stop_gives_the_cap_back_and_forgets_it(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-06-20T09:00:00+02:00")
    install_limit(hass)
    install_evcc(hass)
    executor, _ = await make_executor(hass, surplus_config(), day_plan(dt_util.now()))
    await executor.async_check()
    assert limit(hass) == ("800.0", "on")
    # The integration is reloaded or unloaded.
    await executor.async_stop()
    assert limit(hass) == ("5000.0", "off")
    assert executor.data["surplus"]["caps"] == {}
    assert executor.data["log"][-2]["kind"] == "surplus_end"
    assert executor.data["log"][-2]["reason"] == "stopped"


async def test_a_failure_in_the_math_gives_the_cap_back(
    hass: HomeAssistant, freezer, monkeypatch: pytest.MonkeyPatch
) -> None:
    freezer.move_to("2026-06-20T09:00:00+02:00")
    install_limit(hass)
    install_evcc(hass)
    executor, _ = await make_executor(hass, surplus_config(), day_plan(dt_util.now()))
    await executor.async_check()
    assert limit(hass) == ("800.0", "on")

    def broken(*args: Any) -> None:
        raise ValueError("odd forecast")

    monkeypatch.setattr(surplus, "day_cap", broken)
    await executor.async_check()
    assert limit(hass) == ("5000.0", "off")
    assert executor.data["surplus"]["caps"] == {}


async def test_a_battery_removed_while_capped_is_given_back(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-06-20T09:00:00+02:00")
    install_limit(hass)
    install_evcc(hass)
    executor, holder = await make_executor(
        hass, surplus_config(), day_plan(dt_util.now())
    )
    await executor.async_check()
    assert limit(hass) == ("800.0", "on")
    holder["config"] = model.validate(
        {
            "version": model.CONFIG_VERSION,
            "rules": {"day_surplus": True, "grid_friendly": False},
        }
    )
    await executor.async_check()
    assert limit(hass) == ("5000.0", "off")
    assert executor.data["saved"] == {}


async def test_the_morning_lasts_until_its_end_after_the_window(
    hass: HomeAssistant, freezer
) -> None:
    """The planner's hourly preview after the window keeps last night's morning."""
    from custom_components.energy_joe.observe.store import HistoryStore
    from custom_components.energy_joe.plan.scheduler import JoePlanner

    freezer.move_to("2026-10-04T06:05:00+02:00")
    install_limit(hass)
    fixed = sunny_morning_plan(dt_util.now(), until="12:00")
    store_ = HistoryStore(hass)
    await store_.async_load()
    planner = JoePlanner(hass, store_, lambda: None)
    planner._config = model.default_config()
    planner._fixed = fixed
    tomorrow = dt_util.start_of_local_day(dt_util.now()) + timedelta(days=1)
    preview = {
        "kind": "none",
        "window": {
            "start": tomorrow.isoformat(),
            "end": (tomorrow + timedelta(hours=5)).isoformat(),
        },
        "hours": fixed["hours"],
    }

    async def compute(now: Any) -> dict[str, Any]:
        return dict(preview)

    planner._async_compute = compute  # type: ignore[method-assign]
    await planner.async_refresh()
    plan = planner.plan
    assert plan is not None and not plan.get("fixed")
    assert plan["morning"]["day"]["defer_until"] == fixed["day"]["defer_until"]
    config = model.validate(
        {"version": model.CONFIG_VERSION, "batteries": [limited_fronius()]}
    )
    executor, holder = await make_executor(hass, config, plan)
    await executor.async_check()
    assert executor.status["reason"] == "day"
    assert limit(hass) == ("0.0", "on")
    # At the end of the morning the planner lets it go, and so does Joe.
    freezer.move_to("2026-10-04T12:05:00+02:00")
    await planner.async_refresh()
    assert "morning" not in planner.plan
    holder["plan"] = planner.plan
    await executor.async_check()
    assert limit(hass) == ("5000.0", "off")
    await store_.async_unload()
