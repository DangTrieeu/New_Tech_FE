import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, Settings, LogOut, Menu, ChevronLeft } from 'lucide-react';

const AdminSidebar = ({ currentView, onViewChange, onLogout }) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'rooms', label: 'Room Management', icon: MessageSquare },
    ];

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            navigate('/chat');
        }
    };

    return (
        <div
            className={`h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${collapsed ? 'w-16' : 'w-64'
                }`}
        >
            {/* Logo & Toggle */}
            <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
                {!collapsed && (
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">Admin Portal</h2>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="ml-auto p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    {collapsed ? (
                        <Menu className="w-5 h-5 text-gray-600" />
                    ) : (
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive
                                    ? 'bg-gray-900 text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            title={collapsed ? item.label : ''}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                        </button>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-3 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-gray-600 hover:bg-red-50 hover:text-red-600"
                    title={collapsed ? 'Logout' : ''}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="text-sm font-medium">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
