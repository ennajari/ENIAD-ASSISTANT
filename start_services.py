#!/usr/bin/env python3
"""
ENIAD AI Assistant - Service Startup Script
Starts all required services for testing
"""

import subprocess
import time
import os
import sys
import signal
import threading
from pathlib import Path

class ServiceManager:
    def __init__(self):
        self.processes = []
        self.running = True
        
    def start_service(self, name, command, cwd=None, wait_time=3):
        """Start a service in a separate process"""
        print(f"🚀 Starting {name}...")
        try:
            if cwd and not os.path.exists(cwd):
                print(f"❌ Directory not found: {cwd}")
                return None
                
            process = subprocess.Popen(
                command,
                shell=True,
                cwd=cwd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            self.processes.append({
                'name': name,
                'process': process,
                'command': command,
                'cwd': cwd
            })
            
            print(f"✅ {name} started (PID: {process.pid})")
            time.sleep(wait_time)
            return process
            
        except Exception as e:
            print(f"❌ Failed to start {name}: {e}")
            return None
    
    def check_service_status(self, process_info):
        """Check if a service is still running"""
        if process_info['process'].poll() is None:
            return True
        else:
            print(f"⚠️ {process_info['name']} has stopped")
            return False
    
    def stop_all_services(self):
        """Stop all running services"""
        print("\n🛑 Stopping all services...")
        self.running = False
        
        for process_info in self.processes:
            try:
                process = process_info['process']
                if process.poll() is None:
                    print(f"🛑 Stopping {process_info['name']}...")
                    process.terminate()
                    
                    # Wait for graceful shutdown
                    try:
                        process.wait(timeout=5)
                    except subprocess.TimeoutExpired:
                        print(f"⚡ Force killing {process_info['name']}...")
                        process.kill()
                        
            except Exception as e:
                print(f"❌ Error stopping {process_info['name']}: {e}")
        
        print("✅ All services stopped")
    
    def monitor_services(self):
        """Monitor services and restart if needed"""
        while self.running:
            time.sleep(10)
            for process_info in self.processes:
                if not self.check_service_status(process_info):
                    if self.running:
                        print(f"🔄 Restarting {process_info['name']}...")
                        # Remove the dead process
                        self.processes.remove(process_info)
                        # Restart the service
                        self.start_service(
                            process_info['name'],
                            process_info['command'],
                            process_info['cwd']
                        )
    
    def signal_handler(self, signum, frame):
        """Handle Ctrl+C gracefully"""
        print(f"\n📡 Received signal {signum}")
        self.stop_all_services()
        sys.exit(0)

def main():
    """Main function to start all services"""
    print("🎯 ENIAD AI Assistant - Service Manager")
    print("=" * 50)
    
    manager = ServiceManager()
    
    # Register signal handlers
    signal.signal(signal.SIGINT, manager.signal_handler)
    signal.signal(signal.SIGTERM, manager.signal_handler)
    
    # Check if required files exist
    required_files = [
        "simple_rag_system.py",
        "working_sma_service.py",
        "eniad-api-server/server.js",
        "chatbot-ui/chatbot-academique/package.json"
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    if missing_files:
        print("❌ Missing required files:")
        for file_path in missing_files:
            print(f"   - {file_path}")
        print("\nPlease ensure all files are in place before starting services.")
        return
    
    print("✅ All required files found")
    print("\n🚀 Starting services...")
    
    # Start RAG System
    manager.start_service(
        "RAG System",
        "python simple_rag_system.py",
        wait_time=5
    )
    
    # Start Enhanced API Server
    manager.start_service(
        "Enhanced API Server",
        "node server.js",
        cwd="eniad-api-server",
        wait_time=3
    )
    
    # Start SMA Service
    manager.start_service(
        "SMA Service",
        "python working_sma_service.py",
        wait_time=3
    )
    
    # Start Frontend (optional - can be started manually)
    frontend_choice = input("\n🌐 Start frontend development server? (y/n): ").lower().strip()
    if frontend_choice in ['y', 'yes']:
        manager.start_service(
            "Frontend Dev Server",
            "npm run dev",
            cwd="chatbot-ui/chatbot-academique",
            wait_time=5
        )
    
    print("\n" + "=" * 50)
    print("✅ All services started successfully!")
    print("\n📊 Service URLs:")
    print("   🧠 RAG System: http://localhost:8000")
    print("   🔧 Enhanced API: http://localhost:3001")
    print("   🤖 SMA Service: http://localhost:8001")
    if frontend_choice in ['y', 'yes']:
        print("   🌐 Frontend: http://localhost:5174")
    
    print("\n💡 Tips:")
    print("   - Check service status in browser")
    print("   - Press Ctrl+C to stop all services")
    print("   - Services will auto-restart if they crash")
    
    print("\n🔍 Monitoring services... (Press Ctrl+C to stop)")
    
    # Start monitoring in a separate thread
    monitor_thread = threading.Thread(target=manager.monitor_services)
    monitor_thread.daemon = True
    monitor_thread.start()
    
    try:
        # Keep the main thread alive
        while manager.running:
            time.sleep(1)
    except KeyboardInterrupt:
        manager.signal_handler(signal.SIGINT, None)

if __name__ == "__main__":
    main()
