# Veröffentlichung

Energy Joe wird aus diesem Repository veröffentlicht. Das Repository ist öffentlich und lässt sich als benutzerdefiniertes Repository über HACS installieren; Versionen kommen als GitHub-Releases (siehe `docs/DEVELOPMENT.md`, Abschnitt Versionen). Diese Liste hält fest, was für die offizielle Veröffentlichung noch fehlt.

## Bleibt unverändert

- **Domain `energy_joe`** – sie steckt in Entity-IDs, Service-Namen und den Speicherdateien der Nutzer. Nie ändern.
- Ordnername `custom_components/energy_joe` und Panel-Pfad `energy-joe`

## Vor der offiziellen Veröffentlichung

1. README: Hinweis „Noch in Entwicklung“ entfernen, Screenshots ergänzen
2. Beschreibung und Topics des Repositorys setzen (`home-assistant`, `hacs`, `integration`)
3. HACS-Validierung als GitHub Action ergänzen (hassfest läuft schon)
4. Eigene Apps für die Anmeldung bei Microsoft und Google eintragen (`mail/oauth.py`)
5. Antrag auf Aufnahme in die HACS-Standardliste – Voraussetzungen siehe [HACS-Dokumentation](https://www.hacs.xyz/docs/publish/include/)

Erledigt: Repository öffentlich, Releases mit Versionsnummern, hassfest grün.

## Brand-Bilder

Liegen in `custom_components/energy_joe/brand/` und werden von Home Assistant ab 2026.3 direkt angezeigt. Ein Pull Request an `home-assistant/brands` ist dafür nicht nötig.
