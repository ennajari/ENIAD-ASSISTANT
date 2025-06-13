#!/usr/bin/env python3
"""
🚀 ENIAD Complete Service Launcher
Starts all services required for the ENIAD AI Assistant:
- RAG System (FastAPI)
- SMA Service (FastAPI) 
- API Server (Express.js)
- Frontend (React + Vite)
"""

import subprocess
import sys
import os
import time
import threading
import signal
import requests
from pathlib import Path

class ServiceManager:
    def __init__(self):
        self.processes = []
        self.services = {
            'rag': {'name': 'RAG System', 'port': 8000, 'status': 'stopped'},
            'sma': {'name': 'SMA Service', 'port': 8001, 'status': 'stopped'},
            'api': {'name': 'API Server', 'port': 3000, 'status': 'stopped'},
            'frontend': {'name': 'Frontend', 'port': 5173, 'status': 'stopped'}
        }
        
    def print_banner(self):
        print("""
╔══════════════════════════════════════════════════════════════╗
║                🎓 ENIAD AI Assistant Launcher                ║
║                                                              ║
║  🤖 RAG System      → http://localhost:8000                  ║
║  🧠 SMA Service     → http://localhost:8001                  ║
║  📡 API Server      → http://localhost:3000                  ║
║  🌐 Frontend        → http://localhost:5173                  ║
║                                                              ║
║  🎯 Complete AI Assistant with RAG + SMA + Llama3 Model     ║
╚══════════════════════════════════════════════════════════════╝
        """)

    def check_dependencies(self):
        """Check if required dependencies are installed"""
        print("🔍 Checking dependencies...")
        
        # Check Python
        try:
            python_version = sys.version_info
            if python_version.major < 3 or (python_version.major == 3 and python_version.minor < 8):
                print("❌ Python 3.8+ required")
                return False
            print(f"✅ Python {python_version.major}.{python_version.minor}")
        except:
            print("❌ Python not found")
            return False
            
        # Check Node.js
        try:
            result = subprocess.run(['node', '--version'], capture_output=True, text=True)
            if result.returncode == 0:
                print(f"✅ Node.js {result.stdout.strip()}")
            else:
                print("❌ Node.js not found")
                return False
        except:
            print("❌ Node.js not found")
            return False
            
        # Check npm
        try:
            result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
            if result.returncode == 0:
                print(f"✅ npm {result.stdout.strip()}")
            else:
                print("❌ npm not found")
                return False
        except:
            print("❌ npm not found")
            return False
            
        return True

    def install_python_dependencies(self):
        """Install Python dependencies for RAG and SMA services"""
        print("\n📦 Installing Python dependencies...")
        
        # Install RAG dependencies
        rag_requirements = Path("RAG_Project/src/requirements.txt")
        if rag_requirements.exists():
            print("📚 Installing RAG dependencies...")
            subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', str(rag_requirements)])
        
        # Install SMA dependencies
        sma_requirements = Path("SMA_Service/requirements.txt")
        if sma_requirements.exists():
            print("🧠 Installing SMA dependencies...")
            subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', str(sma_requirements)])

    def install_node_dependencies(self):
        """Install Node.js dependencies"""
        print("\n📦 Installing Node.js dependencies...")
        
        # Install API server dependencies
        api_dir = Path("eniad-api-server")
        if api_dir.exists():
            print("📡 Installing API server dependencies...")
            subprocess.run(['npm', 'install'], cwd=api_dir)
        
        # Install frontend dependencies
        frontend_dir = Path("chatbot-ui/chatbot-academique")
        if frontend_dir.exists():
            print("🌐 Installing frontend dependencies...")
            subprocess.run(['npm', 'install'], cwd=frontend_dir)

    def start_rag_service(self):
        """Start RAG System (FastAPI)"""
        print("🚀 Starting RAG System...")
        rag_dir = Path("RAG_Project/src")
        if not rag_dir.exists():
            print("❌ RAG_Project/src directory not found")
            return None
            
        try:
            process = subprocess.Popen(
                [sys.executable, '-m', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8000', '--reload'],
                cwd=rag_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            self.processes.append(('rag', process))
            self.services['rag']['status'] = 'starting'
            return process
        except Exception as e:
            print(f"❌ Failed to start RAG service: {e}")
            return None

    def start_sma_service(self):
        """Start SMA Service (FastAPI)"""
        print("🚀 Starting SMA Service...")
        sma_dir = Path("SMA_Service")
        if not sma_dir.exists():
            print("❌ SMA_Service directory not found")
            return None
            
        try:
            process = subprocess.Popen(
                [sys.executable, '-m', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8001', '--reload'],
                cwd=sma_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            self.processes.append(('sma', process))
            self.services['sma']['status'] = 'starting'
            return process
        except Exception as e:
            print(f"❌ Failed to start SMA service: {e}")
            return None

    def start_api_server(self):
        """Start API Server (Express.js)"""
        print("🚀 Starting API Server...")
        api_dir = Path("eniad-api-server")
        if not api_dir.exists():
            print("❌ eniad-api-server directory not found")
            return None
            
        try:
            process = subprocess.Popen(
                ['node', 'server.js'],
                cwd=api_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            self.processes.append(('api', process))
            self.services['api']['status'] = 'starting'
            return process
        except Exception as e:
            print(f"❌ Failed to start API server: {e}")
            return None

    def start_frontend(self):
        """Start Frontend (React + Vite)"""
        print("🚀 Starting Frontend...")
        frontend_dir = Path("chatbot-ui/chatbot-academique")
        if not frontend_dir.exists():
            print("❌ chatbot-ui/chatbot-academique directory not found")
            return None
            
        try:
            process = subprocess.Popen(
                ['npm', 'run', 'dev'],
                cwd=frontend_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            self.processes.append(('frontend', process))
            self.services['frontend']['status'] = 'starting'
            return process
        except Exception as e:
            print(f"❌ Failed to start frontend: {e}")
            return None

    def check_service_health(self, service_name, port, max_retries=30):
        """Check if a service is healthy"""
        for i in range(max_retries):
            try:
                response = requests.get(f"http://localhost:{port}", timeout=2)
                if response.status_code < 500:  # Any response except server error
                    self.services[service_name]['status'] = 'running'
                    print(f"✅ {self.services[service_name]['name']} is healthy")
                    return True
            except:
                pass
            time.sleep(2)
        
        self.services[service_name]['status'] = 'failed'
        print(f"❌ {self.services[service_name]['name']} failed to start")
        return False

    def monitor_services(self):
        """Monitor all services and check their health"""
        print("\n🔍 Monitoring services...")
        
        # Wait a bit for services to start
        time.sleep(5)
        
        # Check each service
        health_checks = [
            ('rag', 8000),
            ('sma', 8001),
            ('api', 3000),
            ('frontend', 5173)
        ]
        
        for service_name, port in health_checks:
            if any(name == service_name for name, _ in self.processes):
                threading.Thread(
                    target=self.check_service_health,
                    args=(service_name, port),
                    daemon=True
                ).start()

    def print_status(self):
        """Print current status of all services"""
        print("\n" + "="*60)
        print("📊 SERVICE STATUS")
        print("="*60)
        for service_id, service_info in self.services.items():
            status_icon = {
                'stopped': '⭕',
                'starting': '🟡',
                'running': '✅',
                'failed': '❌'
            }.get(service_info['status'], '❓')
            
            print(f"{status_icon} {service_info['name']:<15} → http://localhost:{service_info['port']}")
        print("="*60)

    def cleanup(self):
        """Clean up all processes"""
        print("\n🧹 Cleaning up processes...")
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

    def setup_environment(self):
        """Setup environment files automatically"""
        print("🔧 Setting up environment...")
        try:
            # Run environment setup
            subprocess.run([sys.executable, 'setup_environment.py'], check=True)
            print("✅ Environment setup complete")
            return True
        except Exception as e:
            print(f"⚠️ Environment setup failed: {e}")
            print("Continuing with existing configuration...")
            return False

    def start_all(self):
        """Start all services"""
        self.print_banner()

        if not self.check_dependencies():
            print("❌ Dependency check failed. Please install required dependencies.")
            return False

        # Setup environment first
        self.setup_environment()

        # Install dependencies
        self.install_python_dependencies()
        self.install_node_dependencies()

        print("\n🚀 Starting all services...")

        # Start services in order
        services_to_start = [
            ('RAG System', self.start_rag_service),
            ('SMA Service', self.start_sma_service),
            ('API Server', self.start_api_server),
            ('Frontend', self.start_frontend)
        ]

        for service_name, start_func in services_to_start:
            process = start_func()
            if process:
                print(f"✅ {service_name} started")
                time.sleep(3)  # Wait between starts
            else:
                print(f"❌ Failed to start {service_name}")

        # Monitor services
        self.monitor_services()

        # Print initial status
        time.sleep(15)
        self.print_status()

        print("""
🎉 All services started! Your ENIAD AI Assistant is ready!

🌐 Open your browser and go to: http://localhost:5173

📋 Available endpoints:
   • Frontend:    http://localhost:5173 (Main Interface)
   • RAG API:     http://localhost:8000/docs (Documentation)
   • SMA API:     http://localhost:8001/docs (Documentation)
   • API Server:  http://localhost:3000 (Integration Layer)

🤖 Features available:
   ✅ RAG System - Document retrieval and context
   ✅ SMA Service - Real-time web intelligence
   ✅ Llama3 Model - Your custom AI model
   ✅ Firebase - Conversation persistence
   ✅ Multilingual - French, English, Arabic

Press Ctrl+C to stop all services
        """)

        try:
            # Keep running until interrupted
            while True:
                time.sleep(30)
                self.print_status()
        except KeyboardInterrupt:
            print("\n🛑 Shutting down...")
            self.cleanup()

def main():
    manager = ServiceManager()
    
    # Handle Ctrl+C gracefully
    def signal_handler(sig, frame):
        print("\n🛑 Received interrupt signal...")
        manager.cleanup()
        sys.exit(0)
    
    signal.signal(signal.SIGINT, signal_handler)
    
    try:
        manager.start_all()
    except Exception as e:
        print(f"❌ Error: {e}")
        manager.cleanup()
        sys.exit(1)

if __name__ == "__main__":
    main()
