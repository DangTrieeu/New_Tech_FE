import React from 'react';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';

const RegisterForm = ({ 
  name,
  email,
  password,
  confirmPassword,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onNavigateToLogin
}) => {
  return (
    <form onSubmit={onSubmit}>
      <FormField
        label="Họ tên"
        type="text"
        value={name}
        onChange={onNameChange}
        required
        id="name"
        name="name"
      />

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

      <FormField
        label="Xác nhận mật khẩu"
        type="password"
        value={confirmPassword}
        onChange={onConfirmPasswordChange}
        required
        id="confirmPassword"
        name="confirmPassword"
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        className="mb-4"
      >
        Đăng ký
      </Button>

      <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
        Đã có tài khoản?{' '}
        <Button
          variant="link"
          type="button"
          onClick={onNavigateToLogin}
          className="font-medium"
          style={{ color: 'var(--primary-color)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Đăng nhập
        </Button>
      </p>
    </form>
  );
};

export default RegisterForm;
