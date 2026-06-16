import React, { useState, useRef, useEffect } from 'react';
import { Download } from 'lucide-react';
import { useExport } from '../hooks/useExport';

interface ExportButtonProps {
  exportType: 'kpis' | 'users' | 'api-logs';
  label?: string;
  style?: React.CSSProperties;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  exportType,
  label = 'Export',
  style,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const { isLoading, error, exportKPIs, exportUsers, exportAPILogs } = useExport();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handleExport = async (format: 'csv' | 'pdf') => {
    if (exportType === 'kpis') await exportKPIs(format);
    else if (exportType === 'users') await exportUsers(format);
    else if (exportType === 'api-logs') await exportAPILogs(format);
    setShowMenu(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block', ...style }}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isLoading}
        className="btn-secondary"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', opacity: isLoading ? 0.6 : 1 }}
      >
        <Download size={16} />
        {isLoading ? 'Exporting...' : label}
      </button>

      {showMenu && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 6px)',
            width: '160px',
            backgroundColor: 'var(--layer-2)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-card)',
            boxShadow: 'var(--shadow-card)',
            zIndex: 50,
            overflow: 'hidden',
          }}
        >
          {(['csv', 'pdf'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => handleExport(fmt)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '10px 16px',
                fontSize: '14px',
                color: 'var(--text-secondary)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'block',
                borderBottom: fmt === 'csv' ? '1px solid var(--border-subtle)' : 'none',
                transition: 'background-color var(--duration-sm)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--layer-1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              Export as {fmt.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="alert alert-error" style={{ marginTop: '8px', fontSize: '13px' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default ExportButton;
