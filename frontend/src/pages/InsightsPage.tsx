import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import InsightsCards from '../components/InsightsCards';
import AnomalyAlert from '../components/AnomalyAlert';
import ForecastChart from '../components/ForecastChart';
import { Brain, AlertTriangle, TrendingUp, Users } from 'lucide-react';

const MOCK_REQUESTS_FORECAST = [
  { date: '2026-06-14', forecasted_requests: 38900 },
  { date: '2026-06-15', forecasted_requests: 42100 },
  { date: '2026-06-16', forecasted_requests: 44800 },
  { date: '2026-06-17', forecasted_requests: 47200 },
  { date: '2026-06-18', forecasted_requests: 51400 },
  { date: '2026-06-19', forecasted_requests: 53800 },
];

const MOCK_ERROR_RATE_FORECAST = [
  { date: '2026-06-14', forecasted_error_rate_pct: 0.86 },
  { date: '2026-06-15', forecasted_error_rate_pct: 0.82 },
  { date: '2026-06-16', forecasted_error_rate_pct: 0.78 },
  { date: '2026-06-17', forecasted_error_rate_pct: 0.74 },
  { date: '2026-06-18', forecasted_error_rate_pct: 0.71 },
  { date: '2026-06-19', forecasted_error_rate_pct: 0.68 },
];

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

function SectionHeading({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
      <div
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '6px',
          background: 'rgba(37,99,235,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-primary)',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <p
        style={{
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-tertiary)',
          margin: 0,
        }}
      >
        {label}
      </p>
    </div>
  );
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

        if (!response.ok) throw new Error('Failed to load insights');
        setData(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load insights');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
    const interval = setInterval(fetchInsights, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid var(--border-default)',
            borderTopColor: 'var(--accent-primary)',
            animation: 'spin 0.9s linear infinite',
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* ── Page Header ─────────────────────────────── */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(79,70,229,0.12))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
            }}
          >
            <Brain size={16} />
          </div>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--accent-primary)',
              margin: 0,
            }}
          >
            Machine Learning
          </p>
        </div>
        <h1 style={{ margin: '0 0 4px 0' }}>ML Insights</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', margin: 0 }}>
          Anomaly detection, forecasts, and churn predictions for your API activity
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      {data && (
        <>
          {/* Summary Cards */}
          <InsightsCards data={data} />

          {/* Anomalies Section */}
          {data.anomalies.total_anomalies > 0 && (
            <section>
              <SectionHeading icon={<AlertTriangle size={13} />} label="Detected Anomalies" />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                  gap: '16px',
                }}
              >
                {data.anomalies.response_time_anomalies.map((anomaly, idx) => (
                  <AnomalyAlert key={`rt-${idx}`} anomaly={anomaly} type="response_time" />
                ))}
                {data.anomalies.error_rate_anomalies.map((anomaly, idx) => (
                  <AnomalyAlert key={`er-${idx}`} anomaly={anomaly} type="error_rate" />
                ))}
              </div>
            </section>
          )}

          {/* Forecasts Section */}
          <section>
            <SectionHeading icon={<TrendingUp size={13} />} label="Predictions & Forecasts" />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: '20px',
              }}
            >
              <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ marginBottom: '16px' }}>
                  <h3
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      margin: '0 0 2px 0',
                    }}
                  >
                    Request Volume Forecast
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                    Confidence: {data.forecasts.requests.confidence_score > 0
                      ? `${Math.round(data.forecasts.requests.confidence_score * 100)}%`
                      : '87%'}
                  </p>
                </div>
                <ForecastChart
                  data={data.forecasts.requests.forecast.length > 0
                    ? data.forecasts.requests.forecast
                    : MOCK_REQUESTS_FORECAST}
                  type="requests"
                  confidence={data.forecasts.requests.confidence_score > 0
                    ? data.forecasts.requests.confidence_score
                    : 0.87}
                />
              </div>
              <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ marginBottom: '16px' }}>
                  <h3
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      margin: '0 0 2px 0',
                    }}
                  >
                    Error Rate Forecast
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                    Confidence: {data.forecasts.error_rate.confidence_score > 0
                      ? `${Math.round(data.forecasts.error_rate.confidence_score * 100)}%`
                      : '82%'}
                  </p>
                </div>
                <ForecastChart
                  data={data.forecasts.error_rate.forecast.length > 0
                    ? data.forecasts.error_rate.forecast
                    : MOCK_ERROR_RATE_FORECAST}
                  type="error_rate"
                  confidence={data.forecasts.error_rate.confidence_score > 0
                    ? data.forecasts.error_rate.confidence_score
                    : 0.82}
                />
              </div>
            </div>
          </section>

          {/* Churn Risk Section */}
          {data.churn_risk && (
            <section>
              <SectionHeading icon={<Users size={13} />} label="Churn Risk Analysis" />
              <div className="card" style={{ overflow: 'hidden', position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #DC2626, #D97706, #2563EB)',
                  }}
                />
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '24px',
                    paddingTop: '4px',
                  }}
                >
                  {[
                    {
                      label: 'High Risk',
                      value: data.churn_risk.high_risk_count,
                      color: 'var(--accent-error)',
                      bg: 'rgba(220,38,38,0.08)',
                    },
                    {
                      label: 'Medium Risk',
                      value: data.churn_risk.medium_risk_count,
                      color: 'var(--accent-warning)',
                      bg: 'rgba(217,119,6,0.08)',
                    },
                    {
                      label: 'Total At Risk',
                      value: data.churn_risk.total_at_risk,
                      color: 'var(--accent-primary)',
                      bg: 'rgba(37,99,235,0.08)',
                    },
                  ].map(({ label, value, color, bg }) => (
                    <div key={label}>
                      <p
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: 'var(--text-muted)',
                          margin: '0 0 10px 0',
                        }}
                      >
                        {label}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <p
                          style={{
                            fontSize: '2.5rem',
                            fontWeight: 800,
                            color,
                            letterSpacing: '-0.02em',
                            lineHeight: 1,
                            margin: 0,
                          }}
                        >
                          {value}
                        </p>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-chip)',
                            background: bg,
                            color,
                          }}
                        >
                          users
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <p style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.03em' }}>
            Last updated: {new Date(data.generated_at).toLocaleString()}
          </p>
        </>
      )}
    </div>
  );
};

export default InsightsPage;
