import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
          <p className="text-muted-foreground mt-1">Manage institutional attendance and core operations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="font-semibold text-lg mb-2">Total Students</h3>
            <p className="text-3xl font-bold">1,248</p>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="font-semibold text-lg mb-2">Today's Attendance</h3>
            <p className="text-3xl font-bold text-emerald-500">92.4%</p>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="font-semibold text-lg mb-2">Active Sessions</h3>
            <p className="text-3xl font-bold">14</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
