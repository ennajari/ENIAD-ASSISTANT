import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Send as SendIcon,
  Psychology as BrainIcon
} from '@mui/icons-material';
import geminiService from '../services/geminiService';

const GeminiTest = () => {
  const [status, setStatus] = useState('idle');
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serviceStatus, setServiceStatus] = useState(null);

  useEffect(() => {
    // Get service status on component mount
    const status = geminiService.getStatus();
    setServiceStatus(status);
  }, []);

  const runConnectionTest = async () => {
    setLoading(true);
    setStatus('testing');
    
    try {
      console.log('🧪 Starting Gemini API connection test...');
      const result = await geminiService.testConnection();
      
      setTestResult(result);
      setStatus(result.success ? 'success' : 'error');
      
      console.log('✅ Gemini test completed:', result);
    } catch (error) {
      console.error('❌ Gemini test failed:', error);
      setTestResult({
        success: false,
        message: error.message,
        model: 'gemini-1.5-flash'
      });
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const runChatTest = async () => {
    setLoading(true);
    
    try {
      console.log('💬 Testing Gemini chat functionality...');
      
      const testMessages = [
        {
          role: 'system',
          content: 'Tu es l\'assistant académique ENIAD. Réponds brièvement en français.'
        },
        {
          role: 'user',
          content: 'Bonjour, peux-tu me parler de l\'intelligence artificielle à ENIAD?'
        }
      ];
      
      const response = await geminiService.generateChatCompletion(testMessages, {
        maxTokens: 200,
        temperature: 0.7
      });
      
      setTestResult({
        success: true,
        message: 'Chat test successful',
        model: 'gemini-1.5-flash',
        response: response.choices[0].message.content,
        usage: response.usage
      });
      setStatus('success');
      
      console.log('✅ Gemini chat test completed successfully');
    } catch (error) {
      console.error('❌ Gemini chat test failed:', error);
      setTestResult({
        success: false,
        message: error.message,
        model: 'gemini-1.5-flash'
      });
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'testing': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckIcon />;
      case 'error': return <ErrorIcon />;
      case 'testing': return <CircularProgress size={20} />;
      default: return <InfoIcon />;
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <BrainIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Test Gemini API
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Interface de test pour vérifier la connexion et les fonctionnalités de l'API Gemini 1.5 Flash
        </Typography>

        {/* Service Status */}
        <Card sx={{ mb: 4, bgcolor: 'background.default' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📊 État du Service Gemini
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Service
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {serviceStatus?.service || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Modèle
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {serviceStatus?.model || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Configuration
                  </Typography>
                  <Chip
                    label={serviceStatus?.configured ? 'Configuré' : 'Non configuré'}
                    color={serviceStatus?.configured ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Max Tokens
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {serviceStatus?.maxTokens || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Test Controls */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            onClick={runConnectionTest}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{ minWidth: 200 }}
          >
            {loading ? 'Test en cours...' : 'Tester la Connexion'}
          </Button>
          
          <Button
            variant="outlined"
            onClick={runChatTest}
            disabled={loading || !serviceStatus?.configured}
            startIcon={loading ? <CircularProgress size={20} /> : <BrainIcon />}
            sx={{ minWidth: 200 }}
          >
            {loading ? 'Test en cours...' : 'Tester le Chat'}
          </Button>
        </Box>

        {/* Status Indicator */}
        {status !== 'idle' && (
          <Box sx={{ mb: 3 }}>
            <Chip
              icon={getStatusIcon(status)}
              label={
                status === 'testing' ? 'Test en cours...' :
                status === 'success' ? 'Test réussi' :
                status === 'error' ? 'Test échoué' : 'En attente'
              }
              color={getStatusColor(status)}
              sx={{ fontSize: '1rem', py: 2, px: 1 }}
            />
          </Box>
        )}

        {/* Test Results */}
        {testResult && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📋 Résultats du Test
              </Typography>
              
              <Alert 
                severity={testResult.success ? 'success' : 'error'} 
                sx={{ mb: 2 }}
              >
                <Typography variant="body2">
                  <strong>Statut:</strong> {testResult.message}
                </Typography>
                <Typography variant="body2">
                  <strong>Modèle:</strong> {testResult.model}
                </Typography>
              </Alert>

              {testResult.response && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    🤖 Réponse du Modèle:
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {testResult.response}
                    </Typography>
                  </Paper>
                </Box>
              )}

              {testResult.usage && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    📊 Utilisation des Tokens:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="body2">
                        <strong>Prompt:</strong> {testResult.usage.prompt_tokens}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2">
                        <strong>Completion:</strong> {testResult.usage.completion_tokens}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2">
                        <strong>Total:</strong> {testResult.usage.total_tokens}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        <Divider sx={{ my: 4 }} />

        {/* Instructions */}
        <Box>
          <Typography variant="h6" gutterBottom>
            📝 Instructions
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            1. <strong>Tester la Connexion:</strong> Vérifie que l'API Gemini est accessible et configurée correctement
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            2. <strong>Tester le Chat:</strong> Envoie une requête de test pour vérifier la génération de réponses
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            3. <strong>Configuration:</strong> Assurez-vous que VITE_GEMINI_API_KEY est défini dans votre fichier .env
          </Typography>
          <Typography variant="body2" color="text.secondary">
            4. <strong>Fallback:</strong> Gemini est utilisé comme solution temporaire pendant que l'API Modal est indisponible
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default GeminiTest;
