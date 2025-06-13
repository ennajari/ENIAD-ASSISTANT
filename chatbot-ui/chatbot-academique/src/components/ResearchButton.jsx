import React, { useState } from 'react';
import {
  IconButton,
  Tooltip,
  keyframes,
  styled
} from '@mui/material';
import {
  Science as ScienceIcon,
  AutoAwesome as AutoAwesomeIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';

// ChatGPT-style animations
const pulseGlow = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(16, 163, 127, 0.4);
  }
  70% {
    box-shadow: 0 0 0 4px rgba(16, 163, 127, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 163, 127, 0);
  }
`;

const iconSpin = keyframes`
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.1);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 100% 0;
  }
`;

// Styled IconButton with ChatGPT-like animations
const AnimatedIconButton = styled(IconButton)(({ theme, isActive, darkMode }) => ({
  width: 32,
  height: 32,
  borderRadius: '50%',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

  // Base styling
  backgroundColor: isActive
    ? 'rgba(16, 163, 127, 0.1)'
    : darkMode
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.02)',

  border: `1px solid ${isActive
    ? 'rgba(16, 163, 127, 0.3)'
    : darkMode
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.05)'}`,

  color: isActive
    ? '#10a37f'
    : darkMode
      ? 'rgba(255, 255, 255, 0.7)'
      : 'rgba(0, 0, 0, 0.6)',

  // Hover effects
  '&:hover': {
    backgroundColor: isActive
      ? 'rgba(16, 163, 127, 0.15)'
      : darkMode
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.04)',

    borderColor: isActive
      ? 'rgba(16, 163, 127, 0.5)'
      : darkMode
        ? 'rgba(255, 255, 255, 0.2)'
        : 'rgba(0, 0, 0, 0.1)',

    transform: 'scale(1.05)',

    boxShadow: isActive
      ? '0 4px 12px rgba(16, 163, 127, 0.3)'
      : darkMode
        ? '0 2px 8px rgba(0, 0, 0, 0.3)'
        : '0 2px 8px rgba(0, 0, 0, 0.1)',
  },

  // Active state
  '&:active': {
    transform: 'scale(0.95)',
  },

  // Focus state for accessibility
  '&:focus-visible': {
    outline: `2px solid ${isActive ? '#10a37f' : theme.palette.primary.main}`,
    outlineOffset: '2px',
  },

  // Disabled state
  '&:disabled': {
    opacity: 0.4,
    cursor: 'not-allowed',
    transform: 'none',
  },

  // Active state animations
  ...(isActive && {
    animation: `${pulseGlow} 2s infinite`,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
      animation: `${shimmer} 2s infinite`,
      borderRadius: 'inherit',
    }
  })
}));

const ResearchButton = ({
  onClick = () => {},
  disabled = false,
  currentLanguage = 'en',
  darkMode = false,
  isActive = false,
  size = 'small'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const translations = {
    en: {
      research: 'Research Mode',
      tooltip: isActive
        ? 'Research Mode Active - Enhanced AI with web search capabilities'
        : 'Enable Research Mode - Get enhanced AI responses with web search'
    },
    fr: {
      research: 'Mode Recherche',
      tooltip: isActive
        ? 'Mode Recherche Actif - IA améliorée avec recherche web'
        : 'Activer le Mode Recherche - Obtenez des réponses IA améliorées avec recherche web'
    },
    ar: {
      research: 'وضع البحث',
      tooltip: isActive
        ? 'وضع البحث نشط - ذكاء اصطناعي محسن مع البحث على الويب'
        : 'تفعيل وضع البحث - احصل على إجابات ذكاء اصطناعي محسنة مع البحث على الويب'
    }
  };

  const t = translations[currentLanguage] || translations.en;

  // Handle click with haptic feedback
  const handleClick = (e) => {
    if (disabled) return;

    // Add subtle vibration on supported devices
    if (navigator.vibrate) {
      navigator.vibrate([10]);
    }

    onClick?.(e);
  };

  // Get appropriate icon based on state
  const getIcon = () => {
    if (isActive) {
      return (
        <AutoAwesomeIcon
          sx={{
            fontSize: size === 'small' ? 16 : 20,
            animation: `${iconSpin} 3s linear infinite`,
            filter: 'drop-shadow(0 0 4px rgba(16, 163, 127, 0.5))',
          }}
        />
      );
    } else if (isHovered) {
      return (
        <PsychologyIcon
          sx={{
            fontSize: size === 'small' ? 16 : 20,
            transition: 'all 0.3s ease',
          }}
        />
      );
    } else {
      return (
        <ScienceIcon
          sx={{
            fontSize: size === 'small' ? 16 : 20,
            transition: 'all 0.3s ease',
          }}
        />
      );
    }
  };

  return (
    <Tooltip title={t.tooltip} placement="top" arrow>
      <AnimatedIconButton
        onClick={handleClick}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        isActive={isActive}
        darkMode={darkMode}
        size={size}
      >
        {getIcon()}
      </AnimatedIconButton>
    </Tooltip>
  );
};

export default ResearchButton;
