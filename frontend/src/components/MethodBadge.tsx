import React from 'react';
import { StatusChip, type StatusState } from './StatusChip';

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface MethodBadgeProps {
  method: HTTPMethod;
}

const METHOD_STATE_MAP: Record<HTTPMethod, StatusState> = {
  GET: 'healthy',
  POST: 'running',
  PATCH: 'warning',
  PUT: 'warning',
  DELETE: 'error',
};

export const MethodBadge: React.FC<MethodBadgeProps> = ({ method }) => {
  const state = METHOD_STATE_MAP[method] || 'healthy';
  return <StatusChip state={state} label={method} size="sm" />;
};
