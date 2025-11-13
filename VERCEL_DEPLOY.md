# 🚀 Deploy to Vercel - Get Shareable Link

## ✅ Quick Deployment Steps

### Step 1: Go to Vercel

1. **Visit:** https://vercel.com
2. **Sign up** (free) or **Sign in** if you have an account
3. **Click "Add New" → "Project"**

---

### Step 2: Import Your Repository

1. **Connect GitHub** (if not already connected)
2. **Select your repository:** `meltdown-navigator`
3. **Click "Import"**

---

### Step 3: Configure Project

**Important Settings:**

- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** `frontend` ⚠️ **Change this!**
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

---

### Step 4: Environment Variables

**Add these environment variables:**

- `NEXT_PUBLIC_BACKEND_URL` = `http://YOUR_BACKEND_URL` or leave empty for now

**If your backend is also deployed:**
- Set `NEXT_PUBLIC_BACKEND_URL` to your backend URL

**If backend is still local:**
- Leave it empty or set to your public backend URL

---

### Step 5: Deploy!

1. **Click "Deploy"**
2. **Wait 2-3 minutes**
3. **Get your URL:** `https://your-app.vercel.app`

---

## 🎉 Result

You'll get a **public URL** like:
```
https://meltdown-navigator.vercel.app
```

**This works from anywhere - iPhone, computer, any network!**

---

## 📱 Access from iPhone

**Just open Safari and go to your Vercel URL!**

No local network needed, no IP addresses, no QR codes!

---

## 🔧 If You Need Backend Too

**Deploy backend to Vercel or Railway:**

1. **Backend on Vercel:**
   - Add another project
   - Root: `backend`
   - Build: `npm run build`
   - Start: `node dist/index.js`

2. **Or use Railway:**
   - Go to railway.app
   - Deploy from GitHub
   - Root: `backend`

---

## ✅ Quick Checklist

- [ ] Sign up/login to Vercel
- [ ] Import GitHub repo
- [ ] Set root directory to `frontend`
- [ ] Add environment variable (if needed)
- [ ] Deploy!
- [ ] Get shareable URL
- [ ] Test on iPhone!

---

**This is the fastest way to get a shareable link!** 🚀

