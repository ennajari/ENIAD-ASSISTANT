# 🎓 ENIAD Academic Chatbot - Frontend Application

## 📋 Project Description

The **ENIAD Academic Chatbot Frontend** is a modern, responsive React application that provides an intelligent conversational interface for academic assistance. Built with cutting-edge web technologies, it offers seamless integration with multiple AI models, real-time chat functionality, and comprehensive multilingual support.

## ✨ Main Features

### 🤖 **Multi-Model AI Integration**
- **Google Gemini 1.5 Flash** - Primary conversational AI
- **Custom Llama3 8B** - Fine-tuned academic model via Modal
- **RAG System Integration** - Document-based knowledge retrieval
- **SMA (Smart Multi-Agent)** - Web intelligence and real-time scraping

### 💬 **Advanced Chat Interface**
- **Real-time messaging** with typing indicators
- **Message history** with persistent storage
- **Message editing** and deletion capabilities
- **Copy-to-clipboard** functionality
- **Markdown rendering** for rich text responses
- **Auto-scroll** to latest messages

### 🎤 **Speech & Audio Features**
- **Text-to-Speech (TTS)** with ElevenLabs integration
- **Speech Recognition** using Web Speech API
- **Voice controls** with floating panel interface
- **Multi-language voice support** (French, Arabic, English)
- **Real-time audio progress** tracking

### 🌍 **Multilingual Excellence**
- **French & Arabic** primary language support
- **RTL (Right-to-Left)** layout for Arabic
- **Dynamic language switching** without page reload
- **Cultural adaptations** for date/time formats
- **Localized UI components** and messages

### 🎨 **Modern UI/UX Design**
- **Material-UI (MUI)** component library
- **Tailwind CSS** utility-first styling
- **Dark/Light theme** toggle
- **Glassmorphism effects** with backdrop blur
- **Responsive design** for all screen sizes
- **Accessibility compliant** with ARIA labels

### 🔐 **Authentication & Security**
- **Firebase Authentication** with Google OAuth
- **Academic email restriction** (@ump.ma domain)
- **Secure API communication** with CORS protection
- **Environment variable protection** for sensitive data
- **Real-time user state management**

## 🛠️ Technologies & Frameworks

### **Core Frontend Stack**
- **React 18.3.1** - Modern functional components with hooks
- **Vite 5.2.11** - Ultra-fast build tool and development server
- **React Router DOM 6.23.1** - Client-side routing
- **TypeScript Support** - Type-safe development (optional)

### **UI Framework & Styling**
- **Material-UI (MUI) 5.15.15** - Complete component library
  - `@mui/material` - Core components
  - `@mui/icons-material` - Icon library
  - `@emotion/react` & `@emotion/styled` - CSS-in-JS
- **Tailwind CSS 3.4.3** - Utility-first CSS framework
- **Custom Design System** - ENIAD branding and themes

### **State Management**
- **React Context API** - Global state management
- **Custom Hooks** - Reusable stateful logic
- **Local Storage** - Persistent data storage
- **Firebase Firestore** - Real-time database sync

### **API Integration**
- **Axios 1.6.8** - HTTP client for API requests
- **Firebase SDK 10.12.2** - Authentication and database
- **Custom API Services** - RAG, SMA, and AI model integration

### **Development Tools**
- **ESLint** - Code linting and quality
- **PostCSS & Autoprefixer** - CSS processing
- **Vite Plugins** - React SWC for fast compilation
- **Hot Module Replacement** - Instant development updates

## 📁 Folder Structure

```
chatbot-academique/
├── 📁 public/                          # Static Assets
│   ├── 📄 index.html                   # Main HTML template
│   ├── 🖼️ favicon.ico                  # Browser icon
│   └── 🖼️ logo-eniad.png              # ENIAD logo
├── 📁 src/                             # Source Code
│   ├── 📁 components/                  # React Components
│   │   ├── 📄 Chat.jsx                 # Main chat container
│   │   ├── 📄 ChatContent.jsx          # Message display area
│   │   ├── 📄 ChatHeader.jsx           # Top navigation bar
│   │   ├── 📄 ChatInput.jsx            # Message input with voice
│   │   ├── 📄 ChatSidebar.jsx          # Conversation history
│   │   ├── 📄 MessageBubble.jsx        # Individual message component
│   │   ├── 📄 ModelSelector.jsx        # AI model selection
│   │   ├── 📄 SettingsDialog.jsx       # User preferences modal
│   │   ├── 📄 TTSFloatingPanel.jsx     # Voice control panel
│   │   ├── 📄 UserAvatar.jsx           # User profile component
│   │   └── 📁 Debug/                   # Development components
│   ├── 📁 services/                    # API Integration
│   │   ├── 📄 geminiService.js         # Google Gemini AI
│   │   ├── 📄 realRagService.js        # RAG system integration
│   │   ├── 📄 realSmaService.js        # SMA system integration
│   │   ├── 📄 modalApiService.js       # Custom Llama3 model
│   │   ├── 📄 firebaseStorageService.js # Firebase operations
│   │   └── 📄 speechService.js         # Speech synthesis
│   ├── 📁 contexts/                    # React Contexts
│   │   ├── 📄 AuthContext.jsx          # Authentication state
│   │   └── 📄 LanguageContext.jsx      # Language management
│   ├── 📁 hooks/                       # Custom Hooks
│   │   ├── 📄 useChatState.js          # Chat state management
│   │   ├── 📄 useTTSState.js           # Text-to-speech state
│   │   ├── 📄 useSpeechSynthesis.js    # Voice synthesis
│   │   └── 📄 useThemeMode.js          # Theme management
│   ├── 📁 theme/                       # Material-UI Theme
│   │   └── 📄 theme.js                 # Custom theme configuration
│   ├── 📁 utils/                       # Helper Functions
│   │   ├── 📄 chatHandlers.js          # Chat logic handlers
│   │   ├── 📄 translations.js          # Multilingual support
│   │   └── 📄 firestore.js             # Database utilities
│   ├── 📁 constants/                   # Configuration
│   │   └── 📄 config.js                # App configuration
│   ├── 📄 App.jsx                      # Main application component
│   ├── 📄 main.jsx                     # Application entry point
│   ├── 📄 index.css                    # Global styles
│   └── 📄 firebase.js                  # Firebase configuration
├── 📄 package.json                     # Dependencies & scripts
├── 📄 vite.config.js                   # Vite configuration
├── 📄 tailwind.config.js               # Tailwind CSS config
├── 📄 postcss.config.js                # PostCSS configuration
├── 📄 eslint.config.js                 # ESLint configuration
└── 📄 README.md                        # This documentation
```

## 🚀 Installation & Setup

### **Prerequisites**
- **Node.js 18+** and npm
- **Git** for cloning the repository
- **Modern web browser** with ES6+ support

### **Quick Start**

1. **Clone the repository**
```bash
git clone https://github.com/ennajari/ENIAD-ASSISTANT.git
cd ENIAD-ASSISTANT/chatbot-ui/chatbot-academique
```

2. **Install dependencies**
```bash
npm install --legacy-peer-deps
```

3. **Environment configuration**
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_RAG_API_URL=http://localhost:8000
VITE_SMA_API_URL=http://localhost:8001
```

4. **Start development server**
```bash
npm run dev
```

5. **Access the application**
- Open http://localhost:5173 in your browser
- The application will automatically reload on code changes

### **Build for Production**
```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## 🔌 API Integrations

### **Backend Services**
- **RAG API** (Port 8000) - Document retrieval and knowledge base
- **SMA API** (Port 8001) - Smart multi-agent web intelligence
- **Modal API** - Custom Llama3 model hosting
- **Firebase** - Authentication and real-time database

### **External APIs**
- **Google Gemini** - Primary conversational AI
- **ElevenLabs** - Premium text-to-speech synthesis
- **Web Speech API** - Browser-native speech recognition

### **API Configuration**
The application uses Vite's proxy configuration for seamless API integration:

```javascript
// vite.config.js proxy settings
proxy: {
  '/api/rag': 'http://localhost:8000',
  '/api/sma': 'http://localhost:8001',
  '/api/llama': 'https://modal-endpoint.com'
}
```

## 🧪 Development & Testing

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run clean        # Clean build artifacts
npm run fresh-install # Clean install dependencies
```

### **Development Features**
- **Hot Module Replacement** - Instant updates during development
- **Error Boundaries** - Graceful error handling and recovery
- **Debug Components** - Testing interfaces for API connections
- **Console Logging** - Comprehensive development logging
- **Performance Monitoring** - Built-in performance metrics

---

**Made with ❤️ for Academic Excellence**

*Empowering education through intelligent conversation*
