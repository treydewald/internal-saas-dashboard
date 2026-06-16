import React from 'react';
import { useAPILogs } from '../hooks/useAPILogs';
import { APILogsTable } from '../components/APILogsTable';
import { DateRangePicker } from '../components/DateRangePicker';
import ExportButton from '../components/ExportButton';
import { Pagination } from '../components/Pagination';
import { useDateRange } from '../hooks/useDateRange';
import { Activity } from 'lucide-react';

export const APILogsPage: React.FC = () => {
  const { dateRange, updateDateRange } = useDateRange();
  const { logs, loading, error, currentPage, totalPages, limit, onPageChange, refetch } =
    useAPILogs({
      dateFrom: dateRange.from,
      dateTo: dateRange.to,
      limit: 20,
    });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '24px',
          flexWrap: 'wrap',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '7px',
                background: 'rgba(37,99,235,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
              }}
            >
              <Activity size={14} />
            </div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 'var(--fw-semibold)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--accent-primary)',
                margin: 0,
              }}
            >
              Analytics
            </p>
          </div>
          <h1
            style={{
              margin: '0 0 4px 0',
              fontSize: '32px',
              fontWeight: 'var(--fw-bold)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            API Logs
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            Monitor and analyze API request history and performance
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <DateRangePicker
            onDateRangeChange={updateDateRange}
            fromDate={dateRange.from}
            toDate={dateRange.to}
          />
          <ExportButton exportType="api-logs" label="Export" />
        </div>
      </div>

      {/* API Logs Table */}
      <section style={{ flex: '1 1 auto' }}>
        <h2
          style={{
            fontSize: '14px',
            fontWeight: 'var(--fw-semibold)',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            margin: '0 0 16px 0',
          }}
        >
          Request Logs
        </h2>
        <div className="card" style={{ overflow: 'hidden' }}>
          <APILogsTable logs={logs} loading={loading} error={error} onRefetch={refetch} />
        </div>
      </section>

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
