"""Set Energy Joe's version everywhere and start its entry in CHANGELOG.md.

Small steps count up at the back (0.1.0 -> 0.1.1), bigger ones at the front
(0.1.4 -> 0.2.0). Never "0.12" for 0.1.2: HACS would rank it above 0.2.
HACS offers only GitHub releases (a tag alone is not enough), newest first:
after the push, release the version with its notes from CHANGELOG.md.

Run from the repository root:
    .venv/bin/python scripts/bump_version.py patch   # 0.1.0 -> 0.1.1
    .venv/bin/python scripts/bump_version.py minor   # 0.1.4 -> 0.2.0
    .venv/bin/python scripts/bump_version.py 0.3.0
"""

from __future__ import annotations

import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "custom_components" / "energy_joe" / "manifest.json"
PACKAGE = ROOT / "panel" / "package.json"
LOCK = ROOT / "panel" / "package-lock.json"
CHANGELOG = ROOT / "CHANGELOG.md"
VERSION = re.compile(r"^(\d+)\.(\d+)\.(\d+)$")


def current() -> str:
    return json.loads(MANIFEST.read_text())["version"]


def next_version(now: str, step: str) -> str:
    match = VERSION.match(now)
    if match is None:
        raise SystemExit(f"Version {now!r} in manifest.json is not X.Y.Z")
    major, minor, patch = (int(part) for part in match.groups())
    if step == "patch":
        return f"{major}.{minor}.{patch + 1}"
    if step == "minor":
        return f"{major}.{minor + 1}.0"
    if step == "major":
        return f"{major + 1}.0.0"
    if VERSION.match(step) is None:
        raise SystemExit(f"{step!r} is neither patch, minor, major nor X.Y.Z")
    if tuple(map(int, step.split("."))) <= (major, minor, patch):
        raise SystemExit(f"{step} is not newer than {now}")
    return step


def _replace_json_version(path: Path, version: str, count: int) -> None:
    """Change only the version lines, keeping the file's own formatting."""
    text = path.read_text()
    changed, found = re.subn(
        r'^(\s*"version": ")[^"]*(")',
        rf"\g<1>{version}\g<2>",
        text,
        count=count,
        flags=re.MULTILINE,
    )
    if found != count:
        raise SystemExit(
            f"{path.name}: expected {count} version line(s), found {found}"
        )
    path.write_text(changed)


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    version = next_version(current(), sys.argv[1])
    _replace_json_version(MANIFEST, version, 1)
    _replace_json_version(PACKAGE, version, 1)
    # The lock file names the panel's version twice: at the top and for "".
    _replace_json_version(LOCK, version, 2)
    changelog = CHANGELOG.read_text()
    heading = f"## {version}\n"
    if heading not in changelog:
        first = changelog.index("\n## ")
        changelog = f"{changelog[: first + 1]}{heading}\n- \n{changelog[first:]}"
        CHANGELOG.write_text(changelog)
    print(f"{version}: now write what changed under '## {version}' in CHANGELOG.md")


if __name__ == "__main__":
    main()
