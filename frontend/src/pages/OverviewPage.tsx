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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ borderBottom: '1px solid var(--panel-border)', paddingBottom: '24px' }}>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: 'var(--text-0)',
            letterSpacing: '-0.02em',
            marginBottom: '6px',
          }}
        >
          Overview
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: '14px' }}>
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
          <p className="eyebrow">Key Performance Indicators</p>
          <ExportButton exportType="kpis" label="Export KPIs" />
        </div>
        <KPICards dateFrom={dateRange.from} dateTo={dateRange.to} />
      </section>

      <section>
        <p className="eyebrow" style={{ marginBottom: '20px' }}>Advanced Metrics</p>
        <MetricsCards dateFrom={dateRange.from} dateTo={dateRange.to} />
      </section>

      <section>
        <APIActivityChart dateFrom={dateRange.from} dateTo={dateRange.to} />
      </section>
    </div>
  );
};
