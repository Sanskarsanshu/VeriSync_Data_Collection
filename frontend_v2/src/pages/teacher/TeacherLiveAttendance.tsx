import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Users, QrCode, Mail, UserCheck, XCircle, Clock, ShieldCheck, Camera } from 'lucide-react';

export default function TeacherLiveAttendance() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const sessionId = searchParams.get('sessionId');
  const method = searchParams.get('method');
  const initialOtp = searchParams.get('otp');

  const [presentCount, setPresentCount] = useState(0);
  const [records, setRecords] = useState<any[]>([]);
  const [countdown, setCountdown] = useState(30);

  // Poll for live stats
  useEffect(() => {
    if (!sessionId) return;
    
    const fetchStats = async () => {
      try {
        const token = sessionStorage.getItem('verisync_token');
        const res = await fetch('http://localhost:3001/attendance/live-stats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ sessionId })
        });
        const data = await res.json();
        if (data.success) {
          setPresentCount(data.presentCount);
          setRecords(data.records);
        }
      } catch (err) {
        console.error('Failed to fetch live stats', err);
      }
    };

    fetchStats(); // initial fetch
    const interval = setInterval(fetchStats, 3000); // poll every 3s
    return () => clearInterval(interval);
  }, [sessionId]);

  // Dynamic QR countdown
  useEffect(() => {
    if (method !== 'DYNAMIC_QR') return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) return 30; // reset
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [method]);

  if (!sessionId) {
    return (
      <DashboardLayout role="teacher">
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <XCircle size={48} className="text-red-500 mb-4" />
          <h2 className="text-2xl font-bold">Invalid Session</h2>
          <Button onClick={() => navigate('/teacher/attendance/start')} className="mt-4">Go Back</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="teacher">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              Live Attendance Session
            </h1>
            <p className="text-muted-foreground mt-1 text-sm font-medium">Session ID: {sessionId}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-1">Present</p>
              <div className="text-3xl font-bold text-emerald-500">{presentCount}</div>
            </div>
            <Button variant="destructive" onClick={() => navigate('/teacher/attendance/records')}>
              End Session
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Verification Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden h-full flex flex-col items-center justify-center p-12 text-center relative">
              
              {method === 'DYNAMIC_QR' && (
                <div className="space-y-6 flex flex-col items-center">
                  <div className="bg-white p-6 rounded-3xl shadow-md border-4 border-emerald-500/20">
                    {/* Placeholder for real QR code */}
                    <QrCode size={250} className="text-slate-900" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Scan with Student App</h2>
                  <div className="flex items-center gap-2 text-orange-500 bg-orange-500/10 px-4 py-2 rounded-full font-bold">
                    <Clock size={20} />
                    Refreshes in {countdown}s
                  </div>
                </div>
              )}

              {method === 'STATIC_QR' && (
                <div className="space-y-6 flex flex-col items-center">
                  <div className="p-8 bg-blue-500/10 text-blue-500 rounded-full animate-pulse">
                    <QrCode size={120} />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Teacher QR Scanner Active</h2>
                  <p className="text-muted-foreground max-w-sm">Please present your student ID QR code to the camera one by one.</p>
                </div>
              )}

              {method === 'OTP' && (
                <div className="space-y-8 flex flex-col items-center w-full max-w-md">
                  <div className="p-6 bg-indigo-500/10 text-indigo-500 rounded-full">
                    <Mail size={80} />
                  </div>
                  <div className="w-full">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Session OTP Code</p>
                    <div className="text-6xl font-black tracking-[0.25em] text-foreground bg-secondary/50 py-6 rounded-2xl border border-border shadow-inner">
                      {initialOtp}
                    </div>
                  </div>
                  <p className="text-muted-foreground">Students must enter this code in their VeriSync portal. It has also been emailed to registered students.</p>
                </div>
              )}

              {method === 'FACE' && (
                <div className="space-y-6 flex flex-col items-center">
                  <div className="relative w-full max-w-sm aspect-video bg-black rounded-2xl overflow-hidden border-4 border-emerald-500/20 shadow-xl flex items-center justify-center">
                    <Camera size={64} className="text-white/20 absolute" />
                    {/* Placeholder for video feed */}
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent pointer-events-none" />
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs px-2 py-1 rounded font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> LIVE
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Face Verification Active</h2>
                  <p className="text-muted-foreground max-w-sm">Please look directly into the camera one by one for attendance.</p>
                </div>
              )}

              {method === 'MANUAL' && (
                <div className="space-y-6 flex flex-col items-center">
                  <div className="p-8 bg-slate-500/10 text-slate-500 rounded-full">
                    <UserCheck size={100} />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Manual Roll Call Active</h2>
                  <p className="text-muted-foreground max-w-sm">Use the roster to manually mark students as present or absent.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Log */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden h-[600px] flex flex-col">
              <div className="p-6 border-b border-border bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                    <ShieldCheck size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Live Log</h2>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {records.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                    <Users size={48} className="opacity-20" />
                    <p className="text-sm">Waiting for students...</p>
                  </div>
                ) : (
                  records.map((r, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-background border border-border shadow-sm animate-in slide-in-from-right-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
                        {r.name.charAt(0)}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-bold text-sm text-foreground truncate">{r.name}</h4>
                        <p className="text-xs text-muted-foreground">{r.rollNumber}</p>
                      </div>
                      <div className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                        {new Date(r.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}