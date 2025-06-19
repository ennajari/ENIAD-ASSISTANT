import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Cloud as CloudIcon,
  Computer as ComputerIcon,
  VolumeUp as VolumeIcon,
  Check as CheckIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const TTSSelector = ({ currentLanguage, onServiceChange, darkMode }) => {
  const [selectedService, setSelectedService] = useState('auto');
  const [configOpen, setConfigOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    googleCloud: '',
    voiceRSS: ''
  });
  const [serviceStatus, setServiceStatus] = useState({});

  // Configuration des services TTS
  const ttsServices = {
    auto: {
      name: currentLanguage === 'ar' ? 'تلقائي (أفضل جودة)' : 'Automatique (Meilleure qualité)',
      icon: '🎯',
      description: currentLanguage === 'ar' ? 'يختار أفضل خدمة متاحة' : 'Choisit le meilleur service disponible',
      priority: 1
    },
    googleCloud: {
      name: 'Google Cloud TTS',
      icon: '🌐',
      description: currentLanguage === 'ar' ? 'جودة عالية، أصوات عصبية' : 'Haute qualité, voix neurales',
      priority: 2,
      requiresKey: true,
      free: '4M chars/mois'
    },
    voiceRSS: {
      name: 'VoiceRSS',
      icon: '🎤',
      description: currentLanguage === 'ar' ? 'مجاني، بسيط' : 'Gratuit, simple',
      priority: 3,
      requiresKey: true,
      free: '350 req/jour'
    },
    browser: {
      name: currentLanguage === 'ar' ? 'متصفح' : 'Navigateur',
      icon: '🔊',
      description: currentLanguage === 'ar' ? 'مدمج، دائماً متاح' : 'Intégré, toujours disponible',
      priority: 4,
      fallback: true
    }
  };

  useEffect(() => {
    // Charger les clés API sauvegardées
    const savedKeys = {
      googleCloud: localStorage.getItem('tts_google_cloud_key') || '',
      voiceRSS: localStorage.getItem('tts_voicerss_key') || ''
    };
    setApiKeys(savedKeys);

    // Charger le service sélectionné
    const savedService = localStorage.getItem('tts_selected_service') || 'auto';
    setSelectedService(savedService);

    // Vérifier le statut des services
    checkServicesStatus();
  }, []);

  const checkServicesStatus = async () => {
    const status = {};

    // Vérifier les clés API
    status.googleCloud = !!apiKeys.googleCloud;
    status.voiceRSS = !!apiKeys.voiceRSS;
    status.browser = 'speechSynthesis' in window;

    setServiceStatus(status);
  };

  const handleServiceChange = (event) => {
    const service = event.target.value;
    setSelectedService(service);
    localStorage.setItem('tts_selected_service', service);
    
    if (onServiceChange) {
      onServiceChange(service);
    }
  };

  const handleSaveConfig = () => {
    // Sauvegarder les clés API
    localStorage.setItem('tts_google_cloud_key', apiKeys.googleCloud);
    localStorage.setItem('tts_voicerss_key', apiKeys.voiceRSS);
    
    // Mettre à jour les variables d'environnement (simulation)
    if (apiKeys.googleCloud) {
      window.VITE_GOOGLE_CLOUD_TTS_API_KEY = apiKeys.googleCloud;
    }
    if (apiKeys.voiceRSS) {
      window.VITE_VOICERSS_API_KEY = apiKeys.voiceRSS;
    }

    setConfigOpen(false);
    checkServicesStatus();
  };

  const getServiceStatus = (serviceKey) => {
    const service = ttsServices[serviceKey];
    if (!service) return null;

    if (service.requiresKey) {
      const hasKey = serviceKey === 'googleCloud' ? !!apiKeys.googleCloud : !!apiKeys.voiceRSS;
      return hasKey ? 'configured' : 'needs_key';
    }

    return 'available';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'configured':
      case 'available':
        return <CheckIcon sx={{ fontSize: 16, color: 'success.main' }} />;
      case 'needs_key':
        return <ErrorIcon sx={{ fontSize: 16, color: 'warning.main' }} />;
      case 'unavailable':
        return <ErrorIcon sx={{ fontSize: 16, color: 'error.main' }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'configured':
      case 'available':
        return 'success';
      case 'needs_key':
        return 'warning';
      case 'unavailable':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>
          {currentLanguage === 'ar' ? 'خدمة TTS' : 'Service TTS'}
        </InputLabel>
        <Select
          value={selectedService}
          onChange={handleServiceChange}
          label={currentLanguage === 'ar' ? 'خدمة TTS' : 'Service TTS'}
        >
          {Object.entries(ttsServices).map(([key, service]) => {
            const status = getServiceStatus(key);
            return (
              <MenuItem key={key} value={key}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                  <span>{service.icon}</span>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2">{service.name}</Typography>
                    {service.free && (
                      <Typography variant="caption" color="text.secondary">
                        {service.free}
                      </Typography>
                    )}
                  </Box>
                  {getStatusIcon(status)}
                </Box>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <Tooltip title={currentLanguage === 'ar' ? 'إعدادات TTS' : 'Configuration TTS'}>
        <IconButton
          size="small"
          onClick={() => setConfigOpen(true)}
          sx={{
            color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
            }
          }}
        >
          <SettingsIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

      {/* Affichage du service actuel */}
      {selectedService !== 'auto' && (
        <Chip
          icon={getStatusIcon(getServiceStatus(selectedService))}
          label={ttsServices[selectedService]?.name}
          size="small"
          color={getStatusColor(getServiceStatus(selectedService))}
          variant="outlined"
        />
      )}

      {/* Dialog de configuration */}
      <Dialog open={configOpen} onClose={() => setConfigOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentLanguage === 'ar' ? 'إعدادات خدمات TTS' : 'Configuration des Services TTS'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              {currentLanguage === 'ar' 
                ? 'قم بتكوين مفاتيح API للحصول على جودة صوت أفضل'
                : 'Configurez les clés API pour une meilleure qualité audio'
              }
            </Alert>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                🌐 Google Cloud TTS
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {currentLanguage === 'ar' 
                  ? 'أفضل جودة، 4 مليون حرف مجاناً شهرياً'
                  : 'Meilleure qualité, 4M caractères gratuits/mois'
                }
              </Typography>
              <TextField
                fullWidth
                label="Clé API Google Cloud"
                type="password"
                value={apiKeys.googleCloud}
                onChange={(e) => setApiKeys(prev => ({ ...prev, googleCloud: e.target.value }))}
                placeholder="AIzaSy..."
                helperText="Obtenez votre clé sur: console.cloud.google.com"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                🎤 VoiceRSS
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {currentLanguage === 'ar' 
                  ? 'مجاني وبسيط، 350 طلب يومياً'
                  : 'Gratuit et simple, 350 requêtes/jour'
                }
              </Typography>
              <TextField
                fullWidth
                label="Clé API VoiceRSS"
                type="password"
                value={apiKeys.voiceRSS}
                onChange={(e) => setApiKeys(prev => ({ ...prev, voiceRSS: e.target.value }))}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                helperText="Obtenez votre clé sur: voicerss.org/registration.aspx"
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                📊 État des Services
              </Typography>
              {Object.entries(ttsServices).map(([key, service]) => {
                const status = getServiceStatus(key);
                return (
                  <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <span>{service.icon}</span>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2">{service.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {service.description}
                      </Typography>
                    </Box>
                    <Chip
                      icon={getStatusIcon(status)}
                      label={
                        status === 'configured' ? 'Configuré' :
                        status === 'available' ? 'Disponible' :
                        status === 'needs_key' ? 'Clé requise' :
                        'Indisponible'
                      }
                      size="small"
                      color={getStatusColor(status)}
                      variant="outlined"
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigOpen(false)}>
            {currentLanguage === 'ar' ? 'إلغاء' : 'Annuler'}
          </Button>
          <Button onClick={handleSaveConfig} variant="contained">
            {currentLanguage === 'ar' ? 'حفظ' : 'Sauvegarder'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TTSSelector;
