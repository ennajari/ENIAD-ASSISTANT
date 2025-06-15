import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import firebaseStorageService from '../../services/firebaseStorageService';
import conversationStateManager from '../../services/conversationStateManager';

const FirebaseTest = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const loadConversations = async () => {
    if (!user) {
      setError('Please login first to test Firebase');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('🔥 Loading conversations from Firebase for user:', user.email);
      const firebaseConversations = await firebaseStorageService.getUserConversations(user.uid);
      setConversations(firebaseConversations);
      setSuccess(`Loaded ${firebaseConversations.length} conversations from Firebase`);
      console.log('✅ Conversations loaded:', firebaseConversations);
    } catch (err) {
      console.error('❌ Error loading conversations:', err);
      setError(`Failed to load conversations: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createTestConversation = async () => {
    if (!user) {
      setError('Please login first to test Firebase');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const testConversation = {
        id: 'test-' + Date.now(),
        title: 'Test Conversation - ' + new Date().toLocaleString(),
        messages: [
          {
            id: 'msg-1',
            role: 'user',
            content: 'Hello, this is a test message',
            timestamp: new Date().toISOString()
          },
          {
            id: 'msg-2',
            role: 'assistant',
            content: 'Hello! This is a test response from the assistant.',
            timestamp: new Date().toISOString()
          }
        ],
        userId: user.uid,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      console.log('📝 Creating test conversation:', testConversation);
      await firebaseStorageService.saveConversation(user.uid, testConversation);
      setSuccess('Test conversation created successfully!');
      
      // Reload conversations to show the new one
      await loadConversations();
    } catch (err) {
      console.error('❌ Error creating test conversation:', err);
      setError(`Failed to create test conversation: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (conversationId) => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      console.log('🗑️ Deleting conversation:', conversationId);
      await firebaseStorageService.deleteConversation(user.uid, conversationId);
      setSuccess('Conversation deleted successfully!');
      
      // Reload conversations
      await loadConversations();
    } catch (err) {
      console.error('❌ Error deleting conversation:', err);
      setError(`Failed to delete conversation: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testConversationStateManager = async () => {
    if (!user) {
      setError('Please login first to test Firebase');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Set user in conversation state manager
      conversationStateManager.setCurrentUser(user);

      // Create a test conversation using the state manager
      const testConversation = {
        id: 'state-test-' + Date.now(),
        title: 'State Manager Test - ' + new Date().toLocaleString(),
        messages: [
          {
            id: 'msg-1',
            role: 'user',
            content: 'Testing conversation state manager',
            timestamp: new Date().toISOString()
          },
          {
            id: 'msg-2',
            role: 'assistant',
            content: 'State manager test response',
            timestamp: new Date().toISOString()
          }
        ],
        userId: user.uid,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      console.log('🔄 Testing conversation state manager...');
      await conversationStateManager.createConversation(testConversation, () => {});
      setSuccess('Conversation state manager test successful!');
      
      // Reload conversations
      await loadConversations();
    } catch (err) {
      console.error('❌ Error testing conversation state manager:', err);
      setError(`State manager test failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        🔥 Firebase Conversation Test
      </Typography>

      {!user && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Please login with Google to test Firebase functionality
        </Alert>
      )}

      {user && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              👤 User: {user.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              UID: {user.uid}
            </Typography>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
          onClick={loadConversations}
          disabled={!user || loading}
        >
          Reload Conversations
        </Button>
        
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={createTestConversation}
          disabled={!user || loading}
        >
          Create Test Conversation
        </Button>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<CheckIcon />}
          onClick={testConversationStateManager}
          disabled={!user || loading}
        >
          Test State Manager
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            📋 Firebase Conversations ({conversations.length})
          </Typography>
          
          {conversations.length === 0 ? (
            <Typography color="text.secondary">
              No conversations found in Firebase
            </Typography>
          ) : (
            <List>
              {conversations.map((conv, index) => (
                <React.Fragment key={conv.id}>
                  <ListItem
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {conv.title || 'Untitled'}
                          </Typography>
                          <Chip
                            label={`${conv.messages?.length || 0} messages`}
                            size="small"
                            color="primary"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            ID: {conv.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Created: {conv.createdAt ? new Date(conv.createdAt).toLocaleString() : 'Unknown'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Updated: {conv.lastUpdated ? new Date(conv.lastUpdated).toLocaleString() : 'Unknown'}
                          </Typography>
                        </Box>
                      }
                    />
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => deleteConversation(conv.id)}
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </ListItem>
                  {index < conversations.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          🧪 Test Instructions:
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          1. Login with Google Academic account
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          2. Click "Create Test Conversation" to add a test conversation to Firebase
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          3. Click "Test State Manager" to test the conversation state manager
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          4. Check the browser console for detailed logs
        </Typography>
        <Typography variant="body2">
          5. Refresh the page and check if conversations persist
        </Typography>
      </Box>
    </Box>
  );
};

export default FirebaseTest;
