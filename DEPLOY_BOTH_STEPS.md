# 🚀 Deploy Both - Step by Step

## 📱 Part 1: Mobile App (Expo Cloud)

### Step 1: Login to Expo

**Run in terminal:**
```bash
cd /Users/ogowemr/meltdown-navigator/apps/mobile
npx expo login
```

**If you don't have an account:**
- Go to: https://expo.dev
- Sign up (free)
- Then run `npx expo login`

### Step 2: Publish

**After logging in, run:**
```bash
npx expo publish
```

**You'll get:**
- URL: `https://expo.dev/@yourusername/mobile`
- QR Code: Scan with Expo Go
- Shareable link!

---

## 🌐 Part 2: Web Frontend (Vercel)

### Step 1: Go to Vercel

1. **Visit:** https://vercel.com
2. **Sign in** with GitHub (easiest)

### Step 2: Import Project

1. **Click:** "Add New" → "Project"
2. **Find:** `meltdown-navigator` in your repos
3. **Click:** "Import"

### Step 3: Configure (IMPORTANT!)

**On the "Configure Project" screen:**

1. **Project Name:** `meltdown-navigator` (or your choice)
2. **Framework Preset:** Next.js (auto-detected)
3. **Root Directory:** ⚠️ **CHANGE THIS TO:** `frontend`
   - Default will be `/`
   - Click edit/pencil icon
   - Type: `frontend`
   - Press Enter
4. **Build Command:** `npm run build` (default - keep it)
5. **Output Directory:** `.next` (default - keep it)

### Step 4: Environment Variables (Optional)

**Click "Environment Variables" section:**
- **Name:** `NEXT_PUBLIC_BACKEND_URL`
- **Value:** (leave empty for now, or add your backend URL if deployed)
- **Click:** "Add"

### Step 5: Deploy

1. **Review settings** (especially Root Directory = `frontend`)
2. **Click:** "Deploy"
3. **Wait:** 2-5 minutes
4. **Get URL:** `https://your-app.vercel.app`

---

## ✅ Checklist

**Mobile:**
- [ ] `cd apps/mobile`
- [ ] `npx expo login`
- [ ] `npx expo publish`
- [ ] Got URL: `https://expo.dev/@username/mobile`

**Web:**
- [ ] Went to vercel.com
- [ ] Imported repo
- [ ] Set root to `frontend` ⚠️
- [ ] Deployed
- [ ] Got URL: `https://your-app.vercel.app`

---

## 🎯 Result

**You'll have TWO shareable links:**
1. **Web:** `https://your-app.vercel.app` (any browser)
2. **Mobile:** `https://expo.dev/@username/mobile` (Expo Go)

**Both work from anywhere!** 🚀

---

## 💡 Tips

- **Vercel Root Directory:** This is the most common mistake - make sure it's `frontend`!
- **Expo Login:** If login fails, try creating account at expo.dev first
- **Both can run in parallel:** Start Vercel deployment, then do Expo while it builds

---

**Let's start! I'll help with Expo first, then guide you through Vercel.** 🚀

