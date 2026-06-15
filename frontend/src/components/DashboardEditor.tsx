import React, { useState } from 'react';
import type { Widget } from './WidgetLibrary';
import { X, Save, Copy } from 'lucide-react';

export interface LayoutWidget extends Widget {
  position: number;
  gridColumn?: number;
  gridRow?: number;
}

interface DashboardEditorProps {
  widgets: LayoutWidget[];
  onAddWidget: (widget: LayoutWidget) => void;
  onRemoveWidget: (widgetId: string) => void;
  onSave: (layout: LayoutWidget[]) => void;
  isSaving?: boolean;
}

export const DashboardEditor: React.FC<DashboardEditorProps> = ({
  widgets,
  onAddWidget,
  onRemoveWidget,
  onSave,
  isSaving = false,
}) => {
  const [draggedWidget, setDraggedWidget] = useState<LayoutWidget | null>(null);

  const handleDragStart = (widget: LayoutWidget) => {
    setDraggedWidget(widget);
  };

  const handleDragEnd = () => {
    setDraggedWidget(null);
  };

  const handleRemoveWidget = (widgetId: string) => {
    onRemoveWidget(widgetId);
  };

  return (
    <div className="flex-1">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Dashboard Layout</h3>
        <button
          onClick={() => onSave(widgets)}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white rounded-lg transition"
        >
          <Save size={18} />
          {isSaving ? 'Saving...' : 'Save Dashboard'}
        </button>
      </div>

      {widgets.length === 0 ? (
        <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center text-slate-400">
          <p>Drag widgets here to build your dashboard</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-slate-800 rounded-lg border border-slate-700 min-h-96">
          {widgets.map((widget) => (
            <div
              key={widget.id}
              draggable
              onDragStart={() => handleDragStart(widget)}
              onDragEnd={handleDragEnd}
              className={`p-4 bg-slate-700 rounded-lg border border-slate-600 cursor-move hover:border-cyan-500 transition relative group ${
                draggedWidget?.id === widget.id ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{widget.icon}</span>
                  <div>
                    <h4 className="font-medium text-white">{widget.name}</h4>
                    <p className="text-xs text-slate-400">{widget.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveWidget(widget.id)}
                  className="p-1 bg-red-600 hover:bg-red-700 text-white rounded opacity-0 group-hover:opacity-100 transition"
                  title="Remove widget"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="text-xs text-slate-400 mt-2">
                Size: <span className="capitalize">{widget.size}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-slate-800 rounded-lg border border-slate-700">
        <h4 className="text-sm font-medium text-slate-400 mb-2">Quick Actions</h4>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded transition">
            <Copy size={14} />
            Duplicate Layout
          </button>
        </div>
      </div>
    </div>
  );
};
