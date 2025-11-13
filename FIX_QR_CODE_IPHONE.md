# 🔧 Fix QR Code for iPhone

## Problem: "No usable data" when scanning QR code

This usually means the QR code isn't being generated correctly or the URL format is wrong.

---

## ✅ Solution 1: Use Direct URL (Easiest)

**Instead of scanning QR code, enter the URL manually:**

### In Expo Go App:
1. Open **Expo Go** app
2. Tap **"Enter URL manually"** (at the bottom)
3. Enter: `exp://10.0.0.144:8081`
4. Tap **"Connect"**

---

## ✅ Solution 2: Use Safari Browser

**Skip Expo Go entirely and use Safari:**

1. Open **Safari** on iPhone
2. Go to: `http://10.0.0.144:8081`
3. The app loads in browser!

---

## ✅ Solution 3: Check Terminal for Correct URL

Look in your terminal for a line like:
```
Metro waiting on exp://10.0.0.144:8081
```

Copy that **exact URL** and enter it manually in Expo Go.

---

## 🔧 Why QR Code Might Not Work

1. **QR code format issue** - Sometimes Expo generates invalid QR codes
2. **Network issue** - Phone and computer not on same WiFi
3. **Expo Go version** - Try updating Expo Go app

---

## 🚀 Recommended: Use Safari Browser

**Easiest solution - no QR code needed:**

1. Make sure Expo is running: `npx expo start --lan`
2. On iPhone, open Safari
3. Go to: `http://10.0.0.144:8081`
4. Done!

---

## 📋 Quick Steps

**For Safari (Recommended):**
```
http://10.0.0.144:8081
```

**For Expo Go (Manual Entry):**
```
exp://10.0.0.144:8081
```

---

**Try the Safari browser method - it's the easiest and doesn't need QR code!** 🌐

