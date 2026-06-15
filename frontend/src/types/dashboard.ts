export type StepState = "IDLE" | "RUNNING" | "SUCCESS" | "ERROR";

export interface WorkflowStep {
  id: string;
  name: string;
  durationMs: number;
  status: StepState;
}

export interface Workflow {
  id: string;
  name: string;
  owner: string;
  status: "ACTIVE" | "PAUSED";
  schedule: string;
  steps: WorkflowStep[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "SUCCESS";
  source: string;
  message: string;
}

export interface KPI {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: "UP" | "DOWN";
}

export interface SuccessPoint {
  label: string;
  value: number;
}

export interface UserRecord {
  user: string;
  plan: string;
  usage: number;
  status: string;
}

export interface AnalyticsData {
  kpis: KPI[];
  successSeries: SuccessPoint[];
  tableRows: UserRecord[];
}
