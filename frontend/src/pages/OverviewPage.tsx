import React from 'react';
import { KPICards } from '../components/KPICards';
import { MetricsCards } from '../components/MetricsCards';
import { APIActivityChart } from '../components/APIActivityChart';
import { DateRangePicker } from '../components/DateRangePicker';
import ExportButton from '../components/ExportButton';
import { useDateRange } from '../hooks/useDateRange';

export const OverviewPage: React.FC = () => {
  const { dateRange, updateDateRange } = useDateRange();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      <div style={{ borderBottom: '1px solid #1e2d4a', paddingBottom: '24px' }}>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: '#F1F5F9',
            letterSpacing: '-0.02em',
            marginBottom: '6px',
          }}
        >
          Overview
        </h1>
        <p style={{ color: '#64748B', fontSize: '14px' }}>
          Monitor your key metrics at a glance.
        </p>
      </div>

      {/* Date Range Selector */}
      <section>
        <DateRangePicker
          onDateRangeChange={updateDateRange}
          fromDate={dateRange.from}
          toDate={dateRange.to}
        />
      </section>

      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <div>
            <h2
              style={{
                fontWeight: 700,
                color: '#CBD5E1',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontSize: '11px',
              }}
            >
              Key Performance Indicators
            </h2>
          </div>
          <ExportButton exportType="kpis" label="Export KPIs" />
        </div>
        <KPICards dateFrom={dateRange.from} dateTo={dateRange.to} />
      </section>

      <section>
        <h2
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#CBD5E1',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          Advanced Metrics
        </h2>
        <MetricsCards dateFrom={dateRange.from} dateTo={dateRange.to} />
      </section>

      <section>
        <APIActivityChart dateFrom={dateRange.from} dateTo={dateRange.to} />
      </section>
    </div>
  );
};
