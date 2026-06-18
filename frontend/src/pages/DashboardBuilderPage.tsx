import { useState, useEffect } from 'react';
import { useDashboards } from '@/hooks/useDashboards';
import type { DashboardCreatePayload } from '@/hooks/useDashboards';
import { WidgetLibrary } from '@/components/WidgetLibrary';
import type { Widget } from '@/components/WidgetLibrary';
import { DashboardEditor } from '@/components/DashboardEditor';
import type { LayoutWidget } from '@/components/DashboardEditor';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardBuilderPageProps {
  dashboardId?: number;
  onClose?: () => void;
}

export const DashboardBuilderPage = ({ dashboardId, onClose }: DashboardBuilderPageProps) => {
  const navigate = useNavigate();
  const { fetchDashboard, updateDashboard, createDashboard } = useDashboards();
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

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }

    navigate(-1);
  };

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

      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save dashboard');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ flex: '0 0 auto', borderBottom: '1px solid var(--border-default)', padding: '20px 24px', backgroundColor: 'var(--bg-secondary)' }}>
        <button
          onClick={handleClose}
          className="btn-ghost"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '14px', padding: '6px 12px' }}
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
          {dashboardId ? 'Edit Dashboard' : 'Create New Dashboard'}
        </h1>
      </div>

      {/* Form */}
      <div style={{ flex: '1 1 0', minHeight: 0, display: 'flex', overflow: 'hidden', gap: '16px', padding: '16px 24px' }}>
        {/* Left Sidebar - Widget Library */}
        <div style={{ width: '260px', flexShrink: 0, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Widgets</h3>
          <div style={{ flex: '1 1 0', minHeight: 0, overflowY: 'auto' }}>
            <WidgetLibrary onAddWidget={handleAddWidget} />
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: '1 1 0', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Dashboard Settings */}
          <div className="card" style={{ marginBottom: '12px', flex: '0 0 auto' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' }}>
              Dashboard Settings
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label>Dashboard Name *</label>
                <input
                  type="text"
                  value={dashboardName}
                  onChange={(e) => setDashboardName(e.target.value)}
                  placeholder="e.g., Sales Overview"
                  style={{ fontSize: '13px' }}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={dashboardDescription}
                  onChange={(e) => setDashboardDescription(e.target.value)}
                  placeholder="Add a description (optional)"
                  rows={2}
                  style={{
                    backgroundColor: 'var(--layer-2)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-default)',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-input)',
                    fontFamily: 'inherit',
                    fontSize: '13px'
                  }}
                />
              </div>

              {error && <div className="alert alert-error"><p style={{ margin: 0, fontSize: '12px' }}>{error}</p></div>}
            </div>
          </div>

          {/* Dashboard Editor */}
          <div style={{ flex: '1 1 0', minHeight: 0, overflow: 'hidden' }}>
            <DashboardEditor
              widgets={widgets}
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
