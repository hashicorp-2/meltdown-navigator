# 🚀 Deploy Both - Web & Mobile

## ✅ Deploy Web Frontend to Vercel (5 min)

### Steps:

1. **Go to:** https://vercel.com
2. **Sign up/Login** (free)
3. **Add New → Project**
4. **Import** `meltdown-navigator` repo
5. **Settings:**
   - Root Directory: `frontend`
   - Framework: Next.js (auto)
   - Build: `npm run build` (auto)
6. **Environment Variables:**
   - `NEXT_PUBLIC_BACKEND_URL` = (your backend URL or leave empty)
7. **Deploy!**
8. **Get URL:** `https://your-app.vercel.app`

---

## ☁️ Deploy Mobile App to Expo Cloud (10 min)

### Steps:

1. **Login to Expo:**
   ```bash
   cd apps/mobile
   npx expo login
   ```

2. **Publish:**
   ```bash
   npx expo publish
   ```

3. **Get URL:** `https://expo.dev/@username/mobile`

---

## 🎯 Quick Commands

**For Expo Cloud:**
```bash
cd apps/mobile
npx expo login
npx expo publish
```

**For Vercel:**
- Just go to vercel.com and follow the steps above!

---

## 📱 Result

**You'll have TWO shareable links:**
1. **Web:** `https://your-app.vercel.app` (works in any browser)
2. **Mobile:** `https://expo.dev/@username/mobile` (works in Expo Go)

**Both work from anywhere - no local network needed!**

---

**Let's start with Vercel, then do Expo Cloud!** 🚀

