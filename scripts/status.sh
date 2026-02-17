#!/bin/bash
# Show status of SE-RiskTrac containers and quick health check.
# Usage: ./scripts/status.sh   or   bash scripts/status.sh
# When deployed on a server, set APP_HOST in scripts/config (e.g. 10.0.1.32).

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
[ -f "$SCRIPT_DIR/config" ] && . "$SCRIPT_DIR/config"
HOST="${APP_HOST:-localhost}"
cd "$PROJECT_DIR"

echo "==> Container status"
docker-compose ps

echo ""
echo "==> Health check (Nginx)"
if curl -sf -o /dev/null --connect-timeout 3 "http://127.0.0.1:8080/health" 2>/dev/null; then
  echo "    http://${HOST}:8080/health -> OK"
else
  echo "    http://${HOST}:8080/health -> FAIL (is nginx running?)"
fi

echo ""
echo "URLs (use this host from your browser when deployed on server):"
echo "  Login:  http://${HOST}:8080/"
echo "  ORM:    http://${HOST}:8080/orm/"
echo "  UM:     http://${HOST}:8080/user-management/"
