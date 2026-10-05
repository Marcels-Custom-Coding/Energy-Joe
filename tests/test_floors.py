"""Each battery's own floor: from the device, or as the user set it."""

from __future__ import annotations

from custom_components.energy_joe.plan.inputs import (
    _pooled_floor,
    battery_floor,
    device_floor,
)
from custom_components.energy_joe.plan.planner import Battery
from homeassistant.core import HomeAssistant


def _battery(**extra):
    return {
        "id": "marstek",
        "name": "Marstek",
        "adapter": "omnibattery",
        "controls": {"min_soc": "number.marstek_discharge_cutoff"},
        "floor_soc": None,
        **extra,
    }


async def test_floor_from_device_user_or_unknown(hass: HomeAssistant) -> None:
    hass.states.async_set("number.marstek_discharge_cutoff", "11")
    battery = _battery()
    assert battery_floor(hass, battery) == (11.0, "device")
    # While Joe has raised it, the value from before counts.
    assert device_floor(hass, battery, {"number.marstek_discharge_cutoff": 12}) == 12
    assert battery_floor(hass, _battery(floor_soc=20)) == (20.0, "user")
    assert battery_floor(hass, _battery(controls={})) == (None, "unknown")


def test_pooled_floor_weighs_each_battery_by_size() -> None:
    byd = Battery("byd", "BYD", 10.0, 50.0, 5.0, 5.0, floor=20.0)
    marstek = Battery("m", "Marstek", 5.0, 50.0, 2.5, 2.5, floor=11.0)
    assert _pooled_floor([byd, marstek], 10.0) == round((10 * 20 + 5 * 11) / 15, 2)
    # The rule "reserve" stays the least.
    small = Battery("m", "Marstek", 5.0, 50.0, 2.5, 2.5, floor=5.0)
    assert _pooled_floor([small], 10.0) == 10.0


def test_converter_losses_from_grid_charging_nights() -> None:
    """The battery meter sees 92 % of what the grid gave for charging."""
    from custom_components.energy_joe.learn.models import converter_model

    days = {}
    for night in range(6):
        hours = []
        for hour in range(6):
            charging = hour >= 2
            bat_in = 2.3 if charging else 0.0
            hours.append(
                {
                    "start": f"2026-01-{10 + night:02d}T{hour:02d}:00:00+01:00",
                    "cov": 1.0,
                    "solar": 0.0,
                    "home": 0.4 + (0.2 if charging else 0.0),
                    "grid_in": 0.4 + (bat_in / 0.92 if charging else 0.0),
                    "grid_out": 0.0,
                    "bat": {
                        "byd": {"in": bat_in, "out": 0.0},
                        "m": {"in": 0.0, "out": 0.0},
                    },
                }
            )
        days[f"2026-01-{10 + night:02d}"] = {"hours": hours}
    found = converter_model(days, "byd")
    assert found == {"factor": 0.92, "nights": 6}
    assert converter_model(dict(list(days.items())[:3]), "byd") is None
