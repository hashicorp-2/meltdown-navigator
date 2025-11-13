# Backend Troubleshooting

## ES Module Error

If you're seeing the error: `Error: Must use import to load ES Module`

This is because the backend uses ES modules (`"type": "module"` in package.json) and ts-node needs proper configuration.

## Solutions

### Option 1: Use Build Step (Recommended - Works without ts-node)

1. Build the project:
   ```bash
   npm run build --workspace @meltdown/backend
   ```

2. Run the compiled code:
   ```bash
   npm run start:prod --workspace @meltdown/backend
   ```

3. For development with watch mode:
   ```bash
   npm run dev --workspace @meltdown/backend
   ```
   This uses concurrently to watch TypeScript files and rebuild, then nodemon to restart the server.

### Option 2: Fix ts-node/esm (If Node.js is working)

The issue is that ts-node/esm needs proper configuration. Make sure:

1. Node.js version is 18+ (check with `node --version`)
2. ts-node is installed: `npm install --workspace @meltdown/backend ts-node`
3. Use the dev:simple script: `npm run dev:simple --workspace @meltdown/backend`

### Option 3: Use tsx (Fastest - Recommended if available)

1. Install tsx:
   ```bash
   npm install --workspace @meltdown/backend tsx --save-dev
   ```

2. Use tsx directly:
   ```bash
   npx tsx watch src/index.ts
   ```

## Node.js System Issue

If you're seeing:
```
dyld[xxxxx]: Symbol not found: (__ZNSt3__122__libcpp_verbose_abortEPKcz)
```

This is a system-level Node.js issue. To fix:

1. Reinstall Node.js using a version manager (nvm):
   ```bash
   # Install nvm if not installed
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   
   # Install Node.js 20 LTS
   nvm install 20
   nvm use 20
   ```

2. Or reinstall Node.js from nodejs.org

## Quick Fix for Development

The simplest solution is to use the build step:

```bash
# In backend directory
npm run build
npm run start:prod
```

For watch mode during development:
```bash
npm run dev
```

This uses concurrently to:
1. Watch TypeScript files and rebuild on changes
2. Watch the dist directory and restart the server

## Testing the Setup

1. Check if build works:
   ```bash
   npm run build --workspace @meltdown/backend
   ```

2. Check if server starts:
   ```bash
   npm run start:prod --workspace @meltdown/backend
   ```

3. Test the health endpoint:
   ```bash
   curl http://localhost:4000/api/health
   ```

## Environment Variables

Make sure you have a `.env` file in the `backend/` directory:

```env
PORT=4000
NODE_ENV=development
ANTHROPIC_API_KEY=your_key_here
MONGODB_URI=mongodb://localhost:27017/meltdown-navigator  # Optional
```


