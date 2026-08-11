import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, Calendar as CalendarIcon, Clock, MapPin, CheckCircle2, 
  AlertCircle, BookOpen, UserCircle2, BellRing, Activity, Loader2, BarChart2
} from 'lucide-react';

interface DashboardData {
  student: { name: string; rollNumber: string; semester: number };
  attendance: { percentage: number; attended: number; total: number; absent: number };
  courses: Array<{ id: string; code: string; name: string; teacherName: string }>;
  todaySchedule: Array<{ id: string; courseName: string; teacherName: string; room: string; startTime: string; endTime: string; status: string }>;
  recentAttendance: Array<{ id: string; courseName: string; date: string; status: string }>;
}

export default function StudentDashboard() {
  const user = useAppStore(state => state.user);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const firstName = user?.name ? user.name.split(' ')[0] : 'Student';

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = sessionStorage.getItem('verisync_token');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_URL}/students/me/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` },
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const json = await response.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="flex h-[80vh] items-center justify-center flex-col gap-4 text-student-500">
          <Loader2 className="w-12 h-12 animate-spin" />
          <p className="font-medium animate-pulse text-muted-foreground">Loading your dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout role="student">
        <div className="flex h-[80vh] items-center justify-center flex-col gap-4 p-6 text-center">
          <div className="p-4 bg-rose-500/10 rounded-full">
            <AlertCircle className="w-12 h-12 text-rose-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mt-2">Dashboard Error</h2>
          <p className="text-muted-foreground max-w-md">{error || 'Could not load your dashboard. Please try again later.'}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 font-sans p-2 sm:p-6">
        
        {/* Welcome Section with Aurora UI */}
        <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-8 pb-10">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-student-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-student-500/10 text-student-500 text-xs font-semibold mb-4 border border-student-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-student-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-student-500"></span>
                </span>
                Semester {data.student.semester} Active
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
                Good Morning, {firstName} 👋
              </h1>
              <p className="text-muted-foreground max-w-xl text-lg">
                Here is your academic and attendance overview for today. Keep up the great work!
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link to="/student/attendance/analytics" className="px-4 py-2 rounded-xl bg-card border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2">
                <BarChart2 size={16} />
                View Analytics
              </Link>
              <Link to="/student/attendance/mark" className="px-4 py-2 rounded-xl bg-student-500 hover:bg-student-600 text-white text-sm font-medium transition-all shadow-lg shadow-student-500/20 flex items-center gap-2">
                <Activity size={16} />
                Mark Attendance
              </Link>
            </div>
          </div>
        </div>

        {/* Attendance Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-border shadow-sm rounded-2xl bg-card hover:shadow-lg hover:-translate-y-1 hover:border-student-500/30 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-student-500/10 rounded-xl">
                  <Activity className="w-5 h-5 text-student-600" />
                </div>
                {data.attendance.percentage > 75 ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                ) : data.attendance.total > 0 ? (
                  <TrendingUp className="w-4 h-4 text-rose-500 rotate-180" />
                ) : null}
              </div>
              <h3 className="text-3xl font-bold text-foreground">{data.attendance.percentage}%</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">Overall Attendance</p>
            </CardContent>
          </Card>
          
          <Card className="border border-border shadow-sm rounded-2xl bg-card hover:shadow-lg hover:-translate-y-1 hover:border-student-500/30 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-foreground">{data.attendance.attended}</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">Classes Attended</p>
            </CardContent>
          </Card>

          <Card className="border border-border shadow-sm rounded-2xl bg-card hover:shadow-lg hover:-translate-y-1 hover:border-student-500/30 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-student-500/10 rounded-xl">
                  <BookOpen className="w-5 h-5 text-student-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-foreground">{data.attendance.total}</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">Total Classes</p>
            </CardContent>
          </Card>

          <Card className="border border-border shadow-sm rounded-2xl bg-card hover:shadow-lg hover:-translate-y-1 hover:border-student-500/30 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-rose-500/10 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-foreground">{data.attendance.absent}</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">Classes Missed</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column: Schedule & Notifications */}
          <div className="xl:col-span-2 space-y-8">
            <Card className="border border-border shadow-sm rounded-2xl bg-card overflow-hidden hover:shadow-lg hover:border-student-500/30 transition-all duration-300">
              <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-student-500" />
                    <CardTitle className="text-lg">Today's Schedule</CardTitle>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-muted rounded-md">{new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {data.todaySchedule.length === 0 ? (
                    <div className="p-12 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-4">
                        <CalendarIcon className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                      <h4 className="text-base font-bold text-foreground">No classes scheduled for today.</h4>
                      <p className="text-sm text-muted-foreground mt-1 max-w-xs">You have no timetable entries for today. Enjoy your free time!</p>
                    </div>
                  ) : (
                    data.todaySchedule.map((session, i) => (
                      <div key={session.id || i} className="p-4 sm:p-6 hover:bg-muted/5 transition-colors group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-xl bg-student-100 dark:bg-student-900/30 flex items-center justify-center shrink-0 border border-student-500/20">
                            <span className="font-bold text-student-600 dark:text-student-400 text-xs text-center leading-tight">
                              {session.startTime.split(' ')[0]}<br/>{session.startTime.split(' ')[1]}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground text-base group-hover:text-student-500 transition-colors">{session.courseName}</h4>
                            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-medium text-muted-foreground">
                              <span className="flex items-center gap-1"><UserCircle2 className="w-3.5 h-3.5" /> {session.teacherName}</span>
                              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Room {session.room}</span>
                            </div>
                          </div>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-bold border border-border/50 self-start sm:self-auto uppercase">
                          {session.status}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Recent Activity & Alerts */}
          <div className="space-y-8">
            <Card className="border border-border shadow-sm rounded-2xl bg-card hover:shadow-lg hover:border-student-500/30 transition-all duration-300">
              <CardHeader className="pb-4 border-b border-border/50 mb-4 bg-muted/10">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-student-500" />
                  Recent Attendance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.recentAttendance.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">No attendance records yet.</p>
                    <p className="text-xs text-muted-foreground mt-1 px-4">Your attendance will appear here after you attend your first class.</p>
                  </div>
                ) : (
                  data.recentAttendance.map((record, idx) => (
                    <React.Fragment key={record.id}>
                      <div className="flex items-center justify-between group">
                        <div className="min-w-0 pr-4">
                          <h5 className="text-sm font-bold text-foreground truncate">{record.courseName}</h5>
                          <p className="text-xs text-muted-foreground mt-0.5">{record.date}</p>
                        </div>
                        <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-md shrink-0 uppercase tracking-wide
                          ${record.status === 'PRESENT' ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                          {record.status}
                        </span>
                      </div>
                      {idx < data.recentAttendance.length - 1 && <div className="h-px w-full bg-border/50" />}
                    </React.Fragment>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

