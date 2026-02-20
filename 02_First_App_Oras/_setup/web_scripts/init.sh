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
    composer install --prefer-dist --no-interaction
    php artisan --version
fi

chown -R www-data:www-data /var/www/html
chmod -R 775 /var/www/html

echo "Initialization complete."