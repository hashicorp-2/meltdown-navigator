# ⚡ Quick Deploy - 3 Steps

## Step 1: Set Your API Key ⚠️ REQUIRED

```bash
# Create .env file
cp backend/.env.template backend/.env

# Edit and add your API key
nano backend/.env
# Replace: your_anthropic_api_key_here
# With: your actual key from https://console.anthropic.com/
```

## Step 2: Install & Build

```bash
# Install dependencies
npm install --workspaces --include-workspace-root

# Build backend
cd backend && npm run build && cd ..

# Build frontend  
cd frontend && npm run build && cd ..
```

## Step 3: Start Services

**Terminal 1:**
```bash
cd backend
npm run start:prod
```

**Terminal 2:**
```bash
cd frontend
npm run start
```

## ✅ Done!

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- Health: http://localhost:4000/api/health

**Test it:**
```bash
curl http://localhost:4000/api/health
```

---

**That's it! Your app is running!** 🎉


