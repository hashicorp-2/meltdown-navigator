# 🚀 Deployment Instructions - Follow These Steps

## ⚠️ IMPORTANT: Set Your API Key First!

**Before deploying, you MUST set your Anthropic API key:**

1. Get your API key from: https://console.anthropic.com/
2. Create `backend/.env` file:
   ```bash
   cp backend/.env.template backend/.env
   ```
3. Edit `backend/.env` and replace `your_anthropic_api_key_here` with your actual key

---

## 🎯 Deployment Options

### Option 1: Local Deployment (Recommended - No Docker Needed)

**Step 1: Set Environment Variables**

```bash
# Create .env file from template
cp backend/.env.template backend/.env

# Edit backend/.env and add your ANTHROPIC_API_KEY
# Use your preferred editor:
nano backend/.env
# or
vim backend/.env
# or
code backend/.env
```

**Step 2: Install Dependencies**

```bash
npm install --workspaces --include-workspace-root
```

**Step 3: Build Backend**

```bash
cd backend
npm run build
cd ..
```

**Step 4: Build Frontend**

```bash
cd frontend
npm run build
cd ..
```

**Step 5: Start Services**

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:prod
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run start
```

**Step 6: Verify**

```bash
# Test health check
curl http://localhost:4000/api/health

# Open in browser
open http://localhost:3000
```

---

### Option 2: Use Deployment Script

```bash
# Make sure backend/.env exists with your API key
./scripts/local-deploy.sh
```

---

### Option 3: Install Docker and Use Docker Compose

If you want to use Docker:

1. **Install Docker Desktop:**
   - macOS: Download from https://www.docker.com/products/docker-desktop
   - Or: `brew install --cask docker`

2. **Start Docker Desktop**

3. **Deploy:**
   ```bash
   # Set your API key in backend/.env
   ./scripts/quick-deploy.sh
   ```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Backend health check works: `curl http://localhost:4000/api/health`
- [ ] Frontend loads: http://localhost:3000
- [ ] Onboarding works: http://localhost:3000/onboarding
- [ ] Translator works: http://localhost:3000

---

## 📋 Environment File Setup

### Backend (.env)

Create `backend/.env` with:

```env
# REQUIRED
ANTHROPIC_API_KEY=sk-ant-api03-...your-actual-key...

# OPTIONAL (for profile features)
MONGODB_URI=mongodb://localhost:27017/meltdown-navigator

# OPTIONAL
PORT=4000
NODE_ENV=development
```

### Frontend (.env.local)

Create `frontend/.env.local` (optional for local dev):

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

---

## 🐛 Troubleshooting

### Node.js Issues

If you see Node.js errors, try:
```bash
# Use nvm to manage Node versions
nvm install 20
nvm use 20
```

### Port Already in Use

```bash
# Find what's using the port
lsof -i :4000
lsof -i :3000

# Kill the process or change PORT in .env
```

### Build Fails

```bash
# Clean and reinstall
rm -rf node_modules backend/node_modules frontend/node_modules
npm install --workspaces --include-workspace-root
```

---

## 🎉 Success!

Once everything is running:

- ✅ Backend: http://localhost:4000
- ✅ Frontend: http://localhost:3000
- ✅ Health: http://localhost:4000/api/health

**Your app is ready to use!**

---

## 📚 Additional Resources

- `DEPLOY_LOCAL.md` - Detailed local deployment guide
- `DEPLOYMENT.md` - Complete deployment guide with all options
- `START_HERE.md` - Quick start guide

---

**Next Step:** Set your `ANTHROPIC_API_KEY` in `backend/.env` and start deploying!


