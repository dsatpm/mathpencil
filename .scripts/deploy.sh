#!/bin/bash
# Build the site from the current checkout and publish it to the webroot.
# Invoked by poll-deploy.sh, or by hand on the server for a forced redeploy.
set -euo pipefail

REPO_DIR="${REPO_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
WEBROOT="${WEBROOT:-/var/www/mathpencil}"

cd "$REPO_DIR"

# Run under systemd there is no terminal, so a credential prompt would hang
# until the unit times out. Fail fast instead. The repo is public, so an
# unauthenticated fetch is expected to succeed.
export GIT_TERMINAL_PROMPT=0

# Root needs no sudo; a human running this by hand does.
if [ "$(id -u)" -eq 0 ]; then
  SUDO=""
else
  SUDO="sudo"
fi

# nvm installs Node outside the default PATH, and systemd units get a minimal
# environment. Source it when present so npm resolves either way.
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck source=/dev/null
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "Deployment started ..."

# Discard any drift on the box. This checkout is disposable.
git fetch origin main
git reset --hard origin/main
echo "Checkout now at $(git rev-parse --short HEAD)"

echo "Installing dependencies..."
npm ci

echo "Building application"
npm run build

# react-router emits the pre-rendered site to build/client. Verify before
# touching the webroot, so a failed build can never blank the live site.
if [ ! -f build/client/index.html ]; then
  echo "Build did not produce build/client/index.html — aborting" >&2
  exit 1
fi

echo "Publishing build/client to ${WEBROOT}"
$SUDO mkdir -p "$WEBROOT"
$SUDO rsync -a --delete build/client/ "$WEBROOT/"
$SUDO chown -R www-data:www-data "$WEBROOT"

echo "Deployment finished at $(git rev-parse --short HEAD)"
