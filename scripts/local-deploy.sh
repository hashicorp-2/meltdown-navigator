#!/bin/bash

# Local Deployment Script (Without Docker)
# This script builds and starts the backend and frontend locally

set -e

echo "🚀 Meltdown Navigator - Local Deployment"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Warning: Node.js version should be 18+ (found: $(node --version))"
fi

# Check for .env file
if [ ! -f "backend/.env" ]; then
    echo "❌ backend/.env not found. Please create it first."
    exit 1
fi

# Check if ANTHROPIC_API_KEY is set
if grep -q "your_anthropic_api_key_here" backend/.env 2>/dev/null; then
    echo "⚠️  WARNING: ANTHROPIC_API_KEY appears to be a placeholder!"
    echo "   Please edit backend/.env and add your actual API key"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "📦 Installing dependencies..."
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
echo "🚀 Starting services..."
echo ""

# Start backend in background
echo "Starting backend on http://localhost:4000..."
cd backend
node dist/index.js &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Check if backend is running
if curl -s http://localhost:4000/api/health > /dev/null; then
    echo "✅ Backend is running!"
else
    echo "⚠️  Backend may not be ready yet. Check logs above."
fi

echo ""
echo "Starting frontend on http://localhost:3000..."
cd frontend
npm run start &
FRONTEND_PID=$!
cd ..

echo ""
echo "⏳ Waiting for services to start..."
sleep 5

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📍 Access your application:"
echo "   Backend API: http://localhost:4000"
echo "   Frontend:    http://localhost:3000"
echo "   Health:      http://localhost:4000/api/health"
echo ""
echo "📊 Process IDs:"
echo "   Backend PID:  $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "🛑 To stop services:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "📝 View logs in the terminal above"
echo ""

# Keep script running
wait


