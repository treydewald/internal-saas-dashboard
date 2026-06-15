import { useEffect, useCallback, useRef, useState } from 'react';

interface UsePollingOptions {
  intervalMs?: number;
  onPoll?: () => Promise<void>;
  enabled?: boolean;
}

export const usePolling = ({
  intervalMs = 30000,
  onPoll,
  enabled = true,
}: UsePollingOptions) => {
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPollingRef = useRef(false);

  const startPolling = useCallback(async () => {
    if (!enabled || !onPoll) return;

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Initial poll
    try {
      setIsPolling(true);
      await onPoll();
    } finally {
      setIsPolling(false);
    }

    // Set up interval
    intervalRef.current = setInterval(async () => {
      if (!isPollingRef.current && onPoll) {
        try {
          isPollingRef.current = true;
          setIsPolling(true);
          await onPoll();
        } finally {
          isPollingRef.current = false;
          setIsPolling(false);
        }
      }
    }, intervalMs);
  }, [enabled, onPoll, intervalMs]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (enabled && onPoll) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [enabled, onPoll, startPolling, stopPolling]);

  return {
    isPolling,
    startPolling,
    stopPolling,
  };
};
