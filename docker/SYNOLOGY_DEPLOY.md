# Synology NAS Deployment Guide

## Prerequisites

- Synology NAS with Docker package (DSM 7.0+)
- At least 4GB RAM available
- Docker Compose v2 installed via Container Manager

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Transfer files to NAS**
   ```bash
   scp -r ./backend ./frontend ./docker user@your-nas:/volume1/docker/personal-finance/
   ```

2. **SSH into NAS**
   ```bash
   ssh user@your-nas
   cd /volume1/docker/personal-finance/docker
   ```

3. **Start services**
   ```bash
   docker-compose up -d
   ```

4. **Access application**
   - Frontend: http://your-nas:3001
   - Backend API: http://your-nas:3000

### Option 2: Using Container Manager (DSM GUI)

1. **Open Container Manager**
   - DSM → Package Center → Container Manager

2. **Create Project**
   - Project → Create → Enter project name
   - Set path to your docker-compose.yml
   - Port forwarding: 3000-3001

3. **Configure environment**
   - Add environment variables:
     - DATABASE_URL=postgresql://postgres:password@db:5432/personal_finance
     - NODE_ENV=production

## Configuration

### Environment Variables

Create `.env` file:
```env
DATABASE_URL=postgresql://user:password@postgres:5432/personal_finance
NODE_ENV=production
PORT=3000
```

### Volume Mounts

For data persistence, mount volumes:
- `./postgres_data:/var/lib/postgresql/data`
- `./uploads:/app/uploads`

## Troubleshooting

### Container won't start

1. Check logs: `docker-compose logs`
2. Verify ports 3000-3001 are not in use
3. Check database connection

### Database connection errors

1. Ensure PostgreSQL container is running
2. Check DATABASE_URL format
3. Wait for database to initialize (~30s)

### Performance issues

1. Increase container resources in Container Manager
2. Enable caching in settings

## Backup

Regularly backup:
- Database: `/volume1/docker/personal-finance/postgres_data`
- Environment: `/volume1/docker/personal-finance/.env`

## Updates

```bash
docker-compose down
docker-compose build
docker-compose up -d
```