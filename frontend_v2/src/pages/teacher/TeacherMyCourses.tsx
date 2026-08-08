import React, { useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useDataStore } from '@/store/useDataStore';
import { useAppStore } from '@/store/useAppStore';
import { 
  Search, Filter, MonitorPlay, Users, BookOpen, Clock, Calendar, Eye, QrCode
} from 'lucide-react';

export default function TeacherMyCourses() {
  const { teachers, subjects, courseInstances } = useDataStore();
  const { user } = useAppStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterSemester, setFilterSemester] = useState('');

  // Find the current teacher based on logged in user
  const currentTeacher = useMemo(() => {
    if (!user) return teachers[0];
    const match = teachers.find(t => t.email.toLowerCase() === user.email?.toLowerCase());
    return match || teachers[0];
  }, [user, teachers]);

  // Extract active courses
  const activeCourses = useMemo(() => {
    if (!currentTeacher) return [];
    
    const myInstances = courseInstances.filter(ci => ci.teacherId === currentTeacher.id);

    return myInstances.map(ci => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      const nextClass = `${days[ci.subjectCode.length % 5]}, 10:00 AM`;

      return {
        id: ci.id,
        name: ci.displayName,
        code: ci.subjectCode,
        semester: ci.semester,
        section: `MCA Sem-${ci.semester} Sec-${ci.section}`,
        studentsCount: ci.expectedStudents,
        nextClass,
        status: 'ACTIVE',
        banner: ci.banner
      };
    });
  }, [currentTeacher, courseInstances]);

  const filteredCourses = activeCourses.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = filterSemester === '' || c.semester === filterSemester;
    return matchesSearch && matchesSemester;
  });

  return (
    <DashboardLayout role="teacher">
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-xs font-semibold mb-3 border border-cyan-500/20">
              <MonitorPlay size={14} /> Course Operations
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Active Courses</h1>
            <p className="text-muted-foreground mt-1">Manage your assigned courses, sections, and classroom progression.</p>
          </div>
          
          <div className="flex gap-3 relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-4 py-2 rounded-xl bg-card border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2"
            >
              <Filter size={16} /> Filters
            </button>

            {isFilterOpen && (
              <div className="absolute top-full mt-2 left-0 md:right-0 md:left-auto bg-card border border-border rounded-xl shadow-lg p-4 z-10 min-w-[200px] animate-in fade-in slide-in-from-top-2">
                <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Filter by Semester</label>
                <select
                  value={filterSemester}
                  onChange={e => setFilterSemester(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="">All Semesters</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 bg-card p-4 rounded-2xl border border-border shadow-sm">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredCourses.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border rounded-3xl shadow-sm mt-6">
             <div className="p-4 bg-muted rounded-full mb-4">
               <BookOpen className="h-8 w-8 text-muted-foreground" />
             </div>
             <h3 className="text-lg font-bold">No courses found</h3>
             <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1">Try adjusting your filters or search terms.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-cyan-500/50 transition-all group flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-cyan-500/10 text-cyan-500 rounded-xl group-hover:scale-110 transition-transform">
                    <BookOpen size={20} />
                  </div>
                  <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-[10px] font-bold tracking-wider">
                    {course.status}
                  </span>
                </div>
                
                <h3 className="font-bold text-foreground text-lg mb-1 leading-tight line-clamp-1">{course.code} - {course.name}</h3>
                <p className="text-xs font-mono text-muted-foreground mb-4">{course.id}</p>
                
                <div className="space-y-3 pt-4 border-t border-border/50 flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Users size={14}/> Section</span>
                    <span className="font-medium text-foreground">{course.section}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Calendar size={14}/> Next Class</span>
                    <span className="font-medium text-foreground">{course.nextClass}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Clock size={14}/> Students</span>
                    <span className="font-medium text-cyan-500">{course.studentsCount} Enrolled</span>
                  </div>
                </div>

                <div className="pt-4 flex gap-2 mt-2">
                  <button className="flex-1 py-2 text-xs font-semibold rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 flex items-center justify-center gap-1.5 transition-colors">
                    <Eye size={14} /> Details
                  </button>
                  <button className="flex-[1.5] py-2 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 flex items-center justify-center gap-1.5 transition-colors">
                    <QrCode size={14} /> Start Class
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
