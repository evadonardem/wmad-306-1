#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")"

HOST_UID="$(id -u)"
HOST_GID="$(id -g)"

compose_exec_root() {
  docker compose -f compose.yaml exec -T -u root web "$@"
}

compose_run_root() {
  docker compose -f compose.yaml run --rm -u root web "$@"
}

if compose_exec_root true >/dev/null 2>&1; then
  compose_exec_root chown -R "${HOST_UID}:${HOST_GID}" /var/www/html
  compose_exec_root chmod -R ug+rwX /var/www/html/storage /var/www/html/bootstrap/cache
else
  compose_run_root chown -R "${HOST_UID}:${HOST_GID}" /var/www/html
  compose_run_root chmod -R ug+rwX /var/www/html/storage /var/www/html/bootstrap/cache
fi

echo "Permissions fixed for UID=${HOST_UID} GID=${HOST_GID}"