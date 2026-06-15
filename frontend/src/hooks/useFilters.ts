import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface FilterState {
  search: string;
  plan: string;
  status: string;
}

export const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    plan: searchParams.get('plan') || '',
    status: searchParams.get('status') || '',
  });

  const updateFilter = useCallback(
    (key: keyof FilterState, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ search: '', plan: '', status: '' });
  }, []);

  // Sync filters to URL
  useEffect(() => {
    const newParams = new URLSearchParams();

    if (filters.search) newParams.set('search', filters.search);
    if (filters.plan) newParams.set('plan', filters.plan);
    if (filters.status) newParams.set('status', filters.status);

    setSearchParams(newParams);
  }, [filters, setSearchParams]);

  return {
    filters,
    updateFilter,
    updateFilters,
    clearFilters,
  };
};
