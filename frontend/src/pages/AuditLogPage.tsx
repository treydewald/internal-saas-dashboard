import React, { useState } from 'react';
import { useAuditLog } from '../hooks/useAuditLog';
import AuditLogTable from '../components/AuditLogTable';
import AuditEntryDetail from '../components/AuditEntryDetail';

export default function AuditLogPage() {
  const [selectedLog, setSelectedLog] = useState(null);
  const { logs, totalCount, loading, fetchLogs } = useAuditLog();

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Audit Log</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View all system actions and user activities for compliance and security
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Log Table */}
          <div className="lg:col-span-2">
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
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 text-center text-gray-500">
                <p>Select an entry to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
