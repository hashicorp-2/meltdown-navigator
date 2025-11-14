# Final Vercel Configuration Fix

## The Issue
Vercel can't find Next.js because:
- It installs from root (correct for monorepos)
- But then looks for Next.js in root instead of `apps/web`

## Solution: Configure Vercel Dashboard

### Step 1: General Settings
**URL:** https://vercel.com/buildyourbrandpower-1433s-projects/web/settings/general

- **Root Directory**: Leave **EMPTY** (blank)
  - This is critical - must be empty!

### Step 2: Build & Development Settings  
**URL:** https://vercel.com/buildyourbrandpower-1433s-projects/web/settings/general (click "Build & Development Settings" tab)

Configure exactly:
- **Framework Preset**: Next.js
- **Root Directory**: `apps/web` ⚠️ **MUST SET THIS**
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `cd ../.. && npm install --legacy-peer-deps --workspaces --include-workspace-root && cd apps/web`
- **Development Command**: `npm run dev`

## How It Works

1. **General Root Directory = empty**: Vercel clones full repo, stays at root
2. **Build Root Directory = apps/web**: Vercel changes to `apps/web` directory
3. **Install Command**: 
   - `cd ../..` - Goes back to repo root
   - `npm install --workspaces` - Installs all workspace dependencies
   - `cd apps/web` - Returns to apps/web for build
4. **Build Command**: Runs from `apps/web` (finds Next.js)
5. **Output Directory**: `.next` relative to `apps/web`

## Deploy

After updating settings, deploy:
```bash
cd apps/web
vercel --prod
```

Or push to Git - Vercel will auto-deploy with new settings.

## Verify

After deployment, check build logs:
- Should see "Installing dependencies from root"
- Should see "Building Next.js app"
- Should complete successfully
