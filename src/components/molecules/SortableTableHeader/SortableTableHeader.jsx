import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const SortableTableHeader = ({ 
  label, 
  field, 
  currentSortBy, 
  currentSortOrder, 
  onSort,
  sortable = true,
  className = ''
}) => {
  const isSorted = currentSortBy === field;

  const handleClick = () => {
    if (sortable && onSort) {
      onSort(field);
    }
  };

  return (
    <th
      className={`px-6 py-3 text-left text-sm font-semibold text-gray-700 ${
        sortable ? 'cursor-pointer hover:bg-gray-200' : ''
      } ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortable && isSorted && (
          currentSortOrder === 'asc' ? 
            <ChevronUp className="w-4 h-4 inline" /> : 
            <ChevronDown className="w-4 h-4 inline" />
        )}
      </div>
    </th>
  );
};

export default SortableTableHeader;
