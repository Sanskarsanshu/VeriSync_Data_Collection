import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-center pb-6 border-b border-border">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage institutional attendance and core operations.</p>
          </div>
          <Link to="/">
            <Button variant="outline">Sign Out</Button>
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-border bg-card/50">
            <h3 className="font-semibold text-lg mb-2">Total Students</h3>
            <p className="text-3xl font-bold">1,248</p>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card/50">
            <h3 className="font-semibold text-lg mb-2">Today's Attendance</h3>
            <p className="text-3xl font-bold text-emerald-500">92.4%</p>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card/50">
            <h3 className="font-semibold text-lg mb-2">Active Sessions</h3>
            <p className="text-3xl font-bold">14</p>
          </div>
        </div>
      </div>
    </div>
  );
}
