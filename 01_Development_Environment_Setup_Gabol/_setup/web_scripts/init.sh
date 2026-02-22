#!/bin/bash

# Set ownership of the app directory
chown -R ${UID}:${GID} /var/www/html

# Install PHP dependencies
composer install --no-interaction --optimize-autoloader

# Install Node dependencies
npm install

# Build assets
npm run build

# Run database migrations
php artisan migrate --force

# Seed the database if needed
# php artisan db:seed

# Start the application (but since command is && apache2-foreground, this is just setup)