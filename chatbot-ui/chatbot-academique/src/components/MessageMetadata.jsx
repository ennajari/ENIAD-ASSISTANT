import React, { useState } from 'react';
import {
  Box,
  Chip,
  Tooltip,
  IconButton,
  Collapse,
  Typography,
  Divider,
  Stack
} from '@mui/material';
import {
  SmartToy as GeminiIcon,
  SmartToy,
  Psychology as LlamaIcon,
  Language as WebIcon,
  Source as SourceIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Verified as VerifiedIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';

const MessageMetadata = ({ message, currentLanguage }) => {
  const [expanded, setExpanded] = useState(false);

  if (!message.metadata && !message.sources && !message.smaResults) {
    return null;
  }

  const metadata = message.metadata || {};
  const sources = message.sources || [];
  const smaResults = message.smaResults || {};
  const isArabic = currentLanguage === 'ar';

  // Déterminer le modèle utilisé
  const getModelInfo = () => {
    const model = metadata.model || 'unknown';
    const provider = metadata.provider || 'unknown';
    
    if (model.includes('gemini') || provider.includes('gemini')) {
      return {
        icon: <GeminiIcon sx={{ fontSize: 16 }} />,
        name: 'Gemini API',
        color: 'primary',
        description: isArabic ? 'نموذج جوجل المتقدم' : 'Modèle avancé de Google'
      };
    } else if (model.includes('llama') || provider.includes('llama')) {
      return {
        icon: <LlamaIcon sx={{ fontSize: 16 }} />,
        name: 'Llama (Projet)',
        color: 'secondary',
        description: isArabic ? 'نموذج مشروع ENIAD المخصص' : 'Modèle personnalisé ENIAD'
      };
    } else {
      return {
        icon: <SmartToy sx={{ fontSize: 16 }} />,
        name: isArabic ? 'نموذج محلي' : 'Modèle local',
        color: 'default',
        description: isArabic ? 'نظام احتياطي محلي' : 'Système de secours local'
      };
    }
  };

  // Déterminer si SMA a été utilisé
  const getSMAInfo = () => {
    const smaEnhanced = metadata.smaEnhanced || false;
    const smaResultsCount = metadata.smaResultsCount || smaResults.total_found || 0;
    const websitesScanned = metadata.websitesScanned || smaResults.metadata?.websites_scanned || 0;

    return {
      enabled: smaEnhanced,
      resultsCount: smaResultsCount,
      websitesScanned: websitesScanned
    };
  };

  const modelInfo = getModelInfo();
  const smaInfo = getSMAInfo();

  return (
    <Box sx={{ mt: 1, mb: 0.5 }}>
      {/* Indicateurs principaux */}
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 1 }}>
        {/* Indicateur de modèle */}
        <Tooltip title={modelInfo.description} arrow>
          <Chip
            icon={modelInfo.icon}
            label={modelInfo.name}
            size="small"
            color={modelInfo.color}
            variant="outlined"
            sx={{ 
              fontSize: '0.75rem',
              height: 24,
              '& .MuiChip-icon': { fontSize: 14 }
            }}
          />
        </Tooltip>

        {/* Indicateur SMA */}
        {smaInfo.enabled && (
          <Tooltip 
            title={
              isArabic 
                ? `تم تحسين الإجابة بـ SMA - ${smaInfo.resultsCount} نتائج من ${smaInfo.websitesScanned} مواقع`
                : `Réponse enrichie par SMA - ${smaInfo.resultsCount} résultats de ${smaInfo.websitesScanned} sites`
            } 
            arrow
          >
            <Chip
              icon={<WebIcon sx={{ fontSize: 14 }} />}
              label={`SMA (${smaInfo.resultsCount})`}
              size="small"
              color="success"
              variant="outlined"
              sx={{ 
                fontSize: '0.75rem',
                height: 24,
                '& .MuiChip-icon': { fontSize: 14 }
              }}
            />
          </Tooltip>
        )}

        {/* Indicateur de confiance */}
        {message.confidence && (
          <Tooltip 
            title={
              isArabic 
                ? `مستوى الثقة: ${(message.confidence * 100).toFixed(0)}%`
                : `Niveau de confiance: ${(message.confidence * 100).toFixed(0)}%`
            } 
            arrow
          >
            <Chip
              icon={<VerifiedIcon sx={{ fontSize: 14 }} />}
              label={`${(message.confidence * 100).toFixed(0)}%`}
              size="small"
              color={message.confidence > 0.8 ? 'success' : message.confidence > 0.6 ? 'warning' : 'default'}
              variant="outlined"
              sx={{ 
                fontSize: '0.75rem',
                height: 24,
                '& .MuiChip-icon': { fontSize: 14 }
              }}
            />
          </Tooltip>
        )}

        {/* Bouton d'expansion pour plus de détails */}
        {(sources.length > 0 || Object.keys(metadata).length > 2) && (
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{ 
              ml: 'auto',
              width: 24,
              height: 24,
              '& .MuiSvgIcon-root': { fontSize: 16 }
            }}
          >
            {expanded ? <CollapseIcon /> : <ExpandIcon />}
          </IconButton>
        )}
      </Stack>

      {/* Détails étendus */}
      <Collapse in={expanded}>
        <Box sx={{ 
          p: 1.5, 
          bgcolor: 'action.hover', 
          borderRadius: 1, 
          border: '1px solid',
          borderColor: 'divider'
        }}>
          {/* Sources */}
          {sources.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', mb: 1 }}>
                <SourceIcon sx={{ fontSize: 14, mr: 0.5 }} />
                {isArabic ? 'المصادر المستخدمة:' : 'Sources utilisées:'}
              </Typography>
              <Stack spacing={0.5}>
                {sources.slice(0, 3).map((source, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                      • <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ 
                            color: 'inherit', 
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          {source.title || source.url}
                        </a>
                    </Typography>
                  </Box>
                ))}
                {sources.length > 3 && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', fontStyle: 'italic' }}>
                    {isArabic ? `و ${sources.length - 3} مصادر أخرى...` : `et ${sources.length - 3} autres sources...`}
                  </Typography>
                )}
              </Stack>
            </Box>
          )}

          {/* Métadonnées techniques */}
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', mb: 1 }}>
              <SpeedIcon sx={{ fontSize: 14, mr: 0.5 }} />
              {isArabic ? 'تفاصيل تقنية:' : 'Détails techniques:'}
            </Typography>
            <Stack spacing={0.5}>
              {metadata.model && (
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                  {isArabic ? 'النموذج:' : 'Modèle:'} {metadata.model}
                </Typography>
              )}
              {metadata.provider && (
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                  {isArabic ? 'المزود:' : 'Fournisseur:'} {metadata.provider}
                </Typography>
              )}
              {metadata.usage?.total_tokens && (
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                  {isArabic ? 'الرموز المستخدمة:' : 'Tokens utilisés:'} {metadata.usage.total_tokens}
                </Typography>
              )}
              {smaInfo.enabled && (
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                  {isArabic ? 'مواقع ممسوحة:' : 'Sites scannés:'} {smaInfo.websitesScanned}
                </Typography>
              )}
            </Stack>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default MessageMetadata;
