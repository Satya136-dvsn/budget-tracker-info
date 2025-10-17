import React from 'react';
import Dashboard from './Dashboard';
import CleanPageLayout from '../Layout/CleanPageLayout';

const CleanDashboard = () => {
  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      minHeight: '100vh',
      padding: 0,
      margin: 0
    }}>
      <Dashboard />
    </div>
  );
};

export default CleanDashboard;