'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import Link from 'next/link';

export default function RegistrationsPage() {
  const { data: batches, isLoading } = useQuery({
    queryKey: ['admin-batches'],
    queryFn: async () => {
      // Mock data
      return [
        { id: '1', name: 'MCA 2025-2027', enrolledStudents: 120, sections: ['A', 'B'], status: 'ACTIVE' },
        { id: '2', name: 'BCA 2024-2027', enrolledStudents: 340, sections: ['A', 'B', 'C', 'D'], status: 'ACTIVE' },
      ];
    }
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Course Registrations</h2>
          <p className="text-slate-400 mt-1">Manage batches, sections, and student enrollments</p>
        </div>
        <Link 
          href="/admin/registrations/assign"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-500/20 font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Assign Students
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Active Batches</h3>
              <button className="text-sm text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
                View Archive
              </button>
            </div>
            <div className="divide-y divide-slate-800/60">
              {isLoading ? (
                <div className="p-8 text-center text-slate-500">
                  Loading batches...
                </div>
              ) : (
                batches?.map(batch => (
                  <div key={batch.id} className="p-5 hover:bg-slate-800/30 transition-colors flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium text-lg">{batch.name}</h4>
                      <p className="text-slate-400 text-sm mt-1">
                        {batch.enrolledStudents} Students enrolled • Sections {batch.sections.join(', ')}
                      </p>
                    </div>
                    <button className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors text-sm font-medium">
                      Manage
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-sm p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Enrolled</span>
                <span className="text-white font-bold">460</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Pending Assignment</span>
                <span className="text-amber-400 font-bold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Sections</span>
                <span className="text-white font-bold">6</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
