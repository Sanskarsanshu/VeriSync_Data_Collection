import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Clock, Filter, FileX, Calendar, CheckCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useDataStore } from '@/store/useDataStore';
import { useAppStore } from '@/store/useAppStore';

const periods = [
  { id: "P1", time: "09:15-10:10" },
  { id: "P2", time: "10:10-11:05" },
  { id: "P3", time: "11:05-12:00" },
  { id: "P4", time: "12:00-12:55" },
  { id: "break", time: "12:55-13:25", label: "Lunch Break" },
  { id: "P5", time: "13:25-14:20" },
  { id: "P6", time: "14:20-15:15" }
];

export default function TeacherClassSchedule() {
  const { timetables } = useDataStore();
  const { user } = useAppStore();
  const [selectedSemester, setSelectedSemester] = useState<string>("3");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const currentData = timetables[selectedSemester];

  const getTypeColor = (type: string, status?: string) => {
    if (status === 'ADMIN_REVIEW_REQUIRED') return 'bg-red-500/10 text-red-700 border-red-500/20';
    switch(type) {
      case 'Theory': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'Practical': return 'bg-purple-500/10 text-purple-700 border-purple-500/20';
      case 'Project': return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
      default: return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
    }
  }

  const getTeachersDisplay = (cellData: any) => {
    if (!cellData.teachers || cellData.teachers.length === 0) {
      return cellData.teacherAlias || cellData.teacher || '';
    }
    
    // Check if it's the Sem 3 array of objects format
    if (Array.isArray(cellData.teachers) && typeof cellData.teachers[0] === 'object') {
      return cellData.teachers.map((t: any) => t.alias).join(', ');
    }
    
    // Check if it's the Sem 1 array of strings format
    if (Array.isArray(cellData.teachers)) {
      return cellData.teachers.join(', ');
    }
    
    return '';
  };

  // Helper to highlight if the current user is teaching this class
  const isMyClass = (cellData: any) => {
    if (!user || !user.email) return false;
    const userPrefix = user.email.split('@')[0].toLowerCase();
    
    const display = getTeachersDisplay(cellData).toLowerCase();
    return display.includes(userPrefix) || display.includes(user.name?.toLowerCase().split(' ')[0] || '');
  };

  const todaysClasses = React.useMemo(() => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = daysOfWeek[new Date().getDay()];
    
    // For demo purposes, if it's weekend, pretend it's Monday so we have data
    const activeDay = (new Date().getDay() === 0 || new Date().getDay() === 6) ? 'Monday' : todayName;

    const myClasses: any[] = [];

    Object.entries(timetables).forEach(([semStr, semData]) => {
      const dayData = (semData as any).days.find((d: any) => d.day === activeDay);
      if (dayData) {
        dayData.periods.forEach((p: any) => {
          if ((p.subjectCode || p.activity) && isMyClass(p)) {
            const periodConfig = periods.find(pc => pc.id === p.period);
            myClasses.push({
              ...p,
              time: periodConfig?.time || '',
              semester: (semData as any).semester,
              section: (semData as any).section
            });
          }
        });
      }
    });

    return myClasses.sort((a, b) => a.period.localeCompare(b.period));
  }, [timetables, user]);

  return (
    <DashboardLayout role="teacher">
      <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-semibold mb-3 border border-blue-500/20">
              <Clock size={14} /> Schedule
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Class Schedule</h1>
            <p className="text-muted-foreground mt-1">View the master timetable for your department across all semesters.</p>
          </div>
          
          <div className="flex gap-3 relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-4 py-2 rounded-xl bg-card border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2"
            >
              <Filter size={16} /> Filters
            </button>

            {isFilterOpen && (
              <div className="absolute top-full mt-2 right-0 bg-card border border-border rounded-xl shadow-lg p-4 z-50 min-w-[200px] animate-in fade-in slide-in-from-top-2">
                <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Filter by Semester</label>
                <select
                  value={selectedSemester}
                  onChange={e => setSelectedSemester(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="" disabled hidden>select semester</option>
                  <option value="1">1st year - I Sem</option>
                  <option value="2">1st year - II Sem</option>
                  <option value="3">2nd year - III Sem</option>
                  <option value="4">2nd year - IV sem</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Today's Schedule Section */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="p-4 sm:p-6 border-b border-border bg-emerald-500/5">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Calendar size={20} className="text-emerald-500" /> Today's Schedule
            </h2>
            <p className="text-muted-foreground text-sm mt-1">Your upcoming classes for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          
          <div className="p-4 sm:p-6">
            {todaysClasses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {todaysClasses.map((cls, idx) => (
                  <div key={idx} className="bg-background border border-border rounded-xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all group">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded">
                        {cls.time}
                      </span>
                      {cls.type && <Badge variant="outline" className={getTypeColor(cls.type, cls.status)}>{cls.type}</Badge>}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-base leading-tight group-hover:text-emerald-600 transition-colors">
                        {cls.subjectName || cls.activity}
                      </h4>
                      <p className="text-sm font-medium text-muted-foreground mt-1">{cls.subjectCode}</p>
                    </div>
                    <div className="mt-auto pt-3 border-t border-border/50 flex justify-between text-sm">
                      <span className="text-muted-foreground">Semester {cls.semester}</span>
                      <span className="font-semibold text-foreground">Sec {cls.section}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
                  <CheckCircle size={24} className="text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground text-lg">No classes today</h3>
                <p className="text-muted-foreground text-sm">You have no scheduled classes for the current day across all semesters.</p>
              </div>
            )}
          </div>
        </div>

        {currentData ? (
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-border bg-muted/30">
              <div className="flex flex-wrap items-center gap-4">
                <h3 className="font-semibold text-lg text-foreground">Program: {currentData.program}</h3>
                <Badge variant="outline" className="bg-background">Semester {currentData.semester}</Badge>
                <Badge variant="outline" className="bg-background">Section {currentData.section}</Badge>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-semibold">
                  <tr>
                    <th className="px-4 py-3 border-b border-r w-[120px] sticky left-0 bg-muted/95 backdrop-blur-sm z-10 text-center shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Day / Time</th>
                    {periods.map(p => (
                      <th key={p.id} className="px-4 py-3 border-b border-r min-w-[200px] text-center">
                        <div className="text-foreground">{p.id === 'break' ? p.label : p.id}</div>
                        <div className="text-xs font-normal opacity-70">{p.time}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {currentData.days.map((dayData: any, idx: number) => (
                    <tr key={idx} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-4 border-r font-medium text-foreground sticky left-0 bg-card/95 backdrop-blur-sm z-10 text-center align-middle shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                        {dayData.day}
                      </td>
                      
                      {periods.map(periodConfig => {
                        if (periodConfig.id === 'break') {
                          return (
                            <td key="break" className="px-4 py-4 border-r bg-muted/10 text-center align-middle">
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest rotate-180" style={{ writingMode: 'vertical-rl' }}>
                                LUNCH BREAK
                              </span>
                            </td>
                          );
                        }

                        const cellData = dayData.periods.find((p: any) => p.period === periodConfig.id);
                        const hasData = cellData && (cellData.subjectCode || cellData.activity);
                        const mine = hasData && isMyClass(cellData);
                        
                        return (
                          <td key={periodConfig.id} className="px-3 py-3 border-r relative group">
                            {hasData ? (
                              <div className={`h-full flex flex-col justify-between space-y-2 p-3 rounded-xl bg-background border shadow-sm group-hover:shadow-md transition-all ${mine ? 'border-emerald-500/50 bg-emerald-500/5 ring-1 ring-emerald-500/20' : 'border-border group-hover:border-blue-500/30'}`}>
                                <div className="flex justify-between items-start gap-2">
                                  <span className={`font-semibold line-clamp-2 leading-tight ${mine ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground'}`}>
                                    {cellData.subjectName || cellData.activity}
                                  </span>
                                  {cellData.type && (
                                    <Badge variant="outline" className={getTypeColor(cellData.type, cellData.status)}>
                                      {cellData.type}
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="pt-2 mt-auto border-t border-border/50 flex justify-between items-center text-xs">
                                  <span className="text-muted-foreground font-medium">
                                    {cellData.subjectCode}
                                  </span>
                                  <span className={`font-semibold px-2 py-0.5 rounded text-[10px] max-w-[100px] truncate ${mine ? 'bg-emerald-500/20 text-emerald-700' : 'bg-muted/50 text-foreground'}`} title={getTeachersDisplay(cellData)}>
                                    {mine ? 'Me' : getTeachersDisplay(cellData)}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="h-full min-h-[100px] flex items-center justify-center text-muted-foreground/30 text-xs italic">
                                Free Period
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-16 text-center shadow-sm flex flex-col items-center justify-center mt-6">
            <div className="bg-muted/50 p-6 rounded-full mb-6">
              <FileX size={48} className="text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Time Table Available</h3>
            <p className="text-muted-foreground max-w-md">
              There is currently no timetable data configured for the selected semester. Please wait for an administrator to publish the schedule.
            </p>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}