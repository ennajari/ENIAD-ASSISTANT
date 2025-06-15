import { useState } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Tooltip,
  TextField,
  Button,
  Snackbar,
  Alert,
  Fade,
  Zoom
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  VolumeUp as VolumeUpIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MessageBubble = ({
  message,
  darkMode = false,
  currentLanguage = 'fr',
  isEditing = false,
  editedContent = '',
  onEditStart = () => {},
  onEditSave = () => {},
  onEditCancel = () => {},
  onEditChange = () => {},
  onSpeakText = () => {},
  isSpeaking = false,
  supported = false,
  t = (key) => key
}) => {
  const [copied, setCopied] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  // Handle copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setShowCopySuccess(true);
      
      // Reset copy state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowCopySuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Professional message bubble styling
  const getBubbleStyle = () => ({
    position: 'relative',
    width: '100%',
    maxWidth: 'none',
    borderRadius: '20px',
    padding: { xs: '16px 20px', sm: '20px 24px' },
    marginBottom: 0,
    
    // Background and colors
    backgroundColor: message.role === 'user'
      ? (darkMode 
          ? 'linear-gradient(135deg, rgba(16,163,127,0.15) 0%, rgba(16,163,127,0.08) 100%)'
          : 'linear-gradient(135deg, rgba(16,163,127,0.12) 0%, rgba(16,163,127,0.06) 100%)')
      : (darkMode 
          ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)'),
    
    color: message.role === 'user'
      ? (darkMode ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.9)')
      : (darkMode ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.87)'),
    
    // Border
    border: message.role === 'user'
      ? `1px solid ${darkMode ? 'rgba(16,163,127,0.25)' : 'rgba(16,163,127,0.2)'}`
      : `1px solid ${darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)'}`,
    
    // Enhanced shadows
    boxShadow: message.role === 'user'
      ? (darkMode
          ? '0 4px 20px rgba(16,163,127,0.15), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
          : '0 4px 20px rgba(16,163,127,0.12), 0 1px 3px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)')
      : (darkMode
          ? '0 4px 20px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)'
          : '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)'),
    
    // Smooth transitions
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Hover effects
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: message.role === 'user'
        ? (darkMode
            ? '0 8px 30px rgba(16,163,127,0.2), 0 2px 6px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15)'
            : '0 8px 30px rgba(16,163,127,0.18), 0 2px 6px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)')
        : (darkMode
            ? '0 8px 30px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)'
            : '0 8px 30px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)'),
      
      '& .message-actions': {
        opacity: 1,
        transform: 'translateY(0)',
      }
    },
    
    // Typography improvements
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: '15px',
    lineHeight: 1.6,
    letterSpacing: '0.01em',
    
    // Content styling
    '& p': { 
      margin: '0.75em 0',
      '&:first-of-type': { marginTop: 0 },
      '&:last-of-type': { marginBottom: 0 }
    },
    '& code': {
      fontFamily: '"Fira Code", "SF Mono", "Monaco", "Consolas", monospace',
      fontSize: '0.9em',
      backgroundColor: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
      padding: '0.2em 0.4em',
      borderRadius: '6px',
      border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
    },
    '& pre': {
      margin: '1em 0',
      backgroundColor: darkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.04)',
      borderRadius: '12px',
      padding: '16px 20px',
      border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`,
      overflow: 'auto',
      '& code': {
        backgroundColor: 'transparent',
        padding: 0,
        border: 'none',
      }
    },
    '& ul, & ol': { 
      marginLeft: currentLanguage === 'ar' ? 0 : '1.5em',
      marginRight: currentLanguage === 'ar' ? '1.5em' : 0,
      paddingLeft: currentLanguage === 'ar' ? 0 : '0.5em',
      paddingRight: currentLanguage === 'ar' ? '0.5em' : 0,
    },
    '& blockquote': {
      borderLeft: currentLanguage === 'ar' ? 'none' : `3px solid ${message.role === 'user' ? '#10a37f' : (darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)')}`,
      borderRight: currentLanguage === 'ar' ? `3px solid ${message.role === 'user' ? '#10a37f' : (darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)')}` : 'none',
      paddingLeft: currentLanguage === 'ar' ? 0 : '1em',
      paddingRight: currentLanguage === 'ar' ? '1em' : 0,
      marginLeft: 0,
      marginRight: 0,
      fontStyle: 'italic',
      opacity: 0.9,
    },
    '& a': {
      color: message.role === 'user' ? 'inherit' : '#10a37f',
      textDecoration: 'underline',
      textDecorationColor: 'rgba(16,163,127,0.4)',
      transition: 'all 0.2s ease',
      '&:hover': {
        textDecorationColor: '#10a37f',
      }
    }
  });

  return (
    <>
      <Paper
        elevation={0}
        className="message-bubble"
        sx={getBubbleStyle()}
      >
        {isEditing ? (
          // Edit Mode
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              multiline
              value={editedContent}
              onChange={(e) => onEditChange(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  borderRadius: '12px',
                  fontSize: '15px',
                  lineHeight: 1.6,
                }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button
                size="small"
                onClick={onEditCancel}
                variant="outlined"
                sx={{ borderRadius: '10px' }}
              >
                <CancelIcon fontSize="small" sx={{ mr: 0.5 }} />
                {t('cancel')}
              </Button>
              <Button
                size="small"
                onClick={onEditSave}
                variant="contained"
                sx={{ 
                  borderRadius: '10px',
                  bgcolor: '#10a37f',
                  '&:hover': { bgcolor: '#0d8f6b' }
                }}
              >
                <SaveIcon fontSize="small" sx={{ mr: 0.5 }} />
                {t('save')}
              </Button>
            </Box>
          </Box>
        ) : (
          // Display Mode
          <>
            {/* Copy Button - Top Right for Assistant Messages */}
            {message.role === 'assistant' && (
              <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                <IconButton
                  onClick={handleCopy}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    width: 32,
                    height: 32,
                    backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    color: copied ? '#10a37f' : (darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'),
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: 0.7,
                    '&:hover': {
                      opacity: 1,
                      backgroundColor: copied ? 'rgba(16,163,127,0.1)' : (darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'),
                      transform: 'scale(1.05)',
                    }
                  }}
                >
                  <Tooltip title={copied ? t('copied') || 'Copied!' : t('copy') || 'Copy'} arrow>
                    {copied ? (
                      <CheckIcon sx={{ fontSize: 16 }} />
                    ) : (
                      <CopyIcon sx={{ fontSize: 16 }} />
                    )}
                  </Tooltip>
                </IconButton>
              </Zoom>
            )}

            {/* Message Content */}
            <Box sx={{ 
              paddingRight: message.role === 'assistant' ? '48px' : '0',
              paddingLeft: currentLanguage === 'ar' && message.role === 'assistant' ? '48px' : '0',
            }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    return (
                      <code
                        style={{
                          backgroundColor: darkMode
                            ? 'rgba(255, 255, 255, 0.15)'
                            : 'rgba(0, 0, 0, 0.08)',
                          padding: inline ? '0.2em 0.4em' : '1em',
                          borderRadius: inline ? '6px' : '12px',
                          display: inline ? 'inline' : 'block',
                          overflowX: 'auto',
                          border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                          fontFamily: '"Fira Code", "SF Mono", "Monaco", "Consolas", monospace',
                        }}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </Box>

            {/* Action Buttons */}
            <Fade in={true} timeout={300}>
              <Box 
                className="message-actions"
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 1,
                  marginTop: 2,
                  opacity: 0,
                  transform: 'translateY(4px)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {message.role === 'user' && (
                  <Tooltip title={t('edit') || 'Edit'} arrow>
                    <IconButton
                      size="small"
                      onClick={() => onEditStart(message.id, message.content)}
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                        color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          backgroundColor: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                          transform: 'scale(1.05)',
                        }
                      }}
                    >
                      <EditIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                )}
                
                {message.role === 'assistant' && (
                  <Tooltip title={t('speak') || 'Read aloud'} arrow>
                    <IconButton
                      size="small"
                      onClick={() => onSpeakText(message.content, message.id)}
                      disabled={!supported}
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                        color: isSpeaking ? '#10a37f' : (darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'),
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover:not(:disabled)': {
                          backgroundColor: '#10a37f',
                          color: '#fff',
                          transform: 'scale(1.05)',
                        },
                        '&:disabled': {
                          opacity: 0.3,
                        }
                      }}
                    >
                      <VolumeUpIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Fade>
          </>
        )}
      </Paper>

      {/* Copy Success Snackbar */}
      <Snackbar
        open={showCopySuccess}
        autoHideDuration={3000}
        onClose={() => setShowCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowCopySuccess(false)} 
          severity="success" 
          sx={{ 
            borderRadius: '12px',
            '& .MuiAlert-icon': {
              color: '#10a37f'
            }
          }}
        >
          {t('copiedToClipboard') || 'Copied to clipboard!'}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MessageBubble;
