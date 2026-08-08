import React, { useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useDataStore } from '@/store/useDataStore';
import { useAppStore } from '@/store/useAppStore';
import { Book, GraduationCap, Clock, FileText, MonitorPlay, BookOpen, Layers, Building, Tag } from 'lucide-react';
import { Modal } from '@/components/ui/modal';

export default function TeacherAssignedSubjects() {
  const { teachers, subjects } = useDataStore();
  const { user } = useAppStore();
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null);

  // Find the current teacher based on logged in user
  // If no user email matches, fallback to the first teacher for demo purposes
  const currentTeacher = useMemo(() => {
    if (!user) return teachers[0];
    const match = teachers.find(t => t.email.toLowerCase() === user.email?.toLowerCase());
    return match || teachers[0];
  }, [user, teachers]);

  // Group subjects by semester for this teacher
  const semesterGroups = useMemo(() => {
    if (!currentTeacher || !currentTeacher.semesterSubjects) return {};
    
    const groups: Record<number, any[]> = {};
    
    Object.entries(currentTeacher.semesterSubjects).forEach(([semStr, subjectCodes]) => {
      const sem = parseInt(semStr);
      groups[sem] = subjectCodes.map(code => {
        const sub = subjects.find(s => s.code === code);
        return sub || { code, name: 'Unknown Subject' };
      });
    });
    
    return groups;
  }, [currentTeacher, subjects]);

  const semesters = Object.keys(semesterGroups).map(Number).sort((a, b) => a - b);

  return (
    <DashboardLayout role="teacher">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-semibold mb-3 border border-blue-500/20">
              <BookOpen size={14} /> My Academic Portfolio
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Assigned Subjects</h1>
            <p className="text-muted-foreground mt-1">
              View your subject allocations for {currentTeacher?.name} across different semesters.
            </p>
          </div>
        </div>

        {semesters.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-card border border-border rounded-2xl shadow-sm">
            <div className="size-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Layers className="size-10 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-xl font-semibold">No Subjects Assigned</h3>
            <p className="text-muted-foreground mt-2 text-center max-w-md">
              You haven't been assigned any subjects for the current academic session. 
              Please contact the HOD or Administrator for course allocations.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {semesters.map((sem) => (
              <div key={sem} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-border/50 pb-2">
                  <div className="size-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <GraduationCap size={18} />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">Semester {sem}</h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-border/50 to-transparent ml-4" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {semesterGroups[sem].map((subject: any, idx) => (
                    <SubjectCard 
                      key={subject.code || idx} 
                      subject={subject} 
                      semester={sem} 
                      onClick={() => setSelectedSubject(subject)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selectedSubject}
        onClose={() => setSelectedSubject(null)}
        title="Subject Details"
        maxWidth="max-w-xl"
      >
        {selectedSubject && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-start gap-4">
              <div className={`p-4 rounded-2xl ${selectedSubject.type?.toLowerCase().includes('practical') ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}>
                {selectedSubject.type?.toLowerCase().includes('practical') ? <MonitorPlay size={32} /> : <Book size={32} />}
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight">{selectedSubject.name}</h3>
                <p className="text-muted-foreground font-medium">{selectedSubject.code}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-4 rounded-xl border border-border/50 flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5"><FileText size={14} /> Credits</span>
                <span className="text-lg font-semibold">{selectedSubject.credits || '-'} Cr</span>
              </div>
              <div className="bg-muted/30 p-4 rounded-xl border border-border/50 flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5"><Clock size={14} /> Weekly Classes</span>
                <span className="text-lg font-semibold">{selectedSubject.weeklyClasses || '-'} Classes</span>
              </div>
              <div className="bg-muted/30 p-4 rounded-xl border border-border/50 flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5"><Tag size={14} /> Type</span>
                <span className="text-lg font-semibold">{selectedSubject.type || 'Theory'}</span>
              </div>
              <div className="bg-muted/30 p-4 rounded-xl border border-border/50 flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5"><Layers size={14} /> Category</span>
                <span className="text-lg font-semibold">{selectedSubject.category || 'Core'}</span>
              </div>
              <div className="col-span-2 bg-muted/30 p-4 rounded-xl border border-border/50 flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5"><Building size={14} /> Department</span>
                <span className="text-lg font-semibold">{selectedSubject.dept || 'MCA'}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border/50 flex justify-end">
              <button
                onClick={() => setSelectedSubject(null)}
                className="px-6 py-2 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors shadow-sm"
              >
                Close Details
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}

function SubjectCard({ subject, semester, onClick }: { subject: any; semester: number; onClick: () => void }) {
  const isPractical = subject.type?.toLowerCase().includes('practical');
  
  return (
    <div 
      onClick={onClick}
      className="group bg-card border border-border hover:border-blue-500/30 rounded-2xl p-5 shadow-sm hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl ${isPractical ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}>
          {isPractical ? <MonitorPlay size={20} /> : <Book size={20} />}
        </div>
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-muted border border-border/50 text-muted-foreground group-hover:text-foreground transition-colors">
          {subject.code}
        </span>
      </div>
      
      <div className="flex-1">
        <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-blue-500 transition-colors">
          {subject.name}
        </h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-background border border-border/50 px-2 py-1 rounded-md">
            <span className="size-1.5 rounded-full bg-blue-500" />
            {subject.category || 'Core'}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-background border border-border/50 px-2 py-1 rounded-md">
            {subject.type || 'Theory'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50 mt-auto">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
            <FileText size={10} /> Credits
          </span>
          <span className="font-medium text-sm mt-0.5">{subject.credits || '-'} Cr</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
            <Clock size={10} /> Weekly
          </span>
          <span className="font-medium text-sm mt-0.5">{subject.weeklyClasses || '-'} Classes</span>
        </div>
      </div>
    </div>
  );
}