import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Download, Filter, CheckSquare, XSquare, ShieldCheck, AlertTriangle } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';

const MOCK_COURSES = [
  { courseCode: 'CC310', courseName: 'Advanced Web Designing using J2EE', teacherName: 'Dr. Praveen Kumar', present: 15, conducted: 18 },
  { courseCode: 'CC311', courseName: 'Cloud Computing', teacherName: 'Braj Kishor Prasad', present: 20, conducted: 20 },
  { courseCode: 'CC312', courseName: 'Big Data Analytics', teacherName: 'Dr. Sushmita Chakraborty', present: 14, conducted: 22 },
  { courseCode: 'CC313', courseName: 'Mini Project II (Lab)', teacherName: 'Dr. Praveen Kumar', present: 8, conducted: 8 },
  { courseCode: 'MDC302', courseName: 'Digital Marketing and E-Commerce', teacherName: 'Bhawna Sinha, Richa Verma', present: 15, conducted: 24 },
];

const WEEKLY_TREND_DATA = [
  { week: 'W1', percentage: 78 },
  { week: 'W2', percentage: 80 },
  { week: 'W3', percentage: 84 },
  { week: 'W4', percentage: 86 },
  { week: 'W5', percentage: 88 },
];

const DAILY_ATTENDANCE_DATA = [
  { day: 'Mon', present: 80 },
  { day: 'Tue', present: 100 },
  { day: 'Wed', present: 66 },
  { day: 'Thu', present: 100 },
  { day: 'Fri', present: 75 },
  { day: 'Sat', present: 100 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-3 rounded-lg shadow-xl">
        <p className="text-foreground font-semibold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            {entry.name}: <span className="font-bold text-foreground">{entry.value}%</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function StudentAnalytics() {
  const [selectedCourse, setSelectedCourse] = useState<string>("ALL");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const displayedCourses = useMemo(() => {
    if (selectedCourse === "ALL") return MOCK_COURSES;
    return MOCK_COURSES.filter(c => c.courseCode === selectedCourse);
  }, [selectedCourse]);

  const totalPresent = useMemo(() => displayedCourses.reduce((sum, c) => sum + c.present, 0), [displayedCourses]);
  const totalConducted = useMemo(() => displayedCourses.reduce((sum, c) => sum + c.conducted, 0), [displayedCourses]);
  const totalAbsent = totalConducted - totalPresent;
  const overallPercentage = totalConducted === 0 ? 0 : (totalPresent / totalConducted) * 100;

  const calculateNeededClasses = (present: number, conducted: number) => {
    const currentPct = (present / conducted) * 100;
    if (currentPct >= 75) return "Maintaining threshold";
    
    const needed = Math.ceil(3 * conducted - 4 * present);
    return `${needed} consecutive class${needed > 1 ? 'es' : ''} needed`;
  };

  const getStatus = (pct: number) => {
    if (pct >= 85) return { label: 'Good', color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    if (pct >= 75) return { label: 'Warning', color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' };
    return { label: 'Critical', color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20' };
  };

  return (
    <DashboardLayout role="student">
      <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 p-2 sm:p-6 font-sans">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              Attendance Analytics
            </h1>
            <p className="text-muted-foreground text-sm">
              Daily, weekly, monthly and subject-wise views of your personal data.
            </p>
          </div>
          
          <div className="flex items-center gap-3 relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-4 py-2 rounded-xl bg-card border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2 shadow-sm"
            >
              <Filter size={16} /> {selectedCourse === "ALL" ? "All Subjects" : selectedCourse}
            </button>

            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-lg p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Filter by Subject</label>
                <select
                  value={selectedCourse}
                  onChange={e => {
                    setSelectedCourse(e.target.value);
                    setIsFilterOpen(false);
                  }}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-student-500"
                >
                  <option value="ALL">All Subjects</option>
                  {MOCK_COURSES.map(c => (
                    <option key={c.courseCode} value={c.courseCode}>{c.courseName}</option>
                  ))}
                </select>
              </div>
            )}

            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors shadow-sm">
              <Download size={16} />
              Download Summary
            </button>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <CheckSquare className="text-blue-500" size={20} />
              </div>
            </div>
            <p className="text-sm font-semibold text-muted-foreground mb-4">Overall attendance</p>
            <h3 className="text-4xl font-bold text-foreground tracking-tight">{overallPercentage.toFixed(1)}%</h3>
            <p className="text-xs text-muted-foreground mt-2">Good standing</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-student-500/20 flex items-center justify-center">
                <CheckSquare className="text-student-500" size={20} />
              </div>
            </div>
            <p className="text-sm font-semibold text-muted-foreground mb-4">Classes present</p>
            <h3 className="text-4xl font-bold text-foreground tracking-tight">{totalPresent}</h3>
            <p className="text-xs text-muted-foreground mt-2">Across current subject records</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="text-rose-500" size={20} />
              </div>
            </div>
            <p className="text-sm font-semibold text-muted-foreground mb-4">Classes absent</p>
            <h3 className={`text-4xl font-bold tracking-tight ${totalAbsent > 0 ? 'text-rose-500' : 'text-foreground'}`}>{totalAbsent}</h3>
            <p className={`text-xs mt-2 ${totalAbsent > 0 ? 'text-rose-500/80' : 'text-muted-foreground'}`}>
              {totalAbsent > 0 ? 'Review incorrect entries promptly' : 'Perfect attendance record'}
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="text-emerald-500" size={20} />
              </div>
            </div>
            <p className="text-sm font-semibold text-muted-foreground mb-4">Current threshold</p>
            <h3 className="text-4xl font-bold text-foreground tracking-tight">75%</h3>
            <p className="text-xs text-muted-foreground mt-2">Configured by college admin</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-foreground">Weekly trend</h3>
              <p className="text-xs text-muted-foreground">Attendance percentage by week</p>
            </div>
            <div className="flex-1 min-h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={WEEKLY_TREND_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#888888" strokeOpacity={0.15} vertical={false} />
                  <XAxis dataKey="week" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    name="Attendance"
                    dataKey="percentage" 
                    stroke="#5D0565" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#5D0565', strokeWidth: 2, stroke: 'var(--background)' }}
                    activeDot={{ r: 6, fill: '#5D0565' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-foreground">Daily attendance</h3>
              <p className="text-xs text-muted-foreground">Present classes across the current week</p>
            </div>
            <div className="flex-1 min-h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DAILY_ATTENDANCE_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#888888" strokeOpacity={0.15} vertical={false} />
                  <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'currentColor', opacity: 0.05 }} />
                  <Bar dataKey="present" name="Attendance" radius={[4, 4, 0, 0]}>
                    {DAILY_ATTENDANCE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#3b82f6" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Datatable Section */}
        <div className="relative overflow-hidden rounded-3xl bg-card border border-border shadow-sm">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-student-500/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="p-6 border-b border-border/50">
            <h3 className="text-lg font-bold text-foreground">Subject-wise attendance</h3>
            <p className="text-xs text-muted-foreground mt-1">Classes required to reach or maintain the official threshold</p>
          </div>

          <div className="relative z-10 w-full overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] font-bold text-muted-foreground uppercase bg-muted/20 border-b border-border/50 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Teacher</th>
                  <th className="px-6 py-4 text-center">Present</th>
                  <th className="px-6 py-4 text-center">Conducted</th>
                  <th className="px-6 py-4 min-w-[200px]">Attendance</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Classes Needed for 75%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {displayedCourses.map((row) => {
                  const pct = (row.present / row.conducted) * 100;
                  const status = getStatus(pct);
                  
                  return (
                    <tr key={row.courseCode} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-5">
                        <div className="font-bold text-foreground mb-0.5 whitespace-nowrap">{row.courseName}</div>
                        <div className="text-xs text-muted-foreground">{row.courseCode}</div>
                      </td>
                      <td className="px-6 py-5 text-muted-foreground whitespace-nowrap font-medium">
                        {row.teacherName}
                      </td>
                      <td className="px-6 py-5 text-center font-bold text-foreground">
                        {row.present}
                      </td>
                      <td className="px-6 py-5 text-center text-muted-foreground font-medium">
                        {row.conducted}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-xs font-bold ${status.color}`}>
                            {pct.toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${pct >= 75 ? 'bg-student-500' : 'bg-rose-500'}`} 
                            style={{ width: `${pct}%` }} 
                          />
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full bg-current`}></span>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right whitespace-nowrap text-xs text-muted-foreground font-medium">
                        {calculateNeededClasses(row.present, row.conducted)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
