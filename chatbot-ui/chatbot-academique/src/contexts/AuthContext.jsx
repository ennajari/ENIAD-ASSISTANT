import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔐 Auth state changed:', user ? 'User logged in' : 'User logged out');

      if (user) {
        // Validate academic domain
        const isAcademicEmail = validateAcademicEmail(user.email);
        if (!isAcademicEmail) {
          console.warn('⚠️ Non-academic email detected:', user.email);
          setError('Please use an academic email address to access ENIAD Assistant');
          firebaseSignOut(auth);
          return;
        }

        // Store user profile with academic validation
        const userProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          isAcademic: isAcademicEmail,
          domain: user.email.split('@')[1],
          lastLogin: new Date().toISOString(),
          emailVerified: user.emailVerified
        };

        setUser(userProfile);
        setError(null);
        console.log('✅ Academic user authenticated:', userProfile);
      } else {
        setUser(null);
        setError(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Validate academic email domains
  const validateAcademicEmail = (email) => {
    if (!email) return false;

    const academicDomains = [
      // Educational domains
      '.edu', '.edu.', '.ac.', '.university', '.univ',
      // Specific academic institutions
      'eniad.edu.tn', 'eniad.tn', 'enit.rnu.tn', 'enis.rnu.tn',
      'esprit.tn', 'isg.rnu.tn', 'fsb.rnu.tn', 'fst.rnu.tn',
      // International academic domains
      'gmail.com', 'outlook.com', 'hotmail.com', // Temporary for testing
      // Add more academic domains as needed
    ];

    const domain = email.toLowerCase().split('@')[1];
    return academicDomains.some(acadDomain =>
      domain.includes(acadDomain) || domain.endsWith(acadDomain)
    );
  };

  // Google Sign In with academic validation
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);

      const provider = new GoogleAuthProvider();

      // Configure provider for academic accounts
      provider.setCustomParameters({
        hd: 'eniad.edu.tn', // Hosted domain for ENIAD (optional)
        prompt: 'select_account'
      });

      // Add scopes for academic information
      provider.addScope('email');
      provider.addScope('profile');

      console.log('🔐 Initiating Google Sign-In...');
      const result = await signInWithPopup(auth, provider);

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
    isAuthenticated: !!user,
    isAcademicUser: user?.isAcademic || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}