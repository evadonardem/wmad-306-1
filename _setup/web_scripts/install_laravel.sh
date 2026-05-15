#!/bin/sh
set -e

WORKDIR=/var/www/html

echo "Starting Laravel installation..."
composer create-project laravel/laravel $WORKDIR/tmp --prefer-dist

echo "Moving files to working directory..."
mv -f $WORKDIR/tmp/* $WORKDIR/
echo "Moving hidden files to working directory..."
mv -f $WORKDIR/tmp/.* $WORKDIR/ 2>/dev/null || true

# check if tmp directory is empty before removing
if [ -d "$WORKDIR/tmp" ] && [ "$(ls -A $WORKDIR/tmp)" = "" ]; then
    echo "$WORKDIR/tmp is empty, removing directory."
    rmdir $WORKDIR/tmp
else
    echo "Warning: $WORKDIR/tmp is not empty, removing with force."
    rmdir -f $WORKDIR/tmp
fi

chmod -R 777 $WORKDIR/storage $WORKDIR/bootstrap/cache
chmod -R 777 $WORKDIR/database/database.sqlite

php $WORKDIR/artisan --version
echo "Laravel installation completed."