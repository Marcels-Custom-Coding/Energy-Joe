# Energy Joe

![Energy Joe](docs/images/energy-joe.jpg)

> **Work in progress.** Energy Joe ist noch in Entwicklung und nicht veröffentlicht.

Energy Joe ist eine lernende Home-Assistant-Integration für Haushalte mit PV-Anlage und Speicher. Er verschiebt Verbräuche – Hausspeicher, E-Auto, Warmwasser – in günstige Tarifzeiten, wenn die Sonne am nächsten Tag nicht reicht, und lernt jeden Tag aus Prognose, Verbrauch, Wetter und Alltag dazu.

Joe braucht kein Vorwissen: Nach dem Hinzufügen der Integration findest du ihn in der Seitenleiste. Dort schaut er sich in deinem Home Assistant um, zeigt dir, was er gefunden hat, und fragt in Alltagssprache nach dem, was er nicht selbst herausfinden kann. Bis du es anders entscheidest, steuert er nichts, sondern simuliert nur.

## Stand

Grundgerüst: Integration, Seitenleisten-Panel und Websocket-API. Das Panel zeigt vorerst eine Installationsprüfung.

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
