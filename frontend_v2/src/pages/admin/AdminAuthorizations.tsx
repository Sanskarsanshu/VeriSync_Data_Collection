import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Key, Shield, AlertTriangle
} from 'lucide-react';

const mockAuthorizations = [
  { id: 'AUTH1', teacher: 'Praveen Kumar', type: 'OVERRIDE_ATTENDANCE', status: 'GRANTED', expires: '2026-11-15' },
  { id: 'AUTH2', teacher: 'Richa Verma', type: 'MODIFY_SYLLABUS', status: 'GRANTED', expires: '2026-11-15' },
];

export default function AdminAuthorizations() {
  return (
    <DashboardLayout role="admin">
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
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
                {mockAuthorizations.map((auth) => (
                  <tr key={auth.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Shield size={14} className="text-muted-foreground" />
                      </div>
                      {auth.teacher}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded border border-border/50">
                        {auth.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">{auth.expires}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                        {auth.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-semibold text-red-500 hover:underline">Revoke</button>
                    </td>
                  </tr>
                ))}
                
                {/* Empty state add row */}
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-dashed border-border rounded-xl px-4 py-3 w-full hover:bg-muted/50">
                      + Grant New Authorization
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
