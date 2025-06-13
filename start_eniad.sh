#!/bin/bash

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                🎓 ENIAD AI Assistant Launcher                ║"
echo "║                                                              ║"
echo "║  Starting all services for complete AI integration:         ║"
echo "║  🤖 RAG System + 🧠 SMA Service + 📡 API + 🌐 Frontend      ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed or not in PATH"
    echo "Please install Python 3.8+ and try again"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in PATH"
    echo "Please install Node.js and try again"
    exit 1
fi

echo "✅ Dependencies check passed"
echo ""
echo "🚀 Starting ENIAD AI Assistant..."
echo ""

# Make the script executable
chmod +x start_all_services.py

# Run the Python launcher
python3 start_all_services.py
