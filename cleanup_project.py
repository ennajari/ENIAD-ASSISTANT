#!/usr/bin/env python3
"""
🧹 ENIAD Project Cleanup & Optimization
Removes unused files, optimizes imports, and cleans up the codebase
"""

import os
import shutil
import json
import re
from pathlib import Path

class ProjectCleaner:
    def __init__(self):
        self.removed_files = []
        self.optimized_files = []
        self.errors = []
        
    def print_banner(self):
        print("""
╔══════════════════════════════════════════════════════════════╗
║                🧹 ENIAD Project Cleanup                      ║
║                                                              ║
║  Removing unused files and optimizing codebase              ║
╚══════════════════════════════════════════════════════════════╝
        """)

    def remove_unused_files(self):
        """Remove unused and redundant files"""
        print("🗑️ Removing unused files...")
        
        # Files to remove
        files_to_remove = [
            # Old test files
            "test_final_persistence_fix.html",
            "test_new_api_endpoint.html",
            
            # Redundant startup scripts
            "start_frontend_only.bat",
            "start_simple.bat",
            
            # Old dependency scripts
            "fix-dependencies.bat",
            "fix-dependencies.sh",
            
            # Unused RAG folder (we have RAG_Project)
            "RAG",
            
            # Old configuration files
            "chatbot-ui/chatbot-academique/vite.config.js.backup",
            
            # Temporary files
            "*.tmp",
            "*.bak",
            "*.old",
        ]
        
        for file_pattern in files_to_remove:
            if "*" in file_pattern:
                # Handle wildcards
                for file_path in Path(".").rglob(file_pattern):
                    if file_path.exists():
                        try:
                            if file_path.is_dir():
                                shutil.rmtree(file_path)
                            else:
                                file_path.unlink()
                            self.removed_files.append(str(file_path))
                            print(f"✅ Removed: {file_path}")
                        except Exception as e:
                            self.errors.append(f"Failed to remove {file_path}: {e}")
            else:
                file_path = Path(file_pattern)
                if file_path.exists():
                    try:
                        if file_path.is_dir():
                            shutil.rmtree(file_path)
                        else:
                            file_path.unlink()
                        self.removed_files.append(str(file_path))
                        print(f"✅ Removed: {file_path}")
                    except Exception as e:
                        self.errors.append(f"Failed to remove {file_path}: {e}")

    def clean_node_modules(self):
        """Clean node_modules and package-lock.json for fresh install"""
        print("📦 Cleaning node_modules...")
        
        frontend_dir = Path("chatbot-ui/chatbot-academique")
        if frontend_dir.exists():
            node_modules = frontend_dir / "node_modules"
            package_lock = frontend_dir / "package-lock.json"
            
            if node_modules.exists():
                try:
                    shutil.rmtree(node_modules)
                    print("✅ Removed node_modules")
                    self.removed_files.append(str(node_modules))
                except Exception as e:
                    self.errors.append(f"Failed to remove node_modules: {e}")
            
            if package_lock.exists():
                try:
                    package_lock.unlink()
                    print("✅ Removed package-lock.json")
                    self.removed_files.append(str(package_lock))
                except Exception as e:
                    self.errors.append(f"Failed to remove package-lock.json: {e}")

    def optimize_vite_config(self):
        """Optimize Vite configuration for production"""
        print("⚡ Optimizing Vite configuration...")
        
        vite_config_path = Path("chatbot-ui/chatbot-academique/vite.config.js")
        if vite_config_path.exists():
            try:
                with open(vite_config_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Remove old proxy configuration (not needed for Modal API)
                optimized_content = """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'ENIAD Assistant',
        short_name: 'ENIAD',
        description: 'Assistant académique ENIAD',
        theme_color: '#2c5282',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 5173,
    host: true
  }
})"""
                
                with open(vite_config_path, 'w', encoding='utf-8') as f:
                    f.write(optimized_content)
                
                print("✅ Optimized vite.config.js")
                self.optimized_files.append(str(vite_config_path))
                
            except Exception as e:
                self.errors.append(f"Failed to optimize vite.config.js: {e}")

    def optimize_package_json(self):
        """Optimize package.json scripts"""
        print("📋 Optimizing package.json...")
        
        package_json_path = Path("chatbot-ui/chatbot-academique/package.json")
        if package_json_path.exists():
            try:
                with open(package_json_path, 'r', encoding='utf-8') as f:
                    package_data = json.load(f)
                
                # Optimize scripts
                package_data["scripts"] = {
                    "dev": "vite",
                    "build": "vite build",
                    "preview": "vite preview",
                    "lint": "eslint . --fix",
                    "clean": "rm -rf dist node_modules package-lock.json",
                    "fresh-install": "npm run clean && npm install"
                }
                
                # Add optimization settings
                package_data["browserslist"] = [
                    "> 1%",
                    "last 2 versions",
                    "not dead"
                ]
                
                with open(package_json_path, 'w', encoding='utf-8') as f:
                    json.dump(package_data, f, indent=2, ensure_ascii=False)
                
                print("✅ Optimized package.json")
                self.optimized_files.append(str(package_json_path))
                
            except Exception as e:
                self.errors.append(f"Failed to optimize package.json: {e}")

    def create_optimized_env(self):
        """Create optimized .env file"""
        print("🔧 Creating optimized .env file...")
        
        env_path = Path("chatbot-ui/chatbot-academique/.env")
        optimized_env_content = """# 💰 ENIAD Budget-Optimized Configuration

# 🔥 Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyDjOBmfBAVvCXFv5WpiIYjI7b6w8XJ1tIs
VITE_FIREBASE_AUTH_DOMAIN=calcoussama-21fb8b71.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=calcoussama-21fb8b71
VITE_FIREBASE_STORAGE_BUCKET=calcoussama-21fb8b71.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=426852414544
VITE_FIREBASE_APP_ID=1:426852414544:web:9148e00249f24d6c334d55

# 💰 Budget Mode (Optimized for $5 Modal Budget)
VITE_BUDGET_MODE=true
VITE_MAX_TOKENS=400
VITE_MAX_CONTEXT_MESSAGES=3
VITE_TEMPERATURE=0.7

# 🤖 Direct Modal API (Budget Mode - No RAG/SMA overhead)
VITE_RAG_API_BASE_URL=
VITE_SMA_API_BASE_URL=

# 🔊 Speech Services (Free Tier Only)
VITE_ELEVENLABS_API_KEY=
VITE_AZURE_SPEECH_KEY=
VITE_AZURE_SPEECH_REGION=eastus

# 📊 Performance Optimization
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=false
VITE_CHUNK_SIZE_WARNING_LIMIT=1000
"""
        
        try:
            with open(env_path, 'w', encoding='utf-8') as f:
                f.write(optimized_env_content)
            print("✅ Created optimized .env file")
            self.optimized_files.append(str(env_path))
        except Exception as e:
            self.errors.append(f"Failed to create .env file: {e}")

    def clean_cache_files(self):
        """Remove cache and temporary files"""
        print("🧹 Cleaning cache files...")
        
        cache_patterns = [
            "**/.DS_Store",
            "**/Thumbs.db",
            "**/*.log",
            "**/.vscode/settings.json",
            "**/dist",
            "**/__pycache__",
            "**/*.pyc",
            "**/.pytest_cache",
            "**/node_modules/.cache"
        ]
        
        for pattern in cache_patterns:
            for file_path in Path(".").rglob(pattern):
                if file_path.exists():
                    try:
                        if file_path.is_dir():
                            shutil.rmtree(file_path)
                        else:
                            file_path.unlink()
                        self.removed_files.append(str(file_path))
                        print(f"✅ Cleaned: {file_path}")
                    except Exception as e:
                        self.errors.append(f"Failed to clean {file_path}: {e}")

    def create_startup_script(self):
        """Create optimized startup script"""
        print("🚀 Creating optimized startup script...")
        
        startup_content = """@echo off
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

cd chatbot-ui\\chatbot-academique

echo 📦 Installing dependencies...
npm install

echo 🚀 Starting development server...
npm run dev

pause"""
        
        try:
            with open("start_eniad_optimized.bat", 'w', encoding='utf-8') as f:
                f.write(startup_content)
            print("✅ Created optimized startup script")
            self.optimized_files.append("start_eniad_optimized.bat")
        except Exception as e:
            self.errors.append(f"Failed to create startup script: {e}")

    def generate_report(self):
        """Generate cleanup report"""
        print("\n" + "="*60)
        print("📊 CLEANUP REPORT")
        print("="*60)
        
        print(f"🗑️ Files Removed: {len(self.removed_files)}")
        for file in self.removed_files[:10]:  # Show first 10
            print(f"   • {file}")
        if len(self.removed_files) > 10:
            print(f"   ... and {len(self.removed_files) - 10} more")
        
        print(f"\n⚡ Files Optimized: {len(self.optimized_files)}")
        for file in self.optimized_files:
            print(f"   • {file}")
        
        if self.errors:
            print(f"\n❌ Errors: {len(self.errors)}")
            for error in self.errors:
                print(f"   • {error}")
        
        print("\n🎉 Cleanup completed!")
        print("\n💡 Next steps:")
        print("   1. Run: start_eniad_optimized.bat")
        print("   2. Open: http://localhost:5173")
        print("   3. Test your optimized ENIAD Assistant")

    def run_cleanup(self):
        """Run complete cleanup process"""
        self.print_banner()
        
        try:
            self.remove_unused_files()
            self.clean_node_modules()
            self.optimize_vite_config()
            self.optimize_package_json()
            self.create_optimized_env()
            self.clean_cache_files()
            self.create_startup_script()
            self.generate_report()
            
        except Exception as e:
            print(f"❌ Cleanup failed: {e}")
            return False
        
        return True

def main():
    cleaner = ProjectCleaner()
    success = cleaner.run_cleanup()
    
    if success:
        print("\n✅ Project cleanup completed successfully!")
    else:
        print("\n❌ Project cleanup failed!")
    
    return success

if __name__ == "__main__":
    main()
