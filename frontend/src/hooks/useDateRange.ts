import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface DateRange {
  from: string;
  to: string;
}

export const useDateRange = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const from = searchParams.get('date_from');
    const to = searchParams.get('date_to');

    if (from && to) {
      return { from, to };
    }

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return {
      from: sevenDaysAgo.toISOString().split('T')[0],
      to: today.toISOString().split('T')[0],
    };
  });

  const updateDateRange = useCallback((from: string, to: string) => {
    setDateRange({ from, to });
  }, []);

  // Sync date range to URL
  useEffect(() => {
    const newParams = new URLSearchParams();

    if (dateRange.from) newParams.set('date_from', dateRange.from);
    if (dateRange.to) newParams.set('date_to', dateRange.to);

    setSearchParams(newParams);
  }, [dateRange, setSearchParams]);

  return {
    dateRange,
    updateDateRange,
  };
};
