#!/bin/bash

# ElectroGyaan Quick Start Script
# This script helps you set up and run the entire platform

echo "🚀 ElectroGyaan Platform - Quick Start"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."
echo ""

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Node.js found:${NC} $(node --version)"
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
else
    echo -e "${GREEN}✓ npm found:${NC} $(npm --version)"
fi

if ! command_exists python3; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Python found:${NC} $(python3 --version)"
fi

if ! command_exists pip3; then
    echo -e "${RED}❌ pip3 is not installed${NC}"
    exit 1
else
    echo -e "${GREEN}✓ pip3 found:${NC} $(pip3 --version)"
fi

echo ""
echo "======================================"
echo ""

# Menu
echo "What would you like to do?"
echo ""
echo "1) Install all dependencies"
echo "2) Generate dataset & train ML models"
echo "3) Start all services (ML + Backend + Frontend)"
echo "4) Start IoT simulator"
echo "5) Run complete setup (1 + 2)"
echo "6) Exit"
echo ""
read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo ""
        echo "📦 Installing dependencies..."
        echo ""
        
        echo -e "${YELLOW}Installing backend dependencies...${NC}"
        cd backend && npm install
        echo -e "${GREEN}✓ Backend dependencies installed${NC}"
        echo ""
        
        echo -e "${YELLOW}Installing frontend dependencies...${NC}"
        cd ../frontend && npm install
        echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
        echo ""
        
        echo -e "${YELLOW}Installing ML service dependencies...${NC}"
        cd ../ml-service && pip3 install -r requirements.txt
        echo -e "${GREEN}✓ ML service dependencies installed${NC}"
        echo ""
        
        echo -e "${GREEN}✅ All dependencies installed successfully!${NC}"
        ;;
        
    2)
        echo ""
        echo "🤖 Generating dataset and training models..."
        echo ""
        
        echo -e "${YELLOW}Generating synthetic energy dataset...${NC}"
        cd backend && node generate_dataset.js
        echo -e "${GREEN}✓ Dataset generated: electrogyaan_dataset.csv${NC}"
        echo ""
        
        echo -e "${YELLOW}Training ML models...${NC}"
        cd ../ml-service && python3 train_models.py
        echo -e "${GREEN}✓ Models trained and saved${NC}"
        echo ""
        
        echo -e "${GREEN}✅ Dataset and models ready!${NC}"
        ;;
        
    3)
        echo ""
        echo "🚀 Starting all services..."
        echo ""
        echo -e "${YELLOW}This will open 3 terminal windows:${NC}"
        echo "  1. ML Service (port 8000)"
        echo "  2. Backend API (port 5000)"
        echo "  3. Frontend (port 5173)"
        echo ""
        echo -e "${YELLOW}Note: You need to start these manually in separate terminals:${NC}"
        echo ""
        echo "Terminal 1:"
        echo "  cd ml-service && uvicorn main:app --reload --port 8000"
        echo ""
        echo "Terminal 2:"
        echo "  cd backend && npm run dev"
        echo ""
        echo "Terminal 3:"
        echo "  cd frontend && npm run dev"
        echo ""
        echo -e "${GREEN}After starting all services, open: http://localhost:5173${NC}"
        ;;
        
    4)
        echo ""
        echo "📡 Starting IoT simulator..."
        echo ""
        echo -e "${YELLOW}Make sure backend is running first!${NC}"
        echo ""
        cd backend && npm run simulate
        ;;
        
    5)
        echo ""
        echo "🔧 Running complete setup..."
        echo ""
        
        # Install dependencies
        echo -e "${YELLOW}Step 1/4: Installing backend dependencies...${NC}"
        cd backend && npm install
        echo -e "${GREEN}✓ Backend dependencies installed${NC}"
        echo ""
        
        echo -e "${YELLOW}Step 2/4: Installing frontend dependencies...${NC}"
        cd ../frontend && npm install
        echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
        echo ""
        
        echo -e "${YELLOW}Step 3/4: Installing ML service dependencies...${NC}"
        cd ../ml-service && pip3 install -r requirements.txt
        echo -e "${GREEN}✓ ML service dependencies installed${NC}"
        echo ""
        
        # Generate dataset
        echo -e "${YELLOW}Step 4/4: Generating dataset...${NC}"
        cd ../backend && node generate_dataset.js
        echo -e "${GREEN}✓ Dataset generated${NC}"
        echo ""
        
        # Train models
        echo -e "${YELLOW}Training ML models...${NC}"
        cd ../ml-service && python3 train_models.py
        echo -e "${GREEN}✓ Models trained${NC}"
        echo ""
        
        echo -e "${GREEN}✅ Complete setup finished!${NC}"
        echo ""
        echo -e "${YELLOW}Next steps:${NC}"
        echo "1. Start ML service: cd ml-service && uvicorn main:app --reload --port 8000"
        echo "2. Start backend: cd backend && npm run dev"
        echo "3. Start frontend: cd frontend && npm run dev"
        echo "4. Open browser: http://localhost:5173"
        ;;
        
    6)
        echo "Goodbye! 👋"
        exit 0
        ;;
        
    *)
        echo -e "${RED}Invalid choice. Please run the script again.${NC}"
        exit 1
        ;;
esac

echo ""
echo "======================================"
echo "Done! 🎉"
