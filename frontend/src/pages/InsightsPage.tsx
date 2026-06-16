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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '3px solid var(--border-default)',
          borderTopColor: 'var(--accent-primary)',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      <div className="page-header">
        <h1>ML Insights</h1>
        <p>Anomaly detection, forecasts, and predictions for your API activity</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <p>{error}</p>
        </div>
      )}

      {data && (
        <>
          {/* Insights Summary Cards */}
          <InsightsCards data={data} />

          {/* Anomalies Section */}
          {data.anomalies.total_anomalies > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-tertiary)', margin: 0 }}>
                Detected Anomalies
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
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
            <h2 style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-tertiary)', margin: 0 }}>
              Predictions &amp; Forecasts
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
              <div className="card">
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>
                  Request Volume Forecast
                </h3>
                <ForecastChart
                  data={data.forecasts.requests.forecast}
                  type="requests"
                  confidence={data.forecasts.requests.confidence_score}
                />
              </div>
              <div className="card">
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>
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
