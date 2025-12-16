import React from 'react';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';
import GoogleLoginButton from '../../atoms/Button/GoogleLoginButton';

const LoginForm = ({ 
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onNavigateToRegister,
  onGoogleLogin,
  loading
}) => {
  return (
    <form onSubmit={onSubmit}>
      <FormField
        label="Email"
        type="email"
        value={email}
        onChange={onEmailChange}
        required
        id="email"
        name="email"
      />

      <FormField
        label="Mật khẩu"
        type="password"
        value={password}
        onChange={onPasswordChange}
        required
        id="password"
        name="password"
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        className="mb-4"
        disabled={loading}
      >
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </Button>

      {/* Divider */}
      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" style={{ borderColor: 'var(--border-color)' }}></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2" style={{ backgroundColor: 'var(--surface-color)', color: 'var(--text-secondary)' }}>
            Hoặc
          </span>
        </div>
      </div>

      {/* Google Login Button */}
      <GoogleLoginButton onClick={onGoogleLogin} disabled={loading} />

      <p className="text-center mt-4" style={{ color: 'var(--text-secondary)' }}>
        Chưa có tài khoản?{' '}
        <button
          type="button"
          onClick={onNavigateToRegister}
          className="font-medium"
          style={{ color: 'var(--primary-color)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Đăng ký ngay
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
