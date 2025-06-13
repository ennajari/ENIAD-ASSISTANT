@echo off
REM ========================================
REM ENIAD SMA Service Startup Script (Windows)
REM ========================================

echo 🧠 Starting ENIAD Smart Multi-Agent Service...
echo ==============================================

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Check if we're in the SMA_Service directory
if not exist main.py (
    echo [ERROR] Please run this script from the SMA_Service directory
    pause
    exit /b 1
)

echo [INFO] Checking Python virtual environment...

REM Create virtual environment if it doesn't exist
if not exist venv (
    echo [INFO] Creating Python virtual environment...
    python -m venv venv
    
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to create virtual environment
        pause
        exit /b 1
    )
    
    echo [SUCCESS] Virtual environment created successfully
)

REM Activate virtual environment
echo [INFO] Activating virtual environment...
call venv\Scripts\activate.bat

if %errorlevel% neq 0 (
    echo [ERROR] Failed to activate virtual environment
    pause
    exit /b 1
)

echo [SUCCESS] Virtual environment activated

REM Upgrade pip
echo [INFO] Upgrading pip...
python -m pip install --upgrade pip

REM Install requirements
echo [INFO] Installing SMA Service requirements...
pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo [ERROR] Failed to install requirements
    pause
    exit /b 1
)

echo [SUCCESS] Requirements installed successfully

REM Create necessary directories
echo [INFO] Creating necessary directories...
if not exist logs mkdir logs
if not exist data mkdir data
if not exist temp mkdir temp

REM Check if .env file exists
if not exist .env (
    echo [WARNING] .env file not found. Creating from template...
    (
        echo # SMA Service Configuration
        echo APP_NAME=ENIAD SMA Service
        echo APP_VERSION=1.0.0
        echo DEBUG=true
        echo.
        echo # Server Settings
        echo HOST=0.0.0.0
        echo PORT=8001
        echo RELOAD=true
        echo.
        echo # Scraping Settings
        echo SCRAPING_DELAY=2.0
        echo MAX_CONCURRENT_REQUESTS=5
        echo REQUEST_TIMEOUT=30
        echo.
        echo # Logging
        echo LOG_LEVEL=INFO
        echo.
        echo # Optional AI Service Keys ^(uncomment and add your keys^)
        echo # OPENAI_API_KEY=your_openai_key_here
        echo # ANTHROPIC_API_KEY=your_anthropic_key_here
        echo # COHERE_API_KEY=your_cohere_key_here
    ) > .env
    echo [SUCCESS] .env file created with default settings
)

REM Start the SMA service
echo [INFO] Starting SMA Service on http://localhost:8001...
echo [INFO] API Documentation will be available at http://localhost:8001/docs
echo [INFO] Press Ctrl+C to stop the service
echo.
echo [SUCCESS] 🧠 SMA Service is starting...
echo.

REM Start the FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
