#!/usr/bin/env bash
# ===================================================================
# Hotel Attendance System - Quick Deploy & Update Script for AWS EC2
# ===================================================================

set -e

echo "🚀 [1/4] Pulling latest updates from Git..."
git pull

echo "📦 [2/4] Building and starting Docker containers..."
docker compose down
docker compose up -d --build

echo "🧹 [3/4] Cleaning unused Docker images..."
docker image prune -f

echo "✅ [4/4] Deployment successful!"
echo "--------------------------------------------------------"
docker compose ps
echo "--------------------------------------------------------"
echo "🌐 Your application is accessible at: http://$(curl -s ifconfig.me)"
