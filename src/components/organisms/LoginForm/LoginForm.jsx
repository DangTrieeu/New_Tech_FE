import React from 'react';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';

const LoginForm = ({ 
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onNavigateToRegister
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
      >
        Đăng nhập
      </Button>

      <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
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
