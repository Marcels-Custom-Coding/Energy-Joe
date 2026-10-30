"""Night windows of the heating and the power hogs (review of 0.9.51)."""

from __future__ import annotations

from datetime import datetime

from custom_components.energy_joe.control.climate import ClimateController
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .test_climate import ROOM, config, install as install_climate
from .test_standby import TV, controller, install, zone_time

NIGHT = "input_boolean.gute_nacht"


async def test_room_back_in_the_morning_while_the_entity_stays_on(
    hass: HomeAssistant,
) -> None:
    """Everybody slept in, the entity still on: no new night after 06:30."""
    install_climate(hass)
    cfg = config(night_off=True, night_until="06:30")
    cfg["climate"].update(night_by="entity", night_entity=NIGHT)
    joe = ClimateController(hass, lambda: cfg, lambda: "live", lambda: None)
    room = cfg["climate"]["rooms"][ROOM]
    zone = dt_util.get_default_time_zone()
    hass.states.async_set(NIGHT, "on")
    assert joe._night(room, datetime(2026, 1, 10, 23, 0, tzinfo=zone), ROOM)
    assert not joe._night(room, datetime(2026, 1, 11, 6, 20, tzinfo=zone), ROOM)
    for hour, minute in ((6, 30), (6, 45), (7, 45), (12, 0)):
        moment = datetime(2026, 1, 11, hour, minute, tzinfo=zone)
        assert not joe._night(room, moment, ROOM), (hour, minute)
    # In the evening the entity (still or again on) means a new night.
    assert joe._night(room, datetime(2026, 1, 11, 22, 0, tzinfo=zone), ROOM)


async def test_power_hog_night_survives_a_restart(hass: HomeAssistant, freezer) -> None:
    """HA sets last_changed anew on a restart: the night still ends at 06:30."""
    calls = install(hass)
    joe, cfg = controller(hass, "night")
    cfg["climate"].update(night_by="entity", night_entity=NIGHT)
    freezer.move_to(zone_time(2026, 10, 19, 22))
    hass.states.async_set(NIGHT, "on")
    await joe.async_check()
    assert calls == [("turn_off", TV)]
    stored = dict(joe.data)
    # Restart at 06:45: the entity comes back on with a fresh last_changed
    # (without the noted beginning a new night until tomorrow morning).
    freezer.move_to(zone_time(2026, 10, 20, 6, 45))
    hass.states.async_remove(NIGHT)
    hass.states.async_set(NIGHT, "on")
    joe2, _ = controller(hass, "night")
    joe2._config = lambda: cfg
    joe2.data.update(stored)
    assert joe2._night(cfg["standby"]["devices"][TV], dt_util.now()) is None
    # Switched off: the next night begins afresh.
    hass.states.async_set(NIGHT, "off")
    await joe2.async_check()
    assert joe2.data["night_since"] is None
