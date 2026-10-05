# Änderungen

Jede Version, die HACS anbietet, steht hier. Kleine Schritte zählen hinten
hoch (0.1.0, 0.1.1, 0.1.2 …), größere vorne (0.2.0).

## 0.9.3

- Anwesenheit aus einem einzigen Helfer: Ob jemand zu Hause ist, entscheidet Joe nur noch über eine Entität, z. B. „Jemand zu Hause“. Im Haushalt (auch bei der Einrichtung) schlägt Joe vor, ihn anzulegen: du wählst die Personen, auf Wunsch kommt ein Gastmodus-Schalter dazu. Beides sind normale Helfer in Home Assistant (Template-Binärsensor und Schalter) und funktionieren auch ohne Joe. Eine eigene, vorhandene Gruppe kannst du stattdessen wählen.
- Die Liste „Gilt auch als zu Hause“ aus 0.9.2 entfällt dafür. Ohne Helfer schaut Joe wie bisher auf eure Personen.

## 0.9.2

- Klima → „Wer ist da?“: „Gilt auch als zu Hause“. Wähle zusätzlich z. B. einen Gastmodus-Helfer oder deine Gruppe „Jemand zu Hause“. Ist eine davon „an“ oder „zu Hause“, verhält sich Joe so, als wäre jemand daheim – für den Babysitter oder Kinder ohne getracktes Handy.
- Klima: Die aufklappbaren Entitäten sind wieder klein und einheitlich dargestellt.

## 0.9.1

- Einstellungen → Für Profis: neuer Schalter „Wandlerverluste beim Netzladen mitrechnen“ (Standard: aus). Für Speicher, deren eigene Messung hinter dem Wechselrichter sitzt (z. B. BYD am Fronius): Joe misst in Nächten mit Netzladen ohne Sonne am Netzzähler, wie viel vom Netzstrom wirklich ankommt, und rechnet es ein, wenn der Schalter an ist. Den Wert zeigt er unter Lernen → Speicher, sobald er 5 solche Nächte hat.

## 0.9.0

- Entladegrenze je Speicher: Joe liest sie vom Gerät (Fronius „Mindestreserve“, Marstek „Discharge Cutoff“ …) und zeigt sie unter Geräte → Speicher. Du kannst eine eigene Zahl eintragen; kann Joe nichts auslesen, fragt er dort danach.
- Die Planung rechnet je Speicher mit dem höheren Wert aus seiner Entladegrenze und der Reserve aus den Regeln – statt mit einer Reserve für alle zusammen. Hat Joe die Grenze selbst gerade angehoben (zum Laden), zählt der Wert von vorher.

## 0.8.0

- Längeres Gedächtnis: Joe hebt seine Stunden jetzt bis zu 10 Jahre auf (vorher gut 2) und liest beim nächsten Start einmal so weit zurück, wie die Langzeit-Statistik von Home Assistant reicht – bis zu 2 Jahre. Das Verbrauchsmodell lernt aus allen Jahreszeiten: Neue Tage zählen am meisten, der letzte Winter zählt aber weiter mit. So fängt Joe nicht jeden Winter neu an.
- Klima: „Wann ist nachts?“ – feste Uhrzeiten je Klimaanlage oder eine Entität, die „an“ ist, solange ihr im Bett seid (z. B. ein Helfer deiner Gute-Nacht-Routine, ein Bettsensor oder ein Zeitplan). Zum Morgen fährt Joe die Räume trotzdem rechtzeitig wieder hoch.
- Klima: Die Entität jedes Geräts steht beim Darüberfahren am Namen und zum Aufklappen darunter; in der Messgeräte-Liste auch die Sensoren des Messgeräts.

## 0.7.1

- Klima: Die Messgeräte stehen jetzt in einer eigenen Liste „Messgeräte“ – eine Zeile pro Klimagerät mit Auswahl, gruppiert nach „verbunden über …“. Joes Vorschlag ist vorgewählt („Bestätigen“ übernimmt ihn). Hängen mehrere Klimageräte am selben Messgerät, steht das direkt darunter.

## 0.7.0

- Klima: Messgerät koppeln. Zu jedem Thermostat und jeder Klimaanlage zeigt Joe, welches Gerät Leistung und Energie misst – z. B. den Kanal „Schlafzimmer Klimaanlage“, verbunden über „Shelly Pro 3EM HV Gerätemessungen“. Passen Name oder Raum, schlägt er es vor: „Passt“, „Anderes Messgerät“ oder „Hat keins“. Gekoppelt siehst du Leistung und Zählerstand live.
- Mehrere Klimageräte dürfen sich ein Messgerät teilen; Joe zeigt dann, mit wem, und dass die Messung für alle zusammen gilt.

## 0.6.5

- Kalender-Regeln pro Person: Unter „Lernen → Kalender-Regeln“ wählst du oben „Alle“ oder eine Person. Mit dem Schalter „Gilt für alle“ folgt die Person den gemeinsamen Regeln; schaltest du ihn aus, bekommt sie eigene Stichworte und eigene Vorgaben für Tage ohne passenden Termin (zum Start eine Kopie der gemeinsamen).

## 0.6.4

- Pfeile zwischen den Themen über Joes Fragen zeigen die Reihenfolge.

## 0.6.3

- **Fragen mit Themen:** Über Joes Fragen steht jetzt nicht nur „Frage 1
  von 4“, sondern auch, worum es geht – Tarif, Speicher, Heizen,
  Warmwasser, E-Auto, Haushalt. Ein Tipp auf ein Thema springt direkt zur
  Frage; beantwortete haben einen Haken.

## 0.6.2

- **Feiertage aus einem Kalender:** Ist ein Feiertagskalender eingetragen
  (z. B. „Feiertage in Deutschland“), erkennt Joe jetzt auch Feiertage an
  kommenden Tagen – für den Plan der Nacht, den Verlauf und die Profile an
  freien Tagen im Bereich „Klima“. Vorher galt bei einem Kalender nur
  Montag bis Freitag.
- Beim Marstek steht jetzt „Automatisch (Omnibattery)“ – der Name der
  Integration, über die Joe steuert.

## 0.6.1

- **Handy unter seinem heutigen Namen:** Bei den Benachrichtigungen zeigt
  Joe dein Handy so, wie es in Home Assistant heißt – nicht mehr unter dem
  Namen, den die App beim Einrichten hatte. Gibt es den gewählten Dienst
  nicht mehr, sagt Joe das.
- **„Später“ ersetzt:** Bei Wallbox und Auto steht jetzt, ob Joe sie nutzt
  („genutzt“) oder wo du sie einrichtest („noch nicht genutzt“).

## 0.6.0

- **Neuer Bereich „Klima“:** Joe steuert auf Wunsch Thermostate und
  Klimaanlagen – jedes Gerät einzeln an- und abwählbar.
  - Ist keiner zu Hause: absenken (Kühlen: anheben), ganz aus oder ein Profil
    des Geräts, bei Homematic IP z. B. dein Heizprofil „Abwesend“.
  - An freien Tagen (Wochenende, Feiertag) auf Wunsch ein eigenes Profil.
  - Kommt jemand heim (Integration „Nähe“/Proximity), fährt Joe den Raum so
    früh hoch, wie er es laut Gelerntem braucht.
  - Klimaanlagen auf Wunsch nachts aus und rechtzeitig vor dem Morgen an.
  - Joe stellt immer genau zurück, was vorher eingestellt war, und steuert
    erst im Modus „Live“ – in der Simulation zeigt er nur, was er täte.

## 0.5.0

- **Dashboard-Karten:** Joe bringt zwei Karten mit, die direkt in der
  Kartenauswahl stehen – ohne Ressource von Hand:
  - **Joe heute Nacht:** Plan, Kosten, Status und „Heute aussetzen“.
  - **Auto laden:** Ladestand und Reichweite, „Laden bis … % oder km“ mit
    „Jetzt laden“ und „Heute Nacht laden“.

## 0.4.3

- **Marstek sicherer:** War die „Manuelle Batteriesteuerung“ schon an, bevor
  Joe steuerte (z. B. durch eine eigene Automation), stellt Joe den
  Betriebsmodus am Morgen trotzdem zurück – der Akku bleibt nicht im
  Zwangsladen. Schaltet jemand anderes den manuellen Modus mitten in der
  Nacht aus, lässt Joe den Akku für den Rest der Nacht in Ruhe, statt jede
  Minute gegen Omnibattery zu schreiben.

## 0.4.2

- **Marstek über Omnibattery:** Joe schaltet vor dem Steuern die
  „Manuelle Batteriesteuerung“ des Akkus ein und danach wieder aus – mit
  Pausen zwischen den Befehlen. Danach übernimmt Omnibattery wieder selbst.
  Bei schon eingerichteten Speichern trägt Joe den Schalter beim Start nach;
  der Testlauf muss einmal neu gemacht werden.
- **Automationen an deinen Speichern** (Seite „Geräte“): Joe listet alle
  Automationen, die etwas an deinen Speichern setzen, und schaltet sie auf
  Wunsch alle aus – mit Zeit und Grund, auch im Logbuch der Automation. „Wieder
  einschalten“ macht genau das rückgängig, ebenso das Entfernen von Joe.
- **Laden beim Auto:** „Laden bis … % oder km“ mit Umschalter, dazu „Jetzt
  laden“ (sofort) und „Heute Nacht laden“ (in der günstigen Zeit bis genau
  dorthin).
- **Kalender des Autos repariert:**
  - Hängt nach einem Update noch die alte Oberfläche im Browser, sagt Joe das
    und bietet „Neu laden“ an.
  - Anmelden, Passwort und „Kalender lesen“ gehen schon vor dem Speichern und
    nehmen die Einstellungen, die gerade im Editor stehen.
  - Solange Joes eigene Apps fehlen, ist das Feld für die eigene App bei
    Google und Microsoft gleich offen – mit ehrlichem Hinweis.
  - Verständliche Fehlertexte statt Codes; „Fehler beim Speichern“ nur noch,
    wenn wirklich etwas nicht gespeichert wurde.
  - Kopieren des Abo-Links klappt auch, wenn Home Assistant lokal über http
    läuft.
  - Eine eingetippte, aber nicht hinzugefügte Adresse bei „Wer darf das Auto
    einladen?“ geht nicht mehr verloren.
  - Fahrten, die du bis 0.3 von Hand in Joes Kalender eingetragen hast,
    zählen weiter, bis sie vorbei sind.
- Status-Sensor kennt jetzt auch „Hält das Laden zurück“ (netzdienlicher
  Vormittag).
- README neu gegliedert.

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
