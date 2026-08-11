'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export default function ShortageReportsPage() {
  const { data: shortages, isLoading } = useQuery({
    queryKey: ['admin-shortages'],
    queryFn: async () => {
      // Mock Data
      return [
        { studentId: '1', name: 'John Doe', roll: '25MCA001', batch: 'MCA 2025-2027', attendancePercentage: 65, required: 75 },
        { studentId: '2', name: 'Alice Smith', roll: '25MCA042', batch: 'MCA 2025-2027', attendancePercentage: 72, required: 75 },
      ];
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
          <h2 className="text-2xl font-bold text-white">Attendance Shortages</h2>
          <p className="text-slate-400 mt-1">Review students falling below the minimum threshold</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex gap-4">
          <select className="px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 w-48">
            <option>All Batches</option>
            <option>MCA 2025-2027</option>
            <option>BCA 2024-2027</option>
          </select>
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors border border-slate-700">
            Export CSV
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Batch</th>
                <th className="px-6 py-4 text-center">Attendance %</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Loading shortage reports...
                  </td>
                </tr>
              ) : shortages?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No students currently have attendance shortages.
                  </td>
                </tr>
              ) : (
                shortages?.map((s) => (
                  <tr key={s.studentId} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{s.name}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{s.roll}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{s.batch}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold ${s.attendancePercentage < 70 ? 'text-red-400' : 'text-amber-400'}`}>
                        {s.attendancePercentage}%
                      </span>
                      <span className="text-slate-500 text-xs ml-1">/ {s.required}%</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20">
                        Critical
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
                        Notify
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
