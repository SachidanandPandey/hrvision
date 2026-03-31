import React from 'react';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';
import LeftPanel from '../shared/components/LeftPanel';
import LogoutButton from '../shared/components/LogoutButton';

const drawerWidth = 280;
const headerHeight = 64;

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      
      {/* ✅ FIXED SIDEBAR */}
      <LeftPanel />

      {/* RIGHT SIDE */}
      <Box
        sx={{
          flexGrow: 1,
          ml: `${drawerWidth}px`, // ✅ push content right
        }}
      >
        {/* ✅ FIXED HEADER */}
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
            bgcolor: '#1976d2',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6">
              HRVision ERP
            </Typography>

            <LogoutButton variant="contained" size="medium" />
          </Toolbar>
        </AppBar>

        {/* ✅ CONTENT AREA */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            overflowY: 'auto',
            background: '#f4f6f9',
            height: 'calc(100vh - 64px)', // header height adjust
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;