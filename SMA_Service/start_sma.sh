#!/bin/bash

# ========================================
# ENIAD SMA Service Startup Script
# ========================================

echo "🧠 Starting ENIAD Smart Multi-Agent Service..."
echo "=============================================="

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

# Check if Python is installed
if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
    print_error "Python is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if we're in the SMA_Service directory
if [ ! -f "main.py" ]; then
    print_error "Please run this script from the SMA_Service directory"
    exit 1
fi

print_status "Checking Python virtual environment..."

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    print_status "Creating Python virtual environment..."
    python -m venv venv || python3 -m venv venv
    
    if [ $? -eq 0 ]; then
        print_success "Virtual environment created successfully"
    else
        print_error "Failed to create virtual environment"
        exit 1
    fi
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source venv/bin/activate

if [ $? -eq 0 ]; then
    print_success "Virtual environment activated"
else
    print_error "Failed to activate virtual environment"
    exit 1
fi

# Upgrade pip
print_status "Upgrading pip..."
pip install --upgrade pip

# Install requirements
print_status "Installing SMA Service requirements..."
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    print_success "Requirements installed successfully"
else
    print_error "Failed to install requirements"
    exit 1
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p logs
mkdir -p data
mkdir -p temp

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from template..."
    cat > .env << EOF
# SMA Service Configuration
APP_NAME=ENIAD SMA Service
APP_VERSION=1.0.0
DEBUG=true

# Server Settings
HOST=0.0.0.0
PORT=8001
RELOAD=true

# Scraping Settings
SCRAPING_DELAY=2.0
MAX_CONCURRENT_REQUESTS=5
REQUEST_TIMEOUT=30

# Logging
LOG_LEVEL=INFO

# Optional AI Service Keys (uncomment and add your keys)
# OPENAI_API_KEY=your_openai_key_here
# ANTHROPIC_API_KEY=your_anthropic_key_here
# COHERE_API_KEY=your_cohere_key_here
EOF
    print_success ".env file created with default settings"
fi

# Start the SMA service
print_status "Starting SMA Service on http://localhost:8001..."
print_status "API Documentation will be available at http://localhost:8001/docs"
print_status "Press Ctrl+C to stop the service"

echo ""
print_success "🧠 SMA Service is starting..."
echo ""

# Start the FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
