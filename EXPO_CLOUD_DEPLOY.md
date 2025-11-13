# ☁️ Deploy Mobile App to Expo Cloud

## 🎯 Create Shareable Link for Mobile App

---

## ✅ Step 1: Login to Expo

```bash
cd apps/mobile
npx expo login
```

**If you don't have an account:**
- It will prompt you to create one (free)
- Or sign up at https://expo.dev first

---

## ✅ Step 2: Publish to Expo

```bash
cd apps/mobile
npx expo publish
```

**This will:**
- Upload your app to Expo's servers
- Create a shareable URL
- Generate a QR code

---

## ✅ Step 3: Get Your Link

After publishing, you'll see:
- **URL:** `https://expo.dev/@yourusername/mobile`
- **QR Code:** Scan with Expo Go
- **Shareable link:** Works from anywhere!

---

## 📱 Access from iPhone

**Option 1: Expo Go App**
1. Install Expo Go
2. Open the published URL
3. Or scan the QR code

**Option 2: Web Version**
- The published URL also works in Safari!

---

## ⚠️ Note: Backend URL

**Make sure to set backend URL in environment:**

The mobile app needs to know where your backend is. You can:
1. **Deploy backend first** (Vercel, Railway, etc.)
2. **Set `EXPO_PUBLIC_BACKEND_URL`** in Expo dashboard
3. **Or update in app.json** before publishing

---

## 🚀 Quick Commands

```bash
# Login
cd apps/mobile
npx expo login

# Publish
npx expo publish

# Get your shareable link!
```

---

**This creates a link that works from anywhere!** ☁️

