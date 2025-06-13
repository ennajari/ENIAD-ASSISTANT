import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Collapse,
  Avatar,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  Settings as SettingsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  MoreHoriz as MoreHorizIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  History as HistoryIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { DRAWER_WIDTH, translations } from '../constants/config';

const ChatSidebar = ({
  open = false,
  onClose = () => {},
  variant = 'persistent',
  anchor = 'left',
  currentLanguage = 'en',
  darkMode = false,
  prefersDarkMode = false,
  conversationHistory = [],
  currentChatId = null,
  onNewChat = () => {},
  onLoadChat = () => {},
  onChatMenuOpen = () => {},
  onToggleDarkMode = () => {},
  onSettingsOpen = () => {},
  isMobile = false,
  onSidebarCollapse = () => {},
  sidebarCollapsed = false
}) => {
  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key] || key;
  const [showHistory, setShowHistory] = useState(true);

  const sidebarWidth = sidebarCollapsed ? 72 : DRAWER_WIDTH;

  const handleCollapseToggle = () => {
    if (typeof onSidebarCollapse === 'function') {
      onSidebarCollapse(!sidebarCollapsed);
    }
  };

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      anchor={anchor}
      SlideProps={{ direction: currentLanguage === 'ar' ? 'left' : 'right' }}
      sx={{
        width: {
          xs: 0,
          md: open ? sidebarWidth : 0
        },
        flexShrink: 0,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'fixed',
        height: '100vh',
        zIndex: 1200,
        '& .MuiDrawer-paper': {
          width: sidebarWidth,
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease',
          backgroundColor: darkMode
            ? 'rgba(0,0,0,0.95)'
            : 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${darkMode
            ? 'rgba(255,255,255,0.1)'
            : 'rgba(0,0,0,0.08)'}`,
          borderRight: currentLanguage === 'ar' ? 'none' : undefined,
          borderLeft: currentLanguage === 'ar' ? undefined : 'none',
          boxShadow: sidebarCollapsed
            ? (darkMode
                ? (currentLanguage === 'ar' ? '-2px 0 15px rgba(0,0,0,0.2)' : '2px 0 15px rgba(0,0,0,0.2)')
                : (currentLanguage === 'ar' ? '-2px 0 15px rgba(0,0,0,0.08)' : '2px 0 15px rgba(0,0,0,0.08)'))
            : (darkMode
                ? (currentLanguage === 'ar' ? '-4px 0 20px rgba(0,0,0,0.3)' : '4px 0 20px rgba(0,0,0,0.3)')
                : (currentLanguage === 'ar' ? '-4px 0 20px rgba(0,0,0,0.1)' : '4px 0 20px rgba(0,0,0,0.1)')),
          overflow: 'hidden',
          position: 'fixed',
          height: '100vh',
          top: 0,
          left: currentLanguage === 'ar' ? 'auto' : 0,
          right: currentLanguage === 'ar' ? 0 : 'auto',
          zIndex: 1200,
          direction: currentLanguage === 'ar' ? 'rtl' : 'ltr',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: sidebarCollapsed
              ? 'linear-gradient(180deg, rgba(16,163,127,0.02) 0%, transparent 100%)'
              : 'transparent',
            transition: 'background 0.3s ease',
            pointerEvents: 'none',
          }
        },
      }}
    >
      {/* Header */}
      <Box sx={{
        p: sidebarCollapsed ? 1 : 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
        minHeight: 64,
        direction: currentLanguage === 'ar' ? 'rtl' : 'ltr',
        flexDirection: currentLanguage === 'ar' ? 'row-reverse' : 'row'
      }}>
        {!sidebarCollapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{
              width: 32,
              height: 32,
              bgcolor: '#10a37f',
              fontSize: '14px',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(16,163,127,0.3)',
            }}>
              <SchoolIcon fontSize="small" />
            </Avatar>
            <Typography variant="h6" sx={{
              fontWeight: 700,
              color: darkMode ? '#fff' : 'text.primary',
              background: darkMode
                ? 'linear-gradient(45deg, #fff, #e2e8f0)'
                : 'linear-gradient(45deg, #1a202c, #2d3748)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em'
            }}>
              ENIAD AI
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {!isMobile && (
            <Tooltip title={sidebarCollapsed ? t('expand') : t('collapse')} arrow>
              <IconButton
                onClick={handleCollapseToggle}
                size="small"
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    transform: 'scale(1.05)',
                  }
                }}
              >
                {currentLanguage === 'ar'
                  ? (sidebarCollapsed ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />)
                  : (sidebarCollapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />)
                }
              </IconButton>
            </Tooltip>
          )}

          {isMobile && (
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                width: 32,
                height: 32,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(239,68,68,0.1)',
                  color: '#ef4444',
                  transform: 'scale(1.05)',
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* New Chat Button */}
      <Box sx={{
        p: sidebarCollapsed ? 1 : 2,
        direction: currentLanguage === 'ar' ? 'rtl' : 'ltr'
      }}>
        <Tooltip title={sidebarCollapsed ? t('newChat') : ''} arrow placement="right">
          <Button
            fullWidth={!sidebarCollapsed}
            variant="contained"
            color="primary"
            className={currentLanguage === 'ar' ? 'new-chat-button' : ''}
            onClick={onNewChat}
            sx={{
              textTransform: 'none',
              py: sidebarCollapsed ? 1.5 : 1.5,
              px: sidebarCollapsed ? 1.5 : 2,
              borderRadius: '12px',
              minWidth: sidebarCollapsed ? 48 : 'auto',
              width: sidebarCollapsed ? 48 : '100%',
              height: 48,
              bgcolor: '#10a37f',
              boxShadow: '0 2px 8px rgba(16,163,127,0.3)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              direction: currentLanguage === 'ar' ? 'rtl' : 'ltr',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: sidebarCollapsed ? 0 : 1,
              flexDirection: currentLanguage === 'ar' ? 'row-reverse' : 'row',
              fontFamily: currentLanguage === 'ar'
                ? '"Segoe UI", "Tahoma", "Arial", sans-serif'
                : 'inherit',
              '&:hover': {
                bgcolor: '#0d8f6b',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(16,163,127,0.4)',
              },
              '&:active': {
                transform: 'translateY(0)',
              }
            }}
          >
            {sidebarCollapsed ? (
              <AddIcon fontSize="small" />
            ) : (
              <>
                {currentLanguage === 'ar' ? (
                  <>
                    <span
                      className="new-chat-text"
                      style={{
                        direction: 'rtl',
                        textAlign: 'right',
                        fontFamily: '"Segoe UI", "Tahoma", "Arial", sans-serif',
                        unicodeBidi: 'bidi-override'
                      }}
                    >
                      {t('newChat')}
                    </span>
                    <AddIcon fontSize="small" />
                  </>
                ) : (
                  <>
                    <AddIcon fontSize="small" />
                    <span>{t('newChat')}</span>
                  </>
                )}
              </>
            )}
          </Button>
        </Tooltip>
      </Box>

      {/* Chat History Section */}
      {!sidebarCollapsed && (
        <Box sx={{
          px: 2,
          pb: 1,
          direction: currentLanguage === 'ar' ? 'rtl' : 'ltr'
        }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              direction: currentLanguage === 'ar' ? 'rtl' : 'ltr',
              flexDirection: currentLanguage === 'ar' ? 'row-reverse' : 'row'
            }}
          >
            <Button
              variant="text"
              startIcon={currentLanguage !== 'ar' ? <HistoryIcon fontSize="small" /> : null}
              endIcon={currentLanguage === 'ar' ? <HistoryIcon fontSize="small" /> : null}
              onClick={() => setShowHistory(!showHistory)}
              sx={{
                color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                textTransform: 'none',
                fontWeight: 500,
                py: 1,
                px: 1,
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                minWidth: 'auto',
                flex: 1,
                justifyContent: currentLanguage === 'ar' ? 'flex-end' : 'flex-start',
                direction: currentLanguage === 'ar' ? 'rtl' : 'ltr',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '0.85rem',
                '& .MuiButton-startIcon': {
                  marginLeft: currentLanguage === 'ar' ? 8 : 0,
                  marginRight: currentLanguage === 'ar' ? 0 : 8,
                  flexShrink: 0,
                },
                '& .MuiButton-endIcon': {
                  marginLeft: currentLanguage === 'ar' ? 0 : 8,
                  marginRight: currentLanguage === 'ar' ? 8 : 0,
                  flexShrink: 0,
                },
                '&:hover': {
                  bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  transform: currentLanguage === 'ar' ? 'translateX(-2px)' : 'translateX(2px)',
                }
              }}
            >
              {t('chatHistory')}
            </Button>

            <Chip
              label={conversationHistory.length}
              size="small"
              className={currentLanguage === 'ar' ? 'number-display' : ''}
              sx={{
                height: 20,
                fontSize: '0.7rem',
                bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                transition: 'all 0.2s ease',
                [currentLanguage === 'ar' ? 'marginRight' : 'marginLeft']: 1,
                order: currentLanguage === 'ar' ? -1 : 1,
                '& .MuiChip-label': {
                  direction: 'ltr',
                  unicodeBidi: 'plaintext',
                  fontFamily: currentLanguage === 'ar'
                    ? '"Segoe UI", "Tahoma", "Arial", sans-serif'
                    : 'inherit',
                }
              }}
            />
          </Box>
        </Box>
      )}

      <Collapse in={showHistory && !sidebarCollapsed}>
        <List sx={{
          overflow: 'auto',
          flex: 1,
          px: sidebarCollapsed ? 0.5 : 1,
          maxHeight: 'calc(100vh - 300px)',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            borderRadius: '2px',
            '&:hover': {
              bgcolor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
            }
          }
        }}>
          {conversationHistory.map((convo) => (
            <ListItem key={convo.id} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip
                title={sidebarCollapsed ? convo.title : ''}
                arrow
                placement="right"
                disableHoverListener={!sidebarCollapsed}
              >
                <ListItemButton
                  selected={currentChatId === convo.id}
                  onClick={() => onLoadChat(convo.id)}
                  sx={{
                    borderRadius: '12px',
                    mx: 0.5,
                    px: sidebarCollapsed ? 1 : 2,
                    py: 1.5,
                    minHeight: 48,
                    position: 'relative',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    flexDirection: currentLanguage === 'ar' ? 'row-reverse' : 'row',
                    alignItems: 'center',
                    '&.Mui-selected': {
                      bgcolor: 'rgba(16,163,127,0.15)',
                      border: `1px solid rgba(16,163,127,0.3)`,
                      boxShadow: '0 2px 8px rgba(16,163,127,0.2)',
                      '&:hover': {
                        bgcolor: 'rgba(16,163,127,0.2)',
                        transform: currentLanguage === 'ar' ? 'translateX(-2px)' : 'translateX(2px)',
                      }
                    },
                    '&:not(.Mui-selected)': {
                      bgcolor: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`,
                      '&:hover': {
                        bgcolor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                        transform: currentLanguage === 'ar' ? 'translateX(-4px)' : 'translateX(4px)',
                        boxShadow: darkMode
                          ? '0 2px 8px rgba(0,0,0,0.2)'
                          : '0 2px 8px rgba(0,0,0,0.1)',
                      }
                    }
                  }}
                >
                  {sidebarCollapsed ? (
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%'
                    }}>
                      <ChatIcon
                        fontSize="small"
                        sx={{
                          color: currentChatId === convo.id
                            ? '#10a37f'
                            : (darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'),
                          transition: 'all 0.2s ease',
                        }}
                      />
                    </Box>
                  ) : (
                    <>
                      <ListItemIcon sx={{
                        minWidth: 32,
                        [currentLanguage === 'ar' ? 'ml' : 'mr']: 1.5,
                        order: currentLanguage === 'ar' ? 3 : 1
                      }}>
                        <ChatIcon
                          fontSize="small"
                          sx={{
                            color: currentChatId === convo.id
                              ? '#10a37f'
                              : (darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)')
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={convo.title}
                        primaryTypographyProps={{
                          sx: {
                            fontWeight: currentChatId === convo.id ? '600' : '500',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: '0.875rem',
                            lineHeight: 1.4,
                            color: currentChatId === convo.id
                              ? (darkMode ? '#fff' : '#000')
                              : (darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)'),
                            textAlign: currentLanguage === 'ar' ? 'right' : 'left',
                            direction: currentLanguage === 'ar' ? 'rtl' : 'ltr'
                          }
                        }}
                        secondary={new Date(convo.lastUpdated).toLocaleDateString()}
                        secondaryTypographyProps={{
                          sx: {
                            fontSize: '0.75rem',
                            color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                            mt: 0.5,
                            textAlign: currentLanguage === 'ar' ? 'right' : 'left',
                            direction: currentLanguage === 'ar' ? 'rtl' : 'ltr'
                          }
                        }}
                        sx={{
                          order: currentLanguage === 'ar' ? 2 : 2,
                          flex: 1
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={e => {
                          e.stopPropagation();
                          onChatMenuOpen(e, convo.id);
                        }}
                        sx={{
                          width: 28,
                          height: 28,
                          opacity: 0.7,
                          transition: 'all 0.2s ease',
                          order: currentLanguage === 'ar' ? 1 : 3,
                          '&:hover': {
                            opacity: 1,
                            bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                            transform: 'scale(1.1)',
                          }
                        }}
                      >
                        <MoreHorizIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Collapse>

      {/* Footer */}
      <Box sx={{
        p: sidebarCollapsed ? 1 : 2,
        borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: sidebarCollapsed ? 'center' : 'space-between',
        flexDirection: sidebarCollapsed ? 'column' : (currentLanguage === 'ar' ? 'row-reverse' : 'row'),
        gap: sidebarCollapsed ? 1 : 0,
        minHeight: 64,
        direction: currentLanguage === 'ar' ? 'rtl' : 'ltr'
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: sidebarCollapsed ? 'column' : 'row',
          gap: sidebarCollapsed ? 1 : 0.5
        }}>
          <Tooltip
            title={darkMode === prefersDarkMode
              ? t('usingSystemPreference')
              : darkMode ? t('lightMode') : t('darkMode')}
            arrow
            placement={sidebarCollapsed ? 'right' : 'top'}
          >
            <IconButton
              onClick={onToggleDarkMode}
              size="small"
              sx={{
                width: 36,
                height: 36,
                opacity: darkMode === prefersDarkMode ? 0.7 : 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  transform: 'scale(1.05)',
                }
              }}
            >
              {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          <Tooltip title={t('settings')} arrow placement={sidebarCollapsed ? 'right' : 'top'}>
            <IconButton
              onClick={onSettingsOpen}
              size="small"
              sx={{
                width: 36,
                height: 36,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  transform: 'scale(1.05)',
                }
              }}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {!sidebarCollapsed && (
          <Typography variant="caption" sx={{
            color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
            fontSize: '0.7rem',
            fontWeight: 500
          }}>
            {translations[currentLanguage].version}
          </Typography>
        )}
      </Box>
    </Drawer>
  );
};

export default ChatSidebar;
