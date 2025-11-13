# 🚀 Run These Commands to Deploy

## ✅ Your API Key is Already Set!

Your Anthropic API key is configured in `backend/.env`.

---

## 📋 Step-by-Step Commands

**Copy and paste these commands one by one into your terminal:**

### Step 1: Setup nvm (if not already done)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload your shell configuration
source ~/.zshrc
# OR if using bash:
# source ~/.bashrc
```

### Step 2: Install and Use Node.js 20

```bash
# Install Node.js 20
nvm install 20

# Use Node.js 20
nvm use 20

# Set as default
nvm alias default 20

# Verify it works
node --version
npm --version
```

### Step 3: Navigate to Project

```bash
cd /Users/ogowemr/meltdown-navigator
```

### Step 4: Install Dependencies

```bash
npm install --workspaces --include-workspace-root
```

### Step 5: Build Backend

```bash
cd backend
npm run build
cd ..
```

### Step 6: Build Frontend

```bash
cd frontend
npm run build
cd ..
```

### Step 7: Start Services

**Open TWO terminal windows:**

**Terminal 1 - Backend:**
```bash
cd /Users/ogowemr/meltdown-navigator/backend
npm run start:prod
```

**Terminal 2 - Frontend:**
```bash
cd /Users/ogowemr/meltdown-navigator/frontend
npm run start
```

### Step 8: Test

```bash
# Health check
curl http://localhost:4000/api/health

# Open in browser
open http://localhost:3000
```

---

## 🎯 Quick Copy-Paste (All at Once)

If you want to run everything:

```bash
# Setup nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.zshrc

# Install Node
nvm install 20
nvm use 20
nvm alias default 20

# Deploy
cd /Users/ogowemr/meltdown-navigator
npm install --workspaces --include-workspace-root
cd backend && npm run build && cd ..
cd frontend && npm run build && cd ..

# Then start in separate terminals:
# Terminal 1: cd /Users/ogowemr/meltdown-navigator/backend && npm run start:prod
# Terminal 2: cd /Users/ogowemr/meltdown-navigator/frontend && npm run start
```

---

## ✅ What You'll See

After starting services:

- **Backend:** Running on http://localhost:4000
- **Frontend:** Running on http://localhost:3000
- **Health Check:** http://localhost:4000/api/health returns JSON

---

## 🎉 Success!

Once both services are running:
1. Open http://localhost:3000 in your browser
2. Go to `/onboarding` to create a profile
3. Use `/` to test the translator

**Your API key is already configured - just run the commands above!**


