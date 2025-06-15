import { useState } from 'react';
import {
  IconButton,
  Tooltip,
  keyframes,
  styled,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';
import {
  Science as ScienceIcon,
  AutoAwesome as AutoAwesomeIcon,
  Psychology as PsychologyIcon,
  CheckCircle as CheckCircleIcon,
  Search as SearchIcon
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
const AnimatedIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => !['isActive', 'darkMode'].includes(prop),
})(({ theme, isActive, darkMode }) => ({
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
  currentLanguage = 'fr',
  darkMode = false,
  isActive = false,
  isLoading = false,
  isCompleted = false,
  size = 'small',
  statusMessage = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const translations = {
    fr: {
      research: 'Intelligence SMA',
      tooltip: isLoading
        ? 'SMA en cours - Analyse des sites ENIAD et UMP...'
        : isCompleted
        ? 'SMA Terminé - Intelligence web collectée avec succès'
        : isActive
        ? 'SMA Activé - Intelligence Web en temps réel d\'ENIAD et UMP'
        : 'Activer SMA - Surveillance et intelligence web multi-agents intelligente',
      loading: 'Analyse...',
      completed: 'Terminé',
      active: 'SMA Activé'
    },
    ar: {
      research: 'ذكاء SMA',
      tooltip: isLoading
        ? 'SMA قيد التحميل - فحص مواقع ENIAD و UMP...'
        : isCompleted
        ? 'SMA مكتمل - تم جمع ذكاء الويب بنجاح'
        : isActive
        ? 'SMA نشط - ذكاء الويب في الوقت الفعلي من ENIAD و UMP'
        : 'تفعيل SMA - مراقبة وذكاء الويب متعدد الوكلاء الذكي',
      loading: 'فحص...',
      completed: 'مكتمل',
      active: 'SMA نشط'
    }
  };

  const t = translations[currentLanguage] || translations.fr;

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
    if (isLoading) {
      return (
        <CircularProgress
          size={size === 'small' ? 14 : 18}
          thickness={4}
          sx={{
            color: '#10a37f',
            filter: 'drop-shadow(0 0 4px rgba(16, 163, 127, 0.5))',
          }}
        />
      );
    } else if (isCompleted) {
      return (
        <CheckCircleIcon
          sx={{
            fontSize: size === 'small' ? 16 : 20,
            color: '#10a37f',
            filter: 'drop-shadow(0 0 4px rgba(16, 163, 127, 0.5))',
            animation: `${pulseGlow} 1s ease-out`,
          }}
        />
      );
    } else if (isActive) {
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
        <SearchIcon
          sx={{
            fontSize: size === 'small' ? 16 : 20,
            transition: 'all 0.3s ease',
          }}
        />
      );
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Tooltip
        title={
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {t.tooltip}
            </Typography>
            {statusMessage && (
              <Typography variant="caption" sx={{ opacity: 0.8, mt: 0.5, display: 'block' }}>
                {statusMessage}
              </Typography>
            )}
          </Box>
        }
        placement="top"
        arrow
      >
        <span>
          <AnimatedIconButton
            onClick={handleClick}
            disabled={disabled || isLoading}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            isActive={isActive || isLoading || isCompleted}
            darkMode={darkMode}
            size={size}
          >
            {getIcon()}
          </AnimatedIconButton>
        </span>
      </Tooltip>

      {(isLoading || isCompleted || isActive) && (
        <Typography
          variant="caption"
          sx={{
            color: isLoading ? '#10a37f' : isCompleted ? '#10a37f' : '#10a37f',
            fontWeight: 500,
            fontSize: '0.7rem',
            opacity: 0.8,
            minWidth: 'fit-content'
          }}
        >
          {isLoading ? t.loading : isCompleted ? t.completed : t.active}
        </Typography>
      )}
    </Box>
  );
};

export default ResearchButton;
