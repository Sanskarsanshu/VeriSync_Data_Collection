import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  FileSpreadsheet, Search, Download, Filter, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDataStore } from '@/store/useDataStore';
import { useAppStore } from '@/store/useAppStore';

const MONTHS_LATEST_FIRST = ['December','November','October','September','August','July','June','May','April','March','February','January'];
const SESSIONS = ["1st Year - I Sem", "2nd Year - III Sem"];

const MOCK_STUDENTS = [
  { roll: '26MCA001', name: 'Aarav Sharma' },
  { roll: '26MCA002', name: 'Priya Singh' },
  { roll: '26MCA003', name: 'Rohan Verma' },
  { roll: '26MCA004', name: 'Neha Gupta' },
  { roll: '26MCA005', name: 'Aditya Kumar' },
  { roll: '26MCA006', name: 'Sneha Patel' },
  { roll: '26MCA007', name: 'Vikram Singh' },
  { roll: '26MCA008', name: 'Anjali Das' },
  { roll: '26MCA009', name: 'Rahul Reddy' },
  { roll: '26MCA010', name: 'Kavya Iyer' },
  { roll: '26MCA011', name: 'Ishaan Mishra' },
  { roll: '26MCA012', name: 'Meera Nair' },
];

export default function TeacherAttendanceSheets() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
  const initialMonth = MONTHS_LATEST_FIRST.includes(currentMonthName) ? currentMonthName : 'August';
  
  const { user } = useAppStore();
  const { teachers } = useDataStore();
  
  const currentTeacher = useMemo(() => {
    if (!teachers || teachers.length === 0) return null;
    if (!user) return teachers[0];
    return teachers.find(t => t.email.toLowerCase() === user.email?.toLowerCase()) || teachers[0];
  }, [user, teachers]);

  const [filterMonth, setFilterMonth] = useState(initialMonth);
  const [filterSession, setFilterSession] = useState(SESSIONS[1]);
  const [filterCourse, setFilterCourse] = useState('');

  const availableCourses = useMemo(() => {
    if (!currentTeacher || !currentTeacher.semesterSubjects || !filterSession) return [];
    const semMap: Record<string, string> = {
      "1st Year - I Sem": "1",
      "2nd Year - III Sem": "3"
    };
    const sem = semMap[filterSession];
    return currentTeacher.semesterSubjects[sem] || [];
  }, [currentTeacher, filterSession]);

  React.useEffect(() => {
    if (availableCourses.length > 0 && !availableCourses.includes(filterCourse)) {
      setFilterCourse(availableCourses[0]);
    }
  }, [availableCourses, filterCourse]);

  // Calculate days in the selected month
  const daysInMonth = useMemo(() => {
    if (!filterMonth) return 31;
    const monthIndex = new Date(Date.parse(filterMonth + " 1, 2026")).getMonth();
    // Use 2026 as the base year for the academic calendar
    return new Date(2026, monthIndex + 1, 0).getDate();
  }, [filterMonth]);

  const daysArray = Array.from({length: daysInMonth}, (_, i) => i + 1);

  // Generate deterministic pseudo-random attendance
  const getAttendanceStatus = (studentIdx: number, day: number) => {
    // Generate a seed based on student, day, and active filters so it changes dynamically
    const seedStr = `${studentIdx}-${day}-${filterMonth}-${filterSession}-${filterCourse}`;
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) {
      seed = ((seed << 5) - seed) + seedStr.charCodeAt(i);
      seed |= 0; 
    }
    const rand = Math.abs(seed % 100);
    
    // Sundays (Assuming 2026, let's just make day % 7 == 0 a holiday for visual sake)
    if (day % 7 === 0) return '-';

    if (rand < 82) return 'P';
    if (rand < 95) return 'A';
    return 'L';
  };

  const filteredStudents = filterSession === "2nd Year - III Sem" ? MOCK_STUDENTS.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.roll.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  const handleExportCSV = () => {
    if (!filterSession || !filterCourse || !filterMonth) {
      alert("Please select filters to generate the sheet first.");
      return;
    }
    if (filteredStudents.length === 0) {
      alert("No data to export for this selection.");
      return;
    }

    // Add metadata rows to the top of the CSV
    const metadata = [
      `"Month:","${filterMonth} 2026"`,
      `"Session:","${filterSession}"`,
      `"Course:","${filterCourse}"`,
      "" // Empty row for spacing
    ];

    const headers = ["Roll No.", "Student Name", ...daysArray.map(String)];
    
    const rows = filteredStudents.map((student, idx) => {
      const rowData = [
        student.roll,
        `"${student.name}"`, // Quote names to handle any potential commas
        ...daysArray.map(day => getAttendanceStatus(idx, day))
      ];
      return rowData.join(",");
    });

    const csvContent = [...metadata, headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Sanitize filename
    const safeSession = filterSession.replace(/[^a-zA-Z0-9]/g, '_');
    const safeCourse = filterCourse.replace(/[^a-zA-Z0-9]/g, '_');
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Attendance_${safeSession}_${safeCourse}_${filterMonth}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <DashboardLayout role="teacher">
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-semibold mb-3 border border-blue-500/20">
              <FileSpreadsheet size={14} /> Records
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Attendance Sheets</h1>
            <p className="text-muted-foreground mt-1">Browse, filter, and export historical class attendance registers.</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted text-foreground rounded-xl transition-all shadow-sm border border-border font-medium"
            >
              <Filter size={16} /> Advanced Filter
            </button>
            <Button onClick={handleExportCSV} className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 gap-2 rounded-xl">
              <Download size={16} /> Export CSV
            </Button>
          </div>
        </div>

        {isFilterOpen && (
          <div className="bg-card border border-border rounded-2xl p-6 mt-2 flex flex-wrap gap-6 items-end animate-in fade-in slide-in-from-top-2 shadow-sm">
            <div className="flex flex-col gap-2 flex-1 min-w-[150px]">
              <label className="text-foreground font-semibold text-sm">Month</label>
              <div className="relative">
                <select 
                  value={filterMonth} 
                  onChange={e => setFilterMonth(e.target.value)}
                  className="w-full bg-background border border-border text-foreground rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-blue-500 appearance-none"
                >
                  <option value="">All Months</option>
                  {MONTHS_LATEST_FIRST.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-xs flex flex-col items-center">
                  <span>▲</span>
                  <span className="rotate-180 leading-[0.5] mt-1">▲</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 flex-1 min-w-[150px]">
              <label className="text-foreground font-semibold text-sm">Session</label>
              <div className="relative">
                <select 
                  value={filterSession} 
                  onChange={e => {
                    setFilterSession(e.target.value);
                    setFilterCourse(''); 
                  }}
                  className="w-full bg-background border border-border text-foreground rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-blue-500 appearance-none"
                >
                  <option value="">Select Session</option>
                  {SESSIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-xs">▼</div>
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-1 min-w-[150px]">
              <label className="text-foreground font-semibold text-sm">Course</label>
              <div className="relative">
                <select 
                  value={filterCourse} 
                  onChange={e => setFilterCourse(e.target.value)}
                  disabled={!filterSession}
                  className="w-full bg-background border border-border text-foreground rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-blue-500 appearance-none disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <option value="">Select Course</option>
                  {availableCourses.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {filterSession && <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-xs">▼</div>}
              </div>
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col mt-6">
          <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/20">
            <div className="flex items-center gap-3 w-full max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input 
                  type="text" 
                  placeholder="Search by student name or roll..." 
                  className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {filterMonth && filterCourse && (
              <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground bg-background px-3 py-1.5 rounded-lg border border-border">
                <span className="text-blue-500">{filterCourse}</span> • {filterMonth} 2026
              </div>
            )}
          </div>
          
          {filterSession && filterCourse && filterMonth ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse min-w-[800px]">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border/50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 font-semibold sticky left-0 bg-muted/95 backdrop-blur-sm border-r border-border/50 z-20 min-w-[120px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      Roll No.
                    </th>
                    <th className="px-4 py-3 font-semibold sticky left-[120px] bg-muted/95 backdrop-blur-sm border-r border-border/50 z-20 min-w-[180px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      Student Name
                    </th>
                    {daysArray.map(day => (
                      <th key={day} className="px-2 py-3 font-semibold text-center min-w-[36px] border-r border-border/10 last:border-r-0">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, idx) => (
                      <tr key={student.roll} className="hover:bg-muted/30 transition-colors group">
                        <td className="px-4 py-3 font-mono font-bold text-xs sticky left-0 bg-card group-hover:bg-muted/50 border-r border-border/50 z-10 transition-colors">
                          {student.roll}
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground sticky left-[120px] bg-card group-hover:bg-muted/50 border-r border-border/50 z-10 transition-colors flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                            <User size={12} />
                          </div>
                          <span className="truncate">{student.name}</span>
                        </td>
                        {daysArray.map(day => {
                          const status = getAttendanceStatus(idx, day);
                          let statusColor = "text-muted-foreground";
                          let bgColor = "transparent";
                          
                          if (status === 'P') {
                            statusColor = "text-emerald-500 font-bold";
                            bgColor = "bg-emerald-500/10";
                          } else if (status === 'A') {
                            statusColor = "text-destructive font-bold";
                            bgColor = "bg-destructive/10";
                          } else if (status === 'L') {
                            statusColor = "text-amber-500 font-bold";
                            bgColor = "bg-amber-500/10";
                          } else {
                            statusColor = "text-muted-foreground/40";
                            bgColor = "bg-muted/30";
                          }
                          
                          return (
                            <td key={day} className="p-1 border-r border-border/10 last:border-r-0">
                              <div className={`w-7 h-7 mx-auto flex items-center justify-center rounded text-xs ${statusColor} ${bgColor}`}>
                                {status}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={daysInMonth + 2} className="px-6 py-12 text-center text-muted-foreground">
                        No students found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 text-center flex flex-col items-center justify-center bg-background/50">
              <FileSpreadsheet size={48} className="text-muted-foreground/30 mb-4" />
              <h3 className="font-semibold text-lg text-foreground">Select Filters to Load Sheet</h3>
              <p className="text-muted-foreground text-sm max-w-sm mt-1">Please select a Session, Course, and Month above to generate the monthly attendance grid.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
