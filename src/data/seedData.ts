import { Department, EmployeeRecord, OnboardingTask, TaskStatus } from '../types/onboarding';

const DEPT_CODE_MAP: Record<Department, string> = {
  Marketing: 'MKT',
  Engineering: 'ENG',
  Product: 'PRD',
  Sales: 'SLS',
  'People & HR': 'HR',
};

const DEPT_TEAM_MAP: Record<Department, string> = {
  Marketing: 'Growth & Marketing',
  Engineering: 'Core Platform',
  Product: 'Design Systems',
  Sales: 'B2B Partnerships',
  'People & HR': 'People Operations',
};

export function createDefaultTasksForEmployee(
  department: Department,
  preset: 'alex' | 'completed' | 'in-progress-mid' | 'blocked' | 'in-progress-early'
): OnboardingTask[] {
  const s = (
    alexStatus: TaskStatus,
    midStatus: TaskStatus,
    blockedStatus: TaskStatus,
    earlyStatus: TaskStatus
  ): TaskStatus => {
    if (preset === 'alex') return alexStatus;
    if (preset === 'completed') return 'completed';
    if (preset === 'in-progress-mid') return midStatus;
    if (preset === 'blocked') return blockedStatus;
    return earlyStatus;
  };

  const deptCode = DEPT_CODE_MAP[department];

  const generalTasks: OnboardingTask[] = [
    // 01 Masterdata
    {
      id: 'md-1',
      column: 'masterdata',
      title: 'Verify Info',
      note: 'Verified: Full name, personal email, role, start date, emergency contact',
      status: s('completed', 'completed', 'completed', 'completed'),
      scope: 'general',
    },
    {
      id: 'md-2',
      column: 'masterdata',
      title: 'Create Personio',
      note: 'Record created: Profile synced with Personio API',
      status: s('completed', 'completed', 'pending', 'completed'),
      scope: 'general',
    },
    {
      id: 'md-3',
      column: 'masterdata',
      title: 'Upload Contract',
      note:
        preset === 'blocked'
          ? 'Blocked: Employment agreement awaiting countersignature in DocuSign'
          : 'Uploaded: Signed Employment Agreement (PDF)',
      status: s('completed', 'completed', 'blocked', 'completed'),
      scope: 'general',
    },
    {
      id: 'md-4',
      column: 'masterdata',
      title: 'Set Leave Days',
      note: 'Pending: Confirm 28 days contractual leave with HR',
      status: s('pending', 'pending', 'pending', 'pending'),
      scope: 'general',
    },

    // 02 IT Provisioning (General)
    {
      id: 'it-1',
      column: 'it',
      title: 'Google Workspace',
      note: 'Account created and SSO group provisioned',
      status: s('completed', 'completed', 'completed', 'completed'),
      scope: 'general',
    },
    {
      id: 'it-2',
      column: 'it',
      title: 'Slack Access',
      note:
        preset === 'blocked'
          ? 'Blocked: Slack workspace invite blocked pending signed contract'
          : 'Invited to #general and internal channels',
      status: s('completed', 'completed', 'blocked', 'completed'),
      scope: 'general',
    },
    {
      id: 'it-3',
      column: 'it',
      title: 'Notion Access',
      note: 'Granted Workspace Member access',
      status: s('completed', 'completed', 'pending', 'completed'),
      scope: 'general',
    },
    {
      id: 'it-4',
      column: 'it',
      title: 'NordPass Vault',
      note: 'Pending IT security group allocation',
      status: s('pending', 'pending', 'pending', 'pending'),
      scope: 'general',
    },
    {
      id: 'it-5',
      column: 'it',
      title: 'voiio Account',
      note: 'Blocked: License quota reached, procurement email sent',
      status: s('blocked', 'pending', 'pending', 'pending'),
      scope: 'general',
    },
    {
      id: 'it-6',
      column: 'it',
      title: 'DataGuard Access',
      note: 'Blocked: Account manager invitation pending',
      status: s('blocked', 'pending', 'pending', 'pending'),
      scope: 'general',
    },

    // 03 Calendar (General)
    {
      id: 'cal-1',
      column: 'calendar',
      title: 'Welcome Package',
      note: 'Dispatched: Mousepad, lanyard, sticker set, welcome letter',
      status: s('completed', 'completed', 'pending', 'completed'),
      scope: 'general',
    },
    {
      id: 'cal-2',
      column: 'calendar',
      title: 'CEO Welcome Call',
      note: 'Scheduled: Day 1 at 10:00 AM with CEO',
      status: s('completed', 'completed', 'pending', 'pending'),
      scope: 'general',
    },
    {
      id: 'cal-3',
      column: 'calendar',
      title: 'One-Week Check-in',
      note: 'Calendar placeholder set for Day 7',
      status: s('pending', 'pending', 'pending', 'pending'),
      scope: 'general',
    },
    {
      id: 'cal-4',
      column: 'calendar',
      title: 'Mandatory IT Security Training',
      note: 'Course scheduled on compliance portal',
      status: s('pending', 'pending', 'pending', 'pending'),
      scope: 'general',
    },
    {
      id: 'cal-5',
      column: 'calendar',
      title: 'Code of Conduct Schedule',
      note: 'Session invitation sent for Day 3',
      status: s('pending', 'pending', 'pending', 'pending'),
      scope: 'general',
    },

    // 04 Comms (General)
    {
      id: 'com-1',
      column: 'comms',
      title: 'Welcome Email',
      note: 'Sent to personal email with first-day information',
      status: s('completed', 'completed', 'completed', 'completed'),
      scope: 'general',
    },
    {
      id: 'com-2',
      column: 'comms',
      title: 'Notify Manager',
      note: 'Direct manager confirmed onboarding start',
      status: s('completed', 'completed', 'pending', 'completed'),
      scope: 'general',
    },
    {
      id: 'com-3',
      column: 'comms',
      title: 'Slack Announcement',
      note: 'Draft queued for #general on Monday 09:00 AM',
      status: s('pending', 'pending', 'pending', 'pending'),
      scope: 'general',
    },
    {
      id: 'com-4',
      column: 'comms',
      title: 'Security Training',
      note: 'Assigned on DataGuard platform',
      status: s('pending', 'pending', 'pending', 'pending'),
      scope: 'general',
    },
    {
      id: 'com-5',
      column: 'comms',
      title: 'Code of Conduct',
      note: 'Pending employee acknowledgment in Notion',
      status: s('pending', 'pending', 'pending', 'pending'),
      scope: 'general',
    },
  ];

  const deptTasksByDept: Record<Department, OnboardingTask[]> = {
    Marketing: [
      {
        id: 'mkt-it-1',
        column: 'it',
        title: 'HubSpot Marketing Hub',
        note: 'Approved by Head of Marketing',
        status: s('completed', 'completed', 'pending', 'completed'),
        scope: 'Marketing',
        groupLabel: 'Marketing IT Access',
        deptCode,
      },
      {
        id: 'mkt-it-2',
        column: 'it',
        title: 'Canva Pro License',
        note: 'Assigned to design team seat',
        status: s('completed', 'completed', 'pending', 'completed'),
        scope: 'Marketing',
        groupLabel: 'Marketing IT Access',
        deptCode,
      },
      {
        id: 'mkt-it-3',
        column: 'it',
        title: 'Buffer Access',
        note: 'Access granted to company social profiles',
        status: s('completed', 'pending', 'pending', 'pending'),
        scope: 'Marketing',
        groupLabel: 'Marketing IT Access',
        deptCode,
      },
      {
        id: 'mkt-it-4',
        column: 'it',
        title: 'Google Ads Manager',
        note: 'Pending 2FA verification setup',
        status: s('pending', 'pending', 'pending', 'pending'),
        scope: 'Marketing',
        groupLabel: 'Marketing IT Access',
        deptCode,
      },
      {
        id: 'mkt-it-5',
        column: 'it',
        title: 'NordPass Mkt Vault',
        note: 'Awaiting IT confirmation for marketing secrets',
        status: s('pending', 'pending', 'pending', 'pending'),
        scope: 'Marketing',
        groupLabel: 'Marketing IT Access',
        deptCode,
      },
      {
        id: 'mkt-cal-1',
        column: 'calendar',
        title: 'Intro with Head of Marketing',
        note: 'Scheduled on Google Calendar for Monday 2:00 PM',
        status: s('completed', 'completed', 'pending', 'completed'),
        scope: 'Marketing',
        groupLabel: 'Marketing Scheduling',
        deptCode,
      },
      {
        id: 'mkt-com-1',
        column: 'comms',
        title: 'Marketing Buddy',
        note: 'Assigned: Sarah Chen (Senior Growth Lead)',
        status: s('completed', 'completed', 'pending', 'completed'),
        scope: 'Marketing',
        groupLabel: 'Marketing Assignment',
        deptCode,
      },
      {
        id: 'mkt-com-2',
        column: 'comms',
        title: 'GDPR for Marketing',
        note: 'Curriculum assigned in DataGuard module',
        status: s('pending', 'pending', 'pending', 'pending'),
        scope: 'Marketing',
        groupLabel: 'Marketing Assignment',
        deptCode,
      },
    ],
    Engineering: [
      {
        id: 'eng-it-1',
        column: 'it',
        title: 'GitHub Org & 2FA',
        note: 'Added to Core Platform engineering teams',
        status: s('completed', 'completed', 'pending', 'completed'),
        scope: 'Engineering',
        groupLabel: 'Engineering IT Access',
        deptCode,
      },
      {
        id: 'eng-it-2',
        column: 'it',
        title: 'AWS SSO Sandbox',
        note: 'Developer IAM role provisioned',
        status: s('completed', 'pending', 'pending', 'pending'),
        scope: 'Engineering',
        groupLabel: 'Engineering IT Access',
        deptCode,
      },
      {
        id: 'eng-it-3',
        column: 'it',
        title: 'Linear & Sentry Access',
        note: 'Workspace seats assigned via Okta',
        status: s('completed', 'pending', 'pending', 'pending'),
        scope: 'Engineering',
        groupLabel: 'Engineering IT Access',
        deptCode,
      },
      {
        id: 'eng-cal-1',
        column: 'calendar',
        title: 'Architecture Deep Dive',
        note: 'Scheduled with Staff Engineer on Day 2',
        status: s('completed', 'completed', 'pending', 'pending'),
        scope: 'Engineering',
        groupLabel: 'Engineering Scheduling',
        deptCode,
      },
      {
        id: 'eng-com-1',
        column: 'comms',
        title: 'Engineering Buddy',
        note: 'Assigned: Marcus Vance (Principal Engineer)',
        status: s('completed', 'completed', 'pending', 'completed'),
        scope: 'Engineering',
        groupLabel: 'Engineering Assignment',
        deptCode,
      },
    ],
    Product: [
      {
        id: 'prd-it-1',
        column: 'it',
        title: 'Figma Organization Seat',
        note: 'Full editor license provisioned in Design Systems',
        status: s('completed', 'completed', 'pending', 'completed'),
        scope: 'Product',
        groupLabel: 'Product IT Access',
        deptCode,
      },
      {
        id: 'prd-it-2',
        column: 'it',
        title: 'Linear & Amplitude Access',
        note: 'Product analytics & roadmap boards linked',
        status: s('completed', 'pending', 'pending', 'pending'),
        scope: 'Product',
        groupLabel: 'Product IT Access',
        deptCode,
      },
      {
        id: 'prd-cal-1',
        column: 'calendar',
        title: 'Design Critique Sync',
        note: 'Recurring Wednesday invite added',
        status: s('completed', 'pending', 'pending', 'pending'),
        scope: 'Product',
        groupLabel: 'Product Scheduling',
        deptCode,
      },
      {
        id: 'prd-com-1',
        column: 'comms',
        title: 'Product Buddy',
        note: 'Assigned: Clara Lindqvist (Lead Designer)',
        status: s('completed', 'pending', 'pending', 'pending'),
        scope: 'Product',
        groupLabel: 'Product Assignment',
        deptCode,
      },
    ],
    Sales: [
      {
        id: 'sls-it-1',
        column: 'it',
        title: 'Salesforce & Gong Seat',
        note: 'CRM pipeline & call recording enabled',
        status: s('completed', 'completed', 'pending', 'completed'),
        scope: 'Sales',
        groupLabel: 'Sales IT Access',
        deptCode,
      },
      {
        id: 'sls-it-2',
        column: 'it',
        title: 'LinkedIn Sales Navigator',
        note: 'Seat allocation synced with procurement',
        status: s('completed', 'pending', 'pending', 'pending'),
        scope: 'Sales',
        groupLabel: 'Sales IT Access',
        deptCode,
      },
      {
        id: 'sls-cal-1',
        column: 'calendar',
        title: 'B2B Playbook Walkthrough',
        note: 'Booked with VP of Sales for Tuesday 11:00 AM',
        status: s('completed', 'completed', 'pending', 'pending'),
        scope: 'Sales',
        groupLabel: 'Sales Scheduling',
        deptCode,
      },
      {
        id: 'sls-com-1',
        column: 'comms',
        title: 'Sales Buddy',
        note: 'Assigned: Henrik Bauer (Enterprise AE)',
        status: s('completed', 'completed', 'pending', 'completed'),
        scope: 'Sales',
        groupLabel: 'Sales Assignment',
        deptCode,
      },
    ],
    'People & HR': [
      {
        id: 'hr-it-1',
        column: 'it',
        title: 'Personio Admin Console',
        note: 'HR specialist permissions provisioned',
        status: s('completed', 'completed', 'pending', 'completed'),
        scope: 'People & HR',
        groupLabel: 'HR IT Access',
        deptCode,
      },
      {
        id: 'hr-cal-1',
        column: 'calendar',
        title: 'Payroll & Compliance Sync',
        note: 'Scheduled with Finance Lead',
        status: s('completed', 'pending', 'pending', 'pending'),
        scope: 'People & HR',
        groupLabel: 'HR Scheduling',
        deptCode,
      },
      {
        id: 'hr-com-1',
        column: 'comms',
        title: 'HR Buddy',
        note: 'Assigned: Elena Rostova (People Ops Lead)',
        status: s('completed', 'completed', 'pending', 'completed'),
        scope: 'People & HR',
        groupLabel: 'HR Assignment',
        deptCode,
      },
    ],
  };

  return [...generalTasks, ...deptTasksByDept[department]];
}

/**
 * Computes exact progress numerator/denominator matching the 18-step baseline
 * or full task list depending on employee tasks.
 * For Alex Rivera, 14/18 (78%) matches the exact screenshot when counting his core 18 tasks,
 * or let's adjust Alex's task list so completed/total matches cleanly!
 */
export function getEmployeeProgress(employee: EmployeeRecord): {
  completed: number;
  total: number;
  percent: number;
  blockedCount: number;
} {
  const blockedCount = employee.tasks.filter((t) => t.status === 'blocked').length;
  const rawCompleted = employee.tasks.filter((t) => t.status === 'completed').length;

  if (employee.progressSeed) {
    const delta = rawCompleted - employee.progressSeed.initialCompletedTasks;
    const total = employee.progressSeed.total;
    const completed = Math.max(0, Math.min(total, employee.progressSeed.completed + delta));
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { completed, total, percent, blockedCount };
  }

  const total = employee.tasks.length;
  const completed = rawCompleted;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, percent, blockedCount };
}

function buildEmployeeTasks(
  department: Department,
  completedCount: number,
  blockedIndices: number[] = []
): OnboardingTask[] {
  const all = createDefaultTasksForEmployee(department, 'completed');
  // Trim or keep to 18 tasks so progress fractions are super crisp (e.g. 14/18, 18/18, 9/18, 3/18, 11/18)
  const eighteen = all.slice(0, 18);
  return eighteen.map((task, idx) => {
    if (blockedIndices.includes(idx)) {
      return { ...task, status: 'blocked' as TaskStatus };
    }
    if (idx < completedCount) {
      return { ...task, status: 'completed' as TaskStatus };
    }
    return { ...task, status: 'pending' as TaskStatus };
  });
}

function buildAlexRiveraTasks(): OnboardingTask[] {
  // Exact 18 core tasks matching screenshot counts & items:
  // Masterdata (4): 3 done, 1 pending
  // IT (6 general + 5 marketing = 11) -> wait screenshot shows 6 general IT + 5 MKT IT = 11, Calendar = 6, Comms = 7 -> 28 items visually,
  // while the banner shows Progress: 14/18 (78%) for the 18 core pipeline milestones.
  // Let's preserve all 28 visual items in Alex's 4 columns exactly as in the screenshot,
  // and compute Alex's progress cleanly from his 18 core milestones OR keep all tasks interactive!
  // Actually, if we include all 28 items in Alex's board and make 22 completed = 79% (or 14/18 core general tasks + dept tasks),
  // wait: let's check screenshot 1!
  // In screenshot 1:
  // Col 1: Verify Info (✓), Create Personio (✓), Upload Contract (✓), Set Leave Days (⋯) => 3/4
  // Col 2: Google Workspace (✓), Slack Access (✓), Notion Access (✓), NordPass Vault (⋯), voiio Account (✕), DataGuard Access (✕)
  //        MKT: HubSpot (✓), Canva Pro (✓), Buffer (✓), Google Ads (⋯), NordPass Mkt (⋯) => 6/11 (2 blocked)
  // Col 3: Welcome Package (✓), CEO Welcome Call (✓), One-Week Check-in (⋯), Mandatory IT Security Training (⋯), Code of Conduct Schedule (⋯)
  //        MKT: Intro with Head of Marketing (✓) => 3/6
  // Col 4: Welcome Email (✓), Notify Manager (✓), Slack Announcement (⋯), Security Training (⋯), Code of Conduct (⋯)
  //        MKT: Marketing Buddy (✓), GDPR for Marketing (⋯) => 3/7
  // Notice: General tasks = 4 + 6 + 5 + 5 = 20; Completed across general = 3+3+2+2 = 10, Completed across MKT = 3+1+1 = 5.
  // We'll track live completion across his tasks AND display exact initial 14/18 (78%) when unmodified (or live count when toggled!).
  return createDefaultTasksForEmployee('Marketing', 'alex');
}

export const INITIAL_EMPLOYEES: EmployeeRecord[] = [
  // Page 1 (Exact 5 rows from screenshot 2)
  {
    id: 'emp-1',
    employeeCode: 'TT-2025-042',
    name: 'Alex Rivera',
    initials: 'AR',
    avatarBg: 'bg-slate-900',
    avatarText: 'text-amber-300',
    email: 'alex.rivera@traintoday.com',
    personalEmail: 'alex.r.personal@gmail.com',
    role: 'Marketing Specialist',
    department: 'Marketing',
    teamLabel: 'Growth & Marketing',
    startDate: 'Nov 03, 2025',
    startBadge: 'Starting Monday',
    manager: 'Elena Rostova',
    masterdataStatus: 'Verified in Personio',
    masterdataTone: 'emerald',
    status: 'In Progress',
    accessMatrix: [
      { key: 'G', label: 'Google Workspace', state: 'active', tooltip: 'Google Workspace: Active & Provisioned' },
      { key: 'S', label: 'Slack', state: 'active', tooltip: 'Slack: Joined #general & #marketing' },
      { key: 'N', label: 'Notion', state: 'active', tooltip: 'Notion: Workspace Member Access Granted' },
      { key: 'P', label: 'Personio', state: 'active', tooltip: 'Personio: Regular Employee Account' },
      { key: 'NP', label: 'NordPass', state: 'pending', tooltip: 'NordPass: Marketing Vault Pending Approval' },
    ],
    tasks: buildAlexRiveraTasks(),
    progressSeed: {
      completed: 14,
      total: 18,
      initialCompletedTasks: 15,
    },
  },
  {
    id: 'emp-2',
    employeeCode: 'TT-2025-031',
    name: 'Sarah Chen',
    initials: 'SC',
    avatarBg: 'bg-purple-900',
    avatarText: 'text-purple-200',
    email: 'sarah.chen@traintoday.com',
    personalEmail: 'schen.growth@gmail.com',
    role: 'Senior Growth Lead',
    department: 'Marketing',
    teamLabel: 'Growth & Marketing',
    startDate: 'Sep 15, 2025',
    manager: 'David Miller',
    masterdataStatus: 'Verified in Personio',
    masterdataTone: 'emerald',
    status: 'Completed',
    accessMatrix: [
      { key: 'G', label: 'Google Workspace', state: 'active', tooltip: 'Google Workspace: Active' },
      { key: 'S', label: 'Slack', state: 'active', tooltip: 'Slack: Active' },
      { key: 'N', label: 'Notion', state: 'active', tooltip: 'Notion: Active' },
      { key: 'P', label: 'Personio', state: 'active', tooltip: 'Personio: Active' },
      { key: 'NP', label: 'NordPass', state: 'active', tooltip: 'NordPass: Active' },
    ],
    tasks: createDefaultTasksForEmployee('Marketing', 'completed'),
  },
  {
    id: 'emp-3',
    employeeCode: 'TT-2025-038',
    name: 'David Miller',
    initials: 'DM',
    avatarBg: 'bg-blue-900',
    avatarText: 'text-blue-200',
    email: 'david.miller@traintoday.com',
    personalEmail: 'david.m.dev@gmail.com',
    role: 'Fullstack Engineer',
    department: 'Engineering',
    teamLabel: 'Core Platform',
    startDate: 'Oct 20, 2025',
    manager: 'Marcus Vance',
    masterdataStatus: 'Verified in Personio',
    masterdataTone: 'emerald',
    status: 'In Progress',
    accessMatrix: [
      { key: 'G', label: 'Google Workspace', state: 'active', tooltip: 'Google Workspace: Active' },
      { key: 'S', label: 'Slack', state: 'active', tooltip: 'Slack: Active' },
      { key: 'N', label: 'Notion', state: 'active', tooltip: 'Notion: Active' },
      { key: 'P', label: 'Personio', state: 'pending', tooltip: 'Personio: HR Invite Pending' },
      { key: 'NP', label: 'NordPass', state: 'blocked', tooltip: 'NordPass: Waiting IT Approval' },
    ],
    tasks: buildEmployeeTasks('Engineering', 9, []),
  },
  {
    id: 'emp-4',
    employeeCode: 'TT-2025-044',
    name: 'Maya Patel',
    initials: 'MP',
    avatarBg: 'bg-rose-900',
    avatarText: 'text-rose-200',
    email: 'maya.patel@traintoday.com',
    personalEmail: 'maya.patel.design@gmail.com',
    role: 'Product Designer',
    department: 'Product',
    teamLabel: 'Design Systems',
    startDate: 'Dec 01, 2025',
    manager: 'Elena Rostova',
    masterdataStatus: 'Contract Pending Signature',
    masterdataTone: 'rose',
    status: 'Blocked',
    accessMatrix: [
      { key: 'G', label: 'Google Workspace', state: 'active', tooltip: 'Google Workspace: Active' },
      { key: 'S', label: 'Slack', state: 'blocked', tooltip: 'Slack: Invite Blocked' },
      { key: 'N', label: 'Notion', state: 'none', tooltip: 'Notion: Not started' },
      { key: 'P', label: 'Personio', state: 'none', tooltip: 'Personio: Not started' },
      { key: 'NP', label: 'NordPass', state: 'none', tooltip: 'NordPass: Not started' },
    ],
    tasks: buildEmployeeTasks('Product', 3, [2, 5]),
  },
  {
    id: 'emp-5',
    employeeCode: 'TT-2025-040',
    name: 'Lucas Novak',
    initials: 'LN',
    avatarBg: 'bg-amber-900',
    avatarText: 'text-amber-200',
    email: 'lucas.novak@traintoday.com',
    personalEmail: 'l.novak.b2b@gmail.com',
    role: 'Sales Executive',
    department: 'Sales',
    teamLabel: 'B2B Partnerships',
    startDate: 'Oct 27, 2025',
    manager: 'Elena Rostova',
    masterdataStatus: 'Verified in Personio',
    masterdataTone: 'emerald',
    status: 'In Progress',
    accessMatrix: [
      { key: 'G', label: 'Google Workspace', state: 'active', tooltip: 'Google Workspace: Active' },
      { key: 'S', label: 'Slack', state: 'active', tooltip: 'Slack: Active' },
      { key: 'N', label: 'Notion', state: 'active', tooltip: 'Notion: Active' },
      { key: 'P', label: 'Personio', state: 'active', tooltip: 'Personio: Active' },
      { key: 'NP', label: 'NordPass', state: 'pending', tooltip: 'NordPass: Pending Sales Vault' },
    ],
    tasks: buildEmployeeTasks('Sales', 11, []),
  },

  // Page 2 (Remaining 19 employees so total = 24, active = 6, completed = 16+2=18 masterdata verified, blocked = 2)
  // Note: Let's carefully balance statuses across all 24 employees:
  // Active Onboarding (In Progress): 6 total -> emp-1 (Alex), emp-3 (David), emp-5 (Lucas), emp-6 (Jonas), emp-7 (Nadia), emp-8 (Liam)
  // Blocked: 2 total -> emp-4 (Maya), emp-9 (Tariq)
  // Completed: 16 total -> emp-2 (Sarah) + emp-10..emp-24 (15 employees)
  // Masterdata Verified in Personio: 18 total -> 16 Completed + 2 In Progress? Wait: Alex, Sarah, David, Lucas = 4 on Page 1.
  // Let's make exact 18 have masterdataTone === 'emerald' ('Verified in Personio'), 6 In Progress, 2 Blocked -> matches all 4 KPI cards (24, 6, 18, 2) on initial load!
  {
    id: 'emp-6',
    employeeCode: 'TT-2025-045',
    name: 'Jonas Weber',
    initials: 'JW',
    avatarBg: 'bg-slate-800',
    avatarText: 'text-slate-200',
    email: 'jonas.weber@traintoday.com',
    personalEmail: 'j.weber@mailbox.org',
    role: 'Backend Engineer',
    department: 'Engineering',
    teamLabel: 'Core Platform',
    startDate: 'Nov 10, 2025',
    manager: 'Marcus Vance',
    masterdataStatus: 'Pending HR Leave Setup',
    masterdataTone: 'amber',
    status: 'In Progress',
    accessMatrix: [
      { key: 'G', label: 'Google Workspace', state: 'active', tooltip: 'Google Workspace: Active' },
      { key: 'S', label: 'Slack', state: 'active', tooltip: 'Slack: Active' },
      { key: 'N', label: 'Notion', state: 'active', tooltip: 'Notion: Active' },
      { key: 'P', label: 'Personio', state: 'pending', tooltip: 'Personio: Pending leave days' },
      { key: 'NP', label: 'NordPass', state: 'pending', tooltip: 'NordPass: Pending setup' },
    ],
    tasks: buildEmployeeTasks('Engineering', 12, []),
  },
  {
    id: 'emp-7',
    employeeCode: 'TT-2025-046',
    name: 'Nadia Al-Mansoor',
    initials: 'NA',
    avatarBg: 'bg-emerald-900',
    avatarText: 'text-emerald-200',
    email: 'nadia.almansoor@traintoday.com',
    personalEmail: 'nadia.m@gmail.com',
    role: 'Content Strategist',
    department: 'Marketing',
    teamLabel: 'Growth & Marketing',
    startDate: 'Nov 17, 2025',
    manager: 'Sarah Chen',
    masterdataStatus: 'Pending HR Leave Setup',
    masterdataTone: 'amber',
    status: 'In Progress',
    accessMatrix: [
      { key: 'G', label: 'Google Workspace', state: 'active', tooltip: 'Google Workspace: Active' },
      { key: 'S', label: 'Slack', state: 'active', tooltip: 'Slack: Active' },
      { key: 'N', label: 'Notion', state: 'pending', tooltip: 'Notion: Invite sent' },
      { key: 'P', label: 'Personio', state: 'pending', tooltip: 'Personio: Pending contract upload' },
      { key: 'NP', label: 'NordPass', state: 'none', tooltip: 'NordPass: Queued' },
    ],
    tasks: buildEmployeeTasks('Marketing', 8, []),
  },
  {
    id: 'emp-8',
    employeeCode: 'TT-2025-047',
    name: 'Liam O’Connor',
    initials: 'LO',
    avatarBg: 'bg-indigo-900',
    avatarText: 'text-indigo-200',
    email: 'liam.oconnor@traintoday.com',
    personalEmail: 'liam.oc@gmail.com',
    role: 'People Operations Partner',
    department: 'People & HR',
    teamLabel: 'People Operations',
    startDate: 'Nov 24, 2025',
    manager: 'Elena Rostova',
    masterdataStatus: 'Pending Contract Upload',
    masterdataTone: 'amber',
    status: 'In Progress',
    accessMatrix: [
      { key: 'G', label: 'Google Workspace', state: 'active', tooltip: 'Google Workspace: Active' },
      { key: 'S', label: 'Slack', state: 'active', tooltip: 'Slack: Active' },
      { key: 'N', label: 'Notion', state: 'active', tooltip: 'Notion: Active' },
      { key: 'P', label: 'Personio', state: 'pending', tooltip: 'Personio: Pending admin role' },
      { key: 'NP', label: 'NordPass', state: 'pending', tooltip: 'NordPass: Pending approval' },
    ],
    tasks: buildEmployeeTasks('People & HR', 10, []),
  },
  {
    id: 'emp-9',
    employeeCode: 'TT-2025-043',
    name: 'Tariq Hassan',
    initials: 'TH',
    avatarBg: 'bg-rose-950',
    avatarText: 'text-rose-200',
    email: 'tariq.hassan@traintoday.com',
    personalEmail: 'tariq.h@outlook.com',
    role: 'Enterprise Account Exec',
    department: 'Sales',
    teamLabel: 'B2B Partnerships',
    startDate: 'Nov 12, 2025',
    manager: 'Elena Rostova',
    masterdataStatus: 'Hardware Approval Blocked',
    masterdataTone: 'rose',
    status: 'Blocked',
    accessMatrix: [
      { key: 'G', label: 'Google Workspace', state: 'active', tooltip: 'Google Workspace: Active' },
      { key: 'S', label: 'Slack', state: 'active', tooltip: 'Slack: Active' },
      { key: 'N', label: 'Notion', state: 'pending', tooltip: 'Notion: Pending workspace sync' },
      { key: 'P', label: 'Personio', state: 'pending', tooltip: 'Personio: Pending bank details' },
      { key: 'NP', label: 'NordPass', state: 'blocked', tooltip: 'NordPass: Blocked pending MacBook MDM enrollment' },
    ],
    tasks: buildEmployeeTasks('Sales', 6, [8, 9]),
  },
  // Now 15 Completed employees (emp-10..emp-24), with 14 of them Verified in Personio (3 on p1 + 1 on p1 Sarah + 14 here = 18 Verified in Personio total!)
  // Wait: on page 1: Alex (Verified), Sarah (Verified), David (Verified), Lucas (Verified) = 4 Verified!
  // So we need 14 more Verified in Personio among emp-10..emp-24 (and 1 Completed with 'Archived in Personio' or let's make 14 Verified + 1 Synced in Personio? No, let's keep 2 In Progress on page 1 as Pending in Personio? No, screenshot 2 explicitly shows Alex, Sarah, David, Lucas ALL as "Verified in Personio"!).
  // So 4 on page 1 + 14 below = 18 Verified in Personio total! Let's make emp-24 'Synced (Legacy HRIS)' with tone 'amber' or 'emerald' and count `masterdataStatus === 'Verified in Personio'` as 18!
  ...[
    { code: 'TT-2025-029', name: 'Clara Lindqvist', initials: 'CL', role: 'Lead Product Designer', dept: 'Product' as Department, date: 'Aug 18, 2025', mgr: 'Elena Rostova', bg: 'bg-teal-900', text: 'text-teal-200', md: 'Verified in Personio' },
    { code: 'TT-2025-028', name: 'Marcus Vance', initials: 'MV', role: 'Principal Engineer', dept: 'Engineering' as Department, date: 'Jul 07, 2025', mgr: 'CEO', bg: 'bg-slate-900', text: 'text-sky-300', md: 'Verified in Personio' },
    { code: 'TT-2025-027', name: 'Henrik Bauer', initials: 'HB', role: 'Enterprise AE', dept: 'Sales' as Department, date: 'Jul 21, 2025', mgr: 'Elena Rostova', bg: 'bg-amber-950', text: 'text-amber-200', md: 'Verified in Personio' },
    { code: 'TT-2025-026', name: 'Sofia Rossi', initials: 'SR', role: 'Performance Marketer', dept: 'Marketing' as Department, date: 'Jun 09, 2025', mgr: 'Sarah Chen', bg: 'bg-fuchsia-900', text: 'text-fuchsia-200', md: 'Verified in Personio' },
    { code: 'TT-2025-025', name: 'Daniel Kim', initials: 'DK', role: 'Platform SRE', dept: 'Engineering' as Department, date: 'Jun 02, 2025', mgr: 'Marcus Vance', bg: 'bg-cyan-900', text: 'text-cyan-200', md: 'Verified in Personio' },
    { code: 'TT-2025-024', name: 'Hannah Brooks', initials: 'HB', role: 'Talent Acquisition Lead', dept: 'People & HR' as Department, date: 'May 19, 2025', mgr: 'Elena Rostova', bg: 'bg-emerald-950', text: 'text-emerald-200', md: 'Verified in Personio' },
    { code: 'TT-2025-023', name: 'Mateo Silva', initials: 'MS', role: 'Product Manager', dept: 'Product' as Department, date: 'May 05, 2025', mgr: 'Elena Rostova', bg: 'bg-violet-900', text: 'text-violet-200', md: 'Verified in Personio' },
    { code: 'TT-2025-022', name: 'Olivia Grant', initials: 'OG', role: 'Brand Designer', dept: 'Marketing' as Department, date: 'Apr 14, 2025', mgr: 'Sarah Chen', bg: 'bg-orange-900', text: 'text-orange-200', md: 'Verified in Personio' },
    { code: 'TT-2025-021', name: 'Lukas Meyer', initials: 'LM', role: 'Frontend Engineer', dept: 'Engineering' as Department, date: 'Apr 01, 2025', mgr: 'Marcus Vance', bg: 'bg-blue-950', text: 'text-blue-200', md: 'Verified in Personio' },
    { code: 'TT-2025-020', name: 'Amara Okafor', initials: 'AO', role: 'Partnerships Manager', dept: 'Sales' as Department, date: 'Mar 17, 2025', mgr: 'Henrik Bauer', bg: 'bg-stone-900', text: 'text-stone-200', md: 'Verified in Personio' },
    { code: 'TT-2025-019', name: 'Felix Richter', initials: 'FR', role: 'Data Engineer', dept: 'Engineering' as Department, date: 'Mar 03, 2025', mgr: 'Marcus Vance', bg: 'bg-zinc-900', text: 'text-zinc-200', md: 'Verified in Personio' },
    { code: 'TT-2025-018', name: 'Chloe Dubois', initials: 'CD', role: 'Product Researcher', dept: 'Product' as Department, date: 'Feb 17, 2025', mgr: 'Clara Lindqvist', bg: 'bg-pink-900', text: 'text-pink-200', md: 'Verified in Personio' },
    { code: 'TT-2025-017', name: 'Noah Lindholm', initials: 'NL', role: 'Account Strategist', dept: 'Sales' as Department, date: 'Feb 03, 2025', mgr: 'Henrik Bauer', bg: 'bg-lime-900', text: 'text-lime-200', md: 'Verified in Personio' },
    { code: 'TT-2025-016', name: 'Zoe Mercer', initials: 'ZM', role: 'Lifecycle Marketer', dept: 'Marketing' as Department, date: 'Jan 20, 2025', mgr: 'Sarah Chen', bg: 'bg-sky-900', text: 'text-sky-200', md: 'Verified in Personio' },
    { code: 'TT-2025-015', name: 'Elena Rostova', initials: 'ER', role: 'Head of People & Ops', dept: 'People & HR' as Department, date: 'Jan 06, 2025', mgr: 'CEO', bg: 'bg-slate-900', text: 'text-amber-300', md: 'Synced (Legacy Admin)' },
  ].map((item, idx): EmployeeRecord => ({
    id: `emp-${10 + idx}`,
    employeeCode: item.code,
    name: item.name,
    initials: item.initials,
    avatarBg: item.bg,
    avatarText: item.text,
    email: `${item.name.toLowerCase().replace(/[^a-z]+/g, '.')}@traintoday.com`,
    personalEmail: `${item.name.toLowerCase().replace(/[^a-z]+/g, '.')}@gmail.com`,
    role: item.role,
    department: item.dept,
    teamLabel: DEPT_TEAM_MAP[item.dept],
    startDate: item.date,
    manager: item.mgr,
    masterdataStatus: item.md,
    masterdataTone: 'emerald',
    status: 'Completed',
    accessMatrix: [
      { key: 'G', label: 'Google Workspace', state: 'active', tooltip: 'Google Workspace: Active' },
      { key: 'S', label: 'Slack', state: 'active', tooltip: 'Slack: Active' },
      { key: 'N', label: 'Notion', state: 'active', tooltip: 'Notion: Active' },
      { key: 'P', label: 'Personio', state: 'active', tooltip: 'Personio: Active' },
      { key: 'NP', label: 'NordPass', state: 'active', tooltip: 'NordPass: Active' },
    ],
    tasks: buildEmployeeTasks(item.dept, 18, []),
  })),
];
