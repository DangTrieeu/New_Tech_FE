import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
    // Giả lập đăng ký thành công
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background-color)' }}>
      <div className="w-full max-w-md p-8 rounded-2xl" style={{ backgroundColor: 'var(--surface-color)' }}>
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">💬</div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Đăng ký</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Họ tên
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg outline-none"
              style={{
                backgroundColor: 'var(--hover-color)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)'
              }}
              required
            />
          </div>

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

          <div className="mb-4">
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

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            Đăng ký
          </button>

          <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
            Đã có tài khoản?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-medium"
              style={{ color: 'var(--primary-color)' }}
            >
              Đăng nhập
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

