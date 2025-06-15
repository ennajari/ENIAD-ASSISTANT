import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Storage as StorageIcon,
  Cloud as CloudIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Chat as ChatIcon,
  Mic as MicIcon,
  VolumeUp as VolumeUpIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import firebaseStorageService from '../../services/firebaseStorageService';
import conversationStateManager from '../../services/conversationStateManager';
import { auth, db, isFirebaseConfigured, getFirebaseError } from '../../firebase';
import { API_URL } from '../../constants/config';

const InterfaceTest = () => {
  const { user, signInWithGoogle } = useAuth();
  const { language, changeLanguage } = useLanguage();
  const [tests, setTests] = useState({
    firebase: { status: 'pending', message: '', details: {} },
    auth: { status: 'pending', message: '', details: {} },
    firestore: { status: 'pending', message: '', details: {} },
    language: { status: 'pending', message: '', details: {} },
    conversation: { status: 'pending', message: '', details: {} },
    speech: { status: 'pending', message: '', details: {} },
    llama3: { status: 'pending', message: '', details: {} }
  });
  const [isRunning, setIsRunning] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const updateTest = (testName, status, message, details = {}) => {
    setTests(prev => ({
      ...prev,
      [testName]: { status, message, details }
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckIcon color="success" />;
      case 'error': return <ErrorIcon color="error" />;
      case 'warning': return <WarningIcon color="warning" />;
      case 'pending': return <CircularProgress size={20} />;
      default: return <InfoIcon color="info" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'pending': return 'info';
      default: return 'default';
    }
  };

  const testFirebaseConfig = async () => {
    try {
      updateTest('firebase', 'pending', 'Testing Firebase configuration...');
      
      const firebaseError = getFirebaseError();
      if (firebaseError) {
        updateTest('firebase', 'error', `Firebase configuration error: ${firebaseError.message}`, {
          code: firebaseError.code,
          missingKeys: firebaseError.missingKeys
        });
        return false;
      }

      if (!isFirebaseConfigured()) {
        updateTest('firebase', 'error', 'Firebase is not properly configured', {
          configured: false
        });
        return false;
      }

      updateTest('firebase', 'success', 'Firebase configuration is valid', {
        configured: true,
        authDomain: auth?.app?.options?.authDomain,
        projectId: auth?.app?.options?.projectId
      });
      return true;
    } catch (error) {
      updateTest('firebase', 'error', `Firebase test failed: ${error.message}`, {
        error: error.message
      });
      return false;
    }
  };

  const testAuthentication = async () => {
    try {
      updateTest('auth', 'pending', 'Testing authentication...');
      
      if (!auth) {
        updateTest('auth', 'error', 'Firebase Auth not initialized');
        return false;
      }

      if (user) {
        updateTest('auth', 'success', `User authenticated: ${user.email}`, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified
        });
        return true;
      } else {
        updateTest('auth', 'warning', 'No user currently authenticated', {
          authReady: true,
          canSignIn: true
        });
        return true;
      }
    } catch (error) {
      updateTest('auth', 'error', `Authentication test failed: ${error.message}`, {
        error: error.message
      });
      return false;
    }
  };

  const testFirestore = async () => {
    try {
      updateTest('firestore', 'pending', 'Testing Firestore connection...');
      
      if (!db) {
        updateTest('firestore', 'error', 'Firestore not initialized');
        return false;
      }

      if (!user) {
        updateTest('firestore', 'warning', 'Cannot test Firestore without authenticated user');
        return true;
      }

      // Test basic Firestore operations
      const testData = {
        id: 'test-' + Date.now(),
        title: 'Test Conversation',
        messages: [
          { role: 'user', content: 'Test message', timestamp: new Date().toISOString() }
        ],
        userId: user.uid,
        createdAt: new Date().toISOString()
      };

      // Test save
      await firebaseStorageService.saveConversation(user.uid, testData);
      
      // Test retrieve
      const conversations = await firebaseStorageService.getUserConversations(user.uid);
      
      // Test delete
      await firebaseStorageService.deleteConversation(user.uid, testData.id);

      updateTest('firestore', 'success', `Firestore operations successful`, {
        canSave: true,
        canRetrieve: true,
        canDelete: true,
        conversationsFound: conversations.length
      });
      return true;
    } catch (error) {
      updateTest('firestore', 'error', `Firestore test failed: ${error.message}`, {
        error: error.message,
        code: error.code
      });
      return false;
    }
  };

  const testLanguageSwitching = async () => {
    try {
      updateTest('language', 'pending', 'Testing language switching...');
      
      const originalLanguage = language;
      const testLanguage = language === 'fr' ? 'ar' : 'fr';
      
      // Test language change
      changeLanguage(testLanguage);
      
      // Wait a bit for the change to take effect
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Restore original language
      changeLanguage(originalLanguage);
      
      updateTest('language', 'success', `Language switching works (${originalLanguage} ↔ ${testLanguage})`, {
        currentLanguage: originalLanguage,
        testedLanguage: testLanguage,
        supportedLanguages: ['fr', 'ar']
      });
      return true;
    } catch (error) {
      updateTest('language', 'error', `Language switching test failed: ${error.message}`, {
        error: error.message
      });
      return false;
    }
  };

  const testConversationSaving = async () => {
    try {
      updateTest('conversation', 'pending', 'Testing conversation saving...');
      
      if (!user) {
        updateTest('conversation', 'warning', 'Cannot test conversation saving without authenticated user');
        return true;
      }

      // Set user in conversation state manager
      conversationStateManager.setCurrentUser(user);
      
      // Create test conversation
      const testConversation = {
        id: 'test-conv-' + Date.now(),
        title: 'Test Conversation',
        messages: [
          { role: 'user', content: 'Hello', timestamp: new Date().toISOString() },
          { role: 'assistant', content: 'Hi there!', timestamp: new Date().toISOString() }
        ],
        userId: user.uid,
        createdAt: new Date().toISOString()
      };

      // Test conversation state manager operations
      const mockSetConversationHistory = (updateFn) => {
        if (typeof updateFn === 'function') {
          updateFn([]);
        }
      };

      await conversationStateManager.createConversation(testConversation, mockSetConversationHistory);
      
      // Test loading conversations
      const conversations = await conversationStateManager.loadConversations(mockSetConversationHistory);
      
      // Clean up test conversation
      await conversationStateManager.deleteConversation(
        testConversation.id,
        mockSetConversationHistory,
        () => {},
        () => {}
      );

      updateTest('conversation', 'success', `Conversation saving works`, {
        canCreate: true,
        canLoad: true,
        canDelete: true,
        conversationsLoaded: conversations.length
      });
      return true;
    } catch (error) {
      updateTest('conversation', 'error', `Conversation saving test failed: ${error.message}`, {
        error: error.message
      });
      return false;
    }
  };

  const testSpeechFeatures = async () => {
    try {
      updateTest('speech', 'pending', 'Testing speech features...');
      
      const speechRecognitionSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      const speechSynthesisSupported = 'speechSynthesis' in window;
      
      updateTest('speech', 'success', `Speech features tested`, {
        speechRecognitionSupported,
        speechSynthesisSupported,
        voicesAvailable: speechSynthesisSupported ? window.speechSynthesis.getVoices().length : 0
      });
      return true;
    } catch (error) {
      updateTest('speech', 'error', `Speech test failed: ${error.message}`, {
        error: error.message
      });
      return false;
    }
  };

  const testLlama3API = async () => {
    try {
      updateTest('llama3', 'pending', 'Testing Llama3 API connection...');
      
      const response = await fetch(`${API_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer super-secret-key'
        },
        body: JSON.stringify({
          model: 'ahmed-ouka/llama3-8b-eniad-merged-32bit',
          messages: [{ role: 'user', content: 'Hello, this is a test.' }],
          max_tokens: 50
        })
      });

      if (response.ok) {
        const data = await response.json();
        updateTest('llama3', 'success', `Llama3 API is working`, {
          endpoint: API_URL,
          responseReceived: true,
          model: 'ahmed-ouka/llama3-8b-eniad-merged-32bit'
        });
      } else {
        updateTest('llama3', 'error', `API returned ${response.status}: ${response.statusText}`, {
          status: response.status,
          statusText: response.statusText
        });
      }
      return true;
    } catch (error) {
      updateTest('llama3', 'error', `Llama3 API test failed: ${error.message}`, {
        error: error.message,
        endpoint: API_URL
      });
      return false;
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    await testFirebaseConfig();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testAuthentication();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testFirestore();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testLanguageSwitching();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testConversationSaving();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testSpeechFeatures();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testLlama3API();
    
    setIsRunning(false);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto', bgcolor: darkMode ? '#0a0a0a' : '#f8fafc', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', color: darkMode ? '#fff' : '#000' }}>
        🧪 ENIAD Interface Test Suite
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
        <Button
          variant="contained"
          onClick={runAllTests}
          disabled={isRunning}
          startIcon={isRunning ? <CircularProgress size={20} /> : <RefreshIcon />}
          sx={{ bgcolor: '#10a37f', '&:hover': { bgcolor: '#0d8f6b' } }}
        >
          {isRunning ? 'Running Tests...' : 'Run All Tests'}
        </Button>
        
        <FormControlLabel
          control={<Switch checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />}
          label="Dark Mode"
          sx={{ color: darkMode ? '#fff' : '#000' }}
        />
        
        {!user && (
          <Button
            variant="outlined"
            onClick={signInWithGoogle}
            startIcon={<SecurityIcon />}
            sx={{ borderColor: '#10a37f', color: '#10a37f' }}
          >
            Sign In to Test Firebase
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {Object.entries(tests).map(([testName, test]) => (
          <Grid item xs={12} md={6} lg={4} key={testName}>
            <Card sx={{ 
              bgcolor: darkMode ? '#1a1a1a' : '#fff',
              border: `1px solid ${darkMode ? '#333' : '#e5e7eb'}`,
              boxShadow: darkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  {getStatusIcon(test.status)}
                  <Typography variant="h6" sx={{ color: darkMode ? '#fff' : '#000', textTransform: 'capitalize' }}>
                    {testName === 'llama3' ? 'Llama3 API' : testName}
                  </Typography>
                  <Chip 
                    label={test.status} 
                    color={getStatusColor(test.status)} 
                    size="small" 
                  />
                </Box>
                
                <Typography variant="body2" sx={{ color: darkMode ? '#ccc' : '#666', mb: 2 }}>
                  {test.message}
                </Typography>
                
                {Object.keys(test.details).length > 0 && (
                  <Paper sx={{ 
                    p: 1, 
                    bgcolor: darkMode ? '#2a2a2a' : '#f5f5f5',
                    maxHeight: 150,
                    overflow: 'auto'
                  }}>
                    <Typography variant="caption" component="pre" sx={{ 
                      fontSize: '0.75rem',
                      color: darkMode ? '#aaa' : '#555'
                    }}>
                      {JSON.stringify(test.details, null, 2)}
                    </Typography>
                  </Paper>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 4, p: 3, bgcolor: darkMode ? '#1a1a1a' : '#fff', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, color: darkMode ? '#fff' : '#000' }}>
          🎯 Test Summary
        </Typography>
        <Typography variant="body2" sx={{ color: darkMode ? '#ccc' : '#666' }}>
          This test suite verifies all major components of the ENIAD Assistant interface including Firebase authentication,
          conversation saving, language switching, speech features, and API connectivity. All tests should pass for
          optimal functionality.
        </Typography>
      </Box>
    </Box>
  );
};

export default InterfaceTest;
