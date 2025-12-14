import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminService from '../../services/adminService';

const AdminLayout = () => {
  useEffect(() => {
    // Start realtime simulation
    const interval = setInterval(async () => {
      try {
        await AdminService.simulateRealtimeUpdate();
      } catch (error) {
        console.error('Realtime update error:', error);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return <Outlet />;
};

export default AdminLayout;
