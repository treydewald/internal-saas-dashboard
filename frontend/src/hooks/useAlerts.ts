import { useState, useEffect } from 'react';
import axios from 'axios';

interface AlertRule {
  id: number;
  name: string;
  metric_name: string;
  operator: string;
  threshold: number;
  enabled: boolean;
  notification_channels: string[];
  created_at: string;
  updated_at: string;
}

interface Alert {
  id: number;
  alert_rule_id: number;
  status: string;
  metric_value: number;
  message: string;
  created_at: string;
  acknowledged_at?: string;
  resolved_at?: string;
}

const MOCK_RULES: AlertRule[] = [
  { id: 1, name: 'High P95 Latency', metric_name: 'p95_latency_ms', operator: '>', threshold: 500, enabled: true, notification_channels: ['email', 'slack'], created_at: '2026-05-10T08:00:00Z', updated_at: '2026-05-10T08:00:00Z' },
  { id: 2, name: 'Elevated Error Rate', metric_name: 'error_rate_pct', operator: '>', threshold: 5, enabled: true, notification_channels: ['email'], created_at: '2026-05-15T10:30:00Z', updated_at: '2026-05-15T10:30:00Z' },
  { id: 3, name: 'Low Cache Hit Rate', metric_name: 'cache_hit_rate_pct', operator: '<', threshold: 70, enabled: true, notification_channels: ['slack'], created_at: '2026-06-01T14:00:00Z', updated_at: '2026-06-01T14:00:00Z' },
  { id: 4, name: 'CPU Spike Guard', metric_name: 'cpu_usage_pct', operator: '>', threshold: 85, enabled: false, notification_channels: ['email'], created_at: '2026-06-08T09:00:00Z', updated_at: '2026-06-12T11:00:00Z' },
];

const MOCK_ALERTS: Alert[] = [
  { id: 1, alert_rule_id: 1, status: 'resolved', metric_value: 612.4, message: 'P95 latency exceeded 500ms threshold (612.4ms)', created_at: '2026-06-14T02:17:00Z', resolved_at: '2026-06-14T02:45:00Z' },
  { id: 2, alert_rule_id: 2, status: 'resolved', metric_value: 6.8, message: 'Error rate exceeded 5% threshold (6.8%)', created_at: '2026-06-14T09:33:00Z', acknowledged_at: '2026-06-14T09:40:00Z', resolved_at: '2026-06-14T10:12:00Z' },
  { id: 3, alert_rule_id: 3, status: 'acknowledged', metric_value: 64.3, message: 'Cache hit rate dropped below 70% (64.3%)', created_at: '2026-06-15T16:04:00Z', acknowledged_at: '2026-06-15T16:10:00Z' },
  { id: 4, alert_rule_id: 1, status: 'resolved', metric_value: 543.1, message: 'P95 latency exceeded 500ms threshold (543.1ms)', created_at: '2026-06-15T23:58:00Z', resolved_at: '2026-06-16T00:22:00Z' },
  { id: 5, alert_rule_id: 2, status: 'triggered', metric_value: 5.3, message: 'Error rate exceeded 5% threshold (5.3%)', created_at: '2026-06-16T07:41:00Z' },
];

export function useAlerts() {
  const [rules, setRules] = useState<AlertRule[]>(MOCK_RULES);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [loading, setLoading] = useState(false);

  // Fetch rules and alerts on mount
  useEffect(() => {
    fetchRules();
    fetchAlerts();

    // Poll for alerts every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/alerts/rules');
      if (response.data && response.data.length > 0) setRules(response.data);
    } catch (error) {
      // keep mock data
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('/api/alerts');
      if (response.data && response.data.length > 0) setAlerts(response.data);
    } catch (error) {
      // keep mock data
    }
  };

  const createRule = async (ruleData: {
    name: string;
    metric_name: string;
    operator: string;
    threshold: number;
  }) => {
    try {
      const response = await axios.post('/api/alerts/rules', ruleData);
      setRules([...rules, response.data]);
      return response.data;
    } catch (error) {
      console.error('Failed to create alert rule:', error);
      throw error;
    }
  };

  const updateRule = async (ruleId: number, updates: Partial<AlertRule>) => {
    try {
      const response = await axios.put(`/api/alerts/rules/${ruleId}`, updates);
      setRules(rules.map((r) => (r.id === ruleId ? response.data : r)));
      return response.data;
    } catch (error) {
      console.error('Failed to update alert rule:', error);
      throw error;
    }
  };

  const deleteRule = async (ruleId: number) => {
    try {
      await axios.delete(`/api/alerts/rules/${ruleId}`);
      setRules(rules.filter((r) => r.id !== ruleId));
    } catch (error) {
      console.error('Failed to delete alert rule:', error);
      throw error;
    }
  };

  const acknowledgeAlert = async (alertId: number) => {
    try {
      const response = await axios.post(`/api/alerts/${alertId}/acknowledge`);
      setAlerts(
        alerts.map((a) => (a.id === alertId ? { ...a, status: 'acknowledged' } : a))
      );
      return response.data;
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
      throw error;
    }
  };

  const resolveAlert = async (alertId: number) => {
    try {
      const response = await axios.post(`/api/alerts/${alertId}/resolve`);
      setAlerts(
        alerts.map((a) => (a.id === alertId ? { ...a, status: 'resolved' } : a))
      );
      return response.data;
    } catch (error) {
      console.error('Failed to resolve alert:', error);
      throw error;
    }
  };

  return {
    rules,
    alerts,
    loading,
    fetchRules,
    fetchAlerts,
    createRule,
    updateRule,
    deleteRule,
    acknowledgeAlert,
    resolveAlert,
  };
}
