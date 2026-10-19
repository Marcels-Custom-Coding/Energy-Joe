"""Every code the backend sends the panel has a text there, in German and
in English: the kinds of the steering log, why an operation is not
possible, the notes on an operation's order, why a probe was refused and
why a write failed (panel/src/i18n/de.ts and en.ts)."""

from __future__ import annotations

import ast
from pathlib import Path
import re

import pytest

from custom_components.energy_joe.control import operations

ROOT = Path(__file__).resolve().parent.parent
CONTROL = ROOT / "custom_components" / "energy_joe" / "control"
I18N = ROOT / "panel" / "src" / "i18n"

# The adapters' finer reasons that pass through the preview (control/operations.py).
FINE_WHY = (
    "cannot_hold",
    "cannot_block",
    "exclusive",
    "need_ref",
    "unit",
    "flash",
    "ignored",
    "unavailable",
    "soc_unknown",
)
NOTES = ("prepare", "flash", "value_before_switch", "switch_before_value")


def keys_of(lang: str) -> set[str]:
    text = (I18N / f"{lang}.ts").read_text(encoding="utf-8")
    return set(re.findall(r'^  "([^"]+)":', text, re.M))


@pytest.fixture(scope="module")
def texts() -> dict[str, set[str]]:
    return {lang: keys_of(lang) for lang in ("de", "en")}


def has_text(keys: set[str], prefix: str, code: str) -> bool:
    """A text for the code itself, or texts for its variants ("log.test.ok")."""
    return f"{prefix}.{code}" in keys or any(
        key.startswith(f"{prefix}.{code}.") for key in keys
    )


def log_kinds() -> set[str]:
    """Every kind the executor logs (the first argument of self._log, also
    where it is one of two)."""
    tree = ast.parse((CONTROL / "executor.py").read_text(encoding="utf-8"))
    kinds: set[str] = set()
    for node in ast.walk(tree):
        if not (
            isinstance(node, ast.Call)
            and isinstance(node.func, ast.Attribute)
            and node.func.attr == "_log"
            and node.args
        ):
            continue
        first = node.args[0]
        constants = (
            [first.body, first.orelse] if isinstance(first, ast.IfExp) else [first]
        )
        for item in constants:
            if isinstance(item, ast.Constant) and isinstance(item.value, str):
                kinds.add(item.value)
            elif isinstance(item, ast.Name):
                # A kind chosen before (label in ("action_on", "action_off")).
                kinds.update(
                    name
                    for name in ("action_on", "action_off", "set")
                    if name in ast.unparse(first)
                )
    return kinds


def codes_in(path: Path, pattern: str) -> set[str]:
    return set(re.findall(pattern, path.read_text(encoding="utf-8")))


def test_the_same_keys_in_both_languages(texts: dict[str, set[str]]) -> None:
    assert texts["de"] == texts["en"]


def test_every_log_kind_has_a_text(texts: dict[str, set[str]]) -> None:
    kinds = log_kinds()
    assert {"probe", "charge_slow", "night_charged", "test", "set"} <= kinds
    for lang, keys in texts.items():
        missing = sorted(kind for kind in kinds if not has_text(keys, "log", kind))
        assert not missing, f"{lang}: log kinds without a text: {missing}"


def test_every_reason_of_an_operation_has_a_text(texts: dict[str, set[str]]) -> None:
    codes = set(operations.WHY_ALIASES.values()) | set(operations.NOTHING_DEFINES)
    codes |= set(FINE_WHY)
    for lang, keys in texts.items():
        missing = sorted(code for code in codes if f"why.{code}" not in keys)
        assert not missing, f"{lang}: reasons without a text: {missing}"
        notes = sorted(note for note in NOTES if f"op.note.{note}" not in keys)
        assert not notes, f"{lang}: notes without a text: {notes}"


def test_every_problem_of_a_probe_has_a_text(texts: dict[str, set[str]]) -> None:
    problems = codes_in(CONTROL / "executor.py", r'result\["problem"\] = "(\w+)"')
    assert {"busy", "steering", "not_possible", "controls_missing"} <= problems
    for lang, keys in texts.items():
        missing = sorted(
            code for code in problems if f"op.probe.problem.{code}" not in keys
        )
        assert not missing, f"{lang}: probe problems without a text: {missing}"


def test_every_write_error_has_a_text(texts: dict[str, set[str]]) -> None:
    errors = codes_in(CONTROL / "writes.py", r'WriteError\(write\.entity_id, "(\w+)"\)')
    errors |= codes_in(CONTROL / "executor.py", r'"(not_taken)"')
    assert {"failed", "unavailable", "timeout", "missing", "option", "domain"} <= errors
    for lang, keys in texts.items():
        missing = sorted(
            code for code in errors if f"devices.problem.{code}" not in keys
        )
        assert not missing, f"{lang}: write errors without a text: {missing}"
