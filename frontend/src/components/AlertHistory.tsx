import React from 'react';
import { Activity } from 'lucide-react';

interface Alert {
  id: number;
  alert_rule_id: number;
  status: string;
  metric_value: number;
  message: string;
  created_at: string;
  acknowledged_at?: string;
  resolved_at?: string;
}

interface AlertHistoryProps {
  alerts: Alert[];
  loading: boolean;
}

const getStatusStyle = (status: string): React.CSSProperties => {
  switch (status) {
    case 'triggered':
      return { backgroundColor: 'var(--accent-error-dim)', color: 'var(--accent-error)', borderColor: 'rgba(220,38,38,0.2)' };
    case 'acknowledged':
      return { backgroundColor: 'rgba(234,179,8,0.12)', color: 'var(--accent-warning)', borderColor: 'rgba(234,179,8,0.2)' };
    case 'resolved':
      return { backgroundColor: 'var(--accent-success-dim)', color: 'var(--accent-success)', borderColor: 'rgba(22,163,74,0.2)' };
    default:
      return { backgroundColor: 'var(--border-default)', color: 'var(--text-tertiary)' };
  }
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleString();
};

export default function AlertHistory({ alerts, loading }: AlertHistoryProps) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #DC2626, #D97706)' }} />
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(220,38,38,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
          <Activity size={15} />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Alert History</h2>
          {!loading && <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{alerts.length} events recorded</p>}
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>
              {['Message', 'Status', 'Metric Value', 'Triggered', 'Resolved'].map((col) => (
                <th
                  key={col}
                  style={{ padding: '10px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '14px' }}>
                  Loading alerts...
                </td>
              </tr>
            ) : alerts.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '14px' }}>
                  No alerts yet
                </td>
              </tr>
            ) : (
              alerts.map((alert) => (
                <tr
                  key={alert.id}
                  className="table-row--hoverable"
                  style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color var(--duration-sm)' }}
                >
                  <td style={{ padding: '14px 24px', fontSize: '14px', color: 'var(--text-primary)' }}>
                    {alert.message}
                  </td>
                  <td style={{ padding: '14px 24px' }}>
                    <span className="status-badge" style={getStatusStyle(alert.status)}>
                      {alert.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 24px', fontSize: '14px', color: 'var(--text-primary)' }}>
                    {alert.metric_value.toFixed(2)}
                  </td>
                  <td style={{ padding: '14px 24px', fontSize: '13px', color: 'var(--text-tertiary)' }}>
                    {formatDate(alert.created_at)}
                  </td>
                  <td style={{ padding: '14px 24px', fontSize: '13px', color: 'var(--text-tertiary)' }}>
                    {formatDate(alert.resolved_at)}
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
