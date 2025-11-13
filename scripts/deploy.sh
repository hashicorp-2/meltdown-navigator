#!/bin/bash

# Meltdown Navigator Deployment Script
# This script helps deploy the application to various platforms

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Meltdown Navigator Deployment Script${NC}"
echo ""

# Check if .env files exist
check_env_files() {
    echo -e "${YELLOW}Checking environment files...${NC}"
    
    if [ ! -f "backend/.env" ]; then
        echo -e "${RED}❌ backend/.env not found${NC}"
        echo "   Create it from backend/.env.example"
        return 1
    fi
    
    if [ ! -f "frontend/.env.local" ]; then
        echo -e "${YELLOW}⚠️  frontend/.env.local not found (optional for local dev)${NC}"
    fi
    
    echo -e "${GREEN}✅ Environment files checked${NC}"
    return 0
}

# Build backend
build_backend() {
    echo -e "${YELLOW}Building backend...${NC}"
    cd backend
    npm run build
    cd ..
    echo -e "${GREEN}✅ Backend built successfully${NC}"
}

# Build frontend
build_frontend() {
    echo -e "${YELLOW}Building frontend...${NC}"
    cd frontend
    npm run build
    cd ..
    echo -e "${GREEN}✅ Frontend built successfully${NC}"
}

# Deploy with Docker
deploy_docker() {
    echo -e "${YELLOW}Deploying with Docker...${NC}"
    docker-compose up -d --build
    echo -e "${GREEN}✅ Docker deployment complete${NC}"
    echo "   Backend: http://localhost:4000"
    echo "   Frontend: http://localhost:3000"
    echo "   Health check: http://localhost:4000/api/health"
}

# Deploy with PM2
deploy_pm2() {
    echo -e "${YELLOW}Deploying with PM2...${NC}"
    
    if ! command -v pm2 &> /dev/null; then
        echo -e "${RED}❌ PM2 not installed. Install with: npm install -g pm2${NC}"
        return 1
    fi
    
    cd backend
    npm run build
    pm2 start ecosystem.config.js --env production
    pm2 save
    cd ..
    
    echo -e "${GREEN}✅ PM2 deployment complete${NC}"
    echo "   Use 'pm2 status' to check status"
    echo "   Use 'pm2 logs' to view logs"
}

# Main menu
show_menu() {
    echo ""
    echo "Select deployment method:"
    echo "1) Build only (verify builds work)"
    echo "2) Docker Compose (local deployment)"
    echo "3) PM2 (production server)"
    echo "4) Check environment files"
    echo "5) Exit"
    echo ""
    read -p "Enter choice [1-5]: " choice
    
    case $choice in
        1)
            check_env_files || exit 1
            build_backend
            build_frontend
            echo -e "${GREEN}✅ Builds completed successfully!${NC}"
            ;;
        2)
            check_env_files || exit 1
            deploy_docker
            ;;
        3)
            check_env_files || exit 1
            deploy_pm2
            ;;
        4)
            check_env_files
            ;;
        5)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice${NC}"
            show_menu
            ;;
    esac
}

# Run menu
show_menu


