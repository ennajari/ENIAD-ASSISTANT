import React from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudSync as CloudIcon
} from '@mui/icons-material';
import { translations } from '../constants/config';

const ChatMenu = ({
  anchorEl,
  open,
  onClose,
  currentLanguage,
  chatId,
  conversationHistory,
  onEditTitle,
  onDeleteChat
}) => {
  const t = (key) => translations[currentLanguage]?.[key] || translations.fr[key];

  const handleEdit = () => {
    const chat = conversationHistory.find(c => c.id === chatId);
    onEditTitle(chatId, chat?.title || '');
    onClose();
  };

  const handleDelete = (e) => {
    onDeleteChat(chatId, e);
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: currentLanguage === 'ar' ? 'left' : 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: currentLanguage === 'ar' ? 'left' : 'right' }}
      PaperProps={{
        sx: {
          minWidth: 200,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 2
        }
      }}
    >
      {/* Header indicating this is for logged-in users */}
      <MenuItem disabled sx={{
        opacity: 0.7,
        fontSize: '0.75rem',
        direction: currentLanguage === 'ar' ? 'rtl' : 'ltr',
        justifyContent: 'center',
        py: 0.5
      }}>
        <ListItemIcon sx={{ minWidth: 'auto', mr: 0.5 }}>
          <CloudIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="caption">
          {currentLanguage === 'ar'
            ? 'محفوظ في حسابك'
            : currentLanguage === 'fr'
            ? 'Sauvegardé dans votre compte'
            : 'Saved to your account'
          }
        </Typography>
      </MenuItem>

      <Divider />

      <MenuItem
        onClick={handleEdit}
        sx={{
          direction: currentLanguage === 'ar' ? 'rtl' : 'ltr',
          py: 1.5
        }}
      >
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary={t('edit')} />
      </MenuItem>

      <MenuItem
        onClick={handleDelete}
        sx={{
          direction: currentLanguage === 'ar' ? 'rtl' : 'ltr',
          py: 1.5,
          color: 'error.main',
          '&:hover': {
            backgroundColor: 'error.light',
            color: 'error.contrastText'
          }
        }}
      >
        <ListItemIcon>
          <DeleteIcon fontSize="small" sx={{ color: 'inherit' }} />
        </ListItemIcon>
        <ListItemText primary={t('delete')} />
      </MenuItem>
    </Menu>
  );
};

export default ChatMenu;
