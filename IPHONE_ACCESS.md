# 📱 Access Mobile App from iPhone

## ⚠️ Important: localhost Doesn't Work on iPhone!

When accessing from your iPhone, you **cannot** use `localhost` or `127.0.0.1` because that refers to the iPhone itself, not your computer.

---

## ✅ Solution: Use Your Computer's IP Address

### Step 1: Find Your Computer's IP Address

Run this command:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Or check in System Settings → Network

### Step 2: Use the IP Address

Instead of `http://localhost:8081`, use:
```
http://YOUR_IP_ADDRESS:8081
```

Example: `http://192.168.1.100:8081`

---

## 🚀 Best Option: Use Expo Go App

### Step 1: Install Expo Go
- Open App Store on iPhone
- Search "Expo Go"
- Install it

### Step 2: Start Expo with LAN Mode
```bash
cd apps/mobile
npx expo start --lan
```

### Step 3: Scan QR Code
- Open Expo Go app
- Tap "Scan QR Code"
- Scan the QR code from your terminal
- App loads automatically!

---

## 🌐 Alternative: Web Browser on iPhone

### Step 1: Start with LAN Mode
```bash
cd apps/mobile
npx expo start --lan
```

### Step 2: Get Your IP
Look in terminal for something like:
```
Metro waiting on exp://192.168.1.100:8081
```

### Step 3: Open on iPhone
In Safari on iPhone, go to:
```
http://192.168.1.100:8081
```
(Replace with your actual IP)

---

## ⚠️ Requirements

1. **Same WiFi Network**
   - iPhone and computer must be on the **same WiFi**
   - Cannot use cellular data

2. **Firewall**
   - Make sure firewall allows connections on port 8081
   - macOS: System Settings → Network → Firewall

---

## 🔧 Quick Commands

**For Expo Go (Recommended):**
```bash
cd apps/mobile
npx expo start --lan
# Then scan QR code with Expo Go app
```

**For Web Browser:**
```bash
cd apps/mobile
npx expo start --lan
# Then use http://YOUR_IP:8081 on iPhone
```

---

**The Expo server is starting with LAN mode. Check the terminal for your IP address and QR code!** 📱

