import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';

export default function TeacherDashboard() {
  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teacher Overview</h1>
          <p className="text-muted-foreground mt-1">Manage your classes and take attendance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="font-semibold text-lg mb-2">Next Class</h3>
            <p className="text-2xl font-bold">Data Structures (CS-301)</p>
            <p className="text-muted-foreground mt-2">10:00 AM - Room 402</p>
            <Button className="mt-4 w-full">Start Live Attendance</Button>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="font-semibold text-lg mb-2">Today's Schedule</h3>
            <ul className="space-y-3 mt-4">
              <li className="flex justify-between items-center pb-2 border-b border-border/50">
                <span>10:00 AM</span>
                <span className="font-medium">Data Structures</span>
              </li>
              <li className="flex justify-between items-center pb-2 border-b border-border/50">
                <span>01:00 PM</span>
                <span className="font-medium">Algorithms</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
