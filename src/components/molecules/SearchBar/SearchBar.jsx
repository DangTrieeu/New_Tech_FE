import React from 'react';
import SearchInput from '../../atoms/Input/SearchInput';

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = 'Tìm kiếm...',
  className = '' 
}) => {
  return (
    <div className={className}>
      <SearchInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchBar;
