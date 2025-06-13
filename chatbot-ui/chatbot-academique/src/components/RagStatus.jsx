import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Storage as StorageIcon,
  Psychology as BrainIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon
} from '@mui/icons-material';
import ragApiService from '../services/ragApiService';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../constants/config';

const RagStatus = ({ darkMode = false }) => {
  const { currentLanguage } = useLanguage();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);

  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key] || key;

  const checkRagStatus = async () => {
    setLoading(true);
    try {
      console.log('🔍 Checking RAG system status...');
      const healthStatus = await ragApiService.getHealthStatus();
      setStatus(healthStatus);
      setLastCheck(new Date());
      console.log('✅ RAG status check completed:', healthStatus);
    } catch (error) {
      console.error('❌ RAG status check failed:', error);
      setStatus({
        status: 'error',
        error: error.message,
        projectId: ragApiService.projectId,
        baseURL: ragApiService.baseURL
      });
      setLastCheck(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkRagStatus();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(checkRagStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (!status) return 'default';
    switch (status.status) {
      case 'healthy': return 'success';
      case 'unhealthy': return 'error';
      case 'error': return 'error';
      default: return 'warning';
    }
  };

  const getStatusIcon = () => {
    if (loading) return <CircularProgress size={16} />;
    if (!status) return <InfoIcon />;
    
    switch (status.status) {
      case 'healthy': return <CheckIcon color="success" />;
      case 'unhealthy': return <ErrorIcon color="error" />;
      case 'error': return <ErrorIcon color="error" />;
      default: return <InfoIcon color="warning" />;
    }
  };

  const getStatusText = () => {
    if (loading) return t('checking') || 'Checking...';
    if (!status) return t('unknown') || 'Unknown';
    
    switch (status.status) {
      case 'healthy': return t('ragHealthy') || 'RAG System Online';
      case 'unhealthy': return t('ragUnhealthy') || 'RAG System Issues';
      case 'error': return t('ragError') || 'RAG System Error';
      default: return t('ragUnknown') || 'RAG Status Unknown';
    }
  };

  return (
    <Card 
      elevation={0} 
      sx={{ 
        border: `1px solid ${darkMode ? '#2d3748' : '#e2e8f0'}`,
        borderRadius: '12px',
        bgcolor: darkMode ? '#1a202c' : '#ffffff'
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BrainIcon sx={{ color: darkMode ? '#4fd1c7' : '#10a37f' }} />
            <Typography variant="subtitle2" fontWeight="600">
              {t('ragSystem') || 'RAG System'}
            </Typography>
            <Chip
              icon={getStatusIcon()}
              label={getStatusText()}
              size="small"
              color={getStatusColor()}
              variant="outlined"
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={t('refresh') || 'Refresh'}>
              <IconButton 
                size="small" 
                onClick={checkRagStatus}
                disabled={loading}
              >
                <RefreshIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title={expanded ? (t('collapse') || 'Collapse') : (t('expand') || 'Expand')}>
              <IconButton 
                size="small" 
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? <CollapseIcon sx={{ fontSize: 16 }} /> : <ExpandIcon sx={{ fontSize: 16 }} />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Collapse in={expanded}>
          <Box sx={{ mt: 2 }}>
            {status?.error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                <Typography variant="body2">
                  <strong>{t('error') || 'Error'}:</strong> {status.error}
                </Typography>
              </Alert>
            )}

            <List dense sx={{ p: 0 }}>
              <ListItem sx={{ px: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <StorageIcon sx={{ fontSize: 16, color: darkMode ? '#a0aec0' : '#718096' }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      <strong>{t('endpoint') || 'Endpoint'}:</strong> {status?.baseURL || 'Not configured'}
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem sx={{ px: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <InfoIcon sx={{ fontSize: 16, color: darkMode ? '#a0aec0' : '#718096' }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      <strong>{t('projectId') || 'Project ID'}:</strong> {status?.projectId || 'Not configured'}
                    </Typography>
                  }
                />
              </ListItem>

              {status?.info && (
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon sx={{ fontSize: 16, color: 'success.main' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" color="text.secondary">
                        <strong>{t('indexInfo') || 'Index Info'}:</strong> {JSON.stringify(status.info)}
                      </Typography>
                    }
                  />
                </ListItem>
              )}

              {lastCheck && (
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <RefreshIcon sx={{ fontSize: 16, color: darkMode ? '#a0aec0' : '#718096' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" color="text.secondary">
                        <strong>{t('lastCheck') || 'Last Check'}:</strong> {lastCheck.toLocaleTimeString()}
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>

            <Box sx={{ mt: 2, p: 1, bgcolor: darkMode ? '#2d3748' : '#f7fafc', borderRadius: '8px' }}>
              <Typography variant="caption" color="text.secondary">
                {t('ragStatusHelp') || 'This shows the connection status to your RAG_Project system. Make sure your FastAPI server is running on the configured endpoint.'}
              </Typography>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default RagStatus;
