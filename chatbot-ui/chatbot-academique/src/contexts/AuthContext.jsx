import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import firebaseStorageService from '../services/firebaseStorageService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔐 Auth state changed:', user ? 'User logged in' : 'User logged out');

      if (user) {
        try {
          // Store user profile with academic validation
          const userProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            domain: user.email.split('@')[1],
            lastLogin: new Date().toISOString(),
            emailVerified: user.emailVerified
          };

          // Save user profile to Firebase
          await firebaseStorageService.saveUserProfile(user);

          setUser(userProfile);
          setError(null);
          console.log('✅ User authenticated:', userProfile);

          // Note: Conversation loading is now handled by conversation state manager in App.jsx
          // This prevents conflicts and ensures proper state management

        } catch (error) {
          console.error('❌ Error during user setup:', error);
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            domain: user.email.split('@')[1],
            lastLogin: new Date().toISOString(),
            emailVerified: user.emailVerified
          });
          // Don't block login for Firebase storage errors
        }
      } else {
        setUser(null);
        setError(null);
        // Clear local storage when user logs out
        localStorage.removeItem('conversationHistory');
        localStorage.removeItem('currentChatId');
        console.log('🧹 User logged out, local data cleared');
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Save conversation to Firebase when user is logged in
  const saveConversation = async (conversation) => {
    if (user && conversation) {
      try {
        await firebaseStorageService.saveConversation(user.uid, conversation);
        console.log('✅ Conversation saved to Firebase:', conversation.id);
      } catch (error) {
        console.warn('⚠️ Failed to save conversation to Firebase:', error);
      }
    }
  };

  // Google Sign In with Firebase storage integration
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!googleProvider) {
        throw new Error('Google provider not configured');
      }

      console.log('🔐 Initiating Google Academic Sign-In...');
      const result = await signInWithPopup(auth, googleProvider);

      console.log('✅ Google Sign-In successful:', result.user.email);
      return result.user;

    } catch (error) {
      console.error('❌ Google Sign-In error:', error);
      setError(getAuthErrorMessage(error));
      setLoading(false);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      console.log('✅ User signed out successfully');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      setError('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  // Get user-friendly error messages
  const getAuthErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled. Please try again.';
      case 'auth/popup-blocked':
        return 'Pop-up was blocked. Please allow pop-ups and try again.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return error.message || 'An error occurred during authentication.';
    }
  };

  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut,
    saveConversation,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}