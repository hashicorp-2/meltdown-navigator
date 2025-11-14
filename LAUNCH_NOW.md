# 🚀 LAUNCH NOW - Your API Key is Set!

## ✅ Status

- ✅ **API Key Configured** - Your Anthropic API key is set in `backend/.env`
- ⚠️ **Node.js Issue** - Need to fix Node.js compatibility

---

## 🎯 Quick Launch (Choose One)

### Option 1: Fix Node.js & Deploy Locally (Recommended)

**Run this script:**
```bash
./scripts/fix-node-and-deploy.sh
```

This will:
1. Install/use nvm (Node Version Manager)
2. Install Node.js 20
3. Install all dependencies
4. Build backend and frontend
5. Give you commands to start services

**Then start services:**
```bash
# Terminal 1
cd backend && npm run start:prod

# Terminal 2  
cd frontend && npm run start
```

**Access:** http://localhost:3000

---

### Option 2: Deploy to Vercel (No Local Node.js Needed)

**Backend:**
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add Environment Variables:
   - `ANTHROPIC_API_KEY` = `your-anthropic-api-key-here`
   - `MONGODB_URI` = (your MongoDB URI)
   - `NODE_ENV` = `production`
6. Click "Deploy"

**Frontend:**
1. In Vercel, add another project
2. Same repository, but:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (default)
3. Add Environment Variable:
   - `NEXT_PUBLIC_BACKEND_URL` = (your backend URL from step above)
4. Click "Deploy"

**Done!** Your app will be live on Vercel URLs.

---

### Option 3: Manual Node.js Fix

```bash
# 1. Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 2. Reload shell
source ~/.zshrc

# 3. Install Node.js 20
nvm install 20
nvm use 20

# 4. Verify
node --version  # Should show v20.x.x

# 5. Deploy
cd /Users/ogowemr/meltdown-navigator
npm install --workspaces --include-workspace-root
cd backend && npm run build && cd ..
cd frontend && npm run build && cd ..

# 6. Start (in separate terminals)
# Terminal 1: cd backend && npm run start:prod
# Terminal 2: cd frontend && npm run start
```

---

## ✅ What's Ready

- ✅ API key configured
- ✅ All code ready
- ✅ Deployment configs ready
- ✅ Scripts ready
- ⚠️ Just need working Node.js

---

## 🎉 Recommended: Use the Fix Script

```bash
./scripts/fix-node-and-deploy.sh
```

This handles everything automatically!

---

## 📍 After Deployment

- **Frontend:** http://localhost:3000 (or your Vercel URL)
- **Backend:** http://localhost:4000 (or your Vercel URL)
- **Health Check:** http://localhost:4000/api/health

---

**Your API key is set! Just fix Node.js or deploy to cloud!** 🚀


