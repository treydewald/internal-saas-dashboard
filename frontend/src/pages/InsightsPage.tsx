import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
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
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/insights/dashboard');
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load insights');
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
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">ML Insights</h1>
        <p className="text-gray-400">
          Anomaly detection, forecasts, and predictions for your API activity
        </p>
      </div>

      {error && (
        <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {data && (
        <>
          {/* Insights Summary Cards */}
          <InsightsCards data={data} />

          {/* Anomalies Section */}
          {data.anomalies.total_anomalies > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100">Detected Anomalies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.anomalies.response_time_anomalies.map((anomaly, idx) => (
                  <AnomalyAlert
                    key={`rt-${idx}`}
                    anomaly={anomaly}
                    type="response_time"
                  />
                ))}
                {data.anomalies.error_rate_anomalies.map((anomaly, idx) => (
                  <AnomalyAlert
                    key={`er-${idx}`}
                    anomaly={anomaly}
                    type="error_rate"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Forecasts Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-100">Predictions & Forecasts</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">
                  Request Volume Forecast
                </h3>
                <ForecastChart
                  data={data.forecasts.requests.forecast}
                  type="requests"
                  confidence={data.forecasts.requests.confidence_score}
                />
              </div>
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">
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

          {/* Churn Risk Section (Admin Only) */}
          {data.churn_risk && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100">Churn Risk Analysis</h2>
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">High Risk Users</p>
                    <p className="text-3xl font-bold text-red-500">
                      {data.churn_risk.high_risk_count}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Medium Risk Users</p>
                    <p className="text-3xl font-bold text-yellow-500">
                      {data.churn_risk.medium_risk_count}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total At Risk</p>
                    <p className="text-3xl font-bold text-orange-500">
                      {data.churn_risk.total_at_risk}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="text-gray-500 text-sm">
            Last updated: {new Date(data.generated_at).toLocaleString()}
          </p>
        </>
      )}
    </div>
  );
};

export default InsightsPage;
