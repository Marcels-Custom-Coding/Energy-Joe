"""Findings of the review of the executor (0.9.51): nothing written after the
stop, an unknown charge level holds back, the running hour counts."""

from __future__ import annotations

import asyncio
from datetime import timedelta
from unittest.mock import patch

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .test_control import (  # noqa: F401 (berlin: the time zone of the tests)
    berlin,
    configured,
    fronius_battery,
    install_devices,
    limited_fronius,
    make_executor,
    night_plan,
    sunny_morning_plan,
    venus_battery,
)


def _charge_limit(hass: HomeAssistant) -> None:
    percent = {"min": 0, "max": 100, "step": 1, "unit_of_measurement": "%"}
    hass.states.async_set("number.charge_limit", "100", percent)
    hass.states.async_set("switch.charge_limit", "off")


async def test_a_check_waiting_for_the_lock_writes_nothing_after_the_stop(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-04T01:00:00+02:00")
    install_devices(hass, byd_soc=30.4, venus_soc=70)
    config = configured(fronius_battery(), venus_battery())
    executor, _ = await make_executor(hass, config, night_plan(dt_util.now()))

    await executor._lock.acquire()
    check = asyncio.create_task(executor.async_check())
    await asyncio.sleep(0)
    stop = asyncio.create_task(executor.async_stop())
    await asyncio.sleep(0)
    executor._lock.release()
    await asyncio.gather(check, stop)

    assert hass.states.get("number.discharge_limit").state == "100"
    assert hass.states.get("number.discharge_cutoff").state == "12"
    assert executor.data["saved"] == {}
    assert executor._soc_unsub is None


async def test_the_watchdog_and_new_listeners_stay_off_after_the_stop(
    hass: HomeAssistant,
) -> None:
    install_devices(hass)
    config = configured(fronius_battery(), venus_battery())
    executor, _ = await make_executor(hass, config, None)
    await executor.async_stop()
    with patch.object(executor, "_async_guard") as guard:
        await executor.async_guard()
    guard.assert_not_called()
    executor._watch(["sensor.byd_soc"])
    executor._house_watch(True)
    assert executor._soc_unsub is None
    assert executor._house_unsub is None


async def test_an_unknown_charge_level_holds_back_instead_of_freeing_the_night(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-04T10:00:00+02:00")
    install_devices(hass)
    hass.states.async_set("sensor.byd_soc", "unavailable")
    _charge_limit(hass)
    config = configured(limited_fronius())
    plan = sunny_morning_plan(dt_util.now())
    # Little sun left: with 0 % it would have freed the whole night.
    for hour in plan["hours"]:
        hour["solar"] = min(hour["solar"], 0.9)
    executor, _ = await make_executor(hass, config, plan)

    await executor.async_check()
    assert executor.data.get("day_released") is None
    assert hass.states.get("number.charge_limit").state == "0.0"
    # Known again and the sun still lags: now Joe lets go.
    hass.states.async_set("sensor.byd_soc", "5", {"unit_of_measurement": "%"})
    freezer.tick(timedelta(minutes=1))
    await executor.async_check()
    assert executor.data["day_released"] == plan["window"]["start"]


async def test_the_running_hour_counts_to_the_rest_of_the_sun(
    hass: HomeAssistant, freezer
) -> None:
    freezer.move_to("2026-10-04T10:15:30.500000+02:00")
    install_devices(hass, byd_soc=50)
    _charge_limit(hass)
    config = configured(limited_fronius())
    plan = sunny_morning_plan(dt_util.now())
    # All the sun that is left falls in this hour.
    start = dt_util.start_of_local_day(dt_util.now())
    for hour in plan["hours"]:
        here = hour["start"] == (start + timedelta(hours=10)).isoformat()
        hour["solar"] = 20.0 if here else 0.0
    executor, _ = await make_executor(hass, config, plan)

    await executor.async_check()
    assert executor.data.get("day_released") is None
    assert executor.status["batteries"]["byd"]["action"] == "defer"
