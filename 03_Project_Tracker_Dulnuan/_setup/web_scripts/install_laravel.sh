#!/bin/sh
set -e

WORKDIR=/var/www/html

echo "Starting Laravel installation..."

composer create-project laravel/laravel $WORKDIR --prefer-dist

php $WORKDIR/artisan --version

echo "Laravel installation completed."