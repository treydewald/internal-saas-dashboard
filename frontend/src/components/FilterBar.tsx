import React, { useCallback } from 'react';
import { SearchBar } from './SearchBar';

interface FilterBarProps {
  onSearch?: (searchTerm: string) => void;
  onPlanChange?: (plan: string) => void;
  onStatusChange?: (status: string) => void;
  onClearFilters?: () => void;
  searchValue?: string;
  planValue?: string;
  statusValue?: string;
  plans?: string[];
  statuses?: string[];
  showPlan?: boolean;
  showStatus?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onSearch,
  onPlanChange,
  onStatusChange,
  onClearFilters,
  searchValue = '',
  planValue = '',
  statusValue = '',
  plans = ['free', 'pro', 'enterprise'],
  statuses = ['active', 'inactive'],
  showPlan = true,
  showStatus = true,
}) => {
  const handleClearAll = useCallback(() => {
    onClearFilters?.();
  }, [onClearFilters]);

  const hasActiveFilters = searchValue || planValue || statusValue;

  return (
    <div
      style={{
        backgroundColor: 'var(--layer-2)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-card)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Search Bar */}
      {onSearch && (
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--text-tertiary)',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Search
          </label>
          <SearchBar
            placeholder="Search by name or email..."
            onSearch={onSearch}
            debounceMs={300}
          />
        </div>
      )}

      {/* Filter Controls */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
        }}
      >
        {/* Plan Filter */}
        {showPlan && onPlanChange && (
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Plan</label>
            <select
              value={planValue}
              onChange={(e) => onPlanChange(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">All Plans</option>
              {plans.map((plan) => (
                <option key={plan} value={plan}>
                  {plan.charAt(0).toUpperCase() + plan.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status Filter */}
        {showStatus && onStatusChange && (
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Status</label>
            <select
              value={statusValue}
              onChange={(e) => onStatusChange(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && onClearFilters && (
        <div>
          <button onClick={handleClearAll} className="btn-secondary" style={{ fontSize: '13px', padding: '6px 12px' }}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
