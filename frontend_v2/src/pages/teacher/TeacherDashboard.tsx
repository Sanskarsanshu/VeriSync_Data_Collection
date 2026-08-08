import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Users, Activity, ShieldAlert, MonitorPlay, 
  TrendingUp, ArrowRight, BookOpen, AlertCircle,
  FileEdit, Play, Calendar, UserCircle
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { AttendanceTrendFan } from '@/components/ui/attendance-trend-fan';
import { useAppStore } from '@/store/useAppStore';
import { teacherProfilesData } from '@/data/teacherProfiles';

const attendanceDataThisWeek = [
  { name: 'Mon', attendance: 88, proxies: 12 },
  { name: 'Tue', attendance: 92, proxies: 8 },
  { name: 'Wed', attendance: 95, proxies: 5 },
  { name: 'Thu', attendance: 89, proxies: 15 },
  { name: 'Fri', attendance: 94, proxies: 6 },
  { name: 'Sat', attendance: 96, proxies: 3 },
];

const verificationData = [
  { name: 'Biometric Success', value: 75, color: '#3B82F6' }, // Blue
  { name: 'OTP Fallback', value: 15, color: '#F59E0B' }, // Amber
  { name: 'Manual Override', value: 7, color: '#6366F1' }, // Indigo
  { name: 'Proxy Denied', value: 3, color: '#EF4444' }, // Red
];

// Recharts Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/90 backdrop-blur-sm border border-border p-3 rounded-lg shadow-xl">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-bold">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Stat Card Component
function StatCard({ title, value, trend, icon, colorClass, trendUp }: any) {
  return (
    <div className="p-6 rounded-3xl border border-border bg-card relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110 opacity-50 ${colorClass}`} />
      
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClass}`}>
          {icon}
        </div>
        
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
        </div>
        
        <div className="mt-2 text-sm text-muted-foreground font-medium">
          {trend}
        </div>
      </div>
    </div>
  );
}

interface ScheduleItem {
  id: string;
  startTime: string;
  endTime: string;
  roomName: string;
  subjectName: string;
  subjectCode: string;
  sectionName: string;
  courseId: string;
}

interface CourseItem {
  id: string;
  subjectName: string;
  subjectCode: string;
  sectionName: string;
  capacity: number;
}

interface DashboardData {
  teacherId: string;
  totalClasses: number;
  todaySchedule: ScheduleItem[];
  courses: CourseItem[];
}

export default function TeacherDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAppStore();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || '/api';
        const token = sessionStorage.getItem('verisync_token');
        
        const res = await fetch(`${API_URL}/teacher-portal/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!res.ok) throw new Error('Failed to fetch dashboard');
        const jsonData = await res.json();
        setData(jsonData);
      } catch (err) {
        console.error('Failed to fetch teacher dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  let teacherTitle = 'TEACHER';
  if (user?.role === 'teacher') {
    const profile = Object.values(teacherProfilesData).find(
      (t) => t.email.toLowerCase() === user.email?.toLowerCase()
    );
    if (profile) {
      teacherTitle = profile.designation.split('/')[0].trim();
    }
  }

  const assignedSubjectsCount = data?.courses?.length || 0;
  const activeCoursesCount = data?.todaySchedule?.length > 0 ? new Set(data.todaySchedule.map(s => s.courseId)).size : 0;

  return (
    <DashboardLayout role="teacher">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        
        {/* Header Section with Blue Aurora Gradient */}
        <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-8 pb-10">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-semibold mb-4 border border-blue-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                System Operational
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
                Executive Overview
              </h1>
              <p className="text-muted-foreground max-w-xl text-lg">
                Real-time insights into institutional attendance, verification health, and academic operations.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Link to="/teacher/insights/reports" className="px-4 py-2 rounded-xl bg-card border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2">
                <BookOpen size={16} />
                Generate Report
              </Link>
              <Link to="/teacher/attendance/start" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
                <MonitorPlay size={16} />
                Start Attendance
              </Link>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Assigned subjects" 
            value={assignedSubjectsCount.toString()}
            trend="Admin-authorised subjects" 
            icon={<BookOpen size={24} className="text-blue-500" />}
            colorClass="bg-blue-500/10 border-blue-500/20"
          />
          <StatCard 
            title="Active courses" 
            value={activeCoursesCount.toString()} 
            trend={`${data?.courses?.length || 0} course records`}
            icon={<MonitorPlay size={24} className="text-emerald-500" />}
            colorClass="bg-emerald-500/10 border-emerald-500/20"
          />
          <StatCard 
            title="Average attendance" 
            value="65.24%" 
            trend="Across your recorded classes" 
            icon={<TrendingUp size={24} className="text-amber-500" />}
            colorClass="bg-amber-500/10 border-amber-500/20"
          />
          <StatCard 
            title="Pending corrections" 
            value="1" 
            trend="Teacher recommendation required" 
            icon={<FileEdit size={24} className="text-indigo-500" />}
            colorClass="bg-indigo-500/10 border-indigo-500/20"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-foreground">Attendance Trends</h3>
                <p className="text-sm text-muted-foreground">Weekly aggregate vs Proxy flags</p>
              </div>
            </div>
            
            <div className="w-full flex-1 flex items-center justify-center pb-2">
              <AttendanceTrendFan />
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col">
            <div>
              <h3 className="font-bold text-lg text-foreground">Verification Health</h3>
              <p className="text-sm text-muted-foreground">Methods used today</p>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center relative mt-4">
              <div className="h-[200px] w-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={verificationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={4}
                    >
                      {verificationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-foreground">98%</span>
                <span className="text-[10px] font-bold text-blue-500 tracking-wider uppercase">Verified</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {verificationData.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: item.color }} />
                  <div>
                    <div className="text-xs text-muted-foreground leading-tight mb-0.5">{item.name}</div>
                    <div className="font-bold text-sm text-foreground">{item.value}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Data Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* My course classrooms - Span 2 */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xl">My course classrooms</h3>
                <p className="text-sm text-muted-foreground">Attendance-focused classroom cards</p>
              </div>
              <Link to="/teacher/academic/courses" className="text-sm font-medium text-blue-500 hover:text-blue-600 flex items-center gap-1">
                Open courses <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                Array(2).fill(0).map((_, i) => (
                  <div key={i} className="h-64 bg-muted/20 animate-pulse rounded-2xl border border-border"></div>
                ))
              ) : data?.courses?.length === 0 ? (
                <div className="col-span-full h-32 flex items-center justify-center border border-dashed border-border rounded-2xl text-muted-foreground">
                  No courses assigned yet.
                </div>
              ) : (
                data?.courses?.map((course: CourseItem, i: number) => (
                  <div key={course.id} className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col group hover:shadow-lg transition-shadow">
                    <div className="p-5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-10 -mt-10" />
                      <div className="absolute bottom-0 right-0 w-24 h-24 bg-black/10 rounded-tl-full -mb-10 -mr-10" />
                      
                      <div className="relative z-10">
                        <h4 className="font-bold text-lg leading-tight mb-1">{course.subjectName}</h4>
                        <p className="text-blue-100 text-xs font-medium opacity-90">{course.subjectCode} • Semester IV • {course.sectionName}</p>
                      </div>
                      
                      <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 flex items-center justify-center font-bold text-sm shadow-inner z-10">
                        {(user?.name || 'Teacher').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col gap-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <UserCircle size={16} className="text-blue-500" /> Teacher
                        </div>
                        <span className="font-semibold text-blue-500">{user?.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users size={16} className="text-blue-500" /> Students
                        </div>
                        <span className="font-semibold text-foreground">{course.capacity || 36}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar size={16} className="text-blue-500" /> Next class
                        </div>
                        <span className="font-semibold text-foreground">
                          {data?.todaySchedule?.find(s => s.courseId === course.id)?.startTime || 'Mon, 10:00 AM'}
                        </span>
                      </div>
                      
                      <div className="mt-auto pt-4">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 shadow-md">
                          <MonitorPlay size={16} className="mr-2" /> Attendance
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Today's Schedule and Alerts */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-xl">Today's schedule</h3>
                <Link to="/teacher/academic/schedule" className="text-sm font-medium text-blue-500 hover:text-blue-600">
                  View all
                </Link>
              </div>
              <p className="text-xs text-muted-foreground mb-6">Attendance actions appear only for authorised classes</p>

              <div className="space-y-4">
                {loading ? (
                  Array(2).fill(0).map((_, i) => (
                    <div key={i} className="h-20 bg-muted/20 animate-pulse rounded-xl border border-border"></div>
                  ))
                ) : data?.todaySchedule?.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-xl">
                    No classes scheduled for today.
                  </div>
                ) : (
                  data?.todaySchedule?.map((schedule: ScheduleItem) => (
                    <div key={schedule.id} className="group pb-4 border-b border-border/50 last:border-0 last:pb-0">
                      <h4 className="font-bold text-foreground mb-1 group-hover:text-blue-500 transition-colors">{schedule.subjectName}</h4>
                      <p className="text-xs text-muted-foreground mb-3 font-medium">
                        24 Jul 2026 · {schedule.startTime}–{schedule.endTime} · Room {schedule.roomName.replace('Room ', '')}
                      </p>
                      <Button variant="outline" size="sm" className="w-24 border-blue-500/30 text-blue-600 hover:bg-blue-500/10 hover:text-blue-700 h-8 rounded-lg">
                        Start
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Recent Alerts</h3>
                <Link to="/teacher/attendance/corrections" className="text-sm text-blue-500 hover:underline flex items-center gap-1">
                  View All <ArrowRight size={14} />
                </Link>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 transition-colors">
                  <div className="mt-0.5"><AlertCircle size={18} className="text-amber-500" /></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-amber-500">Suspicious Activity Detected</h4>
                      <span className="text-[10px] font-medium text-muted-foreground">10 min ago</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">Multiple manual overrides requested in MCA Semester I within 5 minutes.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-colors">
                  <div className="mt-0.5"><Activity size={18} className="text-blue-500" /></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-blue-500">Attendance Shortage</h4>
                      <span className="text-[10px] font-medium text-muted-foreground">2 hours ago</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">45 students have fallen below the 75% threshold this week.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
}
