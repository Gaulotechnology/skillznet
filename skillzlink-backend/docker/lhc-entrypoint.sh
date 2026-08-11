#!/bin/sh
# LHC entrypoint — generates settings.ini.php from environment variables
# All config via env vars, no manual editing needed.

set -e

SETTINGS_FILE="/var/www/public/lhc/settings/settings.ini.php"
DIST_FILE="/var/www/public/lhc/settings/settings.ini.dist.php"

# Use defaults from docker-compose environment or fall back to dist file values
DB_HOST="${LHC_DB_HOST:-mysql}"
DB_PORT="${LHC_DB_PORT:-3306}"
DB_NAME="${LHC_DB_DATABASE:-skillzlink}"
DB_USER="${LHC_DB_USERNAME:-skillzlink}"
DB_PASS="${LHC_DB_PASSWORD:-skillzlink}"
DB_PREFIX="${LHC_DB_PREFIX:-lh_}"

SITE_TITLE="${LHC_SITE_TITLE:-SkillzLink Live Chat}"
SITE_ADDRESS="${LHC_SITE_ADDRESS:-}"
DEBUG_OUTPUT="${LHC_DEBUG:-false}"
DEBUG_VIEW="${LHC_DEBUG:-false}"

echo "[lhc-entrypoint] Generating settings.ini.php from env vars..."
echo "  DB: ${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

# Generate from dist, replacing the db section
cp "$DIST_FILE" "$SETTINGS_FILE"

# Replace DB credentials
sed -i "s/'host' => '.*'/'host' => '${DB_HOST}'/" "$SETTINGS_FILE"
sed -i "s/'port' => [0-9]*/'port' => ${DB_PORT}/" "$SETTINGS_FILE"
sed -i "s/'database_name' => '.*'/'database_name' => '${DB_NAME}'/" "$SETTINGS_FILE"
sed -i "s/'database_user' => '.*'/'database_user' => '${DB_USER}'/" "$SETTINGS_FILE"
sed -i "s/'database_password' => '.*'/'database_password' => '${DB_PASS}'/" "$SETTINGS_FILE"
sed -i "s/'prefix' => '.*'/'prefix' => '${DB_PREFIX}'/" "$SETTINGS_FILE"
sed -i "s/'user' => '.*'/'user' => '${DB_USER}'/" "$SETTINGS_FILE"
sed -i "s/'password' => '.*'/'password' => '${DB_PASS}'/" "$SETTINGS_FILE"
sed -i "s/'database' => '.*'/'database' => '${DB_NAME}'/" "$SETTINGS_FILE"

# Replace site settings
sed -i "s/'title' => '.*'/'title' => '${SITE_TITLE}'/" "$SETTINGS_FILE"
sed -i "s/'site_address' => '.*'/'site_address' => '${SITE_ADDRESS}'/" "$SETTINGS_FILE"
sed -i "s/'debug_output' => .*/'debug_output' => ${DEBUG_OUTPUT},/" "$SETTINGS_FILE"
sed -i "s/'debug_view' => .*/'debug_view' => ${DEBUG_VIEW},/" "$SETTINGS_FILE"

echo "[lhc-entrypoint] Settings generated."

# Start PHP built-in server
exec php -d display_errors=0 -d error_reporting=0 -S 0.0.0.0:8080 /var/www/docker/lhc-router.php
