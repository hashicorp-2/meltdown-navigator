# 🚀 Deploy Now - Step by Step

## ✅ Status: Frontend Build Fixed & Ready!

---

## 🌐 Option 1: Deploy Web to Vercel (5 minutes)

### Steps:

1. **Go to:** https://vercel.com
2. **Sign up/Login** (use GitHub - easiest)
3. **Click:** "Add New" → "Project"
4. **Import** your `meltdown-navigator` repository
5. **Configure:**
   - **Root Directory:** `frontend` ⚠️ (IMPORTANT - change from `/`)
   - Framework: Next.js (auto-detected)
   - Build Command: `npm run build` (default)
6. **Environment Variables** (optional):
   - `NEXT_PUBLIC_BACKEND_URL` = (your backend URL if deployed)
7. **Click "Deploy"**
8. **Wait 2-3 minutes**
9. **Get URL:** `https://your-app.vercel.app`

**✅ Share this URL - works from anywhere!**

---

## 📱 Option 2: Deploy Mobile to Expo (10 minutes)

### Method A: Expo Go (Easiest - Shareable Link)

1. **Open Terminal:**
   ```bash
   cd apps/mobile
   ```

2. **Login to Expo:**
   ```bash
   npx expo login
   ```
   - Create account if needed (free at https://expo.dev)
   - Enter email/password when prompted

3. **Publish:**
   ```bash
   npx expo publish
   ```

4. **Get Shareable Link:**
   - URL: `https://expo.dev/@yourusername/mobile`
   - QR Code: Scan with Expo Go app
   - Works from anywhere!

### Method B: EAS Build (For App Store)

If you want to build for App Store/Play Store:
```bash
cd apps/mobile
npm install -g eas-cli
eas login
eas build --platform ios
eas build --platform android
```

---

## 🎯 Recommended: Do Both!

1. **Deploy to Vercel first** (5 min) → Get web URL
2. **Deploy to Expo** (10 min) → Get mobile URL

---

## 📱 Access from iPhone

**After Vercel:**
- Open Safari
- Go to: `https://your-app.vercel.app`
- Works immediately!

**After Expo:**
- Open Expo Go app
- Go to: `https://expo.dev/@username/mobile`
- Or scan QR code

---

## ✅ Quick Checklist

**Vercel:**
- [ ] Sign up at vercel.com
- [ ] Import repo
- [ ] Set root to `frontend`
- [ ] Deploy
- [ ] Get URL

**Expo:**
- [ ] `cd apps/mobile`
- [ ] `npx expo login`
- [ ] `npx expo publish`
- [ ] Get URL

---

**Start with Vercel - it's the fastest!** 🚀
