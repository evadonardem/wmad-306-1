#!/bin/sh
set -e

WORKDIR=/var/www/html

cd $WORKDIR

echo "Starting Jodit React installation..."

npm install jodit-react

echo "Jodit React installation completed."