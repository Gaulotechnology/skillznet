#!/usr/bin/env sh
set -e

cd /var/www

if [ ! -f .env ]; then
  cp .env.example .env
fi

php artisan key:generate --force
php artisan migrate --force
if [ ! -L public/storage ]; then
  php artisan storage:link
fi

exec "$@"
