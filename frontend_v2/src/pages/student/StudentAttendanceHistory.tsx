import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClipboardCheck, Filter, Download, ScanFace, QrCode, Loader2, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface AttendanceRecord {
  id: string;
  date: string;
  courseCode: string;
  courseName: string;
  faculty: string;
  time: string;
  status: string;
  method: string;
}

export default function StudentAttendanceHistory() {
  const user = useAppStore(state => state.user);
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_URL}/students/me/attendance`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch attendance history');
        }
        
        const json = await response.json();
        setHistory(json);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching history.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="flex h-[80vh] items-center justify-center flex-col gap-4 text-student-500">
          <Loader2 className="w-12 h-12 animate-spin" />
          <p className="font-medium animate-pulse text-muted-foreground">Loading attendance history...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role="student">
        <div className="flex h-[80vh] items-center justify-center flex-col gap-4 p-6 text-center">
          <div className="p-4 bg-rose-500/10 rounded-full">
            <AlertCircle className="w-12 h-12 text-rose-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mt-2">History Error</h2>
          <p className="text-muted-foreground max-w-md">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 font-sans p-2 sm:p-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-student-500/10 flex items-center justify-center border border-student-500/20 shadow-inner">
                <ClipboardCheck className="w-5 h-5 text-student-600 dark:text-student-400" />
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
              {Array.from(new Set(history.map(h => h.courseCode))).map(code => {
                const name = history.find(h => h.courseCode === code)?.courseName;
                return (
                  <SelectItem key={code} value={code}>{name}</SelectItem>
                );
              })}
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
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No attendance records found.
                    </td>
                  </tr>
                ) : (
                  history.map((record) => (
                    <tr key={record.id} className="hover:bg-muted/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                        {new Date(record.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 font-semibold text-foreground">
                        {record.courseName} <span className="text-xs text-muted-foreground font-normal ml-1">({record.courseCode})</span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {record.faculty}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {record.time}
                      </td>
                      <td className="px-6 py-4">
                        {record.status === 'PRESENT' ? (
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
                        {record.method === 'FACE' ? (
                          <div className="flex items-center gap-1.5" title="Face Verification">
                            <ScanFace className="w-4 h-4 text-student-500" />
                            <span className="text-xs">Face</span>
                          </div>
                        ) : record.method === 'DYNAMIC_QR' || record.method === 'STATIC_QR' ? (
                          <div className="flex items-center gap-1.5" title="QR Code">
                            <QrCode className="w-4 h-4 text-student-500" />
                            <span className="text-xs">QR Scan</span>
                          </div>
                        ) : (
                          <span className="text-xs capitalize">{record.method.toLowerCase()}</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </DashboardLayout>
  );
}
