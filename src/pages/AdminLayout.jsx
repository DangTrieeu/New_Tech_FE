import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/organisms/AdminSidebar/AdminSidebar';
import AdminHeader from '@/components/organisms/AdminHeader/AdminHeader';
import AdminDashboardPage from './AdminDashboardPage';
import UserManagementPage from './UserManagementPage';
import RoomManagementPage from './RoomManagementPage';
import toast from 'react-hot-toast';
import * as adminService from '../services/adminService';

const AdminLayout = () => {
    const [currentView, setCurrentView] = useState('dashboard');
    const [onlineCount, setOnlineCount] = useState(0);
    const navigate = useNavigate();

    // Fetch online users count
    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await adminService.getMetricsOverview();
                setOnlineCount(response.data.onlineUsers || 0);
            } catch (error) {
                console.error('Error fetching metrics:', error);
            }
        };

        fetchMetrics();

        // Refresh every 30 seconds
        const interval = setInterval(fetchMetrics, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        toast.success('Đã đăng xuất khỏi Admin Portal');
        navigate('/chat');
    };

    const renderContent = () => {
        switch (currentView) {
            case 'dashboard':
                return <AdminDashboardPage />;
            case 'users':
                return <UserManagementPage />;
            case 'rooms':
                return <RoomManagementPage />;
            default:
                return <AdminDashboardPage />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <AdminSidebar
                currentView={currentView}
                onViewChange={setCurrentView}
                onLogout={handleLogout}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader onlineCount={onlineCount} />
                <div className="flex-1 overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
