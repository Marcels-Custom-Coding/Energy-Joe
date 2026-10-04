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

## Hausverbrauch und flexible Geräte

- Eine Stunde (`observe/records.py`, `compose`) rechnet den Hausverbrauch wie das Energie-Dashboard: Netz rein − raus + PV − Speicher laden + entladen (`home_calc`). Ein Hausverbrauchs-Sensor steht nur ein, wenn das nicht geht (kein Netz, Speicher ohne Messung), und wird sonst als `home_sensor` zum Vergleich gespeichert; `learn/models.py`, `home_check`, vergleicht beide über zwei Wochen. Ältere Stunden (Format 1 im Index der Historie) liest Joe einmal neu ein.
- Flexible Geräte (`model.flexible_consumers`): die Wallbox (Art `ev`, außer „Auch aus dem Hausspeicher“) und Geräte mit `runs` = `surplus` oder `cheap`. Planen (`plan/inputs.py`, `consumption_profiles`), Lernen (`daily_rows`), Rückfragen und Auswerten (`learn/evaluate.py`, über `meta.consumption.flexible` des Plans) nehmen `base_home`: Hausverbrauch ohne diese Geräte.

## Netzdienlich

- Planen (`plan/planner.py`, `_grid_friendly`): Mit `rules.grid_friendly` und Speichern mit Ladegrenze (`charge_limit`, deren Ladeleistung zählt als `defer_kw`) sucht Joe die späteste Stunde bis zur stärksten Überschuss-Stunde, ab der die Speicher mit 80 % der Prognose noch so voll werden wie ohne Warten (Kosten höchstens 2 ct mehr, mit `rules.grid_first` 30 ct). Das steht als `day` (`defer_until`, `held_kwh`, `cost`) am Plan; die Stunden des Plans zeigen den Tag mit dem Warten, die Kosten der Nacht bleiben die der Nacht.
- Steuern (`control/executor.py`, `_async_day`): nach dem Fenster bis `defer_until` Ladegrenze 0 (`RoleAdapter.defer`), nur getestete Speicher, nur „Vorschlagen“ (mit Ja für die Nacht) und „Live“. Reicht der Rest der Sonne (× 0,8) nicht mehr für den freien Platz, gibt Joe früher frei (`day_released`). Freigeben am Ende mit Grund `day_done` (keine zweite Morgen-Nachricht).

## Dynamische Tarife

- Preise liest `custom_components/energy_joe/plan/prices.py`: zuerst Preislisten in den Attributen des Preis-Sensors (Start, optional Ende, Preis; Einheiten €/kWh, ct/kWh, €/MWh), sonst die Aktionen von Tibber (`tibber.get_prices`), Nord Pool aus Home Assistant (`nordpool.get_prices_for_date`), EnergyZero und easyEnergy. Ein neues Format ist meist nur ein weiterer Schlüssel in `START_KEYS`, `END_KEYS` oder `PRICE_KEYS`.
- Der Planer (`plan/planner.py`) bekommt Preise je Stunde (`Hour.price`) und je Viertelstunde (`Hour.quarters`). Mit `PlanInput.search` probiert `best_window` jedes Fenster aus ganzen Stunden im Suchzeitraum (bei laufenden Nacht-Aktionen mindestens so lang, wie sie brauchen) und nimmt das mit den geringsten Kosten. Geladen wird in den günstigsten Stunden des Fensters; `charge_slots` legt in jeder Ladestunde die günstigsten Viertelstunden fest, die der Ausführer abarbeitet (nach dem letzten Block lädt er weiter, bis das Ziel erreicht ist).
- Den dynamischen Plan legt Joe vor Beginn des Suchzeitraums fest (`plan_offset_min`), nach einem Neustart im Suchzeitraum sofort.

## Auto nach Bedarf laden

- Auto-Integrationen und die Schlüssel ihrer Entitäten (Ladestand, Reichweite, Akkugröße, Kilometerstand, Verbrauch, eingesteckt, lädt, Außentemperatur) stehen in `discovery/knowledge.py` (`CAR_KEYS`), geprüft am Quellcode der Integrationen im Oktober 2026. Einheiten (mi, kJ, Wh/km, km/kWh) rechnet `observe/readings.py` um. Autos sind nie Hausspeicher.
- Bedarf (`plan/ev.py`): Kilometer morgen (Termine hin und zurück oder die übliche Strecke, je nachdem, was mehr ist) plus Reserve, mal Verbrauch bei Temperatur und Regen (Tabelle aus ANL-, Recurrent-, Geotab- und ADAC-Daten; 18 kWh/100 km an der Batterie als Startwert), Ladeverlust 10 %. Die Nacht-Aktion läuft dann nur so lange, wie die fehlende Energie braucht, und der Ausführer schaltet ab, sobald der Ladestand erreicht ist.
- Termine und Entfernungen (`plan/trips.py`): `calendar.get_events`, Ort aus `location`; Entfernung über Waze (`waze_travel_time.get_travel_times`, ab HA 2026.8 ohne Eintrag), Google (`google_travel_time.get_travel_times` mit Eintrag) oder OpenStreetMap (Photon und OSRM, Adressen in `routing` einstellbar); Zonen ohne Dienst über Luftlinie × 1,3. Gespeichert in `.storage/energy_joe.places`, Korrekturen des Nutzers gewinnen.
- Gelernt (`learn/models.py`, `car_days`/`car_model`): Verbrauch aus fallendem Ladestand bei steigendem Kilometerstand, mit Aufschlag je Grad unter 15 °C, und die übliche Strecke (80. Perzentil) für Werktage und freie Tage.
- Testseite: `?need=1` zeigt die Nacht mit Laden nach Bedarf.
- Woher die Termine eines Autos kommen, sagt `need.source`: `ha` (fertiger Kalender in Home Assistant, `need.calendars`), `mailbox` (Postfach des Autos ohne Kalender, `need.mailbox`) oder `account` (Postfach mit Kalender, `need.account`). Wer das Auto einladen darf, steht je Auto in `need.allowed`. Die Kalender der gewählten Personen zählen immer (`plan/trips.py`).
- Joes Kalender je Auto (`plan/car_calendar.py`, `calendar.py`) gibt es nur für `mailbox`: Termine in `.storage/energy_joe.calendar` je Aktions-Id, als Kalender-Entität in Home Assistant bearbeitbar. Wechselt das Auto den Weg, verschwindet die Entität (Registereintrag entfernt), die Termine bleiben gespeichert. Abo-Link `/api/energy_joe/calendar/<geheimnis>/<auto>.ics` (`calendar_feed.py`, ohne Anmeldung, Geheimnis im Kalender-Speicher); Befehl `energy_joe/calendar/links` liefert die Pfade und mit `renew` ein neues Geheimnis.
- „Jetzt laden“ (`control/executor.py`, `async_boost`, Befehl `energy_joe/control/boost`): schaltet die Aktion sofort ein, in jedem Modus außer „Aus“, bis der Ladestand (`need.soc_entity`) oder die Reichweite plus Reserve (`need.range_entity`) erreicht ist, höchstens 24 Stunden. Steht in `data["boost"]`, schlägt den Nachtplan, und Freigaben lassen die Entität in Ruhe, solange es läuft.
- „Heute Nacht laden bis …“ (`async_action_tonight` mit `target`/`unit`, Befehl `energy_joe/control/action_tonight`): der Schalter „Heute Nacht“ plus ein Ziel in `data["tonight_target"]`; die Aktion läuft im ganzen günstigen Fenster bis zu diesem Ziel und endet mit der Nacht.

## Postfach des Autos ohne Kalender

- `mail/ical.py` liest Einladungen (iMIP: METHOD, UID, SEQUENCE, Zeiten mit UTC, TZID – auch Windows-Namen von Outlook –, ganzen Tagen und DURATION) und schreibt Zusagen (METHOD:REPLY). `mail/mailbox.py` holt neue Mails per IMAP (UIDVALIDITY und letzte UID, beim ersten Mal 30 Tage zurück) und sendet per SMTP, beides mit Passwort; Server für web.de, GMX, Gmail und T-Online sind hinterlegt. Beides blockiert und läuft im Executor.
- `mail/inbox.py` (`CarInboxes`) schaut alle fünf Minuten in das Postfach jedes Autos mit `need.source == "mailbox"`. Eine Einladung zählt, wenn der Absender auf `need.allowed` steht (oder der Organisator, aber nur aus derselben Domain wie der Absender). REQUEST trägt in Joes Kalender für das Auto ein oder ändert (höhere SEQUENCE gewinnt) und sagt zu, CANCEL entfernt. Kommt ein Absender auf die Liste, liest Joe das Postfach noch einmal von vorn (schon Zugesagtes wird nicht doppelt beantwortet). Passwort und Stand je Auto in `.storage/energy_joe.mailbox`, nicht in der Konfiguration; die Diagnose schwärzt Adressen und letzte Einladungen.
- Bis 0.3 gab es ein Postfach für alle Autos (`mailbox` in der Konfiguration); Version 4 der Konfiguration verteilt es auf die Autos, das Passwort geht an das erste.

## Postfach des Autos mit Kalender

- `accounts.py` (`CarAccounts`): Google über die Calendar API (`calendars/primary/events` mit `singleEvents`, Zusage per PATCH der Teilnehmerliste mit eigenem `responseStatus: accepted` und `sendUpdates=all`), Microsoft über Microsoft Graph (`/me/calendarView`, Zusage mit `/me/events/{id}/accept`), beide mit Geräte-Code-Anmeldung; iCloud, Infomaniak und andere über CalDAV (Erkennung über current-user-principal und calendar-home-set, Termine per REPORT mit time-range, Zusage per PUT mit eigenem ATTENDEE auf ACCEPTED). Zugesagt wird nur Absendern aus `need.allowed`; unbeantwortete Einladungen anderer zählen nicht als Fahrt. Termine eines Tages werden zehn Minuten zwischengespeichert; Passwörter und Tokens je Auto in `.storage/energy_joe.accounts`.
- Anmeldung (`mail/oauth.py`, `SignIn`): Microsoft `outlook` (privat, Mandant `consumers`) und `microsoft` (Firma, Mandant aus der Einstellung, sonst `organizations`), Bereiche `CALENDAR_SCOPES`; ohne eigene App-ID gilt Joes App (`JOE_CLIENT_ID`). Google mit einem Client vom Typ „Fernseher und Geräte mit begrenzter Eingabe“ (Client-ID und -Schlüssel, `JOE_GOOGLE_CLIENT_ID`/`JOE_GOOGLE_CLIENT_SECRET`, sonst die eigene App mit Schlüssel im Konten-Speicher) und dem Bereich `https://www.googleapis.com/auth/calendar`. Googles Liste für die Geräte-Anmeldung nennt den Kalender nicht; die Google-Kalender-Integration von Home Assistant meldet sich aber genauso an. Für das Postfach selbst (IMAP) bleibt bei Gmail das App-Passwort: der volle Mail-Zugriff ist bei Google ein „eingeschränkter“ Bereich mit kostenpflichtiger Prüfung.

## Warmwasser

- Gefunden wird Warmwasser als Verbraucher im Energie-Dashboard (Art `hot_water`). Die Frage „Wie wird euer Wasser warm?“ bietet dann eine Nacht-Aktion an; `panel/src/hot-water.ts` schlägt Fühler und Schalter nach Wörtern in Entity-ID, Name und Gerätename vor (Speicher vor Zirkulation und Ausgang).

## Speicher steuern

- Grundgriffe (Rollen) und das Wissen über Integrationen stehen in `custom_components/energy_joe/control/profiles.py`: je Integration die Schlüssel der Entitäten (Ende der unique_id oder translation_key), die Bedeutung der Optionen einer Betriebsart, Vorher-Schalter (`prepare`), umgekehrte Werte (`inverted`) und – für Integrationen, die über Dienste gesteuert werden – Schritte. Eine neue Integration ist ein neuer Eintrag dort plus ein Test in `tests/test_profiles.py`.
- Nur Fronius und Marstek (OmniBattery) sind an echter Hardware geprüft (`proven`); alle anderen Profile stammen aus dem Quellcode der Integrationen. Deshalb steuert Joe einen Speicher erst nach einem bestandenen Testlauf.
- Omnibattery regelt den Speicher selbst und nimmt Betriebsart und Leistung nur im manuellen Modus an: `prepare` schaltet `battery_manual_mode` des Akkus ein (nicht den Schalter des ganzen Systems), `pace` wartet nach jedem Befehl 1 s (nach dem Vorher-Schalter 2 s, `writes.settle`). Danach gehören Betriebsart und Leistung wieder dem Regler der Integration (`loop_owned`): Joe stellt sie nur zurück, solange er den manuellen Modus noch hält, und vergisst sie, sobald er wieder aus ist (`executor._settle_loop_owned`) – auch im Testlauf.
- Kennt ein Profil später mehr (z. B. einen Vorher-Schalter), ergänzt Joe das beim Start bei schon eingerichteten Speichern (`discovery.async_profile_updates`), außer der Nutzer hat es selbst eingestellt.
- Automationen, die auf die Speicher schreiben (`control/automations.py`): gesucht wird in den aufgelösten Aktionen (`action_script.sequence`, auch aufgerufene Skripte und Geräte-Aktionen) nach Entitäten und Geräten der Speicher – Joes Regler, Gerät des Akkus und damit verbundene Geräte, bei `automation_scope="entry"` (Omnibattery) die ganze Integration. Bedingungen, abgeschaltete Schritte und reine Lese-Aktionen zählen nicht. Was Joe ausschaltet, steht mit Zeit und Grund in `data["automations_off"]` und im Logbuch der Automation; beim Entfernen der Integration schaltet Joe sie wieder ein.
- Was Joe verändert hat, merkt er sich in `.storage/energy_joe.control` und stellt es zurück, bis alles wieder stimmt.
- Sicherheit im Ausführer: Zieht das Haus mehr als das Netzlimit (`rules.guard_grid`), hält er statt zu laden, jeweils fünf Minuten; steigt ein ladender Speicher eine halbe Stunde lang nicht, meldet er das einmal pro Nacht (Reparaturhinweis `no_progress`).

## Panel nach einem Update

Nach einem Update lädt Home Assistant das neue Panel in die offene Seite, behält aber die alten Klassen schon bekannter Elemente. `panel/src/define.ts` vergleicht deshalb die eingebaute Version (`__JOE_VERSION__` aus `panel/package.json`, gesetzt in `vite.config.ts`) und blendet sonst „Energy Joe wurde aktualisiert – Neu laden“ ein. Deshalb nach dem Versionssprung immer neu bauen.

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

## Versionen

Kleine Schritte zählen hinten hoch (0.1.0 → 0.1.1), größere vorne (0.2.0) – nie „0.12“ für 0.1.2, HACS zählt das höher als 0.2. HACS bietet nur GitHub-Releases an:

1. `.venv/bin/python scripts/bump_version.py patch` (oder `minor`) – setzt die Version in `manifest.json` und `panel/package*.json` und legt einen Eintrag in `CHANGELOG.md` an
2. Änderungen in `CHANGELOG.md` eintragen, committen, pushen, CI abwarten
3. Release mit dem Tag gleich der Version (ohne „v“) und dem Abschnitt aus `CHANGELOG.md` als Text; Releases immer aufsteigend
