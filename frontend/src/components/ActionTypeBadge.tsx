import React from 'react';
import { StatusChip, type StatusState } from './StatusChip';

interface ActionTypeBadgeProps {
  actionType: string;
  label?: string;
}

const ACTION_STATE_MAP: Record<string, StatusState> = {
  'user.create': 'running',
  'user.update': 'running',
  'user.delete': 'error',
  'api_key.create': 'warning',
  'api_key.delete': 'error',
  'api_key.regenerate': 'warning',
  'org.create': 'running',
  'org.update': 'running',
  'org.delete': 'error',
  'system.backup': 'healthy',
  'system.restore': 'healthy',
};

export const ActionTypeBadge: React.FC<ActionTypeBadgeProps> = ({ actionType, label }) => {
  const state = ACTION_STATE_MAP[actionType] || 'pending';
  const displayLabel = label || actionType.replace('_', '.').toUpperCase();
  return <StatusChip state={state} label={displayLabel} size="sm" />;
};
