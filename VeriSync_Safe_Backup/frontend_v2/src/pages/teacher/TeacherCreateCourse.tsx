import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useDataStore } from '@/store/useDataStore';
import { useAppStore } from '@/store/useAppStore';
import { 
  BookOpen, Users, Calendar as CalendarIcon, Layout, Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TeacherCreateCourse() {
  const navigate = useNavigate();
  const { user } = useAppStore();
  const { teachers, subjects, authorizations, addCourseInstance, markAuthorizationUsed } = useDataStore();
  
  // Find current teacher
  const currentTeacher = useMemo(() => {
    if (!teachers || teachers.length === 0) return null;
    if (!user) return teachers[0];
    return teachers.find(t => t.email.toLowerCase() === user.email?.toLowerCase()) || teachers[0];
  }, [user, teachers]);

  // Extract all assigned subjects for dropdown
  const assignedSubjects = useMemo(() => {
    if (!currentTeacher || !currentTeacher.semesterSubjects) return [];
    const subs: any[] = [];
    Object.values(currentTeacher.semesterSubjects).forEach(codes => {
      codes.forEach(code => {
        const sub = subjects.find(s => s.code === code);
        if (sub && !subs.find(s => s.code === code)) {
          subs.push(sub);
        }
      });
    });
    return subs;
  }, [currentTeacher, subjects]);

  // Form state
  const [formData, setFormData] = useState({
    session: '2024-2026',
    department: 'Computer Applications',
    year: 'Second Year',
    semester: '3',
    section: 'A',
    subjectCode: '',
    displayName: '',
    authCode: '',
    banner: 'Blue',
    expectedStudents: '60'
  });

  // Derived subject info
  const selectedSubject = useMemo(() => {
    return subjects.find(s => s.code === formData.subjectCode);
  }, [formData.subjectCode, subjects]);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const sub = subjects.find(s => s.code === code);
    setFormData(prev => ({
      ...prev,
      subjectCode: code,
      displayName: sub ? sub.name : ''
    }));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTeacher || !formData.subjectCode || !formData.authCode) return;

    // Validate the code
    const auth = authorizations.find(a => a.code === formData.authCode);

    if (!auth) {
      alert("Invalid authorisation code. Please check the code and try again.");
      return;
    }

    if (auth.status === 'USED') {
      alert("This authorisation code has already been used to create a course instance.");
      return;
    }

    if (auth.teacherId !== currentTeacher.id) {
      alert("This authorisation code is not registered to your account.");
      return;
    }

    if (auth.subjectCode !== formData.subjectCode) {
      alert(`This authorisation code is registered for a different subject (${auth.subjectCode}).`);
      return;
    }
    
    if (auth.session !== formData.session || auth.semester !== formData.semester || auth.section !== formData.section) {
      alert(`This authorisation code is registered for a different Session/Semester/Section combination.`);
      return;
    }

    // Success! Create course and burn code
    const courseId = `CRS-MCA-${formData.subjectCode}-${currentTeacher.id}-${formData.semester}-${formData.section}`;
    
    addCourseInstance({
      id: courseId,
      teacherId: currentTeacher.id,
      subjectCode: formData.subjectCode,
      displayName: formData.displayName || selectedSubject?.name || formData.subjectCode,
      session: formData.session,
      semester: formData.semester,
      section: formData.section,
      banner: formData.banner,
      expectedStudents: parseInt(formData.expectedStudents) || 60,
      createdAt: new Date().toISOString()
    });

    markAuthorizationUsed(auth.code);
    navigate('/teacher/academic/courses');
  };

  return (
    <DashboardLayout role="teacher">
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Course Instance</h1>
          <p className="text-muted-foreground mt-1">Initialize a new academic course using your assigned subjects.</p>
        </div>

        <form onSubmit={handleCreate} className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 items-start mt-6">
          
          {/* LEFT COLUMN - FORM */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border/50 bg-muted/20">
              <h2 className="text-lg font-bold text-foreground">Course information</h2>
              <p className="text-sm text-muted-foreground mt-1">Official values are filtered from admin data</p>
            </div>
            
            <div className="p-6 space-y-6 flex-1">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <CalendarIcon size={14} className="text-blue-500" /> Academic session
                  </label>
                  <select 
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    value={formData.session}
                    onChange={e => setFormData({...formData, session: e.target.value})}
                  >
                    <option value="2024-2026">2024-2026</option>
                    <option value="2025-2027">2025-2027</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Layout size={14} className="text-blue-500" /> Department
                  </label>
                  <select 
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    value={formData.department}
                    onChange={e => setFormData({...formData, department: e.target.value})}
                  >
                    <option value="Computer Applications">Computer Applications</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                  </select>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Users size={14} className="text-blue-500" /> Year
                  </label>
                  <select 
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    value={formData.year}
                    onChange={e => setFormData({...formData, year: e.target.value})}
                  >
                    <option value="First Year">First Year</option>
                    <option value="Second Year">Second Year</option>
                    <option value="Third Year">Third Year</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Layout size={14} className="text-blue-500" /> Semester
                  </label>
                  <select 
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    value={formData.semester}
                    onChange={e => setFormData({...formData, semester: e.target.value})}
                  >
                    <option value="1">I</option>
                    <option value="2">II</option>
                    <option value="3">III</option>
                    <option value="4">IV</option>
                    <option value="5">V</option>
                    <option value="6">VI</option>
                  </select>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Layout size={14} className="text-blue-500" /> Section
                  </label>
                  <select 
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    value={formData.section}
                    onChange={e => setFormData({...formData, section: e.target.value})}
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <BookOpen size={14} className="text-emerald-500" /> Assigned subject
                  </label>
                  <select 
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-foreground"
                    value={formData.subjectCode}
                    onChange={handleSubjectChange}
                  >
                    <option value="" disabled>Select a subject...</option>
                    {assignedSubjects.map((sub: any) => (
                      <option key={sub.code} value={sub.code}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4 - Auto filled read-only */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/20 p-4 rounded-xl border border-border/50">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Subject code</label>
                  <input 
                    type="text" 
                    readOnly
                    className="w-full bg-background/50 border border-border rounded-xl px-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed"
                    value={selectedSubject?.code || ''}
                    placeholder="Auto-filled"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Credits</label>
                  <input 
                    type="text" 
                    readOnly
                    className="w-full bg-background/50 border border-border rounded-xl px-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed"
                    value={selectedSubject?.credits || ''}
                    placeholder="Auto-filled"
                  />
                </div>
              </div>

              {/* Row 5 */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Course display name</label>
                <input 
                  type="text" 
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  value={formData.displayName}
                  onChange={e => setFormData({...formData, displayName: e.target.value})}
                  placeholder="Enter a custom display name (Optional)"
                />
              </div>

              {/* Row 6 */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Shield size={14} className="text-blue-500" /> Admin authorisation code
                </label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  value={formData.authCode}
                  onChange={e => setFormData({...formData, authCode: e.target.value})}
                  placeholder="Example: Wc7P2kLm9Q"
                />
                <p className="text-xs text-muted-foreground pt-1">The code is single-purpose and bound to your account, subject, session, semester and section.</p>
              </div>

              {/* Row 7 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Course banner</label>
                  <select 
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    value={formData.banner}
                    onChange={e => setFormData({...formData, banner: e.target.value})}
                  >
                    <option value="Blue">Blue Aurora</option>
                    <option value="Emerald">Emerald Glow</option>
                    <option value="Indigo">Indigo Wave</option>
                    <option value="Purple">Purple Twilight</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Expected students</label>
                  <input 
                    type="number" 
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    value={formData.expectedStudents}
                    onChange={e => setFormData({...formData, expectedStudents: e.target.value})}
                    placeholder="e.g. 60"
                  />
                </div>
              </div>

            </div>
            
            <div className="p-6 border-t border-border/50 bg-muted/10 mt-auto">
              <button 
                type="submit"
                disabled={!formData.subjectCode || !formData.authCode}
                className={cn(
                  "w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2",
                  (!formData.subjectCode || !formData.authCode) 
                    ? "bg-emerald-500/50 cursor-not-allowed opacity-70" 
                    : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-600/20 hover:scale-[1.01]"
                )}
              >
                Validate Code & Create Course
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN - VALIDATION & INFO */}
          <div className="flex flex-col gap-6">
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border/50 bg-muted/20">
                <h2 className="text-lg font-bold text-foreground">Creation validation</h2>
                <p className="text-sm text-muted-foreground mt-1">Every condition is checked before activation</p>
              </div>
              
              <div className="p-6 space-y-4">
                
                {/* Step 1 */}
                <div className="flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-background/50">
                  <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-sm border border-emerald-500/20">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Verified teacher account</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">{currentTeacher?.email || 'Loading...'}</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-background/50">
                  <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 font-bold text-sm border border-blue-500/20">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Admin subject assignment</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">Only assigned subjects appear.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-background/50">
                  <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-600 font-bold text-sm border border-cyan-500/20">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Secure code match</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">Teacher, subject, session and section must match.</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-background/50">
                  <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/10 text-purple-600 font-bold text-sm border border-purple-500/20">
                    4
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Single-use activation</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">Code becomes Used after successful creation.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Alert Box */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 shadow-sm">
              <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2">
                Demo code available
              </h4>
              <p className="text-sm text-amber-700/80 dark:text-amber-400/80 mt-1">
                Use the mock code <strong className="font-mono text-amber-900 dark:text-amber-300">Wc7P2kLm9Q</strong> for testing. (Requires Session: 2024-2026, Sem: I, Sec: A, Subject: CC102).
              </p>
            </div>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
}