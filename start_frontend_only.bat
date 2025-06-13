@echo off
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║            💰 ENIAD Budget-Friendly Launcher                 ║
echo ║                                                              ║
echo ║  🌐 Frontend Only    → http://localhost:5173                 ║
echo ║  💰 Modal Budget     → $5 (Cost-Optimized)                   ║
echo ║  🤖 Direct API       → Your Llama3 Model                     ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 💰 Budget Mode: Optimized for your $5 Modal budget
echo 🎯 Starting only the frontend to minimize costs
echo.

REM Navigate to frontend directory
cd /d "chatbot-ui\chatbot-academique"

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Cannot find package.json
    echo Make sure you're running this from the ENIAD-ASSISTANT root directory
    pause
    exit /b 1
)

echo 📁 Current directory: %CD%
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies (this may take a few minutes)...
    npm install
    if errorlevel 1 (
        echo ❌ npm install failed
        echo 💡 Try running: npm cache clean --force
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed
) else (
    echo ✅ Dependencies already installed
)

echo.
echo 🚀 Starting ENIAD Frontend (Budget Mode)...
echo 💰 Cost optimizations active:
echo    • Max tokens: 400 (reduced from 1000)
echo    • Context limit: 3 messages (reduced from 10)
echo    • Temperature: 0.7 (optimized)
echo    • No RAG/SMA overhead
echo.
echo 🌐 Your chat interface will open at: http://localhost:5173
echo 💡 Keep conversations short to save Modal costs!
echo.

REM Start the development server
npm run dev

pause
