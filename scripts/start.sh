#!/bin/bash
# Start SE-RiskTrac stack (all services including Nginx).
# Usage: ./scripts/start.sh   or   bash scripts/start.sh
# When deployed on a server, set APP_HOST in scripts/config (e.g. 10.0.1.32).

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
[ -f "$SCRIPT_DIR/config" ] && . "$SCRIPT_DIR/config"
HOST="${APP_HOST:-localhost}"
cd "$PROJECT_DIR"

echo "==> Using project dir: $PROJECT_DIR"

# Create external network if it does not exist
if ! docker network inspect risktrac >/dev/null 2>&1; then
  echo "==> Creating Docker network: risktrac"
  docker network create risktrac
else
  echo "==> Network risktrac already exists"
fi

echo "==> Starting all services..."
docker-compose up -d

echo ""
echo "==> Started. Waiting a few seconds for containers to be ready..."
sleep 5
docker-compose ps

echo ""
echo "Login page:  http://${HOST}:8080/"
echo "Health:      http://${HOST}:8080/health"
echo "APIs:        authapi :6001  umapi :6002  ormapi :6003  bcmapi :6004"
