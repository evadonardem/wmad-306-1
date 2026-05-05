#!/bin/sh
set -e

WORKDIR=/var/www/html

echo "Starting Laravel installation..."
composer create-project laravel/laravel $WORKDIR --prefer-dist

chown -R www-data:www-data /var/www/html
chmod -R 775 /var/www/html

php $WORKDIR/artisan --version
echo "Laravel installation completed."