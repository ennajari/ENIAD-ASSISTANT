import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Box, Button, Typography, Container, Paper, CircularProgress } from '@mui/material';
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
      subtitle: 'Welcome! Please sign in to your ENIAD Academic Assistant account.',
      signin: 'Sign in with Google',
      signing: 'Signing in...',
      cancelled: 'Login was cancelled',
      error: 'Failed to login. Please try again.',
      copyright: 'All rights reserved.',
    },
    fr: {
      title: 'Portail Académique ENIAD',
      subtitle: 'Bienvenue ! Veuillez vous connecter à votre assistant académique ENIAD.',
      signin: 'Se connecter avec Google',
      signing: 'Connexion...',
      cancelled: 'Connexion annulée',
      error: 'Échec de la connexion. Veuillez réessayer.',
      copyright: 'Tous droits réservés.',
    },
    ar: {
      title: 'بوابة ENIAD الأكاديمية',
      subtitle: 'مرحبًا! يرجى تسجيل الدخول إلى مساعد ENIAD الأكاديمي الخاص بك.',
      signin: 'تسجيل الدخول عبر جوجل',
      signing: 'جاري تسجيل الدخول...',
      cancelled: 'تم إلغاء تسجيل الدخول',
      error: 'فشل تسجيل الدخول. حاول مرة أخرى.',
      copyright: 'جميع الحقوق محفوظة.',
    }
  };
  const t = translations[lang] || translations['en'];
  const direction = lang === 'ar' ? 'rtl' : 'ltr';

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" />;
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error.code === 'auth/popup-closed-by-user'
          ? t.cancelled
          : t.error
      );
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
          ? 'Arial, "Helvetica Neue", Helvetica, sans-serif'
          : 'Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
      dir={direction}
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
            sx={{
              p: 5,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 4,
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
              backdropFilter: 'blur(2px)',
              bgcolor: 'background.paper',
              direction,
              textAlign: direction === 'rtl' ? 'right' : 'left',
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              align="center"
              sx={{
                mb: 2,
                fontWeight: 800,
                letterSpacing: 1,
                color: 'primary.main',
                textShadow: '0 2px 8px rgba(44,82,130,0.08)',
                fontFamily: lang === 'ar'
                  ? 'Arial, "Helvetica Neue", Helvetica, sans-serif'
                  : 'Roboto, "Helvetica Neue", Arial, sans-serif',
              }}
            >
              {t.title}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                mb: 3,
                color: 'text.secondary',
                fontWeight: 400,
                textAlign: 'center',
                maxWidth: 320,
                fontFamily: lang === 'ar'
                  ? 'Arial, "Helvetica Neue", Helvetica, sans-serif'
                  : 'Roboto, "Helvetica Neue", Arial, sans-serif',
              }}
            >
              {t.subtitle}
            </Typography>
            <Button
              variant="contained"
              {...(direction === 'rtl'
                ? { endIcon: loading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon /> }
                : { startIcon: loading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon /> }
              )}
              onClick={handleGoogleLogin}
              fullWidth
              disabled={loading}
              sx={{
                mt: 2,
                height: 48,
                backgroundColor: '#4285f4',
                fontWeight: 700,
                fontSize: '1.1rem',
                borderRadius: 2,
                letterSpacing: 0.5,
                flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
                '&:hover': {
                  backgroundColor: '#357abd'
                }
              }}
            >
              {loading ? t.signing : t.signin}
            </Button>
            {error && (
              <Typography
                color="error"
                sx={{
                  mt: 2,
                  textAlign: 'center'
                }}
              >
                {error}
              </Typography>
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