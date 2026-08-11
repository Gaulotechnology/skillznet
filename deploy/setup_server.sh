#!/usr/bin/env bash
# SkillzLink — Server Provisioning Script
# Run once on a fresh Ubuntu 24.04 VPS as root
# Usage: ssh root@62.238.107.93 'bash -s' < deploy/setup_server.sh

set -euo pipefail

echo "=== SkillzLink Server Setup ==="
echo "Target: Ubuntu 24.04"
echo ""

# ── System Update ───────────────────────────────────────────────────────────
echo "[1/5] Updating system packages..."
apt-get update -qq && apt-get upgrade -y -qq

# ── Install Dependencies ────────────────────────────────────────────────────
echo "[2/5] Installing dependencies..."
apt-get install -y -qq curl git apt-transport-https ca-certificates gnupg lsb-release ufw

# ── Docker + Docker Compose ─────────────────────────────────────────────────
echo "[3/5] Installing Docker & Docker Compose..."

# Docker GPG key
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

# Docker apt repo
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
apt-get update -qq
apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Enable Docker
systemctl enable docker --now

# ── Caddy Web Server ────────────────────────────────────────────────────────
echo "[4/5] Installing Caddy..."

# Caddy GPG key
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg

# Caddy apt repo
echo "deb [signed-by=/usr/share/keyrings/caddy-stable-archive-keyring.gpg] https://dl.cloudsmith.io/public/caddy/stable/deb/debian any-version main" > /etc/apt/sources.list.d/caddy-stable.list
apt-get update -qq
apt-get install -y -qq caddy

# Enable Caddy
systemctl enable caddy --now

# ── Firewall ─────────────────────────────────────────────────────────────────
echo "[5/5] Configuring UFW firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw --force enable

echo ""
echo "=== Setup Complete ==="
echo "Docker: $(docker --version)"
echo "Caddy:  $(caddy version)"
echo "UFW:    $(ufw status | head -1)"
echo ""
echo "Next steps:"
echo "  1. Clone the repo: git clone <repo-url> /opt/skillzlink"
echo "  2. Create deploy/.env from deploy/.env.example"
echo "  3. Run: bash deploy/launch.sh"
