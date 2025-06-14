@echo off
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                🎓 ENIAD ASSISTANT LAUNCHER                   ║
echo ║                                                              ║
echo ║  🌐 Frontend: http://localhost:5173                         ║
echo ║  🔧 Backend:  http://localhost:3000                         ║
echo ║  🤖 RAG:      http://localhost:8000                         ║
echo ║  🧠 SMA:      http://localhost:8001                         ║
echo ║                                                              ║
echo ║  🎭 Démos Jury: demo_rag_system.html, demo_sma_system.html  ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🚀 Démarrage de l'Assistant ENIAD...
echo.

echo 📱 Lancement du Frontend (React + Vite)...
cd chatbot-ui\chatbot-academique
start cmd /k "npm install && npm run dev"

echo.
echo 🔧 Lancement du Backend API (Next.js)...
cd ..\..\eniad-api
start cmd /k "npm install && npm run dev"

echo.
echo 🤖 Lancement du système RAG (FastAPI)...
cd ..\RAG_Project\src
start cmd /k "pip install -r requirements.txt && uvicorn main:app --host 0.0.0.0 --port 8000"

echo.
echo 🧠 Lancement du service SMA (CrewAI)...
cd ..\..\SMA_Service
start cmd /k "pip install -r requirements.txt && python main.py"

echo.
echo ✅ Tous les services sont en cours de démarrage...
echo.
echo 💡 Attendez quelques secondes puis ouvrez:
echo    🌐 Interface principale: http://localhost:5173
echo    🎭 Démo RAG: demo_rag_system.html
echo    🎭 Démo SMA: demo_sma_system.html
echo.

timeout /t 5 /nobreak > nul
start http://localhost:5173

echo 🎉 ENIAD Assistant est prêt !
pause
