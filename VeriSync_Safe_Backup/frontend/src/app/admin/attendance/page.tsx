'use client';

import Link from 'next/link';

export default function AttendancePage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Attendance Operations</h2>
          <p className="text-slate-400 mt-1">Institutional overview of attendance tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link 
          href="/admin/attendance/shortage"
          className="group block bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/50 transition-colors shadow-sm"
        >
          <div className="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">Shortage Reports</h3>
          <p className="text-slate-400 text-sm mt-2">View students falling below the required minimum attendance threshold.</p>
        </Link>

        <Link 
          href="/admin/attendance/corrections"
          className="group block bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/50 transition-colors shadow-sm"
        >
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">Pending Corrections</h3>
          <p className="text-slate-400 text-sm mt-2">Review and approve attendance modifications recommended by teachers.</p>
        </Link>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-center items-center text-center opacity-70">
          <div className="w-12 h-12 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">Attendance Matrix</h3>
          <p className="text-slate-400 text-sm mt-2">Comprehensive monthly view. (Coming Soon)</p>
        </div>
      </div>
    </div>
  );
}
