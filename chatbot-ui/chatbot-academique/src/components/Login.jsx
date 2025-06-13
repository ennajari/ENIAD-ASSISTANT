import { useState, useEffect } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured, getFirebaseError } from '../firebase';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import firebaseStorageService from '../services/firebaseStorageService';
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Language adaptation
  const { language: lang } = useLanguage();
  const translations = {
    en: {
      title: 'ENIAD Academic Portal',
      subtitle: 'Welcome! Please sign in with your Google Academic account.',
      signin: 'Sign in with Google Academic',
      signing: 'Signing in...',
      cancelled: 'Login was cancelled',
      error: 'Failed to login. Please try again.',
      copyright: 'All rights reserved.',
      academicOnly: 'Academic emails only (ump.ma domain)',
      syncingData: 'Syncing your conversations...'
    },
    fr: {
      title: 'Portail Académique ENIAD',
      subtitle: 'Bienvenue ! Veuillez vous connecter avec votre compte Google académique.',
      signin: 'Se connecter avec Google Académique',
      signing: 'Connexion...',
      cancelled: 'Connexion annulée',
      error: 'Échec de la connexion. Veuillez réessayer.',
      copyright: 'Tous droits réservés.',
      academicOnly: 'Emails académiques uniquement (domaine ump.ma)',
      syncingData: 'Synchronisation de vos conversations...'
    },
    ar: {
      title: 'بوابة ENIAD الأكاديمية',
      subtitle: 'مرحباً! يرجى تسجيل الدخول باستخدام حساب Google الأكاديمي.',
      signin: 'تسجيل الدخول عبر Google الأكاديمي',
      signing: 'جاري تسجيل الدخول...',
      cancelled: 'تم إلغاء تسجيل الدخول',
      error: 'فشل تسجيل الدخول. حاول مرة أخرى.',
      copyright: 'جميع الحقوق محفوظة.',
      academicOnly: 'البريد الأكاديمي فقط (نطاق ump.ma)',
      syncingData: 'مزامنة محادثاتك...'
    }
  };
  const t = translations[lang] || translations['en'];
  const direction = lang === 'ar' ? 'rtl' : 'ltr';

  // Check Firebase configuration on component mount
  useEffect(() => {
    const firebaseError = getFirebaseError();

    if (firebaseError) {
      console.error('🔥 Firebase configuration error detected:', firebaseError);

      if (firebaseError.code === 'config/missing-keys') {
        const missingKeysText = firebaseError.missingKeys.join(', ');
        setError(`Firebase setup incomplete. Missing configuration: ${missingKeysText}. Please check your .env file and restart the server.`);
      } else {
        setError(`Firebase initialization failed: ${firebaseError.message}. Please check your configuration.`);
      }
    } else if (isFirebaseConfigured()) {
      console.log('✅ Firebase is properly configured and ready');
      console.log('🔐 Auth status:', {
        authInitialized: !!auth,
        currentUser: auth?.currentUser?.email || 'none',
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
      });

      // Clear any previous configuration errors
      setError('');
    } else {
      console.warn('⚠️ Firebase configuration status unclear');
    }
  }, []);

  // Clear errors when component mounts
  useEffect(() => {
    setError('');
  }, []);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" />;
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');

      // Check Firebase configuration first
      if (!isFirebaseConfigured()) {
        const firebaseError = getFirebaseError();
        throw new Error(firebaseError?.message || 'Firebase not configured properly');
      }

      // Check if auth and googleProvider are properly initialized
      if (!auth || !googleProvider) {
        throw new Error('Firebase auth not initialized. Please check your configuration.');
      }

      console.log('🚀 Attempting Google Academic sign-in...');
      const result = await signInWithPopup(auth, googleProvider);

      if (result.user) {
        console.log('✅ Google login successful:', {
          email: result.user.email,
          displayName: result.user.displayName,
          uid: result.user.uid,
          emailVerified: result.user.emailVerified
        });

        // Save user profile to Firebase
        try {
          await firebaseStorageService.saveUserProfile(result.user);
          console.log('✅ User profile saved to Firebase');
        } catch (profileError) {
          console.warn('⚠️ Failed to save user profile:', profileError);
        }

        // Sync local conversations with Firebase
        try {
          setError(t.syncingData);
          const localConversations = JSON.parse(localStorage.getItem('conversationHistory') || '[]');

          if (localConversations.length > 0) {
            const syncedConversations = await firebaseStorageService.syncConversations(
              result.user.uid,
              localConversations
            );

            // Update local storage with synced conversations
            localStorage.setItem('conversationHistory', JSON.stringify(syncedConversations));
            console.log(`✅ Synced ${syncedConversations.length} conversations`);
          }
        } catch (syncError) {
          console.warn('⚠️ Failed to sync conversations:', syncError);
        }

        // Navigate to main app
        navigate('/', { replace: true });
      } else {
        throw new Error('No user returned from Google sign-in');
      }
    } catch (error) {
      console.error('❌ Google login error:', error);
      let errorMessage = t.error;

      // Handle specific Firebase auth errors
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = t.cancelled;
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Popup was blocked. Please allow popups and try again.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection and try again.';
          break;
        case 'auth/configuration-not-found':
        case 'auth/invalid-api-key':
        case 'auth/invalid-app-credential':
          errorMessage = 'Firebase configuration error. Please check your setup.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Google sign-in is not enabled in Firebase Console. Please enable it.';
          break;
        case 'auth/unauthorized-domain':
          errorMessage = 'This domain is not authorized. Please add it to Firebase authorized domains.';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Another sign-in popup is already open.';
          break;
        case 'auth/internal-error':
          errorMessage = 'Internal error occurred. Please try again.';
          break;
        default:
          // Handle custom errors (like Firebase config errors)
          if (error.message.includes('Firebase not configured') || error.message.includes('not initialized')) {
            errorMessage = 'Firebase configuration error. Please check your .env file.';
          } else {
            errorMessage = error.message || t.error;
          }
          console.error('Unhandled auth error:', {
            code: error.code,
            message: error.message,
            stack: error.stack
          });
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };



  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        bgcolor: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
        overflow: 'hidden',
        direction,
        fontFamily: lang === 'ar'
          ? '"Segoe UI", "Tahoma", "Arial", sans-serif'
          : '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
      }}
      dir={direction}
      lang={lang}
    >
      {/* Decorative background circles */}
      <Box
        sx={{
          position: 'absolute',
          top: -120,
          left: -120,
          width: 320,
          height: 320,
          bgcolor: 'primary.light',
          opacity: 0.18,
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -100,
          right: -100,
          width: 220,
          height: 220,
          bgcolor: 'secondary.light',
          opacity: 0.13,
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 60,
          right: -60,
          width: 140,
          height: 140,
          bgcolor: 'primary.main',
          opacity: 0.10,
          borderRadius: '50%',
          zIndex: 0,
        }}
      />

      <Container maxWidth="sm" sx={{ zIndex: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
          }}
        >
          <Paper
            elevation={6}
            className={lang === 'ar' ? 'login-container' : ''}
            sx={{
              p: 5,
              width: '100%',
              maxWidth: 450,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 4,
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
              backdropFilter: 'blur(2px)',
              bgcolor: 'background.paper',
              direction,
              textAlign: 'center', // Always center the container
              '& *': {
                fontFamily: lang === 'ar'
                  ? '"Segoe UI", "Tahoma", "Arial", sans-serif !important'
                  : '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
              },
              // RTL-specific overrides for Arabic content only
              ...(lang === 'ar' && {
                '& .MuiTypography-h4, & .MuiTypography-subtitle1': {
                  textAlign: 'center !important',
                  direction: 'rtl !important',
                  width: '100% !important',
                  unicodeBidi: 'bidi-override !important',
                }
              })
            }}
            dir={direction}
            lang={lang}
          >
            {/* ENIAD Logo - Clickable */}
            <Box
              component="a"
              href="https://eniad.ump.ma/fr"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                mb: 3,
                borderRadius: '50%',
                bgcolor: 'rgba(16, 163, 127, 0.1)',
                p: 1,
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 25px rgba(16, 163, 127, 0.3)',
                }
              }}
            >
              <Box
                component="img"
                src="/logo.png"
                alt="ENIAD Logo - Visit Website"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  cursor: 'pointer'
                }}
              />
            </Box>

            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              className={lang === 'ar' ? 'login-title' : ''}
              sx={{
                mb: 2,
                fontWeight: 800,
                letterSpacing: lang === 'ar' ? 0 : 1,
                color: 'primary.main',
                textShadow: '0 2px 8px rgba(44,82,130,0.08)',
                fontFamily: lang === 'ar'
                  ? '"Segoe UI", "Tahoma", "Arial", sans-serif'
                  : '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
                direction: direction,
                textAlign: 'center', // Always center for consistent layout
                lineHeight: lang === 'ar' ? 1.4 : 1.2,
                width: '100%',
                alignSelf: 'center',
                ...(lang === 'ar' && {
                  writingMode: 'horizontal-tb',
                  unicodeBidi: 'bidi-override',
                  textOrientation: 'mixed'
                })
              }}
              dir={direction}
            >
              {t.title}
            </Typography>
            <Typography
              variant="subtitle1"
              className={lang === 'ar' ? 'login-subtitle' : ''}
              sx={{
                mb: 3,
                color: 'text.secondary',
                fontWeight: 400,
                textAlign: 'center', // Always center for consistent layout
                maxWidth: 400,
                fontFamily: lang === 'ar'
                  ? '"Segoe UI", "Tahoma", "Arial", sans-serif'
                  : '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
                direction: direction,
                lineHeight: lang === 'ar' ? 1.6 : 1.4,
                mx: 'auto',
                width: '100%',
                alignSelf: 'center',
                ...(lang === 'ar' && {
                  writingMode: 'horizontal-tb',
                  unicodeBidi: 'bidi-override',
                  textOrientation: 'mixed'
                })
              }}
              dir={direction}
            >
              {t.subtitle}
            </Typography>

            {/* Academic Email Notice */}
            <Typography
              variant="body2"
              sx={{
                mb: 3,
                color: 'text.secondary',
                textAlign: 'center',
                fontStyle: 'italic',
                direction: direction
              }}
            >
              {t.academicOnly}
            </Typography>

            {/* Google Academic Sign In Button */}
            <Button
              variant="outlined"
              {...(direction === 'rtl'
                ? { endIcon: loading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon /> }
                : { startIcon: loading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon /> }
              )}
              onClick={handleGoogleLogin}
              fullWidth
              disabled={loading}
              sx={{
                height: 48,
                backgroundColor: '#4285f4',
                color: 'white',
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: 2,
                letterSpacing: 0.5,
                display: 'flex',
                flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
                justifyContent: 'center',
                alignItems: 'center',
                border: 'none',
                textAlign: 'center',
                '& .MuiButton-startIcon': {
                  marginLeft: direction === 'rtl' ? 8 : 0,
                  marginRight: direction === 'rtl' ? 0 : 8,
                },
                '& .MuiButton-endIcon': {
                  marginLeft: direction === 'rtl' ? 0 : 8,
                  marginRight: direction === 'rtl' ? 8 : 0,
                },
                '&:hover': {
                  backgroundColor: '#357abd',
                  border: 'none',
                }
              }}
            >
              {loading ? t.signing : t.signin}
            </Button>

            {/* Error Display */}
            {error && (
              <Alert
                severity="error"
                sx={{
                  mt: 2,
                  width: '100%',
                  textAlign: direction === 'rtl' ? 'right' : 'left'
                }}
              >
                {error}
              </Alert>
            )}
          </Paper>
        </Box>
      </Container>
      {/* Footer copyright */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          py: 2,
          bgcolor: 'transparent',
          textAlign: 'center',
          zIndex: 2,
          direction,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          &copy; {new Date().getFullYear()} ENIAD AI. {t.copyright}
        </Typography>
      </Box>
    </Box>
  );
}