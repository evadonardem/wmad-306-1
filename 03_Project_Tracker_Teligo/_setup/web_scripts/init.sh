#!/bin/sh
set -e

WORKDIR=/var/www/html

npm config set cache $HOME/.npm
npm config set prefix $HOME/.npm-global

# Initialize Laravel project if not already present
echo "Checking for existing Laravel project..."
if [ ! -f $WORKDIR/artisan ]; then
    echo "No existing Laravel project found. Creating new project..."
    sh /scripts/install_laravel.sh
    sh /scripts/install_laravel_breeze.sh
else
    cd $WORKDIR
    echo "Laravel project already exists. Skipping creation."
    composer install --prefer-dist --no-interaction --optimize-autoloader
    php artisan --version
fi

echo "Initialization complete."