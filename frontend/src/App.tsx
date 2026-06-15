import { useEffect, useState } from 'react';
import { Sidebar } from './components/screenshot/Sidebar';
import { KPICards } from './components/screenshot/KPICards';
import { WorkflowCanvas } from './components/screenshot/WorkflowCanvas';
import { LogStream } from './components/screenshot/LogStream';
import { ControlPanel } from './components/screenshot/ControlPanel';
import workflowData from './mock/workflows.json';
import logsData from './mock/logs.json';
import analyticsData from './mock/analytics.json';
import type { AnalyticsData, LogEntry, Workflow } from './types/dashboard';
import './App.css';

function App() {
  const [screenshotMode, setScreenshotMode] = useState(false);
  const [activeSection, setActiveSection] = useState('Overview');
  const [selectedWorkflowId, setSelectedWorkflowId] = useState((workflowData as Workflow[])[0]?.id ?? '');
  const [workflows, setWorkflows] = useState<Workflow[]>(workflowData as Workflow[]);
  const [logs, setLogs] = useState<LogEntry[]>(logsData as LogEntry[]);
  const [isRunning, setIsRunning] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [draftName, setDraftName] = useState('');

  const analytics = analyticsData as AnalyticsData;

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLogs(currentLogs => {
        const levels: LogEntry['level'][] = ['INFO', 'SUCCESS', 'WARN'];
        const messages = [
          'Step validated against policy rules',
          'Output table refreshed for screenshot profile',
          'Metrics window updated with latest stream',
          'Workflow checkpoint advanced to next stage',
        ];

        const newEntry: LogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          level: levels[Math.floor(Math.random() * levels.length)],
          source: 'runner',
          message: messages[Math.floor(Math.random() * messages.length)],
        };

        return [newEntry, ...currentLogs].slice(0, 18);
      });
    }, 1500);

    return () => window.clearInterval(interval);
  }, []);

  const runWorkflow = () => {
    setIsRunning(true);
    setWorkflows(current =>
      current.map(workflow => {
        if (workflow.id !== selectedWorkflowId) {
          return workflow;
        }
        return {
          ...workflow,
          steps: workflow.steps.map((step, index) => ({
            ...step,
            status: index === 1 ? 'RUNNING' : index < 1 ? 'SUCCESS' : 'IDLE',
          })),
        };
      }),
    );
  };

  const createWorkflow = () => {
    if (!draftName.trim()) {
      return;
    }

    const newWorkflow: Workflow = {
      id: `wf-${Date.now()}`,
      name: draftName.trim(),
      owner: 'new-owner',
      status: 'ACTIVE',
      schedule: 'Manual',
      steps: [
        { id: 'n-1', name: 'Source Intake', durationMs: 320, status: 'IDLE' },
        { id: 'n-2', name: 'Transform Records', durationMs: 360, status: 'IDLE' },
        { id: 'n-3', name: 'Publish Output', durationMs: 280, status: 'IDLE' },
      ],
    };

    setWorkflows(current => [newWorkflow, ...current]);
    setSelectedWorkflowId(newWorkflow.id);
    setDraftName('');
    setShowCreateModal(false);
  };

  const editWorkflow = () => {
    if (!draftName.trim()) {
      return;
    }

    setWorkflows(current =>
      current.map(workflow =>
        workflow.id === selectedWorkflowId ? { ...workflow, name: draftName.trim() } : workflow,
      ),
    );
    setDraftName('');
    setShowEditModal(false);
  };

  const selectedWorkflow = workflows.find(workflow => workflow.id === selectedWorkflowId);

  return (
    <div className={`dashboard-app${screenshotMode ? ' screenshot-mode' : ''}`}>
      <Sidebar active={activeSection} onSelect={setActiveSection} />

      <main className="main-layout">
        <header className="main-layout__header glass-panel">
          <div>
            <p className="eyebrow">SaaS Admin Dashboard</p>
            <h2>Internal Operations Console</h2>
          </div>
          <div className="status-group">
            <span className="status status--running">RUNNING</span>
            <span className="status status--healthy">HEALTHY</span>
            <button
              type="button"
              className={`screenshot-mode-btn${screenshotMode ? ' is-active' : ''}`}
              onClick={() => setScreenshotMode(m => !m)}
              title="Toggle screenshot presentation mode"
            >
              {screenshotMode ? '📷 ON' : '📷 OFF'}
            </button>
          </div>
        </header>

        <KPICards cards={analytics.kpis} />

        <ControlPanel
          onRun={runWorkflow}
          onCreate={() => {
            setDraftName('');
            setShowCreateModal(true);
          }}
          onEdit={() => {
            setDraftName(selectedWorkflow?.name ?? '');
            setShowEditModal(true);
          }}
          isRunning={isRunning}
        />

        <div className="workspace-grid">
          <WorkflowCanvas
            workflows={workflows}
            selectedWorkflowId={selectedWorkflowId}
            onSelectWorkflow={setSelectedWorkflowId}
            successSeries={analytics.successSeries}
            tableRows={analytics.tableRows}
          />
          <LogStream logs={logs} />
        </div>
      </main>

      {(showCreateModal || showEditModal) && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal glass-panel" role="dialog" aria-modal="true">
            <h3>{showCreateModal ? 'Create Workflow' : 'Edit Workflow'}</h3>
            <label htmlFor="workflow-name">Workflow Name</label>
            <input
              id="workflow-name"
              value={draftName}
              onChange={event => setDraftName(event.target.value)}
              placeholder="Enter workflow name"
            />
            <div className="modal-actions">
              <button
                className="btn btn--ghost"
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setDraftName('');
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn--primary"
                type="button"
                onClick={showCreateModal ? createWorkflow : editWorkflow}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
