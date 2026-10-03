# Entwicklung

## Umgebung

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements_test.txt
cd panel && npm install
```

- Tests: `.venv/bin/pytest`
- Linter: `.venv/bin/ruff check .`
- Panel bauen: `npm --prefix panel run build` (der Build liegt eingecheckt in `custom_components/energy_joe/frontend/`)
- Panel ohne Home Assistant ansehen: im Repo-Wurzelverzeichnis `python3 -m http.server 8767` starten und `http://localhost:8767/panel/dev/` öffnen. Parameter: `?dark=1`, `?lang=en`, `?step=scan`, `?done=1`, `?page=settings`, `?mode=off`

## Grafiken

Die Originale liegen lokal in `branding/` und werden nicht eingecheckt. Daraus erzeugen:

- `scripts/make_brand.py` – Icon und Logo für Home Assistant, Logo fürs Panel, README-Bild
- `scripts/make_poses.py` – Joes Posen, freigestellt, als WebP unter `panel/public/poses/`
- `scripts/make_icon.py` – Seitenleisten-Icon aus `branding/logo.svg`

Danach `npm --prefix panel run build`.

## Auf Home Assistant testen

Solange das Repository privat ist, kann HACS es nicht laden. Getestet wird per SSH mit dem Add-on **Advanced SSH & Web Terminal**.

Einmalig:

1. SSH-Schlüssel auf dem Rechner erzeugen, falls noch keiner existiert: `ssh-keygen -t ed25519`
2. Im Add-on unter *Konfiguration* den Inhalt von `~/.ssh/id_ed25519.pub` bei `authorized_keys` eintragen und unter *Netzwerk* einen Port freigeben. Add-on neu starten.
3. `cp .deploy.env.example .deploy.env` und Host, Port und Benutzer eintragen.
4. Verbindung prüfen: `ssh -p <Port> <Benutzer>@<Host> 'ha core info'`

Danach bei jeder Änderung:

```bash
scripts/deploy.sh
```

Das Skript baut das Panel, kopiert den Integrationsordner nach `/config/custom_components/energy_joe` und startet Home Assistant neu. Beim ersten Mal anschließend unter *Einstellungen → Geräte & Dienste → Integration hinzufügen* Energy Joe hinzufügen.
