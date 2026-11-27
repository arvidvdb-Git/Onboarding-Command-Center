import React, { useState } from 'react';
import { RefreshCw, UserPlus, ClipboardList, Database, RotateCcw } from 'lucide-react';
import { ScreenView } from '../types/onboarding';

const LOGO_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA_PSJjFZU4-IBk9drQGln5l9sCnTJkQJD1bcRDfMFa0zBKgr8X23tvUULhlg8DozcR57xiS_HAXfgbxzfoRX6Fws-JyUIpOA5uBGE7SB-66ozPnPCapFr13qoZvRDItU1_ZOT_30gW_t9t5cwIEz68-rE8wlzfvljuK_rPr3nSHbRXTAAnbKJhylHjJeEZH8SikKGt5uV0OoSQTj4LgPSqLEavb7W5pOlb2FzYvL-jcXbgvhmp8hkY';

interface NavbarProps {
  activeView: ScreenView;
  onSelectView: (view: ScreenView) => void;
  totalEmployees: number;
  syncStatus: 'idle' | 'syncing' | 'synced';
  onSync: () => void;
  onOpenNewEmployee: () => void;
  onResetDemoData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onSelectView,
  totalEmployees,
  syncStatus,
  onSync,
  onOpenNewEmployee,
  onResetDemoData,
}) => {
  const [logoError, setLogoError] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="w-full bg-[#f6f4ee] border-b border-[#e5e0d4] sticky top-0 z-40 px-4 sm:px-6 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Logo & Views Navigation */}
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <button
            type="button"
            onClick={() => onSelectView('command-center')}
            className="flex items-center space-x-2.5 focus:outline-none shrink-0 cursor-pointer"
          >
            {!logoError ? (
              <img
                src={LOGO_URL}
                alt="Train Today"
                referrerPolicy="no-referrer"
                onError={() => setLogoError(true)}
                className="h-8 object-contain mix-blend-multiply"
              />
            ) : (
              <div className="flex items-center space-x-1.5">
                <div className="flex flex-col leading-none font-display font-extrabold text-[11px] tracking-tight text-slate-900 uppercase">
                  <span>TRAIN</span>
                  <span>TODAY</span>
                </div>
                <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
                </svg>
              </div>
            )}
          </button>

          <div className="hidden sm:block h-4 w-[1px] bg-[#dcd6c8] shrink-0" />

          <nav className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => onSelectView('command-center')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'command-center'
                  ? 'bg-[#e9e4d6] font-semibold text-slate-800 border border-[#ded8c7] shadow-inner'
                  : 'font-medium text-slate-600 hover:text-slate-900 hover:bg-[#ede9dc] border border-transparent'
              }`}
            >
              {activeView === 'command-center' ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ) : (
                <ClipboardList className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>Onboarding Command Center</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectView('directory')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'directory'
                  ? 'bg-[#e9e4d6] font-semibold text-slate-800 border border-[#ded8c7] shadow-inner'
                  : 'font-medium text-slate-600 hover:text-slate-900 hover:bg-[#ede9dc] border border-transparent'
              }`}
            >
              {activeView === 'directory' ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ) : (
                <Database className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>Employee Directory & Database</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono tabular-nums ${
                  activeView === 'directory'
                    ? 'bg-[#ded7c5] text-slate-800 font-bold'
                    : 'bg-[#e2dcce] text-slate-700'
                }`}
              >
                {totalEmployees}
              </span>
            </button>
          </nav>
        </div>

        {/* Right: Global Actions & User Avatar */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
          <button
            type="button"
            onClick={onSync}
            disabled={syncStatus === 'syncing'}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-white/80 hover:bg-white border border-[#dfd9cc] shadow-sm transition-all active:scale-95 whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-70"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-slate-500 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`}
            />
            <span>
              {syncStatus === 'syncing'
                ? 'Syncing...'
                : syncStatus === 'synced'
                ? 'Synced (Just now)'
                : 'Sync Data'}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenNewEmployee}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all hover:shadow active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-amber-400" />
            <span>{activeView === 'directory' ? '+ Add Employee' : '+ New Employee'}</span>
          </button>

          <div className="hidden sm:block h-6 w-[1px] bg-[#dcd6c8]" />

          <div className="relative pl-0.5">
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              aria-label="HR Manager Profile"
              className="w-8 h-8 rounded-full bg-slate-900 text-amber-300 font-bold text-xs flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-slate-200 hover:ring-slate-400 transition-all cursor-pointer"
            >
              ER
            </button>

            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl border border-[#e5dfd2] shadow-xl p-3 z-50 text-xs">
                  <div className="pb-2.5 border-b border-[#ede7db]">
                    <div className="font-bold text-slate-900">Elena Rostova</div>
                    <div className="text-[11px] text-slate-500">Head of People & Ops · Admin</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">elena.rostova@traintoday.com</div>
                  </div>
                  <div className="pt-2 flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        onResetDemoData();
                      }}
                      className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-[#faf8f4] transition-colors cursor-pointer text-left"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                      <span>Reset Sample Pipeline Data</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
