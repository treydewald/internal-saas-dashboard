import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import InsightsCards from '../components/InsightsCards';
import AnomalyAlert from '../components/AnomalyAlert';
import ForecastChart from '../components/ForecastChart';

interface DashboardData {
  generated_at: string;
  anomalies: {
    detected_at: string;
    response_time_anomalies: any[];
    error_rate_anomalies: any[];
    traffic_anomalies: any[];
    total_anomalies: number;
  };
  forecasts: {
    requests: {
      forecast_type: string;
      generated_at: string;
      forecast: any[];
      confidence_score: number;
      trend: string;
    };
    error_rate: {
      forecast_type: string;
      generated_at: string;
      forecast: any[];
      confidence_score: number;
      trend: string;
    };
  };
  churn_risk?: {
    prediction_type: string;
    generated_at: string;
    high_risk_count: number;
    medium_risk_count: number;
    total_at_risk: number;
  };
}

const InsightsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<DashboardData>('/api/insights/dashboard');

        if (!response.ok) {
          throw new Error('Failed to load insights');
        }

        setData(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load insights');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
    const interval = setInterval(fetchInsights, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

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
          ML Insights
        </h1>
        <p style={{ color: '#64748B', fontSize: '14px' }}>
          Anomaly detection, forecasts, and predictions for your API activity
        </p>
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '10px',
            padding: '16px',
          }}
        >
          <p style={{ color: '#F87171' }}>{error}</p>
        </div>
      )}

      {data && (
        <>
          {/* Insights Summary Cards */}
          <InsightsCards data={data} />

          {/* Anomalies Section */}
          {data.anomalies.total_anomalies > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  color: '#64748B',
                }}
              >
                Detected Anomalies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.anomalies.response_time_anomalies.map((anomaly, idx) => (
                  <AnomalyAlert key={`rt-${idx}`} anomaly={anomaly} type="response_time" />
                ))}
                {data.anomalies.error_rate_anomalies.map((anomaly, idx) => (
                  <AnomalyAlert key={`er-${idx}`} anomaly={anomaly} type="error_rate" />
                ))}
              </div>
            </div>
          )}

          {/* Forecasts Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                color: '#64748B',
              }}
            >
              Predictions &amp; Forecasts
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                style={{
                  background: 'linear-gradient(135deg, #1a2542 0%, #131e35 100%)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #1e2d4a',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                }}
              >
                <h3
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#94A3B8',
                    marginBottom: '16px',
                  }}
                >
                  Request Volume Forecast
                </h3>
                <ForecastChart
                  data={data.forecasts.requests.forecast}
                  type="requests"
                  confidence={data.forecasts.requests.confidence_score}
                />
              </div>
              <div
                style={{
                  background: 'linear-gradient(135deg, #1a2542 0%, #131e35 100%)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #1e2d4a',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                }}
              >
                <h3
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#94A3B8',
                    marginBottom: '16px',
                  }}
                >
                  Error Rate Forecast
                </h3>
                <ForecastChart
                  data={data.forecasts.error_rate.forecast}
                  type="error_rate"
                  confidence={data.forecasts.error_rate.confidence_score}
                />
              </div>
            </div>
          </div>

          {/* Churn Risk Section */}
          {data.churn_risk && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  color: '#64748B',
                }}
              >
                Churn Risk Analysis
              </h2>
              <div
                style={{
                  background: 'linear-gradient(135deg, #1a2542 0%, #131e35 100%)',
                  borderRadius: '12px',
                  padding: '28px',
                  border: '1px solid #1e2d4a',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                }}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#64748B', marginBottom: '8px' }}>High Risk Users</p>
                    <p style={{ fontSize: '2.25rem', fontWeight: 800, color: '#F87171', letterSpacing: '-0.02em', lineHeight: 1 }}>
                      {data.churn_risk.high_risk_count}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#64748B', marginBottom: '8px' }}>Medium Risk Users</p>
                    <p style={{ fontSize: '2.25rem', fontWeight: 800, color: '#FCD34D', letterSpacing: '-0.02em', lineHeight: 1 }}>
                      {data.churn_risk.medium_risk_count}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#64748B', marginBottom: '8px' }}>Total At Risk</p>
                    <p style={{ fontSize: '2.25rem', fontWeight: 800, color: '#FB923C', letterSpacing: '-0.02em', lineHeight: 1 }}>
                      {data.churn_risk.total_at_risk}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <p style={{ color: '#334155', fontSize: '12px' }}>
            Last updated: {new Date(data.generated_at).toLocaleString()}
          </p>
        </>
      )}
    </div>
  );
};

export default InsightsPage;
