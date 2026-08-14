import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Search, Filter, MoreVertical, Edit, Eye, Trash2, 
  GraduationCap, Mail, Phone, BookOpen, ShieldCheck, User, Info
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { teacherProfilesData } from '@/data/teacherProfiles';
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal';

import { useDataStore, Teacher } from '@/store/useDataStore';

export default function AdminTeachers() {
  const { teachers, addTeacher, updateTeacher, deleteTeacher, fetchTeachers } = useDataStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);


  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'ON LEAVE'>('ALL');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterSession, setFilterSession] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New states for the requested interaction
  const [selectedActionTeacher, setSelectedActionTeacher] = useState<Teacher | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

  const { addNotification } = useAppStore();

  const [formData, setFormData] = useState({
    name: '', id: '', email: '', phone: '', designation: 'Assistant Professor', dept: 'Computer Applications'
  });

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Convert 'INACTIVE' to match 'in active' if needed, but our status is uppercase ACTIVE / INACTIVE / ON LEAVE
    let currentStatus = t.status.toUpperCase();
    let targetStatus = filterStatus.toUpperCase();
    if (targetStatus === 'IN ACTIVE') targetStatus = 'INACTIVE';
    
    const matchesStatus = filterStatus === 'ALL' || currentStatus === targetStatus;

    let matchesSession = true;
    if (filterSession) {
      if (t.semesterSubjects && t.semesterSubjects[parseInt(filterSession)]) {
        matchesSession = true;
      } else {
        matchesSession = false;
      }
    }

    return matchesSearch && matchesStatus && matchesSession;
  });

  const openAddModal = () => {
    setFormData({ name: '', id: '', email: '', phone: '', designation: 'Assistant Professor', dept: 'Computer Applications' });
    setIsEditMode(false);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (t: Teacher, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData({
      name: t.name, id: t.id, email: t.email, phone: t.phone || '', designation: t.designation, dept: 'Computer Applications'
    });
    setIsEditMode(true);
    setEditingId(t.id);
    setIsModalOpen(true);
  };

  const handleSaveTeacher = async () => {
    if (!formData.name || !formData.id) {
      addNotification({ title: 'Validation Error', message: 'Full name and Employee ID are required.', type: 'warning' });
      return;
    }
    
    if (isEditMode && editingId) {
      updateTeacher(editingId, formData as Partial<Teacher>);
      addNotification({
        title: 'Teacher Updated',
        message: `${formData.name}'s profile has been updated.`,
        type: 'success'
      });
    } else {
      const newTeacher: Partial<Teacher> = {
        name: formData.name,
        employeeId: formData.id,
        email: formData.email || `${formData.name.split(' ')[0].toLowerCase()}.${formData.id.toLowerCase()}@pwc.in`,
        department: { id: 'd1', name: formData.dept, code: 'MCA' },
        designation: formData.designation,
        subjects: [],
        status: 'ACTIVE',
      };
      
      try {
        const created = await addTeacher(newTeacher as Teacher);
        addNotification({
          title: 'Teacher Added',
          message: (created as any)?.temporaryPassword
            ? `${newTeacher.name} added. Temporary password: ${(created as any).temporaryPassword}`
            : `${newTeacher.name} has been added to the faculty directory.`,
          type: 'success'
        });
      } catch (err: any) {
        let errorMsg = err?.message || `Could not add ${newTeacher.name}. Please check the server connection.`;
        // Strip out "API Error: " if present to make it cleaner
        errorMsg = errorMsg.replace('API Error: ', '');
        
        addNotification({
          title: 'Add Failed',
          message: errorMsg,
          type: 'error'
        });
      }
    }
    
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const teacher = teachers.find(t => t.id === id);
    if (teacher) setTeacherToDelete(teacher);
  };

  const confirmDelete = () => {
    if (!teacherToDelete) return;
    deleteTeacher(teacherToDelete.id);
    addNotification({
      title: 'Teacher Removed',
      message: `Employee ${teacherToDelete.name} has been permanently removed.`,
      type: 'error'
    });
    setTeacherToDelete(null);
  };

  return (
    <DashboardLayout role="admin">
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-500 text-xs font-semibold mb-3 border border-violet-500/20">
              <GraduationCap size={14} /> Faculty Directory
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Teacher Management</h1>
            <p className="text-muted-foreground mt-1">Manage teaching staff, assignments, and access privileges.</p>
          </div>
          
          <div className="flex gap-3 relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-[#121212] hover:bg-[#1A1A1A] text-slate-100 rounded-xl transition-all shadow-md border border-slate-800 font-medium"
            >
              <Filter size={16} /> Filters
            </button>
            <button 
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium transition-all shadow-lg shadow-violet-500/20"
            >
              + Add Teacher
            </button>

            {isFilterOpen && (
              <div className="absolute top-full mt-2 right-[120px] bg-[#121212] border border-slate-800 rounded-2xl p-6 z-20 flex gap-6 animate-in fade-in slide-in-from-top-2 shadow-xl min-w-[320px]">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-slate-100 font-serif font-bold text-sm text-center">Session</label>
                  <div className="relative">
                    <select 
                      value={filterSession} 
                      onChange={e => setFilterSession(e.target.value)}
                      className="w-full bg-[#18181B] border border-slate-700 text-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-slate-500 appearance-none"
                    >
                      <option value="">Select</option>
                      <option value="1">1st Year - I Sem</option>
                      <option value="2">1st Year - II Sem</option>
                      <option value="3">2nd Year - III Sem</option>
                      <option value="4">2nd Year - IV Sem</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">v</div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-slate-100 font-serif font-bold text-sm text-center">Status</label>
                  <div className="relative">
                    <select 
                      value={filterStatus} 
                      onChange={e => setFilterStatus(e.target.value as any)}
                      className="w-full bg-[#18181B] border border-slate-700 text-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-slate-500 appearance-none"
                    >
                      <option value="ALL">Select</option>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">in active</option>
                      <option value="ON LEAVE">On Leave</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">v</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Faculty" value={teachers.length.toString()} />
          <StatCard title="Active Today" value={teachers.filter(t => t.status === 'ACTIVE').length.toString()} trend="94%" />
          <StatCard title="On Leave" value={teachers.filter(t => t.status === 'ON LEAVE').length.toString()} />
          <StatCard title="Open Assignments" value="12" alert />
        </div>

        {/* Main Table Card */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/20">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text" 
                placeholder="Search by name, department, or ID..." 
                className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20"
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
                  <th className="px-6 py-4 font-medium">Faculty Info</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Department</th>
                  <th className="px-6 py-4 font-medium">Subjects Assigned</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground italic">
                      no data found
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((teacher) => {
                    const displaySubjects = filterSession && teacher.semesterSubjects 
                      ? (teacher.semesterSubjects[parseInt(filterSession)] || [])
                      : teacher.subjects;

                    return (
                      <tr 
                        key={teacher.id} 
                        className="hover:bg-muted/30 transition-colors group cursor-pointer"
                        onClick={() => setSelectedActionTeacher(teacher)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-violet-500/10 text-violet-500 flex items-center justify-center font-bold overflow-hidden border border-violet-500/20 shrink-0">
                              {(teacher.image || teacherProfilesData[teacher.id]?.image) ? (
                                <img src={teacher.image || teacherProfilesData[teacher.id]?.image} alt={teacher.name} className="w-full h-full object-cover" />
                              ) : (
                                teacher.name.charAt(0)
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground group-hover:text-violet-500 transition-colors">{teacher.name}</p>
                              <p className="text-xs text-muted-foreground">{teacher.designation} • {teacher.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Mail size={12} /> <span className="truncate max-w-[150px]">{teacher.email}</span>
                            </div>
                            {teacher.phone && (
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                                <Phone size={12} /> <span>{teacher.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium">{teacher.dept}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {displaySubjects.length > 0 ? displaySubjects.map(sub => (
                              <span key={sub} className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium border border-border/50">
                                {sub}
                              </span>
                            )) : <span className="text-muted-foreground text-xs italic">None</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            teacher.status === 'ACTIVE' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {teacher.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => openEditModal(teacher, e)}
                              className="p-2 hover:bg-muted text-muted-foreground hover:text-violet-500 rounded-lg transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={(e) => handleDelete(teacher.id, e)}
                              className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Selection Modal */}
        <Modal isOpen={!!selectedActionTeacher} onClose={() => setSelectedActionTeacher(null)} title="Select Action">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-foreground">{selectedActionTeacher?.name}</h3>
            <p className="text-sm text-muted-foreground">{selectedActionTeacher?.designation}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => {
                navigate(`/admin/teachers/${selectedActionTeacher?.id}`);
                setSelectedActionTeacher(null);
              }}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-border hover:border-violet-500 hover:bg-violet-500/5 transition-all group"
            >
              <div className="p-3 bg-violet-500/10 rounded-full group-hover:bg-violet-500/20 transition-colors">
                <User size={28} className="text-violet-500" />
              </div>
              <div className="text-center">
                <span className="font-semibold block text-foreground">View Profile</span>
                <span className="text-xs text-muted-foreground">Full detailed page</span>
              </div>
            </button>
            <button 
              onClick={() => {
                setIsQuickViewOpen(true);
                // Keep selectedActionTeacher set so quick view has data, 
                // but we might need to handle modal stacking. 
                // It's better to close this modal and open the next.
                // We'll manage this by keeping selectedActionTeacher but 
                // controlling visibility with isQuickViewOpen
              }}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-border hover:border-indigo-500 hover:bg-indigo-500/5 transition-all group"
            >
              <div className="p-3 bg-indigo-500/10 rounded-full group-hover:bg-indigo-500/20 transition-colors">
                <Eye size={28} className="text-indigo-500" />
              </div>
              <div className="text-center">
                <span className="font-semibold block text-foreground">View More</span>
                <span className="text-xs text-muted-foreground">Quick summary</span>
              </div>
            </button>
          </div>
        </Modal>

        {/* Quick View Modal */}
        {selectedActionTeacher && (
          <Modal isOpen={isQuickViewOpen} onClose={() => { setIsQuickViewOpen(false); setSelectedActionTeacher(null); }} title="Quick View">
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-border/50">
                <div className="w-16 h-16 rounded-full bg-violet-500/10 text-violet-500 flex items-center justify-center font-bold text-2xl shrink-0 overflow-hidden border border-violet-500/20">
                  {(selectedActionTeacher.image || teacherProfilesData[selectedActionTeacher.id]?.image) ? (
                    <img src={selectedActionTeacher.image || teacherProfilesData[selectedActionTeacher.id]?.image} alt={selectedActionTeacher.name} className="w-full h-full object-cover" />
                  ) : (
                    selectedActionTeacher.name.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedActionTeacher.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedActionTeacher.designation} • {selectedActionTeacher.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs flex items-center gap-1"><Info size={12}/> Department</span>
                  <p className="font-semibold">{selectedActionTeacher.dept}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs flex items-center gap-1"><ShieldCheck size={12}/> Status</span>
                  <p className="font-semibold">
                    <span className={`px-2 py-0.5 rounded text-xs ${selectedActionTeacher.status === 'ACTIVE' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {selectedActionTeacher.status}
                    </span>
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs flex items-center gap-1"><Mail size={12}/> Email</span>
                  <p className="font-semibold truncate pr-2">{selectedActionTeacher.email}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs flex items-center gap-1"><Phone size={12}/> Phone</span>
                  <p className="font-semibold">{selectedActionTeacher.phone || 'N/A'}</p>
                </div>
                <div className="col-span-2 space-y-1">
                  <span className="text-muted-foreground text-xs flex items-center gap-1"><BookOpen size={12}/> Assigned Subjects</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedActionTeacher.subjects.length > 0 ? selectedActionTeacher.subjects.map(sub => (
                      <span key={sub} className="px-2 py-1 rounded bg-muted text-xs font-medium border border-border">
                        {sub}
                      </span>
                    )) : <span className="text-muted-foreground italic text-xs">No subjects currently assigned</span>}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => { setIsQuickViewOpen(false); setSelectedActionTeacher(null); }}>Close</Button>
                <Button className="bg-violet-500 hover:bg-violet-600 text-white" onClick={() => navigate(`/admin/teachers/${selectedActionTeacher.id}`)}>
                  Go to Full Profile
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Add/Edit Teacher Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? "Edit Teacher" : "Add Teacher"}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input className="pl-9" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Dr. John Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Employee ID</Label>
                <Input value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} placeholder="e.g. FAC2024" disabled={isEditMode} />
              </div>
              <div className="space-y-2">
                <Label>Official email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input type="email" className="pl-9" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="email@college.edu" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input type="tel" className="pl-9" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 9876543210" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Designation</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})}
                >
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Professor">Professor</option>
                  <option value="Guest Faculty">Guest Faculty</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background text-muted-foreground"
                  value={formData.dept} disabled
                >
                  <option value="Computer Applications">Computer Applications</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button className="bg-violet-500 hover:bg-violet-600 text-white" onClick={handleSaveTeacher}>
                {isEditMode ? 'Save Changes' : 'Save Teacher'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation */}
        <ConfirmDeleteModal
          isOpen={!!teacherToDelete}
          onClose={() => setTeacherToDelete(null)}
          onConfirm={confirmDelete}
          itemName={teacherToDelete?.name}
          itemType="Teacher"
        />

      </div>
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
