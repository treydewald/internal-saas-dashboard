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
  const requestForecastConfidence = data.forecasts.requests.confidence_score;
  const errorForecastConfidence = data.forecasts.error_rate.confidence_score;
  const churnRiskCount = data.churn_risk?.total_at_risk || 0;

  const cards = [
    {
      title: 'Total Anomalies',
      value: anomalyCount,
      subtitle: `${responseTimeAnomalies} response time, ${errorRateAnomalies} error rate`,
      icon: AlertTriangle,
      color: anomalyCount > 5 ? 'text-red-500' : anomalyCount > 0 ? 'text-yellow-500' : 'text-green-500',
      bgColor: anomalyCount > 5 ? 'bg-red-500' : anomalyCount > 0 ? 'bg-yellow-500' : 'bg-green-500',
    },
    {
      title: 'Request Volume Confidence',
      value: `${Math.round(requestForecastConfidence * 100)}%`,
      subtitle: data.forecasts.requests.trend === 'increasing' ? 'Trend: Increasing' : 'Trend: Decreasing',
      icon: data.forecasts.requests.trend === 'increasing' ? TrendingUp : TrendingDown,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500',
    },
    {
      title: 'Error Rate Confidence',
      value: `${Math.round(errorForecastConfidence * 100)}%`,
      subtitle: data.forecasts.error_rate.trend === 'improving' ? 'Trend: Improving' : 'Trend: Worsening',
      icon: data.forecasts.error_rate.trend === 'improving' ? TrendingDown : TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500',
    },
    {
      title: 'At-Risk Users',
      value: churnRiskCount,
      subtitle: 'Churn prediction',
      icon: AlertCircle,
      color: churnRiskCount > 10 ? 'text-red-500' : churnRiskCount > 0 ? 'text-orange-500' : 'text-green-500',
      bgColor: churnRiskCount > 10 ? 'bg-red-500' : churnRiskCount > 0 ? 'bg-orange-500' : 'bg-green-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const glowColorMap: Record<string, string> = {
          'text-red-500': 'rgba(239,68,68,0.15)',
          'text-yellow-500': 'rgba(250,204,21,0.15)',
          'text-green-500': 'rgba(34,197,94,0.15)',
          'text-cyan-500': 'rgba(6,182,212,0.15)',
          'text-blue-500': 'rgba(59,130,246,0.15)',
          'text-orange-500': 'rgba(249,115,22,0.15)',
        };
        const borderColorMap: Record<string, string> = {
          'text-red-500': 'rgba(239,68,68,0.3)',
          'text-yellow-500': 'rgba(250,204,21,0.3)',
          'text-green-500': 'rgba(34,197,94,0.3)',
          'text-cyan-500': 'rgba(6,182,212,0.3)',
          'text-blue-500': 'rgba(59,130,246,0.3)',
          'text-orange-500': 'rgba(249,115,22,0.3)',
        };
        const glowBg = glowColorMap[card.color] ?? 'rgba(148,163,184,0.1)';
        const borderAccent = borderColorMap[card.color] ?? 'rgba(148,163,184,0.2)';

        return (
          <div
            key={idx}
            style={{
              background: 'linear-gradient(135deg, #1a2542 0%, #131e35 100%)',
              border: `1px solid ${borderAccent}`,
              borderRadius: '12px',
              padding: '24px',
              boxShadow: `0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.03)`,
              transition: 'box-shadow 0.2s ease, transform 0.15s ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${glowBg}`;
              el.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.03)';
              el.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#475569', marginBottom: '10px' }}>
                  {card.title}
                </p>
                <p style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }} className={card.color}>
                  {card.value}
                </p>
                <p style={{ fontSize: '12px', color: '#475569', marginTop: '8px' }}>
                  {card.subtitle}
                </p>
              </div>
              <div
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  background: glowBg,
                  border: `1px solid ${borderAccent}`,
                  flexShrink: 0,
                }}
              >
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InsightsCards;
