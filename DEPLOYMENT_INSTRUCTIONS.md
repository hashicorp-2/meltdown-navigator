# Vercel Deployment Instructions

## Quick Setup

1. **Go to Vercel Dashboard:**
   - https://vercel.com/buildyourbrandpower-1433s-projects/web/settings

2. **Configure Root Directory:**
   - Settings > General > Root Directory
   - Leave empty (uses repo root) OR set to repository root
   - This allows Vercel to access the full monorepo structure

3. **Configure Build Settings:**
   - Settings > Build & Development Settings
   - Framework Preset: Next.js
   - Root Directory: `apps/web`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install --legacy-peer-deps`

4. **Environment Variables (if needed):**
   - `ANTHROPIC_API_KEY` - For AI features
   - `NEXT_PUBLIC_BACKEND_URL` - Backend API URL

5. **Deploy:**
   - Push to your connected Git branch, OR
   - Run: `cd apps/web && vercel --prod`

## Current Status

- ✅ Build: Working locally
- ✅ Vercel Project: Linked
- ⚠️  Needs Root Directory configuration in dashboard

## Local Development

The app is fully functional at: **http://localhost:3000**
