"""Stellt Joes Posen aus branding/ frei und erzeugt Web-Versionen fürs Panel.

Entfernt den weißen Hintergrund, der mit dem Bildrand verbunden ist (das
Sonnen-Oval bleibt als Abzeichen erhalten), schneidet auf das Motiv zu und
speichert WebP ohne Metadaten nach panel/public/poses/.

Aufruf: .venv/bin/python scripts/make_poses.py (benötigt Pillow)
"""

from __future__ import annotations

from pathlib import Path
import sys

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from make_brand import sticker  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "branding"
TARGET = ROOT / "panel" / "public" / "poses"

# Original → Name im Panel. Der Willkommensgruß stammt aus dem README-Bild
# (ohne Schriftzug, deshalb mit Ausschnitt).
# Posen mit dunklen Flächen am Rand bekommen zusätzlich eine Variante mit
# heller Sticker-Kante für das dunkle Thema.
POSES: dict[str, tuple[str, tuple[int, int, int, int] | None]] = {
    "Stift Block.png": ("ask", None),
    "Rechenschieber.png": ("plan", None),
    "Stecker Steckdose.png": ("plug", None),
    "Lichtschalter.png": ("switch", None),
    "Schalter.png": ("lever", None),
    "readme.png": ("welcome", (0, 0, 1536, 712)),
    "typ2 stecker.png": ("ev", None),
    "energy_joe_fernglas.png": ("scout", None),
    "energy_joe_lupe.png": ("inspect", None),
    "fuesse hoch.png": ("relax", None),
}
# Ganze Szenen ohne weißen Hintergrund: nur verkleinern, nicht freistellen.
SCENES: dict[str, str] = {
    "akku nacht.png": "night-charge",
    "schlafen.png": "sleep",
    "brille buch.png": "learn",
}
SCENE_WIDTH = 960
DARK_VARIANTS = {"welcome"}
MAX_WIDTH = 720
WHITE_MIN = 226  # ab hier gilt ein Pixel als Hintergrundweiß
EDGE_BAND = 3  # Breite der weichen Kante in Pixeln


def is_white(r: int, g: int, b: int) -> bool:
    return min(r, g, b) >= WHITE_MIN and max(r, g, b) - min(r, g, b) <= 24


def cut_out(img: Image.Image) -> Image.Image:
    """Macht den randverbundenen weißen Hintergrund transparent."""
    rgb = img.convert("RGB")
    w, h = rgb.size
    src = rgb.load()
    background = bytearray(w * h)
    stack = [(x, 0) for x in range(w)] + [(x, h - 1) for x in range(w)]
    stack += [(0, y) for y in range(h)] + [(w - 1, y) for y in range(h)]
    while stack:
        x, y = stack.pop()
        i = y * w + x
        if background[i] or not is_white(*src[x, y]):
            continue
        background[i] = 1
        if x > 0:
            stack.append((x - 1, y))
        if x < w - 1:
            stack.append((x + 1, y))
        if y > 0:
            stack.append((x, y - 1))
        if y < h - 1:
            stack.append((x, y + 1))

    # Abstand jedes Motivpixels zum Hintergrund (nur im schmalen Randband).
    distance = [0 if background[i] else EDGE_BAND + 1 for i in range(w * h)]
    for _ in range(EDGE_BAND):
        nxt = distance[:]
        for y in range(h):
            row = y * w
            for x in range(w):
                i = row + x
                if distance[i] <= EDGE_BAND:
                    continue
                best = min(
                    distance[i - 1] if x > 0 else EDGE_BAND + 1,
                    distance[i + 1] if x < w - 1 else EDGE_BAND + 1,
                    distance[i - w] if y > 0 else EDGE_BAND + 1,
                    distance[i + w] if y < h - 1 else EDGE_BAND + 1,
                )
                if best + 1 < nxt[i]:
                    nxt[i] = best + 1
        distance = nxt

    out = Image.new("RGBA", (w, h))
    dst = out.load()
    for y in range(h):
        for x in range(w):
            i = y * w + x
            r, g, b = src[x, y]
            if background[i]:
                dst[x, y] = (r, g, b, 0)
            elif distance[i] <= EDGE_BAND:
                # Kantenpixel: Deckkraft aus dem Weißanteil schätzen und das
                # eingemischte Weiß herausrechnen, damit kein heller Saum bleibt.
                alpha = max(0.0, min(1.0, (255 - min(r, g, b)) / (255 - 20)))
                if alpha <= 0.02:
                    dst[x, y] = (r, g, b, 0)
                else:
                    fg = [round((c - (1 - alpha) * 255) / alpha) for c in (r, g, b)]
                    dst[x, y] = (*(max(0, min(255, c)) for c in fg), round(alpha * 255))
            else:
                dst[x, y] = (r, g, b, 255)
    return out


def main() -> None:
    TARGET.mkdir(parents=True, exist_ok=True)
    for source, (name, box) in POSES.items():
        img = Image.open(SOURCE / source)
        if box:
            img = img.crop(box)
        pose = cut_out(img)
        pose = pose.crop(pose.getchannel("A").getbbox())
        if pose.width > MAX_WIDTH:
            height = round(pose.height * MAX_WIDTH / pose.width)
            pose = pose.resize((MAX_WIDTH, height), Image.LANCZOS)
        pose.save(TARGET / f"{name}.webp", quality=88, method=6)
        if name in DARK_VARIANTS:
            padded = Image.new("RGBA", (pose.width + 16, pose.height + 16))
            padded.alpha_composite(pose, (8, 8))
            sticker(padded, 6).save(TARGET / f"{name}-dark.webp", quality=88, method=6)
        print(f"{source:24s} → poses/{name}.webp  {pose.width}×{pose.height}")
    for source, name in SCENES.items():
        scene = Image.open(SOURCE / source).convert("RGB")
        height = round(scene.height * SCENE_WIDTH / scene.width)
        scene = scene.resize((SCENE_WIDTH, height), Image.LANCZOS)
        scene.save(TARGET / f"{name}.webp", quality=86, method=6)
        print(f"{source:24s} → poses/{name}.webp  {scene.width}×{scene.height}")


if __name__ == "__main__":
    main()
