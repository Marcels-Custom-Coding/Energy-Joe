"""Find batteries, meters, tariff, forecast and context in a snapshot.

Every finder returns plain data for the panel: the best candidate, how sure Joe
is (0–1), the reasons as codes the panel translates, and alternatives.
"""

from __future__ import annotations

from collections.abc import Iterable
import re
from typing import Any

from . import knowledge as kb
from .energy import EnergyHints, Power
from .snapshot import EntityInfo, Snapshot
from .tariff import analyze_price_entity

POWER_UNITS = ("W", "kW", "MW")
ENERGY_UNITS = ("Wh", "kWh", "MWh")

ROLE_WORDS: dict[str, tuple[str, ...]] = {
    "grid_power": (
        "netz",
        "grid",
        "bezug",
        "einspeis",
        "import",
        "export",
        "stromzähler",
        "zähler",
        "meter",
    ),
    "home_power": (
        "hausverbrauch",
        "verbrauch",
        "consumption",
        "house",
        "home",
        "haus",
        "load",
        "last",
    ),
    "solar_power": (
        "pv",
        "solar",
        "photovolt",
        "erzeugung",
        "production",
        "generation",
        "wechselrichter",
        "inverter",
    ),
}
NOT_MEASUREMENT_WORDS = (
    "prognose",
    "forecast",
    "geschätzt",
    "estimated",
    "peak",
    "spitze",
    "maximal",
    "durchschnitt",
    "average",
    "kosten",
    "cost",
    "limit",
    "grenzwert",
)


def ref(entity: EntityInfo, snap: Snapshot) -> dict[str, Any]:
    """How the panel shows an entity."""
    return {
        "entity_id": entity.entity_id,
        "name": entity.name,
        "area": entity.area
        or (
            snap.devices[entity.device_id].area
            if entity.device_id in snap.devices
            else None
        ),
        "device": snap.device_name(entity.device_id),
        "value": entity.number if entity.number is not None else entity.state,
        "unit": entity.unit,
        "integration": entity.platform,
    }


def _round(confidence: float) -> float:
    return round(max(0.0, min(1.0, confidence)), 2)


def _words(text: str) -> str:
    return " " + re.sub(r"[^a-z0-9äöüß]+", " ", text.lower()) + " "


def _has_word(text: str, words: Iterable[str]) -> str | None:
    hay = _words(text)
    for word in words:
        if f" {word}" in hay:
            return word
    return None


def _key_role(entity: EntityInfo) -> kb.KeyRole | None:
    for key, role in kb.INTEGRATION_ROLES.get(entity.platform or "", {}).items():
        if entity.has_key(key):
            return role
    return None


def _entities_with_role(
    snap: Snapshot, role: str
) -> list[tuple[EntityInfo, kb.KeyRole]]:
    found = []
    for platform in kb.INTEGRATION_ROLES:
        for entity in snap.of_platform(platform):
            if (key_role := _key_role(entity)) and key_role.role == role:
                found.append((entity, key_role))
    return found


# --- Batteries -------------------------------------------------------------


def find_batteries(snap: Snapshot, energy: EnergyHints) -> list[dict[str, Any]]:
    """Home batteries, with capacity, power and controls where available."""
    batteries: list[dict[str, Any]] = []
    seen_devices: set[str] = set()

    for soc, _ in _entities_with_role(snap, "battery_soc"):
        battery = _known_battery(snap, soc)
        batteries.append(battery)
        if soc.device_id:
            seen_devices.add(soc.device_id)

    for eb in energy.batteries:
        soc = snap.get(eb.soc_entity)
        if (
            soc
            and soc.device_id not in seen_devices
            and not any(b["soc_entity"] == soc.entity_id for b in batteries)
        ):
            batteries.append(
                _generic_battery(
                    snap, soc, 0.85, [{"code": "energy_dashboard", "part": "battery"}]
                )
            )
            if soc.device_id:
                seen_devices.add(soc.device_id)

    for entity in snap.of_domain("sensor"):
        if entity.device_class != "battery" or entity.unit != "%":
            continue
        if entity.platform in kb.NOT_HARDWARE or entity.device_id in seen_devices:
            continue
        device = snap.devices.get(entity.device_id or "")
        text = " ".join(
            filter(
                None,
                [
                    entity.name,
                    device.name if device else "",
                    device.model if device else "",
                    device.manufacturer if device else "",
                ],
            )
        )
        word = _has_word(text, kb.STORAGE_WORDS)
        if not word:
            continue
        batteries.append(
            _generic_battery(
                snap, entity, 0.55, [{"code": "storage_name", "word": word}]
            )
        )
        if entity.device_id:
            seen_devices.add(entity.device_id)

    _link_energy_batteries(snap, energy, batteries)
    return batteries


def _scope(snap: Snapshot, soc: EntityInfo) -> list[EntityInfo]:
    if kb.BATTERY_SCOPE.get(soc.platform or "") == "entry":
        return snap.of_config_entry(soc.config_entry_id)
    return snap.of_device(soc.device_id)


def _known_battery(snap: Snapshot, soc: EntityInfo) -> dict[str, Any]:
    platform = soc.platform or ""
    scope = _scope(snap, soc)
    reasons: list[dict[str, Any]] = [
        {"code": "integration_key", "integration": platform}
    ]

    capacity_kwh = None
    capacity_entity = None
    for entity in snap.of_device(soc.device_id) or scope:
        if (
            (role := _key_role(entity))
            and role.role == "battery_capacity"
            and entity.number
        ):
            capacity_entity = entity.entity_id
            capacity_kwh = _to_kwh(entity.number, entity.unit)
            reasons.append({"code": "capacity_read"})
            break

    power = None
    for entity in scope:
        if (role := _key_role(entity)) and role.role == "battery_power":
            power = Power(entity.entity_id, invert=role.invert)
            break

    controls: dict[str, str] = {}
    for name, key in kb.ADAPTER_CONTROLS.get(platform, {}).items():
        for entity in scope:
            if entity.domain in ("number", "select", "switch") and entity.has_key(key):
                controls[name] = entity.entity_id
                break
    required = kb.REQUIRED_CONTROLS.get(platform, ())
    controllable = bool(required) and all(name in controls for name in required)
    if controllable:
        reasons.append({"code": "controls_found", "count": len(controls)})

    max_charge = _control_value(snap, controls.get("max_charge_power"))
    max_discharge = _control_value(snap, controls.get("max_discharge_power"))
    return {
        "id": soc.device_id or soc.entity_id,
        "name": snap.device_name(soc.device_id) or soc.name,
        "device_id": soc.device_id,
        "integration": platform,
        "soc": ref(soc, snap),
        "soc_entity": soc.entity_id,
        "power": power.as_measurement() if power else None,
        "capacity_kwh": capacity_kwh,
        "capacity_entity": capacity_entity,
        "max_charge_w": max_charge,
        "max_discharge_w": max_discharge,
        "adapter": platform if controllable else "none",
        "controls": controls if controllable else {},
        "controllable": controllable,
        "confidence": _round(0.95 if controllable else 0.85),
        "reasons": reasons,
    }


def _generic_battery(
    snap: Snapshot, soc: EntityInfo, confidence: float, reasons: list[dict[str, Any]]
) -> dict[str, Any]:
    power = None
    for entity in snap.of_device(soc.device_id):
        if (
            entity.domain == "sensor"
            and entity.device_class == "power"
            and entity.unit in POWER_UNITS
        ):
            power = Power(entity.entity_id)
            reasons = [*reasons, {"code": "power_guess"}]
            break
    return {
        "id": soc.device_id or soc.entity_id,
        "name": snap.device_name(soc.device_id) or soc.name,
        "device_id": soc.device_id,
        "integration": soc.platform,
        "soc": ref(soc, snap),
        "soc_entity": soc.entity_id,
        "power": power.as_measurement() if power else None,
        "capacity_kwh": None,
        "capacity_entity": None,
        "max_charge_w": None,
        "max_discharge_w": None,
        "adapter": "none",
        "controls": {},
        "controllable": False,
        "confidence": _round(confidence),
        "reasons": reasons,
    }


def _link_energy_batteries(
    snap: Snapshot, energy: EnergyHints, batteries: list[dict[str, Any]]
) -> None:
    """Attach Energy dashboard data (power, capacity) to the batteries found."""
    for eb in energy.batteries:
        target = None
        rate = snap.get(eb.power.entity_id) if eb.power else None
        if rate:
            target = next(
                (
                    b
                    for b in batteries
                    if b["integration"] == rate.platform and b["integration"]
                ),
                None,
            )
        if target is None and len(batteries) == 1:
            target = batteries[0]
        if target is None:
            continue
        target["reasons"].append({"code": "energy_dashboard", "part": "battery"})
        target["confidence"] = _round(target["confidence"] + 0.05)
        if eb.power and target["power"] is None:
            target["power"] = eb.power.as_measurement()
        if eb.capacity_kwh and not target["capacity_kwh"]:
            target["capacity_kwh"] = eb.capacity_kwh


def _control_value(snap: Snapshot, entity_id: str | None) -> float | None:
    entity = snap.get(entity_id)
    return entity.number if entity and entity.number else None


def _to_kwh(value: float, unit: str | None) -> float:
    if unit == "Wh":
        return round(value / 1000, 2)
    if unit == "MWh":
        return round(value * 1000, 2)
    return round(value, 2)


# --- Measurements ----------------------------------------------------------


def find_measurements(
    snap: Snapshot, energy: EnergyHints
) -> dict[str, dict[str, Any] | None]:
    """Grid, home and solar power."""
    return {
        "grid_power": _find_single(snap, "grid_power", energy.grid_power),
        "home_power": _find_single(snap, "home_power", None, energy=energy),
        "solar_power": _find_solar(snap, energy),
    }


def _find_single(
    snap: Snapshot,
    role: str,
    from_energy: Power | None,
    energy: EnergyHints | None = None,
) -> dict[str, Any] | None:
    candidates: list[dict[str, Any]] = []
    if from_energy and (entity := snap.get(from_energy.entity_id)):
        candidates.append(
            _candidate(
                snap,
                entity,
                from_energy,
                0.95,
                [{"code": "energy_dashboard", "part": role.removesuffix("_power")}],
            )
        )
    for entity, key_role in _entities_with_role(snap, role):
        # Prefer a sensor that already counts the right way round.
        confidence = 0.8 if key_role.invert else 0.85
        candidates.append(
            _candidate(
                snap,
                entity,
                Power(entity.entity_id, key_role.invert),
                confidence,
                [{"code": "integration_key", "integration": entity.platform}],
            )
        )
    if role == "home_power" and energy:
        candidates.extend(_house_meter_candidates(snap, energy))
    candidates.extend(_generic_candidates(snap, role))
    return _best(candidates)


def _find_solar(snap: Snapshot, energy: EnergyHints) -> dict[str, Any] | None:
    entities = [snap.get(e) for e in energy.solar_power]
    found = [e for e in entities if e]
    if found:
        return {
            "entities": [ref(e, snap) for e in found],
            "measurements": [Power(e.entity_id).as_measurement() for e in found],
            "total": _sum_kw(found),
            "confidence": 0.95,
            "reasons": [{"code": "energy_dashboard", "part": "solar"}],
            "alternatives": [],
        }
    known = _entities_with_role(snap, "solar_power")
    if known:
        return {
            "entities": [ref(e, snap) for e, _ in known],
            "measurements": [
                Power(e.entity_id, r.invert).as_measurement() for e, r in known
            ],
            "total": _sum_kw([e for e, _ in known]),
            "confidence": 0.85,
            "reasons": [
                {"code": "integration_key", "integration": known[0][0].platform}
            ],
            "alternatives": [],
        }
    generic = _generic_candidates(snap, "solar_power")
    if not generic:
        return None
    best = generic[0]
    entity = snap.get(best["entity"]["entity_id"])
    return {
        "entities": [best["entity"]],
        "measurements": [best["measurement"]],
        "total": _sum_kw([entity]) if entity else None,
        "confidence": best["confidence"],
        "reasons": best["reasons"],
        "alternatives": [c["entity"] for c in generic[1:4]],
    }


def _house_meter_candidates(
    snap: Snapshot, energy: EnergyHints
) -> list[dict[str, Any]]:
    """A device in the Energy dashboard that many others are part of measures the house."""
    parents: dict[str, int] = {}
    for device in energy.devices:
        if parent := device.get("included_in_stat"):
            parents[parent] = parents.get(parent, 0) + 1
    result = []
    for device in energy.devices:
        children = parents.get(device.get("stat_consumption", ""), 0)
        if children < 3 or device.get("included_in_stat"):
            continue
        entity = snap.get(device.get("stat_rate"))
        if entity:
            result.append(
                _candidate(
                    snap,
                    entity,
                    Power(entity.entity_id),
                    0.6,
                    [{"code": "house_meter", "children": children}],
                )
            )
    return result


def _generic_candidates(snap: Snapshot, role: str) -> list[dict[str, Any]]:
    words = ROLE_WORDS[role]
    result = []
    for entity in snap.of_domain("sensor"):
        if entity.device_class != "power" or entity.unit not in POWER_UNITS:
            continue
        if entity.platform in kb.FORECAST_PLATFORMS:
            continue
        if _has_word(entity.name, NOT_MEASUREMENT_WORDS):
            continue
        word = _has_word(entity.name, words)
        if not word:
            continue
        confidence = 0.45 if entity.platform in kb.NOT_HARDWARE else 0.5
        result.append(
            _candidate(
                snap,
                entity,
                Power(entity.entity_id),
                confidence,
                [{"code": "name", "word": word}],
            )
        )
    result.sort(key=lambda c: -c["confidence"])
    return result


def _candidate(
    snap: Snapshot,
    entity: EntityInfo,
    power: Power,
    confidence: float,
    reasons: list[dict[str, Any]],
) -> dict[str, Any]:
    return {
        "entity": ref(entity, snap),
        "measurement": power.as_measurement(),
        "confidence": _round(confidence),
        "reasons": reasons,
    }


def _best(candidates: list[dict[str, Any]]) -> dict[str, Any] | None:
    unique: dict[str, dict[str, Any]] = {}
    for candidate in candidates:
        entity_id = candidate["entity"]["entity_id"]
        if entity_id in unique:
            unique[entity_id]["reasons"].extend(candidate["reasons"])
            unique[entity_id]["confidence"] = max(
                unique[entity_id]["confidence"], candidate["confidence"]
            )
        else:
            unique[entity_id] = candidate
    ranked = sorted(unique.values(), key=lambda c: -c["confidence"])
    if not ranked:
        return None
    best = ranked[0]
    return {**best, "alternatives": [c["entity"] for c in ranked[1:4]]}


def _sum_kw(entities: list[EntityInfo]) -> float | None:
    total = 0.0
    seen = False
    for entity in entities:
        if entity.number is None:
            continue
        seen = True
        total += entity.number / 1000 if entity.unit == "W" else entity.number
    return round(total, 3) if seen else None


# --- Tariff ----------------------------------------------------------------


def find_tariff(snap: Snapshot, energy: EnergyHints) -> dict[str, Any]:
    """The price entity and what it says about the tariff."""
    reasons: list[dict[str, Any]] = []
    price = snap.get(energy.price_entity)
    if price:
        reasons.append({"code": "energy_dashboard", "part": "price"})
    else:
        price = next(
            (
                e
                for e in snap.of_domain("sensor")
                if e.platform in kb.TARIFF_NAMES and e.device_class == "monetary"
            ),
            None,
        )
        if price:
            reasons.append({"code": "integration_key", "integration": price.platform})

    result: dict[str, Any] = {
        "price_entity": price.entity_id if price else None,
        "price": ref(price, snap) if price else None,
        "provider": kb.TARIFF_NAMES.get(price.platform or "", None) if price else None,
        "kind": "unknown",
        "window": None,
        "night_price": None,
        "day_price": None,
        "feed_in_price": energy.feed_in_number,
        "feed_in_entity": energy.feed_in_entity,
        "confidence": 0.0,
        "reasons": reasons,
    }
    if energy.feed_in_number is not None or energy.feed_in_entity:
        reasons.append({"code": "energy_dashboard", "part": "feed_in"})
    if price:
        insight = analyze_price_entity(price)
        result.update(
            kind=insight.kind,
            window=insight.window,
            night_price=insight.night_price,
            day_price=insight.day_price,
        )
        reasons.extend(insight.reasons)
        result["confidence"] = _round(
            {"fixed_window": 0.9, "dynamic": 0.85, "flat": 0.7}.get(insight.kind, 0.3)
        )
    elif energy.price_number is not None:
        result.update(kind="flat", day_price=energy.price_number, confidence=0.6)
        reasons.append({"code": "energy_dashboard", "part": "fixed_price"})
    return result


# --- Forecast --------------------------------------------------------------


def find_forecast(snap: Snapshot, energy: EnergyHints) -> dict[str, Any] | None:
    """Solar forecast integration and its daily sums."""
    for platform, keys in kb.FORECAST_KEYS.items():
        entities = snap.of_platform(platform)
        if not entities:
            continue
        lists: dict[str, list[EntityInfo]] = {part: [] for part in keys}
        for entity in entities:
            for part, key in keys.items():
                if entity.domain == "sensor" and entity.has_key(key):
                    lists[part].append(entity)
        if not lists["today"]:
            continue
        entries = sorted(
            {e.config_entry_id for e in lists["today"] if e.config_entry_id}
        )
        linked = [entry for entry in entries if entry in energy.forecast_entries]
        reasons: list[dict[str, Any]] = [
            {"code": "integration_key", "integration": platform}
        ]
        if linked:
            reasons.append({"code": "energy_dashboard", "part": "forecast"})
        return {
            "provider": platform,
            "provider_name": kb.FORECAST_NAMES.get(platform, platform),
            "planes": len(entries),
            "config_entries": entries,
            "today": [e.entity_id for e in lists["today"]],
            "tomorrow": [e.entity_id for e in lists["tomorrow"]],
            "remaining_today": [e.entity_id for e in lists["remaining_today"]],
            "today_kwh": _sum_kwh(lists["today"]),
            "tomorrow_kwh": _sum_kwh(lists["tomorrow"]),
            "confidence": _round(0.95 if linked else 0.85),
            "reasons": reasons,
        }
    return None


def _sum_kwh(entities: list[EntityInfo]) -> float | None:
    values = [
        e.number / 1000 if e.unit == "Wh" else e.number
        for e in entities
        if e.number is not None
    ]
    return round(sum(values), 2) if values else None


# --- Wallbox, weather, holidays ---------------------------------------------


def find_wallboxes(snap: Snapshot) -> list[dict[str, Any]]:
    """Charge points of wallbox integrations; only those with a car count."""
    found: list[dict[str, Any]] = []
    for platform, keys in kb.WALLBOX_KEYS.items():
        by_device: dict[str, list[EntityInfo]] = {}
        for entity in snap.of_platform(platform):
            if entity.device_id:
                by_device.setdefault(entity.device_id, []).append(entity)
        for device_id, entities in by_device.items():
            parts = {
                part: next((e for e in entities if e.has_key(key)), None)
                for part, key in keys.items()
            }
            mode = parts.get("mode")
            if not mode or mode.domain != "select":
                continue
            is_car = bool(parts.get("connected") or parts.get("vehicle_soc"))
            found.append(
                {
                    "integration": platform,
                    "device_id": device_id,
                    "name": snap.device_name(device_id) or mode.name,
                    "is_car": is_car,
                    "mode_entity": mode.entity_id,
                    "mode_options": list(mode.attributes.get("options") or []),
                    "mode": mode.state,
                    "entities": {part: e.entity_id for part, e in parts.items() if e},
                    "confidence": _round(0.9 if is_car else 0.5),
                    "reasons": [{"code": "integration_key", "integration": platform}],
                }
            )
    found.sort(key=lambda w: (not w["is_car"], w["name"]))
    return found


def find_weather(snap: Snapshot) -> dict[str, Any] | None:
    """The weather entity with the best forecast support."""
    candidates = []
    for entity in snap.of_domain("weather"):
        if not entity.available:
            continue
        features = entity.attributes.get("supported_features") or 0
        score = 0.5 + (0.25 if features & 2 else 0) + (0.15 if features & 1 else 0)
        candidates.append((score, entity))
    if not candidates:
        return None
    candidates.sort(key=lambda item: -item[0])
    score, entity = candidates[0]
    return {
        "entity": ref(entity, snap),
        "confidence": _round(score),
        "reasons": [{"code": "forecast_support"}] if score > 0.5 else [],
        "alternatives": [ref(e, snap) for _, e in candidates[1:4]],
    }


def find_holiday(snap: Snapshot) -> dict[str, Any] | None:
    """A workday sensor tells weekdays from weekends and public holidays."""
    entity = next(
        (e for e in snap.of_domain("binary_sensor") if e.platform == "workday"), None
    )
    if not entity:
        return None
    return {
        "entity": ref(entity, snap),
        "confidence": 0.9,
        "reasons": [{"code": "integration_key", "integration": "workday"}],
    }


# --- People and calendars --------------------------------------------------


def find_people(snap: Snapshot) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    """People in the household and the calendars that probably belong to them."""
    calendars = [
        {"entity_id": e.entity_id, "name": e.name, "integration": e.platform}
        for e in snap.of_domain("calendar")
    ]
    persons = []
    for entity in snap.of_domain("person"):
        tokens = [
            t for t in re.split(r"[^a-z0-9äöüß]+", entity.name.lower()) if len(t) >= 3
        ]
        own = [
            cal["entity_id"]
            for cal in calendars
            if any(
                t in cal["entity_id"].lower() or t in cal["name"].lower()
                for t in tokens
            )
        ]
        persons.append(
            {
                "entity_id": entity.entity_id,
                "name": entity.name,
                "state": entity.state,
                "calendars": own,
                "reasons": [{"code": "name_match"}] if own else [],
            }
        )
    return persons, calendars


# --- Consumers from the Energy dashboard ------------------------------------

KIND_WORDS: tuple[tuple[str, tuple[str, ...]], ...] = (
    ("hot_water", ("warmwasser", "boiler", "hot water", "brauchwasser", "trinkwasser")),
    (
        "electric_heating",
        (
            "fussbodenheizung",
            "fußbodenheizung",
            "heizstrahler",
            "infrarot",
            "heizlüfter",
            "heizstab",
            "heater",
            "radiator",
        ),
    ),
    ("climate", ("klima", "air condition", "aircon", "split")),
    ("heat_pump", ("wärmepumpe", "waermepumpe", "heat pump", "heizung", "heating")),
    (
        "ev",
        (
            "wallbox",
            "ladestation",
            "ladepunkt",
            "charger",
            "e auto",
            "eauto",
            "auto",
            "car",
        ),
    ),
    ("comfort", ("whirlpool", "pool", "sauna", "spa", "jacuzzi")),
    (
        "household",
        (
            "kühlschrank",
            "kuehlschrank",
            "fridge",
            "gefrier",
            "freezer",
            "wasch",
            "washer",
            "trockner",
            "dryer",
            "spül",
            "dishwasher",
            "tv",
            "fernseher",
            "netzwerk",
            "network",
            "server",
            "nas",
            "drucker",
            "printer",
            "kompressor",
            "licht",
            "light",
            "steckdose",
            "büro",
            "office",
            "computer",
            "stromkreis",
        ),
    ),
)


def find_consumers(snap: Snapshot, energy: EnergyHints) -> list[dict[str, Any]]:
    """Devices from the Energy dashboard with a suggested kind."""
    parents = {
        d["included_in_stat"] for d in energy.devices if d.get("included_in_stat")
    }
    result = []
    for device in energy.devices:
        stat = device.get("stat_consumption")
        if not stat:
            continue
        entity = snap.get(stat)
        name = device.get("name") or (entity.name if entity else stat)
        if stat in parents:
            kind, word = "submeter", None
        else:
            kind, word = _guess_kind(name)
        result.append(
            {
                "id": stat,
                "name": name,
                "energy_entity": stat,
                "power_entity": device.get("stat_rate"),
                "included_in": device.get("included_in_stat"),
                "kind": kind,
                "reasons": [{"code": "submeter"}]
                if kind == "submeter"
                else ([{"code": "name", "word": word}] if word else []),
            }
        )
    return result


def _guess_kind(name: str) -> tuple[str, str | None]:
    for kind, words in KIND_WORDS:
        if word := _has_word(name, words):
            return kind, word
    return "other", None
