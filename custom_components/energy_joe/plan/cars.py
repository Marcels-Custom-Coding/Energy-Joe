"""Cars and charge points: which car is plugged in where, and its values.

A car is one vehicle, however many integrations show it: evcc's vehicle and
the car maker's integration (e.g. Hyundai's) are merged into one car with
several sources. A charge point is a night action that switches a wallbox
(evcc's mode); it charges whichever car is plugged in, by that car's need.

Which car is plugged in, in this order:
1. evcc's vehicle at the loadpoint (its select shows "db:27" or the name
   from evcc.yaml; "null": nothing identified),
2. the car's own "plugged in" sensor from its integration,
3. the only car that may be at home (its tracker is not away, its plug
   sensor does not say "unplugged"),
4. what the user answered when Joe asked, or the car he told Joe to assume.
Otherwise the car is unknown: Joe leaves the wallbox alone and asks.

Values: the level preferably from evcc (it estimates the level while
charging instead of asking the car), else the car's integration; range,
odometer, place and outside temperature from the car's integration first.
Joe only reads: he never asks a car to update (that would wake it up).
"""

from __future__ import annotations

from datetime import datetime, timedelta
import re
from typing import Any

from homeassistant.core import State
from homeassistant.util import dt as dt_util

from .. import model
from ..observe.readings import UNAVAILABLE, GetState, distance_km, number

# How Joe found out which car is plugged in.
HOW = ("evcc", "plugged", "home", "answer", "assume")
# An answer without a plug-in to tie it to (no "connected" sensor) counts this long.
ANSWER_HOURS = 18
# Just plugged in: evcc and the car's own app take a while to say which car
# it is; Joe asks only after this long.
ASK_WAIT = timedelta(minutes=5)
# evcc's select says nothing is identified.
NO_VEHICLE = ("", "null", "none", "-")
PLUGGED = ("on", "true", "plugged", "plugged_in", "connected", "1", "yes", "locked")
UNPLUGGED = ("off", "false", "unplugged", "disconnected", "0", "no", "unlocked")
# A level from evcc's loadpoint below this is "not known" (it shows 0 then).
MIN_LEVEL = 0.5

# Where each value comes from first.
_ORDER: dict[str, tuple[str, ...]] = {
    "soc": ("point", "evcc", "car", "manual"),
    "range": ("car", "manual", "point", "evcc"),
    "odometer": ("car", "manual", "point", "evcc"),
    "capacity": ("car", "manual"),
    "consumption": ("car", "manual"),
    "plugged": ("car",),
    "charging": ("car",),
    "outside_temp": ("car",),
    "location": ("car",),
}
# The fields of a car's need that hold entities chosen by hand, by role.
NEED_ENTITIES = {
    "soc": "soc_entity",
    "range": "range_entity",
    "capacity": "capacity_entity",
    "odometer": "odometer_entity",
    "consumption": "consumption_entity",
}
# Words that say nothing about which car it is.
_GENERIC = {
    "auto",
    "car",
    "ev",
    "evcc",
    "electric",
    "elektro",
    "elektroauto",
    "eauto",
    "fahrzeug",
    "vehicle",
    "the",
    "der",
    "die",
    "das",
    "mein",
    "my",
}


# --- cars and charge points --------------------------------------------------


def charge_points(config: dict[str, Any]) -> list[dict[str, Any]]:
    """Night actions that switch a wallbox for cars (enabled ones)."""
    return [
        a
        for a in config.get("actions") or []
        if a.get("kind") == "switch"
        and a.get("point") is not None
        and a.get("enabled", True)
    ]


def car_by_id(config: dict[str, Any], car_id: str | None) -> dict[str, Any] | None:
    return next((c for c in config.get("cars") or [] if c["id"] == car_id), None)


def allowed(config: dict[str, Any], action: dict[str, Any]) -> list[dict[str, Any]]:
    """The cars that may charge at a charge point."""
    chosen = (action.get("point") or {}).get("cars")
    cars = config.get("cars") or []
    return cars if chosen is None else [c for c in cars if c["id"] in chosen]


def sources(car: dict[str, Any], kind: str) -> list[dict[str, Any]]:
    return [s for s in car.get("sources") or [] if s.get("kind", "car") == kind]


def _available(state: State | None) -> bool:
    return state is not None and state.state not in UNAVAILABLE


def _candidates(
    car: dict[str, Any], role: str, point: dict[str, Any] | None
) -> list[tuple[str, str, dict[str, Any] | None]]:
    """(entity, kind, source) for a role, best first."""
    found: list[tuple[str, str, dict[str, Any] | None]] = []
    for kind in _ORDER.get(role, ("car", "manual")):
        if kind == "point":
            entity = (point or {}).get(f"{role}_entity")
            if entity:
                found.append((entity, "evcc", None))
        elif kind == "manual":
            field = NEED_ENTITIES.get(role)
            entity = (car.get("need") or {}).get(field) if field else None
            if entity:
                found.append((entity, "manual", None))
        else:
            for source in sources(car, kind):
                entity = (source.get("entities") or {}).get(role)
                if entity:
                    found.append((entity, kind, source))
    return found


def value_of(
    get: GetState,
    car: dict[str, Any],
    role: str,
    point: dict[str, Any] | None = None,
) -> dict[str, Any] | None:
    """Where a value of the car comes from now: the first source that has it.

    `point` is the charge point the car is plugged into (evcc's values there).
    Returns {"entity", "kind", "platform", "name"} or None.
    """
    first: dict[str, Any] | None = None
    for entity, kind, source in _candidates(car, role, point):
        found = {
            "entity": entity,
            "kind": kind,
            "platform": (source or {}).get("platform")
            or ("evcc_intg" if kind == "evcc" else None),
            "name": (source or {}).get("name"),
        }
        first = first or found
        state = get(entity)
        if not _available(state):
            continue
        if kind == "evcc" and role == "soc" and source is None:
            # evcc's loadpoint shows 0 while it knows no level.
            level = number(state)
            if level is None or level < MIN_LEVEL:
                continue
        return found
    # Nothing has a value now: the best source still says where it would come from.
    return first


def stable_entity(car: dict[str, Any], role: str) -> str | None:
    """The car's own entity for a role, not the charge point's (for learning):
    the car maker's first, as it stays the same whatever evcc is set to."""
    found = _candidates(car, role, None)
    for kind in ("car", "manual", "evcc"):
        for entity, own, _source in found:
            if own == kind:
                return entity
    return None


def need_for(
    get: GetState, car: dict[str, Any], point: dict[str, Any] | None = None
) -> dict[str, Any]:
    """The car's need with the entities it is read from now (see plan/ev.py)."""
    need = dict(car.get("need") or {})
    for role, field in NEED_ENTITIES.items():
        found = value_of(get, car, role, point)
        need[field] = found["entity"] if found else None
    return need


def plugged(get: GetState, car: dict[str, Any]) -> bool | None:
    """The car's own plug sensor: True, False, or None (none or unknown)."""
    found = value_of(get, car, "plugged")
    state = get(found["entity"]) if found else None
    if not _available(state):
        return None
    assert state is not None
    text = state.state.lower()
    if text in PLUGGED:
        return True
    if text in UNPLUGGED:
        return False
    return None


def at_home(get: GetState, car: dict[str, Any]) -> bool | None:
    """Whether the car is at home (its tracker, else its integration's place)."""
    entity = car.get("tracker_entity")
    if not entity:
        found = value_of(get, car, "location")
        entity = found["entity"] if found else None
    state = get(entity) if entity else None
    if not _available(state):
        return None
    assert state is not None
    return state.state in ("home", "on")


# --- evcc's vehicles ------------------------------------------------------------


def slug(text: str | None) -> str:
    return re.sub(r"[^a-z0-9]+", "_", (text or "").lower()).strip("_")


def vehicle_at(get: GetState, point: dict[str, Any]) -> str | None:
    """evcc's vehicle at a loadpoint: its id, "" when none, None when not known."""
    state = (
        get(point.get("vehicle_entity") or "") if point.get("vehicle_entity") else None
    )
    if not _available(state):
        return None
    assert state is not None
    return "" if state.state.lower() in NO_VEHICLE else state.state


def car_for_vehicle(config: dict[str, Any], vehicle: str) -> dict[str, Any] | None:
    """The car evcc means by this id: learned, or by the name in evcc.yaml."""
    cars = config.get("cars") or []
    for car in cars:
        if any(s.get("vehicle") == vehicle for s in sources(car, "evcc")):
            return car
    wanted = slug(vehicle)
    for car in cars:
        for source in sources(car, "evcc"):
            if (
                source.get("vehicle") is None
                and wanted
                and (
                    slug(source.get("name")) == wanted
                    or (source.get("device_id") or "").endswith(wanted)
                )
            ):
                return car
    return None


# --- which car is plugged in --------------------------------------------------


def _connected(get: GetState, point: dict[str, Any]) -> bool | None:
    entity = point.get("connected_entity")
    state = get(entity) if entity else None
    if not _available(state):
        return None
    assert state is not None
    return state.state.lower() in PLUGGED


def session(get: GetState, point: dict[str, Any]) -> str | None:
    """Since when the car is plugged in (ties an answer to one plug-in)."""
    entity = point.get("connected_entity")
    state = get(entity) if entity else None
    if not _available(state) or state is None or state.state.lower() not in PLUGGED:
        return None
    return state.last_changed.isoformat()


def answer_valid(
    get: GetState, point: dict[str, Any], answer: dict[str, Any] | None, now: datetime
) -> bool:
    """An answer counts for the plug-in it was given for."""
    if not answer:
        return False
    if point.get("connected_entity"):
        since = session(get, point)
        return since is not None and since == answer.get("since")
    at = answer.get("at")
    return bool(at) and now - datetime.fromisoformat(at) < timedelta(hours=ANSWER_HOURS)


def detect_all(
    config: dict[str, Any],
    get: GetState,
    answers: dict[str, dict[str, Any]] | None = None,
    now: datetime | None = None,
) -> dict[str, dict[str, Any]]:
    """Per charge point: which car is plugged in, and how Joe knows.

    {"state": "free" (no cars at all: an ordinary night action) | "empty"
    (nothing plugged in) | "car" | "guest" | "unknown", "car": id or None,
    "how": one of HOW or None, "vehicle": evcc's id there, "ask": whether to
    ask (something is plugged in that Joe cannot tell)}.
    """
    answers = answers or {}
    now = now or dt_util.now()
    points = charge_points(config)
    result: dict[str, dict[str, Any]] = {}
    taken: dict[str, str] = {}
    # First what evcc and the answers say for sure, so those cars are taken.
    for action in points:
        point = action["point"]
        cars = allowed(config, action)
        vehicle = vehicle_at(get, point)
        entry: dict[str, Any] = {
            "state": "unknown",
            "car": None,
            "how": None,
            "vehicle": vehicle or None,
            "connected": _connected(get, point),
            "ask": False,
        }
        result[action["id"]] = entry
        if not cars:
            entry["state"] = "free"
            continue
        if entry["connected"] is False:
            entry["state"] = "empty"
            continue
        answer = answers.get(action["id"])
        if answer_valid(get, point, answer, now):
            assert answer is not None
            if answer.get("car") == "guest":
                entry.update(state="guest", how="answer")
                continue
            if any(c["id"] == answer.get("car") for c in cars):
                entry.update(state="car", car=answer["car"], how="answer")
                taken[answer["car"]] = action["id"]
                continue
        if vehicle:
            car = car_for_vehicle(config, vehicle)
            if car is not None and any(c["id"] == car["id"] for c in cars):
                entry.update(state="car", car=car["id"], how="evcc")
                taken[car["id"]] = action["id"]
    # Then the cars' own sensors and where they are.
    for action in points:
        entry = result[action["id"]]
        if entry["state"] != "unknown":
            continue
        point = action["point"]
        cars = [c for c in allowed(config, action) if c["id"] not in taken]
        plugs = {c["id"]: plugged(get, c) for c in cars}
        found = [c for c in cars if plugs[c["id"]] is True]
        how = "plugged"
        if len(found) != 1:
            found = [
                c
                for c in cars
                if plugs[c["id"]] is not False and at_home(get, c) is not False
            ]
            how = "home"
        if len(found) == 1:
            entry.update(state="car", car=found[0]["id"], how=how)
            taken[found[0]["id"]] = action["id"]
            continue
        assume = point.get("assume_car")
        if point.get("unknown") == "assume" and any(
            c["id"] == assume for c in allowed(config, action)
        ):
            entry.update(state="car", car=assume, how="assume")
            continue
        # Ask only when something is plugged in for sure, and not in the
        # first minutes: evcc usually tells by then.
        entry["ask"] = entry["state"] == "unknown" and bool(
            entry["connected"] or entry["vehicle"]
        )
        since = session(get, point)
        if (
            entry["ask"]
            and since is not None
            and now - datetime.fromisoformat(since) < ASK_WAIT
        ):
            entry.update(ask=False, waiting=True)
    return result


def point_of(detected: dict[str, dict[str, Any]], car_id: str) -> str | None:
    """The charge point a car is plugged into, if any."""
    return next(
        (
            point
            for point, entry in detected.items()
            if entry["state"] == "car" and entry["car"] == car_id
        ),
        None,
    )


def action_by_id(
    config: dict[str, Any], action_id: str | None
) -> dict[str, Any] | None:
    return next((a for a in config.get("actions") or [] if a["id"] == action_id), None)


# --- one car from several integrations ----------------------------------------


def tokens(name: str | None) -> set[str]:
    """The words of a name that tell cars apart ("Kona [evcc]" -> {"kona"})."""
    text = re.sub(r"\[[^\]]*\]|\([^)]*\)", " ", (name or "").lower())
    words = set(re.findall(r"[a-z0-9äöüß]+", text))
    return {w for w in words if len(w) >= 3 and w not in _GENERIC}


def clean_name(name: str | None) -> str:
    """A car's name without "[evcc]" and the like."""
    text = re.sub(r"\s*\[[^\]]*\]\s*", " ", name or "").strip()
    return text or (name or "").strip()


def _readings(get: GetState, entities: dict[str, str]) -> dict[str, float | None]:
    soc = number(get(entities["soc"])) if entities.get("soc") else None
    odometer = (
        distance_km(get(entities["odometer"])) if entities.get("odometer") else None
    )
    return {"soc": soc, "odometer": odometer}


def evidence(
    get: GetState,
    names_a: list[str | None],
    entities_a: dict[str, str],
    names_b: list[str | None],
    entities_b: dict[str, str],
) -> dict[str, Any]:
    """What speaks for and against two sources being the same car."""
    words_a = set().union(*(tokens(n) for n in names_a)) if names_a else set()
    words_b = set().union(*(tokens(n) for n in names_b)) if names_b else set()
    a, b = _readings(get, entities_a), _readings(get, entities_b)
    result: dict[str, Any] = {"name": bool(words_a & words_b)}
    if a["soc"] is not None and b["soc"] is not None:
        gap = abs(a["soc"] - b["soc"])
        result["soc"] = "close" if gap <= 5 else "far" if gap > 15 else "near"
    if a["odometer"] is not None and b["odometer"] is not None:
        gap = abs(a["odometer"] - b["odometer"])
        result["odometer"] = "equal" if gap <= 3 else "far" if gap > 50 else "near"
    result["against"] = result.get("soc") == "far" or result.get("odometer") == "far"
    result["sure"] = not result["against"] and (
        result.get("odometer") == "equal"
        or (result["name"] and result.get("soc") in (None, "close", "near"))
    )
    result["maybe"] = not result["against"] and (
        result["name"]
        or result.get("soc") == "close"
        or result.get("odometer") == "equal"
    )
    return result


def car_entities(car: dict[str, Any]) -> dict[str, str]:
    """All entities of a car by role (the first source that has each)."""
    found: dict[str, str] = {}
    for source in car.get("sources") or []:
        for role, entity in (source.get("entities") or {}).items():
            found.setdefault(role, entity)
    for role, field in NEED_ENTITIES.items():
        if (entity := (car.get("need") or {}).get(field)) and role not in found:
            found[role] = entity
    return found


def car_names(car: dict[str, Any]) -> list[str | None]:
    return [car.get("name"), *(s.get("name") for s in car.get("sources") or [])]


def separated(config: dict[str, Any], a: str, b: str) -> bool:
    """Whether the user said these two cars are not the same."""
    pairs = (config.get("answers") or {}).get("car_separate") or []
    return "|".join(sorted((a, b))) in pairs


def merge_questions(config: dict[str, Any], get: GetState) -> list[dict[str, Any]]:
    """Cars that may be the same vehicle seen by two integrations: Joe asks."""
    cars = config.get("cars") or []
    evcc_only = [c for c in cars if sources(c, "evcc") and not sources(c, "car")]
    maker_only = [c for c in cars if sources(c, "car") and not sources(c, "evcc")]
    questions = []
    for a in evcc_only:
        for b in maker_only:
            if separated(config, a["id"], b["id"]):
                continue
            found = evidence(
                get, car_names(a), car_entities(a), car_names(b), car_entities(b)
            )
            # One of each kind is worth asking even without a hint.
            alone = len(evcc_only) == 1 and len(maker_only) == 1
            if found["maybe"] or (alone and not found["against"]):
                questions.append(
                    {
                        "a": a["id"],
                        "b": b["id"],
                        "a_name": a["name"],
                        "b_name": b["name"],
                        "b_platform": sources(b, "car")[0].get("platform"),
                        "evidence": {
                            k: v
                            for k, v in found.items()
                            if k in ("name", "soc", "odometer")
                        },
                    }
                )
    return questions


def new_car_id(config: dict[str, Any], name: str | None) -> str:
    """A free id for a car ("car_kona", "car_kona_2", …)."""
    known = {c["id"] for c in config.get("cars") or []}
    base = f"car_{slug(clean_name(name)) or 'car'}"[:40]
    candidate, index = base, 2
    while candidate in known:
        candidate, index = f"{base}_{index}", index + 1
    return candidate


def source_entry(item: dict[str, Any]) -> dict[str, Any]:
    """What Joe found (discovery's car_sources) as a source of a car (model.CAR_SOURCE)."""
    return {
        "id": item["id"],
        "kind": item.get("kind", "car"),
        "platform": item.get("platform"),
        "device_id": item.get("device_id"),
        "name": item.get("name"),
        "vehicle": item.get("vehicle"),
        "entities": dict(item.get("entities") or {}),
    }


def ignored_keys(item: dict[str, Any]) -> set[str]:
    """The keys under answers.ignored that leave a found car out."""
    return {f"car:{item.get('device_id') or item['id']}", f"car:{item['id']}"}


def attach_sources(
    config: dict[str, Any], car_id: str | None, items: list[dict[str, Any]]
) -> tuple[dict[str, Any], str]:
    """Attach found cars (sources) to a car, or to a new one (`car_id` None).

    Each source leaves the car it belonged to (that car stays, maybe without
    any source: then its sensors are chosen by hand) and is no longer left
    out. Its entities are filled the way the linking fills them. Entities the
    car chose by hand that a source brings now are cleared. Returns the
    config patch and the car's id.
    """
    if not items:
        raise ValueError("no_source")
    cars = {c["id"]: _copy_car(c) for c in config.get("cars") or []}
    if car_id is None:
        name = clean_name(items[0].get("name"))
        car_id = new_car_id(config, name)
        target: dict[str, Any] = {
            "id": car_id,
            "name": name or car_id,
            "sources": [],
            "need": {},
        }
        new = True
    elif car_id in cars:
        target, new = cars[car_id], False
    else:
        raise ValueError("unknown_car")
    changed: set[str] = set()
    for item in items:
        source = source_entry(item)
        old = next((s for s in target["sources"] if s["id"] == source["id"]), None)
        for other in cars.values():
            if other is target:
                continue
            kept = [s for s in other["sources"] if s["id"] != source["id"]]
            if len(kept) != len(other["sources"]):
                old = old or next(
                    s for s in other["sources"] if s["id"] == source["id"]
                )
                other["sources"] = kept
                changed.add(other["id"])
        # A learned vehicle id stays.
        source["vehicle"] = (old or {}).get("vehicle") or source["vehicle"]
        target["sources"] = [
            *(s for s in target["sources"] if s["id"] != source["id"]),
            source,
        ]
    patch_cars: dict[str, Any] = {
        other: {"sources": cars[other]["sources"]} for other in sorted(changed)
    }
    if new:
        patch_cars[car_id] = {"name": target["name"], "sources": target["sources"]}
    else:
        change: dict[str, Any] = {"sources": target["sources"]}
        owned = {
            e for s in target["sources"] for e in (s.get("entities") or {}).values()
        }
        if cleared := moved_by_hand(target, owned):
            change["need"] = cleared
        patch_cars[car_id] = change
    drop = set().union(*(ignored_keys(item) for item in items))
    ignored = list((config.get("answers") or {}).get(model.IGNORED) or [])
    patch: dict[str, Any] = {"cars": patch_cars}
    if any(key in drop for key in ignored):
        patch["answers"] = {model.IGNORED: [key for key in ignored if key not in drop]}
    return patch, car_id


def sync_cars(
    config: dict[str, Any],
    get: GetState,
    found: list[dict[str, Any]],
    ignored: set[str] | None = None,
    points: set[str] | None = None,
) -> dict[str, Any]:
    """Link what Joe found (car integrations, evcc's vehicles) to the cars.

    `found` are sources as in model.CAR_SOURCE. A source already linked gets
    its entities refreshed; one whose entity a car uses by hand joins that
    car (the entity is then read from it); one that surely is a known car
    (same odometer, or the same name with no level against it) joins it;
    any other becomes a car of its own (Joe asks whether two are the same).
    Entities chosen by hand that a source (or a charge point, `points`: evcc's
    values at the loadpoints) brings now are cleared: they are read from there.
    Returns the patch of the cars ({} when nothing changed).
    """
    ignored = ignored or set()
    points = points or set()
    cars = {c["id"]: _copy_car(c) for c in config.get("cars") or []}
    order = [c["id"] for c in config.get("cars") or []]
    changed: set[str] = set()

    def linked(item: dict[str, Any]) -> bool:
        """Already a source of a car, or one of its entities is used by hand."""
        values = set((item.get("entities") or {}).values())
        return any(
            any(s["id"] == item["id"] for s in c["sources"])
            or values & set(car_entities(c).values())
            for c in cars.values()
        )

    # Those that belong to a car for sure first: the others are matched
    # against cars that already show all their names.
    for item in sorted(found, key=lambda item: not linked(item)):
        if f"car:{item.get('device_id')}" in ignored or f"car:{item['id']}" in ignored:
            continue
        source = source_entry(item)
        owner = next(
            (
                c
                for c in cars.values()
                if any(s["id"] == source["id"] for s in c["sources"])
            ),
            None,
        )
        if owner is not None:
            for index, old in enumerate(owner["sources"]):
                if old["id"] != source["id"]:
                    continue
                # A learned vehicle id stays.
                fresh = {**source, "vehicle": old.get("vehicle") or source["vehicle"]}
                if fresh != old:
                    owner["sources"][index] = fresh
                    changed.add(owner["id"])
            continue
        values = set(source["entities"].values())
        owner = next(
            (
                c
                for c in cars.values()
                if values
                & {
                    (c["need"] or {}).get(field)
                    for field in NEED_ENTITIES.values()
                    if (c["need"] or {}).get(field)
                }
            ),
            None,
        )
        if owner is None:
            matches = [
                c
                for c in cars.values()
                if not any(s.get("kind") == source["kind"] for s in c["sources"])
                and evidence(
                    get,
                    car_names(c),
                    car_entities(c),
                    [source["name"]],
                    source["entities"],
                )["sure"]
            ]
            owner = matches[0] if len(matches) == 1 else None
        if owner is None:
            car_id = new_car_id({"cars": [{"id": i} for i in cars]}, source["name"])
            cars[car_id] = {
                "id": car_id,
                "name": clean_name(source["name"]) or car_id,
                "sources": [source],
                "need": {},
            }
            order.append(car_id)
            changed.add(car_id)
            continue
        owner["sources"].append(source)
        changed.add(owner["id"])
    patch: dict[str, Any] = {}
    known = {c["id"] for c in config.get("cars") or []}
    for car_id in order:
        car = cars[car_id]
        if car_id not in known:
            patch[car_id] = {"name": car["name"], "sources": car["sources"]}
            continue
        change: dict[str, Any] = {}
        if car_id in changed:
            change["sources"] = car["sources"]
            owned = {
                e for s in car["sources"] for e in (s.get("entities") or {}).values()
            }
            cleared = moved_by_hand(car, owned | set(points))
        else:
            cleared = moved_by_hand(car, set(points))
        if cleared:
            change["need"] = cleared
        name = best_name(car)
        if (
            name != car["name"]
            and model.source_of(config, f"cars[{car_id}].name") != "user"
            and not tokens(car["name"])
            & set().union(*(tokens(n) for n in car_names(car)[1:]))
        ):
            # Named after the wallbox (version 6): the car's own name now.
            change["name"] = name
        if change:
            patch[car_id] = change
    return patch


def _copy_car(car: dict[str, Any]) -> dict[str, Any]:
    return {
        **car,
        "sources": [dict(s) for s in car.get("sources") or []],
        "need": dict(car.get("need") or {}),
    }


def moved_by_hand(car: dict[str, Any], owned: set[str]) -> dict[str, Any]:
    """The entities chosen by hand that a source of the car now brings (cleared)."""
    need = car.get("need") or {}
    return {
        field: None
        for field in NEED_ENTITIES.values()
        if need.get(field) and need[field] in owned
    }


def best_name(car: dict[str, Any]) -> str:
    """The name a car gets from its sources: evcc's (the user named it there), else the maker's."""
    for kind in ("evcc", "car"):
        for source in sources(car, kind):
            if source.get("name"):
                return clean_name(source["name"])
    return car["name"]
