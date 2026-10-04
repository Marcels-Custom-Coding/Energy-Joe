"""Joe's calendar for each car whose mailbox has no calendar of its own.

Invitations to the car's address land here; appointments can also be added
by hand in Home Assistant. A car that reads a finished calendar or its
account's calendar needs none: its entity goes away once no trip entered by
hand is still to come (the appointments stay stored in case the car comes
back to its mailbox).
"""

from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import Any

from homeassistant.components.calendar import (
    EVENT_DESCRIPTION,
    EVENT_END,
    EVENT_LOCATION,
    EVENT_START,
    EVENT_SUMMARY,
    CalendarEntity,
    CalendarEntityFeature,
    CalendarEvent,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from .entity import JoeEntity
from .plan.car_calendar import as_text, calendar_cars, own_events, parse_when
from .runtime import DATA_RUNTIME, JoeRuntime


def unique_id(entry_id: str, car: str) -> str:
    return f"{entry_id}_calendar_{car}"


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    runtime = hass.data[DATA_RUNTIME]
    await runtime.calendars.async_load()
    known: set[str] = set()
    last: list[set[str]] = []

    @callback
    def sync_cars(_: Any = None) -> None:
        """A car switched to its own mailbox gets Joe's calendar right away."""
        wanted = {a["id"] for a in calendar_cars(runtime.config, runtime.calendars)}
        if last and last[0] == wanted:
            return
        last[:] = [wanted]
        new = wanted - known
        known.update(new)
        if new:
            async_add_entities(
                [JoeCarCalendar(runtime, entry, car) for car in sorted(new)]
            )
        registry = er.async_get(hass)
        prefix = unique_id(entry.entry_id, "")
        for item in er.async_entries_for_config_entry(registry, entry.entry_id):
            if item.domain != "calendar" or not item.unique_id.startswith(prefix):
                continue
            car = item.unique_id.removeprefix(prefix)
            if car not in wanted:
                known.discard(car)
                registry.async_remove(item.entity_id)

    sync_cars()
    entry.async_on_unload(runtime.async_subscribe(sync_cars))
    # The last trip entered by hand deleted or over: the calendar may go.
    entry.async_on_unload(runtime.calendars.listen(sync_cars))


def _event(entry: dict[str, Any]) -> CalendarEvent:
    return CalendarEvent(
        start=parse_when(entry["start"]),
        end=parse_when(entry["end"]),
        summary=entry.get("summary") or "",
        description=entry.get("description") or None,
        location=entry.get("location") or None,
        uid=entry["uid"],
    )


def _fields(event: dict[str, Any]) -> dict[str, Any]:
    """Home Assistant's event fields as Joe stores them."""
    start, end = event[EVENT_START], event[EVENT_END]
    if isinstance(start, datetime) != isinstance(end, datetime):
        raise HomeAssistantError("Start and end must both be times or both days")
    if end <= start:
        if isinstance(start, date) and not isinstance(start, datetime):
            end = start + timedelta(days=1)
        else:
            raise HomeAssistantError("The end must be after the start")
    return {
        "summary": event.get(EVENT_SUMMARY) or "",
        "start": as_text(start),
        "end": as_text(end),
        "location": event.get(EVENT_LOCATION) or "",
        "description": event.get(EVENT_DESCRIPTION) or "",
    }


class JoeCarCalendar(JoeEntity, CalendarEntity):
    """The trips of one car: from invitations to the car's address, or by hand."""

    _attr_supported_features = (
        CalendarEntityFeature.CREATE_EVENT
        | CalendarEntityFeature.DELETE_EVENT
        | CalendarEntityFeature.UPDATE_EVENT
    )

    def __init__(self, runtime: JoeRuntime, entry: ConfigEntry, action_id: str) -> None:
        super().__init__(runtime, entry, "car_calendar")
        self.action_id = action_id
        self._attr_unique_id = unique_id(entry.entry_id, action_id)
        self._attr_translation_placeholders = {"car": self._name()}

    def _action(self) -> dict[str, Any] | None:
        return next(
            (
                a
                for a in calendar_cars(self.runtime.config, self.runtime.calendars)
                if a["id"] == self.action_id
            ),
            None,
        )

    def _name(self) -> str:
        action = self._action()
        return action["name"] if action else self.action_id

    _removed = False

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        self._removed = False
        self.async_on_remove(self.runtime.calendars.listen(self._on_change))

    async def async_will_remove_from_hass(self) -> None:
        self._removed = True
        await super().async_will_remove_from_hass()

    @callback
    def _on_state(self, state: dict[str, Any]) -> None:
        self._on_change()

    @callback
    def _on_change(self) -> None:
        # Joe calls his listeners from a copied list: one may still come in
        # right after the car switched away, and would leave a timer behind.
        if not self._removed:
            self.async_write_ha_state()

    @property
    def available(self) -> bool:
        return self._action() is not None

    def _events(
        self, start: datetime | None = None, end: datetime | None = None
    ) -> list[dict[str, Any]]:
        """The appointments that count for the car (see own_events)."""
        action = self._action()
        if action is None:
            return []
        stored = self.runtime.calendars.events(self.action_id, start, end)
        return own_events(action["need"], stored)

    @property
    def event(self) -> CalendarEvent | None:
        """The current or next appointment."""
        upcoming = self._events(dt_util.now())
        return _event(upcoming[0]) if upcoming else None

    async def async_get_events(
        self, hass: HomeAssistant, start_date: datetime, end_date: datetime
    ) -> list[CalendarEvent]:
        return [_event(e) for e in self._events(start_date, end_date)]

    async def async_create_event(self, **kwargs: Any) -> None:
        self.runtime.calendars.add(self.action_id, _fields(kwargs))

    async def async_update_event(
        self,
        uid: str,
        event: dict[str, Any],
        recurrence_id: str | None = None,
        recurrence_range: str | None = None,
    ) -> None:
        if self.runtime.calendars.update(self.action_id, uid, _fields(event)) is None:
            raise HomeAssistantError(f"No appointment {uid}")

    async def async_delete_event(
        self,
        uid: str,
        recurrence_id: str | None = None,
        recurrence_range: str | None = None,
    ) -> None:
        if not self.runtime.calendars.delete(self.action_id, uid):
            raise HomeAssistantError(f"No appointment {uid}")
