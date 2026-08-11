import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Clock, FileX } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useDataStore } from '@/store/useDataStore';

const periods = [
  { id: "P1", time: "09:15-10:10" },
  { id: "P2", time: "10:10-11:05" },
  { id: "P3", time: "11:05-12:00" },
  { id: "P4", time: "12:00-12:55" },
  { id: "break", time: "12:55-13:25", label: "Lunch Break" },
  { id: "P5", time: "13:25-14:20" },
  { id: "P6", time: "14:20-15:15" }
];

export default function StudentTimeTable() {
  const { timetables } = useDataStore();
  const currentData = timetables["3"]; // Force it to only show 3rd Semester

  const getTypeColor = (type: string, status?: string) => {
    if (status === 'ADMIN_REVIEW_REQUIRED') return 'bg-red-500/10 text-red-700 border-red-500/20';
    switch(type) {
      case 'Theory': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'Practical': return 'bg-purple-500/10 text-purple-700 border-purple-500/20';
      case 'Project': return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
      default: return 'bg-student-500/10 text-student-700 border-student-500/20';
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

  return (
    <DashboardLayout role="student">
      <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 p-2 sm:p-6 font-sans">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-student-500/10 text-student-600 text-xs font-semibold mb-3 border border-student-500/20">
              <Clock size={14} /> Schedule
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Daily Time Table</h1>
            <p className="text-muted-foreground mt-1">View your mapped courses and faculty across all time slots.</p>
          </div>
        </div>

        {currentData ? (
          <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-student-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="p-4 sm:p-6 border-b border-border bg-muted/30 relative z-10">
              <div className="flex flex-wrap items-center gap-4">
                <h3 className="font-semibold text-lg text-foreground">Program: {currentData.program}</h3>
                <Badge variant="outline" className="bg-background text-student-600 border-student-500/30">Semester {currentData.semester}</Badge>
                <Badge variant="outline" className="bg-background text-muted-foreground">Section {currentData.section}</Badge>
              </div>
            </div>

            <div className="overflow-x-auto relative z-10">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-semibold">
                  <tr>
                    <th className="px-4 py-3 border-b border-r border-border/50 w-[120px] sticky left-0 bg-muted/95 backdrop-blur-sm z-10 text-center shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Day / Time</th>
                    {periods.map(p => (
                      <th key={p.id} className="px-4 py-3 border-b border-r border-border/50 min-w-[200px] text-center">
                        <div className="text-foreground">{p.id === 'break' ? p.label : p.id}</div>
                        <div className="text-xs font-normal opacity-70">{p.time}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {currentData.days.map((dayData: any, idx: number) => (
                    <tr key={idx} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-4 border-r border-border/50 font-medium text-foreground sticky left-0 bg-card/95 backdrop-blur-sm z-10 text-center align-middle shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                        {dayData.day}
                      </td>
                      
                      {periods.map(periodConfig => {
                        if (periodConfig.id === 'break') {
                          return (
                             <td key="break" className="px-4 py-4 border-r border-border/50 bg-muted/10 text-center align-middle">
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest rotate-180" style={{ writingMode: 'vertical-rl' }}>
                                LUNCH BREAK
                              </span>
                            </td>
                          );
                        }

                        const cellData = dayData.periods.find((p: any) => p.period === periodConfig.id);
                        const hasData = cellData && (cellData.subjectCode || cellData.activity);
                        
                        return (
                          <td key={periodConfig.id} className="px-3 py-3 border-r border-border/50 relative group">
                            {hasData ? (
                              <div className={`h-full flex flex-col justify-between space-y-2 p-3 rounded-xl bg-background border shadow-sm group-hover:shadow-md transition-all ${cellData.status === 'ADMIN_REVIEW_REQUIRED' ? 'border-red-500/50 bg-red-500/5' : 'border-border group-hover:border-student-500/30'}`}>
                                <div className="flex justify-between items-start gap-2">
                                  <span className={`font-semibold line-clamp-2 leading-tight ${cellData.status === 'ADMIN_REVIEW_REQUIRED' ? 'text-red-600 dark:text-red-400' : 'text-foreground'}`}>
                                    {cellData.subjectName || cellData.activity}
                                  </span>
                                  {cellData.type && (
                                    <Badge variant="outline" className={getTypeColor(cellData.type, cellData.status)}>
                                      {cellData.status === 'ADMIN_REVIEW_REQUIRED' ? 'Conflict' : cellData.type}
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="pt-2 mt-auto border-t border-border/50 flex justify-between items-center text-xs">
                                  <span className="text-muted-foreground font-medium">
                                    {cellData.subjectCode}
                                  </span>
                                  <span className="text-foreground font-semibold bg-muted/50 px-2 py-0.5 rounded text-[10px] max-w-[100px] truncate" title={getTeachersDisplay(cellData)}>
                                    {getTeachersDisplay(cellData)}
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
              There is currently no timetable data configured for your semester.
            </p>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
