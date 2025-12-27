import React from 'react';

const LimitSelector = ({ 
  value, 
  onChange, 
  options = [5, 10, 20, 50],
  className = '' 
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label className="text-sm text-gray-600">Hiển thị:</label>
      <select
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="text-sm text-gray-600">/ trang</span>
    </div>
  );
};

export default LimitSelector;
