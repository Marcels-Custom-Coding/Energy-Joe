# Energy Joe

![Energy Joe](docs/images/energy-joe.jpg)

> **Work in progress.** Energy Joe ist noch in Entwicklung und nicht veröffentlicht.

Energy Joe ist eine lernende Home-Assistant-Integration für Haushalte mit PV-Anlage und Speicher. Er verschiebt Verbräuche – Hausspeicher, E-Auto, Warmwasser – in günstige Tarifzeiten, wenn die Sonne am nächsten Tag nicht reicht, und lernt jeden Tag aus Prognose, Verbrauch, Wetter und Alltag dazu.

Joe braucht kein Vorwissen: Nach dem Hinzufügen der Integration findest du ihn in der Seitenleiste. Dort schaut er sich in deinem Home Assistant um, zeigt dir, was er gefunden hat, und fragt in Alltagssprache nach dem, was er nicht selbst herausfinden kann. Bis du es anders entscheidest, steuert er nichts, sondern simuliert nur.

## Stand

Panel im eigenen Design mit Einrichtungsassistent, Übersicht und Einstellungen; Joe startet im Simulationsmodus. Joe erkennt Speicher, Tarif, Solarprognose, Messwerte, Wallbox und Haushalt selbst, erklärt, warum, und übernimmt das – was du selbst einstellst, überschreibt er nie. Du änderst Funde mit einer eigenen Entity-Auswahl oder lässt sie weg, beantwortest Fragen statt Werte einzutippen (immer mit „Weiß ich nicht“) und findest jeden Wert mit Erklärung in den Einstellungen. Nach der Einrichtung beobachtet Joe: Er schreibt jede Stunde Verbrauch, Sonne, Netz, Speicher, Außentemperatur, Anwesenheit und Solarprognose auf und liest die letzten Wochen aus dem Verlauf von Home Assistant; die Historie zeigt jeden Tag mit Diagrammen. Jede Nacht plant Joe, wie weit die Speicher in der günstigen Zeit geladen oder gehalten werden – aus Prognose, gelerntem Verbrauch und Preisen, mit Sicherheitspuffer – und legt den Plan kurz vor Beginn fest; im Simulationsmodus zeigt er nur, was er tun würde. Jeden Morgen spielt Joe den Plan der Nacht mit dem echten Tag nach – mit und ohne Plan – und zeigt, was das Steuern in Euro gebracht hätte: erst vorläufig, nach Ende des Tages endgültig. Daraus lernt er, wie gut die Solarprognose bei dir trifft, ob ihre Stunden verschoben sind und wie viel Puffer du wirklich brauchst; auf der Seite „Lernen“ siehst du alles und kannst es zurücksetzen. Joe steuert Speicher über wenige Grundgriffe (Mindest-Ladestand, Netzladen, Betriebsart mit Zwangsladen, Entladegrenze) und kennt sie für viele Integrationen schon (u. a. Fronius, Marstek, Huawei, SolarEdge, Fox ESS, SolaX, Sigenergy, Sungrow, GoodWe, Enphase, Tesla, Kostal, Victron, Zendure, sonnen, E3/DC, Growatt); für andere schlägt er passende Regler vor, oder du ordnest sie zu. Bevor er einen Speicher steuert, macht er einen Testlauf. In den Modi „Vorschlagen“ (fragt jeden Abend) und „Live“ hält und lädt er die Speicher in der günstigen Zeit, sperrt das Entladen der anderen, solange einer aus dem Netz lädt, und stellt am Ende alles zurück – auch nach einem Neustart oder per Notfall-Knopf. Betriebsart, Aussetzen, Freigeben und Status gibt es auch als Entitäten und Dienste. Nacht-Aktionen schalten weitere Verbraucher in die günstige Zeit, wenn morgen die Sonne nicht reicht: das E-Auto (z. B. evcc auf „now“, am Ende zurück) oder das Warmwasser bis zu einer berechneten Temperatur, so spät wie möglich gestartet – mit Bedingungen, einem Schalter „Heute Nacht“, Rücksicht aufs Netzlimit und weniger Speicherbedarf am Tag.

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
