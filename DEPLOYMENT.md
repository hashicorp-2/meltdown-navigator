# Production Deployment Guide

Complete guide for deploying Meltdown Navigator to production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Mobile App Deployment](#mobile-app-deployment)
5. [Database Setup](#database-setup)
6. [Environment Configuration](#environment-configuration)
7. [Monitoring & Logging](#monitoring--logging)
8. [Security Checklist](#security-checklist)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Node.js 20.x or higher
- MongoDB (local or Atlas)
- Anthropic API key
- Domain name (for production)
- SSL certificate (for HTTPS)
- CI/CD platform (GitHub Actions, GitLab CI, etc.)

---

## Backend Deployment

### Option 1: Vercel (Serverless Functions)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Configure Vercel:**
   Create `vercel.json` in backend directory:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "dist/index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "dist/index.js"
       }
     ]
   }
   ```

3. **Deploy:**
   ```bash
   cd backend
   vercel --prod
   ```

4. **Set Environment Variables:**
   - Go to Vercel dashboard → Project → Settings → Environment Variables
   - Add all required variables from `.env.example`

### Option 2: Railway

1. **Connect Repository:**
   - Go to [Railway](https://railway.app)
   - New Project → Deploy from GitHub
   - Select your repository

2. **Configure:**
   - Set root directory to `backend`
   - Set build command: `npm run build`
   - Set start command: `npm run start:prod`

3. **Environment Variables:**
   - Add all variables from `.env.example` in Railway dashboard

### Option 3: DigitalOcean App Platform

1. **Create App:**
   - Go to DigitalOcean → App Platform
   - Create from GitHub repository

2. **Configure:**
   - Type: Web Service
   - Build Command: `cd backend && npm install && npm run build`
   - Run Command: `cd backend && npm run start:prod`
   - Environment Variables: Add from `.env.example`

### Option 4: Docker (Self-Hosted)

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:20-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   COPY backend/package*.json ./backend/
   RUN npm ci
   COPY . .
   RUN npm run build --workspace @meltdown/backend

   FROM node:20-alpine
   WORKDIR /app
   COPY --from=builder /app/backend/dist ./dist
   COPY --from=builder /app/backend/package*.json ./
   COPY --from=builder /app/node_modules ./node_modules
   EXPOSE 4000
   CMD ["node", "dist/index.js"]
   ```

2. **Build and Run:**
   ```bash
   docker build -t meltdown-backend .
   docker run -p 4000:4000 --env-file backend/.env meltdown-backend
   ```

### Option 5: PM2 (Traditional Server)

1. **Install PM2:**
   ```bash
   npm install -g pm2
   ```

2. **Create ecosystem file** (`backend/ecosystem.config.js`):
   ```javascript
   module.exports = {
     apps: [{
       name: 'meltdown-backend',
       script: './dist/index.js',
       instances: 2,
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 4000
       },
       error_file: './logs/err.log',
       out_file: './logs/out.log',
       log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
       merge_logs: true,
       autorestart: true,
       max_memory_restart: '1G'
     }]
   };
   ```

3. **Deploy:**
   ```bash
   cd backend
   npm run build
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup  # For auto-start on server reboot
   ```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Connect Repository:**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `frontend`

2. **Configure:**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Environment Variables:**
   - `NEXT_PUBLIC_BACKEND_URL`: Your backend API URL

4. **Deploy:**
   - Vercel will auto-deploy on every push to main branch

### Option 2: Netlify

1. **Connect Repository:**
   - Go to [Netlify](https://netlify.com)
   - New site from Git → Select repository

2. **Configure:**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/.next`

3. **Environment Variables:**
   - Add `NEXT_PUBLIC_BACKEND_URL` in site settings

### Option 3: Docker

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:20-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   COPY frontend/package*.json ./frontend/
   RUN npm ci
   COPY . .
   RUN npm run build --workspace @meltdown/frontend

   FROM node:20-alpine
   WORKDIR /app
   COPY --from=builder /app/frontend/.next ./.next
   COPY --from=builder /app/frontend/package*.json ./
   COPY --from=builder /app/node_modules ./node_modules
   EXPOSE 3000
   CMD ["npm", "run", "start", "--workspace", "@meltdown/frontend"]
   ```

---

## Mobile App Deployment

### iOS (App Store)

1. **Build for Production:**
   ```bash
   cd apps/mobile
   expo build:ios
   ```

2. **Submit to App Store:**
   - Use Expo's submission service or download and submit manually
   - Follow [Expo's App Store guide](https://docs.expo.dev/submit/ios/)

### Android (Google Play)

1. **Build for Production:**
   ```bash
   cd apps/mobile
   expo build:android
   ```

2. **Submit to Play Store:**
   - Use Expo's submission service or download and submit manually
   - Follow [Expo's Play Store guide](https://docs.expo.dev/submit/android/)

---

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. **Create Cluster:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (M0 free tier available)

2. **Configure:**
   - Create database user
   - Whitelist IP addresses (or `0.0.0.0/0` for development)
   - Get connection string

3. **Set Environment Variable:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/meltdown-navigator
   ```

### Local MongoDB

1. **Install MongoDB:**
   ```bash
   # macOS
   brew install mongodb-community

   # Ubuntu
   sudo apt-get install mongodb
   ```

2. **Start MongoDB:**
   ```bash
   # macOS
   brew services start mongodb-community

   # Ubuntu
   sudo systemctl start mongod
   ```

3. **Run Migrations:**
   ```bash
   cd backend
   npm run migrate
   ```

---

## Environment Configuration

### Backend Production Variables

Create `backend/.env` with:

```env
# Required
ANTHROPIC_API_KEY=your_production_api_key
MONGODB_URI=your_production_mongodb_uri
NODE_ENV=production
PORT=4000

# Optional
LOG_LEVEL=info
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
SENTRY_DSN=your_sentry_dsn
```

### Frontend Production Variables

Create `frontend/.env.production`:

```env
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

---

## Monitoring & Logging

### Health Checks

The backend includes an enhanced health check endpoint:

```bash
curl https://api.yourdomain.com/api/health
```

Response includes:
- Status
- Uptime
- Database connection status
- AI service configuration
- Version information

### Error Tracking (Sentry)

1. **Install Sentry:**
   ```bash
   npm install @sentry/node @sentry/nextjs
   ```

2. **Configure Backend:**
   ```typescript
   import * as Sentry from '@sentry/node';
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
   });
   ```

3. **Configure Frontend:**
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```

### Logging

The backend includes a logger utility. Set `LOG_LEVEL` environment variable:
- `debug` - All logs
- `info` - Info, warnings, errors
- `warn` - Warnings and errors only
- `error` - Errors only

---

## Security Checklist

### Before Going Live

- [ ] All environment variables set and secure
- [ ] API keys rotated and stored securely
- [ ] MongoDB access restricted (IP whitelist)
- [ ] HTTPS enabled (SSL certificate)
- [ ] CORS configured correctly
- [ ] Rate limiting implemented (if needed)
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info
- [ ] Database backups configured
- [ ] Monitoring and alerts set up
- [ ] Security headers configured
- [ ] Dependencies updated (no known vulnerabilities)

### Security Headers (Next.js)

Add to `next.config.mjs`:

```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

export default {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

## Troubleshooting

### Backend Won't Start

1. Check environment variables are set
2. Verify MongoDB connection
3. Check port is not in use
4. Review logs for errors

### Frontend Build Fails

1. Clear `.next` directory
2. Delete `node_modules` and reinstall
3. Check for TypeScript errors
4. Verify environment variables

### Database Connection Issues

1. Verify MongoDB URI format
2. Check IP whitelist (for Atlas)
3. Verify credentials
4. Check network connectivity

### API Errors

1. Check backend logs
2. Verify API keys are valid
3. Check rate limits
4. Review error responses

---

## Post-Deployment

### Verification Steps

1. **Health Check:**
   ```bash
   curl https://api.yourdomain.com/api/health
   ```

2. **Test Translator:**
   ```bash
   curl -X POST https://api.yourdomain.com/api/translator \
     -H "Content-Type: application/json" \
     -d '{"rawMessage": "Test", "stressLevel": 3}'
   ```

3. **Test Frontend:**
   - Visit your frontend URL
   - Complete onboarding flow
   - Test translator

4. **Monitor:**
   - Check application logs
   - Monitor error rates
   - Watch API response times

### Maintenance

- Regular dependency updates
- Database backups
- Log rotation
- Performance monitoring
- Security audits

---

## Support

For deployment issues:
1. Check logs
2. Review this guide
3. Check GitHub Issues
4. Review architecture documentation

---

**Last Updated:** December 2024


