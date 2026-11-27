import { useState, useEffect, useMemo } from 'react';
import {
  Department,
  EmployeeRecord,
  OnboardingStatus,
  ScreenView,
  TaskStatus,
} from './types/onboarding';
import {
  INITIAL_EMPLOYEES,
  createDefaultTasksForEmployee,
  getEmployeeProgress,
} from './data/seedData';
import { Navbar } from './components/Navbar';
import { CommandCenter } from './components/CommandCenter';
import { EmployeeDirectory } from './components/EmployeeDirectory';
import { NewEmployeeModal, NewEmployeePayload } from './components/NewEmployeeModal';
import { AssistantDrawer } from './components/AssistantDrawer';
import { WebhooksModal } from './components/WebhooksModal';

const STORAGE_KEY = 'train-today-onboarding-v1';

const TEAM_LABELS: Record<Department, string> = {
  Marketing: 'Growth & Marketing',
  Engineering: 'Core Platform',
  Product: 'Design Systems',
  Sales: 'B2B Partnerships',
  'People & HR': 'People Operations',
};

const AVATAR_STYLES: Record<Department, { bg: string; text: string }> = {
  Marketing: { bg: 'bg-slate-900', text: 'text-amber-300' },
  Engineering: { bg: 'bg-blue-900', text: 'text-blue-200' },
  Product: { bg: 'bg-purple-900', text: 'text-purple-200' },
  Sales: { bg: 'bg-amber-900', text: 'text-amber-200' },
  'People & HR': { bg: 'bg-emerald-900', text: 'text-emerald-200' },
};

function getInitialView(): ScreenView {
  if (typeof window !== 'undefined' && window.location.hash === '#directory') {
    return 'directory';
  }
  return 'command-center';
}

export default function App() {
  const [activeView, setActiveView] = useState<ScreenView>(getInitialView);
  const [employees, setEmployees] = useState<EmployeeRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_EMPLOYEES;
  });

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('emp-1');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [lastSyncedLabel, setLastSyncedLabel] = useState('2 mins ago');
  const [isNewEmployeeOpen, setIsNewEmployeeOpen] = useState(false);
  const [isWebhooksOpen, setIsWebhooksOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    } catch {
      // ignore storage quota errors
    }
  }, [employees]);

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash === '#directory') {
        setActiveView('directory');
      } else if (window.location.hash === '#command-center') {
        setActiveView('command-center');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  const handleSelectView = (view: ScreenView) => {
    setActiveView(view);
    window.location.hash = view === 'directory' ? '#directory' : '#command-center';
  };

  const selectedEmployee = useMemo(
    () => employees.find((e) => e.id === selectedEmployeeId) ?? employees[0],
    [employees, selectedEmployeeId]
  );

  const handleSync = () => {
    setSyncStatus('syncing');
    window.setTimeout(() => {
      setSyncStatus('synced');
      setLastSyncedLabel('Just now');
      showToast('Notion & Personio Masterdata synced via n8n webhook.');
    }, 900);
  };

  const handleUpdateTaskStatus = (
    employeeId: string,
    taskId: string,
    nextStatus: TaskStatus
  ) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== employeeId) return emp;

        const updatedTasks = emp.tasks.map((t) =>
          t.id === taskId ? { ...t, status: nextStatus } : t
        );

        const nextEmpDraft: EmployeeRecord = {
          ...emp,
          tasks: updatedTasks,
        };

        const progress = getEmployeeProgress(nextEmpDraft);

        let nextStatusValue: OnboardingStatus = emp.status;
        if (progress.completed === progress.total && progress.blockedCount === 0) {
          nextStatusValue = 'Completed';
        } else if (progress.blockedCount > 0 && emp.id !== 'emp-1') {
          nextStatusValue = 'Blocked';
        } else {
          nextStatusValue = 'In Progress';
        }

        const personioDone = updatedTasks
          .filter((t) => t.column === 'masterdata' && t.id !== 'md-4')
          .every((t) => t.status === 'completed');

        const nextMasterdataStatus =
          emp.masterdataStatus === 'Synced (Legacy Admin)'
            ? emp.masterdataStatus
            : personioDone
            ? 'Verified in Personio'
            : updatedTasks.some((t) => t.column === 'masterdata' && t.status === 'blocked')
            ? 'Contract Pending Signature'
            : 'Pending HR Leave Setup';

        const nextMasterdataTone =
          nextMasterdataStatus === 'Verified in Personio' ||
          nextMasterdataStatus === 'Synced (Legacy Admin)'
            ? 'emerald'
            : nextMasterdataStatus === 'Contract Pending Signature'
            ? 'rose'
            : 'amber';

        return {
          ...nextEmpDraft,
          status: nextStatusValue,
          masterdataStatus: nextMasterdataStatus,
          masterdataTone: nextMasterdataTone,
        };
      })
    );
  };

  const handleOpenChecklist = (employee: EmployeeRecord) => {
    setSelectedEmployeeId(employee.id);
    showToast(`Opening ${employee.name}'s onboarding checklist in Command Center...`);
    handleSelectView('command-center');
  };

  const handleCreateEmployee = (payload: NewEmployeePayload) => {
    const parts = payload.name.split(/\s+/).filter(Boolean);
    const initials =
      parts.length >= 2
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : payload.name.slice(0, 2).toUpperCase();

    const style = AVATAR_STYLES[payload.department];
    const nextCodeNum = 48 + employees.length;
    const newId = `emp-${Date.now()}`;

    const tasks = createDefaultTasksForEmployee(payload.department, 'in-progress-early').slice(
      0,
      18
    );

    const newEmployee: EmployeeRecord = {
      id: newId,
      employeeCode: `TT-2025-0${nextCodeNum}`,
      name: payload.name,
      initials,
      avatarBg: style.bg,
      avatarText: style.text,
      email: payload.companyEmail,
      personalEmail: payload.personalEmail,
      role: payload.role,
      department: payload.department,
      teamLabel: TEAM_LABELS[payload.department],
      startDate: payload.startDate,
      startBadge: 'Pipeline Initialized',
      manager: payload.manager,
      masterdataStatus: 'Pending HR Leave Setup',
      masterdataTone: 'amber',
      status: 'In Progress',
      accessMatrix: [
        { key: 'G', label: 'Google Workspace', state: 'active', tooltip: 'Google Workspace: Active' },
        { key: 'S', label: 'Slack', state: 'active', tooltip: 'Slack: Invite sent' },
        { key: 'N', label: 'Notion', state: 'active', tooltip: 'Notion: Workspace Member' },
        { key: 'P', label: 'Personio', state: 'pending', tooltip: 'Personio: Pending HR review' },
        { key: 'NP', label: 'NordPass', state: 'pending', tooltip: 'NordPass: Queued by IT Agent' },
      ],
      tasks,
    };

    setEmployees((prev) => [newEmployee, ...prev]);
    setSelectedEmployeeId(newId);
    handleSelectView('command-center');
    showToast(`n8n Webhook Triggered: Onboarding pipeline initialized for ${payload.name}!`);
  };

  const handleTriggerMasterdataSync = (employeeId: string) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== employeeId) return emp;
        const updatedTasks = emp.tasks.map((t) =>
          t.column === 'masterdata' && t.id !== 'md-4'
            ? { ...t, status: 'completed' as TaskStatus }
            : t
        );
        return {
          ...emp,
          masterdataStatus: 'Verified in Personio',
          masterdataTone: 'emerald',
          tasks: updatedTasks,
        };
      })
    );
    showToast('Masterdata synced with Personio & Notion.');
  };

  const handleResetDemoData = () => {
    setEmployees(INITIAL_EMPLOYEES);
    setSelectedEmployeeId('emp-1');
    localStorage.removeItem(STORAGE_KEY);
    showToast('Restored default 24-employee Train Today onboarding dataset.');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f6f4ee] text-[#0f172a] selection:bg-amber-200 selection:text-slate-900">
      <Navbar
        activeView={activeView}
        onSelectView={handleSelectView}
        totalEmployees={employees.length}
        syncStatus={syncStatus}
        onSync={handleSync}
        onOpenNewEmployee={() => setIsNewEmployeeOpen(true)}
        onResetDemoData={handleResetDemoData}
      />

      {activeView === 'command-center' ? (
        <CommandCenter
          employees={employees}
          selectedEmployee={selectedEmployee}
          onSelectEmployee={setSelectedEmployeeId}
          onUpdateTaskStatus={handleUpdateTaskStatus}
        />
      ) : (
        <EmployeeDirectory
          employees={employees}
          syncStatus={syncStatus}
          lastSyncedLabel={lastSyncedLabel}
          onSync={handleSync}
          onOpenChecklist={handleOpenChecklist}
        />
      )}

      {/* Footer */}
      <footer className="w-full bg-[#f6f4ee] border-t border-[#e5e0d4] px-4 sm:px-6 py-3 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">Train Today</span>
            <span>•</span>
            <span>
              {activeView === 'command-center'
                ? 'Employee Onboarding Automation Hub'
                : 'Employee Onboarding & Masterdata Automation'}
            </span>
          </div>

          {activeView === 'command-center' ? (
            <div className="flex items-center space-x-4 pr-0 sm:pr-40">
              <span>Powered by n8n Workflows</span>
              <button
                type="button"
                onClick={() => setIsWebhooksOpen(true)}
                className="hover:text-slate-800 underline underline-offset-2 cursor-pointer"
              >
                API Webhooks Config
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Connected to Notion Database &amp; n8n</span>
              </span>
            </div>
          )}
        </div>
      </footer>

      {/* Floating n8n AI Assistant on Command Center (and accessible globally) */}
      {activeView === 'command-center' && (
        <AssistantDrawer
          selectedEmployee={selectedEmployee}
          onTriggerMasterdataSync={handleTriggerMasterdataSync}
        />
      )}

      {/* New Employee Trigger Modal */}
      <NewEmployeeModal
        isOpen={isNewEmployeeOpen}
        onClose={() => setIsNewEmployeeOpen(false)}
        onSubmit={handleCreateEmployee}
      />

      {/* API Webhooks Config Modal */}
      <WebhooksModal
        isOpen={isWebhooksOpen}
        onClose={() => setIsWebhooksOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs flex items-center space-x-2 border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
