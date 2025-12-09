import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Giả lập đăng nhập thành công
    localStorage.setItem('token', 'dummy-token');
    navigate('/chat');
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background-color)' }}>
      <div className="w-full max-w-md p-8 rounded-2xl" style={{ backgroundColor: 'var(--surface-color)' }}>
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">💬</div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Đăng nhập</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg outline-none"
              style={{
                backgroundColor: 'var(--hover-color)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)'
              }}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg outline-none"
              style={{
                backgroundColor: 'var(--hover-color)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)'
              }}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-medium transition-colors mb-4"
            style={{
              backgroundColor: 'var(--primary-color)',
              color: '#ffffff'
            }}
          >
            Đăng nhập
          </button>

          <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
            Chưa có tài khoản?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="font-medium"
              style={{ color: 'var(--primary-color)' }}
            >
              Đăng ký ngay
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

