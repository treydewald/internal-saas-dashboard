import React from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';

interface AnomalyAlertProps {
  anomaly: any;
  type: 'response_time' | 'error_rate' | 'traffic';
}

const getAlertStyle = (confidenceScore: number): React.CSSProperties => {
  if (confidenceScore > 0.8) {
    return {
      border: '1px solid rgba(220,38,38,0.4)',
      backgroundColor: 'rgba(220,38,38,0.08)',
      borderRadius: 'var(--radius-card)',
      padding: '16px',
    };
  }
  if (confidenceScore > 0.6) {
    return {
      border: '1px solid rgba(234,88,12,0.4)',
      backgroundColor: 'rgba(234,88,12,0.08)',
      borderRadius: 'var(--radius-card)',
      padding: '16px',
    };
  }
  return {
    border: '1px solid rgba(234,179,8,0.4)',
    backgroundColor: 'rgba(234,179,8,0.08)',
    borderRadius: 'var(--radius-card)',
    padding: '16px',
  };
};

const AnomalyAlert: React.FC<AnomalyAlertProps> = ({ anomaly, type }) => {
  const iconSize = 18;
  const icon = anomaly.confidence_score > 0.8
    ? <AlertTriangle size={iconSize} style={{ color: 'var(--accent-error)' }} />
    : <AlertCircle size={iconSize} style={{ color: 'var(--accent-warning)' }} />;

  const renderDetails = () => {
    switch (type) {
      case 'response_time':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
              <span style={{ fontWeight: 600 }}>{anomaly.endpoint}</span> responded in{' '}
              <span style={{ fontWeight: 700, color: 'var(--accent-error)' }}>{anomaly.response_time_ms}ms</span>
            </p>
            <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '13px' }}>
              Z-Score: {anomaly.z_score} (deviation: {Math.round(anomaly.z_score * 100)}%)
            </p>
          </div>
        );
      case 'error_rate':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
              Error rate of{' '}
              <span style={{ fontWeight: 700, color: 'var(--accent-warning)' }}>{anomaly.error_rate_pct}%</span> on{' '}
              <span style={{ fontWeight: 600 }}>{anomaly.date}</span>
            </p>
            <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '13px' }}>
              {anomaly.errors} errors out of {anomaly.total_requests} requests
            </p>
          </div>
        );
      case 'traffic':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
              <span style={{ fontWeight: 700, color: 'var(--accent-info)' }}>{anomaly.request_count}</span> requests on{' '}
              <span style={{ fontWeight: 600 }}>{anomaly.date}</span>
            </p>
            <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '13px' }}>
              Expected: {anomaly.expected_count} requests (Z-Score: {anomaly.z_score})
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={getAlertStyle(anomaly.confidence_score)}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ flexShrink: 0, marginTop: '2px' }}>{icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {renderDetails()}
          <div style={{ marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  flex: 1,
                  height: '6px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--border-default)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${anomaly.confidence_score * 100}%`,
                    height: '100%',
                    borderRadius: '999px',
                    backgroundColor: 'var(--accent-info)',
                  }}
                />
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                {Math.round(anomaly.confidence_score * 100)}% confidence
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnomalyAlert;
