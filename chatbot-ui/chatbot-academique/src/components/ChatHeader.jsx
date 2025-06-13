import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Tooltip
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { DRAWER_WIDTH, LANGUAGES, translations } from '../constants/config';

const ChatHeader = ({
  drawerOpen = false,
  darkMode = false,
  currentLanguage = 'en',
  conversationHistory = [],
  currentChatId = null,
  user = null,
  onDrawerToggle = () => {},
  onSettingsOpen = () => {},
  onAuthAction = () => {},
  sidebarWidth = DRAWER_WIDTH
}) => {
  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key] || key;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: '100%',
        ml: 0,
        mr: 0,
        transition: theme => theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        bgcolor: darkMode
          ? 'rgba(0,0,0,0.9)'
          : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        color: 'text.primary',
        borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
        boxShadow: darkMode
          ? '0 1px 20px rgba(0,0,0,0.3)'
          : '0 1px 20px rgba(0,0,0,0.08)',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{
        minHeight: { xs: 56, sm: 64 },
        px: { xs: 2, sm: 3 }
      }}>
        <IconButton
          edge={currentLanguage === 'ar' ? 'end' : 'start'}
          onClick={onDrawerToggle}
          sx={{
            mr: currentLanguage === 'ar' ? 0 : 2,
            ml: currentLanguage === 'ar' ? 2 : 0,
            width: 40,
            height: 40,
            borderRadius: '12px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              transform: 'scale(1.05)',
            }
          }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            fontSize: { xs: '1.1rem', sm: '1.3rem' },
            textAlign: currentLanguage === 'ar' ? 'right' : 'left',
            background: darkMode
              ? 'linear-gradient(45deg, #fff, #e2e8f0)'
              : 'linear-gradient(45deg, #1a202c, #2d3748)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em'
          }}
        >
          {conversationHistory.find(c => c.id === currentChatId)?.title || t('newConversation')}
        </Typography>

        <Button
          color="primary"
          variant={user ? "outlined" : "contained"}
          onClick={onAuthAction}
          sx={{
            ml: 1,
            mr: currentLanguage === 'ar' ? 2 : 0,
            borderRadius: '12px',
            px: 3,
            py: 1,
            fontWeight: 600,
            textTransform: 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            ...(user ? {
              borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
              color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
              '&:hover': {
                borderColor: '#ef4444',
                color: '#ef4444',
                bgcolor: 'rgba(239,68,68,0.1)',
                transform: 'translateY(-1px)',
              }
            } : {
              bgcolor: '#10a37f',
              '&:hover': {
                bgcolor: '#0d8f6b',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(16,163,127,0.3)',
              }
            })
          }}
        >
          {user ? t('logout') : t('login')}
        </Button>

        <Tooltip title="Change Language / Changer la langue / تغيير اللغة" arrow>
          <IconButton
            size="small"
            onClick={onSettingsOpen}
            sx={{
              ml: currentLanguage === 'ar' ? 0 : 1,
              mr: currentLanguage === 'ar' ? 1 : 0,
              width: 40,
              height: 40,
              borderRadius: '12px',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                transform: 'scale(1.05)',
              }
            }}
          >
            <Typography sx={{
              fontSize: '1.4rem',
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {LANGUAGES.find(l => l.code === currentLanguage)?.flag}
            </Typography>
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default ChatHeader;
