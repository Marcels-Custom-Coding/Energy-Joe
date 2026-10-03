"""When Joe plans: a preview every hour, the plan itself shortly before the window."""

from __future__ import annotations

from collections.abc import Callable
from datetime import datetime, timedelta
import logging
from typing import Any

from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers.event import (
    async_track_point_in_time,
    async_track_time_change,
)
from homeassistant.util import dt as dt_util

from ..observe.store import HistoryStore
from .inputs import async_build_input, next_window
from .planner import make_plan

_LOGGER = logging.getLogger(__name__)


class JoePlanner:
    """Keeps tonight's plan up to date and fixes it shortly before the window."""

    def __init__(
        self, hass: HomeAssistant, history: HistoryStore, changed: Callable[[], None]
    ) -> None:
        """Set up; call async_start with a configuration to begin."""
        self._hass = hass
        self._history = history
        self._changed = changed
        self._config: dict[str, Any] = {}
        self._unsubs: list[CALLBACK_TYPE] = []
        self._commit: CALLBACK_TYPE | None = None
        self._fixed: dict[str, Any] | None = None
        self.plan: dict[str, Any] | None = None

    @property
    def active(self) -> bool:
        return bool(self._unsubs)

    async def async_start(self, config: dict[str, Any]) -> None:
        """Plan with this configuration (restarts if already running)."""
        await self.async_stop()
        self._config = config
        self._unsubs.append(
            async_track_time_change(self._hass, self._on_tick, minute=5, second=0)
        )
        await self._async_restore()
        await self.async_refresh()
        self._schedule_commit()

    async def async_stop(self) -> None:
        for unsub in self._unsubs:
            unsub()
        self._unsubs = []
        if self._commit:
            self._commit()
            self._commit = None
        self._fixed = None
        if self.plan is not None:
            self.plan = None
            self._changed()

    async def async_update(self, config: dict[str, Any]) -> None:
        """The rules or the tariff changed: plan again."""
        self._config = config
        await self.async_refresh()
        self._schedule_commit()

    async def async_refresh(self) -> dict[str, Any] | None:
        """Plan again now; a fixed plan stays until its window is over."""
        now = dt_util.now()
        if self._fixed is not None:
            if datetime.fromisoformat(self._fixed["window"]["end"]) > now:
                self.plan = self._fixed
                self._changed()
                return self.plan
            self._fixed = None
        try:
            self.plan = await self._async_compute(now)
        except Exception:
            _LOGGER.exception("Planning failed")
            self.plan = {
                "kind": "unavailable",
                "reasons": ["failed"],
                "created": now.isoformat(timespec="seconds"),
            }
        self._changed()
        return self.plan

    async def _async_compute(self, now: datetime) -> dict[str, Any]:
        inp, notes = await async_build_input(
            self._hass, self._config, self._history, now
        )
        if inp is None:
            return {
                "kind": "unavailable",
                "reasons": notes,
                "created": now.isoformat(timespec="seconds"),
            }
        return make_plan(inp)

    async def _async_restore(self) -> None:
        """After a restart during the night, the fixed plan is still the plan."""
        tariff = self._config["tariff"]
        if tariff["kind"] != "fixed_window" or not tariff["window"]:
            return
        start, end = next_window(dt_util.now(), tariff["window"])
        day = await self._history.async_day(start.date().isoformat())
        plan = (day or {}).get("plan")
        if (
            plan
            and plan.get("fixed")
            and datetime.fromisoformat(plan["window"]["end"]) > dt_util.now()
        ):
            self._fixed = plan

    @callback
    def _on_tick(self, now: datetime) -> None:
        self._hass.async_create_task(self.async_refresh(), eager_start=False)

    @callback
    def _schedule_commit(self) -> None:
        if self._commit:
            self._commit()
            self._commit = None
        tariff = self._config["tariff"]
        if tariff["kind"] != "fixed_window" or not tariff["window"]:
            return
        offset = timedelta(minutes=self._config["rules"]["plan_offset_min"])
        now = dt_util.now()
        start, _ = next_window(now, tariff["window"])
        moment = start - offset
        if moment <= now:
            if now < start and self._fixed is None:
                # Started just before the window: fix tonight's plan right away.
                moment = now + timedelta(seconds=1)
            else:
                # This window is fixed already (or running): the next one.
                moment += timedelta(days=1)
        self._commit = async_track_point_in_time(self._hass, self._on_commit, moment)

    @callback
    def _on_commit(self, now: datetime) -> None:
        self._commit = None
        self._hass.async_create_task(self._async_fix(), eager_start=False)

    async def _async_fix(self) -> None:
        """Fix tonight's plan and keep it for the evaluation."""
        self._fixed = None
        plan = await self.async_refresh()
        if plan and plan.get("kind") != "unavailable":
            plan["fixed"] = True
            self._fixed = plan
            night = datetime.fromisoformat(plan["window"]["start"]).date().isoformat()
            await self._history.async_update_day(night, plan=plan)
            self._changed()
        self._schedule_commit()
