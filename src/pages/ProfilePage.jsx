import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Moon, Sun, User, Lock, LogOut, Settings } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import Button from '@/components/atoms/Button/Button';
import Avatar from '@/components/atoms/Avatar/Avatar';
import EditProfileModal from '@/components/molecules/EditProfileModal/EditProfileModal';
import ChangePasswordModal from '@/components/molecules/ChangePasswordModal/ChangePasswordModal';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleLogout = async () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      await logout();
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background-color)' }}>
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => navigate('/chat')}
            variant="ghost"
            style={{ color: 'var(--primary-color)' }}
          >
            ← Quay lại
          </Button>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Trang cá nhân
          </h1>
          <div className="w-20"></div>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: 'var(--surface-color)' }}>
          <div className="flex items-center mb-6">
            <div className="mr-4">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <Avatar emoji={user?.name?.charAt(0) || '👤'} size="large" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {user?.name || 'User'}
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {user?.email}
              </p>
              <div className="flex items-center mt-2">
                <span
                  className="inline-block w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: user?.status === 'ONLINE' ? '#10b981' : '#6b7280' }}
                ></span>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {user?.status === 'ONLINE' ? 'Trực tuyến' : 'Ngoại tuyến'}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            fullWidth
            onClick={() => setShowEditProfile(true)}
          >
            <User className="w-4 h-4 mr-2" />
            Chỉnh sửa hồ sơ
          </Button>
        </div>

        {/* Settings */}
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--surface-color)' }}>
          <h3 className="text-lg font-semibold p-4 border-b" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>
            <Settings className="w-5 h-5 inline mr-2" />
            Cài đặt
          </h3>

          {/* Dark Mode Toggle */}
          <div
            className="flex items-center justify-between p-4 border-b cursor-pointer hover:bg-opacity-50"
            style={{ borderColor: 'var(--border-color)' }}
            onClick={toggleTheme}
          >
            <div className="flex items-center">
              {isDarkMode ? (
                <Moon className="w-5 h-5 mr-3" style={{ color: 'var(--primary-color)' }} />
              ) : (
                <Sun className="w-5 h-5 mr-3" style={{ color: 'var(--primary-color)' }} />
              )}
              <span style={{ color: 'var(--text-primary)' }}>Chế độ tối</span>
            </div>
            <div
              className={`w-12 h-6 rounded-full relative transition-colors ${
                isDarkMode ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  isDarkMode ? 'transform translate-x-6' : ''
                }`}
              ></div>
            </div>
          </div>

          {/* Change Password */}
          {user?.provider === 'local' && (
            <div
              className="flex items-center p-4 border-b cursor-pointer hover:opacity-75"
              style={{ borderColor: 'var(--border-color)' }}
              onClick={() => setShowChangePassword(true)}
            >
              <Lock className="w-5 h-5 mr-3" style={{ color: 'var(--primary-color)' }} />
              <span style={{ color: 'var(--text-primary)' }}>Đổi mật khẩu</span>
            </div>
          )}

          {/* Logout */}
          <div
            className="flex items-center p-4 cursor-pointer hover:opacity-75"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3 text-red-500" />
            <span className="text-red-500">Đăng xuất</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEditProfile && (
        <EditProfileModal onClose={() => setShowEditProfile(false)} />
      )}
      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </div>
  );
};

export default ProfilePage;

