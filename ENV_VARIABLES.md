# Environment Variables Reference

Complete reference for all environment variables used in Meltdown Navigator.

## Backend Environment Variables

Create `backend/.env` with the following variables:

### Required

```env
# Anthropic API Key - Required for AI features
# Get from: https://console.anthropic.com/
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### Optional (but recommended)

```env
# MongoDB Connection String - Required for profile features
# Local: mongodb://localhost:27017/meltdown-navigator
# Atlas: mongodb+srv://username:password@cluster.mongodb.net/meltdown-navigator
MONGODB_URI=mongodb://localhost:27017/meltdown-navigator

# Server Configuration
PORT=4000
NODE_ENV=development
LOG_LEVEL=info
```

### Phase 2 Features (Optional)

```env
# Twilio Configuration - For SMS crisis alerts
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Production Monitoring (Optional)

```env
# Sentry Error Tracking
SENTRY_DSN=your_sentry_dsn_here
```

---

## Frontend Environment Variables

Create `frontend/.env.local` for development or `.env.production` for production:

### Required

```env
# Backend API URL
# Development: http://localhost:4000
# Production: https://api.yourdomain.com
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

### Optional

```env
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry Error Tracking
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_ERROR_TRACKING=true
```

---

## Mobile App Environment Variables

Create `apps/mobile/.env`:

### Required

```env
# Backend API URL
# iOS Simulator: http://localhost:4000
# Android Emulator: http://10.0.2.2:4000
# Physical Device: http://YOUR_COMPUTER_IP:4000
# Production: https://api.yourdomain.com
EXPO_PUBLIC_BACKEND_URL=http://localhost:4000
```

### Optional

```env
# Sentry Error Tracking
EXPO_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
```

---

## Environment Variable Details

### Backend Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | ✅ Yes | - | Anthropic API key for Claude AI |
| `MONGODB_URI` | ❌ No | - | MongoDB connection string |
| `PORT` | ❌ No | `4000` | Server port |
| `NODE_ENV` | ❌ No | `development` | Environment mode |
| `LOG_LEVEL` | ❌ No | `info` | Logging level (debug/info/warn/error) |
| `TWILIO_ACCOUNT_SID` | ❌ No | - | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | ❌ No | - | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | ❌ No | - | Twilio phone number |
| `SENTRY_DSN` | ❌ No | - | Sentry error tracking DSN |

### Frontend Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_BACKEND_URL` | ❌ No | `http://localhost:4000` | Backend API URL |
| `NEXT_PUBLIC_GA_ID` | ❌ No | - | Google Analytics ID |
| `NEXT_PUBLIC_SENTRY_DSN` | ❌ No | - | Sentry DSN |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | ❌ No | `false` | Enable analytics |
| `NEXT_PUBLIC_ENABLE_ERROR_TRACKING` | ❌ No | `true` | Enable error tracking |

### Mobile Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `EXPO_PUBLIC_BACKEND_URL` | ❌ No | `http://localhost:4000` | Backend API URL |
| `EXPO_PUBLIC_SENTRY_DSN` | ❌ No | - | Sentry DSN |

---

## Production Configuration

### Backend Production

```env
NODE_ENV=production
PORT=4000
ANTHROPIC_API_KEY=your_production_key
MONGODB_URI=your_production_mongodb_uri
LOG_LEVEL=warn
SENTRY_DSN=your_sentry_dsn
```

### Frontend Production

```env
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_TRACKING=true
```

### Mobile Production

```env
EXPO_PUBLIC_BACKEND_URL=https://api.yourdomain.com
EXPO_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

---

## Security Notes

1. **Never commit `.env` files** - They contain sensitive information
2. **Use different keys for development and production**
3. **Rotate API keys regularly**
4. **Use environment-specific variables** in your deployment platform
5. **Restrict MongoDB access** - Use IP whitelisting for Atlas
6. **Use strong passwords** for database connections

---

## Quick Setup

### Development

1. Copy environment variable templates:
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env and add your ANTHROPIC_API_KEY
   
   # Frontend
   cp frontend/.env.example frontend/.env.local
   # Edit if needed (defaults work for local dev)
   
   # Mobile
   cp apps/mobile/.env.example apps/mobile/.env
   # Edit if needed (defaults work for local dev)
   ```

2. Fill in required values (at minimum, `ANTHROPIC_API_KEY`)

3. Start development servers

### Production

1. Set environment variables in your deployment platform:
   - Vercel: Project Settings → Environment Variables
   - Railway: Variables tab
   - DigitalOcean: App Settings → Environment Variables
   - Docker: Use `--env-file` or environment variables

2. Use production values for all variables

3. Enable monitoring and error tracking

---

**Note:** The `.env.example` files are templates. Copy them to `.env` (or `.env.local` for Next.js) and fill in your actual values.


