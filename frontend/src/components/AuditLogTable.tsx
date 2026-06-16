import { ActionTypeBadge } from './ActionTypeBadge';
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

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString();
};

export default function AuditLogTable({ logs, loading, onSelectLog, totalCount }: AuditLogTableProps) {
  return (
    <div className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-default)' }}>
        <h3 style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Audit Events ({totalCount})
        </h3>
      </div>
      <div style={{ overflowX: 'auto', flex: 1 }}>
        <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Action', 'Resource', 'Status', 'User', 'Timestamp'].map((col) => (
                <th key={col}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: '16px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                  Loading...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '16px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                  No audit logs found
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => onSelectLog(log)}
                  className="table-row"
                >
                  <td style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    <ActionTypeBadge actionType={log.action} label={log.action.replace(/_/g, ' ')} />
                  </td>
                  <td style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    {log.resource_type} {log.resource_id && `#${log.resource_id}`}
                  </td>
                  <td>
                    <StatusChip state={log.status === 'success' ? 'healthy' : 'error'} label={log.status} />
                  </td>
                  <td style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                    {log.user_id ? `User #${log.user_id}` : 'System'}
                  </td>
                  <td style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
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
