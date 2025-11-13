# 🚀 DEPLOY NOW - Your API Key is Set!

## ✅ Ready to Deploy

Your Anthropic API key is configured in `backend/.env`.

---

## ⚡ Quick Deploy (Copy These Commands)

**Run these in your terminal:**

```bash
# 1. Setup nvm and Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.zshrc
nvm install 20
nvm use 20

# 2. Install dependencies
cd /Users/ogowemr/meltdown-navigator
npm install --workspaces --include-workspace-root

# 3. Build
cd backend && npm run build && cd ..
cd frontend && npm run build && cd ..

# 4. Start backend (Terminal 1)
cd backend && npm run start:prod

# 5. Start frontend (Terminal 2 - new terminal window)
cd frontend && npm run start
```

---

## 📍 Access Your App

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **Health Check:** http://localhost:4000/api/health

---

## ✅ Verification

```bash
# Test health check
curl http://localhost:4000/api/health

# Should return:
# {"status":"ok","timestamp":"...","services":{"database":"...","ai":"configured"}}
```

---

## 🎉 That's It!

Your API key is set. Just run the commands above and your app will be live!

**Need help?** See `RUN_THESE_COMMANDS.md` for detailed step-by-step instructions.


