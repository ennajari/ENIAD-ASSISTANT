import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import { translations } from '../constants/config';

const RenameDialog = ({
  open,
  onClose,
  darkMode,
  currentLanguage,
  newChatTitle,
  onTitleChange,
  onSubmit
}) => {
  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          bgcolor: darkMode ? '#1e1e1e' : '#ffffff'
        }
      }}
    >
      <DialogTitle sx={{
        bgcolor: darkMode ? 'primary.dark' : 'primary.main',
        color: '#fff',
        fontWeight: 600
      }}>
        {t('editTitle')}
      </DialogTitle>
      <DialogContent sx={{ py: 2, mt: 1 }}>
        <TextField
          fullWidth
          value={newChatTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={t('newConversation')}
          autoFocus
          InputProps={{
            sx: {
              bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            }
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
        >
          {t('cancel')}
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={!newChatTitle.trim()}
        >
          {t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RenameDialog;
