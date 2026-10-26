"""Once a day a language model takes a second look at Joe's numbers and words.

Joe sends a short summary (his last nights, what he learned, his rules and
his texts) to an ai_task entity the owner picked. What comes back (findings,
texts that can say nonsense, proposals, questions) is checked and kept to be
shown in the panel; Joe takes nothing over and writes nothing but his report.
"""

from __future__ import annotations

import asyncio
from collections.abc import Callable
from datetime import date, datetime, timedelta
import json
import logging
from pathlib import Path
import re
from typing import Any

from homeassistant.const import STATE_UNAVAILABLE
from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.event import async_track_time_change
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .. import model
from ..const import DOMAIN
from ..observe.readings import energy_kwh
from ..observe.store import HistoryStore

_LOGGER = logging.getLogger(__name__)

STORE_VERSION = 1
# Reports kept, newest first.
KEEP = 14
# When the daily look happens, and how long the language model may take.
RUN_HOUR = 6
TIMEOUT = 120
# The nights sent: plan against what came.
NIGHTS = 7
# The steering log looked through for what stood out (days).
LOG_DAYS = 7
# What the language model may propose (shown only, never taken over).
SETTINGS: dict[str, tuple[str, ...]] = {"rules.night_caution": model.NIGHT_CAUTIONS}
AREAS = ("night", "solar", "consumption", "battery", "car", "other")
# Joe's texts as the panel build writes them (key -> template).
TEXTS_FILE = Path(__file__).parent.parent / "frontend" / "texts-de.json"
TEXT_PREFIXES = (
    "plan.",
    "overview.",
    "need.",
    "surplus.",
    "sum.",
    "past.",
    "guard.",
    "team.",
    "rule.",
)
# Log entries that tell of trouble or of the watchdog and the team.
LOG_PREFIXES = ("guard_", "team_")
LOG_KINDS = (
    "failed",
    "emergency",
    "no_progress",
    "stuck_over",
    "release_failed",
    "limit_ref_failed",
    "grid_guard",
)
# The longest an answer's field may be, and how many entries a list keeps.
TEXT_LENGTH = 600
MAX_ITEMS = 10
MAX_QUESTIONS = 3
# A number in the evidence matches one sent within this share.
TOLERANCE = 0.02

TASK_NAME = "Energy Joe: zweiter Blick"
PROMPT = """Du bist der zweite Blick für Energy Joe. Joe ist eine lernende KI für Energie: \
Er plant in einem Haus mit Photovoltaik und Heimspeichern jede Nacht, wie weit die \
Speicher im günstigen Nachttarif aus dem Netz laden, damit sie den Morgen bis zur Sonne \
überbrücken. Aus jedem Tag lernt er dazu (Sonnenfaktoren, Verbrauchsmodell, \
Speicherkapazitäten, Rückspiel der Vorsicht-Stufen). Du schaust mit frischem Blick auf \
seine Zahlen und seine Texte.

Regeln:
- Befunde nur, wenn du sie mit Zahlen aus der Zusammenfassung belegen kannst. Schreib \
die Zahlen im Beleg so, wie sie in der Zusammenfassung stehen (keine eigenen Summen \
oder Differenzen). Nichts erfinden. Ist nichts auffällig, bleibt die Liste leer.
- Texte: Prüfe die Vorlagen in "texts", ob eine im Licht der Zahlen Unsinn sagen kann. \
{{name}} sind Platzhalter, die Joe füllt. Beispiel: Steht das Speicherziel bei 100 %, \
sagt „Auch wenn der Tag schlecht kommt, lohnt mehr nicht“ Unsinn – bei 100 % passt \
schlicht nichts mehr hinein. Nenne nur Schlüssel, die in "texts" stehen, und gib einen \
besseren Wortlaut mit denselben Platzhaltern.
- Vorschläge nur für diese Einstellungen: {settings}. Joe übernimmt nichts selbst, der \
Hausbesitzer entscheidet. Schlag nur vor, was die Zahlen tragen.
- Fragen: höchstens drei, nur was du wissen müsstest, um besser zu urteilen.
- Sprache: Deutsch, Du-Form (du sprichst den Hausbesitzer an), kurz und klar.

Antworte nur mit einem JSON-Objekt, ohne Text davor oder danach, genau in dieser Form:
{{"summary": "ein Satz", "findings": [{{"title": "kurz", "evidence": "Beleg mit Zahlen", \
"area": "{areas}"}}], "texts": [{{"key": "Schlüssel aus texts", "problem": "was nicht \
passt", "better": "besserer Wortlaut"}}], "proposals": [{{"setting": "Einstellung", \
"value": "Wert", "reason": "warum"}}], "questions": ["Frage"]}}

Zur Zusammenfassung: Energie in kWh, Ladestand und Ziele in %, Geld in €. "nights" sind \
die letzten Nächte, je Plan ("plan") gegen das, was kam ("actual"; "final": false heißt, \
der Tag läuft noch). "morning_low" ist der niedrigste echte Ladestand aller Speicher \
zwischen Fensterende und Mittag. "tonight" ist der Plan für die kommende Nacht, \
"reasons" seine Gründe. "learned" ist, was Joe gelernt hat ("solar_spread" und \
"home_spread": 20-%- und 80-%-Faktoren eines Tages gegen das Übliche). "replay" sagt, \
was jede Vorsicht-Stufe ("bold" mutig bis "cautious" sehr vorsichtig) über die \
vergangenen Nächte gekostet hätte. "control" zählt Auffälligkeiten beim Steuern der \
letzten Tage.

Zusammenfassung:
{brief}"""

_FENCE = re.compile(r"```(?:json)?", re.IGNORECASE)
_NUMBER = re.compile(r"\d+(?:[.,]\d+)?")
# "24.10." or "24.10.2026": a day and a month, not a decimal number.
_DATE = re.compile(r"\b(\d{1,2})\.(\d{1,2})\.(\d{2,4})?")


class JoeSparring:
    """Asks a language model for a second look each morning and keeps its reports."""

    def __init__(
        self,
        hass: HomeAssistant,
        history: HistoryStore,
        config: Callable[[], dict[str, Any]],
        entry_id: str,
        plan: Callable[[], dict[str, Any] | None],
        results: Callable[[], dict[str, Any] | None],
        log: Callable[[], list[dict[str, Any]]],
    ) -> None:
        """Set up; call async_load, then async_start for the daily look."""
        self._hass = hass
        self._history = history
        self._config = config
        self._plan = plan
        self._results = results
        self._log = log
        self._store: Store[dict[str, Any]] = Store(
            hass, STORE_VERSION, f"{DOMAIN}.{entry_id}.sparring"
        )
        self._unsubs: list[CALLBACK_TYPE] = []
        self._task: asyncio.Task[dict[str, Any]] | None = None
        self._texts: dict[str, str] | None = None
        self.reports: list[dict[str, Any]] = []
        # The summary sent last (the panel shows it: "Was ich schicke").
        self.brief: dict[str, Any] | None = None

    @property
    def active(self) -> bool:
        return bool(self._unsubs)

    @property
    def running(self) -> bool:
        return self._task is not None and not self._task.done()

    @property
    def ready(self) -> bool:
        """Switched on, with an entity to ask."""
        setting = self._config().get("sparring") or {}
        return bool(setting.get("enabled") and setting.get("entity"))

    async def async_load(self) -> None:
        stored = await self._store.async_load() or {}
        self.reports = stored.get("reports") or []
        self.brief = stored.get("brief")

    async def async_start(self) -> None:
        await self.async_stop()
        self._unsubs.append(
            async_track_time_change(
                self._hass, self._on_tick, hour=RUN_HOUR, minute=0, second=0
            )
        )

    async def async_stop(self) -> None:
        for unsub in self._unsubs:
            unsub()
        self._unsubs = []

    def cancel(self) -> None:
        """Joe stops: a look still waiting for its answer is given up."""
        if self.running and self._task is not None:
            self._task.cancel()

    async def async_remove(self) -> None:
        await self._store.async_remove()

    @callback
    def _on_tick(self, now: datetime) -> None:
        if self.ready and not self.running:
            self._hass.async_create_task(self._async_daily(), eager_start=False)

    async def _async_daily(self) -> None:
        try:
            await self.async_run()
        except Exception:
            _LOGGER.exception("The second look failed")

    def next_run(self) -> str | None:
        """When the next daily look happens (None: none planned)."""
        if not self.active or not self.ready:
            return None
        now = dt_util.now()
        moment = now.replace(hour=RUN_HOUR, minute=0, second=0, microsecond=0)
        if moment <= now:
            moment = dt_util.start_of_local_day(
                now.date() + timedelta(days=1)
            ) + timedelta(hours=RUN_HOUR)
        return moment.isoformat(timespec="seconds")

    async def async_view(self) -> dict[str, Any]:
        """What the panel shows: the setting, the reports and what is sent."""
        setting = self._config().get("sparring") or {}
        return {
            "enabled": bool(setting.get("enabled")),
            "entity": setting.get("entity"),
            "running": self.running,
            "next": self.next_run(),
            "reports": self.reports,
            "brief": self.brief or await self.async_brief(),
        }

    async def async_seen(self, at: str) -> bool:
        """Mark a report as seen (False: there is none of that moment)."""
        for report in self.reports:
            if report["at"] == at:
                if not report["seen"]:
                    report["seen"] = True
                    await self._async_save()
                return True
        return False

    async def async_run(self) -> dict[str, Any]:
        """Look now; while a look runs, its report is the answer (no second one)."""
        if self._task is None or self._task.done():
            self._task = self._hass.async_create_task(
                self._async_check(), eager_start=False
            )
        return await asyncio.shield(self._task)

    async def _async_check(self) -> dict[str, Any]:
        entity = (self._config().get("sparring") or {}).get("entity")
        report = _report(entity)
        brief = await self.async_brief()
        try:
            data = await self._async_ask(entity, brief)
            report.update(validate(data, brief, self._config(), self._replay()))
        except SparringError as err:
            report.update(ok=False, error=str(err))
        self.brief = brief
        self.reports = [report, *self.reports][:KEEP]
        await self._async_save()
        return report

    async def _async_ask(self, entity: str | None, brief: dict[str, Any]) -> Any:
        """The language model's answer (raises SparringError)."""
        if not entity:
            raise SparringError("Es ist keine KI-Aufgaben-Entität gewählt.")
        if not self._hass.services.has_service("ai_task", "generate_data"):
            raise SparringError(
                "Home Assistant bietet den Dienst ai_task.generate_data nicht an."
            )
        state = self._hass.states.get(entity)
        if state is None:
            raise SparringError(f"Die Entität {entity} gibt es nicht.")
        if state.state == STATE_UNAVAILABLE:
            raise SparringError(f"Die Entität {entity} ist gerade nicht erreichbar.")
        try:
            async with asyncio.timeout(TIMEOUT):
                response = await self._hass.services.async_call(
                    "ai_task",
                    "generate_data",
                    {
                        "task_name": TASK_NAME,
                        "entity_id": entity,
                        "instructions": prompt(brief),
                    },
                    blocking=True,
                    return_response=True,
                )
        except TimeoutError as err:
            raise SparringError(
                f"Das Sprachmodell hat nicht innerhalb von {TIMEOUT} s geantwortet."
            ) from err
        except HomeAssistantError as err:
            raise SparringError(f"Das Sprachmodell meldet einen Fehler: {err}") from err
        data = (response or {}).get("data") if isinstance(response, dict) else None
        return parse(data)

    async def _async_save(self) -> None:
        await self._store.async_save({"reports": self.reports, "brief": self.brief})

    def _replay(self) -> dict[str, Any] | None:
        return self._config()["learned"].get("replay")

    async def _async_texts(self) -> dict[str, str]:
        if self._texts is None:
            self._texts = await self._hass.async_add_executor_job(read_texts)
        return self._texts

    async def async_brief(self) -> dict[str, Any]:
        """The summary the language model gets: numbers and texts, no one's
        name, place, calendar or address."""
        config = self._config()
        now = dt_util.now()
        today = now.date()
        days = await self._history.async_days(
            (today - timedelta(days=NIGHTS + 1)).isoformat(), today.isoformat()
        )
        learned = config["learned"]
        rules = config["rules"]
        tariff = config["tariff"]
        results = self._results() or {}
        return {
            "made": now.isoformat(timespec="seconds"),
            "batteries": [
                _battery(
                    battery,
                    (learned.get("battery_models") or {}).get(battery["id"]) or {},
                    energy_kwh(self._hass.states.get(battery["capacity_entity"] or "")),
                )
                for battery in config["batteries"]
            ],
            "tariff": {
                "kind": tariff["kind"],
                "window": tariff.get("window"),
                "night": tariff.get("night_price"),
                "day": tariff.get("day_price"),
                "feed_in": tariff.get("feed_in_price"),
            },
            "rules": {
                name: rules.get(name)
                for name in (
                    "night_caution",
                    "buffer_factor",
                    "reserve_soc",
                    "max_target_soc",
                    "evening_min_soc",
                    "max_night_kwh",
                    "min_saving",
                    "max_price",
                    "day_caution",
                    "grid_friendly",
                    "morning_buffer_soc",
                )
            },
            "tonight": _tonight(self._plan()),
            "nights": _nights(days),
            "learned": {
                "solar_factor": learned.get("solar_factor"),
                "solar_days": learned.get("solar_days"),
                "solar_shift": learned.get("solar_shift"),
                "solar_classes": learned.get("solar_classes") or None,
                "solar_spread": learned.get("solar_spread") or None,
                "home_spread": learned.get("home_spread") or None,
                "consumption_model": _consumption(learned.get("consumption_model")),
                "morning_need": learned.get("morning_need"),
                "home_check": learned.get("home_check"),
                "buffer": learned.get("buffer"),
                "buffer_days": learned.get("buffer_days"),
            },
            "replay": _replay_view(learned.get("replay")),
            "results": {
                name: results.get(name)
                for name in ("first", "days", "saving", "better", "worse")
            },
            "control": _control(self._log(), now),
            "texts": await self._async_texts(),
        }


class SparringError(Exception):
    """The look could not be made; the message is for the owner."""


def read_texts() -> dict[str, str]:
    """Joe's texts the panel build wrote (empty without the file)."""
    try:
        data = json.loads(TEXTS_FILE.read_text(encoding="utf-8"))
    except OSError, ValueError:
        return {}
    if not isinstance(data, dict):
        return {}
    return {
        key: value
        for key, value in data.items()
        if isinstance(value, str) and key.startswith(TEXT_PREFIXES)
    }


def prompt(brief: dict[str, Any]) -> str:
    return PROMPT.format(
        settings="; ".join(
            f"{setting} mit einem der Werte {', '.join(values)}"
            for setting, values in SETTINGS.items()
        ),
        areas="|".join(AREAS),
        brief=json.dumps(brief, ensure_ascii=False, separators=(",", ":")),
    )


def parse(data: Any) -> dict[str, Any]:
    """The answer as an object: as it came, or the first JSON object in a text."""
    if isinstance(data, dict):
        return data
    if isinstance(data, str):
        text = _FENCE.sub("", data)
        start = text.find("{")
        while start != -1:
            try:
                found, _ = json.JSONDecoder().raw_decode(text, start)
            except ValueError:
                start = text.find("{", start + 1)
                continue
            if isinstance(found, dict):
                return found
            start = text.find("{", start + 1)
    raise SparringError("Die Antwort des Sprachmodells war kein JSON in der Form.")


def validate(
    data: dict[str, Any],
    brief: dict[str, Any],
    config: dict[str, Any],
    replay: dict[str, Any] | None,
) -> dict[str, Any]:
    """What of the answer is kept: known areas, texts and settings only,
    each finding marked whether its numbers are in the summary."""
    dropped = 0
    numbers = _numbers({k: v for k, v in brief.items() if k != "texts"})
    texts = brief.get("texts") or {}

    def items(name: str) -> list[Any]:
        nonlocal dropped
        found = data.get(name)
        if not isinstance(found, list):
            dropped += 0 if found is None else 1
            return []
        dropped += max(0, len(found) - MAX_ITEMS)
        return found[:MAX_ITEMS]

    findings = []
    for item in items("findings"):
        title = _text(item, "title")
        evidence = _text(item, "evidence")
        if not title or not evidence:
            dropped += 1
            continue
        area = item.get("area")
        findings.append(
            {
                "title": title,
                "evidence": evidence,
                "area": area if area in AREAS else "other",
                "checked": checked(evidence, numbers),
            }
        )
    found_texts = []
    for item in items("texts"):
        key = item.get("key") if isinstance(item, dict) else None
        problem = _text(item, "problem")
        if key not in texts or not problem:
            dropped += 1
            continue
        found_texts.append(
            {
                "key": key,
                "template": texts[key],
                "problem": problem,
                "better": _text(item, "better"),
            }
        )
    proposals = []
    for item in items("proposals"):
        setting = item.get("setting") if isinstance(item, dict) else None
        value = item.get("value") if isinstance(item, dict) else None
        if setting not in SETTINGS or value not in SETTINGS[setting]:
            dropped += 1
            continue
        current = _setting(config, setting)
        if value == current:
            dropped += 1
            continue
        proposals.append(
            {
                "setting": setting,
                "value": value,
                "current": current,
                "reason": _text(item, "reason"),
                "replay": _replay_for(setting, replay),
            }
        )
    questions = []
    for item in items("questions")[:MAX_QUESTIONS]:
        if isinstance(item, str) and item.strip():
            questions.append(item.strip()[:TEXT_LENGTH])
        else:
            dropped += 1
    summary = data.get("summary")
    return {
        "summary": summary.strip()[:TEXT_LENGTH] if isinstance(summary, str) else "",
        "findings": findings,
        "texts": found_texts,
        "proposals": proposals,
        "questions": questions,
        "dropped": dropped,
    }


def checked(evidence: str, numbers: list[float]) -> bool:
    """Whether every number of the evidence is one Joe sent (within 2 %,
    rounded as written, or a share written in percent)."""
    text = _DATE.sub(lambda m: " ".join(g for g in m.groups() if g), evidence)
    found = _NUMBER.findall(text)
    if not found:
        return False
    for written in found:
        value = float(written.replace(",", "."))
        decimals = len(written.replace(",", ".").partition(".")[2])
        if not any(_matches(value, decimals, number) for number in numbers):
            return False
    return True


def _matches(value: float, decimals: int, number: float) -> bool:
    candidates = [abs(number)]
    # A share (0.91) may be written in percent (91 %); whole numbers are no share.
    if abs(number) <= 3 and number != int(number):
        candidates.append(abs(number) * 100)
    for candidate in candidates:
        if abs(value - candidate) <= TOLERANCE * max(value, candidate):
            return True
        if round(candidate, decimals) == value:
            return True
    return False


def _numbers(value: Any) -> list[float]:
    """Every number in the summary, also those inside its texts (dates, times)."""
    if isinstance(value, bool) or value is None:
        return []
    if isinstance(value, (int, float)):
        return [float(value)]
    if isinstance(value, str):
        return [float(n) for n in re.findall(r"\d+", value)]
    if isinstance(value, dict):
        return [n for item in value.values() for n in _numbers(item)]
    if isinstance(value, list):
        return [n for item in value for n in _numbers(item)]
    return []


def _text(item: Any, name: str) -> str:
    value = item.get(name) if isinstance(item, dict) else None
    return value.strip()[:TEXT_LENGTH] if isinstance(value, str) else ""


def _setting(config: dict[str, Any], path: str) -> Any:
    value: Any = config
    for part in path.split("."):
        value = value.get(part) if isinstance(value, dict) else None
    return value


def _replay_for(setting: str, replay: dict[str, Any] | None) -> dict[str, Any] | None:
    """What Joe's own replay says about a setting (only the caution has one)."""
    if setting != "rules.night_caution" or not replay:
        return None
    return {
        "best": replay.get("best"),
        "cost": replay.get("costs"),
        "nights": replay.get("nights"),
    }


def _report(entity: str | None) -> dict[str, Any]:
    return {
        "at": dt_util.now().isoformat(timespec="seconds"),
        "entity": entity,
        "ok": True,
        "error": None,
        "seen": False,
        "summary": "",
        "findings": [],
        "texts": [],
        "proposals": [],
        "questions": [],
        "dropped": 0,
    }


def _clock(value: str | None) -> str | None:
    """A moment as the local time of day (HH:MM)."""
    if not value:
        return None
    return dt_util.as_local(datetime.fromisoformat(value)).strftime("%H:%M")


def _battery(
    battery: dict[str, Any], found: dict[str, Any], device_kwh: float | None
) -> dict[str, Any]:
    return {
        "name": battery.get("name"),
        "capacity_kwh": battery.get("capacity_kwh") or device_kwh,
        "learned_kwh": found.get("capacity_kwh"),
        "measured_kwh": found.get("measured_kwh"),
        "runs": found.get("runs"),
        "efficiency": found.get("efficiency"),
        "converter": (found.get("converter") or {}).get("factor"),
        "max_charge_w": battery.get("max_charge_w"),
    }


def _consumption(found: dict[str, Any] | None) -> dict[str, Any] | None:
    """The consumption model without who is at home how long."""
    if not found:
        return None
    return {
        name: found.get(name)
        for name in ("base", "workday", "heat", "cool", "r2", "days")
    }


def _replay_view(found: dict[str, Any] | None) -> dict[str, Any] | None:
    if not found:
        return None
    season = found.get("season") or {}
    return {
        "nights": found.get("nights"),
        "first": found.get("first"),
        "last": found.get("last"),
        "costs": found.get("costs"),
        "best": found.get("best"),
        "season": {
            "nights": season.get("nights"),
            "costs": season.get("costs"),
            "best": season.get("best"),
        }
        if season
        else None,
    }


def _tonight(plan: dict[str, Any] | None) -> dict[str, Any] | None:
    """The coming night's plan, its targets and reasons."""
    if not plan:
        return None
    if plan.get("kind") == "unavailable":
        return {"kind": "unavailable", "reasons": plan.get("reasons") or []}
    risk = plan.get("risk") or {}
    rules = plan.get("rules") or {}
    return {
        "fixed": bool(plan.get("fixed")),
        "kind": plan.get("kind"),
        "target": plan.get("target"),
        "optimum": plan.get("optimum"),
        "typical_target": risk.get("typical_target"),
        "target_kwh": plan.get("target_kwh"),
        "capacity_kwh": plan.get("capacity_kwh"),
        "soc_now": plan.get("soc_now"),
        "soc_start": plan.get("soc_start"),
        "grid_charge_kwh": plan.get("grid_charge_kwh"),
        "window": {
            "start": _clock((plan.get("window") or {}).get("start")),
            "end": _clock((plan.get("window") or {}).get("end")),
        },
        "charge_from": _clock(plan.get("charge_from")),
        "sun_takes_over": _clock(plan.get("sun_takes_over")),
        "full_at": _clock(plan.get("full_at")),
        "empty_without": _clock(plan.get("empty_without")),
        "solar_kwh": plan.get("solar_kwh"),
        "home_kwh": plan.get("home_kwh"),
        "cost": plan.get("cost"),
        "caution": rules.get("night_caution"),
        "reserve": rules.get("reserve"),
        "max_target": rules.get("max_target"),
        "weights": risk.get("weights"),
        "scenarios": risk.get("scenarios"),
        "reasons": plan.get("reasons") or [],
        "notes": plan.get("notes") or [],
        "batteries": [
            {
                "name": battery.get("name"),
                "soc_start": battery.get("soc_start"),
                "target": battery.get("target"),
                "grid_kwh": battery.get("grid_kwh"),
            }
            for battery in plan.get("batteries") or []
        ],
    }


def _nights(days: dict[str, dict[str, Any]]) -> list[dict[str, Any]]:
    """The last nights: what Joe planned against what came."""
    result = []
    for day, data in days.items():
        plan = data.get("plan") or {}
        if not plan.get("fixed") or not plan.get("window"):
            continue
        evaluation = data.get("evaluation") or {}
        rules = plan.get("rules") or {}
        entry: dict[str, Any] = {
            "date": day,
            "plan": {
                "kind": plan.get("kind"),
                "target": plan.get("target"),
                "optimum": plan.get("optimum"),
                "soc_start": plan.get("soc_start"),
                "grid_charge_kwh": plan.get("grid_charge_kwh"),
                "solar_kwh": plan.get("solar_kwh"),
                "home_kwh": plan.get("home_kwh"),
                "sun_takes_over": _clock(plan.get("sun_takes_over")),
                "caution": rules.get("night_caution"),
                "reasons": plan.get("reasons") or [],
            },
            "actual": None,
            "morning_low": _morning_low(plan, day, days),
        }
        if evaluation.get("complete"):
            entry["actual"] = {
                "final": evaluation.get("final", True),
                "start_soc": evaluation.get("start_soc"),
                "solar_kwh": (evaluation.get("solar") or {}).get("actual"),
                "home_kwh": (evaluation.get("home") or {}).get("actual"),
                "bridge_planned_kwh": (evaluation.get("bridge") or {}).get("planned"),
                "bridge_kwh": (evaluation.get("bridge") or {}).get("actual"),
                "sun_takes_over": _clock(
                    (evaluation.get("takeover") or {}).get("actual")
                ),
                "night_kwh": (evaluation.get("actual") or {}).get("night_kwh"),
                "day_kwh": (evaluation.get("actual") or {}).get("day_kwh"),
                "sold_kwh": (evaluation.get("actual") or {}).get("sold_kwh"),
                "cost": (evaluation.get("actual") or {}).get("cost"),
                "saving": evaluation.get("saving"),
            }
        result.append(entry)
    return result[-NIGHTS:]


def _morning_low(
    plan: dict[str, Any], day: str, days: dict[str, dict[str, Any]]
) -> float | None:
    """The lowest real charge level of all planned batteries from the window's
    end until noon (None: not recorded)."""
    batteries = [b for b in plan.get("batteries") or [] if b.get("capacity")]
    if not batteries:
        return None
    end = dt_util.as_local(datetime.fromisoformat(plan["window"]["end"]))
    noon = end.replace(hour=12, minute=0, second=0, microsecond=0)
    following = (date.fromisoformat(day) + timedelta(days=1)).isoformat()
    capacity = sum(b["capacity"] for b in batteries)
    lowest = None
    for name in (day, following):
        for record in (days.get(name) or {}).get("hours") or []:
            start = datetime.fromisoformat(record["start"])
            if not end <= start < noon:
                continue
            levels = record.get("bat") or {}
            socs = [(levels.get(b["id"]) or {}).get("soc") for b in batteries]
            if any(soc is None for soc in socs):
                continue
            level = sum(
                b["capacity"] * soc for b, soc in zip(batteries, socs, strict=True)
            )
            level = round(level / capacity, 1)
            lowest = level if lowest is None else min(lowest, level)
    return lowest


def _control(log: list[dict[str, Any]], now: datetime) -> dict[str, Any]:
    """How often the watchdog, the team and failures showed in the last days."""
    first = now - timedelta(days=LOG_DAYS)
    counts: dict[str, int] = {}
    for entry in log:
        kind = entry.get("kind") or ""
        if not (kind.startswith(LOG_PREFIXES) or kind in LOG_KINDS):
            continue
        try:
            at = datetime.fromisoformat(entry["at"])
        except KeyError, TypeError, ValueError:
            continue
        if at >= first:
            counts[kind] = counts.get(kind, 0) + 1
    return {"days": LOG_DAYS, "events": counts}
