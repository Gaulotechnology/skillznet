#!/usr/bin/env sh
set -e

cd /var/www

if [ ! -f .env ]; then
  cp .env.example .env
fi

# Always inject env vars from Docker environment into .env
# (sed will add the line if it doesn't exist yet)
inject_env() {
  local key="$1" val="$2"
  if [ -n "$val" ]; then
    if grep -q "^${key}=" .env 2>/dev/null; then
      sed -i "s|^${key}=.*|${key}=${val}|" .env
    else
      echo "${key}=${val}" >> .env
    fi
  fi
}

inject_env "APP_URL" "$APP_URL"
inject_env "LHC_BASE_URL" "$LHC_BASE_URL"
inject_env "LHC_PUBLIC_URL" "$LHC_PUBLIC_URL"
inject_env "LHC_API_KEY" "$LHC_API_KEY"
inject_env "DEEPSEEK_API_KEY" "$DEEPSEEK_API_KEY"

php artisan key:generate --force
php artisan migrate --force
if [ ! -L public/storage ]; then
  php artisan storage:link
fi

exec "$@"
