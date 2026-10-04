# Energy Joe

![Energy Joe](docs/images/energy-joe.jpg)

> **Work in progress.** Energy Joe ist noch in Entwicklung und nicht veröffentlicht.

Energy Joe ist eine lernende Home-Assistant-Integration für Haushalte mit PV-Anlage und Speicher. Er verschiebt Verbräuche – Hausspeicher, E-Auto, Warmwasser – in günstige Tarifzeiten, wenn die Sonne am nächsten Tag nicht reicht, und lernt jeden Tag aus Prognose, Verbrauch, Wetter und Alltag dazu.

Joe braucht kein Vorwissen: Nach dem Hinzufügen der Integration findest du ihn in der Seitenleiste. Dort schaut er sich in deinem Home Assistant um, zeigt dir, was er gefunden hat, und fragt in Alltagssprache nach dem, was er nicht selbst herausfinden kann. Bis du es anders entscheidest, steuert er nichts, sondern simuliert nur.

## Stand

Panel im eigenen Design mit Einrichtungsassistent, Übersicht und Einstellungen; Joe startet im Simulationsmodus. Joe erkennt Speicher, Tarif, Solarprognose, Messwerte, Wallbox und Haushalt selbst, erklärt, warum, und übernimmt das – was du selbst einstellst, überschreibt er nie. Du änderst Funde mit einer eigenen Entity-Auswahl oder lässt sie weg, beantwortest Fragen statt Werte einzutippen (immer mit „Weiß ich nicht“) und findest jeden Wert mit Erklärung in den Einstellungen. Nach der Einrichtung beobachtet Joe: Er schreibt jede Stunde Verbrauch, Sonne, Netz, Speicher, Außentemperatur, Anwesenheit und Solarprognose auf und liest die letzten Wochen aus dem Verlauf von Home Assistant; die Historie zeigt jeden Tag mit Diagrammen. Jede Nacht plant Joe, wie weit die Speicher in der günstigen Zeit geladen oder gehalten werden – aus Prognose, gelerntem Verbrauch und Preisen, mit Sicherheitspuffer – und legt den Plan kurz vor Beginn fest; im Simulationsmodus zeigt er nur, was er tun würde. Jeden Morgen spielt Joe den Plan der Nacht mit dem echten Tag nach – mit und ohne Plan – und zeigt, was das Steuern in Euro gebracht hätte: erst vorläufig, nach Ende des Tages endgültig. Daraus lernt er, wie gut die Solarprognose bei dir trifft, ob ihre Stunden verschoben sind und wie viel Puffer du wirklich brauchst; auf der Seite „Lernen“ siehst du alles und kannst es zurücksetzen. Joe steuert Speicher über wenige Grundgriffe (Mindest-Ladestand, Netzladen, Betriebsart mit Zwangsladen, Entladegrenze) und kennt sie für viele Integrationen schon (u. a. Fronius, Marstek, Huawei, SolarEdge, Fox ESS, SolaX, Sigenergy, Sungrow, GoodWe, Enphase, Tesla, Kostal, Victron, Zendure, sonnen, E3/DC, Growatt); für andere schlägt er passende Regler vor, oder du ordnest sie zu. Bevor er einen Speicher steuert, macht er einen Testlauf. In den Modi „Vorschlagen“ (fragt jeden Abend) und „Live“ hält und lädt er die Speicher in der günstigen Zeit, sperrt das Entladen der anderen, solange einer aus dem Netz lädt, und stellt am Ende alles zurück – auch nach einem Neustart oder per Notfall-Knopf. Betriebsart, Aussetzen, Freigeben und Status gibt es auch als Entitäten und Dienste. Nacht-Aktionen schalten weitere Verbraucher in die günstige Zeit, wenn morgen die Sonne nicht reicht: das E-Auto (z. B. evcc auf „now“, am Ende zurück) oder das Warmwasser bis zu einer berechneten Temperatur, so spät wie möglich gestartet – mit Bedingungen, einem Schalter „Heute Nacht“, Rücksicht aufs Netzlimit und weniger Speicherbedarf am Tag. Einmal am Tag lernt Joe erklärbare Modelle: wie der Verbrauch von Außentemperatur, Arbeitstag und Anwesenheit abhängt (auch je Gerät mit eigenem Zähler), wie viel die Speicher wirklich fassen und verlieren, wie gut die Prognose bei klarem, wechselhaftem und trübem Wetter trifft, wie mehrere Prognosequellen zusammen am besten treffen und wie schnell das Warmwasser heizt und abkühlt. Aus euren Kalendern liest er nach einfachen Regeln, ob morgen Büro, Homeoffice oder Urlaub ist, und lernt daraus, wer wie lange zu Hause ist. Für morgen rechnet er mit der Wettervorhersage, dem Kalender und diesen Modellen. Liegt ein Tag weit neben seiner Erwartung, fragt Joe nach („Hattet ihr Besuch?“) und lernt aus der Antwort; jeden Bereich kannst du einzeln zurücksetzen. Mit einem dynamischen Tarif liest Joe die Preise der nächsten Stunden – aus Nord Pool, EPEX Spot (auch aWATTar), ENTSO-E, Octopus, Tibber, EnergyZero oder easyEnergy –, sucht im Suchzeitraum (normalerweise 20 bis 7 Uhr) das Zeitfenster, mit dem der nächste Tag am wenigsten kostet, und lädt darin in den günstigsten Viertelstunden; Netzentgelt und Steuern trägst du bei reinen Börsenpreisen als Aufschlag ein. Sicherheitsgrenzen: ein Höchstpreis fürs Netzladen, eine Mindestersparnis, unter der Joe nichts tut, der Schutz der Hauptsicherung (Laden pausiert, solange das Haus mehr als das Netzlimit zieht) und eine Meldung, wenn ein Speicher trotz Laden nicht voller wird. Auf Wunsch lädt Joe die Speicher alle paar Tage einmal ganz voll (Pflegeladung), damit sie ihre Zellen abgleichen – aber nur, wenn die Sonne das nicht ohnehin erledigt. Das E-Auto lädt Joe auf Wunsch nach Bedarf: Er liest Ladestand, Reichweite und Akkugröße aus der Auto-Integration (er kennt rund 40, von Tesla, VW, Skoda, Audi, Cupra, Porsche, BMW, Mercedes, Smart, Kia, Hyundai, Volvo, Polestar, BYD und MG bis Opel, Peugeot, Renault, Nissan, Toyota, Ford und Zeekr, dazu evcc), schaut in den Kalendern nach Terminen mit Ort, rechnet die Strecke mit Waze, Google oder OpenStreetMap aus, legt eine Reserve drauf (50 km, einstellbar) und rechnet mit dem Verbrauch bei der vorhergesagten Temperatur und bei Regen. Er lädt nur, was fehlt, und hört auf, sobald der Ladestand erreicht ist; den echten Verbrauch und die übliche Tagesstrecke lernt er aus Kilometerstand und Ladestand.

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
