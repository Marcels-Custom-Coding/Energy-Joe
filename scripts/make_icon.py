"""Erzeugt das Seitenleisten-Icon aus branding/logo.svg.

Home Assistant erwartet für eigene Symbole einen einzigen Pfad ohne
Transformationen. Das Skript rechnet die Verschiebungen der einzelnen Pfade
ein, skaliert auf ein quadratisches 24er-Raster und schreibt
panel/src/joe-icon.ts.

Aufruf: python3 scripts/make_icon.py
"""

from __future__ import annotations

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "branding" / "logo.svg"
TARGET = ROOT / "panel" / "src" / "joe-icon.ts"
SIZE = 24
PADDING = 0.02  # Rand je Seite, bezogen auf die Kantenlänge

PATH_RE = re.compile(
    r'<path d="([^"]+)"[^>]*?transform="translate\(([-\d.]+),([-\d.]+)\)"'
)
TOKEN_RE = re.compile(r"[MCZ]|-?\d*\.?\d+(?:e-?\d+)?", re.IGNORECASE)


def parse(svg: str) -> list[list[str | tuple[float, float]]]:
    """Liest alle Pfade und gibt Befehle mit absoluten Punkten zurück."""
    shapes = []
    for d, tx, ty in PATH_RE.findall(svg):
        dx, dy = float(tx), float(ty)
        tokens = TOKEN_RE.findall(d)
        shape: list[str | tuple[float, float]] = []
        numbers: list[float] = []
        for token in tokens:
            if token in "MCZ":
                shape.append(token)
                continue
            numbers.append(float(token))
            if len(numbers) == 2:
                shape.append((numbers[0] + dx, numbers[1] + dy))
                numbers = []
        shapes.append(shape)
    if not shapes:
        raise SystemExit("Keine Pfade mit translate() gefunden – SVG-Aufbau prüfen.")
    return shapes


def fmt(value: float) -> str:
    text = f"{value:.2f}".rstrip("0").rstrip(".")
    return "0" if text in ("", "-0") else text


def main() -> None:
    shapes = parse(SOURCE.read_text(encoding="utf-8"))
    points = [p for shape in shapes for p in shape if isinstance(p, tuple)]
    min_x = min(x for x, _ in points)
    max_x = max(x for x, _ in points)
    min_y = min(y for _, y in points)
    max_y = max(y for _, y in points)
    side = max(max_x - min_x, max_y - min_y) * (1 + 2 * PADDING)
    off_x = min_x - (side - (max_x - min_x)) / 2
    off_y = min_y - (side - (max_y - min_y)) / 2
    scale = SIZE / side

    parts: list[str] = []
    for shape in shapes:
        for item in shape:
            if isinstance(item, str):
                parts.append(item)
            else:
                x, y = item
                parts.append(f"{fmt((x - off_x) * scale)} {fmt((y - off_y) * scale)}")
    path = (
        " ".join(parts)
        .replace(" C ", "C")
        .replace(" Z", "Z")
        .replace("M ", "M")
        .replace("Z M", "ZM")
    )

    TARGET.write_text(
        "// Erzeugt von scripts/make_icon.py aus branding/logo.svg – nicht von Hand ändern.\n"
        f'export const JOE_ICON_PATH =\n  "{path}";\n',
        encoding="utf-8",
    )
    print(f"{TARGET.relative_to(ROOT)}: {len(path)} Zeichen, {len(shapes)} Pfade")


if __name__ == "__main__":
    main()
