#!/bin/sh
set -e

WORKDIR=/var/www/html

cd $WORKDIR

echo "Starting Spatie Laravel Permission installation..."

composer require spatie/laravel-permission

php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"

echo "Spatie Laravel Permission installation completed."