import { useState, useRef } from 'react';
import {
  Box,
  Container,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  CircularProgress,
  Typography
} from '@mui/material';
import {
  Mic as MicIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { translations } from '../constants/config';
import ResearchButton from './ResearchButton';
import QuestionAutocomplete from './QuestionAutocomplete';

const ChatInput = ({
  inputValue = '',
  onInputChange = () => {},
  onKeyPress = () => {},
  onSubmit = () => {},
  isLoading = false,
  currentLanguage = 'fr',
  darkMode = false,
  isRecording = false,
  onToggleRecording = () => {},
  browserSupportsSpeechRecognition = false,
  onResearch = () => {},
  isResearchMode = false,
  isSMALoading = false,
  isSMACompleted = false,
  smaStatusMessage = ''
}) => {
  const t = (key) => translations[currentLanguage]?.[key] || translations.fr[key] || key;

  // Autocomplete state
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHoveringAutocomplete, setIsHoveringAutocomplete] = useState(false);
  const inputRef = useRef(null);

  // Handle question selection from autocomplete
  const handleQuestionSelect = (question) => {
    // Create a synthetic event to match the expected format
    const syntheticEvent = {
      target: {
        value: question
      }
    };
    onInputChange(syntheticEvent);
    setShowAutocomplete(false);

    // Focus back to input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    console.log('🎯 Input focused, showing autocomplete');
    setIsFocused(true);
    setShowAutocomplete(true);
  };

  // Handle input blur (with delay to allow autocomplete clicks)
  const handleInputBlur = () => {
    console.log('🔍 Input blur, hovering:', isHoveringAutocomplete);
    setIsFocused(false);
    setTimeout(() => {
      if (!isHoveringAutocomplete) {
        setShowAutocomplete(false);
      }
    }, 200);
  };

  // Handle input change
  const handleInputChange = (e) => {
    console.log('📝 Input changed:', e.target.value);
    onInputChange(e);
    // Always show autocomplete when typing
    setShowAutocomplete(true);
  };

  return (
    <Box
      sx={{
        borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        bgcolor: darkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'sticky',
        bottom: 0,
        width: '100%',
        zIndex: 1000,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <Container
        maxWidth="4xl"
        disableGutters
        sx={{
          px: { xs: 2, sm: 4, md: 6 },
          py: { xs: 2, sm: 3 },
          maxWidth: '1200px',
          mx: 'auto'
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <TextField
            ref={inputRef}
            fullWidth
            variant="outlined"
            placeholder={t('writeMessage')}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={onKeyPress}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled={isLoading}
            multiline
            maxRows={6}
            className="chat-input"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '28px',
              paddingRight: '12px',
              paddingLeft: '20px',
              paddingTop: '14px',
              paddingBottom: '14px',
              minHeight: '56px',
              bgcolor: darkMode
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(255,255,255,0.9)',
              border: `2px solid ${darkMode
                ? 'rgba(255,255,255,0.15)'
                : 'rgba(0,0,0,0.08)'}`,
              boxShadow: darkMode
                ? '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                : '0 4px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              fontSize: '16px',
              fontWeight: 400,
              '&:hover': {
                borderColor: darkMode
                  ? 'rgba(255,255,255,0.25)'
                  : 'rgba(0,0,0,0.15)',
                boxShadow: darkMode
                  ? '0 6px 25px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)'
                  : '0 6px 25px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
                transform: 'translateY(-1px)',
              },
              '&.Mui-focused': {
                borderColor: darkMode
                  ? 'rgba(16,163,127,0.6)'
                  : 'rgba(16,163,127,0.4)',
                boxShadow: darkMode
                  ? '0 8px 30px rgba(0,0,0,0.5), 0 0 0 4px rgba(16,163,127,0.15), inset 0 1px 0 rgba(255,255,255,0.2)'
                  : '0 8px 30px rgba(0,0,0,0.15), 0 0 0 4px rgba(16,163,127,0.1), inset 0 1px 0 rgba(255,255,255,1)',
                transform: 'translateY(-2px)',
              },
              '& .MuiInputBase-input': {
                fontSize: '16px',
                lineHeight: '1.5',
                color: darkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.87)',
                '&::placeholder': {
                  color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
                  opacity: 1,
                }
              }
            },
            '& .MuiInputAdornment-root': {
              [currentLanguage === 'ar' ? 'marginLeft' : 'marginRight']: 0
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Box sx={{
                  display: 'flex',
                  flexDirection: currentLanguage === 'ar' ? 'row-reverse' : 'row',
                  gap: 1,
                  alignItems: 'center',
                  pr: 1
                }}>
                  {/* Research Button (SMA) */}
                  <ResearchButton
                    onClick={onResearch}
                    disabled={isLoading}
                    currentLanguage={currentLanguage}
                    darkMode={darkMode}
                    isActive={isResearchMode}
                    isLoading={isSMALoading}
                    isCompleted={isSMACompleted}
                    statusMessage={smaStatusMessage}
                    size="small"
                  />

                  {/* Mic Button */}
                  <Tooltip title={isRecording ? t('stopRecording') : t('startRecording')} arrow>
                    <IconButton
                      onClick={onToggleRecording}
                      disabled={!browserSupportsSpeechRecognition}
                      size="small"
                      sx={{
                        width: 36,
                        height: 36,
                        color: isRecording
                          ? '#ef4444'
                          : darkMode
                            ? 'rgba(255,255,255,0.7)'
                            : 'rgba(0,0,0,0.6)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          bgcolor: isRecording
                            ? 'rgba(239,68,68,0.1)'
                            : darkMode
                              ? 'rgba(255,255,255,0.1)'
                              : 'rgba(0,0,0,0.05)',
                          transform: 'scale(1.05)',
                        },
                        '&:disabled': {
                          opacity: 0.4,
                        }
                      }}
                    >
                      <MicIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Tooltip>

                  {/* Send Button */}
                  <IconButton
                    onClick={onSubmit}
                    disabled={!inputValue.trim() || isLoading}
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: (!inputValue.trim() || isLoading)
                        ? (darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')
                        : '#10a37f',
                      color: (!inputValue.trim() || isLoading)
                        ? (darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)')
                        : '#fff',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover:not(:disabled)': {
                        bgcolor: '#0d8f6b',
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 12px rgba(16,163,127,0.3)',
                      },
                      '&:active:not(:disabled)': {
                        transform: 'scale(0.95)',
                      },
                      '&:disabled': {
                        cursor: 'not-allowed',
                      }
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={18} sx={{ color: 'inherit' }} />
                    ) : (
                      <SendIcon sx={{ fontSize: 18 }} />
                    )}
                  </IconButton>
                </Box>
              </InputAdornment>
            )
          }}
        />

        {/* Question Autocomplete */}
        <QuestionAutocomplete
          inputValue={inputValue}
          onQuestionSelect={handleQuestionSelect}
          onClose={() => {
            setShowAutocomplete(false);
            setIsHoveringAutocomplete(false);
          }}
          onMouseEnter={() => setIsHoveringAutocomplete(true)}
          onMouseLeave={() => setIsHoveringAutocomplete(false)}
          isVisible={showAutocomplete && (isFocused || isHoveringAutocomplete)}
          maxSuggestions={5}
          currentLanguage={currentLanguage}
          darkMode={darkMode}
        />
        </Box>

        <Typography variant="caption" sx={{
          display: 'block',
          textAlign: 'center',
          mt: 2,
          color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
          fontSize: '0.75rem',
          fontWeight: 400,
        }}>
          {t('disclaimer')}
        </Typography>
      </Container>
    </Box>
  );
};

export default ChatInput;
