import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Tooltip,
  Box,
  CircularProgress,
  Fade,
  Zoom
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Mic as MicIcon,
  GraphicEq as GraphicEqIcon
} from '@mui/icons-material';

const TTSButton = ({
  text,
  messageId,
  language = 'fr',
  darkMode = false,
  onSpeakText,
  isSpeaking = false,
  isLoading = false,
  supported = true,
  size = 'small',
  showLabel = false,
  variant = 'default' // 'default', 'premium', 'minimal'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Trigger animation when speaking state changes
  useEffect(() => {
    if (isSpeaking) {
      setAnimationKey(prev => prev + 1);
    }
  }, [isSpeaking]);

  // Detect language for better UX
  const detectLanguage = (text) => {
    if (!text) return language;
    
    // Simple Arabic detection
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
    if (arabicRegex.test(text)) {
      return 'ar';
    }
    
    // Default to provided language or French
    return language || 'fr';
  };

  const detectedLanguage = detectLanguage(text);

  // Get appropriate tooltip text
  const getTooltipText = () => {
    if (!supported) {
      return detectedLanguage === 'ar' ? 'TTS غير مدعوم' : 'TTS non supporté';
    }
    
    if (isLoading) {
      return detectedLanguage === 'ar' ? 'جاري التحميل...' : 'Chargement...';
    }
    
    if (isSpeaking) {
      return detectedLanguage === 'ar' ? 'إيقاف القراءة' : 'Arrêter la lecture';
    }
    
    return detectedLanguage === 'ar' 
      ? `قراءة النص (${detectedLanguage.toUpperCase()})` 
      : `Lire le texte (${detectedLanguage.toUpperCase()})`;
  };

  // Get button styles based on variant and state
  const getButtonStyles = () => {
    const baseSize = size === 'small' ? 32 : size === 'medium' ? 40 : 48;
    
    const baseStyles = {
      width: baseSize,
      height: baseSize,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
    };

    if (variant === 'premium') {
      return {
        ...baseStyles,
        background: isSpeaking
          ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
          : isLoading
          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
          : 'linear-gradient(135deg, #10a37f 0%, #059669 100%)',
        color: '#fff',
        boxShadow: isSpeaking
          ? '0 4px 20px rgba(239,68,68,0.4), 0 0 0 2px rgba(239,68,68,0.2)'
          : isLoading
          ? '0 4px 20px rgba(245,158,11,0.4), 0 0 0 2px rgba(245,158,11,0.2)'
          : '0 4px 20px rgba(16,163,127,0.4), 0 0 0 2px rgba(16,163,127,0.2)',
        '&:hover:not(:disabled)': {
          transform: 'scale(1.1) translateY(-2px)',
          boxShadow: isSpeaking
            ? '0 8px 30px rgba(239,68,68,0.5), 0 0 0 3px rgba(239,68,68,0.3)'
            : '0 8px 30px rgba(16,163,127,0.5), 0 0 0 3px rgba(16,163,127,0.3)',
        },
        '&:disabled': {
          background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
          color: 'rgba(255,255,255,0.5)',
          boxShadow: 'none',
        }
      };
    }

    if (variant === 'minimal') {
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
        color: isSpeaking
          ? '#ef4444'
          : isLoading
          ? '#f59e0b'
          : (darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'),
        '&:hover:not(:disabled)': {
          backgroundColor: isSpeaking
            ? 'rgba(239,68,68,0.1)'
            : 'rgba(16,163,127,0.1)',
          transform: 'scale(1.1)',
        },
        '&:disabled': {
          color: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
        }
      };
    }

    // Default variant
    return {
      ...baseStyles,
      backgroundColor: isSpeaking
        ? (darkMode ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.1)')
        : isLoading
        ? (darkMode ? 'rgba(245,158,11,0.2)' : 'rgba(245,158,11,0.1)')
        : (darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
      color: isSpeaking
        ? '#ef4444'
        : isLoading
        ? '#f59e0b'
        : (darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'),
      '&:hover:not(:disabled)': {
        backgroundColor: isSpeaking
          ? '#ef4444'
          : isLoading
          ? '#f59e0b'
          : '#10a37f',
        color: '#fff',
        transform: 'scale(1.05)',
      },
      '&:disabled': {
        opacity: 0.3,
      }
    };
  };

  // Get appropriate icon based on state
  const getIcon = () => {
    const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;
    
    if (isLoading) {
      return (
        <CircularProgress
          size={iconSize}
          thickness={4}
          sx={{
            color: 'inherit',
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            }
          }}
        />
      );
    }

    if (isSpeaking) {
      return variant === 'premium' ? (
        <Zoom in={true} key={`speaking-${animationKey}`}>
          <GraphicEqIcon 
            sx={{ 
              fontSize: iconSize,
              animation: 'pulse 1.5s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.1)' }
              }
            }} 
          />
        </Zoom>
      ) : (
        <StopIcon sx={{ fontSize: iconSize }} />
      );
    }

    return variant === 'premium' ? (
      <MicIcon sx={{ fontSize: iconSize }} />
    ) : (
      <PlayIcon sx={{ fontSize: iconSize }} />
    );
  };

  const handleClick = () => {
    if (!supported || !text) return;
    onSpeakText(text, messageId, detectedLanguage);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Tooltip title={getTooltipText()} arrow placement="top">
        <span>
          <IconButton
            size={size}
            onClick={handleClick}
            disabled={!supported || !text || isLoading}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={getButtonStyles()}
          >
            {/* Background animation for premium variant */}
            {variant === 'premium' && isSpeaking && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                  animation: 'shimmer 2s infinite',
                  '@keyframes shimmer': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' }
                  }
                }}
              />
            )}
            
            {getIcon()}
          </IconButton>
        </span>
      </Tooltip>

      {/* Label for premium variant */}
      {showLabel && (
        <Fade in={isHovered || isSpeaking}>
          <Box
            sx={{
              fontSize: '0.75rem',
              color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
              fontWeight: 500,
              whiteSpace: 'nowrap'
            }}
          >
            {isSpeaking
              ? (detectedLanguage === 'ar' ? 'جاري القراءة...' : 'En cours...')
              : (detectedLanguage === 'ar' ? 'ElevenLabs TTS' : 'ElevenLabs TTS')
            }
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default TTSButton;
