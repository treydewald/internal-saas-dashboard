import React from 'react';
import { Plus } from 'lucide-react';

export interface Widget {
  id: string;
  name: string;
  description: string;
  category: 'kpi' | 'chart' | 'table' | 'filter';
  icon: string;
  size: 'small' | 'medium' | 'large';
}

const AVAILABLE_WIDGETS: Widget[] = [
  {
    id: 'kpi-cards',
    name: 'KPI Cards',
    description: 'Display key metrics like Active Users, Revenue, etc.',
    category: 'kpi',
    icon: '📊',
    size: 'large',
  },
  {
    id: 'api-activity-chart',
    name: 'API Activity Chart',
    description: 'Line chart showing API request volume over time',
    category: 'chart',
    icon: '📈',
    size: 'large',
  },
  {
    id: 'users-table',
    name: 'Users Table',
    description: 'List of users with filtering and sorting',
    category: 'table',
    icon: '👥',
    size: 'large',
  },
  {
    id: 'api-logs-table',
    name: 'API Logs Table',
    description: 'API request logs with status and response times',
    category: 'table',
    icon: '📝',
    size: 'large',
  },
  {
    id: 'filter-bar',
    name: 'Filter Bar',
    description: 'Advanced filters for data tables',
    category: 'filter',
    icon: '🔍',
    size: 'small',
  },
  {
    id: 'date-range-picker',
    name: 'Date Range Picker',
    description: 'Select custom date ranges for filtering',
    category: 'filter',
    icon: '📅',
    size: 'small',
  },
  {
    id: 'metrics-cards',
    name: 'Metrics Cards',
    description: 'Display derived metrics like growth, churn rate',
    category: 'kpi',
    icon: '💹',
    size: 'medium',
  },
];

interface WidgetLibraryProps {
  onAddWidget: (widget: Widget) => void;
}

export const WidgetLibrary: React.FC<WidgetLibraryProps> = ({ onAddWidget }) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const categories = Array.from(new Set(AVAILABLE_WIDGETS.map((w) => w.category)));
  const filteredWidgets = selectedCategory
    ? AVAILABLE_WIDGETS.filter((w) => w.category === selectedCategory)
    : AVAILABLE_WIDGETS;

  return (
    <div className="w-full max-w-md">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-3">Available Widgets</h3>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-full text-sm transition ${
              selectedCategory === null
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm transition capitalize ${
                selectedCategory === category
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredWidgets.map((widget) => (
          <div
            key={widget.id}
            className="p-3 bg-slate-700 rounded-lg border border-slate-600 hover:border-cyan-500 transition cursor-pointer group"
            onClick={() => onAddWidget(widget)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{widget.icon}</span>
                  <h4 className="font-medium text-white group-hover:text-cyan-400 transition">
                    {widget.name}
                  </h4>
                </div>
                <p className="text-xs text-slate-400">{widget.description}</p>
              </div>
              <Plus
                size={18}
                className="text-slate-400 group-hover:text-cyan-400 transition flex-shrink-0"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WidgetLibrary;
