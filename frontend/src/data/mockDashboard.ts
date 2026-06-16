import type { Workflow, LogEntry, KPI, SuccessPoint, UserRecord } from '../types/dashboard';

export const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: 'wf-001',
    name: 'Data Pipeline - Daily ETL',
    owner: 'Alice Chen',
    status: 'ACTIVE',
    schedule: '0 2 * * *',
    steps: [
      { id: 'step-1', name: 'Extract Source', durationMs: 1240, status: 'SUCCESS' },
      { id: 'step-2', name: 'Transform Data', durationMs: 3560, status: 'RUNNING' },
      { id: 'step-3', name: 'Validate Schema', durationMs: 0, status: 'IDLE' },
      { id: 'step-4', name: 'Load Warehouse', durationMs: 0, status: 'IDLE' },
    ],
  },
  {
    id: 'wf-002',
    name: 'Report Generation',
    owner: 'Bob Martinez',
    status: 'ACTIVE',
    schedule: '0 6 * * MON',
    steps: [
      { id: 'step-1', name: 'Fetch Metrics', durationMs: 890, status: 'SUCCESS' },
      { id: 'step-2', name: 'Aggregate Data', durationMs: 1230, status: 'SUCCESS' },
      { id: 'step-3', name: 'Generate PDF', durationMs: 2140, status: 'SUCCESS' },
      { id: 'step-4', name: 'Email Report', durationMs: 340, status: 'SUCCESS' },
    ],
  },
  {
    id: 'wf-003',
    name: 'Cache Invalidation',
    owner: 'Carol Kim',
    status: 'PAUSED',
    schedule: '*/15 * * * *',
    steps: [
      { id: 'step-1', name: 'Check TTL', durationMs: 150, status: 'SUCCESS' },
      { id: 'step-2', name: 'Identify Stale', durationMs: 890, status: 'ERROR' },
      { id: 'step-3', name: 'Clear Redis', durationMs: 0, status: 'IDLE' },
      { id: 'step-4', name: 'Verify Purge', durationMs: 0, status: 'IDLE' },
    ],
  },
];

export const MOCK_KPIS: KPI[] = [
  {
    id: 'kpi-1',
    label: 'Active Users',
    value: '12,481',
    delta: '+8.2%',
    trend: 'UP',
    sparkline: [120, 142, 135, 165, 178, 195, 210],
    context: 'vs last 24h',
    updatedAt: 'Updated 12 sec ago',
  },
  {
    id: 'kpi-2',
    label: 'Requests',
    value: '892.4K',
    delta: '+12.5%',
    trend: 'UP',
    sparkline: [850, 920, 880, 950, 1020, 1140, 1280],
    context: 'vs last 24h',
    updatedAt: 'Updated 8 sec ago',
  },
  {
    id: 'kpi-3',
    label: 'Error Rate',
    value: '0.82%',
    delta: '-2.1%',
    trend: 'DOWN',
    sparkline: [128, 115, 105, 95, 88, 82, 78],
    context: 'vs last 24h',
    updatedAt: 'Updated 5 sec ago',
  },
  {
    id: 'kpi-4',
    label: 'Revenue',
    value: '$48.2K',
    delta: '+18.7%',
    trend: 'UP',
    sparkline: [35, 38, 40, 42, 44, 46, 48],
    context: 'vs last week',
    updatedAt: 'Updated 42 sec ago',
  },
];

export const MOCK_LOGS: LogEntry[] = [
  { id: 'log-1', timestamp: '14:23:45', level: 'INFO', source: 'pipeline', message: 'Workflow initialized' },
  { id: 'log-2', timestamp: '14:23:46', level: 'INFO', source: 'extract', message: 'Connecting to source database' },
  { id: 'log-3', timestamp: '14:23:47', level: 'SUCCESS', source: 'extract', message: 'Connected successfully, 45,230 rows' },
  { id: 'log-4', timestamp: '14:23:49', level: 'INFO', source: 'transform', message: 'Beginning transformation phase' },
  { id: 'log-5', timestamp: '14:23:52', level: 'INFO', source: 'transform', message: 'Deduplating records...' },
  { id: 'log-6', timestamp: '14:23:55', level: 'WARN', source: 'transform', message: 'Found 234 orphaned records' },
  { id: 'log-7', timestamp: '14:23:58', level: 'INFO', source: 'transform', message: 'Normalizing date formats' },
  { id: 'log-8', timestamp: '14:24:02', level: 'SUCCESS', source: 'transform', message: 'Transformation complete, 44,996 valid rows' },
  { id: 'log-9', timestamp: '14:24:03', level: 'INFO', source: 'validate', message: 'Starting schema validation' },
  { id: 'log-10', timestamp: '14:24:05', level: 'INFO', source: 'validate', message: 'Checking column types...' },
  { id: 'log-11', timestamp: '14:24:06', level: 'SUCCESS', source: 'validate', message: 'All rows pass validation' },
  { id: 'log-12', timestamp: '14:24:07', level: 'INFO', source: 'load', message: 'Beginning warehouse load' },
  { id: 'log-13', timestamp: '14:24:09', level: 'INFO', source: 'load', message: 'Inserting into production table...' },
  { id: 'log-14', timestamp: '14:24:11', level: 'SUCCESS', source: 'load', message: 'Load complete: 44,996 rows inserted' },
  { id: 'log-15', timestamp: '14:24:12', level: 'SUCCESS', source: 'pipeline', message: 'Workflow completed successfully' },
];

export const MOCK_TABLE_ROWS: UserRecord[] = [
  { user: 'alice@acme.com', plan: 'enterprise', usage: 82, status: 'active' },
  { user: 'bob@corp.dev', plan: 'pro', usage: 64, status: 'active' },
  { user: 'carol@startup.io', plan: 'free', usage: 28, status: 'active' },
  { user: 'david@agency.com', plan: 'enterprise', usage: 91, status: 'active' },
  { user: 'emma@research.org', plan: 'pro', usage: 45, status: 'pending' },
  { user: 'frank@nonprofit.net', plan: 'free', usage: 12, status: 'inactive' },
];

export const MOCK_SUCCESS_SERIES: SuccessPoint[] = [
  { label: 'Mon', value: 92 },
  { label: 'Tue', value: 88 },
  { label: 'Wed', value: 95 },
  { label: 'Thu', value: 89 },
  { label: 'Fri', value: 91 },
  { label: 'Sat', value: 76 },
  { label: 'Sun', value: 84 },
  { label: 'Today', value: 87 },
];
