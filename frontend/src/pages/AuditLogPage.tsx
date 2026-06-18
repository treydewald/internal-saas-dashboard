import { useState } from 'react';
import { useAuditLog } from '../hooks/useAuditLog';
import AuditLogTable from '../components/AuditLogTable';
import AuditEntryDetail from '../components/AuditEntryDetail';
import { Shield } from 'lucide-react';

export default function AuditLogPage() {
  const [selectedLog, setSelectedLog] = useState<Parameters<typeof AuditEntryDetail>[0]['log'] | null>(null);
  const { logs, totalCount, loading } = useAuditLog();

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Hero Header */}
      <div
        style={{
          flex: '0 0 auto',
          paddingBottom: '16px',
          marginBottom: '12px',
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

      <div style={{ flex: '1 1 0', minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 360px', gap: '16px', overflow: 'hidden' }}>
        {/* Log Table */}
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <AuditLogTable
            logs={logs}
            loading={loading}
            onSelectLog={setSelectedLog}
            totalCount={totalCount}
          />
        </div>

        {/* Detail Sidebar */}
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {selectedLog ? (
            <AuditEntryDetail log={selectedLog} onClose={() => setSelectedLog(null)} />
          ) : (
            <div className="card" style={{ textAlign: 'center', minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: 'var(--text-tertiary)', margin: 0 }}>Select an entry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
