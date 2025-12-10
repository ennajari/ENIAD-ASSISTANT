import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider
} from '@mui/material';
import UserAvatar from '../UserAvatar';

const AvatarTest = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showBorder, setShowBorder] = useState(true);
  const [size, setSize] = useState(40);
  
  // Test users
  const testUsers = [
    null, // No user
    { // User with photo
      uid: '1',
      displayName: 'John Doe',
      email: 'john.doe@ump.ma',
      photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    { // User without photo but with name
      uid: '2',
      displayName: 'Marie Dupont',
      email: 'marie.dupont@ump.ma',
      photoURL: null
    },
    { // User with only email
      uid: '3',
      displayName: null,
      email: 'student@ump.ma',
      photoURL: null
    },
    { // User with broken photo URL
      uid: '4',
      displayName: 'Ahmed Alami',
      email: 'ahmed.alami@ump.ma',
      photoURL: 'https://broken-url.com/image.jpg'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Avatar Component Test
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Controls
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
              }
              label="Dark Mode"
            />
          </Grid>
          
          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  checked={showBorder}
                  onChange={(e) => setShowBorder(e.target.checked)}
                />
              }
              label="Show Border"
            />
          </Grid>
          
          <Grid item>
            <TextField
              label="Size"
              type="number"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              size="small"
              sx={{ width: 100 }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ 
        bgcolor: darkMode ? '#0a0a0a' : '#f8fafc',
        minHeight: '400px',
        p: 3,
        borderRadius: 2
      }}>
        <Typography variant="h6" gutterBottom sx={{ color: darkMode ? '#fff' : '#000' }}>
          Avatar Test Cases
        </Typography>
        
        <Grid container spacing={3}>
          {testUsers.map((user, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper sx={{ 
                p: 2, 
                textAlign: 'center',
                bgcolor: darkMode ? '#1a202c' : '#ffffff',
                color: darkMode ? '#fff' : '#000'
              }}>
                <Typography variant="subtitle2" gutterBottom>
                  {index === 0 ? 'No User' : `Test User ${index}`}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <UserAvatar
                    user={user}
                    size={size}
                    darkMode={darkMode}
                    showBorder={showBorder}
                  />
                </Box>
                
                <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                  <strong>Name:</strong> {user?.displayName || 'None'}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                  <strong>Email:</strong> {user?.email || 'None'}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>
                  <strong>Photo:</strong> {user?.photoURL ? 'Yes' : 'No'}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom sx={{ color: darkMode ? '#fff' : '#000' }}>
          Different Sizes
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          {[24, 32, 40, 48, 64, 80].map(testSize => (
            <Box key={testSize} sx={{ textAlign: 'center' }}>
              <UserAvatar
                user={testUsers[1]} // User with photo
                size={testSize}
                darkMode={darkMode}
                showBorder={showBorder}
              />
              <Typography variant="caption" sx={{ 
                display: 'block', 
                mt: 1,
                color: darkMode ? '#fff' : '#000'
              }}>
                {testSize}px
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default AvatarTest;
