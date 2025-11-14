# Quick Fix for Vercel Deployment

## The Problem
Vercel dashboard has Root Directory = `apps/web` in General settings, causing path conflicts.

## Quick Fix (2 minutes)

### Option 1: Fix Dashboard Settings (Recommended)

1. **Go to:** https://vercel.com/buildyourbrandpower-1433s-projects/web/settings/general

2. **Clear Root Directory:**
   - Find "Root Directory" field
   - **Delete/clear the value** (make it empty/blank)
   - Click "Save"

3. **Go to:** Settings > Build & Development Settings

4. **Set Root Directory here:**
   - Root Directory: `apps/web`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install --legacy-peer-deps`

5. **Deploy:**
   ```bash
   cd apps/web
   vercel --prod
   ```

### Option 2: Use Deployment Script

From project root:
```bash
./deploy-vercel.sh
```

This script:
- Builds agents package
- Deploys web app
- Handles paths correctly

## Why This Works

- **General Root Directory = empty**: Vercel clones full repo
- **Build Root Directory = apps/web**: Vercel builds from correct location
- **prebuild script**: Automatically builds agents package before Next.js

## Test Locally First

```bash
cd apps/web
npm run build
```

If this works, Vercel deployment will work too!
