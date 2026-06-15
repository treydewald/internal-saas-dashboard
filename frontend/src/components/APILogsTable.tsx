import React from 'react';
import type { APILog } from '../hooks/useAPILogs';

interface APILogsTableProps {
  logs: APILog[];
  loading?: boolean;
  error?: string | null;
  onRefetch?: () => void;
}

const getStatusColor = (statusCode: number): string => {
  if (statusCode < 300) return '#4ADE80';
  if (statusCode < 400) return '#60A5FA';
  if (statusCode < 500) return '#FCD34D';
  return '#F87171';
};

const getStatusBg = (statusCode: number): string => {
  if (statusCode < 300) return 'rgba(74,222,128,0.1)';
  if (statusCode < 400) return 'rgba(96,165,250,0.1)';
  if (statusCode < 500) return 'rgba(252,211,77,0.1)';
  return 'rgba(248,113,113,0.1)';
};

const getResponseTimeColor = (ms: number): string => {
  if (ms < 200) return '#4ADE80';
  if (ms < 500) return '#FCD34D';
  return '#F87171';
};

const getMethodColor = (method: string): { color: string; bg: string; border: string } => {
  switch (method.toUpperCase()) {
    case 'GET': return { color: '#60A5FA', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.25)' };
    case 'POST': return { color: '#4ADE80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.25)' };
    case 'PUT': return { color: '#FCD34D', bg: 'rgba(252,211,77,0.08)', border: 'rgba(252,211,77,0.25)' };
    case 'PATCH': return { color: '#FB923C', bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.25)' };
    case 'DELETE': return { color: '#F87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.25)' };
    default: return { color: '#94A3B8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)' };
  }
};

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

export const APILogsTable: React.FC<APILogsTableProps> = ({
  logs,
  loading = false,
  error = null,
  onRefetch,
}) => {
  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        {onRefetch && (
          <button
            onClick={onRefetch}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-gray-700 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-400">No API logs found</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr
            style={{
              background: 'linear-gradient(90deg, rgba(56,189,248,0.04) 0%, transparent 100%)',
              borderBottom: '1px solid #1e2d4a',
            }}
          >
            {['Timestamp', 'Endpoint', 'Method', 'Status', 'Response Time'].map((col) => (
              <th
                key={col}
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#475569',
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => {
            const methodStyle = getMethodColor(log.method);
            const statusColor = getStatusColor(log.status_code);
            const statusBg = getStatusBg(log.status_code);
            const rtColor = getResponseTimeColor(log.response_time_ms);
            return (
              <tr
                key={log.id}
                style={{
                  borderBottom: '1px solid #0f1c30',
                  backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                    'rgba(56,189,248,0.05)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                    idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)';
                }}
              >
                <td
                  style={{
                    padding: '13px 16px',
                    fontSize: '12px',
                    color: '#475569',
                    fontVariantNumeric: 'tabular-nums',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {formatTimestamp(log.timestamp)}
                </td>
                <td
                  style={{
                    padding: '13px 16px',
                    fontSize: '13px',
                    color: '#CBD5E1',
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                    maxWidth: '280px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {log.endpoint}
                </td>
                <td style={{ padding: '13px 16px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '3px 8px',
                      borderRadius: '5px',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      color: methodStyle.color,
                      backgroundColor: methodStyle.bg,
                      border: `1px solid ${methodStyle.border}`,
                    }}
                  >
                    {log.method}
                  </span>
                </td>
                <td style={{ padding: '13px 16px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '3px 9px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      fontWeight: 700,
                      fontVariantNumeric: 'tabular-nums',
                      color: statusColor,
                      backgroundColor: statusBg,
                      border: `1px solid ${statusColor}30`,
                    }}
                  >
                    {log.status_code}
                  </span>
                </td>
                <td
                  style={{
                    padding: '13px 16px',
                    fontSize: '13px',
                    fontWeight: 600,
                    fontVariantNumeric: 'tabular-nums',
                    color: rtColor,
                  }}
                >
                  {log.response_time_ms}
                  <span style={{ fontSize: '11px', color: '#475569', marginLeft: '2px' }}>ms</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
