#!/bin/bash
# Tail logs for one or all SE-RiskTrac services.
# Usage: ./scripts/logs.sh [service]
#   No arg = all services (docker-compose logs -f)
#   With arg = that service (e.g. ./scripts/logs.sh nginx)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

if [ $# -eq 0 ]; then
  docker-compose logs -f
else
  docker-compose logs -f "$@"
fi
