#!/bin/sh
set -e

WORKDIR=/var/www/html
umask 0002

echo "Starting Laravel installation..."
composer create-project laravel/laravel $WORKDIR --prefer-dist

mkdir -p /var/www/html/storage/logs /var/www/html/bootstrap/cache 2>/dev/null || true
chmod -R ug+rwX /var/www/html/storage /var/www/html/bootstrap/cache 2>/dev/null || true

php $WORKDIR/artisan --version
echo "Laravel installation completed."