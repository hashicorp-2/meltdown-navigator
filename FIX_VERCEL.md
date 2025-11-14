# Fix Vercel Deployment

## The Problem
Vercel has Root Directory set to `apps/web`, but when deploying from `apps/web`, it creates a double path: `apps/web/apps/web`

## Solution: Configure Vercel Dashboard

1. **Go to Vercel Dashboard:**
   https://vercel.com/buildyourbrandpower-1433s-projects/web/settings/general

2. **Clear Root Directory:**
   - Settings > General > Root Directory
   - **Set to: (empty)** or **leave blank**
   - This tells Vercel to use the repository root

3. **Configure Build Settings:**
   - Settings > Build & Development Settings
   - Framework: Next.js
   - **Root Directory: `apps/web`** (set this here, not in General)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install --legacy-peer-deps`

4. **Deploy:**
   ```bash
   cd apps/web
   vercel --prod
   ```

## Alternative: Deploy from Root

If you want to deploy from root directory:
```bash
cd /Users/ogowemr/meltdown-navigator
vercel --prod
```

But you need to clear the Root Directory setting in General settings first.
