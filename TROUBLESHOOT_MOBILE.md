# 🔧 Troubleshoot Mobile App - localhost:8081 Unreachable

## Quick Fix Steps

### Step 1: Kill Any Existing Processes
```bash
lsof -ti :8081 | xargs kill
```

### Step 2: Start Fresh
```bash
cd apps/mobile
npm run web
```

### Step 3: Wait for "Ready" Message
Wait until you see:
- "Web Bundled" or
- "Ready" or
- "Waiting on http://localhost:8081"

### Step 4: Open Browser
Then open: **http://localhost:8081**

---

## Alternative: Check What Port It's Using

Sometimes Expo uses a different port. Check the terminal output for:
- "Metro waiting on..."
- "Web server running on..."
- Any port number shown

---

## Alternative: Use Expo Start (Not Web)

Try starting without `--web` flag:

```bash
cd apps/mobile
npm run start
```

Then:
1. Press `w` in the terminal to open web version
2. Or scan QR code for phone

---

## Check for Errors

Look in the terminal for:
- Red error messages
- "Failed to start"
- "Port already in use"
- Any compilation errors

---

## Full Restart

```bash
# Kill everything
lsof -ti :8081 | xargs kill
pkill -f "expo start"

# Start fresh
cd apps/mobile
npm run web
```

---

**The server is restarting now. Check the terminal output for the actual port/URL!**

