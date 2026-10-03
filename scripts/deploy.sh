#!/usr/bin/env bash
# Baut das Panel, kopiert custom_components/energy_joe per SSH nach Home Assistant
# und startet Home Assistant neu. Zugangsdaten stehen in .deploy.env.
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ ! -f .deploy.env ]]; then
  echo ".deploy.env fehlt. Vorlage kopieren und ausfüllen: cp .deploy.env.example .deploy.env" >&2
  exit 1
fi
# shellcheck source=/dev/null
source .deploy.env
: "${HA_HOST:?HA_HOST in .deploy.env eintragen}"
: "${HA_SSH_PORT:?HA_SSH_PORT in .deploy.env eintragen}"
: "${HA_SSH_USER:?HA_SSH_USER in .deploy.env eintragen}"

ssh_ha() { ssh -p "$HA_SSH_PORT" "$HA_SSH_USER@$HA_HOST" "$@"; }

echo "Panel bauen …"
npm --prefix panel run --silent build

echo "Kopieren nach $HA_HOST …"
COPYFILE_DISABLE=1 tar -C custom_components \
  --exclude='__pycache__' --exclude='.DS_Store' \
  -czf - energy_joe |
  ssh_ha 'set -e
    mkdir -p /config/custom_components
    rm -rf /config/custom_components/energy_joe
    tar -C /config/custom_components -xzf -'

if [[ "${HA_RESTART:-1}" == "1" ]]; then
  echo "Home Assistant neu starten …"
  ssh_ha 'ha core restart'
fi
echo "Fertig."
