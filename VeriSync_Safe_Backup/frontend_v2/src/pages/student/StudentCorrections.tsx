import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileEdit, Plus, CheckCircle2, XCircle, Clock } from 'lucide-react';

const MOCK_CORRECTIONS = [
  {
    id: 1,
    course: "Software Engineering",
    date: "Aug 05, 2026",
    reason: "Marked absent but I was present in the lab session.",
    status: "approved",
    teacherNote: "Verified with lab assistant. Attendance updated."
  },
  {
    id: 2,
    course: "Design & Analysis of Algorithms",
    date: "Aug 02, 2026",
    reason: "Camera did not recognize my face due to lighting.",
    status: "pending",
    teacherNote: null
  },
  {
    id: 3,
    course: "Advanced DBMS",
    date: "Jul 28, 2026",
    reason: "I was late due to heavy rain.",
    status: "rejected",
    teacherNote: "You arrived 45 minutes late. Absent stands."
  }
];

export default function StudentCorrections() {
  const [showModal, setShowModal] = useState(false);

  return (
    <DashboardLayout role="student">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 font-sans p-2 sm:p-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-student-500/10 flex items-center justify-center border border-student-500/20 shadow-inner">
                <FileEdit className="w-5 h-5 text-student-600 dark:text-student-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Correction Requests</h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              File disputes for incorrect attendance records and track their approval status.
            </p>
          </div>
          
          <Button 
            onClick={() => setShowModal(true)}
            className="rounded-xl bg-student-600 hover:bg-student-700 text-white shadow-lg shadow-student-500/20 transition-all font-semibold gap-2"
          >
            <Plus className="w-4 h-4" />
            New Request
          </Button>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {MOCK_CORRECTIONS.map((req) => (
            <Card key={req.id} className="border border-border shadow-sm rounded-2xl bg-card overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 flex flex-col sm:flex-row gap-6">
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-foreground">{req.course}</h3>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-muted text-muted-foreground border border-border/50">
                        {req.date}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">My Reason</p>
                      <p className="text-sm text-foreground bg-muted/30 p-3 rounded-xl border border-border/50">
                        "{req.reason}"
                      </p>
                    </div>

                    {req.teacherNote && (
                      <div className="space-y-1 mt-3">
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Faculty Response</p>
                        <p className="text-sm text-foreground bg-student-500/5 p-3 rounded-xl border border-student-500/20">
                          "{req.teacherNote}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="sm:w-48 flex flex-col items-end sm:border-l sm:border-border/50 sm:pl-6 justify-center">
                    {req.status === 'approved' && (
                      <div className="flex flex-col items-center sm:items-end text-emerald-500">
                        <CheckCircle2 className="w-8 h-8 mb-2" />
                        <span className="text-sm font-bold">Approved</span>
                      </div>
                    )}
                    {req.status === 'pending' && (
                      <div className="flex flex-col items-center sm:items-end text-amber-500">
                        <Clock className="w-8 h-8 mb-2" />
                        <span className="text-sm font-bold">Pending Review</span>
                      </div>
                    )}
                    {req.status === 'rejected' && (
                      <div className="flex flex-col items-center sm:items-end text-rose-500">
                        <XCircle className="w-8 h-8 mb-2" />
                        <span className="text-sm font-bold">Rejected</span>
                      </div>
                    )}
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}
