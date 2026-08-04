import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  ShieldAlert, Lock, Fingerprint, Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminSecurity() {
  return (
    <DashboardLayout role="admin">
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-semibold mb-3 border border-red-500/20">
              <ShieldAlert size={14} /> Security
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Security & Audit Log</h1>
            <p className="text-muted-foreground mt-1">Monitor system access, token rotation, and strict security policies.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
             <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
              <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                <Lock size={20} />
              </div>
              <h2 className="text-lg font-bold">Attendance Security Policies</h2>
            </div>
            
            <div className="space-y-4">
               <div className="flex items-center justify-between p-4 border border-border/50 rounded-xl bg-background/50">
                  <div>
                    <h4 className="font-semibold text-sm flex items-center gap-2"><Key size={14}/> Dynamic QR Token Rotation</h4>
                    <p className="text-xs text-muted-foreground mt-1">How often the QR code refreshes on the teacher's screen to prevent proxy sharing.</p>
                  </div>
                  <select className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm">
                    <option>Every 10 seconds</option>
                    <option selected>Every 15 seconds</option>
                    <option>Every 30 seconds</option>
                  </select>
               </div>
               
               <div className="flex items-center justify-between p-4 border border-border/50 rounded-xl bg-background/50">
                  <div>
                    <h4 className="font-semibold text-sm flex items-center gap-2"><Fingerprint size={14}/> Liveness Detection Strictness</h4>
                    <p className="text-xs text-muted-foreground mt-1">Confidence threshold required for the AI to accept a face verification attempt.</p>
                  </div>
                  <select className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm">
                    <option>Low (Faster)</option>
                    <option selected>Medium (Recommended)</option>
                    <option>High (Strict)</option>
                  </select>
               </div>
               
               <Button className="mt-4 bg-red-500 hover:bg-red-600 text-white">Save Security Policies</Button>
            </div>
          </div>
          
          {/* Audit Log Mock */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border/50 bg-muted/20">
              <h3 className="font-bold">Recent Audit Logs</h3>
            </div>
            <div className="p-6 text-center text-muted-foreground">
              <ShieldAlert size={32} className="mx-auto mb-3 opacity-20" />
              <p>Audit logging will be populated when the backend is connected.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
