import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Tooltip,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ContactSupport as ContactIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { DRAWER_WIDTH, LANGUAGES, translations } from '../constants/config';

const ChatHeader = ({
  drawerOpen = false,
  darkMode = false,
  currentLanguage = 'fr',
  conversationHistory = [],
  currentChatId = null,
  user = null,
  onDrawerToggle = () => {},
  onSettingsOpen = () => {},
  onAuthAction = () => {},
  sidebarWidth = DRAWER_WIDTH
}) => {
  const [userMenuAnchor, setUserMenuAnchor] = React.useState(null);
  const userMenuOpen = Boolean(userMenuAnchor);

  const t = (key) => translations[currentLanguage]?.[key] || translations.fr[key] || key;

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    onAuthAction();
  };

  const handleSettings = () => {
    handleUserMenuClose();
    onSettingsOpen();
  };

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

        {/* ENIAD Logo - Clickable */}
        <Box
          component="a"
          href="https://eniad.ump.ma/fr"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'flex',
            alignItems: 'center',
            mr: currentLanguage === 'ar' ? 0 : 2,
            ml: currentLanguage === 'ar' ? 2 : 0,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="ENIAD Logo - Visit Website"
            sx={{
              height: { xs: 32, sm: 40 },
              width: 'auto',
              cursor: 'pointer'
            }}
          />
        </Box>

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

        {/* User Profile Menu or Login Button */}
        {user ? (
          <>
            <Tooltip title={user.displayName || user.email} arrow>
              <IconButton
                onClick={handleUserMenuOpen}
                sx={{
                  ml: 1,
                  mr: currentLanguage === 'ar' ? 2 : 0,
                  p: 0.5,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <Avatar
                  src={user.photoURL}
                  alt={user.displayName || user.email}
                  sx={{
                    width: 36,
                    height: 36,
                    border: `2px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#10a37f',
                      boxShadow: '0 0 0 2px rgba(16,163,127,0.2)',
                    }
                  }}
                >
                  {!user.photoURL && (user.displayName?.[0] || user.email?.[0] || 'U')}
                </Avatar>
              </IconButton>
            </Tooltip>

            {/* User Menu */}
            <Menu
              anchorEl={userMenuAnchor}
              open={userMenuOpen}
              onClose={handleUserMenuClose}
              onClick={handleUserMenuClose}
              PaperProps={{
                elevation: 8,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: 2,
                  bgcolor: darkMode ? 'rgba(45, 55, 72, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: currentLanguage === 'ar' ? 'auto' : 14,
                    left: currentLanguage === 'ar' ? 14 : 'auto',
                    width: 10,
                    height: 10,
                    bgcolor: darkMode ? 'rgba(45, 55, 72, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                    borderRight: 'none',
                    borderBottom: 'none',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{
                horizontal: currentLanguage === 'ar' ? 'left' : 'right',
                vertical: 'top'
              }}
              anchorOrigin={{
                horizontal: currentLanguage === 'ar' ? 'left' : 'right',
                vertical: 'bottom'
              }}
            >
              {/* User Info */}
              <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: darkMode ? '#ffffff' : '#1a202c' }}>
                  {user.displayName || 'User'}
                </Typography>
                <Typography variant="caption" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
                  {user.email}
                </Typography>
              </Box>

              {/* Menu Items */}
              <MenuItem
                onClick={handleSettings}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'
                  }
                }}
              >
                <ListItemIcon>
                  <SettingsIcon fontSize="small" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }} />
                </ListItemIcon>
                <ListItemText
                  primary={t('settings')}
                  sx={{ color: darkMode ? '#ffffff' : '#1a202c' }}
                />
              </MenuItem>

              <MenuItem
                onClick={() => window.open('https://eniad.ump.ma/fr/contact', '_blank')}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'
                  }
                }}
              >
                <ListItemIcon>
                  <ContactIcon fontSize="small" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }} />
                </ListItemIcon>
                <ListItemText
                  primary={t('contact') || 'Contact us'}
                  sx={{ color: darkMode ? '#ffffff' : '#1a202c' }}
                />
              </MenuItem>

              <Divider sx={{ my: 0.5, borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }} />

              <MenuItem
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  color: '#ef4444',
                  '&:hover': {
                    bgcolor: 'rgba(239, 68, 68, 0.1)'
                  }
                }}
              >
                <ListItemIcon>
                  <LogoutIcon fontSize="small" sx={{ color: '#ef4444' }} />
                </ListItemIcon>
                <ListItemText
                  primary={t('logout')}
                  sx={{ color: '#ef4444' }}
                />
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            color="primary"
            variant="contained"
            onClick={onAuthAction}
            sx={{
              ml: 1,
              mr: currentLanguage === 'ar' ? 2 : 0,
              borderRadius: '12px',
              px: 3,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              bgcolor: '#10a37f',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: '#0d8f6b',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(16,163,127,0.3)',
              }
            }}
          >
            {t('login')}
          </Button>
        )}

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
