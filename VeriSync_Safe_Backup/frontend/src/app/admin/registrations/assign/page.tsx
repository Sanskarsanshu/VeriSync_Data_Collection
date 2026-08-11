'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AssignStudentsPage() {
  const [batch, setBatch] = useState('');
  const [section, setSection] = useState('');
  const [studentIds, setStudentIds] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAssigning(true);
    setSuccess(false);
    
    // Mock API call
    setTimeout(() => {
      setIsAssigning(false);
      setSuccess(true);
      setStudentIds('');
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/registrations"
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white">Assign Students</h2>
          <p className="text-slate-400 mt-1">Bulk assign students to batches and sections</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-sm p-8">
        {success && (
          <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-emerald-400 font-medium">Assignment Successful</h4>
              <p className="text-emerald-500/80 text-sm mt-1">The students have been successfully assigned to the selected section.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleAssign} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Target Batch</label>
              <select 
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                required
              >
                <option value="" disabled>Select a batch...</option>
                <option value="1">MCA 2025-2027</option>
                <option value="2">BCA 2024-2027</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Target Section</label>
              <select 
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                required
              >
                <option value="" disabled>Select a section...</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-medium text-slate-300">Student Roll Numbers / IDs</label>
              <span className="text-xs text-slate-500">Comma or newline separated</span>
            </div>
            <textarea 
              value={studentIds}
              onChange={(e) => setStudentIds(e.target.value)}
              placeholder="e.g. 25MCA001, 25MCA002&#10;25MCA003"
              className="w-full h-32 px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-sm"
              required
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <Link 
              href="/admin/registrations"
              className="px-5 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors font-medium"
            >
              Cancel
            </Link>
            <button 
              type="submit"
              disabled={isAssigning}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white rounded-lg shadow-lg shadow-indigo-500/20 font-medium transition-colors flex items-center gap-2"
            >
              {isAssigning ? 'Processing...' : 'Assign Students'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
