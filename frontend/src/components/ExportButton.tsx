import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { useExport } from '../hooks/useExport';

interface ExportButtonProps {
  exportType: 'kpis' | 'users' | 'api-logs';
  label?: string;
  className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  exportType,
  label = 'Export',
  className = '',
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const { isLoading, error, exportKPIs, exportUsers, exportAPILogs } = useExport();

  const handleExport = async (format: 'csv' | 'pdf') => {
    if (exportType === 'kpis') {
      await exportKPIs(format);
    } else if (exportType === 'users') {
      await exportUsers(format);
    } else if (exportType === 'api-logs') {
      await exportAPILogs(format);
    }
    setShowMenu(false);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg disabled:opacity-50"
      >
        <Download size={18} />
        {isLoading ? 'Exporting...' : label}
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
          <button
            onClick={() => handleExport('csv')}
            className="w-full text-left px-4 py-2 hover:bg-slate-100 first:rounded-t-lg"
          >
            Export as CSV
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="w-full text-left px-4 py-2 hover:bg-slate-100 last:rounded-b-lg border-t border-slate-200"
          >
            Export as PDF
          </button>
        </div>
      )}

      {error && (
        <div className="mt-2 p-2 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default ExportButton;
