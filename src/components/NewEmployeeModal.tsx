import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Department } from '../types/onboarding';

export interface NewEmployeePayload {
  name: string;
  personalEmail: string;
  companyEmail: string;
  department: Department;
  role: string;
  manager: string;
  startDate: string;
}

interface NewEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: NewEmployeePayload) => void;
}

export const NewEmployeeModal: React.FC<NewEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [department, setDepartment] = useState<Department>('Marketing');
  const [role, setRole] = useState('');
  const [manager, setManager] = useState('Elena Rostova');
  const [startDate, setStartDate] = useState('2025-11-03');

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    const cleaned = val
      .trim()
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/)
      .filter(Boolean);
    if (cleaned.length >= 2) {
      setCompanyEmail(`${cleaned[0][0]}.${cleaned[cleaned.length - 1]}@traintoday.com`);
    } else if (cleaned.length === 1) {
      setCompanyEmail(`${cleaned[0]}@traintoday.com`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !personalEmail.trim() || !companyEmail.trim() || !role.trim() || !manager.trim()) {
      return;
    }

    const formattedDate = new Date(startDate + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

    onSubmit({
      name: name.trim(),
      personalEmail: personalEmail.trim(),
      companyEmail: companyEmail.trim(),
      department,
      role: role.trim(),
      manager: manager.trim(),
      startDate: formattedDate,
    });

    setName('');
    setPersonalEmail('');
    setCompanyEmail('');
    setRole('');
    setDepartment('Marketing');
    setManager('Elena Rostova');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4">
      <div className="bg-[#faf8f4] border border-[#e5dfd2] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5dfd2]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-base font-bold text-slate-900 font-display">
              New Employee Onboarding Trigger Form
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-[#ede8dc] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Jordan Miller"
              className="w-full bg-white border border-[#ded7c6] rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Personal Email</label>
              <input
                type="email"
                required
                value={personalEmail}
                onChange={(e) => setPersonalEmail(e.target.value)}
                placeholder="jordan@example.com"
                className="w-full bg-white border border-[#ded7c6] rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Company Email</label>
              <input
                type="email"
                required
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                placeholder="j.miller@traintoday.com"
                className="w-full bg-white border border-[#ded7c6] rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full bg-white border border-[#ded7c6] rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
              >
                <option value="Marketing">Marketing</option>
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Sales">Sales</option>
                <option value="People & HR">People & HR</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Role / Job Title</label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Content Lead"
                className="w-full bg-white border border-[#ded7c6] rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Direct Manager</label>
              <input
                type="text"
                required
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                placeholder="e.g. Elena Rostova"
                className="w-full bg-white border border-[#ded7c6] rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white border border-[#ded7c6] rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-[#e5dfd2]">
            <span className="text-[10px] text-slate-500 font-mono">
              Targets n8n webhook /webhook/onboarding-masterdata
            </span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg border border-[#ded7c6] text-slate-600 hover:bg-[#ede7db] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 shadow-sm flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Trigger n8n Workflow</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
