import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex items-center justify-center mt-8">
      <nav className="flex items-center space-x-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center px-3 py-2 rounded-lg ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft size={18} />
          <span className="ml-1 hidden sm:block">Previous</span>
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-gray-400">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 rounded-lg ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center px-3 py-2 rounded-lg ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span className="mr-1 hidden sm:block">Next</span>
          <ChevronRight size={18} />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
