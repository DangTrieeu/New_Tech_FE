import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Bell, Lock } from 'lucide-react';
import { ThemeContext } from '../contexts/ThemeContext';
import Button from '../components/atoms/Button/Button';
import Avatar from '../components/atoms/Avatar/Avatar';
import SettingsItem from '../components/molecules/SettingsItem/SettingsItem';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background-color)' }}>
      <div className="max-w-4xl mx-auto p-6">
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
          <div className="w-10"></div>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: 'var(--surface-color)' }}>
          <div className="flex items-center mb-6">
            <div className="mr-4">
              <Avatar emoji="👤" size="large" />
            </div>
            <div>
              <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                Nguyễn Văn A
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>user@example.com</p>
            </div>
          </div>

          <Button variant="primary" fullWidth>
            Chỉnh sửa hồ sơ
          </Button>
        </div>

        {/* Settings */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--surface-color)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Cài đặt
          </h3>

          <div className="space-y-3">
            <SettingsItem
              label="Chế độ tối"
              icon={isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
              onClick={toggleTheme}
            />
            <SettingsItem
              label="Thông báo"
              icon={<Bell size={20} />}
              onClick={() => {}}
            />
            <SettingsItem
              label="Quyền riêng tư"
              icon={<Lock size={20} />}
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

