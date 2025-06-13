#!/bin/bash

# ========================================
# ENIAD Academic Assistant - Dependency Fix Script
# ========================================
# 
# This script fixes common dependency issues and installs all requirements
# Run with: bash fix-dependencies.sh
#
# ========================================

echo "🔧 ENIAD Academic Assistant - Dependency Fix Script"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
    print_error "Python is not installed. Please install Python 3.8+ first."
    exit 1
fi

print_status "Starting dependency installation..."

# Frontend Dependencies
print_status "Installing frontend dependencies..."
cd chatbot-ui/chatbot-academique

# Clean npm cache and node_modules
print_status "Cleaning npm cache and node_modules..."
rm -rf node_modules package-lock.json
npm cache clean --force

# Install dependencies with legacy peer deps
print_status "Installing npm dependencies..."
npm install --legacy-peer-deps

if [ $? -eq 0 ]; then
    print_success "Frontend dependencies installed successfully!"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

# Go back to root directory
cd ../..

# Backend Dependencies
print_status "Installing backend dependencies..."

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    print_status "Creating Python virtual environment..."
    python -m venv venv || python3 -m venv venv
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source venv/bin/activate || source venv/Scripts/activate

# Upgrade pip
print_status "Upgrading pip..."
pip install --upgrade pip

# Install main requirements
print_status "Installing Python requirements..."
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    print_success "Backend dependencies installed successfully!"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

# Install RAG Project specific requirements
if [ -f "RAG_Project/src/requirements.txt" ]; then
    print_status "Installing RAG Project requirements..."
    pip install -r RAG_Project/src/requirements.txt
    
    if [ $? -eq 0 ]; then
        print_success "RAG Project dependencies installed successfully!"
    else
        print_warning "Some RAG Project dependencies may have failed to install"
    fi
fi

# Optional: Install development dependencies
read -p "Do you want to install development dependencies? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Installing development dependencies..."
    pip install -r requirements-dev.txt
    
    if [ $? -eq 0 ]; then
        print_success "Development dependencies installed successfully!"
    else
        print_warning "Some development dependencies may have failed to install"
    fi
fi

print_success "All dependencies installed successfully!"
print_status "You can now run the application:"
echo ""
echo "Frontend (Terminal 1):"
echo "cd chatbot-ui/chatbot-academique"
echo "npm run dev"
echo ""
echo "Backend (Terminal 2):"
echo "source venv/bin/activate  # or venv\\Scripts\\activate on Windows"
echo "cd RAG_Project/src"
echo "uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
echo ""
print_success "Setup complete! 🎉"
