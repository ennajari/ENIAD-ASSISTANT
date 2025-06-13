import { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, isFirebaseConfigured, getFirebaseError } from '../firebase';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  CircularProgress,
  TextField,
  Alert,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Language adaptation
  const { language: lang } = useLanguage();
  const translations = {
    en: {
      title: 'ENIAD Academic Portal',
      subtitle: 'Welcome! Please sign in to your ENIAD Academic Assistant account.',
      signin: 'Sign in with Google',
      signing: 'Signing in...',
      cancelled: 'Login was cancelled',
      error: 'Failed to login. Please try again.',
      copyright: 'All rights reserved.',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      signInTab: 'Sign In',
      signUpTab: 'Sign Up',
      signInEmail: 'Sign in with Email',
      signUpEmail: 'Create Account',
      or: 'or',
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required',
      passwordsMatch: 'Passwords must match',
      invalidEmail: 'Please enter a valid email',
      passwordLength: 'Password must be at least 6 characters',
    },
    fr: {
      title: 'Portail Académique ENIAD',
      subtitle: 'Bienvenue ! Veuillez vous connecter à votre assistant académique ENIAD.',
      signin: 'Se connecter avec Google',
      signing: 'Connexion...',
      cancelled: 'Connexion annulée',
      error: 'Échec de la connexion. Veuillez réessayer.',
      copyright: 'Tous droits réservés.',
      email: 'Email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      signInTab: 'Se connecter',
      signUpTab: 'S\'inscrire',
      signInEmail: 'Se connecter avec Email',
      signUpEmail: 'Créer un compte',
      or: 'ou',
      emailRequired: 'Email requis',
      passwordRequired: 'Mot de passe requis',
      passwordsMatch: 'Les mots de passe doivent correspondre',
      invalidEmail: 'Veuillez entrer un email valide',
      passwordLength: 'Le mot de passe doit contenir au moins 6 caractères',
    },
    ar: {
      title: 'بوابة ENIAD الأكاديمية',
      subtitle: 'مرحباً! يرجى تسجيل الدخول إلى حساب مساعد ENIAD الأكاديمي الخاص بك.',
      signin: 'تسجيل الدخول عبر جوجل',
      signing: 'جاري تسجيل الدخول...',
      cancelled: 'تم إلغاء تسجيل الدخول',
      error: 'فشل تسجيل الدخول. حاول مرة أخرى.',
      copyright: 'جميع الحقوق محفوظة.',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      signInTab: 'تسجيل الدخول',
      signUpTab: 'إنشاء حساب',
      signInEmail: 'تسجيل الدخول بالبريد الإلكتروني',
      signUpEmail: 'إنشاء حساب',
      or: 'أو',
      emailRequired: 'البريد الإلكتروني مطلوب',
      passwordRequired: 'كلمة المرور مطلوبة',
      passwordsMatch: 'كلمات المرور يجب أن تتطابق',
      invalidEmail: 'يرجى إدخال بريد إلكتروني صحيح',
      passwordLength: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
    }
  };
  const t = translations[lang] || translations['en'];
  const direction = lang === 'ar' ? 'rtl' : 'ltr';

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" />;
  }

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

  // Clear errors when switching tabs
  useEffect(() => {
    setError('');
    setValidationErrors({});
  }, [tabValue]);

  // Validation function
  const validateForm = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = t.emailRequired;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = t.invalidEmail;
    }

    if (!password) {
      errors.password = t.passwordRequired;
    } else if (password.length < 6) {
      errors.password = t.passwordLength;
    }

    if (tabValue === 1 && password !== confirmPassword) {
      errors.confirmPassword = t.passwordsMatch;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');

      // Check Firebase configuration first
      if (!isFirebaseConfigured()) {
        const firebaseError = getFirebaseError();
        throw new Error(firebaseError?.message || 'Firebase not configured properly');
      }

      // Check if auth is properly initialized
      if (!auth) {
        throw new Error('Firebase auth not initialized. Please check your configuration.');
      }

      const provider = new GoogleAuthProvider();

      // Configure Google provider for better UX
      provider.addScope('email');
      provider.addScope('profile');
      provider.setCustomParameters({
        prompt: 'select_account',
        hd: undefined // Allow any domain
      });

      console.log('🚀 Attempting Google sign-in...');
      const result = await signInWithPopup(auth, provider);

      if (result.user) {
        console.log('✅ Google login successful:', {
          email: result.user.email,
          displayName: result.user.displayName,
          uid: result.user.uid,
          emailVerified: result.user.emailVerified
        });

        // Navigate immediately - AuthContext will handle the state update
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

  const handleEmailAuth = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');

      // Check if auth is properly initialized
      if (!auth) {
        throw new Error('Firebase auth not initialized. Please check your configuration.');
      }

      let result;
      if (tabValue === 0) {
        // Sign in
        console.log('Attempting email sign-in...');
        result = await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Sign up
        console.log('Attempting email sign-up...');
        result = await createUserWithEmailAndPassword(auth, email, password);
      }

      if (result.user) {
        console.log('Email auth successful:', {
          email: result.user.email,
          uid: result.user.uid,
          action: tabValue === 0 ? 'sign-in' : 'sign-up'
        });

        // Small delay to ensure auth state is updated
        setTimeout(() => {
          navigate('/');
        }, 100);
      } else {
        throw new Error('No user returned from email authentication');
      }
    } catch (error) {
      console.error('Email auth error:', error);
      let errorMessage = t.error;

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak (minimum 6 characters).';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password.';
          break;
        default:
          errorMessage = error.message || t.error;
          console.error('Unhandled email auth error:', error.code, error.message);
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
                },
                '& .MuiTabs-root': {
                  direction: 'rtl !important',
                },
                '& .MuiTab-root': {
                  direction: 'rtl !important',
                }
              })
            }}
            dir={direction}
            lang={lang}
          >
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

            {/* Tabs for Sign In / Sign Up */}
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              sx={{
                mb: 3,
                width: '100%',
                direction: direction,
                '& .MuiTab-root': {
                  fontFamily: lang === 'ar'
                    ? '"Segoe UI", "Tahoma", "Arial", sans-serif'
                    : '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 600,
                  textAlign: 'center',
                }
              }}
              variant="fullWidth"
            >
              <Tab label={t.signInTab} />
              <Tab label={t.signUpTab} />
            </Tabs>

            {/* Email/Password Form */}
            <Box sx={{
              width: '100%',
              mb: 2,
              direction: direction,
              '& .MuiTextField-root': {
                direction: direction,
              },
              '& .MuiInputLabel-root': {
                transformOrigin: direction === 'rtl' ? 'top right' : 'top left',
                right: direction === 'rtl' ? 14 : 'auto',
                left: direction === 'rtl' ? 'auto' : 14,
              },
              '& .MuiOutlinedInput-root': {
                textAlign: direction === 'rtl' ? 'right' : 'left',
              },
              '& .MuiFormHelperText-root': {
                textAlign: direction === 'rtl' ? 'right' : 'left',
                marginLeft: direction === 'rtl' ? 0 : 14,
                marginRight: direction === 'rtl' ? 14 : 0,
              }
            }}>
              <TextField
                fullWidth
                label={t.email}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!validationErrors.email}
                helperText={validationErrors.email}
                disabled={loading}
                sx={{
                  mb: 2,
                  '& .MuiInputBase-input': {
                    textAlign: direction === 'rtl' ? 'right' : 'left',
                  }
                }}
                InputLabelProps={{
                  sx: {
                    transformOrigin: direction === 'rtl' ? 'top right' : 'top left',
                    right: direction === 'rtl' ? 14 : 'auto',
                    left: direction === 'rtl' ? 'auto' : 14,
                  }
                }}
              />
              <TextField
                fullWidth
                label={t.password}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!validationErrors.password}
                helperText={validationErrors.password}
                disabled={loading}
                sx={{
                  mb: tabValue === 1 ? 2 : 0,
                  '& .MuiInputBase-input': {
                    textAlign: direction === 'rtl' ? 'right' : 'left',
                  }
                }}
                InputLabelProps={{
                  sx: {
                    transformOrigin: direction === 'rtl' ? 'top right' : 'top left',
                    right: direction === 'rtl' ? 14 : 'auto',
                    left: direction === 'rtl' ? 'auto' : 14,
                  }
                }}
              />
              {tabValue === 1 && (
                <TextField
                  fullWidth
                  label={t.confirmPassword}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!!validationErrors.confirmPassword}
                  helperText={validationErrors.confirmPassword}
                  disabled={loading}
                  sx={{
                    '& .MuiInputBase-input': {
                      textAlign: direction === 'rtl' ? 'right' : 'left',
                    }
                  }}
                  InputLabelProps={{
                    sx: {
                      transformOrigin: direction === 'rtl' ? 'top right' : 'top left',
                      right: direction === 'rtl' ? 14 : 'auto',
                      left: direction === 'rtl' ? 'auto' : 14,
                    }
                  }}
                />
              )}
            </Box>

            {/* Email Auth Button */}
            <Button
              variant="contained"
              onClick={handleEmailAuth}
              fullWidth
              disabled={loading}
              sx={{
                mb: 2,
                height: 48,
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: 2,
                direction: direction,
                fontFamily: lang === 'ar'
                  ? '"Segoe UI", "Tahoma", "Arial", sans-serif'
                  : '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
              }}
            >
              {loading ? t.signing : (tabValue === 0 ? t.signInEmail : t.signUpEmail)}
            </Button>

            {/* Divider */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              mb: 2,
              direction: direction
            }}>
              <Divider sx={{ flex: 1 }} />
              <Typography sx={{
                mx: 2,
                color: 'text.secondary',
                fontFamily: lang === 'ar'
                  ? '"Segoe UI", "Tahoma", "Arial", sans-serif'
                  : '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
                direction: direction
              }}>
                {t.or}
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>

            {/* Google Sign In Button */}
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