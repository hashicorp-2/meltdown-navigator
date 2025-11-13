# 🚀 Local Deployment Guide (Without Docker)

Since Docker is not installed, here's how to deploy locally using Node.js directly.

## Quick Start

### Step 1: Set Your API Key

Edit `backend/.env` and replace `your_anthropic_api_key_here` with your actual Anthropic API key:

```bash
# Get your key from: https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-api03-...your-actual-key...
```

### Step 2: Install Dependencies

```bash
npm install --workspaces --include-workspace-root
```

### Step 3: Build Everything

```bash
# Build backend
cd backend
npm run build
cd ..

# Build frontend
cd frontend
npm run build
cd ..
```

### Step 4: Start Services

**Option A: Use the deployment script**

```bash
./scripts/local-deploy.sh
```

**Option B: Manual start**

Terminal 1 - Backend:
```bash
cd backend
npm run start:prod
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run start
```

### Step 5: Test

```bash
# Health check
curl http://localhost:4000/api/health

# Open in browser
open http://localhost:3000
```

---

## MongoDB Setup (Optional but Recommended)

### Option 1: Local MongoDB

```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo apt-get install mongodb
sudo systemctl start mongod
```

Then update `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/meltdown-navigator
```

### Option 2: MongoDB Atlas (Cloud - Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Update `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/meltdown-navigator
```

### Option 3: Skip MongoDB (Limited Features)

The app will work without MongoDB, but profile features won't be available. You can still use the translator without profiles.

---

## Running Services

### Start Backend

```bash
cd backend
npm run start:prod
```

Backend will run on: http://localhost:4000

### Start Frontend

```bash
cd frontend
npm run start
```

Frontend will run on: http://localhost:3000

---

## Verify Deployment

### 1. Health Check

```bash
curl http://localhost:4000/api/health
```

Expected:
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": 123.45,
  "environment": "development",
  "services": {
    "database": "connected" or "disconnected",
    "ai": "configured"
  }
}
```

### 2. Test Translator

```bash
curl -X POST http://localhost:4000/api/translator \
  -H "Content-Type: application/json" \
  -d '{
    "rawMessage": "I feel overwhelmed",
    "stressLevel": 4
  }'
```

### 3. Test Frontend

1. Open http://localhost:3000
2. Go to `/onboarding` to create a profile
3. Use `/` to test translator

---

## Troubleshooting

### Port Already in Use

```bash
# Find what's using port 4000
lsof -i :4000

# Kill it or change PORT in backend/.env
```

### Build Errors

```bash
# Clear and reinstall
rm -rf node_modules backend/node_modules frontend/node_modules
npm install --workspaces --include-workspace-root
```

### MongoDB Connection Issues

- Verify MongoDB is running: `mongosh` or `mongo`
- Check connection string format
- For Atlas: Verify IP whitelist

---

## Next Steps

1. ✅ Set ANTHROPIC_API_KEY in backend/.env
2. ✅ Install dependencies
3. ✅ Build backend and frontend
4. ✅ Start services
5. ✅ Test health check
6. ✅ Test frontend
7. 🎉 Ready to use!

---

**Your app is ready! Access it at http://localhost:3000**


