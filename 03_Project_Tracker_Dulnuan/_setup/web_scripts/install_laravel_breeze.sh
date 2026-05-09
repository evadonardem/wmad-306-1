#!/bin/sh
set -e

WORKDIR=/var/www/html

cd $WORKDIR

echo "Starting Laravel Breeze installation..."

composer require laravel/breeze

php artisan breeze:install react

echo "Laravel Breeze installation completed."