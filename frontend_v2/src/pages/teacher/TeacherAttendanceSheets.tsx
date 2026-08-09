import React, { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FileSpreadsheet, Search, Download, Filter, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';

const MONTHS_LATEST_FIRST = ['December','November','October','September','August','July','June','May','April','March','February','January'];

interface Course {
  id: string;
  subjectName: string;
  subjectCode: string;
  sectionName: string;
}

interface StudentAttendance {
  id: string;
  roll: string;
  name: string;
  attendance: string[];
}

export default function TeacherAttendanceSheets() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
  const initialMonth = MONTHS_LATEST_FIRST.includes(currentMonthName) ? currentMonthName : 'August';
  
  const { token } = useAppStore();
  
  const [filterMonth, setFilterMonth] = useState(initialMonth);
  const [filterCourseId, setFilterCourseId] = useState('');
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [studentsData, setStudentsData] = useState<StudentAttendance[]>([]);
  const [daysInMonth, setDaysInMonth] = useState(31);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingSheet, setIsFetchingSheet] = useState(false);

  // 1. Fetch available courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/teacher-portal/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCourses(data.courses || []);
          if (data.courses?.length > 0) {
            setFilterCourseId(data.courses[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard courses:", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchCourses();
  }, [token]);

  // 2. Fetch Attendance Sheet when course or month changes
  useEffect(() => {
    const fetchSheet = async () => {
      if (!filterCourseId || !filterMonth) return;
      setIsFetchingSheet(true);
      try {
        const res = await fetch(`http://localhost:3000/api/teacher-portal/courses/${filterCourseId}/attendance-sheet?month=${filterMonth}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStudentsData(data.students || []);
          setDaysInMonth(data.daysInMonth || 31);
        } else {
          setStudentsData([]);
        }
      } catch (err) {
        console.error("Failed to fetch sheet:", err);
      } finally {
        setIsFetchingSheet(false);
      }
    };
    if (token) fetchSheet();
  }, [token, filterCourseId, filterMonth]);

  const daysArray = Array.from({length: daysInMonth}, (_, i) => i + 1);

  const filteredStudents = useMemo(() => {
    return studentsData.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.roll.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [studentsData, searchTerm]);

  const handleExportCSV = () => {
    if (!filterCourseId || !filterMonth) {
      alert("Please select filters to generate the sheet first.");
      return;
    }
    if (filteredStudents.length === 0) {
      alert("No data to export for this selection.");
      return;
    }

    const course = courses.find(c => c.id === filterCourseId);
    const metadata = [
      `"Month:","${filterMonth} 2026"`,
      `"Course:","${course?.subjectName || ''}"`,
      "" 
    ];

    const headers = ["Roll No.", "Student Name", ...daysArray.map(String)];
    
    const rows = filteredStudents.map((student) => {
      const rowData = [
        student.roll,
        `"${student.name}"`,
        ...student.attendance
      ];
      return rowData.join(",");
    });

    const csvContent = [...metadata, headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const safeCourse = (course?.subjectName || '').replace(/[^a-zA-Z0-9]/g, '_');
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Attendance_${safeCourse}_${filterMonth}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <DashboardLayout role="teacher">
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

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
              <label className="text-foreground font-semibold text-sm">Course</label>
              <div className="relative">
                <select 
                  value={filterCourseId} 
                  onChange={e => setFilterCourseId(e.target.value)}
                  className="w-full bg-background border border-border text-foreground rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-blue-500 appearance-none"
                >
                  {courses.map(c => <option key={c.id} value={c.id}>{c.subjectName} ({c.sectionName})</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-xs">▼</div>
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
            {filterMonth && filterCourseId && (
              <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground bg-background px-3 py-1.5 rounded-lg border border-border">
                <span className="text-blue-500">{courses.find(c => c.id === filterCourseId)?.subjectName}</span> • {filterMonth} 2026
              </div>
            )}
          </div>
          
          {isFetchingSheet ? (
            <div className="p-16 flex justify-center">
               <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filterCourseId && filterMonth ? (
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
                    filteredStudents.map((student) => (
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
                        {student.attendance.map((status, dayIdx) => {
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
                            <td key={dayIdx} className="p-1 border-r border-border/10 last:border-r-0">
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
              <p className="text-muted-foreground text-sm max-w-sm mt-1">Please select a Course and Month above to generate the monthly attendance grid.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
