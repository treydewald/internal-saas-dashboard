import React from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';

interface AnomalyAlertProps {
  anomaly: any;
  type: 'response_time' | 'error_rate' | 'traffic';
}

const AnomalyAlert: React.FC<AnomalyAlertProps> = ({ anomaly, type }) => {
  const getIcon = () => {
    return anomaly.confidence_score > 0.8 ? <AlertTriangle /> : <AlertCircle />;
  };

  const getColor = () => {
    if (anomaly.confidence_score > 0.8) return 'border-red-500 bg-red-500/10';
    if (anomaly.confidence_score > 0.6) return 'border-orange-500 bg-orange-500/10';
    return 'border-yellow-500 bg-yellow-500/10';
  };

  const renderDetails = () => {
    switch (type) {
      case 'response_time':
        return (
          <div className="space-y-2">
            <p className="text-gray-300">
              <span className="font-semibold">{anomaly.endpoint}</span> responded in{' '}
              <span className="font-bold text-red-400">{anomaly.response_time_ms}ms</span>
            </p>
            <p className="text-gray-400 text-sm">
              Z-Score: {anomaly.z_score} (deviation: {Math.round(anomaly.z_score * 100)}%)
            </p>
          </div>
        );
      case 'error_rate':
        return (
          <div className="space-y-2">
            <p className="text-gray-300">
              Error rate of <span className="font-bold text-orange-400">{anomaly.error_rate_pct}%</span> on{' '}
              <span className="font-semibold">{anomaly.date}</span>
            </p>
            <p className="text-gray-400 text-sm">
              {anomaly.errors} errors out of {anomaly.total_requests} requests
            </p>
          </div>
        );
      case 'traffic':
        return (
          <div className="space-y-2">
            <p className="text-gray-300">
              <span className="font-bold text-cyan-400">{anomaly.request_count}</span> requests on{' '}
              <span className="font-semibold">{anomaly.date}</span>
            </p>
            <p className="text-gray-400 text-sm">
              Expected: {anomaly.expected_count} requests (Z-Score: {anomaly.z_score})
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getColor()}`}>
      <div className="flex items-start gap-3">
        <div className="text-gray-300 mt-1 flex-shrink-0">{getIcon()}</div>
        <div className="flex-grow">
          {renderDetails()}
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <div className="bg-gray-700 rounded-full h-2 flex-grow">
                <div
                  className="bg-cyan-500 h-2 rounded-full"
                  style={{ width: `${anomaly.confidence_score * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">
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
