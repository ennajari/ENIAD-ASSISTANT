import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration - Use direct values if env vars are not working
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDjOBmfBAVvCXFv5WpiIYjI7b6w8XJ1tIs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "calcoussama-21fb8b71.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "calcoussama-21fb8b71",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "calcoussama-21fb8b71.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "426852414544",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:426852414544:web:9148e00249f24d6c334d55"
};

// Debug environment variables (only in development)
if (import.meta.env.DEV) {
  console.log('🔧 Firebase Environment Variables Check:', {
    hasApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
    hasAuthDomain: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    hasProjectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
    hasStorageBucket: !!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    hasMessagingSenderId: !!import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    hasAppId: !!import.meta.env.VITE_FIREBASE_APP_ID,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    // Show actual values for debugging (be careful in production)
    actualValues: {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.substring(0, 10) + '...',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
    }
  });
}

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredKeys = [
    { key: 'apiKey', value: firebaseConfig.apiKey },
    { key: 'authDomain', value: firebaseConfig.authDomain },
    { key: 'projectId', value: firebaseConfig.projectId },
    { key: 'storageBucket', value: firebaseConfig.storageBucket },
    { key: 'messagingSenderId', value: firebaseConfig.messagingSenderId },
    { key: 'appId', value: firebaseConfig.appId }
  ];

  const missingKeys = requiredKeys.filter(item =>
    !item.value ||
    item.value === 'undefined' ||
    item.value === 'your_api_key_here' ||
    item.value === 'your_project_id' ||
    item.value === 'your_sender_id' ||
    item.value === 'your_app_id'
  );

  if (missingKeys.length > 0) {
    console.error('❌ Missing or invalid Firebase configuration keys:', missingKeys.map(item => item.key));
    console.error('Current config values:', {
      ...firebaseConfig,
      apiKey: firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 10) + '...' : 'MISSING'
    });
    console.error('Please check your .env file and ensure all VITE_FIREBASE_* variables are set correctly');

    // Provide helpful error message
    const envExample = `
❗ Example .env file (replace with your actual values):
VITE_FIREBASE_API_KEY=AIzaSyExample123456789
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

📋 Setup steps:
1. Go to https://console.firebase.google.com
2. Create or select your project
3. Go to Project Settings > General > Your apps
4. Copy the config values to your .env file
5. Restart your development server
    `;
    console.error(envExample);

    return { isValid: false, missingKeys: missingKeys.map(item => item.key) };
  }

  return { isValid: true, missingKeys: [] };
};

// Initialize Firebase
let app = null;
let auth = null;
let db = null;
let googleProvider = null;
let initializationError = null;

try {
  const validation = validateFirebaseConfig();

  if (validation.isValid) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    // Initialize Google Auth Provider with academic email restriction
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      hd: 'ump.ma', // Restrict to academic domain (University Mohammed Premier)
      prompt: 'select_account'
    });

    // Configure auth settings
    auth.useDeviceLanguage();

    console.log('✅ Firebase initialized successfully');
    console.log('Auth domain:', firebaseConfig.authDomain);
    console.log('Project ID:', firebaseConfig.projectId);
    console.log('Google Provider configured for academic emails (ump.ma)');
  } else {
    initializationError = {
      code: 'config/missing-keys',
      message: `Missing Firebase configuration keys: ${validation.missingKeys.join(', ')}`,
      missingKeys: validation.missingKeys
    };
    console.error('❌ Firebase initialization failed:', initializationError.message);
  }
} catch (error) {
  initializationError = {
    code: 'config/initialization-error',
    message: error.message,
    originalError: error
  };
  console.error('❌ Firebase initialization error:', error);
}

// Export Firebase instances and utilities
export { auth, db, googleProvider, initializationError };
export const isFirebaseConfigured = () => auth !== null;
export const getFirebaseError = () => initializationError;
export default app;