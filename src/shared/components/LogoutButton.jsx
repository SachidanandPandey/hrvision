// src/shared/components/LogoutButton.jsx
import React from 'react';
import Button from '@mui/material/Button';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ variant = 'contained', size = 'medium', fullWidth = false }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage / session / tokens here
    localStorage.removeItem('token'); // example - adjust to your auth
    localStorage.removeItem('user');

    // Redirect to login page
    navigate('/login');

    // Optional: show toast
    // toast.success('Logged out successfully');
  };

  return (
    <Button
      variant={variant}
      color="inherit" // white text on blue bg
      startIcon={<ExitToAppIcon />}
      size={size}
      fullWidth={fullWidth}
      onClick={handleLogout}
      sx={{
        bgcolor: variant === 'contained' ? '#d32f2f' : 'transparent', // red for logout
        color: variant === 'contained' ? '#fff' : '#fff',
        '&:hover': {
          bgcolor: variant === 'contained' ? '#c62828' : 'rgba(255,255,255,0.15)',
        },
        border: variant === 'outlined' ? '1px solid #fff' : 'none',
      }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;