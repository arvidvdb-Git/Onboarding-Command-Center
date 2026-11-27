import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { EmployeeRecord } from '../types/onboarding';
import { getEmployeeProgress } from '../data/seedData';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

interface AssistantDrawerProps {
  selectedEmployee: EmployeeRecord;
  onTriggerMasterdataSync: (employeeId: string) => void;
}

export const AssistantDrawer: React.FC<AssistantDrawerProps> = ({
  selectedEmployee,
  onTriggerMasterdataSync,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! I can trigger onboarding subagents, query Google Workspace access, or recheck blocked licenses. What would you like me to do?',
    },
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const buildReply = (prompt: string): string => {
    const lower = prompt.toLowerCase();
    const progress = getEmployeeProgress(selectedEmployee);
    const pending = selectedEmployee.tasks.filter((t) => t.status === 'pending');
    const blocked = selectedEmployee.tasks.filter((t) => t.status === 'blocked');

    if (lower.includes('masterdata')) {
      onTriggerMasterdataSync(selectedEmployee.id);
      return `[n8n Subagent #1] Synced Masterdata flow for ${selectedEmployee.name} (${selectedEmployee.employeeCode}). Personio & Notion records verified; pending items refreshed.`;
    }

    if (lower.includes('day 1') || lower.includes('left')) {
      const topPending = pending
        .slice(0, 4)
        .map((t) => t.title)
        .join(', ');
      return `[Pipeline Status] ${selectedEmployee.name} is at ${progress.completed}/${progress.total} (${progress.percent}%). ${pending.length} pending tasks remain${topPending ? `: ${topPending}` : ''}. ${blocked.length} blocked item(s).`;
    }

    if (lower.includes('block') || lower.includes('license')) {
      if (blocked.length === 0) {
        return `[n8n Subagent #2] No blocked tasks found for ${selectedEmployee.name}. All provisioned licenses are healthy.`;
      }
      const blockedList = blocked.map((b) => `${b.title} (${b.note})`).join('; ');
      return `[n8n Subagent #2] ${blocked.length} blocked item(s) for ${selectedEmployee.name}: ${blockedList}.`;
    }

    return `[n8n Subagent] Checked ${selectedEmployee.name} (${selectedEmployee.department}): ${progress.completed}/${progress.total} completed, ${pending.length} pending, ${blocked.length} blocked.`;
  };

  const sendMessage = (textToSend?: string) => {
    const msg = (textToSend ?? input).trim();
    if (!msg) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: msg,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `b-${Date.now() + 1}`,
        sender: 'bot',
        text: buildReply(msg),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 350);
  };

  return (
    <div className="fixed bottom-5 right-6 z-50">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center space-x-2.5 px-4 py-2.5 rounded-full bg-slate-900 text-white font-medium text-xs shadow-xl hover:bg-slate-800 transition-all transform hover:scale-105 active:scale-95 border border-slate-700 cursor-pointer"
      >
        <div className="relative">
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
        </div>
        <span>n8n AI Assistant</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
      </button>

      {isOpen && (
        <div className="absolute bottom-14 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
          <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                AI
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">n8n Onboarding Assistant</h4>
                <p className="text-[10px] text-emerald-400 font-mono">
                  Active: {selectedEmployee.name}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div
            ref={listRef}
            className="p-3.5 h-64 overflow-y-auto space-y-3 bg-[#faf8f4] text-xs custom-scroll"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  m.sender === 'user'
                    ? 'bg-slate-900 text-white p-2.5 rounded-xl text-xs ml-auto max-w-[85%]'
                    : 'bg-white p-2.5 rounded-xl border border-[#e5dfd2] text-slate-700 max-w-[85%] shadow-xs'
                }
              >
                {m.text}
              </div>
            ))}

            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => sendMessage('Trigger Masterdata flow')}
                className="px-2 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] hover:bg-amber-100 cursor-pointer"
              >
                Trigger Masterdata flow
              </button>
              <button
                type="button"
                onClick={() => sendMessage("What's left for Day 1?")}
                className="px-2 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-[10px] hover:bg-blue-100 cursor-pointer"
              >
                What&apos;s left for Day 1?
              </button>
              <button
                type="button"
                onClick={() => sendMessage('Check blocked licenses')}
                className="px-2 py-1 rounded-md bg-rose-50 text-rose-800 border border-rose-200 text-[10px] hover:bg-rose-100 cursor-pointer"
              >
                Check blocked licenses
              </button>
            </div>
          </div>

          <div className="p-2.5 bg-white border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
              placeholder="Ask n8n agent or trigger task..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
            <button
              type="button"
              onClick={() => sendMessage()}
              aria-label="Send message"
              className="p-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
