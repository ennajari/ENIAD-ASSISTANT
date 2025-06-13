import { createTheme } from '@mui/material/styles';
import { DRAWER_WIDTH } from '../constants/config';

export const createAppTheme = (darkMode, currentLanguage, drawerOpen) => {
  return createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#10a37f',
        dark: '#0d8f6b',
        light: '#1db584',
        contrastText: '#ffffff',
      },
      secondary: {
        main: darkMode ? '#6366f1' : '#4f46e5',
        dark: darkMode ? '#4f46e5' : '#3730a3',
        light: darkMode ? '#818cf8' : '#6366f1',
        contrastText: '#ffffff',
      },
      background: {
        default: darkMode ? '#0a0a0a' : '#f8fafc',
        paper: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
      },
      text: {
        primary: darkMode ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.87)',
        secondary: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
      },
      divider: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
      action: {
        hover: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
        selected: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
        disabled: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.26)',
      },
    },
    direction: currentLanguage === 'ar' ? 'rtl' : 'ltr',
    typography: {
      fontFamily: currentLanguage === 'ar'
        ? 'Arial, "Helvetica Neue", Helvetica, sans-serif'
        : '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      h1: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h3: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
      body1: {
        lineHeight: 1.6,
      },
      body2: {
        lineHeight: 1.5,
      },
      button: {
        fontWeight: 500,
        letterSpacing: '0.02em',
      },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: ({ theme, ownerState }) => ({
            textTransform: 'none',
            borderRadius: '12px',
            fontWeight: 500,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
            ...(ownerState.variant === 'contained' && {
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transform: 'translateY(-2px)',
              },
            }),
          }),
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: '12px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(0,0,0,0.04)',
              transform: 'scale(1.05)',
            },
            '&:focus-visible': {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: '2px',
            },
          }),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundImage: 'none',
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.1)'
              : 'rgba(0,0,0,0.08)'}`,
          }),
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: ({ theme }) => ({
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: 'none',
            borderLeft: 'none',
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(0,0,0,0.9)'
              : 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.1)'
              : 'rgba(0,0,0,0.08)'}`,
            boxShadow: theme.direction === 'rtl'
              ? '-4px 0 20px rgba(0,0,0,0.15)'
              : '4px 0 20px rgba(0,0,0,0.15)',
          }),
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(0,0,0,0.9)'
              : 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.1)'
              : 'rgba(0,0,0,0.08)'}`,
            borderRadius: '16px',
          }),
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: ({ theme }) => ({
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: '#10a37f',
              '& + .MuiSwitch-track': {
                backgroundColor: '#10a37f',
                opacity: 1,
              },
            },
            '& .MuiSwitch-track': {
              borderRadius: '12px',
              backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.2)'
                : 'rgba(0,0,0,0.2)',
            },
            '& .MuiSwitch-thumb': {
              borderRadius: '10px',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            },
          }),
        },
      },
    },
    '@keyframes slideInRTL': {
      '0%': { transform: 'translateX(100%)' },
      '100%': { transform: 'translateX(0)' },
    },
    '@keyframes slideOutRTL': {
      '0%': { transform: 'translateX(0)' },
      '100%': { transform: 'translateX(100%)' },
    },
    '@keyframes slideInLTR': {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(0)' },
    },
    '@keyframes slideOutLTR': {
      '0%': { transform: 'translateX(0)' },
      '100%': { transform: 'translateX(-100%)' },
    },
  });
};
