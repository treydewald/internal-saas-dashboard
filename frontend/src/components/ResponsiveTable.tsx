import React from 'react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface ResponsiveTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  error?: string;
  onRowClick?: (row: any) => void;
  onRetry?: () => void;
  emptyMessage?: string;
}

/**
 * ResponsiveTable component that automatically adapts to mobile and desktop views.
 * On mobile: displays as stacked cards
 * On desktop: displays as traditional table
 */
export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  columns,
  data,
  loading = false,
  error,
  onRowClick,
  onRetry,
  emptyMessage = 'No data available',
}) => {
  const SkeletonRow = () => (
    <tr className="border-b border-slate-800 hover:bg-gray-900 transition-colors">
      {columns.map((col) => (
        <td key={col.key} className="px-6 py-4">
          <div className="h-4 bg-slate-700 rounded w-20 animate-pulse" />
        </td>
      ))}
    </tr>
  );

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-400 mb-4">{error}</div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (loading && data.length === 0) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full hidden md:table">
          <thead className="bg-gray-900 border-b border-slate-700 sticky top-0">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left text-sm font-semibold text-slate-300"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </tbody>
        </table>

        {/* Mobile skeleton */}
        <div className="md:hidden space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-slate-800 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="text-slate-400 text-lg">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full">
          <thead className="bg-gray-900 border-b border-slate-700 sticky top-0">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left text-sm font-semibold text-slate-300"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-slate-800 hover:bg-gray-900 transition-colors cursor-pointer"
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-white">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {data.map((row, idx) => (
          <div
            key={idx}
            className="bg-slate-800 border border-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-750 transition-colors"
            onClick={() => onRowClick?.(row)}
          >
            {columns.map((col) => (
              <div key={col.key} className="flex justify-between items-start mb-3 last:mb-0">
                <span className="text-slate-400 text-sm font-medium">{col.label}</span>
                <span className="text-white text-sm text-right ml-2 flex-1">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default ResponsiveTable;
