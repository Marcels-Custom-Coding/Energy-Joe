"""Every hour Joe looks back: replay finished plans, learn, sum up what they brought."""

from __future__ import annotations

from collections.abc import Callable
from datetime import date, datetime, timedelta
import logging
from typing import Any

from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers.event import async_track_time_change
from homeassistant.util import dt as dt_util

from .. import model
from ..observe.store import HistoryStore
from .evaluate import evaluate
from .learning import buffer, results, solar_factor, solar_shift

_LOGGER = logging.getLogger(__name__)

# Days Joe learns from, and how far back he sums up what plans brought.
LEARN_DAYS = 28
BUFFER_EVALUATIONS = 21
RESULT_DAYS = 400


class JoeLearner:
    """Evaluates fixed plans once their day is over and keeps the learned values fresh."""

    def __init__(
        self,
        hass: HomeAssistant,
        history: HistoryStore,
        config: Callable[[], dict[str, Any]],
        update: Callable[[dict[str, Any], str], None],
        changed: Callable[[], None],
    ) -> None:
        """Set up; call async_start to begin."""
        self._hass = hass
        self._history = history
        self._config = config
        self._update = update
        self._changed = changed
        self._unsubs: list[CALLBACK_TYPE] = []
        self._evaluated: dict[str, dict[str, Any]] = {}
        self.results: dict[str, Any] | None = None

    @property
    def active(self) -> bool:
        return bool(self._unsubs)

    async def async_start(self) -> None:
        await self.async_stop()
        self._unsubs.append(
            async_track_time_change(self._hass, self._on_tick, minute=10, second=0)
        )
        await self._async_load_results()
        await self.async_run()

    async def async_stop(self) -> None:
        for unsub in self._unsubs:
            unsub()
        self._unsubs = []

    @callback
    def _on_tick(self, now: datetime) -> None:
        self._hass.async_create_task(self.async_run(), eager_start=False)

    async def _async_load_results(self) -> None:
        """All evaluations since learning (re)started, for the running total."""
        today = dt_util.now().date()
        since = self._config()["learned"]["since"]
        first = (today - timedelta(days=RESULT_DAYS)).isoformat()
        if since and since[:10] > first:
            first = since[:10]
        days = await self._history.async_days(first, today.isoformat())
        self._evaluated = {
            day: {"evaluation": data["evaluation"]}
            for day, data in days.items()
            if data.get("evaluation")
        }
        self.results = results(self._evaluated, since)
        self._changed()

    async def async_run(self) -> None:
        """Evaluate what is due, learn from the last weeks, update the totals."""
        try:
            await self._async_run()
        except Exception:
            _LOGGER.exception("Looking back failed")

    async def _async_run(self) -> None:
        now = dt_util.now()
        today = now.date()
        days = await self._history.async_days(
            (today - timedelta(days=LEARN_DAYS + 7)).isoformat(), today.isoformat()
        )
        latest = self._history.latest_start()
        fresh = False
        for day, data in days.items():
            plan = data.get("plan")
            done = data.get("evaluation")
            if not plan or not plan.get("fixed") or latest is None:
                continue
            if done and done.get("final", True):
                continue
            # Final once the plan's day is recorded; provisional from the window's end.
            recorded = latest + timedelta(hours=1)
            end = datetime.fromisoformat(plan["window"]["start"]) + timedelta(days=1)
            until = None if recorded >= end else recorded
            if until is not None and (
                until <= datetime.fromisoformat(plan["window"]["end"])
                or (done and datetime.fromisoformat(done["until"]) >= until)
            ):
                continue
            records = {
                record["start"]: record
                for name in _around(day)
                for record in (days.get(name) or {}).get("hours") or []
            }
            evaluation = evaluate(plan, records, now, until)
            await self._history.async_update_day(day, evaluation=evaluation)
            data["evaluation"] = evaluation
            self._evaluated[day] = {"evaluation": evaluation}
            fresh = True
        self._learn(days, today)
        if fresh or self.results is None:
            self.results = results(self._evaluated, self._config()["learned"]["since"])
            self._changed()

    def _learn(self, days: dict[str, dict[str, Any]], today: date) -> None:
        config = self._config()
        learned = config["learned"]
        since = learned["since"]
        first = (today - timedelta(days=LEARN_DAYS)).isoformat()
        recent = {
            day: data
            for day, data in days.items()
            if day >= first and (since is None or day >= since[:10])
        }
        factor, solar_days = solar_factor(recent)
        shift, shift_days = solar_shift(recent)
        evaluations = [
            data["evaluation"]
            for _, data in sorted(recent.items())
            if (data.get("evaluation") or {}).get("complete")
            and data["evaluation"].get("final", True)
        ][-BUFFER_EVALUATIONS:]
        margin, buffer_days = buffer(evaluations)
        patch: dict[str, Any] = {}
        # Too few days keep what Joe learned before.
        values = {
            "solar_factor": factor if factor is not None else learned["solar_factor"],
            "solar_days": solar_days,
            "solar_shift": shift if shift is not None else learned["solar_shift"],
            "shift_days": shift_days,
            "buffer": margin if margin is not None else learned.get("buffer"),
            "buffer_days": buffer_days,
        }
        for name, value in values.items():
            if learned.get(name) != value:
                patch[name] = value
        if patch:
            patch["updated"] = dt_util.now().isoformat(timespec="seconds")
            self._update({"learned": patch}, "learned")
        # The buffer Joe uses follows the learned one unless the user set it.
        config = self._config()
        if (
            margin is not None
            and model.source_of(config, "rules.buffer_factor") != "user"
            and config["rules"]["buffer_factor"] != margin
        ):
            self._update({"rules": {"buffer_factor": margin}}, "learned")

    async def async_reset(self) -> None:
        """Forget what Joe learned and start counting again from now."""
        config = self._config()
        now = dt_util.now().isoformat(timespec="seconds")
        self._update(
            {
                "learned": {
                    "solar_factor": None,
                    "solar_days": 0,
                    "solar_shift": None,
                    "shift_days": 0,
                    "buffer": None,
                    "buffer_days": 0,
                    "since": now,
                    "updated": now,
                }
            },
            "default",
        )
        if model.source_of(config, "rules.buffer_factor") == "learned":
            default = model.default_config()["rules"]["buffer_factor"]
            self._update({"rules": {"buffer_factor": default}}, "default")
        self._evaluated = {}
        self.results = results({}, now)
        self._changed()


def _around(day: str) -> list[str]:
    """The day before (for the charge level at the window's start), the day and the next."""
    current = date.fromisoformat(day)
    return [(current + timedelta(days=offset)).isoformat() for offset in (-1, 0, 1)]
