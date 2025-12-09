import React from 'react';
import { Search } from 'lucide-react';

const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = 'Tìm kiếm...',
  className = '',
  style = {}
}) => {
  const baseStyles = {
    width: '100%',
    padding: '0.5rem 1rem',
    paddingRight: '2.5rem',
    borderRadius: '0.5rem',
    outline: 'none',
    backgroundColor: 'var(--hover-color)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
  };

  const combinedStyles = {
    ...baseStyles,
    ...style,
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        style={combinedStyles}
      />
      <span 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        style={{ pointerEvents: 'none' }}
      >
        <Search size={18} />
      </span>
    </div>
  );
};

export default SearchInput;
