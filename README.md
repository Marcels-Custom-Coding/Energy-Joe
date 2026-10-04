# Energy Joe

![Energy Joe](docs/images/energy-joe.jpg)

> **Work in progress.** Energy Joe ist noch in Entwicklung und nicht veröffentlicht.

Energy Joe ist eine lernende Home-Assistant-Integration für Haushalte mit PV-Anlage und Speicher. Er verschiebt Verbräuche – Hausspeicher, E-Auto, Warmwasser – in günstige Tarifzeiten, wenn die Sonne am nächsten Tag nicht reicht, und lernt jeden Tag aus Prognose, Verbrauch, Wetter und Alltag dazu.

Joe braucht kein Vorwissen: Nach dem Hinzufügen der Integration findest du ihn in der Seitenleiste. Dort schaut er sich in deinem Home Assistant um, zeigt dir, was er gefunden hat, und fragt in Alltagssprache nach dem, was er nicht selbst herausfinden kann. Bis du es anders entscheidest, steuert er nichts, sondern simuliert nur.

## Was Joe kann

### Einrichten

- Eigenes Panel in der Seitenleiste mit Einrichtungsassistent, Übersicht und Einstellungen.
- Joe erkennt Speicher, Tarif, Solarprognose, Messwerte, Wallbox, Auto und Haushalt selbst und erklärt, warum.
- Statt Werte einzutippen beantwortest du Fragen in Alltagssprache – immer mit „Weiß ich nicht“.
- Was du selbst einstellst, überschreibt Joe nie. Jeder Wert steht mit Erklärung in den Einstellungen.
- Joe startet im Simulationsmodus: Er schaut zu und lernt, steuert aber nichts, bis du es anders entscheidest.

### Beobachten und lernen

- Jede Stunde schreibt Joe Verbrauch, Sonne, Netz, Speicher, Außentemperatur, Anwesenheit und Solarprognose auf und liest die letzten Wochen aus dem Verlauf von Home Assistant.
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

### Termine des Autos

Drei Wege, wie Termine zum Auto kommen:

1. **Fertiger Kalender** – ein Kalender in Home Assistant, in dem nur die Fahrten des Autos stehen.
2. **Postfach ohne Kalender** (z. B. web.de, GMX, Gmail) – du lädst das Auto zu Terminen ein, Joe sagt zu und trägt sie in seinen eigenen Kalender ein, den du aufs Handy holen kannst.
3. **Postfach mit Kalender** (Google, Microsoft 365, Outlook.com, iCloud, Infomaniak) – Joe liest den Kalender des Kontos und sagt dort zu.

Betriebsart, Aussetzen, Freigeben und Status gibt es auch als Entitäten und Dienste für eigene Automationen.

## Installieren

Voraussetzung: Home Assistant 2026.3 oder neuer.

**Über HACS** (nach der Veröffentlichung):

1. HACS → Menü → *Benutzerdefinierte Repositories* → URL dieses Repositories, Typ *Integration*
2. *Energy Joe* herunterladen, Home Assistant neu starten
3. *Einstellungen → Geräte & Dienste → Integration hinzufügen → Energy Joe*

**Von Hand:** Ordner `custom_components/energy_joe` nach `/config/custom_components/` kopieren, neu starten, Integration hinzufügen.

## Entwicklung

Das Panel liegt als Quellcode in `panel/` (Lit und TypeScript) und wird nach `custom_components/energy_joe/frontend/` gebaut. Der Build ist eingecheckt, weil HACS ohne Build-Schritt installiert.

```bash
cd panel
npm install
npm run build
```

Was vor der Veröffentlichung zu tun ist, steht in [PUBLISHING.md](PUBLISHING.md).
