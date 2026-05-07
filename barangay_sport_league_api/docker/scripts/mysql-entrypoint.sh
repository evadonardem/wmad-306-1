#!/bin/bash
set -e

mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS \`$MYSQL_DATABASE\`;"

exec /usr/local/bin/docker-entrypoint.sh "$@"