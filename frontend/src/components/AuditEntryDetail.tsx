import React from 'react';

interface AuditEntryDetailProps {
  log: {
    id: number;
    user_id?: number;
    action: string;
    resource_type: string;
    resource_id?: number;
    status: string;
    details: Record<string, any>;
    ip_address?: string;
    created_at: string;
  };
  onClose: () => void;
}

const getStatusStyle = (status: string): React.CSSProperties => {
  if (status === 'success') {
    return { backgroundColor: 'var(--accent-success-dim)', color: 'var(--accent-success)', borderColor: 'rgba(22,163,74,0.2)' };
  }
  return { backgroundColor: 'var(--accent-error-dim)', color: 'var(--accent-error)', borderColor: 'rgba(220,38,38,0.2)' };
};

export default function AuditEntryDetail({ log, onClose }: AuditEntryDetailProps) {
  const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
          Entry Details
        </h3>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            color: 'var(--text-tertiary)',
            lineHeight: 1,
            padding: '4px',
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {[
          { label: 'Action', value: log.action.replace(/_/g, ' '), style: { textTransform: 'capitalize' as const } },
          {
            label: 'Resource',
            value: log.resource_type + (log.resource_id ? ` #${log.resource_id}` : ''),
          },
          { label: 'User', value: log.user_id ? `User #${log.user_id}` : 'System' },
          ...(log.ip_address ? [{ label: 'IP Address', value: log.ip_address, mono: true }] : []),
          { label: 'Timestamp', value: formatDate(log.created_at) },
        ].map(({ label, value, style: extraStyle, mono }) => (
          <div key={label}>
            <p className="label-text" style={{ marginBottom: '4px' }}>{label}</p>
            <p
              style={{
                margin: 0,
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontFamily: mono ? 'monospace' : undefined,
                ...extraStyle,
              }}
            >
              {value}
            </p>
          </div>
        ))}

        <div>
          <p className="label-text" style={{ marginBottom: '4px' }}>Status</p>
          <span className="status-badge" style={getStatusStyle(log.status)}>
            {log.status}
          </span>
        </div>

        {Object.keys(log.details).length > 0 && (
          <div>
            <p className="label-text" style={{ marginBottom: '8px' }}>Additional Details</p>
            <div
              style={{
                backgroundColor: 'var(--layer-0)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                fontFamily: 'monospace',
                overflowX: 'auto',
                maxHeight: '160px',
                overflowY: 'auto',
                whiteSpace: 'pre',
              }}
            >
              {JSON.stringify(log.details, null, 2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
