# Energy Joe

<img src="docs/images/energy-joe.jpg" alt="Energy Joe" width="50%">

> **Noch in Entwicklung.** Energy Joe ist noch nicht offiziell veröffentlicht. Ausprobieren kannst du ihn schon – am besten erst eine Weile im Simulationsmodus.

Energy Joe ist eine lernende Home-Assistant-Integration für Haushalte mit PV-Anlage und Speicher. Er verschiebt Verbräuche – Hausspeicher, E-Auto, Warmwasser – in günstige Tarifzeiten, wenn die Sonne am nächsten Tag nicht reicht, und lernt jeden Tag aus Prognose, Verbrauch, Wetter und Alltag dazu.

Joe braucht kein Vorwissen. Er findet selbst, was er braucht, fragt in Alltagssprache nach dem Rest und steuert nichts, bis du es erlaubst.

## So arbeitet Joe

1. **Umschauen:** Joe sucht in deinem Home Assistant nach Speicher, Tarif, Solarprognose, Messwerten, Wallbox und Auto und zeigt dir, was er gefunden hat.
2. **Fragen:** Was er nicht selbst herausfinden kann, fragt er – zum Beispiel, wie ihr Warmwasser macht.
3. **Zuschauen und lernen:** Im Simulationsmodus plant er jede Nacht, schaltet aber nichts, und rechnet jeden Morgen vor, was das Steuern gebracht hätte.
4. **Steuern:** Wenn du willst, steuert er selbst – nach einem Testlauf je Speicher – und stellt am Ende immer alles zurück.

## Was Joe kann

### Einrichten

- Eigenes Panel in der Seitenleiste mit Einrichtungsassistent, Übersicht und Einstellungen.
- Joe erkennt Speicher, Tarif, Solarprognose, Messwerte, Wallbox, Auto und Haushalt selbst und erklärt, warum.
- Statt Werte einzutippen beantwortest du Fragen in Alltagssprache – immer mit „Weiß ich nicht“.
- Was du selbst einstellst, überschreibt Joe nie. Jeder Wert steht mit Erklärung in den Einstellungen.
- Joe startet im Simulationsmodus: Er schaut zu und lernt, steuert aber nichts, bis du es anders entscheidest.

### Beobachten und lernen

- Jede Stunde schreibt Joe Verbrauch, Sonne, Netz, Speicher, Außentemperatur, Anwesenheit und Solarprognose auf und liest beim Start bis zu zwei Jahre aus der Langzeit-Statistik von Home Assistant. Er behält alles über Jahre, damit er nicht jeden Winter neu anfängt.
- Den Hausverbrauch rechnet er wie das Energie-Dashboard (Balkonkraftwerke inklusive). Geräte, die über evcc mit Sonnenüberschuss oder nur bei günstigem Strom laufen, zählt er getrennt.
- Einmal am Tag lernt er erklärbare Modelle: Verbrauch nach Außentemperatur, Arbeitstag und Anwesenheit, wie viel die Speicher wirklich fassen, wie gut die Prognose bei klarem, wechselhaftem und trübem Wetter trifft und wie schnell das Warmwasser heizt und abkühlt.
- Aus euren Kalendern liest er, ob morgen Büro, Homeoffice oder Urlaub ist.
- Liegt ein Tag weit neben seiner Erwartung, fragt er nach („Hattet ihr Besuch?“). Auf der Seite „Lernen“ siehst du alles und kannst jeden Bereich zurücksetzen.

### Planen und rechnen

- Jede Nacht plant Joe, wie weit die Speicher in der günstigen Zeit geladen oder gehalten werden – aus Prognose, gelerntem Verbrauch und Preisen, mit Sicherheitspuffer.
- Dynamische Tarife: Preise aus Nord Pool, EPEX Spot (auch aWATTar), ENTSO-E, Octopus, Tibber, EnergyZero oder easyEnergy. Joe lädt in den günstigsten Viertelstunden.
- „Netzdienlich verhalten“ (Standard: an): Speicher und Auto laden möglichst in der Mittagsspitze, morgens und abends bezieht Joe möglichst wenig aus dem Netz. Ersparnis geht vor – umstellbar.
- Jeden Morgen spielt Joe die Nacht mit dem echten Tag nach und zeigt, was das Steuern in Euro gebracht hätte.

### Speicher steuern

- Joe steuert über wenige Grundgriffe (Mindest-Ladestand, Netzladen, Betriebsart mit Zwangsladen, Entladegrenze) und kennt sie für viele Integrationen, u. a. Fronius, Marstek (Omnibattery), Huawei, SolarEdge, Fox ESS, SolaX, Sigenergy, Sungrow, GoodWe, Enphase, Tesla, Kostal, Victron, Zendure, sonnen, E3/DC und Growatt. Für andere schlägt er passende Regler vor.
- Vor dem ersten Steuern macht er einen Testlauf.
- In den Modi „Vorschlagen“ (fragt jeden Abend) und „Live“ hält und lädt er die Speicher und stellt am Ende alles zurück – auch nach einem Neustart oder per Notfall-Knopf.
- Automationen, die auf dieselben Regler schreiben, listet er auf und kann sie mit einem Klick aus- und wieder einschalten.
- Sicherheitsgrenzen: Höchstpreis fürs Netzladen, Mindestersparnis, Schutz der Hauptsicherung, Meldung, wenn ein Speicher trotz Laden nicht voller wird. Auf Wunsch gelegentlich eine Pflegeladung bis 100 %.

### E-Auto und Warmwasser

- Nacht-Aktionen schalten weitere Verbraucher in die günstige Zeit, wenn morgen die Sonne nicht reicht – z. B. evcc auf „now“ oder das Warmwasser bis zu einer berechneten Temperatur.
- Das Auto lädt Joe auf Wunsch nach Bedarf: Ladestand und Reichweite aus der Auto-Integration (rund 40 bekannt, dazu evcc), Termine mit Ort, Strecke über Waze, Google oder OpenStreetMap, Reserve (50 km, einstellbar) und Verbrauch bei der vorhergesagten Temperatur.
- „Laden bis … % oder km“: sofort („Jetzt laden“) oder heute Nacht in der günstigen Zeit.

### Heizung und Klima

- Neuer Bereich „Klima“: Für jedes Thermostat und jede Klimaanlage einzeln wählst du, ob Joe es steuert.
- Ist keiner zu Hause: absenken (beim Kühlen anheben), ganz aus oder ein Profil des Geräts – bei Homematic IP z. B. dein Heizprofil „Abwesend“. An freien Tagen auf Wunsch ein eigenes Profil.
- Kommt jemand heim (Integration „Nähe“/Proximity), fährt Joe die Räume so rechtzeitig hoch, wie sie es laut Gelerntem brauchen, und stellt alles genau so zurück, wie es war.
- Klimaanlagen auf Wunsch nachts aus und rechtzeitig vor dem Morgen wieder an. Wann Nacht ist, sagen feste Uhrzeiten oder eine Entität (z. B. deine Gute-Nacht-Routine oder ein Bettsensor).
- Messgerät koppeln: Joe schlägt zu jedem Klimagerät das Gerät vor, das seine Leistung misst (z. B. einen Kanal eines Shelly Pro 3EM). Mehrere Klimageräte dürfen sich ein Messgerät teilen.

### Termine des Autos

Drei Wege, wie Termine zum Auto kommen:

1. **Fertiger Kalender** – ein Kalender in Home Assistant, in dem nur die Fahrten des Autos stehen.
2. **Postfach ohne Kalender** (z. B. web.de, GMX, Gmail) – du lädst das Auto zu Terminen ein, Joe sagt zu und trägt sie in seinen eigenen Kalender ein, den du aufs Handy holen kannst.
3. **Postfach mit Kalender** (Google, Microsoft 365, Outlook.com, iCloud, Infomaniak) – Joe liest den Kalender des Kontos und sagt dort zu.

### Dashboard-Karten

Joe bringt zwei Karten mit, die nach dem Installieren direkt in der Kartenauswahl stehen („Energy Joe …“):

- **Joe heute Nacht** – was Joe plant, was es kostet, Status und „Heute aussetzen“.
- **Auto laden** – Ladestand und Reichweite, „Laden bis … % oder km“ mit „Jetzt laden“ und „Heute Nacht laden“. Mit mehreren Autos wählst du eins mit `action: <id>`.

Die Karten brauchen einen Benutzer mit Administratorrechten.

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
2. Schau dir an, was er gefunden hat, und beantworte seine Fragen. „Weiß ich nicht“ ist immer eine gute Antwort.
3. Lass ihn ein paar Tage im **Simulationsmodus** laufen. Auf der Übersicht siehst du jeden Morgen, was das Steuern gebracht hätte.
4. Mach auf der Seite **Geräte** für jeden Speicher den **Testlauf**.
5. Stell auf **Vorschlagen** oder **Live**, wenn du Joe steuern lassen willst.

## Datenschutz

- Joe rechnet und lernt in deinem Home Assistant. Eine eigene Cloud gibt es nicht.
- Nach außen geht nur, was du einrichtest: der Ort eines Termins an den gewählten Entfernungsdienst (Waze, Google oder OpenStreetMap) und die Verbindung zum Postfach oder Kalender eines Autos.
- Passwörter und Anmeldungen liegen in eigenen Speichern, nie in der Konfiguration oder in der Diagnose.

## Hilfe

Fragen und Fehler bitte als [Issue auf GitHub](https://github.com/Marcels-Custom-Coding/Energy-Joe/issues). Hilfreich ist die Diagnose: *Einstellungen → Geräte & Dienste → Energy Joe → ⋮ → Diagnose herunterladen* – Namen, Adressen und Termine sind darin geschwärzt.

Joe spricht Deutsch und Englisch, je nach Sprache deines Home Assistant.
