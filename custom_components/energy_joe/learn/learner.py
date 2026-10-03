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
from .context import async_day_labels, async_sensor_series
from .evaluate import evaluate
from .learning import buffer, results, solar_factor, solar_ratios, solar_shift
from .models import (
    battery_model,
    consumption_model,
    daily_rows,
    group_models,
    hot_water_model,
    presence_by_label,
    solar_classes,
    source_quality,
    surprises,
)

_LOGGER = logging.getLogger(__name__)

# Days Joe learns from, and how far back he sums up what plans brought.
LEARN_DAYS = 28
BUFFER_EVALUATIONS = 21
RESULT_DAYS = 400
# The models (consumption, batteries, weather, hot water) look further back.
MODEL_DAYS = 60
HOT_WATER_DAYS = 21
# What a reset forgets, by area (see async_reset).
SCOPES: dict[str, tuple[str, ...]] = {
    "forecast": (
        "solar_factor",
        "solar_days",
        "solar_shift",
        "shift_days",
        "solar_classes",
        "sources",
    ),
    "consumption": (
        "consumption_model",
        "group_models",
        "presence",
        "buffer",
        "buffer_days",
    ),
    "battery": ("battery_models",),
    "hot_water": ("action_models",),
}
# Empty values of what Joe learned.
EMPTY: dict[str, Any] = {
    "solar_factor": None,
    "solar_days": 0,
    "solar_shift": None,
    "shift_days": 0,
    "buffer": None,
    "buffer_days": 0,
    "solar_classes": {},
    "sources": {},
    "consumption_model": None,
    "group_models": {},
    "presence": {},
    "battery_models": {},
    "action_models": {},
}
# Answers to "what was special about this day?" (see async_answer).
ANSWERS = ("normal", "guests", "away", "special")


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
        # Recent days far off what Joe expected, to ask the user about.
        self.questions: list[dict[str, Any]] = []

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
        await self._async_learn_models(today)
        questions = self._questions(days, today)
        if fresh or self.results is None or questions != self.questions:
            self.questions = questions
            self.results = results(self._evaluated, self._config()["learned"]["since"])
            self._changed()

    def _learn(self, days: dict[str, dict[str, Any]], today: date) -> None:
        config = self._config()
        learned = config["learned"]
        first = (today - timedelta(days=LEARN_DAYS)).isoformat()
        sunny = _since(learned, "forecast", days, first)
        factor, solar_days = solar_factor(sunny)
        shift, shift_days = solar_shift(sunny)
        evaluations = [
            data["evaluation"]
            for _, data in sorted(_since(learned, "consumption", days, first).items())
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

    async def _async_learn_models(self, today: date) -> None:
        """Once a day: consumption, consumers, batteries, weather, presence, hot water."""
        config = self._config()
        learned = config["learned"]
        if learned.get("models_day") == today.isoformat():
            return
        first = (today - timedelta(days=MODEL_DAYS)).isoformat()
        days = await self._history.async_days(
            first, (today - timedelta(days=1)).isoformat()
        )
        await self._async_label_days(config, days)
        consumption = _since(learned, "consumption", days, first)
        rows = daily_rows(consumption)
        sunny = _since(learned, "forecast", days, first)
        values: dict[str, Any] = {
            "consumption_model": consumption_model(rows),
            "group_models": group_models(rows, config["consumers"]),
            "presence": presence_by_label(
                consumption, [p["id"] for p in config["persons"]]
            ),
            "solar_classes": solar_classes(solar_ratios(sunny)),
            "sources": source_quality(
                sunny, [a["id"] for a in config["forecast"]["alternatives"]]
            ),
            "battery_models": {
                battery["id"]: found
                for battery in config["batteries"]
                if (
                    found := battery_model(
                        _since(learned, "battery", days, first), battery["id"]
                    )
                )
            },
            "action_models": await self._async_hot_water(config, learned, today),
        }
        patch: dict[str, Any] = {"models_day": today.isoformat()}
        for name, value in values.items():
            # Too few days keep what Joe learned before.
            if value in (None, {}) and learned.get(name):
                continue
            if learned.get(name) != value:
                patch[name] = value
        if len(patch) > 1:
            patch["updated"] = dt_util.now().isoformat(timespec="seconds")
        self._update({"learned": patch}, "learned")

    async def _async_label_days(
        self, config: dict[str, Any], days: dict[str, dict[str, Any]]
    ) -> None:
        """Calendar labels per person for the days that have none yet."""
        persons = [p["id"] for p in config["persons"] if p["calendars"]]
        if not persons:
            return
        for day, data in sorted(days.items()):
            labels = data.get("labels") or {}
            if not data.get("hours") or all(p in labels for p in persons):
                continue
            workday = data.get("workday")
            if workday is None:
                workday = date.fromisoformat(day).weekday() < 5
            found = await async_day_labels(
                self._hass, config, date.fromisoformat(day), workday
            )
            await self._history.async_update_day(day, labels=found)
            data["labels"] = {**labels, **found}

    async def _async_hot_water(
        self, config: dict[str, Any], learned: dict[str, Any], today: date
    ) -> dict[str, Any]:
        """Heating rate, standing loss and daily use of each hot water action."""
        result = {}
        reset = (learned.get("reset") or {}).get("hot_water") or learned["since"]
        span = HOT_WATER_DAYS
        if reset:
            span = max(0, min(span, (today - date.fromisoformat(reset[:10])).days))
        for action in config["actions"]:
            if (
                action["kind"] != "target"
                or not action.get("sensor_entity")
                or not span
            ):
                continue
            series = await async_sensor_series(
                self._hass, action["sensor_entity"], span
            )
            if found := hot_water_model(series):
                result[action["id"]] = found
        return result

    def _questions(
        self, days: dict[str, dict[str, Any]], today: date
    ) -> list[dict[str, Any]]:
        """Recent days far off the consumption model, not answered yet."""
        learned = self._config()["learned"]
        past = {
            day: data
            for day, data in _since(learned, "consumption", days, "").items()
            if day < today.isoformat()
        }
        answered = {day for day, data in past.items() if data.get("answer")}
        return surprises(daily_rows(past), learned.get("consumption_model"), answered)

    async def async_answer(self, day: str, answer: str) -> None:
        """What was special about a day: guests, away, something else, or nothing."""
        if answer not in ANSWERS:
            raise ValueError(answer)
        await self._history.async_update_day(day, answer=answer)
        self.questions = [q for q in self.questions if q["date"] != day]
        # The models learn the answer with the next daily pass.
        if answer != "normal":
            self._update({"learned": {"models_day": None}}, "learned")
        self._changed()

    async def async_reset(self, scope: str = "all") -> None:
        """Forget what Joe learned (everything or one area) and count again from now."""
        config = self._config()
        now = dt_util.now().isoformat(timespec="seconds")
        if scope == "all":
            patch: dict[str, Any] = {
                **EMPTY,
                "since": now,
                "updated": now,
                "reset": {},
                "models_day": None,
            }
        else:
            patch = {name: EMPTY[name] for name in SCOPES[scope]}
            patch.update(
                reset={**(config["learned"].get("reset") or {}), scope: now},
                updated=now,
                models_day=None,
            )
        self._update({"learned": patch}, "default")
        if scope in ("all", "consumption") and (
            model.source_of(config, "rules.buffer_factor") == "learned"
        ):
            default = model.default_config()["rules"]["buffer_factor"]
            self._update({"rules": {"buffer_factor": default}}, "default")
        if scope == "all":
            self._evaluated = {}
            self.results = results({}, now)
            self.questions = []
        self._changed()


def _since(
    learned: dict[str, Any], scope: str, days: dict[str, dict[str, Any]], first: str
) -> dict[str, dict[str, Any]]:
    """The days an area may learn from: after the last reset of all, or of that area."""
    limits = [first]
    if learned.get("since"):
        limits.append(learned["since"][:10])
    if found := (learned.get("reset") or {}).get(scope):
        limits.append(found[:10])
    start = max(limits)
    return {day: data for day, data in days.items() if day >= start}


def _around(day: str) -> list[str]:
    """The day before (for the charge level at the window's start), the day and the next."""
    current = date.fromisoformat(day)
    return [(current + timedelta(days=offset)).isoformat() for offset in (-1, 0, 1)]
