"""The second look: a language model checks Joe's numbers and texts."""

from __future__ import annotations

import asyncio
from copy import deepcopy
from datetime import timedelta
from typing import Any
from unittest.mock import patch

import pytest
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
)
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.energy_joe import model
from custom_components.energy_joe.const import DOMAIN
from custom_components.energy_joe.learn import sparring
from custom_components.energy_joe.learn.sparring import (
    JoeSparring,
    SparringError,
    checked,
    parse,
    validate,
)
from custom_components.energy_joe.observe.store import HistoryStore
from homeassistant.core import HomeAssistant, ServiceCall, SupportsResponse
from homeassistant.util import dt as dt_util

TEXTS = {
    "plan.reason.enough": "Auch wenn der Tag schlecht kommt, lohnt mehr nicht.",
    "plan.target": "Ich lade bis {target} %.",
}
REPLAY = {
    "nights": 30,
    "first": "2026-09-20",
    "last": "2026-10-25",
    "costs": {"typical": 41.2, "bold": 40.9, "brave": 40.1, "careful": 39.4},
    "best": "careful",
    "season": None,
    "updated": "2026-10-25T00:10:00+02:00",
}
ANSWER = {
    "summary": "Zwei Dinge fallen auf.",
    "findings": [
        {
            "title": "Morgens leer",
            "evidence": "Das Ziel lag bei 60 %, der Speicher fiel auf 10,0 %.",
            "area": "night",
        },
        {"title": "Erfunden", "evidence": "Du hast 77,7 kWh verbraucht.", "area": "x"},
        {"title": "Ohne Beleg", "evidence": ""},
    ],
    "texts": [
        {
            "key": "plan.reason.enough",
            "problem": "Bei 100 % passt nichts mehr hinein.",
            "better": "Der Speicher ist voll geplant, mehr passt nicht hinein.",
        },
        {"key": "plan.unknown", "problem": "gibt es nicht", "better": "…"},
    ],
    "proposals": [
        {"setting": "rules.night_caution", "value": "careful", "reason": "Rückspiel"},
        {"setting": "rules.max_price", "value": 0.3, "reason": "nie teurer laden"},
        {"setting": "rules.night_caution", "value": "very", "reason": "?"},
    ],
    "questions": ["Hattest du am 24.10. Gäste?", 42],
}


def brief() -> dict[str, Any]:
    return {
        "made": "2026-10-26T06:00:00+01:00",
        "nights": [
            {
                "date": "2026-10-24",
                "plan": {"target": 60, "solar_kwh": 3.42},
                "morning_low": 10.0,
            }
        ],
        "batteries": [{"name": "BYD", "capacity_kwh": 9.47, "efficiency": 0.91}],
        "texts": dict(TEXTS),
    }


def test_the_answer_comes_as_an_object_or_in_a_text() -> None:
    assert parse({"summary": "ok"}) == {"summary": "ok"}
    fenced = 'Hier:\n```json\n{"summary": "ok", "findings": []}\n```\nGruß'
    assert parse(fenced) == {"summary": "ok", "findings": []}
    assert parse('Zuerst {kaputt} dann {"summary": "zwei"}') == {"summary": "zwei"}
    for broken in ("Kein JSON", "[1, 2]", None, 5):
        with pytest.raises(SparringError):
            parse(broken)


def test_numbers_of_the_evidence_must_be_in_the_summary() -> None:
    numbers = sparring._numbers(brief())
    assert checked("Ziel 60 %, morgens 10,0 % übrig", numbers)
    # Rounded as written, within 2 %, a share in percent, a date.
    assert checked("Der BYD hat 9,5 kWh", numbers)
    assert checked("Der BYD hat 9,4 kWh", numbers)
    assert checked("Wirkungsgrad 91 %", numbers)
    assert checked("Am 24.10. kamen 3,42 kWh Sonne", numbers)
    assert not checked("Der BYD hat 12 kWh", numbers)
    assert not checked("Ohne jede Zahl", numbers)
    # A whole number is no share written in percent.
    assert not checked("Bis 100 %", numbers)


def test_only_known_texts_and_settings_are_kept() -> None:
    config = model.default_config()
    before = deepcopy(config)
    result = validate(ANSWER, brief(), config, REPLAY)
    assert config == before
    assert result["summary"] == "Zwei Dinge fallen auf."
    assert [(f["title"], f["area"], f["checked"]) for f in result["findings"]] == [
        ("Morgens leer", "night", True),
        ("Erfunden", "other", False),
    ]
    assert result["texts"] == [
        {
            "key": "plan.reason.enough",
            # The template as Joe has it, not as the answer may quote it.
            "template": TEXTS["plan.reason.enough"],
            "problem": "Bei 100 % passt nichts mehr hinein.",
            "better": "Der Speicher ist voll geplant, mehr passt nicht hinein.",
        }
    ]
    assert result["proposals"] == [
        {
            "setting": "rules.night_caution",
            "value": "careful",
            "current": "brave",
            "reason": "Rückspiel",
            "replay": {
                "best": "careful",
                "cost": REPLAY["costs"],
                "nights": 30,
            },
        }
    ]
    assert result["questions"] == ["Hattest du am 24.10. Gäste?"]
    # The finding without evidence, the unknown text, two proposals, the number.
    assert result["dropped"] == 5
    # The setting already chosen is no proposal; without a replay none is shown.
    config["rules"]["night_caution"] = "careful"
    again = validate(ANSWER, brief(), config, None)
    assert again["proposals"] == []
    alone = {"proposals": ANSWER["proposals"][:1]}
    found = validate(alone, brief(), model.default_config(), None)
    assert found["proposals"][0]["replay"] is None


def test_numbers_and_yes_or_no_within_their_limits() -> None:
    answer = {
        "proposals": [
            {"setting": "rules.reserve_soc", "value": 20.4, "reason": "mehr Reserve"},
            {"setting": "rules.reserve_soc", "value": 80, "reason": "viel zu viel"},
            {"setting": "rules.min_saving", "value": 0.1, "reason": "kleine Nächte"},
            {
                "setting": "rules.grid_friendly",
                "value": False,
                "reason": "lieber sparen",
            },
            {"setting": "rules.grid_friendly", "value": "false", "reason": "Text"},
            {"setting": "rules.day_caution", "value": "careful", "reason": "Wolken"},
            {"setting": "rules.evening_min_soc", "value": True, "reason": "kein Wert"},
        ]
    }
    result = validate(answer, brief(), model.default_config(), None)
    assert [(p["setting"], p["value"]) for p in result["proposals"]] == [
        ("rules.reserve_soc", 20),
        ("rules.min_saving", 0.1),
        ("rules.grid_friendly", False),
        ("rules.day_caution", "careful"),
    ]
    assert result["proposals"][0]["current"] == 10
    assert result["dropped"] == 3
    assert "rules.reserve_soc als Zahl von 0 bis 50" in sparring.prompt(brief())


def joe_config() -> dict[str, Any]:
    """A house with persons, calendars and places: none of it may go out."""
    return model.apply_update(
        model.default_config(),
        {
            "batteries": {
                "byd": {
                    "name": "BYD",
                    "adapter": "omnibattery",
                    "soc_entity": "sensor.byd_soc",
                    "capacity_kwh": 9.5,
                }
            },
            "persons": {
                "erika": {
                    "name": "Erika Mustermann",
                    "person_entity": "person.erika",
                    "calendars": ["calendar.erika"],
                }
            },
            "calendar": {"rules": [{"keyword": "Zahnarzt", "label": "travel"}]},
            "sparring": {"enabled": True, "entity": "ai_task.helper"},
            "learned": {
                "replay": REPLAY,
                "presence": {"erika": {"office": {"hours": 9.5, "days": 12}}},
                "battery_models": {
                    "byd": {"capacity_kwh": 6.48, "efficiency": 0.91, "days": 20}
                },
                "consumption_model": {
                    "base": 8.1,
                    "workday": -0.4,
                    "heat": 0.21,
                    "cool": 0.0,
                    "presence": 0.3,
                    "presence_mean": 14.2,
                    "r2": 0.62,
                    "days": 40,
                },
            },
        },
        "user",
    )


async def joe(
    hass: HomeAssistant, config: dict[str, Any]
) -> tuple[JoeSparring, HistoryStore]:
    store = HistoryStore(hass)
    await store.async_load()
    start = dt_util.start_of_local_day() - timedelta(days=2) + timedelta(hours=22)
    window = {
        "start": start.isoformat(),
        "end": (start + timedelta(hours=8)).isoformat(),
    }
    day = start.date().isoformat()
    await store.async_update_day(
        day,
        labels={"erika": "office"},
        plan={
            "fixed": True,
            "kind": "charge",
            "target": 60,
            "window": window,
            "batteries": [{"id": "byd", "name": "BYD", "capacity": 9.5}],
            "cars": {"car": {"trips": [{"place": "Musterstraße 5, Schöneck"}]}},
            "reasons": ["bridge"],
        },
        evaluation={
            "complete": True,
            "final": True,
            "saving": 0.31,
            "start_soc": 20.0,
            "solar": {"actual": 4.2, "forecast": 5.0},
            "home": {"actual": 9.1, "forecast": 8.0},
            "bridge": {"planned": 3.0, "actual": 3.6},
            "actual": {"night_kwh": 4.0, "day_kwh": 1.2, "sold_kwh": 0.5, "cost": 1.1},
        },
    )
    hours = [
        {
            "start": (start + timedelta(hours=hour)).isoformat(),
            "src": "live",
            "cov": 1.0,
            "home": 0.5,
            "bat": {"byd": {"soc": soc}},
        }
        for hour, soc in ((8, 30.0), (9, 12.5), (10, 18.0), (15, 5.0))
    ]
    await store.async_put_hours(hours)
    holder = {"config": config}
    log = [
        {"at": dt_util.now().isoformat(), "kind": "guard_restart", "battery": "byd"},
        {"at": dt_util.now().isoformat(), "kind": "reached", "battery": "byd"},
    ]
    joe = JoeSparring(
        hass,
        store,
        lambda: holder["config"],
        "entry",
        lambda: {"kind": "charge", "target": 100, "reasons": ["caution"]},
        lambda: {"days": 12, "saving": 3.4, "better": 9, "worse": 3},
        lambda: log,
    )
    await joe.async_load()
    return joe, store


def answering(
    hass: HomeAssistant, answer: Any, calls: list[ServiceCall], wait: float = 0
) -> None:
    async def generate(call: ServiceCall) -> dict[str, Any]:
        calls.append(call)
        if wait:
            await asyncio.sleep(wait)
        return {"conversation_id": "x", "data": answer}

    hass.services.async_register(
        "ai_task", "generate_data", generate, supports_response=SupportsResponse.ONLY
    )


async def test_without_the_service_the_report_says_why(
    hass: HomeAssistant, hass_storage: dict[str, Any]
) -> None:
    await hass.config.async_set_time_zone("Europe/Berlin")
    config = joe_config()
    looks, store = await joe(hass, config)
    report = await looks.async_run()
    assert report["ok"] is False
    assert "ai_task.generate_data" in report["error"]
    assert report["findings"] == [] and report["dropped"] == 0
    assert hass_storage[f"{DOMAIN}.entry.sparring"]["data"]["reports"] == [report]

    # The service is there, the entity is not, then it is unavailable.
    answering(hass, {}, [])
    report = await looks.async_run()
    assert "gibt es nicht" in report["error"]
    hass.states.async_set("ai_task.helper", "unavailable")
    report = await looks.async_run()
    assert "nicht erreichbar" in report["error"]
    assert len(looks.reports) == 3 and looks.reports[0] is report
    await store.async_unload()


async def test_an_answer_that_takes_too_long_or_is_no_json(
    hass: HomeAssistant,
) -> None:
    await hass.config.async_set_time_zone("Europe/Berlin")
    looks, store = await joe(hass, joe_config())
    hass.states.async_set("ai_task.helper", "unknown")
    calls: list[ServiceCall] = []
    answering(hass, "Gern! Leider weiß ich nichts.", calls)
    report = await looks.async_run()
    assert report["ok"] is False and "kein JSON" in report["error"]

    hass.services.async_remove("ai_task", "generate_data")
    answering(hass, {}, calls, wait=1)
    with patch.object(sparring, "TIMEOUT", 0.01):
        report = await looks.async_run()
    assert report["ok"] is False and "nicht innerhalb" in report["error"]
    await store.async_unload()


async def test_the_answer_is_shown_never_taken_over(
    hass: HomeAssistant, hass_storage: dict[str, Any]
) -> None:
    """Only the report is written; the brief carries no names, places or
    calendars; a look that runs is not started twice."""
    await hass.config.async_set_time_zone("Europe/Berlin")
    config = joe_config()
    before = deepcopy(config)
    looks, store = await joe(hass, config)
    hass.states.async_set("ai_task.helper", "unknown")
    calls: list[ServiceCall] = []
    answer = "```json\n" + sparring.json.dumps(ANSWER, ensure_ascii=False) + "\n```"
    answering(hass, answer, calls, wait=0.05)
    others: list[ServiceCall] = []
    hass.bus.async_listen(
        "call_service",
        lambda event: (
            others.append(event) if event.data["domain"] != "ai_task" else None
        ),
    )
    stored = set(hass_storage)

    with patch.object(sparring, "read_texts", return_value=dict(TEXTS)):
        first, second = await asyncio.gather(looks.async_run(), looks.async_run())
    await hass.async_block_till_done()
    assert first is second and len(calls) == 1
    assert first["ok"] is True and first["entity"] == "ai_task.helper"
    assert first["seen"] is False
    assert [p["value"] for p in first["proposals"]] == ["careful"]
    assert first["texts"][0]["key"] == "plan.reason.enough"
    assert config == before and others == []
    assert set(hass_storage) - stored == {f"{DOMAIN}.entry.sparring"}

    call = calls[0].data
    assert call["entity_id"] == "ai_task.helper" and "structure" not in call
    instructions = call["instructions"]
    assert "lernende KI" in instructions and "100 %" in instructions
    for private in (
        "Erika",
        "Mustermann",
        "person.",
        "calendar.",
        "Zahnarzt",
        "office",
        "Musterstraße",
        "Schöneck",
        "presence",
    ):
        assert private not in instructions, private

    sent = looks.brief
    assert sent["texts"] == TEXTS
    night = sent["nights"][0]
    assert night["plan"]["target"] == 60 and night["morning_low"] == 12.5
    assert night["actual"]["bridge_kwh"] == 3.6
    assert sent["batteries"][0]["learned_kwh"] == 6.48
    assert sent["learned"]["consumption_model"]["base"] == 8.1
    assert sent["replay"]["best"] == "careful"
    assert sent["rules"]["night_caution"] == "brave"
    assert sent["tonight"]["target"] == 100
    assert sent["control"]["events"] == {"guard_restart": 1}
    # The finding's numbers are in what was sent.
    assert [f["checked"] for f in first["findings"]] == [True, False]

    assert await looks.async_seen(first["at"])
    assert looks.reports[0]["seen"] is True
    assert not await looks.async_seen("2020-01-01T06:00:00+01:00")
    await store.async_unload()


async def test_the_daily_look_waits_for_the_owner(hass: HomeAssistant, freezer) -> None:
    await hass.config.async_set_time_zone("Europe/Berlin")
    freezer.move_to("2026-10-26T05:59:50+01:00")
    config = joe_config()
    config["sparring"]["enabled"] = False
    looks, store = await joe(hass, config)
    hass.states.async_set("ai_task.helper", "unknown")
    calls: list[ServiceCall] = []
    answering(hass, {"summary": "nichts"}, calls)
    await looks.async_start()
    assert looks.next_run() is None

    freezer.move_to("2026-10-26T06:00:00+01:00")
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert calls == [] and looks.reports == []

    config["sparring"]["enabled"] = True
    assert looks.next_run() == "2026-10-27T06:00:00+01:00"
    freezer.move_to("2026-10-27T06:00:00+01:00")
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert len(calls) == 1 and looks.reports[0]["summary"] == "nichts"
    await looks.async_stop()
    assert looks.next_run() is None
    await store.async_unload()


async def test_sparring_api(
    ready_hass: HomeAssistant, hass_ws_client: WebSocketGenerator
) -> None:
    hass = ready_hass
    await hass.config.async_set_time_zone("Europe/Berlin")
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    runtime = hass.data[DOMAIN]
    assert runtime.config["sparring"] == {"enabled": False, "entity": None}

    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": f"{DOMAIN}/sparring"})
    result = (await client.receive_json())["result"]
    assert result["enabled"] is False and result["entity"] is None
    assert result["running"] is False and result["next"] is None
    assert result["reports"] == []
    # Nothing sent yet: a preview of what would go.
    assert set(result["brief"]) >= {"nights", "learned", "rules", "replay", "texts"}

    await client.send_json_auto_id({"type": f"{DOMAIN}/sparring/run"})
    assert (await client.receive_json())["error"]["code"] == "not_ready"

    await client.send_json_auto_id(
        {
            "type": f"{DOMAIN}/config/update",
            "patch": {"sparring": {"enabled": True, "entity": "light.kitchen"}},
        }
    )
    assert (await client.receive_json())["error"]["code"] == "invalid_config"
    await client.send_json_auto_id(
        {
            "type": f"{DOMAIN}/config/update",
            "patch": {"sparring": {"enabled": True, "entity": "ai_task.helper"}},
        }
    )
    assert (await client.receive_json())["success"]

    hass.states.async_set("ai_task.helper", "unknown")
    calls: list[ServiceCall] = []
    answering(hass, {"summary": "Alles stimmig.", "findings": []}, calls)
    await client.send_json_auto_id({"type": f"{DOMAIN}/sparring/run"})
    report = (await client.receive_json())["result"]
    assert report["ok"] is True and report["summary"] == "Alles stimmig."

    await client.send_json_auto_id({"type": f"{DOMAIN}/sparring/seen", "at": "nie"})
    assert (await client.receive_json())["error"]["code"] == "not_found"
    await client.send_json_auto_id(
        {"type": f"{DOMAIN}/sparring/seen", "at": report["at"]}
    )
    assert (await client.receive_json())["success"]
    await client.send_json_auto_id({"type": f"{DOMAIN}/sparring"})
    result = (await client.receive_json())["result"]
    assert result["enabled"] is True and result["entity"] == "ai_task.helper"
    assert [r["seen"] for r in result["reports"]] == [True]
    assert result["brief"] == runtime.sparring.brief
    assert await hass.config_entries.async_unload(entry.entry_id)
