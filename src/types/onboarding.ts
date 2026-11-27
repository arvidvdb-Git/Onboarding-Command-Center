export type ScreenView = 'command-center' | 'directory';

export type Department =
  | 'Marketing'
  | 'Engineering'
  | 'Product'
  | 'Sales'
  | 'People & HR';

export type OnboardingStatus = 'In Progress' | 'Completed' | 'Blocked';

export type TaskStatus = 'completed' | 'pending' | 'blocked';

export type ColumnKey = 'masterdata' | 'it' | 'calendar' | 'comms';

export type AccessToolKey = 'G' | 'S' | 'N' | 'P' | 'NP';

export type AccessState = 'active' | 'pending' | 'blocked' | 'none';

export interface AccessItem {
  key: AccessToolKey;
  label: string;
  state: AccessState;
  tooltip: string;
}

export interface OnboardingTask {
  id: string;
  column: ColumnKey;
  title: string;
  note: string;
  status: TaskStatus;
  scope: 'general' | Department;
  groupLabel?: string;
  deptCode?: string;
}

export interface EmployeeRecord {
  id: string;
  employeeCode: string;
  name: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
  email: string;
  personalEmail: string;
  role: string;
  department: Department;
  teamLabel: string;
  startDate: string;
  startBadge?: string;
  manager: string;
  masterdataStatus: string;
  masterdataTone: 'emerald' | 'rose' | 'amber';
  status: OnboardingStatus;
  accessMatrix: AccessItem[];
  tasks: OnboardingTask[];
  progressSeed?: {
    completed: number;
    total: number;
    initialCompletedTasks: number;
  };
}
