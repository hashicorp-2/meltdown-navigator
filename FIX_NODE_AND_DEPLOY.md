# 🔧 Fix Node.js & Deploy - Quick Guide

## ✅ Good News: API Key is Set!

Your API key has been successfully configured in `backend/.env`.

---

## ⚠️ Issue: Node.js Compatibility Problem

Your system's Node.js has a compatibility issue. Here's how to fix it:

### Quick Fix (5 minutes):

```bash
# 1. Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 2. Reload your shell
source ~/.zshrc  # or source ~/.bashrc

# 3. Install Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# 4. Verify it works
node --version
npm --version

# 5. Now deploy!
cd /Users/ogowemr/meltdown-navigator
npm install --workspaces --include-workspace-root
cd backend && npm run build && cd ..
cd frontend && npm run build && cd ..
```

---

## 🚀 After Node.js is Fixed

### Start Services:

**Terminal 1:**
```bash
cd /Users/ogowemr/meltdown-navigator/backend
npm run start:prod
```

**Terminal 2:**
```bash
cd /Users/ogowemr/meltdown-navigator/frontend
npm run start
```

### Test:

```bash
# Health check
curl http://localhost:4000/api/health

# Open browser
open http://localhost:3000
```

---

## ☁️ Alternative: Deploy to Cloud (Skip Local Node.js)

### Vercel Deployment:

1. **Backend:**
   - Go to vercel.com
   - Import GitHub repo
   - Root: `backend`
   - Env vars: `ANTHROPIC_API_KEY` (already have it), `MONGODB_URI`
   - Deploy

2. **Frontend:**
   - Same repo, new project
   - Root: `frontend`
   - Env var: `NEXT_PUBLIC_BACKEND_URL` = backend URL
   - Deploy

**No local Node.js needed!**

---

## ✅ What's Done

- ✅ API key configured
- ✅ All deployment files ready
- ⚠️ Need to fix Node.js OR deploy to cloud

---

**Choose one:**
1. Fix Node.js locally (5 min) → Deploy locally
2. Deploy to Vercel (10 min) → No local setup needed

**Your API key is ready either way!** 🎉


