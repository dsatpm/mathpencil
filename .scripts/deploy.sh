#!/bin/bash
set -euo pipefail

WEBROOT="/var/www/mathpencil"

echo "Deployment started ..."

# Make sure NVM is available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Pull the latest version of the app
git fetch origin main
git reset --hard origin/main
echo "New changes copied to server !"

# Install dependencies exactly as locked
echo "Installing Dependencies..."
npm ci

# Creating a build
echo "Building application"
npm run build

# react-router emits the pre-rendered site to build/client
if [ ! -f build/client/index.html ]; then
  echo "Build did not produce build/client/index.html — aborting" >&2
  exit 1
fi

# Publish. --delete clears stale hashed assets from previous builds.
echo "Publishing build/client to ${WEBROOT}"
sudo mkdir -p "$WEBROOT"
sudo rsync -a --delete build/client/ "$WEBROOT/"
sudo chown -R www-data:www-data "$WEBROOT"

echo "Deployment Finished!"
