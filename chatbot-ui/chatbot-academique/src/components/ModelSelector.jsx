import { useState } from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Typography,
  Tooltip,
  IconButton,
  Collapse
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  AutoAwesome as AutoAwesomeIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Language as LanguageIcon
} from '@mui/icons-material';

const ModelSelector = ({
  selectedModel = 'gemini',
  onModelChange = () => {},
  currentLanguage = 'fr',
  darkMode = false,
  disabled = false
}) => {
  const [expanded, setExpanded] = useState(false);

  const models = {
    gemini: {
      name: currentLanguage === 'ar' ? 'جيميني API' : 'Gemini API',
      description: currentLanguage === 'ar'
        ? 'نموذج جوجل المتقدم للذكاء الاصطناعي'
        : 'Modèle IA avancé de Google',
      icon: <AutoAwesomeIcon />,
      color: '#4285f4',
      features: currentLanguage === 'ar'
        ? ['سريع', 'دقيق', 'متعدد اللغات']
        : ['Rapide', 'Précis', 'Multilingue'],
      status: 'active'
    },
    rag: {
      name: currentLanguage === 'ar' ? 'RAG + نموذج محلي' : 'RAG + Modèle Local',
      description: currentLanguage === 'ar'
        ? 'نظام RAG مع نموذج ENIAD المحلي'
        : 'Système RAG avec modèle ENIAD local',
      icon: <PsychologyIcon />,
      color: '#10a37f',
      features: currentLanguage === 'ar'
        ? ['قاعدة معرفة', 'محلي', 'متخصص ENIAD']
        : ['Base de connaissances', 'Local', 'Spécialisé ENIAD'],
      status: 'active'
    },
    llama: {
      name: currentLanguage === 'ar' ? 'لاما (مشروعنا)' : 'Llama (Notre Projet)',
      description: currentLanguage === 'ar'
        ? 'نموذج مخصص لمشروع ENIAD'
        : 'Modèle personnalisé pour ENIAD',
      icon: <PsychologyIcon />,
      color: '#ff6b35',
      features: currentLanguage === 'ar'
        ? ['مخصص', 'محلي', 'متخصص']
        : ['Personnalisé', 'Local', 'Spécialisé'],
      status: 'limited'
    }
  };

  const handleModelChange = (event) => {
    const newModel = event.target.value;
    onModelChange(newModel);
  };

  const selectedModelData = models[selectedModel];

  return (
    <Box sx={{ 
      mb: 2,
      bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
      borderRadius: '16px',
      border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    }}>
      {/* Header with model selector */}
      <Box sx={{ 
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        cursor: 'pointer'
      }} onClick={() => setExpanded(!expanded)}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: selectedModelData.color 
        }}>
          {selectedModelData.icon}
          <Typography variant="body2" fontWeight="600">
            {currentLanguage === 'ar' ? 'نموذج الذكاء الاصطناعي' : 'Modèle IA'}
          </Typography>
        </Box>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <Select
            value={selectedModel}
            onChange={handleModelChange}
            disabled={disabled}
            onClick={(e) => e.stopPropagation()}
            sx={{
              borderRadius: '12px',
              bgcolor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.8)',
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              },
              '& .MuiSelect-select': {
                py: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }
            }}
          >
            {Object.entries(models).map(([key, model]) => (
              <MenuItem key={key} value={key}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ color: model.color }}>{model.icon}</Box>
                  <Typography variant="body2">{model.name}</Typography>
                  <Chip 
                    label={model.status === 'active' ? '✓' : '⚠'} 
                    size="small" 
                    sx={{ 
                      height: 20, 
                      fontSize: '0.7rem',
                      bgcolor: model.status === 'active' ? 'rgba(76,175,80,0.1)' : 'rgba(255,152,0,0.1)',
                      color: model.status === 'active' ? '#4caf50' : '#ff9800'
                    }} 
                  />
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ ml: 'auto' }}>
          <IconButton size="small" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* Expanded details */}
      <Collapse in={expanded}>
        <Box sx={{ 
          px: 2, 
          pb: 2,
          borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`
        }}>
          <Typography variant="body2" sx={{ 
            mb: 2, 
            color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
            fontStyle: 'italic'
          }}>
            {selectedModelData.description}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {selectedModelData.features.map((feature, index) => (
              <Chip
                key={index}
                label={feature}
                size="small"
                sx={{
                  bgcolor: `${selectedModelData.color}15`,
                  color: selectedModelData.color,
                  fontWeight: 500,
                  fontSize: '0.75rem'
                }}
              />
            ))}
          </Box>

          {/* Model comparison info */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
            gap: 2,
            mt: 2
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <SpeedIcon sx={{
                color: selectedModel === 'gemini' ? '#4285f4' :
                       selectedModel === 'rag' ? '#10a37f' : '#ff6b35',
                mb: 0.5
              }} />
              <Typography variant="caption" display="block">
                {currentLanguage === 'ar' ? 'السرعة' : 'Vitesse'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedModel === 'gemini' ?
                  (currentLanguage === 'ar' ? 'سريع جداً' : 'Très rapide') :
                  selectedModel === 'rag' ?
                  (currentLanguage === 'ar' ? 'سريع' : 'Rapide') :
                  (currentLanguage === 'ar' ? 'متوسط' : 'Moyen')
                }
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <SecurityIcon sx={{
                color: selectedModel === 'gemini' ? '#4285f4' : '#10a37f',
                mb: 0.5
              }} />
              <Typography variant="caption" display="block">
                {currentLanguage === 'ar' ? 'الخصوصية' : 'Confidentialité'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedModel === 'gemini' ?
                  (currentLanguage === 'ar' ? 'سحابي' : 'Cloud') :
                  (currentLanguage === 'ar' ? 'محلي' : 'Local')
                }
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <LanguageIcon sx={{
                color: selectedModel === 'gemini' ? '#4285f4' : '#10a37f',
                mb: 0.5
              }} />
              <Typography variant="caption" display="block">
                {currentLanguage === 'ar' ? 'التخصص' : 'Spécialisation'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedModel === 'gemini' ?
                  (currentLanguage === 'ar' ? 'عام' : 'Général') :
                  (currentLanguage === 'ar' ? 'ENIAD' : 'ENIAD')
                }
              </Typography>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default ModelSelector;
