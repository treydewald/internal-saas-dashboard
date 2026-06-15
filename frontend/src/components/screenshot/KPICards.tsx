import type { KPI } from '../../types/dashboard';

interface KPICardsProps {
  cards: KPI[];
}

export function KPICards({ cards }: KPICardsProps) {
  return (
    <section className="kpi-grid" aria-label="KPI cards">
      {cards.map(card => (
        <article key={card.id} className="kpi-card glass-panel">
          <p className="kpi-card__label">{card.label}</p>
          <p className="kpi-card__value">{card.value}</p>
          <p className={`kpi-card__delta ${card.trend === 'UP' ? 'trend-up' : 'trend-down'}`}>
            {card.delta}
          </p>
        </article>
      ))}
    </section>
  );
}
