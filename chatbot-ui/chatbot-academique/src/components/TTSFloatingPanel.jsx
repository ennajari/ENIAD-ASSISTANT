import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Typography,
  Fade,
  Slide,
  LinearProgress,
  Chip,
  Tooltip
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Close as CloseIcon,
  GraphicEq as GraphicEqIcon,
  Mic as MicIcon
} from '@mui/icons-material';

const TTSFloatingPanel = ({
  isVisible = false,
  isPlaying = false,
  isLoading = false,
  currentText = '',
  currentLanguage = 'fr',
  darkMode = false,
  onPlay,
  onStop,
  onClose,
  progress = 0,
  estimatedDuration = 0,
  currentTime = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(1.0);

  // Auto-expand when playing
  useEffect(() => {
    if (isPlaying) {
      setIsExpanded(true);
    }
  }, [isPlaying]);

  // Get language display name
  const getLanguageDisplay = (lang) => {
    const languages = {
      'fr': { name: 'Français', flag: '🇫🇷' },
      'ar': { name: 'العربية', flag: '🇸🇦' },
      'en': { name: 'English', flag: '🇺🇸' }
    };
    return languages[lang] || languages['fr'];
  };

  const langInfo = getLanguageDisplay(currentLanguage);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get text preview
  const getTextPreview = (text, maxLength = 60) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (!isVisible) return null;

  return (
    <Slide direction="up" in={isVisible} mountOnEnter unmountOnExit>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: isExpanded ? 380 : 60,
          height: isExpanded ? 'auto' : 60,
          borderRadius: isExpanded ? '20px' : '30px',
          background: darkMode
            ? 'linear-gradient(135deg, rgba(16,163,127,0.95) 0%, rgba(5,150,105,0.95) 100%)'
            : 'linear-gradient(135deg, rgba(16,163,127,0.98) 0%, rgba(5,150,105,0.98) 100%)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)'}`,
          boxShadow: darkMode
            ? '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(16,163,127,0.3)'
            : '0 20px 40px rgba(16,163,127,0.3), 0 0 0 1px rgba(16,163,127,0.2)',
          color: '#fff',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: isExpanded ? 'default' : 'pointer',
          zIndex: 1300,
          overflow: 'hidden',
          '&:hover': {
            transform: isExpanded ? 'none' : 'scale(1.05)',
            boxShadow: darkMode
              ? '0 25px 50px rgba(0,0,0,0.5), 0 0 0 2px rgba(16,163,127,0.4)'
              : '0 25px 50px rgba(16,163,127,0.4), 0 0 0 2px rgba(16,163,127,0.3)',
          }
        }}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        {!isExpanded ? (
          // Collapsed state - floating button
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            {isLoading ? (
              <Box sx={{ position: 'relative' }}>
                <MicIcon sx={{ fontSize: 24, animation: 'pulse 1.5s ease-in-out infinite' }} />
                <Box
                  sx={{
                    position: 'absolute',
                    top: -2,
                    left: -2,
                    right: -2,
                    bottom: -2,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '50%',
                    animation: 'ripple 2s infinite'
                  }}
                />
              </Box>
            ) : isPlaying ? (
              <GraphicEqIcon 
                sx={{ 
                  fontSize: 24,
                  animation: 'bounce 1s ease-in-out infinite'
                }} 
              />
            ) : (
              <VolumeUpIcon sx={{ fontSize: 24 }} />
            )}
          </Box>
        ) : (
          // Expanded state - full panel
          <Box sx={{ p: 2 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MicIcon sx={{ fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  ElevenLabs TTS
                </Typography>
                <Chip
                  label={`${langInfo.flag} ${langInfo.name}`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontSize: '0.7rem',
                    height: 20
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="Réduire">
                  <IconButton
                    size="small"
                    onClick={() => setIsExpanded(false)}
                    sx={{ color: 'rgba(255,255,255,0.8)', width: 28, height: 28 }}
                  >
                    <VolumeOffIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Fermer">
                  <IconButton
                    size="small"
                    onClick={onClose}
                    sx={{ color: 'rgba(255,255,255,0.8)', width: 28, height: 28 }}
                  >
                    <CloseIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Text preview */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '0.85rem',
                  lineHeight: 1.4,
                  fontStyle: 'italic',
                  textAlign: currentLanguage === 'ar' ? 'right' : 'left',
                  direction: currentLanguage === 'ar' ? 'rtl' : 'ltr'
                }}
              >
                {getTextPreview(currentText)}
              </Typography>
            </Box>

            {/* Progress bar */}
            {(isPlaying || isLoading) && (
              <Box sx={{ mb: 2 }}>
                <LinearProgress
                  variant={isLoading ? "indeterminate" : "determinate"}
                  value={progress}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#fff',
                      borderRadius: 2
                    }
                  }}
                />
                {!isLoading && estimatedDuration > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {formatTime(currentTime)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {formatTime(estimatedDuration)}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Tooltip title={isPlaying ? "Arrêter" : "Lire"}>
                <IconButton
                  onClick={isPlaying ? onStop : onPlay}
                  disabled={isLoading}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    width: 48,
                    height: 48,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.3)',
                      transform: 'scale(1.05)'
                    },
                    '&:disabled': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.5)'
                    }
                  }}
                >
                  {isLoading ? (
                    <Box sx={{ position: 'relative' }}>
                      <MicIcon sx={{ fontSize: 24 }} />
                    </Box>
                  ) : isPlaying ? (
                    <StopIcon sx={{ fontSize: 24 }} />
                  ) : (
                    <PlayIcon sx={{ fontSize: 24 }} />
                  )}
                </IconButton>
              </Tooltip>
            </Box>

            {/* Status text */}
            <Box sx={{ mt: 1, textAlign: 'center' }}>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.75rem'
                }}
              >
                {isLoading
                  ? (currentLanguage === 'ar' ? 'جاري التحميل...' : 'Génération audio...')
                  : isPlaying
                  ? (currentLanguage === 'ar' ? 'جاري القراءة...' : 'Lecture en cours...')
                  : (currentLanguage === 'ar' ? 'جاهز للقراءة' : 'Prêt à lire')
                }
              </Typography>
            </Box>
          </Box>
        )}

        {/* CSS animations */}
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-4px); }
            60% { transform: translateY(-2px); }
          }
          
          @keyframes ripple {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.5); opacity: 0; }
          }
        `}</style>
      </Paper>
    </Slide>
  );
};

export default TTSFloatingPanel;
