import React from 'react';

interface Trend {
  direction: 'up' | 'down';
  percent: number;
}

interface KPICardProps {
  name: string;
  value: number;
  unit?: string;
  trend?: Trend;
}

export const KPICard: React.FC<KPICardProps> = ({ name, value, unit, trend }) => {
  const formattedValue = typeof value === 'number'
    ? value.toLocaleString('en-US', { maximumFractionDigits: 2 })
    : value;

  const isUp = trend?.direction === 'up';
  const trendBg = isUp ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)';
  const trendBorder = isUp ? '#22C55E' : '#EF4444';
  const trendColor = isUp ? '#4ADE80' : '#F87171';
  const trendArrow = isUp ? '↑' : '↓';

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1e2d4a 0%, #1a2342 100%)',
        border: '1px solid #334155',
        borderTop: '2px solid #38BDF8',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(56,189,248,0.3), inset 0 1px 0 rgba(255,255,255,0.06)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)';
      }}
    >
      <p
        style={{
          color: '#94A3B8',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '12px',
        }}
      >
        {name}
      </p>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <span
            style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              color: '#F1F5F9',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            {formattedValue}
          </span>
          {unit && (
            <span
              style={{
                fontSize: '1rem',
                color: '#64748B',
                marginLeft: '6px',
                fontWeight: 500,
              }}
            >
              {unit}
            </span>
          )}
        </div>
        {trend && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '20px',
              background: trendBg,
              border: `1px solid ${trendBorder}`,
              color: trendColor,
              fontSize: '13px',
              fontWeight: 700,
            }}
          >
            {trendArrow} {trend.percent}%
          </div>
        )}
      </div>
    </div>
  );
};
