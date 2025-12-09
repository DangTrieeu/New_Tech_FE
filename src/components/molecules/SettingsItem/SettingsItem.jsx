import React from 'react';

const SettingsItem = ({ 
  icon,
  label,
  value,
  onClick,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${className}`}
      style={{ backgroundColor: 'var(--hover-color)', color: 'var(--text-primary)' }}
    >
      <span>{label}</span>
      <span>{value || icon}</span>
    </button>
  );
};

export default SettingsItem;
