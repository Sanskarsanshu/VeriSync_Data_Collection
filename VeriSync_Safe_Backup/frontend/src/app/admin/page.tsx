'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  activeCourses: number;
  liveSessions: number;
}

export default function AdminDashboardPage() {
  // We'll mock this for now until the backend endpoint is verified
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      try {
        const res = await api.get('/admin/stats');
        return res.data.data as DashboardStats;
      } catch (e) {
        console.error('Failed to fetch stats:', e);
        // Fallback to 0 if failed
        return {
          totalStudents: 0,
          totalTeachers: 0,
          activeCourses: 0,
          liveSessions: 0,
        } as DashboardStats;
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
          <p className="text-slate-400 mt-1">Key metrics and institutional status</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-900 rounded-xl border border-slate-800"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Students" value={stats?.totalStudents || 0} icon="users" color="indigo" />
          <StatCard title="Active Faculty" value={stats?.totalTeachers || 0} icon="user-check" color="emerald" />
          <StatCard title="Courses Offered" value={stats?.activeCourses || 0} icon="book-open" color="amber" />
          <StatCard title="Live Sessions" value={stats?.liveSessions || 0} icon="video" color="rose" />
        </div>
      )}
      
      {/* Recent Activity / Quick Actions Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-white mb-4">Live Attendance Matrix</h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-700 rounded-lg bg-slate-900/50">
            <span className="text-slate-500">Matrix Visualization (Coming Soon)</span>
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-white mb-4">Pending Corrections</h3>
          <div className="space-y-4">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <p className="text-sm font-medium text-white">John Doe (CS-A)</p>
              <p className="text-xs text-amber-400 mt-1">Recommended by Teacher</p>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <p className="text-sm font-medium text-white">Jane Smith (IT-B)</p>
              <p className="text-xs text-amber-400 mt-1">Recommended by Teacher</p>
            </div>
            <button className="w-full py-2 text-sm text-indigo-400 font-medium hover:text-indigo-300">View All →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: string, color: 'indigo'|'emerald'|'amber'|'rose' }) {
  const colors = {
    indigo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  };

  const getIcon = () => {
    switch (icon) {
      case 'users': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />;
      case 'user-check': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />;
      case 'book-open': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />;
      case 'video': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />;
      default: return null;
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg border ${colors[color]}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {getIcon()}
          </svg>
        </div>
      </div>
    </div>
  );
}
