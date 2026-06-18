import React from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface InsightsCardsProps {
  data: {
    anomalies: {
      total_anomalies: number;
      response_time_anomalies: any[];
      error_rate_anomalies: any[];
    };
    forecasts: {
      requests: {
        trend: string;
        confidence_score: number;
      };
      error_rate: {
        trend: string;
        confidence_score: number;
      };
    };
    churn_risk?: {
      total_at_risk: number;
    };
  };
}

const InsightsCards: React.FC<InsightsCardsProps> = ({ data }) => {
  const anomalyCount = data.anomalies.total_anomalies;
  const responseTimeAnomalies = data.anomalies.response_time_anomalies.length;
  const errorRateAnomalies = data.anomalies.error_rate_anomalies.length;
  const requestForecastConfidence = data.forecasts.requests.confidence_score || 0.87;
  const errorForecastConfidence = data.forecasts.error_rate.confidence_score || 0.82;
  const churnRiskCount = data.churn_risk?.total_at_risk || 0;

  const getAnomalyColor = () => {
    if (anomalyCount > 5) return 'var(--accent-error)';
    if (anomalyCount > 0) return 'var(--accent-warning)';
    return 'var(--accent-success)';
  };

  const getAnomalyBg = () => {
    if (anomalyCount > 5) return 'var(--accent-error-dim)';
    if (anomalyCount > 0) return 'var(--accent-warning-dim)';
    return 'var(--accent-success-dim)';
  };

  const getChurnColor = () => {
    if (churnRiskCount > 10) return 'var(--accent-error)';
    if (churnRiskCount > 0) return 'var(--accent-warning)';
    return 'var(--accent-success)';
  };

  const getChurnBg = () => {
    if (churnRiskCount > 10) return 'var(--accent-error-dim)';
    if (churnRiskCount > 0) return 'var(--accent-warning-dim)';
    return 'var(--accent-success-dim)';
  };

  const cards = [
    {
      id: 'anomalies',
      title: 'Total Anomalies',
      value: anomalyCount,
      subtitle: `${responseTimeAnomalies} response time, ${errorRateAnomalies} error rate`,
      icon: AlertTriangle,
      valueColor: getAnomalyColor(),
      iconBg: getAnomalyBg(),
      iconColor: getAnomalyColor(),
    },
    {
      id: 'request-confidence',
      title: 'Request Volume Confidence',
      value: `${Math.round(requestForecastConfidence * 100)}%`,
      subtitle: (data.forecasts.requests.trend === 'increasing' || !data.forecasts.requests.trend) ? 'Trend: Increasing' : 'Trend: Decreasing',
      icon: data.forecasts.requests.trend === 'increasing' ? TrendingUp : TrendingDown,
      valueColor: 'var(--accent-info)',
      iconBg: 'var(--accent-info-dim)',
      iconColor: 'var(--accent-info)',
    },
    {
      id: 'error-confidence',
      title: 'Error Rate Confidence',
      value: `${Math.round(errorForecastConfidence * 100)}%`,
      subtitle: data.forecasts.error_rate.trend === 'improving' ? 'Trend: Improving' : 'Trend: Worsening',
      icon: data.forecasts.error_rate.trend === 'improving' ? TrendingDown : TrendingUp,
      valueColor: 'var(--accent-primary)',
      iconBg: 'var(--accent-primary-dim)',
      iconColor: 'var(--accent-primary)',
    },
    {
      id: 'at-risk-users',
      title: 'At-Risk Users',
      value: churnRiskCount,
      subtitle: 'Churn prediction',
      icon: AlertCircle,
      valueColor: getChurnColor(),
      iconBg: getChurnBg(),
      iconColor: getChurnColor(),
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
      }}
    >
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.id} className="card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    color: 'var(--text-tertiary)',
                    margin: '0 0 10px 0',
                  }}
                >
                  {card.title}
                </p>
                <p
                  style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    color: card.valueColor,
                    margin: 0,
                  }}
                >
                  {card.value}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '8px', margin: '8px 0 0 0' }}>
                  {card.subtitle}
                </p>
              </div>
              <div
                style={{
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: card.iconBg,
                  flexShrink: 0,
                  marginLeft: '12px',
                }}
              >
                <Icon size={20} color={card.iconColor} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InsightsCards;
