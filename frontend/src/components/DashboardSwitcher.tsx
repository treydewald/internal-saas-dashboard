import React, { useRef, useEffect } from 'react';
import { useDashboards } from '@/hooks/useDashboards';
import type { Dashboard } from '@/hooks/useDashboards';
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-secondary"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>
          {currentDashboard?.name || 'Select Dashboard'}
        </span>
        <ChevronDown size={16} style={{ flexShrink: 0, color: 'var(--text-tertiary)' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            width: '256px',
            backgroundColor: 'var(--layer-2)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-card)',
            boxShadow: 'var(--shadow-card)',
            zIndex: 50,
            overflow: 'hidden',
          }}
        >
          <div style={{ maxHeight: '384px', overflowY: 'auto' }}>
            {dashboards.map((dashboard) => {
              const isSelected = currentDashboard?.id === dashboard.id;
              return (
                <button
                  key={dashboard.id}
                  onClick={() => {
                    onSelectDashboard(dashboard);
                    setIsOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    border: 'none',
                    borderBottom: '1px solid var(--border-subtle)',
                    backgroundColor: isSelected ? 'var(--accent-primary-dim)' : 'transparent',
                    color: 'var(--text-primary)',
                    display: 'block',
                    transition: 'background-color var(--duration-sm)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--layer-1)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{dashboard.name}</div>
                  {dashboard.description && (
                    <div
                      style={{
                        fontSize: '13px',
                        color: 'var(--text-tertiary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginTop: '2px',
                      }}
                    >
                      {dashboard.description}
                    </div>
                  )}
                  {dashboard.is_default && (
                    <div style={{ fontSize: '11px', color: 'var(--accent-primary)', marginTop: '4px' }}>
                      Default
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              onOpenBuilder();
              setIsOpen(false);
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 16px',
              fontSize: '14px',
              color: 'var(--accent-primary)',
              backgroundColor: 'transparent',
              border: 'none',
              borderTop: '1px solid var(--border-default)',
              cursor: 'pointer',
              transition: 'background-color var(--duration-sm)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--layer-1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <Plus size={16} />
            New Dashboard
          </button>
        </div>
      )}
    </div>
  );
};
