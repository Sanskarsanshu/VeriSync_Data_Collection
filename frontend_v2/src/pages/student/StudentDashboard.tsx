import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-center pb-6 border-b border-border">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
            <p className="text-muted-foreground mt-1">View your attendance and upcoming classes.</p>
          </div>
          <Link to="/">
            <Button variant="outline">Sign Out</Button>
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-border bg-card/50">
            <h3 className="font-semibold text-lg mb-2">Overall Attendance</h3>
            <p className="text-4xl font-bold text-emerald-500">88.5%</p>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card/50 md:col-span-2">
            <h3 className="font-semibold text-lg mb-2">Today's Timetable</h3>
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                <div>
                  <p className="font-semibold">Data Structures</p>
                  <p className="text-sm text-muted-foreground">Room 402 • Prof. Smith</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">10:00 AM</p>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500 mt-1">Present</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
