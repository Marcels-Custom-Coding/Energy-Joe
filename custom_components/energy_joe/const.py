"""Constants for Energy Joe."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "energy_joe"
NAME: Final = "Energy Joe"

PANEL_URL_PATH: Final = "energy-joe"
PANEL_WEBCOMPONENT: Final = "energy-joe-panel"
PANEL_TITLE: Final = "Energy Joe"
PANEL_ICON: Final = "energy-joe:joe"

STATIC_URL: Final = "/energy_joe_static"
FRONTEND_DIR: Final = "frontend"
PANEL_BUNDLE: Final = "energy-joe-panel.js"
ICONS_BUNDLE: Final = "energy-joe-icons.js"
# Dashboard cards ("Joe heute Nacht", "Auto laden"), loaded on every page.
CARDS_BUNDLE: Final = "energy-joe-cards.js"
