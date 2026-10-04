# Änderungen

Jede Version, die HACS anbietet, steht hier. Kleine Schritte zählen hinten
hoch (0.1.0, 0.1.1, 0.1.2 …), größere vorne (0.2.0).

## 0.4.1

- **Google bei „Postfach mit Kalender“:** Ein Gmail-Konto des Autos meldest du
  mit Google an – kurzer Code, kein App-Passwort. Joe liest den Google
  Kalender des Kontos und sagt dort im Namen des Autos zu, wie bei Microsoft.
  Solange Joes eigene Google-App fehlt, geht es mit einer eigenen App
  (Anleitung im Tooltip).
- Gmail geht weiter auch als „Postfach ohne Kalender“ mit App-Passwort.

## 0.4.0

- **Drei gleichwertige Wege, wie Termine zum Auto kommen** – jeder mit einer
  Grafik, die zeigt, in welchem Kalender der Termin am Ende steht:
  1. **Fertiger Kalender:** Die Termine stehen schon in einem Kalender in
     Home Assistant. Du ordnest ihn zu, Joe liest nur.
  2. **Postfach ohne Kalender** (z. B. web.de, GMX, Gmail, T-Online): Du lädst
     das Auto ein, Joe holt die Einladung, sagt zu und trägt den Termin in
     seinen eigenen Kalender „Kalender ‹Auto›“ in Home Assistant ein – den du
     auch aufs Handy holen kannst.
  3. **Postfach mit Kalender** (Microsoft 365, Outlook.com, iCloud,
     Infomaniak): Der Termin landet von selbst im Kalender des Kontos; Joe
     liest ihn und sagt dort zu.
- **Postfach beim Auto:** Jedes Auto hat sein eigenes Postfach. Der Abschnitt
  „Postfach für Auto-Termine“ in den Einstellungen ist weg; was dort stand,
  wandert beim Update zum Auto. Den Anbieter erkennt Joe an der Adresse.
- **„Wer darf das Auto einladen?“** steht jetzt beim Auto. Erlaubst du einen
  abgelehnten Absender, liest Joe das Postfach noch einmal.
- Joes eigenen Kalender gibt es nur noch für Autos mit Postfach ohne
  Kalender – bei den anderen Wegen wäre er nur doppelt.
- Unbeantwortete Einladungen fremder Absender im Kalender eines Kontos zählen
  nicht mehr als Fahrt.

## 0.3.1

- **Kalender des Autos verständlicher:** zwei klare Wege mit einer kleinen
  Grafik der Schritte.
  - **Joe nimmt Einladungen an:** Du legst einen Termin mit Ort an, lädst das
    Auto ein, Joe sagt in seinem Namen zu, übernimmt den Termin und lädt
    rechtzeitig. Ob über eine Adresse in Joes Postfach oder ein eigenes Konto
    des Autos, ist nur noch eine Unterfrage.
  - **Fertiger Kalender des Autos:** Die Termine stehen schon in einem
    Kalender (eingeladen und zugesagt) – du ordnest ihn nur zu.

## 0.3.0

- **Drei Wege, wie Termine zum Auto kommen** (beim Auto: „Woher kommen die
  Termine dieses Autos?“):
  1. **Kalender aus Home Assistant** – Google, iCloud/CalDAV, Microsoft 365,
     iCal-Link.
  2. **Einladungen an Joes Postfach** – Joe fängt sie ab und trägt sie in
     seinen Kalender für das Auto ein.
  3. **Konto des Autos** – das Auto hat ein eigenes Konto mit Postfach und
     Kalender (z. B. kona@outlook.com, iCloud, Infomaniak, CalDAV). Joe liest
     den Kalender direkt und sagt Einladungen erlaubter Absender dort zu.
- **Microsoft privat und Microsoft 365 getrennt:** Private Konten
  (Outlook.com, Hotmail, Live) melden sich mit Joes eigener App an, Firmen
  mit Joes App (wenn der Admin es zulässt) oder einer eigenen.
- „Wer darf einladen?“ gilt für das Postfach und die Konten der Autos und ist
  immer zu sehen.

## 0.2.4

- Neues Bild „Füße hoch“.
- Joes Bilder in der Übersicht und im Plan stehen jetzt mit Abstand in der
  Karte, statt am rechten Rand abgeschnitten zu werden.

## 0.2.3

- **Postfach bei Microsoft** (Exchange Online und private Outlook-Konten):
  Anmeldung über Microsoft mit einem Code statt mit Passwort. Einmalig eine
  App in Microsoft Entra anlegen (Anleitung im Tooltip), dann „Bei Microsoft
  anmelden“. Joe hält die Anmeldung selbst frisch; Home Assistant muss dafür
  nicht von außen erreichbar sein.
- Google bleibt beim App-Passwort: Google erlaubt die Anmeldung per Code für
  Postfächer nicht.

## 0.2.2

- **Postfach für Auto-Termine** (Einstellungen): Lade das Auto zu Terminen
  ein wie eine Person – aus jedem Kalender. Joe liest das Postfach per IMAP,
  trägt Einladungen mit Ort in den Kalender des Autos ein, sagt per SMTP zu
  und übernimmt Änderungen und Absagen.
- Anbieter: iCloud, Google, Infomaniak (mit App-Passwort) und jeder andere
  mit IMAP und SMTP. Microsoft folgt mit der Anmeldung über Microsoft.
- **Wer darf einladen?** Nur Absender auf deiner Liste (Adressen oder
  „@domain“); nicht erlaubte Einladungen zeigt Joe mit „Erlauben“-Knopf.
- **Welches Auto?** Beim Auto stellst du seine Einladungs-Adresse ein, z. B.
  auto+kona@… (mit nur einem Auto geht jede erlaubte Einladung an dieses).
- Das Passwort liegt in einem eigenen Speicher, nie in der Konfiguration oder
  der Diagnose.

## 0.2.1

- **Kalender je Auto:** Jedes Auto, das nach Bedarf lädt, bekommt einen
  eigenen Kalender in Home Assistant. Jeder Termin mit Ort darin ist eine
  Fahrt mit genau diesem Auto. Termine legst du in Home Assistant an, änderst
  oder löschst sie dort.
- **Aufs Handy:** Den Kalender abonnierst du mit einem Link (geheimer
  Schlüssel, jederzeit erneuerbar), wenn Home Assistant von unterwegs
  erreichbar ist.
- **Weitere Kalender des Autos:** Jeder Kalender aus Home Assistant –
  Google, iCloud/Infomaniak/Nextcloud (CalDAV), iCal-Links, Microsoft 365.
  Knöpfe starten die Einrichtung dieser Integrationen.

## 0.2.0

- **Netzdienlich verhalten** (Einstellungen → Betrieb, standardmäßig an):
  An sonnigen Tagen hält Joe das Laden der Speicher morgens zurück, der
  Überschuss geht ins Netz, und die Speicher laden in der Mittagsspitze –
  nur so lange, dass sie trotzdem voll werden (vorsichtig mit 80 % der
  Prognose gerechnet), und früher frei, wenn die Sonne zurückbleibt. Das geht
  bei Speichern, deren Ladeleistung Joe begrenzen kann (z. B. Fronius), und
  nur in den Modi „Vorschlagen“ und „Live“.
- **Was geht vor?** „Ersparnis“ (Standard): netzdienlich nur, wenn es nichts
  kostet. „Netz“: auch wenn es bis zu 30 ct am Tag kostet.
- Plan und Geräte zeigen, bis wann Joe das Laden zurückhält.

## 0.1.2

- **Das Auto ist kein Bedarf für den Hausspeicher:** Joe plant den Speicher
  ohne die Wallbox. Bisher zählte Autoladen wie normaler Hausverbrauch.
- **Wann läuft es?** Bei jedem Gerät mit eigenem Zähler: „Wenn es gebraucht
  wird“, „Nur mit Sonnenüberschuss“ oder „Nur mit günstigem Strom“. Geräte,
  die nur mit Überschuss oder günstigem Strom laufen, rechnet Joe für den
  Speicher heraus.
- **Hausverbrauch wie im Energie-Dashboard:** Netz + PV ± Speicher, so zählt
  auch ein Balkonkraftwerk mit. Ein Hausverbrauchs-Sensor dient zum Vergleich
  und als Ersatz. Weicht er deutlich ab, sagt Joe es in der Übersicht. Nach
  dem Update liest Joe die letzten Wochen einmal neu ein.
- Die Übersicht zeigt beim Hausverbrauch, woher er kommt und welche Geräte
  Joe für den Speicher herausrechnet.

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
