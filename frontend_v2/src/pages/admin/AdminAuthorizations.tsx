import React, { useState, useMemo, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useDataStore } from '@/store/useDataStore';
import { 
  Key, Shield, AlertTriangle, X, RefreshCw
} from 'lucide-react';

export default function AdminAuthorizations() {
  const { teachers, subjects, authorizations, addAuthorization, fetchTeachers, fetchSubjects } = useDataStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  useEffect(() => {
    fetchTeachers();
    fetchSubjects();
  }, [fetchTeachers, fetchSubjects]);

  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('4');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('');
  const [selectedSession, setSelectedSession] = useState('2025-2027');
  const [selectedSection, setSelectedSection] = useState('A');
  const [expiryDate, setExpiryDate] = useState('2026-08-31');

  const activeSubjects = useMemo(() => {
    return subjects.filter(s => s.status === 'ACTIVE' && s.semester === selectedSemester);
  }, [subjects, selectedSemester]);

  React.useEffect(() => {
    if (activeSubjects.length > 0) {
      setSelectedSubjectCode(activeSubjects[0].code);
    } else {
      setSelectedSubjectCode('');
    }
  }, [activeSubjects]);

  const handleRegenerate = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedCode(result);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = teachers.find(t => t.id === selectedTeacherId);
    if (!t || !selectedSubjectCode) return;
    if (!generatedCode) {
      alert('Generate an authorisation code first.');
      return;
    }
    
    addAuthorization({
      id: `AUTH_${Date.now()}`,
      code: generatedCode,
      teacherId: t.id,
      teacherName: t.name,
      subjectCode: selectedSubjectCode,
      session: selectedSession,
      semester: selectedSemester,
      section: selectedSection,
      expiry: expiryDate,
      status: 'UNUSED',
      type: 'COURSE_CREATION',
      createdAt: new Date().toISOString()
    });
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout role="admin">
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-semibold mb-3 border border-red-500/20">
              <Key size={14} /> Security
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Course Authorizations</h1>
            <p className="text-muted-foreground mt-1">Manage special permissions and overrides for course instructors.</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col mt-6">
          <div className="p-4 border-b border-border/50 bg-red-500/5 flex items-start gap-3">
            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <div>
              <h3 className="font-semibold text-red-500 text-sm">Privileged Access Warning</h3>
              <p className="text-xs text-muted-foreground mt-1">Granting authorizations allows teachers to bypass standard attendance rules (e.g. marking attendance outside geofence, editing past records). Grant these sparingly.</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Faculty Member</th>
                  <th className="px-6 py-4 font-medium">Permission Level</th>
                  <th className="px-6 py-4 font-medium">Expiration Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {authorizations.map((auth) => (
                  <tr key={auth.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Shield size={14} className="text-muted-foreground" />
                      </div>
                      {auth.teacherName}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded border border-border/50">
                        {auth.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">{auth.expiry}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${auth.status === 'USED' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {auth.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-xs font-bold mr-4 bg-muted px-2 py-1 rounded">{auth.code}</span>
                      <button className="text-xs font-semibold text-red-500 hover:underline">Revoke</button>
                    </td>
                  </tr>
                ))}
                
                {/* Empty state add row */}
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="text-sm font-medium text-muted-foreground hover:text-cyan-600 transition-colors border border-dashed border-border rounded-xl px-4 py-3 w-full hover:bg-cyan-500/5 hover:border-cyan-500/30"
                    >
                      + Grant New Authorization
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Grant New Authorization Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-border/50 bg-muted/20">
              <h2 className="text-lg font-bold text-foreground">Generate Course Authorisation</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:bg-background hover:text-foreground p-1 rounded-md transition-colors border border-transparent hover:border-border">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Teacher</label>
                <select 
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  value={selectedTeacherId}
                  onChange={e => setSelectedTeacherId(e.target.value)}
                >
                  {teachers.length === 0 && <option disabled value="">Loading teachers...</option>}
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} · {t.id}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Session</label>
                  <select 
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    value={selectedSession}
                    onChange={e => setSelectedSession(e.target.value)}
                  >
                    <option value="2025-2027">2025-2027</option>
                    <option value="2024-2026">2024-2026</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Semester</label>
                  <select 
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                  >
                    <option value="4">IV</option>
                    <option value="3">III</option>
                    <option value="2">II</option>
                    <option value="1">I</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Section</label>
                  <select 
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    value={selectedSection}
                    onChange={e => setSelectedSection(e.target.value)}
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Expiry</label>
                  <input 
                    type="date" 
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Assigned subject</label>
                <select 
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  value={selectedSubjectCode}
                  onChange={e => setSelectedSubjectCode(e.target.value)}
                >
                  {activeSubjects.length === 0 && <option disabled value="">No active subjects found</option>}
                  {activeSubjects.map((sub: any) => (
                    <option key={sub.code} value={sub.code}>{sub.name} · {sub.code}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-sm font-semibold text-foreground">Generated code</label>
                <div className="flex gap-2">
                  <input type="text" readOnly value={generatedCode} className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-foreground outline-none" />
                  <button type="button" onClick={handleRegenerate} className="px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-sm font-semibold transition-colors flex items-center gap-2">
                    <RefreshCw size={16} className="text-cyan-500" /> Regenerate
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-border/50 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-cyan-500 hover:bg-cyan-600 text-white shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02]">
                  Generate & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
