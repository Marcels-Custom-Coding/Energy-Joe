"""Erzeugt alle Bildgrößen aus den Master-Dateien in branding/.

Aufruf: .venv/bin/python scripts/make_brand.py (benötigt Pillow: .venv/bin/pip install pillow)
"""

from __future__ import annotations

import colorsys
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
MASTER_ICON = ROOT / "branding" / "icon.png"
MASTER_README = ROOT / "branding" / "readme.png"
BRAND = ROOT / "custom_components" / "energy_joe" / "brand"
PANEL_PUBLIC = ROOT / "panel" / "public"
DOCS_IMAGES = ROOT / "docs" / "images"

HEAD_BOX = (95, 60, 815, 780)  # Joe mit ganzem Hut und Daumen, ohne Schriftzug
BOLT_ZONE = (620, 0, 720, 720)  # im Kopfausschnitt: hier ragt der Blitz hinein
WORDMARK_TOP = 785  # ab hier beginnt der Schriftzug „ENERGY JOE“
CREAM = (246, 239, 226)


def sticker(img: Image.Image, width: int) -> Image.Image:
    """Legt einen cremefarbenen Rand hinter das Motiv (für dunkle Flächen)."""
    alpha = img.getchannel("A")
    grown = alpha.filter(ImageFilter.MaxFilter(width * 2 + 1))
    edge = Image.new("RGBA", img.size, (*CREAM, 0))
    edge.putalpha(grown)
    edge.alpha_composite(img)
    return edge


def remove_bolt(head: Image.Image) -> Image.Image:
    """Entfernt Blitzreste am rechten Rand des Kopfausschnitts.

    Blitzfarben sind deutlich gesättigter als Hauttöne (> 85 % gegenüber
    rund 70 %); danach fallen alle Pixel weg, die nicht mit Joe verbunden sind.
    """
    out = head.copy()
    px = out.load()
    x0, y0, x1, y1 = BOLT_ZONE
    for y in range(y0, y1):
        for x in range(x0, x1):
            r, g, b, a = px[x, y]
            if not a:
                continue
            hue, sat, val = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            if 0.095 <= hue <= 0.18 and sat > 0.85 and val > 0.7:
                px[x, y] = (r, g, b, 0)
    return keep_connected(out, seed=(out.width // 2, out.height // 2))


def keep_connected(img: Image.Image, seed: tuple[int, int]) -> Image.Image:
    """Behält nur die deckende Fläche, die mit dem Startpunkt verbunden ist."""
    w, h = img.size
    alpha = img.getchannel("A").load()
    keep = bytearray(w * h)
    stack = [seed]
    while stack:
        x, y = stack.pop()
        i = y * w + x
        if keep[i] or alpha[x, y] <= 8:
            continue
        keep[i] = 1
        if x > 0:
            stack.append((x - 1, y))
        if x < w - 1:
            stack.append((x + 1, y))
        if y > 0:
            stack.append((x, y - 1))
        if y < h - 1:
            stack.append((x, y + 1))
    out = img.copy()
    px = out.load()
    for y in range(h):
        for x in range(w):
            if not keep[y * w + x]:
                r, g, b, _ = px[x, y]
                px[x, y] = (r, g, b, 0)
    return out


def split(img: Image.Image) -> tuple[Image.Image, Image.Image]:
    """Trennt die Figur (oben) vom Schriftzug (unten)."""
    figure = img.copy()
    figure.paste((0, 0, 0, 0), (0, WORDMARK_TOP, img.width, img.height))
    wordmark = img.copy()
    wordmark.paste((0, 0, 0, 0), (0, 0, img.width, WORDMARK_TOP))
    return figure, wordmark


def light_wordmark(img: Image.Image) -> Image.Image:
    """Färbt den schwarzen Teil des Schriftzugs hell (für dunkle Flächen)."""
    out = img.copy()
    px = out.load()
    w, h = out.size
    for y in range(WORDMARK_TOP, h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a and (r * 299 + g * 587 + b * 114) / 1000 < 90:
                px[x, y] = (*CREAM, a)
    return out


def save_png(img: Image.Image, path: Path, size: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.resize((size, size), Image.LANCZOS).save(path, optimize=True)


def save_webp(img: Image.Image, path: Path, size: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.resize((size, size), Image.LANCZOS).save(path, quality=90, method=6)


def main() -> None:
    master = Image.open(MASTER_ICON).convert("RGBA")
    head = remove_bolt(master.crop(HEAD_BOX))
    head_dark = sticker(head, 10)
    figure, wordmark = split(master)
    logo_dark = sticker(figure, 12)
    logo_dark.alpha_composite(light_wordmark(wordmark))

    # Home Assistant (ab 2026.3): custom_components/<domain>/brand/
    save_png(head, BRAND / "icon.png", 256)
    save_png(head, BRAND / "icon@2x.png", 512)
    save_png(head_dark, BRAND / "dark_icon.png", 256)
    save_png(head_dark, BRAND / "dark_icon@2x.png", 512)
    save_png(master, BRAND / "logo.png", 256)
    save_png(master, BRAND / "logo@2x.png", 512)
    save_png(logo_dark, BRAND / "dark_logo.png", 256)
    save_png(logo_dark, BRAND / "dark_logo@2x.png", 512)

    # Panel
    save_webp(head, PANEL_PUBLIC / "joe-head.webp", 256)
    save_webp(head_dark, PANEL_PUBLIC / "joe-head-dark.webp", 256)
    save_webp(master, PANEL_PUBLIC / "logo.webp", 640)
    save_webp(logo_dark, PANEL_PUBLIC / "logo-dark.webp", 640)

    # README
    readme = Image.open(MASTER_README).convert("RGB")
    width = 1280
    height = round(readme.height * width / readme.width)
    DOCS_IMAGES.mkdir(parents=True, exist_ok=True)
    readme.resize((width, height), Image.LANCZOS).save(
        DOCS_IMAGES / "energy-joe.jpg", quality=88, optimize=True, progressive=True
    )


if __name__ == "__main__":
    main()
