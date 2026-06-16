import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

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

const ACCENT_COLORS: Record<number, { color: string; bg: string; gradient: string }> = {
  0: { color: '#2563EB', bg: 'rgba(37,99,235,0.08)', gradient: 'linear-gradient(135deg, #2563EB, #4F46E5)' },
  1: { color: '#16A34A', bg: 'rgba(22,163,74,0.08)', gradient: 'linear-gradient(135deg, #16A34A, #059669)' },
  2: { color: '#DC2626', bg: 'rgba(220,38,38,0.08)', gradient: 'linear-gradient(135deg, #DC2626, #E11D48)' },
  3: { color: '#7C3AED', bg: 'rgba(124,58,237,0.08)', gradient: 'linear-gradient(135deg, #7C3AED, #6D28D9)' },
};

function KPISparkline({ data, trend }: { data: number[]; trend: 'UP' | 'DOWN' }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => `${i * step},${h - ((v - min) / range) * (h - 4) - 2}`);
  const points = pts.join(' ');
  const fillPoints = `0,${h} ${points} ${w},${h}`;
  const color = trend === 'UP' ? '#16A34A' : '#DC2626';
  const fillColor = trend === 'UP' ? 'rgba(22,163,74,0.12)' : 'rgba(220,38,38,0.08)';

  const lastX = (data.length - 1) * step;
  const lastY = h - ((data[data.length - 1] - min) / range) * (h - 4) - 2;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <polygon points={fillPoints} fill={fillColor} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r="3" fill={color} stroke="#fff" strokeWidth="1.5" />
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
  accentIndex = 0,
}) => {
  const accent = ACCENT_COLORS[accentIndex] ?? ACCENT_COLORS[0];

  return (
    <article
      className="kpi-card glass-panel kpi-card--hover"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Color accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: accent.gradient,
          borderRadius: 'var(--radius-card) var(--radius-card) 0 0',
        }}
      />

      {/* Icon badge */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: accent.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {trend === 'UP'
          ? <TrendingUp size={14} style={{ color: accent.color }} />
          : <TrendingDown size={14} style={{ color: accent.color }} />
        }
      </div>

      <div style={{ paddingTop: '4px' }}>
        <p className="kpi-card__label">{label}</p>
        <p className="kpi-card__value" style={{ fontSize: '34px', marginTop: '6px' }}>{value}</p>

        {sparkline && (
          <div className="kpi-card__sparkline" style={{ marginTop: '10px' }}>
            <KPISparkline data={sparkline} trend={trend} />
          </div>
        )}

        <div className="kpi-card__footer" style={{ marginTop: '10px' }}>
          <span
            className={`kpi-card__delta ${trend === 'UP' ? 'trend-up' : 'trend-down'}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              fontSize: '12px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 'var(--radius-chip)',
              backgroundColor: trend === 'UP' ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.08)',
            }}
          >
            {trend === 'UP' ? '↑' : '↓'} {delta}
          </span>
          {context && <span className="kpi-card__context">{context}</span>}
        </div>

        {updatedAt && <p className="kpi-card__updated" style={{ marginTop: '8px' }}>{updatedAt}</p>}
      </div>
    </article>
  );
};
