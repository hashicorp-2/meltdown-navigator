# 🚀 Vercel Deployment - Step by Step Guide

## 📋 Prerequisites
- GitHub account (if your repo is on GitHub)
- Vercel account (free tier works)

---

## 🎯 Step-by-Step Instructions

### Step 1: Sign Up / Login to Vercel

1. **Go to:** https://vercel.com
2. **Click:** "Sign Up" (or "Log In" if you have an account)
3. **Choose:** "Continue with GitHub" (recommended - easiest)
   - This connects your GitHub account to Vercel
   - If you don't have GitHub, you can use email

---

### Step 2: Import Your Project

1. **After logging in**, you'll see the Vercel dashboard
2. **Click:** "Add New..." button (top right)
3. **Select:** "Project" from the dropdown
4. **You'll see:** "Import Git Repository" screen
5. **If your repo is on GitHub:**
   - You'll see a list of your repositories
   - **Search for:** `meltdown-navigator`
   - **Click:** "Import" button next to your repo
6. **If your repo is NOT on GitHub:**
   - Click "Import Third-Party Git Repository"
   - Enter your Git URL
   - Follow the prompts

---

### Step 3: Configure Project Settings

**⚠️ THIS IS THE CRITICAL STEP - Setting Root Directory**

After clicking "Import", you'll see the "Configure Project" screen:

#### A. Project Name
- **Default:** `meltdown-navigator` (you can change this)
- **Leave as is** or customize

#### B. Framework Preset
- **Should auto-detect:** "Next.js"
- **If not:** Select "Next.js" from dropdown

#### C. Root Directory ⚠️ **IMPORTANT**
- **Default:** `/` (root of repo)
- **YOU NEED TO CHANGE THIS:**
  1. **Click** the "Edit" button or pencil icon next to "Root Directory"
  2. **Change from:** `/`
  3. **Change to:** `frontend`
  4. **Press Enter** or click outside to save

#### D. Build and Output Settings
- **Build Command:** `npm run build` (should auto-fill)
- **Output Directory:** `.next` (should auto-fill)
- **Install Command:** `npm install` (should auto-fill)

#### E. Environment Variables (Optional)
- **Click:** "Environment Variables" section
- **Add if needed:**
  - **Name:** `NEXT_PUBLIC_BACKEND_URL`
  - **Value:** Your backend URL (e.g., `http://localhost:4000` or your deployed backend)
  - **Click:** "Add"
- **Note:** You can add this later if needed

---

### Step 4: Deploy

1. **Review** all settings (especially Root Directory = `frontend`)
2. **Click:** "Deploy" button (bottom right)
3. **Wait:** 2-5 minutes for build to complete
4. **Watch:** The build logs in real-time

---

### Step 5: Get Your URL

1. **After deployment completes**, you'll see:
   - ✅ "Deployment successful"
   - **Your URL:** `https://meltdown-navigator.vercel.app` (or similar)
2. **Click** the URL to open your app
3. **Share** this URL - it works from anywhere!

---

## 🎨 Visual Guide (What You'll See)

### Screen 1: Import Repository
```
┌─────────────────────────────────────┐
│  Import Git Repository              │
├─────────────────────────────────────┤
│  🔍 Search repositories...           │
│                                     │
│  📦 meltdown-navigator              │
│     [Import]                        │
│                                     │
│  📦 other-repo                      │
│     [Import]                        │
└─────────────────────────────────────┘
```

### Screen 2: Configure Project
```
┌─────────────────────────────────────┐
│  Configure Project                  │
├─────────────────────────────────────┤
│  Project Name:                       │
│  [meltdown-navigator]               │
│                                     │
│  Framework Preset:                  │
│  [Next.js ▼]                        │
│                                     │
│  Root Directory:                    │
│  [/]  ← CHANGE THIS TO [frontend]  │
│                                     │
│  Build Command:                     │
│  [npm run build]                    │
│                                     │
│  Output Directory:                  │
│  [.next]                            │
│                                     │
│  [Environment Variables ▼]          │
│                                     │
│              [Deploy]               │
└─────────────────────────────────────┘
```

---

## ✅ Verification Checklist

Before clicking "Deploy", verify:
- [ ] Root Directory = `frontend` (NOT `/`)
- [ ] Framework = Next.js
- [ ] Build Command = `npm run build`
- [ ] Output Directory = `.next`

---

## 🔧 Troubleshooting

### Issue: Build fails
- **Check:** Root Directory is set to `frontend`
- **Check:** Build logs for specific errors
- **Solution:** Fix errors and redeploy

### Issue: Can't find Root Directory setting
- **Look for:** "Root Directory" or "Project Root" in settings
- **Alternative:** Click "Show Advanced Settings" or "Settings" tab

### Issue: Framework not detected
- **Manually select:** "Next.js" from Framework dropdown

### Issue: Environment variables not working
- **Make sure:** Variable name starts with `NEXT_PUBLIC_` for client-side
- **Redeploy:** After adding environment variables

---

## 📱 After Deployment

1. **Your app is live** at: `https://your-app.vercel.app`
2. **Share the URL** - works on any device
3. **Access from iPhone:**
   - Open Safari
   - Go to your Vercel URL
   - Works immediately!

---

## 🎯 Quick Reference

**Vercel URL:** https://vercel.com
**Root Directory:** `frontend` ⚠️
**Build Command:** `npm run build`
**Output:** `.next`

---

**Ready? Go to https://vercel.com and follow these steps!** 🚀

