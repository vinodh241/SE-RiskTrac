#!/bin/bash
# Restart SE-RiskTrac stack (stop then start).
# Usage: ./scripts/restart.sh   or   bash scripts/restart.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
[ -f "$SCRIPT_DIR/config" ] && . "$SCRIPT_DIR/config"
HOST="${APP_HOST:-localhost}"
cd "$PROJECT_DIR"

echo "==> Stopping..."
docker-compose down

echo "==> Starting..."
docker network inspect risktrac >/dev/null 2>&1 || docker network create risktrac
docker-compose up -d

echo ""
echo "==> Restarted. Login: http://${HOST}:8080/"
sleep 3
docker-compose ps
