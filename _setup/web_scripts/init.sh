#!/bin/sh
set -e

WORKDIR=/var/www/html

# Initialize Laravel project if not already present
echo "Checking for existing Laravel project..."
if [ ! -f $WORKDIR/artisan ]; then
    echo "No existing Laravel project found. Creating new project..."
    sh /scripts/install_laravel.sh
else
    cd $WORKDIR
    echo "Laravel project already exists. Skipping creation."
    composer install --prefer-dist --no-interaction --optimize-autoloader
    php artisan --version
fi

chmod -R 777 $WORKDIR/storage $WORKDIR/bootstrap/cache
chmod -R 777 $WORKDIR/database/database.sqlite

echo "Initialization complete."