# Änderungen

Jede Version, die HACS anbietet, steht hier. Kleine Schritte zählen hinten
hoch (0.1.0, 0.1.1, 0.1.2 …), größere vorne (0.2.0).

## 0.9.43

- **Jeder Weg ist eine eigene Strecke.** Für das Laden nach Bedarf habe ich bisher die Entfernung von zu Hause zu jedem Termin genommen und sie für „Hin und zurück“ verdoppelt. Jetzt fahre ich den Tag ab, wie du ihn fährst: von zu Hause zum ersten Termin, von dort zum nächsten und vom letzten wieder heim, jede Strecke beim Routendienst einzeln gefragt. Ein Rückweg, der anders verläuft oder länger ist, zählt so, wie er ist, und zwei Termine hintereinander kosten nicht mehr zweimal die volle Strecke ab Haus. Unter „Fahrten morgen“ steht bei jedem Termin, woher die Strecke kommt, und als letzte Zeile „Zurück nach Hause“.
- Deine eigene Entfernung für einen Ort gilt weiter einfach, für den Weg hin von zu Hause und zurück nach Hause.
- Nicht geprüft an echter Anlage: alles davon.

## 0.9.42

- **Ehrliche Sätze bei vollen Speichern.** Stand das Nachtziel auf 100 %, schrieb ich „mehr braucht's nicht“ und „Auch wenn der Tag schlecht kommt, lohnt mehr nicht“. Das ist Unsinn: Mehr passt schlicht nicht hinein. Jetzt steht da „Ich lade ab 00:00 Uhr voll“ und bei „Warum 100 %“, wie weit es reicht: entweder bis zur nächsten Nacht oder „Selbst so sind die Speicher morgen gegen 18:00 Uhr leer; danach kommen noch etwa 6,9 kWh zum Tagespreis aus dem Netz“, aus meiner eigenen Rechnung für morgen.
- **„Mehr spart nichts“ sagt jetzt, warum**: Was ich zusätzlich laden würde, ersetzt morgen keinen Tagesstrom, es drängt mittags Sonne ins Netz oder liegt bis zur nächsten Nacht im Speicher.
- Nicht geprüft an echter Anlage: alles davon.

## 0.9.41

- **Erst warten, dann fragen.** Steckst du ein Auto an, frage ich nicht mehr sofort „Welches Auto ist das?“. evcc und die App des Autos brauchen ein paar Minuten, bis sie wissen, wer dranhängt, und meist erledigt sich die Frage damit von selbst. Ich frage erst, wenn es nach fünf Minuten noch keiner weiß.
- Nicht geprüft an echter Anlage: alles davon.

## 0.9.40

- **Ein Tipp statt Suchen.** Laufen die Speicher gegeneinander, während „Nacheinander“ aus ist (bei dir seit meinem Rat von gestern), steht das unter „Joe braucht dich“: wann welcher Speicher in welchen entladen hat, und ein Knopf „Nacheinander einschalten“. Ein Tipp, und ich halte die beiden wieder auseinander. „Brauch ich nicht“ blendet den Hinweis für diesen Tag aus.
- Nicht geprüft an echter Anlage: alles davon.

## 0.9.39

- **Der Wächter merkt sich, wenn es wieder passiert.** Lief der Venus gestern Nachmittag in den BYD, habe ich ihn neu gestartet, nach einer halben Minute war Ruhe, ein paar Minuten später ging es wieder los, rund 25-mal in einer Dreiviertelstunde. Läuft jetzt derselbe Speicher innerhalb von zehn Minuten ein zweites Mal in dieselbe Richtung gegen den anderen, sperre ich ihm diese Richtung und halte die Sperre, statt sie nach fünf Sekunden zurückzugeben. Frei wird er erst wieder, wenn er gebraucht wird: wenn das Haus eine Minute lang Strom aus dem Netz zieht und der andere nichts mehr gibt (beim gesperrten Laden spiegelbildlich: Einspeisung, und der andere nimmt nichts), wenn die Sonne weg ist, wenn die Nacht beginnt, wenn das Nacheinander wieder übernimmt, spätestens nach zwölf Stunden. Ist das Nacheinander an, hält es die Speicher ohnehin auseinander, dann bleibt es beim kurzen Eingriff. Im Logbuch und im Protokoll steht, was gesperrt ist und warum es wieder frei ist.
- **100 % heißt jeder Speicher voll.** Plante ich am Vormittag die Nacht, rechnete ich zwar damit, dass die Sonne beide Speicher bis zum Abend etwas füllt, teilte die Nachtladung aber mit den Ständen vom Vormittag auf. Dann bekam der BYD seine vollen 9,1 kWh und der Venus nur noch 3,7 kWh, Ziel 85 %, obwohl oben 100 % stand. Jetzt steigt der Startwert jedes Speichers mit, nach seinem freien Platz, und steht das Ziel auf 100 %, ist jeder Speicher auf 100 % gesetzt.
- Nicht geprüft an echter Anlage: alles davon.

## 0.9.38

- **„Voll“ heißt jetzt voll.** Nahm der Speicher, der dran war, 20 Sekunden lang nichts, während Strom ins Netz ging, galt er bisher als voll, egal bei welchem Ladestand. Heute Mittag hörte der BYD bei 40 % kurz auf zu laden, vermutlich ein Gerät, das einschaltete, und der Wechselrichter brauchte danach länger, um wieder anzufangen. Ich habe ihn für voll erklärt, ihm das Laden gesperrt und den Venus drangenommen. Der lief bald am Anschlag, bis zu 3 kW gingen ins Netz. Jetzt ist ein Speicher erst nahe an seiner Obergrenze voll (5 Punkte darunter). Nimmt er weiter unten nichts, ist das eine Pause: Er bleibt dran und darf weiter laden, und bleibt Sonne übrig, lädt der nächste solange nebenher mit fester Leistung. Im Logbuch steht dann „lädt gerade nicht, ich warte“.
- **Was ich selbst sperre, zählt nicht.** Halte ich dem Speicher, der dran ist, das Laden selbst zurück, etwa während der andere beim Entladen hilft, sagt sein „nimmt nichts“ nichts über voll. Heute habe ich so auch den Venus bei 51 % für voll erklärt. Dasselbe gilt fürs Entladen. Zwei Minuten nach jedem eigenen Schreiben an einem Speicher urteile ich gar nicht über ihn.
- **Alte falsche „voll“-Marken fallen weg.** Ein Speicher, den eine ältere Version weit unter seiner Obergrenze für voll gehalten hat, ist sofort wieder frei.
- Nicht geprüft an echter Anlage: alles davon.

## 0.9.37

- **Ich lerne aus den Vorjahren.** Wie gut die Sonnenprognose passt, wusste ich bisher nur seit dem Tag, an dem ich mitschaue, denn alte Prognosen stehen nicht im Verlauf. Hat ein Sensor über deine Prognosen eine Langzeitstatistik, etwa ein Summen-Helfer über genau die Prognosesensoren, die ich nutze, lese ich daraus für jeden vergangenen Tag die Prognose vom frühen Morgen nach und stelle sie neben die echte Erzeugung. Den Sensor finde ich selbst, du kannst ihn unter Geräte › Netz & Sonne auch auswählen. Bei dir reicht das bis Oktober 2024 zurück.
- **Die Jahreszeit zählt doppelt.** Sonnenfaktor und Streuung lerne ich jetzt aus bis zu zwei Jahren; Tage, die im Kalender höchstens 30 Tage vom heutigen entfernt liegen, zählen doppelt, egal aus welchem Jahr. Ein Oktober lernt so vor allem aus anderen Oktobern.
- **Das Tagesprofil kennt die Vorjahre.** Neben den letzten 28 Tagen zählen dieselben Wochen der Vorjahre mit halbem Gewicht. Dunkle Morgen und Heizung im Herbst kommen so schon im ersten kalten Oktober an.
- **Ich spiele meine Nächte nach.** Einmal pro Woche rechne ich jede vergangene Nacht mit Prognose noch einmal mit jeder Stufe des Reglers „Wie vorsichtig plane ich die Nacht?“ durch und schaue, was sie am echten Tag gekostet hätte. Das Ergebnis steht unter Rückblick › Gelernt, für alle Nächte und nur für diese Jahreszeit. Wäre eine andere Stufe günstiger gewesen, steht das bei der Einstellung. Umstellen tust du selbst.
- Ob es an einem vergangenen Tag geregnet hat, steht nicht im Verlauf. Die Regen-Klasse lerne ich deshalb erst ab jetzt, die Vorjahre zählen nach klar, gemischt und bedeckt.
- Nicht geprüft an echter Anlage: alles davon.

## 0.9.36

- **Ich plane die Nacht gegen einen schlechten, einen typischen und einen guten Tag.** Bisher habe ich jedes Nachtziel nur gegen den Tag gerechnet, wie er laut Prognose und Verbrauchsprofil kommen soll. Kam er schlechter, waren die Speicher abends leer, und du hast Tagesstrom gekauft. Jetzt rechne ich jedes Ziel auch gegen einen Tag mit weniger Sonne und mehr Verbrauch und gegen einen mit mehr Sonne und weniger Verbrauch, und ich nehme das Ziel, das im Mittel am wenigsten kostet. Weil eine fehlende Kilowattstunde abends den Tagespreis kostet und eine zu viel geladene nur die Verluste, lade ich bei unsicheren Tagen voller, bei sicheren knapp.
- **Wie weit ich danebenlag, lerne ich.** Bei der Sonne je Wetterlage, jetzt auch bei Regen, bei dem die Vorhersage öfter zu hoch liegt. Beim Verbrauch getrennt nach kalten und milden Tagen. Solange ich zu wenige Tage habe, rechne ich mit vorsichtigen Annahmen. Unter Rückblick › Gelernt steht, wie sicher meine Vorhersagen sind.
- **Neuer Regler unter Einstellungen › Regeln: Wie vorsichtig ich die Nacht plane**, von „Mutig“ bis „Vorsichtig“. Standard ist „Eher mutig“: Ein schlechter und ein guter Tag zählen gleich viel. Das hat in deinen Oktobernächten am wenigsten gekostet, weil Mehrladen an sonnigen Tagen Sonne für 6,2 ct ins Netz drückt. Bei „Ausgewogen“ zählt der schlechte Tag doppelt.
- **Im Plan steht, warum es dieses Prozent ist**: was der typische Tag allein bräuchte, was mehr im schlechten Fall spart und was es im guten kostet.
- **Den Puffer lerne ich nicht mehr**, die drei Tage ersetzen ihn. Ein Puffer, den du selbst einträgst, gilt weiter obendrauf.
- Nicht geprüft an echter Anlage: alles davon.

## 0.9.35

- **Die Speichergröße kommt vom Gerät, nicht mehr aus meiner Tagesrechnung.** Bisher habe ich die nutzbare Größe aus Tagesbilanzen geschätzt (Entladen = Wirkungsgrad × Geladen − Größe × Füllstandsänderung) und damit geplant. Bei dir ergab das 6,5 kWh für einen BYD mit 10,2 kWh: Die meisten Tage enden abends so voll, wie sie morgens begonnen haben, und sagen über die Größe nichts; die Stundenwerte aus der Historie sind Mittelwerte und hinken dem Füllstand bis zu einer Stunde hinterher; die erste Stunde des Tages zählte ich nicht, ihren Füllstandssprung schon; und nachts verliert der Speicher Punkte, ohne dass Energie fließt. Jetzt plane ich mit dem, was die Integration meldet, oder mit dem, was du einträgst. Nur wenn beides fehlt, nehme ich meine Messung.
- **Gemessen wird trotzdem, aber nur zum Anschauen.** Aus den Lade- und Entladeläufen (Stunden, in denen nur in eine Richtung Energie fließt, mindestens 25 Punkte Hub, Füllstand aus den ruhigen Nachbarstunden) rechne ich je Lauf die Größe und nehme den Median. Unter Rückblick › Gelernt steht „gemessen 9,5 kWh aus 11 Läufen“ neben dem Wert, mit dem ich rechne, auf der Speicherseite unter dem Kapazitätsfeld auch. Weicht die Messung mehr als 15 % ab, steht es unter „Joe braucht dich“, und du entscheidest, ob du die Größe änderst. Von selbst überschreibe ich nichts mehr. Der Wirkungsgrad kommt weiter aus der Tagesrechnung, dafür taugt sie.
- Nicht geprüft an echter Anlage: alles davon. Beim BYD sollten rund 9,5 kWh gemessen werden, beim Venus rund 4,5.

## 0.9.34

- **Nebenher laden mit fester Leistung.** Gibt die Sonne fünf Minuten lang mehr als 600 W Überschuss, obwohl der aktive Speicher lädt, lädt der nächste mit – nicht als zweiter Regler, sondern mit einer festen Leistung, die ich jede Minute neu ausrechne: sein Anteil am Überschuss nach freiem Platz, so werden beide etwa gleichzeitig voll; höchstens seine eigene Leistung, höchstens der Überschuss minus 300 W, damit dem aktiven etwas zum Regeln bleibt. Grundlage ist der niedrigste Überschuss der letzten zwei Minuten, also was alle Speicher nehmen plus was ins Netz geht, nicht die Einspeisung, die der aktive ja auf null regelt. Neu geschrieben wird erst ab 200 W Unterschied. Der aktive darf währenddessen nicht entladen. Die Venus als zweite: Omnibattery manuell und „Laden X W“; der BYD als zweiter: die Entladerate unter 0 über Modbus, nur aus der Sonne, Netzladen fasse ich nicht an. Zieht das Haus 20 Sekunden über 150 W aus dem Netz, nehme ich dem zweiten so viel weg, wie bezogen wird, und halte das zehn Minuten; unter 300 W ist Schluss. Schluss auch nach zehn Minuten unter 600 W, wenn das Haus wieder Strom braucht, der zweite voll ist oder die Drossel für die Wallbox den Überschuss braucht; danach frühestens nach zehn Minuten wieder. Nur mit „Automatisch“, nie mit „Nur nacheinander“.
- Nicht geprüft an echter Anlage: alles davon.

## 0.9.33

- **Werksreset.** Unter Einstellungen › Wartung & Sichern gibt es „Alles auf Anfang“: Ich stelle jeden Hebel zurück, den ich noch halte, lösche alles, was ich mir gemerkt habe (Einstellungen, Gelerntes, Verlauf, Pläne, Ergebnisse, Kalender, Postfächer, Autos, Klima), und beginne mit der Einrichtung von vorn, als hättest du mich gerade installiert. Deine Automationen und Helfer, meine Entitäten und der Download in HACS bleiben. Davor fragt ein Hinweis nach und erinnert ans Sichern; was ich nicht zurückstellen konnte, sage ich dir danach.
- Nicht geprüft an echter Anlage: alles davon.

## 0.9.32

- **Ein Puffer macht aus einer Nacht, die sich lohnt, kein „nichts“ mehr.** Die Mindestersparnis habe ich bisher am Ziel samt Puffer geprüft. Stand der gelernte Puffer am Maximum, verdoppelte er das Ziel (bei dir von 47 auf 83 %), die Ersparnis fiel unter 5 ct, und ich ließ die ganze Nacht aus: beide Speicher leer, das Haus zog bis zum Morgen 1,5 kW aus dem Netz, so in den Nächten zum 19., 20. und 22.10. Jetzt prüfe ich die Ersparnis am Optimum. Lohnt sich der Puffer obendrauf nicht mehr, lade ich das Optimum, nicht nichts.
- **Unmögliche Stunden fliegen raus.** In deinem Verlauf stand für 18 Uhr ein Mittelwert von 133 kWh in einer Stunde, der Modelltag hatte 170 statt rund 40 kWh, und daraus hatte ich den Puffer gelernt. Eine Stunde mit mehr als 100 kWh oder mit einem Vielfachen dessen, was dein Verbrauchssensor sah, zählt jetzt als Zählfehler: Der Sensor steht ein, und eine live gezählte Stunde lese ich aus Home Assistant neu. Woher der Ausreißer kam, habe ich nicht gefunden; in Home Assistants Statistiken ist er nicht.
- **Der Verlauf wird einmal neu gelesen**, die letzten 56 Tage aus Home Assistants Statistiken. Der gelernte Puffer fängt dabei von vorn an, die Rückblicke der gelesenen Tage auch, und „hatte gespart“ rechnet sich daraus neu.
- **Eine Nacht, die ich auslasse, steht im Protokoll und im Logbuch**, mit Grund: Ersparnis unter deiner Mindestersparnis, die Speicher reichen bis die Sonne übernimmt, über dem Höchstpreis, von dir ausgesetzt, abgelehnt oder keine Antwort. Die Übersicht sagt es bei „Was es gebracht hätte“ auch am Morgen danach noch.
- **Die Diagnose-Datei trägt die Stunden der letzten 14 Tage**, damit so ein Ausreißer beim nächsten Mal zu finden ist.
- Der Hinweis unter Geräte › Netz & Sonne dreht sich um, wenn deine Bilanz weit über dem Sensor liegt: Dann ist die Bilanz verdächtig, nicht der Sensor.
- Nicht geprüft an echter Anlage: alles davon. Ob die Nacht lädt, zeigt sich um Mitternacht im Protokoll.

## 0.9.31

- **Übergabe nur nach dem Zähler.** Wer dran ist, bleibt dran, bis er nichts mehr gibt oder nichts mehr nimmt. Gibt der aktive Speicher 20 Sekunden lang nichts, während das Haus über 150 W braucht, übernimmt der nächste; nimmt er 20 Sekunden lang nichts, während das Haus einspeist, ebenso. Dafür schaue ich alle 5 Sekunden auf den Zähler, nicht mehr nur jede Minute. Keine Übergabe mehr nach Prozent (der BYD lief gestern Nacht bis 12,6 % und wurde dann gesperrt, obwohl er bis 11 % konnte) und keine mehr nach der Reihenfolge: Die sagt nur, wer als Nächster kommt. Die eigene Untergrenze zählt weiter als leer, denn die ist deine Entscheidung.
- **Keine Übergabe an einen Speicher, der fast voll oder fast leer ist**, unter 0,3 kWh Platz oder Rest. Zwei volle Speicher schaukeln sich nicht mehr auf: Der aktive bleibt, der Überschuss geht ins Netz. Gestern Mittag waren das vier Übergaben in einer Stunde bei 93 bis 100 %.
- **Helfer nach 20 Sekunden.** Zieht das Haus 20 Sekunden lang über 150 W aus dem Netz, obwohl der aktive Speicher gibt, egal ob am Limit oder nur ein Tröpfeln, darf der nächste mit entladen. 40 Sekunden ohne Bezug, und er wartet wieder, es sei denn, der Bedarf liegt noch über dem, was der aktive allein schafft, denn dann wäre er gleich wieder dran. Gestern um 12:56 hätte der volle BYD so nach 20 Sekunden ausgeholfen, statt dass 1,5 kW aus dem Netz kamen.
- **Nebenher laden ist aus**, bis es mit einer festen Leistung für den zweiten Speicher wiederkommt. Zwei Regler, die frei an einem Zähler arbeiten, kämpfen gegeneinander; das war das Ping-Pong am Morgen. Bis dahin wird an schwachen Tagen vielleicht nur ein Speicher voll. Die Frage „soll ich früher mitladen lassen?“ stelle ich solange nicht.
- **Meine Worte in deiner Sprache.** Push und Logbuch-Zeilen kommen in der Sprache, in der du das Panel zuletzt gesehen hast, nicht mehr in der des HA-Servers.
- Nicht geprüft an echter Anlage: alles davon.

## 0.9.30

- **Deine Automationen fasse ich nicht mehr an.** Bisher schaltete ich Automationen, die auf deine Speicher schreiben, auf Wunsch aus – und von selbst wieder ein, sobald ich nicht koordinierte, etwa bei einer fehlenden Grenze, nach einem Neustart oder beim Wechsel auf Modbus. So kam die 2000-W-Falle zweimal zurück. Damit ist Schluss: Ich schalte keine Automation mehr aus oder ein, auch nicht beim Deinstallieren. Der Knopf im Panel ist weg, dafür führt ein Link zu den Automationen in Home Assistant. Läuft eine, die auf einen Speicher schreibt, während ich steuere, sage ich es: unter „Joe braucht dich“, auf der Speicherseite, im Protokoll und einmal aufs Handy – „spuckt mir in die Suppe, besser ausschalten“. Ich arbeite trotzdem weiter, auch beim Drosseln am Tag und beim Wächter; du entscheidest.
- **Sichtbar im Logbuch.** Jeden Regler, den ich setze, trage ich in Home Assistants Logbuch der Entität ein, mit Wert und Grund – etwa „Energy Joe: Marstek Venus Allow Discharge → aus: Nacheinander: BYD ist dran“. So für Nachtplan, Warten, Nacheinander, Drossel, Wächter, Testlauf, Probe und Zurückstellen.
- **Diagnose-Datei mit Protokoll.** Die Diagnose (Einstellungen › Integrationen › Energy Joe › Diagnose herunterladen) enthält jetzt mein Protokoll, den Zustand von „Nacheinander“ und des Wächters, festgehaltene Speicher und die Automationen, die mir im Weg sind.
- Nicht geprüft an echter Anlage: alles davon.

## 0.9.29

- **Speicher kann nicht arbeiten: Ich sage es dir.** Kann ein Speicher wegen einer Einstellung, die nicht von mir ist, nicht laden oder entladen – die Reserve auf oder über dem Stand, eine Sperre am Gerät, die jemand anderes gesetzt hat –, und zieht das Haus deshalb 15 Minuten lang aus dem Netz (oder gibt hinein, obwohl der Speicher Platz hat), melde ich es: in Home Assistant immer, aufs Handy mit dem neuen Schalter „Speicher kann nicht arbeiten“ unter Einstellungen › Benachrichtigungen, dazu unter „Joe braucht dich“ und auf der Speicherseite mit Entität, Wert und seit wann. Zurück stelle ich davon nichts: Du hast es gesetzt, ich sage nur Bescheid. Liegt die Reserve auf deiner eigenen Reserve des Speichers, ist alles in Ordnung und ich schweige.
- **Nacheinander: Wer nichts liefert, gibt ab.** Gibt der Speicher, der dran ist, 15 Minuten lang nichts, während das Haus aus dem Netz zieht, übernimmt der nächste – egal, ob er wirklich leer ist oder festgehalten wird. Nach einer Stunde, oder sobald er doch entladen hat, ist er wieder dran. Heute Abend hätte so die Venus übernommen, statt dass das Haus eine Stunde lang 1 kW aus dem Netz zog.
- **Fronius über Modbus: die Reserve bleibt deine.** Beim Laden setze ich die Reserve nicht mehr aufs Ziel. Ich stoppe am Ziel selbst, der Wechselrichter lädt ohnehin bis sein Akku voll meldet.

## 0.9.28

- **Fronius GEN24 über Modbus: Laden mit Leistung.** Über die Fronius-Integration lädt ein GEN24 aus dem Netz nur mit den etwa 500 W seiner „Erzwungenen Nachladung“, egal wie groß der Speicher ist. Mit Leistung laden geht nur über die SunSpec-Register des Wechselrichters. Das kann ich jetzt selbst: Im Dialog „Regler für …“ gibt es die Wahl „Fronius über Modbus“ – Adresse aus der Fronius-Integration vorbelegt, Port 502, Geräte-ID 1, „Verbindung prüfen“ zeigt Typ, Firmware, Seriennummer, Registerkarte, Bezugsleistung (WChaMax), Nennleistung, Stand und Zustand, ohne etwas zu schreiben. Nach dem Speichern lege ich für den Wechselrichter eigene Entitäten an (Laderate, Entladerate, Mindestreserve, Laderate aktiv, Entladerate aktiv, Laden aus dem Netz, Bezugsleistung, Ladestand, Speicherzustand) und steuere den Speicher damit wie jeden anderen: Laden mit der geplanten Leistung über die negative Entladerate, Warten mit beiden Raten auf 0, am Ende alles zurück. Keine YAML-Konfiguration, keine Helfer, keine Skripte. Im GEN24 müssen Modbus TCP und „Steuerung erlauben“ an sein, im Batteriemanagement „Batterieladung aus dem Netz erlauben“; eigene Skripte dürfen nicht parallel auf dieselben Register schreiben. An echter Hardware noch nicht geprüft.
- **Fronius über die Reserve: ehrlich mit 500 W.** Ich plane das Netzladen über die Fronius-Integration von Anfang an mit 500 W statt 1.000 W, das Beispiel im Dialog sagt „Leistung bestimmt der Fronius“.

## 0.9.27

- **Warten statt Halten, Tag und Nacht.** Ein Speicher, der nachts gerade nichts tun soll, wartet jetzt so wie tagsüber: Laden und Entladen gesperrt mit dem Hebel des Tages – beim Fronius beide Grenzen auf 0 mit ihren Schaltern, bei Omnibattery beide Erlauben-Schalter. Vorher sperrte ich nachts nur das Entladen oder hielt über den Mindest-Ladestand; so konnte ein Speicher aufnehmen, was ein anderer ins Haus drückt, und die Reserve wurde mit dem Stand verrechnet. Der Mindest-Ladestand hält nur noch, wo kein Sperr-Hebel da ist, bei „Bis zum Ziel“ (entladen bis zum Ziel, dann warten) und wenn du eigene Halten-Schritte festgelegt hast. Im Dialog fällt „Nachts den Stand halten“ weg, wo es dasselbe ist wie „Warten“; „Warten“ trägt dann „Tag und Nacht“. Status nachts: „Wartet: weder laden noch entladen“.
- **Vorschau ehrlich.** Sie rechnet mit meinen gemerkten Originalen: Ein Wert, den eine Probe oder die Nacht gerade geschrieben hat, gilt nicht als deiner. Schritte, die nichts ändern, heißen „bleibt bei …“ und stehen nicht unter „Danach zurück“. Nach jeder Probe hole ich die Vorschau neu.
- **„Selbst festlegen“ ist ein Bearbeiten-Menü** auf derselben Liste: Entität tauschen, Wert je Art (Ein/Aus, Auswahl, Zahl mit Einheit und Platzhalter-Chips), Reihenfolge, Löschen, Hinzufügen, „Verwerfen“ und „Fertig“. Dienst-Schritte bleiben lesbar.
- **Größe vom Gerät.** Ich übernehme die Speichergröße vom Gerät – auch für Speicher, die vor dem Fronius-Schlüssel eingerichtet wurden („Maximum capacity“), und allgemein über Größen-Sensoren (Enphase, Powerwall, E3/DC, SolarEdge, Sungrow, Sigenergy, sonnen), nie Zähler oder Füllstand. Deine eingetragene Zahl bleibt; „weiß ich nicht“ ist damit beantwortet. Sinkt die gemeldete Größe später, ziehe ich nach.

## 0.9.26

- **Speicher-Dialog neu: Ich zeige, was ich tue.** Unter Geräte › Speicher › „Regler für …“ steht jetzt für jeden Vorgang – nachts laden, nachts halten, warten (beides gesperrt), nur Laden sperren, nur Entladen sperren, Überschuss fürs Auto lassen, zurückstellen – Schritt für Schritt, welche Entität ich in welcher Reihenfolge auf welchen Wert setze, mit dem Wert von jetzt daneben, und was ich danach zurückstelle. Beim Fronius siehst du so zum Beispiel: Ladegrenze 0 % → Schalter „Ladegrenze aktiv“ Ein → Entladegrenze 0 % → Schalter Ein; zurück erst die Schalter, dann die Werte.
- **Probe je Vorgang:** Mit „Probe“ schreibe ich einen Vorgang einmal wirklich, lese nach, ob dein Gerät jeden Wert übernommen hat, und stelle sofort alles zurück. So kannst du jede Anlage selbst prüfen – auch eine, die ich noch nie gesehen habe. Das Ergebnis steht am Speicher („zuletzt geprobt“) und im Protokoll.
- **Jeden Vorgang selbst festlegen:** „Selbst festlegen“ füllt meine Schritte vor; du änderst Entitäten, Werte oder Reihenfolge – auch fürs Sperren und Drosseln am Tag. Ich nutze dann deine Schritte statt meiner Profil-Logik, und du kommst jederzeit zum Profil zurück.
- **Zuordnung der Regler vollständig und ehrlich:** Alle Rollen, die ein Profil nutzt, stehen jetzt im Dialog (auch Ladegrenze, Ladegrenze aktiv, Laden/Entladen erlaubt), mit ihrer Bedeutung („Sollwert in W“ gegen „Deckel in %“). Weicht deine gespeicherte Zuordnung von dem ab, was mein Herstellerprofil heute findet, zeige ich es an („Profil: …“), unter „Joe braucht dich“ und auf der Speicherseite – „Übernehmen“ oder „So lassen“. Beim Fronius lagen so bei manchen die Grenzen unter „Ladeleistung/Entladeleistung“, und die Entladegrenze fehlte: Dann konnte ich den Speicher gar nicht sperren, ohne dass man es sah.
- **Zu langsames Netzladen fällt auf:** Lädt ein Speicher nachts 15 Minuten lang mit weniger als 40 % der geplanten Leistung (zum Beispiel, weil der Wechselrichter übers Hochsetzen der Reserve nur wenig zulässt), sage ich dir Bescheid, was du prüfen kannst, und plane ihn bis auf Weiteres mit der gemessenen Leistung. Nach jeder Nacht steht im Protokoll, wie viel jeder Speicher wirklich geladen hat („BYD: 2,1 von 4,5 kWh“).

## 0.9.25

- **Anhalten ohne Folgen:** Wenn du mich deaktivierst, neu lädst oder aktualisierst, stelle ich alle Werte zurück (mit mehreren Versuchen) und schalte deine Speicher-Automationen wieder ein. Beim Entfernen stelle ich erst zurück und lösche dann. Klappt etwas nicht, bekommst du eine Nachricht mit den Werten.
- **Kurze Aussetzer:** Fehlt ein Wert nur kurz (z. B. Modbus), lasse ich die Sperren zwischen mehreren Speichern nicht sofort fallen, sondern warte 90 Sekunden, ob er zurückkommt.
- **Einstellungen sicher:** Kann ich deine Einstellungen beim Start nicht lesen (z. B. nach dem Wechsel auf eine ältere Version), fange ich neu an, hebe die alten auf und biete unter „Joe braucht dich“ an, sie zurückzuholen. Künftige Versionen werfen unbekannte Einstellungen nicht mehr weg.
- **Zeitumstellung:** Die Nachtplanung rechnet richtig über die Zeitumstellung. In der Herbstnacht (25.10.) bekommt die doppelte Stunde 2–3 Uhr eigene Viertelstunden, Preise und ihr eigenes Netzlimit.
- **Netzlimit genauer:** Geräte, die nachts nur kurz laufen, belegen das Netzlimit nur in den Viertelstunden, in denen sie laufen.
- **Mindest-Ladestand nie zu hoch:** Nachts setze ich ihn nie über den aktuellen Ladestand, sondern runde auf die Stufe des Geräts ab (z. B. Victron 20 statt 25 %). Kann ich einen Speicher gerade nicht sperren, sage ich das – und solange lädt kein anderer Speicher aus dem Netz.
- **Mehrere Wechselrichter in einer Integration** (SolarEdge, Fox ESS, Huawei, Sungrow): Jeder Speicher bekommt die Regler seines eigenen Geräts. Kann ich sie nicht sicher zuordnen, zeige ich „Bitte prüfen“.
- **Dienste nur für Admins:** Meine Dienste dürfen nur noch Administratoren und Automationen aufrufen.

## 0.9.24

- **Speicher-Wächter:** Laden sich zwei Speicher gegenseitig (je über 20 W, 20 Sekunden lang), greife ich in Stufen ein. Zuerst starte ich die eigene Regelung des Speichers neu; läuft gerade Laden oder Entladen per Hand, beende ich es sauber. Danach sperre ich 5 Sekunden die laufende Richtung. Hilft das nicht, schicke ich eine Meldung, höchstens einmal pro Stunde. Jeder Schritt steht im Protokoll, und alles, was ich umschalte, stelle ich sofort zurück – auch nach einem Neustart oder Fehler. Ein- und ausschalten kannst du ihn unter Einstellungen › Regeln › Speicher.
- **Regelgruppen:** Speicher, die dasselbe System regelt (z. B. Omnibattery mit Venus und Victron), arbeiten zusammen. Ich stimme nur zwischen verschiedenen Systemen ab. Unter Geräte › Speicher › Mehrere Speicher steht bei jedem Speicher „Wer regelt ihn?“. Die Zuordnung schlage ich selbst vor, und wenn ich unsicher bin, frage ich nach.
- **„Nacheinander“ ist Standard:** Gibt es zwei Systeme, sorge ich von selbst dafür, dass immer nur eines arbeitet. Die wartenden Speicher sperre ich vorher komplett, nicht erst ab einer Schwelle. Wer das nicht will, wählt „Gleichzeitig“.
- **Deine Speicher-Automationen bleiben nur aus, solange ich wirklich selbst sperre.** Kann ich das nicht, schalte ich sie sofort wieder ein und sage dir, warum. Läuft gerade ein Speicher, halte ich meine Sperre, bis er aufhört – so verpasst deine Automation ihren Auslöser nicht.
- **Ich prüfe, ob meine Sperre wirklich ankommt.** Beim Fronius heißt das: Grenze 0 und Schalter an. Setzt der Wechselrichter sie zurück, schreibe ich sie neu; klappt das nicht, melde ich mich und gebe an deine Automationen ab.
- **Marstek über Omnibattery:** Gesperrt wird über „Laden erlauben“ und „Entladen erlauben“ der Batterie. Omnibattery regelt dabei weiter selbst und macht nach der Freigabe sofort weiter, auch nachts.
- **Nachts laden mit Verstand:** Mehrere Speicher laden nicht mehr alle auf denselben Stand. Wer morgens zuerst entlädt, bekommt zuerst. Ich lade so langsam wie möglich und so schnell wie nötig: bei gleichem Preis verteilt über die Nacht, sonst in den günstigsten Viertelstunden. Teurer wird es dadurch nie. Der Plan zeigt je Speicher, wie viel er wann mit welcher Leistung lädt und warum.
- **Hausanschluss:** Laden und Haus bleiben zusammen unter dem Netzlimit. Ohne eigenes Limit nehme ich den höchsten gemessenen Netzbezug und schlage ihn unter Einstellungen vor.
- **Fronius:** Ich bremse das Laden aus dem Netz über die Ladegrenze. Hält sich der Wechselrichter nicht daran, merke ich mir das und lade mit voller Leistung.
- **Tagsüber:** Kommt mittags mehr Sonne, als ein Speicher aufnehmen kann, lädt der nächste mit, statt dass die Sonne ins Netz geht. Entladen bleibt dabei gesperrt, und bei einer Wolke wartet er sofort wieder. Braucht das Haus mehr, als ein Speicher liefern kann (z. B. Backofen), hilft der nächste kurz beim Entladen.
- **Ich lerne aus jedem Tag:** Abends schaue ich zurück, lerne, wie früh der zweite Speicher mitladen sollte, und frage dich einmal, ob ich das künftig so machen soll.
- **Neu unter „Selbst einstellen“:** Automatisch, Nur nacheinander (wirklich nur einer, auch an schwachen Tagen) oder Grundlast teilen – mit Hinweis, dass das bei kleinen Lasten weniger effizient ist.
- **Netzdienlicher Morgen mit Puffer:** Morgens lade ich erst einen kleinen Puffer aus der Sonne, dann geht die Morgensonne ins Netz, und mittags lade ich den Rest. Braucht das Haus mehr, als die Sonne gerade liefert, kommt es aus dem Speicher statt aus dem Netz. Wie groß der Puffer sein soll, lerne ich aus deinen sonnigen Vormittagen. Unter Einstellungen › Regeln kannst du auch einen eigenen Wert setzen.
- **Viel mehr Speicher:** Neu sind Kostal über Modbus („Kostal Plenticore Battery Control“, auch bei „Nacheinander“), VARTA, sonnen (neue Integration), SENEC, Marstek über Modbus und Open API, Anker SOLIX und Deye. Huawei, Victron, Sigenergy, Fox ESS, GoodWe, Zendure, Solis, Growatt und weitere steuere ich genauer.
- **Mehr Speicher können tagsüber „nacheinander“ arbeiten und vom Wächter kurz gesperrt werden** – auch ohne eigene Sperr-Schalter, dann über ihre Leistungsgrenzen.
- **Speicher, die Einstellungen dauerhaft speichern** (z. B. Victron, SolarEdge), schone ich: Ich schreibe dort nicht ständig neu.
- **Kann ich einen Speicher nicht steuern, sage ich dir, warum** – und was du tun kannst, z. B. eine Freischaltung im Gerät oder eine ausgeschaltete Entität. Neue Übersicht „Unterstützte Speicher“ in der Anleitung.
- **Menüknopf am Desktop:** Ist die Home-Assistant-Seitenleiste ausgeblendet, gibt es links oben einen Menüknopf. Damit kommst du wieder ins HA-Menü.

## 0.9.22

- **Autos wiederfinden und zuordnen:** „Nochmal nach Autos suchen“ unter Geräte › Auto & Laden zeigt alle Autos, die Home Assistant kennt – aus evcc und aus den Integrationen der Hersteller, auch früher weggelassene, und bei welchem Auto sie schon hängen.
- Unter „Quellen“ eines Autos hängst du mit „Quelle hinzufügen“ eine oder mehrere Integrationen an das Auto (z. B. den Hyundai wieder an den Kona aus evcc). Gehört sie zu einem anderen Auto, frage ich vorher.
- Unter „+ Hinzufügen › Auto“ stehen auch früher weggelassene Autos – mit „Wieder nutzen“.
- Behoben: Nach dem Löschen eines Autos fand Joe dessen Hersteller-Integration nie wieder. Beim Löschen steht jetzt, wie du sie wiederfindest.
- „Laden bis … km“ zeigt die Reserve direkt dahinter („zzgl. 50 km Reserve“) und sagt, wo du sie änderst (beim Auto unter Steuern).
- Texte überarbeitet: Joe spricht auch in den Home-Assistant-Texten (Einrichtung, Dienste, Hinweise) in der Ich-Form, der Dienst „Nacht-Aktion“ heißt jetzt „Gerät heute Nacht einschalten“, Hinweise nennen den genauen Ort, lange Erklärungen sind in Absätze geteilt.

## 0.9.21

- Auto › Termine: Neue Erklärung „Wie funktioniert das mit dem Kalender?“ – warum es einen eigenen Kalender für das Auto gibt, wie sich der Kalender des Autos und die Kalender der Personen unterscheiden, die drei Wege, wie ein Termin hineinkommt (fertiger Kalender, Postfach ohne Kalender, Postfach mit Kalender), ein Beispiel von der Einladung bis zum Laden und was zählt. Sie ist offen, solange noch nichts eingerichtet ist, danach mit einem Tipp aufklappbar.
- Der Hinweis über den Terminen sagt jetzt, dass „Laden nach Bedarf“ auch gespeichert sein muss.

## 0.9.20

- Auto: Die Termine (wessen Termine zählen, Kalender des Autos, Postfach, Konto) lassen sich auf der Autoseite jetzt immer einstellen – auch bevor „Laden nach Bedarf“ an ist. Bisher war der Bereich bis dahin ausgeblendet.

## 0.9.19

### Auto und Wallbox getrennt
- Ein Auto hat jetzt seinen eigenen Bedarf – Fahrten, Termine, Reserve, Ladestand, „Laden nach Bedarf“ und neu „Höchstens laden bis“. Die Wallbox ist ein Ladepunkt, den Joe schaltet (bei evcc den Modus). Joe lädt immer das Auto, das gerade steckt.
- Welches Auto steckt, erkennt Joe am Fahrzeug in evcc, am Stecker-Sensor des Autos oder am einzigen Auto zu Hause. Sonst fragt er aufs Handy und unter „Joe braucht dich“ – mit einem Knopf je Auto und „Gast / anderes Auto“. Bis dahin lässt er die Wallbox in Ruhe. Je Ladepunkt einstellbar: fragen oder immer ein bestimmtes Auto annehmen.
- Ein Auto aus evcc und aus der Integration des Herstellers (z. B. Hyundai) wird ein Auto. Bei Unsicherheit fragt Joe; unter „Quellen“ lässt es sich trennen oder zusammenführen. Den Ladestand nimmt Joe am liebsten von evcc, jeder Wert zeigt seine Quelle. Joe fragt das Auto nie selbst ab.
- Abends erinnert Joe, wenn ein Auto für morgen laden müsste, aber nicht steckt (Uhrzeit je Auto).
- Neue Seiten unter Geräte › Auto & Laden: je Auto und je Ladepunkt. „Jetzt laden“, „Heute Nacht laden“ und die Dashboard-Karte „Auto laden“ gelten je Auto und laden an der Wallbox, an der es steckt.
- Deine bisherigen Einstellungen ziehen von selbst um. Mit einem Auto und einer Wallbox bleibt das Laden wie bisher.

## 0.9.18

### Mehrere Speicher: nacheinander statt gegeneinander
- Neu unter Geräte › Speicher: „Mehrere Speicher“. Regeln sich zwei Speicher selbst auf 0 am Zähler (z. B. Fronius und Marstek über Omnibattery), schieben sie sich gegenseitig Strom zu. Mit „Nacheinander“ arbeitet immer nur einer, die anderen sperrt Joe vorher – beim Fronius über Lade- und Entladegrenze mit Schalter, beim Marstek über die System-Leistungsgrenzen von Omnibattery (er bleibt im Automatikbetrieb).
- Reihenfolge getrennt fürs Laden und Entladen. Ist der erste voll oder leer, übernimmt der nächste; der erste ist erst wieder dran, wenn Sonne bzw. Bedarf eine Weile anhalten.
- Joe lernt, wo ein Speicher wirklich aufhört zu entladen (z. B. BYD bei 10,5 %), und wechselt danach 1,5 % vorher.
- Reicht die Sonne laut Vorhersage nacheinander nicht, laden die Speicher nebeneinander – nie erzwungen, ohne Netzbezug fürs Laden. Mit „Tagsüber Überschuss abgeben“ trägt der Speicher, der dran ist, die ganze Drosselung.
- Nachts steuert weiter der Nachtplan. Alle Sperren gehen zurück bei Moduswechsel, „Sofort freigeben“, Neustart und wenn ein Speicher wegfällt.
- Eigene Interlock-Automationen werden erkannt: Solange sie laufen, lässt Joe die Speicher in Ruhe und bietet an, sie auszuschalten.
- Wächter: Laden sich die Speicher trotz Sperre länger als zwei Minuten gegenseitig, meldet Joe sich (auch als Push).
- „Joe braucht dich“ schlägt „Nacheinander“ vor, sobald zwei Speicher sich selbst regeln. Ohne Wahl bleibt alles wie bisher.
- Behoben: Schaltete die Tagesdrosselung die System-Leistungsgrenzen von Omnibattery ein, konnte das Entladen des Marstek mitgesperrt werden.

## 0.9.17

### Neu: Tagsüber Überschuss abgeben (für evcc)
- An sonnigen Tagen drosselt Joe das Laden deiner Speicher: Sie laden nur so schnell, dass sie trotzdem voll sind, bevor die Sonne am Abend nicht mehr fürs Haus reicht. Den Rest sieht evcc am Netzzähler – ein Ladepunkt im PV-Modus (Auto oder z. B. Fußbodenheizung) läuft damit den ganzen Tag.
- Keine feste Uhrzeit: Joe rechnet jeden Tag aus der Vorhersage, wann die Sonne nicht mehr reicht – im Sommer später, im Winter früher. Du wählst nur, wie vorsichtig er ist (knapp 90 %, normal 80 %, vorsichtig 65 % der Vorhersage). Jede Minute neu gerechnet mit echtem Ladestand und echter Sonne: Hinkt die Sonne hinterher, lädt Joe sofort schneller; reicht sie nicht mehr, lässt er ganz los.
- Nur wenn ein evcc-Ladepunkt auf PV oder Min+PV steht und Strom nehmen kann, nur bei Speichern mit bestandenem Testlauf, nur im Live-Betrieb. In Simulation und „Vorschlagen“ zeigt Joe, was er tun würde.
- Marstek über Omnibattery: Joe nutzt die System-Leistungsgrenzen – der Speicher bleibt in seiner automatischen Regelung, der manuelle Modus wird tagsüber nie benutzt. Sind Ladeverzögerung oder prädiktives Laden an, warnt Joe.
- Speicher mit Ladegrenze in Prozent (BYD am Fronius) machen mit, sobald Joe weiß, wofür 100 % stehen: eintragen auf der Speicherseite oder Joe misst es an einem sonnigen Tag selbst (3 Minuten 50 %, danach alles zurück).
- Schreibt eine eingeschaltete Automation dieselbe Ladegrenze, lässt Joe diesen Speicher aus und zeigt sie bei den Störenfrieden. Hat jemand die Grenze inzwischen verstellt, schreibt Joe beim Zurückstellen nicht darüber.
- Sicher zurück: „Sofort freigeben“, Betriebswechsel, volle Speicher, Ende der Sonne, Nacht und ein Neustart von Home Assistant stellen die Ladegrenze zurück, wie sie war. Über Nacht bleibt nie etwas gedrosselt.
- Joe liest evccs Hausbatterie-Einstellungen und warnt, wenn batterieunterstütztes Laden oder Batterie-Boost den Speicher tagsüber leeren würden. An evcc ändert er nichts.
- Zu finden unter Einstellungen › Regeln › Speicher, je Speicher „Macht tagsüber mit“, im Plan „Heute tagsüber“, in der Übersicht unter „Joe tut gerade …“.

### Außerdem
- Netz & Sonne: Neuer Schalter „Ist ohne Sonne aus – das ist normal“ je PV-Messung (und ein Knopf direkt am Hinweis). Joe warnt dann nachts nicht mehr und zählt 0 W statt einer Lücke.
- Behoben: Der netzdienliche Morgen endete schon kurz nach dem Nachtfenster statt zur berechneten Uhrzeit.
- Protokoll: verständliche Texte für den netzdienlichen Morgen und das Ende der Drosselung.

## 0.9.16

- **Ersteinrichtung in der neuen Ordnung:** Beim Umschauen ist alles nach Geräte und Haushalt gegliedert. Neue Fragen: „Soll ich Heizung & Klima regeln?“ und „Ist Homeoffice bei euch der normale Arbeitstag?“; beim E-Auto geht es direkt weiter mit „Laden einrichten“.
- **„Später“ bei jeder Frage:** Übersprungenes steht danach in der Übersicht unter „Joe braucht dich“ und verschwindet, sobald es beantwortet ist – egal wo.
- Die Zusammenfassung am Ende sagt bei jeder Zeile, wo sie künftig wohnt („wohnt unter Geräte › Speicher“); ein Tipp darauf startet Joe und springt direkt hin.
- README und Entwicklerdoku beschreiben die sechs Reiter und ihre Adressen; letzte alte Begriffe in den Texten ersetzt.

## 0.9.15

- **Übersicht als Startseite:** oben „Gerade jetzt“ mit „Joe tut gerade …“ und „Sofort freigeben“, darunter „Joe braucht dich“ – nur wenn etwas offen ist: Warnungen der Prüfungen, fehlender Testlauf, fehlende Benachrichtigungen, neue Funde, Tagesfragen; jede Zeile springt an ihren Ort, Erledigtes verschwindet, „Brauch ich nicht“ blendet aus. Dazu „Heute Nacht“ mit „Ja, mach“ / „Heute aussetzen“, „Schnell“ (Auto laden, Gastmodus), Heizung & Klima je Raum, „Wer ist da“ als eine Zeile, die letzten 7 Tage und „Was es gebracht hätte“ als eine Zeile.
- **Plan:** „Was heute Nacht läuft“ zeigt Speicher, Autos, Warmwasser und eigene Geräte, jede Zeile mit Sprung zur Geräteseite. Unter „So habe ich gerechnet“ führt „Ändern →“ zu jeder Quelle (Sonne, Wetter, Tagesarten, Puffer, Preise, Regeln).
- **Einstellungen enthalten nur noch Joes eigenes Verhalten:** Betrieb (erklärt, öffnet den Betriebsart-Dialog oben), Regeln (bisher „Für Profis“, gegliedert in Speicher · Netz & Preis · Planung), Benachrichtigungen, Wartung & Sichern und Über Joe (mit Joes HA-Entitäten und den Dashboard-Karten). Ganz oben der Wegweiser „Suchst du …?“, der auch die alten Begriffe kennt.
- „Deine Antworten“ entfällt – die Folgeschritte stehen jetzt beim jeweiligen Gerät.

## 0.9.14

- **Geräte komplett:** Unter Geräte steht jetzt alles mit Strom nach Art sortiert – Alle · Speicher · Heizung & Klima · Auto & Laden · Warmwasser · Weitere Geräte · Netz & Sonne (Bereiche erscheinen nur, wenn es bei dir so ein Gerät gibt). Jedes Gerät hat eine eigene Seite in immer derselben Reihenfolge: Jetzt · Steuern · Strom · Gelernt · Protokoll · Störenfriede · Weglassen, dazu den Knopf „In HA öffnen“.
- **Speicher:** Name, Größe („lern es“), Höchstleistung, Entladegrenze und Reihenfolge direkt auf der Speicherseite; Testlauf unter „Jetzt“; „Regler einrichten“ als eigenes Blatt mit Entwurf; Automationen, die auf genau diesen Speicher schreiben, stehen als „Störenfriede“ dabei. Die Regeln für alle Speicher stehen auf der Speicher-Seite als Zeile mit „Ändern →“.
- **Auto & Laden, Warmwasser, Weitere Geräte:** Was bisher „Nacht-Aktion“ hieß, steht jetzt beim jeweiligen Gerät (Laden nach Bedarf, Termine des Autos, Warmwasser-Steuerung, „nachts einschalten“). Die Liste „Deine Geräte“ steht direkt unter Weitere Geräte; ändert man die Art, zieht das Gerät in seinen Bereich um.
- **Heizung & Klima:** jedes Klimagerät mit eigener Seite (Jetzt gilt … weil …, Profil von Hand, Wochenprofile, Homematic-Haken, Nachts aus, Messgerät, Aufheizrate, Protokoll); die Wochenprofile öffnen als eigenes Blatt mit Adresse.
- **Netz & Sonne:** Netzanschluss, Stromtarif, Einspeisung, Solaranlage (inkl. „Prognosen kombinieren“) und Hausverbrauch an einem Ort. „Was Joe nutzt“ in den Einstellungen entfällt.
- **„+ Hinzufügen“:** ein Assistent für Speicher, Auto/Wallbox, Warmwasser, Klimagerät, Gerät für die Nacht, Gerät mit Zähler und „Nochmal umschauen“. „Neu gefunden“ zeigt, was Joe Neues entdeckt hat.
- Die Dashboard-Karte „Auto laden“ öffnet beim Tipp auf den Kopf die Seite des Autos.
- Behoben: Ein geänderter Aufschlag auf den Börsenpreis ging beim Speichern des Tarifs verloren.

## 0.9.13

- Neue Ordnung: Oben stehen jetzt sechs Reiter – links die Zeit (Übersicht · Plan · Rückblick), rechts die Dinge (Geräte · Haushalt · Einstellungen). Jede Seite und jeder Unterbereich hat eine eigene Adresse, der Zurück-Knopf funktioniert, alte Links leiten weiter.
- Neuer Reiter **Haushalt**: Wer wohnt hier (Personen und Kalender), Wer ist da (Helfer „Jemand zu Hause“, Gastmodus, „Als abwesend erst nach …“, Heimweg mit Routendienst), Tage & Kalender (Arbeitstag-Sensor, Kalender-Regeln für alle oder je Person, „Zusätzlich frei, wenn …“, Vorschau heute und morgen), Nachtruhe und Unterwegs & Wetter. Jeder Bereich sagt, wer ihn nutzt.
- Neuer Reiter **Rückblick** statt Historie und Lernen: Ergebnis („Was es gebracht hätte“, „Wie gut ich lag“ mit Sprung zum Tag), Tage (die Antwort auf die Tagesfrage steht jetzt am Tag und lässt sich ändern), Gelernt (neu: Aufheizrate je Klimagerät, auch zum Neu-Anfangen) und ein gemeinsames Protokoll für Speicher, Geräte und Klima mit Filtern.
- Heizung & Klima ist jetzt ein Bereich unter **Geräte**. Jedes Klima- und Messgerät hat einen eigenen Knopf „In HA öffnen“; die Messgeräte sind gleich aufgeklappt. Anwesenheit, Tagesart und Nachtruhe stehen dort als Zeile mit „Ändern →“.
- Behoben: Beim Ladefehler der Historie wurde der Fehler bei vorhandenen Tagen nicht angezeigt.

## 0.9.12

- Wochenprofile für Klimaanlagen (Klima → Gerät → „Wochenprofile“), wie bei Homematic IP: je Betriebsart (Heizen, Kühlen) sechs Profile mit Temperaturverlauf über den Tag – alle Tage gleich, Mo–Fr und Sa–So oder jeder Tag einzeln. Ein Schaltpunkt darf auch „aus“ sein. Bearbeitet wird als Entwurf, erst „Speichern“ übernimmt.
- Haken je Profil: Normal, Feiertag, Abwesend, Homeoffice. Joe schaltet selbst um – aufs Abwesenheitsprofil, wenn seit 15 Minuten niemand da ist (einstellbar), aufs Feiertagsprofil an freien Werktagen, aufs Homeoffice-Profil, wenn der Kalender es sagt (nur wenn Homeoffice bei euch nicht der Normalfall ist). Kommt jemand heim, fährt er rechtzeitig zurück.
- Joe folgt der Betriebsart, die an der Klimaanlage eingestellt ist. Von Hand Verstelltes gilt bis zum nächsten Schaltpunkt; eine von Hand ausgeschaltete Anlage schaltet Joe nie selbst wieder ein. „Profil von Hand“ (bis heute 24:00 oder bis auf Weiteres) und „Zurück zum Plan“ gibt es direkt auf der Karte.
- Homematic IP: Dieselben Haken für die Heizprogramme deiner Thermostate (week_program). Joe wechselt nur das Programm, und nur im Automatik-Betrieb – die Zeiten bleiben im Gerät. Ein Programm, das du von Hand wählst (auch beim Zurückschalten auf Automatik), gilt, bis sich die Lage ändert – jemand geht oder kommt, ein freier Tag beginnt. Wirksam, sobald ein Programm den Haken „Normal“ hat; bisherige Einstellungen „Profil bei Abwesenheit“ und „an freien Tagen“ laufen bis dahin unverändert weiter.
- Neue Karte „Heute“: Arbeitstag, Wochenende oder Feiertag, wer laut Kalender im Homeoffice ist, und „Zusätzlich frei, wenn … an ist“ (z. B. CCU-Variablen für Brückentag oder Urlaub).
- Abwesend gilt jetzt für alle Klimageräte erst, wenn seit 15 Minuten niemand da ist (einstellbar unter „Wer ist da?“) – kurz weg schaltet nichts mehr um. Endet die Nacht in dieser Zeit, bleibt es erst einmal wie in der Nacht.
- Behoben: Bei Räumen mit „Nachts aus“ schaltete Joe beim Wiederhochfahren am Morgen unter Umständen minutenlang im Minutentakt an und aus.
- Wochenprofile und Haken übernehmen, sobald eine gerade laufende Nacht oder Abwesenheit vorbei ist (die Karte sagt das); werden sie während einer Nacht oder Abwesenheit abgeschaltet, läuft diese noch zu Ende. So wird nie mittendrin hin- und hergeschaltet.

## 0.9.11

- Klima: Ein Klick auf den Namen eines Klimageräts oder eines Messgeräts öffnet seine Geräteseite in Home Assistant (in den Messgeräten und auf den Raumkarten).

## 0.9.10

- Übersicht: Joe ist auf breiten Karten größer zu sehen (bis 240 statt 160 Pixel); auf schmalen Karten und am Handy bleibt er so, dass die Überschrift Platz hat.

## 0.9.9

- Geräte: Autos aus dem Energie-Dashboard, für die es noch keine Nacht-Aktion gibt, erscheinen jetzt als eigene Karte mit „Laden einrichten“. Das öffnet das Auto vorausgefüllt (Name, Wallbox, Sensoren des Autos) mit „Laden nach Bedarf“ schon an; nach dem Speichern steht dort die Autokarte mit Schalter und Kalender.

## 0.9.8

- „Laden nach Bedarf“ als Schalter direkt auf der Autokarte unter Geräte. Kennt Joe die Sensoren des Autos schon, schaltet er sofort um; beim ersten Mal öffnet er die Einstellungen des Autos an genau dieser Stelle und trägt ein, was er gefunden hat.

## 0.9.7

- Autokarte unter Geräte: zeigt, welcher Kalender verbunden ist (auch die Kalender der Personen, die für das Auto zählen) und wann Joe ihn zuletzt gelesen hat. „Kalender verbinden“ bzw. „Ändern“ öffnet die Einstellungen des Autos direkt beim Kalender.
- Klima → Messgeräte: nur noch für Geräte, die selbst Strom brauchen (Klimaanlagen) – Heizkörperthermostate fallen weg. Statt der langen Auswahlliste gibt es ein kleines Suchfeld (Name, Raum oder Shelly). Der ganze Abschnitt ist eingeklappt und zeigt oben, wie viele gekoppelt sind.
- Einstellungen → Sichern: alle Einstellungen samt Gelerntem als Datei exportieren und wieder importieren. Die Datei wird vor dem Import geprüft; Passwörter und Anmeldungen von Postfächern sind nicht enthalten.

## 0.9.6

- Gastmodus: Im Haushalt legt Joe auf Wunsch einen Schalter „Gastmodus“ (normal aus), einen Geräte-Tracker „Gast“ und eine Automation an, die den Tracker dem Schalter folgen lässt (an = home, aus = not_home). Der Tracker gehört in deine Anwesenheitsgruppe – wie eine Person –, so bleibt die Gruppe bei „home“/„not_home“ und deine Automationen laufen weiter. Alles sind normale Teile von Home Assistant und funktionieren auch ohne Joe.
- Steht deine Gruppe in der YAML-Konfiguration, zeigt Joe die Zeile, die du ergänzen musst, und meldet, sobald der Tracker drin ist. Den Gastmodus schaltest du direkt dort oder überall in Home Assistant.

## 0.9.5

- Heimweg mit echter Fahrzeit: Kommt jemand näher, fragt Joe den Routendienst aus den Einstellungen (OpenStreetMap, Waze oder Google), wie lange die Fahrt noch dauert – statt pauschal 40 km/h. Die Position geht dafür auf etwa 100 m gerundet an den Dienst; abschaltbar unter Klima → „Wer ist da?“.
- Joe lernt, wann ihr heimkommt: je Person an Arbeits- und an freien Tagen. Kennt er die übliche Zeit (nach 4 Heimkehren, schwankt höchstens 45 Minuten), sind die Räume dann schon warm – bevor jemand losfährt. Wer zu einer ganz anderen Zeit nur in der Nähe vorbeifährt, zählt erst, wenn er stetig näher kommt.

## 0.9.4

- Anwesenheit: Hast du schon eine Gruppe aus Personen (z. B. „Anwesenheit irgendjemand“), schlägt Joe genau diese vor („Diese nehmen“). Einen neuen Helfer bietet er nur an, wenn keine da ist – oder auf ausdrücklichen Wunsch.

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
