import React from 'react';
import { useAPILogs } from '../hooks/useAPILogs';
import { APILogsTable } from '../components/APILogsTable';
import { DateRangePicker } from '../components/DateRangePicker';
import { Pagination } from '../components/Pagination';
import { useDateRange } from '../hooks/useDateRange';

export const APILogsPage: React.FC = () => {
  const { dateRange, updateDateRange } = useDateRange();
  const { logs, loading, error, currentPage, totalPages, limit, onPageChange, refetch } =
    useAPILogs({
      dateFrom: dateRange.from,
      dateTo: dateRange.to,
      limit: 20,
    });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">API Logs</h1>
        <p className="text-slate-400 mt-1">Monitor and analyze API request history</p>
      </div>

      {/* Date Range Picker */}
      <DateRangePicker
        onDateRangeChange={updateDateRange}
        fromDate={dateRange.from}
        toDate={dateRange.to}
      />

      {/* API Logs Table */}
      <div className="bg-gray-900 border border-slate-700 rounded-lg overflow-hidden">
        <APILogsTable logs={logs} loading={loading} error={error} onRefetch={refetch} />
      </div>

      {/* Pagination */}
      {!loading && !error && logs.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          limit={limit}
        />
      )}
    </div>
  );
};
