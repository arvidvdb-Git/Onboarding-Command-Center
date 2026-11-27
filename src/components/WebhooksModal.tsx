import React, { useState } from 'react';
import { X, CheckCircle2, Activity } from 'lucide-react';

interface WebhooksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WEBHOOKS = [
  {
    id: 'wh-1',
    name: '01 · Masterdata & Personio Sync',
    endpoint: 'POST /webhook/onboarding-masterdata',
    agent: 'Manual HR Confirmation',
    latency: '118ms',
  },
  {
    id: 'wh-2',
    name: '02 · IT Provisioning Agent',
    endpoint: 'POST /webhook/it-provisioning',
    agent: 'Subagent #2',
    latency: '142ms',
  },
  {
    id: 'wh-3',
    name: '03 · Calendar & Welcome Kit Agent',
    endpoint: 'POST /webhook/calendar-scheduling',
    agent: 'Subagent #3',
    latency: '96ms',
  },
  {
    id: 'wh-4',
    name: '04 · Comms & Buddy Assignment Agent',
    endpoint: 'POST /webhook/comms-buddy',
    agent: 'Subagent #4',
    latency: '104ms',
  },
];

export const WebhooksModal: React.FC<WebhooksModalProps> = ({ isOpen, onClose }) => {
  const [testedIds, setTestedIds] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleTest = (id: string) => {
    setTestedIds((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4">
      <div className="bg-[#faf8f4] border border-[#e5dfd2] rounded-2xl max-w-lg w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5dfd2]">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900 font-display">
              n8n API Webhooks Config (Pipeline v2.4)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-[#ede8dc] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2.5 text-xs">
          {WEBHOOKS.map((wh) => (
            <div
              key={wh.id}
              className="bg-white border border-[#e5dfd2] rounded-xl p-3 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="font-bold text-slate-900">{wh.name}</div>
                <div className="font-mono text-[11px] text-slate-500 truncate mt-0.5">
                  {wh.endpoint}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {wh.agent} · Avg latency {wh.latency}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleTest(wh.id)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold shrink-0 flex items-center space-x-1 transition-all cursor-pointer ${
                  testedIds[wh.id]
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {testedIds[wh.id] ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>200 OK</span>
                  </>
                ) : (
                  <span>Test Ping</span>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-[#e5dfd2] flex items-center justify-between text-[11px] text-slate-500">
          <span>Notion Masterdata Sync: Connected</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
