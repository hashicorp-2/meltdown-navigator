# 📱 Start Mobile App with Working QR Code

## ✅ Solution: Use LAN Mode

The QR code issue is usually because the server needs to be started with the right mode.

---

## 🚀 Quick Start (Run This)

**Open a terminal and run:**

```bash
cd apps/mobile
npx expo start --lan
```

**This will:**
1. Start the Expo dev server
2. Show a QR code in your terminal
3. Display a URL like `exp://192.168.x.x:8081`

---

## 📱 Then Scan QR Code

1. **Open Expo Go app** on your phone
2. **Tap "Scan QR Code"**
3. **Scan the QR code** from your terminal
4. **The app will load!**

---

## 🔧 If QR Code Still Doesn't Work

### Option 1: Enter URL Manually

1. In Expo Go app, tap **"Enter URL manually"**
2. Copy the URL from terminal (starts with `exp://`)
3. Paste it and connect

### Option 2: Use Web Version (No QR Code)

```bash
cd apps/mobile
npm run web
```

Then open: **http://localhost:8081** in your browser

---

## ⚠️ Important: Same WiFi Network

For LAN mode to work:
- ✅ Your phone and computer must be on the **same WiFi network**
- ✅ Make sure both are connected to the same router

---

## 🌐 Alternative: Tunnel Mode (Works from Anywhere)

If you're on different networks:

```bash
cd apps/mobile
npm install -g @expo/ngrok
npx expo start --tunnel
```

This creates a public URL that works from anywhere.

---

## ✅ Quick Commands

**LAN Mode (Same WiFi):**
```bash
cd apps/mobile
npx expo start --lan
```

**Web Version (No Phone Needed):**
```bash
cd apps/mobile
npm run web
# Then open: http://localhost:8081
```

**Tunnel Mode (Any Network):**
```bash
cd apps/mobile
npm install -g @expo/ngrok
npx expo start --tunnel
```

---

**Run `npx expo start --lan` and scan the QR code that appears!** 📱

