import React, { useState } from 'react';
import { Avatar, Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const UserAvatar = ({
  user,
  size = 32,
  darkMode = false,
  showBorder = false,
  sx = {},
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getInitials = (user) => {
    if (!user) return 'U';
    
    if (user.displayName) {
      const names = user.displayName.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    
    return 'U';
  };

  const avatarSx = {
    width: size,
    height: size,
    bgcolor: (!user?.photoURL || imageError) ? 'rgba(16, 163, 127, 0.1)' : 'transparent',
    color: (!user?.photoURL || imageError) ? '#10a37f' : 'inherit',
    fontSize: size * 0.4,
    fontWeight: 600,
    border: showBorder 
      ? `2px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
      : 'none',
    transition: 'all 0.2s ease',
    '&:hover': showBorder ? {
      borderColor: '#10a37f',
      boxShadow: '0 0 0 2px rgba(16,163,127,0.2)',
    } : {},
    ...sx
  };

  // If no user or image error, show initials or icon
  if (!user || !user.photoURL || imageError) {
    return (
      <Avatar sx={avatarSx} {...props}>
        {user ? getInitials(user) : <PersonIcon fontSize="small" />}
      </Avatar>
    );
  }

  // Show user photo with error handling
  return (
    <Avatar
      src={user.photoURL}
      alt={user.displayName || user.email || 'User'}
      onError={handleImageError}
      sx={avatarSx}
      {...props}
    >
      {getInitials(user)}
    </Avatar>
  );
};

export default UserAvatar;
