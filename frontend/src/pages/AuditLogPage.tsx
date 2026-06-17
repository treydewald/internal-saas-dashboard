import { useState } from 'react';
import { useAuditLog } from '../hooks/useAuditLog';
import AuditLogTable from '../components/AuditLogTable';
import AuditEntryDetail from '../components/AuditEntryDetail';
import { Shield } from 'lucide-react';

export default function AuditLogPage() {
  const [selectedLog, setSelectedLog] = useState<Parameters<typeof AuditEntryDetail>[0]['log'] | null>(null);
  const { logs, totalCount, loading } = useAuditLog();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero Header */}
      <div
        style={{
          paddingBottom: '24px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
            <Shield size={14} />
          </div>
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-primary)', margin: 0 }}>
            Compliance
          </p>
        </div>
        <h1 style={{ margin: '0 0 4px 0', fontSize: '32px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)' }}>Audit Log</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>View all system actions and user activities for compliance and security</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '32px' }}>
        {/* Log Table */}
        <div style={{ minWidth: 0 }}>
          <AuditLogTable
            logs={logs}
            loading={loading}
            onSelectLog={setSelectedLog}
            totalCount={totalCount}
          />
        </div>

        {/* Detail Sidebar */}
        <div style={{ minWidth: 0 }}>
          {selectedLog ? (
            <AuditEntryDetail log={selectedLog} onClose={() => setSelectedLog(null)} />
          ) : (
            <div className="card" style={{ textAlign: 'center', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: 'var(--text-tertiary)', margin: 0 }}>Select an entry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
