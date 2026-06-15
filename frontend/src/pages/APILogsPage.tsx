import React from 'react';
import { useAPILogs } from '../hooks/useAPILogs';
import { APILogsTable } from '../components/APILogsTable';
import { DateRangePicker } from '../components/DateRangePicker';
import ExportButton from '../components/ExportButton';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1e2d4a', paddingBottom: '20px' }}>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: '#F1F5F9',
            letterSpacing: '-0.02em',
            marginBottom: '6px',
          }}
        >
          API Logs
        </h1>
        <p style={{ color: '#64748B', fontSize: '14px' }}>
          Monitor and analyze API request history
        </p>
      </div>

      {/* Date Range Picker */}
      <DateRangePicker
        onDateRangeChange={updateDateRange}
        fromDate={dateRange.from}
        toDate={dateRange.to}
      />

      {/* API Logs Table with Export */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
          <ExportButton exportType="api-logs" label="Export Logs" />
        </div>
        <div
          style={{
            background: 'linear-gradient(180deg, #0d1829 0%, #0a1422 100%)',
            border: '1px solid #1e2d4a',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          }}
        >
          <APILogsTable logs={logs} loading={loading} error={error} onRefetch={refetch} />
        </div>
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
