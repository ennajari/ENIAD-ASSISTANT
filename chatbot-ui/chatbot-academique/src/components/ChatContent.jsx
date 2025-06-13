import React from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Paper,
  Grid,
  CircularProgress
} from '@mui/material';
import {
  School as SchoolIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { translations } from '../constants/config';
import FloatingIcons from './FloatingIcons';
import MessageBubble from './MessageBubble';

const ChatContent = ({
  messages,
  isLoading,
  currentLanguage,
  darkMode,
  editingMessageId,
  editedMessageContent,
  setEditedMessageContent,
  onEditMessage,
  onSaveEdit,
  onCancelEdit,
  onQuestionClick,
  onSpeakText,
  isSpeaking,
  supported,
  messagesEndRef
}) => {
  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key];



  if (messages.length === 0) {
    return (
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        <FloatingIcons darkMode={darkMode} />
        
        <Container
          maxWidth="md"
          disableGutters
          sx={{
            px: { xs: 1, sm: 3 },
            py: { xs: 1, sm: 3 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              color: 'text.secondary',
              gap: 2,
              px: 2
            }}
          >
            <Avatar sx={{
              width: 80,
              height: 80,
              mb: 2,
              bgcolor: 'primary.main',
              '& .MuiSvgIcon-root': {
                fontSize: '2.5rem'
              }
            }}>
              <SchoolIcon />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              {t('assistant')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, maxWidth: '600px' }}>
              {t('startPrompt')}
            </Typography>

            <Box sx={{ width: '100%', maxWidth: 'md' }}>
              <Grid container spacing={2} justifyContent="center">
                {translations[currentLanguage].suggestions.map((question, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper
                      elevation={0}
                      onClick={() => onQuestionClick(question)}
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        border: `1px solid ${darkMode ? '#2d3748' : '#e2e8f0'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        '&:hover': {
                          borderColor: darkMode ? '#4a5568' : '#cbd5e0',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                        }
                      }}
                    >
                      <Typography sx={{
                        fontSize: '0.95rem',
                        lineHeight: 1.4,
                        textAlign: currentLanguage === 'ar' ? 'right' : 'left'
                      }}>
                        {question}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        bgcolor: darkMode ? '#0a0a0a' : '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        scrollBehavior: 'smooth',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          bgcolor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
          borderRadius: '3px',
          '&:hover': {
            bgcolor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
          }
        }
      }}
    >
      <Container
        maxWidth="4xl"
        disableGutters
        sx={{
          px: { xs: 2, sm: 4, md: 6 },
          py: { xs: 2, sm: 4 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '1200px',
          mx: 'auto'
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {messages.map((msg, index) => (
            <Box key={index} sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              {/* Message Header with Avatar and Role */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                px: 1
              }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: msg.role === 'user'
                      ? (darkMode ? '#10a37f' : '#10a37f')
                      : (darkMode ? '#6366f1' : '#6366f1'),
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  {msg.role === 'user' ? (
                    <PersonIcon fontSize="small" />
                  ) : (
                    <SchoolIcon fontSize="small" />
                  )}
                </Avatar>
                <Typography sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                  textTransform: 'capitalize'
                }}>
                  {msg.role === 'user' ? t('you') || 'You' : t('assistant') || 'Assistant'}
                </Typography>
              </Box>

              {/* Message Content */}
              <MessageBubble
                message={msg}
                darkMode={darkMode}
                currentLanguage={currentLanguage}
                isEditing={editingMessageId === msg.id}
                editedContent={editedMessageContent}
                onEditStart={onEditMessage}
                onEditSave={onSaveEdit}
                onEditCancel={onCancelEdit}
                onEditChange={setEditedMessageContent}
                onSpeakText={onSpeakText}
                isSpeaking={isSpeaking[msg.id]}
                supported={supported}
                t={t}
              />
            </Box>
          ))}

          {isLoading && (
            <Box sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              {/* Loading Message Header */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                px: 1
              }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: '#6366f1',
                    color: '#fff',
                  }}
                >
                  <SchoolIcon fontSize="small" />
                </Avatar>
                <Typography sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                }}>
                  {t('assistant') || 'Assistant'}
                </Typography>
              </Box>

              {/* Loading Message Content */}
              <Paper
                elevation={0}
                sx={{
                  position: 'relative',
                  width: '100%',
                  borderRadius: '20px',
                  padding: { xs: '16px 20px', sm: '20px 24px' },
                  backgroundColor: darkMode
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                  border: `1px solid ${darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)'}`,
                  boxShadow: darkMode
                    ? '0 4px 20px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)'
                    : '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  minHeight: '60px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <CircularProgress
                  size={20}
                  sx={{
                    color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'
                  }}
                />
                <Typography sx={{
                  color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                  fontStyle: 'italic'
                }}>
                  {t('thinking')}
                </Typography>
              </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>
      </Container>
    </Box>
  );
};

export default ChatContent;
