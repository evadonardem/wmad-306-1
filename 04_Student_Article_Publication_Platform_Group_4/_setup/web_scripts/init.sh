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
    sh /scripts/install_material_ui.sh
    sh /scripts/install_spatie_laravel_permission.sh
    sh /scripts/install_jodit_react.sh
else
    cd $WORKDIR
    echo "Laravel project already exists. Skipping creation."
    composer install --prefer-dist --no-interaction --optimize-autoloader
    php artisan --version
    npm install --yes
fi

ENV_FILE="$WORKDIR/.env"

# Ensure .env exists
if [ ! -f "$ENV_FILE" ]; then
  cp "$WORKDIR/.env.example" "$ENV_FILE"
fi

# Replace or uncomment APP name
sed -i -E 's/^(#\s*)?APP_NAME=.*/APP_NAME="SAPP"/' "$ENV_FILE"

# Replace or uncomment DB settings
sed -i -E 's/^(#\s*)?DB_CONNECTION=.*/DB_CONNECTION=mysql/' "$ENV_FILE"
sed -i -E 's/^(#\s*)?DB_HOST=.*/DB_HOST=db/' "$ENV_FILE"
sed -i -E 's/^(#\s*)?DB_PORT=.*/DB_PORT=3306/' "$ENV_FILE"
sed -i -E 's/^(#\s*)?DB_DATABASE=.*/DB_DATABASE=app_db/' "$ENV_FILE"
sed -i -E 's/^(#\s*)?DB_USERNAME=.*/DB_USERNAME=root/' "$ENV_FILE"
sed -i -E 's/^(#\s*)?DB_PASSWORD=.*/DB_PASSWORD=123456/' "$ENV_FILE"

# Replace or uncomment MAIL settings
sed -i -E 's/^(#\s*)?MAIL_MAILER=.*/MAIL_MAILER=smtp/' "$ENV_FILE"
sed -i -E 's/^(#\s*)?MAIL_SCHEME=.*/MAIL_SCHEME=smtp/' "$ENV_FILE"
sed -i -E 's/^(#\s*)?MAIL_HOST=.*/MAIL_HOST=mailtrap/' "$ENV_FILE"
sed -i -E 's/^(#\s*)?MAIL_PORT=.*/MAIL_PORT=1025/' "$ENV_FILE"
sed -i -E 's/^(#\s*)?MAIL_FROM_ADDRESS=.*/MAIL_FROM_ADDRESS="no-repy@wmad-306.edu.ph"/' "$ENV_FILE"

php artisan key:generate
php artisan migrate
npm run build

echo "Initialization complete."