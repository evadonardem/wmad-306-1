#!/bin/sh
set -e

WORKDIR=/var/www/html
umask 0002

fix_permissions() {
    echo "Fixing permissions..."
    mkdir -p "$WORKDIR/storage/logs" "$WORKDIR/bootstrap/cache" 2>/dev/null || true
    chmod -R ug+rwX "$WORKDIR/storage" "$WORKDIR/bootstrap/cache" 2>/dev/null || true
}

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

fix_permissions

echo "Initialization complete."