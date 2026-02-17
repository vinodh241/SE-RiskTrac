#!/bin/bash
# Stop SE-RiskTrac stack (all services).
# Usage: ./scripts/stop.sh   or   bash scripts/stop.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

echo "==> Stopping all services..."
docker-compose down

echo "==> Stopped."
