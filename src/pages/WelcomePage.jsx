import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button/Button';

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
          <Button
            onClick={() => navigate('/login')}
            variant="primary"
            size="large"
          >
            Đăng nhập
          </Button>
          <Button
            onClick={() => navigate('/register')}
            variant="secondary"
            size="large"
          >
            Đăng ký
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;

