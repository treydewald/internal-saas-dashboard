import { StatusChip } from './StatusChip';

interface AuditLog {
  id: number;
  user_id?: number;
  action: string;
  resource_type: string;
  resource_id?: number;
  status: string;
  details: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

interface AuditLogTableProps {
  logs: AuditLog[];
  loading: boolean;
  onSelectLog: (log: AuditLog) => void;
  totalCount: number;
}

const getActionStatus = (action: string): string => {
  if (action.startsWith('user.')) return 'info';
  if (action.startsWith('api_key.')) return 'warn';
  if (action.startsWith('org.')) return 'purple';
  return 'inactive';
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString();
};

export default function AuditLogTable({ logs, loading, onSelectLog, totalCount }: AuditLogTableProps) {
  return (
    <div className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-default)' }}>
        <h3 style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-0)', margin: 0 }}>
          Audit Events ({totalCount})
        </h3>
      </div>
      <div style={{ overflowX: 'auto', flex: 1 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
              {['Action', 'Resource', 'Status', 'User', 'Timestamp'].map((col) => (
                <th key={col} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: '16px', textAlign: 'center', color: 'var(--text-2)' }}>
                  Loading...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '16px', textAlign: 'center', color: 'var(--text-2)' }}>
                  No audit logs found
                </td>
              </tr>
            ) : (
              logs.map((log, idx) => (
                <tr
                  key={log.id}
                  onClick={() => onSelectLog(log)}
                  className="table-row--hoverable"
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                    cursor: 'pointer',
                  }}
                >
                  <td style={{ padding: '8px 12px', fontSize: '0.72rem', color: 'var(--text-1)' }}>
                    <StatusChip status={getActionStatus(log.action)} label={log.action.replace(/_/g, ' ')} />
                  </td>
                  <td style={{ padding: '8px 12px', fontSize: '0.72rem', color: 'var(--text-1)' }}>
                    {log.resource_type} {log.resource_id && `#${log.resource_id}`}
                  </td>
                  <td style={{ padding: '8px 12px' }}>
                    <StatusChip status={log.status === 'success' ? 'active' : 'error'} label={log.status} />
                  </td>
                  <td style={{ padding: '8px 12px', fontSize: '0.72rem', color: 'var(--text-2)' }}>
                    {log.user_id ? `User #${log.user_id}` : 'System'}
                  </td>
                  <td style={{ padding: '8px 12px', fontSize: '0.72rem', color: 'var(--text-2)' }}>
                    {formatDate(log.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
