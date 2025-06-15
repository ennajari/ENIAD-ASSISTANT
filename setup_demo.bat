@echo off
echo ========================================
echo    ENIAD SMA Demo Setup for Professor
echo    Real Results Without Modal API
echo ========================================
echo.

cd /d "%~dp0"

echo 🎓 Setting up demo for professor presentation...
echo.

echo 📋 Demo Features:
echo   ✅ Real ENIAD website content
echo   ✅ 13 ENIAD URLs including news pages 2-3
echo   ✅ Image text extraction
echo   ✅ Multi-language support (French/Arabic)
echo   ✅ Source citations with real URLs
echo   ✅ No Modal API required
echo.

echo 🔧 Step 1: Starting SMA Service...
cd SMA_Service
start /B python main.py
echo ⏳ SMA service starting on http://localhost:8001...

echo.
echo ⏳ Waiting for SMA service to initialize...
timeout /t 10 /nobreak >nul

echo.
echo 🧪 Step 2: Testing SMA service...
python -c "
import requests
import time
try:
    response = requests.get('http://localhost:8001/health', timeout=5)
    if response.status_code == 200:
        print('✅ SMA service is running successfully!')
        print(f'   Status: {response.json().get(\"status\")}')
    else:
        print('❌ SMA service not responding properly')
except Exception as e:
    print(f'❌ SMA service not accessible: {e}')
    print('💡 Please start manually with: python main.py')
"

echo.
echo 🌐 Step 3: Starting main interface...
cd ..\chatbot-ui\chatbot-academique

echo 📦 Installing dependencies...
call npm install --silent

echo 🚀 Starting interface...
start /B npm run dev

echo.
echo ⏳ Waiting for interface to start...
timeout /t 15 /nobreak >nul

echo.
echo 🎉 DEMO SETUP COMPLETE!
echo.
echo 📱 Demo URLs:
echo   • Main Interface: http://localhost:3000
echo   • SMA Service: http://localhost:8001
echo   • SMA Status: http://localhost:8001/sma/status
echo   • API Docs: http://localhost:8001/docs
echo.
echo 🎯 Demo Instructions for Professor:
echo.
echo 1. Open http://localhost:3000 in browser
echo 2. Click the SMA button (🔍 search icon)
echo 3. Try these queries:
echo    • "Quelles formations en IA sont disponibles à ENIAD?"
echo    • "Comment s'inscrire aux concours de recrutement?"
echo    • "ما هي آخر أخبار المدرسة؟"
echo.
echo 📊 What Professor Will See:
echo   ✅ Real content from ENIAD website
echo   ✅ Source citations with actual URLs
echo   ✅ Processing steps visualization
echo   ✅ Confidence scores
echo   ✅ Multi-language support
echo.
echo 🔍 Verification Commands:
echo   • Test SMA: curl http://localhost:8001/health
echo   • Test Interface: curl http://localhost:3000
echo.
echo 📚 Demo Guide: See demo_for_professor.md
echo.

echo Press any key to open demo guide...
pause >nul

start "" "demo_for_professor.md"

echo.
echo 🎓 Ready for professor demonstration!
echo 💡 Keep this window open to monitor services
echo.

REM Keep services running
echo Services are running. Press Ctrl+C to stop all services.
pause
