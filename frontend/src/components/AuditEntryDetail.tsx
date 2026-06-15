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

export default function AuditEntryDetail({ log, onClose }: AuditEntryDetailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Entry Details</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-lg"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {/* Action */}
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Action</p>
          <p className="text-gray-900 dark:text-white capitalize">{log.action.replace(/_/g, ' ')}</p>
        </div>

        {/* Resource */}
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resource</p>
          <p className="text-gray-900 dark:text-white">
            {log.resource_type}
            {log.resource_id && ` #${log.resource_id}`}
          </p>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</p>
          <span
            className={`inline-block px-2 py-1 rounded text-sm font-semibold ${
              log.status === 'success'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {log.status}
          </span>
        </div>

        {/* User */}
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">User</p>
          <p className="text-gray-900 dark:text-white">{log.user_id ? `User #${log.user_id}` : 'System'}</p>
        </div>

        {/* IP Address */}
        {log.ip_address && (
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">IP Address</p>
            <p className="text-gray-900 dark:text-white font-mono text-sm">{log.ip_address}</p>
          </div>
        )}

        {/* Timestamp */}
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Timestamp</p>
          <p className="text-gray-900 dark:text-white text-sm">{formatDate(log.created_at)}</p>
        </div>

        {/* Details */}
        {Object.keys(log.details).length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Additional Details</p>
            <div className="bg-gray-50 dark:bg-slate-700 rounded p-3 text-xs text-gray-900 dark:text-gray-100 font-mono overflow-auto max-h-40">
              {JSON.stringify(log.details, null, 2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
