import { useState } from 'react';
import { useAuditLog } from '../hooks/useAuditLog';
import AuditLogTable from '../components/AuditLogTable';
import AuditEntryDetail from '../components/AuditEntryDetail';

export default function AuditLogPage() {
  const [selectedLog, setSelectedLog] = useState<Parameters<typeof AuditEntryDetail>[0]['log'] | null>(null);
  const { logs, totalCount, loading } = useAuditLog();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="page-header">
        <h1>Audit Log</h1>
        <p>View all system actions and user activities for compliance and security</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Log Table */}
        <div style={{ gridColumn: 'span 2' }}>
          <AuditLogTable
            logs={logs}
            loading={loading}
            onSelectLog={setSelectedLog}
            totalCount={totalCount}
          />
        </div>

        {/* Detail Sidebar */}
        <div>
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
