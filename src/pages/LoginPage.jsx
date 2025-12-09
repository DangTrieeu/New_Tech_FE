import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/organisms/LoginForm/LoginForm';

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

        <LoginForm
          email={email}
          password={password}
          onEmailChange={(e) => setEmail(e.target.value)}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onSubmit={handleSubmit}
          onNavigateToRegister={() => navigate('/register')}
        />
      </div>
    </div>
  );
};

export default LoginPage;

