import React, { useState, useMemo } from 'react';
import { StatusChip } from './StatusChip';
import type { Workflow } from '../types/dashboard';

interface WorkflowListProps {
  workflows: Workflow[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export const WorkflowList: React.FC<WorkflowListProps> = ({ workflows, selectedId, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    return workflows.filter((wf) =>
      wf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wf.owner.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [workflows, searchTerm]);

  return (
    <div className="glass-panel" style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: 0, padding: '14px', gap: '10px' }}>
      <div>
        <h3 style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Workflows
        </h3>
        <input
          type="text"
          placeholder="Search workflows..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(148,163,184,0.18)',
            background: 'var(--layer-0)',
            color: 'var(--text-primary)',
            fontSize: '0.67rem',
            padding: '4px 8px',
            outline: 'none',
            transition: 'border-color var(--duration-sm)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(120,192,255,0.40)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(148,163,184,0.18)';
          }}
        />
      </div>
      <div style={{ overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {filtered.map((workflow) => (
          <button
            key={workflow.id}
            onClick={() => onSelect(workflow.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              padding: '9px 11px',
              background: selectedId === workflow.id ? 'var(--accent-primary-dim)' : 'transparent',
              border: selectedId === workflow.id ? '1px solid var(--border-highlight)' : '1px solid transparent',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'all var(--duration-sm) var(--ease-out)',
              textAlign: 'left',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              if (selectedId !== workflow.id) {
                e.currentTarget.style.background = 'var(--bg-tertiary)';
                e.currentTarget.style.borderColor = 'var(--border-default)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedId !== workflow.id) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
              }
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {workflow.name}
              </div>
              <div style={{ fontSize: '0.67rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                {workflow.owner}
              </div>
            </div>
            <StatusChip status={workflow.status === 'ACTIVE' ? 'active' : 'inactive'} />
          </button>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.67rem' }}>
            No workflows found
          </div>
        )}
      </div>
    </div>
  );
};
