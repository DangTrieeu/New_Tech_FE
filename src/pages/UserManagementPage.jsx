import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import * as adminService from '../services/adminService';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminService.getAllUsers();
      setUsers(response.data.users);
    } catch (error) {
      toast.error('Lỗi tải danh sách users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
    try {
      await adminService.updateUserStatus(userId, newStatus);
      toast.success('Cập nhật status thành công');
      fetchUsers();
    } catch (error) {
      toast.error('Lỗi cập nhật status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Bạn có chắc muốn xóa user này?')) return;

    try {
      await adminService.deleteUser(userId);
      toast.success('Xóa user thành công');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi xóa user');
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

  if (loading) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Quản lý Users</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tên</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rooms</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Messages</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.status === 'ONLINE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.totalRoomsJoined}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.totalMessagesSent}</td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => viewUserDetail(user.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Xem
                  </button>
                  <button
                    onClick={() => handleToggleStatus(user.id, user.status)}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    {user.status === 'ONLINE' ? 'Lock' : 'Unlock'}
                  </button>
                  {user.role !== 'ADMIN' && (
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Xóa
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    </div>
  );
};

export default UserManagementPage;
