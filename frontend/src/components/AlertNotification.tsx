import React, { useEffect } from 'react';

interface AlertNotificationProps {
  alert: {
    id: number;
    message: string;
    status: string;
  };
  onClose: () => void;
  duration?: number;
}

export default function AlertNotification({ alert, onClose, duration = 5000 }: AlertNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getAlertStyles = () => {
    switch (alert.status) {
      case 'triggered':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-800 dark:text-red-100';
      case 'acknowledged':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-100';
      case 'resolved':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-800 dark:text-green-100';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100';
    }
  };

  const getIcon = () => {
    switch (alert.status) {
      case 'triggered':
        return '⚠️';
      case 'acknowledged':
        return '👁️';
      case 'resolved':
        return '✓';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-3 rounded-lg border flex items-start gap-3 max-w-sm animate-slideIn ${getAlertStyles()}`}
    >
      <span className="text-lg mt-0.5">{getIcon()}</span>
      <div className="flex-1">
        <p className="font-semibold text-sm">{alert.message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-lg opacity-60 hover:opacity-100 transition"
      >
        ✕
      </button>
    </div>
  );
}
