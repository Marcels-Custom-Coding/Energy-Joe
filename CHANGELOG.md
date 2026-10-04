# Änderungen

Jede Version, die HACS anbietet, steht hier. Kleine Schritte zählen hinten
hoch (0.1.0, 0.1.1, 0.1.2 …), größere vorne (0.2.0).

## 0.1.1

- **Einfach laden bis …:** Bei jedem Auto ein Knopf, der sofort lädt, bis
  der gewählte Ladestand oder die Reichweite (plus Reserve) erreicht ist –
  ohne auf die günstige Zeit zu warten, auch in der Simulation. Danach stellt
  Joe die Wallbox zurück, nach spätestens 24 Stunden hört er von selbst auf.
- **Warmwasser:** Die Frage nach dem Warmwasser zeigt den gefundenen Zähler
  und bietet „Warmwasser-Steuerung einrichten“ an; Joe schlägt Schalter und
  Temperaturfühler vor. Neue Warmwasser-Aktionen stellen den Schalter danach
  zurück, wie er war.
- **Umschauen:** Gefundene Autos stehen in der Liste. evcc-Ladepunkte für
  Heizungen und Whirlpool gelten nicht mehr als Wallbox; früher so angelegte
  Aktionen nimmt Joe beim nächsten Umschauen zurück, wenn niemand sie
  geändert hat.
- **Lernen sofort:** Sobald Joe die letzten Wochen aus dem Verlauf gelesen
  hat, lernt er daraus – nicht erst am nächsten Tag.
- **Entfernungen:** OpenStreetMap ist vorausgewählt (gefragt wird erst, wenn
  ein Auto nach Bedarf lädt).
- **Simulation:** Die Streifen am Knopf laufen, solange Joe simuliert.
- Behoben: Ein Plan, der gleichzeitig mit dem Festlegen fertig wurde, konnte
  den festgelegten Plan überschreiben.

## 0.1.0

Die erste Version mit Nummer.

- **Einrichtung für alle:** Joe sucht Speicher, Tarif, Solarprognose,
  Messwerte, Wallbox, Auto und Haushalt selbst, erklärt seine Funde und
  fragt nur nach, was er nicht herausfinden kann. Er startet im
  Simulationsmodus.
- **Beobachten und Planen:** Jede Stunde schreibt Joe auf, was passiert.
  Jede Nacht rechnet er aus, wie weit die Speicher in der günstigen Zeit
  geladen oder gehalten werden, und legt den Plan kurz vor Beginn fest.
- **Steuern:** Speicher vieler Hersteller, mit Testlauf vorher und Rückgabe
  aller Einstellungen danach, auch nach einem Neustart oder per
  Notfall-Knopf.
- **Nacht-Aktionen:** E-Auto und Warmwasser in die günstige Zeit, wenn
  morgen die Sonne nicht reicht.
- **Auto nach Bedarf laden:** Termine aus dem Kalender, Strecke per Waze,
  Google oder OpenStreetMap, eine Reserve (50 km) und der Verbrauch bei
  Kälte und Regen. Joe lädt nur, was fehlt, und lernt den echten Verbrauch.
- **Lernen:** Verbrauch nach Wetter, Arbeitstag und Anwesenheit, Speicher,
  Treffsicherheit der Prognose, Warmwasser und Auto. Bei seltsamen Tagen
  fragt Joe nach.
- **Dynamische Tarife:** Nord Pool, EPEX Spot, ENTSO-E, Octopus, Tibber,
  EnergyZero und easyEnergy, mit Höchstpreis, Mindestersparnis, Schutz der
  Hauptsicherung und Pflegeladung.
