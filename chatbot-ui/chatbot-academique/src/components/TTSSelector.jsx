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
  // Plus besoin de gérer les clés API car ElevenLabs est intégré
  const [serviceStatus, setServiceStatus] = useState({});

  // Configuration des services TTS
  const ttsServices = {
    auto: {
      name: currentLanguage === 'ar' ? 'تلقائي (أفضل جودة)' : 'Automatique (Meilleure qualité)',
      icon: '🎯',
      description: currentLanguage === 'ar' ? 'يختار أفضل خدمة متاحة' : 'Choisit le meilleur service disponible',
      priority: 1
    },
    elevenlabs: {
      name: 'ElevenLabs',
      icon: '🎙️',
      description: currentLanguage === 'ar' ? 'جودة ممتازة، أصوات طبيعية' : 'Qualité excellente, voix naturelles',
      priority: 2,
      configured: true,
      free: 'Inclus'
    },
    browser: {
      name: currentLanguage === 'ar' ? 'متصفح' : 'Navigateur',
      icon: '🔊',
      description: currentLanguage === 'ar' ? 'مدمج، دائماً متاح' : 'Intégré, toujours disponible',
      priority: 3,
      fallback: true
    }
  };

  useEffect(() => {
    // Charger le service sélectionné
    const savedService = localStorage.getItem('tts_selected_service') || 'auto';
    setSelectedService(savedService);

    // Vérifier le statut des services
    checkServicesStatus();
  }, []);

  const checkServicesStatus = async () => {
    const status = {};

    // ElevenLabs est toujours disponible (clé intégrée)
    status.elevenlabs = true;
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
    setConfigOpen(false);
    checkServicesStatus();
  };

  const getServiceStatus = (serviceKey) => {
    const service = ttsServices[serviceKey];
    if (!service) return null;

    if (service.configured) {
      return 'configured';
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
            <Alert severity="success" sx={{ mb: 3 }}>
              {currentLanguage === 'ar'
                ? 'ElevenLabs مُكوّن ومُدمج بالفعل - جودة صوت ممتازة'
                : 'ElevenLabs est déjà configuré et intégré - Qualité audio excellente'
              }
            </Alert>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                🎙️ ElevenLabs TTS
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {currentLanguage === 'ar'
                  ? 'خدمة TTS متميزة مع أصوات طبيعية عالية الجودة'
                  : 'Service TTS premium avec des voix naturelles de haute qualité'
                }
              </Typography>
              <Box sx={{
                p: 2,
                bgcolor: 'success.light',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <CheckIcon sx={{ color: 'success.dark' }} />
                <Typography variant="body2" sx={{ color: 'success.dark' }}>
                  {currentLanguage === 'ar'
                    ? 'مُكوّن ومُفعّل - جاهز للاستخدام'
                    : 'Configuré et activé - Prêt à utiliser'
                  }
                </Typography>
              </Box>
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
