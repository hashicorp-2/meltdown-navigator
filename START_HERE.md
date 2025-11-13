# 🚀 START HERE - Deploy Meltdown Navigator

## ⚠️ Important: Set Your API Key First!

Before deploying, you **must** edit `backend/.env` and add your Anthropic API key:

1. Get your API key from: https://console.anthropic.com/
2. Edit `backend/.env`
3. Replace `your_anthropic_api_key_here` with your actual key

---

## 🎯 Choose Your Deployment Method

### Method 1: Local (No Docker) - ⭐ Recommended if Docker not installed

```bash
# 1. Set your API key in backend/.env (see above)

# 2. Install dependencies
npm install --workspaces --include-workspace-root

# 3. Build everything
cd backend && npm run build && cd ..
cd frontend && npm run build && cd ..

# 4. Start backend (Terminal 1)
cd backend
npm run start:prod

# 5. Start frontend (Terminal 2)
cd frontend
npm run start

# 6. Access:
#    Frontend: http://localhost:3000
#    Backend:  http://localhost:4000
#    Health:   http://localhost:4000/api/health
```

**Or use the script:**
```bash
./scripts/local-deploy.sh
```

---

### Method 2: Docker (If you install Docker)

```bash
# 1. Install Docker Desktop from docker.com

# 2. Set your API key in backend/.env

# 3. Deploy
./scripts/quick-deploy.sh

# Access at http://localhost:3000
```

---

### Method 3: Vercel (Cloud - Easiest)

**Backend:**
```bash
npm i -g vercel
cd backend
npm run build
vercel --prod
# Add env vars in Vercel dashboard
```

**Frontend:**
- Go to vercel.com
- Import GitHub repo
- Set root to `frontend`
- Add `NEXT_PUBLIC_BACKEND_URL` env var
- Deploy

---

## ✅ Quick Verification

After starting services:

```bash
# Test health check
curl http://localhost:4000/api/health

# Should return JSON with "status": "ok"
```

---

## 📚 Need Help?

- **Local deployment:** See `DEPLOY_LOCAL.md`
- **Docker deployment:** See `DEPLOY_NOW.md`
- **Vercel deployment:** See `DEPLOYMENT_STEPS.md`
- **All options:** See `DEPLOYMENT.md`

---

## 🎉 Ready!

Once services are running:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Health Check: http://localhost:4000/api/health

**Don't forget to set your ANTHROPIC_API_KEY in backend/.env!**


