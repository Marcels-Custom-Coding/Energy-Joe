# Veröffentlichung

Energy Joe wird aus diesem Repository veröffentlicht, sobald die Entwicklung abgeschlossen ist. Bis dahin bleibt es privat. Diese Liste hält fest, was dann zu tun ist.

## Bleibt unverändert

- **Domain `energy_joe`** – sie steckt in Entity-IDs, Service-Namen und den Speicherdateien der Nutzer. Nie ändern.
- Ordnername `custom_components/energy_joe` und Panel-Pfad `energy-joe`

## Vor der Veröffentlichung

1. README: Work-in-progress-Hinweis entfernen, Installation über HACS beschreiben, Screenshots ergänzen
2. `manifest.json`: `version` auf die erste Release-Version setzen
3. Repository öffentlich stellen, Beschreibung und Topics setzen (`home-assistant`, `hacs`, `integration`)
4. GitHub Actions `hassfest` und HACS-Validierung grün
5. Erstes GitHub-Release, Tag gleich `version` aus `manifest.json`
6. Antrag auf Aufnahme in die HACS-Standardliste – Voraussetzungen siehe [HACS-Dokumentation](https://www.hacs.xyz/docs/publish/include/)

## Brand-Bilder

Liegen in `custom_components/energy_joe/brand/` und werden von Home Assistant ab 2026.3 direkt angezeigt. Ein Pull Request an `home-assistant/brands` ist dafür nicht nötig.
