import React from 'react';
import {
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon
} from '@mui/icons-material';

const SearchButton = ({ 
  onClick, 
  disabled = false, 
  currentLanguage = 'en',
  darkMode = false,
  size = 'medium'
}) => {
  const translations = {
    en: {
      search: 'Search',
      tooltip: 'Search the web for additional information'
    },
    fr: {
      search: 'Rechercher',
      tooltip: 'Rechercher sur le web pour des informations supplémentaires'
    },
    ar: {
      search: 'بحث',
      tooltip: 'البحث على الويب للحصول على معلومات إضافية'
    }
  };

  const t = translations[currentLanguage] || translations.en;

  return (
    <Tooltip title={t.tooltip} placement="top">
      <IconButton
        onClick={onClick}
        disabled={disabled}
        size={size}
        sx={{
          color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
          transition: 'all 0.2s ease',
          '&:hover': {
            color: darkMode ? '#10a37f' : '#10a37f',
            backgroundColor: darkMode 
              ? 'rgba(16,163,127,0.1)' 
              : 'rgba(16,163,127,0.05)',
            transform: 'scale(1.05)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
          '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',
            transform: 'none',
          }
        }}
      >
        <SearchIcon 
          sx={{ 
            fontSize: size === 'small' ? 18 : 20,
            transition: 'transform 0.2s ease'
          }} 
        />
      </IconButton>
    </Tooltip>
  );
};

export default SearchButton;
