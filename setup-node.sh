#!/bin/bash
# Setup script to use nvm's Node.js

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Use Node.js 20
nvm use 20

# Verify
echo "Node.js version: $(node --version)"
echo "Node.js path: $(which node)"
echo "npm version: $(npm --version)"

# Install dependencies
echo ""
echo "Installing backend dependencies..."
npm install --workspace @meltdown/backend



