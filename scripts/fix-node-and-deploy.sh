#!/bin/bash

# Fix Node.js and Deploy Script
# This script helps fix Node.js issues and deploy the app

set -e

echo "🔧 Meltdown Navigator - Fix Node.js & Deploy"
echo ""

# Check if nvm is installed
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    echo "✅ nvm found, loading..."
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm use 20 2>/dev/null || nvm install 20
    nvm use 20
    echo "✅ Using Node.js $(node --version)"
elif [ -d "$HOME/.nvm" ]; then
    echo "⚠️  nvm directory exists but nvm.sh not found"
    echo "   Try: source ~/.nvm/nvm.sh"
else
    echo "📦 Installing nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    echo "✅ nvm installed"
    echo "📦 Installing Node.js 20..."
    nvm install 20
    nvm use 20
    nvm alias default 20
    echo "✅ Node.js $(node --version) installed"
fi

# Verify Node.js works
if ! node --version > /dev/null 2>&1; then
    echo "❌ Node.js still not working. Please install manually:"
    echo "   1. Install nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "   2. Reload shell: source ~/.zshrc"
    echo "   3. Install Node: nvm install 20"
    exit 1
fi

echo ""
echo "📦 Installing dependencies..."
cd /Users/ogowemr/meltdown-navigator
npm install --workspaces --include-workspace-root

echo ""
echo "🔨 Building backend..."
cd backend
npm run build
cd ..

echo ""
echo "🔨 Building frontend..."
cd frontend
npm run build
cd ..

echo ""
echo "✅ Builds complete!"
echo ""
echo "🚀 To start services:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend && npm run start:prod"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend && npm run start"
echo ""
echo "Then visit: http://localhost:3000"
echo ""


