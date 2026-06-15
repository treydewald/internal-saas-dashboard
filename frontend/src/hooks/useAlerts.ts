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

export function useAlerts() {
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
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
      setRules(response.data);
    } catch (error) {
      console.error('Failed to fetch alert rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('/api/alerts');
      setAlerts(response.data);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
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
