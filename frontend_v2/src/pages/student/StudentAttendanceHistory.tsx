import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClipboardCheck, Filter, Download, ScanFace, QrCode } from 'lucide-react';

const MOCK_HISTORY = [
  { id: 1, date: 'Aug 08, 2026', course: 'Advanced DBMS', faculty: 'Dr. Praveen', time: '10:00 AM', status: 'Present', method: 'face' },
  { id: 2, date: 'Aug 07, 2026', course: 'Software Engineering', faculty: 'Richa Verma', time: '11:00 AM', status: 'Present', method: 'qr' },
  { id: 3, date: 'Aug 06, 2026', course: 'Algorithms (DAA)', faculty: 'Bhawna Sinha', time: '02:00 PM', status: 'Absent', method: 'none' },
  { id: 4, date: 'Aug 05, 2026', course: 'Web Technologies', faculty: 'Susmita', time: '09:00 AM', status: 'Present', method: 'face' },
  { id: 5, date: 'Aug 04, 2026', course: 'Advanced DBMS', faculty: 'Dr. Praveen', time: '10:00 AM', status: 'Present', method: 'face' },
];

export default function StudentAttendanceHistory() {
  return (
    <DashboardLayout role="student">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 font-sans p-2 sm:p-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 shadow-inner">
                <ClipboardCheck className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Attendance History</h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              View your detailed chronological attendance records across all enrolled courses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-border bg-card hover:bg-muted text-foreground gap-2 font-semibold">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground mr-2 font-medium text-sm">
            <Filter className="w-4 h-4" /> Filters
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[200px] bg-background border-border/50 rounded-xl">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="dbms">Advanced DBMS</SelectItem>
              <SelectItem value="se">Software Engineering</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="7days">
            <SelectTrigger className="w-full sm:w-[200px] bg-background border-border/50 rounded-xl">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="semester">This Semester</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* History Table */}
        <Card className="border border-border shadow-sm rounded-2xl bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Course</th>
                  <th className="px-6 py-4 font-semibold">Faculty</th>
                  <th className="px-6 py-4 font-semibold">Time</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {MOCK_HISTORY.map((record) => (
                  <tr key={record.id} className="hover:bg-muted/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                      {record.date}
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {record.course}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {record.faculty}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {record.time}
                    </td>
                    <td className="px-6 py-4">
                      {record.status === 'Present' ? (
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          Present
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                          Absent
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {record.method === 'face' ? (
                        <div className="flex items-center gap-1.5" title="Face Verification">
                          <ScanFace className="w-4 h-4 text-violet-500" />
                          <span className="text-xs">Face</span>
                        </div>
                      ) : record.method === 'qr' ? (
                        <div className="flex items-center gap-1.5" title="QR Code">
                          <QrCode className="w-4 h-4 text-blue-500" />
                          <span className="text-xs">QR Scan</span>
                        </div>
                      ) : (
                        <span className="text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </DashboardLayout>
  );
}
