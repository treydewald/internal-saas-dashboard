import React, { useEffect, useState, useCallback } from 'react';
import { KPICard } from './KPICard';
import { usePolling } from '../hooks/usePolling';
import { MOCK_KPIS } from '../data/mockDashboard';
import type { KPI } from '../types/dashboard';
import axios from 'axios';

interface KPIsResponse {
  kpis: KPI[];
}

interface KPICardsProps {
  dateFrom?: string;
  dateTo?: string;
}

export const KPICards: React.FC<KPICardsProps> = ({ dateFrom = '', dateTo = '' }) => {
  const [kpis, setKpis] = useState<KPI[]>(MOCK_KPIS);
  const [, setError] = useState<string | null>(null);

  const fetchKpis = useCallback(async () => {
    try {
      setError(null);
      const params = new URLSearchParams();
      if (dateFrom) params.append('date_from', dateFrom);
      if (dateTo) params.append('date_to', dateTo);
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await axios.get<KPIsResponse>(`/api/analytics/kpis${queryString}`);
      setKpis(response.data.kpis);
    } catch (err) {
      console.error('Failed to fetch KPIs:', err);
      setError('Failed to load KPI data');
      setKpis(MOCK_KPIS);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    fetchKpis();
  }, [dateFrom, dateTo, fetchKpis]);

  usePolling({
    intervalMs: 30000,
    onPoll: fetchKpis,
    enabled: true,
  });

  return (
    <div className="kpi-grid">
      {kpis.map((kpi, index) => (
        <KPICard
          key={kpi.id}
          label={kpi.label}
          value={kpi.value}
          delta={kpi.delta}
          trend={kpi.trend}
          sparkline={kpi.sparkline}
          context={kpi.context}
          updatedAt={kpi.updatedAt}
          accentIndex={index as 0 | 1 | 2 | 3}
        />
      ))}
    </div>
  );
};
