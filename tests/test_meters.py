"""Which device measures a thermostat or air conditioner."""

from __future__ import annotations

from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.energy_joe import model
from custom_components.energy_joe.control.meters import meter_options, suggest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import (
    area_registry as ar,
    device_registry as dr,
    entity_registry as er,
)


def _sensor(hass: HomeAssistant, device_id: str, key: str, kind: str, name: str) -> str:
    item = er.async_get(hass).async_get_or_create(
        "sensor",
        "shelly",
        key,
        device_id=device_id,
        original_device_class=kind,
        original_name=name,
    )
    hass.states.async_set(item.entity_id, "1", {"friendly_name": name})
    return item.entity_id


async def test_channels_of_a_meter_and_the_suggestion(hass: HomeAssistant) -> None:
    """Each channel is a device "via" the meter; name and room pick it."""
    entry = MockConfigEntry(domain="shelly")
    entry.add_to_hass(hass)
    devices = dr.async_get(hass)
    bedroom = ar.async_get(hass).async_create("Schlafzimmer")
    meter = devices.async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={("shelly", "3em")},
        name="Shelly Pro 3EM HV Gerätemessungen",
    )
    channels = {}
    for key, name in (("a", "Schlafzimmer Klimaanlage"), ("b", "Wohnzimmer Klima")):
        channel = devices.async_get_or_create(
            config_entry_id=entry.entry_id,
            identifiers={("shelly", key)},
            name=name,
            via_device_id=meter.id,
        )
        channels[key] = channel
        power = _sensor(hass, channel.id, f"{key}_p", "power", f"{name} Leistung")
        energy = _sensor(hass, channel.id, f"{key}_e", "energy", f"{name} Energie")
        channels[key + "_entities"] = (power, energy)
    devices.async_update_device(channels["a"].id, area_id=bedroom.id)
    options = meter_options(hass)
    assert [(m["name"], m["via"]) for m in options] == [
        ("Schlafzimmer Klimaanlage", meter.name),
        ("Wohnzimmer Klima", meter.name),
    ]
    assert (options[0]["power"], options[0]["energy"]) == channels["a_entities"]

    hit = suggest(
        {
            "name": "Schlafzimmer Klimaanlage",
            "device_name": None,
            "area": "Schlafzimmer",
        },
        options,
    )
    assert hit is not None and hit["device_id"] == channels["a"].id
    # "Klima" is "Klimaanlage" here, one word alone is not enough.
    assert (
        suggest({"name": "Wohnzimmer Klimaanlage"}, options)["device_id"]
        == channels["b"].id
    )
    assert suggest({"name": "Büro Klimaanlage"}, options) is None


def test_several_rooms_may_share_one_meter() -> None:
    meter = {"device_id": "dev1", "power": "sensor.p", "energy": "sensor.e"}
    config = model.apply_update(
        model.default_config(),
        {
            "climate": {
                "rooms": {
                    "climate.a": {"meter": meter},
                    "climate.b": {"meter": meter},
                    "climate.c": {"meter": "none"},
                }
            }
        },
        "user",
    )
    rooms = config["climate"]["rooms"]
    assert rooms["climate.a"]["meter"] == rooms["climate.b"]["meter"] == meter
    assert rooms["climate.c"]["meter"] == "none"
