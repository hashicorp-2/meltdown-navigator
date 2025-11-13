# 🔧 Fix QR Code Issue

## Problem: "No usable data found" when scanning QR code

This usually means the Expo server needs to be restarted with the correct settings.

---

## ✅ Solution: Restart Expo Server

### Step 1: Stop any running servers

```bash
# Kill any existing Expo servers
lsof -ti :8081 | xargs kill
```

### Step 2: Start Expo with Tunnel Mode

```bash
cd apps/mobile
npx expo start --tunnel
```

**Why tunnel mode?** It creates a public URL that works from your phone even if you're on different networks.

---

## 📱 Alternative: Use LAN Mode (If on Same Network)

If your phone and computer are on the same WiFi:

```bash
cd apps/mobile
npx expo start --lan
```

---

## 🌐 Alternative: Use Web Version

If QR code still doesn't work, use the web version:

```bash
cd apps/mobile
npm run web
```

Then open: **http://localhost:8081**

---

## 🔍 Troubleshooting

### 1. Check if server is running:
```bash
lsof -i :8081
```

### 2. Make sure you see the QR code in terminal:
- The QR code should appear in the terminal
- You should see a URL like `exp://192.168.x.x:8081`

### 3. Try manual connection:
- Open Expo Go app
- Tap "Enter URL manually"
- Enter the URL shown in terminal (starts with `exp://`)

### 4. Check network:
- Make sure phone and computer are on same WiFi (for LAN mode)
- Or use tunnel mode (works from anywhere)

---

## ✅ Quick Fix Command

```bash
cd apps/mobile
lsof -ti :8081 | xargs kill 2>/dev/null
npx expo start --tunnel
```

Wait for QR code to appear, then scan it!

---

**The tunnel mode should fix the QR code issue!** 📱

