# 🚀 Deployment Steps - Follow These Now

## Step 1: Choose Your Deployment Method

### 🐳 Option A: Docker (Fastest - Recommended)

**Best for:** Local testing, development, or self-hosted production

```bash
# Run the quick deploy script
./scripts/quick-deploy.sh
```

Or manually:
```bash
# 1. Create backend/.env with your ANTHROPIC_API_KEY
# 2. Deploy
docker-compose up -d --build

# 3. Check status
docker-compose ps
curl http://localhost:4000/api/health
```

---

### ☁️ Option B: Vercel (Easiest Cloud - Recommended)

**Best for:** Production deployment with minimal setup

#### Deploy Backend:

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Navigate to backend
cd backend

# 3. Build
npm run build

# 4. Deploy
vercel --prod

# 5. Set environment variables in Vercel dashboard:
#    - ANTHROPIC_API_KEY
#    - MONGODB_URI
#    - NODE_ENV=production
```

#### Deploy Frontend:

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (or leave default)
   - **Output Directory:** `.next` (or leave default)
5. Add Environment Variable:
   - `NEXT_PUBLIC_BACKEND_URL` = Your backend URL from step above
6. Click "Deploy"

---

### 🚂 Option C: Railway

**Best for:** Simple backend deployment

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add Service → Select "backend" directory
5. Configure:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm run start:prod`
6. Add Environment Variables:
   - `ANTHROPIC_API_KEY`
   - `MONGODB_URI` (or use Railway's MongoDB addon)
   - `NODE_ENV=production`
7. Deploy!

---

### 🖥️ Option D: PM2 (Your Own Server)

**Best for:** VPS or dedicated server

```bash
# 1. Install PM2
npm install -g pm2

# 2. Build backend
cd backend
npm run build

# 3. Start with PM2
pm2 start ecosystem.config.js --env production

# 4. Save configuration
pm2 save

# 5. Setup auto-start on reboot
pm2 startup
# Follow the instructions it prints

# 6. Monitor
pm2 status
pm2 logs meltdown-backend
```

---

## Step 2: Set Environment Variables

### Backend Required Variables:

Create `backend/.env`:
```env
ANTHROPIC_API_KEY=sk-ant-api03-...your-key-here
MONGODB_URI=mongodb://localhost:27017/meltdown-navigator
NODE_ENV=production
```

### Frontend Required Variables:

Create `frontend/.env.production`:
```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
```

---

## Step 3: Verify Deployment

### Test Health Check:

```bash
curl https://your-backend-url/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-12-...",
  "uptime": 123.45,
  "environment": "production",
  "services": {
    "database": "connected",
    "ai": "configured"
  }
}
```

### Test Translator:

```bash
curl -X POST https://your-backend-url/api/translator \
  -H "Content-Type: application/json" \
  -d '{
    "rawMessage": "I feel overwhelmed",
    "stressLevel": 4
  }'
```

### Test Frontend:

1. Visit your frontend URL
2. Go to `/onboarding` to create a profile
3. Use `/` to test the translator

---

## Step 4: Monitor & Maintain

### View Logs:

**Docker:**
```bash
docker-compose logs -f
```

**PM2:**
```bash
pm2 logs meltdown-backend
```

**Vercel/Railway:**
- Check dashboard logs

### Check Status:

**Docker:**
```bash
docker-compose ps
```

**PM2:**
```bash
pm2 status
```

---

## Quick Reference

### Docker Commands:
```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Restart
docker-compose restart

# View logs
docker-compose logs -f

# Rebuild
docker-compose up -d --build
```

### PM2 Commands:
```bash
# Start
pm2 start ecosystem.config.js

# Stop
pm2 stop meltdown-backend

# Restart
pm2 restart meltdown-backend

# View logs
pm2 logs

# Monitor
pm2 monit
```

---

## Troubleshooting

### Backend won't start:
1. Check environment variables are set
2. Verify MongoDB is accessible
3. Check logs: `docker-compose logs backend` or `pm2 logs`

### Frontend can't connect to backend:
1. Verify `NEXT_PUBLIC_BACKEND_URL` is correct
2. Check CORS settings
3. Verify backend is running

### Health check fails:
1. Check backend logs
2. Verify MongoDB connection
3. Check ANTHROPIC_API_KEY is set

---

## Next Steps

1. ✅ Deploy backend
2. ✅ Deploy frontend
3. ✅ Test health check
4. ✅ Test translator
5. ✅ Test onboarding flow
6. 🎉 Launch!

---

**Need help?** Check `DEPLOYMENT.md` for detailed instructions.


