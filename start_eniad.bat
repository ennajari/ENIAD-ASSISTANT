@echo off
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                🎓 ENIAD AI Assistant Launcher                ║
echo ║                                                              ║
echo ║  Starting all services for complete AI integration:         ║
echo ║  🤖 RAG System + 🧠 SMA Service + 📡 API + 🌐 Frontend      ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js and try again
    pause
    exit /b 1
)

echo ✅ Dependencies check passed
echo.
echo 🚀 Starting ENIAD AI Assistant...
echo.

REM Run the Python launcher
python start_all_services.py

pause
