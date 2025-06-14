@echo off
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║            💰 ENIAD Budget-Friendly Launcher                 ║
echo ║                                                              ║
echo ║  🌐 Frontend Only    → http://localhost:5173                 ║
echo ║  💰 Modal Budget     → Optimized for $5 budget               ║
echo ║  🤖 Direct API       → Your Llama3 Model                     ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 💰 Starting ENIAD Assistant in budget mode...
echo 🎯 Direct API calls to save Modal costs
echo.

cd chatbot-ui\chatbot-academique

echo 📦 Installing dependencies...
npm install

echo 🚀 Starting development server...
npm run dev

pause