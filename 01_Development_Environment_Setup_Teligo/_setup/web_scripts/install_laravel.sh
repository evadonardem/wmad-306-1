#!/bin/sh
set -e

WORKDIR=/var/www/html
TMPDIR=/tmp/new_laravel

echo "Starting Laravel installation..."
rm -rf "$TMPDIR"
composer create-project laravel/laravel "$TMPDIR" --prefer-dist --no-interaction

mkdir -p "$WORKDIR"
# Copy project files into WORKDIR (overwrite existing files where necessary)
cp -a "$TMPDIR"/. "$WORKDIR"/
rm -rf "$TMPDIR"

chown -R www-data:www-data /var/www/html
chmod -R 775 /var/www/html

php "$WORKDIR"/artisan --version
echo "Laravel installation completed."