# Fix Node.js Installation Issue

## Problem

You're seeing this error:
```
dyld[xxxxx]: Symbol not found: (__ZNSt3__122__libcpp_verbose_abortEPKcz)
Referenced from: '/usr/local/bin/node'
Expected in: '/usr/lib/libc++.1.dylib'
Abort trap: 6
```

This means your system Node.js (`/usr/local/bin/node`) is broken, but you have nvm installed with Node.js 20.

## Solution

### Option 1: Use the Setup Script (Easiest)

Run the setup script which will automatically use nvm's Node.js:

```bash
source setup-node.sh
```

### Option 2: Manual Setup

1. **Load nvm in your current shell:**
   ```bash
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
   ```

2. **Use Node.js 20:**
   ```bash
   nvm use 20
   ```

3. **Verify it's working:**
   ```bash
   which node
   # Should show: ~/.nvm/versions/node/v20.19.5/bin/node
   
   node --version
   # Should show: v20.19.5
   ```

4. **Install dependencies:**
   ```bash
   npm install --workspace @meltdown/backend
   ```

### Option 3: Make nvm Load Automatically (Permanent Fix)

Add this to your `~/.zshrc` file (since you're using zsh):

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Use Node.js 20 by default
nvm use 20 > /dev/null 2>&1
```

Then reload your shell:
```bash
source ~/.zshrc
```

### Option 4: Remove Broken System Node.js (Advanced)

If you want to completely remove the broken system Node.js:

```bash
# Find where it's installed
which node
# If it shows /usr/local/bin/node, you can remove it:
sudo rm /usr/local/bin/node
sudo rm /usr/local/bin/npm

# Then make sure nvm's Node.js is in your PATH
export PATH="$HOME/.nvm/versions/node/v20.19.5/bin:$PATH"
```

**Warning:** Only do this if you're sure you want to remove the system Node.js. Make sure nvm is working first.

## Verify the Fix

After applying any solution, verify:

```bash
which node
# Should NOT show /usr/local/bin/node
# Should show ~/.nvm/versions/node/v20.19.5/bin/node

node --version
# Should work without errors

npm --version
# Should work without errors
```

## Quick Test

Once Node.js is working, test the backend:

```bash
# Install dependencies
npm install --workspace @meltdown/backend

# Build
npm run build --workspace @meltdown/backend

# Start (if you have .env configured)
npm run start:prod --workspace @meltdown/backend
```



