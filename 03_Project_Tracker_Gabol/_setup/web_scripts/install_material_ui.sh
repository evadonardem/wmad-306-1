#!/bin/sh
set -e

WORKDIR=/var/www/html

cd $WORKDIR

echo "Starting Material UI installation..."

npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

echo "Material UI installation completed."