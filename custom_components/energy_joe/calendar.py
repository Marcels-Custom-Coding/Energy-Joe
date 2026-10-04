"""A calendar per car charged by need: its trips, editable in Home Assistant."""

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
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from .entity import JoeEntity
from .plan.car_calendar import as_text, parse_when
from .runtime import DATA_RUNTIME, JoeRuntime


def car_actions(config: dict[str, Any]) -> list[dict[str, Any]]:
    """Night actions that charge a car by need: each has a calendar."""
    return [
        a
        for a in config["actions"]
        if a["kind"] == "switch" and (a.get("need") or {}).get("enabled")
    ]


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    runtime = hass.data[DATA_RUNTIME]
    await runtime.calendars.async_load()
    known: set[str] = set()

    @callback
    def add_cars(_: Any = None) -> None:
        """A car switched to charging by need gets its calendar right away."""
        new = [a for a in car_actions(runtime.config) if a["id"] not in known]
        known.update(a["id"] for a in new)
        if new:
            async_add_entities([JoeCarCalendar(runtime, entry, a["id"]) for a in new])

    add_cars()
    entry.async_on_unload(runtime.async_subscribe(add_cars))


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
    """The trips of one car: by hand, or from invitations to the car's address."""

    _attr_supported_features = (
        CalendarEntityFeature.CREATE_EVENT
        | CalendarEntityFeature.DELETE_EVENT
        | CalendarEntityFeature.UPDATE_EVENT
    )

    def __init__(self, runtime: JoeRuntime, entry: ConfigEntry, action_id: str) -> None:
        super().__init__(runtime, entry, "car_calendar")
        self.action_id = action_id
        self._attr_unique_id = f"{entry.entry_id}_calendar_{action_id}"
        self._attr_translation_placeholders = {"car": self._name()}

    def _action(self) -> dict[str, Any] | None:
        return next(
            (a for a in car_actions(self.runtime.config) if a["id"] == self.action_id),
            None,
        )

    def _name(self) -> str:
        action = self._action()
        return action["name"] if action else self.action_id

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        self.async_on_remove(self.runtime.calendars.listen(self.async_write_ha_state))

    @property
    def available(self) -> bool:
        return self._action() is not None

    @property
    def event(self) -> CalendarEvent | None:
        """The current or next appointment."""
        now = dt_util.now()
        upcoming = self.runtime.calendars.events(self.action_id, now)
        return _event(upcoming[0]) if upcoming else None

    async def async_get_events(
        self, hass: HomeAssistant, start_date: datetime, end_date: datetime
    ) -> list[CalendarEvent]:
        return [
            _event(e)
            for e in self.runtime.calendars.events(self.action_id, start_date, end_date)
        ]

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
