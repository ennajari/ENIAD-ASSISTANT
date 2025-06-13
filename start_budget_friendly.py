#!/usr/bin/env python3
"""
💰 ENIAD Budget-Friendly Launcher
Optimized for $5 Modal budget - starts only essential services
"""

import subprocess
import sys
import os
import time
import threading
from pathlib import Path

class BudgetServiceManager:
    def __init__(self):
        self.processes = []
        
    def print_banner(self):
        print("""
╔══════════════════════════════════════════════════════════════╗
║            💰 ENIAD Budget-Friendly Launcher                 ║
║                                                              ║
║  🌐 Frontend Only    → http://localhost:5173                 ║
║  💰 Modal Budget     → $5 (Cost-Optimized)                   ║
║  🤖 Direct API       → Your Llama3 Model                     ║
║                                                              ║
║  ⚡ Lightweight setup to preserve Modal budget               ║
╚══════════════════════════════════════════════════════════════╝
        """)

    def check_node_npm(self):
        """Check if Node.js and npm are available"""
        print("🔍 Checking Node.js and npm...")
        
        # Check Node.js
        try:
            result = subprocess.run(['node', '--version'], capture_output=True, text=True, shell=True)
            if result.returncode == 0:
                print(f"✅ Node.js {result.stdout.strip()}")
            else:
                print("❌ Node.js not found")
                return False
        except:
            print("❌ Node.js not found")
            return False
            
        # Check npm with different approaches
        npm_commands = ['npm', 'npm.cmd', 'npm.exe']
        npm_found = False
        
        for npm_cmd in npm_commands:
            try:
                result = subprocess.run([npm_cmd, '--version'], capture_output=True, text=True, shell=True)
                if result.returncode == 0:
                    print(f"✅ npm {result.stdout.strip()} (using {npm_cmd})")
                    npm_found = True
                    break
            except:
                continue
        
        if not npm_found:
            print("❌ npm not found - trying alternative approaches...")
            # Try with full path
            try:
                result = subprocess.run(['C:\\Program Files\\nodejs\\npm.cmd', '--version'], 
                                      capture_output=True, text=True)
                if result.returncode == 0:
                    print(f"✅ npm {result.stdout.strip()} (found in Program Files)")
                    npm_found = True
            except:
                pass
        
        return npm_found

    def install_frontend_deps(self):
        """Install frontend dependencies"""
        frontend_dir = Path("chatbot-ui/chatbot-academique")
        if not frontend_dir.exists():
            print("❌ Frontend directory not found")
            return False
            
        print("📦 Installing frontend dependencies...")
        try:
            # Try different npm commands
            npm_commands = ['npm', 'npm.cmd', 'C:\\Program Files\\nodejs\\npm.cmd']
            
            for npm_cmd in npm_commands:
                try:
                    result = subprocess.run([npm_cmd, 'install'], 
                                          cwd=frontend_dir, 
                                          shell=True, 
                                          capture_output=True, 
                                          text=True)
                    if result.returncode == 0:
                        print("✅ Frontend dependencies installed")
                        return True
                    else:
                        print(f"⚠️ npm install failed with {npm_cmd}: {result.stderr}")
                except Exception as e:
                    print(f"⚠️ Failed to run {npm_cmd}: {e}")
                    continue
            
            print("❌ Could not install dependencies with any npm command")
            return False
            
        except Exception as e:
            print(f"❌ Error installing dependencies: {e}")
            return False

    def start_frontend_only(self):
        """Start only the frontend with direct API integration"""
        frontend_dir = Path("chatbot-ui/chatbot-academique")
        if not frontend_dir.exists():
            print("❌ Frontend directory not found")
            return None
            
        print("🚀 Starting Frontend (Budget Mode)...")
        try:
            # Try different npm commands for dev server
            npm_commands = ['npm', 'npm.cmd', 'C:\\Program Files\\nodejs\\npm.cmd']
            
            for npm_cmd in npm_commands:
                try:
                    process = subprocess.Popen(
                        [npm_cmd, 'run', 'dev'],
                        cwd=frontend_dir,
                        shell=True,
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE
                    )
                    self.processes.append(('frontend', process))
                    print(f"✅ Frontend started with {npm_cmd}")
                    return process
                except Exception as e:
                    print(f"⚠️ Failed to start with {npm_cmd}: {e}")
                    continue
            
            print("❌ Could not start frontend with any npm command")
            return None
            
        except Exception as e:
            print(f"❌ Failed to start frontend: {e}")
            return None

    def create_budget_env(self):
        """Create budget-optimized environment file"""
        print("🔧 Creating budget-optimized configuration...")
        
        frontend_env = Path("chatbot-ui/chatbot-academique/.env")
        frontend_env_content = """# 💰 Budget-Friendly Configuration
# Direct API integration to save Modal costs

# 🔥 Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyDjOBmfBAVvCXFv5WpiIYjI7b6w8XJ1tIs
VITE_FIREBASE_AUTH_DOMAIN=calcoussama-21fb8b71.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=calcoussama-21fb8b71
VITE_FIREBASE_STORAGE_BUCKET=calcoussama-21fb8b71.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=426852414544
VITE_FIREBASE_APP_ID=1:426852414544:web:9148e00249f24d6c334d55

# 🤖 Direct Modal API (Budget Mode)
# RAG and SMA services disabled to save costs
VITE_RAG_API_BASE_URL=
VITE_SMA_API_BASE_URL=

# 💰 Cost Optimization Settings
VITE_BUDGET_MODE=true
VITE_MAX_TOKENS=500
VITE_TEMPERATURE=0.7
"""
        
        frontend_env.parent.mkdir(parents=True, exist_ok=True)
        with open(frontend_env, 'w', encoding='utf-8') as f:
            f.write(frontend_env_content)
        print(f"✅ Created budget-optimized config: {frontend_env}")

    def monitor_frontend(self):
        """Monitor frontend startup"""
        print("🔍 Monitoring frontend startup...")
        time.sleep(10)
        
        try:
            import requests
            response = requests.get("http://localhost:5173", timeout=5)
            if response.status_code < 500:
                print("✅ Frontend is running successfully!")
                return True
        except:
            pass
        
        print("⚠️ Frontend may still be starting...")
        return False

    def cleanup(self):
        """Clean up processes"""
        print("\n🧹 Cleaning up...")
        for service_name, process in self.processes:
            try:
                process.terminate()
                process.wait(timeout=5)
                print(f"✅ Stopped {service_name}")
            except:
                try:
                    process.kill()
                    print(f"🔪 Force killed {service_name}")
                except:
                    pass

    def start_budget_mode(self):
        """Start in budget-friendly mode"""
        self.print_banner()
        
        print("💰 Budget Mode: Starting only essential services to preserve your $5 Modal budget")
        print("🎯 This mode uses direct API calls to your Llama3 model without RAG/SMA overhead")
        print()
        
        # Create budget configuration
        self.create_budget_env()
        
        # Check dependencies
        if not self.check_node_npm():
            print("\n❌ Node.js/npm issues detected. Please install Node.js from https://nodejs.org/")
            print("💡 Alternative: You can run the frontend manually:")
            print("   1. cd chatbot-ui/chatbot-academique")
            print("   2. npm install")
            print("   3. npm run dev")
            return False
        
        # Install dependencies
        if not self.install_frontend_deps():
            print("⚠️ Dependency installation failed, but continuing...")
        
        # Start frontend only
        process = self.start_frontend_only()
        if not process:
            print("❌ Failed to start frontend")
            return False
        
        # Monitor startup
        self.monitor_frontend()
        
        print("""
🎉 Budget-Friendly ENIAD Assistant is starting!

💰 COST OPTIMIZATION ACTIVE:
   ✅ Only frontend running (saves server costs)
   ✅ Direct API calls to your Llama3 model
   ✅ No RAG/SMA overhead (saves API calls)
   ✅ Reduced token limits (max 500 tokens)
   ✅ Optimized temperature (0.7)

🌐 Open your browser: http://localhost:5173

💡 BUDGET TIPS:
   • Keep conversations short to save tokens
   • Avoid long responses to minimize costs
   • Monitor your Modal usage regularly
   • Use this mode for testing and demos

Press Ctrl+C to stop the service
        """)
        
        try:
            while True:
                time.sleep(30)
                print("💰 Budget mode running... Monitor your Modal usage!")
        except KeyboardInterrupt:
            print("\n🛑 Shutting down budget mode...")
            self.cleanup()

def main():
    manager = BudgetServiceManager()
    
    try:
        manager.start_budget_mode()
    except Exception as e:
        print(f"❌ Error: {e}")
        manager.cleanup()
        sys.exit(1)

if __name__ == "__main__":
    main()
