"""A small Modbus TCP client: holding registers read and written, nothing else.

Joe talks to an inverter directly (SunSpec over Modbus TCP) so that the owner
needs neither YAML nor helpers: the inverter's address, port 502 and its
unit id are all it takes. One connection per inverter, kept open and opened
again when it drops; one exchange at a time (a lock), each with a timeout.
Errors come back as ModbusError with a short code the panel can explain.
"""

from __future__ import annotations

import asyncio
import logging
import struct

_LOGGER = logging.getLogger(__name__)

# Seconds for connecting and for one exchange.
TIMEOUT = 5.0
# Modbus exception codes, as the panel names them.
EXCEPTIONS = {
    1: "illegal_function",
    2: "illegal_address",
    3: "illegal_value",
    4: "device_failure",
    6: "busy",
}
_HEADER = struct.Struct(">HHHB")
# Most registers one request may read (the protocol allows 125).
MAX_READ = 120


class ModbusError(Exception):
    """A failed exchange with a short code: connect, timeout, protocol, or
    the inverter's own exception (illegal_address, illegal_value, ...)."""

    def __init__(self, code: str, detail: str = "") -> None:
        super().__init__(f"{code}: {detail}" if detail else code)
        self.code = code
        self.detail = detail


def to_int16(value: int) -> int:
    """A register's two's complement as a signed number."""
    value &= 0xFFFF
    return value - 0x10000 if value >= 0x8000 else value


def from_int16(value: int) -> int:
    """A signed number as a register (two's complement)."""
    if not -0x8000 <= value <= 0xFFFF:
        raise ValueError(f"not a 16-bit value: {value}")
    return value & 0xFFFF


class ModbusTcp:
    """One inverter over Modbus TCP."""

    def __init__(
        self, host: str, port: int = 502, unit: int = 1, timeout: float = TIMEOUT
    ) -> None:
        self.host = host
        self.port = port
        self.unit = unit
        self.timeout = timeout
        self._reader: asyncio.StreamReader | None = None
        self._writer: asyncio.StreamWriter | None = None
        self._lock = asyncio.Lock()
        self._transaction = 0

    @property
    def key(self) -> str:
        return f"{self.host}:{self.port}/{self.unit}"

    async def async_close(self) -> None:
        """Drop the connection (the inverter forgets nothing by that)."""
        async with self._lock:
            await self._async_drop()

    async def async_read_holding(self, address: int, count: int) -> list[int]:
        """`count` holding registers from `address` (protocol addresses, as
        Home Assistant's modbus integration counts them)."""
        if not 1 <= count <= MAX_READ:
            raise ValueError(f"count out of range: {count}")
        async with self._lock:
            data = await self._async_exchange(3, struct.pack(">HH", address, count))
        if len(data) < 1 or data[0] != count * 2 or len(data) != 1 + count * 2:
            raise ModbusError("protocol", "short read")
        return list(struct.unpack(f">{count}H", data[1:]))

    async def async_write_register(self, address: int, value: int) -> None:
        """One holding register (function 6); `value` 0..65535 or signed."""
        raw = from_int16(value)
        async with self._lock:
            data = await self._async_exchange(6, struct.pack(">HH", address, raw))
        if data != struct.pack(">HH", address, raw):
            raise ModbusError("protocol", "write not echoed")

    async def async_write_registers(self, address: int, values: list[int]) -> None:
        """Several holding registers in a row (function 16)."""
        if not 1 <= len(values) <= 120:
            raise ValueError("values out of range")
        raw = [from_int16(v) for v in values]
        body = struct.pack(">HHB", address, len(raw), len(raw) * 2) + struct.pack(
            f">{len(raw)}H", *raw
        )
        async with self._lock:
            data = await self._async_exchange(16, body)
        if data != struct.pack(">HH", address, len(raw)):
            raise ModbusError("protocol", "write not echoed")

    # --- the wire -----------------------------------------------------------------

    async def _async_connect(self) -> None:
        if self._writer is not None and not self._writer.is_closing():
            return
        try:
            async with asyncio.timeout(self.timeout):
                self._reader, self._writer = await asyncio.open_connection(
                    self.host, self.port
                )
        except TimeoutError as err:
            raise ModbusError("timeout", "connect") from err
        except OSError as err:
            raise ModbusError("connect", str(err)) from err

    async def _async_drop(self) -> None:
        writer, self._reader, self._writer = self._writer, None, None
        if writer is None:
            return
        writer.close()
        try:
            async with asyncio.timeout(1):
                await writer.wait_closed()
        except TimeoutError, OSError:
            pass

    async def _async_exchange(self, function: int, body: bytes) -> bytes:
        """One request and its answer (the PDU's data after the function
        code); the connection is opened as needed and dropped on any error."""
        await self._async_connect()
        assert self._reader is not None and self._writer is not None
        self._transaction = (self._transaction + 1) & 0xFFFF
        pdu = bytes([function]) + body
        try:
            async with asyncio.timeout(self.timeout):
                self._writer.write(
                    _HEADER.pack(self._transaction, 0, len(pdu) + 1, self.unit) + pdu
                )
                await self._writer.drain()
                header = await self._reader.readexactly(_HEADER.size)
                transaction, protocol, length, unit = _HEADER.unpack(header)
                if length < 2:
                    raise ModbusError("protocol", "short answer")
                answer = await self._reader.readexactly(length - 1)
        except TimeoutError as err:
            await self._async_drop()
            raise ModbusError("timeout", "no answer") from err
        except (OSError, asyncio.IncompleteReadError) as err:
            await self._async_drop()
            raise ModbusError("connect", str(err)) from err
        except ModbusError:
            await self._async_drop()
            raise
        if transaction != self._transaction or protocol != 0 or unit != self.unit:
            await self._async_drop()
            raise ModbusError("protocol", "answer out of order")
        if answer[0] == function | 0x80:
            code = answer[1] if len(answer) > 1 else 0
            raise ModbusError(EXCEPTIONS.get(code, f"exception_{code}"))
        if answer[0] != function:
            await self._async_drop()
            raise ModbusError("protocol", "wrong function")
        return answer[1:]
