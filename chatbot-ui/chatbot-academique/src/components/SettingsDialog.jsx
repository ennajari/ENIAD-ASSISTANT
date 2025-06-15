import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  Palette as PaletteIcon,
  VolumeUp as VolumeUpIcon,
  Language as LanguageIcon,
  Info as InfoIcon,
  Psychology as BrainIcon
} from '@mui/icons-material';
import { LANGUAGES, translations } from '../constants/config';
import RagStatus from './RagStatus';

const SettingsDialog = ({
  open = false,
  onClose = () => {},
  darkMode = false,
  onToggleDarkMode = () => {},
  autoRead = false,
  onToggleAutoRead = () => {},
  currentLanguage = 'fr',
  onChangeLanguage = () => {},
  supported = false
}) => {
  const t = (key) => translations[currentLanguage]?.[key] || translations.fr[key] || key;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
      disableEnforceFocus={false}
      disableAutoFocus={false}
      PaperProps={{
        sx: {
          bgcolor: darkMode
            ? 'rgba(0,0,0,0.95)'
            : 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${darkMode
            ? 'rgba(255,255,255,0.1)'
            : 'rgba(0,0,0,0.08)'}`,
          borderRadius: '20px',
          boxShadow: darkMode
            ? '0 8px 32px rgba(0,0,0,0.5)'
            : '0 8px 32px rgba(0,0,0,0.15)',
          direction: currentLanguage === 'ar' ? 'rtl' : 'ltr',
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 3,
        pb: 2,
        background: darkMode
          ? 'linear-gradient(135deg, rgba(16,163,127,0.1), rgba(99,102,241,0.1))'
          : 'linear-gradient(135deg, rgba(16,163,127,0.05), rgba(99,102,241,0.05))',
        borderBottom: `1px solid ${darkMode
          ? 'rgba(255,255,255,0.1)'
          : 'rgba(0,0,0,0.08)'}`,
        direction: currentLanguage === 'ar' ? 'rtl' : 'ltr',
        textAlign: currentLanguage === 'ar' ? 'right' : 'left',
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexDirection: currentLanguage === 'ar' ? 'row-reverse' : 'row'
        }}>
          <Avatar sx={{
            bgcolor: '#10a37f',
            width: 40,
            height: 40,
            boxShadow: '0 4px 12px rgba(16,163,127,0.3)'
          }}>
            <PaletteIcon />
          </Avatar>
          <Box sx={{
            textAlign: currentLanguage === 'ar' ? 'right' : 'left'
          }}>
            <Typography variant="h5" sx={{
              fontWeight: 700,
              color: darkMode ? '#fff' : '#000',
              mb: 0.5,
              textAlign: currentLanguage === 'ar' ? 'right' : 'left'
            }}>
              {t('settingsTitle')}
            </Typography>
            <Typography variant="body2" sx={{
              color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
              fontSize: '0.875rem',
              textAlign: currentLanguage === 'ar' ? 'right' : 'left'
            }}>
              {t('customizeExperience')}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            width: 40,
            height: 40,
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: 'rgba(239,68,68,0.1)',
              color: '#ef4444',
              transform: 'scale(1.05)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{
        p: 3,
        pt: 2,
        direction: currentLanguage === 'ar' ? 'rtl' : 'ltr',
        textAlign: currentLanguage === 'ar' ? 'right' : 'left'
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          direction: currentLanguage === 'ar' ? 'rtl' : 'ltr'
        }}>

          {/* Appearance Section */}
          <Card sx={{
            bgcolor: darkMode
              ? 'rgba(255,255,255,0.03)'
              : 'rgba(255,255,255,0.7)',
            border: `1px solid ${darkMode
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(0,0,0,0.05)'}`,
            borderRadius: '16px',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: darkMode
                ? '0 8px 25px rgba(0,0,0,0.3)'
                : '0 8px 25px rgba(0,0,0,0.1)',
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
                flexDirection: currentLanguage === 'ar' ? 'row-reverse' : 'row',
                textAlign: currentLanguage === 'ar' ? 'right' : 'left'
              }}>
                <Avatar sx={{
                  bgcolor: darkMode ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)',
                  color: '#6366f1',
                  width: 32,
                  height: 32
                }}>
                  <PaletteIcon fontSize="small" />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t('appearance')}
                </Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={onToggleDarkMode}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#10a37f',
                        '& + .MuiSwitch-track': {
                          backgroundColor: '#10a37f',
                        },
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{
                    [currentLanguage === 'ar' ? 'mr' : 'ml']: 1,
                    textAlign: currentLanguage === 'ar' ? 'right' : 'left'
                  }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {t('darkMode')}
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                      fontSize: '0.8rem'
                    }}>
                      {t('switchThemes')}
                    </Typography>
                  </Box>
                }
                sx={{
                  justifyContent: 'space-between',
                  mx: 0,
                  width: '100%',
                  flexDirection: currentLanguage === 'ar' ? 'row-reverse' : 'row',
                  '& .MuiFormControlLabel-label': {
                    flex: 1,
                    textAlign: currentLanguage === 'ar' ? 'right' : 'left'
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Audio Section */}
          <Card sx={{
            bgcolor: darkMode
              ? 'rgba(255,255,255,0.03)'
              : 'rgba(255,255,255,0.7)',
            border: `1px solid ${darkMode
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(0,0,0,0.05)'}`,
            borderRadius: '16px',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: darkMode
                ? '0 8px 25px rgba(0,0,0,0.3)'
                : '0 8px 25px rgba(0,0,0,0.1)',
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
                flexDirection: currentLanguage === 'ar' ? 'row-reverse' : 'row',
                textAlign: currentLanguage === 'ar' ? 'right' : 'left'
              }}>
                <Avatar sx={{
                  bgcolor: darkMode ? 'rgba(16,163,127,0.2)' : 'rgba(16,163,127,0.1)',
                  color: '#10a37f',
                  width: 32,
                  height: 32
                }}>
                  <VolumeUpIcon fontSize="small" />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t('audioSettings')}
                </Typography>
                {!supported && (
                  <Chip
                    label="Not Supported"
                    size="small"
                    color="error"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                )}
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={autoRead}
                    onChange={(e) => onToggleAutoRead(e.target.checked)}
                    disabled={!supported}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#10a37f',
                        '& + .MuiSwitch-track': {
                          backgroundColor: '#10a37f',
                        },
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{
                    [currentLanguage === 'ar' ? 'mr' : 'ml']: 1,
                    textAlign: currentLanguage === 'ar' ? 'right' : 'left'
                  }}>
                    <Typography variant="body1" sx={{
                      fontWeight: 500,
                      opacity: supported ? 1 : 0.5
                    }}>
                      {t('readAloud')}
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                      fontSize: '0.8rem',
                      opacity: supported ? 1 : 0.5
                    }}>
                      {t('autoReadDescription')}
                    </Typography>
                  </Box>
                }
                sx={{
                  justifyContent: 'space-between',
                  mx: 0,
                  width: '100%',
                  flexDirection: currentLanguage === 'ar' ? 'row-reverse' : 'row',
                  '& .MuiFormControlLabel-label': {
                    flex: 1,
                    textAlign: currentLanguage === 'ar' ? 'right' : 'left'
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* RAG System Status Section */}
          <Card sx={{
            bgcolor: darkMode
              ? 'rgba(255,255,255,0.03)'
              : 'rgba(255,255,255,0.7)',
            border: `1px solid ${darkMode
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(0,0,0,0.05)'}`,
            borderRadius: '16px',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: darkMode
                ? '0 8px 25px rgba(0,0,0,0.3)'
                : '0 8px 25px rgba(0,0,0,0.1)',
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
                flexDirection: currentLanguage === 'ar' ? 'row-reverse' : 'row',
                textAlign: currentLanguage === 'ar' ? 'right' : 'left'
              }}>
                <Avatar sx={{
                  bgcolor: darkMode ? 'rgba(16,163,127,0.2)' : 'rgba(16,163,127,0.1)',
                  color: '#10a37f',
                  width: 32,
                  height: 32
                }}>
                  <BrainIcon fontSize="small" />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t('ragSystem') || 'RAG System'}
                </Typography>
              </Box>

              <RagStatus darkMode={darkMode} />
            </CardContent>
          </Card>

          {/* Language Section */}
          <Card sx={{
            bgcolor: darkMode
              ? 'rgba(255,255,255,0.03)'
              : 'rgba(255,255,255,0.7)',
            border: `1px solid ${darkMode
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(0,0,0,0.05)'}`,
            borderRadius: '16px',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: darkMode
                ? '0 8px 25px rgba(0,0,0,0.3)'
                : '0 8px 25px rgba(0,0,0,0.1)',
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 3,
                flexDirection: currentLanguage === 'ar' ? 'row-reverse' : 'row',
                textAlign: currentLanguage === 'ar' ? 'right' : 'left'
              }}>
                <Avatar sx={{
                  bgcolor: darkMode ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.1)',
                  color: '#ef4444',
                  width: 32,
                  height: 32
                }}>
                  <LanguageIcon fontSize="small" />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t('language')}
                </Typography>
              </Box>

              <Box sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                direction: currentLanguage === 'ar' ? 'rtl' : 'ltr',
                justifyContent: currentLanguage === 'ar' ? 'flex-end' : 'flex-start'
              }}>
                {LANGUAGES.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={currentLanguage === lang.code ? 'contained' : 'outlined'}
                    onClick={() => onChangeLanguage(lang.code)}
                    sx={{
                      minWidth: 120,
                      px: 3,
                      py: 1.5,
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 500,
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      flexDirection: currentLanguage === 'ar' ? 'row-reverse' : 'row',
                      ...(currentLanguage === lang.code ? {
                        bgcolor: '#10a37f',
                        color: '#fff',
                        boxShadow: '0 4px 12px rgba(16,163,127,0.3)',
                        '&:hover': {
                          bgcolor: '#0d8f6b',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 16px rgba(16,163,127,0.4)',
                        }
                      } : {
                        borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                        color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                        '&:hover': {
                          borderColor: '#10a37f',
                          color: '#10a37f',
                          bgcolor: 'rgba(16,163,127,0.05)',
                          transform: 'translateY(-1px)',
                        }
                      })
                    }}
                  >
                    <Typography sx={{ fontSize: '1.2rem' }}>
                      {lang.flag}
                    </Typography>
                    <Typography variant="body2">
                      {lang.label}
                    </Typography>
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Info Section */}
          <Card sx={{
            bgcolor: darkMode
              ? 'rgba(255,255,255,0.03)'
              : 'rgba(255,255,255,0.7)',
            border: `1px solid ${darkMode
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(0,0,0,0.05)'}`,
            borderRadius: '16px',
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
                flexDirection: currentLanguage === 'ar' ? 'row-reverse' : 'row',
                textAlign: currentLanguage === 'ar' ? 'right' : 'left'
              }}>
                <Avatar sx={{
                  bgcolor: darkMode ? 'rgba(156,163,175,0.2)' : 'rgba(156,163,175,0.1)',
                  color: '#9ca3af',
                  width: 32,
                  height: 32
                }}>
                  <InfoIcon fontSize="small" />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t('about')}
                </Typography>
              </Box>

              <Typography variant="body2" sx={{
                color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                lineHeight: 1.6,
                textAlign: currentLanguage === 'ar' ? 'right' : 'left',
                direction: currentLanguage === 'ar' ? 'rtl' : 'ltr'
              }}>
                ENIAD AI Assistant • {t('version')}
                <br />
                {t('poweredBy')}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>

      <DialogActions sx={{
        p: 3,
        pt: 2,
        direction: currentLanguage === 'ar' ? 'rtl' : 'ltr',
        justifyContent: currentLanguage === 'ar' ? 'flex-start' : 'flex-end'
      }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: '#10a37f',
            color: '#fff',
            px: 4,
            py: 1.5,
            borderRadius: '12px',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: '0 4px 12px rgba(16,163,127,0.3)',
            '&:hover': {
              bgcolor: '#0d8f6b',
              transform: 'translateY(-1px)',
              boxShadow: '0 6px 16px rgba(16,163,127,0.4)',
            }
          }}
        >
          {t('close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
