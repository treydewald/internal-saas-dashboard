import React, { useState } from 'react';
import { WorkflowProvider, useWorkflow } from '../context/WorkflowContext';
import { KPICards } from '../components/KPICards';
import { WorkflowList } from '../components/WorkflowList';
import { MOCK_WORKFLOWS, MOCK_SUCCESS_SERIES, MOCK_TABLE_ROWS } from '../data/mockDashboard';
import { WorkflowCanvas } from '../components/screenshot/WorkflowCanvas';
import { LogStream } from '../components/screenshot/LogStream';

interface CreateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
}

function CreateWorkflowModal({ isOpen, onClose, onCreate }: CreateWorkflowModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onCreate(name, description);
      setName('');
      setDescription('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal glass-panel">
        <h3>Create Workflow</h3>
        <label>Workflow Name</label>
        <input
          type="text"
          placeholder="e.g., Daily Data Sync"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Description</label>
        <input
          type="text"
          placeholder="What does this workflow do?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

function WorkflowPageContent() {
  const { selectedWorkflowId, setSelectedWorkflowId, executionState, isRunning, logEntries, run } = useWorkflow();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const selectedWorkflow = MOCK_WORKFLOWS.find((wf) => wf.id === selectedWorkflowId) || MOCK_WORKFLOWS[0];

  const handleCreate = (name: string, description: string) => {
    console.log('Create workflow:', name, description);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: '0 0 auto' }}>
        <div className="control-panel">
          <div className="control-panel__info">
            <p className="eyebrow">Orchestration Engine</p>
            <h2>{selectedWorkflow.name}</h2>
            <div className="control-panel__sub">
              {executionState === 'idle' && 'Ready to run'}
              {executionState === 'queued' && 'Preparing execution...'}
              {executionState === 'running' && 'Workflow in progress...'}
              {executionState === 'success' && 'Completed successfully'}
            </div>
          </div>
          <div className="control-panel__buttons">
            <button
              className={`btn btn--primary ${isRunning || executionState === 'success' ? 'btn--active' : ''}`}
              onClick={run}
              disabled={isRunning}
            >
              {isRunning ? 'Running...' : executionState === 'success' ? 'Run Again' : 'Run Workflow'}
            </button>
            <button className="btn btn--ghost" onClick={() => setCreateModalOpen(true)}>
              Create
            </button>
            <button className="btn btn--ghost">Edit</button>
          </div>
        </div>
      </div>

      <div style={{ flex: '0 0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', padding: '0 0 12px 0' }} className="kpi-grid">
        <KPICards />
      </div>

      <div style={{ flex: '1 1 0', minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 360px', gap: '16px', overflow: 'hidden' }} className="workspace-grid">
        <WorkflowCanvas
          workflows={MOCK_WORKFLOWS}
          selectedWorkflowId={selectedWorkflowId}
          onSelectWorkflow={setSelectedWorkflowId}
          successSeries={MOCK_SUCCESS_SERIES}
          tableRows={MOCK_TABLE_ROWS}
        />
        <div style={{ display: 'grid', gridTemplateRows: '1fr auto', gap: '10px', minHeight: 0 }}>
          <LogStream logs={logEntries} />
          <WorkflowList workflows={MOCK_WORKFLOWS} selectedId={selectedWorkflowId} onSelect={setSelectedWorkflowId} />
        </div>
      </div>

      <CreateWorkflowModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} onCreate={handleCreate} />
    </div>
  );
}

export const WorkflowPage: React.FC = () => {
  return (
    <WorkflowProvider>
      <WorkflowPageContent />
    </WorkflowProvider>
  );
};
