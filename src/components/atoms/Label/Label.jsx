import React from 'react';

const Label = ({ 
  children, 
  htmlFor = '',
  required = false,
  className = '',
  style = {}
}) => {
  const baseStyles = {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'var(--text-primary)',
  };

  const combinedStyles = {
    ...baseStyles,
    ...style,
  };

  return (
    <label 
      htmlFor={htmlFor} 
      className={className}
      style={combinedStyles}
    >
      {children}
      {required && <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>}
    </label>
  );
};

export default Label;
