@echo off
echo Starting ENIAD Frontend (Budget Mode)...
echo.

cd chatbot-ui\chatbot-academique

echo Installing dependencies...
npm install

echo.
echo Starting development server...
npm run dev

pause
