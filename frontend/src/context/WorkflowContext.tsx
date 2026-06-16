import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { LogEntry } from '../types/dashboard';
import { MOCK_WORKFLOWS, MOCK_LOGS } from '../data/mockDashboard';

type ExecutionState = 'idle' | 'queued' | 'running' | 'success' | 'error';

interface WorkflowContextType {
  selectedWorkflowId: string;
  setSelectedWorkflowId: (id: string) => void;
  executionState: ExecutionState;
  logEntries: LogEntry[];
  isRunning: boolean;
  run: () => void;
  reset: () => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(MOCK_WORKFLOWS[0].id);
  const [executionState, setExecutionState] = useState<ExecutionState>('idle');
  const [logEntries, setLogEntries] = useState<LogEntry[]>(MOCK_LOGS);
  const isRunning = executionState === 'running' || executionState === 'queued';

  const reset = useCallback(() => {
    setExecutionState('idle');
    setLogEntries(MOCK_LOGS);
  }, []);

  const run = useCallback(() => {
    if (isRunning) return;

    setExecutionState('queued');
    let logIndex = 0;

    // Transition to running after 300ms
    const queueTimeout = setTimeout(() => {
      setExecutionState('running');
      setLogEntries([MOCK_LOGS[0]]);
      logIndex = 1;

      // Emit log entries every 600ms
      const logInterval = setInterval(() => {
        if (logIndex < MOCK_LOGS.length - 2) {
          setLogEntries((prev) => [...prev, MOCK_LOGS[logIndex]]);
          logIndex++;
        } else {
          clearInterval(logInterval);
          // Show final logs after 4s of running
          setTimeout(() => {
            setLogEntries(MOCK_LOGS);
            setExecutionState('success');
          }, 1000);
        }
      }, 600);

      return () => clearInterval(logInterval);
    }, 300);

    return () => clearTimeout(queueTimeout);
  }, [isRunning]);

  // Auto-reset after 8s of success state
  useEffect(() => {
    if (executionState === 'success') {
      const resetTimeout = setTimeout(() => {
        reset();
      }, 8000);
      return () => clearTimeout(resetTimeout);
    }
  }, [executionState, reset]);

  const value: WorkflowContextType = {
    selectedWorkflowId,
    setSelectedWorkflowId,
    executionState,
    logEntries,
    isRunning,
    run,
    reset,
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = (): WorkflowContextType => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};
