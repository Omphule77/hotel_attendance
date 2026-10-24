#!/usr/bin/env bash
# ===================================================================
# Hotel Attendance System - Ubuntu EC2 Provisioning Script
# Works on Ubuntu 22.04 LTS / 24.04 LTS
# ===================================================================

set -e

echo "🔄 Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

echo "📦 Installing prerequisites..."
sudo apt-get install -y ca-certificates curl gnupg lsb-release git

echo "🐳 Installing Docker & Docker Compose..."
# Add Docker's official GPG key:
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add Docker repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "👤 Configuring user permissions for Docker..."
sudo usermod -aG docker $USER
sudo systemctl enable docker
sudo systemctl start docker

echo "✅ Docker installation completed!"
docker --version
docker compose version

echo "==================================================================="
echo "Setup finished! Please log out and reconnect via SSH, or run:"
echo "   newgrp docker"
echo "to apply docker permissions without logging out."
echo "==================================================================="
