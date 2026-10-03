# Entwicklung

## Umgebung

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements_test.txt
cd panel && npm install
```

- Tests: `.venv/bin/pytest`
- Linter: `.venv/bin/ruff check .`
- Panel bauen: `npm --prefix panel run build` (der Build liegt eingecheckt in `custom_components/energy_joe/frontend/`)
- Panel ohne Home Assistant ansehen: im Repo-Wurzelverzeichnis `python3 -m http.server 8767` starten und `http://localhost:8767/panel/dev/` öffnen. Parameter: `?dark=1`, `?lang=en`, `?step=scan|questions|done`, `?done=1` (Einrichtung abgeschlossen), `?page=settings`, `?mode=off`, `?sample=generic`, `?audit=1`
- Daten der Testseite neu erzeugen (nach Änderungen an Erkennung, Modell, Historie, Planen oder Lernen): `.venv/bin/python scripts/make_dev_samples.py` – schreibt `panel/dev/sample-*.json` aus den erfundenen Haushalten in `tests/snapshots.py`, dazu zwei Wochen erfundenen Verlauf mit festen Plänen, nachgespielten Nächten (die letzte vorläufig) und dem, was Joe daraus lernt. Mit `?done=1` hat Joe schon zwei Wochen gelernt; „Lernen zurücksetzen“ und „Wieder selbst lernen“ funktionieren auf der Testseite
- Joes Historie liegt in `.storage/energy_joe.history` (Index) und `.storage/energy_joe.history.JJJJ-MM` (eine Datei pro Monat). Ein Tag enthält seine Stunden, die Prognose, den festen Plan der Nacht, die an ihm beginnt, und dessen Auswertung (`evaluation`, mit `final: false` solange der Tag des Plans läuft)
- Was Joe gelernt hat, steht in der Konfiguration unter `learned` (Herkunft „gelernt“); einen selbst eingestellten Puffer überschreibt er nie

## Tooltips

Alles, was jemand im Panel eingibt oder entscheidet, bekommt einen Tooltip (`<joe-tip>`, Texte als `tip.<name>.title/.text/.hint` in `panel/src/i18n/`). Der Container aus Bedienelement und Tooltip trägt `data-tipped`; reine Navigation wie „Zurück“ trägt `data-notip`. Mit `?audit=1` rahmt die Testseite jedes Bedienelement ohne Tooltip rot ein, `joeAudit()` in der Browser-Konsole listet sie auf.

## Grafiken

Die Originale liegen lokal in `branding/` und werden nicht eingecheckt. Daraus erzeugen:

- `scripts/make_brand.py` – Icon und Logo für Home Assistant, Logo fürs Panel, README-Bild
- `scripts/make_poses.py` – Joes Posen, freigestellt, als WebP unter `panel/public/poses/`
- `scripts/make_icon.py` – Seitenleisten-Icon aus `branding/logo.svg`

Danach `npm --prefix panel run build`.

## Auf Home Assistant testen

Installiert wird ausschließlich über HACS aus diesem Repository (benutzerdefiniertes Repository, Typ Integration). HACS lädt nur öffentliche Repositories.
