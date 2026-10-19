"""A Modbus TCP server for the tests: holding registers in a dict, functions
3, 6 and 16, exceptions on request (illegal addresses, refused writes)."""

from __future__ import annotations

import asyncio
import struct
from typing import Any

_HEADER = struct.Struct(">HHHB")


class FakeInverter:
    """Registers as a dict (protocol addresses); every write is recorded."""

    def __init__(self, registers: dict[int, int] | None = None) -> None:
        self.registers: dict[int, int] = dict(registers or {})
        self.writes: list[tuple[int, list[int]]] = []
        # Addresses whose writes the inverter refuses (exception 2).
        self.read_only: set[int] = set()
        # Drop the connection instead of answering (once per entry).
        self.drop_next = 0
        self.unit = 1
        self.server: asyncio.AbstractServer | None = None
        self.port = 0
        self._writers: set[asyncio.StreamWriter] = set()

    async def start(self) -> None:
        self.server = await asyncio.start_server(self._handle, "127.0.0.1", 0)
        self.port = self.server.sockets[0].getsockname()[1]

    async def stop(self) -> None:
        # Connections still open (Joe keeps his) would hold wait_closed forever.
        for writer in list(self._writers):
            writer.close()
        if self.server:
            self.server.close()
            await self.server.wait_closed()

    async def _handle(
        self, reader: asyncio.StreamReader, writer: asyncio.StreamWriter
    ) -> None:
        self._writers.add(writer)
        try:
            while True:
                try:
                    header = await reader.readexactly(_HEADER.size)
                except asyncio.IncompleteReadError:
                    return
                transaction, protocol, length, unit = _HEADER.unpack(header)
                pdu = await reader.readexactly(length - 1)
                if self.drop_next:
                    self.drop_next -= 1
                    writer.close()
                    return
                answer = self._answer(pdu)
                writer.write(
                    _HEADER.pack(transaction, protocol, len(answer) + 1, unit) + answer
                )
                await writer.drain()
        finally:
            self._writers.discard(writer)
            writer.close()

    def _answer(self, pdu: bytes) -> bytes:
        function = pdu[0]
        if function == 3:
            address, count = struct.unpack(">HH", pdu[1:5])
            if any(a not in self.registers for a in range(address, address + count)):
                return bytes([function | 0x80, 2])
            values = [self.registers[a] for a in range(address, address + count)]
            return bytes([3, count * 2]) + struct.pack(f">{count}H", *values)
        if function == 6:
            address, value = struct.unpack(">HH", pdu[1:5])
            if address in self.read_only or address not in self.registers:
                return bytes([function | 0x80, 2])
            self.registers[address] = value
            self.writes.append((address, [value]))
            return pdu
        if function == 16:
            address, count, _ = struct.unpack(">HHB", pdu[1:6])
            values = list(struct.unpack(f">{count}H", pdu[6 : 6 + count * 2]))
            targets = range(address, address + count)
            if any(a in self.read_only or a not in self.registers for a in targets):
                return bytes([function | 0x80, 2])
            for a, v in zip(targets, values, strict=True):
                self.registers[a] = v
            self.writes.append((address, values))
            return bytes([16]) + struct.pack(">HH", address, count)
        return bytes([function | 0x80, 1])

    def value(self, address: int) -> Any:
        return self.registers.get(address)
