"""A Fronius GEN24 steered over Modbus TCP: the storage control model found
and read, rates and bits written, Joe's own entities for it, the preview's
steps and a probe against an inverter of the tests."""

from __future__ import annotations

from typing import Any
from unittest.mock import patch

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.energy_joe.const import DOMAIN
from custom_components.energy_joe.control import executor as executor_module, operations
from custom_components.energy_joe.control.adapters import make_adapter
from custom_components.energy_joe.control.fronius_modbus import (
    CHAGRISET,
    CHASTATE,
    INWRTE,
    MINRSVPCT,
    OUTWRTE,
    STORCTL_MOD,
    WCHAMAX,
    Gen24Storage,
    NotFound,
    inverter_slug,
)
from custom_components.energy_joe.control.modbus_tcp import (
    ModbusTcp,
    from_int16,
    to_int16,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from .modbus_server import FakeInverter
from .test_control import fronius_battery, install_devices
from .test_operations import by_op, quick, sets

__all__ = ["quick"]  # the fixture of the probes (no waiting)

pytestmark = pytest.mark.usefixtures("socket_enabled")


def image(base: int = 40343, **values: int) -> dict[int, int]:
    """Model 124 as a GEN24 with a 10.24 kWh BYD shows it: id and length,
    WChaMax 10240 W, no limits, reserve 5 %, level 11.2 %, holding."""
    registers = {base: 124, base + 1: 24}
    for offset in range(2, 26):
        registers[base + offset] = 0
    registers[base + WCHAMAX] = 10240
    registers[base + MINRSVPCT] = 500
    registers[base + CHASTATE] = 1120
    registers[base + 11] = 6  # ChaSt holding
    registers[base + OUTWRTE] = 10000
    registers[base + INWRTE] = 10000
    for offset in (21, 22, 25):  # MinRsvPct_SF, ChaState_SF, InOutWRte_SF
        registers[base + offset] = from_int16(-2)
    for address, value in values.items():
        registers[address] = value
    return registers


@pytest.fixture
async def inverter():
    fake = FakeInverter(image())
    await fake.start()
    yield fake
    await fake.stop()


async def test_the_model_is_found_for_both_layouts(inverter: FakeInverter) -> None:
    storage = Gen24Storage(ModbusTcp("127.0.0.1", inverter.port))
    layout = await storage.async_detect()
    assert layout.kind == "int_sf" and layout.base == 40343
    reading = await storage.async_read()
    assert reading.scale == {"power": 0, "percent": -2, "level": -2, "rate": -2}
    assert layout.inverter_w is None and layout.model == ""
    await storage.client.async_close()

    floated = FakeInverter(image(base=40353))
    await floated.start()
    try:
        storage = Gen24Storage(ModbusTcp("127.0.0.1", floated.port))
        layout = await storage.async_detect()
        assert layout.kind == "float" and layout.base == 40353
        reading = await storage.async_read()
        assert reading.max_power_w == 10240 and reading.level_pct == 11.2
        await storage.client.async_close()
    finally:
        await floated.stop()

    empty = FakeInverter({40000: 0x5375, 40001: 0x6E53})
    await empty.start()
    try:
        storage = Gen24Storage(ModbusTcp("127.0.0.1", empty.port))
        with pytest.raises(NotFound):
            await storage.async_detect()
        await storage.client.async_close()
    finally:
        await empty.stop()


async def test_values_are_scaled_and_written_back(inverter: FakeInverter) -> None:
    storage = Gen24Storage(ModbusTcp("127.0.0.1", inverter.port))
    reading = await storage.async_read()
    assert reading.max_power_w == 10240
    assert reading.control == 0 and not reading.charge_limited
    assert reading.reserve_pct == 5 and reading.level_pct == 11.2
    assert reading.status == "holding"
    assert reading.discharge_rate_pct == 100 and reading.charge_rate_pct == 100
    assert not reading.grid_charging
    # Rates in percent with two decimals, negative as two's complement.
    await storage.async_write("discharge_rate", -40)
    assert inverter.value(40343 + OUTWRTE) == from_int16(-4000)
    await storage.async_write("discharge_rate", -150)
    assert to_int16(inverter.value(40343 + OUTWRTE)) == -10000
    await storage.async_write("charge_rate", 29.3)
    assert inverter.value(40343 + INWRTE) == 2930
    await storage.async_write("reserve", 60)
    assert inverter.value(40343 + MINRSVPCT) == 6000
    await storage.async_write("grid_charging", True)
    assert inverter.value(40343 + CHAGRISET) == 1
    # The control bits one at a time, the other as it is.
    assert await storage.async_set_control(discharge=True) == 2
    assert await storage.async_set_control(charge=True) == 3
    assert await storage.async_set_control(discharge=False) == 1
    assert inverter.value(40343 + STORCTL_MOD) == 1
    reading = await storage.async_read()
    assert reading.charge_limited and not reading.discharge_limited
    assert reading.discharge_rate_pct == -100 and reading.charge_rate_pct == 29.3
    await storage.client.async_close()


def modbus_battery(port: int) -> dict[str, Any]:
    """Marcel's BYD on the Fronius, steered over Modbus."""
    return {
        **fronius_battery(),
        "adapter": "fronius_modbus",
        "controls": {},
        "max_charge_w": None,
        "modbus": {"host": "127.0.0.1", "port": port, "unit": 1},
    }


async def setup_joe(hass: HomeAssistant, inverter: FakeInverter):
    """Joe with the battery over Modbus; its entities and levers in place."""
    install_devices(hass, byd_soc=11.2)
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    runtime = hass.data[DOMAIN]
    runtime.async_update_config({"batteries": [modbus_battery(inverter.port)]}, "user")
    await hass.async_block_till_done()
    await hass.async_block_till_done()
    return runtime, entry


def entity(hass: HomeAssistant, entry: MockConfigEntry, port: int, key: str) -> str:
    registry = er.async_get(hass)
    slug = inverter_slug("127.0.0.1", port, 1)
    for item in registry.entities.values():
        if item.unique_id == f"{entry.entry_id}_modbus_{slug}_{key}":
            return item.entity_id
    raise AssertionError(key)


async def test_joe_has_entities_for_the_inverter(
    ready_hass: HomeAssistant, inverter: FakeInverter
) -> None:
    hass = ready_hass
    runtime, entry = await setup_joe(hass, inverter)
    port = inverter.port
    rate = entity(hass, entry, port, "storage_discharge_rate")
    state = hass.states.get(rate)
    assert state and float(state.state) == 100
    assert state.attributes["min"] == -100 and state.attributes["max"] == 100
    assert (
        float(hass.states.get(entity(hass, entry, port, "storage_charge_rate")).state)
        == 100
    )
    assert (
        float(hass.states.get(entity(hass, entry, port, "storage_reserve")).state) == 5
    )
    assert (
        float(hass.states.get(entity(hass, entry, port, "storage_max_power")).state)
        == 10240
    )
    assert (
        float(hass.states.get(entity(hass, entry, port, "storage_level")).state) == 11.2
    )
    assert (
        hass.states.get(entity(hass, entry, port, "storage_status")).state == "holding"
    )
    assert (
        hass.states.get(entity(hass, entry, port, "storage_charge_limiting")).state
        == "off"
    )
    assert (
        hass.states.get(entity(hass, entry, port, "storage_grid_charging")).state
        == "off"
    )
    # The reference power and the levers came to the battery by themselves.
    battery = runtime.config["batteries"][0]
    assert battery["limit_ref_w"] == 10240 and battery["max_charge_w"] == 10240
    assert battery["controls"] == {
        "min_soc": entity(hass, entry, port, "storage_reserve"),
        "grid_charge": entity(hass, entry, port, "storage_grid_charging"),
        "charge_limit": entity(hass, entry, port, "storage_charge_rate"),
        "charge_limit_enabled": entity(hass, entry, port, "storage_charge_limiting"),
        "discharge_limit": rate,
        "discharge_limit_enabled": entity(
            hass, entry, port, "storage_discharge_limiting"
        ),
    }
    # Writing through the entities reaches the inverter and reads back at once.
    await hass.services.async_call(
        "number", "set_value", {"entity_id": rate, "value": -40}, blocking=True
    )
    assert to_int16(inverter.value(40343 + OUTWRTE)) == -4000
    assert float(hass.states.get(rate).state) == -40
    switch = entity(hass, entry, port, "storage_discharge_limiting")
    await hass.services.async_call(
        "switch", "turn_on", {"entity_id": switch}, blocking=True
    )
    assert inverter.value(40343 + STORCTL_MOD) == 2
    assert hass.states.get(switch).state == "on"
    await hass.services.async_call(
        "switch", "turn_off", {"entity_id": switch}, blocking=True
    )
    assert inverter.value(40343 + STORCTL_MOD) == 0
    # Dropped from the configuration: the entities and the device go.
    runtime.async_update_config({"batteries": [fronius_battery()]}, "user")
    await hass.async_block_till_done()
    assert hass.states.get(rate) is None
    assert not runtime.modbus.inverters


@pytest.mark.usefixtures("quick")
async def test_the_preview_shows_the_rates_and_a_probe_writes_them(
    ready_hass: HomeAssistant, inverter: FakeInverter
) -> None:
    hass = ready_hass
    runtime, entry = await setup_joe(hass, inverter)
    port = inverter.port
    battery = runtime.config["batteries"][0]
    adapter = make_adapter(battery)
    assert adapter.charge_methods() == ["modbus"] and adapter.can_charge
    assert adapter.power_lever(hass) == "power"
    found = by_op(operations.preview(hass, battery, power_w=4000))
    rate = entity(hass, entry, port, "storage_discharge_rate")
    charge = found["charge"]
    assert charge["possible"] and charge["source"] == "profile"
    # Charging: grid charging on, charging allowed in full, the discharge
    # rate below 0 (4000 W of 10240 W), its bit on, the reserve at the target.
    assert sets(charge) == [
        (entity(hass, entry, port, "storage_grid_charging"), True),
        (entity(hass, entry, port, "storage_charge_rate"), 100.0),
        (rate, -39.1),
        (entity(hass, entry, port, "storage_discharge_limiting"), True),
        (entity(hass, entry, port, "storage_reserve"), 32.0),
    ]
    assert charge["steps"][1]["keep"]
    # Waiting: both rates at 0 with their bits (as by day); one row for the owner.
    assert found["hold"]["same_as"] == "block"
    assert sets(found["block"]) == [
        (entity(hass, entry, port, "storage_charge_rate"), 0.0),
        (entity(hass, entry, port, "storage_charge_limiting"), True),
        (rate, 0.0),
        (entity(hass, entry, port, "storage_discharge_limiting"), True),
    ]
    # The daytime cap: the charge rate as a share of the reference.
    cap = found["cap"]
    assert cap["possible"] and sets(cap) == [
        (entity(hass, entry, port, "storage_charge_limiting"), True),
        (entity(hass, entry, port, "storage_charge_rate"), 50.0),
    ]
    # A probe of charging writes the inverter and puts everything back.
    with patch.object(executor_module, "TEST_CHARGE", 0):
        result = await runtime.executor.async_probe(battery["id"], "charge")
    assert result["ok"], result
    assert [s["taken"] for s in result["steps"]] == [True] * 5
    assert to_int16(inverter.value(40343 + OUTWRTE)) == 10000
    assert inverter.value(40343 + STORCTL_MOD) == 0
    assert inverter.value(40343 + MINRSVPCT) == 500
    assert inverter.value(40343 + CHAGRISET) == 0
    written = [to_int16(v[0]) for a, v in inverter.writes if a == 40343 + OUTWRTE]
    assert written == [-10000, 10000]
    assert runtime.executor.data["saved"] == {}


async def test_the_check_over_the_websocket(
    ready_hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    inverter: FakeInverter,
) -> None:
    hass = ready_hass
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": f"{DOMAIN}/modbus/check", "host": "127.0.0.1", "port": inverter.port}
    )
    msg = await client.receive_json()
    assert msg["success"], msg
    result = msg["result"]
    assert result["ok"] and result["kind"] == "int_sf" and result["base"] == 40343
    assert result["max_power_w"] == 10240 and result["level_pct"] == 11.2
    assert result["host"] == "127.0.0.1" and result["hosts"] == []
    # Nobody listens there.
    await client.send_json_auto_id(
        {"type": f"{DOMAIN}/modbus/check", "host": "127.0.0.1", "port": 1}
    )
    msg = await client.receive_json()
    assert msg["success"] and not msg["result"]["ok"]
    assert msg["result"]["problem"] == "connect"
    # No host and no Fronius integration: nothing to try.
    await client.send_json_auto_id({"type": f"{DOMAIN}/modbus/check"})
    msg = await client.receive_json()
    assert msg["success"] and msg["result"]["problem"] == "no_host"
