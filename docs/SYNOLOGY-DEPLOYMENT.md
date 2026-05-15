# Synology NAS Deployment Guide

## Prerequisites
- Synology NAS with Docker installed (Package Center)
- Sufficient storage space for the application and database
- Admin access to the Synology NAS

## Deployment Steps

### 1. Prepare the Application Files
1. Download the latest release of the Personal Finance Application from GitHub
2. Extract the files to a shared folder on your Synology NAS (e.g., `/docker/personal-finance-app`)

### 2. Configure Environment Variables
Create a `.env` file in the application directory with the following contents:

```
# Backend Configuration
DATABASE_URL=postgresql://postgres:your_secure_password@db:5432/personalfinance
SECRET_KEY=your-super-secret-key-change-this-in-production

# Frontend Configuration (built into Docker image)
REACT_APP_BACKEND_URL=http://your-synology-ip:8000

# Database Configuration
POSTGRES_DB=personalfinance
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
```

> **Important**: Replace `your_secure_password` and `your-super-secret-key-change-this-in-production` with strong, unique values.

### 3. Deploy Using Docker Compose
1. Open SSH to your Synology NAS (enable in Control Panel > Terminal & SNMP)
2. Navigate to your application directory:
   ```bash
   cd /volume1/docker/personal-finance-app
   ```
3. Start the application:
   ```bash
   docker-compose up -d
   ```
4. Verify the containers are running:
   ```bash
   docker-compose ps
   ```

### 4. Access the Application
- Open a web browser and navigate to: `http://your-synology-ip:3000`
- The backend API will be available at: `http://your-synology-ip:8000`

### 5. Maintenance
- To view logs: `docker-compose logs -f`
- To stop the application: `docker-compose down`
- To update: Pull the latest code and run `docker-compose up -d --build`

## Recommended Settings for Synology
- Allocate at least 2GB RAM to the Docker container group
- Consider using SSD storage for better database performance
- Set up automatic snapshots of your Docker volume for backup