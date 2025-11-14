#!/bin/bash
set -e

# Build agents package first if it exists
if [ -d "../../packages/agents" ]; then
  echo "Building agents package..."
  cd ../../packages/agents
  npm install
  npm run build
  cd ../../apps/web
fi

# Build Next.js app
echo "Building Next.js app..."
npm run build

