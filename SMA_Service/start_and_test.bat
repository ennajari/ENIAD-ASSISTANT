@echo off
echo ========================================
echo    ENIAD Enhanced SMA System
echo    Comprehensive Search & Intelligence
echo ========================================
echo.

cd /d "%~dp0"

echo 🧠 Enhanced Multi-Agent System Features:
echo   ✅ Intelligent Query Understanding
echo   ✅ Comprehensive Website Scanning  
echo   ✅ PDF Document Processing
echo   ✅ Image OCR Processing
echo   ✅ Real-time News Search
echo   ✅ Vector Database Storage
echo   ✅ Multi-language Support (FR/AR/EN)
echo.

echo 🌐 ENIAD URLs Integrated:
echo   • https://eniad.ump.ma/fr/actualite
echo   • https://eniad.ump.ma/fr/cycle-ingenieur-intelligence-artificielle-ia
echo   • https://eniad.ump.ma/fr/cycle-ingenieur-robotique-et-objets-connectes-roc
echo   • https://eniad.ump.ma/fr/cycle-ingenieur-genie-informatique-ginf
echo   • https://eniad.ump.ma/fr/concours-de-recrutement
echo   • And 6 more ENIAD pages...
echo.

echo 📦 Installing/Updating dependencies...
pip install -r requirements.txt --quiet
if %errorlevel% neq 0 (
    echo ⚠️ Some dependencies may need manual installation
    echo Please install Tesseract OCR for image processing:
    echo https://github.com/tesseract-ocr/tesseract
)

echo.
echo 🚀 Starting Enhanced SMA Service...
echo.
echo 🌐 Service URLs:
echo   • Main API: http://localhost:8001
echo   • Health Check: http://localhost:8001/health
echo   • SMA Status: http://localhost:8001/sma/status
echo   • API Docs: http://localhost:8001/docs
echo.
echo 🧪 Test Interfaces:
echo   • SMA Test: file:///%~dp0test_sma.html
echo   • RAG Test: file:///%~dp0test_rag.html
echo.
echo 🎯 Example Queries to Test:
echo   • "Quelles formations en IA sont disponibles à ENIAD?"
echo   • "Comment s'inscrire aux concours de recrutement?"
echo   • "ما هي آخر أخبار المدرسة؟"
echo   • "Programmes de robotique et objets connectés"
echo.

REM Start the service in background
start /B python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload --log-level info

echo ⏳ Waiting for service to start...
timeout /t 10 /nobreak >nul

echo.
echo 🔍 Testing system health...
curl -s http://localhost:8001/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Service is running successfully!
    echo.
    echo 🧪 Running quick demo...
    python demo_enhanced_system.py
    echo.
    echo 🎉 Enhanced SMA System is ready!
    echo.
    echo 📖 Next Steps:
    echo   1. Open test_sma.html in your browser
    echo   2. Try the "Intelligent Query System" section
    echo   3. Ask questions about ENIAD in French or Arabic
    echo   4. Check the comprehensive search results
    echo.
    echo 📚 For detailed guide, see: ENHANCED_SYSTEM_GUIDE.md
    echo.
) else (
    echo ❌ Service failed to start. Check the logs above.
    echo.
    echo 🔧 Troubleshooting:
    echo   1. Ensure Python 3.8+ is installed
    echo   2. Check if port 8001 is available
    echo   3. Verify Gemini API key in .env file
    echo   4. Install missing dependencies manually
    echo.
)

echo Press any key to open test interface...
pause >nul

REM Open test interface
start "" "test_sma.html"

echo.
echo 🎯 Service is running. Press Ctrl+C to stop.
echo 📊 Monitor logs and test the intelligent query system!
echo.

REM Keep the window open
pause
