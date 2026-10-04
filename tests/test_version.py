"""The version HACS shows: the same everywhere, and every version has its notes."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path
import re

import pytest

ROOT = Path(__file__).resolve().parent.parent
VERSION = re.compile(r"^\d+\.\d+\.\d+$")


def _manifest_version() -> str:
    return json.loads(
        (ROOT / "custom_components" / "energy_joe" / "manifest.json").read_text()
    )["version"]


def _sections() -> dict[str, str]:
    """CHANGELOG.md's entries: version -> text below its heading."""
    text = (ROOT / "CHANGELOG.md").read_text()
    parts = re.split(r"^## (.+)$", text, flags=re.MULTILINE)
    return {parts[i].strip(): parts[i + 1].strip() for i in range(1, len(parts), 2)}


def test_the_version_is_the_same_everywhere() -> None:
    version = _manifest_version()
    assert VERSION.match(version), version
    package = json.loads((ROOT / "panel" / "package.json").read_text())
    lock = json.loads((ROOT / "panel" / "package-lock.json").read_text())
    assert package["version"] == version
    assert lock["version"] == version
    assert lock["packages"][""]["version"] == version


def test_every_version_has_its_notes() -> None:
    sections = _sections()
    version = _manifest_version()
    # The release notes come from here: the current version must say something.
    assert version in sections, f"CHANGELOG.md has no '## {version}'"
    lines = [line for line in sections[version].splitlines() if line.strip()]
    assert any(line.strip() not in ("-", "- ") for line in lines), "empty notes"
    # Newest first, each version once, nothing newer than the manifest.
    numbers = [tuple(map(int, v.split("."))) for v in sections]
    assert all(VERSION.match(v) for v in sections), list(sections)
    assert numbers == sorted(numbers, reverse=True)
    assert len(set(numbers)) == len(numbers)
    assert numbers[0] == tuple(map(int, version.split(".")))


def _bump():
    spec = importlib.util.spec_from_file_location(
        "bump_version", ROOT / "scripts" / "bump_version.py"
    )
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_counting_up() -> None:
    bump = _bump()
    assert bump.next_version("0.1.0", "patch") == "0.1.1"
    assert bump.next_version("0.1.9", "patch") == "0.1.10"
    assert bump.next_version("0.1.12", "minor") == "0.2.0"
    assert bump.next_version("0.9.3", "major") == "1.0.0"
    assert bump.next_version("0.1.2", "0.3.0") == "0.3.0"
    with pytest.raises(SystemExit):
        bump.next_version("0.2.0", "0.1.9")
    with pytest.raises(SystemExit):
        bump.next_version("0.2.0", "0.12")
