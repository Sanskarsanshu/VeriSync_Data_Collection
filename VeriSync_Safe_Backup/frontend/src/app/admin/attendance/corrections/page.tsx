'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';

export default function PendingCorrectionsPage() {
  const queryClient = useQueryClient();

  const { data: corrections, isLoading } = useQuery({
    queryKey: ['admin-corrections'],
    queryFn: async () => {
      // Mock Data
      return [
        { id: '1', student: 'Jane Smith', roll: '25MCA012', course: 'CS301', date: '2026-07-30', original: 'ABSENT', requested: 'PRESENT', teacher: 'Dr. Alan Turing', reason: 'System glitch, student was present in class.' },
        { id: '2', student: 'Mark Johnson', roll: '25MCA055', course: 'CS302', date: '2026-07-29', original: 'ABSENT', requested: 'PRESENT', teacher: 'Dr. Ada Lovelace', reason: 'Medical leave approved retroactively.' },
      ];
    }
  });

  const handleAction = useMutation({
    mutationFn: async ({ id, action }: { id: string, action: 'approve' | 'reject' }) => {
      // Mock API call
      return new Promise(resolve => setTimeout(resolve, 800));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-corrections'] });
    }
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/attendance"
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white">Pending Corrections</h2>
          <p className="text-slate-400 mt-1">Review attendance modifications recommended by teachers</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-800/60">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">
              Loading pending corrections...
            </div>
          ) : corrections?.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No pending corrections to review.
            </div>
          ) : (
            corrections?.map((c) => (
              <div key={c.id} className="p-6 hover:bg-slate-800/30 transition-colors flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h4 className="text-lg font-semibold text-white">{c.student} <span className="text-slate-500 text-sm font-normal ml-2">({c.roll})</span></h4>
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                      {c.course}
                    </span>
                    <span className="text-slate-400 text-sm">{c.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm bg-slate-950 p-3 rounded-lg border border-slate-800 inline-flex">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Original:</span>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">{c.original}</span>
                    </div>
                    <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Requested:</span>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{c.requested}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-300">
                    <span className="text-slate-500 mr-2">Reason by {c.teacher}:</span>
                    {c.reason}
                  </p>
                </div>
                
                <div className="flex gap-3 w-full lg:w-auto">
                  <button 
                    onClick={() => handleAction.mutate({ id: c.id, action: 'reject' })}
                    disabled={handleAction.isPending}
                    className="flex-1 lg:flex-none px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleAction.mutate({ id: c.id, action: 'approve' })}
                    disabled={handleAction.isPending}
                    className="flex-1 lg:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-500/20 transition-colors text-sm font-medium flex justify-center items-center gap-2 disabled:opacity-50"
                  >
                    {handleAction.isPending ? 'Processing...' : 'Approve'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
