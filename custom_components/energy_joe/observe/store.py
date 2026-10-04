"""Joe's history on disk: one file per month, so old months are never rewritten."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.storage import Store

from ..const import DOMAIN
from .records import day_key, merge

VERSION = 1
META_KEY = f"{DOMAIN}.history"
SAVE_DELAY = 60
# Months kept on disk; older ones are deleted. Joe keeps learning from the
# years, so this is long (a month is a few hundred kilobytes).
KEEP_MONTHS = 120
# Months kept in memory at once.
CACHED_MONTHS = 4


# 2: consumption is the balance of grid, sun and storage, like the Energy dashboard.
HOURS_FORMAT = 2


def _month(day: str) -> str:
    return day[:7]


class HistoryStore:
    """Days with their hour records, grouped into monthly storage files.

    A small index (the list of months and of days with hours) lives in its own
    file, so Joe knows what he has without reading every month.
    """

    def __init__(self, hass: HomeAssistant) -> None:
        """Set up the store; call async_load before use."""
        self._hass = hass
        self._meta: Store[dict[str, Any]] = Store(hass, VERSION, META_KEY)
        self._months: list[str] = []
        self._days: list[str] = []
        self._stores: dict[str, Store[dict[str, Any]]] = {}
        self._data: dict[str, dict[str, Any]] = {}
        self._dirty: dict[str, dict[str, Any]] = {}
        # How the hours were worked out (see HOURS_FORMAT); older ones are read again.
        self.format = HOURS_FORMAT
        # How many days back the recorder was read once (see observer.READ_BACK_DAYS).
        self.read_back = 0

    async def async_load(self) -> None:
        """Read the index and the two most recent months."""
        meta = await self._meta.async_load() or {}
        self._months = sorted(meta.get("months", []))
        self._days = sorted(meta.get("days", []))
        self.format = meta.get("format", 1 if self._days else HOURS_FORMAT)
        self.read_back = int(meta.get("read_back", 0))
        for month in self._months[-2:]:
            await self._async_month(month)

    async def async_unload(self) -> None:
        """Write everything that is still pending."""
        for month, data in self._dirty.items():
            await self._store(month).async_save(data)
        self._dirty = {}
        await self._meta.async_save(self._index())

    async def async_remove(self) -> None:
        """Delete all history files."""
        meta = await self._meta.async_load() or {}
        for month in set(meta.get("months", [])) | set(self._months):
            await self._store(month).async_remove()
        await self._meta.async_remove()
        self._months, self._days, self._stores, self._data = [], [], {}, {}

    @property
    def months(self) -> list[str]:
        return list(self._months)

    def overview(self) -> dict[str, Any]:
        """How much history there is."""
        return {
            "first_day": self._days[0] if self._days else None,
            "last_day": self._days[-1] if self._days else None,
            "day_count": len(self._days),
        }

    async def async_day(self, day: str) -> dict[str, Any] | None:
        """One day with its hours (None if Joe knows nothing about it)."""
        month = _month(day)
        if month not in self._months:
            return None
        return (await self._async_month(month))["days"].get(day)

    async def async_days(self, first: str, last: str) -> dict[str, dict[str, Any]]:
        """All known days from first to last (inclusive)."""
        result: dict[str, dict[str, Any]] = {}
        for month in self._months:
            if _month(first) <= month <= _month(last):
                for day, data in (await self._async_month(month))["days"].items():
                    if first <= day <= last:
                        result[day] = data
        return dict(sorted(result.items()))

    def latest_start(self) -> datetime | None:
        """Start of the most recent stored hour."""
        for day in reversed(self._days):
            data = self._data.get(_month(day), {}).get("days", {}).get(day, {})
            if hours := data.get("hours"):
                return datetime.fromisoformat(hours[-1]["start"])
        return None

    async def async_put_hours(
        self, records: list[dict[str, Any]], *, force: bool = False
    ) -> None:
        """Store hour records, merging them with what is already known.

        With force, read energies replace even complete live hours (after the
        user changed which sensors Joe reads); live context is kept.
        """
        for record in records:
            day = day_key(datetime.fromisoformat(record["start"]))
            data = await self._async_day_for_write(day)
            hours = data.setdefault("hours", [])
            for index, existing in enumerate(hours):
                if existing["start"] == record["start"]:
                    hours[index] = merge(existing, record, force=force)
                    break
            else:
                hours.append(record)
                hours.sort(key=lambda h: datetime.fromisoformat(h["start"]))
            if day not in self._days:
                self._days.append(day)
                self._days.sort()
            self._schedule(_month(day))
        if records:
            self._meta.async_delay_save(self._index, SAVE_DELAY)

    async def async_update_day(self, day: str, **fields: Any) -> None:
        """Set day-level facts (forecast, workday) without touching the hours."""
        data = await self._async_day_for_write(day)
        for name, value in fields.items():
            if isinstance(value, dict) and isinstance(data.get(name), dict):
                data[name].update(value)
            else:
                data[name] = value
        self._schedule(_month(day))

    def _index(self) -> dict[str, Any]:
        return {
            "months": self._months,
            "days": self._days,
            "format": self.format,
            "read_back": self.read_back,
        }

    def set_format(self, value: int) -> None:
        self.format = value
        self._meta.async_delay_save(self._index, SAVE_DELAY)

    def set_read_back(self, days: int) -> None:
        self.read_back = max(self.read_back, days)
        self._meta.async_delay_save(self._index, SAVE_DELAY)

    async def _async_day_for_write(self, day: str) -> dict[str, Any]:
        month = _month(day)
        if month not in self._months:
            self._months.append(month)
            self._months.sort()
            self._prune()
            self._meta.async_delay_save(self._index, SAVE_DELAY)
        return (await self._async_month(month))["days"].setdefault(day, {})

    async def _async_month(self, month: str) -> dict[str, Any]:
        if month in self._data:
            # Most recently used last.
            self._data[month] = self._data.pop(month)
            return self._data[month]
        stored = await self._store(month).async_load()
        self._data[month] = stored or {"days": {}}
        while len(self._data) > CACHED_MONTHS:
            oldest = next(iter(self._data))
            # A pending save keeps its own reference to the data.
            del self._data[oldest]
        return self._data[month]

    def _store(self, month: str) -> Store[dict[str, Any]]:
        if month not in self._stores:
            self._stores[month] = Store(self._hass, VERSION, f"{META_KEY}.{month}")
        return self._stores[month]

    @callback
    def _schedule(self, month: str) -> None:
        data = self._data[month]
        self._dirty[month] = data
        self._store(month).async_delay_save(
            lambda: self._saved(month, data), SAVE_DELAY
        )

    def _saved(self, month: str, data: dict[str, Any]) -> dict[str, Any]:
        if self._dirty.get(month) is data:
            del self._dirty[month]
        return data

    @callback
    def _prune(self) -> None:
        while len(self._months) > KEEP_MONTHS:
            month = self._months.pop(0)
            self._data.pop(month, None)
            self._days = [d for d in self._days if _month(d) != month]
            self._hass.async_create_task(self._store(month).async_remove())
