import React from 'react';

const Table = ({ children, className = '' }) => {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${className}`}>
        {children}
      </table>
    </div>
  );
};

const TableHeader = ({ children, className = '' }) => {
  return (
    <thead className={`bg-gray-50 dark:bg-gray-800 ${className}`}>
      {children}
    </thead>
  );
};

const TableBody = ({ children, className = '' }) => {
  return (
    <tbody className={`bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700 ${className}`}>
      {children}
    </tbody>
  );
};

const TableRow = ({ children, className = '', onClick }) => {
  return (
    <tr 
      className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

const TableHead = ({ children, className = '' }) => {
  return (
    <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${className}`}>
      {children}
    </th>
  );
};

const TableCell = ({ children, className = '' }) => {
  return (
    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${className}`}>
      {children}
    </td>
  );
};

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;

export default Table;
