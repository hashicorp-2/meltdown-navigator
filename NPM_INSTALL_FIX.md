# NPM Install Issue - Workaround

## Problem

npm install is failing with:
```
npm error Cannot read properties of undefined (reading 'extraneous')
```

This appears to be an npm cache or workspace configuration issue.

## Solution: Manual Installation

Since Node.js 20.19.5 is now working, you can manually install the critical dependencies:

```bash
# Make sure you're using nvm's Node.js
export PATH="$HOME/.nvm/versions/node/v20.19.5/bin:$PATH"

# Install dependencies one by one in the backend directory
cd backend
npm install @ai-sdk/anthropic@^2.0.43
npm install ai@^3.4.33
npm install cors@^2.8.5
npm install dotenv@^16.4.5
npm install express@^4.19.2
npm install mongoose@^8.7.0
npm install twilio@^5.3.5
npm install zod@^3.23.8

# Install dev dependencies
npm install --save-dev @types/cors@^2.8.17
npm install --save-dev @types/express@^4.17.21
npm install --save-dev @types/jest@^29.5.12
npm install --save-dev @types/node@^20.11.30
npm install --save-dev @types/supertest@^2.0.16
npm install --save-dev concurrently@^8.2.2
npm install --save-dev eslint@^9.13.0
npm install --save-dev jest@^29.7.0
npm install --save-dev mongodb-memory-server@^10.1.4
npm install --save-dev nodemon@^3.0.2
npm install --save-dev supertest@^6.3.4
npm install --save-dev ts-jest@^29.2.5
npm install --save-dev ts-node@^10.9.2
npm install --save-dev ts-node-dev@^2.0.0
npm install --save-dev typescript@^5.6.3
```

## Alternative: Use Yarn or pnpm

If npm continues to have issues, consider using yarn or pnpm:

```bash
# Install yarn
npm install -g yarn

# Then use yarn
cd backend
yarn install
```

## Status

✅ Node.js 20.19.5 is working via nvm
✅ npm 10.8.2 is working
❌ npm install has a workspace/cache issue

The backend code is complete and ready - we just need to get dependencies installed.



