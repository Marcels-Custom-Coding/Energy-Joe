"""A car charging fast by day (evcc's mode "now"): the house from the battery
whose turn it is, the car from the grid (control/house.py). evcc's
discharge lock goes off meanwhile and back as it was; the power follows the
house's need without the wallbox, the sun taken off; nothing of it at
night, in evcc's other modes or with the rule off."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.energy_joe.control import evcc, house
from custom_components.energy_joe.control.adapters import make_adapter
from custom_components.energy_joe.control.writes import Write
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.util import dt as dt_util

from .test_control import make_executor, venus_battery
from .test_surplus import day_plan
from .test_team import (
    byd_levers,
    flows,
    install_team,
    levels,
    never_opposite,
    team_byd,
    team_config,
    team_venus,
    venus_levers,
)

LOCK = "switch.evcc_battery_discharge_control"
BATTERY_MODE = "sensor.evcc_battery_mode_value"
MODE = "select.evcc_garage_mode"
CHARGING = "binary_sensor.evcc_garage_charging"
POWER = "sensor.evcc_garage_charge_power"


@pytest.fixture(autouse=True)
def berlin(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


def install_fast(
    hass: HomeAssistant,
    mode: str = "now",
    charging: bool = True,
    power_kw: float = 11.0,
    lock: bool = True,
) -> None:
    """evcc_intg with a car's loadpoint and the site's discharge lock and
    battery mode (unique ids as evcc_intg has them, October 2026)."""
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
        name="Garage",
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

    add(MODE, point.id, mode, {"options": ["off", "smart", "now"]})
    add("binary_sensor.evcc_garage_connected", point.id, "on", {})
    add(CHARGING, point.id, "on" if charging else "off", {})
    add(POWER, point.id, str(power_kw), {"unit_of_measurement": "kW"})
    add("sensor.evcc_garage_vehicle_soc", point.id, "40", {"unit_of_measurement": "%"})
    add(LOCK, site.id, "on" if lock else "off", {})
    add(
        BATTERY_MODE, site.id, "entladen sperren" if lock and charging else "normal", {}
    )


def evcc_lets_go(hass: HomeAssistant) -> None:
    """evcc saw its lock go off: the battery is free again."""
    hass.states.async_set(BATTERY_MODE, "normal")


def modbus_byd(**extra: Any) -> dict[str, Any]:
    """The BYD at a Fronius over Modbus: its rates in % of 5 kW (WChaMax)."""
    return team_byd(**{"adapter": "fronius_modbus", "limit_ref_w": 5000, **extra})


def install_byd_rate(hass: HomeAssistant) -> None:
    hass.states.async_set(
        "number.discharge_limit",
        "100",
        {"min": -100, "max": 100, "step": 0.1, "unit_of_measurement": "%"},
    )


def kinds(executor: Any) -> list[str]:
    return [e["kind"] for e in executor.data["log"]]


async def tick(hass: HomeAssistant, executor: Any) -> None:
    """The look every few seconds, and the check it may start."""
    await executor.async_house_tick()
    await hass.async_block_till_done()


# --- the decisions -----------------------------------------------------------------


def test_the_need_is_the_house_without_the_wallbox_less_the_sun() -> None:
    # 11 kW for the car, 800 W for the house, no sun, the battery gives nothing.
    assert house.need_w(11.8, [0.0, 0.0], [11.0]) == pytest.approx(800)
    # The battery gives 800 W meanwhile: the same need (its power is in both).
    assert house.need_w(11.0, [-800.0, 0.0], [11.0]) == pytest.approx(800)
    # 500 W of sun: the battery gives only what is left.
    assert house.need_w(10.5, [-800.0], [11.0]) == pytest.approx(300)
    # More sun than the house needs: nothing.
    assert house.need_w(10.0, [-300.0], [11.0]) == 0
    # A value missing: no need.
    assert house.need_w(None, [0.0], [11.0]) is None
    assert house.need_w(11.8, [None], [11.0]) is None
    assert house.need_w(11.8, [0.0], [None]) is None


def test_the_power_is_the_lowest_need_for_a_while_in_steps() -> None:
    now = datetime(2026, 10, 19, 14, 0, tzinfo=dt_util.get_time_zone("Europe/Berlin"))
    samples: list[tuple[datetime, float]] = []
    assert house.target_w(samples) == 0
    house.sample(samples, now, 830)
    assert house.target_w(samples) == 800
    # A spike (the wallbox's meter late) does not count, a dip at once.
    house.sample(samples, now + timedelta(seconds=5), 9000)
    assert house.target_w(samples) == 800
    house.sample(samples, now + timedelta(seconds=10), 420)
    assert house.target_w(samples) == 400
    # After the span only the newer looks count.
    house.sample(samples, now + timedelta(seconds=45), 1210)
    assert house.target_w(samples) == 1200
    # Written anew only once it moved enough, or to and from nothing.
    assert house.moved(800, None)
    assert not house.moved(850, 800)
    assert house.moved(900, 800)
    assert house.moved(0, 50)
    assert house.moved(50, 0)
    # One shared limit: each battery of the group the whole power.
    assert house.shares(800, ["a", "b"], True) == {"a": 800, "b": 800}
    assert house.shares(800, ["a", "b"], False) == {"a": 400, "b": 400}


def test_the_levers_for_a_fixed_power(hass: HomeAssistant) -> None:
    install_team(hass)
    install_byd_rate(hass)
    # The Fronius over Modbus: its discharge rate in % of the reference.
    byd = make_adapter(modbus_byd())
    assert byd.house_lever(hass) == "limit"
    writes, _ = byd.team_block(hass, False, True, False)
    assert byd.team_house(hass, writes, 800) == [
        Write("number.discharge_limit", 16.0),
        Write("switch.discharge_limit", True),
    ]
    # Without the reference Joe cannot know what a percent is.
    assert make_adapter(modbus_byd(limit_ref_w=None)).house_problem(hass) == "need_ref"
    # Omnibattery's system limit in W: the discharge limit at the power,
    # charging open wide under the shared switch.
    venus = make_adapter(team_venus())
    assert venus.house_lever(hass) == "limit"
    writes, _ = venus.team_block(hass, False, True, False)
    assert venus.team_house(hass, writes, 800) == [
        Write("number.omni_max_charge", 2500.0),
        Write("number.omni_max_discharge", 800),
        Write("switch.omni_power_limits", True),
    ]
    # A Venus blocked with its own switches: a forced discharge in manual mode.
    hass.states.async_set("switch.allow_charge", "on")
    hass.states.async_set("switch.allow_discharge", "on")
    hass.states.async_set(
        "number.discharge_power", "0", {"min": 0, "max": 2500, "step": 50}
    )
    battery = venus_battery()
    battery["controls"] = {
        **battery["controls"],
        "allow_charge": "switch.allow_charge",
        "allow_discharge": "switch.allow_discharge",
        "discharge_power": "number.discharge_power",
    }
    battery["prepare"] = [{"entity_id": "switch.venus_manual_mode", "value": True}]
    own = make_adapter(battery)
    assert own.team_lever() == "allow" and own.house_lever(hass) == "mode"
    writes, _ = own.team_block(hass, False, True, False)
    found = [(w.entity_id, w.value) for w in own.team_house(hass, writes, 800)]
    assert found == [
        ("switch.allow_discharge", True),
        ("switch.venus_manual_mode", True),
        ("number.discharge_power", 800),
        ("select.force_mode", "Discharge"),
    ]
    exit_writes = [(w.entity_id, w.value) for w in own.team_house_exit(hass, "mode")]
    assert ("select.force_mode", "None") in exit_writes
    assert ("number.discharge_power", 0) in exit_writes
    assert own.team_house_exit(hass, "limit") == []


# --- the executor -----------------------------------------------------------------


async def test_the_house_from_the_battery_while_the_car_charges_fast(
    hass: HomeAssistant, freezer
) -> None:
    """The car charges fast with 11 kW, evcc holds the BYD: Joe switches
    evcc's lock off, waits until evcc let go, then the BYD gives the
    house's 800 W (16 % of its 5 kW), the Venus stays blocked. The sun
    comes: only what is left. evcc back on "smart": everything as before."""
    freezer.move_to("2026-10-19T14:00:00+02:00")
    install_team(hass, byd_soc=60, venus_soc=60)
    install_byd_rate(hass)
    install_fast(hass)
    flows(hass, grid=11800)
    holder_config = team_config(modbus_byd(), team_venus(), car_house_only=True)
    executor, holder = await make_executor(hass, holder_config, day_plan(dt_util.now()))
    await executor.async_check()
    view = executor.view["house"]
    assert view["state"] == "wait"
    assert view["loadpoints"] == ["Garage"]
    assert hass.states.get(LOCK).state == "off"
    assert executor.data["saved"][LOCK] is True
    # While evcc still holds it, the BYD is not taken for empty.
    for _ in range(6):
        freezer.tick(timedelta(seconds=5))
        await executor.async_guard()
    assert executor.view["team"]["active"] == "byd"
    assert "byd" not in executor.data["team"]["empty"]
    # As long as evcc holds, no battery discharges (the BYD neither).
    assert byd_levers(hass)[2:] == ("0.0", "on")
    # Nor does the Venus help meanwhile: she would feed the car.
    await executor.async_check()
    assert executor.view["team"]["help"] is False
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    # evcc let go: the next look checks at once.
    evcc_lets_go(hass)
    await tick(hass, executor)
    view = executor.view["house"]
    assert view["state"] == "on"
    assert view["need_w"] == 800 and view["w"] == 800
    assert view["batteries"] == ["byd"]
    team = executor.view["team"]
    assert team["batteries"]["byd"]["why"] == "house"
    assert team["house_w"] == 800
    never_opposite(team)
    assert byd_levers(hass)[2:] == ("16.0", "on")
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    assert executor.data["team"]["blocks"]["byd"]["house_w"] == 800
    assert "house" in kinds(executor)
    # The BYD gives its 800 W: the need stays (its power is in it).
    flows(hass, grid=11000, byd=-800)
    for _ in range(3):
        freezer.tick(timedelta(seconds=5))
        await tick(hass, executor)
    assert byd_levers(hass)[2] == "16.0"
    # 500 W of sun: 300 W are left for the BYD, at once.
    flows(hass, grid=10500, byd=-800)
    freezer.tick(timedelta(seconds=5))
    await tick(hass, executor)
    assert executor.view["house"]["w"] == 300
    assert byd_levers(hass)[2:] == ("6.0", "on")
    # A kettle: the need rises, but only after it lasted (no spike for the car).
    flows(hass, grid=12500, byd=-300)
    freezer.tick(timedelta(seconds=5))
    await tick(hass, executor)
    assert executor.view["house"]["w"] == 300
    for _ in range(7):
        freezer.tick(timedelta(seconds=5))
        await tick(hass, executor)
    assert executor.view["house"]["w"] == 1800
    assert byd_levers(hass)[2] == "36.0"
    # evcc back on "smart" (the car waits for the cheap hours): the BYD free
    # again as before, the lock back on.
    hass.states.async_set(MODE, "smart", {"options": ["off", "smart", "now"]})
    hass.states.async_set(CHARGING, "off")
    hass.states.async_set(POWER, "0.0", {"unit_of_measurement": "kW"})
    flows(hass, grid=1500, byd=-300)
    await tick(hass, executor)
    assert executor.view["house"]["state"] == "idle"
    assert hass.states.get(LOCK).state == "on"
    assert LOCK not in executor.data["saved"]
    assert evcc.LOCK_ID not in executor.data["active"]
    assert byd_levers(hass)[2:] == ("100.0", "off")
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    assert "house_w" not in executor.data["team"]["blocks"].get("byd", {})
    assert executor.data["house"]["on"] is False
    ended = [e for e in executor.data["log"] if e["kind"] == "house_end"]
    assert ended[-1]["reason"] == "idle"
    assert executor._house_unsub is None
    assert holder["config"]["rules"]["car_house_only"] is True


async def test_the_next_one_serves_the_house_once_the_first_is_empty(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-19T14:00:00+02:00")
    install_team(hass, byd_soc=60, venus_soc=60)
    install_byd_rate(hass)
    install_fast(hass, lock=False)
    flows(hass, grid=11800)
    cfg = team_config(modbus_byd(), team_venus(), car_house_only=True)
    executor, _ = await make_executor(hass, cfg, day_plan(dt_util.now()))
    await executor.async_check()
    # evcc's lock was off already: nothing to switch, the BYD at once.
    assert executor.view["house"]["state"] == "on"
    assert LOCK not in executor.data["saved"]
    assert byd_levers(hass)[2:] == ("16.0", "on")
    # The BYD at its floor: the Venus gives the house's 800 W, the BYD waits.
    levels(hass, byd=5)
    freezer.tick(timedelta(minutes=1))
    await executor.async_check()
    team = executor.view["team"]
    assert team["active"] == "venus"
    assert team["batteries"]["venus"]["why"] == "house"
    never_opposite(team)
    assert venus_levers(hass) == ("2500.0", "800.0", "on")
    assert byd_levers(hass) == ("0.0", "on", "0.0", "on")
    # The car is full: the Venus as "Nacheinander" has it again.
    hass.states.async_set(CHARGING, "off")
    hass.states.async_set(POWER, "0.0", {"unit_of_measurement": "kW"})
    flows(hass, grid=800)
    await tick(hass, executor)
    assert executor.view["house"]["state"] == "idle"
    assert "house_w" not in executor.data["team"]["blocks"].get("venus", {})
    assert executor.view["team"]["batteries"]["venus"]["why"] == "active"


async def test_nothing_of_it_at_night_in_smart_mode_or_with_the_rule_off(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-19T14:00:00+02:00")
    calls = install_team(hass, byd_soc=60, venus_soc=60)
    install_byd_rate(hass)
    install_fast(hass, mode="smart")
    flows(hass, grid=11800)
    cfg = team_config(modbus_byd(), team_venus(), car_house_only=True)
    executor, holder = await make_executor(hass, cfg, day_plan(dt_util.now()))
    await executor.async_check()
    assert executor.view["house"]["state"] == "idle"
    assert hass.states.get(LOCK).state == "on"
    assert all(entity != LOCK for entity, _ in calls)
    # The rule off: nothing either, even with the car on "now".
    hass.states.async_set(MODE, "now", {"options": ["off", "smart", "now"]})
    holder["config"] = team_config(modbus_byd(), team_venus())
    await executor.async_check()
    assert executor.view["house"]["state"] == "off"
    assert hass.states.get(LOCK).state == "on"
    # Joe's cheap window at night: the night's plan counts.
    holder["config"] = cfg
    freezer.move_to("2026-10-20T01:00:00+02:00")
    holder["plan"] = day_plan(dt_util.now() - timedelta(hours=2))
    await executor.async_check()
    assert executor.view["house"]["state"] == "night"
    assert hass.states.get(LOCK).state == "on"
    assert all(entity != LOCK for entity, _ in calls)
    assert "house" not in kinds(executor)
    # In the simulation Joe only says what he would do.
    freezer.move_to("2026-10-20T14:00:00+02:00")
    holder["plan"] = day_plan(dt_util.now())
    holder["mode"] = "simulation"
    await executor.async_check()
    assert executor.view["house"]["state"] == "dry"
    assert hass.states.get(LOCK).state == "on"


async def test_the_night_begins_and_everything_goes_back(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-19T23:58:00+02:00")
    install_team(hass, byd_soc=60, venus_soc=60)
    install_byd_rate(hass)
    install_fast(hass)
    flows(hass, grid=11800)
    cfg = team_config(modbus_byd(), team_venus(), car_house_only=True)
    plan = day_plan(dt_util.now())
    executor, holder = await make_executor(hass, cfg, plan)
    await executor.async_check()
    evcc_lets_go(hass)
    await tick(hass, executor)
    assert executor.view["house"]["state"] == "on"
    assert byd_levers(hass)[2:] == ("16.0", "on")
    # Midnight, Joe's window charges the BYD from the grid: the lock back
    # on, the house's power gone, the night's plan steers.
    freezer.move_to("2026-10-20T00:01:00+02:00")
    holder["plan"] = {**plan, "kind": "charge", "fixed": True}
    await executor.async_check()
    assert executor.view["house"]["state"] == "night"
    assert hass.states.get(LOCK).state == "on"
    assert LOCK not in executor.data["saved"]
    assert executor.data["house"]["on"] is False
    assert executor.data["team"]["blocks"] == {}
    ended = [e for e in executor.data["log"] if e["kind"] == "house_end"]
    assert ended[-1]["reason"] == "night"


async def test_one_battery_alone_and_what_stops_it(
    hass: HomeAssistant, freezer
) -> None:
    """One battery regulates alone: it gives the house's power itself. The
    owner switches evcc's lock back on by hand: his, Joe stops and leaves
    it on."""
    freezer.move_to("2026-10-19T14:00:00+02:00")
    install_team(hass, byd_soc=60)
    install_byd_rate(hass)
    install_fast(hass)
    flows(hass, grid=11800)
    cfg = team_config(modbus_byd(), car_house_only=True)
    executor, _ = await make_executor(hass, cfg, day_plan(dt_util.now()))
    await executor.async_check()
    assert executor.view["team"]["state"] == "single"
    evcc_lets_go(hass)
    await tick(hass, executor)
    assert executor.view["house"]["state"] == "on"
    assert executor.view["house"]["batteries"] == ["byd"]
    assert byd_levers(hass)[2:] == ("16.0", "on")
    assert executor.data["house"]["single"] == {"battery": "byd", "lever": "limit"}
    # A later check keeps it (nothing given back in between).
    freezer.tick(timedelta(minutes=1))
    await executor.async_check()
    assert byd_levers(hass)[2:] == ("16.0", "on")
    # The owner wants evcc's lock: Joe notes it as his and stops.
    hass.states.async_set(LOCK, "on")
    freezer.tick(timedelta(minutes=1))
    await executor.async_check()
    await executor.async_check()
    assert executor.view["house"]["state"] == "lock_taken"
    assert hass.states.get(LOCK).state == "on"
    assert byd_levers(hass)[2:] == ("100.0", "off")
    assert executor.data["saved"] == {}


async def test_it_does_not_start_without_what_it_needs(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-19T14:00:00+02:00")
    install_team(hass, byd_soc=60, venus_soc=60)
    install_byd_rate(hass)
    flows(hass, grid=11800)
    # No evcc at all.
    cfg = team_config(modbus_byd(), team_venus(), car_house_only=True)
    executor, holder = await make_executor(hass, cfg, day_plan(dt_util.now()))
    await executor.async_check()
    assert executor.view["house"]["state"] == "no_evcc"
    install_fast(hass)
    # The BYD's rate without its reference: Joe does not switch evcc's lock.
    holder["config"] = team_config(
        modbus_byd(limit_ref_w=None), team_venus(), car_house_only=True
    )
    await executor.async_check()
    view = executor.view["house"]
    assert view["state"] == "no_lever"
    assert view["problems"] == {"byd": "need_ref"}
    assert hass.states.get(LOCK).state == "on"
    # Left to themselves ("Gleichzeitig"), the Venus would feed the car.
    holder["config"] = team_config(
        modbus_byd(), team_venus(), car_house_only=True, battery_team="together"
    )
    await executor.async_check()
    assert executor.view["house"]["state"] == "together"
    assert hass.states.get(LOCK).state == "on"
    assert executor.data["saved"] == {}


async def test_letting_go_at_once_puts_evccs_lock_back(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-19T14:00:00+02:00")
    install_team(hass, byd_soc=60, venus_soc=60)
    install_byd_rate(hass)
    install_fast(hass)
    flows(hass, grid=11800)
    cfg = team_config(modbus_byd(), team_venus(), car_house_only=True)
    executor, _ = await make_executor(hass, cfg, day_plan(dt_util.now()))
    await executor.async_check()
    evcc_lets_go(hass)
    await tick(hass, executor)
    assert executor.view["house"]["state"] == "on"
    # "Sofort freigeben": everything back, evcc's lock, too; no more today.
    await executor.async_release_now()
    assert hass.states.get(LOCK).state == "on"
    assert byd_levers(hass)[2:] == ("100.0", "off")
    assert executor.data["saved"] == {}
    await executor.async_check()
    view = executor.view["house"]
    assert view["state"] == "team" and view["team"] == "paused"
    assert executor.data["house"]["on"] is False
    assert hass.states.get(LOCK).state == "on"


async def test_while_evcc_holds_the_battery_nobody_feeds_the_car(
    hass: HomeAssistant, freezer
) -> None:
    """The rule off, the car charges fast, evcc holds the BYD: the owner's
    wish. The BYD gives nothing, but it is not taken for empty, the Venus
    does not take over or help – every battery is blocked against
    discharging, told once. Once evcc lets go, as usual again."""
    freezer.move_to("2026-10-19T19:00:00+02:00")
    install_team(hass, byd_soc=60, venus_soc=98)
    install_byd_rate(hass)
    install_fast(hass)
    flows(hass, grid=11800)
    cfg = team_config(modbus_byd(), team_venus())
    executor, _ = await make_executor(hass, cfg, day_plan(dt_util.now()))
    await executor.async_check()
    for _ in range(4):
        for _ in range(3):
            freezer.tick(timedelta(seconds=5))
            await executor.async_guard()
        await hass.async_block_till_done()
        await executor.async_check()
    team = executor.view["team"]
    assert team["active"] == "byd"
    assert team["batteries"]["byd"]["why"] == "evcc"
    assert team["batteries"]["byd"]["discharge"] == "blocked"
    assert team["help"] is False
    assert "byd" not in executor.data["team"]["empty"]
    assert "byd" not in executor.data["team"]["stuck"]
    assert byd_levers(hass)[2:] == ("0.0", "on")
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    assert hass.states.get(LOCK).state == "on"
    assert kinds(executor).count("team_evcc") == 1
    assert "team_handover" not in kinds(executor)
    # Surplus meanwhile: the active one may still charge.
    flows(hass, grid=-2000)
    for _ in range(3):
        freezer.tick(timedelta(minutes=1))
        await executor.async_check()
    assert executor.view["team"]["batteries"]["byd"]["charge"] == "free"
    # The car is full, evcc lets go: the BYD free again, as usual.
    hass.states.async_set(CHARGING, "off")
    hass.states.async_set(POWER, "0.0", {"unit_of_measurement": "kW"})
    evcc_lets_go(hass)
    flows(hass, grid=800)
    freezer.tick(timedelta(minutes=1))
    await executor.async_check()
    team = executor.view["team"]
    assert team["batteries"]["byd"]["why"] == "active"
    assert byd_levers(hass)[2:] == ("100.0", "off")
    assert "evcc" not in executor.data["team"]["blocks"].get("byd", {})
    assert kinds(executor).count("team_evcc_end") == 1
    assert kinds(executor).count("team_evcc") == 1
    assert "team_reset" not in kinds(executor)
