import React from 'react';
import { Box } from '@mui/material';
import {
  School as SchoolIcon,
  Psychology as AIIcon,
  AutoAwesome as InnovationIcon,
  Science as ResearchIcon,
} from '@mui/icons-material';

const FloatingIcons = ({ darkMode }) => {
  return (
    <>
      {/* Logo ENIAD central - statique et professionnel */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: darkMode ? 0.08 : 0.12,
          color: darkMode ? 'primary.main' : '#388e3c',
          fontSize: { xs: 140, md: 200 },
          zIndex: 0,
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease',
        }}
      >
        <SchoolIcon fontSize="inherit" />
      </Box>

      {/* Éléments décoratifs subtils - Intelligence Artificielle */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '15%',
          transform: 'translate(-50%, -50%)',
          opacity: darkMode ? 0.04 : 0.06,
          color: darkMode ? '#42a5f5' : '#1976d2',
          fontSize: { xs: 40, md: 60 },
          zIndex: 0,
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease',
        }}
      >
        <AIIcon fontSize="inherit" />
      </Box>

      {/* Innovation */}
      <Box
        sx={{
          position: 'absolute',
          top: '25%',
          right: '15%',
          transform: 'translate(50%, -50%)',
          opacity: darkMode ? 0.04 : 0.06,
          color: darkMode ? '#ff9800' : '#f57c00',
          fontSize: { xs: 35, md: 50 },
          zIndex: 0,
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease',
        }}
      >
        <InnovationIcon fontSize="inherit" />
      </Box>

      {/* Recherche */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '20%',
          transform: 'translate(-50%, 50%)',
          opacity: darkMode ? 0.04 : 0.06,
          color: darkMode ? '#43a047' : '#388e3c',
          fontSize: { xs: 35, md: 50 },
          zIndex: 0,
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease',
        }}
      >
        <ResearchIcon fontSize="inherit" />
      </Box>

    </>
  );
};

export default FloatingIcons;
