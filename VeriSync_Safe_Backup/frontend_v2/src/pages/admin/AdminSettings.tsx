import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Wrench, Bell, Globe, Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminSettings() {
  return (
    <DashboardLayout role="admin">
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-500/10 text-slate-500 text-xs font-semibold mb-3 border border-slate-500/20">
              <Wrench size={14} /> System
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Global Settings</h1>
            <p className="text-muted-foreground mt-1">Configure global application preferences and communication settings.</p>
          </div>
          <Button className="gap-2 rounded-xl">
            <Save size={16} /> Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
             <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
              <div className="p-2 bg-slate-500/10 text-slate-500 rounded-lg">
                <Bell size={20} />
              </div>
              <h2 className="text-lg font-bold">Email Communications</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 md:col-span-2">
                <Label>System 'From' Email</Label>
                <Input defaultValue="noreply@verisync.edu.in" className="bg-background/50" />
              </div>
              
              <div className="space-y-2 md:col-span-2 mt-4">
                <Label>Automated Alerts</Label>
                <div className="space-y-3 mt-2">
                   <label className="flex items-center gap-3 text-sm">
                     <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-emerald-500" />
                     Send daily attendance digest to teachers
                   </label>
                   <label className="flex items-center gap-3 text-sm">
                     <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-emerald-500" />
                     Send warning email to students below 75% attendance
                   </label>
                   <label className="flex items-center gap-3 text-sm">
                     <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-emerald-500" />
                     Email student upon attendance correction approval
                   </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
             <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
              <div className="p-2 bg-slate-500/10 text-slate-500 rounded-lg">
                <Globe size={20} />
              </div>
              <h2 className="text-lg font-bold">Localization</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Timezone</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option selected>Asia/Kolkata (IST)</option>
                  <option>UTC</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Date Format</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option selected>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
