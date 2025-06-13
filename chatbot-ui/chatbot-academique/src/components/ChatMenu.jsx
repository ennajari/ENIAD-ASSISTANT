import React from 'react';
import {
  Menu,
  MenuItem
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon
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
  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key];

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
    >
      <MenuItem
        onClick={handleEdit}
        sx={{ direction: currentLanguage === 'ar' ? 'rtl' : 'ltr' }}
      >
        <EditIcon fontSize="small" sx={{ mr: currentLanguage === 'ar' ? 0 : 1, ml: currentLanguage === 'ar' ? 1 : 0 }} />
        {t('edit')}
      </MenuItem>
      <MenuItem
        onClick={handleDelete}
        sx={{ direction: currentLanguage === 'ar' ? 'rtl' : 'ltr' }}
      >
        <DeleteIcon fontSize="small" sx={{ mr: currentLanguage === 'ar' ? 0 : 1, ml: currentLanguage === 'ar' ? 1 : 0 }} />
        {t('delete')}
      </MenuItem>
    </Menu>
  );
};

export default ChatMenu;
