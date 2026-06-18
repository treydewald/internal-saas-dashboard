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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Hero Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '24px',
          flexWrap: 'wrap',
          flex: '0 0 auto',
          paddingBottom: '16px',
          marginBottom: '12px',
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

      {/* Summary KPI Cards */}
      <div style={{ flex: '0 0 auto', marginBottom: '12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <div style={{ background: 'var(--layer-2)', border: '1px solid var(--border-default)', borderRadius: '8px', padding: '16px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '0 0 8px 0', fontWeight: 'var(--fw-semibold)' }}>Total Calls</p>
            <p style={{ fontSize: '24px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)', margin: 0 }}>{logs.length}</p>
          </div>
          <div style={{ background: 'var(--layer-2)', border: '1px solid var(--border-default)', borderRadius: '8px', padding: '16px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '0 0 8px 0', fontWeight: 'var(--fw-semibold)' }}>Error Rate</p>
            <p style={{ fontSize: '24px', fontWeight: 'var(--fw-bold)', color: 'var(--accent-primary)', margin: 0 }}>0.2%</p>
          </div>
          <div style={{ background: 'var(--layer-2)', border: '1px solid var(--border-default)', borderRadius: '8px', padding: '16px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '0 0 8px 0', fontWeight: 'var(--fw-semibold)' }}>Avg Latency</p>
            <p style={{ fontSize: '24px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)', margin: 0 }}>45ms</p>
          </div>
          <div style={{ background: 'var(--layer-2)', border: '1px solid var(--border-default)', borderRadius: '8px', padding: '16px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '0 0 8px 0', fontWeight: 'var(--fw-semibold)' }}>P95 Latency</p>
            <p style={{ fontSize: '24px', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)', margin: 0 }}>128ms</p>
          </div>
        </div>
      </div>

      {/* API Logs Table */}
      <div style={{ flex: '1 1 0', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em', flex: '0 0 auto' }}>Request Logs</h2>
        <APILogsTable logs={logs} loading={loading} error={error} onRefetch={refetch} />
      </div>

      {/* Pagination */}
      {!loading && !error && logs.length > 0 && (
        <div style={{ flex: '0 0 auto', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            limit={limit}
          />
        </div>
      )}
    </div>
  );
};
