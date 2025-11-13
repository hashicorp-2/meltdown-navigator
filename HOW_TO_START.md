# 🚀 How to Start the App

## Quick Start

Run this command to start both services:

```bash
./START_SERVICES.sh
```

Or start them manually:

---

## Manual Start (Two Terminals)

### Terminal 1 - Backend:

```bash
cd /Users/ogowemr/meltdown-navigator
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"
nvm use 20
cd backend
node dist/index.js
```

### Terminal 2 - Frontend:

```bash
cd /Users/ogowemr/meltdown-navigator
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"
nvm use 20
cd frontend
npm run dev
```

---

## Verify Services Are Running

```bash
# Check backend
curl http://localhost:4000/api/health

# Check frontend
curl http://localhost:3000

# Or open in browser
open http://localhost:3000
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find what's using the port
lsof -i :4000
lsof -i :3000

# Kill the process
lsof -ti :4000 | xargs kill
lsof -ti :3000 | xargs kill
```

### Services Not Starting

Check the logs:
```bash
# Backend logs
tail -f /tmp/backend.log

# Frontend logs  
tail -f /tmp/frontend.log
```

### Frontend Needs Build

If you see "production build not found":
```bash
cd frontend
npm run build
npm run start
```

But for development, use `npm run dev` instead (no build needed).

---

## Access Your App

Once both services are running:

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:4000
- **Health Check:** http://localhost:4000/api/health

---

**The app should be accessible within 10-15 seconds of starting!**

