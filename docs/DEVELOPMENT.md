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
- Panel ohne Home Assistant ansehen: im Repo-Wurzelverzeichnis `python3 -m http.server 8767` starten und `http://localhost:8767/panel/dev/` öffnen. Parameter: `?dark=1`, `?lang=en`, `?step=scan|questions|done`, `?done=1` (Einrichtung abgeschlossen), `?page=settings`, `?mode=off|advisory|live`, `?sample=generic`, `?audit=1`
- Daten der Testseite neu erzeugen (nach Änderungen an Erkennung, Modell, Historie, Planen oder Lernen): `.venv/bin/python scripts/make_dev_samples.py` – schreibt `panel/dev/sample-*.json` aus den erfundenen Haushalten in `tests/snapshots.py`, dazu drei Wochen erfundenen Verlauf (mit Außentemperatur, Geräteverbrauch, Kalender und einem Tag mit Besuch) mit festen Plänen, nachgespielten Nächten (die letzte vorläufig) und dem, was Joe daraus lernt. Mit `?done=1` hat Joe schon drei Wochen gelernt; Fragen beantworten, „Lernen zurücksetzen“ (auch je Bereich) und „Wieder selbst lernen“ funktionieren auf der Testseite
- Joes Historie liegt in `.storage/energy_joe.history` (Index) und `.storage/energy_joe.history.JJJJ-MM` (eine Datei pro Monat). Ein Tag enthält seine Stunden, die Prognose, den festen Plan der Nacht, die an ihm beginnt, und dessen Auswertung (`evaluation`, mit `final: false` solange der Tag des Plans läuft)
- Was Joe gelernt hat, steht in der Konfiguration unter `learned` (Herkunft „gelernt“); einen selbst eingestellten Puffer überschreibt er nie

## Lernen

- Die Modelle stehen in `custom_components/energy_joe/learn/models.py`: kleinste Quadrate, Mediane und Mittelwerte über gespeicherte Tage, damit jede Zahl im Panel erklärbar bleibt. Der Lernlauf (`learn/learner.py`) baut sie einmal am Tag (`learned.models_day`) aus bis zu 60 Tagen.
- Verbrauch: `Tag = Grundlast + Arbeitstag + Heizgrade (unter 15 °C) + Kühlgrade (über 22 °C) [+ Anwesenheitsstunden]`. Tage mit der Antwort Besuch, unterwegs oder „etwas Besonderes“ (`answer` am Tag) zählen nicht. Die Planung skaliert den Tagesgang von morgen mit dem Modell, wenn es mindestens 40 % erklärt (`plan/inputs.py`, `async_tomorrow`).
- Kalender: `learn/context.py` fragt `calendar.get_events` je Person; die Regeln (`calendar.rules`, Stichwort → Art des Tages) prüft Joe in ihrer Reihenfolge, ganztägige Termine zuerst. Die Arten vergangener Tage stehen als `labels` am Tag.
- Prognose: Faktoren je Wetterlage (`solar_classes`, Grenzen relativ zum besten Tag der letzten 30 Tage) und – wenn es mehrere Prognose-Integrationen gibt – Güte je Quelle (`sources`); die Alternativen speichert der Beobachter als `fc.alt` am Tag.
- Speicher: Größe und Wirkungsgrad aus `entladen = η · geladen − Größe · √η · ΔSoC`; die Planung nimmt die gemessene Größe, außer sie ist selbst eingetragen oder passt nicht zum Gerätewert (50–115 %).
- Zurücksetzen je Bereich (`forecast`, `consumption`, `battery`, `hot_water`) merkt sich den Zeitpunkt in `learned.reset`; ältere Tage zählen für diesen Bereich nicht mehr.

## Dynamische Tarife

- Preise liest `custom_components/energy_joe/plan/prices.py`: zuerst Preislisten in den Attributen des Preis-Sensors (Start, optional Ende, Preis; Einheiten €/kWh, ct/kWh, €/MWh), sonst die Aktionen von Tibber (`tibber.get_prices`), Nord Pool aus Home Assistant (`nordpool.get_prices_for_date`), EnergyZero und easyEnergy. Ein neues Format ist meist nur ein weiterer Schlüssel in `START_KEYS`, `END_KEYS` oder `PRICE_KEYS`.
- Der Planer (`plan/planner.py`) bekommt Preise je Stunde (`Hour.price`) und je Viertelstunde (`Hour.quarters`). Mit `PlanInput.search` probiert `best_window` jedes Fenster aus ganzen Stunden im Suchzeitraum (bei laufenden Nacht-Aktionen mindestens so lang, wie sie brauchen) und nimmt das mit den geringsten Kosten. Geladen wird in den günstigsten Stunden des Fensters; `charge_slots` legt in jeder Ladestunde die günstigsten Viertelstunden fest, die der Ausführer abarbeitet (nach dem letzten Block lädt er weiter, bis das Ziel erreicht ist).
- Den dynamischen Plan legt Joe vor Beginn des Suchzeitraums fest (`plan_offset_min`), nach einem Neustart im Suchzeitraum sofort.

## Speicher steuern

- Grundgriffe (Rollen) und das Wissen über Integrationen stehen in `custom_components/energy_joe/control/profiles.py`: je Integration die Schlüssel der Entitäten (Ende der unique_id oder translation_key), die Bedeutung der Optionen einer Betriebsart, Vorher-Schalter (`prepare`), umgekehrte Werte (`inverted`) und – für Integrationen, die über Dienste gesteuert werden – Schritte. Eine neue Integration ist ein neuer Eintrag dort plus ein Test in `tests/test_profiles.py`.
- Nur Fronius und Marstek (OmniBattery) sind an echter Hardware geprüft (`proven`); alle anderen Profile stammen aus dem Quellcode der Integrationen. Deshalb steuert Joe einen Speicher erst nach einem bestandenen Testlauf.
- Was Joe verändert hat, merkt er sich in `.storage/energy_joe.control` und stellt es zurück, bis alles wieder stimmt.
- Sicherheit im Ausführer: Zieht das Haus mehr als das Netzlimit (`rules.guard_grid`), hält er statt zu laden, jeweils fünf Minuten; steigt ein ladender Speicher eine halbe Stunde lang nicht, meldet er das einmal pro Nacht (Reparaturhinweis `no_progress`).

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
