import React, { useState, useEffect } from 'react';
import { Users, MessagesSquare, MessageSquare, Bot, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import * as adminService from '../services/adminService';
import StatCard from '@/components/molecules/StatCard/StatCard';

const AdminDashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [systemActivities, setSystemActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [metricsRes, messagesRes, usersRes, roomsRes] = await Promise.all([
        adminService.getMetricsOverview(),
        adminService.getMessagesByDate(7),
        adminService.getAllUsers(),
        adminService.getAllRooms(),
      ]);

      setMetrics(metricsRes.data);
      setChartData(messagesRes.data);

      // Transform real data into activity timeline
      const activities = [];

      // Add recent users (last 3)
      const recentUsers = usersRes.data.users
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3);

      recentUsers.forEach(user => {
        activities.push({
          action: 'New user registered',
          user: user.email,
          time: formatTimeAgo(user.created_at),
          type: 'user',
          timestamp: new Date(user.created_at)
        });
      });

      // Add recent rooms (last 2)
      const recentRooms = roomsRes.data.rooms
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 2);

      recentRooms.forEach(room => {
        activities.push({
          action: room.type === 'GROUP' ? 'Group chat created' : 'Private chat created',
          user: room.name,
          time: formatTimeAgo(room.created_at),
          type: 'room',
          timestamp: new Date(room.created_at)
        });
      });

      // Sort activities by timestamp (most recent first)
      activities.sort((a, b) => b.timestamp - a.timestamp);

      setSystemActivities(activities.slice(0, 5));
    } catch (error) {
      toast.error('Lỗi tải dữ liệu dashboard');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format time ago
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Users"
            value={(metrics?.totalUsers || 0).toLocaleString()}
            icon={Users}
          />
          <StatCard
            title="Chat Rooms"
            value={(metrics?.totalRooms || 0).toLocaleString()}
            icon={MessagesSquare}
          />
          <StatCard
            title="Total Messages"
            value={(metrics?.totalMessages || 0).toLocaleString()}
            icon={MessageSquare}
          />
          <StatCard
            title="AI Messages"
            value={(metrics?.totalAIMessages || 0).toLocaleString()}
            icon={Bot}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages Per Day Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Messages Per Day</h3>
                <p className="text-sm text-gray-500">Last 7 days activity</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{ color: '#111827', fontWeight: 600 }}
                />
                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                  name="Messages"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Most Active Users */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Most Active User</h3>
              <p className="text-sm text-gray-500">Top message sender</p>
            </div>
            {metrics?.mostActiveUser ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg">
                    #1
                  </div>
                  <img
                    src={metrics.mostActiveUser.avatar_url || '/default-avatar.png'}
                    alt={metrics.mostActiveUser.name}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{metrics.mostActiveUser.name}</p>
                    <p className="text-xs text-gray-500 truncate">{metrics.mostActiveUser.email}</p>
                    <p className="text-sm font-medium text-blue-600 mt-1">
                      {metrics.mostActiveUser.messageCount} messages
                    </p>
                  </div>
                </div>

                {/* Online Users Info */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Online Users</p>
                      <p className="text-2xl font-bold text-gray-900">{metrics.onlineUsers || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🟢</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No active users yet</p>
            )}
          </div>
        </div>

        {/* Recent System Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent System Activity</h3>
          <div className="space-y-3">
            {systemActivities.length > 0 ? systemActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'user' ? 'bg-blue-500' :
                  activity.type === 'room' ? 'bg-purple-500' :
                    activity.type === 'message' ? 'bg-green-500' :
                      activity.type === 'ai' ? 'bg-orange-500' :
                        'bg-red-500'
                  }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            )) : (
              <p className="text-gray-500 text-sm text-center py-4">No recent activities</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
