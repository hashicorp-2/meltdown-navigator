# 📱 iPhone 14 - Expo Go Solutions

## ⚠️ Problem: No Manual URL Entry Option

Newer versions of Expo Go on iPhone 14 don't always show the manual URL entry option. Here are solutions:

---

## ✅ Solution 1: Use Safari Browser (Easiest - Recommended)

**Skip Expo Go entirely and use Safari:**

1. **Open Safari** on your iPhone 14
2. **Go to:** `http://10.0.0.144:8081`
3. **Done!** The app loads in Safari

**This is the easiest solution and doesn't require Expo Go at all!**

---

## ✅ Solution 2: Use Tunnel Mode (Better QR Code)

Tunnel mode creates a public URL that works from anywhere and generates a better QR code.

### Start with Tunnel:
```bash
cd apps/mobile
npm install -g @expo/ngrok
npx expo start --tunnel
```

### Then:
1. **Wait for QR code** to appear in terminal
2. **Scan with Expo Go** - tunnel QR codes work better
3. **Or use the URL** shown (starts with `exp://`)

---

## ✅ Solution 3: Find Hidden Manual Entry

In Expo Go app, try:
1. **Tap the profile icon** (top right)
2. **Look for "Enter URL"** or "Connect" option
3. **Or tap the "+" button** (if visible)
4. **Or shake your phone** - some versions have a dev menu

---

## ✅ Solution 4: Use Web Version in Safari

**Best option - no Expo Go needed:**

1. **Make sure Expo is running:**
   ```bash
   cd apps/mobile
   npx expo start --lan
   ```

2. **On iPhone Safari, go to:**
   ```
   http://10.0.0.144:8081
   ```

3. **The app loads directly in Safari!**

---

## 🎯 Recommended: Use Safari

**Why Safari is best:**
- ✅ No app needed
- ✅ No sign-up needed
- ✅ No QR code needed
- ✅ Works immediately
- ✅ Better performance

**Just open Safari and go to:**
```
http://10.0.0.144:8081
```

---

## 🔧 If Safari Doesn't Work

1. **Check Expo is running:**
   ```bash
   cd apps/mobile
   npx expo start --lan
   ```

2. **Wait for "Metro Bundler" to start**

3. **Make sure same WiFi network**

4. **Try hard refresh in Safari:**
   - Tap the address bar
   - Tap "Go"

---

**Use Safari browser - it's the easiest solution for iPhone 14!** 🌐

