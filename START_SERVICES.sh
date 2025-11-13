#!/bin/bash

# Start Meltdown Navigator Services
# This script starts both backend and frontend

set -e

echo "🚀 Starting Meltdown Navigator Services..."
echo ""

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"
nvm use 20 > /dev/null 2>&1

# Check if services are already running
if lsof -i :4000 > /dev/null 2>&1; then
    echo "⚠️  Backend is already running on port 4000"
else
    echo "📦 Starting backend..."
    cd /Users/ogowemr/meltdown-navigator/backend
    node dist/index.js > /tmp/backend.log 2>&1 &
    BACKEND_PID=$!
    echo "   Backend started (PID: $BACKEND_PID)"
    sleep 2
fi

if lsof -i :3000 > /dev/null 2>&1; then
    echo "⚠️  Frontend is already running on port 3000"
else
    echo "📦 Starting frontend..."
    cd /Users/ogowemr/meltdown-navigator/frontend
    npm run dev > /tmp/frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo "   Frontend started (PID: $FRONTEND_PID)"
    sleep 3
fi

echo ""
echo "⏳ Waiting for services to start..."
sleep 5

echo ""
echo "🔍 Checking services..."

# Check backend
if curl -s http://localhost:4000/api/health > /dev/null 2>&1; then
    echo "✅ Backend: RUNNING on http://localhost:4000"
else
    echo "❌ Backend: NOT RESPONDING (check /tmp/backend.log)"
fi

# Check frontend
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend: RUNNING on http://localhost:3000"
else
    echo "⏳ Frontend: Starting (may take 10-15 more seconds)"
    echo "   Check /tmp/frontend.log for details"
fi

echo ""
echo "📍 Access your app:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:4000"
echo "   Health:   http://localhost:4000/api/health"
echo ""
echo "📝 View logs:"
echo "   Backend:  tail -f /tmp/backend.log"
echo "   Frontend: tail -f /tmp/frontend.log"
echo ""
echo "🛑 To stop services:"
echo "   lsof -ti :4000 | xargs kill"
echo "   lsof -ti :3000 | xargs kill"
echo ""

