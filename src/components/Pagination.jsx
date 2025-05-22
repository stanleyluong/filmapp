import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Basic pagination: Previous, Current Page / Total Pages, Next
  // You can expand this to show more page numbers, e.g., 1, 2, ..., 5, 6, 7, ..., 100
  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page or less
  }

  return (
    <div className="flex justify-center items-center space-x-4 my-8">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300"
      >
        Previous
      </button>
      <span className="text-white">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination; 