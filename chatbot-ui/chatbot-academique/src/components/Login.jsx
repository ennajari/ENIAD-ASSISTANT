import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Button, Typography, Container, Paper, CircularProgress } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
          ? 'Login was cancelled' 
          : 'Failed to login. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        mt: 8, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center'
      }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{ mb: 4 }}
          >
            ENIAD Assistant
          </Typography>
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
            onClick={handleGoogleLogin}
            fullWidth
            disabled={loading}
            sx={{ 
              mt: 3,
              height: 48,
              backgroundColor: '#4285f4',
              '&:hover': {
                backgroundColor: '#357abd'
              }
            }}
          >
            {loading ? 'Signing in...' : 'Sign in with Google'}
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
  );
}