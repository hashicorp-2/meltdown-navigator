# Get Deployment Link - Quick Fix

## The Problem
Vercel dashboard has Root Directory = `apps/web` in General settings, causing path conflicts.

## Quick Fix (2 minutes)

### Step 1: Fix Vercel Dashboard Settings

1. **Go to:** https://vercel.com/buildyourbrandpower-1433s-projects/web/settings/general

2. **Clear Root Directory:**
   - Scroll to "Root Directory" field
   - **Delete/clear the value** (make it completely empty/blank)
   - Click "Save"

3. **Go to:** Settings > Build & Development Settings

4. **Set Root Directory here:**
   - Root Directory: `apps/web`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install --legacy-peer-deps`

### Step 2: Deploy

After fixing settings, run:
```bash
cd apps/web
vercel --prod
```

This will give you the deployment link!

## Alternative: Deploy via Git

If you push to your connected Git branch, Vercel will auto-deploy after you fix the settings.

## Current Project
- Project: `buildyourbrandpower-1433s-projects/web`
- Settings: https://vercel.com/buildyourbrandpower-1433s-projects/web/settings
