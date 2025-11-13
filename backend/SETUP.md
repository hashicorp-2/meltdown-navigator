# Backend Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install --workspace @meltdown/backend
```

### 2. Set Up Environment Variables

Create `backend/.env` file:

```env
PORT=4000
NODE_ENV=development
ANTHROPIC_API_KEY=your_anthropic_api_key_here
MONGODB_URI=mongodb://localhost:27017/meltdown-navigator  # Optional
```

### 3. Run the Server

**Option 1: Build and Run (Most Reliable)**
```bash
# Build the TypeScript code
npm run build --workspace @meltdown/backend

# Run the compiled code
npm run start:prod --workspace @meltdown/backend
```

**Option 2: Development with Watch Mode**
```bash
# This will watch for changes and rebuild automatically
npm run dev --workspace @meltdown/backend
```

**Option 3: Using ts-node/esm (If Node.js 18+)**
```bash
npm run dev:simple --workspace @meltdown/backend
```

## ES Module Configuration

The backend uses ES modules (`"type": "module"` in package.json). All imports now use `.js` extensions, which is required for ES modules in TypeScript.

For example:
```typescript
import app from './server.js';  // ✅ Correct
import app from './server';     // ❌ Wrong for ES modules
```

## Troubleshooting

### Error: "Must use import to load ES Module"

This error occurs when Node.js tries to load a TypeScript file directly without proper ES module support.

**Solution 1: Use Build Step (Recommended)**
```bash
npm run build --workspace @meltdown/backend
npm run start:prod --workspace @meltdown/backend
```

**Solution 2: Install tsx (If Node.js is working)**
```bash
npm install --workspace @meltdown/backend tsx --save-dev
```

Then update package.json scripts to use `tsx`:
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts"
  }
}
```

### Node.js System Issue

If you see:
```
dyld[xxxxx]: Symbol not found: (__ZNSt3__122__libcpp_verbose_abortEPKcz)
```

This is a system-level Node.js issue. Solutions:

1. **Reinstall Node.js using nvm (Recommended)**
   ```bash
   # Install nvm if not installed
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   
   # Install Node.js 20 LTS
   nvm install 20
   nvm use 20
   ```

2. **Or reinstall Node.js from nodejs.org**

## Testing

Run tests:
```bash
npm run test --workspace @meltdown/backend
```

## API Endpoints

Once the server is running:

- `GET /api/health` - Health check
- `POST /api/translator` - Translate crisis message
- `POST /api/profiles` - Create profile
- `GET /api/profiles/:userId` - Get profile by user ID
- `PUT /api/profiles/:userId` - Update profile
- `DELETE /api/profiles/:userId` - Delete profile
- `GET /api/profiles/:userId/exists` - Check if profile exists

## Verify Setup

1. Start the server:
   ```bash
   npm run build --workspace @meltdown/backend
   npm run start:prod --workspace @meltdown/backend
   ```

2. Test health endpoint:
   ```bash
   curl http://localhost:4000/api/health
   ```

3. Expected response:
   ```json
   { "status": "ok" }
   ```



