// src/shared/components/LeftPanel.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveMenu } from '../../features/menu/menuSlice';
import MenuItem from './MenuItem';
import LogoutButton from './LogoutButton';
import { Box, Typography, Divider } from '@mui/material'; // ← FIXED: combined import

const LeftPanel = () => {
  const dispatch = useDispatch();
  const { activeMenu, activeSubMenu } = useSelector((state) => state.menu);

  const [menus] = useState([
    { menu: 'Dashboard', subMenus: [] },
    { menu: 'Masters', subMenus: ['State', 'Employee', 'Company', 'Tax','Country','City','Department','Designation','Division','EmployeeGrade'] },
    { menu: 'Leave', subMenus: ['Leave Application', 'Leave Balance'] },
    { menu: 'Payroll', subMenus: ['Salary Slip', 'Payslip Report'] },
    { menu: 'Vendor Portal', subMenus: ['Dashboard', 'Invoices'] },
    { menu: 'Settings', subMenus: ['Profile', 'Security'] },
  ]);

  const handleSetActiveMenu = (menu, subMenu = '') => {
    dispatch(setActiveMenu({ menu, subMenu }));
  };

  return (
    <Box
      sx={{
        width: 280,
        height: '100vh',
        bgcolor: '#f8f9fa',
        borderRight: '1px solid #e0e0e0',
        overflowY: 'auto',
        p: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
        HRVision
      </Typography>

      {menus.map(({ menu, subMenus }) => (
        <MenuItem
          key={menu}
          menu={menu}
          subMenus={subMenus}
          activeMenu={activeMenu}
          activeSubMenu={activeSubMenu}
          setActiveMenu={handleSetActiveMenu}
        />
      ))}
    </Box>
  );
};

export default LeftPanel;