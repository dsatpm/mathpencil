#!/bin/bash
set -e

echo "Deployment started ..."


# Make sure NVM is available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Pull the latest version of the app
git pull origin main # Your branch name
echo "New changes copied to server !"

# Installing Dependencies
echo "Installing Dependencies..."
npm install --yes

# Creating a build 
echo "Building application"
npm run build

# Copying dist to /var/www/[project name]
echo "Copying dist to /var/www/mathpencil"
sudo cp -r dist/* /var/www/mathpencil



echo "Deployment Finished!"