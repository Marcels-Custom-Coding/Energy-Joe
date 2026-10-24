"""Several batteries on one grid meter, one after the other ("Nacheinander"):
who works when, the hand-over with hysteresis, the learned cutoff, charging
side by side, the blocks and every way they are given back."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any
from unittest.mock import AsyncMock

import pytest

from custom_components.energy_joe import model
from custom_components.energy_joe.control import executor as executor_module, team
from custom_components.energy_joe.control.adapters import make_adapter
from custom_components.energy_joe.control.executor import TEAM_GRACE
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


def test_discharging_hands_over_only_when_the_meter_says_so() -> None:
    byd, venus = member("byd", 30, cutoff=10.5), member("venus", 60, cutoff=12)
    order = [byd, venus]
    assert team.choose(order, order, None, "deficit") == ("byd", "start")
    # 11 %: just above where it stops by itself – still the BYD's turn,
    # nobody stops it early.
    byd.soc = 11.0
    byd.empty, byd.full = team.mark(byd, None, None)
    assert not byd.empty
    assert team.choose(order, order, "byd", "deficit") == ("byd", "keep")
    # Marked empty by the meter (it gave nothing while the house drew from
    # the grid, see quick): the Venus.
    byd.empty = True
    assert team.choose(order, order, "byd", "deficit") == ("venus", "empty")
    # Charged a little (14 %): still empty, no back and forth.
    byd.soc = 14.0
    byd.empty, _ = team.mark(byd, 11.0, None)
    assert byd.empty
    assert team.choose(order, order, "venus", "deficit") == ("venus", "keep")
    # 5 % above where it stopped: usable again. Nobody hands over by the
    # order alone: the Venus keeps going until she is empty.
    byd.soc = 16.0
    byd.empty, _ = team.mark(byd, 11.0, None)
    assert not byd.empty
    assert team.choose(order, order, "venus", "deficit") == ("venus", "keep")
    venus.empty = True
    assert team.choose(order, order, "venus", "deficit") == ("byd", "empty")
    # At the owner's floor it counts as empty without the meter.
    byd.soc = byd.floor
    byd.empty, _ = team.mark(byd, None, None)
    assert byd.empty


def test_nobody_hands_over_to_one_with_nothing_worth_giving_or_taking() -> None:
    byd = member("byd", 99.5, cutoff=11)
    venus = member("venus", 98, cutoff=12, capacity=5.12)
    byd.empty, byd.full = team.mark(byd, None, None)
    assert byd.full
    # Both full in surplus: the Venus with 0.1 kWh of room is not worth it,
    # the BYD stays and the surplus goes to the grid.
    assert team.choose([byd, venus], [byd, venus], "byd", "surplus") == ("byd", "keep")
    venus.soc = 90
    assert team.choose([byd, venus], [byd, venus], "byd", "surplus") == (
        "venus",
        "full",
    )
    # In deficit the Venus with 0.03 kWh above her stop is not worth it either.
    venus.soc, venus.full = 12.5, False
    byd.empty = True
    assert team.choose([byd, venus], [byd, venus], "byd", "deficit") == ("byd", "keep")
    venus.soc = 30
    assert team.choose([byd, venus], [byd, venus], "byd", "deficit") == (
        "venus",
        "empty",
    )


def test_charging_hands_over_when_full_and_by_its_own_order() -> None:
    byd, venus = member("byd", 98.6), member("venus", 40)
    charge = [byd, venus]
    discharge = [venus, byd]
    assert team.choose(charge, discharge, "byd", "surplus") == ("byd", "keep")
    byd.empty, byd.full = team.mark(byd, None, None)
    assert byd.full
    assert team.choose(charge, discharge, "byd", "surplus") == ("venus", "full")
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
    assert team.choose(charge, discharge, "venus", "deficit") == ("venus", "keep")


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
    # 12 %: still the BYD's turn, nobody stops it early.
    levels(hass, byd=12)
    freezer.tick(timedelta(minutes=1))
    await executor.async_check()
    assert executor.view["team"]["active"] == "byd"
    # It stops by itself at 10.5 %, the house draws from the grid. Not at once …
    levels(hass, byd=10.5)
    flows(hass, grid=700, byd=0)
    await executor.async_check()
    freezer.tick(timedelta(seconds=10))
    await executor.async_check()
    assert executor.view["team"]["active"] == "byd"
    # … but after 20 seconds of that: blocked first, the Venus freed.
    calls.clear()
    freezer.tick(timedelta(seconds=10))
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
    kinds = [e["kind"] for e in executor.data["log"]]
    assert "team_empty" in kinds and "team_stuck" not in kinds
    handover = [e for e in executor.data["log"] if e["kind"] == "team_handover"]
    assert handover[-1]["battery"] == "venus" and handover[-1]["reason"] == "empty"
    # The sun comes: the Venus charges. The BYD stays blocked – nobody hands
    # over by the order alone, no back and forth with every cloud.
    flows(hass, grid=-500, venus=1000)
    for _ in range(4):
        freezer.tick(timedelta(minutes=3))
        await executor.async_check()
        assert executor.view["team"]["active"] == "venus"
    # The Venus is full: the BYD takes the rest of the sun (it has room).
    levels(hass, venus=99.6)
    flows(hass, grid=-500, venus=0)
    before = len(calls)
    await executor.async_check()
    view = executor.view["team"]
    assert view["active"] == "byd"
    assert view["batteries"]["venus"]["why"] == "full"
    never_opposite(view)
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    # The BYD freed: the switches off first, then the limits back.
    freed = [c for c in calls[before:] if "omni" not in c[0]]
    assert freed == [
        ("switch.charge_limit", "off"),
        ("switch.discharge_limit", "off"),
        ("number.charge_limit", "100.0"),
        ("number.discharge_limit", "100.0"),
    ]
    # Evening: the BYD, charged to 40 %, gives; the Venus waits until the
    # BYD is empty, however long the need lasts.
    levels(hass, byd=40)
    flows(hass, grid=0, byd=-600)
    for _ in range(4):
        freezer.tick(timedelta(minutes=3))
        await executor.async_check()
        assert executor.view["team"]["active"] == "byd"
    # Omnibattery stays in automatic mode throughout.
    assert not any(
        e in ("switch.venus_manual_mode", "select.force_mode") for e, _ in calls
    )


async def test_the_meter_is_looked_at_every_few_seconds(
    hass: HomeAssistant, freezer
) -> None:
    """The watchdog's tick advances the meter's timers: the handover comes
    after 20 seconds of nothing, not at the next minute's check."""
    freezer.move_to("2026-10-10T19:00:00+02:00")
    install_team(hass, byd_soc=20, venus_soc=60)
    flows(hass, grid=0, byd=-800)
    config = team_config(team_byd(cutoff_soc=10.5), team_venus())
    executor, _ = await make_executor(hass, config, day_plan(dt_util.now()))
    await executor.async_check()
    assert executor.view["team"]["active"] == "byd"
    levels(hass, byd=10.5)
    flows(hass, grid=700, byd=0)
    for _ in range(3):
        freezer.tick(timedelta(seconds=5))
        await executor.async_guard()
        await hass.async_block_till_done()
        assert executor.view["team"]["active"] == "byd"
    for _ in range(2):
        freezer.tick(timedelta(seconds=5))
        await executor.async_guard()
        await hass.async_block_till_done()
    view = executor.view["team"]
    assert view["active"] == "venus"
    never_opposite(view)
    assert byd_levers(hass) == ("0.0", "on", "0.0", "on")
    assert venus_levers(hass) == ("2500.0", "2500.0", "off")


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


async def test_the_venus_charges_along_with_a_fixed_power_and_leaves_on_a_cloud(
    hass: HomeAssistant, freezer
) -> None:
    """The BYD takes the sun; after five minutes of surplus the Venus charges
    along with a fixed power (her manual mode, the power, the forced mode)
    and the BYD may not discharge meanwhile. A cloud turns the flow: the
    Venus goes back to her own control and waits blocked again."""
    freezer.move_to("2026-06-20T09:00:00+02:00")
    install_team(hass, byd_soc=20, venus_soc=20)
    flows(hass, grid=-800, byd=1200)
    plan = day_plan(dt_util.now(), peak=2.6)
    executor, _ = await make_executor(hass, team_config(), plan)
    await executor.async_check()
    view = executor.view["team"]
    assert view["parallel"] is False and view["along"] is None
    assert view["active"] == "byd"
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    for _ in range(60):
        freezer.tick(timedelta(seconds=5))
        await executor.async_guard()
    await executor.async_check()
    view = executor.view["team"]
    assert view["along"] == "fixed"
    assert view["batteries"]["venus"]["why"] == "along"
    assert view["batteries"]["byd"]["discharge"] == "blocked"
    never_opposite(view)
    # Room: BYD 7.9 kWh, Venus 4.0 kWh – her share of the 2 kW is 0.6 kW.
    assert view["along_w"] == {"venus": 600}
    assert hass.states.get("switch.venus_manual_mode").state == "on"
    assert hass.states.get("number.charge_power").state == "600.0"
    assert hass.states.get("select.force_mode").state == "Charge"
    assert venus_levers(hass) == ("2500.0", "0.0", "on")
    assert byd_levers(hass) == ("100.0", "off", "0.0", "on")
    # A cloud: the BYD covers the house for a while – the flow turns, charging
    # along ends, the Venus goes back to her own control and waits.
    flows(hass, grid=0, byd=-400)
    for _ in range(3):
        for _ in range(12):
            freezer.tick(timedelta(seconds=5))
            await executor.async_guard()
        await executor.async_check()
    view = executor.view["team"]
    assert view["along"] is None
    assert hass.states.get("select.force_mode").state == "None"
    assert hass.states.get("number.charge_power").state == "0.0"
    assert hass.states.get("switch.venus_manual_mode").state == "off"
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    assert byd_levers(hass) == ("100.0", "off", "100.0", "off")
    kinds = [e["kind"] for e in executor.data["log"]]
    assert kinds.count("team_along") == 1 and kinds.count("team_along_end") == 1


async def test_a_pause_far_below_the_top_is_not_full(
    hass: HomeAssistant, freezer
) -> None:
    """The BYD stops charging at 40 % while the house feeds 2 kW into the
    grid (a Fronius restarting after a load step): a pause, not full. It
    keeps its turn and its charging; only near its top taking nothing is
    full and the Venus takes over."""
    freezer.move_to("2026-06-20T12:30:00+02:00")
    install_team(hass, byd_soc=40, venus_soc=50)
    flows(hass, grid=-100, byd=1500)
    plan = day_plan(dt_util.now(), peak=2.6)
    executor, _ = await make_executor(hass, team_config(), plan)
    await executor.async_check()
    assert executor.view["team"]["active"] == "byd"
    flows(hass, grid=-2000, byd=0)
    for _ in range(36):
        freezer.tick(timedelta(seconds=5))
        await executor.async_guard()
    await executor.async_check()
    kinds = [e["kind"] for e in executor.data["log"]]
    assert executor.view["team"]["active"] == "byd"
    assert "team_full" not in kinds and kinds.count("team_pause") == 1
    assert "byd" not in executor.data["team"]["full"]
    assert not (executor.data["team"]["blocks"].get("byd") or {}).get("charge")
    # Near its top taking nothing is full: the Venus takes over.
    levels(hass, byd=96)
    for _ in range(12):
        freezer.tick(timedelta(seconds=5))
        await executor.async_guard()
    await executor.async_check()
    kinds = [e["kind"] for e in executor.data["log"]]
    assert "team_full" in kinds
    assert executor.view["team"]["active"] == "venus"


def test_an_old_full_mark_far_below_the_top_is_dropped() -> None:
    """Older versions marked a battery full at 40 % after a pause: it is
    usable again at once, not only 2 points below the mark."""
    byd = member("byd", 38.9)
    byd.full = True
    _, full = team.mark(byd, None, 40.4)
    assert not full
    # Marked near its top, full keeps its hysteresis.
    byd.soc = 97.0
    _, full = team.mark(byd, None, 98.0)
    assert full


async def test_joes_own_block_says_nothing_about_full(
    hass: HomeAssistant, freezer
) -> None:
    """While Joe holds the active one's charging back himself (and two
    minutes after he changed its levers), taking nothing is not full."""
    freezer.move_to("2026-06-20T12:30:00+02:00")
    install_team(hass, byd_soc=96, venus_soc=50)
    flows(hass, grid=-100, byd=1500)
    plan = day_plan(dt_util.now(), peak=2.6)
    executor, _ = await make_executor(hass, team_config(), plan)
    await executor.async_check()
    store = executor.data["team"]
    store["blocks"]["byd"] = {"charge": True, "discharge": False}
    flows(hass, grid=-2000, byd=0)
    for _ in range(12):
        freezer.tick(timedelta(seconds=5))
        await executor.async_guard()
    assert "team_full" not in [e["kind"] for e in executor.data["log"]]
    store["blocks"].pop("byd")
    store["touched"] = {"byd": dt_util.now().isoformat(timespec="seconds")}
    for _ in range(12):
        freezer.tick(timedelta(seconds=5))
        await executor.async_guard()
    assert "team_full" not in [e["kind"] for e in executor.data["log"]]


async def test_only_one_after_the_other_is_strict_on_a_weak_day_too(
    hass: HomeAssistant, freezer
) -> None:
    """ "Nur nacheinander": no charging side by side, not even on a weak day."""
    freezer.move_to("2026-06-20T09:00:00+02:00")
    install_team(hass, byd_soc=20, venus_soc=20)
    flows(hass, grid=-800, byd=1200)
    plan = day_plan(dt_util.now(), peak=2.6)
    executor, _ = await make_executor(hass, team_config(team_style="strict"), plan)
    await executor.async_check()
    view = executor.view["team"]
    assert view["parallel"] is False
    assert view["active"] == "byd"
    assert view["batteries"]["venus"]["charge"] == "blocked"
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    assert not any(e["kind"] == "team_parallel" for e in executor.data["log"])


async def test_the_morning_buffer_with_two_groups(hass: HomeAssistant, freezer) -> None:
    """The buffer belongs to the group that covers the morning: it works
    (charging comes to it first), the other group waits blocked; at the
    buffer the BYD holds back too and the sun goes to the grid."""
    from .test_control import sunny_morning_plan

    freezer.move_to("2026-10-04T08:00:00+02:00")
    install_team(hass, byd_soc=20, venus_soc=40)
    flows(hass, grid=-1500)
    plan = sunny_morning_plan(dt_util.now())
    plan["day"]["buffer"] = {
        "soc": 30,
        "suggested": 30,
        "source": "learned",
        "batteries": ["byd"],
        "group": "byd",
        "back": 2.0,
    }
    config = team_config(
        grid_friendly=True,
        team_charge_order=["venus", "byd"],
        team_discharge_order=["byd", "venus"],
    )
    executor, _ = await make_executor(hass, config, plan)
    for _ in range(15):
        await executor.async_check()
        freezer.tick(timedelta(minutes=1))
    view = executor.view["team"]
    # The charge order says Venus, the morning says the BYD with its buffer.
    assert view["active"] == "byd"
    assert executor.status["batteries"]["byd"]["action"] == "buffer"
    assert byd_levers(hass)[:2] == ("100.0", "off")
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    never_opposite(view)
    # The buffer is there: the BYD's charging held back by the morning, the
    # Venus still waits; nothing is noted twice.
    levels(hass, byd=30)
    await executor.async_check()
    assert executor.status["batteries"]["byd"]["action"] == "defer"
    assert byd_levers(hass)[:2] == ("0.0", "on")
    assert executor.view["team"]["active"] == "byd"
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    assert executor.data["saved"]["number.charge_limit"] == 100.0
    # Midday: everything back as it was once the turns end.
    freezer.move_to("2026-10-04T12:00:00+02:00")
    await executor.async_check()
    assert byd_levers(hass)[:2] == ("100.0", "off")
    assert executor.data["day_buffer"] is None


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
    # A lever unavailable: for a moment (a Modbus dropout) the blocks stay as
    # they are and nothing new is written ...
    await blocked()
    calls.clear()
    hass.states.async_set("number.omni_max_discharge", "unavailable")
    await executor.async_check()
    assert executor.view["team"]["state"] == "bridging"
    assert executor.view["team"]["batteries"]["venus"]["problem"] == "unavailable"
    assert calls == []
    assert executor.data["team"]["blocks"]["venus"]["charge"] is True
    # ... after the grace Joe cannot block the Venus, so he blocks nobody.
    freezer.tick(TEAM_GRACE)
    await executor.async_check()
    assert executor.view["team"]["state"] == "levers"
    assert executor.data["team"]["blocks"] == {}
    assert ("switch.omni_power_limits", "off") in calls
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


async def test_automations_in_the_way_are_named_but_joe_works_on(
    hass: HomeAssistant, freezer
) -> None:
    """The owner's interlock writes the BYD's limit: Joe says so (the log,
    the panel) and coordinates all the same; the automation is the owner's,
    Joe switches it neither off nor on. One that only tells is no trouble."""
    freezer.move_to("2026-10-10T19:00:00+02:00")
    install_team(hass, byd_soc=40, venus_soc=60)
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
    await hass.async_block_till_done()
    assert executor.view["team"]["state"] == "on"
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    # The watcher only tells: not named.
    assert executor.view["automations"] == ["Interlock R2"]
    assert hass.states.get("automation.interlock_r2").state == "on"
    told = [e for e in executor.data["log"] if e["kind"] == "automations"]
    assert [e["names"] for e in told] == [["Interlock R2"]]
    assert executor.data["automations_told"] == ["automation.interlock_r2"]
    # Said once: the next check adds nothing.
    await executor.async_check()
    assert len([e for e in executor.data["log"] if e["kind"] == "automations"]) == 1
    # The owner switches it off: Joe notes that, too.
    await hass.services.async_call(
        "automation", "turn_off", {"entity_id": "automation.interlock_r2"}, True
    )
    await executor.async_check()
    assert executor.view["automations"] == []
    assert executor.data["log"][-1]["kind"] == "automations_off"
    assert executor.data["automations_told"] == []
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
    # The night lets the BYD wait with its own limits (as by day), nothing else.
    assert hass.states.get("number.charge_limit").state == "0.0"
    assert hass.states.get("switch.charge_limit").state == "on"
    assert hass.states.get("number.discharge_limit").state == "0.0"
    assert float(hass.states.get("number.reserve").state) == 5
    assert "number.omni_max_charge" not in executor.data["saved"]


async def test_joe_proposes_from_the_profile(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-10-10T19:00:00+02:00")
    install_team(hass)
    flows(hass, grid=300)
    executor, _ = await make_executor(
        hass, team_config(battery_team=None), day_plan(dt_util.now())
    )
    await executor.async_check()
    view = executor.view["team"]
    assert view["batteries"]["byd"]["proposed"] is True
    assert view["batteries"]["venus"]["proposed"] is True
    # Omnibattery in manual mode does not regulate itself.
    hass.states.async_set("switch.venus_manual_mode", "on")
    await executor.async_check()
    assert executor.view["team"]["batteries"]["venus"]["proposed"] is False
    assert executor.view["team"]["state"] == "single"


async def test_not_chosen_means_one_after_the_other(
    hass: HomeAssistant, freezer
) -> None:
    """Two systems regulating themselves: Joe coordinates without being asked;
    only "Gleichzeitig" chosen leaves them alone."""
    freezer.move_to("2026-10-10T19:00:00+02:00")
    install_team(hass, byd_soc=40, venus_soc=60)
    flows(hass, grid=0, byd=-800)
    executor, holder = await make_executor(
        hass, team_config(battery_team=None), day_plan(dt_util.now())
    )
    await executor.async_check()
    view = executor.view["team"]
    assert view["state"] == "on"
    assert view["default"] is True
    assert view["mode"] is None
    never_opposite(view)
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    holder["config"] = team_config(battery_team="together")
    await executor.async_check()
    assert executor.view["team"]["state"] == "together"
    assert venus_levers(hass) == ("2500.0", "2500.0", "off")


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


# --- the owner's automations: theirs, Joe never switches them ------------------------


async def interlock(hass: HomeAssistant) -> str:
    """The owner's interlock (writes the BYD's charge limit), switched on."""
    hass.services.async_register("logbook", "log", lambda call: None)
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
                }
            ]
        },
    )
    await hass.async_block_till_done()
    return "automation.interlock_r2"


async def owner_switches_off(hass: HomeAssistant, entity_id: str) -> None:
    """The owner switches an automation off in Home Assistant."""
    await hass.services.async_call(
        "automation", "turn_off", {"entity_id": entity_id}, blocking=True
    )
    await hass.async_block_till_done()


def is_on(hass: HomeAssistant, entity_id: str) -> bool:
    return hass.states.get(entity_id).state == "on"


async def test_a_lever_gone_leaves_the_owners_automation_alone(
    hass: HomeAssistant, freezer
) -> None:
    """Joe cannot block: his blocks go back, nothing else. The owner's
    automation stays off as the owner left it, and once the lever is back
    Joe coordinates again at once."""
    freezer.move_to("2026-10-10T19:00:00+02:00")
    install_team(hass, byd_soc=40, venus_soc=60)
    flows(hass, grid=0, byd=-800)
    r2 = await interlock(hass)
    executor, holder = await make_executor(
        hass, team_config(battery_team=None), day_plan(dt_util.now())
    )
    await owner_switches_off(hass, r2)
    await executor.async_check()
    assert executor.view["team"]["state"] == "on"
    assert not is_on(hass, r2)
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    # A lever gone: Joe cannot block, his blocks go back – once the grace for
    # a moment's dropout is over.
    hass.states.async_set("number.omni_max_discharge", "unavailable")
    await executor.async_check()
    await hass.async_block_till_done()
    assert executor.view["team"]["state"] == "bridging"
    assert not is_on(hass, r2)
    freezer.tick(TEAM_GRACE)
    await executor.async_check()
    await hass.async_block_till_done()
    view = executor.view["team"]
    assert view["state"] == "levers"
    assert not is_on(hass, r2)
    assert "given_back" not in view and "lent" not in view
    assert venus_levers(hass)[0] == "2500.0" and venus_levers(hass)[2] == "off"
    # The lever is back: Joe coordinates again at once (a value he wrote
    # minutes ago and that did not show is written again after RETRY).
    hass.states.async_set(
        "number.omni_max_discharge",
        "2500.0",
        {"min": 0, "max": 2500, "step": 50, "unit_of_measurement": "W"},
    )
    await executor.async_check()
    await hass.async_block_till_done()
    assert executor.view["team"]["state"] == "on"
    freezer.tick(executor_module.RETRY)
    await executor.async_check()
    await hass.async_block_till_done()
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    assert not is_on(hass, r2)
    # Not live any more: back at once, the automation still untouched.
    holder["mode"] = "advisory"
    await executor.async_check()
    await hass.async_block_till_done()
    assert executor.view["team"]["dry"] is True
    assert venus_levers(hass)[2] == "off"
    assert not is_on(hass, r2)
    # "Gleichzeitig": the batteries are the owner's, so is the automation.
    holder["mode"] = "live"
    holder["config"] = team_config(battery_team="together")
    await executor.async_check()
    assert executor.view["team"]["state"] == "together"
    assert not is_on(hass, r2)


async def test_a_block_that_does_not_arrive_gives_everything_back(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-10T19:00:00+02:00")
    install_team(hass, byd_soc=40, venus_soc=60)
    flows(hass, grid=0, byd=-800)
    r2 = await interlock(hass)

    # The system's limit switch ignores Joe.
    def stubborn(call: ServiceCall) -> None:
        entity_id = call.data["entity_id"]
        entity_id = entity_id[0] if isinstance(entity_id, list) else entity_id
        if entity_id != "switch.omni_power_limits":
            hass.states.async_set(entity_id, "on")

    hass.services.async_register("switch", "turn_on", stubborn)
    executor, _ = await make_executor(hass, team_config(), day_plan(dt_util.now()))
    await owner_switches_off(hass, r2)
    await executor.async_check()
    assert executor.view["team"]["state"] == "on"
    assert not is_on(hass, r2)
    # Read back after a while: the switch is still off.
    freezer.tick(timedelta(minutes=2))
    await executor.async_check()
    await hass.async_block_till_done()
    view = executor.view["team"]
    assert view["state"] == "not_taken"
    assert view["batteries"]["venus"]["problem"] == "not_taken"
    assert not is_on(hass, r2)
    assert venus_levers(hass) == ("2500.0", "2500.0", "off")
    assert executor.data["team"]["blocks"] == {}
    assert any(e["kind"] == "team_broken" for e in executor.data["log"])
    # Joe stays out for an hour.
    freezer.tick(timedelta(minutes=30))
    await executor.async_check()
    assert executor.view["team"]["state"] == "not_taken"
    # Then tries again, fails again: the rest of the day.
    freezer.tick(timedelta(minutes=31))
    await executor.async_check()
    assert executor.view["team"]["state"] == "on"
    freezer.tick(timedelta(minutes=2))
    await executor.async_check()
    await hass.async_block_till_done()
    assert executor.view["team"]["state"] == "not_taken"
    assert not is_on(hass, r2)
    freezer.tick(timedelta(hours=2))
    await executor.async_check()
    assert executor.view["team"]["state"] == "not_taken"
    assert [b["count"] for b in executor.data["team"]["broken"].values()] == [2]


async def test_not_live_gives_back_at_once(hass: HomeAssistant, freezer) -> None:
    freezer.move_to("2026-10-10T19:00:00+02:00")
    install_team(hass, byd_soc=40, venus_soc=60)
    flows(hass, grid=0, byd=-800)
    r2 = await interlock(hass)
    executor, holder = await make_executor(hass, team_config(), day_plan(dt_util.now()))
    await owner_switches_off(hass, r2)
    await executor.async_check()
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    holder["mode"] = "simulation"
    await executor.async_check()
    await hass.async_block_till_done()
    view = executor.view["team"]
    assert view["dry"] is True
    assert "hold" not in view
    assert venus_levers(hass) == ("2500.0", "2500.0", "off")
    assert not is_on(hass, r2)


def test_a_fronius_blocked_completely(hass: HomeAssistant) -> None:
    """Both limits at 0 and both switches on (StorCtl_Mod): value first, then
    its switch; back: the switch off first, then the value. A limit without
    its switch is ignored by the Fronius: not blocked."""
    install_team(hass)
    byd = make_adapter(team_byd())
    writes, _ = byd.team_block(hass, True, True, False)
    assert writes == [
        Write("number.charge_limit", 0),
        Write("switch.charge_limit", True),
        Write("number.discharge_limit", 0),
        Write("switch.discharge_limit", True),
    ]
    saved = {
        "number.charge_limit": 100.0,
        "switch.charge_limit": False,
        "number.discharge_limit": 100.0,
        "switch.discharge_limit": False,
    }
    # The switches off first, then the values.
    assert byd.team_free(saved, byd.team_release_roles()) == [
        Write("switch.charge_limit", False),
        Write("switch.discharge_limit", False),
        Write("number.charge_limit", 100.0),
        Write("number.discharge_limit", 100.0),
    ]
    percent = {"min": 0, "max": 100, "step": 1, "unit_of_measurement": "%"}
    hass.states.async_set("number.charge_limit", "0", percent)
    hass.states.async_set("number.discharge_limit", "0", percent)
    assert not byd.charge_blocked(hass) and not byd.discharge_blocked(hass)
    hass.states.async_set("switch.charge_limit", "on")
    hass.states.async_set("switch.discharge_limit", "on")
    assert byd.charge_blocked(hass) and byd.discharge_blocked(hass)
    hass.states.async_set("number.discharge_limit", "100", percent)
    assert not byd.discharge_blocked(hass)


async def test_a_block_the_fronius_undoes_is_written_again(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-10T19:00:00+02:00")
    # The BYD at its floor (its reserve, 5 %): empty, the Venus works.
    calls = install_team(hass, byd_soc=5, venus_soc=60)
    flows(hass, grid=0, venus=-800)
    config = team_config(team_byd(cutoff_soc=10.5), team_venus())
    executor, _ = await make_executor(hass, config, day_plan(dt_util.now()))
    await executor.async_check()
    assert executor.view["team"]["active"] == "venus"
    assert byd_levers(hass) == ("0.0", "on", "0.0", "on")
    for round_ in range(2):
        freezer.tick(timedelta(minutes=1))
        await executor.async_check()
        # Its Modbus control restarts: the switches are off again.
        hass.states.async_set("switch.discharge_limit", "off")
        hass.states.async_set("switch.charge_limit", "off")
        calls.clear()
        freezer.tick(timedelta(minutes=1))
        await executor.async_check()
        assert ("switch.discharge_limit", "on") in calls, round_
        assert byd_levers(hass) == ("0.0", "on", "0.0", "on")
        assert executor.view["team"]["state"] == "on"
        assert "switch.discharge_limit" not in executor.data["external"]
        # The original stays Joe's to give back.
        assert executor.data["saved"]["switch.discharge_limit"] is False
    assert [e["kind"] for e in executor.data["log"]].count("team_reset") == 2
    # Again and again within the hour: Joe cannot rely on it.
    freezer.tick(timedelta(minutes=1))
    await executor.async_check()
    hass.states.async_set("switch.discharge_limit", "off")
    freezer.tick(timedelta(minutes=1))
    await executor.async_check()
    view = executor.view["team"]
    assert view["state"] == "not_taken"
    assert view["batteries"]["byd"]["problem"] == "reset"
    assert byd_levers(hass) == ("100.0", "off", "100.0", "off")


async def test_a_fronius_switch_that_does_not_take_is_a_problem(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-10T19:00:00+02:00")
    install_team(hass, byd_soc=12, venus_soc=60)
    flows(hass, grid=0, venus=-800)

    def stubborn(call: ServiceCall) -> None:
        entity_id = call.data["entity_id"]
        entity_id = entity_id[0] if isinstance(entity_id, list) else entity_id
        if entity_id != "switch.discharge_limit":
            hass.states.async_set(entity_id, "on")

    hass.services.async_register("switch", "turn_on", stubborn)
    config = team_config(team_byd(cutoff_soc=10.5), team_venus())
    executor, _ = await make_executor(hass, config, day_plan(dt_util.now()))
    await executor.async_check()
    # The limit shows 0, its switch stays off: discharging is not blocked.
    assert byd_levers(hass)[2:] == ("0.0", "off")
    assert executor.view["team"]["state"] == "on"
    freezer.tick(timedelta(minutes=2))
    await executor.async_check()
    view = executor.view["team"]
    assert view["state"] == "not_taken"
    assert view["batteries"]["byd"]["problem"] in ("not_taken", "not_effective")
    assert byd_levers(hass) == ("100.0", "off", "100.0", "off")


# --- a moment's dropout, holding again, stopping -------------------------------------


@pytest.mark.parametrize(
    "gone",
    [
        ("sensor.venus_soc", "unavailable", "unknown"),
        ("number.omni_max_discharge", "unavailable", "levers"),
        ("sensor.grid", "unavailable", "no_grid"),
    ],
)
async def test_a_short_dropout_keeps_the_blocks(
    hass: HomeAssistant, freezer, gone: tuple[str, str, str]
) -> None:
    """A Modbus dropout for a minute: Joe neither gives his blocks back nor
    switches the owner's automations on; once the value is back all goes on."""
    entity_id, value, reason = gone
    freezer.move_to("2026-10-10T19:00:00+02:00")
    calls = install_team(hass, byd_soc=40, venus_soc=60)
    flows(hass, grid=0, byd=-800)
    r2 = await interlock(hass)
    executor, _ = await make_executor(hass, team_config(), day_plan(dt_util.now()))
    await owner_switches_off(hass, r2)
    await executor.async_check()
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    before = hass.states.get(entity_id)
    calls.clear()
    hass.states.async_set(entity_id, value, before.attributes)
    await executor.async_check()
    await hass.async_block_till_done()
    view = executor.view["team"]
    assert view["state"] == "bridging"
    assert view["gap"] == {"reason": reason, "until": "2026-10-10T19:01:30+02:00"}
    assert calls == []
    assert not is_on(hass, r2)
    assert executor.data["team"]["blocks"]["venus"] == {
        "charge": True,
        "discharge": True,
    }
    # Back a minute later: Joe goes on as before, nothing given back.
    freezer.tick(timedelta(minutes=1))
    hass.states.async_set(entity_id, before.state, before.attributes)
    await executor.async_check()
    await hass.async_block_till_done()
    view = executor.view["team"]
    assert view["state"] == "on"
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    assert not is_on(hass, r2)
    assert executor.data["team"]["gap"] is None
    kinds = [e["kind"] for e in executor.data["log"]]
    assert "team_gap" in kinds and "team_gap_end" in kinds
    assert "team_end" not in kinds


async def test_a_lever_gone_for_real_goes_back_at_once(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-10T19:00:00+02:00")
    install_team(hass, byd_soc=40, venus_soc=60)
    flows(hass, grid=0, byd=-800)
    r2 = await interlock(hass)
    executor, _ = await make_executor(hass, team_config(), day_plan(dt_util.now()))
    await owner_switches_off(hass, r2)
    await executor.async_check()
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    # The entity is gone (removed, not just unavailable): no grace.
    hass.states.async_remove("number.omni_max_charge")
    await executor.async_check()
    await hass.async_block_till_done()
    view = executor.view["team"]
    assert view["state"] == "levers"
    assert not is_on(hass, r2)
    assert executor.data["team"]["blocks"] == {}
    assert state_of(hass, "switch.omni_power_limits") == ("off",)


async def test_a_long_dropout_gives_back_after_the_grace(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-10T19:00:00+02:00")
    install_team(hass, byd_soc=40, venus_soc=60)
    flows(hass, grid=0, byd=0)
    r2 = await interlock(hass)
    executor, _ = await make_executor(hass, team_config(), day_plan(dt_util.now()))
    await owner_switches_off(hass, r2)
    await executor.async_check()
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    hass.states.async_set("sensor.venus_soc", "unavailable")
    await executor.async_check()
    assert executor.view["team"]["state"] == "bridging"
    freezer.tick(timedelta(minutes=1))
    await executor.async_check()
    assert executor.view["team"]["state"] == "bridging"
    assert not is_on(hass, r2)
    # Still missing after the grace (and the BYD does not work): all back.
    freezer.tick(timedelta(seconds=30))
    await executor.async_check()
    await hass.async_block_till_done()
    view = executor.view["team"]
    assert view["state"] == "unknown"
    assert venus_levers(hass) == ("2500.0", "2500.0", "off")
    assert not is_on(hass, r2)


async def test_stopping_tries_again(
    hass: HomeAssistant, freezer, command_pauses: list[float]
) -> None:
    """Unloaded (disabled, reloaded, updated): the blocks go back with a few
    tries; the owner's automation stays as the owner left it, and after the
    start Joe coordinates again at once."""
    freezer.move_to("2026-10-10T19:00:00+02:00")
    calls = install_team(hass, byd_soc=40, venus_soc=60)
    flows(hass, grid=0, byd=-800)
    r2 = await interlock(hass)
    executor, _ = await make_executor(hass, team_config(), day_plan(dt_util.now()))
    await owner_switches_off(hass, r2)
    await executor.async_check()
    assert venus_levers(hass) == ("0.0", "0.0", "on")
    # The limits' switch fails twice, then takes it.
    tries: list[str] = []

    def flaky(call: ServiceCall) -> None:
        tries.append("off")
        if len(tries) <= 2:
            raise RuntimeError("Modbus busy")
        hass.states.async_set("switch.omni_power_limits", "off")
        calls.append(("switch.omni_power_limits", "off"))

    hass.services.async_register("switch", "turn_off", flaky)
    await executor.async_stop()
    assert len(tries) == 3
    assert command_pauses.count(executor_module.STOP_PAUSE_S) == 2
    assert venus_levers(hass) == ("2500.0", "2500.0", "off")
    assert executor.data["saved"] == {}
    assert not is_on(hass, r2)
    # Set up again: Joe coordinates at once.
    again, _ = await make_executor(hass, team_config(), day_plan(dt_util.now()))
    await again.async_check()
    await hass.async_block_till_done()
    assert again.view["team"]["state"] == "on"
    assert not is_on(hass, r2)
    assert venus_levers(hass) == ("0.0", "0.0", "on")


async def test_what_does_not_go_back_at_a_stop_is_told(
    hass: HomeAssistant, freezer
) -> None:
    from custom_components.energy_joe.control.notify import JoeNotifier
    from homeassistant.components.persistent_notification import (
        _async_get_or_create_notifications,
    )

    freezer.move_to("2026-10-10T19:00:00+02:00")
    install_team(hass, byd_soc=40, venus_soc=60)
    flows(hass, grid=0, byd=-800)
    executor, holder = await make_executor(hass, team_config(), day_plan(dt_util.now()))
    executor.notifier = JoeNotifier(hass, lambda: holder["config"], AsyncMock())
    await executor.async_check()

    def broken(call: ServiceCall) -> None:
        raise RuntimeError("Modbus gone")

    hass.services.async_register("switch", "turn_off", broken)
    await executor.async_stop()
    assert "switch.omni_power_limits" in executor.data["saved"]
    notes = _async_get_or_create_notifications(hass)
    message = notes["energy_joe_not_restored"]["message"]
    assert "switch.omni_power_limits" in message
    # The next start puts it back and the note goes.
    install_team(hass, byd_soc=40, venus_soc=60)
    holder["config"] = team_config(battery_team="together")
    await executor.async_start()
    await executor.async_stop()
    assert executor.data["saved"] == {}
    assert "energy_joe_not_restored" not in _async_get_or_create_notifications(hass)
