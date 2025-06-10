import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { saveConversation, getConversations } from '../utils/firestore';
import { Box, Container, Paper, Typography, TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

function Chat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadConversations = async () => {
      if (user) {
        const convos = await getConversations(user.uid);
        setConversations(convos);
      }
    };

    loadConversations();
  }, [user]);

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      content: inputValue,
      timestamp: new Date().toISOString(),
      sender: user.uid
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    try {
      await saveConversation(user.uid, currentChatId, [...messages, newMessage], 'Chat Title');
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="md" sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 3 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            mb: 2,
            maxHeight: 'calc(100vh - 200px)',
            overflow: 'auto'
          }}
        >
          {messages.map((message, index) => (
            <Box 
              key={index}
              sx={{
                alignSelf: message.sender === user.uid ? 'flex-end' : 'flex-start',
                mb: 1
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  bgcolor: message.sender === user.uid ? 'primary.main' : 'background.paper',
                  color: message.sender === user.uid ? 'white' : 'text.primary'
                }}
              >
                <Typography>{message.content}</Typography>
              </Paper>
            </Box>
          ))}
        </Paper>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            variant="outlined"
            disabled={isLoading}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isLoading}
            sx={{ px: 3 }}
          >
            <SendIcon />
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Chat;