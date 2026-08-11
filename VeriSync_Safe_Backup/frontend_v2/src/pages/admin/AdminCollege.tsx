import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Building, Settings2, Save, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';

export default function AdminCollege() {
  const { addNotification } = useAppStore();

  const handleSave = () => {
    addNotification({
      title: 'Configuration Saved',
      message: 'College and session setup have been successfully updated.',
      type: 'success'
    });
  };

  return (
    <DashboardLayout role="admin">
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-semibold mb-3 border border-indigo-500/20">
              <Building size={14} /> Institution
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">College & Session Setup</h1>
            <p className="text-muted-foreground mt-1">Configure global institutional settings and current academic year.</p>
          </div>
          
          <Button 
            onClick={handleSave}
            className="bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 gap-2"
          >
            <Save size={16} /> Save Configurations
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-6">
          
          {/* Institutional Details */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
              <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
                <Building size={20} />
              </div>
              <h2 className="text-lg font-bold">Institutional Profile</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Institution Name</Label>
                <Input defaultValue="Patna Women's College" className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label>Institution Code</Label>
                <Input defaultValue="PWC" className="bg-background/50 font-mono" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input defaultValue="Bailey Rd, Patna, Bihar 800001" className="bg-background/50 pl-9" />
                </div>
              </div>
            </div>
          </div>

          {/* Academic Session */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full -z-10" />
            <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
              <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
                <Settings2 size={20} />
              </div>
              <h2 className="text-lg font-bold">Active Academic Session</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Current Session Year</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option>2025 - 2026</option>
                  <option selected>2026 - 2027</option>
                  <option>2027 - 2028</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Current Semester/Term</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option>Odd Semester (I, III, V)</option>
                  <option>Even Semester (II, IV, VI)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Session Start Date</Label>
                <Input type="date" defaultValue="2026-07-01" className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label>Session End Date</Label>
                <Input type="date" defaultValue="2026-11-15" className="bg-background/50" />
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
}
