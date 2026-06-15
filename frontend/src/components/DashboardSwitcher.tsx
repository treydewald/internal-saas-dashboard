import React from 'react';
import { useDashboards, Dashboard } from '@/hooks/useDashboards';
import { ChevronDown, Plus } from 'lucide-react';

interface DashboardSwitcherProps {
  onSelectDashboard: (dashboard: Dashboard) => void;
  onOpenBuilder: () => void;
  currentDashboard?: Dashboard | null;
}

export const DashboardSwitcher: React.FC<DashboardSwitcherProps> = ({
  onSelectDashboard,
  onOpenBuilder,
  currentDashboard,
}) => {
  const { dashboards } = useDashboards();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
      >
        <span className="truncate max-w-xs">
          {currentDashboard?.name || 'Select Dashboard'}
        </span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
          <div className="max-h-96 overflow-y-auto">
            {dashboards.map((dashboard) => (
              <button
                key={dashboard.id}
                onClick={() => {
                  onSelectDashboard(dashboard);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-slate-700 transition border-b border-slate-700 last:border-0 ${
                  currentDashboard?.id === dashboard.id ? 'bg-cyan-600 bg-opacity-20' : ''
                }`}
              >
                <div className="font-medium text-white">{dashboard.name}</div>
                {dashboard.description && (
                  <div className="text-sm text-slate-400 truncate">{dashboard.description}</div>
                )}
                {dashboard.is_default && (
                  <div className="text-xs text-cyan-400 mt-1">Default</div>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              onOpenBuilder();
              setIsOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-cyan-400 hover:text-cyan-300 border-t border-slate-700 transition"
          >
            <Plus size={16} />
            New Dashboard
          </button>
        </div>
      )}
    </div>
  );
};
