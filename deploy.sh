#!/bin/bash

# 設定
SERVER="username@your-server.com"
REMOTE_PATH="/var/www/html"

echo "Building static site..."
npm run build

echo "Deploying to server..."
rsync -avz --delete \
  --exclude '.git' \
  --exclude 'node_modules' \
  out/ ${SERVER}:${REMOTE_PATH}/

echo "Deployment complete!"
echo "Visit: http://your-domain.com"

