# Energy Joe

<img src="docs/images/energy-joe.jpg" alt="Energy Joe" width="50%">

> **Noch in Entwicklung.** Energy Joe ist noch nicht offiziell veröffentlicht. Ausprobieren kannst du ihn schon – am besten erst eine Weile im Simulationsmodus.

Energy Joe ist eine lernende Home-Assistant-Integration für Haushalte mit PV-Anlage und Speicher. Er verschiebt Verbräuche – Hausspeicher, E-Auto, Warmwasser – in günstige Tarifzeiten, wenn die Sonne am nächsten Tag nicht reicht, und lernt jeden Tag aus Prognose, Verbrauch, Wetter und Alltag dazu.

Joe braucht kein Vorwissen. Er findet selbst, was er braucht, fragt in Alltagssprache nach dem Rest und steuert nichts, bis du es erlaubst.

## So arbeitet Joe

1. **Umschauen:** Joe sucht in deinem Home Assistant nach Speicher, Tarif, Solarprognose, Messwerten, Wallbox und Auto und zeigt dir, was er gefunden hat – geordnet wie später im Panel: Geräte und Haushalt.
2. **Fragen:** Was er nicht selbst herausfinden kann, fragt er – zum Beispiel, wie ihr Warmwasser macht oder ob Homeoffice euer normaler Arbeitstag ist. Was du mit „Später“ überspringst, wartet in der Übersicht unter „Joe braucht dich“.
3. **Zuschauen und lernen:** Im Simulationsmodus plant er jede Nacht, schaltet aber nichts, und rechnet jeden Morgen vor, was das Steuern gebracht hätte.
4. **Steuern:** Wenn du willst, steuert er selbst – nach einem Testlauf je Speicher – und stellt am Ende immer alles zurück.

## Was Joe kann

### Einrichten

- Eigenes Panel in der Seitenleiste mit Einrichtungsassistent und sechs Reitern (siehe [Das Panel](#das-panel)).
- Joe erkennt Speicher, Tarif, Solarprognose, Messwerte, Wallbox, Auto und Haushalt selbst und erklärt, warum.
- Statt Werte einzutippen beantwortest du Fragen in Alltagssprache – immer mit „Weiß ich nicht“.
- Was du selbst einstellst, überschreibt Joe nie. Jeder Wert steht mit Erklärung dort, wo er hingehört – am Ende der Einrichtung sagt Joe dir zu jeder Zeile, wo sie wohnt („wohnt unter Geräte › Speicher“).
- Joe startet im Simulationsmodus: Er schaut zu und lernt, steuert aber nichts, bis du es anders entscheidest.

### Beobachten und lernen

- Jede Stunde schreibt Joe Verbrauch, Sonne, Netz, Speicher, Außentemperatur, Anwesenheit und Solarprognose auf und liest beim Start bis zu zwei Jahre aus der Langzeit-Statistik von Home Assistant. Er behält alles über Jahre, damit er nicht jeden Winter neu anfängt.
- Den Hausverbrauch rechnet er wie das Energie-Dashboard (Balkonkraftwerke inklusive). Geräte, die über evcc mit Sonnenüberschuss oder nur bei günstigem Strom laufen, zählt er getrennt.
- Einmal am Tag lernt er erklärbare Modelle: Verbrauch nach Außentemperatur, Arbeitstag und Anwesenheit, wie viel die Speicher wirklich fassen, wie gut die Prognose bei klarem, wechselhaftem und trübem Wetter trifft und wie schnell das Warmwasser heizt und abkühlt.
- Aus euren Kalendern liest er, ob morgen Büro, Homeoffice oder Urlaub ist.
- Liegt ein Tag weit neben seiner Erwartung, fragt er nach („Hattet ihr Besuch?“). Unter Rückblick › Gelernt siehst du alles und kannst jeden Bereich zurücksetzen.

### Planen und rechnen

- Jede Nacht plant Joe, wie weit die Speicher in der günstigen Zeit geladen oder gehalten werden – aus Prognose, gelerntem Verbrauch und Preisen, mit Sicherheitspuffer.
- Dynamische Tarife: Preise aus Nord Pool, EPEX Spot (auch aWATTar), ENTSO-E, Octopus, Tibber, EnergyZero oder easyEnergy. Joe lädt in den günstigsten Viertelstunden.
- „Netzdienlich verhalten“ (Standard: an): Speicher und Auto laden möglichst in der Mittagsspitze, morgens und abends bezieht Joe möglichst wenig aus dem Netz. Ersparnis geht vor – umstellbar.
- Jeden Morgen spielt Joe die Nacht mit dem echten Tag nach und zeigt, was das Steuern in Euro gebracht hätte.

### Speicher steuern

- Joe steuert über wenige Grundgriffe (Mindest-Ladestand, Netzladen, Betriebsart mit Zwangsladen, Lade- und Entladegrenze, Sperr-Schalter) und kennt sie für viele Integrationen – siehe „Unterstützte Speicher“. Für andere schlägt er passende Regler vor.
- Vor dem ersten Steuern macht er einen Testlauf.
- In den Modi „Vorschlagen“ (fragt jeden Abend) und „Live“ hält und lädt er die Speicher und stellt am Ende alles zurück – auch nach einem Neustart oder per Notfall-Knopf.
- Automationen, die auf dieselben Regler schreiben, listet er auf und sagt dir, wenn sie ihm beim Steuern in die Suppe spucken. Schalten tust du sie selbst, Joe fasst sie nie an. Jeden Regler, den er setzt, trägt er mit Grund ins Logbuch von Home Assistant ein.
- Sicherheitsgrenzen: Höchstpreis fürs Netzladen, Mindestersparnis, Schutz der Hauptsicherung, Meldung, wenn ein Speicher trotz Laden nicht voller wird oder wegen einer Einstellung, die nicht von Joe ist, nicht arbeiten kann (Reserve auf dem Stand, fremde Sperre) – Joe stellt nur zurück, was er selbst geschrieben hat. Auf Wunsch gelegentlich eine Pflegeladung bis 100 %.
- Sieht Joe einen Speicher, den er nicht steuern kann, sagt er dir im Panel, warum – und was du tun kannst (eine Freischaltung im Gerät, eine Option der Integration, eine ausgeschaltete Entität).

### Unterstützte Speicher

**Laden** heißt nachts aus dem Netz laden, **Halten** nicht entladen, **Sperren** tagsüber Laden oder Entladen sperren (für „Mehrere Speicher: nacheinander“ und den Speicher-Wächter), **Drosseln** tagsüber langsamer laden („Tagsüber Überschuss abgeben“). Am echten Gerät erprobt sind Fronius und Omnibattery; alle anderen kennt Joe aus dem Quellcode ihrer Integration (Stand Oktober 2026) – deshalb steuert er jeden Speicher erst nach einem bestandenen Testlauf.

| Hersteller | Integration | Was Joe kann | Voraussetzungen |
|---|---|---|---|
| Fronius (mit BYD u. a.) | `fronius` (HA) | Laden (nur mit etwa 500 W, das bestimmt der Wechselrichter), Halten, Sperren, Drosseln | – |
| Fronius GEN24 über Modbus (mit BYD u. a.) | Joe selbst, Modbus TCP | Laden mit Leistung, Halten, Sperren, Drosseln | Im GEN24: Modbus TCP ein und „Steuerung erlauben“, im Batteriemanagement „Batterieladung aus dem Netz erlauben“ |
| Marstek Venus | `omnibattery` | Laden, Halten, Sperren, Drosseln, Wächter | – |
| Marstek | `marstek_modbus` | Laden, Halten | Steuer-Entitäten einschalten; nur ein Programm darf per Modbus mit ihm sprechen |
| Marstek | `marstek` (Open API) | Laden, Halten | – |
| Kostal | `kostal_plenticore` (HA) | Halten | „Battery min SoC“ einschalten |
| Kostal | `kostal_modbus_control` | Laden, Halten, Sperren | Batteriemanagement „Extern über Protokoll (Modbus TCP)“ im Wechselrichter; Ladestand-Sensor einschalten |
| Huawei | `huawei_solar` | Laden, Halten, Sperren, Drosseln | „Advanced: elevate permissions“ (Installateur-Passwort) |
| SolarEdge | `solaredge_modbus_multi` | Laden, Halten | erweiterte Speichersteuerung (`adv_storage_control`) |
| Sigenergy | `sigen` | Laden, Halten, Sperren, Drosseln | „Nur lesen“ (`read_only`) aus, Steuer-Entitäten ein |
| Victron (GX) | `victron_gx` (HA), `victron_mqtt` | Laden, Halten, Sperren (schont den Flash) | ESS eingerichtet; `victron_mqtt` nicht auf „READ_ONLY“ |
| Victron (Modbus) | `victron` | Laden (volle Leistung), Halten, Sperren | Schreibzugriff in den erweiterten Optionen |
| E3/DC | `e3dc_rscp` | Laden, Halten | – |
| sonnen | `sonnenbatterie`, `sonnenbatterie_v2` | Laden, Halten | Schreibzugriff in der sonnen-Oberfläche |
| SENEC | `senec` | Laden (ohne Leistung), Halten bis 50 % | lokal (V2/V3) und mein-senec-Konto mit „Backup Power pro“ |
| VARTA | `varta_modbus` | Halten, Sperren, Drosseln | – |
| Fox ESS | `foxess_modbus` | Laden, Halten, Sperren | – |
| GoodWe | `goodwe` | Halten; Laden nur mit der experimentellen Integration (HACS) | – |
| SolaX, Solis, Growatt | `solax_modbus` | Laden, Halten | – |
| Growatt | `growatt_server` (HA), `growatt_modbus` | Laden, Halten | – |
| Deye | `solarman` (davidrapan) | Laden, Halten, Sperren | „Time of Use“ im Wechselrichter ein |
| Sungrow | `sungrow` | Laden, Halten | – |
| Zendure | `zendure_ha` | Laden, Halten, Wächter (über den Zendure Manager) | P1-Zähler im Manager |
| Anker SOLIX | `anker_solix` | Laden (Backup-Laden), Halten | Eigentümer-Konto (Cloud, Antworten dauern Minuten) |
| HomeWizard | `homewizard` (HA) | Laden, Halten, Sperren (ab API 2.2.0) | – |
| Indevolt | `indevolt` (HA) | Laden, Halten | – |
| Tesla Powerwall | `teslemetry`, `tessie`, `tesla_fleet` (HA) | Laden, Halten | – |
| Enphase | `enphase_envoy` (HA) | Laden, Halten | – |
| Zinvolt, Tuya | `zinvolt`, `tuya` | Laden (Zinvolt), Halten | – |

Nur beobachten (Joe sagt dir im Panel, warum): SMA (`sma`, `pysmaplus`, `sma_ennexos` lesen nur), RCT (`rct_power`), EcoFlow (`ecoflow_cloud`), VARTA (`varta_storage`, `varta_pulse_neo`), BYD Battery-Box (wird über ihren Wechselrichter gesteuert), Powerwall über die lokale Integration, Hoymiles und Growatt NOAH über MQTT. Für Speicher ohne Profil schlägt Joe passende Regler vor, die du bestätigst.

### E-Auto und Warmwasser

- Auto, Warmwasser und weitere Geräte schaltet Joe in die günstige Zeit, wenn morgen die Sonne nicht reicht – z. B. evcc auf „now“ oder das Warmwasser bis zu einer berechneten Temperatur.
- Auto und Wallbox sind getrennt: Das **Auto** hat seinen Bedarf (Fahrten, Termine, Reserve, Ladestand), der **Ladepunkt** ist die Wallbox, die Joe schaltet (bei evcc den Modus, nicht evccs eigenen Ladeplan). Joe lädt immer das Auto, das gerade steckt.
- Welches Auto steckt, erkennt Joe der Reihe nach: am Fahrzeug, das evcc am Ladepunkt zeigt; am Stecker-Sensor des Autos; am einzigen Auto, das zu Hause ist. Sonst fragt er – aufs Handy und unter Übersicht – mit einem Knopf je Auto und „Gast / anderes Auto“. Bis er es weiß, lässt er die Wallbox in Ruhe; bei einem Gast macht evcc, was eingestellt ist. Je Ladepunkt einstellbar: fragen oder immer ein bestimmtes Auto annehmen.
- Ein Auto aus mehreren Integrationen ist ein Auto: evccs Fahrzeug und die Integration des Herstellers (z. B. Hyundai) führt Joe zusammen, wenn Name, Ladestand oder Kilometerstand passen – sonst fragt er. Den Ladestand nimmt er am liebsten von evcc, Reichweite, Kilometerstand und Ort vom Hersteller; jeder Wert zeigt, woher er kommt. Joe fragt das Auto nie selbst ab und weckt es nicht.
- Das Auto lädt Joe auf Wunsch nach Bedarf: Termine mit Ort, Strecke über Waze, Google oder OpenStreetMap, Reserve (50 km, einstellbar), höchstens bis zu einem Ladestand deiner Wahl und Verbrauch bei der vorhergesagten Temperatur. Braucht ein Auto morgen Strom und steckt abends nicht, erinnert Joe dich.
- „Laden bis … % oder km“: sofort („Jetzt laden“) oder heute Nacht in der günstigen Zeit – an der Wallbox, an der das Auto gerade steckt.

### Heizung und Klima

- Unter Geräte › Heizung & Klima wählst du für jedes Thermostat und jede Klimaanlage einzeln, ob Joe es steuert.
- Ob jemand zu Hause ist, sagt eine einzige Gruppe in Home Assistant (z. B. eure Personen); sie steht unter Haushalt › Wer ist da. Joe nimmt eine vorhandene oder legt auf Wunsch eine an, dazu optional einen Gastmodus für Babysitter oder Kinder ohne Handy – alles funktioniert auch ohne Joe.
- Ist keiner zu Hause: absenken (beim Kühlen anheben), ganz aus oder ein Profil des Geräts – bei Homematic IP z. B. dein Heizprofil „Abwesend“. An freien Tagen auf Wunsch ein eigenes Profil.
- Wochenprofile für Klimaanlagen wie bei Homematic IP: je Betriebsart (Heizen, Kühlen) sechs Profile mit Temperaturverlauf über den Tag – für alle Tage gleich, Mo–Fr und Sa–So oder jeden Tag einzeln, ein Schaltpunkt darf auch „aus“ sein. Haken je Profil: Normal, Feiertag, Abwesend, Homeoffice (aus dem Kalender). Joe schaltet selbst um, z. B. aufs Abwesenheitsprofil, wenn alle weg sind; von Hand Verstelltes gilt bis zum nächsten Schaltpunkt, von Hand Ausgeschaltetes bleibt aus.
- Dieselben Haken für die Heizprogramme deiner Homematic-IP-Thermostate: Joe wechselt nur das Programm (im Automatik-Betrieb), die Zeiten bleiben im Gerät.
- Kommt jemand heim (Integration „Nähe“/Proximity), fährt Joe die Räume so rechtzeitig hoch, wie sie es laut Gelerntem brauchen – mit der echten Fahrzeit vom Routendienst. Er lernt auch, wann ihr meist heimkommt, und heizt schon vorher. Danach stellt er alles genau so zurück, wie es war.
- Klimaanlagen auf Wunsch nachts aus und rechtzeitig vor dem Morgen wieder an. Wann Nacht ist, legst du unter Haushalt › Nachtruhe fest: feste Uhrzeiten oder eine Entität (z. B. deine Gute-Nacht-Routine oder ein Bettsensor).
- Messgeräte: Joe schlägt zu jedem Klimagerät das Gerät vor, das seine Leistung misst (z. B. einen Kanal eines Shelly Pro 3EM). Mehrere Klimageräte dürfen sich ein Messgerät teilen.

### Termine des Autos

Drei Wege, wie Termine zum Auto kommen:

1. **Fertiger Kalender** – ein Kalender in Home Assistant, in dem nur die Fahrten des Autos stehen.
2. **Postfach ohne Kalender** (z. B. web.de, GMX, Gmail) – du lädst das Auto zu Terminen ein, Joe sagt zu und trägt sie in seinen eigenen Kalender ein, den du aufs Handy holen kannst.
3. **Postfach mit Kalender** (Google, Microsoft 365, Outlook.com, iCloud, Infomaniak) – Joe liest den Kalender des Kontos und sagt dort zu.

### Dashboard-Karten

Joe bringt zwei Karten mit, die nach dem Installieren direkt in der Kartenauswahl stehen („Energy Joe …“):

- **Joe heute Nacht** – was Joe plant, was es kostet, Status und „Heute aussetzen“.
- **Auto laden** – Ladestand und Reichweite, „Laden bis … % oder km“ mit „Jetzt laden“ und „Heute Nacht laden“. Ohne Angabe zeigt sie jedes Auto, mit `car: <id>` nur eines; geladen wird an der Wallbox, an der das Auto steckt.

Die Karten brauchen einen Benutzer mit Administratorrechten.

## Das Panel

Sechs Reiter, links die Zeit, rechts die Dinge:

| Reiter | Was dort steht |
|---|---|
| **Übersicht** | Was gerade läuft, „Joe braucht dich“ (Hinweise, Noch offen, Neu gefunden, Fragen zu auffälligen Tagen), heute Nacht und die letzten Tage |
| **Plan** | Was Joe heute Nacht vorhat, was dabei läuft und wie er gerechnet hat |
| **Rückblick** | Ergebnis, Tage, Gelernt, Protokoll |
| **Geräte** | Alle, Speicher, Heizung & Klima, Auto & Laden, Warmwasser, Weitere Geräte, Netz & Sonne – jedes Gerät mit eigener Seite, dazu „+ Hinzufügen“ |
| **Haushalt** | Wer wohnt hier, Wer ist da, Tage & Kalender, Nachtruhe, Unterwegs & Wetter |
| **Einstellungen** | Betrieb, Regeln, Benachrichtigungen, Wartung & Sichern, Über Joe – oben ein Wegweiser, der auch alte Namen wie „Historie“ oder „Für Profis“ findet |

Unter **Einstellungen › Regeln** steht auch „Tagsüber Überschuss abgeben“ (Standard: aus): An sonnigen Tagen laden die Speicher nur so schnell, dass sie vor dem Abend trotzdem voll sind; den Rest der Sonne bekommt ein evcc-Ladepunkt im PV-Modus, z. B. das Auto oder die Fußbodenheizung. Nur im Live-Betrieb und nur für Speicher mit einer Ladegrenze in W oder kW; abends stellt Joe die Ladegrenze zurück.

Jede Seite hat ihre eigene Adresse, zum Beispiel `/energy-joe/devices/battery`, `/energy-joe/review/days` oder `/energy-joe/household/people`; ein Auto unter `/energy-joe/devices/car/<id>`, ein Ladepunkt unter `/energy-joe/devices/car/point/<id>`. Zurück im Browser, Lesezeichen und die Dashboard-Karten führen genau dorthin.

## Betriebsarten

| Betriebsart | Was Joe tut |
|---|---|
| **Simulation** | plant und lernt, schaltet nichts (so startet Joe) |
| **Vorschlagen** | fragt jeden Abend, ob er steuern darf |
| **Live** | steuert jede Nacht selbst – nur Speicher mit bestandenem Testlauf |
| **Aus** | macht Pause |

Betriebsart, „Heute aussetzen“, Freigeben und Status gibt es auch als Entitäten und Dienste für eigene Automationen.

## Was du brauchst

- Home Assistant 2026.3 oder neuer
- am besten ein eingerichtetes Energie-Dashboard mit Netz, PV und – wenn vorhanden – Speicher (daraus liest Joe die Messwerte am zuverlässigsten)
- zum Steuern einen Hausspeicher, dessen Integration Regler anbietet (Mindest-Ladestand, Netzladen, Betriebsart oder Entladegrenze)
- am besten eine Solarprognose (Forecast.Solar, Solcast oder Open-Meteo Solar Forecast) und, wenn du einen hast, deinen dynamischen Tarif

Alles Weitere ist freiwillig: Wetter, Kalender und Personen, Auto-Integration oder evcc, Warmwasser.

## Installieren

**Über HACS:**

1. HACS → Menü → *Benutzerdefinierte Repositories* → `https://github.com/Marcels-Custom-Coding/Energy-Joe`, Typ *Integration*
2. *Energy Joe* herunterladen und Home Assistant neu starten
3. *Einstellungen → Geräte & Dienste → Integration hinzufügen → Energy Joe*

**Von Hand:** Ordner `custom_components/energy_joe` nach `/config/custom_components/` kopieren, neu starten, Integration hinzufügen.

Updates kommen als Versionen über HACS. Nach einem Update lädst du die Seite einmal neu – Joe sagt dir Bescheid, wenn noch die alte Version im Browser hängt.

## Erste Schritte

1. Öffne **Energy Joe** in der Seitenleiste und lass ihn sich umschauen.
2. Schau dir an, was er gefunden hat, und beantworte seine Fragen. „Weiß ich nicht“ ist immer eine gute Antwort, „Später“ auch.
3. Lass ihn ein paar Tage im **Simulationsmodus** laufen. Auf der Übersicht siehst du jeden Morgen, was das Steuern gebracht hätte.
4. Mach unter **Geräte › Speicher** für jeden Speicher den **Testlauf**.
5. Stell auf **Vorschlagen** oder **Live**, wenn du Joe steuern lassen willst.

## Datenschutz

- Joe rechnet und lernt in deinem Home Assistant. Eine eigene Cloud gibt es nicht.
- Nach außen geht nur, was du einrichtest: der Ort eines Termins an den gewählten Entfernungsdienst (Waze, Google oder OpenStreetMap) und die Verbindung zum Postfach oder Kalender eines Autos.
- Passwörter und Anmeldungen liegen in eigenen Speichern, nie in der Konfiguration oder in der Diagnose.

## Hilfe

Fragen und Fehler bitte als [Issue auf GitHub](https://github.com/Marcels-Custom-Coding/Energy-Joe/issues). Hilfreich ist die Diagnose: *Einstellungen → Geräte & Dienste → Energy Joe → ⋮ → Diagnose herunterladen* – Namen, Adressen und Termine sind darin geschwärzt.

Joe spricht Deutsch und Englisch, je nach Sprache deines Home Assistant.
