# Vercel Monorepo Configuration Fix

## The Problem
Vercel installs from root (correct for monorepos) but tries to detect Next.js from root instead of `apps/web`.

## Solution: Update Vercel Dashboard Settings

### Step 1: General Settings
1. Go to: https://vercel.com/buildyourbrandpower-1433s-projects/web/settings/general
2. **Root Directory**: Leave **EMPTY** (blank)
   - This allows Vercel to access the full monorepo

### Step 2: Build & Development Settings
1. Go to: https://vercel.com/buildyourbrandpower-1433s-projects/web/settings/general
2. Click "Build & Development Settings" tab
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web` ⚠️ **CRITICAL: Set this here**
   - **Build Command**: `cd apps/web && npm run build`
   - **Output Directory**: `apps/web/.next`
   - **Install Command**: `npm install --legacy-peer-deps --workspaces --include-workspace-root`
   - **Development Command**: `cd apps/web && npm run dev`

### Why This Works

1. **General Root Directory = empty**: Vercel clones full repo
2. **Install Command from root**: Installs all workspace dependencies
3. **Build Root Directory = apps/web**: Vercel changes to apps/web before building
4. **Build Command with cd**: Ensures we're in apps/web when building
5. **Output Directory = apps/web/.next**: Points to correct output location

## Alternative: Use vercel.json (Current Setup)

The `apps/web/vercel.json` is already configured with these settings.
Just make sure:
- General Settings > Root Directory = **EMPTY**
- Build Settings > Root Directory = **apps/web**

## Deploy

After fixing settings:
```bash
cd apps/web
vercel --prod
```

Or push to Git - Vercel will auto-deploy.
