#!/usr/bin/env sh
set -e

if [ ! -f ".env" ] && [ -f ".env.example" ]; then
  cp .env.example .env
fi

if [ -f "composer.json" ]; then
  if [ ! -d "vendor" ]; then
    composer install --no-interaction --prefer-dist
  fi

  if grep -q '"inertiajs/inertia-laravel"' composer.json && [ ! -d "vendor/inertiajs/inertia-laravel" ]; then
    composer require inertiajs/inertia-laravel:^1.3 --no-interaction --with-all-dependencies
  fi
fi

if [ -f "package.json" ]; then
  if [ ! -d "node_modules" ]; then
    npm install
  fi
fi

if [ -f "artisan" ]; then
  php artisan key:generate --force || true
  php artisan migrate --force || true
fi

php-fpm
