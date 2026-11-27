import React, { useState, useEffect } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import {
  ColumnKey,
  Department,
  EmployeeRecord,
  OnboardingTask,
  TaskStatus,
} from '../types/onboarding';
import { getEmployeeProgress } from '../data/seedData';

interface CommandCenterProps {
  employees: EmployeeRecord[];
  selectedEmployee: EmployeeRecord;
  onSelectEmployee: (employeeId: string) => void;
  onUpdateTaskStatus: (employeeId: string, taskId: string, status: TaskStatus) => void;
}

type DeptFilterValue = 'General' | Department;

interface ColumnMeta {
  key: ColumnKey;
  code: string;
  title: string;
  subtitle: string;
  badgeText: string;
  badgeTone: 'slate' | 'blue' | 'emerald' | 'purple';
  tooltip: string;
  showGeneralHeading?: boolean;
}

const COLUMNS: ColumnMeta[] = [
  {
    key: 'masterdata',
    code: '01 · MASTERDATA',
    title: 'Employee Master Data',
    subtitle: 'Core employee record & documents',
    badgeText: 'Manual HR Confirmation',
    badgeTone: 'slate',
    tooltip:
      'Requires manual human sign-off on Personio by HR Manager (Elena Rostova). Not auto-dispatched without signed contract.',
  },
  {
    key: 'it',
    code: '02 · PROVISIONING',
    title: 'IT',
    subtitle: 'Identity, tooling & credential vaults',
    badgeText: 'IT Provisioning Agent',
    badgeTone: 'blue',
    tooltip:
      'Subagent #2 active: Automated Google Workspace, Slack, and Notion provisioning executed.',
  },
  {
    key: 'calendar',
    code: '03 · CALENDAR',
    title: 'Welcome and Scheduling',
    subtitle: 'Welcome kits & calendar milestones',
    badgeText: 'Scheduling Agent',
    badgeTone: 'emerald',
    tooltip:
      'Subagent #3 active: Automated Google Calendar meeting invites synced. Welcome swag shipment tracked.',
  },
  {
    key: 'comms',
    code: '04 · COMMS',
    title: 'Communication and Assignment',
    subtitle: 'Announcements, buddies & training',
    badgeText: 'Comms & Buddy Agent',
    badgeTone: 'purple',
    tooltip:
      'Subagent #4 active: Day 1 welcome email dispatch, manager notifications, and buddy introductions triggered.',
    showGeneralHeading: true,
  },
];

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  completed: 'pending',
  pending: 'blocked',
  blocked: 'completed',
};

export const CommandCenter: React.FC<CommandCenterProps> = ({
  employees,
  selectedEmployee,
  onSelectEmployee,
  onUpdateTaskStatus,
}) => {
  const [deptFilter, setDeptFilter] = useState<DeptFilterValue>(selectedEmployee.department);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Sync department dropdown when switching to a different employee
  useEffect(() => {
    setDeptFilter(selectedEmployee.department);
    setExpandedTaskId(null);
  }, [selectedEmployee.id, selectedEmployee.department]);

  const progress = getEmployeeProgress(selectedEmployee);
  const activeOnboardingCount = employees.filter((e) => e.status === 'In Progress').length;

  const badgeStyleMap: Record<ColumnMeta['badgeTone'], { wrap: string; dot: string }> = {
    slate: {
      wrap: 'bg-slate-100 text-slate-700 border border-slate-300',
      dot: 'bg-slate-600',
    },
    blue: {
      wrap: 'bg-blue-100 text-blue-800 border border-blue-200',
      dot: 'bg-blue-500 animate-pulse',
    },
    emerald: {
      wrap: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      dot: 'bg-emerald-500 animate-pulse',
    },
    purple: {
      wrap: 'bg-purple-100 text-purple-800 border border-purple-200',
      dot: 'bg-purple-500 animate-pulse',
    },
  };

  const renderTaskCard = (task: OnboardingTask, isDeptBucket: boolean) => {
    const isExpanded = expandedTaskId === task.id;

    const cardBorderBg = isDeptBucket
      ? task.status === 'blocked'
        ? 'bg-rose-50/40 border-rose-200'
        : 'bg-amber-50/40 border-amber-200/80 hover:border-amber-300'
      : task.status === 'pending'
      ? 'bg-amber-50/20 border-amber-200 hover:border-amber-300'
      : task.status === 'blocked'
      ? 'bg-rose-50/20 border-rose-200 hover:border-rose-300'
      : 'bg-white border-slate-200/80 hover:border-slate-300';

    const statusBadge =
      task.status === 'completed'
        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
        : task.status === 'pending'
        ? 'bg-amber-50 text-amber-600 border-amber-200'
        : 'bg-rose-50 text-rose-600 border-rose-200';

    const statusGlyph =
      task.status === 'completed' ? '✓' : task.status === 'pending' ? '⋯' : '✕';

    return (
      <div
        key={task.id}
        className={`${isDeptBucket ? 'p-2' : 'p-2.5'} rounded-xl border shadow-xs transition-all ${cardBorderBg}`}
      >
        <div className="flex items-center justify-between text-xs gap-2">
          <div className="flex items-center space-x-2 min-w-0">
            <button
              type="button"
              onClick={() =>
                onUpdateTaskStatus(
                  selectedEmployee.id,
                  task.id,
                  NEXT_STATUS[task.status]
                )
              }
              title="Click to cycle status (Done / Pending / Blocked)"
              className={`${
                isDeptBucket ? 'w-4 h-4 text-[9px]' : 'w-5 h-5 text-[10px]'
              } rounded-md flex items-center justify-center font-bold border shrink-0 cursor-pointer hover:scale-110 transition-transform ${statusBadge}`}
            >
              {statusGlyph}
            </button>
            <button
              type="button"
              onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
              className="font-medium text-slate-800 text-left truncate hover:text-slate-950 cursor-pointer"
            >
              {task.title}
            </button>
          </div>

          <button
            type="button"
            title={task.note}
            onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
            className="text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer p-0.5"
            aria-label={`Details for ${task.title}`}
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>

        {isExpanded && (
          <div className="mt-2 pt-2 border-t border-slate-200/70 text-[11px] text-slate-600 space-y-2">
            <p className="leading-snug">{task.note}</p>
            <div className="flex items-center gap-1">
              {(['completed', 'pending', 'blocked'] as TaskStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => onUpdateTaskStatus(selectedEmployee.id, task.id, st)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize cursor-pointer border transition-colors ${
                    task.status === st
                      ? st === 'completed'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : st === 'pending'
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-rose-600 text-white border-rose-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1">
      {/* Header Section with Title, Badges & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2.5 mb-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100/90 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              n8n Onboarding Automation Active
            </span>
            <span className="text-xs font-mono text-slate-500">Pipeline: v2.4</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-display text-slate-900">
            Onboarding Command Center
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Live employee onboarding workflow automation. Track progress, execute IT provisioning,
            and trigger n8n subagents in real time.
          </p>
        </div>

        {/* Right Side Filters & Stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Interactive Department & General Filters */}
          <div className="flex items-center bg-[#ede8dc] p-1 rounded-xl border border-[#ded7c6] shadow-inner text-xs font-medium">
            <button
              type="button"
              onClick={() => setDeptFilter('General')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                deptFilter === 'General'
                  ? 'bg-white text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              General
            </button>
            <div className="relative">
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value as DeptFilterValue)}
                aria-label="Filter tasks by department"
                className="appearance-none bg-white text-slate-900 font-semibold px-3 py-1.5 pr-7 rounded-lg shadow-sm border border-[#d6cfbe] text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                <option value="Marketing">Department: Marketing</option>
                <option value="General">Department: General Only</option>
                <option value="Engineering">Department: Engineering</option>
                <option value="Product">Department: Product</option>
                <option value="Sales">Department: Sales</option>
                <option value="People & HR">Department: People & HR</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Metric Badges */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            <span className="px-3 py-1.5 rounded-lg bg-white/90 border border-[#e2dccf] text-xs font-semibold text-slate-700 shadow-sm tabular-nums">
              Active: <span className="font-bold text-slate-900">{activeOnboardingCount} Onboardings</span>
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-sm flex items-center space-x-1 tabular-nums">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Completed: {progress.percent}%</span>
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 shadow-sm flex items-center space-x-1 tabular-nums">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Blocked: {progress.blockedCount}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Active Employee Card Banner */}
      <div className="bg-white rounded-2xl p-4 mb-6 border border-[#e5dfd2] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div
            className={`w-12 h-12 rounded-xl ${selectedEmployee.avatarBg} ${selectedEmployee.avatarText} font-display font-bold text-base flex items-center justify-center shadow-sm shrink-0`}
          >
            {selectedEmployee.initials}
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
              <div className="relative inline-flex items-center">
                <select
                  value={selectedEmployee.id}
                  onChange={(e) => onSelectEmployee(e.target.value)}
                  aria-label="Select employee onboarding checklist"
                  className="appearance-none bg-transparent pr-5 text-base font-bold text-slate-900 cursor-pointer focus:outline-none hover:text-slate-700"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none -ml-4" />
              </div>
              <span className="text-xs text-slate-500 font-medium">·</span>
              <span className="text-xs text-slate-600 font-medium">{selectedEmployee.role}</span>
              {selectedEmployee.startBadge ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {selectedEmployee.startBadge}
                </span>
              ) : (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    selectedEmployee.status === 'Blocked'
                      ? 'bg-rose-100 text-rose-800 border-rose-200'
                      : selectedEmployee.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border-amber-200'
                  }`}
                >
                  {selectedEmployee.status}
                </span>
              )}
            </div>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500 mt-0.5">
              <span>
                Manager:{' '}
                <strong className="text-slate-700 font-medium">{selectedEmployee.manager}</strong>
              </span>
              <span>•</span>
              <span>{selectedEmployee.teamLabel}</span>
              <span>•</span>
              <span className="font-mono text-[11px]">ID: {selectedEmployee.employeeCode}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-left md:text-right w-full md:w-auto">
            <div className="text-xs font-semibold text-slate-500 tabular-nums">
              Progress:{' '}
              <span className="text-slate-900 font-bold">
                {progress.completed}/{progress.total} ({progress.percent}%)
              </span>
            </div>
            <div className="w-full md:w-48 bg-[#ede8dc] h-2 rounded-full overflow-hidden mt-1.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  selectedEmployee.status === 'Blocked' && progress.percent < 40
                    ? 'bg-rose-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4-Column Board Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {COLUMNS.map((col) => {
          const columnTasks = selectedEmployee.tasks.filter((t) => t.column === col.key);
          const generalTasks = columnTasks.filter((t) => t.scope === 'general');
          const deptTasks =
            deptFilter === 'General'
              ? []
              : columnTasks.filter((t) => t.scope === deptFilter);

          const groupLabel = deptTasks[0]?.groupLabel;
          const deptCode = deptTasks[0]?.deptCode;
          const badgeStyle = badgeStyleMap[col.badgeTone];

          return (
            <div
              key={col.key}
              className="bg-[#faf8f4] border border-[#e5dfd2] rounded-2xl p-4 flex flex-col space-y-3 shadow-sm min-h-[520px]"
            >
              <div className="border-b border-[#e9e3d7] pb-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase whitespace-nowrap">
                    {col.code}
                  </span>

                  <div className="group relative cursor-pointer shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center space-x-1 whitespace-nowrap ${badgeStyle.wrap}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
                      <span>{col.badgeText}</span>
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-6 z-30 w-56 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl pointer-events-none leading-snug">
                      {col.tooltip}
                    </div>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{col.title}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{col.subtitle}</p>
              </div>

              <div className="space-y-2 flex-1">
                {col.showGeneralHeading && (
                  <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                    General Tasks
                  </div>
                )}

                {generalTasks.map((task) => renderTaskCard(task, false))}

                {deptTasks.length > 0 && (
                  <div className="pt-2 border-t border-[#ede7db] mt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-amber-700 tracking-wide uppercase flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>{groupLabel}</span>
                      </span>
                      {deptCode && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                          {deptCode}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      {deptTasks.map((task) => renderTaskCard(task, true))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};
