import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, MoreHorizontal } from 'lucide-react';

export default function StudentEnrollmentAdmin() {
  // Placeholder mock data
  const students = [
    { id: 'STU001', name: 'Alice Johnson', course: 'B.Tech CS', status: 'Enrolled' },
    { id: 'STU002', name: 'Bob Smith', course: 'B.Tech CS', status: 'Pending' },
    { id: 'STU003', name: 'Charlie Davis', course: 'B.Tech IT', status: 'Enrolled' },
    { id: 'STU004', name: 'Diana Evans', course: 'BCA', status: 'Failed' },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Enrollment</h1>
            <p className="text-muted-foreground mt-1">Manage facial data enrollment and onboarding links.</p>
          </div>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Generate Enrollment Links
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/10">
            <div className="relative w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search students..." className="pl-9 h-9" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Filter</Button>
              <Button variant="outline" size="sm">Export</Button>
            </div>
          </div>
          
          <div className="w-full overflow-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border/50">
                <tr>
                  <th className="px-6 py-3">Student ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Course</th>
                  <th className="px-6 py-3">Enrollment Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-medium">{student.id}</td>
                    <td className="px-6 py-4">{student.name}</td>
                    <td className="px-6 py-4">{student.course}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                        ${student.status === 'Enrolled' ? 'bg-emerald-500/10 text-emerald-500' : 
                          student.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' : 
                          'bg-destructive/10 text-destructive'}
                      `}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-border/50 text-xs text-muted-foreground flex justify-between items-center bg-muted/10">
            <span>Showing 1 to 4 of 120 entries</span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
