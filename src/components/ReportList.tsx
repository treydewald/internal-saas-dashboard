import React, { useState } from "react";
import { useScheduledReports } from "../hooks/useScheduledReports";
import { formatDistanceToNow } from "date-fns";

interface Report {
  id: number;
  name: string;
  description?: string;
  report_type: string;
  schedule_type: string;
  is_active: boolean;
  created_at: string;
  last_run_at?: string;
  next_run_at?: string;
}

interface ReportListProps {
  reports: Report[];
  loading: boolean;
  error?: string;
  onRefresh: () => void;
}

export const ReportList: React.FC<ReportListProps> = ({ reports, loading, error, onRefresh }) => {
  const { deleteReport, executeReport } = useScheduledReports();
  const [executing, setExecuting] = useState<number | null>(null);

  const handleRunReport = async (reportId: number) => {
    setExecuting(reportId);
    try {
      await executeReport(reportId);
      onRefresh();
    } finally {
      setExecuting(null);
    }
  };

  const handleDelete = async (reportId: number) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      await deleteReport(reportId);
      onRefresh();
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <p className="text-slate-600 dark:text-slate-400">Loading reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-100">Error loading reports: {error}</p>
        <button
          onClick={onRefresh}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 text-center">
        <p className="text-slate-600 dark:text-slate-400 mb-4">No scheduled reports yet</p>
        <a
          href="/reports?tab=create"
          className="inline-block px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
        >
          Create Your First Report
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <div
          key={report.id}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border-l-4 border-cyan-500"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{report.name}</h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    report.is_active
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                  }`}
                >
                  {report.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              {report.description && (
                <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">{report.description}</p>
              )}

              <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-600 dark:text-slate-400">
                <div>
                  <span className="font-medium">Type:</span> {report.report_type}
                </div>
                <div>
                  <span className="font-medium">Schedule:</span> {report.schedule_type}
                </div>
                {report.last_run_at && (
                  <div>
                    <span className="font-medium">Last run:</span>{" "}
                    {formatDistanceToNow(new Date(report.last_run_at), { addSuffix: true })}
                  </div>
                )}
                {report.next_run_at && (
                  <div>
                    <span className="font-medium">Next run:</span>{" "}
                    {formatDistanceToNow(new Date(report.next_run_at), { addSuffix: true })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 ml-4">
              <button
                onClick={() => handleRunReport(report.id)}
                disabled={executing === report.id}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 text-sm font-medium"
              >
                {executing === report.id ? "Running..." : "Run Now"}
              </button>
              <button
                onClick={() => handleDelete(report.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
