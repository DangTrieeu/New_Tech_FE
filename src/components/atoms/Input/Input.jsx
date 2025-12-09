import React from 'react';

const Input = ({ 
  type = 'text', 
  value, 
  onChange, 
  placeholder = '',
  required = false,
  disabled = false,
  className = '',
  style = {},
  name = '',
  id = ''
}) => {
  const baseStyles = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    outline: 'none',
    backgroundColor: 'var(--hover-color)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
    transition: 'border-color 0.2s',
  };

  const combinedStyles = {
    ...baseStyles,
    ...style,
  };

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      name={name}
      id={id}
      className={`focus:border-primary ${className}`}
      style={combinedStyles}
    />
  );
};

export default Input;
