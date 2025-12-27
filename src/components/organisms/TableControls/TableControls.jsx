import React from 'react';
import AdminSearchBar from '../../molecules/AdminSearchBar/AdminSearchBar';
import LimitSelector from '../../molecules/LimitSelector/LimitSelector';

const TableControls = ({ 
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Tìm kiếm...',
  limitValue,
  onLimitChange,
  limitOptions = [5, 10, 20, 50],
  totalItems = 0,
  itemLabel = 'items',
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-xl shadow p-4 mb-4 ${className}`}>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <AdminSearchBar
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Tổng số: <span className="font-semibold">{totalItems}</span> {itemLabel}
          </div>
          <LimitSelector
            value={limitValue}
            onChange={onLimitChange}
            options={limitOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default TableControls;
