"""Several batteries on one grid meter, one after the other ("Nacheinander"):
who works when, the hand-over with hysteresis, the learned cutoff, charging
side by side, the blocks and every way they are given back."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any
from unittest.mock import AsyncMock

import pytest

from custom_components.energy_joe import model
from custom_components.energy_joe.control import team
from custom_components.energy_joe.control.adapters import make_adapter
from custom_components.energy_joe.control.writes import Write
from custom_components.energy_joe.plan import surplus
from homeassistant.const import EVENT_HOMEASSISTANT_STOP
from homeassistant.core import Event, HomeAssistant, ServiceCall
from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util

from .test_control import (
    FRONIUS,
    VENUS,
    fronius_battery,
    install_devices,
    make_executor,
    venus_battery,
)
from .test_surplus import at, day_plan, hours, install_evcc

SYSTEM = {
    "system_charge_limit": "number.omni_max_charge",
    "system_charge_limit_enabled": "switch.omni_power_limits",
    "system_discharge_limit": "number.omni_max_discharge",
}


@pytest.fixture(autouse=True)
def berlin(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


def member(key: str, soc: float, cutoff: float | None = None, **extra: Any):
    return team.Member(
        id=key,
        soc=soc,
        cutoff=cutoff,
        floor=extra.pop("floor", 5.0),
        capacity=extra.pop("capacity", 10.0),
        max_kw=extra.pop("max_kw", 5.0),
        **extra,
    )


# --- the decisions -------------------------------------------------------------------


def test_discharging_hands_over_at_the_cutoff_and_comes_back_with_hysteresis() -> None:
    byd, venus = member("byd", 30, cutoff=10.5), member("venus", 60, cutoff=12)
    order = [byd, venus]
    assert team.choose(order, order, None, "deficit", False) == ("byd", "start")
    # 12.1 % is above 10.5 + 1.5: the BYD keeps working.
    byd.soc = 12.1
    byd.empty, byd.full = team.mark(byd, None, None)
    assert not byd.empty
    assert team.choose(order, order, "byd", "deficit", False) == ("byd", "keep")
    byd.soc = 12.0
    byd.empty, byd.full = team.mark(byd, None, None)
    assert byd.empty
    assert team.choose(order, order, "byd", "deficit", False) == ("venus", "empty")
    # Charged a little (14 %): still empty for the hand-over, no back and forth.
    byd.soc = 14.0
    byd.empty, _ = team.mark(byd, None, None)
    assert byd.empty
    assert team.choose(order, order, "venus", "deficit", True) == ("venus", "keep")
    # 5 % above the cutoff: usable again, the order counts once the flow lasted.
    byd.soc = 15.5
    byd.empty, _ = team.mark(byd, None, None)
    assert not byd.empty
    assert team.choose(order, order, "venus", "deficit", False) == ("venus", "keep")
    assert team.choose(order, order, "venus", "deficit", True) == ("byd", "order")


def test_charging_hands_over_when_full_and_by_its_own_order() -> None:
    byd, venus = member("byd", 98.6), member("venus", 40)
    charge = [byd, venus]
    discharge = [venus, byd]
    assert team.choose(charge, discharge, "byd", "surplus", False) == ("byd", "keep")
    byd.empty, byd.full = team.mark(byd, None, None)
    assert byd.full
    assert team.choose(charge, discharge, "byd", "surplus", False) == ("venus", "full")
    # Full stays full until it dropped below 97 %.
    byd.soc = 97.5
    _, byd.full = team.mark(byd, None, 99.0)
    assert byd.full
    # A battery that stopped at its own limit (95 %) is not "not full" at 96 %.
    venus.soc, venus.full = 95.0, True
    _, still = team.mark(venus, None, 95.0)
    assert still
    venus.soc = 92.9
    _, still = team.mark(venus, None, 95.0)
    assert not still
    # The discharge order is its own: the Venus discharges first.
    assert team.choose(charge, discharge, "venus", "deficit", True) == (
        "venus",
        "keep",
    )


def test_the_order_puts_named_ones_first() -> None:
    a, b, c = member("a", 50), member("b", 50), member("c", 50)
    assert [m.id for m in team.ordered([a, b, c], ["c"])] == ["c", "a", "b"]
    assert [m.id for m in team.ordered([a, b, c], [])] == ["a", "b", "c"]


def test_the_cutoff_is_learned_where_discharging_stops() -> None:
    now = datetime(2026, 10, 10, 20, 0, tzinfo=dt_util.get_time_zone("Europe/Berlin"))
    watch: dict[str, Any] = {}
    assert team.watch_cutoff(watch, 14.0, -900, 900, True, now) is None
    later = now + timedelta(minutes=10)
    assert team.watch_cutoff(watch, 10.5, 0, 800, True, later) is None
    assert team.watch_cutoff(watch, 10.5, 10, 800, True, later + team.SPAN) == 10.5
    # Blocked by Joe, no demand, too high or nothing discharged before: nothing.
    assert team.watch_cutoff({}, 10.5, 0, 800, True, later) is None
    watch = {"discharged": later.isoformat()}
    assert team.watch_cutoff(watch, 10.5, 0, 800, False, later) is None
    assert team.watch_cutoff(watch, 10.5, 0, 50, True, later) is None
    assert team.watch_cutoff(watch, 45.0, 0, 800, True, later) is None
    assert team.learned([10.5, 10.7, 10.4, 30.0, 10.6, 10.5]) == 10.6
    assert team.learned([]) is None


def test_side_by_side_when_one_after_the_other_would_not_finish() -> None:
    day = "2026-06-20"
    now = at(day, 9)
    found = surplus.slots(hours(day, 5.0), None, now, 0.8)
    end = surplus.pv_end(found, now)
    byd = member("byd", 40, capacity=10.24, max_kw=5.0)
    venus = member("venus", 40, capacity=5.12, max_kw=2.5)
    assert team.sequential_fills(found, [byd, venus], end)
    # A weak day: one after the other the Venus would start too late.
    weak = surplus.slots(hours(day, 2.6), None, now, 0.8)
    end = surplus.pv_end(weak, now)
    assert not team.sequential_fills(weak, [byd, venus], end)
    # Already full: nothing to do.
    full = member("byd", 100, capacity=10.24)
    assert team.sequential_fills(weak, [full], end)


def test_opposite_directions_are_found() -> None:
    assert team.opposite({"byd": 600, "venus": -500}) == (["byd"], ["venus"])
    assert team.opposite({"byd": 600, "venus": 100}) == ([], [])
    assert team.opposite({"byd": -600, "venus": -500}) == ([], [])


# --- the levers ----------------------------------------------------------------------


def team_byd(**extra: Any) -> dict[str, Any]:
    battery = fronius_battery()
    battery["controls"] = {
        **FRONIUS,
        "charge_limit": "number.charge_limit",
        "charge_limit_enabled": "switch.charge_limit",
    }
    return {**battery, **extra}


def team_venus(**extra: Any) -> dict[str, Any]:
    battery = venus_battery()
    battery["controls"] = {**VENUS, **SYSTEM}
    battery["prepare"] = [{"entity_id": "switch.venus_manual_mode", "value": True}]
    return {**battery, **extra}


def install_team(
    hass: HomeAssistant, byd_soc: float = 50, venus_soc: float = 50
) -> list[tuple[str, str]]:
    """Both batteries with their day levers; every service call is recorded."""
    install_devices(hass, byd_soc=byd_soc, venus_soc=venus_soc)
    percent = {"min": 0, "max": 100, "step": 1, "unit_of_measurement": "%"}
    watts = {"min": 0, "max": 2500, "step": 50, "unit_of_measurement": "W"}
    hass.states.async_set("number.charge_limit", "100", percent)
    hass.states.async_set("switch.charge_limit", "off")
    hass.states.async_set("switch.venus_manual_mode", "off")
    hass.states.async_set("number.omni_max_charge", "2500", watts)
    hass.states.async_set("number.omni_max_discharge", "2500", watts)
    hass.states.async_set("switch.omni_power_limits", "off")
    hass.states.async_set("sensor.grid", "0", {"unit_of_measurement": "W"})
    calls: list[tuple[str, str]] = []

    def keep(call: ServiceCall, value: str) -> None:
        entity_id = call.data["entity_id"]
        if isinstance(entity_id, list):
            entity_id = entity_id[0]
        calls.append((entity_id, value))
        state = hass.states.get(entity_id)
        hass.states.async_set(entity_id, value, state.attributes if state else {})

    hass.services.async_register(
        "number", "set_value", lambda call: keep(call, str(float(call.data["value"])))
    )
    hass.services.async_register(
        "select", "select_option", lambda call: keep(call, call.data["option"])
    )
    hass.services.async_register("switch", "turn_on", lambda call: keep(call, "on"))
    hass.services.async_register("switch", "turn_off", lambda call: keep(call, "off"))
    return calls


def flows(
    hass: HomeAssistant, grid: float = 0, byd: float = 0, venus: float = 0
) -> None:
    """The meters (W): the grid (import positive), the batteries (charging positive)."""
    for entity_id, value in (
        ("sensor.grid", grid),
        ("sensor.byd_power", byd),
        ("sensor.venus_power", venus),
    ):
        hass.states.async_set(entity_id, str(value), {"unit_of_measurement": "W"})


def levels(hass: HomeAssistant, byd: float | None = None, venus: float | None = None):
    percent = {"unit_of_measurement": "%"}
    if byd is not None:
        hass.states.async_set("sensor.byd_soc", str(byd), percent)
    if venus is not None:
        hass.states.async_set("sensor.venus_soc", str(venus), percent)


def team_config(*batteries: dict[str, Any], **rules: Any) -> dict[str, Any]:
    return model.validate(
        {
            "version": model.CONFIG_VERSION,
            "batteries": list(batteries) or [team_byd(), team_venus()],
            "measurements": {"grid_power": {"entity_id": "sensor.grid"}},
            "rules": {"battery_team": "sequence", "grid_friendly": False, **rules},
        }
    )


def state_of(hass: HomeAssistant, *entity_ids: str) -> tuple[str, ...]:
    """The states, numbers written alike ("2500" and "2500.0")."""

    def plain(value: str) -> str:
        try:
            return str(float(value))
        except ValueError:
            return value

    return tuple(plain(hass.states.get(e).state) for e in entity_ids)


def venus_levers(hass: HomeAssistant) -> tuple[str, ...]:
    return state_of(
        hass,
        "number.omni_max_charge",
        "number.omni_max_discharge",
        "switch.omni_power_limits",
    )


def byd_levers(hass: HomeAssistant) -> tuple[str, ...]:
    return state_of(
        hass,
        "number.charge_limit",
        "switch.charge_limit",
        "number.discharge_limit",
        "switch.discharge_limit",
    )


def never_opposite(view: dict[str, Any]) -> None:
    """No battery may be free to charge while another one is free to discharge."""
    batteries = view["batteries"]
    charge = {k for k, b in batteries.items() if b["charge"] == "free"}
    discharge = {k for k, b in batteries.items() if b["discharge"] == "free"}
    assert not any(a != b for a in charge for b in discharge), batteries


def test_the_day_levers_of_both(hass: HomeAssistant) -> None:
    install_team(hass)
    byd, venus = make_adapter(team_byd()), make_adapter(team_venus())
    assert byd.discharge_roles() == ("discharge_limit_enabled", "discharge_limit")
    assert venus.discharge_roles() == (
        "system_charge_limit_enabled",
        "system_discharge_limit",
    )
    assert venus.team_shared() and not byd.team_shared()
    assert byd.team_problem(hass) is None and venus.team_problem(hass) is None
    # Fronius: the limit at 0 first, then its switch on (the limit alone is ignored).
    writes, back = byd.team_block(hass, True, True, False)
    assert writes == [
        Write("number.charge_limit", 0),
        Write("switch.charge_limit", True),
        Write("number.discharge_limit", 0),
        Write("switch.discharge_limit", True),
    ]
    assert back == []
    # Giving back: the switch off first, then the value.
    saved = {
        "number.discharge_limit": 100.0,
        "switch.discharge_limit": False,
    }
    assert byd.team_free(saved, ["discharge_limit_enabled", "discharge_limit"]) == [
        Write("switch.discharge_limit", False),
        Write("number.discharge_limit", 100.0),
    ]
    # The system's one switch: both values first, the free one opened wide.
    writes, back = venus.team_block(hass, False, True, False)
    assert [(w.entity_id, w.value) for w in writes] == [
        ("number.omni_max_charge", 2500),
        ("number.omni_max_discharge", 0),
        ("switch.omni_power_limits", True),
    ]
    _, back = venus.team_block(hass, False, False, False)
    assert back == [
        "system_charge_limit_enabled",
        "system_charge_limit",
        "system_discharge_limit",
    ]
    # Never manual mode for this.
    assert not any(
        w.entity_id in ("switch.venus_manual_mode", "select.force_mode")
        for w in venus.team_block(hass, True, True, False)[0]
    )
    hass.states.async_set("number.omni_max_discharge", "unavailable")
    assert venus.team_problem(hass) == "unavailable"
    plain = make_adapter({**team_venus(), "controls": VENUS})
    assert plain.team_problem(hass) == "no_charge_lever"


# --- the executor ----------------------------------------------------------------------


async def test_one_works_the_other_is_blocked_ahead_of_time(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-10T19:00:00+02:00")
    calls = install_team(hass, byd_soc=40, venus_soc=60)
    flows(hass, grid=0, byd=-800)
    executor, _ = await make_executor(hass, team_config(), day_plan(dt_util.now()))
    await executor.async_check()
    view = executor.view["team"]
    assert view["state"] == "on"
    assert view["active"] == "byd"
    assert view["batteries"]["venus"]["why"] == "waits_empty"
    never_opposite(view)
    # The Venus is blocked both ways in automatic mode: values first, then the switch.
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    assert calls == [
        ("number.omni_max_charge", "0.0"),
        ("number.omni_max_discharge", "0.0"),
        ("switch.omni_power_limits", "on"),
    ]
    assert byd_levers(hass) == ("100.0", "off", "100.0", "off")
    assert executor.data["saved"] == {
        "number.omni_max_charge": 2500.0,
        "number.omni_max_discharge": 2500.0,
        "switch.omni_power_limits": False,
    }
    # The next minute changes nothing.
    calls.clear()
    await executor.async_check()
    assert calls == []


async def test_the_hand_over_both_ways(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-10-10T19:00:00+02:00")
    calls = install_team(hass, byd_soc=20, venus_soc=60)
    flows(hass, grid=0, byd=-800)
    config = team_config(team_byd(cutoff_soc=10.5), team_venus())
    executor, _ = await make_executor(hass, config, day_plan(dt_util.now()))
    await executor.async_check()
    assert executor.view["team"]["active"] == "byd"
    # The BYD reaches its learned cutoff + 1.5 %: blocked first, the Venus freed.
    levels(hass, byd=12)
    calls.clear()
    await executor.async_check()
    view = executor.view["team"]
    assert view["active"] == "venus"
    never_opposite(view)
    assert byd_levers(hass) == ("0.0", "on", "0.0", "on")
    assert venus_levers(hass) == ("2500.0", "2500.0", "off")
    assert calls == [
        ("number.charge_limit", "0.0"),
        ("switch.charge_limit", "on"),
        ("number.discharge_limit", "0.0"),
        ("switch.discharge_limit", "on"),
        ("switch.omni_power_limits", "off"),
        ("number.omni_max_charge", "2500.0"),
        ("number.omni_max_discharge", "2500.0"),
    ]
    handover = [e for e in executor.data["log"] if e["kind"] == "team_handover"]
    assert handover[-1]["battery"] == "venus" and handover[-1]["reason"] == "empty"
    # The sun comes: the BYD charges at 14 %, but it is the Venus' turn until
    # the surplus lasted (no back and forth with every cloud).
    flows(hass, grid=-500, venus=1000)
    levels(hass, byd=14)
    for _ in range(3):
        freezer.tick(timedelta(minutes=3))
        await executor.async_check()
        assert executor.view["team"]["active"] == "venus"
    freezer.tick(timedelta(minutes=7))
    await executor.async_check()
    view = executor.view["team"]
    assert view["active"] == "byd"
    never_opposite(view)
    # The BYD charged to full: the Venus takes the rest of the sun.
    levels(hass, byd=99)
    await executor.async_check()
    assert executor.view["team"]["active"] == "venus"
    assert executor.view["team"]["batteries"]["byd"]["why"] == "full"
    assert byd_levers(hass) == ("0.0", "on", "0.0", "on")
    # Evening: the house needs power; the BYD (first to discharge) takes over
    # once the need lasted.
    flows(hass, grid=0, venus=-600)
    for _ in range(3):
        freezer.tick(timedelta(minutes=3))
        await executor.async_check()
        assert executor.view["team"]["active"] == "venus"
    freezer.tick(timedelta(minutes=7))
    before = len(calls)
    await executor.async_check()
    assert executor.view["team"]["active"] == "byd"
    # The BYD freed: the switches off first, then the limits back.
    freed = [c for c in calls[before:] if "omni" not in c[0]]
    assert freed == [
        ("switch.charge_limit", "off"),
        ("switch.discharge_limit", "off"),
        ("number.charge_limit", "100.0"),
        ("number.discharge_limit", "100.0"),
    ]
    # Omnibattery stays in automatic mode throughout.
    assert not any(
        e in ("switch.venus_manual_mode", "select.force_mode") for e, _ in calls
    )


async def test_the_cutoff_is_learned_and_hands_over(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-10T19:00:00+02:00")
    install_team(hass, byd_soc=11, venus_soc=60)
    flows(hass, grid=0, byd=-900)
    executor, _ = await make_executor(hass, team_config(), day_plan(dt_util.now()))
    learned: list[tuple[str, float]] = []
    executor.on_cutoff = lambda key, soc: learned.append((key, soc))
    await executor.async_check()
    assert executor.view["team"]["active"] == "byd"
    # The BYD stops at 10.5 % although its reserve says 5 %: the house draws
    # from the grid.
    levels(hass, byd=10.5)
    flows(hass, grid=700, byd=0)
    freezer.tick(timedelta(minutes=1))
    await executor.async_check()
    assert executor.view["team"]["active"] == "byd"
    freezer.tick(timedelta(minutes=5))
    await executor.async_check()
    assert learned == [("byd", 10.5)]
    view = executor.view["team"]
    assert view["active"] == "venus"
    assert executor.data["team"]["cutoffs"]["byd"] == [10.5]
    kinds = [e["kind"] for e in executor.data["log"]]
    assert "team_cutoff" in kinds and "team_handover" in kinds


async def test_side_by_side_on_a_weak_day(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-06-20T09:00:00+02:00")
    install_team(hass, byd_soc=20, venus_soc=20)
    flows(hass, grid=-800, byd=1200)
    plan = day_plan(dt_util.now(), peak=2.6)
    executor, _ = await make_executor(hass, team_config(), plan)
    await executor.async_check()
    view = executor.view["team"]
    assert view["parallel"] is True
    assert view["active"] == "byd"
    assert view["batteries"]["venus"]["why"] == "parallel"
    never_opposite(view)
    # The Venus may charge (its own control), never discharge; the BYD neither.
    assert venus_levers(hass) == ("2500.0", "0.0", "on")
    assert byd_levers(hass)[2:] == ("0.0", "on")
    assert any(e["kind"] == "team_parallel" for e in executor.data["log"])
    # A cloud: the Venus is blocked again at once, the BYD is free.
    flows(hass, grid=400, byd=0)
    await executor.async_check()
    view = executor.view["team"]
    never_opposite(view)
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    assert byd_levers(hass) == ("100.0", "off", "100.0", "off")


async def test_every_exit_gives_the_blocks_back(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-10-10T19:00:00+02:00")
    calls = install_team(hass, byd_soc=40, venus_soc=60)
    flows(hass, grid=0, byd=-800)
    executor, holder = await make_executor(hass, team_config(), day_plan(dt_util.now()))

    async def blocked() -> None:
        await executor.async_check()
        assert venus_levers(hass) == ("0.0", "0.0", "on")

    def back() -> None:
        assert venus_levers(hass) == ("2500.0", "2500.0", "off")
        assert executor.data["saved"] == {}
        assert executor.data["team"]["blocks"] == {}

    # A mode change: switch off first, then the values.
    await blocked()
    calls.clear()
    holder["mode"] = "simulation"
    await executor.async_check()
    back()
    assert calls[0] == ("switch.omni_power_limits", "off")
    assert executor.view["team"]["dry"] is True
    # "Gleichzeitig" chosen.
    holder["mode"] = "live"
    await blocked()
    holder["config"] = team_config(battery_team="together")
    await executor.async_check()
    back()
    assert executor.view["team"]["state"] == "together"
    # "Sofort freigeben": back and paused for the day.
    holder["config"] = team_config()
    await blocked()
    await executor.async_release_now()
    back()
    await executor.async_check()
    back()
    assert executor.view["team"]["state"] == "paused"
    freezer.move_to("2026-10-11T19:00:00+02:00")
    holder["plan"] = day_plan(dt_util.now())
    # Home Assistant stops.
    await blocked()
    await executor._on_stop(Event(EVENT_HOMEASSISTANT_STOP))
    back()
    # A lever gone: Joe cannot block the Venus, so he blocks nobody.
    await blocked()
    hass.states.async_set("number.omni_max_discharge", "unavailable")
    await executor.async_check()
    assert executor.view["team"]["state"] == "levers"
    assert executor.view["team"]["batteries"]["venus"]["problem"] == "unavailable"
    # Back with the value the device kept: blocked again.
    hass.states.async_set(
        "number.omni_max_discharge",
        "0.0",
        {"min": 0, "max": 2500, "step": 50, "unit_of_measurement": "W"},
    )
    await executor.async_check()
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    # The Venus left out (no longer regulating itself): its blocks go back.
    await blocked()
    holder["config"] = team_config(team_byd(), team_venus(self_regulating=False))
    await executor.async_check()
    back()
    assert executor.view["team"]["state"] == "single"
    # The Venus removed altogether.
    holder["config"] = team_config()
    await blocked()
    holder["config"] = team_config(team_byd())
    await executor.async_check()
    # (The release tries again a while after the lever that was gone.)
    freezer.tick(timedelta(minutes=6))
    await executor.async_check()
    back()


async def test_blocks_survive_a_crash_and_go_back_after_it(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-10T19:00:00+02:00")
    install_team(hass, byd_soc=40, venus_soc=60)
    flows(hass, grid=0, byd=-800)
    executor, _ = await make_executor(hass, team_config(), day_plan(dt_util.now()))
    await executor.async_check()
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    # A crash: a new executor finds the originals and the blocks on disk.
    again, holder = await make_executor(
        hass, team_config(battery_team="together"), day_plan(dt_util.now())
    )
    assert again.data["team"]["blocks"] == {
        "venus": {"charge": True, "discharge": True}
    }
    await again.async_check()
    assert venus_levers(hass) == ("2500.0", "2500.0", "off")
    assert again.data["saved"] == {}


async def test_automations_that_do_it_so_far_keep_joes_hands_off(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-10T19:00:00+02:00")
    calls = install_team(hass, byd_soc=40, venus_soc=60)
    flows(hass, grid=0, byd=-800)
    assert await async_setup_component(
        hass,
        "automation",
        {
            "automation": [
                {
                    "id": "r2",
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
                },
                {
                    "id": "watch",
                    "alias": "Wächter",
                    "triggers": [{"trigger": "state", "entity_id": "sensor.byd_power"}],
                    "conditions": [
                        {
                            "condition": "numeric_state",
                            "entity_id": "sensor.venus_power",
                            "above": 150,
                        }
                    ],
                    "actions": [
                        {
                            "action": "persistent_notification.create",
                            "data": {"message": "Gegeneinander!"},
                        }
                    ],
                },
            ]
        },
    )
    await hass.async_block_till_done()
    executor, _ = await make_executor(hass, team_config(), day_plan(dt_util.now()))
    await executor.async_check()
    view = executor.view["team"]
    assert view["state"] == "automation"
    # The watcher only tells: no conflict.
    assert view["automations"] == ["Interlock R2"]
    assert calls == []
    assert executor.data["saved"] == {}
    # Switched off: Joe takes over.
    await hass.services.async_call(
        "automation", "turn_off", {"entity_id": "automation.interlock_r2"}, True
    )
    await executor.async_check()
    assert executor.view["team"]["state"] == "on"
    assert venus_levers(hass) == ("0.0", "0.0", "on")


async def test_the_night_plan_goes_first(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-10-10T01:00:00+02:00")
    install_team(hass, byd_soc=40, venus_soc=60)
    flows(hass, grid=0, byd=-800)
    executor, holder = await make_executor(hass, team_config(), day_plan(dt_util.now()))
    await executor.async_check()
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    # The night's plan steers now: the blocks go back before it does.
    start = dt_util.start_of_local_day(dt_util.now())
    holder["plan"] = {
        "kind": "hold",
        "fixed": True,
        "target": 40,
        "window": {
            "start": start.isoformat(),
            "end": (start + timedelta(hours=5)).isoformat(),
        },
        "rules": {"discharge_mode": "until_target"},
        "batteries": [{"id": "byd", "target": 40, "power_kw": 0}],
        "hours": [],
    }
    await executor.async_check()
    assert executor.status["reason"] == "steering"
    assert executor.view["team"]["state"] == "night"
    assert venus_levers(hass) == ("2500.0", "2500.0", "off")
    ends = [e for e in executor.data["log"] if e["kind"] == "team_end"]
    assert ends[-1]["reason"] == "night"
    # The night holds the BYD with its reserve (its own lever), nothing else.
    assert hass.states.get("number.reserve").state == "40.0"
    assert "number.omni_max_charge" not in executor.data["saved"]


async def test_running_against_each_other_is_told(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-10-10T19:00:00+02:00")
    install_team(hass, byd_soc=40, venus_soc=60)
    flows(hass, grid=0, byd=-800)
    executor, _ = await make_executor(hass, team_config(), day_plan(dt_util.now()))
    executor.notifier = AsyncMock()
    await executor.async_check()
    # Despite the blocks (something else writes them): the Venus charges.
    flows(hass, grid=0, byd=-600, venus=500)
    await executor.async_check()
    freezer.tick(timedelta(minutes=2))
    await executor.async_check()
    transfer = executor.view["team"]["transfer"]
    assert transfer["despite"] is True
    assert transfer["charging"] == ["Venus"] and transfer["discharging"] == ["BYD"]
    executor.notifier.async_problem.assert_awaited_once()
    assert executor.notifier.async_problem.await_args.args[0] == "battery_transfer"
    assert [e["kind"] for e in executor.data["log"]].count("team_transfer") == 1
    # Once a day, once per time.
    freezer.tick(timedelta(minutes=2))
    await executor.async_check()
    assert executor.notifier.async_problem.await_count == 1


async def test_joe_proposes_from_the_profile(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-10-10T19:00:00+02:00")
    install_team(hass)
    flows(hass, grid=300)
    executor, _ = await make_executor(
        hass, team_config(battery_team=None), day_plan(dt_util.now())
    )
    await executor.async_check()
    view = executor.view["team"]
    assert view["state"] == "unset"
    assert view["proposal"] is True
    assert view["batteries"]["byd"]["proposed"] is True
    assert view["batteries"]["venus"]["proposed"] is True
    # Omnibattery in manual mode does not regulate itself.
    hass.states.async_set("switch.venus_manual_mode", "on")
    await executor.async_check()
    assert executor.view["team"]["batteries"]["venus"]["proposed"] is False
    assert executor.view["team"]["proposal"] is False
    assert executor.data["saved"] == {}


async def test_the_daytime_cap_goes_to_the_one_whose_turn_it_is(
    hass: HomeAssistant, freezer
) -> None:
    """The waiting Venus' room counts for the BYD, which takes the whole cap."""
    freezer.move_to("2026-06-20T09:00:00+02:00")
    install_team(hass, byd_soc=40, venus_soc=40)
    install_evcc(hass)
    flows(hass, grid=-2000, byd=500)
    config = team_config(team_byd(limit_ref_w=5000), team_venus(), day_surplus=True)
    executor, _ = await make_executor(hass, config, day_plan(dt_util.now()))
    await executor.async_check()
    team_view = executor.view["team"]
    assert team_view["active"] == "byd"
    assert team_view["parallel"] is False
    never_opposite(team_view)
    view = executor.view["surplus"]
    assert view["state"] == "cap"
    assert view["batteries"]["venus"]["state"] == "team_wait"
    assert view["batteries"]["byd"]["state"] == "capped"
    # One cap for the room of both (more than the BYD's own room would need).
    alone = surplus.day_cap(
        surplus.slots(day_plan(dt_util.now())["hours"], None, dt_util.now(), 0.8),
        [surplus.Store("byd", 10.0, 40, 5.0)],
        dt_util.now(),
    )
    assert view["cap_kw"] > alone["cap_kw"]
    # The BYD's charge limit carries the cap, the Venus is blocked.
    assert hass.states.get("switch.charge_limit").state == "on"
    assert venus_levers(hass) == ("0.0", "0.0", "on")
