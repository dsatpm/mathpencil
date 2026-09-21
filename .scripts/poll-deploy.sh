#!/bin/bash
# Pull-based deploy check. Run on a timer: compares the local checkout against
# origin/main and rebuilds only when they differ, or when the published site is
# missing. Nothing needs to reach into this server from outside.
set -euo pipefail

REPO_DIR="${REPO_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
WEBROOT="${WEBROOT:-/var/www/mathpencil}"

cd "$REPO_DIR"

export GIT_TERMINAL_PROMPT=0

git fetch --quiet origin main

LOCAL="$(git rev-parse HEAD)"
REMOTE="$(git rev-parse origin/main)"

if [ "$LOCAL" = "$REMOTE" ] && [ -f "$WEBROOT/index.html" ]; then
  echo "Already at ${REMOTE:0:7}, site published. Nothing to do."
  exit 0
fi

if [ "$LOCAL" = "$REMOTE" ]; then
  echo "At ${REMOTE:0:7} but ${WEBROOT}/index.html is missing — republishing."
else
  echo "New commit: ${LOCAL:0:7} -> ${REMOTE:0:7}"
fi

exec "${REPO_DIR}/.scripts/deploy.sh"
