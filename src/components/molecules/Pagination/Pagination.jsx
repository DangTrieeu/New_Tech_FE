import React from 'react';
import Button from '@/components/atoms/Button/Button';

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemsOnCurrentPage = 0,
  className = ''
}) => {
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Smart pagination
      if (currentPage <= 3) {
        for (let i = 1; i <= maxVisiblePages; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages.map((pageNum) => (
      <Button
        key={pageNum}
        useTailwind
        onClick={() => onPageChange(pageNum)}
        className={`px-3 py-1 border rounded-lg transition-colors ${
          currentPage === pageNum
            ? 'bg-blue-500 text-white border-blue-500'
            : 'border-gray-300 hover:bg-gray-100'
        }`}
      >
        {pageNum}
      </Button>
    ));
  };

  return (
    <div className={`px-6 py-4 border-t border-gray-200 flex items-center justify-between ${className}`}>
      <div className="text-sm text-gray-600">
        Hiển thị {startItem} - {endItem} trong tổng số {totalItems}
      </div>

      <div className="flex items-center gap-2">
        <Button
          useTailwind
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          ««
        </Button>
        <Button
          useTailwind
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          «
        </Button>

        <div className="flex gap-1">
          {renderPageNumbers()}
        </div>

        <Button
          useTailwind
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          »
        </Button>
        <Button
          useTailwind
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          »»
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
