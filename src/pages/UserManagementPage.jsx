import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/atoms/Card/Card';
import SearchInput from '../components/atoms/Input/SearchInput';
import Button from '../components/atoms/Button/Button';
import UserTable from '../components/organisms/UserTable/UserTable';
import UserDetailModal from '../components/molecules/UserDetailModal/UserDetailModal';
import AdminService from '../services/adminService';
import { Users, ArrowLeft } from 'lucide-react';

const UserManagementPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    loadUsers();
  }, [navigate]);

  useEffect(() => {
    // Filter users based on search query
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await AdminService.getUsers();
      setUsers(response.users);
      setFilteredUsers(response.users);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleToggleLock = async (userId) => {
    try {
      await AdminService.toggleUserLock(userId);
      await loadUsers();
      
      // Update selected user if modal is open
      if (selectedUser && selectedUser.id === userId) {
        const updatedUser = await AdminService.getUserById(userId);
        setSelectedUser(updatedUser.user);
      }
    } catch (error) {
      console.error('Error toggling user lock:', error);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    try {
      await AdminService.deleteUser(userId);
      await loadUsers();
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin/dashboard')}
                style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }}
              >
                <ArrowLeft size={20} />
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users size={24} className="text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Quản lý người dùng
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredUsers.length} người dùng
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo tên hoặc email..."
              />
            </div>
          </div>
        </Card>

        <Card padding="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-600 dark:text-gray-400">
              Đang tải...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-600 dark:text-gray-400">
              Không tìm thấy người dùng
            </div>
          ) : (
            <UserTable
              users={filteredUsers}
              onUserClick={handleUserClick}
              onToggleLock={handleToggleLock}
              onDelete={handleDelete}
            />
          )}
        </Card>
      </div>

      {/* User Detail Modal */}
      <UserDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onToggleLock={handleToggleLock}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default UserManagementPage;
