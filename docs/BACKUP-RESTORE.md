# Backup and Restore Procedures

## Database Backup

### Using pg_dump (Recommended)
To backup the PostgreSQL database:

```bash
# Backup to a file
docker exec personal-finance-app-db-1 pg_dump -U postgres -d personalfinance > backup.sql

# Or with timestamp in filename
docker exec personal-finance-app-db-1 pg_dump -U postgres -d personalfinance > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Using Docker Volumes
If you're using named volumes for data persistence:

```bash
# Stop the containers first
docker-compose down

# Backup the volume
docker run --rm \
  -v personal-finance-app_postgres_data:/volume \
  -v $(pwd):/backup \
  alpine tar czf /backup/postgres-backup.tar.gz /volume

# Start the containers again
docker-compose up -d
```

## Application Configuration Backup
Backup your configuration files:

```bash
# Backup .env file (if it exists)
cp .env .env.backup_$(date +%Y%m%d_%H%M%S)

# Backup docker-compose.yml
cp docker-compose.yml docker-compose.yml.backup_$(date +%Y%m%d_%H%M%S)
```

## Restore Procedures

### Database Restore from SQL File
```bash
# Stop the application
docker-compose down

# Restore the database
cat backup.sql | docker exec -i personal-finance-app-db-1 psql -U postgres -d personalfinance

# Start the application
docker-compose up -d
```

### Database Restore from Volume Backup
```bash
# Stop the containers
docker-compose down

# Restore the volume
docker run --rm \
  -v personal-finance-app_postgres_data:/volume \
  -v $(pwd):/backup \
  alpine tar xzf /backup/postgres-backup.tar.gz -C /volume

# Start the containers
docker-compose up -d
```

## Automated Backup Script
Create a backup script (`backup.sh`):

```bash
#!/bin/bash
set -e

# Configuration
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="$APP_DIR/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Backup database
echo "Backing up database..."
docker exec personal-finance-app-db-1 pg_dump -U postgres -d personalfinance > "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

# Backup configuration
echo "Backing up configuration..."
cp "$APP_DIR/.env" "$BACKUP_DIR/.env_$TIMESTAMP" 2>/dev/null || true
cp "$APP_DIR/docker-compose.yml" "$BACKUP_DIR/docker-compose.yml_$TIMESTAMP" 2>/dev/null || true

# Clean up old backups
echo "Cleaning up backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -type f -mtime +$RETENTION_DAYS -delete

echo "Backup completed successfully!"
```

Make it executable:
```bash
chmod +x backup.sh
```

You can then schedule it with cron:
```bash
# Edit crontab
crontab -e

# Add line to run backup daily at 2 AM
0 2 * * * /path/to/your/app/backup.sh >> /path/to/your/app/backup.log 2>&1
```

## Best Practices
1. **Regular Backups**: Schedule automated backups at least daily
2. **Offsite Storage**: Copy backups to another location or cloud storage
3. **Test Restores**: Periodically test restoring from backups
4. **Secure Backups**: Encrypt backups containing sensitive data
5. **Documentation**: Keep restore procedures documented and tested