"""Joe reads the past from Home Assistant's recorder."""

from __future__ import annotations

from collections.abc import Generator
from datetime import timedelta

import pytest
from pytest_homeassistant_custom_component.components.recorder.common import (
    async_wait_recording_done,
)

from custom_components.energy_joe.observe.backfill import async_backfill
from homeassistant.components.recorder import Recorder
from homeassistant.components.recorder.models import StatisticMeanType
from homeassistant.components.recorder.statistics import async_import_statistics
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .test_observe import config_with


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(
    recorder_mock: Recorder, enable_custom_integrations: None
) -> Generator[None]:
    """The recorder has to start before Home Assistant (replaces the conftest fixture)."""
    yield


async def test_backfill_reads_statistics(
    recorder_mock: Recorder, hass: HomeAssistant
) -> None:
    """Hourly means from the recorder become hour records in Joe's units."""
    await hass.config.async_set_time_zone("Europe/Berlin")
    start = dt_util.parse_datetime("2026-10-01T10:00:00+00:00")
    async_import_statistics(
        hass,
        {
            "mean_type": StatisticMeanType.ARITHMETIC,
            "has_sum": False,
            "name": None,
            "source": "recorder",
            "statistic_id": "sensor.grid",
            "unit_class": "power",
            "unit_of_measurement": "W",
        },
        [
            {
                "start": start + timedelta(hours=i),
                "mean": value,
                "min": value,
                "max": value,
            }
            for i, value in enumerate((500.0, 1500.0, -800.0))
        ],
    )
    await async_wait_recording_done(hass)

    config = config_with(
        measurements={"grid_power": {"entity_id": "sensor.grid"}},
        batteries=[],
        persons=[],
    )
    records = await async_backfill(
        hass, config, None, start, start + timedelta(hours=3)
    )
    assert [r["src"] for r in records] == ["stats"] * 3
    assert [r["grid_in"] for r in records] == pytest.approx([0.5, 1.5, 0.0])
    assert records[2]["grid_out"] == pytest.approx(0.8)
    assert records[0]["start"] == "2026-10-01T12:00:00+02:00"
