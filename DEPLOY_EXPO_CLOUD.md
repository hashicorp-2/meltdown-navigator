# ☁️ Deploy to Expo Cloud - Shareable Link

## 🎯 Goal: Create a link that works from anywhere

This creates a public URL that works on any device, anywhere, without needing to be on the same network.

---

## ✅ Step-by-Step Deployment

### Step 1: Install Expo CLI (if needed)

```bash
npm install -g expo-cli
```

Or use npx (no install needed):
```bash
npx expo-cli --version
```

---

### Step 2: Login to Expo

```bash
cd apps/mobile
npx expo login
```

**If you don't have an account:**
- It will prompt you to create one (free)
- Or go to https://expo.dev and sign up first

---

### Step 3: Publish to Expo

```bash
cd apps/mobile
npx expo publish
```

**Or for web-only:**
```bash
npx expo publish --web
```

---

### Step 4: Get Your Shareable Link

After publishing, you'll get:
- A URL like: `https://expo.dev/@yourusername/mobile`
- A QR code you can scan
- A shareable link that works from anywhere!

---

## 🌐 Alternative: Use EAS (Expo Application Services)

**Newer method - more reliable:**

### Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

### Step 2: Login

```bash
eas login
```

### Step 3: Configure

```bash
cd apps/mobile
eas build:configure
```

### Step 4: Build and Share

```bash
eas build --platform web
```

This creates a shareable web link!

---

## 🚀 Quickest: Use Vercel (Web Frontend)

**Even easier - deploy the web frontend:**

1. **Go to vercel.com**
2. **Import your GitHub repo**
3. **Set root directory:** `frontend`
4. **Deploy!**
5. **Get a public URL** like: `https://your-app.vercel.app`

**This is the fastest way to get a shareable link!**

---

## 📋 Comparison

| Method | Difficulty | Time | Result |
|--------|-----------|------|--------|
| Vercel (Web) | ⭐ Easy | 5 min | Public URL |
| Expo Publish | ⭐⭐ Medium | 10 min | Expo URL |
| EAS Build | ⭐⭐⭐ Hard | 15 min | Shareable link |

---

## 🎯 Recommended: Deploy Web Frontend to Vercel

**This is the fastest and easiest:**

1. Go to **vercel.com**
2. **Sign up** (free)
3. **Import** your GitHub repo
4. **Set root:** `frontend`
5. **Deploy!**
6. **Get URL:** `https://your-app.vercel.app`

**Done in 5 minutes!**

---

**Let me know which method you prefer and I'll guide you through it!** ☁️

