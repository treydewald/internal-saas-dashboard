import type { KPI } from '../../types/dashboard';

interface KPICardsProps {
  cards: KPI[];
}

const KPI_ICONS: Record<string, string> = {
  'Active Users': '👥',
  'Requests': '⚡',
  'Error Rate': '🔴',
  'Errors': '🔴',
  'Revenue': '💰',
};

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
      {/* last dot */}
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

export function KPICards({ cards }: KPICardsProps) {
  return (
    <section className="kpi-grid" aria-label="KPI cards">
      {cards.map(card => (
        <article key={card.id} className="kpi-card glass-panel kpi-card--hover">
          {/* Label row */}
          <p className="kpi-card__label">
            <span style={{ marginRight: '5px', opacity: 0.85 }}>{KPI_ICONS[card.label] ?? '📊'}</span>
            {card.label}
          </p>

          {/* Value */}
          <p className="kpi-card__value">{card.value}</p>

          {/* Sparkline */}
          {card.sparkline && (
            <div className="kpi-card__sparkline">
              <KPISparkline data={card.sparkline} trend={card.trend} />
            </div>
          )}

          {/* Delta + context */}
          <div className="kpi-card__footer">
            <span className={`kpi-card__delta ${card.trend === 'UP' ? 'trend-up' : 'trend-down'}`}>
              {card.trend === 'UP' ? '↑' : '↓'} {card.delta}
            </span>
            {card.context && (
              <span className="kpi-card__context">{card.context}</span>
            )}
          </div>

          {/* Freshness metadata */}
          {card.updatedAt && (
            <p className="kpi-card__updated">{card.updatedAt}</p>
          )}
        </article>
      ))}
    </section>
  );
}
