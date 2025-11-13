# 🔧 Fix Vercel Deployment Dependency Errors

## ❌ Error: `ERESOLVE could not resolve`

This happens when npm can't resolve peer dependency conflicts. The error shows:
- `@langchain/community` conflicts with `openai` versions
- Multiple peer dependency mismatches

---

## ✅ Solution: Use Legacy Peer Deps

I've created `.npmrc` files that tell npm to use `legacy-peer-deps`, which will ignore peer dependency conflicts.

### Files Created:
- ✅ `frontend/.npmrc` - For frontend builds
- ✅ `.npmrc` - For root/workspace builds

---

## 🎯 Vercel Configuration

### Option 1: Automatic (Recommended)

The `.npmrc` files should be automatically detected by Vercel. Just redeploy!

1. **Go to Vercel dashboard**
2. **Click "Redeploy"** on your latest deployment
3. **Or push a new commit:**
   ```bash
   git add frontend/.npmrc .npmrc
   git commit -m "Fix dependency conflicts with legacy-peer-deps"
   git push origin main
   ```

### Option 2: Manual Vercel Settings

If automatic doesn't work, set it in Vercel:

1. **Go to:** Your project → Settings → General
2. **Find:** "Install Command"
3. **Change from:** `npm install`
4. **Change to:** `npm install --legacy-peer-deps`
5. **Save** and redeploy

---

## 🔍 Important: Wrong Repository?

The error shows you're deploying from:
- `github.com/hashicorp-2/whop-app`

But we want to deploy:
- `github.com/hashicorp-2/meltdown-navigator`

### To Fix:

1. **In Vercel:**
   - Go to your project settings
   - Check "Git Repository"
   - Make sure it's `meltdown-navigator`, not `whop-app`

2. **Or create a new project:**
   - Add New → Project
   - Import `meltdown-navigator` (not `whop-app`)
   - Set root to `frontend`
   - Deploy

---

## ✅ Quick Fix Commands

```bash
# Make sure you're in the right repo
cd /Users/ogowemr/meltdown-navigator

# Add the .npmrc files (already created)
git add frontend/.npmrc .npmrc
git commit -m "Fix dependency conflicts"
git push origin main

# Then redeploy on Vercel
```

---

## 📋 Checklist

- [ ] `.npmrc` files created (✅ Done)
- [ ] Committed and pushed to GitHub
- [ ] Vercel project is linked to `meltdown-navigator` (not `whop-app`)
- [ ] Root directory set to `frontend`
- [ ] Redeploy on Vercel

---

**The `.npmrc` files are ready - just commit and push!** 🚀

