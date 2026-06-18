import React, { useState, useEffect } from 'react';

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

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  columns,
  data,
  loading = false,
  error,
  onRowClick,
  onRetry,
  emptyMessage = 'No data available',
}) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  if (error) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div className="alert alert-error" style={{ display: 'inline-block', marginBottom: '16px' }}>
          {error}
        </div>
        {onRetry && (
          <div>
            <button onClick={onRetry} className="btn-primary">Retry</button>
          </div>
        )}
      </div>
    );
  }

  if (loading && data.length === 0) {
    if (isMobile) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="card"
              style={{ animation: 'live-breathe 1.4s ease-in-out infinite' }}
            >
              <div style={{ height: '14px', backgroundColor: 'var(--border-default)', borderRadius: 'var(--radius-sm)', width: '50%', marginBottom: '8px' }} />
              <div style={{ height: '14px', backgroundColor: 'var(--border-default)', borderRadius: 'var(--radius-sm)', width: '75%' }} />
            </div>
          ))}
        </div>
      );
    }
    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-default)', backgroundColor: 'var(--layer-1)' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ padding: '12px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                {columns.map((col) => (
                  <td key={col.key} style={{ padding: '16px 24px' }}>
                    <div
                      style={{
                        height: '14px',
                        backgroundColor: 'var(--border-default)',
                        borderRadius: 'var(--radius-sm)',
                        width: '80px',
                        animation: 'live-breathe 1.4s ease-in-out infinite',
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '15px' }}>
        {emptyMessage}
      </div>
    );
  }

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
        {data.map((row, idx) => (
          <div
            key={row.id || `row-${idx}`}
            className="card"
            style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            onClick={() => onRowClick?.(row)}
          >
            {columns.map((col) => (
              <div
                key={col.key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '10px',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-tertiary)' }}>
                  {col.label}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)', textAlign: 'right', marginLeft: '8px', flex: 1 }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-default)', backgroundColor: 'var(--layer-1)', position: 'sticky', top: 0 }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ padding: '12px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row.id || `row-${idx}`}
              className={onRowClick ? 'table-row--hoverable' : undefined}
              style={{
                borderBottom: '1px solid var(--border-subtle)',
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background-color var(--duration-sm)',
              }}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td key={col.key} style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text-primary)' }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponsiveTable;
