"""Joe's Modbus TCP client against a server of the tests."""

from __future__ import annotations

import asyncio

import pytest

from custom_components.energy_joe.control.modbus_tcp import (
    ModbusError,
    ModbusTcp,
    from_int16,
    to_int16,
)

from .modbus_server import FakeInverter

# The client needs real sockets (the server of the tests listens on localhost).
pytestmark = pytest.mark.usefixtures("socket_enabled")


@pytest.fixture
async def inverter():
    fake = FakeInverter({40345 + i: 0 for i in range(24)})
    fake.registers[40345] = 10240
    fake.registers[40355] = from_int16(-4000)
    await fake.start()
    yield fake
    await fake.stop()


def test_signed_registers() -> None:
    assert to_int16(0xFFFF) == -1
    assert to_int16(65536 - 4000) == -4000
    assert to_int16(10000) == 10000
    assert from_int16(-4000) == 61536
    assert from_int16(61536) == 61536
    with pytest.raises(ValueError):
        from_int16(70000)


async def test_reads_and_writes(inverter: FakeInverter) -> None:
    client = ModbusTcp("127.0.0.1", inverter.port, unit=1)
    values = await client.async_read_holding(40345, 12)
    assert values[0] == 10240 and to_int16(values[10]) == -4000
    await client.async_write_register(40348, 2)
    await client.async_write_register(40355, -10000)
    await client.async_write_registers(40355, [-4000, 10000])
    assert inverter.writes == [
        (40348, [2]),
        (40355, [from_int16(-10000)]),
        (40355, [from_int16(-4000), 10000]),
    ]
    assert inverter.value(40348) == 2 and to_int16(inverter.value(40355)) == -4000
    # One connection for all of it.
    assert client._writer is not None
    await client.async_close()
    assert client._writer is None


async def test_the_inverter_refuses(inverter: FakeInverter) -> None:
    client = ModbusTcp("127.0.0.1", inverter.port)
    inverter.read_only.add(40348)
    with pytest.raises(ModbusError) as err:
        await client.async_write_register(40348, 2)
    assert err.value.code == "illegal_address"
    with pytest.raises(ModbusError) as err:
        await client.async_read_holding(50000, 2)
    assert err.value.code == "illegal_address"
    # Still usable afterwards.
    assert (await client.async_read_holding(40345, 1)) == [10240]
    await client.async_close()


async def test_a_dropped_connection_comes_back(inverter: FakeInverter) -> None:
    client = ModbusTcp("127.0.0.1", inverter.port)
    assert (await client.async_read_holding(40345, 1)) == [10240]
    inverter.drop_next = 1
    with pytest.raises(ModbusError) as err:
        await client.async_read_holding(40345, 1)
    assert err.value.code == "connect"
    assert (await client.async_read_holding(40345, 1)) == [10240]
    await client.async_close()


async def test_nobody_listens() -> None:
    client = ModbusTcp("127.0.0.1", 1, timeout=1)
    with pytest.raises(ModbusError) as err:
        await client.async_read_holding(40345, 1)
    assert err.value.code == "connect"


async def test_no_answer_is_a_timeout() -> None:
    async def silent(
        reader: asyncio.StreamReader, writer: asyncio.StreamWriter
    ) -> None:
        await reader.read(64)
        await asyncio.sleep(5)
        writer.close()

    server = await asyncio.start_server(silent, "127.0.0.1", 0)
    port = server.sockets[0].getsockname()[1]
    client = ModbusTcp("127.0.0.1", port, timeout=0.2)
    with pytest.raises(ModbusError) as err:
        await client.async_read_holding(40345, 1)
    assert err.value.code == "timeout"
    server.close()
    await server.wait_closed()


async def test_one_exchange_at_a_time(inverter: FakeInverter) -> None:
    client = ModbusTcp("127.0.0.1", inverter.port)
    results = await asyncio.gather(
        *(client.async_read_holding(40345, 1) for _ in range(5)),
        client.async_write_register(40350, 9900),
    )
    assert results[:5] == [[10240]] * 5
    assert inverter.value(40350) == 9900
    await client.async_close()
