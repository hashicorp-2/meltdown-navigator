# Meltdown Navigator - Complete Setup Guide

This guide will help you set up and run the entire Meltdown Navigator application, including backend, web frontend, and mobile app.

## Prerequisites

- **Node.js** >= 18.x (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- **npm** >= 9.x (comes with Node.js)
- **MongoDB** (optional, for profile features) - [Install MongoDB](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
- **Anthropic API Key** - Get one at [console.anthropic.com](https://console.anthropic.com/)
- **Expo CLI** (for mobile app) - `npm install -g expo-cli`

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd meltdown-navigator

# Install all workspace dependencies
npm install --workspaces --include-workspace-root
```

### 2. Backend Setup

#### Create Environment File

```bash
cd backend
cp .env.example .env  # If .env.example exists, or create .env manually
```

#### Configure Environment Variables

Create `backend/.env` with:

```env
# Required: Anthropic API Key for AI features
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional: MongoDB connection (for profile features)
# If not set, translator works but profiles won't be saved
MONGODB_URI=mongodb://localhost:27017/meltdown-navigator
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/meltdown-navigator

# Optional: Twilio credentials (for Phase 2 crisis alerts)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

#### Build and Run Backend

```bash
# Build TypeScript
npm run build --workspace @meltdown/backend

# Run in production mode
npm run start:prod --workspace @meltdown/backend

# OR run in development mode (with watch)
npm run dev --workspace @meltdown/backend
```

The backend will start on `http://localhost:4000` by default.

**Verify it's working:**
```bash
curl http://localhost:4000/api/health
# Should return: {"status":"ok"}
```

### 3. Web Frontend Setup

#### Create Environment File

```bash
cd frontend
# Create .env.local file
```

#### Configure Environment Variables

Create `frontend/.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

#### Run Web Frontend

```bash
npm run dev --workspace @meltdown/frontend
```

The web app will start on `http://localhost:3000` by default.

### 4. Mobile App Setup

#### Create Environment File (Optional)

```bash
cd apps/mobile
# Create .env file (optional)
```

#### Configure Environment Variables (Optional)

Create `apps/mobile/.env`:

```env
# Backend API URL (defaults to http://localhost:4000 if not set)
EXPO_PUBLIC_BACKEND_URL=http://localhost:4000
```

**Note:** For iOS Simulator, use `http://localhost:4000`. For Android Emulator, use `http://10.0.2.2:4000`. For physical devices, use your computer's IP address (e.g., `http://192.168.1.100:4000`).

#### Run Mobile App

```bash
# Start Expo development server
npm run start --workspace @meltdown/mobile

# Run on iOS simulator
npm run ios --workspace @meltdown/mobile

# Run on Android emulator
npm run android --workspace @meltdown/mobile
```

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | ✅ Yes | Anthropic API key for Claude AI |
| `MONGODB_URI` | ❌ No | MongoDB connection string (required for profiles) |
| `TWILIO_ACCOUNT_SID` | ❌ No | Twilio account SID (for Phase 2 SMS alerts) |
| `TWILIO_AUTH_TOKEN` | ❌ No | Twilio auth token (for Phase 2 SMS alerts) |
| `TWILIO_PHONE_NUMBER` | ❌ No | Twilio phone number (for Phase 2 SMS alerts) |

### Web Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_BACKEND_URL` | ❌ No | Backend API URL (defaults to `http://localhost:4000`) |

### Mobile App (`apps/mobile/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `EXPO_PUBLIC_BACKEND_URL` | ❌ No | Backend API URL (defaults to `http://localhost:4000`) |

## MongoDB Setup Options

### Option 1: Local MongoDB

1. Install MongoDB locally: [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/meltdown-navigator`

### Option 2: MongoDB Atlas (Cloud - Recommended for Development)

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or `0.0.0.0/0` for development)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/meltdown-navigator`

### Option 3: Docker MongoDB

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Then use: `mongodb://localhost:27017/meltdown-navigator`

## Testing the Setup

### 1. Test Backend

```bash
# Health check
curl http://localhost:4000/api/health

# Test translator (requires ANTHROPIC_API_KEY)
curl -X POST http://localhost:4000/api/translator \
  -H "Content-Type: application/json" \
  -d '{
    "rawMessage": "I feel overwhelmed and need help",
    "stressLevel": 4
  }'
```

### 2. Test Web Frontend

1. Open `http://localhost:3000`
2. Navigate to `/onboarding` to create a profile
3. Go to `/` (translator) to test translation

### 3. Test Mobile App

1. Start the app on a device/simulator
2. Complete onboarding flow
3. Test translator with and without profile

## Troubleshooting

### Backend Issues

**Error: "ANTHROPIC_API_KEY is not set"**
- Make sure `backend/.env` exists and contains `ANTHROPIC_API_KEY`
- Restart the backend server after adding the key

**Error: "Must use import to load ES Module"**
- See `backend/TROUBLESHOOTING.md` for solutions
- Make sure you're using Node.js 18+

**MongoDB Connection Issues**
- Verify MongoDB is running (if using local)
- Check connection string format
- Verify network access (for Atlas)
- Backend will work without MongoDB, but profiles won't be saved

### Frontend Issues

**Backend not connecting**
- Verify backend is running on `http://localhost:4000`
- Check `NEXT_PUBLIC_BACKEND_URL` in `.env.local`
- Check browser console for CORS errors

**Profile not loading**
- Verify MongoDB is configured and running
- Check backend logs for errors
- Verify profile was created successfully

### Mobile App Issues

**Cannot connect to backend**
- For iOS Simulator: Use `http://localhost:4000`
- For Android Emulator: Use `http://10.0.2.2:4000`
- For physical device: Use your computer's IP address
- Make sure backend is accessible from your device's network

**Expo errors**
- Clear Expo cache: `expo start -c`
- Reinstall dependencies: `npm install --workspace @meltdown/mobile`

## Development Workflow

### Running Everything Together

1. **Terminal 1 - Backend:**
   ```bash
   npm run dev --workspace @meltdown/backend
   ```

2. **Terminal 2 - Web Frontend:**
   ```bash
   npm run dev --workspace @meltdown/frontend
   ```

3. **Terminal 3 - Mobile App (optional):**
   ```bash
   npm run start --workspace @meltdown/mobile
   ```

### Running Tests

```bash
# Backend tests
npm run test --workspace @meltdown/backend

# Run specific test file
npm run test --workspace @meltdown/backend -- tests/services/translatorService.test.ts
```

## Production Deployment

### Backend

1. Set production environment variables
2. Build: `npm run build --workspace @meltdown/backend`
3. Run: `npm run start:prod --workspace @meltdown/backend`
4. Use process manager (PM2, systemd, etc.)

### Web Frontend

1. Set production environment variables
2. Build: `npm run build --workspace @meltdown/frontend`
3. Run: `npm run start --workspace @meltdown/frontend`
4. Deploy to Vercel, Netlify, or your hosting provider

### Mobile App

1. Build for production: `expo build:ios` or `expo build:android`
2. Submit to App Store / Play Store

## Next Steps

- Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Read [PROGRESS.md](./PROGRESS.md) for feature status
- Read [STATUS_REPORT.md](./STATUS_REPORT.md) for current completion status

## Getting Help

- Check `backend/TROUBLESHOOTING.md` for backend-specific issues
- Check `backend/SETUP.md` for detailed backend setup
- Review error logs in console/terminal
- Check MongoDB connection if profile features aren't working


