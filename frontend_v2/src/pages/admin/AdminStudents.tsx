import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Users, Search, Filter, AlertCircle, Edit, Eye, Trash2, Fingerprint,
  ArrowUp, ArrowLeft, Download
} from 'lucide-react';
import { AnimatedRadialChart } from '@/components/ui/animated-radial-chart';
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal';
import { useAppStore } from '@/store/useAppStore';
import { useDataStore, Student } from '@/store/useDataStore';

// --- Helper functions for Mock Data ---
const MONTHS_LATEST_FIRST = ['July','June','May','April','March','February','January'];
const DAY_COLS = Array.from({length:30}, (_,i)=>String(i+1).padStart(2,'0'));
const AVATAR_COLORS = ['#2F6F5E','#B4517A','#5B6FD6','#C77B3B','#3F8FBF','#7A5FBF','#4E8B5A'];

const SESSIONS = ["1st Year - I Sem", "2nd Year - III Sem"];
const COURSES_BY_SESSION: Record<string, string[]> = {
  "1st Year - I Sem": ["CC101", "CC102", "CC103", "CC104", "CC105", "SEC101"],
  "2nd Year - III Sem": ["CC310", "CC311", "CC312", "CC313", "MDC302"]
};
const ALL_COURSES = ['EC202', ...COURSES_BY_SESSION["1st Year - I Sem"], ...COURSES_BY_SESSION["2nd Year - III Sem"]];

function initials(name: string){
  return name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
}

function makeMonthly(seedPresent: number){
  const out: any = {};
  MONTHS_LATEST_FIRST.forEach((m,i)=>{
    const present = Math.max(55, Math.min(97, seedPresent + (i*4 % 15) - 6));
    out[m] = { present, absent: 100 - present };
  });
  return out;
}

function makeMatrixRow(presentPct: number){
  return DAY_COLS.map(d=>{
    if(d === '07' || d === '21') return 'H';
    return Math.random()*100 < presentPct ? '1' : '0';
  });
}

function makeMatrix(seedPresent: number){
  const courseMatrices: any = {};
  ALL_COURSES.forEach(c => {
    const matrix: any = {};
    MONTHS_LATEST_FIRST.forEach((m,i)=>{
      const p = Math.max(55, Math.min(97, seedPresent + (i*4 % 15) - 6));
      matrix[m] = makeMatrixRow(p);
    });
    courseMatrices[c] = matrix;
  });
  return courseMatrices;
}

const RAW_STUDENTS = [
  {name:'Ananya Singh',  roll:'MCA030', course:'EC202', seed:88, verification:'Verified',     time:'09:02 AM'},
  {name:'Garima Gupta',  roll:'MCA031', course:'EC202', seed:81, verification:'Not verified', time:'—'},
  {name:'Harshita Jha',  roll:'MCA032', course:'EC202', seed:90, verification:'Verified',     time:'09:05 AM'},
  {name:'Komal Kumari',  roll:'MCA033', course:'EC202', seed:76, verification:'Not verified', time:'—'},
  {name:'Mahi Verma',    roll:'MCA034', course:'EC202', seed:93, verification:'Verified',     time:'08:58 AM'},
  {name:'Neha Sinha',    roll:'MCA035', course:'EC202', seed:70, verification:'Not verified', time:'—'},
  {name:'Pallavi Roy',   roll:'MCA036', course:'EC202', seed:85, verification:'Not verified', time:'—'},
  {name:'Pooja Sharma',  roll:'MCA037', course:'EC202', seed:79, verification:'Verified',     time:'09:11 AM'},
  {name:'Riya Kumari',   roll:'MCA038', course:'EC202', seed:66, verification:'Not verified', time:'—'},
];

// Using Student from store
const mockStudents: Student[] = RAW_STUDENTS
  .map((s,i)=>({
    id:'s'+i,
    name:s.name,
    roll:s.roll,
    course:s.course,
    examRoll:'25'+s.roll.replace('MCA','MCA0'),
    regNo:'25PWC0'+s.roll.replace(/\D/g,''),
    session:'2025–27',
    classText:'MCA, Sem-IV',
    color:AVATAR_COLORS[i % AVATAR_COLORS.length],
    status: s.seed < 75 ? 'WARNING' : 'ACTIVE',
    verification:s.verification,
    time:s.time,
    monthly:makeMonthly(s.seed),
    matrix:makeMatrix(s.seed),
    faceEnrolled: s.verification === 'Verified',
    attendance: s.seed
  }));


// --- Mini Donut Chart Component ---
function MiniDonut({ present, monthLabel }: { present: number, monthLabel: string }) {
  const absent = 100 - present;
  return (
    <div className="flex flex-col items-center relative w-[140px] pt-2">
      <div className="w-full flex justify-between text-[11px] text-muted-foreground px-1 mb-[-10px] z-10 relative">
        <div className="text-left">Absent<br/><span className="text-foreground font-bold">{absent}%</span></div>
        <div className="text-right">Present<br/><span className="text-foreground font-bold">{present}%</span></div>
      </div>
      
      <AnimatedRadialChart value={present} size={130} strokeWidth={10} showLabels={false} />
      
      <span className="font-serif italic font-bold text-base text-foreground tracking-wide mt-[-10px]">
        {monthLabel.slice(0,3)}
      </span>
    </div>
  );
}

// --- Detail View Component ---
const DetailView = ({ student, onBack }: { student: Student, onBack: () => void }) => {
  const [selectedCourse, setSelectedCourse] = useState(Object.keys(student.matrix)[0]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterMonth, setFilterMonth] = useState('');
  const [filterSession, setFilterSession] = useState('');
  const [filterCourse, setFilterCourse] = useState('');

  const monthsToRender = filterMonth ? [filterMonth] : MONTHS_LATEST_FIRST;
  const activeCourse = filterCourse || selectedCourse;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm hover:text-blue-700 dark:hover:text-blue-300 transition-colors mb-2">
        <ArrowLeft size={16} /> Back to Attendance Records
      </button>

      <div className="flex items-center gap-4 p-5 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 mb-6">
        <div className="w-12 h-12 rounded-xl text-white flex items-center justify-center font-bold text-lg shadow-sm" style={{ background: student.color }}>
          {initials(student.name)}
        </div>
        <div>
          <div className="text-lg font-bold text-foreground">{student.name}</div>
          <div className="text-sm text-muted-foreground">{student.roll}</div>
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-start gap-6 bg-card border border-border p-6 rounded-2xl mb-6 shadow-sm">
        <div className="flex gap-5 items-center">
          <div className="w-20 h-20 bg-white dark:bg-white rounded-lg overflow-hidden flex items-center justify-center border border-border/50 shadow-sm shrink-0">
            <img src="/features/collage-logo.png" alt="College Logo" className="w-full h-full object-contain p-1" />
          </div>
          <div>
            <div className="text-base font-extrabold tracking-wide text-foreground">PATNA WOMEN'S COLLEGE</div>
            <div className="text-xs text-muted-foreground mt-1">Autonomous · Patna University</div>
            <div className="text-sm font-semibold text-muted-foreground mt-2">MCA Department</div>
          </div>
        </div>
        
        <div className="grid grid-cols-[130px_1fr] gap-x-4 gap-y-2 text-sm max-w-sm w-full">
          <div className="font-bold text-foreground">Name</div><div className="text-foreground">: {student.name}</div>
          <div className="font-bold text-foreground">Class Roll No</div><div className="text-foreground">: {student.roll.replace(/\D/g,'')}</div>
          <div className="font-bold text-foreground">Exam Roll No</div><div className="text-foreground">: {student.examRoll}</div>
          <div className="font-bold text-foreground">Reg No</div><div className="text-foreground">: {student.regNo}</div>
          <div className="font-bold text-foreground">Session</div><div className="text-foreground">: {student.session}</div>
          <div className="font-bold text-foreground">Course</div><div className="text-foreground">: {student.classText}</div>
        </div>

        <button className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-all flex items-center gap-2">
          <Download size={16} /> Download CSV
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-8 mb-4 gap-4">
        <h3 className="text-xl font-bold text-foreground">Attendance Record</h3>
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-[#121212] hover:bg-[#1A1A1A] text-slate-100 rounded-xl transition-all shadow-md border border-slate-800 font-medium"
        >
          <Filter size={16} /> Filters
        </button>
      </div>

      {isFilterOpen && (
        <div className="bg-[#121212] border border-slate-800 rounded-2xl p-6 mb-6 flex flex-wrap gap-6 items-end animate-in fade-in slide-in-from-top-2 shadow-xl">
          <div className="flex flex-col gap-2 flex-1 min-w-[150px]">
            <label className="text-slate-100 font-serif font-bold text-sm text-center">Month</label>
            <div className="relative">
              <select 
                value={filterMonth} 
                onChange={e => setFilterMonth(e.target.value)}
                className="w-full bg-[#18181B] border border-slate-700 text-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-slate-500 appearance-none"
              >
                <option value="">All Months</option>
                {MONTHS_LATEST_FIRST.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs flex flex-col items-center">
                <span>^</span>
                <span className="rotate-180 leading-[0.5] mt-1">^</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 flex-1 min-w-[150px]">
            <label className="text-slate-100 font-serif font-bold text-sm text-center">Session</label>
            <div className="relative">
              <select 
                value={filterSession} 
                onChange={e => {
                  setFilterSession(e.target.value);
                  setFilterCourse(''); 
                }}
                className="w-full bg-[#18181B] border border-slate-700 text-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-slate-500 appearance-none"
              >
                <option value="">Select</option>
                {SESSIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">v</div>
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1 min-w-[150px]">
            <label className="text-slate-100 font-serif font-bold text-sm text-center">Course</label>
            <div className="relative">
              <select 
                value={filterCourse} 
                onChange={e => setFilterCourse(e.target.value)}
                disabled={!filterSession}
                className="w-full bg-[#18181B] border border-slate-700 text-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-slate-500 appearance-none disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value=""></option>
                {filterSession && COURSES_BY_SESSION[filterSession].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {filterSession && <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">v</div>}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-10 bg-card border border-border rounded-2xl p-8 shadow-sm mb-6 justify-center md:justify-start">
        {monthsToRender.slice(0, 5).map(m => (
          <MiniDonut key={m} present={student.monthly[m].present} monthLabel={m} />
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col">
        <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
          <div>
            <h3 className="text-lg font-bold text-foreground">2026 Attendance Matrix</h3>
            <p className="text-sm text-muted-foreground mt-1">1 = present, 0 = absent, H = holiday, NA = not applicable</p>
          </div>
          <select 
            className="border border-border bg-background rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={activeCourse}
            onChange={e => {
              if(!filterCourse) setSelectedCourse(e.target.value);
            }}
            disabled={!!filterCourse}
          >
            {Object.keys(student.matrix).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border/50">
                <th className="py-2 pr-4 text-muted-foreground font-semibold uppercase text-xs">Roll</th>
                <th className="py-2 px-2 text-muted-foreground font-semibold uppercase text-xs">Month</th>
                {DAY_COLS.map(d => (
                  <th key={d} className="py-2 px-1 text-muted-foreground font-semibold uppercase text-[10px] text-center w-6">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthsToRender.map(m => (
                <tr key={m} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 pr-4 font-bold text-foreground">{student.roll}</td>
                  <td className="py-3 px-2 whitespace-nowrap text-muted-foreground">{m}</td>
                  {student.matrix[activeCourse]?.[m]?.map((v: string, i: number) => {
                    const bg = v==='1'?'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' : v==='0'?'bg-rose-500/15 text-rose-700 dark:text-rose-400' : v==='H'?'bg-violet-500/15 text-violet-700 dark:text-violet-400' : 'bg-muted text-muted-foreground';
                    return (
                      <td key={i} className="py-3 px-1 text-center">
                        <span className={`inline-flex items-center justify-center w-[26px] h-[22px] rounded font-bold text-[11px] ${bg}`}>{v}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


export default function AdminStudents() {
  const { students: rawStudents, fetchStudents, deleteStudent } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [detailedStudentId, setDetailedStudentId] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Merge backend data with mock matrix and monthly data
  const students = React.useMemo(() => {
    return rawStudents.map((s: Student, i: number) => {
      const seed = 80 + (i % 15);
      return {
        ...s,
        monthly: makeMonthly(seed),
        matrix: makeMatrix(seed),
      };
    });
  }, [rawStudents]);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const confirmDelete = () => {
    if (!studentToDelete) return;
    deleteStudent(studentToDelete.id);
    useAppStore.getState().addNotification({
      title: 'Student Removed',
      message: `Student ${studentToDelete.name} has been permanently removed.`,
      type: 'error'
    });
    setStudentToDelete(null);
  };

  const filteredStudents = mockStudents.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.roll.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const detailedStudent = mockStudents.find(s => s.id === detailedStudentId);

  if (detailedStudent) {
    return (
      <DashboardLayout role="admin">
        <DetailView student={detailedStudent} onBack={() => setDetailedStudentId(null)} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-semibold mb-3 border border-blue-500/20">
              <Users size={14} /> Student Directory
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Student Management</h1>
            <p className="text-muted-foreground mt-1">Manage enrollments, biometric profiles, and view attendance history.</p>
          </div>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-xl bg-card border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2">
              <Filter size={16} /> Filters
            </button>
            <button className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-all shadow-lg shadow-emerald-500/20">
              + Add Student
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Enrolled" value={mockStudents.length.toString()} />
          <StatCard title="Biometrics Captured" value={mockStudents.filter(s=>s.faceEnrolled).length.toString()} trend="95%" />
          <StatCard title="Low Attendance" value="2" alert />
          <StatCard title="Pending Review" value="0" />
        </div>

        {/* Main Table Card */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/20">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text" 
                placeholder="Search by name, roll number, or ID..." 
                className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Student Info</th>
                  <th className="px-6 py-4 font-medium">Roll No</th>
                  <th className="px-6 py-4 font-medium">Section</th>
                  <th className="px-6 py-4 font-medium">Biometric</th>
                  <th className="px-6 py-4 font-medium">Attendance</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredStudents.map((student) => (
                  <React.Fragment key={student.id}>
                    <tr 
                      className={`hover:bg-muted/30 transition-colors group cursor-pointer ${expandedStudentId === student.id ? 'bg-muted/10 dark:bg-slate-800/50' : ''}`}
                      onClick={() => setExpandedStudentId(expandedStudentId === student.id ? null : student.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full text-emerald-700 flex items-center justify-center font-bold"
                            style={{ backgroundColor: student.color + '20' }} // adding transparency for light background
                          >
                            {initials(student.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground group-hover:text-emerald-500 transition-colors">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.regNo || student.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">{student.roll}</td>
                      <td className="px-6 py-4 text-muted-foreground">{student.course}</td>
                      <td className="px-6 py-4">
                        {student.faceEnrolled ? (
                          <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-medium bg-emerald-500/10 w-fit px-2.5 py-1 rounded-full">
                            <Fingerprint size={14} /> Registered
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-500 text-xs font-medium bg-amber-500/10 w-fit px-2.5 py-1 rounded-full">
                            <AlertCircle size={14} /> Missing
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${student.attendance < 75 ? 'bg-destructive' : 'bg-emerald-500'}`} 
                              style={{ width: `${student.attendance}%` }} 
                            />
                          </div>
                          <span className={`font-semibold ${student.attendance < 75 ? 'text-destructive' : 'text-foreground'}`}>
                            {student.attendance}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          student.status === 'ACTIVE' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-muted text-muted-foreground hover:text-emerald-500 rounded-lg transition-colors" onClick={(e) => { e.stopPropagation(); setDetailedStudentId(student.id); }}><Eye size={16} /></button>
                          <button className="p-2 hover:bg-muted text-muted-foreground hover:text-blue-500 rounded-lg transition-colors" onClick={(e) => e.stopPropagation()}><Edit size={16} /></button>
                          <button className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors" onClick={(e) => { e.stopPropagation(); setStudentToDelete(student); }}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expandable Mini Summary Row */}
                    {expandedStudentId === student.id && (
                      <tr className="bg-slate-50 dark:bg-[#12141A] border-b border-border/50 shadow-inner">
                        <td colSpan={7} className="px-6 py-8">
                          <div className="flex items-center gap-8 pl-10 overflow-x-auto">
                            {MONTHS_LATEST_FIRST.slice(1, 6).map(m => ( // Showing 5 months for the mini summary
                              <MiniDonut key={m} present={student.monthly[m].present} monthLabel={m} />
                            ))}
                            
                            <div className="ml-8 flex flex-col items-center justify-center pt-2">
                              <button 
                                onClick={() => setDetailedStudentId(student.id)}
                                className="w-12 h-12 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-1 mb-3 group"
                              >
                                <ArrowUp className="rotate-45 group-hover:scale-110 transition-transform" size={20} />
                              </button>
                              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">View More</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="p-4 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground">
            <div>Showing 1 to {filteredStudents.length} entries</div>
            <div className="flex gap-1">
              <button className="px-3 py-1 rounded border border-border hover:bg-muted disabled:opacity-50">Prev</button>
              <button className="px-3 py-1 rounded bg-emerald-500 text-white">1</button>
              <button className="px-3 py-1 rounded border border-border hover:bg-muted">Next</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation */}
      <ConfirmDeleteModal
        isOpen={!!studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={confirmDelete}
        itemName={studentToDelete?.name}
        itemType="Student"
      />
    </DashboardLayout>
  );
}

function StatCard({ title, value, trend, alert }: any) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
      <h3 className="text-muted-foreground font-medium text-sm mb-2">{title}</h3>
      <div className="flex items-end justify-between">
        <div className={`text-3xl font-bold tracking-tight ${alert ? 'text-destructive' : 'text-foreground'}`}>
          {value}
        </div>
        {trend && <span className="text-emerald-500 text-sm font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">{trend}</span>}
      </div>
    </div>
  );
}
