import React from 'react';
import { Search } from 'lucide-react';
import Input from '../../atoms/Input/Input';

const AdminSearchBar = ({ 
  value, 
  onChange, 
  placeholder = 'Tìm kiếm...',
  className = '' 
}) => {
  return (
    <div className={`relative flex-1 max-w-md ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};

export default AdminSearchBar;
