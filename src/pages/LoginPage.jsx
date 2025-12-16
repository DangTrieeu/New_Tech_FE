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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      
      // Redirect based on role
      if (result.isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/chat', { replace: true });
      }
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
