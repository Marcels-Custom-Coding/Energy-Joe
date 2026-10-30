"""Findings of the review: commit retry, empty battery at the window, counter hours."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

import pytest

from custom_components.energy_joe import model
from custom_components.energy_joe.observe.backfill import missing_hours
from custom_components.energy_joe.plan import scheduler
from custom_components.energy_joe.plan.planner import (
    Battery,
    Hour,
    PlanInput,
    Prices,
    simulate,
)
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util


def berlin(text: str) -> datetime:
    return datetime.fromisoformat(text).replace(tzinfo=dt_util.get_default_time_zone())


@pytest.fixture(autouse=True)
def berlin_time(hass: HomeAssistant) -> None:
    dt_util.set_default_time_zone(dt_util.get_time_zone("Europe/Berlin"))


async def test_unusable_plan_is_not_fixed_again_every_second(
    hass: HomeAssistant, freezer, monkeypatch
) -> None:
    """Prices pending at the commit: the next try waits the pause."""
    from custom_components.energy_joe.observe.store import HistoryStore

    freezer.move_to("2026-10-03T23:50:00+02:00")
    store = HistoryStore(hass)
    await store.async_load()
    planner = scheduler.JoePlanner(hass, store, lambda: None)
    config = model.default_config()
    config["tariff"]["kind"] = "fixed_window"
    config["tariff"]["window"] = {"start": "00:00", "end": "05:00"}
    planner._config = config
    moments: list[datetime] = []

    def track(_hass: Any, _action: Any, moment: datetime) -> Any:
        moments.append(moment)
        return lambda: None

    monkeypatch.setattr(scheduler, "async_track_point_in_time", track)

    async def unavailable(now: Any, fixed: Any = None) -> dict[str, Any]:
        return {"kind": "unavailable", "reasons": ["prices_pending"]}

    planner._async_plan = unavailable  # type: ignore[method-assign]
    planner._schedule_commit()
    assert moments[-1] - dt_util.now() <= timedelta(seconds=1)
    await planner._async_fix()
    assert moments[-1] - dt_util.now() >= scheduler.COMMIT_RETRY - timedelta(seconds=1)

    # Once a plan comes, the pause is over.
    async def usable(now: Any, fixed: Any = None) -> dict[str, Any]:
        return {
            "kind": "none",
            "window": {
                "start": "2026-10-04T00:00:00+02:00",
                "end": "2026-10-04T05:00:00+02:00",
            },
        }

    planner._async_plan = usable  # type: ignore[method-assign]
    await planner._async_fix()
    assert planner._retry_at is None
    assert planner._fixed is not None
    await store.async_unload()


def test_empty_battery_at_window_start_stays_empty() -> None:
    """Reserve 0 and an empty battery at the window: 0 kWh, not the end level."""
    start = berlin("2026-10-04T00:00")
    hours = [
        Hour(start=start + timedelta(hours=h), solar=0.0, home=0.5, window=h >= 1)
        for h in range(4)
    ] + [
        Hour(start=start + timedelta(hours=4), solar=0.0, home=0.0, window=True),
    ]
    inp = PlanInput(
        now=start,
        window_start=start + timedelta(hours=1),
        window_end=start + timedelta(hours=5),
        hours=hours,
        batteries=[Battery("b1", "Battery", 10.0, 0.0, 3.0, 3.0)],
        prices=Prices(night=0.18, day=0.28, feed_in=0.06),
        buffer=0.0,
        reserve=0.0,
    )
    run = simulate(inp, 5.0)
    assert run.energy_at_window_start == 0.0


def test_hours_from_counters_alone_count_as_read() -> None:
    """Without power readings cov is 0; counted energies are still complete."""
    start = berlin("2026-10-04T00:00")
    end = start + timedelta(hours=3)
    known = [
        {
            "start": start.isoformat(),
            "src": "stats",
            "cov": 0.0,
            "home": 0.4,
            "grid_in": 0.4,
            "grid_out": 0.0,
        },
        # A live hour without readings is still read again.
        {
            "start": (start + timedelta(hours=1)).isoformat(),
            "src": "live",
            "cov": 0.0,
            "home": 0.4,
            "grid_in": 0.4,
        },
        # Nothing counted: missing.
        {"start": (start + timedelta(hours=2)).isoformat(), "src": "stats", "cov": 0.0},
    ]
    assert missing_hours(known, start, end) == [
        start + timedelta(hours=1),
        start + timedelta(hours=2),
    ]
