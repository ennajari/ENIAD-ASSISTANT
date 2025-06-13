@echo off
REM ========================================
REM ENIAD Academic Assistant - Dependency Fix Script (Windows)
REM ========================================
REM 
REM This script fixes common dependency issues and installs all requirements
REM Run with: fix-dependencies.bat
REM
REM ========================================

echo 🔧 ENIAD Academic Assistant - Dependency Fix Script (Windows)
echo ==============================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

echo [INFO] Starting dependency installation...

REM Frontend Dependencies
echo [INFO] Installing frontend dependencies...
cd chatbot-ui\chatbot-academique

REM Clean npm cache and node_modules
echo [INFO] Cleaning npm cache and node_modules...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
npm cache clean --force

REM Install dependencies with legacy peer deps
echo [INFO] Installing npm dependencies...
npm install --legacy-peer-deps

if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)

echo [SUCCESS] Frontend dependencies installed successfully!

REM Go back to root directory
cd ..\..

REM Backend Dependencies
echo [INFO] Installing backend dependencies...

REM Create virtual environment if it doesn't exist
if not exist venv (
    echo [INFO] Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo [INFO] Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo [INFO] Upgrading pip...
python -m pip install --upgrade pip

REM Install main requirements
echo [INFO] Installing Python requirements...
pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)

echo [SUCCESS] Backend dependencies installed successfully!

REM Install RAG Project specific requirements
if exist RAG_Project\src\requirements.txt (
    echo [INFO] Installing RAG Project requirements...
    pip install -r RAG_Project\src\requirements.txt
    
    if %errorlevel% neq 0 (
        echo [WARNING] Some RAG Project dependencies may have failed to install
    ) else (
        echo [SUCCESS] RAG Project dependencies installed successfully!
    )
)

REM Optional: Install development dependencies
set /p install_dev="Do you want to install development dependencies? (y/n): "
if /i "%install_dev%"=="y" (
    echo [INFO] Installing development dependencies...
    pip install -r requirements-dev.txt
    
    if %errorlevel% neq 0 (
        echo [WARNING] Some development dependencies may have failed to install
    ) else (
        echo [SUCCESS] Development dependencies installed successfully!
    )
)

echo [SUCCESS] All dependencies installed successfully!
echo [INFO] You can now run the application:
echo.
echo Frontend (Terminal 1):
echo cd chatbot-ui\chatbot-academique
echo npm run dev
echo.
echo Backend (Terminal 2):
echo venv\Scripts\activate.bat
echo cd RAG_Project\src
echo uvicorn main:app --host 0.0.0.0 --port 8000 --reload
echo.
echo [SUCCESS] Setup complete! 🎉
pause
