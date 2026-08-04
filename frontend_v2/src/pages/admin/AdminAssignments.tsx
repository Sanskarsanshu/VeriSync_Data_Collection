import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  UserPlus, Search, Link as LinkIcon, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDataStore } from '@/store/useDataStore';
import { useAppStore } from '@/store/useAppStore';

export default function AdminAssignments() {
  const { teachers, subjects, updateTeacher } = useDataStore();
  const { addNotification } = useAppStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('');

  // Dynamically generate the active assignments table
  const activeAssignments = useMemo(() => {
    const assignments: any[] = [];
    teachers.forEach(teacher => {
      if (teacher.semesterSubjects) {
        Object.entries(teacher.semesterSubjects).forEach(([sem, subCodes]) => {
          subCodes.forEach(code => {
            const subjectDetails = subjects.find(s => s.code === code);
            if (subjectDetails) {
              assignments.push({
                id: `${teacher.id}-${code}`,
                teacherId: teacher.id,
                subjectCode: code,
                teacher: teacher.name,
                subject: `${code} - ${subjectDetails.name}`,
                section: `MCA Sem-${sem} (Section A)`,
              });
            }
          });
        });
      }
    });
    return assignments;
  }, [teachers, subjects]);

  const filteredAssignments = activeAssignments.filter(a => 
    a.teacher.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedSubject = subjects.find(s => s.code === selectedSubjectCode);
  const derivedSection = selectedSubject ? `MCA Sem-${selectedSubject.semester} (Section A)` : '';

  const handleAssignTeacher = () => {
    if (!selectedTeacherId || !selectedSubjectCode) {
      addNotification({ title: 'Validation Error', message: 'Please select both a faculty member and a subject.', type: 'warning' });
      return;
    }

    const teacher = teachers.find(t => t.id === selectedTeacherId);
    const subject = subjects.find(s => s.code === selectedSubjectCode);

    if (!teacher || !subject) return;

    const semester = parseInt(subject.semester);
    
    // Check if already assigned
    const currentSemSubjects = teacher.semesterSubjects?.[semester] || [];
    if (currentSemSubjects.includes(subject.code)) {
      addNotification({ title: 'Duplicate Assignment', message: `${teacher.name} is already assigned to ${subject.code}.`, type: 'error' });
      return;
    }

    const newSemesterSubjects = {
      ...teacher.semesterSubjects,
      [semester]: [...currentSemSubjects, subject.code]
    };

    const newSubjectsList = [...new Set([...teacher.subjects, subject.code])];

    updateTeacher(teacher.id, {
      semesterSubjects: newSemesterSubjects,
      subjects: newSubjectsList
    });

    addNotification({ title: 'Assignment Successful', message: `${subject.code} has been assigned to ${teacher.name}.`, type: 'success' });
    
    // Reset selections
    setSelectedTeacherId('');
    setSelectedSubjectCode('');
  };

  const handleDeleteAssignment = (teacherId: string, subjectCode: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    const subject = subjects.find(s => s.code === subjectCode);
    if (!teacher || !subject) return;

    const semester = parseInt(subject.semester);
    const currentSemSubjects = teacher.semesterSubjects?.[semester] || [];
    
    const updatedSemSubjects = currentSemSubjects.filter(c => c !== subjectCode);
    const newSemesterSubjects = {
      ...teacher.semesterSubjects,
      [semester]: updatedSemSubjects
    };
    
    // Also remove from the flat subjects array if it's there
    const newSubjectsList = teacher.subjects.filter(c => c !== subjectCode);

    updateTeacher(teacher.id, {
      semesterSubjects: newSemesterSubjects,
      subjects: newSubjectsList
    });

    addNotification({ title: 'Assignment Removed', message: `${subject.code} has been unassigned from ${teacher.name}.`, type: 'info' });
  };

  return (
    <DashboardLayout role="admin">
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-500 text-xs font-semibold mb-3 border border-pink-500/20">
              <UserPlus size={14} /> Course Allocation
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Teacher Assignments</h1>
            <p className="text-muted-foreground mt-1">Assign faculty members to specific subjects and sections.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          
          {/* Assignment Form */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <LinkIcon size={18} className="text-pink-500" /> New Assignment
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Faculty</label>
                <select 
                  value={selectedTeacherId}
                  onChange={e => setSelectedTeacherId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50"
                >
                  <option value="">-- Choose Faculty --</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.dept})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Subject</label>
                <select 
                  value={selectedSubjectCode}
                  onChange={e => setSelectedSubjectCode(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50"
                >
                  <option value="">-- Choose Subject --</option>
                  {subjects.map(s => (
                    <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Section</label>
                <input 
                  type="text" 
                  readOnly 
                  value={derivedSection} 
                  placeholder="Auto-inferred from Subject"
                  className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground focus-visible:outline-none cursor-not-allowed"
                />
              </div>
              
              <Button 
                onClick={handleAssignTeacher}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white mt-2"
              >
                Assign Teacher
              </Button>
            </div>
          </div>

          {/* Active Assignments List */}
          <div className="md:col-span-2 bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/20">
              <h3 className="font-semibold">Active Allocations</h3>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <input 
                  type="text" 
                  placeholder="Search assignments..." 
                  className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Teacher</th>
                    <th className="px-4 py-3 font-medium">Subject</th>
                    <th className="px-4 py-3 font-medium">Section</th>
                    <th className="px-4 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredAssignments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground italic">
                        No active allocations found.
                      </td>
                    </tr>
                  ) : (
                    filteredAssignments.map((assignment) => (
                      <tr key={assignment.id} className="hover:bg-muted/30 transition-colors group">
                        <td className="px-4 py-3 font-semibold text-foreground">{assignment.teacher}</td>
                        <td className="px-4 py-3 text-muted-foreground">{assignment.subject}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded bg-muted text-xs border border-border/50">
                            {assignment.section}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => handleDeleteAssignment(assignment.teacherId, assignment.subjectCode)}
                            className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-md transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove Assignment"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
}
