import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import * as adminService from '../services/adminService';

const AdminDashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentRooms, setRecentRooms] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [metricsRes, messagesRes, usersRes, roomsRes] = await Promise.all([
        adminService.getMetricsOverview(),
        adminService.getMessagesByDate(7),
        adminService.getAllUsers(),
        adminService.getAllRooms()
      ]);

      setMetrics(metricsRes.data);
      setChartData(messagesRes.data);
      setRecentUsers(usersRes.data.users.slice(0, 5)); // 5 users gần nhất
      setRecentRooms(roomsRes.data.rooms.slice(0, 5)); // 5 rooms gần nhất
    } catch (error) {
      toast.error('Lỗi tải dữ liệu dashboard');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const viewUserDetail = async (userId) => {
    try {
      const response = await adminService.getUserById(userId);
      setSelectedUser(response.data);
    } catch (error) {
      toast.error('Lỗi tải chi tiết user');
    }
  };

  const viewRoomDetail = async (roomId) => {
    try {
      const response = await adminService.getRoomById(roomId);
      setSelectedRoom(response.data);
    } catch (error) {
      toast.error('Lỗi tải chi tiết room');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Tổng Users</h3>
          <p className="text-3xl font-bold text-blue-600">{metrics?.totalUsers || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Tổng Rooms</h3>
          <p className="text-3xl font-bold text-green-600">{metrics?.totalRooms || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Tổng Messages</h3>
          <p className="text-3xl font-bold text-purple-600">{metrics?.totalMessages || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-2">AI Messages</h3>
          <p className="text-3xl font-bold text-pink-600">{metrics?.totalAIMessages || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Online Users</h3>
          <p className="text-3xl font-bold text-orange-600">{metrics?.onlineUsers || 0}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Messages theo ngày (7 ngày gần nhất)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" name="Messages" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Most Active User */}
      {metrics?.mostActiveUser && (
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">User hoạt động nhiều nhất</h2>
          <div className="flex items-center gap-4">
            <img
              src={metrics.mostActiveUser.avatar_url || '/default-avatar.png'}
              alt={metrics.mostActiveUser.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <p className="font-bold text-lg">{metrics.mostActiveUser.name}</p>
              <p className="text-gray-600">{metrics.mostActiveUser.email}</p>
              <p className="text-sm text-blue-600 mt-1">
                {metrics.mostActiveUser.messageCount} messages
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Users & Rooms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Users</h2>
            <a href="/admin/users" className="text-blue-600 hover:underline text-sm">
              Xem tất cả →
            </a>
          </div>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => viewUserDetail(user.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{user.totalMessagesSent} msgs</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Rooms */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Rooms</h2>
            <a href="/admin/rooms" className="text-blue-600 hover:underline text-sm">
              Xem tất cả →
            </a>
          </div>
          <div className="space-y-3">
            {recentRooms.map((room) => (
              <div
                key={room.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => viewRoomDetail(room.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    room.type === 'GROUP' ? 'bg-purple-500' : 'bg-blue-500'
                  }`}>
                    {room.type === 'GROUP' ? '👥' : '💬'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{room.name}</p>
                    <p className="text-xs text-gray-500">
                      {room.memberCount} members • {room.totalMessages} messages
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  room.type === 'GROUP' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {room.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Chi tiết User</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Thông tin cơ bản</h3>
                <p><strong>Tên:</strong> {selectedUser.user.name}</p>
                <p><strong>Email:</strong> {selectedUser.user.email}</p>
                <p><strong>Role:</strong> {selectedUser.user.role}</p>
                <p><strong>Status:</strong> {selectedUser.user.status}</p>
                <p><strong>Tổng Rooms:</strong> {selectedUser.user.totalRoomsJoined}</p>
                <p><strong>Tổng Messages:</strong> {selectedUser.user.totalMessagesSent}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Rooms đã tham gia</h3>
                <div className="space-y-2">
                  {selectedUser.rooms.map((room) => (
                    <div key={room.id} className="p-3 bg-gray-50 rounded">
                      <p className="font-medium">{room.name}</p>
                      <p className="text-sm text-gray-600">Type: {room.type}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Room Detail Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Chi tiết Room</h2>
              <button
                onClick={() => setSelectedRoom(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Thông tin Room</h3>
                <p><strong>Tên:</strong> {selectedRoom.room.name}</p>
                <p><strong>Type:</strong> {selectedRoom.room.type}</p>
                <p><strong>Created by:</strong> {selectedRoom.room.createdByName}</p>
                <p><strong>Tổng Members:</strong> {selectedRoom.room.memberCount}</p>
                <p><strong>Tổng Messages:</strong> {selectedRoom.room.totalMessages}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Danh sách Members</h3>
                <div className="space-y-2">
                  {selectedRoom.members.map((member) => (
                    <div key={member.id} className="p-3 bg-gray-50 rounded flex items-center gap-3">
                      <img
                        src={member.avatar_url || '/default-avatar.png'}
                        alt={member.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                      <span className={`ml-auto px-2 py-1 rounded text-xs font-medium ${
                        member.status === 'ONLINE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
