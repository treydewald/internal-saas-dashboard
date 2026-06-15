import React, { useState, useEffect } from 'react';
import { useDashboards, Dashboard, DashboardCreatePayload } from '@/hooks/useDashboards';
import { WidgetLibrary, Widget } from '@/components/WidgetLibrary';
import { DashboardEditor, LayoutWidget } from '@/components/DashboardEditor';
import { ArrowLeft } from 'lucide-react';

interface DashboardBuilderPageProps {
  dashboardId?: number;
  onClose: () => void;
}

export const DashboardBuilderPage: React.FC<DashboardBuilderPageProps> = ({
  dashboardId,
  onClose,
}) => {
  const { fetchDashboard, updateDashboard, createDashboard, loading } = useDashboards();
  const [dashboardName, setDashboardName] = useState('');
  const [dashboardDescription, setDashboardDescription] = useState('');
  const [widgets, setWidgets] = useState<LayoutWidget[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (dashboardId) {
      loadDashboard();
    }
  }, [dashboardId]);

  const loadDashboard = async () => {
    if (!dashboardId) return;
    try {
      const dashboard = await fetchDashboard(dashboardId);
      if (dashboard) {
        setDashboardName(dashboard.name);
        setDashboardDescription(dashboard.description || '');
        try {
          const layout = JSON.parse(dashboard.layout);
          setWidgets(layout);
        } catch (e) {
          setWidgets([]);
        }
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddWidget = (widget: Widget) => {
    const newWidget: LayoutWidget = {
      ...widget,
      position: widgets.length,
    };
    setWidgets([...widgets, newWidget]);
  };

  const handleRemoveWidget = (widgetId: string) => {
    setWidgets(widgets.filter((w) => w.id !== widgetId));
  };

  const handleSave = async (layout: LayoutWidget[]) => {
    if (!dashboardName.trim()) {
      setError('Dashboard name is required');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload: DashboardCreatePayload = {
        name: dashboardName,
        description: dashboardDescription || undefined,
        layout: JSON.stringify(layout),
      };

      if (dashboardId) {
        await updateDashboard(dashboardId, payload);
      } else {
        await createDashboard(payload);
      }

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save dashboard');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700 p-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 mb-4 text-slate-400 hover:text-white transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="text-3xl font-bold">
          {dashboardId ? 'Edit Dashboard' : 'Create New Dashboard'}
        </h1>
      </div>

      {/* Form */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Widget Library */}
          <div className="lg:col-span-1">
            <WidgetLibrary onAddWidget={handleAddWidget} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Dashboard Settings */}
            <div className="mb-8 p-6 bg-slate-800 rounded-lg border border-slate-700">
              <h2 className="text-xl font-semibold mb-4">Dashboard Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Dashboard Name *
                  </label>
                  <input
                    type="text"
                    value={dashboardName}
                    onChange={(e) => setDashboardName(e.target.value)}
                    placeholder="e.g., Sales Overview"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={dashboardDescription}
                    onChange={(e) => setDashboardDescription(e.target.value)}
                    placeholder="Add a description (optional)"
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {error && <div className="p-3 bg-red-600 bg-opacity-20 border border-red-600 rounded text-red-200 text-sm">{error}</div>}
              </div>
            </div>

            {/* Dashboard Editor */}
            <DashboardEditor
              widgets={widgets}
              onAddWidget={handleAddWidget}
              onRemoveWidget={handleRemoveWidget}
              onSave={handleSave}
              isSaving={isSaving}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBuilderPage;
