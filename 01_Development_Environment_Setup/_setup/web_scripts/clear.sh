#!/bin/sh
set -e

WORKDIR=/var/www/html

# Clear all files and directories in WORKDIR except specified ones
find $WORKDIR \
  -mindepth 1 \
  -maxdepth 1 \
  ! -name '.git' \
  ! -name '_setup' \
  ! -name 'Dockerfile' \
  ! -name 'compose.yaml' \
  -exec rm -rf {} +