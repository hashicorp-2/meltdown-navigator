#!/bin/bash

# Quick Deployment Script for Meltdown Navigator
# This script helps you deploy quickly using Docker

set -e

echo "🚀 Meltdown Navigator Quick Deploy"
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check for .env file
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env not found"
    echo "Creating from template..."
    
    cat > backend/.env << EOF
# Required: Get from https://console.anthropic.com/
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional: MongoDB (for profile features)
# Local: mongodb://mongo:27017/meltdown-navigator
# Atlas: mongodb+srv://username:password@cluster.mongodb.net/meltdown-navigator
MONGODB_URI=mongodb://mongo:27017/meltdown-navigator

# Optional
NODE_ENV=production
PORT=4000
LOG_LEVEL=info
EOF
    
    echo "✅ Created backend/.env"
    echo "⚠️  Please edit backend/.env and add your ANTHROPIC_API_KEY before continuing!"
    echo ""
    read -p "Press Enter after you've updated backend/.env..."
fi

# Check if ANTHROPIC_API_KEY is set
if grep -q "your_anthropic_api_key_here" backend/.env 2>/dev/null; then
    echo "⚠️  Warning: ANTHROPIC_API_KEY appears to be a placeholder"
    echo "   Please update backend/.env with your actual API key"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "📦 Building and starting containers..."
docker-compose up -d --build

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

echo ""
echo "🔍 Checking health..."
HEALTH_CHECK=$(curl -s http://localhost:4000/api/health || echo "failed")

if echo "$HEALTH_CHECK" | grep -q "ok"; then
    echo "✅ Backend is healthy!"
    echo ""
    echo "$HEALTH_CHECK" | python3 -m json.tool 2>/dev/null || echo "$HEALTH_CHECK"
else
    echo "⚠️  Health check failed or backend not ready yet"
    echo "   Check logs with: docker-compose logs backend"
fi

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📍 Access your application:"
echo "   Backend API: http://localhost:4000"
echo "   Frontend:    http://localhost:3000"
echo "   Health:      http://localhost:4000/api/health"
echo ""
echo "📊 Useful commands:"
echo "   View logs:    docker-compose logs -f"
echo "   Stop:         docker-compose down"
echo "   Restart:      docker-compose restart"
echo "   Status:       docker-compose ps"
echo ""


