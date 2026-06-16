import React from 'react';
import { StatusChip } from './StatusChip';
import type { APILog } from '../hooks/useAPILogs';

interface APILogsTableProps {
  logs: APILog[];
  loading?: boolean;
  error?: string | null;
  onRefetch?: () => void;
}

const getResponseTimeStatus = (ms: number): 'active' | 'warn' | 'error' => {
  if (ms < 1000) return 'active';
  if (ms < 3000) return 'warn';
  return 'error';
};

const getStatusCodeStatus = (code: number): 'active' | 'warn' | 'error' => {
  if (code < 300) return 'active';
  if (code < 400) return 'active';
  if (code < 500) return 'warn';
  return 'error';
};

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
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
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
              {['Time', 'Endpoint', 'Method', 'Status', 'Latency'].map((col) => (
                <th key={col} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map((log, idx) => (
              <tr
                key={log.id}
                className="table-row--hoverable"
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                }}
              >
                <td style={{ padding: '8px 12px', fontSize: '0.70rem', color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                  {formatTimestamp(log.timestamp)}
                </td>
                <td style={{ padding: '8px 12px', fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'monospace', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {log.endpoint}
                </td>
                <td style={{ padding: '8px 12px' }}>
                  <StatusChip status={log.method.toLowerCase()} label={log.method} />
                </td>
                <td style={{ padding: '8px 12px' }}>
                  <StatusChip status={getStatusCodeStatus(log.status_code)} label={String(log.status_code)} />
                </td>
                <td style={{ padding: '8px 12px', fontSize: '0.72rem', fontVariantNumeric: 'tabular-nums', color: getResponseTimeStatus(log.response_time_ms) === 'error' ? 'var(--accent-error)' : getResponseTimeStatus(log.response_time_ms) === 'warn' ? 'var(--accent-warning)' : 'var(--text-secondary)' }}>
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
