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
  { id: 'kpi-cards', name: 'KPI Cards', description: 'Display key metrics like Active Users, Revenue, etc.', category: 'kpi', icon: '📊', size: 'large' },
  { id: 'api-activity-chart', name: 'API Activity Chart', description: 'Line chart showing API request volume over time', category: 'chart', icon: '📈', size: 'large' },
  { id: 'users-table', name: 'Users Table', description: 'List of users with filtering and sorting', category: 'table', icon: '👥', size: 'large' },
  { id: 'api-logs-table', name: 'API Logs Table', description: 'API request logs with status and response times', category: 'table', icon: '📝', size: 'large' },
  { id: 'filter-bar', name: 'Filter Bar', description: 'Advanced filters for data tables', category: 'filter', icon: '🔍', size: 'small' },
  { id: 'date-range-picker', name: 'Date Range Picker', description: 'Select custom date ranges for filtering', category: 'filter', icon: '📅', size: 'small' },
  { id: 'metrics-cards', name: 'Metrics Cards', description: 'Display derived metrics like growth, churn rate', category: 'kpi', icon: '💹', size: 'medium' },
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
    <div style={{ width: '100%', maxWidth: '400px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
          Available Widgets
        </h3>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          {[null, ...categories].map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat ?? 'all'}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  border: isActive ? 'none' : '1px solid var(--border-default)',
                  backgroundColor: isActive ? 'var(--accent-primary)' : 'var(--layer-1)',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all var(--duration-sm)',
                }}
              >
                {cat ?? 'All'}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '384px', overflowY: 'auto' }}>
        {filteredWidgets.map((widget) => (
          <div
            key={widget.id}
            onClick={() => onAddWidget(widget)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onAddWidget(widget)}
            style={{
              padding: '12px',
              backgroundColor: 'var(--layer-1)',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--border-default)',
              cursor: 'pointer',
              transition: 'border-color var(--duration-sm)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent-primary)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-default)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '20px' }}>{widget.icon}</span>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {widget.name}
                  </h4>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-tertiary)' }}>
                  {widget.description}
                </p>
              </div>
              <Plus size={18} style={{ color: 'var(--text-tertiary)', flexShrink: 0, marginLeft: '8px' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WidgetLibrary;
