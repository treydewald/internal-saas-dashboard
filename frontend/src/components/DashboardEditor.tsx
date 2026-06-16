import { useState } from 'react';
import type { Widget } from './WidgetLibrary';
import { X, Save, Copy } from 'lucide-react';

export interface LayoutWidget extends Widget {
  position: number;
  gridColumn?: number;
  gridRow?: number;
}

interface DashboardEditorProps {
  widgets: LayoutWidget[];
  onRemoveWidget: (widgetId: string) => void;
  onSave: (layout: LayoutWidget[]) => void;
  isSaving?: boolean;
}

export const DashboardEditor = ({
  widgets,
  onRemoveWidget,
  onSave,
  isSaving = false,
}: DashboardEditorProps) => {
  const [draggedWidget, setDraggedWidget] = useState<LayoutWidget | null>(null);
  const [hoveredWidgetId, setHoveredWidgetId] = useState<string | null>(null);

  const handleDragStart = (widget: LayoutWidget) => {
    setDraggedWidget(widget);
  };

  const handleDragEnd = () => {
    setDraggedWidget(null);
  };

  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
          Dashboard Layout
        </h3>
        <button
          onClick={() => onSave(widgets)}
          disabled={isSaving}
          className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', opacity: isSaving ? 0.5 : 1 }}
        >
          <Save size={18} />
          {isSaving ? 'Saving...' : 'Save Dashboard'}
        </button>
      </div>

      {widgets.length === 0 ? (
        <div
          style={{
            border: '2px dashed var(--border-default)',
            borderRadius: 'var(--radius-card)',
            padding: '48px 32px',
            textAlign: 'center',
            color: 'var(--text-tertiary)',
            fontSize: '14px',
          }}
        >
          <p style={{ margin: 0 }}>Drag widgets here to build your dashboard</p>
        </div>
      ) : (
        <div
          className="card"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            minHeight: '384px',
          }}
        >
          {widgets.map((widget) => {
            const isDragging = draggedWidget?.id === widget.id;
            const isHovered = hoveredWidgetId === widget.id;
            return (
              <div
                key={widget.id}
                draggable
                onDragStart={() => handleDragStart(widget)}
                onDragEnd={handleDragEnd}
                onMouseEnter={() => setHoveredWidgetId(widget.id)}
                onMouseLeave={() => setHoveredWidgetId(null)}
                style={{
                  padding: '16px',
                  backgroundColor: 'var(--layer-1)',
                  borderRadius: 'var(--radius-card)',
                  border: `1px solid ${isHovered ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                  cursor: 'move',
                  position: 'relative',
                  opacity: isDragging ? 0.5 : 1,
                  transition: 'border-color var(--duration-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '24px' }}>{widget.icon}</span>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {widget.name}
                      </h4>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-tertiary)' }}>
                        {widget.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveWidget(widget.id)}
                    title="Remove widget"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '24px',
                      height: '24px',
                      padding: 0,
                      backgroundColor: 'var(--accent-error)',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      color: '#fff',
                      opacity: isHovered ? 1 : 0,
                      transition: 'opacity var(--duration-sm)',
                      flexShrink: 0,
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '8px' }}>
                  Size: <span style={{ textTransform: 'capitalize' }}>{widget.size}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="card" style={{ marginTop: '16px', padding: '12px 16px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-tertiary)', marginBottom: '8px', marginTop: 0 }}>
          Quick Actions
        </h4>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <Copy size={14} />
            Duplicate Layout
          </button>
        </div>
      </div>
    </div>
  );
};
