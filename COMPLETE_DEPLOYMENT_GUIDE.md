# 🚀 Complete Deployment Guide

## 🎯 Get Shareable Links for Both Apps

---

## ✅ Option 1: Vercel (Web Frontend) - 5 Minutes

### Quick Steps:

1. **Go to:** https://vercel.com
2. **Sign up/Login** (use GitHub - easiest)
3. **Add New → Project**
4. **Import** your `meltdown-navigator` repository
5. **Configure:**
   - **Root Directory:** `frontend` ⚠️ (IMPORTANT - change from `/`)
   - Framework: Next.js (auto-detected)
   - Build Command: `npm run build` (default)
6. **Environment Variables:**
   - `NEXT_PUBLIC_BACKEND_URL` = (your backend URL if deployed)
7. **Click "Deploy"**
8. **Wait 2-3 minutes**
9. **Get URL:** `https://your-app.vercel.app`

**✅ Done! Share this URL - works from anywhere!**

---

## ☁️ Option 2: Expo Cloud (Mobile App) - 10 Minutes

### Quick Steps:

1. **Login to Expo:**
   ```bash
   cd apps/mobile
   npx expo login
   ```
   - Create account if needed (free)
   - Or sign up at https://expo.dev first

2. **Publish App:**
   ```bash
   npx expo publish
   ```

3. **Get Shareable Link:**
   - URL: `https://expo.dev/@yourusername/mobile`
   - QR Code: Scan with Expo Go
   - Works from anywhere!

**✅ Done! Share this link - works on any device!**

---

## 🎯 Recommended Order

1. **Deploy to Vercel first** (5 min, easiest)
   - Get web app URL
   - Works immediately

2. **Then deploy to Expo Cloud** (10 min)
   - Get mobile app URL
   - Works in Expo Go

---

## 📱 Access from iPhone

**After Vercel deployment:**
- Open Safari
- Go to: `https://your-app.vercel.app`
- Works immediately!

**After Expo Cloud deployment:**
- Open Expo Go app
- Go to: `https://expo.dev/@username/mobile`
- Or scan QR code

---

## 🔧 If You Need Backend Too

**Deploy backend to:**
- **Vercel** (add another project, root: `backend`)
- **Railway** (railway.app - easy deployment)
- **Render** (render.com - free tier)

---

## ✅ Quick Checklist

**Vercel:**
- [ ] Sign up at vercel.com
- [ ] Import repo
- [ ] Set root to `frontend`
- [ ] Deploy
- [ ] Get URL

**Expo Cloud:**
- [ ] `npx expo login`
- [ ] `npx expo publish`
- [ ] Get URL

---

**Start with Vercel - it's the fastest way to get a shareable link!** 🚀

