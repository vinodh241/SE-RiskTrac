#!/bin/bash
# Build Docker images for SE-RiskTrac (when building from source).
# Usage: ./scripts/build.sh [service...]
#   No args = build all services that have a Dockerfile
#   With args = build only those (e.g. ./scripts/build.sh nginx hostweb)

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

if [ $# -eq 0 ]; then
  echo "==> Building all images..."
  docker-compose build --no-cache
else
  echo "==> Building: $*"
  docker-compose build --no-cache "$@"
fi

echo "==> Build finished."
