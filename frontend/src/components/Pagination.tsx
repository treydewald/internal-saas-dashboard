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
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0',
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
        Page{' '}
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{currentPage}</span>
        {' '}of{' '}
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{totalPages}</span>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="btn-secondary"
          style={{ fontSize: '13px', padding: '6px 14px' }}
        >
          ← Prev
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="btn-secondary"
          style={{ fontSize: '13px', padding: '6px 14px' }}
        >
          Next →
        </button>
      </div>
    </div>
  );
};
