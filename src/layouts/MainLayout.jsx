// src/layouts/MainLayout.jsx
import React from 'react';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';
import LeftPanel from '../shared/components/LeftPanel';
import LogoutButton from '../shared/components/LogoutButton';

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Left Sidebar */}
      <LeftPanel />

      {/* Right Side */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header with Logout */}
        <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div">
              HRVision ERP
            </Typography>

            {/* Logout on right */}
            <LogoutButton variant="contained" size="medium" />
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;