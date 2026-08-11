#!/usr/bin/env bash
# SkillzLink — Production Launch Script
# Run from project root on the server after setup_server.sh
# Usage: bash deploy/launch.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo "=== SkillzLink Production Deploy ==="
echo "Project root: $PROJECT_ROOT"
echo ""

# ── Pre-flight Checks ────────────────────────────────────────────────────────
if [ ! -f deploy/.env ]; then
    echo "ERROR: deploy/.env not found!"
    echo "Copy deploy/.env.example and fill in production values."
    exit 1
fi

# Source env vars
set -a
source deploy/.env
set +a

echo "[1/6] Building and starting containers..."
docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env up -d --build

echo "[2/6] Waiting for MySQL to be ready..."
RETRIES=30
until docker exec skillzlink-mysql mysqladmin ping -h localhost -p"${DB_ROOT_PASSWORD}" --silent 2>/dev/null; do
    RETRIES=$((RETRIES - 1))
    if [ $RETRIES -le 0 ]; then
        echo "ERROR: MySQL failed to start"
        exit 1
    fi
    echo "  Waiting for MySQL... (${RETRIES} retries left)"
    sleep 2
done
echo "  MySQL is ready."

echo "[3/6] Running Laravel setup (migrations, cache)..."
sleep 5
docker exec skillzlink-backend php artisan key:generate --force 2>/dev/null || true
docker exec skillzlink-backend php artisan migrate --force
docker exec skillzlink-backend php artisan storage:link 2>/dev/null || true
docker exec skillzlink-backend php artisan config:cache
docker exec skillzlink-backend php artisan route:cache

echo "[4/6] Seeding data..."
docker exec skillzlink-backend php artisan db:seed --force --class=ServiceCategorySeeder 2>/dev/null || echo "  (seeder not found, skipping)"

echo "[5/6] Deploying Caddy config..."
sudo cp deploy/Caddyfile /etc/caddy/Caddyfile
sudo systemctl reload caddy

echo "[6/6] Restarting LHC for fresh cache..."
docker compose -f deploy/docker-compose.prod.yml restart lhc

echo ""
echo "=== Deploy Complete ==="
echo "Services:"
docker compose -f deploy/docker-compose.prod.yml ps
echo ""
echo "Your app should be live at: ${APP_URL}"
echo "LHC admin panel: ${APP_URL}/lhc/index.php/site_admin"
