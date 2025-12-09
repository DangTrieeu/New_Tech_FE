import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background-color)' }}>
      <div className="text-center">
        <div className="text-6xl mb-6">💬</div>
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Chào mừng đến Chat App
        </h1>
        <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
          Kết nối với bạn bè và gia đình
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: 'var(--primary-color)',
              color: '#ffffff'
            }}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-3 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: 'var(--surface-color)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)'
            }}
          >
            Đăng ký
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;

