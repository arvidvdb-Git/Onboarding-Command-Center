import React, { useState, useMemo } from 'react';
import { RefreshCw, Download, Search, RotateCcw } from 'lucide-react';
import { Department, EmployeeRecord, OnboardingStatus } from '../types/onboarding';
import { getEmployeeProgress } from '../data/seedData';

interface EmployeeDirectoryProps {
  employees: EmployeeRecord[];
  syncStatus: 'idle' | 'syncing' | 'synced';
  lastSyncedLabel: string;
  onSync: () => void;
  onOpenChecklist: (employee: EmployeeRecord) => void;
}

const PAGE_SIZE = 5;

export const EmployeeDirectory: React.FC<EmployeeDirectoryProps> = ({
  employees,
  syncStatus,
  lastSyncedLabel,
  onSync,
  onOpenChecklist,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState<'All' | Department>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | OnboardingStatus>('All');
  const [currentPage, setCurrentPage] = useState(1);

  const kpis = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((e) => e.status === 'In Progress').length;
    const masterdataCompleted = employees.filter(
      (e) => e.masterdataStatus === 'Verified in Personio'
    ).length;
    const blocked = employees.filter((e) => e.status === 'Blocked').length;
    return { total, active, masterdataCompleted, blocked };
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return employees.filter((emp) => {
      const matchesQuery =
        !query ||
        emp.name.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.role.toLowerCase().includes(query) ||
        emp.manager.toLowerCase().includes(query) ||
        emp.department.toLowerCase().includes(query) ||
        emp.teamLabel.toLowerCase().includes(query);

      const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
      const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
      return matchesQuery && matchesDept && matchesStatus;
    });
  }, [employees, searchTerm, deptFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedEmployees = filteredEmployees.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const resetFilters = () => {
    setSearchTerm('');
    setDeptFilter('All');
    setStatusFilter('All');
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const headers = [
      'Employee ID',
      'Name',
      'Email',
      'Role',
      'Department',
      'Start Date',
      'Manager',
      'Masterdata Status',
      'Onboarding Status',
      'Progress',
    ];
    const rows = filteredEmployees.map((emp) => {
      const p = getEmployeeProgress(emp);
      return [
        emp.employeeCode,
        emp.name,
        emp.email,
        emp.role,
        emp.department,
        emp.startDate,
        emp.manager,
        emp.masterdataStatus,
        emp.status,
        `${p.completed}/${p.total} (${p.percent}%)`,
      ]
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'train-today-employee-masterdata.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const deptLabelColor = (dept: Department) => {
    if (dept === 'Engineering') return 'text-blue-700';
    if (dept === 'Product') return 'text-purple-700';
    if (dept === 'People & HR') return 'text-emerald-700';
    return 'text-amber-700';
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1">
      {/* Title & Data Source Integration Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2.5 mb-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100/90 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              n8n Masterdata Sync v2.4
            </span>
            <span className="text-xs font-mono text-slate-500">Pipeline: Connected</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-display text-slate-900">
            Employee Directory & Masterdata
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Live database synced via n8n automation webhook. Manage operational records, trigger
            instant IT onboarding workflows, and sync across HR tools in real time.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            type="button"
            onClick={onSync}
            disabled={syncStatus === 'syncing'}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 bg-white border border-[#dfd9cc] hover:bg-slate-50 shadow-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-70"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-slate-500 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`}
            />
            <span>
              {syncStatus === 'syncing' ? 'Syncing...' : `Sync Now (${lastSyncedLabel})`}
            </span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 bg-white border border-[#dfd9cc] hover:bg-slate-50 shadow-xs flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV / JSON</span>
          </button>
        </div>
      </div>

      {/* Live Pipeline Architecture Indicator */}
      <div className="bg-white/80 border border-[#e5dfd2] rounded-xl px-4 py-2.5 mb-6 flex flex-wrap items-center justify-between text-xs text-slate-600 shadow-xs gap-2">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-slate-700">Active Pipeline:</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
            Notion Database (Live Sync)
          </span>
        </div>
        <div className="flex items-center space-x-4 text-[11px] font-mono text-slate-500">
          <span className="flex items-center space-x-1 text-emerald-700 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>HTTP 200 OK</span>
          </span>
          <span>•</span>
          <span>Latency: 142ms</span>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-[#e5dfd2] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-bold tracking-wider uppercase text-[10px] text-slate-400">
              TOTAL IN PIPELINE
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
              👥
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-display text-slate-900 tabular-nums">
              {kpis.total}
            </div>
            <div className="flex items-center space-x-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <span>↗ 3 records this month</span>
            </div>
          </div>
          <div className="w-full bg-[#f1ede2] h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-slate-900 h-full rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e5dfd2] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-bold tracking-wider uppercase text-[10px] text-slate-400">
              ACTIVE ONBOARDING
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs">
              ⏳
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-display text-slate-900 tabular-nums">
              {kpis.active}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Employees in progress right now
            </div>
          </div>
          <div className="w-full bg-[#f1ede2] h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-amber-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.round((kpis.active / Math.max(1, kpis.total)) * 100) + 10)}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e5dfd2] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-bold tracking-wider uppercase text-[10px] text-slate-400">
              MASTERDATA COMPLETED
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
              🛡️
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-display text-slate-900 tabular-nums">
              {kpis.masterdataCompleted}
            </div>
            <div className="flex items-center space-x-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <span>✓ Verified & synced in Personio</span>
            </div>
          </div>
          <div className="w-full bg-[#f1ede2] h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${Math.round((kpis.masterdataCompleted / Math.max(1, kpis.total)) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e5dfd2] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-bold tracking-wider uppercase text-[10px] text-slate-400">
              BLOCKED / ACTION NEEDED
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700 font-bold text-xs">
              ⚠️
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-display text-rose-600 tabular-nums">
              {kpis.blocked}
            </div>
            <div className="text-[11px] text-rose-700 font-medium mt-1">
              ⚠ Tasks pending IT device approval
            </div>
          </div>
          <div className="w-full bg-[#f1ede2] h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-rose-500 h-full rounded-full transition-all"
              style={{ width: `${kpis.blocked === 0 ? 0 : Math.max(12, Math.round((kpis.blocked / Math.max(1, kpis.total)) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filters, Search & Bulk Actions Bar */}
      <div className="bg-white rounded-2xl p-3 mb-4 border border-[#e5dfd2] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search employee, role, email, manager..."
            className="w-full bg-[#fbf9f4] border border-[#e2dccf] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end text-xs">
          <select
            value={deptFilter}
            onChange={(e) => {
              setDeptFilter(e.target.value as 'All' | Department);
              setCurrentPage(1);
            }}
            aria-label="Filter by department"
            className="bg-[#fbf9f4] border border-[#e2dccf] rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
          >
            <option value="All">All Departments</option>
            <option value="Marketing">Marketing</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Sales">Sales</option>
            <option value="People & HR">People & HR</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as 'All' | OnboardingStatus);
              setCurrentPage(1);
            }}
            aria-label="Filter by status"
            className="bg-[#fbf9f4] border border-[#e2dccf] rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Blocked">Blocked</option>
          </select>

          <button
            type="button"
            onClick={resetFilters}
            title="Reset Filters"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-[#ede8dc] border border-[#e2dccf] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Employee Database Table */}
      <div className="bg-white rounded-2xl border border-[#e5dfd2] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#faf8f4] border-b border-[#e5dfd2] text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">EMPLOYEE</th>
                <th className="py-3 px-4">DEPARTMENT & ROLE</th>
                <th className="py-3 px-4">START & MANAGER</th>
                <th className="py-3 px-4">MASTERDATA STATUS</th>
                <th className="py-3 px-4">ONBOARDING</th>
                <th className="py-3 px-4">ACCESS MATRIX</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ede7db]">
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 px-4 text-center text-slate-500">
                    <div className="font-semibold text-slate-700 mb-1">
                      No matching employee records found
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3">
                      Try adjusting your search query, department filter, or onboarding status.
                    </p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp) => {
                  const progress = getEmployeeProgress(emp);

                  const masterdataPill =
                    emp.masterdataTone === 'emerald'
                      ? {
                          wrap: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                          dot: 'bg-emerald-500',
                        }
                      : emp.masterdataTone === 'rose'
                      ? {
                          wrap: 'bg-rose-100 text-rose-800 border-rose-200',
                          dot: 'bg-rose-500',
                        }
                      : {
                          wrap: 'bg-amber-100 text-amber-800 border-amber-200',
                          dot: 'bg-amber-500',
                        };

                  const progressBarColor =
                    emp.status === 'Blocked'
                      ? 'bg-rose-500'
                      : emp.status === 'Completed' || progress.percent >= 75
                      ? 'bg-emerald-500'
                      : 'bg-amber-500';

                  return (
                    <tr key={emp.id} className="hover:bg-[#fbf9f4] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-lg ${emp.avatarBg} ${emp.avatarText} font-bold text-xs flex items-center justify-center shrink-0`}
                          >
                            {emp.initials}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{emp.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{emp.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{emp.role}</div>
                        <div className={`text-[11px] font-medium ${deptLabelColor(emp.department)}`}>
                          {emp.teamLabel}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-mono font-semibold text-slate-900 tabular-nums">
                          {emp.startDate}
                        </div>
                        <div className="text-[11px] text-slate-500">Manager: {emp.manager}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${masterdataPill.wrap}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${masterdataPill.dot}`} />
                          {emp.masterdataStatus}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-[#ede8dc] h-1.5 rounded-full overflow-hidden shrink-0">
                            <div
                              className={`${progressBarColor} h-full rounded-full transition-all`}
                              style={{ width: `${progress.percent}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] text-slate-700 font-bold tabular-nums whitespace-nowrap">
                            {progress.completed}/{progress.total} ({progress.percent}%)
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1.5">
                          {emp.accessMatrix.map((item) => {
                            const stateClass =
                              item.state === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : item.state === 'pending'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : item.state === 'blocked'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-slate-100 text-slate-400 border-slate-200';

                            return (
                              <div key={item.key} className="group relative">
                                <span
                                  className={`w-6 h-6 rounded-md font-mono font-bold text-[10px] flex items-center justify-center border cursor-pointer hover:scale-110 transition-transform ${stateClass}`}
                                >
                                  {item.key}
                                </span>
                                <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity absolute bottom-8 left-1/2 -translate-x-1/2 z-50 px-2 py-1 bg-slate-900 text-white text-[10px] rounded shadow-lg whitespace-nowrap pointer-events-none">
                                  {item.tooltip}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        {emp.status === 'Blocked' ? (
                          <button
                            type="button"
                            onClick={() => onOpenChecklist(emp)}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-semibold text-[11px] hover:bg-rose-700 transition-all shadow-xs whitespace-nowrap cursor-pointer"
                          >
                            Resolve ⚠
                          </button>
                        ) : emp.status === 'Completed' ? (
                          <button
                            type="button"
                            onClick={() => onOpenChecklist(emp)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px] hover:bg-slate-200 transition-all border border-slate-300 whitespace-nowrap cursor-pointer"
                          >
                            Review →
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onOpenChecklist(emp)}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-semibold text-[11px] hover:bg-slate-800 transition-all shadow-xs whitespace-nowrap cursor-pointer"
                          >
                            Checklist →
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="bg-[#faf8f4] border-t border-[#e5dfd2] px-4 py-3 flex items-center justify-between text-xs text-slate-500">
          <div className="tabular-nums">
            Showing <span className="font-semibold text-slate-800">{paginatedEmployees.length}</span>{' '}
            of <span className="font-semibold text-slate-800">{filteredEmployees.length}</span> active
            employees
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded-lg border border-[#e2dccf] bg-white text-slate-600 hover:bg-[#ede8dc] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-2 text-slate-700 font-medium tabular-nums">
              Page {safePage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 rounded-lg border border-[#e2dccf] bg-white text-slate-600 hover:bg-[#ede8dc] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
