@echo off
echo ========================================
echo    ENIAD Enhanced SMA System
echo    With News Pages + Image Processing
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

echo 🌐 ENIAD URLs Now Integrated:
echo   • https://eniad.ump.ma/fr/actualite
echo   • https://eniad.ump.ma/fr/actualite?page=2
echo   • https://eniad.ump.ma/fr/actualite?page=3
echo   • https://eniad.ump.ma/fr/cycle-ingenieur-intelligence-artificielle-ia
echo   • https://eniad.ump.ma/fr/cycle-ingenieur-robotique-et-objets-connectes-roc
echo   • And 8 more ENIAD pages with image processing...
echo.

echo 📦 Installing/Updating dependencies...
cd SMA_Service
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
echo   • SMA Test: file:///%~dp0SMA_Service/test_sma.html
echo   • Integration Test: python test_integration.py
echo.
echo 🎯 Example Enhanced Queries:
echo   • "Quelles formations en IA sont disponibles à ENIAD?"
echo   • "Comment s'inscrire aux concours de recrutement?"
echo   • "ما هي آخر أخبار المدرسة؟"
echo   • "Programmes de robotique et objets connectés"
echo.

REM Start the service
echo ⏳ Starting service...
start /B python main.py

echo ⏳ Waiting for service to start...
timeout /t 15 /nobreak >nul

echo.
echo 🔍 Testing enhanced system...
python test_integration.py

echo.
echo 🎉 Enhanced SMA System is ready!
echo.
echo 📖 Next Steps:
echo   1. Start your main interface: cd chatbot-ui/chatbot-academique && npm run dev
echo   2. Test the SMA button in the chat interface
echo   3. Try intelligent queries about ENIAD
echo   4. Check that real results appear with sources and images
echo.
echo 📚 For detailed guide, see: SMA_Service/ENHANCED_SYSTEM_GUIDE.md
echo.

echo Press any key to open main interface directory...
pause >nul

REM Open main interface directory
start "" "chatbot-ui\chatbot-academique"

echo.
echo 🎯 SMA Service is running. Press Ctrl+C to stop.
echo 📊 Monitor logs and test the intelligent query system!
echo.

REM Keep the window open
pause
