# Vercel Deployment Configuration Fix

## Current Issue
Vercel can't find Next.js because it's building from the wrong directory or the Root Directory setting is misconfigured.

## Solution: Configure Vercel Dashboard

### Step 1: Go to Project Settings
https://vercel.com/buildyourbrandpower-1433s-projects/web/settings

### Step 2: General Settings
- **Root Directory**: Leave **EMPTY** (blank)
  - This allows Vercel to access the full monorepo

### Step 3: Build & Development Settings
- **Framework Preset**: Next.js
- **Root Directory**: `apps/web` ⚠️ **IMPORTANT: Set this here, not in General**
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install --legacy-peer-deps`
- **Development Command**: `npm run dev`

### Step 4: Environment Variables (Optional)
Add if needed:
- `ANTHROPIC_API_KEY` - For AI features
- `NEXT_PUBLIC_BACKEND_URL` - Backend API URL

## How It Works

1. Vercel clones the **entire repository** (because Root Directory in General is empty)
2. Vercel runs install from **repository root** (gets all workspace dependencies)
3. Vercel changes to **apps/web** directory (because Root Directory in Build Settings = apps/web)
4. Vercel runs `npm run build` which:
   - First runs `prebuild` script (builds agents package)
   - Then runs `next build` (builds Next.js app)
5. Vercel outputs from **apps/web/.next**

## Deploy

After configuring dashboard:
```bash
cd apps/web
vercel --prod
```

Or push to your connected Git branch - Vercel will auto-deploy.

## Verification

After deployment, check:
- Build logs show agents package being built
- Next.js build completes successfully
- Production URL is accessible

## Troubleshooting

If still getting "No Next.js version detected":
1. Verify Root Directory in **Build Settings** = `apps/web`
2. Verify Root Directory in **General Settings** = (empty)
3. Check that `apps/web/package.json` has `next` in dependencies
4. Check build logs for any errors

