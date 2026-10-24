# 🚀 AWS EC2 Deployment Guide: Hotel Attendance & Salary System
### (हॉटेल कर्मचारी हजेरी व पगार प्रणाली - AWS EC2 वर डिप्लॉय करण्याची संपूर्ण मार्गदर्शिका)

This guide provides a comprehensive, step-by-step walkthrough to deploy the **Hotel Attendance and Salary Management System** (Spring Boot + React Vite + MongoDB Atlas) on an **AWS EC2** instance using **Docker** and **Docker Compose**.

---

## 🏗️ Architecture Overview

```mermaid
graph TD
    Client[User Browser / Mobile] -->|HTTP Port 80| Nginx[Frontend Container: Nginx]
    subgraph AWS EC2 Instance
        Nginx -->|Serves Static Files| ReactApp[React 19 + Vite App]
        Nginx -->|Reverse Proxy /api/*| SpringBoot[Backend Container: Spring Boot Java 21]
    end
    SpringBoot -->|Port 27017 TLS| MongoAtlas[(MongoDB Atlas Cloud Database)]
```

- **Frontend & Reverse Proxy**: Nginx container serves the optimized React SPA build on port 80 and seamlessly proxies all `/api/` calls internally to the backend container.
- **Backend**: Spring Boot container runs Java 21 on internal port 8080.
- **Database**: MongoDB Atlas cloud cluster (accessible over TLS).
- **Security**: Port 8080 does not even need to be exposed to the public internet; everything runs securely through Nginx on port 80.

---

## 📋 Prerequisites

1. An **AWS Account** ([aws.amazon.com](https://aws.amazon.com/)).
2. An active **MongoDB Atlas** database URI (with IP whitelist set to `0.0.0.0/0` or your EC2 Public IP).
3. Your project uploaded to **GitHub / GitLab** (or pushed via Git).

---

## 📌 STEP 1: Launch an AWS EC2 Instance

1. Log in to the [AWS Management Console](https://console.aws.amazon.com/ec2/).
2. Navigate to **EC2** > Click **Launch Instance**.
3. Configure the instance settings:
   - **Name**: `hotel-attendance-server`
   - **Application and OS Images (AMI)**: **Ubuntu Server 24.04 LTS** (or 22.04 LTS) - *Free tier eligible*.
   - **Instance Type**: 
     - Recommended: **`t3.small`** (2 vCPU, 2 GB RAM) or **`t2.small`**.
     - Free Tier: **`t2.micro`** (1 vCPU, 1 GB RAM). *(Note: If using `t2.micro`, make sure to add swap space as shown in Step 4 to prevent out-of-memory during Maven builds).*
   - **Key Pair (login)**:
     - Click **Create new key pair**.
     - Name: `hotel-key`.
     - Key pair type: `RSA`, format: `.pem` (for OpenSSH/macOS/Linux/Windows PowerShell).
     - Download and save `hotel-key.pem` safely.
   - **Network Settings (Security Group)**:
     Select **Create security group** and check:
     - ✅ **Allow SSH traffic from**: Anywhere (`0.0.0.0/0`) or My IP.
     - ✅ **Allow HTTP traffic from the internet** (Port 80).
     - ✅ **Allow HTTPS traffic from the internet** (Port 443).
   - **Configure Storage**:
     - Increase root volume from default 8 GiB to **15 GiB or 20 GiB gp3** (Docker images require at least 10–15 GB of disk space).
4. Click **Launch Instance**.

---

## 📌 STEP 2: Configure Inbound Security Group Rules

Make sure your Security Group has the following inbound rules:

| Type | Protocol | Port Range | Source | Purpose |
|------|----------|------------|--------|---------|
| **SSH** | TCP | 22 | `0.0.0.0/0` (or your IP) | Remote terminal access |
| **HTTP** | TCP | 80 | `0.0.0.0/0` | Web application (Nginx) |
| **HTTPS** | TCP | 443 | `0.0.0.0/0` | SSL/TLS (if using domain) |
| **Custom TCP** *(Optional)* | TCP | 8080 | `0.0.0.0/0` | Direct backend API access |

---

## 📌 STEP 3: Connect to Your EC2 Instance

Open **Terminal** (macOS/Linux) or **PowerShell** (Windows) in the directory where your `hotel-key.pem` file is located:

### On Linux / macOS:
```bash
chmod 400 hotel-key.pem
ssh -i hotel-key.pem ubuntu@<YOUR_EC2_PUBLIC_IP>
```

### On Windows PowerShell:
```powershell
ssh -i .\hotel-key.pem ubuntu@<YOUR_EC2_PUBLIC_IP>
```
*(Replace `<YOUR_EC2_PUBLIC_IP>` with the Public IPv4 Address shown in your AWS EC2 Console).*

---

## 📌 STEP 4: Setup Swap Memory (Crucial for t2.micro / 1GB RAM)

If you are using a **t2.micro** instance (1GB RAM), Java compilation can run out of memory without swap space. Run this once:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```
*(Verify by running `free -h` - you will see 2.0Gi of Swap).*

---

## 📌 STEP 5: Install Docker & Docker Compose on EC2

Run the following commands on your EC2 terminal:

```bash
# 1. Update system
sudo apt-get update -y && sudo apt-get upgrade -y

# 2. Install prerequisites
sudo apt-get install -y ca-certificates curl gnupg lsb-release git

# 3. Add Docker official GPG key and repository
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. Install Docker CE and Docker Compose plugin
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 5. Enable and grant permissions to ubuntu user
sudo usermod -aG docker $USER
sudo systemctl enable docker
sudo systemctl start docker

# 6. Apply group permissions without logging out
newgrp docker
```

Verify the installation:
```bash
docker --version
docker compose version
```

---

## 📌 STEP 6: Clone Project & Configure Environment

1. Clone your project repository into the EC2 instance:
```bash
git clone <YOUR_GIT_REPOSITORY_URL>
cd "Hotel Attendance"
```
*(Or use `scp -i hotel-key.pem -r . ubuntu@<YOUR_EC2_PUBLIC_IP>:~/hotel-attendance` if deploying directly from your local machine).*

2. Create and verify the `.env` file:
```bash
cp .env.example .env
nano .env
```
Ensure your MongoDB Atlas URI is correct:
```env
SPRING_DATA_MONGODB_URI=mongodb+srv://omphule77_db_user:Omphule77@cluster0.xwlfth2.mongodb.net/
SPRING_DATA_MONGODB_DATABASE=hotel_attendance
```
Save and exit (`Ctrl + O`, `Enter`, `Ctrl + X`).

---

## 📌 STEP 7: Build and Launch Containers

Make the helper scripts executable:
```bash
chmod +x deploy.sh ec2-setup.sh
```

Run Docker Compose to build and start both backend and frontend:
```bash
docker compose up -d --build
```

Monitor container startup:
```bash
# Check running containers
docker compose ps

# Check backend logs
docker compose logs -f backend

# Check frontend logs
docker compose logs -f frontend
```

When you see:
```text
हॉटेल कर्मचारी हजेरी व पगार प्रणाली सुरू झाली आहे!
Backend running on: http://localhost:8080
```
Your application is fully up and running!

---

## 📌 STEP 8: Open Application in Your Browser

Open your web browser and navigate to:
```text
http://<YOUR_EC2_PUBLIC_IP>
```

You will see the **हॉटेल कर्मचारी व वेटर हजेरी आणि पगार व्यवस्थापन प्रणाली** landing/login page!
- Try logging in with the default admin credentials or registered user.
- Add employees, record attendance, and generate salary slips.

---

## 📌 STEP 9: Updating Your Application in the Future

Whenever you make code changes and push them to Git:
1. SSH into your EC2 instance:
   ```bash
   ssh -i hotel-key.pem ubuntu@<YOUR_EC2_PUBLIC_IP>
   ```
2. Run the quick deploy script:
   ```bash
   cd "Hotel Attendance"
   ./deploy.sh
   ```
It will automatically:
- Pull the latest code (`git pull`)
- Rebuild containers (`docker compose up -d --build`)
- Clean up dangling images (`docker image prune -f`)

---

## 📌 STEP 10 (Optional): Add Custom Domain & Free SSL (HTTPS)

To run your app on `https://yourhotelapp.com`:

1. Point your domain's **A Record** in GoDaddy / Namecheap / Route 53 to your **EC2 Public IP**.
2. Install Certbot on EC2:
   ```bash
   sudo apt-get install -y certbot python3-certbot-nginx
   ```
3. Stop the frontend container temporarily to free port 80:
   ```bash
   docker compose stop frontend
   ```
4. Generate SSL certificate:
   ```bash
   sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
   ```
5. Mount the SSL certificates inside `docker-compose.yml` and expose port `443:443`.

---

## 🛠️ Useful Docker Commands for Maintenance

| Task | Command |
|------|---------|
| View container status | `docker compose ps` |
| View live logs | `docker compose logs -f` |
| Restart containers | `docker compose restart` |
| Stop all containers | `docker compose down` |
| Rebuild without cache | `docker compose build --no-cache` |
| Check server RAM & CPU | `docker stats` |
| Check disk space | `df -h` |

---

## ❓ Troubleshooting

1. **Cannot connect to `http://<EC2_IP>`**:
   - Check if port 80 is open in your AWS EC2 **Security Group** Inbound rules.
   - Run `docker compose ps` to ensure both `hotel-backend` and `hotel-frontend` status are `Up`.

2. **MongoDB Connection Timeout**:
   - Go to **MongoDB Atlas** > **Network Access** > Click **Add IP Address** > Choose **Allow Access from Anywhere (`0.0.0.0/0`)** or enter your EC2 Public IP.
   - Verify credentials in `.env`.

3. **Out of Memory during `docker compose up --build` on t2.micro**:
   - Follow **STEP 4** to enable a 2GB swap file.
   - Check memory with `free -h`.
