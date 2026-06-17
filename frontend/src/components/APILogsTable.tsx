import React from 'react';
import { MethodBadge } from './MethodBadge';
import { StatusCodeBadge } from './StatusCodeBadge';
import type { APILog } from '../hooks/useAPILogs';

interface APILogsTableProps {
  logs: APILog[];
  loading?: boolean;
  error?: string | null;
  onRefetch?: () => void;
}

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
};

const getLatencyClass = (ms: number): string => {
  if (ms < 1000) return 'latency--normal';
  if (ms < 3000) return 'latency--warning';
  return 'latency--error';
};

export const APILogsTable: React.FC<APILogsTableProps> = ({
  logs,
  loading = false,
  error = null,
  onRefetch,
}) => {
  if (error) {
    return (
      <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
        <p style={{ color: 'var(--accent-error)', marginBottom: '12px' }}>{error}</p>
        {onRefetch && (
          <button
            onClick={onRefetch}
            style={{
              padding: '6px 12px',
              background: 'var(--accent-error)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-button)',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass-panel" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ height: '28px', background: 'rgba(148,163,184,0.1)', borderRadius: 'var(--radius-sm)', animation: 'live-breathe 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-tertiary)' }}>No API logs found</p>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ overflowX: 'auto', flex: 1 }}>
        <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Time', 'Endpoint', 'Method', 'Status', 'Latency'].map((col) => (
                <th key={col}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="table-row"
              >
                <td style={{ fontSize: '0.70rem', color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                  {formatTimestamp(log.timestamp)}
                </td>
                <td style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'monospace', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {log.endpoint}
                </td>
                <td>
                  <MethodBadge method={log.method as any} />
                </td>
                <td>
                  <StatusCodeBadge code={log.status_code} />
                </td>
                <td className={getLatencyClass(log.response_time_ms)} style={{ fontSize: '0.72rem', fontVariantNumeric: 'tabular-nums' }}>
                  {log.response_time_ms}ms
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
