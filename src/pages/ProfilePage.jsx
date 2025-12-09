import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background-color)' }}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/chat')}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--primary-color)' }}
          >
            ← Quay lại
          </button>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Trang cá nhân
          </h1>
          <div className="w-10"></div>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: 'var(--surface-color)' }}>
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mr-4"
              style={{ backgroundColor: 'var(--hover-color)' }}>
              👤
            </div>
            <div>
              <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                Nguyễn Văn A
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>user@example.com</p>
            </div>
          </div>

          <button
            className="w-full py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: 'var(--primary-color)',
              color: '#ffffff'
            }}
          >
            Chỉnh sửa hồ sơ
          </button>
        </div>

        {/* Settings */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--surface-color)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Cài đặt
          </h3>

          <div className="space-y-3">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-3 rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--hover-color)', color: 'var(--text-primary)' }}
            >
              <span>Chế độ tối</span>
              <span>{isDarkMode ? '🌙' : '☀️'}</span>
            </button>

            <button
              className="w-full flex items-center justify-between p-3 rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--hover-color)', color: 'var(--text-primary)' }}
            >
              <span>Thông báo</span>
              <span>🔔</span>
            </button>

            <button
              className="w-full flex items-center justify-between p-3 rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--hover-color)', color: 'var(--text-primary)' }}
            >
              <span>Quyền riêng tư</span>
              <span>🔒</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

