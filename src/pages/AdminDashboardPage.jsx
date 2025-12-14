import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../components/atoms/Card/Card';
import StatCard from '../components/atoms/StatCard/StatCard';
import Button from '../components/atoms/Button/Button';
import {
  Users,
  MessageSquare,
  MessageCircle,
  Bot,
  UserCheck,
  TrendingUp,
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import useAdminDashboard from '../hooks/useAdminDashboard';

const AdminDashboardPage = () => {
  const { stats, messageStats, adminUser, loading, navigate, handleLogout } = useAdminDashboard();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <LayoutDashboard size={24} className="text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Xin chào, {adminUser?.name || 'Admin'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <LogOut size={18} />
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total users"
            value={stats?.totalUsers || 0}
            icon={Users}
            color="blue"
            trend="up"
          />
          <StatCard
            title="Total chat rooms"
            value={stats?.totalRooms || 0}
            icon={MessageSquare}
            color="purple"
            trend="up"
          />
          <StatCard
            title="Toal messages"
            value={stats?.totalMessages || 0}
            icon={MessageCircle}
            color="green"
            trend="up"
          />
          <StatCard
            title="T"
            value={stats?.totalAIMessages || 0}
            icon={Bot}
            color="orange"
            trend="up"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard
            title="Người dùng online"
            value={stats?.onlineUsers || 0}
            icon={UserCheck}
            color="green"
          />
          <StatCard
            title="Người dùng hoạt động nhất"
            value={stats?.mostActiveUser || 'N/A'}
            icon={TrendingUp}
            color="blue"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card hover onClick={() => navigate('/admin/users')}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Users size={24} className="text-blue-600 dark:text-blue-300" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Quản lý người dùng
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Xem và quản lý tất cả người dùng
                </p>
              </div>
            </div>
          </Card>

          <Card hover onClick={() => navigate('/admin/rooms')}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <MessageSquare size={24} className="text-purple-600 dark:text-purple-300" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Quản lý phòng chat
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Xem và quản lý tất cả phòng
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Message Statistics Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Thống kê tin nhắn 7 ngày qua
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={messageStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                labelStyle={{ color: '#F9FAFB' }}
              />
              <Legend
                wrapperStyle={{ fontSize: '14px' }}
              />
              <Bar
                dataKey="total"
                fill="#3B82F6"
                name="Tổng tin nhắn"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="aiMessages"
                fill="#F97316"
                name="Tin nhắn AI"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
