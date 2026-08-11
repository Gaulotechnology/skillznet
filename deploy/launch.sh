#!/usr/bin/env bash
# SkillzLink — Production Deploy Script
# Run from /opt/skillzlink after cloning the repo
# Usage: bash deploy/launch.sh
#
# Options:
#   bash deploy/launch.sh          → full deploy (git pull + rebuild all)
#   bash deploy/launch.sh quick    → skip git pull, rebuild all
#   bash deploy/launch.sh backend  → rebuild only backend+LHC
#   bash deploy/launch.sh frontend → rebuild only frontend

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

MODE="${1:-full}"

echo "=== SkillzLink Production Deploy ==="
echo "Project root: $PROJECT_ROOT"
echo "Mode: $MODE"
echo ""

# ── Git Pull ──────────────────────────────────────────────────────────────────
if [ "$MODE" != "quick" ]; then
    echo "[git] Pulling latest changes..."
    git pull origin master
    echo ""
fi

# ── Pre-flight Checks ────────────────────────────────────────────────────────
if [ ! -f deploy/.env ]; then
    echo "ERROR: deploy/.env not found!"
    echo "Copy deploy/.env.example and fill in production values."
    exit 1
fi

# LHC settings file
if [ ! -f skillzlink-backend/public/lhc/settings/settings.ini.php ]; then
    echo "WARNING: LHC settings.ini.php not found, copying from template..."
    cp skillzlink-backend/public/lhc/settings/settings.ini.dist.php skillzlink-backend/public/lhc/settings/settings.ini.php
    echo "  Edit skillzlink-backend/public/lhc/settings/settings.ini.php with real DB credentials!"
    echo "  Then re-run this script."
    exit 1
fi

# Source env vars
set -a
source deploy/.env
set +a

# ── Build & Start ────────────────────────────────────────────────────────────
echo "[build] Building and starting containers..."

COMPOSE_ARGS="-f deploy/docker-compose.prod.yml --env-file deploy/.env"

case "$MODE" in
    backend)
        docker compose $COMPOSE_ARGS up -d --build mysql redis backend lhc
        ;;
    frontend)
        docker compose $COMPOSE_ARGS up -d --build frontend
        ;;
    full|quick)
        docker compose $COMPOSE_ARGS up -d --build
        ;;
    *)
        echo "Unknown mode: $MODE"
        echo "Valid modes: full, quick, backend, frontend"
        exit 1
        ;;
esac

# ── Wait for MySQL ──────────────────────────────────────────────────────────
echo "[mysql] Waiting for MySQL to be ready..."
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

# ── Laravel Setup ───────────────────────────────────────────────────────────
echo "[laravel] Running setup (migrations, cache)..."
sleep 3
docker exec skillzlink-backend php artisan key:generate --force 2>/dev/null || true
docker exec skillzlink-backend php artisan migrate --force
docker exec skillzlink-backend php artisan storage:link 2>/dev/null || true
docker exec skillzlink-backend php artisan config:cache
docker exec skillzlink-backend php artisan route:cache

# ── Seed Data ────────────────────────────────────────────────────────────────
echo "[seed] Seeding data..."
docker exec skillzlink-backend php artisan db:seed --force --class=ServiceCategorySeeder 2>/dev/null || echo "  (seeder not found, skipping)"

# ── Caddy ────────────────────────────────────────────────────────────────────
echo "[caddy] Deploying Caddy config..."
sudo cp deploy/Caddyfile /etc/caddy/Caddyfile
sudo systemctl reload caddy

# ── Restart LHC ──────────────────────────────────────────────────────────────
echo "[lhc] Restarting LHC for fresh cache..."
docker compose $COMPOSE_ARGS restart lhc

# ── Done ─────────────────────────────────────────────────────────────────────
echo ""
echo "=== Deploy Complete ==="
echo "Services:"
docker compose $COMPOSE_ARGS ps
echo ""
echo "Your app should be live at: ${APP_URL}"
echo "LHC admin panel: ${APP_URL}/lhc/index.php/site_admin"
