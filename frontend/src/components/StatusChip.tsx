import React from 'react';
import styles from './StatusChip.module.css';

export type StatusState = 'healthy' | 'running' | 'degraded' | 'warning' | 'error' | 'off' | 'inactive' | 'pending';

interface StatusChipProps {
  state: StatusState;
  label?: string;
  pulse?: boolean;
  updatedAt?: string;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<StatusState, { color: string; bgColor: string; defaultLabel: string }> = {
  healthy: {
    color: 'var(--accent-success)',
    bgColor: 'var(--accent-success-dim)',
    defaultLabel: 'Healthy',
  },
  running: {
    color: 'var(--accent-primary)',
    bgColor: 'var(--accent-primary-dim)',
    defaultLabel: 'Running',
  },
  degraded: {
    color: 'var(--accent-warning)',
    bgColor: 'var(--accent-warning-dim)',
    defaultLabel: 'Degraded',
  },
  warning: {
    color: 'var(--accent-warning)',
    bgColor: 'var(--accent-warning-dim)',
    defaultLabel: 'Warning',
  },
  error: {
    color: 'var(--accent-error)',
    bgColor: 'var(--accent-error-dim)',
    defaultLabel: 'Error',
  },
  off: {
    color: 'var(--text-muted)',
    bgColor: 'rgba(148,163,184,0.08)',
    defaultLabel: 'Off',
  },
  inactive: {
    color: 'var(--text-muted)',
    bgColor: 'rgba(148,163,184,0.08)',
    defaultLabel: 'Inactive',
  },
  pending: {
    color: 'var(--accent-warning)',
    bgColor: 'var(--accent-warning-dim)',
    defaultLabel: 'Pending',
  },
};

export const StatusChip: React.FC<StatusChipProps> = ({
  state,
  label,
  pulse = false,
  updatedAt,
  size = 'md',
}) => {
  const config = STATUS_CONFIG[state];
  const displayLabel = label || config.defaultLabel;
  const shouldAnimate = pulse && (state === 'running' || state === 'healthy');

  const accentColorAtOpacity = `${config.color}33`;

  return (
    <span
      className={`${styles.chip} ${styles[`size--${size}`]} ${shouldAnimate ? styles.breathing : ''}`}
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
        borderColor: accentColorAtOpacity,
      }}
      title={updatedAt ? `Updated: ${updatedAt}` : undefined}
      role="status"
      aria-label={`${displayLabel}${updatedAt ? ` - ${updatedAt}` : ''}`}
    >
      {displayLabel}
    </span>
  );
};
