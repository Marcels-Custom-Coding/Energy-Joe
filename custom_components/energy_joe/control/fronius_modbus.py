"""A Fronius GEN24's battery control over Modbus TCP (SunSpec model 124).

The inverter offers a "Basic Storage Control" model: the reference power
WChaMax (what its percentages stand for, the battery's own figure), the
control bits StorCtl_Mod (bit 0: the charge rate counts, bit 1: the
discharge rate counts), the reserve MinRsvPct, the level ChaState, the rates
OutWRte and InWRte in percent of WChaMax (a negative discharge rate charges
from the grid: the only way to charge with a power of one's own), and
ChaGriSet (charging from the grid allowed). Values carry scale factors
(10000 = 100.00 %), which the inverter may change, so Joe reads them with
every reading. A value the inverter does not support is a sentinel
(0xFFFF, 0x8000).

The model is laid out the same whether the inverter is set to "int + SF" or
"float": with "int + SF" it sits at 40343, with "float" ten registers later
(the inverter model before it is longer). Joe looks at both. Addresses are
protocol addresses, as Home Assistant's modbus integration counts them (the
Fronius tables count one higher). The nameplate (model 120) 222 registers
before it tells the inverter's own rating; the common model (model 1) at
40002 its type, firmware and serial number.

Checked against the Fronius register maps "GEN24 Plus Modbus SunSpec Maps"
1.2.7-2 and the Fronius Modbus manual (October 2026).
"""

from __future__ import annotations

from dataclasses import dataclass, field
import logging
from typing import Any

from .modbus_tcp import ModbusError, ModbusTcp, to_int16

_LOGGER = logging.getLogger(__name__)

MODEL = 124
MODEL_LENGTH = 24
# Where the model's id may sit: "int + SF", then "float".
BASES = (40343, 40353)
# The nameplate's id, counted from the storage model's.
NAMEPLATE = -222
NAMEPLATE_MODEL = 120
# The common model's data (strings, two characters a register).
COMMON_MODEL = 40020
COMMON_VERSION = 40044
COMMON_SERIAL = 40052
# Registers relative to the model's id.
ID, LENGTH = 0, 1
WCHAMAX, WCHAGRA, WDISCHAGRA, STORCTL_MOD, VACHAMAX = 2, 3, 4, 5, 6
MINRSVPCT, CHASTATE, STORAVAL, INBATV, CHAST = 7, 8, 9, 10, 11
OUTWRTE, INWRTE, WINTMS, RVRTTMS, RMPTMS, CHAGRISET = 12, 13, 14, 15, 16, 17
WCHAMAX_SF, WCHADISCHAGRA_SF, VACHAMAX_SF, MINRSVPCT_SF = 18, 19, 20, 21
CHASTATE_SF, STORAVAL_SF, INBATV_SF, INOUTWRTE_SF = 22, 23, 24, 25
# Nameplate fields relative to its id: the rating and its scale factor.
WRTG, WRTG_SF = 3, 4
# StorCtl_Mod bits.
CHARGE_BIT, DISCHARGE_BIT = 1, 2
# Sentinels of values the inverter does not support.
NOT_UINT16, NOT_INT16 = 0xFFFF, 0x8000
# ChaSt as the panel names it.
STATES = {
    1: "off",
    2: "empty",
    3: "discharging",
    4: "charging",
    5: "full",
    6: "holding",
    7: "testing",
}
# Fields Joe writes, with the register and whether it is a percentage.
WRITABLE = {
    "control": (STORCTL_MOD, False),
    "reserve": (MINRSVPCT, True),
    "discharge_rate": (OUTWRTE, True),
    "charge_rate": (INWRTE, True),
    "grid_charging": (CHAGRISET, False),
    "revert_s": (RVRTTMS, False),
}


class NotFound(Exception):
    """No storage control model at the places Joe looks."""


def inverter_slug(host: str, port: int = 502, unit: int = 1) -> str:
    """The inverter's mark in the unique ids of Joe's entities for it."""
    text = f"{host}_{port}_{unit}".lower()
    return "".join(ch if ch.isalnum() else "_" for ch in text)


def _text(registers: list[int]) -> str:
    """A SunSpec string: two characters a register, ended by a zero."""
    raw = b"".join(bytes(((r >> 8) & 0xFF, r & 0xFF)) for r in registers)
    return raw.split(b"\0", 1)[0].decode("ascii", "replace").strip()


def _sf(raw: int) -> int | None:
    """A scale factor, None where the inverter does not support the value."""
    return None if raw == NOT_INT16 else to_int16(raw)


def _scaled(raw: int, sf: int | None, signed: bool = False) -> float | None:
    """A register with its scale factor as a number (divided, not multiplied
    by a fraction: 1120 with -2 is 11.2, not 11.200000000000001)."""
    if sf is None or raw == (NOT_INT16 if signed else NOT_UINT16):
        return None
    value = to_int16(raw) if signed else raw
    if sf < 0:
        return round(value / 10 ** (-sf), -sf)
    return float(value * 10**sf)


@dataclass(frozen=True, slots=True)
class Layout:
    """Where the model sits and what the inverter says about itself."""

    base: int
    kind: str  # "int_sf" or "float"
    model: str = ""
    version: str = ""
    serial: str = ""
    # The inverter's own rating (W), None where it does not say.
    inverter_w: float | None = None

    def address(self, field: int) -> int:
        return self.base + field

    def as_dict(self) -> dict[str, Any]:
        return {
            "base": self.base,
            "kind": self.kind,
            "model": self.model,
            "version": self.version,
            "serial": self.serial,
            "inverter_w": self.inverter_w,
        }


@dataclass(frozen=True, slots=True)
class Reading:
    """The model's values as numbers Joe uses (None: not supported)."""

    max_power_w: float | None
    control: int
    reserve_pct: float | None
    level_pct: float | None
    status: str
    discharge_rate_pct: float | None
    charge_rate_pct: float | None
    revert_s: int | None
    grid_charging: bool
    # The scale factors of this reading (writes follow them).
    scale: dict[str, int | None] = field(default_factory=dict)

    @property
    def charge_limited(self) -> bool:
        return bool(self.control & CHARGE_BIT)

    @property
    def discharge_limited(self) -> bool:
        return bool(self.control & DISCHARGE_BIT)

    def as_dict(self) -> dict[str, Any]:
        return {
            "max_power_w": self.max_power_w,
            "control": self.control,
            "charge_limited": self.charge_limited,
            "discharge_limited": self.discharge_limited,
            "reserve_pct": self.reserve_pct,
            "level_pct": self.level_pct,
            "status": self.status,
            "discharge_rate_pct": self.discharge_rate_pct,
            "charge_rate_pct": self.charge_rate_pct,
            "revert_s": self.revert_s,
            "grid_charging": self.grid_charging,
        }


class Gen24Storage:
    """One inverter's storage control."""

    def __init__(self, client: ModbusTcp) -> None:
        self.client = client
        self.layout: Layout | None = None
        self.last: Reading | None = None

    async def async_detect(self) -> Layout:
        """Find the model and what the inverter says about itself (raises
        NotFound, ModbusError)."""
        for base in BASES:
            try:
                head = await self.client.async_read_holding(base, 2)
            except ModbusError as err:
                if err.code != "illegal_address":
                    raise
                continue
            if head[0] != MODEL:
                continue
            self.layout = Layout(
                base=base,
                kind="int_sf" if base == BASES[0] else "float",
                inverter_w=await self._async_rating(base),
                **await self._async_common(),
            )
            return self.layout
        raise NotFound

    async def _async_rating(self, base: int) -> float | None:
        """The inverter's rating from the nameplate, if it is where expected."""
        try:
            head = await self.client.async_read_holding(base + NAMEPLATE, WRTG_SF + 1)
        except ModbusError as err:
            if err.code in ("illegal_address", "illegal_value"):
                return None
            raise
        if head[ID] != NAMEPLATE_MODEL:
            return None
        return _scaled(head[WRTG], _sf(head[WRTG_SF]))

    async def _async_common(self) -> dict[str, str]:
        """Type, firmware and serial number from the common model."""
        try:
            model = await self.client.async_read_holding(COMMON_MODEL, 16)
            version = await self.client.async_read_holding(COMMON_VERSION, 8)
            serial = await self.client.async_read_holding(COMMON_SERIAL, 16)
        except ModbusError as err:
            if err.code in ("illegal_address", "illegal_value"):
                return {}
            raise
        return {
            "model": _text(model),
            "version": _text(version),
            "serial": _text(serial),
        }

    async def async_read(self) -> Reading:
        """Every value of the model (detects the layout first when needed)."""
        layout = self.layout or await self.async_detect()
        raw = await self.client.async_read_holding(layout.base, MODEL_LENGTH + 2)
        scale = {
            "power": _sf(raw[WCHAMAX_SF]),
            "percent": _sf(raw[MINRSVPCT_SF]),
            "level": _sf(raw[CHASTATE_SF]),
            "rate": _sf(raw[INOUTWRTE_SF]),
        }
        control = raw[STORCTL_MOD]
        self.last = Reading(
            max_power_w=_scaled(raw[WCHAMAX], scale["power"]),
            control=0 if control == NOT_UINT16 else control & 3,
            reserve_pct=_scaled(raw[MINRSVPCT], scale["percent"]),
            level_pct=_scaled(raw[CHASTATE], scale["level"]),
            status=STATES.get(raw[CHAST], "unknown"),
            discharge_rate_pct=_scaled(raw[OUTWRTE], scale["rate"], signed=True),
            charge_rate_pct=_scaled(raw[INWRTE], scale["rate"], signed=True),
            revert_s=None if raw[RVRTTMS] == NOT_UINT16 else raw[RVRTTMS],
            grid_charging=raw[CHAGRISET] == 1,
            scale=scale,
        )
        return self.last

    async def async_write(self, field: str, value: float | int | bool) -> None:
        """One field as Joe means it (percent, bits, seconds, on/off); the
        register value follows the inverter's scale factors. Raises
        ModbusError (the inverter refuses a value with "illegal_value")."""
        layout = self.layout or await self.async_detect()
        register, percent = WRITABLE[field]
        if field == "grid_charging":
            raw = 1 if value else 0
        elif percent:
            scale = (self.last or await self.async_read()).scale
            sf = scale["rate"] if field.endswith("_rate") else scale["percent"]
            if sf is None:
                raise ModbusError("illegal_value", f"{field} not supported")
            raw = round(float(value) / 10**sf)
            if field == "reserve":
                raw = max(0, min(round(100 / 10**sf), raw))
            else:
                limit = round(100 / 10**sf)
                raw = max(-limit, min(limit, raw))
        else:
            raw = int(value)
        await self.client.async_write_register(layout.address(register), raw)

    async def async_set_control(
        self, charge: bool | None = None, discharge: bool | None = None
    ) -> int:
        """The control bits, one or both, the other as it is; returns the new value."""
        reading = await self.async_read()
        control = reading.control
        if charge is not None:
            control = (control | CHARGE_BIT) if charge else (control & ~CHARGE_BIT)
        if discharge is not None:
            control = (
                (control | DISCHARGE_BIT) if discharge else (control & ~DISCHARGE_BIT)
            )
        if control != reading.control:
            await self.async_write("control", control)
        return control
