import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Search, Book, Plus, Edit, Trash2, Library, BookOpen, Calendar, Info, Filter
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useDataStore, Subject } from '@/store/useDataStore';
import { useAppStore } from '@/store/useAppStore';

export default function AdminSubjects() {
  const { subjects, addSubject, updateSubject, deleteSubject } = useDataStore();
  // Load from localStorage to persist data


  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterSemester, setFilterSemester] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCode, setEditingCode] = useState<string | null>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const { addNotification } = useAppStore();

  const [formData, setFormData] = useState({
    name: '', code: '', semester: 'I', category: 'Core', credits: 4, weeklyClasses: 4, type: 'THEORY'
  });

  const filteredSubjects = subjects.filter(sub => 
    (sub.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     sub.code.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterSemester === '' || sub.semester === filterSemester)
  );

  const openAddModal = () => {
    setFormData({ name: '', code: '', semester: 'I', category: 'Core', credits: 4, weeklyClasses: 4, type: 'THEORY' });
    setIsEditMode(false);
    setEditingCode(null);
    setIsModalOpen(true);
  };

  const openEditModal = (sub: Subject, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData({
      name: sub.name, code: sub.code, semester: sub.semester, category: sub.category, credits: sub.credits, weeklyClasses: sub.weeklyClasses, type: sub.type
    });
    setIsEditMode(true);
    setEditingCode(sub.code);
    setIsModalOpen(true);
  };

  const handleSaveSubject = () => {
    if (!formData.name || !formData.code) {
      addNotification({ title: 'Validation Error', message: 'Subject name and code are required.', type: 'warning' });
      return;
    }

    if (isEditMode && editingCode) {
      updateSubject(editingCode, formData as Subject);
      addNotification({
        title: 'Subject Updated',
        message: `${formData.name} (${formData.code}) has been updated successfully.`,
        type: 'info'
      });
    } else {
      const newSubject: Subject = {
        ...formData,
        dept: 'MCA',
        status: 'ACTIVE',
        createdAt: new Date().toISOString().split('T')[0],
        endDate: '2026-05-30',
      };
      addSubject(newSubject);
      addNotification({
        title: 'Subject Added',
        message: `${newSubject.name} (${newSubject.code}) has been created successfully.`,
        type: 'success'
      });
    }
    
    setIsModalOpen(false);
  };

  const handleDelete = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSubject(code);
    addNotification({
      title: 'Subject Deleted',
      message: `Subject ${code} has been permanently removed.`,
      type: 'error'
    });
    if (selectedSubject?.code === code) setIsDetailsModalOpen(false);
  };

  return (
    <DashboardLayout role="admin">
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-semibold mb-3 border border-orange-500/20">
              <Library size={14} /> Curriculum
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Subject Management</h1>
            <p className="text-muted-foreground mt-1">Define courses, credits, and academic syllabus elements.</p>
          </div>
          
          <div className="flex gap-3 relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-4 py-2 rounded-xl bg-card border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2"
            >
              <Filter size={16} /> Filters
            </button>
            <button 
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
            >
              <Plus size={16} /> New Subject
            </button>
            
            {isFilterOpen && (
              <div className="absolute top-full mt-2 right-[140px] bg-card border border-border rounded-xl shadow-lg p-4 z-10 min-w-[200px] animate-in fade-in slide-in-from-top-2">
                <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Filter by Semester</label>
                <select
                  value={filterSemester}
                  onChange={e => setFilterSemester(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
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

        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col mt-6">
          <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/20">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text" 
                placeholder="Search subjects by code or name..." 
                className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Subject Name</th>
                  <th className="px-6 py-4 font-medium">Code</th>
                  <th className="px-6 py-4 font-medium">Credits</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Department</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredSubjects.map((sub) => (
                  <tr 
                    key={sub.code} 
                    className="hover:bg-muted/30 transition-colors group cursor-pointer"
                    onClick={() => { setSelectedSubject(sub); setIsDetailsModalOpen(true); }}
                  >
                    <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${sub.type === 'PRACTICAL' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'}`}>
                        <BookOpen size={16} />
                      </div>
                      {sub.name}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-xs">{sub.code}</td>
                    <td className="px-6 py-4 font-medium">{sub.credits}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block whitespace-nowrap px-2 py-1 rounded text-xs font-semibold border ${
                        sub.type.toLowerCase().includes('practical') ? 'border-blue-500/30 text-blue-500 bg-blue-500/5' : 'border-border text-muted-foreground bg-muted/50'
                      }`}>
                        {sub.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{sub.category}</td>
                    <td className="px-6 py-4 text-muted-foreground">{sub.dept}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => openEditModal(sub, e)}
                          className="p-2 hover:bg-muted text-muted-foreground hover:text-blue-500 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(sub.code, e)}
                          className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Subject Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? "Edit Subject" : "Add Subject"}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subject Name</Label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Data Structures" />
              </div>
              <div className="space-y-2">
                <Label>Subject Code</Label>
                <Input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="e.g. MCA101" disabled={isEditMode} />
              </div>
              <div className="space-y-2">
                <Label>Semester</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})}
                >
                  <option>I</option><option>II</option><option>III</option><option>IV</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option>Core</option><option>Elective</option><option>Laboratory</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Format (Type)</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option>THEORY</option><option>PRACTICAL</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="space-y-2">
                <Label>Credits</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setFormData({...formData, credits: Math.max(1, formData.credits - 1)})}>-</Button>
                  <Input type="number" className="text-center w-full" value={formData.credits} onChange={e => setFormData({...formData, credits: parseInt(e.target.value) || 0})} />
                  <Button variant="outline" size="icon" onClick={() => setFormData({...formData, credits: formData.credits + 1})}>+</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Weekly Classes</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setFormData({...formData, weeklyClasses: Math.max(1, formData.weeklyClasses - 1)})}>-</Button>
                  <Input type="number" className="text-center w-full" value={formData.weeklyClasses} onChange={e => setFormData({...formData, weeklyClasses: parseInt(e.target.value) || 0})} />
                  <Button variant="outline" size="icon" onClick={() => setFormData({...formData, weeklyClasses: formData.weeklyClasses + 1})}>+</Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSaveSubject}>
                {isEditMode ? 'Save Changes' : 'Save Subject'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Subject Details Modal */}
        {selectedSubject && (
          <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="Subject Details">
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-muted/20 rounded-xl border border-border">
                <div className={`p-3 rounded-xl ${selectedSubject.type === 'PRACTICAL' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'}`}>
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedSubject.name}</h3>
                  <p className="text-muted-foreground font-mono">{selectedSubject.code}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs flex items-center gap-1"><Info size={12}/> Category</span>
                  <p className="font-semibold">{selectedSubject.category}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs flex items-center gap-1"><Info size={12}/> Type</span>
                  <p className="font-semibold">{selectedSubject.type}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs flex items-center gap-1"><Info size={12}/> Semester</span>
                  <p className="font-semibold">Semester {selectedSubject.semester}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs flex items-center gap-1"><Info size={12}/> Credits & Classes</span>
                  <p className="font-semibold">{selectedSubject.credits} Credits, {selectedSubject.weeklyClasses} hrs/wk</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs flex items-center gap-1"><Calendar size={12}/> Created On</span>
                  <p className="font-semibold">{selectedSubject.createdAt}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs flex items-center gap-1"><Calendar size={12}/> Ends On</span>
                  <p className="font-semibold">{selectedSubject.endDate}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
                <Button variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={(e) => handleDelete(selectedSubject.code, e as any)}>
                  Delete Subject
                </Button>
                <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>Close</Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
}
