import React from 'react';
import { Box } from '@mui/material';
import {
  School as SchoolIcon,
  Chat as ChatIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Settings as SettingsIcon,
  VolumeUp as VolumeUpIcon,
  Mic as MicIcon,
} from '@mui/icons-material';

const FloatingIcons = ({ darkMode }) => {
  return (
    <>
      {/* Center Icon */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(0deg)',
          opacity: darkMode ? 0.22 : 0.32,
          color: darkMode ? 'primary.main' : '#388e3c',
          fontSize: { xs: 120, md: 180 },
          animation: 'floatNodeCenter 3.5s ease-in-out infinite',
          zIndex: 0,
          pointerEvents: 'none',
          filter: darkMode ? 'none' : 'drop-shadow(0 2px 8px #b5e7b0)',
        }}
      >
        <SchoolIcon fontSize="inherit" />
      </Box>

      {/* Top Left */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '7%',
          transform: 'translate(-50%, -50%) rotate(0deg)',
          opacity: darkMode ? 0.18 : 0.32,
          color: darkMode ? '#42a5f5' : '#1976d2',
          fontSize: { xs: 60, md: 100 },
          animation: 'floatNodeTL 4s ease-in-out infinite',
          zIndex: 0,
          pointerEvents: 'none',
          filter: darkMode ? 'none' : 'drop-shadow(0 2px 8px #90caf9)',
        }}
      >
        <ChatIcon fontSize="inherit" />
      </Box>

      {/* Top Right */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          right: '8%',
          transform: 'translate(50%, -50%) rotate(0deg)',
          opacity: darkMode ? 0.19 : 0.33,
          color: darkMode ? '#388e3c' : '#388e3c',
          fontSize: { xs: 70, md: 120 },
          animation: 'floatNodeTR 4s ease-in-out infinite',
          zIndex: 0,
          pointerEvents: 'none',
          filter: darkMode ? 'none' : 'drop-shadow(0 2px 8px #b5e7b0)',
        }}
      >
        <PersonIcon fontSize="inherit" />
      </Box>

      {/* Bottom Left */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '12%',
          transform: 'translate(-50%, 50%) rotate(0deg)',
          opacity: darkMode ? 0.16 : 0.28,
          color: darkMode ? '#ff9800' : '#f57c00',
          fontSize: { xs: 55, md: 90 },
          animation: 'floatNodeBL 4s ease-in-out infinite',
          zIndex: 0,
          pointerEvents: 'none',
          filter: darkMode ? 'none' : 'drop-shadow(0 2px 8px #ffd180)',
        }}
      >
        <EditIcon fontSize="inherit" />
      </Box>

      {/* Bottom Right */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '13%',
          right: '10%',
          transform: 'translate(50%, 50%) rotate(0deg)',
          opacity: darkMode ? 0.17 : 0.29,
          color: darkMode ? '#1976d2' : '#1976d2',
          fontSize: { xs: 60, md: 100 },
          animation: 'floatNodeBR 4s ease-in-out infinite',
          zIndex: 0,
          pointerEvents: 'none',
          filter: darkMode ? 'none' : 'drop-shadow(0 2px 8px #90caf9)',
        }}
      >
        <SettingsIcon fontSize="inherit" />
      </Box>

      {/* Middle Left */}
      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          left: '5%',
          transform: 'translate(-50%, -50%) rotate(0deg)',
          opacity: darkMode ? 0.15 : 0.25,
          color: darkMode ? '#43a047' : '#388e3c',
          fontSize: { xs: 45, md: 70 },
          animation: 'floatNodeML 4s ease-in-out infinite',
          zIndex: 0,
          pointerEvents: 'none',
          filter: darkMode ? 'none' : 'drop-shadow(0 2px 8px #b5e7b0)',
        }}
      >
        <VolumeUpIcon fontSize="inherit" />
      </Box>

      {/* Middle Right */}
      <Box
        sx={{
          position: 'absolute',
          top: '70%',
          right: '6%',
          transform: 'translate(50%, -50%) rotate(0deg)',
          opacity: darkMode ? 0.15 : 0.25,
          color: darkMode ? '#fbc02d' : '#fbc02d',
          fontSize: { xs: 50, md: 80 },
          animation: 'floatNodeMR 4s ease-in-out infinite',
          zIndex: 0,
          pointerEvents: 'none',
          filter: darkMode ? 'none' : 'drop-shadow(0 2px 8px #fff59d)',
        }}
      >
        <MicIcon fontSize="inherit" />
      </Box>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes floatCenter {
            0%   { transform: translate(-50%, -50%) rotate(0deg);}
            25%  { transform: translate(-50%, calc(-50% - 50px)) rotate(7deg);}
            50%  { transform: translate(-50%, calc(-50% + 50px)) rotate(-7deg);}
            75%  { transform: translate(-50%, calc(-50% - 50px)) rotate(7deg);}
            100% { transform: translate(-50%, -50%) rotate(0deg);}
          }
          @keyframes floatNodeTL {
            0%   { transform: translate(-50%, -50%) rotate(0deg);}
            25%  { transform: translate(-50%, calc(-50% - 40px)) rotate(-7deg);}
            50%  { transform: translate(-50%, calc(-50% + 40px)) rotate(7deg);}
            75%  { transform: translate(-50%, calc(-50% - 40px)) rotate(-7deg);}
            100% { transform: translate(-50%, -50%) rotate(0deg);}
          }
          @keyframes floatNodeTR {
            0%   { transform: translate(50%, -50%) rotate(0deg);}
            25%  { transform: translate(50%, calc(-50% - 40px)) rotate(7deg);}
            50%  { transform: translate(50%, calc(-50% + 40px)) rotate(-7deg);}
            75%  { transform: translate(50%, calc(-50% - 40px)) rotate(7deg);}
            100% { transform: translate(50%, -50%) rotate(0deg);}
          }
          @keyframes floatNodeBL {
            0%   { transform: translate(-50%, 50%) rotate(0deg);}
            25%  { transform: translate(-50%, calc(50% + 40px)) rotate(7deg);}
            50%  { transform: translate(-50%, calc(50% - 40px)) rotate(-7deg);}
            75%  { transform: translate(-50%, calc(50% + 40px)) rotate(7deg);}
            100% { transform: translate(-50%, 50%) rotate(0deg);}
          }
          @keyframes floatNodeBR {
            0%   { transform: translate(50%, 50%) rotate(0deg);}
            25%  { transform: translate(50%, calc(50% + 40px)) rotate(-7deg);}
            50%  { transform: translate(50%, calc(50% - 40px)) rotate(7deg);}
            75%  { transform: translate(50%, calc(50% + 40px)) rotate(-7deg);}
            100% { transform: translate(50%, 50%) rotate(0deg);}
          }
          @keyframes floatNodeML {
            0%   { transform: translate(-50%, -50%) rotate(0deg);}
            25%  { transform: translate(calc(-50% - 30px), -50%) rotate(5deg);}
            50%  { transform: translate(calc(-50% + 30px), -50%) rotate(-5deg);}
            75%  { transform: translate(calc(-50% - 30px), -50%) rotate(5deg);}
            100% { transform: translate(-50%, -50%) rotate(0deg);}
          }
          @keyframes floatNodeMR {
            0%   { transform: translate(50%, -50%) rotate(0deg);}
            25%  { transform: translate(calc(50% + 30px), -50%) rotate(-5deg);}
            50%  { transform: translate(calc(50% - 30px), -50%) rotate(5deg);}
            75%  { transform: translate(calc(50% + 30px), -50%) rotate(-5deg);}
            100% { transform: translate(50%, -50%) rotate(0deg);}
          }
          @keyframes floatNodeCenter {
            0%   { transform: translate(-50%, -50%) rotate(0deg);}
            25%  { transform: translate(-50%, calc(-50% - 50px)) rotate(7deg);}
            50%  { transform: translate(-50%, calc(-50% + 50px)) rotate(-7deg);}
            75%  { transform: translate(-50%, calc(-50% - 50px)) rotate(7deg);}
            100% { transform: translate(-50%, -50%) rotate(0deg);}
          }
        `}
      </style>
    </>
  );
};

export default FloatingIcons;
