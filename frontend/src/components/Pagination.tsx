import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (offset: number) => void;
  limit: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  limit,
}) => {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange((currentPage - 2) * limit);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage * limit);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700">
      <div className="text-sm text-slate-400">
        Page <span className="font-semibold text-white">{currentPage}</span> of{' '}
        <span className="font-semibold text-white">{totalPages}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-900 border border-slate-700 rounded-lg text-slate-300 hover:text-white hover:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-900 border border-slate-700 rounded-lg text-slate-300 hover:text-white hover:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
};
