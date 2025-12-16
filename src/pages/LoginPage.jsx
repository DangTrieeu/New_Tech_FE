import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/organisms/LoginForm/LoginForm';
import logo from '@/assets/logo.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, isAuthenticated, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect nếu đã đăng nhập - CHỈ khi không đang loading
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      // Delay nhỏ để đảm bảo state đã ổn định
      const timer = setTimeout(() => {
        navigate('/chat', { replace: true });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // Navigate sẽ được xử lý bởi useEffect khi isAuthenticated thay đổi
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background-color)' }}>
      <div className="w-full max-w-md p-8 rounded-2xl" style={{ backgroundColor: 'var(--surface-color)' }}>
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="mx-auto mb-4 w-24 h-24 object-contain" />
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Đăng nhập</h2>
        </div>

        <LoginForm
          email={email}
          password={password}
          onEmailChange={(e) => setEmail(e.target.value)}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onSubmit={handleSubmit}
          onNavigateToRegister={() => navigate('/register')}
          onGoogleLogin={handleGoogleLogin}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default LoginPage;
