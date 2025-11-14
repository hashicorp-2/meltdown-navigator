# ⚡ Fast Deploy - Skip the Wait!

## 🎯 Quickest Path to Running App

Since the automated script is taking time, here's the **fastest way** to get your app running:

---

## Option 1: Deploy to Vercel (5 minutes - No Local Setup)

**This is the FASTEST option - no Node.js issues, no waiting!**

### Backend:
1. Go to [vercel.com](https://vercel.com) → Sign in
2. "Add New" → "Project" → Import GitHub repo
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Environment Variables:
   - `ANTHROPIC_API_KEY` = `your-anthropic-api-key-here`
   - `MONGODB_URI` = (your MongoDB URI or leave empty for now)
   - `NODE_ENV` = `production`
5. Click "Deploy" → Wait 2-3 minutes → **Done!**

### Frontend:
1. In Vercel, "Add New" → "Project" → Same repo
2. Settings:
   - **Root Directory:** `frontend`
3. Environment Variable:
   - `NEXT_PUBLIC_BACKEND_URL` = (your backend URL from step above)
4. Click "Deploy" → **Done!**

**Total time: ~5 minutes, and it's live on the internet!**

---

## Option 2: Check if Services Are Already Running

Maybe they're already running? Check:

```bash
# Check if backend is running
curl http://localhost:4000/api/health

# Check if frontend is running  
curl http://localhost:3000

# Check what's on the ports
lsof -i :4000
lsof -i :3000
```

If they're running, just open http://localhost:3000 in your browser!

---

## Option 3: Start Services Manually (If Builds Are Done)

If the builds completed but services aren't running:

**Terminal 1:**
```bash
cd /Users/ogowemr/meltdown-navigator/backend
npm run start:prod
```

**Terminal 2:**
```bash
cd /Users/ogowemr/meltdown-navigator/frontend  
npm run start
```

Then open http://localhost:3000

---

## ⚡ Recommended: Use Vercel

**Why Vercel is fastest:**
- ✅ No local Node.js issues
- ✅ No waiting for builds
- ✅ Automatic deployments
- ✅ Free hosting
- ✅ HTTPS included
- ✅ Your app is live on the internet

**Time: 5 minutes vs potentially hours fixing local setup**

---

## 🎯 What to Do Right Now

1. **Check if services are running:**
   ```bash
   curl http://localhost:4000/api/health
   open http://localhost:3000
   ```

2. **If not running, deploy to Vercel** (fastest option)

3. **Or wait for builds to complete**, then start services manually

---

**Your API key is set - you're 5 minutes away from a live app on Vercel!** 🚀


