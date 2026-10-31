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

While a car charges Joe counts the wallbox's energy, works out its level and
range from its last report, and learns its battery size (control/charging.py).
He asks a car for a fresh report only while it charges (it is awake then).
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
from ..learn.context import async_sensor_series
from ..observe.readings import to_km, to_kw
from ..plan import cars as model_cars
from ..plan.actions import MIN_KWH
from . import charging

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
        self.data: dict[str, Any] = {
            "answers": {},
            "asked": {},
            "reminded": {},
            # Per car: the energy counted since its last report, the battery
            # sizes its charges told, when Joe asked it for a report.
            "charges": {},
            "capacity": {},
            "refreshed": {},
            "backfilled": {},
        }
        self._unsubs: list[CALLBACK_TYPE] = []
        self._watch: CALLBACK_TYPE | None = None
        self._watched: frozenset[str] = frozenset()
        self._last: dict[str, tuple[Any, ...]] = {}
        # Set by the runtime.
        self.notifier: Any = None
        self.replan: Callable[[], Awaitable[Any]] | None = None
        self.learn: Callable[[dict[str, Any]], None] | None = None
        self.learn_capacity: Callable[[dict[str, Any]], None] | None = None
        self.log: Callable[..., None] | None = None

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
            # A fresh report of the car: count from there on.
            if entity := model_cars.stable_entity(car, "soc"):
                found.add(entity)
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
        await self._async_charges(config, detected, now)
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

    # --- while a car charges ------------------------------------------------------

    def _own_entities(self, car: dict[str, Any]) -> dict[str, str | None]:
        """The car's own level, range and odometer (not evcc's estimates)."""
        return {
            role: model_cars.stable_entity(car, role)
            for role in ("soc", "range", "odometer")
        }

    def capacity(self, car: dict[str, Any]) -> tuple[float | None, str | None]:
        """The car's battery size and where it comes from."""
        need = car.get("need") or {}
        if need.get("capacity_kwh"):
            return float(need["capacity_kwh"]), "user"
        found = model_cars.value_of(self._hass.states.get, car, "capacity")
        if found:
            from ..observe.readings import energy_kwh  # noqa: PLC0415

            value = energy_kwh(self._hass.states.get(found["entity"]))
            if value:
                return value, "car"
        learned = charging.learned_capacity(self.data["capacity"].get(car["id"]) or [])
        return (learned, "learned") if learned else (None, None)

    def estimate(self, action_id: str) -> dict[str, Any] | None:
        """Level and range of the car charging at this charge point, counted
        from its last report (None: no count running)."""
        config = self._config()
        found = self.detect().get(action_id) or {}
        car = model_cars.car_by_id(config, found.get("car"))
        if car is None or found.get("state") != "car":
            return None
        record = self.data["charges"].get(car["id"])
        if not record or record.get("point") != action_id:
            return None
        capacity, _source = self.capacity(car)
        # Without a battery size the range grows by what the plan reckons per km.
        planned = ((self._plan() or {}).get("cars") or {}).get(car["id"]) or {}
        result = charging.estimate(record, capacity, planned.get("consumption"))
        if result is not None:
            result["reported"] = record["base"]["at"]
        return result

    async def _async_charges(
        self, config: dict[str, Any], detected: dict[str, dict[str, Any]], now: datetime
    ) -> None:
        """Count the energy of each plugged-in car, learn its battery size from
        its next report, and ask it for one while it charges."""
        get = self._hass.states.get
        changed = False
        plugged = {}
        for action in model_cars.charge_points(config):
            entry = detected.get(action["id"]) or {}
            if entry.get("state") == "car" and entry.get("car"):
                plugged[entry["car"]] = action
        for car_id, samples in self.data["capacity"].items():
            # The learner writes the car models anew each day: the size stays there.
            if car := model_cars.car_by_id(config, car_id):
                self._publish_capacity(
                    car, charging.learned_capacity(samples), len(samples)
                )
        for car_id in list(self.data["charges"]):
            if car_id not in plugged:
                # Unplugged (or another car): the count is over, it tells nothing.
                del self.data["charges"][car_id]
                changed = True
        for car_id, action in plugged.items():
            car = model_cars.car_by_id(config, car_id)
            if car is None:
                continue
            entities = self._own_entities(car)
            if not self.data["backfilled"].get(car_id):
                self.data["backfilled"][car_id] = True
                changed = True
                await self._async_backfill(car, action, entities)
            fresh = charging.reading(get, entities)
            if fresh is None:
                continue
            record = self.data["charges"].get(car_id)
            if record is None or record.get("point") != action["id"]:
                record = self.data["charges"][car_id] = {"point": action["id"]}
                charging.begin(record, fresh, now)
                changed = True
            elif fresh["at"] != record["base"]["at"]:
                # A new report: what the charge since the last one tells.
                value = charging.capacity_sample(record, fresh)
                if value is not None:
                    self._add_capacity(
                        car,
                        {
                            "at": now.isoformat(timespec="seconds"),
                            "value": value,
                            "kwh": round(record["kwh"], 2),
                            "rise": round(fresh["soc"] - record["base"]["soc"], 1),
                        },
                    )
                charging.begin(record, fresh, now)
                changed = True
            else:
                # The same report: its range and odometer may come a moment later.
                for key in ("range", "odometer"):
                    if fresh[key] is not None:
                        record["base"][key] = fresh[key]
            power = action.get("power_entity")
            kw = charging.power_kw(get(power)) if power else None
            charging.add_power(record, kw, now)
            why = charging.ask_now(
                record, kw, now, self.data["refreshed"].get(car_id) or []
            )
            if why is not None and await self._async_refresh(car, entities, why):
                changed = True
        if changed:
            await self._async_save()

    def _add_capacity(self, car: dict[str, Any], sample: dict[str, Any]) -> None:
        samples = self.data["capacity"].setdefault(car["id"], [])
        samples.append(sample)
        del samples[: -charging.KEEP]
        learned = charging.learned_capacity(samples)
        if self.log is not None:
            self.log(
                "car_capacity",
                battery=f"car:{car['id']}",
                value=sample["value"],
                learned=learned,
                kwh=sample["kwh"],
                rise=sample["rise"],
            )
        self._publish_capacity(car, learned, len(samples))

    def _publish_capacity(
        self, car: dict[str, Any], learned: float | None, count: int
    ) -> None:
        """The learned battery size into the configuration (the plan reads it there)."""
        if learned is None or self.learn_capacity is None:
            return
        models = self._config()["learned"].get("car_models") or {}
        before = (models.get(car["id"]) or {}).get("capacity")
        if before is not None and abs(before - learned) < 0.5:
            return
        self.learn_capacity(
            {
                "learned": {
                    "car_models": {
                        car["id"]: {"capacity": learned, "capacity_charges": count}
                    }
                }
            }
        )

    async def _async_backfill(
        self, car: dict[str, Any], action: dict[str, Any], entities: dict[str, Any]
    ) -> None:
        """The first time: the battery sizes the recorder's last days tell."""
        if self.data["capacity"].get(car["id"]) or not entities.get("soc"):
            return
        power = action.get("power_entity")
        if not power:
            return
        get = self._hass.states.get
        try:
            soc = await async_sensor_series(self._hass, entities["soc"], 10)
            state = get(power)
            unit = state.attributes.get("unit_of_measurement") if state else None
            watts = [
                (when, to_kw(value, unit))
                for when, value in await async_sensor_series(self._hass, power, 10)
            ]
            odometer: list[tuple[datetime, float]] = []
            if entities.get("odometer"):
                state = get(entities["odometer"])
                unit = state.attributes.get("unit_of_measurement") if state else None
                odometer = [
                    (when, to_km(value, unit))
                    for when, value in await async_sensor_series(
                        self._hass, entities["odometer"], 10
                    )
                ]
        except Exception:
            _LOGGER.exception(
                "Reading the recorder for %s's battery failed", car["name"]
            )
            return
        samples = charging.samples_from_history(soc, watts, odometer)
        if not samples:
            return
        self.data["capacity"][car["id"]] = samples[-charging.KEEP :]
        learned = charging.learned_capacity(self.data["capacity"][car["id"]])
        if self.log is not None:
            self.log(
                "car_capacity",
                battery=f"car:{car['id']}",
                value=samples[-1]["value"],
                learned=learned,
                kwh=samples[-1]["kwh"],
                rise=samples[-1]["rise"],
                recorder=len(samples),
            )
        self._publish_capacity(car, learned, len(samples))

    async def _async_refresh(
        self, car: dict[str, Any], entities: dict[str, Any], why: str
    ) -> bool:
        """Ask the car for a fresh report (it charges, so it is awake)."""
        if self._mode() not in ("live", "advisory") or car.get("refresh") is False:
            return False
        button = charging.refresh_button(
            self._hass, [e for e in entities.values() if e]
        )
        if button is None:
            return False
        try:
            await self._hass.services.async_call(
                "button", "press", {"entity_id": button}, blocking=False
            )
        except Exception:  # noqa: BLE001 - the car's integration may refuse
            _LOGGER.warning("Asking %s for a fresh report failed", car["name"])
            return False
        asked = self.data["refreshed"].setdefault(car["id"], [])
        asked.append(dt_util.now().isoformat(timespec="seconds"))
        del asked[: -charging.PER_DAY * 2]
        if self.log is not None:
            self.log("car_refresh", battery=f"car:{car['id']}", entity=button, why=why)
        return True

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
