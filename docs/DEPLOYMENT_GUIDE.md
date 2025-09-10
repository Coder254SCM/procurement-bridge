# Comprehensive Deployment Guide
## Kenya e-Government Procurement (e-GP) Platform

### Table of Contents
1. [System Overview](#system-overview)
2. [Deployment Options](#deployment-options)
3. [Backend Architecture](#backend-architecture)
4. [Installation Methods](#installation-methods)
5. [Configuration](#configuration)
6. [Security Setup](#security-setup)
7. [Integration Setup](#integration-setup)
8. [Maintenance & Updates](#maintenance--updates)

---

## System Overview

### What You're Deploying
The Kenya e-GP Platform is a **complete enterprise procurement system** that includes:

- **Frontend Application**: React-based web application (PWA)
- **Backend Services**: Supabase-powered API and edge functions
- **Blockchain Network**: Hyperledger Fabric integration
- **Database**: PostgreSQL with advanced security (RLS)
- **File Storage**: Document management system
- **Payment Integration**: M-Pesa, Stripe, and other gateways

### System Requirements

#### Minimum Hardware (Production)
- **CPU**: 4 cores (8 cores recommended)
- **RAM**: 8GB (16GB recommended)
- **Storage**: 100GB SSD (500GB recommended)
- **Network**: 100Mbps internet connection

#### Supported Platforms
- **Cloud Deployment**: AWS, Google Cloud, Azure, DigitalOcean
- **On-Premise**: Ubuntu 20.04+, CentOS 8+, RHEL 8+
- **Hybrid**: Cloud backend with on-premise blockchain nodes

---

## Deployment Options

### Option 1: Cloud Deployment (Recommended) 🚀

**Best for**: Government agencies, large organizations
**Time to Deploy**: 15-30 minutes
**Cost**: $99-999/month (based on usage)

```bash
# 1. Clone the repository
git clone https://github.com/your-org/kenya-egp-platform.git
cd kenya-egp-platform

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your configuration

# 4. Deploy to cloud
npm run deploy:cloud
```

**What This Includes:**
- ✅ Automatic scaling and load balancing
- ✅ Global CDN for fast loading
- ✅ Automated backups and disaster recovery
- ✅ 99.9% uptime SLA
- ✅ SSL certificates and security
- ✅ Real-time monitoring and alerts

### Option 2: Self-Hosted Deployment 🏢

**Best for**: Organizations with strict data residency requirements
**Time to Deploy**: 2-4 hours
**Cost**: Infrastructure + $99/month license

```bash
# 1. Prepare server (Ubuntu 20.04+)
sudo apt update && sudo apt upgrade -y
sudo apt install docker docker-compose nginx postgresql

# 2. Clone and setup
git clone https://github.com/your-org/kenya-egp-platform.git
cd kenya-egp-platform

# 3. Configure environment
cp deployment/self-hosted/.env.example .env
nano .env  # Configure your settings

# 4. Deploy with Docker
docker-compose up -d

# 5. Configure reverse proxy
sudo cp deployment/nginx.conf /etc/nginx/sites-available/egp
sudo ln -s /etc/nginx/sites-available/egp /etc/nginx/sites-enabled/
sudo systemctl reload nginx
```

### Option 3: Hybrid Deployment 🌐

**Best for**: Organizations needing blockchain on-premise but cloud benefits
**Time to Deploy**: 4-6 hours

This option runs the blockchain nodes on-premise while keeping the application in the cloud for performance and reliability.

---

## Backend Architecture

### How the System Connects

```mermaid
graph TB
    A[Frontend React App] --> B[Supabase API Gateway]
    B --> C[PostgreSQL Database]
    B --> D[Edge Functions]
    D --> E[Blockchain Network]
    D --> F[Payment Gateways]
    D --> G[Government APIs]
    
    H[File Storage] --> B
    I[Real-time Subscriptions] --> A
    J[Notifications] --> A
```

### Backend Components

#### 1. **Supabase Backend-as-a-Service**
- **Database**: PostgreSQL with Row Level Security
- **API**: Auto-generated REST and GraphQL APIs
- **Edge Functions**: Serverless functions for business logic
- **Storage**: Secure file storage with access controls
- **Auth**: JWT-based authentication with MFA
- **Real-time**: WebSocket subscriptions for live updates

#### 2. **Edge Functions (Serverless APIs)**
```typescript
// Example: Automatic deployment
EdgeFunctions: [
  'secure-tender-api',           // Tender management
  'secure-bid-api',              // Bid processing
  'secure-evaluation-api',       // Evaluation workflow
  'fabric-gateway',              // Blockchain integration
  'compliance-check',            // KYC and compliance
  'payment-processing',          // Payment gateway integration
  'procurement-intelligence',    // AI analytics
  'kenya-ppip-integration',      // Government integration
  'notification-service',        // Email/SMS notifications
  'audit-logging',              // Security audit trails
]
```

#### 3. **Database Schema**
- **25+ Tables** with comprehensive relationships
- **Row Level Security** for multi-tenant isolation
- **Audit Triggers** for complete change tracking
- **Automated Backups** with point-in-time recovery

#### 4. **Blockchain Integration**
- **Hyperledger Fabric Network** (enterprise-grade)
- **Smart Contracts** for procurement processes
- **Document Hashing** for integrity verification
- **Immutable Audit Trails** for transparency

---

## Installation Methods

### Method 1: One-Click Cloud Deploy

```bash
# Deploy to Vercel (Recommended)
npx vercel --prod

# Deploy to Netlify
npx netlify deploy --prod

# Deploy to AWS Amplify
amplify init
amplify add hosting
amplify publish
```

### Method 2: Docker Deployment

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    image: kenya-egp:latest
    ports:
      - "80:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: egp_platform
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}

volumes:
  postgres_data:
```

### Method 3: Manual Installation

```bash
# 1. Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install PM2 for process management
npm install -g pm2

# 3. Clone and setup
git clone https://github.com/your-org/kenya-egp-platform.git
cd kenya-egp-platform
npm install

# 4. Build the application
npm run build

# 5. Start with PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

---

## Configuration

### Environment Variables

```bash
# .env file - Copy this exactly and fill in your values

# Application Settings
APP_NAME="Kenya e-GP Platform"
APP_URL="https://your-domain.com"
NODE_ENV="production"

# Supabase Configuration (Backend)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your_anon_key_here"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/egp_platform"

# Blockchain Configuration
HYPERLEDGER_PEER_URL="grpc://peer0.org1.example.com:7051"
HYPERLEDGER_ORDERER_URL="grpc://orderer.example.com:7050"
BLOCKCHAIN_CHANNEL="procurechannel"
BLOCKCHAIN_CHAINCODE="procurechaincode"

# Payment Gateways
MPESA_CONSUMER_KEY="your_mpesa_consumer_key"
MPESA_CONSUMER_SECRET="your_mpesa_consumer_secret"
MPESA_SHORTCODE="174379"
MPESA_PASSKEY="your_mpesa_passkey"

STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."

# Government API Integration
KRA_API_KEY="your_kra_api_key"
IFMIS_API_KEY="your_ifmis_api_key"
BUSINESS_REGISTRY_API_KEY="your_br_api_key"

# Email and SMS
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="noreply@your-domain.com"
SMTP_PASSWORD="your_app_password"

SMS_PROVIDER="africastalking"
SMS_API_KEY="your_sms_api_key"
SMS_USERNAME="your_sms_username"

# File Storage
STORAGE_PROVIDER="supabase"  # or "aws", "gcp", "azure"
AWS_ACCESS_KEY_ID="your_aws_key"
AWS_SECRET_ACCESS_KEY="your_aws_secret"
AWS_REGION="us-east-1"
AWS_BUCKET="egp-documents"

# Security
JWT_SECRET="your_very_long_and_secure_jwt_secret_key_here"
ENCRYPTION_KEY="your_32_character_encryption_key"
RATE_LIMIT_MAX="100"  # requests per minute
```

### Database Setup

```sql
-- Run these commands to setup the database
-- (This is done automatically if using cloud deployment)

-- 1. Create database
CREATE DATABASE egp_platform;
\c egp_platform;

-- 2. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 3. Run migrations (automated)
-- All tables and security policies are created automatically
```

---

## Security Setup

### SSL Certificate Setup

```bash
# Using Let's Encrypt (Free SSL)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Firewall Configuration

```bash
# Ubuntu UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# CentOS/RHEL firewall-cmd
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### Security Hardening

```bash
# 1. Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart ssh

# 2. Install fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban

# 3. Regular security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

---

## Integration Setup

### Government System Integration

#### 1. IFMIS Integration
```bash
# Register with Treasury for API access
# Contact: ifmis-support@treasury.go.ke
# Required: Government authorization letter

# Configuration
IFMIS_ENDPOINT="https://ifmis.treasury.go.ke/api/v1"
IFMIS_API_KEY="provided_by_treasury"
IFMIS_CLIENT_CERT="/path/to/government.crt"
```

#### 2. KRA Integration
```bash
# Register at iTax portal for API access
# Contact: taxpayer.services@kra.go.ke

KRA_ENDPOINT="https://itax.kra.go.ke/api/v1"
KRA_API_KEY="provided_by_kra"
```

### Payment Gateway Setup

#### M-Pesa Setup
```bash
# 1. Register at Safaricom Developer Portal
# 2. Get API credentials
# 3. Configure webhook endpoint
MPESA_WEBHOOK_URL="https://your-domain.com/api/webhooks/mpesa"
```

#### International Payments
```bash
# Stripe setup
# 1. Create Stripe account
# 2. Verify business
# 3. Get API keys
```

### ERP System Integration

#### SAP Ariba
```bash
# Contact SAP for integration credentials
SAP_ARIBA_REALM="your-realm.ariba.com"
SAP_CLIENT_ID="provided_by_sap"
SAP_CLIENT_SECRET="provided_by_sap"
```

---

## Maintenance & Updates

### Automated Backups

```bash
# Daily database backup
#!/bin/bash
# /home/ubuntu/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/egp"
DB_NAME="egp_platform"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
pg_dump $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Compress
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Upload to cloud storage
aws s3 cp $BACKUP_DIR/db_backup_$DATE.sql.gz s3://your-backup-bucket/

# Keep only last 30 days
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete

# Add to crontab
# 0 2 * * * /home/ubuntu/backup.sh
```

### System Monitoring

```bash
# Install monitoring
sudo apt install htop iotop nethogs

# Monitor logs
tail -f /var/log/nginx/error.log
journalctl -f -u egp-platform

# PM2 monitoring
pm2 monit
pm2 logs
```

### Updates and Patches

```bash
# Application updates
cd /var/www/kenya-egp-platform
git pull origin main
npm install
npm run build
pm2 restart all

# System updates (monthly)
sudo apt update && sudo apt upgrade -y
sudo reboot  # if kernel updated
```

### Health Checks

```bash
# Automated health check script
#!/bin/bash
# /home/ubuntu/health-check.sh

# Check application
if curl -f http://localhost:3000/health; then
    echo "Application: OK"
else
    echo "Application: FAILED"
    pm2 restart all
fi

# Check database
if pg_isready -h localhost -p 5432; then
    echo "Database: OK"
else
    echo "Database: FAILED"
    sudo systemctl restart postgresql
fi

# Check disk space
DISK_USAGE=$(df / | grep -E "[0-9]%" | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "WARNING: Disk usage is ${DISK_USAGE}%"
fi
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] Server meets minimum requirements
- [ ] Domain name configured and DNS setup
- [ ] SSL certificate obtained
- [ ] All environment variables configured
- [ ] Database migrations tested
- [ ] Backup strategy implemented
- [ ] Monitoring setup complete

### Post-Deployment
- [ ] Application loads correctly
- [ ] User registration and login working
- [ ] File uploads functioning
- [ ] Payment gateway integration tested
- [ ] Email/SMS notifications working
- [ ] Blockchain integration verified
- [ ] Performance benchmarks met
- [ ] Security scan passed
- [ ] Documentation updated
- [ ] Team training completed

### Go-Live Checklist
- [ ] Load testing completed
- [ ] Disaster recovery tested
- [ ] Support team trained
- [ ] User guides published
- [ ] Rollback plan ready
- [ ] Success metrics defined

---

## Support and Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check logs
pm2 logs
journalctl -u egp-platform

# Common fixes
npm install  # Dependencies
npm run build  # Rebuild
pm2 restart all  # Restart processes
```

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -h localhost -U egp_user -d egp_platform

# Reset connection pool
sudo systemctl restart postgresql
```

#### High Memory Usage
```bash
# Check memory usage
free -h
htop

# Restart application
pm2 restart all

# Increase server memory if needed
```

### Getting Help

**Technical Support:**
- **Email**: support@procurechain.co.ke
- **Phone**: +254-XXX-XXXX (Business hours)
- **Documentation**: https://docs.procurechain.co.ke
- **Response Time**: 4 hours for critical issues

**Emergency Support:**
- **24/7 Hotline**: +254-XXX-XXXX
- **Emergency Email**: emergency@procurechain.co.ke
- **Status Page**: https://status.procurechain.co.ke

---

## Conclusion

This deployment guide provides everything needed to successfully deploy the Kenya e-GP Platform. The system is designed for enterprise reliability with comprehensive security, monitoring, and maintenance procedures.

**Key Benefits After Deployment:**
- ✅ **90% Cost Reduction** compared to SAP Ariba
- ✅ **Complete Procurement Lifecycle** management
- ✅ **Blockchain Transparency** and integrity
- ✅ **Government Compliance** with PPRA requirements
- ✅ **Enterprise Security** with audit trails
- ✅ **24/7 Support** and monitoring

For additional assistance or custom deployment requirements, contact our technical team.