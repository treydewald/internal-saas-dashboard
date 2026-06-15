import React from 'react';
import { APILog } from '../hooks/useAPILogs';

interface APILogsTableProps {
  logs: APILog[];
  loading?: boolean;
  error?: string | null;
  onRefetch?: () => void;
}

const getStatusColor = (statusCode: number): string => {
  if (statusCode < 300) return 'text-green-400';
  if (statusCode < 400) return 'text-blue-400';
  if (statusCode < 500) return 'text-yellow-400';
  return 'text-red-400';
};

const getResponseTimeColor = (ms: number): string => {
  if (ms < 200) return 'text-green-400';
  if (ms < 500) return 'text-yellow-400';
  return 'text-red-400';
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
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
              Timestamp
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
              Endpoint
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
              Method
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
              Status
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
              Response Time
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr
              key={log.id}
              className="border-b border-slate-700 hover:bg-gray-800 transition-colors"
            >
              <td className="px-4 py-3 text-sm text-slate-400">
                {formatTimestamp(log.timestamp)}
              </td>
              <td className="px-4 py-3 text-sm text-white font-mono">{log.endpoint}</td>
              <td className="px-4 py-3 text-sm">
                <span className="px-2 py-1 bg-gray-700 rounded text-xs font-medium text-slate-300">
                  {log.method}
                </span>
              </td>
              <td className={`px-4 py-3 text-sm font-semibold ${getStatusColor(log.status_code)}`}>
                {log.status_code}
              </td>
              <td className={`px-4 py-3 text-sm font-semibold ${getResponseTimeColor(log.response_time_ms)}`}>
                {log.response_time_ms}ms
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
