import React from 'react';
import Label from '../../atoms/Label/Label';
import Input from '../../atoms/Input/Input';

const FormField = ({ 
  label, 
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  id,
  name,
  error = '',
  className = ''
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        id={id}
        name={name}
      />
      {error && (
        <p className="text-sm mt-1" style={{ color: '#ef4444' }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
