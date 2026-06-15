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
    <div className="bg-gray-800 border border-slate-700 rounded-lg p-4 space-y-4">
      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        {onSearch && (
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-300 mb-2">Search</label>
            <SearchBar
              placeholder="Search by name or email..."
              onSearch={onSearch}
              debounceMs={300}
            />
          </div>
        )}

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Plan Filter */}
          {showPlan && onPlanChange && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Plan</label>
              <select
                value={planValue}
                onChange={(e) => onPlanChange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
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
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
              <select
                value={statusValue}
                onChange={(e) => onStatusChange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
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
          <button
            onClick={handleClearAll}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};
