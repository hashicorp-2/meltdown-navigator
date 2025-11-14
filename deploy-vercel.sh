#!/bin/bash
set -e

echo "🚀 Deploying Meltdown Navigator to Vercel..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: Must run from project root directory"
  exit 1
fi

# Build agents package first
echo "📦 Building agents package..."
cd packages/agents
npm install
npm run build
cd ../..

# Deploy from apps/web
echo "🌐 Deploying web app..."
cd apps/web
vercel --prod

echo ""
echo "✅ Deployment complete!"

