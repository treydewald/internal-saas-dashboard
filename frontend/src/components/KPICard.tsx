import React from 'react';

interface KPICardProps {
  label: string;
  value: string;
  delta: string;
  trend: 'UP' | 'DOWN';
  sparkline?: number[];
  context?: string;
  updatedAt?: string;
  accentIndex?: 0 | 1 | 2 | 3;
}

function KPISparkline({ data, trend }: { data: number[]; trend: 'UP' | 'DOWN' }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 60;
  const h = 22;
  const step = w / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * (h - 2) - 1}`)
    .join(' ');
  const color = trend === 'UP' ? '#34d399' : '#fb7185';
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
      <circle
        cx={(data.length - 1) * step}
        cy={h - ((data[data.length - 1] - min) / range) * (h - 2) - 1}
        r="2.5"
        fill={color}
        opacity="0.9"
      />
    </svg>
  );
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  delta,
  trend,
  sparkline,
  context,
  updatedAt,
  accentIndex,
}) => {
  return (
    <article
      className="kpi-card glass-panel kpi-card--hover"
      style={accentIndex !== undefined ? { '--kpi-accent': `var(--kpi-${accentIndex + 1})` } as any : undefined}
    >
      <p className="kpi-card__label">{label}</p>
      <p className="kpi-card__value">{value}</p>
      {sparkline && (
        <div className="kpi-card__sparkline">
          <KPISparkline data={sparkline} trend={trend} />
        </div>
      )}
      <div className="kpi-card__footer">
        <span className={`kpi-card__delta ${trend === 'UP' ? 'trend-up' : 'trend-down'}`}>
          {trend === 'UP' ? '↑' : '↓'} {delta}
        </span>
        {context && <span className="kpi-card__context">{context}</span>}
      </div>
      {updatedAt && <p className="kpi-card__updated">{updatedAt}</p>}
    </article>
  );
};
