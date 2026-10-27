"""Which car is plugged in where: Joe watches, asks and reminds.

Every minute, and whenever a wallbox, evcc's vehicle at a loadpoint or a
car's plug sensor changes, Joe works out which car is plugged into each
charge point (see plan/cars.py). Something plugged in he cannot tell: he
asks (a push with one button per car and "Gast", and a row in the panel)
and leaves that wallbox alone until he knows. A guest's car: evcc does what
it is set to. In the evening he tells about a car that needs charging for
tomorrow but is not plugged in.

When a car is known some other way while evcc shows an id at the loadpoint
that no car has yet, Joe learns that this id is that car.

Joe only reads the cars: he never asks one to update (that would wake it).
"""

from __future__ import annotations

from collections.abc import Awaitable, Callable
from datetime import datetime, timedelta
import logging
from typing import Any

from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant, callback
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_interval,
)
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from ..const import DOMAIN
from ..plan import cars as model_cars
from ..plan.actions import MIN_KWH

_LOGGER = logging.getLogger(__name__)

STORE_KEY = f"{DOMAIN}.cars"
STORE_VERSION = 1
CHECK = timedelta(minutes=1)
# Roles shown on the car's page (where each value comes from).
SHOWN = (
    "soc",
    "range",
    "odometer",
    "capacity",
    "consumption",
    "plugged",
    "outside_temp",
    "location",
)

type Changed = Callable[[], None]


class CarWatcher:
    """Keeps track of which car is plugged in where, and of the answers."""

    def __init__(
        self,
        hass: HomeAssistant,
        config: Callable[[], dict[str, Any]],
        mode: Callable[[], str],
        plan: Callable[[], dict[str, Any] | None],
        changed: Changed,
    ) -> None:
        self._hass = hass
        self._config = config
        self._mode = mode
        self._plan = plan
        self._changed = changed
        self._store: Store[dict[str, Any]] = Store(hass, STORE_VERSION, STORE_KEY)
        self.data: dict[str, Any] = {"answers": {}, "asked": {}, "reminded": {}}
        self._unsubs: list[CALLBACK_TYPE] = []
        self._watch: CALLBACK_TYPE | None = None
        self._watched: frozenset[str] = frozenset()
        self._last: dict[str, tuple[Any, ...]] = {}
        # Set by the runtime.
        self.notifier: Any = None
        self.replan: Callable[[], Awaitable[Any]] | None = None
        self.learn: Callable[[dict[str, Any]], None] | None = None

    async def async_load(self) -> None:
        if stored := await self._store.async_load():
            for key in self.data:
                self.data[key] = stored.get(key) or {}

    async def async_remove(self) -> None:
        await self._store.async_remove()

    @callback
    def start(self) -> None:
        if not self._unsubs:
            self._unsubs.append(
                async_track_time_interval(self._hass, self._on_tick, CHECK)
            )
        self.apply()

    @callback
    def stop(self) -> None:
        for unsub in self._unsubs:
            unsub()
        self._unsubs = []
        if self._watch:
            self._watch()
            self._watch = None
        self._watched = frozenset()

    @callback
    def apply(self) -> None:
        """The configuration changed: watch the entities that tell who is plugged in."""
        if not self._unsubs:
            return
        wanted = frozenset(self._entities())
        if wanted != self._watched:
            if self._watch:
                self._watch()
                self._watch = None
            self._watched = wanted
            if wanted:
                self._watch = async_track_state_change_event(
                    self._hass, list(wanted), self._on_change
                )
        self._hass.async_create_task(self.async_check(), eager_start=False)

    def _entities(self) -> set[str]:
        config = self._config()
        found: set[str] = set()
        for action in model_cars.charge_points(config):
            point = action["point"]
            found |= {
                e
                for e in (point.get("connected_entity"), point.get("vehicle_entity"))
                if e
            }
        for car in config.get("cars") or []:
            for role in ("plugged", "location"):
                value = model_cars.value_of(self._hass.states.get, car, role)
                if value:
                    found.add(value["entity"])
            if car.get("tracker_entity"):
                found.add(car["tracker_entity"])
        return found

    @callback
    def _on_change(self, event: Event) -> None:
        self._hass.async_create_task(self.async_check(), eager_start=False)

    @callback
    def _on_tick(self, now: datetime) -> None:
        self._hass.async_create_task(self.async_check(now), eager_start=False)

    # --- detection ------------------------------------------------------------

    def detect(self) -> dict[str, dict[str, Any]]:
        """Which car is plugged in at each charge point right now."""
        return model_cars.detect_all(
            self._config(), self._hass.states.get, self.data["answers"], dt_util.now()
        )

    def point_of(self, car_id: str) -> str | None:
        return model_cars.point_of(self.detect(), car_id)

    def need_at(self, action_id: str) -> dict[str, Any] | None:
        """The need (with the entities to read) of the car plugged in here."""
        config = self._config()
        found = self.detect().get(action_id) or {}
        car = model_cars.car_by_id(config, found.get("car"))
        action = model_cars.action_by_id(config, action_id)
        if car is None or action is None or found.get("state") != "car":
            return None
        return model_cars.need_for(self._hass.states.get, car, action.get("point"))

    async def async_check(self, now: datetime | None = None) -> None:
        """Look who is plugged in; ask, learn, remind; plan again on a change."""
        if self._mode() == "off":
            return
        now = now or dt_util.now()
        config = self._config()
        await self._async_carry_answers(config, now)
        detected = self.detect()
        self._forget_old(detected)
        self._learn_vehicles(config, detected)
        signature = {
            point: (entry["state"], entry["car"], entry["how"])
            for point, entry in detected.items()
        }
        moved = signature != self._last
        self._last = signature
        await self._async_ask(config, detected)
        await self._async_remind(config, detected, now)
        if moved:
            if self.replan is not None:
                try:
                    await self.replan()
                except Exception:
                    _LOGGER.exception("Planning the charge points again failed")
            self._changed()

    async def _async_carry_answers(self, config: dict[str, Any], now: datetime) -> None:
        """A restart gives the plug sensor a new time though nobody unplugged:
        the same plug-in keeps its answer. Unplugged in between (the recorder
        knows), the answer is over; without the recorder it holds ANSWER_HOURS.
        """
        get = self._hass.states.get
        changed = False
        for point_id, answer in self.data["answers"].items():
            action = model_cars.action_by_id(config, point_id)
            point = (action or {}).get("point") or {}
            since = model_cars.session(get, point)
            if since is None or not answer.get("since") or since == answer["since"]:
                continue
            unplugged = await _async_unplugged_since(
                self._hass, point.get("connected_entity"), answer["since"]
            )
            if unplugged is None:
                at = answer.get("at")
                unplugged = not at or now - datetime.fromisoformat(at) >= timedelta(
                    hours=model_cars.ANSWER_HOURS
                )
            if unplugged:
                continue
            answer["since"] = since
            changed = True
        if changed:
            await self._async_save()

    def _forget_old(self, detected: dict[str, dict[str, Any]]) -> None:
        """Answers for a plug-in that is over go; so does the note that Joe asked."""
        config = self._config()
        get = self._hass.states.get
        now = dt_util.now()
        for point_id in list(self.data["answers"]):
            action = model_cars.action_by_id(config, point_id)
            # A plug sensor that says nothing (a restart, evcc away for a
            # moment) is no unplugging: the answer waits.
            if action is not None and model_cars.plug_unknown(
                get, action.get("point") or {}
            ):
                continue
            if action is None or not model_cars.answer_valid(
                get, action.get("point") or {}, self.data["answers"][point_id], now
            ):
                del self.data["answers"][point_id]
        for point_id in list(self.data["asked"]):
            if not (detected.get(point_id) or {}).get("ask"):
                del self.data["asked"][point_id]

    def _learn_vehicles(
        self, config: dict[str, Any], detected: dict[str, dict[str, Any]]
    ) -> None:
        """evcc shows an id no car has, and Joe knows the car otherwise: learn it."""
        if self.learn is None:
            return
        for entry in detected.values():
            vehicle = entry.get("vehicle")
            if entry["state"] != "car" or entry["how"] == "evcc" or not vehicle:
                continue
            if model_cars.car_for_vehicle(config, vehicle) is not None:
                continue
            car = model_cars.car_by_id(config, entry["car"])
            open_ = [
                s for s in model_cars.sources(car or {}, "evcc") if not s.get("vehicle")
            ]
            if car is None or len(open_) != 1:
                continue
            sources = [
                {**s, "vehicle": vehicle} if s["id"] == open_[0]["id"] else s
                for s in car["sources"]
            ]
            _LOGGER.info("evcc's vehicle %s is %s", vehicle, car["name"])
            self.learn({"cars": {car["id"]: {"sources": sources}}})

    # --- asking -----------------------------------------------------------------

    async def _async_ask(
        self, config: dict[str, Any], detected: dict[str, dict[str, Any]]
    ) -> None:
        for point_id, entry in detected.items():
            action = model_cars.action_by_id(config, point_id)
            if action is None:
                continue
            session = model_cars.session(self._hass.states.get, action["point"]) or "?"
            if entry.get("ask"):
                if self.data["asked"].get(point_id) == session:
                    continue
                self.data["asked"][point_id] = session
                await self._async_save()
                if self.notifier is not None:
                    await self.notifier.async_which_car(
                        point_id,
                        action["name"],
                        [
                            (c["id"], c["name"])
                            for c in model_cars.allowed(config, action)
                        ],
                    )
            elif self.notifier is not None and point_id not in self.data["asked"]:
                self.notifier.clear_which_car(point_id)

    async def async_answer(self, point_id: str, car: str | None) -> None:
        """The user said which car is plugged in ("guest": a guest's car;
        None: forget the answer, Joe works it out again)."""
        config = self._config()
        action = model_cars.action_by_id(config, point_id)
        if action is None or action.get("point") is None:
            raise ValueError("unknown_point")
        if car not in (None, "guest") and not any(
            c["id"] == car for c in model_cars.allowed(config, action)
        ):
            raise ValueError("unknown_car")
        if car is None:
            self.data["answers"].pop(point_id, None)
        else:
            self.data["answers"][point_id] = {
                "car": car,
                "since": model_cars.session(self._hass.states.get, action["point"]),
                "at": dt_util.now().isoformat(timespec="seconds"),
            }
        self.data["asked"].pop(point_id, None)
        if self.notifier is not None:
            self.notifier.clear_which_car(point_id)
        await self._async_save()
        await self.async_check()
        self._changed()

    # --- the evening reminder -----------------------------------------------------

    async def _async_remind(
        self,
        config: dict[str, Any],
        detected: dict[str, dict[str, Any]],
        now: datetime,
    ) -> None:
        """A car needs charging for tomorrow but is not plugged in: say so once."""
        plan = self._plan() or {}
        needs = plan.get("cars") or {}
        today = now.date().isoformat()
        local = dt_util.as_local(now).strftime("%H:%M")
        for car in config.get("cars") or []:
            need = needs.get(car["id"])
            if (
                not car.get("remind", True)
                or not need
                or self.data["reminded"].get(car["id"]) == today
                or local < car.get("remind_time", "20:00")
                or (need.get("missing_kwh") or 0) < MIN_KWH
                or model_cars.point_of(detected, car["id"]) is not None
                or model_cars.plugged(self._hass.states.get, car) is True
            ):
                continue
            self.data["reminded"][car["id"]] = today
            await self._async_save()
            km = max(0.0, (need.get("needed_km") or 0) - (need.get("reserve_km") or 0))
            if self.notifier is not None:
                await self.notifier.async_not_plugged(car["id"], car["name"], round(km))

    def reminders(self, detected: dict[str, dict[str, Any]]) -> list[dict[str, Any]]:
        """Tonight's reminders that still hold (the car is still not plugged in)."""
        config = self._config()
        plan = self._plan() or {}
        today = dt_util.now().date().isoformat()
        result = []
        for car in config.get("cars") or []:
            need = (plan.get("cars") or {}).get(car["id"])
            if (
                need
                and self.data["reminded"].get(car["id"]) == today
                and model_cars.point_of(detected, car["id"]) is None
            ):
                km = max(
                    0.0, (need.get("needed_km") or 0) - (need.get("reserve_km") or 0)
                )
                result.append({"car": car["id"], "name": car["name"], "km": round(km)})
            elif (
                self.notifier is not None
                and self.data["reminded"].get(car["id"]) == today
            ):
                self.notifier.clear_not_plugged(car["id"])
        return result

    # --- what the panel shows -------------------------------------------------------

    @property
    def status(self) -> dict[str, Any]:
        config = self._config()
        get = self._hass.states.get
        detected = self.detect()
        cars = {}
        for car in config.get("cars") or []:
            point_id = model_cars.point_of(detected, car["id"])
            action = model_cars.action_by_id(config, point_id)
            point = (action or {}).get("point") if action else None
            cars[car["id"]] = {
                "point": point_id,
                "plugged": model_cars.plugged(get, car),
                "home": model_cars.at_home(get, car),
                "values": {
                    role: found
                    for role in SHOWN
                    if (found := model_cars.value_of(get, car, role, point))
                },
            }
        return {
            "points": detected,
            "cars": cars,
            "answers": self.data["answers"],
            "merge": model_cars.merge_questions(config, get),
            "reminders": self.reminders(detected),
        }

    async def _async_save(self) -> None:
        await self._store.async_save(self.data)


async def _async_unplugged_since(
    hass: HomeAssistant, entity_id: str | None, since: str
) -> bool | None:
    """Whether the plug sensor showed "unplugged" since then (None: no recorder)."""
    if not entity_id or "recorder" not in hass.config.components:
        return None
    from homeassistant.components.recorder import get_instance, history  # noqa: PLC0415

    try:
        found = await get_instance(hass).async_add_executor_job(
            history.state_changes_during_period,
            hass,
            dt_util.as_utc(datetime.fromisoformat(since)),
            dt_util.utcnow(),
            entity_id,
            True,
            False,
            None,
            False,
        )
    except Exception:  # noqa: BLE001
        _LOGGER.debug("No history for %s", entity_id, exc_info=True)
        return None
    return any(
        state.state.lower() in model_cars.UNPLUGGED
        for state in found.get(entity_id) or []
    )
