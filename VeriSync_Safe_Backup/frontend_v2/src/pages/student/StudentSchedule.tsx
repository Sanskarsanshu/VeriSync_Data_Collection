import React, { useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Download } from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';

export default function StudentSchedule() {
  const { timetables, academicEvents } = useDataStore();
  const timetable3 = timetables["3"];

  const scheduleData = useMemo(() => {
    if (!timetable3 || !timetable3.days) return [];

    const periodsMap: Record<string, string> = {
      "P1": "09:15–10:10",
      "P2": "10:10–11:05",
      "P3": "11:05–12:00",
      "P4": "12:00–12:55",
      "P5": "13:25–14:20",
      "P6": "14:20–15:15"
    };

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const targetDates = [today, tomorrow];

    let generatedSchedule: any[] = [];
    let idCounter = 1;

    // Helper to format date
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // Helper to extract teacher names
    const extractTeachers = (cellData: any) => {
      if (!cellData.teachers || cellData.teachers.length === 0) return cellData.teacherAlias || cellData.teacher || '';
      if (Array.isArray(cellData.teachers) && typeof cellData.teachers[0] === 'object') {
        return cellData.teachers.map((t: any) => t.alias).join(', ');
      }
      if (Array.isArray(cellData.teachers)) return cellData.teachers.join(', ');
      return '';
    };

    // Helper to check if a date is a holiday and return its name
    const getHoliday = (date: Date) => {
      return academicEvents.find((event) => {
        if (event.type !== 'Holiday' && event.type !== 'Break') return false;
        const start = new Date(event.startDate);
        start.setHours(0,0,0,0);
        const end = new Date(event.endDate);
        end.setHours(0,0,0,0);
        return date >= start && date <= end;
      });
    };

    // Iterate only over the 2 target dates (Today and Tomorrow)
    targetDates.forEach((targetDate, index) => {
      const holidayEvent = getHoliday(targetDate);
      const dayName = daysOfWeek[targetDate.getDay()];
      
      // If it's a holiday, inject a No Class row
      if (holidayEvent) {
        generatedSchedule.push({
          id: `no-class-${index}`,
          isNoClassRow: true,
          date: formatDate(targetDate),
          dayName: dayName,
          reason: `Holiday: ${holidayEvent.title}`,
          sortValue: targetDate.getTime()
        });
        return;
      }

      const dayData = timetable3.days.find((d: any) => d.day === dayName);
      let hasValidClasses = false;
      
      if (dayData) {
        dayData.periods.forEach((p: any) => {
          if (p.subjectCode && p.period !== 'break') {
            hasValidClasses = true;
            generatedSchedule.push({
              id: String(idCounter++),
              date: formatDate(targetDate),
              time: periodsMap[p.period] || 'Unknown Time',
              courseName: p.subjectName || 'Unknown Course',
              courseCode: p.subjectCode,
              teacher: extractTeachers(p),
              room: p.room || 'TBA',
              type: p.type || 'Theory',
              status: targetDate < today ? 'Completed' : 'Upcoming',
              attendance: '—',
              sortValue: targetDate.getTime() + parseInt(p.period.replace('P',''))
            });
          }
        });
      }

      // If no valid classes were found for this day, inject a No Class row
      if (!hasValidClasses) {
        generatedSchedule.push({
          id: `no-class-${index}`,
          isNoClassRow: true,
          date: formatDate(targetDate),
          dayName: dayName,
          reason: (dayName === 'Sunday' || dayName === 'Saturday') ? 'Weekend (No classes scheduled)' : 'No classes scheduled',
          sortValue: targetDate.getTime()
        });
      }
    });

    // Sort chronologically
    return generatedSchedule.sort((a, b) => a.sortValue - b.sortValue);
  }, [timetable3, academicEvents]);

  return (
    <DashboardLayout role="student">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 p-2 sm:p-6 font-sans">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-border/50 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              Class Schedule
            </h1>
            <p className="text-muted-foreground text-sm">
              Daily and weekly schedule for enrolled attendance courses.
            </p>
          </div>
          
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors shadow-sm">
            <Download size={16} />
            Export
          </button>
        </div>

        {/* Datatable Section with Aurora styling */}
        <div className="relative overflow-hidden rounded-3xl bg-card border border-border shadow-sm">
          {/* Subtle glowing orbs for premium feel */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-student-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 w-full overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Time</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Course</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Teacher</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Room</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-center">Status</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-center">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {scheduleData.map((row) => {
                  if (row.isNoClassRow) {
                    return (
                      <tr key={row.id} className="bg-background/40">
                        <td colSpan={8} className="px-6 py-8 text-center">
                          <div className="inline-flex items-center justify-center gap-3 px-4 py-2 rounded-full border border-border/50 bg-muted/30">
                            <span className="w-2 h-2 rounded-full bg-student-500/50"></span>
                            <span className="text-sm font-medium text-foreground">
                              {row.reason} on {row.date} ({row.dayName})
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={row.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap text-foreground font-medium">
                      {row.date}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-muted-foreground">
                      {row.time}
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-foreground mb-0.5">{row.courseName}</div>
                      <div className="text-xs text-muted-foreground">{row.courseCode}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-muted-foreground font-medium">
                      {row.teacher}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-muted-foreground">
                      {row.room}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-muted-foreground">
                      {row.type}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 text-xs font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center text-muted-foreground font-medium">
                      {row.attendance}
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
