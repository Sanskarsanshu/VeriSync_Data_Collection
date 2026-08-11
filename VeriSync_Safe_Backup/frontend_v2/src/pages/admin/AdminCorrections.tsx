import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  FileEdit, Search, CheckCircle2, XCircle, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const mockCorrections = [
  { id: 'REQ-001', student: 'Rohan Gupta', subject: 'MCA301', date: '2026-08-01', reason: 'Medical Emergency', status: 'PENDING' },
  { id: 'REQ-002', student: 'Vikram Malhotra', subject: 'MCA302', date: '2026-08-01', reason: 'Biometric System Failure', status: 'PENDING' },
];

export default function AdminCorrections() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCorrections = mockCorrections.filter(c => 
    c.student.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-semibold mb-3 border border-amber-500/20">
              <FileEdit size={14} /> Workflow
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Correction Requests</h1>
            <p className="text-muted-foreground mt-1">Review and approve manual attendance override requests.</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col mt-6">
          <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/20">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text" 
                placeholder="Search requests..." 
                className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Request ID</th>
                  <th className="px-6 py-4 font-medium">Student</th>
                  <th className="px-6 py-4 font-medium">Course & Date</th>
                  <th className="px-6 py-4 font-medium">Reason Provided</th>
                  <th className="px-6 py-4 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredCorrections.map((req) => (
                  <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold">{req.id}</td>
                    <td className="px-6 py-4 font-semibold text-foreground">{req.student}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{req.subject}</p>
                      <p className="text-xs text-muted-foreground">{req.date}</p>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground max-w-xs truncate" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 shadow-sm px-3 h-8 text-xs gap-1">
                          <CheckCircle2 size={14} /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10 px-3 h-8 text-xs gap-1">
                          <XCircle size={14} /> Deny
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCorrections.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <CheckCircle2 size={32} className="text-emerald-500 mb-2 opacity-50" />
                        <p>No pending correction requests!</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
