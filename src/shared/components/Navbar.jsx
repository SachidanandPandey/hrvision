// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{
      background: '#1976d2', // MUI primary blue
      color: '#fff',
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      <h2 style={{ margin: 0 }}>HRVision ERP</h2>

      <div style={{ display: 'flex', gap: '24px' }}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/states" style={linkStyle}>States</Link>
        {/* Add more links as you create pages */}
        {/* <Link to="/employees" style={linkStyle}>Employees</Link> */}
        {/* <Link to="/companies" style={linkStyle}>Companies</Link> */}
      </div>
    </nav>
  );
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontSize: '1.1rem',
  fontWeight: 500,
  transition: 'color 0.2s',
};

linkStyle[':hover'] = { color: '#bbdefb' }; // hover effect (inline style limitation)

export default Navbar;