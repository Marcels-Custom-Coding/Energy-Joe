"""Past days get their solar forecast from a sensor's long-term statistics."""

from __future__ import annotations

from collections.abc import Generator
from datetime import datetime, timedelta
from typing import Any

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.components.recorder.common import (
    async_wait_recording_done,
)

from custom_components.energy_joe.observe import (
    backfill as backfill_module,
    observer as observer_module,
)
from custom_components.energy_joe.observe.backfill import (
    async_forecast_history_entity,
    forecast_by_day,
)
from custom_components.energy_joe.observe.observer import JoeObserver
from custom_components.energy_joe.observe.store import HistoryStore
from homeassistant.components.recorder import Recorder
from homeassistant.components.recorder.models import StatisticMeanType
from homeassistant.components.recorder.statistics import async_import_statistics
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util

from .test_observe import config_with

TODAY = ["sensor.fc_east", "sensor.fc_west"]


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(
    recorder_mock: Recorder, enable_custom_integrations: None
) -> Generator[None]:
    """The recorder has to start before Home Assistant (replaces the conftest fixture)."""
    yield


def forecast_config(**forecast: Any) -> dict[str, Any]:
    return config_with(
        measurements={"grid_power": {"entity_id": "sensor.grid"}},
        batteries=[],
        persons=[],
        context={"weather_entity": None},
        forecast={"today": TODAY, **forecast},
    )


def add_helper(
    hass: HomeAssistant, name: str, entity_ids: list[str], kind: str = "sum"
) -> str:
    """A min_max helper with its sensor; returns the sensor's entity id."""
    entry = MockConfigEntry(
        domain="min_max",
        options={"name": name, "type": kind, "entity_ids": entity_ids},
    )
    entry.add_to_hass(hass)
    return (
        er.async_get(hass)
        .async_get_or_create(
            "sensor",
            "min_max",
            entry.entry_id,
            config_entry=entry,
            suggested_object_id=name,
        )
        .entity_id
    )


def import_hours(
    hass: HomeAssistant,
    entity: str,
    values: dict[datetime, float],
    unit: str = "kWh",
    unit_class: str = "energy",
) -> None:
    async_import_statistics(
        hass,
        {
            "mean_type": StatisticMeanType.ARITHMETIC,
            "has_sum": False,
            "name": None,
            "source": "recorder",
            "statistic_id": entity,
            "unit_class": unit_class,
            "unit_of_measurement": unit,
        },
        [
            {"start": dt_util.as_utc(start), "mean": v, "min": v, "max": v}
            for start, v in sorted(values.items())
        ],
    )


def local(day: str, hour: int) -> datetime:
    return dt_util.start_of_local_day(datetime.fromisoformat(day)) + timedelta(
        hours=hour
    )


async def test_finding_the_forecast_sensor(
    recorder_mock: Recorder, hass: HomeAssistant
) -> None:
    """The user's pick wins; else a min_max sum of exactly the "today" sensors."""
    helper = add_helper(hass, "forecast_solar_heute", list(reversed(TODAY)))
    other = add_helper(hass, "forecast_other", [TODAY[0]])
    mean = add_helper(hass, "forecast_mean", TODAY, kind="mean")
    hour = local("2026-10-01", 4)
    for entity in (helper, other, mean):
        import_hours(hass, entity, {hour: 12.0})
    import_hours(hass, "sensor.picked", {hour: 9000.0}, unit="Wh")
    import_hours(hass, "sensor.power", {hour: 1.0}, unit="kW", unit_class="power")
    await async_wait_recording_done(hass)

    assert await async_forecast_history_entity(hass, forecast_config()) == (
        helper,
        1.0,
    )
    picked = forecast_config(history_entity="sensor.picked")
    assert await async_forecast_history_entity(hass, picked) == (
        "sensor.picked",
        0.001,
    )
    # Not energy, or no statistics at all: nothing.
    for entity in ("sensor.power", "sensor.nothing"):
        config = forecast_config(history_entity=entity)
        assert await async_forecast_history_entity(hass, config) is None
    # Other sensors than Joe's: the helper does not fit.
    config = forecast_config(today=[*TODAY, "sensor.fc_south"])
    assert await async_forecast_history_entity(hass, config) is None


async def test_without_statistics_nothing_is_found(
    recorder_mock: Recorder, hass: HomeAssistant
) -> None:
    add_helper(hass, "forecast_solar_heute", TODAY)
    assert await async_forecast_history_entity(hass, forecast_config()) is None


async def test_the_early_hour_counts_across_clock_changes(
    recorder_mock: Recorder, hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    await hass.config.async_set_time_zone("Europe/Berlin")

    def row(moment: datetime, mean: float | None) -> dict[str, Any]:
        return {"start": dt_util.as_utc(moment).timestamp(), "mean": mean}

    rows = [
        # Winter time begins: 04:00 is 03:00 UTC.
        row(dt_util.parse_datetime("2026-10-25T03:00:00+00:00"), 20.0),
        # Summer time begins: 04:00 is 02:00 UTC.
        row(dt_util.parse_datetime("2026-03-29T02:00:00+00:00"), 18.0),
        # No 04:00, 05:00 still empty: 03:00.
        row(local("2026-06-01", 3), 30.0),
        row(local("2026-06-01", 5), 0.05),
        # Nothing usable.
        row(local("2026-06-02", 4), 0.0),
        row(local("2026-06-03", 4), None),
    ]
    assert forecast_by_day(rows, 1.0) == {
        "2026-10-25": 20.0,
        "2026-03-29": 18.0,
        "2026-06-01": 30.0,
    }
    # The doubled hour: the first one.
    monkeypatch.setattr(backfill_module, "FORECAST_HOURS", (2,))
    doubled = [
        row(dt_util.parse_datetime("2026-10-25T01:00:00+00:00"), 7.0),
        row(dt_util.parse_datetime("2026-10-25T00:00:00+00:00"), 6.0),
    ]
    assert forecast_by_day(doubled, 1000.0) == {"2026-10-25": 6000.0}


async def test_past_days_get_their_forecast_once(
    recorder_mock: Recorder, hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    """Only days without a forecast, once per sensor, again for another sensor."""
    await hass.config.async_set_time_zone("Europe/Berlin")

    async def no_hours(*args: Any, **kwargs: Any) -> list[dict[str, Any]]:
        return []

    monkeypatch.setattr(observer_module, "async_backfill", no_hours)
    today = dt_util.now().date()
    days = [(today - timedelta(days=n)).isoformat() for n in (4, 3, 2, 1)]
    helper = add_helper(hass, "forecast_solar_heute", TODAY)
    import_hours(
        hass,
        helper,
        {
            local(days[0], 3): 5.0,
            local(days[0], 4): 11.0,
            local(days[0], 5): 12.0,
            # The second day was watched: its own forecast stays.
            local(days[1], 4): 13.0,
            # No 04:00: 05:00.
            local(days[2], 5): 14.0,
            local(days[3], 4): 0.0,
        },
    )
    import_hours(hass, "sensor.picked", {local(d, 4): 20.0 for d in days[:2]})
    await async_wait_recording_done(hass)

    store = HistoryStore(hass)
    await store.async_load()
    await store.async_put_hours(
        [{"start": local(d, 12).isoformat(), "src": "stats", "cov": 1.0} for d in days]
    )
    await store.async_update_day(days[1], fc={"ahead_kwh": 9.5, "rain": True})
    await store.async_update_day(days[2], fc={"rain": False})
    filled: list[bool] = []
    observer = JoeObserver(hass, store, lambda: None, lambda: filled.append(True))

    await observer.async_start(forecast_config())
    await hass.async_block_till_done(wait_background_tasks=True)
    assert observer.status["forecast_history"] == {
        "entity": helper,
        "state": "done",
        "days": 2,
        "from": days[0],
    }
    assert (await store.async_day(days[0]))["fc"] == {
        "ahead_kwh": 11.0,
        "from": "statistics",
    }
    assert (await store.async_day(days[1]))["fc"] == {"ahead_kwh": 9.5, "rain": True}
    assert (await store.async_day(days[2]))["fc"] == {
        "rain": False,
        "ahead_kwh": 14.0,
        "from": "statistics",
    }
    assert "fc" not in await store.async_day(days[3])
    assert filled == [True]

    # The same sensor: not read again.
    await store.async_update_day(days[0], fc={"ahead_kwh": 1.0})
    await observer.async_start(forecast_config())
    await hass.async_block_till_done(wait_background_tasks=True)
    assert (await store.async_day(days[0]))["fc"]["ahead_kwh"] == 1.0
    assert observer.status["forecast_history"]["state"] == "done"
    assert filled == [True]

    # Another sensor: its values replace those from statistics, not Joe's own.
    await observer.async_start(forecast_config(history_entity="sensor.picked"))
    await hass.async_block_till_done(wait_background_tasks=True)
    assert (await store.async_day(days[0]))["fc"]["ahead_kwh"] == 20.0
    assert (await store.async_day(days[1]))["fc"]["ahead_kwh"] == 9.5
    assert (await store.async_day(days[2]))["fc"]["ahead_kwh"] == 14.0
    assert observer.status["forecast_history"] == {
        "entity": "sensor.picked",
        "state": "done",
        "days": 2,
        "from": days[0],
    }
    assert store.forecast_history["entity"] == "sensor.picked"
    assert filled == [True, True]

    # No sensor any more: nothing is read, what came in stays.
    await observer.async_start(forecast_config(history_entity="sensor.nothing"))
    await hass.async_block_till_done(wait_background_tasks=True)
    assert observer.status["forecast_history"]["state"] == "none"
    assert observer.status["forecast_history"]["entity"] is None
    await observer.async_stop()
    await store.async_unload()
