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
        return (
          <div
            key={idx}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm font-medium">{card.title}</p>
                <p className={`text-3xl font-bold mt-2 ${card.color}`}>{card.value}</p>
                <p className="text-gray-500 text-xs mt-2">{card.subtitle}</p>
              </div>
              <div className={`${card.bgColor} bg-opacity-20 p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InsightsCards;
